// ============================================================
// Supplementary sub-concepts for Spelling
// To merge: add these to lessonBank.spelling.subConcepts array in lessonData.js
// ============================================================

export const spellingSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: Homophones
  // ==========================================
  {
    id: "homophones",
    name: "Homophones — Same Sound, Different Spelling",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "homophones-steps",
        templateType: "step-by-step",
        learningGoal: ["How to choose the right homophone (a word that sounds the same but has a different meaning) — this one trips up loads of people!", "A quick meaning test that makes picking the correct spelling easy"],
        variableSets: [
          {
            name: "Aisha",
            scenario: "writing a story for English homework",
            wrongSentence: "Their going to the park after school.",
            wrongWord: "Their",
            correctWord: "They're",
            explanation: "'They're' is short for 'they are'. 'Their' means belonging to them.",
            meaningTest: "Can you replace the word with 'they are'? If yes, use they're.",
            testSentence: "The children packed ___ bags for the trip.",
            testAnswer: "their",
            testOptions: ["their", "they're", "there", "thier", "thair"],
            testExplain: "The bags belong to the children, so we need 'their' (belonging to them)."
          },
          {
            name: "Charlie",
            scenario: "sending a message to his friend",
            wrongSentence: "I new the answer straight away!",
            wrongWord: "new",
            correctWord: "knew",
            explanation: "'Knew' is the past tense of 'know'. 'New' means not old.",
            meaningTest: "Is the word about knowing something? If yes, use knew.",
            testSentence: "Ben got a ___ bicycle for his birthday.",
            testAnswer: "new",
            testOptions: ["new", "knew", "gnu", "nuw", "knuw"],
            testExplain: "The bicycle is brand new (not old), so we need 'new'."
          },
          {
            name: "Daisy",
            scenario: "checking her science worksheet",
            wrongSentence: "The dog wagged it's tail happily.",
            wrongWord: "it's",
            correctWord: "its",
            explanation: "'Its' means belonging to it. 'It's' is short for 'it is' or 'it has'.",
            meaningTest: "Can you replace the word with 'it is'? If yes, use it's. If not, use its.",
            testSentence: "___ raining outside today.",
            testAnswer: "It's",
            testOptions: ["It's", "Its", "Its'", "Itss", "Itz"],
            testExplain: "You can say 'It is raining', so we need 'It's' (short for it is)."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot the wrong word?`,
            body: (v) => `${v.name} is ${v.scenario} and wrote: **"${v.wrongSentence}"** Something looks wrong! Did you know that homophones are sneaky words that **sound the same** but have **different spellings and meanings**? Even adults get caught out by these!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [{ word: v.wrongWord, color: "#e74c3c" }],
                label: "Spot the mistake:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Use the meaning test",
            body: (v) => `The wrong word is **${v.wrongWord}**. It should be **${v.correctWord}**. ${v.explanation} Here's a handy test that'll help you get it right every time:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Read the sentence and find the homophone`, why: "Look for words that could be confused" },
                  { text: `Ask: what does the word MEAN here?`, why: v.meaningTest },
                  { text: `"${v.wrongWord}" → "${v.correctWord}"`, why: v.explanation },
                  { text: `Corrected: "${v.wrongSentence.replace(v.wrongWord, v.correctWord)}"`, why: "Now the meaning matches the spelling ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Read the sentence and find the homophone`,
                `Ask: what does the word MEAN here?`,
                `Pick the spelling that matches the meaning`
              ],
              feedback: {
                correct: (v) => `You've nailed it! Read, think about meaning, then pick the right spelling. ✓`,
                incorrect: (v) => `Nearly there — start by reading the sentence, then think about meaning.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Right, you've got this! Pick the word that fits the sentence.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "gap",
                text: v.testSentence,
                gapWord: "",
                gapHighlight: "blank",
                label: "Fill in the correct word:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word correctly completes: "${v.testSentence}"`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Homophone recipe",
            body: () => `You've learned the secret weapon! When you see a word that sounds like another word, use the **meaning test** to pick the right spelling. This trick works every single time.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Read the sentence carefully", why: "What does the word actually mean here?" },
                  { text: "their = belonging to them", why: "Their coats, their bags, their house" },
                  { text: "they're = they are", why: "They're going, they're happy" },
                  { text: "there = a place", why: "Over there, there is, there are" },
                  { text: "its = belonging to it / it's = it is", why: "Remember: the apostrophe means 'it is' ✓" }
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
        id: "homophones-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to spot homophone (same-sounding word) errors in writing — you'll become a mistake detective!", "How to use meaning to choose the right spelling every time"],
        variableSets: [
          {
            name: "Ella",
            scenario: "wrote a diary entry",
            sentence: "We went over their to play in the garden.",
            wrongWord: "their",
            correctWord: "there",
            mistakeExplain: "'Their' means belonging to them. Here we mean a place, so it should be 'there'.",
            testSentence: "___ the best friend I've ever had!",
            testWrong: "Your",
            testCorrect: "You're",
            testOptions: ["Your", "You're", "Yore", "Youre", "Yor"],
            testExplain: "'You're' is short for 'you are'. 'Your' means belonging to you."
          },
          {
            name: "Hassan",
            scenario: "wrote a letter to his pen pal",
            sentence: "I hope your coming to visit us soon.",
            wrongWord: "your",
            correctWord: "you're",
            mistakeExplain: "'Your' means belonging to you. Here we mean 'you are', so it should be 'you're'.",
            testSentence: "Do you ___ the answer to question five?",
            testWrong: "no",
            testCorrect: "know",
            testOptions: ["know", "no", "noe", "kno", "knoe"],
            testExplain: "'Know' means to understand something. 'No' is the opposite of yes."
          },
          {
            name: "Grace",
            scenario: "finished her book report",
            sentence: "The whether was lovely so we played outside.",
            wrongWord: "whether",
            correctWord: "weather",
            mistakeExplain: "'Whether' is used for choices (whether or not). Rain and sunshine is 'weather'.",
            testSentence: "I don't know ___ to have the cake or the biscuit.",
            testWrong: "weather",
            testCorrect: "whether",
            testOptions: ["whether", "weather", "wether", "wheather", "whethr"],
            testExplain: "'Whether' is for choices between options. 'Weather' is rain, sun and clouds."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} ${v.scenario} and wrote: **"${v.sentence}"** One of the homophones is wrong — can you be the detective and find it?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.wrongWord, color: "#e74c3c" }],
                label: "Spot the mistake:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the mistake",
            body: (v) => `${v.name} wrote **"${v.wrongWord}"** but it should be **"${v.correctWord}"**. Don't worry — this is one of the most common mix-ups! ${v.mistakeExplain}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.sentence}"`, why: `"${v.wrongWord}" is the wrong homophone` },
                  { text: `Think about the meaning`, why: v.mistakeExplain },
                  { text: `✓ "${v.sentence.replace(v.wrongWord, v.correctWord)}"`, why: "Now the spelling matches the meaning ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "their", right: "belonging to them" },
                { left: "there", right: "a place" },
                { left: "they're", right: "they are" },
                { left: "your", right: "belonging to you" },
                { left: "you're", right: "you are" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `You've got this! Which word correctly fills the gap?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "gap",
                text: v.testSentence,
                gapWord: "",
                gapHighlight: "blank",
                label: "Fill in the correct word:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word correctly completes: "${v.testSentence}"`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Well done! ${v.testExplain} ✓`,
                incorrect: (v) => `Close! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "How to catch homophone mistakes",
            body: () => `Here's your superpower: always ask **what does this word mean in the sentence?** If the meaning doesn't match the spelling, swap it for the right homophone. You'll catch mistakes that most people miss!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Read the sentence slowly", why: "Your brain loves to auto-correct — don't let it trick you!" },
                  { text: "Find the homophone", why: "Words that sound alike but mean different things" },
                  { text: "Ask: what does the word MEAN here?", why: "Meaning tells you the spelling" },
                  { text: "Swap in the correct spelling", why: "Spelling must match meaning, not sound ✓" }
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
  // SUB-CONCEPT 2: Silent Letters
  // ==========================================
  {
    id: "silent-letters",
    name: "Silent Letters",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "silent-letters-steps",
        templateType: "step-by-step",
        learningGoal: ["How to remember which words have silent letters — they're sneakier than you'd think!", "How to spot the common silent letter patterns (kn, wr, mb, ps) so they never catch you out"],
        variableSets: [
          {
            name: "Finn",
            scenario: "learning words with a silent K",
            silentLetter: "k",
            pattern: "kn-",
            words: "knife, knight, knot, knee, knock, know",
            rule: "When a word starts with 'kn', the K is silent — you only say the N sound.",
            exampleWord: "knight",
            exampleSay: "night",
            testWord: "knuckle",
            testOptions: ["knuckle", "nuckle", "knucle", "nuckell", "knukle"],
            testAnswer: "knuckle",
            testExplain: "The K in 'knuckle' is silent. We write 'kn' but only say the N sound."
          },
          {
            name: "Isla",
            scenario: "learning words with a silent W",
            silentLetter: "w",
            pattern: "wr-",
            words: "write, wrong, wrap, wrist, wreck, wrestle",
            rule: "When a word starts with 'wr', the W is silent — you only say the R sound.",
            exampleWord: "write",
            exampleSay: "rite",
            testWord: "wrapper",
            testOptions: ["wrapper", "rapper", "wraper", "raper", "wrrapper"],
            testAnswer: "wrapper",
            testExplain: "The W in 'wrapper' is silent. We write 'wr' but only say the R sound."
          },
          {
            name: "Ben",
            scenario: "learning words with a silent B",
            silentLetter: "b",
            pattern: "-mb",
            words: "climb, lamb, thumb, crumb, bomb, comb",
            rule: "When a word ends with 'mb', the B is silent — you only say the M sound.",
            exampleWord: "climb",
            exampleSay: "clime",
            testWord: "thumb",
            testOptions: ["thumb", "thum", "tumb", "thunb", "thmub"],
            testAnswer: "thumb",
            testExplain: "The B in 'thumb' is silent. We write 'mb' at the end but only say the M sound."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `The letter you can't hear!`,
            body: (v) => `Did you know some letters in English are completely invisible to your ears? ${v.name} is ${v.scenario}. Say the word **"${v.exampleWord}"** out loud. Can you hear the **${v.silentLetter.toUpperCase()}**? No — because it's **silent**! But you still have to write it.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `"${v.exampleWord}" sounds like "${v.exampleSay}" — the ${v.silentLetter.toUpperCase()} is silent!`,
                highlightWords: [{ word: v.exampleWord, color: "#7C3AED" }],
                label: "Listen and look:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: (v) => `The "${v.pattern}" pattern`,
            body: (v) => `The word **"${v.exampleWord}"** sounds like "${v.exampleSay}" because the **${v.silentLetter.toUpperCase()}** is silent. ${v.rule} Once you know this pattern, you can spell a whole family of words — here they are:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Pattern: "${v.pattern}" — the ${v.silentLetter.toUpperCase()} is silent`, why: v.rule },
                  { text: `Common words: ${v.words}`, why: "Learn these as a group — once you spot the pattern, you've got them all!" },
                  { text: `Memory trick: picture the silent letter wearing an invisible cloak!`, why: "It's there in the spelling, just hiding from your ears" },
                  { text: `Say it with the silent letter: "${v.exampleWord}" → k-night`, why: "Saying the silent letter while you practise helps you remember it ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `The ${v.silentLetter.toUpperCase()} in "${v.exampleWord}" is silent — you don't write it`, answer: false, explanation: `You DO still write the ${v.silentLetter.toUpperCase()} even though it's silent — it's there in the spelling! ✓` },
                { text: `Words with the "${v.pattern}" pattern all have a silent ${v.silentLetter.toUpperCase()}`, answer: true, explanation: `Yes! All "${v.pattern}" words share the same silent letter pattern. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Time to put your new knowledge to the test! Which of these is spelled correctly?`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which spelling is correct?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Superstar! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Silent letter patterns to remember",
            body: () => `Silent letters are tricky because you can't hear them — but here's the good news: they follow patterns! Learn the pattern and you'll get the whole group right.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "kn- → silent K: knife, knight, knot, knee, knock", why: "Say 'k-nife' in your head to remember the K" },
                  { text: "wr- → silent W: write, wrong, wrap, wrist", why: "Say 'w-rite' in your head to remember the W" },
                  { text: "-mb → silent B: climb, lamb, thumb, crumb", why: "Say 'clim-b' in your head to remember the B" },
                  { text: "ps- → silent P: psychology, pneumonia", why: "Say 'p-sychology' in your head to remember the P ✓" }
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
        id: "silent-letters-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to spot when a silent letter has been missed out — a really common mistake!", "How to use patterns to remember those invisible letters"],
        variableSets: [
          {
            name: "Jake",
            scenario: "wrote in his spelling test",
            wrongSpelling: "nife",
            correctSpelling: "knife",
            silentLetter: "k",
            pattern: "kn-",
            mistakeExplain: "Jake forgot the silent K. Words starting with the 'n' sound often need 'kn' at the start.",
            testWrong: "rong",
            testCorrect: "wrong",
            testOptions: ["wrong", "rong", "wrrong", "wroung", "wrang"],
            testExplain: "'Wrong' starts with 'wr' — the W is silent but must be written."
          },
          {
            name: "Priya",
            scenario: "labelled her science diagram",
            wrongSpelling: "thum",
            correctSpelling: "thumb",
            silentLetter: "b",
            pattern: "-mb",
            mistakeExplain: "Priya forgot the silent B at the end. Words ending in the 'um' sound often need 'mb'.",
            testWrong: "lam",
            testCorrect: "lamb",
            testOptions: ["lamb", "lam", "lamm", "lambe", "lumb"],
            testExplain: "'Lamb' ends with 'mb' — the B is silent but must be written."
          },
          {
            name: "Evie",
            scenario: "wrote a poem for class",
            wrongSpelling: "rite",
            correctSpelling: "write",
            silentLetter: "w",
            pattern: "wr-",
            mistakeExplain: "Evie forgot the silent W. When you mean putting pen to paper, it's 'write' with a W.",
            testWrong: "nee",
            testCorrect: "knee",
            testOptions: ["knee", "nee", "kne", "knea", "neee"],
            testExplain: "'Knee' starts with 'kn' — the K is silent but must be written."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} ${v.scenario} and wrote **"${v.wrongSpelling}"**. Hmm, a letter is hiding! Can you work out which one has gone missing?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `The word "${v.wrongSpelling}" doesn't look right...`,
                highlightWords: [{ word: v.wrongSpelling, color: "#e74c3c" }],
                label: "Spot the error:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The silent letter was missing!",
            body: (v) => `${v.mistakeExplain} The correct spelling is **"${v.correctSpelling}"** — the silent **${v.silentLetter.toUpperCase()}** follows the **"${v.pattern}"** pattern. This catches out loads of people, so knowing the pattern puts you ahead!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSpelling}" — missing the silent ${v.silentLetter.toUpperCase()}`, why: v.mistakeExplain },
                  { text: `Pattern: "${v.pattern}"`, why: `The ${v.silentLetter.toUpperCase()} is silent but always written` },
                  { text: `✓ "${v.correctSpelling}"`, why: `The correct spelling includes the silent ${v.silentLetter.toUpperCase()} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `When a word starts with "${v.pattern}", the ____ is silent`,
              options: (v) => [v.silentLetter.toUpperCase(), v.pattern.replace(v.silentLetter, "").replace("-", "").toUpperCase(), "Both letters", "Neither letter"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! The ${v.silentLetter.toUpperCase()} is silent in the "${v.pattern}" pattern. ✓`,
                incorrect: (v) => `Not quite — in "${v.pattern}" words, the ${v.silentLetter.toUpperCase()} is the silent letter!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Now you try! Someone wrote **"${v.testWrong}"**. What should it be?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix this:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the correct spelling of "${v.testWrong}"?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Well done! ${v.testExplain} ✓`,
                incorrect: (v) => `Close! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Don't forget the silent letters!",
            body: () => `The most common mistake is leaving out letters you can't hear. But now you know the trick: **say the silent letter in your head** when you practise spelling the word. You've got this!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "If it sounds like 'n' at the start, check: is it 'kn'?", why: "knife, knight, knee, knock, know" },
                  { text: "If it sounds like 'r' at the start, check: is it 'wr'?", why: "write, wrong, wrap, wrist" },
                  { text: "If it sounds like 'm' at the end, check: is it 'mb'?", why: "climb, lamb, thumb, crumb" },
                  { text: "Say the silent letter out loud when practising", why: "K-nife, w-rite, clim-b — it helps you remember! ✓" }
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
  // ==========================================
  {
    id: "double-letters",
    name: "Double Letters",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "double-letters-steps",
        templateType: "step-by-step",
        learningGoal: ["When to double a consonant (a non-vowel letter) before adding a suffix (an ending like -ing or -ed) — there's a satisfying rule for this!", "How to apply the short vowel rule for doubling letters so you always get it right"],
        variableSets: [
          {
            name: "Hassan",
            scenario: "adding -ing to words",
            baseWord: "run",
            suffix: "ing",
            correct: "running",
            wrong: "runing",
            vowel: "u",
            consonant: "n",
            rule: "Short vowel + single consonant → double the consonant before adding the suffix.",
            testBase: "sit",
            testSuffix: "ing",
            testCorrect: "sitting",
            testOptions: ["sitting", "siting", "sittng", "sitteing", "siteing"],
            testExplain: "'Sit' has a short vowel (i) then a single consonant (t), so we double the T before adding -ing."
          },
          {
            name: "Isla",
            scenario: "adding -ed to words",
            baseWord: "hop",
            suffix: "ed",
            correct: "hopped",
            wrong: "hoped",
            vowel: "o",
            consonant: "p",
            rule: "Short vowel + single consonant → double the consonant before adding the suffix.",
            testBase: "stop",
            testSuffix: "ed",
            testCorrect: "stopped",
            testOptions: ["stopped", "stoped", "stoppd", "stopeed", "stopted"],
            testExplain: "'Stop' has a short vowel (o) then a single consonant (p), so we double the P before adding -ed."
          },
          {
            name: "Charlie",
            scenario: "adding -er to words",
            baseWord: "big",
            suffix: "er",
            correct: "bigger",
            wrong: "biger",
            vowel: "i",
            consonant: "g",
            rule: "Short vowel + single consonant → double the consonant before adding the suffix.",
            testBase: "hot",
            testSuffix: "er",
            testCorrect: "hotter",
            testOptions: ["hotter", "hoter", "hoteer", "hottir", "houtter"],
            testExplain: "'Hot' has a short vowel (o) then a single consonant (t), so we double the T before adding -er."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Run + ing = running or runing?`,
            body: (v) => `Here's a spelling puzzle that catches out almost everyone! ${v.name} is ${v.scenario}. When you add **-${v.suffix}** to **"${v.baseWord}"**, do you double the last letter? Let's crack it!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.wrong}  or  ${v.correct}?`,
                highlightWords: [{ word: v.wrong, color: "#e74c3c" }, { word: v.correct, color: "#22c55e" }],
                label: "Which is correct?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The short vowel doubling rule",
            body: (v) => `Is it **"${v.correct}"** or **"${v.wrong}"**? Good news — there's a really satisfying rule that tells you exactly when to double the last letter:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Step 1: Look at the base word "${v.baseWord}"`, why: `Check the vowel (a, e, i, o, u) before the last letter` },
                  { text: `Step 2a: SHORT vowels make a quick sound`, why: `cAt, bEd, sIt, hOp, rUn — the vowel is quick and snappy` },
                  { text: `Step 2b: LONG vowels say their own name`, why: `cAke, thEme, rIde, hOpe, cUte — the vowel sounds like its letter name` },
                  { text: `"${v.baseWord}" has a SHORT "${v.vowel}" sound`, why: `It sounds like the "${v.vowel}" in "${v.vowel === 'a' ? 'cat' : v.vowel === 'e' ? 'bed' : v.vowel === 'i' ? 'sit' : v.vowel === 'o' ? 'hop' : 'run'}" — quick and short!` },
                  { text: `Step 3: Does it end with just ONE consonant?`, why: `"${v.baseWord}" ends with one "${v.consonant}" — yes!` },
                  { text: `Step 4: Short vowel + one consonant = DOUBLE IT`, why: `${v.baseWord} → ${v.baseWord}${v.consonant} + ${v.suffix} = **${v.correct}**` },
                  { text: `Why? Without doubling, "${v.wrong}" would change the vowel to a LONG sound`, why: `"${v.wrong}" looks like it should rhyme with "${v.vowel === 'u' ? 'tuning' : v.vowel === 'o' ? 'hoping' : v.vowel === 'i' ? 'biting' : v.vowel === 'a' ? 'baking' : 'being'}" ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Look at the base word: "${v.baseWord}"`,
                `Check: is the vowel short?`,
                `Check: does it end with one consonant?`,
                `Double the consonant, then add the suffix`
              ],
              feedback: {
                correct: (v) => `Spot on! Check the word, check the vowel, check the consonant, then double. You've got it! ✓`,
                incorrect: (v) => `Nearly there — start by looking at the base word first.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Let's see if you can use the rule! What happens when you add **-${v.testSuffix}** to **"${v.testBase}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.testBase} + ${v.testSuffix} = ?`,
                highlightWords: [{ word: v.testBase, color: "#7C3AED" }],
                label: "What's the correct spelling?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is "${v.testBase}" + "-${v.testSuffix}"?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Brilliant! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "When to double the last letter",
            body: () => `Here's the golden rule to take away: **short vowel + single consonant = double it** before adding a suffix like -ing, -ed or -er. Once you know this, you'll spot the answer instantly!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Check the vowel — is it short? (a, e, i, o, u as in cat, bed, sit, hop, run)", why: "Long vowels (like in 'hope') do NOT double" },
                  { text: "Check the ending — is it a single consonant?", why: "Two consonants (like 'jump') do NOT double" },
                  { text: "If both yes → double the consonant before the suffix", why: "run → running, hop → hopped, big → bigger" },
                  { text: "If the vowel is long → DON'T double", why: "hope → hoping (not hopping!) ✓" }
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
        id: "double-letters-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to spot when a letter should or shouldn't be doubled — these mistakes are everywhere!", "How to avoid common double-letter mistakes that trip up even grown-ups"],
        variableSets: [
          {
            name: "Aisha",
            scenario: "wrote in her story",
            wrongSpelling: "begining",
            correctSpelling: "beginning",
            mistakeExplain: "The N needs to be doubled. Say 'begin' — the last part sounds like 'GIN' with a short vowel, so double the N before adding -ing.",
            testWrong: "occured",
            testCorrect: "occurred",
            testOptions: ["occurred", "occured", "ocurred", "occurrd", "ocured"],
            testExplain: "'Occur' has stress on the last part (oc-CUR), short vowel + single consonant, so double the R."
          },
          {
            name: "Jake",
            scenario: "wrote on his homework",
            wrongSpelling: "untill",
            correctSpelling: "until",
            mistakeExplain: "'Until' only has one L — this is a tricky word you just have to learn!",
            testWrong: "tommorow",
            testCorrect: "tomorrow",
            testOptions: ["tomorrow", "tommorow", "tommorrow", "tomorow", "tomorroe"],
            testExplain: "'Tomorrow' has one M and two Rs. It's a tricky word — to-mor-row."
          },
          {
            name: "Grace",
            scenario: "filled in a form",
            wrongSpelling: "accomodate",
            correctSpelling: "accommodate",
            mistakeExplain: "'Accommodate' has two Cs AND two Ms. Memory trick: it's a big word — big enough to fit lots of double letters!",
            testWrong: "neccessary",
            testCorrect: "necessary",
            testOptions: ["necessary", "neccessary", "neccesary", "necesary", "necessery"],
            testExplain: "'Necessary' has one C and two Ss. Remember: one Collar, two Socks (ne-C-e-SS-ary)."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} ${v.scenario} and spelled a word as **"${v.wrongSpelling}"**. Something's off with the double letters! This one catches out grown-ups too — can you spot it?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `The word "${v.wrongSpelling}" doesn't look right...`,
                highlightWords: [{ word: v.wrongSpelling, color: "#e74c3c" }],
                label: "Spot the error:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the mistake",
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `${v.name} wrote **"${v.wrongSpelling}"** — but the correct spelling is **"${v.correctSpelling}"**.`
              },
              {
                type: 'visual',
                component: 'SentenceDisplay',
                props: (v) => ({
                  mode: "highlight",
                  text: `✗ ${v.wrongSpelling}     ✓ ${v.correctSpelling}`,
                  highlightWords: [{ word: v.wrongSpelling, color: "#e74c3c" }, { word: v.correctSpelling, color: "#22c55e" }],
                  label: "Compare them side by side:"
                })
              },
              {
                type: 'text',
                content: (v) => `${v.mistakeExplain}`
              }
            ],
            visual: null,
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `"${v.wrongSpelling}" is the correct spelling`, answer: false, explanation: `No! The correct spelling is "${v.correctSpelling}". ${v.mistakeExplain}` },
                { text: `When adding a suffix, a short vowel + single consonant means you double the consonant`, answer: true, explanation: `Yes! That's the doubling rule — run→running, hop→hopped, big→bigger. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Your turn to be the teacher! Someone wrote **"${v.testWrong}"**. What's the correct spelling?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix this:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the correct spelling?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Superstar! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Double letter dos and don'ts",
            body: () => `Some words double letters, some don't — and now you know how to tell the difference! Use the short vowel rule for adding suffixes, and learn the tricky ones by heart.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Short vowel + single consonant → double before a suffix", why: "running, hopped, bigger" },
                  { text: "Long vowel → do NOT double", why: "hoping (not hopping), writing (not writting)" },
                  { text: "Tricky doubles to learn: accommodate, beginning, occurred", why: "These follow the rule but people often forget" },
                  { text: "Tricky singles to learn: until, tomorrow, necessary", why: "These are exceptions — just learn them by heart ✓" }
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
  // SUB-CONCEPT 4: i Before e Rule
  // ==========================================
  {
    id: "i-before-e",
    name: "The i Before e Rule",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "i-before-e-steps",
        templateType: "step-by-step",
        learningGoal: ["How to apply the famous 'i before e except after c' rule — one of the most useful spelling rules there is!", "How to remember the sneaky exceptions that break the rule"],
        variableSets: [
          {
            name: "Ella",
            scenario: "learning the ie/ei pattern",
            ruleWord: "believe",
            ruleSpelling: "ie",
            afterC: false,
            afterCWord: "receive",
            afterCSpelling: "ei",
            testWord: "achieve",
            testOptions: ["achieve", "acheive", "acheve", "acheeve", "achiev"],
            testCorrect: "achieve",
            testExplain: "No C before the sound, so it's i before e: ach-ie-ve."
          },
          {
            name: "Ben",
            scenario: "practising tricky spellings",
            ruleWord: "piece",
            ruleSpelling: "ie",
            afterC: false,
            afterCWord: "ceiling",
            afterCSpelling: "ei",
            testWord: "receipt",
            testOptions: ["receipt", "reciept", "recipt", "receit", "receept"],
            testCorrect: "receipt",
            testExplain: "There's a C before the sound, so it's e before i: rec-ei-pt."
          },
          {
            name: "Priya",
            scenario: "writing a spelling list",
            ruleWord: "field",
            ruleSpelling: "ie",
            afterC: false,
            afterCWord: "deceive",
            afterCSpelling: "ei",
            testWord: "thief",
            testOptions: ["thief", "theif", "theef", "theaf", "thiaf"],
            testCorrect: "thief",
            testExplain: "No C before the sound, so it's i before e: th-ie-f."
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => `i before e — or e before i?`,
            body: (v) => `Did you know there's a famous rhyme that's helped people spell for hundreds of years? ${v.name} is ${v.scenario}. Is it "bel-ie-ve" or "bel-ei-ve"? Let's learn the rule!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: "i before e, except after c",
                highlightWords: [{ word: "i before e", color: "#7C3AED" }],
                label: "The golden rule:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The rule and how to use it",
            body: (v) => `So is it **"${v.ruleWord}"** with "${v.ruleSpelling}" — or the other way round? The answer comes from this famous rhyme: **i before e, except after c** (when the sound is "ee"). It's been helping people spell for ages — let's see how it works:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Usually: i before e → "ie"`, why: `believe, piece, field, thief, chief` },
                  { text: `After C: e before i → "ei"`, why: `receive, ceiling, deceive, receipt, conceive` },
                  { text: `Check: is there a C right before?`, why: "If yes → ei. If no → ie" },
                  { text: `Careful! Some rebel words break the rule`, why: "weird, seize, their, neither, protein — learn these rebels by heart ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `The rule is: i before e, except after ____`,
              options: (v) => ["c", "s", "t", "any consonant"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! "i before e, except after c" — that's the golden rule. ✓`,
                incorrect: (v) => `Not quite — the rule is "i before e, except after C"!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => v.suffix1 ? `You've got this! Test yourself on **${v.suffix1}** / **${v.suffix2}**. Which spelling is correct?` : `Now it's your turn! Which of these is spelled correctly?`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which spelling is correct?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Brilliant! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "i before e — the full picture",
            body: () => `The rule works brilliantly most of the time — just watch out for a few rebel words that like to break it!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "No C before → i before e (ie)", why: "believe, piece, field, thief, chief" },
                  { text: "C before → e before i (ei)", why: "receive, ceiling, deceive, receipt" },
                  { text: "EXCEPTIONS: weird, seize, their, neither", why: "These are the rebels — learn them separately" },
                  { text: "EXCEPTIONS: protein, caffeine, species", why: "Scientific words often go their own way too ✓" }
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
        id: "i-before-e-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to spot ie/ei mistakes — they're some of the most common spelling errors around!", "How to use the 'after c' part of the rule like a pro"],
        variableSets: [
          {
            name: "Finn",
            scenario: "wrote in his English book",
            wrongSpelling: "recieve",
            correctSpelling: "receive",
            mistakeExplain: "Finn wrote 'ie' after C, but after C it should be 'ei'. Receive → rec-ei-ve.",
            testWrong: "decieve",
            testCorrect: "deceive",
            testOptions: ["deceive", "decieve", "desieve", "deceve", "deceeve"],
            testExplain: "There's a C before the sound, so it's 'ei' not 'ie': dec-ei-ve."
          },
          {
            name: "Daisy",
            scenario: "wrote a story",
            wrongSpelling: "beleive",
            correctSpelling: "believe",
            mistakeExplain: "Daisy wrote 'ei' but there's no C before it, so it should be 'ie'. Believe → bel-ie-ve.",
            testWrong: "acheive",
            testCorrect: "achieve",
            testOptions: ["achieve", "acheive", "achive", "acheeve", "acheve"],
            testExplain: "No C before the sound, so it's 'ie' not 'ei': ach-ie-ve."
          },
          {
            name: "Tom",
            scenario: "wrote labels in science",
            wrongSpelling: "protien",
            correctSpelling: "protein",
            mistakeExplain: "Tom got confused because 'protein' is an exception! It's 'ei' even without a C. This one you just have to learn.",
            testWrong: "wierd",
            testCorrect: "weird",
            testOptions: ["weird", "wierd", "weerd", "werid", "wiered"],
            testExplain: "'Weird' is an exception — it's 'ei' even without a C. A weird word with a weird spelling!"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} ${v.scenario} and spelled a word as **"${v.wrongSpelling}"**. The ie/ei is the wrong way round! These two little letters cause more spelling headaches than almost anything else. Can you fix it?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `The word "${v.wrongSpelling}" doesn't look right...`,
                highlightWords: [{ word: v.wrongSpelling, color: "#e74c3c" }],
                label: "Spot the error:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The ie/ei is swapped!",
            body: (v) => `${v.mistakeExplain}\n\n**Your ie/ei checklist:**\n1. Is there a C right before? → use **ei** (receive, ceiling)\n2. No C? Then usually → **ie** (believe, piece, field)\n3. Check — is it an exception? (weird, seize, their, protein)\n4. When in doubt, write both and see which looks right!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSpelling}"`, why: "The i and e are the wrong way round" },
                  { text: v.mistakeExplain, why: "Apply the rule: i before e, except after c" },
                  { text: `✓ "${v.correctSpelling}"`, why: "Now the ie/ei is correct ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `"Receive" uses "ie" because of the i before e rule`, answer: false, explanation: `No! "Receive" has a C before the sound, so it uses "ei" — rec-ei-ve. ✓` },
                { text: `"Weird" is an exception to the i before e rule`, answer: true, explanation: `Yes! "Weird" breaks the rule — it uses "ei" without a C. You just have to learn it! ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Now you try! Someone wrote **"${v.testWrong}"**. What's the correct spelling?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix this:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the correct spelling?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Well done! ${v.testExplain} ✓`,
                incorrect: (v) => `Close! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "ie or ei — your checklist",
            body: () => `You've now got a handy checklist that works almost every time. Here it is:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Is there a C just before?", why: "If YES → use EI (e.g. receive, ceiling, deceit)" },
                  { text: "Step 2: No C before?", why: "If NO → use IE (e.g. believe, field, thief)" },
                  { text: "Step 3: Watch out for exceptions!", why: "weird, seize, neither, their — these break the rule" },
                  { text: "Memory trick: I before E, except after C", why: "Learn the exceptions separately ✓" }
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
  // SUB-CONCEPT 5: -ful Suffix
  // ==========================================
  {
    id: "suffix-ful",
    name: "Word Endings: -ful (not -full)",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "suffix-ful-steps",
        templateType: "step-by-step",
        learningGoal: ["Why the suffix (word ending) -ful always has one L, not two — this surprises almost everyone!", "How to add -ful to base words correctly every single time"],
        variableSets: [
          {
            name: "Grace",
            scenario: "writing about her weekend",
            baseWord: "hope",
            correct: "hopeful",
            wrong: "hopefull",
            testBase: "care",
            testCorrect: "careful",
            testOptions: ["careful", "carefull", "carful", "carefal", "carfull"],
            testExplain: "The suffix -ful always has ONE L. Care + ful = careful."
          },
          {
            name: "Hassan",
            scenario: "describing a painting",
            baseWord: "beauty",
            correct: "beautiful",
            wrong: "beautifull",
            testBase: "wonder",
            testCorrect: "wonderful",
            testOptions: ["wonderful", "wonderfull", "wondrful", "wonderfal", "wundrful"],
            testExplain: "The suffix -ful always has ONE L. Wonder + ful = wonderful."
          },
          {
            name: "Ella",
            scenario: "writing a thank-you card",
            baseWord: "thank",
            correct: "thankful",
            wrong: "thankfull",
            testBase: "help",
            testCorrect: "helpful",
            testOptions: ["helpful", "helpfull", "helful", "helpfal", "helppful"],
            testExplain: "The suffix -ful always has ONE L. Help + ful = helpful."
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => `-ful or -full?`,
            body: (v) => `Here's a question that tricks nearly everyone! ${v.name} is ${v.scenario} and needs to write the word **"${v.correct}"**. But wait — is it one L or two? The word "full" has two Ls, so should the suffix?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.wrong}  or  ${v.correct}?`,
                highlightWords: [{ word: v.wrong, color: "#e74c3c" }, { word: v.correct, color: "#22c55e" }],
                label: "Which is correct?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The -ful rule: always ONE L",
            body: (v) => `The answer is **"${v.correct}"** — with just ONE L. When "full" becomes a **suffix** (letters added to the end of another word), it loses one L and becomes **-ful**. Every single time!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `The word "full" on its own has two Ls`, why: "The glass is full" },
                  { text: `As a suffix, it drops to one L: -ful`, why: "This ALWAYS happens — no exceptions!" },
                  { text: `${v.baseWord} + ful = ${v.correct}`, why: `NOT "${v.wrong}" — just one L` },
                  { text: `More examples: helpful, cheerful, powerful, playful`, why: "Every -ful word follows this rule ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `The suffix -ful has two Ls, just like the word "full"`, answer: false, explanation: `No! As a suffix, "full" drops one L and becomes -ful. Always one L! ✓` },
                { text: `"${v.correct}" is spelled with one L at the end`, answer: true, explanation: `Yes! ${v.baseWord} + ful = ${v.correct}. The suffix -ful always has one L. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Let's see if you remember the rule! What do you get when you add -ful to **"${v.testBase}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `Which spelling is correct?`,
                highlightWords: [],
                label: "Pick the right one:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is "${v.testBase}" + "-ful"?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Superstar! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The -ful rule",
            body: () => `This is one of the simplest spelling rules — and one of the most commonly broken, even by adults! Now you know better.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "The word 'full' on its own = two Ls", why: "That's fine — it's a standalone word" },
                  { text: "The SUFFIX -ful = always ONE L", why: "helpful, beautiful, wonderful, thankful, hopeful" },
                  { text: "There are NO exceptions", why: "Every -ful word has one L at the end" },
                  { text: "Watch out for 'beautiful' (beauty → beauti → beautiful)", why: "The Y changes to I before adding -ful ✓" }
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
        id: "suffix-ful-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to spot the sneaky -full error that pops up everywhere", "Why -ful always has one L as a suffix (word ending) — a fact that puts you ahead of most people!"],
        variableSets: [
          {
            name: "Jake",
            scenario: "wrote in his homework book",
            wrongSpelling: "wonderfull",
            correctSpelling: "wonderful",
            mistakeExplain: "Jake wrote -full with two Ls. As a suffix, -ful always has just one L.",
            testWrong: "powerfull",
            testCorrect: "powerful",
            testOptions: ["powerful", "powerfull", "powrful", "powerfl", "powarful"],
            testExplain: "The suffix -ful always has ONE L: powerful."
          },
          {
            name: "Daisy",
            scenario: "made a poster",
            wrongSpelling: "beautifull",
            correctSpelling: "beautiful",
            mistakeExplain: "Daisy wrote -full with two Ls. Remember: the suffix -ful always has one L, even though 'full' on its own has two.",
            testWrong: "cheerfull",
            testCorrect: "cheerful",
            testOptions: ["cheerful", "cheerfull", "chearful", "cheerfl", "chereful"],
            testExplain: "The suffix -ful always has ONE L: cheerful."
          },
          {
            name: "Finn",
            scenario: "wrote a birthday card",
            wrongSpelling: "gratefull",
            correctSpelling: "grateful",
            mistakeExplain: "Finn wrote -full with two Ls. The suffix -ful always drops one L.",
            testWrong: "playfull",
            testCorrect: "playful",
            testOptions: ["playful", "playfull", "playfl", "plaiful", "playfol"],
            testExplain: "The suffix -ful always has ONE L: playful."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} ${v.scenario} and wrote **"${v.wrongSpelling}"**. Something's not right at the end of the word! Can you spot what's gone wrong?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `The word "${v.wrongSpelling}" doesn't look right...`,
                highlightWords: [{ word: v.wrongSpelling, color: "#e74c3c" }],
                label: "Spot the error:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Too many Ls!",
            body: (v) => `${v.mistakeExplain}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSpelling}" — two Ls at the end`, why: "The suffix -ful never has two Ls" },
                  { text: `"Full" drops an L when it becomes a suffix`, why: "full → -ful (always!)" },
                  { text: `✓ "${v.correctSpelling}" — one L`, why: "That's the correct spelling ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Your turn! Someone wrote **"${v.testWrong}"**. Can you fix it?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix this:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the correct spelling?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Well done! ${v.testExplain} ✓`,
                incorrect: (v) => `Close! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "One L for -ful — always!",
            body: () => `This is a guaranteed rule with zero exceptions — how satisfying is that? If it's a suffix, it's one L. Every time. No tricks!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "The suffix -ful ALWAYS has one L", why: "helpful, beautiful, wonderful, grateful" },
                  { text: "The word 'full' on its own has two Ls", why: "Only the standalone word keeps both Ls" },
                  { text: "No exceptions — this rule is 100% reliable", why: "If you see -full at the end, it's wrong" },
                  { text: "Quick check: cover the -ful. Is there a word left?", why: "hope-ful, care-ful, play-ful — yes! One L ✓" }
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
  // SUB-CONCEPT 6: Tricky Suffix Pairs
  // ==========================================
  {
    id: "suffix-pairs",
    name: "Tricky Suffix Pairs",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "suffix-pairs-steps",
        templateType: "step-by-step",
        learningGoal: ["How to choose between confusing suffix (word ending) pairs like -tion and -sion — they sound almost identical!", "How to use clever memory tricks for -ent/-ant and -ence/-ance so you never mix them up"],
        variableSets: [
          {
            name: "Aisha",
            scenario: "learning -tion and -sion endings",
            suffix1: "-tion",
            suffix2: "-sion",
            rule: "Most words use -tion. Use -sion after L, N, R, or S (expulsion, tension, version, expression).",
            example1: "education",
            example2: "television",
            memoryTrick: "If the letter before the ending is L, N, R or S, use -sion (expuLsion, teNsion, veRsion, expresSion). Otherwise, use -tion!",
            testWord: "invention",
            testOptions: ["invention", "invension", "invenshun", "inventtion", "inventon"],
            testCorrect: "invention",
            testExplain: "The base word 'invent' ends in T, not L/N/R/S, so it's -tion: invention."
          },
          {
            name: "Charlie",
            scenario: "learning -tion and -sion endings",
            suffix1: "-tion",
            suffix2: "-sion",
            rule: "Most words use -tion. Use -sion after L, N, R, or S.",
            example1: "celebration",
            example2: "confusion",
            memoryTrick: "If the letter before the ending is L, N, R or S, use -sion (confuSion, verSion). Otherwise, use -tion (celebraTion, educaTion)!",
            testWord: "explosion",
            testOptions: ["explosion", "explotion", "exploshun", "explostion", "exploson"],
            testCorrect: "explosion",
            testExplain: "'Explode' ends in a D sound before S, so we use -sion: explosion."
          },
          {
            name: "Isla",
            scenario: "practising -tion and -sion endings",
            suffix1: "-tion",
            suffix2: "-sion",
            rule: "Most words use -tion. Use -sion after L, N, R, or S.",
            example1: "attention",
            example2: "decision",
            memoryTrick: "If the letter before the ending is L, N, R or S, use -sion (deciSion, tenSion). Otherwise, use -tion (attenTion, quesTion)!",
            testWord: "permission",
            testOptions: ["permission", "permition", "permishun", "permistion", "permisson"],
            testCorrect: "permission",
            testExplain: "'Permit' ends with a T but the S sound before it means we use -sion: permission."
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => `Which ending is right?`,
            body: (v) => `Did you know that even teachers sometimes have to double-check these? ${v.name} is ${v.scenario}. Is it **${v.suffix1}** or **${v.suffix2}**? These confusing pairs trip up everyone — but you're about to learn the secret!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `"-${v.suffix1}" or "-${v.suffix2}"? Which ending is correct?`,
                highlightWords: [],
                label: "Suffix challenge:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: (v) => `${v.suffix1} or ${v.suffix2}?`,
            body: (v) => `These two endings sound almost the same — but only one is right! Here's how to tell them apart:`,
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `These two endings sound almost the same — but only one is right!`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `"${v.example1}" uses **${v.suffix1}**`, why: `Say it: "${v.example1}" — hear the ending!` },
                    { text: `"${v.example2}" uses **${v.suffix2}**`, why: `Say it: "${v.example2}" — sounds different!` },
                    { text: `How to remember:`, why: v.memoryTrick },
                    { text: `Still stuck? Think of a word you already know how to spell`, why: `Words from the same family use the same ending ✓` }
                  ]
                })
              }
            ],
            visual: null,
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "education", right: "-tion" },
                { left: "television", right: "-sion" },
                { left: "different", right: "-ent" },
                { left: "important", right: "-ant" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => v.suffix1 ? `You've got this! Test yourself on **${v.suffix1}** / **${v.suffix2}**. Which spelling is correct?` : `Now it's your turn! Which of these is spelled correctly?`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which spelling is correct?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Brilliant! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Suffix pairs cheat sheet",
            body: () => `These pairs are genuinely hard — even adults mix them up all the time. But now you've got the patterns, you're ahead of the game!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "-tion vs -sion: after L, N, R, S → use -sion", why: "expulsion, tension, version, expression" },
                  { text: "-tion for most other words", why: "education, invention, action, station" },
                  { text: "Still unsure? Think of a word from the same family", why: "If 'televise' uses S, then 'television' uses -sion ✓" },
                  { text: "Other tricky pairs (-ent/-ant, -ence/-ance) are covered in the next lesson", why: "One rule at a time — master -tion/-sion first! ✓" }
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
        id: "suffix-pairs-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to spot wrong suffix (word ending) pairs — become a spelling detective!", "How to use related words as clues to check the suffix"],
        variableSets: [
          {
            name: "Ben",
            scenario: "wrote in his geography book",
            wrongSpelling: "educasion",
            correctSpelling: "education",
            mistakeExplain: "Ben used -sion, but 'educate' ends in T, so it's -tion: education.",
            testWrong: "televition",
            testCorrect: "television",
            testOptions: ["television", "televition", "televishin", "telivision", "televission"],
            testExplain: "The base is 'televise' which ends in S, so it's -sion: television."
          },
          {
            name: "Evie",
            scenario: "wrote a letter to her pen pal",
            wrongSpelling: "informasion",
            correctSpelling: "information",
            mistakeExplain: "Evie used -sion, but 'inform' doesn't end in L, N, R or S, so it's -tion: information.",
            testWrong: "invension",
            testCorrect: "invention",
            testOptions: ["invention", "invension", "invenshun", "inventtion", "inventon"],
            testExplain: "'Invent' ends in T, not L/N/R/S, so it's -tion: invention."
          },
          {
            name: "Priya",
            scenario: "labelled a diagram",
            wrongSpelling: "extention",
            correctSpelling: "extension",
            mistakeExplain: "Priya used -tion, but 'extend' ends in D (which sounds like an S), so it's -sion: extension.",
            testWrong: "compreshion",
            testCorrect: "comprehension",
            testOptions: ["comprehension", "compreshion", "comprehention", "comprahension", "comprehenion"],
            testExplain: "'Comprehend' ends in D, so it's -sion: comprehension."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} ${v.scenario} and wrote **"${v.wrongSpelling}"**. The suffix is wrong! Can you see which part?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `The word "${v.wrongSpelling}" doesn't look right...`,
                highlightWords: [{ word: v.wrongSpelling, color: "#e74c3c" }],
                label: "Spot the error:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Wrong suffix!",
            body: (v) => `${v.mistakeExplain}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSpelling}"`, why: "Wrong suffix used" },
                  { text: v.mistakeExplain, why: "Think about the base word or the matching adjective/noun" },
                  { text: `✓ "${v.correctSpelling}"`, why: "Correct suffix ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Now you have a go! Someone wrote **"${v.testWrong}"**. What should it be?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix this:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the correct spelling?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Superstar! ${v.testExplain} ✓`,
                incorrect: (v) => `Close! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "-tion or -sion? The quick check!",
            body: () => `You've got a really useful trick now. Here's how to choose the right ending every time:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Look at the letter BEFORE the ending", why: "What letter does the base word end with?" },
                  { text: "Step 2: Is it L, N, R or S?", why: "If YES → use -sion (e.g. expuLsion, teNsion, veRsion, expresSion)" },
                  { text: "Step 3: Is it any other letter?", why: "If YES → use -tion (e.g. educaTion, invenTion, celebraTion)" },
                  { text: "Still unsure? Say the base word out loud", why: "If it ends with a 'zh' or 'sh' sound, it's probably -sion ✓" }
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
  // SUB-CONCEPT 7: Unexpected Sounds
  // ==========================================
  {
    id: "unexpected-sounds",
    name: "Letters Making Different Sounds",
    category: "other",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "unexpected-sounds-steps",
        templateType: "step-by-step",
        learningGoal: ["How to recognise when letters are in disguise, making unexpected sounds", "How to spot the common patterns — soft c, soft g, ph=f, ch=k — so they never trick you"],
        variableSets: [
          {
            name: "Daisy",
            scenario: "learning about soft C",
            letter: "c",
            normalSound: "k (as in cat)",
            unexpectedSound: "s (as in city)",
            rule: "C makes an S sound before E, I, or Y.",
            examples: "city, ceiling, cycle, cent, circle, cinema",
            testWord: "circle",
            testOptions: ["circle", "sircle", "circel", "cirkle", "sirkle"],
            testCorrect: "circle",
            testExplain: "Even though it sounds like 'sircle', it's spelled with a C because C makes an S sound before I."
          },
          {
            name: "Hassan",
            scenario: "learning about soft G",
            letter: "g",
            normalSound: "g (as in go)",
            unexpectedSound: "j (as in gym)",
            rule: "G sometimes makes a J sound before E, I, or Y.",
            examples: "gym, gentle, giant, giraffe, magic, energy",
            testWord: "giant",
            testOptions: ["giant", "jiant", "gient", "giante", "jient"],
            testCorrect: "giant",
            testExplain: "Even though it sounds like 'jiant', it's spelled with a G because G can make a J sound before I."
          },
          {
            name: "Grace",
            scenario: "learning about ph and ch",
            letter: "ph / ch",
            normalSound: "different sounds",
            unexpectedSound: "f (phone) and k (school)",
            rule: "PH makes an F sound. CH sometimes makes a K sound (especially in words from Greek).",
            examples: "phone, photo, pharmacy, character, school, chemistry",
            testWord: "pharmacy",
            testOptions: ["pharmacy", "farmacy", "pharmasy", "farmasy", "pharmecy"],
            testCorrect: "pharmacy",
            testExplain: "The F sound in 'pharmacy' is spelled PH. Words from Greek often use PH for the F sound."
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => `Letters in disguise!`,
            body: (v) => `Did you know that English letters love dressing up as other letters? ${v.name} is ${v.scenario} and has just discovered that the letter **${v.letter}** can sound like **${v.unexpectedSound}**! How sneaky is that?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `The letter "${v.letter}" can make the sound "${v.unexpectedSound}"!`,
                highlightWords: [],
                label: "Unexpected sound:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: (v) => `When ${v.letter} makes a different sound`,
            body: (v) => `On the previous screen, we saw how **"${v.examples.split(', ')[0]}"** uses the letter **${v.letter}** to make the sound **${v.unexpectedSound}**. ${v.rule}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.letter} usually sounds like: ${v.normalSound}`, why: "The sound you'd expect" },
                  { text: `But sometimes it sounds like: ${v.unexpectedSound}`, why: v.rule },
                  { text: `Examples: ${v.examples}`, why: "Learn these as a group" },
                  { text: `The spelling uses the LETTER, not the sound`, why: "Don't write what you hear — write the correct letters ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Soft C", right: "S sound (city, ceiling)" },
                { left: "Soft G", right: "J sound (gym, giant)" },
                { left: "PH", right: "F sound (phone, photo)" },
                { left: "CH (Greek)", right: "K sound (school, character)" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => v.suffix1 ? `You've got this! Test yourself on **${v.suffix1}** / **${v.suffix2}**. Which spelling is correct?` : `Now it's your turn! Which of these is spelled correctly?`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which spelling is correct?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Well done! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Letters in disguise — summary",
            body: () => `These patterns trip people up because the spelling doesn't match the sound. But once you know the disguises, they can't fool you any more!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Soft C → S sound before E, I, Y", why: "city, ceiling, cycle, cent, circle" },
                  { text: "Soft G → J sound before E, I, Y", why: "gym, gentle, giant, giraffe, energy" },
                  { text: "PH → F sound", why: "phone, photo, pharmacy, elephant" },
                  { text: "CH → K sound (Greek words)", why: "character, school, chemistry, stomach ✓" }
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
        id: "unexpected-sounds-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to spot phonetic (spelled-by-sound) misspellings — English is full of them!", "Why spelling by sound doesn't always work, and what to do instead"],
        variableSets: [
          {
            name: "Tom",
            scenario: "wrote in his book",
            wrongSpelling: "fone",
            correctSpelling: "phone",
            mistakeExplain: "Tom wrote the F sound as 'f', but this word uses PH for the F sound. It comes from Greek.",
            testWrong: "foto",
            testCorrect: "photo",
            testOptions: ["photo", "foto", "photto", "foeto", "phote"],
            testExplain: "The F sound in 'photo' is spelled PH, not F. It comes from the Greek word for light."
          },
          {
            name: "Ella",
            scenario: "wrote her homework",
            wrongSpelling: "jym",
            correctSpelling: "gym",
            mistakeExplain: "Ella wrote the J sound as 'j', but in this word the J sound is made by the letter G. G before Y makes a J sound.",
            testWrong: "jiraffe",
            testCorrect: "giraffe",
            testOptions: ["giraffe", "jiraffe", "giraff", "giraf", "jirafe"],
            testExplain: "The J sound in 'giraffe' is spelled with a G. G before I makes a J sound."
          },
          {
            name: "Jake",
            scenario: "wrote a recipe",
            wrongSpelling: "karacter",
            correctSpelling: "character",
            mistakeExplain: "Jake wrote the K sound as 'k', but in this word the K sound is made by CH. Words from Greek often use CH for the K sound.",
            testWrong: "kemistry",
            testCorrect: "chemistry",
            testOptions: ["chemistry", "kemistry", "chemestry", "chemistree", "kemestry"],
            testExplain: "The K sound in 'chemistry' is spelled CH, not K. It comes from a Greek word."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} ${v.scenario} and wrote **"${v.wrongSpelling}"**. Here's the tricky thing — it sounds right when you say it, but the spelling is wrong! English loves to play tricks like this. Can you see why?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `The word "${v.wrongSpelling}" doesn't look right...`,
                highlightWords: [{ word: v.wrongSpelling, color: "#e74c3c" }],
                label: "Spot the error:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Spelled by sound — but English had other plans!",
            body: (v) => `${v.mistakeExplain}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSpelling}" — spelled by sound`, why: v.mistakeExplain },
                  { text: `In English, the same sound can be spelled different ways`, why: "You have to learn which letters each word uses" },
                  { text: `✓ "${v.correctSpelling}"`, why: "The correct spelling uses the right letter pattern ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Time to test your skills! Someone wrote **"${v.testWrong}"**. Can you fix it?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix this:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the correct spelling?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Brilliant! ${v.testExplain} ✓`,
                incorrect: (v) => `Close! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Don't spell by sound alone!",
            body: () => `English has borrowed words from so many languages that the spelling often doesn't match the sound. But now you know the secret patterns, and that puts you way ahead!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "F sound might be spelled: f, ph, or gh (laugh)", why: "phone, not fone; photo, not foto" },
                  { text: "J sound might be spelled: j, g, or dge (badge)", why: "gym, not jym; giant, not jiant" },
                  { text: "K sound might be spelled: k, c, ck, or ch", why: "character, not karacter; school, not skool" },
                  { text: "S sound might be spelled: s, c, or ss", why: "city, not sity; circle, not sircle ✓" }
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
  // SUB-CONCEPT 8: Spelling Demons
  // ==========================================
  {
    id: "spelling-demons",
    name: "Words You Just Have to Learn",
    category: "other",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "spelling-demons-steps",
        templateType: "step-by-step",
        learningGoal: ["How to use clever memory tricks (mnemonics) for the hardest common words — these are really fun!", "How to break tricky words into parts so your brain locks them in"],
        variableSets: [
          {
            name: "Isla",
            scenario: "learning to spell 'because'",
            word: "because",
            mnemonic: "Big Elephants Can Always Understand Small Elephants",
            breakdown: "be-cause",
            commonMistake: "becuse / becoz / becos",
            tip: "Take the first letter of each word in the sentence to spell B-E-C-A-U-S-E.",
            testWord: "because",
            testOptions: ["because", "becuse", "becouse", "becaus", "becauce"],
            testCorrect: "because",
            testExplain: "Remember: Big Elephants Can Always Understand Small Elephants → B-E-C-A-U-S-E."
          },
          {
            name: "Ben",
            scenario: "learning to spell 'Wednesday'",
            word: "Wednesday",
            mnemonic: "Say it as: Wed-NES-day (say the D-N-E-S out loud)",
            breakdown: "Wed-nes-day",
            commonMistake: "Wensday / Wendsday / Wednsday",
            tip: "Say all the letters out loud, even the silent ones: Wed-NES-day.",
            testWord: "Wednesday",
            testOptions: ["Wednesday", "Wensday", "Wendsday", "Wednsday", "Wendesday"],
            testCorrect: "Wednesday",
            testExplain: "Say it as 'Wed-NES-day' to remember the hidden letters."
          },
          {
            name: "Priya",
            scenario: "learning to spell 'separate'",
            word: "separate",
            mnemonic: "There's A RAT in sepARATE",
            breakdown: "sep-a-rate",
            commonMistake: "seperate / separete / seprate",
            tip: "Look for the word 'a rat' hiding inside: sep-A-RAT-e.",
            testWord: "separate",
            testOptions: ["separate", "seperate", "separete", "seprate", "seperete"],
            testCorrect: "separate",
            testExplain: "There's A RAT in sepARATE! The middle letters are A-R-A-T-E."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `How do you spell "${v.word}"?`,
            body: (v) => `Did you know that **"${v.word}"** is one of the most misspelled words in the whole English language? ${v.name} is ${v.scenario}. This word doesn't follow the usual rules — but there's a brilliant trick to help you remember it!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `"${v.word}"`,
                highlightWords: [{ word: v.word, color: "#7C3AED" }],
                label: "Focus word:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: (v) => `Memory trick for "${v.word}"`,
            body: (v) => `${v.tip}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `The word: "${v.word}"`, why: `Break it down: ${v.breakdown}` },
                  { text: `Memory trick: ${v.mnemonic}`, why: v.tip },
                  { text: `Common mistake: ${v.commonMistake}`, why: "Now you know the trick, you won't make this mistake!" },
                  { text: `Practise writing it 3 times`, why: "Writing it helps your hand remember the pattern ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Right, you've got this! One of these is the correct spelling — can you pick it?`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is the correct spelling?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Superstar! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Memory tricks for tricky words",
            body: () => `Some words just don't follow the rules — but that's OK! Use **mnemonics** (memory tricks) to outsmart them. These tricks are so good, you'll never forget them!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "because → Big Elephants Can Always Understand Small Elephants", why: "First letters spell B-E-C-A-U-S-E" },
                  { text: "separate → there's A RAT in sepARATE", why: "Look for hidden words inside tricky words" },
                  { text: "Wednesday → say Wed-NES-day out loud", why: "Pronounce the silent letters when practising" },
                  { text: "definitely → it has the word FINITE inside", why: "de-FINITE-ly — no A anywhere! ✓" }
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
        id: "spelling-demons-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to spot the most common misspellings of tricky words — you'll be surprised how often you see them!", "How to use memory tricks to avoid these mistakes and impress your teacher"],
        variableSets: [
          {
            name: "Finn",
            scenario: "wrote in his diary",
            wrongSpelling: "definately",
            correctSpelling: "definitely",
            mistakeExplain: "Finn wrote 'definately' with an A, but the correct spelling has no A. Think of the word FINITE inside: de-FINITE-ly.",
            mnemonic: "de-FINITE-ly — the word FINITE is inside",
            testWrong: "goverment",
            testCorrect: "government",
            testOptions: ["government", "goverment", "govermant", "govermnent", "govenment"],
            testExplain: "It's govern-ment — the word 'govern' keeps all its letters when you add -ment."
          },
          {
            name: "Daisy",
            scenario: "wrote on her calendar",
            wrongSpelling: "Febuary",
            correctSpelling: "February",
            mistakeExplain: "Daisy forgot the first R. It's Feb-R-u-ary. Say it slowly: Feb-ROO-ary.",
            mnemonic: "Feb-R-u-ary — don't forget the R after Feb",
            testWrong: "libary",
            testCorrect: "library",
            testOptions: ["library", "libary", "liberry", "libery", "libarry"],
            testExplain: "It's lib-R-ary — there are two Rs. Say it slowly: LIB-rare-ee."
          },
          {
            name: "Charlie",
            scenario: "wrote a sentence in English class",
            wrongSpelling: "diffrent",
            correctSpelling: "different",
            mistakeExplain: "Charlie missed the second E. It's diff-ER-ent. Break it into three parts: diff-er-ent.",
            mnemonic: "diff-ER-ent — three syllables, don't skip the middle one",
            testWrong: "intresting",
            testCorrect: "interesting",
            testOptions: ["interesting", "intresting", "interisting", "intressting", "intaresting"],
            testExplain: "It's inter-EST-ing — the word 'interest' keeps all its letters. Don't skip the second E."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} ${v.scenario} and wrote **"${v.wrongSpelling}"**. It looks close, but it's not quite right! Don't worry — this is one of the words that almost everybody gets wrong.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `The word "${v.wrongSpelling}" doesn't look right...`,
                highlightWords: [{ word: v.wrongSpelling, color: "#e74c3c" }],
                label: "Spot the error:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's what went wrong",
            body: (v) => `${v.mistakeExplain} Don't worry — now you know the trick, you'll remember it for life!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSpelling}"`, why: v.mistakeExplain },
                  { text: `Memory trick: ${v.mnemonic}`, why: "Use this to remember the correct spelling" },
                  { text: `✓ "${v.correctSpelling}"`, why: "Now you'll get this right every time ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `"${v.wrongSpelling}" is the correct spelling`, answer: false, explanation: `No! The correct spelling is "${v.correctSpelling}". Remember: ${v.mnemonic}. ✓` },
                { text: `The word "${v.correctSpelling}" contains the smaller word you can use as a memory trick`, answer: true, explanation: `Yes! ${v.mnemonic} — memory tricks help you remember tricky spellings. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Someone wrote **"${v.testWrong}"**. What should it be?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix this:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the correct spelling?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Well done! ${v.testExplain} ✓`,
                incorrect: (v) => `Close! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Spelling demons — learn them by heart",
            body: () => `These words trip up almost everyone — but not you any more! Use the tricks below, practise writing them out, and you'll have them nailed in no time.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "definitely → de-FINITE-ly (no A!)", why: "The most commonly misspelled word in English" },
                  { text: "February → Feb-R-u-ary (don't drop the R)", why: "Say all the syllables: Feb-roo-ary" },
                  { text: "library → lib-R-ary (two Rs)", why: "Say: LIB-rare-ee" },
                  { text: "government → GOVERN-ment (keep the N)", why: "The word 'govern' stays complete ✓" }
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
  // SUB-CONCEPT 9: Prefix Spelling Rules
  // ==========================================
  {
    id: "prefix-spelling",
    name: "Prefix Spelling Rules",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "prefix-spelling-steps",
        templateType: "step-by-step",
        learningGoal: ["How to remember that adding a prefix (a letter group at the start, like un- or re-) never changes the base word spelling — this is a golden rule!", "How to recognise when prefixes naturally create double letters (and why that's perfectly fine)"],
        variableSets: [
          {
            name: "Aisha",
            scenario: "checking her English homework",
            prefix: "dis",
            baseWord: "appear",
            wrongVersion: "disapear",
            correctVersion: "disappear",
            rule: "The prefix 'dis-' is added to 'appear'. The base word doesn't change, so both letters stay.",
            doubleLetter: "The two P's come from the base word — 'appear' already has two P's.",
            testWord: "disagree",
            testOptions: ["disagree", "diagree", "dissagree", "disargee", "disagreee"],
            testAnswer: "disagree",
            testExplain: "'Dis-' + 'agree' = 'disagree'. The base word 'agree' stays exactly the same."
          },
          {
            name: "Oliver",
            scenario: "writing a story about a wizard",
            prefix: "mis",
            baseWord: "spell",
            wrongVersion: "mispell",
            correctVersion: "misspell",
            rule: "The prefix 'mis-' is added to 'spell'. Keep both S letters — one from the prefix, one from the base word.",
            doubleLetter: "The double S comes from 'mis' ending in S and 'spell' starting with S.",
            testWord: "misspent",
            testOptions: ["misspent", "mispent", "misspant", "misspennt", "mispant"],
            testAnswer: "misspent",
            testExplain: "'Mis-' + 'spent' = 'misspent'. The S from 'mis' and the S from 'spent' both stay."
          },
          {
            name: "Priya",
            scenario: "describing a really messy bedroom",
            prefix: "un",
            baseWord: "necessary",
            wrongVersion: "unecessary",
            correctVersion: "unnecessary",
            rule: "The prefix 'un-' is added to 'necessary'. The base word starts with N, so you get double N.",
            doubleLetter: "The double N comes from 'un' ending in N and 'necessary' starting with N.",
            testWord: "unnatural",
            testOptions: ["unnatural", "unatural", "unnateral", "unaturall", "unnatchural"],
            testAnswer: "unnatural",
            testExplain: "'Un-' + 'natural' = 'unnatural'. The N from 'un' and the N from 'natural' both stay."
          },
          {
            name: "Jake",
            scenario: "writing about his weekend plans",
            prefix: "over",
            baseWord: "react",
            wrongVersion: "overact",
            correctVersion: "overreact",
            rule: "The prefix 'over-' is added to 'react'. Both words keep their full spelling.",
            doubleLetter: "The double R comes from 'over' ending in R and 'react' starting with R.",
            testWord: "overrule",
            testOptions: ["overrule", "overule", "ovarrule", "overulle", "overool"],
            testAnswer: "overrule",
            testExplain: "'Over-' + 'rule' = 'overrule'. The R from 'over' and the R from 'rule' both stay."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Why does "${v.correctVersion}" have a double letter?`,
            body: (v) => `${v.name} is ${v.scenario} and needs to spell **"${v.correctVersion}"**. Lots of people write **"${v.wrongVersion}"** — but that's wrong! Here's the golden rule that makes it easy: **adding a prefix never changes the base word**.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.prefix} + ${v.baseWord} = ${v.correctVersion}`,
                highlightWords: [{ word: v.correctVersion, color: "#7C3AED" }],
                label: "Prefix + word:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The golden rule: don't change the base word",
            body: (v) => `This rule is beautifully simple: when you add a prefix, keep the base word exactly as it is. No exceptions! ${v.rule}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Start with the base word: "${v.baseWord}"`, why: "Write this out first — don't change any letters" },
                  { text: `Add the prefix in front: "${v.prefix}-"`, why: `The prefix "${v.prefix}" goes right before "${v.baseWord}"` },
                  { text: `${v.prefix}- + ${v.baseWord} = ${v.correctVersion}`, why: v.doubleLetter },
                  { text: `✓ "${v.correctVersion}"`, why: "Both parts keep their full spelling — that's the rule ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Write the base word: "${v.baseWord}"`,
                `Add the prefix "${v.prefix}-" in front`,
                `Keep both parts whole — don't drop any letters`
              ],
              feedback: {
                correct: (v) => `Spot on! Write the base word first, add the prefix, and never drop a letter. You've got it! ✓`,
                incorrect: (v) => `Nearly there — always start with the base word, then add the prefix in front.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Right, you've got this! One of these is the correct spelling — can you pick it?`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is the correct spelling?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Prefix spelling recipe",
            body: () => `Here's the best bit: the base word **never changes** when you add a prefix. If this creates a double letter, that's perfectly correct! Don't be tempted to drop one.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "dis + appear = disappear (two P's from 'appear')", why: "Don't drop a letter — keep both parts whole" },
                  { text: "mis + spell = misspell (two S's)", why: "One S from 'mis', one from 'spell'" },
                  { text: "un + necessary = unnecessary (two N's)", why: "One N from 'un', one from 'necessary'" },
                  { text: "over + rule = overrule (two R's)", why: "One R from 'over', one from 'rule' ✓" }
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
        id: "prefix-spelling-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to spot when a prefix (beginning like un- or dis-) has wrongly changed the base word — a really common mistake!", "How to fix prefix spelling mistakes quickly and confidently"],
        variableSets: [
          {
            name: "Grace",
            scenario: "wrote a letter to her teacher",
            wrongSpelling: "dissatisfied",
            correctSpelling: "dissatisfied",
            wrongDisplay: "disatisfied",
            mistakeExplain: "Grace dropped the second S. 'Dis-' + 'satisfied' = 'dissatisfied' — the S from 'dis' and the S from 'satisfied' both stay.",
            testWrong: "imature",
            testCorrect: "immature",
            testOptions: ["immature", "imature", "imatture", "immatcher", "immachure"],
            testExplain: "'Im-' + 'mature' = 'immature'. The M from 'im' and the M from 'mature' both stay."
          },
          {
            name: "Finn",
            scenario: "labelled his homework folder",
            wrongSpelling: "mis-behave",
            wrongDisplay: "mis-behave",
            correctSpelling: "misbehave",
            mistakeExplain: "Adding a hyphen after the prefix is wrong — just join them together: misbehave.",
            wrongReason: "added a hyphen after the prefix",
            testWrong: "iregular",
            testCorrect: "irregular",
            testOptions: ["irregular", "iregular", "irragular", "irregullar", "iregulare"],
            testExplain: "'Ir-' + 'regular' = 'irregular'. The R from 'ir' and the R from 'regular' both stay."
          },
          {
            name: "Daisy",
            scenario: "wrote in her spelling journal",
            wrongSpelling: "unoticed",
            wrongDisplay: "unoticed",
            correctSpelling: "unnoticed",
            mistakeExplain: "Daisy dropped the second N. 'Un-' + 'noticed' = 'unnoticed' — the N from 'un' and the N from 'noticed' both stay.",
            testWrong: "overide",
            testCorrect: "override",
            testOptions: ["override", "overide", "overrid", "ovarride", "overried"],
            testExplain: "'Over-' + 'ride' = 'override'. The R from 'over' and the R from 'ride' both stay."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} ${v.scenario} and wrote **"${v.wrongDisplay}"**. Is this right, or has a letter been lost when adding the prefix?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `"${v.wrongSpelling}" — something is missing!`,
                highlightWords: [{ word: v.wrongSpelling, color: "#e74c3c" }],
                label: "Spot the error:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Check: is the base word still whole?",
            body: (v) => `${v.mistakeExplain} Here's your detective trick: always split the word into prefix + base and check both parts are complete.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Look at what was written: "${v.wrongDisplay}"`, why: "Split it into prefix + base word" },
                  { text: `The base word must stay exactly the same`, why: "Don't drop or change any letters" },
                  { text: `✓ Correct spelling: "${v.correctSpelling}"`, why: "Both prefix and base word keep their full spelling ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Someone wrote **"${v.testWrong}"**. What should it be?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix this:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the correct spelling of "${v.testWrong}"?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Superstar! ${v.testExplain} ✓`,
                incorrect: (v) => `Close! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "How to check prefix spellings",
            body: () => `You've now got a foolproof checking method! When you see a word with a prefix, split it into two parts. If the base word has been changed, the spelling is wrong. Simple as that!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Split the word: prefix + base word", why: "Find where the prefix ends and the base word starts" },
                  { text: "Check: is the base word still whole?", why: "Every letter must still be there" },
                  { text: "Double letters are fine!", why: "dis + satisfied = dissatisfied (two S's is correct)" },
                  { text: "Write both parts fully", why: "Never drop a letter to avoid a double ✓" }
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
  // SUB-CONCEPT 10: -able vs -ible
  // ==========================================
  {
    id: "able-ible",
    name: "-able vs -ible: Which Ending?",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "able-ible-steps",
        templateType: "step-by-step",
        learningGoal: ["How to decide between -able and -ible endings — there's a surprisingly simple test!", "How to use the 'complete word test' to choose the right ending with confidence"],
        variableSets: [
          {
            name: "Ella",
            scenario: "writing about a comfortable sofa in her story",
            word: "comfortable",
            baseWord: "comfort",
            ending: "-able",
            isCompleteWord: true,
            rule: "'Comfort' is a complete English word on its own, so we add '-able'.",
            testWord: "enjoyable",
            testOptions: ["enjoyable", "enjoyible", "enjoiable", "enjoyble", "enjoyeble"],
            testAnswer: "enjoyable",
            testExplain: "'Enjoy' is a complete word, so we add '-able' → 'enjoyable'."
          },
          {
            name: "Hassan",
            scenario: "describing something incredible in science class",
            word: "incredible",
            baseWord: "incred",
            ending: "-ible",
            isCompleteWord: false,
            rule: "'Incred' is NOT a complete English word, so we use '-ible'. These usually come from Latin.",
            testWord: "terrible",
            testOptions: ["terrible", "terrable", "terrble", "terriable", "terible"],
            testAnswer: "terrible",
            testExplain: "'Terr' isn't a complete word, so we use '-ible' → 'terrible'."
          },
          {
            name: "Charlie",
            scenario: "writing about how reasonable his teacher is",
            word: "reasonable",
            baseWord: "reason",
            ending: "-able",
            isCompleteWord: true,
            rule: "'Reason' is a complete English word, so we add '-able'.",
            testWord: "fashionable",
            testOptions: ["fashionable", "fashionible", "fashionabal", "fashonible", "fashionble"],
            testAnswer: "fashionable",
            testExplain: "'Fashion' is a complete word, so we add '-able' → 'fashionable'."
          },
          {
            name: "Isla",
            scenario: "looking at the visible stars through her telescope",
            word: "visible",
            baseWord: "vis",
            ending: "-ible",
            isCompleteWord: false,
            rule: "'Vis' is NOT a complete English word, so we use '-ible'. It comes from the Latin word for 'see'.",
            testWord: "possible",
            testOptions: ["possible", "possable", "possibile", "posible", "posseble"],
            testAnswer: "possible",
            testExplain: "'Poss' isn't a complete word, so we use '-ible' → 'possible'."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is it -able or -ible?`,
            body: (v) => `This is one of the trickiest spelling dilemmas in the English language! ${v.name} is ${v.scenario}. The word is **"${v.word}"**. But is it -able or -ible? There's a clever test that makes it surprisingly easy!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.word,
                highlightWords: [{ word: v.word, color: "#7C3AED" }],
                label: "Focus word:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The complete word test",
            body: (v) => `The word **"${v.word}"** uses **${v.ending}**. How do you know? Remove the ending — is what's left a complete English word? If yes → **-able**. If no → **-ible**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Take the word: "${v.word}"`, why: "Let's remove the ending and see what's left" },
                  { text: `Remove the ending → "${v.baseWord}"`, why: v.isCompleteWord ? `"${v.baseWord}" IS a complete word ✓` : `"${v.baseWord}" is NOT a complete word ✗` },
                  { text: v.isCompleteWord ? `Complete word → use -able` : `Not a complete word → use -ible`, why: v.rule },
                  { text: `✓ "${v.word}"`, why: `The ending is "${v.ending}" ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "comfortable", right: "-able (comfort is a word)" },
                { left: "incredible", right: "-ible (incred is not a word)" },
                { left: "enjoyable", right: "-able (enjoy is a word)" },
                { left: "terrible", right: "-ible (terr is not a word)" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Time to use the complete word test yourself! Is it **-able** or **-ible**? Can you pick the correct spelling?`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which of these is spelled correctly?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "-able vs -ible cheat sheet",
            body: () => `You've got a brilliant shortcut now! Use the complete word test: if the base is a real word → **-able**. If not → **-ible**. This works most of the time and puts you ahead of the game.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "-able (base IS a word): comfort→comfortable, enjoy→enjoyable", why: "-able is more common — use it when the base word stands alone" },
                  { text: "-ible (base is NOT a word): poss→possible, vis→visible", why: "-ible words usually come from Latin roots" },
                  { text: "Watch out: notice → noticeable (keep the E!)", why: "Some -able words keep the E to protect a soft C or G sound" },
                  { text: "When in doubt, -able is the safer guess", why: "About 900 words use -able but only about 200 use -ible ✓" }
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
        id: "able-ible-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to spot -able/-ible mistakes in writing — they're hiding everywhere once you start looking!", "How to apply the complete word test to fix errors like a spelling expert"],
        variableSets: [
          {
            name: "Ben",
            scenario: "wrote in his book review",
            wrongSpelling: "incredable",
            correctSpelling: "incredible",
            baseWord: "incred",
            mistakeExplain: "Ben wrote '-able' but 'incred' isn't a complete word, so it should be '-ible' → 'incredible'.",
            testWrong: "horrable",
            testCorrect: "horrible",
            testOptions: ["horrible", "horrable", "horrble", "horible", "horruble"],
            testExplain: "'Horr' isn't a complete word, so we use '-ible' → 'horrible'."
          },
          {
            name: "Evie",
            scenario: "described her holiday in a postcard",
            wrongSpelling: "noticeible",
            correctSpelling: "noticeable",
            baseWord: "notice",
            mistakeExplain: "Evie wrote '-ible' but 'notice' IS a complete word, so it should be '-able'. Plus we keep the E to protect the soft C sound → 'noticeable'.",
            testWrong: "changable",
            testCorrect: "changeable",
            testOptions: ["changeable", "changable", "changeible", "changiable", "changebale"],
            testExplain: "'Change' is a complete word → '-able'. We keep the E for the soft G sound → 'changeable'."
          },
          {
            name: "Aisha",
            scenario: "wrote a persuasive letter in class",
            wrongSpelling: "responsable",
            correctSpelling: "responsible",
            baseWord: "respons",
            mistakeExplain: "Aisha wrote '-able' but 'respons' isn't a complete word, so it should be '-ible' → 'responsible'.",
            testWrong: "sensable",
            testCorrect: "sensible",
            testOptions: ["sensible", "sensable", "senseible", "senseable", "sinsible"],
            testExplain: "'Sens' isn't a complete word, so we use '-ible' → 'sensible'."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} ${v.scenario} and wrote **"${v.wrongSpelling}"**. Has the wrong ending been used? Let's put on our detective hats and find out!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `The word "${v.wrongSpelling}" doesn't look right...`,
                highlightWords: [{ word: v.wrongSpelling, color: "#e74c3c" }],
                label: "Spot the error:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Apply the complete word test",
            body: (v) => `${v.mistakeExplain}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSpelling}" — wrong ending used`, why: "Let's test: remove the ending and check the base" },
                  { text: `Base word: "${v.baseWord}"`, why: v.baseWord.length >= 5 ? `"${v.baseWord}" IS a complete word → -able` : `"${v.baseWord}" is NOT a complete word → -ible` },
                  { text: `✓ "${v.correctSpelling}"`, why: `The correct ending gives us "${v.correctSpelling}" ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Someone wrote **"${v.testWrong}"**. What should it be?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix this:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the correct spelling of "${v.testWrong}"?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Fantastic! ${v.testExplain} ✓`,
                incorrect: (v) => `Close! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Remember the test!",
            body: () => `Whenever you're stuck on -able or -ible, you've got your trusty test: remove the ending and check the base word. It works nearly every time — you've got this!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Remove the ending (-able or -ible)", why: "What's left?" },
                  { text: "Is the base a complete English word?", why: "Yes → -able / No → -ible" },
                  { text: "Soft C or G? Keep the E!", why: "noticeable, changeable, manageable" },
                  { text: "When in doubt, try -able first", why: "It's correct about 4 times out of 5 ✓" }
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
  // SUB-CONCEPT 11: Tricky Plurals
  // ==========================================
  {
    id: "pluralisation",
    name: "Tricky Plurals",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "pluralisation-steps",
        templateType: "step-by-step",
        learningGoal: ["How to form plurals (the spelling for more than one) for words ending in -y, -f/-fe, -s/-x/-ch/-sh — not everything just adds an S!", "How to remember common irregular plurals that love to break the rules"],
        variableSets: [
          {
            name: "Daisy",
            scenario: "writing about her holiday visiting lots of cities",
            singular: "city",
            plural: "cities",
            wrongPlural: "citys",
            rule: "consonant + y",
            explanation: "'City' ends in consonant + Y. Change the Y to I and add -es: city → cities.",
            testSingular: "party",
            testPlural: "parties",
            testOptions: ["parties", "partys", "partyes", "partiez", "partees"],
            testExplain: "'Party' ends in consonant + Y → change Y to I and add -es → 'parties'."
          },
          {
            name: "Oliver",
            scenario: "writing about all the different countries he wants to visit",
            singular: "country",
            plural: "countries",
            wrongPlural: "countrys",
            rule: "consonant + y",
            explanation: "'Country' ends in consonant + Y. Change the Y to I and add -es: country → countries.",
            testSingular: "baby",
            testPlural: "babies",
            testOptions: ["babies", "babys", "babyes", "babiez", "babees"],
            testExplain: "'Baby' ends in consonant + Y → change Y to I and add -es → 'babies'."
          },
          {
            name: "Hassan",
            scenario: "writing about all the stories he has read this year",
            singular: "story",
            plural: "stories",
            wrongPlural: "storys",
            rule: "consonant + y",
            explanation: "'Story' ends in consonant + Y. Change the Y to I and add -es: story → stories.",
            testSingular: "puppy",
            testPlural: "puppies",
            testOptions: ["puppies", "puppys", "puppyes", "puppiez", "puppees"],
            testExplain: "'Puppy' ends in consonant + Y → change Y to I and add -es → 'puppies'."
          },
          {
            name: "Priya",
            scenario: "learning about irregular plurals for a test",
            singular: "child",
            plural: "children",
            wrongPlural: "childs",
            rule: "irregular",
            explanation: "'Child' is irregular — it doesn't follow any rule. You just have to learn it: child → children.",
            testSingular: "mouse",
            testPlural: "mice",
            testOptions: ["mice", "mouses", "mices", "mousies", "mousse"],
            testExplain: "'Mouse' is irregular — the plural is 'mice'. You have to learn these by heart!"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `More than one ${v.singular} — but how do you spell it?`,
            body: (v) => `${v.name} is ${v.scenario} and needs the plural of **"${v.singular}"**. Is it **"${v.wrongPlural}"**? Nope! Did you know that some plurals are much trickier than just adding -s? Let's find out why.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.singular} → ${v.plural}`,
                highlightWords: [{ word: v.plural, color: "#7C3AED" }],
                label: "How do we make it plural?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: (v) => `The "${v.rule}" plural rule`,
            body: (v) => `${v.explanation} Let's see how this works step by step:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Look at the ending: "${v.singular}"`, why: v.explanation },
                  { text: `${v.singular} → ${v.plural}`, why: `NOT "${v.wrongPlural}" — that's wrong!` },
                  { text: `More examples of this rule:`, why: v.rule === "consonant + y" ? "baby → babies, story → stories, puppy → puppies" : v.rule === "-f to -ves" ? "wolf → wolves, half → halves, shelf → shelves" : "box → boxes, wish → wishes, match → matches" },
                  { text: `The pattern is always the same`, why: `Learn the rule and it works every time ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `To make "${v.singular}" plural, we ____ to get "${v.plural}"`,
              options: (v) => [
                v.rule === "consonant + y" ? "change Y to I and add -es" : v.rule === "-f to -ves" ? "change F to V and add -es" : v.rule === "-x adds -es" ? "add -es" : "use an irregular form",
                "just add -s",
                "add -ing",
                "double the last letter"
              ],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! ${v.explanation} ✓`,
                incorrect: (v) => `Not quite — ${v.explanation}`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Let's see if you've got it! What is the plural of **"${v.testSingular}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `What is the plural of "${v.testSingular}"?`,
                highlightWords: [{ word: v.testSingular, color: "#7C3AED" }],
                label: "Make it plural:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the correct plural of "${v.testSingular}"?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testPlural,
              feedback: {
                correct: (v) => `Brilliant! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Plural rules cheat sheet",
            body: () => `Most plurals just add -s — but the tricky ones love to catch people out! Here are the patterns to remember:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Consonant + Y → change Y to I, add -es", why: "city→cities, party→parties, baby→babies" },
                  { text: "-f / -fe → change to -ves", why: "leaf→leaves, knife→knives, wolf→wolves" },
                  { text: "-s, -x, -z, -ch, -sh → add -es", why: "bus→buses, fox→foxes, church→churches" },
                  { text: "Irregulars: just learn them!", why: "child→children, mouse→mice, tooth→teeth, person→people ✓" }
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
        id: "pluralisation-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to spot incorrect plural spellings that crop up all the time in everyday writing", "How to apply the right plural rule to fix mistakes confidently"],
        variableSets: [
          {
            name: "Grace",
            scenario: "wrote a story about wildlife",
            wrongPlural: "wolfs",
            correctPlural: "wolves",
            singular: "wolf",
            mistakeExplain: "Grace wrote 'wolfs' but 'wolf' ends in F. Change the F to V and add -es → 'wolves'.",
            testWrong: "halfs",
            testCorrect: "halves",
            testOptions: ["halves", "halfs", "halfes", "halvs", "halfs"],
            testExplain: "'Half' ends in F → change to V, add -es → 'halves'."
          },
          {
            name: "Jake",
            scenario: "wrote about the shelves in the library",
            wrongPlural: "shelfs",
            correctPlural: "shelves",
            singular: "shelf",
            mistakeExplain: "Jake wrote 'shelfs' but 'shelf' ends in F. Change the F to V and add -es → 'shelves'.",
            testWrong: "leafs",
            testCorrect: "leaves",
            testOptions: ["leaves", "leafs", "leafes", "leavs", "leeves"],
            testExplain: "'Leaf' ends in F → change to V, add -es → 'leaves'."
          },
          {
            name: "Ella",
            scenario: "wrote about using knives in cooking class",
            wrongPlural: "knifes",
            correctPlural: "knives",
            singular: "knife",
            mistakeExplain: "Ella wrote 'knifes' but 'knife' ends in -FE. Change the F to V and add -S → 'knives'.",
            testWrong: "wifes",
            testCorrect: "wives",
            testOptions: ["wives", "wifes", "wifves", "wivs", "wifs"],
            testExplain: "'Wife' ends in -FE → change F to V, add -S → 'wives'."
          },
          {
            name: "Finn",
            scenario: "wrote about the calves on the farm",
            wrongPlural: "calfs",
            correctPlural: "calves",
            singular: "calf",
            mistakeExplain: "Finn wrote 'calfs' but 'calf' ends in F. Change the F to V and add -es → 'calves'.",
            testWrong: "loafs",
            testCorrect: "loaves",
            testOptions: ["loaves", "loafs", "loafes", "loavs", "loafs"],
            testExplain: "'Loaf' ends in F → change to V, add -es → 'loaves'."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} ${v.scenario} and wrote **"${v.wrongPlural}"** as the plural of **"${v.singular}"**. That doesn't look right! This is a really common mistake — can you see why it's wrong?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `"${v.wrongPlural}" — is this the right plural?`,
                highlightWords: [{ word: v.wrongPlural, color: "#e74c3c" }],
                label: "Spot the error:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the correct plural",
            body: (v) => `${v.mistakeExplain}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongPlural}" — wrong!`, why: `"${v.singular}" doesn't just add -s` },
                  { text: `✓ "${v.correctPlural}"`, why: v.mistakeExplain },
                  { text: `More examples of this rule:`, why: "wolf→wolves, leaf→leaves, shelf→shelves, knife→knives, calf→calves" },
                  { text: `The pattern: change F to V, then add -es`, why: `This works for most words ending in F or FE ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Someone wrote **"${v.testWrong}"**. What should it be?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix this:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the correct plural?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Superstar! ${v.testExplain} ✓`,
                incorrect: (v) => `Close! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Plural mistake checklist",
            body: () => `Before writing a plural, take a quick look at the ending of the singular word — it tells you exactly what to do:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Ends in consonant + Y? → Change Y to I, add -es", why: "city→cities, story→stories (but monkey→monkeys — vowel + Y!)" },
                  { text: "Ends in -f or -fe? → Change to -ves", why: "wolf→wolves, wife→wives (but roof→roofs!)" },
                  { text: "Ends in -s, -x, -ch, -sh? → Add -es", why: "fox→foxes, wish→wishes, bus→buses" },
                  { text: "Sounds weird with -s? → Probably irregular!", why: "child→children, foot→feet, goose→geese ✓" }
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
  // SUB-CONCEPT 12: Practice or Practise?
  // ==========================================
  {
    id: "noun-verb-confusables",
    name: "Practice or Practise? Advice or Advise?",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "noun-verb-confusables-steps",
        templateType: "step-by-step",
        learningGoal: ["Some words sneakily change their spelling depending on whether they are a thing (noun) or an action (verb) — like practice/practise and advice/advise", "A brilliantly simple trick to remember: C is for things, S is for actions"],
        variableSets: [
          {
            name: "Charlie",
            scenario: "writing about football after school",
            nounForm: "practice",
            verbForm: "practise",
            sentence: "I need more _____ before the match on Saturday.",
            correctChoice: "practice",
            isNoun: true,
            explanation: "Here we need the noun — 'more practice' is a thing. Nouns use C (like 'ice' — a thing).",
            testSentence: "The team _____ every Tuesday and Thursday.",
            testAnswer: "practise",
            testOptions: ["practise", "practice", "practyce", "praktise", "practize"],
            testExplain: "Here 'practise' is a verb — the team does an action. Verbs use S."
          },
          {
            name: "Isla",
            scenario: "talking to a friend who is worried about a test",
            nounForm: "advice",
            verbForm: "advise",
            sentence: "Can you give me some _____ about revision?",
            correctChoice: "advice",
            isNoun: true,
            explanation: "Here we need the noun — 'some advice' is a thing you can give. Nouns use C.",
            testSentence: "I would _____ you to start revising early.",
            testAnswer: "advise",
            testOptions: ["advise", "advice", "advize", "advyce", "addvise"],
            testExplain: "Here 'advise' is a verb — it's an action (telling someone what to do). Verbs use S."
          },
          {
            name: "Ben",
            scenario: "writing about his dad's driving licence",
            nounForm: "licence",
            verbForm: "license",
            sentence: "Dad showed his driving _____ to the policeman.",
            correctChoice: "licence",
            isNoun: true,
            explanation: "Here we need the noun — a 'driving licence' is a thing (a card). Nouns use C.",
            testSentence: "The restaurant is _____ to sell food.",
            testAnswer: "licensed",
            testOptions: ["licensed", "licenced", "lisensed", "licencsed", "lycensed"],
            testExplain: "Here 'licensed' is a verb — the restaurant is allowed to do something. Verbs use S."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `C or S? Which spelling do you need?`,
            body: (v) => `Did you know that in British English, the same word can be spelled differently depending on how you use it? ${v.name} is ${v.scenario} and needs to choose: **"${v.sentence}"** Is it **${v.nounForm}** (with a C) or **${v.verbForm}** (with an S)?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `"${v.nounForm}" (noun) vs "${v.verbForm}" (verb)`,
                highlightWords: [{ word: v.nounForm, color: "#7C3AED" }, { word: v.verbForm, color: "#22c55e" }],
                label: "Noun or verb?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "C for things, S for actions!",
            body: (v) => `Is it **"${v.nounForm}"** (with C) or **"${v.verbForm}"** (with S)? This catches out grown-ups all the time, but the rule is actually really simple:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `If the word is a THING (noun) → spell it with C`, why: `adviCe (a thing you give), praCtiCe (a thing you do), liCenCe (a card you hold)` },
                  { text: `If the word is an ACTION (verb) → spell it with S`, why: `adviSe (to tell someone), practiSe (to do something), licenSe (to allow)` },
                  { text: `Read the sentence: "${v.sentence}"`, why: v.explanation },
                  { text: `Answer: "${v.sentence.replace('_____', v.correctChoice)}"`, why: `It's a ${v.isNoun ? 'thing (noun) → C' : 'action (verb) → S'} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `In British English, nouns use ____ and verbs use S (e.g. advice vs advise)`,
              options: (v) => ["C", "S", "K", "Z"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Nouns use C (like "ice" — a thing) and verbs use S (like "advise" — an action). ✓`,
                incorrect: (v) => `Not quite — nouns use C (practice, advice, licence) and verbs use S!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Nearly there! Pick the correct word for this sentence.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "gap",
                text: v.testSentence,
                gapWord: "",
                gapHighlight: "blank",
                label: "Fill in the correct word:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word correctly completes: "${v.testSentence}"`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The C/S rule",
            body: () => `You've just learned something that most adults don't even know! In British English, these word pairs use **C for the noun** and **S for the verb**. Remember: **ice** is a thing, **advise** is an action.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "practice (noun) / practise (verb)", why: "'Football practice' (thing) vs 'I practise piano' (action)" },
                  { text: "advice (noun) / advise (verb)", why: "'Give me advice' (thing) vs 'I advise you' (action)" },
                  { text: "licence (noun) / license (verb)", why: "'A driving licence' (thing) vs 'licensed to sell' (action)" },
                  { text: "Memory trick: iCe = noun (C), adviSe = verb (S)", why: "C for the thing, S for the doing ✓" }
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
        id: "noun-verb-confusables-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to spot C/S spelling errors in sentences — you'll find them everywhere once you know the trick!", "How to tell nouns (naming words) from verbs (doing words) in context"],
        variableSets: [
          {
            name: "Aisha",
            scenario: "wrote in her diary",
            sentence: "Mum always gives me good advise about school.",
            wrongWord: "advise",
            correctWord: "advice",
            mistakeExplain: "'Good advise' is wrong because this is a noun — a thing Mum gives. Nouns use C → 'advice'.",
            testSentence: "I practise the piano every day after school.",
            testWrong: "practise",
            testCorrect: "practise",
            testIsCorrect: true,
            testOptions: ["It IS correct (verb → S)", "It should be 'practice'", "It should be 'praktise'", "It should be 'practize'", "It should be 'practes'"],
            testAnswer: "It IS correct (verb → S)",
            testExplain: "'Practise' here is a verb — an action. Verbs use S, so 'practise' is correct!"
          },
          {
            name: "Oliver",
            scenario: "wrote a letter to his headteacher",
            sentence: "Can I have a licence to practice my guitar at lunchtime?",
            wrongWord: "practice",
            correctWord: "practise",
            mistakeExplain: "'To practice' is wrong because this is a verb — an action Oliver wants to do. Verbs use S → 'practise'.",
            testSentence: "The vet has a valid licence to treat animals.",
            testWrong: "licence",
            testCorrect: "licence",
            testIsCorrect: true,
            testOptions: ["It IS correct (noun → C)", "It should be 'license'", "It should be 'lisence'", "It should be 'lycence'", "It should be 'licens'"],
            testAnswer: "It IS correct (noun → C)",
            testExplain: "'Licence' here is a noun — a thing (a document). Nouns use C, so 'licence' is correct!"
          },
          {
            name: "Daisy",
            scenario: "wrote a thank-you card",
            sentence: "Thank you for your wonderful advise about my project.",
            wrongWord: "advise",
            correctWord: "advice",
            mistakeExplain: "'Your wonderful advise' is wrong because this is a noun — a thing Daisy is thankful for. Nouns use C → 'advice'.",
            testSentence: "I would advice you to bring a coat tomorrow.",
            testWrong: "advice",
            testCorrect: "advise",
            testOptions: ["advise", "advice", "addvise", "advize", "advyce"],
            testExplain: "'I would advise you' is a verb — an action. Verbs use S → 'advise'."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} ${v.scenario} and wrote: **"${v.sentence}"** One of the C/S words is wrong! Can you find it?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.wrongWord, color: "#e74c3c" }],
                label: "Spot the mistake:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Noun or verb? C or S?",
            body: (v) => `${v.mistakeExplain}\n\n**Your C or S quick check:**\n1. Find the word (practice/advice/licence)\n2. Is it a thing (noun) or an action (verb)? Try: can you say "the ___"? → noun\n3. **Noun → C** (advi**c**e = thing), **Verb → S** (advi**s**e = action)\n4. This only applies in British English!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongWord}" — wrong C/S spelling`, why: "Is this word a noun (thing) or verb (action)?" },
                  { text: `In this sentence, it's a ${v.correctWord.includes('c') ? 'noun' : 'verb'}`, why: v.mistakeExplain },
                  { text: `✓ Should be: "${v.correctWord}"`, why: `${v.correctWord.includes('c') ? 'Nouns use C' : 'Verbs use S'} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Time to put your skills to the test! Look at this sentence: **"${v.testSentence}"** Is the underlined word correct?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "gap",
                text: v.testSentence,
                gapWord: "",
                gapHighlight: "blank",
                label: "Fill in the correct word:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Is "${v.testWrong}" correct in: "${v.testSentence}"`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Excellent! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "C or S — the quick check",
            body: () => `All you need to remember is one question: is it a thing or an action? That's it!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Is the word a THING (noun)?", why: "If yes → spell it with C" },
                  { text: "Step 2: Is the word an ACTION (verb)?", why: "If yes → spell it with S" },
                  { text: "adviCe (thing) / adviSe (action)", why: "I gave some advice. I advise you to study." },
                  { text: "praCtiCe (thing) / practiSe (action)", why: "Piano practice. I practise every day." },
                  { text: "liCenCe (thing) / licenSe (action)", why: "A driving licence. Licensed to drive. ✓" }
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
  // SUB-CONCEPT 13: Unstressed Vowels
  // ==========================================
  {
    id: "unstressed-vowels",
    name: "Unstressed Vowels — The Sneaky Letters",
    category: "other",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "unstressed-vowels-steps",
        templateType: "step-by-step",
        learningGoal: ["How to spot unstressed vowels that love to hide — these cause some of the most common spelling mistakes!", "How to use syllable-splitting (breaking a word into its beats, like def-i-nite-ly) to catch the hidden vowel"],
        variableSets: [
          {
            name: "Ella",
            scenario: "writing about what she definitely wants for her birthday",
            word: "definitely",
            wrongVersion: "definately",
            sneakyVowel: "i",
            position: "the third syllable: def-i-nite-ly",
            syllables: "def · i · nite · ly",
            trick: "Think of the word 'FINITE' hiding inside: de-FINITE-ly",
            testWord: "separately",
            testOptions: ["separately", "seperately", "separatley", "seperatly", "separitely"],
            testAnswer: "separately",
            testExplain: "Say each syllable: sep-a-rate-ly. There's an A in the middle, not an E. Think: 'there's A RAT in separately!'"
          },
          {
            name: "Hassan",
            scenario: "writing about different categories of animals",
            word: "category",
            wrongVersion: "catagory",
            sneakyVowel: "e",
            position: "the second syllable: cat-e-go-ry",
            syllables: "cat · e · go · ry",
            trick: "Say it slowly: CAT-EGG-OR-EE. The E sounds like 'egg'.",
            testWord: "jewellery",
            testOptions: ["jewellery", "jewlery", "jewellry", "jewelery", "jewlry"],
            testAnswer: "jewellery",
            testExplain: "Break it up: jew-el-le-ry. Three syllables after 'jew'. In British English, it's 'jewellery'."
          },
          {
            name: "Priya",
            scenario: "writing about her busy weekend",
            word: "business",
            wrongVersion: "buisness",
            sneakyVowel: "i",
            position: "the second syllable: bus-i-ness",
            syllables: "bus · i · ness",
            trick: "Think: there's a BUS-I-NESS. The word 'bus' is hiding at the start!",
            testWord: "interest",
            testOptions: ["interest", "intrest", "intreast", "interist", "interrest"],
            testAnswer: "interest",
            testExplain: "Say all three syllables: in-ter-est. The middle 'ter' is often swallowed when we speak quickly."
          },
          {
            name: "Charlie",
            scenario: "writing about a history lesson on Parliament",
            word: "parliament",
            wrongVersion: "parliment",
            sneakyVowel: "a (second one)",
            position: "the third syllable: par-li-a-ment",
            syllables: "par · li · a · ment",
            trick: "Think: 'I AM' hides inside: parli-A-MENT",
            testWord: "Wednesday",
            testOptions: ["Wednesday", "Wensday", "Wedensday", "Wendesday", "Wednessday"],
            testAnswer: "Wednesday",
            testExplain: "There's a hidden D and E: Wed-nes-day. Say 'Wed-NES-day' to remember the spelling."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `The vowel you can't hear!`,
            body: (v) => `Did you know your mouth secretly swallows some vowels when you speak quickly? ${v.name} is ${v.scenario} and wrote **"${v.wrongVersion}"**. It looks almost right — but a sneaky vowel has been swapped or lost!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `"${v.word}"`,
                highlightWords: [{ word: v.word, color: "#7C3AED" }],
                label: "Focus word:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Split it into syllables",
            body: (v) => `The sneaky vowel is **${v.sneakyVowel}** in ${v.position}. Here's how to find it:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Say the word SLOWLY: "${v.syllables}"`, why: "Break it into syllables and say each one clearly" },
                  { text: `The hidden vowel is: "${v.sneakyVowel}"`, why: `It's in ${v.position}` },
                  { text: `Memory trick: ${v.trick}`, why: "A trick to remember the tricky letter" },
                  { text: `✓ "${v.word}"`, why: "Now you know where the sneaky vowel hides ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Right, you've got this! One of these is the correct spelling — can you pick it?`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is the correct spelling?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "How to catch sneaky vowels",
            body: () => `Unstressed vowels all sound the same when we speak quickly — like a lazy "uh". But they're different letters in the spelling! Slow down, and you'll catch them every time.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "def-I-nite-ly (not definAtely)", why: "Think: de-FINITE-ly — 'finite' is hiding inside" },
                  { text: "sep-A-rate-ly (not sepErate)", why: "Think: there's A RAT in separately" },
                  { text: "bus-I-ness (not buIsness)", why: "Think: it starts with BUS" },
                  { text: "Say every syllable slowly and clearly", why: "The hidden vowel reveals itself when you slow down ✓" }
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
        id: "unstressed-vowels-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to spot unstressed vowel errors in writing — once you know what to look for, they pop out at you!", "How to use syllable-splitting and memory tricks to fix them for good"],
        variableSets: [
          {
            name: "Daisy",
            scenario: "wrote in her English essay",
            wrongSpelling: "seperate",
            correctSpelling: "separate",
            sneakyVowel: "a",
            mistakeExplain: "Daisy wrote 'seperate' but the hidden vowel is A, not E. Remember: there's A RAT in 'separate'!",
            testWrong: "differant",
            testCorrect: "different",
            testOptions: ["different", "differant", "diffrent", "diferent", "diffrant"],
            testExplain: "Say it slowly: dif-fer-ENT. The last syllable is '-ent', not '-ant'."
          },
          {
            name: "Jake",
            scenario: "wrote a description of a nature walk",
            wrongSpelling: "intresting",
            correctSpelling: "interesting",
            sneakyVowel: "e (second one)",
            mistakeExplain: "Jake dropped the E in the middle. Say all three syllables: in-ter-est-ing. The 'ter' syllable is easy to swallow.",
            testWrong: "temprature",
            testCorrect: "temperature",
            testOptions: ["temperature", "temprature", "temperture", "temperatue", "tempreture"],
            testExplain: "Say it slowly: tem-per-a-ture. There are four syllables — don't skip the 'per'."
          },
          {
            name: "Grace",
            scenario: "wrote an invitation to her party",
            wrongSpelling: "Febuary",
            correctSpelling: "February",
            sneakyVowel: "r (and u)",
            mistakeExplain: "Grace dropped the first R. The word has four syllables: Feb-ru-a-ry. Say 'Feb-ROO-ary' to remember the R.",
            testWrong: "libary",
            testCorrect: "library",
            testOptions: ["library", "libary", "liberry", "libray", "librery"],
            testExplain: "Say it slowly: li-bra-ry. There are two R's! Say 'LIB-rare-ee'."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} ${v.scenario} and wrote **"${v.wrongSpelling}"**. A sneaky vowel has gone wrong — but don't worry, this is one of the most common mistakes in English! Can you find the error?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `The word "${v.wrongSpelling}" doesn't look right...`,
                highlightWords: [{ word: v.wrongSpelling, color: "#e74c3c" }],
                label: "Spot the error:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Split it into syllables to find the mistake",
            body: (v) => `${v.mistakeExplain}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSpelling}" — the hidden vowel is wrong`, why: `The sneaky vowel is: ${v.sneakyVowel}` },
                  { text: `Say it slowly, syllable by syllable`, why: v.mistakeExplain },
                  { text: `✓ "${v.correctSpelling}"`, why: "The correct vowel is restored ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Someone wrote **"${v.testWrong}"**. What should it be?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix this:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the correct spelling of "${v.testWrong}"?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Superstar! ${v.testExplain} ✓`,
                incorrect: (v) => `Close! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Unstressed vowel survival guide",
            body: () => `These are some of the most commonly misspelled words in the English language — even adults struggle with them! But now you've got syllable-splitting and memory tricks, you can beat them all.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Say every syllable clearly and slowly", why: "The hidden vowel appears when you slow down" },
                  { text: "Learn memory tricks for the worst ones", why: "de-FINITE-ly, A RAT in separate, BUS-i-ness" },
                  { text: "Write the tricky word out 5 times", why: "Your hand learns the spelling even when your ear can't hear it" },
                  { text: "When in doubt, look it up!", why: "There's no shame in checking — even adults get these wrong ✓" }
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
  // SUB-CONCEPT 14: Rules for Adding Suffixes
  // ==========================================
  {
    id: "suffix-adding-rules",
    name: "Rules for Adding Suffixes",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "suffix-adding-rules-steps",
        templateType: "step-by-step",
        learningGoal: ["How to apply the three suffix (word ending) rules: drop the E, double the consonant, change Y to I — three rules that cover almost everything!", "How to decide which rule to use so you get it right first time"],
        variableSets: [
          {
            name: "Oliver",
            scenario: "writing about hoping to win the race",
            baseWord: "hope",
            suffix: "-ing",
            wrongVersion: "hopeing",
            correctVersion: "hoping",
            rule: "drop the silent E",
            explanation: "'Hope' ends in a silent E. When adding a vowel suffix (-ing), drop the E: hope → hoping.",
            keepExample: "hopeful",
            keepExplain: "But before a consonant suffix (-ful), we KEEP the E: hope → hopeful.",
            testBase: "make",
            testSuffix: "-ing",
            testWord: "making",
            testOptions: ["making", "makeing", "makking", "macking", "makng"],
            testAnswer: "making",
            testExplain: "'Make' ends in silent E. Drop the E before '-ing' → 'making'."
          },
          {
            name: "Aisha",
            scenario: "writing about running in PE",
            baseWord: "run",
            suffix: "-ing",
            wrongVersion: "runing",
            correctVersion: "running",
            rule: "double the final consonant",
            explanation: "'Run' has a short vowel (u) followed by a single consonant (n). Double the consonant before a vowel suffix: run → running.",
            keepExample: "runner",
            keepExplain: "The same doubling happens with other vowel suffixes: run → runner.",
            testBase: "sit",
            testSuffix: "-ing",
            testWord: "sitting",
            testOptions: ["sitting", "siting", "siteing", "sittng", "siiting"],
            testAnswer: "sitting",
            testExplain: "'Sit' has a short vowel (i) + single consonant (t). Double the T → 'sitting'."
          },
          {
            name: "Priya",
            scenario: "describing how happiness spread through the classroom",
            baseWord: "happy",
            suffix: "-ness",
            wrongVersion: "happyness",
            correctVersion: "happiness",
            rule: "change Y to I",
            explanation: "'Happy' ends in consonant + Y. Change the Y to I before adding the suffix: happy → happiness.",
            keepExample: "happying",
            keepExplain: "Exception: before '-ing', we keep the Y: carry → carrying (not carriing).",
            testBase: "beauty",
            testSuffix: "-ful",
            testWord: "beautiful",
            testOptions: ["beautiful", "beautyful", "beutiful", "beautifel", "beautyfull"],
            testAnswer: "beautiful",
            testExplain: "'Beauty' ends in consonant + Y. Change Y to I → 'beautiful'."
          },
          {
            name: "Finn",
            scenario: "writing about the beginning of a story",
            baseWord: "begin",
            suffix: "-ing",
            wrongVersion: "begining",
            correctVersion: "beginning",
            rule: "double the final consonant",
            explanation: "'Begin' — the stress is on the LAST syllable (be-GIN), which has a short vowel + single consonant. Double the N: begin → beginning.",
            keepExample: "beginner",
            keepExplain: "Same rule for other vowel suffixes: begin → beginner.",
            testBase: "forget",
            testSuffix: "-ing",
            testWord: "forgetting",
            testOptions: ["forgetting", "forgeting", "forggeting", "forgettin", "foregetting"],
            testAnswer: "forgetting",
            testExplain: "'Forget' is stressed on the last syllable (for-GET), short vowel + single T. Double the T → 'forgetting'."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What happens when you add "${v.suffix}"?`,
            body: (v) => `Here's a spelling puzzle! ${v.name} is ${v.scenario}. Adding **"${v.suffix}"** to **"${v.baseWord}"** — is it **"${v.wrongVersion}"**? Nope! There's a handy rule that tells you exactly what to do.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.wrong}  or  ${v.correct}?`,
                highlightWords: [{ word: v.wrong, color: "#e74c3c" }, { word: v.correct, color: "#22c55e" }],
                label: "Which is correct?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: (v) => `Rule: ${v.rule}`,
            body: (v) => `${v.explanation}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Start with: "${v.baseWord}"`, why: "Look at the ending of the base word" },
                  { text: `Rule: ${v.rule}`, why: v.explanation },
                  { text: `${v.baseWord} + ${v.suffix} = ${v.correctVersion}`, why: "Apply the rule before adding the suffix" },
                  { text: `Also: "${v.keepExample}"`, why: v.keepExplain + " ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `You've got this! What is **"${v.testBase}"** + **"${v.testSuffix}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.testBase} + ${v.testSuffix} = ?`,
                highlightWords: [{ word: v.testBase, color: "#7C3AED" }],
                label: "What's the correct spelling?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is "${v.testBase}" + "${v.testSuffix}"?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Three suffix rules to remember",
            body: () => `You've now got three powerful rules in your toolkit! Before adding a suffix, just check the base word ending and pick the right one:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Silent E? Drop it before vowel suffixes", why: "hope→hoping, make→making (but hopeful — keep E before consonant)" },
                  { text: "Short vowel + single consonant? Double it", why: "run→running, sit→sitting, begin→beginning" },
                  { text: "Consonant + Y? Change Y to I", why: "happy→happiness, beauty→beautiful (but carry→carrying — keep Y before -ing)" },
                  { text: "Ask: what's the last letter? What's the suffix?", why: "The ending of the base word tells you which rule to use ✓" }
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
        id: "suffix-adding-rules-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to spot suffix-adding (word ending) errors in writing — these pop up all the time!", "How to apply the correct rule to fix the mistake quickly and confidently"],
        variableSets: [
          {
            name: "Isla",
            scenario: "wrote in her story about a race",
            wrongSpelling: "runing",
            correctSpelling: "running",
            baseWord: "run",
            suffix: "-ing",
            mistakeExplain: "Isla forgot to double the N. 'Run' has a short vowel + single consonant, so we double: run → running.",
            testWrong: "stoping",
            testCorrect: "stopping",
            testOptions: ["stopping", "stoping", "stoppng", "stoping", "stooping"],
            testExplain: "'Stop' has a short vowel (o) + single consonant (p). Double the P → 'stopping'."
          },
          {
            name: "Ben",
            scenario: "wrote a diary entry about moving house",
            wrongSpelling: "hopeing",
            correctSpelling: "hoping",
            baseWord: "hope",
            suffix: "-ing",
            mistakeExplain: "Ben kept the silent E. Before a vowel suffix like '-ing', drop the E: hope → hoping.",
            testWrong: "writeing",
            testCorrect: "writing",
            testOptions: ["writing", "writeing", "writting", "writting", "writng"],
            testAnswer: "writing",
            testExplain: "'Write' ends in silent E. Drop the E before '-ing' → 'writing'."
          },
          {
            name: "Ella",
            scenario: "wrote a book review",
            wrongSpelling: "happyness",
            correctSpelling: "happiness",
            baseWord: "happy",
            suffix: "-ness",
            mistakeExplain: "Ella forgot to change the Y to I. 'Happy' ends in consonant + Y → change Y to I before '-ness': happiness.",
            testWrong: "lazyer",
            testCorrect: "lazier",
            testOptions: ["lazier", "lazyer", "lazyier", "laziar", "lazeir"],
            testExplain: "'Lazy' ends in consonant + Y. Change Y to I → 'lazier'."
          },
          {
            name: "Hassan",
            scenario: "wrote about an exciting science experiment",
            wrongSpelling: "exciteing",
            correctSpelling: "exciting",
            baseWord: "excite",
            suffix: "-ing",
            mistakeExplain: "Hassan kept the silent E. 'Excite' ends in E — drop it before '-ing': excite → exciting.",
            testWrong: "carring",
            testCorrect: "carrying",
            testOptions: ["carrying", "carring", "carriing", "carryng", "careing"],
            testExplain: "Watch out — 'carry' ends in Y, and before '-ing' we KEEP the Y: carry → carrying."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} ${v.scenario} and wrote **"${v.wrongSpelling}"**. A suffix rule has been broken — can you spot which one? This is a really common slip-up!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `The word "${v.wrongSpelling}" doesn't look right...`,
                highlightWords: [{ word: v.wrongSpelling, color: "#e74c3c" }],
                label: "Spot the error:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the rule that was broken",
            body: (v) => `${v.mistakeExplain}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSpelling}" — suffix rule not followed`, why: `Base word: "${v.baseWord}" + suffix: "${v.suffix}"` },
                  { text: `The rule: ${v.mistakeExplain}`, why: "Check the base word ending, then apply the rule" },
                  { text: `✓ "${v.correctSpelling}"`, why: `Now the suffix rule is followed correctly ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Someone wrote **"${v.testWrong}"**. What should it be?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix this:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the correct spelling?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Superstar! ${v.testExplain} ✓`,
                incorrect: (v) => `Close! ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Suffix rules — quick checklist",
            body: () => `You're now a suffix expert! Before adding a suffix, just run through this quick checklist:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Silent E + vowel suffix → drop the E", why: "hope→hoping, excite→exciting, write→writing" },
                  { text: "Short vowel + single consonant → double it", why: "run→running, stop→stopping, begin→beginning" },
                  { text: "Consonant + Y + suffix → change Y to I", why: "happy→happiness, lazy→lazier, beauty→beautiful" },
                  { text: "BUT: Y + -ing → keep the Y!", why: "carry→carrying, study→studying, play→playing ✓" }
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

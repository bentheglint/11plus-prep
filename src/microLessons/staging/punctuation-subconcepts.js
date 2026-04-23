// ============================================================
// Supplementary sub-concepts for Punctuation (English)
// To merge: add these to lessonBank.punctuation.subConcepts array in lessonData.js
// ============================================================

export const punctuationSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: apostrophe-contraction
  // Apostrophes in contractions — the apostrophe replaces missing letters
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "apostrophe-contraction",
    name: "Apostrophes in Contractions",
    category: "core",
    lessons: [
      // ---- Lesson A: Step-by-step ----
      {
        id: "apostrophe-contraction-steps",
        templateType: "step-by-step",
        learningGoal: [
          "What happens when you squash two words together into a contraction (a shortened word like don't or I'm) — and why everyone does it!",
          "The secret the apostrophe (the ' mark) is hiding — it marks the exact spot where letters disappeared"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "writing a letter to her pen pal in Scotland",
            fullPhrase: "I am",
            contraction: "I'm",
            missingLetters: "a",
            sentence: "I'm really excited to visit Edinburgh this summer.",
            fullSentence: "I am really excited to visit Edinburgh this summer.",
            testFull: "do not",
            testContraction: "don't",
            testMissing: "o",
            testSentence: "I don't want to miss the castle!"
          },
          {
            name: "Charlie",
            scenario: "writing a story for his English homework",
            fullPhrase: "they are",
            contraction: "they're",
            missingLetters: "a",
            sentence: "They're going on a treasure hunt in the woods.",
            fullSentence: "They are going on a treasure hunt in the woods.",
            testFull: "can not",
            testContraction: "can't",
            testMissing: "no",
            testSentence: "We can't find the last clue!"
          },
          {
            name: "Priya",
            scenario: "texting her friend about the school play",
            fullPhrase: "it is",
            contraction: "it's",
            missingLetters: "i",
            sentence: "It's going to be the best play ever!",
            fullSentence: "It is going to be the best play ever!",
            testFull: "we have",
            testContraction: "we've",
            testMissing: "ha",
            testSentence: "We've been practising every lunchtime."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Where did the missing letters go?`,
            body: (v) => `${v.name} is ${v.scenario} and wrote:\n\n**"${v.sentence}"**\n\nSee that little floating comma? That's an **apostrophe** — and it's hiding a secret! **${v.contraction}** is actually **${v.fullPhrase}** squashed together. The apostrophe marks the spot where the missing letters used to be!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.contraction, color: "#7C3AED" }],
                label: "Spot the contraction:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The squash-and-mark trick!",
            body: (v) => `Think of contractions like squashing two words together and leaving a little marker where you removed the letters. It's like a treasure map — the apostrophe says "letters were buried here!"`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: "Start with two words: \"do not\"", why: "These are the full, boring, long versions!" },
                  { text: "Squash them together and remove letters: drop the \"o\"", why: "We're making it snappier — like how you'd actually say it" },
                  { text: "Stick an apostrophe where the letter was: don't", why: "The ' is like a flag saying \"a letter used to live here!\"" },
                  { text: `${v.fullPhrase} → ${v.contraction}`, why: `The "${v.missingLetters}" vanished and ' took its place!` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Take the two words: "${v.fullPhrase}"`,
                `Find which letter(s) to remove: "${v.missingLetters}"`,
                `Put the apostrophe where the missing letter(s) were`,
                `Result: "${v.contraction}"`
              ],
              feedback: {
                correct: (v) => `Nailed it! Squash, remove, mark — you've got the recipe! ✓`,
                incorrect: (v) => `Nearly! Remember: start with the two full words, then squash them together.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Now you try!",
            body: (v) => `Time to squash some words! **"${v.testFull}"** — what does it become when you contract it?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testSentence,
                highlightWords: [],
                label: "Check the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the contraction of "${v.testFull}"?`,
              getOptions: (v) => [
                v.testContraction,
                v.testFull.replace(" ", ""),
                v.testFull.replace(" ", "'"),
                v.testFull.replace(" ", "-"),
                v.testFull
              ],
              correctAnswer: (v) => v.testContraction,
              feedback: {
                correct: (v) => `You've got it! "${v.testFull}" squashes down to **${v.testContraction}** — the "${v.testMissing}" disappeared and the apostrophe took its place! ✓`,
                incorrect: (v) => `So close! "${v.testFull}" becomes **${v.testContraction}**. The apostrophe sits right where the "${v.testMissing}" used to be.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Contractions — you've got this!",
            body: () => `Here's everything you need to remember:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "A contraction squashes two words into one", why: "It's how people actually talk — quicker and more natural!" },
                  { text: "The apostrophe marks the spot where letters vanished", why: "Think of it as a little flag: \"letters were here!\"" },
                  { text: "Learn the big ones: don't, can't, it's, I'm, they're, we've", why: "You'll see these in almost every exam paper — knowing them is like a superpower!" },
                  { text: "Secret check: expand it back into two words", why: "If 'don't' turns back into 'do not', you nailed it! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot-the-mistake ----
      {
        id: "apostrophe-contraction-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "You'll become an apostrophe detective — spotting missing or wrongly placed apostrophes (the ' mark) in contractions (shortened words)",
          "The sneaky mistakes that trip people up with contractions — and how to dodge them"
        ],
        variableSets: [
          {
            name: "Oliver",
            scenario: "checking his friend's homework",
            wrongSentence: "I cant wait for the school trip to London!",
            correctSentence: "I can't wait for the school trip to London!",
            mistake: "forgot the apostrophe in 'can't'",
            rule: "can't = can not — the apostrophe replaces the missing 'o'",
            testWrong: "We do'nt need our coats today.",
            testCorrect: "We don't need our coats today.",
            testExplain: "The apostrophe goes where the 'o' in 'not' was removed — don't, NOT do'nt"
          },
          {
            name: "Grace",
            scenario: "proofreading her book review",
            wrongSentence: "The author does'nt explain why the dragon left.",
            correctSentence: "The author doesn't explain why the dragon left.",
            mistake: "put the apostrophe in the wrong place",
            rule: "doesn't = does not — the apostrophe replaces the 'o' in 'not'",
            testWrong: "She is'nt coming to the party on Saturday.",
            testCorrect: "She isn't coming to the party on Saturday.",
            testExplain: "isn't = is not — the apostrophe replaces the 'o' in 'not', so it goes between the n and t"
          },
          {
            name: "Zara",
            scenario: "editing her diary entry",
            wrongSentence: "Theyve already eaten all the biscuits!",
            correctSentence: "They've already eaten all the biscuits!",
            mistake: "forgot the apostrophe in 'they've'",
            rule: "they've = they have — the apostrophe replaces the 'ha'",
            testWrong: "We,re going to the seaside tomorrow!",
            testCorrect: "We're going to the seaside tomorrow!",
            testExplain: "We're = we are — you need an apostrophe ('), not a comma (,)"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Spot the sneaky mistake!",
            body: (v) => `${v.name} is ${v.scenario} — but one contraction has gone wrong! Can you find it?\n\n**"${v.wrongSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Spot the punctuation issue:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's what went wrong!",
            body: (v) => `Oops! ${v.name} ${v.mistake}. This is one of the most common mistakes — even grown-ups get it wrong sometimes!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSentence}"`, why: `${v.name} ${v.mistake}` },
                  { text: `✓ "${v.correctSentence}"`, why: v.rule },
                  { text: "Golden rule: the apostrophe goes EXACTLY where the letters were removed", why: "Not before, not after — right in the spot where the letters used to live!" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "do not", right: "don't" },
                { left: "can not", right: "can't" },
                { left: "does not", right: "doesn't" },
                { left: "they have", right: "they've" },
                { left: "we are", right: "we're" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Fix this sentence!",
            body: (v) => `Which version is correct?\n\n**"${v.testWrong}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is the correct version?`,
              getOptions: (v) => [
                v.testCorrect,
                v.testWrong,
                v.testWrong.replace("'", "").replace(",", ""),
                v.testCorrect.replace("'", "`"),
                v.testCorrect.replace("n't", "n,t")
              ],
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Well done! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! The correct version is: **"${v.testCorrect}"**. ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Avoid these contraction mistakes",
            body: () => `When you proofread, always check your contractions!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Never forget the apostrophe: cant → can't", why: "Without it, 'cant' is a completely different word!" },
                  { text: "Put the apostrophe where the letter was removed", why: "does not → doesn't (NOT does'nt)" },
                  { text: "Use an apostrophe, not a comma: we're (NOT we,re)", why: "Commas and apostrophes look similar but do very different jobs" },
                  { text: "Quick check: can you expand it back to two words?", why: "If can't = can not, you've placed it correctly ✓" }
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
  // SUB-CONCEPT 2: apostrophe-possession
  // Apostrophes showing ownership — singular, plural, irregular
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "apostrophe-possession",
    name: "Apostrophes for Possession",
    category: "core",
    lessons: [
      // ---- Lesson A: Step-by-step ----
      {
        id: "apostrophe-possession-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll discover how one tiny apostrophe (the ' mark) can show that something belongs to someone",
          "The trick to knowing where the apostrophe goes when one person owns something versus when lots of people do — singular and plural possession (ownership)"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "labelling things at school",
            singularOwner: "the dog",
            singularItem: "bone",
            singularPossessive: "the dog's bone",
            pluralOwner: "the dogs",
            pluralItem: "kennel",
            pluralPossessive: "the dogs' kennel",
            irregularOwner: "the children",
            irregularItem: "playground",
            irregularPossessive: "the children's playground",
            testPhrase: "the cat's toy",
            testMeaning: "the toy belonging to one cat"
          },
          {
            name: "Finn",
            scenario: "writing about animals in his nature project",
            singularOwner: "the horse",
            singularItem: "saddle",
            singularPossessive: "the horse's saddle",
            pluralOwner: "the horses",
            pluralItem: "field",
            pluralPossessive: "the horses' field",
            irregularOwner: "the women",
            irregularItem: "race",
            irregularPossessive: "the women's race",
            testPhrase: "the teacher's desk",
            testMeaning: "the desk belonging to one teacher"
          },
          {
            name: "Maisie",
            scenario: "making name labels for the class hamster project",
            singularOwner: "the girl",
            singularItem: "bag",
            singularPossessive: "the girl's bag",
            pluralOwner: "the girls",
            pluralItem: "changing room",
            pluralPossessive: "the girls' changing room",
            irregularOwner: "the men",
            irregularItem: "football team",
            irregularPossessive: "the men's football team",
            testPhrase: "the boy's coat",
            testMeaning: "the coat belonging to one boy"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Who does it belong to?",
            body: (v) => `${v.name} is ${v.scenario}. ${v.name} needs to show that things **belong** to someone.\n\nFor example: **${v.singularPossessive}** means the ${v.singularItem} belonging to ${v.singularOwner}.\n\nBut here's the tricky bit — where does the apostrophe go? It depends on whether there's ONE owner or MORE THAN ONE!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.singularPossessive} — ${v.pluralPossessive}`,
                highlightWords: [{ word: v.singularPossessive, color: "#7C3AED" }, { word: v.pluralPossessive, color: "#22c55e" }],
                label: "One owner vs many:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Three rules — and they're easier than you think!",
            body: (v) => `We saw **${v.singularPossessive}** and **${v.pluralPossessive}** — notice the apostrophe (the ' mark) is in a different place! Once you learn these three rules, you'll nail possessive apostrophes every time:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Singular (one owner): add 's → ${v.singularPossessive}`, why: `One ${v.singularOwner.replace("the ", "")}, so apostrophe then s — easy!` },
                  { text: `Plural ending in s: add just ' → ${v.pluralPossessive}`, why: `More than one ${v.singularOwner.replace("the ", "")} — the s is already there, so just pop the apostrophe after it` },
                  { text: `Irregular plural (no s): add 's → ${v.irregularPossessive}`, why: `"${v.irregularOwner.replace("the ", "")}" doesn't end in s, so treat it like singular — sneaky!` },
                  { text: "NEVER put an apostrophe on pronouns: its, yours, hers, theirs", why: "Pronouns already show ownership — they don't need any help!" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "One dog's bone", right: "Add 's (singular)" },
                { left: "The dogs' kennel", right: "Add just ' (plural ending in s)" },
                { left: "The children's toys", right: "Add 's (irregular plural)" },
                { left: "its, yours, theirs", right: "No apostrophe (pronouns)" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What does **"${v.testPhrase}"** mean?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testPhrase,
                highlightWords: [{ word: v.testPhrase, color: "#7C3AED" }],
                label: "What does this mean?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What does "${v.testPhrase}" mean?`,
              getOptions: (v) => [
                v.testMeaning,
                v.testMeaning.replace("one", "many"),
                `More than one ${v.testPhrase.split("'")[0].replace("the ", "")}`,
                `The ${v.testPhrase.split("'s ")[1] || v.testPhrase.split("' ")[1]} is a ${v.testPhrase.split("'")[0].replace("the ", "")}`,
                "It is a contraction (two words joined)"
              ],
              correctAnswer: (v) => v.testMeaning,
              feedback: {
                correct: (v) => `Superstar! **"${v.testPhrase}"** means ${v.testMeaning}. You've cracked the code! ✓`,
                incorrect: (v) => `So close! **"${v.testPhrase}"** means **${v.testMeaning}**. When you see 's on a singular noun, it means belonging to — you'll get it next time!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Possessive apostrophes — you've got this!",
            body: () => `Here's your recipe for showing ownership — follow it and you'll never go wrong:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "One owner → add 's: the dog's bone", why: "Singular nouns always get apostrophe + s — the easiest rule!" },
                  { text: "More than one (ends in s) → add ': the dogs' bones", why: "The s is already there doing its job, so just pop the apostrophe after it" },
                  { text: "Irregular plurals → add 's: the children's toys", why: "Children doesn't end in s, so treat it like singular — this catches people out!" },
                  { text: "NEVER on pronouns: its, yours, hers, ours, theirs", why: "These already mean 'belonging to' — no apostrophe needed. That's a superpower for the exam! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot-the-mistake ----
      {
        id: "apostrophe-possession-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "You'll sharpen your eye for possessive (ownership) apostrophes that have wandered to the wrong spot",
          "A surprising rule — why pronouns (words like he, she, it, they) never need an apostrophe to show ownership"
        ],
        variableSets: [
          {
            name: "Leo",
            scenario: "marking his younger sister's writing",
            wrongSentence: "The teacher's all agreed the trips' destination was perfect.",
            correctSentence: "The teachers all agreed the trip's destination was perfect.",
            mistake: "put an apostrophe on 'teachers' (no possession) and on 'trips' (wrong place)",
            rule: "'teachers' here is just a plural (more than one teacher) — no apostrophe needed. 'Trip's' shows the destination belongs to the trip",
            testWrong: "The dog wagged it's tail happily.",
            testCorrect: "The dog wagged its tail happily.",
            testExplain: "'its' (no apostrophe) means 'belonging to it'. 'it's' with an apostrophe means 'it is' or 'it has'"
          },
          {
            name: "Amara",
            scenario: "proofreading the school newsletter",
            wrongSentence: "The boy's were excited about the team's new kit.",
            correctSentence: "The boys were excited about the team's new kit.",
            mistake: "put an apostrophe on 'boys' when it's just a plural — they don't own anything in this sentence",
            rule: "Only use a possessive apostrophe when something BELONGS to someone. 'boys' here just means 'more than one boy'",
            testWrong: "The childrens' coats were left on the floor.",
            testCorrect: "The children's coats were left on the floor.",
            testExplain: "'children' is an irregular plural — it doesn't end in s, so add 's (children's), not s' (childrens')"
          },
          {
            name: "Seb",
            scenario: "checking his creative writing before handing it in",
            wrongSentence: "Both girl's looked at each others' drawing's.",
            correctSentence: "Both girls looked at each other's drawings.",
            mistake: "added apostrophes to plurals 'girls' and 'drawings', and wrote 'others'' instead of 'other's'",
            rule: "Only add an apostrophe when showing possession. Plain plurals (more than one) never have an apostrophe",
            testWrong: "The babies' toys were in their's baskets.",
            testCorrect: "The babies' toys were in their baskets.",
            testExplain: "'babies'' is correct (toys belonging to more than one baby), but 'theirs' is a pronoun — NEVER add an apostrophe to pronouns"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Apostrophe alert — something's wrong!",
            body: (v) => `${v.name} is ${v.scenario}. Something is wrong here — can you be the detective?\n\n**"${v.wrongSentence}"**\n\nApostrophes have snuck into the wrong places!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Spot the punctuation issue:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's where it all went wrong!",
            body: (v) => `${v.name} ${v.mistake}.\n\nDon't worry — this is one of the most common mistakes in English, and even adults get it wrong!\n\n**Rule:** ${v.rule}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: "${v.wrongSentence}"`, why: v.mistake },
                  { text: `RIGHT: "${v.correctSentence}"`, why: v.rule },
                  { text: "Ask yourself: does something BELONG to this word?", why: "If yes → apostrophe. If it's just 'more than one' → no apostrophe. Simple!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `Plural nouns (like "dogs" or "books") always need an apostrophe`, answer: false, explanation: `No way! Plain plurals (more than one) never need an apostrophe. Only add one when showing possession (belonging). You've got this! ✓` },
                { text: `Pronouns like "its", "yours" and "theirs" never need an apostrophe for possession`, answer: true, explanation: `Spot on! Pronouns already show ownership without an apostrophe. "It's" with an apostrophe means "it is". ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn to fix it!",
            body: (v) => `Which version is correct?\n\n**"${v.testWrong}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is the correct version?`,
              getOptions: (v) => {
                const opts = new Set([v.testCorrect, v.testWrong]);
                // Generate distractors that are different from correct and wrong
                const noApostrophe = v.testWrong.replace(/'/g, "");
                if (noApostrophe !== v.testCorrect && noApostrophe !== v.testWrong) opts.add(noApostrophe);
                const swapped = v.testCorrect.includes("'s") ? v.testCorrect.replace("'s", "s'") : v.testCorrect.replace("s'", "'s");
                if (swapped !== v.testCorrect && swapped !== v.testWrong) opts.add(swapped);
                const allApostrophe = v.testCorrect.replace(/s /g, "'s ");
                if (allApostrophe !== v.testCorrect && allApostrophe !== v.testWrong && !opts.has(allApostrophe)) opts.add(allApostrophe);
                // Ensure exactly 5 options
                const wrongNoSpace = v.testWrong.replace("' ", "'s ");
                if (opts.size < 5 && wrongNoSpace !== v.testCorrect && wrongNoSpace !== v.testWrong && !opts.has(wrongNoSpace)) opts.add(wrongNoSpace);
                const doubleApostrophe = v.testCorrect.replace(/(\w)'s/g, "$1's'");
                if (opts.size < 5 && !opts.has(doubleApostrophe)) opts.add(doubleApostrophe);
                const result = [...opts];
                while (result.length < 5) result.push(v.testWrong.replace(".", "!"));
                return result.slice(0, 5);
              },
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Well done! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! The correct version is: **"${v.testCorrect}"**. ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Possessive apostrophes — nailed it!",
            body: () => `Before you hand in any writing, run through this checklist. It only takes a few seconds and it'll make your work shine:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Does something BELONG to this word? If not, no apostrophe", why: "Plain plurals (cats, dogs, books) never need an apostrophe — don't let them trick you!" },
                  { text: "One owner ending in s? Add 's: the boss's office", why: "Yes, even when the word already ends in s — that surprises a lot of people!" },
                  { text: "More than one owner ending in s? Add just ': the dogs' leads", why: "The s is already there doing its job" },
                  { text: "Never put apostrophes on pronouns: its, yours, theirs", why: "Pronouns already show ownership — getting this right makes examiners go 'wow'! ✓" }
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
  // SUB-CONCEPT 3: capital-letters
  // When to use capital letters — and when NOT to
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "capital-letters",
    name: "Capital Letter Rules",
    category: "core",
    lessons: [
      // ---- Lesson A: Step-by-step ----
      {
        id: "capital-letters-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll learn the real rules for when a word deserves a capital letter — it's not as many as you'd think!",
          "The words that look like they should have capitals but actually don't — and how to tell the difference"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "writing a postcard from her holiday in Cornwall",
            sentenceStart: "The beach in Cornwall was amazing.",
            properNoun: "Cornwall",
            properNounType: "a place",
            monthDay: "on Saturday in July",
            noCapital: "summer",
            noCapitalReason: "seasons",
            testSentence: "last march, we visited the tower of london on a tuesday.",
            testCorrect: "Last March, we visited the Tower of London on a Tuesday.",
            testFixes: "Last (sentence start), March (month), Tower of London (proper noun), Tuesday (day)"
          },
          {
            name: "Reuben",
            scenario: "writing a diary entry about his weekend",
            sentenceStart: "We went to London for the weekend.",
            properNoun: "London",
            properNounType: "a city",
            monthDay: "on Friday in December",
            noCapital: "winter",
            noCapitalReason: "seasons",
            testSentence: "in september, my family drove to edinburgh to visit grandma jones.",
            testCorrect: "In September, my family drove to Edinburgh to visit Grandma Jones.",
            testFixes: "In (sentence start), September (month), Edinburgh (place), Grandma Jones (name/title)"
          },
          {
            name: "Isla",
            scenario: "writing invitations for her birthday party",
            sentenceStart: "Isla is having a party!",
            properNoun: "Isla",
            properNounType: "a person's name",
            monthDay: "on Sunday in March",
            noCapital: "autumn",
            noCapitalReason: "seasons",
            testSentence: "dear sophie, please come to my party at westbourne park on saturday.",
            testCorrect: "Dear Sophie, please come to my party at Westbourne Park on Saturday.",
            testFixes: "Dear (sentence start), Sophie (name), Westbourne Park (place), Saturday (day)"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Did you know some words DEMAND a capital?",
            body: (v) => `${v.name} is ${v.scenario}. ${v.name} wrote: **"${v.sentenceStart}"**\n\nThe first word has a capital letter — but which OTHER words need capitals? Some words are divas and insist on being capitalised! Let's find out which ones.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentenceStart,
                highlightWords: [{ word: v.properNoun, color: "#7C3AED" }],
                label: "Which words need capitals?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Four rules that cover (almost) everything!",
            body: (v) => `In ${v.name}'s sentence, **"${v.properNoun}"** needs a capital because it's a ${v.properNounType}. Good news — there are only four rules to learn, and you probably know most of them already:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: "Rule 1: The first word of every sentence", why: `"${v.sentenceStart}" — the first word always gets a capital. The easiest one!` },
                  { text: "Rule 2: Names of people, places and things (proper nouns)", why: `${v.properNoun} is ${v.properNounType} — proper nouns always get the VIP treatment` },
                  { text: `Rule 3: Days of the week and months of the year`, why: `${v.monthDay} — both get capitals (they're special enough to earn them!)` },
                  { text: `Rule 4: The word 'I' is always a capital`, why: "Even in the middle of a sentence: 'Then I went home' — because you're important!" },
                  { text: `NOT seasons: ${v.noCapital} has no capital`, why: `Here's the sneaky one — ${v.noCapitalReason} are common nouns, not proper nouns. This catches loads of people out!` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `Days and months need capitals, but ____ do not`,
              options: (v) => ["seasons", "proper nouns", "names", "places"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Seasons (spring, summer, autumn, winter) don't need capitals — knowing that is a superpower for the exam! ✓`,
                incorrect: (v) => `Nearly! Seasons like spring and summer don't need capitals, unlike days and months. This one trips up loads of people!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Fix the capitals!",
            body: (v) => `This sentence needs fixing:\n\n**"${v.testSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testSentence,
                highlightWords: [],
                label: "Fix the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is the correctly capitalised version?`,
              getOptions: (v) => [
                v.testCorrect,
                v.testSentence,
                v.testCorrect.replace(v.testCorrect.split(" ")[0], v.testCorrect.split(" ")[0].toLowerCase()),
                v.testSentence.toUpperCase(),
                v.testSentence.charAt(0).toUpperCase() + v.testSentence.slice(1)
              ],
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Brilliant! You spotted every single one: ${v.testFixes}. ✓`,
                incorrect: (v) => `So close! The correct version is: **"${v.testCorrect}"**. Capitals needed: ${v.testFixes}. You'll nail it next time!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Capitals — you've cracked the code!",
            body: () => `Remember: capitals are for special words, not just any word you feel like! Here's your cheat sheet:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Start of a sentence: always a capital", why: "The easiest rule — you've been doing this for years!" },
                  { text: "Proper nouns: names of people, places, titles", why: "London, Mrs Smith, River Thames — they're important enough to earn a big letter" },
                  { text: "Days and months: Monday, January", why: "But NOT seasons: spring, summer, autumn, winter — remember this exam trick!" },
                  { text: "The word 'I': always a capital letter", why: "Because you're important — you deserve a big letter! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot-the-mistake ----
      {
        id: "capital-letters-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "You'll become a capital letter detective — catching ones that are missing AND ones that shouldn't be there",
          "Why 'summer' doesn't get a capital but 'Monday' does — the surprising rules that catch people out"
        ],
        variableSets: [
          {
            name: "Ethan",
            scenario: "checking his geography homework",
            wrongSentence: "in Autumn, we visited the lake district with our Teacher.",
            correctSentence: "In autumn, we visited the Lake District with our teacher.",
            mistake: "capitalised 'Autumn' (a season) and 'Teacher' (common noun) but forgot to capitalise 'In' (sentence start) and 'Lake District' (proper noun)",
            rule: "Seasons and common nouns like 'teacher' don't need capitals, but proper nouns and sentence starts do",
            testWrong: "my Family went to paris in Summer to see the eiffel tower.",
            testCorrect: "My family went to Paris in summer to see the Eiffel Tower.",
            testExplain: "'My' (sentence start), 'Paris' and 'Eiffel Tower' (proper nouns) need capitals. 'family' and 'summer' don't"
          },
          {
            name: "Rosie",
            scenario: "editing the class newspaper",
            wrongSentence: "The Head Teacher, mrs williams, spoke at the Assembly on friday.",
            correctSentence: "The head teacher, Mrs Williams, spoke at the assembly on Friday.",
            mistake: "capitalised 'Head Teacher' and 'Assembly' (common nouns) but missed 'Mrs Williams' (name) and 'Friday' (day)",
            rule: "Job titles and events like 'assembly' are common nouns. Names and days of the week are proper nouns",
            testWrong: "on wednesday, Doctor patel visited our School to talk about Healthy eating.",
            testCorrect: "On Wednesday, Doctor Patel visited our school to talk about healthy eating.",
            testExplain: "'On' (sentence start), 'Wednesday' (day), 'Doctor Patel' (title + name) need capitals. 'school', 'healthy', 'eating' don't"
          },
          {
            name: "Noah",
            scenario: "proofreading his history essay",
            wrongSentence: "queen victoria ruled for many Years and lived in buckingham palace.",
            correctSentence: "Queen Victoria ruled for many years and lived in Buckingham Palace.",
            mistake: "forgot to capitalise 'Queen Victoria' (title + name) and 'Buckingham Palace' (proper noun), and wrongly capitalised 'Years'",
            rule: "Titles with names (Queen Victoria) and place names (Buckingham Palace) need capitals, but ordinary words like 'years' don't",
            testWrong: "king henry viii built Hampton court Palace near the river thames.",
            testCorrect: "King Henry VIII built Hampton Court Palace near the River Thames.",
            testExplain: "'King Henry VIII' (title + name), 'Hampton Court Palace' (place), and 'River Thames' (proper noun) all need capitals"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Capital letter chaos — can you fix it?",
            body: (v) => `${v.name} is ${v.scenario}. This sentence is a mess — capitals everywhere they shouldn't be, and missing where they should!\n\n**"${v.wrongSentence}"**\n\nCan you spot what's gone wrong?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Spot the punctuation issue:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's where it went wrong!",
            body: (v) => `${v.name} ${v.mistake}.\n\nThis is really common — even grown-ups muddle up which words deserve capitals!\n\n**Rule:** ${v.rule}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: "${v.wrongSentence}"`, why: v.mistake },
                  { text: `RIGHT: "${v.correctSentence}"`, why: v.rule },
                  { text: "Ask: is this a proper noun (name of a specific thing)?", why: "If yes → capital. If it's a general word → no capital. That one question solves almost everything!" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Now you try!",
            body: (v) => `Which version has the capitals in all the right places?\n\n**"${v.testWrong}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is correctly capitalised?`,
              getOptions: (v) => [
                v.testCorrect,
                v.testWrong,
                v.testWrong.charAt(0).toUpperCase() + v.testWrong.slice(1),
                v.testCorrect.toUpperCase(),
                v.testCorrect.toLowerCase()
              ],
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Brilliant! ${v.testExplain}. ✓`,
                incorrect: (v) => `Not quite! The correct version is: **"${v.testCorrect}"**. ${v.testExplain}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Capital letters — sorted!",
            body: () => `Before you hand in any writing, run through this quick checklist. It takes ten seconds and could save you marks:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Does the sentence start with a capital? If not, add one", why: "The most basic rule — you'd be surprised how often people miss it!" },
                  { text: "Are all proper nouns capitalised? (names, places, titles)", why: "London, Mrs Smith, the River Thames — they deserve the big letter treatment" },
                  { text: "Are days and months capitalised?", why: "Monday, January — but NOT spring or summer (remember the trick!)" },
                  { text: "Have you wrongly capitalised any common nouns?", why: "Words like 'teacher', 'school', 'assembly' don't need capitals — catching this makes your writing look really polished ✓" }
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
  // SUB-CONCEPT 4: commas-lists
  // Using commas to separate items in a list
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "commas-lists",
    name: "Commas in Lists",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step-by-step ----
      {
        id: "commas-lists-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll discover why commas are like the gaps between items on a shelf — they keep everything in a list neat and clear",
          "The big question: do you put a comma before 'and' or 'or' at the end of a list? You'll find out!"
        ],
        variableSets: [
          {
            name: "Kai",
            scenario: "writing a shopping list for his mum's birthday party",
            items: ["balloons", "streamers", "cake", "candles"],
            withCommas: "balloons, streamers, cake and candles",
            withOxford: "balloons, streamers, cake, and candles",
            noCommas: "balloons streamers cake and candles",
            testItems: ["apples", "bananas", "grapes", "oranges", "pears"],
            testCorrect: "apples, bananas, grapes, oranges and pears",
            testWrong: "apples bananas, grapes oranges, and pears"
          },
          {
            name: "Poppy",
            scenario: "describing what she packed for her school trip",
            items: ["a raincoat", "wellies", "a packed lunch", "a water bottle"],
            withCommas: "a raincoat, wellies, a packed lunch and a water bottle",
            withOxford: "a raincoat, wellies, a packed lunch, and a water bottle",
            noCommas: "a raincoat wellies a packed lunch and a water bottle",
            testItems: ["red", "blue", "green", "yellow", "purple"],
            testCorrect: "red, blue, green, yellow and purple",
            testWrong: "red blue, green, yellow, and, purple"
          },
          {
            name: "Dev",
            scenario: "listing his favourite sports for a class survey",
            items: ["football", "cricket", "swimming", "tennis"],
            withCommas: "football, cricket, swimming and tennis",
            withOxford: "football, cricket, swimming, and tennis",
            noCommas: "football cricket swimming and tennis",
            testItems: ["a pencil", "a ruler", "an eraser", "a sharpener", "a pen"],
            testCorrect: "a pencil, a ruler, an eraser, a sharpener and a pen",
            testWrong: "a pencil, a ruler an eraser, a sharpener, and a pen"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Imagine reading a list with no commas...",
            body: (v) => `${v.name} is ${v.scenario}. ${v.name} needs to write a list of items in a sentence.\n\nWithout commas: **"${v.noCommas}"** — yikes, that's a jumbled mess!\n\nWith commas: **"${v.withCommas}"** — ahh, much better! Commas are like little signposts between each item.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.withCommas,
                highlightWords: [],
                label: "Items separated by commas:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The simplest comma rule there is!",
            body: (v) => `${v.name}'s list **"${v.withCommas}"** uses commas to separate the items. The rule is beautifully simple: put a **comma** after every item in a list, except the last one (which usually has **'and'** or **'or'** before it).`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Write the first item: "${v.items[0]}"`, why: "No comma needed yet — just get started!" },
                  { text: `Add a comma, then the next item: "${v.items[0]}, ${v.items[1]}"`, why: "The comma tells your reader 'here comes another one!'" },
                  { text: `Keep going: "${v.items[0]}, ${v.items[1]}, ${v.items[2]}"`, why: "A comma after every item except the last — you're getting the hang of it!" },
                  { text: `Add 'and' before the last item: "${v.withCommas}"`, why: "Use 'and' (or 'or') instead of a comma before the final item — like a finishing flourish" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Write the first item`,
                `Add a comma after each item`,
                `Use 'and' or 'or' before the last item`,
                `Check: no comma after 'and'`
              ],
              feedback: {
                correct: (v) => `Perfect order! You've got the recipe down! ✓`,
                incorrect: (v) => `Nearly! Start by writing the first item, then add commas between each one. You'll get it!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which sentence has the commas in the right places?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testItems.join('  /  '),
                highlightWords: [],
                label: "Put these into a sentence with commas:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which list is punctuated correctly?`,
              getOptions: (v) => [
                v.testCorrect,
                v.testWrong,
                v.testItems.join(" "),
                v.testItems.join(", "),
                v.testItems.join(" and ")
              ],
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Nailed it! Commas between each item, 'and' before the last one — you make it look easy! ✓`,
                incorrect: (v) => `So close! The correct version is: **"${v.testCorrect}"**. Put a comma after every item except the last, where you use 'and'. You'll get it next time!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "List commas — easy as 1, 2, 3!",
            body: () => `You've got this! Here's how to punctuate a list every single time:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Put a comma after each item in the list", why: "Think of commas as little separators keeping everything tidy" },
                  { text: "Use 'and' or 'or' before the last item", why: "This is the finishing touch that tells your reader the list is done" },
                  { text: "No comma before 'and' in standard British English", why: "Write: apples, oranges and bananas (NOT apples, oranges, and bananas)" },
                  { text: "Read it aloud — pause where the commas are", why: "Your ear is actually a brilliant comma detector! If it sounds natural, you've nailed it ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot-the-mistake ----
      {
        id: "commas-lists-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "You'll hunt for missing and extra commas in lists — like a proofreading pro",
          "Why leaving out a comma can make your sentence say something completely different from what you meant!"
        ],
        variableSets: [
          {
            name: "Maya",
            scenario: "checking her recipe write-up in food technology",
            wrongSentence: "You will need flour sugar, eggs butter, and milk.",
            correctSentence: "You will need flour, sugar, eggs, butter and milk.",
            mistake: "missed commas after 'flour' and 'eggs', making it unclear where each item starts and ends",
            rule: "Every item in a list needs a comma after it (except the last, which gets 'and')",
            testWrong: "For the trip, bring a coat a hat, gloves, and, a scarf.",
            testCorrect: "For the trip, bring a coat, a hat, gloves and a scarf.",
            testExplain: "Each item needs a comma after it. Don't put a comma after 'and' — 'and' replaces the final comma"
          },
          {
            name: "Tyler",
            scenario: "writing up his science experiment",
            wrongSentence: "We used a beaker a thermometer, a stopwatch and, test tubes.",
            correctSentence: "We used a beaker, a thermometer, a stopwatch and test tubes.",
            mistake: "missed the comma after 'beaker' and put one after 'and' instead of before it",
            rule: "Commas go BETWEEN items. 'And' comes before the final item with no comma after it",
            testWrong: "The colours of the rainbow are red orange, yellow green, blue, indigo and violet.",
            testCorrect: "The colours of the rainbow are red, orange, yellow, green, blue, indigo and violet.",
            testExplain: "Every colour needs a comma after it except the last one (violet), which has 'and' before it"
          },
          {
            name: "Layla",
            scenario: "editing her animal fact file",
            wrongSentence: "Lions eat zebras, wildebeest and, gazelles, and buffalo.",
            correctSentence: "Lions eat zebras, wildebeest, gazelles and buffalo.",
            mistake: "put a comma after 'and' and used 'and' twice",
            rule: "Only use 'and' once — before the very last item in the list",
            testWrong: "My favourite subjects are maths English, science, art, and, music.",
            testCorrect: "My favourite subjects are maths, English, science, art and music.",
            testExplain: "Put a comma after each subject. 'And' goes before the last one (music), with no comma after 'and'"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "This list is a comma disaster!",
            body: (v) => `${v.name} is ${v.scenario}. This list has gone wrong — the commas are all over the place!\n\n**"${v.wrongSentence}"**\n\nCan you spot what needs fixing?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Spot the punctuation issue:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's what went wrong!",
            body: (v) => `${v.name} ${v.mistake}. Don't worry — comma mistakes in lists are super common!\n\n**Rule:** ${v.rule}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: "${v.wrongSentence}"`, why: v.mistake },
                  { text: `RIGHT: "${v.correctSentence}"`, why: v.rule },
                  { text: "Top tip: read the list aloud and pause at each comma", why: "If it sounds choppy or confusing, your commas need fixing!" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — fix this list!",
            body: (v) => `Which version is correct?\n\n**"${v.testWrong}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which list is punctuated correctly?`,
              getOptions: (v) => [
                v.testCorrect,
                v.testWrong,
                v.testCorrect.replace(/, /g, " "),
                v.testWrong.replace("and,", "and"),
                v.testCorrect.replace(" and ", ", and, ")
              ],
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Brilliant! ${v.testExplain} ✓`,
                incorrect: (v) => `Close! The correct version is: **"${v.testCorrect}"**. ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "List commas — you've got this!",
            body: () => `Quick check before you hand in your writing — run every list through this:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Every item needs a comma after it", why: "Keeps each item separate and clear — no jumbled mess!" },
                  { text: "The last item gets 'and' (or 'or') instead", why: "This is how your reader knows the list is wrapping up" },
                  { text: "Never put a comma AFTER 'and'", why: "'and' replaces the comma — you don't need both. This catches loads of people out!" },
                  { text: "Read it aloud to check it sounds right", why: "Your ear is actually brilliant at spotting dodgy commas! ✓" }
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
  // SUB-CONCEPT 5: commas-clauses
  // Commas with subordinate clauses and connectives
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "commas-clauses",
    name: "Commas with Clauses and Connectives",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step-by-step ----
      {
        id: "commas-clauses-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll learn the golden rule: when a clause (a group of words with a verb) kicks off your sentence, pop a comma after it",
          "How commas team up with connectives (linking words) like 'However' and 'Meanwhile' to glue your ideas together smoothly"
        ],
        variableSets: [
          {
            name: "Freya",
            scenario: "writing a story about a brave knight",
            subordinateClause: "Although the dragon was enormous",
            mainClause: "the knight stood her ground",
            fullSentence: "Although the dragon was enormous, the knight stood her ground.",
            reversed: "The knight stood her ground although the dragon was enormous.",
            connective: "However",
            connectiveSentence: "However, the dragon was not finished yet.",
            testSentence: "Because it was raining heavily the match was cancelled.",
            testCorrect: "Because it was raining heavily, the match was cancelled.",
            testRule: "The subordinate clause ('Because it was raining heavily') comes first, so you need a comma before the main clause"
          },
          {
            name: "Liam",
            scenario: "writing a newspaper report about the school fete",
            subordinateClause: "After the rain finally stopped",
            mainClause: "the children rushed outside to the stalls",
            fullSentence: "After the rain finally stopped, the children rushed outside to the stalls.",
            reversed: "The children rushed outside to the stalls after the rain finally stopped.",
            connective: "Meanwhile",
            connectiveSentence: "Meanwhile, the teachers were setting up the barbecue.",
            testSentence: "When the bell rang loudly everyone lined up in the playground.",
            testCorrect: "When the bell rang loudly, everyone lined up in the playground.",
            testRule: "The subordinate clause ('When the bell rang loudly') comes first, so you need a comma to separate it from the main clause"
          },
          {
            name: "Halima",
            scenario: "writing a book review for the class display",
            subordinateClause: "Even though the ending was sad",
            mainClause: "I thought it was a brilliant book",
            fullSentence: "Even though the ending was sad, I thought it was a brilliant book.",
            reversed: "I thought it was a brilliant book even though the ending was sad.",
            connective: "Furthermore",
            connectiveSentence: "Furthermore, the author used wonderful descriptions.",
            testSentence: "Since the characters felt so real I could not put the book down.",
            testCorrect: "Since the characters felt so real, I could not put the book down.",
            testRule: "The subordinate clause ('Since the characters felt so real') comes first, so a comma separates it from the main clause"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "One sentence has a comma, one doesn't — why?",
            body: (v) => `${v.name} is ${v.scenario}. Here's a puzzle — look at these two sentences:\n\n1. **"${v.fullSentence}"**\n2. **"${v.reversed}"**\n\nSentence 1 has a comma. Sentence 2 doesn't. Same words, different order. So what's going on?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.fullSentence,
                highlightWords: [{ word: v.connective || v.subordinateClause, color: "#7C3AED" }],
                label: "Spot the clause:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The 'extra bit first' rule!",
            body: (v) => `In ${v.name}'s first sentence, the **subordinate clause** (think of it as a bonus fact that can't stand alone) **"${v.subordinateClause}"** comes BEFORE the main clause (the main part that makes sense on its own). When the bonus bit comes first, pop a **comma** between them.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Subordinate clause first → COMMA → main clause`, why: `"${v.subordinateClause}, ${v.mainClause}." — the comma is the join!` },
                  { text: "Main clause first → usually NO comma", why: `"${v.reversed}" flows naturally without one — nice and easy` },
                  { text: `Connectives at the start need a comma too`, why: `"${v.connectiveSentence}" — always a comma after '${v.connective}'. Always!` },
                  { text: "Look for starters: Although, Because, When, If, After, However, Meanwhile", why: "Spotting these words is like having a superpower — they're your comma clue!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `When a subordinate clause comes ____ the main clause, you need a comma between them`,
              options: (v) => ["before", "after", "inside", "without"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Bonus bit first, then a comma, then the main clause. You've got it! ✓`,
                incorrect: (v) => `Nearly! When the subordinate clause comes BEFORE the main clause, you need a comma between them. Think: extra bit first = comma needed!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Add the comma!",
            body: (v) => `This sentence needs a comma:\n\n**"${v.testSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testSentence,
                highlightWords: [],
                label: "Fix the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which version has the comma in the right place?`,
              getOptions: (v) => {
                const words = v.testSentence.split(" ");
                const midIndex = Math.floor(words.length / 2);
                const commaAfterMid = [...words.slice(0, midIndex), words[midIndex] + ",", ...words.slice(midIndex + 1)].join(" ");
                return [...new Set([
                  v.testCorrect,
                  v.testSentence,
                  v.testSentence.replace(" ", ", "),
                  v.testSentence.slice(0, -1) + ", .",
                  commaAfterMid
                ])];
              },
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Well done! ${v.testRule}. ✓`,
                incorrect: (v) => `Not quite! The correct version is: **"${v.testCorrect}"**. ${v.testRule}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Clauses and commas — sorted!",
            body: () => `This rule makes your writing flow beautifully. Once you've got it, your sentences will sound really polished:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "If the subordinate clause comes FIRST → add a comma", why: "'Although it rained, we still had fun.' — the comma is the bridge!" },
                  { text: "If the main clause comes first → usually no comma", why: "'We still had fun although it rained.' — it flows naturally" },
                  { text: "Connectives at the start always get a comma", why: "'However, the weather improved later.' — no exceptions!" },
                  { text: "Starters to watch for: Although, Because, When, If, After, Since", why: "Spot one of these at the start and you know a comma is coming. That's exam gold! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot-the-mistake ----
      {
        id: "commas-clauses-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "You'll train your eye to catch missing commas after clauses (groups of words with a verb) — the mistake almost everyone makes",
          "The tricky spots where commas and connectives (linking words) go wrong — and how to get them right every time"
        ],
        variableSets: [
          {
            name: "Archie",
            scenario: "marking his own writing in English class",
            wrongSentence: "Although he had practised for weeks he still felt nervous before the concert.",
            correctSentence: "Although he had practised for weeks, he still felt nervous before the concert.",
            mistake: "forgot the comma after the subordinate clause 'Although he had practised for weeks'",
            rule: "When a subordinate clause comes first, you MUST put a comma before the main clause",
            testWrong: "However the team did not give up and they scored in the last minute.",
            testCorrect: "However, the team did not give up and they scored in the last minute.",
            testExplain: "'However' is a connective at the start of the sentence — it always needs a comma after it"
          },
          {
            name: "Niamh",
            scenario: "proofreading her persuasive letter",
            wrongSentence: "Because, the park is used by many families, it should stay open.",
            correctSentence: "Because the park is used by many families, it should stay open.",
            mistake: "put a comma right after 'Because' instead of at the end of the subordinate clause",
            rule: "The comma goes at the END of the subordinate clause, not right after the first word",
            testWrong: "If, you recycle more rubbish there will be less waste in landfill.",
            testCorrect: "If you recycle more rubbish, there will be less waste in landfill.",
            testExplain: "The comma goes after the whole subordinate clause ('If you recycle more rubbish'), not right after 'If'"
          },
          {
            name: "Toby",
            scenario: "checking his adventure story before printing",
            wrongSentence: "While, the pirates searched the cave the treasure lay hidden under the waterfall.",
            correctSentence: "While the pirates searched the cave, the treasure lay hidden under the waterfall.",
            mistake: "put the comma in the wrong place — after 'While' instead of after the whole clause",
            rule: "Find where the subordinate clause ends, then put the comma there",
            testWrong: "Before, the sun set behind the mountains the explorers set up camp.",
            testCorrect: "Before the sun set behind the mountains, the explorers set up camp.",
            testExplain: "The subordinate clause is 'Before the sun set behind the mountains' — the comma goes at the end of this whole clause"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "The comma's gone walkabout!",
            body: (v) => `${v.name} is ${v.scenario}. This sentence has a comma problem — it's either missing or in completely the wrong place!\n\n**"${v.wrongSentence}"**\n\nCan you figure out where it should be?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Spot the punctuation issue:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the fix!",
            body: (v) => `${v.name} ${v.mistake}. This is a really common mistake — the tricky part is figuring out where the subordinate clause ends!\n\n**Rule:** ${v.rule}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: "${v.wrongSentence}"`, why: v.mistake },
                  { text: `RIGHT: "${v.correctSentence}"`, why: v.rule },
                  { text: "Find the subordinate clause first, then put the comma at its end", why: "Think of the comma as a bridge between the two parts — it goes right at the join!" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Now you have a go!",
            body: (v) => `Which version has the comma in the right place?\n\n**"${v.testWrong}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is correctly punctuated?`,
              getOptions: (v) => [
                v.testCorrect,
                v.testWrong,
                v.testWrong.replace(",", ""),
                v.testCorrect.replace(",", ",,"),
                v.testSentence || v.testWrong.replace(", ", " ").replace(" ", ", ")
              ],
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Superstar! ${v.testExplain}. ✓`,
                incorrect: (v) => `Not quite! The correct version is: **"${v.testCorrect}"**. ${v.testExplain}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Comma placement — you've cracked it!",
            body: () => `Here's the rule one more time. Getting this right will make your writing sound really professional:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Find the subordinate clause (the 'bonus fact' part)", why: "It often starts with Although, Because, When, If, After, While — these are your clue words!" },
                  { text: "If it comes FIRST → comma at the END of that clause", why: "'Although it rained, we had fun.' NOT 'Although, it rained we had fun.' — big difference!" },
                  { text: "Connectives (However, Meanwhile, Furthermore) get a comma right after", why: "'However, the plan worked.' — always, always, always a comma after the connective" },
                  { text: "Read it aloud — pause where the comma should be", why: "A natural pause usually shows you exactly where the comma belongs. Trust your ear! ✓" }
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
  // SUB-CONCEPT 6: speech-marks
  // Using speech marks (inverted commas) for direct speech
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "speech-marks",
    name: "Speech Marks",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step-by-step ----
      {
        id: "speech-marks-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll master how to wrap someone's exact words in speech marks — so readers can hear the characters talking",
          "Where all the little punctuation marks go around speech — the comma, full stop, and capital letter each have their own spot"
        ],
        variableSets: [
          {
            name: "Ruby",
            scenario: "writing a story about two friends at the seaside",
            speaker: "Ruby",
            speech: "Let's build a sandcastle!",
            reportingClause: "shouted Ruby",
            fullDirect: '"Let\'s build a sandcastle!" shouted Ruby.',
            response: '"That sounds brilliant," replied Amir.',
            responseNote: "comma inside the closing speech mark, then the reporting clause",
            testSpeech: "I can see a dolphin",
            testSpeaker: "whispered Ella",
            testCorrect: '"I can see a dolphin," whispered Ella.',
            testWrong: '"I can see a dolphin" whispered Ella.'
          },
          {
            name: "Amir",
            scenario: "writing dialogue for his playscript homework",
            speaker: "Amir",
            speech: "Watch out for that wave!",
            reportingClause: "called Amir",
            fullDirect: '"Watch out for that wave!" called Amir.',
            response: '"I am completely soaked," laughed Priya.',
            responseNote: "comma before the closing speech mark when followed by 'who said it'",
            testSpeech: "This is the best day ever",
            testSpeaker: "said Marcus",
            testCorrect: '"This is the best day ever," said Marcus.',
            testWrong: '"This is the best day ever" said Marcus.'
          },
          {
            name: "Zainab",
            scenario: "retelling a conversation she had with her grandma",
            speaker: "Grandma",
            speech: "Would you like some cake?",
            reportingClause: "asked Grandma",
            fullDirect: '"Would you like some cake?" asked Grandma.',
            response: '"Yes please!" replied Zainab.',
            responseNote: "exclamation mark inside the speech marks, then the reporting clause",
            testSpeech: "Where did you put the map",
            testSpeaker: "asked Dad",
            testCorrect: '"Where did you put the map?" asked Dad.',
            testWrong: '"Where did you put the map" asked Dad?'
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Did you know speech has its own uniform?",
            body: (v) => `${v.name} is ${v.scenario}. When a character speaks, you need **speech marks** (also called inverted commas) to wrap around their exact words — like a uniform that says "someone is talking!"\n\n${v.fullDirect}\n\nLet's learn the rules!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.fullDirect,
                highlightWords: [],
                label: "Read the speech:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Four rules — and your dialogue will look amazing!",
            body: (v) => `Look at ${v.name}'s dialogue: ${v.fullDirect}. Follow these four rules and your dialogue will be spot-on every time:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: 'Rule 1: Speech marks go around the EXACT words spoken', why: '"Let\'s go!" — only the spoken words go inside the marks. Nothing else sneaks in!' },
                  { text: "Rule 2: Capital letter at the start of the speech", why: '"Let\'s go!" — spoken words always start with a capital, like a mini-sentence' },
                  { text: "Rule 3: Punctuation goes INSIDE the closing speech mark", why: '"Let\'s go!" NOT "Let\'s go"! — this one catches out even adults!' },
                  { text: "Rule 4: Use a comma (not a full stop) before 'said/asked/shouted'", why: '"Hello," said Tom. NOT "Hello." said Tom. — the comma keeps everything connected' }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Open speech marks before the spoken words`,
                `Start with a capital letter`,
                `Put punctuation INSIDE the closing speech mark`,
                `Use a comma before 'said' or 'asked'`
              ],
              feedback: {
                correct: (v) => `Perfect! You've nailed the order — open marks, capital letter, punctuation inside, comma before the reporting clause. ✓`,
                incorrect: (v) => `Nearly! Start by opening the speech marks, then use a capital letter for the first spoken word. You'll get it!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Punctuate this speech!",
            body: (v) => `${v.testSpeaker.split(" ")[1] || v.testSpeaker} says: "${v.testSpeech}"\n\nWhich is correctly punctuated?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is correctly punctuated?`,
              getOptions: (v) => [
                v.testCorrect,
                v.testWrong,
                `${v.testSpeaker}, "${v.testSpeech}."`,
                `"${v.testSpeech}", ${v.testSpeaker}`,
                `${v.testSpeaker} "${v.testSpeech}".`
              ],
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Well done! Speech marks around the words, punctuation inside, and a comma or question mark before the reporting clause. ✓`,
                incorrect: (v) => `Not quite! The correct version is: **${v.testCorrect}**. Remember: speech marks around the exact words, punctuation INSIDE the closing mark.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Speech marks — you're a pro now!",
            body: () => `Every time you write dialogue, follow this recipe. Getting speech marks right makes your stories look really polished:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Open speech marks before the first spoken word", why: 'Start with " — the door to what someone says' },
                  { text: "Capital letter for the first word of speech", why: '"Hello" not "hello" — spoken words deserve the big letter treatment' },
                  { text: "Punctuation goes INSIDE the closing speech mark", why: '"Hello!" not "Hello"! — this is the one examiners always check for' },
                  { text: "Use a comma before 'said/asked/shouted'", why: '"Hello," said Tom — comma replaces the full stop. That\'s your secret weapon! ✓' }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot-the-mistake ----
      {
        id: "speech-marks-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "You'll become a speech mark detective — catching errors that even adults miss in their writing",
          "The sneaky punctuation mistakes people make inside speech marks — and how to avoid every single one"
        ],
        variableSets: [
          {
            name: "Jasper",
            scenario: "editing his adventure story",
            wrongSentence: '"Come quickly" said Jasper "I found something amazing".',
            correctSentence: '"Come quickly," said Jasper. "I found something amazing."',
            mistake: "forgot the comma after 'quickly', and the spoken words each need their own speech marks with punctuation inside",
            rule: "Each piece of speech gets its own speech marks, and punctuation goes inside the closing mark",
            testWrong: 'Olivia said "where are we going".',
            testCorrect: 'Olivia said, "Where are we going?"',
            testExplain: "Capital W because it's the start of speech, question mark because it's a question, and both go inside the speech marks",
            testOptions: [
              'Olivia said, "Where are we going?"',
              'Olivia said "where are we going".',
              'Olivia said "Where are we going?"',
              'Olivia said, "where are we going?"',
              'Olivia said, "Where are we going"?'
            ]
          },
          {
            name: "Phoebe",
            scenario: "proofreading her fairy tale",
            wrongSentence: '"I dont believe it!" Said the queen. "This is impossible"!',
            correctSentence: '"I don\'t believe it!" said the queen. "This is impossible!"',
            mistake: "capitalised 'Said' (no capital after speech marks unless it's a new sentence) and put the exclamation mark outside the closing speech mark",
            rule: "The reporting clause (said the queen) doesn't start with a capital. All punctuation goes INSIDE the speech marks",
            testWrong: '"Run!" Shouted the guard. "The dragon is coming"!',
            testCorrect: '"Run!" shouted the guard. "The dragon is coming!"',
            testExplain: "'shouted' doesn't need a capital (it's part of the same sentence), and the exclamation mark goes INSIDE the speech marks",
            testOptions: [
              '"Run!" shouted the guard. "The dragon is coming!"',
              '"Run!" Shouted the guard. "The dragon is coming"!',
              '"Run!" Shouted the guard. "The dragon is coming!"',
              '"Run!" shouted the guard. "The dragon is coming"!',
              '"Run"! shouted the guard. "The dragon is coming!"'
            ]
          },
          {
            name: "Marcus",
            scenario: "checking his dialogue homework",
            wrongSentence: 'Tom said "I love football." "Me too." replied Jack.',
            correctSentence: 'Tom said, "I love football." "Me too," replied Jack.',
            mistake: "forgot the comma after 'said' and used a full stop instead of a comma before 'replied'",
            rule: "Put a comma before opening speech marks and use a comma (not a full stop) before the reporting clause",
            testWrong: 'Mum asked "did you finish your homework."',
            testCorrect: 'Mum asked, "Did you finish your homework?"',
            testExplain: "Add a comma after 'asked', capitalise 'Did' (start of speech), and use a question mark (not full stop) because it's a question",
            testOptions: [
              'Mum asked, "Did you finish your homework?"',
              'Mum asked "did you finish your homework."',
              'Mum asked "Did you finish your homework?"',
              'Mum asked, "did you finish your homework."',
              'Mum asked, "Did you finish your homework."'
            ]
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "This dialogue is full of mistakes!",
            body: (v) => `${v.name} is ${v.scenario}. This dialogue has gone wrong — can you be the punctuation detective?\n\n**${v.wrongSentence}**\n\nWhat's gone wrong here?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Spot the punctuation issue:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's what went wrong!",
            body: (v) => `${v.name} ${v.mistake}. Don't worry — speech mark mistakes are incredibly common, but once you know what to look for, they're easy to fix!\n\n**Rule:** ${v.rule}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: ${v.wrongSentence}`, why: v.mistake },
                  { text: `RIGHT: ${v.correctSentence}`, why: v.rule },
                  { text: "Three quick checks: capital at start, punctuation inside, comma before reporting clause", why: "Run through these three and you'll catch almost every speech mark error — like a cheat code!" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn to fix it!",
            body: (v) => `Which version is correctly punctuated?\n\n**${v.testWrong}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is correctly punctuated?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Brilliant! ${v.testExplain}. ✓`,
                incorrect: (v) => `Close! The correct version is: **${v.testCorrect}**. ${v.testExplain}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Speech marks — three checks and you're golden!",
            body: () => `Before you hand in any writing with dialogue, run through these checks. They'll make your stories look really professional:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Capital letter at the start of each piece of speech", why: '"Hello," not "hello," — the spoken words get the VIP treatment' },
                  { text: "All punctuation (. , ! ?) goes INSIDE the closing speech mark", why: '"Stop!" not "Stop"! — this is the one that catches out grown-ups too!' },
                  { text: "No capital letter on 'said/asked/shouted' after speech", why: '"Hello," said Tom (lowercase s) — the speech and reporting clause are one sentence' },
                  { text: "New speaker = new paragraph (new line)", why: "This makes it crystal clear who is talking. Examiners love this! ✓" }
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
  // SUB-CONCEPT 7: question-exclamation
  // Question marks and exclamation marks
  // Category: other
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "question-exclamation",
    name: "Question Marks and Exclamation Marks",
    category: "other",
    lessons: [
      // ---- Lesson A: Step-by-step ----
      {
        id: "question-exclamation-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll discover when a sentence is really asking something — and needs a question mark instead of a boring full stop",
          "When a sentence is bursting with excitement, surprise, or a command — that's when the exclamation mark gets its moment!"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "writing interview questions for the school newspaper",
            question: "What is your favourite subject?",
            statement: "My favourite subject is science.",
            exclamation: "That is amazing!",
            command: "Tell me more about it!",
            testSentence: "How many goals did you score",
            testCorrect: "How many goals did you score?",
            testWhy: "It's a question — it asks for information, so it needs a question mark"
          },
          {
            name: "Jack",
            scenario: "writing a comic strip about superheroes",
            question: "Where did the villain go?",
            statement: "The villain escaped through the window.",
            exclamation: "Stop right there!",
            command: "We must catch him now!",
            testSentence: "Watch out for the laser beam",
            testCorrect: "Watch out for the laser beam!",
            testWhy: "It's a warning/command with strong feeling — it needs an exclamation mark"
          },
          {
            name: "Sienna",
            scenario: "writing a quiz for her friends",
            question: "Which planet is closest to the Sun?",
            statement: "Mercury is the closest planet to the Sun.",
            exclamation: "I cannot believe you got that right!",
            command: "Quick, answer the next one!",
            testSentence: "Can you name all the continents",
            testCorrect: "Can you name all the continents?",
            testWhy: "It's a question starting with 'Can you' — it asks someone to do something, so it ends with ?"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Three endings, three completely different moods!",
            body: (v) => `${v.name} is ${v.scenario}. Did you know the mark at the end of a sentence completely changes its personality?\n\n**"${v.question}"** — asking something (curious!)\n**"${v.statement}"** — telling something (calm)\n**"${v.exclamation}"** — strong feeling (dramatic!)\n\nHow do you pick the right one?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.question} / ${v.statement} / ${v.exclamation}`,
                highlightWords: [],
                label: "Three types of sentence:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "One question that solves everything!",
            body: (v) => `We saw three sentences from ${v.name}: a question, a statement, and an exclamation. Here's the trick — just ask yourself: **what is this sentence DOING?**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: "Asking a question? → Use ?", why: `"${v.question}" — question words like What, Where, How are your clue!` },
                  { text: "Telling/stating something? → Use .", why: `"${v.statement}" — just giving information, nice and calm` },
                  { text: "Showing strong feeling? → Use !", why: `"${v.exclamation}" — surprise, excitement, anger — imagine shouting it!` },
                  { text: "Giving a command/warning? → Use ! or .", why: `"${v.command}" — ! for urgency ('Run!'), . for calm orders ('Please sit down.')` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Asking a question", right: "? (question mark)" },
                { left: "Telling or explaining", right: ". (full stop)" },
                { left: "Strong feeling or surprise", right: "! (exclamation mark)" },
                { left: "Giving an order", right: ". or ! (command)" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What punctuation mark should end this sentence?\n\n**"${v.testSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testSentence,
                highlightWords: [],
                label: "Fix the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which ending is correct?`,
              getOptions: (v) => [
                v.testCorrect,
                v.testSentence + ".",
                v.testSentence + ",",
                v.testSentence + ";",
                v.testSentence + ":"
              ],
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Well done! ${v.testWhy}. ✓`,
                incorrect: (v) => `Not quite! The correct answer is: **"${v.testCorrect}"**. ${v.testWhy}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Sentence endings — easy as asking one question!",
            body: () => `Before you put that final mark down, just ask: "What is this sentence doing?" Here's your cheat sheet:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Is it asking something? → Question mark (?)", why: "Look for question words: Who, What, Where, When, Why, How, Can, Do, Is — they're your clue!" },
                  { text: "Is it telling/explaining? → Full stop (.)", why: "Most sentences are statements — the trusty full stop does the job" },
                  { text: "Is it showing strong feeling? → Exclamation mark (!)", why: "Surprise, excitement, shock, anger, urgency — imagine shouting it!" },
                  { text: "Never use more than one: NOT !! or ?!", why: "One mark is always enough in formal writing. Restraint is a superpower! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot-the-mistake ----
      {
        id: "question-exclamation-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "You'll spot sentences wearing the wrong ending — like a question pretending to be a statement!",
          "Why swapping a ? for a . (or the other way round) can totally change what a sentence means"
        ],
        variableSets: [
          {
            name: "Ava",
            scenario: "checking her pen pal letter",
            wrongSentence: "What time does your school start.",
            correctSentence: "What time does your school start?",
            mistake: "used a full stop instead of a question mark",
            rule: "Sentences starting with question words (What, When, How, etc.) are questions and need ?",
            testWrong: "Help, the boat is sinking.",
            testCorrect: "Help, the boat is sinking!",
            testExplain: "This is an urgent warning/cry for help — it needs an exclamation mark to show the strong feeling"
          },
          {
            name: "Oscar",
            scenario: "reviewing his book report",
            wrongSentence: "I wonder where the treasure is hidden?",
            correctSentence: "I wonder where the treasure is hidden.",
            mistake: "used a question mark, but 'I wonder' makes this a statement, not a direct question",
            rule: "'I wonder...' is a statement (telling us what you're thinking), not a direct question. It ends with a full stop",
            testWrong: "Can you believe we won the cup.",
            testCorrect: "Can you believe we won the cup?",
            testExplain: "'Can you believe' is asking a question — even though it expresses surprise, the sentence structure is a question"
          },
          {
            name: "Imogen",
            scenario: "editing her persuasive essay",
            wrongSentence: "How would you feel if your playground was taken away!",
            correctSentence: "How would you feel if your playground was taken away?",
            mistake: "used an exclamation mark instead of a question mark",
            rule: "Even if a question is dramatic, it still needs a question mark because it's asking something",
            testWrong: "Run as fast as you can.",
            testCorrect: "Run as fast as you can!",
            testExplain: "This is an urgent command — 'Run!' shows urgency and strong feeling, so it needs an exclamation mark"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Wrong ending alert!",
            body: (v) => `${v.name} is ${v.scenario}. This sentence has been given the wrong ending — like putting a question mark on a shout!\n\n**"${v.wrongSentence}"**\n\nCan you spot what it should be?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Spot the punctuation issue:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the fix!",
            body: (v) => `${v.name} ${v.mistake}. This is a sneaky one — the trick is to think about what the sentence is actually doing.\n\n**Rule:** ${v.rule}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: "${v.wrongSentence}"`, why: v.mistake },
                  { text: `RIGHT: "${v.correctSentence}"`, why: v.rule },
                  { text: "Ask: is the sentence ASKING something? If yes → ?", why: "Look for question starters: Who/What/Where/When/Why/How/Can/Do — they're your best friends here!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `"I wonder where the treasure is hidden" should end with a question mark`, answer: false, explanation: `Nope! "I wonder..." is a statement about what you're thinking, not a direct question. It ends with a full stop. Sneaky, right? ✓` },
                { text: `A sentence starting with "How" or "What" usually needs a question mark`, answer: true, explanation: `Yes! Sentences starting with question words like How, What, Where, When are usually questions and need ?. You've got this! ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which ending is correct?\n\n**"${v.testWrong}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is correct?`,
              getOptions: (v) => [
                v.testCorrect,
                v.testWrong,
                v.testCorrect.slice(0, -1) + ",",
                v.testCorrect.slice(0, -1) + ";",
                v.testCorrect.slice(0, -1) + ":"
              ],
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Superstar! ${v.testExplain}. ✓`,
                incorrect: (v) => `Close! The correct version is: **"${v.testCorrect}"**. ${v.testExplain}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Sentence endings — sorted!",
            body: () => `Here's a trick that works every time. Before you put the final mark, ask yourself:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Is it a direct question? → ?", why: "Even dramatic or rhetorical questions use ? — they're still asking!" },
                  { text: "Is it a statement (even if it mentions a question)? → .", why: "'I wonder where it is.' is a statement about wondering — sneaky, but it's a full stop" },
                  { text: "Is it showing strong feeling or urgency? → !", why: "Commands, warnings, surprise, excitement — imagine shouting it!" },
                  { text: "When in doubt, read it aloud — your voice goes UP for a question", why: "If your voice rises at the end, it's a question. Your voice knows the answer! ✓" }
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
  // SUB-CONCEPT 8: brackets-colons
  // Brackets, colons and semi-colons
  // Category: other
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "brackets-colons",
    name: "Brackets, Colons and Semi-colons",
    category: "other",
    lessons: [
      // ---- Lesson A: Step-by-step ----
      {
        id: "brackets-colons-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll learn how brackets let you whisper bonus information to the reader — like a secret side note",
          "The colon's superpower: introducing a list — and the semi-colon's trick for joining two ideas into one smooth sentence"
        ],
        variableSets: [
          {
            name: "Cleo",
            scenario: "writing a fact file about British wildlife",
            bracketSentence: "The red fox (Britain's most common wild predator) is found across the UK.",
            bracketPurpose: "adds an interesting fact as extra information",
            colonSentence: "The fox eats many things: berries, mice, insects and scraps.",
            colonPurpose: "introduces a list",
            semiSentence: "Foxes are clever hunters; they can adapt to any habitat.",
            semiPurpose: "joins two related ideas that could each be their own sentence",
            testSentence: "You will need the following ingredients",
            testItems: "flour, eggs, sugar and butter",
            testCorrect: "You will need the following ingredients: flour, eggs, sugar and butter.",
            testWrong: "You will need the following ingredients; flour, eggs, sugar and butter."
          },
          {
            name: "Harley",
            scenario: "writing a geography project about rivers",
            bracketSentence: "The River Thames (346 km long) flows through London.",
            bracketPurpose: "adds the length as extra information",
            colonSentence: "A river has three stages: upper, middle and lower.",
            colonPurpose: "introduces a list of stages",
            semiSentence: "The upper stage is steep and fast; the lower stage is flat and slow.",
            semiPurpose: "connects two contrasting but related facts",
            testSentence: "The tallest mountain in the UK is Ben Nevis",
            testItems: "1,345 metres tall",
            testCorrect: "The tallest mountain in the UK is Ben Nevis (1,345 metres tall).",
            testWrong: "The tallest mountain in the UK is Ben Nevis: 1,345 metres tall."
          },
          {
            name: "Noor",
            scenario: "writing a review of her favourite book",
            bracketSentence: "The author (J.K. Rowling) also wrote other books.",
            bracketPurpose: "adds the author's name as a side note",
            colonSentence: "The main characters are: Harry, Ron and Hermione.",
            colonPurpose: "introduces a list of characters",
            semiSentence: "The book was exciting; I could not put it down.",
            semiPurpose: "joins two related thoughts without using 'and' or 'but'",
            testSentence: "The library was quiet",
            testItems: "everyone was reading",
            testCorrect: "The library was quiet; everyone was reading.",
            testWrong: "The library was quiet: everyone was reading."
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Three punctuation marks that make you look really clever!",
            body: (v) => `${v.name} is ${v.scenario}. These three punctuation marks are used less often — but using them well makes your writing stand out:`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.name} is ${v.scenario}. Look at how these three punctuation marks are used:` },
              { type: 'visual', component: 'SentenceDisplay', props: (v) => ({
                mode: "highlight",
                text: v.bracketSentence,
                highlightWords: [],
                label: "Brackets — extra information:"
              })},
              { type: 'visual', component: 'SentenceDisplay', props: (v) => ({
                mode: "highlight",
                text: v.colonSentence,
                highlightWords: [],
                label: "Colon — introduces a list:"
              })},
              { type: 'visual', component: 'SentenceDisplay', props: (v) => ({
                mode: "highlight",
                text: v.semiSentence,
                highlightWords: [],
                label: "Semi-colon — joins two related ideas:"
              })}
            ],
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "Each one has its own special job!",
            body: (v) => `${v.name}'s sentences showed brackets, a colon, and a semi-colon. Think of them as tools in a toolkit — each one does something different:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: "Brackets ( ): wrap around EXTRA information", why: "Like whispering a side note — if you removed it, the sentence would still work!" },
                  { text: "Colon : introduces a list or explanation", why: `"${v.colonSentence}" — the colon is like a drumroll saying 'here they come!'` },
                  { text: "Semi-colon ; joins two RELATED complete sentences", why: `"${v.semiSentence}" — both halves could stand alone, but the semi-colon shows they're best friends` },
                  { text: "No capital letter after a colon or semi-colon", why: "The sentence carries on — it's not starting fresh" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Brackets ( )", right: "Extra removable information" },
                { left: "Colon :", right: "Introduces a list or explanation" },
                { left: "Semi-colon ;", right: "Joins two related sentences" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which punctuation mark completes this sentence correctly?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testItems.join('  /  '),
                highlightWords: [],
                label: "Put these into a sentence with commas:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is correct?`,
              getOptions: (v) => [
                v.testCorrect,
                v.testWrong,
                v.testSentence + " - " + v.testItems + ".",
                v.testSentence + ", " + v.testItems + ".",
                v.testSentence + "... " + v.testItems + "."
              ],
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Brilliant! You picked the perfect tool for the job — that's impressive! ✓`,
                incorrect: (v) => `So close! The correct version is: **"${v.testCorrect}"**. Remember: colons introduce lists, semi-colons join related sentences, brackets add extra info. You'll get it!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Three marks, three jobs — you've got this!",
            body: () => `Using these correctly makes your writing look really sophisticated. Here's your quick reference:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Brackets ( ): extra info you could remove", why: "The River Thames (346 km long) flows through London. — like a whispered side note!" },
                  { text: "Colon : introduces a list or explanation", why: "You need: eggs, flour and sugar. — the colon says 'here's what's coming!'" },
                  { text: "Semi-colon ; joins two related sentences", why: "It was raining; we stayed inside. — two ideas, closely connected" },
                  { text: "No capital after : or ; (the sentence continues)", why: "These are joiners, not sentence starters. Knowing this makes examiners impressed! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot-the-mistake ----
      {
        id: "brackets-colons-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "You'll learn to spot when a colon, semi-colon, or bracket has been used in the wrong place — they get mixed up all the time!",
          "The common traps with colons and semi-colons — and simple ways to tell them apart"
        ],
        variableSets: [
          {
            name: "Felix",
            scenario: "proofreading his history project",
            wrongSentence: "The Romans built many things; roads, bridges, baths and temples.",
            correctSentence: "The Romans built many things: roads, bridges, baths and temples.",
            mistake: "used a semi-colon instead of a colon before a list",
            rule: "Colons (:) introduce lists. Semi-colons (;) join two complete sentences",
            testWrong: "She packed her bag: she was ready to leave.",
            testCorrect: "She packed her bag; she was ready to leave.",
            testExplain: "Both halves are complete sentences that are closely related — use a semi-colon to join them, not a colon"
          },
          {
            name: "Tilly",
            scenario: "editing the class recipe book",
            wrongSentence: "You will need three things; (a bowl, a spoon) and an oven.",
            correctSentence: "You will need three things: a bowl, a spoon and an oven.",
            mistake: "used a semi-colon instead of a colon, and put brackets around list items that don't need them",
            rule: "Use a colon to introduce a list. Only use brackets for extra (removable) information, not for list items",
            testWrong: "The ingredients are: (flour) (sugar) (eggs) and (butter).",
            testCorrect: "The ingredients are: flour, sugar, eggs and butter.",
            testExplain: "List items should be separated by commas, not wrapped in brackets. Brackets are for extra info, not list items"
          },
          {
            name: "Zayn",
            scenario: "checking his science write-up",
            wrongSentence: "The experiment worked, (we used 200ml of water), the results were clear.",
            correctSentence: "The experiment worked (we used 200ml of water); the results were clear.",
            mistake: "used commas instead of brackets and a comma instead of a semi-colon",
            rule: "Brackets wrap around the extra info. A semi-colon joins the two main ideas",
            testWrong: "The volcano erupted: lava flowed down the mountain.",
            testCorrect: "The volcano erupted; lava flowed down the mountain.",
            testExplain: "Both halves are complete sentences — they need a semi-colon (;) to join them, not a colon (:). A colon would only be right if introducing a list or explanation"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Wrong mark! Can you spot it?",
            body: (v) => `${v.name} is ${v.scenario}. One of the punctuation marks in this sentence is wrong — they look similar but do very different jobs!\n\n**"${v.wrongSentence}"**\n\nCan you spot which one needs swapping?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Spot the punctuation issue:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the mix-up!",
            body: (v) => `${v.name} ${v.mistake}. Colons and semi-colons look really similar, so mixing them up is super common!\n\n**Rule:** ${v.rule}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: "${v.wrongSentence}"`, why: v.mistake },
                  { text: `RIGHT: "${v.correctSentence}"`, why: v.rule },
                  { text: "Quick test: is it a list? → colon. Two sentences? → semi-colon", why: "This one simple question helps you choose every time — it's like a cheat code!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `A semi-colon (;) is used to introduce a list of items`, answer: false, explanation: `Nope! A colon (:) introduces lists. A semi-colon (;) joins two related complete sentences. Easy to mix up, but now you know! ✓` },
                { text: `You should not use a capital letter after a colon or semi-colon`, answer: true, explanation: `Spot on! The sentence keeps going after a colon or semi-colon, so no capital letter is needed. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which version uses the correct punctuation?\n\n**"${v.testWrong}"**`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is correct?`,
              getOptions: (v) => [
                v.testCorrect,
                v.testWrong,
                v.testCorrect.replace(";", ",").replace(":", ","),
                v.testCorrect.replace(";", ".").replace(":", "."),
                v.testCorrect.replace(";", " -").replace(":", " -")
              ],
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Well done! ${v.testExplain}. ✓`,
                incorrect: (v) => `Not quite! The correct version is: **"${v.testCorrect}"**. ${v.testExplain}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Colons, semi-colons, brackets — nailed it!",
            body: () => `Remember the simple test — one question tells you which mark to use:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Introducing a list? → Use a colon :", why: "The colon is like a drumroll — 'here comes the list!'" },
                  { text: "Joining two complete sentences? → Use a semi-colon ;", why: "The semi-colon says 'these ideas are best friends'" },
                  { text: "Adding removable extra info? → Use brackets ( )", why: "The sentence must still work without them — like a bonus side note" },
                  { text: "No capital letter after : ; or ( )", why: "The sentence carries on — these marks don't start new sentences. Knowing this is a real flex! ✓" }
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
  // SUB-CONCEPT 9: its-vs-its
  // it's vs its — the most common mistake
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "its-vs-its",
    name: "it's vs its — The Big One",
    category: "core",
    lessons: [
      // ---- Lesson A: Step-by-step ----
      {
        id: "its-vs-its-steps",
        templateType: "step-by-step",
        learningGoal: [
          "The it's vs its battle — you'll finally crack when the apostrophe version (it's = it is / it has) is right",
          "When 'its' goes naked with no apostrophe — because it's showing that something belongs to 'it'",
          "A brilliant shortcut: the 'swap in it is' trick that tells you the answer in two seconds"
        ],
        variableSets: [
          {
            name: "Bella",
            scenario: "writing about her pet rabbit",
            itsContraction: "It's a very fluffy rabbit.",
            itsExpanded: "It is a very fluffy rabbit.",
            itsPossessive: "The rabbit twitched its nose.",
            possessiveMeaning: "the nose belonging to the rabbit",
            testSentence: "The cat licked ___ paw because ___ dirty.",
            testAnswer: "its ... it's",
            testExplain: "'its paw' = the paw belonging to it (possessive). 'it's dirty' = it is dirty (contraction)"
          },
          {
            name: "Sam",
            scenario: "describing a robot he built for the science fair",
            itsContraction: "It's the fastest robot in the class!",
            itsExpanded: "It is the fastest robot in the class!",
            itsPossessive: "The robot moved its arm smoothly.",
            possessiveMeaning: "the arm belonging to the robot",
            testSentence: "The tree lost ___ leaves because ___ autumn.",
            testAnswer: "its ... it's",
            testExplain: "'its leaves' = the leaves belonging to the tree (possessive). 'it's autumn' = it is autumn (contraction)"
          },
          {
            name: "Orla",
            scenario: "writing a nature diary for her class project",
            itsContraction: "It's been a beautiful sunny day.",
            itsExpanded: "It has been a beautiful sunny day.",
            itsPossessive: "The bird spread its wings and flew away.",
            possessiveMeaning: "the wings belonging to the bird",
            testSentence: "The school changed ___ uniform because ___ too old.",
            testAnswer: "its ... it's",
            testExplain: "'its uniform' = the uniform belonging to the school (possessive). 'it's too old' = it is too old (contraction)"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "The two-letter trap that catches EVERYONE!",
            body: (v) => `${v.name} is ${v.scenario}. Did you know that **it's** and **its** cause more mistakes than almost any other words in English? Even teachers get them mixed up!\n\n**"${v.itsContraction}"** — it's = ${v.itsExpanded.toLowerCase().replace(".", "")}\n**"${v.itsPossessive}"** — its = ${v.possessiveMeaning}\n\nThey SOUND the same but mean completely different things!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `"${v.itsContraction}" (it is) vs "${v.itsPossessive}" (belonging to it)`,
                highlightWords: [],
                label: "it's or its?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The magic trick that works EVERY time!",
            body: (v) => `We saw **"${v.itsContraction}"** (it's = ${v.itsExpanded.toLowerCase().replace(".", "")}) and **"${v.itsPossessive}"** (its = ${v.possessiveMeaning}). Here's a brilliant trick — once you learn this, you'll never get it wrong again:\n\nReplace the word with **"it is"**. If the sentence still makes sense → use **it's**. If not → use **its**. That's it!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Test: "${v.itsContraction}"`, why: `Replace: "${v.itsExpanded}" — makes sense! ✓ So use it's. Easy!` },
                  { text: `Test: "${v.itsPossessive}"`, why: `Replace: "The rabbit twitched it is nose" — nope, that sounds bonkers! So use its` },
                  { text: "it's = it is / it has (a contraction — apostrophe replaces letters)", why: "Just like don't = do not, can't = can not — same idea!" },
                  { text: "its = belonging to it (like his, hers, yours — NO apostrophe)", why: "Possessive pronouns never have apostrophes — they're special like that" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `To check whether to use it's or its, try replacing the word with "____"`,
              options: (v) => ["it is", "it was", "it has been", "its own"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Replace with "it is" — if the sentence still makes sense, use it's. If not, use its. You've cracked the code! ✓`,
                incorrect: (v) => `Nearly! The magic trick is to replace with "it is". If the sentence works, use it's (contraction). If not, use its (possessive). Try it again!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Fill in the gaps:\n\n**"${v.testSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testSentence,
                highlightWords: [],
                label: "Check the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which fills the gaps correctly?`,
              getOptions: (v) => [
                v.testAnswer,
                "it's ... its",
                "its ... its",
                "it's ... it's",
                "its' ... its'"
              ],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Superstar! ${v.testExplain}. ✓`,
                incorrect: (v) => `Not quite! The answer is **${v.testAnswer}**. ${v.testExplain}. Remember: try replacing with 'it is' — if it works, use it's.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "it's vs its — your secret weapon!",
            body: () => `This is the most tested punctuation question in the 11+. Seriously! Learning this trick is like having a cheat code for the exam:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "it's = it is OR it has", why: "A contraction — the apostrophe replaces the missing letters, just like don't" },
                  { text: "its = belonging to it", why: "A possessive pronoun — like his, hers, yours (NO apostrophe — they're special!)" },
                  { text: "THE TRICK: replace with 'it is'", why: "If the sentence still makes sense → it's. If not → its. Works every single time!" },
                  { text: "There is NO SUCH WORD as its' (with apostrophe after s)", why: "This form doesn't exist — it's always either it's or its. Now you know something most adults don't! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot-the-mistake ----
      {
        id: "its-vs-its-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "You'll hunt down it's/its mix-ups in real sentences — the mistake that catches out even grown-ups!",
          "You'll practise the 'swap in it is' replacement trick until it becomes second nature"
        ],
        variableSets: [
          {
            name: "Holly",
            scenario: "marking her partner's work in English",
            wrongSentence: "The dog wagged it's tail because its a good boy.",
            correctSentence: "The dog wagged its tail because it's a good boy.",
            mistake: "swapped it's and its — used the apostrophe for possession and left it out for the contraction",
            rule: "'its tail' = the tail belonging to the dog (possessive, no apostrophe). 'it's a good boy' = it is a good boy (contraction)",
            testWrong: "The school painted it's walls. It's playground was also improved.",
            testCorrect: "The school painted its walls. Its playground was also improved.",
            testExplain: "Both are possessive — 'the walls belonging to the school' and 'the playground belonging to the school'. No apostrophe needed",
            testOptions: [
              "The school painted its walls. Its playground was also improved.",
              "The school painted it's walls. It's playground was also improved.",
              "The school painted it's walls. Its playground was also improved.",
              "The school painted its walls. It's playground was also improved.",
              "The school painted its' walls. Its' playground was also improved."
            ]
          },
          {
            name: "Jude",
            scenario: "proofreading a leaflet for the school fair",
            wrongSentence: "Its going to be a great day! Bring your family and it's friends!",
            correctSentence: "It's going to be a great day! Bring your family and its friends!",
            mistake: "wrote 'Its' without an apostrophe for the contraction and 'it's' with one for the possessive — both are backwards",
            rule: "'It's going to be' = It is going to be (contraction). 'its friends' = friends belonging to your family (possessive)",
            testWrong: "It's colour has faded but its still beautiful.",
            testCorrect: "Its colour has faded but it's still beautiful.",
            testExplain: "'Its colour' = the colour belonging to it (possessive). 'it's still beautiful' = it is still beautiful (contraction)",
            testOptions: [
              "Its colour has faded but it's still beautiful.",
              "It's colour has faded but its still beautiful.",
              "It's colour has faded but it's still beautiful.",
              "Its colour has faded but its still beautiful.",
              "Its' colour has faded but its still beautiful."
            ]
          },
          {
            name: "Mila",
            scenario: "checking her story before the writing competition",
            wrongSentence: "The castle had lost it's roof. It's walls were crumbling too.",
            correctSentence: "The castle had lost its roof. Its walls were crumbling too.",
            mistake: "used it's (contraction) when she meant its (possessive) — both should be 'its' because they mean 'belonging to the castle'",
            rule: "Replace with 'it is': 'The castle had lost it is roof' makes NO sense, so it must be 'its' (no apostrophe)",
            testWrong: "The ship sailed on even though it's sails were torn. Its a brave crew!",
            testCorrect: "The ship sailed on even though its sails were torn. It's a brave crew!",
            testExplain: "'its sails' = the sails belonging to the ship (possessive). 'It's a brave crew' = it is a brave crew (contraction)",
            testOptions: [
              "The ship sailed on even though its sails were torn. It's a brave crew!",
              "The ship sailed on even though it's sails were torn. Its a brave crew!",
              "The ship sailed on even though it's sails were torn. It's a brave crew!",
              "The ship sailed on even though its sails were torn. Its a brave crew!",
              "The ship sailed on even though its' sails were torn. Its a brave crew!"
            ]
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "The its/it's swap — can you catch it?",
            body: (v) => `${v.name} is ${v.scenario}. These sentences have it's and its mixed up — the apostrophes have ended up in the wrong places!\n\n**"${v.wrongSentence}"**\n\nUse the "it is" trick to spot the mistakes!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Spot the punctuation issue:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the fix — and the magic trick!",
            body: (v) => `${v.name} ${v.mistake}. This is THE most common mistake in English — even professional writers get it wrong!\n\n**Rule:** ${v.rule}.\n\n**The replacement test (works every time!):**\n1. Find every "its" or "it's" in your writing\n2. Replace each one with "it is" and read aloud\n3. Does "it is" make sense? → use **it's** (with apostrophe)\n4. Does "it is" NOT make sense? → use **its** (no apostrophe)`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: "${v.wrongSentence}"`, why: v.mistake },
                  { text: `RIGHT: "${v.correctSentence}"`, why: v.rule },
                  { text: "Always use the replacement trick: swap in 'it is'", why: "If it makes sense → it's. If not → its. Simple and foolproof!" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Fix this sentence!",
            body: (v) => `Which version is correct?\n\n**"${v.testWrong}"**`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is correct?`,
              getOptions: (v) => v.testOptions,
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Brilliant! ${v.testExplain}. ✓`,
                incorrect: (v) => `Close! The correct version is: **"${v.testCorrect}"**. ${v.testExplain}. Always try replacing with 'it is' to check!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "it's vs its — you'll never mix them up again!",
            body: () => `You've now got the trick that works every single time. This alone could save you marks in the exam:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Replace the word with 'it is'", why: "Read the sentence with 'it is' and listen carefully" },
                  { text: "Step 2: Does 'it is' make sense?", why: "If YES → write it's (with apostrophe). Easy!" },
                  { text: "Step 3: Does 'it is' sound wrong?", why: "If NO → write its (no apostrophe). Done!" },
                  { text: "Example: 'The cat licked ___ paw'", why: "'The cat licked it is paw' — that sounds bonkers! So it's **its** (no apostrophe). You've got this! ✓" }
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
  // SUB-CONCEPT 10: commas-parenthesis
  // Commas for extra information — parenthetical commas come in PAIRS
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "commas-parenthesis",
    name: "Commas for Extra Information",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step-by-step ----
      {
        id: "commas-parenthesis-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll discover parenthetical commas (commas in pairs that wrap around extra information) — they're like two hands cupping a bonus detail in the middle of a sentence",
          "A handy trick: if you can lift the words out and the sentence still makes sense, your commas are in the right place!"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "writing a report about her school for the local newspaper",
            basicSentence: "Our headteacher is very kind.",
            extraInfo: "Mrs Green",
            fullSentence: "Our headteacher, Mrs Green, is very kind.",
            removedCheck: "Our headteacher is very kind.",
            removedWorks: true,
            secondBasic: "The dog could barely walk.",
            secondExtra: "which was very old",
            secondFull: "The dog, which was very old, could barely walk.",
            testSentence: "My best friend, Ella, won the science prize.",
            testExtraInfo: "Ella",
            testWithout: "My best friend won the science prize."
          },
          {
            name: "Ben",
            scenario: "writing about a school trip for his class newsletter",
            basicSentence: "The museum was fascinating.",
            extraInfo: "which opened in 1852",
            fullSentence: "The museum, which opened in 1852, was fascinating.",
            removedCheck: "The museum was fascinating.",
            removedWorks: true,
            secondBasic: "Our guide told us amazing facts.",
            secondExtra: "a tall man called Dr Patel",
            secondFull: "Our guide, a tall man called Dr Patel, told us amazing facts.",
            testSentence: "The Eiffel Tower, built in 1889, is in Paris.",
            testExtraInfo: "built in 1889",
            testWithout: "The Eiffel Tower is in Paris."
          },
          {
            name: "Grace",
            scenario: "describing her family in a 'Getting to Know You' task",
            basicSentence: "My brother is really annoying.",
            extraInfo: "who is only four",
            fullSentence: "My brother, who is only four, is really annoying.",
            removedCheck: "My brother is really annoying.",
            removedWorks: true,
            secondBasic: "My nan makes the best cakes.",
            secondExtra: "who lives in Devon",
            secondFull: "My nan, who lives in Devon, makes the best cakes.",
            testSentence: "My cat, a ginger tabby called Whiskers, sleeps all day.",
            testExtraInfo: "a ginger tabby called Whiskers",
            testWithout: "My cat sleeps all day."
          },
          {
            name: "Finn",
            scenario: "writing a book review for his English homework",
            basicSentence: "The author writes brilliant stories.",
            extraInfo: "who is from Manchester",
            fullSentence: "The author, who is from Manchester, writes brilliant stories.",
            removedCheck: "The author writes brilliant stories.",
            removedWorks: true,
            secondBasic: "The main character saved the village.",
            secondExtra: "a brave girl called Zara",
            secondFull: "The main character, a brave girl called Zara, saved the village.",
            testSentence: "Shakespeare, the famous playwright, was born in Stratford.",
            testExtraInfo: "the famous playwright",
            testWithout: "Shakespeare was born in Stratford."
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Did you know commas can work in pairs?",
            body: (v) => `${v.name} is ${v.scenario}. Look at this sentence:\n\n**"${v.fullSentence}"**\n\nSee those two commas around **"${v.extraInfo}"**? They're like a pair of brackets — they wrap around a bonus fact that you could take out and the sentence would still work!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.fullSentence,
                highlightWords: [],
                label: "Read the sentence:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The brilliant removal test!",
            body: (v) => `In ${v.name}'s sentence, **"${v.extraInfo}"** is wrapped in commas. Parenthetical commas always come in **pairs** — like bookends! They wrap around extra information that you could remove without breaking the sentence. Here's the clever test:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Start: "${v.fullSentence}"`, why: "Find the words sitting between the two commas" },
                  { text: `Extra information: "${v.extraInfo}"`, why: "This is a bonus detail — nice to know, but the sentence doesn't need it to work" },
                  { text: `Remove it: "${v.removedCheck}"`, why: "Still makes perfect sense! That proves the commas are in the right place!" },
                  { text: "Parenthetical commas ALWAYS come in pairs", why: "One before and one after — like bookends. Never use just one!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `Parenthetical commas can be used on their own (just one comma)`, answer: false, explanation: `No way! Parenthetical commas always come in PAIRS — like bookends. One before and one after the extra information. ✓` },
                { text: `If you remove the words between parenthetical commas, the sentence should still make sense`, answer: true, explanation: `Exactly! That's the removal test — if the sentence works without the extra info, you've placed the commas perfectly. Brilliant! ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Look at this sentence:\n\n**"${v.testSentence}"**\n\nWhat is the extra information that could be removed?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testSentence,
                highlightWords: [],
                label: "Check the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which part is the extra information that could be removed?`,
              getOptions: (v) => [
                v.testExtraInfo,
                v.testSentence.split(",")[0],
                v.testSentence.split(",").slice(-1)[0].trim().replace(".", ""),
                "The whole sentence is essential",
                "None of it can be removed"
              ],
              correctAnswer: (v) => v.testExtraInfo,
              feedback: {
                correct: (v) => `Spot on! "${v.testExtraInfo}" is the bonus info. Remove it and you get: "${v.testWithout}" — still makes perfect sense! You've nailed this! ✓`,
                incorrect: (v) => `So close! The extra information is **"${v.testExtraInfo}"**. Remove it and you get: "${v.testWithout}" — the sentence still works perfectly. Try the removal test next time!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Paired commas — you've cracked the code!",
            body: () => `Remember: commas for extra information always come in PAIRS — like bookends! Using these correctly makes your writing look really sophisticated:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Parenthetical commas wrap around extra information", why: "Like bookends or brackets — one before, one after. They always travel together!" },
                  { text: "Use the removal test: take out the words between the commas", why: "If the sentence still makes sense, your commas are in the right place" },
                  { text: "ALWAYS use a pair — never just one comma!", why: "Forgetting the second comma is the most common mistake — now you won't make it!" },
                  { text: "Examples: 'My sister, who is ten, loves reading.'", why: "Remove 'who is ten' — 'My sister loves reading.' Still works! That's the proof! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot-the-mistake ----
      {
        id: "commas-parenthesis-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "You'll spot when parenthetical commas (paired commas around extra information) have gone missing or wandered off",
          "The golden rule: these commas always travel in pairs — lose one and the whole sentence gets confusing!"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "proofreading his friend's history essay",
            wrongSentence: "Queen Victoria, who ruled for 63 years was very powerful.",
            correctSentence: "Queen Victoria, who ruled for 63 years, was very powerful.",
            mistake: "forgot the second comma after the extra information 'who ruled for 63 years'",
            rule: "Parenthetical commas come in PAIRS — you need one before AND one after the extra information",
            testWrong: "The River Thames which flows through London, is very long.",
            testCorrect: "The River Thames, which flows through London, is very long.",
            testExplain: "You need commas BEFORE and AFTER 'which flows through London' — both are needed, not just one"
          },
          {
            name: "Ella",
            scenario: "helping her younger sister with her writing",
            wrongSentence: "My teacher Mrs Khan gave us extra playtime.",
            correctSentence: "My teacher, Mrs Khan, gave us extra playtime.",
            mistake: "forgot both commas around the extra information 'Mrs Khan'",
            rule: "When you add a name or description after a noun, wrap it in a pair of commas",
            testWrong: "Tom's dog a scruffy terrier always barks at the postman.",
            testCorrect: "Tom's dog, a scruffy terrier, always barks at the postman.",
            testExplain: "'a scruffy terrier' is extra information about the dog. It needs commas before AND after it"
          },
          {
            name: "Daisy",
            scenario: "marking practice exam sentences",
            wrongSentence: "The cake which, was chocolate, tasted amazing.",
            correctSentence: "The cake, which was chocolate, tasted amazing.",
            mistake: "put the first comma in the wrong place — it should go BEFORE 'which', not after it",
            rule: "The commas go around the complete extra phrase: ', which was chocolate,' not 'which, was chocolate,'",
            testWrong: "Paris, the capital of France is famous for the Eiffel Tower.",
            testCorrect: "Paris, the capital of France, is famous for the Eiffel Tower.",
            testExplain: "'the capital of France' is the extra info. You need commas before AND after: 'Paris, the capital of France, is famous...'"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "One comma is missing its partner!",
            body: (v) => `${v.name} is ${v.scenario}. Something is wrong with the commas here — the pair is incomplete!\n\n**"${v.wrongSentence}"**\n\nCan you spot what's missing?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Spot the punctuation issue:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the fix!",
            body: (v) => `${v.name} ${v.mistake}. This is the single most common paired-comma mistake — so knowing it puts you ahead of the game!\n\n**Rule:** ${v.rule}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: "${v.wrongSentence}"`, why: v.mistake },
                  { text: `RIGHT: "${v.correctSentence}"`, why: v.rule },
                  { text: "Parenthetical commas always come in PAIRS", why: "One before the extra info, one after — like bookends. They're lost without each other!" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which version has both commas in the right places?\n\n**"${v.testWrong}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is the correct version?`,
              getOptions: (v) => [
                v.testCorrect,
                v.testWrong,
                v.testWrong.replace(",", ""),
                v.testCorrect.replace(", ", " ").replace(", ", ", "),
                v.testWrong.replace(", ", ",, ")
              ],
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Well done! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! The correct version is: **"${v.testCorrect}"**. ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Paired commas — sorted!",
            body: () => `Before you hand in your writing, run through this quick check. It takes seconds and could save you marks:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Find any extra information in your sentences", why: "Names, descriptions, 'which' or 'who' clauses — these are your clues" },
                  { text: "Check: does it have a comma BEFORE and AFTER?", why: "Both commas are needed — forgetting one is the most common mistake, and now you won't make it!" },
                  { text: "Do the removal test: take out the words between the commas", why: "If the sentence still works, your commas are perfect" },
                  { text: "My sister, who is ten, loves reading. → My sister loves reading.", why: "The removal test proves it! Getting this right makes your writing look really polished ✓" }
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
  // SUB-CONCEPT 11: commas-ambiguity
  // Commas that change meaning — missing commas create confusion
  // Category: other
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "commas-ambiguity",
    name: "Commas That Change Meaning",
    category: "other",
    lessons: [
      // ---- Lesson A: Step-by-step ----
      {
        id: "commas-ambiguity-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll see how one tiny comma can completely flip what a sentence means — prepare for some funny examples!",
          "Why popping a comma after an opening word or phrase stops your reader from getting totally confused"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "finding funny sentences in her grammar workbook",
            funnyVersion: "Let's eat Grandma!",
            correctVersion: "Let's eat, Grandma!",
            funnyMeaning: "This sounds like you want to eat your grandma!",
            correctMeaning: "The comma shows you're talking TO Grandma, inviting her to eat",
            rule: "addressing someone",
            openerWrong: "After eating the dog went for a walk.",
            openerRight: "After eating, the dog went for a walk.",
            openerProblem: "Without the comma, it sounds like someone ate the dog!",
            testNoComma: "I love cooking my family and my pets.",
            testWithComma: "I love cooking, my family and my pets.",
            testExplain: "Without the comma, it sounds like you're cooking your family and pets! The comma separates the activity (cooking) from the people you love"
          },
          {
            name: "Charlie",
            scenario: "reading a list of hilarious comma mistakes",
            funnyVersion: "A panda eats shoots and leaves.",
            correctVersion: "A panda eats, shoots and leaves.",
            funnyMeaning: "This means the panda eats bamboo shoots and leaves from a plant",
            correctMeaning: "With the comma, the panda eats food, then shoots a gun, then leaves the room!",
            rule: "separating actions",
            openerWrong: "While painting the cat knocked over the tin.",
            openerRight: "While painting, the cat knocked over the tin.",
            openerProblem: "Without the comma, it sounds like someone was painting the cat!",
            testNoComma: "After cleaning the kitchen looked spotless.",
            testWithComma: "After cleaning, the kitchen looked spotless.",
            testExplain: "Without the comma, it sounds like you cleaned the kitchen — but actually the kitchen looked spotless after YOU finished cleaning something else"
          },
          {
            name: "Priya",
            scenario: "playing a comma game in English class",
            funnyVersion: "We're going to learn to cut and paste kids.",
            correctVersion: "We're going to learn to cut and paste, kids.",
            funnyMeaning: "This sounds like you're cutting and pasting children!",
            correctMeaning: "The comma shows you're talking TO the kids about learning cut and paste",
            rule: "addressing someone",
            openerWrong: "Before washing the baby fell asleep.",
            openerRight: "Before washing, the baby fell asleep.",
            openerProblem: "Without the comma, it sounds like someone was about to wash the baby!",
            testNoComma: "Most of the time travellers worry about luggage.",
            testWithComma: "Most of the time, travellers worry about luggage.",
            testExplain: "Without the comma, it sounds like 'time travellers' — people who travel through time! With the comma, it means 'usually, travellers worry about luggage'"
          },
          {
            name: "Oliver",
            scenario: "creating a poster of funny comma fails",
            funnyVersion: "Rachael finds inspiration in cooking her family and her dog.",
            correctVersion: "Rachael finds inspiration in cooking, her family and her dog.",
            funnyMeaning: "This sounds like Rachael cooks her family and dog!",
            correctMeaning: "The comma shows three separate things Rachael loves: cooking, family, and dog",
            rule: "separating items in a list",
            openerWrong: "After dressing the turkey was put in the oven.",
            openerRight: "After dressing, the turkey was put in the oven.",
            openerProblem: "Without the comma, it sounds like someone put clothes on the turkey!",
            testNoComma: "Kings can rule countries without using force.",
            testWithComma: "Kings can rule, countries without using force.",
            testExplain: "These give totally different meanings! The first means kings govern without force. The second (though odd) suggests kings can rule, and that countries exist without using force"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "The comma that saved Grandma's life!",
            body: (v) => `${v.name} is ${v.scenario}. Brace yourself — this is going to make you laugh!\n\n**"${v.funnyVersion}"**\n**"${v.correctVersion}"**\n\nJust one tiny comma completely changes the meaning. Without it... well, poor Grandma!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.correctVersion,
                highlightWords: [],
                label: "Read the sentence:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "One comma prevents a LOT of confusion!",
            body: (v) => `Remember **"${v.funnyVersion}"** vs **"${v.correctVersion}"**? When a sentence starts with a time or place phrase, you need a comma after it. Without one, the meaning can get hilariously wrong!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `CONFUSING: "${v.openerWrong}"`, why: v.openerProblem },
                  { text: `CLEAR: "${v.openerRight}"`, why: "The comma separates the opener from the main sentence" },
                  { text: "Rule: put a comma after time/place openers", why: "After eating, ... / While painting, ... / Before washing, ..." },
                  { text: "Also use commas when talking TO someone", why: `"${v.correctVersion}" — the comma shows you're addressing a person` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `"Let's eat Grandma!" and "Let's eat, Grandma!" mean the same thing`, answer: false, explanation: `Absolutely not! Without the comma, it sounds like you want to eat Grandma! The comma saves her life by showing you're talking TO her. ✓` },
                { text: `A comma after a time phrase like "After eating" prevents confusion`, answer: true, explanation: `Yes! "After eating, the dog went for a walk" is much clearer than "After eating the dog went for a walk" — because nobody ate the dog! ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `This sentence is missing a comma and reads very strangely:\n\n**"${v.testNoComma}"**\n\nWhich version fixes the meaning?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testNoComma,
                highlightWords: [],
                label: "Where does the comma go?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which version makes the meaning clear?`,
              getOptions: (v) => {
                const endChar = v.testNoComma.slice(-1);
                const commaBeforeEnd = v.testNoComma.slice(0, -1) + "," + endChar;
                return [...new Set([
                  v.testWithComma,
                  v.testNoComma,
                  v.testNoComma + ",",
                  ", " + v.testNoComma,
                  commaBeforeEnd
                ])];
              },
              correctAnswer: (v) => v.testWithComma,
              feedback: {
                correct: (v) => `Brilliant! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! The correct version is: **"${v.testWithComma}"**. ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Commas that change meaning — you've got the power!",
            body: () => `A tiny comma can make a HUGE difference! Once you know this, you'll start spotting missing commas everywhere — in signs, menus, even texts from your friends:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Always put a comma after time/place openers", why: "'After eating, the dog...' NOT 'After eating the dog...' — keep the dog safe!" },
                  { text: "Use a comma when talking TO someone (direct address)", why: "'Let's eat, Grandma!' NOT 'Let's eat Grandma!' — Grandma will thank you" },
                  { text: "Read your sentence without the comma", why: "Does it accidentally say something funny? If so, pop a comma in!" },
                  { text: "When in doubt, add the comma for clarity", why: "It's always better to have a comma than a confused reader. That's a superpower for your writing! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot-the-mistake ----
      {
        id: "commas-ambiguity-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "You'll play comma detective — finding the spots where a missing comma turns a normal sentence into something hilarious or baffling",
          "You'll practise dropping commas into exactly the right place to rescue confusing sentences"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "playing a comma detective game in class",
            wrongSentence: "After cleaning the kitchen smelled lovely.",
            correctSentence: "After cleaning, the kitchen smelled lovely.",
            mistake: "forgot the comma after the opener 'After cleaning' — without it, it sounds like someone cleaned the kitchen (as an object) and then something smelled lovely",
            rule: "Always put a comma after an opening time phrase to separate it from the main sentence",
            testWrong: "While she was ironing her cat sat on the sofa.",
            testCorrect: "While she was ironing, her cat sat on the sofa.",
            testExplain: "Without the comma, it sounds like she was ironing her cat! The comma separates the opening phrase from the main sentence"
          },
          {
            name: "Zara",
            scenario: "checking sentences in her 11+ practice paper",
            wrongSentence: "Come and help Jack Uncle Tom is here.",
            correctSentence: "Come and help Jack, Uncle Tom is here.",
            mistake: "forgot the comma after 'Jack' — without it, it sounds like someone should help both Jack and Uncle Tom arrive",
            rule: "Use a comma to show you're addressing someone by name or to separate two connected statements",
            testWrong: "Slow down Ella the road is icy.",
            testCorrect: "Slow down, Ella, the road is icy.",
            testExplain: "You're talking TO Ella and giving a reason. Commas around her name show she's being addressed directly"
          },
          {
            name: "Reuben",
            scenario: "editing funny headlines for the school newspaper",
            wrongSentence: "The teacher said my work was excellent during assembly.",
            correctSentence: "The teacher said, during assembly, my work was excellent.",
            mistake: "the missing commas make it sound like the work was only excellent during assembly! Moving and adding commas clarifies that the teacher SPOKE during assembly",
            rule: "Commas separate extra information from the main meaning to prevent confusion",
            testWrong: "I saw the man with the telescope.",
            testCorrect: "I saw the man, with the telescope.",
            testExplain: "Without the comma, it could mean the man has a telescope OR you used a telescope to see him. The comma makes it clearer that you used the telescope"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "This sentence says something very strange!",
            body: (v) => `${v.name} is ${v.scenario}. Read this sentence carefully — it says something a bit weird because of a missing comma!\n\n**"${v.wrongSentence}"**\n\nCan you see the accidental funny meaning?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Spot the punctuation issue:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "One little comma fixes everything!",
            body: (v) => `${v.name} found that this sentence ${v.mistake}. Amazing how one tiny mark can change everything, isn't it?\n\n**Rule:** ${v.rule}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `CONFUSING: "${v.wrongSentence}"`, why: v.mistake },
                  { text: `CLEAR: "${v.correctSentence}"`, why: v.rule },
                  { text: "A single comma can save the whole sentence", why: "Always re-read what you've written — you might be accidentally saying something hilarious!" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn to fix it!",
            body: (v) => `Which version makes the meaning clear?\n\n**"${v.testWrong}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is the correct version?`,
              getOptions: (v) => [
                v.testCorrect,
                v.testWrong,
                v.testWrong + ",",
                v.testWrong.replace(".", ",."),
                ", " + v.testWrong
              ],
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Well done! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! The correct version is: **"${v.testCorrect}"**. ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Comma hero — saving sentences everywhere!",
            body: () => `A missing comma can completely change what your sentence means! Now you know this, you'll never look at sentences the same way again:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "After writing a sentence, re-read it without any commas", why: "Does it accidentally say something silly? If you giggle, you need a comma!" },
                  { text: "Add commas after openers: 'After eating, ...'", why: "This separates the opening phrase from the main idea — and saves the dog!" },
                  { text: "Add commas when addressing people: 'Help me, Mum!'", why: "Shows you're talking TO someone, not about them. Important difference!" },
                  { text: "If a sentence could mean two things, add a comma to make it clear", why: "Commas remove confusion and make your meaning crystal clear. That's what great writers do! ✓" }
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
  // SUB-CONCEPT 12: ellipsis
  // Ellipsis — the three dots that show trailing off, suspense, or missing words
  // Category: other
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "ellipsis",
    name: "Ellipsis \u2014 The Three Dots...",
    category: "other",
    lessons: [
      // ---- Lesson A: Step-by-step ----
      {
        id: "ellipsis-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll unlock the three superpowers of the ellipsis (the three dots ...): making a voice trail off, building suspense, and showing words have been left out",
          "The strict rule that surprises people — an ellipsis is always exactly THREE dots, no more, no less!"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "writing a mystery story for the school competition",
            trailingOff: "I think I might have... oh, never mind.",
            trailingWhy: "The character trails off mid-sentence — they stop themselves from finishing",
            suspense: "She opened the door slowly and saw...",
            suspenseWhy: "The three dots build suspense — the reader has to wait to find out what she saw!",
            missing: "To be or not to be... that is the question.",
            missingWhy: "The ellipsis shows some of Shakespeare's original words have been left out",
            testSentence: "The house was silent. Then, from the attic...",
            testUse: "building suspense",
            testWrongUse: "showing missing words"
          },
          {
            name: "Finn",
            scenario: "reading a chapter book with his dad",
            trailingOff: "Well, I suppose we could... actually, forget I said anything.",
            trailingWhy: "The speaker changes their mind and trails off before finishing their thought",
            suspense: "He reached into the dark cupboard and felt...",
            suspenseWhy: "The three dots create a cliffhanger — what did he feel?",
            missing: "Twinkle, twinkle... how I wonder what you are.",
            missingWhy: "The ellipsis shows that some words from the nursery rhyme have been missed out",
            testSentence: "I was going to tell you, but... no, I really shouldn't.",
            testUse: "trailing off",
            testWrongUse: "building suspense"
          },
          {
            name: "Aisha",
            scenario: "studying how authors create tension in English class",
            trailingOff: "Maybe I should... no, that's a terrible idea.",
            trailingWhy: "The character starts to say something but stops — they trail off",
            suspense: "Behind the curtain, something was breathing...",
            suspenseWhy: "The ellipsis creates suspense — what is behind the curtain?",
            missing: "Friends, Romans, countrymen... I come to bury Caesar.",
            missingWhy: "Some of the original speech has been left out, shown by the ellipsis",
            testSentence: "The footsteps grew louder and louder and then...",
            testUse: "building suspense",
            testWrongUse: "trailing off"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "The mysterious three dots...",
            body: (v) => `${v.name} is ${v.scenario}. ${v.name} keeps seeing these three dots everywhere:\n\n**"${v.suspense}"**\n\nThose three dots are called an **ellipsis** (say: eh-LIP-sis). They're one of the coolest punctuation marks — and they do some really clever things in writing!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.trailingOff,
                highlightWords: [],
                label: "Read the sentence:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Three dots, three superpowers!",
            body: (v) => `In ${v.name}'s sentence **"${v.suspense}"**, the three dots (...) are called an **ellipsis**. It's a powerful little mark — and it has three main jobs:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `1. Trailing off: "${v.trailingOff}"`, why: v.trailingWhy },
                  { text: `2. Building suspense: "${v.suspense}"`, why: v.suspenseWhy },
                  { text: `3. Missing words: "${v.missing}"`, why: v.missingWhy },
                  { text: "Always use exactly THREE dots", why: "Two dots or four dots are incorrect — it must be three (...)" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `An ellipsis is always exactly ____ dots`,
              options: (v) => ["two", "three", "four", "as many as you like"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! Exactly three dots (...) — no more, no fewer. You've got it! ✓`,
                incorrect: (v) => `Nearly! An ellipsis must be exactly THREE dots (...). Two dots or four dots? That's just wrong! Remember: three, always three.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is the ellipsis doing in this sentence?\n\n**"${v.testSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testSentence,
                highlightWords: [],
                label: "Check the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the ellipsis used for here?`,
              getOptions: (v) => [
                `It is ${v.testUse}`,
                `It is ${v.testWrongUse}`,
                "It is showing a list continues",
                "It is replacing a full stop",
                "It is a spelling mistake"
              ],
              correctAnswer: (v) => `It is ${v.testUse}`,
              feedback: {
                correct: (v) => `Spot on! The ellipsis here is ${v.testUse}. Can you feel that pause and wonder? That's the power of three dots! ✓`,
                incorrect: (v) => `So close! The ellipsis in "${v.testSentence}" is actually ${v.testUse}. Read it aloud and you can feel the dramatic pause it creates!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Ellipsis — three dots, three jobs, sorted!",
            body: () => `Remember the three dots (...) and their three superpowers. Using these well will make your creative writing seriously impressive:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Trailing off — when someone stops mid-sentence", why: "'I was going to... oh, never mind.' — you can almost hear them change their mind!" },
                  { text: "Building suspense — creating a cliffhanger or tension", why: "'She opened the box and found...' — the reader HAS to keep reading!" },
                  { text: "Missing words — showing words have been left out", why: "'To be or not to be... that is the question.' — neat and tidy" },
                  { text: "ALWAYS exactly three dots: ...", why: "Two dots (..) or four dots (....) are always wrong. Three is the magic number! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot-the-mistake ----
      {
        id: "ellipsis-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "You'll catch ellipsis (three dots ...) mistakes that pop up all the time — even in published books!",
          "The two big blunders: using the wrong number of dots, or sticking an ellipsis where a different punctuation mark should go"
        ],
        variableSets: [
          {
            name: "Leo",
            scenario: "checking punctuation in his story before handing it in",
            wrongSentence: "The cave was dark and cold.... Something moved in the shadows.",
            correctSentence: "The cave was dark and cold... Something moved in the shadows.",
            mistake: "used four dots instead of three — an ellipsis is always exactly three dots",
            rule: "An ellipsis is always three dots (...), never two or four",
            testWrong: "She whispered, \"I think I saw...... a ghost!\"",
            testCorrect: "She whispered, \"I think I saw... a ghost!\"",
            testExplain: "Six dots is far too many! An ellipsis is always exactly three dots, no matter how dramatic the pause"
          },
          {
            name: "Maisie",
            scenario: "reviewing her friend's creative writing",
            wrongSentence: "I really wanted to go.. but I changed my mind.",
            correctSentence: "I really wanted to go... but I changed my mind.",
            mistake: "used only two dots instead of three — an ellipsis needs exactly three dots",
            rule: "Two dots (..) is not a real punctuation mark — the ellipsis always has three dots (...)",
            testWrong: "The ship sailed into the fog and was never seen again..",
            testCorrect: "The ship sailed into the fog and was never seen again...",
            testExplain: "Two dots isn't an ellipsis! You need exactly three dots to show the mysterious trailing off"
          },
          {
            name: "Seb",
            scenario: "practising ellipsis use for his English test",
            wrongSentence: "\"Wait...\" he said. \"I think... I know... where... the... treasure... is...\"",
            correctSentence: "\"Wait...\" he said. \"I think I know where the treasure is.\"",
            mistake: "overused the ellipsis — putting three dots between every word makes the sentence almost unreadable",
            rule: "An ellipsis should be used for effect, not scattered between every word. Use it once or twice per sentence at most",
            testWrong: "\"Help...me...please...I'm...stuck...\"",
            testCorrect: "\"Help... I'm stuck!\"",
            testExplain: "Using an ellipsis between every word is confusing. One ellipsis shows the pause, then finish the sentence clearly"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Something's wrong with these dots!",
            body: (v) => `${v.name} is ${v.scenario}. The ellipsis in this sentence has gone wrong — can you spot the problem?\n\n**${v.wrongSentence}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Spot the punctuation issue:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the fix!",
            body: (v) => `${v.name} ${v.mistake}. Don't worry — dot-counting mistakes are really common!\n\n**Rule:** ${v.rule}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: ${v.wrongSentence}`, why: v.mistake },
                  { text: `RIGHT: ${v.correctSentence}`, why: v.rule },
                  { text: "Three dots. Always three. Exactly three.", why: "Count them on your fingers if you need to! It's worth getting right." }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which version uses the ellipsis correctly?\n\n**${v.testWrong}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which version is correct?`,
              getOptions: (v) => [
                v.testCorrect,
                v.testWrong,
                v.testWrong.replace("...", "..").replace("..", ".."),
                v.testCorrect.replace("...", "...."),
                v.testCorrect.replace("...", "..")
              ],
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Well done! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! The correct version is: **${v.testCorrect}**. ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Ellipsis — you've mastered the three dots!",
            body: () => `Before you use an ellipsis, run through this checklist. Used well, it makes your writing seriously dramatic:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Always use exactly three dots: ...", why: "Not two, not four, not six — three is the magic number!" },
                  { text: "Use it for trailing off, suspense, or missing words", why: "Three uses for three dots — easy to remember!" },
                  { text: "Don't overuse it — once or twice per paragraph is plenty", why: "Too many ellipses make writing feel broken. Less is more!" },
                  { text: "An ellipsis is a real punctuation mark — treat it with respect!", why: "Used well, it creates mystery and drama. That's the kind of writing that impresses examiners! ✓" }
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
  // SUB-CONCEPT 13: hyphens
  // Hyphens in compound words — joining words together
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "hyphens",
    name: "Hyphens in Compound Words",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step-by-step ----
      {
        id: "hyphens-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll discover when two describing words need a hyphen to team up — like 'well-known' or 'ice-cold' — these are called compound adjectives (two words joined to describe something)",
          "How hyphens act like tiny bridges joining words together in numbers, prefixes (word beginnings like 're-' or 'pre-'), and compound words"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "describing characters in her creative writing",
            compoundBefore: "a well-known author",
            compoundAfter: "the author is well known",
            beforeNoun: "author",
            whyBefore: "Before the noun, the two words act as ONE adjective, so they need a hyphen to join them",
            whyAfter: "After the noun, no hyphen is needed — the words stand on their own",
            numberExample: "twenty-one",
            numberRule: "Numbers from twenty-one to ninety-nine are always hyphenated",
            prefixExample: "pre-Victorian",
            prefixRule: "Prefixes before proper nouns need a hyphen: pre-Victorian, post-Brexit",
            testPhrase: "a well known singer",
            testCorrect: "a well-known singer",
            testWhy: "'well-known' comes before the noun 'singer', so it needs a hyphen to join the two words into one adjective"
          },
          {
            name: "Ben",
            scenario: "writing a description of his neighbourhood for homework",
            compoundBefore: "an old-fashioned sweet shop",
            compoundAfter: "the sweet shop is old fashioned",
            beforeNoun: "sweet shop",
            whyBefore: "'Old' and 'fashioned' work together as one adjective before the noun, so they need a hyphen",
            whyAfter: "After the noun, the words don't need joining together",
            numberExample: "thirty-five",
            numberRule: "Compound numbers (twenty-one to ninety-nine) always get a hyphen",
            prefixExample: "post-2020",
            prefixRule: "Prefixes before dates or proper nouns need a hyphen",
            testPhrase: "a five year old boy",
            testCorrect: "a five-year-old boy",
            testWhy: "'Five-year-old' is a compound adjective before the noun 'boy'. All three words join together with hyphens"
          },
          {
            name: "Grace",
            scenario: "checking her spelling test answers",
            compoundBefore: "a hard-working student",
            compoundAfter: "the student is hard working",
            beforeNoun: "student",
            whyBefore: "'Hard' and 'working' form one adjective before the noun, so they need a hyphen",
            whyAfter: "After the noun, the words are separate — no hyphen needed",
            numberExample: "sixty-seven",
            numberRule: "Written numbers from twenty-one to ninety-nine always have a hyphen",
            prefixExample: "non-fiction",
            prefixRule: "Some prefixes always use a hyphen: non-fiction, self-esteem, ex-president",
            testPhrase: "a well behaved dog",
            testCorrect: "a well-behaved dog",
            testWhy: "'Well-behaved' comes before the noun 'dog', so it needs a hyphen to show the two words work together as one adjective"
          },
          {
            name: "Daisy",
            scenario: "reading a style guide for the school magazine",
            compoundBefore: "a brightly-lit room",
            compoundAfter: "the room was brightly lit",
            beforeNoun: "room",
            whyBefore: "The two words describe the room together before the noun, so they need a hyphen",
            whyAfter: "After the noun, the words are separate",
            numberExample: "forty-two",
            numberRule: "Compound numbers are always hyphenated when written out",
            prefixExample: "anti-clockwise",
            prefixRule: "Prefixes like anti-, non-, self-, and ex- often use hyphens",
            testPhrase: "an ice cream flavoured cake",
            testCorrect: "an ice-cream-flavoured cake",
            testWhy: "'Ice-cream-flavoured' is a compound adjective before the noun 'cake'. The hyphens join all the words into one description"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "The tiny line with a big job!",
            body: (v) => `${v.name} is ${v.scenario}. Did you know a tiny little line can change how words work together? Look at the difference:\n\n**"${v.compoundBefore}"** (with hyphen)\n**"${v.compoundAfter}"** (no hyphen)\n\nThe hyphen (-) joins two words together when they come BEFORE the noun they describe. It's like a bridge between them!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `"${v.compoundBefore}" vs "${v.compoundAfter}"`,
                highlightWords: [],
                label: "With or without a hyphen?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Hyphens — the word-joining superpower!",
            body: (v) => `We saw **"${v.compoundBefore}"** (with hyphen) and **"${v.compoundAfter}"** (without). Hyphens are like tiny bridges that join words together. Here are the rules:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Compound adjectives BEFORE a noun: "${v.compoundBefore}"`, why: v.whyBefore },
                  { text: `Numbers: "${v.numberExample}"`, why: v.numberRule },
                  { text: `Prefixes: "${v.prefixExample}"`, why: v.prefixRule },
                  { text: `NO hyphen AFTER the noun: "${v.compoundAfter}"`, why: v.whyAfter }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `A compound adjective needs a hyphen when it comes ____ the noun`,
              options: (v) => ["before", "after", "anywhere near", "instead of"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Exactly! "A well-known author" needs the hyphen because "well-known" comes BEFORE the noun. You've got this! ✓`,
                incorrect: (v) => `Nearly! Compound adjectives need a hyphen when they come BEFORE the noun, like "a well-known author". Before = hyphen!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which version is correct?\n\n**"${v.testPhrase}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testPhrase,
                highlightWords: [{ word: v.testPhrase, color: "#7C3AED" }],
                label: "What does this mean?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which version is correct?`,
              getOptions: (v) => [
                v.testCorrect,
                v.testPhrase,
                v.testPhrase.replace(/ /g, "-"),
                v.testPhrase.replace(/ /g, ""),
                v.testCorrect.replace("-", " — ")
              ],
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Spot on! ${v.testWhy} ✓`,
                incorrect: (v) => `Not quite! The correct version is: **"${v.testCorrect}"**. ${v.testWhy}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Hyphens — tiny but mighty!",
            body: () => `Hyphens are small but knowing when to use them makes your writing look really polished. Here's your guide:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Compound adjective BEFORE a noun → hyphen", why: "'a well-known author' (but 'the author is well known') — position is everything!" },
                  { text: "Numbers twenty-one to ninety-nine → always hyphenated", why: "thirty-five, forty-two, sixty-seven — no exceptions!" },
                  { text: "Prefixes before proper nouns or dates → hyphen", why: "pre-Victorian, post-2020, non-fiction — the hyphen keeps things clear" },
                  { text: "Compound adjective AFTER a noun → no hyphen", why: "'The student is hard working' — no hyphen needed when it comes after. Knowing this is a real flex! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot-the-mistake ----
      {
        id: "hyphens-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "You'll spot where hyphens have gone missing or sneaked into the wrong place",
          "The common hyphen traps in compound adjectives (joined describing words) and numbers — and how to sidestep them"
        ],
        variableSets: [
          {
            name: "Oliver",
            scenario: "proofreading his book report",
            wrongSentence: "The well known detective solved the mystery in twenty one days.",
            correctSentence: "The well-known detective solved the mystery in twenty-one days.",
            mistake: "forgot hyphens in 'well-known' (compound adjective before a noun) and 'twenty-one' (compound number)",
            rule: "Compound adjectives before nouns and numbers from twenty-one to ninety-nine always need hyphens",
            testWrong: "She is a hard working, ten year old girl.",
            testCorrect: "She is a hard-working, ten-year-old girl.",
            testExplain: "'Hard-working' and 'ten-year-old' both come before the noun 'girl', so they need hyphens"
          },
          {
            name: "Priya",
            scenario: "checking her English homework answers",
            wrongSentence: "The old fashioned building had a brightly-lit entrance.",
            correctSentence: "The old-fashioned building had a brightly-lit entrance.",
            mistake: "forgot the hyphen in 'old-fashioned' — it's a compound adjective before the noun 'building'",
            rule: "When two or more words work together as an adjective before a noun, they need a hyphen",
            testWrong: "It was a record breaking, once in a lifetime event.",
            testCorrect: "It was a record-breaking, once-in-a-lifetime event.",
            testExplain: "'Record-breaking' and 'once-in-a-lifetime' are both compound adjectives before the noun 'event', so they need hyphens"
          },
          {
            name: "Reuben",
            scenario: "editing an article for the school blog",
            wrongSentence: "There were forty three, self confident children in the non fiction reading group.",
            correctSentence: "There were forty-three, self-confident children in the non-fiction reading group.",
            mistake: "forgot hyphens in 'forty-three' (compound number), 'self-confident' (prefix compound), and 'non-fiction' (prefix before a word)",
            rule: "Compound numbers, self- prefixes, and non- prefixes always need hyphens",
            testWrong: "The ex champion ate twenty two ice cream sundaes at the post match party.",
            testCorrect: "The ex-champion ate twenty-two ice-cream sundaes at the post-match party.",
            testExplain: "'Ex-champion' (prefix), 'twenty-two' (compound number), 'ice-cream' (compound noun), and 'post-match' (prefix) all need hyphens"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "The hyphens have gone missing!",
            body: (v) => `${v.name} is ${v.scenario}. Some hyphens have disappeared from this sentence — can you spot where they should be?\n\n**"${v.wrongSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Spot the punctuation issue:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's where the hyphens belong!",
            body: (v) => `${v.name} ${v.mistake}. Missing hyphens are one of the sneakiest mistakes — they're so small that people forget them!\n\n**Rule:** ${v.rule}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: "${v.wrongSentence}"`, why: v.mistake },
                  { text: `RIGHT: "${v.correctSentence}"`, why: v.rule },
                  { text: "Hyphens join words that work together", why: "If two words act as ONE adjective before a noun, link them with a hyphen — like a tiny bridge!" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Now you have a go!",
            body: (v) => `Which version has the hyphens in the right places?\n\n**"${v.testWrong}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testWrong,
                highlightWords: [],
                label: "Fix the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which version is correct?`,
              getOptions: (v) => [
                v.testCorrect,
                v.testWrong,
                v.testWrong.replace(/ /g, "-"),
                v.testCorrect.replace(/-/g, " "),
                v.testWrong.replace(",", "-,")
              ],
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Well done! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! The correct version is: **"${v.testCorrect}"**. ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Hyphens — you've cracked the code!",
            body: () => `Check your writing for missing hyphens. Most people don't bother — but getting them right makes your writing look brilliant:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Compound adjective before a noun? → add a hyphen", why: "well-known, old-fashioned, hard-working — they're a team!" },
                  { text: "A number from twenty-one to ninety-nine? → add a hyphen", why: "thirty-five, forty-two, sixty-seven — no exceptions!" },
                  { text: "A prefix like non-, self-, ex-, pre-, post-? → usually needs a hyphen", why: "non-fiction, self-confident, ex-champion, pre-Victorian" },
                  { text: "After the noun? → no hyphen needed", why: "'The author is well known' — no hyphen here. Position is everything! ✓" }
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
  // SUB-CONCEPT 14: dashes
  // Dashes for emphasis and interruption — different from hyphens!
  // Category: other
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "dashes",
    name: "Dashes for Emphasis and Interruption",
    category: "other",
    lessons: [
      // ---- Lesson A: Step-by-step ----
      {
        id: "dashes-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll learn the dash's secret talent — adding emphasis, afterthoughts, and dramatic surprise to your writing",
          "The dash (\u2014) vs the hyphen (-): they look similar but do completely different jobs — you'll never mix them up again!"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "studying how authors create dramatic sentences",
            emphasisSentence: "The answer \u2014 believe it or not \u2014 was zero.",
            emphasisPart: "believe it or not",
            emphasisWhy: "The dashes add dramatic emphasis — like a spoken aside. They're stronger than commas",
            surpriseSentence: "She opened the box and found \u2014 nothing.",
            surpriseWhy: "The single dash creates a dramatic pause before the surprise ending",
            parentheticalSentence: "The old house \u2014 dark, cold and empty \u2014 stood at the end of the lane.",
            parentheticalPart: "dark, cold and empty",
            parentheticalWhy: "The dashes work like brackets, adding a vivid description with extra drama",
            testSentence: "He ran to the finish line and won \u2014 by just one second!",
            testUse: "introducing a dramatic surprise",
            testWrongUse: "adding extra information in the middle of a sentence"
          },
          {
            name: "Ella",
            scenario: "reading a suspense novel and noticing the punctuation",
            emphasisSentence: "Three children \u2014 all younger than ten \u2014 solved the mystery.",
            emphasisPart: "all younger than ten",
            emphasisWhy: "The dashes emphasise the surprising detail that the detectives were young children",
            surpriseSentence: "The detective turned around and saw \u2014 his own reflection.",
            surpriseWhy: "The dash builds suspense before the unexpected twist",
            parentheticalSentence: "The treasure \u2014 hidden for over a hundred years \u2014 was finally found.",
            parentheticalPart: "hidden for over a hundred years",
            parentheticalWhy: "The dashes highlight the dramatic detail about how long the treasure was hidden",
            testSentence: "Everyone expected the team to lose \u2014 but they won!",
            testUse: "creating a dramatic contrast or surprise",
            testWrongUse: "showing an afterthought"
          },
          {
            name: "Finn",
            scenario: "practising punctuation for his English test",
            emphasisSentence: "The journey \u2014 long, tiring and full of surprises \u2014 was worth every moment.",
            emphasisPart: "long, tiring and full of surprises",
            emphasisWhy: "The dashes frame a vivid description with more emphasis than commas would give",
            surpriseSentence: "He opened the door and there stood \u2014 Father Christmas!",
            surpriseWhy: "The dash creates a pause for dramatic effect before the big reveal",
            parentheticalSentence: "My gran \u2014 the bravest person I know \u2014 once climbed Mount Snowdon.",
            parentheticalPart: "the bravest person I know",
            parentheticalWhy: "The dashes highlight a personal, emotional description with more punch than commas",
            testSentence: "She studied every night \u2014 and it paid off.",
            testUse: "introducing a dramatic result or contrast",
            testWrongUse: "adding extra information"
          },
          {
            name: "Priya",
            scenario: "writing a persuasive letter for her homework",
            emphasisSentence: "The playground \u2014 our only outdoor space \u2014 desperately needs new equipment.",
            emphasisPart: "our only outdoor space",
            emphasisWhy: "The dashes emphasise this important point — it's our ONLY outdoor space",
            surpriseSentence: "The council's response was \u2014 silence.",
            surpriseWhy: "The dash creates a dramatic pause before the disappointing one-word answer",
            parentheticalSentence: "Every child \u2014 from Reception to Year 6 \u2014 uses the playground daily.",
            parentheticalPart: "from Reception to Year 6",
            parentheticalWhy: "The dashes highlight the range of children affected, making the argument stronger",
            testSentence: "We asked for a simple thing \u2014 a safe place to play.",
            testUse: "introducing a powerful point or summary",
            testWrongUse: "adding an afterthought"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Meet the most dramatic punctuation mark!",
            body: (v) => `${v.name} is ${v.scenario}. Look at how dashes create drama:\n\n**"${v.surpriseSentence}"**\n\nThe dash (\u2014) is the show-off of the punctuation world! It's DIFFERENT from a hyphen (-) and it creates **emphasis**, **surprise**, or a **dramatic pause**. Think of it as punctuation with attitude!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.emphasisSentence,
                highlightWords: [],
                label: "Read the sentence:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Three ways dashes make your writing amazing!",
            body: (v) => `Look at ${v.name}'s sentence: **"${v.surpriseSentence}"**. Dashes (\u2014) are like the special effects of punctuation — they've got three main jobs:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `1. Emphasis in pairs: "${v.emphasisSentence}"`, why: v.emphasisWhy },
                  { text: `2. Dramatic surprise: "${v.surpriseSentence}"`, why: v.surpriseWhy },
                  { text: `3. Vivid description: "${v.parentheticalSentence}"`, why: v.parentheticalWhy },
                  { text: "Dashes (\u2014) are NOT hyphens (-)", why: "A hyphen joins words (ice-cream). A dash adds drama! They look similar but do completely different jobs." }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is the dash doing in this sentence?\n\n**"${v.testSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testSentence,
                highlightWords: [],
                label: "Check the punctuation:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the dash used for here?`,
              getOptions: (v) => [
                `It is ${v.testUse}`,
                `It is ${v.testWrongUse}`,
                "It is joining two words together like a hyphen",
                "It is replacing a full stop",
                "It is showing missing words like an ellipsis"
              ],
              correctAnswer: (v) => `It is ${v.testUse}`,
              feedback: {
                correct: (v) => `Brilliant! The dash here is ${v.testUse}. Can you feel the drama? That's the power of a dash! ✓`,
                incorrect: (v) => `So close! The dash in this sentence is actually ${v.testUse}. Read it aloud and you'll feel the dramatic pause it creates!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Dashes \u2014 your secret dramatic weapon!",
            body: () => `Dashes are like the special effects of punctuation \u2014 they add drama and flair! Using them well makes your creative writing really stand out:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "A pair of dashes for emphasis: 'The dog \u2014 a huge Great Dane \u2014 bounded over.'", why: "Like brackets or commas, but with way more drama!" },
                  { text: "A single dash for surprise: 'She opened the door and saw \u2014 nothing.'", why: "Creates a pause before the unexpected ending — makes your reader gasp!" },
                  { text: "Dashes (\u2014) are NOT hyphens (-)", why: "Hyphens join words. Dashes add drama. They look similar but are totally different!" },
                  { text: "Use dashes sparingly for maximum impact", why: "One or two per paragraph keeps them powerful \u2014 too many and they lose their magic ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot-the-mistake ----
      {
        id: "dashes-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "You'll catch the moment a dash and a hyphen have been swapped — it happens more often than you'd think!",
          "You'll spot sentences where a dash has been used incorrectly and know exactly how to fix them"
        ],
        variableSets: [
          {
            name: "Zara",
            scenario: "comparing dashes and hyphens in a punctuation quiz",
            wrongSentence: "The castle - ancient and crumbling - was said to be haunted.",
            correctSentence: "The castle \u2014 ancient and crumbling \u2014 was said to be haunted.",
            mistake: "used hyphens (-) instead of dashes (\u2014) for emphasis",
            rule: "Hyphens (-) join words together (like 'well-known'). Dashes (\u2014) add emphasis or interruption to a sentence",
            testWrong: "The test - believe it or not - was actually easy.",
            testCorrect: "The test \u2014 believe it or not \u2014 was actually easy.",
            testExplain: "This needs dashes (\u2014) not hyphens (-), because 'believe it or not' is an emphatic interruption, not a compound word"
          },
          {
            name: "Leo",
            scenario: "editing a story for the school magazine",
            wrongSentence: "He opened the present and found\u2014a puppy!",
            correctSentence: "He opened the present and found \u2014 a puppy!",
            mistake: "forgot the spaces around the dash \u2014 dashes need a space before and after them",
            rule: "Dashes should have a space either side: 'found \u2014 a puppy' not 'found\u2014a puppy'",
            testWrong: "She looked up and saw\u2014a rainbow!",
            testCorrect: "She looked up and saw \u2014 a rainbow!",
            testExplain: "The dash needs spaces around it for clarity: 'saw \u2014 a rainbow' not 'saw\u2014a rainbow'"
          },
          {
            name: "Amara",
            scenario: "learning the difference between dashes and other punctuation",
            wrongSentence: "The garden - which was overgrown - the shed - falling apart - and the fence - broken in three places - all needed fixing.",
            correctSentence: "The garden, which was overgrown, the shed, falling apart, and the fence, broken in three places, all needed fixing.",
            mistake: "overused dashes where commas would be clearer \u2014 too many dashes make a sentence confusing",
            rule: "Use dashes sparingly for emphasis. If you have lots of extra information, commas or brackets are often clearer",
            testWrong: "My cat \u2014 a tabby \u2014 my dog \u2014 a spaniel \u2014 and my hamster \u2014 called Nibbles \u2014 are all friends.",
            testCorrect: "My cat (a tabby), my dog (a spaniel), and my hamster (called Nibbles) are all friends.",
            testExplain: "With three pieces of extra information, brackets and commas are much clearer than six dashes! Save dashes for when you want real emphasis"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Dash disaster — can you spot it?",
            body: (v) => `${v.name} is ${v.scenario}. Something's gone wrong with the dashes in this sentence — can you figure out what?\n\n**"${v.wrongSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Spot the punctuation issue:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the fix!",
            body: (v) => `${v.name}'s mistake: **${v.mistake}**. Dashes and hyphens look so similar that mixing them up is really common — but now you know the difference!\n\n${v.rule}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: "${v.wrongSentence}"`, why: v.mistake },
                  { text: `RIGHT: "${v.correctSentence}"`, why: v.rule },
                  { text: "Remember: a dash (\u2014) is NOT a hyphen (-)", why: "Dashes add drama. Hyphens join words. They look similar but do completely different jobs!" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which version is correct?\n\n**"${v.testWrong}"**`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which version is correct?`,
              getOptions: (v) => [
                v.testCorrect,
                v.testWrong,
                v.testWrong.replace(/\u2014/g, "-"),
                v.testWrong.replace(/\u2014/g, "..."),
                v.testCorrect.replace(/\u2014/g, ";")
              ],
              correctAnswer: (v) => v.testCorrect,
              feedback: {
                correct: (v) => `Well done! ${v.testExplain} ✓`,
                incorrect: (v) => `Not quite! The correct version is: **"${v.testCorrect}"**. ${v.testExplain}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Dashes — you're a pro now!",
            body: () => `Dashes are powerful \u2014 but only when used well! Now you know the rules, you can use them like a real author:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "A dash (\u2014) is NOT a hyphen (-)", why: "Dashes add drama. Hyphens join words like 'well-known'. Knowing the difference is impressive!" },
                  { text: "Dashes need spaces around them", why: "'found \u2014 a puppy' NOT 'found\u2014a puppy' — give them room to breathe!" },
                  { text: "Use dashes sparingly \u2014 one or two per paragraph", why: "Too many dashes and they lose their power. Less is more!" },
                  { text: "Dashes add drama: emphasis, surprise, or interruption", why: "They're the strongest way to create a dramatic moment. Use them well and your writing will really stand out \u2713" }
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

// ============================================================
// Supplementary sub-concepts for Vocabulary
// To merge: add these to lessonBank.vocabulary.subConcepts array in lessonData.js
// ============================================================

export const vocabularySubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: synonyms
  // Finding Synonyms — closest meaning words
  // Category: core
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "synonyms",
    name: "Finding Synonyms",
    category: "core",
    lessons: [
      // ---- Lesson A: Step-by-Step Substitution Method ----
      {
        id: "synonyms-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll learn how to find a word that means the same or nearly the same — it's like being a word detective!",
          "You'll discover how to check your synonym (a word with the same meaning) fits the sentence perfectly"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "is reading a story and comes across the sentence",
            sentence: "The furious dragon stomped through the village.",
            targetWord: "furious",
            correctSynonym: "angry",
            options: ["angry", "calm", "confused", "tired", "lonely"],
            correctIndex: 0,
            testSentence: "The angry dragon stomped through the village.",
            whyCorrect: "Furious means very angry, so the sentence still makes sense",
            whyWrong: "Calm means peaceful — that's the opposite of furious",
            // Interact-specific (different example)
            iSentence: "The cheerful children sang songs on the bus.",
            iTargetWord: "cheerful",
            iCorrectSynonym: "happy",
            iOptions: ["happy", "noisy", "naughty", "bored", "shy"],
            iCorrectIndex: 0,
            iWhyCorrect: "Cheerful means happy and in good spirits, so 'happy' is the closest synonym",
            iWhyWrong: "Noisy describes volume, not mood"
          },
          {
            name: "Oliver",
            scenario: "reads this sentence in his comprehension passage",
            sentence: "The enormous castle towered over the tiny houses.",
            targetWord: "enormous",
            correctSynonym: "huge",
            options: ["huge", "narrow", "ancient", "beautiful", "empty"],
            correctIndex: 0,
            testSentence: "The huge castle towered over the tiny houses.",
            whyCorrect: "Enormous means very big, so huge is the closest match",
            whyWrong: "Ancient means very old — that describes age, not size",
            // Interact-specific (different example)
            iSentence: "The wealthy businessman owned three houses.",
            iTargetWord: "wealthy",
            iCorrectSynonym: "rich",
            iOptions: ["rich", "greedy", "famous", "lucky", "proud"],
            iCorrectIndex: 0,
            iWhyCorrect: "Wealthy means having a lot of money, so 'rich' is the closest synonym",
            iWhyWrong: "Greedy means wanting more than you need — that's about behaviour, not how much money you have"
          },
          {
            name: "Priya",
            scenario: "finds this sentence in her English homework",
            sentence: "The timid rabbit hid behind the bushes.",
            targetWord: "timid",
            correctSynonym: "shy",
            options: ["shy", "brave", "playful", "hungry", "sleepy"],
            correctIndex: 0,
            testSentence: "The shy rabbit hid behind the bushes.",
            whyCorrect: "Timid means nervous and shy, so the rabbit still makes sense hiding",
            whyWrong: "Brave means the opposite — a brave rabbit wouldn't hide",
            // Interact-specific (different example)
            iSentence: "The rapid river flowed through the valley.",
            iTargetWord: "rapid",
            iCorrectSynonym: "fast",
            iOptions: ["fast", "deep", "wide", "cold", "dangerous"],
            iCorrectIndex: 0,
            iWhyCorrect: "Rapid means moving quickly, so 'fast' is the closest synonym",
            iWhyWrong: "Deep describes how far down the water goes, not how quickly it moves"
          },
          {
            name: "Finn",
            scenario: "spots this sentence in his reading book",
            sentence: "The cunning fox crept through the farmyard.",
            targetWord: "cunning",
            correctSynonym: "clever",
            options: ["clever", "clumsy", "friendly", "slow", "gentle"],
            correctIndex: 0,
            testSentence: "The clever fox crept through the farmyard.",
            whyCorrect: "Cunning means clever in a sneaky way — clever is the closest synonym",
            whyWrong: "Clumsy means awkward and unsteady — the opposite of sneaky",
            // Interact-specific (different example)
            iSentence: "The ancient ruins stood on top of the hill.",
            iTargetWord: "ancient",
            iCorrectSynonym: "old",
            iOptions: ["old", "broken", "famous", "hidden", "large"],
            iCorrectIndex: 0,
            iWhyCorrect: "Ancient means extremely old, so 'old' is the closest synonym",
            iWhyWrong: "Broken describes condition, not age"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What does "${v.targetWord}" mean?`,
            body: (v) => `${v.name} ${v.scenario}:\n\n**"${v.sentence}"**\n\nDid you know? A **synonym** is a word that means the **same** or **nearly the same** as another word. You probably use synonyms every day without even realising! Can you find one for **${v.targetWord}**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.targetWord, color: "#6C5CE7" }],
                label: `Target word: "${v.targetWord}"`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The Substitution Method",
            body: (v) => `Let's find a synonym (a word that means the same) for **"${v.targetWord}"** in ${v.name}'s sentence. Here's a brilliant trick: try **swapping** the word and see if the sentence still means the same thing. If it does — you've nailed it!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Read the sentence: "${v.sentence}"`, why: `Zero in on the word "${v.targetWord}"` },
                  { text: `Think: what does "${v.targetWord}" mean?`, why: "Picture it in your head — what's happening in the scene?" },
                  { text: `Try swapping in "${v.correctSynonym}": "${v.testSentence}"`, why: "Does it still make sense? Yes — brilliant!" },
                  { text: `"${v.correctSynonym}" is a synonym for "${v.targetWord}" ✓`, why: "The meaning hasn't budged — that's how you know it works!" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "happy", right: "joyful" },
                { left: "big", right: "enormous" },
                { left: "said", right: "exclaimed" },
                { left: "walked", right: "strolled" },
                { left: "scared", right: "terrified" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Right, you've got this! Which word is closest in meaning to **"${v.iTargetWord}"** in this sentence?\n\n**"${v.iSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.iSentence,
                highlightWords: [{ word: v.iTargetWord, color: "#6C5CE7" }],
                label: `Find the answer for "${v.iTargetWord}":`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is closest in meaning to "${v.iTargetWord}"?`,
              getOptions: (v) => v.iOptions,
              correctAnswer: (v) => v.iCorrectSynonym,
              feedback: {
                correct: (v) => `Brilliant! "${v.iCorrectSynonym}" means the same as "${v.iTargetWord}". ${v.iWhyCorrect}. You're a natural! ✓`,
                incorrect: (v) => `Nearly! The answer is "${v.iCorrectSynonym}". ${v.iWhyCorrect}. You'll spot it next time!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Finding Synonyms — your recipe for success!",
            body: () => `You've got the hang of it! Here's the method you can use to find a synonym every single time:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Read the sentence carefully", why: "Get a feel for what's happening in the sentence" },
                  { text: "Step 2: Focus on the target word — what does it mean?", why: "Picture the meaning in your head like a little film" },
                  { text: "Step 3: Try swapping in each option", why: "Does the sentence still mean the same thing? That's the key test!" },
                  { text: "Step 4: Pick the word that keeps the meaning closest", why: "That's your synonym — well done! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Curiosity-Hook — Tricky Context-Dependent Synonyms ----
      {
        id: "synonyms-context",
        templateType: "curiosity-hook",
        learningGoal: [
          "You'll discover why the same word can need totally different synonyms depending on the sentence — sneaky, right?",
          "You'll learn how to use context clues to decide which synonym is the right one"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "notices that the word",
            targetWord: "bright",
            sentenceA: "The bright light hurt her eyes.",
            synonymA: "dazzling",
            sentenceB: "Amara is a very bright student.",
            synonymB: "intelligent",
            wrongSynonym: "shiny",
            options: ["intelligent", "shiny", "colourful", "happy", "loud"],
            correctIndex: 0,
            whyCorrect: "In this sentence, 'bright' describes how clever Amara is — so 'intelligent' is the best synonym",
            whyWrong: "'Shiny' would work if bright described a light, but here it describes a person's mind",
            // Interact-specific (different context-dependent synonym)
            iTargetWord: "sharp",
            iSentenceContext: "Grandma has a very sharp mind for her age.",
            iCorrectSynonym: "keen",
            iOptions: ["keen", "pointed", "dangerous", "thin", "painful"],
            iCorrectIndex: 0,
            iWhyCorrect: "Here 'sharp' describes Grandma's mind — it means quick and clever, so 'keen' is the best synonym. 'Pointed' would only work if 'sharp' described a knife"
          },
          {
            name: "Marcus",
            scenario: "reads two sentences using the word",
            targetWord: "fair",
            sentenceA: "The referee made a fair decision.",
            synonymA: "just",
            sentenceB: "She had fair hair and blue eyes.",
            synonymB: "light",
            wrongSynonym: "honest",
            options: ["light", "honest", "beautiful", "warm", "rough"],
            correctIndex: 0,
            whyCorrect: "Here 'fair' describes the colour of her hair — pale or light — not whether something is just or honest",
            whyWrong: "'Honest' would work if 'fair' meant treating people equally, but here it describes a colour",
            // Interact-specific (different context-dependent synonym)
            iTargetWord: "cross",
            iSentenceContext: "Mum was very cross when we came home late.",
            iCorrectSynonym: "angry",
            iOptions: ["angry", "confused", "tired", "worried", "sad"],
            iCorrectIndex: 0,
            iWhyCorrect: "Here 'cross' describes Mum's mood — it means annoyed or angry. It doesn't mean to go across something or a shape with two lines"
          },
          {
            name: "Aisha",
            scenario: "spots two different meanings of the word",
            targetWord: "cool",
            sentenceA: "The cool breeze blew through the window.",
            synonymA: "chilly",
            sentenceB: "Everyone thought the new trainers were really cool.",
            synonymB: "fashionable",
            wrongSynonym: "cold",
            options: ["fashionable", "cold", "calm", "pale", "boring"],
            correctIndex: 0,
            whyCorrect: "Here 'cool' means trendy or fashionable — it's about style, not temperature",
            whyWrong: "'Cold' would work if cool described the weather, but here it describes how popular the trainers are",
            // Interact-specific (different context-dependent synonym)
            iTargetWord: "fit",
            iSentenceContext: "The uniform didn't fit because she had grown over the summer.",
            iCorrectSynonym: "be the right size",
            iOptions: ["be the right size", "healthy and strong", "suitable", "a sudden outburst", "attractive"],
            iCorrectIndex: 0,
            iWhyCorrect: "Here 'fit' means to be the correct size for wearing — the uniform was too small because she had grown. It doesn't mean healthy or suitable in this sentence"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `One word, two meanings!`,
            body: (v) => `Did you know that one little word can play tricks on you? ${v.name} ${v.scenario} **"${v.targetWord}"** can mean completely different things:\n\n**Sentence 1:** "${v.sentenceA}" — here it means **${v.synonymA}**\n\n**Sentence 2:** "${v.sentenceB}" — but here it means something different!\n\nThe **context** (the words around it) is your secret weapon for working out which meaning is right.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.targetWord, color: "#6C5CE7" }],
                label: `Target word: "${v.targetWord}"`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Context changes everything!",
            body: (v) => `Here's something that catches loads of people out: the word **"${v.targetWord}"** can mean **"${v.synonymA}"** in one sentence but something completely different in another! Some words are sneaky like that — they have **more than one meaning**. The rest of the sentence — the **context** — tells you which meaning is being used.\n\nThe golden rule: always read the **whole sentence** before choosing a synonym (a word that means the same).`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Read: "${v.sentenceB}"`, why: `What is "${v.targetWord}" describing here?` },
                  { text: `Look at the context — the words around it`, why: "These clue words tell you the meaning" },
                  { text: `"${v.targetWord}" here means "${v.synonymB}"`, why: `Not "${v.synonymA}" — that was the other meaning!` },
                  { text: `Context changes meaning — always check! ✓`, why: "The same word can need a completely different synonym each time. Tricky but you can handle it!" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Now you try! What is the best synonym for **"${v.iTargetWord}"** in this sentence? Remember to look at the context!\n\n**"${v.iSentenceContext}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.iSentenceContext,
                highlightWords: [{ word: v.iTargetWord, color: "#6C5CE7" }],
                label: `Find the synonym for "${v.iTargetWord}":`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is closest in meaning to "${v.iTargetWord}" in this sentence?`,
              getOptions: (v) => v.iOptions,
              correctAnswer: (v) => v.iCorrectSynonym,
              feedback: {
                correct: (v) => `Well done! ${v.iWhyCorrect}. You read the context like a pro! ✓`,
                incorrect: (v) => `Not quite — but this is a tricky one! ${v.iWhyCorrect}. Keep practising, you're getting better every time.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Same word, different synonyms!",
            body: () => `You've cracked it! Remember: context is everything when choosing a synonym. This skill will come up again and again in the exam, so you're already ahead of the game.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Read the WHOLE sentence", why: "Don't just look at the target word on its own — the clues are all around it" },
                  { text: "Step 2: Ask — what is this word describing here?", why: "Is it about a person, a thing, or a feeling? This narrows it right down" },
                  { text: "Step 3: Pick the synonym that matches THIS meaning", why: "The same word can need a totally different synonym in a different sentence — and now you know how to spot it! ✓" }
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
  // SUB-CONCEPT 2: antonyms
  // Finding Opposites
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "antonyms",
    name: "Finding Opposites",
    category: "core",
    lessons: [
      // ---- Lesson A: Step-by-Step Method for Finding Opposites ----
      {
        id: "antonyms-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll learn how to find a word that means the complete opposite — think of it like flipping a word upside down!",
          "You'll pick up handy prefix (word beginning) shortcuts like un-, dis-, im- that make finding opposites a breeze"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "needs to find the opposite of a word in her English test",
            sentence: "The generous man donated money to the charity.",
            targetWord: "generous",
            correctAntonym: "selfish",
            options: ["selfish", "wealthy", "kind", "cheerful", "humble"],
            correctIndex: 0,
            testSentence: "The selfish man kept all the money for himself.",
            whyCorrect: "Generous means giving freely, so selfish (keeping everything for yourself) is the opposite",
            prefixTrick: false,
            // Interact-specific (different example)
            iSentence: "The calm sea sparkled under the morning sun.",
            iTargetWord: "calm",
            iCorrectAntonym: "rough",
            iOptions: ["rough", "warm", "deep", "blue", "wide"],
            iCorrectIndex: 0,
            iWhyCorrect: "Calm means still and peaceful, so rough (stormy and choppy) is the opposite"
          },
          {
            name: "Ben",
            scenario: "is working on a vocabulary exercise about opposites",
            sentence: "The ancient castle had stood for hundreds of years.",
            targetWord: "ancient",
            correctAntonym: "modern",
            options: ["modern", "broken", "enormous", "famous", "hidden"],
            correctIndex: 0,
            testSentence: "The modern building was only built last year.",
            whyCorrect: "Ancient means extremely old, so modern (new or recent) is the opposite",
            prefixTrick: false,
            // Interact-specific (different example)
            iSentence: "The narrow path wound through the forest.",
            iTargetWord: "narrow",
            iCorrectAntonym: "wide",
            iOptions: ["wide", "long", "dark", "muddy", "steep"],
            iCorrectIndex: 0,
            iWhyCorrect: "Narrow means not very far across, so wide (stretching far across) is the opposite"
          },
          {
            name: "Ella",
            scenario: "is practising antonyms for her 11+ preparation",
            sentence: "The courageous knight faced the dragon.",
            targetWord: "courageous",
            correctAntonym: "cowardly",
            options: ["cowardly", "foolish", "powerful", "famous", "cautious"],
            correctIndex: 0,
            testSentence: "The cowardly knight ran away from the dragon.",
            whyCorrect: "Courageous means brave, so cowardly (too scared to act) is the opposite",
            prefixTrick: false,
            // Interact-specific (different example)
            iSentence: "The polite boy held the door open for the teacher.",
            iTargetWord: "polite",
            iCorrectAntonym: "rude",
            iOptions: ["rude", "quiet", "small", "clever", "slow"],
            iCorrectIndex: 0,
            iWhyCorrect: "Polite means having good manners, so rude (having bad manners) is the opposite"
          },
          {
            name: "Charlie",
            scenario: "reads this sentence and needs to find the antonym",
            sentence: "The transparent water showed the fish swimming below.",
            targetWord: "transparent",
            correctAntonym: "opaque",
            options: ["opaque", "frozen", "shallow", "dirty", "calm"],
            correctIndex: 0,
            testSentence: "The opaque water hid everything beneath the surface.",
            whyCorrect: "Transparent means see-through, so opaque (impossible to see through) is the opposite",
            prefixTrick: false,
            // Interact-specific (different example)
            iSentence: "The cheerful teacher greeted everyone with a smile.",
            iTargetWord: "cheerful",
            iCorrectAntonym: "miserable",
            iOptions: ["miserable", "strict", "young", "loud", "tall"],
            iCorrectIndex: 0,
            iWhyCorrect: "Cheerful means happy and bright, so miserable (very unhappy and gloomy) is the opposite"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's the opposite of "${v.targetWord}"?`,
            body: (v) => `${v.name} ${v.scenario}:\n\n**"${v.sentence}"**\n\nDid you know? An **antonym** is just a fancy word for **opposite**. If you can picture what a word means, you can flip it around to find the antonym. What's the opposite of **${v.targetWord}**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.targetWord, color: "#6C5CE7" }],
                label: `Target word: "${v.targetWord}"`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The Opposite Test",
            body: (v) => `We need an antonym (a word that means the opposite) for **"${v.targetWord}"**. Here's the trick: think about what the word means — then flip it completely around, like turning a coin from heads to tails!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Read: "${v.sentence}"`, why: `What does "${v.targetWord}" mean in this sentence?` },
                  { text: `"${v.targetWord}" means...`, why: "Picture the meaning in your head — really see it" },
                  { text: `Now flip it: what's the complete opposite?`, why: "If generous means giving freely, what means NOT giving? Think of the total reverse!" },
                  { text: `The antonym is "${v.correctAntonym}" ✓`, why: `"${v.testSentence}" — see how the meaning has completely flipped?` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "generous", right: "selfish" },
                { left: "brave", right: "cowardly" },
                { left: "ancient", right: "modern" },
                { left: "expand", right: "shrink" },
                { left: "victory", right: "defeat" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `You've got this! Which word is the **opposite** of **"${v.iTargetWord}"**?\n\n**"${v.iSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.iSentence,
                highlightWords: [{ word: v.iTargetWord, color: "#6C5CE7" }],
                label: `Find the answer for "${v.iTargetWord}":`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is the opposite of "${v.iTargetWord}"?`,
              getOptions: (v) => v.iOptions,
              correctAnswer: (v) => v.iCorrectAntonym,
              feedback: {
                correct: (v) => `Brilliant! ${v.iWhyCorrect}. You flipped it perfectly! ✓`,
                incorrect: (v) => `Close! The answer is "${v.iCorrectAntonym}". ${v.iWhyCorrect}. You'll get the next one!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Finding Antonyms — your recipe for success!",
            body: () => `Nice work! Here's how to find an antonym every time — keep this in your back pocket for the exam:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Read the sentence and understand the target word", why: "What does it actually mean here?" },
                  { text: "Step 2: Think — what's the complete opposite?", why: "Not just a bit different — completely flipped around, like night and day" },
                  { text: "Step 3: Check for prefix shortcuts (un-, dis-, im-)", why: "e.g. happy → unhappy, agree → disagree, possible → impossible — these are quick wins!" },
                  { text: "Step 4: Swap it in — does the sentence now mean the opposite?", why: "If yes, you've nailed it! ✓" }
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
        id: "antonyms-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "You'll learn how to dodge the sneaky trap of picking a word that's just different rather than truly opposite",
          "You'll see why checking the meaning carefully is the key to getting these right every time"
        ],
        variableSets: [
          {
            name: "Holly",
            scenario: "was asked to find the antonym of",
            targetWord: "brave",
            sentence: "The brave firefighter ran into the burning building.",
            wrongAnswer: "foolish",
            correctAntonym: "cowardly",
            mistakeExplanation: "picked 'foolish' because running into a fire could seem foolish — but foolish means unwise, not the opposite of brave. The opposite of brave (willing to face danger) is cowardly (too afraid to act)",
            options: ["cowardly", "foolish", "strong", "quiet", "careless"],
            correctIndex: 0,
            // Interact-specific (different example)
            iSentence: "The generous lady bought gifts for all the children.",
            iTargetWord: "generous",
            iCorrectAntonym: "mean",
            iOptions: ["mean", "poor", "busy", "careful", "shy"],
            iCorrectIndex: 0,
            iWhyCorrect: "Generous means willing to give, so mean (unwilling to share) is the true opposite"
          },
          {
            name: "Jake",
            scenario: "chose the wrong antonym for",
            targetWord: "difficult",
            sentence: "The difficult puzzle took an hour to complete.",
            wrongAnswer: "boring",
            correctAntonym: "easy",
            mistakeExplanation: "chose 'boring' because difficult puzzles can feel boring — but boring is about interest, not difficulty. The opposite of difficult (hard to do) is easy (simple to do)",
            options: ["easy", "boring", "small", "quick", "exciting"],
            correctIndex: 0,
            // Interact-specific (different example)
            iSentence: "The fragile vase had to be wrapped carefully.",
            iTargetWord: "fragile",
            iCorrectAntonym: "sturdy",
            iOptions: ["sturdy", "ugly", "small", "expensive", "dusty"],
            iCorrectIndex: 0,
            iWhyCorrect: "Fragile means easily broken, so sturdy (strong and not easily damaged) is the true opposite"
          },
          {
            name: "Aisha",
            scenario: "made a common mistake with the antonym of",
            targetWord: "noisy",
            sentence: "The noisy crowd cheered loudly at the football match.",
            wrongAnswer: "empty",
            correctAntonym: "quiet",
            mistakeExplanation: "chose 'empty' because an empty stadium would be quiet — but empty is the opposite of full, not the opposite of noisy. The opposite of noisy (loud) is quiet (making little sound)",
            options: ["quiet", "empty", "small", "angry", "slow"],
            correctIndex: 0,
            // Interact-specific (different example)
            iSentence: "The shallow pond was only knee-deep.",
            iTargetWord: "shallow",
            iCorrectAntonym: "deep",
            iOptions: ["deep", "dry", "cold", "muddy", "large"],
            iCorrectIndex: 0,
            iWhyCorrect: "Shallow means not very deep, so deep (going a long way down) is the true opposite"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Spot ${v.name}'s mistake!`,
            body: (v) => `Uh oh! ${v.name} ${v.scenario} **"${v.targetWord}"** in this sentence:\n\n**"${v.sentence}"**\n\n${v.name} chose **"${v.wrongAnswer}"** as the antonym. But that's a trap — can you spot why it's wrong?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.targetWord, color: "#6C5CE7" }],
                label: `Target word: "${v.targetWord}"`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Opposite, not just different!",
            body: (v) => `${v.name} ${v.mistakeExplanation}.\n\nThis catches out loads of people — even grown-ups! The mistake is picking a word that is **related** to the target word but isn't the **exact opposite**. Always ask yourself: "Does this word flip the meaning completely?"`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.targetWord}" means...`, why: "Think about the exact meaning" },
                  { text: `"${v.wrongAnswer}" is NOT the opposite`, why: `It's related but means something different` },
                  { text: `"${v.correctAntonym}" IS the opposite ✓`, why: "It completely flips the meaning" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "What's the real antonym?",
            body: (v) => `Now it's your turn — don't fall into the same trap! What is the **correct** antonym for **"${v.iTargetWord}"**?\n\n**"${v.iSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.iSentence,
                highlightWords: [{ word: v.iTargetWord, color: "#6C5CE7" }],
                label: `Find the answer for "${v.iTargetWord}":`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is the opposite of "${v.iTargetWord}"?`,
              getOptions: (v) => v.iOptions,
              correctAnswer: (v) => v.iCorrectAntonym,
              feedback: {
                correct: (v) => `Well done! "${v.iCorrectAntonym}" is the true opposite of "${v.iTargetWord}". You didn't fall for the trap! ✓`,
                incorrect: (v) => `That's a tricky one! The answer is "${v.iCorrectAntonym}". ${v.iWhyCorrect}. Remember: opposite means completely flipped, not just different.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Opposite — not just different!",
            body: () => `Now you know the trap, you won't fall for it again! Watch out for these common antonym mistakes in the exam:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Don't pick a word that's just RELATED", why: "'foolish' is related to 'brave' but isn't its opposite — that's the classic trap!" },
                  { text: "Ask: does this COMPLETELY flip the meaning?", why: "The sentence should mean the total reverse, like turning a light switch on and off" },
                  { text: "Check for prefix shortcuts: un-, dis-, im-, in-", why: "happy → unhappy, honest → dishonest, patient → impatient — easy marks! ✓" }
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
  // SUB-CONCEPT 3: context-clues
  // Working Out Meaning from Context
  // Category: core
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "context-clues",
    name: "Working Out Meaning from Context",
    category: "core",
    lessons: [
      // ---- Lesson A: Step-by-Step Context Analysis ----
      {
        id: "context-clues-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll learn how to work out what an unfamiliar word means — even if you've never seen it before!",
          "You'll discover how the surrounding words act as secret clues to unlock the meaning"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "comes across an unfamiliar word in her reading book",
            sentence: "The decrepit old building had crumbling walls and broken windows.",
            targetWord: "decrepit",
            correctMeaning: "old and in poor condition",
            clueWords: "crumbling walls, broken windows",
            options: ["old and in poor condition", "very tall", "recently built", "painted brightly", "completely empty"],
            correctIndex: 0,
            whyCorrect: "The clue words 'crumbling walls' and 'broken windows' tell us the building is in bad shape, so decrepit means old and in poor condition",
            whyWrong: "'Very tall' doesn't match — the clues are about damage, not height",
            // Interact-specific (different example)
            iSentence: "The famished children rushed to the table and devoured their lunch in minutes.",
            iTargetWord: "famished",
            iCorrectMeaning: "extremely hungry",
            iOptions: ["extremely hungry", "very excited", "badly behaved", "incredibly tired", "in a great hurry"],
            iCorrectIndex: 0,
            iWhyCorrect: "The clues 'rushed to the table' and 'devoured their lunch in minutes' show the children were starving, so famished means extremely hungry"
          },
          {
            name: "Oscar",
            scenario: "finds a tricky word in a comprehension passage",
            sentence: "The ravenous boy gobbled down three sandwiches and asked for more.",
            targetWord: "ravenous",
            correctMeaning: "extremely hungry",
            clueWords: "gobbled down three sandwiches, asked for more",
            options: ["extremely hungry", "very angry", "badly behaved", "feeling ill", "particularly fussy"],
            correctIndex: 0,
            whyCorrect: "The clues 'gobbled down three sandwiches' and 'asked for more' show the boy was extremely hungry, so ravenous means very hungry",
            whyWrong: "'Very angry' doesn't fit — gobbling food and wanting more shows hunger, not anger",
            // Interact-specific (different example)
            iSentence: "The parched field was cracked and dry after weeks without rain.",
            iTargetWord: "parched",
            iCorrectMeaning: "very dry and in need of water",
            iOptions: ["very dry and in need of water", "extremely cold", "completely flat", "badly damaged", "covered in weeds"],
            iCorrectIndex: 0,
            iWhyCorrect: "The clues 'cracked and dry' and 'weeks without rain' show the field desperately needs water, so parched means very dry"
          },
          {
            name: "Ella",
            scenario: "reads a sentence with a word she hasn't seen before",
            sentence: "The jubilant fans cheered, hugged each other and danced in the streets.",
            targetWord: "jubilant",
            correctMeaning: "extremely happy and celebrating",
            clueWords: "cheered, hugged each other, danced in the streets",
            options: ["extremely happy and celebrating", "very noisy", "completely exhausted", "badly behaved", "feeling nervous"],
            correctIndex: 0,
            whyCorrect: "Cheering, hugging, and dancing are all things people do when they're overjoyed, so jubilant means extremely happy",
            whyWrong: "'Very noisy' is close but misses the key idea — they're noisy because they're celebrating, not just making noise",
            // Interact-specific (different example)
            iSentence: "The dejected boy trudged home after his team lost the final.",
            iTargetWord: "dejected",
            iCorrectMeaning: "sad and disappointed",
            iOptions: ["sad and disappointed", "extremely angry", "very tired", "slightly confused", "rather bored"],
            iCorrectIndex: 0,
            iWhyCorrect: "The clues 'trudged home' and 'team lost the final' both point to someone feeling low and defeated, so dejected means sad and disappointed"
          },
          {
            name: "Amir",
            scenario: "spots an unusual word during his practice test",
            sentence: "After the long hike, the exhausted children trudged slowly back to the car.",
            targetWord: "trudged",
            correctMeaning: "walked slowly and heavily",
            clueWords: "long hike, exhausted, slowly",
            options: ["walked slowly and heavily", "ran quickly", "skipped happily", "crawled carefully", "danced excitedly"],
            correctIndex: 0,
            whyCorrect: "After a long hike, being exhausted and going slowly all point to trudged meaning walked heavily and with effort",
            whyWrong: "'Ran quickly' is the opposite — exhausted children wouldn't run",
            // Interact-specific (different example)
            iSentence: "The bewildered tourist stared at the map, turning it upside down and scratching his head.",
            iTargetWord: "bewildered",
            iCorrectMeaning: "completely confused",
            iOptions: ["completely confused", "very excited", "extremely tired", "slightly annoyed", "rather impatient"],
            iCorrectIndex: 0,
            iWhyCorrect: "The clues 'stared at the map', 'turning it upside down' and 'scratching his head' all show someone who is totally lost, so bewildered means completely confused"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What does "${v.targetWord}" mean?`,
            body: (v) => `${v.name} ${v.scenario}:\n\n**"${v.sentence}"**\n\nDid you know? Even if you've never seen the word **"${v.targetWord}"** before, you can still work it out! The other words in the sentence are like a trail of **clues** leading you straight to the answer.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.targetWord, color: "#6C5CE7" }],
                label: `Target word: "${v.targetWord}"`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Hunt for clue words!",
            body: (v) => `What does **"${v.targetWord}"** mean in ${v.name}'s sentence? Here's the cool part: the words around an unfamiliar word are called **context clues** (the other words nearby that give you hints). They help you work out the meaning without a dictionary — like being a detective who solves the case from the evidence!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Read: "${v.sentence}"`, why: `Zero in on the unknown word: "${v.targetWord}"` },
                  { text: `Find the clue words: "${v.clueWords}"`, why: "These words paint a picture of what's really going on" },
                  { text: `Think: what do these clues tell me?`, why: "Put the clues together like a detective gathering evidence" },
                  { text: `"${v.targetWord}" must mean "${v.correctMeaning}" ✓`, why: "Case solved — the clue words prove it!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Read the whole sentence and find the unknown word`,
                `Look for clue words nearby that hint at the meaning`,
                `Use the clues to guess what the unknown word means`,
                `Try swapping your guess into the sentence — does it still make sense?`
              ],
              feedback: {
                correct: (v) => `Perfect! Read, find clues, guess the meaning, then check by swapping it in. You've got the detective method down! ✓`,
                incorrect: (v) => `Nearly there — start by reading the sentence, then hunt for clue words nearby to help you guess the meaning. You'll crack it!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn, detective!",
            body: (v) => `Time to put your detective skills to work! What does **"${v.iTargetWord}"** most likely mean?\n\n**"${v.iSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.iSentence,
                highlightWords: [{ word: v.iTargetWord, color: "#6C5CE7" }],
                label: `Find the answer for "${v.iTargetWord}":`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What does "${v.iTargetWord}" most likely mean?`,
              getOptions: (v) => v.iOptions,
              correctAnswer: (v) => v.iCorrectMeaning,
              feedback: {
                correct: (v) => `Brilliant detective work! ${v.iWhyCorrect}. ✓`,
                incorrect: (v) => `Not quite — but keep hunting for those clues! ${v.iWhyCorrect}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Context Clues — your detective toolkit!",
            body: () => `Fantastic work! Here's how to crack any unfamiliar word you meet — in the exam or anywhere else:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Don't panic — read the whole sentence", why: "The answer is hiding right there in the words around it" },
                  { text: "Step 2: Find the clue words nearby", why: "Look for describing words, actions, or results — they're your evidence" },
                  { text: "Step 3: Put the clues together", why: "What picture do they paint? Build it up piece by piece" },
                  { text: "Step 4: Try your meaning in the sentence", why: "Does it make sense? Then you've cracked the case! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Curiosity-Hook — Unfamiliar Words in Rich Context ----
      {
        id: "context-clues-discovery",
        templateType: "curiosity-hook",
        learningGoal: [
          "You'll see how to crack even the trickiest, most unusual words using the clues hidden in the sentence",
          "You'll become a proper word detective — this skill is a superpower for the exam!"
        ],
        variableSets: [
          {
            name: "Priya",
            scenario: "finds a really unusual word in a story",
            sentence: "The loquacious parrot never stopped talking, chattering away from morning until night.",
            targetWord: "loquacious",
            correctMeaning: "very talkative",
            clueWords: "never stopped talking, chattering away, from morning until night",
            options: ["very talkative", "extremely colourful", "badly behaved", "incredibly clever", "unusually large"],
            correctIndex: 0,
            whyCorrect: "Three different clues all point to talking: 'never stopped talking', 'chattering away', and 'morning until night' — so loquacious must mean very talkative",
            detectiveSteps: ["'never stopped talking' = lots of talking", "'chattering away' = more talking", "'morning until night' = all day long", "Loquacious = very talkative!"]
          },
          {
            name: "Finn",
            scenario: "discovers an impressive word in his reading test",
            sentence: "The parsimonious old woman counted every penny and refused to spend money on anything she didn't absolutely need.",
            targetWord: "parsimonious",
            correctMeaning: "extremely careful with money",
            clueWords: "counted every penny, refused to spend, didn't absolutely need",
            options: ["extremely careful with money", "very elderly", "always unhappy", "terribly lonely", "quite forgetful"],
            correctIndex: 0,
            whyCorrect: "Counting every penny and refusing to spend unless absolutely necessary both point to someone extremely careful with money — that's what parsimonious means",
            detectiveSteps: ["'counted every penny' = watches money carefully", "'refused to spend' = doesn't like spending", "'didn't absolutely need' = only essentials", "Parsimonious = extremely careful with money!"]
          },
          {
            name: "Grace",
            scenario: "encounters a word she's never heard of",
            sentence: "The cacophony of car horns, barking dogs and construction drills gave everyone a headache.",
            targetWord: "cacophony",
            correctMeaning: "a horrible mixture of loud sounds",
            clueWords: "car horns, barking dogs, construction drills, gave everyone a headache",
            options: ["a horrible mixture of loud sounds", "a large crowd of people", "a busy city street", "a feeling of confusion", "a type of musical performance"],
            correctIndex: 0,
            whyCorrect: "Car horns, barking dogs and drills are all unpleasant noises, and they gave everyone a headache — so cacophony means a horrible mixture of loud sounds",
            detectiveSteps: ["'car horns' = loud noise", "'barking dogs' = more noise", "'construction drills' = even more noise", "'gave everyone a headache' = unpleasant!", "Cacophony = horrible loud sounds!"]
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you crack this word?`,
            body: (v) => `${v.name} ${v.scenario}:\n\n**"${v.sentence}"**\n\nDid you know? Even adults struggle with words like **"${v.targetWord}"** — but you can work it out! Every clue you need is hiding right there in the sentence. Let's find them!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.targetWord, color: "#6C5CE7" }],
                label: `Target word: "${v.targetWord}"`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Be a word detective!",
            body: (v) => `**The word detective method:**\n1. Don't panic — even adults don't know every word, and that's completely fine!\n2. Hunt for EVERY clue in the sentence\n3. Put all the clues together — they usually point the same way\n4. Choose the meaning that matches ALL the clues\n\nLet's collect all the clues, one by one. The more you find, the more certain you can be. It's like piecing together a jigsaw!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.detectiveSteps.map((step, i) => ({
                  text: i < v.detectiveSteps.length - 1 ? `Clue ${i + 1}: ${step}` : step,
                  why: i < v.detectiveSteps.length - 1 ? "Another piece of the puzzle" : "All the clues point the same way ✓"
                })),
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn, detective!",
            body: (v) => `Time to crack the case! What does **"${v.targetWord}"** most likely mean? Hunt for those clue words!\n\n**"${v.sentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.targetWord, color: "#6C5CE7" }],
                label: `Find the answer for "${v.targetWord}":`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What does "${v.targetWord}" most likely mean?`,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctMeaning,
              feedback: {
                correct: (v) => `Case closed, detective! ${v.whyCorrect}. Top-notch sleuthing! ✓`,
                incorrect: (v) => `Not quite — but don't worry, even tricky words like this become easier with practice! ${v.whyCorrect}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The word detective method!",
            body: () => `You've proved it — even the trickiest words can be cracked with context clues. Take this method into the exam and you'll be unstoppable:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Don't panic — unknown words are completely normal!", why: "Stay cool and look around the word for help" },
                  { text: "Step 2: Hunt for clues in the sentence", why: "Other words nearby are practically waving at you with hints!" },
                  { text: "Step 3: Put the clues together", why: "Build up a picture — like assembling a jigsaw" },
                  { text: "Step 4: Choose the meaning that fits all the clues", why: "The right answer clicks with everything around it — case solved! ✓" }
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
  // SUB-CONCEPT 4: prefixes
  // Prefixes That Change Meaning
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: key-fact
  // ==========================================
  {
    id: "prefixes",
    name: "Prefixes That Change Meaning",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step-by-Step Prefix Identification ----
      {
        id: "prefixes-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll learn how to spot a prefix (a letter group like un- or re-) hiding at the start of a word",
          "You'll see how prefixes change the meaning of the root word (the base word before anything is added) — it's like a magic switch!"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "is working out what the word 'unhappy' really means",
            word: "unhappy",
            prefix: "un-",
            rootWord: "happy",
            prefixMeaning: "not",
            fullMeaning: "not happy",
            sentence: "The unhappy child sat alone in the playground.",
            options: ["not happy", "very happy", "quite happy", "always happy", "once happy"],
            correctIndex: 0,
            otherExamples: "unkind, unfair, untidy"
          },
          {
            name: "Marcus",
            scenario: "is figuring out what the word 'disappear' means",
            word: "disappear",
            prefix: "dis-",
            rootWord: "appear",
            prefixMeaning: "opposite of",
            fullMeaning: "the opposite of appearing — to vanish",
            sentence: "The rabbit seemed to disappear inside the magician's hat.",
            options: ["to vanish or stop being seen", "to appear again", "to appear slowly", "to appear suddenly", "to appear somewhere new"],
            correctIndex: 0,
            otherExamples: "disagree, dishonest, dislike"
          },
          {
            name: "Charlie",
            scenario: "is breaking down the word 'misunderstand'",
            word: "misunderstand",
            prefix: "mis-",
            rootWord: "understand",
            prefixMeaning: "wrongly",
            fullMeaning: "to understand wrongly or incorrectly",
            sentence: "It's easy to misunderstand the instructions if you don't read carefully.",
            options: ["to understand wrongly", "to understand fully", "to understand quickly", "to not understand at all", "to understand later"],
            correctIndex: 0,
            otherExamples: "misbehave, misspell, mislead"
          },
          {
            name: "Aisha",
            scenario: "is learning about the prefix in the word 'replay'",
            word: "replay",
            prefix: "re-",
            rootWord: "play",
            prefixMeaning: "again",
            fullMeaning: "to play again",
            sentence: "The referee decided to replay the footage to check the goal.",
            options: ["to play again", "to stop playing", "to play badly", "to play quickly", "to play first"],
            correctIndex: 0,
            otherExamples: "rewrite, rebuild, redo"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's hiding at the start of "${v.word}"?`,
            body: (v) => `${v.name} ${v.scenario}.\n\nDid you know? A **prefix** is a group of letters added to the **start** of a word that completely changes its meaning — like flicking a switch! Can you spot the prefix hiding in **"${v.word}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.word, color: "#6C5CE7" }],
                label: `Focus on: "${v.word}"`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Split the word apart!",
            body: (v) => `The word **"${v.word}"** has a prefix (letters added to the start): **"${v.prefix}"**. Here's the trick: every word with a prefix has two parts — the prefix and the **root word** (the main word before any letters are added). Once you learn to split them, you can decode loads of words!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Start with: "${v.word}"`, why: "Let's split this word into its parts" },
                  { text: `Prefix: "${v.prefix}" means "${v.prefixMeaning}"`, why: `This is the part added to the front` },
                  { text: `Root word: "${v.rootWord}"`, why: "This is the original word" },
                  { text: `${v.prefix} + ${v.rootWord} = ${v.fullMeaning} ✓`, why: `Other "${v.prefix}" words: ${v.otherExamples}` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "un-", right: "not" },
                { left: "dis-", right: "opposite of" },
                { left: "mis-", right: "wrongly" },
                { left: "re-", right: "again" },
                { left: "pre-", right: "before" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Now you try! Split the word apart and work out what **"${v.word}"** means.\n\n**"${v.sentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.word, color: "#6C5CE7" }],
                label: `Find the answer for "${v.word}":`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What does "${v.word}" mean?`,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.options[v.correctIndex],
              feedback: {
                correct: (v) => `Brilliant! The prefix "${v.prefix}" means "${v.prefixMeaning}", so "${v.word}" means "${v.fullMeaning}". You split it like a pro! ✓`,
                incorrect: (v) => `Nearly! The prefix "${v.prefix}" means "${v.prefixMeaning}". So "${v.prefix}" + "${v.rootWord}" = ${v.fullMeaning}. You'll get the hang of this!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Prefix power — your secret weapon!",
            body: () => `You've got prefix power now! Here's the recipe to crack any word with a prefix:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Spot the prefix at the START of the word", why: "Common prefixes: un-, dis-, mis-, re-, pre-, anti- — learn these six and you're golden!" },
                  { text: "Step 2: Work out the root word", why: "Cover the prefix with your thumb — what word is left underneath?" },
                  { text: "Step 3: Combine the prefix meaning with the root word", why: "un- (not) + kind = not kind, re- (again) + build = build again — easy!" },
                  { text: "Step 4: Check it makes sense in the sentence", why: "If it fits, you've cracked it — well done! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Key-Fact — Prefix Families ----
      {
        id: "prefixes-families",
        templateType: "key-fact",
        learningGoal: [
          "You'll meet the six most common prefix (word beginning) families and learn what they mean — this is proper exam gold!",
          "You'll discover how knowing just one prefix can unlock the meaning of loads of different words"
        ],
        variableSets: [
          {
            name: "Oliver",
            scenario: "learns that the prefix 'pre-' means 'before'",
            focusPrefix: "pre-",
            focusMeaning: "before",
            exampleWord: "preview",
            exampleRoot: "view",
            exampleMeaning: "to see something before others do",
            sentence: "We watched a preview of the new film before it was released.",
            familyWords: "predict (say before), prehistoric (before history), prepay (pay before)",
            options: ["to see before it's released", "to watch carefully", "to see again", "to watch together", "to stop watching"],
            correctIndex: 0,
            whyCorrect: "'Pre-' means before, and 'view' means to see — so preview means to see something before it's officially out"
          },
          {
            name: "Daisy",
            scenario: "discovers that the prefix 'anti-' means 'against'",
            focusPrefix: "anti-",
            focusMeaning: "against",
            exampleWord: "antibacterial",
            exampleRoot: "bacterial",
            exampleMeaning: "working against bacteria",
            sentence: "Mum used antibacterial soap to kill the germs.",
            familyWords: "anticlockwise (against clockwise), antisocial (against social), antidote (against poison)",
            options: ["working against bacteria", "full of bacteria", "made of bacteria", "attracting bacteria", "without any bacteria"],
            correctIndex: 0,
            whyCorrect: "'Anti-' means against, so antibacterial means something that works against (fights) bacteria"
          },
          {
            name: "Finn",
            scenario: "finds out that the prefix 'im-' means 'not'",
            focusPrefix: "im-",
            focusMeaning: "not",
            exampleWord: "impossible",
            exampleRoot: "possible",
            exampleMeaning: "not possible — it cannot be done",
            sentence: "It was impossible to finish the jigsaw because three pieces were missing.",
            familyWords: "impatient (not patient), immature (not mature), imperfect (not perfect)",
            options: ["not possible — cannot be done", "very difficult", "nearly finished", "completely possible", "slightly tricky"],
            correctIndex: 0,
            whyCorrect: "'Im-' means not, and 'possible' means it can be done — so impossible means it cannot be done at all"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `The "${v.focusPrefix}" family!`,
            body: (v) => `${v.name} ${v.scenario}.\n\nDid you know? If you learn what **"${v.focusPrefix}"** means, you can unlock the meaning of LOADS of words! It's like having a **secret code** that works on word after word. Pretty cool, right?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.exampleWord, color: "#6C5CE7" }],
                label: `Prefix: "${v.focusPrefix}-"`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "One prefix, many words!",
            body: (v) => `The prefix **"${v.focusPrefix}"** means **"${v.focusMeaning}"**. Once you know this, you can work out any word that starts with it — how brilliant is that?\n\nThere are **six prefix families** you need to know: **un-** (not), **dis-** (opposite of), **mis-** (wrongly), **re-** (again), **pre-** (before), and **anti-/im-/in-** (not or against). Learn these six and you'll unlock hundreds of words. That's a serious exam superpower!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Prefix: "${v.focusPrefix}" = "${v.focusMeaning}"`, why: "This is the key that unlocks the word" },
                  { text: `Root word: "${v.exampleRoot}"`, why: "This is the word before the prefix was added" },
                  { text: `"${v.focusPrefix}" + "${v.exampleRoot}" = "${v.exampleWord}"`, why: `Meaning: "${v.exampleMeaning}"` },
                  { text: `Other "${v.focusPrefix}" words: ${v.familyWords}`, why: "They all follow the same pattern" },
                  { text: "un- = not  |  dis- = opposite of  |  mis- = wrongly", why: "unhappy, disappear, misspell" },
                  { text: "re- = again  |  pre- = before  |  anti-/im-/in- = not/against", why: "replay, preview, impossible ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `The prefix "un-" means "again"`, answer: false, explanation: `No! "Un-" means "not" (unhappy = not happy). "Re-" is the prefix that means "again" (replay = play again). ✓` },
                { text: `If you know what a prefix means, you can work out the meaning of any word that starts with it`, answer: true, explanation: `Yes! For example, "mis-" means "wrongly", so "misspell" means to spell wrongly, "misunderstand" means to understand wrongly. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Use your prefix knowledge! What does **"${v.exampleWord}"** mean?\n\n**"${v.sentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [],
                label: `Which word uses the prefix "${v.focusPrefix}-"?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What does "${v.exampleWord}" mean?`,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.options[v.correctIndex],
              feedback: {
                correct: (v) => `Well done! ${v.whyCorrect}. Your prefix knowledge is paying off! ✓`,
                incorrect: (v) => `Nearly! ${v.whyCorrect}. Remember the prefix code and you'll crack it next time!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Prefix families — your secret weapon!",
            body: () => `You're building a proper vocabulary toolkit now! Knowing prefix families unlocks hundreds of words:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Spot the prefix at the start of the word", why: "Look for common beginnings like un-, re-, dis-, mis- — they pop up everywhere!" },
                  { text: "Step 2: Remember which family it belongs to", why: "Each prefix family has a clear meaning — you've already learnt the big six" },
                  { text: "Step 3: Work out the root word underneath", why: "Cover the prefix — the root word is what's left" },
                  { text: "Step 4: Combine prefix meaning + root meaning", why: "Prefix + root = full meaning. You've cracked the code! ✓" }
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
  // SUB-CONCEPT 5: word-families
  // Suffixes That Change Word Class
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: visual-discovery
  // ==========================================
  {
    id: "word-families",
    name: "Suffixes That Change Word Class",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step-by-Step Suffix Transformation ----
      {
        id: "word-families-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll discover how adding a suffix (a word ending like -ness or -tion) can magically change a word's class — turning a describing word into a naming word!",
          "You'll learn how to turn adjectives (describing words) into nouns (naming words) and verbs (doing words) into nouns — a really handy trick"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "is learning how to change the adjective 'happy' into a noun",
            rootWord: "happy",
            rootClass: "adjective (describing word)",
            suffix: "-ness",
            newWord: "happiness",
            newClass: "noun (naming word)",
            suffixRule: "turns an adjective into a noun — it names the feeling or quality",
            sentence: "Her happiness was clear from the huge smile on her face.",
            options: ["happiness", "happily", "happier", "happiest", "unhappy"],
            correctIndex: 0,
            whyCorrect: "Adding '-ness' to 'happy' creates 'happiness' — a noun that names the feeling",
            otherExamples: "sad → sadness, kind → kindness, dark → darkness",
            // Interact-specific (different example)
            iRootWord: "dark",
            iNewWord: "darkness",
            iNewClass: "noun (naming word)",
            iSentence: "The darkness of the cave made it impossible to see.",
            iOptions: ["darkness", "darkly", "darker", "darkest", "darken"],
            iCorrectIndex: 0,
            iWhyCorrect: "Adding '-ness' to 'dark' creates 'darkness' — a noun that names the quality"
          },
          {
            name: "Ben",
            scenario: "needs to change the verb 'enjoy' into a noun",
            rootWord: "enjoy",
            rootClass: "verb (doing word)",
            suffix: "-ment",
            newWord: "enjoyment",
            newClass: "noun (naming word)",
            suffixRule: "turns a verb into a noun — it names the thing or result",
            sentence: "The children's enjoyment of the trip was wonderful to see.",
            options: ["enjoyment", "enjoying", "enjoyed", "enjoyable", "enjoys"],
            correctIndex: 0,
            whyCorrect: "Adding '-ment' to 'enjoy' creates 'enjoyment' — a noun that names the experience",
            otherExamples: "excite → excitement, amaze → amazement, achieve → achievement",
            // Interact-specific (different example)
            iRootWord: "excite",
            iNewWord: "excitement",
            iNewClass: "noun (naming word)",
            iSentence: "The excitement in the classroom was hard to contain on sports day.",
            iOptions: ["excitement", "excitedly", "exciting", "excited", "excites"],
            iCorrectIndex: 0,
            iWhyCorrect: "Adding '-ment' to 'excite' creates 'excitement' — a noun that names the feeling"
          },
          {
            name: "Ella",
            scenario: "wants to change the adjective 'quick' into an adverb",
            rootWord: "quick",
            rootClass: "adjective (describing word)",
            suffix: "-ly",
            newWord: "quickly",
            newClass: "adverb (describes how something is done)",
            suffixRule: "turns an adjective into an adverb — it tells you HOW something is done",
            sentence: "She quickly finished her homework and went outside to play.",
            options: ["quickly", "quickness", "quicker", "quickest", "quicken"],
            correctIndex: 0,
            whyCorrect: "Adding '-ly' to 'quick' creates 'quickly' — an adverb that tells you HOW she finished",
            otherExamples: "slow → slowly, quiet → quietly, careful → carefully",
            // Interact-specific (different example)
            iRootWord: "quiet",
            iNewWord: "quietly",
            iNewClass: "adverb (describes how something is done)",
            iSentence: "The cat crept quietly along the fence so the birds wouldn't fly away.",
            iOptions: ["quietly", "quietness", "quieter", "quietest", "quieten"],
            iCorrectIndex: 0,
            iWhyCorrect: "Adding '-ly' to 'quiet' creates 'quietly' — an adverb that tells you HOW the cat crept"
          },
          {
            name: "Amir",
            scenario: "is changing the noun 'care' into an adjective",
            rootWord: "care",
            rootClass: "noun (naming word)",
            suffix: "-ful",
            newWord: "careful",
            newClass: "adjective (describing word)",
            suffixRule: "turns a noun into an adjective — it means 'full of' that quality",
            sentence: "Be careful when crossing the road.",
            options: ["careful", "careless", "caring", "cared", "carer"],
            correctIndex: 0,
            whyCorrect: "Adding '-ful' to 'care' creates 'careful' — an adjective meaning 'full of care'",
            otherExamples: "hope → hopeful, colour → colourful, wonder → wonderful",
            // Interact-specific (different example)
            iRootWord: "hope",
            iNewWord: "hopeful",
            iNewClass: "adjective (describing word)",
            iSentence: "She felt hopeful that her team would win the school quiz.",
            iOptions: ["hopeful", "hopeless", "hoping", "hoped", "hoper"],
            iCorrectIndex: 0,
            iWhyCorrect: "Adding '-ful' to 'hope' creates 'hopeful' — an adjective meaning 'full of hope'"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `How do you change "${v.rootWord}"?`,
            body: (v) => `${v.name} ${v.scenario}.\n\nDid you know? A **suffix** is a group of letters added to the **end** of a word — and suffixes have a superpower! They can change a word from one **word class** (whether it's a noun, verb, adjective, or adverb) to a completely different one!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.rootWord, color: "#6C5CE7" }],
                label: `Root word: "${v.rootWord}"`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Add a suffix, change the class!",
            body: (v) => `Watch this — it's pretty cool! The suffix **"${v.suffix}"** ${v.suffixRule}. Just a few letters stuck on the end and the whole word transforms!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Start with: "${v.rootWord}" — ${/^[aeiou]/i.test(v.rootClass) ? 'an' : 'a'} ${v.rootClass}`, why: "This is the root word" },
                  { text: `Add the suffix: "${v.suffix}"`, why: `"${v.suffix}" ${v.suffixRule}` },
                  { text: `"${v.rootWord}" + "${v.suffix}" = "${v.newWord}"`, why: `Now it's ${/^[aeiou]/i.test(v.newClass) ? 'an' : 'a'} ${v.newClass}!` },
                  { text: `"${v.sentence}"`, why: `"${v.newWord}" works as ${/^[aeiou]/i.test(v.newClass) ? 'an' : 'a'} ${v.newClass} in this sentence ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `Adding the suffix "${v.suffix}" to "${v.rootWord}" changes it from a ${v.rootClass} to a ____`,
              options: (v) => [v.newClass, v.rootClass, "prefix", "pronoun"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! "${v.rootWord}" + "${v.suffix}" = "${v.newWord}", which is ${/^[aeiou]/i.test(v.newClass) ? 'an' : 'a'} ${v.newClass}. ✓`,
                incorrect: (v) => `Not quite — adding "${v.suffix}" changes "${v.rootWord}" (a ${v.rootClass}) into "${v.newWord}" (${/^[aeiou]/i.test(v.newClass) ? 'an' : 'a'} ${v.newClass}).`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Right, you've got this! Which word is the ${v.iNewClass} form of **"${v.iRootWord}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.iSentence,
                highlightWords: [{ word: v.iRootWord, color: "#6C5CE7" }],
                label: `Which word comes from "${v.iRootWord}"?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is the ${v.iNewClass} form of "${v.iRootWord}"?`,
              getOptions: (v) => v.iOptions,
              correctAnswer: (v) => v.iNewWord,
              feedback: {
                correct: (v) => `Brilliant! ${v.iWhyCorrect}. Other examples: ${v.otherExamples}. You're getting the hang of this! ✓`,
                incorrect: (v) => `Nearly! ${v.iWhyCorrect}. Don't worry — once you spot the suffix pattern, these become much easier!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Suffix transformations — your cheat sheet!",
            body: () => `Nice work! Here's your go-to guide for how suffixes change word classes. Keep this in mind for the exam:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "-ly turns adjectives into adverbs", why: "quick → quickly (tells you HOW)" },
                  { text: "-ness turns adjectives into nouns", why: "happy → happiness (names the feeling)" },
                  { text: "-ment turns verbs into nouns", why: "enjoy → enjoyment (names the experience)" },
                  { text: "-ful turns nouns into adjectives", why: "care → careful (full of care) ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Visual-Discovery — Word Class Changes ----
      {
        id: "word-families-discovery",
        templateType: "visual-discovery",
        learningGoal: [
          "You'll see how one root word (the base word) can grow into a whole family of words — like a tree with branches!",
          "You'll learn to recognise which suffix (word ending) creates which word class, so you can spot the pattern every time"
        ],
        variableSets: [
          {
            name: "Holly",
            scenario: "discovers how many words come from the root word",
            rootWord: "create",
            rootClass: "verb",
            family: [
              { word: "create", class: "verb", suffix: "(root)", meaning: "to make something" },
              { word: "creation", class: "noun", suffix: "-tion", meaning: "the thing that was made" },
              { word: "creative", class: "adjective", suffix: "-ive", meaning: "good at making things" },
              { word: "creatively", class: "adverb", suffix: "-ly", meaning: "in a creative way" }
            ],
            testWord: "creative",
            testClass: "adjective",
            sentence: "Holly is a very creative artist who paints amazing pictures.",
            options: ["adjective", "noun", "verb", "adverb", "pronoun"],
            correctIndex: 0,
            whyCorrect: "'Creative' ends in '-ive' which makes it an adjective — it describes the artist"
          },
          {
            name: "Jake",
            scenario: "explores the word family that grows from",
            rootWord: "act",
            rootClass: "verb",
            family: [
              { word: "act", class: "verb", suffix: "(root)", meaning: "to do something" },
              { word: "action", class: "noun", suffix: "-tion", meaning: "the thing that is done" },
              { word: "active", class: "adjective", suffix: "-ive", meaning: "doing lots of things" },
              { word: "actively", class: "adverb", suffix: "-ly", meaning: "in an active way" }
            ],
            testWord: "action",
            testClass: "noun",
            sentence: "The action film had lots of exciting car chases.",
            options: ["noun", "verb", "adjective", "adverb", "pronoun"],
            correctIndex: 0,
            whyCorrect: "'Action' ends in '-tion' which makes it a noun — it names the type of film"
          },
          {
            name: "Priya",
            scenario: "sees how many words grow from the root",
            rootWord: "beauty",
            rootClass: "noun",
            family: [
              { word: "beauty", class: "noun", suffix: "(root)", meaning: "the quality of being lovely" },
              { word: "beautiful", class: "adjective", suffix: "-ful", meaning: "full of beauty" },
              { word: "beautifully", class: "adverb", suffix: "-ly", meaning: "in a beautiful way" },
              { word: "beautify", class: "verb", suffix: "-fy", meaning: "to make beautiful" }
            ],
            testWord: "beautifully",
            testClass: "adverb",
            sentence: "The choir sang beautifully at the school concert.",
            options: ["adverb", "adjective", "noun", "verb", "pronoun"],
            correctIndex: 0,
            whyCorrect: "'Beautifully' ends in '-ly' which makes it an adverb — it tells you HOW the choir sang"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `The "${v.rootWord}" word family!`,
            body: (v) => `${v.name} ${v.scenario} **"${v.rootWord}"**.\n\nDid you know? From just one little root word, you can grow a whole **word family** by adding different suffixes. Each suffix changes the **word class** — it's like having one seed that grows into completely different plants!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.rootWord, color: "#6C5CE7" }],
                label: `Root word: "${v.rootWord}"`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Suffixes are word-class changers!",
            body: (v) => `Check out the **"${v.rootWord}"** word family — each suffix (letters added to the end) creates a different word class (whether a word is a noun, verb, adjective, or adverb). The brilliant thing is: if you can spot the suffix, you instantly know what class the word belongs to!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Root: "${v.rootWord}" (${v.rootClass})`, why: "This is where the family starts" },
                  ...v.family.filter(f => f.suffix !== "(root)").map(f => ({
                    text: `+ ${f.suffix} → "${f.word}" (${f.class})`,
                    why: f.meaning
                  })),
                  { text: `One root → many word classes! ✓`, why: "The suffix tells you which class" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Now you try! Look at the suffix to work out what word class **"${v.testWord}"** belongs to in this sentence:\n\n**"${v.sentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.testWord, color: "#6C5CE7" }],
                label: `What does "${v.testWord}" mean?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What word class is "${v.testWord}"?`,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.testClass,
              feedback: {
                correct: (v) => `Well done! ${v.whyCorrect}. You spotted the suffix like a pro! ✓`,
                incorrect: (v) => `Nearly! ${v.whyCorrect}. Keep an eye on the ending — it always gives the word class away!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Suffix spotting guide!",
            body: () => `You're building a brilliant toolkit here! Spot the suffix and you'll know the word class straight away:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "-tion, -ment, -ness → NOUN", why: "creation, enjoyment, happiness — they name things" },
                  { text: "-ful, -ive, -ous, -able → ADJECTIVE", why: "beautiful, creative, famous, comfortable — they describe" },
                  { text: "-ly → ADVERB", why: "quickly, beautifully, carefully — they say HOW" },
                  { text: "-fy, -ise, -en → VERB", why: "beautify, organise, strengthen — they show actions ✓" }
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
  // SUB-CONCEPT 6: homonyms
  // Words with Multiple Meanings
  // Category: core
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "homonyms",
    name: "Words with Multiple Meanings",
    category: "core",
    lessons: [
      // ---- Lesson A: Step-by-Step Context-Based Meaning Selection ----
      {
        id: "homonyms-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll learn how to spot when a word is playing tricks — having more than one meaning hiding behind the same spelling!",
          "You'll master using the sentence context to choose the right meaning every time"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "reads this sentence in her comprehension passage",
            sentence: "We sat on the bank of the river and watched the ducks.",
            targetWord: "bank",
            meaningA: "a place where you keep money",
            meaningB: "the side of a river",
            correctMeaning: "the side of a river",
            clueWords: "river, sat on, watched the ducks",
            options: ["the side of a river", "a place to keep money", "a type of seat", "a steep hill", "a row of switches"],
            whyCorrect: "The clues 'river' and 'watched the ducks' tell us this bank is the sloping ground beside water, not a building for money",
            whyWrong: "A money bank is a building — you wouldn't sit on it to watch ducks",
            // Interact-specific (different sentence, same homonym)
            iSentence: "Mum went to the bank to pay in a cheque this morning.",
            iTargetWord: "bank",
            iCorrectMeaning: "a place where you keep money",
            iClueWords: "pay in, cheque, morning",
            iOptions: ["a place where you keep money", "the side of a river", "a type of seat", "a steep hill", "a row of switches"],
            iWhyCorrect: "The clues 'pay in' and 'cheque' tell us this bank is a financial building where you manage money, not the side of a river"
          },
          {
            name: "Finn",
            scenario: "spots a word with two meanings in his test",
            sentence: "The bat flew silently through the dark cave.",
            targetWord: "bat",
            meaningA: "a piece of equipment used in cricket",
            meaningB: "a flying animal that comes out at night",
            correctMeaning: "a flying animal that comes out at night",
            clueWords: "flew, silently, dark cave",
            options: ["a flying animal that comes out at night", "a piece of cricket equipment", "a wooden stick", "a type of bird", "a large insect"],
            whyCorrect: "The clues 'flew', 'silently' and 'dark cave' all point to a bat being a flying creature here, not sports equipment",
            whyWrong: "A cricket bat can't fly — the sentence describes something alive moving through a cave",
            // Interact-specific (different sentence, same homonym)
            iSentence: "Finn picked up the bat and walked to the crease ready to face the bowler.",
            iTargetWord: "bat",
            iCorrectMeaning: "a piece of equipment used in cricket",
            iClueWords: "picked up, crease, bowler",
            iOptions: ["a piece of equipment used in cricket", "a flying animal that comes out at night", "a wooden stick", "a type of bird", "a large insect"],
            iWhyCorrect: "The clues 'crease' and 'bowler' are cricket terms — this bat is a piece of sports equipment, not a flying animal"
          },
          {
            name: "Aisha",
            scenario: "finds a tricky homonym in her reading book",
            sentence: "Please ring the bell when you arrive at the front door.",
            targetWord: "ring",
            meaningA: "a piece of jewellery worn on a finger",
            meaningB: "to make a sound by pressing or striking",
            correctMeaning: "to make a sound by pressing or striking",
            clueWords: "the bell, when you arrive, front door",
            options: ["to make a sound by pressing or striking", "a piece of jewellery", "a circular shape", "to surround something", "a boxing area"],
            whyCorrect: "'Ring the bell' and 'when you arrive' show that ring means to press or strike something to make a sound — it's an action, not an object",
            whyWrong: "A jewellery ring doesn't match — you can't use a ring on your finger to signal that you've arrived",
            // Interact-specific (different sentence, same homonym)
            iSentence: "Grandma showed me the beautiful gold ring she wore on her wedding day.",
            iTargetWord: "ring",
            iCorrectMeaning: "a piece of jewellery worn on a finger",
            iClueWords: "gold, wore, wedding day",
            iOptions: ["a piece of jewellery worn on a finger", "to make a sound by pressing or striking", "a circular shape", "to surround something", "a boxing area"],
            iWhyCorrect: "The clues 'gold', 'wore' and 'wedding day' tell us this ring is a piece of jewellery — it's something you wear, not a sound you make"
          },
          {
            name: "Charlie",
            scenario: "comes across a word used in an unusual way",
            sentence: "This suitcase is really light — I can carry it with one hand.",
            targetWord: "light",
            meaningA: "brightness from the sun or a lamp",
            meaningB: "not heavy",
            correctMeaning: "not heavy",
            clueWords: "suitcase, carry it, one hand",
            options: ["not heavy", "brightness or a glow", "a pale colour", "to set fire to something", "not serious"],
            whyCorrect: "The clues 'suitcase', 'carry' and 'one hand' show light means not heavy here — it's describing the weight of the suitcase",
            whyWrong: "Brightness doesn't make sense when talking about carrying a suitcase",
            // Interact-specific (different sentence, same homonym)
            iSentence: "The morning light streamed through the curtains and woke Charlie up.",
            iTargetWord: "light",
            iCorrectMeaning: "brightness from the sun or a lamp",
            iClueWords: "morning, streamed, curtains",
            iOptions: ["brightness from the sun or a lamp", "not heavy", "a pale colour", "to set fire to something", "not serious"],
            iWhyCorrect: "The clues 'morning', 'streamed' and 'curtains' tell us this light is brightness from the sun — sunshine streaming through a window, not a weight"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Which "${v.targetWord}" is it?`,
            body: (v) => `${v.name} ${v.scenario}:\n\n**"${v.sentence}"**\n\nDid you know? The word **"${v.targetWord}"** has more than one meaning! Words like this are called **homonyms** — same spelling, completely different meanings. English is full of them!\n\n**Meaning 1:** ${v.meaningA}\n**Meaning 2:** ${v.meaningB}\n\nWhich meaning is being used here? The sentence holds the answer!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.targetWord, color: "#6C5CE7" }],
                label: `Target word: "${v.targetWord}"`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The sentence always gives it away!",
            body: (v) => `Is **"${v.targetWord}"** being used to mean "${v.meaningA}" or "${v.meaningB}"? Here's the thing: when a word has multiple meanings, the **context** (the words around it) always tells you which meaning is being used. Look for **clue words** that match one meaning but not the other — they're your best friends here!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Read: "${v.sentence}"`, why: `Focus on the word "${v.targetWord}"` },
                  { text: `Find the clue words: "${v.clueWords}"`, why: "These words narrow it down" },
                  { text: `Do the clues match "${v.meaningA}"?`, why: "Test the first meaning against the clues" },
                  { text: `"${v.targetWord}" here means "${v.correctMeaning}" ✓`, why: `${v.whyCorrect}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `The word "${v.targetWord}" can only ever have one meaning`, answer: false, explanation: `No! "${v.targetWord}" is a homonym — it has multiple meanings. It can mean "${v.meaningA}" or "${v.meaningB}". The context tells you which. ✓` },
                { text: `You use the words around a homonym (the context) to work out which meaning is intended`, answer: true, explanation: `Yes! Context clues — the words nearby — tell you which meaning of "${v.targetWord}" is being used. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Now you try — which meaning of **"${v.iTargetWord}"** is being used here? Hunt for those clue words!\n\n**"${v.iSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.iSentence,
                highlightWords: [{ word: v.iTargetWord, color: "#6C5CE7" }],
                label: `Find the answer for "${v.iTargetWord}":`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which meaning of "${v.iTargetWord}" is used here?`,
              getOptions: (v) => v.iOptions,
              correctAnswer: (v) => v.iCorrectMeaning,
              feedback: {
                correct: (v) => `Brilliant! ${v.iWhyCorrect}. The clue words gave it away! ✓`,
                incorrect: (v) => `Not quite — this one's tricky! ${v.iWhyCorrect}. Look at the words around the homonym next time.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Homonyms — same word, different meaning!",
            body: () => `You've got this! Here's how to crack homonyms every time they pop up in the exam:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Spot that the word has more than one meaning", why: "Common homonyms: bank, bat, light, ring, match, fair — they come up loads!" },
                  { text: "Step 2: Read the whole sentence carefully", why: "The context always gives the game away" },
                  { text: "Step 3: Find clue words that match ONE meaning", why: "River → bank of a river, not a money bank — the clues point the way" },
                  { text: "Step 4: Pick the meaning that fits the clues", why: "If all the clues match, you've cracked it! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Curiosity-Hook — Matching Meanings in Context ----
      {
        id: "homonyms-matching",
        templateType: "curiosity-hook",
        learningGoal: [
          "You'll discover that the same word can actually be used as different word classes (noun, verb, adjective) — words are shapeshifters!",
          "You'll get really good at matching the right definition to the right context"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "discovers that the word",
            targetWord: "match",
            sentenceA: "Evie struck a match to light the birthday candles.",
            meaningA: "a small stick used to start a fire",
            sentenceB: "Does this hat match my scarf?",
            meaningB: "to go well together",
            wrongMeaning: "a sports game",
            options: ["to go well together", "a sports game", "a small fire stick", "to compete against", "to be equal to"],
            whyCorrect: "In this sentence, 'match' means to look good together — does the hat go with the scarf? It's about colours and style, not fire or sport",
            whyWrong: "'A sports game' is another meaning of match, but this sentence is about clothing going together",
            // Interact-specific (different sentence, different meaning)
            iSentenceB: "We watched an exciting match between the two school football teams.",
            iMeaningB: "a sports game",
            iOptions: ["a sports game", "to go well together", "a small fire stick", "to compete against", "to be equal to"],
            iWhyCorrect: "'Watched' and 'between two teams' tell us this match is a sports game — a competitive event, not about colours or fire"
          },
          {
            name: "Ben",
            scenario: "realises that the word",
            targetWord: "point",
            sentenceA: "Be careful — the point of that pencil is very sharp.",
            meaningA: "the sharp tip of something",
            sentenceB: "I didn't understand the point of the story.",
            meaningB: "the main purpose or message",
            wrongMeaning: "a score in a game",
            options: ["the main purpose or message", "a score in a game", "a sharp tip", "a dot on a map", "to aim your finger at something"],
            whyCorrect: "Here 'the point of the story' means its main purpose or message — what was the story trying to tell you?",
            whyWrong: "'A sharp tip' is the physical meaning of point, but here it's about understanding a story's message",
            // Interact-specific (different sentence, different meaning)
            iSentenceB: "Our team scored the winning point in the last minute of the game.",
            iMeaningB: "a score in a game",
            iOptions: ["a score in a game", "the main purpose or message", "a sharp tip", "a dot on a map", "to aim your finger at something"],
            iWhyCorrect: "'Scored' and 'last minute of the game' tell us this point means a unit of score in a competition, not a message or a sharp tip"
          },
          {
            name: "Ella",
            scenario: "notices that the word",
            targetWord: "current",
            sentenceA: "The strong current swept the leaves downstream.",
            meaningA: "the flow of water in a river",
            sentenceB: "What is the current time?",
            meaningB: "happening right now",
            wrongMeaning: "electrical flow",
            options: ["happening right now", "electrical flow", "the flow of water", "a type of dried fruit", "the most popular"],
            whyCorrect: "'The current time' means the time right now, at this moment — it's about the present, not about water or electricity",
            whyWrong: "'The flow of water' is one meaning of current, but asking about time means we want to know what's happening now",
            // Interact-specific (different sentence, different meaning)
            iSentenceB: "The swimmer was carried along by the powerful current in the river.",
            iMeaningB: "the flow of water in a river",
            iOptions: ["the flow of water in a river", "happening right now", "electrical flow", "a type of dried fruit", "the most popular"],
            iWhyCorrect: "'Swimmer', 'carried along' and 'river' tell us this current is the flow of water — the moving water pushed the swimmer, it's not about time"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `"${v.targetWord}" strikes again!`,
            body: (v) => `Here's a fun one! ${v.name} ${v.scenario} **"${v.targetWord}"** has completely different meanings depending on how it's used:\n\n**Sentence 1:** "${v.sentenceA}" — here it means **${v.meaningA}**\n\n**Sentence 2:** "${v.sentenceB}" — here it means something totally different!\n\nHomonyms are words that are **spelled the same** but have **different meanings**. The sentence around the word is always the key to cracking which one it is.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.targetWord, color: "#6C5CE7" }],
                label: `Target word: "${v.targetWord}"`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Same spelling, different meaning!",
            body: (v) => `Remember **"${v.targetWord}"** from the previous screen? It's a homonym (a word spelled the same but with different meanings). Here's the pro tip: **ignore** what you think the word means and focus on what the **sentence** tells you. The words around it always give the answer away — you just have to look!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Read: "${v.sentenceB}"`, why: `What is "${v.targetWord}" doing in this sentence?` },
                  { text: `It can't mean "${v.meaningA}"`, why: "That doesn't fit this sentence at all" },
                  { text: `It can't mean "${v.wrongMeaning}" either`, why: "That's another meaning but still doesn't fit here" },
                  { text: `"${v.targetWord}" here means "${v.meaningB}" ✓`, why: "This is the only meaning that makes the sentence work" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `You've got this! What does **"${v.targetWord}"** mean in this sentence? Look at the context!\n\n**"${v.iSentenceB}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.iSentenceB,
                highlightWords: [{ word: v.targetWord, color: "#6C5CE7" }],
                label: `Find the meaning of "${v.targetWord}":`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What does "${v.targetWord}" mean in this sentence?`,
              getOptions: (v) => v.iOptions,
              correctAnswer: (v) => v.iMeaningB,
              feedback: {
                correct: (v) => `Well done! ${v.iWhyCorrect}. You read the context perfectly! ✓`,
                incorrect: (v) => `Not quite — but homonyms are properly tricky! ${v.iWhyCorrect}. The context clues will get you there next time.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Homonyms — don't be tricked!",
            body: () => `In the exam, homonyms pop up everywhere — but now you know how to handle them like a pro:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Notice that the word has multiple meanings", why: "If you know two meanings, the exam could use either one — stay alert!" },
                  { text: "Step 2: Read the WHOLE sentence, not just the word", why: "The sentence always tells you which meaning is right" },
                  { text: "Step 3: Try each meaning in the sentence", why: "Only one will make sense — the others will sound completely off" },
                  { text: "Step 4: Pick the meaning that fits perfectly", why: "Context is king — and now you rule it! ✓" }
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
  // SUB-CONCEPT 7: word-roots
  // Latin and Greek Word Roots
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "word-roots",
    name: "Latin and Greek Word Roots",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step-by-Step Root Identification ----
      {
        id: "word-roots-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll learn how to spot ancient Latin and Greek roots hiding inside everyday English words — it's like discovering a secret code!",
          "You'll use these roots to work out the meaning of words you've never seen before"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "is trying to work out what 'aquarium' means",
            word: "aquarium",
            root: "aqua",
            rootMeaning: "water",
            rootOrigin: "Latin",
            wordMeaning: "a glass tank for keeping fish and water creatures",
            sentence: "We visited the aquarium and saw sharks swimming overhead.",
            clue: "If 'aqua' means water, what kind of place would an aquarium be?",
            familyWords: "aquatic (living in water), aqualung (breathing underwater)",
            options: ["a glass tank for keeping fish and water creatures", "a large museum", "a type of zoo", "an outdoor swimming pool", "a science laboratory"],
            whyCorrect: "The root 'aqua' means water — so an aquarium is a place designed around water, where fish and sea creatures live",
            whyWrong: "A museum doesn't have to involve water — 'aqua' specifically points to something water-related",
            // Interact-specific (different word, same root)
            iWord: "aquatic",
            iRoot: "aqua",
            iRootMeaning: "water",
            iWordMeaning: "living in or relating to water",
            iSentence: "Dolphins and whales are aquatic mammals that spend their whole lives in the ocean.",
            iOptions: ["living in or relating to water", "very fast", "found underground", "related to air", "extremely large"],
            iWhyCorrect: "The root 'aqua' means water — so 'aquatic' describes things that live in or are connected to water, like dolphins and whales"
          },
          {
            name: "Oliver",
            scenario: "encounters the word 'telephone' and wonders what it means",
            word: "telephone",
            root: "tele",
            rootMeaning: "far away",
            rootOrigin: "Greek",
            wordMeaning: "a device for speaking to someone far away",
            sentence: "Gran uses the telephone to call us every Sunday evening.",
            clue: "If 'tele' means far away and 'phone' means sound, what does telephone mean?",
            familyWords: "television (seeing far away), telescope (looking far away)",
            options: ["a device for speaking to someone far away", "a musical instrument", "a recording machine", "a type of radio", "a messaging app"],
            whyCorrect: "'Tele' means far away and 'phone' means sound or voice — so a telephone sends your voice far away to someone else",
            whyWrong: "A musical instrument makes sounds but doesn't send them far away — 'tele' is the key root here",
            // Interact-specific (different word, same root)
            iWord: "telescope",
            iRoot: "tele",
            iRootMeaning: "far away",
            iWordMeaning: "a device for looking at things far away",
            iSentence: "Oliver used the telescope to see the craters on the moon.",
            iOptions: ["a device for looking at things far away", "a magnifying glass", "a type of camera", "a musical instrument", "a measuring tool"],
            iWhyCorrect: "'Tele' means far away and 'scope' means to look — so a telescope is a device that lets you see distant things like the moon"
          },
          {
            name: "Aisha",
            scenario: "finds the word 'biography' in her reading book",
            word: "biography",
            root: "bio",
            rootMeaning: "life",
            rootOrigin: "Greek",
            wordMeaning: "a book about someone's life written by another person",
            sentence: "Aisha read a biography of Florence Nightingale for her history project.",
            clue: "If 'bio' means life and 'graphy' means writing, what is a biography?",
            familyWords: "biology (study of life), biodegradable (breaks down naturally in nature)",
            options: ["a book about someone's life written by another person", "a history textbook", "a science experiment", "a type of diary", "a made-up story"],
            whyCorrect: "'Bio' means life and 'graphy' means writing — so a biography is the written story of someone's life",
            whyWrong: "A history textbook covers many events — 'bio' specifically points to one person's life",
            // Interact-specific (different word, same root)
            iWord: "biology",
            iRoot: "bio",
            iRootMeaning: "life",
            iWordMeaning: "the study of living things",
            iSentence: "In biology, we learned how plants make their own food using sunlight.",
            iOptions: ["the study of living things", "the study of rocks", "the study of numbers", "the study of space", "the study of weather"],
            iWhyCorrect: "'Bio' means life and 'logy' means study — so biology is the study of living things like plants and animals"
          },
          {
            name: "Marcus",
            scenario: "sees the word 'transport' and wants to break it down",
            word: "transport",
            root: "port",
            rootMeaning: "to carry",
            rootOrigin: "Latin",
            wordMeaning: "to carry people or things from one place to another",
            sentence: "Lorries transport food from farms to supermarkets every day.",
            clue: "If 'port' means carry and 'trans' means across, what does transport mean?",
            familyWords: "portable (can be carried), export (carry out of a country)",
            options: ["to carry people or things from one place to another", "to store goods in a warehouse", "to sell goods in a market", "to build roads and bridges", "to pack things into boxes"],
            whyCorrect: "'Trans' means across and 'port' means carry — so transport means to carry things across from one place to another",
            whyWrong: "Storing goods doesn't involve carrying them anywhere — 'port' means to carry and move",
            // Interact-specific (different word, same root)
            iWord: "portable",
            iRoot: "port",
            iRootMeaning: "to carry",
            iWordMeaning: "small and light enough to be carried easily",
            iSentence: "Marcus brought his portable speaker to the park so they could listen to music.",
            iOptions: ["small and light enough to be carried easily", "very expensive", "powered by batteries", "made of plastic", "waterproof"],
            iWhyCorrect: "'Port' means to carry and '-able' means able to be — so portable means something that can be carried around easily, like a small speaker"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's hiding inside "${v.word}"?`,
            body: (v) => `${v.name} ${v.scenario}.\n\nDid you know? Loads of English words are built from **${v.rootOrigin} roots** — ancient building blocks from thousands of years ago that STILL shape our language today! The root **"${v.root}"** means **"${v.rootMeaning}"**.\n\n${v.clue}`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.word, color: "#6C5CE7" }],
                label: `Focus on: "${v.word}"`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Crack the code with roots!",
            body: (v) => `Here's something amazing: if you know what the root means, you can work out words you've never seen before! Think of roots as **secret codes** that ancient Romans and Greeks left inside our words.\n\n**Key root families to learn:**\n- **aqua** = water (aquarium, aquatic, aqualung)\n- **bio** = life (biology, biography, biodegradable)\n- **tele** = far away (telephone, television, telescope)\n- **port** = carry (transport, portable, export)`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Word: "${v.word}"`, why: "Let's break this word apart" },
                  { text: `Root: "${v.root}" = "${v.rootMeaning}"`, why: `This ${v.rootOrigin} root is the heart of the word` },
                  { text: `${v.clue}`, why: "Use the root meaning to work out the whole word" },
                  { text: `"${v.word}" = ${v.wordMeaning} ✓`, why: `The root "${v.root}" (${v.rootMeaning}) gives it away!` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `The root "${v.root}" means ____, so "${v.word}" is related to ${v.rootMeaning}`,
              options: (v) => [v.rootMeaning, "big", "fast", "old"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! The root "${v.root}" means "${v.rootMeaning}", which helps you decode "${v.word}" and any other word with the same root. ✓`,
                incorrect: (v) => `Not quite — the root "${v.root}" means "${v.rootMeaning}". Knowing this unlocks the meaning of "${v.word}"!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Use your root knowledge to crack this one! What does **"${v.iWord}"** mean?\n\n**"${v.iSentence}"**\n\nRemember: **"${v.iRoot}"** means **"${v.iRootMeaning}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.iSentence,
                highlightWords: [{ word: v.iWord, color: "#6C5CE7" }],
                label: `Find the answer for "${v.iWord}":`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What does "${v.iWord}" mean?`,
              getOptions: (v) => v.iOptions,
              correctAnswer: (v) => v.iWordMeaning,
              feedback: {
                correct: (v) => `Brilliant! ${v.iWhyCorrect}. Your root knowledge is seriously impressive! ✓`,
                incorrect: (v) => `Nearly! ${v.iWhyCorrect}. The more roots you learn, the easier this gets — keep going!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Word roots — your secret weapon!",
            body: () => `You're building a proper code-breaking toolkit! The more root families you learn, the more exam words you can crack:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Look inside the word for a root you recognise", why: "Roots like 'port' (carry) or 'ject' (throw) pop up in loads of words!" },
                  { text: "Step 2: Recall what that root means", why: "Each root has a core meaning that stays the same — learn it once, use it forever" },
                  { text: "Step 3: Work out the whole word from the root", why: "The root gives you the main idea — the other parts add detail" },
                  { text: "Step 4: Check it makes sense in the sentence", why: "If it fits, you've cracked the code — well done! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Curiosity-Hook — Using Roots to Decode Unknown Words ----
      {
        id: "word-roots-decode",
        templateType: "curiosity-hook",
        learningGoal: [
          "You'll use root knowledge to figure out words you've NEVER seen before — even really long, scary-looking ones!",
          "You'll learn how to combine two or three roots together to unlock the full meaning"
        ],
        variableSets: [
          {
            name: "Finn",
            scenario: "has never seen the word 'microscope' before, but he knows a trick",
            unknownWord: "microscope",
            rootA: "micro",
            rootAMeaning: "small",
            rootB: "scope",
            rootBMeaning: "to look at",
            combinedMeaning: "a device for looking at very small things",
            sentence: "The scientist used a microscope to study the tiny cells.",
            clueFromSentence: "study the tiny cells",
            options: ["a device for looking at very small things", "a very small camera", "a type of magnifying glass", "a computer screen", "a pair of special glasses"],
            whyCorrect: "'Micro' means small and 'scope' means to look at — so a microscope is a device that lets you look at very small things you can't see with your eyes alone",
            decodingSteps: ["Root 1: 'micro' = small", "Root 2: 'scope' = to look at", "micro + scope = looking at small things", "A microscope is a device for seeing tiny things!"]
          },
          {
            name: "Priya",
            scenario: "encounters 'geography' in her exam and uses roots to crack it",
            unknownWord: "geography",
            rootA: "geo",
            rootAMeaning: "earth",
            rootB: "graphy",
            rootBMeaning: "writing or study",
            combinedMeaning: "the study of the earth, its lands and features",
            sentence: "In geography, we learnt about volcanoes, rivers and mountain ranges.",
            clueFromSentence: "volcanoes, rivers and mountain ranges",
            options: ["the study of the earth, its lands and features", "the study of ancient history", "the study of rocks and minerals", "the study of maps and drawings", "the study of weather patterns"],
            whyCorrect: "'Geo' means earth and 'graphy' means writing or study — geography is the study of the earth's features like mountains, rivers and volcanoes",
            decodingSteps: ["Root 1: 'geo' = earth", "Root 2: 'graphy' = writing or study", "geo + graphy = writing about/studying the earth", "Geography = studying the earth's features!"]
          },
          {
            name: "Charlie",
            scenario: "uses his root knowledge to decode 'autobiography'",
            unknownWord: "autobiography",
            rootA: "auto",
            rootAMeaning: "self",
            rootB: "bio + graphy",
            rootBMeaning: "life + writing",
            combinedMeaning: "a book about your own life, written by yourself",
            sentence: "The famous footballer wrote an autobiography about growing up in London.",
            clueFromSentence: "wrote, about growing up, famous footballer",
            options: ["a book about your own life, written by yourself", "a book about someone else's life", "a history of a football club", "a collection of photographs", "a book of interviews"],
            whyCorrect: "'Auto' means self, 'bio' means life, and 'graphy' means writing — so an autobiography is a book about your own life that you wrote yourself",
            decodingSteps: ["Root 1: 'auto' = self", "Root 2: 'bio' = life", "Root 3: 'graphy' = writing", "auto + bio + graphy = writing about your own life!"]
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you decode "${v.unknownWord}"?`,
            body: (v) => `${v.name} ${v.scenario}.\n\n**"${v.sentence}"**\n\nThe word **"${v.unknownWord}"** looks long and scary — but here's a secret: it's built from roots you can learn! Let's break it apart like cracking a code. You'll be surprised how simple it is underneath!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.unknownWord, color: "#6C5CE7" }],
                label: `What does "${v.unknownWord}" mean?`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Break it into roots!",
            body: (v) => `Let's crack **"${v.unknownWord}"** from the previous screen. Here's the brilliant thing about long words: they're often just **two or three roots** (the base parts that carry meaning) **stuck together**. **"${v.rootA}"** means "${v.rootAMeaning}" and **"${v.rootB}"** means "${v.rootBMeaning}" — put them together and the meaning falls right out!\n\n**The 4-step root-cracking method:**\n1. Look for roots you recognise inside the word (micro, tele, bio, geo, auto, port, rupt, aqua...)\n2. Work out what each root means — even ONE root gives you a massive clue\n3. Combine the root meanings together\n4. Check it fits the sentence — if it makes sense, you've cracked it!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.decodingSteps.map((step, i) => ({
                  text: i < v.decodingSteps.length - 1 ? step : step,
                  why: i < v.decodingSteps.length - 1 ? "Another piece of the puzzle" : "All the roots combine to give the full meaning ✓"
                })),
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn, code-breaker!",
            body: (v) => `Right, time to crack the code yourself! What does **"${v.unknownWord}"** mean?\n\n**"${v.sentence}"**\n\nHint: **"${v.rootA}"** = ${v.rootAMeaning}, **"${v.rootB}"** = ${v.rootBMeaning}`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.unknownWord, color: "#6C5CE7" }],
                label: `Decode "${v.unknownWord}":`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What does "${v.unknownWord}" mean?`,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.combinedMeaning,
              feedback: {
                correct: (v) => `Brilliant code-breaking! ${v.whyCorrect}. You smashed it! ✓`,
                incorrect: (v) => `Nearly! ${v.whyCorrect}. Keep practising with roots — they get easier and easier to spot!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Root-cracking — the method!",
            body: () => `Master this and you can decode any long word in the exam — even ones that look impossible at first glance:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Find the roots inside the word", why: "Long words often have two or three roots stuck together — pull them apart!" },
                  { text: "Step 2: Work out what each root means", why: "e.g. 'micro' = small, 'scope' = to look at — you're already learning these" },
                  { text: "Step 3: Combine the root meanings", why: "micro + scope = looking at small things — it just clicks!" },
                  { text: "Step 4: Check it fits the sentence", why: "Does your meaning make sense in context? Then you've cracked it! ✓" }
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
  // SUB-CONCEPT 8: shades-of-meaning
  // Shades of Meaning — Choosing the Strongest Word
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "shades-of-meaning",
    name: "Shades of Meaning — Choosing the Strongest Word",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step-by-Step Intensity Scales ----
      {
        id: "shades-of-meaning-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll discover that words come in different strengths — like a volume dial going from quiet to LOUD!",
          "You'll learn how to order words from weakest to strongest, which is a favourite exam trick"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "is learning that 'happy' words come in different strengths",
            category: "happiness",
            weakWord: "pleased",
            mediumWord: "happy",
            strongWord: "delighted",
            strongestWord: "ecstatic",
            scale: "pleased → happy → delighted → ecstatic",
            sentence: "When Daisy found out she'd won first prize, she was absolutely ______.",
            correctWord: "ecstatic",
            contextClue: "won first prize, absolutely",
            options: ["ecstatic", "pleased", "happy", "content", "cheerful"],
            whyCorrect: "Winning first prize is a huge achievement — 'absolutely' tells you it's an extreme feeling, so 'ecstatic' (the strongest happiness word) fits perfectly",
            whyWrong: "'Pleased' is too weak — you'd be pleased about finding 50p, not winning first prize!",
            // Interact-specific (different sentence, different strength word)
            iSentence: "Daisy was ______ when her friend remembered her birthday.",
            iCorrectWord: "pleased",
            iContextClue: "remembered her birthday",
            iOptions: ["pleased", "ecstatic", "furious", "terrified", "exhausted"],
            iWhyCorrect: "Remembering a birthday is a nice thing but not life-changing — 'pleased' is the mild happiness word that fits this gentle, warm feeling"
          },
          {
            name: "Oliver",
            scenario: "discovers that 'angry' words have different levels of intensity",
            category: "anger",
            weakWord: "annoyed",
            mediumWord: "angry",
            strongWord: "furious",
            strongestWord: "livid",
            scale: "annoyed → angry → furious → livid",
            sentence: "When Oliver's little sister broke his model aeroplane, he was completely ______.",
            correctWord: "furious",
            contextClue: "broke his model aeroplane, completely",
            options: ["furious", "annoyed", "upset", "irritated", "disappointed"],
            whyCorrect: "Breaking something precious that took ages to build would make someone very angry — 'furious' matches the intensity of the situation",
            whyWrong: "'Annoyed' is too mild — you'd be annoyed if someone borrowed your pencil, not if they broke your model",
            // Interact-specific (different sentence, different strength word)
            iSentence: "Oliver was a bit ______ when someone took his favourite seat at lunch.",
            iCorrectWord: "annoyed",
            iContextClue: "a bit, favourite seat",
            iOptions: ["annoyed", "livid", "furious", "delighted", "terrified"],
            iWhyCorrect: "Losing your favourite seat is mildly frustrating — 'a bit' tells you it's a small feeling, so 'annoyed' (the weakest anger word) fits perfectly"
          },
          {
            name: "Ella",
            scenario: "realises that 'cold' words range from mild to extreme",
            category: "cold temperature",
            weakWord: "cool",
            mediumWord: "chilly",
            strongWord: "freezing",
            strongestWord: "arctic",
            scale: "cool → chilly → freezing → arctic",
            sentence: "The children shivered as they waited in the ______ wind outside the school.",
            correctWord: "freezing",
            contextClue: "shivered, waited outside",
            options: ["freezing", "cool", "chilly", "warm", "mild"],
            whyCorrect: "The children were shivering, which means they were very cold — 'freezing' is strong enough to make you shiver, while 'cool' and 'chilly' are too mild",
            whyWrong: "'Cool' is barely cold at all — you wouldn't shiver in a cool breeze",
            // Interact-specific (different sentence, different strength word)
            iSentence: "The autumn evening felt slightly ______ so Ella grabbed a light jacket.",
            iCorrectWord: "chilly",
            iContextClue: "slightly, light jacket",
            iOptions: ["chilly", "arctic", "freezing", "boiling", "scorching"],
            iWhyCorrect: "'Slightly' and 'light jacket' show it's only a bit cold — 'chilly' is the medium-strength cold word, not extreme enough for a heavy coat"
          },
          {
            name: "Amir",
            scenario: "learns that 'big' words come in different sizes",
            category: "size",
            weakWord: "large",
            mediumWord: "huge",
            strongWord: "enormous",
            strongestWord: "colossal",
            scale: "large → huge → enormous → colossal",
            sentence: "The ______ whale surfaced next to the tiny fishing boat, making it look like a toy.",
            correctWord: "enormous",
            contextClue: "made the boat look like a toy",
            options: ["enormous", "big", "large", "medium-sized", "noticeable"],
            whyCorrect: "If the whale made a boat look like a toy, it must be incredibly big — 'enormous' captures that extreme size difference",
            whyWrong: "'Big' is too ordinary — lots of things are big, but only something enormous makes a boat look like a toy",
            // Interact-specific (different sentence, different strength word)
            iSentence: "Amir ordered a ______ pizza that was just right for the two of them to share.",
            iCorrectWord: "large",
            iContextClue: "just right, two of them",
            iOptions: ["large", "colossal", "enormous", "tiny", "microscopic"],
            iWhyCorrect: "A pizza for two people is bigger than normal but not extreme — 'large' is the mild size word, fitting for an ordinary sharing portion"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `How "${v.category}" are we talking?`,
            body: (v) => `${v.name} ${v.scenario}.\n\nDid you know? Words can mean similar things but with **totally different strengths**. Think of it like a volume dial — you can turn it up from mild to EXTREME!\n\n**${v.scale}**\n\nFrom gentle to powerful — each word is a step up. Getting the right strength matters in the exam!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.correctWord, color: "#6C5CE7" }],
                label: `${v.category}: which word fits best?`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Match the strength to the situation!",
            body: (v) => `We saw the ${v.category} scale: **${v.scale}**. In the exam, you need to choose the word with the **right intensity** — and this is where lots of people slip up! A small event needs a mild word. A dramatic event needs a powerful word. The **context** always tells you how strong the word should be.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Read: "${v.sentence.replace('______', '______')}"`, why: "Which word fills the gap?" },
                  { text: `Context clue: "${v.contextClue}"`, why: "How extreme is the situation?" },
                  { text: `Is it mild, medium, strong, or extreme?`, why: "Match the word strength to the situation" },
                  { text: `The best word is "${v.correctWord}" ✓`, why: `${v.whyCorrect}` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "annoyed", right: "mild anger" },
                { left: "furious", right: "extreme anger" },
                { left: "warm", right: "mild heat" },
                { left: "boiling", right: "extreme heat" },
                { left: "pleased", right: "mild happiness" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Now you try! Read the sentence carefully and think about how strong the feeling or situation is. Which word fits best?\n\n**"${v.iSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.iSentence,
                highlightWords: [],
                label: `Which word fits best?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word best fits the sentence?`,
              getOptions: (v) => v.iOptions,
              correctAnswer: (v) => v.iCorrectWord,
              feedback: {
                correct: (v) => `Well done! ${v.iWhyCorrect}. You matched the shade perfectly! ✓`,
                incorrect: (v) => `Close! ${v.iWhyCorrect}. Think about how intense the situation is — that tells you which word to pick.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Shades of meaning — your recipe for success!",
            body: () => `Brilliant work! Here's how to pick the right-strength word every time in the exam:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Read the sentence — how intense is the situation?", why: "A small upset or a huge disaster? This sets the level" },
                  { text: "Step 2: Look for intensity clues (absolutely, completely, a bit)", why: "These little signal words tell you exactly how strong the word needs to be" },
                  { text: "Step 3: Rank the options from weakest to strongest", why: "Line them up like a volume dial in your head" },
                  { text: "Step 4: Choose the word that matches the situation's intensity", why: "The right shade of meaning makes the sentence sing! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Curiosity-Hook — Choosing the Right Intensity for Context ----
      {
        id: "shades-of-meaning-context",
        templateType: "curiosity-hook",
        learningGoal: [
          "You'll find out why the exam loves testing whether you can pick the CLOSEST word in meaning — and how to nail it!",
          "You'll learn how to compare two similar words and confidently decide which one fits better"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "is choosing between two similar words in a exam question",
            sentence: "The exhausted runner collapsed at the finish line after the marathon.",
            targetWord: "exhausted",
            closeWord: "tired",
            correctMatch: "utterly drained of energy",
            wrongMatch: "a bit sleepy",
            options: ["utterly drained of energy", "a bit sleepy", "quite weary", "slightly fatigued", "ready for a rest"],
            whyCorrect: "The runner collapsed after a marathon — that's not just tired, it's completely drained. 'Utterly drained of energy' matches the extreme intensity of 'exhausted'",
            whyWrong: "'A bit sleepy' is far too mild — you don't collapse from being a bit sleepy!",
            comparison: "'Tired' is mild — you feel tired after homework. 'Exhausted' is extreme — you feel exhausted after running a marathon!",
            // Interact-specific (different word, different intensity)
            iSentence: "Grace felt a little weary after a long day at school.",
            iTargetWord: "weary",
            iCorrectMatch: "slightly tired and ready to rest",
            iOptions: ["slightly tired and ready to rest", "utterly drained of energy", "wide awake and energetic", "extremely ill", "deeply upset"],
            iWhyCorrect: "'A little weary' and 'long day at school' show a mild tiredness — 'slightly tired and ready to rest' matches the gentle, everyday feeling of being weary"
          },
          {
            name: "Ben",
            scenario: "must pick the CLOSEST meaning in his vocabulary test",
            sentence: "The terrified child screamed when the thunder shook the house.",
            targetWord: "terrified",
            closeWord: "scared",
            correctMatch: "extremely frightened",
            wrongMatch: "slightly nervous",
            options: ["extremely frightened", "slightly nervous", "a bit worried", "quite surprised", "rather startled"],
            whyCorrect: "The child screamed and the thunder shook the house — that's an extreme reaction, so 'extremely frightened' matches 'terrified' perfectly",
            whyWrong: "'Slightly nervous' is far too weak — you don't scream when you're slightly nervous!",
            comparison: "'Scared' is medium strength — you're scared of spiders. 'Terrified' is extreme — you're terrified when something truly frightening happens!",
            // Interact-specific (different word, different intensity)
            iSentence: "Ben felt slightly anxious before his spelling test, but he knew he had revised well.",
            iTargetWord: "anxious",
            iCorrectMatch: "a bit nervous or worried",
            iOptions: ["a bit nervous or worried", "extremely frightened", "completely relaxed", "absolutely furious", "deeply sad"],
            iWhyCorrect: "'Slightly anxious' and 'knew he had revised' show a mild, manageable worry — 'a bit nervous or worried' matches this low-level feeling perfectly"
          },
          {
            name: "Priya",
            scenario: "needs to find the word closest in meaning for her exam",
            sentence: "The magnificent palace had golden domes, marble floors and a hundred sparkling chandeliers.",
            targetWord: "magnificent",
            closeWord: "nice",
            correctMatch: "extremely grand and impressive",
            wrongMatch: "quite attractive",
            options: ["extremely grand and impressive", "quite attractive", "fairly large", "rather old", "somewhat unusual"],
            whyCorrect: "Golden domes, marble floors and a hundred chandeliers describe something breathtakingly grand — 'extremely grand and impressive' captures the full strength of 'magnificent'",
            whyWrong: "'Quite attractive' is far too weak — a cupcake can be attractive, but this palace is spectacular!",
            comparison: "'Nice' could describe a sandwich. 'Magnificent' describes something that takes your breath away — they're on completely different levels!",
            // Interact-specific (different word, different intensity)
            iSentence: "The garden looked quite pleasant with a few colourful flowers along the path.",
            iTargetWord: "pleasant",
            iCorrectMatch: "nice and enjoyable in a gentle way",
            iOptions: ["nice and enjoyable in a gentle way", "extremely grand and impressive", "ugly and disappointing", "dangerously wild", "completely deserted"],
            iWhyCorrect: "'Quite pleasant' and 'a few colourful flowers' describe something mildly nice — 'nice and enjoyable in a gentle way' matches this soft, understated feeling"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `"${v.targetWord}" — how strong is it?`,
            body: (v) => `${v.name} ${v.scenario}:\n\n**"${v.sentence}"**\n\nHere's something that trips up loads of people in the exam: "${v.closeWord}" and "${v.targetWord}" sound similar — but they're NOT the same strength! Spotting the **exact shade** of meaning is the key to getting the mark.\n\n${v.comparison}`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.targetWord, color: "#6C5CE7" }],
                label: `Target word: "${v.targetWord}"`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Match the exact shade!",
            body: (v) => `Think about **"${v.targetWord}"** from the previous screen. "${v.closeWord}" is in the same family — but **"${v.targetWord}"** is much stronger. Here's the thing that catches people out: when the exam asks "which word is CLOSEST in meaning", you need to match the **exact intensity**, not just the general idea. A mild word won't match a strong word — even if they're in the same family!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.targetWord}" is used in: "${v.sentence}"`, why: "Look at the context — how intense is it?" },
                  { text: `"${v.wrongMatch}" — too weak!`, why: `${v.whyWrong}` },
                  { text: `"${v.correctMatch}" — perfect match!`, why: "Same strength as the original word" },
                  { text: `Always match the INTENSITY, not just the topic ✓`, why: `${v.comparison}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Read the sentence and find the word you need to match`,
                `Decide: is the word mild, medium, strong, or extreme?`,
                `Look at the options and rate each one on the same scale`,
                `Pick the option with the same intensity as the original word`
              ],
              feedback: {
                correct: (v) => `Perfect! Find the word, rate its intensity, then match it to an option with the same strength. You nailed the method! ✓`,
                incorrect: (v) => `Nearly — start by reading the sentence, then decide how strong the word is before looking at the options. You're getting there!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `You've got this! Which phrase is **closest in meaning** to **"${v.iTargetWord}"**? Think about the intensity!\n\n**"${v.iSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.iSentence,
                highlightWords: [{ word: v.iTargetWord, color: "#6C5CE7" }],
                label: `Find the answer for "${v.iTargetWord}":`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is closest in meaning to "${v.iTargetWord}"?`,
              getOptions: (v) => v.iOptions,
              correctAnswer: (v) => v.iCorrectMatch,
              feedback: {
                correct: (v) => `Spot on! ${v.iWhyCorrect}. You matched the shade like a pro! ✓`,
                incorrect: (v) => `Close! ${v.iWhyCorrect}. Think about whether the situation is mild or extreme — that's the key to the right shade.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Shades of meaning in the exam!",
            body: () => `You've cracked the shade-matching skill! In the exam, "closest in meaning" means matching the EXACT shade — and now you know how:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Mild words: pleased, annoyed, cool, large", why: "Everyday, gentle versions" },
                  { text: "Medium words: happy, angry, cold, big", why: "The standard versions" },
                  { text: "Strong words: delighted, furious, freezing, enormous", why: "Powerful, intense versions" },
                  { text: "Match the shade — not just the topic!", why: "The right intensity makes all the difference ✓" }
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
  // SUB-CONCEPT 9: formal-informal-vocab
  // Formal vs Informal Vocabulary
  // Category: other
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "formal-informal-vocab",
    name: "Formal vs Informal Vocabulary",
    category: "other",
    lessons: [
      // ---- Lesson A: Step-by-Step Formal/Informal Pairs ----
      {
        id: "formal-informal-steps",
        templateType: "step-by-step",
        learningGoal: [
          "You'll discover that the same idea can be said in a chatty, everyday way or a polished, grown-up way — and the exam tests this!",
          "You'll learn to spot which register (level of formality) a word belongs to, so you can pick the right one every time"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "is learning to spot the difference between chatty and polished language",
            informalWord: "kid",
            formalWord: "child",
            informalSentence: "The kid ran across the playground.",
            formalSentence: "The child crossed the playground in a hurry.",
            contextSentence: "The headteacher wrote a letter to parents about every ______ in Year 5.",
            correctAnswer: "child",
            contextClue: "headteacher, letter to parents",
            options: ["child", "kid", "youngster", "little one", "mate"],
            whyCorrect: "A headteacher writing an official letter would use formal language — 'child' is the formal version of 'kid'",
            whyWrong: "'Kid' is what you'd say to your friends, not what a headteacher would write in an official letter"
          },
          {
            name: "Finn",
            scenario: "realises that 'get' has a more formal twin",
            informalWord: "get",
            formalWord: "obtain",
            informalSentence: "Can I get a new pencil from the cupboard?",
            formalSentence: "Pupils may obtain a replacement pencil from the office.",
            contextSentence: "Visitors must ______ a pass from reception before entering the building.",
            correctAnswer: "obtain",
            contextClue: "visitors, must, reception, entering the building",
            options: ["obtain", "get", "grab", "nick", "find"],
            whyCorrect: "The sentence is a formal instruction for visitors — 'obtain' is the proper, official way to say 'get'",
            whyWrong: "'Get' works in everyday speech, but 'obtain' is the right choice for a formal sign or rule"
          },
          {
            name: "Grace",
            scenario: "discovers that 'ask' sounds different in formal writing",
            informalWord: "ask",
            formalWord: "request",
            informalSentence: "Can I ask you something?",
            formalSentence: "I would like to request further information.",
            contextSentence: "Parents who wish to ______ a meeting with the headteacher should contact the school office.",
            correctAnswer: "request",
            contextClue: "parents, wish to, headteacher, school office",
            options: ["request", "ask for", "demand", "beg for", "want"],
            whyCorrect: "This is a formal school notice — 'request' is the polished, official way to say 'ask for'. It sounds professional and respectful",
            whyWrong: "'Ask for' isn't wrong, but in an official school notice, 'request' is the proper formal choice"
          },
          {
            name: "Aisha",
            scenario: "notices that 'start' has a fancier version",
            informalWord: "start",
            formalWord: "commence",
            informalSentence: "Let's start the game!",
            formalSentence: "The ceremony will commence at two o'clock.",
            contextSentence: "The examination will ______ promptly at 9:15 a.m. Latecomers will not be admitted.",
            correctAnswer: "commence",
            contextClue: "examination, promptly, latecomers will not be admitted",
            options: ["commence", "start", "kick off", "begin", "get going"],
            whyCorrect: "This is an official exam instruction — 'commence' is the most formal way to say 'start'. You'll see it in serious, official documents",
            whyWrong: "'Start' is fine in everyday speech, but an official exam notice uses the most formal language possible"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `"${v.informalWord}" or "${v.formalWord}"?`,
            body: (v) => `${v.name} ${v.scenario}.\n\nDid you know? The same idea can be said in a **chatty, informal** way or a **polished, formal** way — it's like switching between talking to your mates and talking to the headteacher!\n\n**Informal:** "${v.informalSentence}"\n**Formal:** "${v.formalSentence}"\n\nBoth say the same thing — but the **tone** is completely different!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `"${v.informalWord}" → "${v.formalWord}"`,
                highlightWords: [{ word: v.formalWord, color: "#6C5CE7" }],
                label: "Formal or informal?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Match the formality to the situation!",
            body: (v) => `We compared **"${v.informalWord}"** (informal) with **"${v.formalWord}"** (formal). Here's the key: the **context** tells you whether to use formal or informal vocabulary. Official letters, exam papers and news reports use **formal** words. Texts to friends, playground chats and stories with dialogue use **informal** words. Think: "Would a headteacher say this, or my best friend?"`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Read: "${v.contextSentence.replace('______', '______')}"`, why: "Is this formal or informal?" },
                  { text: `Context clue: "${v.contextClue}"`, why: "These words tell you the tone" },
                  { text: `This is a FORMAL situation`, why: "Official language is needed here" },
                  { text: `"${v.formalWord}" fits perfectly ✓`, why: `"${v.informalWord}" would sound too casual for this context` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `In a formal letter, you should write "____" instead of "${v.informalWord}"`,
              options: (v) => [v.formalWord, v.informalWord, "gonna", "stuff"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! "${v.formalWord}" is the formal version of "${v.informalWord}" — perfect for official writing. ✓`,
                incorrect: (v) => `Not quite — "${v.formalWord}" is the formal alternative to "${v.informalWord}". Formal writing needs professional vocabulary.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Now you try! Think about who's "speaking" in this sentence and pick the word that matches the tone:\n\n**"${v.contextSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.contextSentence,
                highlightWords: [],
                label: "Which register fits?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word best fits this formal sentence?`,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.whyCorrect}. You've got a great ear for formality! ✓`,
                incorrect: (v) => `Nearly! ${v.whyCorrect}. Ask yourself: "Would a headteacher say this?" If yes, it's formal enough!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Formal vs informal — your exam guide!",
            body: () => `Nice work! Here's how to choose the right level of formality every time:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Read the sentence — who is 'speaking'?", why: "A headteacher? A news report? Or a friend chatting at break time?" },
                  { text: "Step 2: Look for formality clues", why: "Official titles, polite phrasing, and serious topics = formal territory" },
                  { text: "Step 3: Match the word to the tone", why: "kid (informal) → child (formal), get → obtain, ask → request — learn these pairs!" },
                  { text: "Step 4: The formal word usually sounds more 'grown-up'", why: "If it sounds like something a headteacher or newsreader would say, it's formal! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Curiosity-Hook — Choosing the Right Register for Context ----
      {
        id: "formal-informal-register",
        templateType: "curiosity-hook",
        learningGoal: [
          "You'll learn how to spot when the exam is testing formal and informal alternatives — it's one of their favourite question types!",
          "You'll get confident at recognising when a question is asking you to change register (switch between formal and informal)"
        ],
        variableSets: [
          {
            name: "Ben",
            scenario: "spots a exam question that asks for a 'more formal' word",
            originalSentence: "The scientist looked at the results carefully.",
            informalWord: "looked at",
            formalAlternative: "examined",
            examQuestion: "Which word could replace 'looked at' to make the sentence more formal?",
            sentence: "The scientist ______ the results carefully.",
            options: ["examined", "glanced at", "peeked at", "stared at", "spotted"],
            whyCorrect: "'Examined' means to look at something very carefully and thoroughly — it's the formal, precise version of 'looked at' and fits a scientist perfectly",
            whyWrong: "'Peeked at' is informal and sneaky — a scientist doesn't peek at results, they examine them professionally",
            formalWords: "examined, investigated, analysed, observed",
            // Interact-specific (different informal/formal pair)
            iOriginalSentence: "The teacher asked the children to start the test.",
            iInformalWord: "start",
            iFormalAlternative: "commence",
            iExamQuestion: "Which word could replace 'start' to make the sentence more formal?",
            iSentence: "The teacher asked the children to ______ the test.",
            iOptions: ["commence", "begin", "kick off", "get going on", "have a go at"],
            iWhyCorrect: "'Commence' is the formal version of 'start' — it's used in official instructions and exams, and sounds professional coming from a teacher"
          },
          {
            name: "Holly",
            scenario: "needs to find a more formal alternative in her practice paper",
            originalSentence: "The mayor said that the new park would open in June.",
            informalWord: "said",
            formalAlternative: "announced",
            examQuestion: "Which word could replace 'said' to make the sentence more formal?",
            sentence: "The mayor ______ that the new park would open in June.",
            options: ["announced", "chatted", "mentioned", "whispered", "yelled"],
            whyCorrect: "'Announced' means to say something officially and publicly — when a mayor makes a statement about a park opening, that's an announcement, not just 'saying' something",
            whyWrong: "'Chatted' is far too informal — mayors don't chat about official park openings, they announce them",
            formalWords: "announced, declared, stated, confirmed",
            // Interact-specific (different informal/formal pair)
            iOriginalSentence: "The manager asked if we could help with the school fair.",
            iInformalWord: "asked",
            iFormalAlternative: "requested",
            iExamQuestion: "Which word could replace 'asked' to make the sentence more formal?",
            iSentence: "The manager ______ that we assist with the school fair.",
            iOptions: ["requested", "begged", "nagged", "hinted", "demanded"],
            iWhyCorrect: "'Requested' is the formal version of 'asked' — it's polite but official, exactly what a manager would do when writing a formal message"
          },
          {
            name: "Priya",
            scenario: "is asked to replace an informal word with something more suitable",
            originalSentence: "The company wants to buy the land next to the school.",
            informalWord: "buy",
            formalAlternative: "purchase",
            examQuestion: "Which word could replace 'buy' to make the sentence more formal?",
            sentence: "The company intends to ______ the land adjacent to the school.",
            options: ["purchase", "buy", "grab", "snag", "pick up"],
            whyCorrect: "'Purchase' is the formal version of 'buy' — it's used in business, legal documents and official reports. A company purchasing land sounds professional",
            whyWrong: "'Grab' is very informal slang — a company doesn't 'grab' land, it purchases it through a formal process",
            formalWords: "purchase, acquire, procure, invest in",
            // Interact-specific (different informal/formal pair)
            iOriginalSentence: "The hospital needs to get more medical supplies.",
            iInformalWord: "get",
            iFormalAlternative: "obtain",
            iExamQuestion: "Which word could replace 'get' to make the sentence more formal?",
            iSentence: "The hospital needs to ______ more medical supplies.",
            iOptions: ["obtain", "grab", "nab", "score", "fetch"],
            iWhyCorrect: "'Obtain' is the formal version of 'get' — it's used in official and professional contexts, and sounds appropriately serious for a hospital"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you make it more formal?`,
            body: (v) => `${v.name} ${v.scenario}:\n\n**"${v.originalSentence}"**\n\n**${v.examQuestion}**\n\nDid you know? The exam loves asking you to swap an everyday word for a more **formal** alternative. It's testing whether you know the difference between chatty and official language — and you're about to get really good at it!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.originalSentence,
                highlightWords: [{ word: v.informalWord, color: "#e74c3c" }],
                label: "Make it more formal:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Swap for the formal version!",
            body: (v) => `The hook asked you to replace **"${v.informalWord}"** with something more formal. The answer is **"${v.formalAlternative}"** — ${v.whyCorrect}.\n\nHere's a top tip: when the exam says "more formal", it wants a word that sounds **official, professional and polished**. Imagine a headteacher, a news reader or a judge saying it — if it fits, it's formal enough! This is one of the easiest types of marks to pick up once you know the trick.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Original: "${v.originalSentence}"`, why: `"${v.informalWord}" is the everyday word` },
                  { text: `Think: what would a news reader say instead?`, why: "News readers use formal, professional language" },
                  { text: `"${v.formalAlternative}" is the formal version`, why: `${v.whyCorrect}` },
                  { text: `"${v.sentence.replace('______', v.formalAlternative)}" ✓`, why: "Now it sounds professional and polished" },
                  { text: "Key swaps: kid → child, buy → purchase, get → obtain", why: "Everyday words have formal twins" },
                  { text: "ask → request, start → commence, said → announced", why: "These come up again and again in the exam" },
                  { text: "big → substantial, help → assist, try → attempt", why: "Learn these pairs — they're exam gold! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `"Buy" and "purchase" mean the same thing, but "purchase" is more formal`, answer: true, explanation: `Correct! "Purchase" is the formal version of "buy" — you'd use it in official letters or reports. ✓` },
                { text: `Informal language is always wrong and should never be used`, answer: false, explanation: `No! Informal language is fine for texts, chats, and dialogue in stories. It's only wrong when the situation calls for formal language. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Now you have a go! Think: "What would a newsreader say instead?"\n\n${v.iExamQuestion}\n\n**"${v.iSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.iSentence,
                highlightWords: [],
                label: "Which word is more formal?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word makes the sentence more formal?`,
              getOptions: (v) => v.iOptions,
              correctAnswer: (v) => v.iFormalAlternative,
              feedback: {
                correct: (v) => `Well done! ${v.iWhyCorrect}. You're getting great at this! ✓`,
                incorrect: (v) => `Nearly! ${v.iWhyCorrect}. Remember: the formal word usually sounds like something you'd hear on the news.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Formal vocabulary — exam gold!",
            body: () => `Learn these swaps — they come up again and again in the exam, so knowing them gives you easy marks:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Informal → Formal: kid → child, buy → purchase", why: "Swap everyday words for polished, professional ones" },
                  { text: "get → obtain, ask → request, start → commence", why: "These formal words pop up in exam passages all the time" },
                  { text: "said → announced, big → substantial", why: "Formal writing swaps simple words for precise, grown-up ones" },
                  { text: "help → assist, try → attempt", why: "Spot the pattern: formal words are usually longer and more precise — learn the pairs and you'll pick up easy marks! ✓" }
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

// ============================================================
// Sub-concepts for "Missing Letters & Words" (Verbal Reasoning, GL Type 7)
//
// REBUILT 26 Jun 2026. The previous lessons (vowel/consonant/double/
// beginning/ending/middle gaps, etc.) taught the OLD isolated-word,
// gap-shown format. The topic was regenerated to the authentic GL format
// (a sentence with ONE word in CAPITALS that has had three consecutive
// letters removed, position hidden; the child finds the removed three-
// letter word). These three sub-concepts teach that authentic method.
// Spec: research/gl-topic-research/missing-letters-words.md
// ============================================================

export const missingLettersWordsSubConcepts = [
  {
    id: "find-missing-word-master",
    name: "Find the Missing Word",
    category: "master",
    lessons: [
      {
        id: "find-missing-word-method",
        templateType: "step-by-step",
        learningGoal: [
          "The full 3-step method for GL 'missing word' questions: read the whole sentence and work out the complete word from its meaning, find the three letters that were taken out, then check BOTH",
          "Why you must always run both checks — the three removed letters must make a real word AND the rebuilt sentence must make sense"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "meeting the missing-word question type for the first time in her VR paper",
            sentence: "On Shrove Tuesday we tossed a CAKE high into the air.",
            capsWord: "CAKE",
            fullWord: "PANCAKE",
            answer: "PAN",
            wordMeaning: "a thin flat food we toss and eat with lemon and sugar",
            options: ["PAN", "BAT", "RUG", "MUD", "COG"],
            correctAnswer: "PAN",
            explanation: "Put PAN at the front of CAKE: PAN + CAKE = PANCAKE — the food you toss and eat with lemon and sugar. ✓",
            interactSentence: "Dad cooked our whole dinner in the KITC.",
            interactCapsWord: "KITC",
            interactFullWord: "KITCHEN",
            interactAnswer: "HEN",
            interactWordMeaning: "the room in a house where meals are cooked",
            interactOptions: ["HEN", "OWL", "CAT", "PIG", "COW"],
            interactCorrectAnswer: "HEN",
            interactExplanation: "Add HEN to the end of KITC: KITC + HEN = KITCHEN — the room where meals are cooked. ✓"
          },
          {
            name: "Jake",
            scenario: "working through a set of missing-word puzzles in his workbook",
            sentence: "The WHER was so stormy that the football match was called off.",
            capsWord: "WHER",
            fullWord: "WEATHER",
            answer: "EAT",
            wordMeaning: "what it's like outside — sunny, rainy or windy",
            options: ["EAT", "OAR", "ICE", "RUG", "AID"],
            correctAnswer: "EAT",
            explanation: "Slot EAT into WHER: W + EAT + HER = WEATHER — what it's like outside. ✓",
            interactSentence: "We bought fresh fruit and vegetables at the MET on Saturday morning.",
            interactCapsWord: "MET",
            interactFullWord: "MARKET",
            interactAnswer: "ARK",
            interactWordMeaning: "a place with stalls selling food and goods",
            interactOptions: ["ARK", "OWL", "TUB", "RIB", "EEL"],
            interactCorrectAnswer: "ARK",
            interactExplanation: "Put ARK inside MET: M + ARK + ET = MARKET — stalls selling food and goods. Don't be fooled that MET is already a word! ✓"
          },
          {
            name: "Priya",
            scenario: "practising the trickiest missing-word questions before her mock",
            sentence: "The old wooden shelf SLED to one side under the weight of the books.",
            capsWord: "SLED",
            fullWord: "SLANTED",
            answer: "ANT",
            wordMeaning: "leaned or tilted to one side",
            options: ["ANT", "OWL", "RIB", "PEA", "OAK"],
            correctAnswer: "ANT",
            explanation: "Slot ANT into SLED: SL + ANT + ED = SLANTED — leaning to one side. Don't be tricked that SLED is already a word! ✓",
            interactSentence: "The shipwrecked sailors were stranded on a tiny ISL with no fresh water.",
            interactCapsWord: "ISL",
            interactFullWord: "ISLAND",
            interactAnswer: "AND",
            interactWordMeaning: "a piece of land with water all around it",
            interactOptions: ["AND", "OAR", "SEA", "FIN", "BAY"],
            interactCorrectAnswer: "AND",
            interactExplanation: "Add AND to the end of ISL: ISL + AND = ISLAND — land with water all around it. ✓"
          },
          {
            name: "Marcus",
            scenario: "revising missing-word puzzles the night before his exam",
            sentence: "Mum searched right to the bottom of her HAND for the missing car keys.",
            capsWord: "HAND",
            fullWord: "HANDBAG",
            answer: "BAG",
            wordMeaning: "the thing Mum carries to hold her purse, phone and keys",
            options: ["BAG", "BOX", "MUG", "TIN", "POT"],
            correctAnswer: "BAG",
            explanation: "Add BAG to the end of HAND: HAND + BAG = HANDBAG — what Mum carries for her purse and keys. Don't be fooled that HAND is already a word! ✓",
            interactSentence: "She pressed the big red TON to switch on the washing machine.",
            interactCapsWord: "TON",
            interactFullWord: "BUTTON",
            interactAnswer: "BUT",
            interactWordMeaning: "a small round fastener, or a knob you press",
            interactOptions: ["BUT", "JAM", "RID", "FOG", "WED"],
            interactCorrectAnswer: "BUT",
            interactExplanation: "Put BUT at the front of TON: BUT + TON = BUTTON — the knob you press. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Three letters have gone missing!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**Here's how these puzzles work.** One word in the sentence is in **CAPITAL LETTERS** — and three letters next to each other have been **secretly taken out**. There's no gap to show you where! Those three missing letters always spell a real little word.\n\n**Read this sentence:**\n\n"${v.sentence}"\n\nThe word **${v.capsWord}** has had three letters removed. What do you think the whole word should really be?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.capsWord, color: "#7C3AED" }],
                label: `Three letters were taken out of ${v.capsWord}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Meaning first — then find the missing word!",
            body: (v) => `Don't stare at **${v.capsWord}** on its own — the sentence is your real clue. Work out what word the sentence NEEDS, then see which three letters are missing.\n\n"${v.sentence}"\n\nTap to reveal the 3-step method.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `1. Read the WHOLE sentence and work out the full word`, why: `The meaning points to "${v.wordMeaning}" — so the word is ${v.fullWord}` },
                  { text: `2. Find the three letters that were taken out: ${v.answer}`, why: `${v.capsWord} + ${v.answer} rebuilds ${v.fullWord}` },
                  { text: `3. CHECK BOTH — is ${v.answer} a real word? Does the sentence make sense now?`, why: `${v.answer} is a real word AND "${v.fullWord}" fits the sentence ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — try the method yourself!",
            body: (v) => `Read this sentence carefully:\n\n"${v.interactSentence}"\n\nThree letters have been taken out of **${v.interactCapsWord}**. Which three letters were removed?\n\nClue: the full word means "${v.interactWordMeaning}".`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactSentence,
                highlightWords: [{ word: v.interactCapsWord, color: "#7C3AED" }],
                label: "Read the whole sentence for sense first"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which three-letter word was taken out of ${v.interactCapsWord}?`,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite — the answer is "${v.interactCorrectAnswer}". ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The 3-step method — locked in!",
            body: () => `You've got it! Whenever a CAPITALISED word has had three letters taken out, follow this unbeatable recipe every single time:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Read the WHOLE sentence and work out the full word from its meaning", why: "The sentence — not the broken word — tells you which word belongs there" },
                  { text: "2. Find the three letters that were taken out", why: "They sit somewhere inside the full word, in their original order" },
                  { text: "3. CHECK BOTH before you answer", why: "The three letters must make a REAL word AND the rebuilt sentence must make sense ✓" }
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
  {
    id: "sentence-clue-first",
    name: "Let the Sentence Lead You",
    category: "core",
    lessons: [
      {
        id: "sentence-clue-first-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Why you must read the whole sentence and work out the word from MEANING — not from how the capital word looks",
          "Spotting the trap: the capital word can itself look like a finished word, but the sentence shows the real one"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "tackling a tricky new question in her VR practice paper",
            sentence: "The maple leaves turned a brilliant SCAR before they fell from the trees.",
            capsWord: "SCAR",
            fullWord: "SCARLET",
            answer: "LET",
            wordMeaning: "a bright, vivid red colour",
            options: ["LET", "OWL", "EAR", "INK", "RAY"],
            correctAnswer: "LET",
            explanation: "Bright leaves before they fall point to SCARLET — a vivid red. SCAR looks like a finished word, but the sentence shows the real word is SCARLET. Slot LET back in: SCAR + LET = SCARLET, and LET is a real word too. ✓",
            interactSentence: "She rummaged inside her HAND looking for her keys and phone.",
            interactCapsWord: "HAND",
            interactFullWord: "HANDBAG",
            interactAnswer: "BAG",
            interactWordMeaning: "a small case used to carry money, keys and personal things",
            interactOptions: ["BAG", "EAR", "OWL", "INK", "ELF"],
            interactCorrectAnswer: "BAG",
            interactExplanation: "Searching for keys means it must be a HANDBAG. HAND looks like the whole word, but the sentence shows it has to be HANDBAG. Add BAG: HAND + BAG = HANDBAG, and BAG is a real word. ✓"
          },
          {
            name: "Jake",
            scenario: "spotting a sneaky missing-letter question in his workbook",
            sentence: "We checked the WEAR forecast before setting off on our long walk.",
            capsWord: "WEAR",
            fullWord: "WEATHER",
            answer: "THE",
            wordMeaning: "the state of the atmosphere — sun, rain or wind",
            options: ["THE", "OWN", "ELF", "RID", "AGO"],
            correctAnswer: "THE",
            explanation: "A forecast before a walk tells you the word is WEATHER. WEAR is itself a real word — that's the trap — but only WEATHER fits the sentence. The missing letters hid in the middle: WEA + THE + R = WEATHER, and THE is a real word. ✓",
            interactSentence: "The new owner will MAN the busy seaside café over the summer.",
            interactCapsWord: "MAN",
            interactFullWord: "MANAGE",
            interactAnswer: "AGE",
            interactWordMeaning: "to be in charge of and run something",
            interactOptions: ["AGE", "OWN", "ELF", "EAR", "OWL"],
            interactCorrectAnswer: "AGE",
            interactExplanation: "Being in charge of a café means to MANAGE it. MAN is its own word — the trap — but the sentence needs MANAGE. Add AGE: MAN + AGE = MANAGE, and AGE is a real word. ✓"
          },
          {
            name: "Priya",
            scenario: "working through a clever VR puzzle before her mock test",
            sentence: "A sleek black PANT prowled silently through the moonlit jungle.",
            capsWord: "PANT",
            fullWord: "PANTHER",
            answer: "HER",
            wordMeaning: "a large, powerful wild cat",
            options: ["HER", "SEA", "OWN", "ICE", "ARM"],
            correctAnswer: "HER",
            explanation: "A sleek black cat prowling the jungle must be a PANTHER. PANT looks complete on its own, but the sentence points to PANTHER. Add HER: PANT + HER = PANTHER, and HER is a real word. ✓",
            interactSentence: "Her light summer dress was made from soft white COT and felt cool.",
            interactCapsWord: "COT",
            interactFullWord: "COTTON",
            interactAnswer: "TON",
            interactWordMeaning: "a soft fabric made from a fluffy plant",
            interactOptions: ["TON", "RUG", "OWL", "INK", "EAR"],
            interactCorrectAnswer: "TON",
            interactExplanation: "A soft fabric from a plant is COTTON. COT looks finished, but the sentence points to COTTON. Add TON: COT + TON = COTTON, and TON is a real word. ✓"
          },
          {
            name: "Marcus",
            scenario: "puzzling over a tough question in his exam revision",
            sentence: "A tiny brown SPAR hopped along the garden fence searching for crumbs.",
            capsWord: "SPAR",
            fullWord: "SPARROW",
            answer: "ROW",
            wordMeaning: "a small, common brown garden bird",
            options: ["ROW", "ELF", "OWL", "ICE", "END"],
            correctAnswer: "ROW",
            explanation: "A tiny brown bird on a fence is a SPARROW. SPAR is already a real word — the trap — yet the sentence needs SPARROW. Put ROW back: SPAR + ROW = SPARROW, and ROW is a real word. ✓",
            interactSentence: "Please don't FOR to feed the rabbit while we are away on holiday.",
            interactCapsWord: "FOR",
            interactFullWord: "FORGET",
            interactAnswer: "GET",
            interactWordMeaning: "to fail to remember something",
            interactOptions: ["GET", "EVE", "OWL", "ICE", "ARM"],
            interactCorrectAnswer: "GET",
            interactExplanation: "Failing to feed the rabbit means you FORGET. FOR is already a real word — the trap — yet the sentence needs FORGET. Add GET: FOR + GET = FORGET, and GET is a real word. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => `Don't be fooled by how the word looks!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**A clever trap!** The word **${v.capsWord}** is printed in capitals — and three letters have been secretly taken out. The catch? **${v.capsWord} can look like a finished word all by itself!** So you can't trust how it looks.\n\nThe SENTENCE is what tells you the real word:\n\n"${v.sentence}"\n\nWhat word should really be there?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.capsWord, color: "#7C3AED" }],
                label: `${v.capsWord} looks finished — but is it?`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Sentence first — then find the letters!",
            body: (v) => `The word in capitals is **${v.capsWord}**. It might already look like a real word — but that's the trick! Three letters have been removed, and only the sentence can tell you the real word.\n\n"${v.sentence}"\n\nTap to reveal how to crack it.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Read the WHOLE sentence — don't just stare at ${v.capsWord}`, why: `${v.capsWord} can look like a finished word, so the letters can't help — the meaning can` },
                  { text: `Picture what the sentence means and guess the FULL word`, why: `The clues point to something that means "${v.wordMeaning}"` },
                  { text: `That word is ${v.fullWord} — now find the three hidden letters`, why: `There's no gap marker, so the missing letters could be anywhere in the word` },
                  { text: `Slot them back in: ${v.capsWord} + ${v.answer} = ${v.fullWord}`, why: `${v.answer} is a real word AND the sentence now makes sense ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — let the sentence lead you!",
            body: (v) => `Read this sentence carefully:\n\n"${v.interactSentence}"\n\nThe word **${v.interactCapsWord}** has had three letters taken out — even though it might look complete! Which three letters go back in?\n\nClue: the real word means "${v.interactWordMeaning}".`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactSentence,
                highlightWords: [{ word: v.interactCapsWord, color: "#7C3AED" }],
                label: "Let the sentence lead you"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which three letters were taken out of ${v.interactCapsWord}?`,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite — the answer is "${v.interactCorrectAnswer}". ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Meaning leads the way — sorted!",
            body: () => `You've got it! When a capital word has three letters missing, never trust how it looks. Here's your recipe:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Read the WHOLE sentence first", why: "The capital word can look finished, so the meaning is your real clue" },
                  { text: "2. Work out the FULL word from its MEANING", why: "Picture the scene — what word truly fits?" },
                  { text: "3. Find the three hidden letters and slot them back in", why: "There's no gap marker, so the letters could be anywhere" },
                  { text: "4. Check BOTH: the three letters make a real word AND the sentence makes sense", why: "Only one option passes both tests ✓" }
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
  {
    id: "check-both-and-eliminate",
    name: "Always Check Both",
    category: "core",
    lessons: [
      {
        id: "check-both-steps",
        templateType: "step-by-step",
        learningGoal: [
          "The two checks that crack every missing-three-letters question: the letters must build a REAL word, AND that word must make the sentence make sense",
          "How to eliminate the sneaky 'real little word' trap that passes one check but fails the other"
        ],
        variableSets: [
          {
            name: "Sofia",
            scenario: "learning to run two checks on every single answer",
            sentence: "The ragged BAR sat on the cold pavement, hoping a passer-by would spare him a coin.",
            capsWord: "BAR",
            fullWord: "BEGGAR",
            answer: "EGG",
            wordMeaning: "a person who lives by asking other people for money or food",
            options: ["EGG", "OWL", "TIP", "RUN", "ICE"],
            correctAnswer: "EGG",
            explanation: "Read the sentence — someone asking strangers for coins is a BEGGAR. Slot EGG into BAR: B + EGG + AR = BEGGAR, a real word that fits. ✓ Notice BAR is already a real word, so it's easy to think nothing is missing — let the meaning lead. TIP is a real little word too, but BTIPAR and BARTIP aren't words, so it fails the word check. Always check BOTH: a real word AND it fits the sentence. ✓",
            interactSentence: "Mum bought fresh fruit and vegetables at the MET in town on Saturday morning.",
            interactCapsWord: "MET",
            interactFullWord: "MARKET",
            interactAnswer: "ARK",
            interactWordMeaning: "a place where people buy and sell food and goods",
            interactOptions: ["ARK", "ART", "OWE", "INK", "PEG"],
            interactCorrectAnswer: "ARK",
            interactExplanation: "A place to buy fresh fruit and veg is a MARKET. Slot ARK into MET: M + ARK + ET = MARKET. ✓ ART is a real word, but MARTET and METART aren't words, so it fails the word check. ✓"
          },
          {
            name: "Reuben",
            scenario: "practising the two-check method in his verbal reasoning workbook",
            sentence: "Dad keeps all the tins, jars and packets of pasta in the kitchen PAN.",
            capsWord: "PAN",
            fullWord: "PANTRY",
            answer: "TRY",
            wordMeaning: "a small room or cupboard for storing food",
            options: ["TRY", "RUN", "OWL", "TUB", "ICE"],
            correctAnswer: "TRY",
            explanation: "Read the sentence — tins and jars are stored in a PANTRY. Add TRY to PAN: PAN + TRY = PANTRY, a real word that fits. ✓ Watch out: PAN is already a real word on its own, so don't assume nothing is missing. RUN is a real word too, but PANRUN isn't, so it fails the word check. Check BOTH: a real word AND it makes the sentence make sense. ✓",
            interactSentence: "Grandad grows roses, tulips and runner beans in his GAR every summer.",
            interactCapsWord: "GAR",
            interactFullWord: "GARDEN",
            interactAnswer: "DEN",
            interactWordMeaning: "an area of ground where flowers and plants are grown",
            interactOptions: ["DEN", "OWL", "TEA", "RIB", "AXE"],
            interactCorrectAnswer: "DEN",
            interactExplanation: "Roses and tulips grow in a GARDEN. Slot DEN into GAR: GAR + DEN = GARDEN. ✓ TEA is a real word, but GARTEA and GATEAR aren't words, so it fails the word check. ✓"
          },
          {
            name: "Maya",
            scenario: "getting ready for her mock test by checking every option carefully",
            sentence: "After a long and tiring JOEY across the mountains, the explorers finally reached the village.",
            capsWord: "JOEY",
            fullWord: "JOURNEY",
            answer: "URN",
            wordMeaning: "a long trip from one place to another",
            options: ["URN", "OWE", "RID", "ELF", "TAP"],
            correctAnswer: "URN",
            explanation: "Read the whole sentence — a long, tiring trip across mountains is a JOURNEY. Slot URN into JOEY: JO + URN + EY = JOURNEY. ✓ Notice JOEY is already a real word (a baby kangaroo!), so the missing letters are hard to spot — trust the sentence. RID is a real word too, but it doesn't build a real word inside JOEY, so it fails the word check. Always check BOTH. ✓",
            interactSentence: "The WEAR forecast warned of heavy rain and strong winds across the whole weekend.",
            interactCapsWord: "WEAR",
            interactFullWord: "WEATHER",
            interactAnswer: "THE",
            interactWordMeaning: "the state of the air, such as sun, rain or wind",
            interactOptions: ["THE", "EAR", "OWN", "RUG", "TIP"],
            interactCorrectAnswer: "THE",
            interactExplanation: "A forecast of rain and wind is the WEATHER. Slot THE into WEAR: WEA + THE + R = WEATHER. ✓ EAR is a real word, but WEAREAR isn't, so it fails the word check. WEAR is also a real word on its own — so follow the sentence, not how the capital word looks. ✓"
          },
          {
            name: "Leo",
            scenario: "making sure he never falls for a tricky wrong answer",
            sentence: "The other children called him a COD for running away instead of helping his friend.",
            capsWord: "COD",
            fullWord: "COWARD",
            answer: "WAR",
            wordMeaning: "a person who is not brave and runs away from danger",
            options: ["WAR", "OWL", "RIB", "TEA", "PEG"],
            correctAnswer: "WAR",
            explanation: "Read the sentence — someone who runs away instead of helping is a COWARD. Slot WAR into COD: CO + WAR + D = COWARD. ✓ COD is already a real word (a fish!), so don't assume nothing is missing — let the meaning lead. RIB is a real word too, but CORIB and CODRIB aren't words, so it fails the word check. Check BOTH: a real word AND it fits the sentence. ✓",
            interactSentence: "The fierce PIE buried his heavy chest of gold coins on a deserted island.",
            interactCapsWord: "PIE",
            interactFullWord: "PIRATE",
            interactAnswer: "RAT",
            interactWordMeaning: "a robber who sails the seas attacking ships",
            interactOptions: ["RAT", "OWE", "TUB", "ICE", "OAK"],
            interactCorrectAnswer: "RAT",
            interactExplanation: "Someone who sails the seas robbing ships and burying treasure is a PIRATE. Slot RAT into PIE: PI + RAT + E = PIRATE. ✓ NAP is a real word, but PINAPE and PIENAP aren't words, so it fails the word check. PIE is also a real word — so trust the sentence's meaning, not the look of the capital word. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Two checks every time — a real word AND it fits!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**The golden rule for this question type:** the three letters you add must pass **TWO checks** —\n\n**Check 1:** they build a **real word**.\n**Check 2:** that word makes the **sentence make sense**.\n\nMiss either one and you've been tricked!\n\n**Read this sentence:**\n\n"${v.sentence}"\n\nThree letters have been taken out of **${v.capsWord}**. Which three put it right?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.capsWord, color: "#7C3AED" }],
                label: `Three letters are missing from ${v.capsWord}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Run both checks — don't stop at one!",
            body: (v) => `The capital word is **${v.capsWord}**. Lots of three-letter words are real on their own — but that's **not enough**! They must rebuild a real word AND fit the sentence.\n\n"${v.sentence}"\n\nTap to see how to run both checks.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Read the whole sentence and picture it — guess the FULL word from its meaning`, why: `The sentence points to "${v.wordMeaning}"` },
                  { text: `Find the three letters hiding inside ${v.capsWord}`, why: `${v.capsWord} → ${v.fullWord}, so the missing letters are ${v.answer}` },
                  { text: `Check 1: do those three letters build a REAL word?`, why: `${v.answer} slots into ${v.capsWord} to make ${v.fullWord} — a real word ✓` },
                  { text: `Check 2: does that word make the SENTENCE make sense?`, why: `Yes — ${v.fullWord} fits perfectly. Both checks pass! ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — run both checks!",
            body: (v) => `Read this sentence carefully:\n\n"${v.interactSentence}"\n\nThree letters are missing from **${v.interactCapsWord}**. Test each option against BOTH checks before you choose.\n\nClue: the full word means "${v.interactWordMeaning}".`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactSentence,
                highlightWords: [{ word: v.interactCapsWord, color: "#7C3AED" }],
                label: "Real word AND fits the sentence"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which three letters complete the word ${v.interactCapsWord}?`,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite — the answer is "${v.interactCorrectAnswer}". ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Check both, eliminate the rest — fool-proof!",
            body: () => `You've got it! Lots of the wrong answers are real little words on their own — that's the bait. Here's how you never fall for it:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Read the sentence and guess the full word from its meaning", why: "Meaning first — that's how you find the word" },
                  { text: "2. Check 1: do your three letters build a REAL word?", why: "A real little word on its own isn't enough — it must rebuild a real word" },
                  { text: "3. Check 2: does that word make the sentence make sense?", why: "The right answer always passes BOTH checks" },
                  { text: "4. Cross out any option that fails EITHER check", why: "Eliminate the traps — only one option survives both ✓" }
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

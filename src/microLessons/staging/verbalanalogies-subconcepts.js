// ============================================================
// Supplementary sub-concepts for Verbal Analogies (Verbal Reasoning)
// To merge: add these to lessonBank.verbalAnalogies.subConcepts array in lessonData.js
// ============================================================

export const verbalAnalogiesSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: Young to Adult
  // Category: core
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "young-adult",
    name: "Young to Adult",
    category: "core",
    lessons: [
      {
        id: "young-adult-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot 'young animal to adult animal' analogies — these come up loads, and some of the baby names are really surprising!",
          "How to apply the pattern: baby is to adult as baby is to adult (once you see it, you can't miss it)"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "working on word relationship puzzles",
            pair1: ["puppy", "dog"],
            pair2word: "kitten",
            answer: "cat",
            relationship: "young to adult",
            analogy: "puppy is to dog as kitten is to cat",
            whyItWorks: "A puppy is a young dog, just as a kitten is a young cat",
            options: ["cat", "mouse", "fur", "pet", "milk"],
            correctAnswer: "cat",
            explanation: "A puppy grows up to be a dog. A kitten grows up to be a cat. The relationship is young animal to adult animal. ✓",
            interactPair1: ["chick", "hen"],
            interactPair2word: "fawn",
            interactAnswer: "deer",
            interactOptions: ["deer", "forest", "antler", "rabbit", "fox"],
            interactCorrectAnswer: "deer",
            interactExplanation: "A chick is a young hen. A fawn is a young deer. Both pairs follow the young-to-adult pattern. ✓"
          },
          {
            name: "Oliver",
            scenario: "practising verbal reasoning analogies",
            pair1: ["calf", "cow"],
            pair2word: "foal",
            answer: "horse",
            relationship: "young to adult",
            analogy: "calf is to cow as foal is to horse",
            whyItWorks: "A calf is a young cow, just as a foal is a young horse",
            options: ["horse", "pony", "stable", "donkey", "rider"],
            correctAnswer: "horse",
            explanation: "A calf is a young cow. A foal is a young horse. Both pairs follow the 'baby to grown-up' pattern. ✓",
            interactPair1: ["gosling", "goose"],
            interactPair2word: "leveret",
            interactAnswer: "hare",
            interactOptions: ["hare", "rabbit", "field", "burrow", "mouse"],
            interactCorrectAnswer: "hare",
            interactExplanation: "A gosling is a young goose. A leveret is a young hare. Both pairs link a baby animal to its adult name. ✓"
          },
          {
            name: "Priya",
            scenario: "solving word pair puzzles in her VR test",
            pair1: ["cub", "bear"],
            pair2word: "lamb",
            answer: "sheep",
            relationship: "young to adult",
            analogy: "cub is to bear as lamb is to sheep",
            whyItWorks: "A cub is a young bear, just as a lamb is a young sheep",
            options: ["sheep", "wool", "goat", "farm", "field"],
            correctAnswer: "sheep",
            explanation: "A cub is a baby bear. A lamb is a baby sheep. The relationship is the same — young to adult. ✓",
            interactPair1: ["tadpole", "frog"],
            interactPair2word: "caterpillar",
            interactAnswer: "butterfly",
            interactOptions: ["butterfly", "moth", "leaf", "cocoon", "garden"],
            interactCorrectAnswer: "butterfly",
            interactExplanation: "A tadpole grows up to be a frog. A caterpillar grows up to be a butterfly. Both are young-to-adult pairs. ✓"
          },
          {
            name: "Finn",
            scenario: "tackling analogy questions before his mock test",
            pair1: ["cygnet", "swan"],
            pair2word: "joey",
            answer: "kangaroo",
            relationship: "young to adult",
            analogy: "cygnet is to swan as joey is to kangaroo",
            whyItWorks: "A cygnet is a young swan, just as a joey is a young kangaroo",
            options: ["kangaroo", "pouch", "wallaby", "australia", "koala"],
            correctAnswer: "kangaroo",
            explanation: "A cygnet is a baby swan. A joey is a baby kangaroo. Once you spot the young-to-adult pattern, you just need to know the adult animal. ✓",
            interactPair1: ["kid", "goat"],
            interactPair2word: "piglet",
            interactAnswer: "pig",
            interactOptions: ["pig", "boar", "farm", "sow", "mud"],
            interactCorrectAnswer: "pig",
            interactExplanation: "A kid is a young goat. A piglet is a young pig. The relationship is young animal to adult animal. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.pair1[0]} is to ${v.pair1[1]} as ${v.pair2word} is to ___?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nDid you know that some baby animals have really unusual names? A baby swan is a cygnet, and a baby kangaroo is a joey! Word analogies work like this: **A is to B as C is to ___**.\n\nThe trick is to spot the **relationship** between the first pair, then apply the SAME pattern to the second pair. Let's have a go!`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                pair1: v.pair1,
                pair2word: v.pair2word,
                answer: null,
                label: "What connects the first pair?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Young to Adult",
            body: (v) => `**${v.pair1[0]}** is to **${v.pair1[1]}** — can you see the connection? This is one of the most common analogy patterns: **baby animal → adult animal**. Once you spot it in the first pair, just apply the same idea to **${v.pair2word}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.pair1[0]}" is a young "${v.pair1[1]}"`, why: "First pair: baby → grown-up" },
                  { text: `So "${v.pair2word}" must be a young ___?`, why: "Apply the same relationship" },
                  { text: `Answer: "${v.pair2word}" is a young "${v.answer}" ✓`, why: v.whyItWorks }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `An analogy is a puzzle where you find the ____ between two pairs of words`,
              options: (v) => ["relationship", "difference", "spelling", "rhyme"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Analogies are about finding the same relationship in both pairs. ✓`,
                incorrect: (v) => `Not quite — analogies are about the RELATIONSHIP between the word pairs!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.interactPair1[0]}** is to **${v.interactPair1[1]}** as **${v.interactPair2word}** is to ___?`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                pair1: v.interactPair1,
                pair2word: v.interactPair2word,
                answer: null,
                relationship: v.relationship,
                label: "Complete the analogy:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactPair1[0]} is to ${v.interactPair1[1]} as ${v.interactPair2word} is to ___?`,
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
            title: () => "Young → Adult pattern — you've got it!",
            body: () => `Nice work! You've cracked one of the most popular analogy patterns. Here's your quick-reference guide:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Ask: is the first word a BABY version of the second?", why: "puppy → dog, kitten → cat, cub → bear" },
                  { text: "2. If yes, the answer is the adult version of the third word", why: "Same relationship applied to the new pair" },
                  { text: "3. Learn the tricky ones: cygnet → swan, joey → kangaroo", why: "Some baby names are unusual — these come up often ✓" }
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
  // SUB-CONCEPT 2: Tool to User
  // Category: core
  // ==========================================
  {
    id: "tool-user",
    name: "Tool to User",
    category: "core",
    lessons: [
      {
        id: "tool-user-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot 'tool to person who uses it' analogies — think about who uses what at work!",
          "How to apply the pattern: tool is to professional as tool is to professional (this one's really satisfying to crack)"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "working through analogy puzzles",
            pair1: ["pen", "writer"],
            pair2word: "brush",
            answer: "painter",
            relationship: "tool to user",
            analogy: "pen is to writer as brush is to painter",
            whyItWorks: "A writer uses a pen to write, just as a painter uses a brush to paint",
            options: ["painter", "cleaner", "artist", "decorator", "teacher"],
            correctAnswer: "painter",
            explanation: "A pen is a writer's tool. A brush is a painter's tool. Both pairs link a tool to the person who uses it. ✓",
            interactPair1: ["hammer", "carpenter"],
            interactPair2word: "needle",
            interactAnswer: "tailor",
            interactOptions: ["tailor", "doctor", "nurse", "knitter", "dressmaker"],
            interactCorrectAnswer: "tailor",
            interactExplanation: "A carpenter uses a hammer. A tailor uses a needle. Both pairs link a tool to the professional who uses it. ✓"
          },
          {
            name: "Marcus",
            scenario: "practising verbal reasoning before his test",
            pair1: ["scalpel", "surgeon"],
            pair2word: "baton",
            answer: "conductor",
            relationship: "tool to user",
            analogy: "scalpel is to surgeon as baton is to conductor",
            whyItWorks: "A surgeon uses a scalpel to operate, just as a conductor uses a baton to lead the orchestra",
            options: ["conductor", "musician", "runner", "drummer", "police"],
            correctAnswer: "conductor",
            explanation: "A scalpel is a surgeon's tool. A baton is a conductor's tool. The relationship is tool → the person who uses it. ✓",
            interactPair1: ["trowel", "gardener"],
            interactPair2word: "camera",
            interactAnswer: "photographer",
            interactOptions: ["photographer", "tourist", "director", "reporter", "artist"],
            interactCorrectAnswer: "photographer",
            interactExplanation: "A gardener uses a trowel. A photographer uses a camera. Both pairs link a tool to the person who uses it. ✓"
          },
          {
            name: "Aisha",
            scenario: "solving word pair problems",
            pair1: ["stethoscope", "doctor"],
            pair2word: "whisk",
            answer: "chef",
            relationship: "tool to user",
            analogy: "stethoscope is to doctor as whisk is to chef",
            whyItWorks: "A doctor uses a stethoscope to listen to hearts, just as a chef uses a whisk to mix ingredients",
            options: ["chef", "baker", "waiter", "cook", "kitchen"],
            correctAnswer: "chef",
            explanation: "A stethoscope is a doctor's tool. A whisk is a chef's tool. The pattern links each tool to its professional user. ✓",
            interactPair1: ["hose", "firefighter"],
            interactPair2word: "chalk",
            interactAnswer: "teacher",
            interactOptions: ["teacher", "student", "builder", "artist", "climber"],
            interactCorrectAnswer: "teacher",
            interactExplanation: "A firefighter uses a hose. A teacher uses chalk. Both pairs link a tool to the professional who uses it. ✓"
          },
          {
            name: "Charlie",
            scenario: "tackling tricky analogy questions",
            pair1: ["gavel", "judge"],
            pair2word: "telescope",
            answer: "astronomer",
            relationship: "tool to user",
            analogy: "gavel is to judge as telescope is to astronomer",
            whyItWorks: "A judge uses a gavel in court, just as an astronomer uses a telescope to study the stars",
            options: ["astronomer", "scientist", "pirate", "explorer", "teacher"],
            correctAnswer: "astronomer",
            explanation: "A gavel is a judge's tool. A telescope is an astronomer's tool. Once you spot 'tool → user', find who uses the second tool. ✓",
            interactPair1: ["spatula", "chef"],
            interactPair2word: "microscope",
            interactAnswer: "scientist",
            interactOptions: ["scientist", "doctor", "teacher", "detective", "inventor"],
            interactCorrectAnswer: "scientist",
            interactExplanation: "A chef uses a spatula. A scientist uses a microscope. Both pairs link a tool to the professional who uses it. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.pair1[0]} is to ${v.pair1[1]} as ${v.pair2word} is to ___?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nThink about the **first pair**: what is a "${v.pair1[0]}" to a "${v.pair1[1]}"? Imagine them at work together.\n\nOnce you can name the relationship, you can solve ANY analogy that uses the same pattern!`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                pair1: v.pair1,
                pair2word: v.pair2word,
                answer: null,
                label: "What does the first pair have in common?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Tool → User",
            body: (v) => `A **${v.pair1[1]}** uses a **${v.pair1[0]}**. This pattern links a **tool or instrument** to the **person who uses it**. So who uses a **${v.pair2word}**?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `A "${v.pair1[1]}" uses a "${v.pair1[0]}"`, why: "First pair: tool → professional" },
                  { text: `So who uses a "${v.pair2word}"?`, why: "Apply the same relationship" },
                  { text: `A "${v.answer}" uses a "${v.pair2word}" ✓`, why: v.whyItWorks }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "pen", right: "writer" },
                { left: "scalpel", right: "surgeon" },
                { left: "whisk", right: "chef" },
                { left: "gavel", right: "judge" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.interactPair1[0]}** is to **${v.interactPair1[1]}** as **${v.interactPair2word}** is to ___?`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                pair1: v.interactPair1,
                pair2word: v.interactPair2word,
                answer: null,
                relationship: v.relationship,
                label: "Complete the analogy:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactPair1[0]} is to ${v.interactPair1[1]} as ${v.interactPair2word} is to ___?`,
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
            title: () => "Tool → User pattern — well done!",
            body: () => `Great work! You've added another pattern to your collection. When you spot a tool-to-user analogy:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Ask: is the first word a TOOL used by the second word?", why: "pen → writer, scalpel → surgeon, gavel → judge" },
                  { text: "2. If yes, the answer is the PERSON who uses the third word", why: "Who uses a brush? A painter!" },
                  { text: "3. Pick the most specific user, not just anyone related", why: "A brush → painter (not 'artist' or 'cleaner') ✓" }
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
  // SUB-CONCEPT 3: Part to Whole
  // Category: core
  // ==========================================
  {
    id: "part-whole",
    name: "Part to Whole",
    category: "core",
    lessons: [
      {
        id: "part-whole-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot 'part to whole' analogies — where one thing is a piece of something bigger",
          "How to apply the pattern: part is to whole as part is to whole (think jigsaw pieces!)"
        ],
        variableSets: [
          {
            name: "Zara",
            scenario: "puzzling over a word relationship question",
            pair1: ["page", "book"],
            pair2word: "key",
            answer: "keyboard",
            relationship: "part to whole",
            analogy: "page is to book as key is to keyboard",
            whyItWorks: "A page is one part of a book, just as a key is one part of a keyboard",
            options: ["keyboard", "lock", "piano", "computer", "door"],
            correctAnswer: "keyboard",
            explanation: "A page is a part of a book. A key is a part of a keyboard. Both pairs link a small piece to the bigger thing it belongs to. ✓",
            interactPair1: ["wing", "aeroplane"],
            interactPair2word: "sail",
            interactAnswer: "boat",
            interactOptions: ["boat", "wind", "sea", "mast", "ship"],
            interactCorrectAnswer: "boat",
            interactExplanation: "A wing is part of an aeroplane. A sail is part of a boat. Both pairs link a piece to the whole thing it belongs to. ✓"
          },
          {
            name: "Sam",
            scenario: "working through analogy problems",
            pair1: ["wheel", "car"],
            pair2word: "petal",
            answer: "flower",
            relationship: "part to whole",
            analogy: "wheel is to car as petal is to flower",
            whyItWorks: "A wheel is part of a car, just as a petal is part of a flower",
            options: ["flower", "garden", "stem", "bee", "vase"],
            correctAnswer: "flower",
            explanation: "A wheel is a part of a car. A petal is a part of a flower. The relationship is part → the whole thing. ✓",
            interactPair1: ["handle", "door"],
            interactPair2word: "sleeve",
            interactAnswer: "shirt",
            interactOptions: ["shirt", "arm", "button", "jacket", "fabric"],
            interactCorrectAnswer: "shirt",
            interactExplanation: "A handle is part of a door. A sleeve is part of a shirt. Both pairs link a smaller part to the whole thing. ✓"
          },
          {
            name: "Maisie",
            scenario: "practising analogies for her verbal reasoning paper",
            pair1: ["brick", "wall"],
            pair2word: "stitch",
            answer: "jumper",
            relationship: "part to whole",
            analogy: "brick is to wall as stitch is to jumper",
            whyItWorks: "A wall is made up of bricks, just as a jumper is made up of stitches",
            options: ["jumper", "needle", "wool", "knitting", "thread"],
            correctAnswer: "jumper",
            explanation: "A brick is a small unit that makes up a wall. A stitch is a small unit that makes up a jumper. Both link the part to the whole. ✓",
            interactPair1: ["branch", "tree"],
            interactPair2word: "finger",
            interactAnswer: "hand",
            interactOptions: ["hand", "arm", "glove", "ring", "nail"],
            interactCorrectAnswer: "hand",
            interactExplanation: "A branch is part of a tree. A finger is part of a hand. Both pairs link a smaller piece to the whole it belongs to. ✓"
          },
          {
            name: "Ben",
            scenario: "solving word relationship puzzles",
            pair1: ["chapter", "book"],
            pair2word: "verse",
            answer: "poem",
            relationship: "part to whole",
            analogy: "chapter is to book as verse is to poem",
            whyItWorks: "A chapter is a section of a book, just as a verse is a section of a poem",
            options: ["poem", "song", "rhyme", "stanza", "lyric"],
            correctAnswer: "poem",
            explanation: "A chapter is a section of a book. A verse is a section of a poem. The relationship is: a piece that makes up the whole. ✓",
            interactPair1: ["drawer", "desk"],
            interactPair2word: "carriage",
            interactAnswer: "train",
            interactOptions: ["train", "station", "engine", "track", "platform"],
            interactCorrectAnswer: "train",
            interactExplanation: "A drawer is part of a desk. A carriage is part of a train. Both pairs link a section to the whole thing. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.pair1[0]} is to ${v.pair1[1]} as ${v.pair2word} is to ___?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nLook at the first pair: **"${v.pair1[0]}"** and **"${v.pair1[1]}"**.\n\nIs one a PIECE of the other? Like a slice from a cake or a brick from a wall? If so, you've found a **part-to-whole** analogy!`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                pair1: v.pair1,
                pair2word: v.pair2word,
                answer: null,
                label: "Is the first word part of the second?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Part → Whole",
            body: (v) => `A **${v.pair1[0]}** is part of a **${v.pair1[1]}**. In this pattern, the first word is a **small piece** of the second word. So what is a **${v.pair2word}** part of?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `A "${v.pair1[0]}" is part of a "${v.pair1[1]}"`, why: "First pair: a piece of the bigger thing" },
                  { text: `So a "${v.pair2word}" is part of a ___?`, why: "What bigger thing contains this piece?" },
                  { text: `A "${v.pair2word}" is part of a "${v.answer}" ✓`, why: v.whyItWorks }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.interactPair1[0]}** is to **${v.interactPair1[1]}** as **${v.interactPair2word}** is to ___?`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                pair1: v.interactPair1,
                pair2word: v.interactPair2word,
                answer: null,
                relationship: v.relationship,
                label: "Complete the analogy:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactPair1[0]} is to ${v.interactPair1[1]} as ${v.interactPair2word} is to ___?`,
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
            title: () => "Part → Whole pattern — nice one!",
            body: () => `Brilliant! You've got another analogy pattern in your toolkit now. When you spot a part-to-whole connection:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Ask: is the first word a PIECE of the second?", why: "page → book, wheel → car, brick → wall" },
                  { text: "2. If yes, the answer is the WHOLE THING that contains the third word", why: "A key is part of a keyboard!" },
                  { text: "3. Don't confuse part-whole with tool-user!", why: "A wheel is PART of a car, not a tool used by a car ✓" }
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
  // SUB-CONCEPT 4: Cause and Effect
  // Category: supporting
  // ==========================================
  {
    id: "cause-effect",
    name: "Cause and Effect",
    category: "supporting",
    lessons: [
      {
        id: "cause-effect-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot 'cause and effect' analogies — one thing leads to another, like dominoes!",
          "How to apply the pattern: cause leads to effect as cause leads to effect"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "working through a verbal reasoning worksheet",
            pair1: ["heat", "melt"],
            pair2word: "cold",
            answer: "freeze",
            relationship: "cause and effect",
            analogy: "heat is to melt as cold is to freeze",
            whyItWorks: "Heat causes things to melt, just as cold causes things to freeze",
            options: ["freeze", "shiver", "ice", "winter", "snow"],
            correctAnswer: "freeze",
            explanation: "Heat causes melting. Cold causes freezing. Both pairs link a cause to its direct effect. ✓",
            interactPair1: ["wind", "erosion"],
            interactPair2word: "fire",
            interactAnswer: "ash",
            interactOptions: ["ash", "smoke", "flame", "heat", "burn"],
            interactCorrectAnswer: "ash",
            interactExplanation: "Wind causes erosion. Fire causes ash. Both pairs link a cause to the result it produces. ✓"
          },
          {
            name: "Marcus",
            scenario: "tackling cause-and-effect word puzzles",
            pair1: ["rain", "flood"],
            pair2word: "drought",
            answer: "famine",
            relationship: "cause and effect",
            analogy: "rain is to flood as drought is to famine",
            whyItWorks: "Too much rain causes flooding, just as a drought (no rain) causes famine (no food)",
            options: ["famine", "desert", "thirst", "heat", "dry"],
            correctAnswer: "famine",
            explanation: "Excessive rain causes floods. A drought (long period without rain) causes famine (food shortage). Both are cause → effect. ✓",
            interactPair1: ["sunlight", "growth"],
            interactPair2word: "frost",
            interactAnswer: "damage",
            interactOptions: ["damage", "cold", "winter", "ice", "snow"],
            interactCorrectAnswer: "damage",
            interactExplanation: "Sunlight causes growth in plants. Frost causes damage to plants. Both pairs link a weather cause to its direct effect. ✓"
          },
          {
            name: "Aisha",
            scenario: "solving analogy puzzles in her practice paper",
            pair1: ["practice", "improvement"],
            pair2word: "neglect",
            answer: "decay",
            relationship: "cause and effect",
            analogy: "practice is to improvement as neglect is to decay",
            whyItWorks: "Practice leads to improvement, just as neglect leads to decay",
            options: ["decay", "broken", "mess", "lazy", "forget"],
            correctAnswer: "decay",
            explanation: "Practice causes improvement. Neglect causes decay. The relationship is: this action leads to this result. ✓",
            interactPair1: ["hunger", "eating"],
            interactPair2word: "tiredness",
            interactAnswer: "sleep",
            interactOptions: ["sleep", "yawn", "bed", "rest", "dream"],
            interactCorrectAnswer: "sleep",
            interactExplanation: "Hunger causes eating. Tiredness causes sleep. Both pairs link a cause to the action it leads to. ✓"
          },
          {
            name: "Charlie",
            scenario: "figuring out word pair connections",
            pair1: ["exercise", "fitness"],
            pair2word: "study",
            answer: "knowledge",
            relationship: "cause and effect",
            analogy: "exercise is to fitness as study is to knowledge",
            whyItWorks: "Exercise leads to fitness, just as study leads to knowledge",
            options: ["knowledge", "school", "books", "clever", "homework"],
            correctAnswer: "knowledge",
            explanation: "Exercise produces fitness. Study produces knowledge. Both pairs show an activity leading to a positive outcome. ✓",
            interactPair1: ["laughter", "happiness"],
            interactPair2word: "crying",
            interactAnswer: "sadness",
            interactOptions: ["sadness", "tears", "pain", "upset", "misery"],
            interactCorrectAnswer: "sadness",
            interactExplanation: "Laughter shows happiness. Crying shows sadness. Both pairs link an action to the feeling that causes it. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.pair1[0]} is to ${v.pair1[1]} as ${v.pair2word} is to ___?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nLook at **"${v.pair1[0]}"** and **"${v.pair1[1]}"**.\n\nDoes the first thing **cause** or **lead to** the second? Like how rain causes puddles, or how studying leads to good marks? If so, you've found a **cause-and-effect** analogy!`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                pair1: v.pair1,
                pair2word: v.pair2word,
                answer: null,
                label: "Does the first word cause the second?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Cause → Effect",
            body: (v) => `**${v.pair1[0]}** causes **${v.pair1[1]}**. In this pattern, the first word **causes** or **leads to** the second. So what does **${v.pair2word}** cause?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.pair1[0]}" causes "${v.pair1[1]}"`, why: "First pair: cause → result" },
                  { text: `So what does "${v.pair2word}" cause?`, why: "Apply the same cause-effect logic" },
                  { text: `"${v.pair2word}" causes "${v.answer}" ✓`, why: v.whyItWorks }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Look at the first pair: "${v.pair1[0]}" and "${v.pair1[1]}"`,
                `Ask: does the first word CAUSE the second?`,
                `Apply the same logic to "${v.pair2word}"`,
                `Pick the direct result: "${v.answer}"`
              ],
              feedback: {
                correct: (v) => `Perfect! Spot the cause in pair 1, then apply it to pair 2. ✓`,
                incorrect: (v) => `Not quite — start by identifying the cause-effect in the first pair.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.interactPair1[0]}** is to **${v.interactPair1[1]}** as **${v.interactPair2word}** is to ___?`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                pair1: v.interactPair1,
                pair2word: v.interactPair2word,
                answer: null,
                relationship: v.relationship,
                label: "Complete the analogy:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactPair1[0]} is to ${v.interactPair1[1]} as ${v.interactPair2word} is to ___?`,
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
            title: () => "Cause → Effect pattern — you've got it!",
            body: () => `Excellent! You've cracked another pattern. Cause-and-effect analogies are everywhere once you start looking for them:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Ask: does the first word CAUSE the second?", why: "heat → melt, rain → flood, practice → improvement" },
                  { text: "2. If yes, find what the third word CAUSES", why: "cold → freeze, study → knowledge" },
                  { text: "3. Pick the direct result, not just something related", why: "Cold causes freezing (not 'shiver' or 'winter') ✓" }
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
  // SUB-CONCEPT 5: Synonym and Antonym Pairs
  // Category: supporting
  // ==========================================
  {
    id: "synonym-antonym-pairs",
    name: "Synonym & Antonym Pairs",
    category: "supporting",
    lessons: [
      {
        id: "synonym-antonym-pairs-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot analogies where the relationship IS about words meaning the same (synonym) or the opposite (antonym) — two skills in one!",
          "How to apply the pattern: word is to synonym/antonym as word is to synonym/antonym"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "working on word relationship puzzles",
            pair1: ["hot", "cold"],
            pair2word: "big",
            answer: "small",
            relationship: "antonym (opposite) pairs",
            analogy: "hot is to cold as big is to small",
            whyItWorks: "Hot is the opposite of cold, just as big is the opposite of small",
            pairType: "opposites",
            options: ["small", "large", "tiny", "huge", "tall"],
            correctAnswer: "small",
            explanation: "Hot and cold are opposites. Big and small are opposites. The relationship is antonym → antonym. ✓",
            interactPair1: ["light", "dark"],
            interactPair2word: "wet",
            interactAnswer: "dry",
            interactOptions: ["dry", "damp", "water", "rain", "warm"],
            interactCorrectAnswer: "dry",
            interactExplanation: "Light and dark are opposites. Wet and dry are opposites. Both pairs follow the antonym pattern. ✓"
          },
          {
            name: "Oliver",
            scenario: "solving word pair puzzles",
            pair1: ["happy", "glad"],
            pair2word: "angry",
            answer: "furious",
            relationship: "synonym (same meaning) pairs",
            analogy: "happy is to glad as angry is to furious",
            whyItWorks: "Happy means the same as glad, just as angry means the same as furious",
            pairType: "synonyms",
            options: ["furious", "sad", "upset", "cross", "mean"],
            correctAnswer: "furious",
            explanation: "Happy and glad are synonyms (same meaning). Angry and furious are synonyms. The analogy links pairs that share a meaning. ✓",
            interactPair1: ["brave", "courageous"],
            interactPair2word: "scared",
            interactAnswer: "frightened",
            interactOptions: ["frightened", "nervous", "worried", "shy", "anxious"],
            interactCorrectAnswer: "frightened",
            interactExplanation: "Brave and courageous are synonyms. Scared and frightened are synonyms. Both pairs link words with the same meaning. ✓"
          },
          {
            name: "Priya",
            scenario: "figuring out tricky word relationships",
            pair1: ["fast", "slow"],
            pair2word: "bright",
            answer: "dim",
            relationship: "antonym (opposite) pairs",
            analogy: "fast is to slow as bright is to dim",
            whyItWorks: "Fast is the opposite of slow, just as bright is the opposite of dim",
            pairType: "opposites",
            options: ["dim", "dark", "light", "dull", "faint"],
            correctAnswer: "dim",
            explanation: "Fast and slow are opposites. Bright and dim are opposites. Both pairs follow the antonym pattern. ✓",
            interactPair1: ["strong", "weak"],
            interactPair2word: "heavy",
            interactAnswer: "light",
            interactOptions: ["light", "thin", "empty", "soft", "small"],
            interactCorrectAnswer: "light",
            interactExplanation: "Strong and weak are opposites. Heavy and light are opposites. Both pairs follow the antonym pattern. ✓"
          },
          {
            name: "Finn",
            scenario: "practising analogy questions",
            pair1: ["begin", "commence"],
            pair2word: "end",
            answer: "conclude",
            relationship: "synonym (same meaning) pairs",
            analogy: "begin is to commence as end is to conclude",
            whyItWorks: "Begin means the same as commence, just as end means the same as conclude",
            pairType: "synonyms",
            options: ["conclude", "finish", "stop", "close", "halt"],
            correctAnswer: "conclude",
            explanation: "Begin and commence are synonyms. End and conclude are synonyms. The pattern links words with the same meaning. ✓",
            interactPair1: ["quick", "rapid"],
            interactPair2word: "loud",
            interactAnswer: "noisy",
            interactOptions: ["noisy", "quiet", "shout", "booming", "sound"],
            interactCorrectAnswer: "noisy",
            interactExplanation: "Quick and rapid are synonyms. Loud and noisy are synonyms. Both pairs link words that mean the same thing. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.pair1[0]} is to ${v.pair1[1]} as ${v.pair2word} is to ___?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere's a neat twist: sometimes the relationship in an analogy is that the words are **${v.pairType}**! Everything you've already learned about synonyms and antonyms comes in handy here.\n\nLook at **"${v.pair1[0]}"** and **"${v.pair1[1]}"** — do they mean the same thing, or opposite things?`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                pair1: v.pair1,
                pair2word: v.pair2word,
                answer: null,
                label: "Synonyms (same) or antonyms (opposite)?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Synonym or Antonym?",
            body: (v) => `Are **"${v.pair1[0]}"** and **"${v.pair1[1]}"** synonyms (words that mean the same) or antonyms (words that mean the opposite)? Decide which, then apply the same rule to **"${v.pair2word}"**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.pair1[0]}" and "${v.pair1[1]}" are ${v.pairType}`, why: `They ${v.pairType === "synonyms" ? "mean the same thing" : "mean opposite things"}` },
                  { text: `So find the ${v.pairType === "synonyms" ? "synonym" : "antonym"} of "${v.pair2word}"`, why: "Apply the same relationship type" },
                  { text: `"${v.pair2word}" → "${v.answer}" ✓`, why: v.whyItWorks }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `"${v.pair1[0]}" and "${v.pair1[1]}" are ${v.pairType}`, answer: true, explanation: `Yes — they ${v.pairType === "synonyms" ? "mean the same thing" : "mean opposite things"}. ✓` },
                { text: `If pair 1 are ${v.pairType}, pair 2 can be anything`, answer: false, explanation: `No — pair 2 must follow the SAME relationship. Both pairs must be ${v.pairType}.` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.interactPair1[0]}** is to **${v.interactPair1[1]}** as **${v.interactPair2word}** is to ___?`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                pair1: v.interactPair1,
                pair2word: v.interactPair2word,
                answer: null,
                relationship: v.relationship,
                label: "Complete the analogy:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactPair1[0]} is to ${v.interactPair1[1]} as ${v.interactPair2word} is to ___?`,
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
            title: () => "Synonym & Antonym analogies — two birds, one stone!",
            body: () => `Well done! You've just connected two different skills together. When the relationship IS about word meaning:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Check: are the first pair synonyms or antonyms?", why: "happy/glad = synonyms, hot/cold = antonyms" },
                  { text: "2. Apply the SAME relationship to the second pair", why: "If pair 1 are opposites, pair 2 must be opposites too" },
                  { text: "3. Watch out for CLOSE but not exact matches", why: "angry → furious (synonym), NOT angry → sad (different emotion) ✓" }
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
  // SUB-CONCEPT 6: Animal to Home
  // Category: supporting
  // ==========================================
  {
    id: "animal-home",
    name: "Animal to Home",
    category: "supporting",
    lessons: [
      {
        id: "animal-home-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot 'animal to its home' analogies — did you know an otter's home is called a holt?",
          "How to apply the pattern: animal is to its home as animal is to its home (there are some brilliant ones to learn!)"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "matching animals to where they live",
            pair1: ["bird", "nest"],
            pair2word: "rabbit",
            answer: "burrow",
            relationship: "animal to home",
            analogy: "bird is to nest as rabbit is to burrow",
            whyItWorks: "A bird lives in a nest, just as a rabbit lives in a burrow",
            options: ["burrow", "hutch", "hole", "warren", "field"],
            correctAnswer: "burrow",
            explanation: "A bird's home is a nest. A rabbit's home is a burrow. Both pairs link an animal to its natural home. ✓",
            interactPair1: ["squirrel", "drey"],
            interactPair2word: "otter",
            interactAnswer: "holt",
            interactOptions: ["holt", "den", "burrow", "river", "lodge"],
            interactCorrectAnswer: "holt",
            interactExplanation: "A squirrel lives in a drey. An otter lives in a holt. Both pairs link an animal to its specific home. ✓"
          },
          {
            name: "Marcus",
            scenario: "solving animal analogy puzzles",
            pair1: ["bee", "hive"],
            pair2word: "fox",
            answer: "den",
            relationship: "animal to home",
            analogy: "bee is to hive as fox is to den",
            whyItWorks: "A bee lives in a hive, just as a fox lives in a den",
            options: ["den", "hole", "wood", "burrow", "kennel"],
            correctAnswer: "den",
            explanation: "A bee's home is a hive. A fox's home is a den. The relationship is animal → its natural dwelling. ✓",
            interactPair1: ["dog", "kennel"],
            interactPair2word: "eagle",
            interactAnswer: "eyrie",
            interactOptions: ["eyrie", "nest", "sky", "cliff", "tree"],
            interactCorrectAnswer: "eyrie",
            interactExplanation: "A dog lives in a kennel. An eagle lives in an eyrie. Both pairs link an animal to its specific home. ✓"
          },
          {
            name: "Aisha",
            scenario: "working through word pair connections",
            pair1: ["horse", "stable"],
            pair2word: "pig",
            answer: "sty",
            relationship: "animal to home",
            analogy: "horse is to stable as pig is to sty",
            whyItWorks: "A horse is kept in a stable, just as a pig is kept in a sty",
            options: ["sty", "barn", "pen", "farm", "mud"],
            correctAnswer: "sty",
            explanation: "A horse lives in a stable. A pig lives in a sty. Both pairs link a farm animal to its specific enclosure. ✓",
            interactPair1: ["lion", "den"],
            interactPair2word: "badger",
            interactAnswer: "sett",
            interactOptions: ["sett", "burrow", "hole", "den", "warren"],
            interactCorrectAnswer: "sett",
            interactExplanation: "A lion lives in a den. A badger lives in a sett. Both pairs link an animal to its natural dwelling. ✓"
          },
          {
            name: "Charlie",
            scenario: "tackling tricky animal analogies",
            pair1: ["spider", "web"],
            pair2word: "beaver",
            answer: "lodge",
            relationship: "animal to home",
            analogy: "spider is to web as beaver is to lodge",
            whyItWorks: "A spider builds and lives in a web, just as a beaver builds and lives in a lodge",
            options: ["lodge", "dam", "river", "pond", "nest"],
            correctAnswer: "lodge",
            explanation: "A spider's home is a web. A beaver's home is a lodge. Both animals build their own homes! A dam is what a beaver builds across a river, but it lives in the lodge. ✓",
            interactPair1: ["mouse", "hole"],
            interactPair2word: "mole",
            interactAnswer: "tunnel",
            interactOptions: ["tunnel", "burrow", "hill", "hole", "earth"],
            interactCorrectAnswer: "tunnel",
            interactExplanation: "A mouse lives in a hole. A mole lives in a tunnel underground. Both pairs link an animal to where it makes its home. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.pair1[0]} is to ${v.pair1[1]} as ${v.pair2word} is to ___?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nDid you know that lots of animals have special names for their homes? A **"${v.pair1[0]}"** lives in a **"${v.pair1[1]}"**. So what does a **"${v.pair2word}"** live in?\n\nThis is the **animal-to-home** pattern — a really popular one in the 11+!`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                pair1: v.pair1,
                pair2word: v.pair2word,
                answer: null,
                label: "Where does the second animal live?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Animal → Home",
            body: (v) => `A **${v.pair1[0]}** lives in a **${v.pair1[1]}**. This pattern links an **animal** to its **home or dwelling**. So where does a **${v.pair2word}** live?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `A "${v.pair1[0]}" lives in a "${v.pair1[1]}"`, why: "First pair: animal → its home" },
                  { text: `So a "${v.pair2word}" lives in a ___?`, why: "What is this animal's home called?" },
                  { text: `A "${v.pair2word}" lives in a "${v.answer}" ✓`, why: v.whyItWorks }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Spot the relationship: "${v.pair1[0]}" lives in a "${v.pair1[1]}"`,
                `Apply it to the new word: where does a "${v.pair2word}" live?`,
                `Pick the specific home: "${v.answer}"`
              ],
              feedback: {
                correct: (v) => `Perfect! Spot the animal-to-home link, then apply it. ✓`,
                incorrect: (v) => `Not quite — first spot how pair 1 connects, then apply the same pattern.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.interactPair1[0]}** is to **${v.interactPair1[1]}** as **${v.interactPair2word}** is to ___?`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                pair1: v.interactPair1,
                pair2word: v.interactPair2word,
                answer: null,
                relationship: v.relationship,
                label: "Complete the analogy:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactPair1[0]} is to ${v.interactPair1[1]} as ${v.interactPair2word} is to ___?`,
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
            title: () => "Animal → Home pattern — brilliant!",
            body: () => `Well done! These animal homes are great to have in your back pocket for the exam. Learn the tricky ones and you'll be ahead of the pack:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "bird → nest, bee → hive, spider → web", why: "Common ones you probably know" },
                  { text: "rabbit → burrow, fox → den, horse → stable", why: "Farm and countryside animals" },
                  { text: "beaver → lodge, pig → sty, otter → holt", why: "Trickier ones that catch people out ✓" }
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
  // SUB-CONCEPT 7: Category — Specific Example
  // Category: other
  // ==========================================
  {
    id: "category-specific",
    name: "Category to Example",
    category: "other",
    lessons: [
      {
        id: "category-specific-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot 'example to category' analogies — where one thing is a type of something bigger",
          "How to apply the pattern: example is to category as example is to category (think sorting things into groups!)"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "working on grouping word puzzles",
            pair1: ["rose", "flower"],
            pair2word: "Mars",
            answer: "planet",
            relationship: "example to category",
            analogy: "rose is to flower as Mars is to planet",
            whyItWorks: "A rose is a type of flower, just as Mars is a type of planet",
            options: ["planet", "star", "galaxy", "moon", "space"],
            correctAnswer: "planet",
            explanation: "A rose is an example of a flower. Mars is an example of a planet. Both pairs link a specific thing to the group it belongs to. ✓",
            interactPair1: ["violin", "instrument"],
            interactPair2word: "eagle",
            interactAnswer: "bird",
            interactOptions: ["bird", "animal", "predator", "wing", "sky"],
            interactCorrectAnswer: "bird",
            interactExplanation: "A violin is a type of instrument. An eagle is a type of bird. Both pairs link a specific example to its category. ✓"
          },
          {
            name: "Oliver",
            scenario: "solving category-based analogies",
            pair1: ["guitar", "instrument"],
            pair2word: "football",
            answer: "sport",
            relationship: "example to category",
            analogy: "guitar is to instrument as football is to sport",
            whyItWorks: "A guitar is a type of instrument, just as football is a type of sport",
            options: ["sport", "game", "team", "ball", "exercise"],
            correctAnswer: "sport",
            explanation: "A guitar is a type of instrument. Football is a type of sport. Both link a specific example to its broader category. ✓",
            interactPair1: ["apple", "fruit"],
            interactPair2word: "carrot",
            interactAnswer: "vegetable",
            interactOptions: ["vegetable", "food", "plant", "root", "garden"],
            interactCorrectAnswer: "vegetable",
            interactExplanation: "An apple is a type of fruit. A carrot is a type of vegetable. Both pairs link a specific example to the group it belongs to. ✓"
          },
          {
            name: "Priya",
            scenario: "practising word classification analogies",
            pair1: ["oak", "tree"],
            pair2word: "salmon",
            answer: "fish",
            relationship: "example to category",
            analogy: "oak is to tree as salmon is to fish",
            whyItWorks: "An oak is a type of tree, just as a salmon is a type of fish",
            options: ["fish", "river", "food", "animal", "sea"],
            correctAnswer: "fish",
            explanation: "An oak is a type of tree. A salmon is a type of fish. The relationship is: specific example → its category. ✓",
            interactPair1: ["ruby", "gemstone"],
            interactPair2word: "Spanish",
            interactAnswer: "language",
            interactOptions: ["language", "country", "subject", "accent", "Europe"],
            interactCorrectAnswer: "language",
            interactExplanation: "A ruby is a type of gemstone. Spanish is a type of language. Both pairs link a specific example to its category. ✓"
          },
          {
            name: "Finn",
            scenario: "cracking category analogy questions",
            pair1: ["diamond", "gemstone"],
            pair2word: "French",
            answer: "language",
            relationship: "example to category",
            analogy: "diamond is to gemstone as French is to language",
            whyItWorks: "A diamond is a type of gemstone, just as French is a type of language",
            options: ["language", "country", "accent", "subject", "Europe"],
            correctAnswer: "language",
            explanation: "A diamond is one type of gemstone. French is one type of language. Both link a specific example to the group it belongs to. ✓",
            interactPair1: ["hammer", "tool"],
            interactPair2word: "daisy",
            interactAnswer: "flower",
            interactOptions: ["flower", "plant", "weed", "garden", "petal"],
            interactCorrectAnswer: "flower",
            interactExplanation: "A hammer is a type of tool. A daisy is a type of flower. Both pairs link a specific example to the group it belongs to. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.pair1[0]} is to ${v.pair1[1]} as ${v.pair2word} is to ___?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere's one you'll get the hang of quickly! Is **"${v.pair1[0]}"** a type of **"${v.pair1[1]}"**? If the first word is a **specific example** and the second is its **category**, you've spotted the pattern!`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                pair1: v.pair1,
                pair2word: v.pair2word,
                answer: null,
                label: "What category does it belong to?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Example → Category",
            body: (v) => `A **${v.pair1[0]}** is a type of **${v.pair1[1]}**. In this pattern, the first word is a **specific example** and the second is the **group or category** it belongs to. So what group does **${v.pair2word}** belong to?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.pair1[0]}" is a type of "${v.pair1[1]}"`, why: "First pair: example → category" },
                  { text: `So "${v.pair2word}" is a type of ___?`, why: "What group does this belong to?" },
                  { text: `"${v.pair2word}" is a type of "${v.answer}" ✓`, why: v.whyItWorks }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.interactPair1[0]}** is to **${v.interactPair1[1]}** as **${v.interactPair2word}** is to ___?`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                pair1: v.interactPair1,
                pair2word: v.interactPair2word,
                answer: null,
                relationship: v.relationship,
                label: "Complete the analogy:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactPair1[0]} is to ${v.interactPair1[1]} as ${v.interactPair2word} is to ___?`,
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
            title: () => "Example → Category pattern — spot on!",
            body: () => `Another pattern in the bag! When you spot an example-to-category analogy:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Ask: is the first word a TYPE OF the second?", why: "rose → flower, guitar → instrument, oak → tree" },
                  { text: "2. If yes, find the CATEGORY that the third word belongs to", why: "Mars is a type of planet, not a type of star" },
                  { text: "3. Pick the most precise category, not too broad", why: "Salmon → fish (not 'animal' — too vague) ✓" }
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
  // SUB-CONCEPT 8: Creator to Creation
  // Category: other
  // ==========================================
  {
    id: "creator-creation",
    name: "Creator to Creation",
    category: "other",
    lessons: [
      {
        id: "creator-creation-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot 'creator to creation' analogies — who makes what? Think about people and the things they create!",
          "How to apply the pattern: creator is to creation as creator is to creation"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "puzzling over who makes what",
            pair1: ["author", "book"],
            pair2word: "composer",
            answer: "symphony",
            relationship: "creator to creation",
            analogy: "author is to book as composer is to symphony",
            whyItWorks: "An author creates a book, just as a composer creates a symphony",
            options: ["symphony", "music", "orchestra", "piano", "song"],
            correctAnswer: "symphony",
            explanation: "An author creates books. A composer creates symphonies. Both pairs link the creator to what they produce. ✓",
            interactPair1: ["chef", "meal"],
            interactPair2word: "photographer",
            interactAnswer: "photograph",
            interactOptions: ["photograph", "camera", "studio", "film", "portrait"],
            interactCorrectAnswer: "photograph",
            interactExplanation: "A chef creates a meal. A photographer creates a photograph. Both pairs link the maker to what they produce. ✓"
          },
          {
            name: "Marcus",
            scenario: "solving creator-based word puzzles",
            pair1: ["architect", "building"],
            pair2word: "sculptor",
            answer: "statue",
            relationship: "creator to creation",
            analogy: "architect is to building as sculptor is to statue",
            whyItWorks: "An architect designs buildings, just as a sculptor creates statues",
            options: ["statue", "marble", "museum", "art", "chisel"],
            correctAnswer: "statue",
            explanation: "An architect creates buildings. A sculptor creates statues. The relationship is: maker → what they make. ✓",
            interactPair1: ["director", "film"],
            interactPair2word: "painter",
            interactAnswer: "painting",
            interactOptions: ["painting", "brush", "canvas", "gallery", "colour"],
            interactCorrectAnswer: "painting",
            interactExplanation: "A director creates a film. A painter creates a painting. Both pairs link the creator to their creation. ✓"
          },
          {
            name: "Aisha",
            scenario: "working on who-creates-what analogies",
            pair1: ["poet", "poem"],
            pair2word: "playwright",
            answer: "play",
            relationship: "creator to creation",
            analogy: "poet is to poem as playwright is to play",
            whyItWorks: "A poet writes poems, just as a playwright writes plays",
            options: ["play", "theatre", "actor", "script", "stage"],
            correctAnswer: "play",
            explanation: "A poet creates poems. A playwright creates plays. Both pairs link a writer to the type of work they write. ✓"
          },
          {
            name: "Charlie",
            scenario: "tackling a tricky maker-and-creation question",
            pair1: ["baker", "bread"],
            pair2word: "carpenter",
            answer: "furniture",
            relationship: "creator to creation",
            analogy: "baker is to bread as carpenter is to furniture",
            whyItWorks: "A baker makes bread, just as a carpenter makes furniture",
            options: ["furniture", "wood", "hammer", "house", "workshop"],
            correctAnswer: "furniture",
            explanation: "A baker makes bread. A carpenter makes furniture. Both pairs link a craftsperson to what they produce. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.pair1[0]} is to ${v.pair1[1]} as ${v.pair2word} is to ___?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nThink about it: an **"${v.pair1[0]}"** creates a **"${v.pair1[1]}"** — that's their job! So what does a **"${v.pair2word}"** create?\n\nThis is the **creator-to-creation** pattern — matching people to the things they make. It's like a fun jobs quiz!`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                pair1: v.pair1,
                pair2word: v.pair2word,
                answer: null,
                label: "What does the creator make?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Creator → Creation",
            body: (v) => `An **${v.pair1[0]}** creates a **${v.pair1[1]}**. In this pattern, the first word is a **person who makes things** and the second is **what they make**. So what does a **${v.pair2word}** create?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `An "${v.pair1[0]}" creates a "${v.pair1[1]}"`, why: "First pair: maker → product" },
                  { text: `So a "${v.pair2word}" creates a ___?`, why: "What does this person make or produce?" },
                  { text: `A "${v.pair2word}" creates a "${v.answer}" ✓`, why: v.whyItWorks }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.pair1[0]}** is to **${v.pair1[1]}** as **${v.pair2word}** is to ___?`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                pair1: v.pair1,
                pair2word: v.pair2word,
                answer: null,
                relationship: v.relationship,
                label: "Complete the analogy:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.pair1[0]} is to ${v.pair1[1]} as ${v.pair2word} is to ___?`,
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
            title: () => "Creator → Creation pattern — well done!",
            body: () => `Fantastic! You've now got a whole collection of analogy patterns. When you spot a creator-to-creation connection:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Ask: does the first person MAKE the second thing?", why: "author → book, baker → bread, poet → poem" },
                  { text: "2. If yes, find what the third person MAKES", why: "composer → symphony, sculptor → statue" },
                  { text: "3. Pick the specific product, not the material or workplace", why: "Carpenter → furniture (not 'wood' or 'workshop') ✓" }
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

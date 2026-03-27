// ============================================================
// Supplementary sub-concepts for Odd Two Out (Verbal Reasoning)
// To merge: add these to lessonBank.oddTwoOut.subConcepts array in lessonData.js
// ============================================================

export const oddTwoOutSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: Concrete Categories
  // Category: core
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "concrete-categories",
    name: "Concrete Categories",
    category: "core",
    lessons: [
      {
        id: "concrete-categories-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot obvious category groups like animals, fruits, colours, and sports — you'll get a feel for this really quickly!",
          "How to find the 3-and-2 split where three words share a group and the other two are the odd ones out"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "sorting five words into groups",
            words: ["apple", "carrot", "banana", "grape", "potato"],
            group3: ["apple", "banana", "grape"],
            group3Label: "fruits",
            oddPair: ["carrot", "potato"],
            oddPairLabel: "vegetables",
            options: ["apple & carrot", "carrot & potato", "banana & grape", "apple & potato", "grape & carrot"],
            correctAnswer: "carrot & potato",
            explanation: "Apple, banana, and grape are all fruits. Carrot and potato are vegetables — they don't belong with the fruit group. ✓"
          },
          {
            name: "Oliver",
            scenario: "finding the odd two out in a word list",
            words: ["tennis", "chess", "badminton", "draughts", "squash"],
            group3: ["tennis", "badminton", "squash"],
            group3Label: "racquet sports",
            oddPair: ["chess", "draughts"],
            oddPairLabel: "board games",
            options: ["tennis & chess", "chess & draughts", "badminton & squash", "tennis & draughts", "squash & chess"],
            correctAnswer: "chess & draughts",
            explanation: "Tennis, badminton, and squash are all racquet sports. Chess and draughts are board games, so they are the odd two out. ✓"
          },
          {
            name: "Priya",
            scenario: "working through her VR practice paper",
            words: ["red", "triangle", "blue", "green", "square"],
            group3: ["red", "blue", "green"],
            group3Label: "colours",
            oddPair: ["triangle", "square"],
            oddPairLabel: "shapes",
            options: ["red & triangle", "triangle & square", "blue & green", "red & square", "green & triangle"],
            correctAnswer: "triangle & square",
            explanation: "Red, blue, and green are all colours. Triangle and square are shapes — they don't belong in the colour group. ✓"
          },
          {
            name: "Finn",
            scenario: "tackling an odd-two-out puzzle",
            words: ["violin", "crayon", "trumpet", "flute", "paintbrush"],
            group3: ["violin", "trumpet", "flute"],
            group3Label: "musical instruments",
            oddPair: ["crayon", "paintbrush"],
            oddPairLabel: "art supplies",
            options: ["violin & crayon", "crayon & paintbrush", "trumpet & flute", "violin & paintbrush", "flute & crayon"],
            correctAnswer: "crayon & paintbrush",
            explanation: "Violin, trumpet, and flute are all musical instruments. Crayon and paintbrush are art supplies, so they are the odd two out. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Which two don't belong?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere are five words — have a look:\n**${v.words.join("  •  ")}**\n\nThree of these belong together. The other two don't fit. Can you spot which two are the odd ones out? Trust your instincts!`,
            visual: {
              component: "WordChipsDisplay",
              props: (v) => ({
                words: v.words,
                highlighted: v.words,
                label: "Study these five words:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Find the group of 3",
            body: (v) => `Look at **${v.words.join(", ")}**. Here's the clever bit: don't hunt for the two odd ones. Instead, find the **three** words that connect — once you spot the group of 3, the odd pair reveals itself like magic!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Look at: ${v.words.join(", ")}`, why: "Scan all five words" },
                  { text: `Group of 3: ${v.group3.join(", ")} → all ${v.group3Label}`, why: "These three share a clear category" },
                  { text: `Odd two: ${v.oddPair.join(" & ")} → both ${v.oddPairLabel}`, why: "These don't fit the main group ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `In Odd Two Out, you need to find the group of ____ words that share a category`,
              options: (v) => ["3", "2", "4", "5"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Find the 3 that connect, and the leftover 2 are the odd ones out. ✓`,
                incorrect: (v) => `Not quite — you're looking for the group of 3 that share a category!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: () => `Which two words are the odd ones out?`,
            visual: {
              component: "WordChipsDisplay",
              props: (v) => ({
                words: v.words,
                label: "Find the 3 that share a category"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which pair are the odd two out?`,
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
            title: () => "Concrete categories — you've got this!",
            body: () => `Nice work! Here's your recipe for obvious category splits — keep it simple:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Read all five words", why: "Don't jump at the first pair you see" },
                  { text: "2. Ask: what category do 3 of these share?", why: "Fruits? Animals? Colours? Sports?" },
                  { text: "3. The leftover 2 are the odd ones out", why: "They don't fit the main group ✓" }
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
  // SUB-CONCEPT 2: Abstract Categories
  // Category: core
  // ==========================================
  {
    id: "abstract-categories",
    name: "Abstract Categories",
    category: "core",
    lessons: [
      {
        id: "abstract-categories-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot less obvious groups like emotions, qualities, and weather types — these are the ones that trip people up!",
          "Why abstract categories need a bit more digging than simple ones (and why that makes them more satisfying to crack)"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "puzzling over a tricky word set",
            words: ["serene", "furious", "tranquil", "placid", "irate"],
            group3: ["serene", "tranquil", "placid"],
            group3Label: "words meaning calm and peaceful",
            oddPair: ["furious", "irate"],
            oddPairLabel: "words meaning very angry",
            options: ["serene & furious", "furious & irate", "tranquil & placid", "serene & irate", "placid & furious"],
            correctAnswer: "furious & irate",
            explanation: "Serene, tranquil, and placid all mean calm and peaceful. Furious and irate both mean very angry — they are the odd two out. ✓"
          },
          {
            name: "Marcus",
            scenario: "working on an abstract word group",
            words: ["bravery", "envy", "courage", "valour", "jealousy"],
            group3: ["bravery", "courage", "valour"],
            group3Label: "words meaning being brave",
            oddPair: ["envy", "jealousy"],
            oddPairLabel: "words about wanting what others have",
            options: ["bravery & envy", "envy & jealousy", "courage & valour", "bravery & jealousy", "valour & envy"],
            correctAnswer: "envy & jealousy",
            explanation: "Bravery, courage, and valour all mean being brave in the face of danger. Envy and jealousy both mean wanting what someone else has — they are the odd two out. ✓"
          },
          {
            name: "Aisha",
            scenario: "sorting abstract qualities",
            words: ["honesty", "greed", "integrity", "selfishness", "truthfulness"],
            group3: ["honesty", "integrity", "truthfulness"],
            group3Label: "words about being honest",
            oddPair: ["greed", "selfishness"],
            oddPairLabel: "words about putting yourself first",
            options: ["honesty & greed", "greed & selfishness", "integrity & truthfulness", "honesty & selfishness", "truthfulness & greed"],
            correctAnswer: "greed & selfishness",
            explanation: "Honesty, integrity, and truthfulness are all about being honest and genuine. Greed and selfishness are about putting yourself first — they are the odd two out. ✓"
          },
          {
            name: "Charlie",
            scenario: "figuring out a concept-based word group",
            words: ["blizzard", "drought", "hurricane", "tornado", "famine"],
            group3: ["blizzard", "hurricane", "tornado"],
            group3Label: "severe weather events",
            oddPair: ["drought", "famine"],
            oddPairLabel: "long-term shortages (not storms)",
            options: ["blizzard & drought", "drought & famine", "hurricane & tornado", "blizzard & famine", "tornado & drought"],
            correctAnswer: "drought & famine",
            explanation: "Blizzard, hurricane, and tornado are all severe weather storms. Drought and famine are long-lasting shortages (of water and food) — they are the odd two out. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `These words are trickier to group...`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.words.join("  •  ")}**\n\nThese aren't simple categories like "fruits" or "animals" — they're trickier! But that's what makes them interesting. You need to think about what each word actually **means** and how they **relate** to each other.`,
            visual: {
              component: "WordChipsDisplay",
              props: (v) => ({
                words: v.words,
                highlighted: v.words,
                label: "Study these five words:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Think about meaning, not appearance",
            body: (v) => `Look at **${v.words.join(", ")}** — these are abstract (idea) words. Ask yourself: **what does each word describe?** Group by meaning, not by how they look or sound.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Think: what does each word mean?`, why: "Define each word in your head" },
                  { text: `Group of 3: ${v.group3.join(", ")}`, why: `All ${v.group3Label}` },
                  { text: `Odd two: ${v.oddPair.join(" & ")}`, why: `Both ${v.oddPairLabel} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: () => `Which two words are the odd ones out?`,
            visual: {
              component: "WordChipsDisplay",
              props: (v) => ({
                words: v.words,
                label: "Group by meaning, not by appearance"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which pair are the odd two out?`,
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
            title: () => "Abstract categories — you can do these!",
            body: () => `Well done for digging deeper! When the category isn't obvious, here's your go-to plan:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Define each word in your head", why: "What does it actually mean?" },
                  { text: "2. Look for 3 words with a shared meaning", why: "Emotions? Qualities? Types of event?" },
                  { text: "3. Check the leftover 2 also share something", why: "If both leftovers connect, you've found the split ✓" }
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
  // SUB-CONCEPT 3: Function Categories
  // Category: core
  // ==========================================
  {
    id: "function-categories",
    name: "Function Categories",
    category: "core",
    lessons: [
      {
        id: "function-categories-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to group words by what things DO rather than what they ARE — this is a really clever way to think!",
          "Why asking 'what is this used for?' can reveal hidden connections that aren't obvious at first"
        ],
        variableSets: [
          {
            name: "Ruby",
            scenario: "grouping words by their purpose",
            words: ["bucket", "hammer", "jug", "vase", "spanner"],
            group3: ["bucket", "jug", "vase"],
            group3Label: "containers that hold things",
            oddPair: ["hammer", "spanner"],
            oddPairLabel: "tools for fixing and building",
            options: ["bucket & hammer", "hammer & spanner", "jug & vase", "bucket & spanner", "vase & hammer"],
            correctAnswer: "hammer & spanner",
            explanation: "Bucket, jug, and vase are all containers — they hold things inside them. Hammer and spanner are tools you use to fix or build, so they are the odd two out. ✓"
          },
          {
            name: "Hamza",
            scenario: "sorting words by what they do",
            words: ["car", "telescope", "lorry", "microscope", "bus"],
            group3: ["car", "lorry", "bus"],
            group3Label: "vehicles that transport people or goods",
            oddPair: ["telescope", "microscope"],
            oddPairLabel: "instruments for seeing things you can't normally see",
            options: ["car & telescope", "telescope & microscope", "lorry & bus", "car & microscope", "bus & telescope"],
            correctAnswer: "telescope & microscope",
            explanation: "Car, lorry, and bus are all vehicles — they transport people or goods. Telescope and microscope are instruments for looking at things more closely, so they are the odd two out. ✓"
          },
          {
            name: "Ella",
            scenario: "thinking about what things are used for",
            words: ["thermometer", "oven", "toaster", "barometer", "microwave"],
            group3: ["oven", "toaster", "microwave"],
            group3Label: "appliances that heat food",
            oddPair: ["thermometer", "barometer"],
            oddPairLabel: "instruments that measure conditions",
            options: ["thermometer & oven", "thermometer & barometer", "toaster & microwave", "oven & barometer", "microwave & thermometer"],
            correctAnswer: "thermometer & barometer",
            explanation: "Oven, toaster, and microwave all heat food. Thermometer and barometer are measuring instruments (temperature and air pressure), so they are the odd two out. ✓"
          },
          {
            name: "Kai",
            scenario: "working out how words connect by function",
            words: ["anchor", "saddle", "rudder", "sail", "bridle"],
            group3: ["anchor", "rudder", "sail"],
            group3Label: "parts of a boat",
            oddPair: ["saddle", "bridle"],
            oddPairLabel: "equipment for riding a horse",
            options: ["anchor & saddle", "saddle & bridle", "rudder & sail", "anchor & bridle", "sail & saddle"],
            correctAnswer: "saddle & bridle",
            explanation: "Anchor, rudder, and sail are all parts of a boat. Saddle and bridle are both equipment used for riding a horse, so they are the odd two out. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What do these things DO?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.words.join("  •  ")}**\n\nHere's a sneaky twist: sometimes the connection isn't about what things ARE — it's about what they're **used for**. Imagine picking each thing up. What would you DO with it?`,
            visual: {
              component: "WordChipsDisplay",
              props: (v) => ({
                words: v.words,
                highlighted: v.words,
                label: "Study these five words:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Group by purpose",
            body: (v) => `Look at **${v.words.join(", ")}**. Ask yourself: **"What is each thing used for?"** Things with the same purpose belong together, even if they look completely different.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Ask "what does each thing do?"`, why: "Think about function, not appearance" },
                  { text: `Group of 3: ${v.group3.join(", ")}`, why: `All ${v.group3Label}` },
                  { text: `Odd two: ${v.oddPair.join(" & ")}`, why: `Both ${v.oddPairLabel} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Read all five words`,
                `Ask: what is each thing USED FOR?`,
                `Find 3 things with the same job`,
                `The leftover 2 are the odd ones out`
              ],
              feedback: {
                correct: (v) => `Perfect! Group by purpose, not appearance. ✓`,
                incorrect: (v) => `Not quite — start by reading all words, then think about each one's purpose.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: () => `Which two words are the odd ones out?`,
            visual: {
              component: "WordChipsDisplay",
              props: (v) => ({
                words: v.words,
                label: "Think about what each is USED FOR"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which pair are the odd two out?`,
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
            title: () => "Function categories — smart thinking!",
            body: () => `Brilliant! You've just learned to look beyond what things ARE and think about what they DO. When things look different but share a purpose:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Ask: what is each thing USED FOR?", why: "Holding? Cutting? Measuring? Moving?" },
                  { text: "2. Find 3 things with the same job", why: "Containers? Vehicles? Instruments?" },
                  { text: "3. The other 2 share a different purpose", why: "Different job = odd ones out ✓" }
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
  // SUB-CONCEPT 4: Material Categories
  // Category: supporting
  // ==========================================
  {
    id: "material-categories",
    name: "Material Categories",
    category: "supporting",
    lessons: [
      {
        id: "material-categories-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to group words by what things are made of: metals, fabrics, woods",
          "Why material-based categories are a common 11+ trick"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "spotting material-based groups",
            words: ["iron", "cotton", "steel", "bronze", "silk"],
            group3: ["iron", "steel", "bronze"],
            group3Label: "metals",
            oddPair: ["cotton", "silk"],
            oddPairLabel: "fabrics",
            options: ["iron & cotton", "cotton & silk", "steel & bronze", "iron & silk", "bronze & cotton"],
            correctAnswer: "cotton & silk",
            explanation: "Iron, steel, and bronze are all metals. Cotton and silk are fabrics — they are the odd two out. ✓"
          },
          {
            name: "Marcus",
            scenario: "sorting words by material type",
            words: ["oak", "granite", "willow", "marble", "pine"],
            group3: ["oak", "willow", "pine"],
            group3Label: "types of wood (trees)",
            oddPair: ["granite", "marble"],
            oddPairLabel: "types of stone",
            options: ["oak & granite", "granite & marble", "willow & pine", "oak & marble", "pine & granite"],
            correctAnswer: "granite & marble",
            explanation: "Oak, willow, and pine are all types of wood (trees). Granite and marble are types of stone, so they are the odd two out. ✓"
          },
          {
            name: "Aisha",
            scenario: "figuring out a material-based split",
            words: ["porcelain", "denim", "china", "ceramic", "tweed"],
            group3: ["porcelain", "china", "ceramic"],
            group3Label: "materials made from fired clay",
            oddPair: ["denim", "tweed"],
            oddPairLabel: "types of woven fabric",
            options: ["porcelain & denim", "denim & tweed", "china & ceramic", "porcelain & tweed", "ceramic & denim"],
            correctAnswer: "denim & tweed",
            explanation: "Porcelain, china, and ceramic are all made from fired clay. Denim and tweed are both types of woven fabric, so they are the odd two out. ✓"
          },
          {
            name: "Charlie",
            scenario: "working on a materials puzzle",
            words: ["copper", "leather", "aluminium", "tin", "suede"],
            group3: ["copper", "aluminium", "tin"],
            group3Label: "metals",
            oddPair: ["leather", "suede"],
            oddPairLabel: "materials made from animal skin",
            options: ["copper & leather", "leather & suede", "aluminium & tin", "copper & suede", "tin & leather"],
            correctAnswer: "leather & suede",
            explanation: "Copper, aluminium, and tin are all metals. Leather and suede are both made from animal skin, so they are the odd two out. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What are these things made of?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.words.join("  •  ")}**\n\nDid you know that material groups pop up all the time in the 11+? Things like metal, wood, stone, and fabric. The question is: **what are these things made of?**`,
            visual: {
              component: "WordChipsDisplay",
              props: (v) => ({
                words: v.words,
                highlighted: v.words,
                label: "Study these five words:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Group by material type",
            body: (v) => `Look at **${v.words.join(", ")}**. Ask: **"What is each thing made of?"** or **"What type of material is this?"** Three will share a material type, two won't.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `What type of material is each word?`, why: "Metal? Wood? Fabric? Stone?" },
                  { text: `Group of 3: ${v.group3.join(", ")}`, why: `All ${v.group3Label}` },
                  { text: `Odd two: ${v.oddPair.join(" & ")}`, why: `Both ${v.oddPairLabel} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "iron", right: "metal" },
                { left: "cotton", right: "fabric" },
                { left: "oak", right: "wood" },
                { left: "granite", right: "stone" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: () => `Which two words are the odd ones out?`,
            visual: {
              component: "WordChipsDisplay",
              props: (v) => ({
                words: v.words,
                label: "Group by MATERIAL TYPE"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which pair are the odd two out?`,
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
            title: () => "Material categories — handy knowledge!",
            body: () => `Great work! Knowing your material groups gives you a real advantage. Here are the common ones that come up in the 11+:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Metals: iron, steel, bronze, copper, tin, aluminium", why: "Hard, shiny, mined from the ground" },
                  { text: "Woods: oak, pine, willow, beech, ash, mahogany", why: "Come from trees" },
                  { text: "Fabrics: cotton, silk, denim, wool, tweed, linen", why: "Woven or knitted materials ✓" }
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
  // SUB-CONCEPT 5: Category Within Category
  // Category: supporting
  // ==========================================
  {
    id: "category-within-category",
    name: "Category Within Category",
    category: "supporting",
    lessons: [
      {
        id: "category-within-category-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot sub-category tricks: all 5 words seem to belong, but only 3 share a tighter group — this is a favourite 11+ trick!",
          "Why the obvious big category is actually a trap, and how to zoom in on the smaller sub-group"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "facing a tricky sub-category question",
            words: ["eagle", "sparrow", "bat", "penguin", "robin"],
            bigCategory: "flying creatures",
            group3: ["eagle", "sparrow", "robin"],
            group3Label: "common flying birds",
            oddPair: ["bat", "penguin"],
            oddPairLabel: "not typical flying birds (bat is a mammal, penguin can't fly)",
            options: ["eagle & sparrow", "bat & penguin", "sparrow & robin", "eagle & bat", "robin & penguin"],
            correctAnswer: "bat & penguin",
            explanation: "Eagle, sparrow, and robin are all common flying birds. Bat is a mammal (not a bird at all), and penguin is a bird that can't fly. Both are odd ones out. ✓"
          },
          {
            name: "Oliver",
            scenario: "working on a sub-category puzzle",
            words: ["salmon", "cod", "crab", "mackerel", "lobster"],
            bigCategory: "sea creatures",
            group3: ["salmon", "cod", "mackerel"],
            group3Label: "fish",
            oddPair: ["crab", "lobster"],
            oddPairLabel: "shellfish (crustaceans)",
            options: ["salmon & crab", "crab & lobster", "cod & mackerel", "salmon & lobster", "mackerel & crab"],
            correctAnswer: "crab & lobster",
            explanation: "Salmon, cod, and mackerel are all fish. Crab and lobster are crustaceans (shellfish) — they all live in the sea, but the tighter group is 'fish'. ✓"
          },
          {
            name: "Priya",
            scenario: "spotting the sub-category trap",
            words: ["daisy", "rose", "oak", "tulip", "beech"],
            bigCategory: "plants",
            group3: ["daisy", "rose", "tulip"],
            group3Label: "flowers",
            oddPair: ["oak", "beech"],
            oddPairLabel: "trees",
            options: ["daisy & oak", "oak & beech", "rose & tulip", "daisy & beech", "tulip & oak"],
            correctAnswer: "oak & beech",
            explanation: "Daisy, rose, and tulip are all flowers. Oak and beech are trees. They're all plants, but the sub-categories are flowers vs trees. ✓"
          },
          {
            name: "Finn",
            scenario: "navigating a sub-group trick",
            words: ["guitar", "violin", "drum", "cello", "tambourine"],
            bigCategory: "musical instruments",
            group3: ["guitar", "violin", "cello"],
            group3Label: "stringed instruments",
            oddPair: ["drum", "tambourine"],
            oddPairLabel: "percussion instruments (you hit them)",
            options: ["guitar & drum", "drum & tambourine", "violin & cello", "guitar & tambourine", "cello & drum"],
            correctAnswer: "drum & tambourine",
            explanation: "Guitar, violin, and cello are all stringed instruments. Drum and tambourine are percussion instruments (you hit them). All are musical instruments, but the sub-group is the key. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `They ALL seem to belong...`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.words.join("  •  ")}**\n\nAt first glance, all five look like they belong together — they're all ${v.bigCategory}! But here's where it gets interesting. Look closer, and you'll see that three of them share a **tighter** group within the bigger category.`,
            visual: {
              component: "WordChipsDisplay",
              props: (v) => ({
                words: v.words,
                highlighted: v.words,
                label: "Study these five words:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Find the tighter sub-group",
            body: (v) => `All five words — **${v.words.join(", ")}** — are ${v.bigCategory}. But don't stop at the big category! Ask: **"Can I split these further?"** The sub-group of 3 is the real answer.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Big category: all ${v.bigCategory}`, why: "This is the TRAP — too broad!" },
                  { text: `Tighter group of 3: ${v.group3.join(", ")}`, why: `All ${v.group3Label}` },
                  { text: `Odd two: ${v.oddPair.join(" & ")}`, why: `${v.oddPairLabel} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `All five are ${v.bigCategory} — but which two are the odd ones out?`,
            visual: {
              component: "WordChipsDisplay",
              props: (v) => ({
                words: v.words,
                label: "Find the tighter sub-group of 3"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which pair are the odd two out?`,
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
            title: () => "Sub-category trick — now you know!",
            body: () => `Excellent detective work! When all 5 words seem to fit one group, that's your signal to dig deeper:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. If all 5 fit one big category, that's the TRAP", why: "The question always has 2 odd ones out!" },
                  { text: "2. Split the big category into smaller groups", why: "Fish vs shellfish? Flowers vs trees? Strings vs percussion?" },
                  { text: "3. The group of 3 is the tighter sub-category", why: "The other 2 belong to a different sub-group ✓" }
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
  // SUB-CONCEPT 6: Look For Three
  // Category: supporting
  // ==========================================
  {
    id: "look-for-three",
    name: "Look For Three",
    category: "supporting",
    lessons: [
      {
        id: "look-for-three-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find the 3 that CONNECT rather than hunting for the 2 that are odd — this changes everything!",
          "Why starting with the group of 3 is faster, more reliable, and way less stressful"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "learning the best strategy for odd-two-out",
            words: ["fork", "saucepan", "knife", "spoon", "frying pan"],
            wrongApproach: "Looking at 'saucepan' and thinking it's odd because it's big",
            group3: ["fork", "knife", "spoon"],
            group3Label: "cutlery",
            oddPair: ["saucepan", "frying pan"],
            oddPairLabel: "cooking pans",
            options: ["fork & saucepan", "saucepan & frying pan", "knife & spoon", "fork & frying pan", "spoon & saucepan"],
            correctAnswer: "saucepan & frying pan",
            explanation: "Fork, knife, and spoon are all cutlery (things you eat with). Saucepan and frying pan are cooking pans — they are the odd two out. ✓"
          },
          {
            name: "Marcus",
            scenario: "practising the 'find the three' technique",
            words: ["metre", "kilogram", "centimetre", "mile", "tonne"],
            wrongApproach: "Thinking 'mile' is odd because it's not metric",
            group3: ["metre", "centimetre", "mile"],
            group3Label: "units of length",
            oddPair: ["kilogram", "tonne"],
            oddPairLabel: "units of weight",
            options: ["metre & kilogram", "kilogram & tonne", "centimetre & mile", "metre & tonne", "mile & kilogram"],
            correctAnswer: "kilogram & tonne",
            explanation: "Metre, centimetre, and mile all measure length (distance). Kilogram and tonne measure weight — they are the odd two out. ✓"
          },
          {
            name: "Aisha",
            scenario: "using the three-first method",
            words: ["biography", "tragedy", "autobiography", "comedy", "encyclopedia"],
            wrongApproach: "Thinking 'encyclopedia' is odd because it's long",
            group3: ["biography", "autobiography", "encyclopedia"],
            group3Label: "types of non-fiction writing",
            oddPair: ["tragedy", "comedy"],
            oddPairLabel: "types of drama/play",
            options: ["biography & tragedy", "tragedy & comedy", "autobiography & encyclopedia", "biography & comedy", "encyclopedia & tragedy"],
            correctAnswer: "tragedy & comedy",
            explanation: "Biography, autobiography, and encyclopedia are all non-fiction reference works. Tragedy and comedy are types of drama — they are the odd two out. ✓"
          },
          {
            name: "Charlie",
            scenario: "applying the three-first strategy",
            words: ["goldfish", "hamster", "rabbit", "trout", "guinea pig"],
            wrongApproach: "Focusing on 'goldfish' because it lives in water",
            group3: ["hamster", "rabbit", "guinea pig"],
            group3Label: "furry pets you can hold",
            oddPair: ["goldfish", "trout"],
            oddPairLabel: "fish",
            options: ["goldfish & hamster", "goldfish & trout", "hamster & rabbit", "rabbit & trout", "guinea pig & goldfish"],
            correctAnswer: "goldfish & trout",
            explanation: "Hamster, rabbit, and guinea pig are all small furry pets. Goldfish and trout are both fish — they are the odd two out. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Don't hunt for the odd ones — find the THREE!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.words.join("  •  ")}**\n\nHere's a game-changer: most people try to spot the 2 "weird" words, but that's actually the hard way round! It's much easier to find the **3 that connect** — then the other 2 are automatically the odd ones out. Let's try it!`,
            visual: {
              component: "WordChipsDisplay",
              props: (v) => ({
                words: v.words,
                highlighted: v.words,
                label: "Study these five words:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The 'Find Three' method",
            body: (v) => `Let's try it with **${v.words.join(", ")}**.\n\nStep 1: Scan all 5 words.\nStep 2: Find 3 that share a clear category.\nStep 3: The leftover 2 are your answer.\n\nThis is faster and more reliable than trying to spot oddness!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Scan: ${v.words.join(", ")}`, why: "Read all five — don't rush" },
                  { text: `Three that connect: ${v.group3.join(", ")}`, why: `All ${v.group3Label}` },
                  { text: `Leftover two: ${v.oddPair.join(" & ")}`, why: `Both ${v.oddPairLabel} — done! ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "fork", right: "cutlery" },
                { left: "saucepan", right: "cooking pan" },
                { left: "metre", right: "length" },
                { left: "kilogram", right: "weight" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn — find the three!",
            body: () => `Find the 3 that connect — the other 2 are the odd ones out.`,
            visual: {
              component: "WordChipsDisplay",
              props: (v) => ({
                words: v.words,
                label: "Which 3 share a category?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which pair are the odd two out?`,
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
            title: () => "Find Three — the golden rule",
            body: () => `You've just learned the fastest strategy for Odd Two Out questions. This will save you loads of time in the exam:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "DON'T hunt for 2 odd words", why: "That's slow and unreliable" },
                  { text: "DO find the 3 that share a category", why: "Once you spot the 3, the 2 are obvious" },
                  { text: "Check: do the leftover 2 also share something?", why: "If yes, you've definitely got it right ✓" }
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
  // SUB-CONCEPT 7: Hard Vocabulary
  // Category: other
  // ==========================================
  {
    id: "hard-vocabulary",
    name: "Hard Vocabulary",
    category: "other",
    lessons: [
      {
        id: "hard-vocabulary-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to handle odd-two-out when the words look scary: literary, scientific, and musical terms",
          "Why knowing a few key vocabulary sets gives you a massive advantage (you'll recognise more than you think!)"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "facing advanced vocabulary in her VR paper",
            words: ["simile", "adjective", "metaphor", "personification", "adverb"],
            group3: ["simile", "metaphor", "personification"],
            group3Label: "figures of speech (literary techniques)",
            oddPair: ["adjective", "adverb"],
            oddPairLabel: "word classes (parts of speech)",
            hint: "Think about which words you might use in an English lesson about writing techniques.",
            options: ["simile & adjective", "adjective & adverb", "metaphor & personification", "simile & adverb", "personification & adjective"],
            correctAnswer: "adjective & adverb",
            explanation: "Simile, metaphor, and personification are all figures of speech (literary devices). Adjective and adverb are word classes — they are the odd two out. ✓"
          },
          {
            name: "Oliver",
            scenario: "tackling scientific words",
            words: ["radius", "volume", "diameter", "circumference", "capacity"],
            group3: ["radius", "diameter", "circumference"],
            group3Label: "measurements of a circle",
            oddPair: ["volume", "capacity"],
            oddPairLabel: "measurements of 3D space",
            hint: "Think about which of these words you would use when measuring a circle.",
            options: ["radius & volume", "volume & capacity", "diameter & circumference", "radius & capacity", "circumference & volume"],
            correctAnswer: "volume & capacity",
            explanation: "Radius, diameter, and circumference are all circle measurements. Volume and capacity both measure 3D space — they are the odd two out. ✓"
          },
          {
            name: "Priya",
            scenario: "decoding musical terms",
            words: ["allegro", "soprano", "presto", "alto", "andante"],
            group3: ["allegro", "presto", "andante"],
            group3Label: "tempo markings (speed of music)",
            oddPair: ["soprano", "alto"],
            oddPairLabel: "vocal ranges (types of singing voice)",
            hint: "Some of these words describe how fast music is played. The others describe something different about music.",
            options: ["allegro & soprano", "soprano & alto", "presto & andante", "allegro & alto", "andante & soprano"],
            correctAnswer: "soprano & alto",
            explanation: "Allegro, presto, and andante are all tempo markings (how fast to play music). Soprano and alto are singing voice types — they are the odd two out. ✓"
          },
          {
            name: "Finn",
            scenario: "handling advanced word sets",
            words: ["democracy", "sonnet", "republic", "monarchy", "limerick"],
            group3: ["democracy", "republic", "monarchy"],
            group3Label: "types of government",
            oddPair: ["sonnet", "limerick"],
            oddPairLabel: "types of poem",
            hint: "Think about which words describe how a country is run.",
            options: ["democracy & sonnet", "sonnet & limerick", "republic & monarchy", "democracy & limerick", "monarchy & sonnet"],
            correctAnswer: "sonnet & limerick",
            explanation: "Democracy, republic, and monarchy are all types of government. Sonnet and limerick are types of poem — they are the odd two out. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Don't panic — use what you know!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.words.join("  •  ")}**\n\nSome of these words might look a bit scary at first. But here's the thing — you probably know more of them than you think! Even recognising **one** grouping can unlock the whole answer.`,
            visual: {
              component: "WordChipsDisplay",
              props: (v) => ({
                words: v.words,
                highlighted: v.words,
                label: "Study these five words:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Use what you DO know",
            body: (v) => `Look at **${v.words.join(", ")}**. You don't need to know every word — if you can spot **2 or 3 words** from the same subject area, you can work out the grouping.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Spot any words you recognise as a group`, why: "Even 2 from the same subject is enough to start" },
                  { text: `Group of 3: ${v.group3.join(", ")}`, why: `All ${v.group3Label}` },
                  { text: `Odd two: ${v.oddPair.join(" & ")}`, why: `Both ${v.oddPairLabel} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which two words are the odd ones out?\n\nHint: ${v.hint}`,
            visual: {
              component: "WordChipsDisplay",
              props: (v) => ({
                words: v.words,
                label: "Use words you recognise to find the group"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which pair are the odd two out?`,
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
            title: () => "Hard vocabulary — don't panic, you've got this!",
            body: () => `Brilliant effort! When words look scary, just remember: you don't need to know every single word. Here's your plan:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Find any words you DO recognise", why: "You probably know at least 2-3 of them" },
                  { text: "2. Group those known words — what subject are they from?", why: "Science? English? Music? Geography?" },
                  { text: "3. The unfamiliar words often belong to the OTHER group", why: "Your known words reveal the split ✓" }
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
  // SUB-CONCEPT 8: Red Herring Words
  // Category: other
  // ==========================================
  {
    id: "red-herring-words",
    name: "Red Herring Words",
    category: "other",
    lessons: [
      {
        id: "red-herring-words-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to avoid being tricked by words that LOOK like they belong together but actually don't — the 11+ loves this trick!",
          "Why your first instinct can sometimes lead you astray, and how to double-check before committing"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "spotting a clever trap in a word puzzle",
            words: ["sand", "shore", "tide", "wave", "dune"],
            surfaceTrap: "You might think sand, shore, and dune go together (all 'beachy' things)",
            group3: ["shore", "tide", "wave"],
            group3Label: "things to do with the sea and water movement",
            oddPair: ["sand", "dune"],
            oddPairLabel: "things made of sand (land features, not water)",
            options: ["sand & shore", "sand & dune", "tide & wave", "shore & dune", "wave & sand"],
            correctAnswer: "sand & dune",
            explanation: "Shore, tide, and wave are all connected to the sea and water movement. Sand and dune are both land features made of sand — they look 'beachy' but aren't about water. ✓"
          },
          {
            name: "Marcus",
            scenario: "avoiding a surface-level trap",
            words: ["king", "castle", "bishop", "pawn", "palace"],
            surfaceTrap: "You might think king, castle, and palace go together (all 'royal' things)",
            group3: ["king", "castle", "bishop", "pawn"],
            group3Label: "chess pieces",
            oddPair: ["castle", "palace"],
            oddPairLabel: "Wait — let's re-think! King, bishop, and pawn are chess pieces. Castle is ALSO a chess piece (the rook). Palace is a building.",
            group3Fixed: ["king", "bishop", "pawn"],
            group3LabelFixed: "chess pieces (that aren't also buildings)",
            oddPairFixed: ["castle", "palace"],
            oddPairLabelFixed: "words that name buildings (but 'castle' is also a chess piece — tricky!)",
            options: ["king & castle", "castle & palace", "bishop & pawn", "king & palace", "pawn & castle"],
            correctAnswer: "castle & palace",
            explanation: "King, bishop, and pawn are all chess pieces only. Castle and palace are both types of grand building — even though 'castle' is also a chess piece, the BEST grouping here is by the building meaning. ✓"
          },
          {
            name: "Aisha",
            scenario: "not falling for an obvious-looking group",
            words: ["spring", "coil", "summer", "autumn", "spiral"],
            surfaceTrap: "You might think spring, coil, and spiral go together (all 'twisty' things)",
            group3: ["spring", "summer", "autumn"],
            group3Label: "seasons of the year",
            oddPair: ["coil", "spiral"],
            oddPairLabel: "curved/twisted shapes",
            options: ["spring & coil", "coil & spiral", "summer & autumn", "spring & spiral", "autumn & coil"],
            correctAnswer: "coil & spiral",
            explanation: "Spring, summer, and autumn are all seasons. Coil and spiral are both curved/twisted shapes. 'Spring' is a red herring — it can mean a coiled shape, but here it's a season! ✓"
          },
          {
            name: "Charlie",
            scenario: "resisting a tempting but wrong grouping",
            words: ["pupil", "teacher", "eye", "head", "iris"],
            surfaceTrap: "You might think pupil, teacher, and head go together (all 'school' words)",
            group3: ["pupil", "eye", "iris"],
            group3Label: "parts of the eye",
            oddPair: ["teacher", "head"],
            oddPairLabel: "school staff (teacher and headteacher)",
            options: ["pupil & teacher", "teacher & head", "eye & iris", "pupil & head", "iris & teacher"],
            correctAnswer: "teacher & head",
            explanation: "Pupil, eye, and iris are all parts of the eye. Teacher and head (headteacher) are both school staff. 'Pupil' and 'head' are red herrings — they have school meanings too, but the EYE grouping is the correct 3. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Watch out — this one's sneaky!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.words.join("  •  ")}**\n\n${v.surfaceTrap}. But is that really the best grouping? Sometimes the most obvious connection is a **red herring** — a deliberate trap designed to catch you out! Let's see if you can spot the real split.`,
            visual: {
              component: "WordChipsDisplay",
              props: (v) => ({
                words: v.words,
                highlighted: v.words,
                label: "Study these five words:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Test EVERY possible grouping",
            body: (v) => `With **${v.words.join(", ")}**, don't lock onto the first connection you see. Try different groupings and pick the one where **all 3 clearly belong** and the **2 leftovers also connect**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `First thought might be wrong — test it!`, why: v.surfaceTrap },
                  { text: `Better group of 3: ${v.group3.join(", ")}`, why: `All ${v.group3Label}` },
                  { text: `Odd two: ${v.oddPair.join(" & ")}`, why: `Both ${v.oddPairLabel} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `The first grouping you spot is always the correct one`, answer: false, explanation: `No — the obvious grouping is often a red herring! Always test other splits too.` },
                { text: `Both the group of 3 AND the leftover 2 should share a connection`, answer: true, explanation: `Yes — if the 2 leftovers also connect, you know you've found the right split. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn — don't fall for the trap!",
            body: () => `Which two words are the odd ones out? Be careful — one grouping is a trap!`,
            visual: {
              component: "WordChipsDisplay",
              props: (v) => ({
                words: v.words,
                label: "Test every grouping — the obvious one might be wrong!"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which pair are the odd two out?`,
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
            title: () => "Red herrings — you won't fall for these!",
            body: () => `Superb! Now you know about red herrings, you're much harder to trick. Watch out for words with double meanings — they're the biggest traps:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Don't jump at the first grouping you see", why: "The obvious connection might be the trap" },
                  { text: "2. Check: do the 2 leftovers also share something?", why: "If the leftovers DON'T connect, try a different split" },
                  { text: "3. Words with 2 meanings (pupil, spring, castle) are common traps", why: "Always consider BOTH meanings of a word ✓" }
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

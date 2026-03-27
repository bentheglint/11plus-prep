// ============================================================
// Supplementary sub-concepts for Logic & Language (Verbal Reasoning)
// To merge: add these to lessonBank.logicAndLanguage.subConcepts array in lessonData.js
// ============================================================

export const logicAndLanguageSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: Three-Person Ordering
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "three-person-ordering",
    name: "Ordering 3 People",
    category: "core",
    lessons: [
      {
        id: "three-person-ordering-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to put 3 people in order using clues — like solving a mini detective puzzle!",
          "How to use the Think It Through method: read, draw, answer"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "working out who is tallest in her group",
            clues: ["Daisy is taller than Evie.", "Evie is taller than Freya."],
            question: "Who is the shortest?",
            people: ["Daisy", "Evie", "Freya"],
            correctOrder: ["Daisy", "Evie", "Freya"],
            diagram: "Tallest → Daisy → Evie → Freya → Shortest",
            options: ["Daisy", "Evie", "Freya", "Daisy and Freya", "Cannot tell"],
            correctAnswer: "Freya",
            explanation: "Daisy > Evie > Freya in height. Freya is at the bottom of the order, so she is the shortest. ✓",
            interactClues: ["Sophie is taller than Liam.", "Liam is taller than Ruby."],
            interactQuestion: "Who is the tallest?",
            interactOptions: ["Sophie", "Liam", "Ruby", "Sophie and Liam", "Cannot tell"],
            interactCorrectAnswer: "Sophie",
            interactExplanation: "Sophie > Liam > Ruby in height. Sophie is at the top of the order, so she is the tallest. ✓"
          },
          {
            name: "Ben",
            scenario: "figuring out ages for a birthday card",
            clues: ["Marcus is older than Priya.", "Priya is older than Oliver."],
            question: "Who is the oldest?",
            people: ["Marcus", "Priya", "Oliver"],
            correctOrder: ["Marcus", "Priya", "Oliver"],
            diagram: "Oldest → Marcus → Priya → Oliver → Youngest",
            options: ["Marcus", "Priya", "Oliver", "Priya and Oliver", "Cannot tell"],
            correctAnswer: "Marcus",
            explanation: "Marcus > Priya > Oliver in age. Marcus is at the top of the order, so he is the oldest. ✓",
            interactClues: ["Bella is younger than Noah.", "Noah is younger than Isla."],
            interactQuestion: "Who is the youngest?",
            interactOptions: ["Bella", "Noah", "Isla", "Noah and Isla", "Cannot tell"],
            interactCorrectAnswer: "Bella",
            interactExplanation: "Isla > Noah > Bella in age. Bella is at the bottom of the order, so she is the youngest. ✓"
          },
          {
            name: "Charlie",
            scenario: "comparing running speeds on sports day",
            clues: ["Zara runs faster than Hugo.", "Hugo runs faster than Kai."],
            question: "Who is the slowest runner?",
            people: ["Zara", "Hugo", "Kai"],
            correctOrder: ["Zara", "Hugo", "Kai"],
            diagram: "Fastest → Zara → Hugo → Kai → Slowest",
            options: ["Zara", "Hugo", "Kai", "Zara and Kai", "Cannot tell"],
            correctAnswer: "Kai",
            explanation: "Zara > Hugo > Kai in speed. Kai is at the bottom, so he is the slowest runner. ✓",
            interactClues: ["Maisie swims faster than George.", "George swims faster than Lily."],
            interactQuestion: "Who is the fastest swimmer?",
            interactOptions: ["Maisie", "George", "Lily", "George and Lily", "Cannot tell"],
            interactCorrectAnswer: "Maisie",
            interactExplanation: "Maisie > George > Lily in swimming speed. Maisie is at the top, so she is the fastest swimmer. ✓"
          },
          {
            name: "Daisy",
            scenario: "sorting out who has the most stickers",
            clues: ["Finn has more stickers than Amara.", "Amara has more stickers than Toby."],
            question: "Who has the fewest stickers?",
            people: ["Finn", "Amara", "Toby"],
            correctOrder: ["Finn", "Amara", "Toby"],
            diagram: "Most → Finn → Amara → Toby → Fewest",
            options: ["Finn", "Amara", "Toby", "Finn and Toby", "Cannot tell"],
            correctAnswer: "Toby",
            explanation: "Finn > Amara > Toby in number of stickers. Toby is at the bottom, so he has the fewest. ✓",
            interactClues: ["Rosie has more books than Jake.", "Jake has more books than Ella."],
            interactQuestion: "Who has the most books?",
            interactOptions: ["Rosie", "Jake", "Ella", "Jake and Ella", "Cannot tell"],
            interactCorrectAnswer: "Rosie",
            interactExplanation: "Rosie > Jake > Ella in number of books. Rosie is at the top, so she has the most books. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you crack the order?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere are your clues:\n${v.clues.map(c => `• ${c}`).join('\n')}\n\n**${v.question}**\n\nWith 3 people, all you need to do is put them in a line from top to bottom. Let's figure it out!`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `${v.name} is ${v.scenario}.\n\nHere are your clues:\n${v.clues.map(c => `• ${c}`).join('\n')}\n\n**${v.question}**\n\nWith 3 people, all you need to do is put them in a line from top to bottom. Let's figure it out!`
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: null,
                    clues: v.clues
                })
              }
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "Find the link name",
            body: (v) => `The secret to ordering is finding the **link name** — the person who appears in BOTH clues. They go in the middle!`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `The secret to ordering is finding the **link name** — the person who appears in BOTH clues. They go in the middle!`
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                    steps: [
                      { text: `Clue 1: ${v.clues[0]}`, why: `Two names here: ${v.correctOrder[0]} and ${v.correctOrder[1]}` },
                      { text: `Clue 2: ${v.clues[1]}`, why: `Two names here: ${v.correctOrder[1]} and ${v.correctOrder[2]}` },
                      { text: `Link name: ${v.correctOrder[1]}`, why: `${v.correctOrder[1]} appears in BOTH clues — so ${v.correctOrder[1]} goes in the MIDDLE` },
                      { text: `Build the chain around the link`, why: `${v.correctOrder[0]} is above ${v.correctOrder[1]}, and ${v.correctOrder[2]} is below — done!` },
                      { text: `${v.question}`, why: `Read the diagram → **${v.correctAnswer}** ✓` }
                    ],
                    allRevealed: false
                })
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: v.correctAnswer,
                    clues: v.clues
                })
              }
            ],
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Read ALL the clues before you start`,
                `Draw the names in order from top to bottom`,
                `Answer the question by reading off your diagram`
              ],
              feedback: {
                correct: (v) => `Perfect! Read, draw, answer — the Think It Through method. ✓`,
                incorrect: (v) => `Not quite — always read ALL clues first, then draw, then answer!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Use the 3 steps: **Read all clues → Draw the order → Answer from your diagram**\n\n${v.interactClues.map(c => `• ${c}`).join('\n')}`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
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
            title: () => "3-person ordering — nailed it!",
            body: (v) => `You've cracked the method for ordering 3 people:`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `You've cracked the method for ordering 3 people:`
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: v.correctAnswer,
                    clues: v.clues
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                    steps: [
                      { text: "1. Read ALL clues first", why: "Every clue matters — don't skip any!" },
                      { text: "2. Draw a line: top (most) → bottom (least)", why: "Write the names in order on a line" },
                      { text: "3. Read off the answer", why: "Tallest is at the top, shortest at the bottom ✓" }
                    ],
                    allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      },
      {
        id: "three-person-ordering-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid the sneaky trap of reading clues backwards",
          "Why 'A is taller than B' always means A goes ABOVE B — not the other way round!"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "checking her practice test answers",
            clues: ["Ivy is taller than Grace.", "Grace is taller than Holly."],
            question: "Who is the tallest?",
            people: ["Ivy", "Grace", "Holly"],
            correctOrder: ["Ivy", "Grace", "Holly"],
            diagram: "Tallest → Ivy → Grace → Holly → Shortest",
            friendWrong: "Holly",
            friendReason: "because Holly was mentioned last, so she must be tallest",
            whyWrong: "Being mentioned last doesn't mean tallest! You need to read what the clues actually say.",
            options: ["Ivy", "Grace", "Holly", "Grace and Holly", "Cannot tell"],
            correctAnswer: "Ivy",
            explanation: "Ivy > Grace > Holly. Ivy is at the top, so she is the tallest. The order the names appear doesn't matter — the clue words do! ✓",
            interactClues: ["Lottie is heavier than Max.", "Max is heavier than Ava."],
            interactQuestion: "Who is the lightest?",
            interactOptions: ["Lottie", "Max", "Ava", "Lottie and Ava", "Cannot tell"],
            interactCorrectAnswer: "Ava",
            interactExplanation: "Lottie > Max > Ava in weight. Ava is at the bottom, so she is the lightest. ✓"
          },
          {
            name: "Marcus",
            scenario: "reviewing his VR homework",
            clues: ["Leo is faster than Ravi.", "Ravi is faster than Sam."],
            question: "Who is the fastest?",
            people: ["Leo", "Ravi", "Sam"],
            correctOrder: ["Leo", "Ravi", "Sam"],
            diagram: "Fastest → Leo → Ravi → Sam → Slowest",
            friendWrong: "Sam",
            friendReason: "because Sam is at the end so must be fastest",
            whyWrong: "Sam is at the end because he's the SLOWEST, not the fastest! Read the clue words carefully.",
            options: ["Leo", "Ravi", "Sam", "Leo and Sam", "Cannot tell"],
            correctAnswer: "Leo",
            explanation: "Leo > Ravi > Sam in speed. Leo is at the top — he is the fastest. ✓",
            interactClues: ["Poppy has more coins than Archie.", "Archie has more coins than Millie."],
            interactQuestion: "Who has the most coins?",
            interactOptions: ["Poppy", "Archie", "Millie", "Archie and Millie", "Cannot tell"],
            interactCorrectAnswer: "Poppy",
            interactExplanation: "Poppy > Archie > Millie in number of coins. Poppy is at the top, so she has the most coins. ✓"
          },
          {
            name: "Priya",
            scenario: "helping her friend correct a logic puzzle",
            clues: ["Zara has more sweets than Nadia.", "Nadia has more sweets than Ella."],
            question: "Who has the most sweets?",
            people: ["Zara", "Nadia", "Ella"],
            correctOrder: ["Zara", "Nadia", "Ella"],
            diagram: "Most → Zara → Nadia → Ella → Fewest",
            friendWrong: "Ella",
            friendReason: "because the clues keep saying 'more than' and Ella is the final name",
            whyWrong: "'More than' points UPWARD — the name BEFORE 'more than' goes higher. Ella is at the bottom!",
            options: ["Zara", "Nadia", "Ella", "Nadia and Ella", "Cannot tell"],
            correctAnswer: "Zara",
            explanation: "Zara > Nadia > Ella. Zara has the most sweets. The first name in 'A has more than B' always goes ABOVE B. ✓",
            interactClues: ["Theo is taller than Harriet.", "Harriet is taller than Will."],
            interactQuestion: "Who is the shortest?",
            interactOptions: ["Theo", "Harriet", "Will", "Theo and Will", "Cannot tell"],
            interactCorrectAnswer: "Will",
            interactExplanation: "Theo > Harriet > Will in height. Will is at the bottom, so he is the shortest. ✓"
          },
          {
            name: "Oliver",
            scenario: "going over a mock test with his mum",
            clues: ["Kai is older than Freya.", "Freya is older than Toby."],
            question: "Who is the youngest?",
            people: ["Kai", "Freya", "Toby"],
            correctOrder: ["Kai", "Freya", "Toby"],
            diagram: "Oldest → Kai → Freya → Toby → Youngest",
            friendWrong: "Kai",
            friendReason: "because Kai is first so must be youngest",
            whyWrong: "Kai is first because he is the OLDEST! 'Older than' means Kai goes ABOVE Freya.",
            options: ["Kai", "Freya", "Toby", "Kai and Toby", "Cannot tell"],
            correctAnswer: "Toby",
            explanation: "Kai > Freya > Toby in age. Toby is at the bottom, so he is the youngest. ✓",
            interactClues: ["Charlotte runs faster than Ethan.", "Ethan runs faster than Anika."],
            interactQuestion: "Who is the fastest runner?",
            interactOptions: ["Charlotte", "Ethan", "Anika", "Ethan and Anika", "Cannot tell"],
            interactCorrectAnswer: "Charlotte",
            interactExplanation: "Charlotte > Ethan > Anika in speed. Charlotte is at the top, so she is the fastest runner. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is "${v.friendWrong}" really the answer?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nClues:\n${v.clues.map(c => `• ${c}`).join('\n')}\n\n**${v.question}**\n\nSomeone answered **"${v.friendWrong}"** — ${v.friendReason}.\n\nBut is that right?`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `${v.name} is ${v.scenario}.\n\nClues:\n${v.clues.map(c => `• ${c}`).join('\n')}\n\n**${v.question}**\n\nSomeone answered **"${v.friendWrong}"** — ${v.friendReason}.\n\nBut is that right?`
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: null,
                    clues: v.clues
                })
              }
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "Read the clue words!",
            body: (v) => `${v.whyWrong}\n\nThe position a name appears in the sentence does NOT tell you its position in the order. You must read the **clue words** — "taller than", "older than", "more than".`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `${v.whyWrong}\n\nThe position a name appears in the sentence does NOT tell you its position in the order. You must read the **clue words** — "taller than", "older than", "more than".`
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: v.correctAnswer,
                    clues: v.clues
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                    steps: [
                      { text: `Clues: ${v.clues.join(' ')}`, why: "Read what the clue WORDS say" },
                      { text: `Draw it: ${v.diagram}`, why: "The clue words tell you who goes where" },
                      { text: `"${v.friendWrong}" is WRONG — the answer is ${v.correctAnswer}`, why: v.whyWrong }
                    ],
                    allRevealed: true
                })
              }
            ],
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `The name mentioned first in a clue is always the tallest or oldest`, answer: false, explanation: `No! "A is taller than B" means A is above B — but if a clue says "shorter than", the first name goes BELOW.` },
                { text: `You should always draw a diagram before answering an ordering question`, answer: true, explanation: `Correct! Drawing the order stops you from guessing or misreading the clues. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn — get it right!",
            body: (v) => `${v.interactClues.map(c => `• ${c}`).join('\n')}\n\n**${v.interactQuestion}**`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
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
            title: () => "You won't get caught out now!",
            body: (v) => `Now you know the trap, you'll dodge it every time:`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `Now you know the trap, you'll dodge it every time:`
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: v.correctAnswer,
                    clues: v.clues
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                    steps: [
                      { text: "The ORDER names appear doesn't matter", why: "Don't assume first = top or last = bottom" },
                      { text: "Read the CLUE WORDS carefully", why: "'Taller than' means the first name goes ABOVE" },
                      { text: "Always DRAW the order before answering", why: "Your diagram shows the truth ✓" }
                    ],
                    allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 2: Four-Person Ordering
  // Category: core
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "four-person-ordering",
    name: "Ordering 4 People",
    category: "core",
    lessons: [
      {
        id: "four-person-ordering-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to order 4 people — same method, just one more clue to work with!",
          "How to spot the 'link name' that connects two clues into one chain"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "sorting four runners by speed",
            clues: ["Hugo is faster than Priya.", "Toby is faster than Hugo.", "Priya is faster than Kai."],
            question: "Who came third in the race?",
            people: ["Hugo", "Priya", "Toby", "Kai"],
            correctOrder: ["Toby", "Hugo", "Priya", "Kai"],
            diagram: "Fastest → Toby → Hugo → Priya → Kai → Slowest",
            options: ["Toby", "Hugo", "Priya", "Kai", "Cannot tell"],
            correctAnswer: "Priya",
            explanation: "Toby > Hugo > Priya > Kai. First: Toby, second: Hugo, third: Priya, fourth: Kai. Priya came third. ✓",
            interactClues: ["Mia is taller than Alfie.", "Alfie is taller than Chloe.", "Luca is taller than Mia."],
            interactQuestion: "Who is the shortest?",
            interactOptions: ["Luca", "Mia", "Alfie", "Chloe", "Cannot tell"],
            interactCorrectAnswer: "Chloe",
            interactExplanation: "Luca > Mia > Alfie > Chloe. Chloe is at the bottom, so she is the shortest. ✓"
          },
          {
            name: "Ben",
            scenario: "ordering children by height",
            clues: ["Evie is taller than Daisy.", "Charlie is taller than Evie.", "Daisy is taller than Freya."],
            question: "Who is the second tallest?",
            people: ["Evie", "Daisy", "Charlie", "Freya"],
            correctOrder: ["Charlie", "Evie", "Daisy", "Freya"],
            diagram: "Tallest → Charlie → Evie → Daisy → Freya → Shortest",
            options: ["Charlie", "Evie", "Daisy", "Freya", "Cannot tell"],
            correctAnswer: "Evie",
            explanation: "Charlie > Evie > Daisy > Freya. Charlie is tallest, Evie is second tallest. ✓",
            interactClues: ["Jasmine scored more than Tyler.", "Tyler scored more than Niamh.", "Oscar scored more than Jasmine."],
            interactQuestion: "Who scored the second most?",
            interactOptions: ["Oscar", "Jasmine", "Tyler", "Niamh", "Cannot tell"],
            interactCorrectAnswer: "Jasmine",
            interactExplanation: "Oscar > Jasmine > Tyler > Niamh. Oscar scored the most, Jasmine scored the second most. ✓"
          },
          {
            name: "Daisy",
            scenario: "working out who scored most in a maths test",
            clues: ["Zara scored higher than Marcus.", "Nadia scored higher than Zara.", "Marcus scored higher than Oliver."],
            question: "Who scored the lowest?",
            people: ["Zara", "Marcus", "Nadia", "Oliver"],
            correctOrder: ["Nadia", "Zara", "Marcus", "Oliver"],
            diagram: "Highest → Nadia → Zara → Marcus → Oliver → Lowest",
            options: ["Nadia", "Zara", "Marcus", "Oliver", "Cannot tell"],
            correctAnswer: "Oliver",
            explanation: "Nadia > Zara > Marcus > Oliver. Oliver is at the bottom, so he scored the lowest. ✓",
            interactClues: ["Layla has more stickers than Finn.", "Finn has more stickers than Sadie.", "Harry has more stickers than Layla."],
            interactQuestion: "Who has the fewest stickers?",
            interactOptions: ["Harry", "Layla", "Finn", "Sadie", "Cannot tell"],
            interactCorrectAnswer: "Sadie",
            interactExplanation: "Harry > Layla > Finn > Sadie. Sadie is at the bottom, so she has the fewest stickers. ✓"
          },
          {
            name: "Finn",
            scenario: "figuring out who has the heaviest bag",
            clues: ["Amara's bag is heavier than Ravi's.", "Ravi's bag is heavier than Ivy's.", "Grace's bag is heavier than Amara's."],
            question: "Whose bag is the second lightest?",
            people: ["Amara", "Ravi", "Ivy", "Grace"],
            correctOrder: ["Grace", "Amara", "Ravi", "Ivy"],
            diagram: "Heaviest → Grace → Amara → Ravi → Ivy → Lightest",
            options: ["Grace", "Amara", "Ravi", "Ivy", "Cannot tell"],
            correctAnswer: "Ravi",
            explanation: "Grace > Amara > Ravi > Ivy. Ivy is lightest, Ravi is second lightest. ✓",
            interactClues: ["Orla is older than Dylan.", "Dylan is older than Phoebe.", "Reuben is older than Orla."],
            interactQuestion: "Who is the second oldest?",
            interactOptions: ["Reuben", "Orla", "Dylan", "Phoebe", "Cannot tell"],
            interactCorrectAnswer: "Orla",
            interactExplanation: "Reuben > Orla > Dylan > Phoebe. Reuben is the oldest, Orla is the second oldest. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you order all 4?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nFour people means more clues — but the method is the same one you already know! The trick is to find the name that appears in TWO clues. That's your link.\n\n${v.clues.map(c => `• ${c}`).join('\n')}\n\n**${v.question}**`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `${v.name} is ${v.scenario}.\n\nFour people means more clues — but the method is the same one you already know! The trick is to find the name that appears in TWO clues. That's your link.\n\n${v.clues.map(c => `• ${c}`).join('\n')}\n\n**${v.question}**`
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: null,
                    clues: v.clues
                })
              }
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "Connect the chains",
            body: (v) => `We need to order **${v.people.join(', ')}**. With 4 people, you get 3 clues. Look for the **shared name** that links two clues together:`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `We need to order **${v.people.join(', ')}**. With 4 people, you get 3 clues. Look for the **shared name** that links two clues together:`
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: v.correctAnswer,
                    clues: v.clues
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                    steps: [
                      { text: `Clue 1: ${v.clues[0]}`, why: "Start with the first pair" },
                      { text: `Clue 2: ${v.clues[1]} — connects via shared name!`, why: "Find the name that appears in BOTH clues" },
                      { text: `Clue 3: ${v.clues[2]} — extends the chain`, why: `Full order: ${v.diagram} ✓` }
                    ],
                    allRevealed: false
                })
              }
            ],
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "3 people", right: "2 clues needed" },
                { left: "4 people", right: "3 clues needed" },
                { left: "Shared name", right: "The link that connects two clues" },
                { left: "Chain", right: "All names in order from top to bottom" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Put them in order, then answer:\n\n${v.interactClues.map(c => `• ${c}`).join('\n')}`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
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
            title: () => "4 people — same skill, bigger chain!",
            body: (v) => `Brilliant work! For 4 people, just extend your chain by one more name:`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `Brilliant work! For 4 people, just extend your chain by one more name:`
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: v.correctAnswer,
                    clues: v.clues
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                    steps: [
                      { text: "1. Read all 3 clues", why: "You need every clue to build the full chain" },
                      { text: "2. Find the SHARED NAME that links two clues", why: "This is the key to connecting the chain" },
                      { text: "3. Build one chain from top to bottom", why: "Then read off the answer ✓" }
                    ],
                    allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      },
      {
        id: "four-person-ordering-hook",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to stay cool when clues arrive in a jumbled-up order",
          "Why reading ALL clues before you start drawing is the key to getting it right"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "solving a puzzle where the clues come in a tricky order",
            clues: ["Kai is shorter than Toby.", "Freya is taller than Toby.", "Amara is shorter than Kai."],
            question: "Who is the tallest?",
            people: ["Kai", "Toby", "Freya", "Amara"],
            correctOrder: ["Freya", "Toby", "Kai", "Amara"],
            diagram: "Tallest → Freya → Toby → Kai → Amara → Shortest",
            options: ["Kai", "Toby", "Freya", "Amara", "Cannot tell"],
            correctAnswer: "Freya",
            explanation: "Freya > Toby > Kai > Amara. Freya is at the top, so she is the tallest. ✓",
            interactClues: ["Ruby runs faster than Zara.", "Zara runs faster than Isla.", "Oscar runs faster than Ruby."],
            interactQuestion: "Who is the slowest?",
            interactOptions: ["Ruby", "Zara", "Isla", "Oscar", "Cannot tell"],
            interactCorrectAnswer: "Isla",
            interactExplanation: "Oscar > Ruby > Zara > Isla. Isla is at the bottom, so she is the slowest. ✓"
          },
          {
            name: "Charlie",
            scenario: "working through a scrambled-clue puzzle",
            clues: ["Priya has fewer coins than Hugo.", "Zara has fewer coins than Priya.", "Hugo has fewer coins than Daisy."],
            question: "Who has the second most coins?",
            people: ["Priya", "Hugo", "Zara", "Daisy"],
            correctOrder: ["Daisy", "Hugo", "Priya", "Zara"],
            diagram: "Most → Daisy → Hugo → Priya → Zara → Fewest",
            options: ["Daisy", "Hugo", "Priya", "Zara", "Cannot tell"],
            correctAnswer: "Hugo",
            explanation: "Daisy > Hugo > Priya > Zara. Daisy has the most and Hugo has the second most. ✓",
            interactClues: ["Finn is taller than Lily.", "Lily is taller than Noah.", "Mia is taller than Finn."],
            interactQuestion: "Who is the shortest?",
            interactOptions: ["Finn", "Lily", "Noah", "Mia", "Cannot tell"],
            interactCorrectAnswer: "Noah",
            interactExplanation: "Mia > Finn > Lily > Noah. Noah is at the bottom, so he is the shortest. ✓"
          },
          {
            name: "Marcus",
            scenario: "tackling a 4-person ordering puzzle",
            clues: ["Nadia is younger than Oliver.", "Oliver is younger than Grace.", "Ravi is younger than Nadia."],
            question: "Who is the second youngest?",
            people: ["Nadia", "Oliver", "Grace", "Ravi"],
            correctOrder: ["Grace", "Oliver", "Nadia", "Ravi"],
            diagram: "Oldest → Grace → Oliver → Nadia → Ravi → Youngest",
            options: ["Grace", "Oliver", "Nadia", "Ravi", "Cannot tell"],
            correctAnswer: "Nadia",
            explanation: "Grace > Oliver > Nadia > Ravi. Ravi is youngest and Nadia is second youngest. ✓",
            interactClues: ["Jasper has more stickers than Bella.", "Poppy has more stickers than Jasper.", "Bella has more stickers than Theo."],
            interactQuestion: "Who has the most stickers?",
            interactOptions: ["Jasper", "Bella", "Poppy", "Theo", "Cannot tell"],
            interactCorrectAnswer: "Poppy",
            interactExplanation: "Poppy > Jasper > Bella > Theo. Poppy is at the top, so she has the most stickers. ✓"
          },
          {
            name: "Priya",
            scenario: "unscrambling the order from jumbled clues",
            clues: ["Toby's plant is shorter than Ivy's.", "Evie's plant is taller than Ivy's.", "Hugo's plant is shorter than Toby's."],
            question: "Whose plant is the second tallest?",
            people: ["Toby", "Ivy", "Evie", "Hugo"],
            correctOrder: ["Evie", "Ivy", "Toby", "Hugo"],
            diagram: "Tallest → Evie → Ivy → Toby → Hugo → Shortest",
            options: ["Evie", "Ivy", "Toby", "Hugo", "Cannot tell"],
            correctAnswer: "Ivy",
            explanation: "Evie > Ivy > Toby > Hugo. Evie's plant is tallest, Ivy's is second tallest. ✓",
            interactClues: ["Sam swims faster than Ava.", "Ava swims faster than Leo.", "Hattie swims faster than Sam."],
            interactQuestion: "Who is the second fastest swimmer?",
            interactOptions: ["Hattie", "Sam", "Ava", "Leo", "Cannot tell"],
            interactCorrectAnswer: "Sam",
            interactExplanation: "Hattie > Sam > Ava > Leo. Hattie is fastest and Sam is second fastest. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `The clues are jumbled — can you still solve it?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nSometimes the clues don't arrive in a helpful order. That's why you must read ALL clues first!\n\n${v.clues.map(c => `• ${c}`).join('\n')}\n\n**${v.question}**`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `${v.name} is ${v.scenario}.\n\nSometimes the clues don't arrive in a helpful order. That's why you must read ALL clues first!\n\n${v.clues.map(c => `• ${c}`).join('\n')}\n\n**${v.question}**`
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: null,
                    clues: v.clues
                })
              }
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "Read ALL clues first!",
            body: (v) => `We need to order **${v.people.join(', ')}** — but the clues come in a tricky order. Don't start drawing after the first clue. Read them all, THEN build the chain:`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `We need to order **${v.people.join(', ')}** — but the clues come in a tricky order. Don't start drawing after the first clue. Read them all, THEN build the chain:`
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: v.correctAnswer,
                    clues: v.clues
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                    steps: [
                      { text: `Read all clues: ${v.clues.join(' ')}`, why: "Get the full picture before you start" },
                      { text: `Find shared names and connect the chain`, why: "Look for names that appear in more than one clue" },
                      { text: `Final order: ${v.diagram}`, why: `${v.question} → ${v.correctAnswer} ✓` }
                    ],
                    allRevealed: false
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — a new puzzle!",
            body: (v) => `Read all the clues first, then build the chain:\n\n${v.interactClues.map(c => `• ${c}`).join('\n')}`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
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
            title: () => "Jumbled clues? No problem!",
            body: (v) => `Even when clues come in a confusing order, you know exactly what to do:`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `Even when clues come in a confusing order, you know exactly what to do:`
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: v.correctAnswer,
                    clues: v.clues
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                    steps: [
                      { text: "1. Read ALL clues before drawing", why: "Resist the urge to start after one clue" },
                      { text: "2. Find the shared names to connect them", why: "Two clues that share a name link together" },
                      { text: "3. Build one chain, then answer", why: "The order doesn't change just because the clues were scrambled ✓" }
                    ],
                    allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 3: True/False Statements
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "true-false-statements",
    name: "True, False or Uncertain?",
    category: "core",
    lessons: [
      {
        id: "true-false-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to decide if something is DEFINITELY true, DEFINITELY false, or just MAYBE",
          "Why three little words — 'all', 'some' and 'none' — completely change the answer"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "working through true/false logic puzzles",
            clues: ["All dogs have four legs.", "Rover is a dog."],
            question: "Does Rover have four legs?",
            people: ["Rover"],
            correctOrder: ["All dogs → four legs", "Rover = dog", "Rover → four legs"],
            diagram: "All dogs → four legs. Rover is a dog → Rover has four legs.",
            options: ["Yes, definitely", "No, definitely not", "Maybe", "Only if he's big", "Cannot tell"],
            correctAnswer: "Yes, definitely",
            explanation: "ALL dogs have four legs. Rover IS a dog. So Rover DEFINITELY has four legs. 'All' means every single one — no exceptions. ✓",
            interactClues: ["All cats have whiskers.", "Mittens is a cat."],
            interactQuestion: "Does Mittens have whiskers?",
            interactOptions: ["Yes, definitely", "No, definitely not", "Maybe", "Only if she's old", "Cannot tell"],
            interactCorrectAnswer: "Yes, definitely",
            interactExplanation: "ALL cats have whiskers. Mittens IS a cat. So Mittens DEFINITELY has whiskers. 'All' means every single one! ✓"
          },
          {
            name: "Ben",
            scenario: "deciding if statements are definitely true",
            clues: ["All birds have feathers.", "A robin is a bird."],
            question: "Does a robin have feathers?",
            people: ["Robin"],
            correctOrder: ["All birds → feathers", "Robin = bird", "Robin → feathers"],
            diagram: "All birds → feathers. Robin is a bird → Robin has feathers.",
            options: ["Yes, definitely", "No", "Only in winter", "Sometimes", "Cannot tell"],
            correctAnswer: "Yes, definitely",
            explanation: "ALL birds have feathers, and a robin IS a bird, so a robin definitely has feathers. ✓",
            interactClues: ["No reptiles have fur.", "A lizard is a reptile."],
            interactQuestion: "Does a lizard have fur?",
            interactOptions: ["Yes", "No, definitely not", "Maybe", "Only baby ones", "Cannot tell"],
            interactCorrectAnswer: "No, definitely not",
            interactExplanation: "NO reptiles have fur. A lizard IS a reptile. So a lizard DEFINITELY does not have fur. 'No' means zero — not even one. ✓"
          },
          {
            name: "Daisy",
            scenario: "spotting the difference between 'all' and 'some'",
            clues: ["Some children like maths.", "Priya is a child."],
            question: "Does Priya definitely like maths?",
            people: ["Priya"],
            correctOrder: ["Some children → like maths", "Priya = child", "Priya → might or might not like maths"],
            diagram: "SOME children → maths. Priya = child → she MIGHT like maths, or might not.",
            options: ["Yes, definitely", "No, definitely not", "Not necessarily", "Only on Mondays", "Cannot tell"],
            correctAnswer: "Not necessarily",
            explanation: "'Some' children like maths — not ALL. We know Priya is a child, but we can't be sure she's one of the ones who likes it. ✓",
            interactClues: ["Some flowers are red.", "This plant is a flower."],
            interactQuestion: "Is this flower definitely red?",
            interactOptions: ["Yes, definitely", "No, definitely not", "Not necessarily", "Only in summer", "Cannot tell"],
            interactCorrectAnswer: "Not necessarily",
            interactExplanation: "'Some' flowers are red — not ALL. This plant is a flower, but we can't be sure it's one of the red ones. ✓"
          },
          {
            name: "Charlie",
            scenario: "tackling a tricky 'none' statement",
            clues: ["No fish can walk.", "A trout is a fish."],
            question: "Can a trout walk?",
            people: ["Trout"],
            correctOrder: ["No fish → walk", "Trout = fish", "Trout → cannot walk"],
            diagram: "NO fish → walk. Trout is a fish → Trout cannot walk.",
            options: ["Yes", "No, definitely not", "Maybe", "Only on land", "Cannot tell"],
            correctAnswer: "No, definitely not",
            explanation: "NO fish can walk. A trout IS a fish. So a trout DEFINITELY cannot walk. 'No' means zero — not even one. ✓",
            interactClues: ["All trees have roots.", "An oak is a tree."],
            interactQuestion: "Does an oak have roots?",
            interactOptions: ["Yes, definitely", "No", "Maybe", "Only old oaks", "Cannot tell"],
            interactCorrectAnswer: "Yes, definitely",
            interactExplanation: "ALL trees have roots. An oak IS a tree. So an oak DEFINITELY has roots. 'All' means every single one! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is it DEFINITELY true?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nThese questions are all about spotting one tiny word that changes everything. Is something DEFINITELY true, or only MAYBE true?\n\n${v.clues.map(c => `• ${c}`).join('\n')}\n\n**${v.question}**\n\nThe secret? Watch for these key words: **all**, **some**, **none**.`,
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "All, Some, or None?",
            body: (v) => `The clues say: ${v.clues.join(' ')} — watch for the key word!\n\nThese three words change EVERYTHING:\n\n• **All** = every single one → definitely true\n• **Some** = a few → maybe true, maybe not\n• **None** = zero → definitely false`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Clues: ${v.clues.join(' ')}`, why: "Spot the key word: all, some, or none?" },
                  { text: `Logic: ${v.diagram}`, why: "Draw the logic with arrows" },
                  { text: `Answer: ${v.question} → ${v.correctAnswer}`, why: "The key word tells you if it's definite or not ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `The three key words that change the logic are: all, ____, and none`,
              options: (v) => ["some", "many", "few", "most"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! "All" = definitely true, "some" = maybe, "none" = definitely false. ✓`,
                incorrect: (v) => `Not quite — the three key words are all, some, and none!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Spot the key word, then decide:\n\n${v.interactClues.map(c => `• ${c}`).join('\n')}`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
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
            title: () => "Three words that change everything!",
            body: () => `Remember these three words and you'll ace every logic question:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "ALL → definitely true for everyone", why: "All dogs have legs → every dog has legs" },
                  { text: "SOME → maybe true, maybe not", why: "Some children like maths → you can't be sure about one child" },
                  { text: "NONE → definitely false for everyone", why: "No fish can walk → no fish at all can walk ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "true-false-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why 'All X are Y' does NOT mean 'All Y are X' — this trips up loads of people!",
          "How to spot and dodge the backwards logic trap"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "checking a tricky logic answer",
            clues: ["All roses have thorns.", "This plant has thorns."],
            question: "Is this plant definitely a rose?",
            people: ["Plant"],
            correctOrder: ["All roses → thorns", "Plant → thorns", "Plant → might be a rose, might not"],
            diagram: "All roses → thorns. But thorns ≠ roses (other plants have thorns too).",
            friendWrong: "Yes, definitely",
            friendReason: "because it has thorns and all roses have thorns",
            whyWrong: "Just because ALL roses have thorns doesn't mean ONLY roses have thorns! Cacti and holly have thorns too.",
            options: ["Yes, definitely", "No, not necessarily", "Only if it's red", "Only if it smells nice", "Cannot tell"],
            correctAnswer: "No, not necessarily",
            explanation: "All roses have thorns, but OTHER plants also have thorns. Having thorns doesn't prove it's a rose. ✓",
            interactClues: ["All penguins can swim.", "This animal can swim."],
            interactQuestion: "Is this animal definitely a penguin?",
            interactOptions: ["Yes, definitely", "No, not necessarily", "Only if it's black and white", "Only if it lives in the cold", "Cannot tell"],
            interactCorrectAnswer: "No, not necessarily",
            interactExplanation: "All penguins can swim, but lots of OTHER animals can swim too — fish, seals, dogs. Swimming doesn't prove it's a penguin. ✓"
          },
          {
            name: "Marcus",
            scenario: "spotting a backwards logic trap",
            clues: ["All squares have four sides.", "This shape has four sides."],
            question: "Is this shape definitely a square?",
            people: ["Shape"],
            correctOrder: ["All squares → four sides", "Shape → four sides", "Shape → might be square, might not"],
            diagram: "All squares → four sides. But rectangles also have four sides!",
            friendWrong: "Yes, definitely",
            friendReason: "because squares have four sides and this shape has four sides",
            whyWrong: "Rectangles, rhombuses and trapeziums also have four sides. Four sides doesn't automatically mean square!",
            options: ["Yes, definitely", "No, not necessarily", "Only if it's small", "Only if sides are equal", "Cannot tell"],
            correctAnswer: "No, not necessarily",
            explanation: "All squares have four sides, but lots of other shapes do too. We can't be sure it's a square. ✓",
            interactClues: ["All sparrows are birds.", "This animal is a bird."],
            interactQuestion: "Is this bird definitely a sparrow?",
            interactOptions: ["Yes, definitely", "No, not necessarily", "Only if it's small", "Only if it sings", "Cannot tell"],
            interactCorrectAnswer: "No, not necessarily",
            interactExplanation: "All sparrows are birds, but there are many OTHER types of bird — robins, pigeons, eagles. Being a bird doesn't prove it's a sparrow. ✓"
          },
          {
            name: "Oliver",
            scenario: "finding the trap in a logic puzzle",
            clues: ["All children in Year 6 wear a blue jumper.", "This person is wearing a blue jumper."],
            question: "Is this person definitely in Year 6?",
            people: ["Person"],
            correctOrder: ["All Year 6 → blue jumper", "Person → blue jumper", "Person → might be Year 6, might not"],
            diagram: "All Year 6 → blue. But other people might wear blue too!",
            friendWrong: "Yes, definitely",
            friendReason: "because Year 6 children wear blue and this person wears blue",
            whyWrong: "Other year groups or even adults might also wear blue jumpers. Blue jumper doesn't prove Year 6!",
            options: ["Yes, definitely", "No, not necessarily", "Only on Mondays", "Only if they're 10", "Cannot tell"],
            correctAnswer: "No, not necessarily",
            explanation: "All Year 6 children wear blue, but others might too. Wearing blue doesn't prove someone is in Year 6. ✓",
            interactClues: ["All footballers wear boots.", "This person is wearing boots."],
            interactQuestion: "Is this person definitely a footballer?",
            interactOptions: ["Yes, definitely", "No, not necessarily", "Only if they're on a pitch", "Only if they have a ball", "Cannot tell"],
            interactCorrectAnswer: "No, not necessarily",
            interactExplanation: "All footballers wear boots, but walkers, builders and horse riders also wear boots. Wearing boots doesn't prove someone is a footballer. ✓"
          },
          {
            name: "Priya",
            scenario: "catching the most common logic mistake",
            clues: ["If it is raining, the ground is wet.", "The ground is wet."],
            question: "Is it definitely raining?",
            people: ["Ground"],
            correctOrder: ["Rain → wet ground", "Ground → wet", "Rain → maybe, but other causes exist"],
            diagram: "Rain → wet ground. But sprinklers, spills, etc. also make ground wet.",
            friendWrong: "Yes, definitely",
            friendReason: "because rain makes the ground wet and the ground is wet",
            whyWrong: "Rain makes the ground wet, but so can sprinklers, someone spilling water, or washing a car!",
            options: ["Yes, definitely", "No, not necessarily", "Only in winter", "Only outdoors", "Cannot tell"],
            correctAnswer: "No, not necessarily",
            explanation: "Rain DOES make the ground wet, but other things can too. We can't be sure it's raining just because the ground is wet. ✓",
            interactClues: ["All bicycles have two wheels.", "This vehicle has two wheels."],
            interactQuestion: "Is this vehicle definitely a bicycle?",
            interactOptions: ["Yes, definitely", "No, not necessarily", "Only if it has pedals", "Only if someone is riding it", "Cannot tell"],
            interactCorrectAnswer: "No, not necessarily",
            interactExplanation: "All bicycles have two wheels, but motorcycles and scooters also have two wheels. Having two wheels doesn't prove it's a bicycle. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is "${v.friendWrong}" really right?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n${v.clues.map(c => `• ${c}`).join('\n')}\n\n**${v.question}**\n\nSomeone answered **"${v.friendWrong}"** — ${v.friendReason}.\n\nCan you spot the mistake?`,
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "The backwards logic trap!",
            body: (v) => `"All X are Y" does NOT mean "All Y are X"!\n\n${v.whyWrong}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `The clue says: ${v.clues[0]}`, why: "This tells us about X → Y" },
                  { text: `But we're told: ${v.clues[1]}`, why: "We only know about Y, not X" },
                  { text: `The answer is: ${v.correctAnswer}`, why: `${v.whyWrong} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — spot the trap!",
            body: (v) => `${v.interactClues.map(c => `• ${c}`).join('\n')}\n\n**${v.interactQuestion}**`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
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
            title: () => "The backwards trap — you'll never fall for it!",
            body: () => `This golden rule will save you marks in the exam:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "All X are Y ≠ All Y are X", why: "All cats have tails, but not all tailed animals are cats" },
                  { text: "If A → B, that doesn't mean B → A", why: "Rain makes ground wet, but wet ground doesn't prove rain" },
                  { text: "Ask: could something ELSE cause this?", why: "If yes, the answer is 'not necessarily' ✓" }
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
  // SUB-CONCEPT 4: Comparative Language
  // Category: supporting
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "comparative-language",
    name: "Understanding Comparison Words",
    category: "supporting",
    lessons: [
      {
        id: "comparative-language-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to read comparison words like a pro — taller, shorter, older, younger, more, fewer",
          "Why understanding these words is like having a compass that always points the right way"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "learning what comparison words tell you",
            clues: ["Kai is heavier than Toby.", "Freya is lighter than Toby."],
            question: "Who is the lightest?",
            people: ["Kai", "Toby", "Freya"],
            correctOrder: ["Kai", "Toby", "Freya"],
            diagram: "Heaviest → Kai → Toby → Freya → Lightest",
            options: ["Kai", "Toby", "Freya", "They weigh the same", "Cannot tell"],
            correctAnswer: "Freya",
            explanation: "'Heavier than' means goes ABOVE. 'Lighter than' means goes BELOW. Kai > Toby > Freya. Freya is lightest. ✓",
            interactClues: ["Sam is shorter than Beth.", "Beth is shorter than Jude."],
            interactQuestion: "Who is the tallest?",
            interactOptions: ["Sam", "Beth", "Jude", "They are the same height", "Cannot tell"],
            interactCorrectAnswer: "Jude",
            interactExplanation: "'Shorter than' means goes BELOW. Sam < Beth < Jude, so Jude > Beth > Sam. Jude is the tallest. ✓"
          },
          {
            name: "Ben",
            scenario: "sorting people using comparison clues",
            clues: ["Priya is older than Marcus.", "Grace is older than Priya."],
            question: "Who is the youngest?",
            people: ["Priya", "Marcus", "Grace"],
            correctOrder: ["Grace", "Priya", "Marcus"],
            diagram: "Oldest → Grace → Priya → Marcus → Youngest",
            options: ["Priya", "Marcus", "Grace", "Priya and Grace", "Cannot tell"],
            correctAnswer: "Marcus",
            explanation: "'Older than' puts Grace above Priya, and Priya above Marcus. Grace > Priya > Marcus. Marcus is the youngest. ✓",
            interactClues: ["Ruby swims slower than Felix.", "Felix swims slower than Ada."],
            interactQuestion: "Who is the fastest swimmer?",
            interactOptions: ["Ruby", "Felix", "Ada", "Ruby and Felix", "Cannot tell"],
            interactCorrectAnswer: "Ada",
            interactExplanation: "'Slower than' means goes BELOW. Ruby < Felix < Ada in speed. Ada > Felix > Ruby. Ada is the fastest swimmer. ✓"
          },
          {
            name: "Daisy",
            scenario: "decoding 'more' and 'fewer' clues",
            clues: ["Hugo has more stickers than Amara.", "Amara has fewer stickers than Hugo but more than Evie."],
            question: "Who has the fewest stickers?",
            people: ["Hugo", "Evie", "Amara"],
            correctOrder: ["Hugo", "Amara", "Evie"],
            diagram: "Most → Hugo → Amara → Evie → Fewest",
            options: ["Hugo", "Evie", "Amara", "Hugo and Amara", "Cannot tell"],
            correctAnswer: "Evie",
            explanation: "Hugo > Evie and Amara > Evie. Evie is below both, so Evie has the fewest stickers. ✓",
            interactClues: ["Tara arrives before Niall.", "Niall arrives before Sophie."],
            interactQuestion: "Who arrives last?",
            interactOptions: ["Tara", "Niall", "Sophie", "Tara and Sophie", "Cannot tell"],
            interactCorrectAnswer: "Sophie",
            interactExplanation: "'Arrives before' means earlier. Tara (1st) → Niall (2nd) → Sophie (last). Sophie arrives last. ✓"
          },
          {
            name: "Charlie",
            scenario: "practising reading comparison words carefully",
            clues: ["Zara finishes before Oliver.", "Nadia finishes after Oliver."],
            question: "Who finishes last?",
            people: ["Zara", "Oliver", "Nadia"],
            correctOrder: ["Zara", "Oliver", "Nadia"],
            diagram: "First → Zara → Oliver → Nadia → Last",
            options: ["Zara", "Oliver", "Nadia", "Zara and Nadia", "Cannot tell"],
            correctAnswer: "Nadia",
            explanation: "'Finishes before' means earlier. 'Finishes after' means later. Zara (1st) → Oliver (2nd) → Nadia (last). ✓",
            interactClues: ["Emma has fewer sweets than Josh.", "Josh has fewer sweets than Keira."],
            interactQuestion: "Who has the most sweets?",
            interactOptions: ["Emma", "Josh", "Keira", "Emma and Josh", "Cannot tell"],
            interactCorrectAnswer: "Keira",
            interactExplanation: "'Fewer than' means goes BELOW. Emma < Josh < Keira, so Keira > Josh > Emma. Keira has the most sweets. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What do the comparison words tell you?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**Did you know?** Comparison words are like arrows — they point you to who goes where! Words like "taller than" and "more" point UP. Words like "shorter than" and "fewer" point DOWN.\n\n${v.clues.map(c => `• ${c}`).join('\n')}\n\n**${v.question}**`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `${v.name} is ${v.scenario}.\n\n**Did you know?** Comparison words are like arrows — they point you to who goes where! Words like "taller than" and "more" point UP. Words like "shorter than" and "fewer" point DOWN.\n\n${v.clues.map(c => `• ${c}`).join('\n')}\n\n**${v.question}**`
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: null,
                    clues: v.clues
                })
              }
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "Comparison word decoder",
            body: (v) => `Let's decode the clues: ${v.clues.join(' ')}\n\nEach comparison word tells you a direction:\n\n• **More / taller / heavier / older / faster / before** → goes ABOVE\n• **Less / shorter / lighter / younger / slower / after** → goes BELOW`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `Let's decode the clues: ${v.clues.join(' ')}\n\nEach comparison word tells you a direction:\n\n• **More / taller / heavier / older / faster / before** → goes ABOVE\n• **Less / shorter / lighter / younger / slower / after** → goes BELOW`
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: v.correctAnswer,
                    clues: v.clues
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                    steps: [
                      { text: `Clue 1: ${v.clues[0]}`, why: "Which direction does this point?" },
                      { text: `Clue 2: ${v.clues[1]}`, why: "UP word or DOWN word?" },
                      { text: `Result: ${v.diagram}`, why: `${v.question} → ${v.correctAnswer} ✓` }
                    ],
                    allRevealed: true
                })
              }
            ],
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Underline every comparison word (taller, shorter, more, less, etc.)`,
                `Decide the direction: UP words go above, DOWN words go below`,
                `Draw the order and read off the answer`
              ],
              feedback: {
                correct: (v) => `Perfect! Find the comparison words, decide direction, then draw. ✓`,
                incorrect: (v) => `Not quite — first find the comparison words, then decide up or down, then draw!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Decode the comparison words:\n\n${v.interactClues.map(c => `• ${c}`).join('\n')}`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
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
            title: () => "Your comparison word cheat sheet!",
            body: (v) => `Learn these pairs and you'll never get tripped up:`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `Learn these pairs and you'll never get tripped up:`
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: v.correctAnswer,
                    clues: v.clues
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                    steps: [
                      { text: "UP words: more, taller, heavier, older, faster, before", why: "These put someone HIGHER in the order" },
                      { text: "DOWN words: less, shorter, lighter, younger, slower, after", why: "These put someone LOWER in the order" },
                      { text: "Opposite words give the SAME information!", why: "'A is taller than B' = 'B is shorter than A' ✓" }
                    ],
                    allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 5: Superlative Questions
  // Category: supporting
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "superlative-questions",
    name: "Who Is Tallest / Shortest / Oldest?",
    category: "supporting",
    lessons: [
      {
        id: "superlative-questions-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find the tallest, shortest, oldest or youngest — read it straight off your diagram!",
          "Why building the FULL order first means you'll always pick the right answer"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "finding the tallest from her ordering diagram",
            clues: ["Evie is taller than Hugo.", "Hugo is taller than Grace.", "Grace is taller than Ravi."],
            question: "Who is the tallest?",
            people: ["Evie", "Hugo", "Grace", "Ravi"],
            correctOrder: ["Evie", "Hugo", "Grace", "Ravi"],
            diagram: "Tallest → Evie → Hugo → Grace → Ravi → Shortest",
            options: ["Evie", "Hugo", "Grace", "Ravi", "Cannot tell"],
            correctAnswer: "Evie",
            explanation: "Evie > Hugo > Grace > Ravi. Evie is at the very top, so she is the tallest. ✓",
            interactClues: ["Seb has more goals than Tilly.", "Tilly has more goals than Noor.", "Noor has more goals than Arlo."],
            interactQuestion: "Who has scored the most goals?",
            interactOptions: ["Seb", "Tilly", "Noor", "Arlo", "Cannot tell"],
            interactCorrectAnswer: "Seb",
            interactExplanation: "Seb > Tilly > Noor > Arlo. Seb is at the very top, so he has scored the most goals. ✓"
          },
          {
            name: "Ben",
            scenario: "working out who has the fewest points",
            clues: ["Toby has more points than Kai.", "Freya has more points than Toby.", "Kai has more points than Amara."],
            question: "Who has the fewest points?",
            people: ["Toby", "Kai", "Freya", "Amara"],
            correctOrder: ["Freya", "Toby", "Kai", "Amara"],
            diagram: "Most → Freya → Toby → Kai → Amara → Fewest",
            options: ["Freya", "Toby", "Kai", "Amara", "Cannot tell"],
            correctAnswer: "Amara",
            explanation: "Freya > Toby > Kai > Amara. Amara is at the very bottom, so she has the fewest points. ✓",
            interactClues: ["Orla is older than Isaac.", "Isaac is older than Meera.", "Meera is older than Lucas."],
            interactQuestion: "Who is the youngest?",
            interactOptions: ["Orla", "Isaac", "Meera", "Lucas", "Cannot tell"],
            interactCorrectAnswer: "Lucas",
            interactExplanation: "Orla > Isaac > Meera > Lucas in age. Lucas is at the very bottom, so he is the youngest. ✓"
          },
          {
            name: "Daisy",
            scenario: "finding who is youngest in a group",
            clues: ["Priya is older than Oliver.", "Nadia is older than Priya.", "Oliver is older than Marcus."],
            question: "Who is the youngest?",
            people: ["Priya", "Oliver", "Nadia", "Marcus"],
            correctOrder: ["Nadia", "Priya", "Oliver", "Marcus"],
            diagram: "Oldest → Nadia → Priya → Oliver → Marcus → Youngest",
            options: ["Nadia", "Priya", "Oliver", "Marcus", "Cannot tell"],
            correctAnswer: "Marcus",
            explanation: "Nadia > Priya > Oliver > Marcus in age. Marcus is at the very bottom, so he is the youngest. ✓",
            interactClues: ["Willow weighs more than Teddy.", "Teddy weighs more than Beau.", "Beau weighs more than Mabel."],
            interactQuestion: "Who weighs the most?",
            interactOptions: ["Willow", "Teddy", "Beau", "Mabel", "Cannot tell"],
            interactCorrectAnswer: "Willow",
            interactExplanation: "Willow > Teddy > Beau > Mabel in weight. Willow is at the very top, so she weighs the most. ✓"
          },
          {
            name: "Finn",
            scenario: "picking out the fastest swimmer",
            clues: ["Ivy swims faster than Zara.", "Zara swims faster than Daisy.", "Hugo swims faster than Ivy."],
            question: "Who is the fastest swimmer?",
            people: ["Ivy", "Zara", "Daisy", "Hugo"],
            correctOrder: ["Hugo", "Ivy", "Zara", "Daisy"],
            diagram: "Fastest → Hugo → Ivy → Zara → Daisy → Slowest",
            options: ["Ivy", "Zara", "Daisy", "Hugo", "Cannot tell"],
            correctAnswer: "Hugo",
            explanation: "Hugo > Ivy > Zara > Daisy in swimming speed. Hugo is at the very top, so he is the fastest. ✓",
            interactClues: ["Jasper is taller than Flora.", "Flora is taller than Erin.", "Erin is taller than Max."],
            interactQuestion: "Who is the shortest?",
            interactOptions: ["Jasper", "Flora", "Erin", "Max", "Cannot tell"],
            interactCorrectAnswer: "Max",
            interactExplanation: "Jasper > Flora > Erin > Max in height. Max is at the very bottom, so he is the shortest. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.question}`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nSuperlative questions ask for the **most** or **least** — the person at the very TOP or very BOTTOM of the order.\n\n${v.clues.map(c => `• ${c}`).join('\n')}\n\nBuild the full order first, THEN look at the ends!`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `${v.name} is ${v.scenario}.\n\nSuperlative questions ask for the **most** or **least** — the person at the very TOP or very BOTTOM of the order.\n\n${v.clues.map(c => `• ${c}`).join('\n')}\n\nBuild the full order first, THEN look at the ends!`
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: null,
                    clues: v.clues
                })
              }
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "Build the order, then check the ends",
            body: (v) => `We need to find **${v.question.toLowerCase().replace('?', '')}** from these clues. Superlative (a word meaning the most or least of something) = the extreme end of the order. Build the FULL chain first:`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `We need to find **${v.question.toLowerCase().replace('?', '')}** from these clues. Superlative (a word meaning the most or least of something) = the extreme end of the order. Build the FULL chain first:`
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: v.correctAnswer,
                    clues: v.clues
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                    steps: [
                      { text: `Build the chain: ${v.diagram}`, why: "Put everyone in order from top to bottom" },
                      { text: `Top of the order = most / tallest / oldest / fastest`, why: "The person at the very start" },
                      { text: `Bottom of the order = least / shortest / youngest / slowest`, why: `${v.question} → ${v.correctAnswer} ✓` }
                    ],
                    allRevealed: false
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Build the full order, then find the answer:\n\n${v.interactClues.map(c => `• ${c}`).join('\n')}`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
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
            title: () => "Superlatives — just check the ends!",
            body: (v) => `For "who is the tallest / shortest / most / least?" questions, the answer is always at one end of your chain:`,
            bodyParts: [
              {
                type: "text",
                content: (v) => `For "who is the tallest / shortest / most / least?" questions, the answer is always at one end of your chain:`
              },
              {
                type: "visual",
                component: "LogicDiagram",
                props: (v) => ({
                    items: v.correctOrder,
                    topLabel: v.diagram.split(' → ')[0],
                    bottomLabel: v.diagram.split(' → ').slice(-1)[0].split('(')[0].trim(),
                    highlight: v.correctAnswer,
                    clues: v.clues
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                    steps: [
                      { text: "1. Build the FULL order from all clues", why: "Don't stop halfway — you need everyone in the chain" },
                      { text: "2. Tallest/most/oldest = TOP of your line", why: "The very first name in your order" },
                      { text: "3. Shortest/fewest/youngest = BOTTOM", why: "The very last name in your order ✓" }
                    ],
                    allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 6: Sentence Rearrangement
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "sentence-rearrangement",
    name: "Rearranging Jumbled Sentences",
    category: "supporting",
    lessons: [
      {
        id: "sentence-rearrangement-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to unscramble jumbled words into a sentence that makes sense",
          "How to spot the starting word and build the sentence piece by piece"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "unscrambling a jumbled sentence",
            clues: ["Jumbled words: 'park the played in children the'"],
            question: "What is the last word of the correct sentence?",
            people: [],
            correctOrder: ["The", "children", "played", "in", "the", "park"],
            diagram: "The children played in the park.",
            options: ["park", "children", "played", "the", "in"],
            correctAnswer: "park",
            explanation: "The correct sentence is 'The children played in the park.' The last word is 'park'. ✓",
            interactClues: ["Jumbled words: 'shop the walked to girls the'"],
            interactQuestion: "What is the last word of the correct sentence?",
            interactOptions: ["shop", "girls", "walked", "the", "to"],
            interactCorrectAnswer: "shop",
            interactExplanation: "The correct sentence is 'The girls walked to the shop.' The last word is 'shop'. ✓"
          },
          {
            name: "Ben",
            scenario: "putting words in the right order",
            clues: ["Jumbled words: 'quickly dog the very ran'"],
            question: "What is the third word of the correct sentence?",
            people: [],
            correctOrder: ["The", "dog", "ran", "very", "quickly"],
            diagram: "The dog ran very quickly.",
            options: ["quickly", "dog", "ran", "the", "very"],
            correctAnswer: "ran",
            explanation: "The correct sentence is 'The dog ran very quickly.' The third word is 'ran' — The (1st), dog (2nd), ran (3rd). ✓",
            interactClues: ["Jumbled words: 'loudly cat the very meowed'"],
            interactQuestion: "What is the third word of the correct sentence?",
            interactOptions: ["loudly", "cat", "meowed", "the", "very"],
            interactCorrectAnswer: "meowed",
            interactExplanation: "The correct sentence is 'The cat meowed very loudly.' The third word is 'meowed' — The (1st), cat (2nd), meowed (3rd). ✓"
          },
          {
            name: "Daisy",
            scenario: "solving a sentence puzzle",
            clues: ["Jumbled words: 'homework her finished she after school'"],
            question: "What is the first word of the correct sentence?",
            people: [],
            correctOrder: ["She", "finished", "her", "homework", "after", "school"],
            diagram: "She finished her homework after school.",
            options: ["homework", "her", "finished", "She", "after"],
            correctAnswer: "She",
            explanation: "The correct sentence is 'She finished her homework after school.' The first word is 'She'. ✓",
            interactClues: ["Jumbled words: 'lunch his ate he during break'"],
            interactQuestion: "What is the first word of the correct sentence?",
            interactOptions: ["lunch", "his", "ate", "He", "during"],
            interactCorrectAnswer: "He",
            interactExplanation: "The correct sentence is 'He ate his lunch during break.' The first word is 'He'. ✓"
          },
          {
            name: "Charlie",
            scenario: "unjumbling words to make a sentence",
            clues: ["Jumbled words: 'birthday cake a baked mum for my'"],
            question: "What is the fourth word of the correct sentence?",
            people: [],
            correctOrder: ["My", "mum", "baked", "a", "birthday", "cake"],
            diagram: "My mum baked a birthday cake.",
            options: ["mum", "baked", "a", "birthday", "cake"],
            correctAnswer: "a",
            explanation: "The correct sentence is 'My mum baked a birthday cake.' The fourth word is 'a' — My (1st), mum (2nd), baked (3rd), a (4th). ✓",
            interactClues: ["Jumbled words: 'new brother a toy bought her'"],
            interactQuestion: "What is the fourth word of the correct sentence?",
            interactOptions: ["brother", "bought", "a", "new", "toy"],
            interactCorrectAnswer: "a",
            interactExplanation: "The correct sentence is 'Her brother bought a new toy.' The fourth word is 'a' — Her (1st), brother (2nd), bought (3rd), a (4th). ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you unscramble the sentence?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n${v.clues[0]}\n\nThe trick is to find the word that makes sense at the START, then build the sentence piece by piece.\n\n**${v.question}**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: v.clues[0] },
                  { text: "Find the starting word, then build outward" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Start with the subject!",
            body: (v) => `The jumbled words make the sentence: **"${v.diagram}"**\n\nTo unscramble a sentence:\n\n1. **Find the subject** — who or what is the sentence about?\n2. **Find the verb** — what are they doing?\n3. **Add the rest** — where, when, how?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Find the subject (who/what)`, why: `"${v.correctOrder[0]}" starts the sentence` },
                  { text: `Find the verb (what happens)`, why: `Look for the action word — what is the subject doing?` },
                  { text: `Build the sentence: "${v.diagram}"`, why: `${v.question} → ${v.correctAnswer} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `To unscramble a sentence, first find the ____ — who or what the sentence is about`,
              options: (v) => ["subject", "verb", "adjective", "ending"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! The subject (who/what) usually starts the sentence — find it first. ✓`,
                incorrect: (v) => `Not quite — always find the subject first: who or what is the sentence about?`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.interactClues[0]}\n\nRearrange the words, then answer:`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
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
            title: () => "Sentence unscrambling — sorted!",
            body: () => `Three steps and you'll crack any jumbled sentence:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Find the subject — who or what is it about?", why: "This is usually the first word" },
                  { text: "2. Find the verb — what are they doing?", why: "This usually comes second or third" },
                  { text: "3. Fill in the rest and check it sounds right", why: "Read it aloud — does it make sense? ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "sentence-rearrangement-hook",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to tackle longer jumbled sentences without getting tangled up",
          "A top tip: reading your rebuilt sentence aloud catches mistakes your eyes miss!"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "tackling a trickier sentence puzzle",
            clues: ["Jumbled words: 'to walked every school they morning'"],
            question: "What is the last word of the correct sentence?",
            people: [],
            correctOrder: ["They", "walked", "to", "school", "every", "morning"],
            diagram: "They walked to school every morning.",
            options: ["morning", "school", "every", "they", "walked"],
            correctAnswer: "morning",
            explanation: "The correct sentence is 'They walked to school every morning.' The last word is 'morning'. ✓",
            interactClues: ["Jumbled words: 'library quietly the read in children the'"],
            interactSentence: "The children read quietly in the library.",
            interactQuestion: "What is the fourth word of the correct sentence?",
            interactOptions: ["read", "quietly", "children", "library", "the"],
            interactCorrectAnswer: "quietly",
            interactExplanation: "The correct sentence is 'The children read quietly in the library.' The fourth word is 'quietly' — The (1st), children (2nd), read (3rd), quietly (4th). ✓"
          },
          {
            name: "Marcus",
            scenario: "solving a sentence rearrangement puzzle",
            clues: ["Jumbled words: 'garden flowers the beautiful had colourful'"],
            question: "What is the second word of the correct sentence?",
            people: [],
            correctOrder: ["The", "beautiful", "garden", "had", "colourful", "flowers"],
            diagram: "The beautiful garden had colourful flowers.",
            options: ["beautiful", "garden", "flowers", "colourful", "had"],
            correctAnswer: "beautiful",
            explanation: "The correct sentence is 'The beautiful garden had colourful flowers.' The second word is 'beautiful'. ✓",
            interactClues: ["Jumbled words: 'played park children happily the the in'"],
            interactSentence: "The children played happily in the park.",
            interactQuestion: "What is the third word of the correct sentence?",
            interactOptions: ["played", "children", "happily", "park", "the"],
            interactCorrectAnswer: "played",
            interactExplanation: "The correct sentence is 'The children played happily in the park.' The third word is 'played' — The (1st), children (2nd), played (3rd). ✓"
          },
          {
            name: "Priya",
            scenario: "putting a longer sentence back together",
            clues: ["Jumbled words: 'happily sang children the stage the on'"],
            question: "What is the fifth word of the correct sentence?",
            people: [],
            correctOrder: ["The", "children", "sang", "happily", "on", "the", "stage"],
            diagram: "The children sang happily on the stage.",
            options: ["on", "sang", "happily", "children", "stage"],
            correctAnswer: "on",
            explanation: "The correct sentence is 'The children sang happily on the stage.' The fifth word is 'on' — The (1st), children (2nd), sang (3rd), happily (4th), on (5th). ✓",
            interactClues: ["Jumbled words: 'carefully letter the wrote her grandmother a'"],
            interactSentence: "Her grandmother carefully wrote a letter.",
            interactQuestion: "What is the second word of the correct sentence?",
            interactOptions: ["carefully", "grandmother", "wrote", "letter", "her"],
            interactCorrectAnswer: "grandmother",
            interactExplanation: "The correct sentence is 'Her grandmother carefully wrote a letter.' The second word is 'grandmother' — Her (1st), grandmother (2nd). ✓"
          },
          {
            name: "Oliver",
            scenario: "unscrambling a sentence in a VR test",
            clues: ["Jumbled words: 'in swam fish pond the the happily'"],
            question: "What is the third word of the correct sentence?",
            people: [],
            correctOrder: ["The", "fish", "swam", "happily", "in", "the", "pond"],
            diagram: "The fish swam happily in the pond.",
            options: ["swam", "fish", "happily", "pond", "in"],
            correctAnswer: "swam",
            explanation: "The correct sentence is 'The fish swam happily in the pond.' The third word is 'swam' — The (1st), fish (2nd), swam (3rd). ✓",
            interactClues: ["Jumbled words: 'neatly homework finished his quickly boy the'"],
            interactSentence: "The boy quickly finished his homework neatly.",
            interactQuestion: "What is the fourth word of the correct sentence?",
            interactOptions: ["boy", "quickly", "finished", "homework", "neatly"],
            interactCorrectAnswer: "finished",
            interactExplanation: "The correct sentence is 'The boy quickly finished his homework neatly.' The fourth word is 'finished' — The (1st), boy (2nd), quickly (3rd), finished (4th). ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you build this sentence?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n${v.clues[0]}\n\nLonger sentences need the same method — find the subject, then the verb, then fill in the rest.\n\n**${v.question}**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: v.clues[0] },
                  { text: "Subject → Verb → Rest" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Read it aloud!",
            body: (v) => `The jumbled words make: **"${v.diagram}"**\n\nOnce you've built a sentence, **read it aloud** (or in your head). Does it sound natural? If something feels wrong, try swapping words around.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Find subject and verb first`, why: "Who does what?" },
                  { text: `Build the sentence: "${v.diagram}"`, why: "Add the remaining words where they sound natural" },
                  { text: `Read aloud and check`, why: `${v.question} → ${v.correctAnswer} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — a new sentence!",
            body: (v) => `${v.interactClues[0]}\n\nBuild the sentence, then answer:`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
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
            title: () => "Longer sentences? Same trick!",
            body: () => `Even longer sentences follow the same pattern. You've got this:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Subject first (who/what)", why: "The, A, She, He, They — often starts the sentence" },
                  { text: "2. Verb next (what they do)", why: "ran, played, walked, sang" },
                  { text: "3. Read it aloud — does it sound right?", why: "Your ear catches mistakes your eyes miss ✓" }
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
  // SUB-CONCEPT 7: Syllogisms
  // Category: other
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "syllogisms",
    name: "If All X Are Y...",
    category: "other",
    lessons: [
      {
        id: "syllogisms-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to follow logical chains where one fact leads to another — like falling dominoes!",
          "How to draw an arrow chain to make the logic crystal clear"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "working through a chain of logic",
            clues: ["All mammals are warm-blooded.", "A dog is a mammal."],
            question: "Is a dog warm-blooded?",
            people: ["Dog"],
            correctOrder: ["All mammals → warm-blooded", "Dog = mammal", "Dog → warm-blooded"],
            diagram: "mammals → warm-blooded. Dog → mammal → warm-blooded.",
            options: ["Yes, definitely", "No", "Only in summer", "Only some dogs", "Cannot tell"],
            correctAnswer: "Yes, definitely",
            explanation: "All mammals are warm-blooded. A dog is a mammal. So a dog is definitely warm-blooded. This is a perfect syllogism chain! ✓",
            interactClues: ["All birds have feathers.", "A robin is a bird."],
            interactQuestion: "Does a robin have feathers?",
            interactDiagram: "birds → feathers. Robin → bird → feathers.",
            interactOptions: ["Yes, definitely", "No", "Only in winter", "Only some robins", "Cannot tell"],
            interactCorrectAnswer: "Yes, definitely",
            interactExplanation: "All birds have feathers. A robin is a bird. So a robin definitely has feathers. Follow the chain: robin → bird → feathers. ✓"
          },
          {
            name: "Ben",
            scenario: "following a logic chain step by step",
            clues: ["All fruits contain seeds.", "An apple is a fruit."],
            question: "Does an apple contain seeds?",
            people: ["Apple"],
            correctOrder: ["All fruits → seeds", "Apple = fruit", "Apple → seeds"],
            diagram: "fruits → seeds. Apple → fruit → seeds.",
            options: ["Yes, definitely", "No", "Only green ones", "Maybe", "Cannot tell"],
            correctAnswer: "Yes, definitely",
            explanation: "All fruits contain seeds. An apple is a fruit. So an apple definitely contains seeds. ✓",
            interactClues: ["All reptiles are cold-blooded.", "A lizard is a reptile."],
            interactQuestion: "Is a lizard cold-blooded?",
            interactDiagram: "reptiles → cold-blooded. Lizard → reptile → cold-blooded.",
            interactOptions: ["Yes, definitely", "No", "Only in summer", "Some lizards", "Cannot tell"],
            interactCorrectAnswer: "Yes, definitely",
            interactExplanation: "All reptiles are cold-blooded. A lizard is a reptile. So a lizard is definitely cold-blooded. Follow the chain: lizard → reptile → cold-blooded. ✓"
          },
          {
            name: "Daisy",
            scenario: "tackling a longer logic chain",
            clues: ["All flowers are plants.", "All plants need water.", "A daisy is a flower."],
            question: "Does a daisy need water?",
            people: ["Daisy (the flower)"],
            correctOrder: ["All flowers → plants", "All plants → water", "Daisy = flower → plant → water"],
            diagram: "flowers → plants → water. Daisy → flower → plant → needs water.",
            options: ["Yes, definitely", "No", "Only when sunny", "Sometimes", "Cannot tell"],
            correctAnswer: "Yes, definitely",
            explanation: "All flowers are plants, all plants need water, and a daisy is a flower. So: daisy → flower → plant → needs water. Definitely yes! ✓",
            interactClues: ["All insects have six legs.", "All beetles are insects.", "A ladybird is a beetle."],
            interactQuestion: "Does a ladybird have six legs?",
            interactDiagram: "insects → six legs. Beetles → insects. Ladybird → beetle → insect → six legs.",
            interactOptions: ["Yes, definitely", "No", "Only some ladybirds", "Only adult ones", "Cannot tell"],
            interactCorrectAnswer: "Yes, definitely",
            interactExplanation: "All insects have six legs. All beetles are insects. A ladybird is a beetle. So: ladybird → beetle → insect → six legs. Definitely yes! ✓"
          },
          {
            name: "Finn",
            scenario: "solving a two-step syllogism",
            clues: ["All vehicles have wheels.", "All buses are vehicles."],
            question: "Do all buses have wheels?",
            people: ["Buses"],
            correctOrder: ["All vehicles → wheels", "All buses → vehicles", "All buses → wheels"],
            diagram: "buses → vehicles → wheels. So all buses have wheels.",
            options: ["Yes, definitely", "No", "Only big ones", "Most of them", "Cannot tell"],
            correctAnswer: "Yes, definitely",
            explanation: "All buses are vehicles, and all vehicles have wheels. So all buses definitely have wheels. ✓",
            interactClues: ["All fish live in water.", "A salmon is a fish."],
            interactQuestion: "Does a salmon live in water?",
            interactDiagram: "fish → water. Salmon → fish → water.",
            interactOptions: ["Yes, definitely", "No", "Only in rivers", "Most salmon", "Cannot tell"],
            interactCorrectAnswer: "Yes, definitely",
            interactExplanation: "All fish live in water. A salmon is a fish. So a salmon definitely lives in water. Follow the chain: salmon → fish → water. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you follow the chain?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nA **syllogism** is a logic chain:\n• If ALL X are Y...\n• And Z is an X...\n• Then Z must also be Y!\n\n${v.clues.map(c => `• ${c}`).join('\n')}\n\n**${v.question}**`,
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "Draw the arrow chain",
            body: (v) => `A syllogism (a logical chain where one fact leads to another) works like a chain of arrows. Each link passes the truth along:`,
            bodyParts: [
              {
                type: 'text',
                content: (v) => `A syllogism works like a chain of arrows. Each link passes the truth along:`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Rule: ${v.clues[0]}`, why: "This is the general rule (ALL)" },
                    { text: `Fact: ${v.clues[v.clues.length - 1]}`, why: "This connects something specific to the rule" },
                    { text: `Chain: ${v.diagram}`, why: "Follow the arrows from start to finish" },
                    { text: `${v.question} → ${v.correctAnswer}`, why: `The chain proves it ✓` }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `In a syllogism, if "all cats have tails" and "Whiskers is a cat", then Whiskers must have a tail`, answer: true, explanation: `Correct! The general rule applies to every specific case. That's how syllogisms work. ✓` },
                { text: `In a syllogism, if "all dogs bark" and "Rex barks", then Rex must be a dog`, answer: false, explanation: `No! Other animals might bark too. You can only follow the chain FORWARDS, not backwards.` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn — a new chain!",
            body: (v) => `Follow the arrow chain:\n\n${v.interactClues.map(c => `• ${c}`).join('\n')}`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
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
            title: () => "Syllogisms — follow the arrows!",
            body: () => `These logic chains are like dominoes — once you push the first one, they all fall in order:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Find the GENERAL rule (All X are Y)", why: "This is the starting link of the chain" },
                  { text: "2. Find the SPECIFIC fact (Z is an X)", why: "This connects to the rule" },
                  { text: "3. Follow the chain: Z → X → Y", why: "Each arrow passes the truth along ✓" }
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
  // SUB-CONCEPT 8: Negation Traps
  // Category: other
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "negation-traps",
    name: "Negation Traps — Not Tallest ≠ Shortest",
    category: "other",
    lessons: [
      {
        id: "negation-traps-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Why 'not the tallest' does NOT mean 'the shortest' — this catches so many people!",
          "How to read 'not', 'isn't' and 'neither' carefully instead of jumping to conclusions"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "learning about negation traps",
            clues: ["Kai is not the tallest of three friends.", "Freya is shorter than Kai."],
            question: "Is Kai definitely the shortest?",
            people: ["Kai", "Freya", "Third friend"],
            correctOrder: ["Third friend", "Kai", "Freya"],
            diagram: "Tallest → Third friend → Kai → Freya → Shortest",
            options: ["Yes, definitely", "No — Kai is in the middle", "Yes — not tallest means shortest", "Cannot tell", "Kai could be anywhere"],
            correctAnswer: "No — Kai is in the middle",
            explanation: "Kai is not the tallest, but Freya is shorter than Kai. So Kai is in the MIDDLE — not tallest, not shortest. 'Not the tallest' just means someone else is taller! ✓",
            interactClues: ["Lily is not the fastest of three runners.", "Lily is faster than Max."],
            interactQuestion: "Is Lily the slowest?",
            interactOptions: ["Yes, definitely", "No — Lily is in the middle", "Yes — not fastest means slowest", "Cannot tell", "Lily could be anywhere"],
            interactCorrectAnswer: "No — Lily is in the middle",
            interactExplanation: "Lily is not the fastest, but she IS faster than Max. So Lily is in the MIDDLE. 'Not the fastest' doesn't mean 'the slowest'! ✓"
          },
          {
            name: "Ben",
            scenario: "spotting a negation trap in a VR question",
            clues: ["Priya does not have the most sweets.", "Priya has more sweets than Oliver."],
            question: "Does Priya have the fewest sweets?",
            people: ["Priya", "Oliver", "Third friend"],
            correctOrder: ["Third friend", "Priya", "Oliver"],
            diagram: "Most → Third friend → Priya → Oliver → Fewest",
            options: ["Yes, definitely", "No — Priya is in the middle", "Yes — not the most means the fewest", "Maybe", "Cannot tell"],
            correctAnswer: "No — Priya is in the middle",
            explanation: "Priya doesn't have the MOST, but she has more than Oliver. So Priya is in the middle. 'Not the most' just means someone has more! ✓",
            interactClues: ["Tom does not have the most books.", "Tom has more books than Ella."],
            interactQuestion: "Does Tom have the fewest books?",
            interactOptions: ["Yes, definitely", "No — Tom is in the middle", "Yes — not the most means the fewest", "Maybe", "Cannot tell"],
            interactCorrectAnswer: "No — Tom is in the middle",
            interactExplanation: "Tom doesn't have the MOST books, but he has more than Ella. So Tom is in the middle. 'Not the most' doesn't mean 'the fewest'! ✓"
          },
          {
            name: "Daisy",
            scenario: "avoiding a common logic mistake",
            clues: ["Hugo is not the oldest of three children.", "Hugo is older than Evie."],
            question: "Is Hugo definitely the youngest?",
            people: ["Hugo", "Evie", "Third child"],
            correctOrder: ["Third child", "Hugo", "Evie"],
            diagram: "Oldest → Third child → Hugo → Evie → Youngest",
            options: ["Yes, definitely", "No — Hugo is in the middle", "Yes — not oldest means youngest", "Maybe", "Cannot tell"],
            correctAnswer: "No — Hugo is in the middle",
            explanation: "Hugo is not the oldest, but he IS older than Evie. So Hugo is in the middle. 'Not the oldest' doesn't mean 'the youngest'! ✓",
            interactClues: ["Sophie is not the youngest of three sisters.", "Sophie is younger than Megan."],
            interactQuestion: "Is Sophie definitely the oldest?",
            interactOptions: ["Yes, definitely", "No — Sophie is in the middle", "Yes — not youngest means oldest", "Maybe", "Cannot tell"],
            interactCorrectAnswer: "No — Sophie is in the middle",
            interactExplanation: "Sophie is not the youngest, but she IS younger than Megan. So Sophie is in the MIDDLE. 'Not the youngest' doesn't mean 'the oldest'! ✓"
          },
          {
            name: "Charlie",
            scenario: "learning to read 'not' carefully",
            clues: ["Amara did not finish first in a race of three.", "Amara finished before Ravi."],
            question: "Did Amara finish last?",
            people: ["Amara", "Ravi", "Third runner"],
            correctOrder: ["Third runner", "Amara", "Ravi"],
            diagram: "First → Third runner → Amara → Ravi → Last",
            options: ["Yes, definitely", "No — Amara finished second", "Yes — not first means last", "Maybe", "Cannot tell"],
            correctAnswer: "No — Amara finished second",
            explanation: "Amara didn't finish first, but she finished before Ravi. So Amara was SECOND. 'Not first' doesn't mean 'last' — there are positions in between! ✓",
            interactClues: ["Jake did not score the highest of three friends.", "Jake scored higher than Freya."],
            interactQuestion: "Did Jake score the highest?",
            interactOptions: ["Yes, definitely", "No — Jake scored in the middle", "Yes — not lowest means highest", "Maybe", "Cannot tell"],
            interactCorrectAnswer: "No — Jake scored in the middle",
            interactExplanation: "Jake didn't score the highest, but he scored higher than Freya. So Jake is in the MIDDLE. 'Not the highest' doesn't mean 'the lowest'! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Does "not the tallest" mean "the shortest"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n${v.clues.map(c => `• ${c}`).join('\n')}\n\n**${v.question}**\n\n"Not the tallest" is a **negation** — it tells you what something ISN'T, not what it IS. Be careful!`,
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "Not tallest ≠ shortest!",
            body: (v) => `We know: ${v.clues.join(' ')}\n\n"Not the tallest" just means **someone else is taller**. There could be people shorter too!\n\nAlways check: is there someone BELOW them in the order?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"Not the tallest" means: at least one person is taller`, why: "It rules out the TOP position only" },
                  { text: `Check: is there anyone below? ${v.clues[1]}`, why: "If yes, they're in the MIDDLE, not at the bottom" },
                  { text: `Order: ${v.diagram}`, why: `${v.question} → ${v.correctAnswer} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Not the tallest", right: "Someone else is taller (rules out top)" },
                { left: "Not the shortest", right: "Someone else is shorter (rules out bottom)" },
                { left: "Not the oldest", right: "Someone else is older (rules out top)" },
                { left: "Not the youngest", right: "Someone else is younger (rules out bottom)" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn — watch for the trap!",
            body: (v) => `${v.interactClues.map(c => `• ${c}`).join('\n')}\n\nRemember: "not the tallest" does NOT automatically mean "the shortest"!`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
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
            title: () => "Negation traps — you're too smart for those!",
            body: () => `Now you know the trick, you'll never fall for "not = opposite" again:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "\"Not the tallest\" just means someone is taller", why: "It does NOT mean shortest" },
                  { text: "\"Not first\" just means someone finished before them", why: "It does NOT mean last" },
                  { text: "Always draw the FULL order to find their actual position", why: "Use all the clues, not just the negation ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "negation-traps-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot when someone else has fallen for the negation trap",
          "Why drawing the full order is your best protection against this mistake"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "checking a friend's logic homework",
            clues: ["Toby is not the fastest of three runners.", "Toby is faster than Grace."],
            question: "Who is the slowest?",
            people: ["Toby", "Grace", "Third runner"],
            correctOrder: ["Third runner", "Toby", "Grace"],
            diagram: "Fastest → Third runner → Toby → Grace → Slowest",
            friendWrong: "Toby",
            friendReason: "because 'not the fastest' means he must be slowest",
            whyWrong: "Toby is faster than Grace, so Grace is slowest! 'Not the fastest' just means he's not in first place.",
            options: ["Toby", "Grace", "The third runner", "Toby and Grace", "Cannot tell"],
            correctAnswer: "Grace",
            explanation: "Toby isn't the fastest, but he IS faster than Grace. So Grace is the slowest. ✓",
            interactClues: ["Mia is not the tallest of three girls.", "Mia is taller than Poppy."],
            interactQuestion: "Who is the shortest?",
            interactOptions: ["Mia", "Poppy", "The third girl", "Mia and Poppy", "Cannot tell"],
            interactCorrectAnswer: "Poppy",
            interactExplanation: "Mia isn't the tallest, but she IS taller than Poppy. So Poppy is the shortest. ✓"
          },
          {
            name: "Marcus",
            scenario: "spotting a mistake in a practice test",
            clues: ["Ivy doesn't have the most stickers of three friends.", "Ivy has more stickers than Daisy."],
            question: "Who has the fewest stickers?",
            people: ["Ivy", "Daisy", "Third friend"],
            correctOrder: ["Third friend", "Ivy", "Daisy"],
            diagram: "Most → Third friend → Ivy → Daisy → Fewest",
            friendWrong: "Ivy",
            friendReason: "because she doesn't have the most so she must have the fewest",
            whyWrong: "Ivy has more than Daisy, so Daisy has the fewest! 'Not the most' puts Ivy in the middle.",
            options: ["Ivy", "Daisy", "The third friend", "Ivy and Daisy", "Cannot tell"],
            correctAnswer: "Daisy",
            explanation: "Ivy doesn't have the most, but she has more than Daisy. So Daisy has the fewest. ✓",
            interactClues: ["Sam is not the oldest of three brothers.", "Sam is older than Leo."],
            interactQuestion: "Who is the youngest?",
            interactOptions: ["Sam", "Leo", "The third brother", "Sam and Leo", "Cannot tell"],
            interactCorrectAnswer: "Leo",
            interactExplanation: "Sam isn't the oldest, but he IS older than Leo. So Leo is the youngest. ✓"
          },
          {
            name: "Priya",
            scenario: "helping her brother avoid the negation trap",
            clues: ["Zara is not the oldest of three sisters.", "Zara is older than Nadia."],
            question: "Who is the youngest?",
            people: ["Zara", "Nadia", "Third sister"],
            correctOrder: ["Third sister", "Zara", "Nadia"],
            diagram: "Oldest → Third sister → Zara → Nadia → Youngest",
            friendWrong: "Zara",
            friendReason: "because if she's not the oldest she must be the youngest",
            whyWrong: "Zara is older than Nadia, which means Nadia is the youngest! Zara is in the middle.",
            options: ["Zara", "Nadia", "The third sister", "Zara and Nadia", "Cannot tell"],
            correctAnswer: "Nadia",
            explanation: "Zara isn't the oldest, but she IS older than Nadia. Nadia is the youngest. ✓",
            interactClues: ["Ella doesn't have the fewest marbles of three children.", "Ella has fewer marbles than Kai."],
            interactQuestion: "Who has the most marbles?",
            interactOptions: ["Ella", "Kai", "The third child", "Ella and Kai", "Cannot tell"],
            interactCorrectAnswer: "Kai",
            interactExplanation: "Ella doesn't have the fewest, but Kai has more than Ella. So Kai has the most. ✓"
          },
          {
            name: "Oliver",
            scenario: "correcting a logic error in his homework",
            clues: ["Hugo didn't score the highest of three children.", "Hugo scored higher than Ravi."],
            question: "Who scored the lowest?",
            people: ["Hugo", "Ravi", "Third child"],
            correctOrder: ["Third child", "Hugo", "Ravi"],
            diagram: "Highest → Third child → Hugo → Ravi → Lowest",
            friendWrong: "Hugo",
            friendReason: "because 'didn't score the highest' must mean he scored lowest",
            whyWrong: "Hugo scored higher than Ravi, so Ravi scored the lowest! Hugo is in the middle.",
            options: ["Hugo", "Ravi", "The third child", "Hugo and Ravi", "Cannot tell"],
            correctAnswer: "Ravi",
            explanation: "Hugo didn't get the highest score, but he beat Ravi. So Ravi scored the lowest. ✓",
            interactClues: ["Ruby is not the lightest of three friends.", "Ruby is lighter than Finn."],
            interactQuestion: "Who is the heaviest?",
            interactOptions: ["Ruby", "Finn", "The third friend", "Ruby and Finn", "Cannot tell"],
            interactCorrectAnswer: "Finn",
            interactExplanation: "Ruby isn't the lightest, but Finn is heavier than Ruby. So Finn is the heaviest. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did they fall for the negation trap?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n${v.clues.map(c => `• ${c}`).join('\n')}\n\n**${v.question}**\n\nSomeone answered **"${v.friendWrong}"** — ${v.friendReason}.\n\nIs that right?`,
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "Draw the order to avoid the trap!",
            body: (v) => `${v.whyWrong}\n\nThe best way to avoid negation traps is to **draw the full order**. Then you can SEE where everyone belongs.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Clue: ${v.clues[0]}`, why: "This tells us their position is NOT at the top" },
                  { text: `Clue: ${v.clues[1]}`, why: "This tells us someone is BELOW them" },
                  { text: `Draw: ${v.diagram}`, why: `${v.whyWrong} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Don't fall for the trap! Draw the order:\n\n${v.interactClues.map(c => `• ${c}`).join('\n')}`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
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
            title: () => "Negation trap? Not a chance!",
            body: () => `You've mastered this. Every time you see "not" or "isn't", just remember:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. DON'T assume the opposite extreme", why: "Not tallest ≠ shortest, not first ≠ last" },
                  { text: "2. Draw the full order using ALL clues", why: "The diagram shows you their actual position" },
                  { text: "3. There are usually positions in between!", why: "With 3+ people, the middle exists ✓" }
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

  
];

// ============================================================
// Supplementary sub-concepts for Reading Comprehension
// To merge: add these to lessonBank.comprehension.subConcepts array in lessonData.js
// ============================================================

export const comprehensionSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: retrieval
  // Finding Facts in the Text
  // Category: core
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "retrieval",
    name: "Finding Facts in the Text",
    category: "core",
    lessons: [
      // ---- Lesson A: Step-by-Step ----
      {
        id: "retrieval-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to scan a passage for specific facts — like being a detective searching for clues!",
          "How to find answers that are stated directly in the text (the answer is right there, you just need to find it)"
        ],
        variableSets: [
          {
            name: "Aisha",
            passage: "The old lighthouse stood at the edge of Whitby cliff, its red and white stripes fading after years of Atlantic storms. Mr Hartley had been the keeper for thirty-seven years, climbing the one hundred and forty-two steps every evening to light the great lamp. His daughter, Meg, often brought him a flask of tea and a cheese sandwich at sunset. She loved watching the beam sweep across the dark water. Last Tuesday, the council told Mr Hartley he could finally retire, but he shook his head. 'The ships still need me,' he said quietly. Meg smiled because she knew he would never leave. The lighthouse was not just his job — it was his home, his purpose, and the only life he had ever known.",
            question: "How many steps does Mr Hartley climb every evening?",
            options: ["Thirty-seven", "One hundred and forty-two", "One hundred", "Thirty-two", "Fifty-seven"],
            correctAnswer: "One hundred and forty-two",
            evidenceLine: "climbing the one hundred and forty-two steps every evening",
            keyWord: "steps",
            interactQuestion: "How many years has Mr Hartley been the lighthouse keeper?",
            interactOptions: ["One hundred and forty-two", "Thirty-seven", "Twenty-five", "Forty-two", "Fifty"],
            interactCorrectAnswer: "Thirty-seven",
            interactEvidenceLine: "Mr Hartley had been the keeper for thirty-seven years",
            interactKeyWord: "years"
          },
          {
            name: "Ben",
            passage: "Every Saturday morning, the farmers' market filled the cobbled square in Dorchester. Mrs Okoro always arrived first, setting up her stall of homemade jams and chutneys at half past six. She had won the Best Preserve award three times, and her strawberry jam was famous across the county. By eight o'clock, a queue would stretch past the church. Her secret ingredient was a tiny pinch of black pepper, which she added to every batch. People begged her for the recipe, but Mrs Okoro just laughed and shook her head. 'Some things are worth keeping to yourself,' she would say, tucking the old recipe card back into her apron pocket.",
            question: "What time does Mrs Okoro arrive at the market?",
            options: ["Seven o'clock", "Eight o'clock", "Half past six", "Quarter to seven", "Six o'clock"],
            correctAnswer: "Half past six",
            evidenceLine: "setting up her stall of homemade jams and chutneys at half past six",
            keyWord: "time",
            interactQuestion: "How many times has Mrs Okoro won the Best Preserve award?",
            interactOptions: ["Twice", "Three times", "Four times", "Once", "Five times"],
            interactCorrectAnswer: "Three times",
            interactEvidenceLine: "She had won the Best Preserve award three times",
            interactKeyWord: "award"
          },
          {
            name: "Charlie",
            passage: "The Year Five class at Bridport Primary had been raising money for the local animal shelter since September. Their teacher, Miss Reeves, helped them organise three events: a sponsored walk along the Jurassic Coast, a cake sale in the school hall, and a talent show on the last day of term. Altogether, they raised four hundred and twelve pounds. The sponsored walk brought in the most — nearly half the total. When they visited the shelter in December, they met a three-legged dog called Biscuit and a tabby cat named Marmalade. Every child agreed that Biscuit was their favourite. Miss Reeves promised they could visit again in the spring.",
            question: "How much money did the class raise altogether?",
            options: ["Three hundred pounds", "Four hundred and twelve pounds", "Five hundred pounds", "Two hundred and twelve pounds", "Four hundred and twenty pounds"],
            correctAnswer: "Four hundred and twelve pounds",
            evidenceLine: "Altogether, they raised four hundred and twelve pounds",
            keyWord: "money",
            interactQuestion: "What was the name of the three-legged dog at the shelter?",
            interactOptions: ["Marmalade", "Biscuit", "Buddy", "Patch", "Rusty"],
            interactCorrectAnswer: "Biscuit",
            interactEvidenceLine: "they met a three-legged dog called Biscuit",
            interactKeyWord: "dog"
          },
          {
            name: "Daisy",
            passage: "On the morning of the village fete, rain hammered against the windows of Rose Cottage. Thomas groaned and pulled the curtains shut. He had spent two weeks building a wooden go-kart for the race, painting it bright green with a silver lightning bolt on each side. His grandmother, Nana Joy, had helped him attach the wheels using bolts from her garden shed. The race was due to start at midday on the playing field behind St Mary's Church. By eleven o'clock the clouds had cleared, and Thomas carried the go-kart down the lane, grinning from ear to ear. Seven other children had entered the race. Thomas finished third, but he did not mind one bit — Nana Joy cheered the loudest of anyone.",
            question: "What colour did Thomas paint his go-kart?",
            options: ["Bright red", "Dark blue", "Bright green", "Silver", "Yellow"],
            correctAnswer: "Bright green",
            evidenceLine: "painting it bright green with a silver lightning bolt on each side",
            keyWord: "colour",
            interactQuestion: "What position did Thomas finish in the race?",
            interactOptions: ["First", "Second", "Third", "Fourth", "Last"],
            interactCorrectAnswer: "Third",
            interactEvidenceLine: "Thomas finished third",
            interactKeyWord: "finished"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you find the fact?",
            body: (v) => `Did you know some comprehension questions are basically treasure hunts? The answer is written right there in the text — you just need to track it down! Read the passage below:\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Step by step: finding facts",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Here is how to find a fact in a passage. Let's practise with this question:\n\n**${v.question}**`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: "Step 1: Read the question carefully", why: `What exactly is it asking? It wants to know: "${v.question}"` },
                    { text: `Step 2: Spot the key word — "${v.keyWord}"`, why: "This is the word you will scan the passage for." },
                    { text: "Step 3: Scan the passage for that key word", why: `Look for where "${v.keyWord}" appears in the text.` },
                    { text: `Step 4: Read the sentence around it`, why: `The passage says: "${v.evidenceLine}"` },
                    { text: `Answer: ${v.correctAnswer}`, why: "The fact was stated directly in the text. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Read the question carefully — what exactly is it asking?`,
                `Find the key word in the question`,
                `Scan the passage for that key word`,
                `Read the sentence around it to find the answer`
              ],
              feedback: {
                correct: (v) => `Perfect! Read the question, find the key word, scan the passage, then read around it. ✓`,
                incorrect: (v) => `Not quite — start by reading the question, then find the key word to scan for in the passage.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Read the passage below:`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Find the evidence:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! The passage says: "${v.interactEvidenceLine}" — so the answer is **${v.interactCorrectAnswer}**. ✓`,
                incorrect: (v) => `Not quite! Look for the key word "${v.interactKeyWord}" in the passage. It says: "${v.interactEvidenceLine}" — so the answer is **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The retrieval recipe — you've got it!",
            body: () => `When a question asks for a **fact**, the answer is hiding in the passage. Here is your foolproof method:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Read the question — what does it want?", why: "Who? What? When? Where? How many?" },
                  { text: "Step 2: Find the key word in the question", why: "This is the word you will search for in the passage." },
                  { text: "Step 3: Scan the passage for that key word", why: "Run your eyes through the text until you spot it." },
                  { text: "Step 4: Read the sentence around it carefully", why: "The answer will be right there in the text. ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Curiosity-Hook (Trickier Retrieval) ----
      {
        id: "retrieval-tricky",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to find answers spread across more than one sentence — these are the sneaky questions!",
          "Why you must read carefully — not just grab the first thing you see (the exam loves setting traps here)"
        ],
        variableSets: [
          {
            name: "Ella",
            passage: "The school trip to Bristol Zoo had been planned for months. Miss Shah booked the coach for Wednesday the fourteenth of March. Twenty-eight children signed up, but on the day itself, three were off sick with colds. The zoo opened at nine o'clock, but the coach did not arrive until quarter past because of traffic on the motorway. After a quick headcount in the car park, Miss Shah led the group straight to the penguin enclosure. They spent the rest of the morning watching feeding time and sketching animals in their notebooks.",
            question: "How many children actually went on the trip?",
            options: ["Twenty-eight", "Twenty-five", "Thirty-one", "Twenty-three", "Twenty-six"],
            correctAnswer: "Twenty-five",
            evidenceLine: "Twenty-eight children signed up, but on the day itself, three were off sick",
            explanation: "28 signed up, but 3 were off sick, so 28 − 3 = 25 actually went.",
            trap: "Twenty-eight",
            trapReason: "That is how many signed up, not how many went",
            interactQuestion: "What time did the coach actually arrive at the zoo?",
            interactOptions: ["Nine o'clock", "Quarter past nine", "Half past nine", "Ten o'clock", "Quarter to nine"],
            interactCorrectAnswer: "Quarter past nine",
            interactExplanation: "The zoo opened at nine o'clock, but the coach did not arrive until quarter past — so it arrived at quarter past nine.",
            interactTrap: "Nine o'clock",
            interactTrapReason: "That is when the zoo opened, not when the coach arrived"
          },
          {
            name: "Finn",
            passage: "Grandpa Ted kept a vegetable patch at the bottom of his garden in Taunton. Every spring he planted rows of carrots, potatoes, and runner beans. This year he added something new: a small patch of sunflowers along the back fence. He planted twelve seeds on the first weekend of April. By June, nine of them had grown into tall, golden flowers. Grandpa Ted was delighted. He cut the three tallest and gave them to his neighbour, Mrs Briggs, who put them in a blue vase on her kitchen windowsill.",
            question: "How many sunflowers did Grandpa Ted keep for himself?",
            options: ["Twelve", "Nine", "Six", "Three", "Eight"],
            correctAnswer: "Six",
            evidenceLine: "nine of them had grown into tall, golden flowers. He cut the three tallest and gave them to his neighbour",
            explanation: "9 grew successfully, and he gave 3 away, so 9 − 3 = 6 remained.",
            trap: "Nine",
            trapReason: "That is how many grew, not how many he kept",
            interactQuestion: "How many sunflower seeds did not grow into flowers?",
            interactOptions: ["Nine", "Three", "Six", "Twelve", "Four"],
            interactCorrectAnswer: "Three",
            interactExplanation: "He planted 12 seeds, and 9 grew into flowers, so 12 − 9 = 3 did not grow.",
            interactTrap: "Twelve",
            interactTrapReason: "That is how many seeds he planted, not how many failed to grow"
          },
          {
            name: "Grace",
            passage: "Priya's family drove to Lyme Regis for a fossil-hunting day out. They left home at half past seven and the journey took two hours. The beach was already busy when they arrived, but Priya found a quiet spot near the rocks. In the first hour she found four small ammonites. After lunch she found another six, including one that was almost the size of her hand. Her younger brother, Ravi, found just two all day, so Priya gave him her three smallest ones to make him feel better.",
            question: "How many fossils did Priya have at the end of the day?",
            options: ["Ten", "Seven", "Six", "Four", "Twelve"],
            correctAnswer: "Seven",
            evidenceLine: "four small ammonites ... another six ... gave him her three smallest ones",
            explanation: "4 + 6 = 10 found in total, then she gave 3 away, so 10 − 3 = 7.",
            trap: "Ten",
            trapReason: "That is how many she found before giving some to Ravi",
            interactQuestion: "How many fossils did Ravi have at the end of the day?",
            interactOptions: ["Two", "Three", "Five", "Four", "Seven"],
            interactCorrectAnswer: "Five",
            interactExplanation: "Ravi found 2 himself, then Priya gave him 3 of hers, so 2 + 3 = 5 altogether.",
            interactTrap: "Two",
            interactTrapReason: "That is how many Ravi found himself, not counting the ones Priya gave him"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you piece the answer together?",
            body: (v) => `Read this passage carefully — here's the twist: the answer is NOT in one single sentence!\n\nSometimes you need to **combine information** from different parts of the text, like piecing together a jigsaw. Watch out for traps!\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Read carefully — do not grab the first number!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Question: ${v.question}**\n\nA common mistake is to pick **${v.trap}** — but ${v.trapReason.toLowerCase()}. You need to read the whole passage and **combine the clues**.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Trap answer: ${v.trap}`, why: `${v.trapReason} — do not fall for it!` },
                    { text: `Evidence: "${v.evidenceLine}"`, why: "The real clues are spread across these sentences." },
                    { text: `Working: ${v.explanation}`, why: "Combine the facts to get the true answer." },
                    { text: `Correct answer: ${v.correctAnswer}`, why: "You needed information from more than one sentence. ✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Read the passage below:`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Find the evidence:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.interactExplanation} The answer is **${v.interactCorrectAnswer}**. ✓`,
                incorrect: (v) => `Not quite! Be careful — ${v.interactTrapReason.toLowerCase()}. ${v.interactExplanation} The answer is **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Tricky retrieval tips — you're ready for these!",
            body: () => `Some retrieval questions try to catch you out by spreading the answer across different sentences. Now you know the trick:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Read the whole passage, not just one sentence", why: "The answer may be spread across the text." },
                  { text: "Step 2: Watch for words like 'but', 'then', 'after', 'however'", why: "These signal that something changed." },
                  { text: "Step 3: Check if the first number you find is the final answer", why: "It might be a trap — read on to see if it changes. ✓" }
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
  // SUB-CONCEPT 2: inference
  // Reading Between the Lines
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "inference",
    name: "Reading Between the Lines",
    category: "core",
    lessons: [
      // ---- Lesson A: Step-by-Step ----
      {
        id: "inference-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to work out something the author has not said directly — you'll be reading between the lines like a pro!",
          "How to use clues in the text to make a sensible guess (it's like being a reading detective)"
        ],
        variableSets: [
          {
            name: "Harley",
            passage: "Mia pushed open the front door and dropped her school bag on the floor without a word. She stomped up the stairs, her shoes leaving muddy prints on every step. Her bedroom door slammed so hard that the family photo on the landing wall wobbled. Downstairs, her mother put down the magazine she was reading and sighed. She filled the kettle and placed two mugs on the counter — one with a tea bag and one with hot chocolate powder. Then she carried the hot chocolate upstairs and knocked gently on Mia's door.",
            question: "How is Mia feeling when she gets home?",
            options: ["Excited and happy", "Upset or angry", "Tired and sleepy", "Bored and restless", "Frightened and scared"],
            correctAnswer: "Upset or angry",
            clue1: "dropped her school bag without a word",
            clue2: "stomped up the stairs",
            clue3: "door slammed so hard",
            inference: "Mia is upset or angry — she did not speak, she stomped, and she slammed the door",
            interactQuestion: "Why does Mia's mother make hot chocolate and bring it upstairs?",
            interactOptions: ["She wants to comfort Mia and show she cares", "She is thirsty and wants a drink herself", "She wants to tell Mia off for slamming the door", "She always makes hot chocolate at that time of day", "She wants Mia to come back downstairs"],
            interactCorrectAnswer: "She wants to comfort Mia and show she cares",
            interactClue1: "filled the kettle and placed two mugs — one for herself, one for Mia",
            interactClue2: "carried the hot chocolate upstairs and knocked gently",
            interactClue3: "she sighed but did not shout or get angry — she responded with kindness",
            interactInference: "Mia's mother wants to comfort her — she makes a warm drink and approaches gently, showing she cares"
          },
          {
            name: "Jude",
            passage: "The classroom fell silent when Mr Okonkwo placed the test papers face down on each desk. Lily's hands were shaking as she turned hers over. She read the first question and her eyes widened. A grin spread slowly across her face. She picked up her pen and began writing immediately, her hand moving quickly and confidently across the page. By the time Mr Okonkwo called 'five minutes left', Lily had already turned her paper over and was sitting back in her chair, arms folded, still smiling.",
            question: "How does Lily feel about the test?",
            options: ["Confused and lost", "Nervous the whole time", "Confident and pleased", "Bored and uninterested", "Angry about the questions"],
            correctAnswer: "Confident and pleased",
            clue1: "a grin spread slowly across her face",
            clue2: "writing immediately, hand moving quickly and confidently",
            clue3: "sitting back in her chair, arms folded, still smiling",
            inference: "Lily is confident and pleased — she smiled, wrote confidently, and finished early",
            interactQuestion: "How did Lily feel BEFORE she turned the paper over?",
            interactOptions: ["Nervous and anxious", "Confident and relaxed", "Bored and uninterested", "Angry and frustrated", "Completely calm with no worries"],
            interactCorrectAnswer: "Nervous and anxious",
            interactClue1: "the classroom fell silent — tense atmosphere",
            interactClue2: "her hands were shaking as she turned hers over",
            interactClue3: "her reaction changed AFTER she read the first question — suggesting she was worried before",
            interactInference: "Lily was nervous before seeing the paper — her hands were shaking, but her mood changed once she saw the questions"
          },
          {
            name: "Kira",
            passage: "Sam sat on the bench at the edge of the playground, pulling at a loose thread on his jumper. Around him, children laughed and chased each other in the autumn sunshine. A football rolled towards his feet and someone shouted 'Pass it back!', but Sam just nudged it away gently without looking up. He opened his lunchbox but closed it again after staring at the sandwich inside for a moment. When the bell rang, he was the last to stand up and the slowest to walk back to class.",
            question: "How is Sam feeling at breaktime?",
            options: ["Excited to play", "Sad or lonely", "Hungry and impatient", "Angry at his friends", "Happy and relaxed"],
            correctAnswer: "Sad or lonely",
            clue1: "sat on the bench at the edge of the playground",
            clue2: "nudged it away gently without looking up",
            clue3: "closed it again after staring at the sandwich",
            inference: "Sam is sad or lonely — he sits apart, ignores the ball, has no appetite, and is slow to go back",
            interactQuestion: "Does Sam want to join in with the other children?",
            interactOptions: ["No — he is deliberately keeping himself apart", "Yes — he is desperate to play but too shy", "Yes — he is about to join in after eating", "No — he prefers reading to playing", "Yes — he is waiting for an invitation"],
            interactCorrectAnswer: "No — he is deliberately keeping himself apart",
            interactClue1: "sat at the edge of the playground, not in the middle",
            interactClue2: "when the football came to him, he nudged it away without looking up",
            interactClue3: "he was the last to stand up and the slowest to walk back — no enthusiasm",
            interactInference: "Sam does not want to join in — he ignores the ball, stays on the edge, and shows no interest in the others"
          },
          {
            name: "Layla",
            passage: "Nana Roberts placed a large cardboard box on the kitchen table and took a step back. Ruby tore off the brown tape and pulled back the flaps. Inside, wrapped in tissue paper, was a pair of bright red ice skates with silver blades. Ruby's mouth fell open. She lifted them out carefully, holding them at arm's length as if they might break. Then she threw her arms around Nana Roberts so tightly that the old woman laughed and said, 'Steady on!' Ruby tried them on immediately, walking up and down the kitchen tiles in her socks and skates.",
            question: "How does Ruby feel about the present?",
            options: ["Disappointed and upset", "Thrilled and grateful", "Confused and unsure", "Polite but uninterested", "Nervous about using them"],
            correctAnswer: "Thrilled and grateful",
            clue1: "Ruby's mouth fell open",
            clue2: "threw her arms around Nana Roberts",
            clue3: "tried them on immediately",
            inference: "Ruby is thrilled — her mouth falls open in surprise, she hugs Nana, and she tries them on straight away",
            interactQuestion: "Did Ruby know what was in the box before she opened it?",
            interactOptions: ["No — she was genuinely surprised", "Yes — she had asked for ice skates", "Yes — she had peeked inside earlier", "No — but she was not interested", "Yes — Nana Roberts had told her"],
            interactCorrectAnswer: "No — she was genuinely surprised",
            interactClue1: "Ruby's mouth fell open — a sign of surprise, not expectation",
            interactClue2: "she lifted them out carefully, as if they might break — she is in awe",
            interactClue3: "she held them at arm's length — she is taking it in, not acting like she already knew",
            interactInference: "Ruby did not know what was inside — her open mouth, careful handling, and immediate excitement all show genuine surprise"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "What is the author really telling you?",
            body: (v) => `Here's the interesting part — the author doesn't say the answer directly! But there are **clues** hidden in the text, like breadcrumbs leading to the answer. Can you spot them?\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Step by step: reading between the lines",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Question: ${v.question}**\n\n**Inference** (working out something not directly said, using clues) means figuring out what the author really means. You look for **clues** in the text and put them together.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: "Step 1: Read the question — what does it want?", why: `It asks: "${v.question}"` },
                    { text: `Step 2: Find clue 1 — "${v.clue1}"`, why: "What does this action suggest?" },
                    { text: `Step 3: Find clue 2 — "${v.clue2}"`, why: "Another piece of evidence." },
                    { text: `Step 4: Find clue 3 — "${v.clue3}"`, why: "Even more evidence pointing the same way." },
                    { text: `Inference: ${v.inference}`, why: "Put the clues together to reach the answer. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Read the question — what does it want you to work out?`,
                `Find clues in the passage that hint at the answer`,
                `Put the clues together — what do they all suggest?`,
                `Choose the answer that is best supported by the clues`
              ],
              feedback: {
                correct: (v) => `Perfect! Read the question, find clues, combine them, then choose the best-supported answer. ✓`,
                incorrect: (v) => `Not quite — start by understanding the question, then hunt for clues in the passage to support your inference.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Read the passage below:`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Find the evidence:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactInference}. The clues all point to **${v.interactCorrectAnswer}**. ✓`,
                incorrect: (v) => `Not quite! Look at the clues: "${v.interactClue1}", "${v.interactClue2}", "${v.interactClue3}". Together they tell us the answer is **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The inference recipe — brilliant work!",
            body: () => `When the answer is **not stated directly**, you're being asked to **infer** — and now you know how:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Notice when the answer is NOT written in the text", why: "If you cannot point to an exact sentence, you need to infer." },
                  { text: "Step 2: Hunt for clues — actions, feelings, descriptions", why: "How do characters behave? What words does the author use?" },
                  { text: "Step 3: Put the clues together", why: "Do they all point in the same direction?" },
                  { text: "Step 4: Choose the answer that fits ALL the clues", why: "Not just one clue — all of them. ✓" }
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
        id: "inference-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid common wrong inferences (guesses based on clues) — don't fall into the one-clue trap!",
          "Why you must check your inference against ALL the clues, not just one"
        ],
        variableSets: [
          {
            name: "Max",
            passage: "Oliver walked into the kitchen and found his mother standing at the counter. She was wearing her best dress and high heels. A large chocolate cake sat on the table with candles on top, and coloured balloons were tied to the backs of the chairs. 'Don't touch anything!' she said, wagging her finger but smiling. Oliver peeked into the fridge and saw bowls of crisps, a trifle, and rows of sausage rolls wrapped in cling film.",
            question: "What is about to happen at Oliver's house?",
            wrongAnswer: "Oliver's mother is going out for a meal",
            wrongReason: "She is wearing her best dress, but the food and balloons show a party is being prepared at home, not a meal out",
            correctAnswer: "A party or celebration is being prepared",
            options: ["Oliver's mother is going out for a meal", "A party or celebration is being prepared", "Oliver is in trouble for something", "The family is moving house", "Oliver is cooking dinner"],
            clues: "best dress, chocolate cake with candles, balloons, party food in the fridge",
            interactQuestion: "Who do you think the party is most likely for?",
            interactOptions: ["Oliver's mother", "Oliver", "A family friend", "The whole neighbourhood", "No one in particular"],
            interactCorrectAnswer: "Oliver",
            interactClues: "chocolate cake with candles (birthday cake), 'Don't touch anything!' (surprise), Oliver does not seem to know what is happening"
          },
          {
            name: "Nadia",
            passage: "Year Six filed into the hall and sat cross-legged on the floor. Mrs Chapman stood at the front beside a large screen showing a photograph of a sandy beach. She held up a thick booklet and said, 'This is your information pack — please do NOT lose it.' The children whispered excitedly to each other. Jamie asked if they would need their swimming costumes, and Mrs Chapman nodded. 'And suncream,' she added. 'Your parents have already signed the consent forms.'",
            question: "What is Mrs Chapman talking about?",
            wrongAnswer: "A swimming lesson at the local pool",
            wrongReason: "Swimming costumes are mentioned, but the beach photo, information pack, suncream, and consent forms all point to a school trip, not a regular swimming lesson",
            correctAnswer: "A school trip to the seaside",
            options: ["A swimming lesson at the local pool", "A school trip to the seaside", "A geography lesson about beaches", "A sports day event", "A holiday Mrs Chapman went on"],
            clues: "photograph of a sandy beach, information pack, swimming costumes, suncream, consent forms",
            interactQuestion: "How do the children feel about what Mrs Chapman is telling them?",
            interactOptions: ["Bored and uninterested", "Worried and scared", "Excited and enthusiastic", "Confused and puzzled", "Angry and upset"],
            interactCorrectAnswer: "Excited and enthusiastic",
            interactClues: "whispered excitedly, Jamie eagerly asked about swimming costumes, parents already signed consent forms showing anticipation"
          },
          {
            name: "Oscar",
            passage: "Dad crept down the stairs in the dark, holding a torch and a net. He opened the back door very slowly, wincing when it creaked. Outside, the garden was silver with moonlight. Something rustled in the rose bushes. Dad switched on the torch and a pair of bright eyes stared back at him. A hedgehog was tangled in the old football net that had been left out. Dad knelt down carefully, pulled on his gardening gloves, and began cutting the net away with scissors.",
            question: "Why did Dad go outside in the dark?",
            wrongAnswer: "He heard a burglar in the garden",
            wrongReason: "Something rustled and he took a torch, but he also brought a net and gloves — he was rescuing an animal caught in a net, not confronting a burglar",
            correctAnswer: "To rescue an animal caught in a net",
            options: ["He heard a burglar in the garden", "To rescue an animal caught in a net", "To do some late-night gardening", "To look at the moon", "To find a lost football"],
            clues: "torch and a net, gardening gloves, hedgehog tangled in the football net, cutting the net with scissors",
            interactQuestion: "What kind of person does Dad seem to be?",
            interactOptions: ["Careless and lazy", "Kind and gentle", "Angry and impatient", "Nervous and frightened", "Strict and serious"],
            interactCorrectAnswer: "Kind and gentle",
            interactClues: "crept carefully in the dark, opened the door slowly, knelt down carefully, pulled on gloves to protect both himself and the hedgehog, cut the net away patiently"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the wrong inference?",
            body: (v) => `Someone answered: **"${v.wrongAnswer}"**\n\nThat sounds possible — but it is wrong! Can you see why?\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Check your inference against ALL the clues!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Question: ${v.question}**\n\nThe wrong answer was: **"${v.wrongAnswer}"**.\n\n${v.wrongReason}.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Wrong answer: "${v.wrongAnswer}"`, why: `${v.wrongReason}.` },
                    { text: `All the clues: ${v.clues}`, why: "Do ALL of these fit the wrong answer? No!" },
                    { text: `Correct answer: "${v.correctAnswer}"`, why: "This answer fits every clue in the passage. ✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Read the passage below:`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Find the evidence:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! The clues (${v.interactClues}) all point to **"${v.interactCorrectAnswer}"**. ✓`,
                incorrect: (v) => `Not quite! Look at the clues: ${v.interactClues}. They tell us the answer is **"${v.interactCorrectAnswer}"**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Avoid wrong inferences — you're on it!",
            body: () => `A wrong inference happens when you only look at **one** clue and ignore the rest. Now you know better:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Find ALL the clues, not just one", why: "One clue can be misleading on its own." },
                  { text: "Step 2: Check if your answer fits EVERY clue", why: "If it does not fit one of them, rethink." },
                  { text: "Step 3: Pick the answer that explains everything", why: "The best inference covers all the evidence. ✓" }
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
  // SUB-CONCEPT 3: vocab-in-context
  // Word Meaning from the Passage
  // Category: core
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "vocab-in-context",
    name: "Word Meaning from the Passage",
    category: "core",
    lessons: [
      // ---- Lesson A: Step-by-Step ----
      {
        id: "vocab-in-context-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to work out what an unfamiliar word means using the sentence around it — the clues are always there!",
          "How to check your guess makes sense in context"
        ],
        variableSets: [
          {
            name: "Poppy",
            passage: "The river had swollen overnight after hours of heavy rain. Brown water rushed over the banks and flooded the footpath. Mr Allen watched from his cottage window with a grave expression. He knew that if the water kept rising, the bridge would be completely submerged by morning. He telephoned the council to warn them, then began moving sandbags from his shed to the front door. His wife brought blankets and torches downstairs, just in case they needed to leave quickly.",
            question: "What does the word 'grave' mean in this passage?",
            targetWord: "grave",
            wordInSentence: "Mr Allen watched from his cottage window with a grave expression",
            correctMeaning: "Very serious and worried",
            options: ["Very serious and worried", "A place where someone is buried", "Angry and shouting", "Sleepy and bored", "Cheerful and relaxed"],
            surroundingClues: "the river had swollen, flooded the footpath, water kept rising — serious danger",
            wrongMeaning: "A place where someone is buried",
            whyWrong: "That is another meaning of 'grave', but here it describes Mr Allen's expression — his face looked serious",
            interactTargetWord: "submerged",
            interactWordInSentence: "the bridge would be completely submerged by morning",
            interactCorrectMeaning: "Covered completely by water",
            interactOptions: ["Covered completely by water", "Destroyed and broken apart", "Repaired and rebuilt", "Frozen solid", "Washed downstream"],
            interactSurroundingClues: "river swollen, water rushed over the banks, water kept rising — the bridge would be underwater"
          },
          {
            name: "Reuben",
            passage: "The museum was dimly lit and the air smelled of old wood and dust. Class 5B followed their guide through a narrow corridor lined with glass cases. Inside one case, a collection of ancient Roman coins gleamed under a small spotlight. 'These coins are remarkably well preserved,' the guide explained. 'They were discovered in a field near Bath and are over two thousand years old. The farmer who found them was astonished — he had only been looking for a lost sheep.'",
            question: "What does the word 'preserved' mean in this passage?",
            targetWord: "preserved",
            wordInSentence: "These coins are remarkably well preserved",
            correctMeaning: "Kept in good condition over time",
            options: ["Kept in good condition over time", "Hidden from view", "Made of expensive metal", "Covered in dirt", "Recently polished"],
            surroundingClues: "ancient Roman coins, gleamed under a spotlight, over two thousand years old — still in good shape",
            wrongMeaning: "Recently polished",
            whyWrong: "The coins are over two thousand years old — 'preserved' means they lasted well, not that someone just polished them",
            interactTargetWord: "astonished",
            interactWordInSentence: "The farmer who found them was astonished",
            interactCorrectMeaning: "Extremely surprised and amazed",
            interactOptions: ["Extremely surprised and amazed", "Annoyed and frustrated", "Calm and unbothered", "Frightened and worried", "Confused and lost"],
            interactSurroundingClues: "he had only been looking for a lost sheep but found ancient Roman coins — completely unexpected discovery"
          },
          {
            name: "Seren",
            passage: "The village fair was in full swing. Music blared from a speaker near the bouncy castle, and the smell of fried onions drifted across the field. At the tombola stall, Mrs Darcy was doing a roaring trade — a long queue of people waited patiently, each clutching a strip of raffle tickets. 'I have never seen it this busy!' she said, beaming at her husband as she handed over yet another prize. By two o'clock, she had completely run out of prizes and had to close the stall early.",
            question: "What does the word 'roaring' mean in this passage?",
            targetWord: "roaring",
            wordInSentence: "Mrs Darcy was doing a roaring trade",
            correctMeaning: "Extremely busy and successful",
            options: ["Extremely busy and successful", "Very loud and noisy", "Angry and aggressive", "Slow and steady", "Frightening and scary"],
            surroundingClues: "long queue, never seen it this busy, completely run out of prizes — the stall was hugely popular",
            wrongMeaning: "Very loud and noisy",
            whyWrong: "'Roaring' can mean loud, but 'doing a roaring trade' is an expression that means selling a lot — being very busy and successful",
            interactTargetWord: "beaming",
            interactWordInSentence: "she said, beaming at her husband",
            interactCorrectMeaning: "Smiling widely with joy",
            interactOptions: ["Smiling widely with joy", "Staring angrily", "Shining a light towards", "Shouting loudly", "Looking nervously"],
            interactSurroundingClues: "huge success, never seen it this busy, handed over yet another prize — she is delighted"
          },
          {
            name: "Toby",
            passage: "The January wind was bitter as Emily walked to school. She pulled her scarf tighter and buried her chin in the thick wool. The puddles on the pavement had frozen solid overnight, and she had to tread carefully to avoid slipping. At the school gate, she noticed that the old oak tree had shed its last remaining leaves. Its bare branches stretched across the grey sky like bony fingers. Emily shivered and hurried inside, grateful for the warmth of the corridor.",
            question: "What does the word 'bitter' mean in this passage?",
            targetWord: "bitter",
            wordInSentence: "The January wind was bitter",
            correctMeaning: "Extremely cold and unpleasant",
            options: ["Extremely cold and unpleasant", "Having a sharp, sour taste", "Angry and resentful", "Gentle and mild", "Dark and stormy"],
            surroundingClues: "January wind, pulled her scarf tighter, puddles frozen solid, shivered — very cold weather",
            wrongMeaning: "Having a sharp, sour taste",
            whyWrong: "'Bitter' can describe taste, but here it describes the wind in January — it means painfully cold",
            interactTargetWord: "bare",
            interactWordInSentence: "Its bare branches stretched across the grey sky",
            interactCorrectMeaning: "Without any covering or leaves",
            interactOptions: ["Without any covering or leaves", "Made of wood", "Very thick and strong", "Colourful and bright", "Broken and damaged"],
            interactSurroundingClues: "January, shed its last remaining leaves, grey sky — the tree has no leaves left, its branches are exposed"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "What does this word mean HERE?",
            body: (v) => `The question asks: **What does "${v.targetWord}" mean in this passage?**\n\nHere's the thing — some words have more than one meaning! The surrounding sentences are your best clue to working it out.\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Use the words around it!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Question: ${v.question}**\n\nThe word **"${v.targetWord}"** could mean different things. To find the right meaning, look at the **context** — the words and sentences around it.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Step 1: Find the word in the passage`, why: `"${v.wordInSentence}"` },
                    { text: `Step 2: Read the sentences around it`, why: `Clues: ${v.surroundingClues}` },
                    { text: `Step 3: Try each meaning`, why: `"${v.wrongMeaning}" — does that fit? ${v.whyWrong}` },
                    { text: `Step 4: Pick the meaning that fits`, why: `"${v.correctMeaning}" — this matches the context. ✓` }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: {
              type: "fill-blank",
              sentence: (v) => `To work out the meaning of an unfamiliar word, look at the ____ around it`,
              options: (v) => ["context", "spelling", "length", "font"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! The context — the words and sentences around the unfamiliar word — gives you clues to its meaning. ✓`,
                incorrect: (v) => `Not quite — you need to look at the CONTEXT (the surrounding words and sentences) to work out an unfamiliar word's meaning.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Read the passage below:\n\nThe sentence says: **"${v.interactWordInSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Find the evidence:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What does "${v.interactTargetWord}" mean in this passage?`,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectMeaning,
              feedback: {
                correct: (v) => `Brilliant! In this passage, "${v.interactTargetWord}" means **"${v.interactCorrectMeaning}"**. The surrounding clues (${v.interactSurroundingClues}) all point to this meaning. ✓`,
                incorrect: (v) => `Not quite! Look at the context: ${v.interactSurroundingClues}. Here, "${v.interactTargetWord}" means **"${v.interactCorrectMeaning}"**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The vocabulary-in-context recipe!",
            body: () => `When a question asks what a word means **in the passage**, you've got a clear method to follow:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Find the word in the passage", why: "Read the exact sentence it appears in." },
                  { text: "Step 2: Read the sentences before and after", why: "These give you context clues." },
                  { text: "Step 3: Try replacing the word with each option", why: "Which one makes the sentence still make sense?" },
                  { text: "Step 4: Pick the meaning that fits the context", why: "Not just any meaning of the word — the RIGHT meaning here. ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Curiosity-Hook (Multiple Meanings) ----
      {
        id: "vocab-in-context-multiple",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to recognise that words can change meaning depending on context",
          "Why you must always check the surrounding text"
        ],
        variableSets: [
          {
            name: "Amara",
            passage: "The school concert was only a week away and the hall was buzzing with excitement. Miss Taylor asked the choir to run through the opening number one more time. 'It needs to be light and cheerful,' she said, clapping her hands. 'Think sunshine, think spring flowers!' Amara stood in the front row, trying to keep her voice light even though her stomach was doing somersaults. She had a solo in the second verse and the thought of singing alone in front of two hundred people made her feel dizzy.",
            question: "What does the word 'light' mean in this passage?",
            targetWord: "light",
            meaningA: "Bright, gentle, and not heavy in tone",
            meaningB: "Not weighing very much",
            correctMeaning: "Bright, gentle, and not heavy in tone",
            options: ["Bright, gentle, and not heavy in tone", "Not weighing very much", "A lamp or torch", "Pale in colour", "Easy and simple"],
            wordInSentence: "It needs to be light and cheerful",
            surroundingClues: "light and cheerful, think sunshine, think spring flowers — describing the mood of the music",
            interactTargetWord: "number",
            interactWordInSentence: "run through the opening number one more time",
            interactCorrectMeaning: "A piece of music or a song in a performance",
            interactOptions: ["A piece of music or a song in a performance", "A digit used for counting", "A total or quantity", "A page in a book", "A telephone number"],
            interactSurroundingClues: "choir, concert, opening number, run through — it is a musical performance, so 'number' means a song or piece"
          },
          {
            name: "Brodie",
            passage: "Captain Wells stood at the bow of the ship and studied the horizon through his telescope. Dark clouds were gathering to the west, and the sea was beginning to swell. 'We need to make for the harbour,' he told his first mate. 'This vessel is sound, but I would rather not test her in a storm.' The crew moved quickly, hauling ropes and adjusting the sails. Within the hour, the ship was safely anchored in the shelter of Portland harbour, rocking gently as the first drops of rain began to fall.",
            question: "What does the word 'sound' mean in this passage?",
            targetWord: "sound",
            meaningA: "In good, strong condition",
            meaningB: "A noise that you hear",
            correctMeaning: "In good, strong condition",
            options: ["In good, strong condition", "A noise that you hear", "A body of water between two lands", "Deeply asleep", "A type of music"],
            wordInSentence: "This vessel is sound, but I would rather not test her in a storm",
            surroundingClues: "vessel is sound, but would rather not test her in a storm — the ship is strong enough, but the captain is being cautious",
            interactTargetWord: "make",
            interactWordInSentence: "We need to make for the harbour",
            interactCorrectMeaning: "To head towards or travel to",
            interactOptions: ["To head towards or travel to", "To build or create something", "To force someone to do something", "To earn money", "To prepare food"],
            interactSurroundingClues: "storm approaching, need to reach safety, harbour as destination — 'make for' means to head towards a place"
          },
          {
            name: "Cleo",
            passage: "The charity bake sale was a huge success. Tables were piled high with cakes, biscuits, and flapjacks. By lunchtime, most of the stalls were already bare. Mrs Fitzpatrick counted the money in the collection tin and announced that they had raised over three hundred pounds. 'That is a fair amount!' she said proudly. 'Well done to everyone who contributed.' The children cheered and high-fived each other. Even the headteacher, Mr Reeves, bought a large slice of Victoria sponge and said it was the best he had ever tasted.",
            question: "What does the word 'fair' mean in this passage?",
            targetWord: "fair",
            meaningA: "Quite large or reasonable",
            meaningB: "An outdoor event with stalls and rides",
            correctMeaning: "Quite large or reasonable",
            options: ["Quite large or reasonable", "An outdoor event with stalls and rides", "Light in colour (hair or skin)", "Following the rules equally", "Average or moderate weather"],
            wordInSentence: "That is a fair amount!",
            surroundingClues: "raised over three hundred pounds, said proudly, well done to everyone — she means it is a good, impressive amount",
            interactTargetWord: "bare",
            interactWordInSentence: "most of the stalls were already bare",
            interactCorrectMeaning: "Empty, with nothing left on them",
            interactOptions: ["Empty, with nothing left on them", "Not wearing any clothes", "Only just or scarcely", "A type of animal (bear)", "Plain and simple"],
            interactSurroundingClues: "tables were piled high at first, huge success, by lunchtime stalls were bare — everything had been sold"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Same word, different meaning!",
            body: (v) => `Did you know the word **"${v.targetWord}"** has **lots of different meanings**? English is full of words like this! Which meaning is it here?\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Context is everything!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Question: ${v.question}**\n\nThe sentence says: **"${v.wordInSentence}"**\n\nLet's look at the clues around the word to work out which meaning fits.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Find the sentence: "${v.wordInSentence}"`, why: "Read the exact words around it." },
                    { text: `Surrounding clues: ${v.surroundingClues}`, why: "These help us choose the right meaning." },
                    { text: `Try meaning B: "${v.meaningB}"`, why: "Does this fit? Read the sentence with this meaning — does it make sense?" },
                    { text: `Try meaning A: "${v.meaningA}"`, why: "This fits the context perfectly. ✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The passage says: **"${v.interactWordInSentence}"**\n\nWhat does **"${v.interactTargetWord}"** mean here?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Find the evidence:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What does "${v.interactTargetWord}" mean in this passage?`,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectMeaning,
              feedback: {
                correct: (v) => `Well done! Here, "${v.interactTargetWord}" means **"${v.interactCorrectMeaning}"**. The context (${v.interactSurroundingClues}) tells us which meaning to choose. ✓`,
                incorrect: (v) => `Not quite! That is a real meaning of "${v.interactTargetWord}", but it does not fit here. The context tells us it means **"${v.interactCorrectMeaning}"**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Words can change meaning!",
            body: () => `Many English words have **more than one meaning**. The context tells you which one the author intended:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Never assume you know the meaning", why: "The same word can mean different things in different sentences." },
                  { text: "Step 2: Read the whole sentence — not just the word", why: "The words around it are your biggest clue." },
                  { text: "Step 3: Try replacing the word with each option", why: "Which one makes the sentence still make sense? That is the right meaning. ✓" }
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
  // SUB-CONCEPT 4: author-purpose
  // Why Did the Author Write This?
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: key-fact
  // ==========================================
  {
    id: "author-purpose",
    name: "Why Did the Author Write This?",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step-by-Step ----
      {
        id: "author-purpose-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to work out if a text is meant to inform, persuade, entertain, or describe — every piece of writing has a purpose!",
          "How to spot clues that reveal the author's purpose (once you know what to look for, it's surprisingly easy)"
        ],
        variableSets: [
          {
            name: "Imogen",
            passage: "Are you tired of soggy sandwiches and boring lunches? Introducing the ThermoBox — the incredible lunchbox that keeps hot food hot and cold food cold for up to eight hours! Made from recycled materials, the ThermoBox is kind to the planet AND your tummy. With five amazing colours to choose from, you will be the envy of the whole school. Order now and get a FREE matching water bottle! Do not miss out — stocks are limited!",
            question: "What is the main purpose of this passage?",
            textType: "Persuasive (advertisement)",
            purpose: "To persuade the reader to buy a ThermoBox lunchbox",
            options: ["To persuade the reader to buy a product", "To inform the reader about lunchbox history", "To entertain the reader with a funny story", "To describe what a lunchbox looks like", "To instruct the reader how to make a lunchbox"],
            correctAnswer: "To persuade the reader to buy a product",
            clue1: "rhetorical question at the start ('Are you tired of...')",
            clue2: "exciting language ('incredible', 'amazing', 'envy')",
            clue3: "call to action ('Order now', 'Do not miss out')",
            interactPassage: "Imagine waking up every morning with a smile! The SunRise alarm clock fills your room with gentle light that slowly gets brighter, just like a real sunrise. No more horrible beeping — just a calm, natural way to start your day. Doctors recommend it. Teachers love it. And right now, you can get one for just twelve pounds ninety-nine. But hurry — this amazing offer ends Friday!",
            interactQuestion: "What is the main purpose of this passage?",
            interactOptions: ["To persuade the reader to buy a product", "To inform the reader about how alarm clocks work", "To entertain the reader with a funny story", "To describe what mornings are like", "To instruct the reader how to set an alarm"],
            interactCorrectAnswer: "To persuade the reader to buy a product",
            interactClue1: "exciting language ('amazing offer')",
            interactClue2: "call to action ('hurry', 'this offer ends Friday')",
            interactClue3: "rhetorical opening and appeals to authority ('doctors recommend it')"
          },
          {
            name: "Jack",
            passage: "Hedgehogs are one of Britain's most beloved garden visitors. These small, spiny mammals are nocturnal, meaning they are most active at night. They eat slugs, beetles, caterpillars, and earthworms, making them excellent pest controllers. Sadly, hedgehog numbers have dropped by around thirty per cent in the last ten years. The main threats include busy roads, loss of hedgerows, and the use of pesticides in gardens. You can help by leaving a small gap at the bottom of your garden fence so hedgehogs can move freely between gardens.",
            question: "What is the main purpose of this passage?",
            textType: "Informative (non-fiction report)",
            purpose: "To inform the reader about hedgehogs and how to help them",
            options: ["To inform the reader about hedgehogs", "To persuade the reader to adopt a hedgehog", "To entertain with a hedgehog adventure story", "To describe one particular hedgehog", "To give instructions for building a hedgehog house"],
            correctAnswer: "To inform the reader about hedgehogs",
            clue1: "factual statements ('nocturnal', 'dropped by around thirty per cent')",
            clue2: "neutral, informative tone — no exciting selling language",
            clue3: "gives real facts and statistics, not opinions",
            interactPassage: "The robin is one of Britain's most recognisable birds. It has a bright red breast and a brown back. Robins are territorial and will defend their patch of garden fiercely. They eat worms, insects, and berries. In winter, robins often appear on Christmas cards because they were once associated with Victorian postmen, who wore red jackets and were nicknamed 'robins'.",
            interactQuestion: "What is the main purpose of this passage?",
            interactOptions: ["To inform the reader about robins", "To persuade the reader to feed robins", "To entertain the reader with a robin adventure", "To describe one particular robin in a garden", "To instruct the reader how to attract robins"],
            interactCorrectAnswer: "To inform the reader about robins",
            interactClue1: "factual statements about appearance, diet, and behaviour",
            interactClue2: "neutral, informative tone with no persuasive language",
            interactClue3: "gives real facts and explains the Christmas card connection"
          },
          {
            name: "Kemi",
            passage: "The moment Zara stepped through the wardrobe door, she knew something had changed. The air tasted of cinnamon and starlight. A narrow path wound through a forest of silver birch trees, their leaves shimmering like tiny mirrors. A fox with bright amber eyes sat at the base of the nearest tree, watching her calmly. 'You took your time,' it said, in a voice like velvet. Zara's heart hammered. She wanted to run, but her feet would not move. The fox stood, flicked its bushy tail, and trotted down the path. 'Well?' it called over its shoulder. 'Are you coming or not?'",
            question: "What is the main purpose of this passage?",
            textType: "Narrative (fiction/story)",
            purpose: "To entertain the reader with an imaginative story",
            options: ["To entertain the reader with an imaginative story", "To inform the reader about foxes", "To persuade the reader to explore forests", "To describe a real forest in England", "To instruct the reader on how to find a wardrobe"],
            correctAnswer: "To entertain the reader with an imaginative story",
            clue1: "magical elements (talking fox, air tasted of starlight)",
            clue2: "vivid descriptions to create atmosphere",
            clue3: "story structure with characters, setting, and suspense",
            interactPassage: "Captain Bramble peered through his telescope at the tiny island ahead. 'There it is, crew!' he called from the crow's nest. 'Doubloon Island — the place no pirate has set foot on in a hundred years.' The parrot on his shoulder squawked nervously. Below deck, the crew scrambled for their swords and shovels. Somewhere on that island, a chest of gold was waiting to be found.",
            interactQuestion: "What is the main purpose of this passage?",
            interactOptions: ["To entertain the reader with an adventure story", "To inform the reader about real pirates", "To persuade the reader to visit an island", "To describe what a real island looks like", "To instruct the reader how to find treasure"],
            interactCorrectAnswer: "To entertain the reader with an adventure story",
            interactClue1: "fictional characters and setting (Captain Bramble, Doubloon Island)",
            interactClue2: "vivid descriptions to create excitement and atmosphere",
            interactClue3: "story structure with adventure, suspense, and a quest"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Why did the author write this?",
            body: (v) => `Every piece of writing has a **purpose** — a reason the author wrote it. Can you work out what this author wanted to do?\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Step by step: find the author's purpose",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Question: ${v.question}**\n\nAuthors write for different reasons: to **inform** (teach facts), to **persuade** (convince you), to **entertain** (tell a story), or to **describe** (paint a picture with words). Let's look at the clues.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: "Step 1: What kind of text is it?", why: `This is a ${v.textType.toLowerCase()}.` },
                    { text: `Step 2: Clue 1 — ${v.clue1}`, why: "What does this tell us about the purpose?" },
                    { text: `Step 3: Clue 2 — ${v.clue2}`, why: "More evidence pointing the same way." },
                    { text: `Step 4: Clue 3 — ${v.clue3}`, why: "All the clues agree." },
                    { text: `Purpose: ${v.purpose}`, why: "The clues all point to this purpose. ✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "newspaper article", right: "to inform" },
                { left: "advert", right: "to persuade" },
                { left: "fairy tale", right: "to entertain" },
                { left: "travel brochure", right: "to advise" },
                { left: "poem about a sunset", right: "to describe" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Read this new passage and answer the question below.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.interactPassage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! The clues (${v.interactClue1}, ${v.interactClue2}, ${v.interactClue3}) all show that the purpose is **${v.interactCorrectAnswer.toLowerCase()}**. ✓`,
                incorrect: (v) => `Not quite! Look at the clues: ${v.interactClue1}, ${v.interactClue2}, ${v.interactClue3}. The purpose is **${v.interactCorrectAnswer.toLowerCase()}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The author's purpose recipe!",
            body: () => `Every text is written for a **reason** — and now you can work it out like a pro:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Ask — is this fiction or non-fiction?", why: "Fiction usually entertains; non-fiction usually informs or persuades." },
                  { text: "Step 2: Look at the language", why: "Exciting language = persuade. Factual language = inform. Descriptive language = entertain/describe." },
                  { text: "Step 3: Check for persuasion clues", why: "Rhetorical questions, opinions, calls to action = persuasive text." },
                  { text: "Step 4: Name the purpose", why: "Inform, persuade, entertain, or describe. ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Key-Fact (Different Text Types) ----
      {
        id: "author-purpose-types",
        templateType: "key-fact",
        learningGoal: [
          "How to recognise different text types quickly",
          "How to link each text type to its purpose"
        ],
        variableSets: [
          {
            name: "Leo",
            passage: "Dear Editor, I am writing to express my strong concern about the plans to close Millbrook Park. This green space is used by hundreds of families every week. Children play football there, dog walkers meet friends, and elderly residents sit on the benches to enjoy fresh air. Closing the park to build a car park would be a terrible mistake. I urge the council to reconsider this decision before it is too late. Yours faithfully, Mrs D. Wilkins",
            question: "What is the main purpose of this passage?",
            textType: "Letter to a newspaper",
            purpose: "To persuade the council not to close the park",
            options: ["To persuade the council not to close the park", "To inform people about what a park looks like", "To entertain readers with a funny park story", "To describe the weather at the park", "To instruct people on how to use a park"],
            correctAnswer: "To persuade the council not to close the park",
            keyFeatures: "opinion words ('strong concern', 'terrible mistake'), call to action ('I urge'), formal letter format",
            interactQuestion: "Which feature of this text is the strongest clue that it is persuasive?",
            interactOptions: ["The call to action: 'I urge the council to reconsider'", "The mention of children playing football", "The 'Dear Editor' greeting", "The name 'Mrs D. Wilkins'", "The mention of dog walkers"],
            interactCorrectAnswer: "The call to action: 'I urge the council to reconsider'",
            interactExplanation: "A call to action — telling the reader to DO something — is one of the strongest signs of persuasive writing"
          },
          {
            name: "Maya",
            passage: "How to Make a Paper Aeroplane. You will need: one sheet of A4 paper. Step 1: Fold the paper in half lengthways, then unfold it. Step 2: Fold the top two corners down so they meet at the centre crease. Step 3: Fold the angled edges in again to meet the centre line — this makes the nose pointy. Step 4: Fold the whole thing in half along the centre crease. Step 5: Fold each side down to make the wings. Your aeroplane is ready to fly!",
            question: "What is the main purpose of this passage?",
            textType: "Instruction text (how-to guide)",
            purpose: "To instruct the reader how to make something",
            options: ["To instruct the reader how to make something", "To persuade the reader to buy a paper aeroplane", "To entertain with a story about an aeroplane", "To inform about the history of aeroplanes", "To describe a paper aeroplane race"],
            correctAnswer: "To instruct the reader how to make something",
            keyFeatures: "numbered steps, imperative verbs (bossy command words like 'fold', 'unfold'), 'You will need' list, clear sequence",
            interactQuestion: "Which language feature is the biggest clue that this is an instruction text?",
            interactOptions: ["Imperative verbs like 'fold' and 'unfold'", "The mention of paper", "The word 'aeroplane'", "The word 'ready'", "The exclamation mark at the end"],
            interactCorrectAnswer: "Imperative verbs like 'fold' and 'unfold'",
            interactExplanation: "Imperative verbs (bossy command words that tell you what to do) are the hallmark of instruction texts"
          },
          {
            name: "Noah",
            passage: "The lake lay perfectly still, a sheet of dark glass reflecting the mountains above. Mist hung low over the water, twisting and curling like smoke from a bonfire. On the far shore, a heron stood motionless, its long neck curved like a question mark. The only sound was the gentle lap of water against the pebbles at Ewan's feet. He breathed in the cold morning air and felt the tension in his shoulders melt away. This was his favourite place in the whole world — and today, he had it entirely to himself.",
            question: "What is the main purpose of this passage?",
            textType: "Descriptive writing",
            purpose: "To describe a scene and create atmosphere",
            options: ["To describe a scene and create atmosphere", "To persuade people to visit a lake", "To inform about lake wildlife", "To instruct readers how to fish", "To entertain with a mystery story"],
            correctAnswer: "To describe a scene and create atmosphere",
            keyFeatures: "similes ('like smoke', 'like a question mark'), sensory details (sight, sound, touch), vivid imagery, no action or plot",
            interactQuestion: "Which feature most clearly shows this is descriptive rather than informative writing?",
            interactOptions: ["Similes and sensory details to create atmosphere", "The mention of a heron", "The fact it is set at a lake", "The character named Ewan", "The mention of mountains"],
            interactCorrectAnswer: "Similes and sensory details to create atmosphere",
            interactExplanation: "Descriptive writing uses similes, metaphors, and sensory details to paint a picture — informative writing would use plain facts instead"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Every text type has a purpose!",
            body: (v) => `Different types of text are written for different reasons. Can you match this text to its purpose?\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Text type = purpose!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Question: ${v.question}**\n\nEvery text type has a matching purpose:\n\n**Story/narrative → Entertain** (characters, plot, dialogue)\n**Report/article → Inform** (facts, statistics, neutral tone)\n**Advert/letter → Persuade** (opinions, rhetorical questions)\n**Instructions → Instruct** (numbered steps, imperative verbs (bossy command words like 'mix', 'fold', 'pour'))\n**Description → Describe** (similes, metaphors, sensory details)\n\nThis passage is a **${v.textType.toLowerCase()}**:`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Text type: ${v.textType}`, why: "Identify the type first." },
                    { text: `Key features: ${v.keyFeatures}`, why: "These features tell you what kind of text it is." },
                    { text: `Purpose: ${v.purpose}`, why: "The text type and features reveal the purpose. ✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Read the passage below:`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Find the evidence:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.interactExplanation}. ✓`,
                incorrect: (v) => `Not quite! ${v.interactExplanation}. The answer is **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Quick recap!",
            body: (v) => `This was a **${v.textType.toLowerCase()}** — its purpose was **${v.purpose.toLowerCase()}**. Here's the method:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Read the text — what type is it?", why: "Story, report, advert, instructions, or description?" },
                  { text: "Step 2: Spot the key features", why: "Does it have characters? Facts? Commands? Persuasive language?" },
                  { text: "Step 3: Match the type to its purpose", why: "Story = entertain, report = inform, advert = persuade" },
                  { text: "Step 4: Instructions = instruct, description = describe", why: "The purpose follows from the text type! ✓" }
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
  // SUB-CONCEPT 5: literary-devices
  // Spotting Language Techniques
  // Category: other
  // Lesson A: step-by-step | Lesson B: visual-discovery
  // ==========================================
  {
    id: "literary-devices",
    name: "Spotting Language Techniques",
    category: "other",
    lessons: [
      // ---- Lesson A: Step-by-Step ----
      {
        id: "literary-devices-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot similes (comparisons using 'like' or 'as'), metaphors (saying something IS something else), and personification (giving human qualities to non-human things) in a passage — authors use these all the time!",
          "How to explain the effect of a language technique (a writer's tool for creating impact) — this is where you can really impress"
        ],
        variableSets: [
          {
            name: "Rosie",
            passage: "The storm arrived without warning. Rain hammered the rooftops like a thousand tiny drummers, and the wind howled through the streets, rattling letterboxes and snatching hats from heads. The old oak tree in the park bent and groaned as if it were in pain. Gutters overflowed, sending rivers of muddy water down the hill. By morning, the storm had moved on, leaving behind a carpet of golden leaves and a sky washed clean and blue.",
            question: "Which language technique is used in 'Rain hammered the rooftops like a thousand tiny drummers'?",
            options: ["Simile", "Metaphor", "Personification", "Alliteration", "Rhetorical question"],
            correctAnswer: "Simile",
            technique: "Simile",
            example: "Rain hammered the rooftops like a thousand tiny drummers",
            explanation: "A simile compares two things using 'like' or 'as'. Here, the rain is compared to drummers using the word 'like'.",
            signalWord: "like",
            interactQuestion: "Which language technique is used in 'The old oak tree bent and groaned as if it were in pain'?",
            interactOptions: ["Personification", "Simile", "Metaphor", "Alliteration", "Onomatopoeia"],
            interactCorrectAnswer: "Personification",
            interactExplanation: "Personification gives human qualities to non-human things. A tree cannot really 'groan' or feel 'pain' — those are human experiences given to the tree."
          },
          {
            name: "Sam",
            passage: "The morning sun painted the rooftops gold as Zain walked to school. Frost had crept across every windscreen overnight, and his breath hung in the air like tiny clouds. The pavement sparkled as though someone had scattered diamonds across it. At the school gate, he spotted his best friend Ollie, whose cheeks were two red apples from the cold. 'Hurry up!' Ollie called, stamping his feet. 'My toes are ice cubes!'",
            question: "Which language technique is used in 'whose cheeks were two red apples from the cold'?",
            options: ["Metaphor", "Simile", "Personification", "Alliteration", "Onomatopoeia"],
            correctAnswer: "Metaphor",
            technique: "Metaphor",
            example: "whose cheeks were two red apples from the cold",
            explanation: "A metaphor says something IS something else (not 'like' or 'as'). Here, Ollie's cheeks ARE apples — they are not compared using 'like'.",
            signalWord: "were (is/are/was)",
            interactQuestion: "Which language technique is used in 'his breath hung in the air like tiny clouds'?",
            interactOptions: ["Simile", "Metaphor", "Personification", "Alliteration", "Onomatopoeia"],
            interactCorrectAnswer: "Simile",
            interactExplanation: "A simile compares two things using 'like' or 'as'. Here, breath is compared to clouds using the word 'like'."
          },
          {
            name: "Tia",
            passage: "The abandoned house stood at the end of Blackthorn Lane. Its windows stared blankly at the passers-by, and the front door hung open like a yawning mouth. Ivy had climbed the walls and wrapped its fingers around the chimney. The garden gate creaked angrily whenever the wind pushed it, as though it resented being disturbed. Inside, dust danced in the thin beams of light that crept through the cracks in the curtains.",
            question: "Which language technique is used in 'Its windows stared blankly at the passers-by'?",
            options: ["Personification", "Simile", "Metaphor", "Alliteration", "Hyperbole"],
            correctAnswer: "Personification",
            technique: "Personification",
            example: "Its windows stared blankly at the passers-by",
            explanation: "Personification gives human qualities to something that is not human. Windows cannot really 'stare' — that is a human action given to a building.",
            signalWord: "a human action given to a non-human thing",
            interactQuestion: "Which language technique is used in 'the front door hung open like a yawning mouth'?",
            interactOptions: ["Simile", "Personification", "Metaphor", "Alliteration", "Onomatopoeia"],
            interactCorrectAnswer: "Simile",
            interactExplanation: "A simile compares two things using 'like' or 'as'. Here, the open door is compared to a yawning mouth using the word 'like'."
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the technique?",
            body: (v) => `Authors have a whole toolkit of **language techniques** to make their writing come alive. Can you spot the technique hiding in this passage?\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Step by step: identify the technique",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Question: ${v.question}**\n\nLet's break down the phrase: **"${v.example}"**`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: "Step 1: Does it compare two things?", why: "If yes, it might be a simile or metaphor." },
                    { text: `Step 2: Look for signal words`, why: `The signal here is: "${v.signalWord}"` },
                    { text: `Step 3: Name the technique — ${v.technique}`, why: v.explanation },
                    { text: "Step 4: Explain the effect", why: `It helps the reader picture the scene more vividly. ✓` }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "as brave as a lion", right: "simile" },
                { left: "the wind howled", right: "personification" },
                { left: "life is a journey", right: "metaphor" },
                { left: "crash, bang, wallop", right: "onomatopoeia" },
                { left: "dark, dreary, desolate", right: "alliteration" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `From the same passage, find this phrase:`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Find the evidence:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation} ✓`,
                incorrect: (v) => `Not quite! ${v.interactExplanation} The answer is **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The language techniques recipe!",
            body: () => `Once you know these, you'll start spotting them everywhere — even in books you read for fun:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Simile: compares using 'like' or 'as'", why: "e.g. 'fast as a cheetah', 'eyes like stars'" },
                  { text: "Metaphor: says something IS something else", why: "e.g. 'the classroom was a zoo', 'her heart was ice'" },
                  { text: "Personification: gives human qualities to non-human things", why: "e.g. 'the wind whispered', 'the sun smiled'" },
                  { text: "Alliteration: same sound at the start of nearby words", why: "e.g. 'slippery, slimy snakes', 'big blue balloon' ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Visual-Discovery ----
      {
        id: "literary-devices-discover",
        templateType: "visual-discovery",
        learningGoal: [
          "How to find multiple language techniques (writer's tools like similes and metaphors) in a single passage",
          "How to explain why the author chose each technique"
        ],
        variableSets: [
          {
            name: "Will",
            passage: "The sea was a restless beast that evening. Waves crashed against the harbour wall, throwing spray high into the air like giant hands reaching for the sky. The boats bobbed and dipped nervously, their ropes groaning under the strain. Peter pulled his hood up and leaned into the wind. The salty air stung his cheeks. Above him, seagulls screamed and circled, their white wings flashing against the bruised purple clouds.",
            technique1: "Metaphor — 'The sea was a restless beast'",
            effect1: "Makes the sea sound alive and dangerous, like a wild animal",
            technique2: "Simile — 'like giant hands reaching for the sky'",
            effect2: "Helps us picture the spray shooting upward in a dramatic way",
            technique3: "Personification — 'boats bobbed and dipped nervously'",
            effect3: "Makes the boats seem afraid, adding to the tense atmosphere",
            question: "Which of these is an example of personification?",
            options: ["'boats bobbed and dipped nervously'", "'The sea was a restless beast'", "'like giant hands reaching for the sky'", "'salty air stung his cheeks'", "'white wings flashing'"],
            correctAnswer: "'boats bobbed and dipped nervously'",
            explanation: "Boats cannot really feel nervous — that is a human emotion given to a non-human thing (personification)",
            interactPassage: "The autumn wind chased leaves along the pavement, spinning them like tiny ballet dancers. An old bench sat at the corner, its wooden slats groaning under the weight of years. The streetlamp flickered to life as if it had just woken up, casting a pool of orange light on the wet ground.",
            interactQuestion: "Which of these is an example of a simile?",
            interactOptions: ["'spinning them like tiny ballet dancers'", "'the wind chased leaves'", "'groaning under the weight of years'", "'flickered to life as if it had just woken up'", "'casting a pool of orange light'"],
            interactCorrectAnswer: "'spinning them like tiny ballet dancers'",
            interactExplanation: "It compares the spinning leaves to ballet dancers using the word 'like' — that is a simile"
          },
          {
            name: "Yasmin",
            passage: "The forest was alive with sound. Branches snapped and crackled underfoot like breakfast cereal. Somewhere above, a woodpecker tap-tap-tapped a steady rhythm on an ancient trunk. The trees stood shoulder to shoulder, their leaves whispering secrets to each other in the breeze. Sunlight tiptoed through the canopy, casting golden coins on the mossy ground. Freya breathed in the fresh, earthy air and smiled. She felt as small as an ant in this towering green cathedral.",
            technique1: "Simile — 'snapped and crackled underfoot like breakfast cereal'",
            effect1: "A fun, everyday comparison that helps us hear the sound clearly",
            technique2: "Personification — 'leaves whispering secrets to each other'",
            effect2: "Makes the forest feel magical, as if the trees are alive and talking",
            technique3: "Metaphor — 'this towering green cathedral'",
            effect3: "Compares the forest to a cathedral — it feels grand, peaceful, and awe-inspiring",
            question: "Which of these is an example of a metaphor?",
            options: ["'this towering green cathedral'", "'like breakfast cereal'", "'leaves whispering secrets'", "'tap-tap-tapped a steady rhythm'", "'as small as an ant'"],
            correctAnswer: "'this towering green cathedral'",
            explanation: "The forest IS called a cathedral — it does not say 'like' or 'as', so it is a metaphor, not a simile",
            interactPassage: "The playground was a battlefield at lunchtime. Children charged across the grass, their laughter echoing off the school walls like thunder. The old climbing frame watched over them silently, its metal bars gleaming in the winter sun.",
            interactQuestion: "Which of these is an example of personification?",
            interactOptions: ["'The climbing frame watched over them silently'", "'The playground was a battlefield'", "'like thunder'", "'their laughter echoing'", "'gleaming in the winter sun'"],
            interactCorrectAnswer: "'The climbing frame watched over them silently'",
            interactExplanation: "A climbing frame cannot really 'watch' — that is a human action given to a non-human object, which is personification"
          },
          {
            name: "Zara",
            passage: "Bonfire Night arrived at last. The sky exploded with colour as rockets shrieked and fizzed overhead. Catherine wheels spun like frantic dancers, throwing sparks in every direction. The bonfire roared hungrily, its orange flames licking the darkness. Children stood wide-eyed behind the safety rope, their faces glowing in the firelight. The smell of gunpowder and toffee apples hung thick in the November air. Tom's little sister buried her face in Dad's coat as a particularly fierce banger shook the ground beneath their feet.",
            technique1: "Personification — 'The bonfire roared hungrily, its flames licking the darkness'",
            effect1: "Makes the fire seem alive and powerful, like a hungry animal eating the night",
            technique2: "Simile — 'Catherine wheels spun like frantic dancers'",
            effect2: "Helps us picture the fast, wild spinning of the fireworks",
            technique3: "Onomatopoeia — 'shrieked and fizzed'",
            effect3: "These words sound like the noises they describe, putting us right in the scene",
            question: "Which of these is an example of a simile?",
            options: ["'Catherine wheels spun like frantic dancers'", "'The bonfire roared hungrily'", "'rockets shrieked and fizzed'", "'its orange flames licking the darkness'", "'shook the ground beneath their feet'"],
            correctAnswer: "'Catherine wheels spun like frantic dancers'",
            explanation: "It compares Catherine wheels to dancers using the word 'like' — that is a simile",
            interactPassage: "The river was a silver ribbon winding through the valley. Ducks paddled in lazy circles, their feathers ruffling in the breeze. Beneath the bridge, the water whispered secrets to the mossy stones, and dragonflies darted about like tiny helicopters.",
            interactQuestion: "Which of these is an example of a metaphor?",
            interactOptions: ["'The river was a silver ribbon'", "'like tiny helicopters'", "'the water whispered secrets'", "'paddled in lazy circles'", "'feathers ruffling in the breeze'"],
            interactCorrectAnswer: "'The river was a silver ribbon'",
            interactExplanation: "The river IS called a silver ribbon — it does not say 'like' or 'as', so it is a metaphor, not a simile"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "How many techniques can you find?",
            body: (v) => `This passage is packed with language techniques!\n\nGood authors use **several techniques** in a single passage to make their writing vivid and exciting. Let's find them!\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Let's discover the techniques!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Question: ${v.question}**\n\nThis passage uses at least **three** different language techniques. Here they are:`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Technique 1: ${v.technique1}`, why: v.effect1 },
                    { text: `Technique 2: ${v.technique2}`, why: v.effect2 },
                    { text: `Technique 3: ${v.technique3}`, why: v.effect3 }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `Each technique creates a different **effect** — together they make the writing come alive! ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `A simile compares two things using "like" or "as"`, answer: true, explanation: `Correct! "As brave as a lion" and "ran like the wind" are both similes because they use "as" or "like". ✓` },
                { text: `Personification means giving an object human feelings or actions`, answer: true, explanation: `Yes! "The wind howled" and "the sun smiled down" are personification — non-human things doing human actions. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Read this new passage and answer the question below.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.interactPassage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.interactExplanation}. ✓`,
                incorrect: (v) => `Not quite! ${v.interactExplanation}. The correct answer is **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Techniques and their effects!",
            body: () => `When you spot a technique, always explain **why** the author used it:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Name the technique", why: "Simile, metaphor, personification, alliteration (when words start with the same sound, like 'silly sausages'), onomatopoeia (words that sound like what they mean, like 'buzz' or 'crash'), etc." },
                  { text: "Step 2: Quote the example from the text", why: "Use the exact words — put them in quotation marks." },
                  { text: "Step 3: Explain the effect on the reader", why: "How does it make you feel? What does it help you picture?" },
                  { text: "Step 4: Link it to the mood or atmosphere", why: "Does it create tension, excitement, sadness, beauty? ✓" }
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
  // SUB-CONCEPT 6: summarising
  // Summarising the Main Idea
  // Category: core
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "summarising",
    name: "Summarising the Main Idea",
    category: "core",
    lessons: [
      // ---- Lesson A: Step-by-Step (The One-Sentence Test) ----
      {
        id: "summarising-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to identify the main idea of a passage — think 'big picture', not tiny details!",
          "How to summarise a passage in one sentence (harder than it sounds, but you'll learn the trick)"
        ],
        variableSets: [
          {
            name: "Aisha",
            passage: "Every autumn, thousands of swallows leave Britain and fly south to Africa. The journey is over six thousand miles long and takes several weeks. The birds travel during the day, feeding on insects as they go. They cross the English Channel, fly over France and Spain, then cross the Sahara Desert — one of the most dangerous parts of the trip. Many young swallows do not survive their first migration. Those that do will return to Britain the following spring, often nesting in the very same barn or shed they were born in. Scientists have tracked swallows using tiny electronic tags and discovered that some birds return to the exact same rafter year after year.",
            question: "Which is the best one-sentence summary of this passage?",
            correctAnswer: "Swallows make an incredible yearly journey from Britain to Africa and back",
            options: ["Swallows make an incredible yearly journey from Britain to Africa and back", "Scientists put electronic tags on swallows", "Many young swallows die during migration", "Swallows eat insects while they fly", "The Sahara Desert is dangerous for birds"],
            mainIdea: "Swallows migrate from Britain to Africa each year — a long, difficult journey",
            detail1: "Scientists have tracked swallows using tiny electronic tags",
            detail2: "Many young swallows do not survive their first migration",
            whyNotDetail: "These are interesting facts, but they are just parts of the bigger story — the migration itself",
            interactPassage: "The Arctic tern holds the record for the longest migration of any bird. Each year, it flies from the Arctic to the Antarctic and back again — a round trip of over seventy thousand kilometres. Along the way, it crosses oceans, battles storms, and barely rests. Because it follows the sun, the Arctic tern sees more daylight than any other animal on Earth. Scientists believe some terns fly the equivalent of three trips to the Moon during their lifetime.",
            interactQuestion: "Which is the best one-sentence summary of this passage?",
            interactOptions: ["The Arctic tern makes the longest bird migration in the world, flying from pole to pole each year", "Some terns fly the equivalent of three trips to the Moon", "The Arctic tern barely rests during its journey", "The Arctic tern sees more daylight than any other animal", "Arctic terns cross oceans and battle storms"],
            interactCorrectAnswer: "The Arctic tern makes the longest bird migration in the world, flying from pole to pole each year",
            interactMainIdea: "The Arctic tern has the longest migration of any bird",
            interactWhyNotDetail: "The other options are fascinating facts, but they only cover one part of the passage — the main idea is the incredible migration itself"
          },
          {
            name: "Ben",
            passage: "Parkrun is a free weekly event held every Saturday morning in parks across the United Kingdom. Runners, joggers, and walkers gather at nine o'clock to complete a five-kilometre course. There are no entry fees and no prizes — everyone simply receives a time at the end. The first Parkrun took place in Bushy Park, London, in 2004 with just thirteen runners. Today, over two million people have registered and events take place in more than seven hundred locations. Volunteers marshal the course, hand out water, and scan barcodes at the finish line. People of all ages take part, from toddlers in pushchairs to grandparents in their eighties.",
            question: "Which is the best one-sentence summary of this passage?",
            correctAnswer: "Parkrun is a free weekly running event that has grown hugely popular across the UK",
            options: ["Parkrun is a free weekly running event that has grown hugely popular across the UK", "The first Parkrun had only thirteen runners", "Volunteers hand out water at Parkrun", "Parkrun takes place at nine o'clock on Saturdays", "People of all ages take part in Parkrun"],
            mainIdea: "Parkrun is a free, popular weekly running event held across the UK",
            detail1: "The first Parkrun took place in Bushy Park in 2004 with thirteen runners",
            detail2: "Volunteers marshal the course and scan barcodes",
            whyNotDetail: "These are supporting details that tell us about Parkrun, but the main idea is what Parkrun IS and how popular it has become",
            interactPassage: "The RNLI — the Royal National Lifeboat Institution — has been saving lives at sea since 1824. It is run entirely by volunteers and funded by donations from the public. Lifeboat crews are on call twenty-four hours a day, every day of the year. They launch in all weathers, including storms, fog, and freezing conditions. Last year alone, RNLI crews rescued over eight thousand people around the British coast. The charity also runs water safety programmes in schools to teach children how to stay safe near the sea.",
            interactQuestion: "Which is the best one-sentence summary of this passage?",
            interactOptions: ["The RNLI is a volunteer lifeboat charity that has been saving lives around Britain's coast since 1824", "RNLI crews rescued over eight thousand people last year", "The RNLI runs water safety programmes in schools", "Lifeboat crews launch in storms and freezing conditions", "The RNLI has been running since 1824"],
            interactCorrectAnswer: "The RNLI is a volunteer lifeboat charity that has been saving lives around Britain's coast since 1824",
            interactMainIdea: "The RNLI is a long-running volunteer charity that saves lives at sea",
            interactWhyNotDetail: "The other options are important facts, but they only cover one part — the main idea is what the RNLI is and what it does"
          },
          {
            name: "Charlie",
            passage: "Grace had always been afraid of dogs. When she was small, a neighbour's terrier had jumped up and knocked her over, and the memory had stayed with her ever since. But when Grandad brought home a tiny golden retriever puppy called Biscuit, everything changed. At first, Grace kept her distance, watching Biscuit from across the room. After a few days, she let the puppy sniff her hand. By the end of the week, Biscuit was sleeping on Grace's bed. Now Grace walks Biscuit every morning before school and cannot imagine life without her. She even volunteers at the local animal shelter on Saturdays.",
            question: "Which is the best one-sentence summary of this passage?",
            correctAnswer: "Grace overcame her fear of dogs after her grandad brought home a puppy",
            options: ["Grace overcame her fear of dogs after her grandad brought home a puppy", "A terrier knocked Grace over when she was small", "Biscuit is a golden retriever puppy", "Grace volunteers at an animal shelter on Saturdays", "Biscuit sleeps on Grace's bed every night"],
            mainIdea: "Grace went from being afraid of dogs to loving them, thanks to Biscuit",
            detail1: "A neighbour's terrier had jumped up and knocked her over",
            detail2: "She volunteers at the local animal shelter on Saturdays",
            whyNotDetail: "The terrier incident explains WHY she was scared, and the shelter is what she does NOW — but the main idea is her transformation from fear to love",
            interactPassage: "Tom used to hate reading. He would groan whenever his teacher set a reading task, and his bookshelf at home was covered in dust. Then his uncle gave him a copy of a book about a boy who discovers a secret underground world. Tom started reading it one evening and could not put it down. He finished it in three days and immediately asked for the next one in the series. Now Tom reads every night before bed and has joined the school book club. He says that one book changed everything.",
            interactQuestion: "Which is the best one-sentence summary of this passage?",
            interactOptions: ["Tom went from hating reading to loving it after discovering the right book", "Tom's uncle gave him a book about a secret underground world", "Tom finished the book in three days", "Tom has joined the school book club", "Tom reads every night before bed"],
            interactCorrectAnswer: "Tom went from hating reading to loving it after discovering the right book",
            interactMainIdea: "Tom was transformed from a reluctant reader into a keen one by finding a book he loved",
            interactWhyNotDetail: "The other options describe individual events, but the main idea is Tom's whole journey from disliking reading to loving it"
          },
          {
            name: "Daisy",
            passage: "In 1666, a small fire broke out in a bakery on Pudding Lane in London. The baker, Thomas Farinor, thought he had put it out before going to bed, but the flames spread through the night. By morning, the fire had leapt from building to building across the narrow streets. Strong winds fanned the flames eastward. The fire burned for four days, destroying over thirteen thousand houses, eighty-seven churches, and most of the city's public buildings. Amazingly, fewer than ten people are known to have died. After the fire, London was rebuilt with wider streets and stone buildings to prevent such a disaster from ever happening again.",
            question: "Which is the best one-sentence summary of this passage?",
            correctAnswer: "The Great Fire of London destroyed most of the city but led to it being rebuilt more safely",
            options: ["The Great Fire of London destroyed most of the city but led to it being rebuilt more safely", "A fire started in a bakery on Pudding Lane", "Strong winds fanned the flames eastward", "Fewer than ten people are known to have died", "Over thirteen thousand houses were destroyed"],
            mainIdea: "The Great Fire of London was devastating but led to a safer, rebuilt city",
            detail1: "A small fire broke out in a bakery on Pudding Lane",
            detail2: "Fewer than ten people are known to have died",
            whyNotDetail: "These are important facts, but the main idea covers the whole story — the fire, the destruction, and the rebuilding",
            interactPassage: "Florence Nightingale was born into a wealthy family in 1820 and was expected to marry well and live a comfortable life. Instead, she chose to become a nurse — a job that was looked down upon at the time. During the Crimean War, she travelled to a military hospital in Turkey where conditions were dreadful: overcrowded wards, dirty bandages, and very little medicine. Florence worked tirelessly, improving hygiene and organising supplies. The death rate in her hospital fell dramatically. She became known as 'The Lady of the Lamp' because she walked the wards at night checking on soldiers. After the war, she set up the first proper nursing school in London, changing healthcare forever.",
            interactQuestion: "Which is the best one-sentence summary of this passage?",
            interactOptions: ["Florence Nightingale defied expectations to transform nursing and improve hospital care", "Florence Nightingale was born into a wealthy family in 1820", "She was called 'The Lady of the Lamp'", "She set up a nursing school in London", "The death rate in her hospital fell dramatically"],
            interactCorrectAnswer: "Florence Nightingale defied expectations to transform nursing and improve hospital care",
            interactMainIdea: "Florence Nightingale went against expectations and revolutionised nursing",
            interactWhyNotDetail: "The other options cover individual facts, but the main idea is her whole journey from defying expectations to transforming healthcare"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you sum it up in one sentence?",
            body: (v) => `Imagine a friend asks "what was that about?" — you wouldn't list every single detail! A **summary** captures the main idea in just **one sentence**. What would you say?\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Step by step: finding the main idea",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Question: ${v.question}**\n\nA summary should capture the **main idea** — what the whole passage is about. It should NOT be just one small detail from the text.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: "Step 1: Read the whole passage", why: "Do not stop at the first interesting fact." },
                    { text: "Step 2: Ask — what is this MAINLY about?", why: `Main idea: ${v.mainIdea}` },
                    { text: `Step 3: Spot the supporting details`, why: `"${v.detail1}" — this is a detail, not the main idea.` },
                    { text: `Step 4: Check another detail`, why: `"${v.detail2}" — ${v.whyNotDetail}` },
                    { text: `Summary: ${v.correctAnswer}`, why: "This covers the whole passage, not just one part. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: {
              type: "fill-blank",
              sentence: (v) => `A good summary captures the ____ idea, not just one small detail`,
              options: (v) => ["main", "first", "longest", "easiest"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! A summary should capture the MAIN idea — what the whole passage is about, not just one detail. ✓`,
                incorrect: (v) => `Not quite — a good summary captures the MAIN idea of the whole passage, not just one small detail.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Read this new passage and answer the question below.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.interactPassage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! The main idea is: ${v.interactMainIdea}. The other options are just supporting details — they do not cover the whole passage. ✓`,
                incorrect: (v) => `Not quite! That is a supporting detail, not the main idea. ${v.interactWhyNotDetail}. The best summary is: **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The summarising recipe — great skill to have!",
            body: () => `A **summary** captures the main idea in a few words. Here's your method:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Read the whole passage — not just the beginning", why: "The main idea might not appear until the middle or end." },
                  { text: "Step 2: Ask — what is this MAINLY about?", why: "Imagine explaining the passage to a friend in one sentence." },
                  { text: "Step 3: Check — does my summary cover the whole passage?", why: "If it only covers one paragraph or one fact, it is too narrow." },
                  { text: "Step 4: Pick the answer that captures the big picture", why: "Details support the main idea — they are not the main idea itself. ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Curiosity-Hook (Choosing the Best Summary) ----
      {
        id: "summarising-choose",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to choose the best summary from a list of options",
          "How to tell the difference between the main idea and a supporting detail"
        ],
        variableSets: [
          {
            name: "Ella",
            passage: "For centuries, people in Britain have celebrated harvest festivals to give thanks for a successful growing season. Farmers would bring their best crops to the local church — wheat, apples, vegetables, and freshly baked bread. The church would be decorated with flowers and bundles of corn. After a special service, the food was often shared with the poor. Today, many schools hold their own harvest festivals in the autumn term. Children bring tins and packets of food, which are donated to local food banks. Although farming has changed, the idea of sharing and being grateful has not.",
            question: "Which is the best summary of this passage?",
            correctAnswer: "Harvest festivals are a long British tradition of giving thanks and sharing food",
            options: ["Harvest festivals are a long British tradition of giving thanks and sharing food", "Farmers brought their best crops to church", "Schools hold harvest festivals in the autumn term", "Children donate tins of food to food banks", "Churches were decorated with flowers and corn"],
            tooNarrow: "Schools hold harvest festivals in the autumn term",
            whyTooNarrow: "This only covers the modern school bit — it misses the centuries of history and the core idea of gratitude and sharing",
            interactPassage: "Bonfire Night is celebrated across Britain every year on the fifth of November. It marks the night in 1605 when Guy Fawkes was caught trying to blow up the Houses of Parliament. Families gather around bonfires, watch firework displays, and eat toffee apples and jacket potatoes. Some towns build huge bonfires weeks in advance, with a 'guy' — a straw figure — placed on top. Although the event began as a celebration of the plot being foiled, today it is mainly an excuse for communities to come together on a cold autumn evening.",
            interactQuestion: "Which is the best summary of this passage?",
            interactOptions: ["Bonfire Night is a British tradition that began in 1605 and is now a community celebration each November", "Guy Fawkes tried to blow up Parliament in 1605", "People eat toffee apples and jacket potatoes", "Some towns build bonfires weeks in advance", "A straw figure called a guy is placed on the bonfire"],
            interactCorrectAnswer: "Bonfire Night is a British tradition that began in 1605 and is now a community celebration each November"
          },
          {
            name: "Finn",
            passage: "The Mary Rose was a warship belonging to King Henry VIII. She sank during a battle with the French fleet in 1545, just off the coast of Portsmouth. For over four hundred years, the ship lay on the seabed, slowly being buried by mud and sand. In 1971, divers found the wreck and a huge project began to raise her. It took eleven years of careful planning. In 1982, millions watched on television as the Mary Rose was finally lifted from the water. She is now on display in a museum in Portsmouth, along with thousands of objects found on board — from longbows and cannonballs to the crew's combs, dice, and leather shoes.",
            question: "Which is the best summary of this passage?",
            correctAnswer: "The Mary Rose sank in 1545 and was raised over four hundred years later, becoming a famous museum exhibit",
            options: ["The Mary Rose sank in 1545 and was raised over four hundred years later, becoming a famous museum exhibit", "King Henry VIII owned a warship called the Mary Rose", "Divers found the wreck in 1971", "Millions watched the Mary Rose being raised on television", "The museum displays longbows and cannonballs"],
            tooNarrow: "Divers found the wreck in 1971",
            whyTooNarrow: "This is just one event in the story — the passage covers the ship's history from sinking to museum display",
            interactPassage: "The Clifton Suspension Bridge in Bristol was designed by Isambard Kingdom Brunel when he was just twenty-four years old. Work began in 1831 but was delayed many times due to lack of money and political unrest. Brunel died in 1859 without seeing the bridge completed. His fellow engineers decided to finish it as a tribute to him, and the bridge finally opened in 1864. It spans the Avon Gorge, over two hundred and fifty feet above the river. Today, it is one of Bristol's most famous landmarks and is used by thousands of people every day.",
            interactQuestion: "Which is the best summary of this passage?",
            interactOptions: ["The Clifton Suspension Bridge was designed by Brunel, took decades to build, and is now a famous Bristol landmark", "Brunel designed the bridge when he was twenty-four", "The bridge finally opened in 1864", "It spans the Avon Gorge over two hundred and fifty feet high", "Brunel died in 1859 without seeing it completed"],
            interactCorrectAnswer: "The Clifton Suspension Bridge was designed by Brunel, took decades to build, and is now a famous Bristol landmark"
          },
          {
            name: "Grace",
            passage: "Amelia wanted to learn to cook, so she signed up for a junior cooking class at the community centre. On the first day, she burned the toast and dropped an egg on the floor. The following week, she overcooked the pasta until it turned to mush. But Amelia did not give up. She practised at home every evening, following recipes from her mum's old cookbook. Slowly, her dishes improved. By the final week of the course, Amelia made a perfect lasagne that the whole class applauded. The teacher, Chef Marco, told her she had the most improved in the group and gave her a special certificate.",
            question: "Which is the best summary of this passage?",
            correctAnswer: "Amelia struggled at first but improved through practice and became the most improved cook in her class",
            options: ["Amelia struggled at first but improved through practice and became the most improved cook in her class", "Amelia burned the toast on her first day", "Amelia followed recipes from her mum's old cookbook", "Chef Marco gave Amelia a special certificate", "The whole class applauded Amelia's lasagne"],
            tooNarrow: "Chef Marco gave Amelia a special certificate",
            whyTooNarrow: "This only covers the very end — the passage is really about Amelia's whole journey from struggling to succeeding",
            interactPassage: "Oliver had never been interested in gardening until his school started a vegetable patch project. At first, he thought it sounded boring. But when he planted his first row of carrot seeds and watched the tiny green shoots appear a week later, he was hooked. He started reading books about growing vegetables and even set up his own patch at home. By the end of the summer, Oliver had grown tomatoes, courgettes, and runner beans. He entered his largest pumpkin in the village show and won second prize. His mum said she had never seen him so proud.",
            interactQuestion: "Which is the best summary of this passage?",
            interactOptions: ["Oliver discovered a love of gardening through a school project and became a keen grower", "Oliver planted carrot seeds and watched them grow", "Oliver won second prize at the village show", "Oliver read books about growing vegetables", "Oliver grew tomatoes, courgettes, and runner beans"],
            interactCorrectAnswer: "Oliver discovered a love of gardening through a school project and became a keen grower"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Which summary is best?",
            body: (v) => `When you read a passage, you will often see answer choices that are all **true** — but only one captures the **main idea**. The others are just small details.\n\nCan you spot the difference? Read this passage and think about what it is **mainly** about.\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Main idea vs supporting detail",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Question: ${v.question}**\n\nWhen choosing a summary, watch out for answers that are **true but too narrow**. A good summary covers the **whole** passage, not just one part.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Too narrow: "${v.tooNarrow}"`, why: v.whyTooNarrow },
                    { text: "Test: does it cover the whole passage?", why: "If it only covers one sentence or one paragraph, it is a detail." },
                    { text: `Best summary: "${v.correctAnswer}"`, why: "This captures the whole passage from beginning to end. ✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Read this new passage and answer the question below.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.interactPassage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! "${v.interactCorrectAnswer}" covers the whole passage. The other options are just supporting details. ✓`,
                incorrect: (v) => `Not quite! That is a true fact from the passage, but it only covers one small part. The best summary is: **"${v.interactCorrectAnswer}"** — it captures the whole passage.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Summary vs detail — the test!",
            body: () => `Here is the quickest way to tell a summary from a detail:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Ask: does this cover the WHOLE passage?", why: "A summary should work as a one-sentence explanation of the entire text." },
                  { text: "Ask: could someone understand the passage from this alone?", why: "If yes, it is a good summary. If they would miss most of the story, it is just a detail." },
                  { text: "Beware of true but narrow answers!", why: "Every option may be true — but only the summary captures the big picture. ✓" }
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
  // SUB-CONCEPT 7: prediction
  // Making Predictions
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "prediction",
    name: "Making Predictions",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step-by-Step (Evidence-Based Prediction) ----
      {
        id: "prediction-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to make predictions based on evidence in the text — like a weather forecaster for stories!",
          "How to tell the difference between a good prediction and a wild guess"
        ],
        variableSets: [
          {
            name: "Finn",
            passage: "Ellie had been practising her audition piece for three weeks. Every evening after school, she stood in front of the bathroom mirror, reciting the lines until she knew them by heart. Her drama teacher, Miss Hartley, said she had real talent and should definitely try out for the lead role. On the morning of the audition, Ellie ate her breakfast quickly, checked her hair twice, and arrived at school twenty minutes early. She sat in the corridor outside the hall, mouthing her lines one last time, her hands steady and a calm smile on her face.",
            question: "What is most likely to happen next?",
            correctAnswer: "Ellie will perform confidently in the audition",
            options: ["Ellie will perform confidently in the audition", "Ellie will forget all her lines and run away", "Ellie will decide not to audition after all", "Ellie will fall asleep in the corridor", "Ellie will go home because she feels ill"],
            clue1: "practised for three weeks and knew her lines by heart",
            clue2: "her drama teacher said she had real talent",
            clue3: "hands steady and a calm smile on her face",
            evidenceSummary: "She is well-prepared, encouraged by her teacher, and appears calm and confident",
            interactPassage: "Jack had been training for the school cross-country race every morning for six weeks. He ran laps around the park before breakfast, even in the rain. His coach, Mr Davies, said Jack's times had improved more than any other runner in the squad. On the day of the race, Jack stretched carefully, checked his laces twice, and jogged to the starting line with a determined look on his face. The other runners were chatting nervously, but Jack stood quietly, breathing slowly and staring straight ahead.",
            interactQuestion: "What is most likely to happen next?",
            interactOptions: ["Jack will run a strong race and do well", "Jack will trip at the starting line and give up", "Jack will decide not to race after all", "Jack will forget the route and get lost", "The race will be cancelled due to rain"],
            interactCorrectAnswer: "Jack will run a strong race and do well",
            interactClue1: "trained every morning for six weeks, even in the rain",
            interactClue2: "his coach said his times had improved more than anyone else's",
            interactClue3: "stood quietly, breathing slowly, determined look",
            interactEvidenceSummary: "He has trained hard, improved significantly, and appears calm and focused"
          },
          {
            name: "Grace",
            passage: "The sky had turned a deep shade of grey and the wind was picking up fast. Leaves swirled across the playground like tiny tornados. Mrs Okafor glanced out of the classroom window and frowned. She asked the children to put away their art materials and move back to their desks. The caretaker, Mr Briggs, was walking across the field pulling in the football goals. A distant rumble of thunder echoed across the rooftops, and several children looked nervously at the window.",
            question: "What is most likely to happen next?",
            correctAnswer: "A thunderstorm is about to hit and the children will stay indoors",
            options: ["A thunderstorm is about to hit and the children will stay indoors", "The children will go outside for playtime", "Mrs Okafor will start a football match", "The sun will come out and the sky will clear", "Mr Briggs will let the children play in the rain"],
            clue1: "deep grey sky and the wind was picking up fast",
            clue2: "the caretaker was pulling in the football goals",
            clue3: "a distant rumble of thunder echoed across the rooftops",
            evidenceSummary: "Grey sky, strong wind, equipment being brought in, and thunder all point to an approaching storm",
            interactPassage: "The old wooden pier creaked and groaned as waves crashed against its supports. A sign at the entrance read 'CLOSED — UNSAFE' in large red letters, but someone had bent the fence back, leaving a gap. Two sets of muddy footprints led along the planks, which were slippery with green algae. Halfway along, a plank was missing entirely, leaving a dark gap above the churning water below. The coastguard van pulled up at the car park and two officers got out, looking worried.",
            interactQuestion: "What is most likely to happen next?",
            interactOptions: ["The coastguard officers will go onto the pier to find whoever went through the gap", "The coastguard officers will go for lunch", "Someone will repair the pier immediately", "The sun will come out and the sea will calm down", "The officers will ignore the footprints"],
            interactCorrectAnswer: "The coastguard officers will go onto the pier to find whoever went through the gap",
            interactClue1: "the fence has been bent back and there are footprints leading along the pier",
            interactClue2: "the pier is unsafe with missing planks above churning water",
            interactClue3: "the coastguard officers arrived looking worried",
            interactEvidenceSummary: "Footprints show someone has gone onto a dangerous, closed pier, and worried coastguard officers have arrived to help"
          },
          {
            name: "Harley",
            passage: "Marcus stared at the maths test on his desk. He had not revised at all over the weekend — he had spent both days at the skate park instead. The first question was about fractions, and he could not remember how to find a common denominator. He chewed the end of his pencil and glanced at the clock. Twenty minutes had already passed and he had not written a single answer. The girl next to him was already on the second page. Marcus sighed and tried to read the next question, but the numbers blurred together.",
            question: "What is most likely to happen?",
            correctAnswer: "Marcus will do badly on the test",
            options: ["Marcus will do badly on the test", "Marcus will suddenly remember everything and get top marks", "The test will be cancelled because of a fire alarm", "Marcus will copy from the girl next to him", "The teacher will give Marcus extra time"],
            clue1: "had not revised at all over the weekend",
            clue2: "could not remember how to find a common denominator",
            clue3: "twenty minutes passed and he had not written a single answer",
            evidenceSummary: "He did not revise, cannot answer the questions, and has wasted most of the time already",
            interactPassage: "Lily stared at the tall diving board, her toes curling over the edge. Below her, the pool looked tiny and impossibly far away. Her swimming teacher, Miss Robbins, stood at the bottom and gave her a thumbs-up. Lily had spent three lessons practising on the low board and had jumped from it perfectly every time. She took a deep breath, bent her knees, and fixed her eyes on the water. The other children in her group clapped and chanted her name.",
            interactQuestion: "What is most likely to happen next?",
            interactOptions: ["Lily will jump from the high board into the pool", "Lily will climb back down the ladder", "The pool will be closed for cleaning", "Lily will slip and hurt herself", "Miss Robbins will tell her to stop"],
            interactCorrectAnswer: "Lily will jump from the high board into the pool",
            interactClue1: "she has practised on the low board and jumped perfectly every time",
            interactClue2: "her teacher gave her a thumbs-up and is watching supportively",
            interactClue3: "she took a deep breath, bent her knees, and fixed her eyes on the water",
            interactEvidenceSummary: "She is well-practised, supported by her teacher, and physically preparing to jump"
          },
          {
            name: "Imogen",
            passage: "Nana Patel placed the last candle on the enormous chocolate cake and stepped back to admire it. The kitchen table was covered with a bright tablecloth, and party bags were lined up by the door, each one stuffed with sweets and a small toy. Balloons bobbed against the ceiling in every colour. In the living room, Dad was setting up a treasure hunt with clues hidden behind cushions and under plant pots. Mum checked her watch. 'They will be here in ten minutes,' she said, nudging a pile of presents behind the sofa.",
            question: "What is most likely to happen in ten minutes?",
            correctAnswer: "Guests will arrive for a birthday party",
            options: ["Guests will arrive for a birthday party", "The family will sit down for a quiet dinner", "Nana Patel will take the cake to a shop", "Mum and Dad will go out for the evening", "The balloons will all pop and ruin the surprise"],
            clue1: "candles on a cake, party bags, balloons",
            clue2: "Dad was setting up a treasure hunt",
            clue3: "'They will be here in ten minutes' — Mum is expecting visitors",
            evidenceSummary: "Cake with candles, party bags, balloons, treasure hunt, and expected guests all point to a birthday party",
            interactPassage: "Mrs Taylor placed the last box of books onto the shelf and stood back to look at the classroom. Every desk had a fresh exercise book, a sharpened pencil, and a name label. The whiteboard read 'Welcome to Year 5!' in colourful letters. A display board near the door showed a map of the world with the heading 'Our Adventures This Year'. Mrs Taylor checked her watch — it was quarter to nine. Outside, she could hear the sound of car doors closing and excited chatter drifting across the playground.",
            interactQuestion: "What is most likely to happen next?",
            interactOptions: ["Children will arrive for the first day of term", "Mrs Taylor will go home for the day", "The school will be closed for repairs", "Parents will come in for a meeting", "Mrs Taylor will take down the displays"],
            interactCorrectAnswer: "Children will arrive for the first day of term",
            interactClue1: "fresh exercise books, sharpened pencils, and name labels on every desk",
            interactClue2: "'Welcome to Year 5!' on the whiteboard",
            interactClue3: "car doors closing and excited chatter on the playground at quarter to nine",
            interactEvidenceSummary: "A freshly prepared classroom, welcome message, and arriving families all point to the first day of a new school year"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "What will happen next?",
            body: (v) => `Good readers use **clues in the text** to predict what might happen next — like detectives piecing together evidence. This is not random guessing — it's smart reading!\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Step by step: making predictions",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Question: ${v.question}**\n\nA good prediction is based on **evidence** from the passage — not a wild guess. Let's find the clues.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: "Step 1: Read the passage carefully", why: "Look for clues about what is building up." },
                    { text: `Step 2: Clue 1 — ${v.clue1}`, why: "What does this suggest might happen?" },
                    { text: `Step 3: Clue 2 — ${v.clue2}`, why: "More evidence pointing the same way." },
                    { text: `Step 4: Clue 3 — ${v.clue3}`, why: "Even stronger evidence." },
                    { text: `Prediction: ${v.correctAnswer}`, why: `${v.evidenceSummary}. ✓` }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `A good prediction is just a random guess about what might happen next`, answer: false, explanation: `No! A good prediction is based on EVIDENCE from the passage — clues that point towards what will happen. It's not a guess. ✓` },
                { text: `To make a prediction, you should look for clues in the passage that hint at what's coming`, answer: true, explanation: `Correct! Find clues, put them together, and predict what the evidence suggests will happen next. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Read this new passage and answer the question below.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.interactPassage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactEvidenceSummary}. The clues all point to: **${v.interactCorrectAnswer}**. ✓`,
                incorrect: (v) => `Not quite! Look at the clues: ${v.interactClue1}; ${v.interactClue2}; ${v.interactClue3}. ${v.interactEvidenceSummary}. The best prediction is: **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The prediction recipe!",
            body: () => `A prediction is an **educated guess** based on evidence — and you're getting really good at this. Here's your method:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Read the passage and look for clues", why: "Actions, descriptions, and dialogue all hint at what is coming." },
                  { text: "Step 2: Ask — what is building up?", why: "Is there tension, excitement, preparation, or a problem developing?" },
                  { text: "Step 3: Check your prediction against the evidence", why: "A good prediction is supported by multiple clues — not just one." },
                  { text: "Step 4: Choose the most LIKELY outcome", why: "Not the most exciting or dramatic — the one the evidence actually supports. ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Curiosity-Hook (Clue Hunting) ----
      {
        id: "prediction-clues",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to identify which clues support a prediction",
          "Why wild guesses are not good predictions"
        ],
        variableSets: [
          {
            name: "Jude",
            passage: "The old cat, Whiskers, had been sleeping more than usual. He no longer jumped onto the kitchen counter to steal food, and his bowl of biscuits often went untouched. Mrs Chen took him to the vet, who listened to his heart and checked his teeth. The vet spoke gently and explained that Whiskers was seventeen years old — very old for a cat. She gave Mrs Chen some special soft food and a small bottle of medicine. On the drive home, Mrs Chen stroked Whiskers gently on her lap and whispered, 'We will take good care of you, old friend.'",
            question: "What do you think will happen to Whiskers?",
            correctAnswer: "Mrs Chen will look after Whiskers carefully as he grows weaker",
            options: ["Mrs Chen will look after Whiskers carefully as he grows weaker", "Whiskers will suddenly get better and start jumping again", "Mrs Chen will get a new kitten to replace Whiskers", "The vet will keep Whiskers at the surgery", "Whiskers will run away from home"],
            wildGuess: "Whiskers will suddenly get better and start jumping again",
            whyWild: "Nothing in the passage suggests he is getting better — every clue points to him slowing down due to old age",
            supportingClues: "sleeping more, not eating, very old for a cat, special food and medicine, 'we will take good care of you'",
            interactPassage: "The little boat rocked gently as Dad rowed out to the middle of the lake. Sophia dangled her hand in the cool water and watched the ripples spread outwards. Dad had packed sandwiches, flasks of tea, and two fishing rods. He baited the hooks carefully and showed Sophia how to cast her line into the water. 'Now we wait,' he said, leaning back with his eyes half-closed. The float bobbed once, then dipped sharply beneath the surface. Sophia's rod bent towards the water and the reel began to spin.",
            interactQuestion: "What do you think will happen next?",
            interactOptions: ["Sophia has caught a fish and will try to reel it in", "The boat will sink", "Dad will fall asleep and miss everything", "A shark will appear in the lake", "Sophia will throw the fishing rod into the water"],
            interactCorrectAnswer: "Sophia has caught a fish and will try to reel it in",
            interactWildGuess: "A shark will appear in the lake",
            interactWhyWild: "Sharks do not live in lakes — there is no evidence for anything dramatic. The clues all point to a fish taking the bait",
            interactSupportingClues: "the float dipped sharply beneath the surface, the rod bent towards the water, the reel began to spin"
          },
          {
            name: "Kira",
            passage: "Zara checked the weather forecast one more time: heavy snow expected from midday. She had been planning this camping trip with her scout group for months, and the campsite was a two-hour drive into the hills. Her mum looked at the forecast and shook her head slowly. 'I am not driving in that,' she said firmly. The scout leader, Mr Paxton, sent a message to the group chat at ten o'clock. Zara's phone buzzed and she picked it up, already knowing what it would say.",
            question: "What do you think Mr Paxton's message says?",
            correctAnswer: "The camping trip has been cancelled or postponed because of the snow",
            options: ["The camping trip has been cancelled or postponed because of the snow", "The camping trip is still going ahead as planned", "Mr Paxton is inviting everyone to his house instead", "The forecast has changed to sunshine", "Zara has been removed from the scout group"],
            wildGuess: "The camping trip is still going ahead as planned",
            whyWild: "Heavy snow, Mum refusing to drive, and Zara 'already knowing what it would say' all point to cancellation",
            supportingClues: "heavy snow forecast, mum shook her head and refused to drive, Zara already knew what the message would say",
            interactPassage: "The school hall was packed with parents and children. On stage, the choir stood in neat rows wearing matching blue T-shirts. Miss Patel tapped her music stand with a baton and raised both hands. The room fell silent. The pianist placed her fingers on the keys and waited. Miss Patel nodded once, the piano began to play, and every mouth in the choir opened at exactly the same moment.",
            interactQuestion: "What do you think will happen next?",
            interactOptions: ["The choir will start singing together", "The fire alarm will go off", "The parents will leave the hall", "Miss Patel will cancel the concert", "The pianist will forget the music"],
            interactCorrectAnswer: "The choir will start singing together",
            interactWildGuess: "The fire alarm will go off",
            interactWhyWild: "There are no clues about a fire alarm — everything in the passage points to a performance about to begin",
            interactSupportingClues: "the choir stood in neat rows, Miss Patel raised her hands, the room fell silent, the piano began to play, every mouth opened"
          },
          {
            name: "Leo",
            passage: "Ruby had been saving her pocket money since January. Every Saturday, she added two pounds to the jar on her shelf and watched the pile of coins grow. On the fridge door was a photograph of a shiny purple bicycle with silver handlebars — she had cut it out of a catalogue and stuck it there with a magnet. Her birthday was in three weeks, and Grandma had already hinted that she was getting 'something to go with a helmet'. This morning, Ruby counted the money in her jar: forty-eight pounds and sixty pence. The bicycle cost fifty pounds.",
            question: "What is most likely to happen on Ruby's birthday?",
            correctAnswer: "Ruby will get the purple bicycle, with help from her savings and Grandma's gift",
            options: ["Ruby will get the purple bicycle, with help from her savings and Grandma's gift", "Ruby will buy a completely different bicycle", "Ruby will spend her money on sweets instead", "Grandma will buy Ruby a helmet but no bicycle", "Ruby will not have enough money and will give up"],
            wildGuess: "Ruby will spend her money on sweets instead",
            whyWild: "She has been saving specifically for the bicycle since January and is only £1.40 short — there is no evidence she would change her mind",
            supportingClues: "saving since January, photo of the exact bicycle on the fridge, Grandma hinted about a helmet, only £1.40 short",
            interactPassage: "Noah opened his lunchbox and peered inside. A cheese sandwich again. He had asked Mum for something different three times this week, but she always forgot. His friend Priya unwrapped a warm samosa that smelled of spices. 'Want to swap half?' she asked, grinning. Noah's eyes lit up. He tore his sandwich in two and slid one half across the table. Priya did the same with her samosa. They had been swapping halves since Year Three, and it had become their daily routine.",
            interactQuestion: "What do you think will happen next?",
            interactOptions: ["Noah and Priya will happily eat their swapped lunches", "Noah will throw his sandwich in the bin", "The teacher will confiscate their food", "Noah will cry because he does not like cheese", "Priya will change her mind and take the samosa back"],
            interactCorrectAnswer: "Noah and Priya will happily eat their swapped lunches",
            interactWildGuess: "The teacher will confiscate their food",
            interactWhyWild: "There is no mention of any rule against swapping — the passage says they have been doing it since Year Three as a daily routine",
            interactSupportingClues: "Priya offered to swap, Noah's eyes lit up, they tore their food in half, they have been swapping since Year Three"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Good prediction or wild guess?",
            body: (v) => `Someone predicted: **"${v.wildGuess}"**\n\nIs that a good prediction — or a wild guess? Let's find out!\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Good predictions need evidence!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Question: ${v.question}**\n\nThe prediction **"${v.wildGuess}"** is a wild guess. ${v.whyWild}.\n\nLet's look at the clues that lead to a better prediction.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Wild guess: "${v.wildGuess}"`, why: `${v.whyWild}.` },
                    { text: `Real clues: ${v.supportingClues}`, why: "These all point in the same direction." },
                    { text: `Better prediction: "${v.correctAnswer}"`, why: "This prediction is supported by evidence from the text. ✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Read this new passage and answer the question below.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.interactPassage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! The clues (${v.interactSupportingClues}) all support the prediction: **"${v.interactCorrectAnswer}"**. ✓`,
                incorrect: (v) => `Not quite! ${v.interactWhyWild}. The clues (${v.interactSupportingClues}) tell us the best prediction is: **"${v.interactCorrectAnswer}"**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Prediction dos and don'ts!",
            body: () => `A good prediction is backed by **evidence**. A wild guess is not. Now you know how to tell the difference:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "DO look for multiple clues that point the same way", why: "One clue might be misleading — but three clues together are strong evidence." },
                  { text: "DO NOT pick the most dramatic or exciting answer", why: "The test wants the MOST LIKELY outcome, not the most surprising." },
                  { text: "DO check: is there evidence in the text for my prediction?", why: "If you cannot point to a clue, it is a guess, not a prediction. ✓" }
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
  // SUB-CONCEPT 8: fact-vs-opinion
  // Fact vs Opinion
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "fact-vs-opinion",
    name: "Fact vs Opinion",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step-by-Step (The "Can It Be Proven?" Test) ----
      {
        id: "fact-vs-opinion-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to tell the difference between a fact and an opinion — this is one of the most useful skills in all of English!",
          "How to use the 'can it be proven?' test (it's simpler than you think)"
        ],
        variableSets: [
          {
            name: "Aisha",
            passage: "Edinburgh is the capital city of Scotland. It is home to Edinburgh Castle, which sits on top of an ancient volcanic rock and attracts over two million visitors each year. The Royal Mile stretches from the castle down to the Palace of Holyroodhouse, the official Scottish residence of the King. In my opinion, Edinburgh is the most beautiful city in the whole of Britain. The views from Arthur's Seat are absolutely breathtaking, and the cobbled streets of the Old Town have more charm than anywhere else I have ever visited.",
            question: "Which of these statements from the passage is an OPINION?",
            correctAnswer: "Edinburgh is the most beautiful city in the whole of Britain",
            options: ["Edinburgh is the most beautiful city in the whole of Britain", "Edinburgh is the capital city of Scotland", "Edinburgh Castle attracts over two million visitors each year", "The Royal Mile stretches from the castle to the palace", "Edinburgh Castle sits on top of an ancient volcanic rock"],
            factExample: "Edinburgh is the capital city of Scotland",
            opinionExample: "Edinburgh is the most beautiful city in the whole of Britain",
            whyFact: "This can be proven — you can check it in an atlas or reference book",
            whyOpinion: "This cannot be proven — 'most beautiful' is a personal judgement that others might disagree with",
            clueWords: "In my opinion, most beautiful, absolutely breathtaking, more charm",
            interactPassage: "The Giant's Causeway is a natural rock formation on the coast of Northern Ireland. It is made up of around forty thousand interlocking basalt columns, formed by an ancient volcanic eruption. The columns are mostly hexagonal and some are over twelve metres tall. It was named a World Heritage Site in 1986. Many visitors say it is the most spectacular natural wonder in the British Isles. The surrounding cliffs are home to rare seabirds, including fulmars and razorbills. I believe everyone should visit at least once in their lifetime.",
            interactQuestion: "Which of these statements from the passage is an OPINION?",
            interactOptions: ["It is the most spectacular natural wonder in the British Isles", "The Giant's Causeway is made up of around forty thousand columns", "It was named a World Heritage Site in 1986", "The columns are mostly hexagonal", "The surrounding cliffs are home to rare seabirds"],
            interactCorrectAnswer: "It is the most spectacular natural wonder in the British Isles",
            interactWhyOpinion: "'Most spectacular' is a personal judgement — someone else might think the Scottish Highlands or the Jurassic Coast is more spectacular"
          },
          {
            name: "Ben",
            passage: "The school library was refurbished over the summer holidays. New shelves were fitted along every wall, and a reading corner with beanbags was added near the window. The library now holds over four thousand books, including a new section for graphic novels. Mrs Osei, the librarian, says it is the best library in the county. She believes every child should visit at least once a week. 'There is nothing better than losing yourself in a good book,' she told the school assembly on Monday.",
            question: "Which of these statements from the passage is an OPINION?",
            correctAnswer: "It is the best library in the county",
            options: ["It is the best library in the county", "New shelves were fitted along every wall", "The library now holds over four thousand books", "A reading corner with beanbags was added", "A new section for graphic novels was included"],
            factExample: "The library now holds over four thousand books",
            opinionExample: "It is the best library in the county",
            whyFact: "You could count the books — this is a fact that can be checked",
            whyOpinion: "'Best' is a personal judgement — someone else might think their library is better",
            clueWords: "best, believes, nothing better",
            interactPassage: "The school orchestra performed at the town hall on Saturday evening. There were thirty-two musicians, including violins, cellos, flutes, and trumpets. The concert lasted ninety minutes and the audience filled every seat. The mayor, who attended the event, told a reporter, 'It was the most impressive performance I have seen from any school.' The orchestra's conductor, Mr Hughes, has been teaching music at the school for eleven years. He said the children had rehearsed twice a week since September.",
            interactQuestion: "Which of these statements from the passage is an OPINION?",
            interactOptions: ["It was the most impressive performance I have seen from any school", "There were thirty-two musicians in the orchestra", "The concert lasted ninety minutes", "Mr Hughes has been teaching music for eleven years", "The children rehearsed twice a week since September"],
            interactCorrectAnswer: "It was the most impressive performance I have seen from any school",
            interactWhyOpinion: "'Most impressive' is the mayor's personal judgement — another person at the concert might have a different view"
          },
          {
            name: "Charlie",
            passage: "The school football team played their final match of the season against Westfield Primary on Friday afternoon. The score was 3–2 to Westfield at half-time, but two late goals from Kai and Priya gave the team a 4–3 victory. It was the most exciting match anyone had ever seen. The head teacher, Mr Simms, presented the trophy at assembly and said the team had played brilliantly. The team captain, Kai, scored fifteen goals this season — more than any other player in the league.",
            question: "Which of these statements from the passage is an OPINION?",
            correctAnswer: "It was the most exciting match anyone had ever seen",
            options: ["It was the most exciting match anyone had ever seen", "The score was 3–2 to Westfield at half-time", "Two late goals came from Kai and Priya", "Kai scored fifteen goals this season", "The final score was 4–3"],
            factExample: "Kai scored fifteen goals this season",
            opinionExample: "It was the most exciting match anyone had ever seen",
            whyFact: "You could check the match records — the number of goals is a provable fact",
            whyOpinion: "'Most exciting' is a judgement — different people might find different matches exciting",
            clueWords: "most exciting, brilliantly",
            interactPassage: "The village fete took place on the last Saturday of June, as it has done for over fifty years. There were stalls selling cakes, books, and homemade jam. The tombola raised two hundred and thirty pounds for the church roof fund. A bouncy castle was set up on the playing field and over four hundred people attended. Mrs Winters, who organised the event, said, 'This was easily the best fete we have ever had.' The local paper published three photographs from the day.",
            interactQuestion: "Which of these statements from the passage is an OPINION?",
            interactOptions: ["This was easily the best fete we have ever had", "The tombola raised two hundred and thirty pounds", "Over four hundred people attended", "The fete has taken place for over fifty years", "The local paper published three photographs"],
            interactCorrectAnswer: "This was easily the best fete we have ever had",
            interactWhyOpinion: "'Best fete we have ever had' is Mrs Winters' personal view — someone else might have preferred a previous year's event"
          },
          {
            name: "Daisy",
            passage: "The Jurassic Coast stretches for ninety-six miles along the southern coast of England, from Exmouth in Devon to Studland Bay in Dorset. It was named a World Heritage Site in 2001 because of its incredible geological history. The cliffs contain fossils from the Triassic, Jurassic, and Cretaceous periods — covering one hundred and eighty-five million years of Earth's history. I think the Jurassic Coast is the most fascinating place in England. There is nowhere better for a family day out, and children will probably enjoy it more than any theme park.",
            question: "Which of these statements from the passage is an OPINION?",
            correctAnswer: "The Jurassic Coast is the most fascinating place in England",
            options: ["The Jurassic Coast is the most fascinating place in England", "The Jurassic Coast stretches for ninety-six miles", "It was named a World Heritage Site in 2001", "The cliffs contain fossils from three periods", "The coast runs from Exmouth to Studland Bay"],
            factExample: "The Jurassic Coast stretches for ninety-six miles",
            opinionExample: "The Jurassic Coast is the most fascinating place in England",
            whyFact: "The distance can be measured and verified — this is a provable fact",
            whyOpinion: "'Most fascinating' is a personal view — someone else might find London or the Lake District more interesting",
            clueWords: "I think, most fascinating, nowhere better, probably",
            interactPassage: "Stonehenge is a prehistoric monument in Wiltshire, built in stages over a period of about fifteen hundred years. The largest stones weigh up to twenty-five tonnes and were transported from over twenty miles away. Historians believe the site was used for ceremonies and tracking the movements of the sun. Around one and a half million people visit Stonehenge each year. A local tour guide told visitors, 'Stonehenge is without doubt the most mysterious place in all of England.' English Heritage manages the site and charges an entry fee of around twenty pounds for adults.",
            interactQuestion: "Which of these statements from the passage is an OPINION?",
            interactOptions: ["Stonehenge is without doubt the most mysterious place in all of England", "The largest stones weigh up to twenty-five tonnes", "Around one and a half million people visit each year", "Stonehenge was built over a period of about fifteen hundred years", "English Heritage manages the site"],
            interactCorrectAnswer: "Stonehenge is without doubt the most mysterious place in all of England",
            interactWhyOpinion: "'Most mysterious' is a personal judgement by the tour guide — someone else might think a different place is more mysterious"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Fact or opinion?",
            body: (v) => `Did you know that some statements are **facts** (can be proven true or false) and some are **opinions** (what someone thinks or believes)? Telling them apart is a real superpower — can you do it?\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Step by step: the 'can it be proven?' test",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Question: ${v.question}**\n\nThe key test is simple: **can it be proven true or false?** If yes, it is a fact. If it depends on what someone thinks, it is an opinion.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Fact: "${v.factExample}"`, why: v.whyFact },
                    { text: `Opinion: "${v.opinionExample}"`, why: v.whyOpinion },
                    { text: `Clue words that signal opinions: ${v.clueWords}`, why: "Words like 'best', 'most', 'I think', 'probably' often flag opinions." },
                    { text: `Answer: "${v.correctAnswer}" is an opinion`, why: "It cannot be proven — different people would disagree. ✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: '"London is the capital of England" is a fact', isTrue: true },
                { text: '"Pizza is the best food" is a fact', isTrue: false },
                { text: '"Water boils at 100°C" is a fact', isTrue: true },
                { text: '"Summer is the nicest season" is a fact', isTrue: false },
                { text: '"There are 26 letters in the alphabet" is a fact', isTrue: true }
              ],
              feedback: {
                correct: 'Well done! Facts can be proven; opinions are personal views.',
                incorrect: 'Not quite. Ask: can this be proven? If yes, it\'s a fact. If people could disagree, it\'s an opinion.'
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Read this new passage and answer the question below.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.interactPassage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! "${v.interactCorrectAnswer}" is an opinion because ${v.interactWhyOpinion.toLowerCase()}. The other options are facts that can be checked. ✓`,
                incorrect: (v) => `Not quite! That statement can be proven, so it is a fact. The opinion is: **"${v.interactCorrectAnswer}"** — ${v.interactWhyOpinion.toLowerCase()}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The fact vs opinion recipe — you've cracked it!",
            body: () => `Here's how to tell facts from opinions every time — this works in the exam and in real life:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Read the statement carefully", why: "Is it something that can be checked or measured?" },
                  { text: "Step 2: Ask — can this be PROVEN true or false?", why: "If yes, it is a fact. If not, it is an opinion." },
                  { text: "Step 3: Look for opinion clue words", why: "I think, I believe, best, worst, most, probably, perhaps, in my view." },
                  { text: "Step 4: Be careful with tricky ones!", why: "'Many people believe X' is a FACT about what people believe, even if X itself is an opinion. ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake (Tricky Fact/Opinion) ----
      {
        id: "fact-vs-opinion-tricky",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot opinions disguised as facts",
          "How to handle tricky statements like 'many people believe...'"
        ],
        variableSets: [
          {
            name: "Ella",
            passage: "The new swimming pool opened on Saturday and over three hundred people visited on the first day. The pool is twenty-five metres long and has six lanes. It also has a separate children's splash area with water slides. The local newspaper reported that most residents are delighted with the new facility. Councillor Barnes told reporters, 'This is the finest pool in the south of England.' The pool is open from six in the morning until ten at night, seven days a week.",
            question: "Which of these is a FACT, even though it might look like an opinion?",
            correctAnswer: "Most residents are delighted with the new facility",
            wrongThinking: "People might say this is an opinion because it sounds positive",
            whyActuallyFact: "The newspaper REPORTED this — it is a fact about what the newspaper found, even though the feeling itself is subjective. It could be verified by checking the newspaper report.",
            actualOpinion: "This is the finest pool in the south of England",
            whyOpinion: "'Finest' is a personal judgement by Councillor Barnes — someone else might disagree",
            options: ["Most residents are delighted with the new facility", "This is the finest pool in the south of England", "The pool is twenty-five metres long", "Over three hundred people visited on the first day", "The pool has six lanes"],
            interactPassage: "A new playground was opened at Riverside Park last month. It has climbing frames, swings, and a zip wire. The council spent one hundred and fifty thousand pounds on the project. A petition signed by over eight hundred parents had asked for better play equipment. According to a survey, ninety per cent of families who have visited are happy with the new facilities. Councillor Thomas said, 'This is undoubtedly the finest playground in the entire region.'",
            interactQuestion: "Which of these is a FACT, even though it might look like an opinion?",
            interactOptions: ["Ninety per cent of families who have visited are happy with the new facilities", "This is undoubtedly the finest playground in the entire region", "The council spent one hundred and fifty thousand pounds", "The playground has climbing frames, swings, and a zip wire", "Over eight hundred parents signed a petition"],
            interactCorrectAnswer: "Ninety per cent of families who have visited are happy with the new facilities",
            interactWhyActuallyFact: "The survey result is a provable fact — 90% of families DID say they were happy. You can check the survey to verify this."
          },
          {
            name: "Finn",
            passage: "A survey of Year Six pupils found that seventy-two per cent think homework should be banned at weekends. The survey was carried out by the school council and included all one hundred and twenty children in the year group. 'Homework ruins our free time,' said one pupil. Another said, 'I think we learn more from playing outside than from worksheets.' The head teacher, Mrs Kapoor, said she would consider reducing homework but did not promise any changes. She believes that some homework is essential for building good study habits.",
            question: "Which of these is a FACT, even though it sounds like it could be an opinion?",
            correctAnswer: "Seventy-two per cent think homework should be banned at weekends",
            wrongThinking: "People might say this is an opinion because it is about what children think",
            whyActuallyFact: "The survey result is a provable fact — 72% of pupils DID say this. It is a fact about their opinions, which can be verified by checking the survey.",
            actualOpinion: "Homework ruins our free time",
            whyOpinion: "This is one pupil's personal view — it cannot be proven true or false",
            options: ["Seventy-two per cent think homework should be banned at weekends", "Homework ruins our free time", "We learn more from playing outside than from worksheets", "Some homework is essential for building good study habits", "The head teacher should reduce homework"],
            interactPassage: "The school council carried out a survey of every child in Key Stage Two about school lunches. The results showed that sixty-five per cent of children would prefer a wider choice of hot meals. Currently, the canteen offers two options each day. The catering manager, Mrs Ford, said she believes the current menu is perfectly adequate. However, the school council president told the head teacher, 'The children have spoken — we need better food.' The head teacher agreed to review the menu before the summer term.",
            interactQuestion: "Which of these is a FACT, even though it sounds like it could be an opinion?",
            interactOptions: ["Sixty-five per cent of children would prefer a wider choice of hot meals", "The current menu is perfectly adequate", "We need better food", "The school should change the menu immediately", "Hot meals are always better than packed lunches"],
            interactCorrectAnswer: "Sixty-five per cent of children would prefer a wider choice of hot meals",
            interactWhyActuallyFact: "The survey result is a provable fact — 65% of children DID say this. It is a fact about what the survey found, which can be verified by checking the results."
          },
          {
            name: "Grace",
            passage: "Scientists at the University of Bristol have discovered a new species of beetle in a forest in Cornwall. The beetle is just three millimetres long and has bright blue wings. The researchers believe it may have been living in British woodlands for thousands of years without being noticed. Dr Patel, who led the research team, described it as 'the most remarkable insect discovery in decades'. The study was published in the journal Nature last month. Many experts agree that more species are waiting to be found in Britain's ancient woodlands.",
            question: "Which of these is an OPINION?",
            correctAnswer: "The most remarkable insect discovery in decades",
            wrongThinking: "People might think the experts' agreement is an opinion",
            whyActuallyFact: "'Many experts agree' is a provable fact — you could check whether experts actually said this. But 'most remarkable' is Dr Patel's personal judgement.",
            actualOpinion: "The most remarkable insect discovery in decades",
            whyOpinion: "'Most remarkable' is a judgement — another scientist might think a different discovery was more important",
            options: ["The most remarkable insect discovery in decades", "The beetle is three millimetres long", "The study was published in Nature last month", "Many experts agree that more species are waiting to be found", "The beetle has bright blue wings"],
            interactPassage: "Researchers at the University of Edinburgh have found that children who eat breakfast every day tend to score higher in maths and reading tests. The study followed three thousand pupils over two years. Most teachers in the study agreed that children who skip breakfast find it harder to concentrate. The lead researcher, Professor Clarke, described the findings as 'the most important education study of the decade'. The results were published in the British Medical Journal and covered in several national newspapers.",
            interactQuestion: "Which of these is an OPINION?",
            interactOptions: ["The most important education study of the decade", "The study followed three thousand pupils over two years", "Most teachers agreed that children who skip breakfast find it harder to concentrate", "The results were published in the British Medical Journal", "Researchers found that children who eat breakfast tend to score higher"],
            interactCorrectAnswer: "The most important education study of the decade",
            interactWhyActuallyFact: "'Most important' is Professor Clarke's personal judgement — another researcher might consider a different study more important. The other options, including what 'most teachers agreed', can be verified from the study data."
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the tricky ones?",
            body: (v) => `Some facts LOOK like opinions, and some opinions LOOK like facts. These tricky ones catch out even adults — but not you, once you know the trick!\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Facts about opinions are still facts!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Question: ${v.question}**\n\nHere is the tricky part: **a statement about what people think can still be a FACT** — because you can prove whether people really said it.\n\n${v.wrongThinking}.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Tricky one: "${v.correctAnswer}"`, why: v.whyActuallyFact },
                    { text: `Clear opinion: "${v.actualOpinion}"`, why: v.whyOpinion },
                    { text: "The test: can the STATEMENT ITSELF be checked?", why: "If someone reported or measured it, it is a fact — even if the topic is feelings or beliefs. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `"A survey found that 70% of children prefer football" is an opinion because it's about preferences`, answer: false, explanation: `Tricky! This is actually a FACT — the survey result can be checked. It reports what was measured, even though the topic is preferences. ✓` },
                { text: `Words like "best", "worst", "I believe", and "probably" often signal an opinion`, answer: true, explanation: `Correct! These words are clue words for opinions. If someone says "best" or "I believe", it usually can't be proven — people would disagree. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Read this new passage and answer the question below.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.interactPassage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.interactWhyActuallyFact} ✓`,
                incorrect: (v) => `Not quite! Be careful with tricky ones. ${v.interactWhyActuallyFact} The answer is: **"${v.interactCorrectAnswer}"**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Tricky fact vs opinion rules — you're ready!",
            body: () => `Now you know the secret, watch out for these tricky cases:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "'72% of people think X' = FACT", why: "The survey result can be checked — it is a fact about what people think." },
                  { text: "'X is the best/worst/most beautiful' = OPINION", why: "Words like best, worst, and most signal a personal judgement." },
                  { text: "'Scientists have discovered X' = FACT", why: "The discovery can be verified in journals and reports." },
                  { text: "'The most remarkable discovery in decades' = OPINION", why: "'Most remarkable' is a judgement, not a measurement. ✓" }
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
  // SUB-CONCEPT 9: tone-mood
  // Tone, Mood and Atmosphere
  // Category: other
  // Lesson A: step-by-step | Lesson B: visual-discovery
  // ==========================================
  {
    id: "tone-mood",
    name: "Tone, Mood and Atmosphere",
    category: "other",
    lessons: [
      // ---- Lesson A: Step-by-Step (Identifying Tone and Mood) ----
      {
        id: "tone-mood-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to identify the tone (the writer's attitude) and mood (the feeling created for the reader) of a passage — this is where reading gets really interesting!",
          "How to use word choice as evidence for tone and mood"
        ],
        variableSets: [
          {
            name: "Harley",
            passage: "The corridor was dark and silent. Maya pressed her back against the cold wall and held her breath. Somewhere ahead, a door creaked open, then slowly shut again. The only light came from a thin crack under the door at the far end, casting a pale sliver across the stone floor. Her heart drummed in her ears. She wanted to turn and run, but her legs felt heavy, as though they were filled with sand. A shadow moved beneath the door. Something — or someone — was on the other side.",
            question: "What is the mood of this passage?",
            correctAnswer: "Tense and mysterious",
            options: ["Tense and mysterious", "Cheerful and playful", "Sad and lonely", "Angry and frustrated", "Calm and peaceful"],
            moodWord: "tense and mysterious",
            evidence1: "'dark and silent' — the setting feels secretive and dangerous",
            evidence2: "'held her breath' and 'heart drummed' — Maya is frightened",
            evidence3: "'a shadow moved beneath the door' — something unknown creates suspense",
            wordChoiceEffect: "The author uses darkness, silence, and unknown shadows to make the reader feel uneasy and curious"
          },
          {
            name: "Jude",
            passage: "Sunlight poured through the kitchen window as Nana hummed an old tune. The smell of freshly baked scones drifted through the house, warm and sweet. Rosie sat at the table, licking jam from her fingers while the cat purred on her lap. Outside, bees moved lazily between the lavender pots, and a blackbird sang from the top of the garden fence. Nana placed a cup of hot chocolate in front of Rosie and kissed the top of her head. 'No rush today,' she said softly. 'We have all the time in the world.'",
            question: "What is the mood of this passage?",
            correctAnswer: "Warm and peaceful",
            options: ["Warm and peaceful", "Tense and frightening", "Sad and gloomy", "Excited and energetic", "Angry and frustrated"],
            moodWord: "warm and peaceful",
            evidence1: "'sunlight poured' and 'warm and sweet' — the setting feels cosy",
            evidence2: "'cat purred', 'bees moved lazily', 'blackbird sang' — everything is calm and gentle",
            evidence3: "'No rush today... all the time in the world' — there is no pressure or stress",
            wordChoiceEffect: "The author uses warmth, gentle sounds, and slow movement to create a feeling of comfort and safety"
          },
          {
            name: "Kira",
            passage: "Rain streaked down the car window as Dad drove away from the house for the last time. Mia stared at the shrinking rooftop in the wing mirror until it disappeared behind a row of trees. Her bedroom — with the glow-in-the-dark stars on the ceiling and the pencil marks on the doorframe where Mum used to measure her height — belonged to someone else now. She pressed her forehead against the cold glass and closed her eyes. The radio played a song she did not recognise. Nobody spoke. The car smelled of cardboard boxes and damp coats.",
            question: "What is the mood of this passage?",
            correctAnswer: "Sad and melancholy",
            options: ["Sad and melancholy", "Excited and adventurous", "Angry and bitter", "Mysterious and spooky", "Light and humorous"],
            moodWord: "sad and melancholy",
            evidence1: "'drove away from the house for the last time' — loss and goodbye",
            evidence2: "'stared at the shrinking rooftop' — Mia is watching her old life disappear",
            evidence3: "'nobody spoke' and 'cold glass' — silence and coldness reflect sadness",
            wordChoiceEffect: "The author uses images of leaving, silence, and coldness to make the reader feel the sadness of moving away"
          },
          {
            name: "Layla",
            passage: "The starting pistol cracked and the crowd erupted. Zain launched forward, his trainers pounding the track. Wind rushed past his ears as he overtook one runner, then another. The spectators were a blur of waving arms and screaming voices. His lungs burned, his legs screamed, but he pushed harder. The finish line ribbon stretched ahead like a white smile. Ten metres. Five metres. He threw his chest forward and felt the ribbon snap against his shirt. The crowd roared. His teammates rushed onto the track, jumping and shouting. Zain bent over, hands on his knees, grinning from ear to ear.",
            question: "What is the mood of this passage?",
            correctAnswer: "Exciting and triumphant",
            options: ["Exciting and triumphant", "Calm and relaxed", "Dark and mysterious", "Worried and anxious", "Bored and dull"],
            moodWord: "exciting and triumphant",
            evidence1: "'the crowd erupted' and 'screaming voices' — high energy and noise",
            evidence2: "'lungs burned', 'legs screamed', 'pushed harder' — intense physical effort",
            evidence3: "'the crowd roared', 'grinning from ear to ear' — celebration and joy",
            wordChoiceEffect: "The author uses fast-paced verbs, physical sensations, and crowd reactions to make the reader feel the thrill of the race"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "How does this passage make you feel?",
            body: (v) => `Did you know that writers choose their words carefully to create a **mood** — a feeling the reader experiences? The **tone** is the writer's attitude. Can you feel what mood this passage creates?\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Step by step: identifying mood and tone",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Question: ${v.question}**\n\n**Mood** is how the passage makes the reader feel. Writers create mood through their choice of words, setting details, and sentence patterns. Let's find the evidence.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: "Step 1: Read the passage and notice how it makes you feel", why: `This passage feels ${v.moodWord}.` },
                    { text: `Step 2: Find evidence — ${v.evidence1}`, why: "Word choice creates the mood." },
                    { text: `Step 3: More evidence — ${v.evidence2}`, why: "Multiple details work together." },
                    { text: `Step 4: Even more — ${v.evidence3}`, why: "All the evidence points the same way." },
                    { text: `Mood: ${v.moodWord}`, why: `${v.wordChoiceEffect}. ✓` }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: {
              type: "fill-blank",
              sentence: (v) => `Writers create mood through their choice of ____, setting details, and sentence patterns`,
              options: (v) => ["words", "fonts", "colours", "pictures"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Word choice is the main tool writers use to create mood — dark words create a dark mood, bright words create a cheerful mood. ✓`,
                incorrect: (v) => `Not quite — writers create mood primarily through their choice of WORDS. The vocabulary sets the feeling.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Read the passage below:`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Find the evidence:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.question,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! The mood is **${v.moodWord}**. ${v.wordChoiceEffect}. ✓`,
                incorrect: (v) => `Not quite! Look at the evidence: ${v.evidence1}; ${v.evidence2}; ${v.evidence3}. The mood is **${v.moodWord}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The tone and mood recipe — fantastic work!",
            body: () => `Here's how to identify tone and mood in any passage — you'll start noticing it everywhere:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Read the passage and notice your FEELINGS", why: "Does it make you feel happy, scared, sad, excited, calm?" },
                  { text: "Step 2: Look at WORD CHOICES", why: "'Crept', 'shadow', 'silent' = tense. 'Sunshine', 'laughed', 'warm' = cheerful." },
                  { text: "Step 3: Look at the SETTING and DETAILS", why: "Dark, cold, empty = gloomy. Bright, warm, busy = lively." },
                  { text: "Step 4: Name the mood using precise words", why: "Not just 'happy' — try 'joyful', 'content', 'triumphant', or 'playful'. ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Visual-Discovery (Contrasting Moods) ----
      {
        id: "tone-mood-contrast",
        templateType: "visual-discovery",
        learningGoal: [
          "How to see that different word choices create completely different moods",
          "How to match passages to their tone and mood with evidence"
        ],
        variableSets: [
          {
            name: "Max",
            passage: "The fairground blazed with colour and noise. Rides spun and swooped, trails of light streaking against the night sky. Music thumped from every direction, mixing with the screams and laughter of the crowd. The sweet, buttery smell of popcorn floated through the air, and a candy floss machine whirred beside a stall selling giant teddy bears. Ollie grabbed his sister's hand and pulled her towards the dodgems, his eyes wide with excitement. 'Come ON!' he shouted over the noise. 'We only have an hour!'",
            question: "What is the tone of this passage?",
            correctAnswer: "Exciting and energetic",
            options: ["Exciting and energetic", "Mysterious and eerie", "Sad and reflective", "Calm and soothing", "Angry and aggressive"],
            mood: "Exciting and energetic",
            keyWords: "blazed, spun, swooped, thumped, screams, laughter, wide with excitement",
            contrast: "If the author had written 'the fairground stood dark and empty, rides creaking in the wind', the mood would be completely different — eerie and abandoned",
            technique: "Fast-paced verbs and sensory overload (sound, sight, smell) create energy and excitement"
          },
          {
            name: "Nadia",
            passage: "The old house had been empty for years. Paint peeled from the window frames like dead skin, and the front garden had been swallowed by nettles and brambles. A 'For Sale' sign leaned drunkenly against the gate, its letters faded to nothing. Inside, dust coated every surface. The floorboards groaned underfoot, and cobwebs hung from the light fittings like grey curtains. In the kitchen, a single mug stood on the counter beside the sink, as though someone had put it down and simply walked away. The clock on the wall had stopped at twenty past three.",
            question: "What is the mood of this passage?",
            correctAnswer: "Eerie and melancholy",
            options: ["Eerie and melancholy", "Cheerful and inviting", "Exciting and thrilling", "Angry and violent", "Warm and nostalgic"],
            mood: "Eerie and melancholy",
            keyWords: "empty, peeled like dead skin, swallowed, faded to nothing, dust, groaned, cobwebs, stopped",
            contrast: "If the author had written 'the old house glowed with warm light and the garden bloomed with roses', the mood would be welcoming and cheerful",
            technique: "Images of decay, emptiness, and things left behind create a haunting sense of abandonment"
          },
          {
            name: "Oscar",
            passage: "Dear Mrs Patterson, I am writing to complain about the disgraceful state of the children's playground in Elms Park. The swings have been broken for three months and nobody has bothered to fix them. The climbing frame is covered in rust, and I have personally seen children cutting themselves on the jagged edges. It is an absolute scandal that our council tax goes up every year while our children are forced to play in dangerous conditions. I expect a full response within seven days, or I will be contacting the local newspaper. Yours sincerely, Mr R. Khan",
            question: "What is the tone of this passage?",
            correctAnswer: "Angry and critical",
            options: ["Angry and critical", "Polite and grateful", "Sad and hopeless", "Humorous and light-hearted", "Calm and balanced"],
            mood: "Angry and critical",
            keyWords: "disgraceful, nobody has bothered, absolute scandal, forced, dangerous, I expect",
            contrast: "If the author had written 'I would be grateful if you could look into improving the playground', the tone would be polite and measured instead",
            technique: "Strong negative words ('disgraceful', 'scandal'), accusations ('nobody has bothered'), and a deadline ('within seven days') show anger and frustration"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Words create feelings!",
            body: (v) => `Here's something amazing — the words an author chooses create a **mood** and show their **tone**. Even swapping a few words can completely transform how a passage feels!\n\n**Question: ${v.question}**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Read the passage:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Discover how words create mood!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Question: ${v.question}**\n\nLet's look at the key words and see how they create the mood.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Key words: ${v.keyWords}`, why: v.technique },
                    { text: `Mood: ${v.mood}`, why: "All these word choices work together to create this feeling." },
                    { text: `Imagine the opposite: ${v.contrast}`, why: "Word choice is EVERYTHING — change the words, change the mood. ✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Read the passage below:`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "evidence",
                passage: v.passage,
                evidenceSentence: "",
                label: "Find the evidence:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.question,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Well done! The mood is **${v.mood}**. ${v.technique}. ✓`,
                incorrect: (v) => `Not quite! Look at the key words: ${v.keyWords}. ${v.technique}. The mood is **${v.mood}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Mood and tone cheat sheet — keep this in your head!",
            body: () => `Here are common moods and the word choices that create them — once you know these, you'll spot them everywhere:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Tense/mysterious: dark, shadow, crept, silence, unknown", why: "Makes the reader feel uneasy and curious." },
                  { text: "Cheerful/warm: sunshine, laughter, golden, smiled, gentle", why: "Makes the reader feel happy and comfortable." },
                  { text: "Sad/melancholy: cold, empty, alone, silence, grey, faded", why: "Makes the reader feel sorrow or loss." },
                  { text: "Exciting/energetic: rushed, roared, blazed, pounded, screamed", why: "Makes the reader's heart beat faster. ✓" }
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
  // SUB-CONCEPT: Word Class in Context
  // Category: core — 2 lessons (step-by-step + spot-the-mistake)
  // PLAYBOOK compliant, warmth pass applied
  // ==========================================
  {
    id: "word-class",
    name: "Spotting Word Types in Passages",
    category: "core",
    lessons: [
      {
        id: "word-class-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot nouns, verbs, adjectives, adverbs, and prepositions in a real passage",
          "Why the same word can be different types depending on how it's used"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "is doing a comprehension question that asks about word types",
            sentence: "The brave knight rode swiftly through the dark forest.",
            targetWord: "swiftly",
            answer: "adverb",
            tip: "Ask yourself: does this word tell me HOW something happened? 'Swiftly' tells us HOW the knight rode. That makes it an adverb! Most adverbs end in '-ly' — that's your biggest clue.",
            wrongGuess: "adjective",
            whyWrong: "'Swiftly' isn't describing a thing (like 'brave' describes the knight). It's describing an ACTION — how he rode.",
            intSentence: "The cat crept silently across the moonlit garden.",
            intWord: "silently",
            intOptions: ["A noun", "A verb", "An adjective", "An adverb", "A preposition"],
            intCorrect: 3,
            intExplanation: "'Silently' tells us HOW the cat crept — that '-ly' ending is your clue! Adverbs describe verbs."
          },
          {
            name: "Oliver",
            scenario: "needs to identify what type of word 'enormous' is",
            sentence: "The enormous whale surfaced beside the tiny boat.",
            targetWord: "enormous",
            answer: "adjective",
            tip: "Ask yourself: is this word describing a THING? 'Enormous' tells us about the whale — what kind of whale? An enormous one! Words that describe nouns are called adjectives.",
            wrongGuess: "adverb",
            whyWrong: "'Enormous' isn't describing how something happened — it's describing what the whale is LIKE. It's an adjective.",
            intSentence: "The freezing wind blew across the empty playground.",
            intWord: "freezing",
            intOptions: ["A noun", "A verb", "An adjective", "An adverb", "A preposition"],
            intCorrect: 2,
            intExplanation: "'Freezing' describes the wind — what kind of wind? Freezing wind! When a word describes a noun, it's an adjective."
          },
          {
            name: "Amira",
            scenario: "is trying to work out if 'between' is a preposition",
            sentence: "The little mouse scurried between the ancient stone walls.",
            targetWord: "between",
            answer: "preposition",
            tip: "Prepositions are position and direction words. They tell us WHERE or WHICH WAY: in, on, under, through, between, beside, above, below. 'Between' tells us WHERE the mouse went!",
            wrongGuess: "adverb",
            whyWrong: "'Between' shows position (where the mouse went), not how it moved. Position words are prepositions.",
            intSentence: "The bird landed on the highest branch of the oak tree.",
            intWord: "on",
            intOptions: ["A noun", "A verb", "An adjective", "An adverb", "A preposition"],
            intCorrect: 4,
            intExplanation: "'On' tells us WHERE the bird landed — on the branch. Small position words like 'on', 'in', 'at', 'by', 'to' are almost always prepositions."
          },
          {
            name: "Jake",
            scenario: "is confused because 'running' looks like a verb but might not be",
            sentence: "The running water sparkled in the morning sunshine.",
            targetWord: "running",
            answer: "adjective",
            tip: "Here's the trick: 'running' LOOKS like a verb, but it's describing the water (what kind of water? running water). When an '-ing' word sits before a noun and describes it, it's working as an adjective!",
            wrongGuess: "verb",
            whyWrong: "In 'the running water', nobody is doing the action of running — 'running' is describing what TYPE of water it is.",
            intSentence: "The broken window let in a cold draught.",
            intWord: "broken",
            intOptions: ["A noun", "A verb", "An adjective", "An adverb", "A conjunction"],
            intCorrect: 2,
            intExplanation: "'Broken' describes the window — what kind of window? A broken one. Even though 'broken' comes from the verb 'break', here it's working as an adjective."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => v.name + "'s word type question",
            body: (v) => v.name + " " + v.scenario + ".\n\nLook at this sentence:\n\n**\"" + v.sentence + "\"**\n\nWhat type of word is **'" + v.targetWord + "'**?",
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({ sentence: v.sentence, highlightWords: [v.targetWord] })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "How to work out word types",
            body: () => "Here's a quick trick:",
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: "The word is: '" + v.targetWord + "'", why: "Let's figure out what type it is..." },
                  { text: "It's " + (v.answer === "adverb" ? "an" : "a") + " **" + v.answer + "**!", why: v.tip },
                  { text: "Common mistake: thinking it's " + (v.wrongGuess === "adverb" ? "an" : "a") + " " + v.wrongGuess, why: v.whyWrong }
                ]
              })
            },
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => "In **\"" + v.intSentence + "\"**, what type of word is **'" + v.intWord + "'**?",
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({ sentence: v.intSentence, highlightWords: [v.intWord] })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.intOptions,
              correctAnswer: (v) => v.intOptions[v.intCorrect],
              feedback: {
                correct: (v) => "Brilliant! " + v.intExplanation + " ✓",
                incorrect: (v) => "Not quite! " + v.intExplanation
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Word type cheat sheet!",
            body: () => "Ask yourself these questions:",
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "NOUN: Is it a thing, person, or place?", why: "'dog', 'London', 'happiness'" },
                  { text: "VERB: Is it an action or state of being?", why: "'ran', 'thinks', 'is'" },
                  { text: "ADJECTIVE: Does it describe a noun?", why: "'enormous', 'red', 'broken'" },
                  { text: "ADVERB: Does it describe HOW/WHEN/WHERE?", why: "'quickly', 'yesterday' — look for '-ly'!" },
                  { text: "PREPOSITION: Does it show position/direction?", why: "'in', 'on', 'under', 'between', 'through'" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "word-class-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid the most common mix-ups between word types"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "thinks 'carefully' is an adjective",
            word: "carefully",
            sentence: "She carefully placed the vase on the shelf.",
            wrongAnswer: "adjective",
            rightAnswer: "adverb",
            why: "'Carefully' tells us HOW she placed the vase — it describes the verb 'placed', not a noun. That '-ly' ending is your best friend!",
            intQuestion: "What type of word is 'gently' in: 'He gently stroked the kitten'?",
            intOptions: ["Noun", "Verb", "Adjective", "Adverb", "Preposition"],
            intCorrect: 3,
            intExplanation: "'Gently' tells us HOW he stroked — it's an adverb describing the verb."
          },
          {
            name: "Ben",
            scenario: "thinks 'between' is an adverb",
            word: "between",
            sentence: "The cat squeezed between the fence posts.",
            wrongAnswer: "adverb",
            rightAnswer: "preposition",
            why: "'Between' shows WHERE the cat went — it's a position word followed by a noun ('the fence posts'). That makes it a preposition.",
            intQuestion: "What type of word is 'through' in: 'Water flowed through the pipe'?",
            intOptions: ["Noun", "Verb", "Adjective", "Adverb", "Preposition"],
            intCorrect: 4,
            intExplanation: "'Through' shows WHERE the water flowed — it's a preposition."
          },
          {
            name: "Sophie",
            scenario: "thinks 'shining' is always a verb",
            word: "shining",
            sentence: "The shining stars lit up the winter sky.",
            wrongAnswer: "verb",
            rightAnswer: "adjective",
            why: "'Shining' sits right before 'stars' and tells us what kind of stars they are. When '-ing' words describe nouns, they're working as adjectives!",
            intQuestion: "What type of word is 'frozen' in: 'The frozen lake glistened'?",
            intOptions: ["Noun", "Verb", "Adjective", "Adverb", "Preposition"],
            intCorrect: 2,
            intExplanation: "'Frozen' describes the lake — it's an adjective. Even though it comes from 'freeze', here it describes a noun."
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the mistake?",
            body: (v) => v.name + " " + v.scenario + ".\n\n**\"" + v.sentence + "\"**\n\n" + v.name + " says '" + v.word + "' is " + (v.wrongAnswer === "adverb" ? "an " : "a ") + v.wrongAnswer + ". Is that right?",
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({ sentence: v.sentence, highlightWords: [v.word] })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the mistake!",
            body: (v) => v.name + " got it wrong!",
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: v.name + " said: " + v.wrongAnswer, why: "Nope!" },
                  { text: "Actually it's " + (v.rightAnswer === "adverb" ? "an " : "a ") + v.rightAnswer, why: v.why }
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
              component: "WorkedExample",
              props: (v) => ({ steps: v.intOptions.map((o, i) => ({ text: (i+1) + ". " + o, why: "" })), allRevealed: true })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.intOptions,
              correctAnswer: (v) => v.intOptions[v.intCorrect],
              feedback: {
                correct: (v) => "Superstar! " + v.intExplanation + " ✓",
                incorrect: (v) => "Nearly there! " + v.intExplanation
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Word type traps — busted!",
            body: () => "The three biggest mix-ups to watch for:",
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Adjective vs Adverb", why: "Adjectives describe THINGS. Adverbs describe ACTIONS. Look for '-ly'!" },
                  { text: "'-ing' words can be adjectives!", why: "'The running water' — 'running' describes the water" },
                  { text: "Preposition vs Adverb", why: "If a position word is followed by a noun, it's a preposition" }
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

// ============================================================
// Supplementary sub-concepts for Number-Word Codes (Verbal Reasoning)
// To merge: add these to lessonBank.numberWordCodes.subConcepts array in lessonData.js
// ============================================================

export const numberWordCodesSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: Build the Table
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "build-the-table",
    name: "Build the Mapping Table",
    category: "core",
    lessons: [
      {
        id: "build-the-table-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to crack any code by mapping each letter to its number",
          "Why writing out the full table is your secret weapon against mistakes"
        ],
        variableSets: [
          {
            // Mapping: S=1, P=2, O=3, T=4
            // SPOT=1234, TOPS=4321, POST=2314
            name: "Daisy",
            scenario: "building her first mapping table",
            words: [
              { word: "SPOT", code: "1234" },
              { word: "TOPS", code: "4321" }
            ],
            mapping: { S: 1, P: 2, O: 3, T: 4 },
            testWord: "POST",
            testCode: "2314",
            options: ["2314", "3214", "2341", "1234", "4321"],
            correctAnswer: "2314",
            explanation: "From SPOT=1234: S=1, P=2, O=3, T=4. Check with TOPS=4321: T(4) O(3) P(2) S(1) = 4321 — confirmed! POST = P(2) O(3) S(1) T(4) = 2314. ✓",
            // Interact-specific (different target word using same mapping)
            interactTestWord: "POTS",
            interactTestCode: "2341",
            interactOptions: ["2341", "2314", "2431", "4321", "1234"],
            interactCorrectAnswer: "2341",
            interactExplanation: "Using the same table: S=1, P=2, O=3, T=4. POTS = P(2) O(3) T(4) S(1) = 2341. ✓"
          },
          {
            // Mapping: C=1, A=2, R=3, E=4
            // CARE=1234, RACE=3214, ACRE=2134
            name: "Oliver",
            scenario: "practising his mapping table skills",
            words: [
              { word: "CARE", code: "1234" },
              { word: "RACE", code: "3214" }
            ],
            mapping: { C: 1, A: 2, R: 3, E: 4 },
            testWord: "ACRE",
            testCode: "2134",
            options: ["2134", "2314", "1234", "4321", "3214"],
            correctAnswer: "2134",
            explanation: "From CARE=1234: C=1, A=2, R=3, E=4. Check with RACE=3214: R(3) A(2) C(1) E(4) — confirmed! ACRE = A(2) C(1) R(3) E(4) = 2134. ✓",
            // Interact-specific (different target word using same mapping)
            interactTestWord: "ACER",
            interactTestCode: "2143",
            interactOptions: ["2143", "2134", "2413", "1243", "3241"],
            interactCorrectAnswer: "2143",
            interactExplanation: "Using the same table: C=1, A=2, R=3, E=4. ACER = A(2) C(1) E(4) R(3) = 2143. ✓"
          },
          {
            // Mapping: S=1, A=2, L=3, T=4
            // SALT=1234, LAST=3214, SLAT=1324
            name: "Priya",
            scenario: "writing out her letter-number pairs neatly",
            words: [
              { word: "SALT", code: "1234" },
              { word: "LAST", code: "3214" }
            ],
            mapping: { S: 1, A: 2, L: 3, T: 4 },
            testWord: "SLAT",
            testCode: "1324",
            options: ["1324", "1234", "3241", "4321", "2413"],
            correctAnswer: "1324",
            explanation: "From SALT=1234: S=1, A=2, L=3, T=4. Check with LAST=3214: L(3) A(2) S(1) T(4) — confirmed! SLAT = S(1) L(3) A(2) T(4) = 1324. ✓",
            // Interact-specific (different target word using same mapping)
            interactTestWord: "ALTS",
            interactTestCode: "2341",
            interactOptions: ["2341", "2314", "2431", "3241", "4231"],
            interactCorrectAnswer: "2341",
            interactExplanation: "Using the same table: S=1, A=2, L=3, T=4. ALTS = A(2) L(3) T(4) S(1) = 2341. ✓"
          },
          {
            // Mapping: S=1, T=2, E=3, P=4
            // STEP=1234, PEST=4312, PETS=4321
            name: "Finn",
            scenario: "building a table for a tricky puzzle",
            words: [
              { word: "STEP", code: "1234" },
              { word: "PEST", code: "4312" }
            ],
            mapping: { S: 1, T: 2, E: 3, P: 4 },
            testWord: "PETS",
            testCode: "4321",
            options: ["4321", "3241", "4231", "4312", "2341"],
            correctAnswer: "4321",
            explanation: "From STEP=1234: S=1, T=2, E=3, P=4. Check with PEST=4312: P(4) E(3) S(1) T(2) — confirmed! PETS = P(4) E(3) T(2) S(1) = 4321. ✓",
            // Interact-specific (different target word using same mapping)
            interactTestWord: "SEPT",
            interactTestCode: "1342",
            interactOptions: ["1342", "1324", "1432", "3142", "4312"],
            interactCorrectAnswer: "1342",
            interactExplanation: "Using the same table: S=1, T=2, E=3, P=4. SEPT = S(1) E(3) P(4) T(2) = 1342. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you crack the secret code?",
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere are two coded (changed using a rule) words:\n\n**${v.words[0].word} = ${v.words[0].code}**\n**${v.words[1].word} = ${v.words[1].code}**\n\nEach letter maps to exactly one number. Can you figure out what **${v.testWord}** would be? Let's find out!`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Write out every pair",
            body: (v) => `Let's crack **${v.words[0].word} = ${v.words[0].code}** and **${v.words[1].word} = ${v.words[1].code}**.\n\nHere's the golden rule: write out **every** letter-number pair in a table. Trying to hold it in your head is where mistakes creep in!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Line up ${v.words[0].word} with ${v.words[0].code}`, why: `${Object.entries(v.mapping).map(([l, n]) => `${l}=${n}`).join(", ")}` },
                  { text: `Check with ${v.words[1].word} = ${v.words[1].code}`, why: "Every letter should match — if not, re-check!" },
                  { text: `Now decode: ${v.testWord} = ${v.testCode}`, why: "Replace each letter using your table" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Line up each letter of ${v.words[0].word} with its digit in ${v.words[0].code}`,
                `Check your table against the second word ${v.words[1].word} = ${v.words[1].code}`,
                `Replace each letter of ${v.testWord} with its number from the table`
              ],
              feedback: {
                correct: (v) => `Perfect! Line up, check, then decode — that's the recipe. ✓`,
                incorrect: (v) => `Not quite — always line up first, then check, then decode!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn — build the table!",
            body: (v) => `**${v.words[0].word} = ${v.words[0].code}**\n**${v.words[1].word} = ${v.words[1].code}**\n\nWhat is the code for **${v.interactTestWord}**?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.interactTestWord, "???"], highlight: true }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the code for ${v.interactTestWord}?`,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "You've got the recipe!",
            body: () => `Every time you see word-code pairs, follow these three steps and you'll nail it:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Write each letter underneath its number", why: "Line them up carefully — position matters!" },
                  { text: "2. Check your table against the second word", why: "If anything doesn't match, fix it before moving on" },
                  { text: "3. Replace each letter in the target word", why: "One letter at a time, using your table ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "build-the-table-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why rushing is the number one reason people lose marks on these questions",
          "How checking each letter one by one keeps you safe from silly mistakes"
        ],
        variableSets: [
          {
            // Mapping: M=1, A=2, D=3, E=4
            // MADE=1234, DAME=3214, target MEAD=1423
            name: "Evie",
            scenario: "checking her friend's code work",
            words: [
              { word: "MADE", code: "1234" },
              { word: "DAME", code: "3214" }
            ],
            mapping: { M: 1, A: 2, D: 3, E: 4 },
            testWord: "MEAD",
            testCode: "1423",
            wrongAnswer: "1234",
            whyWrong: "That's just MADE again! The friend mixed up the letter order — MEAD has a different order from MADE",
            options: ["1423", "1234", "1324", "4231", "2143"],
            correctAnswer: "1423",
            explanation: "M=1, A=2, D=3, E=4. MEAD = M(1) E(4) A(2) D(3) = 1423. Not 1234 — that's MADE! ✓",
            // Interact-specific (different target word using same mapping)
            interactTestWord: "EDAM",
            interactTestCode: "4321",
            interactOptions: ["4321", "4312", "4231", "3421", "4213"],
            interactCorrectAnswer: "4321",
            interactExplanation: "M=1, A=2, D=3, E=4. EDAM = E(4) D(3) A(2) M(1) = 4321. ✓"
          },
          {
            // Mapping: S=4, T=8, A=2, R=5
            // STAR=4825, target RATS=5284
            name: "Marcus",
            scenario: "reviewing his practice test answers",
            words: [
              { word: "STAR", code: "4825" }
            ],
            mapping: { S: 4, T: 8, A: 2, R: 5 },
            testWord: "RATS",
            testCode: "5284",
            wrongAnswer: "5824",
            whyWrong: "He swapped the A and T numbers — always go letter by letter, not from memory",
            options: ["5284", "5824", "5248", "5842", "2584"],
            correctAnswer: "5284",
            explanation: "S=4, T=8, A=2, R=5. RATS = R(5) A(2) T(8) S(4) = 5284. Go letter by letter! ✓",
            // Interact-specific (different target word using same mapping)
            interactTestWord: "ARTS",
            interactTestCode: "2584",
            interactOptions: ["2584", "2548", "2854", "5284", "2845"],
            interactCorrectAnswer: "2584",
            interactExplanation: "S=4, T=8, A=2, R=5. ARTS = A(2) R(5) T(8) S(4) = 2584. ✓"
          },
          {
            // Mapping: R=3, O=1, P=6, E=9
            // ROPE=3169, PORE=6139, target REPO=3961
            name: "Aisha",
            scenario: "helping her brother check his answers",
            words: [
              { word: "ROPE", code: "3169" },
              { word: "PORE", code: "6139" }
            ],
            mapping: { R: 3, O: 1, P: 6, E: 9 },
            testWord: "REPO",
            testCode: "3961",
            wrongAnswer: "3916",
            whyWrong: "He wrote the letters in the wrong order — REPO not REOP. Always spell the target word carefully",
            options: ["3961", "3916", "3691", "9361", "6391"],
            correctAnswer: "3961",
            explanation: "R=3, O=1, P=6, E=9. REPO = R(3) E(9) P(6) O(1) = 3961. Spell the word carefully! ✓",
            // Interact-specific: different word-code pair and target (same concept, fresh puzzle)
            interactWords: [
              { word: "GAME", code: "5219" },
              { word: "MAGE", code: "1259" }
            ],
            interactMapping: { G: 5, A: 2, M: 1, E: 9 },
            interactTestWord: "MEGA",
            interactTestCode: "1952",
            interactOptions: ["1952", "1925", "1592", "9152", "1529"],
            interactCorrectAnswer: "1952",
            interactExplanation: "G=5, A=2, M=1, E=9. MEGA = M(1) E(9) G(5) A(2) = 1952. ✓"
          },
          {
            // Mapping: P=1, A=2, R=3, T=4
            // PART=1234, TRAP=4321, target RAPT=3214
            name: "Charlie",
            scenario: "going over his mock test with his mum",
            words: [
              { word: "PART", code: "1234" },
              { word: "TRAP", code: "4321" }
            ],
            mapping: { P: 1, A: 2, R: 3, T: 4 },
            testWord: "RAPT",
            testCode: "3214",
            wrongAnswer: "3241",
            whyWrong: "He got the P and T mixed up — P=1 and T=4, not the other way round",
            options: ["3214", "3241", "2314", "4321", "1234"],
            correctAnswer: "3214",
            explanation: "P=1, A=2, R=3, T=4. RAPT = R(3) A(2) P(1) T(4) = 3214. Don't mix up similar-sounding letters! ✓",
            // Interact-specific (different target word using same mapping)
            interactTestWord: "TARP",
            interactTestCode: "4231",
            interactOptions: ["4231", "4213", "4321", "4132", "2431"],
            interactCorrectAnswer: "4231",
            interactExplanation: "P=1, A=2, R=3, T=4. TARP = T(4) A(2) R(3) P(1) = 4231. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Spot the mistake in "${v.wrongAnswer}"!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nThe word-code pairs are:\n${v.words.map(w => `**${w.word} = ${w.code}**`).join("\n")}\n\nThe answer given for **${v.testWord}** was **${v.wrongAnswer}**. But that's wrong! Can you spot why?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Where did it go wrong?",
            body: (v) => `${v.whyWrong}\n\nThe fix: **go letter by letter** through your table. Never guess or rush!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Mapping: ${Object.entries(v.mapping).map(([l, n]) => `${l}=${n}`).join(", ")}`, why: "Build the table first" },
                  { text: `Wrong: ${v.testWord} = ${v.wrongAnswer}`, why: v.whyWrong },
                  { text: `Right: ${v.testWord} = ${v.testCode} ✓`, why: "Go letter by letter through the word" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `If two words use the same letters, their codes will always be the same`, answer: false, explanation: `No! The ORDER of letters matters. MADE (1234) and MEAD (1423) use the same letters but have different codes.` },
                { text: `You should replace each letter one at a time using your table`, answer: true, explanation: `Correct! Going letter by letter avoids mixing up positions. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "What's the correct code?",
            body: (v) => `${(v.interactWords || v.words).map(w => `**${w.word} = ${w.code}**`).join("\n")}\n\nWhat is the **correct** code for **${v.interactTestWord}**?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...(v.interactWords || v.words).map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.interactTestWord, "???"], highlight: true }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the correct code for ${v.interactTestWord}?`,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Stay sharp — avoid these traps!",
            body: () => `Now you know the common mistakes, you can dodge them every time:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Go letter by letter — don't rush", why: "MEAD ≠ MADE — the order matters!" },
                  { text: "2. Check your table against BOTH words", why: "If it doesn't match, fix it before decoding" },
                  { text: "3. Spell the target word carefully", why: "Write it out, then replace each letter one at a time ✓" }
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
  // SUB-CONCEPT 2: Repeated Letters
  // Category: core
  // ==========================================
  {
    id: "repeated-letters",
    name: "Repeated Letter Anchors",
    category: "core",
    lessons: [
      {
        id: "repeated-letters-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How repeated letters give you a brilliant shortcut to crack codes faster",
          "How to spot 'anchor' letters that unlock the whole puzzle in seconds"
        ],
        variableSets: [
          {
            // CALL: C=1, A=2, L=3 → CALL = 1233 (L appears twice → 3 appears twice)
            // CLAP = 1234... no, we need repeated letters IN the given words
            // BALL: B=1, A=2, L=3 → BALL=1233; TALL: T=4, A=2, L=3 → TALL=4233
            // Let's use: BELL=1233 where B=1, E=2, L=3. The two L's give 33.
            // Test word: BLEED... no, we only have B,E,L mapped. Let's keep it 4-letter.
            // Actually let's use words from the question bank style:
            // BOOK: B=1, O=2, K=3 → BOOK=1223. COOK: C=4, O=2, K=3 → COOK=4223
            // The repeated O→2 appears twice in both words. Test: KOBO... not a word.
            // Let's try: TOOL=8225 where T=8, O=2, L=5 → TOOL=8225. TOOT=8228... no need for second word.
            // Simpler approach: FEEL=1223 where F=1, E=2, L=3. FLEE=1322. Target: LEAF... we don't have A mapped.
            // OK let's use: DEED=1221 D=1,E=2; FEED=3221 F=3,E=2,D=1; target FEED... already given.
            // Best: SEES=1221 S=1,E=2; SEED=1225 needs... too complex.
            // Let me use a clean example:
            // KEEN=1223 K=1,E=2,N=3. E appears twice → 2 appears twice. Second word: KNEE=3122.
            // Target: NECK... we don't have C.
            // Simpler: PEEL=1223 P=1,E=2,L=3. E appears twice → 2 appears twice.
            // LEAP=3214... wait, A not mapped.
            // Let me just use BOOK=1223, B=1,O=2,K=3. Test word: hook → need H...
            // Going even simpler for a 9-year-old:
            // Given: MOON=1223 (M=1, O=2, N=3). O appears twice → 2 appears twice.
            // Second clue: NOON=3223 (N=3, O=2, N=3) — wait, N appears twice too → 3 appears twice.
            // That's perfect for teaching repeated letters! Target: MONO=1232
            name: "Daisy",
            scenario: "spotting repeated letters to crack codes faster",
            words: [
              { word: "MOON", code: "1223" },
              { word: "NOON", code: "3223" }
            ],
            mapping: { M: 1, O: 2, N: 3 },
            repeatedLetter: "O",
            repeatedNumber: "2",
            testWord: "MONO",
            testCode: "1232",
            options: ["1232", "1223", "1322", "2132", "3212"],
            correctAnswer: "1232",
            explanation: "O appears twice in MOON — and 2 appears twice in 1223. So O=2. From position: M=1, N=3. MONO = M(1) O(2) N(3) O(2) = 1232. ✓"
          },
          {
            // TALL=1233 T=1, A=2, L=3. L appears twice → 3 appears twice.
            // BALL=4233 B=4, A=2, L=3. Confirms A=2, L=3. Target: BLATTT...
            // Target: FLAT... F not mapped. Let's use: BELT... E not mapped.
            // Only T,A,L,B available. Target: BLAB... wait, only 1 B. BATT...
            // Actually: TALL=1233 T=1,A=2,L=3; BALL=4233 B=4,A=2,L=3. Target: FLAT? No F. TAB? only 3 letters.
            // Target ABBOT... too long. Let's go with BALT=4231. Not a real word but VR uses nonsense sometimes.
            // Better: ALL=233 A=2,L=3. TALL=1233. Target: LAT=321.
            // Or use: BELL=1233 B=1,E=2,L=3. BULL=4533... no.
            // Clean: FEED=1224 F=1,E=2,D=4. E repeated → 2 repeated. FLED... L not mapped.
            // OK: DEED=1221 D=1,E=2. FEED=3221 F=3. D repeated in DEED (positions 1&4) → 1 appears in pos 1&4.
            // E repeated in DEED (positions 2&3) → 2 appears in positions 2&3. Target: FADED... too long.
            // Let me just use CALL=1233, C=1, A=2, L=3. The two L's mean 3 appears twice at positions 3&4.
            // Second word: LACE=3214 ... wait we need L=3,A=2,C=1,E=4. But we only have C,A,L.
            // We can introduce E via the second word: CLAP=1234 wouldn't work (no repeated).
            // Cleaner approach: just one word with repeated letters. BOOK=1223 B=1,O=2,K=3.
            // target: no second word needed for the lesson. But pattern needs words array.
            // Let me reconsider. Use: TOOT=1221 T=1,O=2. HOOT=3221 H=3,O=2,T=1. Target: TOOTH=12213... 5 letters but we have T,O,H.
            // TOOTH=12213 → T=1,O=2,T=1,H=3 → 12213. Wait that's 5 chars for 5 letters. T(1)O(2)O(2)T(1)H(3)=12213. Yes!
            // But 5 letter target from 4-letter clues might be confusing. Let's keep 4 letters.
            // Target: HOOT=3221. But that's already given.
            // Target: THOT... not a word. HOT=321 (3 letters).
            // Let's go simpler:
            // COOK=1223 C=1,O=2,K=3. BOOK=4223 B=4. O repeated → 2 repeated. Target: CROOK... 5 letters.
            // Target: CORK... R not mapped.
            // I'll use completely different approach:
            // CLAP=1234, CALL=1233 → wait inconsistent. CLAP has 4 unique letters; CALL has repeated L.
            // Actually: CLAP=1234 C=1,L=2,A=3,P=4. CALL=1322. C(1)A(3)L(2)L(2)=1322. L repeated → 2 repeated.
            // Target: PALL=4322. P(4)A(3)L(2)L(2)=4322. Yes!
            name: "Oliver",
            scenario: "using repeated letters as shortcuts",
            words: [
              { word: "CLAP", code: "1234" },
              { word: "CALL", code: "1322" }
            ],
            mapping: { C: 1, L: 2, A: 3, P: 4 },
            repeatedLetter: "L",
            repeatedNumber: "2",
            testWord: "PALL",
            testCode: "4322",
            options: ["4322", "4232", "4223", "3422", "2432"],
            correctAnswer: "4322",
            explanation: "L appears twice in CALL — and 2 appears twice (1322). So L=2. From CLAP=1234: C=1, A=3, P=4. PALL = P(4) A(3) L(2) L(2) = 4322. ✓"
          },
          {
            // DEED=1221 D=1,E=2. Both D and E appear twice!
            // D twice → 1 in positions 1&4. E twice → 2 in positions 2&3.
            // FEED=3221 F=3,E=2,D=1. Target: FADED... too long.
            // Target: FED=321. Only 3 letters from 4-letter clues. That's fine for VR.
            // Actually let's use: SEES=1221 S=1,E=2. SEED=1224 S=1,E=2,D=4.
            // S appears once in SEED but E appears twice → 2 appears twice in 1224? S=1,E=2,E=2,D=4 → 1224. Yes!
            // Target: DEEDS... too long. Let's keep it short: DEED... D not yet assigned a number.
            // Wait: from SEES=1221, S=1,E=2. From SEED=1224, S=1,E=2,D=4. Target: DEED=4224. D(4)E(2)E(2)D(4)=4224. Yes!
            name: "Priya",
            scenario: "hunting for repeated letters in code puzzles",
            words: [
              { word: "SEES", code: "1221" },
              { word: "SEED", code: "1224" }
            ],
            mapping: { S: 1, E: 2, D: 4 },
            repeatedLetter: "E",
            repeatedNumber: "2",
            testWord: "DEED",
            testCode: "4224",
            options: ["4224", "4242", "4422", "2442", "2244"],
            correctAnswer: "4224",
            explanation: "E appears twice in both words — and 2 appears twice each time. So E=2. From SEES: S=1. From SEED: D=4. DEED = D(4) E(2) E(2) D(4) = 4224. ✓"
          },
          {
            // ROOF=3221 R=3,O=2,F=1. O appears twice → 2 appears twice.
            // FORK=1234 F=1,O=2,R=3,K=4. confirms F=1,O=2,R=3. Target: ROOK=3224... K=4.
            // Wait: from FORK=1234 F=1,O=2,R=3,K=4. ROOF: R(3)O(2)O(2)F(1)=3221. Yes!
            // Target: ROOK=3224. R(3)O(2)O(2)K(4)=3224.
            name: "Finn",
            scenario: "cracking codes with double letters",
            words: [
              { word: "FORK", code: "1234" },
              { word: "ROOF", code: "3221" }
            ],
            mapping: { F: 1, O: 2, R: 3, K: 4 },
            repeatedLetter: "O",
            repeatedNumber: "2",
            testWord: "ROOK",
            testCode: "3224",
            options: ["3224", "3242", "3422", "2234", "3244"],
            correctAnswer: "3224",
            explanation: "O appears twice in ROOF — and 2 appears twice (3221). So O=2. From FORK=1234: F=1, R=3, K=4. ROOK = R(3) O(2) O(2) K(4) = 3224. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Spot the sneaky repeated letter!",
            body: (v) => `${v.name} is ${v.scenario}.\n\n${v.words.map(w => `**${w.word} = ${w.code}**`).join("\n")}\n\n**Did you know?** When a letter appears twice in a word, its matching number also appears twice in the code. That's your shortcut! Can you spot that **${v.repeatedLetter}** appears **twice**?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Repeated letters = instant anchors",
            body: (v) => `Look at **${v.words.find(w => w.word.split('').filter(c => c === v.repeatedLetter).length >= 2)?.word || v.words[0].word}** — the letter **${v.repeatedLetter}** appears **twice**, and so does the number **${v.repeatedNumber}** in its code.\n\nWhen a letter appears twice in a word, its number **must also appear twice** in the same positions. This gives you an instant anchor to start building your table!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.repeatedLetter}" appears twice → find ${v.repeatedNumber} appearing twice`, why: `${v.repeatedLetter}=${v.repeatedNumber} — that's your anchor!` },
                  { text: `Fill in the rest: ${Object.entries(v.mapping).map(([l, n]) => `${l}=${n}`).join(", ")}`, why: "Now the other letters fall into place" },
                  { text: `Decode: ${v.testWord} = ${v.testCode}`, why: "Replace each letter using the table ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `A repeated letter gives you an instant ____ to start building your mapping table`,
              options: (v) => ["anchor", "shortcut", "answer", "guess"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! A repeated letter is an anchor — it locks in one mapping immediately. ✓`,
                incorrect: (v) => `Not quite — a repeated letter is called an anchor because it fixes one mapping straight away!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn — use the anchor!",
            body: (v) => `${v.words.map(w => `**${w.word} = ${w.code}**`).join("\n")}\n\nUse the repeated **${v.repeatedLetter}** to crack the code. What is **${v.testWord}**?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the code for ${v.testWord}?`,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.correctAnswer}. ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Repeated letters — your superpower!",
            body: () => `Top coders always scan for repeated letters first. Once you spot one, the rest of the puzzle falls into place:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Scan both the word AND the code for repeats", why: "MOON has two O's; 1223 has two 2's" },
                  { text: "2. Match the repeated letter to the repeated number", why: "That's your anchor — the first pair you know for sure" },
                  { text: "3. Fill in the rest from there", why: "One anchor makes the whole table easier ✓" }
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
  // SUB-CONCEPT 3: Reverse Decode
  // Category: core
  // ==========================================
  {
    id: "reverse-decode",
    name: "Reverse Decode — Number to Word",
    category: "core",
    lessons: [
      {
        id: "reverse-decode-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to work backwards from a mystery number code to uncover the hidden word",
          "How to flip your mapping table around so numbers point back to letters"
        ],
        variableSets: [
          {
            // BAD=123 B=1,A=2,D=3. Code 321 → D(3)A(2)B(1) = DAB
            name: "Ella",
            scenario: "decoding a mystery number back into a word",
            words: [
              { word: "BAD", code: "123" }
            ],
            mapping: { B: 1, A: 2, D: 3 },
            testCode: "321",
            testWord: "DAB",
            options: ["DAB", "ABD", "DBA", "ADB", "BDA"],
            correctAnswer: "DAB",
            explanation: "From BAD=123: B=1, A=2, D=3. Reverse: 3=D, 2=A, 1=B. So 321 = DAB. ✓",
            // Interact-specific: different word-code pair and target (fresh reverse-decode puzzle)
            interactWords: [
              { word: "GOD", code: "437" }
            ],
            interactMapping: { G: 4, O: 3, D: 7 },
            interactTestCode: "734",
            interactTestWord: "DOG",
            interactOptions: ["DOG", "GOD", "OGD", "DGO", "GDO"],
            interactCorrectAnswer: "DOG",
            interactExplanation: "From GOD=437: G=4, O=3, D=7. Reverse: 7=D, 3=O, 4=G. So 734 = DOG. ✓"
          },
          {
            // TOP=415 T=4,O=1,P=5. Code 541 → P(5)T(4)O(1) = PTO...
            // Wait: 541 → 5=P, 4=T, 1=O → POT. Let me check: P=5? No. TOP=415 T=4,O=1,P=5.
            // 541 = P(5) T(4) O(1) = PTO. That's not a word.
            // 514 = P(5) O(1) T(4) = POT. Yes! Let me use 514.
            // Actually from the question bank: TOP=415, code 541 = POT is listed. Let me recheck.
            // T=4, O=1, P=5. 541: 5=P, 4=T, 1=O → PTO. That's not POT.
            // The question bank says 541 = POT. Let me re-examine: "TOP = 415. What word does 541 stand for?"
            // Answer: POT. But 5=P, 4=T, 1=O → 541 = PTO. That seems wrong...
            // Wait, re-read: the question bank answer says "5=P, 4=T, 1=O → 541 = POT". Let me check letter by letter.
            // 5→P, 4→O... no wait. From TOP=415: T is position 1→4, O is position 2→1, P is position 3→5.
            // So reverse: 4→T, 1→O, 5→P. Code 541: digit 5→P, digit 4→T, digit 1→O → PTO.
            // The question bank seems to have an error there. Let me use a clean example.
            // POTS=6421 P=6,O=4,T=2,S=1. Code 1246 → S(1)T(2)O(4)P(6) = STOP. Yes!
            name: "Oliver",
            scenario: "working backwards from number to word",
            words: [
              { word: "POTS", code: "6421" }
            ],
            mapping: { P: 6, O: 4, T: 2, S: 1 },
            testCode: "1246",
            testWord: "STOP",
            options: ["STOP", "TOPS", "SPOT", "POST", "OPTS"],
            correctAnswer: "STOP",
            explanation: "From POTS=6421: P=6, O=4, T=2, S=1. Reverse: 1=S, 2=T, 4=O, 6=P. So 1246 = STOP. ✓",
            // Interact-specific (different code to decode using same mapping)
            interactTestCode: "4621",
            interactTestWord: "OPTS",
            interactOptions: ["OPTS", "TOPS", "SPOT", "POST", "POTS"],
            interactCorrectAnswer: "OPTS",
            interactExplanation: "From POTS=6421: P=6, O=4, T=2, S=1. Reverse: 4=O, 6=P, 2=T, 1=S. So 4621 = OPTS. ✓"
          },
          {
            // ITEM=2896 I=2,T=8,E=9,M=6. Code 6289 → M(6)I(2)T(8)E(9) = MITE
            name: "Priya",
            scenario: "turning number codes back into words",
            words: [
              { word: "ITEM", code: "2896" }
            ],
            mapping: { I: 2, T: 8, E: 9, M: 6 },
            testCode: "6289",
            testWord: "MITE",
            options: ["MITE", "TIME", "EMIT", "TIEM", "MEIT"],
            correctAnswer: "MITE",
            explanation: "From ITEM=2896: I=2, T=8, E=9, M=6. Reverse: 6=M, 2=I, 8=T, 9=E. So 6289 = MITE. ✓",
            // Interact-specific (different code to decode using same mapping)
            interactTestCode: "9628",
            interactTestWord: "EMIT",
            interactOptions: ["EMIT", "MITE", "TIME", "ITEM", "ETIM"],
            interactCorrectAnswer: "EMIT",
            interactExplanation: "From ITEM=2896: I=2, T=8, E=9, M=6. Reverse: 9=E, 6=M, 2=I, 8=T. So 9628 = EMIT. ✓"
          },
          {
            // CARE=1234 C=1,A=2,R=3,E=4. RACE=3214. Code 2134 → A(2)C(1)R(3)E(4) = ACRE
            name: "Finn",
            scenario: "reversing a number code puzzle",
            words: [
              { word: "CARE", code: "1234" },
              { word: "RACE", code: "3214" }
            ],
            mapping: { C: 1, A: 2, R: 3, E: 4 },
            testCode: "2134",
            testWord: "ACRE",
            options: ["ACRE", "ARCE", "RACE", "ECAR", "CRAE"],
            correctAnswer: "ACRE",
            explanation: "From CARE=1234: C=1, A=2, R=3, E=4. Reverse: 2=A, 1=C, 3=R, 4=E. So 2134 = ACRE. ✓",
            // Interact-specific (different code to decode using same mapping)
            interactTestCode: "2143",
            interactTestWord: "ACER",
            interactOptions: ["ACER", "ACRE", "RACE", "CARE", "ARCE"],
            interactCorrectAnswer: "ACER",
            interactExplanation: "From CARE=1234: C=1, A=2, R=3, E=4. Reverse: 2=A, 1=C, 4=E, 3=R. So 2143 = ACER. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What word is hiding in ${v.testCode}?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n${v.words.map(w => `**${w.word} = ${w.code}**`).join("\n")}\n\nHere's a fun twist — this time you're going **backwards**! You know the code **${v.testCode}**, but what word is hiding inside it?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Build the table, then read it backwards",
            body: (v) => `We know **${v.words[0].word} = ${v.words[0].code}** — now we need to work out what word **${v.testCode}** stands for.\n\nThe method is the same — build your mapping table first. Then for each **number** in the code, find the matching **letter**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Build the table: ${Object.entries(v.mapping).map(([l, n]) => `${l}=${n}`).join(", ")}`, why: "Same table-building step as always" },
                  { text: `Now flip it: ${Object.entries(v.mapping).map(([l, n]) => `${n}→${l}`).join(", ")}`, why: "Number → letter instead of letter → number" },
                  { text: `${v.testCode} = ${v.testWord}`, why: "Replace each digit with its letter ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Build the mapping table from the given word-code pair`,
                `Flip the table so each number points to its letter`,
                `Replace each digit in the mystery code with its letter`
              ],
              feedback: {
                correct: (v) => `Perfect! Build, flip, replace — that's how you reverse decode. ✓`,
                incorrect: (v) => `Not quite — build the table first, then flip it, then replace each digit!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn — decode the number!",
            body: (v) => `${(v.interactWords || v.words).map(w => `**${w.word} = ${w.code}**`).join("\n")}\n\nWhat word does **${v.interactTestCode}** stand for?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...(v.interactWords || v.words).map(w => ({ cells: [w.word, w.code] })),
                  { cells: ["???", v.interactTestCode], highlight: true }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What word does ${v.interactTestCode} stand for?`,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Reverse decode — you've got this!",
            body: () => `When the question gives you a number and asks for the word, just follow these steps:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Build the mapping table as normal", why: "Letter → number from the given word-code pair" },
                  { text: "2. Flip it: number → letter", why: "1→C, 2→A, 3→R, 4→E (for example)" },
                  { text: "3. Replace each digit in the code with its letter", why: "Spell out the word one letter at a time ✓" }
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
  // SUB-CONCEPT 4: Shared Letters
  // Category: supporting
  // ==========================================
  {
    id: "shared-letters",
    name: "Shared Letters — Cross-Reference",
    category: "supporting",
    lessons: [
      {
        id: "shared-letters-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How two words that share letters give you a powerful way to double-check your work",
          "How shared letters between word pairs help you discover new mappings with confidence"
        ],
        variableSets: [
          {
            // CART=1234 C=1,A=2,R=3,T=4. CARD=1235 D=5 (C,A,R shared → confirms 1,2,3).
            // Target: DART = D(5)A(2)R(3)T(4) = 5234
            name: "Daisy",
            scenario: "cross-referencing shared letters between two words",
            words: [
              { word: "CART", code: "1234" },
              { word: "CARD", code: "1235" }
            ],
            mapping: { C: 1, A: 2, R: 3, T: 4, D: 5 },
            sharedLetters: "C, A, R",
            newLetter: "D",
            newNumber: "5",
            testWord: "DART",
            testCode: "5234",
            options: ["5234", "5324", "5243", "3254", "5342"],
            correctAnswer: "5234",
            explanation: "CART and CARD share C=1, A=2, R=3. CART has T=4; CARD has D=5 (the only different letter/number). DART = D(5) A(2) R(3) T(4) = 5234. ✓",
            // Interact-specific (different target word using same mapping)
            interactTestWord: "DRAT",
            interactTestCode: "5324",
            interactOptions: ["5324", "5234", "5342", "5432", "3524"],
            interactCorrectAnswer: "5324",
            interactExplanation: "C=1, A=2, R=3, T=4, D=5. DRAT = D(5) R(3) A(2) T(4) = 5324. ✓"
          },
          {
            // LAND=5162 L=5,A=1,N=6,D=2. SAND=3162 S=3 (A,N,D shared → confirms 1,6,2).
            // Target: ANDS = A(1)N(6)D(2)S(3) = 1623
            name: "Oliver",
            scenario: "comparing two words with shared endings",
            words: [
              { word: "LAND", code: "5162" },
              { word: "SAND", code: "3162" }
            ],
            mapping: { L: 5, A: 1, N: 6, D: 2, S: 3 },
            sharedLetters: "A, N, D",
            newLetter: "S",
            newNumber: "3",
            testWord: "ANDS",
            testCode: "1623",
            options: ["1623", "1263", "6123", "1632", "2163"],
            correctAnswer: "1623",
            explanation: "LAND and SAND share AND=162. LAND has L=5; SAND has S=3. ANDS = A(1) N(6) D(2) S(3) = 1623. ✓",
            // Interact-specific (different target word using same mapping)
            interactTestWord: "DANS",
            interactTestCode: "2163",
            interactOptions: ["2163", "2136", "2631", "2613", "6213"],
            interactCorrectAnswer: "2163",
            interactExplanation: "L=5, A=1, N=6, D=2, S=3. DANS = D(2) A(1) N(6) S(3) = 2163. ✓"
          },
          {
            // SHIP=3628 S=3,H=6,I=2,P=8. WHIP=9628 W=9 (H,I,P shared → 6,2,8).
            // Target: WISH = W(9)I(2)S(3)H(6) = 9236
            name: "Priya",
            scenario: "using shared letters to unlock a new mapping",
            words: [
              { word: "SHIP", code: "3628" },
              { word: "WHIP", code: "9628" }
            ],
            mapping: { S: 3, H: 6, I: 2, P: 8, W: 9 },
            sharedLetters: "H, I, P",
            newLetter: "W",
            newNumber: "9",
            testWord: "WISH",
            testCode: "9236",
            options: ["9236", "9326", "9263", "9362", "9632"],
            correctAnswer: "9236",
            explanation: "SHIP and WHIP share HIP=628. SHIP has S=3; WHIP has W=9. WISH = W(9) I(2) S(3) H(6) = 9236. ✓"
          },
          {
            // BONE=1329 B=1,O=3,N=2,E=9. TONE=4329 T=4 (O,N,E shared → 3,2,9).
            // Target: NOTE = N(2)O(3)T(4)E(9) = 2349
            name: "Finn",
            scenario: "using overlapping words to solve a code puzzle",
            words: [
              { word: "BONE", code: "1329" },
              { word: "TONE", code: "4329" }
            ],
            mapping: { B: 1, O: 3, N: 2, E: 9, T: 4 },
            sharedLetters: "O, N, E",
            newLetter: "T",
            newNumber: "4",
            testWord: "NOTE",
            testCode: "2349",
            options: ["2349", "2394", "2934", "2439", "2493"],
            correctAnswer: "2349",
            explanation: "BONE and TONE share ONE=329. BONE has B=1; TONE has T=4. NOTE = N(2) O(3) T(4) E(9) = 2349. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "What do these words have in common?",
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.words[0].word} = ${v.words[0].code}**\n**${v.words[1].word} = ${v.words[1].code}**\n\nSpot it? These words share the letters **${v.sharedLetters}**! When two words share letters, those letters have the **same numbers** in both codes. That's like having a built-in answer checker!`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Shared letters confirm your table",
            body: (v) => `**${v.words[0].word}** and **${v.words[1].word}** both contain the letters **${v.sharedLetters}** — and those letters have the **same numbers** in both codes.\n\nThis lets you:\n1. Confirm your mapping is right\n2. Spot the **new** letter (**${v.newLetter}**) that's different`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Shared: ${v.sharedLetters} — same numbers in both codes`, why: "These are confirmed" },
                  { text: `New letter: ${v.newLetter}=${v.newNumber}`, why: "The only letter that changed → the only number that changed" },
                  { text: `Decode: ${v.testWord} = ${v.testCode}`, why: "Now you have all the letters you need ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Shared letters", right: "Same numbers in both codes" },
                { left: "New letter", right: "The only number that changed" },
                { left: "Cross-reference", right: "Compare two words to confirm mappings" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn — cross-reference!",
            body: (v) => `**${v.words[0].word} = ${v.words[0].code}**\n**${v.words[1].word} = ${v.words[1].code}**\n\nWhat is the code for **${v.testWord}**?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the code for ${v.testWord}?`,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.correctAnswer}. ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Cross-referencing — a pro move!",
            body: () => `When two words share letters, you've got a really handy trick:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Spot the letters that appear in BOTH words", why: "CART and CARD share C, A, R" },
                  { text: "2. Check their numbers match in both codes", why: "Same letter = same number — if not, re-check!" },
                  { text: "3. The different letter gets the different number", why: "Only one letter changed, so only one number changed ✓" }
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
  // SUB-CONCEPT 5: Four-Letter Codes
  // Category: supporting
  // ==========================================
  {
    id: "four-letter-codes",
    name: "Four-Letter Word Codes",
    category: "supporting",
    lessons: [
      {
        id: "four-letter-codes-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to handle 4-letter word codes like a pro",
          "How to use the table method to crack any 4-letter word code quickly"
        ],
        variableSets: [
          {
            // TRAM=8524 T=8,R=5,A=2,M=4. Target: MART=4258
            name: "Daisy",
            scenario: "working with 4-letter word codes",
            words: [
              { word: "TRAM", code: "8524" }
            ],
            mapping: { T: 8, R: 5, A: 2, M: 4 },
            testWord: "MART",
            testCode: "4258",
            options: ["4258", "4528", "4852", "2458", "4285"],
            correctAnswer: "4258",
            explanation: "From TRAM=8524: T=8, R=5, A=2, M=4. MART = M(4) A(2) R(5) T(8) = 4258. ✓"
          },
          {
            // GALE=8279 G=8,A=2,L=7,E=9. Target: LAGE=7289
            name: "Oliver",
            scenario: "decoding 4-letter word puzzles",
            words: [
              { word: "GALE", code: "8279" }
            ],
            mapping: { G: 8, A: 2, L: 7, E: 9 },
            testWord: "LAGE",
            testCode: "7289",
            options: ["7289", "7298", "7928", "2789", "9278"],
            correctAnswer: "7289",
            explanation: "From GALE=8279: G=8, A=2, L=7, E=9. LAGE = L(7) A(2) G(8) E(9) = 7289. ✓"
          },
          {
            // WINE=3297 W=3,I=2,N=9,E=7. Target: WEIN=3729
            name: "Priya",
            scenario: "practising 4-letter codes for her test",
            words: [
              { word: "WINE", code: "3297" }
            ],
            mapping: { W: 3, I: 2, N: 9, E: 7 },
            testWord: "WEIN",
            testCode: "3729",
            options: ["3729", "3972", "3279", "3927", "3792"],
            correctAnswer: "3729",
            explanation: "From WINE=3297: W=3, I=2, N=9, E=7. WEIN = W(3) E(7) I(2) N(9) = 3729. ✓"
          },
          {
            // SNAP=4819 S=4,N=8,A=1,P=9. Target: PANS=9184
            name: "Finn",
            scenario: "tackling 4-letter code challenges",
            words: [
              { word: "SNAP", code: "4819" }
            ],
            mapping: { S: 4, N: 8, A: 1, P: 9 },
            testWord: "PANS",
            testCode: "9184",
            options: ["9184", "9814", "9148", "9418", "1984"],
            correctAnswer: "9184",
            explanation: "From SNAP=4819: S=4, N=8, A=1, P=9. PANS = P(9) A(1) N(8) S(4) = 9184. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Crack the 4-letter code!",
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.words[0].word} = ${v.words[0].code}**\n\nFour letters, four pairs to track — but you've already done this with 3 letters, so you've got this! Can you decode **${v.testWord}**?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "4 letters, 4 pairs",
            body: (v) => `From **${v.words[0].word} = ${v.words[0].code}**, line up each letter with its number — there are exactly 4 pairs to write down.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.words[0].word} = ${v.words[0].code}`, why: `${Object.entries(v.mapping).map(([l, n]) => `${l}=${n}`).join(", ")}` },
                  { text: `Now decode ${v.testWord} letter by letter`, why: `${v.testWord.split("").map(l => `${l}(${v.mapping[l]})`).join(" ")}` },
                  { text: `${v.testWord} = ${v.testCode} ✓`, why: "Four pairs, four digits — done!" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.words[0].word} = ${v.words[0].code}**\n\nWhat is the code for **${v.testWord}**?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the code for ${v.testWord}?`,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.correctAnswer}. ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "4-letter codes — easy when you're organised!",
            body: () => `Keep it neat and you'll breeze through 4-letter codes:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Write the word out: T R A M", why: "Leave space between letters" },
                  { text: "2. Write the code below: 8 5 2 4", why: "Each number goes under its letter" },
                  { text: "3. Read off the target word using your pairs", why: "MART → M(4) A(2) R(5) T(8) = 4258 ✓" }
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
  // SUB-CONCEPT 6: Five-Letter Codes
  // Category: supporting
  // ==========================================
  {
    id: "five-letter-codes",
    name: "Five-Letter Word Codes",
    category: "supporting",
    lessons: [
      {
        id: "five-letter-codes-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to handle the longest word codes without breaking a sweat",
          "Why staying organised is your biggest advantage with longer words"
        ],
        variableSets: [
          {
            // PLATE=65289 P=6,L=5,A=2,T=8,E=9. PETAL=69825. Target: LEAPT=59268
            name: "Daisy",
            scenario: "tackling 5-letter codes for the first time",
            words: [
              { word: "PLATE", code: "65289" },
              { word: "PETAL", code: "69825" }
            ],
            mapping: { P: 6, L: 5, A: 2, T: 8, E: 9 },
            testWord: "LEAPT",
            testCode: "59268",
            options: ["59268", "59286", "59628", "52968", "59826"],
            correctAnswer: "59268",
            explanation: "From PLATE=65289: P=6, L=5, A=2, T=8, E=9. Check PETAL=69825: P(6) E(9) T(8) A(2) L(5) — confirmed! LEAPT = L(5) E(9) A(2) P(6) T(8) = 59268. ✓"
          },
          {
            // STARE=18234 S=1,T=8,A=2,R=3,E=4. RATES=32841. Target: TEARS=84231
            name: "Oliver",
            scenario: "working through a 5-letter code puzzle",
            words: [
              { word: "STARE", code: "18234" },
              { word: "RATES", code: "32841" }
            ],
            mapping: { S: 1, T: 8, A: 2, R: 3, E: 4 },
            testWord: "TEARS",
            testCode: "84231",
            options: ["84231", "84213", "84321", "82431", "84132"],
            correctAnswer: "84231",
            explanation: "From STARE=18234: S=1, T=8, A=2, R=3, E=4. Check RATES=32841: R(3) A(2) T(8) E(4) S(1) — confirmed! TEARS = T(8) E(4) A(2) R(3) S(1) = 84231. ✓"
          },
          {
            // CRATE=13289 C=1,R=3,A=2,T=8,E=9. TRACE=83219. Target: CATER=12893
            name: "Priya",
            scenario: "solving a challenging 5-letter code",
            words: [
              { word: "CRATE", code: "13289" },
              { word: "TRACE", code: "83219" }
            ],
            mapping: { C: 1, R: 3, A: 2, T: 8, E: 9 },
            testWord: "CATER",
            testCode: "12893",
            options: ["12893", "12839", "12983", "12938", "12389"],
            correctAnswer: "12893",
            explanation: "From CRATE=13289: C=1, R=3, A=2, T=8, E=9. Check TRACE=83219: T(8) R(3) A(2) C(1) E(9) — confirmed! CATER = C(1) A(2) T(8) E(9) R(3) = 12893. ✓"
          },
          {
            // STEAM=18926 S=1,T=8,E=9,A=2,M=6. MEATS=69281. Target: MATES=62891
            name: "Finn",
            scenario: "cracking a tough 5-letter code",
            words: [
              { word: "STEAM", code: "18926" },
              { word: "MEATS", code: "69281" }
            ],
            mapping: { S: 1, T: 8, E: 9, A: 2, M: 6 },
            testWord: "MATES",
            testCode: "62891",
            options: ["62891", "62981", "62819", "62918", "62198"],
            correctAnswer: "62891",
            explanation: "From STEAM=18926: S=1, T=8, E=9, A=2, M=6. Check MEATS=69281: M(6) E(9) A(2) T(8) S(1) — confirmed! MATES = M(6) A(2) T(8) E(9) S(1) = 62891. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Ready for the 5-letter challenge?",
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.words[0].word} = ${v.words[0].code}**\n**${v.words[1].word} = ${v.words[1].code}**\n\n5 letters means 5 pairs — but the method is exactly the same! If you can do 4, you can definitely do 5. Let's go!`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "5 letters — stay organised!",
            body: (v) => `From **${v.words[0].word} = ${v.words[0].code}**, we need 5 pairs to decode **${v.testWord}**. With 5 letters, it's even more important to write out your full table. Don't skip any pairs!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Map all 5: ${Object.entries(v.mapping).map(([l, n]) => `${l}=${n}`).join(", ")}`, why: "Write every single pair" },
                  { text: `Check with second word: ${v.words[1].word}=${v.words[1].code}`, why: "All 5 should match — if not, fix your table" },
                  { text: `Decode: ${v.testWord} = ${v.testCode}`, why: "Replace letter by letter, left to right ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — 5-letter challenge!",
            body: (v) => `**${v.words[0].word} = ${v.words[0].code}**\n**${v.words[1].word} = ${v.words[1].code}**\n\nWhat is the code for **${v.testWord}**?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the code for ${v.testWord}?`,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.correctAnswer}. ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "5-letter codes — you've conquered them!",
            body: () => `These are the toughest codes you'll see, and you now know exactly how to beat them:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Write ALL 5 pairs in your table", why: "Don't try to remember them — write them down!" },
                  { text: "2. Use the second word to double-check", why: "If one pair doesn't match, fix it immediately" },
                  { text: "3. Decode left to right, one letter at a time", why: "No shortcuts — patience wins ✓" }
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
  // SUB-CONCEPT 7: Anagram Codes
  // Category: other
  // ==========================================
  {
    id: "anagram-codes",
    name: "Anagram Codes — Same Letters, Different Order",
    category: "other",
    lessons: [
      {
        id: "anagram-codes-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How anagram words (same letters, different order) always use the same digits reshuffled",
          "Why spotting anagrams is one of the fastest shortcuts in code-cracking"
        ],
        variableSets: [
          {
            // STOP=4826 S=4,T=8,O=2,P=6. TOPS=8264 (anagram — same digits rearranged).
            // POTS: P(6)O(2)T(8)S(4)=6284. SPOT: S(4)P(6)O(2)T(8)=4628.
            // Target: POST = P(6)O(2)S(4)T(8) = 6248
            name: "Daisy",
            scenario: "spotting anagram patterns in codes",
            words: [
              { word: "STOP", code: "4826" },
              { word: "TOPS", code: "8264" }
            ],
            mapping: { S: 4, T: 8, O: 2, P: 6 },
            anagramWord: "POTS",
            anagramCode: "6284",
            testWord: "POST",
            testCode: "6248",
            options: ["6248", "6284", "6428", "6842", "6482"],
            correctAnswer: "6248",
            explanation: "STOP, TOPS, POTS, POST — all anagrams using S=4, T=8, O=2, P=6. They all use the same digits (2,4,6,8) in different orders. POST = P(6) O(2) S(4) T(8) = 6248. ✓"
          },
          {
            // MEAL=6925 M=6,E=9,A=2,L=5. LAME=5269 (anagram).
            // Target: MALE = M(6)A(2)L(5)E(9) = 6259
            name: "Oliver",
            scenario: "noticing that anagram words shuffle the same digits",
            words: [
              { word: "MEAL", code: "6925" },
              { word: "LAME", code: "5269" }
            ],
            mapping: { M: 6, E: 9, A: 2, L: 5 },
            anagramWord: "LAME",
            anagramCode: "5269",
            testWord: "MALE",
            testCode: "6259",
            options: ["6259", "6295", "6529", "6952", "6592"],
            correctAnswer: "6259",
            explanation: "MEAL and LAME are anagrams — same letters M, E, A, L with digits 6, 9, 2, 5 rearranged. MALE = M(6) A(2) L(5) E(9) = 6259. ✓"
          },
          {
            // LATE=5289 L=5,A=2,T=8,E=9. TALE=8259 (anagram).
            // Target: TEAL = T(8)E(9)A(2)L(5) = 8925
            name: "Priya",
            scenario: "using anagram patterns as a shortcut",
            words: [
              { word: "LATE", code: "5289" },
              { word: "TALE", code: "8259" }
            ],
            mapping: { L: 5, A: 2, T: 8, E: 9 },
            anagramWord: "TALE",
            anagramCode: "8259",
            testWord: "TEAL",
            testCode: "8925",
            options: ["8925", "8952", "8295", "8592", "8259"],
            correctAnswer: "8925",
            explanation: "LATE, TALE, TEAL — all anagrams with L=5, A=2, T=8, E=9. Same four digits (2,5,8,9) rearranged. TEAL = T(8) E(9) A(2) L(5) = 8925. ✓"
          },
          {
            // LION=5241 L=5,I=2,O=4,N=1. LOIN=5421 (anagram).
            // Target: LINO = L(5)I(2)N(1)O(4) = 5214
            name: "Finn",
            scenario: "recognising anagram codes in his practice",
            words: [
              { word: "LION", code: "5241" },
              { word: "LOIN", code: "5421" }
            ],
            mapping: { L: 5, I: 2, O: 4, N: 1 },
            anagramWord: "LOIN",
            anagramCode: "5421",
            testWord: "LINO",
            testCode: "5214",
            options: ["5214", "5241", "5142", "5412", "5124"],
            correctAnswer: "5214",
            explanation: "LION, LOIN, LINO — all anagrams with L=5, I=2, O=4, N=1. Same digits rearranged. LINO = L(5) I(2) N(1) O(4) = 5214. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Same letters, same digits — cool, right?",
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.words[0].word} = ${v.words[0].code}**\n**${v.words[1].word} = ${v.words[1].code}**\n\n**Did you know?** These words are **anagrams** — they use the **same letters** shuffled into a different order. And here's the brilliant part: their codes use the **same digits** shuffled too!`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Anagram shortcut",
            body: (v) => `**${v.words[0].word}** and **${v.words[1].word}** are anagrams (words made from the same letters in a different order) — and their codes use the **same digits rearranged**. This means you only need ONE mapping table for ALL the anagrams!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Build the table from ${v.words[0].word}: ${Object.entries(v.mapping).map(([l, n]) => `${l}=${n}`).join(", ")}`, why: "One table works for all the anagrams" },
                  { text: `${v.words[1].word} uses the same digits: ${v.words[1].code}`, why: "Same letters → same digits, just shuffled" },
                  { text: `${v.testWord} = ${v.testCode}`, why: "Apply the same table to any anagram ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — decode the anagram!",
            body: (v) => `**${v.words[0].word} = ${v.words[0].code}**\n**${v.words[1].word} = ${v.words[1].code}**\n\nWhat is the code for **${v.testWord}**?\n\n(Hint: it uses the same digits as the other words!)`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the code for ${v.testWord}?`,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.correctAnswer}. ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Anagram codes — a brilliant shortcut!",
            body: () => `Remember this trick and you'll save loads of time in the exam:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Same letters → same digits", why: "STOP/TOPS/POTS/POST all use 2, 4, 6, 8" },
                  { text: "Different order → different arrangement", why: "The digits rearrange just like the letters do" },
                  { text: "One table decodes ALL the anagrams", why: "Build it once, use it for every version ✓" }
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
  // SUB-CONCEPT 8: Elimination Method
  // Category: other
  // ==========================================
  {
    id: "elimination-method",
    name: "Elimination — Narrow It Down",
    category: "other",
    lessons: [
      {
        id: "elimination-method-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to use elimination to find the right answer when all the options look similar",
          "How to knock out wrong answers one by one like a detective"
        ],
        variableSets: [
          {
            // PART=6238 P=6,A=2,R=3,T=8. Target: TRAP=8326
            // Distractors are close: 8326, 8362, 8236, 8632, 3826
            name: "Daisy",
            scenario: "using elimination to find the right answer",
            words: [
              { word: "PART", code: "6238" }
            ],
            mapping: { P: 6, A: 2, R: 3, T: 8 },
            testWord: "TRAP",
            testCode: "8326",
            options: ["8326", "8362", "8236", "8632", "3826"],
            correctAnswer: "8326",
            eliminationSteps: [
              "T=8, so the code MUST start with 8 → eliminates 3826",
              "R=3, so the second digit MUST be 3 → eliminates 8236 and 8632",
              "A=2, P=6, so it ends in 26 → eliminates 8362",
              "TRAP = 8326 ✓"
            ],
            explanation: "P=6, A=2, R=3, T=8. TRAP starts with T→8, then R→3, then A→2, then P→6. So TRAP = 8326. Check each position to eliminate wrong answers! ✓"
          },
          {
            // CAST=1238 C=1,A=2,S=3,T=8. Target: SCAT=3128
            name: "Oliver",
            scenario: "narrowing down the options one by one",
            words: [
              { word: "CAST", code: "1238" }
            ],
            mapping: { C: 1, A: 2, S: 3, T: 8 },
            testWord: "SCAT",
            testCode: "3128",
            options: ["3128", "3182", "3218", "1328", "3812"],
            correctAnswer: "3128",
            eliminationSteps: [
              "S=3, so the code MUST start with 3 → eliminates 1328",
              "C=1, so the second digit MUST be 1 → eliminates 3218 and 3812",
              "A=2, T=8, so it ends in 28 → eliminates 3182",
              "SCAT = 3128 ✓"
            ],
            explanation: "C=1, A=2, S=3, T=8. SCAT = S(3) C(1) A(2) T(8) = 3128. Eliminate options that have the wrong digit in any position! ✓"
          },
          {
            // DIET=5928 D=5,I=9,E=2,T=8. Target: TIED=8925
            // Reverse decode: what word is 8925?
            name: "Priya",
            scenario: "eliminating impossible answers in a reverse-decode question",
            words: [
              { word: "DIET", code: "5928" }
            ],
            mapping: { D: 5, I: 9, E: 2, T: 8 },
            testWord: "TIED",
            testCode: "8925",
            options: ["TIED", "TIDE", "EDIT", "DITE", "TDIE"],
            correctAnswer: "TIED",
            eliminationSteps: [
              "8→T, so the word starts with T → eliminates EDIT and DITE",
              "9→I, so the second letter is I → eliminates TIDE and TDIE",
              "2→E, 5→D: word ends E, D → TIED ✓"
            ],
            explanation: "D=5, I=9, E=2, T=8. Reverse: 8=T, 9=I, 2=E, 5=D. So 8925 = TIED. Eliminate words that don't start with T or have I second! ✓"
          },
          {
            // PINS=6281 P=6,I=2,N=8,S=1. Target: SNIP=1826
            // What word is 1826?
            name: "Finn",
            scenario: "ruling out wrong answers step by step",
            words: [
              { word: "PINS", code: "6281" }
            ],
            mapping: { P: 6, I: 2, N: 8, S: 1 },
            testWord: "SNIP",
            testCode: "1826",
            options: ["SNIP", "NIPS", "SPIN", "PSIN", "INSP"],
            correctAnswer: "SNIP",
            eliminationSteps: [
              "1→S, so the word starts with S → eliminates NIPS, PSIN, INSP",
              "8→N, so the second letter is N → eliminates SPIN",
              "2→I, 6→P: word ends I, P → SNIP ✓"
            ],
            explanation: "P=6, I=2, N=8, S=1. Reverse: 1=S, 8=N, 2=I, 6=P. So 1826 = SNIP. Start from the first digit and eliminate! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Too many options? Time to eliminate!",
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.words[0].word} = ${v.words[0].code}**\n\nWhat is the code for **${v.testWord}**?\n\nOptions: ${v.options.map(o => `**${o}**`).join('  |  ')}\n\nThey all look really similar! But don't panic — there's a smart way to do this. Instead of guessing, **cross out** the wrong ones step by step.`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Check one position at a time",
            body: (v) => `From **${v.words[0].word} = ${v.words[0].code}**, we need to find **${v.testWord}**.\n\nOptions: ${v.options.map(o => `**${o}**`).join('  |  ')}\n\nLook at each position. If an option has the **wrong digit** in ANY position, cross it out!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.eliminationSteps.map((step, i) => ({
                  text: step,
                  why: i === v.eliminationSteps.length - 1 ? "Last one standing!" : "Cross it out!"
                })),
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Check first position", right: "Eliminate options with wrong first digit" },
                { left: "Check second position", right: "Eliminate options with wrong second digit" },
                { left: "Check remaining positions", right: "The last option standing is the answer" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn — eliminate!",
            body: (v) => `**${v.words[0].word} = ${v.words[0].code}**\n\nWhat is the correct answer for **${v.testWord}**?\n\nUse elimination — check each position!`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the correct code/word for ${v.testWord}?`,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.correctAnswer}. ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Elimination — your safety net!",
            body: () => `When answers look similar, elimination has your back:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Check the FIRST digit/letter", why: "This alone often eliminates 2-3 options" },
                  { text: "2. Check the SECOND digit/letter", why: "Usually narrows it to 1-2 options" },
                  { text: "3. Verify the full code matches", why: "The last one standing is your answer ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "elimination-method-practice",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to stay cool and use elimination even on the trickiest code questions",
          "Why you should never panic when answers look almost identical"
        ],
        variableSets: [
          {
            // GUST=8694 G=8,U=6,S=9,T=4. Target: GUTS=8649
            name: "Evie",
            scenario: "facing five very similar-looking options",
            words: [
              { word: "GUST", code: "8694" }
            ],
            mapping: { G: 8, U: 6, S: 9, T: 4 },
            testWord: "GUTS",
            testCode: "8649",
            options: ["8649", "8694", "8469", "8496", "8946"],
            correctAnswer: "8649",
            eliminationSteps: [
              "All start with 8 (G=8) — so check the second digit",
              "U=6, so second digit is 6 → eliminates 8469, 8496, 8946",
              "T=4, S=9: ends in 49 → eliminates 8694 (that's GUST again!)",
              "GUTS = 8649 ✓"
            ],
            explanation: "G=8, U=6, S=9, T=4. GUTS = G(8) U(6) T(4) S(9) = 8649. Watch out — 8694 is GUST, not GUTS! ✓"
          },
          {
            // BOLT=1352 B=1,O=3,L=5,T=2. Target: BLOT=1532
            name: "Marcus",
            scenario: "working through options that all start the same",
            words: [
              { word: "BOLT", code: "1352" }
            ],
            mapping: { B: 1, O: 3, L: 5, T: 2 },
            testWord: "BLOT",
            testCode: "1532",
            options: ["1532", "1523", "1352", "1253", "1325"],
            correctAnswer: "1532",
            eliminationSteps: [
              "B=1, all start with 1 — check second digit",
              "L=5, so second digit is 5 → eliminates 1352 (BOLT!), 1253, 1325",
              "O=3, T=2: ends in 32 → eliminates 1523",
              "BLOT = 1532 ✓"
            ],
            explanation: "B=1, O=3, L=5, T=2. BLOT = B(1) L(5) O(3) T(2) = 1532. Don't confuse BLOT with BOLT (1352)! ✓"
          },
          {
            // WAND=3215 W=3,A=2,N=1,D=5. Target: DAWN=5231
            name: "Aisha",
            scenario: "eliminating close-looking options",
            words: [
              { word: "WAND", code: "3215" }
            ],
            mapping: { W: 3, A: 2, N: 1, D: 5 },
            testWord: "DAWN",
            testCode: "5231",
            options: ["5231", "5213", "5321", "5132", "5123"],
            correctAnswer: "5231",
            eliminationSteps: [
              "D=5, all start with 5 — check second digit",
              "A=2, so second digit is 2 → eliminates 5321, 5132, 5123",
              "W=3, N=1: ends in 31 → eliminates 5213",
              "DAWN = 5231 ✓"
            ],
            explanation: "W=3, A=2, N=1, D=5. DAWN = D(5) A(2) W(3) N(1) = 5231. Check digit by digit to find the right one! ✓"
          },
          {
            // ROAD=3125 R=3,O=1,A=2,D=5. Target: DORA=5132
            name: "Charlie",
            scenario: "using elimination on a reverse-order puzzle",
            words: [
              { word: "ROAD", code: "3125" }
            ],
            mapping: { R: 3, O: 1, A: 2, D: 5 },
            testWord: "DORA",
            testCode: "5132",
            options: ["5132", "5312", "5213", "5321", "5123"],
            correctAnswer: "5132",
            eliminationSteps: [
              "D=5, all start with 5 — check second digit",
              "O=1, so second digit is 1 → eliminates 5312, 5213, 5321",
              "R=3, A=2: ends in 32 → eliminates 5123",
              "DORA = 5132 ✓"
            ],
            explanation: "R=3, O=1, A=2, D=5. DORA = D(5) O(1) R(3) A(2) = 5132. Elimination works even when options are very close! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `They all look so similar... but you can do this!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.words[0].word} = ${v.words[0].code}**\n\nWhat is the code for **${v.testWord}**?\n\nOptions: ${v.options.map(o => `**${o}**`).join('  |  ')}\n\nThey look nearly identical, but stay calm! Check **one position at a time** and the wrong ones will fall away.`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Position by position",
            body: (v) => `From **${v.words[0].word} = ${v.words[0].code}**, we need to decode **${v.testWord}**.\n\nOptions: ${v.options.map(o => `**${o}**`).join('  |  ')}\n\nWhen options look nearly identical, go through **position by position**. Each check eliminates more wrong answers!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.eliminationSteps.map((step, i) => ({
                  text: step,
                  why: i === v.eliminationSteps.length - 1 ? "Found it!" : "Eliminate!"
                })),
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — eliminate step by step!",
            body: (v) => `**${v.words[0].word} = ${v.words[0].code}**\n\nWhat is the code for **${v.testWord}**?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the code for ${v.testWord}?`,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.correctAnswer}. ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Smart coders don't guess — they eliminate!",
            body: () => `When options look nearly the same, here's your winning strategy:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Check position 1 across all options", why: "Usually the same — move to position 2" },
                  { text: "2. Check position 2 — this often eliminates half", why: "One wrong digit = one wrong answer" },
                  { text: "3. Keep going until only ONE option fits", why: "Systematic elimination beats guessing every time ✓" }
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
  // SUB-CONCEPT: Code Deduction (Decode + Cross-Reference)
  // Fills GL gap V5: decode direction with two-clue cross-referencing
  // ==========================================
  {
    id: "code-deduction",
    name: "Code Deduction — Decode the Message",
    category: "other",
    lessons: [
      {
        id: "code-deduction-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to decode a mystery number back into a word using the clue you have been given",
          "How to cross-reference two clue words when a shared letter unlocks the whole puzzle"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "decoding a mystery number with one clue word",
            words: [{ word: "CAT", code: "123" }],
            mapping: { C: 1, A: 2, T: 3 },
            testCode: "213",
            testWord: "ACT",
            options: ["CAT", "TAC", "ACT", "ATC", "CTA"],
            correctAnswer: "ACT",
            explanation: "From CAT = 123: C=1, A=2, T=3. Flip it: 2=A, 1=C, 3=T. So 213 = A, C, T = ACT. ✓",
            clueWords: [
              { word: "TRAIN", code: "13524" },
              { word: "CORK", code: "6738" }
            ],
            clueMapping: { T: 1, R: 3, A: 5, I: 2, N: 4, C: 6, O: 7, K: 8 },
            sharedLetter: "R",
            sharedNumber: 3,
            targetWord: "CART",
            targetCode: "6531",
            interactWords: [{ word: "DOG", code: "456" }],
            interactMapping: { D: 4, O: 5, G: 6 },
            interactTestCode: "654",
            interactTestWord: "GOD",
            interactOptions: ["GOD", "DOG", "OGD", "DGO", "GDO"],
            interactCorrectAnswer: "GOD",
            interactExplanation: "From DOG = 456: D=4, O=5, G=6. Flip it: 6=G, 5=O, 4=D. So 654 = G, O, D = GOD. ✓"
          },
          {
            name: "Noah",
            scenario: "flipping a code back into a hidden word",
            words: [{ word: "PIN", code: "472" }],
            mapping: { P: 4, I: 7, N: 2 },
            testCode: "274",
            testWord: "NIP",
            options: ["NIP", "PIN", "PNI", "INP", "NPI"],
            correctAnswer: "NIP",
            explanation: "From PIN = 472: P=4, I=7, N=2. Flip it: 2=N, 7=I, 4=P. So 274 = N, I, P = NIP. ✓",
            clueWords: [
              { word: "SHARP", code: "12345" },
              { word: "CORK", code: "6748" }
            ],
            clueMapping: { S: 1, H: 2, A: 3, R: 4, P: 5, C: 6, O: 7, K: 8 },
            sharedLetter: "R",
            sharedNumber: 4,
            targetWord: "CRASH",
            targetCode: "64312",
            interactWords: [{ word: "BAT", code: "385" }],
            interactMapping: { B: 3, A: 8, T: 5 },
            interactTestCode: "583",
            interactTestWord: "TAB",
            interactOptions: ["TAB", "BAT", "ATB", "BTA", "TBA"],
            interactCorrectAnswer: "TAB",
            interactExplanation: "From BAT = 385: B=3, A=8, T=5. Flip it: 5=T, 8=A, 3=B. So 583 = T, A, B = TAB. ✓"
          },
          {
            name: "Priya",
            scenario: "uncovering a word from its number disguise",
            words: [{ word: "RAT", code: "519" }],
            mapping: { R: 5, A: 1, T: 9 },
            testCode: "159",
            testWord: "ART",
            options: ["ART", "RAT", "TAR", "ATR", "RTA"],
            correctAnswer: "ART",
            explanation: "From RAT = 519: R=5, A=1, T=9. Flip it: 1=A, 5=R, 9=T. So 159 = A, R, T = ART. ✓",
            clueWords: [
              { word: "PLANT", code: "21345" },
              { word: "CAT", code: "635" }
            ],
            clueMapping: { P: 2, L: 1, A: 3, N: 4, T: 5, C: 6 },
            sharedLetter: "A",
            sharedNumber: 3,
            targetWord: "CLAP",
            targetCode: "6132",
            interactWords: [{ word: "TAP", code: "825" }],
            interactMapping: { T: 8, A: 2, P: 5 },
            interactTestCode: "258",
            interactTestWord: "APT",
            interactOptions: ["APT", "TAP", "PAT", "ATP", "PTA"],
            interactCorrectAnswer: "APT",
            interactExplanation: "From TAP = 825: T=8, A=2, P=5. Flip it: 2=A, 5=P, 8=T. So 258 = A, P, T = APT. ✓"
          },
          {
            name: "Finn",
            scenario: "swapping numbers back into letters to reveal the word",
            words: [{ word: "BUS", code: "394" }],
            mapping: { B: 3, U: 9, S: 4 },
            testCode: "493",
            testWord: "SUB",
            options: ["SUB", "BUS", "USB", "BSU", "SBU"],
            correctAnswer: "SUB",
            explanation: "From BUS = 394: B=3, U=9, S=4. Flip it: 4=S, 9=U, 3=B. So 493 = S, U, B = SUB. ✓",
            clueWords: [
              { word: "BRAIN", code: "14253" },
              { word: "CORK", code: "6748" }
            ],
            clueMapping: { B: 1, R: 4, A: 2, I: 5, N: 3, C: 6, O: 7, K: 8 },
            sharedLetter: "R",
            sharedNumber: 4,
            targetWord: "BACK",
            targetCode: "1268",
            interactWords: [{ word: "POT", code: "718" }],
            interactMapping: { P: 7, O: 1, T: 8 },
            interactTestCode: "817",
            interactTestWord: "TOP",
            interactOptions: ["TOP", "POT", "OPT", "TPO", "OTP"],
            interactCorrectAnswer: "TOP",
            interactExplanation: "From POT = 718: P=7, O=1, T=8. Flip it: 8=T, 1=O, 7=P. So 817 = T, O, P = TOP. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Time to decode a hidden word!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nThe clue word is:\n\n**${v.words[0].word} = ${v.words[0].code}**\n\nNow the puzzle flips around: what word does **${v.testCode}** stand for?\n\nYou have cracked codes before — this time you are going the **other way**. The numbers are the disguise, and your job is to **unmask** the word hiding underneath!`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.words.map(w => ({ cells: [w.word, w.code] })),
                  { cells: ["???", v.testCode], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "One clue word? Build, flip, read.",
            body: (v) => `Start with one clue: **${v.words[0].word} = ${v.words[0].code}**.\n\nBuild your table, then **flip** it so each number points back to its letter. Now read **${v.testCode}** one digit at a time — that is your word!\n\nWhen a question gives you **two clue words**, look for the letter that appears in both. If you see **${v.sharedLetter}** in both clues, it must be **${v.sharedNumber}** in both — a built-in safety check!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Build from ${v.words[0].word} = ${v.words[0].code}: ${Object.entries(v.mapping).map(([l, n]) => `${l}=${n}`).join(", ")}`, why: "Line each letter up with its digit" },
                  { text: `Flip it: ${Object.entries(v.mapping).map(([l, n]) => `${n}=${l}`).join(", ")}`, why: "Now numbers point back to letters" },
                  { text: `Read ${v.testCode} digit by digit → ${v.testWord}`, why: "One digit at a time, in order" },
                  { text: `Two-clue check: ${v.clueWords[0].word}=${v.clueWords[0].code} and ${v.clueWords[1].word}=${v.clueWords[1].code}`, why: `${v.sharedLetter} appears in both — and it is ${v.sharedNumber} each time. Consistency check!` },
                  { text: `Find ${v.targetWord}: pull each letter from whichever clue contains it → ${v.targetCode}`, why: "Cross-reference both tables for the letters you need ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Build the letter-to-number table from the clue word`,
                `Flip the table so each number points back to its letter`,
                `Read the mystery code one digit at a time to spell the word`
              ],
              feedback: {
                correct: (v) => `Spot on! Build, flip, read — that is how you decode. ✓`,
                incorrect: (v) => `Not quite — build the table first, then flip it, then read off the letters!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn — unmask the word!",
            body: (v) => `**${v.interactWords[0].word} = ${v.interactWords[0].code}**\n\nWhat word does **${v.interactTestCode}** stand for?\n\nBuild your table, flip it, then read off each digit.`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Word", "Code"],
                rows: [
                  ...v.interactWords.map(w => ({ cells: [w.word, w.code] })),
                  { cells: ["???", v.interactTestCode], highlight: true }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What word does ${v.interactTestCode} stand for?`,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Code deduction — you have cracked it!",
            body: () => `Whether you have got **one clue word** or **two**, the recipe is always the same:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Build the letter-to-number table from every clue you have", why: "Two clues? Build both tables side by side" },
                  { text: "2. Flip it — numbers point back to letters", why: "This is the move that turns a code back into a word" },
                  { text: "3. If two clues share a letter, check the numbers match", why: "A shared letter must have the same number in both — your safety net!" },
                  { text: "4. Read the mystery code one digit at a time", why: "Spell the word out, letter by letter ✓" }
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

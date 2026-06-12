// ============================================================
// Supplementary sub-concepts for Balance Equations (Verbal Reasoning)
// To merge: add these to lessonBank.balanceEquations.subConcepts array in lessonData.js
// Format: A + ? = B − C  /  find the missing number using equation balancing
// GL frequency: ~12 per 37-test CGP run (4-Q sections in 7+ tests)
// ============================================================

export const balanceEquationsSubConcepts = [

{
    id: "balance-equations",
    name: "Balance Equations",
    category: "core",
    lessons: [
      {
        id: "balance-equations-steps",
        templateType: "step-by-step",
        // Screens take no variables (worked examples are written inline),
        // but selectLesson expects a variableSets array — one empty set.
        variableSets: [{}],
        learningGoal: [
          "How to solve 'find the missing number' equations where both sides must balance",
          "How to use BODMAS on the left side first, then back-solve to find the missing number"
        ],
        screens: [
          {
            type: "hook",
            title: () => "Make both sides match!",
            body: () => "Imagine a seesaw. Whatever's on the left side has to **weigh the same** as whatever's on the right — otherwise it tips!\n\nIn these questions, the brackets **( )** hide a missing number. Your job is to work out what goes inside so both sides are equal.\n\nLet's try one together:\n\n**15 + 4 = 29 − ( )**\n\nLeft side: 15 + 4 = **19**\nRight side: 29 − ( ) must also equal **19**\nSo ( ) = 29 − 19 = **10**\n\nBoth sides now weigh 19. Balanced!",
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "The 3-step method",
            body: () => "Use this recipe every single time. Take the equation **30 ÷ 5 + 12 = 2 × ( )**.\n\n**Step 1 — Work out the left side.**\nUse BODMAS (do × and ÷ before + and −).\n30 ÷ 5 = 6, then 6 + 12 = **18**.\n\n**Step 2 — Rewrite the equation.**\nThe left side is just a number now: **18 = 2 × ( )**.\n\n**Step 3 — Back-solve.**\nAsk: 'what times 2 makes 18?' That's **9**. So ( ) = **9**.\n\nThe key: **shrink the left side to a single number first** — then the right side becomes a simple puzzle.",
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: () => "**Solve the equation:**\n\n**8 + 4 = 6 × ( )**\n\nRemember:\n1. Work out the left side\n2. Rewrite as 'number = 6 × ( )'\n3. Ask 'what times 6 makes that number?'",
            visual: null,
            interaction: {
              type: "multiple-choice",
              getOptions: () => ["1", "2", "3", "4", "12"],
              correctAnswer: () => "2",
              feedback: {
                correct: () => "Brilliant! Left side: 8 + 4 = 12. So 12 = 6 × ( ). Six twos are twelve, so ( ) = 2. Both sides balance at 12. ✓",
                incorrect: () => "Not quite. Left side first: 8 + 4 = 12. Now the equation reads 12 = 6 × ( ). What times 6 makes 12? That's 2, so ( ) = 2. ✓"
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Your balancing recipe",
            body: () => "Every balance equation cracks the same way:\n\n**1. Shrink the left side** to a single number (use BODMAS — × and ÷ before + and −).\n\n**2. Rewrite** with that number on the left.\n\n**3. Back-solve the right side** — ask 'what makes this true?'\n\n**Watch out:** BODMAS catches people out! In **20 − 2 × 7**, do the multiply first (2 × 7 = 14), then subtract (20 − 14 = 6). Not left-to-right.\n\nGet the left side right first, and the rest is easy. ✓",
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

];

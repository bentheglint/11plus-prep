// === STAGING IMPORTS FOR TESTING SUB-LAYER ===
// Maths (15)
import { algebraSubConcepts } from './staging/algebra-subconcepts';
import { anglesshapesSubConcepts } from './staging/anglesshapes-subconcepts';
import { areaperimeterSubConcepts } from './staging/areaperimeter-subconcepts';
import { datahandlingSubConcepts } from './staging/datahandling-subconcepts';
import { decimalsSubConcepts } from './staging/decimals-subconcepts';
import { fractionsSubConcepts } from './staging/fractions-subconcepts';
import { longdivisionSubConcepts } from './staging/longdivision-subconcepts';
import { negativeNumbersSubConcepts } from './staging/negativenumbers-subconcepts';
import { percentagesSubConcepts } from './staging/percentages-subconcepts';
import { placevalueSubConcepts } from './staging/placevalue-subconcepts';
import { primenumbersfactorsSubConcepts } from './staging/primenumbersfactors-subconcepts';
import { ratioSubConcepts } from './staging/ratio-subconcepts';
import { sequencesSubConcepts } from './staging/sequences-subconcepts';
import { speeddistancetimeSubConcepts } from './staging/speeddistancetime-subconcepts';
import { volumeSubConcepts } from './staging/volume-subconcepts';
// English (6)
import { spellingSubConcepts } from './staging/spelling-subconcepts';
import { punctuationSubConcepts } from './staging/punctuation-subconcepts';
import { grammarSubConcepts } from './staging/grammar-subconcepts';
import { vocabularySubConcepts } from './staging/vocabulary-subconcepts';
import { wordClassSubConcepts } from './staging/wordclass-subconcepts';
import { comprehensionSubConcepts } from './staging/comprehension-subconcepts';
// VR (16)
import { synonymsSubConcepts } from './staging/synonyms-subconcepts';
import { antonymsSubConcepts } from './staging/antonyms-subconcepts';
import { oddTwoOutSubConcepts } from './staging/oddtwoout-subconcepts';
import { verbalAnalogiesSubConcepts } from './staging/verbalanalogies-subconcepts';
import { compoundWordsSubConcepts } from './staging/compoundwords-subconcepts';
import { hiddenWordsSubConcepts } from './staging/hiddenwords-subconcepts';
import { letterMoveSubConcepts } from './staging/lettermove-subconcepts';
import { missingLettersWordsSubConcepts } from './staging/missingletterswords-subconcepts';
import { sharedLetterSubConcepts } from './staging/sharedletter-subconcepts';
import { letterCodesSubConcepts } from './staging/lettercodes-subconcepts';
import { letterPairSeriesSubConcepts } from './staging/letterpairseries-subconcepts';
import { wordCodeAnalogiesSubConcepts } from './staging/wordcodeanalogies-subconcepts';
import { numberWordCodesSubConcepts } from './staging/numberwordcodes-subconcepts';
import { numberSeriesSubConcepts } from './staging/numberseries-subconcepts';
import { letterSumsSubConcepts } from './staging/letterSums-subconcepts';
import { logicAndLanguageSubConcepts } from './staging/logicandlanguage-subconcepts';

// ============================================================
// Micro-Lesson Data — Long Multiplication (Phase 1)
// ============================================================
// Each topic has sub-concepts, each with multiple lesson templates
// and variable pools for infinite variety.

// ---- Helper: generate plausible wrong answers near the correct one ----
export function generateDistractors(correct, count = 4) {
  const options = new Set([correct]);
  const absVal = Math.abs(correct);
  const isSmallDecimal = absVal > 0 && absVal < 1;
  const isSmall = absVal <= 10;

  // For negative answers, include the sign-flip as a common mistake
  if (correct < 0) {
    options.add(-correct);
  }

  // Scale offsets to answer magnitude
  const offsets = isSmallDecimal
    ? [-0.3, -0.25, -0.2, -0.15, -0.1, -0.05, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3]
    : isSmall
      ? [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]
      : [-50, -30, -20, -12, -10, -8, -5, -2, 2, 5, 8, 10, 12, 20, 30, 50];
  const shuffled = offsets.sort(() => Math.random() - 0.5);

  for (const offset of shuffled) {
    if (options.size >= count) break;
    const raw = correct + offset;
    const d = isSmallDecimal ? Math.round(raw * 100) / 100 : Math.round(raw);
    if (correct <= 0 ? d !== correct : d > 0) options.add(d);
  }

  // Fallback for remaining slots
  const range = isSmallDecimal ? 0.5 : isSmall ? 6 : 60;
  while (options.size < count) {
    const raw = correct + (Math.random() * range * 2) - range;
    const d = isSmallDecimal ? Math.round(raw * 100) / 100 : Math.round(raw);
    if (correct <= 0 ? d !== correct : d > 0) options.add(d);
  }

  return [...options].sort(() => Math.random() - 0.5);
}

// ---- Helper: spell out small numbers as words (for child-friendly text) ----
function toWord(n) {
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  return words[n] !== undefined ? words[n] : String(n);
}

// ---- Helper: generate plausible wrong answers for division (supports "N remainder R" strings) ----
export function generateDivisionDistractors(quotient, remainder, count = 4) {
  if (remainder === 0 || remainder === undefined) {
    return generateDistractors(quotient, count);
  }
  const correct = `${quotient} remainder ${remainder}`;
  const options = new Set([correct]);
  const qOffsets = [-3, -2, -1, 1, 2, 3];
  const rOffsets = [-2, -1, 1, 2];
  const shuffledQ = qOffsets.sort(() => Math.random() - 0.5);
  const shuffledR = rOffsets.sort(() => Math.random() - 0.5);
  for (const off of shuffledQ) {
    if (options.size >= count) break;
    const q = quotient + off;
    if (q > 0) options.add(`${q} remainder ${remainder}`);
  }
  for (const off of shuffledR) {
    if (options.size >= count) break;
    const r = remainder + off;
    if (r > 0 && r < 10) options.add(`${quotient} remainder ${r}`);
  }
  while (options.size < count) {
    const q = quotient + Math.floor(Math.random() * 6) - 3;
    const r = Math.floor(Math.random() * 5) + 1;
    if (q > 0 && `${q} remainder ${r}` !== correct) {
      options.add(`${q} remainder ${r}`);
    }
  }
  return [...options].sort(() => Math.random() - 0.5);
}

// ---- Helper: create variable set for master method from core numbers ----
function createMasterVarSet({ name, scenario, numA, numB, unit, estimateA, estimateB, difficulty }) {
  const numAOnes = numA % 10;
  const numATens = Math.floor((numA % 100) / 10);
  const numAHundreds = Math.floor(numA / 100);
  const is3Digit = numA >= 100;
  const numBOnes = numB % 10;
  const numBTens = Math.floor(numB / 10);
  const partial1 = numA * numBOnes;
  const partial2 = numA * numBTens * 10;
  const product = numA * numB;

  // Ones row: carry from ones-digit multiplication
  const onesFirstProduct = numBOnes * numAOnes;
  const onesCarryDigit = Math.floor(onesFirstProduct / 10);
  const carry1 = onesCarryDigit > 0 ? [{ col: 1, digit: onesCarryDigit }] : [];

  // Tens row: carry from tens-digit multiplication
  const tensFirstProduct = numBTens * numAOnes;
  const tensCarryDigit = Math.floor(tensFirstProduct / 10);
  const carry2 = tensCarryDigit > 0 ? [{ col: 2, digit: tensCarryDigit }] : [];

  return {
    name, scenario, numA, numB, unit,
    numAOnes, numATens, numAHundreds, is3Digit,
    numBOnes, numBTens,
    partial1, partial2, product,
    carry1, carry2,
    estimateA, estimateB,
    estimateProduct: estimateA * estimateB,
    ...(difficulty ? { difficulty } : {})
  };
}


// ---- The lesson bank ----
export const lessonBank = {
  longmultiplication: {
    name: "Long Multiplication",
    subConcepts: [
      // ==========================================
      // MASTER METHOD: The Column Method (shown ~75% of the time)
      // ==========================================
      {
        id: "master-column-method",
        name: "The Column Method — Step by Step",
        category: "master",
        lessons: [
          {
            id: "master-column-full",
            templateType: "master-method",
            learningGoal: [
              "The standard column method for multiplying two numbers",
              "How to multiply by the ones digit (with carrying)",
              "How to multiply by the tens digit (with the placeholder zero)",
              "How to add the two rows to get the final answer"
            ],
            variableSets: [
              { name: "A bakery", scenario: "orders trays of cupcakes for a village fête", numA: 36, numB: 24, unit: "cupcakes", estimateA: 40, estimateB: 25 },
              { name: "A school", scenario: "puts books on shelves in the library", numA: 45, numB: 23, unit: "books", estimateA: 50, estimateB: 20 },
              { name: "A football fan", scenario: "sorts stickers into an album", numA: 53, numB: 17, unit: "stickers", estimateA: 50, estimateB: 20 },
              { name: "A cinema", scenario: "sets out seats in rows for a film premiere", numA: 28, numB: 34, unit: "seats", estimateA: 30, estimateB: 30 },
              { name: "A garden centre", scenario: "arranges plant pots on shelves", numA: 47, numB: 26, unit: "plants", estimateA: 50, estimateB: 25 },
              { name: "A class", scenario: "makes Christmas cards for the whole school", numA: 63, numB: 15, unit: "cards", estimateA: 60, estimateB: 15 },
              { name: "A farm shop", scenario: "stacks egg boxes ready for market day", numA: 38, numB: 42, unit: "eggs", estimateA: 40, estimateB: 40 },
              // --- Level 3: 3-digit × 2-digit ---
              { name: "A warehouse", scenario: "packs boxes of crisps onto pallets for delivery", numA: 208, numB: 46, unit: "packets", estimateA: 200, estimateB: 50, difficulty: 2 },
              { name: "A sports stadium", scenario: "orders programmes for a cup final", numA: 326, numB: 54, unit: "programmes", estimateA: 300, estimateB: 50, difficulty: 2 },
              { name: "A school kitchen", scenario: "prepares bread rolls for the whole school for a week", numA: 157, numB: 38, unit: "rolls", estimateA: 160, estimateB: 40, difficulty: 2 }
            ].map(createMasterVarSet),
            screens: [
              // ---- Screen 1: SETUP ----
              {
                type: "hook",
                title: (v) => `Let's work out ${v.numA} × ${v.numB}!`,
                body: (v) => `${v.name} ${v.scenario}. That's **${v.numA}** groups of **${v.numB}** — so we need **${v.numA} × ${v.numB}**.\nThe **column method** works for ANY multiplication. Let's go through it step by step!`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [],
                    answer: v.product,
                    showCarrying: false
                  })
                },
                interaction: null
              },
              // ---- Screen 2: ONES ROW (diagram between every calc line) ----
              {
                type: "teach",
                title: () => "Step 1: Multiply by the ones digit",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Look at the **last digit** of ${v.numB} — it's **${v.numBOnes}**. We multiply each digit of ${v.numA} by ${v.numBOnes}, starting from the **right**.`
                  },
                  {
                    type: 'visual',
                    component: 'ColumnMethod',
                    props: (v) => ({
                      topNumber: v.numA,
                      bottomNumber: v.numB,
                      steps: [],
                      answer: v.product,
                      showCarrying: false,
                      highlightBottomDigit: 0
                    })
                  },
                  // -- First digit multiplication (ones × ones) --
                  {
                    type: 'text',
                    content: (v) => {
                      const p1 = v.numBOnes * v.numAOnes;
                      const w1 = p1 % 10;
                      const c1 = Math.floor(p1 / 10);
                      if (c1 > 0) {
                        return `**${v.numBOnes} × ${v.numAOnes} = ${p1}** → Write **${w1}**, carry **${c1}**`;
                      }
                      return `**${v.numBOnes} × ${v.numAOnes} = ${p1}** → Write **${p1}**`;
                    }
                  },
                  {
                    type: 'visual',
                    component: 'ColumnMethod',
                    props: (v) => {
                      const onesProduct = v.numBOnes * v.numAOnes;
                      const intermediatePartial = onesProduct % 10;
                      return {
                        topNumber: v.numA,
                        bottomNumber: v.numB,
                        steps: [
                          { label: `${v.numA} × ${v.numBOnes}`, partial: intermediatePartial, carrying: v.carry1 }
                        ],
                        answer: v.product,
                        showCarrying: true,
                        highlightBottomDigit: 0,
                        allRevealed: true
                      };
                    }
                  },
                  // -- Second digit multiplication (ones × tens) --
                  {
                    type: 'text',
                    content: (v) => {
                      const p1 = v.numBOnes * v.numAOnes;
                      const c1 = Math.floor(p1 / 10);
                      const p2raw = v.numBOnes * v.numATens;
                      const p2 = p2raw + c1;
                      if (c1 > 0) {
                        return `**${v.numBOnes} × ${v.numATens} = ${p2raw}**, plus carry ${c1} = **${p2}** → Write **${p2}**`;
                      }
                      return `**${v.numBOnes} × ${v.numATens} = ${p2}** → Write **${p2}**`;
                    }
                  },
                  {
                    type: 'visual',
                    component: 'ColumnMethod',
                    props: (v) => ({
                      topNumber: v.numA,
                      bottomNumber: v.numB,
                      steps: [
                        { label: `${v.numA} × ${v.numBOnes}`, partial: v.partial1, carrying: v.carry1 }
                      ],
                      answer: v.product,
                      showCarrying: true,
                      highlightBottomDigit: 0,
                      allRevealed: true
                    })
                  },
                  // -- Third digit multiplication (ones × hundreds, only for 3-digit) --
                  ...(v.is3Digit ? [
                    {
                      type: 'text',
                      content: (v) => {
                        const p1 = v.numBOnes * v.numAOnes;
                        const c1 = Math.floor(p1 / 10);
                        const p2 = v.numBOnes * v.numATens + c1;
                        const c2 = Math.floor(p2 / 10);
                        const p3raw = v.numBOnes * v.numAHundreds;
                        const p3 = p3raw + c2;
                        if (c2 > 0) {
                          return `**${v.numBOnes} × ${v.numAHundreds} = ${p3raw}**, plus carry ${c2} = **${p3}** → Write **${p3}**`;
                        }
                        return `**${v.numBOnes} × ${v.numAHundreds} = ${p3}** → Write **${p3}**`;
                      }
                    }
                  ] : []),
                  {
                    type: 'text',
                    content: (v) => `First row: **${v.partial1}** ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 3: TENS ROW (diagram between every calc line) ----
              {
                type: "teach",
                title: () => "Step 2: Multiply by the tens digit",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Now the **tens digit** of ${v.numB} — it's **${v.numBTens}** (meaning **${v.numBTens * 10}**).\n**Write a 0 first** — because we're multiplying by ${v.numBTens * 10}, not ${v.numBTens}!`
                  },
                  {
                    type: 'visual',
                    component: 'ColumnMethod',
                    props: (v) => ({
                      topNumber: v.numA,
                      bottomNumber: v.numB,
                      steps: [
                        { label: `${v.numA} × ${v.numBOnes}`, partial: v.partial1, carrying: v.carry1 },
                        { label: `${v.numA} × ${v.numBTens}0`, partial: 0, carrying: null }
                      ],
                      answer: v.product,
                      showCarrying: false,
                      highlightBottomDigit: 1,
                      allRevealed: true,
                      hideAnswer: true
                    })
                  },
                  // -- First digit multiplication (tens row) --
                  {
                    type: 'text',
                    content: (v) => {
                      const p1 = v.numBTens * v.numAOnes;
                      const w1 = p1 % 10;
                      const c1 = Math.floor(p1 / 10);
                      if (c1 > 0) {
                        return `**${v.numBTens} × ${v.numAOnes} = ${p1}** → Write **${w1}**, carry **${c1}**`;
                      }
                      return `**${v.numBTens} × ${v.numAOnes} = ${p1}** → Write **${p1}**`;
                    }
                  },
                  {
                    type: 'visual',
                    component: 'ColumnMethod',
                    props: (v) => {
                      const tensProduct = v.numBTens * v.numAOnes;
                      const intermediatePartial = (tensProduct % 10) * 10;
                      return {
                        topNumber: v.numA,
                        bottomNumber: v.numB,
                        steps: [
                          { label: `${v.numA} × ${v.numBOnes}`, partial: v.partial1, carrying: v.carry1 },
                          { label: `${v.numA} × ${v.numBTens}0`, partial: intermediatePartial, carrying: v.carry2 }
                        ],
                        answer: v.product,
                        showCarrying: true,
                        highlightBottomDigit: 1,
                        allRevealed: true,
                        hideAnswer: true
                      };
                    }
                  },
                  // -- Second digit multiplication (tens row) --
                  {
                    type: 'text',
                    content: (v) => {
                      const p1 = v.numBTens * v.numAOnes;
                      const c1 = Math.floor(p1 / 10);
                      const p2raw = v.numBTens * v.numATens;
                      const p2 = p2raw + c1;
                      if (c1 > 0) {
                        return `**${v.numBTens} × ${v.numATens} = ${p2raw}**, plus carry ${c1} = **${p2}** → Write **${p2}**`;
                      }
                      return `**${v.numBTens} × ${v.numATens} = ${p2}** → Write **${p2}**`;
                    }
                  },
                  {
                    type: 'visual',
                    component: 'ColumnMethod',
                    props: (v) => ({
                      topNumber: v.numA,
                      bottomNumber: v.numB,
                      steps: [
                        { label: `${v.numA} × ${v.numBOnes}`, partial: v.partial1, carrying: v.carry1 },
                        { label: `${v.numA} × ${v.numBTens}0`, partial: v.partial2, carrying: v.carry2 }
                      ],
                      answer: v.product,
                      showCarrying: true,
                      highlightBottomDigit: 1,
                      allRevealed: true,
                      hideAnswer: true
                    })
                  },
                  // -- Third digit multiplication (tens × hundreds, only for 3-digit) --
                  ...(v.is3Digit ? [
                    {
                      type: 'text',
                      content: (v) => {
                        const p1 = v.numBTens * v.numAOnes;
                        const c1 = Math.floor(p1 / 10);
                        const p2 = v.numBTens * v.numATens + c1;
                        const c2 = Math.floor(p2 / 10);
                        const p3raw = v.numBTens * v.numAHundreds;
                        const p3 = p3raw + c2;
                        if (c2 > 0) {
                          return `**${v.numBTens} × ${v.numAHundreds} = ${p3raw}**, plus carry ${c2} = **${p3}** → Write **${p3}**`;
                        }
                        return `**${v.numBTens} × ${v.numAHundreds} = ${p3}** → Write **${p3}**`;
                      }
                    }
                  ] : []),
                  {
                    type: 'text',
                    content: (v) => `Second row: **${v.partial2}** ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 4: ADD + YOUR TURN ----
              {
                type: "interact",
                title: () => "Step 3: Add the two rows!",
                body: (v) => `Nearly there! You've worked out **${v.partial1}** and **${v.partial2}**.\nNow add them together to get the final answer!`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [
                      { label: `${v.numA} × ${v.numBOnes}`, partial: v.partial1, carrying: v.carry1 },
                      { label: `${v.numA} × ${v.numBTens}0`, partial: v.partial2, carrying: v.carry2 }
                    ],
                    answer: v.product,
                    showCarrying: false,
                    hideAnswer: true,
                    allRevealed: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What is ${v.partial1} + ${v.partial2}?`,
                  getOptions: (v) => generateDistractors(v.product),
                  correctAnswer: (v) => v.product,
                  feedback: {
                    correct: (v) => `Brilliant! **${v.partial1} + ${v.partial2} = ${v.product}**. So ${v.numA} × ${v.numB} = **${v.product}** ${v.unit}! ✓`,
                    incorrect: (v) => `Not quite! ${v.partial1} + ${v.partial2} = **${v.product}**. Try adding column by column from the right!`
                  }
                }
              },
              // ---- Screen 5: SUMMARY ----
              {
                type: "consolidate",
                title: () => "Three steps to remember!",
                body: () => `The column method works for **any** multiplication. Just follow these three steps every time:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Step 1: Multiply by the ONES digit", why: "The last digit of the bottom number. Always start from the right!" },
                      { text: "Step 2: Multiply by the TENS digit", why: "Write a 0 first — you're multiplying by a multiple of 10!" },
                      { text: "Step 3: Add the two rows together", why: "That gives you the final answer! ✓" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      },

      // ==========================================
      // SUB-CONCEPT 1: Partitioning
      // ==========================================
      {
        id: "partitioning",
        name: "Partitioning for Multiplication",
        category: "grid",
        lessons: [
          // ---- Lesson 1A: Curiosity Hook ----
          {
            id: "partitioning-curiosity",
            templateType: "curiosity-hook",
            learningGoal: ["How to split numbers into tens and ones", "Multiplying each part separately then adding"],
            variableSets: [
              {
                name: "Amir",
                scenario: "counting football stickers",
                numA: 23,
                numB: 14,
                numATens: 20, numAOnes: 3,
                numBTens: 10, numBOnes: 4,
                product: 322,
                unit: "stickers"
              },
              {
                name: "Sophie",
                scenario: "working out how many chairs are in the school hall",
                numA: 34,
                numB: 12,
                numATens: 30, numAOnes: 4,
                numBTens: 10, numBOnes: 2,
                product: 408,
                unit: "chairs"
              },
              {
                name: "Jake",
                scenario: "counting books on the library shelves",
                numA: 21,
                numB: 16,
                numATens: 20, numAOnes: 1,
                numBTens: 10, numBOnes: 6,
                product: 336,
                unit: "books"
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `Can you work out ${v.numA} × ${v.numB}?`,
                body: (v) => `${v.name} is ${v.scenario}. There are **${v.numA} rows** with **${v.numB} in each row**. That's ${v.numA} × ${v.numB} — but how do you multiply that without a calculator? There's a really clever trick...`,
                visual: {
                  component: "GridModel",
                  props: (v) => ({
                    rows: 2,
                    cols: 2,
                    headers: { cols: [v.numBTens, v.numBOnes], rows: [v.numATens, v.numAOnes] },
                    cells: [["?", "?"], ["?", "?"]],
                    showValues: true,
                    revealStepByStep: false
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: (v) => "Split the numbers up!",
                body: (v) => `We can break **${v.numA}** into **${v.numATens} + ${v.numAOnes}**, and **${v.numB}** into **${v.numBTens} + ${v.numBOnes}**. Then multiply each pair. Tap each cell to see!`,
                visual: {
                  component: "GridModel",
                  props: (v) => ({
                    rows: 2,
                    cols: 2,
                    headers: { cols: [v.numBTens, v.numBOnes], rows: [v.numATens, v.numAOnes] },
                    cells: [
                      [v.numATens * v.numBTens, v.numATens * v.numBOnes],
                      [v.numAOnes * v.numBTens, v.numAOnes * v.numBOnes]
                    ],
                    showValues: false,
                    revealStepByStep: true
                  })
                },
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: (v) => "Now add them up!",
                body: (v) => `You've found the four parts. Now add them together to get **${v.numA} × ${v.numB}**.`,
                visual: {
                  component: "GridModel",
                  props: (v) => ({
                    rows: 2,
                    cols: 2,
                    headers: { cols: [v.numBTens, v.numBOnes], rows: [v.numATens, v.numAOnes] },
                    cells: [
                      [v.numATens * v.numBTens, v.numATens * v.numBOnes],
                      [v.numAOnes * v.numBTens, v.numAOnes * v.numBOnes]
                    ],
                    showValues: true,
                    showTotal: false
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => {
                    const parts = [
                      v.numATens * v.numBTens,
                      v.numATens * v.numBOnes,
                      v.numAOnes * v.numBTens,
                      v.numAOnes * v.numBOnes
                    ];
                    return `What is ${parts.join(' + ')}?`;
                  },
                  getOptions: (v) => generateDistractors(v.product),
                  correctAnswer: (v) => v.product,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.numA} × ${v.numB} = **${v.product}**. That's ${v.product} ${v.unit}!`,
                    incorrect: (v) => {
                      const parts = [
                        v.numATens * v.numBTens,
                        v.numATens * v.numBOnes,
                        v.numAOnes * v.numBTens,
                        v.numAOnes * v.numBOnes
                      ];
                      return `Nearly! ${parts.join(' + ')} = **${v.product}**. You had the right idea — just add all four parts carefully!`;
                    }
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The splitting trick!",
                body: (v) => `Whenever you need to multiply big numbers, **split them into tens and ones** and multiply each pair. Then just add up the parts. This is called **partitioning** (splitting into parts) — and it works every time!`,
                visual: {
                  component: "GridModel",
                  props: () => ({
                    rows: 2,
                    cols: 2,
                    headers: { cols: ["Tens", "Ones"], rows: ["Tens", "Ones"] },
                    cells: [["...", "..."], ["...", "..."]],
                    showValues: true,
                    generic: true,
                    showTotal: true,
                    totalLabel: "Add them all up = your answer!"
                  })
                },
                interaction: null
              }
            ]
          },

          // ---- Lesson 1B: Step by Step ----
          {
            id: "partitioning-steps",
            templateType: "step-by-step",
            learningGoal: ["How to split numbers into tens and ones", "Multiplying each part separately then adding"],
            variableSets: [
              {
                name: "Lily",
                scenario: "A bakery makes",
                numA: 26,
                numB: 13,
                numATens: 20, numAOnes: 6,
                numBTens: 10, numBOnes: 3,
                product: 338,
                unit: "cupcakes"
              },
              {
                name: "Marcus",
                scenario: "A factory packs",
                numA: 32,
                numB: 15,
                numATens: 30, numAOnes: 2,
                numBTens: 10, numBOnes: 5,
                product: 480,
                unit: "bottles"
              },
              {
                name: "Priya",
                scenario: "A cinema has",
                numA: 24,
                numB: 18,
                numATens: 20, numAOnes: 4,
                numBTens: 10, numBOnes: 8,
                product: 432,
                unit: "seats"
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `${v.numA} × ${v.numB} — step by step`,
                body: (v) => `${v.scenario} **${v.numA} batches** of **${v.numB} ${v.unit}** every day. How many ${v.unit} is that altogether? Let's work through it step by step!`,
                visual: {
                  component: "GridModel",
                  props: (v) => ({
                    rows: 2,
                    cols: 2,
                    headers: { cols: [v.numBTens, v.numBOnes], rows: [v.numATens, v.numAOnes] },
                    cells: [["?", "?"], ["?", "?"]],
                    showValues: true,
                    revealStepByStep: false
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Follow the steps",
                body: (v) => `Here's how to split **${v.numA} × ${v.numB}** into easy pieces. Tap to reveal each step!`,
                bodyParts: (v) => [
                  {
                    type: 'visual',
                    component: 'GridModel',
                    props: (v) => ({
                      rows: 2,
                      cols: 1,
                      headers: { cols: [v.numB], rows: [v.numATens, v.numAOnes] },
                      cells: [[`${v.numATens * v.numB}`], [`${v.numAOnes * v.numB}`]],
                      showValues: true,
                      showTotal: true,
                      totalLabel: `${v.numATens * v.numB} + ${v.numAOnes * v.numB} = ${v.product}`
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        {
                          text: `Split ${v.numA} into ${v.numATens} + ${v.numAOnes}`,
                          why: `Break the first number into tens and ones`,
                          result: `${v.numA} = ${v.numATens} + ${v.numAOnes}`
                        },
                        {
                          text: `Multiply ${v.numATens} × ${v.numB}`,
                          why: `Start with the tens — this is the big chunk`,
                          result: `${v.numATens} × ${v.numB} = ${v.numATens * v.numB}`
                        },
                        {
                          text: `Multiply ${v.numAOnes} × ${v.numB}`,
                          why: `Now do the ones — this is the small chunk`,
                          result: `${v.numAOnes} × ${v.numB} = ${v.numAOnes * v.numB}`
                        },
                        {
                          text: `Add the two parts together`,
                          why: `Tens chunk + ones chunk = total`,
                          result: `${v.numATens * v.numB} + ${v.numAOnes * v.numB} = ${v.product}`
                        }
                      ]
                    })
                  }
                ],
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: (v) => "Show what you know!",
                body: (v) => `You've split ${v.numA} into ${v.numATens} + ${v.numAOnes} and multiplied each by ${v.numB}. Now add the parts together!`,
                visual: {
                  component: "GridModel",
                  props: (v) => ({
                    rows: 2,
                    cols: 1,
                    headers: { cols: [v.numB], rows: [v.numATens, v.numAOnes] },
                    cells: [[`${v.numATens * v.numB}`], [`${v.numAOnes * v.numB}`]],
                    showValues: true,
                    showTotal: true,
                    totalLabel: `${v.numATens * v.numB} + ${v.numAOnes * v.numB} = ?`
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.numATens * v.numB} + ${v.numAOnes * v.numB} = ?`,
                  getOptions: (v) => generateDistractors(v.product),
                  correctAnswer: (v) => v.product,
                  feedback: {
                    correct: (v) => `You nailed it! ${v.numATens * v.numB} + ${v.numAOnes * v.numB} = **${v.product}**. That's ${v.product} ${v.unit}!`,
                    incorrect: (v) => `So close! ${v.numATens * v.numB} + ${v.numAOnes * v.numB} = **${v.product}**. You've got the right idea — just take it one step at a time!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "You've learned something brilliant!",
                body: () => `To multiply a 2-digit number by another number: **split it into tens and ones** (partitioning), multiply each part separately, then **add the results**. You've got this!`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Split into tens and ones", result: "e.g. 26 = 20 + 6" },
                      { text: "Multiply each part separately", result: "20 × 13 and 6 × 13" },
                      { text: "Add them together for your answer!", result: "260 + 78 = 338" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      },

      // ==========================================
      // SUB-CONCEPT 2: Grid Method
      // ==========================================
      {
        id: "grid-method",
        name: "The Grid Method",
        category: "grid",
        lessons: [
          // ---- Lesson 2A: Visual Discovery ----
          {
            id: "grid-method-discovery",
            templateType: "visual-discovery",
            learningGoal: ["How to lay out multiplication in a grid", "Filling in each box and adding them all up"],
            variableSets: [
              {
                name: "Emma",
                scenario: "planting flowers in a garden",
                numA: 25,
                numB: 13,
                numATens: 20, numAOnes: 5,
                numBTens: 10, numBOnes: 3,
                product: 325,
                unit: "flowers"
              },
              {
                name: "Zach",
                scenario: "laying tiles on a floor",
                numA: 31,
                numB: 14,
                numATens: 30, numAOnes: 1,
                numBTens: 10, numBOnes: 4,
                product: 434,
                unit: "tiles"
              },
              {
                name: "Mia",
                scenario: "counting stamps in an album",
                numA: 22,
                numB: 17,
                numATens: 20, numAOnes: 2,
                numBTens: 10, numBOnes: 7,
                product: 374,
                unit: "stamps"
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "What do you notice?",
                body: (v) => `Look at this grid for **${v.numA} × ${v.numB}**. The numbers across the top add up to ${v.numB}. The numbers down the side add up to ${v.numA}. Can you see how the grid organises the multiplication?`,
                visual: {
                  component: "GridModel",
                  props: (v) => ({
                    rows: 2,
                    cols: 2,
                    headers: { cols: [v.numBTens, v.numBOnes], rows: [v.numATens, v.numAOnes] },
                    cells: [
                      [v.numATens * v.numBTens, v.numATens * v.numBOnes],
                      [v.numAOnes * v.numBTens, v.numAOnes * v.numBOnes]
                    ],
                    showValues: true
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "How the grid works",
                body: (v) => `Each cell shows one multiplication. The **top-left** is the biggest part: ${v.numATens} × ${v.numBTens} = **${v.numATens * v.numBTens}**. The other cells fill in the rest. When you add all four cells together, you get the full answer!`,
                visual: {
                  component: "GridModel",
                  props: (v) => ({
                    rows: 2,
                    cols: 2,
                    headers: { cols: [v.numBTens, v.numBOnes], rows: [v.numATens, v.numAOnes] },
                    cells: [
                      [v.numATens * v.numBTens, v.numATens * v.numBOnes],
                      [v.numAOnes * v.numBTens, v.numAOnes * v.numBOnes]
                    ],
                    showValues: true,
                    showTotal: true
                  })
                },
                interaction: null
              },
              {
                type: "interact",
                title: (v) => "Your turn!",
                body: (v) => `${v.name} is ${v.scenario}. There are ${v.numA} rows of ${v.numB}. Use the grid to find the total.`,
                visual: {
                  component: "GridModel",
                  props: (v) => ({
                    rows: 2,
                    cols: 2,
                    headers: { cols: [v.numBTens, v.numBOnes], rows: [v.numATens, v.numAOnes] },
                    cells: [
                      [v.numATens * v.numBTens, v.numATens * v.numBOnes],
                      [v.numAOnes * v.numBTens, v.numAOnes * v.numBOnes]
                    ],
                    showValues: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What is ${v.numA} × ${v.numB}?`,
                  getOptions: (v) => generateDistractors(v.product),
                  correctAnswer: (v) => v.product,
                  feedback: {
                    correct: (v) => `Amazing! ${v.numA} × ${v.numB} = **${v.product}**. You're a grid method pro!`,
                    incorrect: (v) => {
                      const parts = [
                        v.numATens * v.numBTens,
                        v.numATens * v.numBOnes,
                        v.numAOnes * v.numBTens,
                        v.numAOnes * v.numBOnes
                      ];
                      return `Nearly! Add the four cells: ${parts.join(' + ')} = **${v.product}**. The grid keeps everything organised — you'll get it next time!`;
                    }
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The grid method",
                body: () => `The **grid method** (also called the box method) organises your multiplication into easy chunks. Split both numbers into tens and ones, fill in each box, then add them all up. It's the same as partitioning (splitting) — just laid out neatly!`,
                visual: {
                  component: "GridModel",
                  props: () => ({
                    rows: 2,
                    cols: 2,
                    headers: { cols: ["Tens", "Ones"], rows: ["Tens", "Ones"] },
                    cells: [["...", "..."], ["...", "..."]],
                    showValues: true,
                    generic: true,
                    showTotal: true,
                    totalLabel: "Add them all up = your answer!"
                  })
                },
                interaction: null
              }
            ]
          },

          // ---- Lesson 2B: Spot the Mistake ----
          {
            id: "grid-method-mistake",
            templateType: "spot-the-mistake",
            learningGoal: ["How to lay out multiplication in a grid", "Spotting common mistakes in the grid method"],
            variableSets: [
              {
                name: "Tom",
                numA: 27,
                numB: 13,
                numATens: 20, numAOnes: 7,
                numBTens: 10, numBOnes: 3,
                product: 351,
                // The mistake: Tom multiplied 7 × 3 as 28 instead of 21
                wrongCell: [1, 1],
                wrongValue: 28,
                correctValue: 21,
                wrongTotal: 358,
                mistakeExplanation: "mixed up 7 × 3 (which is 21) with 7 × 4 (which is 28)"
              },
              {
                name: "Ruby",
                numA: 34,
                numB: 16,
                numATens: 30, numAOnes: 4,
                numBTens: 10, numBOnes: 6,
                product: 544,
                // The mistake: Ruby put 30 × 6 = 108 instead of 180
                wrongCell: [0, 1],
                wrongValue: 108,
                correctValue: 180,
                wrongTotal: 472,
                mistakeExplanation: "wrote 30 × 6 = 108 instead of 180 — she forgot the zero in 30"
              },
              {
                name: "Oscar",
                numA: 28,
                numB: 15,
                numATens: 20, numAOnes: 8,
                numBTens: 10, numBOnes: 5,
                product: 420,
                // The mistake: Oscar multiplied 8 × 10 as 18 instead of 80
                wrongCell: [1, 0],
                wrongValue: 18,
                correctValue: 80,
                wrongTotal: 358,
                mistakeExplanation: "wrote 8 × 10 = 18 instead of 80 — he added instead of multiplying"
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `Can you spot ${v.name}'s mistake?`,
                body: (v) => `${v.name} used a grid to work out **${v.numA} × ${v.numB}** and got **${v.wrongTotal}**. But that's wrong! Look at the grid carefully — one of the cells has a mistake.`,
                visual: {
                  component: "GridModel",
                  props: (v) => {
                    const cells = [
                      [v.numATens * v.numBTens, v.numATens * v.numBOnes],
                      [v.numAOnes * v.numBTens, v.numAOnes * v.numBOnes]
                    ];
                    // Insert the wrong value
                    cells[v.wrongCell[0]][v.wrongCell[1]] = v.wrongValue;
                    return {
                      rows: 2,
                      cols: 2,
                      headers: { cols: [v.numBTens, v.numBOnes], rows: [v.numATens, v.numAOnes] },
                      cells,
                      showValues: true,
                      showTotal: true,
                      totalLabel: `${v.name} got: ${v.wrongTotal} ✗`
                    };
                  }
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Here's what went wrong",
                body: (v) => `${v.name} ${v.mistakeExplanation}. The cell should say **${v.correctValue}**, not ${v.wrongValue}. This changes the whole answer!`,
                visual: {
                  component: "GridModel",
                  props: (v) => ({
                    rows: 2,
                    cols: 2,
                    headers: { cols: [v.numBTens, v.numBOnes], rows: [v.numATens, v.numAOnes] },
                    cells: [
                      [v.numATens * v.numBTens, v.numATens * v.numBOnes],
                      [v.numAOnes * v.numBTens, v.numAOnes * v.numBOnes]
                    ],
                    showValues: true,
                    showTotal: true,
                    highlightTotal: true
                  })
                },
                interaction: null
              },
              {
                type: "interact",
                title: () => "What's the correct answer?",
                body: (v) => `Now that we've fixed the mistake, what is **${v.numA} × ${v.numB}** really? You can do this!`,
                visual: {
                  component: "GridModel",
                  props: (v) => ({
                    rows: 2,
                    cols: 2,
                    headers: { cols: [v.numBTens, v.numBOnes], rows: [v.numATens, v.numAOnes] },
                    cells: [
                      [v.numATens * v.numBTens, v.numATens * v.numBOnes],
                      [v.numAOnes * v.numBTens, v.numAOnes * v.numBOnes]
                    ],
                    showValues: true,
                    showTotal: true,
                    highlightTotal: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.numA} × ${v.numB} = ?`,
                  getOptions: (v) => generateDistractors(v.product),
                  correctAnswer: (v) => v.product,
                  feedback: {
                    correct: (v) => `Superstar! ${v.numA} × ${v.numB} = **${v.product}**. You spotted the mistake AND got the right answer!`,
                    incorrect: (v) => `Almost! The correct answer is **${v.product}**. You're getting the hang of it — just double-check each cell!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Top tips to remember!",
                body: () => `Now you know the common traps — you're one step ahead! Here are the things to watch for:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Check each cell: does row × column = cell value?", why: "Catch any times table slips" },
                      { text: "Watch out for ×10 and ×100 — don't drop the zero!", why: "30 × 6 = 180, not 18" },
                      { text: "Add all cells and check the total makes sense", why: "A quick estimate helps too" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      },

      // ==========================================
      // SUB-CONCEPT 3: Estimation
      // ==========================================
      {
        id: "estimation",
        name: "Estimating Answers",
        category: "other",
        lessons: [
          // ---- Lesson 3A: Key Fact ----
          {
            id: "estimation-keyfact",
            templateType: "key-fact",
            learningGoal: ["How to estimate the answer before calculating", "Rounding to the nearest 10 and multiplying"],
            variableSets: [
              {
                name: "Fatima", numA: 23, numB: 17,
                roundA: 20, roundB: 20, estimate: 400, product: 391,
                testA: 38, testB: 21, testRoundA: 40, testRoundB: 20, testEstimate: 800
              },
              {
                name: "Leo", numA: 29, numB: 18,
                roundA: 30, roundB: 20, estimate: 600, product: 522,
                testA: 52, testB: 11, testRoundA: 50, testRoundB: 10, testEstimate: 500
              },
              {
                name: "Isla", numA: 41, numB: 19,
                roundA: 40, roundB: 20, estimate: 800, product: 779,
                testA: 33, testB: 28, testRoundA: 30, testRoundB: 30, testEstimate: 900
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `How big is ${v.numA} × ${v.numB}?`,
                body: (v) => `Before you work out the exact answer, can you **guess roughly** how big ${v.numA} × ${v.numB} is? There's a clever trick that takes seconds!`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `${v.numA} × ${v.numB} = ???`, why: "Looks tricky... but we can estimate!" }
                    ]
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Round, then multiply!",
                body: (v) => `Round each number to the **nearest 10**, then multiply the easy numbers. Tap to see each step!`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `Round ${v.numA} → ${v.roundA}`, why: "Nearest ten" },
                      { text: `Round ${v.numB} → ${v.roundB}`, why: "Nearest ten" },
                      { text: `${v.roundA} × ${v.roundB} = ${v.estimate}`, why: "Easy multiplication!" },
                      { text: `So ${v.numA} × ${v.numB} is roughly ${v.estimate}`, result: `The real answer is ${v.product} — close!` }
                    ]
                  })
                },
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "Your turn to estimate!",
                body: (v) => `What's a good estimate for **${v.testA} × ${v.testB}**? Round each number to the nearest 10, then multiply!`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `${v.testA} rounds to ${v.testRoundA}`, why: "Nearest ten" },
                      { text: `${v.testB} rounds to ${v.testRoundB}`, why: "Nearest ten" }
                    ]
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.testRoundA} × ${v.testRoundB} = ?`,
                  getOptions: (v) => {
                    const e = v.testEstimate;
                    return [e, e / 10, e * 10, e >= 600 ? e - 400 : e + 400].sort(() => Math.random() - 0.5);
                  },
                  correctAnswer: (v) => v.testEstimate,
                  feedback: {
                    correct: (v) => `Spot on! ${v.testRoundA} × ${v.testRoundB} = **${v.testEstimate}**. You're a natural estimator!`,
                    incorrect: (v) => `Nearly! ${v.testRoundA} × ${v.testRoundB} = **${v.testEstimate}**. Round each number first, then multiply!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The estimation superpower!",
                body: () => `Estimating is like a **safety net** for your maths. Round, multiply, and you'll always know if your answer is in the right zone!`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Round both numbers to the nearest 10" },
                      { text: "Multiply the rounded numbers (easy!)" },
                      { text: "Your answer should be close to this estimate" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          },

          // ---- Lesson 3B: Curiosity Hook ----
          {
            id: "estimation-check",
            templateType: "curiosity-hook",
            learningGoal: ["How to use estimation to catch mistakes", "Checking if an answer is in the right ballpark"],
            variableSets: [
              {
                name: "Raj", numA: 34, numB: 21, product: 714,
                wrongAnswer: 7140, roundA: 30, roundB: 20, estimate: 600,
                why: "accidentally added an extra zero"
              },
              {
                name: "Amy", numA: 26, numB: 15, product: 390,
                wrongAnswer: 41, roundA: 30, roundB: 20, estimate: 600,
                why: "added the numbers instead of multiplying"
              },
              {
                name: "Dan", numA: 42, numB: 18, product: 756,
                wrongAnswer: 60, roundA: 40, roundB: 20, estimate: 800,
                why: "added the numbers instead of multiplying"
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `Is ${v.wrongAnswer} right?`,
                body: (v) => `${v.name} says **${v.numA} × ${v.numB} = ${v.wrongAnswer}**. Does that sound right to you? Think about how big the answer should be...`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `${v.name}'s answer: ${v.numA} × ${v.numB} = ${v.wrongAnswer}`, why: "Hmm, does this seem right?" }
                    ]
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Let's estimate to check!",
                body: (v) => `Round to the nearest 10: **${v.roundA} × ${v.roundB} = ${v.estimate}**. The answer should be near ${v.estimate} — but ${v.name} got ${v.wrongAnswer}! ${v.name} ${v.why}.`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `Estimate: ${v.roundA} × ${v.roundB} = ${v.estimate}`, why: "Quick estimate using rounded numbers" },
                      { text: `${v.name}'s answer: ${v.wrongAnswer}`, why: `Way off! ${v.name} ${v.why}` },
                      { text: `The real answer is ${v.product}`, result: `Close to our estimate of ${v.estimate} ✓` }
                    ]
                  })
                },
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "What's the real answer?",
                body: (v) => `Now you know the estimate is around **${v.estimate}**, which of these could be **${v.numA} × ${v.numB}**?`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `Estimate: ~${v.estimate}`, why: "The answer should be close to this" }
                    ]
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.numA} × ${v.numB} = ?`,
                  getOptions: (v) => generateDistractors(v.product),
                  correctAnswer: (v) => v.product,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.numA} × ${v.numB} = **${v.product}**, which is close to our estimate of ${v.estimate}!`,
                    incorrect: (v) => `Nearly! The answer is **${v.product}**. Notice it's close to our estimate of ${v.estimate}!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Estimation catches mistakes!",
                body: () => `Before you finish any multiplication, do a **quick estimate**. If your answer is way off from the estimate, something went wrong — go back and check!`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Estimate FIRST: round and multiply" },
                      { text: "Calculate the real answer" },
                      { text: "Compare: is your answer near the estimate?" },
                      { text: "If not — check your working!" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      },

      // ==========================================
      // SUB-CONCEPT 3B: Short Multiplication (1-digit column method)
      // ==========================================
      {
        id: "short-multiplication",
        name: "Short Multiplication (Column Method)",
        category: "column",
        lessons: [
          // ---- Lesson: Step by Step ----
          {
            id: "short-mult-steps",
            templateType: "step-by-step",
            learningGoal: ["How to multiply a 2-digit number by a single digit using columns", "When and how to carry digits"],
            variableSets: [
              {
                name: "Lily", scenario: "A shop sells",
                numA: 36, numB: 4, product: 144, unit: "T-shirts",
                // 4×6=24 → write 4, carry 2; 4×3=12+2=14
                carry: [{ col: 1, digit: 2 }]
              },
              {
                name: "Josh", scenario: "A class needs",
                numA: 27, numB: 6, product: 162, unit: "pencils",
                // 6×7=42 → write 2, carry 4; 6×2=12+4=16
                carry: [{ col: 1, digit: 4 }]
              },
              {
                name: "Priya", scenario: "A baker makes",
                numA: 53, numB: 8, product: 424, unit: "biscuits",
                // 8×3=24 → write 4, carry 2; 8×5=40+2=42
                carry: [{ col: 1, digit: 2 }]
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `${v.numA} × ${v.numB} — using columns`,
                body: (v) => `${v.scenario} **${v.numA} packs** of **${v.numB} ${v.unit}**. When you multiply by a single digit, you can write it out neatly in columns!`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [{ partial: v.product, carrying: v.carry }],
                    answer: v.product,
                    showCarrying: false,
                    allRevealed: true
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Multiply digit by digit",
                body: (v) => `Start from the **right** (the last digit). Multiply each digit by ${v.numB}. If the answer is 10 or more, **write the last digit and carry the rest**. Tap to see!`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [{ partial: v.product, carrying: v.carry }],
                    answer: v.product,
                    showCarrying: true,
                    allRevealed: true
                  })
                },
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "Your turn!",
                body: (v) => `Work out **${v.numA} × ${v.numB}** using the column method. Remember to carry!`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [{ partial: v.product, carrying: v.carry }],
                    answer: v.product,
                    showCarrying: true,
                    allRevealed: true,
                    hideAnswer: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.numA} × ${v.numB} = ?`,
                  getOptions: (v) => generateDistractors(v.product),
                  correctAnswer: (v) => v.product,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.numA} × ${v.numB} = **${v.product}**. That's ${v.product} ${v.unit}!`,
                    incorrect: (v) => `Nearly! ${v.numA} × ${v.numB} = **${v.product}**. Did you remember to add the carry digit?`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Short multiplication sorted!",
                body: () => `When multiplying by a single digit: work **right to left**, and if a step gives 10 or more, **carry the tens digit** to the next column.`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Start from the ones (rightmost digit)", why: "Always work right to left" },
                      { text: "Multiply and check: is the answer 10 or more?", why: "If yes, carry the tens digit" },
                      { text: "Move left, multiply, then ADD the carry", why: "Don't forget to add the carry!" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          },

          // ---- Lesson: Spot the Mistake ----
          {
            id: "short-mult-mistake",
            templateType: "spot-the-mistake",
            learningGoal: ["How to multiply a 2-digit number by a single digit using columns", "Why forgetting to carry gives the wrong answer"],
            variableSets: [
              {
                name: "Tom", numA: 47, numB: 3, product: 141,
                wrongProduct: 121,
                // Forgot carry 2 from 7×3=21
                carryCorrect: [{ col: 1, digit: 2 }], carryWrong: [],
                mistakeExplanation: "forgot to carry the 2 from 7 × 3 = 21"
              },
              {
                name: "Ruby", numA: 38, numB: 6, product: 228,
                wrongProduct: 188,
                // Forgot carry 4 from 8×6=48
                carryCorrect: [{ col: 1, digit: 4 }], carryWrong: [],
                mistakeExplanation: "forgot to carry the 4 from 8 × 6 = 48"
              },
              {
                name: "Oscar", numA: 64, numB: 7, product: 448,
                wrongProduct: 428,
                // Forgot carry 2 from 4×7=28
                carryCorrect: [{ col: 1, digit: 2 }], carryWrong: [],
                mistakeExplanation: "forgot to carry the 2 from 4 × 7 = 28"
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `Can you spot ${v.name}'s mistake?`,
                body: (v) => `${v.name} used the column method for **${v.numA} × ${v.numB}** and got **${v.wrongProduct}**. That's not right! Look at the column layout:`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [{ partial: v.wrongProduct, carrying: v.carryWrong }],
                    answer: v.wrongProduct,
                    showCarrying: false,
                    highlightStep: 0,
                    allRevealed: true
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "The carry was missing!",
                body: (v) => `${v.name} ${v.mistakeExplanation}. With the carry, the correct answer is **${v.product}**. Tap to see the correct working!`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [{ partial: v.product, carrying: v.carryCorrect }],
                    answer: v.product,
                    showCarrying: true,
                    allRevealed: true
                  })
                },
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "What's the correct answer?",
                body: (v) => `Now you know about the carry, what is **${v.numA} × ${v.numB}** really?`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [{ partial: v.product, carrying: v.carryCorrect }],
                    answer: v.product,
                    showCarrying: true,
                    allRevealed: true,
                    hideAnswer: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.numA} × ${v.numB} = ?`,
                  getOptions: (v) => generateDistractors(v.product),
                  correctAnswer: (v) => v.product,
                  feedback: {
                    correct: (v) => `Superstar! ${v.numA} × ${v.numB} = **${v.product}**. You spotted the missing carry!`,
                    incorrect: (v) => `Almost! ${v.numA} × ${v.numB} = **${v.product}**. Don't forget the carry digit!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Always carry!",
                body: () => `The most common mistake in column multiplication is **forgetting to carry**. Always check: if any step gives 10 or more, carry the tens digit!`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "7 × 3 = 21", why: "Write 1, carry 2 — don't just write 21!" },
                      { text: "Write the carry digit above the next column", why: "So you remember to add it" },
                      { text: "After multiplying, ADD the carry to that step", why: "e.g. 4 × 3 = 12, plus carry 2 = 14" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      },

      // ==========================================
      // SUB-CONCEPT 4A: Column Method — Ones Digit
      // ==========================================
      {
        id: "column-ones",
        name: "Column Method: The Ones Row",
        category: "column",
        lessons: [
          // ---- Lesson: Step by Step ----
          {
            id: "column-ones-steps",
            templateType: "step-by-step",
            learningGoal: ["How to do the FIRST row of long multiplication", "Multiplying by just the ones digit (the last digit)", "When to carry and how to write it"],
            variableSets: [
              {
                name: "Ella", scenario: "A bakery packs",
                numA: 36, onesDigit: 4, result: 144, unit: "cupcakes",
                // 4×6=24 → write 4, carry 2; 4×3=12+2=14
                onesA: 6, tensA: 3,
                step1Multiply: "4 × 6 = 24", step1Write: 4, step1Carry: 2,
                step2Multiply: "4 × 3 = 12", step2Add: "12 + 2 = 14", step2Write: 14,
                carry: [{ col: 1, digit: 2 }]
              },
              {
                name: "Josh", scenario: "A school orders",
                numA: 27, onesDigit: 6, result: 162, unit: "pencils",
                // 6×7=42 → write 2, carry 4; 6×2=12+4=16
                onesA: 7, tensA: 2,
                step1Multiply: "6 × 7 = 42", step1Write: 2, step1Carry: 4,
                step2Multiply: "6 × 2 = 12", step2Add: "12 + 4 = 16", step2Write: 16,
                carry: [{ col: 1, digit: 4 }]
              },
              {
                name: "Priya", scenario: "A toyshop sells",
                numA: 53, onesDigit: 8, result: 424, unit: "toy cars",
                // 8×3=24 → write 4, carry 2; 8×5=40+2=42
                onesA: 3, tensA: 5,
                step1Multiply: "8 × 3 = 24", step1Write: 4, step1Carry: 2,
                step2Multiply: "8 × 5 = 40", step2Add: "40 + 2 = 42", step2Write: 42,
                carry: [{ col: 1, digit: 2 }]
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `The first row of ${v.numA} × ?${v.onesDigit}`,
                body: (v) => `${v.scenario} **${v.numA} boxes** with **${v.onesDigit} ${v.unit}** per layer. In long multiplication, the very first thing you do is multiply by the **ones digit** (the last digit). Let's learn exactly how!`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.onesDigit,
                    steps: [{ partial: v.result, carrying: v.carry }],
                    answer: v.result,
                    showCarrying: false,
                    allRevealed: true
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Start from the RIGHT!",
                body: (v) => `Always begin with the **rightmost digit** (the ones). Tap to see each step!`,
                bodyParts: (v) => [
                  {
                    type: 'visual',
                    component: 'ColumnMethod',
                    props: (v) => ({
                      topNumber: v.numA,
                      bottomNumber: v.onesDigit,
                      steps: [{ partial: v.result, carrying: v.carry }],
                      answer: v.result,
                      showCarrying: true,
                      allRevealed: true
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `Start at the right: ${v.onesDigit} × ${v.onesA} (ones digit of ${v.numA})`, why: v.step1Multiply, result: `Write ${v.step1Write}, carry ${v.step1Carry}` },
                        { text: `Move left: ${v.onesDigit} × ${v.tensA} (tens digit of ${v.numA})`, why: v.step2Multiply },
                        { text: `Add the carry: ${v.step2Add}`, why: `Write ${v.step2Write}` },
                        { text: `First row done!`, result: `${v.numA} × ${v.onesDigit} = ${v.result}` }
                      ]
                    })
                  }
                ],
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "What's the first row?",
                body: (v) => `You've seen the steps. Now work out **${v.numA} × ${v.onesDigit}** using the column method!`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.onesDigit,
                    steps: [{ partial: v.result, carrying: v.carry }],
                    answer: v.result,
                    showCarrying: true,
                    allRevealed: true,
                    hideAnswer: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.numA} × ${v.onesDigit} = ?`,
                  getOptions: (v) => generateDistractors(v.result),
                  correctAnswer: (v) => v.result,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.numA} × ${v.onesDigit} = **${v.result}**. You've nailed the first row!`,
                    incorrect: (v) => `Nearly! ${v.numA} × ${v.onesDigit} = **${v.result}**. Remember: start from the right, carry when it's 10 or more!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The ones row — sorted!",
                body: () => `For the **first row** of long multiplication, you multiply by the **last digit** of the bottom number. Here's the recipe:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Start from the RIGHT (ones digit)", why: "Always go right to left" },
                      { text: "Multiply each top digit by the ones digit", why: "e.g. 4 × 6 = 24" },
                      { text: "If the answer is 10 or more: write the ones, carry the tens", why: "24 → write 4, carry 2" },
                      { text: "When you move left, DON'T FORGET to add the carry!", why: "4 × 3 = 12, plus carry 2 = 14" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          },

          // ---- Lesson: Spot the Mistake ----
          {
            id: "column-ones-mistake",
            templateType: "spot-the-mistake",
            learningGoal: ["How to do the FIRST row of long multiplication", "The most common mistake: forgetting to carry"],
            variableSets: [
              {
                name: "Tom", numA: 46, onesDigit: 3, result: 138,
                wrongResult: 128,
                // Forgot carry 1 from 6×3=18
                onesA: 6, tensA: 4,
                carryCorrect: [{ col: 1, digit: 1 }], carryWrong: [],
                mistakeExplanation: "forgot to carry the 1 from 6 × 3 = 18",
                step1: "3 × 6 = 18 → write 8, carry 1", step2wrong: "3 × 4 = 12 (forgot +1!)", step2right: "3 × 4 = 12, + carry 1 = 13"
              },
              {
                name: "Ruby", numA: 38, onesDigit: 7, result: 266,
                wrongResult: 216,
                // Forgot carry 5 from 8×7=56
                onesA: 8, tensA: 3,
                carryCorrect: [{ col: 1, digit: 5 }], carryWrong: [],
                mistakeExplanation: "forgot to carry the 5 from 8 × 7 = 56",
                step1: "7 × 8 = 56 → write 6, carry 5", step2wrong: "7 × 3 = 21 (forgot +5!)", step2right: "7 × 3 = 21, + carry 5 = 26"
              },
              {
                name: "Oscar", numA: 64, onesDigit: 9, result: 576,
                wrongResult: 546,
                // Forgot carry 3 from 4×9=36
                onesA: 4, tensA: 6,
                carryCorrect: [{ col: 1, digit: 3 }], carryWrong: [],
                mistakeExplanation: "forgot to carry the 3 from 4 × 9 = 36",
                step1: "9 × 4 = 36 → write 6, carry 3", step2wrong: "9 × 6 = 54 (forgot +3!)", step2right: "9 × 6 = 54, + carry 3 = 57"
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `Spot ${v.name}'s mistake!`,
                body: (v) => `${v.name} worked out the first row of a column multiplication: **${v.numA} × ${v.onesDigit}** and got **${v.wrongResult}**. That's not right! Can you see why?`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.onesDigit,
                    steps: [{ partial: v.wrongResult, carrying: v.carryWrong }],
                    answer: v.wrongResult,
                    showCarrying: false,
                    highlightStep: 0,
                    allRevealed: true
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "The carry was missing!",
                body: (v) => `${v.name} ${v.mistakeExplanation}. Here's what should have happened:`,
                bodyParts: (v) => [
                  {
                    type: 'visual',
                    component: 'ColumnMethod',
                    props: (v) => ({
                      topNumber: v.numA,
                      bottomNumber: v.onesDigit,
                      steps: [{ partial: v.result, carrying: v.carryCorrect }],
                      answer: v.result,
                      showCarrying: true,
                      allRevealed: true
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: v.step1, why: "This part was correct" },
                        { text: `✗ ${v.name}: ${v.step2wrong}`, why: "Oops — forgot the carry!" },
                        { text: `✓ Correct: ${v.step2right}`, result: `${v.numA} × ${v.onesDigit} = ${v.result}` }
                      ]
                    })
                  }
                ],
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "What's the correct answer?",
                body: (v) => `Now you know about the carry, what is **${v.numA} × ${v.onesDigit}** really?`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.onesDigit,
                    steps: [{ partial: v.result, carrying: v.carryCorrect }],
                    answer: v.result,
                    showCarrying: true,
                    allRevealed: true,
                    hideAnswer: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.numA} × ${v.onesDigit} = ?`,
                  getOptions: (v) => generateDistractors(v.result),
                  correctAnswer: (v) => v.result,
                  feedback: {
                    correct: (v) => `Superstar! ${v.numA} × ${v.onesDigit} = **${v.result}**. You spotted the missing carry!`,
                    incorrect: (v) => `Almost! ${v.numA} × ${v.onesDigit} = **${v.result}**. Don't forget to add the carry digit!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Never forget the carry!",
                body: () => `The number one mistake in column multiplication is **forgetting to carry**. Here's how to always get it right:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "If your multiplication gives 10 or more...", why: "e.g. 7 × 8 = 56" },
                      { text: "Write the ONES digit in the answer", why: "Write 6" },
                      { text: "Write the TENS digit as a small carry above the next column", why: "Carry 5" },
                      { text: "When you do the next column, ADD the carry!", why: "7 × 3 = 21, + 5 = 26" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      },

      // ==========================================
      // SUB-CONCEPT 4B: Column Method — Tens Digit
      // ==========================================
      {
        id: "column-tens",
        name: "Column Method: The Tens Row",
        category: "column",
        lessons: [
          // ---- Lesson: Step by Step ----
          {
            id: "column-tens-steps",
            templateType: "step-by-step",
            learningGoal: ["How to do the SECOND row of long multiplication", "Why we write a 0 first when multiplying by the tens digit", "How carrying works in the tens row"],
            variableSets: [
              {
                name: "Mia", scenario: "A garden centre has",
                numA: 36, tensDigit: 2, tensValue: 20, result: 720, unit: "plant pots",
                onesA: 6, tensA: 3,
                step1: "Write a 0 in the ones column — because we're multiplying by 20, not 2!",
                step2Multiply: "2 × 6 = 12", step2Write: 2, step2Carry: 1,
                step3Multiply: "2 × 3 = 6", step3Add: "6 + 1 = 7", step3Write: 7,
                carry: [{ col: 2, digit: 1 }]
              },
              {
                name: "Zach", scenario: "A cinema sells",
                numA: 43, tensDigit: 3, tensValue: 30, result: 1290, unit: "tickets",
                onesA: 3, tensA: 4,
                step1: "Write a 0 in the ones column — because we're multiplying by 30, not 3!",
                step2Multiply: "3 × 3 = 9", step2Write: 9, step2Carry: 0,
                step3Multiply: "3 × 4 = 12", step3Add: "12 + 0 = 12", step3Write: 12,
                carry: []
              },
              {
                name: "Lily", scenario: "A warehouse stores",
                numA: 57, tensDigit: 4, tensValue: 40, result: 2280, unit: "boxes",
                onesA: 7, tensA: 5,
                step1: "Write a 0 in the ones column — because we're multiplying by 40, not 4!",
                step2Multiply: "4 × 7 = 28", step2Write: 8, step2Carry: 2,
                step3Multiply: "4 × 5 = 20", step3Add: "20 + 2 = 22", step3Write: 22,
                carry: [{ col: 2, digit: 2 }]
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `The second row: × ${v.tensValue}`,
                body: (v) => `${v.scenario} **${v.numA} shelves** of **${v.tensValue} ${v.unit}**. In long multiplication, after the ones row, you do the **tens row**. The big trick? You must start with a **zero**!`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.tensValue,
                    steps: [{ partial: 0, carrying: [] }],
                    answer: v.result,
                    showCarrying: false,
                    hideAnswer: true,
                    allRevealed: true
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Why start with a zero?",
                body: (v) => `Because you're multiplying by **${v.tensValue}** (which is ${v.tensDigit} × 10), not just ${v.tensDigit}. The zero holds the ones place. Tap to see each step!`,
                bodyParts: (v) => [
                  {
                    type: 'visual',
                    component: 'ColumnMethod',
                    props: (v) => ({
                      topNumber: v.numA,
                      bottomNumber: v.tensValue,
                      steps: [{ partial: v.result, carrying: v.carry }],
                      answer: v.result,
                      showCarrying: true,
                      allRevealed: true
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: v.step1, why: `${v.tensValue} = ${v.tensDigit} × 10, so the answer will end in 0` },
                        { text: `Now multiply: ${v.tensDigit} × ${v.onesA} (ones of ${v.numA})`, why: v.step2Multiply, result: v.step2Carry > 0 ? `Write ${v.step2Write}, carry ${v.step2Carry}` : `Write ${v.step2Write}` },
                        { text: `Move left: ${v.tensDigit} × ${v.tensA} (tens of ${v.numA})`, why: v.step3Multiply, result: v.step2Carry > 0 ? `${v.step3Add} → write ${v.step3Write}` : `Write ${v.step3Write}` },
                        { text: `Second row done!`, result: `${v.numA} × ${v.tensValue} = ${v.result}` }
                      ]
                    })
                  }
                ],
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "What's the tens row?",
                body: (v) => `Remember: start with a zero, then multiply by ${v.tensDigit}. What is **${v.numA} × ${v.tensValue}**?`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.tensValue,
                    steps: [{ partial: v.result, carrying: v.carry }],
                    answer: v.result,
                    showCarrying: true,
                    allRevealed: true,
                    hideAnswer: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.numA} × ${v.tensValue} = ?`,
                  getOptions: (v) => generateDistractors(v.result),
                  correctAnswer: (v) => v.result,
                  feedback: {
                    correct: (v) => `Amazing! ${v.numA} × ${v.tensValue} = **${v.result}**. You remembered the zero!`,
                    incorrect: (v) => `Nearly! ${v.numA} × ${v.tensValue} = **${v.result}**. Did you remember to start with the placeholder zero?`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The tens row — nailed it!",
                body: () => `For the **second row** of long multiplication, you multiply by the **tens digit** of the bottom number. The golden rule:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "ALWAYS write a 0 first in the ones column", why: "Because you're multiplying by 20/30/40 etc., not 2/3/4" },
                      { text: "Then multiply each top digit by the tens digit", why: "Work right to left, just like the ones row" },
                      { text: "Carry digits work the same way as before", why: "10 or more? Write ones, carry tens!" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          },

          // ---- Lesson: Visual Discovery ----
          {
            id: "column-tens-pattern",
            templateType: "visual-discovery",
            learningGoal: ["Why the tens row has a zero at the end", "The connection between × 2 and × 20"],
            variableSets: [
              {
                numA: 36, smallDigit: 2, tensValue: 20,
                smallResult: 72, tensResult: 720
              },
              {
                numA: 45, smallDigit: 3, tensValue: 30,
                smallResult: 135, tensResult: 1350
              },
              {
                numA: 28, smallDigit: 4, tensValue: 40,
                smallResult: 112, tensResult: 1120
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "Spot the pattern!",
                body: (v) => `Look at these two calculations. What do you notice about **${v.numA} × ${v.smallDigit}** and **${v.numA} × ${v.tensValue}**?`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `${v.numA} × ${v.smallDigit} = ${v.smallResult}` },
                      { text: `${v.numA} × ${v.tensValue} = ${v.tensResult}` }
                    ]
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "It's × 10!",
                body: (v) => `**${v.tensValue}** is just **${v.smallDigit} × 10**. So ${v.numA} × ${v.tensValue} is the same as ${v.numA} × ${v.smallDigit}, then × 10. That's why we add a zero! Tap to see:`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `${v.numA} × ${v.smallDigit} = ${v.smallResult}`, why: `The basic multiplication` },
                      { text: `${v.smallResult} × 10 = ${v.tensResult}`, why: `× 10 just adds a zero!` },
                      { text: `So ${v.numA} × ${v.tensValue} = ${v.tensResult}`, result: `The zero in the tens row comes from × 10!` }
                    ]
                  })
                },
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "Your turn!",
                body: (v) => `If **${v.numA} × ${v.smallDigit} = ${v.smallResult}**, what is **${v.numA} × ${v.tensValue}**?`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `${v.numA} × ${v.smallDigit} = ${v.smallResult}`, why: "Now multiply by 10..." }
                    ]
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.numA} × ${v.tensValue} = ?`,
                  getOptions: (v) => [v.tensResult, v.smallResult, v.tensResult + 10, v.smallResult * 100].sort(() => Math.random() - 0.5),
                  correctAnswer: (v) => v.tensResult,
                  feedback: {
                    correct: (v) => `You've got it! ${v.numA} × ${v.tensValue} = **${v.tensResult}**. Just add a zero to ${v.smallResult}!`,
                    incorrect: (v) => `Not quite! ${v.smallResult} × 10 = **${v.tensResult}**. Multiplying by 10 adds one zero!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "That's why we write the zero!",
                body: () => `In long multiplication, the second row always starts with a **0** because you're really multiplying by a tens number (20, 30, 40...). It's the same as multiplying by the digit, then by 10!`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "36 × 2 = 72", why: "The basic multiplication" },
                      { text: "36 × 20 = 720", why: "Same thing × 10 — just add the zero!" },
                      { text: "That 0 in the tens row? It comes from the × 10!", result: "Now you know WHY it's there!" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      },

      // ==========================================
      // SUB-CONCEPT 4C: Column Method — Adding Rows
      // ==========================================
      {
        id: "column-adding",
        name: "Column Method: Adding the Rows",
        category: "column",
        lessons: [
          // ---- Lesson: Step by Step ----
          {
            id: "column-adding-steps",
            templateType: "step-by-step",
            learningGoal: ["How to add the two rows together to get the final answer", "Adding column by column from right to left"],
            variableSets: [
              {
                name: "Aisha", numA: 36, numB: 24,
                partial1: 144, partial2: 720, answer: 864,
                // Adding: 4+0=4, 4+2=6, 1+7=8
                addSteps: ["4 + 0 = 4 (ones)", "4 + 2 = 6 (tens)", "1 + 7 = 8 (hundreds)"],
                numBOnes: 4, numBTens: 2,
                carry1: [{ col: 1, digit: 2 }], carry2: [{ col: 2, digit: 1 }]
              },
              {
                name: "Ben", numA: 43, numB: 27,
                partial1: 301, partial2: 860, answer: 1161,
                addSteps: ["1 + 0 = 1 (ones)", "0 + 6 = 6 (tens)", "3 + 8 = 11 (hundreds — write 1, carry 1)", "carry 1 = 1 (thousands)"],
                numBOnes: 7, numBTens: 2,
                carry1: [{ col: 1, digit: 2 }], carry2: []
              },
              {
                name: "Sophie", numA: 52, numB: 18,
                partial1: 416, partial2: 520, answer: 936,
                addSteps: ["6 + 0 = 6 (ones)", "1 + 2 = 3 (tens)", "4 + 5 = 9 (hundreds)"],
                numBOnes: 8, numBTens: 1,
                carry1: [{ col: 1, digit: 1 }], carry2: []
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `Nearly there! Add the rows`,
                body: (v) => `${v.name} has done the hard work: **${v.numA} × ${v.numBOnes} = ${v.partial1}** and **${v.numA} × ${v.numBTens}0 = ${v.partial2}**. Now there's one final step — **add them together**!`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [
                      { label: `×${v.numBOnes}`, partial: v.partial1, carrying: v.carry1 },
                      { label: `×${v.numBTens}0`, partial: v.partial2, carrying: v.carry2 }
                    ],
                    answer: v.answer,
                    showCarrying: true,
                    highlightAnswer: true,
                    allRevealed: true
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Add column by column!",
                body: (v) => `Just like the multiplication, add from **right to left**. Tap to see each column!`,
                bodyParts: (v) => [
                  {
                    type: 'visual',
                    component: 'ColumnMethod',
                    props: (v) => ({
                      topNumber: v.numA,
                      bottomNumber: v.numB,
                      steps: [
                        { label: `×${v.numBOnes}`, partial: v.partial1, carrying: v.carry1 },
                        { label: `×${v.numBTens}0`, partial: v.partial2, carrying: v.carry2 }
                      ],
                      answer: v.answer,
                      showCarrying: true,
                      highlightAnswer: true,
                      allRevealed: true
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `We need: ${v.partial1} + ${v.partial2}`, why: "Add the ones row and tens row" },
                        ...v.addSteps.map((step, i) => ({ text: `Column ${i + 1}: ${step}` })),
                        { text: `Answer: ${v.answer}`, result: `${v.numA} × ${v.numB} = ${v.answer}!` }
                      ]
                    })
                  }
                ],
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "Add the rows!",
                body: (v) => `What is **${v.partial1} + ${v.partial2}**?`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [
                      { label: `×${v.numBOnes}`, partial: v.partial1, carrying: v.carry1 },
                      { label: `×${v.numBTens}0`, partial: v.partial2, carrying: v.carry2 }
                    ],
                    answer: v.answer,
                    showCarrying: true,
                    allRevealed: true,
                    hideAnswer: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.partial1} + ${v.partial2} = ?`,
                  getOptions: (v) => generateDistractors(v.answer),
                  correctAnswer: (v) => v.answer,
                  feedback: {
                    correct: (v) => `Amazing! ${v.partial1} + ${v.partial2} = **${v.answer}**. That means ${v.numA} × ${v.numB} = ${v.answer}!`,
                    incorrect: (v) => `Nearly! ${v.partial1} + ${v.partial2} = **${v.answer}**. Add each column from right to left!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The final step!",
                body: () => `Adding the rows is the **last step** of the column method. It's just normal addition — but do it carefully!`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Line up the two rows neatly", why: "Ones under ones, tens under tens" },
                      { text: "Add from RIGHT to LEFT", why: "Just like multiplication!" },
                      { text: "If a column adds to 10 or more, carry!", why: "Same carrying rules as always" },
                      { text: "The answer is your final multiplication result!", result: "You've completed the column method!" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          },

          // ---- Lesson: Spot the Mistake ----
          {
            id: "column-adding-mistake",
            templateType: "spot-the-mistake",
            learningGoal: ["How to add the two rows together correctly", "Common addition mistakes when combining rows"],
            variableSets: [
              {
                name: "Finn", numA: 36, numB: 24,
                partial1: 144, partial2: 720,
                correctAnswer: 864, wrongAnswer: 854,
                numBOnes: 4, numBTens: 2,
                carry1: [{ col: 1, digit: 2 }], carry2: [{ col: 2, digit: 1 }],
                mistakeExplanation: "added the tens column wrong: 4 + 2 = 6, not 5"
              },
              {
                name: "Noor", numA: 47, numB: 23,
                partial1: 141, partial2: 940,
                correctAnswer: 1081, wrongAnswer: 981,
                numBOnes: 3, numBTens: 2,
                carry1: [{ col: 1, digit: 2 }], carry2: [],
                mistakeExplanation: "forgot that 4 + 9 = 13 (carry the 1 to thousands)"
              },
              {
                name: "Ella", numA: 58, numB: 16,
                partial1: 348, partial2: 580,
                correctAnswer: 928, wrongAnswer: 828,
                numBOnes: 6, numBTens: 1,
                carry1: [{ col: 1, digit: 4 }], carry2: [],
                mistakeExplanation: "added the hundreds column wrong: 3 + 5 = 8, but forgot the carry from 4 + 8 = 12"
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `${v.name}'s addition error!`,
                body: (v) => `${v.name} did the multiplication correctly: **${v.partial1}** and **${v.partial2}**. But when adding them, got **${v.wrongAnswer}** instead of the right answer. Can you spot the mistake?`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [
                      { label: `×${v.numBOnes}`, partial: v.partial1, carrying: v.carry1 },
                      { label: `×${v.numBTens}0`, partial: v.partial2, carrying: v.carry2 }
                    ],
                    answer: v.wrongAnswer,
                    showCarrying: true,
                    highlightAnswer: true,
                    allRevealed: true
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Check the addition!",
                body: (v) => `${v.name} ${v.mistakeExplanation}. Even when the multiplication is perfect, a slip in the addition changes the whole answer!`,
                bodyParts: (v) => [
                  {
                    type: 'visual',
                    component: 'ColumnMethod',
                    props: (v) => ({
                      topNumber: v.numA,
                      bottomNumber: v.numB,
                      steps: [
                        { label: `×${v.numBOnes}`, partial: v.partial1, carrying: v.carry1 },
                        { label: `×${v.numBTens}0`, partial: v.partial2, carrying: v.carry2 }
                      ],
                      answer: v.correctAnswer,
                      showCarrying: true,
                      highlightAnswer: true,
                      allRevealed: true
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `${v.name}'s rows: ${v.partial1} and ${v.partial2}`, why: "The multiplication was correct!" },
                        { text: `✗ ${v.name} got: ${v.wrongAnswer}`, why: v.mistakeExplanation },
                        { text: `✓ Correct: ${v.partial1} + ${v.partial2} = ${v.correctAnswer}`, result: "Always double-check the addition!" }
                      ]
                    })
                  }
                ],
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "What's the correct total?",
                body: (v) => `What is **${v.partial1} + ${v.partial2}** really?`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [
                      { label: `×${v.numBOnes}`, partial: v.partial1, carrying: v.carry1 },
                      { label: `×${v.numBTens}0`, partial: v.partial2, carrying: v.carry2 }
                    ],
                    answer: v.correctAnswer,
                    showCarrying: true,
                    allRevealed: true,
                    hideAnswer: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.partial1} + ${v.partial2} = ?`,
                  getOptions: (v) => generateDistractors(v.correctAnswer),
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Superstar! ${v.partial1} + ${v.partial2} = **${v.correctAnswer}**. You caught the addition mistake!`,
                    incorrect: (v) => `Almost! ${v.partial1} + ${v.partial2} = **${v.correctAnswer}**. Add each column carefully from right to left!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Don't rush the last step!",
                body: () => `You can do perfect multiplication and still get the wrong answer if the addition is wrong. Take your time on this final step!`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Add columns right to left — same as always", why: "Ones first, then tens, then hundreds" },
                      { text: "Watch for carries in the addition too!", why: "14 + 7 = 21 → write 1, carry 2" },
                      { text: "Quick estimate check at the end", why: "Is your answer near what you'd expect?" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      },

      // ==========================================
      // SUB-CONCEPT 4D: Full Column Method (Complete)
      // ==========================================
      {
        id: "column-full",
        name: "The Full Column Method",
        category: "column",
        lessons: [
          // ---- Lesson 4A: Step by Step (Column Layout) ----
          {
            id: "column-method-steps",
            templateType: "step-by-step",
            learningGoal: ["The complete column method from start to finish", "All three steps: ones row, tens row, then add"],
            variableSets: [
              {
                name: "Charlie", scenario: "A sports shop orders",
                numA: 36, numB: 24, numBOnes: 4, numBTens: 2,
                product: 864, unit: "footballs",
                // 36 × 4 = 144: 4×6=24 (write 4 carry 2), 4×3=12+2=14
                partial1: 144, carry1: [{ col: 1, digit: 2 }],
                // 36 × 20 = 720: 2×6=12 (write 2 carry 1), 2×3=6+1=7
                partial2: 720, carry2: [{ col: 2, digit: 1 }]
              },
              {
                name: "Aisha", scenario: "A garden centre sells",
                numA: 43, numB: 27, numBOnes: 7, numBTens: 2,
                product: 1161, unit: "plants",
                // 43 × 7 = 301: 7×3=21 (write 1 carry 2), 7×4=28+2=30
                partial1: 301, carry1: [{ col: 1, digit: 2 }],
                // 43 × 20 = 860: 2×3=6, 2×4=8
                partial2: 860, carry2: []
              },
              {
                name: "Ben", scenario: "A cinema has",
                numA: 52, numB: 18, numBOnes: 8, numBTens: 1,
                product: 936, unit: "seats",
                // 52 × 8 = 416: 8×2=16 (write 6 carry 1), 8×5=40+1=41
                partial1: 416, carry1: [{ col: 1, digit: 1 }],
                // 52 × 10 = 520: 1×2=2, 1×5=5
                partial2: 520, carry2: []
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `${v.numA} × ${v.numB} — the quick way`,
                body: (v) => `${v.scenario} **${v.numA} boxes** of **${v.numB} ${v.unit}**. There's a fast written method that works for any multiplication — the **column method**! Here's how the layout looks:`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [
                      { label: `×${v.numBOnes}`, partial: v.partial1, carrying: v.carry1 },
                      { label: `×${v.numBTens}0`, partial: v.partial2, carrying: v.carry2 }
                    ],
                    answer: v.product,
                    showCarrying: false,
                    allRevealed: true
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "The column method — step by step",
                body: (v) => `First multiply by the **ones digit** (the last digit: ${v.numBOnes}), then by the **tens digit** (${v.numBTens}0). Watch the carry digits appear! Tap to see each row.`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [
                      { label: `×${v.numBOnes}`, partial: v.partial1, carrying: v.carry1 },
                      { label: `×${v.numBTens}0`, partial: v.partial2, carrying: v.carry2 }
                    ],
                    answer: v.product,
                    showCarrying: true,
                    allRevealed: true
                  })
                },
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "Add the rows!",
                body: (v) => `You've worked out **${v.partial1}** (×${v.numBOnes}) and **${v.partial2}** (×${v.numBTens}0). Now add them together!`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [
                      { label: `×${v.numBOnes}`, partial: v.partial1, carrying: v.carry1 },
                      { label: `×${v.numBTens}0`, partial: v.partial2, carrying: v.carry2 }
                    ],
                    answer: v.product,
                    showCarrying: true,
                    allRevealed: true,
                    hideAnswer: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.partial1} + ${v.partial2} = ?`,
                  getOptions: (v) => generateDistractors(v.product),
                  correctAnswer: (v) => v.product,
                  feedback: {
                    correct: (v) => `Amazing! ${v.numA} × ${v.numB} = **${v.product}**. That's ${v.product} ${v.unit}!`,
                    incorrect: (v) => `Nearly! ${v.partial1} + ${v.partial2} = **${v.product}**. Add the two rows carefully!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The column method rocks!",
                body: () => `Write the numbers one above the other. Multiply by the **ones digit** (last digit) first, carrying when needed. Then multiply by the **tens digit** (put a 0 first!), then **add the two rows**. Three simple steps!`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Step 1: Multiply by the ones digit", why: "Write carries above, then add them as you go" },
                      { text: "Step 2: Multiply by the tens digit", why: "Put a 0 in the ones column first!" },
                      { text: "Step 3: Add the two rows together", why: "That's your answer!" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          },

          // ---- Lesson 4B: Spot the Mistake (Column Layout) ----
          {
            id: "column-method-mistake",
            templateType: "spot-the-mistake",
            learningGoal: ["The complete column method from start to finish", "Why forgetting to carry changes the whole answer"],
            variableSets: [
              {
                name: "Zara", numA: 47, numB: 23,
                numBOnes: 3, numBTens: 2, product: 1081,
                // Correct: 47×3=141, Wrong: 121 (forgot carry 2 from 7×3=21)
                correctPartial: 141, wrongPartial: 121, otherPartial: 940,
                wrongProduct: 1061,
                carry1Correct: [{ col: 1, digit: 2 }],
                carry1Wrong: [],
                carry2: [{ col: 2, digit: 1 }],
                mistakeExplanation: "forgot to carry the 2 from 7 × 3 = 21"
              },
              {
                name: "Flynn", numA: 38, numB: 26,
                numBOnes: 6, numBTens: 2, product: 988,
                // Correct: 38×6=228, Wrong: 188 (forgot carry 4 from 8×6=48)
                correctPartial: 228, wrongPartial: 188, otherPartial: 760,
                wrongProduct: 948,
                carry1Correct: [{ col: 1, digit: 4 }],
                carry1Wrong: [],
                carry2: [],
                mistakeExplanation: "forgot to carry the 4 from 8 × 6 = 48"
              },
              {
                name: "Noor", numA: 56, numB: 17,
                numBOnes: 7, numBTens: 1, product: 952,
                // Correct: 56×7=392, Wrong: 352 (forgot carry 4 from 6×7=42)
                correctPartial: 392, wrongPartial: 352, otherPartial: 560,
                wrongProduct: 912,
                carry1Correct: [{ col: 1, digit: 4 }],
                carry1Wrong: [],
                carry2: [],
                mistakeExplanation: "forgot to carry the 4 from 6 × 7 = 42"
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `Spot ${v.name}'s mistake!`,
                body: (v) => `${v.name} used the column method for **${v.numA} × ${v.numB}** and got **${v.wrongProduct}**. Look at the working — can you spot the error?`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [
                      { label: `×${v.numBOnes}`, partial: v.wrongPartial, carrying: v.carry1Wrong },
                      { label: `×${v.numBTens}0`, partial: v.otherPartial, carrying: v.carry2 }
                    ],
                    answer: v.wrongProduct,
                    showCarrying: false,
                    highlightStep: 0,
                    allRevealed: true
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Here's what went wrong",
                body: (v) => `${v.name} ${v.mistakeExplanation}. With the carry, **${v.numA} × ${v.numBOnes}** should be **${v.correctPartial}**, not ${v.wrongPartial}. Tap to see the correct working!`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [
                      { label: `×${v.numBOnes} ✓`, partial: v.correctPartial, carrying: v.carry1Correct },
                      { label: `×${v.numBTens}0`, partial: v.otherPartial, carrying: v.carry2 }
                    ],
                    answer: v.product,
                    showCarrying: true,
                    highlightAnswer: true,
                    allRevealed: true
                  })
                },
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "What's the correct answer?",
                body: (v) => `Now you've spotted the carry mistake, what is **${v.numA} × ${v.numB}** really?`,
                visual: {
                  component: "ColumnMethod",
                  props: (v) => ({
                    topNumber: v.numA,
                    bottomNumber: v.numB,
                    steps: [
                      { label: `×${v.numBOnes}`, partial: v.correctPartial, carrying: v.carry1Correct },
                      { label: `×${v.numBTens}0`, partial: v.otherPartial, carrying: v.carry2 }
                    ],
                    answer: v.product,
                    showCarrying: true,
                    allRevealed: true,
                    hideAnswer: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.numA} × ${v.numB} = ?`,
                  getOptions: (v) => generateDistractors(v.product),
                  correctAnswer: (v) => v.product,
                  feedback: {
                    correct: (v) => `Superstar! ${v.numA} × ${v.numB} = **${v.product}**. You found the carry mistake and fixed it!`,
                    incorrect: (v) => `Almost! ${v.correctPartial} + ${v.otherPartial} = **${v.product}**. Don't forget to add both rows!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Column method top tips!",
                body: () => `The column method is brilliant — but always **carry your digits**! Here are the traps to watch for:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Always write carry digits above the next column", why: "7 × 3 = 21 → write 1, carry 2 above" },
                      { text: "Don't forget the placeholder zero for tens", why: "When multiplying by the tens digit, start with 0" },
                      { text: "Check with an estimate at the end", why: "Is your answer in the right ballpark?" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      },

      // ==========================================
      // SUB-CONCEPT 5: Multiplying by 10/100
      // ==========================================
      {
        id: "multiply-tens",
        name: "Multiplying by 10, 100, 1000",
        category: "other",
        lessons: [
          // ---- Lesson 5A: Visual Discovery ----
          {
            id: "tens-discovery",
            templateType: "visual-discovery",
            learningGoal: ["The shortcut for multiplying by 10, 100, 1000", "How digits shift left"],
            variableSets: [
              { numA: 7, x10: 70, x100: 700, x1000: 7000 },
              { numA: 4, x10: 40, x100: 400, x1000: 4000 },
              { numA: 12, x10: 120, x100: 1200, x1000: 12000 }
            ],
            screens: [
              {
                type: "hook",
                title: () => "What do you notice?",
                body: (v) => `Look at this pattern. What happens to **${v.numA}** each time we multiply by 10?`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `${v.numA} × 1 = ${v.numA}` },
                      { text: `${v.numA} × 10 = ${v.x10}` },
                      { text: `${v.numA} × 100 = ${v.x100}` }
                    ]
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "The digits shift left!",
                body: (v) => `Every time you multiply by **10**, the digits move one place to the left. That's why a zero appears at the end! Tap to see the pattern grow.`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `${v.numA} × 10 = ${v.x10}`, why: "One zero added — digits shift left once" },
                      { text: `${v.numA} × 100 = ${v.x100}`, why: "Two zeros — digits shift left twice" },
                      { text: `${v.numA} × 1000 = ${v.x1000}`, why: "Three zeros — digits shift left three times!" }
                    ]
                  })
                },
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "Spot the pattern!",
                body: (v) => `You've seen the pattern — now use it! What is **${v.numA} × 1000**?`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `${v.numA} × 10 = ${v.x10}` },
                      { text: `${v.numA} × 100 = ${v.x100}` },
                      { text: `${v.numA} × 1000 = ?` }
                    ]
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.numA} × 1000 = ?`,
                  getOptions: (v) => [v.x1000, v.x100, v.numA * 10000, v.x10].sort(() => Math.random() - 0.5),
                  correctAnswer: (v) => v.x1000,
                  feedback: {
                    correct: (v) => `You've got it! ${v.numA} × 1000 = **${v.x1000}**. Three zeros for × 1000!`,
                    incorrect: (v) => `Nearly! ${v.numA} × 1000 = **${v.x1000}**. Count the zeros: × 1000 means three zeros!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The zero shortcut!",
                body: () => `This works every time: **× 10 = one zero**, **× 100 = two zeros**, **× 1000 = three zeros**. The digits just shift left!`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "× 10 → add one zero", why: "5 × 10 = 50" },
                      { text: "× 100 → add two zeros", why: "5 × 100 = 500" },
                      { text: "× 1000 → add three zeros", why: "5 × 1000 = 5000" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          },

          // ---- Lesson 5B: Key Fact ----
          {
            id: "tens-shortcut",
            templateType: "key-fact",
            learningGoal: ["How to multiply by 20, 30, 40 and other multiples of 10", "The split-off-the-10 shortcut"],
            variableSets: [
              {
                name: "Ella", pronoun: "She", scenario: "buying party bags",
                numA: 23, numB: 40, numBBase: 4,
                intermediate: 92, product: 920
              },
              {
                name: "Owen", pronoun: "He", scenario: "counting toy cars in boxes",
                numA: 15, numB: 30, numBBase: 3,
                intermediate: 45, product: 450
              },
              {
                name: "Maya", pronoun: "She", scenario: "planting seeds in rows",
                numA: 31, numB: 20, numBBase: 2,
                intermediate: 62, product: 620
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `${v.numA} × ${v.numB} — is there a shortcut?`,
                body: (v) => `${v.name} is ${v.scenario}. ${v.pronoun} needs **${v.numA} × ${v.numB}**. That looks tricky... but there's a sneaky shortcut!`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `${v.numA} × ${v.numB} = ?`, why: `${v.numB} is just ${v.numBBase} × 10...` }
                    ]
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Split off the 10!",
                body: (v) => `Since **${v.numB} = ${v.numBBase} × 10**, you can do the easy bit first, then add a zero! Tap to see how.`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `${v.numB} = ${v.numBBase} × 10`, why: "Split off the 10" },
                      { text: `${v.numA} × ${v.numBBase} = ${v.intermediate}`, why: "Do the easy multiplication first" },
                      { text: `${v.intermediate} × 10 = ${v.product}`, result: `${v.numA} × ${v.numB} = ${v.product}!` }
                    ]
                  })
                },
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "Your turn!",
                body: (v) => `**${v.numA} × ${v.numBBase} = ${v.intermediate}**. Now multiply by 10 to get ${v.numA} × ${v.numB}!`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `${v.numA} × ${v.numBBase} = ${v.intermediate}` },
                      { text: `${v.intermediate} × 10 = ?` }
                    ]
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.numA} × ${v.numB} = ?`,
                  getOptions: (v) => generateDistractors(v.product),
                  correctAnswer: (v) => v.product,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.numA} × ${v.numB} = **${v.product}**. The shortcut works perfectly!`,
                    incorrect: (v) => `Nearly! ${v.intermediate} × 10 = **${v.product}**. Multiply by the digit, then add the zero!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The tens shortcut!",
                body: () => `Multiplying by 20, 30, 40 etc.? **Split off the 10**, do the easy multiplication, then **add the zero** back. Works every time!`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "e.g. 23 × 40", why: "Looks hard..." },
                      { text: "23 × 4 = 92", why: "Do the easy bit" },
                      { text: "92 × 10 = 920", result: "Add the zero — done!" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      },

      // ==========================================
      // SUB-CONCEPT 6: Word Problem Setup
      // ==========================================
      {
        id: "word-problems",
        name: "Multiplication Word Problems",
        category: "other",
        lessons: [
          // ---- Lesson 6A: Curiosity Hook ----
          {
            id: "word-problems-clues",
            templateType: "curiosity-hook",
            learningGoal: ["How to spot multiplication in word problems", "Clue words like 'each', 'every', 'per'"],
            variableSets: [
              {
                scenario: "A box holds 24 biscuits. Mrs Chen buys 15 boxes for the school fair.",
                question: "How many biscuits does Mrs Chen have?",
                numA: 24, numB: 15, product: 360, unit: "biscuits",
                clueWord: "each box holds"
              },
              {
                scenario: "There are 32 children in each class. The school has 12 classes.",
                question: "How many children are in the school?",
                numA: 32, numB: 12, product: 384, unit: "children",
                clueWord: "in each class"
              },
              {
                scenario: "Each pack of felt tips has 18 pens. Sam buys 14 packs.",
                question: "How many felt tips does Sam have?",
                numA: 18, numB: 14, product: 252, unit: "felt tips",
                clueWord: "each pack"
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "What would you do?",
                body: (v) => `Here's a problem: *${v.scenario}* ${v.question}. What calculation would you use?`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: v.scenario, why: "What operation do we need?" }
                    ]
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Spot the clue words!",
                body: (v) => `The words **"${v.clueWord}"** tell you that every group has the same amount. Same amount per group = **multiply**! So it's ${v.numA} × ${v.numB}.`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `"each" / "every" / "per" = MULTIPLY`, why: "These are your clue words!" },
                      { text: `${v.numA} groups of ${v.numB}`, why: "Same amount in each group" },
                      { text: `${v.numA} × ${v.numB} = ${v.product}`, result: `${v.product} ${v.unit}!` }
                    ]
                  })
                },
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "Which calculation?",
                body: (v) => `*${v.scenario}* Which calculation solves this?`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `Look for the clue word: "${v.clueWord}"`, why: "Same amount in each group = multiply" }
                    ]
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `Which calculation gives the answer?`,
                  getOptions: (v) => [
                    `${v.numA} × ${v.numB} = ${v.product}`,
                    `${v.numA} + ${v.numB} = ${v.numA + v.numB}`,
                    `${v.numA} - ${v.numB} = ${v.numA - v.numB}`,
                    `${v.numA} ÷ ${v.numB} = ${Math.round(v.numA / v.numB)}`
                  ],
                  correctAnswer: (v) => `${v.numA} × ${v.numB} = ${v.product}`,
                  feedback: {
                    correct: (v) => `Spot on! "${v.clueWord}" means multiply. ${v.numA} × ${v.numB} = **${v.product} ${v.unit}**!`,
                    incorrect: (v) => `Not this time! The word "${v.clueWord}" tells us to **multiply**: ${v.numA} × ${v.numB} = **${v.product}**!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Your multiplication clue words!",
                body: () => `Next time you see a word problem, look for these magic words — they almost always mean **multiply**!`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "\"each\" — 24 in each box", why: "Same amount per group → multiply" },
                      { text: "\"every\" — every row has 16", why: "Repeated equal groups → multiply" },
                      { text: "\"per\" — 5 goals per match", why: "A rate → multiply" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          },

          // ---- Lesson 6B: Spot the Mistake ----
          {
            id: "word-problems-mistake",
            templateType: "spot-the-mistake",
            learningGoal: ["The difference between adding and multiplying", "When a word problem needs multiplication, not addition"],
            variableSets: [
              {
                name: "Alfie",
                scenario: "There are 16 rows of chairs with 22 chairs in each row.",
                numA: 16, numB: 22, product: 352,
                wrongAnswer: 38, wrongOperation: "16 + 22 = 38",
                unit: "chairs"
              },
              {
                name: "Grace",
                scenario: "Each tray holds 25 sandwiches and there are 13 trays.",
                numA: 25, numB: 13, product: 325,
                wrongAnswer: 38, wrongOperation: "25 + 13 = 38",
                unit: "sandwiches"
              },
              {
                name: "Theo",
                scenario: "A car park has 18 rows with 24 spaces in each row.",
                numA: 18, numB: 24, product: 432,
                wrongAnswer: 42, wrongOperation: "18 + 24 = 42",
                unit: "spaces"
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `Can you spot ${v.name}'s mistake?`,
                body: (v) => `*${v.scenario}* ${v.name} says there are **${v.wrongAnswer} ${v.unit}**. That doesn't seem right...`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `${v.name}'s working: ${v.wrongOperation}`, why: "Hmm — what did they do wrong?" }
                    ]
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Add or multiply?",
                body: (v) => `${v.name} **added** instead of **multiplying**! "In each row" means every row has the same amount — that's multiplication, not addition.`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `✗ ${v.name}: ${v.wrongOperation}`, why: "Added instead of multiplying" },
                      { text: `✓ Should be: ${v.numA} × ${v.numB}`, why: "'Each row' = same amount = multiply" },
                      { text: `${v.numA} × ${v.numB} = ${v.product}`, result: `${v.product} ${v.unit}!` }
                    ]
                  })
                },
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "What's the correct total?",
                body: (v) => `Now you know it's **${v.numA} × ${v.numB}**, what's the right number of ${v.unit}?`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `✗ Not: ${v.wrongOperation}` },
                      { text: `✓ Correct: ${v.numA} × ${v.numB} = ?` }
                    ]
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.numA} × ${v.numB} = ?`,
                  getOptions: (v) => generateDistractors(v.product),
                  correctAnswer: (v) => v.product,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.numA} × ${v.numB} = **${v.product} ${v.unit}**. Much more than ${v.wrongAnswer}!`,
                    incorrect: (v) => `Nearly! ${v.numA} × ${v.numB} = **${v.product}**. That's a lot more than the ${v.wrongAnswer} you get from adding!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Add vs multiply — know the difference!",
                body: () => `Adding gives you a total of **different things**. Multiplying gives you a total of **equal groups**. Look for the clue words!`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "\"3 apples AND 5 oranges\" → ADD (3 + 5)", why: "Different things combined" },
                      { text: "\"3 bags of 5 apples EACH\" → MULTIPLY (3 × 5)", why: "Equal groups repeated" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      },

      // ==========================================
      // SUB-CONCEPT 7: Checking Answers
      // ==========================================
      {
        id: "checking-answers",
        name: "Checking Your Answers",
        category: "other",
        lessons: [
          // ---- Lesson 7A: Spot the Mistake ----
          {
            id: "checking-estimate",
            templateType: "spot-the-mistake",
            learningGoal: ["How to check your multiplication using estimation", "Using estimation to catch big mistakes"],
            variableSets: [
              {
                name: "Kayla", numA: 24, numB: 13, product: 312,
                wrongProduct: 932, roundA: 20, roundB: 10, estimate: 200,
                numATens: 20, numAOnes: 4, numBTens: 10, numBOnes: 3
              },
              {
                name: "Jack", numA: 35, numB: 16, product: 560,
                wrongProduct: 5600, roundA: 40, roundB: 20, estimate: 800,
                numATens: 30, numAOnes: 5, numBTens: 10, numBOnes: 6
              },
              {
                name: "Ava", numA: 19, numB: 22, product: 418,
                wrongProduct: 41, roundA: 20, roundB: 20, estimate: 400,
                numATens: 10, numAOnes: 9, numBTens: 20, numBOnes: 2
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `Does ${v.wrongProduct} look right?`,
                body: (v) => `${v.name} says **${v.numA} × ${v.numB} = ${v.wrongProduct}**. Before we do any working, does that answer even make sense?`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `${v.name}'s answer: ${v.numA} × ${v.numB} = ${v.wrongProduct}`, why: "Does this feel right?" }
                    ]
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Quick estimate to the rescue!",
                body: (v) => `Let's estimate: **${v.roundA} × ${v.roundB} = ${v.estimate}**. The answer should be near ${v.estimate} — but ${v.name} got ${v.wrongProduct}. Way off!`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `Estimate: ${v.roundA} × ${v.roundB} = ${v.estimate}`, why: "Quick check using rounded numbers" },
                      { text: `${v.name}'s answer: ${v.wrongProduct}`, why: `Should be near ${v.estimate}, not ${v.wrongProduct}!` },
                      { text: `Something went wrong — time to redo it!`, result: "Estimation saved us!" }
                    ]
                  })
                },
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "What's the real answer?",
                body: (v) => `The estimate is about **${v.estimate}**. Use the grid to find the exact answer!`,
                visual: {
                  component: "GridModel",
                  props: (v) => ({
                    rows: 2,
                    cols: 2,
                    headers: { cols: [v.numBTens, v.numBOnes], rows: [v.numATens, v.numAOnes] },
                    cells: [
                      [v.numATens * v.numBTens, v.numATens * v.numBOnes],
                      [v.numAOnes * v.numBTens, v.numAOnes * v.numBOnes]
                    ],
                    showValues: true,
                    showTotal: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.numA} × ${v.numB} = ?`,
                  getOptions: (v) => generateDistractors(v.product),
                  correctAnswer: (v) => v.product,
                  feedback: {
                    correct: (v) => `You nailed it! ${v.numA} × ${v.numB} = **${v.product}**. Close to our estimate of ${v.estimate} ✓`,
                    incorrect: (v) => `Nearly! ${v.numA} × ${v.numB} = **${v.product}**. Add up all four cells in the grid!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Always estimate to check!",
                body: () => `A quick estimate takes 5 seconds and catches big mistakes. **Round, multiply, compare** — make it a habit!`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Do your multiplication" },
                      { text: "Quick estimate: round both numbers, multiply" },
                      { text: "Is your answer close to the estimate? ✓ You're good!" },
                      { text: "Way off? Check your working again!" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          },

          // ---- Lesson 7B: Step by Step ----
          {
            id: "checking-division",
            templateType: "step-by-step",
            learningGoal: ["How to check your multiplication using division", "Multiplication and division are opposites"],
            variableSets: [
              { numA: 24, numB: 13, product: 312 },
              { numA: 35, numB: 14, product: 490 },
              { numA: 18, numB: 22, product: 396 }
            ],
            screens: [
              {
                type: "hook",
                title: () => "How can you be 100% sure?",
                body: (v) => `You've worked out **${v.numA} × ${v.numB} = ${v.product}**. But how can you check that's definitely right? There's a brilliant trick using the **opposite operation**!`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `${v.numA} × ${v.numB} = ${v.product}`, why: "Is this correct? Let's check!" }
                    ]
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Division checks multiplication!",
                body: (v) => `If ${v.numA} × ${v.numB} really equals ${v.product}, then **${v.product} ÷ ${v.numB}** should give you back **${v.numA}**. Tap to see!`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `We think: ${v.numA} × ${v.numB} = ${v.product}`, why: "Let's verify with division" },
                      { text: `Check: ${v.product} ÷ ${v.numB} = ?`, why: `If we get ${v.numA}, it's correct!` },
                      { text: `${v.product} ÷ ${v.numB} = ${v.numA} ✓`, result: "It works! Our multiplication was right!" }
                    ]
                  })
                },
                interaction: { type: "tap-to-reveal" }
              },
              {
                type: "interact",
                title: () => "You try the check!",
                body: (v) => `If **${v.numA} × ${v.numB} = ${v.product}**, what should **${v.product} ÷ ${v.numB}** give you?`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `${v.numA} × ${v.numB} = ${v.product}`, why: "Now divide to check..." }
                    ]
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `${v.product} ÷ ${v.numB} = ?`,
                  getOptions: (v) => generateDistractors(v.numA),
                  correctAnswer: (v) => v.numA,
                  feedback: {
                    correct: (v) => `Amazing! ${v.product} ÷ ${v.numB} = **${v.numA}**. Division and multiplication are perfect partners!`,
                    incorrect: (v) => `Nearly! ${v.product} ÷ ${v.numB} = **${v.numA}**. Division undoes multiplication — you should get back the original number!`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Multiply ↔ Divide!",
                body: () => `Multiplication and division are **opposites** — they undo each other. Use division to check any multiplication, and you'll never hand in a wrong answer!`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "If 6 × 8 = 48...", why: "...then 48 ÷ 8 should = 6" },
                      { text: "If 12 × 5 = 60...", why: "...then 60 ÷ 5 should = 12" },
                      { text: "They undo each other!", result: "Use one to check the other!" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      }
    ]
  },

  // ============================================================
  // MASTER METHOD LESSONS — All 15 Topics
  // ============================================================
  fractions: {
    name: "Fractions",
    subConcepts: [
      {
        id: "master-adding-fractions",
        name: "Adding Fractions with Different Denominators",
        category: "master",
        lessons: [
          {
            id: "master-add-fractions-full",
            templateType: "master-method",
            learningGoal: [
              "How to find a common denominator (the bottom number) for two fractions",
              "How to convert fractions so they share the same denominator (bottom number)",
              "How to add the numerators (top numbers) and simplify the result"
            ],
            variableSets: [
              {
                name: "Aisha", scenario: "is sharing a pizza with her family. She eats one piece and her brother eats another",
                fracA_num: 1, fracA_den: 3, fracB_num: 1, fracB_den: 4,
                commonDen: 12, newA_num: 4, newB_num: 3,
                resultNum: 7, resultDen: 12,
                simplifiedNum: 7, simplifiedDen: 12, canSimplify: false,
                unit: "of the pizza",
                fracA_label: "1/3", fracB_label: "1/4",
                newA_label: "4/12", newB_label: "3/12",
                result_label: "7/12", simplified_label: "7/12"
              },
              {
                name: "Ben", scenario: "is baking a cake. He uses some flour from one bag and some from another",
                fracA_num: 1, fracA_den: 2, fracB_num: 1, fracB_den: 5,
                commonDen: 10, newA_num: 5, newB_num: 2,
                resultNum: 7, resultDen: 10,
                simplifiedNum: 7, simplifiedDen: 10, canSimplify: false,
                unit: "of a kilogram",
                fracA_label: "1/2", fracB_label: "1/5",
                newA_label: "5/10", newB_label: "2/10",
                result_label: "7/10", simplified_label: "7/10"
              },
              {
                name: "Charlie", scenario: "is cutting ribbons for a school art project. He uses part of one ribbon and part of another",
                fracA_num: 2, fracA_den: 3, fracB_num: 1, fracB_den: 6,
                commonDen: 6, newA_num: 4, newB_num: 1,
                resultNum: 5, resultDen: 6,
                simplifiedNum: 5, simplifiedDen: 6, canSimplify: false,
                unit: "of a metre",
                fracA_label: "2/3", fracB_label: "1/6",
                newA_label: "4/6", newB_label: "1/6",
                result_label: "5/6", simplified_label: "5/6"
              },
              {
                name: "Daisy", scenario: "is pouring juice into a jug. She pours some from one carton and some from another",
                fracA_num: 1, fracA_den: 4, fracB_num: 1, fracB_den: 5,
                commonDen: 20, newA_num: 5, newB_num: 4,
                resultNum: 9, resultDen: 20,
                simplifiedNum: 9, simplifiedDen: 20, canSimplify: false,
                unit: "of a litre",
                fracA_label: "1/4", fracB_label: "1/5",
                newA_label: "5/20", newB_label: "4/20",
                result_label: "9/20", simplified_label: "9/20"
              },
              {
                name: "Ella", scenario: "is reading a book. She reads some pages before lunch and more after lunch",
                fracA_num: 1, fracA_den: 3, fracB_num: 1, fracB_den: 6,
                commonDen: 6, newA_num: 2, newB_num: 1,
                resultNum: 3, resultDen: 6,
                simplifiedNum: 1, simplifiedDen: 2, canSimplify: true,
                unit: "of the book",
                fracA_label: "1/3", fracB_label: "1/6",
                newA_label: "2/6", newB_label: "1/6",
                result_label: "3/6", simplified_label: "1/2"
              },
              {
                name: "Finn", scenario: "is mixing paint for an art lesson. He uses some red paint and some blue paint",
                fracA_num: 3, fracA_den: 4, fracB_num: 1, fracB_den: 8,
                commonDen: 8, newA_num: 6, newB_num: 1,
                resultNum: 7, resultDen: 8,
                simplifiedNum: 7, simplifiedDen: 8, canSimplify: false,
                unit: "of a pot",
                fracA_label: "3/4", fracB_label: "1/8",
                newA_label: "6/8", newB_label: "1/8",
                result_label: "7/8", simplified_label: "7/8"
              },
              {
                name: "Grace", scenario: "is filling a water bottle. She fills some at the tap and tops it up at the fountain",
                fracA_num: 2, fracA_den: 5, fracB_num: 1, fracB_den: 4,
                commonDen: 20, newA_num: 8, newB_num: 5,
                resultNum: 13, resultDen: 20,
                simplifiedNum: 13, simplifiedDen: 20, canSimplify: false,
                unit: "of the bottle",
                fracA_label: "2/5", fracB_label: "1/4",
                newA_label: "8/20", newB_label: "5/20",
                result_label: "13/20", simplified_label: "13/20"
              },
              // --- Level 3: Improper fraction results ---
              {
                name: "Hamza", scenario: "is pouring orange squash. He fills one glass then tops up another",
                fracA_num: 5, fracA_den: 6, fracB_num: 3, fracB_den: 8,
                commonDen: 24, newA_num: 20, newB_num: 9,
                resultNum: 29, resultDen: 24,
                simplifiedNum: 29, simplifiedDen: 24, canSimplify: false,
                isImproper: true, wholeNum: 1, remainderNum: 5,
                mixed_label: "1 5/24",
                unit: "of a litre",
                fracA_label: "5/6", fracB_label: "3/8",
                newA_label: "20/24", newB_label: "9/24",
                result_label: "29/24", simplified_label: "1 5/24",
                difficulty: 2
              },
              {
                name: "Maisie", scenario: "is measuring flour. She scoops some from one bag and some from another",
                fracA_num: 3, fracA_den: 4, fracB_num: 2, fracB_den: 3,
                commonDen: 12, newA_num: 9, newB_num: 8,
                resultNum: 17, resultDen: 12,
                simplifiedNum: 17, simplifiedDen: 12, canSimplify: false,
                isImproper: true, wholeNum: 1, remainderNum: 5,
                mixed_label: "1 5/12",
                unit: "of a kilogram",
                fracA_label: "3/4", fracB_label: "2/3",
                newA_label: "9/12", newB_label: "8/12",
                result_label: "17/12", simplified_label: "1 5/12",
                difficulty: 2
              },
              {
                name: "Lucas", scenario: "is painting a fence. He paints a section before lunch and more after lunch",
                fracA_num: 4, fracA_den: 5, fracB_num: 5, fracB_den: 8,
                commonDen: 40, newA_num: 32, newB_num: 25,
                resultNum: 57, resultDen: 40,
                simplifiedNum: 57, simplifiedDen: 40, canSimplify: false,
                isImproper: true, wholeNum: 1, remainderNum: 17,
                mixed_label: "1 17/40",
                unit: "of the fence",
                fracA_label: "4/5", fracB_label: "5/8",
                newA_label: "32/40", newB_label: "25/40",
                result_label: "57/40", simplified_label: "1 17/40",
                difficulty: 2
              }
            ],
            screens: [
              // ---- Screen 1: HOOK — Setup the scenario ----
              {
                type: "hook",
                title: (v) => `Let's add ${v.fracA_label} + ${v.fracB_label}!`,
                body: (v) => `${v.name} ${v.scenario}.\nThat's **${v.fracA_label}** ${v.unit} and **${v.fracB_label}** ${v.unit}. How much altogether?\n\nIn a fraction, the **denominator (the bottom number)** tells us how many **equal parts** the whole is split into. Here the denominators are **${v.fracA_den}** and **${v.fracB_den}** — they're different! So we need to make them the **same** before we can add.`,
                visual: {
                  component: "BarModel",
                  props: (v) => ({
                    segments: Array.from({ length: v.fracA_den }, (_, i) => ({
                      value: 1,
                      label: i === 0 ? v.fracA_label : "",
                      color: i < v.fracA_num ? "#c084fc" : "#e5e7eb",
                      empty: i >= v.fracA_num
                    })),
                    totalLabel: `First amount: ${v.fracA_label} ${v.unit}`,
                    showValues: true,
                    comparison: Array.from({ length: v.fracB_den }, (_, i) => ({
                      value: 1,
                      label: i === 0 ? v.fracB_label : "",
                      color: i < v.fracB_num ? "#818cf8" : "#e5e7eb",
                      empty: i >= v.fracB_num
                    })),
                    comparisonLabel: `Second amount: ${v.fracB_label} ${v.unit}`
                  })
                },
                interaction: null
              },
              // ---- Screen 2: TEACH — Find common denominator & convert ----
              {
                type: "teach",
                title: () => "Step 1: Find a common denominator (bottom number)",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `We need both fractions to have the **same denominator (bottom number)**.\n\nThe denominators are **${v.fracA_den}** and **${v.fracB_den}**. We need a number that both **${v.fracA_den}** and **${v.fracB_den}** go into.\n\nThe golden rule: **whatever you do to the bottom, you do to the top!**`
                  },
                  {
                    type: 'visual',
                    component: 'BarModel',
                    props: (v) => ({
                      segments: Array.from({ length: v.fracA_den }, (_, i) => ({
                        value: 1,
                        label: i < v.fracA_num ? `${v.fracA_num}/${v.fracA_den}` : "",
                        color: i < v.fracA_num ? "#c084fc" : "#e5e7eb",
                        empty: i >= v.fracA_num
                      })),
                      totalLabel: `${v.fracA_label} — split into ${v.fracA_den} equal parts, ${v.fracA_num} shaded`,
                      showValues: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `The **lowest common denominator (the smallest number both denominators divide into evenly)** is **${v.commonDen}**.\n\nNow convert the first fraction: **${v.fracA_label}** = **${v.newA_label}**\nThese are **equivalent fractions (fractions that are worth the same)** — we just multiplied the top and bottom by **${v.commonDen / v.fracA_den}**.`
                  },
                  {
                    type: 'visual',
                    component: 'BarModel',
                    props: (v) => ({
                      segments: Array.from({ length: v.commonDen }, (_, i) => ({
                        value: 1,
                        label: "",
                        color: i < v.newA_num ? "#c084fc" : "#e5e7eb",
                        empty: i >= v.newA_num
                      })),
                      totalLabel: `${v.fracA_label} = ${v.newA_label} — same amount, smaller pieces`,
                      showValues: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Now convert the second fraction: **${v.fracB_label}** = **${v.newB_label}**\n(Multiply top and bottom by **${v.commonDen / v.fracB_den}** — remember, whatever you do to the bottom, you do to the top!)`
                  },
                  {
                    type: 'visual',
                    component: 'BarModel',
                    props: (v) => ({
                      segments: Array.from({ length: v.commonDen }, (_, i) => ({
                        value: 1,
                        label: "",
                        color: i < v.newB_num ? "#818cf8" : "#e5e7eb",
                        empty: i >= v.newB_num
                      })),
                      totalLabel: `${v.fracB_label} = ${v.newB_label} — same amount, smaller pieces`,
                      showValues: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Both fractions now have the same **denominator (bottom number)**: **${v.commonDen}** ✓\n\nThese are **equivalent fractions (fractions that are worth the same)** — we just split the bars into smaller pieces.`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 3: TEACH — Add numerators & simplify ----
              {
                type: "teach",
                title: () => "Step 2: Add the numerators (top numbers)",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Now both fractions have the **same denominator (bottom number)**: **${v.commonDen}**. We just add the **numerators (top numbers)**:\n\n**${v.newA_num}** + **${v.newB_num}** = **${v.resultNum}**`
                  },
                  // For proper fractions: show comparison BarModel; for improper: use WorkedExample
                  ...(v.isImproper ? [] : [
                    {
                      type: 'visual',
                      component: 'BarModel',
                      props: (v) => ({
                        segments: Array.from({ length: v.commonDen }, (_, i) => ({
                          value: 1,
                          label: "",
                          color: i < v.newA_num ? "#c084fc" : "#e5e7eb",
                          empty: i >= v.newA_num
                        })),
                        totalLabel: `First fraction: ${v.fracA_label} = ${v.newA_label}`,
                        showValues: true,
                        comparison: Array.from({ length: v.commonDen }, (_, i) => ({
                          value: 1,
                          label: "",
                          color: i < v.newB_num ? "#818cf8" : "#e5e7eb",
                          empty: i >= v.newB_num
                        })),
                        comparisonLabel: `Second fraction: ${v.fracB_label} = ${v.newB_label}`
                      })
                    }
                  ]),
                  {
                    type: 'text',
                    content: (v) => `So **${v.newA_label} + ${v.newB_label} = ${v.result_label}**\n\nThe **denominator (bottom number)** stays the same — we only add the **numerators (top numbers)**!`
                  },
                  // For proper: show combined BarModel. For improper: explain the conversion
                  ...(v.isImproper ? [
                    {
                      type: 'text',
                      content: (v) => `Wait — **${v.resultNum}** is bigger than **${v.resultDen}**! That's an **improper fraction** — it's more than one whole.\n\nTo convert: **${v.resultNum} ÷ ${v.resultDen} = ${v.wholeNum}** whole with **${v.remainderNum}** left over.\n\nSo **${v.result_label} = ${v.mixed_label}** ✓`
                    },
                    {
                      type: 'visual',
                      component: 'WorkedExample',
                      props: (v) => ({
                        steps: [
                          { text: `${v.fracA_label} + ${v.fracB_label}`, why: "The original fractions" },
                          { text: `= ${v.newA_label} + ${v.newB_label}`, why: `Common denominator: ${v.commonDen}` },
                          { text: `= ${v.result_label}`, why: "Add the numerators" },
                          { text: `= ${v.mixed_label}`, why: `${v.resultNum} ÷ ${v.resultDen} = ${v.wholeNum} r ${v.remainderNum}`, result: `${v.name} used ${v.mixed_label} ${v.unit} altogether` }
                        ],
                        allRevealed: true
                      })
                    }
                  ] : [
                    {
                      type: 'visual',
                      component: 'BarModel',
                      props: (v) => ({
                        segments: Array.from({ length: v.commonDen }, (_, i) => ({
                          value: 1,
                          label: "",
                          color: i < v.resultNum ? "#34d399" : "#e5e7eb",
                          empty: i >= v.resultNum
                        })),
                        totalLabel: `Combined: ${v.result_label} ${v.unit}`,
                        showValues: true
                      })
                    },
                    {
                      type: 'text',
                      content: (v) => {
                        if (v.canSimplify) {
                          return `Can we **simplify** (make the fraction smaller but worth the same)?\nYes! Both **${v.resultNum}** and **${v.resultDen}** divide by **${v.resultNum / v.simplifiedNum}**.\n\n**${v.result_label}** = **${v.simplified_label}** ✓`;
                        }
                        return `Can we **simplify** (make the fraction smaller but worth the same)?\n**${v.resultNum}** and **${v.resultDen}** share no common factors, so **${v.result_label}** is already simplest ✓`;
                      }
                    },
                    {
                      type: 'visual',
                      component: 'WorkedExample',
                      props: (v) => ({
                        steps: [
                          { text: `${v.fracA_label} + ${v.fracB_label}`, why: "The original fractions" },
                          { text: `= ${v.newA_label} + ${v.newB_label}`, why: `Common denominator: ${v.commonDen}`, result: `= ${v.result_label}` },
                          ...(v.canSimplify ? [{ text: `= ${v.simplified_label}`, why: "Simplified", result: `${v.name} used ${v.simplified_label} ${v.unit} altogether` }] : [{ text: `= ${v.result_label}`, result: `${v.name} used ${v.result_label} ${v.unit} altogether` }])
                        ],
                        allRevealed: true
                      })
                    }
                  ]),
                  {
                    type: 'text',
                    content: (v) => `The answer is **${v.simplified_label}** ${v.unit} ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 4: INTERACT — MC question ----
              {
                type: "interact",
                title: () => "Your turn!",
                body: (v) => `${v.name} ${v.scenario}.\nWhat is **${v.fracA_label} + ${v.fracB_label}**? Give your answer in its simplest form.\n\nRemember: find the common **denominator (bottom number)**, convert, add the **numerators (top numbers)**, then **simplify (make the numbers smaller but keep the same value)** if you can!`,
                visual: {
                  component: "BarModel",
                  props: (v) => ({
                    segments: Array.from({ length: v.fracA_den }, (_, i) => ({
                      value: 1,
                      label: i === 0 ? v.fracA_label : "",
                      color: i < v.fracA_num ? "#c084fc" : "#e5e7eb",
                      empty: i >= v.fracA_num
                    })),
                    totalLabel: null,
                    showValues: true,
                    comparison: Array.from({ length: v.fracB_den }, (_, i) => ({
                      value: 1,
                      label: i === 0 ? v.fracB_label : "",
                      color: i < v.fracB_num ? "#818cf8" : "#e5e7eb",
                      empty: i >= v.fracB_num
                    })),
                    comparisonLabel: "Add these together!"
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What is ${v.fracA_label} + ${v.fracB_label}? Give your answer in its simplest form.`,
                  getOptions: (v) => {
                    // Generate fraction distractors manually since generateDistractors is for integers
                    const correct = v.simplified_label;
                    const options = new Set([correct]);
                    if (v.isImproper) {
                      // Distractors for improper/mixed results
                      const wd = v.simplifiedDen;
                      options.add(`${v.resultNum}/${v.resultDen}`); // forgot to convert
                      options.add(`1 ${Math.max(1, v.remainderNum - 1)}/${wd}`);
                      options.add(`1 ${v.remainderNum + 1}/${wd}`);
                      options.add(`${v.fracA_num + v.fracB_num}/${v.fracA_den + v.fracB_den}`); // added denoms too
                      if (options.size < 5) options.add(`2 ${v.remainderNum}/${wd}`);
                    } else {
                      // Common wrong answers: wrong numerator, forgot to simplify, added denominators too
                      const wrongNumerators = [v.simplifiedNum + 1, v.simplifiedNum - 1, v.simplifiedNum + 2, v.fracA_num + v.fracB_num];
                      const wrongDenominators = [v.simplifiedDen, v.fracA_den + v.fracB_den, v.commonDen, v.simplifiedDen * 2];
                      for (let i = 0; i < wrongNumerators.length && options.size < 5; i++) {
                        const wn = wrongNumerators[i];
                        const wd = wrongDenominators[i] || v.simplifiedDen;
                        if (wn > 0 && wn < wd) {
                          options.add(`${wn}/${wd}`);
                        }
                      }
                      // Fill remaining with nearby fractions
                      const fillers = [`${v.fracA_num}/${v.commonDen}`, `${v.fracB_num}/${v.commonDen}`, `${v.resultNum + 1}/${v.resultDen}`, `${Math.max(1, v.resultNum - 1)}/${v.resultDen}`];
                      for (const f of fillers) {
                        if (options.size >= 5) break;
                        const parts = f.split('/');
                        if (parseInt(parts[0]) > 0 && parseInt(parts[0]) < parseInt(parts[1])) {
                          options.add(f);
                        }
                      }
                    }
                    return [...options].sort(() => Math.random() - 0.5);
                  },
                  correctAnswer: (v) => v.simplified_label,
                  feedback: {
                    correct: (v) => `Brilliant! **${v.fracA_label} + ${v.fracB_label} = ${v.simplified_label}** ${v.unit}. You nailed it! ✓`,
                    incorrect: (v) => `Not quite! The common denominator (bottom number) is **${v.commonDen}**, so ${v.fracA_label} = ${v.newA_label} and ${v.fracB_label} = ${v.newB_label}. Then add the numerators (top numbers): ${v.newA_num} + ${v.newB_num} = **${v.resultNum}**, giving **${v.simplified_label}**.`
                  }
                }
              },
              // ---- Screen 5: CONSOLIDATE — Summary recipe ----
              {
                type: "consolidate",
                title: () => "The recipe for adding fractions!",
                body: () => `Whenever the **denominators (bottom numbers)** are different, follow these steps. Works every single time:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Step 1: Find the lowest common denominator", why: "The smallest number both bottom numbers divide into evenly" },
                      { text: "Step 2: Convert both fractions", why: "Whatever you do to the bottom, you do to the top! Make equivalent fractions (fractions worth the same) with the new denominator" },
                      { text: "Step 3: Add the numerators (top numbers)", why: "The denominators stay the same — only the top numbers get added!" },
                      { text: "Step 4: Simplify if you can", why: "Divide the top and bottom by any common factor (a number that divides evenly into both) to get the simplest form ✓" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      }
    ,
      ...fractionsSubConcepts
    ]
  },

  // TOPIC: Decimals
  decimals: {
    name: "Decimals",
    subConcepts: [
      {
        id: "master-column-addition-decimals",
        name: "Column Addition of Decimals",
        category: "master",
        lessons: [
          {
            id: "master-decimal-addition-full",
            templateType: "master-method",
            learningGoal: [
              "How to line up decimal points when adding",
              "How to add column by column from right to left",
              "How to carry digits when a column adds to 10 or more"
            ],
            variableSets: [
              {
                name: "Aisha", scenario: "is buying a book and a pen from the school book fair",
                numA: 3.45, numB: 2.78, sum: 6.23,
                unit: "\u00a3", unitAfter: "",
                numA_str: "3.45", numB_str: "2.78", sum_str: "6.23",
                // Digit breakdown: O . t h
                numA_digits: [3, ".", 4, 5],
                numB_digits: [2, ".", 7, 8],
                sum_digits:  [6, ".", 2, 3],
                // Column-by-column working (right to left)
                h_add: "5 + 8 = 13", h_write: 3, h_carry: 1,
                t_add: "4 + 7 + 1 = 12", t_write: 2, t_carry: 1,
                o_add: "3 + 2 + 1 = 6", o_write: 6, o_carry: 0,
                columns: ["Ones", ".", "Tenths", "Hundredths"]
              },
              {
                name: "Ben", scenario: "is timing two laps of the school running track and adding them together",
                numA: 1.56, numB: 2.37, sum: 3.93,
                unit: "", unitAfter: " minutes",
                numA_str: "1.56", numB_str: "2.37", sum_str: "3.93",
                numA_digits: [1, ".", 5, 6],
                numB_digits: [2, ".", 3, 7],
                sum_digits:  [3, ".", 9, 3],
                h_add: "6 + 7 = 13", h_write: 3, h_carry: 1,
                t_add: "5 + 3 + 1 = 9", t_write: 9, t_carry: 0,
                o_add: "1 + 2 = 3", o_write: 3, o_carry: 0,
                columns: ["Ones", ".", "Tenths", "Hundredths"]
              },
              {
                name: "Charlie", scenario: "is measuring two pieces of wood to find the total length",
                numA: 4.62, numB: 3.89, sum: 8.51,
                unit: "", unitAfter: " metres",
                numA_str: "4.62", numB_str: "3.89", sum_str: "8.51",
                numA_digits: [4, ".", 6, 2],
                numB_digits: [3, ".", 8, 9],
                sum_digits:  [8, ".", 5, 1],
                h_add: "2 + 9 = 11", h_write: 1, h_carry: 1,
                t_add: "6 + 8 + 1 = 15", t_write: 5, t_carry: 1,
                o_add: "4 + 3 + 1 = 8", o_write: 8, o_carry: 0,
                columns: ["Ones", ".", "Tenths", "Hundredths"]
              },
              {
                name: "Daisy", scenario: "is adding up prices of two items at the garden centre",
                numA: 5.74, numB: 6.58, sum: 12.32,
                unit: "\u00a3", unitAfter: "",
                numA_str: "5.74", numB_str: "6.58", sum_str: "12.32",
                numA_digits: [0, 5, ".", 7, 4],
                numB_digits: [0, 6, ".", 5, 8],
                sum_digits:  [1, 2, ".", 3, 2],
                h_add: "4 + 8 = 12", h_write: 2, h_carry: 1,
                t_add: "7 + 5 + 1 = 13", t_write: 3, t_carry: 1,
                o_add: "5 + 6 + 1 = 12", o_write: 2, o_carry: 1,
                to_add: "0 + 0 + 1 = 1", to_write: 1,
                columns: ["Tens", "Ones", ".", "Tenths", "Hundredths"]
              },
              {
                name: "Ella", scenario: "is weighing two bags of flour and finding the total weight",
                numA: 2.35, numB: 4.47, sum: 6.82,
                unit: "", unitAfter: " kg",
                numA_str: "2.35", numB_str: "4.47", sum_str: "6.82",
                numA_digits: [2, ".", 3, 5],
                numB_digits: [4, ".", 4, 7],
                sum_digits:  [6, ".", 8, 2],
                h_add: "5 + 7 = 12", h_write: 2, h_carry: 1,
                t_add: "3 + 4 + 1 = 8", t_write: 8, t_carry: 0,
                o_add: "2 + 4 = 6", o_write: 6, o_carry: 0,
                columns: ["Ones", ".", "Tenths", "Hundredths"]
              },
              {
                name: "Finn", scenario: "is adding up two scores in a gymnastics competition",
                numA: 7.85, numB: 8.67, sum: 16.52,
                unit: "", unitAfter: " points",
                numA_str: "7.85", numB_str: "8.67", sum_str: "16.52",
                numA_digits: [0, 7, ".", 8, 5],
                numB_digits: [0, 8, ".", 6, 7],
                sum_digits:  [1, 6, ".", 5, 2],
                h_add: "5 + 7 = 12", h_write: 2, h_carry: 1,
                t_add: "8 + 6 + 1 = 15", t_write: 5, t_carry: 1,
                o_add: "7 + 8 + 1 = 16", o_write: 6, o_carry: 1,
                to_add: "0 + 0 + 1 = 1", to_write: 1,
                columns: ["Tens", "Ones", ".", "Tenths", "Hundredths"]
              },
              {
                name: "Grace", scenario: "is calculating the total distance she walked on two different routes to school",
                numA: 1.83, numB: 2.49, sum: 4.32,
                unit: "", unitAfter: " km",
                numA_str: "1.83", numB_str: "2.49", sum_str: "4.32",
                numA_digits: [1, ".", 8, 3],
                numB_digits: [2, ".", 4, 9],
                sum_digits:  [4, ".", 3, 2],
                h_add: "3 + 9 = 12", h_write: 2, h_carry: 1,
                t_add: "8 + 4 + 1 = 13", t_write: 3, t_carry: 1,
                o_add: "1 + 2 + 1 = 4", o_write: 4, o_carry: 0,
                columns: ["Ones", ".", "Tenths", "Hundredths"]
              },
              // --- Level 3: Cascading carries with two-digit sums ---
              {
                name: "Hannah", scenario: "is adding up two long-jump distances to find her combined total",
                numA: 14.87, numB: 9.56, sum: 24.43, difficulty: 2,
                unit: "", unitAfter: " metres",
                numA_str: "14.87", numB_str: "9.56", sum_str: "24.43",
                numA_digits: [1, 4, ".", 8, 7],
                numB_digits: [0, 9, ".", 5, 6],
                sum_digits:  [2, 4, ".", 4, 3],
                h_add: "7 + 6 = 13", h_write: 3, h_carry: 1,
                t_add: "8 + 5 + 1 = 14", t_write: 4, t_carry: 1,
                o_add: "4 + 9 + 1 = 14", o_write: 4, o_carry: 1,
                to_add: "1 + 0 + 1 = 2", to_write: 2,
                columns: ["Tens", "Ones", ".", "Tenths", "Hundredths"]
              },
              {
                name: "Isla", scenario: "is calculating the total weight of two parcels to post",
                numA: 12.65, numB: 8.78, sum: 21.43, difficulty: 2,
                unit: "", unitAfter: " kg",
                numA_str: "12.65", numB_str: "8.78", sum_str: "21.43",
                numA_digits: [1, 2, ".", 6, 5],
                numB_digits: [0, 8, ".", 7, 8],
                sum_digits:  [2, 1, ".", 4, 3],
                h_add: "5 + 8 = 13", h_write: 3, h_carry: 1,
                t_add: "6 + 7 + 1 = 14", t_write: 4, t_carry: 1,
                o_add: "2 + 8 + 1 = 11", o_write: 1, o_carry: 1,
                to_add: "1 + 0 + 1 = 2", to_write: 2,
                columns: ["Tens", "Ones", ".", "Tenths", "Hundredths"]
              },
              {
                name: "Jack", scenario: "is working out the total bill for two items at a garden centre",
                numA: 17.94, numB: 8.69, sum: 26.63, difficulty: 2,
                unit: "£", unitAfter: "",
                numA_str: "17.94", numB_str: "8.69", sum_str: "26.63",
                numA_digits: [1, 7, ".", 9, 4],
                numB_digits: [0, 8, ".", 6, 9],
                sum_digits:  [2, 6, ".", 6, 3],
                h_add: "4 + 9 = 13", h_write: 3, h_carry: 1,
                t_add: "9 + 6 + 1 = 16", t_write: 6, t_carry: 1,
                o_add: "7 + 8 + 1 = 16", o_write: 6, o_carry: 1,
                to_add: "1 + 0 + 1 = 2", to_write: 2,
                columns: ["Tens", "Ones", ".", "Tenths", "Hundredths"]
              }
            ],
            screens: [
              // ---- Screen 1: HOOK — Setup the scenario ----
              {
                type: "hook",
                title: (v) => `Let's add ${v.unit}${v.numA_str} + ${v.unit}${v.numB_str}!`,
                body: (v) => `${v.name} ${v.scenario}.\nThat's **${v.unit}${v.numA_str}${v.unitAfter}** and **${v.unit}${v.numB_str}${v.unitAfter}**. What's the total?\n\nWe use **column addition** — just like with whole numbers, but with one golden rule: **line up the decimal points!**`,
                visual: {
                  component: "PlaceValueChart",
                  props: (v) => ({
                    columns: v.columns,
                    rows: [
                      { label: v.numA_str, values: v.numA_digits },
                      { label: v.numB_str, values: v.numB_digits }
                    ],
                    highlight: []
                  })
                },
                interaction: null
              },
              // ---- Screen 2: TEACH — Hundredths and tenths columns ----
              {
                type: "teach",
                title: () => "Step 1: Add from the right — hundredths first",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `Always start from the **right-hand side**. Each column shows a **place value** — ones, tenths (1/10), hundredths (1/100). The further right you go, the smaller the pieces.\n\nLine up the decimal points so the columns match perfectly.`
                  },
                  {
                    type: 'visual',
                    component: 'PlaceValueChart',
                    props: (v) => ({
                      columns: v.columns,
                      rows: [
                        { label: v.numA_str, values: v.numA_digits },
                        { label: v.numB_str, values: v.numB_digits }
                      ],
                      highlight: v.columns.length === 5 ? [[0, 4], [1, 4]] : [[0, 3], [1, 3]]
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => {
                      if (v.h_carry > 0) {
                        return `**Hundredths:** ${v.h_add}\nThat's ${v.h_write} and ${v.h_carry} ten to carry. Write **${v.h_write}** in the hundredths column and carry **${v.h_carry}** over to the tenths column.`;
                      }
                      return `**Hundredths:** ${v.h_add}\nWrite **${v.h_write}** in the hundredths column. Nothing to carry!`;
                    }
                  },
                  {
                    type: 'visual',
                    component: 'PlaceValueChart',
                    props: (v) => ({
                      columns: v.columns,
                      rows: [
                        { label: v.numA_str, values: v.numA_digits },
                        { label: v.numB_str, values: v.numB_digits },
                        { label: "Answer", values: v.columns.length === 5 ? ["", "", ".", "", v.h_write] : ["", ".", "", v.h_write] }
                      ],
                      highlight: v.columns.length === 5 ? [[2, 4]] : [[2, 3]],
                      carries: v.h_carry > 0 ? [{ col: v.columns.length === 5 ? 3 : 2, digit: v.h_carry }] : []
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Now the **tenths** column:\n**Tenths:** ${v.t_add}`
                  },
                  {
                    type: 'visual',
                    component: 'PlaceValueChart',
                    props: (v) => ({
                      columns: v.columns,
                      rows: [
                        { label: v.numA_str, values: v.numA_digits },
                        { label: v.numB_str, values: v.numB_digits },
                        { label: "Answer", values: v.columns.length === 5 ? ["", "", ".", v.t_write, v.h_write] : ["", ".", v.t_write, v.h_write] }
                      ],
                      highlight: v.columns.length === 5 ? [[2, 3]] : [[2, 2]],
                      carries: v.t_carry > 0 ? [{ col: v.columns.length === 5 ? 1 : 0, digit: v.t_carry }] : []
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => {
                      if (v.t_carry > 0) {
                        return `Write **${v.t_write}** in the tenths column. Carry **${v.t_carry}** over to the ones column (this carried 1 gets added in the next step) ✓`;
                      }
                      return `Write **${v.t_write}** in the tenths column. Nothing to carry ✓`;
                    }
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 3: TEACH — Ones column (and tens if needed) ----
              {
                type: "teach",
                title: () => "Step 2: Add the ones column",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `Don't forget the **decimal point** in the answer — it goes straight down, perfectly lined up!\n\nNow the **ones** column:`
                  },
                  {
                    type: 'visual',
                    component: 'PlaceValueChart',
                    props: (v) => ({
                      columns: v.columns,
                      rows: [
                        { label: v.numA_str, values: v.numA_digits },
                        { label: v.numB_str, values: v.numB_digits },
                        { label: "Answer", values: v.columns.length === 5 ? ["", "", ".", v.t_write, v.h_write] : ["", ".", v.t_write, v.h_write] }
                      ],
                      highlight: v.columns.length === 5 ? [[0, 1], [1, 1]] : [[0, 0], [1, 0]],
                      carries: v.t_carry > 0 ? [{ col: v.columns.length === 5 ? 1 : 0, digit: v.t_carry }] : []
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**Ones:** ${v.o_add}${v.t_carry > 0 ? " (includes the **1** carried from the tenths column)" : ""}\nWrite **${v.o_write}**.${v.o_carry > 0 ? ` Carry **${v.o_carry}** to the tens column.` : ""}`
                  },
                  {
                    type: 'visual',
                    component: 'PlaceValueChart',
                    props: (v) => ({
                      columns: v.columns,
                      rows: [
                        { label: v.numA_str, values: v.numA_digits },
                        { label: v.numB_str, values: v.numB_digits },
                        { label: "Answer", values: v.sum_digits }
                      ],
                      highlight: v.columns.length === 5 ? [[2, 0], [2, 1]] : [[2, 0]],
                      carries: v.o_carry > 0 ? [{ col: 0, digit: v.o_carry }] : []
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => {
                      if (v.columns.length === 5 && v.to_add) {
                        return `**Tens:** ${v.to_add}\n\nSo the answer carries into the tens column too!`;
                      }
                      return `No more columns to add. We're done!`;
                    }
                  },
                  {
                    type: 'text',
                    content: (v) => `**${v.unit}${v.numA_str} + ${v.unit}${v.numB_str} = ${v.unit}${v.sum_str}${v.unitAfter}** ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 4: INTERACT — MC question ----
              {
                type: "interact",
                title: () => "Your turn!",
                body: (v) => `${v.name} ${v.scenario}.\nWhat is **${v.unit}${v.numA_str} + ${v.unit}${v.numB_str}**?\n\nRemember: line up the decimal points and add from the right!`,
                visual: {
                  component: "PlaceValueChart",
                  props: (v) => ({
                    columns: v.columns,
                    rows: [
                      { label: v.numA_str, values: v.numA_digits },
                      { label: v.numB_str, values: v.numB_digits },
                      { label: "Answer", values: v.columns.length === 5 ? ["?", "?", ".", "?", "?"] : ["?", ".", "?", "?"] }
                    ],
                    highlight: []
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What is ${v.unit}${v.numA_str} + ${v.unit}${v.numB_str}?`,
                  getOptions: (v) => {
                    const correct = v.sum;
                    // Decimal distractors: common mistakes
                    const options = new Set([correct]);
                    // Forgot to carry
                    const noCarry = parseFloat((v.numA + v.numB - (v.h_carry > 0 ? 0.1 : 0)).toFixed(2));
                    if (noCarry > 0 && noCarry !== correct) options.add(noCarry);
                    // Off by 1 in tenths
                    options.add(parseFloat((correct + 0.1).toFixed(2)));
                    options.add(parseFloat((correct - 0.1).toFixed(2)));
                    // Off by 1 in ones
                    options.add(parseFloat((correct + 1).toFixed(2)));
                    options.add(parseFloat((correct - 1).toFixed(2)));
                    // Take first 5
                    const arr = [...options].filter(x => x > 0).slice(0, 5);
                    while (arr.length < 5) arr.push(parseFloat((correct + arr.length * 0.11).toFixed(2)));
                    return arr.sort(() => Math.random() - 0.5);
                  },
                  correctAnswer: (v) => v.sum,
                  feedback: {
                    correct: (v) => `Spot on! **${v.unit}${v.numA_str} + ${v.unit}${v.numB_str} = ${v.unit}${v.sum_str}${v.unitAfter}**. Brilliant column addition! ✓`,
                    incorrect: (v) => `Not quite! Line up the decimal points and add column by column from the right. ${v.h_add}, then ${v.t_add}, then ${v.o_add}. The answer is **${v.unit}${v.sum_str}${v.unitAfter}**.`
                  }
                }
              },
              // ---- Screen 5: CONSOLIDATE — Summary recipe ----
              {
                type: "consolidate",
                title: () => "The recipe for adding decimals!",
                body: () => `Column addition with decimals is easy if you follow **one golden rule** and then add as normal:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Step 1: Line up the decimal points", why: "Write one number above the other so the decimal points are directly in line" },
                      { text: "Step 2: Add from the right", why: "Start with the hundredths, then tenths, then ones — just like whole numbers!" },
                      { text: "Step 3: Carry when a column reaches 10 or more", why: "Write the ones digit, carry the tens digit to the next column on the left" },
                      { text: "Step 4: Bring the decimal point straight down", why: "The decimal point in the answer goes in the same place as the ones above it ✓" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      }
    ,
      ...decimalsSubConcepts
    ]
  },

  // TOPIC: Percentages
  percentages: {
    name: "Percentages",
    subConcepts: [
      {
        id: "master-building-block-percentages",
        name: "Finding Any Percentage — The Building-Block Method",
        category: "master",
        lessons: [
          {
            id: "master-percentage-building-blocks-full",
            templateType: "master-method",
            learningGoal: [
              "How to find 10% of any amount by dividing by 10",
              "How to find 5% and 1% from 10%",
              "How to build up any percentage from these building blocks"
            ],
            variableSets: [
              {
                name: "Aisha", scenario: "spots a jacket in a shop with 25% off. The jacket costs",
                amount: 60, percentage: 25,
                ten_percent: 6, five_percent: 3, one_percent: 0.6,
                answer: 15,
                buildSteps: "25% = 2 \u00d7 10% + 5%",
                buildCalc: "2 \u00d7 6 + 3",
                buildParts: [
                  { label: "10%", count: 2, value: 6 },
                  { label: "5%", count: 1, value: 3 }
                ],
                totalParts: 3,
                unit: "\u00a3",
                unitAfter: ""
              },
              {
                name: "Ben", scenario: "finds out the school raised 30% of their target. The target was",
                amount: 500, percentage: 30,
                ten_percent: 50, five_percent: 25, one_percent: 5,
                answer: 150,
                buildSteps: "30% = 3 \u00d7 10%",
                buildCalc: "3 \u00d7 50",
                buildParts: [
                  { label: "10%", count: 3, value: 50 }
                ],
                totalParts: 3,
                unit: "\u00a3",
                unitAfter: ""
              },
              {
                name: "Charlie", scenario: "needs to score 35% to pass a test. The test is out of",
                amount: 200, percentage: 35,
                ten_percent: 20, five_percent: 10, one_percent: 2,
                answer: 70,
                buildSteps: "35% = 3 \u00d7 10% + 5%",
                buildCalc: "3 \u00d7 20 + 10",
                buildParts: [
                  { label: "10%", count: 3, value: 20 },
                  { label: "5%", count: 1, value: 10 }
                ],
                totalParts: 4,
                unit: "",
                unitAfter: " marks"
              },
              {
                name: "Daisy", scenario: "reads that 15% of the animals at a wildlife park are birds. There are",
                amount: 400, percentage: 15,
                ten_percent: 40, five_percent: 20, one_percent: 4,
                answer: 60,
                buildSteps: "15% = 10% + 5%",
                buildCalc: "40 + 20",
                buildParts: [
                  { label: "10%", count: 1, value: 40 },
                  { label: "5%", count: 1, value: 20 }
                ],
                totalParts: 2,
                unit: "",
                unitAfter: " animals"
              },
              {
                name: "Ella", scenario: "is told that a sports shop has 40% off trainers. The trainers were",
                amount: 80, percentage: 40,
                ten_percent: 8, five_percent: 4, one_percent: 0.8,
                answer: 32,
                buildSteps: "40% = 4 \u00d7 10%",
                buildCalc: "4 \u00d7 8",
                buildParts: [
                  { label: "10%", count: 4, value: 8 }
                ],
                totalParts: 4,
                unit: "\u00a3",
                unitAfter: ""
              },
              {
                name: "Finn", scenario: "scores 45% in a practice maths paper. The paper is out of",
                amount: 120, percentage: 45,
                ten_percent: 12, five_percent: 6, one_percent: 1.2,
                answer: 54,
                buildSteps: "45% = 4 \u00d7 10% + 5%",
                buildCalc: "4 \u00d7 12 + 6",
                buildParts: [
                  { label: "10%", count: 4, value: 12 },
                  { label: "5%", count: 1, value: 6 }
                ],
                totalParts: 5,
                unit: "",
                unitAfter: " marks"
              },
              {
                name: "Grace", scenario: "discovers that 20% of the sweets in a jar are strawberry flavour. The jar has",
                amount: 150, percentage: 20,
                ten_percent: 15, five_percent: 7.5, one_percent: 1.5,
                answer: 30,
                buildSteps: "20% = 2 \u00d7 10%",
                buildCalc: "2 \u00d7 15",
                buildParts: [
                  { label: "10%", count: 2, value: 15 }
                ],
                totalParts: 2,
                unit: "",
                unitAfter: " sweets"
              },
              // --- Level 3: More building blocks needed ---
              {
                name: "Hamza", scenario: "finds a 35% discount on a coat. The coat costs",
                amount: 240, percentage: 35, difficulty: 2,
                ten_percent: 24, five_percent: 12, one_percent: 2.4,
                answer: 84,
                buildSteps: "35% = 3 × 10% + 5%",
                buildCalc: "3 × 24 + 12",
                buildParts: [
                  { label: "10%", count: 3, value: 24 },
                  { label: "5%", count: 1, value: 12 }
                ],
                totalParts: 4,
                unit: "£", unitAfter: ""
              },
              {
                name: "Maisie", scenario: "discovers that 42% of pupils at her school walk to school. There are",
                amount: 350, percentage: 42, difficulty: 2,
                ten_percent: 35, five_percent: 17.5, one_percent: 3.5,
                answer: 147,
                buildSteps: "42% = 4 × 10% + 2 × 1%",
                buildCalc: "4 × 35 + 2 × 3.5",
                buildParts: [
                  { label: "10%", count: 4, value: 35 },
                  { label: "1%", count: 2, value: 3.5 }
                ],
                totalParts: 6,
                unit: "", unitAfter: " pupils"
              },
              {
                name: "Oscar", scenario: "reads that a charity raised 17% of its target. The target was",
                amount: 300, percentage: 17, difficulty: 2,
                ten_percent: 30, five_percent: 15, one_percent: 3,
                answer: 51,
                buildSteps: "17% = 10% + 5% + 2 × 1%",
                buildCalc: "30 + 15 + 2 × 3",
                buildParts: [
                  { label: "10%", count: 1, value: 30 },
                  { label: "5%", count: 1, value: 15 },
                  { label: "1%", count: 2, value: 3 }
                ],
                totalParts: 4,
                unit: "£", unitAfter: ""
              }
            ],
            screens: [
              // ---- Screen 1: HOOK — Setup the scenario ----
              {
                type: "hook",
                title: (v) => `Let's find ${v.percentage}% of ${v.unit}${v.amount}!`,
                body: (v) => `${v.name} ${v.scenario} **${v.unit}${v.amount}${v.unitAfter}**.\nWhat is **${v.percentage}%** of **${v.unit}${v.amount}**?\n\nWe'll use **building blocks** — start with 10%, then build up to any percentage we need!`,
                visual: {
                  component: "BarModel",
                  props: (v) => ({
                    segments: [
                      { value: v.percentage, label: `${v.percentage}%`, color: "#c084fc" },
                      { value: 100 - v.percentage, label: `${100 - v.percentage}%`, color: "#e5e7eb", empty: true }
                    ],
                    totalLabel: `${v.percentage}% of ${v.unit}${v.amount} = ?`,
                    showValues: true
                  })
                },
                interaction: null
              },
              // ---- Screen 2: TEACH — Find 10% and 5% ----
              {
                type: "teach",
                title: () => "Step 1: Find the building blocks",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `The most important building block is **10%**.\n\nTo find **10%**, just **divide by 10**. Easy!`
                  },
                  {
                    type: 'visual',
                    component: 'BarModel',
                    props: (v) => ({
                      segments: Array.from({ length: 10 }, (_, i) => ({
                        value: 1,
                        label: i === 0 ? `${v.unit}${v.ten_percent}` : "",
                        color: i === 0 ? "#c084fc" : "#e5e7eb",
                        empty: i > 0
                      })),
                      totalLabel: `${v.unit}${v.amount} split into 10 equal parts`,
                      showValues: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**10% of ${v.unit}${v.amount} = ${v.unit}${v.amount} \u00f7 10 = ${v.unit}${v.ten_percent}**\n\nEach piece of the bar is worth **${v.unit}${v.ten_percent}**.`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `10% of ${v.unit}${v.amount}`, why: `${v.unit}${v.amount} \u00f7 10`, result: `= ${v.unit}${v.ten_percent}` },
                        { text: `5% of ${v.unit}${v.amount}`, why: `Half of 10% = ${v.unit}${v.ten_percent} \u00f7 2`, result: `= ${v.unit}${v.five_percent}` },
                        { text: `1% of ${v.unit}${v.amount}`, why: `${v.unit}${v.amount} \u00f7 100`, result: `= ${v.unit}${v.one_percent}` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Now we know our **three key building blocks**:\n- **10%** = **${v.unit}${v.ten_percent}** (\u00f7 10)\n- **5%** = **${v.unit}${v.five_percent}** (half of 10%)\n- **1%** = **${v.unit}${v.one_percent}** (\u00f7 100)\n\nWith these three, we can build **any percentage** \u2713`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 3: TEACH — Build up to target percentage ----
              {
                type: "teach",
                title: (v) => `Step 2: Build up to ${v.percentage}%`,
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `We need **${v.percentage}%**. Let's build it from our blocks!\n\n**${v.buildSteps}**`
                  },
                  {
                    type: 'visual',
                    component: 'BarModel',
                    props: (v) => ({
                      segments: [
                        { value: v.percentage, label: `${v.percentage}%`, color: "#c084fc" },
                        { value: 100 - v.percentage, label: `${100 - v.percentage}%`, color: "#e5e7eb", empty: true }
                      ],
                      totalLabel: `${v.percentage}% of ${v.unit}${v.amount} (bar not drawn to exact scale)`,
                      showValues: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => {
                      const lines = v.buildParts.map(part => {
                        if (part.count > 1) {
                          return `**${part.count} \u00d7 ${part.label}** = ${part.count} \u00d7 ${v.unit}${part.value} = **${v.unit}${part.count * part.value}**`;
                        }
                        return `**${part.label}** = **${v.unit}${part.value}**`;
                      });
                      return lines.join('\n');
                    }
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => {
                      const steps = v.buildParts.map(part => {
                        if (part.count > 1) {
                          return { text: `${part.count} \u00d7 ${part.label}`, why: `${part.count} \u00d7 ${v.unit}${part.value}`, result: `= ${v.unit}${part.count * part.value}` };
                        }
                        return { text: `${part.label}`, result: `= ${v.unit}${part.value}` };
                      });
                      steps.push({ text: `Total: ${v.buildCalc}`, why: `Add the building blocks together`, result: `= ${v.unit}${v.answer}` });
                      return { steps, allRevealed: true };
                    }
                  },
                  {
                    type: 'text',
                    content: (v) => `So **${v.percentage}% of ${v.unit}${v.amount} = ${v.unit}${v.answer}${v.unitAfter}** ✓`
                  },
                  {
                    type: 'visual',
                    component: 'BarModel',
                    props: (v) => ({
                        segments: [
                          { value: v.percentage, label: `${v.percentage}% = ${v.unit}${v.answer}`, color: "#34d399" },
                          { value: 100 - v.percentage, label: `${100 - v.percentage}%`, color: "#e5e7eb", empty: true }
                        ],
                        totalLabel: `${v.unit}${v.amount}${v.unitAfter} total`,
                        showValues: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `${v.name}'s answer: **${v.unit}${v.answer}${v.unitAfter}** ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 4: INTERACT — MC question ----
              {
                type: "interact",
                title: () => "Your turn!",
                body: (v) => `${v.name} ${v.scenario} **${v.unit}${v.amount}${v.unitAfter}**.\nWhat is **${v.percentage}%** of **${v.unit}${v.amount}**?\n\nRemember: find 10% first, then build up!`,
                visual: {
                  component: "BarModel",
                  props: (v) => ({
                    segments: Array.from({ length: 10 }, (_, i) => ({
                      value: 1,
                      label: i === 0 ? "10%" : "",
                      color: "#e5e7eb",
                      empty: true
                    })),
                    totalLabel: `${v.unit}${v.amount} — find ${v.percentage}%`,
                    showValues: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What is ${v.percentage}% of ${v.unit}${v.amount}?`,
                  getOptions: (v) => generateDistractors(v.answer),
                  correctAnswer: (v) => v.answer,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.buildSteps}, so ${v.buildCalc} = **${v.unit}${v.answer}${v.unitAfter}**. You've got it! ✓`,
                    incorrect: (v) => `Not quite! 10% of ${v.unit}${v.amount} = ${v.unit}${v.ten_percent}. Then ${v.buildSteps}: ${v.buildCalc} = **${v.unit}${v.answer}${v.unitAfter}**.`
                  }
                }
              },
              // ---- Screen 5: CONSOLIDATE — Summary recipe ----
              {
                type: "consolidate",
                title: () => "The building-block method!",
                body: () => `You can find **any percentage** using building blocks. Start with 10% and 5%, and add more blocks when you need them:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Step 1: Find 10% — divide the amount by 10", why: "This is your main building block. Move the digits one place to the right!" },
                      { text: "Step 2: Find 5% — halve your 10%", why: "5% is just half of 10%. Handy for percentages ending in 5!" },
                      { text: "Bonus blocks: 1% (÷100), 25% (÷4), 50% (÷2)", why: "These help with trickier percentages like 3%, 17%, or 75%!" },
                      { text: "Step 3: Build up to the target percentage", why: "Combine your blocks: e.g. 35% = 3×10% + 5%, 17% = 10% + 5% + 2×1%" },
                      { text: "Step 4: Add the blocks together for the answer", why: "Simple addition gives you the final amount ✓" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      }
    ,
      ...percentagesSubConcepts
    ]
  },

  ratio: {
    name: "Ratio & Proportion",
    subConcepts: [
      {
        id: "master-sharing-ratio",
        name: "Sharing in a Ratio — Step by Step",
        category: "master",
        lessons: [
          {
            id: "master-ratio-sharing",
            templateType: "master-method",
            learningGoal: [
              "How to share a total in a given ratio",
              "How to find the value of one part",
              "How to multiply to find each person's share"
            ],
            variableSets: [
              // Set 1: 3:5, total 40 sweets → parts 8, one=5, shares 15 & 25
              {
                name: "Mrs Patel",
                scenario: "shares sweets between Ben and Daisy after Sports Day",
                total: 40,
                ratioA: 3,
                ratioB: 5,
                totalParts: 8,
                onePart: 5,
                shareA: 15,
                shareB: 25,
                labelA: "Ben",
                labelB: "Daisy",
                unit: "sweets"
              },
              // Set 2: 2:3, total 50 pocket money → parts 5, one=10, shares 20 & 30
              {
                name: "Grandma",
                scenario: "splits pocket money between Oliver and Amelia for the holidays",
                total: 50,
                ratioA: 2,
                ratioB: 3,
                totalParts: 5,
                onePart: 10,
                shareA: 20,
                shareB: 30,
                labelA: "Oliver",
                labelB: "Amelia",
                unit: "pounds"
              },
              // Set 3: 1:4, total 35 stickers → parts 5, one=7, shares 7 & 28
              {
                name: "Mr Khan",
                scenario: "divides stickers between Lauren and Evie as rewards",
                total: 35,
                ratioA: 1,
                ratioB: 4,
                totalParts: 5,
                onePart: 7,
                shareA: 7,
                shareB: 28,
                labelA: "Lauren",
                labelB: "Evie",
                unit: "stickers"
              },
              // Set 4: 3:7, total 60 marbles → parts 10, one=6, shares 18 & 42
              {
                name: "A toy shop",
                scenario: "packs marbles into two party bags for Harry and Sophie",
                total: 60,
                ratioA: 3,
                ratioB: 7,
                totalParts: 10,
                onePart: 6,
                shareA: 18,
                shareB: 42,
                labelA: "Harry",
                labelB: "Sophie",
                unit: "marbles"
              },
              // Set 5: 2:5, total 42 paint pots → parts 7, one=6, shares 12 & 30
              {
                name: "Miss Clarke",
                scenario: "shares paint pots between two tables for an art lesson",
                total: 42,
                ratioA: 2,
                ratioB: 5,
                totalParts: 7,
                onePart: 6,
                shareA: 12,
                shareB: 30,
                labelA: "Table A",
                labelB: "Table B",
                unit: "paint pots"
              },
              // Set 6: 4:3, total 56 biscuits → parts 7, one=8, shares 32 & 24
              {
                name: "A baker",
                scenario: "divides biscuits between the chocolate box and the plain box",
                total: 56,
                ratioA: 4,
                ratioB: 3,
                totalParts: 7,
                onePart: 8,
                shareA: 32,
                shareB: 24,
                labelA: "Chocolate",
                labelB: "Plain",
                unit: "biscuits"
              },
              // Set 7: 5:3, total 48 football cards → parts 8, one=6, shares 30 & 18
              {
                name: "Dad",
                scenario: "shares football cards between James and Chloe after a car-boot sale",
                total: 48,
                ratioA: 5,
                ratioB: 3,
                totalParts: 8,
                onePart: 6,
                shareA: 30,
                shareB: 18,
                labelA: "James",
                labelB: "Chloe",
                unit: "cards"
              },
              // --- Level 3: Larger totals ---
              {
                name: "A head teacher",
                scenario: "splits 180 revision guides between Year 5 and Year 6",
                total: 180, ratioA: 7, ratioB: 5, totalParts: 12, onePart: 15,
                shareA: 105, shareB: 75,
                labelA: "Year 5", labelB: "Year 6",
                unit: "guides", difficulty: 2
              },
              {
                name: "An ice cream van",
                scenario: "splits 260 scoops between chocolate and vanilla",
                total: 260, ratioA: 9, ratioB: 4, totalParts: 13, onePart: 20,
                shareA: 180, shareB: 80,
                labelA: "Chocolate", labelB: "Vanilla",
                unit: "scoops", difficulty: 2
              },
              {
                name: "A festival organiser",
                scenario: "divides 336 wristbands between adults and children",
                total: 336, ratioA: 5, ratioB: 7, totalParts: 12, onePart: 28,
                shareA: 140, shareB: 196,
                labelA: "Adults", labelB: "Children",
                unit: "wristbands", difficulty: 2
              }
            ],
            screens: [
              // ---- Screen 1: HOOK — Setup the scenario ----
              {
                type: "hook",
                title: (v) => `Sharing ${v.total} ${v.unit} in the ratio ${v.ratioA}:${v.ratioB}`,
                body: (v) => `${v.name} ${v.scenario}.\n\nThere are **${v.total} ${v.unit}** in total. They need to be shared in the ratio **${v.ratioA}:${v.ratioB}** between **${v.labelA}** and **${v.labelB}**.\n\nHow many does each person get? Let's find out!`,
                visual: {
                  component: "BarModel",
                  props: (v) => ({
                    segments: [
                      { value: v.ratioA, label: `${v.labelA}: ${v.ratioA} parts`, color: "#c084fc" },
                      { value: v.ratioB, label: `${v.labelB}: ${v.ratioB} parts`, color: "#818cf8" }
                    ],
                    totalLabel: `Total: ${v.total} ${v.unit}`,
                    showValues: true
                  })
                },
                interaction: null
              },
              // ---- Screen 2: TEACH — Step 1: Find total parts and value of one part ----
              {
                type: "teach",
                title: () => "Step 1: Find the value of one part",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `First, add the ratio numbers to find the **total number of parts**.\n\n**${v.ratioA} + ${v.ratioB} = ${v.totalParts} parts**`
                  },
                  {
                    type: 'visual',
                    component: 'BarModel',
                    props: (v) => {
                      const segs = [];
                      for (let i = 0; i < v.ratioA; i++) {
                        segs.push({ value: 1, label: '', color: "#c084fc" });
                      }
                      for (let i = 0; i < v.ratioB; i++) {
                        segs.push({ value: 1, label: '', color: "#818cf8" });
                      }
                      return {
                        segments: segs,
                        totalLabel: `${v.totalParts} equal parts`,
                        showValues: false
                      };
                    }
                  },
                  {
                    type: 'text',
                    content: (v) => `Now divide the total by the number of parts to find **what one part is worth**.\n\n**${v.total} ÷ ${v.totalParts} = ${v.onePart}**`
                  },
                  {
                    type: 'visual',
                    component: 'BarModel',
                    props: (v) => {
                      const segs = [];
                      for (let i = 0; i < v.ratioA; i++) {
                        segs.push({ value: 1, label: `${v.onePart}`, color: "#c084fc" });
                      }
                      for (let i = 0; i < v.ratioB; i++) {
                        segs.push({ value: 1, label: `${v.onePart}`, color: "#818cf8" });
                      }
                      return {
                        segments: segs,
                        totalLabel: `Each part = ${v.onePart} ${v.unit}`,
                        showValues: true
                      };
                    }
                  },
                  {
                    type: 'text',
                    content: (v) => `Each part is worth **${v.onePart} ${v.unit}** ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 3: TEACH — Step 2: Multiply to find each share ----
              {
                type: "teach",
                title: () => "Step 2: Multiply to find each share",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `Each part is worth **${v.onePart}**. Now multiply by each side of the ratio.`
                  },
                  {
                    type: 'visual',
                    component: 'BarModel',
                    props: (v) => ({
                      segments: [
                        { value: v.ratioA, label: `${v.labelA}: ${v.ratioA} parts`, color: "#c084fc" },
                        { value: v.ratioB, label: `${v.labelB}: ${v.ratioB} parts`, color: "#818cf8" }
                      ],
                      totalLabel: `One part = ${v.onePart}`,
                      showValues: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**${v.labelA}** gets **${v.ratioA}** parts:\n**${v.ratioA} × ${v.onePart} = ${v.shareA} ${v.unit}**\n\n**${v.labelB}** gets **${v.ratioB}** parts:\n**${v.ratioB} × ${v.onePart} = ${v.shareB} ${v.unit}**`
                  },
                  {
                    type: 'visual',
                    component: 'BarModel',
                    props: (v) => ({
                      segments: [
                        { value: v.shareA, label: `${v.labelA}: ${v.shareA}`, color: "#c084fc" },
                        { value: v.shareB, label: `${v.labelB}: ${v.shareB}`, color: "#818cf8" }
                      ],
                      totalLabel: `${v.shareA} + ${v.shareB} = ${v.total} ${v.unit} ✓`,
                      showValues: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**Check:** ${v.shareA} + ${v.shareB} = **${v.total}** — it matches the total! ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 4: INTERACT — Multiple choice ----
              {
                type: "interact",
                title: (v) => `Your turn! How many ${v.unit} does ${v.labelA} get?`,
                body: (v) => `**${v.total} ${v.unit}** are shared in the ratio **${v.ratioA}:${v.ratioB}**.\n\nHow many ${v.unit} does **${v.labelA}** get?\n\nRemember: find the total number of parts first, then work out what one part is worth.`,
                visual: {
                  component: "BarModel",
                  props: (v) => ({
                    segments: [
                      { value: v.ratioA, label: `${v.labelA}: ? ${v.unit}`, color: "#c084fc" },
                      { value: v.ratioB, label: `${v.labelB}`, color: "#818cf8" }
                    ],
                    totalLabel: `Total: ${v.total} ${v.unit}`,
                    showValues: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `How many ${v.unit} does ${v.labelA} get?`,
                  getOptions: (v) => generateDistractors(v.shareA),
                  correctAnswer: (v) => v.shareA,
                  feedback: {
                    correct: (v) => `Brilliant! **${v.ratioA} × ${v.onePart} = ${v.shareA}**. So ${v.labelA} gets **${v.shareA} ${v.unit}**! ✓`,
                    incorrect: (v) => `Not quite! One part = ${v.onePart}. ${v.labelA} gets ${v.ratioA} parts: **${v.ratioA} × ${v.onePart} = ${v.shareA} ${v.unit}**.`
                  }
                }
              },
              // ---- Screen 5: CONSOLIDATE — Summary recipe ----
              {
                type: "consolidate",
                title: () => "The ratio-sharing recipe!",
                body: () => `Whenever you need to **share a total in a ratio**, follow these three steps:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Step 1: Add the ratio numbers to find the total parts", why: "e.g. 3:5 → 3 + 5 = 8 parts" },
                      { text: "Step 2: Divide the total by the number of parts", why: "This tells you what ONE part is worth" },
                      { text: "Step 3: Multiply one part by each side of the ratio", why: "That gives each person's share. Check they add up to the total! ✓" }
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
    ,
      ...ratioSubConcepts
    ]
  },

  // TOPIC: Negative Numbers
  negativenumbers: {
    name: "Negative Numbers",
    subConcepts: [
      {
        id: "master-crossing-zero",
        name: "Adding Across Zero — Step by Step",
        category: "master",
        lessons: [
          {
            id: "master-negatives-crossing",
            templateType: "master-method",
            learningGoal: [
              "How to add a positive number to a negative number",
              "How to count up to zero first",
              "How to continue past zero to find the answer"
            ],
            variableSets: [
              // Set 1: -7 + 12 = 5, temperature
              {
                name: "A weather station",
                scenario: "records the temperature on a cold morning in Edinburgh. By lunchtime it has warmed up",
                startNum: -7,
                change: 12,
                answer: 5,
                distanceToZero: 7,
                remaining: 5,
                unit: "\u00b0C",
                contextWord: "rises by",
                lineMin: -10,
                lineMax: 10
              },
              // Set 2: -4 + 9 = 5, elevator
              {
                name: "A hotel lift",
                scenario: "starts in the underground car park. Someone presses the button to go up",
                startNum: -4,
                change: 9,
                answer: 5,
                distanceToZero: 4,
                remaining: 5,
                unit: "floors",
                contextWord: "goes up",
                lineMin: -6,
                lineMax: 8
              },
              // Set 3: -6 + 10 = 4, money owed
              {
                name: "Ruby",
                scenario: "owes her brother £6. Then her birthday money arrives",
                startNum: -6,
                change: 10,
                answer: 4,
                distanceToZero: 6,
                remaining: 4,
                unit: "£",
                contextWord: "receives",
                lineMin: -8,
                lineMax: 8
              },
              // Set 4: -5 + 8 = 3, sea depth
              {
                name: "A submarine",
                scenario: "sits below the surface of the sea. The captain gives the order to rise",
                startNum: -5,
                change: 8,
                answer: 3,
                distanceToZero: 5,
                remaining: 3,
                unit: "metres",
                contextWord: "rises",
                lineMin: -8,
                lineMax: 6
              },
              // Set 5: -8 + 11 = 3, thermometer
              {
                name: "A school in Aberdeen",
                scenario: "checks the playground thermometer first thing on a frosty January morning. By break time the sun comes out",
                startNum: -8,
                change: 11,
                answer: 3,
                distanceToZero: 8,
                remaining: 3,
                unit: "\u00b0C",
                contextWord: "rises by",
                lineMin: -10,
                lineMax: 6
              },
              // Set 6: -3 + 7 = 4, building floors
              {
                name: "A shopping centre",
                scenario: "has basement floors below ground. Mum parks in the basement and takes the escalator up",
                startNum: -3,
                change: 7,
                answer: 4,
                distanceToZero: 3,
                remaining: 4,
                unit: "floors",
                contextWord: "goes up",
                lineMin: -5,
                lineMax: 6
              },
              // Set 7: -6 + 14 = 8, temperature
              {
                name: "A farm in Wales",
                scenario: "measures the overnight temperature. During the day the sun warms everything up",
                startNum: -6,
                change: 14,
                answer: 8,
                distanceToZero: 6,
                remaining: 8,
                unit: "\u00b0C",
                contextWord: "rises by",
                lineMin: -8,
                lineMax: 10
              },
              // --- Level 3: Subtraction crossing zero (positive → negative) ---
              {
                name: "A weather station in Inverness",
                scenario: "records 12°C at noon but the temperature plummets overnight",
                startNum: 12, change: 19, answer: -7,
                distanceToZero: 12, remaining: 7,
                unit: "°C", contextWord: "drops by",
                operation: "subtract", direction: "down",
                lineMin: -10, lineMax: 15, difficulty: 2
              },
              {
                name: "A diver",
                scenario: "stands on a platform 8 metres above sea level, then plunges deep into the ocean",
                startNum: 8, change: 21, answer: -13,
                distanceToZero: 8, remaining: 13,
                unit: "m", contextWord: "descends",
                operation: "subtract", direction: "down",
                lineMin: -15, lineMax: 10, difficulty: 2
              },
              {
                name: "A ski resort in Scotland",
                scenario: "measures 14°C at midday but a severe blizzard sweeps in overnight",
                startNum: 14, change: 23, answer: -9,
                distanceToZero: 14, remaining: 9,
                unit: "°C", contextWord: "drops by",
                operation: "subtract", direction: "down",
                lineMin: -12, lineMax: 16, difficulty: 2
              }
            ],
            screens: [
              // ---- Screen 1: HOOK — Setup the scenario ----
              {
                type: "hook",
                title: (v) => v.operation === 'subtract' ? `Starting at ${v.startNum} and subtracting ${v.change}` : `Starting at ${v.startNum} and adding ${v.change}`,
                body: (v) => `${v.name} ${v.scenario}.\n\nThe starting value is **${v.startNum} ${v.unit}**.\n\nIt ${v.contextWord} **${v.change} ${v.unit}**.\n\nWhere do we end up? We need to **cross zero** — let's use a number line!`,
                visual: {
                  component: "NumberLine",
                  props: (v) => {
                    const range = v.lineMax - v.lineMin;
                    const tickInterval = range <= 15 ? 1 : range <= 30 ? 2 : 5;
                    return {
                      min: v.lineMin,
                      max: v.lineMax,
                      points: [
                        { value: v.startNum, label: `${v.startNum}`, color: "#3b82f6" },
                        { value: 0, label: "0", color: "#9ca3af" }
                      ],
                      jumps: [],
                      tickInterval,
                      showLabels: true,
                      highlight: null
                    };
                  }
                },
                interaction: null
              },
              // ---- Screen 2: TEACH — Step 1: Count to zero ----
              {
                type: "teach",
                title: () => "Step 1: Jump to zero first",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `We start at **${v.startNum}**. Before we can go past zero, we need to **get to zero first**.\n\nHow far is it from **${v.startNum}** to **0**?`
                  },
                  {
                    type: 'visual',
                    component: 'NumberLine',
                    props: (v) => ({
                      min: v.lineMin,
                      max: v.lineMax,
                      points: [
                        { value: v.startNum, label: `${v.startNum}`, color: "#3b82f6" },
                        { value: 0, label: "0", color: "#9ca3af" }
                      ],
                      jumps: [
                        { from: v.startNum, to: 0, label: v.operation === 'subtract' ? `-${v.distanceToZero}` : `+${v.distanceToZero}` }
                      ],
                      tickInterval: 1,
                      showLabels: true,
                      highlight: [Math.min(v.startNum, 0), Math.max(v.startNum, 0)]
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `It's **${v.distanceToZero}** ${v.operation === 'subtract' ? 'back' : 'jumps'} from ${v.startNum} to 0.\n\nWe've used **${v.distanceToZero}** of our **${v.change}**.`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `Start at ${v.startNum}`, result: v.operation === 'subtract' ? `Jump -${v.distanceToZero} to reach 0` : `Jump +${v.distanceToZero} to reach 0` },
                        { text: `Used ${v.distanceToZero} out of ${v.change}`, result: `Left over: ${v.change} - ${v.distanceToZero} = ${v.remaining}` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => v.operation === 'subtract' ? `We still have **${v.remaining}** left to subtract! ✓` : `We still have **${v.remaining}** left to add! ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 3: TEACH — Step 2: Continue past zero ----
              {
                type: "teach",
                title: () => "Step 2: Keep going past zero",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => v.operation === 'subtract'
                      ? `We're at **0** now. We still have **${v.remaining}** left to subtract.\n\nKeep counting backwards — into the negatives!`
                      : `We're at **0** now. We still have **${v.remaining}** left to add.\n\nJust keep counting forward!`
                  },
                  {
                    type: 'visual',
                    component: 'NumberLine',
                    props: (v) => ({
                      min: v.lineMin,
                      max: v.lineMax,
                      points: [
                        { value: v.startNum, label: `${v.startNum}`, color: "#93c5fd" },
                        { value: 0, label: "0", color: "#9ca3af" },
                        { value: v.answer, label: `${v.answer}`, color: "#22c55e" }
                      ],
                      jumps: v.operation === 'subtract' ? [
                        { from: v.startNum, to: 0, label: `-${v.distanceToZero}` },
                        { from: 0, to: v.answer, label: `-${v.remaining}` }
                      ] : [
                        { from: v.startNum, to: 0, label: `+${v.distanceToZero}` },
                        { from: 0, to: v.answer, label: `+${v.remaining}` }
                      ],
                      tickInterval: 1,
                      showLabels: true,
                      highlight: [Math.min(v.startNum, v.answer), Math.max(v.startNum, v.answer)]
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => v.operation === 'subtract'
                      ? `From 0, we subtract the remaining **${v.remaining}**:\n\n**0 - ${v.remaining} = ${v.answer}**`
                      : `From 0, we add the remaining **${v.remaining}**:\n\n**0 + ${v.remaining} = ${v.answer}**`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => v.operation === 'subtract' ? ({
                      steps: [
                        { text: `${v.startNum} - ${v.change}`, why: "Split the jump into two parts" },
                        { text: `First: ${v.startNum} - ${v.distanceToZero} = 0`, why: "Get down to zero" },
                        { text: `Then: 0 - ${v.remaining} = ${v.answer}`, result: `Answer: ${v.answer} ${v.unit}` }
                      ],
                      allRevealed: true
                    }) : ({
                      steps: [
                        { text: `${v.startNum} + ${v.change}`, why: "Split the jump into two parts" },
                        { text: `First: ${v.startNum} + ${v.distanceToZero} = 0`, why: "Get to zero" },
                        { text: `Then: 0 + ${v.remaining} = ${v.answer}`, result: `Answer: ${v.answer} ${v.unit}` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => v.operation === 'subtract'
                      ? `**${v.startNum} - ${v.change} = ${v.answer} ${v.unit}** ✓`
                      : `**${v.startNum} + ${v.change} = ${v.answer} ${v.unit}** ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 4: INTERACT — Multiple choice ----
              {
                type: "interact",
                title: (v) => `Your turn!`,
                body: (v) => `Now try one yourself!\n\nThe starting value is **${v.startNum} ${v.unit}**.\n\nIt ${v.contextWord} **${v.change} ${v.unit}**.\n\nRemember: split the jump at zero — how far to get to zero, then how far beyond?`,
                visual: {
                  component: "NumberLine",
                  props: (v) => {
                    const range = v.lineMax - v.lineMin;
                    const tickInterval = range <= 15 ? 1 : range <= 30 ? 2 : 5;
                    return {
                      min: v.lineMin,
                      max: v.lineMax,
                      points: [
                        { value: v.startNum, label: `${v.startNum}`, color: "#3b82f6" },
                        { value: 0, label: "0", color: "#9ca3af" }
                      ],
                      jumps: [],
                      tickInterval,
                      showLabels: true,
                      highlight: null
                    };
                  }
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => v.operation === 'subtract' ? `What is ${v.startNum} - ${v.change}?` : `What is ${v.startNum} + ${v.change}?`,
                  getOptions: (v) => generateDistractors(v.answer),
                  correctAnswer: (v) => v.answer,
                  feedback: {
                    correct: (v) => v.operation === 'subtract'
                      ? `Brilliant! **${v.startNum} - ${v.change} = ${v.answer}**. The final value is **${v.answer} ${v.unit}**! ✓`
                      : `Brilliant! **${v.startNum} + ${v.change} = ${v.answer}**. The final value is **${v.answer} ${v.unit}**! ✓`,
                    incorrect: (v) => v.operation === 'subtract'
                      ? `Not quite! From ${v.startNum}, it's ${v.distanceToZero} to reach 0, then ${v.remaining} more: **0 - ${v.remaining} = ${v.answer} ${v.unit}**.`
                      : `Not quite! From ${v.startNum}, it's ${v.distanceToZero} to reach 0, then ${v.remaining} more: **0 + ${v.remaining} = ${v.answer} ${v.unit}**.`
                  }
                }
              },
              // ---- Screen 5: CONSOLIDATE — Summary recipe ----
              {
                type: "consolidate",
                title: () => "The crossing-zero recipe!",
                body: () => `Whenever a calculation **crosses zero**, split the jump into two parts:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Step 1: Work out how far it is to zero", why: "That's the distance from your negative start to 0" },
                      { text: "Step 2: Subtract that from the number you're adding", why: "This tells you how much is LEFT OVER after reaching zero" },
                      { text: "Step 3: The leftover is your positive answer", why: "You jumped to 0, then kept going — that's your answer! ✓" }
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
    ,
      ...negativeNumbersSubConcepts
    ]
  },

  // TOPIC: Algebra
  algebra: {
    name: "Algebra",
    subConcepts: [
      {
        id: "master-two-step-equations",
        name: "Solving Two-Step Equations — Step by Step",
        category: "master",
        lessons: [
          {
            id: "master-algebra-twostep",
            templateType: "master-method",
            learningGoal: [
              "How to solve equations like 3n + 5 = 29",
              "How to undo addition/subtraction first",
              "How to undo multiplication second",
              "How to check your answer by substituting back in"
            ],
            variableSets: [
              // Set 1: 3x + 5 = 29, x = 8, step1Result = 24
              {
                name: "A sweet shop",
                scenario: "sells mystery bags of sweets. Each bag has the same number of sweets. Tom buys 3 bags and the shopkeeper adds 5 extra sweets as a bonus. He ends up with 29 sweets altogether",
                a: 3,
                b: 5,
                result: 29,
                x: 8,
                step1Result: 24,
                equation: "3n + 5 = 29",
                check: 29,
                iEquation: "3n + 4 = 22", iA: 3, iB: 4, iResult: 22, iStep1Result: 18, iX: 6, iCheck: 22
              },
              // Set 2: 4x + 3 = 31, x = 7, step1Result = 28
              {
                name: "A school trip",
                scenario: "costs the same for each pupil, plus a £3 booking fee. Four children pay a total of £31",
                a: 4,
                b: 3,
                result: 31,
                x: 7,
                step1Result: 28,
                equation: "4n + 3 = 31",
                check: 31,
                iEquation: "4n + 5 = 37", iA: 4, iB: 5, iResult: 37, iStep1Result: 32, iX: 8, iCheck: 37
              },
              // Set 3: 2x + 9 = 25, x = 8, step1Result = 16
              {
                name: "Hannah",
                scenario: "thinks of a mystery number. She doubles it, then adds 9. The answer is 25",
                a: 2,
                b: 9,
                result: 25,
                x: 8,
                step1Result: 16,
                equation: "2n + 9 = 25",
                check: 25,
                iEquation: "2n + 3 = 17", iA: 2, iB: 3, iResult: 17, iStep1Result: 14, iX: 7, iCheck: 17
              },
              // Set 4: 5x + 4 = 54, x = 10, step1Result = 50
              {
                name: "A baker",
                scenario: "makes identical cakes. Each uses the same amount of flour, plus 4 extra grams for dusting. Five cakes use 54 grams of flour in total",
                a: 5,
                b: 4,
                result: 54,
                x: 10,
                step1Result: 50,
                equation: "5n + 4 = 54",
                check: 54,
                iEquation: "5n + 7 = 42", iA: 5, iB: 7, iResult: 42, iStep1Result: 35, iX: 7, iCheck: 42
              },
              // Set 5: 6x + 2 = 38, x = 6, step1Result = 36
              {
                name: "A toy factory",
                scenario: "packs the same number of toys into each box, plus 2 extra as spares. Six boxes contain 38 toys altogether",
                a: 6,
                b: 2,
                result: 38,
                x: 6,
                step1Result: 36,
                equation: "6n + 2 = 38",
                check: 38,
                iEquation: "6n + 5 = 47", iA: 6, iB: 5, iResult: 47, iStep1Result: 42, iX: 7, iCheck: 47
              },
              // Set 6: 3x + 7 = 40, x = 11, step1Result = 33
              {
                name: "Mr Patel",
                scenario: "buys identical science kits for his class, plus 7 extra pencils. Three kits and the pencils cost £40 in total",
                a: 3,
                b: 7,
                result: 40,
                x: 11,
                step1Result: 33,
                equation: "3n + 7 = 40",
                check: 40,
                iEquation: "3n + 2 = 26", iA: 3, iB: 2, iResult: 26, iStep1Result: 24, iX: 8, iCheck: 26
              },
              // Set 7: 4x + 6 = 46, x = 10, step1Result = 40
              {
                name: "A garden centre",
                scenario: "sells identical plant pots and charges a £6 delivery fee. Mum orders 4 pots and the total bill is £46",
                a: 4,
                b: 6,
                result: 46,
                x: 10,
                step1Result: 40,
                equation: "4n + 6 = 46",
                check: 46,
                iEquation: "4n + 3 = 27", iA: 4, iB: 3, iResult: 27, iStep1Result: 24, iX: 6, iCheck: 27
              },
              // --- Level 3: Bigger coefficients and subtraction ---
              {
                name: "A concert venue",
                scenario: "sells tickets in equal blocks, plus a £12 booking fee for the group. Eight blocks and the fee cost £92 in total",
                a: 8, b: 12, result: 92, x: 10, step1Result: 80,
                equation: "8n + 12 = 92", check: 92, difficulty: 2,
                iEquation: "8n + 4 = 68", iA: 8, iB: 4, iResult: 68, iStep1Result: 64, iX: 8, iCheck: 68
              },
              {
                name: "A zoo keeper",
                scenario: "feeds the same amount to each penguin, but 15 fish were stolen by a seagull. Nine penguins were supposed to get 57 fish before the theft",
                a: 9, b: 15, result: 57, x: 8, step1Result: 72,
                equation: "9n - 15 = 57", check: 57,
                isSubtraction: true, difficulty: 2,
                iEquation: "9n - 6 = 48", iA: 9, iB: 6, iResult: 48, iStep1Result: 54, iX: 6, iCheck: 48, iIsSubtraction: true
              },
              {
                name: "A swimming club",
                scenario: "charges the same fee per lesson, plus £12 for the membership card. Six lessons and the card cost £78",
                a: 6, b: 12, result: 78, x: 11, step1Result: 66,
                equation: "6n + 12 = 78", check: 78, difficulty: 2,
                iEquation: "6n + 3 = 51", iA: 6, iB: 3, iResult: 51, iStep1Result: 48, iX: 8, iCheck: 51
              }
            ],
            screens: [
              // ---- Screen 1: HOOK — Setup the scenario ----
              {
                type: "hook",
                title: (v) => `Can you solve ${v.equation}?`,
                body: (v) => `${v.name} ${v.scenario}.\n\nWe can write this as an **equation** (a number sentence with an equals sign):\n**${v.equation}**\n\nIn algebra, **letters like n stand for unknown numbers** — the mystery number we need to find. Let's find it using **inverse operations** (doing the opposite to undo each step)!`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `The equation: ${v.equation}`, why: "n is the number we need to find" }
                    ],
                    allRevealed: true
                  })
                },
                interaction: null
              },
              // ---- Screen 2: TEACH — Step 1: Undo the addition/subtraction ----
              {
                type: "teach",
                title: (v) => v.isSubtraction ? "Step 1: Undo the subtraction first" : "Step 1: Undo the addition first",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => v.isSubtraction
                      ? `Look at the equation: **${v.equation}**\n\nThe **last thing** that was done to n was **- ${v.b}**.\nTo undo subtracting, we **add**. Do it to **both sides**!`
                      : `Look at the equation: **${v.equation}**\n\nThe **last thing** that was done to n was **+ ${v.b}**.\nTo undo adding, we **subtract**. Do it to **both sides**!`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => v.isSubtraction ? ({
                      steps: [
                        { text: `${v.equation}`, why: "Start with the equation" },
                        { text: `Add ${v.b} to both sides`, result: `${v.a}n = ${v.result} + ${v.b} = ${v.step1Result}` }
                      ],
                      allRevealed: true
                    }) : ({
                      steps: [
                        { text: `${v.equation}`, why: "Start with the equation" },
                        { text: `Subtract ${v.b} from both sides`, result: `${v.a}n = ${v.result} - ${v.b} = ${v.step1Result}` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => v.isSubtraction
                      ? `**${v.result} + ${v.b} = ${v.step1Result}**\n\nSo now we have: **${v.a}n = ${v.step1Result}**`
                      : `**${v.result} - ${v.b} = ${v.step1Result}**\n\nSo now we have: **${v.a}n = ${v.step1Result}**`
                  },
                  {
                    type: 'visual',
                    component: 'BarModel',
                    props: (v) => ({
                      segments: [
                        { value: v.step1Result, label: `${v.a}n = ${v.step1Result}`, color: "#818cf8" }
                      ],
                      totalLabel: v.isSubtraction ? `We added ${v.b} back to both sides.` : `Total was ${v.result}. We removed the +${v.b}.`,
                      showValues: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => v.isSubtraction
                      ? `The **- ${v.b}** is gone. Now we just need to find n! ✓`
                      : `The **+ ${v.b}** is gone. Now we just need to find n! ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 3: TEACH — Step 2: Undo the multiplication + check ----
              {
                type: "teach",
                title: () => "Step 2: Undo the multiplication",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `We have: **${v.a}n = ${v.step1Result}**\n\nThat means **${v.a} × n = ${v.step1Result}**.\nTo undo multiplying, we **divide**!`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `${v.a}n = ${v.step1Result}`, why: "From Step 1" },
                        { text: `Divide both sides by ${v.a}`, result: `n = ${v.step1Result} ÷ ${v.a} = ${v.x}` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**${v.step1Result} ÷ ${v.a} = ${v.x}**\n\nSo **n = ${v.x}**! But we should always **check** by putting it back in.`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => v.isSubtraction ? ({
                      steps: [
                        { text: "Check:", why: `Put n = ${v.x} back into the equation` },
                        { text: `${v.a} × ${v.x} - ${v.b}`, result: `= ${v.a * v.x} - ${v.b} = ${v.check}` },
                        { text: `${v.check} matches the original ${v.result}`, result: "Correct! ✓" }
                      ],
                      allRevealed: true
                    }) : ({
                      steps: [
                        { text: "Check:", why: `Put n = ${v.x} back into the equation` },
                        { text: `${v.a} × ${v.x} + ${v.b}`, result: `= ${v.a * v.x} + ${v.b} = ${v.check}` },
                        { text: `${v.check} matches the original ${v.result}`, result: "Correct! ✓" }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `It works! **n = ${v.x}** ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 4: INTERACT — Multiple choice ----
              {
                type: "interact",
                title: (v) => `Your turn! Solve ${v.iEquation}`,
                body: (v) => `Now try one yourself!\n\n**${v.iEquation}**\n\nRemember the two steps: first undo the ${v.iIsSubtraction ? 'subtracting' : 'adding'}, then undo the multiplying.`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `${v.iEquation}`, why: "Solve for n using the two-step method" }
                    ],
                    allRevealed: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What is n?`,
                  getOptions: (v) => generateDistractors(v.iX),
                  correctAnswer: (v) => v.iX,
                  feedback: {
                    correct: (v) => `Brilliant! **${v.iStep1Result} ÷ ${v.iA} = ${v.iX}**. So n = **${v.iX}**! Check: ${v.iA} × ${v.iX} ${v.iIsSubtraction ? '−' : '+'} ${v.iB} = ${v.iCheck} ✓`,
                    incorrect: (v) => `Not quite! ${v.iStep1Result} ÷ ${v.iA} = **${v.iX}**. Remember: divide both sides by the number in front of n.`
                  }
                }
              },
              // ---- Screen 5: CONSOLIDATE — Summary recipe ----
              {
                type: "consolidate",
                title: () => "The equation-solving recipe!",
                body: () => `To solve a **two-step equation** (an equation where two things have been done to the unknown number) like 3n + 5 = 29, always **do the opposite to undo each step backwards**:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Step 1: Undo the + or - first", why: "Subtract (or add) the same number from BOTH sides" },
                      { text: "Step 2: Undo the × next", why: "Divide BOTH sides by the number in front of n" },
                      { text: "Step 3: Check by substituting back in", why: "Put your answer back into the original equation — it should match! ✓" }
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
    ,
      ...algebraSubConcepts
    ]
  },

  placevalue: {
    name: "Place Value & Rounding",
    subConcepts: [
      // ==========================================
      // MASTER METHOD: Rounding to nearest 10, 100, 1000
      // ==========================================
      {
        id: "master-rounding",
        name: "Rounding — Step by Step",
        category: "master",
        lessons: [
          {
            id: "master-rounding-full",
            templateType: "master-method",
            learningGoal: [
              "How to round a number to the nearest 10, 100 or 1000",
              "How to find the target digit and the decider digit",
              "The rule: 0–4 round down, 5–9 round up",
              "Replace all digits to the right of the target with zeros"
            ],
            variableSets: [
              {
                name: "Amara",
                scenario: "estimates the crowd at a school sports day",
                number: 14489,
                roundTo: 1000,
                roundToWord: "nearest thousand",
                targetDigit: 4,
                targetPlace: "thousands",
                deciderDigit: 4,
                deciderPlace: "hundreds",
                rounded: 14000,
                roundDown: 14000,
                roundUp: 15000,
                direction: "down",
                unit: "people",
                digits: [1, 4, 4, 8, 9],
                roundedDigits: [1, 4, 0, 0, 0],
                columns: ["Ten Thousands", "Thousands", "Hundreds", "Tens", "Ones"],
                highlightTarget: [0, 1],
                highlightDecider: [0, 2]
              },
              {
                name: "Oliver",
                scenario: "rounds a football stadium attendance",
                number: 23756,
                roundTo: 100,
                roundToWord: "nearest hundred",
                targetDigit: 7,
                targetPlace: "hundreds",
                deciderDigit: 5,
                deciderPlace: "tens",
                rounded: 23800,
                roundDown: 23700,
                roundUp: 23800,
                direction: "up",
                unit: "fans",
                digits: [2, 3, 7, 5, 6],
                roundedDigits: [2, 3, 8, 0, 0],
                columns: ["Ten Thousands", "Thousands", "Hundreds", "Tens", "Ones"],
                highlightTarget: [0, 2],
                highlightDecider: [0, 3]
              },
              {
                name: "Fatima",
                scenario: "estimates how far her family drove on holiday",
                number: 4372,
                roundTo: 10,
                roundToWord: "nearest ten",
                targetDigit: 7,
                targetPlace: "tens",
                deciderDigit: 2,
                deciderPlace: "ones",
                rounded: 4370,
                roundDown: 4370,
                roundUp: 4380,
                direction: "down",
                unit: "miles",
                digits: [4, 3, 7, 2],
                roundedDigits: [4, 3, 7, 0],
                columns: ["Thousands", "Hundreds", "Tens", "Ones"],
                highlightTarget: [0, 2],
                highlightDecider: [0, 3]
              },
              {
                name: "Liam",
                scenario: "rounds the price of a second-hand car",
                number: 8650,
                roundTo: 1000,
                roundToWord: "nearest thousand",
                targetDigit: 8,
                targetPlace: "thousands",
                deciderDigit: 6,
                deciderPlace: "hundreds",
                rounded: 9000,
                roundDown: 8000,
                roundUp: 9000,
                direction: "up",
                unit: "pounds",
                digits: [8, 6, 5, 0],
                roundedDigits: [9, 0, 0, 0],
                columns: ["Thousands", "Hundreds", "Tens", "Ones"],
                highlightTarget: [0, 0],
                highlightDecider: [0, 1]
              },
              {
                name: "Sophie",
                scenario: "estimates the number of books in the school library",
                number: 12538,
                roundTo: 100,
                roundToWord: "nearest hundred",
                targetDigit: 5,
                targetPlace: "hundreds",
                deciderDigit: 3,
                deciderPlace: "tens",
                rounded: 12500,
                roundDown: 12500,
                roundUp: 12600,
                direction: "down",
                unit: "books",
                digits: [1, 2, 5, 3, 8],
                roundedDigits: [1, 2, 5, 0, 0],
                columns: ["Ten Thousands", "Thousands", "Hundreds", "Tens", "Ones"],
                highlightTarget: [0, 2],
                highlightDecider: [0, 3]
              },
              {
                name: "Kai",
                scenario: "rounds a shopping bill to the nearest ten pounds",
                number: 2847,
                roundTo: 10,
                roundToWord: "nearest ten",
                targetDigit: 4,
                targetPlace: "tens",
                deciderDigit: 7,
                deciderPlace: "ones",
                rounded: 2850,
                roundDown: 2840,
                roundUp: 2850,
                direction: "up",
                unit: "pounds",
                digits: [2, 8, 4, 7],
                roundedDigits: [2, 8, 5, 0],
                columns: ["Thousands", "Hundreds", "Tens", "Ones"],
                highlightTarget: [0, 2],
                highlightDecider: [0, 3]
              },
              {
                name: "Isla",
                scenario: "estimates how many people live in a small town",
                number: 31502,
                roundTo: 1000,
                roundToWord: "nearest thousand",
                targetDigit: 1,
                targetPlace: "thousands",
                deciderDigit: 5,
                deciderPlace: "hundreds",
                rounded: 32000,
                roundDown: 31000,
                roundUp: 32000,
                direction: "up",
                unit: "people",
                digits: [3, 1, 5, 0, 2],
                roundedDigits: [3, 2, 0, 0, 0],
                columns: ["Ten Thousands", "Thousands", "Hundreds", "Tens", "Ones"],
                highlightTarget: [0, 1],
                highlightDecider: [0, 2]
              },
              // --- Level 3: 6-digit numbers, round to 10000 ---
              {
                name: "Noah",
                scenario: "rounds the population of a seaside town to the nearest ten thousand",
                number: 456789, roundTo: 10000, roundToWord: "nearest ten thousand",
                targetDigit: 5, targetPlace: "ten thousands",
                deciderDigit: 6, deciderPlace: "thousands",
                rounded: 460000, roundDown: 450000, roundUp: 460000, direction: "up",
                unit: "people", difficulty: 2,
                digits: [4, 5, 6, 7, 8, 9],
                roundedDigits: [4, 6, 0, 0, 0, 0],
                columns: ["Hundred Thousands", "Ten Thousands", "Thousands", "Hundreds", "Tens", "Ones"],
                highlightTarget: [0, 1],
                highlightDecider: [0, 2]
              },
              {
                name: "Zara",
                scenario: "rounds the attendance at a music festival to the nearest ten thousand",
                number: 873214, roundTo: 10000, roundToWord: "nearest ten thousand",
                targetDigit: 7, targetPlace: "ten thousands",
                deciderDigit: 3, deciderPlace: "thousands",
                rounded: 870000, roundDown: 870000, roundUp: 880000, direction: "down",
                unit: "people", difficulty: 2,
                digits: [8, 7, 3, 2, 1, 4],
                roundedDigits: [8, 7, 0, 0, 0, 0],
                columns: ["Hundred Thousands", "Ten Thousands", "Thousands", "Hundreds", "Tens", "Ones"],
                highlightTarget: [0, 1],
                highlightDecider: [0, 2]
              },
              {
                name: "Ethan",
                scenario: "rounds a charity donation total to the nearest ten thousand",
                number: 547823, roundTo: 10000, roundToWord: "nearest ten thousand",
                targetDigit: 4, targetPlace: "ten thousands",
                deciderDigit: 7, deciderPlace: "thousands",
                rounded: 550000, roundDown: 540000, roundUp: 550000, direction: "up",
                unit: "pounds", difficulty: 2,
                digits: [5, 4, 7, 8, 2, 3],
                roundedDigits: [5, 5, 0, 0, 0, 0],
                columns: ["Hundred Thousands", "Ten Thousands", "Thousands", "Hundreds", "Tens", "Ones"],
                highlightTarget: [0, 1],
                highlightDecider: [0, 2]
              }
            ],
            screens: [
              // ---- Screen 1: HOOK / SETUP ----
              {
                type: "hook",
                title: (v) => `Round ${v.number.toLocaleString()} to the ${v.roundToWord}`,
                body: (v) => `${v.name} ${v.scenario}. The exact number is **${v.number.toLocaleString()}**, but we need it rounded to the **${v.roundToWord}**.\nRounding makes numbers easier to work with. Let's learn the method that works **every single time**!`,
                visual: {
                  component: "PlaceValueChart",
                  props: (v) => ({
                    columns: v.columns,
                    rows: [{ label: "Number", values: v.digits }],
                    highlight: []
                  })
                },
                interaction: null
              },
              // ---- Screen 2: STEP 1 — find the target and decider digits ----
              {
                type: "teach",
                title: () => "Step 1: Find the target digit and the decider",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `We're rounding to the **${v.roundToWord}**. So find the **${v.targetPlace}** digit. It's **${v.targetDigit}**.`
                  },
                  {
                    type: 'visual',
                    component: 'PlaceValueChart',
                    props: (v) => ({
                      columns: v.columns,
                      rows: [{ label: "Number", values: v.digits }],
                      highlight: [v.highlightTarget]
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Now look **one place to the right** — that's the **${v.deciderPlace}** digit. It's **${v.deciderDigit}**.\nThis is the **decider**. It tells us whether to round up or down.`
                  },
                  {
                    type: 'visual',
                    component: 'PlaceValueChart',
                    props: (v) => ({
                      columns: v.columns,
                      rows: [{ label: "Number", values: v.digits }],
                      highlight: [v.highlightTarget, v.highlightDecider]
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Target digit: **${v.targetDigit}** (${v.targetPlace}). Decider digit: **${v.deciderDigit}** (${v.deciderPlace}) ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 3: STEP 2 — apply the rule ----
              {
                type: "teach",
                title: () => "Step 2: Apply the rule and round",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `The decider digit is **${v.deciderDigit}**.\n\nHere's the rule:\n• **0, 1, 2, 3, 4** → round **down** (target digit stays the same)\n• **5, 6, 7, 8, 9** → round **up** (target digit goes up by 1)`
                  },
                  {
                    type: 'visual',
                    component: 'NumberLine',
                    props: (v) => ({
                      min: v.roundDown,
                      max: v.roundUp,
                      points: [{ value: v.number, label: String(v.number.toLocaleString()), color: "#6C5CE7" }],
                      jumps: [{ from: v.number, to: v.rounded, label: v.direction === "up" ? "rounds up" : "rounds down" }],
                      tickInterval: v.roundTo,
                      showLabels: true,
                      highlight: [v.roundDown, v.roundUp]
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => v.deciderDigit < 5
                      ? `**${v.deciderDigit}** is less than 5, so we round **down**. The ${v.targetPlace} digit **stays as ${v.targetDigit}**.`
                      : `**${v.deciderDigit}** is 5 or more, so we round **up**. The ${v.targetPlace} digit **goes up by 1**.`
                  },
                  {
                    type: 'text',
                    content: (v) => `Replace every digit to the **right** of the ${v.targetPlace} with **0**.`
                  },
                  {
                    type: 'visual',
                    component: 'PlaceValueChart',
                    props: (v) => ({
                      columns: v.columns,
                      rows: [
                        { label: "Before", values: v.digits },
                        { label: "After", values: v.roundedDigits }
                      ],
                      highlight: [v.highlightTarget]
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**${v.number.toLocaleString()}** rounded to the ${v.roundToWord} = **${v.rounded.toLocaleString()}** ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 4: YOUR TURN — multiple choice ----
              {
                type: "interact",
                title: () => "Your turn!",
                body: (v) => `${v.name} needs the answer. What is **${v.number.toLocaleString()}** rounded to the **${v.roundToWord}**?`,
                visual: {
                  component: "PlaceValueChart",
                  props: (v) => ({
                    columns: v.columns,
                    rows: [{ label: "Number", values: v.digits }],
                    highlight: [v.highlightTarget, v.highlightDecider]
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What is ${v.number.toLocaleString()} rounded to the ${v.roundToWord}?`,
                  getOptions: (v) => generateDistractors(v.rounded),
                  correctAnswer: (v) => v.rounded,
                  feedback: {
                    correct: (v) => `Brilliant! The decider digit is **${v.deciderDigit}**, so we round **${v.direction}**. **${v.number.toLocaleString()} → ${v.rounded.toLocaleString()}** ✓`,
                    incorrect: (v) => `Not quite! The decider digit is **${v.deciderDigit}**. Since ${v.deciderDigit < 5 ? `${v.deciderDigit} < 5, we round **down**` : `${v.deciderDigit} ≥ 5, we round **up**`}. The answer is **${v.rounded.toLocaleString()}**.`
                  }
                }
              },
              // ---- Screen 5: SUMMARY ----
              {
                type: "consolidate",
                title: () => "The rounding recipe!",
                body: () => `This method works for rounding to the nearest **10**, **100** or **1000** — every time:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Step 1: Find the TARGET digit", why: "The digit in the place you're rounding to (tens, hundreds, thousands)" },
                      { text: "Step 2: Look at the DECIDER", why: "The digit one place to the RIGHT of the target" },
                      { text: "Step 3: Apply the rule", why: "0–4 → round DOWN (target stays). 5–9 → round UP (target goes up by 1)" },
                      { text: "Step 4: Replace with zeros", why: "Every digit to the right of the target becomes 0. Done! ✓" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      }
    ,
      ...placevalueSubConcepts
    ]
  },

  // TOPIC: Sequences
  sequences: {
    name: "Sequences",
    subConcepts: [
      // ==========================================
      // MASTER METHOD: Finding the rule and next terms of an arithmetic sequence
      // ==========================================
      {
        id: "master-arithmetic-sequences",
        name: "Arithmetic Sequences — Step by Step",
        category: "master",
        lessons: [
          {
            id: "master-sequence-full",
            templateType: "master-method",
            learningGoal: [
              "How to find the difference between each term (each number in the pattern)",
              "How to check the difference is the same each time",
              "How to use the rule to find the next term (the next number in the pattern)"
            ],
            variableSets: [
              {
                name: "Evie",
                scenario: "notices a pattern in how many seats each row of the school hall has",
                terms: [5, 12, 19, 26],
                difference: 7,
                nextTerm: 33,
                secondNextTerm: 40,
                isIncreasing: true,
                firstTerm: 5,
                unit: "seats",
                diffs: [7, 7, 7],
                extendedTerms: [5, 12, 19, 26, 33, 40]
              },
              {
                name: "Noah",
                scenario: "tracks how much money he saves each week for a new bike",
                terms: [8, 14, 20, 26, 32],
                difference: 6,
                nextTerm: 38,
                secondNextTerm: 44,
                isIncreasing: true,
                firstTerm: 8,
                unit: "pounds",
                diffs: [6, 6, 6, 6],
                extendedTerms: [8, 14, 20, 26, 32, 38, 44]
              },
              {
                name: "Priya",
                scenario: "counts how many stickers she has left as she gives some away each day",
                terms: [50, 46, 42, 38],
                difference: -4,
                nextTerm: 34,
                secondNextTerm: 30,
                isIncreasing: false,
                firstTerm: 50,
                unit: "stickers",
                diffs: [-4, -4, -4],
                extendedTerms: [50, 46, 42, 38, 34, 30]
              },
              {
                name: "Marcus",
                scenario: "tracks how many laps of the track he runs each training session",
                terms: [3, 8, 13, 18, 23],
                difference: 5,
                nextTerm: 28,
                secondNextTerm: 33,
                isIncreasing: true,
                firstTerm: 3,
                unit: "laps",
                diffs: [5, 5, 5, 5],
                extendedTerms: [3, 8, 13, 18, 23, 28, 33]
              },
              {
                name: "Aisha",
                scenario: "records the temperature dropping each hour on a winter evening",
                terms: [12, 9, 6, 3],
                difference: -3,
                nextTerm: 0,
                secondNextTerm: -3,
                isIncreasing: false,
                firstTerm: 12,
                unit: "°C",
                diffs: [-3, -3, -3],
                extendedTerms: [12, 9, 6, 3, 0, -3]
              },
              {
                name: "Jake",
                scenario: "counts the number of tiles in each row of a growing pattern",
                terms: [4, 15, 26, 37],
                difference: 11,
                nextTerm: 48,
                secondNextTerm: 59,
                isIncreasing: true,
                firstTerm: 4,
                unit: "tiles",
                diffs: [11, 11, 11],
                extendedTerms: [4, 15, 26, 37, 48, 59]
              },
              {
                name: "Lily",
                scenario: "watches a candle getting shorter every hour",
                terms: [30, 24, 18, 12],
                difference: -6,
                nextTerm: 6,
                secondNextTerm: 0,
                isIncreasing: false,
                firstTerm: 30,
                unit: "cm",
                diffs: [-6, -6, -6],
                extendedTerms: [30, 24, 18, 12, 6, 0]
              },
              // --- Level 3: Big steps, crossing zero ---
              {
                name: "A train company",
                scenario: "tracks how many passengers board at each stop along a new route",
                terms: [120, 145, 170, 195],
                difference: 25, nextTerm: 220, secondNextTerm: 245,
                isIncreasing: true, firstTerm: 120, unit: "passengers",
                diffs: [25, 25, 25],
                extendedTerms: [120, 145, 170, 195, 220, 245],
                difficulty: 2
              },
              {
                name: "Kai",
                scenario: "records the water level in a tank that is slowly draining",
                terms: [45, 30, 15, 0],
                difference: -15, nextTerm: -15, secondNextTerm: -30,
                isIncreasing: false, firstTerm: 45, unit: "litres",
                diffs: [-15, -15, -15],
                extendedTerms: [45, 30, 15, 0, -15, -30],
                difficulty: 2
              },
              {
                name: "A ski lift operator",
                scenario: "checks the altitude reading as the cable car descends the mountain",
                terms: [84, 67, 50, 33],
                difference: -17, nextTerm: 16, secondNextTerm: -1,
                isIncreasing: false, firstTerm: 84, unit: "metres",
                diffs: [-17, -17, -17],
                extendedTerms: [84, 67, 50, 33, 16, -1],
                difficulty: 2
              }
            ],
            screens: [
              // ---- Screen 1: HOOK / SETUP ----
              {
                type: "hook",
                title: (v) => `What comes next: ${v.terms.join(', ')}, ...?`,
                body: (v) => `${v.name} ${v.scenario}. The numbers are: **${v.terms.join(', ')}**.\nCan you spot the pattern? There's a simple method that **always** works for finding the next number!`,
                visual: {
                  component: "SequenceChain",
                  props: (v) => ({
                    terms: v.terms,
                    differences: [],
                    showDifferences: false,
                    showNext: true,
                    nextValue: "?"
                  })
                },
                interaction: null
              },
              // ---- Screen 2: STEP 1 — find the differences ----
              {
                type: "teach",
                title: () => "Step 1: Find the difference between each pair",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `Look at each pair of **neighbouring** terms (each number in the pattern is called a "term"). Subtract the first from the second to find the **difference**.`
                  },
                  {
                    type: 'visual',
                    component: 'SequenceChain',
                    props: (v) => ({
                      terms: v.terms,
                      differences: v.diffs.map(d => `${d > 0 ? '+' : ''}${d}`),
                      showDifferences: true,
                      showNext: false
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => {
                      const parts = [];
                      for (let i = 0; i < v.terms.length - 1; i++) {
                        parts.push(`**${v.terms[i + 1]} − ${v.terms[i]} = ${v.difference > 0 ? '+' : ''}${v.difference}**`);
                      }
                      return parts.join('\n');
                    }
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => {
                      const steps = [];
                      for (let i = 0; i < v.terms.length - 1; i++) {
                        steps.push({
                          text: `${v.terms[i + 1]} − ${v.terms[i]}`,
                          result: `= ${v.difference > 0 ? '+' : ''}${v.difference}`
                        });
                      }
                      return { steps, allRevealed: true };
                    }
                  },
                  {
                    type: 'text',
                    content: (v) => `The difference is **${v.difference > 0 ? '+' : ''}${v.difference}** every time — it's **constant** ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 3: STEP 2 — use the rule to find next terms ----
              {
                type: "teach",
                title: () => "Step 2: Use the rule to find the next terms",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `The rule is: each term is the previous term **${v.difference > 0 ? 'plus' : 'minus'} ${Math.abs(v.difference)}**.\nSo to find the next term, take the **last known term** and ${v.difference > 0 ? 'add' : 'subtract'} **${Math.abs(v.difference)}**.`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        {
                          text: `Last known term: ${v.terms[v.terms.length - 1]}`,
                          why: `This is the last number in the sequence`
                        },
                        {
                          text: `${v.terms[v.terms.length - 1]} ${v.difference > 0 ? '+' : '−'} ${Math.abs(v.difference)}`,
                          result: `= ${v.nextTerm}`
                        },
                        {
                          text: `${v.nextTerm} ${v.difference > 0 ? '+' : '−'} ${Math.abs(v.difference)}`,
                          result: `= ${v.secondNextTerm}`
                        }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Let's see those new terms on the number line:`
                  },
                  {
                    type: 'visual',
                    component: 'SequenceChain',
                    props: (v) => {
                      const extDiffs = [];
                      for (let i = 0; i < v.extendedTerms.length - 1; i++) {
                        extDiffs.push(`${v.difference > 0 ? '+' : ''}${v.difference}`);
                      }
                      return {
                        terms: v.extendedTerms,
                        differences: extDiffs,
                        showDifferences: true,
                        showNext: false,
                        highlightTerms: v.extendedTerms.map((_, i) => i).filter(i => i >= v.terms.length)
                      };
                    }
                  },
                  {
                    type: 'text',
                    content: (v) => `The next two terms are **${v.nextTerm}** and **${v.secondNextTerm}** ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 4: YOUR TURN — multiple choice ----
              {
                type: "interact",
                title: () => "Your turn!",
                body: (v) => `Now try one yourself!\n\nThe sequence is: **${v.terms.join(', ')}, ...**\n\nWhat comes next? Look at how the numbers change each time.`,
                visual: {
                  component: "SequenceChain",
                  props: (v) => ({
                    terms: v.terms,
                    differences: [],
                    showDifferences: false,
                    showNext: true,
                    nextValue: "?"
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What is the next number after ${v.terms[v.terms.length - 1]}?`,
                  getOptions: (v) => generateDistractors(v.nextTerm),
                  correctAnswer: (v) => v.nextTerm,
                  feedback: {
                    correct: (v) => `Brilliant! **${v.terms[v.terms.length - 1]} ${v.difference > 0 ? '+' : '−'} ${Math.abs(v.difference)} = ${v.nextTerm}** ✓`,
                    incorrect: (v) => `Not quite! The difference is **${v.difference > 0 ? '+' : ''}${v.difference}**, so ${v.terms[v.terms.length - 1]} ${v.difference > 0 ? '+' : '−'} ${Math.abs(v.difference)} = **${v.nextTerm}**.`
                  }
                }
              },
              // ---- Screen 5: SUMMARY ----
              {
                type: "consolidate",
                title: () => "The sequence-cracking recipe!",
                body: () => `Follow these steps for **any** sequence where the difference is constant:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Step 1: Find the difference between each pair of numbers", why: "Subtract each number from the next one" },
                      { text: "Step 2: Check the difference is CONSTANT (the same every time)", why: "If it's the same every time, you've found the rule!" },
                      { text: "Step 3: Add (or subtract) the difference to find the next number", why: "Take the last number and apply the rule. Done! ✓" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      }
    ,
      ...sequencesSubConcepts
    ]
  },

  // TOPIC: Prime Numbers & Factors
  primenumbersfactors: {
    name: "Prime Numbers & Factors",
    subConcepts: [
      // ==========================================
      // MASTER METHOD: Finding all factors of a number systematically
      // ==========================================
      {
        id: "master-finding-factors",
        name: "Finding All Factors — Step by Step",
        category: "master",
        lessons: [
          {
            id: "master-factors-full",
            templateType: "master-method",
            learningGoal: [
              "How to find factor pairs by testing 1, 2, 3, 4... in order",
              "How to know when you've found them all (the pairs start repeating)",
              "How to list all factors in order"
            ],
            variableSets: [
              {
                name: "Amara",
                scenario: "needs to arrange 36 chairs into equal rows for an assembly",
                number: 36,
                factorPairs: [[1, 36], [2, 18], [3, 12], [4, 9], [6, 6]],
                allFactors: [1, 2, 3, 4, 6, 9, 12, 18, 36],
                factorCount: 9,
                stopAt: 6,
                unit: "chairs",
                firstFewPairs: [[1, 36], [2, 18], [3, 12]],
                remainingPairs: [[4, 9], [6, 6]]
              },
              {
                name: "Oliver",
                scenario: "shares 24 football stickers equally between friends",
                number: 24,
                factorPairs: [[1, 24], [2, 12], [3, 8], [4, 6]],
                allFactors: [1, 2, 3, 4, 6, 8, 12, 24],
                factorCount: 8,
                stopAt: 4,
                unit: "stickers",
                firstFewPairs: [[1, 24], [2, 12], [3, 8]],
                remainingPairs: [[4, 6]]
              },
              {
                name: "Priya",
                scenario: "arranges 30 cupcakes on plates for a bake sale",
                number: 30,
                factorPairs: [[1, 30], [2, 15], [3, 10], [5, 6]],
                allFactors: [1, 2, 3, 5, 6, 10, 15, 30],
                factorCount: 8,
                stopAt: 5,
                unit: "cupcakes",
                firstFewPairs: [[1, 30], [2, 15], [3, 10]],
                remainingPairs: [[5, 6]]
              },
              {
                name: "Jake",
                scenario: "tiles a bathroom wall using 48 square tiles",
                number: 48,
                factorPairs: [[1, 48], [2, 24], [3, 16], [4, 12], [6, 8]],
                allFactors: [1, 2, 3, 4, 6, 8, 12, 16, 24, 48],
                factorCount: 10,
                stopAt: 6,
                unit: "tiles",
                firstFewPairs: [[1, 48], [2, 24], [3, 16]],
                remainingPairs: [[4, 12], [6, 8]]
              },
              {
                name: "Sophie",
                scenario: "plants 20 flowers in equal rows in the school garden",
                number: 20,
                factorPairs: [[1, 20], [2, 10], [4, 5]],
                allFactors: [1, 2, 4, 5, 10, 20],
                factorCount: 6,
                stopAt: 4,
                unit: "flowers",
                firstFewPairs: [[1, 20], [2, 10]],
                remainingPairs: [[4, 5]]
              },
              {
                name: "Kai",
                scenario: "organises 42 books on shelves in the classroom",
                number: 42,
                factorPairs: [[1, 42], [2, 21], [3, 14], [6, 7]],
                allFactors: [1, 2, 3, 6, 7, 14, 21, 42],
                factorCount: 8,
                stopAt: 6,
                unit: "books",
                firstFewPairs: [[1, 42], [2, 21], [3, 14]],
                remainingPairs: [[6, 7]]
              },
              {
                name: "Isla",
                scenario: "splits 28 sweets into equal bags for a party",
                number: 28,
                factorPairs: [[1, 28], [2, 14], [4, 7]],
                allFactors: [1, 2, 4, 7, 14, 28],
                factorCount: 6,
                stopAt: 5,
                unit: "sweets",
                firstFewPairs: [[1, 28], [2, 14]],
                remainingPairs: [[4, 7]]
              },
              // --- Level 3: Numbers with many factors (72, 84, 96) ---
              {
                name: "A florist",
                scenario: "arranges 72 roses into identical bouquets for a wedding",
                number: 72, difficulty: 2,
                factorPairs: [[1, 72], [2, 36], [3, 24], [4, 18], [6, 12], [8, 9]],
                allFactors: [1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72],
                factorCount: 12, stopAt: 8, unit: "roses",
                firstFewPairs: [[1, 72], [2, 36], [3, 24]],
                remainingPairs: [[4, 18], [6, 12], [8, 9]]
              },
              {
                name: "Mr Watson",
                scenario: "seats 84 guests into equal tables at a charity dinner",
                number: 84, difficulty: 2,
                factorPairs: [[1, 84], [2, 42], [3, 28], [4, 21], [6, 14], [7, 12]],
                allFactors: [1, 2, 3, 4, 6, 7, 12, 14, 21, 28, 42, 84],
                factorCount: 12, stopAt: 9, unit: "guests",
                firstFewPairs: [[1, 84], [2, 42], [3, 28]],
                remainingPairs: [[4, 21], [6, 14], [7, 12]]
              },
              {
                name: "Mrs Chang",
                scenario: "divides 96 coloured pencils equally between art tables",
                number: 96, difficulty: 2,
                factorPairs: [[1, 96], [2, 48], [3, 32], [4, 24], [6, 16], [8, 12]],
                allFactors: [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 96],
                factorCount: 12, stopAt: 9, unit: "pencils",
                firstFewPairs: [[1, 96], [2, 48], [3, 32]],
                remainingPairs: [[4, 24], [6, 16], [8, 12]]
              }
            ],
            screens: [
              // ---- Screen 1: HOOK / SETUP ----
              {
                type: "hook",
                title: (v) => `Find all the factors of ${v.number}`,
                body: (v) => `${v.name} ${v.scenario}. To know **all the possible ways** to arrange them equally, we need to find every **factor** (a number that divides in exactly) of **${v.number}**.\nA **factor** is a number that divides into ${v.number} with **no remainder**. Let's find them all — in order, one by one!`,
                visual: {
                  component: "BarModel",
                  props: (v) => ({
                    segments: [{ value: 1, label: String(v.number), color: "#c084fc" }],
                    totalLabel: `Factors of ${v.number} = ?`
                  })
                },
                interaction: null
              },
              // ---- Screen 2: STEP 1 — find the first few factor pairs ----
              {
                type: "teach",
                title: () => "Step 1: Find factor pairs — start from 1",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `Start with **1**. Does 1 go into ${v.number}? Always yes!\n**1 × ${v.number} = ${v.number}** — that's our first pair.`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `Try 1:`, result: `1 × ${v.number} = ${v.number} ✓` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Now try **2**. Does ${v.number} ÷ 2 give a whole number?\n**${v.factorPairs[1][0]} × ${v.factorPairs[1][1]} = ${v.number}** — yes! That's another pair.`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.firstFewPairs.map((pair) => ({
                        text: `Try ${pair[0]}:`,
                        result: `${pair[0]} × ${pair[1]} = ${v.number} ✓`
                      })),
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `We keep going: try **3**, then **4**, then **5**...\nSkip any number that doesn't divide evenly (leaves a remainder).`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.factorPairs.map((pair) => ({
                        text: `${pair[0]} × ${pair[1]}`,
                        result: `= ${v.number} ✓`
                      })),
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Found **${v.factorPairs.length}** factor pairs so far ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 3: STEP 2 — know when to stop ----
              {
                type: "teach",
                title: () => "Step 2: Know when to stop!",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `Here's the clever bit. Look at the pairs:\n${v.factorPairs.map(p => `**${p[0]} × ${p[1]}**`).join(',  ')}\n\nThe first number in each pair is getting **bigger**. The second number is getting **smaller**.`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.factorPairs.map((pair) => ({
                        text: `${pair[0]} × ${pair[1]}`,
                        result: `= ${v.number}`
                      })),
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => {
                      const lastPair = v.factorPairs[v.factorPairs.length - 1];
                      if (lastPair[0] === lastPair[1]) {
                        return `When the two numbers **meet** (${lastPair[0]} × ${lastPair[1]}), you've found them all! We can stop checking here because any factor bigger than ${lastPair[0]} would have a matching partner we've already found.`;
                      }
                      return `When the two numbers **nearly meet** or **cross over**, you've found them all! We can stop checking because any factor bigger than ${lastPair[0]} would have a matching partner we've already found.`;
                    }
                  },
                  {
                    type: 'text',
                    content: (v) => `Now list every factor in order:`
                  },
                  {
                    type: 'visual',
                    component: 'BarModel',
                    props: (v) => ({
                      segments: v.allFactors.map((f, i) => ({
                        value: 1,
                        label: String(f),
                        color: i % 2 === 0 ? "#c084fc" : "#a78bfa"
                      })),
                      totalLabel: `All ${v.factorCount} factors of ${v.number}`
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**Both** numbers in each pair are factors — so ${v.factorPairs.map(p => `${p[0]} × ${p[1]}`).join(', ')} means **${v.allFactors.join(', ')}** are ALL factors of ${v.number}.\n\nThat's **${v.factorCount}** factors in total ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 4: YOUR TURN — multiple choice ----
              {
                type: "interact",
                title: () => "Your turn!",
                body: (v) => `Now try one yourself! Find **all** the factor pairs of **${v.number}**.\n\nStart from 1 × ${v.number}, then try 2, 3, 4... and stop when the pairs start repeating.\n\nHow many **different factors** does ${v.number} have in total?`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: `1 × ${v.number}`, result: `= ${v.number} ✓` },
                      { text: `2 × ? = ${v.number}`, result: v.number % 2 === 0 ? "Yes!" : "Doesn't work" },
                      { text: "Keep checking 3, 4, 5...", result: "Stop when pairs repeat" }
                    ],
                    allRevealed: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `How many factors does ${v.number} have?`,
                  getOptions: (v) => generateDistractors(v.factorCount),
                  correctAnswer: (v) => v.factorCount,
                  feedback: {
                    correct: (v) => `Brilliant! **${v.number}** has exactly **${v.factorCount}** factors: ${v.allFactors.join(', ')}. That's ${v.factorCount} ways to arrange ${v.number} ${v.unit} equally! ✓`,
                    incorrect: (v) => `Not quite! Count each unique number from the pairs: **${v.allFactors.join(', ')}** — that's **${v.factorCount}** factors.`
                  }
                }
              },
              // ---- Screen 5: SUMMARY ----
              {
                type: "consolidate",
                title: () => "The factor-finding recipe!",
                body: () => `Use this method to find **every** factor of any number:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Step 1: Start with 1 × the number", why: "1 is always a factor — so is the number itself" },
                      { text: "Step 2: Try 2, 3, 4, 5... in order", why: "For each one, check: does it divide in with no remainder? If yes, write the pair!" },
                      { text: "Step 3: Stop when the pairs meet or cross", why: "When the first number catches up to the second, you've found them all" },
                      { text: "Step 4: List all the unique factors in order", why: "Collect every number from your pairs — done! ✓" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      }
    ,
      ...primenumbersfactorsSubConcepts
    ]
  },

  longdivision: {
    name: "Long Division",
    subConcepts: [
      // ==========================================
      // MASTER METHOD: Short Division (Bus Stop Method) — 1-digit divisor
      // ==========================================
      {
        id: "master-bus-stop",
        name: "The Bus Stop Method — Step by Step",
        category: "master",
        lessons: [
          {
            id: "master-bus-stop-full",
            templateType: "master-method",
            learningGoal: [
              "The standard bus stop method for dividing by a single number",
              "How to divide the first number and carry the remainder",
              "How to move to the next number and keep dividing",
              "How to handle remainders at the end"
            ],
            variableSets: [
              // --- Set 1: no remainder ---
              {
                name: "Mrs Patel", scenario: "shares sweets equally among children at a party",
                dividend: 936, divisor: 4, digits: [9, 3, 6],
                quotient: 234, remainder: 0, hasRemainder: false,
                step1_digit: 9, step1_result: 2, step1_remainder: 1,
                step2_digit: 13, step2_result: 3, step2_remainder: 1,
                step3_digit: 16, step3_result: 4, step3_remainder: 0,
                unit: "sweets"
              },
              // --- Set 2: no remainder ---
              {
                name: "Oliver", scenario: "sorts football stickers into equal piles for his friends",
                dividend: 846, divisor: 6, digits: [8, 4, 6],
                quotient: 141, remainder: 0, hasRemainder: false,
                step1_digit: 8, step1_result: 1, step1_remainder: 2,
                step2_digit: 24, step2_result: 4, step2_remainder: 0,
                step3_digit: 6, step3_result: 1, step3_remainder: 0,
                unit: "stickers"
              },
              // --- Set 3: no remainder ---
              {
                name: "Coach Williams", scenario: "divides players into equal teams for sports day",
                dividend: 585, divisor: 5, digits: [5, 8, 5],
                quotient: 117, remainder: 0, hasRemainder: false,
                step1_digit: 5, step1_result: 1, step1_remainder: 0,
                step2_digit: 8, step2_result: 1, step2_remainder: 3,
                step3_digit: 35, step3_result: 7, step3_remainder: 0,
                unit: "players"
              },
              // --- Set 4: no remainder ---
              {
                name: "Mrs Chen", scenario: "packs books into boxes for the school library",
                dividend: 872, divisor: 8, digits: [8, 7, 2],
                quotient: 109, remainder: 0, hasRemainder: false,
                step1_digit: 8, step1_result: 1, step1_remainder: 0,
                step2_digit: 7, step2_result: 0, step2_remainder: 7,
                step3_digit: 72, step3_result: 9, step3_remainder: 0,
                unit: "books"
              },
              // --- Set 5: remainder ---
              {
                name: "Amara", scenario: "shares marbles equally between her friends",
                dividend: 743, divisor: 3, digits: [7, 4, 3],
                quotient: 247, remainder: 2, hasRemainder: true,
                step1_digit: 7, step1_result: 2, step1_remainder: 1,
                step2_digit: 14, step2_result: 4, step2_remainder: 2,
                step3_digit: 23, step3_result: 7, step3_remainder: 2,
                unit: "marbles"
              },
              // --- Set 6: remainder ---
              {
                name: "Mr Hughes", scenario: "arranges chairs into equal rows for assembly",
                dividend: 895, divisor: 7, digits: [8, 9, 5],
                quotient: 127, remainder: 6, hasRemainder: true,
                step1_digit: 8, step1_result: 1, step1_remainder: 1,
                step2_digit: 19, step2_result: 2, step2_remainder: 5,
                step3_digit: 55, step3_result: 7, step3_remainder: 6,
                unit: "chairs"
              },
              // --- Set 7: remainder ---
              {
                name: "Priya", scenario: "divides beads equally into bags for a craft fair",
                dividend: 958, divisor: 9, digits: [9, 5, 8],
                quotient: 106, remainder: 4, hasRemainder: true,
                step1_digit: 9, step1_result: 1, step1_remainder: 0,
                step2_digit: 5, step2_result: 0, step2_remainder: 5,
                step3_digit: 58, step3_result: 6, step3_remainder: 4,
                unit: "beads"
              },
              // --- Level 3: 4-digit ÷ 2-digit (matches question bank Level 3) ---
              {
                name: "A warehouse manager", scenario: "distributes boxes of supplies equally across delivery vans",
                dividend: 2496, divisor: 52, digits: [2, 4, 9, 6],
                quotient: 48, remainder: 0, hasRemainder: false, is4Digit: true, is2DigitDivisor: true, difficulty: 2,
                step1_digit: 2, step1_result: 0, step1_remainder: 2,
                step2_digit: 24, step2_result: 0, step2_remainder: 24,
                step3_digit: 249, step3_result: 4, step3_remainder: 41,
                step4_digit: 416, step4_result: 8, step4_remainder: 0,
                unit: "boxes"
              },
              {
                name: "The school bursar", scenario: "splits the annual stationery budget equally across departments",
                dividend: 3276, divisor: 78, digits: [3, 2, 7, 6],
                quotient: 42, remainder: 0, hasRemainder: false, is4Digit: true, is2DigitDivisor: true, difficulty: 2,
                step1_digit: 3, step1_result: 0, step1_remainder: 3,
                step2_digit: 32, step2_result: 0, step2_remainder: 32,
                step3_digit: 327, step3_result: 4, step3_remainder: 15,
                step4_digit: 156, step4_result: 2, step4_remainder: 0,
                unit: "pounds"
              },
              {
                name: "A charity", scenario: "shares donated books equally between school libraries across the county",
                dividend: 5244, divisor: 92, digits: [5, 2, 4, 4],
                quotient: 57, remainder: 0, hasRemainder: false, is4Digit: true, is2DigitDivisor: true, difficulty: 2,
                step1_digit: 5, step1_result: 0, step1_remainder: 5,
                step2_digit: 52, step2_result: 0, step2_remainder: 52,
                step3_digit: 524, step3_result: 5, step3_remainder: 64,
                step4_digit: 644, step4_result: 7, step4_remainder: 0,
                unit: "books"
              }
            ],
            screens: [
              // ---- Screen 1: HOOK / SETUP ----
              {
                type: "hook",
                title: (v) => `Let's work out ${v.dividend} ÷ ${v.divisor}!`,
                body: (v) => `${v.name} ${v.scenario}. There are **${v.dividend}** ${v.unit} to share equally between **${v.divisor}** groups.\n\nWe'll use the **bus stop method**. Look at the diagram — the number we're dividing by (${v.divisor}) sits outside on the left, the big number (${v.dividend}) sits inside under the line, and we write the answer on top.\n\nWe work through each number **from left to right**.`,
                visual: {
                  component: "BusStopDiagram",
                  props: (v) => ({
                    divisor: v.divisor,
                    dividend: v.dividend,
                    steps: v.digits.map(d => ({ digit: String(d), result: "?", remainder: 0, carry: false })),
                    showAnswer: false
                  })
                },
                interaction: null
              },
              // ---- Screen 2: STEP 1 — Divide first numbers ----
              {
                type: "teach",
                title: () => "Step 1: Start from the left",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => v.is2DigitDivisor
                      ? `Write ${v.divisor} outside the "bus stop" and **${v.dividend}** inside. We still go **left to right** — but since we're dividing by a bigger number, it won't go into the first number or two.`
                      : `Write ${v.divisor} outside the "bus stop" and **${v.dividend}** inside. Now look at the **first number**: **${v.digits[0]}**.`
                  },
                  {
                    type: 'visual',
                    component: 'BusStopDiagram',
                    props: (v) => ({
                      divisor: v.divisor,
                      dividend: v.dividend,
                      steps: [
                        { digit: String(v.digits[0]), result: String(v.step1_result), remainder: v.step1_remainder, carry: v.step1_remainder > 0 },
                        ...v.digits.slice(1).map(d => ({ digit: String(d), result: "?", remainder: 0, carry: false }))
                      ],
                      showAnswer: true,
                      highlightStep: 0
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => {
                      if (v.step1_result === 0) {
                        return `**${v.divisor}** is bigger than **${v.digits[0]}**, so it doesn't go in at all. Write **0** above and carry **${v.step1_remainder}** to the next number.`;
                      }
                      if (v.step1_remainder > 0) {
                        return `**${v.divisor}** goes into **${v.digits[0]}** — that's **${toWord(v.step1_result)}** time${v.step1_result !== 1 ? 's' : ''}. Write **${v.step1_result}** above. The remainder **${v.step1_remainder}** carries to the next number.`;
                      }
                      return `**${v.divisor}** goes into **${v.digits[0]}** — that's **${toWord(v.step1_result)}** time with nothing left over. Write **${v.step1_result}** above and move to the next number.`;
                    }
                  },
                  {
                    type: 'visual',
                    component: 'BusStopDiagram',
                    props: (v) => ({
                      divisor: v.divisor,
                      dividend: v.dividend,
                      steps: [
                        { digit: String(v.digits[0]), result: String(v.step1_result), remainder: v.step1_remainder, carry: v.step1_remainder > 0 },
                        { digit: String(v.digits[1]), result: String(v.step2_result), remainder: v.step2_remainder, carry: v.step2_remainder > 0 },
                        ...v.digits.slice(2).map(d => ({ digit: String(d), result: "?", remainder: 0, carry: false }))
                      ],
                      showAnswer: true,
                      highlightStep: 1
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => {
                      if (v.step2_result === 0) {
                        return `**${v.divisor}** doesn't go into **${v.step2_digit}** at all! Write **0** above. Carry **${v.step2_remainder}** to the next number.`;
                      }
                      if (v.step2_remainder > 0) {
                        return `**${v.divisor}** goes into **${v.step2_digit}** — that's **${toWord(v.step2_result)}** time${v.step2_result !== 1 ? 's' : ''}. Write **${v.step2_result}** above. Carry **${v.step2_remainder}** to the next number.`;
                      }
                      return `**${v.divisor}** goes into **${v.step2_digit}** — that's **${toWord(v.step2_result)}** time${v.step2_result !== 1 ? 's' : ''} with nothing left over. Write **${v.step2_result}** above. ✓`;
                    }
                  },
                  // -- Extra step for 4-digit numbers: step 3 (third number) --
                  ...(v.is4Digit ? [
                    {
                      type: 'visual',
                      component: 'BusStopDiagram',
                      props: (v) => ({
                        divisor: v.divisor,
                        dividend: v.dividend,
                        steps: [
                          { digit: String(v.digits[0]), result: String(v.step1_result), remainder: v.step1_remainder, carry: v.step1_remainder > 0 },
                          { digit: String(v.digits[1]), result: String(v.step2_result), remainder: v.step2_remainder, carry: v.step2_remainder > 0 },
                          { digit: String(v.digits[2]), result: String(v.step3_result), remainder: v.step3_remainder, carry: v.step3_remainder > 0 },
                          { digit: String(v.digits[3]), result: "?", remainder: 0, carry: false }
                        ],
                        showAnswer: true,
                        highlightStep: 2
                      })
                    },
                    {
                      type: 'text',
                      content: (v) => {
                        if (v.step3_result === 0) {
                          return `**${v.divisor}** doesn't go into **${v.step3_digit}** at all! Write **0** above. Carry **${v.step3_remainder}** to the last number.`;
                        }
                        if (v.step3_remainder > 0) {
                          return `**${v.divisor}** goes into **${v.step3_digit}** — that's **${toWord(v.step3_result)}** time${v.step3_result !== 1 ? 's' : ''}. Write **${v.step3_result}** above. Carry **${v.step3_remainder}** to the last number.`;
                        }
                        return `**${v.divisor}** goes into **${v.step3_digit}** — that's **${toWord(v.step3_result)}** time${v.step3_result !== 1 ? 's' : ''} with nothing left over. Write **${v.step3_result}** above. ✓`;
                      }
                    }
                  ] : [])
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 3: Finish the last number ----
              {
                type: "teach",
                title: (v) => v.is4Digit ? "Step 2: Finish the last number" : "Step 2: Finish the last number",
                bodyParts: (v) => {
                  // For 4-digit: last step is step4; for 3-digit: last step is step3
                  const lastIdx = v.digits.length - 1;
                  const prevStep = v.is4Digit ? v.step3_remainder : v.step2_remainder;
                  const lastDigitVal = v.is4Digit ? v.step4_digit : v.step3_digit;
                  const lastResult = v.is4Digit ? v.step4_result : v.step3_result;
                  const lastRemainder = v.is4Digit ? v.step4_remainder : v.step3_remainder;

                  // Build all completed steps for the diagram
                  const allSteps = [
                    { digit: String(v.digits[0]), result: String(v.step1_result), remainder: v.step1_remainder, carry: v.step1_remainder > 0 },
                    { digit: String(v.digits[1]), result: String(v.step2_result), remainder: v.step2_remainder, carry: v.step2_remainder > 0 },
                    { digit: String(v.digits[2]), result: String(v.step3_result), remainder: v.is4Digit ? v.step3_remainder : lastRemainder, carry: v.is4Digit ? v.step3_remainder > 0 : false },
                    ...(v.is4Digit ? [{ digit: String(v.digits[3]), result: String(v.step4_result), remainder: v.step4_remainder, carry: false }] : [])
                  ];

                  return [
                    {
                      type: 'text',
                      content: (v2) => {
                        if (prevStep > 0) {
                          return `We carried **${prevStep}** from the previous column. Put it next to the next number to make **${lastDigitVal}**.`;
                        }
                        return `No remainder from before. The last number is just **${v2.digits[lastIdx]}**.`;
                      }
                    },
                    {
                      type: 'visual',
                      component: 'BusStopDiagram',
                      props: () => ({
                        divisor: v.divisor,
                        dividend: v.dividend,
                        steps: allSteps,
                        showAnswer: true,
                        highlightStep: lastIdx
                      })
                    },
                    {
                      type: 'text',
                      content: () => {
                        if (lastResult === 0 && v.hasRemainder) {
                          return `**${v.divisor}** doesn't go into **${lastDigitVal}** at all. Write **0** above. The remainder is **${lastRemainder}**.`;
                        }
                        if (v.hasRemainder) {
                          return `**${v.divisor}** goes into **${lastDigitVal}** — that's **${toWord(lastResult)}** time${lastResult !== 1 ? 's' : ''}. Write **${lastResult}** above. We have **${lastRemainder}** left over.`;
                        }
                        return `**${v.divisor}** goes into **${lastDigitVal}** — that's **${toWord(lastResult)}** time${lastResult !== 1 ? 's' : ''} with nothing left over. Write **${lastResult}** above — it divides perfectly!`;
                      }
                    },
                    {
                      type: 'visual',
                      component: 'BusStopDiagram',
                      props: () => ({
                        divisor: v.divisor,
                        dividend: v.dividend,
                        steps: allSteps,
                        showAnswer: true
                      })
                    },
                    {
                      type: 'text',
                      content: () => {
                        if (v.hasRemainder) {
                          return `Read the top line: **${v.quotient} remainder ${v.remainder}**. Each group gets **${v.quotient}** ${v.unit}, with **${v.remainder}** left over! ✓`;
                        }
                        return `Read the top line: **${v.quotient}**. Each group gets **${v.quotient}** ${v.unit}! ✓`;
                      }
                    }
                  ];
                },
                visual: null,
                interaction: null
              },
              // ---- Screen 4: INTERACT — Multiple choice ----
              {
                type: "interact",
                title: () => "Your turn!",
                body: (v) => `Now try one yourself! ${v.name} has **${v.dividend}** ${v.unit} to share equally between **${v.divisor}** groups.\n\nUse the bus stop method — work through each number from left to right.`,
                visual: {
                  component: "BusStopDiagram",
                  props: (v) => ({
                    divisor: v.divisor,
                    dividend: v.dividend,
                    steps: v.digits.map(d => ({ digit: String(d), result: "?", remainder: 0, carry: false })),
                    showAnswer: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What is ${v.dividend} ÷ ${v.divisor}?`,
                  getOptions: (v) => v.hasRemainder
                    ? generateDivisionDistractors(v.quotient, v.remainder)
                    : generateDistractors(v.quotient),
                  correctAnswer: (v) => v.hasRemainder
                    ? `${v.quotient} remainder ${v.remainder}`
                    : v.quotient,
                  feedback: {
                    correct: (v) => {
                      if (v.hasRemainder) {
                        return `Brilliant! **${v.dividend} ÷ ${v.divisor} = ${v.quotient} remainder ${v.remainder}**. Each group gets **${v.quotient}** ${v.unit} with **${v.remainder}** left over! ✓`;
                      }
                      return `Brilliant! **${v.dividend} ÷ ${v.divisor} = ${v.quotient}**. Each group gets **${v.quotient}** ${v.unit}! ✓`;
                    },
                    incorrect: (v) => {
                      if (v.hasRemainder) {
                        return `Not quite! ${v.dividend} ÷ ${v.divisor} = **${v.quotient} remainder ${v.remainder}**. Try going number by number: ${v.digits[0]} ÷ ${v.divisor}, then carry the remainder across.`;
                      }
                      return `Not quite! ${v.dividend} ÷ ${v.divisor} = **${v.quotient}**. Try going number by number: ${v.digits[0]} ÷ ${v.divisor}, then carry the remainder across.`;
                    }
                  }
                }
              },
              // ---- Screen 5: CONSOLIDATE — Summary recipe ----
              {
                type: "consolidate",
                title: () => "The bus stop recipe!",
                body: (v) => v.is2DigitDivisor
                  ? `The bus stop method also works for **bigger divisors** — just expect more carrying! Follow these steps:`
                  : `The bus stop method works for **any** division by a single number. Follow these steps every time:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Step 1: Divide the first number", why: "How many times does the outside number go into the first number inside? Write the answer above, carry any left over." },
                      { text: "Step 2: Move to the next number", why: "If there's a remainder, put it next to the next number. Then divide again and carry." },
                      { text: "Step 3: Divide the last number", why: "Same again! Any left over at the end is written as 'r' after your answer." },
                      { text: "Step 4: Read the answer from the top!", why: "The numbers you wrote above give you the answer. Done! ✓" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      }
    ,
      ...longdivisionSubConcepts
    ]
  },

  // TOPIC: Area & Perimeter
  areaperimeter: {
    name: "Area & Perimeter",
    subConcepts: [
      // ==========================================
      // MASTER METHOD: Area of rectangles and compound L-shapes
      // ==========================================
      {
        id: "master-area-rectangles",
        name: "Area of Rectangles & Compound Shapes — Step by Step",
        category: "master",
        lessons: [
          {
            id: "master-area-full",
            templateType: "master-method",
            learningGoal: [
              "How to find the area of a rectangle using length × width",
              "How to split an L-shape into two rectangles",
              "How to find the area of each rectangle and add them together"
            ],
            variableSets: [
              // --- Set 1 ---
              {
                name: "Jasmine", scenario: "is measuring her garden to lay new turf",
                length: 8, width: 5, area: 40,
                intLength: 7, intWidth: 4, intArea: 28,
                totalLength: 10, totalWidth: 8, cutLength: 4, cutWidth: 3,
                rect1_l: 10, rect1_w: 5, rect1_area: 50,
                rect2_l: 6, rect2_w: 3, rect2_area: 18,
                totalArea: 68, unit: "m²", dimUnit: "m"
              },
              // --- Set 2 ---
              {
                name: "Mr Thompson", scenario: "needs carpet for the school hall",
                length: 12, width: 7, area: 84,
                intLength: 9, intWidth: 6, intArea: 54,
                totalLength: 14, totalWidth: 9, cutLength: 6, cutWidth: 4,
                rect1_l: 14, rect1_w: 5, rect1_area: 70,
                rect2_l: 8, rect2_w: 4, rect2_area: 32,
                totalArea: 102, unit: "m²", dimUnit: "m"
              },
              // --- Set 3 ---
              {
                name: "Bella", scenario: "is painting one wall of her bedroom",
                length: 6, width: 4, area: 24,
                intLength: 11, intWidth: 3, intArea: 33,
                totalLength: 9, totalWidth: 7, cutLength: 3, cutWidth: 4,
                rect1_l: 9, rect1_w: 3, rect1_area: 27,
                rect2_l: 6, rect2_w: 4, rect2_area: 24,
                totalArea: 51, unit: "m²", dimUnit: "m"
              },
              // --- Set 4 ---
              {
                name: "Coach Ahmed", scenario: "is marking out a mini football pitch",
                length: 15, width: 9, area: 135,
                intLength: 10, intWidth: 8, intArea: 80,
                totalLength: 15, totalWidth: 10, cutLength: 5, cutWidth: 4,
                rect1_l: 15, rect1_w: 6, rect1_area: 90,
                rect2_l: 10, rect2_w: 4, rect2_area: 40,
                totalArea: 130, unit: "m²", dimUnit: "m"
              },
              // --- Set 5 ---
              {
                name: "Mrs Kumar", scenario: "is tiling the kitchen floor",
                length: 5, width: 3, area: 15,
                intLength: 8, intWidth: 6, intArea: 48,
                totalLength: 8, totalWidth: 6, cutLength: 3, cutWidth: 4,
                rect1_l: 8, rect1_w: 2, rect1_area: 16,
                rect2_l: 5, rect2_w: 4, rect2_area: 20,
                totalArea: 36, unit: "m²", dimUnit: "m"
              },
              // --- Set 6 ---
              {
                name: "Tom", scenario: "is covering his desk with sticky-back plastic",
                length: 9, width: 6, area: 54,
                intLength: 7, intWidth: 5, intArea: 35,
                totalLength: 12, totalWidth: 8, cutLength: 5, cutWidth: 3,
                rect1_l: 12, rect1_w: 5, rect1_area: 60,
                rect2_l: 7, rect2_w: 3, rect2_area: 21,
                totalArea: 81, unit: "cm²", dimUnit: "cm"
              },
              // --- Set 7 ---
              {
                name: "Miss Obi", scenario: "is ordering paving slabs for the playground",
                length: 10, width: 8, area: 80,
                intLength: 6, intWidth: 9, intArea: 54,
                totalLength: 13, totalWidth: 10, cutLength: 4, cutWidth: 5,
                rect1_l: 13, rect1_w: 5, rect1_area: 65,
                rect2_l: 9, rect2_w: 5, rect2_area: 45,
                totalArea: 110, unit: "m²", dimUnit: "m"
              },
              // --- Level 3: Larger L-shapes ---
              {
                name: "A landscape gardener", scenario: "is laying turf for a large L-shaped lawn",
                length: 20, width: 15, area: 300, difficulty: 2,
                intLength: 14, intWidth: 11, intArea: 154,
                totalLength: 20, totalWidth: 15, cutLength: 12, cutWidth: 6,
                rect1_l: 20, rect1_w: 9, rect1_area: 180,
                rect2_l: 8, rect2_w: 6, rect2_area: 48,
                totalArea: 228, unit: "m²", dimUnit: "m"
              },
              {
                name: "A builder", scenario: "is calculating the floor area of an L-shaped office extension",
                length: 25, width: 18, area: 450, difficulty: 2,
                intLength: 16, intWidth: 12, intArea: 192,
                totalLength: 25, totalWidth: 18, cutLength: 10, cutWidth: 8,
                rect1_l: 25, rect1_w: 10, rect1_area: 250,
                rect2_l: 15, rect2_w: 8, rect2_area: 120,
                totalArea: 370, unit: "m²", dimUnit: "m"
              },
              {
                name: "An architect", scenario: "is designing an L-shaped school hall",
                length: 18, width: 12, area: 216, difficulty: 2,
                intLength: 13, intWidth: 7, intArea: 91,
                totalLength: 18, totalWidth: 14, cutLength: 8, cutWidth: 5,
                rect1_l: 18, rect1_w: 9, rect1_area: 162,
                rect2_l: 10, rect2_w: 5, rect2_area: 50,
                totalArea: 212, unit: "m²", dimUnit: "m"
              }
            ],
            screens: [
              // ---- Screen 1: HOOK / SETUP ----
              {
                type: "hook",
                title: (v) => `How much space is ${v.length}${v.dimUnit} × ${v.width}${v.dimUnit}?`,
                body: (v) => `${v.name} ${v.scenario}.\n\nLook at the rectangle below — **${v.length}${v.dimUnit}** along the bottom and **${v.width}${v.dimUnit}** up the side.\n\n**Area** tells us how much flat space is inside. Think of it as counting how many 1${v.dimUnit} × 1${v.dimUnit} squares fit inside!`,
                visual: {
                  component: "RectangleDiagram",
                  props: (v) => ({
                    length: v.length,
                    width: v.width,
                    dimUnit: v.dimUnit,
                    showGrid: true,
                    areaLabel: `? ${v.unit}`
                  })
                },
                interaction: null
              },
              // ---- Screen 2: STEP 1 — Rectangle area = l × w ----
              {
                type: "teach",
                title: () => "Step 1: Area of a rectangle",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `For any rectangle, the formula is dead simple:\n**Area = length × width**\n\nImagine the rectangle is **${v.length}** squares along and **${v.width}** squares up. Count them all!`
                  },
                  {
                    type: 'visual',
                    component: 'RectangleDiagram',
                    props: (v) => ({
                      length: v.length,
                      width: v.width,
                      dimUnit: v.dimUnit,
                      showGrid: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `So we multiply **${v.length}** × **${v.width}**...`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `Area = ${v.length} × ${v.width}`, why: "Plug in the numbers", result: `= ${v.area} ${v.unit}` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `The area is **${v.area} ${v.unit}**. Always write the little ² after the unit — it means "squared"! ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 3: STEP 2 — Compound L-shape ----
              {
                type: "teach",
                title: () => "Step 2: Compound shapes — split and add!",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `What if the shape isn't a simple rectangle? An **L-shape** is a rectangle with a corner cut out. The trick: **split it into two rectangles**.\n\nYou can split it **horizontally** or **vertically** — either way works! Look at the diagram — the red dashed line shows one way to split it:`
                  },
                  {
                    type: 'visual',
                    component: 'LShapeDiagram',
                    props: (v) => ({
                      totalLength: v.totalLength,
                      totalWidth: v.totalWidth,
                      cutLength: v.cutLength,
                      cutWidth: v.cutWidth,
                      rect1: { label: "A", length: v.rect1_l, width: v.rect1_w },
                      rect2: { label: "B", length: v.rect2_l, width: v.rect2_w },
                      dimUnit: v.dimUnit,
                      showSplit: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Rectangle A is **${v.rect1_l}${v.dimUnit} × ${v.rect1_w}${v.dimUnit}**. Rectangle B is **${v.rect2_l}${v.dimUnit} × ${v.rect2_w}${v.dimUnit}**.`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `Rectangle A = ${v.rect1_l} × ${v.rect1_w}`, why: "Area of the first part", result: `= ${v.rect1_area} ${v.unit}` },
                        { text: `Rectangle B = ${v.rect2_l} × ${v.rect2_w}`, why: "Area of the second part", result: `= ${v.rect2_area} ${v.unit}` },
                        { text: `Total = ${v.rect1_area} + ${v.rect2_area}`, why: "Add both areas together", result: `= ${v.totalArea} ${v.unit}` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `The total area of the L-shape is **${v.totalArea} ${v.unit}**. Split, calculate, add — works every time! ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 4: INTERACT — Multiple choice ----
              {
                type: "interact",
                title: () => "Your turn!",
                body: (v) => `${v.name} has a rectangle that is **${v.intLength}${v.dimUnit}** long and **${v.intWidth}${v.dimUnit}** wide. What is the area?`,
                visual: {
                  component: "RectangleDiagram",
                  props: (v) => ({
                    length: v.intLength,
                    width: v.intWidth,
                    dimUnit: v.dimUnit,
                    areaLabel: `? ${v.unit}`
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What is ${v.intLength} × ${v.intWidth}?`,
                  getOptions: (v) => generateDistractors(v.intArea),
                  correctAnswer: (v) => v.intArea,
                  feedback: {
                    correct: (v) => `Brilliant! **${v.intLength} × ${v.intWidth} = ${v.intArea} ${v.unit}**. That's the area! ✓`,
                    incorrect: (v) => `Not quite! Area = length × width = ${v.intLength} × ${v.intWidth} = **${v.intArea} ${v.unit}**. Multiply the two sides together!`
                  }
                }
              },
              // ---- Screen 5: CONSOLIDATE — Summary recipe ----
              {
                type: "consolidate",
                title: () => "The area recipe!",
                body: () => `Finding area is all about **counting the flat space inside**. Here's your recipe:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Rectangle: Area = length × width", why: "Multiply the two sides. Don't forget the ² on the unit!" },
                      { text: "L-shape: Split into two rectangles", why: "Draw a line to break it into Rectangle A and Rectangle B." },
                      { text: "Find each area, then add them together", why: "Total area = Area A + Area B. Done! ✓" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      }
    ,
      ...areaperimeterSubConcepts
    ]
  },

  // TOPIC: Volume
  volume: {
    name: "Volume",
    subConcepts: [
      // ==========================================
      // MASTER METHOD: Volume of cuboids (l × w × h)
      // ==========================================
      {
        id: "master-volume-cuboids",
        name: "Volume of Cuboids — Step by Step",
        category: "master",
        lessons: [
          {
            id: "master-volume-full",
            templateType: "master-method",
            learningGoal: [
              "How to identify the three dimensions of a cuboid",
              "How to find the base area by multiplying length × width",
              "How to find the volume by multiplying base area × height"
            ],
            variableSets: [
              // --- Set 1 ---
              {
                name: "Ruby", scenario: "is filling a fish tank with water",
                length: 8, width: 5, height: 4,
                baseArea: 40, volume: 160, unit: "cm³", dimUnit: "cm"
              },
              // --- Set 2 ---
              {
                name: "Mr Dawson", scenario: "is building a wooden storage box",
                length: 10, width: 6, height: 3,
                baseArea: 60, volume: 180, unit: "cm³", dimUnit: "cm"
              },
              // --- Set 3 ---
              {
                name: "Zara", scenario: "is wrapping a birthday present in a box",
                length: 7, width: 4, height: 5,
                baseArea: 28, volume: 140, unit: "cm³", dimUnit: "cm"
              },
              // --- Set 4 ---
              {
                name: "Coach Barker", scenario: "is ordering sand for the long-jump pit",
                length: 6, width: 3, height: 2,
                baseArea: 18, volume: 36, unit: "m³", dimUnit: "m"
              },
              // --- Set 5 ---
              {
                name: "Mrs Taylor", scenario: "is planting flowers in a rectangular planter",
                length: 12, width: 4, height: 3,
                baseArea: 48, volume: 144, unit: "cm³", dimUnit: "cm"
              },
              // --- Set 6 ---
              {
                name: "Ethan", scenario: "is packing toys into a shipping crate",
                length: 9, width: 5, height: 6,
                baseArea: 45, volume: 270, unit: "cm³", dimUnit: "cm"
              },
              // --- Set 7 ---
              {
                name: "Miss Parry", scenario: "is calculating space in a classroom cupboard",
                length: 5, width: 4, height: 8,
                baseArea: 20, volume: 160, unit: "cm³", dimUnit: "cm"
              },
              // --- Level 3: Multi-digit products ---
              {
                name: "A swimming pool manager", scenario: "is calculating the volume of the learner pool",
                length: 25, width: 14, height: 6,
                baseArea: 350, volume: 2100, unit: "m³", dimUnit: "m", difficulty: 2
              },
              {
                name: "A delivery company", scenario: "needs to know the capacity of a shipping container",
                length: 18, width: 12, height: 8,
                baseArea: 216, volume: 1728, unit: "m³", dimUnit: "m", difficulty: 2
              },
              {
                name: "A builder", scenario: "is digging a foundation trench for a new house",
                length: 30, width: 15, height: 9,
                baseArea: 450, volume: 4050, unit: "m³", dimUnit: "m", difficulty: 2
              }
            ],
            screens: [
              // ---- Screen 1: HOOK / SETUP ----
              {
                type: "hook",
                title: (v) => `How much fits inside?`,
                body: (v) => `${v.name} ${v.scenario}. The cuboid is **${v.length} ${v.dimUnit}** long, **${v.width} ${v.dimUnit}** wide, and **${v.height} ${v.dimUnit}** tall.\n\nThe diagram below shows the shape (not drawn to exact scale).\n\n**Volume** tells us how much space is inside a 3D shape. Let's work it out!`,
                visual: {
                  component: "CuboidDiagram",
                  props: (v) => ({
                    length: v.length,
                    width: v.width,
                    height: v.height,
                    dimUnit: v.dimUnit
                  })
                },
                interaction: null
              },
              // ---- Screen 2: STEP 1 — Find the base area ----
              {
                type: "teach",
                title: () => "Step 1: Find the base area",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `Here's our cuboid. Imagine looking **straight down** at it — you see a flat rectangle. That's the **base**.`
                  },
                  {
                    type: 'visual',
                    component: 'RectangleDiagram',
                    props: (v) => ({
                      length: v.length,
                      width: v.width,
                      dimUnit: v.dimUnit,
                      showGrid: true,
                      areaLabel: `Base = ${v.length} × ${v.width} = ?`
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `The base is **${v.length}${v.dimUnit}** × **${v.width}${v.dimUnit}**. Let's work out the area:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `Base area = ${v.length} × ${v.width}`, why: "Multiply length by width", result: `= ${v.baseArea} ${v.dimUnit}²` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `The base area is **${v.baseArea} ${v.dimUnit}²**. Think of it as **${v.baseArea}** little squares on the floor. ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 3: STEP 2 — Multiply by height ----
              {
                type: "teach",
                title: () => "Step 2: Stack it up — multiply by the height!",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `We've got **${v.baseArea}** squares on the base — that's one layer of little cubes. Now stack **${v.height} layers** on top of each other, like building a wall of blocks:`
                  },
                  {
                    type: 'visual',
                    component: 'CuboidDiagram',
                    props: (v) => ({
                      length: v.length,
                      width: v.width,
                      height: v.height,
                      dimUnit: v.dimUnit,
                      showLayers: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**${v.baseArea}** squares per layer × **${v.height}** layers = the total number of cubes inside!`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `Volume = base area × height`, why: "Stack the base layer up by the height", result: `= ${v.baseArea} × ${v.height}` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `So we multiply **${v.baseArea}** × **${v.height}**...`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `Base area = ${v.length} × ${v.width} = ${v.baseArea}`, why: "From Step 1", result: "✓" },
                        { text: `Volume = ${v.baseArea} × ${v.height}`, why: "Multiply base by height", result: `= ${v.volume} ${v.unit}` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `The volume is **${v.volume} ${v.unit}** (${v.dimUnit}³ means "${v.dimUnit} cubed" — that's **length × width × height**). That's **${v.volume}** tiny cubes inside! ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 4: INTERACT — Multiple choice ----
              {
                type: "interact",
                title: () => "Your turn!",
                body: (v) => `${v.name} has a cuboid that is **${v.length} ${v.dimUnit}** long, **${v.width} ${v.dimUnit}** wide, and **${v.height} ${v.dimUnit}** tall. What is the volume?\n\nRemember: Volume = length × width × height.`,
                visual: {
                  component: "CuboidDiagram",
                  props: (v) => ({
                    length: v.length,
                    width: v.width,
                    height: v.height,
                    dimUnit: v.dimUnit
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What is ${v.length} × ${v.width} × ${v.height}?`,
                  getOptions: (v) => generateDistractors(v.volume),
                  correctAnswer: (v) => v.volume,
                  feedback: {
                    correct: (v) => `Brilliant! **${v.length} × ${v.width} × ${v.height} = ${v.volume} ${v.unit}**. That's the volume! ✓`,
                    incorrect: (v) => `Not quite! Volume = length × width × height = ${v.length} × ${v.width} × ${v.height} = **${v.volume} ${v.unit}**. Try it in two steps: base first, then times height!`
                  }
                }
              },
              // ---- Screen 5: CONSOLIDATE — Summary recipe ----
              {
                type: "consolidate",
                title: () => "The volume recipe!",
                body: () => `Volume measures the **3D space inside** a shape. Here's your two-step recipe:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Step 1: Find the base area (length × width)", why: "That's the flat floor of the cuboid — how many squares fit on it." },
                      { text: "Step 2: Multiply by the height", why: "Stack that layer up! Base area × height = volume." },
                      { text: "Don't forget the ³ on the unit!", why: "cm³ (centimetres cubed — that means length × width × height) or m³ — the little 3 means it's a 3D measurement. Done! ✓" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      }
    ,
      ...volumeSubConcepts
    ]
  },

  anglesshapes: {
    name: "Angles & Shapes",
    subConcepts: [
      {
        id: "master-missing-angle-triangle",
        name: "Finding a Missing Angle in a Triangle",
        category: "master",
        lessons: [
          {
            id: "master-triangle-angles",
            templateType: "master-method",
            learningGoal: [
              "Angles in a triangle always add up to 180°",
              "How to add the two known angles together",
              "How to subtract from 180° to find the missing angle"
            ],
            variableSets: [
              // Set 1 — right-angled
              {
                name: "Rohan",
                scenario: "is designing a roof for a model house",
                angle1: 90, angle2: 35, knownSum: 125, missingAngle: 55,
                triangleType: "right-angled", isRightAngled: true,
                interactAngle1: 90, interactAngle2: 42, interactKnownSum: 132, interactMissingAngle: 48
              },
              // Set 2 — right-angled
              {
                name: "Isla",
                scenario: "is drawing a road sign for her school project",
                angle1: 90, angle2: 50, knownSum: 140, missingAngle: 40,
                triangleType: "right-angled", isRightAngled: true,
                interactAngle1: 90, interactAngle2: 28, interactKnownSum: 118, interactMissingAngle: 62
              },
              // Set 3 — isosceles
              {
                name: "Oliver",
                scenario: "is measuring the angles on a tent shape for Design Technology",
                angle1: 70, angle2: 70, knownSum: 140, missingAngle: 40,
                triangleType: "isosceles (two angles are equal)", isRightAngled: false,
                interactAngle1: 55, interactAngle2: 80, interactKnownSum: 135, interactMissingAngle: 45
              },
              // Set 4 — isosceles
              {
                name: "Amara",
                scenario: "is sketching a kite design for a spring fair",
                angle1: 50, angle2: 50, knownSum: 100, missingAngle: 80,
                triangleType: "isosceles (two angles are equal)", isRightAngled: false,
                interactAngle1: 65, interactAngle2: 40, interactKnownSum: 105, interactMissingAngle: 75
              },
              // Set 5 — scalene
              {
                name: "Freddie",
                scenario: "is planning a triangular flower bed in the school garden",
                angle1: 65, angle2: 45, knownSum: 110, missingAngle: 70,
                triangleType: "scalene (all angles different)", isRightAngled: false,
                interactAngle1: 50, interactAngle2: 72, interactKnownSum: 122, interactMissingAngle: 58
              },
              // Set 6 — scalene
              {
                name: "Priya",
                scenario: "is working out the angles on a bridge support for her engineering project",
                angle1: 55, angle2: 80, knownSum: 135, missingAngle: 45,
                triangleType: "scalene (all angles different)", isRightAngled: false,
                interactAngle1: 73, interactAngle2: 42, interactKnownSum: 115, interactMissingAngle: 65
              },
              // Set 7 — scalene
              {
                name: "George",
                scenario: "is calculating angles on a triangular sail for a model boat",
                angle1: 40, angle2: 25, knownSum: 65, missingAngle: 115,
                triangleType: "scalene (all angles different)", isRightAngled: false,
                interactAngle1: 35, interactAngle2: 60, interactKnownSum: 95, interactMissingAngle: 85
              },
              // --- Level 3: Obtuse given angles ---
              {
                name: "Lily",
                scenario: "is designing a triangular logo for a school newsletter",
                angle1: 112, angle2: 23, knownSum: 135, missingAngle: 45,
                triangleType: "obtuse scalene (one angle over 90°)",
                isRightAngled: false, difficulty: 2,
                interactAngle1: 48, interactAngle2: 67, interactKnownSum: 115, interactMissingAngle: 65
              },
              {
                name: "Mr Davis",
                scenario: "is calculating the angles of a triangular roof panel",
                angle1: 105, angle2: 38, knownSum: 143, missingAngle: 37,
                triangleType: "obtuse scalene (one angle over 90°)",
                isRightAngled: false, difficulty: 2,
                interactAngle1: 58, interactAngle2: 74, interactKnownSum: 132, interactMissingAngle: 48
              },
              {
                name: "Ava",
                scenario: "is measuring the angles on a triangular piece of stained glass",
                angle1: 95, angle2: 47, knownSum: 142, missingAngle: 38,
                triangleType: "obtuse scalene (one angle over 90°)",
                isRightAngled: false, difficulty: 2,
                interactAngle1: 43, interactAngle2: 85, interactKnownSum: 128, interactMissingAngle: 52
              }
            ],
            screens: [
              // ---- Screen 1: HOOK / SETUP ----
              {
                type: "hook",
                title: (v) => `Find the missing angle!`,
                body: (v) => `${v.name} ${v.scenario}. The triangle has two known angles: **${v.angle1}°** and **${v.angle2}°**.${v.isRightAngled ? `\n\nRemember: the small square symbol (□) means a **right angle** — exactly **90°**.` : ``}\n\nBut what is the **third angle**? There's a golden rule that makes this easy...\n\nAngles in a triangle **always** add up to **180°**.`,
                visual: {
                  component: "AngleDiagram",
                  props: (v) => ({
                    angle1: v.angle1,
                    angle2: v.angle2,
                    angle3: v.missingAngle,
                    showAngle3: false,
                    totalLabel: "Total: 180°"
                  })
                },
                interaction: null
              },
              // ---- Screen 2: STEP 1 — Add the known angles ----
              {
                type: "teach",
                title: () => "Step 1: Add the two known angles",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `The **golden rule**: angles in a triangle **always** add up to **180°**.\nSo first, let's add the two angles we already know.`
                  },
                  {
                    type: 'visual',
                    component: 'AngleDiagram',
                    props: (v) => ({
                      angle1: v.angle1,
                      angle2: v.angle2,
                      angle3: v.missingAngle,
                      showAngle3: false,
                      totalLabel: "Total: 180°"
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**${v.angle1}° + ${v.angle2}° = ${v.knownSum}°**\nThe two known angles add up to **${v.knownSum}°**.`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `${v.angle1}° + ${v.angle2}°`, result: `= ${v.knownSum}°` },
                        { text: `That leaves: 180° − ${v.knownSum}°`, result: `= ?°` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `We know two angles add up to **${v.knownSum}°**. Now we need to subtract from **180°** to find the missing angle.`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 3: STEP 2 — Subtract from 180° ----
              {
                type: "teach",
                title: () => "Step 2: Subtract from 180°",
                bodyParts: [
                  {
                    type: 'text',
                    content: (v) => `The total must be **180°**. We've already got **${v.knownSum}°**.\nSo the missing angle is what's **left over**.`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `Known angles: ${v.angle1}° + ${v.angle2}°`, result: `= ${v.knownSum}°` },
                        { text: `Missing angle: 180° − ${v.knownSum}°`, result: `= ${v.missingAngle}°` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**180° − ${v.knownSum}° = ${v.missingAngle}°**\nThe missing angle is **${v.missingAngle}°**!`
                  },
                  {
                    type: 'visual',
                    component: 'AngleDiagram',
                    props: (v) => ({
                      angle1: v.angle1,
                      angle2: v.angle2,
                      angle3: v.missingAngle,
                      showAngle3: true,
                      totalLabel: "Total: 180° ✓"
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `This is ${/^[aeiou]/i.test(v.triangleType) ? 'an' : 'a'} **${v.triangleType}** triangle. All three angles add up to 180°! ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 4: INTERACT — MC question ----
              {
                type: "interact",
                title: () => "Your turn!",
                body: (v) => `A triangle has angles of **${v.interactAngle1}°** and **${v.interactAngle2}°**. What is the missing angle?\n\nRemember: add the two known angles, then subtract from 180°.`,
                visual: {
                  component: "AngleDiagram",
                  props: (v) => ({
                    angle1: v.interactAngle1,
                    angle2: v.interactAngle2,
                    angle3: v.interactMissingAngle,
                    showAngle3: false,
                    totalLabel: "Total: 180°"
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What is the missing angle?`,
                  getOptions: (v) => generateDistractors(v.interactMissingAngle),
                  correctAnswer: (v) => v.interactMissingAngle,
                  feedback: {
                    correct: (v) => `Brilliant! **180° − ${v.interactKnownSum}° = ${v.interactMissingAngle}°**. The missing angle is **${v.interactMissingAngle}°**! ✓`,
                    incorrect: (v) => `Not quite! Add the two known angles: ${v.interactAngle1}° + ${v.interactAngle2}° = ${v.interactKnownSum}°. Then subtract from 180°: 180° − ${v.interactKnownSum}° = **${v.interactMissingAngle}°**.`
                  }
                }
              },
              // ---- Screen 5: CONSOLIDATE — Summary recipe ----
              {
                type: "consolidate",
                title: () => "The missing angle recipe!",
                body: () => `Every triangle's angles add up to **180°**. Use these two steps every time:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "Step 1: Add the two known angles together", why: "This tells you how much of the 180° is already used up." },
                      { text: "Step 2: Subtract that total from 180°", why: "Whatever is left over is the missing angle!" },
                      { text: "Check: all three angles should add up to 180°", why: "If they don't, go back and re-check your adding and subtracting. ✓" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      }
    ,
      ...anglesshapesSubConcepts
    ]
  },

  // TOPIC: Data Handling
  datahandling: {
    name: "Data Handling",
    subConcepts: [
      {
        id: "master-mean-average",
        name: "Calculating the Mean Average",
        category: "master",
        lessons: [
          {
            id: "master-mean-calculation",
            templateType: "master-method",
            learningGoal: [
              "The mean is the total of all values divided by how many there are",
              "How to add up a set of numbers carefully",
              "How to divide the total by the count to find the mean"
            ],
            variableSets: [
              // Set 1 — test scores
              {
                name: "Ava",
                scenario: "got these marks in her last five spelling tests",
                values: [8, 6, 9, 5, 7],
                total: 35,
                count: 5,
                mean: 7,
                unit: "marks"
              },
              // Set 2 — race times
              {
                name: "Liam",
                scenario: "timed his five 100m sprint attempts in PE",
                values: [18, 22, 16, 19, 25],
                total: 100,
                count: 5,
                mean: 20,
                unit: "seconds"
              },
              // Set 3 — heights
              {
                name: "Sophie",
                scenario: "measured the heights of five sunflowers in the school garden",
                values: [32, 28, 41, 24, 35],
                total: 160,
                count: 5,
                mean: 32,
                unit: "cm"
              },
              // Set 4 — temperature readings
              {
                name: "Ravi",
                scenario: "recorded the midday temperature each day for a school science project",
                values: [12, 15, 8, 14, 11],
                total: 60,
                count: 5,
                mean: 12,
                unit: "°C"
              },
              // Set 5 — pocket money
              {
                name: "Ella",
                scenario: "asked five friends how much pocket money they got this week",
                values: [3, 5, 4, 6, 2],
                total: 20,
                count: 5,
                mean: 4,
                unit: "pounds"
              },
              // Set 6 — goals scored
              {
                name: "Marcus",
                scenario: "counted how many goals his football team scored in five matches",
                values: [2, 4, 1, 3, 5],
                total: 15,
                count: 5,
                mean: 3,
                unit: "goals"
              },
              // Set 7 — book pages
              {
                name: "Freya",
                scenario: "tracked how many pages she read each evening this week",
                values: [14, 22, 18, 26, 10],
                total: 90,
                count: 5,
                mean: 18,
                unit: "pages"
              },
              // --- Level 3: Reverse mean — find the missing value given the mean ---
              {
                name: "Miss Clarke",
                scenario: "says the mean of five test scores is 14. Four of the scores are known",
                isReverse: true,
                values: [12, 15, 18, 11, 14],
                knownValues: [12, 15, 18, 11],
                missingValue: 14,
                knownTotal: 56,
                total: 70, count: 5, mean: 14,
                unit: "marks", difficulty: 2
              },
              {
                name: "Coach Robinson",
                scenario: "says the mean of six race times is 25 seconds. Five of the times are known",
                isReverse: true,
                values: [22, 28, 30, 19, 26, 25],
                knownValues: [22, 28, 30, 19, 26],
                missingValue: 25,
                knownTotal: 125,
                total: 150, count: 6, mean: 25,
                unit: "seconds", difficulty: 2
              },
              {
                name: "Mrs Patel",
                scenario: "says the mean height of five sunflowers is 38 cm. Four heights are known",
                isReverse: true,
                values: [35, 42, 32, 40, 41],
                knownValues: [35, 42, 32, 40],
                missingValue: 41,
                knownTotal: 149,
                total: 190, count: 5, mean: 38,
                unit: "cm", difficulty: 2
              }
            ],
            screens: [
              // ---- Screen 1: HOOK / SETUP ----
              {
                type: "hook",
                title: (v) => v.isReverse ? `Find the missing value!` : `What's the average?`,
                body: (v) => v.isReverse
                  ? `${v.name} ${v.scenario}: **${v.knownValues.join(', ')}** and one missing value.\n\nThe **mean** of all **${v.count}** values is **${v.mean}** ${v.unit}. Can you work backwards to find the missing one?`
                  : `${v.name} ${v.scenario}: **${v.values.join(', ')}** ${v.unit}.\n\nThe **mean average** (usually just called "the mean") tells us what a **fair share** would be — if you could spread the total out equally, what would each value be? It's just two simple steps!`,
                visual: {
                  component: "BarModel",
                  props: (v) => v.isReverse ? ({
                    segments: [...v.knownValues.map((val, i) => ({
                      value: val,
                      label: `${val}`,
                      color: ['#c084fc', '#818cf8', '#38bdf8', '#34d399', '#fbbf24', '#fb923c'][i % 6]
                    })), {
                      value: v.mean,
                      label: '?',
                      color: '#f87171'
                    }],
                    totalLabel: `Mean = ${v.mean} — what is the missing value?`
                  }) : ({
                    segments: v.values.map((val, i) => ({
                      value: val,
                      label: `${val}`,
                      color: ['#c084fc', '#818cf8', '#38bdf8', '#34d399', '#fbbf24', '#fb923c'][i % 6]
                    })),
                    totalLabel: `${v.count} values — what's the average?`
                  })
                },
                interaction: null
              },
              // ---- Screen 2: STEP 1 — Add all values (forward) or find total from mean (reverse) ----
              {
                type: "teach",
                title: (v) => v.isReverse ? "Step 1: Work out the total" : "Step 1: Add all the values together",
                bodyParts: (v) => v.isReverse ? [
                  {
                    type: 'text',
                    content: (v) => `We know the **mean is ${v.mean}** and there are **${v.count}** values.\n\nSince mean = total ÷ count, we can work backwards:\n**Total = Mean × Count**`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `Mean = ${v.mean}`, why: `Given in the question.` },
                        { text: `Count = ${v.count}`, why: `How many values altogether (including the missing one).` },
                        { text: `Total = ${v.mean} × ${v.count}`, result: `= ${v.total}` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `All **${v.count}** values must add up to **${v.total}**. Now we can find the missing one! ✓`
                  }
                ] : [
                  {
                    type: 'text',
                    content: (v) => `To find the **mean**, first we need the **total**.\nAdd up all **${v.count}** values carefully.`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `The values: ${v.values.join(', ')}`, why: `We have ${v.count} numbers to add together.` },
                        { text: `${v.values.join(' + ')}`, result: `= ${v.total}` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `The **total** is **${v.total}** ${v.unit}.`
                  },
                  {
                    type: 'visual',
                    component: 'BarModel',
                    props: (v) => ({
                      segments: [{ value: v.total, label: `Total: ${v.total}`, color: "#818cf8" }],
                      totalLabel: `All ${v.count} values added together`
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Now we know the total. Next we need to **share it equally**. ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 3: STEP 2 — Divide by count (forward) or subtract known values (reverse) ----
              {
                type: "teach",
                title: (v) => v.isReverse ? "Step 2: Subtract the known values" : "Step 2: Divide by how many values",
                bodyParts: (v) => v.isReverse ? [
                  {
                    type: 'text',
                    content: (v) => `We know the total is **${v.total}**. The known values are **${v.knownValues.join(', ')}**.\n\nAdd up the known values, then subtract from the total.`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `Known values: ${v.knownValues.join(' + ')}`, result: `= ${v.knownTotal}` },
                        { text: `Total must be: ${v.total}`, why: `From Step 1 (Mean × Count)` },
                        { text: `Missing value = ${v.total} - ${v.knownTotal}`, result: `= ${v.missingValue}` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `The missing value is **${v.missingValue} ${v.unit}**! ✓`
                  },
                  {
                    type: 'visual',
                    component: 'BarModel',
                    props: (v) => ({
                      segments: v.values.map((val, i) => ({
                        value: val,
                        label: `${val}`,
                        color: i === v.values.length - 1 ? '#34d399' : ['#c084fc', '#818cf8', '#38bdf8', '#34d399', '#fbbf24', '#fb923c'][i % 6]
                      })),
                      totalLabel: `All ${v.count} values — mean = ${v.mean} ${v.unit} ✓`
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Check: ${v.values.join(' + ')} = ${v.total}. And ${v.total} ÷ ${v.count} = ${v.mean}. ✓`
                  }
                ] : [
                  {
                    type: 'text',
                    content: (v) => `The mean is like **sharing the total equally**.\nWe had **${v.count}** values, so we divide the total by **${v.count}**.`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `Total: ${v.total}`, why: `All the values added together.` },
                        { text: `Count: ${v.count}`, why: `How many values there are.` },
                        { text: `Mean = ${v.total} ÷ ${v.count}`, result: `= ${v.mean}` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**${v.total} ÷ ${v.count} = ${v.mean}**\nThe mean average is **${v.mean} ${v.unit}**.`
                  },
                  {
                    type: 'visual',
                    component: 'BarModel',
                    props: (v) => ({
                      segments: v.values.map(() => ({
                        value: v.mean,
                        label: `${v.mean}`,
                        color: "#34d399"
                      })),
                      totalLabel: `Each share = ${v.mean} ${v.unit} (the mean) ✓`
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `If all **${v.count}** values were the **same**, they'd each be **${v.mean} ${v.unit}**. That's what the mean tells us! ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 4: INTERACT — MC question ----
              {
                type: "interact",
                title: () => "Your turn!",
                body: (v) => v.isReverse
                  ? `The mean of **${v.count}** values is **${v.mean}** ${v.unit}. The known values are: **${v.knownValues.join(', ')}**.\nWhat is the **missing value**?`
                  : `${v.name} ${v.scenario}: **${v.values.join(', ')}** ${v.unit}.\nWhat is the **mean average**?`,
                visual: {
                  component: "BarModel",
                  props: (v) => v.isReverse ? ({
                    segments: [...v.knownValues.map((val, i) => ({
                      value: val,
                      label: `${val}`,
                      color: ['#c084fc', '#818cf8', '#38bdf8', '#34d399', '#fbbf24', '#fb923c'][i % 6]
                    })), {
                      value: v.mean,
                      label: '?',
                      color: '#f87171'
                    }],
                    totalLabel: `Mean = ${v.mean} ${v.unit}`
                  }) : ({
                    segments: v.values.map((val, i) => ({
                      value: val,
                      label: `${val}`,
                      color: ['#c084fc', '#818cf8', '#38bdf8', '#34d399', '#fbbf24', '#fb923c'][i % 6]
                    })),
                    totalLabel: `Total: ${v.total} ${v.unit}`
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => v.isReverse
                    ? `What is the missing value?`
                    : `What is the mean of ${v.values.join(', ')}?`,
                  getOptions: (v) => generateDistractors(v.isReverse ? v.missingValue : v.mean),
                  correctAnswer: (v) => v.isReverse ? v.missingValue : v.mean,
                  feedback: {
                    correct: (v) => v.isReverse
                      ? `Spot on! Total = ${v.mean} × ${v.count} = ${v.total}. Known values = ${v.knownTotal}. Missing = ${v.total} - ${v.knownTotal} = **${v.missingValue}** ${v.unit}! ✓`
                      : `Spot on! **${v.total} ÷ ${v.count} = ${v.mean}** ${v.unit}. The mean average is **${v.mean}**! ✓`,
                    incorrect: (v) => v.isReverse
                      ? `Not quite! Total = ${v.mean} × ${v.count} = ${v.total}. Known = ${v.knownValues.join(' + ')} = ${v.knownTotal}. Missing = ${v.total} - ${v.knownTotal} = **${v.missingValue}** ${v.unit}.`
                      : `Not quite! Add all the values: ${v.values.join(' + ')} = ${v.total}. Then divide by ${v.count}: ${v.total} ÷ ${v.count} = **${v.mean}** ${v.unit}.`
                  }
                }
              },
              // ---- Screen 5: CONSOLIDATE — Summary recipe ----
              {
                type: "consolidate",
                title: (v) => v.isReverse ? "The reverse mean recipe!" : "The mean average recipe!",
                body: (v) => v.isReverse
                  ? `When you know the mean but need to find a **missing value**, work backwards:`
                  : `Finding the mean is just **add then divide**. Works every time:`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => v.isReverse ? ({
                    steps: [
                      { text: "Step 1: Total = Mean × Count", why: "Multiply the mean by how many values there are." },
                      { text: "Step 2: Add up the values you DO know", why: "This is the known total." },
                      { text: "Step 3: Missing = Total - Known", why: "Subtract what you know from the total. That's the answer! ✓" }
                    ]
                  }) : ({
                    steps: [
                      { text: "Step 1: Add all the values together", why: "This gives you the total." },
                      { text: "Step 2: Count how many values there are", why: "This is the number you'll divide by." },
                      { text: "Step 3: Divide the total by the count", why: "The answer is the mean — what each value would be if they were all the same! ✓" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      }
    ,
      ...datahandlingSubConcepts
    ]
  },

  // TOPIC: Speed, Distance, Time
  speeddistancetime: {
    name: "Speed, Distance, Time",
    subConcepts: [
      {
        id: "master-speed-formula",
        name: "Using Speed = Distance ÷ Time",
        category: "master",
        lessons: [
          {
            id: "master-speed-calculation",
            templateType: "master-method",
            learningGoal: [
              "Speed tells you how far something travels in one unit of time",
              "The formula: Speed = Distance ÷ Time",
              "How to identify the distance and time, then divide"
            ],
            variableSets: [
              // Set 1 — car journey
              {
                name: "Dad",
                scenario: "drove the family from Bournemouth to Bristol",
                distance: 150,
                time: 3,
                speed: 50,
                distanceUnit: "miles",
                timeUnit: "hours",
                speedUnit: "mph"
              },
              // Set 2 — cycling
              {
                name: "Mia",
                scenario: "cycled along the seafront on a sunny afternoon",
                distance: 24,
                time: 2,
                speed: 12,
                distanceUnit: "km",
                timeUnit: "hours",
                speedUnit: "km/h"
              },
              // Set 3 — train trip
              {
                name: "Gran",
                scenario: "caught the train from London to Edinburgh",
                distance: 300,
                time: 4,
                speed: 75,
                distanceUnit: "miles",
                timeUnit: "hours",
                speedUnit: "mph"
              },
              // Set 4 — running
              {
                name: "Jack",
                scenario: "ran in a cross-country race at school",
                distance: 15,
                time: 3,
                speed: 5,
                distanceUnit: "km",
                timeUnit: "hours",
                speedUnit: "km/h"
              },
              // Set 5 — boat trip
              {
                name: "Captain Harris",
                scenario: "sailed a ferry across the English Channel",
                distance: 120,
                time: 2,
                speed: 60,
                distanceUnit: "km",
                timeUnit: "hours",
                speedUnit: "km/h"
              },
              // Set 6 — bus journey
              {
                name: "Mr Patel",
                scenario: "drove the school bus on a field trip to the New Forest",
                distance: 80,
                time: 2,
                speed: 40,
                distanceUnit: "miles",
                timeUnit: "hours",
                speedUnit: "mph"
              },
              // Set 7 — delivery van
              {
                name: "Auntie Jo",
                scenario: "drove her delivery van from Poole to Southampton",
                distance: 180,
                time: 3,
                speed: 60,
                distanceUnit: "miles",
                timeUnit: "hours",
                speedUnit: "mph"
              },
              // --- Level 3: Two-leg journeys — average speed = total distance ÷ total time ---
              {
                name: "Mr Khan",
                scenario: "drove from London to Birmingham (100 miles in 2 hours), then from Birmingham to Manchester (80 miles in 2 hours)",
                isTwoLeg: true,
                leg1Distance: 100, leg1Time: 2, leg1Label: "London → Birmingham",
                leg2Distance: 80, leg2Time: 2, leg2Label: "Birmingham → Manchester",
                distance: 180, time: 4, speed: 45,
                distanceUnit: "miles", timeUnit: "hours", speedUnit: "mph",
                difficulty: 2
              },
              {
                name: "Ella",
                scenario: "cycled from home to the park (12 km in 1 hour), then from the park to Grandma's house (18 km in 2 hours)",
                isTwoLeg: true,
                leg1Distance: 12, leg1Time: 1, leg1Label: "Home → Park",
                leg2Distance: 18, leg2Time: 2, leg2Label: "Park → Grandma's",
                distance: 30, time: 3, speed: 10,
                distanceUnit: "km", timeUnit: "hours", speedUnit: "km/h",
                difficulty: 2
              },
              {
                name: "Coach Williams",
                scenario: "drove the school minibus from Bournemouth to Exeter (90 miles in 2 hours), then from Exeter to Plymouth (60 miles in 1 hour)",
                isTwoLeg: true,
                leg1Distance: 90, leg1Time: 2, leg1Label: "Bournemouth → Exeter",
                leg2Distance: 60, leg2Time: 1, leg2Label: "Exeter → Plymouth",
                distance: 150, time: 3, speed: 50,
                distanceUnit: "miles", timeUnit: "hours", speedUnit: "mph",
                difficulty: 2
              }
            ],
            screens: [
              // ---- Screen 1: HOOK / SETUP ----
              {
                type: "hook",
                title: (v) => v.isTwoLeg ? `What was the average speed?` : `How fast were they going?`,
                body: (v) => v.isTwoLeg
                  ? `${v.name} ${v.scenario}.\n\nThe total journey was **${v.distance} ${v.distanceUnit}** and took **${v.time} ${v.timeUnit}** altogether. But what was the **average speed** for the whole trip?`
                  : `${v.name} ${v.scenario}. The journey was **${v.distance} ${v.distanceUnit}** and it took **${v.time} ${v.timeUnit}**.\nBut how **fast** were they travelling? There's a simple formula...`,
                visual: {
                  component: "NumberLine",
                  props: (v) => v.isTwoLeg ? ({
                    min: 0,
                    max: v.distance,
                    points: [
                      { value: 0, label: "Start", color: "#818cf8" },
                      { value: v.leg1Distance, label: `${v.leg1Distance}`, color: "#c084fc" },
                      { value: v.distance, label: `${v.distance} ${v.distanceUnit}`, color: "#34d399" }
                    ],
                    jumps: [
                      { from: 0, to: v.leg1Distance, label: `Leg 1: ${v.leg1Time}h` },
                      { from: v.leg1Distance, to: v.distance, label: `Leg 2: ${v.leg2Time}h` }
                    ],
                    tickInterval: v.distance / v.time
                  }) : ({
                    min: 0,
                    max: v.distance,
                    points: [
                      { value: 0, label: "Start", color: "#818cf8" },
                      { value: v.distance, label: `${v.distance} ${v.distanceUnit}`, color: "#34d399" }
                    ],
                    jumps: [{ from: 0, to: v.distance, label: `${v.time} ${v.timeUnit}` }],
                    tickInterval: v.distance / v.time
                  })
                },
                interaction: null
              },
              // ---- Screen 2: STEP 1 — Identify distance and time ----
              {
                type: "teach",
                title: (v) => v.isTwoLeg ? "Step 1: Find the TOTAL distance and TOTAL time" : "Step 1: Find the distance and the time",
                bodyParts: (v) => v.isTwoLeg ? [
                  {
                    type: 'text',
                    content: (v) => `For average speed, we need the **total** distance and the **total** time — not each leg separately!`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `Leg 1: ${v.leg1Distance} ${v.distanceUnit}`, why: v.leg1Label },
                        { text: `Leg 2: ${v.leg2Distance} ${v.distanceUnit}`, why: v.leg2Label },
                        { text: `Total distance = ${v.leg1Distance} + ${v.leg2Distance}`, result: `= ${v.distance} ${v.distanceUnit}` },
                        { text: `Total time = ${v.leg1Time} + ${v.leg2Time}`, result: `= ${v.time} ${v.timeUnit}` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Total distance: **${v.distance} ${v.distanceUnit}**. Total time: **${v.time} ${v.timeUnit}**.\n\nNow we can find the average speed! ✓`
                  }
                ] : [
                  {
                    type: 'text',
                    content: (v) => `To find speed, we need two things:\n**Distance** — how far they went.\n**Time** — how long it took.`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `Distance`, why: `How far? Read this from the problem.`, result: `= ${v.distance} ${v.distanceUnit}` },
                        { text: `Time`, why: `How long? Read this from the problem.`, result: `= ${v.time} ${v.timeUnit}` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**${v.name}** travelled **${v.distance} ${v.distanceUnit}** in **${v.time} ${v.timeUnit}**.`
                  },
                  {
                    type: 'visual',
                    component: 'NumberLine',
                    props: (v) => ({
                      min: 0,
                      max: v.distance,
                      points: [
                        { value: 0, label: "Start", color: "#818cf8" },
                        { value: v.distance, label: `${v.distance} ${v.distanceUnit}`, color: "#34d399" }
                      ],
                      jumps: [{ from: 0, to: v.distance, label: `${v.time} ${v.timeUnit}` }],
                      tickInterval: v.distance / v.time
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Now we have both numbers. Time to use the **speed formula**! ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 3: STEP 2 — Divide to find speed ----
              {
                type: "teach",
                title: (v) => v.isTwoLeg ? "Step 2: Average Speed = Total Distance ÷ Total Time" : "Step 2: Speed = Distance ÷ Time",
                bodyParts: (v) => v.isTwoLeg ? [
                  {
                    type: 'text',
                    content: (v) => `Average speed uses the **same formula** — just with the totals:\n**Average Speed = Total Distance ÷ Total Time**`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `Average Speed = Total Distance ÷ Total Time`, why: `Same formula as always!` },
                        { text: `Average Speed = ${v.distance} ÷ ${v.time}`, result: `= ${v.speed} ${v.speedUnit}` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**${v.distance} ÷ ${v.time} = ${v.speed}**\nThe average speed was **${v.speed} ${v.speedUnit}**.`
                  },
                  {
                    type: 'visual',
                    component: 'NumberLine',
                    props: (v) => {
                      const points = [{ value: 0, label: "Start", color: "#818cf8" }];
                      points.push({ value: v.leg1Distance, label: `${v.leg1Distance}`, color: "#c084fc" });
                      points.push({ value: v.distance, label: `${v.distance} ${v.distanceUnit}`, color: "#34d399" });
                      return {
                        min: 0,
                        max: v.distance,
                        points: points,
                        jumps: [
                          { from: 0, to: v.leg1Distance, label: `Leg 1: ${v.leg1Time}h` },
                          { from: v.leg1Distance, to: v.distance, label: `Leg 2: ${v.leg2Time}h` }
                        ],
                        tickInterval: v.distance / v.time
                      };
                    }
                  },
                  {
                    type: 'text',
                    content: (v) => `Even though each leg was different, the **average** speed was **${v.speed} ${v.speedUnit}** overall. ✓`
                  }
                ] : [
                  {
                    type: 'text',
                    content: (v) => `The formula is simple:\n**Speed = Distance ÷ Time**\nJust divide the distance by the time.`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `Speed = Distance ÷ Time`, why: `The golden formula! Remember: S = D ÷ T` },
                        { text: `Speed = ${v.distance} ÷ ${v.time}`, result: `= ${v.speed} ${v.speedUnit}` }
                      ],
                      allRevealed: true
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**${v.distance} ÷ ${v.time} = ${v.speed}**\n${v.name} was travelling at **${v.speed} ${v.speedUnit}**.`
                  },
                  {
                    type: 'visual',
                    component: 'NumberLine',
                    props: (v) => {
                      const points = [{ value: 0, label: "Start", color: "#818cf8" }];
                      const jumps = [];
                      for (let i = 1; i <= v.time; i++) {
                        const pos = v.speed * i;
                        points.push({ value: pos, label: `${pos} ${v.distanceUnit}`, color: i === v.time ? "#34d399" : "#c084fc" });
                        jumps.push({ from: v.speed * (i - 1), to: pos, label: `${v.speed} ${v.distanceUnit}` });
                      }
                      return {
                        min: 0,
                        max: v.distance,
                        points: points,
                        jumps: jumps,
                        tickInterval: v.distance / v.time
                      };
                    }
                  },
                  {
                    type: 'text',
                    content: (v) => `That means **${v.speed} ${v.distanceUnit} every hour**. Each jump on the line shows one hour! ✓`
                  }
                ],
                visual: null,
                interaction: null
              },
              // ---- Screen 4: INTERACT — MC question ----
              {
                type: "interact",
                title: () => "Your turn!",
                body: (v) => v.isTwoLeg
                  ? `${v.name} ${v.scenario}.\n\nWhat was the **average speed** for the whole journey?`
                  : `${v.name} ${v.scenario}. The journey was **${v.distance} ${v.distanceUnit}** and took **${v.time} ${v.timeUnit}**.\nWhat speed was ${v.name} travelling at?`,
                visual: {
                  component: "NumberLine",
                  props: (v) => v.isTwoLeg ? ({
                    min: 0,
                    max: v.distance,
                    points: [
                      { value: 0, label: "Start", color: "#818cf8" },
                      { value: v.leg1Distance, label: `${v.leg1Distance}`, color: "#c084fc" },
                      { value: v.distance, label: `${v.distance} ${v.distanceUnit}`, color: "#34d399" }
                    ],
                    jumps: [
                      { from: 0, to: v.leg1Distance, label: `Leg 1: ${v.leg1Time}h` },
                      { from: v.leg1Distance, to: v.distance, label: `Leg 2: ${v.leg2Time}h` }
                    ],
                    tickInterval: v.distance / v.time
                  }) : ({
                    min: 0,
                    max: v.distance,
                    points: [
                      { value: 0, label: "Start", color: "#818cf8" },
                      { value: v.distance, label: `${v.distance} ${v.distanceUnit}`, color: "#34d399" }
                    ],
                    jumps: [{ from: 0, to: v.distance, label: `${v.time} ${v.timeUnit}` }],
                    tickInterval: v.distance / v.time
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => v.isTwoLeg
                    ? `What was the average speed for the whole journey?`
                    : `What speed was ${v.name} travelling at?`,
                  getOptions: (v) => generateDistractors(v.speed).map(n => `${n} ${v.speedUnit}`),
                  correctAnswer: (v) => `${v.speed} ${v.speedUnit}`,
                  feedback: {
                    correct: (v) => v.isTwoLeg
                      ? `Brilliant! Total: ${v.distance} ${v.distanceUnit} in ${v.time} ${v.timeUnit}. **${v.distance} ÷ ${v.time} = ${v.speed} ${v.speedUnit}**! ✓`
                      : `Brilliant! **${v.distance} ÷ ${v.time} = ${v.speed} ${v.speedUnit}**. ${v.name} was going **${v.speed} ${v.speedUnit}**! ✓`,
                    incorrect: (v) => v.isTwoLeg
                      ? `Not quite! Add both distances: ${v.leg1Distance} + ${v.leg2Distance} = ${v.distance}. Add both times: ${v.leg1Time} + ${v.leg2Time} = ${v.time}. Then ${v.distance} ÷ ${v.time} = **${v.speed} ${v.speedUnit}**.`
                      : `Not quite! Use the formula: Speed = Distance ÷ Time. That's ${v.distance} ÷ ${v.time} = **${v.speed} ${v.speedUnit}**.`
                  }
                }
              },
              // ---- Screen 5: CONSOLIDATE — Summary recipe ----
              {
                type: "consolidate",
                title: (v) => v.isTwoLeg ? "The average speed recipe!" : "The speed formula recipe!",
                body: (v) => v.isTwoLeg
                  ? `For journeys with **multiple legs**, find the average speed like this:`
                  : `Remember this formula and you can work out speed every time:`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => v.isTwoLeg ? ({
                    steps: [
                      { text: "Step 1: Add ALL the distances together", why: "Don't calculate each leg's speed separately!" },
                      { text: "Step 2: Add ALL the times together", why: "Total time for the whole journey." },
                      { text: "Step 3: Average Speed = Total Distance ÷ Total Time", why: "Same formula — just use the totals! ✓" }
                    ]
                  }) : ({
                    steps: [
                      { text: "Step 1: Find the distance (how far)", why: "Read it from the question — check the units (km or miles)." },
                      { text: "Step 2: Find the time (how long)", why: "Read it from the question — check the units (hours, minutes)." },
                      { text: "Step 3: Divide distance by time", why: "Speed = Distance ÷ Time. That's your answer!" },
                      { text: "Check: does the speed make sense?", why: "Walking ≈ 5 km/h, cycling ≈ 15 km/h, car ≈ 50 mph. ✓" }
                    ]
                  })
                },
                interaction: null
              }
            ]
          }
        ]
      }
    ,
      ...speeddistancetimeSubConcepts
    ]
  },

  // ============================================================
  // ENGLISH TOPICS — Master Methods
  // ============================================================

  // TOPIC: Spelling
  spelling: {
    name: "Spelling",
    subConcepts: [
      {
        id: "master-spelling-scanner",
        name: "The Spelling Scanner",
        category: "master",
        lessons: [
          {
            id: "master-spelling-scanner-full",
            templateType: "master-method",
            learningGoal: [
              "A 5-step checklist for spotting spelling errors",
              "How to scan each segment of a sentence step by step",
              "Common spelling traps: homophones, double letters, silent letters, suffixes"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "checking her English homework",
                sentence: "The children were | very exited | about their | school trip.",
                segments: ["The children were", "very exited", "about their", "school trip."],
                errorSegment: 1,
                errorWord: "exited",
                correctWord: "excited",
                errorType: "missing letter",
                explanation: "The word 'excited' has a **c** before the **ited** — it comes from 'excite'. Without the c, 'exited' means 'left a building'!",
                checkUsed: "Sound it out — 'exited' sounds like 'exit-ed', not 'excited'",
                scanSteps: ["Sound it out — does 'exited' sound right?", "It sounds like 'exit-ed', not 'ex-sight-ed'", "The correct spelling is **excited** — with a **c**", "The c makes the 's' sound: ex-**c**-ited"]
              },
              {
                name: "Ben",
                scenario: "writing a story in class",
                sentence: "We walked passed | the old castle | on our way | to school.",
                segments: ["We walked passed", "the old castle", "on our way", "to school."],
                errorSegment: 0,
                errorWord: "passed",
                correctWord: "past",
                errorType: "homophone",
                explanation: "'Passed' is a verb (I passed the test). 'Past' is used after 'walked' — you walk **past** something.",
                checkUsed: "Homophone check — 'passed' and 'past' sound the same but mean different things",
                scanSteps: ["Homophone check — is this the right version?", "'Passed' = verb (I passed the ball)", "'Past' = position (walked past the shop)", "Correct: We walked **past** the old castle"]
              },
              {
                name: "Charlie",
                scenario: "writing a letter to her pen pal",
                sentence: "I am writting | to tell you | about my | new puppy.",
                segments: ["I am writting", "to tell you", "about my", "new puppy."],
                errorSegment: 0,
                errorWord: "writting",
                correctWord: "writing",
                errorType: "double letter",
                explanation: "'Write' becomes 'writing' — you drop the **e** and add **-ing**, but you do NOT double the **t**. Only double when the last syllable is stressed with a short vowel (sitting, running).",
                checkUsed: "Double letter check — 'write' has a long vowel sound, so no doubling",
                scanSteps: ["Double letter check — should the t be doubled?", "'Write' ends in a silent e, so drop the e and add -ing", "Long vowel = no doubling: write → writ**ing**", "Compare: sit → si**tt**ing (short vowel, double the t)"]
              },
              {
                name: "Daisy",
                scenario: "labelling her science diagram",
                sentence: "The nife was | used to cut | the paper | carefully.",
                segments: ["The nife was", "used to cut", "the paper", "carefully."],
                errorSegment: 0,
                errorWord: "nife",
                correctWord: "knife",
                errorType: "silent letter",
                explanation: "'Knife' has a **silent k** at the start. We don't say the k, but we must write it! Other examples: knight, knot, know.",
                checkUsed: "Silent letter check — is there a silent letter missing?",
                scanSteps: ["Silent letter check — does this word need a silent letter?", "Words starting with 'n' sound can have a silent **k**", "knife, knight, knot, know, knee, knock", "Correct spelling: **k**nife"]
              },
              {
                name: "Ella",
                scenario: "filling in a worksheet",
                sentence: "The beautiful | garden was | very peacful | in the morning.",
                segments: ["The beautiful", "garden was", "very peacful", "in the morning."],
                errorSegment: 2,
                errorWord: "peacful",
                correctWord: "peaceful",
                errorType: "suffix",
                explanation: "'Peace' + 'ful' = 'peaceful'. The **e** stays when you add **-ful**. Don't confuse with 'beautiful' where the y changes to i.",
                checkUsed: "Ending check — is the suffix spelled correctly?",
                scanSteps: ["Ending check — is -ful added correctly?", "The base word is 'peace' — keep the **e**", "peace + ful = peace**ful**", "Remember: -ful as a suffix always has ONE L"]
              },
              {
                name: "Finn",
                scenario: "reading his friend's essay",
                sentence: "My family went | on holiday | to a diffrent | country last summer.",
                segments: ["My family went", "on holiday", "to a diffrent", "country last summer."],
                errorSegment: 2,
                errorWord: "diffrent",
                correctWord: "different",
                errorType: "missing letter",
                explanation: "'Different' has three syllables: **dif-fer-ent**. The middle syllable 'fer' is easy to skip when writing quickly.",
                checkUsed: "Sound it out — 'diffrent' is missing a syllable",
                scanSteps: ["Sound it out — how many syllables?", "Clap it out: dif-fer-ent = THREE syllables", "The middle syllable 'fer' must be included", "Correct: d-i-f-f-e-r-e-n-t"]
              },
              {
                name: "Grace",
                scenario: "proofreading her book review",
                sentence: "The story was | very intresting | and I would | reccommend it.",
                segments: ["The story was", "very intresting", "and I would", "reccommend it."],
                errorSegment: 1,
                errorWord: "intresting",
                correctWord: "interesting",
                errorType: "missing letter",
                explanation: "'Interesting' has four syllables: **in-ter-est-ing**. The 'e' after 'ter' is often missed in quick writing.",
                checkUsed: "Sound it out — say each syllable carefully",
                scanSteps: ["Sound it out — in-ter-est-ing", "Four syllables — don't skip the 'est'", "Interest + ing = inter**est**ing", "Note: 'reccommend' in segment 4 is wrong too — it should be 'recommend' (one c)!"]
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `Can you spot the spelling mistake?`,
                body: (v) => `${v.name} is ${v.scenario}. Read this sentence carefully — one of the words is spelled wrong!\n\nCan you spot it? Have a think, then press Next to learn a **5-step scanning method** that catches spelling errors every time.`,
                visual: {
                  component: "SentenceDisplay",
                  props: (v) => ({
                    mode: "segments",
                    segments: v.segments,
                    label: "Read each segment:"
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "The Spelling Scanner — 5 checks",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `When you see a spelling question, **scan each segment** using these 5 checks:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Sound it out", why: "Does the word sound right when you read it aloud?" },
                        { text: "2. Homophone check", why: "Is this the right version? (there/their/they're, passed/past)" },
                        { text: "3. Double letter check", why: "Should there be a double letter? (beginning, necessary)" },
                        { text: "4. Silent letter check", why: "Is a silent letter missing? (knife, knight, write)" },
                        { text: "5. Ending check", why: "Is the suffix correct? (-ful not -full, -tion not -shun)" }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Let's use the scanner on the error: **"${v.errorWord}"**\n\n${v.checkUsed}`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Finding the fix: "${v.errorWord}"`,
                bodyParts: (v) => [
                  {
                    type: 'visual',
                    component: 'SentenceDisplay',
                    props: (v) => ({
                      mode: "segments",
                      segments: v.segments,
                      errorIndex: v.errorSegment,
                      correctedSegment: v.segments[v.errorSegment].replace(v.errorWord, v.correctWord),
                      label: "The error:"
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `This is a **${v.errorType}** error. Here's how the scanner catches it:`
                  },
                  {
                    type: 'visual',
                    component: 'LetterTiles',
                    props: (v) => ({
                      mode: "word",
                      letters: v.errorWord.split(''),
                      strikeIndices: v.errorWord.split('').map((_, i) => i),
                      label: `Wrong: "${v.errorWord}"`
                    })
                  },
                  {
                    type: 'visual',
                    component: 'LetterTiles',
                    props: (v) => ({
                      mode: "word",
                      letters: v.correctWord.split(''),
                      highlightIndices: v.correctWord.split('').reduce((acc, l, i) => {
                        if (i >= v.errorWord.length || l !== v.errorWord[i]) acc.push(i);
                        return acc;
                      }, []),
                      highlightColor: "#22c55e",
                      label: `Correct: "${v.correctWord}"`
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.scanSteps.map((step, i) => ({
                        text: step,
                        why: i === v.scanSteps.length - 1 ? "✓" : ""
                      })),
                      allRevealed: false
                    })
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — which segment has the mistake?",
                body: (v) => `Use the Spelling Scanner to find the segment with the error.`,
                visual: {
                  component: "SentenceDisplay",
                  props: (v) => ({
                    mode: "segments",
                    segments: v.segments,
                    label: "Read each segment:"
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `Which segment contains the spelling mistake?`,
                  getOptions: (v) => {
                    const options = v.segments.map((seg, i) => `Segment ${i + 1}`);
                    options.push("No mistake");
                    return options;
                  },
                  correctAnswer: (v) => `Segment ${v.errorSegment + 1}`,
                  feedback: {
                    correct: (v) => `Brilliant! Segment ${v.errorSegment + 1} has **"${v.errorWord}"** which should be **"${v.correctWord}"**. ${v.explanation} ✓`,
                    incorrect: (v) => `Not quite! The mistake is in Segment ${v.errorSegment + 1}: **"${v.errorWord}"** should be **"${v.correctWord}"**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The Spelling Scanner — your checklist!",
                body: () => `Every time you see a spelling question, run through these **5 checks** on each segment:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Sound it out", why: "Read the word aloud — does it sound right?" },
                      { text: "2. Homophone check", why: "Same sound, different spelling? (there/their/they're)" },
                      { text: "3. Double letter check", why: "Too many or too few double letters? (beginning, necessary)" },
                      { text: "4. Silent letter check", why: "Missing a silent k, w, b, or p? (knife, write, lamb)" },
                      { text: "5. Ending check", why: "Is the suffix right? (-ful, -tion, -ous, -ible) ✓" }
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
    ,
      ...spellingSubConcepts
    ]
  },

  // TOPIC: Punctuation
  punctuation: {
    name: "Punctuation",
    subConcepts: [
      {
        id: "master-punctuation-patrol",
        name: "The Punctuation Patrol",
        category: "master",
        lessons: [
          {
            id: "master-punctuation-patrol-full",
            templateType: "master-method",
            learningGoal: [
              "A 5-step priority checklist for spotting punctuation errors",
              "The most common punctuation mistakes in 11+ questions",
              "How to scan each segment step by step"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "proofreading a paragraph for homework",
                sentence: "sarah went | to the shop | and bought | apples, oranges and bananas.",
                segments: ["sarah went", "to the shop", "and bought", "apples, oranges and bananas."],
                errorSegment: 0,
                errorDescription: "missing capital letter",
                errorWord: "sarah",
                correctVersion: "Sarah",
                rule: "Names (proper nouns) always start with a **capital letter**.",
                checkUsed: "Capital letter check — proper nouns need capitals",
                scanSteps: ["Capital letter check — is 'sarah' a name?", "Yes! Sarah is a proper noun", "All proper nouns need a capital letter", "Correct: **S**arah went"]
              },
              {
                name: "Ben",
                scenario: "editing a class newspaper article",
                sentence: "The dog's | chased the cat | across the | garden fence.",
                segments: ["The dog's", "chased the cat", "across the", "garden fence."],
                errorSegment: 0,
                errorDescription: "incorrect apostrophe",
                errorWord: "dog's",
                correctVersion: "dogs",
                rule: "If the dog isn't owning anything, there's no apostrophe. 'Dogs' is just plural (more than one dog).",
                checkUsed: "Apostrophe check — is this contraction or possession? Neither — it's just plural!",
                scanSteps: ["Apostrophe check — why is there an apostrophe?", "Is it a contraction? No — 'dog is chased' doesn't work", "Is it possession? No — the dog doesn't own the chasing", "It's just plural: **dogs** chased the cat"]
              },
              {
                name: "Charlie",
                scenario: "checking her creative writing",
                sentence: "Although it was | raining heavily | the children | played outside.",
                segments: ["Although it was", "raining heavily", "the children", "played outside."],
                errorSegment: 1,
                errorDescription: "missing comma after subordinate clause",
                errorWord: "heavily the",
                correctVersion: "heavily, the",
                rule: "When a sentence starts with a subordinate clause (Although..., Because..., When...), put a **comma** before the main clause.",
                checkUsed: "Comma check — a subordinate clause at the start needs a comma after it",
                scanSteps: ["Comma check — does this sentence start with a joining word?", "'Although' starts a subordinate clause", "The clause ends at 'heavily' — then the main clause begins", "Correct: Although it was raining heavily**,** the children played outside"]
              },
              {
                name: "Daisy",
                scenario: "writing a diary entry",
                sentence: "Where are you | going on | saturday | this week.",
                segments: ["Where are you", "going on", "saturday", "this week."],
                errorSegment: 2,
                errorDescription: "missing capital for day of the week",
                errorWord: "saturday",
                correctVersion: "Saturday",
                rule: "Days of the week and months of the year always start with a **capital letter**. But seasons (spring, summer) do NOT.",
                checkUsed: "Capital letter check — days of the week need capitals",
                scanSteps: ["Capital letter check — is 'saturday' a proper noun?", "Days of the week are proper nouns", "Saturday, Monday, Wednesday — all capitalised", "Correct: going on **S**aturday"]
              },
              {
                name: "Ella",
                scenario: "writing a thank-you letter",
                sentence: "Thank you for | the lovely present | its exactly | what I wanted.",
                segments: ["Thank you for", "the lovely present", "its exactly", "what I wanted."],
                errorSegment: 2,
                errorDescription: "missing apostrophe in contraction",
                errorWord: "its",
                correctVersion: "it's",
                rule: "**it's** = it is / it has. **its** = belonging to it. Here, 'it is exactly' makes sense, so it needs the apostrophe.",
                checkUsed: "Apostrophe check — can you replace 'its' with 'it is'? Yes → it's",
                scanSteps: ["Apostrophe check — 'its' or 'it's'?", "Try replacing with 'it is': 'it is exactly what I wanted'", "That works! So we need the apostrophe", "Correct: **it's** exactly what I wanted"]
              },
              {
                name: "Finn",
                scenario: "writing about his weekend",
                sentence: "Lets all go | to the park | this afternoon | with the dog.",
                segments: ["Lets all go", "to the park", "this afternoon", "with the dog."],
                errorSegment: 0,
                errorDescription: "missing apostrophe in contraction",
                errorWord: "Lets",
                correctVersion: "Let's",
                rule: "**Let's** = Let us. The apostrophe shows the missing letters (u and s become 's).",
                checkUsed: "Apostrophe check — 'Let's' is short for 'Let us'",
                scanSteps: ["Apostrophe check — is 'Lets' a contraction?", "'Let's' = 'Let us' — the apostrophe replaces 'u'", "Without the apostrophe, 'lets' means 'allows'", "Correct: **Let's** all go to the park"]
              },
              {
                name: "Grace",
                scenario: "editing a book report",
                sentence: "The author wrote | the book in | 2019 and it | won a award.",
                segments: ["The author wrote", "the book in", "2019 and it", "won a award."],
                errorSegment: 3,
                errorDescription: "wrong article (a/an)",
                errorWord: "a award",
                correctVersion: "an award",
                rule: "Use **an** before words that start with a vowel sound (a, e, i, o, u). 'Award' starts with 'a', so it's '**an** award'.",
                checkUsed: "This is technically grammar, but the Punctuation Patrol catches small errors like a/an too",
                scanSteps: ["Read it aloud — 'a award' doesn't sound right", "'Award' starts with a vowel sound (a)", "Use 'an' before vowel sounds: an apple, an egg, an award", "Correct: won **an** award"]
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `Can you spot the punctuation problem?`,
                body: (v) => `${v.name} is ${v.scenario}. Read this sentence carefully — there's a punctuation mistake hiding in one of the segments!\n\nTime to use the **Punctuation Patrol** — our step-by-step checklist for spotting punctuation mistakes! Can you spot the error? Have a think, then press Next to learn the full method.`,
                visual: {
                  component: "SentenceDisplay",
                  props: (v) => ({
                    mode: "segments",
                    segments: v.segments,
                    label: "Read each segment:"
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "The Punctuation Patrol — 5 priority checks",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `Scan each segment in this order — the most common errors come first:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Capital letters", why: "Check after full stops, all **proper nouns** (names of people, places, days, months — NOT seasons)" },
                        { text: "2. Apostrophes", why: "Check **contractions** (don't, can't, it's) and **possession** (girl's bag vs girls' bags)" },
                        { text: "3. Commas", why: "Check lists, after **subordinate clauses** (Although…, Because…, When…), and before 'but' in long sentences" },
                        { text: "4. Question marks", why: "Check that questions end with ? not a full stop" },
                        { text: "5. Speech marks", why: "Check they're paired, capital inside, punctuation before closing mark" }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `For this sentence, the patrol catches it at: **${v.checkUsed}**`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `The fix: "${v.errorWord}" → "${v.correctVersion}"`,
                bodyParts: (v) => [
                  {
                    type: 'visual',
                    component: 'SentenceDisplay',
                    props: (v) => ({
                      mode: "segments",
                      segments: v.segments,
                      errorIndex: v.errorSegment,
                      correctedSegment: v.segments[v.errorSegment].replace(v.errorWord, v.correctVersion),
                      label: "Spot the fix:"
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `This is a **${v.errorDescription}** error.`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.scanSteps.map((step, i) => ({
                        text: step,
                        why: i === v.scanSteps.length - 1 ? "✓" : ""
                      })),
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**Rule:** ${v.rule}`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — which segment has the mistake?",
                body: (v) => `Use the Punctuation Patrol to find the error.`,
                visual: {
                  component: "SentenceDisplay",
                  props: (v) => ({
                    mode: "segments",
                    segments: v.segments,
                    label: "Read each segment:"
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `Which segment contains the punctuation mistake?`,
                  getOptions: (v) => {
                    const options = v.segments.map((seg, i) => `Segment ${i + 1}`);
                    options.push("No mistake");
                    return options;
                  },
                  correctAnswer: (v) => `Segment ${v.errorSegment + 1}`,
                  feedback: {
                    correct: (v) => `Well done! Segment ${v.errorSegment + 1} has **"${v.errorWord}"** — it should be **"${v.correctVersion}"**. ${v.rule} ✓`,
                    incorrect: (v) => `Not quite! The mistake is in Segment ${v.errorSegment + 1}: **"${v.errorWord}"** should be **"${v.correctVersion}"**. ${v.rule}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The Punctuation Patrol — your checklist!",
                body: () => `Every time you see a punctuation question, run through these **5 checks** in order:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Capital letters", why: "Sentence starts, **proper nouns** (names, places, days, months — NOT seasons)" },
                      { text: "2. Apostrophes", why: "**Contractions** (don't, can't, it's) and **possession** (the dog's bone)" },
                      { text: "3. Commas", why: "Lists, after **subordinate clauses** (Although…, Because…), before 'but'" },
                      { text: "4. Question marks", why: "Every question ends with a ? not a full stop" },
                      { text: "5. Speech marks", why: "Paired marks, capital inside, punctuation before closing mark ✓" }
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
    ,
      ...punctuationSubConcepts
    ]
  },

  // TOPIC: Grammar
  grammar: {
    name: "Grammar",
    subConcepts: [
      {
        id: "master-read-check-choose",
        name: "Read, Check, Choose",
        category: "master",
        lessons: [
          {
            id: "master-grammar-full",
            templateType: "master-method",
            learningGoal: [
              "A 4-step method for grammar questions",
              "How to identify what type of word is needed",
              "How to check your answer matches the rest of the sentence"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "completing a grammar exercise",
                sentence: "The dog ___ barking loudly all morning.",
                gap: "___",
                options: ["was", "were", "is", "are", "be"],
                correctAnswer: "was",
                correctIndex: 0,
                rule: "matching the verb to the subject (who's doing it)",
                explanation: "'The dog' is the **subject** (who the sentence is about). One dog = singular, so we need **was** (past tense, singular). 'Were' is for plural subjects (the dogs were). 'Is' and 'are' are present tense, but 'all morning' tells us it already happened.",
                steps: ["Read the whole sentence — who is the sentence about?", "The subject is 'the dog' — that's ONE thing", "One thing + past tense = **was**", "Check: 'The dog was barking loudly all morning' ✓"]
              },
              {
                name: "Ben",
                scenario: "filling in a test paper",
                sentence: "Yesterday, the children ___ to the park and played football.",
                gap: "___",
                options: ["go", "goes", "went", "gone", "going"],
                correctAnswer: "went",
                correctIndex: 2,
                rule: "verb tense (past, present, or future)",
                explanation: "'Yesterday' tells us this happened in the past, so we need a **past tense** (already happened) word. 'Went' is the past tense of 'go'. 'Gone' doesn't work on its own — you'd need 'had gone'.",
                steps: ["Read the whole sentence — when did this happen?", "'Yesterday' = it already happened, so we need the **past tense**", "'Go' in the past = **went**", "Check: 'the children went to the park' ✓"]
              },
              {
                name: "Charlie",
                scenario: "checking her writing",
                sentence: "My sister and I ___ going to the cinema tonight.",
                gap: "___",
                options: ["is", "am", "are", "was", "be"],
                correctAnswer: "are",
                correctIndex: 2,
                rule: "matching the verb to who's doing it",
                explanation: "'My sister and I' = **two people** (more than one). When there's more than one person, we use **are**. 'Am' is only for 'I' on its own; 'is' is for just one person or thing.",
                steps: ["Read the whole sentence — who is it about?", "'My sister and I' = two people (more than one)", "More than one person takes 'are': we ARE going", "Check: 'My sister and I are going' ✓"]
              },
              {
                name: "Daisy",
                scenario: "answering a grammar worksheet",
                sentence: "If I ___ you, I would apologise straight away.",
                gap: "___",
                options: ["was", "were", "am", "is", "be"],
                correctAnswer: "were",
                correctIndex: 1,
                rule: "imaginary 'if' sentences",
                explanation: "When a sentence is about something **imaginary** (not really happening), we use **were** even with 'I'. 'If I were you' is imaginary — you can't actually be someone else! So we say 'were', not 'was'.",
                steps: ["Read the whole sentence — is this real or imaginary?", "'If I were you' = imaginary (not really happening)", "In imaginary 'if' sentences, always use **were**", "Check: 'If I were you, I would apologise' ✓"]
              },
              {
                name: "Ella",
                scenario: "doing a practice paper",
                sentence: "Neither the teacher ___ the students knew the answer.",
                gap: "___",
                options: ["or", "and", "nor", "but", "with"],
                correctAnswer: "nor",
                correctIndex: 2,
                rule: "word pairs (neither...nor)",
                explanation: "'Neither' always pairs with **nor** — they work as a team. 'Neither...or' is incorrect. Similarly, 'either' pairs with 'or'. These words always go together, like a matching pair!",
                steps: ["Read the whole sentence — what word goes with 'neither'?", "'Neither' ALWAYS pairs with 'nor'", "'Either...or' and 'Neither...nor' — remember the pairs!", "Check: 'Neither the teacher nor the students knew' ✓"]
              },
              {
                name: "Finn",
                scenario: "editing his essay",
                sentence: "She is the ___ runner in the whole school.",
                gap: "___",
                options: ["faster", "fastest", "more fast", "most fastest", "fast"],
                correctAnswer: "fastest",
                correctIndex: 1,
                rule: "comparing with -est words",
                explanation: "When comparing to ALL others (the whole school), we add **-est** to the word: fast → fast**est**. 'Faster' is only for comparing **two** things. 'Most fastest' is wrong — you can't use 'most' AND '-est' together!",
                steps: ["Read the whole sentence — how many are being compared?", "'In the whole school' = comparing to everyone → use the **-est** form", "Short words: add **-est** (fast → fastest)", "NEVER 'most fastest' — you can't use 'most' and '-est' together!"]
              },
              {
                name: "Grace",
                scenario: "completing a cloze passage",
                sentence: "I should ___ finished my homework before going out.",
                gap: "___",
                options: ["of", "have", "has", "had", "off"],
                correctAnswer: "have",
                correctIndex: 1,
                rule: "common grammar trap",
                explanation: "It's **should have** (or should've), NOT 'should of'. People write 'of' because 'should've' sounds like 'should of' when spoken quickly. This is one of the most common grammar mistakes!",
                steps: ["Read aloud — 'should of' or 'should have'?", "'Should of' is NEVER correct — it's always 'should have'", "The confusion comes from 'should've' sounding like 'should of'", "Same rule: could have, would have, might have ✓"]
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `Pick the right word!`,
                body: (v) => `${v.name} is ${v.scenario}. Can you work out which word completes this sentence correctly?\n\nDon't guess — there's a method!`,
                visual: {
                  component: "SentenceDisplay",
                  props: (v) => ({
                    mode: "gap",
                    text: v.sentence,
                    gapWord: "",
                    gapHighlight: "blank",
                    label: "Choose the right word:"
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Read, Check, Choose — 4 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `For every grammar question, follow these 4 steps:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Read the whole sentence", why: "Don't just look at the gap — the rest of the sentence gives you clues!" },
                        { text: "2. Work out what's needed", why: "What type of word? What **tense** (past, present, or future)? One thing or more than one?" },
                        { text: "3. Check it matches", why: "Does the verb (doing word) match who's doing it? Does the **tense** (past, present, or future) stay the same throughout?" },
                        { text: "4. Test by reading aloud", why: "Put each option in and read it — does it sound right?" }
                      ],
                      allRevealed: false
                    })
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Applying the method`,
                bodyParts: (v) => [
                  {
                    type: 'visual',
                    component: 'SentenceDisplay',
                    props: (v) => ({
                      mode: "gap",
                      text: v.sentence,
                      gapWord: v.correctAnswer,
                      gapHighlight: "correct",
                      label: `This tests **${v.rule}**:`
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: step,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
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
                body: (v) => `Pick the word that correctly completes the sentence.`,
                visual: {
                  component: "SentenceDisplay",
                  props: (v) => ({
                    mode: "gap",
                    text: v.sentence,
                    gapWord: "",
                    gapHighlight: "blank",
                    label: "Choose the right word:"
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `Which word fits the gap?`,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! The answer is **"${v.correctAnswer}"**. ${v.explanation} ✓`,
                    incorrect: (v) => `Not quite! The answer is **"${v.correctAnswer}"**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Read, Check, Choose — every time!",
                body: () => `This 4-step method works for **any** grammar question:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Read the WHOLE sentence", why: "The rest of the sentence gives you clues about what word is needed" },
                      { text: "2. Work out what's needed", why: "Is it a doing word (verb)? A naming word (noun)? Past, present, or future?" },
                      { text: "3. Check it matches", why: "The doing word must match who's doing it — and the **tense** (past, present, or future) must stay the same throughout" },
                      { text: "4. Read it aloud with your answer", why: "If it sounds wrong, it probably is! ✓" }
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
    ,
      ...grammarSubConcepts
    ]
  },

  // TOPIC: Vocabulary
  vocabulary: {
    name: "Vocabulary",
    subConcepts: [
      {
        id: "master-substitution-test",
        name: "The Substitution Test",
        category: "master",
        lessons: [
          {
            id: "master-vocabulary-full",
            templateType: "master-method",
            learningGoal: [
              "A 4-step method for vocabulary questions",
              "How to use context (the other words around it that give you clues) to work out word meanings",
              "The substitution test for choosing the best synonym (a word that means the same or nearly the same)"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "answering a synonym question",
                targetWord: "furious",
                sentence: "The teacher was furious when she saw the mess in the classroom.",
                meaning: "extremely angry",
                options: ["happy", "angry", "confused", "tired", "frightened"],
                correctAnswer: "angry",
                correctIndex: 1,
                explanation: "Furious means **extremely angry**. The context helps: a teacher seeing a mess would be angry. 'Angry' substitutes perfectly: 'The teacher was angry when she saw the mess.'",
                steps: ["Read: 'furious' — what does the sentence tell us?", "A teacher seeing a mess — a negative reaction", "Think of your own word first: 'angry' or 'cross'", "Substitute: 'The teacher was angry' ✓ — it fits!"]
              },
              {
                name: "Ben",
                scenario: "working on a vocabulary test",
                targetWord: "timid",
                sentence: "The timid rabbit hid behind the bushes whenever anyone walked past.",
                meaning: "shy and easily frightened",
                options: ["brave", "shy", "fast", "large", "hungry"],
                correctAnswer: "shy",
                correctIndex: 1,
                explanation: "Timid means **shy or easily frightened**. The rabbit hides whenever anyone walks past — that's shy behaviour. 'Shy' substitutes perfectly.",
                steps: ["Read: 'timid' — what is the rabbit doing?", "Hiding whenever anyone walks past = not brave", "Think of your own word: 'scared' or 'shy'", "Substitute: 'The shy rabbit hid behind the bushes' ✓"]
              },
              {
                name: "Charlie",
                scenario: "reading a comprehension passage",
                targetWord: "ancient",
                sentence: "The ancient oak tree had been standing in the village square for hundreds of years.",
                meaning: "very old",
                options: ["modern", "beautiful", "very old", "tall", "famous"],
                correctAnswer: "very old",
                correctIndex: 2,
                explanation: "Ancient means **very old**. The clue is in the context: 'hundreds of years' tells us this tree has been there a long time.",
                steps: ["Read: 'ancient' — what clues are in the sentence?", "'Hundreds of years' = extremely old", "Think of your own word: 'old' or 'historic'", "Substitute: 'The very old oak tree' ✓"]
              },
              {
                name: "Daisy",
                scenario: "doing an antonym question",
                targetWord: "generous",
                sentence: "Choose the word most OPPOSITE in meaning to 'generous'.",
                meaning: "willing to give and share",
                options: ["kind", "wealthy", "selfish", "gentle", "happy"],
                correctAnswer: "selfish",
                correctIndex: 2,
                explanation: "Generous means willing to give. The **opposite** is **selfish** — thinking only of yourself and not sharing.",
                steps: ["What does 'generous' mean? Willing to give/share", "We need the OPPOSITE — someone who doesn't share", "Selfish = thinking only of yourself", "Generous ↔ Selfish ✓ — perfect opposites"]
              },
              {
                name: "Ella",
                scenario: "practising vocabulary at home",
                targetWord: "enormous",
                sentence: "The enormous whale swam gracefully through the deep blue ocean.",
                meaning: "extremely large",
                options: ["tiny", "fast", "huge", "blue", "gentle"],
                correctAnswer: "huge",
                correctIndex: 2,
                explanation: "Enormous means **extremely large or huge**. Whales are the biggest animals on Earth — 'huge' is the closest synonym.",
                steps: ["Read: 'enormous' — what do we know about whales?", "Whales are the biggest animals — enormous = very big", "Think of your own word: 'huge' or 'massive'", "Substitute: 'The huge whale swam gracefully' ✓"]
              },
              {
                name: "Finn",
                scenario: "working through a practice paper",
                targetWord: "reluctant",
                sentence: "Finn was reluctant to jump into the cold swimming pool.",
                meaning: "unwilling or hesitant",
                options: ["eager", "unwilling", "excited", "unable", "determined"],
                correctAnswer: "unwilling",
                correctIndex: 1,
                explanation: "Reluctant means **unwilling or hesitant** — you don't want to do something. The cold pool makes Finn not want to jump in.",
                steps: ["Read: 'reluctant' — why wouldn't Finn jump?", "The pool is cold — he doesn't want to!", "Think of your own word: 'unwilling' or 'hesitant'", "Substitute: 'Finn was unwilling to jump' ✓"]
              },
              {
                name: "Grace",
                scenario: "revising for the 11+",
                targetWord: "peculiar",
                sentence: "There was a peculiar smell coming from the old shed at the bottom of the garden.",
                meaning: "strange or unusual",
                options: ["pleasant", "strong", "strange", "terrible", "sweet"],
                correctAnswer: "strange",
                correctIndex: 2,
                explanation: "Peculiar means **strange or unusual** — not what you'd expect. An unexplained smell from an old shed would be strange.",
                steps: ["Read: 'peculiar' — what kind of smell?", "An old shed at the bottom of the garden — unexpected", "Think of your own word: 'odd' or 'strange'", "Substitute: 'a strange smell coming from the old shed' ✓"]
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `What does "${v.targetWord}" mean?`,
                body: (v) => `${v.name} is ${v.scenario}.\n\nDo you know what **${v.targetWord}** means? Even if you're not sure, there's a method to work it out!`,
                visual: {
                  component: "SentenceDisplay",
                  props: (v) => ({
                    mode: "highlight",
                    text: v.sentence,
                    highlightWords: [{ word: v.targetWord, color: "#6C5CE7" }],
                    label: "Find the target word:"
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "The Substitution Test — 4 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `This method works even when you don't know the word:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Read the word in its sentence", why: "**Context** (the other words around it that give you clues) gives you massive clues about the meaning" },
                        { text: "2. Think of YOUR OWN synonym first", why: "A **synonym** is a word that means the same or nearly the same. Think of one before looking at the options — this stops you being tricked" },
                        { text: "3. Substitute each option", why: "Put each option into the sentence — which one fits best?" },
                        { text: "4. Eliminate wrong answers", why: "Cross out options that clearly don't work" }
                      ],
                      allRevealed: false
                    })
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Using the method on "${v.targetWord}"`,
                bodyParts: (v) => [
                  {
                    type: 'visual',
                    component: 'SentenceDisplay',
                    props: (v) => ({
                      mode: "highlight",
                      text: v.sentence.replace(v.targetWord, v.correctAnswer),
                      highlightWords: [{ word: v.correctAnswer, color: "#22c55e" }],
                      label: `Substituted: "${v.targetWord}" → "${v.correctAnswer}"`
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: step,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
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
                body: (v) => `Which word is closest in meaning to **"${v.targetWord}"**?`,
                visual: {
                  component: "SentenceDisplay",
                  props: (v) => ({
                    mode: "highlight",
                    text: v.sentence,
                    highlightWords: [{ word: v.targetWord, color: "#6C5CE7" }],
                    label: "Find the target word:"
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `Which word means the same as "${v.targetWord}"?`,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! "${v.targetWord}" means **${v.meaning}**, so **"${v.correctAnswer}"** is the best match. ${v.explanation} ✓`,
                    incorrect: (v) => `Not quite! "${v.targetWord}" means **${v.meaning}**. The answer is **"${v.correctAnswer}"**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The Substitution Test — your method!",
                body: () => `Use this for **every** vocabulary question — **synonyms** (words that mean the same), **antonyms** (words that mean the opposite), and meanings:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Read the word in its sentence", why: "The surrounding words are your biggest clue" },
                      { text: "2. Think of YOUR OWN word first", why: "Before you look at the options!" },
                      { text: "3. Substitute each option into the sentence", why: "Which one sounds right and keeps the same meaning?" },
                      { text: "4. Eliminate the wrong ones", why: "Cross out options that change the meaning ✓" }
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
    ,
      ...vocabularySubConcepts
    ]
  },

  // TOPIC: Word Class & Grammar
  wordClassGrammar: {
    name: "Word Class & Grammar",
    subConcepts: [
      {
        id: "master-question-test",
        name: "The Question Test",
        category: "master",
        lessons: [
          {
            id: "master-wordclass-full",
            templateType: "master-method",
            learningGoal: [
              "How to identify word classes using simple questions",
              "The difference between nouns, verbs, adjectives, and adverbs",
              "Quick tests for each word class"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "identifying word classes",
                sentence: "The brave firefighter quickly climbed the tall ladder.",
                targetWord: "brave",
                wordClass: "adjective",
                test: "Does it describe a noun?",
                testResult: "Yes — it describes the firefighter (brave firefighter)",
                options: ["Noun", "Verb", "Adjective", "Adverb", "Pronoun"],
                correctAnswer: "Adjective",
                explanation: "'Brave' describes the firefighter — it tells us WHAT KIND of firefighter. Words that describe nouns are **adjectives**.",
                steps: ["Can I put 'the' in front of it? 'The brave'? Not really — it's not a thing", "Does it describe a noun? YES — 'brave' describes 'firefighter'", "It tells us what kind of firefighter → ADJECTIVE", "Test: 'the brave firefighter' = adjective + noun ✓"]
              },
              {
                name: "Ben",
                scenario: "doing a word class exercise",
                sentence: "The children played happily in the park after school.",
                targetWord: "happily",
                wordClass: "adverb",
                test: "Does it describe HOW something is done?",
                testResult: "Yes — it describes how the children played (played happily)",
                options: ["Noun", "Verb", "Adjective", "Adverb", "Preposition"],
                correctAnswer: "Adverb",
                explanation: "'Happily' tells us HOW the children played. Words that describe verbs (how, when, where) are **adverbs**. Many end in -ly!",
                steps: ["Can I put 'the' in front? 'The happily'? No — not a noun", "Does it show an action? No — 'played' is the action", "Does it describe HOW something is done? YES — played happily", "It describes a verb → ADVERB (hint: ends in -ly) ✓"]
              },
              {
                name: "Charlie",
                scenario: "labelling word classes in a sentence",
                sentence: "Happiness is hard to find when everything goes wrong.",
                targetWord: "happiness",
                wordClass: "noun",
                test: "Can I put 'the' in front of it?",
                testResult: "Yes — 'the happiness' works, even though you can't touch it",
                options: ["Noun", "Verb", "Adjective", "Adverb", "Conjunction"],
                correctAnswer: "Noun",
                explanation: "'Happiness' is an **abstract noun** — it's a thing you can't touch or see, but it's still a noun. You can say 'the happiness' or 'my happiness'.",
                steps: ["Can I put 'the' in front? 'The happiness'? YES!", "Even though you can't touch happiness, it's still a THING", "Abstract nouns = feelings, ideas, qualities (joy, fear, courage)", "'Happiness' = abstract noun ✓"]
              },
              {
                name: "Daisy",
                scenario: "completing a grammar test",
                sentence: "She carefully opened the mysterious old box.",
                targetWord: "opened",
                wordClass: "verb",
                test: "Does it show an action or a state (a condition or way of being, like 'is', 'was', or 'seems')?",
                testResult: "Yes — 'opened' is an action (she did something to the box)",
                options: ["Noun", "Verb", "Adjective", "Adverb", "Pronoun"],
                correctAnswer: "Verb",
                explanation: "'Opened' shows an **action** — something someone did. Every sentence needs at least one verb. You can change the tense: opens, opened, will open.",
                steps: ["Can I put 'the' in front? 'The opened'? Not really", "Does it show an action? YES — she opened the box", "Can I change the tense? Open, opened, will open — yes!", "'Opened' = verb (action word) ✓"]
              },
              {
                name: "Ella",
                scenario: "identifying word classes for revision",
                sentence: "They walked slowly towards the enormous castle.",
                targetWord: "they",
                wordClass: "pronoun",
                test: "Does it replace a noun?",
                testResult: "Yes — 'they' replaces the names of the people (e.g. 'Tom and Sarah walked')",
                options: ["Noun", "Verb", "Adjective", "Adverb", "Pronoun"],
                correctAnswer: "Pronoun",
                explanation: "'They' is a **pronoun** — it replaces a noun so we don't have to keep repeating names. Other pronouns: he, she, it, we, I, you.",
                steps: ["Can I put 'the' in front? 'The they'? No!", "Does it replace a noun? YES — instead of saying names", "He, she, it, they, we = PRONOUNS", "'They' = pronoun (replaces a noun) ✓"]
              },
              {
                name: "Finn",
                scenario: "working on a practice paper",
                sentence: "The cat sat under the old wooden table.",
                targetWord: "under",
                wordClass: "preposition",
                test: "Does it show position or time?",
                testResult: "Yes — 'under' shows WHERE the cat sat (its position)",
                options: ["Noun", "Verb", "Preposition", "Adverb", "Adjective"],
                correctAnswer: "Preposition",
                explanation: "'Under' is a **preposition** — it shows the position of the cat relative to the table. Other prepositions: in, on, at, by, above, below, behind, between.",
                steps: ["Does it show an action? No", "Does it describe a noun or verb? Not exactly", "Does it show WHERE or WHEN? YES — under the table", "'Under' = preposition (shows position) ✓"]
              },
              {
                name: "Grace",
                scenario: "analysing a sentence",
                sentence: "The brave knight protected the village.",
                targetWord: "village",
                wordClass: "noun",
                test: "Can I put 'the' in front of it?",
                testResult: "Yes — 'the village' works perfectly. It's a thing (a place)!",
                options: ["Noun", "Verb", "Adjective", "Adverb", "Pronoun"],
                correctAnswer: "Noun",
                explanation: "'Village' is a **noun** — it's a thing (a place). You can say 'the village', 'a village', or 'our village'. Words for people, places, and things are nouns.",
                steps: ["Can I put 'the' in front? 'The village'? YES!", "A village is a place — places are things", "People, places, things, ideas = NOUNS", "'Village' = noun ✓"]
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `What word class is "${v.targetWord}"?`,
                body: (v) => `${v.name} is ${v.scenario}.\n\nWhat type of word is **"${v.targetWord}"**? There are quick tests you can use to find out!`,
                visual: {
                  component: "SentenceDisplay",
                  props: (v) => ({
                    mode: "highlight",
                    text: v.sentence,
                    highlightWords: [{ word: v.targetWord, color: "#6C5CE7" }],
                    label: "Which word class?"
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "The Question Test — 5 quick checks",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `To identify a word's class, ask these questions in order:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: '1. Can I put "the" in front of it?', why: '→ NOUN (the table, the happiness, the city)' },
                        { text: "2. Does it describe a noun?", why: "→ ADJECTIVE (the tall tree, the brave firefighter)" },
                        { text: "3. Does it show an action or a state (a condition or way of being)?", why: "→ VERB (run, think, is, was, seems)" },
                        { text: "4. Does it describe HOW something is done?", why: "→ ADVERB (quickly, carefully — often ends in -ly)" },
                        { text: "5. Does it replace a noun?", why: "→ PRONOUN (he, she, it, they)" }
                      ],
                      allRevealed: false
                    })
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Testing "${v.targetWord}"`,
                bodyParts: (v) => [
                  {
                    type: 'visual',
                    component: 'SentenceDisplay',
                    props: (v) => ({
                      mode: "highlight",
                      text: v.sentence,
                      highlightWords: [{ word: v.targetWord, color: "#22c55e" }],
                      label: `${v.targetWord} = ${v.wordClass}`
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**${v.test}** ${v.testResult}`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: step,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
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
                body: (v) => `What word class is **"${v.targetWord}"**?`,
                visual: {
                  component: "SentenceDisplay",
                  props: (v) => ({
                    mode: "highlight",
                    text: v.sentence,
                    highlightWords: [{ word: v.targetWord, color: "#6C5CE7" }],
                    label: "Which word class?"
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What word class is "${v.targetWord}"?`,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Well done! "${v.targetWord}" is a **${v.wordClass}**. ${v.explanation} ✓`,
                    incorrect: (v) => `Not quite! "${v.targetWord}" is a **${v.wordClass}**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The Question Test — your quick guide!",
                body: () => `Run through these questions to identify **any** word class:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: 'Can I put "the" in front? → NOUN', why: "Things, people, places, ideas (the dog, the city, the happiness)" },
                      { text: "Does it describe a noun? → ADJECTIVE", why: "What kind? (tall, brave, mysterious, old)" },
                      { text: "Action or state (condition or way of being)? → VERB", why: "What someone does or is (run, think, is, seems, opened)" },
                      { text: "Describes HOW? → ADVERB", why: "How, when, where (quickly, yesterday, everywhere)" },
                      { text: "Replaces a noun? → PRONOUN", why: "He, she, it, they, we, I, you ✓" }
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
    ,
      ...wordClassSubConcepts
    ]
  },

  // TOPIC: Reading Comprehension
  comprehension: {
    name: "Reading Comprehension",
    subConcepts: [
      {
        id: "master-find-the-evidence",
        name: "Find the Evidence",
        category: "master",
        lessons: [
          {
            id: "master-comprehension-full",
            templateType: "master-method",
            learningGoal: [
              "A 5-step method for answering comprehension questions",
              "How to read the question first, then scan the passage",
              "Why you should check ALL options before choosing"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "answering a comprehension question",
                passage: "The old lighthouse stood at the edge of the cliff, its white walls stained grey by years of salt spray. Every evening, Mr Hartley climbed the narrow spiral staircase to light the lamp. His hands trembled as he struck the match — he was the oldest keeper on the coast, but he refused to retire. 'The ships need me,' he would mutter to himself.",
                question: "Why does Mr Hartley refuse to retire?",
                options: ["He enjoys climbing stairs", "He feels the ships depend on him", "He has nowhere else to live", "He is afraid of change", "He wants to earn more money"],
                correctAnswer: "He feels the ships depend on him",
                correctIndex: 1,
                evidenceLine: "'The ships need me,' he would mutter to himself.",
                questionType: "retrieval",
                explanation: "The passage directly tells us: 'The ships need me,' he would mutter. This is his reason for not retiring — he feels responsible for the ships' safety.",
                steps: ["Read the question: WHY does he refuse to retire?", "Scan the passage for clues about retiring", "Found it: 'The ships need me,' he would mutter", "This directly answers the question ✓"]
              },
              {
                name: "Ben",
                scenario: "reading a practice paper",
                passage: "Maya stared at the maths test on her desk. The numbers seemed to swim before her eyes, rearranging themselves into impossible patterns. She gripped her pencil so tightly that her knuckles turned white. Around her, other children were writing confidently, their pens scratching across the paper. Maya's page remained blank.",
                question: "How is Maya feeling during the test?",
                options: ["Bored and distracted", "Anxious and overwhelmed", "Angry at the teacher", "Confident but slow", "Tired and sleepy"],
                correctAnswer: "Anxious and overwhelmed",
                correctIndex: 1,
                evidenceLine: "The numbers seemed to swim before her eyes... She gripped her pencil so tightly that her knuckles turned white.",
                questionType: "inference",
                explanation: "Maya isn't directly described as anxious, but the clues tell us: numbers 'swimming', gripping the pencil until knuckles turn white, blank page while others write confidently. This all points to anxiety.",
                steps: ["Read the question: HOW is Maya feeling?", "Scan for clues about emotions and body language", "Clues: numbers swimming, white knuckles, blank page", "These all suggest anxiety and being overwhelmed ✓"]
              },
              {
                name: "Charlie",
                scenario: "doing a comprehension exercise",
                passage: "The market square was a riot of colour and noise. Stallholders bellowed their prices while customers haggled fiercely over the cost of apples and potatoes. Steam rose from a van selling hot pies, and the delicious smell drifted across the cobblestones. A small dog darted between people's legs, snatching a fallen sausage roll before anyone could stop it.",
                question: "What does the word 'bellowed' suggest about how the stallholders spoke?",
                options: ["They whispered quietly", "They spoke politely", "They shouted loudly", "They sang cheerfully", "They spoke nervously"],
                correctAnswer: "They shouted loudly",
                correctIndex: 2,
                evidenceLine: "Stallholders bellowed their prices",
                questionType: "vocabulary-in-context",
                explanation: "'Bellowed' means to shout in a loud, deep voice. The market is described as full of 'noise', which supports the idea that stallholders were being very loud.",
                steps: ["Read the question: what does 'bellowed' suggest?", "Find it in the passage: 'Stallholders bellowed their prices'", "Context: market described as a 'riot of colour and noise'", "'Bellowed' = shouted loudly (like a bull bellowing) ✓"]
              },
              {
                name: "Daisy",
                scenario: "working through a reading test",
                passage: "Gran's garden was her pride and joy. Every morning, rain or shine, she would be out there by seven o'clock, pulling weeds, watering flowers, and talking to her roses as if they could understand her. 'You're looking lovely today,' she would tell the red ones. The neighbours thought she was eccentric, but her garden won first prize at the village show every single year.",
                question: "What does the passage tell us about Gran's character?",
                options: ["She is lazy and careless", "She is dedicated and passionate", "She is lonely and sad", "She is competitive and jealous", "She is forgetful and confused"],
                correctAnswer: "She is dedicated and passionate",
                correctIndex: 1,
                evidenceLine: "Every morning, rain or shine... her pride and joy... won first prize every single year.",
                questionType: "inference",
                explanation: "The evidence shows dedication: out every morning 'rain or shine', talks to her roses (passion), and wins first prize every year (results of her dedication). Multiple clues point to the same answer.",
                steps: ["Read the question: what does it tell us about her CHARACTER?", "Scan for character clues: actions, habits, results", "Evidence: out every morning, talks to roses, wins prizes", "Multiple clues → dedicated and passionate ✓"]
              },
              {
                name: "Ella",
                scenario: "answering comprehension questions",
                passage: "The letter arrived on a Tuesday morning. Tom recognised the handwriting immediately — it was from his father, who had been working abroad for six months. Tom's hands shook as he tore open the envelope. Inside was a single sheet of paper with just four words: 'I'm coming home soon.' Tom read it three times, then ran to tell his mother.",
                question: "Why did Tom read the letter three times?",
                options: ["He couldn't understand the handwriting", "He was so happy he wanted to savour the message", "He thought there might be a hidden message", "He was confused by the words", "He wanted to memorise it"],
                correctAnswer: "He was so happy he wanted to savour the message",
                correctIndex: 1,
                evidenceLine: "Tom's hands shook... just four words: 'I'm coming home soon.' Tom read it three times, then ran to tell his mother.",
                questionType: "inference",
                explanation: "Tom hasn't seen his father for six months. His hands shook with emotion, and he ran to tell his mother — all signs of excitement and joy. Reading it three times suggests savouring wonderful news.",
                steps: ["Read the question: WHY did he read it three times?", "Scan for context: father abroad 6 months, hands shaking", "He ran to tell his mother = excited, happy news", "Reading it three times = savouring the moment ✓"]
              },
              {
                name: "Finn",
                scenario: "practising for the 11+",
                passage: "The old bicycle had seen better days. Its tyres were flat, the chain was rusty, and the seat had a long tear in it where the stuffing poked out. But to Jamie, it was the most beautiful thing in the world. His grandfather had ridden it as a boy, then his mother, and now it was his turn. He picked up a cloth and began to clean it.",
                question: "Why is the bicycle special to Jamie?",
                options: ["It is very expensive", "It is a racing bicycle", "It has been in his family for generations", "His friends are jealous of it", "It is brand new"],
                correctAnswer: "It has been in his family for generations",
                correctIndex: 2,
                evidenceLine: "His grandfather had ridden it as a boy, then his mother, and now it was his turn.",
                questionType: "retrieval",
                explanation: "The passage directly states the bicycle's history: grandfather → mother → Jamie. Three generations have used it, making it a family treasure despite its poor condition.",
                steps: ["Read the question: WHY is it special to Jamie?", "Scan: the bike is old and broken, BUT 'the most beautiful thing'", "Found it: grandfather → mother → Jamie (three generations)", "It's a family heirloom — that's why it's special ✓"]
              },
              {
                name: "Grace",
                scenario: "analysing a passage",
                passage: "Dr Singh walked into the laboratory and froze. Every test tube was shattered, their contents pooling in colourful puddles across the floor. Months of research, destroyed in a single night. She pressed her lips together firmly and took a deep breath. Then she reached for a fresh notebook and wrote the date at the top of the first page.",
                question: "What does Dr Singh's reaction tell us about her personality?",
                options: ["She doesn't care about her work", "She is resilient and determined", "She is planning revenge", "She is too shocked to react", "She is relieved the work is over"],
                correctAnswer: "She is resilient and determined",
                correctIndex: 1,
                evidenceLine: "She pressed her lips together firmly and took a deep breath. Then she reached for a fresh notebook.",
                questionType: "inference",
                explanation: "Despite months of destroyed research, Dr Singh takes a breath and starts again with a fresh notebook. This shows resilience (bouncing back) and determination (not giving up).",
                steps: ["Read the question: what does her REACTION tell us?", "Scan for her response: pressed lips, deep breath, fresh notebook", "She doesn't cry or give up — she starts again", "Resilient = bounces back; determined = doesn't quit ✓"]
              }
            ],
            screens: [
              {
                type: "hook",
                title: (v) => `Can you answer this question?`,
                body: (v) => `${v.name} is ${v.scenario}. Read the passage, then try the question:\n\n**${v.question}**\n\nDon't just pick the first answer that looks right — we'll learn a method to find the **best** answer.`,
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
                title: () => "Find the Evidence — 5 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `This method works for **every** comprehension question:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Read the question FIRST", why: "Know what you're looking for before reading the passage" },
                        { text: "2. Scan the passage", why: "Find the paragraph or sentence with the answer" },
                        { text: "3. Underline the evidence", why: "Which exact words or phrases answer the question?" },
                        { text: "4. Check ALL options", why: "Don't pick the first one that looks right — compare them all" },
                        { text: "5. Eliminate wrong answers", why: "Cross out options that contradict the text" }
                      ],
                      allRevealed: false
                    })
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Applying the method`,
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => {
                      const article = v.questionType === 'inference' ? 'an' : 'a';
                      const bracket = v.questionType === 'inference' ? ' (working out something that isn\'t directly said, using clues in the text)' : '';
                      return `**Question:** ${v.question}\n\nThis is ${article} **${v.questionType}**${bracket} question. Let's find the evidence:`;
                    }
                  },
                  {
                    type: 'visual',
                    component: 'SentenceDisplay',
                    props: (v) => ({
                      mode: "evidence",
                      passage: v.passage,
                      evidenceSentence: v.evidenceLine,
                      evidenceColor: "#fef08a",
                      label: "Evidence highlighted:"
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: step,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
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
                body: (v) => `**${v.question}**`,
                visual: {
                  component: "SentenceDisplay",
                  props: (v) => ({
                    mode: "evidence",
                    passage: v.passage,
                    evidenceSentence: "",
                    label: "Read the passage:"
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => v.question,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! The answer is **"${v.correctAnswer}"**. The key evidence is: "${v.evidenceLine}" ✓`,
                    incorrect: (v) => `Not quite! The answer is **"${v.correctAnswer}"**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Find the Evidence — every time!",
                body: () => `Use this method for **every** comprehension question:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Read the QUESTION first", why: "Know what you're hunting for" },
                      { text: "2. SCAN the passage", why: "Find the right paragraph or sentence" },
                      { text: "3. UNDERLINE the evidence", why: "The exact words that answer the question" },
                      { text: "4. Check ALL options", why: "Compare every option against the evidence" },
                      { text: "5. ELIMINATE wrong answers", why: "Cross out anything the text doesn't support ✓" }
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
    ,
      ...comprehensionSubConcepts
    ]
  },

  // ============================================================
  // VERBAL REASONING — 16 Master Methods
  // ============================================================

  // ---- VR TOPIC 1: Synonyms ----
  synonyms: {
    name: "Synonyms",
    subConcepts: [
      {
        id: "master-meaning-match",
        name: "The Meaning Match",
        category: "master",
        lessons: [
          {
            id: "master-meaning-match-full",
            templateType: "master-method",
            learningGoal: [
              "What a synonym is — two words that mean the same thing",
              "A 3-step method for finding synonym pairs",
              "How to check your answer by swapping the words in a sentence"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "reading a story and notices two words that seem to mean the same thing",
                targetWord: "begin",
                synonym: "start",
                definition: "to do something for the first time",
                testSentence: 'Let\'s **begin** the race → Let\'s **start** the race — same meaning!',
                options: ["begin & finish", "begin & start", "begin & stop", "begin & end", "begin & pause"],
                correctAnswer: "begin & start",
                explanation: "'Begin' and 'start' both mean to do something for the first time. The other words are opposites or unrelated. ✓",
                steps: [
                  "Define it: 'begin' means to do something for the first time",
                  "Scan options: which word also means 'do something for the first time'?",
                  "Match: 'start' means the same — begin & start are synonyms!"
                ]
              },
              {
                name: "Ben",
                scenario: "doing his VR homework and needs to match words with the same meaning",
                targetWord: "fast",
                synonym: "quick",
                definition: "moving with great speed",
                testSentence: 'The **fast** car → The **quick** car — same meaning!',
                options: ["fast & slow", "fast & quick", "fast & heavy", "fast & loud", "fast & small"],
                correctAnswer: "fast & quick",
                explanation: "'Fast' and 'quick' both mean moving with great speed. 'Slow' is the opposite. ✓",
                steps: [
                  "Define it: 'fast' means moving with great speed",
                  "Scan options: which word also means 'great speed'?",
                  "Match: 'quick' means the same — fast & quick are synonyms!"
                ]
              },
              {
                name: "Charlie",
                scenario: "practising for her 11+ exam at the kitchen table",
                targetWord: "happy",
                synonym: "joyful",
                definition: "feeling pleased and content",
                testSentence: 'She felt **happy** → She felt **joyful** — same meaning!',
                options: ["happy & sad", "happy & joyful", "happy & angry", "happy & tired", "happy & hungry"],
                correctAnswer: "happy & joyful",
                explanation: "'Happy' and 'joyful' both mean feeling pleased and content. 'Sad' is the opposite. ✓",
                steps: [
                  "Define it: 'happy' means feeling pleased and content",
                  "Scan options: which word also means 'pleased and content'?",
                  "Match: 'joyful' means the same — happy & joyful are synonyms!"
                ]
              },
              {
                name: "Maisie",
                scenario: "playing a word game with her family after dinner",
                targetWord: "big",
                synonym: "large",
                definition: "great in size",
                testSentence: 'A **big** house → A **large** house — same meaning!',
                options: ["big & tiny", "big & tall", "big & large", "big & wide", "big & heavy"],
                correctAnswer: "big & large",
                explanation: "'Big' and 'large' both mean great in size. 'Tiny' is the opposite; 'tall', 'wide' and 'heavy' describe different things. ✓",
                steps: [
                  "Define it: 'big' means great in size",
                  "Scan options: which word also means 'great in size'?",
                  "Match: 'large' means the same — big & large are synonyms!"
                ]
              },
              {
                name: "Ella",
                scenario: "working through a VR practice paper",
                targetWord: "small",
                synonym: "tiny",
                definition: "little in size",
                testSentence: 'A **small** kitten → A **tiny** kitten — same meaning!',
                options: ["small & huge", "small & short", "small & thin", "small & tiny", "small & young"],
                correctAnswer: "small & tiny",
                explanation: "'Small' and 'tiny' both mean little in size. 'Huge' is the opposite; 'short', 'thin' and 'young' mean different things. ✓",
                steps: [
                  "Define it: 'small' means little in size",
                  "Scan options: which word also means 'little in size'?",
                  "Match: 'tiny' means the same — small & tiny are synonyms!"
                ]
              },
              {
                name: "Finn",
                scenario: "revising VR questions on the bus to school",
                targetWord: "angry",
                synonym: "furious",
                definition: "feeling very cross or annoyed",
                testSentence: 'Dad was **angry** → Dad was **furious** — same meaning!',
                options: ["angry & calm", "angry & upset", "angry & furious", "angry & worried", "angry & scared"],
                correctAnswer: "angry & furious",
                explanation: "'Angry' and 'furious' both mean feeling very cross. 'Calm' is the opposite; 'upset', 'worried' and 'scared' are different feelings. ✓",
                steps: [
                  "Define it: 'angry' means feeling very cross or annoyed",
                  "Scan options: which word also means 'very cross'?",
                  "Match: 'furious' means the same — angry & furious are synonyms!"
                ]
              },
              {
                name: "Grace",
                scenario: "competing in a VR quiz at her after-school club",
                targetWord: "diligent",
                synonym: "hardworking",
                definition: "putting in careful, steady effort",
                testSentence: 'A **diligent** student → A **hardworking** student — same meaning!',
                options: ["diligent & lazy", "diligent & clever", "diligent & hardworking", "diligent & patient", "diligent & polite"],
                correctAnswer: "diligent & hardworking",
                explanation: "'Diligent' and 'hardworking' both mean putting in careful, steady effort. 'Lazy' is the opposite. ✓",
                steps: [
                  "Define it: 'diligent' means putting in careful, steady effort",
                  "Scan options: which word also means 'careful, steady effort'?",
                  "Match: 'hardworking' means the same — diligent & hardworking are synonyms!"
                ],
                difficulty: 2
              },
              {
                name: "Hugo",
                scenario: "tackling the trickiest questions in a VR test",
                targetWord: "tranquil",
                synonym: "peaceful",
                definition: "calm and quiet, free from disturbance",
                testSentence: 'A **tranquil** garden → A **peaceful** garden — same meaning!',
                options: ["tranquil & noisy", "tranquil & beautiful", "tranquil & peaceful", "tranquil & empty", "tranquil & distant"],
                correctAnswer: "tranquil & peaceful",
                explanation: "'Tranquil' and 'peaceful' both mean calm and quiet. 'Noisy' is the opposite; the others describe different qualities. ✓",
                steps: [
                  "Define it: 'tranquil' means calm and quiet, free from disturbance",
                  "Scan options: which word also means 'calm and quiet'?",
                  "Match: 'peaceful' means the same — tranquil & peaceful are synonyms!"
                ],
                difficulty: 2
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "Which pair means the same?",
                body: (v) => `${v.name} is ${v.scenario}.\n\nA **synonym** is a word that means the **same thing** as another word.\n\nCan you spot which pair of words are synonyms? Press Next to learn a quick 3-step method!`,
                visual: {
                  component: "SentenceDisplay",
                  props: (v) => ({
                    mode: "highlight",
                    text: v.testSentence.replace(/\*\*/g, ''),
                    highlightWords: [{ word: v.targetWord, color: "#6C5CE7" }],
                    label: `Target word: "${v.targetWord}"`
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "The Meaning Match — 3 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `A **synonym** means the **same** (or very close to the same) as another word. Here's how to find synonym pairs every time:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Define it yourself", why: "Say what the word means in your own words" },
                        { text: "2. Scan all options", why: "Read every choice — don't just pick the first one that looks right" },
                        { text: "3. Match the closest meaning", why: "Which option means the SAME thing? Swap them in a sentence to check" }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Let's try it with **"${v.targetWord}"** — ${v.definition}.`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Applying the method to "${v.targetWord}"`,
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Watch how the 3 steps find the answer:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: `Step ${i + 1}: ${step}`,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**Check it:** ${v.testSentence}`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — find the synonym pair!",
                body: (v) => `Use the 3 steps: **Define → Scan → Match**\n\nWhich pair of words mean the **same thing**?`,
                visual: {
                  component: "SentenceDisplay",
                  props: (v) => ({
                    mode: "highlight",
                    text: `${v.targetWord} = ${v.definition}`,
                    highlightWords: [{ word: v.targetWord, color: "#6C5CE7" }],
                    label: "Define it yourself first:"
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `Which pair are synonyms (mean the same)?`,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.explanation}`,
                    incorrect: (v) => `Not quite! The answer is **${v.correctAnswer}**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The Meaning Match — your recipe!",
                body: () => `Every time you see a synonym question, follow these 3 steps:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Define it yourself", why: "Say what the target word means in your own words" },
                      { text: "2. Scan all options", why: "Read every option carefully — don't rush!" },
                      { text: "3. Match the closest meaning", why: "Swap the words in a sentence — if it still makes sense, they're synonyms! ✓" }
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
    ,
      ...synonymsSubConcepts
    ]
  },

  // ---- VR TOPIC 2: Antonyms ----
  antonyms: {
    name: "Antonyms",
    subConcepts: [
      {
        id: "master-flip-test",
        name: "The Flip Test",
        category: "master",
        lessons: [
          {
            id: "master-flip-test-full",
            templateType: "master-method",
            learningGoal: [
              "What an antonym is — two words that mean the opposite",
              "A 3-step method for finding antonym pairs",
              "The difference between 'opposite' and just 'different'"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "practising antonyms at the breakfast table before school",
                targetWord: "hot",
                antonym: "cold",
                definition: "high in temperature",
                flipExplanation: "If something is NOT hot, the direct opposite is **cold** — not warm, not cool, but COLD",
                options: ["hot & warm", "hot & cold", "hot & dry", "hot & bright", "hot & fast"],
                correctAnswer: "hot & cold",
                explanation: "'Hot' and 'cold' are direct opposites — they sit at opposite ends of the temperature scale. 'Warm' is close to hot, not opposite. ✓",
                steps: [
                  "Read the word: 'hot' means high in temperature",
                  "Think of the exact opposite: what is the FURTHEST from hot?",
                  "Find the flip: 'cold' is the direct opposite — hot ↔ cold"
                ]
              },
              {
                name: "Ben",
                scenario: "working through a VR practice booklet",
                targetWord: "tall",
                antonym: "short",
                definition: "great in height",
                flipExplanation: "The direct opposite of **tall** is **short** — not small (that's about size, not height)",
                options: ["tall & big", "tall & thin", "tall & short", "tall & wide", "tall & heavy"],
                correctAnswer: "tall & short",
                explanation: "'Tall' and 'short' are direct opposites for height. 'Big' and 'small' are about overall size, not specifically height. ✓",
                steps: [
                  "Read the word: 'tall' means great in height",
                  "Think of the exact opposite: what is the FURTHEST from tall?",
                  "Find the flip: 'short' is the direct opposite — tall ↔ short"
                ]
              },
              {
                name: "Charlie",
                scenario: "doing timed VR practice in the study",
                targetWord: "generous",
                antonym: "selfish",
                definition: "willing to give and share freely",
                flipExplanation: "If someone is NOT generous, the direct opposite is **selfish** — only thinking of themselves",
                options: ["generous & kind", "generous & selfish", "generous & greedy", "generous & poor", "generous & mean"],
                correctAnswer: "generous & selfish",
                explanation: "'Generous' means willing to share; 'selfish' means only thinking of yourself. They're direct opposites. 'Greedy' is close but means wanting MORE, not refusing to share. ✓",
                steps: [
                  "Read the word: 'generous' means willing to give and share",
                  "Think of the exact opposite: what is the FURTHEST from generous?",
                  "Find the flip: 'selfish' — only thinking of yourself — generous ↔ selfish"
                ]
              },
              {
                name: "Daisy",
                scenario: "quizzing herself with flash cards",
                targetWord: "brave",
                antonym: "cowardly",
                definition: "willing to face danger without fear",
                flipExplanation: "The direct opposite of **brave** is **cowardly** — too scared to face danger",
                options: ["brave & strong", "brave & cowardly", "brave & shy", "brave & quiet", "brave & careful"],
                correctAnswer: "brave & cowardly",
                explanation: "'Brave' means facing danger without fear; 'cowardly' means being too afraid to act. They're direct opposites. 'Shy' and 'careful' are different qualities. ✓",
                steps: [
                  "Read the word: 'brave' means facing danger without fear",
                  "Think of the exact opposite: what is the FURTHEST from brave?",
                  "Find the flip: 'cowardly' — too scared to act — brave ↔ cowardly"
                ]
              },
              {
                name: "Ella",
                scenario: "playing a VR card game with her sister",
                targetWord: "ancient",
                antonym: "modern",
                definition: "very old, from long ago",
                flipExplanation: "The direct opposite of **ancient** is **modern** — brand new and up to date",
                options: ["ancient & old", "ancient & modern", "ancient & broken", "ancient & rare", "ancient & dusty"],
                correctAnswer: "ancient & modern",
                explanation: "'Ancient' means from long ago; 'modern' means new and up to date. They're direct opposites. 'Old' is similar to ancient, not opposite! ✓",
                steps: [
                  "Read the word: 'ancient' means very old, from long ago",
                  "Think of the exact opposite: what is the FURTHEST from ancient?",
                  "Find the flip: 'modern' — new and current — ancient ↔ modern"
                ]
              },
              {
                name: "Finn",
                scenario: "doing VR practice at his grandma's house",
                targetWord: "expand",
                antonym: "shrink",
                definition: "to get bigger or wider",
                flipExplanation: "The direct opposite of **expand** is **shrink** — to get smaller",
                options: ["expand & grow", "expand & shrink", "expand & stretch", "expand & break", "expand & move"],
                correctAnswer: "expand & shrink",
                explanation: "'Expand' means to get bigger; 'shrink' means to get smaller. Direct opposites! 'Grow' is similar to expand, not opposite. ✓",
                steps: [
                  "Read the word: 'expand' means to get bigger or wider",
                  "Think of the exact opposite: what is the FURTHEST from expand?",
                  "Find the flip: 'shrink' — to get smaller — expand ↔ shrink"
                ]
              },
              {
                name: "Grace",
                scenario: "tackling harder VR questions in a mock exam",
                targetWord: "flexible",
                antonym: "rigid",
                definition: "able to bend easily without breaking",
                flipExplanation: "The direct opposite of **flexible** is **rigid** — stiff and unable to bend at all",
                options: ["flexible & soft", "flexible & rigid", "flexible & strong", "flexible & loose", "flexible & fragile"],
                correctAnswer: "flexible & rigid",
                explanation: "'Flexible' means easy to bend; 'rigid' means stiff and unbending. Direct opposites! 'Soft' and 'fragile' describe different properties. ✓",
                steps: [
                  "Read the word: 'flexible' means able to bend easily",
                  "Think of the exact opposite: what is the FURTHEST from flexible?",
                  "Find the flip: 'rigid' — stiff and unbending — flexible ↔ rigid"
                ],
                difficulty: 2
              },
              {
                name: "Hugo",
                scenario: "attempting the hardest section of a practice paper",
                targetWord: "cautious",
                antonym: "reckless",
                definition: "being very careful to avoid danger",
                flipExplanation: "The direct opposite of **cautious** is **reckless** — acting without any care for danger",
                options: ["cautious & nervous", "cautious & reckless", "cautious & slow", "cautious & quiet", "cautious & timid"],
                correctAnswer: "cautious & reckless",
                explanation: "'Cautious' means being very careful; 'reckless' means acting without any care at all. Direct opposites! 'Nervous' and 'timid' are about fear, not carefulness. ✓",
                steps: [
                  "Read the word: 'cautious' means being very careful to avoid danger",
                  "Think of the exact opposite: what is the FURTHEST from cautious?",
                  "Find the flip: 'reckless' — no care at all — cautious ↔ reckless"
                ],
                difficulty: 2
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "Which pair are opposites?",
                body: (v) => `${v.name} is ${v.scenario}.\n\nAn **antonym** is a word that means the **opposite** of another word — not just different, but the **exact flip**.\n\nCan you spot the opposite pair? Press Next to learn The Flip Test!`,
                visual: {
                  component: "AnalogyDisplay",
                  props: (v) => ({
                    mode: "antonym",
                    pair1: [v.targetWord],
                    pair2word: v.targetWord,
                    answer: null,
                    label: "What is the exact OPPOSITE?"
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "The Flip Test — 3 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `An **antonym** is the **exact opposite** — not just a different word! Here's the method:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Read the word", why: "Say what it means in your own words" },
                        { text: "2. Think of the exact opposite", why: "What is the FURTHEST from this word? (Not just 'different' — OPPOSITE!)" },
                        { text: "3. Find the flip", why: "Which option is the direct opposite? If you flip it, you get back to the original" }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**Key tip:** "Different" is NOT the same as "opposite". ${v.flipExplanation}.`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Flipping "${v.targetWord}"`,
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Watch the 3 steps in action:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: `Step ${i + 1}: ${step}`,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
                      allRevealed: false
                    })
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — find the opposite pair!",
                body: (v) => `Use the Flip Test: **Read → Opposite → Find the flip**\n\nWhich pair of words are **antonyms** (opposites)?`,
                visual: {
                  component: "AnalogyDisplay",
                  props: (v) => ({
                    mode: "antonym",
                    pair1: [v.targetWord],
                    pair2word: v.targetWord,
                    answer: null,
                    relationship: `"${v.targetWord}" means: ${v.definition}`,
                    label: "Find the OPPOSITE"
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `Which pair are antonyms (opposites)?`,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.explanation}`,
                    incorrect: (v) => `Not quite! The answer is **${v.correctAnswer}**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The Flip Test — your recipe!",
                body: () => `Every time you see an antonym question, follow these 3 steps:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Read the word", why: "Define it in your own words" },
                      { text: "2. Think of the exact opposite", why: "Go to the FURTHEST extreme — not just 'different'" },
                      { text: "3. Find the flip", why: "The answer should flip back: if hot→cold, then cold→hot ✓" }
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
    ,
      ...antonymsSubConcepts
    ]
  },

  // ---- VR TOPIC 3: Odd Two Out ----
  oddTwoOut: {
    name: "Odd Two Out",
    subConcepts: [
      {
        id: "master-three-word-link",
        name: "The Three-Word Link",
        category: "master",
        lessons: [
          {
            id: "master-three-word-link-full",
            templateType: "master-method",
            learningGoal: [
              "How to find the THREE words that belong together",
              "A 3-step method for odd-two-out questions",
              "Why finding the link is easier than finding the odd ones"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "sorting word groups in her VR practice book",
                words: ["apple", "chair", "banana", "table", "orange"],
                linkedWords: "apple, banana & orange",
                linkName: "fruits",
                oddTwo: "chair & table",
                oddTwoReason: "they are furniture, not fruit",
                options: ["chair & banana", "apple & table", "chair & table", "banana & orange", "apple & chair"],
                correctAnswer: "chair & table",
                explanation: "Apple, banana and orange are all **fruits**. Chair and table are **furniture** — they don't belong in the fruit group. ✓",
                steps: [
                  "Read all 5: apple, chair, banana, table, orange",
                  "Find the 3 that link: apple, banana, orange — all FRUITS",
                  "Name it: the link is 'fruits' — so chair & table are the odd two out"
                ]
              },
              {
                name: "Ben",
                scenario: "doing VR questions during his lunch break",
                words: ["piano", "dog", "guitar", "cat", "violin"],
                linkedWords: "piano, guitar & violin",
                linkName: "musical instruments",
                oddTwo: "dog & cat",
                oddTwoReason: "they are animals, not instruments",
                options: ["dog & guitar", "piano & cat", "dog & cat", "guitar & violin", "piano & dog"],
                correctAnswer: "dog & cat",
                explanation: "Piano, guitar and violin are all **musical instruments**. Dog and cat are **animals** — they don't belong. ✓",
                steps: [
                  "Read all 5: piano, dog, guitar, cat, violin",
                  "Find the 3 that link: piano, guitar, violin — all MUSICAL INSTRUMENTS",
                  "Name it: the link is 'instruments' — so dog & cat are the odd two out"
                ]
              },
              {
                name: "Charlie",
                scenario: "racing through VR questions against the clock",
                words: ["red", "hammer", "blue", "screwdriver", "green"],
                linkedWords: "red, blue & green",
                linkName: "colours",
                oddTwo: "hammer & screwdriver",
                oddTwoReason: "they are tools, not colours",
                options: ["red & hammer", "hammer & screwdriver", "blue & green", "red & screwdriver", "hammer & blue"],
                correctAnswer: "hammer & screwdriver",
                explanation: "Red, blue and green are all **colours**. Hammer and screwdriver are **tools** — they don't belong in the colour group. ✓",
                steps: [
                  "Read all 5: red, hammer, blue, screwdriver, green",
                  "Find the 3 that link: red, blue, green — all COLOURS",
                  "Name it: the link is 'colours' — so hammer & screwdriver are the odd two out"
                ]
              },
              {
                name: "Lucas",
                scenario: "working through a VR paper with his mum",
                words: ["football", "rose", "tennis", "daisy", "cricket"],
                linkedWords: "football, tennis & cricket",
                linkName: "sports",
                oddTwo: "rose & daisy",
                oddTwoReason: "they are flowers, not sports",
                options: ["football & rose", "rose & daisy", "tennis & cricket", "football & daisy", "rose & tennis"],
                correctAnswer: "rose & daisy",
                explanation: "Football, tennis and cricket are all **sports**. Rose and daisy are **flowers** — they don't belong in the sports group. ✓",
                steps: [
                  "Read all 5: football, rose, tennis, daisy, cricket",
                  "Find the 3 that link: football, tennis, cricket — all SPORTS",
                  "Name it: the link is 'sports' — so rose & daisy are the odd two out"
                ]
              },
              {
                name: "Ella",
                scenario: "practising with a VR app on her tablet",
                words: ["Mars", "oak", "Jupiter", "elm", "Saturn"],
                linkedWords: "Mars, Jupiter & Saturn",
                linkName: "planets",
                oddTwo: "oak & elm",
                oddTwoReason: "they are trees, not planets",
                options: ["Mars & oak", "oak & elm", "Jupiter & Saturn", "Mars & elm", "oak & Jupiter"],
                correctAnswer: "oak & elm",
                explanation: "Mars, Jupiter and Saturn are all **planets**. Oak and elm are **trees** — they don't belong in the planet group. ✓",
                steps: [
                  "Read all 5: Mars, oak, Jupiter, elm, Saturn",
                  "Find the 3 that link: Mars, Jupiter, Saturn — all PLANETS",
                  "Name it: the link is 'planets' — so oak & elm are the odd two out"
                ]
              },
              {
                name: "Finn",
                scenario: "taking a mock 11+ test at the weekend",
                words: ["salmon", "eagle", "trout", "sparrow", "cod"],
                linkedWords: "salmon, trout & cod",
                linkName: "fish",
                oddTwo: "eagle & sparrow",
                oddTwoReason: "they are birds, not fish",
                options: ["salmon & eagle", "eagle & sparrow", "trout & cod", "salmon & sparrow", "eagle & cod"],
                correctAnswer: "eagle & sparrow",
                explanation: "Salmon, trout and cod are all **fish**. Eagle and sparrow are **birds** — they don't belong in the fish group. ✓",
                steps: [
                  "Read all 5: salmon, eagle, trout, sparrow, cod",
                  "Find the 3 that link: salmon, trout, cod — all FISH",
                  "Name it: the link is 'fish' — so eagle & sparrow are the odd two out"
                ]
              },
              {
                name: "Grace",
                scenario: "doing the hardest VR section of a GL practice paper",
                words: ["copper", "silk", "iron", "cotton", "bronze"],
                linkedWords: "copper, iron & bronze",
                linkName: "metals",
                oddTwo: "silk & cotton",
                oddTwoReason: "they are fabrics, not metals",
                options: ["copper & silk", "silk & cotton", "iron & bronze", "copper & cotton", "silk & iron"],
                correctAnswer: "silk & cotton",
                explanation: "Copper, iron and bronze are all **metals**. Silk and cotton are **fabrics** — they don't belong in the metals group. ✓",
                steps: [
                  "Read all 5: copper, silk, iron, cotton, bronze",
                  "Find the 3 that link: copper, iron, bronze — all METALS",
                  "Name it: the link is 'metals' — so silk & cotton are the odd two out"
                ],
                difficulty: 2
              },
              {
                name: "Hugo",
                scenario: "attempting a tricky VR challenge his tutor set him",
                words: ["sonnet", "waltz", "haiku", "tango", "limerick"],
                linkedWords: "sonnet, haiku & limerick",
                linkName: "types of poem",
                oddTwo: "waltz & tango",
                oddTwoReason: "they are dances, not poems",
                options: ["sonnet & waltz", "waltz & tango", "haiku & limerick", "sonnet & tango", "waltz & haiku"],
                correctAnswer: "waltz & tango",
                explanation: "Sonnet, haiku and limerick are all **types of poem**. Waltz and tango are **dances** — they don't belong in the poetry group. ✓",
                steps: [
                  "Read all 5: sonnet, waltz, haiku, tango, limerick",
                  "Find the 3 that link: sonnet, haiku, limerick — all TYPES OF POEM",
                  "Name it: the link is 'poems' — so waltz & tango are the odd two out"
                ],
                difficulty: 2
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "Which TWO don't belong?",
                body: (v) => `${v.name} is ${v.scenario}.\n\nYou'll see 5 words. **Three** of them belong together. Your job is to find the **two** that DON'T fit.\n\n**Top tip:** Don't look for what's wrong — look for what **connects** the three!`,
                visual: {
                  component: "WordChipsDisplay",
                  props: (v) => ({
                    words: v.words,
                    highlighted: v.words,
                    label: "Find the three that connect:"
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "The Three-Word Link — 3 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `The trick is to find the **three** that CONNECT, not the two that are odd. Here's how:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Read all 5 words", why: "Don't rush — read every word carefully" },
                        { text: "2. Find the 3 that link", why: "Ask: can I put 3 of these in the same category?" },
                        { text: "3. Name the link out loud", why: "Say it: 'These 3 are all _____' — the other 2 are the odd ones out" }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: () => `**Why find the 3, not the 2?** Because 3 things have MORE in common — the link is easier to spot!`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Finding the link`,
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Let's apply the method to: **${v.words.join(', ')}**`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: `Step ${i + 1}: ${step}`,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `So **${v.oddTwo}** are the odd two out because ${v.oddTwoReason}.`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — spot the odd two out!",
                body: (v) => `Use the 3 steps: **Read all 5 → Find the 3 that link → Name the link**`,
                visual: {
                  component: "WordChipsDisplay",
                  props: (v) => ({
                    words: v.words,
                    highlighted: [],
                    label: "Which TWO don't belong?"
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `Which TWO words are the odd ones out?`,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.explanation}`,
                    incorrect: (v) => `Not quite! The answer is **${v.correctAnswer}**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The Three-Word Link — your recipe!",
                body: () => `Every time you see an odd-two-out question, follow these 3 steps:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Read all 5 words", why: "Don't rush — read every single word" },
                      { text: "2. Find the 3 that link", why: "Look for a category that fits exactly 3 words" },
                      { text: "3. Name the link out loud", why: "Say 'These 3 are all _____' — the leftover 2 are your answer! ✓" }
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
    ,
      ...oddTwoOutSubConcepts
    ]
  },

  // ---- VR TOPIC 4: Verbal Analogies ----
  verbalAnalogies: {
    name: "Verbal Analogies",
    subConcepts: [
      {
        id: "master-name-the-link",
        name: "Name the Link",
        category: "master",
        lessons: [
          {
            id: "master-name-the-link-full",
            templateType: "master-method",
            learningGoal: [
              "What an analogy is — a relationship between pairs of words",
              "Common relationship types: part-whole, tool-user, young-adult, cause-effect",
              "A 4-step method for solving verbal analogy questions"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "solving word puzzles in her VR workbook",
                pair1: ["puppy", "dog"],
                pair2word: "kitten",
                answer: "cat",
                relationship: "young → adult",
                analogyDisplay: "puppy is to dog as kitten is to ___",
                options: ["mouse", "cat", "pet", "fur", "milk"],
                correctAnswer: "cat",
                explanation: "A puppy is a young dog. A kitten is a young **cat**. The relationship is young → adult animal. ✓",
                steps: [
                  "Read the pair: puppy → dog",
                  "Name the relationship: puppy is the YOUNG version of dog",
                  "Apply the same relationship: kitten is the YOUNG version of...?",
                  "Check: puppy→dog (young→adult) ✓  kitten→cat (young→adult) ✓"
                ]
              },
              {
                name: "Ben",
                scenario: "practising analogies with his dad after school",
                pair1: ["pen", "writer"],
                pair2word: "brush",
                answer: "painter",
                relationship: "tool → user",
                analogyDisplay: "pen is to writer as brush is to ___",
                options: ["paint", "painter", "canvas", "artist", "colour"],
                correctAnswer: "painter",
                explanation: "A pen is the tool used by a writer. A brush is the tool used by a **painter**. The relationship is tool → user. ✓",
                steps: [
                  "Read the pair: pen → writer",
                  "Name the relationship: a pen is the TOOL used by a writer",
                  "Apply the same relationship: a brush is the TOOL used by...?",
                  "Check: pen→writer (tool→user) ✓  brush→painter (tool→user) ✓"
                ]
              },
              {
                name: "Charlie",
                scenario: "working on VR at the library",
                pair1: ["finger", "hand"],
                pair2word: "toe",
                answer: "foot",
                relationship: "part → whole",
                analogyDisplay: "finger is to hand as toe is to ___",
                options: ["leg", "foot", "shoe", "sock", "nail"],
                correctAnswer: "foot",
                explanation: "A finger is part of a hand. A toe is part of a **foot**. The relationship is part → whole. ✓",
                steps: [
                  "Read the pair: finger → hand",
                  "Name the relationship: a finger is a PART of a hand",
                  "Apply the same relationship: a toe is a PART of...?",
                  "Check: finger→hand (part→whole) ✓  toe→foot (part→whole) ✓"
                ]
              },
              {
                name: "Hamza",
                scenario: "doing a VR worksheet at his desk",
                pair1: ["bird", "nest"],
                pair2word: "rabbit",
                answer: "burrow",
                relationship: "animal → home",
                analogyDisplay: "bird is to nest as rabbit is to ___",
                options: ["hutch", "burrow", "field", "hole", "warren"],
                correctAnswer: "burrow",
                explanation: "A bird lives in a nest. A rabbit lives in a **burrow**. The relationship is animal → home. ✓",
                steps: [
                  "Read the pair: bird → nest",
                  "Name the relationship: a bird lives in a NEST (animal → home)",
                  "Apply the same relationship: a rabbit lives in a...?",
                  "Check: bird→nest (animal→home) ✓  rabbit→burrow (animal→home) ✓"
                ]
              },
              {
                name: "Ella",
                scenario: "having a go at a harder VR section",
                pair1: ["heat", "melt"],
                pair2word: "cold",
                answer: "freeze",
                relationship: "cause → effect",
                analogyDisplay: "heat is to melt as cold is to ___",
                options: ["ice", "freeze", "snow", "chill", "winter"],
                correctAnswer: "freeze",
                explanation: "Heat causes something to melt. Cold causes something to **freeze**. The relationship is cause → effect. ✓",
                steps: [
                  "Read the pair: heat → melt",
                  "Name the relationship: heat CAUSES melting (cause → effect)",
                  "Apply the same relationship: cold CAUSES...?",
                  "Check: heat→melt (cause→effect) ✓  cold→freeze (cause→effect) ✓"
                ]
              },
              {
                name: "Finn",
                scenario: "working through a timed VR practice",
                pair1: ["eye", "see"],
                pair2word: "ear",
                answer: "hear",
                relationship: "body part → function",
                analogyDisplay: "eye is to see as ear is to ___",
                options: ["sound", "hear", "listen", "noise", "speak"],
                correctAnswer: "hear",
                explanation: "An eye is used to see. An ear is used to **hear**. The relationship is body part → function. ✓",
                steps: [
                  "Read the pair: eye → see",
                  "Name the relationship: an eye's function is to SEE",
                  "Apply the same relationship: an ear's function is to...?",
                  "Check: eye→see (part→function) ✓  ear→hear (part→function) ✓"
                ]
              },
              {
                name: "Grace",
                scenario: "attempting the hardest VR questions",
                pair1: ["author", "book"],
                pair2word: "composer",
                answer: "symphony",
                relationship: "creator → creation",
                analogyDisplay: "author is to book as composer is to ___",
                options: ["music", "symphony", "piano", "orchestra", "concert"],
                correctAnswer: "symphony",
                explanation: "An author creates a book. A composer creates a **symphony**. The relationship is creator → creation. ✓",
                steps: [
                  "Read the pair: author → book",
                  "Name the relationship: an author CREATES a book",
                  "Apply the same relationship: a composer CREATES a...?",
                  "Check: author→book (creator→creation) ✓  composer→symphony (creator→creation) ✓"
                ],
                difficulty: 2
              },
              {
                name: "Hugo",
                scenario: "preparing for his grammar school entrance exam",
                pair1: ["monarch", "kingdom"],
                pair2word: "captain",
                answer: "ship",
                relationship: "leader → what they lead",
                analogyDisplay: "monarch is to kingdom as captain is to ___",
                options: ["army", "ship", "crew", "sea", "uniform"],
                correctAnswer: "ship",
                explanation: "A monarch leads a kingdom. A captain leads a **ship**. The relationship is leader → what they lead. ✓",
                steps: [
                  "Read the pair: monarch → kingdom",
                  "Name the relationship: a monarch LEADS a kingdom",
                  "Apply the same relationship: a captain LEADS a...?",
                  "Check: monarch→kingdom (leader→domain) ✓  captain→ship (leader→domain) ✓"
                ],
                difficulty: 2
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "Can you complete the analogy?",
                body: (v) => `${v.name} is ${v.scenario}.\n\nAn **analogy** is a special pattern: two pairs of words that share the **same relationship**.\n\nWhat goes in the blank? Press Next to learn how to crack these every time!`,
                visual: {
                  component: "AnalogyDisplay",
                  props: (v) => ({
                    pair1: v.pair1,
                    pair2word: v.pair2word,
                    answer: null,
                    label: "Complete the pattern:"
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Name the Link — 4 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `The secret to analogies is **naming the relationship** between the first pair, then applying it to the second. Here's how:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Read the pair", why: "Look at the two words that are already connected" },
                        { text: "2. Name the relationship", why: "Say it: 'A is the ___ of B' (e.g., young version, tool, part)" },
                        { text: "3. Apply the same relationship", why: "Use the SAME relationship on the new word" },
                        { text: "4. Check both pairs match", why: "Both pairs should follow the EXACT same pattern" }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: () => `Here are the **common relationship types** to look for:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "Young → Adult", why: "puppy → dog, kitten → cat, cub → bear" },
                        { text: "Tool → User", why: "pen → writer, brush → painter, stethoscope → doctor" },
                        { text: "Part → Whole", why: "finger → hand, wheel → car, page → book" },
                        { text: "Cause → Effect", why: "heat → melt, cold → freeze, rain → flood" },
                        { text: "Creator → Creation", why: "author → book, composer → symphony, artist → painting" }
                      ],
                      allRevealed: true
                    })
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Solving: "${v.analogyDisplay}"`,
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Watch the 4 steps find the answer:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: `Step ${i + 1}: ${step}`,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `The relationship is **${v.relationship}** — and it works for both pairs!`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — complete the analogy!",
                body: (v) => `Use the 4 steps: **Read → Name → Apply → Check**`,
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
                  question: (v) => `${v.pair2word} is to ___ as ${v.pair1[0]} is to ${v.pair1[1]}`,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.explanation}`,
                    incorrect: (v) => `Not quite! The answer is **${v.correctAnswer}**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Name the Link — your recipe!",
                body: () => `Every time you see an analogy question, follow these 4 steps:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Read the pair", why: "Look at the connected words" },
                      { text: "2. Name the relationship", why: "Say it out loud: 'A is the ___ of B'" },
                      { text: "3. Apply the same relationship", why: "Use the EXACT same pattern on the new word" },
                      { text: "4. Check both pairs match", why: "Both pairs must follow the same relationship ✓" }
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
    ,
      ...verbalAnalogiesSubConcepts
    ]
  },

  // ---- VR TOPIC 5: Compound Words ----
  compoundWords: {
    name: "Compound Words",
    subConcepts: [
      {
        id: "master-say-it-spell-it",
        name: "Say It, Spell It",
        category: "master",
        lessons: [
          {
            id: "master-say-it-spell-it-full",
            templateType: "master-method",
            learningGoal: [
              "What a compound word is — two small words joined into one",
              "A 3-step method for compound word questions",
              "How to check by splitting the compound back into its parts"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "solving compound word puzzles in her VR book",
                sharedWord: "light",
                partnerWords: ["sun", "moon"],
                compounds: ["sunlight", "moonlight"],
                direction: "goes AFTER",
                questionFormat: "Which word goes in front of both 'light' and 'house'?",
                partnerWordsAlt: ["light", "light"],
                targetAnswer: "sun",
                fullQuestion: "Which word combines with LIGHT to make a compound word?",
                options: ["sun", "dark", "lamp", "bright", "glow"],
                correctAnswer: "sun",
                explanation: "'Sun' + 'light' = **sunlight** — that's one real word! 'Darlight', 'lamplight', 'brightlight' and 'glowlight' aren't compound words. ✓",
                steps: [
                  "Say combinations: sun+light = sunlight? Yes! It sounds like a real word",
                  "Spell it out: S-U-N-L-I-G-H-T — one word, correct spelling",
                  "Check: 'sunlight' is ONE real compound word ✓"
                ]
              },
              {
                name: "Ben",
                scenario: "working on a VR practice paper",
                sharedWord: "book",
                partnerWords: ["note", "text"],
                compounds: ["notebook", "textbook"],
                direction: "goes BEFORE",
                questionFormat: "Which word goes after both 'note' and 'text'?",
                targetAnswer: "book",
                fullQuestion: "Which word combines with NOTE to make a compound word?",
                options: ["book", "pad", "page", "paper", "case"],
                correctAnswer: "book",
                explanation: "'Note' + 'book' = **notebook** — one real compound word! 'Notepad' is two words, not a compound. ✓",
                steps: [
                  "Say combinations: note+book = notebook? Yes! That's a real word",
                  "Spell it out: N-O-T-E-B-O-O-K — one word, correct spelling",
                  "Check: 'notebook' is ONE real compound word ✓"
                ]
              },
              {
                name: "Charlie",
                scenario: "competing in a class VR quiz",
                sharedWord: "fire",
                partnerWords: ["camp", "bon"],
                compounds: ["campfire", "bonfire"],
                direction: "goes AFTER",
                questionFormat: "Which word goes after 'camp' and 'bon'?",
                targetAnswer: "fire",
                fullQuestion: "Which word combines with CAMP to make a compound word?",
                options: ["fire", "site", "ground", "flame", "heat"],
                correctAnswer: "fire",
                explanation: "'Camp' + 'fire' = **campfire** — one real compound word! Also works with 'bon' → bonfire. ✓",
                steps: [
                  "Say combinations: camp+fire = campfire? Yes! That's a real word",
                  "Spell it out: C-A-M-P-F-I-R-E — one word, correct spelling",
                  "Check: 'campfire' is ONE real compound word ✓"
                ]
              },
              {
                name: "Evie",
                scenario: "revising VR at the weekend",
                sharedWord: "rain",
                partnerWords: ["bow", "coat"],
                compounds: ["rainbow", "raincoat"],
                direction: "goes BEFORE",
                questionFormat: "Which word goes in front of both 'bow' and 'coat'?",
                targetAnswer: "rain",
                fullQuestion: "Which word combines with BOW to make a compound word?",
                options: ["rain", "sun", "wind", "snow", "hail"],
                correctAnswer: "rain",
                explanation: "'Rain' + 'bow' = **rainbow** and 'rain' + 'coat' = **raincoat** — both real compound words! ✓",
                steps: [
                  "Say combinations: rain+bow = rainbow? Yes! That's a real word",
                  "Spell it out: R-A-I-N-B-O-W — one word, correct spelling",
                  "Check: 'rainbow' is ONE real compound word ✓"
                ]
              },
              {
                name: "Ella",
                scenario: "doing VR homework at the kitchen table",
                sharedWord: "door",
                partnerWords: ["out", "in"],
                compounds: ["outdoor", "indoor"],
                direction: "goes AFTER",
                questionFormat: "Which word goes after both 'out' and 'in'?",
                targetAnswer: "door",
                fullQuestion: "Which word combines with OUT to make a compound word?",
                options: ["door", "side", "line", "ward", "fit"],
                correctAnswer: "door",
                explanation: "'Out' + 'door' = **outdoor** and 'in' + 'door' = **indoor** — both real compounds! ✓",
                steps: [
                  "Say combinations: out+door = outdoor? Yes! That sounds right",
                  "Spell it out: O-U-T-D-O-O-R — one word, correct spelling",
                  "Check: 'outdoor' is ONE real compound word ✓"
                ]
              },
              {
                name: "Finn",
                scenario: "practising compound words on the school bus",
                sharedWord: "berry",
                partnerWords: ["straw", "blue"],
                compounds: ["strawberry", "blueberry"],
                direction: "goes AFTER",
                questionFormat: "Which word goes after both 'straw' and 'blue'?",
                targetAnswer: "berry",
                fullQuestion: "Which word combines with STRAW to make a compound word?",
                options: ["berry", "fruit", "jam", "field", "cake"],
                correctAnswer: "berry",
                explanation: "'Straw' + 'berry' = **strawberry** and 'blue' + 'berry' = **blueberry** — both real compounds! ✓",
                steps: [
                  "Say combinations: straw+berry = strawberry? Yes! A real word",
                  "Spell it out: S-T-R-A-W-B-E-R-R-Y — one word, correct spelling",
                  "Check: 'strawberry' is ONE real compound word ✓"
                ]
              },
              {
                name: "Grace",
                scenario: "tackling harder compound word questions",
                sharedWord: "hand",
                partnerWords: ["back", "short"],
                compounds: ["backhand", "shorthand"],
                direction: "goes AFTER",
                questionFormat: "Which word goes after both 'back' and 'short'?",
                targetAnswer: "hand",
                fullQuestion: "Which word combines with BACK to make a compound word?",
                options: ["hand", "pack", "bone", "yard", "ground"],
                correctAnswer: "hand",
                explanation: "'Back' + 'hand' = **backhand** and 'short' + 'hand' = **shorthand** — both real compound words! ✓",
                steps: [
                  "Say combinations: back+hand = backhand? Yes! (a tennis shot)",
                  "Spell it out: B-A-C-K-H-A-N-D — one word, correct spelling",
                  "Check: 'backhand' is ONE real compound word ✓"
                ],
                difficulty: 2
              },
              {
                name: "Hugo",
                scenario: "working on the trickiest VR section",
                sharedWord: "fall",
                partnerWords: ["water", "down"],
                compounds: ["waterfall", "downfall"],
                direction: "goes AFTER",
                questionFormat: "Which word goes after both 'water' and 'down'?",
                targetAnswer: "fall",
                fullQuestion: "Which word combines with WATER to make a compound word?",
                options: ["fall", "drop", "flow", "way", "proof"],
                correctAnswer: "fall",
                explanation: "'Water' + 'fall' = **waterfall** and 'down' + 'fall' = **downfall** — both real compound words! ✓",
                steps: [
                  "Say combinations: water+fall = waterfall? Yes! A real word",
                  "Spell it out: W-A-T-E-R-F-A-L-L — one word, correct spelling",
                  "Check: 'waterfall' is ONE real compound word ✓"
                ],
                difficulty: 2
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "Can you build a compound word?",
                body: (v) => `${v.name} is ${v.scenario}.\n\nA **compound word** is made by joining **two smaller words** into one — like **foot + ball = football**.\n\nThe tricky part? Compound words often sound different from their parts! Press Next to learn the method.`,
                visual: {
                  component: "LetterTiles",
                  props: (v) => ({
                    mode: "compound",
                    group1: v.partnerWords[0].split(''),
                    group2: v.sharedWord.split(''),
                    resultWord: "",
                    label: `Can you build a compound word?`
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Say It, Spell It — 3 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `A **compound word** joins two words into ONE new word. Here's how to find them:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Say combinations in your head", why: "Try each option with the given word — does it SOUND like a real word?" },
                        { text: "2. Spell it out", why: "Write the two words together — is the spelling correct?" },
                        { text: "3. Check it's ONE real word", why: "A compound word is ONE word, not two separate words" }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: () => `**Top tip:** Some combinations SOUND right but aren't real compound words. Always check the spelling!`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Building "${v.compounds[0]}"`,
                bodyParts: (v) => [
                  {
                    type: 'visual',
                    component: 'LetterTiles',
                    props: (v) => ({
                      mode: "compound",
                      group1: v.partnerWords[0].split(''),
                      group2: v.sharedWord.split(''),
                      resultWord: v.compounds[0],
                      label: "The compound word:"
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: `Step ${i + 1}: ${step}`,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
                      allRevealed: false
                    })
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — build the compound word!",
                body: (v) => `Use the 3 steps: **Say it → Spell it → Check it**\n\n${v.fullQuestion}`,
                visual: {
                  component: "WorkedExample",
                  props: (v) => ({
                    steps: [
                      { text: "Step 1: Say each option with the given word", why: "Does it sound like a real word?" },
                      { text: "Step 2: Spell it out in your head", why: "Is it one word with correct spelling?" },
                      { text: "Step 3: Check it makes sense", why: "Is it a real compound word? ✓" }
                    ],
                    allRevealed: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => v.fullQuestion,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.explanation}`,
                    incorrect: (v) => `Not quite! The answer is **${v.correctAnswer}**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Say It, Spell It — your recipe!",
                body: () => `Every time you see a compound word question, follow these 3 steps:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Say combinations in your head", why: "Try every option — does it sound like a word you know?" },
                      { text: "2. Spell it out", why: "Write the letters together — is the spelling correct?" },
                      { text: "3. Check it's ONE real word", why: "Not two words, not a made-up word — ONE real compound word ✓" }
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
    ,
      ...compoundWordsSubConcepts
    ]
  },

  // ---- VR TOPIC 6: Hidden Words ----
  hiddenWords: {
    name: "Hidden Words",
    subConcepts: [
      {
        id: "master-sliding-window",
        name: "The Sliding Window",
        category: "master",
        lessons: [
          {
            id: "master-sliding-window-full",
            templateType: "master-method",
            learningGoal: [
              "How hidden word questions work — a word hides across a word boundary",
              "A 3-step method using the 'sliding window' technique",
              "The 3 split types: 3+1, 2+2, and 1+3 letters"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "searching for hidden words in her VR practice",
                sentence: "Please STOP ENGINES when parking the bus.",
                hiddenWord: "open",
                hiddenIn: "stOP ENgines",
                actualSpan: "STOP ENGINES",
                splitType: "2+2",
                lettersFrom: "OP from STOP + EN from ENGINES",
                clue: "a 4-letter word meaning 'not closed'",
                options: ["open", "stop", "pens", "tops", "nest"],
                correctAnswer: "open",
                explanation: "The word 'OPEN' is hidden across 'stOP' and 'ENgines' — st**OP** + **EN**gines = OPEN! ✓",
                steps: [
                  "Read the sentence and clue: 4-letter word meaning 'not closed'",
                  "Slide across the word boundary: st-OP | EN-gines → OPEN?",
                  "Check: O-P-E-N from 'stOP ENgines' = OPEN — means 'not closed' ✓"
                ]
              },
              {
                name: "Ben",
                scenario: "doing VR questions at his desk",
                sentence: "Please COME AND see me after school.",
                hiddenWord: "mean",
                hiddenIn: "coME ANd",
                actualSpan: "COME AND",
                splitType: "2+2",
                lettersFrom: "ME from COME + AN from AND",
                clue: "a 4-letter word meaning 'unkind'",
                options: ["mean", "cane", "mend", "dean", "come"],
                correctAnswer: "mean",
                explanation: "The word 'MEAN' is hidden across 'coME' and 'ANd' — co**ME** + **AN**d = MEAN! ✓",
                steps: [
                  "Read the sentence and clue: 4-letter word meaning 'unkind'",
                  "Slide across the boundary: co-ME | AN-d → MEAN?",
                  "Check: M-E-A-N from 'coME ANd' = MEAN — a real word meaning 'unkind' ✓"
                ]
              },
              {
                name: "Charlie",
                scenario: "practising hidden word questions",
                sentence: "She wore a NEW IDEA badge to school.",
                hiddenWord: "wide",
                hiddenIn: "neW IDEa",
                actualSpan: "NEW IDEA",
                splitType: "1+3",
                lettersFrom: "W from NEW + IDE from IDEA",
                clue: "a 4-letter word meaning 'not narrow'",
                options: ["wide", "wine", "idea", "weed", "dine"],
                correctAnswer: "wide",
                explanation: "The word 'WIDE' is hidden across 'neW' and 'IDEa' — ne**W** + **IDE**a = WIDE! ✓",
                steps: [
                  "Read the sentence and clue: 4-letter word meaning 'not narrow'",
                  "Slide across the word boundary: ne-W | IDE-a → WIDE?",
                  "Check: W-I-D-E from 'neW IDEa' = WIDE — means 'not narrow' ✓"
                ]
              },
              {
                name: "Daisy",
                scenario: "working through a VR paper with her sister",
                sentence: "We saw the BEACH AIR balloon at the fair.",
                hiddenWord: "chair",
                hiddenIn: "beaCH AIR",
                actualSpan: "BEACH AIR",
                splitType: "2+3",
                lettersFrom: "CH from BEACH + AIR from AIR",
                clue: "a 5-letter word meaning 'something to sit on'",
                options: ["chair", "beach", "reach", "charm", "chain"],
                correctAnswer: "chair",
                explanation: "The word 'CHAIR' is hidden across 'beaCH' and 'AIR' — bea**CH** + **AIR** = CHAIR! ✓",
                steps: [
                  "Read the sentence and clue: 5-letter word meaning 'something to sit on'",
                  "Slide across the boundary: bea-CH | AIR → CHAIR?",
                  "Check: C-H-A-I-R from 'beaCH AIR' = CHAIR — something to sit on ✓"
                ]
              },
              {
                name: "Ella",
                scenario: "looking for hidden words in sentences",
                sentence: "The BUS TOP was red and shiny.",
                hiddenWord: "stop",
                hiddenIn: "buS TOP",
                actualSpan: "BUS TOP",
                splitType: "1+3",
                lettersFrom: "S from BUS + TOP from TOP",
                clue: "a 4-letter word meaning 'halt'",
                options: ["stop", "bust", "tops", "spot", "post"],
                correctAnswer: "stop",
                explanation: "The word 'STOP' is hidden across 'buS' and 'TOP' — bu**S** + **TOP** = STOP! ✓",
                steps: [
                  "Read the sentence and clue: 4-letter word meaning 'halt'",
                  "Slide across the boundary: bu-S | TOP → STOP?",
                  "Check: S-T-O-P from 'buS TOP' = STOP — means 'halt' ✓"
                ]
              },
              {
                name: "Finn",
                scenario: "trying hidden word questions in a timed test",
                sentence: "The DISC OVER there belongs to Dad.",
                hiddenWord: "discover",
                hiddenIn: "DISC OVER",
                actualSpan: "DISC OVER",
                splitType: "4+4",
                lettersFrom: "DISC from DISC + OVER from OVER",
                clue: "an 8-letter word meaning 'to find'",
                options: ["discover", "discuss", "discard", "discord", "dispose"],
                correctAnswer: "discover",
                explanation: "The word 'DISCOVER' is hidden across 'DISC' and 'OVER' — **DISC** + **OVER** = DISCOVER! ✓",
                steps: [
                  "Read the sentence and clue: 8-letter word meaning 'to find'",
                  "Slide across the boundary: DISC | OVER → DISCOVER?",
                  "Check: D-I-S-C-O-V-E-R from 'DISC OVER' = DISCOVER — means 'to find' ✓"
                ]
              },
              {
                name: "Grace",
                scenario: "tackling trickier hidden word questions",
                sentence: "I SAW HIM leave through the garden gate.",
                hiddenWord: "whim",
                hiddenIn: "saW HIM",
                actualSpan: "SAW HIM",
                splitType: "1+3",
                lettersFrom: "W from SAW + HIM from HIM",
                clue: "a 4-letter word meaning 'a sudden idea'",
                options: ["whim", "swim", "slim", "shim", "skim"],
                correctAnswer: "whim",
                explanation: "The word 'WHIM' is hidden across 'saW' and 'HIM' — sa**W** + **HIM** = WHIM — a sudden idea! ✓",
                steps: [
                  "Read the sentence and clue: 4-letter word meaning 'a sudden idea'",
                  "Slide across the boundary: sa-W | HIM → WHIM?",
                  "Check: W-H-I-M from 'saW HIM' = WHIM — means 'a sudden idea' ✓"
                ],
                difficulty: 2
              },
              {
                name: "Hugo",
                scenario: "working on the hardest hidden word puzzles",
                sentence: "The PART HEN sat on her eggs in the barn.",
                hiddenWord: "then",
                hiddenIn: "parT HEN",
                actualSpan: "PART HEN",
                splitType: "1+3",
                lettersFrom: "T from PART + HEN from HEN",
                clue: "a 4-letter word meaning 'after that'",
                options: ["then", "them", "than", "when", "that"],
                correctAnswer: "then",
                explanation: "The word 'THEN' is hidden across 'parT' and 'HEN' — par**T** + **HEN** = THEN — meaning 'after that'! ✓",
                steps: [
                  "Read the sentence and clue: 4-letter word meaning 'after that'",
                  "Slide across the boundary: par-T | HEN → THEN?",
                  "Check: T-H-E-N from 'parT HEN' = THEN — means 'after that' ✓"
                ],
                difficulty: 2
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "Can you find the hidden word?",
                body: (v) => `${v.name} is ${v.scenario}.\n\nIn these questions, a **secret word** is hiding across the **gap between two words** in a sentence. Part of the word comes from the end of one word, and the rest from the start of the next.\n\nLook for: **${v.clue}**`,
                visual: {
                  component: "LetterTiles",
                  props: (v) => ({
                    mode: "window",
                    topLetters: v.actualSpan.replace(/ /g, '').split(''),
                    windowStart: -1,
                    windowEnd: -1,
                    label: `In "${v.actualSpan}":`
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "The Sliding Window — 3 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `The hidden word **spans two words** — part from the end of one, part from the start of the next. **Slide the purple letters across** to find it!`
                  },
                  {
                    type: 'visual',
                    component: 'SlidingWindow',
                    props: (v) => ({
                      word1: v.actualSpan.split(' ')[0],
                      word2: v.actualSpan.split(' ')[1] || v.actualSpan.split(' ')[0],
                      hiddenWord: v.hiddenWord,
                      label: `Slide to find the hidden word!`
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Read the sentence and clue", why: "Know what word you're looking for (length + meaning)" },
                        { text: "2. Slide across each word boundary", why: "Look at the END of each word + START of the next — try 3+1, 2+2, and 1+3 splits" },
                        { text: "3. Check: real word matching the clue?", why: "Does the hidden word match the meaning AND the letter count?" }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: () => `**The 3 split types:** If the hidden word is 4 letters, it could be split 3+1, 2+2, or 1+3 across the gap.`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Finding "${v.hiddenWord}"`,
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Watch the sliding window in action on:\n\n**"${v.sentence}"**\n\nClue: ${v.clue}`
                  },
                  {
                    type: 'visual',
                    component: 'LetterTiles',
                    props: (v) => {
                      const allLetters = v.actualSpan.replace(/ /g, '').split('');
                      const firstWordLen = v.actualSpan.split(' ')[0].length;
                      const fromFirst = parseInt(v.splitType.split('+')[0]);
                      const ws = firstWordLen - fromFirst;
                      return {
                        mode: "window",
                        topLetters: allLetters,
                        windowStart: ws,
                        windowEnd: ws + v.hiddenWord.length,
                        foundWord: v.hiddenWord.toUpperCase(),
                        label: `Hidden: ${v.hiddenWord.toUpperCase()} (${v.splitType} split)`
                      };
                    }
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: `Step ${i + 1}: ${step}`,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
                      allRevealed: false
                    })
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — find the hidden word!",
                body: (v) => `Use the Sliding Window to find the hidden word!\n\n**"${v.sentence}"**\n\nClue: ${v.clue}`,
                bodyParts: (v) => [
                  { type: 'text', content: (v) => `Use the Sliding Window to find the hidden word!\n\n**"${v.sentence}"**\n\nClue: ${v.clue}` },
                  { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                    word1: v.actualSpan.split(' ')[0],
                    word2: v.actualSpan.split(' ')[1] || v.actualSpan.split(' ')[0],
                    hiddenWord: v.hiddenWord,
                    label: "Slide the purple letters across to find the hidden word"
                  })}
                ],
                visual: null,
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `Which word is hidden in the sentence?`,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.explanation}`,
                    incorrect: (v) => `Not quite! The answer is **${v.correctAnswer}**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The Sliding Window — your recipe!",
                body: () => `Every time you see a hidden word question, follow these 3 steps:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Read the sentence and clue", why: "Know the word length and meaning" },
                      { text: "2. Slide across each word boundary", why: "Try all split types: 3+1, 2+2, 1+3 — the word straddles the gap" },
                      { text: "3. Check: real word matching the clue?", why: "Does it spell a real word with the right meaning? ✓" }
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
    ,
      ...hiddenWordsSubConcepts
    ]
  },

  // ---- VR TOPIC 7: Letter Move ----
  letterMove: {
    name: "Move a Letter",
    subConcepts: [
      {
        id: "master-remove-and-test",
        name: "Remove and Test",
        category: "master",
        lessons: [
          {
            id: "master-remove-and-test-full",
            templateType: "master-method",
            learningGoal: [
              "How letter-move questions work — move one letter between two words",
              "A 4-step method: pick, remove, insert, check",
              "The key rule: remaining letters stay in their original order"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "solving letter-move puzzles in her VR book",
                word1: "WHEAT",
                word2: "EAR",
                letterMoved: "W",
                newWord1: "HEAT",
                newWord2: "WEAR",
                options: ["W", "H", "E", "A", "T"],
                correctAnswer: "W",
                explanation: "Move 'W' from WHEAT → HEAT (hot temperature!). Insert W at the start of EAR → WEAR (to put on clothes!). Both are real words! ✓",
                steps: [
                  "Pick a letter from WHEAT: try 'W'",
                  "Remove W from WHEAT → HEAT — real word? YES ✓",
                  "Insert W into EAR → WEAR — real word? YES ✓",
                  "Check BOTH: HEAT ✓ and WEAR ✓ — done!"
                ]
              },
              {
                name: "Ben",
                scenario: "working on letter-move questions",
                word1: "BLAND",
                word2: "OAR",
                letterMoved: "B",
                newWord1: "LAND",
                newWord2: "BOAR",
                options: ["B", "L", "A", "N", "D"],
                correctAnswer: "B",
                explanation: "Move 'B' from BLAND → LAND (real word!). Insert B at the start of OAR → BOAR (a wild pig). Both are real words! ✓",
                steps: [
                  "Pick a letter from BLAND: try 'B'",
                  "Remove B from BLAND → LAND — real word? YES ✓",
                  "Insert B into OAR → BOAR — real word? YES (a wild pig) ✓",
                  "Check BOTH: LAND ✓ and BOAR ✓ — done!"
                ]
              },
              {
                name: "Charlie",
                scenario: "racing through letter-move questions",
                word1: "BRACE",
                word2: "OAT",
                letterMoved: "B",
                newWord1: "RACE",
                newWord2: "BOAT",
                options: ["B", "R", "A", "C", "E"],
                correctAnswer: "B",
                explanation: "Move 'B' from BRACE → RACE (a competition!). Insert B at the start of OAT → BOAT (floats on water!). Both are real words! ✓",
                steps: [
                  "Pick a letter from BRACE: try 'B'",
                  "Remove B from BRACE → RACE — real word? YES ✓",
                  "Insert B into OAT → BOAT — real word? YES ✓",
                  "Check BOTH: RACE ✓ and BOAT ✓ — done!"
                ]
              },
              {
                name: "Daisy",
                scenario: "solving VR letter puzzles at her desk",
                word1: "PLACE",
                word2: "ATE",
                letterMoved: "L",
                newWord1: "PACE",
                newWord2: "LATE",
                options: ["P", "L", "A", "C", "E"],
                correctAnswer: "L",
                explanation: "Move 'L' from PLACE → PACE (speed of walking!). Insert L at the start of ATE → LATE (not on time!). Both are real words! ✓",
                steps: [
                  "Pick a letter from PLACE: try 'L'",
                  "Remove L from PLACE → PACE — real word? YES ✓",
                  "Insert L into ATE → LATE — real word? YES ✓",
                  "Check BOTH: PACE ✓ and LATE ✓ — done!"
                ]
              },
              {
                name: "Ella",
                scenario: "practising letter moves on her tablet",
                word1: "CHARM",
                word2: "AIR",
                letterMoved: "C",
                newWord1: "HARM",
                newWord2: "CHAIR",
                options: ["C", "H", "A", "R", "M"],
                correctAnswer: "C",
                explanation: "Move 'C' from CHARM → HARM (damage!). Insert C at the start of AIR → CHAIR (something to sit on!). Both are real words! ✓",
                steps: [
                  "Pick a letter from CHARM: try 'C'",
                  "Remove C from CHARM → HARM — real word? YES ✓",
                  "Insert C into AIR → CHAIR — real word? YES ✓",
                  "Check BOTH: HARM ✓ and CHAIR ✓ — done!"
                ]
              },
              {
                name: "Finn",
                scenario: "doing letter puzzles at breaktime",
                word1: "PRICE",
                word2: "LAY",
                letterMoved: "P",
                newWord1: "RICE",
                newWord2: "PLAY",
                options: ["P", "R", "I", "C", "E"],
                correctAnswer: "P",
                explanation: "Move 'P' from PRICE → RICE (a food!). Insert P at the start of LAY → PLAY (a game!). Both are real words! ✓",
                steps: [
                  "Pick a letter from PRICE: try 'P'",
                  "Remove P from PRICE → RICE — real word? YES ✓",
                  "Insert P into LAY → PLAY — real word? YES ✓",
                  "Check BOTH: RICE ✓ and PLAY ✓ — done!"
                ]
              },
              {
                name: "Grace",
                scenario: "attempting harder letter-move questions",
                word1: "GLOVE",
                word2: "ROW",
                letterMoved: "G",
                newWord1: "LOVE",
                newWord2: "GROW",
                options: ["G", "L", "O", "V", "E"],
                correctAnswer: "G",
                explanation: "Move 'G' from GLOVE → LOVE (a real word!). Insert G into ROW → GROW (to get bigger!). Both are real words! ✓",
                steps: [
                  "Pick a letter from GLOVE: try 'G'",
                  "Remove G from GLOVE → LOVE — real word? YES ✓",
                  "Insert G into ROW → GROW — real word? YES ✓",
                  "Check BOTH: LOVE ✓ and GROW ✓ — done!"
                ],
                difficulty: 2
              },
              {
                name: "Hugo",
                scenario: "working through the toughest letter-move questions",
                word1: "BRAVE",
                word2: "OWL",
                letterMoved: "B",
                newWord1: "RAVE",
                newWord2: "BOWL",
                options: ["B", "R", "A", "V", "E"],
                correctAnswer: "B",
                explanation: "Move 'B' from BRAVE → RAVE (to shout with excitement!). Insert B at the start of OWL → BOWL (a dish!). Both are real words! ✓",
                steps: [
                  "Pick a letter from BRAVE: try 'B'",
                  "Remove B from BRAVE → RAVE — real word? YES ✓",
                  "Insert B into OWL → BOWL — real word? YES ✓",
                  "Check BOTH: RAVE ✓ and BOWL ✓ — done!"
                ],
                difficulty: 2
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "Move one letter to make two new words!",
                body: (v) => `${v.name} is ${v.scenario}.\n\nIn these questions, you take **one letter** out of the first word and put it into the second word. Both must become **real words**!\n\n**Key rule:** The remaining letters stay in their original order — no rearranging!`,
                visual: {
                  component: "LetterTiles",
                  props: (v) => ({
                    mode: "word",
                    letters: v.word1.split(''),
                    label: `${v.word1}  →  move a letter  →  ${v.word2}`
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Remove and Test — 4 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Take one letter from **${v.word1}**, put it into **${v.word2}** — both must become real words. Here's the method:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `1. Pick a letter from ${v.word1}`, why: "Start with the first or last letter — they're easiest to test" },
                        { text: `2. Remove it — is ${v.word1} still real?`, why: "The remaining letters stay in ORDER (no rearranging!)" },
                        { text: `3. Insert it into ${v.word2}`, why: "Try different positions — start, middle, end" },
                        { text: "4. Check BOTH are real words", why: `${v.newWord1} ✓ and ${v.newWord2} ✓` }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**Pro tip:** If removing a letter doesn't leave a real word, skip to the next letter — don't waste time!`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Moving a letter: ${v.word1} & ${v.word2}`,
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Let's apply the 4 steps to **${v.word1}** and **${v.word2}**:`
                  },
                  {
                    type: 'visual',
                    component: 'LetterTiles',
                    props: (v) => ({
                      mode: "word",
                      letters: v.word1.split(''),
                      strikeIndices: [v.word1.indexOf(v.letterMoved)],
                      label: `${v.word1} → ${v.newWord1} (remove ${v.letterMoved})`
                    })
                  },
                  {
                    type: 'visual',
                    component: 'LetterTiles',
                    props: (v) => ({
                      mode: "word",
                      letters: v.newWord2.split(''),
                      highlightIndices: [v.newWord2.indexOf(v.letterMoved)],
                      highlightColor: "#16a34a",
                      label: `${v.word2} → ${v.newWord2} (insert ${v.letterMoved})`
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: `Step ${i + 1}: ${step}`,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
                      allRevealed: false
                    })
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — which letter moves?",
                body: (v) => `Use the 4 steps: **Pick → Remove → Insert → Check**\n\nMove one letter from **${v.word1}** into **${v.word2}** to make two new real words.`,
                visual: {
                  component: "LetterTiles",
                  props: (v) => ({
                    mode: "word",
                    letters: v.word1.split(''),
                    label: `Move a letter from ${v.word1} into ${v.word2}:`
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `Which letter should you move from ${v.word1} to ${v.word2}?`,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.explanation}`,
                    incorrect: (v) => `Not quite! The answer is **${v.correctAnswer}**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Remove and Test — your recipe!",
                body: () => `Every time you see a letter-move question, follow these 4 steps:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Pick a letter from word 1", why: "Try first/last letters first — they're quickest to test" },
                      { text: "2. Remove it — still a real word?", why: "If not, try the next letter (don't waste time!)" },
                      { text: "3. Insert into word 2", why: "Try start, middle, and end positions" },
                      { text: "4. Check BOTH are real words", why: "BOTH must be proper English words ✓" }
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
    ,
      ...letterMoveSubConcepts
    ]
  },

  // ---- VR TOPIC 8: Missing Letters (Words) ----
  missingLettersWords: {
    name: "Missing Letters",
    subConcepts: [
      {
        id: "master-fill-the-gap",
        name: "Fill the Gap",
        category: "master",
        lessons: [
          {
            id: "master-fill-the-gap-full",
            templateType: "master-method",
            learningGoal: [
              "How missing-letter questions work — fill in blanks to make a real word",
              "A 3-step method: read surrounding letters, try common groups, say it aloud",
              "How to use the letters you CAN see to narrow down the answer"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "filling in missing letters in her VR practice",
                template: "CH _ _ TER",
                missingLetters: "AP",
                fullWord: "CHAPTER",
                letterCount: "2 missing letters",
                options: ["AP", "AR", "AT", "AN", "AS"],
                correctAnswer: "AP",
                explanation: "CH + AP + TER = **CHAPTER** (a section of a book). The other options make CHARTER, CHATTER, CHANTER, CHASTER — but CHAPTER is the most common word! ✓",
                steps: [
                  "Read surrounding letters: CH___TER — starts with CH, ends with TER",
                  "Try common letter groups: CH-AP-TER? CH-AR-TER? CH-AT-TER?",
                  "Say it aloud: CHAPTER — yes! A chapter is a section of a book ✓"
                ]
              },
              {
                name: "Ben",
                scenario: "doing missing-letter questions at his desk",
                template: "PL _ _ TED",
                missingLetters: "AN",
                fullWord: "PLANTED",
                letterCount: "2 missing letters",
                options: ["AN", "AT", "OT", "AI", "EA"],
                correctAnswer: "AN",
                explanation: "PL + AN + TED = **PLANTED** (put a seed in the ground). Clear and common! ✓",
                steps: [
                  "Read surrounding letters: PL___TED — starts with PL, ends with TED",
                  "Try common groups: PL-AN-TED? PL-AT-TED? PL-OT-TED?",
                  "Say it aloud: PLANTED — yes! Like planting seeds in a garden ✓"
                ]
              },
              {
                name: "Charlie",
                scenario: "solving word puzzles in her VR workbook",
                template: "S _ _ ING",
                missingLetters: "PR",
                fullWord: "SPRING",
                letterCount: "2 missing letters",
                options: ["PR", "TR", "TI", "WI", "LI"],
                correctAnswer: "PR",
                explanation: "S + PR + ING = **SPRING** (a season, or to jump). ✓",
                steps: [
                  "Read surrounding letters: S___ING — starts with S, ends with ING",
                  "Try common groups: S-PR-ING? S-TR-ING? S-TI-NG?",
                  "Say it aloud: SPRING — yes! Spring is a season ✓"
                ]
              },
              {
                name: "Daisy",
                scenario: "practising VR at the kitchen table",
                template: "W _ _ DOW",
                missingLetters: "IN",
                fullWord: "WINDOW",
                letterCount: "2 missing letters",
                options: ["IN", "ID", "IS", "IL", "IT"],
                correctAnswer: "IN",
                explanation: "W + IN + DOW = **WINDOW** (something you look through). ✓",
                steps: [
                  "Read surrounding letters: W___DOW — starts with W, ends with DOW",
                  "Try common groups: W-IN-DOW? W-ID-DOW?",
                  "Say it aloud: WINDOW — yes! You look through a window ✓"
                ]
              },
              {
                name: "Ella",
                scenario: "working through a VR practice test",
                template: "G _ _ DEN",
                missingLetters: "AR",
                fullWord: "GARDEN",
                letterCount: "2 missing letters",
                options: ["AR", "OL", "UR", "AI", "OR"],
                correctAnswer: "AR",
                explanation: "G + AR + DEN = **GARDEN** (an outdoor space with plants). ✓",
                steps: [
                  "Read surrounding letters: G___DEN — starts with G, ends with DEN",
                  "Try common groups: G-AR-DEN? G-OL-DEN? G-UR-DEN?",
                  "Say it aloud: GARDEN — yes! Where you grow flowers ✓"
                ]
              },
              {
                name: "Finn",
                scenario: "doing VR questions on the bus",
                template: "B _ _ KET",
                missingLetters: "AS",
                fullWord: "BASKET",
                letterCount: "2 missing letters",
                options: ["AS", "UC", "LA", "IS", "AN"],
                correctAnswer: "AS",
                explanation: "B + AS + KET = **BASKET** (something to carry things in). ✓",
                steps: [
                  "Read surrounding letters: B___KET — starts with B, ends with KET",
                  "Try common groups: B-AS-KET? B-UC-KET? B-LA-KET?",
                  "Say it aloud: BASKET — yes! You put things in a basket ✓"
                ]
              },
              {
                name: "Grace",
                scenario: "tackling harder missing-letter questions",
                template: "T _ _ ASURE",
                missingLetters: "RE",
                fullWord: "TREASURE",
                letterCount: "2 missing letters",
                options: ["RE", "RI", "RA", "RO", "RU"],
                correctAnswer: "RE",
                explanation: "T + RE + ASURE = **TREASURE** (valuable things like gold and jewels). ✓",
                steps: [
                  "Read surrounding letters: T___ASURE — starts with T, ends with ASURE",
                  "Try common groups: T-RE-ASURE? T-RI-ASURE?",
                  "Say it aloud: TREASURE — yes! Pirates look for treasure ✓"
                ],
                difficulty: 2
              },
              {
                name: "Hugo",
                scenario: "working on the trickiest missing-letter puzzles",
                template: "K _ _ WLEDGE",
                missingLetters: "NO",
                fullWord: "KNOWLEDGE",
                letterCount: "2 missing letters",
                options: ["NO", "NA", "NI", "NU", "NE"],
                correctAnswer: "NO",
                explanation: "K + NO + WLEDGE = **KNOWLEDGE** (what you know). The 'K' is silent! ✓",
                steps: [
                  "Read surrounding letters: K___WLEDGE — starts with K, ends with WLEDGE",
                  "Try common groups: K-NO-WLEDGE? Remember the silent K!",
                  "Say it aloud: KNOWLEDGE — yes! It means 'what you know' ✓"
                ],
                difficulty: 2
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "Can you fill in the missing letters?",
                body: (v) => `${v.name} is ${v.scenario}.\n\nYou'll see a word with some letters missing (shown as blanks). Your job is to figure out which letters complete the word.\n\n**${v.template}** — what goes in the gaps?`,
                visual: {
                  component: "LetterTiles",
                  props: (v) => ({
                    mode: "gap",
                    template: v.template.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                    showFilled: false,
                    label: `${v.letterCount} to find:`
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Fill the Gap — 3 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `The letters you CAN see are your biggest clue. Use them to narrow down what fits:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Read the surrounding letters", why: "What does the word START with? What does it END with? These limit your options" },
                        { text: "2. Try common letter groups", why: "Think of letter combinations that are common in English (AN, IN, ER, OU, etc.)" },
                        { text: "3. Say the whole word aloud", why: "Does it sound like a real word you know? If yes, you've got it!" }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: () => `**Top tip:** Start with the letters you can see — they tell you a LOT about the word!`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Completing "${v.template}"`,
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Let's fill in **${v.template}**:`
                  },
                  {
                    type: 'visual',
                    component: 'LetterTiles',
                    props: (v) => {
                      const letters = v.fullWord.split('');
                      const templateParsed = v.template.split(' ').flatMap(part => part === '_' ? ['_'] : part.split(''));
                      const highlightIndices = templateParsed.map((c, i) => c === '_' ? i : -1).filter(i => i >= 0);
                      return {
                        mode: "word",
                        letters: letters,
                        highlightIndices: highlightIndices,
                        highlightColor: "#16a34a",
                        label: `${v.fullWord}!`
                      };
                    }
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: `Step ${i + 1}: ${step}`,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
                      allRevealed: false
                    })
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — fill in the blanks!",
                body: (v) => `Use the 3 steps: **Read → Try → Say**\n\n**${v.template}**`,
                visual: {
                  component: "LetterTiles",
                  props: (v) => ({
                    mode: "gap",
                    template: v.template.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                    showFilled: false,
                    label: `Fill in the gaps:`
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `Which letters complete ${v.template}?`,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.explanation}`,
                    incorrect: (v) => `Not quite! The answer is **${v.correctAnswer}**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Fill the Gap — your recipe!",
                body: () => `Every time you see a missing-letter question, follow these 3 steps:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Read the surrounding letters", why: "The start and end of the word are your biggest clues" },
                      { text: "2. Try common letter groups", why: "AN, IN, ER, OU, EA — these appear in lots of English words" },
                      { text: "3. Say the whole word aloud", why: "If it sounds like a word you know — you've got it! ✓" }
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
    ,
      ...missingLettersWordsSubConcepts
    ]
  },

  // ---- VR TOPIC 9: Shared Letter ----
  sharedLetter: {
    name: "Shared Letter",
    subConcepts: [
      {
        id: "master-restrictive-word",
        name: "The Restrictive Word",
        category: "master",
        lessons: [
          {
            id: "master-restrictive-word-full",
            templateType: "master-method",
            learningGoal: [
              "How shared-letter questions work — one letter completes ALL the words",
              "A 3-step method: find the hardest word first, then test on all others",
              "Why starting with the 'restrictive' word saves time"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "solving shared-letter puzzles in her VR book",
                words: ["CA_E", "LA_E", "MA_E"],
                sharedLetter: "K",
                completedWords: ["CAKE", "LAKE", "MAKE"],
                restrictiveWord: "CA_E",
                restrictiveReason: "CAKE, CAVE, CAFE, CARE, CASE — many options, but only K works for ALL three",
                options: ["K", "R", "S", "T", "V"],
                correctAnswer: "K",
                explanation: "The letter **K** completes all three: CAKE, LAKE, MAKE. Other letters like R (CARE, LARE?, MARE) don't work for all. ✓",
                steps: [
                  "Find the restrictive word: CA_E has many options (K, R, S, T, V...)",
                  "List candidates: K→CAKE, R→CARE, S→CASE, T→CATE, V→CAVE",
                  "Test K on ALL words: CA-K-E=CAKE ✓, LA-K-E=LAKE ✓, MA-K-E=MAKE ✓ — K works!"
                ]
              },
              {
                name: "Ben",
                scenario: "working on shared-letter questions",
                words: ["_OAT", "_OLD", "_OAL"],
                sharedLetter: "G",
                completedWords: ["GOAT", "GOLD", "GOAL"],
                restrictiveWord: "_OAL",
                restrictiveReason: "only G, C and F make real words (GOAL, COAL, FOAL)",
                options: ["G", "B", "C", "F", "M"],
                correctAnswer: "G",
                explanation: "The letter **G** completes all three: GOAT, GOLD, GOAL. C gives COAT, COLD, COAL — but COAT, COLD, COAL all work too! However G is the intended answer as GOAT is clearer. ✓",
                steps: [
                  "Find the restrictive word: _OAL has fewer options (GOAL, COAL, FOAL)",
                  "List candidates for all: G→GOAT/GOLD/GOAL, C→COAT/COLD/COAL",
                  "Test G on ALL: GOAT ✓, GOLD ✓, GOAL ✓ — G works!"
                ]
              },
              {
                name: "Charlie",
                scenario: "racing through VR shared-letter puzzles",
                words: ["_AND", "_EST", "_OOK"],
                sharedLetter: "B",
                completedWords: ["BAND", "BEST", "BOOK"],
                restrictiveWord: "_OOK",
                restrictiveReason: "only B, C, H, L, N make real words with _OOK",
                options: ["B", "H", "L", "R", "T"],
                correctAnswer: "B",
                explanation: "The letter **B** completes all three: BAND, BEST, BOOK. H gives HAND, HEST(?), HOOK — HEST isn't a word. L gives LAND, LEST, LOOK — all real! But B is clearest. ✓",
                steps: [
                  "Find the restrictive word: _OOK = BOOK, COOK, HOOK, LOOK, NOOK...",
                  "Test B on ALL: B+AND=BAND ✓, B+EST=BEST ✓, B+OOK=BOOK ✓",
                  "All three work — B is the shared letter!"
                ]
              },
              {
                name: "Daisy",
                scenario: "practising shared-letter questions at her desk",
                words: ["_AIN", "_ULE", "_OAD"],
                sharedLetter: "R",
                completedWords: ["RAIN", "RULE", "ROAD"],
                restrictiveWord: "_ULE",
                restrictiveReason: "only M, R, Y make real words (MULE, RULE, YULE)",
                options: ["R", "M", "P", "S", "T"],
                correctAnswer: "R",
                explanation: "The letter **R** completes all three: RAIN, RULE, ROAD. M gives MAIN, MULE, MOAD — MOAD isn't a word! ✓",
                steps: [
                  "Find the restrictive word: _ULE has few options (MULE, RULE, YULE)",
                  "Test R on ALL: R+AIN=RAIN ✓, R+ULE=RULE ✓, R+OAD=ROAD ✓",
                  "All three work — R is the shared letter!"
                ]
              },
              {
                name: "Ella",
                scenario: "trying shared-letter puzzles on her tablet",
                words: ["_OWN", "_ARK", "_EAR"],
                sharedLetter: "D",
                completedWords: ["DOWN", "DARK", "DEAR"],
                restrictiveWord: "_ARK",
                restrictiveReason: "BARK, DARK, LARK, MARK, PARK — several options",
                options: ["D", "B", "L", "M", "P"],
                correctAnswer: "D",
                explanation: "The letter **D** completes all three: DOWN, DARK, DEAR. B gives BOWN(?), BARK, BEAR — BOWN isn't a word! ✓",
                steps: [
                  "Find the restrictive word: _OWN = DOWN, GOWN, TOWN, SOWN...",
                  "Test D on ALL: D+OWN=DOWN ✓, D+ARK=DARK ✓, D+EAR=DEAR ✓",
                  "All three work — D is the shared letter!"
                ]
              },
              {
                name: "Finn",
                scenario: "doing shared-letter questions at breaktime",
                words: ["_ING", "_EEP", "_IND"],
                sharedLetter: "W",
                completedWords: ["WING", "WEEP", "WIND"],
                restrictiveWord: "_EEP",
                restrictiveReason: "BEEP, DEEP, JEEP, KEEP, PEEP, SEEP, WEEP",
                options: ["W", "D", "K", "S", "R"],
                correctAnswer: "W",
                explanation: "The letter **W** completes all three: WING, WEEP, WIND. D gives DING, DEEP, DIND — DIND isn't a word! ✓",
                steps: [
                  "Find the restrictive word: _IND = BIND, FIND, HIND, KIND, MIND, WIND...",
                  "Test W on ALL: W+ING=WING ✓, W+EEP=WEEP ✓, W+IND=WIND ✓",
                  "All three work — W is the shared letter!"
                ]
              },
              {
                name: "Grace",
                scenario: "tackling harder shared-letter puzzles",
                words: ["_ATCH", "_ASTE", "_RITE"],
                sharedLetter: "W",
                completedWords: ["WATCH", "WASTE", "WRITE"],
                restrictiveWord: "_RITE",
                restrictiveReason: "only W makes a common word (WRITE)",
                options: ["W", "B", "C", "H", "L"],
                correctAnswer: "W",
                explanation: "The letter **W** completes all three: WATCH, WASTE, WRITE. B gives BATCH, BASTE, BRITE — BRITE isn't a word! ✓",
                steps: [
                  "Find the restrictive word: _RITE — only WRITE is common",
                  "Test W on ALL: W+ATCH=WATCH ✓, W+ASTE=WASTE ✓, W+RITE=WRITE ✓",
                  "All three work — W is the shared letter!"
                ],
                difficulty: 2
              },
              {
                name: "Hugo",
                scenario: "attempting the hardest shared-letter questions",
                words: ["_IGHT", "_OUND", "_IGHT"],
                sharedLetter: "S",
                completedWords: ["SIGHT", "SOUND", "SIGHT"],
                restrictiveWord: "_OUND",
                restrictiveReason: "BOUND, FOUND, HOUND, MOUND, POUND, ROUND, SOUND, WOUND",
                options: ["S", "F", "H", "M", "R"],
                correctAnswer: "S",
                explanation: "The letter **S** completes all: SIGHT, SOUND. F gives FIGHT, FOUND — FIGHT works but check all three patterns. S works for all! ✓",
                steps: [
                  "Find the restrictive word: _OUND has many options but _IGHT narrows it",
                  "Test S on ALL: S+IGHT=SIGHT ✓, S+OUND=SOUND ✓",
                  "Both work — S is the shared letter!"
                ],
                difficulty: 2
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "What single letter completes ALL the words?",
                body: (v) => `${v.name} is ${v.scenario}.\n\nIn these questions, the **same letter** goes in the **same position** in every word. You need to find which letter works for ALL of them — not just one!`,
                visual: {
                  component: "LetterTiles",
                  props: (v) => ({
                    mode: "shared",
                    words: v.words,
                    gapPosition: v.words[0].indexOf('_'),
                    showFilled: false,
                    label: "What letter completes ALL words?"
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "The Restrictive Word — 3 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `The trick is to start with the word that has the **fewest possible letters** — the "restrictive" word. This narrows your options fast!`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Find the restrictive word", why: "Which word has the FEWEST letters that could complete it?" },
                        { text: "2. List candidate letters", why: "Write down all letters that work for that word" },
                        { text: "3. Test each candidate on ALL words", why: "Only ONE letter will work for every single word" }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: () => `**Why the restrictive word?** If a word only has 2-3 possible letters, you only need to test 2-3 options instead of 26!`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Finding the shared letter`,
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Let's apply the method to: **${v.words.join('  ')}**`
                  },
                  {
                    type: 'visual',
                    component: 'LetterTiles',
                    props: (v) => ({
                      mode: "shared",
                      words: v.words,
                      gapPosition: v.words[0].indexOf('_'),
                      filledLetter: v.sharedLetter,
                      showFilled: true,
                      label: `The shared letter is ${v.sharedLetter}!`
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: `Step ${i + 1}: ${step}`,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
                      allRevealed: false
                    })
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — find the shared letter!",
                body: (v) => `Use the 3 steps: **Restrictive word → Candidates → Test all**\n\n**${v.words.join('    ')}**`,
                visual: {
                  component: "LetterTiles",
                  props: (v) => ({
                    mode: "shared",
                    words: v.words,
                    gapPosition: v.words[0].indexOf('_'),
                    showFilled: false,
                    label: "Find the shared letter:"
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `Which letter completes ALL the words?`,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.explanation}`,
                    incorrect: (v) => `Not quite! The answer is **${v.correctAnswer}**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The Restrictive Word — your recipe!",
                body: () => `Every time you see a shared-letter question, follow these 3 steps:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Find the restrictive word", why: "Which word has the FEWEST possible completions?" },
                      { text: "2. List candidate letters", why: "Only a few letters can work — write them down" },
                      { text: "3. Test on ALL words", why: "The right letter must complete EVERY word, not just one ✓" }
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
    ,
      ...sharedLetterSubConcepts
    ]
  },

  // ---- VR TOPIC 10: Letter Codes ----
  letterCodes: {
    name: "Letter Codes",
    subConcepts: [
      {
        id: "master-count-the-hops",
        name: "Count the Hops",
        category: "master",
        lessons: [
          {
            id: "master-count-the-hops-full",
            templateType: "master-method",
            learningGoal: [
              "How letter code questions work — letters are shifted by a fixed number",
              "The EJOTY trick for quick alphabet positioning (E=5, J=10, O=15, T=20, Y=25)",
              "A 4-step method for cracking letter codes"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "cracking coded messages in her VR practice",
                originalWord: "CAT",
                codedWord: "DBU",
                shift: "+1",
                shiftDescription: "each letter moves FORWARD 1 place",
                decodeWord: "DOG",
                decodedAnswer: "EPH",
                workings: "C→D (+1), A→B (+1), T→U (+1)",
                decodeWorkings: "D→E (+1), O→P (+1), G→H (+1)",
                options: ["EPH", "CPF", "DOG", "ENH", "FOI"],
                correctAnswer: "EPH",
                explanation: "The code shifts each letter +1: D→E, O→P, G→H = **EPH**. ✓",
                steps: [
                  "Write letters aligned: C→D, A→B, T→U",
                  "Count the hops: C to D = +1, A to B = +1, T to U = +1",
                  "Check consistency: every letter shifts +1 — that's the rule!",
                  "Apply to DOG: D→E, O→P, G→H = EPH"
                ]
              },
              {
                name: "Ben",
                scenario: "decoding letter codes at his desk",
                originalWord: "HAT",
                codedWord: "GZS",
                shift: "-1",
                shiftDescription: "each letter moves BACK 1 place",
                decodeWord: "PEN",
                decodedAnswer: "ODM",
                workings: "H→G (-1), A→Z (-1), T→S (-1)",
                decodeWorkings: "P→O (-1), E→D (-1), N→M (-1)",
                options: ["ODM", "QFO", "PEN", "NCL", "OEM"],
                correctAnswer: "ODM",
                explanation: "The code shifts each letter -1: P→O, E→D, N→M = **ODM**. ✓",
                steps: [
                  "Write letters aligned: H→G, A→Z, T→S",
                  "Count the hops: H to G = -1, A to Z = -1 (wraps around!), T to S = -1",
                  "Check consistency: every letter shifts -1 — that's the rule!",
                  "Apply to PEN: P→O, E→D, N→M = ODM"
                ]
              },
              {
                name: "Charlie",
                scenario: "solving code puzzles in a VR quiz",
                originalWord: "BIG",
                codedWord: "DKI",
                shift: "+2",
                shiftDescription: "each letter moves FORWARD 2 places",
                decodeWord: "SUN",
                decodedAnswer: "UWP",
                workings: "B→D (+2), I→K (+2), G→I (+2)",
                decodeWorkings: "S→U (+2), U→W (+2), N→P (+2)",
                options: ["UWP", "TVN", "SUN", "VXQ", "QSL"],
                correctAnswer: "UWP",
                explanation: "The code shifts each letter +2: S→U, U→W, N→P = **UWP**. ✓",
                steps: [
                  "Write letters aligned: B→D, I→K, G→I",
                  "Count the hops: B to D = +2, I to K = +2, G to I = +2",
                  "Check consistency: every letter shifts +2 — that's the rule!",
                  "Apply to SUN: S→U, U→W, N→P = UWP"
                ]
              },
              {
                name: "Lucas",
                scenario: "cracking codes with his study group",
                originalWord: "RED",
                codedWord: "PCB",
                shift: "-2",
                shiftDescription: "each letter moves BACK 2 places",
                decodeWord: "CUP",
                decodedAnswer: "ASN",
                workings: "R→P (-2), E→C (-2), D→B (-2)",
                decodeWorkings: "C→A (-2), U→S (-2), P→N (-2)",
                options: ["ASN", "EWR", "CUP", "BTM", "DVO"],
                correctAnswer: "ASN",
                explanation: "The code shifts each letter -2: C→A, U→S, P→N = **ASN**. ✓",
                steps: [
                  "Write letters aligned: R→P, E→C, D→B",
                  "Count the hops: R to P = -2, E to C = -2, D to B = -2",
                  "Check consistency: every letter shifts -2 — that's the rule!",
                  "Apply to CUP: C→A, U→S, P→N = ASN"
                ]
              },
              {
                name: "Ella",
                scenario: "working through code questions in a timed test",
                originalWord: "TOP",
                codedWord: "WRS",
                shift: "+3",
                shiftDescription: "each letter moves FORWARD 3 places",
                decodeWord: "BED",
                decodedAnswer: "EHG",
                workings: "T→W (+3), O→R (+3), P→S (+3)",
                decodeWorkings: "B→E (+3), E→H (+3), D→G (+3)",
                options: ["EHG", "DAF", "BED", "FIH", "CGF"],
                correctAnswer: "EHG",
                explanation: "The code shifts each letter +3: B→E, E→H, D→G = **EHG**. ✓",
                steps: [
                  "Write letters aligned: T→W, O→R, P→S",
                  "Count the hops: T to W = +3, O to R = +3, P to S = +3",
                  "Check consistency: every letter shifts +3 — that's the rule!",
                  "Apply to BED: B→E, E→H, D→G = EHG"
                ]
              },
              {
                name: "Finn",
                scenario: "decoding at breaktime",
                originalWord: "SIT",
                codedWord: "UKV",
                shift: "+2",
                shiftDescription: "each letter moves FORWARD 2 places",
                decodeWord: "HEN",
                decodedAnswer: "JGP",
                workings: "S→U (+2), I→K (+2), T→V (+2)",
                decodeWorkings: "H→J (+2), E→G (+2), N→P (+2)",
                options: ["JGP", "IGO", "HEN", "KHQ", "FCP"],
                correctAnswer: "JGP",
                explanation: "The code shifts each letter +2: H→J, E→G, N→P = **JGP**. ✓",
                steps: [
                  "Write letters aligned: S→U, I→K, T→V",
                  "Count the hops: S to U = +2, I to K = +2, T to V = +2",
                  "Check consistency: every letter shifts +2 — that's the rule!",
                  "Apply to HEN: H→J, E→G, N→P = JGP"
                ]
              },
              {
                name: "Grace",
                scenario: "tackling harder letter codes",
                originalWord: "HELP",
                codedWord: "GDKO",
                shift: "-1",
                shiftDescription: "each letter moves BACK 1 place",
                decodeWord: "FAST",
                decodedAnswer: "EZRS",
                workings: "H→G (-1), E→D (-1), L→K (-1), P→O (-1)",
                decodeWorkings: "F→E (-1), A→Z (-1), S→R (-1), T→S (-1)",
                options: ["EZRS", "GBTU", "FAST", "DYQR", "FART"],
                correctAnswer: "EZRS",
                explanation: "The code shifts each letter -1: F→E, A→Z (wraps!), S→R, T→S = **EZRS**. ✓",
                steps: [
                  "Write letters aligned: H→G, E→D, L→K, P→O",
                  "Count the hops: H to G = -1, E to D = -1, L to K = -1, P to O = -1",
                  "Check consistency: every letter shifts -1 — the rule!",
                  "Apply to FAST: F→E, A→Z, S→R, T→S = EZRS"
                ],
                difficulty: 2
              },
              {
                name: "Hugo",
                scenario: "working on the toughest code puzzles",
                originalWord: "COLD",
                codedWord: "FROG",
                shift: "+3",
                shiftDescription: "each letter moves FORWARD 3 places",
                decodeWord: "WARM",
                decodedAnswer: "ZDUP",
                workings: "C→F (+3), O→R (+3), L→O (+3), D→G (+3)",
                decodeWorkings: "W→Z (+3), A→D (+3), R→U (+3), M→P (+3)",
                options: ["ZDUP", "XBRN", "WARM", "YCTM", "AEVQ"],
                correctAnswer: "ZDUP",
                explanation: "The code shifts each letter +3: W→Z, A→D, R→U, M→P = **ZDUP**. ✓",
                steps: [
                  "Write letters aligned: C→F, O→R, L→O, D→G",
                  "Count the hops: C to F = +3, O to R = +3, L to O = +3, D to G = +3",
                  "Check consistency: every letter shifts +3 — the rule!",
                  "Apply to WARM: W→Z, A→D, R→U, M→P = ZDUP"
                ],
                difficulty: 2
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "Can you crack the code?",
                body: (v) => `${v.name} is ${v.scenario}.\n\nIn letter code questions, each letter has been **shifted** by the same number of places in the alphabet. Your job is to figure out the shift and apply it to a new word.\n\nIf **${v.originalWord}** is coded as **${v.codedWord}**, what's the rule?`,
                visual: {
                  component: "AlphabetLine",
                  props: (v) => ({
                    showEJOTY: true,
                    points: v.originalWord.split('').map(l => ({ letter: l, color: "#6C5CE7" })).concat(
                      v.codedWord.split('').map(l => ({ letter: l, color: "#dc2626" }))
                    ),
                    hops: v.originalWord.split('').map((l, i) => ({ from: l, to: v.codedWord[i], label: v.shift }))
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Count the Hops — 4 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `Each letter shifts the SAME number of places. Use **EJOTY** to quickly find where letters sit in the alphabet:\n\n**E**=5, **J**=10, **O**=15, **T**=20, **Y**=25`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Write letters aligned", why: "Put original above coded — line them up" },
                        { text: "2. Count the hops", why: "How many places forward (+) or backward (-) does each letter move?" },
                        { text: "3. Check consistency", why: "Every letter should shift by the SAME amount" },
                        { text: "4. Apply the rule", why: "Shift each letter of the new word by the same amount" }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: () => `**EJOTY trick:** E is the 5th letter. Count forward or backward from the nearest EJOTY letter to find any letter's position quickly!`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Cracking: ${v.originalWord} → ${v.codedWord}`,
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Watch the 4 steps decode **${v.originalWord} → ${v.codedWord}**, then encode **${v.decodeWord}**:`
                  },
                  {
                    type: 'visual',
                    component: 'AlphabetLine',
                    props: (v) => ({
                      showEJOTY: true,
                      hops: v.originalWord.split('').map((l, i) => ({
                        from: l, to: v.codedWord[i], label: v.shift
                      }))
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: `Step ${i + 1}: ${step}`,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `The rule is **${v.shiftDescription}**. So ${v.decodeWord} becomes **${v.decodedAnswer}**.`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — apply the code!",
                body: (v) => `The rule: **${v.shiftDescription}**\n\nIf **${v.originalWord}** becomes **${v.codedWord}**, what does **${v.decodeWord}** become?`,
                visual: {
                  component: "AlphabetLine",
                  props: (v) => ({
                    showEJOTY: true,
                    points: v.decodeWord.split('').map(l => ({ letter: l, color: "#6C5CE7" }))
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What is ${v.decodeWord} coded as?`,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.explanation}`,
                    incorrect: (v) => `Not quite! The answer is **${v.correctAnswer}**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Count the Hops — your recipe!",
                body: () => `Every time you see a letter code question, follow these 4 steps:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Write letters aligned", why: "Original on top, coded below" },
                      { text: "2. Count the hops", why: "Use EJOTY (E=5, J=10, O=15, T=20, Y=25) to find positions" },
                      { text: "3. Check consistency", why: "All letters should shift the same amount" },
                      { text: "4. Apply the rule", why: "Shift the new word's letters by the same number ✓" }
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
    ,
      ...letterCodesSubConcepts
    ]
  },

  // ---- VR TOPIC 11: Letter Pair Series ----
  letterPairSeries: {
    name: "Letter Pair Series",
    subConcepts: [
      {
        id: "master-split-and-track",
        name: "Split and Track",
        category: "master",
        lessons: [
          {
            id: "master-split-and-track-full",
            templateType: "master-method",
            learningGoal: [
              "How letter pair series work — pairs where each letter follows its own pattern",
              "A 3-step method: split, find each pattern, combine",
              "How two DIFFERENT patterns can run at the same time"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "solving letter pair series in her VR practice",
                series: "AZ, BY, CX, DW",
                nextPair: "EV",
                firstLetters: "A, B, C, D → E",
                firstPattern: "+1 (forward through alphabet)",
                secondLetters: "Z, Y, X, W → V",
                secondPattern: "-1 (backward through alphabet)",
                options: ["EV", "EU", "FV", "EW", "DV"],
                correctAnswer: "EV",
                explanation: "First letters go forward: A, B, C, D, **E**. Second letters go backward: Z, Y, X, W, **V**. Next pair = **EV**. ✓",
                steps: [
                  "Split into two rows: A,B,C,D and Z,Y,X,W",
                  "First row pattern: A→B→C→D = +1 each time, so next is E",
                  "Second row pattern: Z→Y→X→W = -1 each time, so next is V",
                  "Combine: E + V = EV"
                ]
              },
              {
                name: "Ben",
                scenario: "working through letter series questions",
                series: "BZ, DX, FV, HT",
                nextPair: "JR",
                firstLetters: "B, D, F, H → J",
                firstPattern: "+2 (skip one letter forward)",
                secondLetters: "Z, X, V, T → R",
                secondPattern: "-2 (skip one letter backward)",
                options: ["JR", "IS", "KQ", "JT", "IR"],
                correctAnswer: "JR",
                explanation: "First letters skip +2: B, D, F, H, **J**. Second letters skip -2: Z, X, V, T, **R**. Next pair = **JR**. ✓",
                steps: [
                  "Split into two rows: B,D,F,H and Z,X,V,T",
                  "First row pattern: B→D→F→H = +2 each time, so next is J",
                  "Second row pattern: Z→X→V→T = -2 each time, so next is R",
                  "Combine: J + R = JR"
                ]
              },
              {
                name: "Charlie",
                scenario: "racing through a VR test",
                series: "AC, BD, CE, DF",
                nextPair: "EG",
                firstLetters: "A, B, C, D → E",
                firstPattern: "+1 (forward through alphabet)",
                secondLetters: "C, D, E, F → G",
                secondPattern: "+1 (forward through alphabet)",
                options: ["EG", "EF", "FG", "DG", "EH"],
                correctAnswer: "EG",
                explanation: "First letters: A, B, C, D, **E** (+1). Second letters: C, D, E, F, **G** (+1). Both go forward by 1! Next = **EG**. ✓",
                steps: [
                  "Split into two rows: A,B,C,D and C,D,E,F",
                  "First row pattern: A→B→C→D = +1 each time, so next is E",
                  "Second row pattern: C→D→E→F = +1 each time, so next is G",
                  "Combine: E + G = EG"
                ]
              },
              {
                name: "Evie",
                scenario: "practising letter pairs at her desk",
                series: "ZA, YB, XC, WD",
                nextPair: "VE",
                firstLetters: "Z, Y, X, W → V",
                firstPattern: "-1 (backward through alphabet)",
                secondLetters: "A, B, C, D → E",
                secondPattern: "+1 (forward through alphabet)",
                options: ["VE", "VF", "UE", "WE", "UD"],
                correctAnswer: "VE",
                explanation: "First letters go backward: Z, Y, X, W, **V**. Second letters go forward: A, B, C, D, **E**. Next pair = **VE**. ✓",
                steps: [
                  "Split into two rows: Z,Y,X,W and A,B,C,D",
                  "First row pattern: Z→Y→X→W = -1 each time, so next is V",
                  "Second row pattern: A→B→C→D = +1 each time, so next is E",
                  "Combine: V + E = VE"
                ]
              },
              {
                name: "Ella",
                scenario: "doing letter series on her tablet",
                series: "AE, BF, CG, DH",
                nextPair: "EI",
                firstLetters: "A, B, C, D → E",
                firstPattern: "+1 (forward)",
                secondLetters: "E, F, G, H → I",
                secondPattern: "+1 (forward)",
                options: ["EI", "EJ", "FI", "DI", "EH"],
                correctAnswer: "EI",
                explanation: "First letters: A, B, C, D, **E** (+1). Second letters: E, F, G, H, **I** (+1). Next pair = **EI**. ✓",
                steps: [
                  "Split into two rows: A,B,C,D and E,F,G,H",
                  "First row pattern: A→B→C→D = +1, so next is E",
                  "Second row pattern: E→F→G→H = +1, so next is I",
                  "Combine: E + I = EI"
                ]
              },
              {
                name: "Finn",
                scenario: "solving series at breaktime",
                series: "CZ, EX, GV, IT",
                nextPair: "KR",
                firstLetters: "C, E, G, I → K",
                firstPattern: "+2 (skip one forward)",
                secondLetters: "Z, X, V, T → R",
                secondPattern: "-2 (skip one backward)",
                options: ["KR", "JS", "LR", "KS", "JR"],
                correctAnswer: "KR",
                explanation: "First letters skip +2: C, E, G, I, **K**. Second letters skip -2: Z, X, V, T, **R**. Next pair = **KR**. ✓",
                steps: [
                  "Split into two rows: C,E,G,I and Z,X,V,T",
                  "First row: C→E→G→I = +2 each time, so next is K",
                  "Second row: Z→X→V→T = -2 each time, so next is R",
                  "Combine: K + R = KR"
                ]
              },
              {
                name: "Grace",
                scenario: "tackling harder letter pair series",
                series: "AZ, CX, EV, GT",
                nextPair: "IR",
                firstLetters: "A, C, E, G → I",
                firstPattern: "+2 (skip one forward)",
                secondLetters: "Z, X, V, T → R",
                secondPattern: "-2 (skip one backward)",
                options: ["IR", "HR", "IS", "HS", "JR"],
                correctAnswer: "IR",
                explanation: "First letters skip +2: A, C, E, G, **I**. Second letters skip -2: Z, X, V, T, **R**. Next pair = **IR**. ✓",
                steps: [
                  "Split into two rows: A,C,E,G and Z,X,V,T",
                  "First row: A→C→E→G = +2 each time, so next is I",
                  "Second row: Z→X→V→T = -2 each time, so next is R",
                  "Combine: I + R = IR"
                ],
                difficulty: 2
              },
              {
                name: "Hugo",
                scenario: "working on the hardest series questions",
                series: "BX, DV, FT, HR",
                nextPair: "JP",
                firstLetters: "B, D, F, H → J",
                firstPattern: "+2 (skip one forward)",
                secondLetters: "X, V, T, R → P",
                secondPattern: "-2 (skip one backward)",
                options: ["JP", "IP", "JQ", "KP", "IO"],
                correctAnswer: "JP",
                explanation: "First letters skip +2: B, D, F, H, **J**. Second letters skip -2: X, V, T, R, **P**. Next pair = **JP**. ✓",
                steps: [
                  "Split into two rows: B,D,F,H and X,V,T,R",
                  "First row: B→D→F→H = +2 each time, so next is J",
                  "Second row: X→V→T→R = -2 each time, so next is P",
                  "Combine: J + P = JP"
                ],
                difficulty: 2
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "What comes next in the series?",
                body: (v) => `${v.name} is ${v.scenario}.\n\nEach item is a **pair of letters**. The tricky bit? Each letter in the pair often follows a **different pattern**!\n\n**${v.series}, ___**\n\nCan you see the pattern?`,
                visual: {
                  component: "SequenceChain",
                  props: (v) => ({
                    terms: v.series.split(', '),
                    showDifferences: false,
                    nextValue: "?",
                    showNext: true
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Split and Track — 3 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `The secret: the two letters in each pair often follow **different patterns**. Look:\n\nFirst letters: **${v.firstLetters}** (${v.firstPattern})\nSecond letters: **${v.secondLetters}** (${v.secondPattern})`
                  },
                  {
                    type: 'visual',
                    component: 'AlphabetLine',
                    props: (v) => ({
                      showEJOTY: true,
                      showPositionNumbers: true,
                      points: v.firstLetters.replace(/ → .+/, '').split(', ').map(l => ({ letter: l.trim(), color: "#6C5CE7" })).concat(
                        v.secondLetters.replace(/ → .+/, '').split(', ').map(l => ({ letter: l.trim(), color: "#22c55e" }))
                      )
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Split pairs into two rows", why: "Write first letters in one row, second letters in another" },
                        { text: "2. Find each row's pattern", why: "Count the hops — does it go +1, +2, -1, -2?" },
                        { text: "3. Combine next letters", why: "Apply each pattern to get the next letter, then put them together" }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: () => `**Key insight:** The two letters can go in completely opposite directions! One might go forward while the other goes backward.`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Solving: ${v.series}`,
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Watch the method on: **${v.series}, ___**`
                  },
                  {
                    type: 'visual',
                    component: 'SequenceChain',
                    props: (v) => ({
                      terms: v.series.split(', '),
                      showDifferences: false,
                      nextValue: v.nextPair,
                      showNext: true,
                      highlightTerms: [v.series.split(', ').length]
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: `Step ${i + 1}: ${step}`,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
                      allRevealed: false
                    })
                  },
                  {
                    type: 'visual',
                    component: 'AlphabetLine',
                    props: (v) => {
                      const pairs = v.series.split(', ');
                      const firstLetters = pairs.map(p => p[0]);
                      const hopsArr = [];
                      for (let i = 0; i < firstLetters.length - 1; i++) {
                        hopsArr.push({ from: firstLetters[i], to: firstLetters[i + 1], label: v.firstPattern.match(/[+-]\d+/)?.[0] || '' });
                      }
                      return {
                        showEJOTY: true,
                        points: firstLetters.map(l => ({ letter: l, color: "#6C5CE7" })),
                        hops: hopsArr
                      };
                    }
                  },
                  {
                    type: 'text',
                    content: (v) => `First letters: ${v.firstPattern}. Second letters: ${v.secondPattern}. Next pair = **${v.nextPair}**!`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — what's the next pair?",
                body: (v) => `Split and Track: separate the two rows, find each pattern, combine.\n\n**${v.series}, ___**`,
                visual: {
                  component: "SequenceChain",
                  props: (v) => ({
                    terms: v.series.split(', '),
                    showDifferences: false,
                    nextValue: "?",
                    showNext: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What comes next: ${v.series}, ___?`,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.explanation}`,
                    incorrect: (v) => `Not quite! The answer is **${v.correctAnswer}**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Split and Track — your recipe!",
                body: () => `Every time you see a letter pair series, follow these 3 steps:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Split pairs into two rows", why: "Write first letters on one line, second letters on another" },
                      { text: "2. Find each row's pattern", why: "They might go different directions! (+1/−1, +2/−2, etc.)" },
                      { text: "3. Combine next letters", why: "Apply each pattern, join the results — that's your answer ✓" }
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
    ,
      ...letterPairSeriesSubConcepts
    ]
  },

  // ---- VR TOPIC 12: Word Code Analogies ----
  wordCodeAnalogies: {
    name: "Word Code Analogies",
    subConcepts: [
      {
        id: "master-spot-the-rule",
        name: "Spot the Rule",
        category: "master",
        lessons: [
          {
            id: "master-spot-the-rule-full",
            templateType: "master-method",
            learningGoal: [
              "How word code analogies work — a word is transformed by a rule",
              "Common transformation types: remove a letter, rearrange, shift letters",
              "A 3-step method: compare, name the rule, apply"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "solving word code puzzles in her VR book",
                inputWord: "big",
                outputWord: "dig",
                rule: "change the first letter to D",
                newInput: "rip",
                newOutput: "dip",
                ruleExplanation: "The first letter changes to D, everything else stays the same",
                options: ["dip", "rip", "drip", "rid", "dim"],
                correctAnswer: "dip",
                explanation: "big→dig: the B changed to D. Apply the same rule to rip: R changes to D = **dip**. ✓",
                steps: [
                  "Compare input & output: big → dig — what changed?",
                  "Name the rule: the first letter changed from B to D",
                  "Apply to new word: rip → change first letter to D → dip"
                ]
              },
              {
                name: "Ben",
                scenario: "decoding word puzzles at his desk",
                inputWord: "top",
                outputWord: "pot",
                rule: "reverse the word",
                newInput: "tar",
                newOutput: "rat",
                ruleExplanation: "The word is written backwards",
                options: ["rat", "tar", "art", "ran", "rap"],
                correctAnswer: "rat",
                explanation: "top→pot: the word is reversed. Apply to tar: reversed = **rat**. ✓",
                steps: [
                  "Compare input & output: top → pot — what changed?",
                  "Name the rule: the letters are REVERSED (written backwards)",
                  "Apply to new word: tar → reversed → rat"
                ]
              },
              {
                name: "Charlie",
                scenario: "working through a VR practice paper",
                inputWord: "plan",
                outputWord: "pan",
                rule: "remove the second letter",
                newInput: "stop",
                newOutput: "sop",
                ruleExplanation: "The second letter is removed, the rest stay in order",
                options: ["sop", "stp", "top", "sot", "sto"],
                correctAnswer: "sop",
                explanation: "plan→pan: the 'l' (2nd letter) was removed. Apply to stop: remove 't' (2nd letter) = **sop**. ✓",
                steps: [
                  "Compare input & output: plan → pan — what's missing?",
                  "Name the rule: the SECOND letter is removed",
                  "Apply to new word: stop → remove 2nd letter (t) → sop"
                ]
              },
              {
                name: "Hamza",
                scenario: "solving code analogies at the kitchen table",
                inputWord: "cat",
                outputWord: "cats",
                rule: "add S to the end",
                newInput: "dog",
                newOutput: "dogs",
                ruleExplanation: "An 'S' is added to the end of the word",
                options: ["dogs", "doge", "dong", "digs", "gods"],
                correctAnswer: "dogs",
                explanation: "cat→cats: an S was added to the end. Apply to dog: add S = **dogs**. ✓",
                steps: [
                  "Compare input & output: cat → cats — what was added?",
                  "Name the rule: the letter S is added to the END",
                  "Apply to new word: dog → add S to end → dogs"
                ]
              },
              {
                name: "Ella",
                scenario: "working on word code puzzles in a timed test",
                inputWord: "coat",
                outputWord: "oat",
                rule: "remove the first letter",
                newInput: "brim",
                newOutput: "rim",
                ruleExplanation: "The first letter is removed",
                options: ["rim", "bri", "rip", "aim", "ram"],
                correctAnswer: "rim",
                explanation: "coat→oat: the first letter (C) was removed. Apply to brim: remove B = **rim**. ✓",
                steps: [
                  "Compare input & output: coat → oat — what's missing?",
                  "Name the rule: the FIRST letter is removed",
                  "Apply to new word: brim → remove first letter (B) → rim"
                ]
              },
              {
                name: "Finn",
                scenario: "solving code puzzles at breaktime",
                inputWord: "hear",
                outputWord: "heap",
                rule: "change the last letter to P",
                newInput: "mat",
                newOutput: "map",
                ruleExplanation: "The last letter changes to P",
                options: ["map", "mat", "mop", "tap", "nap"],
                correctAnswer: "map",
                explanation: "hear→heap: the last letter (R) changed to P. Apply to mat: change T to P = **map**. ✓",
                steps: [
                  "Compare input & output: hear → heap — what changed?",
                  "Name the rule: the LAST letter changed to P",
                  "Apply to new word: mat → change last letter to P → map"
                ]
              },
              {
                name: "Grace",
                scenario: "tackling harder code analogies",
                inputWord: "STEP",
                outputWord: "PEST",
                rule: "reverse the word",
                newInput: "DRAW",
                newOutput: "WARD",
                ruleExplanation: "The word is written backwards",
                options: ["WARD", "WART", "DWAR", "RAWD", "WADR"],
                correctAnswer: "WARD",
                explanation: "STEP→PEST: the word is reversed. Apply to DRAW: reversed = **WARD**. ✓",
                steps: [
                  "Compare input & output: STEP → PEST — what happened?",
                  "Name the rule: the letters are REVERSED",
                  "Apply to new word: DRAW → reversed → WARD"
                ],
                difficulty: 2
              },
              {
                name: "Hugo",
                scenario: "working on the toughest code problems",
                inputWord: "TRAP",
                outputWord: "RAP",
                rule: "remove the first letter",
                newInput: "BLEND",
                newOutput: "LEND",
                ruleExplanation: "The first letter is removed",
                options: ["LEND", "BEND", "LENT", "LENT", "LENT"],
                correctAnswer: "LEND",
                explanation: "TRAP→RAP: the first letter (T) was removed. Apply to BLEND: remove B = **LEND**. ✓",
                steps: [
                  "Compare input & output: TRAP → RAP — what's missing?",
                  "Name the rule: the FIRST letter is removed",
                  "Apply to new word: BLEND → remove first letter (B) → LEND"
                ],
                difficulty: 2
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "What's the rule?",
                body: (v) => `${v.name} is ${v.scenario}.\n\nA word goes IN, and a transformed word comes OUT. Your job is to figure out the **rule**, then apply it to a new word.\n\n**${v.inputWord}(${v.outputWord})**  →  **${v.newInput}(???)**`,
                visual: {
                  component: "CodeTable",
                  props: (v) => ({
                    headers: ["Input", "Output"],
                    rows: [
                      { cells: [v.inputWord, v.outputWord] },
                      { cells: [v.newInput, "???"], highlight: true }
                    ]
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Spot the Rule — 3 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `The word has been changed by a **rule** — maybe a letter was removed, added, swapped, or the word was reversed. Find the rule and apply it:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Compare input & output", why: "Put them side by side — what letters changed, moved, or disappeared?" },
                        { text: "2. Name the transformation", why: "Say it: 'The first letter was removed' or 'The word is reversed'" },
                        { text: "3. Apply to the new word", why: "Use the EXACT same rule on the new word" }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: () => `**Common rules:** remove first/last letter, reverse the word, change one letter, add a letter, swap two letters`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Rule: ${v.inputWord} → ${v.outputWord}`,
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Watch the 3 steps find the rule and apply it:`
                  },
                  {
                    type: 'visual',
                    component: 'CodeTable',
                    props: (v) => ({
                      headers: ["Input", "Output", "Rule"],
                      rows: [
                        { cells: [v.inputWord, v.outputWord, v.rule] },
                        { cells: [v.newInput, v.newOutput, v.rule], highlight: true }
                      ]
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: `Step ${i + 1}: ${step}`,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `The rule is: **${v.ruleExplanation}**. So ${v.newInput} → **${v.newOutput}**.`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — apply the rule!",
                body: (v) => `**${v.inputWord}(${v.outputWord})**  →  **${v.newInput}(???)**\n\nSpot the rule and apply it!`,
                visual: {
                  component: "CodeTable",
                  props: (v) => ({
                    headers: ["Input", "Output"],
                    rows: [
                      { cells: [v.inputWord, v.outputWord] },
                      { cells: [v.newInput, "???"], highlight: true }
                    ]
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `If ${v.inputWord}(${v.outputWord}), what is ${v.newInput}(?)?`,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.explanation}`,
                    incorrect: (v) => `Not quite! The answer is **${v.correctAnswer}**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Spot the Rule — your recipe!",
                body: () => `Every time you see a word code analogy, follow these 3 steps:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Compare input & output", why: "What changed? What stayed the same?" },
                      { text: "2. Name the transformation", why: "Say the rule out loud: 'The ___ was ___'" },
                      { text: "3. Apply to the new word", why: "Use the EXACT same rule — don't change anything else ✓" }
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
    ,
      ...wordCodeAnalogiesSubConcepts
    ]
  },

  // ---- VR TOPIC 13: Number-Word Codes ----
  numberWordCodes: {
    name: "Number-Word Codes",
    subConcepts: [
      {
        id: "master-table-method",
        name: "The Table Method",
        category: "master",
        lessons: [
          {
            id: "master-table-method-full",
            templateType: "master-method",
            learningGoal: [
              "How number-word codes work — each letter maps to a number",
              "A 4-step method using a mapping table",
              "How to use repeated letters to crack the code faster"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "cracking number-word codes in her VR practice",
                word1: "SPOT",
                code1: "1234",
                word2: "TOPS",
                code2: "4321",
                targetWord: "POST",
                targetCode: "2314",
                mapping: "S=1, P=2, O=3, T=4",
                options: ["2314", "3124", "3214", "2341", "1234"],
                correctAnswer: "2314",
                explanation: "From SPOT=1234: S=1, P=2, O=3, T=4. POST = P(2) O(3) S(1) T(4) = **2314**. ✓",
                steps: [
                  "Match word to code: S=1, P=2, O=3, T=4 (from SPOT=1234)",
                  "Check with TOPS=4321: T(4) O(3) P(2) S(1) = 4321 ✓ — confirmed!",
                  "Build the table: S→1, P→2, O→3, T→4",
                  "Decode POST: P(2) O(3) S(1) T(4) = 2314"
                ]
              },
              {
                name: "Ben",
                scenario: "solving number codes at his desk",
                word1: "CARE",
                code1: "1234",
                word2: "RACE",
                code2: "3214",
                targetWord: "ACRE",
                targetCode: "2134",
                mapping: "C=1, A=2, R=3, E=4",
                options: ["2134", "2314", "1234", "4321", "3214"],
                correctAnswer: "2134",
                explanation: "From CARE=1234: C=1, A=2, R=3, E=4. ACRE = A(2) C(1) R(3) E(4) = **2134**. ✓",
                steps: [
                  "Match word to code: C=1, A=2, R=3, E=4 (from CARE=1234)",
                  "Check with RACE=3214: R(3) A(2) C(1) E(4) ✓ — confirmed!",
                  "Build the table: C→1, A→2, R→3, E→4",
                  "Decode ACRE: A(2) C(1) R(3) E(4) = 2134"
                ]
              },
              {
                name: "Charlie",
                scenario: "working through number code puzzles",
                word1: "MADE",
                code1: "1234",
                word2: "DAME",
                code2: "3214",
                targetWord: "MEAD",
                targetCode: "1423",
                mapping: "M=1, A=2, D=3, E=4",
                options: ["1423", "1234", "1324", "4231", "2143"],
                correctAnswer: "1423",
                explanation: "From MADE=1234: M=1, A=2, D=3, E=4. MEAD = M(1) E(4) A(2) D(3) = **1423**. ✓",
                steps: [
                  "Match word to code: M=1, A=2, D=3, E=4 (from MADE=1234)",
                  "Check with DAME=3214: D(3) A(2) M(1) E(4) ✓ — confirmed!",
                  "Build the table: M→1, A→2, D→3, E→4",
                  "Decode MEAD: M(1) E(4) A(2) D(3) = 1423"
                ]
              },
              {
                name: "Daisy",
                scenario: "cracking codes with her friend",
                word1: "STEP",
                code1: "1234",
                word2: "PEST",
                code2: "4312",
                targetWord: "PETS",
                targetCode: "4321",
                mapping: "S=1, T=2, E=3, P=4",
                options: ["4321", "3241", "4231", "4312", "2341"],
                correctAnswer: "4321",
                explanation: "From STEP=1234: S=1, T=2, E=3, P=4. PETS = P(4) E(3) T(2) S(1) = **4321**. ✓",
                steps: [
                  "Match word to code: S=1, T=2, E=3, P=4 (from STEP=1234)",
                  "Check with PEST=4312: P(4) E(3) S(1) T(2) = 4312 ✓ — confirmed!",
                  "Build the table: S→1, T→2, E→3, P→4",
                  "Decode PETS: P(4) E(3) T(2) S(1) = 4321"
                ]
              },
              {
                name: "Ella",
                scenario: "solving number codes on her tablet",
                word1: "PART",
                code1: "1234",
                word2: "TRAP",
                code2: "4321",
                targetWord: "RAPT",
                targetCode: "3214",
                mapping: "P=1, A=2, R=3, T=4",
                options: ["3214", "3241", "2314", "4321", "1234"],
                correctAnswer: "3214",
                explanation: "From PART=1234: P=1, A=2, R=3, T=4. RAPT = R(3) A(2) P(1) T(4) = **3214**. ✓",
                steps: [
                  "Match word to code: P=1, A=2, R=3, T=4 (from PART=1234)",
                  "Check with TRAP=4321: T(4) R(3) A(2) P(1) ✓ — confirmed!",
                  "Build the table: P→1, A→2, R→3, T→4",
                  "Decode RAPT: R(3) A(2) P(1) T(4) = 3214"
                ]
              },
              {
                name: "Finn",
                scenario: "doing code puzzles at breaktime",
                word1: "SALT",
                code1: "1234",
                word2: "LAST",
                code2: "3214",
                targetWord: "SLAT",
                targetCode: "1324",
                mapping: "S=1, A=2, L=3, T=4",
                options: ["1324", "3241", "1234", "4321", "2413"],
                correctAnswer: "1324",
                explanation: "From SALT=1234: S=1, A=2, L=3, T=4. SLAT = S(1) L(3) A(2) T(4) = **1324**. ✓",
                steps: [
                  "Match word to code: S=1, A=2, L=3, T=4 (from SALT=1234)",
                  "Check with LAST=3214: L(3) A(2) S(1) T(4) = 3214 ✓ — confirmed!",
                  "Build the table: S→1, A→2, L→3, T→4",
                  "Decode SLAT: S(1) L(3) A(2) T(4) = 1324"
                ]
              },
              {
                name: "Grace",
                scenario: "tackling harder number-word codes",
                word1: "LEMON",
                code1: "12345",
                word2: "MELON",
                code2: "32145",
                targetWord: "MONEL",
                targetCode: "34521",
                mapping: "L=1, E=2, M=3, O=4, N=5",
                options: ["34521", "35421", "34512", "43521", "53421"],
                correctAnswer: "34521",
                explanation: "From LEMON=12345: L=1, E=2, M=3, O=4, N=5. MONEL = M(3) O(4) N(5) E(2) L(1) = **34521**. ✓",
                steps: [
                  "Match word to code: L=1, E=2, M=3, O=4, N=5 (from LEMON=12345)",
                  "Check with MELON=32145: M(3) E(2) L(1) O(4) N(5) = 32145 ✓",
                  "Build the table: L→1, E→2, M→3, O→4, N→5",
                  "Decode MONEL: M(3) O(4) N(5) E(2) L(1) = 34521"
                ],
                difficulty: 2
              },
              {
                name: "Hugo",
                scenario: "working on 5-letter code puzzles",
                word1: "HEART",
                code1: "12345",
                word2: "EARTH",
                code2: "23451",
                targetWord: "HATER",
                targetCode: "13524",
                mapping: "H=1, E=2, A=3, R=4, T=5",
                options: ["13524", "14253", "12345", "53241", "23451"],
                correctAnswer: "13524",
                explanation: "From HEART=12345: H=1, E=2, A=3, R=4, T=5. HATER = H(1) A(3) T(5) E(2) R(4) = **13524**. ✓",
                steps: [
                  "Match word to code: H=1, E=2, A=3, R=4, T=5 (from HEART=12345)",
                  "Check with EARTH=23451: E(2) A(3) R(4) T(5) H(1) = 23451 ✓ — confirmed!",
                  "Build the table: H→1, E→2, A→3, R→4, T→5",
                  "Decode HATER: H(1) A(3) T(5) E(2) R(4) = 13524"
                ],
                difficulty: 2
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "Can you crack the number code?",
                body: (v) => `${v.name} is ${v.scenario}.\n\nEach **letter** maps to a **number**. You'll see two word-code pairs, then need to decode a new word.\n\n**${v.word1} = ${v.code1}**\n**${v.word2} = ${v.code2}**\n\nCan you figure out the mapping?`,
                visual: {
                  component: "CodeTable",
                  props: (v) => ({
                    headers: ["Word", "Code"],
                    rows: [
                      { cells: [v.word1, v.code1] },
                      { cells: [v.word2, v.code2] },
                      { cells: [v.targetWord, "???"], highlight: true }
                    ]
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "The Table Method — 4 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `Each letter has a fixed number. Build a **mapping table** to crack the code:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Match word lengths to codes", why: "Line up each letter with its number" },
                        { text: "2. Find repeated letters", why: "If the same letter appears twice, it should have the SAME number both times" },
                        { text: "3. Build the mapping table", why: "Write: A=1, B=2, etc. — one number per letter" },
                        { text: "4. Decode the target word", why: "Replace each letter with its number using your table" }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: () => `**Top tip:** Look for repeated letters — they help you confirm your mapping is correct!`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Cracking: ${v.word1} = ${v.code1}`,
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Watch the method decode **${v.targetWord}**:`
                  },
                  {
                    type: 'visual',
                    component: 'CodeTable',
                    props: (v) => ({
                      headers: ["Letter", "Number"],
                      rows: v.mapping.split(', ').map(m => {
                        const [letter, num] = m.split('=');
                        return { cells: [letter.trim(), num.trim()] };
                      }),
                      compact: true
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: `Step ${i + 1}: ${step}`,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Mapping: ${v.mapping}`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — decode the word!",
                body: (v) => `Use the Table Method: **Match → Repeats → Table → Decode**\n\n**${v.word1} = ${v.code1}**\n**${v.word2} = ${v.code2}**\n\nWhat is **${v.targetWord}**?`,
                visual: {
                  component: "CodeTable",
                  props: (v) => ({
                    headers: ["Word", "Code"],
                    rows: [
                      { cells: [v.word1, v.code1] },
                      { cells: [v.word2, v.code2] },
                      { cells: [v.targetWord, "???"], highlight: true }
                    ]
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What is the code for ${v.targetWord}?`,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.explanation}`,
                    incorrect: (v) => `Not quite! The answer is **${v.correctAnswer}**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "The Table Method — your recipe!",
                body: () => `Every time you see a number-word code, follow these 4 steps:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Match word lengths to codes", why: "Line up each letter position with its number" },
                      { text: "2. Find repeated letters", why: "Same letter = same number (use this to check!)" },
                      { text: "3. Build the mapping table", why: "Write out every letter → number pair" },
                      { text: "4. Decode the target word", why: "Replace each letter using your table ✓" }
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
    ,
      ...numberWordCodesSubConcepts
    ]
  },

  // ---- VR TOPIC 14: Number Series ----
  numberSeries: {
    name: "Number Series",
    subConcepts: [
      {
        id: "master-write-the-hops",
        name: "Write the Hops",
        category: "master",
        lessons: [
          {
            id: "master-write-the-hops-full",
            templateType: "master-method",
            learningGoal: [
              "How number series work — each number follows a pattern",
              "A 4-step method: space out, calculate hops, find the pattern, apply",
              "Common patterns: constant difference, increasing hops, multiply, square numbers"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "working through number series in her VR practice",
                series: "3, 6, 9, 12, 15",
                nextNumber: "18",
                hops: "+3, +3, +3, +3",
                patternType: "constant difference (+3)",
                patternExplanation: "Each number goes up by 3 every time",
                options: ["18", "17", "16", "19", "20"],
                correctAnswer: "18",
                explanation: "The pattern is +3 each time: 3, 6, 9, 12, 15, **18**. ✓",
                steps: [
                  "Write numbers spaced out: 3, 6, 9, 12, 15",
                  "Calculate hops: 6−3=3, 9−6=3, 12−9=3, 15−12=3",
                  "Pattern: every hop is +3 (constant difference)",
                  "Apply: 15 + 3 = 18"
                ]
              },
              {
                name: "Ben",
                scenario: "solving number puzzles at his desk",
                series: "2, 5, 8, 11, 14",
                nextNumber: "17",
                hops: "+3, +3, +3, +3",
                patternType: "constant difference (+3)",
                patternExplanation: "Each number goes up by 3 every time",
                options: ["17", "15", "16", "18", "19"],
                correctAnswer: "17",
                explanation: "The pattern is +3 each time: 2, 5, 8, 11, 14, **17**. ✓",
                steps: [
                  "Write numbers spaced out: 2, 5, 8, 11, 14",
                  "Calculate hops: 5−2=3, 8−5=3, 11−8=3, 14−11=3",
                  "Pattern: every hop is +3 (constant difference)",
                  "Apply: 14 + 3 = 17"
                ]
              },
              {
                name: "Charlie",
                scenario: "racing through a timed VR test",
                series: "1, 4, 9, 16, 25",
                nextNumber: "36",
                hops: "+3, +5, +7, +9",
                patternType: "square numbers (1², 2², 3², 4², 5²)",
                patternExplanation: "These are square numbers: 1×1, 2×2, 3×3, 4×4, 5×5",
                options: ["36", "30", "34", "35", "49"],
                correctAnswer: "36",
                explanation: "Square numbers: 1, 4, 9, 16, 25, **36** (that's 6×6). The hops increase by 2 each time: +3, +5, +7, +9, +11. ✓",
                steps: [
                  "Write numbers spaced out: 1, 4, 9, 16, 25",
                  "Calculate hops: 4−1=3, 9−4=5, 16−9=7, 25−16=9",
                  "Pattern in the hops: 3, 5, 7, 9 — increasing by 2 each time! (These are square numbers)",
                  "Apply: next hop is 11, so 25 + 11 = 36"
                ]
              },
              {
                name: "Daisy",
                scenario: "practising number series at her desk",
                series: "2, 4, 8, 16, 32",
                nextNumber: "64",
                hops: "×2, ×2, ×2, ×2",
                patternType: "multiply by 2 (doubling)",
                patternExplanation: "Each number is doubled (multiplied by 2)",
                options: ["64", "48", "40", "56", "128"],
                correctAnswer: "64",
                explanation: "Each number doubles: 2, 4, 8, 16, 32, **64**. ✓",
                steps: [
                  "Write numbers spaced out: 2, 4, 8, 16, 32",
                  "Calculate hops: 4÷2=2, 8÷4=2, 16÷8=2, 32÷16=2",
                  "Pattern: each number is ×2 (doubling)",
                  "Apply: 32 × 2 = 64"
                ]
              },
              {
                name: "Ella",
                scenario: "doing number series on her tablet",
                series: "20, 17, 14, 11, 8",
                nextNumber: "5",
                hops: "-3, -3, -3, -3",
                patternType: "constant difference (-3)",
                patternExplanation: "Each number goes DOWN by 3 every time",
                options: ["5", "6", "4", "7", "3"],
                correctAnswer: "5",
                explanation: "The pattern is -3 each time: 20, 17, 14, 11, 8, **5**. ✓",
                steps: [
                  "Write numbers spaced out: 20, 17, 14, 11, 8",
                  "Calculate hops: 17−20=−3, 14−17=−3, 11−14=−3, 8−11=−3",
                  "Pattern: every hop is −3 (going down)",
                  "Apply: 8 − 3 = 5"
                ]
              },
              {
                name: "Finn",
                scenario: "solving series at breaktime",
                series: "5, 10, 15, 20, 25",
                nextNumber: "30",
                hops: "+5, +5, +5, +5",
                patternType: "constant difference (+5)",
                patternExplanation: "Each number goes up by 5 every time (times table!)",
                options: ["30", "28", "35", "26", "32"],
                correctAnswer: "30",
                explanation: "The pattern is +5 each time (the 5 times table!): 5, 10, 15, 20, 25, **30**. ✓",
                steps: [
                  "Write numbers spaced out: 5, 10, 15, 20, 25",
                  "Calculate hops: 10−5=5, 15−10=5, 20−15=5, 25−20=5",
                  "Pattern: every hop is +5 (it's the 5 times table!)",
                  "Apply: 25 + 5 = 30"
                ]
              },
              {
                name: "Grace",
                scenario: "tackling harder number series",
                series: "1, 3, 6, 10, 15",
                nextNumber: "21",
                hops: "+2, +3, +4, +5",
                patternType: "increasing hops (+2, +3, +4, +5, +6)",
                patternExplanation: "The hops increase by 1 each time (triangle numbers)",
                options: ["21", "20", "18", "22", "25"],
                correctAnswer: "21",
                explanation: "The hops increase: +2, +3, +4, +5, so next is +6. 15 + 6 = **21**. These are triangle numbers! ✓",
                steps: [
                  "Write numbers spaced out: 1, 3, 6, 10, 15",
                  "Calculate hops: 3−1=2, 6−3=3, 10−6=4, 15−10=5",
                  "Pattern in the hops: 2, 3, 4, 5 — increasing by 1 each time!",
                  "Apply: next hop is 6, so 15 + 6 = 21"
                ],
                difficulty: 2
              },
              {
                name: "Hugo",
                scenario: "working on the toughest number series",
                series: "2, 6, 12, 20, 30",
                nextNumber: "42",
                hops: "+4, +6, +8, +10",
                patternType: "increasing hops (+4, +6, +8, +10, +12)",
                patternExplanation: "The hops increase by 2 each time",
                options: ["42", "40", "38", "44", "36"],
                correctAnswer: "42",
                explanation: "The hops increase by 2: +4, +6, +8, +10, so next is +12. 30 + 12 = **42**. ✓",
                steps: [
                  "Write numbers spaced out: 2, 6, 12, 20, 30",
                  "Calculate hops: 6−2=4, 12−6=6, 20−12=8, 30−20=10",
                  "Pattern in the hops: 4, 6, 8, 10 — increasing by 2 each time!",
                  "Apply: next hop is 12, so 30 + 12 = 42"
                ],
                difficulty: 2
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "What comes next?",
                body: (v) => `${v.name} is ${v.scenario}.\n\nNumber series follow a **pattern** — your job is to find the pattern and predict the next number.\n\n**${v.series}, ___**\n\nCan you see the pattern?`,
                visual: {
                  component: "SequenceChain",
                  props: (v) => ({
                    terms: v.series.split(', '),
                    showDifferences: false,
                    nextValue: "?",
                    showNext: true
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Write the Hops — 4 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `The **hops** (differences between numbers) reveal the pattern. Here's the method:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Write numbers spaced out", why: "Leave room to write the hops BETWEEN each number" },
                        { text: "2. Calculate the hops", why: "Subtract each number from the next: what's the difference?" },
                        { text: "3. Find the pattern in the hops", why: "Are they the same? Increasing? Doubling?" },
                        { text: "4. Apply the pattern", why: "Use the pattern to calculate the next hop, then add it" }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: () => `**Common patterns:** Same hop every time (+3, +3, +3), increasing hops (+2, +3, +4), or doubling (×2)`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Solving: ${v.series}`,
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Watch the 4 steps find the next number:`
                  },
                  {
                    type: 'visual',
                    component: 'SequenceChain',
                    props: (v) => ({
                      terms: v.series.split(', '),
                      differences: v.hops.split(', '),
                      showDifferences: true,
                      nextValue: v.nextNumber,
                      showNext: true,
                      highlightTerms: [v.series.split(', ').length]
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: `Step ${i + 1}: ${step}`,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `Pattern: **${v.patternType}** — ${v.patternExplanation}.`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — what's the next number?",
                body: (v) => `Write the Hops: **Space → Hops → Pattern → Apply**\n\n**${v.series}, ___**`,
                visual: {
                  component: "SequenceChain",
                  props: (v) => ({
                    terms: v.series.split(', '),
                    differences: v.hops.split(', '),
                    showDifferences: true,
                    nextValue: "?",
                    showNext: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What comes next: ${v.series}, ___?`,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.explanation}`,
                    incorrect: (v) => `Not quite! The answer is **${v.correctAnswer}**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Write the Hops — your recipe!",
                body: () => `Every time you see a number series, follow these 4 steps:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Write numbers spaced out", why: "Leave room for the hops between them" },
                      { text: "2. Calculate the hops", why: "Subtract each pair — write the differences" },
                      { text: "3. Find the pattern in the hops", why: "Same? Increasing? Doubling? Look at the hops, not the numbers!" },
                      { text: "4. Apply the pattern", why: "Calculate the next hop and add it ✓" }
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
    ,
      ...numberSeriesSubConcepts
    ]
  },

  // ---- VR TOPIC 15: Letter Sums ----
  letterSums: {
    name: "Letter Sums",
    subConcepts: [
      {
        id: "master-swap-and-calculate",
        name: "Swap and Calculate",
        category: "master",
        lessons: [
          {
            id: "master-swap-and-calculate-full",
            templateType: "master-method",
            learningGoal: [
              "How letter sums work — A=1, B=2, C=3 through to Z=26",
              "The EJOTY trick for quick positioning (E=5, J=10, O=15, T=20, Y=25)",
              "Use BODMAS for mixed operations (× ÷ before + −), left to right for same-level operations"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "solving letter sums in her VR practice",
                expression: "C + A",
                letterValues: "C=3, A=1",
                calculation: "3 + 1 = 4",
                answer: "4",
                answerType: "number",
                options: ["4", "3", "5", "2", "6"],
                correctAnswer: "4",
                explanation: "C=3, A=1. Working left to right: 3 + 1 = **4**. ✓",
                steps: [
                  "Write number above each letter: C=3, A=1",
                  "Work LEFT to RIGHT: 3 + 1",
                  "Calculate: 3 + 1 = 4",
                  "Answer is a number: 4"
                ]
              },
              {
                name: "Ben",
                scenario: "doing letter sums at his desk",
                expression: "E + B",
                letterValues: "E=5, B=2",
                calculation: "5 + 2 = 7",
                answer: "7",
                answerType: "number",
                options: ["7", "5", "8", "6", "9"],
                correctAnswer: "7",
                explanation: "E=5 (EJOTY!), B=2. Working left to right: 5 + 2 = **7**. ✓",
                steps: [
                  "Write number above each letter: E=5 (from EJOTY), B=2",
                  "Work LEFT to RIGHT: 5 + 2",
                  "Calculate: 5 + 2 = 7",
                  "Answer is a number: 7"
                ]
              },
              {
                name: "Charlie",
                scenario: "working through letter sums quickly",
                expression: "J - C",
                letterValues: "J=10, C=3",
                calculation: "10 - 3 = 7",
                answer: "7",
                answerType: "number",
                options: ["7", "13", "8", "6", "10"],
                correctAnswer: "7",
                explanation: "J=10 (EJOTY!), C=3. Working left to right: 10 - 3 = **7**. ✓",
                steps: [
                  "Write number above each letter: J=10 (from EJOTY), C=3",
                  "Work LEFT to RIGHT: 10 - 3",
                  "Calculate: 10 - 3 = 7",
                  "Answer is a number: 7"
                ]
              },
              {
                name: "Daisy",
                scenario: "practising letter sums with mixed operations",
                expression: "D + E - C",
                letterValues: "D=4, E=5, C=3",
                calculation: "4 + 5 - 3 = 6",
                answer: "6",
                answerType: "number",
                options: ["6", "7", "5", "8", "4"],
                correctAnswer: "6",
                explanation: "D=4, E=5, C=3. LEFT to RIGHT: 4 + 5 = 9, then 9 - 3 = **6**. ✓",
                steps: [
                  "Write number above each letter: D=4, E=5, C=3",
                  "Work LEFT to RIGHT: 4 + 5 = 9",
                  "Continue left to right: 9 - 3 = 6",
                  "Answer is a number: 6"
                ]
              },
              {
                name: "Ella",
                scenario: "doing letter sums on her tablet",
                expression: "G - A + B",
                letterValues: "G=7, A=1, B=2",
                calculation: "7 - 1 + 2 = 8",
                answer: "8",
                answerType: "number",
                options: ["8", "4", "6", "10", "7"],
                correctAnswer: "8",
                explanation: "G=7, A=1, B=2. LEFT to RIGHT: 7 - 1 = 6, then 6 + 2 = **8**. ✓",
                steps: [
                  "Write number above each letter: G=7, A=1, B=2",
                  "Work LEFT to RIGHT: 7 - 1 = 6",
                  "Continue left to right: 6 + 2 = 8",
                  "Answer is a number: 8"
                ]
              },
              {
                name: "Finn",
                scenario: "solving letter sums at breaktime",
                expression: "F + D",
                letterValues: "F=6, D=4",
                calculation: "6 + 4 = 10 → J",
                answer: "J",
                answerType: "letter",
                options: ["J", "K", "I", "H", "L"],
                correctAnswer: "J",
                explanation: "F=6, D=4. Working left to right: 6 + 4 = 10. Convert back to a letter: 10 = **J** (from EJOTY!). ✓",
                steps: [
                  "Write number above each letter: F=6, D=4",
                  "Work LEFT to RIGHT: 6 + 4 = 10",
                  "Convert back to a letter: 10 = J (EJOTY: J=10)",
                  "Answer is a letter: J"
                ]
              },
              {
                name: "Grace",
                scenario: "tackling harder letter sums",
                expression: "T - E + A",
                letterValues: "T=20, E=5, A=1",
                calculation: "20 - 5 + 1 = 16 → P",
                answer: "P",
                answerType: "letter",
                options: ["P", "O", "Q", "N", "R"],
                correctAnswer: "P",
                explanation: "T=20, E=5, A=1. LEFT to RIGHT: 20 - 5 = 15, then 15 + 1 = 16. Convert: 16 = **P** (O=15, so P=16). ✓",
                steps: [
                  "Write number above each letter: T=20 (EJOTY), E=5 (EJOTY), A=1",
                  "Work LEFT to RIGHT: 20 - 5 = 15",
                  "Continue: 15 + 1 = 16",
                  "Convert back to a letter: O=15, so 16 = P"
                ],
                difficulty: 2
              },
              {
                name: "Hugo",
                scenario: "working on the toughest letter sums",
                expression: "O + E - T",
                letterValues: "O=15, E=5, T=20",
                calculation: "15 + 5 - 20 = 0",
                answer: "0",
                answerType: "number",
                options: ["0", "10", "5", "20", "15"],
                correctAnswer: "0",
                explanation: "O=15, E=5, T=20. LEFT to RIGHT: 15 + 5 = 20, then 20 - 20 = **0**. ✓",
                steps: [
                  "Write number above each letter: O=15, E=5, T=20 (all EJOTY!)",
                  "Work LEFT to RIGHT: 15 + 5 = 20",
                  "Continue: 20 - 20 = 0",
                  "Answer is a number: 0"
                ],
                difficulty: 2
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "Can you solve the letter sum?",
                body: (v) => `${v.name} is ${v.scenario}.\n\nIn letter sums, each letter has a number: **A=1, B=2, C=3...** all the way to **Z=26**.\n\nYou replace the letters with numbers, then calculate.\n\n**${v.expression} = ???**`,
                visual: {
                  component: "AlphabetLine",
                  props: (v) => ({
                    showEJOTY: true,
                    showPositionNumbers: true,
                    points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#6C5CE7" }))
                  })
                },
                interaction: null
              },
              {
                type: "teach",
                title: () => "Swap and Calculate — 4 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `Use **EJOTY** to quickly find letter positions:\n\n**E**=5, **J**=10, **O**=15, **T**=20, **Y**=25\n\nCount forward or back from the nearest EJOTY letter!`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: () => ({
                      steps: [
                        { text: "1. Write number above each letter", why: "Use EJOTY as anchor points (E=5, J=10, O=15, T=20, Y=25)" },
                        { text: "2. Follow BODMAS for mixed operations", why: "If you see × or ÷ mixed with + or −, do **multiplication and division first**. For addition and subtraction only, just work left to right" },
                        { text: "3. Calculate step by step", why: "Do one operation at a time, moving right" },
                        { text: "4. Convert back if needed", why: "If the answer should be a letter, convert the number using EJOTY" }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: () => `**IMPORTANT:** In letter sums with only + and −, just work **left to right**. But if you see **× or ÷** mixed with + or −, use **BODMAS** — do the multiplication and division first! This catches lots of people out!`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: (v) => `Solving: ${v.expression}`,
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: (v) => `Watch the 4 steps solve **${v.expression}**:`
                  },
                  {
                    type: 'visual',
                    component: 'AlphabetLine',
                    props: (v) => ({
                      showEJOTY: true,
                      showPositionNumbers: true,
                      points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#6C5CE7" }))
                    })
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: v.steps.map((step, i) => ({
                        text: `Step ${i + 1}: ${step}`,
                        why: i === v.steps.length - 1 ? "✓" : ""
                      })),
                      allRevealed: false
                    })
                  },
                  {
                    type: 'text',
                    content: (v) => `**${v.expression} = ${v.answer}**`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — solve the letter sum!",
                body: (v) => `Use Swap and Calculate: **Numbers → Left to Right → Step by step**\n\nRemember: **EJOTY** → E=5, J=10, O=15, T=20, Y=25\n\n**${v.expression} = ???**`,
                visual: {
                  component: "AlphabetLine",
                  props: () => ({
                    showEJOTY: true,
                    showPositionNumbers: true
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => `What is ${v.expression}?`,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.explanation}`,
                    incorrect: (v) => `Not quite! The answer is **${v.correctAnswer}**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Swap and Calculate — your recipe!",
                body: () => `Every time you see a letter sum, follow these 4 steps:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Write number above each letter", why: "EJOTY = E(5) J(10) O(15) T(20) Y(25) — count from nearest" },
                      { text: "2. Check the operations", why: "Only + and −? Work left to right. See × or ÷? Use BODMAS — multiply/divide first!" },
                      { text: "3. Calculate step by step", why: "One operation at a time" },
                      { text: "4. Convert back if needed", why: "Number → letter? Use EJOTY to find it ✓" }
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
    ,
      ...letterSumsSubConcepts
    ]
  },

  // ---- VR TOPIC 16: Logic and Language ----
  logicAndLanguage: {
    name: "Logic & Language",
    subConcepts: [
      {
        id: "master-think-it-through",
        name: "Think It Through",
        category: "master",
        lessons: [
          {
            id: "master-think-it-through-full",
            templateType: "master-method",
            learningGoal: [
              "How logic questions work — use clues to work out an order or fact",
              "A 3-step method: read ALL clues, draw a diagram, answer from the diagram",
              "Common types: ordering (taller/shorter), true/false, sentence logic"
            ],
            variableSets: [
              {
                name: "Aisha",
                scenario: "solving logic puzzles in her VR practice",
                clues: ["Amy is taller than Beth.", "Beth is taller than Claire."],
                question: "Who is the shortest?",
                answer: "Claire",
                diagramDescription: "Amy > Beth > Claire (tallest to shortest)",
                options: ["Claire", "Amy", "Beth", "They're the same", "Can't tell"],
                correctAnswer: "Claire",
                explanation: "Amy > Beth > Claire. Claire is at the bottom, so she is the **shortest**. ✓",
                steps: [
                  "Read ALL clues: Amy > Beth, Beth > Claire",
                  "Draw the order: Amy (tallest) → Beth → Claire (shortest)",
                  "Answer from diagram: shortest = Claire"
                ]
              },
              {
                name: "Ben",
                scenario: "working through logic questions",
                clues: ["Dan is older than Emma.", "Finn is older than Dan."],
                question: "Who is the oldest?",
                answer: "Finn",
                diagramDescription: "Finn > Dan > Emma (oldest to youngest)",
                options: ["Finn", "Dan", "Emma", "Dan and Finn", "Can't tell"],
                correctAnswer: "Finn",
                explanation: "Finn > Dan > Emma. Finn is at the top, so he is the **oldest**. ✓",
                steps: [
                  "Read ALL clues: Dan > Emma, Finn > Dan",
                  "Draw the order: Finn (oldest) → Dan → Emma (youngest)",
                  "Answer from diagram: oldest = Finn"
                ]
              },
              {
                name: "Charlie",
                scenario: "racing through logic questions in a test",
                clues: ["The red car is faster than the blue car.", "The green car is slower than the blue car."],
                question: "Which car is the slowest?",
                answer: "The green car",
                diagramDescription: "Red (fastest) → Blue → Green (slowest)",
                options: ["The green car", "The red car", "The blue car", "All the same", "Can't tell"],
                correctAnswer: "The green car",
                explanation: "Red > Blue > Green in speed. The green car is the **slowest**. ✓",
                steps: [
                  "Read ALL clues: Red > Blue, Blue > Green",
                  "Draw the order: Red (fastest) → Blue → Green (slowest)",
                  "Answer from diagram: slowest = Green car"
                ]
              },
              {
                name: "Daisy",
                scenario: "doing logic puzzles at her desk",
                clues: ["All cats have tails.", "Whiskers is a cat."],
                question: "Does Whiskers have a tail?",
                answer: "Yes",
                diagramDescription: "All cats → tails. Whiskers = cat → Whiskers has a tail",
                options: ["Yes", "No", "Maybe", "Only sometimes", "Can't tell"],
                correctAnswer: "Yes",
                explanation: "ALL cats have tails. Whiskers IS a cat. So Whiskers definitely has a tail. ✓",
                steps: [
                  "Read ALL clues: All cats have tails. Whiskers is a cat.",
                  "Draw the logic: cats → tails, Whiskers → cat",
                  "Answer: Whiskers is a cat, so Whiskers has a tail = Yes"
                ]
              },
              {
                name: "Ella",
                scenario: "working on ordering questions",
                clues: ["Mia got more marks than Noah.", "Noah got more marks than Olivia.", "Olivia got more marks than Peter."],
                question: "Who got the fewest marks?",
                answer: "Peter",
                diagramDescription: "Mia > Noah > Olivia > Peter",
                options: ["Peter", "Olivia", "Noah", "Mia", "Can't tell"],
                correctAnswer: "Peter",
                explanation: "Mia > Noah > Olivia > Peter. Peter is at the bottom with the **fewest marks**. ✓",
                steps: [
                  "Read ALL clues: Mia > Noah, Noah > Olivia, Olivia > Peter",
                  "Draw the order: Mia → Noah → Olivia → Peter",
                  "Answer from diagram: fewest marks = Peter"
                ]
              },
              {
                name: "Finn",
                scenario: "solving logic problems at breaktime",
                clues: ["Tuesday comes before Wednesday.", "Monday comes before Tuesday."],
                question: "Which day comes first?",
                answer: "Monday",
                diagramDescription: "Monday → Tuesday → Wednesday",
                options: ["Monday", "Tuesday", "Wednesday", "They're the same", "Can't tell"],
                correctAnswer: "Monday",
                explanation: "Monday → Tuesday → Wednesday. Monday comes **first**. ✓",
                steps: [
                  "Read ALL clues: Tuesday before Wednesday, Monday before Tuesday",
                  "Draw the order: Monday → Tuesday → Wednesday",
                  "Answer from diagram: first = Monday"
                ]
              },
              {
                name: "Grace",
                scenario: "tackling harder logic questions",
                clues: ["Some birds can fly.", "Penguins are birds.", "Penguins cannot fly."],
                question: "Can all birds fly?",
                answer: "No",
                diagramDescription: "Some birds → fly. Penguins = birds but ≠ fly",
                options: ["No", "Yes", "Maybe", "Only in summer", "Can't tell"],
                correctAnswer: "No",
                explanation: "The clue says SOME birds can fly, and penguins are birds that CANNOT fly. So no, not all birds can fly. ✓",
                steps: [
                  "Read ALL clues: SOME birds fly. Penguins = birds. Penguins ≠ fly.",
                  "Draw the logic: 'some' means NOT ALL — and penguins prove it",
                  "Answer: Can ALL birds fly? No — penguins can't"
                ],
                difficulty: 2
              },
              {
                name: "Hugo",
                scenario: "attempting the trickiest logic problems",
                clues: ["If it is raining, the ground is wet.", "The ground is wet."],
                question: "Is it definitely raining?",
                answer: "Not necessarily",
                diagramDescription: "Rain → wet ground. But wet ground could have other causes",
                options: ["Not necessarily", "Yes, definitely", "No, definitely not", "Only if it's cold", "Can't tell"],
                correctAnswer: "Not necessarily",
                explanation: "Rain makes the ground wet, but other things can too (sprinklers, spills). We can't be sure it's raining just because the ground is wet. ✓",
                steps: [
                  "Read ALL clues: Rain → wet ground. Ground IS wet.",
                  "Draw the logic: Rain causes wet ground, but other things might too",
                  "Answer: Is it DEFINITELY raining? Not necessarily — the ground could be wet for another reason"
                ],
                difficulty: 2
              }
            ],
            screens: [
              {
                type: "hook",
                title: () => "Can you work out the answer?",
                body: (v) => `${v.name} is ${v.scenario}.\n\nLogic questions give you **clues** and ask you to work out a fact. The answer is ALWAYS hidden in the clues — you just need to put them in order.\n\n${v.clues.map(c => `• ${c}`).join('\n')}\n\n**${v.question}**`,
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `${v.name} is ${v.scenario}.\n\nLogic questions give you **clues** and ask you to work out a fact. The answer is ALWAYS hidden in the clues — you just need to put them in order.\n\n${v.clues.map(c => `• ${c}`).join('\n')}\n\n**${v.question}**`
                  },
                  {
                    type: 'visual',
                    component: 'LogicDiagram',
                    props: () => ({
                      items: v.diagramDescription.includes('>') ? v.diagramDescription.split('>').map(s => s.trim().split('(')[0].trim()) : [v.answer],
                      topLabel: v.diagramDescription.includes('tallest') ? 'Tallest' : v.diagramDescription.includes('oldest') ? 'Oldest' : v.diagramDescription.includes('fastest') ? 'Fastest' : v.diagramDescription.includes('most') ? 'Most' : '',
                      bottomLabel: v.diagramDescription.includes('shortest') ? 'Shortest' : v.diagramDescription.includes('youngest') ? 'Youngest' : v.diagramDescription.includes('slowest') ? 'Slowest' : v.diagramDescription.includes('fewest') ? 'Fewest' : '',
                      highlight: v.answer,
                      clues: v.clues
                    })
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "teach",
                title: () => "Think It Through — 3 steps",
                bodyParts: (v) => [
                  {
                    type: 'text',
                    content: () => `Logic questions test whether you can follow clues carefully. Here's the method — let's apply it to the clues from the previous screen:`
                  },
                  {
                    type: 'visual',
                    component: 'WorkedExample',
                    props: (v) => ({
                      steps: [
                        { text: `1. Read ALL clues first`, why: v.clues.join(' ') },
                        { text: "2. Draw the order or diagram", why: "For ordering: draw a line from top to bottom. For logic: draw arrows" },
                        { text: "3. Answer from your diagram", why: `${v.question} → **${v.answer}**` }
                      ],
                      allRevealed: false
                    })
                  },
                  {
                    type: 'visual',
                    component: 'LogicDiagram',
                    props: (v) => ({
                      items: v.diagramDescription.includes('>') ? v.diagramDescription.split('>').map(s => s.trim().split('(')[0].trim()) : [v.answer],
                      topLabel: v.diagramDescription.includes('tallest') ? 'Tallest' : v.diagramDescription.includes('oldest') ? 'Oldest' : v.diagramDescription.includes('fastest') ? 'Fastest' : v.diagramDescription.includes('most') ? 'Most' : '',
                      bottomLabel: v.diagramDescription.includes('shortest') ? 'Shortest' : v.diagramDescription.includes('youngest') ? 'Youngest' : v.diagramDescription.includes('slowest') ? 'Slowest' : v.diagramDescription.includes('fewest') ? 'Fewest' : '',
                      highlight: v.answer,
                      clues: v.clues
                    })
                  },
                  {
                    type: 'text',
                    content: () => `**Watch out for trick words:** "some", "all", "none", "definitely", "might" — these change the meaning completely!`
                  }
                ],
                visual: null,
                interaction: null
              },
              {
                type: "interact",
                title: () => "Your turn — think it through!",
                body: (v) => `Use the 3 steps: **Read all clues → Draw it → Answer from diagram**\n\n${v.clues.map(c => `• ${c}`).join('\n')}`,
                visual: {
                  component: "SentenceDisplay",
                  props: (v) => ({
                    mode: "evidence",
                    passage: v.clues.join(' '),
                    evidenceSentence: "",
                    label: "The clues:"
                  })
                },
                interaction: {
                  type: "multiple-choice",
                  question: (v) => v.question,
                  getOptions: (v) => v.options,
                  correctAnswer: (v) => v.correctAnswer,
                  feedback: {
                    correct: (v) => `Brilliant! ${v.explanation}`,
                    incorrect: (v) => `Not quite! The answer is **${v.correctAnswer}**. ${v.explanation}`
                  }
                }
              },
              {
                type: "consolidate",
                title: () => "Think It Through — your recipe!",
                body: () => `Every time you see a logic question, follow these 3 steps:`,
                visual: {
                  component: "WorkedExample",
                  props: () => ({
                    steps: [
                      { text: "1. Read ALL clues first", why: "Every clue matters — don't skip any!" },
                      { text: "2. Draw the order or diagram", why: "Put things in order on a line, or draw arrows for logic" },
                      { text: "3. Answer from your diagram", why: "The diagram shows the answer — trust it! ✓" }
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
    ,
      ...logicAndLanguageSubConcepts
    ]
  },
};

// === MERGE STAGING SUB-CONCEPTS INTO LESSON BANK ===
// Appends staging sub-concepts to each topic's subConcepts array.
// Deduplicates by id — existing master methods are preserved.
const stagingMap = {
  algebra: algebraSubConcepts,
  anglesshapes: anglesshapesSubConcepts,
  areaperimeter: areaperimeterSubConcepts,
  datahandling: datahandlingSubConcepts,
  decimals: decimalsSubConcepts,
  fractions: fractionsSubConcepts,
  longdivision: longdivisionSubConcepts,
  negativenumbers: negativeNumbersSubConcepts,
  percentages: percentagesSubConcepts,
  placevalue: placevalueSubConcepts,
  primenumbersfactors: primenumbersfactorsSubConcepts,
  ratio: ratioSubConcepts,
  sequences: sequencesSubConcepts,
  speeddistancetime: speeddistancetimeSubConcepts,
  volume: volumeSubConcepts,
  spelling: spellingSubConcepts,
  punctuation: punctuationSubConcepts,
  grammar: grammarSubConcepts,
  vocabulary: vocabularySubConcepts,
  wordClassGrammar: wordClassSubConcepts,
  comprehension: comprehensionSubConcepts,
  synonyms: synonymsSubConcepts,
  antonyms: antonymsSubConcepts,
  oddTwoOut: oddTwoOutSubConcepts,
  verbalAnalogies: verbalAnalogiesSubConcepts,
  compoundWords: compoundWordsSubConcepts,
  hiddenWords: hiddenWordsSubConcepts,
  letterMove: letterMoveSubConcepts,
  missingLettersWords: missingLettersWordsSubConcepts,
  sharedLetter: sharedLetterSubConcepts,
  letterCodes: letterCodesSubConcepts,
  letterPairSeries: letterPairSeriesSubConcepts,
  wordCodeAnalogies: wordCodeAnalogiesSubConcepts,
  numberWordCodes: numberWordCodesSubConcepts,
  numberSeries: numberSeriesSubConcepts,
  letterSums: letterSumsSubConcepts,
  logicAndLanguage: logicAndLanguageSubConcepts,
};

for (const [key, stagingSCs] of Object.entries(stagingMap)) {
  if (lessonBank[key] && stagingSCs) {
    const existingIds = new Set(lessonBank[key].subConcepts.map(sc => sc.id));
    for (const sc of stagingSCs) {
      if (!existingIds.has(sc.id)) {
        lessonBank[key].subConcepts.push(sc);
        existingIds.add(sc.id);
      }
    }
  }
}

// === SPEED REVIEW SUB-CONCEPT BANK ===
// Kept for SpeedReviewPanel compatibility. References same staging imports.
export const testSubConceptBank = {
  // Maths (15 — longmultiplication excluded, already has live sub-concepts)
  algebra: algebraSubConcepts,
  anglesshapes: anglesshapesSubConcepts,
  areaperimeter: areaperimeterSubConcepts,
  datahandling: datahandlingSubConcepts,
  decimals: decimalsSubConcepts,
  fractions: fractionsSubConcepts,
  longdivision: longdivisionSubConcepts,
  negativenumbers: negativeNumbersSubConcepts,
  percentages: percentagesSubConcepts,
  placevalue: placevalueSubConcepts,
  primenumbersfactors: primenumbersfactorsSubConcepts,
  ratio: ratioSubConcepts,
  sequences: sequencesSubConcepts,
  speeddistancetime: speeddistancetimeSubConcepts,
  volume: volumeSubConcepts,
  // English (6)
  spelling: spellingSubConcepts,
  punctuation: punctuationSubConcepts,
  grammar: grammarSubConcepts,
  vocabulary: vocabularySubConcepts,
  wordClassGrammar: wordClassSubConcepts,
  comprehension: comprehensionSubConcepts,
  // VR (16)
  synonyms: synonymsSubConcepts,
  antonyms: antonymsSubConcepts,
  oddTwoOut: oddTwoOutSubConcepts,
  verbalAnalogies: verbalAnalogiesSubConcepts,
  compoundWords: compoundWordsSubConcepts,
  hiddenWords: hiddenWordsSubConcepts,
  letterMove: letterMoveSubConcepts,
  missingLettersWords: missingLettersWordsSubConcepts,
  sharedLetter: sharedLetterSubConcepts,
  letterCodes: letterCodesSubConcepts,
  letterPairSeries: letterPairSeriesSubConcepts,
  wordCodeAnalogies: wordCodeAnalogiesSubConcepts,
  numberWordCodes: numberWordCodesSubConcepts,
  numberSeries: numberSeriesSubConcepts,
  letterSums: letterSumsSubConcepts,
  logicAndLanguage: logicAndLanguageSubConcepts,
};

export function selectLesson(topicKey, topicPerformance, lessonHistory, currentUser) {
  const topicData = lessonBank[topicKey];
  if (!topicData) return null;

  const history = lessonHistory?.[topicKey]?.shown || [];
  const lastTemplateType = lessonHistory?.[topicKey]?.lastTemplateType;

  const allSubConcepts = topicData.subConcepts;

  // ---- Category-weighted selection ----
  // If this topic has a master method, show it ~25% of the time (every 4th click on average)
  // Remaining 75% distributed among other categories (core 50%, supporting 30%, other 20%)
  const hasMaster = allSubConcepts.some(sc => sc.category === 'master');
  const otherCategories = [...new Set(allSubConcepts.filter(sc => sc.category !== 'master').map(sc => sc.category))];
  let chosenCategory;
  if (hasMaster) {
    const roll = Math.random();
    if (roll < 0.25 || otherCategories.length === 0) {
      chosenCategory = 'master';
    } else {
      // Pick randomly from whatever non-master categories exist
      chosenCategory = otherCategories[Math.floor(Math.random() * otherCategories.length)];
    }
  } else if (otherCategories.length > 0) {
    chosenCategory = otherCategories[Math.floor(Math.random() * otherCategories.length)];
  } else {
    chosenCategory = allSubConcepts[0]?.category || 'core';
  }

  // Filter to chosen category (fall back to all if category is empty)
  let subConcepts = allSubConcepts.filter(sc => sc.category === chosenCategory);
  if (subConcepts.length === 0) subConcepts = allSubConcepts;

  // Find the last 2 sub-concepts shown (for cooldown)
  const recentHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentSubConcepts = recentHistory.slice(0, 2).map(h => h.subConcept);

  // Score each sub-concept by recency (prefer unseen, then least-recently-seen)
  const scored = subConcepts.map(sc => {
    const showings = history.filter(h => h.subConcept === sc.id);
    const lastShown = showings.length > 0
      ? showings.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      : null;
    return {
      subConcept: sc,
      timesShown: showings.length,
      lastShownDate: lastShown?.date || '1970-01-01'
    };
  });

  // Sort: unseen first, then oldest first
  scored.sort((a, b) => {
    if (a.timesShown === 0 && b.timesShown > 0) return -1;
    if (b.timesShown === 0 && a.timesShown > 0) return 1;
    return new Date(a.lastShownDate) - new Date(b.lastShownDate);
  });

  // Apply 2-lesson cooldown: filter out sub-concepts shown in last 2 lessons
  let candidates = scored;
  if (scored.length > 1) {
    const cooledDown = scored.filter(s => !recentSubConcepts.includes(s.subConcept.id));
    if (cooledDown.length > 0) candidates = cooledDown;
  }

  // If all candidates in this category are on cooldown, try full set
  if (candidates.length === 0) {
    const allScored = allSubConcepts.map(sc => {
      const showings = history.filter(h => h.subConcept === sc.id);
      const lastShown = showings.length > 0
        ? showings.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
        : null;
      return { subConcept: sc, timesShown: showings.length, lastShownDate: lastShown?.date || '1970-01-01' };
    });
    allScored.sort((a, b) => {
      if (a.timesShown === 0 && b.timesShown > 0) return -1;
      if (b.timesShown === 0 && a.timesShown > 0) return 1;
      return new Date(a.lastShownDate) - new Date(b.lastShownDate);
    });
    const fallbackCooled = allScored.filter(s => !recentSubConcepts.includes(s.subConcept.id));
    candidates = fallbackCooled.length > 0 ? fallbackCooled : allScored;
  }

  // Among candidates with equal priority (same times shown), pick randomly
  const topTimesShown = candidates[0].timesShown;
  const topTier = candidates.filter(c => c.timesShown === topTimesShown);
  const chosenSubConcept = topTier[Math.floor(Math.random() * topTier.length)].subConcept;

  // Pick a lesson, preferring a different template type than last time
  let lessons = chosenSubConcept.lessons;
  if (lastTemplateType && lessons.length > 1) {
    const different = lessons.filter(l => l.templateType !== lastTemplateType);
    if (different.length > 0) lessons = different;
  }
  const chosenLesson = lessons[Math.floor(Math.random() * lessons.length)];

  // Pick two distinct variable sets: one for teach screens, one for interact screens
  // Difficulty-aware selection: newer learners see only easy sets, experienced learners see harder ones
  const allSets = chosenLesson.variableSets;
  const topicVisits = history.length;
  const allowHard = topicVisits >= 5 && (topicVisits >= 9 ? Math.random() < 0.5 : Math.random() < 0.25);
  const sets = allowHard ? allSets : allSets.filter(s => !s.difficulty || s.difficulty <= 1);
  const effectiveSets = sets.length > 0 ? sets : allSets;
  const idx1 = Math.floor(Math.random() * effectiveSets.length);
  let idx2 = idx1;
  if (effectiveSets.length > 1) {
    // Pick a different index for interact screens
    do { idx2 = Math.floor(Math.random() * effectiveSets.length); } while (idx2 === idx1);
  }
  const variables = effectiveSets[idx1];
  const interactVariables = effectiveSets[idx2];

  return {
    lesson: chosenLesson,
    variables,
    interactVariables,
    subConceptId: chosenSubConcept.id,
    subConceptName: chosenSubConcept.name,
    topicName: topicData.name
  };
}


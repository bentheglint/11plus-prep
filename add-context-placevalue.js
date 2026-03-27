/**
 * add-context-placevalue.js
 *
 * Adds real-world context to 14 raw Place Value and Rounding questions
 * in src/App.js to bring the section from ~67% to ~80% contextualised.
 *
 * ONLY the question text is changed. Options, correct answer, explanation,
 * difficulty and id are left untouched.
 *
 * Run with:  node add-context-placevalue.js
 */

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src", "App.js");
let src = fs.readFileSync(filePath, "utf8");

// ── Replacements ────────────────────────────────────────────────────────────
// Each entry: [exact old question string, new question string]
const replacements = [
  // 1 — id 44  (Round to nearest hundred)
  [
    `"Round 92,145 to the nearest hundred."`,
    `"A stadium holds 92,145 people. Round this attendance to the nearest hundred."`
  ],
  // 2 — id 51  (Round to nearest thousand)
  [
    `"Round 59,999 to the nearest thousand."`,
    `"A charity raises £59,999 at a gala dinner. Round this amount to the nearest thousand."`
  ],
  // 3 — id 68  (What number is X less than Y)
  [
    `"What number is 3,000 less than 61,528?"`,
    `"A town has a population of 61,528. If 3,000 people move away, what is the new population?"`
  ],
  // 4 — id 76  (Put in order smallest to largest)
  [
    `"Put these numbers in order from smallest to largest: 56,789 / 56,879 / 56,798 / 56,978"`,
    `"Four schools have these pupil numbers: 56,789 / 56,879 / 56,798 / 56,978. Put them in order from smallest to largest."`
  ],
  // 5 — id 72  (What number is X more than Y)
  [
    `"What number is 800 more than 25,134?"`,
    `"A bookshop has sold 25,134 copies of a novel. After a weekend sale they sell 800 more. What is the new total?"`
  ],
  // 6 — id 84  (What number is X more than Y)
  [
    `"What number is 6,000 more than 48,521?"`,
    `"A wildlife park has 48,521 annual visitors. After a new exhibit opens, 6,000 extra visitors arrive. What is the new total?"`
  ],
  // 7 — id 57  (Round to nearest ten)
  [
    `"Round 47,382 to the nearest ten."`,
    `"A school fun run tracker shows 47,382 steps. Round this to the nearest ten."`
  ],
  // 8 — id 54  (Round to nearest hundred)
  [
    `"Round 13,627 to the nearest hundred."`,
    `"A village post office handled 13,627 letters last month. Round this to the nearest hundred."`
  ],
  // 9 — id 89  (What number is X less than Y)
  [
    `"What number is 400 less than 72,186?"`,
    `"A warehouse holds 72,186 boxes. After a delivery of 400 boxes is sent out, how many remain?"`
  ],
  // 10 — id 112  (Put in order largest to smallest)
  [
    `"Put these numbers in order from largest to smallest: 67,432 / 67,342 / 67,423 / 67,234"`,
    `"Four charities raised these amounts: £67,432 / £67,342 / £67,423 / £67,234. Put them in order from largest to smallest."`
  ],
  // 11 — id 98  (What number is X less than Y)
  [
    `"What number is 700 less than 54,281?"`,
    `"A farmer harvests 54,281 apples. After selling 700 at a market, how many does she have left?"`
  ],
  // 12 — id 93  (What number is X more than Y)
  [
    `"What number is 2,000 more than 67,835?"`,
    `"A factory produced 67,835 items last year. This year it produced 2,000 more. What is this year's total?"`
  ],
  // 13 — id 111  (What number is X less than Y)
  [
    `"What number is 4,000 less than 82,436?"`,
    `"A council's budget is £82,436. After a cut of £4,000, what is the new budget?"`
  ],
  // 14 — id 102  (What number is X more than Y)
  [
    `"What number is 9,000 more than 31,647?"`,
    `"A concert venue sold 31,647 tickets last season. This season they sold 9,000 more. What is the new total?"`
  ]
];

// ── Apply replacements ──────────────────────────────────────────────────────
let changeCount = 0;

for (const [oldStr, newStr] of replacements) {
  if (!src.includes(oldStr)) {
    console.error(`NOT FOUND — skipping: ${oldStr}`);
    continue;
  }
  src = src.replace(oldStr, newStr);
  changeCount++;
}

// ── Write back ──────────────────────────────────────────────────────────────
fs.writeFileSync(filePath, src, "utf8");
console.log(`Done — ${changeCount} Place Value questions updated with real-world context.`);

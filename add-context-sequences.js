/**
 * add-context-sequences.js
 *
 * Adds real-world context to 13 raw Sequences questions in src/App.js
 * to bring the section from ~67% to ~80% contextualised.
 *
 * ONLY the question text is changed. Options, correct answer, explanation,
 * difficulty and id are left untouched.
 *
 * Run with:  node add-context-sequences.js
 */

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src", "App.js");
let src = fs.readFileSync(filePath, "utf8");

// ── Replacements ────────────────────────────────────────────────────────────
// Each entry: [exact old question string, new question string]
const replacements = [
  // 1 — id 64  (subtract 15 each time)
  [
    `"What comes next? 150, 135, 120, 105, 90, ?"`,
    `"A swimmer counts down laps remaining: 150, 135, 120, 105, 90. How many laps remain next?"`
  ],
  // 2 — id 67  (add 6 each time, missing number)
  [
    `"What is the missing number? 2, 8, 14, 20, ?, 32"`,
    `"A gardener plants flowers in a pattern: 2, 8, 14, 20, ?, 32. How many flowers go in the missing bed?"`
  ],
  // 3 — id 68  (multiply by 3)
  [
    `"What comes next? 11, 33, 99, 297, ?"`,
    `"A science experiment triples bacteria each hour: 11, 33, 99, 297. How many bacteria are there after the next hour?"`
  ],
  // 4 — id 73  (subtract 16, missing number)
  [
    `"What is the missing number? 160, 144, 128, ?, 96, 80"`,
    `"A water tank is draining and the readings in litres are: 160, 144, 128, ?, 96, 80. What is the missing reading?"`
  ],
  // 5 — id 70  (doubling)
  [
    `"What comes next? 14, 28, 56, 112, 224, ?"`,
    `"A chain letter doubles each day: 14, 28, 56, 112, 224 people have received it. How many will have received it the next day?"`
  ],
  // 6 — id 80  (add 8, missing number)
  [
    `"What is the missing number? 5, 13, 21, 29, ?, 45"`,
    `"A baker adds 8 more biscuits to each tray: 5, 13, 21, 29, ?, 45. How many biscuits are on the missing tray?"`
  ],
  // 7 — id 76  (halving)
  [
    `"What comes next? 800, 400, 200, 100, 50, ?"`,
    `"A bouncy ball loses half its height with each bounce: 800 cm, 400 cm, 200 cm, 100 cm, 50 cm. How high does it bounce next?"`
  ],
  // 8 — id 83  (subtract 18)
  [
    `"What comes next? 180, 162, 144, 126, 108, ?"`,
    `"A swimming pool is being drained, losing 18 litres each minute: 180, 162, 144, 126, 108. How many litres are left after the next minute?"`
  ],
  // 9 — id 86  (add 9, missing number)
  [
    `"What is the missing number? 6, 15, 24, 33, ?, 51"`,
    `"Children collect conkers each day in a pattern: 6, 15, 24, 33, ?, 51. How many conkers were collected on the missing day?"`
  ],
  // 10 — id 91  (subtract 19, missing number)
  [
    `"What is the missing number? 190, 171, 152, ?, 114, 95"`,
    `"A charity countdown timer shows: 190, 171, 152, ?, 114, 95 seconds. What is the missing time?"`
  ],
  // 11 — id 81  (doubling)
  [
    `"What comes next? 16, 32, 64, 128, 256, ?"`,
    `"A colony of ants doubles each week: 16, 32, 64, 128, 256. How many ants will there be the next week?"`
  ],
  // 12 — id 101  (subtract 21)
  [
    `"What comes next? 210, 189, 168, 147, 126, ?"`,
    `"A shop is counting down its stock each day: 210, 189, 168, 147, 126. How many items will be left the next day?"`
  ],
  // 13 — id 98  (add 11, missing number)
  [
    `"What is the missing number? 7, 18, 29, 40, ?, 62"`,
    `"A postman delivers parcels along a street in a pattern: 7, 18, 29, 40, ?, 62. How many parcels were delivered at the missing house?"`
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
console.log(`Done — ${changeCount} Sequences questions updated with real-world context.`);

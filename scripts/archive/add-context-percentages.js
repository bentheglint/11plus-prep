/**
 * add-context-percentages.js
 *
 * Wraps 5 raw "What is X% of Y?" Percentages questions with real-world
 * context. Only the question text is changed; options, correct index,
 * and explanation remain untouched.
 *
 * Usage:  node add-context-percentages.js
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'src', 'App.js');

// Map: exact original question string  ->  new contextualised question string
const replacements = [
  {
    // id 4 – 10% of 450
    old: 'What is 10% of 450?',
    new: 'A shop offers 10% off a coat costing \u00A3450. How much is the discount?',
  },
  {
    // id 6 – 50% of 86
    old: 'What is 50% of 86?',
    new: 'There are 86 pupils in Year 5. Half of them walk to school. How many is that? (50% of 86)',
  },
  {
    // id 10 – 75% of 160
    old: 'What is 75% of 160?',
    new: 'A swimming pool holds 160 litres. It is 75% full. How many litres of water are in the pool?',
  },
  {
    // id 36 – 30% of 180
    old: 'What is 30% of 180?',
    new: 'A farm has 180 animals. 30% of them are sheep. How many sheep are there?',
  },
  {
    // id 39 – 15% of 240
    old: 'What is 15% of 240?',
    new: 'A school trip costs \u00A3240. A deposit of 15% is needed to book a place. How much is the deposit?',
  },
];

// ── run ──────────────────────────────────────────────────────────────
let src = fs.readFileSync(FILE, 'utf8');
let count = 0;

for (const r of replacements) {
  if (!src.includes(r.old)) {
    console.error(`NOT FOUND – skipping: "${r.old}"`);
    continue;
  }
  src = src.replace(r.old, r.new);
  count++;
  console.log(`Replaced: "${r.old}"`);
}

fs.writeFileSync(FILE, src, 'utf8');
console.log(`\nDone – ${count} Percentages question(s) updated in src/App.js`);

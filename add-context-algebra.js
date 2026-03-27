/**
 * add-context-algebra.js
 *
 * Wraps 5 raw "If variable = N, what is [expression]?" Algebra questions
 * with real-world context. Only the question text is changed; options,
 * correct index, and explanation remain untouched.
 *
 * Usage:  node add-context-algebra.js
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'src', 'App.js');

// Map: exact original question string  ->  new contextualised question string
const replacements = [
  {
    // id 2 – 3n + 4, n = 5
    old: 'If n = 5, what is 3n + 4?',
    new: 'Tickets cost \u00A3n each plus a \u00A34 booking fee for 3 tickets. If n = 5, what is the total cost? (Work out 3n + 4)',
  },
  {
    // id 10 – 5x - 7, x = 4
    old: 'If x = 4, what is 5x - 7?',
    new: 'A shop sells pens for \u00A3x each. Tom buys 5 and uses a \u00A37 voucher. If x = 4, what does he pay? (Work out 5x - 7)',
  },
  {
    // id 16 – 4y - 5, y = 6
    old: 'If y = 6, what is 4y - 5?',
    new: 'A fairground ride costs \u00A3y per go. Mia goes on it 4 times and gets \u00A35 change from her money. If y = 6, how much did the rides cost before the change? (Work out 4y - 5)',
  },
  {
    // id 25 – 2a - b, a = 5, b = 3
    old: 'If a = 5 and b = 3, what is 2a - b?',
    new: 'Noah buys 2 sandwiches at \u00A3a each and a drink for \u00A3b, but the drink is free with a voucher. If a = 5 and b = 3, how much does he pay? (Work out 2a - b)',
  },
  {
    // id 37 – 4n - 3, n = 7
    old: 'If n = 7, what is 4n - 3?',
    new: 'A baker puts n biscuits in each of 4 bags, then eats 3 himself. If n = 7, how many biscuits are left? (Work out 4n - 3)',
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
console.log(`\nDone – ${count} Algebra question(s) updated in src/App.js`);

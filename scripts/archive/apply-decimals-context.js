const fs = require('fs');
const appPath = 'src/App.js';
let content = fs.readFileSync(appPath, 'utf8');

const replacements = [
  ['What is 4.6 + 2.8?', 'Two parcels weigh 4.6 kg and 2.8 kg. What is their total weight?'],
  ['What is 8.5 - 3.2?', 'A jug holds 8.5 litres of water. After pouring out 3.2 litres, how much is left?'],
  ['What is 0.6 × 10?', 'A bag of sweets costs £0.60. What do 10 bags cost?'],
  ['What is 3.2 × 4?', 'Each side of a square field is 3.2 metres long. What is the perimeter?'],
  ['What is 7.2 ÷ 4?', 'Four friends share 7.2 metres of ribbon equally. How much does each person get?'],
  ['What is 5.8 + 3.6?', 'In a science experiment, Sam measures 5.8 ml in one beaker and 3.6 ml in another. What is the total volume?'],
  ['Round 7.68 to one decimal place.', 'A swimmer finishes a race in 7.68 seconds. Round this time to one decimal place.'],
  ['What is 12 ÷ 5?', 'Twelve biscuits are shared equally among 5 children. How many does each child get?'],
  ['What is 0.25 as a percentage?', 'In a test, a pupil scores 0.25 of the total marks. What is this as a percentage?'],
  ['What is 15.4 - 8.7?', 'Dad drives 15.4 km to the shops and 8.7 km back by a shorter route. How much longer is the first journey?'],
  ['What is 6.5 × 0.2?', 'A recipe uses 6.5 grams of salt. Mum only needs 0.2 of that amount. How many grams does she need?'],
  ['Which decimal is equivalent to 2/5?', 'In a spelling test, Amy gets 2/5 of the words correct. What is this as a decimal?'],
  ['Round 3.456 to two decimal places.', 'A science scale reads 3.456 kg. Round this to two decimal places.'],
  ['What is 9 ÷ 4?', 'Nine litres of juice are poured equally into 4 bottles. How many litres are in each bottle?'],
  ['What is 2.5 × 8?', 'Tickets for a school play cost £2.50 each. How much do 8 tickets cost?'],
];

let count = 0;
for (const [old, newQ] of replacements) {
  if (content.includes(old)) {
    content = content.replace(old, newQ);
    count++;
    console.log(`  Replaced: "${old.substring(0, 40)}..." → "${newQ.substring(0, 50)}..."`);
  } else {
    console.log(`  NOT FOUND: "${old}"`);
  }
}

fs.writeFileSync(appPath, content, 'utf8');
console.log(`\nApplied ${count} replacements.`);

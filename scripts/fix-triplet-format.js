// Fix middle-number-analogies question strings:
// Replace literal newlines (incorrectly inserted) with proper \n escape sequences,
// then re-do the triplet spacing with correct \n escape sequences.
const fs = require('fs');
const path = 'C:/Users/Ben Jackson/Projects/11plus-prep/src/questionData/vrData.js';
let content = fs.readFileSync(path, 'utf8');

// Step 1: Fix any literal newlines inside string literals back to \n escape sequences
// Only touch the middle-number-analogies question strings
content = content.replace(
  /"Find the missing number:[^"]*"/g,
  (match) => match.replace(/\n/g, '\\n')
);

// Step 2: Now replace the 5-space separators between triplets with \n escape sequences
// Pattern: a digit, 4+ spaces, a digit — inside these question strings only
content = content.replace(
  /"Find the missing number:[^"]*"/g,
  (match) => match.replace(/(\d) {4,}(\d)/g, '$1\\n$2')
);

// Verify
const idx = content.indexOf('Find the missing number');
const sample = content.slice(idx - 1, idx + 70);
console.log('Sample:', sample);

fs.writeFileSync(path, content);
console.log('Done.');

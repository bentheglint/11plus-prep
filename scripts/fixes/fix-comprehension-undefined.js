const fs = require('fs');
let content = fs.readFileSync('src/microLessons/staging/comprehension-subconcepts.js', 'utf8');

// Replace unconditional question references with conditional ones
// In body text:
content = content.replace(
  /\\n\\n\*\*Question: \$\{v\.question\}\*\*/g,
  '${v.question ? "\\n\\n**Question: " + v.question + "**" : ""}'
);

// In content functions:
content = content.replace(
  /\*\*Question: \$\{v\.question\}\*\*\\n\\n/g,
  '${v.question ? "**Question: " + v.question + "**\\n\\n" : ""}'
);

fs.writeFileSync('src/microLessons/staging/comprehension-subconcepts.js', content);
console.log('Done — made question display conditional');

const fs = require('fs');
let content = fs.readFileSync('src/microLessons/staging/comprehension-subconcepts.js', 'utf8');

// Revert conditional question back to simple template literal
// Hook pattern: ${v.question ? "\n\n**Question: " + v.question + "**" : ""}
content = content.replace(
  /\$\{v\.question \? "\\n\\n\*\*Question: " \+ v\.question \+ "\*\*" : ""\}/g,
  '\\n\\n**Question: ${v.question}**'
);

// Teach pattern: ${v.question ? "**Question: " + v.question + "**\n\n" : ""}
content = content.replace(
  /\$\{v\.question \? "\*\*Question: " \+ v\.question \+ "\*\*\\n\\n" : ""\}/g,
  '**Question: ${v.question}**\\n\\n'
);

fs.writeFileSync('src/microLessons/staging/comprehension-subconcepts.js', content);

// Count remaining
const remaining = (content.match(/v\.question \?/g) || []).length;
const simple = (content.match(/v\.question\}/g) || []).length;
console.log('Conditional remaining:', remaining);
console.log('Simple v.question:', simple);

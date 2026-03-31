const fs = require('fs');
const lines = fs.readFileSync('src/microLessons/staging/comprehension-subconcepts.js', 'utf8').split('\n');
let fixCount = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('type: "hook"')) {
    // Find the body line for this hook
    for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
      if (lines[j].includes('body:') && !lines[j].includes('v.question') && !lines[j].includes('Question:')) {
        // Add question at the end of body text, before the closing backtick
        const line = lines[j];
        // Insert \n\n**Question: ${v.question}** before the closing backtick
        const newLine = line.replace(/`,$/, '\\n\\n**Question: ${v.question}**`,');
        if (newLine !== line) {
          lines[j] = newLine;
          fixCount++;
          console.log('Fixed hook body at line', j + 1);
        }
        break;
      }
    }
  }
}

fs.writeFileSync('src/microLessons/staging/comprehension-subconcepts.js', lines.join('\n'));
console.log('\nTotal fixed:', fixCount);

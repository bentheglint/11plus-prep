const fs = require('fs');
const lines = fs.readFileSync('src/microLessons/staging/comprehension-subconcepts.js', 'utf8').split('\n');
let fixCount = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('type: "teach"')) {
    // Look for the first text content in bodyParts
    for (let j = i + 1; j < Math.min(i + 12, lines.length); j++) {
      if (lines[j].includes("type: 'text'")) {
        // Next line should be content:
        const nextIdx = j + 1;
        if (nextIdx < lines.length && lines[nextIdx].includes('content:')) {
          const contentLine = lines[nextIdx];
          if (!contentLine.includes('v.question') && !contentLine.includes('Question:')) {
            // Add question at the start of the template literal
            const newLine = contentLine.replace(
              /content: \(v\) => `/,
              'content: (v) => `**Question: ${v.question}**\\n\\n'
            );
            if (newLine !== contentLine) {
              lines[nextIdx] = newLine;
              fixCount++;
              console.log('Fixed line', nextIdx + 1);
            }
          }
        }
        break;
      }
    }
  }
}

fs.writeFileSync('src/microLessons/staging/comprehension-subconcepts.js', lines.join('\n'));
console.log('\nTotal fixed:', fixCount);

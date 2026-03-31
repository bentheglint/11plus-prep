const fs = require('fs');
let content = fs.readFileSync('src/microLessons/staging/hiddenwords-subconcepts.js', 'utf8');
const lines = content.split('\n');

let fixCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Find body/content lines that have v.sentence but don't already have wordBefore
  if ((line.includes('body:') || line.includes('content:')) &&
      line.includes('v.sentence') &&
      !line.includes('wordBefore') && !line.includes('wordAfter')) {

    // Add "Focus on: wordBefore and wordAfter" before the closing backtick
    if (line.includes('v.interactSentence')) {
      lines[i] = line.replace(
        /\$\{v\.interactSentence\}"\*\*`/,
        '${v.interactSentence}"**\\n\\nFocus on the words: **${v.interactWordBefore}** and **${v.interactWordAfter}**`'
      );
    } else {
      lines[i] = line.replace(
        /\$\{v\.sentence\}"\*\*`/,
        '${v.sentence}"**\\n\\nFocus on the words: **${v.wordBefore}** and **${v.wordAfter}**`'
      );
    }

    if (lines[i] !== line) fixCount++;
  }
}

fs.writeFileSync('src/microLessons/staging/hiddenwords-subconcepts.js', lines.join('\n'));
console.log('Fixed', fixCount, 'screens');

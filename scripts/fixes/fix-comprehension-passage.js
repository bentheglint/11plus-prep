const fs = require('fs');
const lines = fs.readFileSync('src/microLessons/staging/comprehension-subconcepts.js', 'utf8').split('\n');
let fixCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Check if this body/content line has v.passage AND there's a SentenceDisplay nearby showing the passage
  if ((line.includes('body:') || line.includes('content:')) && line.includes('v.passage')) {
    // Look ahead for a SentenceDisplay with passage prop on this screen
    let hasDiagram = false;
    for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
      if (lines[j].includes('passage: v.passage') || lines[j].includes('text: v.passage')) {
        hasDiagram = true;
        break;
      }
    }

    if (hasDiagram) {
      // Remove the passage quote from the body text
      // Pattern: \n\n*"${v.passage}"* or Read this passage carefully:\n\n*"${v.passage}"*
      let newLine = line;

      // Remove "Read this passage:\n\n*\"${v.passage}\"*\n\n" and similar
      newLine = newLine.replace(/Read this passage carefully:\\n\\n\*"\$\{v\.passage\}"\*\\n\\n/g, '');
      newLine = newLine.replace(/Read this passage:\\n\\n\*"\$\{v\.passage\}"\*\\n\\n/g, '');
      newLine = newLine.replace(/Read the passage again:\\n\\n\*"\$\{v\.passage\}"\*/g, 'Read the passage below:');
      newLine = newLine.replace(/Read this passage — it is packed with language techniques!\\n\\n\*"\$\{v\.passage\}"\*\\n\\n/g, 'This passage is packed with language techniques!\\n\\n');
      newLine = newLine.replace(/Read this passage carefully:\\n\\n\*"\$\{v\.passage\}"\*/g, 'Read the passage below:');
      newLine = newLine.replace(/Read this passage:\\n\\n\*"\$\{v\.passage\}"\*/g, 'Read the passage below:');
      newLine = newLine.replace(/From the same passage, find this phrase:\\n\\n\*"\$\{v\.passage\}"\*/g, 'From the same passage, find this phrase:');
      newLine = newLine.replace(/\\n\\n\*"\$\{v\.passage\}"\*/g, '');

      if (newLine !== line) {
        lines[i] = newLine;
        fixCount++;
      }
    }
  }
}

fs.writeFileSync('src/microLessons/staging/comprehension-subconcepts.js', lines.join('\n'));
console.log('Fixed', fixCount, 'screens');

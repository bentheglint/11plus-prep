const fs = require('fs');
const lines = fs.readFileSync('src/microLessons/staging/comprehension-subconcepts.js', 'utf8').split('\n');
let fixCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Fix teach screens: add question to the first text content that mentions trap/explanation
  if (line.includes("type: 'text'") && line.includes('content:') &&
      (line.includes('v.trap') || line.includes('trapReason')) &&
      !line.includes('v.question')) {
    // Add question at the start of the content
    lines[i] = line.replace(
      /content: \(v\) => `(.*)`/,
      'content: (v) => `**Question: ${v.question}**\\n\\n$1`'
    );
    if (lines[i] !== line) {
      fixCount++;
      console.log('Fixed teach text at line', i + 1);
    }
  }

  // Fix teach screens with body (not bodyParts) that have trap/explanation but no question
  if (line.includes('body:') && line.includes('v.trap') && !line.includes('v.question') &&
      !line.includes("type: 'text'")) {
    lines[i] = line.replace(
      /body: \(v\) => `(.*)`/,
      'body: (v) => `**Question: ${v.question}**\\n\\n$1`'
    );
    if (lines[i] !== line) {
      fixCount++;
      console.log('Fixed teach body at line', i + 1);
    }
  }
}

fs.writeFileSync('src/microLessons/staging/comprehension-subconcepts.js', lines.join('\n'));
console.log('\nTotal fixed:', fixCount);

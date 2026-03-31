// Fix comprehension questions missing passage text
// Copies passage text from sibling questions with same passageId

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'questionData', 'englishData.js');
let content = fs.readFileSync(filePath, 'utf8');

const data = require('../src/questionData/englishData.js');
const english = data.default || data;
const qs = english.topics.comprehension.questions;

// Build passageId -> passage text map
const passageMap = {};
qs.forEach(q => {
  if (q.passageId && q.passage && !passageMap[q.passageId]) {
    passageMap[q.passageId] = { passage: q.passage, passageTitle: q.passageTitle };
  }
});

const missing = qs.filter(q => q.questionType === 'passage' && !q.passage && q.passageId);
console.log('Passages in map:', Object.keys(passageMap).length);
console.log('Questions to fix:', missing.length);

let fixCount = 0;
const notFound = [];

for (const q of missing) {
  const info = passageMap[q.passageId];
  if (!info) {
    notFound.push('Q' + q.id + ' (' + q.passageId + ') — no sibling with passage text');
    continue;
  }

  // Find this question's ID in the file
  const idStr = '"id": ' + q.id + ',';
  const idIdx = content.indexOf(idStr);
  if (idIdx === -1) { notFound.push('Q' + q.id + ' — not found in file'); continue; }

  // Find passageId near this question
  const searchRegion = content.substring(idIdx, idIdx + 600);
  const passageIdStr = '"passageId": "' + q.passageId + '"';
  const relIdx = searchRegion.indexOf(passageIdStr);
  if (relIdx === -1) { notFound.push('Q' + q.id + ' — passageId not near id'); continue; }

  // Check if passage already exists
  const afterRegion = searchRegion.substring(relIdx, relIdx + 200);
  if (afterRegion.includes('"passage"') || afterRegion.includes('"passageTitle"')) {
    continue; // already has it
  }

  // Insert passageTitle and passage after the passageId line
  const absIdx = idIdx + relIdx;
  const lineEnd = content.indexOf('\n', absIdx);
  const indent = '          ';
  const escapedTitle = info.passageTitle.replace(/"/g, '\\"');
  const insertion = '\n' + indent + '"passageTitle": "' + escapedTitle + '",\n' +
                    indent + '"passage": `' + info.passage + '`,';

  content = content.substring(0, lineEnd) + ',' + insertion + content.substring(lineEnd + 1);
  fixCount++;
  if (fixCount % 10 === 0) console.log('  Fixed', fixCount, '...');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('\nDone. Fixed:', fixCount);
if (notFound.length > 0) {
  console.log('Could not fix:', notFound.length);
  notFound.forEach(n => console.log('  ' + n));
}

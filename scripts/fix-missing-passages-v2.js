// Fix comprehension questions missing passage text — v2
// Strategy: find each broken question by its unique question text,
// then insert passage + passageTitle from a sibling with the same passageId

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'questionData', 'englishData.js');
let content = fs.readFileSync(filePath, 'utf8');

const data = require('../src/questionData/englishData.js');
const english = data.default || data;
const qs = english.topics.comprehension.questions;

// Build passageId -> { passage, passageTitle } from questions that have text
const passageMap = {};
qs.forEach(q => {
  if (q.passageId && q.passage && !passageMap[q.passageId]) {
    passageMap[q.passageId] = { passage: q.passage, passageTitle: q.passageTitle };
  }
});

// Find broken questions that have a sibling with text
const canFix = qs.filter(q =>
  q.questionType === 'passage' && !q.passage && q.passageId && passageMap[q.passageId]
);

console.log('Questions to fix:', canFix.length);
let fixCount = 0;

for (const q of canFix) {
  const info = passageMap[q.passageId];

  // Find the question by searching for its passageId line that's NOT followed by passageTitle
  // We need a unique anchor — use the question text (first 60 chars)
  const qText = q.question.substring(0, 60).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const qIdx = content.indexOf(q.question.substring(0, 60));
  if (qIdx === -1) {
    console.log('  SKIP Q' + q.id + ': question text not found');
    continue;
  }

  // Look backwards from question text to find the passageId line
  const regionBefore = content.substring(Math.max(0, qIdx - 300), qIdx);
  const passageIdPattern = '"passageId": "' + q.passageId + '"';
  const pidIdx = regionBefore.lastIndexOf(passageIdPattern);
  if (pidIdx === -1) {
    console.log('  SKIP Q' + q.id + ': passageId not found near question');
    continue;
  }

  // Check if passageTitle already exists between passageId and question
  const between = regionBefore.substring(pidIdx);
  if (between.includes('passageTitle') || between.includes('passage":') || between.includes("passage`:")) {
    continue; // already fixed
  }

  // Insert after the passageId line
  const absPassageIdIdx = Math.max(0, qIdx - 300) + pidIdx;
  const lineEnd = content.indexOf('\n', absPassageIdIdx);
  const currentLine = content.substring(absPassageIdIdx, lineEnd);

  // Ensure the passageId line ends with comma
  const needsComma = !currentLine.trimEnd().endsWith(',');
  const indent = '          ';
  const titleEscaped = info.passageTitle.replace(/"/g, '\\"');
  const insertion = (needsComma ? ',' : '') + '\n' +
    indent + '"passageTitle": "' + titleEscaped + '",\n' +
    indent + '"passage": `' + info.passage + '`';

  content = content.substring(0, lineEnd) + insertion + content.substring(lineEnd);
  fixCount++;
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed:', fixCount);

const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.js');
const content = fs.readFileSync(appPath, 'utf8');

// Extract all question objects using regex
const topics = {};
let currentTopic = null;

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const topicMatch = lines[i].match(/name:\s*"([^"]+)"/);
  if (topicMatch && !['Maths', 'English', 'Verbal Reasoning', 'Grammar', 'Vocabulary', 'Comprehension', 'Spelling', 'Analogies', 'Word Patterns', 'Letter Codes', 'Logic Puzzles'].includes(topicMatch[1])) {
    currentTopic = topicMatch[1];
    if (!topics[currentTopic]) topics[currentTopic] = [];
  }
}

// Better approach: extract question blocks
const questionRegex = /\{\s*\n\s*id:\s*(\d+),\s*\n\s*difficulty:\s*(\d+),\s*\n\s*question:\s*"([^"]*(?:\\.[^"]*)*)",\s*\n\s*options:\s*\[([\s\S]*?)\],\s*\n\s*correct:\s*(\d+),/g;

let match;
const allQuestions = [];
while ((match = questionRegex.exec(content)) !== null) {
  const id = parseInt(match[1]);
  const difficulty = parseInt(match[2]);
  const question = match[3];
  const optionsRaw = match[4];
  const correct = parseInt(match[5]);

  // Parse options
  const options = [];
  const optRegex = /"([^"]*(?:\\.[^"]*)*)"/g;
  let optMatch;
  while ((optMatch = optRegex.exec(optionsRaw)) !== null) {
    options.push(optMatch[1]);
  }

  // Find which topic this belongs to by line number
  const pos = match.index;
  const lineNum = content.substring(0, pos).split('\n').length;

  let topic = 'Unknown';
  if (lineNum < 1096) topic = 'Percentages';
  else if (lineNum < 2366) topic = 'Decimals';
  else if (lineNum < 3572) topic = 'Long Division';
  else if (lineNum < 4901) topic = 'Ratio & Proportion';
  else if (lineNum < 6106) topic = 'Fractions';
  else if (lineNum < 7256) topic = 'Long Multiplication';
  else if (lineNum < 8342) topic = 'Algebra';
  else if (lineNum < 9508) topic = 'Place Value';
  else if (lineNum < 10594) topic = 'Negative Numbers';
  else if (lineNum < 11559) topic = 'Prime Numbers';
  else if (lineNum < 12681) topic = 'Area & Perimeter';
  else if (lineNum < 13787) topic = 'Volume';
  else if (lineNum < 14878) topic = 'Angles & Shapes';
  else if (lineNum < 15947) topic = 'Sequences';
  else if (lineNum < 17150) topic = 'Data Handling';
  else if (lineNum < 18079) topic = 'Speed, Distance, Time';

  allQuestions.push({ id, difficulty, question, options, correct, topic, lineNum });
}

console.log(`Total questions extracted: ${allQuestions.length}\n`);

// Check Long Division questions
console.log('=== LONG DIVISION CHECKS ===');
const ldQuestions = allQuestions.filter(q => q.topic === 'Long Division');
let ldErrors = 0;
for (const q of ldQuestions) {
  // Try to extract dividend ÷ divisor from the question
  const divMatch = q.question.match(/(\d[\d,]*)\s*[÷\\u00F7]\s*(\d[\d,]*)/);
  const divMatch2 = q.question.match(/[Dd]ivide\s+(\d[\d,]*)\s+by\s+(\d[\d,]*)/);
  const divMatch3 = q.question.match(/(\d[\d,]*)\s+divided\s+by\s+(\d[\d,]*)/);
  const divMatch4 = q.question.match(/(\d[\d,]*)\s*\\u00F7\s*(\d[\d,]*)/);

  const m = divMatch || divMatch2 || divMatch3 || divMatch4;
  if (m) {
    const dividend = parseInt(m[1].replace(/,/g, ''));
    const divisor = parseInt(m[2].replace(/,/g, ''));
    const result = dividend / divisor;

    // Check if it divides evenly
    if (!Number.isInteger(result)) {
      console.log(`  ID ${q.id} (line ${q.lineNum}): ${dividend} ÷ ${divisor} = ${result.toFixed(4)} (NOT INTEGER)`);
      ldErrors++;
      continue;
    }

    // Check if the correct option matches
    const correctOption = q.options[q.correct];
    const correctNum = parseInt(correctOption?.replace(/[^0-9.-]/g, ''));
    if (correctNum !== result) {
      console.log(`  ID ${q.id} (line ${q.lineNum}): ${dividend} ÷ ${divisor} = ${result}, but correct option says "${correctOption}" (index ${q.correct})`);
      ldErrors++;
    }
  }
}
console.log(`Long Division: ${ldErrors} errors found out of ${ldQuestions.length} questions\n`);

// Check Long Multiplication questions
console.log('=== LONG MULTIPLICATION CHECKS ===');
const lmQuestions = allQuestions.filter(q => q.topic === 'Long Multiplication');
let lmErrors = 0;
for (const q of lmQuestions) {
  const mulMatch = q.question.match(/(\d[\d,]*)\s*[×\\u00D7x]\s*(\d[\d,]*)/);
  const mulMatch2 = q.question.match(/[Mm]ultiply\s+(\d[\d,]*)\s+by\s+(\d[\d,]*)/);
  const mulMatch3 = q.question.match(/(\d[\d,]*)\s*\\u00D7\s*(\d[\d,]*)/);

  const m = mulMatch || mulMatch2 || mulMatch3;
  if (m) {
    const a = parseInt(m[1].replace(/,/g, ''));
    const b = parseInt(m[2].replace(/,/g, ''));
    const result = a * b;

    const correctOption = q.options[q.correct];
    const correctNum = parseInt(correctOption?.replace(/[^0-9]/g, ''));
    if (correctNum !== result) {
      console.log(`  ID ${q.id} (line ${q.lineNum}): ${a} × ${b} = ${result}, but correct option says "${correctOption}" (index ${q.correct})`);
      lmErrors++;
    }
  }
}
console.log(`Long Multiplication: ${lmErrors} errors found out of ${lmQuestions.length} questions\n`);

// Check for debugging text in explanations
console.log('=== DEBUGGING TEXT IN EXPLANATIONS ===');
const debugPatterns = [/Let me verify/i, /Author note/i, /checking:/i, /Let me check/i, /I need to/i, /wait,/i, /actually,/i, /hmm/i];
const explanationRegex = /explanation:\s*"([^"]*(?:\\.[^"]*)*)"/g;
let debugCount = 0;
let explMatch;
while ((explMatch = explanationRegex.exec(content)) !== null) {
  const expl = explMatch[1];
  for (const pat of debugPatterns) {
    if (pat.test(expl)) {
      const lineNum = content.substring(0, explMatch.index).split('\n').length;
      console.log(`  Line ${lineNum}: "${expl.substring(0, 80)}..." matches ${pat}`);
      debugCount++;
      break;
    }
  }
}
console.log(`Total explanations with debugging text: ${debugCount}\n`);

// Summary by topic
console.log('=== QUESTION COUNT BY TOPIC ===');
const topicCounts = {};
for (const q of allQuestions) {
  topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
}
for (const [topic, count] of Object.entries(topicCounts)) {
  console.log(`  ${topic}: ${count}`);
}
console.log(`  TOTAL: ${allQuestions.length}`);

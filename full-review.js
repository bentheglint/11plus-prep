const fs = require('fs');
const content = fs.readFileSync('src/App.js', 'utf8');
const lines = content.split('\n');

// Find topic sections dynamically
const topicNames = [
  'Percentages', 'Decimals', 'Long Division', 'Ratio & Proportion',
  'Fractions', 'Long Multiplication', 'Algebra', 'Place Value and Rounding',
  'Negative Numbers', 'Prime Numbers & Factors', 'Area and Perimeter',
  'Volume', 'Angles and Shapes', 'Sequences', 'Data Handling',
  'Speed, Distance, Time'
];

const topicStarts = [];
for (let i = 0; i < lines.length; i++) {
  for (const name of topicNames) {
    if (lines[i].includes(`name: "${name}"`)) {
      topicStarts.push({ name, line: i });
    }
  }
}

// Find where the non-maths section starts (English, Verbal Reasoning, etc.)
let mathsEnd = lines.length - 1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('name: "English"')) { mathsEnd = i - 1; break; }
}

const topicRanges = [];
for (let i = 0; i < topicStarts.length; i++) {
  const end = i < topicStarts.length - 1 ? topicStarts[i + 1].line - 1 : mathsEnd;
  topicRanges.push({ name: topicStarts[i].name, start: topicStarts[i].line, end });
}

// Better options parser - handles quoted strings with commas inside
function parseOptions(line) {
  const match = line.match(/options:\s*\[(.+)\]/);
  if (!match) return [];
  const inner = match[1];
  const opts = [];
  let current = '';
  let inQuote = false;
  let quoteChar = '';
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (!inQuote && (ch === '"' || ch === "'")) {
      inQuote = true;
      quoteChar = ch;
    } else if (inQuote && ch === quoteChar) {
      inQuote = false;
      opts.push(current);
      current = '';
    } else if (inQuote) {
      current += ch;
    }
  }
  return opts;
}

function extractQuestions(start, end) {
  const questions = [];
  let current = null;

  for (let i = start; i <= end; i++) {
    const line = lines[i];
    const idMatch = line.match(/^\s*id:\s*(\d+)\s*,/);
    if (idMatch) {
      if (current) questions.push(current);
      current = { id: parseInt(idMatch[1]), line: i + 1, difficulty: null, question: '', options: [], correct: null, explanation: '', image: null };
    }
    if (current) {
      const diffMatch = line.match(/^\s*difficulty:\s*(\d+)\s*,/);
      if (diffMatch) current.difficulty = parseInt(diffMatch[1]);

      const qMatch = line.match(/^\s*question:\s*"(.+)"\s*,?\s*$/);
      if (qMatch) current.question = qMatch[1];

      const imgMatch = line.match(/^\s*image:\s*"(.+)"\s*,?\s*$/);
      if (imgMatch) current.image = imgMatch[1];

      if (line.match(/^\s*options:\s*\[/)) {
        current.options = parseOptions(line);
      }

      const corrMatch = line.match(/^\s*correct:\s*(\d+)\s*,/);
      if (corrMatch) current.correct = parseInt(corrMatch[1]);

      const expMatch = line.match(/^\s*explanation:\s*"(.+)"\s*$/);
      if (expMatch) current.explanation = expMatch[1];
    }
  }
  if (current) questions.push(current);
  return questions;
}

const issues = [];
function addIssue(topic, id, line, severity, message) {
  issues.push({ topic, id, line, severity, message });
}

function checkStructural(topic, q) {
  if (!q.question) addIssue(topic, q.id, q.line, 'ERROR', 'Missing question text');
  if (q.options.length !== 5) addIssue(topic, q.id, q.line, 'ERROR', `Has ${q.options.length} options instead of 5`);
  if (q.correct === null) addIssue(topic, q.id, q.line, 'ERROR', 'Missing correct index');
  if (q.correct !== null && (q.correct < 0 || q.correct >= q.options.length)) {
    addIssue(topic, q.id, q.line, 'ERROR', `Correct index ${q.correct} out of bounds (0-${q.options.length - 1})`);
  }
  if (q.difficulty === null) addIssue(topic, q.id, q.line, 'WARN', 'Missing difficulty');
  if (q.difficulty !== null && ![1, 2, 3].includes(q.difficulty)) {
    addIssue(topic, q.id, q.line, 'ERROR', `Invalid difficulty: ${q.difficulty}`);
  }
  if (!q.explanation) addIssue(topic, q.id, q.line, 'WARN', 'Missing explanation');
  if (q.explanation && !q.explanation.includes('✓') && !q.explanation.includes('\\u2713')) {
    addIssue(topic, q.id, q.line, 'WARN', 'Explanation missing ✓ tick');
  }

  // Duplicate options
  const uniqueOpts = new Set(q.options);
  if (uniqueOpts.size !== q.options.length) {
    const dupes = q.options.filter((o, i) => q.options.indexOf(o) !== i);
    addIssue(topic, q.id, q.line, 'ERROR', `Duplicate options: ${dupes.join(', ')}`);
  }

  // Image file exists
  if (q.image) {
    const imgPath = 'public/images/questions/' + q.image;
    if (!fs.existsSync(imgPath)) {
      addIssue(topic, q.id, q.line, 'ERROR', `Image file missing: ${q.image}`);
    }
  }
}

function parseNum(s) {
  return parseFloat(String(s).replace(/[£%,\s]/g, ''));
}

function checkMaths(topic, q) {
  const qText = q.question;
  if (q.correct === null || q.correct >= q.options.length) return;
  const correctAnswer = q.options[q.correct];

  // Long Division / Long Multiplication: check the core operation
  if (topic === 'Long Division') {
    const divMatch = qText.match(/(\d[\d,]*)\s*÷\s*(\d[\d,]*)/);
    if (divMatch) {
      const a = parseNum(divMatch[1]);
      const b = parseNum(divMatch[2]);
      const expected = a / b;
      const ans = parseNum(correctAnswer);
      if (Math.abs(expected - ans) > 0.01) {
        addIssue(topic, q.id, q.line, 'ERROR', `${a} ÷ ${b} = ${expected}, but answer is ${correctAnswer}`);
      }
      if (!Number.isInteger(expected)) {
        addIssue(topic, q.id, q.line, 'WARN', `Non-integer: ${a} ÷ ${b} = ${expected}`);
      }
    }
  }

  if (topic === 'Long Multiplication') {
    const multMatch = qText.match(/(\d[\d,]*)\s*×\s*(\d[\d,]*)/);
    if (multMatch) {
      const a = parseNum(multMatch[1]);
      const b = parseNum(multMatch[2]);
      const expected = a * b;
      const ans = parseNum(correctAnswer);
      if (Math.abs(expected - ans) > 0.5) {
        addIssue(topic, q.id, q.line, 'ERROR', `${a} × ${b} = ${expected}, but answer is ${correctAnswer}`);
      }
    }
  }

  // Percentages: only simple "X% of Y" (not comparisons)
  if (topic === 'Percentages' && /^\d+%\s*of\s*\d/i.test(qText.replace(/.*?(\d+%\s*of)/, '$1'))) {
    const pctMatch = qText.match(/(\d+)%\s*of\s*([\d,.]+)/);
    if (pctMatch && !qText.includes(' or ') && !qText.includes('larger') && !qText.includes('smaller')) {
      const pct = parseFloat(pctMatch[1]);
      const val = parseNum(pctMatch[2]);
      const expected = pct / 100 * val;
      const ans = parseNum(correctAnswer);
      if (Math.abs(expected - ans) > 0.5) {
        addIssue(topic, q.id, q.line, 'ERROR', `${pct}% of ${val} = ${expected}, but answer is ${correctAnswer}`);
      }
    }
  }
}

// Run all checks
console.log('COMPREHENSIVE QUESTION REVIEW\n');
let totalQuestions = 0;

for (const topic of topicRanges) {
  const questions = extractQuestions(topic.start, topic.end);
  totalQuestions += questions.length;

  // Duplicate IDs
  const idCounts = {};
  for (const q of questions) {
    idCounts[q.id] = (idCounts[q.id] || 0) + 1;
  }
  for (const [id, count] of Object.entries(idCounts)) {
    if (count > 1) addIssue(topic.name, parseInt(id), 0, 'ERROR', `Duplicate ID (×${count})`);
  }

  // Duplicate questions
  const qTexts = {};
  for (const q of questions) {
    if (qTexts[q.question]) {
      addIssue(topic.name, q.id, q.line, 'ERROR', `Duplicate question (same as ID ${qTexts[q.question]})`);
    } else {
      qTexts[q.question] = q.id;
    }
  }

  for (const q of questions) {
    checkStructural(topic.name, q);
    checkMaths(topic.name, q);
  }

  console.log(`${topic.name}: ${questions.length} questions checked`);
}

console.log(`\nTotal: ${totalQuestions} questions reviewed\n`);

const errors = issues.filter(i => i.severity === 'ERROR');
const warns = issues.filter(i => i.severity === 'WARN');

console.log(`ERRORS: ${errors.length}`);
console.log(`WARNINGS: ${warns.length}\n`);

if (errors.length > 0) {
  console.log('=== ERRORS ===\n');
  for (const e of errors) {
    console.log(`[${e.topic}] ID ${e.id} (line ${e.line}): ${e.message}`);
  }
}

if (warns.length > 0) {
  console.log('\n=== WARNINGS ===\n');
  for (const w of warns) {
    console.log(`[${w.topic}] ID ${w.id} (line ${w.line}): ${w.message}`);
  }
}

const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.js');
const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

// Topic line ranges
const topicRanges = {
  'Percentages': [9, 1095],
  'Decimals': [1096, 2365],
  'Long Division': [2366, 3571],
  'Ratio & Proportion': [3572, 4900],
  'Fractions': [4901, 6105],
  'Long Multiplication': [6106, 7255],
  'Algebra': [7256, 8341],
  'Place Value': [8342, 9507],
  'Negative Numbers': [9508, 10593],
  'Prime Numbers': [10594, 11558],
  'Area & Perimeter': [11559, 12680],
  'Volume': [12681, 13786],
  'Angles & Shapes': [13787, 14877],
  'Sequences': [14878, 15946],
  'Data Handling': [15947, 17149],
  'Speed, Distance, Time': [17150, 18078]
};

let totalErrors = 0;

for (const [topic, [start, end]] of Object.entries(topicRanges)) {
  const errors = [];

  for (let i = start; i <= end; i++) {
    if (!lines[i] || !lines[i].match(/^\s*id:\s*\d+,/)) continue;

    const idMatch = lines[i].match(/id:\s*(\d+)/);
    if (!idMatch) continue;
    const id = parseInt(idMatch[1]);

    // Read difficulty, question, options, correct
    let question = '', optionsArr = [], correctIdx = -1, explanation = '';

    for (let j = i; j < Math.min(i + 10, end + 1); j++) {
      const qMatch = lines[j]?.match(/question:\s*"(.*)"/);
      if (qMatch) question = qMatch[1];

      const oMatch = lines[j]?.match(/options:\s*\[(.*)\]/);
      if (oMatch) {
        const optRegex = /"([^"]*)"/g;
        let om;
        while ((om = optRegex.exec(oMatch[1])) !== null) optionsArr.push(om[1]);
      }

      const cMatch = lines[j]?.match(/correct:\s*(\d+)/);
      if (cMatch) correctIdx = parseInt(cMatch[1]);

      const eMatch = lines[j]?.match(/explanation:\s*"(.*)"/);
      if (eMatch) explanation = eMatch[1];
    }

    if (optionsArr.length === 0 || correctIdx < 0) continue;

    // Validation checks

    // 1. correct index out of bounds
    if (correctIdx >= optionsArr.length) {
      errors.push(`ID ${id} (line ${i}): correct index ${correctIdx} out of bounds (${optionsArr.length} options)`);
      continue;
    }

    // 2. Duplicate options
    const unique = new Set(optionsArr);
    if (unique.size !== optionsArr.length) {
      const dupes = optionsArr.filter((v, idx) => optionsArr.indexOf(v) !== idx);
      errors.push(`ID ${id} (line ${i}): duplicate options: ${dupes.join(', ')}`);
    }

    // 3. Check for common issues: explanation mentions a different answer than correct option
    const correctOption = optionsArr[correctIdx];

    // 4. For percentage questions - basic check
    if (topic === 'Percentages') {
      // Check "X% of Y" patterns
      const pctMatch = question.match(/(\d+)%\s+of\s+(\d[\d,]*)/);
      if (pctMatch) {
        const pct = parseInt(pctMatch[1]);
        const total = parseInt(pctMatch[2].replace(/,/g, ''));
        const result = (pct / 100) * total;
        const correctNum = parseFloat(correctOption.replace(/[^0-9.]/g, ''));
        if (Math.abs(result - correctNum) > 0.01) {
          errors.push(`ID ${id} (line ${i}): ${pct}% of ${total} = ${result}, but answer says "${correctOption}"`);
        }
      }
    }

    // 5. For negative numbers - check basic arithmetic
    if (topic === 'Negative Numbers') {
      // Check addition/subtraction with negatives
      const addMatch = question.match(/(-?\d+)\s*\+\s*\(?(-?\d+)\)?/);
      const subMatch = question.match(/(-?\d+)\s*[−–-]\s*\(?(-?\d+)\)?/);

      if (addMatch && question.includes('What is') && !question.includes('temperature')) {
        const a = parseInt(addMatch[1]);
        const b = parseInt(addMatch[2]);
        const result = a + b;
        const correctNum = parseInt(correctOption);
        if (!isNaN(correctNum) && correctNum !== result) {
          errors.push(`ID ${id} (line ${i}): ${a} + ${b} = ${result}, but answer says "${correctOption}"`);
        }
      }
    }

    // 6. Check explanations don't contain debugging text
    const debugPatterns = [
      { pattern: /\bwait\b/i, label: 'wait' },
      { pattern: /\bactually\b/i, label: 'actually' },
      { pattern: /\bhmm\b/i, label: 'hmm' },
      { pattern: /let me verify/i, label: 'Let me verify' },
      { pattern: /let me check/i, label: 'Let me check' },
      { pattern: /author note/i, label: 'Author note' },
      { pattern: /I need to/i, label: 'I need to' },
    ];

    for (const { pattern, label } of debugPatterns) {
      if (pattern.test(explanation)) {
        errors.push(`ID ${id} (line ${i}): explanation contains "${label}"`);
        break;
      }
    }
  }

  if (errors.length > 0) {
    console.log(`\n=== ${topic} (${errors.length} issues) ===`);
    errors.forEach(e => console.log(`  ${e}`));
    totalErrors += errors.length;
  }
}

console.log(`\n\nTOTAL ISSUES: ${totalErrors}`);

const fs = require('fs');
const content = fs.readFileSync('src/App.js', 'utf8');
const lines = content.split('\n');

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

console.log('=== DUPLICATE IDs WITHIN TOPICS ===');
for (const [topic, [start, end]] of Object.entries(topicRanges)) {
  const ids = [];
  for (let i = start; i <= end; i++) {
    const m = lines[i]?.match(/^\s*id:\s*(\d+),/);
    if (m) ids.push({ id: parseInt(m[1]), line: i });
  }

  const seen = new Map();
  for (const { id, line } of ids) {
    if (seen.has(id)) {
      console.log(`  ${topic}: ID ${id} duplicated at lines ${seen.get(id)} and ${line}`);
    }
    seen.set(id, line);
  }
}

console.log('\n=== DUPLICATE QUESTIONS (same text) WITHIN TOPICS ===');
for (const [topic, [start, end]] of Object.entries(topicRanges)) {
  const questions = [];
  for (let i = start; i <= end; i++) {
    const m = lines[i]?.match(/question:\s*"(.+)"/);
    if (m) {
      // Find the id
      let id = '?';
      for (let j = i - 3; j < i; j++) {
        const idMatch = lines[j]?.match(/id:\s*(\d+)/);
        if (idMatch) { id = idMatch[1]; break; }
      }
      questions.push({ text: m[1], id, line: i });
    }
  }

  const seen = new Map();
  for (const q of questions) {
    if (seen.has(q.text)) {
      const prev = seen.get(q.text);
      console.log(`  ${topic}: "${q.text.substring(0, 60)}..." duplicated (IDs ${prev.id} and ${q.id})`);
    }
    seen.set(q.text, q);
  }
}

console.log('\n=== QUESTION COUNTS PER TOPIC ===');
let total = 0;
for (const [topic, [start, end]] of Object.entries(topicRanges)) {
  let count = 0;
  for (let i = start; i <= end; i++) {
    if (lines[i]?.match(/^\s*id:\s*\d+,/)) count++;
  }
  console.log(`  ${topic}: ${count}`);
  total += count;
}
console.log(`  TOTAL: ${total}`);

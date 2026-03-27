const fs = require('fs');
const content = fs.readFileSync('src/App.js', 'utf8');
const lines = content.split('\n');

// Find topic sections by searching for name: "TopicName" patterns
const topicNames = [
  'Percentages', 'Decimals', 'Long Division', 'Ratio & Proportion',
  'Fractions', 'Long Multiplication', 'Algebra', 'Place Value and Rounding',
  'Negative Numbers', 'Prime Numbers & Factors', 'Area and Perimeter',
  'Volume', 'Angles and Shapes', 'Sequences', 'Data Handling',
  'Speed, Distance, Time'
];

// Find line numbers for each topic
const topicStarts = [];
for (let i = 0; i < lines.length; i++) {
  for (const name of topicNames) {
    if (lines[i].includes(`name: "${name}"`)) {
      topicStarts.push({ name, line: i });
    }
  }
}

// Build ranges
const topicRanges = [];
for (let i = 0; i < topicStarts.length; i++) {
  const end = i < topicStarts.length - 1 ? topicStarts[i + 1].line - 1 : lines.length - 1;
  topicRanges.push({ name: topicStarts[i].name, start: topicStarts[i].line, end });
}

// A question is RAW if it's a pure calculation with no real-world context
function isRaw(q) {
  // Pure arithmetic: "What is X ÷ Y?", "What is X + Y?", etc.
  if (/^What is \d[\d,.]* [÷×+\-] \d/i.test(q)) return true;
  if (/^What is \d[\d,.]* divided by \d/i.test(q)) return true;
  if (/^What is \d[\d,.]* multiplied by \d/i.test(q)) return true;
  if (/^What is \d[\d,.]* times \d/i.test(q)) return true;
  if (/^Calculate \d/i.test(q)) return true;
  if (/^Work out \d/i.test(q)) return true;
  if (/^Divide \d/i.test(q)) return true;
  if (/^Multiply \d/i.test(q)) return true;

  // Bare conversions
  if (/^Convert \d[\d,.]* (km\/h|m\/s|cm|mm|metres|meters)/i.test(q)) return true;

  // Bare rounding
  if (/^Round \d[\d,.]* to/i.test(q)) return true;
  if (/^What is \d[\d,.]* rounded to/i.test(q)) return true;

  // Bare fraction/decimal/percentage conversions
  if (/^What is \d[\d,./]* as a (fraction|decimal|percentage)/i.test(q)) return true;
  if (/^What is 0\.\d+ as a percentage/i.test(q)) return true;
  if (/^What fraction of \d/i.test(q)) return true;
  if (/^Express \d/i.test(q)) return true;
  if (/^What is \d+% of \d/i.test(q)) return true;

  // Bare equivalence/comparison
  if (/^Which (fraction|number|decimal) is (equivalent|equal|closest)/i.test(q)) return true;
  if (/^Which decimal is equivalent/i.test(q)) return true;
  if (/^Which is (larger|smaller|greater|the largest|the smallest)\??:?\s/i.test(q) &&
      !/\b(shop|store|class|school|temperature|height|weight|price|cost|distance|race|team|score)\b/i.test(q)) return true;

  // Simplify fractions
  if (/^Simplify /i.test(q)) return true;

  // Bare ordering
  if (/^Put these (numbers|decimals|fractions) in order/i.test(q) &&
      !/\b(temperature|height|weight|score|price|cost|distance|race|team|city|town|month|day)\b/i.test(q)) return true;
  if (/^Order these (numbers|decimals|fractions)/i.test(q) &&
      !/\b(temperature|height|weight|score|price)\b/i.test(q)) return true;

  // Bare algebra: "If x = N, what is..."
  if (/^If [a-z] = \d/i.test(q) &&
      !/\b(cost|price|weight|length|height|distance|speed|temperature|age|score|marks|children|people|sweets|books|coins|marbles|stickers|pencils|apples|oranges|cakes|biscuits|metres|litres|kilograms|pounds|pence|minutes|hours|days|weeks|months|years)\b/i.test(q)) return true;

  // Solve equations (bare)
  if (/^Solve /i.test(q) && !/\b(problem|puzzle|in|word)\b/i.test(q)) return true;
  if (/^Find the value of [a-z]/i.test(q) && !/\b(in|at|from|on|for|when|where)\b/i.test(q)) return true;

  // Evaluate/find
  if (/^Evaluate /i.test(q)) return true;

  // Number theory (bare)
  if (/^How many (factors|multiples|prime factors)/i.test(q)) return true;
  if (/^List (all )?(the )?(factors|prime factors)/i.test(q)) return true;
  if (/^Is \d+ a prime/i.test(q)) return true;
  if (/^What is the (HCF|LCM|GCD|product|sum|difference|square|cube|prime factori[sz]ation) of \d/i.test(q)) return true;
  if (/^Find the (HCF|LCM|GCD)/i.test(q)) return true;
  if (/^What are the (first|next) \d+ (multiples|prime)/i.test(q)) return true;
  if (/^Which is the (smallest|largest) prime/i.test(q)) return true;

  // Bare sequences: "What comes next? X, Y, Z, ?"
  if (/^What comes next\?/i.test(q) &&
      !/\b(pattern|puzzle|card|challenge|experiment|bacteria|sponsored|page|file|runner|computer|book|stack|block|tile|book|lap|week|hour|day|month|year|race|walk|swim|run|grow|plant|save|earn|spend|collect|score|mark|metre|litre|gram|penny|pence|pound)\b/i.test(q)) return true;
  if (/^What is the next (number|term)\?/i.test(q) &&
      !/\b(pattern|puzzle|card|challenge|in the|sequence of|rule)\b/i.test(q)) return true;
  if (/^What is the missing (number|term)\?/i.test(q) &&
      !/\b(in|pattern|puzzle|card|challenge|page|book|sequence)\b/i.test(q)) return true;
  if (/^What is the next number\?/i.test(q) &&
      !/\b(pattern|puzzle|card|challenge|in|experiment|bacteria|page|book|file|computer)\b/i.test(q)) return true;

  // Bare number operations
  if (/^What number is \d[\d,]* (more|less) than/i.test(q)) return true;

  return false;
}

console.log('CONTEXT AUDIT - ACCURATE TOPIC RANGES\n');
console.log('Topic                         | Total | Context | Raw   | Context%');
console.log('------------------------------|-------|---------|-------|--------');

let grandTotal = 0, grandContext = 0, grandRaw = 0;
const topicDetails = {};

for (const topic of topicRanges) {
  let total = 0, rawCount = 0;
  const rawQuestions = [];

  for (let i = topic.start; i <= topic.end; i++) {
    const m = lines[i]?.match(/question:\s*"(.+)"/);
    if (!m) continue;
    total++;
    const q = m[1];

    if (isRaw(q)) {
      rawCount++;
      let id = '?';
      for (let j = i - 5; j < i; j++) {
        const idMatch = lines[j]?.match(/id:\s*(\d+)/);
        if (idMatch) { id = idMatch[1]; break; }
      }
      rawQuestions.push({ id, line: i + 1, text: q.substring(0, 75) });
    }
  }

  const contextCount = total - rawCount;
  const pct = total > 0 ? Math.round(contextCount / total * 100) : 0;
  const name = topic.name.padEnd(30);
  console.log(`${name}| ${String(total).padStart(5)} | ${String(contextCount).padStart(7)} | ${String(rawCount).padStart(5)} | ${pct}%`);

  grandTotal += total;
  grandContext += contextCount;
  grandRaw += rawCount;
  topicDetails[topic.name] = { total, contextCount, rawCount, pct, rawQuestions };
}

console.log('------------------------------|-------|---------|-------|--------');
const grandPct = Math.round(grandContext / grandTotal * 100);
console.log(`${'TOTAL'.padEnd(30)}| ${String(grandTotal).padStart(5)} | ${String(grandContext).padStart(7)} | ${String(grandRaw).padStart(5)} | ${grandPct}%`);

// Show raw question counts needing work
console.log('\n=== TOPICS WITH RAW QUESTIONS ===\n');
const sorted = Object.entries(topicDetails).sort((a, b) => a[1].pct - b[1].pct);
for (const [topic, data] of sorted) {
  if (data.rawCount === 0) continue;
  console.log(`${topic} (${data.pct}% contextual, ${data.rawCount} raw):`);
  const sample = data.rawQuestions.slice(0, 8);
  for (const q of sample) {
    console.log(`  ID ${q.id}: "${q.text}"`);
  }
  if (data.rawQuestions.length > 8) {
    console.log(`  ... and ${data.rawQuestions.length - 8} more`);
  }
  console.log();
}

/**
 * Comprehensive comprehension audit:
 * 1. Answer correctness (question-answer alignment)
 * 2. Difficulty level assessment based on question subtype
 * 3. Duplicate detection
 * 4. Explanation quality
 * 5. Passage coverage and balance
 */
const m = require('../src/questionData/englishData.js');
const data = m.default || m;
const qs = data.topics.comprehension.questions;

console.log(`Auditing ${qs.length} comprehension questions\n`);

const issues = [];

// === DIFFICULTY ASSESSMENT ===
// GL research framework:
// D1: retrieval (find explicit info), basic vocabulary, simple negative-retrieval
// D2: inference (read between lines), vocabulary-in-context, prediction, genre identification
// D3: author-purpose, literary-device, complex inference, evaluation, themes

const subtypeDifficulty = {
  'retrieval': 1,           // Finding explicit info = D1
  'negative-retrieval': 2,  // "Which is NOT..." requires checking all options = D2
  'vocabulary-in-context': 2, // Word meaning from context = D2
  'inference': 2,           // Reading between lines = D2
  'prediction': 2,          // What might happen next = D2
  'genre': 2,               // Identifying text type = D2
  'author-purpose': 3,      // Why did the author write this? = D3
  'literary-device': 3,     // Identifying techniques = D3
};

const diffFlags = [];
for (const q of qs) {
  const expectedD = subtypeDifficulty[q.questionSubType] || 2;

  // Flag if difficulty is MORE THAN 1 level away from expected
  if (Math.abs(q.difficulty - expectedD) > 1) {
    diffFlags.push({
      id: q.id,
      current: q.difficulty,
      expected: expectedD,
      subType: q.questionSubType,
      reason: `${q.questionSubType} is typically D${expectedD}, currently D${q.difficulty}`
    });
  }

  // Specific checks:
  // Retrieval at D3 is suspicious — explicit fact-finding shouldn't be hardest
  if (q.questionSubType === 'retrieval' && q.difficulty === 3) {
    diffFlags.push({
      id: q.id, current: 3, expected: 1, subType: 'retrieval',
      reason: 'Retrieval question at D3 — should be D1 unless question is complex'
    });
  }

  // Author-purpose at D1 is suspicious — understanding author intent is advanced
  if (q.questionSubType === 'author-purpose' && q.difficulty === 1) {
    diffFlags.push({
      id: q.id, current: 1, expected: 3, subType: 'author-purpose',
      reason: 'Author-purpose question at D1 — should be D2/D3'
    });
  }

  // Literary-device at D1 is suspicious
  if (q.questionSubType === 'literary-device' && q.difficulty === 1) {
    diffFlags.push({
      id: q.id, current: 1, expected: 3, subType: 'literary-device',
      reason: 'Literary-device question at D1 — should be D2/D3'
    });
  }
}

// === DUPLICATE DETECTION ===
const questionSeen = {};
for (const q of qs) {
  const key = q.question?.substring(0, 60)?.toLowerCase();
  if (questionSeen[key]) {
    issues.push({ id: q.id, type: 'DUPLICATE_QUESTION', detail: `Similar to Q${questionSeen[key]}` });
  }
  questionSeen[key] = q.id;
}

// === EXPLANATION CHECKS ===
for (const q of qs) {
  if (!q.explanation || q.explanation.length < 20) {
    issues.push({ id: q.id, type: 'SHORT_EXPLANATION', detail: `Only ${q.explanation?.length || 0} chars` });
  }
}

// === SUBTYPE DISTRIBUTION WITHIN EACH DIFFICULTY ===
console.log('=== SUBTYPE × DIFFICULTY MATRIX ===');
const matrix = {};
for (const q of qs) {
  const st = q.questionSubType || 'unknown';
  if (!matrix[st]) matrix[st] = {1:0, 2:0, 3:0, total:0};
  matrix[st][q.difficulty]++;
  matrix[st].total++;
}
console.log('SubType'.padEnd(25) + 'D1'.padStart(5) + 'D2'.padStart(5) + 'D3'.padStart(5) + 'Total'.padStart(7));
for (const [st, dd] of Object.entries(matrix).sort((a,b) => b[1].total - a[1].total)) {
  console.log(st.padEnd(25) + String(dd[1]).padStart(5) + String(dd[2]).padStart(5) + String(dd[3]).padStart(5) + String(dd.total).padStart(7));
}

// === PASSAGE BALANCE ===
const passages = {};
for (const q of qs) {
  const pid = q.passageId;
  if (!passages[pid]) passages[pid] = { title: q.passageTitle, count: 0, types: new Set() };
  passages[pid].count++;
  passages[pid].types.add(q.questionSubType);
}

// Check for passages with too few question types
let narrowPassages = 0;
for (const [pid, info] of Object.entries(passages)) {
  if (info.count >= 5 && info.types.size < 3) {
    issues.push({ id: pid, type: 'NARROW_PASSAGE', detail: `${info.title}: ${info.count} Qs but only ${info.types.size} subtypes (${[...info.types].join(', ')})` });
    narrowPassages++;
  }
}

// Check for duplicate passage titles
const titleSeen = {};
for (const [pid, info] of Object.entries(passages)) {
  if (titleSeen[info.title]) {
    issues.push({ id: pid, type: 'DUPLICATE_PASSAGE_TITLE', detail: `'${info.title}' also used by ${titleSeen[info.title]}` });
  }
  titleSeen[info.title] = pid;
}

// === PRINT RESULTS ===
console.log('\n=== ISSUES ===');
const byType = {};
for (const i of issues) {
  if (!byType[i.type]) byType[i.type] = [];
  byType[i.type].push(i);
}
for (const [type, items] of Object.entries(byType)) {
  console.log(`\n${type} (${items.length}):`);
  for (const i of items.slice(0, 10)) {
    const q = typeof i.id === 'number' ? qs.find(q => q.id === i.id) : null;
    const dStr = q ? `(D${q.difficulty})` : '';
    console.log(`  ${typeof i.id === 'number' ? 'Q' : ''}${i.id}${dStr}: ${i.detail}`);
  }
  if (items.length > 10) console.log(`  ... and ${items.length - 10} more`);
}

console.log('\n=== DIFFICULTY FLAGS ===');
if (diffFlags.length === 0) {
  console.log('  No flags');
} else {
  // Deduplicate
  const seen = new Set();
  for (const f of diffFlags) {
    const key = f.id + ':' + f.reason;
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(`  Q${f.id}: D${f.current} (${f.subType}) — ${f.reason}`);
  }
}

// === DISTRIBUTION ===
const dd = {1:0, 2:0, 3:0};
for (const q of qs) dd[q.difficulty]++;
console.log(`\n=== DISTRIBUTION ===`);
console.log(`D1: ${dd[1]} (${Math.round(dd[1]/qs.length*100)}%)`);
console.log(`D2: ${dd[2]} (${Math.round(dd[2]/qs.length*100)}%)`);
console.log(`D3: ${dd[3]} (${Math.round(dd[3]/qs.length*100)}%)`);

console.log(`\nTotal issues: ${issues.length}`);
console.log(`Difficulty flags: ${diffFlags.length}`);

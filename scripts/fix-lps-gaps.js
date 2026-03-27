const fs = require('fs');
const path = require('path');

const VR_DATA = path.join(__dirname, '..', 'src/questionData/vrData.js');
const VR_MAP = path.join(__dirname, '..', 'public/vr-question-lesson-map.json');
let content = fs.readFileSync(VR_DATA, 'utf8');
let vrMap = JSON.parse(fs.readFileSync(VR_MAP, 'utf8'));

const newQuestions = [
  // skip-one-pattern: 3 new (Q126-Q128) — letters skip by 2 positions
  {
    id: 126, difficulty: 1,
    question: "What comes next in this letter series? C, E, G, I, ___",
    options: ["J", "K", "L", "H", "M"], correct: 1,
    explanation: "Each letter skips one: C(+2)→E(+2)→G(+2)→I(+2)→K. The pattern is +2 each time. Tip: Convert letters to numbers (A=1, B=2...) to spot the pattern more easily! ✓",
    _sc: 'skip-one-pattern'
  },
  {
    id: 127, difficulty: 2,
    question: "What comes next in this letter pair series? BD, DF, FH, HJ, ___",
    options: ["IK", "JL", "JK", "IJ", "KL"], correct: 1,
    explanation: "Both letters skip one each step: B(+2)→D(+2)→F(+2)→H(+2)→J. D(+2)→F(+2)→H(+2)→J(+2)→L. Answer: JL. Tip: Look at the first and second letters separately — they might follow different rules. ✓",
    _sc: 'skip-one-pattern'
  },
  {
    id: 128, difficulty: 3,
    question: "What comes next in this letter series? M, K, I, G, ___",
    options: ["F", "E", "D", "H", "C"], correct: 1,
    explanation: "Each letter skips one going backwards: M(-2)→K(-2)→I(-2)→G(-2)→E. The pattern is -2 each time. Tip: Use EJOTY (E=5, J=10, O=15, T=20, Y=25) as anchor points for counting. ✓",
    _sc: 'skip-one-pattern'
  },

  // reverse-alphabet: 4 new (Q129-Q132) — letters going backwards
  {
    id: 129, difficulty: 1,
    question: "What comes next in this letter series? J, I, H, G, ___",
    options: ["E", "F", "D", "H", "I"], correct: 1,
    explanation: "The letters go backwards by 1 each time: J(-1)→I(-1)→H(-1)→G(-1)→F. It's the alphabet in reverse! Tip: Check your answer works with ALL the pairs, not just the last two. ✓",
    _sc: 'reverse-alphabet'
  },
  {
    id: 130, difficulty: 2,
    question: "What comes next in this letter pair series? ZZ, YY, XX, WW, ___",
    options: ["VV", "UU", "VW", "WX", "UV"], correct: 0,
    explanation: "Both letters decrease by 1 each step: Z(-1)→Y(-1)→X(-1)→W(-1)→V. Both letters match, so the answer is VV. Tip: In the exam, if you're stuck, try the most common pattern first: both letters +1 or +2. ✓",
    _sc: 'reverse-alphabet'
  },
  {
    id: 131, difficulty: 2,
    question: "What comes next in this letter pair series? TR, QO, NL, KI, ___",
    options: ["HF", "HG", "IF", "GE", "JH"], correct: 0,
    explanation: "Both letters decrease by 3 each step: T(-3)→Q(-3)→N(-3)→K(-3)→H. R(-3)→O(-3)→L(-3)→I(-3)→F. Answer: HF. Tip: Write the alphabet out and count the jumps between letters to find the pattern. ✓",
    _sc: 'reverse-alphabet'
  },
  {
    id: 132, difficulty: 3,
    question: "What comes next in this letter pair series? YX, WV, UT, SR, ___",
    options: ["QP", "RQ", "PO", "QR", "RP"], correct: 0,
    explanation: "Both letters decrease by 2 each step: Y(-2)→W(-2)→U(-2)→S(-2)→Q. X(-2)→V(-2)→T(-2)→R(-2)→P. The gap within each pair stays at 1. Answer: QP. Tip: Watch for letters going in opposite directions — one forward, one backward. ✓",
    _sc: 'reverse-alphabet'
  },
];

// Find end of letterPairSeries last question
const lpStart = content.indexOf('letterPairSeries');
const lpNext = content.indexOf('numberSeries', lpStart);
const lpSection = content.substring(lpStart, lpNext);
const lastBrace = lpSection.lastIndexOf('}');
const insertPos = lpStart + lastBrace + 1;

console.log('Inserting', newQuestions.length, 'new questions at position', insertPos);

const qStr = newQuestions.map(q => {
  const os = q.options.map(o => '"' + o + '"').join(', ');
  return `        {\n          "id": ${q.id},\n          "difficulty": ${q.difficulty},\n          "question": "${q.question}",\n          "options": [${os}],\n          "correct": ${q.correct},\n          "explanation": "${q.explanation}"\n        }`;
}).join(',\n');

content = content.substring(0, insertPos) + ',\n' + qStr + content.substring(insertPos);

// Update mapping
const existingCount = Object.keys(vrMap.letterPairSeries).length;
let idx = existingCount;
newQuestions.forEach(q => {
  vrMap.letterPairSeries[String(idx)] = { questionId: q.id, subConceptId: q._sc, confidence: 'high' };
  idx++;
});

// Verify
const newLpStart = content.indexOf('letterPairSeries');
const newLpNext = content.indexOf('numberSeries', newLpStart);
const newSection = content.substring(newLpStart, newLpNext);
const ids = [...newSection.matchAll(/["']?id["']?\s*:\s*(\d+)/g)].map(m => +m[1]);
console.log('Total questions:', ids.length);

const groups = {};
Object.values(vrMap.letterPairSeries).forEach(e => { if(!groups[e.subConceptId])groups[e.subConceptId]=0; groups[e.subConceptId]++; });
let allOk = true;
Object.entries(groups).sort((a,b)=>a[1]-b[1]).forEach(([sc,c]) => {
  const flag = c < 15 ? ' <-- BELOW 15' : ' ✓';
  console.log('  ' + sc + ': ' + c + flag);
  if (c < 15) allOk = false;
});
console.log('All groups >= 15:', allOk ? 'YES ✓' : 'NO');

fs.writeFileSync(VR_DATA, content, 'utf8');
fs.writeFileSync(VR_MAP, JSON.stringify(vrMap, null, 2), 'utf8');
console.log('\nWritten ✓');

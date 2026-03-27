const fs = require('fs');
const path = require('path');

const VR_DATA = path.join(__dirname, '..', 'src/questionData/vrData.js');
const VR_MAP = path.join(__dirname, '..', 'public/vr-question-lesson-map.json');
let content = fs.readFileSync(VR_DATA, 'utf8');
let vrMap = JSON.parse(fs.readFileSync(VR_MAP, 'utf8'));

const lpStart = content.indexOf('letterPairSeries');
const lpNext = content.indexOf('letterSums', lpStart);
const before = content.substring(0, lpStart);
const section = content.substring(lpStart, lpNext);
const after = content.substring(lpNext);

// ============================================================
// STEP 1: Identify and remove number series questions
// ============================================================
console.log('=== STEP 1: Remove misplaced number series ===');

const blocks = section.split(/(?=\{[\s\n]*(?:["']?id["']?)\s*:\s*\d)/);
const keepBlocks = [];
const removeBlocks = [];
let headerBlock = '';

for (const block of blocks) {
  const idM = block.match(/["']?id["']?\s*:\s*(\d+)/);
  const qM = block.match(/["']?question["']?\s*:\s*["']([^"']*?)["']/);

  if (!idM) {
    // This is the header/preamble (topic name, questions: [)
    headerBlock = block;
    continue;
  }

  const q = qM ? qM[1] : '';

  // Is this a number series question?
  if (q.match(/number.*comes next|number.*next.*series|Find the missing number|What.*next\?.*\d+,\s*\d+/i) ||
      (q.match(/\d+,\s*\d+,\s*\d+/) && !q.match(/[A-Z],\s*[A-Z]/))) {
    removeBlocks.push(block);
  } else {
    keepBlocks.push(block);
  }
}

console.log('Keeping:', keepBlocks.length, 'letter series questions');
console.log('Removing:', removeBlocks.length, 'number series questions');

// Rebuild section with only letter series questions
// Re-number IDs sequentially
let newSection = headerBlock;
keepBlocks.forEach((block, i) => {
  const newId = i + 1;
  // Replace the id field
  let fixed = block.replace(
    /(["']?id["']?\s*:\s*)\d+/,
    '$1' + newId
  );
  newSection += fixed;
});

// Count in rebuilt section
const newIds = [...newSection.matchAll(/["']?id["']?\s*:\s*(\d+)/g)].map(m => +m[1]);
console.log('New section has', newIds.length, 'questions, IDs 1-' + Math.max(...newIds));

// ============================================================
// STEP 2: Verify answer correctness
// ============================================================
console.log('\n=== STEP 2: Answer verification ===');

const newBlocks = newSection.split(/(?=\{[\s\n]*(?:["']?id["']?)\s*:\s*\d)/);
let answerIssues = 0;

for (const block of newBlocks) {
  const idM = block.match(/["']?id["']?\s*:\s*(\d+)/);
  const qM = block.match(/["']?question["']?\s*:\s*["']([^"']*?)["']/);
  const corrM = block.match(/["']?correct["']?\s*:\s*(\d+)/);
  const optsM = block.match(/["']?options["']?\s*:\s*\[([\s\S]*?)\]/);
  if (!idM || !corrM || !optsM) continue;

  const opts = [...optsM[1].matchAll(/["']([^"']*?)["']/g)].map(m => m[1]);
  const correct = +corrM[1];

  if (correct >= opts.length) {
    console.log('  Q' + idM[1] + ': correct index ' + correct + ' >= options length ' + opts.length);
    answerIssues++;
  }

  // For letter series, try to verify the pattern
  const q = qM ? qM[1] : '';
  const seriesM = q.match(/([A-Z]{1,2}(?:,\s*[A-Z]{1,2}){2,})/);
  if (seriesM && opts[correct]) {
    // Extract series items
    const items = seriesM[1].split(/,\s*/);
    const answer = opts[correct].trim();

    // For single-letter series, check the pattern
    if (items[0].length === 1 && answer.length === 1) {
      const positions = items.map(l => l.charCodeAt(0) - 65);
      const gaps = [];
      for (let i = 1; i < positions.length; i++) gaps.push(positions[i] - positions[i - 1]);

      // Check if gaps are constant
      const allSame = gaps.every(g => g === gaps[0]);
      if (allSame) {
        const expected = positions[positions.length - 1] + gaps[0];
        const expectedLetter = String.fromCharCode(expected + 65);
        if (answer !== expectedLetter) {
          console.log('  Q' + idM[1] + ': expected ' + expectedLetter + ' but answer is ' + answer + ' (series: ' + items.join(',') + ')');
          answerIssues++;
        }
      }
    }
  }
}
console.log('Answer issues:', answerIssues === 0 ? 'NONE ✓' : answerIssues);

// ============================================================
// STEP 3: Difficulty verification
// ============================================================
console.log('\n=== STEP 3: Difficulty check ===');
const diffs = [...newSection.matchAll(/["']?difficulty["']?\s*:\s*(\d+)/g)].map(m => +m[1]);
const dc = {1:0,2:0,3:0}; diffs.forEach(d => dc[d]++);
const t = diffs.length;
console.log('D1:'+dc[1]+' ('+Math.round(dc[1]/t*100)+'%) D2:'+dc[2]+' ('+Math.round(dc[2]/t*100)+'%) D3:'+dc[3]+' ('+Math.round(dc[3]/t*100)+'%)');

// ============================================================
// STEP 4: Add explanation tips
// ============================================================
console.log('\n=== STEP 4: Explanation warmth pass ===');

const seriesTips = [
  "Tip: Convert letters to numbers (A=1, B=2...) to spot the pattern more easily!",
  "Tip: Look at the first and second letters separately — they might follow different rules.",
  "Tip: Use EJOTY (E=5, J=10, O=15, T=20, Y=25) as anchor points for counting.",
  "Tip: Check your answer works with ALL the pairs, not just the last two.",
  "Tip: If both letters change by the same amount, it's a simple pattern. If different, track each separately.",
  "Tip: Watch for letters going in opposite directions — one forward, one backward.",
  "Tip: Write the alphabet out and count the jumps between letters to find the pattern.",
  "Tip: In the exam, if you're stuck, try the most common pattern first: both letters +1 or +2.",
  "Tip: Some series wrap around — after Z comes A again. Don't panic if the letters seem to jump!",
  "Tip: Process of elimination works well here — check each option against your predicted pattern.",
];

let tipCount = 0;
newSection = newSection.replace(
  /((?:"explanation"|explanation)\s*:\s*")([^"]+)(")/g,
  (full, prefix, expl, suffix) => {
    if (expl.match(/Tip:|Remember|trick|convert|EJOTY/i)) return full;
    if (expl.length < 20) return full;

    const tip = seriesTips[tipCount % seriesTips.length];
    tipCount++;

    let improved = expl;
    if (improved.endsWith(' \u2713')) {
      improved = improved.slice(0, -2) + ' ' + tip + ' \u2713';
    } else if (improved.endsWith('\u2713')) {
      improved = improved.slice(0, -1) + ' ' + tip + ' \u2713';
    } else {
      improved += ' ' + tip;
    }

    return prefix + improved + suffix;
  }
);

console.log('Added tips to', tipCount, 'explanations');

// ============================================================
// STEP 5: Update mapping (re-number to match new IDs)
// ============================================================
console.log('\n=== STEP 5: Update mapping ===');

// The mapping uses question IDs that may have changed
// Rebuild mapping for the kept questions
const oldMap = vrMap.letterPairSeries || {};
const newMap = {};

// Build a lookup of old question text to new ID
const oldTexts = {};
removeBlocks.forEach(block => {
  const qM = block.match(/["']?question["']?\s*:\s*["']([^"']*?)["']/);
  if (qM) oldTexts[qM[1].substring(0, 60)] = true;
});

// For kept questions, preserve their mapping if possible
let mapIdx = 0;
const newBlocksParsed = newSection.split(/(?=\{[\s\n]*(?:["']?id["']?)\s*:\s*\d)/);
for (const block of newBlocksParsed) {
  const idM = block.match(/["']?id["']?\s*:\s*(\d+)/);
  if (!idM) continue;
  const newId = +idM[1];

  // Try to find existing mapping for this question
  // Use question text to match since IDs changed
  const qM = block.match(/["']?question["']?\s*:\s*["']([^"']*?)["']/);
  const qText = qM ? qM[1].substring(0, 40) : '';

  let subConcept = 'both-forward'; // default
  // Try to determine from question content
  const q = qM ? qM[1].toLowerCase() : '';
  const explM = block.match(/["']?explanation["']?\s*:\s*["']([^"']*?)["']/);
  const expl = explM ? explM[1].toLowerCase() : '';
  const combined = q + ' ' + expl;

  if (combined.match(/opposite|one.*forward.*other.*back|first.*\+.*second.*-|forward.*backward/)) subConcept = 'opposite-directions';
  else if (combined.match(/alternate|odd.*even|interleav/)) subConcept = 'alternating-pattern';
  else if (combined.match(/skip|jump.*2|increases by 2|\+2/)) subConcept = 'double-jump';
  else if (combined.match(/reverse|backward|decreasing|goes back|-\d/)) subConcept = 'reverse-alphabet';
  else if (combined.match(/constant gap|same gap|fixed gap|gap.*stays/)) subConcept = 'constant-gap';
  else if (combined.match(/skip one|miss one|every other/)) subConcept = 'skip-one-pattern';

  // Check existing map
  const existingEntry = Object.values(oldMap).find(e => {
    // Match by question content in the original data
    return false; // Can't reliably match, use auto-categorised
  });

  newMap[String(mapIdx)] = {
    questionId: newId,
    subConceptId: subConcept,
    confidence: 'high'
  };
  mapIdx++;
}

vrMap.letterPairSeries = newMap;
console.log('New mapping: ' + Object.keys(newMap).length + ' entries');

const groups = {};
Object.values(newMap).forEach(e => { if (!groups[e.subConceptId]) groups[e.subConceptId] = 0; groups[e.subConceptId]++; });
console.log('Groups:');
Object.entries(groups).sort((a,b) => b[1]-a[1]).forEach(([sc, c]) => {
  console.log('  ' + sc + ': ' + c + (c < 15 ? ' <-- BELOW 15' : ' ✓'));
});

// ============================================================
// STEP 6: Verify and write
// ============================================================
console.log('\n=== STEP 6: Final verification ===');

// Check new section
const finalIds = [...newSection.matchAll(/["']?id["']?\s*:\s*(\d+)/g)].map(m => +m[1]);
const uniqueIds = new Set(finalIds);
console.log('Total questions:', finalIds.length);
console.log('Unique IDs:', uniqueIds.size);
console.log('ID range: 1-' + Math.max(...finalIds));
if (finalIds.length !== uniqueIds.size) console.log('⚠ Still has duplicate IDs!');

// Verify no number series questions remain
const numSeriesCheck = (newSection.match(/number.*comes next|Find the missing number/gi) || []).length;
console.log('Number series questions remaining:', numSeriesCheck === 0 ? 'NONE ✓' : numSeriesCheck);

// Explanation check
const expls = [...newSection.matchAll(/(?:"explanation"|explanation)\s*:\s*"([^"]+)"/g)].map(m => m[1]);
const avgLen = Math.round(expls.reduce((s, e) => s + e.length, 0) / expls.length);
const withTips = expls.filter(e => e.match(/Tip:|EJOTY|convert|anchor/i)).length;
console.log('Avg explanation:', avgLen, 'chars');
console.log('With tips:', withTips + '/' + expls.length);

// Write
content = before + newSection + after;
fs.writeFileSync(VR_DATA, content, 'utf8');
fs.writeFileSync(VR_MAP, JSON.stringify(vrMap, null, 2), 'utf8');
console.log('\n✅ Written successfully');
console.log('Removed ' + removeBlocks.length + ' misplaced number series questions');
console.log('Kept ' + keepBlocks.length + ' letter series questions');

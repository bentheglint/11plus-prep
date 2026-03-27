/**
 * Fix compound word difficulty levels based on GL Assessment research
 * Also fixes Q8 (easychair is not a valid compound in British English)
 */
const fs = require('fs');
const filePath = 'C:/Users/Ben Jackson/Projects/11plus-prep/src/questionData/vrData.js';
let content = fs.readFileSync(filePath, 'utf8');

// Find compound words section boundaries
const cwStart = content.indexOf("compoundWords: {");
const hwStart = content.indexOf("hiddenWords: {");
const cwSection = content.substring(cwStart, hwStart);

// Difficulty changes: [id, oldDiff, newDiff, reason]
const changes = [
  // D3 → D2: common words wrongly marked as hard
  [3,  3, 2, "waterfall/waterproof — both common, everyday words"],
  [13, 3, 2, "footprint/footstep — both very common"],
  [19, 3, 2, "daytime/daybreak — 'daybreak' known to most children"],
  [78, 3, 2, "downstairs/downfall — 'downstairs' is extremely common"],
  [84, 3, 2, "shorthand/shortcut — 'shortcut' is common"],
  [86, 3, 2, "matchbox/matchstick — both everyday objects"],
  [92, 3, 2, "headphones/earphones — modern common words"],
  [97, 3, 2, "raindrop/teardrop — both common"],
  [119, 3, 2, "overlook — common word"],
  [122, 3, 2, "halfway — very common word"],
  [123, 3, 2, "nowhere — very common word"],

  // D2 → D1: very basic compounds wrongly marked as medium
  [12, 2, 1, "bedroom/classroom — extremely basic, every child knows"],
  [18, 2, 1, "blackberry/blackbird — both everyday words"],
  [72, 2, 1, "daylight/daydream — both common"],

  // D1 → D2: less obvious compounds wrongly marked as easy
  [37, 1, 2, "'plaything' is less common vocabulary"],
  [42, 1, 2, "'blacksmith' is not basic D1 vocabulary"],
  [43, 1, 2, "'tomboy' requires vocabulary knowledge"],

  // D2 → D3: advanced/obscure vocabulary wrongly marked as medium
  [67, 2, 3, "'fingerpost' is obscure — most adults don't know this word"],
  [74, 2, 3, "'panhandle' is American English, very obscure in UK"],
  [75, 2, 3, "'steadfast' is advanced D3 vocabulary"],
];

let changeCount = 0;

for (const [id, oldD, newD, reason] of changes) {
  // Find this question's difficulty in the compound words section
  // Need to handle both JS format (id: N) and JSON format ("id": N)

  // For IDs in the compound words section, find the difficulty line that follows
  const patterns = [
    // JS format: id: N, followed by difficulty: D
    new RegExp(`(id: ${id},\\s*\\n\\s*difficulty: )${oldD}`, 'g'),
    // JSON format: "id": N, followed by "difficulty": D
    new RegExp(`("id": ${id},\\s*\\n\\s*"difficulty": )${oldD}`, 'g'),
  ];

  let found = false;
  for (const pattern of patterns) {
    // Only replace within the compound words section
    const before = content.substring(0, cwStart);
    const section = content.substring(cwStart, hwStart);
    const after = content.substring(hwStart);

    const newSection = section.replace(pattern, `$1${newD}`);
    if (newSection !== section) {
      content = before + newSection + after;
      console.log(`Q${id}: D${oldD} → D${newD} (${reason})`);
      changeCount++;
      found = true;
      break;
    }
  }

  if (!found) {
    console.log(`⚠ Q${id}: NOT FOUND or already at D${newD}`);
  }
}

// Fix Q8: "easychair" is not a standard compound in British English
// Change from "arm" and "easy" to "arm" and "wheel"
const q8Old = `question: "Which word can go after both 'arm' and 'easy' to make two new words?",
                      options: [
                              "Rest",
                              "Chair",
                              "Band",
                              "Pit",
                              "Less"
                      ],
                      correct: 1,
                      explanation: "Arm + chair = armchair, easy + chair = easychair (an easy chair is a comfortable seat). ✓"`;

const q8New = `question: "Which word can go after both 'arm' and 'wheel' to make two new words?",
                      options: [
                              "Rest",
                              "Chair",
                              "Band",
                              "Pit",
                              "Less"
                      ],
                      correct: 1,
                      explanation: "Arm + chair = armchair, wheel + chair = wheelchair. Both are types of chair. ✓"`;

if (content.includes(q8Old)) {
  content = content.replace(q8Old, q8New);
  console.log(`Q8: Fixed 'easychair' → 'wheelchair' (easychair is not a standard compound)`);
  changeCount++;
} else {
  console.log(`⚠ Q8: Could not find exact match for replacement`);
}

fs.writeFileSync(filePath, content, 'utf8');

// Verify
delete require.cache[require.resolve('../src/questionData/vrData.js')];
const m = require('../src/questionData/vrData.js');
const qs = m.default?.topics?.compoundWords?.questions || m.topics?.compoundWords?.questions;
const dd = { 1: 0, 2: 0, 3: 0 };
const origDd = { 1: 0, 2: 0, 3: 0 };
const newDd = { 1: 0, 2: 0, 3: 0 };
for (const q of qs) {
  dd[q.difficulty]++;
  if (q.id <= 125) origDd[q.difficulty]++;
  else newDd[q.difficulty]++;
}

console.log(`\nChanges applied: ${changeCount}`);
console.log(`\nOriginal 125: D1=${origDd[1]}(${Math.round(origDd[1]/125*100)}%) D2=${origDd[2]}(${Math.round(origDd[2]/125*100)}%) D3=${origDd[3]}(${Math.round(origDd[3]/125*100)}%)`);
console.log(`New GL 40:    D1=${newDd[1]}(${Math.round(newDd[1]/40*100)}%) D2=${newDd[2]}(${Math.round(newDd[2]/40*100)}%) D3=${newDd[3]}(${Math.round(newDd[3]/40*100)}%)`);
console.log(`Total 165:    D1=${dd[1]}(${Math.round(dd[1]/165*100)}%) D2=${dd[2]}(${Math.round(dd[2]/165*100)}%) D3=${dd[3]}(${Math.round(dd[3]/165*100)}%)`);

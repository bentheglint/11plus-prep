// Apply comprehension answer-length bias fixes from Oracle batches
// Usage: node scripts/apply-length-fixes.js
//
// Reads JSON patch files from scripts/oracle-batch-*.json
// Applies new options to englishData.js questions by ID
// Verifies correct answers are unchanged

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'src', 'questionData', 'englishData.js');

// Read all batch files
const batchDir = path.join(__dirname);
const batchFiles = fs.readdirSync(batchDir)
  .filter(f => f.startsWith('oracle-batch-') && f.endsWith('.json'))
  .sort();

if (batchFiles.length === 0) {
  console.log('No oracle-batch-*.json files found in scripts/');
  process.exit(1);
}

// Merge all patches into a map of id -> options
const patches = new Map();
let totalPatches = 0;
for (const file of batchFiles) {
  const data = JSON.parse(fs.readFileSync(path.join(batchDir, file), 'utf8'));
  for (const item of data) {
    if (!item.id || !item.options || item.options.length !== 5) {
      console.error(`Invalid patch in ${file}: id=${item.id}, options=${item.options?.length}`);
      continue;
    }
    patches.set(item.id, item.options);
    totalPatches++;
  }
}
console.log(`Loaded ${totalPatches} patches from ${batchFiles.length} files`);

// Read the data file
let content = fs.readFileSync(DATA_FILE, 'utf8');

// Load the module to verify correct answers
const englishData = require(path.join(__dirname, '..', 'src', 'questionData', 'englishData.js'));
const ed = englishData.default || englishData;
const questions = ed.topics.comprehension.questions;

// Build a map of id -> question for verification
const qMap = new Map();
for (const q of questions) {
  qMap.set(q.id, q);
}

// Normalize curly quotes to straight quotes for comparison
function normalize(s) {
  return s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\u2014/g, '\u2014');
}

// Apply patches by finding each question's "options" block in the file by its "id"
let applied = 0;
let skipped = 0;
let errors = 0;

for (const [id, newOptions] of patches) {
  const q = qMap.get(id);
  if (!q) {
    console.error(`Q${id}: not found in comprehension questions`);
    errors++;
    continue;
  }

  // Verify correct answer is unchanged (normalize quotes for comparison)
  const correctIdx = q.correct;
  const originalCorrect = normalize(q.options[correctIdx]);
  const patchCorrect = normalize(newOptions[correctIdx]);

  if (originalCorrect !== patchCorrect) {
    console.error(`Q${id}: CORRECT ANSWER CHANGED!`);
    console.error(`  Original: ${originalCorrect}`);
    console.error(`  Patch:    ${patchCorrect}`);
    errors++;
    continue;
  }

  // Find this question's block by combining passageId + question text for uniqueness.
  // Question text alone can be duplicated across passages (e.g. "Where would you most likely read this passage?").
  // Using passageId as an anchor ensures we find the right question block.
  const passageId = q.passageId;
  const qText = q.question;

  let searchStart = -1;
  if (passageId) {
    // Find the passageId near this question — search for the passageId string first
    const passageAnchor = `"passageId": "${passageId}"`;
    const passageAnchorJS = `passageId: "${passageId}"`;
    let anchorIdx = content.indexOf(passageAnchor);
    if (anchorIdx === -1) anchorIdx = content.indexOf(passageAnchorJS);

    if (anchorIdx !== -1) {
      // Now find the question text AFTER this passageId (within 50k chars — enough for any passage)
      const qIdx = content.indexOf(qText, anchorIdx);
      if (qIdx !== -1 && qIdx - anchorIdx < 50000) {
        searchStart = qIdx;
      }
    }
  }

  // Fallback: find by question text with "question" key prefix check
  if (searchStart === -1) {
    let qTextIdx = content.indexOf(qText);
    while (qTextIdx !== -1) {
      const before = content.substring(Math.max(0, qTextIdx - 30), qTextIdx);
      if (before.includes('question')) {
        // Verify the nearest "id" before this matches our target
        const idCheck = content.lastIndexOf(`"id": ${id},`, qTextIdx);
        const idCheckJS = content.lastIndexOf(`id: ${id},`, qTextIdx);
        const nearestId = Math.max(idCheck, idCheckJS);
        if (nearestId !== -1 && qTextIdx - nearestId < 50000) {
          searchStart = qTextIdx;
          break;
        }
      }
      qTextIdx = content.indexOf(qText, qTextIdx + 1);
    }
  }

  if (searchStart === -1) {
    console.error(`Q${id}: Could not find question in file (passageId: ${passageId})`);
    errors++;
    continue;
  }
  // Try both JSON ("options":) and JS (options:) syntax
  let optionsStart = content.indexOf('"options":', searchStart);
  const optionsStartJS = content.indexOf('options:', searchStart);
  // Use whichever is closer to the question text
  if (optionsStart === -1 || (optionsStartJS !== -1 && optionsStartJS < optionsStart)) {
    optionsStart = optionsStartJS;
  }
  if (optionsStart === -1 || optionsStart - searchStart > 50000) {
    console.error(`Q${id}: Could not find "options" near id`);
    errors++;
    continue;
  }

  // Find the opening [ of the options array
  const bracketOpen = content.indexOf('[', optionsStart);
  if (bracketOpen === -1) {
    console.error(`Q${id}: Could not find opening bracket`);
    errors++;
    continue;
  }

  // Find the matching closing ] — count nested brackets
  let depth = 1;
  let pos = bracketOpen + 1;
  while (depth > 0 && pos < content.length) {
    if (content[pos] === '[') depth++;
    else if (content[pos] === ']') depth--;
    pos++;
  }
  const bracketClose = pos - 1;

  // Extract the old options text and detect indentation
  const oldOptionsBlock = content.substring(bracketOpen, bracketClose + 1);

  // Detect the indentation from the file (look at whitespace before the first option string)
  const afterBracket = content.substring(bracketOpen + 1, bracketOpen + 50);
  const indentMatch = afterBracket.match(/\n(\s+)"/);
  const indent = indentMatch ? indentMatch[1] : '            ';
  const outerIndent = indent.substring(0, indent.length - 2) || '          ';

  // Build the new options block with matching formatting
  const newBlock = '[\n' + newOptions.map((opt, i) => {
    const escaped = JSON.stringify(opt);
    return indent + escaped;
  }).join(',\n') + '\n' + outerIndent + ']';

  content = content.substring(0, bracketOpen) + newBlock + content.substring(bracketClose + 1);
  applied++;
}

// Results summary
console.log(`\nResults:`);
console.log(`  Applied: ${applied}`);
console.log(`  Skipped (no change): ${skipped}`);
console.log(`  Errors: ${errors}`);
console.log(`  Total patches: ${totalPatches}`);

// All-or-nothing: only write back if no errors (Codex adversarial finding)
if (errors > 0) {
  console.log('\n❌ NOT writing file — errors detected. Fix issues and re-run.');
  console.log('The source file has NOT been modified.');
  process.exit(1);
} else {
  fs.writeFileSync(DATA_FILE, content);
  console.log('\n✅ All patches applied successfully — file written.');
}

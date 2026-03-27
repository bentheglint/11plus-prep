const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'JS Files for Question Bank');
const scoresDir = path.join(__dirname, 'difficulty-scores');

// Map: score filename -> array of JS filenames
const fileMap = {
  'percentages': ['percentages.js', 'percentages_v2_questions_36-135.js'],
  'decimals': ['decimals.js', 'decimals_v2_questions_36_135.js'],
  'longdivision': ['longdivision.js', 'longdivision_v2_questions_31_130.js'],
  'ratio': ['ratio.js', 'ratio_v2_questions_31_130.js'],
  'fractions': ['fractions.js', 'fractions_v2_questions_36_135_COMPLETE.js'],
  'longmultiplication': ['longmultiplication.js', 'longmultiplication_v2_questions_26_125.js'],
  'algebra': ['algebra.js', 'algebra_v2_questions_36_135.js'],
  'placevalue': ['placevalue.js', 'placevalue_v2_questions_26_125.js'],
  'negativenumbers': ['negativenumbers.js', 'negativenumbers_v2_questions_21_120.js'],
  'primenumbers': ['primenumbers.js', 'primenumbersfactors.js', 'primenumbersfactors_v2_questions_16_115.js'],
  'areaperimeter': ['area-perimeter.js', 'areaperimeter_v2_questions_31_130.js'],
  'volume': ['volume.js', 'volume_v2_questions_19_118.js'],
  'anglesshapes': ['angles-shapes.js', 'anglesshapes_v2_questions_23_122.js'],
  'sequences': ['sequences.js', 'sequences_v2_questions_21_120.js'],
  'datahandling': ['datahandling.js', 'datahandling_v2_questions_26_125.js'],
  'speeddistancetime': ['speeddistancetime.js', 'speeddistancetime_v2_questions_16_115.js']
};

// Read all score files
const allScores = {};
for (const [scoreFile, jsFiles] of Object.entries(fileMap)) {
  const filePath = path.join(scoresDir, `${scoreFile}.txt`);
  const content = fs.readFileSync(filePath, 'utf8');
  const topicScores = {};

  for (const line of content.split('\n')) {
    if (line.startsWith('DISTRIBUTION') || line.trim() === '') continue;
    const pairs = line.split(',');
    for (const pair of pairs) {
      const trimmed = pair.trim();
      if (!trimmed || !trimmed.includes(':')) continue;
      const [id, diff] = trimmed.split(':').map(s => parseInt(s.trim()));
      if (!isNaN(id) && !isNaN(diff) && diff >= 1 && diff <= 3) {
        topicScores[id] = diff;
      }
    }
  }

  allScores[scoreFile] = topicScores;
  console.log(`${scoreFile}: ${Object.keys(topicScores).length} scores loaded`);
}

// Apply to each JS file
let grandTotalAdded = 0;
let grandTotalSkipped = 0;

for (const [scoreFile, jsFiles] of Object.entries(fileMap)) {
  const topicScores = allScores[scoreFile];

  for (const jsFile of jsFiles) {
    const filePath = path.join(jsDir, jsFile);
    if (!fs.existsSync(filePath)) {
      console.log(`  SKIP (not found): ${jsFile}`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let added = 0;
    let skipped = 0;

    // Process from bottom to top
    for (let i = lines.length - 1; i >= 0; i--) {
      const match = lines[i].match(/^(\s+)id:\s*(\d+),\s*$/);
      if (match) {
        const indent = match[1];
        const id = parseInt(match[2]);
        const difficulty = topicScores[id];

        if (difficulty) {
          // Check if difficulty already exists on next line
          if (i + 1 < lines.length && lines[i + 1].includes('difficulty:')) {
            skipped++;
            continue;
          }
          lines.splice(i + 1, 0, `${indent}difficulty: ${difficulty},`);
          added++;
        }
      }
    }

    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`  ${jsFile}: ${added} added, ${skipped} skipped`);
    grandTotalAdded += added;
    grandTotalSkipped += skipped;
  }
}

console.log(`\nGrand total: ${grandTotalAdded} difficulty fields added, ${grandTotalSkipped} skipped`);

// Verify
let totalVerified = 0;
for (const [scoreFile, jsFiles] of Object.entries(fileMap)) {
  for (const jsFile of jsFiles) {
    const filePath = path.join(jsDir, jsFile);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    const count = (content.match(/difficulty:\s*[123],/g) || []).length;
    totalVerified += count;
  }
}
console.log(`Verification: ${totalVerified} difficulty fields found across all JS files`);

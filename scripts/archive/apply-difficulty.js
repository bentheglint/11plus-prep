const fs = require('fs');
const path = require('path');

// Topic mapping: topic key in App.js -> score filename
const topicMap = {
  'Percentages': 'percentages',
  'Decimals': 'decimals',
  'Long Division': 'longdivision',
  'Ratio & Proportion': 'ratio',
  'Fractions': 'fractions',
  'Long Multiplication': 'longmultiplication',
  'Algebra': 'algebra',
  'Place Value and Rounding': 'placevalue',
  'Negative Numbers': 'negativenumbers',
  'Prime Numbers & Factors': 'primenumbers',
  'Area and Perimeter': 'areaperimeter',
  'Volume': 'volume',
  'Angles and Shapes': 'anglesshapes',
  'Sequences': 'sequences',
  'Data Handling': 'datahandling',
  'Speed, Distance, Time': 'speeddistancetime'
};

// Read all score files
const scores = {};
for (const [topicName, filename] of Object.entries(topicMap)) {
  const filePath = path.join(__dirname, 'difficulty-scores', `${filename}.txt`);
  const content = fs.readFileSync(filePath, 'utf8');
  const topicScores = {};

  // Parse each line of id:difficulty pairs
  for (const line of content.split('\n')) {
    if (line.startsWith('DISTRIBUTION') || line.trim() === '') continue;
    // Handle both "1:2,3:1" and "1:2, 3:1" formats
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

  scores[topicName] = topicScores;
  console.log(`${topicName}: ${Object.keys(topicScores).length} scores loaded`);
}

// Read App.js
const appPath = path.join(__dirname, 'src', 'App.js');
let content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

// Find topic boundaries
const topicBounds = [];
const topicNames = Object.keys(topicMap);
for (let i = 0; i < lines.length; i++) {
  for (const name of topicNames) {
    if (lines[i].includes(`name: "${name}"`) && !lines[i].includes('//')) {
      topicBounds.push({ name, line: i });
    }
  }
}

// Sort by line number
topicBounds.sort((a, b) => a.line - b.line);

// Add end boundaries
for (let i = 0; i < topicBounds.length; i++) {
  topicBounds[i].end = i < topicBounds.length - 1 ? topicBounds[i + 1].line : lines.length;
}

console.log('\nTopic boundaries found:');
topicBounds.forEach(t => console.log(`  ${t.name}: lines ${t.line}-${t.end}`));

// Apply difficulty scores
let totalAdded = 0;
let totalSkipped = 0;

// Process from bottom to top so line numbers don't shift
for (let t = topicBounds.length - 1; t >= 0; t--) {
  const topic = topicBounds[t];
  const topicScores = scores[topic.name];

  if (!topicScores) {
    console.log(`WARNING: No scores for ${topic.name}`);
    continue;
  }

  // Find all "id: X," lines in this topic's range
  for (let i = topic.end - 1; i >= topic.line; i--) {
    const match = lines[i].match(/^(\s+)id:\s*(\d+),\s*$/);
    if (match) {
      const indent = match[1];
      const id = parseInt(match[2]);
      const difficulty = topicScores[id];

      if (difficulty) {
        // Check if difficulty already exists on next line
        if (i + 1 < lines.length && lines[i + 1].includes('difficulty:')) {
          totalSkipped++;
          continue;
        }
        // Insert difficulty line after id line
        lines.splice(i + 1, 0, `${indent}difficulty: ${difficulty},`);
        totalAdded++;
      }
    }
  }
}

console.log(`\nTotal difficulty fields added: ${totalAdded}`);
console.log(`Total skipped (already existed): ${totalSkipped}`);

// Write modified App.js
fs.writeFileSync(appPath, lines.join('\n'), 'utf8');
console.log('App.js updated successfully!');

// Verify
const verifyContent = fs.readFileSync(appPath, 'utf8');
const difficultyCount = (verifyContent.match(/difficulty:\s*[123],/g) || []).length;
console.log(`\nVerification: Found ${difficultyCount} difficulty fields in updated App.js`);

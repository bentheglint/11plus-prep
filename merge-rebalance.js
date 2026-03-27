const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'JS Files for Question Bank');
const appPath = path.join(__dirname, 'src', 'App.js');

// Map: topic name in App.js -> rebalance file(s) and difficulty score file
const rebalanceMap = {
  'Decimals': {
    files: ['decimals_rebalance_L3.js'],
    scoreFile: 'decimals'
  },
  'Long Division': {
    files: ['longdivision_rebalance_L1.js'],
    scoreFile: 'longdivision'
  },
  'Ratio & Proportion': {
    files: ['ratio_rebalance_L1_L3.js'],
    scoreFile: 'ratio'
  },
  'Fractions': {
    files: ['fractions_rebalance_L3.js'],
    scoreFile: 'fractions'
  },
  'Long Multiplication': {
    files: ['longmultiplication_rebalance_L1.js'],
    scoreFile: 'longmultiplication'
  },
  'Place Value and Rounding': {
    files: ['placevalue_rebalance_L3.js'],
    scoreFile: 'placevalue'
  },
  'Negative Numbers': {
    files: ['negativenumbers_rebalance_L3.js'],
    scoreFile: 'negativenumbers'
  },
  'Volume': {
    files: ['volume_rebalance_L3.js'],
    scoreFile: 'volume'
  },
  'Data Handling': {
    files: ['datahandling_rebalance_L2_L3.js'],
    scoreFile: 'datahandling'
  }
};

// Read App.js
let content = fs.readFileSync(appPath, 'utf8');
let lines = content.split('\n');

console.log(`App.js: ${lines.length} lines`);

// Find topic boundaries
const topicNames = Object.keys(rebalanceMap);
const topicBounds = [];

for (let i = 0; i < lines.length; i++) {
  for (const name of topicNames) {
    if (lines[i].includes(`name: "${name}"`) && !lines[i].includes('//')) {
      topicBounds.push({ name, line: i });
    }
  }
}

topicBounds.sort((a, b) => a.line - b.line);

// Find each topic's questions array end (the ] line)
// We need to find the ] that closes the questions array for each topic
for (const topic of topicBounds) {
  // From the topic line, find "questions: [" then find the matching ]
  let questionsStart = -1;
  for (let i = topic.line; i < Math.min(topic.line + 10, lines.length); i++) {
    if (lines[i].includes('questions:')) {
      questionsStart = i;
      break;
    }
  }

  if (questionsStart === -1) {
    console.log(`WARNING: Could not find questions array for ${topic.name}`);
    continue;
  }

  // Find the closing ] by tracking brace depth from the questions line
  // The ] we want is at the same indent level as "questions: ["
  // It's the line that has just "  ]" before the closing }
  let depth = 0;
  let foundStart = false;
  for (let i = questionsStart; i < lines.length; i++) {
    if (lines[i].includes('[')) {
      depth++;
      foundStart = true;
    }
    if (lines[i].includes(']')) {
      depth--;
      if (foundStart && depth === 0) {
        topic.questionsEnd = i; // Line with ]
        break;
      }
    }
  }

  console.log(`  ${topic.name}: starts line ${topic.line}, questions end line ${topic.questionsEnd}`);
}

// Process from bottom to top so line numbers don't shift
topicBounds.sort((a, b) => b.questionsEnd - a.questionsEnd);

let totalInserted = 0;

for (const topic of topicBounds) {
  const config = rebalanceMap[topic.name];

  // Read and combine all rebalance files for this topic
  let newQuestions = [];
  for (const file of config.files) {
    const filePath = path.join(jsDir, file);
    if (!fs.existsSync(filePath)) {
      console.log(`  WARNING: ${file} not found`);
      continue;
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Extract question blocks: everything from first { to last }
    const fileLines = fileContent.split('\n');
    let firstQ = -1;
    let lastQ = -1;
    for (let i = 0; i < fileLines.length; i++) {
      if (fileLines[i].trim().startsWith('{') && firstQ === -1) firstQ = i;
      if (fileLines[i].trim().startsWith('}')) lastQ = i;
    }

    if (firstQ >= 0 && lastQ >= 0) {
      const questionLines = fileLines.slice(firstQ, lastQ + 1);
      newQuestions.push(...questionLines);
    }
  }

  if (newQuestions.length === 0) {
    console.log(`  No questions found for ${topic.name}`);
    continue;
  }

  // Clean up: ensure the last question block doesn't have a trailing comma
  // and the one before the insertion point does have a comma

  // Remove trailing comma from the last line of new questions if it's just "    },"
  let lastLine = newQuestions.length - 1;
  if (newQuestions[lastLine].trim() === '},') {
    newQuestions[lastLine] = newQuestions[lastLine].replace(/},\s*$/, '}');
  } else if (newQuestions[lastLine].trim() === '}') {
    // Already fine
  }

  // Ensure the existing last question has a comma after its closing }
  // The line before questionsEnd should be the last question's closing }
  const lastQLine = topic.questionsEnd - 1;
  if (lines[lastQLine].trim() === '}') {
    lines[lastQLine] = lines[lastQLine].replace(/}\s*$/, '},');
  }

  // Ensure the last question in the file before our new ones has a comma
  // Actually, we need a comma between the old last question and our new first question
  // The new questions already have commas between them from the file

  // Insert new questions before the ] line
  // Add proper indentation - the questions in App.js use 6 spaces indent for { and }
  // Let's check what the existing indent is
  const sampleLine = lines[topic.questionsEnd - 1];
  const existingIndent = sampleLine.match(/^(\s*)/)[1];

  // Adjust indentation of new questions to match
  // The rebalance files use 4 spaces for { - App.js might use different
  // Let's detect the App.js indent from the line above ]
  const appIndent = existingIndent; // This is the indent of the last question's }

  // Insert the new questions
  lines.splice(topic.questionsEnd, 0, ...newQuestions);

  const qCount = newQuestions.filter(l => l.trim().match(/^id:\s*\d+,/)).length;
  console.log(`  ${topic.name}: Inserted ${qCount} questions (${newQuestions.length} lines)`);
  totalInserted += qCount;

  // Update difficulty scores file
  const scoresDir = path.join(__dirname, 'difficulty-scores');
  const scoresPath = path.join(scoresDir, `${config.scoreFile}.txt`);

  // Extract id:difficulty pairs from the new questions
  const newScores = [];
  for (const line of newQuestions) {
    const idMatch = line.match(/id:\s*(\d+),/);
    if (idMatch) {
      const id = idMatch[1];
      // Find the difficulty on the next line or same object
      const idx = newQuestions.indexOf(line);
      for (let j = idx; j < Math.min(idx + 3, newQuestions.length); j++) {
        const diffMatch = newQuestions[j].match(/difficulty:\s*(\d+),/);
        if (diffMatch) {
          newScores.push(`${id}:${diffMatch[1]}`);
          break;
        }
      }
    }
  }

  if (newScores.length > 0) {
    let scoresContent = fs.readFileSync(scoresPath, 'utf8');
    // Remove the DISTRIBUTION line and trailing whitespace
    scoresContent = scoresContent.replace(/\nDISTRIBUTION:.*$/m, '').trimEnd();
    // Append new scores
    scoresContent += '\n' + newScores.join(', ') + '\n';
    fs.writeFileSync(scoresPath, scoresContent, 'utf8');
    console.log(`    Updated ${config.scoreFile}.txt with ${newScores.length} new scores`);
  }
}

// Write updated App.js
fs.writeFileSync(appPath, lines.join('\n'), 'utf8');
console.log(`\nTotal questions inserted: ${totalInserted}`);

// Verify
const verifyContent = fs.readFileSync(appPath, 'utf8');
const totalDifficulty = (verifyContent.match(/difficulty:\s*[123],/g) || []).length;
console.log(`Verification: ${totalDifficulty} total difficulty fields in App.js`);

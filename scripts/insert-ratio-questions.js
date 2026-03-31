#!/usr/bin/env node
/**
 * Insert 40 new ratio questions, update lesson mappings, fix remaining issues.
 */
const fs = require('fs');
const path = require('path');

const mathsPath = path.join(__dirname, '..', 'src', 'questionData', 'mathsData.js');
const mapPath = path.join(__dirname, '..', 'public', 'maths-question-lesson-map.json');

// =====================================================================
// 40 NEW QUESTIONS
// =====================================================================
const NEW_QUESTIONS = [
  // SIMPLIFYING D1
  { id: 206, difficulty: 1, question: "Simplify the ratio 6:10.", options: ["6:10", "3:5", "1:2", "2:5", "3:10"], correct: 1, explanation: "Find the HCF of 6 and 10, which is 2. Divide both parts: 6 \u00f7 2 = 3 and 10 \u00f7 2 = 5. Simplified ratio: 3:5. \u2713" },
  { id: 207, difficulty: 1, question: "Write the ratio 20:30 in its simplest form.", options: ["4:6", "10:15", "2:3", "20:30", "5:6"], correct: 2, explanation: "HCF of 20 and 30 is 10. Divide both: 20 \u00f7 10 = 2 and 30 \u00f7 10 = 3. Simplified ratio: 2:3. \u2713" },
  { id: 208, difficulty: 1, question: "Simplify the ratio 15:5.", options: ["5:1", "15:5", "5:3", "3:1", "1:3"], correct: 3, explanation: "HCF of 15 and 5 is 5. Divide both: 15 \u00f7 5 = 3 and 5 \u00f7 5 = 1. Simplified ratio: 3:1. \u2713" },
  { id: 209, difficulty: 1, question: "Write the ratio 8:12 in its simplest form.", options: ["2:3", "4:6", "8:12", "3:2", "1:2"], correct: 0, explanation: "HCF of 8 and 12 is 4. Divide both: 8 \u00f7 4 = 2 and 12 \u00f7 4 = 3. Simplified ratio: 2:3. \u2713" },
  { id: 210, difficulty: 1, question: "Simplify the ratio 50:20.", options: ["10:4", "25:10", "50:20", "10:2", "5:2"], correct: 4, explanation: "HCF of 50 and 20 is 10. Divide both: 50 \u00f7 10 = 5 and 20 \u00f7 10 = 2. Simplified ratio: 5:2. \u2713" },
  // SIMPLIFYING D2
  { id: 211, difficulty: 2, question: "Write the ratio 24:36 in its simplest form.", options: ["4:6", "8:12", "12:18", "3:4", "2:3"], correct: 4, explanation: "HCF of 24 and 36 is 12. Divide both: 24 \u00f7 12 = 2 and 36 \u00f7 12 = 3. Simplified ratio: 2:3. Options like 4:6 and 8:12 are only partially simplified. \u2713" },
  { id: 212, difficulty: 2, question: "Simplify the ratio 18:27.", options: ["9:27", "6:9", "18:27", "2:3", "3:2"], correct: 3, explanation: "HCF of 18 and 27 is 9. Divide both: 18 \u00f7 9 = 2 and 27 \u00f7 9 = 3. Simplified ratio: 2:3. \u2713" },
  { id: 213, difficulty: 2, question: "Write the ratio 35:56 in its simplest form.", options: ["7:8", "5:8", "7:11", "35:56", "5:7"], correct: 1, explanation: "HCF of 35 and 56 is 7. Divide both: 35 \u00f7 7 = 5 and 56 \u00f7 7 = 8. Simplified ratio: 5:8. \u2713" },
  { id: 214, difficulty: 2, question: "Simplify the ratio 48:64.", options: ["3:4", "6:8", "12:16", "24:32", "4:3"], correct: 0, explanation: "HCF of 48 and 64 is 16. Divide both: 48 \u00f7 16 = 3 and 64 \u00f7 16 = 4. Simplified ratio: 3:4. \u2713" },
  { id: 215, difficulty: 2, question: "Write the ratio 42:70 in its simplest form.", options: ["6:10", "21:35", "3:5", "7:10", "42:70"], correct: 2, explanation: "HCF of 42 and 70 is 14. Divide both: 42 \u00f7 14 = 3 and 70 \u00f7 14 = 5. Simplified ratio: 3:5. \u2713" },
  // SIMPLIFYING D3
  { id: 216, difficulty: 3, question: "Write the ratio 2 m : 50 cm : 150 cm in its simplest form.", options: ["4:1:3", "2:1:3", "20:5:15", "2:5:15", "200:50:150"], correct: 0, explanation: "Convert to cm: 200:50:150. HCF = 50. Divide all: 4:1:3. \u2713" },
  { id: 217, difficulty: 3, question: "Write the ratio 30 minutes : 1 hour : 1 hour 30 minutes in its simplest form.", options: ["30:60:90", "3:6:9", "2:3:4", "1:2:3", "3:2:1"], correct: 3, explanation: "Convert to minutes: 30:60:90. HCF = 30. Divide: 1:2:3. \u2713" },
  { id: 218, difficulty: 3, question: "Express the ratio 0.6 : 1.5 : 2.1 in its simplest form.", options: ["6:15:21", "3:5:7", "2:5:7", "6:5:7", "1:3:4"], correct: 2, explanation: "Multiply all by 10: 6:15:21. HCF = 3. Divide: 2:5:7. \u2713" },
  { id: 219, difficulty: 3, question: "Express the ratio 500 ml : 1.5 litres : 2 litres in its simplest form.", options: ["500:1500:2000", "5:15:20", "2:6:8", "5:3:2", "1:3:4"], correct: 4, explanation: "Convert to ml: 500:1500:2000. HCF = 500. Divide: 1:3:4. \u2713" },
  { id: 220, difficulty: 3, question: "Write the ratio 1.2 kg : 800 g : 400 g in its simplest form.", options: ["12:8:4", "3:2:1", "6:4:2", "1.2:0.8:0.4", "4:2:1"], correct: 1, explanation: "Convert to grams: 1200:800:400. HCF = 400. Divide: 3:2:1. \u2713" },
  // RATIO-TO-FRACTION D1
  { id: 221, difficulty: 1, question: "The ratio of boys to girls in a class is 3:2. What fraction of the class are boys?", options: ["3/2", "2/3", "2/5", "3/5", "1/3"], correct: 3, explanation: "Total parts: 3 + 2 = 5. Boys = 3 out of 5 total. Fraction = 3/5. The trap 3/2 uses the ratio as a fraction \u2014 the denominator must be the total. \u2713" },
  { id: 222, difficulty: 1, question: "In a pet shop, the ratio of cats to dogs is 4:1. What fraction of the animals are cats?", options: ["4/5", "4/1", "1/4", "1/5", "3/4"], correct: 0, explanation: "Total parts: 4 + 1 = 5. Cats = 4 out of 5. Fraction = 4/5. \u2713" },
  { id: 223, difficulty: 1, question: "The ratio of red counters to blue counters is 2:7. What fraction of the counters are blue?", options: ["2/7", "7/2", "2/9", "5/9", "7/9"], correct: 4, explanation: "Total parts: 2 + 7 = 9. Blue = 7 out of 9. Fraction = 7/9. \u2713" },
  // RATIO-TO-FRACTION D2
  { id: 224, difficulty: 2, question: "The ratio of apples to oranges in a bowl is 5:3. What fraction of the fruit are oranges?", options: ["5/3", "3/8", "3/5", "5/8", "1/3"], correct: 1, explanation: "Total parts: 5 + 3 = 8. Oranges = 3 out of 8. Fraction = 3/8. \u2713" },
  { id: 225, difficulty: 2, question: "In a school, the ratio of gold, silver and bronze awards is 2:3:5. What fraction of the awards are silver?", options: ["3/5", "2/3", "3/10", "3/7", "1/3"], correct: 2, explanation: "Total parts: 2 + 3 + 5 = 10. Silver = 3 out of 10. Fraction = 3/10. \u2713" },
  { id: 226, difficulty: 2, question: "In a Year 6 class, 3/7 of the pupils are boys. What is the ratio of boys to girls?", options: ["3:4", "3:7", "4:3", "7:3", "3:10"], correct: 0, explanation: "If 3/7 are boys, girls = 4/7. Ratio boys:girls = 3:4. \u2713" },
  { id: 227, difficulty: 2, question: "The ratio of cats to dogs to rabbits at a rescue centre is 1:3:2. What fraction of the animals are NOT rabbits?", options: ["1/3", "2/6", "3/6", "2/3", "4/3"], correct: 3, explanation: "Total parts: 6. NOT rabbits = 4 parts. Fraction = 4/6 = 2/3. \u2713" },
  // RATIO-TO-FRACTION D3
  { id: 228, difficulty: 3, question: "In a class, the ratio of boys to girls is 4:5. There are 45 pupils in total. What fraction of the class are girls, and how many girls are there?", options: ["4/9 of the class; 20 girls", "5/9 of the class; 20 girls", "4/5 of the class; 36 girls", "5/4 of the class; 25 girls", "5/9 of the class; 25 girls"], correct: 4, explanation: "Total parts: 9. Fraction girls = 5/9. Each part = 5. Girls = 25. \u2713" },
  { id: 229, difficulty: 3, question: "A necklace has red, blue and green beads in the ratio 3:4:5. There are 60 beads in total. What fraction are blue, and how many blue beads are there?", options: ["4/12 of the beads; 24 blue", "1/3 of the beads; 20 blue", "4/7 of the beads; 20 blue", "1/4 of the beads; 15 blue", "4/5 of the beads; 48 blue"], correct: 1, explanation: "Total parts: 12. Blue = 4/12 = 1/3. Each part = 5. Blue = 20. \u2713" },
  { id: 230, difficulty: 3, question: "On a school trip, the ratio of adults to children is 2:7. There are 54 people. What fraction are children, and how many children are there?", options: ["2/9 of the group; 12 children", "7/2 of the group; 42 children", "7/9 of the group; 42 children", "2/7 of the group; 14 children", "7/9 of the group; 36 children"], correct: 2, explanation: "Total parts: 9. Fraction children = 7/9. Each part = 6. Children = 42. \u2713" },
  // D2 THREE-PART SHARING
  { id: 231, difficulty: 2, question: "Amy, Ben and Charlie share \u00a360 in the ratio 1:2:3. How much does Ben receive?", options: ["\u00a310", "\u00a315", "\u00a330", "\u00a320", "\u00a312"], correct: 3, explanation: "Total parts: 6. Each part = \u00a310. Ben = 2 \u00d7 \u00a310 = \u00a320. \u2713" },
  { id: 232, difficulty: 2, question: "Three friends share 100 sweets in the ratio 2:3:5. How many does the friend with the smallest share get?", options: ["20", "30", "50", "10", "25"], correct: 0, explanation: "Total parts: 10. Each part = 10. Smallest = 2 \u00d7 10 = 20. \u2713" },
  { id: 233, difficulty: 2, question: "Ella, Freya and Grace share 75 stickers in the ratio 1:3:1. How many stickers does Freya get?", options: ["15", "25", "30", "3", "45"], correct: 4, explanation: "Total parts: 5. Each part = 15. Freya = 3 \u00d7 15 = 45. \u2713" },
  { id: 234, difficulty: 2, question: "Three children share \u00a350 in the ratio 2:2:1. How much does each of the two children with the larger share get?", options: ["\u00a310", "\u00a320", "\u00a325", "\u00a315", "\u00a330"], correct: 1, explanation: "Total parts: 5. Each part = \u00a310. Larger share = 2 \u00d7 \u00a310 = \u00a320. \u2713" },
  { id: 235, difficulty: 2, question: "Jake, Kai and Leo share \u00a380 in the ratio 3:2:5. How much does Kai receive?", options: ["\u00a324", "\u00a330", "\u00a316", "\u00a340", "\u00a38"], correct: 2, explanation: "Total parts: 10. Each part = \u00a38. Kai = 2 \u00d7 \u00a38 = \u00a316. \u2713" },
  { id: 236, difficulty: 2, question: "200 sweets are shared between Mia, Noah and Olivia in the ratio 1:4:5. How many sweets does Olivia get?", options: ["100", "80", "20", "40", "60"], correct: 0, explanation: "Total parts: 10. Each part = 20. Olivia = 5 \u00d7 20 = 100. \u2713" },
  { id: 237, difficulty: 2, question: "Pete, Ruby and Sam share \u00a390 in the ratio 2:3:1. How much more does Ruby receive than Sam?", options: ["\u00a315", "\u00a345", "\u00a310", "\u00a330", "\u00a320"], correct: 3, explanation: "Total parts: 6. Each part = \u00a315. Ruby = \u00a345, Sam = \u00a315. Difference = \u00a330. \u2713" },
  // REVERSE SCALE
  { id: 238, difficulty: 2, question: "A map has a scale of 1:50,000. The real distance between two villages is 8 km. How far apart are they on the map?", options: ["0.16 cm", "4 cm", "8 cm", "80 cm", "16 cm"], correct: 4, explanation: "Convert 8 km to cm: 800,000 cm. Map distance = 800,000 \u00f7 50,000 = 16 cm. \u2713" },
  { id: 239, difficulty: 2, question: "A map has a scale of 1:25,000. The real distance between two landmarks is 5 km. How far apart are they on the map?", options: ["5 cm", "20 cm", "2 cm", "25 cm", "50 cm"], correct: 1, explanation: "Convert 5 km to cm: 500,000 cm. Map distance = 500,000 \u00f7 25,000 = 20 cm. \u2713" },
  { id: 240, difficulty: 3, question: "A map has a scale of 1:200,000. The real distance between two towns is 6 km. How far apart are they on the map?", options: ["12 cm", "30 cm", "3 cm", "0.3 cm", "6 cm"], correct: 2, explanation: "Convert 6 km to cm: 600,000 cm. Map distance = 600,000 \u00f7 200,000 = 3 cm. \u2713" },
  // RATIO NOTATION D1
  { id: 241, difficulty: 1, question: "What does the ratio 2:5 mean?", options: ["There are 2 things altogether", "There are 5 more of one thing than another", "There are 7 things altogether", "For every 2 of one thing, there are 5 of another", "2 things are shared into 5 groups"], correct: 3, explanation: "The ratio 2:5 means 'for every 2 of one thing, there are 5 of another.' It compares two quantities. \u2713" },
  { id: 242, difficulty: 1, question: "A bag has 3 red sweets for every 7 blue sweets. Which ratio shows red to blue?", options: ["3:7", "7:3", "3:10", "10:3", "1:3"], correct: 0, explanation: "'3 red for every 7 blue' written as red:blue is 3:7. The order matters. \u2713" },
  { id: 243, difficulty: 1, question: "There are 12 cats and 8 dogs at a vet. Write the ratio of cats to dogs in its simplest form.", options: ["12:8", "6:4", "8:12", "4:6", "3:2"], correct: 4, explanation: "Cats:dogs = 12:8. HCF = 4. Divide: 3:2. \u2713" },
  { id: 244, difficulty: 1, question: "A bag has 6 red counters and 9 blue counters. What is the ratio of red to blue in its simplest form?", options: ["6:9", "2:3", "3:2", "1:3", "9:6"], correct: 1, explanation: "Red:blue = 6:9. HCF = 3. Divide: 2:3. \u2713" },
  { id: 245, difficulty: 1, question: "In a car park, there are 10 white cars and 15 black cars. Write the ratio of white to black cars in its simplest form.", options: ["10:15", "1:5", "2:3", "5:10", "15:10"], correct: 2, explanation: "White:black = 10:15. HCF = 5. Divide: 2:3. \u2713" },
];

// LESSON MAPPINGS
const MAPPINGS = [
  { questionId: 206, subConceptId: "simplifying-ratios" },
  { questionId: 207, subConceptId: "simplifying-ratios" },
  { questionId: 208, subConceptId: "simplifying-ratios" },
  { questionId: 209, subConceptId: "simplifying-ratios" },
  { questionId: 210, subConceptId: "simplifying-ratios" },
  { questionId: 211, subConceptId: "simplifying-ratios" },
  { questionId: 212, subConceptId: "simplifying-ratios" },
  { questionId: 213, subConceptId: "simplifying-ratios" },
  { questionId: 214, subConceptId: "simplifying-ratios" },
  { questionId: 215, subConceptId: "simplifying-ratios" },
  { questionId: 216, subConceptId: "simplifying-ratios" },
  { questionId: 217, subConceptId: "simplifying-ratios" },
  { questionId: 218, subConceptId: "simplifying-ratios" },
  { questionId: 219, subConceptId: "simplifying-ratios" },
  { questionId: 220, subConceptId: "simplifying-ratios" },
  { questionId: 221, subConceptId: "ratio-word-problems" },
  { questionId: 222, subConceptId: "ratio-word-problems" },
  { questionId: 223, subConceptId: "ratio-word-problems" },
  { questionId: 224, subConceptId: "ratio-word-problems" },
  { questionId: 225, subConceptId: "ratio-word-problems" },
  { questionId: 226, subConceptId: "ratio-word-problems" },
  { questionId: 227, subConceptId: "ratio-word-problems" },
  { questionId: 228, subConceptId: "ratio-word-problems" },
  { questionId: 229, subConceptId: "ratio-word-problems" },
  { questionId: 230, subConceptId: "ratio-word-problems" },
  { questionId: 231, subConceptId: "master-sharing-ratio" },
  { questionId: 232, subConceptId: "master-sharing-ratio" },
  { questionId: 233, subConceptId: "master-sharing-ratio" },
  { questionId: 234, subConceptId: "master-sharing-ratio" },
  { questionId: 235, subConceptId: "master-sharing-ratio" },
  { questionId: 236, subConceptId: "master-sharing-ratio" },
  { questionId: 237, subConceptId: "master-sharing-ratio" },
  { questionId: 238, subConceptId: "scale-factors-maps" },
  { questionId: 239, subConceptId: "scale-factors-maps" },
  { questionId: 240, subConceptId: "scale-factors-maps" },
  { questionId: 241, subConceptId: "ratio-notation" },
  { questionId: 242, subConceptId: "ratio-notation" },
  { questionId: 243, subConceptId: "ratio-notation" },
  { questionId: 244, subConceptId: "ratio-notation" },
  { questionId: 245, subConceptId: "ratio-notation" },
];

// =====================================================================
// INSERT QUESTIONS
// =====================================================================
let content = fs.readFileSync(mathsPath, 'utf8');

// Find ratio topic's questions array end
const ratioStart = content.indexOf('ratio:');
const questionsStart = content.indexOf('questions: [', ratioStart);
let bracketCount = 0;
let questionsEnd = -1;
for (let i = questionsStart; i < content.length; i++) {
  if (content[i] === '[') bracketCount++;
  if (content[i] === ']') { bracketCount--; if (bracketCount === 0) { questionsEnd = i; break; } }
}

const questionStrings = NEW_QUESTIONS.map(q => {
  const optionsStr = q.options.map(o => `"${o.replace(/"/g, '\\"')}"`).join(', ');
  return `          {
            id: ${q.id},
            difficulty: ${q.difficulty},
            question: ${JSON.stringify(q.question)},
            options: [${optionsStr}],
            correct: ${q.correct},
            explanation: ${JSON.stringify(q.explanation)}
          }`;
}).join(',\n');

content = content.substring(0, questionsEnd) + ',\n' + questionStrings + '\n        ' + content.substring(questionsEnd);

// =====================================================================
// FIX Q177: Ambiguous "ride around lake" wording
// =====================================================================
const q177Old = '"A cyclist rides around the actual lake';
const q177New = '"A cyclist rides along a road beside the lake';
if (content.includes(q177Old)) {
  content = content.replace(q177Old, q177New);
  console.log('Fixed Q177 ambiguous wording');
}

fs.writeFileSync(mathsPath, content);
console.log(`Inserted ${NEW_QUESTIONS.length} questions into ratio topic`);

// =====================================================================
// UPDATE LESSON MAPPINGS
// =====================================================================
const lessonMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
MAPPINGS.forEach(m => {
  if (!lessonMap.ratio.find(e => e.questionId === m.questionId)) {
    lessonMap.ratio.push({ questionId: m.questionId, subConceptId: m.subConceptId, confidence: "high" });
  }
});
lessonMap.ratio.sort((a, b) => a.questionId - b.questionId);
fs.writeFileSync(mapPath, JSON.stringify(lessonMap, null, 2));
console.log('Updated lesson mappings');

// =====================================================================
// FIX DUPLICATE LESSON OPTION (Issue 11)
// =====================================================================
const stagingPath = path.join(__dirname, '..', 'src', 'microLessons', 'staging', 'ratio-subconcepts.js');
let stagingContent = fs.readFileSync(stagingPath, 'utf8');
// Find duplicate "8:6" in simplifying-ratios-mistake interact
const dupPattern = "'8:6', '8:6'";
if (stagingContent.includes(dupPattern)) {
  stagingContent = stagingContent.replace(dupPattern, "'8:6', '4:4'");
  fs.writeFileSync(stagingPath, stagingContent);
  console.log('Fixed duplicate option in simplifying-ratios-mistake lesson');
} else {
  // Try double-quote variant
  const dupPattern2 = '"8:6", "8:6"';
  if (stagingContent.includes(dupPattern2)) {
    stagingContent = stagingContent.replace(dupPattern2, '"8:6", "4:4"');
    fs.writeFileSync(stagingPath, stagingContent);
    console.log('Fixed duplicate option in simplifying-ratios-mistake lesson');
  }
}

// =====================================================================
// VERIFY
// =====================================================================
Object.keys(require.cache).forEach(k => { if (k.includes('mathsData')) delete require.cache[k]; });
const mathsData = require('../src/questionData/mathsData').default;
const ratio = mathsData.topics.ratio.questions;

const total = ratio.length;
const d1 = ratio.filter(q => q.difficulty === 1).length;
const d2 = ratio.filter(q => q.difficulty === 2).length;
const d3 = ratio.filter(q => q.difficulty === 3).length;
console.log(`\nRatio: ${total} questions. D1:${d1}(${Math.round(d1/total*100)}%) D2:${d2}(${Math.round(d2/total*100)}%) D3:${d3}(${Math.round(d3/total*100)}%)`);

// Check all mapped
const updatedMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const mappedIds = new Set(updatedMap.ratio.map(e => e.questionId));
const unmapped = ratio.filter(q => !mappedIds.has(q.id));
console.log(unmapped.length === 0 ? 'All questions mapped to lessons' : `WARNING: ${unmapped.length} unmapped questions`);

// Check sub-concept coverage
const scCounts = {};
updatedMap.ratio.forEach(e => { scCounts[e.subConceptId] = (scCounts[e.subConceptId] || 0) + 1; });
console.log('\nSub-concept coverage:');
Object.entries(scCounts).sort((a,b) => b[1] - a[1]).forEach(([sc, c]) => {
  console.log(`  ${sc.padEnd(25)} ${c} questions`);
});

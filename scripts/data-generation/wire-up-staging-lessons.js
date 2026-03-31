#!/usr/bin/env node
/**
 * Wire up all 37 staging files by adding spread operators to each topic's
 * subConcepts array in lessonData.js.
 *
 * Before: subConcepts: [ { id: "master-xxx", ... } ]
 * After:  subConcepts: [ { id: "master-xxx", ... }, ...stagingSubConcepts ]
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'microLessons', 'lessonData.js');
let content = fs.readFileSync(filePath, 'utf8');

// Map of topic key in lessonBank -> staging import variable name
const topicToImport = {
  longmultiplication: null, // Already has all lessons inline — no staging file
  algebra: 'algebraSubConcepts',
  fractions: 'fractionsSubConcepts',
  decimals: 'decimalsSubConcepts',
  percentages: 'percentagesSubConcepts',
  ratio: 'ratioSubConcepts',
  negativenumbers: 'negativeNumbersSubConcepts',
  placevalue: 'placevalueSubConcepts',
  sequences: 'sequencesSubConcepts',
  primenumbers: 'primenumbersfactorsSubConcepts',
  longdivision: 'longdivisionSubConcepts',
  areaperimeter: 'areaperimeterSubConcepts',
  volume: 'volumeSubConcepts',
  anglesshapes: 'anglesshapesSubConcepts',
  datahandling: 'datahandlingSubConcepts',
  speeddistancetime: 'speeddistancetimeSubConcepts',
  spelling: 'spellingSubConcepts',
  punctuation: 'punctuationSubConcepts',
  grammar: 'grammarSubConcepts',
  vocabulary: 'vocabularySubConcepts',
  wordClassGrammar: 'wordClassSubConcepts',
  comprehension: 'comprehensionSubConcepts',
  synonyms: 'synonymsSubConcepts',
  antonyms: 'antonymsSubConcepts',
  oddTwoOut: 'oddTwoOutSubConcepts',
  verbalAnalogies: 'verbalAnalogiesSubConcepts',
  compoundWords: 'compoundWordsSubConcepts',
  hiddenWords: 'hiddenWordsSubConcepts',
  letterMove: 'letterMoveSubConcepts',
  missingLettersWords: 'missingLettersWordsSubConcepts',
  sharedLetter: 'sharedLetterSubConcepts',
  letterCodes: 'letterCodesSubConcepts',
  letterPairSeries: 'letterPairSeriesSubConcepts',
  wordCodeAnalogies: 'wordCodeAnalogiesSubConcepts',
  numberWordCodes: 'numberWordCodesSubConcepts',
  numberSeries: 'numberSeriesSubConcepts',
  letterSums: 'letterSumsSubConcepts',
  logicAndLanguage: 'logicAndLanguageSubConcepts',
};

let wiredUp = 0;
let skipped = 0;

for (const [topic, importVar] of Object.entries(topicToImport)) {
  if (!importVar) {
    console.log(`  ${topic}: skipped (no staging file / all inline)`);
    skipped++;
    continue;
  }

  // Find the topic definition
  const topicPattern = topic + ': {';
  const topicIdx = content.indexOf(topicPattern);
  if (topicIdx === -1) {
    // Try alternate patterns
    const alt = topic + ':';
    const altIdx = content.indexOf(alt + ' {') !== -1 ? content.indexOf(alt + ' {') : content.indexOf(alt + '{');
    if (altIdx === -1) {
      console.log(`  ${topic}: NOT FOUND in lessonData.js`);
      continue;
    }
  }

  const searchStart = topicIdx !== -1 ? topicIdx : content.indexOf(topic + ':');

  // Find subConcepts: [
  const scIdx = content.indexOf('subConcepts:', searchStart);
  if (scIdx === -1 || scIdx - searchStart > 200) {
    console.log(`  ${topic}: subConcepts not found`);
    continue;
  }

  const arrStart = content.indexOf('[', scIdx);

  // Find the matching ]
  let depth = 0, arrEnd = -1;
  for (let i = arrStart; i < content.length; i++) {
    if (content[i] === '[') depth++;
    if (content[i] === ']') { depth--; if (depth === 0) { arrEnd = i; break; } }
  }

  if (arrEnd === -1) {
    console.log(`  ${topic}: could not find end of subConcepts array`);
    continue;
  }

  // Check if spread already exists
  const arrayContent = content.substring(arrStart, arrEnd);
  if (arrayContent.includes('...' + importVar)) {
    console.log(`  ${topic}: already wired up`);
    continue;
  }

  // Insert the spread before the closing ]
  // Find the right indentation
  const beforeClose = content.substring(arrEnd - 50, arrEnd);
  const indent = beforeClose.match(/\n(\s+)$/);
  const spreadIndent = indent ? indent[1] + '  ' : '      ';

  const spreadLine = `,\n${spreadIndent}...${importVar}\n    `;
  content = content.substring(0, arrEnd) + spreadLine + content.substring(arrEnd);

  wiredUp++;
  console.log(`  ${topic}: wired up ...${importVar}`);
}

fs.writeFileSync(filePath, content);
console.log(`\nDone: ${wiredUp} topics wired up, ${skipped} skipped`);

// Verify by checking sub-concept count
console.log('\n=== VERIFICATION ===');
// Re-read and count
const updated = fs.readFileSync(filePath, 'utf8');
const spreadCount = (updated.match(/\.\.\.\w+SubConcepts/g) || []).length;
console.log('Spread operators found:', spreadCount);

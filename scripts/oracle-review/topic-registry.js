// Master registry of all 38 topics with their data sources
// Used by all extraction and review scripts

const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

const TOPICS = [
  // ===== MATHS (16 topics) =====
  { subject: 'maths', topicKey: 'percentages', displayName: 'Percentages', stagingVar: 'percentagesSubConcepts' },
  { subject: 'maths', topicKey: 'decimals', displayName: 'Decimals', stagingVar: 'decimalsSubConcepts' },
  { subject: 'maths', topicKey: 'longdivision', displayName: 'Long Division', stagingVar: 'longDivisionSubConcepts' },
  { subject: 'maths', topicKey: 'ratio', displayName: 'Ratio & Proportion', stagingVar: 'ratioSubConcepts' },
  { subject: 'maths', topicKey: 'fractions', displayName: 'Fractions', stagingVar: 'fractionsSubConcepts' },
  { subject: 'maths', topicKey: 'longmultiplication', displayName: 'Long Multiplication', stagingVar: 'longMultiplicationSubConcepts' },
  { subject: 'maths', topicKey: 'algebra', displayName: 'Algebra', stagingVar: 'algebraSubConcepts' },
  { subject: 'maths', topicKey: 'placevalue', displayName: 'Place Value & Rounding', stagingVar: 'placeValueSubConcepts' },
  { subject: 'maths', topicKey: 'negativenumbers', displayName: 'Negative Numbers', stagingVar: 'negativeNumbersSubConcepts' },
  { subject: 'maths', topicKey: 'primenumbers', displayName: 'Prime Numbers & Factors', stagingVar: 'primeNumbersSubConcepts', questionKey: 'primenumbers' },
  { subject: 'maths', topicKey: 'areaperimeter', displayName: 'Area & Perimeter', stagingVar: 'areaPerimeterSubConcepts' },
  { subject: 'maths', topicKey: 'volume', displayName: 'Volume', stagingVar: 'volumeSubConcepts' },
  { subject: 'maths', topicKey: 'anglesshapes', displayName: 'Angles & Shapes', stagingVar: 'anglesShapesSubConcepts' },
  { subject: 'maths', topicKey: 'sequences', displayName: 'Sequences', stagingVar: 'sequencesSubConcepts' },
  { subject: 'maths', topicKey: 'datahandling', displayName: 'Data Handling', stagingVar: 'dataHandlingSubConcepts' },
  { subject: 'maths', topicKey: 'speeddistancetime', displayName: 'Speed, Distance, Time', stagingVar: 'sdtSubConcepts' },

  // ===== ENGLISH (6 topics) =====
  { subject: 'english', topicKey: 'comprehension', displayName: 'Reading Comprehension', stagingVar: 'comprehensionSubConcepts' },
  { subject: 'english', topicKey: 'spelling', displayName: 'Spelling', stagingVar: 'spellingSubConcepts' },
  { subject: 'english', topicKey: 'punctuation', displayName: 'Punctuation', stagingVar: 'punctuationSubConcepts' },
  { subject: 'english', topicKey: 'grammar', displayName: 'Grammar', stagingVar: 'grammarSubConcepts' },
  { subject: 'english', topicKey: 'vocabulary', displayName: 'Vocabulary', stagingVar: 'vocabularySubConcepts' },
  { subject: 'english', topicKey: 'wordClassGrammar', displayName: 'Word Class', stagingVar: 'wordClassSubConcepts' },

  // ===== VERBAL REASONING (16 topics) =====
  { subject: 'verbalreasoning', topicKey: 'synonyms', displayName: 'Synonyms', stagingVar: 'synonymsSubConcepts' },
  { subject: 'verbalreasoning', topicKey: 'antonyms', displayName: 'Antonyms', stagingVar: 'antonymsSubConcepts' },
  { subject: 'verbalreasoning', topicKey: 'oddTwoOut', displayName: 'Odd Two Out', stagingVar: 'oddTwoOutSubConcepts' },
  { subject: 'verbalreasoning', topicKey: 'verbalAnalogies', displayName: 'Verbal Analogies', stagingVar: 'verbalAnalogiesSubConcepts' },
  { subject: 'verbalreasoning', topicKey: 'compoundWords', displayName: 'Compound Words', stagingVar: 'compoundWordsSubConcepts' },
  { subject: 'verbalreasoning', topicKey: 'hiddenWords', displayName: 'Hidden Words', stagingVar: 'hiddenWordsSubConcepts' },
  { subject: 'verbalreasoning', topicKey: 'letterMove', displayName: 'Letter Move', stagingVar: 'letterMoveSubConcepts' },
  { subject: 'verbalreasoning', topicKey: 'missingLettersWords', displayName: 'Missing Letters', stagingVar: 'missingLettersSubConcepts' },
  { subject: 'verbalreasoning', topicKey: 'sharedLetter', displayName: 'Shared Letter', stagingVar: 'sharedLetterSubConcepts' },
  { subject: 'verbalreasoning', topicKey: 'letterCodes', displayName: 'Letter Codes', stagingVar: 'letterCodesSubConcepts' },
  { subject: 'verbalreasoning', topicKey: 'letterPairSeries', displayName: 'Letter Pair Series', stagingVar: 'letterPairSeriesSubConcepts' },
  { subject: 'verbalreasoning', topicKey: 'wordCodeAnalogies', displayName: 'Word Code Analogies', stagingVar: 'wordCodeAnalogiesSubConcepts' },
  { subject: 'verbalreasoning', topicKey: 'numberWordCodes', displayName: 'Number Word Codes', stagingVar: 'numberWordCodesSubConcepts' },
  { subject: 'verbalreasoning', topicKey: 'numberSeries', displayName: 'Number Series', stagingVar: 'numberSeriesSubConcepts' },
  { subject: 'verbalreasoning', topicKey: 'letterSums', displayName: 'Letter Sums', stagingVar: 'letterSumsSubConcepts' },
  { subject: 'verbalreasoning', topicKey: 'logicAndLanguage', displayName: 'Logic & Language', stagingVar: 'logicAndLanguageSubConcepts' },
];

// Enrich each topic with file paths
TOPICS.forEach(t => {
  // Question data file
  if (t.subject === 'maths') t.dataFile = path.join(ROOT, 'src/questionData/mathsData.js');
  else if (t.subject === 'english') t.dataFile = path.join(ROOT, 'src/questionData/englishData.js');
  else t.dataFile = path.join(ROOT, 'src/questionData/vrData.js');

  // Staging file (lessons)
  const stagingMap = {
    percentages: 'percentages', decimals: 'decimals', longdivision: 'longdivision',
    ratio: 'ratio', fractions: 'fractions', longmultiplication: 'longmultiplication',
    algebra: 'algebra', placevalue: 'placevalue', negativenumbers: 'negativenumbers',
    primenumbers: 'primenumbers', areaperimeter: 'areaperimeter', volume: 'volume',
    anglesshapes: 'anglesshapes', sequences: 'sequences', datahandling: 'datahandling',
    speeddistancetime: 'speeddistancetime',
    comprehension: 'comprehension', spelling: 'spelling', punctuation: 'punctuation',
    grammar: 'grammar', vocabulary: 'vocabulary', wordClassGrammar: 'wordclass',
    synonyms: 'synonyms', antonyms: 'antonyms', oddTwoOut: 'oddtwoout',
    verbalAnalogies: 'verbalanalogies', compoundWords: 'compoundwords',
    hiddenWords: 'hiddenwords', letterMove: 'lettermove', missingLettersWords: 'missingletterswords',
    sharedLetter: 'sharedletter', letterCodes: 'lettercodes', letterPairSeries: 'letterpairseries',
    wordCodeAnalogies: 'wordcodeanalogies', numberWordCodes: 'numberwordcodes',
    numberSeries: 'numberseries', letterSums: 'lettersums', logicAndLanguage: 'logicandlanguage',
  };
  const stagingName = stagingMap[t.topicKey] || t.topicKey.toLowerCase();
  t.stagingFile = path.join(ROOT, `src/microLessons/staging/${stagingName}-subconcepts.js`);

  // Mapping file
  const mapSubject = t.subject === 'verbalreasoning' ? 'vr' : t.subject;
  t.mappingFile = path.join(ROOT, `public/${mapSubject}-question-lesson-map.json`);

  // Research file (may not exist)
  t.researchFile = path.join(ROOT, `research/gl-topic-research/${stagingName}.md`);
});

function getTopicsForSubject(subject) {
  return TOPICS.filter(t => t.subject === subject);
}

function getTopic(topicKey) {
  return TOPICS.find(t => t.topicKey === topicKey);
}

module.exports = { TOPICS, getTopicsForSubject, getTopic, ROOT };

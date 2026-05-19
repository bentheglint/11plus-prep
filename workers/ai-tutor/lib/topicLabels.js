// Topic key → display label. Mirrors src/utils/topicLabels.js (Worker can't
// import from /src/). Keep these two files in sync when adding new topics.

const TOPIC_LABELS = {
  // Maths
  percentages: 'Percentages',
  decimals: 'Decimals',
  longdivision: 'Long Division',
  ratio: 'Ratio & Proportion',
  fractions: 'Fractions',
  longmultiplication: 'Long Multiplication',
  algebra: 'Algebra',
  placevalue: 'Place Value',
  negativenumbers: 'Negative Numbers',
  primenumbersfactors: 'Prime Numbers & Factors',
  areaperimeter: 'Area & Perimeter',
  volume: 'Volume',
  anglesshapes: 'Angles & Shapes',
  sequences: 'Sequences',
  datahandling: 'Data Handling',
  speeddistancetime: 'Speed, Distance & Time',
  // English
  comprehension: 'Comprehension',
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  spelling: 'Spelling',
  punctuation: 'Punctuation',
  writingTechniques: 'Writing Techniques',
  // Verbal Reasoning
  synonyms: 'Synonyms',
  antonyms: 'Antonyms',
  verbalAnalogies: 'Verbal Analogies',
  oddTwoOut: 'Odd Two Out',
  compoundWords: 'Compound Words',
  hiddenWords: 'Hidden Words',
  letterMove: 'Letter Move',
  missingLettersWords: 'Missing Letters & Words',
  letterCodes: 'Letter Codes',
  letterPairSeries: 'Letter Pair Series',
  numberSeries: 'Number Series',
  letterSums: 'Letter Sums',
  wordCodeAnalogies: 'Word Code Analogies',
  numberWordCodes: 'Number & Word Codes',
  logicAndLanguage: 'Logic & Language',
  sharedLetter: 'Shared Letter',
  // Special
  'daily-learning': 'Daily Learning',
};

export function formatTopicKey(key) {
  if (!key) return '';
  if (TOPIC_LABELS[key]) return TOPIC_LABELS[key];
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim();
}

export const SUBJECT_LABELS = {
  maths: 'Maths',
  english: 'English',
  verbalreasoning: 'Verbal Reasoning',
};

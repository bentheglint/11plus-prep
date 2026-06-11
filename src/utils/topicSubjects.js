// Topic-key → quiz-flow subject ('maths' | 'english' | 'verbalreasoning').
//
// NOTE: this is the QUIZ vocabulary used by App.js handleTopicSelect and the
// question banks — it is NOT the sync vocabulary ('verbal-reasoning', with a
// hyphen) used by subjectFromTopicKey in useD1Data.js for D1 row keys. The
// two must stay separate: changing the sync vocabulary forks D1 rows.

const MATHS_TOPICS = new Set([
  'percentages', 'decimals', 'longdivision', 'ratio', 'fractions',
  'longmultiplication', 'algebra', 'placevalue', 'negativenumbers',
  'primenumbersfactors', 'areaperimeter', 'volume', 'anglesshapes',
  'sequences', 'datahandling', 'speeddistancetime',
]);
const ENGLISH_TOPICS = new Set([
  'comprehension', 'grammar', 'vocabulary', 'spelling', 'punctuation',
  'wordClassGrammar',
]);
const VR_TOPICS = new Set([
  'synonyms', 'antonyms', 'verbalAnalogies', 'oddTwoOut', 'compoundWords',
  'hiddenWords', 'letterMove', 'missingLettersWords', 'letterCodes',
  'letterPairSeries', 'numberSeries', 'letterSums', 'wordCodeAnalogies',
  'numberWordCodes', 'logicAndLanguage', 'sharedLetter', 'balanceEquations',
]);

// Returns the quiz-flow subject for a topic key, or null if unknown.
export function quizSubjectForTopic(topicKey) {
  if (MATHS_TOPICS.has(topicKey)) return 'maths';
  if (ENGLISH_TOPICS.has(topicKey)) return 'english';
  if (VR_TOPICS.has(topicKey)) return 'verbalreasoning';
  return null;
}

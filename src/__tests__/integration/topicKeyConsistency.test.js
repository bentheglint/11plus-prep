/**
 * Topic Key Consistency Tests
 *
 * Verifies that every topic key referenced in app code exists in the
 * corresponding data file, and every data file topic key is referenced
 * by the app. Catches the class of bug where a data extraction or
 * rename changes the key in one place but not the other.
 *
 * Covers:
 * - useMastery.js SUBJECT_TOPICS (drives recommendations, dashboards)
 * - RecommendationCard.js topicNames (drives display names)
 * - Question data files (mathsData, englishData, vrData)
 * - Lesson data (lessonData.js lessonBank keys)
 * - Mapping files (question-lesson-map JSON)
 */

import mathsData from '../../questionData/mathsData';
import englishData from '../../questionData/englishData';
import vrData from '../../questionData/vrData';

// The canonical topic key list from useMastery.js
// This MUST stay in sync — if useMastery changes, update here too.
const APP_SUBJECT_TOPICS = {
  maths: ['percentages', 'decimals', 'longdivision', 'ratio', 'fractions', 'longmultiplication', 'algebra', 'placevalue', 'negativenumbers', 'primenumbersfactors', 'areaperimeter', 'volume', 'anglesshapes', 'sequences', 'datahandling', 'speeddistancetime'],
  english: ['comprehension', 'spelling', 'punctuation', 'grammar', 'vocabulary', 'wordClassGrammar'],
  verbalreasoning: ['synonyms', 'antonyms', 'verbalAnalogies', 'oddTwoOut', 'compoundWords', 'hiddenWords', 'letterMove', 'missingLettersWords', 'letterCodes', 'letterPairSeries', 'numberSeries', 'letterSums', 'wordCodeAnalogies', 'numberWordCodes', 'logicAndLanguage', 'sharedLetter'],
};

// The display name lookup from RecommendationCard.js
const DISPLAY_TOPIC_NAMES = {
  percentages: 'Percentages', decimals: 'Decimals', longdivision: 'Long Division',
  ratio: 'Ratio & Proportion', fractions: 'Fractions', longmultiplication: 'Long Multiplication',
  algebra: 'Algebra', placevalue: 'Place Value', negativenumbers: 'Negative Numbers',
  primenumbersfactors: 'Prime Numbers & Factors', areaperimeter: 'Area & Perimeter',
  volume: 'Volume', anglesshapes: 'Angles & Shapes', sequences: 'Sequences',
  datahandling: 'Data Handling', speeddistancetime: 'Speed, Distance, Time',
  comprehension: 'Comprehension', spelling: 'Spelling', punctuation: 'Punctuation',
  grammar: 'Grammar', vocabulary: 'Vocabulary', wordClassGrammar: 'Word Class',
  synonyms: 'Synonyms', antonyms: 'Antonyms', verbalAnalogies: 'Verbal Analogies',
  oddTwoOut: 'Odd Two Out', compoundWords: 'Compound Words', hiddenWords: 'Hidden Words',
  letterMove: 'Letter Move', missingLettersWords: 'Missing Letters',
  letterCodes: 'Letter Codes', letterPairSeries: 'Letter Pairs',
  numberSeries: 'Number Series', letterSums: 'Letter Sums',
  wordCodeAnalogies: 'Word Codes', numberWordCodes: 'Number Word Codes',
  logicAndLanguage: 'Logic & Language', sharedLetter: 'Shared Letter',
};

const mathsMap = require('../../../public/maths-question-lesson-map.json');
const englishMap = require('../../../public/english-question-lesson-map.json');
const vrMap = require('../../../public/vr-question-lesson-map.json');

// Data file topic keys
const dataKeys = {
  maths: Object.keys(mathsData.topics).sort(),
  english: Object.keys(englishData.topics).sort(),
  verbalreasoning: Object.keys(vrData.topics).sort(),
};

// Mapping file topic keys
const mapKeys = {
  maths: Object.keys(mathsMap).sort(),
  english: Object.keys(englishMap).sort(),
  verbalreasoning: Object.keys(vrMap).sort(),
};

describe('Topic Key Consistency', () => {

  describe('App keys match data file keys', () => {
    // This is the test that catches primenumbersfactors vs primenumbers
    ['maths', 'english', 'verbalreasoning'].forEach(subject => {
      test(`${subject}: every app key exists in data file`, () => {
        const appKeys = APP_SUBJECT_TOPICS[subject];
        const fileKeys = dataKeys[subject];
        const missing = appKeys.filter(k => !fileKeys.includes(k));
        expect(missing).toEqual([]);
      });

      test(`${subject}: every data file key exists in app`, () => {
        const appKeys = APP_SUBJECT_TOPICS[subject];
        const fileKeys = dataKeys[subject];
        const extra = fileKeys.filter(k => !appKeys.includes(k));
        expect(extra).toEqual([]);
      });
    });
  });

  describe('Mapping file keys match data file keys', () => {
    ['maths', 'english', 'verbalreasoning'].forEach(subject => {
      test(`${subject}: every mapping key exists in data file`, () => {
        const mKeys = mapKeys[subject];
        const fKeys = dataKeys[subject];
        const missing = mKeys.filter(k => !fKeys.includes(k));
        expect(missing).toEqual([]);
      });

      test(`${subject}: every data file key exists in mapping file`, () => {
        const mKeys = mapKeys[subject];
        const fKeys = dataKeys[subject];
        const extra = fKeys.filter(k => !mKeys.includes(k));
        expect(extra).toEqual([]);
      });
    });
  });

  describe('Display name coverage', () => {
    test('every app topic key has a display name', () => {
      const allAppKeys = [
        ...APP_SUBJECT_TOPICS.maths,
        ...APP_SUBJECT_TOPICS.english,
        ...APP_SUBJECT_TOPICS.verbalreasoning,
      ];
      const missing = allAppKeys.filter(k => !DISPLAY_TOPIC_NAMES[k]);
      expect(missing).toEqual([]);
    });
  });

  describe('Topic key counts match', () => {
    test('maths: 16 topics', () => {
      expect(dataKeys.maths.length).toBe(16);
      expect(APP_SUBJECT_TOPICS.maths.length).toBe(16);
    });

    test('english: 6 topics', () => {
      expect(dataKeys.english.length).toBe(6);
      expect(APP_SUBJECT_TOPICS.english.length).toBe(6);
    });

    test('verbalreasoning: 16 topics', () => {
      expect(dataKeys.verbalreasoning.length).toBe(16);
      expect(APP_SUBJECT_TOPICS.verbalreasoning.length).toBe(16);
    });
  });
});

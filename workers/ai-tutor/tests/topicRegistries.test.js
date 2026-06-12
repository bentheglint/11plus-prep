import { describe, it, expect } from 'vitest';
import { SUBJECT_TOPICS } from '../lib/mastery.js';
import { TOPIC_LABELS } from '../lib/topicLabels.js';

// The Worker cannot import the client data files, so the canonical 39-key
// list is duplicated here. The CLIENT-side twin of this test
// (src/__tests__/integration/topicKeyConsistency.test.js) derives the same
// list from the data files themselves — if a topic is ever added or renamed,
// that test fails first and this list gets updated alongside it.
//
// Why this exists: across 11-12 Jun 2026 FOUR independent topic registries
// shipped with ghost keys (phantom 'writingTechniques', missing
// 'balanceEquations') — including this Worker's mastery mirror, which
// mis-grouped Balance Equations results under maths in tutor reports.
const CANONICAL = {
  maths: [
    'percentages', 'decimals', 'longdivision', 'ratio', 'fractions',
    'longmultiplication', 'algebra', 'placevalue', 'negativenumbers',
    'primenumbersfactors', 'areaperimeter', 'volume', 'anglesshapes',
    'sequences', 'datahandling', 'speeddistancetime',
  ],
  english: [
    'comprehension', 'spelling', 'punctuation', 'grammar', 'vocabulary',
    'wordClassGrammar',
  ],
  verbalreasoning: [
    'synonyms', 'antonyms', 'verbalAnalogies', 'oddTwoOut', 'compoundWords',
    'hiddenWords', 'letterMove', 'missingLettersWords', 'letterCodes',
    'letterPairSeries', 'numberSeries', 'letterSums', 'wordCodeAnalogies',
    'numberWordCodes', 'logicAndLanguage', 'sharedLetter', 'balanceEquations',
  ],
};
const ALL_KEYS = Object.values(CANONICAL).flat();

describe('worker topic registries', () => {
  it('mastery SUBJECT_TOPICS matches the canonical list per subject', () => {
    for (const subject of Object.keys(CANONICAL)) {
      expect([...SUBJECT_TOPICS[subject]].sort()).toEqual([...CANONICAL[subject]].sort());
    }
  });

  it('mastery SUBJECT_TOPICS has no ghost keys (39 total)', () => {
    expect(Object.values(SUBJECT_TOPICS).flat().length).toBe(39);
  });

  it('TOPIC_LABELS has an explicit label for every canonical key', () => {
    const missing = ALL_KEYS.filter(k => !TOPIC_LABELS[k]);
    expect(missing).toEqual([]);
  });
});

// Subject + topic picker data for tutor-facing screens (assignment composer,
// pulse detail views). Single source of truth — extracted from
// TutorDashboardScreen so TutorPulseDetail can share it without duplication.

export const SUBJECT_TOPICS = {
  maths: {
    label: 'Maths',
    topics: [
      { key: 'percentages', label: 'Percentages' },
      { key: 'decimals', label: 'Decimals' },
      { key: 'longdivision', label: 'Long Division' },
      { key: 'ratio', label: 'Ratio & Proportion' },
      { key: 'fractions', label: 'Fractions' },
      { key: 'longmultiplication', label: 'Long Multiplication' },
      { key: 'algebra', label: 'Algebra' },
      { key: 'placevalue', label: 'Place Value' },
      { key: 'negativenumbers', label: 'Negative Numbers' },
      { key: 'primenumbersfactors', label: 'Prime Numbers & Factors' },
      { key: 'areaperimeter', label: 'Area & Perimeter' },
      { key: 'volume', label: 'Volume' },
      { key: 'anglesshapes', label: 'Angles & Shapes' },
      { key: 'sequences', label: 'Sequences' },
      { key: 'datahandling', label: 'Data Handling' },
      { key: 'speeddistancetime', label: 'Speed, Distance, Time' },
    ],
  },
  english: {
    label: 'English',
    topics: [
      { key: 'comprehension', label: 'Comprehension' },
      { key: 'spelling', label: 'Spelling' },
      { key: 'punctuation', label: 'Punctuation' },
      { key: 'grammar', label: 'Grammar' },
      { key: 'vocabulary', label: 'Vocabulary' },
    ],
  },
  verbalreasoning: {
    label: 'Verbal Reasoning',
    topics: [
      { key: 'synonyms', label: 'Synonyms' },
      { key: 'antonyms', label: 'Antonyms' },
      { key: 'verbalAnalogies', label: 'Verbal Analogies' },
      { key: 'oddTwoOut', label: 'Odd Two Out' },
      { key: 'compoundWords', label: 'Compound Words' },
      { key: 'hiddenWords', label: 'Hidden Words' },
      { key: 'letterCodes', label: 'Letter Codes' },
      { key: 'numberSeries', label: 'Number Series' },
      { key: 'letterSums', label: 'Letter Sums' },
    ],
  },
};

export const TOPIC_LABELS = Object.values(SUBJECT_TOPICS).flatMap(s =>
  s.topics.map(t => ({ key: t.key, label: t.label, subject: s.label }))
);

export function topicLabel(key) {
  return TOPIC_LABELS.find(t => t.key === key)?.label || key;
}

export function subjectLabel(subjectKey) {
  return SUBJECT_TOPICS[subjectKey]?.label || subjectKey;
}

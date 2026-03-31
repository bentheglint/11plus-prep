const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Read vrData
const content = fs.readFileSync(path.join(ROOT, 'src/questionData/vrData.js'), 'utf8');
const fn = new Function(content.replace('export default vrData;', 'return vrData;'));
const vrData = fn();

// Load existing mappings from staging
const batch1 = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/microLessons/staging/vr-question-lesson-mappings.json'), 'utf8'));
const batch2a = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/microLessons/staging/question-lesson-mapping-batch2.json'), 'utf8'));
const batch2b = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/microLessons/staging/question-lesson-mappings-batch2.json'), 'utf8'));

// =============================================
// SYNONYMS MAPPING
// =============================================
const synonymsQs = vrData.topics.synonyms.questions;
const synonymsMappings = synonymsQs.map(q => {
  const wordA = q.setA[q.correctPair[0]].toLowerCase();
  const wordB = q.setB[q.correctPair[1]].toLowerCase();

  let subConceptId;
  let confidence = 'high';

  // Hard vocabulary: difficulty 3 words a 9yo would not know
  const hardWords = [
    'laborious', 'meticulous', 'elated', 'audacious', 'benevolent', 'contemplate',
    'desolate', 'eccentric', 'formidable', 'gregarious', 'illustrious', 'inevitable',
    'negligent', 'resilient', 'scrutinise', 'tenacious', 'clandestine', 'sublime',
    'valiant', 'absolve', 'compel', 'deteriorate', 'provoke', 'bewitch', 'diminish',
    'obsolete', 'nimble', 'feeble', 'overjoyed', 'sorrowful', 'bewildered',
    'unconventional', 'intimidating', 'renowned', 'unavoidable', 'thorough',
    'vivid', 'striking', 'rebellious', 'impulsive', 'persistent', 'determined'
  ];

  // Emotion words
  const emotionWords = [
    'happy', 'sad', 'glad', 'joyful', 'angry', 'cross', 'furious', 'cheerful',
    'miserable', 'elated', 'overjoyed', 'terrified', 'frightened', 'scared',
    'afraid', 'nervous', 'anxious', 'bored', 'lonely', 'proud', 'ashamed',
    'jealous', 'excited', 'calm', 'worried', 'grateful', 'solemn', 'serious',
    'merry', 'gloomy', 'dark and sad', 'irritated', 'annoyed'
  ];

  // Verb words
  const verbWords = [
    'begin', 'start', 'finish', 'reveal', 'conceal', 'hide', 'demonstrate', 'show',
    'argue', 'reply', 'answer', 'allow', 'permit', 'choose', 'select', 'refuse',
    'reject', 'wither', 'flourish', 'thrive', 'reduce', 'expand', 'enlarge',
    'forbid', 'ban', 'scatter', 'gather', 'collect', 'arrive', 'vanish',
    'disappear', 'demand', 'request', 'ask', 'invent', 'imitate', 'copy',
    'assist', 'betray', 'defeat', 'conquer', 'stare', 'glimpse', 'glance',
    'release', 'grasp', 'grip', 'stretch', 'tremble', 'shake', 'stumble', 'trip',
    'discuss', 'whisper', 'quarrel', 'scold', 'praise', 'commend', 'overlook',
    'scrutinise', 'contemplate', 'ponder', 'shout', 'yell', 'murmur', 'repair',
    'mend', 'inspect', 'examine', 'absorb', 'decline', 'soothe', 'provoke',
    'bewitch', 'enchant', 'irritate', 'deteriorate', 'prosper', 'diminish',
    'hinder', 'compel', 'absolve', 'forgive'
  ];

  // Adjective words
  const adjWords = [
    'obstinate', 'stubborn', 'fragile', 'delicate', 'cautious', 'careful',
    'reckless', 'careless', 'persistent', 'determined', 'obedient', 'defiant',
    'rebellious', 'impulsive', 'feeble', 'clumsy', 'awkward', 'resilient',
    'tough', 'vivid', 'striking', 'precise', 'exact', 'ambiguous', 'unclear',
    'prominent', 'notable', 'elaborate', 'detailed', 'genuine', 'authentic',
    'eager', 'keen', 'reluctant', 'unwilling', 'vacant', 'empty', 'inferior',
    'lesser', 'superior', 'greater', 'adequate', 'sufficient', 'abundant',
    'plentiful', 'scarce', 'rare', 'hostile', 'unfriendly', 'apparent', 'obvious',
    'soggy', 'damp', 'cunning', 'sly', 'weary', 'exhausted', 'stout', 'plump',
    'slim', 'slender', 'nimble', 'agile', 'vast', 'immense', 'hazardous',
    'dangerous', 'invisible', 'ordinary', 'common', 'fake', 'false',
    'flexible', 'tenacious', 'yielding', 'submissive'
  ];

  // Abstract words
  const abstractWords = [
    'significant', 'important', 'trivial', 'minor', 'moderate', 'conflict',
    'triumph', 'victory', 'obstacle', 'barrier', 'knowledge', 'success', 'failure'
  ];

  const isHard = q.difficulty === 3 && (hardWords.includes(wordA) || hardWords.includes(wordB));
  const isEmotion = emotionWords.includes(wordA) || emotionWords.includes(wordB);
  const isVerb = verbWords.includes(wordA) || verbWords.includes(wordB);
  const isAdj = adjWords.includes(wordA) || adjWords.includes(wordB);
  const isAbstract = abstractWords.includes(wordA) || abstractWords.includes(wordB);

  if (isHard) {
    subConceptId = 'hard-vocabulary';
  } else if (isEmotion) {
    subConceptId = 'emotion-synonyms';
  } else if (isVerb) {
    subConceptId = 'verb-synonyms';
  } else if (isAbstract) {
    subConceptId = 'abstract-synonyms';
  } else if (isAdj && q.difficulty >= 2) {
    subConceptId = 'adjective-synonyms';
  } else if (q.difficulty >= 2 && (wordA.length > 7 || wordB.length > 7)) {
    subConceptId = 'formal-informal';
  } else if (q.difficulty === 1) {
    subConceptId = 'common-synonyms';
  } else if (isAdj) {
    subConceptId = 'adjective-synonyms';
  } else {
    subConceptId = 'common-synonyms';
  }

  return { questionId: q.id, subConceptId, confidence };
});

// =============================================
// ANTONYMS MAPPING
// =============================================
const antonymsQs = vrData.topics.antonyms.questions;
const antonymsMappings = antonymsQs.map(q => {
  const wordA = q.setA[q.correctPair[0]].toLowerCase();
  const wordB = q.setB[q.correctPair[1]].toLowerCase();

  let subConceptId;
  let confidence = 'high';

  // Hard vocab
  const hardAnts = [
    'benevolent', 'malevolent', 'eloquent', 'inarticulate', 'gregarious', 'reclusive',
    'jovial', 'morose', 'industrious', 'mundane', 'extraordinary', 'negligent',
    'attentive', 'resilient', 'tenacious', 'clandestine', 'tranquil', 'turbulent',
    'profound', 'superficial', 'barren', 'fertile', 'vivid', 'flourish', 'wither',
    'absurd', 'sensible', 'fragrant', 'stale'
  ];

  // Emotion words
  const emotionAnts = [
    'happy', 'sad', 'cheerful', 'gloomy', 'joyful', 'sorrowful', 'furious', 'calm',
    'optimistic', 'pessimistic', 'confident', 'nervous', 'brave', 'cowardly',
    'scared', 'bold', 'timid', 'grateful', 'ungrateful', 'jovial', 'morose'
  ];

  // Verb words
  const verbAnts = [
    'expand', 'shrink', 'increase', 'decrease', 'arrive', 'depart', 'borrow', 'lend',
    'accept', 'reject', 'refuse', 'praise', 'criticise', 'whisper', 'shout',
    'gather', 'scatter', 'unite', 'divide', 'advance', 'retreat', 'reveal', 'conceal',
    'protect', 'attack', 'repair', 'damage', 'break', 'mend', 'forgive', 'blame',
    'punish', 'reward', 'flourish', 'wither', 'encourage', 'discourage', 'prohibit',
    'allow', 'simplify', 'complicate', 'hinder', 'assist', 'improve', 'worsen',
    'vanish', 'appear', 'freeze', 'melt', 'hesitate', 'proceed', 'command', 'obey',
    'include', 'exclude'
  ];

  // Adjective words
  const adjAnts = [
    'hot', 'cold', 'big', 'small', 'tall', 'short', 'fast', 'slow', 'light', 'heavy',
    'loud', 'quiet', 'wide', 'narrow', 'thick', 'thin', 'rough', 'smooth', 'sharp',
    'blunt', 'deep', 'shallow', 'bright', 'dim', 'clean', 'dirty', 'rich', 'poor',
    'strong', 'weak', 'hard', 'soft', 'dark', 'young', 'old', 'ancient', 'modern',
    'early', 'late', 'full', 'empty', 'open', 'shut', 'loose', 'tight', 'damp', 'dry',
    'curved', 'straight', 'distant', 'nearby', 'familiar', 'strange', 'complex', 'simple',
    'rare', 'common', 'genuine', 'fake', 'hostile', 'friendly', 'tame', 'wild',
    'rigid', 'flexible', 'fragile', 'sturdy', 'visible', 'hidden', 'vacant', 'occupied',
    'beautiful', 'ugly', 'cautious', 'reckless', 'gentle', 'fierce', 'polite', 'rude',
    'honest', 'dishonest', 'clever', 'foolish', 'patient', 'busy', 'lazy',
    'steady', 'wobbly', 'generous', 'mean', 'serious', 'funny', 'dull', 'vivid',
    'natural', 'artificial', 'guilty', 'innocent', 'frequent', 'occasional',
    'voluntary', 'compulsory', 'cunning', 'selfish', 'transparent', 'opaque',
    'essential', 'optional', 'significant', 'trivial', 'elaborate', 'plain',
    'inferior', 'superior', 'lenient', 'strict', 'modest', 'boastful'
  ];

  // Graded vs complementary
  const gradedWords = [
    'maximum', 'minimum', 'inferior', 'superior', 'abundant', 'scarce',
    'adequate', 'excessive'
  ];

  // Prefix antonyms check
  const isPrefixOpposite = (a, b) => {
    if (a === 'patient' && b === 'impatient') return true;
    if (a === 'impatient' && b === 'patient') return true;
    if (a === 'honest' && b === 'dishonest') return true;
    if (a === 'dishonest' && b === 'honest') return true;
    if (a === 'polite' && b === 'impolite') return true;
    if (a === 'visible' && b === 'invisible') return true;
    if (a === 'comfortable' && b === 'uncomfortable') return true;
    if (a === 'possible' && b === 'impossible') return true;
    if (a === 'regular' && b === 'irregular') return true;
    // Generic prefix check
    const prefixes = ['im', 'un', 'dis', 'in', 'ir'];
    for (const p of prefixes) {
      if (a.startsWith(p) && b === a.slice(p.length)) return true;
      if (b.startsWith(p) && a === b.slice(p.length)) return true;
    }
    return false;
  };

  const isHard = q.difficulty === 3 && (hardAnts.includes(wordA) || hardAnts.includes(wordB));
  const isPrefix = isPrefixOpposite(wordA, wordB);
  const isEmotion = emotionAnts.includes(wordA) || emotionAnts.includes(wordB);
  const isVerb = verbAnts.includes(wordA) || verbAnts.includes(wordB);
  const isGraded = gradedWords.includes(wordA) || gradedWords.includes(wordB);
  const isAdj = adjAnts.includes(wordA) || adjAnts.includes(wordB);

  if (isHard) {
    subConceptId = 'hard-vocab-antonyms';
  } else if (isPrefix) {
    subConceptId = 'prefix-antonyms';
  } else if (isEmotion && !isVerb) {
    subConceptId = 'emotion-antonyms';
  } else if (isVerb) {
    subConceptId = 'verb-antonyms';
  } else if (isGraded) {
    subConceptId = 'graded-vs-complementary';
  } else if (q.difficulty === 1 && isAdj) {
    subConceptId = 'basic-opposites';
  } else if (isAdj) {
    subConceptId = 'adjective-antonyms';
  } else if (q.difficulty === 1) {
    subConceptId = 'basic-opposites';
  } else {
    subConceptId = 'adjective-antonyms';
    confidence = 'medium';
  }

  return { questionId: q.id, subConceptId, confidence };
});

// =============================================
// VERBAL ANALOGIES MAPPING
// =============================================
const vaQs = vrData.topics.verbalAnalogies.questions;

// Manually classify all 125 questions by relationship type
const vaClassification = {};

// Young-Adult: baby animal to adult animal
[3, 77, 78, 79, 80, 81, 82, 103, 123].forEach(id => vaClassification[id] = 'young-adult');

// Tool-User: worker and their tool/equipment
[1, 13, 14, 53, 56, 57, 58, 59, 60, 61, 62, 71, 72, 73, 74, 75, 76, 111, 116].forEach(id => vaClassification[id] = 'tool-user');

// Part-Whole: component of a larger thing
[5, 6, 7, 8, 16, 33, 34, 36, 37, 38, 39, 40, 41, 42, 101, 108, 112, 114, 115, 119].forEach(id => vaClassification[id] = 'part-whole');

// Cause-Effect: one causes another
[10, 93, 94, 95, 96, 113].forEach(id => vaClassification[id] = 'cause-effect');

// Synonym-Antonym pairs: word pairs that are synonyms or antonyms
[21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 63, 64, 65, 66, 67, 68, 69, 70, 97, 98, 99, 100, 106, 120, 124].forEach(id => vaClassification[id] = 'synonym-antonym-pairs');

// Animal-Home: animal and dwelling
[9, 18, 117].forEach(id => vaClassification[id] = 'animal-home');

// Category-Specific: example of a category
[43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 109, 110, 121].forEach(id => vaClassification[id] = 'category-specific');

// Creator-Creation: maker and product
[20, 83, 84, 85, 86, 87, 105, 125].forEach(id => vaClassification[id] = 'creator-creation');

// Remaining questions classified by their relationship pattern:
// Q2: glove/hand, helmet/head -> part-whole (clothing to body part)
[2].forEach(id => vaClassification[id] = 'part-whole');
// Q4: doctor/patient, teacher/student -> tool-user (professional to client)
[4].forEach(id => vaClassification[id] = 'tool-user');
// Q11: conductor/orchestra, captain/team -> tool-user (leader to group)
[11].forEach(id => vaClassification[id] = 'tool-user');
// Q12: bark/dog, meow/cat -> part-whole (sound to animal)
[12].forEach(id => vaClassification[id] = 'part-whole');
// Q15: aunt/uncle, niece/nephew -> synonym-antonym-pairs (gender pairs)
[15].forEach(id => vaClassification[id] = 'synonym-antonym-pairs');
// Q17: breakfast/morning, supper/evening -> part-whole (meal to time)
[17].forEach(id => vaClassification[id] = 'part-whole');
// Q19: vine/grape, tree/apple -> part-whole (plant to fruit)
[19].forEach(id => vaClassification[id] = 'part-whole');
// Q35: hand/clock, key/lock -> part-whole
[35].forEach(id => vaClassification[id] = 'part-whole');
// Q54: eye/see, ear/hear -> tool-user (organ to function)
[54].forEach(id => vaClassification[id] = 'tool-user');
// Q55: umbrella/rain, coat/cold -> tool-user (protection)
[55].forEach(id => vaClassification[id] = 'tool-user');
// Q88: school/learn, kitchen/cook -> category-specific (place to activity)
[88, 89, 90, 91, 92].forEach(id => vaClassification[id] = 'category-specific');
// Q102: sight/eye, hearing/ear -> part-whole (sense to organ)
[102].forEach(id => vaClassification[id] = 'part-whole');
// Q104: lunch/breakfast, dinner/supper -> synonym-antonym-pairs (meal pairs)
[104].forEach(id => vaClassification[id] = 'synonym-antonym-pairs');
// Q107: car/drive, aeroplane/fly -> tool-user (vehicle to action)
[107].forEach(id => vaClassification[id] = 'tool-user');
// Q118: queen/king, duchess/duke -> synonym-antonym-pairs (gender pairs)
[118].forEach(id => vaClassification[id] = 'synonym-antonym-pairs');
// Q122: conductor/orchestra, captain/team -> tool-user (leader to group)
[122].forEach(id => vaClassification[id] = 'tool-user');

const vaMappings = vaQs.map(q => {
  const subConceptId = vaClassification[q.id];
  if (!subConceptId) {
    console.error('VA: No classification for Q' + q.id + ': ' + q.question);
    return { questionId: q.id, subConceptId: 'part-whole', confidence: 'low' };
  }
  return { questionId: q.id, subConceptId, confidence: 'high' };
});

// =============================================
// ODD TWO OUT MAPPING
// =============================================
const otoQs = vrData.topics.oddTwoOut.questions;

const otoClassification = {};

// Concrete categories: obvious physical/tangible category splits (fruits vs veg, animals vs transport, etc.)
[3, 4, 5, 6, 7, 8, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 101, 102, 103, 104, 105, 106, 107, 108].forEach(id => otoClassification[id] = 'concrete-categories');

// Abstract categories: less obvious, meaning-based groups
[10, 13, 15, 17, 18, 19, 20, 59, 60, 82, 92, 110, 116, 118, 119].forEach(id => otoClassification[id] = 'abstract-categories');

// Function categories: grouped by function/purpose
[2, 53, 54, 55, 56, 57, 58, 65, 66, 70, 73, 74, 91, 109, 117].forEach(id => otoClassification[id] = 'function-categories');

// Material categories: grouped by material/substance
[11, 64, 81, 113, 114, 121].forEach(id => otoClassification[id] = 'material-categories');

// Category within category: narrower splits within a broader group
[9, 12, 14, 16, 45, 46, 47, 48, 49, 50, 51, 52, 61, 62, 63, 67, 68, 71, 72, 75, 76, 77, 78, 79, 85, 86, 90, 94, 95, 97, 98, 111, 112, 115, 120, 124, 125].forEach(id => otoClassification[id] = 'category-within-category');

// Hard vocabulary: difficulty is knowing what words mean
[80, 83, 84, 87, 88, 89, 93, 96, 99, 100, 122, 123].forEach(id => otoClassification[id] = 'hard-vocabulary');

// Red herring words: misleading words that look like they belong
[1, 69].forEach(id => otoClassification[id] = 'red-herring-words');

const otoMappings = otoQs.map(q => {
  const subConceptId = otoClassification[q.id];
  if (!subConceptId) {
    console.error('OTO: No classification for Q' + q.id);
    return { questionId: q.id, subConceptId: 'concrete-categories', confidence: 'low' };
  }
  return { questionId: q.id, subConceptId, confidence: 'high' };
});

// =============================================
// COMBINE ALL 16 TOPICS
// =============================================
const combined = {
  synonyms: synonymsMappings,
  antonyms: antonymsMappings,
  verbalAnalogies: vaMappings,
  oddTwoOut: otoMappings,
  compoundWords: batch2b.compoundWords,
  hiddenWords: batch2b.hiddenWords,
  letterMove: batch2b.letterMove,
  missingLettersWords: batch2b.missingLettersWords,
  letterCodes: batch2a.letterCodes,
  letterPairSeries: batch2a.letterPairSeries,
  numberSeries: batch2a.numberSeries,
  letterSums: batch2a.letterSums,
  wordCodeAnalogies: batch1.wordCodeAnalogies,
  numberWordCodes: batch1.numberWordCodes,
  logicAndLanguage: batch1.logicAndLanguage,
  sharedLetter: batch1.sharedLetter
};

// =============================================
// VALIDATION
// =============================================
let totalCount = 0;
const errors = [];

for (const [topic, entries] of Object.entries(combined)) {
  if (!Array.isArray(entries)) {
    errors.push(topic + ' is not an array: ' + typeof entries);
    continue;
  }
  if (entries.length !== 125) {
    errors.push(topic + ' has ' + entries.length + ' entries (expected 125)');
  }
  // Check all IDs 1-125 present
  const ids = new Set(entries.map(e => e.questionId));
  for (let i = 1; i <= 125; i++) {
    if (!ids.has(i)) {
      errors.push(topic + ' missing questionId ' + i);
    }
  }
  // Check for duplicates
  if (ids.size !== entries.length) {
    errors.push(topic + ' has duplicate questionIds');
  }
  totalCount += entries.length;
}

if (errors.length > 0) {
  console.error('VALIDATION ERRORS:');
  errors.forEach(e => console.error('  - ' + e));
} else {
  console.log('VALIDATION PASSED');
}

console.log('\nTotal topics: ' + Object.keys(combined).length);
console.log('Total entries: ' + totalCount);
console.log('\nPer-topic counts:');
for (const [topic, entries] of Object.entries(combined)) {
  console.log('  ' + topic + ': ' + entries.length);
}

// Sub-concept distribution for the 4 new topics
console.log('\n--- Synonyms sub-concept distribution ---');
const synDist = {};
synonymsMappings.forEach(m => { synDist[m.subConceptId] = (synDist[m.subConceptId] || 0) + 1; });
Object.entries(synDist).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log('  ' + k + ': ' + v));

console.log('\n--- Antonyms sub-concept distribution ---');
const antDist = {};
antonymsMappings.forEach(m => { antDist[m.subConceptId] = (antDist[m.subConceptId] || 0) + 1; });
Object.entries(antDist).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log('  ' + k + ': ' + v));

console.log('\n--- Verbal Analogies sub-concept distribution ---');
const vaDist = {};
vaMappings.forEach(m => { vaDist[m.subConceptId] = (vaDist[m.subConceptId] || 0) + 1; });
Object.entries(vaDist).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log('  ' + k + ': ' + v));

console.log('\n--- Odd Two Out sub-concept distribution ---');
const otoDist = {};
otoMappings.forEach(m => { otoDist[m.subConceptId] = (otoDist[m.subConceptId] || 0) + 1; });
Object.entries(otoDist).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log('  ' + k + ': ' + v));

// Write output
fs.writeFileSync(path.join(ROOT, 'public/vr-question-lesson-map.json'), JSON.stringify(combined, null, 2));
console.log('\nWritten to public/vr-question-lesson-map.json');

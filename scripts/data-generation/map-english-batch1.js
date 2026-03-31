// Map English questions (spelling, punctuation, grammar) to micro-lesson sub-concepts
// Uses explanation text + segment text for pattern matching

const fs = require('fs');
const path = require('path');

const spelling = JSON.parse(fs.readFileSync(path.join(__dirname, 'mappings', 'spelling-raw.json'), 'utf8'));
const punctuation = JSON.parse(fs.readFileSync(path.join(__dirname, 'mappings', 'punctuation-raw.json'), 'utf8'));
const grammar = JSON.parse(fs.readFileSync(path.join(__dirname, 'mappings', 'grammar-raw.json'), 'utf8'));

// ============================================================
// SPELLING MAPPING
// Sub-concepts: homophones, silent-letters, double-letters, i-before-e,
//   suffix-ful, suffix-pairs, unexpected-sounds, spelling-demons,
//   prefix-spelling, able-ible, pluralisation, noun-verb-confusables,
//   unstressed-vowels, suffix-adding-rules
// ============================================================

function mapSpelling(q) {
  const exp = (q.exp || '').toLowerCase();
  const seg = (q.seg || '').toLowerCase();
  const combined = exp + ' ' + seg;

  // No mistake questions - map to spelling-demons as general
  if (exp.includes('no spelling mistake') || exp.includes('there is no spelling')) {
    return { subConceptId: 'spelling-demons', confidence: 'medium' };
  }

  // HOMOPHONES - wrong homophone used (hear/here, their/there, etc.)
  const homophonePatterns = [
    /homophones?/i,
    /should be 'hear'\b.*\bhere\b.*means/i,
    /should be 'here'\b.*\bhear\b.*means/i,
    /'here' means.*'hear' means/i,
    /'hear' means.*'here' means/i,
    /should be '(their|there|they're)'/i,
    /should be '(your|you're)'/i,
    /should be '(its|it's)'/i,
    /should be '(to|too|two)'/i,
    /should be '(where|wear)'/i,
    /should be '(knew|new)'/i,
    /should be '(would|wood)'/i,
    /should be '(our|hour)'/i,
    /should be '(whether|weather)'/i,
    /should be '(allowed|aloud)'/i,
    /should be '(who's|whose)'/i,
    /should be '(affect|effect)'/i,
    /should be '(passed|past)'/i,
    /should be '(course|coarse)'/i,
    /should be '(might|mite)'/i,
    /should be '(through|threw)'/i,
    /should be '(bee|be)'/i,
    /should be '(write|right)'/i,
    /should be '(piece|peace)'/i,
    /should be '(brake|break)'/i,
    /should be '(bare|bear)'/i,
    /should be '(seen|scene)'/i,
    /should be '(waist|waste)'/i,
    /should be '(cereal|serial)'/i,
    /should be '(stationery|stationary)'/i,
    /should be '(principal|principle)'/i,
    /should be '(council|counsel)'/i,
    /should be '(led|lead)'/i,
    /should be '(steel|steal)'/i,
    /should be '(sole|soul)'/i,
    /should be '(medal|meddle)'/i,
    /should be '(compliment|complement)'/i,
    /should be '(ascent|assent)'/i,
    /should be '(desert|dessert)'/i,
    /should be '(isle|aisle)'/i,
    /should be '(morning|mourning)'/i,
    /should be '(rain|reign|rein)'/i,
    /should be '(sight|site)'/i,
    /should be '(herd|heard)'/i,
    /should be '(groan|grown)'/i,
    /should be '(throne|thrown)'/i,
    /should be '(draft|draught)'/i,
    /should be '(storey|story)'/i,
    /should be '(licence|license)'/i,
    /should be '(guessed|guest)'/i,
    /should be '(bored|board)'/i,
    /should be '(rode|road)'/i,
    /should be '(flee|flea)'/i,
    /should be '(current|currant)'/i,
    /should be '(ate|eight)'/i,
    /should be '(weight|wait)'/i,
    /should be '(great|grate)'/i,
    /should be '(flower|flour)'/i,
    /should be '(meet|meat)'/i,
    /should be '(sea|see)'/i,
    /should be '(son|sun)'/i,
    /should be '(tail|tale)'/i,
    /should be '(blew|blue)'/i,
    /should be '(dye|die)'/i,
    /should be '(pair|pear|pare)'/i,
    /should be '(plain|plane)'/i,
    /should be '(prey|pray)'/i,
    /should be '(role|roll)'/i,
    /should be '(way|weigh)'/i,
    /should be '(weak|week)'/i,
    /should be '(which|witch)'/i,
    /should be '(one|won)'/i,
    /should be '(nose|knows)'/i,
    /should be '(bean|been)'/i,
    /should be '(grown|groan)'/i,
    /should be '(thrown|throne)'/i,
  ];

  // Check explanation for homophone indicators
  const isHomophone = homophonePatterns.some(p => p.test(exp)) ||
    (exp.includes('sound the same but mean different') ||
     exp.includes('they sound the same') ||
     exp.includes('past tense of \'eat\'') && exp.includes('number 8') ||
     exp.includes('past tense of \'throw\'') && exp.includes('one side') ||
     (exp.includes("'") && exp.includes('means') && exp.includes('not') &&
      (exp.includes('shows possession') || exp.includes('refers to a place') ||
       exp.includes('is a verb') || exp.includes('means to listen') ||
       exp.includes('means in this place') || exp.includes('means not old') ||
       exp.includes('means correct') || exp.includes('opposite of left') ||
       exp.includes('shows direction') || exp.includes('means also') ||
       exp.includes('means permitted') || exp.includes('out loud') ||
       exp.includes('means possibly') || exp.includes('tiny creature'))));

  if (isHomophone) {
    return { subConceptId: 'homophones', confidence: 'high' };
  }

  // NOUN-VERB-CONFUSABLES (practice/practise, advice/advise, etc.)
  if (exp.includes('practise') && exp.includes('practice') && (exp.includes('noun') || exp.includes('verb'))) {
    return { subConceptId: 'noun-verb-confusables', confidence: 'high' };
  }
  if (exp.includes('licence') && exp.includes('license')) {
    return { subConceptId: 'noun-verb-confusables', confidence: 'high' };
  }
  if (exp.includes('advice') && exp.includes('advise')) {
    return { subConceptId: 'noun-verb-confusables', confidence: 'high' };
  }
  if (exp.includes('prophecy') && exp.includes('prophesy')) {
    return { subConceptId: 'noun-verb-confusables', confidence: 'high' };
  }

  // SILENT LETTERS
  if (exp.includes('silent') || exp.includes("the 'k'") && exp.includes('silent') ||
      exp.includes("'p' is silent") || exp.includes("'b' is silent") ||
      exp.includes("'c' is silent") || exp.includes("'g' is silent") ||
      exp.includes("'w' is silent") || exp.includes("'h' is silent") ||
      exp.includes("'t' is silent") || exp.includes("'d' is silent") ||
      exp.includes("silent 'k'") || exp.includes("silent 'p'") ||
      exp.includes("silent 'b'") || exp.includes("silent 'c'") ||
      exp.includes("silent 'g'") || exp.includes("silent 'w'") ||
      exp.includes("silent 'h'") || exp.includes("silent 't'") ||
      exp.includes("silent 'd'")) {
    return { subConceptId: 'silent-letters', confidence: 'high' };
  }

  // I-BEFORE-E rule
  if (exp.includes('i before e') || exp.includes("'i' before 'e'") ||
      exp.includes('i before e except after c') ||
      (exp.includes("'ei'") && exp.includes("after 'c'"))) {
    return { subConceptId: 'i-before-e', confidence: 'high' };
  }

  // -ABLE vs -IBLE
  if (exp.includes('-able') || exp.includes('-ible') ||
      exp.includes("ends in '-able'") || exp.includes("ends in '-ible'") ||
      (exp.includes('able') && exp.includes('ible'))) {
    return { subConceptId: 'able-ible', confidence: 'high' };
  }

  // SUFFIX -FUL (only one L)
  if ((exp.includes('-ful') && exp.includes("one 'l'")) ||
      exp.includes("suffix '-ful'") || exp.includes("forget-ful") ||
      (exp.includes('+ ful =') || exp.includes('+ ful')) ||
      exp.includes("beauti-ful")) {
    return { subConceptId: 'suffix-ful', confidence: 'high' };
  }
  // Also catch specific -ful misspellings
  if (exp.includes("'forgetfull'") || exp.includes("'beautifull'") ||
      exp.includes("'wonderfull'") || exp.includes("'playfull'") ||
      exp.includes("'helpfull'") || exp.includes("'carefull'") ||
      exp.includes("'painfull'") || exp.includes("'powerfull'") ||
      exp.includes("'beautful'")) {
    return { subConceptId: 'suffix-ful', confidence: 'high' };
  }

  // SUFFIX PAIRS (-tion/-sion, -cian/-tion, -ance/-ence, etc.)
  if (exp.includes("'-tion'") || exp.includes("'-sion'") || exp.includes("'-cian'") ||
      exp.includes("ends in '-tion'") || exp.includes("ends in '-sion'") ||
      exp.includes("ends in '-cian'") || exp.includes("ends in '-ance'") ||
      exp.includes("ends in '-ence'") || exp.includes("ends in '-ment'") ||
      exp.includes("ends in '-ant'") || exp.includes("ends in '-ent'") ||
      exp.includes("ends in '-ous'") || exp.includes("ends in '-ious'") ||
      exp.includes("ends in '-eous'") || exp.includes("ends in '-ally'") ||
      exp.includes("ends in '-ary'") || exp.includes("ends in '-ery'") ||
      exp.includes("ends in '-ory'") ||
      (exp.includes('-tion') && exp.includes('not') && exp.includes('-sion')) ||
      (exp.includes('-sion') && exp.includes('not') && exp.includes('-tion')) ||
      (exp.includes('-cian') && exp.includes('person')) ||
      (exp.includes('-ance') && exp.includes('not') && exp.includes('-ence')) ||
      (exp.includes('-ence') && exp.includes('not') && exp.includes('-ance')) ||
      (exp.includes('-ment') && exp.includes('not') && exp.includes('-mant'))) {
    return { subConceptId: 'suffix-pairs', confidence: 'high' };
  }

  // DOUBLE LETTERS
  if (exp.includes('double') && (exp.includes("'c'") || exp.includes("'l'") ||
      exp.includes("'m'") || exp.includes("'n'") || exp.includes("'p'") ||
      exp.includes("'r'") || exp.includes("'s'") || exp.includes("'t'") ||
      exp.includes("'f'") || exp.includes("'g'"))) {
    return { subConceptId: 'double-letters', confidence: 'high' };
  }
  // Also catch patterns like "needs double" or "it needs" + letter
  if (/needs? double/i.test(exp) || /double '[a-z]'/i.test(exp)) {
    return { subConceptId: 'double-letters', confidence: 'high' };
  }

  // SUFFIX ADDING RULES (dropping e, doubling consonant, etc.)
  if (exp.includes("drop the 'e'") || exp.includes("dropping the 'e'") ||
      exp.includes("keep the 'e'") || exp.includes("drop the final") ||
      exp.includes('when adding') && exp.includes("'-") ||
      exp.includes('double the consonant') || exp.includes('double the final') ||
      exp.includes("before adding '-") || exp.includes("suffix is '-lessly'") ||
      exp.includes("keep the") && exp.includes("when adding") ||
      exp.includes("+ ly =") || exp.includes("+ ing =") ||
      exp.includes("+ ed =") || exp.includes("+ tion =") ||
      exp.includes("+ ment =") || exp.includes("+ ness =")) {
    return { subConceptId: 'suffix-adding-rules', confidence: 'high' };
  }

  // PREFIX SPELLING (un-, dis-, mis-, re-, etc.)
  if (exp.includes('prefix') || exp.includes("'un-'") || exp.includes("'dis-'") ||
      exp.includes("'mis-'") || exp.includes("'re-'") || exp.includes("'pre-'") ||
      exp.includes("'super-'") || exp.includes("'anti-'") || exp.includes("'auto-'")) {
    return { subConceptId: 'prefix-spelling', confidence: 'high' };
  }

  // PLURALISATION
  if (exp.includes('plural') || exp.includes("add '-es'") || exp.includes("add '-s'") ||
      exp.includes("change 'y' to 'ies'") || exp.includes("change the 'y' to 'ies'") ||
      exp.includes("'y' to 'ies'") || exp.includes("consonant + 'y'") ||
      exp.includes("change the 'f' to 'ves'") ||
      exp.includes("irregular plural")) {
    return { subConceptId: 'pluralisation', confidence: 'high' };
  }

  // UNSTRESSED VOWELS
  if (exp.includes('unstressed') || exp.includes('schwa') ||
      exp.includes("do not skip the 'u'") || exp.includes("do not forget the 'i'") ||
      exp.includes("there is an 'e' not an 'a'") || exp.includes("there is an 'i' not an 'a'") ||
      exp.includes("there is an 'a' not an 'e'")) {
    return { subConceptId: 'unstressed-vowels', confidence: 'medium' };
  }

  // UNEXPECTED SOUNDS (words where spelling doesn't match pronunciation)
  // Check for specific 'ough' words, unusual sound patterns
  if (exp.includes('-ough') || exp.includes("ough") && (exp.includes("sounds like") || exp.includes("although") || exp.includes("enough") || exp.includes("through") || exp.includes("thought"))) {
    return { subConceptId: 'unexpected-sounds', confidence: 'medium' };
  }

  // SPELLING DEMONS - common misspellings that don't fit other categories
  // This is the catch-all for tricky words
  return { subConceptId: 'spelling-demons', confidence: 'medium' };
}

// ============================================================
// PUNCTUATION MAPPING
// Sub-concepts: apostrophe-contraction, apostrophe-possession, capital-letters,
//   commas-lists, commas-clauses, speech-marks, question-exclamation,
//   brackets-colons, its-vs-its, commas-parenthesis, commas-ambiguity,
//   ellipsis, hyphens, dashes
// ============================================================

function mapPunctuation(q) {
  const exp = (q.exp || '').toLowerCase();
  const seg = (q.seg || '').toLowerCase();

  // No mistake - classify by what's tested (if identifiable)
  if (exp.includes('no punctuation error') || exp.includes('no mistake') || exp.includes('there is no')) {
    // Check what the "no mistake" question was testing
    if (exp.includes("'its'") || exp.includes("possessive") && exp.includes("'it")) {
      return { subConceptId: 'its-vs-its', confidence: 'high' };
    }
    if (exp.includes('apostrophe') || exp.includes("possessive") || exp.includes("children's") || exp.includes("women's") || exp.includes("men's") || exp.includes("boys'") || exp.includes("girls'") || exp.includes("cats'") || exp.includes("teachers'") || exp.includes("pupils'") || exp.includes("leavers'") || exp.includes("postman's") || exp.includes("parents'") || exp.includes("james's") || exp.includes("frances's") || exp.includes("davies's") || exp.includes("thomas's")) {
      return { subConceptId: 'apostrophe-possession', confidence: 'high' };
    }
    if (exp.includes('contraction') || exp.includes('shortened')) {
      return { subConceptId: 'apostrophe-contraction', confidence: 'high' };
    }
    if (exp.includes('capital') || exp.includes('proper noun') || exp.includes('capitalised')) {
      return { subConceptId: 'capital-letters', confidence: 'high' };
    }
    if (exp.includes('comma') && (exp.includes('subordinate') || exp.includes('clause'))) {
      return { subConceptId: 'commas-clauses', confidence: 'high' };
    }
    if (exp.includes('comma') && (exp.includes('list') || exp.includes('oxford'))) {
      return { subConceptId: 'commas-lists', confidence: 'high' };
    }
    if (exp.includes('speech') || exp.includes('split speech')) {
      return { subConceptId: 'speech-marks', confidence: 'high' };
    }
    if (exp.includes('semi-colon') || exp.includes('semicolon') || exp.includes('colon')) {
      return { subConceptId: 'brackets-colons', confidence: 'high' };
    }
    if (exp.includes('bracket')) {
      return { subConceptId: 'brackets-colons', confidence: 'high' };
    }
    if (exp.includes('non-defining') || exp.includes('appositive') || exp.includes('parenthetical')) {
      return { subConceptId: 'commas-parenthesis', confidence: 'high' };
    }
    if (exp.includes('hyphen') || exp.includes('compound noun') || exp.includes('mother-in-law')) {
      return { subConceptId: 'hyphens', confidence: 'high' };
    }
    if (exp.includes('comma') && exp.includes('participle')) {
      return { subConceptId: 'commas-clauses', confidence: 'high' };
    }
    // General no-mistake - check segments for clues
    if (seg.includes("'s") || seg.includes("s'")) {
      return { subConceptId: 'apostrophe-possession', confidence: 'medium' };
    }
    if (seg.includes("n't") || seg.includes("'re") || seg.includes("'ve") || seg.includes("'ll") || seg.includes("'m") || seg.includes("'d")) {
      return { subConceptId: 'apostrophe-contraction', confidence: 'medium' };
    }
    // True general no-mistake
    return { subConceptId: 'capital-letters', confidence: 'medium' };
  }

  // Split speech requiring full stop after reporting clause (new sentence starts)
  if (exp.includes('full stop is needed after') && exp.includes('new sentence') && exp.includes('speech')) {
    return { subConceptId: 'speech-marks', confidence: 'high' };
  }
  if (exp.includes("a full stop") && exp.includes("new sentence") && seg.includes('"')) {
    return { subConceptId: 'speech-marks', confidence: 'high' };
  }

  // ITS vs IT'S (special case - gets its own sub-concept)
  if ((exp.includes("'it's'") || exp.includes("'its'")) &&
      (exp.includes('possession') || exp.includes('possessive') || exp.includes("'it is'") || exp.includes("'it has'"))) {
    return { subConceptId: 'its-vs-its', confidence: 'high' };
  }

  // APOSTROPHE - CONTRACTION (missing apostrophes in contractions)
  if (exp.includes('apostrophe') && (exp.includes('shortened') || exp.includes('contraction') || exp.includes('removed') || exp.includes("'not'"))) {
    return { subConceptId: 'apostrophe-contraction', confidence: 'high' };
  }
  // Pattern: "'Xnt' should be 'Xn't'" or "'Xve' should be 'X've'" etc.
  const contractionWords = ['didnt', "didn't", 'dont', "don't", 'cant', "can't", 'wont', "won't",
    'shouldnt', "shouldn't", 'couldnt', "couldn't", 'wouldnt', "wouldn't", 'mustnt', "mustn't",
    'havent', "haven't", 'hasnt', "hasn't", 'hadnt', "hadn't", 'wasnt', "wasn't", 'werent', "weren't",
    'arent', "aren't", 'isnt', "isn't", 'neednt', "needn't", 'im', "i'm", 'ive', "i've",
    'well', "we'll", 'were', "we're", 'weve', "we've", 'theyre', "they're", 'theyve', "they've",
    'theyd', "they'd", 'shes', "she's", 'hed', "he'd", 'shell', "she'll", 'youre', "you're",
    'lets', "let's", 'whos', "who's", 'whats', "what's", 'theres', "there's"];

  for (const word of contractionWords) {
    if (seg.includes(word) && exp.includes('apostrophe')) {
      return { subConceptId: 'apostrophe-contraction', confidence: 'high' };
    }
  }
  // Direct contraction patterns in explanation
  if (exp.includes("should be '") && (
    exp.includes("n't'") || exp.includes("'m'") || exp.includes("'ve'") ||
    exp.includes("'re'") || exp.includes("'ll'") || exp.includes("'d'"))) {
    if (exp.includes("'it's'") && (exp.includes("'it is'") || exp.includes("'it has'"))) {
      return { subConceptId: 'its-vs-its', confidence: 'high' };
    }
    return { subConceptId: 'apostrophe-contraction', confidence: 'high' };
  }

  // APOSTROPHE - POSSESSION
  if (exp.includes('possessive') || exp.includes('possession') || exp.includes('belongs to') ||
      exp.includes('apostrophe') && (exp.includes("'s") || exp.includes("s'"))) {
    // Already checked its-vs-its above
    return { subConceptId: 'apostrophe-possession', confidence: 'high' };
  }
  // Patterns like "'dogs' should be 'dog's'" or irregular plurals possessive
  if (exp.includes("children's") || exp.includes("women's") || exp.includes("men's") ||
      exp.includes("people's") || exp.includes("geese's") || exp.includes("mice's") ||
      exp.includes("oxen's") || exp.includes("sheep's") ||
      exp.includes("sister-in-law's") || exp.includes("daughter-in-law's") ||
      exp.includes("father-in-law's") || exp.includes("mother-in-law's")) {
    return { subConceptId: 'apostrophe-possession', confidence: 'high' };
  }

  // CAPITAL LETTERS
  if (exp.includes('capital letter') || exp.includes('proper noun') || exp.includes('lowercase')) {
    return { subConceptId: 'capital-letters', confidence: 'high' };
  }

  // SPEECH MARKS
  if (exp.includes('speech mark') || exp.includes('direct speech') ||
      exp.includes('reporting clause') || exp.includes('spoken words') ||
      exp.includes('comma before the speech') || exp.includes('comma before the direct') ||
      exp.includes("before the opening speech marks") ||
      exp.includes("inside the speech marks") ||
      exp.includes("split speech") || exp.includes("new piece of speech") ||
      exp.includes("new sentence of speech") ||
      exp.includes("speech begins with a capital") ||
      exp.includes("comma introduces direct speech") ||
      exp.includes("comma is needed") && exp.includes("speech")) {
    return { subConceptId: 'speech-marks', confidence: 'high' };
  }

  // QUESTION-EXCLAMATION
  if (exp.includes('question mark') || exp.includes('exclamation mark') ||
      exp.includes('it is a question') || exp.includes('makes it a question') ||
      exp.includes('statement or exclamation') || exp.includes('statement, not a question')) {
    return { subConceptId: 'question-exclamation', confidence: 'high' };
  }

  // COMMAS - PARENTHESIS (non-defining clauses, appositives, however/moreover)
  if (exp.includes('non-defining') || exp.includes('parenthetical') || exp.includes('appositive') ||
      exp.includes('extra information') && exp.includes('comma') ||
      exp.includes('defining relative clause') && exp.includes('comma')) {
    return { subConceptId: 'commas-parenthesis', confidence: 'high' };
  }

  // COMMAS - CLAUSES (fronted adverbials, subordinate clauses, coordinating conjunctions)
  if (exp.includes('fronted adverbial') || exp.includes('subordinate clause') ||
      exp.includes('introductory clause') ||
      (exp.includes('comma') && exp.includes('before') && exp.includes("'but'")) ||
      (exp.includes('comma') && exp.includes('after') &&
       (exp.includes('although') || exp.includes('because') || exp.includes('before') ||
        exp.includes('after') || exp.includes('when') || exp.includes('if') ||
        exp.includes('since') || exp.includes('while') || exp.includes('once') ||
        exp.includes('unless') || exp.includes('despite') || exp.includes('even though')))) {
    return { subConceptId: 'commas-clauses', confidence: 'high' };
  }

  // COMMAS - LISTS
  if (exp.includes('list') && exp.includes('comma') ||
      exp.includes('separate items') || exp.includes('separate the items') ||
      exp.includes('oxford comma') || exp.includes("commas between") && exp.includes("list")) {
    return { subConceptId: 'commas-lists', confidence: 'high' };
  }

  // COMMAS - AMBIGUITY (incorrect commas, comma splices)
  if (exp.includes('comma splice') || exp.includes('comma on its own between two main clauses') ||
      exp.includes('two independent clauses cannot be joined by a comma') ||
      exp.includes('the comma after') && exp.includes('is incorrect') ||
      exp.includes('should not be a comma between the subject') ||
      exp.includes('incorrectly placed comma')) {
    return { subConceptId: 'commas-ambiguity', confidence: 'high' };
  }

  // BRACKETS, COLONS, SEMICOLONS
  if (exp.includes('colon') || exp.includes('semicolon') || exp.includes('semi-colon') ||
      exp.includes('bracket') || exp.includes('semicolons')) {
    return { subConceptId: 'brackets-colons', confidence: 'high' };
  }

  // HYPHENS
  if (exp.includes('hyphen') || exp.includes('compound adjective') ||
      exp.includes('well-known') || exp.includes('nine-year-old') ||
      exp.includes('compound noun') && exp.includes("'-'")) {
    return { subConceptId: 'hyphens', confidence: 'high' };
  }

  // DASHES (em dashes, en dashes)
  if (exp.includes('dash') || exp.includes('em dash') || exp.includes('en dash')) {
    return { subConceptId: 'dashes', confidence: 'high' };
  }

  // ELLIPSIS
  if (exp.includes('ellipsis') || exp.includes('...')) {
    return { subConceptId: 'ellipsis', confidence: 'high' };
  }

  // Fallback - check for common remaining patterns
  if (exp.includes("should be '") && exp.includes("n't")) {
    return { subConceptId: 'apostrophe-contraction', confidence: 'medium' };
  }

  // Default fallback
  return { subConceptId: null, confidence: 'low' };
}

// ============================================================
// GRAMMAR MAPPING
// Sub-concepts: subject-verb-agreement, verb-tenses, irregular-past,
//   comparative-superlative, pronouns, conjunctions, active-passive,
//   should-have, clauses-sentence-structure, modal-verbs, formal-register,
//   expanded-noun-phrases, perfect-progressive
// ============================================================

function mapGrammar(q) {
  const exp = (q.exp || '').toLowerCase();
  const qtext = (q.q || '').toLowerCase();

  // SHOULD-HAVE (should of vs should have, could of vs could have, etc.)
  if (exp.includes("should have") || exp.includes("could have") || exp.includes("would have") ||
      exp.includes("might have") || exp.includes("must have")) {
    if (exp.includes("'of' is") || exp.includes("common mistake") && exp.includes("'of'") ||
        exp.includes("'of' is not a verb") || exp.includes("'of' is a preposition")) {
      return { subConceptId: 'should-have', confidence: 'high' };
    }
    // Third conditional / modal perfect - still relevant
    if (exp.includes('third conditional') || exp.includes('imaginary past') ||
        exp.includes('past possibility that did not happen') || exp.includes('regret')) {
      return { subConceptId: 'should-have', confidence: 'high' };
    }
    // Modal + have constructions
    if (exp.includes('modal') || exp.includes("'should have'") || exp.includes("'could have'") ||
        exp.includes("'would have'") || exp.includes("'might have'") || exp.includes("'must have'")) {
      return { subConceptId: 'should-have', confidence: 'high' };
    }
  }

  // ACTIVE-PASSIVE voice
  if (exp.includes('passive') || exp.includes('active voice') ||
      exp.includes('was + past participle') || exp.includes('is + past participle') ||
      exp.includes('are + past participle') || exp.includes('were + past participle') ||
      exp.includes('been + past participle') || exp.includes('being + past participle') ||
      exp.includes('passive voice') || exp.includes('passive form') ||
      exp.includes('past participle') && (exp.includes("'was ") || exp.includes("'were ") ||
      exp.includes("'is ") || exp.includes("'are ") || exp.includes("'been ") || exp.includes("'being "))) {
    // Check it's actually about passive, not just mentioning past participle in tense context
    if (exp.includes('passive') || exp.includes("the cake was") || exp.includes("was baked") ||
        exp.includes("was written") || exp.includes("was cancelled") || exp.includes("was founded") ||
        exp.includes("was presented") || exp.includes("are cleaned") || exp.includes("is spoken") ||
        exp.includes("will be") && exp.includes("opened") || exp.includes("have been") && exp.includes("sold") ||
        exp.includes("are being") && exp.includes("painted") || exp.includes("had been") && exp.includes("planted")) {
      return { subConceptId: 'active-passive', confidence: 'high' };
    }
  }

  // MODAL VERBS (can, could, may, might, must, shall, should, will, would, ought to)
  if (exp.includes('modal verb') || exp.includes('modal') ||
      (exp.includes("'should'") && (exp.includes('advice') || exp.includes('right thing'))) ||
      (exp.includes("'might'") && exp.includes('possibility')) ||
      (exp.includes("'may'") && exp.includes('permission')) ||
      (exp.includes("'must'") && (exp.includes('obligation') || exp.includes('rule') || exp.includes('prohibition') || exp.includes('required') || exp.includes('forbidden') || exp.includes('strong'))) ||
      (exp.includes("'must not'") && (exp.includes('rule') || exp.includes('prohibition') || exp.includes('forbidden'))) ||
      (exp.includes("'could'") && (exp.includes('possibility') || exp.includes('past ability') || exp.includes('past tense of') || exp.includes('inability'))) ||
      (exp.includes("'couldn't'") && exp.includes('inability')) ||
      (exp.includes("'shall'") && exp.includes('offer')) ||
      (exp.includes("'shall i'") && exp.includes('offer')) ||
      (exp.includes("'ought to'") && exp.includes('advice')) ||
      (exp.includes("'would'") && exp.includes('polite request')) ||
      (exp.includes("'can't have'") || exp.includes("'cannot have'")) && exp.includes('impossible') ||
      (exp.includes("should have") && exp.includes('expectation')) ||
      (exp.includes("'hardly'") && (exp.includes("'almost not'") || exp.includes("'barely'")))) {
    return { subConceptId: 'modal-verbs', confidence: 'high' };
  }

  // COMPARATIVE-SUPERLATIVE
  if (exp.includes('comparative') || exp.includes('superlative') ||
      exp.includes("'-er'") || exp.includes("'-est'") ||
      exp.includes("'more'") && exp.includes('adjective') ||
      exp.includes("'most'") && exp.includes('adjective') ||
      exp.includes("'better'") && (exp.includes("'good'") || exp.includes("'well'")) ||
      exp.includes("'worse'") && exp.includes("'bad'") ||
      exp.includes("'worst'") && exp.includes("'bad'") ||
      exp.includes("'best'") && exp.includes("'good'") ||
      exp.includes("'fewer'") && exp.includes('countable') ||
      exp.includes("'less'") && exp.includes('uncountable') ||
      exp.includes("comparing two") || exp.includes("comparing more than two") ||
      exp.includes("the more") && exp.includes("the better") ||
      exp.includes("irregular adjective") ||
      exp.includes("short adjective") && (exp.includes("add '-er'") || exp.includes("add '-est'"))) {
    return { subConceptId: 'comparative-superlative', confidence: 'high' };
  }

  // PRONOUNS (subject/object pronouns, possessive, reflexive, relative, who/whom)
  if (exp.includes('pronoun') || exp.includes('subject pronoun') || exp.includes('object pronoun') ||
      exp.includes('possessive pronoun') || exp.includes('reflexive pronoun') ||
      exp.includes('relative pronoun') ||
      (exp.includes("'who'") && (exp.includes("people") || exp.includes("subject form"))) ||
      exp.includes("'whom'") || (exp.includes("'whose'") && exp.includes("possession")) ||
      (exp.includes("'which'") && exp.includes("things")) ||
      (exp.includes("'where'") && exp.includes("places")) ||
      (exp.includes("'when'") && exp.includes("times")) ||
      (exp.includes("'that'") && exp.includes("relative")) ||
      (exp.includes("'why'") && exp.includes("reason")) ||
      (exp.includes("remove '") && exp.includes("and'")) ||
      (exp.includes("'who's'") && exp.includes("'who is'"))) {
    // Check if it's about relative clauses specifically
    if (exp.includes('relative clause') || exp.includes('relative pronoun') ||
        exp.includes('defining relative') || exp.includes('non-defining relative')) {
      return { subConceptId: 'clauses-sentence-structure', confidence: 'high' };
    }
    return { subConceptId: 'pronouns', confidence: 'high' };
  }

  // I/me test pattern
  if (exp.includes("remove '") && exp.includes("and'") ||
      exp.includes("test by removing") || exp.includes("a good test:")) {
    return { subConceptId: 'pronouns', confidence: 'high' };
  }
  // Their/there/they're, your/you're, its/it's, to/too/two in grammar context
  if ((exp.includes("'their'") || exp.includes("'there'") || exp.includes("'they're'")) &&
      (exp.includes("possession") || exp.includes("place") || exp.includes("'they are'"))) {
    return { subConceptId: 'pronouns', confidence: 'high' };
  }
  if ((exp.includes("'your'") || exp.includes("'you're'")) &&
      (exp.includes("possession") || exp.includes("'you are'"))) {
    return { subConceptId: 'pronouns', confidence: 'high' };
  }
  if ((exp.includes("'its'") || exp.includes("'it's'")) &&
      (exp.includes("possession") || exp.includes("'it is'") || exp.includes("'it has'"))) {
    return { subConceptId: 'pronouns', confidence: 'high' };
  }
  if ((exp.includes("'to'") || exp.includes("'too'") || exp.includes("'two'")) &&
      (exp.includes("direction") || exp.includes("also") || exp.includes("number"))) {
    return { subConceptId: 'pronouns', confidence: 'medium' };
  }
  // Through/threw, affect/effect, whose/who's, past/passed, advice/advise in grammar
  if ((exp.includes("'through'") || exp.includes("'threw'")) &&
      (exp.includes("past tense") || exp.includes("one side"))) {
    return { subConceptId: 'pronouns', confidence: 'medium' };
  }

  // CONJUNCTIONS (and, but, or, so, because, although, neither/nor, either/or, etc.)
  if (exp.includes('conjunction') || exp.includes('correlative') ||
      exp.includes("'neither' always pairs with 'nor'") || exp.includes("neither...nor") ||
      exp.includes("'either' always pairs with 'or'") || exp.includes("either...or") ||
      exp.includes("'either' pairs with 'or'") ||
      exp.includes("'both' always pairs with 'and'") || exp.includes("both...and") ||
      exp.includes("'both' pairs with 'and'") ||
      exp.includes("'not only...but also'") || exp.includes("not only...but") ||
      exp.includes("whether...or") || exp.includes("'whether' pairs with 'or'") ||
      exp.includes("no sooner...than") || exp.includes("'no sooner...than'") ||
      exp.includes("hardly...when") || exp.includes("'hardly...when'") ||
      (exp.includes("'but'") && exp.includes('contrast')) ||
      (exp.includes("'or'") && exp.includes('choice')) ||
      (exp.includes("'although'") && exp.includes('contrast')) ||
      (exp.includes("'because'") && exp.includes('reason')) ||
      (exp.includes("'therefore'") && exp.includes('result')) ||
      (exp.includes("'nevertheless'") && exp.includes('spite')) ||
      (exp.includes("'however'") && exp.includes('but')) ||
      (exp.includes("'provided'") && exp.includes('condition')) ||
      (exp.includes("'between'") && exp.includes('two')) ||
      (exp.includes("'among'") && exp.includes('three'))) {
    return { subConceptId: 'conjunctions', confidence: 'high' };
  }

  // SUBJECT-VERB AGREEMENT
  if (exp.includes('subject') && exp.includes('verb') && (exp.includes('agree') || exp.includes('singular') || exp.includes('plural')) ||
      exp.includes('singular subject') || exp.includes('plural subject') ||
      exp.includes('singular verb') || exp.includes('plural verb') ||
      exp.includes('collective noun') ||
      exp.includes("'each' is always singular") || exp.includes("'everyone' is") ||
      exp.includes("'everybody' is") || exp.includes("'nobody' is") || exp.includes("'neither' is") ||
      exp.includes("'each' emphasises every individual") ||
      exp.includes("'each' means every single one") ||
      exp.includes("looks plural") && exp.includes("actually a singular noun") ||
      exp.includes("can be singular or plural") && exp.includes("context") ||
      exp.includes("'every' appears before each noun") ||
      (exp.includes('singular') && (exp.includes("takes 'is'") || exp.includes("takes 'was'") ||
       exp.includes("takes 'has'") || exp.includes("use 'is'") || exp.includes("use 'was'"))) ||
      (exp.includes('plural') && (exp.includes("takes 'are'") || exp.includes("takes 'were'") ||
       exp.includes("use 'are'") || exp.includes("use 'were'"))) ||
      exp.includes("'the number of'") || exp.includes("'a number of'") ||
      (exp.includes("compound subject") && exp.includes("plural")) ||
      exp.includes("verb agrees with the subject closest") ||
      exp.includes("the real subject") && (exp.includes("singular") || exp.includes("plural")) ||
      exp.includes("needs an 's'") && exp.includes("third person") ||
      exp.includes("add 's' to the verb") || exp.includes("adds 'es'") ||
      exp.includes("singular noun") && exp.includes("we say 'the ") && exp.includes(" is'")) {
    return { subConceptId: 'subject-verb-agreement', confidence: 'high' };
  }

  // PERFECT-PROGRESSIVE tenses
  if (exp.includes('perfect continuous') || exp.includes('perfect progressive') ||
      exp.includes('past perfect continuous') || exp.includes('present perfect continuous') ||
      exp.includes('future perfect') || exp.includes("'will have'") ||
      exp.includes('had been') && exp.includes('continuous') ||
      exp.includes("been practising") || exp.includes("been playing") ||
      exp.includes("been waiting")) {
    return { subConceptId: 'perfect-progressive', confidence: 'high' };
  }

  // IRREGULAR PAST tenses
  if (exp.includes('irregular verb') || exp.includes('irregular past') ||
      (exp.includes('past tense of') && (
        exp.includes("'go'") || exp.includes("'see'") || exp.includes("'do'") ||
        exp.includes("'eat'") || exp.includes("'fly'") || exp.includes("'dig'") ||
        exp.includes("'draw'") || exp.includes("'throw'") || exp.includes("'swim'") ||
        exp.includes("'take'") || exp.includes("'give'") || exp.includes("'break'") ||
        exp.includes("'speak'") || exp.includes("'write'") || exp.includes("'drive'") ||
        exp.includes("'ride'") || exp.includes("'ring'") || exp.includes("'sing'") ||
        exp.includes("'begin'") || exp.includes("'drink'") || exp.includes("'run'") ||
        exp.includes("'know'") || exp.includes("'grow'") || exp.includes("'blow'") ||
        exp.includes("'choose'") || exp.includes("'wear'") || exp.includes("'tear'") ||
        exp.includes("'catch'") || exp.includes("'teach'") || exp.includes("'buy'") ||
        exp.includes("'think'") || exp.includes("'bring'") || exp.includes("'fight'") ||
        exp.includes("'find'") || exp.includes("'hide'") || exp.includes("'fall'") ||
        exp.includes("'bite'") || exp.includes("'freeze'") || exp.includes("'shake'"))) ||
      (exp.includes("past participle") && exp.includes("irregular"))) {
    return { subConceptId: 'irregular-past', confidence: 'high' };
  }
  // Past participle forms after has/have/had
  if (exp.includes("past participle") &&
      (exp.includes("'gone'") || exp.includes("'done'") || exp.includes("'seen'") ||
       exp.includes("'eaten'") || exp.includes("'been'") || exp.includes("'flown'") ||
       exp.includes("'written'") || exp.includes("'taken'") || exp.includes("'given'") ||
       exp.includes("'broken'") || exp.includes("'spoken'") || exp.includes("'driven'") ||
       exp.includes("'hidden'") || exp.includes("'chosen'") || exp.includes("'frozen'") ||
       exp.includes("'stolen'") || exp.includes("'sworn'") || exp.includes("'torn'") ||
       exp.includes("'worn'") || exp.includes("'bitten'") || exp.includes("'forgotten'"))) {
    return { subConceptId: 'irregular-past', confidence: 'high' };
  }

  // VERB TENSES (present simple, past simple, present/past continuous, present/past perfect)
  if (exp.includes('present tense') || exp.includes('past tense') || exp.includes('future tense') ||
      exp.includes('simple past') || exp.includes('simple present') ||
      exp.includes('present continuous') || exp.includes('past continuous') ||
      exp.includes('present perfect') || exp.includes('past perfect') ||
      exp.includes('future perfect') || exp.includes('continuous tense') ||
      exp.includes("regular habit") || exp.includes("happening right now") ||
      exp.includes("happening at the present") || exp.includes("in the past") && exp.includes("tense") ||
      exp.includes("in the future") && exp.includes("tense") ||
      exp.includes("was interrupted") || exp.includes("ongoing action") ||
      exp.includes("started in the past and continue") || exp.includes("before another past event") ||
      exp.includes("completed before a") && exp.includes("future") ||
      exp.includes("subjunctive") || exp.includes("conditional") ||
      exp.includes("'if i were'") || exp.includes("imaginary situation") ||
      exp.includes("reported speech") || exp.includes("reporting what someone said")) {
    // Check for perfect progressive specifically
    if (exp.includes('perfect continuous') || exp.includes('perfect progressive')) {
      return { subConceptId: 'perfect-progressive', confidence: 'high' };
    }
    return { subConceptId: 'verb-tenses', confidence: 'high' };
  }

  // CLAUSES & SENTENCE STRUCTURE (relative clauses, main clauses, etc.)
  if (exp.includes('relative clause') || exp.includes('main clause') || exp.includes('clause') ||
      exp.includes('inverted word order') || exp.includes('inversion')) {
    return { subConceptId: 'clauses-sentence-structure', confidence: 'high' };
  }

  // FORMAL REGISTER
  if (exp.includes('formal') || exp.includes('informal') || exp.includes('register') ||
      exp.includes('academic') || exp.includes('standard english')) {
    return { subConceptId: 'formal-register', confidence: 'high' };
  }

  // EXPANDED NOUN PHRASES (articles, determiners, adjective+noun, adverbs)
  if (exp.includes('article') || (exp.includes("'a'") && exp.includes("consonant sound")) ||
      (exp.includes("'an'") && exp.includes("vowel sound")) ||
      (exp.includes("'the'") && (exp.includes("specific") || exp.includes("unique") || exp.includes("superlative") || exp.includes("musical instrument") || exp.includes("named river"))) ||
      exp.includes('adverb') || (exp.includes('adjective') && exp.includes('noun') && exp.includes('modify')) ||
      exp.includes('linking verb') ||
      exp.includes("adverb form") || exp.includes("adverbs modify verbs") || exp.includes("describes how") ||
      exp.includes("adjectives modify nouns") ||
      exp.includes("'a' is used") || exp.includes("'an' is used") || exp.includes("'the' is used") ||
      exp.includes("we use 'the' before musical") || exp.includes("we use 'the' with named") ||
      exp.includes("'advice'") && exp.includes("noun") && exp.includes("'advise'") && exp.includes("verb")) {
    // Articles (a/an/the)
    if (exp.includes("'a'") || exp.includes("'an'") || exp.includes("'the'")) {
      if (exp.includes('consonant sound') || exp.includes('vowel sound') ||
          exp.includes('specific') || exp.includes('unique') || exp.includes('superlative') ||
          exp.includes('musical instrument') || exp.includes('named river') ||
          exp.includes("we use 'the'") || exp.includes("fixed rule")) {
        return { subConceptId: 'expanded-noun-phrases', confidence: 'high' };
      }
    }
    // Adverb vs adjective
    if (exp.includes('adverb') || exp.includes('linking verb') ||
        exp.includes("'-ly'") || exp.includes("'quietly'") || exp.includes("'slowly'") ||
        exp.includes("'quickly'") || exp.includes("'beautifully'") || exp.includes("'carefully'") ||
        exp.includes("'loudly'") || exp.includes("'neatly'") || exp.includes("'suddenly'") ||
        exp.includes("'correctly'") || exp.includes("'gracefully'") ||
        exp.includes("'well'") && exp.includes("adverb") ||
        exp.includes("'hard'") && exp.includes("adverb") ||
        exp.includes("'hardly'") && exp.includes("barely")) {
      return { subConceptId: 'expanded-noun-phrases', confidence: 'high' };
    }
    return { subConceptId: 'expanded-noun-phrases', confidence: 'medium' };
  }

  // PREPOSITIONS (dependent prepositions, movement prepositions)
  // These map to conjunctions as nearest sub-concept
  if (exp.includes('preposition') || (exp.includes("'in'") && exp.includes("months")) ||
      (exp.includes("'at'") && exp.includes("times")) || (exp.includes("'on'") && exp.includes("days")) ||
      (exp.includes("'on'") && exp.includes("surfaces")) ||
      (exp.includes("'at'") && exp.includes("specific point")) ||
      exp.includes("'over'") && exp.includes("moving") ||
      exp.includes("'under'") && exp.includes("below") ||
      exp.includes("'through'") && exp.includes("one side") ||
      exp.includes("'across'") && exp.includes("one side to the other") ||
      exp.includes("'around'") && exp.includes("circle") ||
      exp.includes("'into'") && exp.includes("inside") ||
      exp.includes("'off'") && exp.includes("away from") ||
      exp.includes("dependent preposition") || exp.includes("phrasal verb") ||
      exp.includes("'good at'") || exp.includes("'allergic to'") || exp.includes("'famous for'") ||
      exp.includes("'apologise for'") || exp.includes("'insist on'") || exp.includes("'agree on'") ||
      exp.includes("'different from'") || exp.includes("'look forward to'") || exp.includes("'remind") ||
      exp.includes("'put on'") || exp.includes("'hand in'") ||
      exp.includes("we use 'on' for") || exp.includes("we say 'at' for") ||
      exp.includes("we use 'in' with") || exp.includes("we use 'at' with") || exp.includes("we use 'on' with")) {
    return { subConceptId: 'conjunctions', confidence: 'medium' };
  }

  // Miscellaneous grammar - affect/effect, who's/whose, past/passed, etc.
  if (exp.includes("'affect'") || exp.includes("'effect'")) {
    return { subConceptId: 'pronouns', confidence: 'medium' };
  }

  // Default - try to match common patterns
  if (exp.includes("'does'") || (exp.includes("'do'") && exp.includes("singular"))) {
    return { subConceptId: 'subject-verb-agreement', confidence: 'medium' };
  }
  if (exp.includes("'doesn't'") && exp.includes("singular")) {
    return { subConceptId: 'subject-verb-agreement', confidence: 'medium' };
  }
  if (exp.includes("'despite'") || exp.includes("'whether'") || (exp.includes("'if'") && exp.includes("reported"))) {
    return { subConceptId: 'clauses-sentence-structure', confidence: 'medium' };
  }
  if (exp.includes("infinitive") || exp.includes("base form") || exp.includes("gerund")) {
    return { subConceptId: 'verb-tenses', confidence: 'medium' };
  }
  // Advice/advise noun-verb pattern
  if ((exp.includes("'advice'") && exp.includes("noun")) || (exp.includes("'advise'") && exp.includes("verb"))) {
    return { subConceptId: 'expanded-noun-phrases', confidence: 'medium' };
  }
  // Adverb patterns
  if (exp.includes("'hardly'") || exp.includes("'barely'") || exp.includes("almost not")) {
    return { subConceptId: 'expanded-noun-phrases', confidence: 'medium' };
  }

  // Generic fallback
  return { subConceptId: null, confidence: 'low' };
}

// ============================================================
// RUN MAPPINGS
// ============================================================

const result = {
  spelling: spelling.map(q => ({
    questionId: q.id,
    ...mapSpelling(q)
  })),
  punctuation: punctuation.map(q => ({
    questionId: q.id,
    ...mapPunctuation(q)
  })),
  grammar: grammar.map(q => ({
    questionId: q.id,
    ...mapGrammar(q)
  }))
};

// Stats
function printStats(topic, mappings) {
  const bySubConcept = {};
  let nullCount = 0;
  let lowCount = 0;
  for (const m of mappings) {
    if (m.subConceptId === null) {
      nullCount++;
    } else {
      bySubConcept[m.subConceptId] = (bySubConcept[m.subConceptId] || 0) + 1;
    }
    if (m.confidence === 'low') lowCount++;
  }
  console.log(`\n${topic}: ${mappings.length} questions`);
  console.log(`  Null mappings: ${nullCount}`);
  console.log(`  Low confidence: ${lowCount}`);
  console.log('  Distribution:');
  const sorted = Object.entries(bySubConcept).sort((a, b) => b[1] - a[1]);
  for (const [sc, count] of sorted) {
    console.log(`    ${sc}: ${count}`);
  }
}

printStats('SPELLING', result.spelling);
printStats('PUNCTUATION', result.punctuation);
printStats('GRAMMAR', result.grammar);

fs.writeFileSync(
  path.join(__dirname, 'mappings', 'english-batch1.json'),
  JSON.stringify(result, null, 2)
);
console.log('\nWritten to scripts/mappings/english-batch1.json');

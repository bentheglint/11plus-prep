// Shared primitives for the missing-letters question toolkit.
// All other scripts in this directory require('./lib') instead of re-implementing these.
//
// Usage: const { loadDicts, rebuildsAll, gapFirstPos, capsWordFromQuestion, REPO } = require('./lib');

'use strict';
const path = require('path');

// Repo root — three levels up from scripts/question-tools/missing-letters/
const REPO = path.resolve(__dirname, '../../..');

/**
 * loadDicts() → { DICT, COMMON }
 *
 * DICT   = Set of all words uppercased from an-array-of-english-words (274,937 words)
 * COMMON = Set built from wordlist-english tiers 10/20/35/40/50 (+ british equivalents),
 *          uppercased, UNION MANUAL_3LETTER_SEED (uppercased) so that obvious everyday
 *          3-letter words are never misclassified as uncommon.
 */
function loadDicts() {
  const words = require(path.join(REPO, 'node_modules/an-array-of-english-words'));
  const wl    = require(path.join(REPO, 'node_modules/wordlist-english'));

  const DICT = new Set(words.map(w => w.toUpperCase()));

  const COMMON = new Set();
  for (const lvl of [
    'english/10','english/20','english/35','english/40','english/50',
    'english/british/10','english/british/20','english/british/35','english/british/40','english/british/50'
  ]) {
    for (const w of wl[lvl]) COMMON.add(w.toUpperCase());
  }

  // Manual seed of common 3-letter words — copied verbatim from
  // scripts/validation/validate-missing-letters.js (single source of truth for this list).
  // Ensures obvious everyday words are never misclassified as uncommon regardless of dict build.
  const MANUAL_3LETTER_SEED = [
    'the','and','for','are','but','not','you','all','any','can','her','was',
    'one','our','out','day','had','has','his','how','man','new','now','old',
    'see','two','way','who','boy','did','its','let','put','say','she','too',
    'use','dad','mum','cat','dog','sun','run','big','red','hot','ten','age',
    'ago','air','ant','ape','arm','art','ash','ate','bad','bag','bat','bed',
    'bee','bet','bin','bit','bow','box','bus','cab','cap','car','cob','cod',
    'cot','cow','cry','cub','cup','cut','den','dig','dim','dip','dot','dry',
    'due','ear','eat','egg','elf','elm','end','eve','eye','fan','far','fat',
    'few','fig','fin','fit','fix','fly','fog','fox','fun','fur','gap','gas',
    'gem','gin','gum','gun','gut','ham','hat','hay','hen','hip','hit','hop',
    'hub','hug','hum','hut','ice','ink','inn','ivy','jam','jar','jaw','jet',
    'jig','job','jog','jot','joy','jug','keg','key','kid','kin','kit','lab',
    'lad','lap','law','lay','leg','lid','lip','lit','log','lot','low','mad',
    'map','mat','men','met','mix','mob','mud','mug','nap','net','nib','nod',
    'nor','nut','oak','oar','oat','odd','owl','own','pad','pan','paw','pea',
    'peg','pen','pet','pew','pie','pig','pin','pit','pod','pot','pub','pun',
    'pup','rag','ram','rat','raw','ray','rib','rim','rip','rob','rod','rot',
    'row','rub','rug','rum','sad','sap','sat','saw','sea','set','sew','sip',
    'sir','sit','six','ski','sky','sly','sob','son','sow','spa','spy','sty',
    'sub','sum','tab','tag','tan','tap','tar','tax','tea','tie','tin','tip',
    'toe','ton','top','tow','toy','try','tub','tug','urn','van','vat','vet',
    'vow','wad','wag','war','wax','web','wed','wet','wig','win','wit','wok',
    'yak','yam','yap','yes','yet','zip','zoo',
  ];
  for (const w of MANUAL_3LETTER_SEED) COMMON.add(w.toUpperCase());

  return { DICT, COMMON };
}

/**
 * rebuildsAll(frame, opt, DICT) → array of distinct real words formed by inserting opt
 * at every position 0..frame.length where a DICT entry results.
 */
function rebuildsAll(frame, opt, DICT) {
  const out = new Set();
  for (let i = 0; i <= frame.length; i++) {
    const w = frame.slice(0, i) + opt + frame.slice(i);
    if (DICT.has(w)) out.add(w);
  }
  return [...out];
}

/**
 * gapFirstPos(frame, opt, DICT) → the LOWEST insertion index (0..frame.length) where
 * inserting opt into frame forms a real DICT word, or -1 if no such position exists.
 */
function gapFirstPos(frame, opt, DICT) {
  for (let i = 0; i <= frame.length; i++) {
    if (DICT.has(frame.slice(0, i) + opt + frame.slice(i))) return i;
  }
  return -1;
}

/**
 * capsWordFromQuestion(question) → first all-caps token of length ≥ 2, excluding 'CAPITALS'.
 * This is the frame token (the word-with-gap) displayed in the question stem.
 */
function capsWordFromQuestion(question) {
  return (question.match(/\b[A-Z]{2,}\b/g) || []).filter(t => t !== 'CAPITALS')[0] || '';
}

module.exports = { loadDicts, rebuildsAll, gapFirstPos, capsWordFromQuestion, REPO };

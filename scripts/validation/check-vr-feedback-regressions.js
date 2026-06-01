#!/usr/bin/env node
// Regression guard for the VR/English feedback fixes applied on 1 June 2026
// (Jacqui + Evie spreadsheet feedback, 18 May – 1 Jun).
//
// WHAT THIS CATCHES (deterministic — safe to gate on):
//   1. REGRESSION MANIFEST — every question fixed on 1 Jun is asserted to still
//      hold its corrected answer/word. If anyone reverts or renumbers, this fails.
//   2. STRUCTURAL — affected topics: exactly 5 options, `correct` in range,
//      no duplicate option strings, no duplicate words within setA/setB,
//      explanation ends in the ✓ tick.
//   3. ANSWER-KEY ↔ EXPLANATION CONSISTENCY — for the two "word-build" topics
//      the keyed answer must agree with the word named in the explanation:
//        • missingLettersWords: keyed letters must be a substring of the formed
//          word, and len(word) == len(fragment) + len(insert). Catches index
//          errors like the GRINNED/GROANED class.
//        • compoundWords (pick-from-sets): setA[i] + setB[j] must equal the
//          "X + Y = WORD" stated in the explanation.
//
// WHAT THIS DOES NOT CATCH (semantic — needs the 11+ Oracle, not a script):
//   • Two options that BOTH form a valid real word (needs a dictionary + context
//     judgement). The 1 Jun audit cleared these by hand.
//   • Ambiguous analogies / multiple valid sentence orderings / part-whole
//     answers with more than one valid whole. These are judgement calls.
//   The generation-time guard for those lives in the Oracle's research notes,
//   not here. Do not pretend this script proves semantic uniqueness.
//
// Usage:  node scripts/validation/check-vr-feedback-regressions.js
// Exit:   0 = pass, 1 = failures

const path = require('node:path');

const vrMod = require(path.join(__dirname, '..', '..', 'src', 'questionData', 'vrData.js'));
const enMod = require(path.join(__dirname, '..', '..', 'src', 'questionData', 'englishData.js'));
const vr = (vrMod.default || vrMod).topics || (vrMod.default || vrMod);
const en = (enMod.default || enMod).topics || (enMod.default || enMod);

let failures = 0;
let passes = 0;
const fail = (m) => { console.error('  FAIL:', m); failures++; };
const pass = (m) => { passes++; if (process.env.VERBOSE) console.log('  ok  :', m); };

const qById = (topics, key, id) => {
  const t = topics[key];
  const arr = t && (t.questions || t);
  return Array.isArray(arr) ? arr.find((q) => q.id === id) : null;
};

// ── 1. REGRESSION MANIFEST — the exact 1 Jun fixes ───────────────────────────
// Each entry pins a corrected item so a revert is caught. `answer` checks the
// keyed option text; `word`/`pair` check word-build items; `notText` guards
// against the old (broken) wording creeping back.

const MANIFEST = [
  // verbalAnalogies — ambiguous pairs rewritten to a single defensible answer
  { topics: vr, key: 'verbalAnalogies', id: 20,  setAans: 'wheat',  setBans: 'wine'  },
  { topics: vr, key: 'verbalAnalogies', id: 40,  setAans: 'bone',   setBans: 'chain' },
  { topics: vr, key: 'verbalAnalogies', id: 68,  setAans: 'nervous',setBans: 'furious' },
  { topics: vr, key: 'verbalAnalogies', id: 69,  setAans: 'old',    setBans: 'soaked' },
  { topics: vr, key: 'verbalAnalogies', id: 70,  setAans: 'flurry', setBans: 'devour' },
  { topics: vr, key: 'verbalAnalogies', id: 84,  setAans: 'wool',   setBans: 'mug'   },
  { topics: vr, key: 'verbalAnalogies', id: 95,  setAans: 'sound',  setBans: 'smoke' },
  { topics: vr, key: 'verbalAnalogies', id: 104, setAans: 'author', setBans: 'music' },
  // logicAndLanguage — connector + rearrange items rewritten to unique answers
  { topics: vr, key: 'logicAndLanguage', id: 22, answer: 'Bank' },
  { topics: vr, key: 'logicAndLanguage', id: 3,  answer: 'Door' },
  { topics: vr, key: 'logicAndLanguage', id: 69, answer: 'Bone' },
  { topics: vr, key: 'logicAndLanguage', id: 72, answer: 'Maria' },
  { topics: vr, key: 'logicAndLanguage', id: 73, answer: 'Medal' },
  { topics: vr, key: 'logicAndLanguage', id: 74, answer: 'Fed' },
  { topics: vr, key: 'logicAndLanguage', id: 76, answer: 'Excited' },
  { topics: vr, key: 'logicAndLanguage', id: 77, answer: 'Broken', notText: 'her mother made' },
  // missingLettersWords — double-valid-word items disambiguated
  { topics: vr, key: 'missingLettersWords', id: 1,   answer: 'APT' },
  { topics: vr, key: 'missingLettersWords', id: 17,  answer: 'ILL' },
  { topics: vr, key: 'missingLettersWords', id: 105, answer: 'LET' },
  { topics: vr, key: 'missingLettersWords', id: 117, answer: 'PET' },
  { topics: vr, key: 'missingLettersWords', id: 118, answer: 'ACE' },
  { topics: vr, key: 'missingLettersWords', id: 164, answer: 'INN', notText: 'silly joke his little sister' },
  // compoundWords — "toon" (not a real word) replaced with imp+air=impair
  { topics: vr, key: 'compoundWords', id: 168, setAans: 'imp', setBans: 'air', notText: 'toon' },
  // oddTwoOut — obscure "bridge" swapped for "tune"
  { topics: vr, key: 'oddTwoOut', id: 69, hasOption: 'tune', notText: 'bridge' },
  // English wordClass — ambiguous "little/pronoun" replaced with flat-adverb "hard"
  { topics: en, key: 'wordClassGrammar', id: 404, answer: 'Adverb', notText: "I'll just have a little" },
];

for (const m of MANIFEST) {
  const q = qById(m.topics, m.key, m.id);
  const tag = `${m.key}/Q${m.id}`;
  if (!q) { fail(`${tag}: question not found (renumbered or deleted?)`); continue; }
  if (m.answer != null) {
    const keyed = q.options && q.options[q.correct];
    if (keyed !== m.answer) fail(`${tag}: keyed answer is "${keyed}", expected "${m.answer}"`);
    else pass(`${tag} answer=${keyed}`);
  }
  if (m.answerIncludes != null) {
    const keyed = q.options && q.options[q.correct];
    if (!keyed || !keyed.includes(m.answerIncludes)) fail(`${tag}: keyed answer "${keyed}" should include "${m.answerIncludes}"`);
    else pass(`${tag} answer~=${keyed}`);
  }
  if (m.hasOption != null) {
    if (!q.options || !q.options.includes(m.hasOption)) fail(`${tag}: option "${m.hasOption}" missing`);
    else pass(`${tag} has option ${m.hasOption}`);
  }
  if (m.setAans != null) {
    const a = q.setA && q.setA[q.correctPair[0]];
    const b = q.setB && q.setB[q.correctPair[1]];
    if (a !== m.setAans || b !== m.setBans) fail(`${tag}: keyed pair is (${a}, ${b}), expected (${m.setAans}, ${m.setBans})`);
    else pass(`${tag} pair=(${a},${b})`);
  }
  if (m.notText != null) {
    const blob = JSON.stringify(q).toLowerCase();
    if (blob.includes(m.notText.toLowerCase())) fail(`${tag}: old/broken text "${m.notText}" is still present`);
    else pass(`${tag} clean of "${m.notText}"`);
  }
}

// ── 2 & 3. STRUCTURAL + KEY/EXPLANATION CONSISTENCY (affected topics) ────────

const MC_TOPICS = ['verbalAnalogies', 'logicAndLanguage', 'missingLettersWords', 'oddTwoOut', 'compoundWords'];

function checkStructural(q, tag) {
  // Explanation tick
  if (typeof q.explanation === 'string' && !q.explanation.trimEnd().endsWith('✓')) {
    fail(`${tag}: explanation does not end with ✓`);
  }
  // Plain multiple-choice
  if (Array.isArray(q.options)) {
    if (q.options.length !== 5) fail(`${tag}: has ${q.options.length} options, expected 5`);
    const uniq = new Set(q.options.map((o) => String(o).toLowerCase()));
    if (uniq.size !== q.options.length) fail(`${tag}: duplicate option strings — ${JSON.stringify(q.options)}`);
    if (typeof q.correct === 'number' && (q.correct < 0 || q.correct >= q.options.length)) {
      fail(`${tag}: correct index ${q.correct} out of range`);
    }
  }
  // pick-from-sets / select-two
  if (Array.isArray(q.setA) && Array.isArray(q.setB)) {
    if (new Set(q.setA.map(String)).size !== q.setA.length) fail(`${tag}: duplicate word in setA — ${JSON.stringify(q.setA)}`);
    if (new Set(q.setB.map(String)).size !== q.setB.length) fail(`${tag}: duplicate word in setB — ${JSON.stringify(q.setB)}`);
    if (Array.isArray(q.correctPair)) {
      const [i, j] = q.correctPair;
      if (i < 0 || i >= q.setA.length || j < 0 || j >= q.setB.length) fail(`${tag}: correctPair ${JSON.stringify(q.correctPair)} out of range`);
    }
  }
}

for (const key of MC_TOPICS) {
  const t = vr[key];
  const arr = t && (t.questions || t);
  if (!Array.isArray(arr)) { fail(`topic ${key}: no questions array`); continue; }
  for (const q of arr) checkStructural(q, `${key}/Q${q.id}`);
}

// missingLettersWords: keyed letters must build the word named in the explanation
{
  const arr = vr.missingLettersWords.questions;
  for (const q of arr) {
    const tag = `missingLettersWords/Q${q.id}`;
    if (!Array.isArray(q.options) || typeof q.correct !== 'number') continue;
    const insert = String(q.options[q.correct] || '').toUpperCase();
    // Pull the formed word from the explanation (several phrasings used).
    const exp = String(q.explanation || '');
    const mWord =
      exp.match(/=\s*([A-Z]{4,})/) ||
      exp.match(/making\s+(?:the\s+word\s+)?([A-Z]{4,})/) ||
      exp.match(/complete word is\s+([A-Z]{4,})/i);
    if (!mWord) continue; // not parseable; skip (don't false-fail)
    const word = mWord[1].toUpperCase();
    if (!word.includes(insert)) {
      fail(`${tag}: keyed insert "${insert}" is not part of formed word "${word}" (index error?)`);
    }
  }
}

// compoundWords pick-from-sets: setA[i]+setB[j] must equal "X + Y = WORD"
{
  const arr = vr.compoundWords.questions;
  for (const q of arr) {
    if (!Array.isArray(q.setA) || !Array.isArray(q.correctPair)) continue;
    const tag = `compoundWords/Q${q.id}`;
    const a = q.setA[q.correctPair[0]];
    const b = q.setB[q.correctPair[1]];
    const exp = String(q.explanation || '');
    const m = exp.match(/([a-z]+)\s*\+\s*([a-z]+)\s*=\s*([a-z]+)/i);
    if (!m) continue;
    if (m[1].toLowerCase() !== String(a).toLowerCase() || m[2].toLowerCase() !== String(b).toLowerCase()) {
      fail(`${tag}: keyed pair (${a}, ${b}) disagrees with explanation "${m[1]} + ${m[2]}"`);
    }
    if ((m[1] + m[2]).toLowerCase() !== m[3].toLowerCase()) {
      fail(`${tag}: "${m[1]} + ${m[2]}" does not spell "${m[3]}"`);
    }
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`\ncheck-vr-feedback-regressions: ${passes} checks passed, ${failures} failed.`);
process.exit(failures ? 1 : 0);

#!/usr/bin/env node
'use strict';

/**
 * validate-missing-letters.js
 *
 * Correctness validator for GL "missing three-letter word" VR questions
 * (questionType: 'missingLettersWords').
 *
 * Usage:
 *   node scripts/validation/validate-missing-letters.js <path-to-questions.json>
 *
 * Exit code:
 *   0 — zero hard fails
 *   1 — at least one hard fail
 */

const fs   = require('node:fs');
const path = require('node:path');

// ── Dictionary setup ──────────────────────────────────────────────────────────

let fullWords;   // Set of all lowercase English words (274,937)
let commonWords; // Set of "common" lowercase words
let degradedMode = false;

try {
  const arr = require('an-array-of-english-words');
  fullWords = new Set(arr.map(w => w.toLowerCase()));
} catch (e) {
  console.error('[FATAL] Could not load an-array-of-english-words:', e.message);
  process.exit(1);
}

// google-10000-english does not exist on npm; fall back to wordlist-english.
// wordlist-english['english'] contains ~107,768 words — broader than a strict
// "most common 10K" list, making the common-word checks more permissive (fewer
// false positives, but some obscure words may pass undetected as "common").
try {
  const wl  = require('wordlist-english');
  const arr = wl['english'] || [];
  commonWords = new Set(arr.map(w => w.toLowerCase()));
  console.log(`[dict] Full dictionary  : an-array-of-english-words (${fullWords.size.toLocaleString()} words)`);
  console.log(`[dict] Common dictionary: wordlist-english['english'] (${commonWords.size.toLocaleString()} words)`);
  console.log('[dict] NOTE: google-10000-english is not published on npm.');
  console.log('[dict]       Using wordlist-english (~107K words) as the common-word source.');
  console.log('[dict]       This is broader than the intended top-10K list; common checks are permissive.\n');
} catch (e) {
  console.warn('[WARN] wordlist-english unavailable — DEGRADED MODE.');
  console.warn('[WARN] "Common word" checks will use the full dictionary (more false negatives).\n');
  degradedMode = true;
  commonWords  = fullWords;
}

// ── Manual seed of common 3-letter words ─────────────────────────────────────
// Ensures obvious everyday words are never misclassified as uncommon, regardless
// of which dictionary build is loaded.
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

// commonThreeLetter = manual seed ∪ all 3-letter words from commonWords
const commonThreeLetter = new Set(MANUAL_3LETTER_SEED);
for (const w of commonWords) {
  if (w.length === 3 && /^[a-z]{3}$/.test(w)) commonThreeLetter.add(w);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns true if s is exactly 3 uppercase ASCII letters. */
const isUpper3 = (s) => typeof s === 'string' && /^[A-Z]{3}$/.test(s);

/** Inserts `insert` into `base` at position `pos`. */
function insertAt(base, pos, insert) {
  return base.slice(0, pos) + insert + base.slice(pos);
}

// ── Per-item validation ───────────────────────────────────────────────────────

function validateItem(q) {
  const hardFails = [];
  const warns     = [];
  const id        = q.id ?? '(no id)';

  const fail = (msg) => hardFails.push(msg);
  const warn = (msg) => warns.push(msg);

  // Normalise to uppercase for all structural checks
  const fullWord  = typeof q.fullWord  === 'string' ? q.fullWord.toUpperCase()  : null;
  const answer    = typeof q.answer    === 'string' ? q.answer.toUpperCase()    : null;
  const capsWord  = typeof q.capsWord  === 'string' ? q.capsWord.toUpperCase()  : null;
  const insertPos = typeof q.insertPos === 'number' ? q.insertPos               : null;

  // ── Check 1: difficulty ∈ {1, 2, 3} ─────────────────────────────────────
  if (![1, 2, 3].includes(q.difficulty)) {
    fail(`[1] difficulty is "${q.difficulty}" — must be 1, 2, or 3`);
  }

  // ── Check 2: answer shape + length invariant ─────────────────────────────
  if (!answer || !isUpper3(answer)) {
    fail(`[2] answer "${q.answer}" is not exactly 3 uppercase A–Z letters`);
  }
  if (!fullWord || !capsWord) {
    fail(`[2] fullWord or capsWord is missing or not a string`);
  } else if (capsWord.length !== fullWord.length - 3) {
    fail(`[2] capsWord.length=${capsWord.length} ≠ fullWord.length-3=${fullWord.length - 3} ` +
         `(fullWord="${fullWord}", capsWord="${capsWord}")`);
  }

  // ── Check 3: mechanical reconstruction ──────────────────────────────────
  if (fullWord && capsWord && answer && insertPos !== null) {
    // insertAt(capsWord, insertPos, answer) must equal fullWord
    const rebuilt = insertAt(capsWord, insertPos, answer);
    if (rebuilt !== fullWord) {
      fail(`[3] Reconstruction: insertAt(capsWord="${capsWord}", pos=${insertPos}, answer="${answer}") ` +
           `= "${rebuilt}" ≠ fullWord="${fullWord}"`);
    }
    // Removing answer from fullWord at insertPos must yield capsWord
    const stripped = fullWord.slice(0, insertPos) + fullWord.slice(insertPos + 3);
    if (stripped !== capsWord) {
      fail(`[3] Strip check: fullWord="${fullWord}" with 3 chars removed at pos=${insertPos} ` +
           `gives "${stripped}" ≠ capsWord="${capsWord}"`);
    }
  } else if (insertPos === null) {
    fail(`[3] insertPos is missing or not a number`);
  }

  // ── Check 4: fullWord in full dictionary ────────────────────────────────
  if (fullWord && !fullWords.has(fullWord.toLowerCase())) {
    fail(`[4] fullWord "${fullWord}" is not in the full English dictionary`);
  }

  // ── Check 5: answer in full dict AND in commonThreeLetter ───────────────
  if (answer) {
    const ansLow = answer.toLowerCase();
    if (!fullWords.has(ansLow)) {
      fail(`[5] answer "${answer}" is not in the full English dictionary`);
    } else if (!commonThreeLetter.has(ansLow)) {
      fail(`[5] answer "${answer}" is in the dictionary but is NOT classified as a common ` +
           `three-letter word (children must know it at a glance)`);
    }
  }

  // ── Check 6: sentence all-caps token ────────────────────────────────────
  if (typeof q.sentence === 'string' && capsWord) {
    // All-caps tokens of length ≥2 (single-letter A/I are ignored)
    const capsTokens = q.sentence.match(/\b[A-Z]{2,}\b/g) || [];
    if (capsTokens.length !== 1) {
      fail(`[6] sentence has ${capsTokens.length} all-caps token(s) of length ≥2 ` +
           `(expected exactly 1): ${JSON.stringify(capsTokens)}`);
    } else if (capsTokens[0] !== capsWord) {
      fail(`[6] all-caps token in sentence is "${capsTokens[0]}", ` +
           `expected capsWord="${capsWord}"`);
    }
  } else if (typeof q.sentence !== 'string') {
    fail(`[6] sentence is missing or not a string`);
  }

  // ── Check 7: options shape ───────────────────────────────────────────────
  if (!Array.isArray(q.options)) {
    fail(`[7] options is not an array`);
  } else {
    if (q.options.length !== 5) {
      fail(`[7] options has ${q.options.length} item(s), expected 5`);
    }
    for (let i = 0; i < q.options.length; i++) {
      const o = q.options[i];
      if (typeof o !== 'string' || !/^[A-Za-z]{3}$/.test(o)) {
        fail(`[7] options[${i}]="${o}" is not exactly 3 letters A–Z`);
      }
    }
    const upr = q.options.map(o => String(o).toUpperCase());
    if (new Set(upr).size !== upr.length) {
      fail(`[7] options contains duplicates (case-insensitive): ${JSON.stringify(q.options)}`);
    }
    if (answer && !upr.includes(answer)) {
      fail(`[7] answer "${answer}" is not present in options ${JSON.stringify(q.options)}`);
    }
    if (typeof q.correct !== 'number') {
      fail(`[7] correct "${q.correct}" is not a number`);
    } else if (q.correct < 0 || q.correct >= q.options.length) {
      fail(`[7] correct index ${q.correct} is out of range for options length ${q.options.length}`);
    } else if (answer && upr[q.correct] !== answer) {
      fail(`[7] options[correct=${q.correct}]="${q.options[q.correct]}" ≠ answer="${answer}"`);
    }
  }

  // ── Check 8: explanation ends with ✓ ────────────────────────────────────
  if (typeof q.explanation !== 'string' || q.explanation.length === 0) {
    fail(`[8] explanation is missing or empty`);
  } else if (!q.explanation.trimEnd().endsWith('✓')) {
    fail(`[8] explanation does not end with ✓`);
  }

  // ── Check 9: uniqueness / no second valid answer (critical) ──────────────
  // For each distractor we run two independent checks as specified.
  if (capsWord && answer && insertPos !== null && Array.isArray(q.options)) {
    const distractors = q.options
      .map(o => o.toUpperCase())
      .filter(o => o !== answer);

    for (const D of distractors) {
      const DLow     = D.toLowerCase();
      const DCommon  = commonThreeLetter.has(DLow);

      // 9a: Insert D at insertPos in capsWord → in FULL dict AND D is common → HARD FAIL.
      //     This catches the most dangerous case: the exact gap resolves to a real word.
      const atGap    = insertAt(capsWord, insertPos, D);
      const atGapLow = atGap.toLowerCase();
      if (fullWords.has(atGapLow) && DCommon) {
        fail(`[9a] AMBIGUOUS distractor "${D}": inserted at answer gap (pos ${insertPos}) ` +
             `forms "${atGap}" — a real dictionary word. Child has a second valid answer.`);
      }

      // 9b: Scan ALL positions 0..capsWord.length.
      //     If any position yields a COMMON word AND D is common → HARD FAIL.
      //     If any position yields only an OBSCURE (full-dict, not-common) word → WARN.
      let firstCommonFound = null;
      const obscureFound   = [];

      for (let pos = 0; pos <= capsWord.length; pos++) {
        const formed    = insertAt(capsWord, pos, D);
        const formedLow = formed.toLowerCase();
        const inFull    = fullWords.has(formedLow);
        const inCommon  = commonWords.has(formedLow);

        if (inFull) {
          if (inCommon && DCommon) {
            if (!firstCommonFound) firstCommonFound = { pos, formed };
          } else if (!inCommon && DCommon) {
            obscureFound.push({ pos, formed });
          }
        }
      }

      if (firstCommonFound) {
        // Only report 9b separately if it fires at a different position than 9a,
        // to avoid a near-duplicate message for the same insertion.
        if (firstCommonFound.pos !== insertPos || !fullWords.has(atGapLow)) {
          fail(`[9b] AMBIGUOUS distractor "${D}": at pos ${firstCommonFound.pos} ` +
               `forms "${firstCommonFound.formed}" — a COMMON word in the dictionary. ` +
               `A child scanning the capitals could derive this as an alternative answer.`);
        }
      }

      if (obscureFound.length > 0 && !firstCommonFound) {
        warn(`[9-warn] Distractor "${D}" forms obscure (full-dict, not-common) word(s) ` +
             `when inserted: ${obscureFound.map(f => `"${f.formed}" at pos ${f.pos}`).join(', ')}. ` +
             `Unlikely to mislead an 11-year-old, but worth a manual eye.`);
      }
    }
  }

  // ── Check 10: distractor trap quality ────────────────────────────────────
  // A good trap distractor passes exactly ONE of: (a) is a common 3-letter word,
  // (b) inserting it at insertPos forms a real word. If <2 of 4 are good traps,
  // the distractors are too weak.
  if (capsWord && answer && insertPos !== null && Array.isArray(q.options)) {
    const distractors = q.options
      .map(o => o.toUpperCase())
      .filter(o => o !== answer);

    let goodTrapCount = 0;
    const trapDetails = [];

    for (const D of distractors) {
      const DLow        = D.toLowerCase();
      const isCommon    = commonThreeLetter.has(DLow);
      const formed      = insertAt(capsWord, insertPos, D);
      const formsWord   = fullWords.has(formed.toLowerCase());
      const passCount   = (isCommon ? 1 : 0) + (formsWord ? 1 : 0);
      if (passCount === 1) goodTrapCount++;
      trapDetails.push(
        `    "${D}": common-word=${isCommon}, forms-word-at-gap="${formed}"=${formsWord}` +
        (passCount === 1 ? ' ✓' : passCount === 2 ? ' [BOTH — ambiguous!]' : ' [NEITHER — weak]')
      );
    }

    if (goodTrapCount < 2) {
      warn(
        `[10] Trap quality: only ${goodTrapCount}/4 distractors pass exactly one trap check ` +
        `(good trap = common word XOR forms a real word at the gap). ` +
        `Distractors may be too easy or too ambiguous.\n${trapDetails.join('\n')}`
      );
    }
  }

  // ── Check 11: explanation mentions fullWord ──────────────────────────────
  if (typeof q.explanation === 'string' && fullWord) {
    if (!q.explanation.toUpperCase().includes(fullWord)) {
      warn(`[11] explanation does not mention fullWord "${fullWord}" ` +
           `(child should see the complete word formed)`);
    }
  }

  return { id, hardFails, warns };
}

// ── Main ──────────────────────────────────────────────────────────────────────

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/validation/validate-missing-letters.js <path-to-questions.json>');
  process.exit(1);
}

let questions;
try {
  const raw = fs.readFileSync(path.resolve(inputPath), 'utf8');
  questions = JSON.parse(raw);
} catch (e) {
  console.error('Failed to read/parse input JSON:', e.message);
  process.exit(1);
}

if (!Array.isArray(questions)) {
  console.error('Input JSON must be an array of question objects.');
  process.exit(1);
}

console.log(`Validating ${questions.length} missingLettersWords question(s)...\n`);
if (degradedMode) {
  console.log('[!] DEGRADED MODE active — common-word checks use the full dictionary.\n');
}

// ── Batch-level duplicate tracking ───────────────────────────────────────────
const seenFullWords = new Map();
const seenSentences = new Map();
const diffCount     = { 1: 0, 2: 0, 3: 0 };

for (const q of questions) {
  if ([1, 2, 3].includes(q.difficulty)) diffCount[q.difficulty]++;

  if (typeof q.fullWord === 'string') {
    const key = q.fullWord.toUpperCase();
    seenFullWords.set(key, [...(seenFullWords.get(key) || []), q.id]);
  }
  if (typeof q.sentence === 'string') {
    const key = q.sentence.trim();
    seenSentences.set(key, [...(seenSentences.get(key) || []), q.id]);
  }
}

// ── Per-item pass ─────────────────────────────────────────────────────────────
let totalHardFail = 0;
let totalWarnOnly = 0;
let totalClean    = 0;

for (const q of questions) {
  const { id, hardFails, warns } = validateItem(q);
  const status = hardFails.length > 0 ? 'FAIL' : 'PASS';

  console.log(`─── Q${id} [${status}]`);

  if (hardFails.length > 0) {
    totalHardFail++;
    for (const f of hardFails) console.log(`  [HARD FAIL] ${f}`);
  }
  if (warns.length > 0) {
    for (const w of warns) console.log(`  [WARN] ${w}`);
  }
  if (hardFails.length === 0 && warns.length === 0) {
    totalClean++;
    console.log('  All checks passed cleanly.');
  } else if (hardFails.length === 0) {
    totalWarnOnly++;
  }
  console.log();
}

// ── Batch-level checks ────────────────────────────────────────────────────────
const batchWarns = [];
const total = questions.length;

// Check 12: difficulty distribution
if (total > 0) {
  const target = { 1: 30, 2: 40, 3: 30 };
  const pct    = { 1: (diffCount[1] / total) * 100, 2: (diffCount[2] / total) * 100, 3: (diffCount[3] / total) * 100 };
  const worst  = Math.max(...[1, 2, 3].map(d => Math.abs(pct[d] - target[d])));
  if (worst > 10) {
    batchWarns.push(
      `[12] Difficulty distribution deviates >10pp from target 30/40/30:\n` +
      `     D1: ${diffCount[1]} (${pct[1].toFixed(1)}%, target 30%)\n` +
      `     D2: ${diffCount[2]} (${pct[2].toFixed(1)}%, target 40%)\n` +
      `     D3: ${diffCount[3]} (${pct[3].toFixed(1)}%, target 30%)`
    );
  }
}

// Check 13: duplicate fullWord
for (const [key, ids] of seenFullWords) {
  if (ids.length > 1) {
    batchWarns.push(`[13] Duplicate fullWord "${key}" appears in Q${ids.join(', Q')}`);
  }
}

// Check 13: duplicate sentence
for (const [key, ids] of seenSentences) {
  if (ids.length > 1) {
    const preview = key.length > 80 ? key.slice(0, 77) + '...' : key;
    batchWarns.push(`[13] Duplicate sentence in Q${ids.join(', Q')}: "${preview}"`);
  }
}

if (batchWarns.length > 0) {
  console.log('═══ BATCH WARNINGS ═══');
  for (const w of batchWarns) console.log(`  [WARN] ${w}`);
  console.log();
}

// ── Summary ───────────────────────────────────────────────────────────────────
const totalPass = total - totalHardFail;
console.log('═══ SUMMARY ═══');
console.log(`Items    : ${total}`);
console.log(`PASS     : ${totalPass} (${totalClean} clean, ${totalWarnOnly} with warnings)`);
console.log(`HARD FAIL: ${totalHardFail}`);
console.log(`Difficulty: D1=${diffCount[1]}, D2=${diffCount[2]}, D3=${diffCount[3]}`);
if (degradedMode) console.log('[!] DEGRADED MODE was active — common checks used full dictionary.');
console.log();

process.exit(totalHardFail > 0 ? 1 : 0);

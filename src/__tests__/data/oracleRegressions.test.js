/**
 * Oracle Regression Tests
 *
 * Each test locks in a specific fix from Oracle audits and feedback reviews.
 * These prevent fixed issues from being silently reintroduced.
 */

import mathsData from '../../questionData/mathsData';
import englishData from '../../questionData/englishData';
import vrData from '../../questionData/vrData';

// Helper: find a question by id within a topic
function findQuestion(data, topicKey, questionId) {
  const topic = data.topics?.[topicKey];
  if (!topic) return null;
  return topic.questions.find(q => q.id === questionId);
}

// Helper: get all questions from a topic
function getTopicQuestions(data, topicKey) {
  return data.topics?.[topicKey]?.questions || [];
}

// ──────────────────────────────────────────────
// 2026-04-01: All letterCodes questions must have questionType
// (125 were missing, causing no alphabet line in Daily/Mock)
// ──────────────────────────────────────────────
describe('Letter Codes questionType', () => {
  const questions = getTopicQuestions(vrData, 'letterCodes');

  it('has questions in the letterCodes topic', () => {
    expect(questions.length).toBeGreaterThan(100);
  });

  it('every question has questionType "letter-codes"', () => {
    const missing = questions.filter(q => q.questionType !== 'letter-codes');
    expect(missing).toEqual([]);
  });
});

// ──────────────────────────────────────────────
// 2026-04-01: Compound word Q91 had all 5 options valid
// Q4, Q6, Q18, Q73 also had ambiguous distractors
// ──────────────────────────────────────────────
describe('Compound Words — no ambiguous distractors', () => {
  const questions = getTopicQuestions(vrData, 'compoundWords');

  it('Q91 (hard/soft) does not contain Ball, Core, Back, or Ware', () => {
    const q = questions.find(q => q.id === 91);
    expect(q).toBeTruthy();
    const opts = q.options.map(o => o.toLowerCase());
    expect(opts).not.toContain('ball');
    expect(opts).not.toContain('core');
    expect(opts).not.toContain('back');
    expect(opts).not.toContain('ware');
  });

  it('Q4 (black/blue) does not contain Bird', () => {
    const q = questions.find(q => q.id === 4);
    expect(q).toBeTruthy();
    expect(q.options.map(o => o.toLowerCase())).not.toContain('bird');
  });

  it('Q6 (foot/base) does not contain Board', () => {
    const q = questions.find(q => q.id === 6);
    expect(q).toBeTruthy();
    expect(q.options.map(o => o.toLowerCase())).not.toContain('board');
  });

  it('Q18 (berry/bird) does not contain Blue', () => {
    const q = questions.find(q => q.id === 18);
    expect(q).toBeTruthy();
    expect(q.options.map(o => o.toLowerCase())).not.toContain('blue');
  });

  it('Q73 (sea/lake) does not contain Front', () => {
    const q = questions.find(q => q.id === 73);
    expect(q).toBeTruthy();
    expect(q.options.map(o => o.toLowerCase())).not.toContain('front');
  });
});

// ──────────────────────────────────────────────
// 2026-04-01: 23 punctuation explanations had wrong generic text
// The generic comma explanation should only appear on genuine
// subordinate-clause-at-start questions (~15 remaining)
// ──────────────────────────────────────────────
describe('Punctuation explanations — no wrong generic text', () => {
  const questions = getTopicQuestions(englishData, 'punctuation');
  const genericText = "A comma is needed after the opening part of the sentence";

  // These IDs were confirmed as wrong and fixed
  const fixedIds = [273, 293, 274, 283, 290, 295, 297, 299, 305, 198, 200, 202, 204, 206, 387, 394, 357, 371, 8, 41, 42, 77, 88, 194];

  fixedIds.forEach(id => {
    it(`Q${id} does not use the generic subordinate clause explanation`, () => {
      const q = questions.find(q => q.id === id);
      if (q) {
        expect(q.explanation).not.toContain(genericText);
      }
    });
  });

  it('no more than 20 questions use the generic comma explanation', () => {
    const withGeneric = questions.filter(q => q.explanation?.includes(genericText));
    // ~15 are legitimate subordinate-clause-at-start questions
    expect(withGeneric.length).toBeLessThanOrEqual(20);
  });
});

// ──────────────────────────────────────────────
// 2026-04-01: ExteriorAngle visuals were showing answer values
// All "find the unknown angle" questions must have label overrides
// ──────────────────────────────────────────────
describe('ExteriorAngle visuals — unknowns masked', () => {
  const anglesQuestions = getTopicQuestions(mathsData, 'anglesshapes');

  it('every ExteriorAngle visual with a find-unknown question has a label override', () => {
    const problems = [];
    anglesQuestions.forEach(q => {
      if (!q.visual || q.visual.component !== 'ExteriorAngle') return;
      const props = q.visual.props;
      // If exteriorLabel is "?" — the exterior is the unknown, that's fine
      if (props.exteriorLabel === '?') return;
      // Otherwise, check that angle2Label (the typical unknown) is overridden
      const questionAsksForUnknown = /[a-z]°|What is [a-z]\b/i.test(q.question);
      if (questionAsksForUnknown && !props.angle1Label && !props.angle2Label) {
        problems.push({ id: q.id, question: q.question.slice(0, 60) });
      }
    });
    expect(problems).toEqual([]);
  });
});

// ──────────────────────────────────────────────
// 2026-04-01: Fractions Q4 bar model image revealed the answer
// ──────────────────────────────────────────────
describe('Fractions Q4 — no answer-revealing image', () => {
  it('does not have an image property', () => {
    const q = findQuestion(mathsData, 'fractions', 4);
    expect(q).toBeTruthy();
    expect(q.image).toBeUndefined();
  });
});

// ──────────────────────────────────────────────
// 2026-04-01: Clock questions must use ClockFace, not AngleDisplay
// ──────────────────────────────────────────────
describe('Clock angle questions use ClockFace component', () => {
  const anglesQuestions = getTopicQuestions(mathsData, 'anglesshapes');

  it('no clock question uses AngleDisplay', () => {
    const clockWithAngleDisplay = anglesQuestions.filter(q =>
      /clock/i.test(q.question) &&
      q.visual?.component === 'AngleDisplay'
    );
    expect(clockWithAngleDisplay).toEqual([]);
  });

  it('clock questions with visuals use ClockFace', () => {
    const clockWithVisual = anglesQuestions.filter(q =>
      /clock/i.test(q.question) && q.visual
    );
    clockWithVisual.forEach(q => {
      expect(q.visual.component).toBe('ClockFace');
    });
  });
});

// ──────────────────────────────────────────────
// 2026-04-01: Percentages Q20 had ambiguous wording
// ──────────────────────────────────────────────
describe('Percentages Q20 — clear wording', () => {
  it('does not contain "two successive discounts of 10% and then 10%"', () => {
    const q = findQuestion(mathsData, 'percentages', 20);
    expect(q).toBeTruthy();
    expect(q.question).not.toContain('two successive discounts of 10% and then 10%');
  });
});

// ──────────────────────────────────────────────
// 2026-04-01: letter-codes must render as standard MCQ
// (QuizScreen/MockTestScreen were excluding them from options rendering)
// This is a code-level check via the data — every letter-codes Q must have options
// ──────────────────────────────────────────────
describe('Letter code questions have options array', () => {
  const questions = getTopicQuestions(vrData, 'letterCodes');

  it('every letter-codes question has exactly 5 options', () => {
    const broken = questions.filter(q => !q.options || q.options.length !== 5);
    expect(broken).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════
// ORACLE SWEEP 2026-04-03: Wrong Answer Fixes
// All 17 wrong answers found during full 39-topic discovery sweep
// ══════════════════════════════════════════════════════════════

describe('Oracle Sweep — Wrong Answer Fixes (2026-04-03)', () => {
  // Grammar: Q38, Q341, Q353 had correct:2 but answer is "are" at index 4
  it('Grammar Q38 correct answer is "are" (index 4)', () => {
    const q = findQuestion(englishData, 'grammar', 38);
    expect(q).toBeTruthy();
    expect(q.options[q.correct]).toBe('are');
  });

  it('Grammar Q341 correct answer is "were" (index 4)', () => {
    const q = findQuestion(englishData, 'grammar', 341);
    expect(q).toBeTruthy();
    expect(q.options[q.correct]).toBe('were');
  });

  it('Grammar Q353 correct answer is "are" (index 4)', () => {
    const q = findQuestion(englishData, 'grammar', 353);
    expect(q).toBeTruthy();
    expect(q.options[q.correct]).toBe('are');
  });

  // Grammar Q355: "None has" is correct formal English (index 0)
  it('Grammar Q355 correct answer is "has" (index 0)', () => {
    const q = findQuestion(englishData, 'grammar', 355);
    expect(q).toBeTruthy();
    expect(q.options[q.correct]).toBe('has');
  });

  // Grammar Q55: "however/therefore" are adverbs not conjunctions
  it('Grammar Q55 correct answer is "Adverbs" (index 4)', () => {
    const q = findQuestion(englishData, 'wordClassGrammar', 55);
    expect(q).toBeTruthy();
    expect(q.options[q.correct]).toBe('Adverbs');
  });

  // Logic & Language Q45: Priya wears Blue not Green
  it('Logic & Language Q45 correct answer is "Blue" (index 3)', () => {
    const q = findQuestion(vrData, 'logicAndLanguage', 45);
    expect(q).toBeTruthy();
    expect(q.options[q.correct]).toBe('Blue');
  });

  // Missing Letters: 4 off-by-index errors
  it('Missing Letters Q59 (FR_GHT) answer is "I"', () => {
    const q = findQuestion(vrData, 'missingLettersWords', 59);
    expect(q).toBeTruthy();
    expect(q.options[q.correct]).toBe('I');
  });

  it('Missing Letters Q62 (SCR_TCH) answer is "A"', () => {
    const q = findQuestion(vrData, 'missingLettersWords', 62);
    expect(q).toBeTruthy();
    expect(q.options[q.correct]).toBe('A');
  });

  it('Missing Letters Q71 (WR_STLE) answer is "E"', () => {
    const q = findQuestion(vrData, 'missingLettersWords', 71);
    expect(q).toBeTruthy();
    expect(q.options[q.correct]).toBe('E');
  });

  it('Missing Letters Q72 (SCH_DULE) answer is "E"', () => {
    const q = findQuestion(vrData, 'missingLettersWords', 72);
    expect(q).toBeTruthy();
    expect(q.options[q.correct]).toBe('E');
  });

  // Number Word Codes Q30: code changed to 514 so answer is POT
  it('Number Word Codes Q30 answer is "POT"', () => {
    const q = findQuestion(vrData, 'numberWordCodes', 30);
    expect(q).toBeTruthy();
    expect(q.options[q.correct]).toBe('POT');
    expect(q.question).toContain('514');
  });

  // Letter Move Q90: T not C (CROWN impossible from 3-letter OWN)
  it('Letter Move Q90 answer is "T" (CHAR + TOWN)', () => {
    const q = findQuestion(vrData, 'letterMove', 90);
    expect(q).toBeTruthy();
    expect(q.options[q.correct]).toBe('T');
  });

  // Letter Pair Series Q37 and Q78: Q at index 2, not P at index 3
  it('Letter Pair Series Q37 answer is "Q"', () => {
    const q = findQuestion(vrData, 'letterPairSeries', 37);
    expect(q).toBeTruthy();
    expect(q.options[q.correct]).toBe('Q');
  });

  it('Letter Pair Series Q78 answer is "Q"', () => {
    const q = findQuestion(vrData, 'letterPairSeries', 78);
    expect(q).toBeTruthy();
    expect(q.options[q.correct]).toBe('Q');
  });

  // Letter Codes Q14: no duplicate options (was "MBOE","MBOE")
  it('Letter Codes Q14 has no duplicate options', () => {
    const q = findQuestion(vrData, 'letterCodes', 14);
    expect(q).toBeTruthy();
    const unique = new Set(q.options);
    expect(unique.size).toBe(q.options.length);
  });

  // Sequences Q149: only one valid "No" answer
  it('Sequences Q149 has at most one "No" option citing a triangular number', () => {
    const q = findQuestion(mathsData, 'sequences', 149);
    expect(q).toBeTruthy();
    // 48 and 46 are NOT triangular numbers, so those "No" options are wrong distractors
    const noOptions = q.options.filter(o => o.startsWith('No'));
    const triangulars = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91];
    const validNos = noOptions.filter(o => {
      const match = o.match(/(\d+) is but/);
      return match && triangulars.includes(parseInt(match[1]));
    });
    expect(validNos.length).toBeLessThanOrEqual(1);
  });

  // Place Value Q158: only one option < 53,842 using correct digits
  it('Place Value Q158 has exactly one option less than 53842', () => {
    const q = findQuestion(mathsData, 'placevalue', 158);
    expect(q).toBeTruthy();
    const targetDigits = [2, 3, 4, 5, 8].sort().join('');
    const validSmaller = q.options.filter(o => {
      const num = parseInt(o.replace(/,/g, ''));
      const digits = String(num).split('').map(Number).sort().join('');
      return num < 53842 && digits === targetDigits;
    });
    expect(validSmaller.length).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════
// ORACLE SWEEP 2026-04-03: Critical Content Fixes
// ══════════════════════════════════════════════════════════════

describe('Oracle Sweep — Critical Content Fixes (2026-04-03)', () => {
  // Letter Sums BODMAS: staging lesson must NOT teach "NOT BODMAS"
  it('Letter Sums staging file does not contain "NOT BODMAS"', () => {
    const fs = require('fs');
    const content = fs.readFileSync('src/microLessons/staging/letterSums-subconcepts.js', 'utf8');
    expect(content).not.toContain('NOT BODMAS');
  });

  // Spelling Q389: only one error per question (Segment A was "totaly")
  it('Spelling Q389 Segment A is correctly spelled', () => {
    const q = findQuestion(englishData, 'spelling', 389);
    expect(q).toBeTruthy();
    expect(q.segments[0]).not.toContain('totaly');
  });

  // Algebra Q146: "All of A, B and C" must not be option A (self-referential)
  it('Algebra Q146 does not have "All of A, B and C" as first option', () => {
    const q = findQuestion(mathsData, 'algebra', 146);
    expect(q).toBeTruthy();
    expect(q.options[0]).not.toMatch(/All of A/i);
  });

  // Algebra Q22/Q111: no equivalent options (s+12-5 = s+7, e+9-4 = e+5)
  it('Algebra Q22 has no option equivalent to the correct answer', () => {
    const q = findQuestion(mathsData, 'algebra', 22);
    expect(q).toBeTruthy();
    expect(q.options).not.toContain('s + 12 - 5');
  });

  it('Algebra Q111 has no option equivalent to the correct answer', () => {
    const q = findQuestion(mathsData, 'algebra', 111);
    expect(q).toBeTruthy();
    expect(q.options).not.toContain('e + 9 - 4');
  });

  // Negative Numbers: £ format must be -£ not £-
  it('Negative numbers options use "-£" not "£-" format', () => {
    const questions = getTopicQuestions(mathsData, 'negativenumbers');
    const badFormat = questions.filter(q =>
      q.options?.some(o => /£-\d/.test(o))
    );
    expect(badFormat).toEqual([]);
  });

  // Letter Move Q75/Q76: were unsolvable (CROWN/GROWL from 3-letter words)
  // Replaced with BLAST+OAR and GRAIN+OAT respectively
  it('Letter Move Q75 no longer references CROWN', () => {
    const q = findQuestion(vrData, 'letterMove', 75);
    expect(q).toBeTruthy();
    expect(q.explanation).not.toContain('CROWN');
    expect(q.question).not.toContain('CRATE');
  });

  it('Letter Move Q76 no longer references GROWL', () => {
    const q = findQuestion(vrData, 'letterMove', 76);
    expect(q).toBeTruthy();
    expect(q.explanation).not.toContain('GROWL');
    expect(q.question).not.toContain('GRANT');
  });
});

// ══════════════════════════════════════════════════════════════
// ORACLE SWEEP 2026-04-03: Structural Invariants
// These lock in patterns that should never regress
// ══════════════════════════════════════════════════════════════

describe('Oracle Sweep — Structural Invariants', () => {
  // No question should have duplicate options (Letter Codes Q14 was the case)
  it('no VR question has duplicate options', () => {
    const problems = [];
    Object.entries(vrData.topics || {}).forEach(([topicKey, topic]) => {
      (topic.questions || []).forEach(q => {
        if (!q.options) return;
        const unique = new Set(q.options);
        if (unique.size !== q.options.length) {
          problems.push(`${topicKey} Q${q.id}: duplicate in [${q.options.join(', ')}]`);
        }
      });
    });
    expect(problems).toEqual([]);
  });

  // Data Handling Q75: explanation must reference "Option A" not "Option D"
  it('Data Handling Q75 explanation references correct option label', () => {
    const q = findQuestion(mathsData, 'datahandling', 75);
    expect(q).toBeTruthy();
    expect(q.explanation).toContain('Option A');
    expect(q.explanation).not.toMatch(/Option D.*126/);
  });

  // Decimals Q151: explanation labels must match option order
  it('Decimals Q151 explanation labels D and E in correct order', () => {
    const q = findQuestion(mathsData, 'decimals', 151);
    expect(q).toBeTruthy();
    // D should be 6.5 ÷ 2 (index 3), E should be 0.9 × 3 (index 4)
    expect(q.explanation).toMatch(/D:.*6\.5/);
  });

  // Import case sensitivity: filename on disk is lowercase (lettersums-subconcepts.js).
  // Import path must match exactly — Linux is case-sensitive and would fail to resolve
  // ./staging/letterSums-subconcepts (the camelCase form).
  it('lessonData.js imports lettersums-subconcepts with lowercase path matching filename', () => {
    const fs = require('fs');
    const content = fs.readFileSync('src/microLessons/lessonData.js', 'utf8');
    expect(content).toContain("./staging/lettersums-subconcepts");
    expect(content).not.toContain("./staging/letterSums-subconcepts");
  });
});

// ══════════════════════════════════════════════════════════════
// Cross-Question Analysis: Word/Answer Repetition
// Checks the question bank as a COLLECTION, not just individual Qs.
// Added after finding SOAR appeared 13 times in Letter Move.
// ══════════════════════════════════════════════════════════════

describe('Cross-Question Analysis — Word Repetition', () => {
  // Helper: extract all words from Letter Move questions
  function getLetterMoveWords() {
    const questions = getTopicQuestions(vrData, 'letterMove');
    const wordCounts = {};
    questions.forEach(q => {
      // Extract the two words from the question text
      const match = q.question.match(/:\s*(\w+)\s+(\w+)/);
      if (match) {
        [match[1], match[2]].forEach(w => {
          const word = w.toUpperCase();
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        });
      }
      // Extract result words from explanation
      if (q.explanation) {
        const resultWords = q.explanation.match(/becomes\s+(\w+)/gi);
        if (resultWords) {
          resultWords.forEach(m => {
            const word = m.replace(/becomes\s+/i, '').toUpperCase();
            wordCounts[word] = (wordCounts[word] || 0) + 1;
          });
        }
      }
    });
    return wordCounts;
  }

  it('no word appears more than 8 times across Letter Move questions', () => {
    const wordCounts = getLetterMoveWords();
    const overused = Object.entries(wordCounts)
      .filter(([, count]) => count > 8)
      .sort((a, b) => b[1] - a[1])
      .map(([word, count]) => `${word}: ${count} times`);
    if (overused.length > 0) console.log('Overused words:', overused);
    expect(overused).toEqual([]);
  });

  it('no source word (first word) is reused more than 4 times in Letter Move', () => {
    const questions = getTopicQuestions(vrData, 'letterMove');
    const sourceCounts = {};
    questions.forEach(q => {
      const match = q.question.match(/:\s*(\w+)\s+\w+/);
      if (match) {
        const word = match[1].toUpperCase();
        sourceCounts[word] = (sourceCounts[word] || 0) + 1;
      }
    });
    const overused = Object.entries(sourceCounts)
      .filter(([, count]) => count > 4)
      .sort((a, b) => b[1] - a[1])
      .map(([word, count]) => `${word}: ${count} times`);
    if (overused.length > 0) console.log('Overused source words:', overused);
    expect(overused).toEqual([]);
  });

  it('no two Letter Move questions produce the same pair of result words', () => {
    const questions = getTopicQuestions(vrData, 'letterMove');
    const resultPairs = {};
    const duplicates = [];
    questions.forEach(q => {
      if (!q.explanation) return;
      const words = q.explanation.match(/becomes\s+(\w+)/gi);
      if (words && words.length >= 2) {
        const pair = words.map(m => m.replace(/becomes\s+/i, '').toUpperCase()).sort().join('+');
        if (resultPairs[pair]) {
          duplicates.push(`Q${resultPairs[pair]} and Q${q.id} both produce ${pair}`);
        } else {
          resultPairs[pair] = q.id;
        }
      }
    });
    expect(duplicates).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════
// Cross-Question Analysis: All VR Topics
// Extends the Letter Move pattern to catch repetition bank-wide.
// ══════════════════════════════════════════════════════════════

describe('Cross-Question Analysis — VR-wide Word Repetition', () => {

  // Helper: count word frequencies in pick-from-sets topics (synonyms, antonyms, verbal analogies)
  function getPickFromSetsAnswerWords(topicKey) {
    const questions = getTopicQuestions(vrData, topicKey);
    const wordCounts = {};
    questions.forEach(q => {
      if (!q.setA || !q.setB || !q.correctPair) return;
      const answerA = q.setA[q.correctPair[0]]?.toLowerCase();
      const answerB = q.setB[q.correctPair[1]]?.toLowerCase();
      if (answerA) wordCounts[answerA] = (wordCounts[answerA] || 0) + 1;
      if (answerB) wordCounts[answerB] = (wordCounts[answerB] || 0) + 1;
    });
    return wordCounts;
  }

  // Synonyms: no answer word tested more than 3 times
  it('Synonyms — no answer word appears more than 3 times', () => {
    const counts = getPickFromSetsAnswerWords('synonyms');
    const overused = Object.entries(counts)
      .filter(([, c]) => c > 3)
      .map(([w, c]) => `${w}: ${c}`);
    if (overused.length) console.log('Synonyms overused:', overused);
    expect(overused).toEqual([]);
  });

  // Antonyms: no answer word tested more than 3 times
  it('Antonyms — no answer word appears more than 3 times', () => {
    const counts = getPickFromSetsAnswerWords('antonyms');
    const overused = Object.entries(counts)
      .filter(([, c]) => c > 3)
      .map(([w, c]) => `${w}: ${c}`);
    if (overused.length) console.log('Antonyms overused:', overused);
    expect(overused).toEqual([]);
  });

  // Compound Words: no answer/bridge word used more than 3 times
  it('Compound Words — no bridge word appears more than 3 times', () => {
    const questions = getTopicQuestions(vrData, 'compoundWords');
    const wordCounts = {};
    questions.forEach(q => {
      if (q.options && q.correct !== undefined) {
        const answer = q.options[q.correct]?.toLowerCase();
        if (answer) wordCounts[answer] = (wordCounts[answer] || 0) + 1;
      }
    });
    const overused = Object.entries(wordCounts)
      .filter(([, c]) => c > 3)
      .map(([w, c]) => `${w}: ${c}`);
    if (overused.length) console.log('Compound Words overused bridge:', overused);
    expect(overused).toEqual([]);
  });

  // Odd Two Out: no word appears in options more than 4 times across all questions
  it('Odd Two Out — no word appears in options more than 4 times', () => {
    const questions = getTopicQuestions(vrData, 'oddTwoOut');
    const wordCounts = {};
    questions.forEach(q => {
      if (!q.options) return;
      q.options.forEach(o => {
        const w = o.toLowerCase();
        wordCounts[w] = (wordCounts[w] || 0) + 1;
      });
    });
    const overused = Object.entries(wordCounts)
      .filter(([, c]) => c > 4)
      .map(([w, c]) => `${w}: ${c}`);
    if (overused.length) console.log('OddTwoOut overused:', overused);
    expect(overused).toEqual([]);
  });

  // Shared Letter: no single answer letter exceeds 28% of all questions
  it('Shared Letter — no answer letter exceeds 28% frequency', () => {
    const questions = getTopicQuestions(vrData, 'sharedLetter');
    const letterCounts = {};
    questions.forEach(q => {
      if (q.options && q.correct !== undefined) {
        const letter = q.options[q.correct]?.toUpperCase();
        if (letter) letterCounts[letter] = (letterCounts[letter] || 0) + 1;
      }
    });
    const total = questions.length;
    const overused = Object.entries(letterCounts)
      .filter(([, c]) => c / total > 0.28)
      .map(([l, c]) => `${l}: ${c}/${total} (${Math.round(c/total*100)}%)`);
    if (overused.length) console.log('SharedLetter overused:', overused);
    expect(overused).toEqual([]);
  });

  // Number Word Codes: no code word (in question text) appears more than 4 times
  it('Number Word Codes — no code word appears more than 4 times', () => {
    const questions = getTopicQuestions(vrData, 'numberWordCodes');
    const wordCounts = {};
    questions.forEach(q => {
      if (!q.question) return;
      const words = q.question.match(/\b[A-Z]{3,}\b/g);
      if (words) words.forEach(w => {
        wordCounts[w] = (wordCounts[w] || 0) + 1;
      });
    });
    const overused = Object.entries(wordCounts)
      .filter(([, c]) => c > 4)
      .map(([w, c]) => `${w}: ${c}`);
    if (overused.length) console.log('NWC overused:', overused);
    expect(overused).toEqual([]);
  });

  // Missing Letters: no target word (the complete word) appears more than twice
  it('Missing Letters — no target word appears more than twice', () => {
    const questions = getTopicQuestions(vrData, 'missingLettersWords');
    const wordCounts = {};
    questions.forEach(q => {
      if (!q.explanation) return;
      // Extract target word: "making WORD" or "making WORD." — must be 5+ letters (the full word)
      const match = q.explanation.match(/making\s+([A-Z][A-Z]+)/);
      if (match && match[1].length >= 5) {
        wordCounts[match[1]] = (wordCounts[match[1]] || 0) + 1;
      }
    });
    const overused = Object.entries(wordCounts)
      .filter(([, c]) => c > 2)
      .map(([w, c]) => `${w}: ${c}`);
    if (overused.length) console.log('MissingLetters overused:', overused);
    expect(overused).toEqual([]);
  });

  // Letter Codes: no source word encoded more than 4 times
  it('Letter Codes — no source word appears more than 4 times', () => {
    const questions = getTopicQuestions(vrData, 'letterCodes');
    const wordCounts = {};
    questions.forEach(q => {
      if (!q.question) return;
      const words = q.question.match(/\b[A-Z]{3,}\b/g);
      if (words) words.forEach(w => {
        wordCounts[w] = (wordCounts[w] || 0) + 1;
      });
    });
    const overused = Object.entries(wordCounts)
      .filter(([, c]) => c > 4)
      .map(([w, c]) => `${w}: ${c}`);
    if (overused.length) console.log('LetterCodes overused:', overused);
    expect(overused).toEqual([]);
  });

  // Hidden Words: no hidden answer word appears more than twice
  it('Hidden Words — no hidden answer word appears more than twice', () => {
    const questions = getTopicQuestions(vrData, 'hiddenWords');
    const wordCounts = {};
    questions.forEach(q => {
      if (!q.question) return;
      // Extract the described hidden word from the question text
      // Pattern: "A X-letter word meaning 'CLUE'" or "meaning 'CLUE' is hidden"
      const match = q.question.match(/meaning\s+['"]([^'"]+)['"]/i);
      if (match) {
        const clue = match[1].toUpperCase();
        wordCounts[clue] = (wordCounts[clue] || 0) + 1;
      }
    });
    const overused = Object.entries(wordCounts)
      .filter(([, c]) => c > 2)
      .map(([w, c]) => `${w}: ${c}`);
    if (overused.length) console.log('HiddenWords overused clues:', overused);
    expect(overused).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════
// Content Integrity Tests
// Catches classes of error found via user feedback that existing
// tests missed. Each test targets a PATTERN, not a single instance.
// ══════════════════════════════════════════════════════════════

describe('Content Integrity — Missing Letters fragment + stem = real word', () => {
  // Found via feedback: Q94 had "CIENT" but efficient needs "ICIENT"
  // This test reconstructs every 3-letter stolen word question and
  // checks the result is a plausible word (6+ letters, no weird chars)

  const questions = getTopicQuestions(vrData, 'missingLettersWords');

  it('every 3-letter stolen word question produces a valid-looking complete word', () => {
    const problems = [];
    questions.forEach(q => {
      if (!q.question) return;
      // Match pattern: ( _ _ _ ) STEM or STEM ( _ _ _ )
      const frontMatch = q.question.match(/\( _ _ _ \)\s*([A-Z]+)/);
      const backMatch = q.question.match(/([A-Z]+)\s*\( _ _ _ \)/);
      if (!frontMatch && !backMatch) return;

      const stem = frontMatch ? frontMatch[1] : backMatch[1];
      const answer = q.options?.[q.correct];
      if (!answer || answer.length !== 3) return;
      // Skip if stem is too short (single-letter gap questions use different format)
      if (stem.length < 4) return;

      const fullWord = frontMatch
        ? answer.toUpperCase() + stem
        : stem + answer.toUpperCase();

      // Basic checks: should be 6+ letters, all alpha, no repeated fragments
      if (fullWord.length < 6) {
        problems.push(`Q${q.id}: ${answer} + ${stem} = ${fullWord} (too short)`);
      }
      if (/(.)\1{3,}/.test(fullWord)) {
        problems.push(`Q${q.id}: ${answer} + ${stem} = ${fullWord} (suspicious repeated chars)`);
      }

      // Check the explanation mentions the full word
      if (q.explanation) {
        const fullWordLower = fullWord.toLowerCase();
        const explanationLower = q.explanation.toLowerCase();
        if (!explanationLower.includes(fullWordLower) &&
            !explanationLower.includes(fullWordLower.charAt(0).toUpperCase() + fullWordLower.slice(1))) {
          problems.push(`Q${q.id}: ${fullWord} not found in explanation`);
        }
      }
    });
    if (problems.length) console.log('Fragment+stem issues:', problems);
    expect(problems).toEqual([]);
  });
});

describe('Content Integrity — Synonym pick-from-sets no competing pairs', () => {
  // Found via feedback: Q87 had hasty/rushed as a second valid pair
  // This test checks every pick-from-sets synonym question for known
  // synonym pairs in the distractors

  const questions = getTopicQuestions(vrData, 'synonyms');

  // Common synonym pairs that should never both appear across setA/setB
  // (unless they ARE the intended answer pair)
  const knownSynonymPairs = [
    ['happy', 'joyful'], ['sad', 'unhappy'], ['big', 'large'], ['small', 'tiny'],
    ['fast', 'quick'], ['slow', 'sluggish'], ['angry', 'furious'], ['scared', 'frightened'],
    ['brave', 'courageous'], ['clever', 'intelligent'], ['kind', 'generous'],
    ['beautiful', 'gorgeous'], ['ugly', 'hideous'], ['rich', 'wealthy'], ['poor', 'destitute'],
    ['old', 'ancient'], ['new', 'modern'], ['hot', 'scorching'], ['cold', 'freezing'],
    ['loud', 'noisy'], ['quiet', 'silent'], ['hard', 'difficult'], ['easy', 'simple'],
    ['begin', 'start'], ['end', 'finish'], ['buy', 'purchase'], ['sell', 'vend'],
    ['hasty', 'rushed'], ['calm', 'serene'], ['bold', 'daring'], ['shy', 'timid'],
    ['glad', 'pleased'], ['afraid', 'scared'], ['weary', 'tired'], ['strong', 'powerful'],
    ['weak', 'feeble'], ['dull', 'boring'], ['bright', 'vivid'], ['vague', 'unclear'],
    ['polite', 'courteous'], ['rude', 'impolite'], ['tidy', 'neat'], ['messy', 'untidy'],
    ['sturdy', 'robust'], ['fragile', 'delicate'], ['soggy', 'damp'], ['dry', 'arid'],
    ['swift', 'rapid'], ['gentle', 'tender'], ['fierce', 'ferocious'], ['humble', 'modest'],
    ['arrogant', 'conceited'], ['irritate', 'annoy'], ['destroy', 'demolish'],
    ['grab', 'seize'], ['permit', 'allow'], ['assist', 'help'], ['accept', 'agree'],
    ['unite', 'combine'], ['decrease', 'reduce'], ['defend', 'protect'],
  ];

  it('no distractor words form a known synonym pair across setA/setB', () => {
    const problems = [];
    questions.forEach(q => {
      if (!q.setA || !q.setB || !q.correctPair) return;
      const answerA = q.correctPair[0];
      const answerB = q.correctPair[1];

      // Check every non-answer word in setA against every non-answer word in setB
      q.setA.forEach((wordA, iA) => {
        if (iA === answerA) return; // skip the intended answer
        q.setB.forEach((wordB, iB) => {
          if (iB === answerB) return; // skip the intended answer
          const a = wordA.toLowerCase();
          const b = wordB.toLowerCase();
          for (const pair of knownSynonymPairs) {
            if ((a === pair[0] && b === pair[1]) || (a === pair[1] && b === pair[0])) {
              problems.push(`Q${q.id}: distractor pair "${wordA}/${wordB}" are synonyms`);
            }
          }
        });
      });
    });
    if (problems.length) console.log('Competing synonym pairs:', problems);
    expect(problems).toEqual([]);
  });
});

describe('Content Integrity — Explanations must not contradict themselves', () => {
  // Found via feedback: Q371 explanation said "can be debated" and "actually"
  // Scan all explanations for hedging/contradictory language

  const hedgePatterns = [
    /can be debated/i,
    /actually the (?:clear|real|correct) answer/i,
    /none of these perfectly fit/i,
    /but actually/i,
    /this is debatable/i,
    /arguably/i,
  ];

  it('no maths explanation contains self-contradicting language', () => {
    const problems = [];
    Object.entries(mathsData.topics || {}).forEach(([topicKey, topic]) => {
      (topic.questions || []).forEach(q => {
        if (!q.explanation) return;
        for (const pattern of hedgePatterns) {
          if (pattern.test(q.explanation)) {
            problems.push(`${topicKey} Q${q.id}: "${q.explanation.slice(0, 80)}..." matches ${pattern}`);
          }
        }
      });
    });
    if (problems.length) console.log('Hedging explanations (maths):', problems);
    expect(problems).toEqual([]);
  });

  it('no English explanation contains self-contradicting language', () => {
    const problems = [];
    Object.entries(englishData.topics || {}).forEach(([topicKey, topic]) => {
      (topic.questions || []).forEach(q => {
        if (!q.explanation) return;
        for (const pattern of hedgePatterns) {
          if (pattern.test(q.explanation)) {
            problems.push(`${topicKey} Q${q.id}: "${q.explanation.slice(0, 80)}..." matches ${pattern}`);
          }
        }
      });
    });
    if (problems.length) console.log('Hedging explanations (English):', problems);
    expect(problems).toEqual([]);
  });

  it('no VR explanation contains self-contradicting language', () => {
    const problems = [];
    Object.entries(vrData.topics || {}).forEach(([topicKey, topic]) => {
      (topic.questions || []).forEach(q => {
        if (!q.explanation) return;
        for (const pattern of hedgePatterns) {
          if (pattern.test(q.explanation)) {
            problems.push(`${topicKey} Q${q.id}: "${q.explanation.slice(0, 80)}..." matches ${pattern}`);
          }
        }
      });
    });
    if (problems.length) console.log('Hedging explanations (VR):', problems);
    expect(problems).toEqual([]);
  });
});

// ──────────────────────────────────────────────
// 2026-04-21: Stem-leak detector
// A "stem-leak" is when a distinctive keyword in the question stem
// appears in exactly ONE option — the correct answer. Kids can pattern-match
// instead of reasoning.
// Triggered by Jacqui flagging Vocabulary Q371:
//   Stem: "In which sentence does 'sentence' mean 'a punishment given by a judge'?"
//   Correct: "The judge gave a sentence of five years."
// Only option with "judge" → pattern-match giveaway.
// ──────────────────────────────────────────────
describe('Stem-leak detector — keyword in stem reveals answer', () => {
  const STOP = new Set([
    'the','a','an','and','or','but','if','then','so','of','to','in','on','at',
    'is','are','was','were','be','been','being','have','has','had','do','does',
    'did','will','would','could','should','may','might','can','as','it','its',
    'this','that','these','those','which','what','who','whom','when','where',
    'why','how','not','no','yes','for','from','with','by','into','onto','out',
    'up','down','over','under','about','than','too','very','also','just','now',
    'well','only','even','still','you','your','yours','he','him','his','she',
    'her','hers','they','them','their','theirs','we','us','our','ours','i','me',
    'my','mine','one','two','three','four','five','six','seven','eight','nine',
    'ten','means','meaning','word','words','sentence','sentences','option',
    'options','letter','letters','number','numbers','example','examples',
    'answer','answers','question','questions','following','correct','wrong',
    'true','false','best','next','first','last','here','there','now','then',
    'always','never','often','sometimes','between','among','before','after',
    'while','during','since','until','more','less','much','many','lot','lots',
    'little','big','small','called','used','use','using','make','makes','made',
    'give','gives','gave','given','take','takes','took','taken','say','says',
    'said','see','saw','seen','goes','went','gone','tell','tells','told','think',
    'thought','know','knew','known','above','below','right','left','near','far',
    'way','ways','like','type','types','kind','kinds','part','parts','each',
    'every','any','something','some','all','both','few','most','other','such',
    'own','same'
  ]);
  const NUMBER_RE = /^\d+(\.\d+)?(cm|mm|m|km|g|kg|ml|l|%|°|°c|°f|p|£|\$)?$/i;
  const EXCLUDED_TOPICS = new Set(['logicAndLanguage']);

  function tokenise(text) {
    if (!text) return new Set();
    return new Set(
      String(text)
        .replace(/&[a-z#0-9]+;/gi, ' ')
        .toLowerCase()
        .replace(/[^a-z0-9' -]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length >= 4)
        .filter(w => !STOP.has(w))
        .filter(w => !NUMBER_RE.test(w))
        .map(w => w.replace(/^'+|'+$/g, '').replace(/s$/, ''))
        .filter(w => w.length >= 4)
    );
  }

  function isExemptQuestion(q) {
    if (q.questionType === 'passage' || q.passageId || q.passageTitle) return true;
    const stem = String(q.question || '');
    if (/which word is (the|a|an) (adjective|adverb|verb|noun|pronoun|determiner|conjunction|preposition|article) in[:\s]/i.test(stem)) return true;
    if (/rearrange these (words|letters)/i.test(stem)) return true;
    if (/\b(taller|shorter|faster|slower|heavier|lighter|older|younger|longer|bigger|smaller|more|fewer)\s+than\b/i.test(stem)
        && /\b(who|which|whose)\b/i.test(stem)) return true;
    return false;
  }

  function findStemLeak(q) {
    if (!q || !q.question || !Array.isArray(q.options)) return null;
    if (typeof q.correct !== 'number') return null;
    if (q.options.length < 2) return null;
    if (isExemptQuestion(q)) return null;

    const stemTokens = tokenise(q.question);
    if (stemTokens.size === 0) return null;

    for (const tok of stemTokens) {
      const matchingOptions = [];
      q.options.forEach((opt, i) => {
        if (tokenise(opt).has(tok)) matchingOptions.push(i);
      });
      if (matchingOptions.length === 1 && matchingOptions[0] === q.correct) {
        return tok;
      }
    }
    return null;
  }

  // Allow-list: questions that were triaged as PEDAGOGICALLY LEGITIMATE
  // (not bugs) by Oracle. Format: "<subject>:<topic>:<id>"
  // These remain known-overlap by design (prefix-teaching, ranking, either/or
  // format, yes-no format, comparison-from-a-list, pattern-apply).
  // Populated from Oracle triage 2026-04-21 of scripts/stem-leak-findings.json
  const ALLOW_LIST = new Set([
    // Synonym-ranking (options ARE the stem list)
    'english:vocabulary:19',
    'english:vocabulary:341',
    'english:vocabulary:342',
    // Prefix / root teaching (applying the taught meaning IS the test)
    'english:vocabulary:382',
    'english:vocabulary:388',
    'english:vocabulary:392',
    'english:vocabulary:396',
    'english:vocabulary:399',
    'english:vocabulary:405',
    'english:vocabulary:406',
    'english:vocabulary:408',
    // Clause / sentence-parse (options are drawn from the quoted sentence)
    'english:wordClassGrammar:280',
    'english:wordClassGrammar:351',
    'english:wordClassGrammar:358',
    // Either/or format ("is X a Y or Z?") — both named in stem
    'english:wordClassGrammar:375',
    'english:wordClassGrammar:401',
    // Yes/No with sequence-as-reference-noun
    'maths:algebra:249',
    'maths:longmultiplication:160',
    // Higher/lower/same — options dictated by stem phrasing
    'maths:percentages:173',
    // Comparison from a list (options are the named items in stem)
    'maths:negativenumbers:144',
    'maths:placevalue:149',
    'maths:placevalue:154',
    // Diagnostic "what mistake" — reference noun legitimate
    'maths:placevalue:165',
    // Letter-sum ranking (options ARE the stem word list)
    'vr:letterSums:108',
    'vr:letterSums:109',
    // Pattern-apply (all options share the leaked token by construction)
    'vr:wordCodeAnalogies:102'
  ]);

  function walkTopics(data, subject, visit) {
    Object.entries(data.topics || {}).forEach(([topicKey, topic]) => {
      if (EXCLUDED_TOPICS.has(topicKey)) return;
      (topic.questions || []).forEach(q => visit(subject, topicKey, q));
    });
  }

  it('no stem-leak in English, VR, or Maths (excluding allow-list)', () => {
    const findings = [];
    const dataSets = [
      { data: englishData, subject: 'english' },
      { data: vrData, subject: 'vr' },
      { data: mathsData, subject: 'maths' }
    ];
    dataSets.forEach(({ data, subject }) => {
      walkTopics(data, subject, (subj, topicKey, q) => {
        const key = `${subj}:${topicKey}:${q.id}`;
        if (ALLOW_LIST.has(key)) return;
        const leaked = findStemLeak(q);
        if (leaked) {
          findings.push(`${key} — "${q.question.slice(0, 80)}..." leaks "${leaked}"`);
        }
      });
    });
    if (findings.length) {
      console.log(`\nStem-leak findings (${findings.length}):`);
      findings.forEach(f => console.log('  ' + f));
    }
    expect(findings).toEqual([]);
  });
});

// ──────────────────────────────────────────────
// 2026-04-21: NumberLine stem/visual consistency
// Catches questions where the stem promises "Only X and Y are marked" but
// the visual tickInterval would render subdivision ticks that reveal the answer.
// Triggered by Ben flagging Maths Decimals Q223:
//   Stem: "A number line goes from 0 to 1. Only 0 and 1 are marked. An arrow
//          points to a position 3/4 of the way along."
//   Visual had tickInterval:0.25 → rendered ticks at 0, 0.25, 0.5, 0.75, 1.
//   Fixed by changing tickInterval to 1 (matching stem assertion).
// ──────────────────────────────────────────────
describe('NumberLine stem/visual consistency', () => {
  const ONLY_ENDPOINTS_RE = /only\s+(-?\d+(?:\.\d+)?)\s+and\s+(-?\d+(?:\.\d+)?)\s+(are\s+)?(?:marked|labelled|shown)/i;
  const NO_OTHER_MARKS_RE = /no\s+other\s+(marks|numbers|labels)|nothing\s+else\s+(is\s+)?(marked|labelled|shown)|unmarked|unlabelled/i;

  function findMismatches(data, subject) {
    const problems = [];
    Object.entries(data.topics || {}).forEach(([topicKey, topic]) => {
      (topic.questions || []).forEach(q => {
        if (!q.visual || q.visual.component !== 'NumberLine') return;
        const { min, max, tickInterval } = q.visual.props || {};
        if (min == null || max == null || tickInterval == null) return;
        const range = max - min;
        const stem = String(q.question || '');
        if ((ONLY_ENDPOINTS_RE.test(stem) || NO_OTHER_MARKS_RE.test(stem))
            && tickInterval < range) {
          problems.push(
            `${subject}:${topicKey}:${q.id} — stem claims only endpoints marked `
            + `but tickInterval=${tickInterval} < range=${range}`
          );
        }
      });
    });
    return problems;
  }

  it('no NumberLine visual contradicts its stem', () => {
    const problems = [
      ...findMismatches(mathsData, 'maths'),
      ...findMismatches(englishData, 'english'),
      ...findMismatches(vrData, 'vr')
    ];
    if (problems.length) console.log('NumberLine mismatches:', problems);
    expect(problems).toEqual([]);
  });
});

// ──────────────────────────────────────────────
// 2026-04-21: Order-of-operations acronym consistency
// The app standardises on BODMAS (UK National Curriculum, CGP/Bond/Letts
// 11+ workbooks, GL Assessment context). Mixed BIDMAS/BODMAS confuses
// children cross-referencing with their school materials.
// Triggered by Jacqui flagging Algebra Screen 4 (BIDMAS) contradicting
// Letter Sums lessons (BODMAS). Oracle triage: standardise on BODMAS.
// ──────────────────────────────────────────────
describe('Order-of-operations acronym — BODMAS only', () => {
  function findBidmas(data, subject) {
    const problems = [];
    const scan = (obj, path) => {
      if (obj == null) return;
      if (typeof obj === 'string') {
        if (/\bBIDMAS\b/i.test(obj)) {
          problems.push(`${subject}${path}: "${obj.slice(0, 80)}..."`);
        }
        return;
      }
      if (typeof obj !== 'object') return;
      if (Array.isArray(obj)) {
        obj.forEach((item, i) => scan(item, `${path}[${i}]`));
        return;
      }
      for (const [k, v] of Object.entries(obj)) {
        scan(v, `${path}.${k}`);
      }
    };
    scan(data, '');
    return problems;
  }

  it('no BIDMAS strings in any question bank', () => {
    const problems = [
      ...findBidmas(mathsData, 'maths'),
      ...findBidmas(englishData, 'english'),
      ...findBidmas(vrData, 'vr')
    ];
    if (problems.length) {
      console.log(`\nBIDMAS leaks (${problems.length}):`);
      problems.forEach(p => console.log('  ' + p));
    }
    expect(problems).toEqual([]);
  });
});

// ──────────────────────────────────────────────
// 2026-04-21: VR question-lesson map — no orphan sub-concept references
// Catches question-to-lesson mappings that point at sub-concepts which don't
// exist in the lesson bank (typos, removed lessons, unwritten content gaps).
// Triggered by Jacqui flagging mirror-coding questions (Q149-156) that were
// mapped to `reverse-decoding` because mirror-coding didn't exist as a lesson.
// Oracle wrote the mirror-coding sub-concept; this test prevents the reverse
// (orphan mappings) from recurring.
// ──────────────────────────────────────────────
describe('VR question-lesson map — no orphan sub-concept references', () => {
  const vrMap = require('../../../public/vr-question-lesson-map.json');
  const { letterCodesSubConcepts } = require('../../microLessons/staging/lettercodes-subconcepts');
  const { letterSumsSubConcepts } = require('../../microLessons/staging/lettersums-subconcepts');
  const { letterPairSeriesSubConcepts } = require('../../microLessons/staging/letterpairseries-subconcepts');
  const { letterMoveSubConcepts } = require('../../microLessons/staging/lettermove-subconcepts');
  const { missingLettersWordsSubConcepts } = require('../../microLessons/staging/missingletterswords-subconcepts');
  const { sharedLetterSubConcepts } = require('../../microLessons/staging/sharedletter-subconcepts');

  const stagingByTopic = {
    letterCodes: letterCodesSubConcepts,
    letterSums: letterSumsSubConcepts,
    letterPairSeries: letterPairSeriesSubConcepts,
    letterMove: letterMoveSubConcepts,
    missingLettersWords: missingLettersWordsSubConcepts,
    sharedLetter: sharedLetterSubConcepts
  };

  it('every mapped subConceptId exists in the staging lesson bank', () => {
    const orphans = [];
    Object.entries(vrMap).forEach(([topicKey, mappings]) => {
      const staging = stagingByTopic[topicKey];
      if (!staging) return; // topic has no staging file — skip
      const validIds = new Set(staging.map(sc => sc.id));
      (mappings || []).forEach(m => {
        if (m.subConceptId && !validIds.has(m.subConceptId)) {
          orphans.push(`${topicKey} Q${m.questionId} → "${m.subConceptId}" (not in staging)`);
        }
      });
    });
    if (orphans.length) {
      console.log(`\nOrphan mappings (${orphans.length}):`);
      orphans.forEach(o => console.log('  ' + o));
    }
    expect(orphans).toEqual([]);
  });
});

// ──────────────────────────────────────────────
// 2026-04-21: No "GL" jargon in child-facing content
// Children and most parents don't know "GL" means GL Assessment.
// Use "11+" instead. "GL" is fine in code comments, research docs, and
// parent-facing guides (parentGuides.js is not scanned here).
// Triggered by Jacqui flagging Letter Codes Q99 ("I don't know what a GL
// code means") — prompted a 71-replacement sweep across content files.
// Exception: "GL" is allowed as a letter-pair answer (e.g. options: ["FK",
// "GL"] where GL refers to the letters G and L). The check below only
// flags GL when it appears in prose (question stems, explanations,
// scenarios, titles, lesson bodies) — i.e. in string contexts longer than
// a typical letter-pair answer.
// ──────────────────────────────────────────────
describe('No GL jargon in child-facing content', () => {
  function findGLJargon(data, subject) {
    const problems = [];
    const scan = (obj, path) => {
      if (obj == null) return;
      if (typeof obj === 'string') {
        // Skip strings that are short (likely letter-pair answers like "GL").
        if (obj.length < 10) return;
        if (/\bGL\b/.test(obj)) {
          problems.push(`${subject}${path}: "${obj.slice(0, 100)}..."`);
        }
        return;
      }
      if (typeof obj !== 'object') return;
      if (Array.isArray(obj)) {
        obj.forEach((item, i) => scan(item, `${path}[${i}]`));
        return;
      }
      for (const [k, v] of Object.entries(obj)) {
        scan(v, `${path}.${k}`);
      }
    };
    scan(data, '');
    return problems;
  }

  it('no "GL" jargon in question banks (English, VR, Maths)', () => {
    const problems = [
      ...findGLJargon(mathsData, 'maths'),
      ...findGLJargon(englishData, 'english'),
      ...findGLJargon(vrData, 'vr')
    ];
    if (problems.length) {
      console.log(`\nGL jargon leaks (${problems.length}):`);
      problems.forEach(p => console.log('  ' + p));
    }
    expect(problems).toEqual([]);
  });
});

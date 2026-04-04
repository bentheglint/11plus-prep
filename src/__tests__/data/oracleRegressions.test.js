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

  // Import case sensitivity: letterSums import must use camelCase
  it('lessonData.js imports letterSums-subconcepts with correct case', () => {
    const fs = require('fs');
    const content = fs.readFileSync('src/microLessons/lessonData.js', 'utf8');
    expect(content).toContain("./staging/letterSums-subconcepts");
    expect(content).not.toContain("./staging/lettersums-subconcepts");
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

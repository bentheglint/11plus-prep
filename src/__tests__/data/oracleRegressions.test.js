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

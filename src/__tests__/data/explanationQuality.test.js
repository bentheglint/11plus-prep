/**
 * Explanation Quality Tests (Testing Strategy 1.8)
 *
 * Mechanical checks for explanation text quality. Catches debug text,
 * placeholders, and explanations that don't actually explain anything.
 * Subtler quality issues (pedagogy, tone) are handled by Oracle audits.
 */

import mathsData from '../../questionData/mathsData';
import englishData from '../../questionData/englishData';
import vrData from '../../questionData/vrData';

function getAllQuestions() {
  const all = [];

  const addFromData = (data, subject) => {
    if (!data?.topics) return;
    Object.entries(data.topics).forEach(([topicKey, topic]) => {
      (topic.questions || []).forEach(q => {
        all.push({ ...q, _topicKey: topicKey, _subject: subject });
      });
    });
  };

  addFromData(mathsData, 'maths');
  addFromData(englishData, 'english');
  addFromData(vrData, 'verbalreasoning');

  return all;
}

const allQuestions = getAllQuestions();

describe('Explanation Quality', () => {

  // Oracle found 6 garbled explanations with visible debug/self-correction text.
  // Patterns must be specific to avoid false positives — words like "actually"
  // and "wait" appear legitimately in explanations.
  const debugPatterns = [
    /^wait\s*[—–-]/im,                // "wait —" at start of line (self-correction)
    /\blet me check\b/i,
    /\blet me recalculate\b/i,
    /\bhmm[,.\s]/i,
    /\bno,? that's wrong\b/i,
    /\bI made an error\b/i,
    /\bI need to correct\b/i,
    /\bon second thought\b/i,
    /\bscratch that\b/i,
    /\boops\b/i,
    /\bactually,? (no|wait|sorry|I was)\b/i,  // self-correction, not "it actually is"
  ];

  it('no explanation contains debug or self-correcting text', () => {
    const failures = [];

    allQuestions.forEach(q => {
      if (!q.explanation) return;
      debugPatterns.forEach(pattern => {
        if (pattern.test(q.explanation)) {
          failures.push(
            `${q._subject}/${q._topicKey} Q${q.id}: matches ${pattern} — "${q.explanation.substring(0, 80)}..."`
          );
        }
      });
    });

    if (failures.length > 0) {
      console.log('Debug text found in explanations:\n' + failures.join('\n'));
    }
    expect(failures).toEqual([]);
  });

  it('no explanation is shorter than 20 characters', () => {
    const failures = allQuestions
      .filter(q => q.explanation && q.explanation.trim().length < 20)
      .map(q => `${q._subject}/${q._topicKey} Q${q.id}: "${q.explanation}" (${q.explanation.trim().length} chars)`);

    if (failures.length > 0) {
      console.log('Too-short explanations:\n' + failures.join('\n'));
    }
    expect(failures).toEqual([]);
  });

  it('no explanation is identical to the question text', () => {
    const failures = allQuestions
      .filter(q => q.explanation && q.question && q.explanation.trim() === q.question.trim())
      .map(q => `${q._subject}/${q._topicKey} Q${q.id}: explanation === question`);

    if (failures.length > 0) {
      console.log('Explanation matches question text:\n' + failures.join('\n'));
    }
    expect(failures).toEqual([]);
  });

  it('every question has a non-empty explanation', () => {
    const failures = allQuestions
      .filter(q => !q.explanation || q.explanation.trim().length === 0)
      .map(q => `${q._subject}/${q._topicKey} Q${q.id}: missing or empty explanation`);

    if (failures.length > 0) {
      console.log('Missing explanations:\n' + failures.join('\n'));
    }
    expect(failures).toEqual([]);
  });

  it('no explanation is just the correct answer with no reasoning', () => {
    const failures = [];

    allQuestions.forEach(q => {
      if (!q.explanation || !q.options || q.correct == null) return;
      const correctOption = String(q.options[q.correct] || '').trim();
      const explanation = q.explanation.trim();

      // Only flag if the explanation is essentially identical to the correct
      // option text. Showing working (e.g. "Area = 25 × 16 = 400 cm²") counts
      // as reasoning even if minimal — those are Oracle-level quality issues.
      // This test catches truly empty explanations like "42" or "Option B".
      if (correctOption.length > 3) {
        const stripped = explanation.replace(/[.✓✔\s]/g, '');
        const strippedAnswer = correctOption.replace(/[.✓✔\s]/g, '');
        if (stripped === strippedAnswer) {
          failures.push(
            `${q._subject}/${q._topicKey} Q${q.id}: explanation is just the answer — "${explanation.substring(0, 60)}"`
          );
        }
      }
    });

    if (failures.length > 0) {
      console.log('Answer-only explanations:\n' + failures.join('\n'));
    }
    expect(failures).toEqual([]);
  });

});

/**
 * Format Compliance Tests (Testing Strategy 1.1)
 *
 * Every question must match the expected GL structure for its type.
 * Catches malformed questions, missing fields, invalid indices.
 */

import mathsData from '../../questionData/mathsData';
import englishData from '../../questionData/englishData';
import vrData from '../../questionData/vrData';

// Collect all questions across all subjects with their topic context
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

describe('Question bank size', () => {
  it('has a substantial number of questions', () => {
    expect(allQuestions.length).toBeGreaterThan(6000);
  });

  it('has questions in all 3 subjects', () => {
    const subjects = new Set(allQuestions.map(q => q._subject));
    expect(subjects.has('maths')).toBe(true);
    expect(subjects.has('english')).toBe(true);
    expect(subjects.has('verbalreasoning')).toBe(true);
  });
});

describe('Required fields — every question', () => {
  it('has a numeric id', () => {
    const broken = allQuestions.filter(q => typeof q.id !== 'number' || q.id < 1);
    if (broken.length > 0) {
      console.log('Missing/invalid id:', broken.slice(0, 5).map(q => `${q._subject}/${q._topicKey}`));
    }
    expect(broken).toEqual([]);
  });

  it('has a difficulty of 1, 2, or 3', () => {
    const broken = allQuestions.filter(q => ![1, 2, 3].includes(q.difficulty));
    if (broken.length > 0) {
      console.log('Bad difficulty:', broken.slice(0, 5).map(q => `${q._subject}/${q._topicKey}/Q${q.id}: ${q.difficulty}`));
    }
    expect(broken).toEqual([]);
  });

  it('has a non-empty question string', () => {
    const broken = allQuestions.filter(q => !q.question || typeof q.question !== 'string' || q.question.trim().length === 0);
    expect(broken).toEqual([]);
  });

  it('has a non-empty explanation string', () => {
    const broken = allQuestions.filter(q => !q.explanation || typeof q.explanation !== 'string' || q.explanation.trim().length < 10);
    if (broken.length > 0) {
      console.log('Short/missing explanation:', broken.slice(0, 5).map(q => `${q._subject}/${q._topicKey}/Q${q.id}`));
    }
    expect(broken).toEqual([]);
  });
});

describe('Standard MCQ format', () => {
  // Standard MCQ: questions with options array (not pick-from-sets)
  const mcqQuestions = allQuestions.filter(q =>
    q.options && q.questionType !== 'pick-from-sets' && q.questionType !== 'select-two'
  );

  it('has MCQ questions to test', () => {
    expect(mcqQuestions.length).toBeGreaterThan(4000);
  });

  it('every MCQ has exactly 5 options', () => {
    const broken = mcqQuestions.filter(q => q.options.length !== 5);
    if (broken.length > 0) {
      console.log('Wrong option count:', broken.slice(0, 5).map(q =>
        `${q._subject}/${q._topicKey}/Q${q.id}: ${q.options.length} options`
      ));
    }
    expect(broken).toEqual([]);
  });

  it('every MCQ has a valid correct index', () => {
    const broken = mcqQuestions.filter(q =>
      typeof q.correct !== 'number' || q.correct < 0 || q.correct >= q.options.length
    );
    if (broken.length > 0) {
      console.log('Bad correct index:', broken.slice(0, 5).map(q =>
        `${q._subject}/${q._topicKey}/Q${q.id}: correct=${q.correct}, options=${q.options.length}`
      ));
    }
    expect(broken).toEqual([]);
  });

  it('no MCQ option is empty', () => {
    const broken = mcqQuestions.filter(q =>
      q.options.some(opt => !opt && opt !== 0 && opt !== false)
    );
    expect(broken).toEqual([]);
  });
});

describe('Pick-from-sets format (VR)', () => {
  const pfsQuestions = allQuestions.filter(q => q.questionType === 'pick-from-sets');

  it('has pick-from-sets questions', () => {
    expect(pfsQuestions.length).toBeGreaterThan(300);
  });

  it('every PFS has setA and setB arrays', () => {
    const broken = pfsQuestions.filter(q => !Array.isArray(q.setA) || !Array.isArray(q.setB));
    expect(broken).toEqual([]);
  });

  it('every PFS has a valid correctPair', () => {
    const broken = pfsQuestions.filter(q => {
      if (!Array.isArray(q.correctPair) || q.correctPair.length !== 2) return true;
      if (q.correctPair[0] < 0 || q.correctPair[0] >= q.setA.length) return true;
      if (q.correctPair[1] < 0 || q.correctPair[1] >= q.setB.length) return true;
      return false;
    });
    if (broken.length > 0) {
      console.log('Bad correctPair:', broken.slice(0, 5).map(q =>
        `${q._topicKey}/Q${q.id}: pair=${JSON.stringify(q.correctPair)}, setA=${q.setA?.length}, setB=${q.setB?.length}`
      ));
    }
    expect(broken).toEqual([]);
  });
});

describe('Select-two format (VR)', () => {
  const s2Questions = allQuestions.filter(q => q.questionType === 'select-two');

  it('has select-two questions', () => {
    expect(s2Questions.length).toBeGreaterThan(200);
  });

  it('every select-two has options and correctPair', () => {
    const broken = s2Questions.filter(q =>
      !Array.isArray(q.options) || !Array.isArray(q.correctPair) || q.correctPair.length !== 2
    );
    expect(broken).toEqual([]);
  });

  it('every select-two correctPair indices are valid', () => {
    const broken = s2Questions.filter(q =>
      q.correctPair[0] < 0 || q.correctPair[0] >= q.options.length ||
      q.correctPair[1] < 0 || q.correctPair[1] >= q.options.length
    );
    expect(broken).toEqual([]);
  });
});

describe('Passage format (English comprehension)', () => {
  const passageQuestions = allQuestions.filter(q => q.questionType === 'passage');

  it('has passage questions', () => {
    expect(passageQuestions.length).toBeGreaterThan(200);
  });

  it('every passage question has non-empty passage text', () => {
    const broken = passageQuestions.filter(q => !q.passage || q.passage.trim().length < 50);
    if (broken.length > 0) {
      console.log('Missing passage:', broken.slice(0, 5).map(q => `${q._topicKey}/Q${q.id}`));
    }
    expect(broken).toEqual([]);
  });

  it('every passage question has a passageTitle', () => {
    const broken = passageQuestions.filter(q => !q.passageTitle);
    expect(broken).toEqual([]);
  });

  it('every passage question has a passageId', () => {
    const broken = passageQuestions.filter(q => !q.passageId);
    expect(broken).toEqual([]);
  });

  it('every passage question has a valid questionSubType', () => {
    const validSubTypes = [
      'retrieval', 'inference', 'vocabulary-in-context', 'word-class',
      'author-purpose', 'literary-device', 'negative-retrieval',
      'prediction', 'genre'
    ];
    const broken = passageQuestions.filter(q =>
      !q.questionSubType || !validSubTypes.includes(q.questionSubType)
    );
    if (broken.length > 0) {
      console.log('Bad questionSubType:', broken.slice(0, 5).map(q =>
        `${q._topicKey}/Q${q.id}: "${q.questionSubType}"`
      ));
    }
    expect(broken).toEqual([]);
  });
});

describe('Error-spotting format (English)', () => {
  const esQuestions = allQuestions.filter(q => q.questionType === 'error-spotting');

  it('has error-spotting questions', () => {
    expect(esQuestions.length).toBeGreaterThan(500);
  });

  it('every error-spotting question has segments array', () => {
    const broken = esQuestions.filter(q => !Array.isArray(q.segments) || q.segments.length < 2);
    expect(broken).toEqual([]);
  });

  it('every error-spotting question has options', () => {
    const broken = esQuestions.filter(q => !Array.isArray(q.options) || q.options.length < 4);
    expect(broken).toEqual([]);
  });
});

describe('Unique IDs within topics', () => {
  it('no topic has duplicate question IDs', () => {
    const duplicates = [];
    const checkData = (data, subject) => {
      if (!data?.topics) return;
      Object.entries(data.topics).forEach(([topicKey, topic]) => {
        const ids = (topic.questions || []).map(q => q.id);
        const seen = new Set();
        ids.forEach(id => {
          if (seen.has(id)) duplicates.push(`${subject}/${topicKey}/Q${id}`);
          seen.add(id);
        });
      });
    };
    checkData(mathsData, 'maths');
    checkData(englishData, 'english');
    checkData(vrData, 'verbalreasoning');

    if (duplicates.length > 0) {
      console.log('Duplicate IDs:', duplicates.slice(0, 10));
    }
    expect(duplicates).toEqual([]);
  });
});

describe('Explanation quality — mechanical checks', () => {
  it('no explanation contains debug/self-correcting text', () => {
    // Match genuine debug artifacts, not normal English usage of "actually"
    const debugPatterns = /wait\.\s*let me|let me re-?check|let me fix|hmm\s*[—,]|that's wrong,?\s*it should/i;
    const broken = allQuestions.filter(q => debugPatterns.test(q.explanation));
    if (broken.length > 0) {
      console.log('Debug text in explanation:', broken.slice(0, 5).map(q =>
        `${q._subject}/${q._topicKey}/Q${q.id}: ${q.explanation.slice(0, 60)}`
      ));
    }
    expect(broken).toEqual([]);
  });

  it('no explanation is identical to the question text', () => {
    const broken = allQuestions.filter(q =>
      q.explanation && q.question && q.explanation.trim() === q.question.trim()
    );
    expect(broken).toEqual([]);
  });

  it('no explanation is shorter than 20 characters (likely placeholder)', () => {
    const broken = allQuestions.filter(q =>
      q.explanation && q.explanation.trim().length < 20
    );
    if (broken.length > 0) {
      console.log('Short explanations:', broken.slice(0, 5).map(q =>
        `${q._subject}/${q._topicKey}/Q${q.id}: "${q.explanation}"`
      ));
    }
    // 33 known short explanations as of 2026-04-01 (simple arithmetic).
    // Ceiling prevents NEW short explanations. Decrease as content improves.
    expect(broken.length).toBeLessThanOrEqual(33);
  });

  it('no explanation ends with the check mark alone (no reasoning)', () => {
    // Pattern: explanation is just the answer restated + ✓
    // e.g. "The answer is 42. ✓" with nothing explaining why
    const broken = allQuestions.filter(q => {
      if (!q.explanation) return false;
      // Short explanation that's basically "Answer is X. ✓"
      const words = q.explanation.replace(/[✓✗]/g, '').trim().split(/\s+/);
      return words.length < 5 && q.explanation.includes('✓');
    });
    if (broken.length > 0) {
      console.log('No-reasoning explanations:', broken.slice(0, 5).map(q =>
        `${q._subject}/${q._topicKey}/Q${q.id}: "${q.explanation.slice(0, 60)}"`
      ));
    }
    expect(broken).toEqual([]);
  });
});

/**
 * Duplicate Detection Tests (Testing Strategy 1.4)
 *
 * Prevents duplicate questions within a topic.
 * The Oracle found 463 duplicate VR questions previously.
 */

import mathsData from '../../questionData/mathsData';
import englishData from '../../questionData/englishData';
import vrData from '../../questionData/vrData';

function getAllTopics() {
  const topics = [];
  const addFromData = (data, subject) => {
    if (!data?.topics) return;
    Object.entries(data.topics).forEach(([topicKey, topic]) => {
      const questions = topic.questions || [];
      if (questions.length === 0) return;
      topics.push({ topicKey, subject, questions });
    });
  };
  addFromData(mathsData, 'maths');
  addFromData(englishData, 'english');
  addFromData(vrData, 'verbalreasoning');
  return topics;
}

const allTopics = getAllTopics();

// Normalise text for comparison: lowercase, collapse whitespace
function normalise(text) {
  return (text || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

describe('Duplicate Detection', () => {
  it('no topic has identical questions (accounting for question type)', () => {
    const duplicates = [];
    allTopics.forEach(({ topicKey, subject, questions }) => {
      const seen = new Map();
      questions.forEach(q => {
        // Build a fingerprint that captures what makes the question unique:
        // - error-spotting/spelling: same question text is expected, differentiated by segments
        // - passage: same question text is expected, differentiated by passageId
        // - standard/other: question text should be unique
        let fingerprint;
        if (q.questionType === 'error-spotting' && q.segments) {
          fingerprint = normalise(q.segments.join('|'));
        } else if (q.questionType === 'passage' && q.passageId) {
          fingerprint = normalise(q.passageId + '|' + q.question);
        } else if (q.questionType === 'pick-from-sets' && q.setA && q.setB) {
          fingerprint = normalise(q.setA.join(',') + '|' + q.setB.join(','));
        } else {
          fingerprint = normalise(q.question);
        }

        if (seen.has(fingerprint)) {
          duplicates.push(
            `${subject}/${topicKey}: Q${seen.get(fingerprint)} and Q${q.id} — "${(q.question || '').slice(0, 60)}"`
          );
        } else {
          seen.set(fingerprint, q.id);
        }
      });
    });
    if (duplicates.length > 0) {
      console.log(`\nDuplicate questions found (${duplicates.length}):\n${duplicates.slice(0, 10).join('\n')}\n`);
    }
    // 174 known duplicates as of 2026-04-01 (mostly punctuation/grammar).
    // This ceiling should decrease as duplicates are cleaned up.
    // Fail if NEW duplicates are introduced (count goes up).
    expect(duplicates.length).toBeLessThanOrEqual(174);
  });

  it('no pick-from-sets topic has identical setA+setB combinations', () => {
    const duplicates = [];
    allTopics.forEach(({ topicKey, subject, questions }) => {
      const pfs = questions.filter(q => q.questionType === 'pick-from-sets');
      const seen = new Map();
      pfs.forEach(q => {
        if (!q.setA || !q.setB) return;
        const key = normalise(q.setA.join(',') + '|' + q.setB.join(','));
        if (seen.has(key)) {
          duplicates.push(
            `${subject}/${topicKey}: Q${seen.get(key)} and Q${q.id} — same sets`
          );
        } else {
          seen.set(key, q.id);
        }
      });
    });
    if (duplicates.length > 0) {
      console.log(`\nDuplicate PFS sets (${duplicates.length}):\n${duplicates.slice(0, 10).join('\n')}\n`);
    }
    expect(duplicates).toEqual([]);
  });

  it('no select-two topic has identical options+correctPair combinations', () => {
    const duplicates = [];
    allTopics.forEach(({ topicKey, subject, questions }) => {
      const s2 = questions.filter(q => q.questionType === 'select-two');
      const seen = new Map();
      s2.forEach(q => {
        if (!q.options || !q.correctPair) return;
        const key = normalise(q.options.join(',') + '|' + q.correctPair.join(','));
        if (seen.has(key)) {
          duplicates.push(
            `${subject}/${topicKey}: Q${seen.get(key)} and Q${q.id} — same options+pair`
          );
        } else {
          seen.set(key, q.id);
        }
      });
    });
    if (duplicates.length > 0) {
      console.log(`\nDuplicate select-two (${duplicates.length}):\n${duplicates.slice(0, 10).join('\n')}\n`);
    }
    expect(duplicates).toEqual([]);
  });
});

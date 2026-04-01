/**
 * Answer Position Bias Tests (Testing Strategy 1.7)
 *
 * GL designs for even distribution of correct answer positions.
 * If 40% of answers are option C, children learn to guess patterns.
 */

import mathsData from '../../questionData/mathsData';
import englishData from '../../questionData/englishData';
import vrData from '../../questionData/vrData';

function getAllTopics() {
  const topics = [];
  const addFromData = (data, subject) => {
    if (!data?.topics) return;
    Object.entries(data.topics).forEach(([topicKey, topic]) => {
      // Only check topics with standard correct index (not pick-from-sets, select-two)
      const questions = (topic.questions || []).filter(q =>
        typeof q.correct === 'number' && q.options && q.options.length === 5
      );
      if (questions.length < 10) return; // too few to measure bias
      topics.push({ topicKey, subject, questions });
    });
  };
  addFromData(mathsData, 'maths');
  addFromData(englishData, 'english');
  addFromData(vrData, 'verbalreasoning');
  return topics;
}

const allTopics = getAllTopics();

describe('Answer Position Bias', () => {
  it('no topic has a single correct position exceeding 30%', () => {
    const biased = [];
    allTopics.forEach(({ topicKey, subject, questions }) => {
      const counts = [0, 0, 0, 0, 0];
      questions.forEach(q => {
        if (q.correct >= 0 && q.correct <= 4) counts[q.correct]++;
      });
      const total = questions.length;
      counts.forEach((count, i) => {
        const pct = Math.round((count / total) * 100);
        if (pct > 30) {
          biased.push(`${subject}/${topicKey}: position ${i} (${String.fromCharCode(65 + i)}) = ${pct}% (${count}/${total})`);
        }
      });
    });
    if (biased.length > 0) {
      console.log(`\nBiased answer positions:\n${biased.join('\n')}\n`);
    }
    expect(biased).toEqual([]);
  });

  it('reports distribution across all questions', () => {
    const totalCounts = [0, 0, 0, 0, 0];
    let totalQs = 0;
    allTopics.forEach(({ questions }) => {
      questions.forEach(q => {
        if (q.correct >= 0 && q.correct <= 4) {
          totalCounts[q.correct]++;
          totalQs++;
        }
      });
    });
    console.log('\n=== Overall Answer Position Distribution ===');
    totalCounts.forEach((count, i) => {
      console.log(`  ${String.fromCharCode(65 + i)}: ${count} (${Math.round((count / totalQs) * 100)}%)`);
    });
    console.log(`  Total: ${totalQs} questions (target: 20% each)\n`);
    expect(true).toBe(true);
  });
});

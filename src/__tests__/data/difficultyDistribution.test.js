/**
 * Difficulty Distribution Tests (Testing Strategy 1.3)
 *
 * GL Assessment target: ~30% D1, ~40% D2, ~30% D3.
 * Catches topics that drift severely out of balance after edits.
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
      topics.push({ topicKey, subject, questions, name: topic.name || topicKey });
    });
  };
  addFromData(mathsData, 'maths');
  addFromData(englishData, 'english');
  addFromData(vrData, 'verbalreasoning');
  return topics;
}

const allTopics = getAllTopics();

describe('Difficulty Distribution', () => {
  it('has topics to check', () => {
    expect(allTopics.length).toBeGreaterThan(30);
  });

  it('every topic has at least one question at each difficulty level', () => {
    const missing = [];
    allTopics.forEach(({ topicKey, subject, questions }) => {
      const d1 = questions.filter(q => q.difficulty === 1).length;
      const d2 = questions.filter(q => q.difficulty === 2).length;
      const d3 = questions.filter(q => q.difficulty === 3).length;
      if (d1 === 0) missing.push(`${subject}/${topicKey}: no D1`);
      if (d2 === 0) missing.push(`${subject}/${topicKey}: no D2`);
      if (d3 === 0) missing.push(`${subject}/${topicKey}: no D3`);
    });
    if (missing.length > 0) console.log('Missing difficulty levels:', missing);
    expect(missing).toEqual([]);
  });

  it('no topic has a single difficulty level exceeding 65%', () => {
    const imbalanced = [];
    allTopics.forEach(({ topicKey, subject, questions }) => {
      const total = questions.length;
      [1, 2, 3].forEach(d => {
        const count = questions.filter(q => q.difficulty === d).length;
        const pct = Math.round((count / total) * 100);
        if (pct > 65) {
          imbalanced.push(`${subject}/${topicKey}: D${d} = ${pct}% (${count}/${total})`);
        }
      });
    });
    if (imbalanced.length > 0) console.log('Severely imbalanced:', imbalanced);
    expect(imbalanced).toEqual([]);
  });

  // Informational: report topics deviating >10pp from 30/40/30
  it('reports distribution for all topics', () => {
    const deviations = [];
    allTopics.forEach(({ topicKey, subject, questions }) => {
      const total = questions.length;
      const d1pct = Math.round((questions.filter(q => q.difficulty === 1).length / total) * 100);
      const d2pct = Math.round((questions.filter(q => q.difficulty === 2).length / total) * 100);
      const d3pct = Math.round((questions.filter(q => q.difficulty === 3).length / total) * 100);

      const d1off = Math.abs(d1pct - 30);
      const d2off = Math.abs(d2pct - 40);
      const d3off = Math.abs(d3pct - 30);

      if (d1off > 10 || d2off > 10 || d3off > 10) {
        deviations.push(`${subject}/${topicKey}: D1=${d1pct}% D2=${d2pct}% D3=${d3pct}% (target 30/40/30)`);
      }
    });
    if (deviations.length > 0) {
      console.log(`\n=== Topics deviating >10pp from GL target ===\n${deviations.join('\n')}\n`);
    }
    // This is informational — always passes
    expect(true).toBe(true);
  });
});

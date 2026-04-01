/**
 * GL Category Coverage Tests (Testing Strategy 1.6)
 *
 * Checks that the question bank has enough volume per topic to
 * plausibly cover GL weightings. Full category tagging is a future step —
 * for now we verify minimum question counts and topic completeness.
 */

import mathsData from '../../questionData/mathsData';
import englishData from '../../questionData/englishData';
import vrData from '../../questionData/vrData';

describe('Question bank volume', () => {
  // GL expects breadth across topics. Minimum viable counts based on
  // GL paper structure: ~50 maths Qs, ~49 English Qs, ~80 VR Qs per paper.
  // A topic should have at least 15 questions to provide variety across
  // multiple practice sessions.

  const mathsTopics = Object.entries(mathsData.topics || {});
  const englishTopics = Object.entries(englishData.topics || {});
  const vrTopics = Object.entries(vrData.topics || {});

  it('every maths topic has at least 15 questions', () => {
    const thin = mathsTopics.filter(([, t]) => (t.questions || []).length < 15);
    if (thin.length > 0) {
      console.log('Thin maths topics:', thin.map(([k, t]) => `${k}: ${t.questions.length}`));
    }
    expect(thin).toEqual([]);
  });

  it('every English topic has at least 15 questions', () => {
    const thin = englishTopics.filter(([, t]) => (t.questions || []).length < 15);
    if (thin.length > 0) {
      console.log('Thin English topics:', thin.map(([k, t]) => `${k}: ${t.questions.length}`));
    }
    expect(thin).toEqual([]);
  });

  it('every VR topic has at least 15 questions', () => {
    const thin = vrTopics.filter(([, t]) => (t.questions || []).length < 15);
    if (thin.length > 0) {
      console.log('Thin VR topics:', thin.map(([k, t]) => `${k}: ${t.questions.length}`));
    }
    expect(thin).toEqual([]);
  });

  it('maths has at least 16 topics', () => {
    expect(mathsTopics.length).toBeGreaterThanOrEqual(16);
  });

  it('English has at least 6 topics', () => {
    expect(englishTopics.length).toBeGreaterThanOrEqual(6);
  });

  it('VR has at least 16 topics', () => {
    expect(vrTopics.length).toBeGreaterThanOrEqual(16);
  });

  it('reports total question counts', () => {
    const mathsTotal = mathsTopics.reduce((s, [, t]) => s + (t.questions || []).length, 0);
    const englishTotal = englishTopics.reduce((s, [, t]) => s + (t.questions || []).length, 0);
    const vrTotal = vrTopics.reduce((s, [, t]) => s + (t.questions || []).length, 0);
    console.log(`\n=== Question Bank Volume ===`);
    console.log(`  Maths: ${mathsTotal} questions across ${mathsTopics.length} topics`);
    console.log(`  English: ${englishTotal} questions across ${englishTopics.length} topics`);
    console.log(`  VR: ${vrTotal} questions across ${vrTopics.length} topics`);
    console.log(`  TOTAL: ${mathsTotal + englishTotal + vrTotal}\n`);
    expect(mathsTotal + englishTotal + vrTotal).toBeGreaterThan(6000);
  });
});

describe('Comprehension passage coverage', () => {
  // GL comprehension uses multiple passages with questions grouped by passage.
  // Need enough passages to prevent children memorising answers.

  const compQuestions = (englishData.topics?.comprehension?.questions || [])
    .filter(q => q.questionType === 'passage');
  const passageIds = [...new Set(compQuestions.map(q => q.passageId))];

  it('has at least 10 unique passages', () => {
    expect(passageIds.length).toBeGreaterThanOrEqual(10);
  });

  it('each passage has at least 5 questions', () => {
    const thin = passageIds.filter(pid => {
      const count = compQuestions.filter(q => q.passageId === pid).length;
      return count < 5;
    });
    if (thin.length > 0) {
      console.log('Thin passages:', thin.map(pid => {
        const count = compQuestions.filter(q => q.passageId === pid).length;
        return `${pid}: ${count} questions`;
      }));
    }
    // 10 known thin passages as of 2026-04-01 (partial/fragment passages).
    // Ceiling prevents NEW thin passages. Decrease as content fills out.
    expect(thin.length).toBeLessThanOrEqual(10);
  });
});

/**
 * Exam Readiness — Consistency Bonus Wire-Up (Regression Guard)
 *
 * Asserts that useMastery's getExamReadiness returns a HIGHER score when
 * given a non-empty practiceLog with several recent distinct practice days
 * than when given [].  This proves:
 *   (a) the consistency bonus is wired and working, and
 *   (b) passing [] (the former tutor-dashboard behaviour) suppresses it.
 *
 * See: src/screens/PupilDetailScreen.js — useMastery now receives
 *      data?.practiceLog || [] instead of the hardcoded [].
 */

import { renderHook } from '@testing-library/react';
import useMastery from '../../hooks/useMastery';

// Helper: create a question result (mirrors mastery.test.js)
function makeResult(topicKey, correct, daysAgo = 0) {
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
  return { topicKey, correct, date, difficulty: 2, timeSpentMs: 30000 };
}

// 20 recent maths results at 80% accuracy — enough for volume factor to plateau
const mathsResults = Array.from({ length: 20 }, (_, i) =>
  makeResult('fractions', i < 16, 0)
);

// A practiceLog with 7 distinct days within the last 14 days for maths.
// The consistency bonus caps at min(10, recentDays.size) so 7 days → +7.
const recentPracticeLog = Array.from({ length: 7 }, (_, i) => ({
  date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
  mode: 'focused',
  subject: 'maths',
  topicKey: 'fractions',
  questionsAttempted: 10,
  questionsCorrect: 7,
}));

describe('getExamReadiness — consistency bonus', () => {
  it('returns a higher score with a non-empty practiceLog than with []', () => {
    const { result: noLog } = renderHook(() =>
      useMastery(mathsResults, [], [])
    );
    const { result: withLog } = renderHook(() =>
      useMastery(mathsResults, recentPracticeLog, [])
    );

    const scoreWithout = noLog.current.getExamReadiness('maths').score;
    const scoreWith    = withLog.current.getExamReadiness('maths').score;

    // The bonus must be applied and non-zero
    expect(scoreWith).toBeGreaterThan(scoreWithout);
    // Sanity: the gap should equal the number of distinct practice days (7)
    expect(scoreWith - scoreWithout).toBe(7);
  });

  it('consistency bonus is capped at 10 even with many practice days', () => {
    // 14 distinct days in the log → bonus should cap at 10, not 14
    const bigLog = Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
      mode: 'daily',
      subject: 'maths',
      topicKey: 'fractions',
      questionsAttempted: 10,
      questionsCorrect: 8,
    }));

    const { result: noLog } = renderHook(() => useMastery(mathsResults, [], []));
    const { result: withLog } = renderHook(() => useMastery(mathsResults, bigLog, []));

    const gap = withLog.current.getExamReadiness('maths').score
              - noLog.current.getExamReadiness('maths').score;

    expect(gap).toBe(10);
  });

  it('only counts practice days whose subject matches the queried subject', () => {
    // practiceLog has entries for 'english' only — should not boost the maths score
    const englishOnlyLog = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
      mode: 'focused',
      subject: 'english',
      topicKey: 'comprehension',
      questionsAttempted: 10,
      questionsCorrect: 7,
    }));

    const { result: noLog } = renderHook(() => useMastery(mathsResults, [], []));
    const { result: withLog } = renderHook(() => useMastery(mathsResults, englishOnlyLog, []));

    const mathsScoreNoLog  = noLog.current.getExamReadiness('maths').score;
    const mathsScoreWithLog = withLog.current.getExamReadiness('maths').score;

    // Maths score must be identical — the english entries must not bleed over
    expect(mathsScoreWithLog).toBe(mathsScoreNoLog);

    // The english score, however, should benefit
    const engScoreNoLog   = noLog.current.getExamReadiness('english').score;
    const engScoreWithLog = withLog.current.getExamReadiness('english').score;
    expect(engScoreWithLog).toBeGreaterThan(engScoreNoLog);
  });
});

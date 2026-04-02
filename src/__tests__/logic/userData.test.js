/**
 * User Data Isolation Tests (Testing Strategy 4.5)
 *
 * Tests that each user's data is isolated via prefixed localStorage keys,
 * question results are capped at 5000, and migration from shared keys works.
 */

import { renderHook, act } from '@testing-library/react';
import useUserData from '../../hooks/useUserData';

// jsdom provides a real localStorage — use it directly
beforeEach(() => {
  localStorage.clear();
});

describe('User Data Isolation', () => {

  it('keys are prefixed with user:name:', () => {
    const { result } = renderHook(() => useUserData('Alice'));

    act(() => {
      result.current.saveQuizResult({ topic: 'percentages', score: 5, total: 10 });
    });

    const saved = JSON.parse(localStorage.getItem('user:Alice:quiz-history'));
    expect(saved).toEqual([{ topic: 'percentages', score: 5, total: 10 }]);
  });

  it('Alice data is not visible to Bob', () => {
    // Alice saves quiz data
    const { result: aliceResult } = renderHook(() => useUserData('Alice'));
    act(() => {
      aliceResult.current.saveQuizResult({ topic: 'percentages', score: 8, total: 10 });
    });

    // Bob loads — should see empty quiz history
    const { result: bobResult } = renderHook(() => useUserData('Bob'));
    expect(bobResult.current.quizHistory).toEqual([]);

    // Alice key exists, Bob key does not
    expect(localStorage.getItem('user:Alice:quiz-history')).not.toBeNull();
    expect(localStorage.getItem('user:Bob:quiz-history')).toBeNull();
  });

  it('question results are capped at 5000 entries', () => {
    // Pre-seed with 5000 results
    const existing = Array.from({ length: 5000 }, (_, i) => ({
      id: i, topicKey: 'percentages', correct: true
    }));
    localStorage.setItem('user:Alice:question-results', JSON.stringify(existing));

    const { result } = renderHook(() => useUserData('Alice'));
    expect(result.current.questionResults.length).toBe(5000);

    // Add 1 more — should still be capped at 5000, oldest dropped
    act(() => {
      result.current.saveQuestionResult({ id: 9999, topicKey: 'percentages', correct: false });
    });

    const saved = JSON.parse(localStorage.getItem('user:Alice:question-results'));
    expect(saved.length).toBe(5000);
    // The newest item should be last
    expect(saved[saved.length - 1].id).toBe(9999);
  });

  it('migration copies shared data to user-prefixed keys in localStorage', () => {
    // Simulate old shared data from before user isolation
    localStorage.setItem('quiz-history', JSON.stringify([{ topic: 'algebra', score: 7 }]));

    renderHook(() => useUserData('Alice'));

    // Migration runs in useEffect — verify localStorage was written
    const migrated = JSON.parse(localStorage.getItem('user:Alice:quiz-history'));
    expect(migrated).toEqual([{ topic: 'algebra', score: 7 }]);
    expect(localStorage.getItem('user:Alice:migrated')).toBe('true');
  });

  it('does not overwrite existing user data during migration', () => {
    // Shared data exists but user already has their own data
    localStorage.setItem('quiz-history', JSON.stringify([{ topic: 'algebra', score: 7 }]));
    localStorage.setItem('user:Alice:quiz-history', JSON.stringify([{ topic: 'decimals', score: 9 }]));

    const { result } = renderHook(() => useUserData('Alice'));

    // User's own data should be preserved, not overwritten by shared data
    expect(result.current.quizHistory).toEqual([{ topic: 'decimals', score: 9 }]);
  });

  it('pre-existing user data loads correctly on mount', () => {
    localStorage.setItem('user:Alice:quiz-history', JSON.stringify([{ topic: 'decimals', score: 9 }]));
    localStorage.setItem('user:Alice:migrated', 'true');

    const { result } = renderHook(() => useUserData('Alice'));
    expect(result.current.quizHistory).toEqual([{ topic: 'decimals', score: 9 }]);
  });

  it('returns empty data when no username provided', () => {
    const { result } = renderHook(() => useUserData(null));
    expect(result.current.quizHistory).toEqual([]);
    expect(result.current.questionResults).toEqual([]);
    expect(result.current.topicPerformance).toEqual({});
  });

  it('save methods are no-ops when no username', () => {
    const { result } = renderHook(() => useUserData(null));

    act(() => {
      result.current.saveQuizResult({ topic: 'test', score: 1 });
    });

    // No user-prefixed keys should exist
    const allKeys = Object.keys(localStorage);
    const userKeys = allKeys.filter(k => k.startsWith('user:'));
    expect(userKeys.length).toBe(0);
  });

});

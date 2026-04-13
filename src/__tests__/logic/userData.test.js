/**
 * User Data Isolation Tests (Testing Strategy 4.5)
 *
 * Tests that each user's data is isolated via prefixed localStorage keys,
 * question results are capped at 5000, and migration from shared keys works.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import useD1Data from '../../hooks/useD1Data';

// jsdom provides a real localStorage — use it directly
beforeEach(() => {
  localStorage.clear();
});

describe('User Data Isolation', () => {

  it('keys are prefixed with user:name:', () => {
    const { result } = renderHook(() => useD1Data('Alice'));

    act(() => {
      result.current.saveQuizResult({ topic: 'percentages', score: 5, total: 10 });
    });

    const saved = JSON.parse(localStorage.getItem('user:Alice:quiz-history'));
    expect(saved).toEqual([{ topic: 'percentages', score: 5, total: 10 }]);
  });

  it('Alice data is not visible to Bob', () => {
    // Alice saves quiz data
    const { result: aliceResult } = renderHook(() => useD1Data('Alice'));
    act(() => {
      aliceResult.current.saveQuizResult({ topic: 'percentages', score: 8, total: 10 });
    });

    // Bob loads — should see empty quiz history
    const { result: bobResult } = renderHook(() => useD1Data('Bob'));
    expect(bobResult.current.quizHistory).toEqual([]);

    // Alice key exists, Bob key does not
    expect(localStorage.getItem('user:Alice:quiz-history')).not.toBeNull();
    expect(localStorage.getItem('user:Bob:quiz-history')).toBeNull();
  });

  it('question results are capped at 5000 entries', async () => {
    // Pre-seed with 5000 results
    const existing = Array.from({ length: 5000 }, (_, i) => ({
      id: i, topicKey: 'percentages', correct: true
    }));
    localStorage.setItem('user:Alice:question-results', JSON.stringify(existing));

    const { result } = renderHook(() => useD1Data('Alice'));
    // Wait for async load from legacy localStorage fallback
    await waitFor(() => expect(result.current.questionResults.length).toBe(5000));

    // Add 1 more — should still be capped at 5000, oldest dropped
    act(() => {
      result.current.saveQuestionResult({ id: 9999, topicKey: 'percentages', correct: false });
    });

    const saved = JSON.parse(localStorage.getItem('user:Alice:question-results'));
    expect(saved.length).toBe(5000);
    // The newest item should be last
    expect(saved[saved.length - 1].id).toBe(9999);
  });

  it('loads user-prefixed legacy data as fallback when D1 unavailable', async () => {
    // Simulate existing user-prefixed data (the format useD1Data falls back to)
    localStorage.setItem('user:Alice:quiz-history', JSON.stringify([{ topic: 'algebra', score: 7 }]));

    const { result } = renderHook(() => useD1Data('Alice'));

    // Wait for async load — hook detects legacy user-prefixed data and reads it
    await waitFor(() => expect(result.current.quizHistory.length).toBe(1));
    expect(result.current.quizHistory[0].topic).toBe('algebra');
  });

  it('does not overwrite existing user data during migration', async () => {
    // Shared data exists but user already has their own data
    localStorage.setItem('quiz-history', JSON.stringify([{ topic: 'algebra', score: 7 }]));
    localStorage.setItem('user:Alice:quiz-history', JSON.stringify([{ topic: 'decimals', score: 9 }]));

    const { result } = renderHook(() => useD1Data('Alice'));

    // Wait for async load, then verify user's own data preserved
    await waitFor(() => expect(result.current.quizHistory).toEqual([{ topic: 'decimals', score: 9 }]));
  });

  it('pre-existing user data loads correctly on mount', async () => {
    localStorage.setItem('user:Alice:quiz-history', JSON.stringify([{ topic: 'decimals', score: 9 }]));
    localStorage.setItem('user:Alice:migrated', 'true');

    const { result } = renderHook(() => useD1Data('Alice'));
    await waitFor(() => expect(result.current.quizHistory).toEqual([{ topic: 'decimals', score: 9 }]));
  });

  it('returns empty data when no username provided', () => {
    const { result } = renderHook(() => useD1Data(null));
    expect(result.current.quizHistory).toEqual([]);
    expect(result.current.questionResults).toEqual([]);
    expect(result.current.topicPerformance).toEqual({});
  });

  it('save methods are no-ops when no username', () => {
    const { result } = renderHook(() => useD1Data(null));

    act(() => {
      result.current.saveQuizResult({ topic: 'test', score: 1 });
    });

    // No user-prefixed keys should exist
    const allKeys = Object.keys(localStorage);
    const userKeys = allKeys.filter(k => k.startsWith('user:'));
    expect(userKeys.length).toBe(0);
  });

});

/**
 * User Data Isolation Tests (Testing Strategy 4.5)
 *
 * Tests per-user isolation, 5000-entry cap on question results, and legacy
 * localStorage fallback when D1 is unavailable. Dual-write to localStorage
 * was removed on 2026-04-23 — these tests now assert against in-memory
 * hook state, not localStorage round-trips. The legacy-fallback paths are
 * still tested because the migration flow still reads from localStorage.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import useD1Data from '../../hooks/useD1Data';

// jsdom provides a real localStorage — use it directly
beforeEach(() => {
  localStorage.clear();
});

describe('User Data Isolation', () => {

  it('saveQuizResult updates the hook state for the current user', () => {
    const { result } = renderHook(() => useD1Data('Alice'));

    act(() => {
      result.current.saveQuizResult({ topic: 'percentages', score: 5, total: 10 });
    });

    expect(result.current.quizHistory).toEqual([{ topic: 'percentages', score: 5, total: 10 }]);
  });

  it('Alice state and Bob state are independent', () => {
    const { result: aliceResult } = renderHook(() => useD1Data('Alice'));
    act(() => {
      aliceResult.current.saveQuizResult({ topic: 'percentages', score: 8, total: 10 });
    });

    const { result: bobResult } = renderHook(() => useD1Data('Bob'));
    expect(bobResult.current.quizHistory).toEqual([]);
    expect(aliceResult.current.quizHistory).toHaveLength(1);
  });

  it('question results are capped at 5000 entries', async () => {
    // Pre-seed via legacy localStorage — hook picks it up on mount
    const existing = Array.from({ length: 5000 }, (_, i) => ({
      id: i, topicKey: 'percentages', correct: true
    }));
    localStorage.setItem('user:Alice:question-results', JSON.stringify(existing));

    const { result } = renderHook(() => useD1Data('Alice'));
    await waitFor(() => expect(result.current.questionResults.length).toBe(5000));

    act(() => {
      result.current.saveQuestionResult({ id: 9999, topicKey: 'percentages', correct: false });
    });

    expect(result.current.questionResults.length).toBe(5000);
    expect(result.current.questionResults[result.current.questionResults.length - 1].id).toBe(9999);
  });

  it('loads user-prefixed legacy data as fallback when D1 unavailable', async () => {
    localStorage.setItem('user:Alice:quiz-history', JSON.stringify([{ topic: 'algebra', score: 7 }]));

    const { result } = renderHook(() => useD1Data('Alice'));

    await waitFor(() => expect(result.current.quizHistory.length).toBe(1));
    expect(result.current.quizHistory[0].topic).toBe('algebra');
  });

  it('does not overwrite existing user data during migration', async () => {
    localStorage.setItem('quiz-history', JSON.stringify([{ topic: 'algebra', score: 7 }]));
    localStorage.setItem('user:Alice:quiz-history', JSON.stringify([{ topic: 'decimals', score: 9 }]));

    const { result } = renderHook(() => useD1Data('Alice'));

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

    expect(result.current.quizHistory).toEqual([]);
  });

});

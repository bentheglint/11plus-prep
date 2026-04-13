/**
 * Hook Composition Integration Tests (Testing Strategy Part 5, Priority 3)
 *
 * Tests that useUserData, useMastery, and useStreaksAndPP compose correctly
 * when wired together the way App.js does. Verifies data flows through the
 * chain and survives unmount/remount.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import useD1Data from '../../hooks/useD1Data';
import useMastery from '../../hooks/useMastery';
import useStreaksAndPP from '../../hooks/useStreaksAndPP';

beforeEach(() => {
  localStorage.clear();
});

// Helper: compose hooks like App.js does (lines 75-88)
function useComposedHooks(userName) {
  const userData = useD1Data(userName);
  const mastery = useMastery(
    userData.questionResults,
    userData.practiceLog,
    userData.mockTestHistory
  );
  const streaksAndPP = useStreaksAndPP(
    userData.streakData,
    userData.prepPointsData,
    userData.saveStreakData,
    userData.savePrepPoints
  );
  return { userData, mastery, streaksAndPP };
}

function makeResult(topicKey, correct, difficulty = 2) {
  return {
    id: Date.now() + Math.random(),
    date: new Date().toISOString(),
    questionId: Math.floor(Math.random() * 1000),
    topicKey,
    subject: 'maths',
    difficulty,
    correct,
    timeSpentMs: 30000,
    mode: 'focused',
    sessionId: 1,
  };
}

describe('Hook Composition', () => {

  it('mastery reflects saved question results', () => {
    const { result } = renderHook(() => useComposedHooks('Alice'));

    // Save 20 correct results (full volume ramp)
    act(() => {
      for (let i = 0; i < 20; i++) {
        result.current.userData.saveQuestionResult(makeResult('percentages', true));
      }
    });

    const mastery = result.current.mastery.getTopicMastery('percentages');
    expect(mastery.score).toBe(100);
    expect(mastery.totalQuestions).toBe(20);
    expect(mastery.stars).toBe(5);
  });

  it('streak increments on quiz completion', () => {
    const { result } = renderHook(() => useComposedHooks('Alice'));

    expect(result.current.streaksAndPP.currentStreak).toBe(0);

    act(() => {
      result.current.streaksAndPP.recordQuizCompletion();
    });

    expect(result.current.streaksAndPP.currentStreak).toBe(1);
    expect(result.current.streaksAndPP.lastQuizDate).toBeTruthy();
  });

  it('prep points increase on award', () => {
    const { result } = renderHook(() => useComposedHooks('Alice'));

    expect(result.current.streaksAndPP.getLevelInfo().totalPP).toBe(0);

    act(() => {
      result.current.streaksAndPP.awardPP(50, 'test');
    });

    expect(result.current.streaksAndPP.getLevelInfo().totalPP).toBe(50);
  });

  it('all data survives unmount/remount', async () => {
    // Mount and save data
    const { result: r1, unmount } = renderHook(() => useComposedHooks('Alice'));

    act(() => {
      for (let i = 0; i < 10; i++) {
        r1.current.userData.saveQuestionResult(makeResult('algebra', i < 7));
      }
      r1.current.userData.savePracticeSession({
        id: 1, date: '2026-04-01', mode: 'focused',
        subject: 'maths', topicKey: 'algebra',
        questionsAttempted: 10, questionsCorrect: 7,
      });
      r1.current.streaksAndPP.recordQuizCompletion();
      r1.current.streaksAndPP.awardPP(25, 'test');
    });

    // Capture state before unmount
    const mastery1 = r1.current.mastery.getTopicMastery('algebra');
    const streak1 = r1.current.streaksAndPP.currentStreak;
    const pp1 = r1.current.streaksAndPP.getLevelInfo().totalPP;

    unmount();

    // Remount — should reload from dual-written localStorage via async fallback
    const { result: r2 } = renderHook(() => useComposedHooks('Alice'));

    // Wait for async load from legacy localStorage
    await waitFor(() => expect(r2.current.userData.questionResults).toHaveLength(10));
    expect(r2.current.userData.practiceLog).toHaveLength(1);
    expect(r2.current.mastery.getTopicMastery('algebra').totalQuestions).toBe(10);
    expect(r2.current.streaksAndPP.currentStreak).toBe(streak1);
    expect(r2.current.streaksAndPP.getLevelInfo().totalPP).toBe(pp1);
  });

  it('different users have isolated data chains', () => {
    const { result: alice } = renderHook(() => useComposedHooks('Alice'));
    const { result: bob } = renderHook(() => useComposedHooks('Bob'));

    act(() => {
      for (let i = 0; i < 20; i++) {
        alice.current.userData.saveQuestionResult(makeResult('fractions', true));
      }
    });

    // Alice has mastery, Bob doesn't
    expect(alice.current.mastery.getTopicMastery('fractions').score).toBe(100);
    expect(bob.current.mastery.getTopicMastery('fractions').score).toBe(0);
  });

});

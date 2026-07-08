/**
 * Free-tier pupil-side gating (Phase 0 freemium, spec §4 / §11-E-14).
 *
 * Two client UI-locks driven by the SERVER entitlement (never a client
 * flag): deepProgress (ProgressScreen's Parent Dashboard tab) and
 * unlimitedPractice (MistakesScreen's "practise this mistake" re-quiz).
 * Both must fail OPEN — a missing/malformed entitlement or freeTierActive
 * off must render exactly as it did before this feature existed.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProgressScreen from '../../screens/ProgressScreen';
import MistakesScreen from '../../screens/MistakesScreen';
import useMastery from '../../hooks/useMastery';
import useStreaksAndPP from '../../hooks/useStreaksAndPP';

// ParentDashboard calls useClerk() for the sign-out-after-delete flow. This
// test never exercises deletion, so a bare mock is enough — no need for a
// real ClerkProvider tree.
jest.mock('@clerk/clerk-react', () => ({
  useClerk: () => ({ signOut: jest.fn() }),
}));

const FREE_ENTITLEMENT = {
  tier: 'free',
  dailySetCap: 1,
  trialDaysRemaining: 0,
  entitlements: {
    unlimitedPractice: false,
    focusedLearning: false,
    mockTests: false,
    deepProgress: false,
    aiTutor: false,
    challenge: false,
  },
};

const PAID_ENTITLEMENT = {
  tier: 'paid',
  dailySetCap: null,
  trialDaysRemaining: 0,
  entitlements: {
    unlimitedPractice: true,
    focusedLearning: true,
    mockTests: true,
    deepProgress: true,
    aiTutor: true,
    challenge: true,
  },
};

const emptyUserData = { questionResults: [], practiceLog: [], mockTestHistory: [] };

// Real useMastery/useStreaksAndPP hooks fed with empty history — using the
// actual hooks (already covered by mastery.test.js) instead of hand-rolled
// mocks avoids a second, hand-maintained copy of their return shape
// drifting out of step (Duplicated-Truth Rules, CLAUDE.md).
function ProgressHarness(props) {
  const mastery = useMastery([], [], []);
  const streaksAndPP = useStreaksAndPP(
    { currentStreak: 0, longestStreak: 0, lastQuizDate: null, streakHistory: [] },
    { total: 0, todayPP: 0, todayDate: null },
    jest.fn(),
    jest.fn()
  );
  return (
    <ProgressScreen
      quizHistory={[]}
      questionData={{}}
      mastery={mastery}
      streaksAndPP={streaksAndPP}
      userData={emptyUserData}
      currentUser="TestChild"
      onHome={jest.fn()}
      onStartTopic={jest.fn()}
      onDrillDown={jest.fn()}
      onViewQuiz={jest.fn()}
      onViewAllActivity={jest.fn()}
      onOpenParentMessages={jest.fn()}
      {...props}
    />
  );
}

function goToParentTab() {
  fireEvent.click(screen.getByRole('button', { name: /parent dashboard/i }));
}

// ProgressScreen persists the selected tab in sessionStorage so a return
// visit lands where you left off — reset it between tests so one test's
// tab choice can't leak into the next.
beforeEach(() => {
  sessionStorage.clear();
});

describe('ProgressScreen — deepProgress gate', () => {
  it('shows the basic set plus an upgrade nudge for the deep diagnosis when free-tier and locked', () => {
    const onUpgrade = jest.fn();
    render(<ProgressHarness entitlement={FREE_ENTITLEMENT} freeTierActive={true} onUpgrade={onUpgrade} />);
    goToParentTab();

    // Deep diagnosis (topic-level) stays locked with the upgrade CTA — the
    // parent surface keeps selling (freemium phase-0 Change 4a).
    expect(screen.getByText(/Topic-by-Topic Diagnosis/i)).toBeInTheDocument();
    expect(screen.getByText(/Upgrade to unlock/i)).toBeInTheDocument();

    // The basic set (basic-vs-deep progress line) stays visible even when
    // the deep diagnosis is locked: the three subject readiness bars plus
    // engagement/overall accuracy.
    expect(screen.getByRole('heading', { name: 'Exam Readiness' })).toBeInTheDocument();
    expect(screen.getByText(/Progress at a glance/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Upgrade to unlock/i));
    expect(onUpgrade).toHaveBeenCalledTimes(1);
  });

  it('renders the real deep analytics for an entitled (paid) user', () => {
    render(<ProgressHarness entitlement={PAID_ENTITLEMENT} freeTierActive={true} onUpgrade={jest.fn()} />);
    goToParentTab();

    expect(screen.getByRole('heading', { name: 'Exam Readiness' })).toBeInTheDocument();
    expect(screen.queryByText(/Topic-by-Topic Diagnosis/i)).not.toBeInTheDocument();
  });

  it('renders normally when the free-tier rollout flag is off, regardless of entitlement', () => {
    render(<ProgressHarness entitlement={FREE_ENTITLEMENT} freeTierActive={false} onUpgrade={jest.fn()} />);
    goToParentTab();

    expect(screen.getByRole('heading', { name: 'Exam Readiness' })).toBeInTheDocument();
    expect(screen.queryByText(/Topic-by-Topic Diagnosis/i)).not.toBeInTheDocument();
  });

  it('"My Journey" shows the basic set for a free child and locks the deep diagnosis with no upgrade sell (Change 3)', () => {
    render(<ProgressHarness entitlement={FREE_ENTITLEMENT} freeTierActive={true} onUpgrade={jest.fn()} />);
    // Default view is 'child' (My Journey) — never navigate to the parent tab.

    // Basic set (streak/PP header + this summary) stays visible.
    expect(screen.getByText(/Your progress/i)).toBeInTheDocument();

    // The per-topic star grid is locked, child surface — no upgrade CTA.
    expect(screen.getByText(/Topic Breakdown/i)).toBeInTheDocument();
    expect(screen.queryByText(/Upgrade to unlock/i)).not.toBeInTheDocument();

    // The recommendation card is replaced with the calm Daily Learning card.
    expect(screen.getByText('Daily Practice Set')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /parent dashboard/i })).toBeInTheDocument();
  });
});

function makeMistakeResult(id, topicKey = 'percentages', subject = 'maths') {
  return {
    id,
    date: new Date().toISOString(),
    questionId: id,
    topicKey,
    subject,
    difficulty: 2,
    correct: false,
  };
}

function makeQuestionData(topicKey, id) {
  return {
    maths: {
      topics: {
        [topicKey]: {
          questions: [
            {
              id,
              question: 'What is 10% of 50?',
              options: ['1', '5', '10', '50', '500'],
              correct: 1,
              explanation: '10% of 50 is 5. ✓',
              difficulty: 2,
            },
          ],
        },
      },
    },
  };
}

describe('MistakesScreen — unlimitedPractice gate', () => {
  const questionData = makeQuestionData('percentages', 1);
  const questionResults = [makeMistakeResult(1)];

  it('keeps the mistakes list visible and shows a calm "Part of PrepStep Plus" label with no sell when locked (child surface — N8)', () => {
    const onUpgrade = jest.fn();
    render(
      <MistakesScreen
        questionResults={questionResults}
        questionData={questionData}
        englishData={null}
        vrData={null}
        onRecordResult={jest.fn()}
        onBack={jest.fn()}
        entitlement={FREE_ENTITLEMENT}
        freeTierActive={true}
        onUpgrade={onUpgrade}
      />
    );

    // The mistakes list itself is still visible (child-first).
    expect(screen.getByText(/My Mistakes/i)).toBeInTheDocument();
    expect(screen.getByText(/1 mistake/i)).toBeInTheDocument();

    // Expand the topic group, then tap "practise this" for the single mistake.
    // Both the "Practice All" button above the list and the per-topic
    // "Practice These" button now share the same locked label, so grab all
    // matches and click the topic-level one (rendered second, inside the
    // expanded panel).
    fireEvent.click(screen.getByText(/Percentages/i));
    const lockedLabels = screen.getAllByText('Part of PrepStep Plus');
    expect(lockedLabels.length).toBe(2);
    fireEvent.click(lockedLabels[1]);

    // Child surfaces never sell — no upgrade flow is triggered by a locked tap.
    expect(onUpgrade).not.toHaveBeenCalled();
    // Practice mode never starts — its "Exit" header button (only rendered
    // once practiceMode is set) is absent. The question text itself isn't a
    // safe signal here: it also appears as the mistake row's own preview.
    expect(screen.queryByRole('button', { name: /exit/i })).not.toBeInTheDocument();
  });

  it('starts practice as normal for an entitled (paid) user', () => {
    const onUpgrade = jest.fn();
    render(
      <MistakesScreen
        questionResults={questionResults}
        questionData={questionData}
        englishData={null}
        vrData={null}
        onRecordResult={jest.fn()}
        onBack={jest.fn()}
        entitlement={PAID_ENTITLEMENT}
        freeTierActive={true}
        onUpgrade={onUpgrade}
      />
    );

    fireEvent.click(screen.getByText(/Percentages/i));
    fireEvent.click(screen.getByText(/Practice These/i));

    expect(onUpgrade).not.toHaveBeenCalled();
    expect(screen.getByText(/What is 10% of 50/i)).toBeInTheDocument();
  });
});

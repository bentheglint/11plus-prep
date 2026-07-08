/**
 * Trial-end plan-choice interstitial (Phase 0 freemium — the key conversion
 * moment). Two layers under test:
 *
 *  1. TrialEndedChoiceModal itself — a presentational component. Renders the
 *     child's name, both CTAs, and wires them to the callbacks it's given.
 *
 *  2. App.js's trigger/persistence logic — a free-tier user with no recorded
 *     choice sees the interstitial; "Continue on the free plan" persists a
 *     per-account localStorage key and hides it; a user who has already made
 *     a choice never sees it again; "Choose PrepStep Plus" hides the
 *     interstitial and routes to checkout WITHOUT persisting the choice key
 *     (so an abandoned checkout still shows it again next time).
 *
 * This supersedes the old FreePlanWelcomeModal, which silently welcomed a
 * lapsed-trial family to the free plan with no real choice made.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClerkProvider } from '@clerk/clerk-react';
import TrialEndedChoiceModal from '../../components/TrialEndedChoiceModal';
import App from '../../App';
import mathsData from '../../questionData/mathsData';
import englishData from '../../questionData/englishData';
import vrData from '../../questionData/vrData';

const TEST_KEY = 'pk_test_dGVzdC10ZXN0LnRlc3QuY2xlcmsuYWNjb3VudHMuZGV2JA';

const loadedData = { maths: mathsData, english: englishData, verbalreasoning: vrData };

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

describe('TrialEndedChoiceModal (presentational)', () => {
  it("shows the child's name in the title and both plan cards", () => {
    render(
      <TrialEndedChoiceModal childName="Evie" onChoosePlus={jest.fn()} onContinueFree={jest.fn()} />
    );

    expect(screen.getByText("Evie's free trial has finished")).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PrepStep Plus' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Free plan' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /choose prepstep plus/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue on the free plan/i })).toBeInTheDocument();
  });

  it('has no dismiss/close affordance — only the two plan buttons', () => {
    render(
      <TrialEndedChoiceModal childName="Evie" onChoosePlus={jest.fn()} onContinueFree={jest.fn()} />
    );
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/close/i)).not.toBeInTheDocument();
  });

  it('calls onChoosePlus when the Plus card button is clicked', () => {
    const onChoosePlus = jest.fn();
    render(
      <TrialEndedChoiceModal childName="Evie" onChoosePlus={onChoosePlus} onContinueFree={jest.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: /choose prepstep plus/i }));
    expect(onChoosePlus).toHaveBeenCalledTimes(1);
  });

  it('calls onContinueFree when the free-plan button is clicked', () => {
    const onContinueFree = jest.fn();
    render(
      <TrialEndedChoiceModal childName="Evie" onChoosePlus={jest.fn()} onContinueFree={onContinueFree} />
    );
    fireEvent.click(screen.getByRole('button', { name: /continue on the free plan/i }));
    expect(onContinueFree).toHaveBeenCalledTimes(1);
  });
});

function renderApp(props = {}) {
  return render(
    <ClerkProvider publishableKey={TEST_KEY}>
      <App currentUser="Evie" loadedData={loadedData} userEmail="parent@example.com" entitlement={FREE_ENTITLEMENT} {...props} />
    </ClerkProvider>
  );
}

describe('App.js — trial-end interstitial trigger + persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('ff:freeTier', 'true');
  });

  it('shows the interstitial for a free-tier account that has not made a choice yet', () => {
    renderApp();
    expect(screen.getByText("Evie's free trial has finished")).toBeInTheDocument();
  });

  it('does not show the interstitial once the choice key is already set for that account', () => {
    localStorage.setItem('prepstep:trial-choice-made:parent@example.com', '1');
    renderApp();
    expect(screen.queryByText("Evie's free trial has finished")).not.toBeInTheDocument();
  });

  it('does not show the interstitial when the free-tier rollout flag is off', () => {
    localStorage.setItem('ff:freeTier', 'false');
    renderApp();
    expect(screen.queryByText("Evie's free trial has finished")).not.toBeInTheDocument();
  });

  it('does not show the interstitial for a paid-tier account', () => {
    renderApp({ entitlement: { ...FREE_ENTITLEMENT, tier: 'paid' } });
    expect(screen.queryByText("Evie's free trial has finished")).not.toBeInTheDocument();
  });

  it('"Continue on the free plan" persists the per-account choice key and hides the interstitial', () => {
    renderApp();
    expect(screen.getByText("Evie's free trial has finished")).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /continue on the free plan/i }));

    expect(screen.queryByText("Evie's free trial has finished")).not.toBeInTheDocument();
    expect(localStorage.getItem('prepstep:trial-choice-made:parent@example.com')).toBe('1');
  });

  it('"Choose PrepStep Plus" hides the interstitial without persisting the choice key, and routes to checkout', async () => {
    renderApp();
    expect(screen.getByText("Evie's free trial has finished")).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /choose prepstep plus/i }));

    // Interstitial is gone immediately, and the choice key is deliberately NOT
    // persisted — an abandoned checkout must show the interstitial again next time.
    expect(screen.queryByText("Evie's free trial has finished")).not.toBeInTheDocument();
    expect(localStorage.getItem('prepstep:trial-choice-made:parent@example.com')).toBeNull();

    // Routed to the checkout view (SubscribeScreen), not left stacked over Home.
    // AnimatePresence's exit/enter transition is async, so wait for it to land.
    await waitFor(() => {
      expect(screen.getByText(/Everything included/i)).toBeInTheDocument();
    });
  });
});

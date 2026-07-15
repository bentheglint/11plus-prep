// Guard test for LandingPage's CTA wiring (plans/landing-react-port-plan.md
// must-fix 1/2/4). deploy.sh's smoke build never exercises the signed-out
// tree (AuthGate SMOKE_BYPASS), so without a test like this a dead "Start
// free" button, a missing Sign In affordance, or a missing tutor entry point
// would all deploy green.

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingPage from '../LandingPage';

describe('LandingPage CTAs', () => {
  test('every "Start free" primary CTA calls onSignUp', () => {
    const onSignUp = jest.fn();
    render(<LandingPage onSignIn={jest.fn()} onSignUp={onSignUp} onTutorSignup={jest.fn()} inviteCode={null} />);

    const startButtons = screen.getAllByRole('button', { name: /start free/i });
    // Nav, hero, pricing, final CTA — all four "Start free" buttons in the
    // mockup (there is no 5th; the free/paid pricing cards have no CTA of
    // their own in the source markup).
    expect(startButtons.length).toBe(4);

    startButtons.forEach((btn) => {
      userEvent.click(btn);
    });
    expect(onSignUp).toHaveBeenCalledTimes(4);
  });

  test('Sign In control calls onSignIn and survives in the nav-cta (not nav-links)', () => {
    const onSignIn = jest.fn();
    render(<LandingPage onSignIn={onSignIn} onSignUp={jest.fn()} onTutorSignup={jest.fn()} inviteCode={null} />);

    const signInBtn = screen.getByRole('button', { name: /sign in/i });
    userEvent.click(signInBtn);
    expect(onSignIn).toHaveBeenCalledTimes(1);

    // Must live inside .nav-cta, which stays display:flex below 900px —
    // .nav-links (where it must NOT be) is display:none below that
    // breakpoint (see landing.css).
    expect(signInBtn.closest('.nav-cta')).not.toBeNull();
    expect(signInBtn.closest('.nav-links')).toBeNull();
  });

  test('tutor entry point in the footer navigates to the /for-tutors marketing page', () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, assign: jest.fn() };

    render(<LandingPage onSignIn={jest.fn()} onSignUp={jest.fn()} onTutorSignup={jest.fn()} inviteCode={null} />);

    const tutorLink = screen.getByRole('button', { name: /for tutors/i });
    userEvent.click(tutorLink);
    expect(window.location.assign).toHaveBeenCalledWith('/for-tutors');
    expect(tutorLink.closest('footer')).not.toBeNull();

    window.location = originalLocation;
  });

  test('invite banner renders with a supplied inviteCode, and is absent without one', () => {
    const { rerender } = render(
      <LandingPage onSignIn={jest.fn()} onSignUp={jest.fn()} onTutorSignup={jest.fn()} inviteCode={null} />
    );
    expect(screen.queryByText(/invite accepted/i)).toBeNull();

    rerender(<LandingPage onSignIn={jest.fn()} onSignUp={jest.fn()} onTutorSignup={jest.fn()} inviteCode="COMP123" />);
    expect(screen.getByText(/invite accepted/i)).toBeInTheDocument();
    expect(screen.getByText('COMP123')).toBeInTheDocument();
  });

  test('footer legal links point at the real pages, and no Safeguarding link exists', () => {
    render(<LandingPage onSignIn={jest.fn()} onSignUp={jest.fn()} onTutorSignup={jest.fn()} inviteCode={null} />);

    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: /terms of service/i })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: /^help$/i })).toHaveAttribute('href', '/help');
    expect(screen.queryByText(/safeguarding/i)).toBeNull();
  });

  test('testimonials and trust-strip quote sections render nothing (no real quotes supplied yet)', () => {
    const { container } = render(<LandingPage onSignIn={jest.fn()} onSignUp={jest.fn()} onTutorSignup={jest.fn()} inviteCode={null} />);
    expect(container.querySelector('.quotes')).toBeNull();
    expect(container.querySelector('.trust-quote')).toBeNull();
  });
});

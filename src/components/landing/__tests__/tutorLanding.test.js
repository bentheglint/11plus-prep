// Guard test for TutorLandingPage's CTA wiring, mirroring
// __tests__/landingCtas.test.js for the main landing page. /for-tutors
// bypasses AuthGate entirely (see src/index.js), so nothing else in the
// signed-out test suite would ever exercise this page's sign-up handoff.

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TutorLandingPage from '../TutorLandingPage';

describe('TutorLandingPage', () => {
  let assignMock;
  let originalLocation;

  beforeEach(() => {
    localStorage.clear();
    originalLocation = window.location;
    assignMock = jest.fn();
    // jsdom's window.location.assign is unimplemented (logs a "not
    // implemented: navigation" error and does nothing useful), so swap in a
    // plain mock object for the duration of each test rather than let the
    // page actually try to navigate.
    delete window.location;
    window.location = { ...originalLocation, assign: assignMock };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  test('renders the hero headline', () => {
    render(<TutorLandingPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: /you teach the method\. we put it into practice between lessons\./i })
    ).toBeInTheDocument();
  });

  test('renders a "Get your free tutor link" button', () => {
    render(<TutorLandingPage />);
    const buttons = screen.getAllByRole('button', { name: /get your free tutor link/i });
    // Nav, hero, and final CTA — three primary CTAs in the mockup.
    expect(buttons.length).toBe(3);
  });

  test('clicking a primary CTA sets the tutor signup-intent flag and hands off to the sign-up flow', async () => {
    render(<TutorLandingPage />);
    const [firstCta] = screen.getAllByRole('button', { name: /get your free tutor link/i });

    await userEvent.click(firstCta);

    expect(localStorage.getItem('signup-intent')).toBe('tutor');
    expect(assignMock).toHaveBeenCalledWith('/');
  });

  test('every primary CTA triggers the same signup handoff', async () => {
    render(<TutorLandingPage />);
    const ctas = screen.getAllByRole('button', { name: /get your free tutor link/i });

    for (const cta of ctas) {
      localStorage.clear();
      // eslint-disable-next-line no-await-in-loop
      await userEvent.click(cta);
      expect(localStorage.getItem('signup-intent')).toBe('tutor');
    }
    expect(assignMock).toHaveBeenCalledTimes(ctas.length);
  });

  test('"For parents" nav link points at the real parent landing page', () => {
    render(<TutorLandingPage />);
    const forParentsLinks = screen.getAllByRole('link', { name: /for parents/i });
    forParentsLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/');
    });
  });

  test('the "See a sample dashboard" secondary button is an in-page anchor to the dashboard section', () => {
    render(<TutorLandingPage />);
    const sampleLink = screen.getByRole('link', { name: /see a sample dashboard/i });
    expect(sampleLink).toHaveAttribute('href', '#dashboard');
  });

  test('anchor targets used by nav/footer links exist as real section ids', () => {
    const { container } = render(<TutorLandingPage />);
    ['how', 'earn', 'dashboard', 'exam'].forEach((id) => {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    });
  });

  test('does not render the placeholder Colette testimonial (TESTIMONIAL is gated until a real quote exists)', () => {
    const { container } = render(<TutorLandingPage />);
    expect(container.querySelector('.colette-quote')).toBeNull();
    expect(screen.queryByText(/placeholder quote/i)).toBeNull();
    // The founder note still renders as the trust content.
    expect(screen.getByText(/we built this having sat where you sit/i)).toBeInTheDocument();
  });

  test('sets the document title', () => {
    render(<TutorLandingPage />);
    expect(document.title).toBe('PrepStep for Tutors | Free for you, and you earn');
  });
});

import React, { useEffect, useState } from 'react';
import './landing.css';
import TutorDemo from './TutorDemo';
import ParentCarousel from './ParentCarousel';
import useScrollReveal from './useScrollReveal';

// Ported from design-mockups/landing/landing-prepstep.html. This REPLACES
// AuthGate's old inline LandingPage (plans/landing-react-port-plan.md).
//
// Must-fix 6 (testimonial gate): both the .quotes grid AND the trust-strip
// quote are placeholders in the mockup ("[PLACEHOLDER - swap real quote]").
// Real quotes were not available at build time, so both arrays/values start
// empty/null here and the sections render nothing until real ones are
// supplied — never fake testimonials.
const QUOTES = [];
// Shape when populated: { text: '...', name: '...', role: '...', initial: 'A' }

const TRUST_QUOTE = null;
// Shape when populated: { text: '...', cite: '...' }

// Comp-code banner, shown when a visitor arrived via ?invite=CODE. Mirrors
// AuthGate's existing InviteBanner visuals; rewritten without the em dash
// the original copy used (CLAUDE.md: no em dashes in consumer-facing copy).
function CompInviteBanner({ code }) {
  if (!code) return null;
  return (
    <div className="bg-[#7C3AED] text-white text-sm text-center py-2 px-4">
      <span className="font-bold">Invite accepted.</span> You will get free access, no card needed. Code:{' '}
      <span className="font-mono opacity-80">{code}</span>
    </div>
  );
}

function BrandMark() {
  return (
    <svg className="mark" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <rect x="1" y="24" width="10" height="9" rx="2.5" fill="#3B82F6" />
      <rect x="12" y="15" width="10" height="18" rx="2.5" fill="#7C3AED" />
      <rect x="23" y="4" width="10" height="29" rx="2.5" fill="#22C55E" />
    </svg>
  );
}

function TickIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function LandingPage({ onSignIn, onSignUp, onTutorSignup, inviteCode }) {
  useScrollReveal();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="landing-root">
      <CompInviteBanner code={inviteCode} />

      {/* ===================== NAV ===================== */}
      <header className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="wrap nav-in">
          <a className="brand" href="#top" aria-label="PrepStep home">
            <BrandMark />
            <span>PrepStep</span>
          </a>
          <nav className="nav-links" aria-label="Primary">
            <a href="#how">How it works</a>
            <a href="#inside">What&apos;s inside</a>
            <a href="#parents">For parents</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="nav-cta">
            <button type="button" className="btn btn-ghost" onClick={onSignIn}>
              Sign In
            </button>
            <button type="button" className="btn btn-primary" onClick={onSignUp}>
              Start free
            </button>
          </div>
        </div>
      </header>

      <a id="top"></a>

      {/* ===================== HERO ===================== */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1 className="hero-h rise d1">
              11+ prep that <span className="grad">teaches</span> before it tests.
            </h1>
            <p className="hero-sub rise d3">
              Every session starts with a short lesson, so your child stops guessing and starts working things out, with a
              patient tutor on hand for anything tricky.
            </p>
            <div className="hero-actions rise d4">
              <button type="button" className="btn btn-primary" onClick={onSignUp}>
                Start free{' '}
                <span className="arrow" aria-hidden="true">
                  &rarr;
                </span>
              </button>
            </div>
            <div className="hero-microrow rise d4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Full access, free for 30 days. No card needed.
            </div>
          </div>

          <TutorDemo />
        </div>
      </section>

      {/* ===================== TRUST STRIP ===================== */}
      <section className="trust">
        <div className="wrap trust-grid">
          <div className="trust-lead">
            Children do their best work when they{' '}
            <span className="hl">understand the method first.</span> That is the whole idea behind PrepStep.
          </div>
          {TRUST_QUOTE && (
            <div className="trust-quote">
              <p>&quot;{TRUST_QUOTE.text}&quot;</p>
              <cite>{TRUST_QUOTE.cite}</cite>
            </div>
          )}
          <div className="trust-chips">
            <span className="tchip">
              <TickIcon /> No ads, ever
            </span>
            <span className="tchip">
              <TickIcon /> A tutor built for children
            </span>
          </div>
        </div>
      </section>

      {/* ===================== PROBLEM ===================== */}
      <section className="sec problem">
        <div className="wrap problem-body">
          <div>
            <span className="eyebrow">
              <span className="num">01</span> The idea
            </span>
            <h2>The 11+ rewards knowing the patterns.</h2>
            <p className="big">
              The 11+ asks the same handful of question types again and again. Most children are strong on some and quietly
              dropping marks on others, often before anyone has noticed which.{' '}
              <b>PrepStep finds the few weak spots early, and keeps practising them until they click</b>, one calm step at a
              time.
            </p>
          </div>
          <div className="marks-card" id="marks">
            <h4>Where the marks are going</h4>
            <div className="bar-row">
              <span className="topic">Fractions</span>
              <div className="bar-track">
                <div className="bar-fill" data-w="88"></div>
              </div>
              <span className="bar-val">88%</span>
            </div>
            <div className="bar-row">
              <span className="topic">Comprehension</span>
              <div className="bar-track">
                <div className="bar-fill" data-w="81"></div>
              </div>
              <span className="bar-val">81%</span>
            </div>
            <div className="bar-row">
              <span className="topic">Ratio</span>
              <div className="bar-track">
                <div className="bar-fill warm" data-w="54"></div>
              </div>
              <span className="bar-val">54%</span>
            </div>
            <div className="bar-row">
              <span className="topic">Letter codes</span>
              <div className="bar-track">
                <div className="bar-fill warm" data-w="47"></div>
              </div>
              <span className="bar-val">47%</span>
            </div>
            <div className="marks-note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                <circle cx="12" cy="12" r="4" />
              </svg>
              PrepStep spots the two topics costing marks, and brings those questions back until they are secure.
            </div>
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS (STAIRCASE) ===================== */}
      <section className="sec" id="how">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">
              <span className="num">02</span> How it works
            </span>
            <h2>Three steps, and each one lifts the next.</h2>
            <p>
              PrepStep climbs in the same order a good tutor would: teach the method, practise it, then explain anything that
              did not land. That climb is where the name comes from.
            </p>
          </div>

          <div className="steps-wrap">
            <div className="stairs">
              <div className="step">
                <div className="step-num">01</div>
                <span className="step-tag">Teach</span>
                <div className="step-ico" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 7l10-4 10 4-10 4z" />
                    <path d="M6 9v5c0 1.5 3 3 6 3s6-1.5 6-3V9" />
                  </svg>
                </div>
                <h3>A short lesson first</h3>
                <p>
                  Before every focused practice, your child learns the method in a couple of minutes. The lesson is built in
                  and compulsory, so there is no cold testing.
                </p>
                <div className="step-shot">
                  <div className="phone">
                    <img
                      src="/landing-shots/05-microlesson-hook.webp"
                      alt="PrepStep micro-lesson screen showing a common trap warning, a coloured fraction bar model, and a Talk to AI Tutor button"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
              <div className="step">
                <div className="step-num">02</div>
                <span className="step-tag">Practise</span>
                <div className="step-ico" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20V10M18 20V4M6 20v-4" />
                  </svg>
                </div>
                <h3>Then they practise it</h3>
                <p>
                  Questions in the same style, so the method sticks. PrepStep notices which topics are costing marks and
                  brings those questions back until they are secure.
                </p>
                <div className="step-shot">
                  <div className="phone">
                    <img src="/landing-shots/06-quiz.webp" alt="PrepStep quiz question on fractions with five multiple-choice options" loading="lazy" />
                  </div>
                </div>
              </div>
              <div className="step">
                <div className="step-num">03</div>
                <span className="step-tag">Understand</span>
                <div className="step-ico" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18h6M10 22h4" />
                    <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
                  </svg>
                </div>
                <h3>A tutor explains it</h3>
                <p>
                  When something is tricky, the built-in tutor nudges your child to work it out, then explains the answer in
                  plain words once they commit. It never just hands over the answer.
                </p>
                <div className="step-shot">
                  <div className="phone">
                    <img
                      src="/landing-shots/07-quiz-tutor.webp"
                      alt="PrepStep AI Tutor panel coaching the method without giving away the answer"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
            <p className="stairs-cap">
              Teach, then practise, then understand. That is <b>one step at a time</b>, all the way up.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== WHAT'S INSIDE ===================== */}
      <section className="sec inside" id="inside">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">
              <span className="num">03</span> What&apos;s inside
            </span>
            <h2>Everything a focused prep routine needs.</h2>
            <p>Built around one belief: children do better when they understand the method before they are marked on it.</p>
          </div>
          <div className="feat-grid">
            <div className="feat star">
              <div className="feat-ico">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 7l10-4 10 4-10 4z" />
                  <path d="M6 9v5c0 1.5 3 3 6 3s6-1.5 6-3V9" />
                </svg>
              </div>
              <h4>A lesson before every quiz</h4>
              <p>Focused practice always begins with a short, compulsory lesson that teaches the method. No cold starts.</p>
            </div>
            <div className="feat">
              <div className="feat-ico">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h4>A no-spoiler tutor</h4>
              <p>
                It will not give the answer while your child is still trying. It nudges them to work it out, then explains
                it plainly once they commit.
              </p>
            </div>
            <div className="feat">
              <div className="feat-ico">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </div>
              <h4>Finds the weak spots</h4>
              <p>PrepStep tracks marks topic by topic, spots where they are slipping, and brings those exact questions back until they stick.</p>
            </div>
            <div className="feat">
              <div className="feat-ico">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </div>
              <h4>Timed mock tests</h4>
              <p>Full papers under real time pressure, so exam day feels familiar rather than daunting.</p>
            </div>
            <div className="feat">
              <div className="feat-ico">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h4>Thousands of questions</h4>
              <p>A growing library across Maths, English and Verbal Reasoning, covering the question types the 11+ keeps coming back to.</p>
            </div>
            <div className="feat">
              <div className="feat-ico">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 18v3" />
                </svg>
              </div>
              <h4>Any device, any browser</h4>
              <p>Runs on a phone, tablet or laptop, with nothing to download. Sit together, or let them get on with it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== A LOOK INSIDE (SCREENSHOT GALLERY) ===================== */}
      <section className="sec gallery" id="look-inside">
        <div className="wrap">
          <div className="sec-head" style={{ margin: '0 auto', textAlign: 'center' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>
              A look inside
            </span>
            <h2>Your child always knows what to do next.</h2>
            <p style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              A clear next step, progress they can watch building, and every mistake turned into another go.
            </p>
          </div>
          <div className="gallery-grid">
            <div className="gallery-item">
              <div className="phone">
                <img
                  src="/landing-shots/01-home.webp"
                  alt="PrepStep child home screen showing subject mastery bars for Maths, English and Verbal Reasoning, a streak, and what to practise next"
                  loading="lazy"
                />
              </div>
              <p className="gallery-cap">Their daily home, and what to practise next</p>
            </div>
            <div className="gallery-item">
              <div className="phone">
                <img
                  src="/landing-shots/02-progress-journey.webp"
                  alt="PrepStep child progress screen showing level, prep points, per-topic star accuracy and recent activity"
                  loading="lazy"
                />
              </div>
              <p className="gallery-cap">Progress they can see building</p>
            </div>
            <div className="gallery-item">
              <div className="phone">
                <img src="/landing-shots/04-mistakes.webp" alt="PrepStep My Mistakes list showing real questions with practise buttons" loading="lazy" />
              </div>
              <p className="gallery-cap">Mistakes turned into practice</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOR PARENTS ===================== */}
      <section className="sec" id="parents">
        <div className="wrap">
          <div className="sec-head" style={{ margin: '0 auto', textAlign: 'center' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>
              <span className="num">04</span> For parents
            </span>
            <h2>See how it is going, without hovering.</h2>
            <p style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              The dashboard lays out every topic by strength, and names the exact few to focus on next. No guesswork about
              where the marks are going, and no looking over shoulders.
            </p>
          </div>
          <ParentCarousel />
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      {/* Must-fix 6: hides cleanly with no real quotes supplied — never fake. */}
      {QUOTES.length > 0 && (
        <section className="sec quotes">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">
                <span className="num">05</span> From parents
              </span>
              <h2>The relief of watching it click.</h2>
            </div>
            <div className="quote-grid">
              {QUOTES.map((q) => (
                <figure className="quote" key={q.name}>
                  <div className="stars" aria-label="Five stars">
                    &#9733;&#9733;&#9733;&#9733;&#9733;
                  </div>
                  <p>&quot;{q.text}&quot;</p>
                  <cite>
                    <span className="q-av">{q.initial}</span>
                    <span className="meta">
                      <b>{q.name}</b>
                      <span>{q.role}</span>
                    </span>
                  </cite>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== FOUNDER ===================== */}
      <section className="founder">
        <div className="wrap">
          <div className="founder-card">
            <span className="k">Why we built PrepStep</span>
            <h3>We kept seeing the same gap, so we closed it.</h3>
            <p>
              I have taken two children through the 11+, and spent a long time studying the papers along the way. The same
              thing kept surfacing: <b>the exams reward knowing the patterns</b>, every child has a few topics quietly
              costing them marks, and the quickest way forward is to catch those early and have someone patient explain the
              ones they get wrong. A good tutor does this beautifully, but they cost a fortune and they are gone by Tuesday.
              We built PrepStep to put that same teach-then-explain approach in every family&apos;s hands, for less than the
              cost of a single hour with a tutor.
            </p>
            <p className="signoff">
              Ben
              <span>Founder, PrepStep</span>
            </p>
          </div>
        </div>
      </section>

      {/* ===================== PRICING ===================== */}
      <section className="sec pricing" id="pricing">
        <div className="wrap">
          <div className="sec-head" style={{ margin: '0 auto', textAlign: 'center' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>
              <span className="num">06</span> Pricing
            </span>
            <h2>Full access, free for 30 days.</h2>
            <p style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              Every new account gets everything, free for a month. We never ask for a card, so nothing is charged when it
              ends. You simply keep going free, or upgrade if it is helping.
            </p>
          </div>

          <div className="timeline">
            <div className="tl-step">
              <div className="tl-ico" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </svg>
              </div>
              <b>Today</b>
              <span>Everything unlocked, free. No card needed to begin.</span>
            </div>
            <div className="tl-step">
              <div className="tl-ico" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <b>For 30 days</b>
              <span>Lessons, the tutor, mock tests and the full parent dashboard. All of it.</span>
            </div>
            <div className="tl-step">
              <div className="tl-ico" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s-8-4.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-8 11-8 11z" />
                </svg>
              </div>
              <b>After that</b>
              <span>Keep everything for £24.99 a month, or stay free with ten questions a day. You choose.</span>
            </div>
          </div>

          <div className="pricing-cta">
            <button type="button" className="btn btn-primary" onClick={onSignUp}>
              Start free, no card needed{' '}
              <span className="arrow" aria-hidden="true">
                &rarr;
              </span>
            </button>
            <div className="micro">Full access from day one. You are never charged automatically.</div>
          </div>

          <div className="price-grid">
            <div className="plan free">
              <h3>Free Forever</h3>
              <div className="price">
                £0 <small>a month</small>
              </div>
              <div className="price-note">No card, no time limit</div>
              <div className="keeps">What everyone keeps</div>
              <ul>
                <li>
                  <span className="tick">
                    <TickIcon />
                  </span>{' '}
                  A fresh 10-question quiz, every day
                </li>
                <li>
                  <span className="tick">
                    <TickIcon />
                  </span>{' '}
                  Streaks, progress and mistakes, all saved
                </li>
                <li>
                  <span className="tick">
                    <TickIcon />
                  </span>{' '}
                  Never locked out, and never charged
                </li>
              </ul>
            </div>

            <div className="plan feature">
              <span className="plan-flag">Recommended</span>
              <h3>Full Access</h3>
              <div className="price">
                £24.99 <small>a month</small>
              </div>
              <div className="price-note">
                Cancel any time. Pay for the year instead and it drops to £16.58 a month (£199), saving you over £100.
              </div>
              <div className="keeps">Everything from your free month, kept for good</div>
              <ul>
                <li>
                  <span className="tick">
                    <TickIcon />
                  </span>{' '}
                  Unlimited practice across all three subjects
                </li>
                <li>
                  <span className="tick">
                    <TickIcon />
                  </span>{' '}
                  A short lesson before every focused quiz
                </li>
                <li>
                  <span className="tick">
                    <TickIcon />
                  </span>{' '}
                  The no-spoiler AI tutor on every question
                </li>
                <li>
                  <span className="tick">
                    <TickIcon />
                  </span>{' '}
                  Timed mock tests, marked instantly
                </li>
                <li>
                  <span className="tick">
                    <TickIcon />
                  </span>{' '}
                  The full parent dashboard, topic by topic
                </li>
              </ul>
            </div>
          </div>

          <div className="anchor">
            For comparison: a private 11+ tutor is typically <b>£40 to £50 an hour</b>, and weekly sessions add up to well
            over <b>£1,500</b> across a year of prep. Full access to PrepStep is <b>£199 for the whole year</b>.
          </div>

          <div className="fsm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-8-4.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-8 11-8 11z" />
            </svg>
            <span>
              <b>Free for families on Free School Meals or Pupil Premium.</b> Just ask, and we will sort it.
            </span>
          </div>

          <div className="safety">
            <span className="s">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>{' '}
              UK GDPR compliant
            </span>
            <span className="s">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M5 5l14 14" />
              </svg>{' '}
              No ads, ever
            </span>
            <span className="s">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>{' '}
              A safe tutor built for children
            </span>
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="sec" id="faq">
        <div className="wrap">
          <div className="sec-head" style={{ margin: '0 auto', textAlign: 'center' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>
              <span className="num">07</span> Questions
            </span>
            <h2>The things parents ask first.</h2>
          </div>
          <div className="faq-list">
            <details className="faq" open>
              <summary>
                Do I need a card to start?{' '}
                <span className="plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="faq-a">
                No. Every new account gets full access free for 30 days with no card at all. Because we never take card
                details up front, nothing is charged when the trial ends. You simply move to the free plan, and can upgrade
                whenever it suits you.
              </div>
            </details>
            <details className="faq">
              <summary>
                What ages is it for?{' '}
                <span className="plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="faq-a">Children preparing for the 11+, typically in Year 4 and Year 5 (around ages 9 to 10).</div>
            </details>
            <details className="faq">
              <summary>
                Which schools is it for?{' '}
                <span className="plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="faq-a">
                Any child preparing for the 11+ for grammar or independent school entrance. The practice is built around the
                question types these exams keep coming back to, across Maths, English and Verbal Reasoning.
              </div>
            </details>
            <details className="faq">
              <summary>
                Does the tutor just give the answer?{' '}
                <span className="plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="faq-a">
                No, and that is the point. While your child is still working, it nudges them towards the method. It only
                explains the answer, in plain words, once they have committed to one.
              </div>
            </details>
            <details className="faq">
              <summary>
                Is it safe for my child?{' '}
                <span className="plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="faq-a">
                Yes. PrepStep is UK GDPR compliant, carries no ads, and the tutor is built for children: it stays on the
                lesson and will not wander off topic or hand over answers.
              </div>
            </details>
            <details className="faq">
              <summary>
                Can I cancel any time?{' '}
                <span className="plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="faq-a">Yes. There is no lock-in. You can cancel whenever you like, and there is no card needed to begin.</div>
            </details>
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="final" id="start">
        <div className="wrap final-in">
          <div className="final-stairs" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
          </div>
          <h2>Start where your child actually needs it.</h2>
          <p>Teach first, practise the method, then explain anything that did not land. That is the climb, one step at a time.</p>
          <button type="button" className="btn btn-primary" onClick={onSignUp}>
            Start free, no card needed{' '}
            <span className="arrow" aria-hidden="true">
              &rarr;
            </span>
          </button>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="site">
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <div className="brand">
                <BrandMark />
                <span>PrepStep</span>
              </div>
              <p>11+ prep that teaches before it tests. Lessons, practice and a patient tutor, in one place.</p>
            </div>
            <div className="foot-col">
              <h5>Product</h5>
              <a href="#how">How it works</a>
              <a href="#inside">What&apos;s inside</a>
              <a href="#parents">For parents</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="foot-col">
              <h5>Company</h5>
              <a href="mailto:hello@prepstep.co.uk">hello@prepstep.co.uk</a>
              <a href="#faq">FAQ</a>
              <a href="https://prepstep.co.uk">prepstep.co.uk</a>
              {/* Tutor entry point (must-fix 1) — not in the mockup. Rendered
                  as a real <button> (not an <a>) since it opens the in-app
                  sign-up flow rather than navigating; styled to match the
                  other footer links via .foot-link-btn in landing.css. */}
              <button type="button" className="foot-link-btn" onClick={onTutorSignup}>
                For tutors
              </button>
            </div>
            <div className="foot-col">
              <h5>Trust</h5>
              <a href="/privacy">Privacy policy</a>
              <a href="/terms">Terms of service</a>
              <a href="/help">Help</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>&copy; 2026 PrepStep. Made in the UK.</span>
            <div className="foot-safe">
              <span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>{' '}
                UK GDPR
              </span>
              <span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M5 5l14 14" />
                </svg>{' '}
                No ads
              </span>
              <span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>{' '}
                Safe for children
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

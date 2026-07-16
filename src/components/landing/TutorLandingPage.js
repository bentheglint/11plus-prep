import React, { useEffect, useRef, useState } from 'react';
import './tutor-landing.css';

// Ported from design-mockups/landing/tutor-landing.html. A standalone
// marketing page at /for-tutors (see src/index.js), separate from the
// signed-out parent LandingPage. Copy is kept verbatim from the approved
// mockup; only the CTA wiring, image paths and fonts were adapted to the
// live app (see the notes inline below).
//
// Testimonial gate: the mockup carries a PLACEHOLDER quote from Colette
// ("[Placeholder quote from Colette, pending...]") which is not real copy
// and must never ship. TESTIMONIAL stays null until a genuine quote is
// supplied; the trust band falls back to the founder note alone. Mirrors
// the TRUST_QUOTE / QUOTES gating pattern in LandingPage.js.
const TESTIMONIAL = null;
// Shape when populated: { quote: '...', name: '...', role: '...', initial: 'C' }

const HERO_SLIDES = [
  {
    key: '02-progress-journey',
    src: '/landing-shots/02-progress-journey.webp',
    alt: "A pupil's progress, points and per-topic accuracy",
    caption: 'Progress and accuracy, topic by topic',
  },
  {
    key: '03-parent-topics',
    src: '/landing-shots/03-parent-topics.webp',
    alt: 'Every topic colour-coded by mastery',
    caption: 'Every topic, mastered to needs-work',
  },
  {
    key: 'p-speed-accuracy',
    src: '/landing-shots/p-speed-accuracy.webp',
    alt: 'Accuracy versus speed for each topic against exam targets',
    caption: 'Accuracy and pace against exam targets',
  },
  {
    key: 'p-consistency',
    src: '/landing-shots/p-consistency.webp',
    alt: 'Practice consistency week by week',
    caption: 'The practice habit, building week by week',
  },
];

const AUTOPLAY_MS = 4500;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

// The CTA handoff: every "Get your free tutor link" button sets a
// signup-intent flag in localStorage, then sends the visitor to the main
// app at "/". AuthGate reads that flag on mount (and in an effect) and
// routes a signed-out visitor straight into tutor sign-up. See
// src/components/AuthGate.js (~line 367 init, ~line 559 effect).
function goToTutorSignup() {
  try {
    localStorage.setItem('signup-intent', 'tutor');
  } catch {
    // localStorage can be unavailable (private browsing, storage disabled);
    // navigation still proceeds, AuthGate just won't see the tutor flag.
  }
  window.location.assign('/');
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

// Hero carousel: per-pupil dashboard views, transform-based (translateX),
// autoplay every 4.5s, paused on hover, and disabled entirely under
// prefers-reduced-motion. The interval is created and cleared inside the
// same effect, so a React StrictMode double-invoke can never leave two
// timers running (the first invocation's cleanup fires before the app
// ever sees a doubled advance).
function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, []);

  const goTo = (i) => setIndex(((i % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div
      className="carousel"
      id="pupilCarousel"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div className="carousel-viewport">
        <div className="carousel-track" id="cTrack" style={{ transform: `translateX(-${index * 100}%)` }}>
          {HERO_SLIDES.map((slide) => (
            <figure className="cslide" key={slide.key}>
              <div className="panel-shot">
                <img src={slide.src} alt={slide.alt} loading="lazy" />
              </div>
              <figcaption>{slide.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <button className="carousel-arrow prev" id="cPrev" type="button" aria-label="Previous view" onClick={() => goTo(index - 1)}>
        &#8249;
      </button>
      <button className="carousel-arrow next" id="cNext" type="button" aria-label="Next view" onClick={() => goTo(index + 1)}>
        &#8250;
      </button>
      <div className="carousel-dots" id="cDots">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.key}
            type="button"
            className={`cdot${i === index ? ' active' : ''}`}
            aria-label={`Go to view ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default function TutorLandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.title = 'PrepStep for Tutors | Free for you, and you earn';
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="tutor-landing-root">
      {/* ===================== NAV ===================== */}
      <header className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="wrap nav-in">
          <a className="brand" href="#top" aria-label="PrepStep home">
            <BrandMark />
            <span>PrepStep</span>
            <span className="tutor-tag">for tutors</span>
          </a>
          <nav className="nav-links" aria-label="Primary">
            <a href="#how">How it works</a>
            <a href="#earn">What you earn</a>
            <a href="#dashboard">Your dashboard</a>
            <a href="#exam">The exam</a>
          </nav>
          <div className="nav-cta">
            <a className="btn btn-ghost" href="/">
              For parents
            </a>
            <button type="button" className="btn btn-primary" onClick={goToTutorSignup}>
              Get your free tutor link
            </button>
          </div>
        </div>
      </header>

      <a id="top"></a>

      {/* ===================== HERO ===================== */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <div className="hero-badge">
              <span className="dot"></span> Built for 11+ tutors
            </div>
            <h1 className="hero-h">
              You teach the method. <span className="grad">We put it into practice</span> between lessons.
            </h1>
            <p className="hero-sub">
              In the days between your sessions, PrepStep gives each pupil targeted practice, runs the homework you set, and
              flags exactly where their marks are slipping, so you walk into every lesson already knowing where to begin. It
              is free for you to offer, free for families to start, and you earn a commission when a family moves up to the
              full plan.
            </p>
            <div className="hero-actions">
              <button type="button" className="btn btn-primary" onClick={goToTutorSignup}>
                Get your free tutor link{' '}
                <span className="arrow" aria-hidden="true">
                  &rarr;
                </span>
              </button>
              <a className="btn btn-ghost" href="#dashboard">
                See a sample dashboard
              </a>
            </div>
            <div className="hero-microrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Free forever for tutors. Takes 30 seconds. No card.
            </div>
          </div>

          <div className="hero-shot">
            <span className="shot-tab">
              <span className="pulse"></span> What you&apos;ll see, per pupil
            </span>
            <HeroCarousel />
          </div>
        </div>
      </section>

      {/* ===================== EARNINGS BAND ===================== */}
      <section className="earn-band" id="earn">
        <div className="wrap earn-grid">
          <div>
            <div className="earn-lead">
              A free forever plan and a paid one. <span>You earn from the paid one.</span>
            </div>
            <p className="earn-body">
              Every pupil can use PrepStep&apos;s free plan for as long as they like, at no cost, so you can share it with
              all your families from day one. Families who want the full thing, every subject, unlimited practice, mock
              papers and the AI tutor, upgrade to the paid plan at £24.99 a month or £199 a year.{' '}
              <b>For every family you bring who goes onto the paid plan, you earn 25% of their subscription, every month, for as long as they stay.</b>{' '}
              No cap, no time limit, written into our terms.
            </p>
          </div>
          <div className="stat-trio">
            <div className="stat-card">
              <b>Free plan</b>
              <span>daily practice every pupil can use forever, at no cost to anyone</span>
            </div>
            <div className="stat-card">
              <b>Paid plan</b>
              <span>the full programme, £24.99 a month or £199 a year, if a family wants it</span>
            </div>
            <div className="stat-card">
              <b>25% to you</b>
              <span>your share of every paid plan you bring, each month it stays active</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== BETWEEN YOUR SESSIONS ===================== */}
      <section className="sec reframe" id="how-it-helps">
        <div className="wrap reframe-body">
          <div>
            <span className="eyebrow">
              <span className="num">01</span> Between your sessions
            </span>
            <h2>It does its best work between your sessions.</h2>
            <p className="big">
              You bring the thing no app can: knowing exactly how to explain a stuck ratio question, or spotting which
              comprehension type a child keeps tripping on. PrepStep brings the hours you do not have. Between lessons it
              keeps each pupil practising, runs the targeted homework you set, and quietly notices the moment someone starts
              slipping on letter codes. <b>Every child arrives at your next session already diagnosed</b>, so the hour goes
              on teaching, not on working out what went wrong.
            </p>
          </div>
          <div className="desk-card">
            <h4>What lands on your desk before the session</h4>
            <div className="desk-row">
              <span className="topic">Fractions</span>
              <div className="desk-track">
                <div className="desk-fill" style={{ width: '88%' }}></div>
              </div>
              <span className="desk-val">88%</span>
            </div>
            <div className="desk-row">
              <span className="topic">Comprehension</span>
              <div className="desk-track">
                <div className="desk-fill" style={{ width: '81%' }}></div>
              </div>
              <span className="desk-val">81%</span>
            </div>
            <div className="desk-row">
              <span className="topic">Ratio</span>
              <div className="desk-track">
                <div className="desk-fill warm" style={{ width: '54%' }}></div>
              </div>
              <span className="desk-val">54%</span>
            </div>
            <div className="desk-row">
              <span className="topic">Letter codes</span>
              <div className="desk-track">
                <div className="desk-fill warm" style={{ width: '47%' }}></div>
              </div>
              <span className="desk-val">47%</span>
            </div>
            <div className="desk-note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                <circle cx="12" cy="12" r="4" />
              </svg>
              PrepStep tracks marks topic by topic and keeps bringing the weak ones back until they&apos;re secure.
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SEE EVERY PUPIL AT A GLANCE (ROSTER DASHBOARD) ===================== */}
      <section className="sec dash" id="dashboard">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">
              <span className="num">02</span> Your dashboard
            </span>
            <h2>See every pupil at a glance.</h2>
            <p>
              One screen, every pupil you teach. Who practised this week, who&apos;s slipping, and the one topic worth a
              mention at their next session. The same depth the parent sees on their side, built for someone teaching a full
              list of pupils, not one.
            </p>
          </div>

          <div className="dash-hero">
            <img
              src="/landing-shots/tutor-dashboard.webp"
              alt="The PrepStep tutor dashboard: your pupil list on the left, and one pupil's exam readiness and topic-by-topic mastery on the right"
              loading="lazy"
            />
          </div>

          <div className="dash-two">
            <figure>
              <div className="dash-frame">
                <img
                  src="/landing-shots/tutor-class.webp"
                  alt="Your whole class on one screen, each pupil's status, last activity and weak topic"
                  loading="lazy"
                />
              </div>
              <figcaption>
                <b>See the whole class</b>Every pupil you teach on one screen: who practised, who&apos;s slipping, and the
                one topic worth a mention next session.
              </figcaption>
            </figure>
            <figure>
              <div className="dash-frame">
                <img
                  src="/landing-shots/tutor-assignment.webp"
                  alt="Setting a targeted homework assignment for a class or an individual pupil"
                  loading="lazy"
                />
              </div>
              <figcaption>
                <b>Set targeted homework</b>Pick the topics a pupil or class needs, set a due date, done. They practise it,
                and you see how it went.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ===================== THE EXAM (GL SPECS) ===================== */}
      <section className="sec" id="exam">
        <div className="wrap examsec-body">
          <div>
            <div className="sec-head">
              <span className="eyebrow">
                <span className="num">03</span> The exam
              </span>
              <h2>Built for the 11+ your pupils actually sit.</h2>
              <p>
                PrepStep covers the real question types the 11+ throws at a child, not a generic reasoning quiz repackaged
                for grammar school entry. Maths, English and Verbal Reasoning, each broken down the way the exam actually
                tests them.
              </p>
            </div>

            <div className="gl-group">
              <h4>Maths</h4>
              <div className="gl-chips">
                <span className="gl-chip">Place value</span>
                <span className="gl-chip">Negative numbers</span>
                <span className="gl-chip">Fractions</span>
                <span className="gl-chip">Decimals</span>
                <span className="gl-chip">Percentages</span>
                <span className="gl-chip">Ratio &amp; proportion</span>
                <span className="gl-chip">Long multiplication</span>
                <span className="gl-chip">Long division</span>
                <span className="gl-chip">Prime numbers &amp; factors</span>
                <span className="gl-chip">Algebra</span>
                <span className="gl-chip">Sequences</span>
                <span className="gl-chip">Area &amp; perimeter</span>
                <span className="gl-chip">Volume</span>
                <span className="gl-chip">Angles &amp; shapes</span>
                <span className="gl-chip">Data handling</span>
                <span className="gl-chip">Speed, distance &amp; time</span>
              </div>
            </div>
            <div className="gl-group">
              <h4>English</h4>
              <div className="gl-chips">
                <span className="gl-chip">Comprehension</span>
                <span className="gl-chip">Spelling</span>
                <span className="gl-chip">Punctuation</span>
                <span className="gl-chip">Grammar</span>
                <span className="gl-chip">Vocabulary</span>
                <span className="gl-chip">Word classes</span>
              </div>
            </div>
            <div className="gl-group">
              <h4>Verbal Reasoning</h4>
              <div className="gl-chips">
                <span className="gl-chip">Synonyms</span>
                <span className="gl-chip">Antonyms</span>
                <span className="gl-chip">Verbal analogies</span>
                <span className="gl-chip">Odd one out</span>
                <span className="gl-chip">Compound words</span>
                <span className="gl-chip">Hidden words</span>
                <span className="gl-chip">Move a letter</span>
                <span className="gl-chip">Missing letters</span>
                <span className="gl-chip">Letter codes</span>
                <span className="gl-chip">Letter pair series</span>
                <span className="gl-chip">Number series</span>
                <span className="gl-chip">Letter sums</span>
                <span className="gl-chip">Word-code analogies</span>
                <span className="gl-chip">Number-word codes</span>
                <span className="gl-chip">Logic &amp; language</span>
                <span className="gl-chip">Shared letter</span>
                <span className="gl-chip">Balance equations</span>
              </div>
            </div>
            <p style={{ marginTop: '22px', color: 'var(--slate)', fontSize: '1.02rem' }}>
              Timed mock papers mirror the real format and time pressure, so exam day is the least surprising day of the
              year.
            </p>
          </div>

          <div className="examsec-shot">
            <div className="panel-shot tight-topics">
              <img
                src="/landing-shots/03-parent-topics.webp"
                alt="PrepStep Topic Mastery panel showing every maths topic colour-coded by mastery level with stars and accuracy"
                loading="lazy"
              />
            </div>
            <figcaption>Every topic tracked individually, not lumped into one &quot;verbal reasoning&quot; score.</figcaption>
          </div>
        </div>
      </section>

      {/* ===================== TEACHES BEFORE IT TESTS + AI TUTOR ===================== */}
      <section className="sec peda">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">
              <span className="num">04</span> How it teaches
            </span>
            <h2>It teaches before it tests, on purpose.</h2>
            <p>Built around the same belief you already teach by: a child does better once they understand the method, not before.</p>
          </div>
          <div className="peda-grid">
            <div className="peda-card">
              <div className="peda-ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 7l10-4 10 4-10 4z" />
                  <path d="M6 9v5c0 1.5 3 3 6 3s6-1.5 6-3V9" />
                </svg>
              </div>
              <h3>Method first, every time</h3>
              <p>
                Before any focused practice, the pupil gets a short lesson, a couple of minutes, not a video to sit through.
                Then they practise it. Nobody gets tested cold on something nobody&apos;s shown them.
              </p>
              <div className="phone">
                <img
                  src="/landing-shots/05-microlesson-hook.webp"
                  alt="PrepStep micro-lesson screen showing a common trap warning, a coloured fraction bar model, and a Talk to AI Tutor button"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="peda-card">
              <div className="peda-ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3>A tutor that sits on its hands</h3>
              <p>
                When a pupil gets stuck, the built-in tutor nudges them towards the method rather than handing over the
                answer. It only explains why an answer is right once they&apos;ve committed to one. The thinking stays
                theirs, the way a good tutor holds back and lets a child get there. That&apos;s deliberate, not an oversight.
              </p>
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
      </section>

      {/* ===================== HOW IT WORKS (THREE STEPS) ===================== */}
      <section className="sec" id="how">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">
              <span className="num">05</span> Getting started
            </span>
            <h2>Three steps, and you&apos;re earning by the third.</h2>
            <p>No pupil list to upload, nothing to chase. Just a link.</p>
          </div>

          <div className="steps-wrap">
            <div className="stairs">
              <div className="step">
                <div className="step-num">01</div>
                <span className="step-tag">Create</span>
                <div className="step-ico" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                  </svg>
                </div>
                <h3>Create your free account</h3>
                <p>Thirty seconds, no card. Free for as long as you&apos;re tutoring, with nothing to renew or cancel.</p>
              </div>
              <div className="step">
                <div className="step-num">02</div>
                <span className="step-tag">Share</span>
                <div className="step-ico" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <path d="M8.6 10.6l6.8-3.8M8.6 13.4l6.8 3.8" />
                  </svg>
                </div>
                <h3>Share your link</h3>
                <p>One personal invite link. Drop it in your welcome email, your invoice footer, wherever your families already look.</p>
              </div>
              <div className="step">
                <div className="step-num">03</div>
                <span className="step-tag">Earn</span>
                <div className="step-ico" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21s-8-4.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-8 11-8 11z" />
                  </svg>
                </div>
                <h3>Watch your pupil list grow</h3>
                <p>The moment a parent joins with your link, that child appears on your dashboard and the commission clock starts.</p>
              </div>
            </div>
            <p className="stairs-cap">
              No uploads. No admin. Just <b>one link</b>.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== TRUST BAND ===================== */}
      <section className="sec trustband">
        <div className="wrap">
          <div className={`trust-inner${TESTIMONIAL ? '' : ' trust-inner-solo'}`}>
            {TESTIMONIAL && (
              <figure className="colette-quote">
                <div className="stars" aria-label="Five stars">
                  &#9733;&#9733;&#9733;&#9733;&#9733;
                </div>
                <p>&quot;{TESTIMONIAL.quote}&quot;</p>
                <cite>
                  <span className="c-av">{TESTIMONIAL.initial}</span>
                  <span className="meta">
                    <b>{TESTIMONIAL.name}</b>
                    <span>{TESTIMONIAL.role}</span>
                  </span>
                </cite>
              </figure>
            )}

            <div className="founder-note">
              <span className="k">Why tutors trust PrepStep</span>
              <h3>We built this having sat where you sit.</h3>
              <p>
                One of my children is through the 11+ and the second sits it this September, so I&apos;ve studied the papers
                closely enough to know exactly which patterns keep costing marks. A good tutor is the best thing going for a
                child sitting this exam.{' '}
                <b>PrepStep is simply the bit that keeps working between your sessions</b>, built by people who rate what you
                do and wanted to back it up.
              </p>
              <p className="signoff">
                Ben
                <span>Founder, PrepStep</span>
              </p>
            </div>
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
              Child-safe by design
            </span>
            <span className="s">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>{' '}
              Written commission terms
            </span>
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="final" id="start">
        <div className="wrap final-in">
          <h2>Your teaching, still working long after the lesson ends.</h2>
          <p>Free to offer, free for families to start, and a real commission when they stay. Set it up once, in thirty seconds.</p>
          <button type="button" className="btn btn-primary" onClick={goToTutorSignup}>
            Get your free tutor link{' '}
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
              <p>The between-lesson partner for the 11+, working right alongside your teaching.</p>
            </div>
            <div className="foot-col">
              <h5>For tutors</h5>
              <a href="#how">How it works</a>
              <a href="#earn">What you earn</a>
              <a href="#dashboard">Your dashboard</a>
              <a href="#exam">The exam</a>
            </div>
            <div className="foot-col">
              <h5>Company</h5>
              <a href="/">For parents</a>
              <a href="/#pricing">Pricing</a>
              <a href="mailto:hello@prepstep.co.uk">hello@prepstep.co.uk</a>
            </div>
            <div className="foot-col">
              <h5>Trust</h5>
              <a href="/tutor-terms">Tutor terms</a>
              <a href="/privacy">Privacy policy</a>
              <a href="/terms">Terms of service</a>
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

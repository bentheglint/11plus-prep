import React, { useCallback, useEffect, useRef, useState } from 'react';

// The 6 parent-dashboard panels, in mockup order (design-mockups/landing/
// landing-prepstep.html ~lines 693-724). Alt text and captions ported
// verbatim. Image paths point at the pre-converted WebP shots in
// public/landing-shots/ (the mockup pointed at shots/*.png).
const SLIDES = [
  {
    key: 'p-headline',
    src: '/landing-shots/p-headline.webp',
    alt: 'PrepStep parent dashboard headline card reading Maya is making progress, here is how to improve, with a suggested focus and streak and question-count stats',
    caption: 'A plain-English read on how they are doing, and what to do next',
    shotClass: 'panel-shot',
  },
  {
    key: 'p-readiness',
    src: '/landing-shots/p-readiness.webp',
    alt: 'PrepStep parent dashboard Exam Readiness panel showing a readiness band for Maths, English and Verbal Reasoning with topic coverage',
    caption: 'How ready they are in each subject, at a glance',
    shotClass: 'panel-shot',
  },
  {
    key: '03b-parent-focus',
    src: '/landing-shots/03b-parent-focus.webp',
    alt: 'PrepStep parent dashboard Focus Areas panel naming the three topics that need the most attention: Word Class, Letter Codes and Long Multiplication, each with a star rating and accuracy',
    caption: 'The exact topics to focus on next, named for you',
    shotClass: 'panel-shot tight',
  },
  {
    key: '03-parent-topics',
    src: '/landing-shots/03-parent-topics.webp',
    alt: 'PrepStep parent dashboard Topic Mastery panel showing every maths topic colour-coded by mastery level with stars and accuracy',
    caption: 'Every topic, colour-coded from mastered to needs work',
    shotClass: 'panel-shot tight-topics',
  },
  {
    key: 'p-consistency',
    src: '/landing-shots/p-consistency.webp',
    alt: 'PrepStep parent dashboard Practice Consistency heatmap showing practice days week by week with weekly and monthly totals',
    caption: 'The practice habit, building week by week',
    shotClass: 'panel-shot',
  },
  {
    key: 'p-speed-accuracy',
    src: '/landing-shots/p-speed-accuracy.webp',
    alt: 'PrepStep parent dashboard Accuracy versus Speed chart plotting each maths topic by accuracy and pace against exam targets',
    caption: 'Accuracy and pace, topic by topic, against exam targets',
    shotClass: 'panel-shot',
  },
];

const AUTOPLAY_MS = 5000;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export default function ParentCarousel() {
  const carRef = useRef(null);
  const slideRefs = useRef([]);
  const pausedRef = useRef(false);
  const [active, setActive] = useState(0);

  const currentIndex = useCallback(() => {
    const car = carRef.current;
    if (!car) return 0;
    const center = car.scrollLeft + car.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      const center2 = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(center2 - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  }, []);

  const goTo = useCallback((i) => {
    const car = carRef.current;
    const el = slideRefs.current[i];
    if (!car || !el) return;
    car.scrollTo({
      left: el.offsetLeft - (car.clientWidth - el.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, []);

  const pause = useCallback(() => {
    pausedRef.current = true;
  }, []);

  // Sync the active dot with whatever the carousel is actually scrolled to
  // (covers manual swipe/drag as well as goTo()).
  useEffect(() => {
    const car = carRef.current;
    if (!car) return undefined;
    const onScroll = () => setActive(currentIndex());
    car.addEventListener('scroll', onScroll, { passive: true });
    return () => car.removeEventListener('scroll', onScroll);
  }, [currentIndex]);

  // 5s autoplay, pausing on any interaction. Must-fix 9: no autoplay at all
  // under prefers-reduced-motion. Cleanup (clearInterval) runs before a
  // StrictMode-doubled interval could ever fire, so no double-speed advance.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      const i = currentIndex();
      goTo(i >= SLIDES.length - 1 ? 0 : i + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [currentIndex, goTo]);

  const handlePrev = () => {
    pause();
    goTo(Math.max(0, currentIndex() - 1));
  };
  const handleNext = () => {
    pause();
    goTo(Math.min(SLIDES.length - 1, currentIndex() + 1));
  };
  const handleDot = (i) => {
    pause();
    goTo(i);
  };

  return (
    <div className="p-carousel-wrap">
      <button type="button" className="p-arrow prev" aria-label="Previous panel" onClick={handlePrev}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div className="p-carousel" ref={carRef} onMouseEnter={pause} onTouchStart={pause}>
        {SLIDES.map((slide, i) => (
          <figure
            className="p-slide"
            key={slide.key}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
          >
            <div className={slide.shotClass}>
              <img src={slide.src} alt={slide.alt} loading="lazy" />
            </div>
            <figcaption>{slide.caption}</figcaption>
          </figure>
        ))}
      </div>
      <button type="button" className="p-arrow next" aria-label="Next panel" onClick={handleNext}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
      <div className="p-dots">
        {SLIDES.map((slide, i) => (
          <button
            type="button"
            key={slide.key}
            className={`p-dot${i === active ? ' active' : ''}`}
            aria-label={`Show panel ${i + 1}`}
            onClick={() => handleDot(i)}
          />
        ))}
      </div>
    </div>
  );
}

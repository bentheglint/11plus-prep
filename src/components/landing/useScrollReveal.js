import { useEffect } from 'react';

// Matches the mockup's own reduced-motion check (media query, not a JS lib import)
// so behaviour stays identical across the CSS and the JS-driven pieces.
function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

// Ports two small pieces of vanilla JS from the mockup's <script> block:
//
// 1. The "Where the marks are going" bar-fill animation (mockup lines
//    ~1164-1178): an IntersectionObserver fills the .bar-fill widths from
//    their data-w attribute the first time #marks scrolls into view, then
//    disconnects. (The .rise fade-up elements need NO JS at all — in the
//    mockup they animate purely via the .rise CSS keyframe on mount,
//    regardless of scroll position, so that behaviour is left to landing.css.)
//
// 2. Smooth anchor-scrolling for in-page nav/footer links (#how, #inside,
//    #parents, #pricing, #faq, #top). The mockup got this "for free" from
//    `html{scroll-behavior:smooth}`, which must-fix 3 deletes (it's
//    document-global and would animate every in-app scrollTo(0,0) view
//    change too — see App.js / ParentDashboard.js). This reimplements it
//    as a scoped click handler using scrollIntoView, skipped entirely under
//    prefers-reduced-motion.
export default function useScrollReveal() {
  useEffect(() => {
    const root = document.querySelector('.landing-root');
    if (!root) return undefined;

    // ---- 1. Marks-card bar fill ----
    const marks = root.querySelector('#marks');
    let marksObserver = null;
    const fillBars = (container) => {
      container.querySelectorAll('.bar-fill').forEach((el) => {
        el.style.width = `${el.getAttribute('data-w')}%`;
      });
    };
    if (marks) {
      if ('IntersectionObserver' in window) {
        marksObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                fillBars(marks);
                marksObserver.disconnect();
              }
            });
          },
          { threshold: 0.4 }
        );
        marksObserver.observe(marks);
      } else {
        fillBars(marks);
      }
    }

    // ---- 2. Smooth anchor scroll ----
    const reduced = prefersReducedMotion();
    const anchors = Array.from(root.querySelectorAll('a[href^="#"]'));
    const cleanupFns = [];
    anchors.forEach((a) => {
      const handler = (e) => {
        const href = a.getAttribute('href');
        if (!href || href.length <= 1) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      };
      a.addEventListener('click', handler);
      cleanupFns.push(() => a.removeEventListener('click', handler));
    });

    return () => {
      if (marksObserver) marksObserver.disconnect();
      cleanupFns.forEach((fn) => fn());
    };
  }, []);
}

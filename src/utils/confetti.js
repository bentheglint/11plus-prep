// ── Confetti Celebrations ──
// Respects prefers-reduced-motion — no particles if user prefers reduced motion.

import confetti from 'canvas-confetti';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Small burst for correct answers (40 particles)
export function celebrateCorrect() {
  if (prefersReducedMotion()) return;
  confetti({
    particleCount: 40,
    spread: 55,
    origin: { y: 0.7 },
    colors: ['#6C5CE7', '#007D62', '#FDCB6E'],
    disableForReducedMotion: true,
  });
}

// Sustained 2-second shower for high scores (80%+)
export function celebrateHighScore() {
  if (prefersReducedMotion()) return;
  const end = Date.now() + 2000;
  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#6C5CE7', '#A29BFE', '#FDCB6E'],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#007D62', '#0770C2', '#FDCB6E'],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

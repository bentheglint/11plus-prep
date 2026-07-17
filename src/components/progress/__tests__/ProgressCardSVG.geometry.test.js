import React from 'react';
import { render } from '@testing-library/react';
import ProgressCardSVG from '../ProgressCardSVG';

// ── Progress Card — scripted geometry / overlap-analysis checks ──
// plans/shareable-progress-card.md: "Reuse variant C's arc-length spacing
// and overlap-analysis approach — run a similar scripted geometry check
// across daysPractised 0-30 and both name lengths." Turned into a durable
// Jest suite (rather than a one-off script) so a future edit to the trail
// waypoints, stone radii, or header layout can never silently reintroduce
// an overlap — CLAUDE.md's "copies of truth need parity tests" spirit
// applied to layout as well as data.

const NOW = new Date('2026-07-15T12:00:00Z');
const SHORT_NAME = 'Jo';
const LONG_NAME = 'Christopher-Alexander-Montgomery';

function renderCard(props) {
  return render(<ProgressCardSVG firstName={SHORT_NAME} questionsAnswered={100} topicsExplored={5} now={NOW} {...props} />);
}

function litStoneCentres(container) {
  // Each lit stone is a <g data-role="stone" data-lit="true"> wrapping two
  // circles (glow + core); the core carries data-role="stone-core" and its
  // cx/cy is the stone's true centre and r=10.5 its collision radius.
  return Array.from(container.querySelectorAll('[data-role="stone-core"]')).map(c => ({
    x: parseFloat(c.getAttribute('cx')),
    y: parseFloat(c.getAttribute('cy')),
    r: parseFloat(c.getAttribute('r')),
  }));
}

function unlitStoneCentres(container) {
  return Array.from(container.querySelectorAll('[data-role="stone"][data-lit="false"]')).map(c => ({
    x: parseFloat(c.getAttribute('cx')),
    y: parseFloat(c.getAttribute('cy')),
    r: parseFloat(c.getAttribute('r')),
  }));
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

describe('ProgressCardSVG geometry — stone arc-length spacing, no overlaps across the full 0-30 range', () => {
  for (let days = 0; days <= 30; days++) {
    it(`daysPractised=${days}: no two stones (lit or unlit) overlap`, () => {
      const { container } = renderCard({ daysPractised: days });
      const all = [...litStoneCentres(container), ...unlitStoneCentres(container)];
      expect(all).toHaveLength(30);
      for (let i = 0; i < all.length; i++) {
        for (let j = i + 1; j < all.length; j++) {
          const d = dist(all[i], all[j]);
          const minSafeDistance = all[i].r + all[j].r; // touching, not overlapping, is the floor
          expect(d).toBeGreaterThan(minSafeDistance);
        }
      }
    });
  }

  it('the lit/unlit boundary sits at exactly daysPractised for a representative mid-range value', () => {
    const { container } = renderCard({ daysPractised: 12 });
    expect(litStoneCentres(container)).toHaveLength(12);
    expect(unlitStoneCentres(container)).toHaveLength(18);
  });
});

describe('ProgressCardSVG geometry — header/flag clearance (regression guard for the fix made 17 Jul)', () => {
  // The two-line growth band is the tallest the header ever gets. Its lowest
  // text baseline must stay clear of the flag's highest point (the pole
  // tip) with a positive margin, for both a short and a long child name (a
  // long name uses a smaller title font but the growth band position is
  // name-length-independent, so this mostly guards against a future edit
  // moving either element without checking the other).
  function flagTopY(container) {
    const pole = container.querySelector('[data-role="flag-pole"]');
    const y1 = parseFloat(pole.getAttribute('y1'));
    const y2 = parseFloat(pole.getAttribute('y2'));
    return Math.min(y1, y2);
  }

  function lowestGrowthBandBaseline(container, texts) {
    // Growth-band <text> elements are matched by their exact rendered
    // content; return the maximum (lowest on screen) y among the ones present.
    const els = texts
      .map(t => Array.from(container.querySelectorAll('text')).find(el => el.textContent === t))
      .filter(Boolean);
    return Math.max(...els.map(el => parseFloat(el.getAttribute('y'))));
  }

  it.each([SHORT_NAME, LONG_NAME])('two-line growth band (name=%s) has positive clearance above the flag', (name) => {
    const { container } = renderCard({
      firstName: name,
      clickedTopics: ['Fractions', 'Letter Codes'],
      subjectImprovement: { subject: 'Maths', upPercent: 25 },
    });
    const clickedText = 'Fractions and Letter Codes clicked this month';
    const improvementText = 'Maths up 25% this month';
    const lowestBaseline = lowestGrowthBandBaseline(container, [clickedText, improvementText]);
    const topOfFlag = flagTopY(container);
    // Allow for text descenders (~10 SVG units below the baseline at this
    // font size) — the flag's topmost point must still sit below that.
    expect(topOfFlag).toBeGreaterThan(lowestBaseline + 10);
  });
});

describe('ProgressCardSVG geometry — stat chips never overlap each other', () => {
  function chipBoxes(container) {
    // Each StatChip renders exactly one <rect rx="22"...> as its container.
    return Array.from(container.querySelectorAll('rect[rx="22"]')).map(r => ({
      x: parseFloat(r.getAttribute('x')),
      y: parseFloat(r.getAttribute('y')),
      width: parseFloat(r.getAttribute('width')),
      height: parseFloat(r.getAttribute('height')),
    }));
  }

  function overlaps(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  it.each([0, 15, 30])('daysPractised=%d: the three stat chips have non-overlapping bounding boxes', (days) => {
    const { container } = renderCard({ daysPractised: days });
    const boxes = chipBoxes(container);
    expect(boxes).toHaveLength(3);
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        expect(overlaps(boxes[i], boxes[j])).toBe(false);
      }
    }
  });
});

describe('ProgressCardSVG geometry — no stone (lit or unlit) sits behind a stat chip', () => {
  // Caught by visual QA (17 Jul): a lit stone rendered partially hidden
  // behind the days chip's corner because the trail's second waypoint swings
  // right into the chip's box. Stone POSITIONS are fixed regardless of
  // daysPractised (only lit/unlit toggles), so one render per name/scenario
  // is sufficient to prove no stone is ever eclipsed by a chip.
  function chipBoxes(container) {
    return Array.from(container.querySelectorAll('rect[rx="22"]')).map(r => ({
      x: parseFloat(r.getAttribute('x')),
      y: parseFloat(r.getAttribute('y')),
      width: parseFloat(r.getAttribute('width')),
      height: parseFloat(r.getAttribute('height')),
    }));
  }

  function circleIntersectsBox(circle, box) {
    const closestX = Math.max(box.x, Math.min(circle.x, box.x + box.width));
    const closestY = Math.max(box.y, Math.min(circle.y, box.y + box.height));
    const d = Math.hypot(circle.x - closestX, circle.y - closestY);
    return d < circle.r;
  }

  it('every stone (using its outer glow radius where lit) clears every chip box', () => {
    const { container } = renderCard({ daysPractised: 27 }); // exercises both lit and unlit stones
    const boxes = chipBoxes(container);
    expect(boxes).toHaveLength(3);

    const litCores = Array.from(container.querySelectorAll('[data-role="stone-core"]'));
    const litGlowRadius = 19; // the glow <circle> drawn behind each lit stone core
    const litStones = litCores.map(c => ({
      x: parseFloat(c.getAttribute('cx')),
      y: parseFloat(c.getAttribute('cy')),
      r: litGlowRadius,
    }));
    const unlitStones = Array.from(container.querySelectorAll('[data-role="stone"][data-lit="false"]')).map(c => ({
      x: parseFloat(c.getAttribute('cx')),
      y: parseFloat(c.getAttribute('cy')),
      r: parseFloat(c.getAttribute('r')),
    }));

    for (const stone of [...litStones, ...unlitStones]) {
      for (const box of boxes) {
        expect(circleIntersectsBox(stone, box)).toBe(false);
      }
    }
  });
});

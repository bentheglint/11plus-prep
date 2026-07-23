/**
 * CoordinateGrid — figure must not give the answer away.
 *
 * WHY THIS EXISTS
 * ---------------
 * The whole point of benchmark fix #9 is to add "read the value off the
 * figure, THEN compute" questions, because real GL papers have them and our
 * bank did not. That only works if the figure withholds the thing being
 * asked for. A grid that renders "B (4, -3)" next to point B answers
 * "what are the coordinates of B?" outright — the child scores without ever
 * reading the grid, which is precisely the test-wiseness the benchmark told
 * us to design out. (Caught during #9b component QA, 23 Jul 2026.)
 *
 * The defence is in the component's shape, not in author discipline:
 * coordinates are opt-in per point, and a point marked `unknown` — the thing
 * the question is about — can never render them at all.
 *
 * These tests pin that behaviour so a later "helpful" change cannot quietly
 * reintroduce the leak.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { CoordinateGrid, VennDiagram, NetDiagram } from '../../microLessons/visuals';

// Pull every piece of text the SVG actually renders.
function renderedText(ui) {
  const { container } = render(ui);
  return [...container.querySelectorAll('text')].map((t) => t.textContent);
}

// A coordinate pair like "(4, -3)" appearing anywhere in the figure.
const COORD_PAIR = /\(\s*-?\d+\s*,\s*-?\d+\s*\)/;

describe('CoordinateGrid does not leak answers', () => {
  it('labels a point with its letter only by default', () => {
    const texts = renderedText(
      <CoordinateGrid xRange={[0, 10]} yRange={[0, 10]} points={[{ x: 4, y: 3, label: 'B' }]} />
    );
    expect(texts).toContain('B');
    expect(texts.some((t) => COORD_PAIR.test(t))).toBe(false);
  });

  it('never renders coordinates for an unknown point, even if showCoords is set', () => {
    // `unknown` marks the point the question is asking about. showCoords must
    // lose this argument every time — that is the whole safety property.
    const texts = renderedText(
      <CoordinateGrid
        xRange={[-5, 5]}
        yRange={[-5, 5]}
        points={[{ x: 4, y: -3, label: 'P', unknown: true, showCoords: true }]}
      />
    );
    expect(texts).toContain('P');
    expect(texts.some((t) => COORD_PAIR.test(t))).toBe(false);
  });

  it('shows coordinates only for the points that explicitly opt in', () => {
    // The legitimate case: A is GIVEN information, B is the unknown.
    const texts = renderedText(
      <CoordinateGrid
        xRange={[-5, 5]}
        yRange={[-5, 5]}
        points={[
          { x: -3, y: 2, label: 'A', showCoords: true },
          { x: 4, y: -3, label: 'B' },
        ]}
      />
    );
    const withCoords = texts.filter((t) => COORD_PAIR.test(t));
    expect(withCoords).toHaveLength(1);
    expect(withCoords[0]).toContain('A');
    expect(withCoords[0]).not.toContain('B');
  });
});

describe('CoordinateGrid renders a readable, correct grid', () => {
  it('uses an equal scale on both axes so reflections are not distorted', () => {
    // A squashed grid makes a correct reflection LOOK wrong, so equal scale
    // is a correctness property of the figure, not a cosmetic one.
    const { container } = render(
      <CoordinateGrid xRange={[0, 10]} yRange={[0, 4]} />
    );
    const lines = [...container.querySelectorAll('g.cg-grid line')];
    const vertical = lines.filter((l) => l.getAttribute('x1') === l.getAttribute('x2'));
    const horizontal = lines.filter((l) => l.getAttribute('y1') === l.getAttribute('y2'));

    const cellX = Math.abs(+vertical[1].getAttribute('x1') - +vertical[0].getAttribute('x1'));
    const cellY = Math.abs(+horizontal[1].getAttribute('y1') - +horizontal[0].getAttribute('y1'));
    expect(Math.abs(cellX - cellY)).toBeLessThan(0.01);
  });

  it('draws a gridline for every integer in range', () => {
    const { container } = render(<CoordinateGrid xRange={[0, 6]} yRange={[0, 4]} />);
    const lines = [...container.querySelectorAll('g.cg-grid line')];
    const vertical = lines.filter((l) => l.getAttribute('x1') === l.getAttribute('x2'));
    const horizontal = lines.filter((l) => l.getAttribute('y1') === l.getAttribute('y2'));
    expect(vertical).toHaveLength(7); // 0..6
    expect(horizontal).toHaveLength(5); // 0..4
  });

  it('produces finite geometry for every mirror-line form', () => {
    const forms = [
      { vertical: 3 },
      { horizontal: 2 },
      { diagonal: 'y=x' },
      { diagonal: 'y=-x' },
    ];
    forms.forEach((mirrorLine) => {
      const { container } = render(
        <CoordinateGrid xRange={[-5, 5]} yRange={[-5, 5]} mirrorLine={mirrorLine} />
      );
      const line = container.querySelector('g.mirror-lines line');
      expect(line).not.toBeNull();
      ['x1', 'y1', 'x2', 'y2'].forEach((attr) => {
        expect(Number.isFinite(+line.getAttribute(attr))).toBe(true);
      });
    });
  });

  it('renders nothing rather than crashing on a degenerate range', () => {
    const { container } = render(<CoordinateGrid xRange={[5, 5]} yRange={[0, 10]} />);
    expect(container.querySelector('svg')).toBeNull();
  });
});

describe('SVG group names do not collide with Tailwind utilities', () => {
  // Tailwind ships utility classes called `grid` (display: grid) and `outline`
  // (outline-style: solid). Naming an SVG <g> after one lets Tailwind style it:
  // NetDiagram's <g className="outline"> picked up a 3px CSS outline and painted
  // a black box around the net's bounding rectangle. The SVG was geometrically
  // perfect; a class name drew the rectangle. Caught only by looking at it.
  const TAILWIND_UTILITIES = [
    'grid', 'outline', 'border', 'flex', 'block', 'hidden', 'table',
    'ring', 'shadow', 'container', 'static', 'fixed', 'absolute', 'relative',
  ];

  it.each([
    ['CoordinateGrid', <CoordinateGrid xRange={[0, 6]} yRange={[0, 6]} polygon={[[1, 1], [3, 1], [3, 3]]} mirrorLine={{ vertical: 4 }} />],
    ['VennDiagram', <VennDiagram sets={['A', 'B']} regions={{ A: 1, B: 2, AB: 3, outside: 4 }} />],
    ['NetDiagram', <NetDiagram cuboid={{ length: 4, width: 2, height: 3 }} />],
  ])('%s uses no Tailwind-colliding group names', (_name, ui) => {
    const { container } = render(ui);
    const offenders = [...container.querySelectorAll('svg g[class]')]
      .map((g) => g.getAttribute('class'))
      .filter((cls) => TAILWIND_UTILITIES.includes(cls));
    expect(offenders).toEqual([]);
  });
});

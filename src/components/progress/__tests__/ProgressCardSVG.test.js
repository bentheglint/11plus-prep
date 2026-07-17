import React from 'react';
import { render } from '@testing-library/react';
import ProgressCardSVG, {
  CARD_SIZE,
  FOOTER_FONT_SIZE,
  titleFontSize,
  progressCardDateStamp,
} from '../ProgressCardSVG';

const BASE_PROPS = {
  firstName: 'Evie',
  questionsAnswered: 214,
  daysPractised: 18,
  topicsExplored: 7,
  now: new Date('2026-07-15T12:00:00Z'), // Summer of Prep window
};

describe('ProgressCardSVG — self-contained SVG (adversarial review outcome #2)', () => {
  it('renders no class= attribute anywhere in the markup', () => {
    const { container } = render(<ProgressCardSVG {...BASE_PROPS} />);
    expect(container.innerHTML).not.toMatch(/class=/);
  });

  it('renders no <filter> or <mask> elements', () => {
    const { container } = render(<ProgressCardSVG {...BASE_PROPS} />);
    expect(container.querySelector('filter')).toBeNull();
    expect(container.querySelector('mask')).toBeNull();
  });

  it('allows linearGradient/radialGradient in defs (core SVG paint servers, not filters)', () => {
    const { container } = render(<ProgressCardSVG {...BASE_PROPS} />);
    expect(container.querySelector('defs linearGradient')).not.toBeNull();
  });

  it('uses a fixed 1080x1080 viewBox regardless of props', () => {
    const { container } = render(<ProgressCardSVG {...BASE_PROPS} />);
    const svg = container.querySelector('svg');
    expect(svg.getAttribute('viewBox')).toBe('0 0 1080 1080');
    expect(CARD_SIZE).toBe(1080);
  });

  it('uses only a system font stack — no custom @font-face family name', () => {
    const { container } = render(<ProgressCardSVG {...BASE_PROPS} />);
    const textEls = container.querySelectorAll('text');
    expect(textEls.length).toBeGreaterThan(0);
    textEls.forEach(el => {
      const family = el.getAttribute('font-family');
      expect(family).toMatch(/-apple-system/);
      expect(family).not.toMatch(/Outfit|DM Sans|fontsource/i);
    });
  });
});

describe('ProgressCardSVG — real PrepStep logo lockup (brand rule, CLAUDE.md 17 Jul)', () => {
  it('renders the three BrandMark bars in the exact brand hex colours, ascending staircase heights', () => {
    const { container } = render(<ProgressCardSVG {...BASE_PROPS} />);
    const rects = Array.from(container.querySelectorAll('rect')).filter(r =>
      ['#3B82F6', '#7C3AED', '#22C55E'].includes(r.getAttribute('fill'))
    );
    expect(rects).toHaveLength(3);
    const blue = rects.find(r => r.getAttribute('fill') === '#3B82F6');
    const purple = rects.find(r => r.getAttribute('fill') === '#7C3AED');
    const green = rects.find(r => r.getAttribute('fill') === '#22C55E');
    const h = (r) => parseFloat(r.getAttribute('height'));
    // Staircase: blue shortest, purple mid, green tallest (matches BrandMark).
    expect(h(blue)).toBeLessThan(h(purple));
    expect(h(purple)).toBeLessThan(h(green));
  });

  it('renders the "PrepStep" wordmark in mixed case, not an invented all-caps eyebrow', () => {
    const { getByText, queryByText } = render(<ProgressCardSVG {...BASE_PROPS} />);
    expect(getByText('PrepStep')).toBeInTheDocument();
    expect(queryByText('PREPSTEP')).toBeNull();
  });
});

describe('ProgressCardSVG — content', () => {
  it('renders the questions-answered and topics-explored stats and labels', () => {
    const { getByText } = render(<ProgressCardSVG {...BASE_PROPS} />);
    expect(getByText('214')).toBeInTheDocument();
    expect(getByText('7')).toBeInTheDocument();
    expect(getByText('questions answered')).toBeInTheDocument();
    expect(getByText('topics explored')).toBeInTheDocument();
  });

  it('formats large question counts with thousands separators', () => {
    const { getByText } = render(<ProgressCardSVG {...BASE_PROPS} questionsAnswered={1234} />);
    expect(getByText('1,234')).toBeInTheDocument();
  });

  it('renders the seasonal Summer of Prep title in Jun-Sep', () => {
    const { getByText } = render(<ProgressCardSVG {...BASE_PROPS} />);
    expect(getByText('Evie’s Summer of Prep')).toBeInTheDocument();
  });

  it('renders the neutral title outside Jun-Sep', () => {
    const { getByText } = render(
      <ProgressCardSVG {...BASE_PROPS} now={new Date('2026-01-10T12:00:00Z')} />
    );
    expect(getByText('Evie’s month of prep')).toBeInTheDocument();
  });

  it('uses a typographic (curly) apostrophe in the rendered title, never the straight ASCII quote', () => {
    const { getByText, queryByText } = render(<ProgressCardSVG {...BASE_PROPS} />);
    expect(getByText('Evie’s Summer of Prep')).toBeInTheDocument();
    expect(queryByText("Evie's Summer of Prep")).toBeNull();
  });

  it('renders the quiet footer URL', () => {
    const { getByText } = render(<ProgressCardSVG {...BASE_PROPS} />);
    expect(getByText('prepstep.co.uk/card')).toBeInTheDocument();
  });
});

describe('ProgressCardSVG — days chip (arena stat-display rule: never a slash-fraction)', () => {
  it('renders the plain days number and an "of the last / 30 days" caption, never "18/30"', () => {
    const { container, getByText } = render(<ProgressCardSVG {...BASE_PROPS} />);
    expect(getByText('18')).toBeInTheDocument();
    expect(getByText('of the last')).toBeInTheDocument();
    expect(getByText('30 days')).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/18\s*\/\s*30/);
    expect(container.innerHTML).not.toMatch(/>\d+\/30</);
  });

  it('clamps an out-of-range daysPractised into 0-30 for display', () => {
    const { getByText } = render(<ProgressCardSVG {...BASE_PROPS} daysPractised={45} />);
    expect(getByText('30')).toBeInTheDocument();
  });
});

describe('ProgressCardSVG — mountain-trail scene (lit stones = daysPractised)', () => {
  function stoneEls(container) {
    return Array.from(container.querySelectorAll('[data-role="stone"]'));
  }

  it('lights exactly daysPractised stones out of 30, honest at a low count', () => {
    const { container } = render(<ProgressCardSVG {...BASE_PROPS} daysPractised={3} />);
    const stones = stoneEls(container);
    expect(stones).toHaveLength(30);
    const lit = stones.filter(s => s.getAttribute('data-lit') === 'true');
    expect(lit).toHaveLength(3);
  });

  it('lights all 30 stones at the full window (glorious at 30)', () => {
    const { container } = render(<ProgressCardSVG {...BASE_PROPS} daysPractised={30} />);
    const stones = stoneEls(container);
    const lit = stones.filter(s => s.getAttribute('data-lit') === 'true');
    expect(lit).toHaveLength(30);
  });

  it('lights zero stones gracefully at zero practice days', () => {
    const { container } = render(<ProgressCardSVG {...BASE_PROPS} daysPractised={0} />);
    const stones = stoneEls(container);
    const lit = stones.filter(s => s.getAttribute('data-lit') === 'true');
    expect(lit).toHaveLength(0);
  });

  it('renders the summit flag (pole + pennant)', () => {
    const { container } = render(<ProgressCardSVG {...BASE_PROPS} />);
    expect(container.querySelector('[data-role="flag-pole"]')).not.toBeNull();
    expect(container.querySelector('[data-role="flag-pennant"]')).not.toBeNull();
  });
});

describe('ProgressCardSVG — growth band (Ben, 17 Jul revision)', () => {
  it('renders no growth band and falls back to the quiet tagline when neither prop is given', () => {
    const { getByText, queryByText } = render(<ProgressCardSVG {...BASE_PROPS} />);
    expect(getByText('A month of steady effort, one question at a time')).toBeInTheDocument();
    expect(queryByText(/clicked this month/)).toBeNull();
    expect(queryByText(/up \d+% this month/)).toBeNull();
  });

  it('renders a single clicked-topics line, joining two names with "and"', () => {
    const { getByText, queryByText } = render(
      <ProgressCardSVG {...BASE_PROPS} clickedTopics={['Fractions', 'Letter Codes']} />
    );
    expect(getByText('Fractions and Letter Codes clicked this month')).toBeInTheDocument();
    expect(queryByText('A month of steady effort, one question at a time')).toBeNull();
  });

  it('joins three clicked topics Oxford-style', () => {
    const { getByText } = render(
      <ProgressCardSVG {...BASE_PROPS} clickedTopics={['Fractions', 'Letter Codes', 'Synonyms']} />
    );
    expect(getByText('Fractions, Letter Codes and Synonyms clicked this month')).toBeInTheDocument();
  });

  it('renders a single subject-improvement line containing the word "up" and an arrow motif', () => {
    const { getByText, container } = render(
      <ProgressCardSVG {...BASE_PROPS} subjectImprovement={{ subject: 'Maths', upPercent: 25 }} />
    );
    expect(getByText('Maths up 25% this month')).toBeInTheDocument();
    // The arrow motif is a plain polygon (no filter/emoji) rendered alongside the line.
    expect(container.querySelectorAll('polygon').length).toBeGreaterThan(0);
  });

  it('renders BOTH growth lines together when both qualify', () => {
    const { getByText } = render(
      <ProgressCardSVG
        {...BASE_PROPS}
        clickedTopics={['Fractions']}
        subjectImprovement={{ subject: 'Maths', upPercent: 25 }}
      />
    );
    expect(getByText('Fractions clicked this month')).toBeInTheDocument();
    expect(getByText('Maths up 25% this month')).toBeInTheDocument();
  });

  it('defensively never renders a non-positive subjectImprovement (belt-and-braces vs the derivation guard)', () => {
    const { queryByText, getByText } = render(
      <ProgressCardSVG {...BASE_PROPS} subjectImprovement={{ subject: 'Maths', upPercent: -10 }} />
    );
    expect(queryByText(/Maths/)).toBeNull();
    // Falls back to the tagline since there's no OTHER qualifying growth line.
    expect(getByText('A month of steady effort, one question at a time')).toBeInTheDocument();
  });
});

describe('ProgressCardSVG — date stamp (self-dating screenshots)', () => {
  it('renders the London month + year, uppercased, derived from the now prop', () => {
    const { getByText } = render(<ProgressCardSVG {...BASE_PROPS} />);
    expect(getByText('JULY 2026')).toBeInTheDocument();
  });

  it('tracks a different month via the now prop', () => {
    const { getByText } = render(
      <ProgressCardSVG {...BASE_PROPS} now={new Date('2026-01-10T12:00:00Z')} />
    );
    expect(getByText('JANUARY 2026')).toBeInTheDocument();
  });

  it('progressCardDateStamp reads the month in Europe/London across the BST midnight boundary', () => {
    expect(progressCardDateStamp(new Date('2026-07-31T23:30:00Z'))).toBe('AUGUST 2026');
    expect(progressCardDateStamp(new Date('2026-01-15T23:30:00Z'))).toBe('JANUARY 2026');
  });
});

describe('ProgressCardSVG — name toggle (adversarial review outcome #5)', () => {
  it('shows the real first name by default', () => {
    const { getByText } = render(<ProgressCardSVG {...BASE_PROPS} />);
    expect(getByText('Evie’s Summer of Prep')).toBeInTheDocument();
  });

  it('shows a capitalised "My child" when useChildName is false, never the real name', () => {
    const { getByText, queryByText } = render(<ProgressCardSVG {...BASE_PROPS} useChildName={false} />);
    expect(getByText('My child’s Summer of Prep')).toBeInTheDocument();
    expect(queryByText(/Evie/)).toBeNull();
  });

  it('capitalises "My child" in the neutral skin too', () => {
    const { getByText } = render(
      <ProgressCardSVG {...BASE_PROPS} useChildName={false} now={new Date('2026-01-10T12:00:00Z')} />
    );
    expect(getByText('My child’s month of prep')).toBeInTheDocument();
  });
});

describe('ProgressCardSVG — footer legibility floor (adversarial review outcome #3)', () => {
  it('the exported FOOTER_FONT_SIZE constant is at least 28 SVG units', () => {
    expect(FOOTER_FONT_SIZE).toBeGreaterThanOrEqual(28);
  });

  it('the rendered footer text element has font-size >= 28', () => {
    const { getByText } = render(<ProgressCardSVG {...BASE_PROPS} />);
    const footer = getByText('prepstep.co.uk/card');
    expect(parseFloat(footer.getAttribute('font-size'))).toBeGreaterThanOrEqual(28);
  });
});

describe('titleFontSize — long-name step-down rule', () => {
  it('shrinks monotonically as the title gets longer', () => {
    const short = titleFontSize('Evie’s Summer of Prep');
    const medium = titleFontSize('Maximilian’s Summer of Prep');
    const long = titleFontSize('Persephone-Alexandra’s Summer of Prep');
    const veryLong = titleFontSize('Christopher-Alexander-Montgomery’s Summer of Prep');

    expect(medium).toBeLessThanOrEqual(short);
    expect(long).toBeLessThanOrEqual(medium);
    expect(veryLong).toBeLessThanOrEqual(long);
    expect(veryLong).toBeLessThan(short);
  });

  it('never returns a font size so small it would be illegible on the 1080-wide canvas', () => {
    const veryLong = titleFontSize('A'.repeat(80));
    expect(veryLong).toBeGreaterThanOrEqual(28);
  });

  it('a rendered card with a long name uses a visibly smaller title font-size than a short name', () => {
    const shortRender = render(<ProgressCardSVG {...BASE_PROPS} firstName="Jo" />);
    const shortTitle = shortRender.getByText('Jo’s Summer of Prep');
    const shortSize = parseFloat(shortTitle.getAttribute('font-size'));

    const longRender = render(
      <ProgressCardSVG {...BASE_PROPS} firstName="Christopher-Alexander-Montgomery" />
    );
    const longTitle = longRender.getByText('Christopher-Alexander-Montgomery’s Summer of Prep');
    const longSize = parseFloat(longTitle.getAttribute('font-size'));

    expect(longSize).toBeLessThan(shortSize);
  });
});

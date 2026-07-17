import React from 'react';
import { render } from '@testing-library/react';
import ProgressCardSVG, { CARD_SIZE, FOOTER_FONT_SIZE, titleFontSize, progressCardDateStamp } from '../ProgressCardSVG';

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

describe('ProgressCardSVG — content', () => {
  it('renders the three hero numbers and labels', () => {
    const { getByText } = render(<ProgressCardSVG {...BASE_PROPS} />);
    expect(getByText('214')).toBeInTheDocument();
    expect(getByText('18/30')).toBeInTheDocument();
    expect(getByText('7')).toBeInTheDocument();
    expect(getByText('questions answered')).toBeInTheDocument();
    expect(getByText('days practised')).toBeInTheDocument();
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
    // 2026-07-31T23:30:00Z is already 1 August 00:30 in BST — the stamp must
    // say AUGUST, not July, for a UK parent.
    expect(progressCardDateStamp(new Date('2026-07-31T23:30:00Z'))).toBe('AUGUST 2026');
    // In GMT (winter) the same UTC clock time stays in the same month.
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

describe('ProgressCardSVG — composition (Fable review, 17 Jul)', () => {
  // The three hero numeral <text> elements share the same y; assert they sit
  // at the card's visual centre band rather than the top half (fix 1), and
  // that the date stamp sits between them and the footer.
  function textByContent(container, content) {
    return Array.from(container.querySelectorAll('text')).find(el => el.textContent === content);
  }

  it('places the stats row at the visual centre of the 1080-high canvas', () => {
    const { container } = render(<ProgressCardSVG {...BASE_PROPS} />);
    const statValue = textByContent(container, '18/30');
    const y = parseFloat(statValue.getAttribute('y'));
    // Numeral baseline within the middle band (canvas centre 540 +/- 100)
    expect(y).toBeGreaterThan(440);
    expect(y).toBeLessThan(640);
  });

  it('places the date stamp between the stats row and the footer', () => {
    const { container } = render(<ProgressCardSVG {...BASE_PROPS} />);
    const statValue = textByContent(container, '18/30');
    const stamp = textByContent(container, 'JULY 2026');
    const footer = textByContent(container, 'prepstep.co.uk/card');
    const statY = parseFloat(statValue.getAttribute('y'));
    const stampY = parseFloat(stamp.getAttribute('y'));
    const footerY = parseFloat(footer.getAttribute('y'));
    expect(stampY).toBeGreaterThan(statY);
    expect(footerY).toBeGreaterThan(stampY);
  });

  it('the star motif is horizontally symmetric about the card centre line (no lopsided ornament)', () => {
    const { container } = render(<ProgressCardSVG {...BASE_PROPS} />);
    const polygons = Array.from(container.querySelectorAll('polygon'));
    expect(polygons.length).toBeGreaterThan(0);

    // Each polygon's horizontal centre = mean of its point x-coordinates.
    // For every star left of the centre line there must be a mirror star at
    // the reflected x (within a rounding tolerance) — true symmetry, not a
    // laurel that "roughly" balances.
    const centres = polygons.map(p => {
      const xs = p.getAttribute('points').split(' ').map(pt => parseFloat(pt.split(',')[0]));
      return xs.reduce((a, b) => a + b, 0) / xs.length;
    });
    const MID = 540;
    for (const cx of centres) {
      const mirrored = 2 * MID - cx;
      const hasMirror = centres.some(other => Math.abs(other - mirrored) < 1);
      expect(hasMirror).toBe(true);
    }
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
    // Genuinely different, not just a flat clamp for these lengths
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

import React from 'react';
import { render } from '@testing-library/react';
import ProgressCardSVG, { CARD_SIZE, FOOTER_FONT_SIZE, titleFontSize } from '../ProgressCardSVG';

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
    expect(getByText("Evie's Summer of Prep")).toBeInTheDocument();
  });

  it('renders the neutral title outside Jun-Sep', () => {
    const { getByText } = render(
      <ProgressCardSVG {...BASE_PROPS} now={new Date('2026-01-10T12:00:00Z')} />
    );
    expect(getByText("Evie's month of prep")).toBeInTheDocument();
  });

  it('renders the quiet footer URL', () => {
    const { getByText } = render(<ProgressCardSVG {...BASE_PROPS} />);
    expect(getByText('prepstep.co.uk/card')).toBeInTheDocument();
  });
});

describe('ProgressCardSVG — name toggle (adversarial review outcome #5)', () => {
  it('shows the real first name by default', () => {
    const { getByText } = render(<ProgressCardSVG {...BASE_PROPS} />);
    expect(getByText("Evie's Summer of Prep")).toBeInTheDocument();
  });

  it('shows "my child" when useChildName is false, never the real name', () => {
    const { getByText, queryByText } = render(<ProgressCardSVG {...BASE_PROPS} useChildName={false} />);
    expect(getByText("my child's Summer of Prep")).toBeInTheDocument();
    expect(queryByText(/Evie/)).toBeNull();
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
    const short = titleFontSize("Evie's Summer of Prep");
    const medium = titleFontSize("Maximilian's Summer of Prep");
    const long = titleFontSize("Persephone-Alexandra's Summer of Prep");
    const veryLong = titleFontSize("Christopher-Alexander-Montgomery's Summer of Prep");

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
    const shortTitle = shortRender.getByText("Jo's Summer of Prep");
    const shortSize = parseFloat(shortTitle.getAttribute('font-size'));

    const longRender = render(
      <ProgressCardSVG {...BASE_PROPS} firstName="Christopher-Alexander-Montgomery" />
    );
    const longTitle = longRender.getByText("Christopher-Alexander-Montgomery's Summer of Prep");
    const longSize = parseFloat(longTitle.getAttribute('font-size'));

    expect(longSize).toBeLessThan(shortSize);
  });
});

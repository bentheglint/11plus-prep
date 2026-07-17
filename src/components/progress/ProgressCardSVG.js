import React from 'react';
import { progressCardTitle, PROGRESS_CARD_WINDOW_DAYS } from '../../utils/progressCard';

// ── Shareable Progress Card — the keepsake SVG ──
// plans/shareable-progress-card.md (growth loop 2).
//
// HARD RULES (adversarial review outcome #2 — binding, not stylistic taste):
//   - SVG presentation attributes / inline style ONLY. No Tailwind classes,
//     no CSS variables, no external refs, no <filter>/<mask>. This markup is
//     serialised to a string and rasterised through an Image -> canvas
//     pipeline (src/utils/progressCardExport.js) for the iOS 15.6 Safari
//     floor — anything that depends on a stylesheet, a CSS custom property,
//     or a loaded webfont silently vanishes on that path. Never add
//     `className` to anything in this file.
//   - System font stack only — fonts do not load inside SVG-as-image on
//     Safari, so a custom @font-face would render as tofu/fallback anyway.
//   - Fixed 1080x1080 viewBox, devicePixelRatio-independent.
//
// ART DIRECTION: a keepsake, not an app screenshot. Warm paper-cream canvas,
// deep ink text, ONE brand-harmonised accent (a deeper, print-safe cousin of
// the site's --warm amber token) used sparingly — deliberately NOT the
// brand's default purple. Composition (Fable review, 17 Jul): header block
// in the top third, the three hero numerals at the visual centre, and a
// quiet date stamp above the footer so screenshots stay self-dating. The
// celebratory motif is a small symmetric arc of three stars, bookended
// (larger above the wordmark, smaller and softer above the date stamp) so
// the lower half reads as rhythm, not vacancy. Pure geometry, no emoji, no
// icon font.

export const CARD_SIZE = 1080;

const FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// Palette — warm-neutral keepsake tones, distinct from (but harmonised with)
// the site's cool-lavender brand palette (src/components/landing/landing.css).
const INK = '#241C10';         // near-black warm ink — softer than pure black on a cream ground
const INK_SOFT = '#7A6C55';    // muted ink for quiet copy (footer, labels, date stamp)
const CREAM = '#FBF3E2';       // warm paper-cream canvas
const CREAM_LINE = '#EDE0C4';  // subtle inner border / hairline tone
const AMBER = '#C8842A';       // the one accent — a deeper, print-safe cousin of the site's --warm (#F59E0B), sparingly used

// Long-name step-down (adversarial review outcome #2): the title is the one
// line whose length is unbounded (real child's name + season skin), so it's
// the one element that must shrink to stay inside the fixed 1080-wide canvas
// without ever wrapping. Exported for direct unit testing.
export function titleFontSize(title) {
  const len = (title || '').length;
  if (len <= 18) return 66;
  if (len <= 26) return 56;
  if (len <= 34) return 46;
  if (len <= 44) return 38;
  return 32;
}

// Footer must stay legible at a 300px-wide render (adversarial review
// outcome #3 — the on-card URL is the durable attribution carrier once a
// share strips text/link). 30 SVG units clears the required >=28 floor with
// a small margin while still reading as "quiet" against the hero numerals.
export const FOOTER_FONT_SIZE = 30;

// Quiet self-dating stamp above the footer (Fable review fix 1): "JULY 2026",
// month read in Europe/London so it can't flip a day early/late for a UK
// parent relative to the device timezone — same reasoning as the title skin.
const londonMonthYearFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  month: 'long',
  year: 'numeric',
});

export function progressCardDateStamp(now) {
  const d = now instanceof Date ? now : new Date();
  return londonMonthYearFormatter.format(d).toUpperCase();
}

function formatNumber(n) {
  const value = Number.isFinite(n) ? n : 0;
  return value.toLocaleString('en-GB');
}

// A plain 5-point star polygon — no icon font, no emoji (project convention:
// never use emoji as icons).
function Star({ cx, cy, r, opacity = 1 }) {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.42;
    points.push(`${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`);
  }
  return <polygon points={points.join(' ')} fill={AMBER} opacity={opacity} />;
}

// A symmetric three-star arc, centred on cx — the card's single celebratory
// motif (Fable review fixes 2 & 3: replaces the asymmetric laurels and the
// two stray mid-card stars with one deliberate, mirrorable ornament, used
// twice as bookends). `spread` is the horizontal offset of the side stars,
// `lift` how far the centre star rises above them (negative = arcs down).
function StarArc({ cx, y, r, spread, lift, opacity = 1 }) {
  return (
    <g>
      <Star cx={cx - spread} cy={y} r={r * 0.72} opacity={opacity * 0.8} />
      <Star cx={cx} cy={y - lift} r={r} opacity={opacity} />
      <Star cx={cx + spread} cy={y} r={r * 0.72} opacity={opacity * 0.8} />
    </g>
  );
}

function StatBlock({ x, y, value, label }) {
  return (
    <g>
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fontFamily={FONT_STACK}
        fontWeight="800"
        fontSize="126"
        fill={INK}
        letterSpacing="-3"
      >
        {value}
      </text>
      <text
        x={x}
        y={y + 52}
        textAnchor="middle"
        fontFamily={FONT_STACK}
        fontWeight="600"
        fontSize="26"
        fill={INK_SOFT}
        letterSpacing="0.5"
      >
        {label}
      </text>
    </g>
  );
}

/**
 * @param {string} firstName - active child's first name
 * @param {number} questionsAnswered
 * @param {number} daysPractised
 * @param {number} topicsExplored
 * @param {boolean} [useChildName=true] - name toggle (adversarial review
 *   outcome #5 — a deliberate, previewed disclosure choice, not a default).
 *   false renders "My child" instead of the real name (capitalised: it
 *   opens the title line — Fable review fix 4).
 * @param {Date} [now] - injectable for deterministic testing of the
 *   seasonal title skin and the date stamp.
 */
export default function ProgressCardSVG({
  firstName,
  questionsAnswered,
  daysPractised,
  topicsExplored,
  useChildName = true,
  now,
}) {
  const displayName = useChildName ? (firstName || 'Your child') : 'My child';
  const title = progressCardTitle(displayName, now ? { now } : undefined);
  const fontSize = titleFontSize(title);
  const dateStamp = progressCardDateStamp(now);

  const midX = CARD_SIZE / 2;
  // Stats row centred on the card's visual middle: numerals span roughly
  // y 470-590 with labels at 642, so the block's optical centre sits at
  // ~555 against the canvas centre of 540.
  const statsY = 590;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${CARD_SIZE} ${CARD_SIZE}`}
      width={CARD_SIZE}
      height={CARD_SIZE}
      role="img"
      aria-label={`${title} progress card`}
    >
      {/* Canvas */}
      <rect x="0" y="0" width={CARD_SIZE} height={CARD_SIZE} fill={CREAM} />
      <rect
        x="30" y="30"
        width={CARD_SIZE - 60} height={CARD_SIZE - 60}
        fill="none" stroke={CREAM_LINE} strokeWidth="2"
      />

      {/* ── Header block (top third) ── */}

      {/* Celebratory motif — symmetric star arc crowning the wordmark */}
      <StarArc cx={midX} y={124} r={13} spread={64} lift={20} />

      {/* Eyebrow wordmark */}
      <text
        x={midX} y="186"
        textAnchor="middle"
        fontFamily={FONT_STACK}
        fontWeight="700"
        fontSize="24"
        fill={AMBER}
        letterSpacing="4"
      >
        PREPSTEP
      </text>

      {/* Title */}
      <text
        x={midX} y="276"
        textAnchor="middle"
        fontFamily={FONT_STACK}
        fontWeight="800"
        fontSize={fontSize}
        fill={INK}
        letterSpacing="-1.5"
      >
        {title}
      </text>

      <text
        x={midX} y="328"
        textAnchor="middle"
        fontFamily={FONT_STACK}
        fontWeight="500"
        fontSize="30"
        fill={INK_SOFT}
      >
        A month of steady effort, one question at a time
      </text>

      {/* Divider between header and the stats row */}
      <rect x={midX - 70} y="420" width="140" height="3" fill={AMBER} />

      {/* ── Three hero stats — the visual centre of the card ── */}
      <StatBlock x={midX - 350} y={statsY} value={formatNumber(questionsAnswered)} label="questions answered" />
      <StatBlock x={midX} y={statsY} value={`${daysPractised}/${PROGRESS_CARD_WINDOW_DAYS}`} label="days practised" />
      <StatBlock x={midX + 350} y={statsY} value={formatNumber(topicsExplored)} label="topics explored" />

      {/* ── Quiet lower block — bookend motif, date stamp, footer ── */}

      {/* Bookend motif: the same arc, smaller and softer, arcing down */}
      <StarArc cx={midX} y={800} r={9} spread={46} lift={-12} opacity={0.55} />

      {/* Self-dating stamp — screenshots keep their month */}
      <text
        x={midX} y="902"
        textAnchor="middle"
        fontFamily={FONT_STACK}
        fontWeight="600"
        fontSize="26"
        fill={INK_SOFT}
        letterSpacing="3"
      >
        {dateStamp}
      </text>

      {/* Footer — quiet but legible even at a 300px render (the URL is the durable attribution carrier) */}
      <text
        x={midX} y={CARD_SIZE - 66}
        textAnchor="middle"
        fontFamily={FONT_STACK}
        fontWeight="600"
        fontSize={FOOTER_FONT_SIZE}
        fill={INK_SOFT}
        letterSpacing="0.5"
      >
        prepstep.co.uk/card
      </text>
    </svg>
  );
}

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
// deep ink text, ONE brand-harmonised accent (the site's existing --warm
// amber token, already used sparingly for the tutor's "warm" moments in
// landing.css) used sparingly here too — deliberately NOT the brand's
// default purple, which would read as an app screenshot / generic AI-slop
// gradient rather than something worth keeping. Three big confident numerals
// are the heroes; the celebratory motif (a restrained laurel either side of
// the title) is built from plain ellipses/paths, no icon font, no emoji.

export const CARD_SIZE = 1080;

const FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// Palette — warm-neutral keepsake tones, distinct from (but harmonised with)
// the site's cool-lavender brand palette (src/components/landing/landing.css).
const INK = '#241C10';         // near-black warm ink — softer than pure black on a cream ground
const INK_SOFT = '#7A6C55';    // muted ink for quiet copy (footer, labels)
const CREAM = '#FBF3E2';       // warm paper-cream canvas
const CREAM_LINE = '#EDE0C4';  // subtle inner border / hairline tone
const AMBER = '#C8842A';       // the one accent — a deeper, print-safe cousin of the site's --warm (#F59E0B), sparingly used
const AMBER_SOFT = '#E7C88E';  // laurel/star tone, low-contrast against cream

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
// a small margin while still reading as "quiet" against the 66-90px hero
// numerals above it.
export const FOOTER_FONT_SIZE = 30;

function formatNumber(n) {
  const value = Number.isFinite(n) ? n : 0;
  return value.toLocaleString('en-GB');
}

// A small cluster of leaf ellipses along a gentle curve, mirrored for the
// opposite side — a restrained laurel-branch motif. Pure geometry, no
// external asset, no filter/mask.
function laurelLeaves(originX, originY, mirror) {
  const leaves = [];
  const count = 6;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1); // 0..1 along the branch
    const angleDeg = 14 + t * 46; // branch curves outward and up
    const dist = 26 + t * 84;
    const rad = (angleDeg * Math.PI) / 180;
    const dx = Math.cos(rad) * dist * (mirror ? -1 : 1);
    const dy = -Math.sin(rad) * dist;
    const leafRotation = (mirror ? -1 : 1) * (angleDeg + 20);
    const size = 15 - t * 6;
    leaves.push(
      <ellipse
        key={i}
        cx={originX + dx}
        cy={originY + dy}
        rx={size}
        ry={size * 0.42}
        fill={AMBER_SOFT}
        transform={`rotate(${leafRotation} ${originX + dx} ${originY + dy})`}
      />
    );
  }
  return leaves;
}

// A plain 5-point star polygon — used once, small, low-opacity. No icon
// font, no emoji (project convention: never use emoji as icons).
function Star({ cx, cy, r, opacity = 1 }) {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.42;
    points.push(`${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`);
  }
  return <polygon points={points.join(' ')} fill={AMBER} opacity={opacity} />;
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
        fontSize="112"
        fill={INK}
        letterSpacing="-2"
      >
        {value}
      </text>
      <text
        x={x}
        y={y + 46}
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
 *   false renders "my child" instead of the real name.
 * @param {Date} [now] - injectable for deterministic testing of the
 *   seasonal title skin.
 */
export default function ProgressCardSVG({
  firstName,
  questionsAnswered,
  daysPractised,
  topicsExplored,
  useChildName = true,
  now,
}) {
  const displayName = useChildName ? (firstName || 'Your child') : 'my child';
  const title = progressCardTitle(displayName, now ? { now } : undefined);
  const fontSize = titleFontSize(title);

  const midX = CARD_SIZE / 2;
  const statsY = 620;

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

      {/* Restrained celebratory motif — laurel either side of the title */}
      {laurelLeaves(midX - 210, 190, false)}
      {laurelLeaves(midX + 210, 190, true)}

      {/* A few small stars scattered sparingly above the stats — restrained, classy, not confetti */}
      <Star cx={midX - 300} cy={340} r={12} opacity="0.55" />
      <Star cx={midX + 300} cy={340} r={12} opacity="0.55" />
      <Star cx={midX} cy={300} r={9} opacity="0.4" />

      {/* Eyebrow */}
      <text
        x={midX} y="150"
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
        x={midX} y="240"
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
        x={midX} y="290"
        textAnchor="middle"
        fontFamily={FONT_STACK}
        fontWeight="500"
        fontSize="30"
        fill={INK_SOFT}
      >
        A month of steady effort, one question at a time
      </text>

      {/* Divider */}
      <rect x={midX - 70} y="420" width="140" height="3" fill={AMBER} />

      {/* Three hero stats — the heroes of the card */}
      <StatBlock x={midX - 340} y={statsY} value={formatNumber(questionsAnswered)} label="questions answered" />
      <StatBlock x={midX} y={statsY} value={`${daysPractised}/${PROGRESS_CARD_WINDOW_DAYS}`} label="days practised" />
      <StatBlock x={midX + 340} y={statsY} value={formatNumber(topicsExplored)} label="topics explored" />

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

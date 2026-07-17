import React from 'react';
import { progressCardTitle, PROGRESS_CARD_WINDOW_DAYS } from '../../utils/progressCard';

// ── Shareable Progress Card — the keepsake SVG (v2, "trail scene in true
// brand") ──
// plans/shareable-progress-card.md (growth loop 2) — see the "Design +
// content revision (Ben, 17 Jul afternoon)" section, which supersedes the
// original cream/ink "keepsake certificate" Ben rejected as flat and
// numeral-heavy. This file is a from-scratch rebuild synthesising two arena
// candidates Ben chose from (kept read-only in the design scratchpad, not
// imported):
//   - "A" (poster energy): bold name treatment, sticker-style stat chips
//     each in their own clearly separated container.
//   - "C" (the picture of progress): a lit mountain-trail illustration where
//     daysPractised drives that many lit stepping stones (of 30) climbing to
//     a summit flag — arc-length-spaced so switchbacks never bunch stones,
//     honest at 3 days, glorious at 30.
// Recoloured throughout in the REAL PrepStep brand palette (CLAUDE.md,
// "All marketing/outward content uses PrepStep branding") — every colour
// below traces back to a token in src/components/landing/landing.css or the
// header BrandMark in src/components/landing/LandingPage.js, not an
// invented "keepsake" or "poster" palette.
//
// HARD RULES (adversarial review outcome #2 — binding, not stylistic taste):
//   - SVG presentation attributes / inline style ONLY. No Tailwind classes,
//     no CSS variables, no external refs, no <filter>/<mask>. This markup is
//     serialised to a string and rasterised through an Image -> canvas
//     pipeline (src/utils/progressCardExport.js) for the iOS 15.6 Safari
//     floor — anything that depends on a stylesheet, a CSS custom property,
//     or a loaded webfont silently vanishes on that path. Never add
//     `className` to anything in this file. <linearGradient>/<radialGradient>
//     in <defs> ARE allowed (core SVG paint servers, not filters).
//   - System font stack only — fonts do not load inside SVG-as-image on
//     Safari, so a custom @font-face would render as tofu/fallback anyway.
//   - Fixed 1080x1080 viewBox, devicePixelRatio-independent.
//
// STAT DISPLAY RULE (arena finding, binding): never format the days count as
// "18/30" — a parent reads a slash-fraction as a MARK. Always a plain number
// plus a separate "of the last 30 days" caption.

export const CARD_SIZE = 1080;
const MID_X = CARD_SIZE / 2;

const FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// ── Palette — every value traced to landing.css / the header BrandMark ──
// (src/components/landing/landing.css --brand/--brand-deep/--warm/--good;
// src/components/landing/LandingPage.js BrandMark rects #3B82F6/#7C3AED/#22C55E).
const BRAND = '#7C3AED';          // --brand — the dusk sky's dominant hue
const BRAND_DEEP = '#5A4BD1';     // --brand-deep — sky mid-tone, mountain mid-ridge
const BRAND_NIGHT = '#241454';    // darkened --brand-deep — sky top / nearest ridge (night)
const BRAND_HAZE = '#9C8FE8';     // lightened --brand-deep — furthest ridge (atmospheric haze)
const WARM = '#F59E0B';           // --warm — horizon glow, lit stones, flag, "up" accents
const GOOD = '#22C55E';           // --good — positive/"up" green (site-wide positive-signal colour)
const LOGO_BLUE = '#3B82F6';      // BrandMark bar 1
const PAPER = '#F8F7FF';          // --paper — chip backgrounds, title colour over dark sky
const INK = '#0F172A';            // --ink — chip text
const SLATE = '#64748B';          // --slate — chip caption text
const LINE_2 = '#D9D2F0';         // --line-2 — chip border, unlit-stone ring
const LOW_TEXT = '#E8E4F5';       // pale lavender — date stamp / footer over the dark foreground ridge

const NIGHT_STARS = [
  { x: 96, y: 96, r: 3.2, o: 0.85 }, { x: 150, y: 150, r: 2.1, o: 0.6 },
  { x: 68, y: 230, r: 2.6, o: 0.7 }, { x: 130, y: 315, r: 1.8, o: 0.5 },
  { x: 990, y: 110, r: 3, o: 0.8 }, { x: 940, y: 172, r: 2, o: 0.55 },
  { x: 1010, y: 250, r: 2.4, o: 0.65 }, { x: 950, y: 322, r: 1.8, o: 0.45 },
  { x: 850, y: 70, r: 2.4, o: 0.65 }, { x: 60, y: 380, r: 2, o: 0.4 },
  { x: 1020, y: 380, r: 2, o: 0.4 },
];

// Long-name step-down (adversarial review outcome #2): the title is the one
// line whose length is unbounded (real child's name + season skin), so it's
// the one element that must shrink to stay inside the fixed 1080-wide canvas
// without ever wrapping. Exported for direct unit testing.
export function titleFontSize(title) {
  const len = (title || '').length;
  if (len <= 18) return 96;
  if (len <= 26) return 80;
  if (len <= 34) return 64;
  if (len <= 44) return 50;
  return 34;
}

// Footer must stay legible at a 300px-wide render (adversarial review
// outcome #3 — the on-card URL is the durable attribution carrier once a
// share strips text/link). 30 SVG units clears the required >=28 floor with
// a small margin while still reading as "quiet" against the scene.
export const FOOTER_FONT_SIZE = 30;

// Quiet self-dating stamp above the footer: "JULY 2026", month read in
// Europe/London so it can't flip a day early/late for a UK parent relative
// to the device timezone — same reasoning as the title skin.
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

// Joins topic display names into a sentence fragment: "Fractions", "Fractions
// and Letter Codes", or "Fractions, Letter Codes and Synonyms" (Oxford-style,
// never an Oxford comma before "and" with only two items).
function joinTopicNames(names) {
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

// ── Trail geometry — ported from the arena "C" candidate's arc-length
// approach so stone placements can NEVER drift from the drawn path (one
// waypoint list drives both the <path> `d` string and every stone centre).
// Catmull-Rom -> cubic Bezier through fixed waypoints, then an arc-length
// sampler so 30 evenly-SPACED (not evenly-parameterised) stone slots never
// bunch up on tight switchbacks. ──

// Summit sits at y=480 (deliberately lower than the arena reference's 385/400
// — see the header-clearance note above LogoLockup) so a two-line growth
// band never collides with the flag: the flag's highest point (pole tip,
// y=370) sits below the header's lowest possible text (the second growth
// line's descenders, ~y=352) with an ~18px margin. See
// ProgressCardSVG.geometry.test.js for the automated regression guard.
const TRAIL_WAYPOINTS = [
  { x: 860, y: 1000 }, // base — bottom-right, clear of the questions chip
                       // (bottom-left) and the date stamp / footer (bottom-centre)
  { x: 260, y: 840 },
  { x: 860, y: 700 },
  { x: 260, y: 560 },
  { x: 560, y: 480 }, // summit
];

function buildTrailSegments(points, smoothing) {
  const segs = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const c1 = { x: p1.x + (p2.x - p0.x) * smoothing, y: p1.y + (p2.y - p0.y) * smoothing };
    const c2 = { x: p2.x - (p3.x - p1.x) * smoothing, y: p2.y - (p3.y - p1.y) * smoothing };
    segs.push({ p0: p1, c1, c2, p1e: p2 });
  }
  return segs;
}

function trailPathD(segments) {
  const first = segments[0].p0;
  let d = `M ${first.x},${first.y} `;
  for (const s of segments) {
    d += `C ${s.c1.x.toFixed(1)},${s.c1.y.toFixed(1)} ${s.c2.x.toFixed(1)},${s.c2.y.toFixed(1)} ${s.p1e.x.toFixed(1)},${s.p1e.y.toFixed(1)} `;
  }
  return d.trim();
}

function cubicPoint(p0, c1, c2, p1, t) {
  const mt = 1 - t;
  return {
    x: mt * mt * mt * p0.x + 3 * mt * mt * t * c1.x + 3 * mt * t * t * c2.x + t * t * t * p1.x,
    y: mt * mt * mt * p0.y + 3 * mt * mt * t * c1.y + 3 * mt * t * t * c2.y + t * t * t * p1.y,
  };
}

function sampleTrail(segments, stepsPerSeg) {
  const pts = [{ ...segments[0].p0 }];
  const cumLen = [0];
  for (const seg of segments) {
    for (let i = 1; i <= stepsPerSeg; i++) {
      const t = i / stepsPerSeg;
      const pt = cubicPoint(seg.p0, seg.c1, seg.c2, seg.p1e, t);
      const prev = pts[pts.length - 1];
      cumLen.push(cumLen[cumLen.length - 1] + Math.hypot(pt.x - prev.x, pt.y - prev.y));
      pts.push(pt);
    }
  }
  return { pts, cumLen, total: cumLen[cumLen.length - 1] };
}

function pointAtFraction(sampled, f) {
  const target = Math.max(0, Math.min(1, f)) * sampled.total;
  const { cumLen, pts } = sampled;
  for (let i = 0; i < cumLen.length - 1; i++) {
    if (cumLen[i] <= target && target <= cumLen[i + 1]) {
      const span = cumLen[i + 1] - cumLen[i] || 1;
      const localF = (target - cumLen[i]) / span;
      const a = pts[i], b = pts[i + 1];
      return { x: a.x + (b.x - a.x) * localF, y: a.y + (b.y - a.y) * localF };
    }
  }
  return pts[pts.length - 1];
}

const TRAIL_SEGMENTS = buildTrailSegments(TRAIL_WAYPOINTS, 0.22);
const TRAIL_D = trailPathD(TRAIL_SEGMENTS);
const TRAIL_SAMPLE = sampleTrail(TRAIL_SEGMENTS, 48);

// 30 stone slots, evenly spaced by ARC LENGTH (not curve parameter) — inset
// from the very start (0.018) and the summit (0.965) so no stone sits on
// top of the base dot or the flag pole. Exported for the geometry test.
export const STONE_FRACTIONS = Array.from(
  { length: PROGRESS_CARD_WINDOW_DAYS },
  (_, i) => 0.018 + (i * (0.947 / (PROGRESS_CARD_WINDOW_DAYS - 1)))
);

function trailPointAt(fraction) {
  return pointAtFraction(TRAIL_SAMPLE, fraction);
}

// A plain 5-point star polygon — no icon font, no emoji (project convention:
// never use emoji as icons).
function Star({ cx, cy, r, opacity = 1 }) {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.42;
    points.push(`${(cx + Math.cos(angle) * radius).toFixed(1)},${(cy + Math.sin(angle) * radius).toFixed(1)}`);
  }
  return <polygon points={points.join(' ')} fill={PAPER} opacity={opacity} />;
}

// A simple upward-pointing triangle motif for the growth line — pure
// geometry (no emoji, no arrow glyph that can render inconsistently across
// fonts), paired with the literal word "up" in the copy so the delta can
// never be misread as an absolute score, even at a 300px thumbnail.
function UpArrow({ x, y, size = 20 }) {
  const points = `${x},${y - size} ${x + size * 0.85},${y + size * 0.6} ${x - size * 0.85},${y + size * 0.6}`;
  return <polygon points={points} fill={GOOD} />;
}

// The real PrepStep logo lockup: three ascending "staircase" bars (the exact
// hex values and relative proportions of BrandMark in
// src/components/landing/LandingPage.js, scaled up) plus the "PrepStep"
// wordmark, mixed case — not the invented all-caps "PREPSTEP" eyebrow of the
// rejected v1 design.
function LogoLockup({ cx, y }) {
  // Original BrandMark viewBox is 34x34 with three rects; scale factor 2.1
  // gives a ~71x71 mark, matched in weight to the wordmark beside it.
  const s = 2.1;
  const barsWidth = 34 * s;
  const wordmarkGap = 20;
  const wordmarkWidth = 230; // approximate visual width at fontSize 46, kept
                             // purely for horizontal centring of the group
  const groupWidth = barsWidth + wordmarkGap + wordmarkWidth;
  const barsX = cx - groupWidth / 2;
  const textX = barsX + barsWidth + wordmarkGap;

  return (
    <g>
      <rect x={barsX + 1 * s} y={y + 24 * s} width={10 * s} height={9 * s} rx={2.5 * s} fill={LOGO_BLUE} />
      <rect x={barsX + 12 * s} y={y + 15 * s} width={10 * s} height={18 * s} rx={2.5 * s} fill={BRAND} />
      <rect x={barsX + 23 * s} y={y + 4 * s} width={10 * s} height={29 * s} rx={2.5 * s} fill={GOOD} />
      <text
        x={textX} y={y + 24 * s + 9 * s}
        textAnchor="start"
        fontFamily={FONT_STACK}
        fontWeight="800"
        fontSize="46"
        fill={PAPER}
        letterSpacing="-1"
      >
        PrepStep
      </text>
    </g>
  );
}

function StatChip({ x, y, width, value, label, secondLabel }) {
  const height = secondLabel ? 138 : 116;
  return (
    <g>
      <rect
        x={x - width / 2} y={y - height / 2} width={width} height={height} rx={22}
        fill={PAPER} stroke={LINE_2} strokeWidth="2"
      />
      <text
        x={x} y={y - (secondLabel ? 20 : 8)}
        textAnchor="middle"
        fontFamily={FONT_STACK}
        fontWeight="800"
        fontSize="56"
        fill={INK}
        letterSpacing="-1.5"
      >
        {value}
      </text>
      <text
        x={x} y={y + (secondLabel ? 20 : 34)}
        textAnchor="middle"
        fontFamily={FONT_STACK}
        fontWeight="600"
        fontSize="22"
        fill={SLATE}
        letterSpacing="0.3"
      >
        {label}
      </text>
      {secondLabel && (
        <text
          x={x} y={y + 48}
          textAnchor="middle"
          fontFamily={FONT_STACK}
          fontWeight="600"
          fontSize="22"
          fill={SLATE}
          letterSpacing="0.3"
        >
          {secondLabel}
        </text>
      )}
    </g>
  );
}

/**
 * @param {string} firstName - active child's first name
 * @param {number} questionsAnswered
 * @param {number} daysPractised
 * @param {number} topicsExplored
 * @param {string[]} [clickedTopics] - up to 3 topic display names that
 *   crossed a mastery threshold this window (progressCard.js derivation).
 *   Optional — omitted entirely when nothing qualifies.
 * @param {{ subject: string, upPercent: number }} [subjectImprovement] -
 *   at most one subject's relative accuracy improvement. Optional, and (as
 *   a defensive second guard alongside the derivation layer) only ever
 *   rendered when upPercent is a positive number.
 * @param {boolean} [useChildName=true] - name toggle (adversarial review
 *   outcome #5 — a deliberate, previewed disclosure choice, not a default).
 *   false renders "My child" instead of the real name (capitalised: it
 *   opens the title line).
 * @param {Date} [now] - injectable for deterministic testing of the
 *   seasonal title skin and the date stamp.
 */
export default function ProgressCardSVG({
  firstName,
  questionsAnswered,
  daysPractised,
  topicsExplored,
  clickedTopics,
  subjectImprovement,
  useChildName = true,
  now,
}) {
  const displayName = useChildName ? (firstName || 'Your child') : 'My child';
  const title = progressCardTitle(displayName, now ? { now } : undefined);
  const fontSize = titleFontSize(title);
  const dateStamp = progressCardDateStamp(now);

  const clampedDays = Math.max(0, Math.min(PROGRESS_CARD_WINDOW_DAYS, Math.round(Number(daysPractised) || 0)));
  const stones = STONE_FRACTIONS.map((f, i) => ({ ...trailPointAt(f), lit: i < clampedDays, key: i }));
  const lastLitPoint = clampedDays > 0 ? trailPointAt(STONE_FRACTIONS[clampedDays - 1]) : null;

  // Growth band lines — defensive positive-only guard mirrors the
  // derivation layer's guarantee (plan: "positive only, no declines").
  const hasClickedLine = Array.isArray(clickedTopics) && clickedTopics.length > 0;
  const hasImprovementLine = !!subjectImprovement && Number(subjectImprovement.upPercent) > 0;
  const clickedLine = hasClickedLine ? `${joinTopicNames(clickedTopics)} clicked this month` : null;
  const improvementLine = hasImprovementLine
    ? `${subjectImprovement.subject} up ${subjectImprovement.upPercent}% this month`
    : null;
  const growthLineCount = (hasClickedLine ? 1 : 0) + (hasImprovementLine ? 1 : 0);

  // Header block y-positions adapt to how many growth lines there are, so an
  // effort-only card (no growth data) never leaves a visible gap where the
  // band would have been — it shows a quiet tagline in that space instead.
  const growthBandY = growthLineCount === 2 ? [300, 344] : [318];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${CARD_SIZE} ${CARD_SIZE}`}
      width={CARD_SIZE}
      height={CARD_SIZE}
      role="img"
      aria-label={`${title} progress card`}
    >
      <defs>
        {/* The one gradient on the card (dusk sky) — brand purple family
            into the warm horizon token, both real site colours. */}
        <linearGradient id="pcSkyDusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BRAND_NIGHT} />
          <stop offset="40%" stopColor={BRAND_DEEP} />
          <stop offset="70%" stopColor={BRAND} />
          <stop offset="100%" stopColor={WARM} />
        </linearGradient>
      </defs>

      {/* ── Sky ── */}
      <rect x="0" y="0" width={CARD_SIZE} height={CARD_SIZE} fill="url(#pcSkyDusk)" />
      {NIGHT_STARS.map((s, i) => (
        <Star key={`star-${i}`} cx={s.x} cy={s.y} r={s.r} opacity={s.o} />
      ))}

      {/* Warm glow behind the summit — flat layered circles, no filter */}
      <circle cx={560} cy={500} r={240} fill={WARM} opacity={0.14} />
      <circle cx={560} cy={500} r={175} fill={WARM} opacity={0.18} />
      <circle cx={560} cy={500} r={110} fill={WARM} opacity={0.24} />

      {/* ── Mountains — three flat layered ridges, atmospheric perspective ── */}
      <polygon
        fill={BRAND_HAZE}
        points="0,780 150,660 300,720 460,580 560,480 685,575 825,660 965,600 1080,720 1080,1080 0,1080"
      />
      <polygon
        fill={BRAND_DEEP}
        points="0,890 205,765 385,830 565,690 760,770 905,720 1080,830 1080,1080 0,1080"
      />
      <polygon
        fill={BRAND_NIGHT}
        points="0,1030 225,935 425,995 625,920 830,980 1080,935 1080,1080 0,1080"
      />

      {/* ── Trail, stones, current-position marker, summit flag ── */}
      <path d={TRAIL_D} fill="none" stroke={LINE_2} strokeWidth="3" strokeLinecap="round" opacity={0.3} />

      {stones.map((s) => s.lit ? (
        <g key={`stone-${s.key}`} data-role="stone" data-lit="true">
          <circle cx={s.x} cy={s.y} r={19} fill={WARM} opacity={0.22} />
          <circle cx={s.x} cy={s.y} r={10.5} fill={WARM} data-role="stone-core" />
        </g>
      ) : (
        <circle
          key={`stone-${s.key}`} data-role="stone" data-lit="false"
          cx={s.x} cy={s.y} r={8} fill="none" stroke={LINE_2} strokeWidth="2" opacity={0.45}
        />
      ))}

      {lastLitPoint && (
        <g>
          <circle cx={lastLitPoint.x} cy={lastLitPoint.y} r={24} fill="none" stroke={WARM} strokeWidth="3" opacity={0.85} />
          <circle cx={lastLitPoint.x} cy={lastLitPoint.y} r={13} fill={PAPER} />
        </g>
      )}

      {/* Summit flag — the constant destination, regardless of progress.
          Pole tip at y=370, comfortably below the lowest the header text
          can reach (~352 for a two-line growth band) — see the waypoints
          comment above. */}
      <line x1={560} y1={480} x2={560} y2={370} stroke={PAPER} strokeWidth="6" strokeLinecap="round" data-role="flag-pole" />
      <polygon points="560,370 630,391 560,412" fill={WARM} stroke={PAPER} strokeWidth="2.5" strokeLinejoin="round" data-role="flag-pennant" />

      {/* ── Header: real logo lockup, poster-scale name, growth band ── */}
      <LogoLockup cx={MID_X} y={44} />

      <text
        x={MID_X} y="248"
        textAnchor="middle"
        fontFamily={FONT_STACK}
        fontWeight="800"
        fontSize={fontSize}
        fill={PAPER}
        letterSpacing="-1.5"
      >
        {title}
      </text>

      {growthLineCount > 0 ? (
        <>
          {clickedLine && (
            <text
              x={MID_X} y={growthBandY[0]}
              textAnchor="middle"
              fontFamily={FONT_STACK}
              fontWeight="700"
              fontSize="30"
              fill={PAPER}
            >
              {clickedLine}
            </text>
          )}
          {improvementLine && (
            <g>
              {/* Arrow sits just left of the text block. Text is centred at
                  MID_X + 14 (nudged right to leave room for the arrow), so
                  its left edge is roughly (MID_X + 14) - halfWidth, using an
                  ~8.4px-per-character estimate at fontSize 30 — generous
                  enough that the arrow never touches the first glyph. */}
              <UpArrow
                x={MID_X + 14 - (improvementLine.length * 8.4) - 24}
                y={growthBandY[growthBandY.length - 1] - 9}
                size={15}
              />
              <text
                x={MID_X + 14} y={growthBandY[growthBandY.length - 1]}
                textAnchor="middle"
                fontFamily={FONT_STACK}
                fontWeight="700"
                fontSize="30"
                fill={PAPER}
              >
                {improvementLine}
              </text>
            </g>
          )}
        </>
      ) : (
        <text
          x={MID_X} y="318"
          textAnchor="middle"
          fontFamily={FONT_STACK}
          fontWeight="500"
          fontSize="28"
          fill={LOW_TEXT}
        >
          A month of steady effort, one question at a time
        </text>
      )}

      {/* ── Three stat chips, each its own separated container (arena "A"),
          anchored to the part of the scene they represent (arena "C") ── */}
      <StatChip x={172} y={942} width={260} value={formatNumber(questionsAnswered)} label="questions answered" />
      <StatChip
        x={902} y={829} width={256}
        value={formatNumber(clampedDays)}
        label="of the last"
        secondLabel="30 days"
      />
      <StatChip x={788} y={540} width={256} value={formatNumber(topicsExplored)} label="topics explored" />

      {/* ── Quiet self-dating stamp + footer, over the foreground ridge ── */}
      <text
        x={MID_X} y="1012"
        textAnchor="middle"
        fontFamily={FONT_STACK}
        fontWeight="600"
        fontSize="24"
        fill={LOW_TEXT}
        letterSpacing="3"
        opacity={0.85}
      >
        {dateStamp}
      </text>

      <text
        x={MID_X} y={CARD_SIZE - 42}
        textAnchor="middle"
        fontFamily={FONT_STACK}
        fontWeight="600"
        fontSize={FOOTER_FONT_SIZE}
        fill={LOW_TEXT}
        letterSpacing="0.5"
        opacity={0.85}
      >
        prepstep.co.uk/card
      </text>
    </svg>
  );
}

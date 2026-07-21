/**
 * regenerate-distractors.mjs  (benchmark fix #2 — break the Maths middle-value tell)
 *
 * DRY-RUN by default. For each verifiable question, regenerates misconception-based
 * distractors (Oracle catalogue) and reports before/after rank/ladder/length stats.
 * Writes NOTHING unless --apply. --apply does a surgical, all-or-nothing write-back of
 * only the regenerated questions' options+correct fields, gated by a re-parse of the
 * rewritten source (see applyEdits at the foot of this file).
 *
 * Usage: node scripts/data-generation/regenerate-distractors.mjs --topic <key|all> [--samples N] [--apply]
 *
 * ARCHITECTURE (topic-agnostic core + per-topic handlers):
 *  - core: verify-gate loop, greedy rank-balancing selector, plausibility guards,
 *    format-preserving rendering, before/after stats. Shared across all 16 topics.
 *  - TOPIC_HANDLERS[topic] = { verify(q,C) -> operands|null, candidates(ops,C) -> [{name,value}] }
 *    verify() is the INDEPENDENT answer check (recovers operands only if the stored
 *    answer reproduces). candidates() emits misconception values from the catalogue.
 *  - Anything verify() can't confirm is FLAGGED (never touched). Fallback is authoring,
 *    never symmetric perturbation (Codex #6). Selector uses ONLY authentic candidates;
 *    it balances C's rank across the topic greedily (no per-item id-hash — Codex #1).
 *
 * See research/maths-misconception-distractor-catalogue.md for every topic's methods.
 * STATUS: longdivision implemented + proven. Remaining topics = fill in TOPIC_HANDLERS.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..', '..');
const MATHS = path.join(REPO, 'src/questionData/mathsData.js');
// --apply (full `--topic all` run) records exactly which question ids it auto-fixed, so
// the Jest gate test can assert the fix over precisely those questions, and the authoring
// wave knows which remain. Flagged questions = numeric-5-option Qs NOT in this manifest.
const MANIFEST = path.join(REPO, 'scripts/data-generation/fix2-applied-manifest.json');

const args = process.argv.slice(2);
const argOpt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const TOPIC = argOpt('--topic', 'longdivision');
const SAMPLES = parseInt(argOpt('--samples', '12'), 10);
const APPLY = args.includes('--apply');

// ── load bank ───────────────────────────────────────────────────────────────────
// parseSource evals the module text (used both to load the file AND to re-validate the
// rewritten source in memory before --apply writes it to disk).
function parseSource(txt) {
  txt = txt.replace(/^\s*import[^\n]*\n/gm, '');
  txt = txt.replace(/export\s+default\s+(\w+)\s*;?/, 'module.exports = $1;');
  const mod = { exports: {} };
  new Function('module', 'exports', txt)(mod, mod.exports);
  return mod.exports;
}
function loadData(p) { return parseSource(fs.readFileSync(p, 'utf8')); }
const data = loadData(MATHS);
function collectTopic(node, key) {
  const topics = node.topics || node;
  for (const [k, v] of Object.entries(topics)) {
    if (k === key && v && Array.isArray(v.questions)) return v.questions;
    if (v && typeof v === 'object') { const r = collectTopic(v, key); if (r) return r; }
  }
  return null;
}
function allTopicKeys(node, out = []) {
  const topics = node.topics || node;
  for (const [k, v] of Object.entries(topics)) {
    if (v && Array.isArray(v.questions)) out.push(k);
    else if (v && typeof v === 'object') allTopicKeys(v, out);
  }
  return out;
}

// ── shared helpers ──────────────────────────────────────────────────────────────
// A leading '-' may be separated from the digits by a currency symbol ("-£15"), so
// sign detection must not require the '-' to be immediately adjacent to a digit.
function optNum(s) {
  if (typeof s !== 'string') return null;
  if (/\d\s*\/\s*\d/.test(s)) return null;
  const clean = s.replace(/,/g, '');
  const isNeg = /^\s*-/.test(clean);
  const m = clean.match(/\d+(?:\.\d+)?/);
  if (!m) return null;
  const val = parseFloat(m[0]);
  return isNeg ? -val : val;
}
function isCleanNumericOption(s) {
  return /^\s*\D{0,4}-?\d[\d,]*(\.\d+)?\s*\D{0,6}$/.test(String(s).trim()) && !/\d\s*\/\s*\d/.test(s);
}
// Sign is captured OUTSIDE prefix/suffix so it never gets baked into a fixed string —
// fmtNum must derive the sign from each rendered value, not from the correct option's.
function parseFormat(s) {
  const m = s.match(/^-?(\D*?)(\d[\d,]*(?:\.(\d+))?)(\D*)$/);
  if (!m) return null;
  return { prefix: m[1], suffix: m[4], decimals: m[3] ? m[3].length : 0, raw: s };
}
function fmtNum(v, fmt) {
  const neg = v < 0;
  const absV = Math.abs(v);
  const fixed = fmt.decimals > 0 ? absV.toFixed(fmt.decimals) : String(Math.round(absV));
  const withCommas = /,/.test(fmt.raw)
    ? Number(fixed).toLocaleString('en-GB', { minimumFractionDigits: fmt.decimals, maximumFractionDigits: fmt.decimals })
    : fixed;
  return `${neg ? '-' : ''}${fmt.prefix}${withCommas}${fmt.suffix}`;
}
const stemInts = q => (q.question.replace(/,/g, '').match(/\d+/g) || []).map(Number);
const isMeta = q => /estimat|round|approximat|\bchecks?\b|is correct|without (doing|working|calculat)/i.test(q.question);

// ── TOPIC HANDLERS ──────────────────────────────────────────────────────────────
const TOPIC_HANDLERS = {
  // -------- LONG DIVISION (implemented + proven: 88% mid -> 22%, 77% coverage) -----
  longdivision: {
    verify(q, C) {
      if (isMeta(q)) return null;
      const ints = stemInts(q).filter(n => n > 1);
      let best = null;
      for (const N of ints) for (const D of ints) {
        if (N <= D || D <= 1) continue;
        if (N / D === C || Math.floor(N / D) === C || Math.ceil(N / D) === C) {
          if (!best || (N % D === 0 && best.N % best.D !== 0) || N > best.N) best = { N, D };
        }
      }
      return best;
    },
    candidates({ N, D }, C) {
      const floorQ = Math.floor(N / D), r = N - D * floorQ;
      const dropZero = (() => {
        const s = String(Math.round(C));
        if (!s.includes('0')) return null;
        const v = parseInt(s.replace('0', ''), 10);
        return Number.isFinite(v) && v !== C ? v : null;
      })();
      return [
        { name: 'multiplied-not-divided', value: N * D },
        { name: 'subtracted-not-divided', value: N - D },
        { name: 'halved-the-divisor', value: 2 * C },
        { name: 'doubled-the-divisor', value: Math.round(C / 2) },
        { name: 'answered-the-divisor', value: D },
        { name: 'dropped-a-zero', value: dropZero },
        { name: 'ceil-miscount', value: C + 1 },
        { name: 'floor-miscount', value: C - 1 },
        { name: 'gave-remainder', value: r > 1 ? r : null },
        { name: 'place-value-x10', value: C * 10 },
      ];
    },
  },

  // -------- LONG MULTIPLICATION --------------------------------------------------
  longmultiplication: {
    verify(q, C) {
      if (isMeta(q)) return null;
      const ints = stemInts(q).filter(n => n > 1);
      let best = null;
      for (let i = 0; i < ints.length; i++) for (let j = i + 1; j < ints.length; j++) {
        const a = ints[i], b = ints[j];
        if (a * b === C) {
          // prefer the pair with the largest product-of-digit-lengths (the real operands,
          // not an incidental smaller factor pair e.g. a rate that's also a divisor elsewhere)
          if (!best || a * b > best.a * best.b) best = { a, b };
        }
      }
      return best;
    },
    candidates({ a, b }, C) {
      const reverseDigits = n => {
        const r = parseInt(String(n).split('').reverse().join(''), 10);
        return r !== n ? r : null;
      };
      const revB = reverseDigits(b);
      const revA = reverseDigits(a);
      return [
        { name: 'missing-placeholder-zero', value: a * (b % 10) + a * Math.floor(b / 10) },
        { name: 'added-instead-of-multiplied', value: a + b },
        { name: 'only-one-partial-product', value: a * (b % 10) },
        { name: 'multiplier-digits-reversed', value: revB != null ? a * revB : null },
        { name: 'multiplicand-digits-reversed', value: revA != null ? revA * b : null },
        { name: 'carry-error-tens', value: C + 10 },
        { name: 'carry-error-hundreds', value: C - 100 },
        { name: 'decimal-place-x10', value: C * 10 },
        { name: 'decimal-place-div10', value: Math.round(C / 10) },
        { name: 'times-table-slip', value: C - a },
      ];
    },
  },

  // -------- ANGLES & SHAPES --------------------------------------------------------
  // Multiple sub-rules (sum=180/360, isosceles-double, regular-polygon, exterior-
  // theorem, parallel-lines-equal, algebraic coefficient-sum). Try each in turn;
  // the FIRST that independently reproduces C wins (verify-gate).
  anglesshapes: {
    verify(q, C) {
      if (isMeta(q)) return null;
      const text = q.question;
      const nums = (text.match(/(\d+)\s*°/g) || []).map(s => parseInt(s, 10));
      const coeffMatches = [...text.matchAll(/(\d+)\s*([a-zA-Z])\s*°/g)];

      // equilateral triangle: constant 60, no given numbers
      if (/equilateral/i.test(text) && nums.length === 0 && C === 60) return { kind: 'equilateral' };

      // exterior angle theorem: exterior = sum of two interior opposite angles
      if (/exterior/i.test(text) && nums.length === 2) {
        const [a, b] = nums;
        if (Math.abs(a - b) === C) return { kind: 'exterior', E: Math.max(a, b), A: Math.min(a, b) };
      }

      // isosceles: one given (base or apex) -> try double-formula then half-formula
      if (/isosceles/i.test(text) && nums.length === 1) {
        const given = nums[0];
        if (180 - 2 * given === C) return { kind: 'isosceles', given, formula: 'double' };
        const half = (180 - given) / 2;
        if (Number.isInteger(half) && half === C) return { kind: 'isosceles', given, formula: 'half' };
      }

      // regular polygon interior angle
      const polyMatch = text.match(/regular (\w+)/i);
      if (polyMatch) {
        const sidesMap = { triangle: 3, quadrilateral: 4, pentagon: 5, hexagon: 6, heptagon: 7, septagon: 7, octagon: 8, nonagon: 9, decagon: 10 };
        const n = sidesMap[polyMatch[1].toLowerCase()];
        if (n && (n - 2) * 180 / n === C) return { kind: 'polygon', n };
      }

      // algebraic: coefficient*x terms summing to 180 (line/triangle) or 360 (quad)
      if (coeffMatches.length >= 2) {
        const vars = new Set(coeffMatches.map(m => m[2]));
        if (vars.size === 1) {
          const coeffs = coeffMatches.map(m => parseInt(m[1], 10));
          const sumCoeffs = coeffs.reduce((a, b) => a + b, 0);
          const primaryS = /quadrilateral|rhombus/i.test(text) ? 360 : 180;
          if (sumCoeffs > 0 && primaryS / sumCoeffs === C) return { kind: 'algebraic', S: primaryS, coeffs };
          const altS = primaryS === 180 ? 360 : 180;
          if (sumCoeffs > 0 && altS / sumCoeffs === C) return { kind: 'algebraic', S: altS, coeffs };
        }
      }

      // parallel lines: alternate/corresponding angle equals the given angle
      if (/parallel|transversal|corresponding|alternate/i.test(text) && nums.length >= 1 && nums.includes(C)) {
        return { kind: 'parallel', given: C };
      }

      // generic angle-sum: straight line/triangle (180) or point/quadrilateral (360)
      let S = null;
      if (/point/i.test(text)) S = 360;
      else if (/quadrilateral|rhombus|rectangular frame|four angles/i.test(text)) S = 360;
      else if (/triangle/i.test(text)) S = 180;
      else if (/straight line/i.test(text)) S = 180;
      if (S !== null && nums.length >= 1) {
        const sumGiven = nums.reduce((a, b) => a + b, 0);
        if (S - sumGiven === C) return { kind: 'sum', S, given: nums };
      }
      return null;
    },
    candidates(ops, C) {
      switch (ops.kind) {
        case 'sum': {
          const { S, given } = ops;
          const out = [
            { name: 'wrote-the-total', value: S },
            S === 180
              ? { name: 'triangle-used-360-not-180', value: C + 180 }
              : { name: 'quad-used-180-not-360', value: C - 180 },
            { name: 'arithmetic-slip-up', value: C + 10 },
            { name: 'arithmetic-slip-down', value: C - 10 },
            { name: 'arithmetic-slip-down-large', value: C - 20 },
            { name: 'halved-the-total', value: S / 2 },
          ];
          if (given.length > 1) {
            const partial = given.slice(0, -1).reduce((a, b) => a + b, 0);
            out.push({ name: 'forgot-one-given', value: S - partial });
          }
          // confused which angle was asked -> wrote one of the OTHER given angles
          given.forEach((g, i) => out.push({ name: `wrote-given-${i}`, value: g }));
          return out;
        }
        case 'isosceles': {
          const { given, formula } = ops;
          const alt = formula === 'double' ? (180 - given) / 2 : 180 - 2 * given;
          return [
            { name: 'isosceles-wrong-configuration', value: Number.isInteger(alt) ? alt : null },
            { name: 'wrote-the-given', value: given },
            { name: 'arithmetic-slip-up', value: C + 10 },
            { name: 'arithmetic-slip-down', value: C - 10 },
          ];
        }
        case 'polygon': {
          const { n } = ops;
          return [
            { name: 'polygon-gave-sum-not-each', value: C * n },
            { name: 'exterior-interior-swap', value: Math.round(360 / n) },
            { name: 'adjacent-polygon-fewer-sides', value: n > 3 ? Math.round((n - 3) * 180 / (n - 1)) : null },
            { name: 'adjacent-polygon-more-sides', value: Math.round((n - 1) * 180 / (n + 1)) },
          ];
        }
        case 'algebraic': {
          const { S, coeffs } = ops;
          const sumCoeffs = coeffs.reduce((a, b) => a + b, 0);
          const altS = S === 180 ? 360 : 180;
          const out = [
            { name: 'wrong-sum-used', value: altS / sumCoeffs },
            { name: 'arithmetic-slip-up', value: C + 1 },
            { name: 'arithmetic-slip-down', value: C - 1 },
          ];
          if (coeffs.length > 1) {
            const fewer = coeffs.slice(0, -1).reduce((a, b) => a + b, 0);
            if (fewer > 0) out.push({ name: 'forgot-one-term', value: Math.round(S / fewer) });
          }
          return out;
        }
        case 'exterior': {
          const { E, A } = ops;
          return [
            { name: 'wrote-the-exterior', value: E },
            { name: 'wrote-the-given-interior', value: A },
            { name: 'added-instead-of-subtracted', value: E + A },
            { name: 'arithmetic-slip', value: C + 10 },
          ];
        }
        case 'parallel': {
          const { given } = ops;
          return [
            { name: 'supplementary-confusion', value: 180 - given },
            { name: 'arithmetic-slip-up', value: given + 10 },
            { name: 'arithmetic-slip-down', value: given - 10 },
            { name: 'right-angle-guess', value: 90 },
          ];
        }
        case 'equilateral':
          return [
            { name: 'right-angle-confusion', value: 90 },
            { name: 'arithmetic-slip-up', value: 70 },
            { name: 'arithmetic-slip-down', value: 50 },
            { name: 'wrote-45', value: 45 },
          ];
        default:
          return [];
      }
    },
  },

  // -------- AREA & PERIMETER ---------------------------------------------------
  areaperimeter: {
    verify(q, C) {
      if (isMeta(q)) return null;
      const text = q.question;
      const unit = '(?:metres?|meters?|cm|centimetres?|m)?';

      function extractLW(t) {
        let m = t.match(new RegExp(`(\\d+(?:\\.\\d+)?)\\s*${unit}\\s*long.*?(\\d+(?:\\.\\d+)?)\\s*${unit}\\s*wide`, 'is'));
        if (m) return { L: parseFloat(m[1]), W: parseFloat(m[2]) };
        m = t.match(new RegExp(`length of (\\d+(?:\\.\\d+)?)\\s*${unit}.*?width of (\\d+(?:\\.\\d+)?)`, 'is'));
        if (m) return { L: parseFloat(m[1]), W: parseFloat(m[2]) };
        return null;
      }

      // algebraic rectangle: "(coeff)var +/- const" cm and a bare "var = value"
      const algExpr = text.match(/\(\s*(\d*)\s*([a-zA-Z])\s*([+\-])\s*(\d+)\s*\)/);
      const varVal = text.match(/\b([a-zA-Z])\s*=\s*(\d+(?:\.\d+)?)/i);
      if (algExpr && varVal && algExpr[2].toLowerCase() === varVal[1].toLowerCase()) {
        const coeff = algExpr[1] ? parseInt(algExpr[1], 10) : 1;
        const sign = algExpr[3] === '+' ? 1 : -1;
        const k = parseInt(algExpr[4], 10);
        const v = parseFloat(varVal[2]);
        const L = coeff * v + sign * k, W = v;
        if (2 * (L + W) === C) return { kind: 'rect-perimeter', L, W };
        if (L * W === C) return { kind: 'rect-area', L, W };
      }

      // "twice/three times/four times as long as wide" + "width is N"
      const timesMatch = text.match(/(twice|three times|four times) as long as (?:it is )?wide/i);
      if (timesMatch) {
        const factor = { twice: 2, 'three times': 3, 'four times': 4 }[timesMatch[1].toLowerCase()];
        const wm = text.match(/width is (\d+(?:\.\d+)?)/i);
        if (wm) {
          const W = parseFloat(wm[1]), L = factor * W;
          if (2 * (L + W) === C) return { kind: 'rect-perimeter', L, W };
          if (L * W === C) return { kind: 'rect-area', L, W };
        }
      }

      // triangle area: base*height/2
      const tri = text.match(new RegExp(`base of (\\d+(?:\\.\\d+)?)\\s*${unit}.*?height of (\\d+(?:\\.\\d+)?)`, 'is'));
      if (tri && /triangle/i.test(text)) {
        const b = parseFloat(tri[1]), h = parseFloat(tri[2]);
        if (b * h / 2 === C) return { kind: 'triangle-area', b, h };
      }

      // compound shapes: two or three "A x B" dimension pairs -> sum or diff of areas
      const dimPairs = [...text.matchAll(/(\d+(?:\.\d+)?)\s*(?:cm|m)?\s*[×x]\s*(\d+(?:\.\d+)?)\s*(?:cm|m)?/gi)];
      if (dimPairs.length >= 2) {
        const areas = dimPairs.map(m => parseFloat(m[1]) * parseFloat(m[2]));
        const sum = areas.reduce((a, b) => a + b, 0);
        if (sum === C) return { kind: 'compound-sum', areas };
        if (areas.length === 2 && Math.abs(areas[0] - areas[1]) === C) return { kind: 'compound-diff', areas };
      }
      // L-shape "overall" dims (long/wide) minus one cut corner "A x B"
      if (/cut/i.test(text) && dimPairs.length === 1) {
        const overall = extractLW(text);
        if (overall) {
          const cut = parseFloat(dimPairs[0][1]) * parseFloat(dimPairs[0][2]);
          if (overall.L * overall.W - cut === C) return { kind: 'compound-cut', overallArea: overall.L * overall.W, cut };
        }
      }

      const lw = extractLW(text);
      if (lw) {
        const { L, W } = lw;
        if (/sum of its perimeter and area/i.test(text) && 2 * (L + W) + L * W === C) return { kind: 'sum-perim-area', L, W };
        if (/difference/i.test(text) && Math.abs(2 * (L + W) - L * W) === C) return { kind: 'diff-perim-area', L, W };
        if (2 * (L + W) === C) return { kind: 'rect-perimeter', L, W };
        if (L * W === C) return { kind: 'rect-area', L, W };
      }

      // reverse: perimeter + one dimension given -> the other dimension
      const pm = text.match(/perimeter of (\d+(?:\.\d+)?)/i);
      const lenGiven = text.match(/length (?:is|of) (\d+(?:\.\d+)?)/i);
      const widGiven = text.match(/width (?:is|of) (\d+(?:\.\d+)?)/i);
      if (pm && lenGiven && !widGiven) {
        const P = parseFloat(pm[1]), L = parseFloat(lenGiven[1]);
        if (P / 2 - L === C) return { kind: 'rect-from-perimeter', P, given: L };
      }
      if (pm && widGiven && !lenGiven) {
        const P = parseFloat(pm[1]), W = parseFloat(widGiven[1]);
        if (P / 2 - W === C) return { kind: 'rect-from-perimeter', P, given: W };
      }

      // reverse: area + one dimension given -> the other dimension
      const am = text.match(/area of (\d+(?:\.\d+)?)/i);
      if (am && widGiven && !lenGiven) {
        const A = parseFloat(am[1]), W = parseFloat(widGiven[1]);
        if (A / W === C) return { kind: 'rect-from-area', A, given: W };
      }
      if (am && lenGiven && !widGiven) {
        const A = parseFloat(am[1]), L = parseFloat(lenGiven[1]);
        if (A / L === C) return { kind: 'rect-from-area', A, given: L };
      }

      // square: try every number against every side/perimeter/area transform
      if (/square/i.test(text)) {
        const nums = (text.match(/\d+(?:\.\d+)?/g) || []).map(Number).filter(n => n > 0);
        const forms = [
          v => 4 * v, v => v / 4, v => v * v, v => Math.sqrt(v), v => 4 * Math.sqrt(v), v => (v / 4) * (v / 4),
        ];
        for (const num of nums) for (const f of forms) {
          const r = f(num);
          if (Number.isFinite(r) && Math.abs(r - C) < 1e-6) return { kind: 'square', given: num };
        }
      }
      return null;
    },
    candidates(ops, C) {
      switch (ops.kind) {
        case 'rect-perimeter': {
          const { L, W } = ops;
          return [
            { name: 'gave-area-not-perimeter', value: L * W },
            { name: 'forgot-to-double', value: L + W },
            { name: 'added-extra-side', value: L + W + Math.max(L, W) },
            { name: 'unit-slip-x2', value: C * 2 },
            { name: 'arithmetic-slip-up', value: C + 2 },
            { name: 'arithmetic-slip-down', value: C - 2 },
          ];
        }
        case 'rect-area': {
          const { L, W } = ops;
          return [
            { name: 'gave-perimeter-not-area', value: 2 * (L + W) },
            { name: 'added-not-multiplied', value: L + W },
            { name: 'used-length-squared', value: L * L },
            { name: 'used-width-squared', value: W * W },
          ];
        }
        case 'diff-perim-area': {
          const { L, W } = ops;
          return [
            { name: 'gave-perimeter', value: 2 * (L + W) },
            { name: 'gave-area', value: L * W },
            { name: 'added-instead-of-subtracted', value: 2 * (L + W) + L * W },
            { name: 'arithmetic-slip', value: C + 5 },
          ];
        }
        case 'rect-from-perimeter': {
          const { P, given } = ops;
          return [
            { name: 'forgot-to-halve-perimeter', value: P - given },
            { name: 'used-perimeter-as-one-side', value: P - 2 * given },
            { name: 'gave-the-given-again', value: given },
            { name: 'arithmetic-slip-up', value: C + 2 },
            { name: 'arithmetic-slip-down', value: C - 2 },
          ];
        }
        case 'rect-from-area': {
          const { A, given } = ops;
          return [
            { name: 'multiplied-not-divided', value: A * given },
            { name: 'gave-the-given-again', value: given },
            { name: 'arithmetic-slip-up', value: C + 2 },
            { name: 'arithmetic-slip-down', value: C - 2 },
          ];
        }
        case 'square': {
          const { given } = ops;
          return [
            { name: 'gave-the-given-value', value: given },
            { name: 'used-2-sides-not-4', value: 2 * given },
            { name: 'squared-instead', value: given * given },
            { name: 'sqrt-instead', value: Math.sqrt(given) },
          ];
        }
        case 'triangle-area': {
          const { b, h } = ops;
          return [
            { name: 'forgot-to-halve', value: b * h },
            { name: 'used-perimeter-like-sum', value: b + h },
            { name: 'halved-wrong-side', value: b * h / 4 },
            { name: 'arithmetic-slip-up', value: C + 2 },
            { name: 'arithmetic-slip-down', value: C - 2 },
          ];
        }
        case 'compound-sum': {
          const { areas } = ops;
          const out = [
            { name: 'used-first-part-only', value: areas[0] },
            { name: 'arithmetic-slip-up', value: C + 4 },
            { name: 'arithmetic-slip-down', value: C - 4 },
          ];
          if (areas.length > 1) out.push({ name: 'used-second-part-only', value: areas[1] });
          if (areas.length === 2) out.push({ name: 'subtracted-instead-of-added', value: Math.abs(areas[0] - areas[1]) });
          return out;
        }
        case 'compound-diff': {
          const { areas } = ops;
          return [
            { name: 'added-instead-of-subtracted', value: areas[0] + areas[1] },
            { name: 'used-first-part-only', value: areas[0] },
            { name: 'used-second-part-only', value: areas[1] },
            { name: 'arithmetic-slip', value: C + 4 },
          ];
        }
        case 'compound-cut': {
          const { overallArea, cut } = ops;
          return [
            { name: 'forgot-to-cut', value: overallArea },
            { name: 'gave-the-cut-piece', value: cut },
            { name: 'added-the-cut-piece', value: overallArea + cut },
            { name: 'arithmetic-slip', value: C + 4 },
          ];
        }
        case 'sum-perim-area': {
          const { L, W } = ops;
          return [
            { name: 'gave-perimeter-only', value: 2 * (L + W) },
            { name: 'gave-area-only', value: L * W },
            { name: 'arithmetic-slip-up', value: C + 5 },
            { name: 'arithmetic-slip-down', value: C - 5 },
          ];
        }
        default:
          return [];
      }
    },
  },

  // -------- PERCENTAGES ---------------------------------------------------------
  // Try every (percent, base-number) combination against every standard percentage
  // formula; the one that reproduces C wins. Mirrors the "square" try-all-transforms
  // trick — cheaper than hand-parsing every phrasing variant.
  percentages: {
    verify(q, C) {
      if (isMeta(q)) return null;
      const text = q.question;
      const pctMatches = [...text.matchAll(/(\d+(?:\.\d+)?)\s*%/g)];
      const pcts = pctMatches.map(m => parseFloat(m[1]));
      const consumed = new Set(pctMatches.map(m => m.index));
      const plainNums = [...text.matchAll(/\d+(?:\.\d+)?/g)].filter(m => !consumed.has(m.index)).map(m => parseFloat(m[0]));

      const tries = [];
      for (const P of pcts) for (const B of plainNums) {
        tries.push({ name: 'pct-of', value: (P / 100) * B, P, B });
        tries.push({ name: 'decrease', value: B * (1 - P / 100), P, B });
        tries.push({ name: 'increase', value: B * (1 + P / 100), P, B });
        tries.push({ name: 'reverse-from-decrease', value: B / (1 - P / 100), P, B });
        tries.push({ name: 'reverse-from-increase', value: B / (1 + P / 100), P, B });
        tries.push({ name: 'complement-of', value: ((100 - P) / 100) * B, P, B });
      }
      if (pcts.length >= 2) for (const B of plainNums) {
        tries.push({ name: 'compound-decrease', value: B * (1 - pcts[0] / 100) * (1 - pcts[1] / 100), P: pcts, B });
      }
      for (let i = 0; i < plainNums.length; i++) for (let j = 0; j < plainNums.length; j++) {
        if (i === j) continue;
        const N = plainNums[i], M = plainNums[j];
        if (M > 0 && N <= M) tries.push({ name: 'pct-as-answer', value: (N / M) * 100, N, M });
      }
      for (const P of pcts) tries.push({ name: 'complement-pct', value: 100 - P, P });

      return tries.find(t => Number.isFinite(t.value) && Math.abs(t.value - C) < 1e-6) || null;
    },
    candidates(ops, C) {
      const step = C < 20 ? 2 : 5;
      switch (ops.name) {
        case 'pct-of': {
          const { P, B } = ops;
          return [
            { name: 'complement-confusion', value: ((100 - P) / 100) * B },
            { name: 'forgot-divide-100', value: P * B },
            { name: 'percentage-as-divisor', value: B / P },
            { name: 'arithmetic-slip-up', value: C + step },
            { name: 'arithmetic-slip-down', value: C - step },
          ];
        }
        case 'decrease': {
          const { P, B } = ops;
          return [
            { name: 'gave-original-price', value: B },
            { name: 'gave-discount-not-final', value: B * P / 100 },
            { name: 'increase-decrease-swapped', value: B * (1 + P / 100) },
            { name: 'arithmetic-slip-up', value: C + step },
            { name: 'arithmetic-slip-down', value: C - step },
          ];
        }
        case 'increase': {
          const { P, B } = ops;
          return [
            { name: 'gave-original-price', value: B },
            { name: 'gave-increase-amount', value: B * P / 100 },
            { name: 'increase-decrease-swapped', value: B * (1 - P / 100) },
            { name: 'arithmetic-slip-up', value: C + step },
            { name: 'arithmetic-slip-down', value: C - step },
          ];
        }
        case 'reverse-from-decrease': {
          const { P, B } = ops;
          return [
            { name: 'gave-discounted-price-again', value: B },
            { name: 'applied-pct-to-discounted-price', value: B * (1 + P / 100) },
            { name: 'doubled-the-adjustment', value: B * (1 + 2 * P / 100) },
            { name: 'arithmetic-slip-up', value: C + step },
            { name: 'arithmetic-slip-down', value: C - step },
          ];
        }
        case 'reverse-from-increase': {
          const { P, B } = ops;
          return [
            { name: 'gave-increased-price-again', value: B },
            { name: 'applied-pct-to-increased-price', value: B * (1 - P / 100) },
            { name: 'doubled-the-adjustment', value: B * (1 - 2 * P / 100) },
            { name: 'arithmetic-slip-up', value: C + step },
            { name: 'arithmetic-slip-down', value: C - step },
          ];
        }
        case 'complement-of': {
          const { P, B } = ops;
          return [
            { name: 'used-given-percent-not-complement', value: (P / 100) * B },
            { name: 'forgot-divide-100', value: (100 - P) * B },
            { name: 'arithmetic-slip-up', value: C + step },
            { name: 'arithmetic-slip-down', value: C - step },
          ];
        }
        case 'compound-decrease': {
          const { P, B } = ops;
          return [
            { name: 'single-discount-only', value: B * (1 - P[0] / 100) },
            { name: 'summed-percentages', value: B * (1 - (P[0] + P[1]) / 100) },
            { name: 'arithmetic-slip-up', value: C + step },
            { name: 'arithmetic-slip-down', value: C - step },
          ];
        }
        case 'pct-as-answer': {
          const { N, M } = ops;
          return [
            { name: 'swapped-numerator-denominator', value: M > 0 ? (M / N) * 100 : null },
            { name: 'gave-count-not-percentage', value: N },
            { name: 'complement', value: 100 - C },
            { name: 'arithmetic-slip-up', value: C + step },
            { name: 'arithmetic-slip-down', value: C - step },
          ];
        }
        case 'complement-pct': {
          const { P } = ops;
          return [
            { name: 'gave-given-percent-again', value: P },
            { name: 'arithmetic-slip-up', value: C + step },
            { name: 'arithmetic-slip-down', value: C - step },
            { name: 'half-of-given', value: P / 2 },
          ];
        }
        default:
          return [];
      }
    },
  },

  // -------- DECIMALS -------------------------------------------------------------
  // Diverse operation types (sum/diff/product/quotient/unit-conversion/rounding),
  // few keyword sub-patterns worth hand-parsing -> try every number-pair op + every
  // per-number unary transform; first exact match to C wins (verify-gate).
  decimals: {
    verify(q, C) {
      if (isMeta(q)) return null;
      const text = q.question;
      const fractionVals = [...text.matchAll(/(\d+)\s*\/\s*(\d+)/g)].map(m => parseInt(m[1], 10) / parseInt(m[2], 10));
      const nums = (text.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
      if (/\bhalf\b/i.test(text)) nums.push(0.5);
      const pool = [...nums, ...fractionVals];

      const tries = [];
      for (let i = 0; i < pool.length; i++) for (let j = 0; j < pool.length; j++) {
        if (i === j) continue;
        const a = pool[i], b = pool[j];
        tries.push({ name: 'sum', value: a + b, a, b });
        tries.push({ name: 'diff', value: Math.abs(a - b), a, b });
        tries.push({ name: 'product', value: a * b, a, b });
        if (b !== 0) tries.push({ name: 'quotient', value: a / b, a, b });
      }
      for (const a of nums) {
        tries.push({ name: 'x1000', value: a * 1000, a });
        tries.push({ name: 'x100', value: a * 100, a });
        tries.push({ name: 'div1000', value: a / 1000, a });
        tries.push({ name: 'div100', value: a / 100, a });
        tries.push({ name: 'round1dp', value: Math.round(a * 10) / 10, a });
        tries.push({ name: 'round2dp', value: Math.round(a * 100) / 100, a });
      }
      return tries.find(t => Number.isFinite(t.value) && Math.abs(t.value - C) < 1e-9) || null;
    },
    candidates(ops, C) {
      switch (ops.name) {
        case 'sum': {
          const { a, b } = ops;
          return [
            { name: 'gave-one-addend', value: a },
            { name: 'gave-other-addend', value: b },
            { name: 'subtracted-instead', value: Math.abs(a - b) },
            { name: 'decimal-point-slip-up', value: C * 10 },
            { name: 'decimal-point-slip-down', value: C / 10 },
          ];
        }
        case 'diff': {
          const { a, b } = ops;
          return [
            { name: 'added-instead', value: a + b },
            { name: 'gave-minuend', value: Math.max(a, b) },
            { name: 'gave-subtrahend', value: Math.min(a, b) },
            { name: 'decimal-point-slip-up', value: C * 10 },
            { name: 'decimal-point-slip-down', value: C / 10 },
          ];
        }
        case 'product': {
          const { a, b } = ops;
          return [
            { name: 'added-not-multiplied', value: a + b },
            { name: 'gave-one-factor', value: a },
            { name: 'decimal-point-slip-up', value: C * 10 },
            { name: 'decimal-point-slip-down', value: C / 10 },
          ];
        }
        case 'quotient': {
          const { a, b } = ops;
          return [
            { name: 'multiplied-not-divided', value: a * b },
            { name: 'gave-dividend', value: a },
            { name: 'inverted-division', value: a !== 0 ? b / a : null },
            { name: 'decimal-point-slip-up', value: C * 10 },
            { name: 'decimal-point-slip-down', value: C / 10 },
          ];
        }
        case 'x1000': {
          const { a } = ops;
          return [
            { name: 'used-x100-not-x1000', value: a * 100 },
            { name: 'gave-original-value', value: a },
            { name: 'used-div-not-mult', value: a / 1000 },
            { name: 'arithmetic-slip', value: C + 10 },
          ];
        }
        case 'x100': {
          const { a } = ops;
          return [
            { name: 'used-x1000-not-x100', value: a * 1000 },
            { name: 'gave-original-value', value: a },
            { name: 'used-div-not-mult', value: a / 100 },
            { name: 'arithmetic-slip', value: C + 1 },
          ];
        }
        case 'div1000': {
          const { a } = ops;
          return [
            { name: 'used-div100-not-div1000', value: a / 100 },
            { name: 'gave-original-value', value: a },
            { name: 'used-mult-not-div', value: a * 1000 },
          ];
        }
        case 'div100': {
          const { a } = ops;
          return [
            { name: 'used-div1000-not-div100', value: a / 1000 },
            { name: 'gave-original-value', value: a },
            { name: 'used-mult-not-div', value: a * 100 },
          ];
        }
        case 'round1dp': {
          const { a } = ops;
          const floor1 = Math.floor(a * 10) / 10, ceil1 = Math.ceil(a * 10) / 10;
          return [
            { name: 'gave-unrounded', value: a },
            { name: 'rounded-wrong-direction', value: floor1 === C ? ceil1 : floor1 },
            { name: 'rounded-2dp-instead', value: Math.round(a * 100) / 100 },
            { name: 'truncated', value: Math.trunc(a * 10) / 10 },
          ];
        }
        case 'round2dp': {
          const { a } = ops;
          return [
            { name: 'gave-unrounded', value: a },
            { name: 'rounded-1dp-instead', value: Math.round(a * 10) / 10 },
            { name: 'truncated', value: Math.trunc(a * 100) / 100 },
            { name: 'arithmetic-slip', value: C + 0.01 },
          ];
        }
        default:
          return [];
      }
    },
  },

  // -------- PLACE VALUE ----------------------------------------------------------
  placevalue: {
    verify(q, C) {
      if (isMeta(q)) return null;
      const text = q.question;
      const mainNumMatch = text.match(/[\d][\d,]*(?:\.\d+)?/);
      const nums = (text.match(/[\d][\d,]*(?:\.\d+)?/g) || []).map(s => parseFloat(s.replace(/,/g, '')));

      // "value of the digit D" / "digit D represent"
      let m = text.match(/value of (?:the )?digit (\d)/i) || text.match(/digit (\d).*?represent/i);
      if (m && mainNumMatch) {
        const digit = m[1];
        const N = mainNumMatch[0].replace(/,/g, '');
        const idx = N.lastIndexOf(digit);
        if (idx !== -1) {
          const placeValue = parseInt(digit, 10) * Math.pow(10, N.length - 1 - idx);
          if (placeValue === C) return { kind: 'digit-value', digit: parseInt(digit, 10), position: N.length - 1 - idx };
        }
      }

      // "which digit is in the tens/hundreds/... place"
      const placeNames = { units: 0, ones: 0, tens: 1, hundreds: 2, thousands: 3, 'ten thousands': 4, 'tens of thousands': 4 };
      const pm = text.match(/(units?|ones|tens|hundreds|thousands|ten thousands|tens of thousands) place/i);
      if (pm && mainNumMatch) {
        const power = placeNames[pm[1].toLowerCase()];
        if (power !== undefined) {
          const N = mainNumMatch[0].replace(/,/g, '');
          const digitAt = Math.floor(parseInt(N, 10) / Math.pow(10, power)) % 10;
          if (digitAt === C) return { kind: 'digit-at-place', N, power };
        }
      }

      // rounding: "round to the nearest ten/hundred/thousand"
      const roundMatch = text.match(/nearest (ten|hundred|thousand)/i);
      if (roundMatch && mainNumMatch) {
        const unit = { ten: 10, hundred: 100, thousand: 1000 }[roundMatch[1].toLowerCase()];
        const N = parseFloat(mainNumMatch[0].replace(/,/g, ''));
        if (Math.round(N / unit) * unit === C) return { kind: 'rounding', N, unit };
      }

      // simple delta add/subtract (exactly 2 numbers in the stem)
      if (nums.length === 2) {
        const [a, b] = nums;
        if (a + b === C) return { kind: 'add-delta', a, b };
        if (a - b === C) return { kind: 'sub-delta', a, b };
        if (b - a === C) return { kind: 'sub-delta', a: b, b: a };
      }

      // halfway between two values
      if (/halfway|midway/i.test(text) && nums.length >= 1 && nums[0] / 2 === C) {
        return { kind: 'half', N: nums[0] };
      }
      return null;
    },
    candidates(ops, C) {
      switch (ops.kind) {
        case 'digit-value': {
          const { digit, position } = ops;
          const unit = Math.pow(10, position);
          return [
            { name: 'gave-the-digit-itself', value: digit },
            { name: 'adjacent-place-up', value: digit * Math.pow(10, position + 1) },
            { name: 'adjacent-place-down', value: position > 0 ? digit * Math.pow(10, position - 1) : null },
            { name: 'arithmetic-slip-up', value: C + unit },
            { name: 'arithmetic-slip-down', value: C - unit > 0 ? C - unit : null },
            { name: 'misread-digit-plus-one', value: (digit + 1) * unit },
            { name: 'misread-digit-minus-one', value: digit > 0 ? (digit - 1) * unit : null },
            { name: 'doubled-the-value', value: C * 2 },
          ];
        }
        case 'digit-at-place': {
          const { N, power } = ops;
          const digitAdjUp = Math.floor(parseInt(N, 10) / Math.pow(10, power + 1)) % 10;
          const digitAdjDown = power > 0 ? Math.floor(parseInt(N, 10) / Math.pow(10, power - 1)) % 10 : null;
          return [
            { name: 'adjacent-place-up', value: digitAdjUp },
            { name: 'adjacent-place-down', value: digitAdjDown },
            { name: 'off-by-one', value: (C + 1) % 10 },
            { name: 'off-by-one-down', value: (C + 9) % 10 },
          ];
        }
        case 'rounding': {
          const { N, unit } = ops;
          const roundedWrongPlace = unit === 10 ? Math.round(N / 100) * 100 : Math.round(N / 1000) * 1000;
          const floorU = Math.floor(N / unit) * unit, ceilU = Math.ceil(N / unit) * unit;
          return [
            { name: 'gave-original-value', value: N },
            { name: 'rounded-to-wrong-place', value: roundedWrongPlace },
            { name: 'truncated-not-rounded', value: floorU },
            { name: 'rounded-wrong-direction', value: floorU === C ? ceilU : floorU },
          ];
        }
        case 'add-delta': {
          const { a, b } = ops;
          return [
            { name: 'subtracted-instead', value: Math.abs(a - b) },
            { name: 'gave-original', value: a },
            { name: 'gave-delta-only', value: b },
            { name: 'arithmetic-slip', value: C + 10 },
          ];
        }
        case 'sub-delta': {
          const { a, b } = ops;
          return [
            { name: 'added-instead', value: a + b },
            { name: 'gave-original', value: a },
            { name: 'gave-delta-only', value: b },
            { name: 'arithmetic-slip', value: C - 10 },
          ];
        }
        case 'half': {
          const { N } = ops;
          return [
            { name: 'gave-the-whole', value: N },
            { name: 'doubled-instead', value: N * 2 },
            { name: 'arithmetic-slip-up', value: C + 100 },
            { name: 'arithmetic-slip-down', value: C - 100 },
          ];
        }
        default:
          return [];
      }
    },
  },

  // -------- NEGATIVE NUMBERS ------------------------------------------------------
  negativenumbers: {
    allowNegative: true,
    verify(q, C) {
      if (isMeta(q)) return null;
      const text = q.question;
      // "-3°C"/"-£12" style: sign may be separated from digits by a currency symbol
      function extractSignedNums(t) {
        const negMatches = [...t.matchAll(/-£?(\d+(?:\.\d+)?)/g)];
        const negSpans = negMatches.map(m => [m.index, m.index + m[0].length]);
        const negVals = negMatches.map(m => -parseFloat(m[1]));
        const allNumMatches = [...t.matchAll(/\d+(?:\.\d+)?/g)];
        const posVals = allNumMatches.filter(m => !negSpans.some(([s, e]) => m.index >= s && m.index < e)).map(m => parseFloat(m[0]));
        return [...negVals, ...posVals];
      }
      const nums = extractSignedNums(text);
      const tries = [];
      for (let i = 0; i < nums.length; i++) for (let j = 0; j < nums.length; j++) {
        if (i === j) continue;
        const a = nums[i], b = nums[j];
        tries.push({ name: 'sum', value: a + b, a, b });
        tries.push({ name: 'diff', value: a - b, a, b });
        tries.push({ name: 'absdiff', value: Math.abs(a - b), a, b });
      }
      if (/halfway|midway/i.test(text) && nums.length >= 2) {
        tries.push({ name: 'halfway', value: (nums[0] + nums[1]) / 2, a: nums[0], b: nums[1] });
      }
      return tries.find(t => Number.isFinite(t.value) && Math.abs(t.value - C) < 1e-9) || null;
    },
    candidates(ops, C) {
      switch (ops.name) {
        case 'sum': {
          const { a, b } = ops;
          return [
            { name: 'dropped-the-sign', value: Math.abs(C) },
            { name: 'gave-one-operand', value: a },
            { name: 'gave-other-operand', value: b },
            { name: 'all-positive-calculation', value: Math.abs(a) + Math.abs(b) },
            { name: 'sign-flip', value: -C },
            { name: 'arithmetic-slip', value: C + 1 },
          ];
        }
        case 'diff':
        case 'absdiff': {
          const { a, b } = ops;
          return [
            { name: 'dropped-the-sign', value: Math.abs(C) },
            { name: 'subtraction-reversed', value: -C },
            { name: 'all-positive-calculation', value: Math.abs(a) - Math.abs(b) },
            { name: 'gave-one-operand', value: a },
            { name: 'gave-other-operand', value: b },
            { name: 'arithmetic-slip', value: C + 1 },
          ];
        }
        case 'halfway': {
          const { a, b } = ops;
          return [
            { name: 'gave-one-endpoint', value: a },
            { name: 'gave-other-endpoint', value: b },
            { name: 'dropped-the-sign', value: Math.abs(C) },
            { name: 'arithmetic-slip', value: C + 1 },
          ];
        }
        default:
          return [];
      }
    },
  },

  // -------- VOLUME -----------------------------------------------------------
  volume: {
    verify(q, C) {
      if (isMeta(q)) return null;
      const text = q.question;

      // cube: volume given -> edge (cube root)
      if (/cube\b/i.test(text) && !/cuboid/i.test(text)) {
        const vm = text.match(/volume of (\d+(?:\.\d+)?)/i);
        if (vm) {
          const V = parseFloat(vm[1]);
          const edge = Math.cbrt(V);
          if (Math.abs(Math.round(edge) - edge) < 1e-6 && Math.round(edge) === C) return { kind: 'cube-edge', V };
        }
      }

      // cube & cuboid same volume: "cube has ... edges of E cm ... cuboid is A by B ... height?"
      const edgeMatch = text.match(/edges of (\d+(?:\.\d+)?)\s*cm/i);
      const cuboidDims = text.match(/cuboid is (\d+(?:\.\d+)?)\s*(?:cm)?\s*by\s*(\d+(?:\.\d+)?)/i);
      if (edgeMatch && cuboidDims) {
        const E = parseFloat(edgeMatch[1]);
        const cubeVol = E * E * E;
        const A = parseFloat(cuboidDims[1]), B = parseFloat(cuboidDims[2]);
        if (A * B > 0 && cubeVol / (A * B) === C) return { kind: 'cube-cuboid-compare', cubeVol, A, B, E };
      }

      // cuboid: volume + length + width given -> height
      const volLW = text.match(/volume of (\d+(?:\.\d+)?)\s*cm.*?length of (\d+(?:\.\d+)?)\s*cm.*?width of (\d+(?:\.\d+)?)\s*cm/is);
      if (volLW) {
        const V = parseFloat(volLW[1]), L = parseFloat(volLW[2]), W = parseFloat(volLW[3]);
        if (L * W > 0 && V / (L * W) === C) return { kind: 'cuboid-from-vol-lw', V, L, W };
      }

      // cuboid: volume + base(AxB) given -> height
      const volBase = text.match(/volume of (\d+(?:\.\d+)?)\s*cm.*?base is (\d+(?:\.\d+)?)\s*(?:cm)?\s*by\s*(\d+(?:\.\d+)?)/is);
      if (volBase) {
        const V = parseFloat(volBase[1]), A = parseFloat(volBase[2]), B = parseFloat(volBase[3]);
        if (A * B > 0 && V / (A * B) === C) return { kind: 'cuboid-from-vol-base', V, A, B };
      }

      // cuboid: L,W,H given directly ("X long, Y wide, Z high" or "X by Y by Z")
      let lwh = text.match(/(\d+(?:\.\d+)?)\s*cm\s*long.*?(\d+(?:\.\d+)?)\s*cm\s*wide.*?(\d+(?:\.\d+)?)\s*cm\s*high/is);
      if (!lwh) lwh = text.match(/(\d+(?:\.\d+)?)\s*(?:cm)?\s*by\s*(\d+(?:\.\d+)?)\s*(?:cm)?\s*by\s*(\d+(?:\.\d+)?)\s*(?:cm)?/is);
      if (lwh) {
        const L = parseFloat(lwh[1]), W = parseFloat(lwh[2]), H = parseFloat(lwh[3]);
        const vol = L * W * H;
        if (vol === C) return { kind: 'cuboid-vol-cm3', L, W, H, vol };
        if (vol / 1000 === C) return { kind: 'cuboid-vol-litres', L, W, H, vol };
      }
      return null;
    },
    candidates(ops, C) {
      switch (ops.kind) {
        case 'cube-edge': {
          const { V } = ops;
          return [
            { name: 'divided-by-3', value: V / 3 },
            { name: 'squared-not-cubed', value: C * C },
            { name: 'gave-the-volume', value: V },
            { name: 'off-by-one-up', value: C + 1 },
            { name: 'off-by-one-down', value: C - 1 },
          ];
        }
        case 'cube-cuboid-compare': {
          const { cubeVol, A, B, E } = ops;
          return [
            { name: 'gave-cube-edge-again', value: E },
            { name: 'divided-by-one-dim-only-a', value: A > 0 ? cubeVol / A : null },
            { name: 'divided-by-one-dim-only-b', value: B > 0 ? cubeVol / B : null },
            { name: 'arithmetic-slip-up', value: C + 2 },
            { name: 'arithmetic-slip-down', value: C - 2 },
          ];
        }
        case 'cuboid-from-vol-lw': {
          const { V, L, W } = ops;
          return [
            { name: 'gave-length-again', value: L },
            { name: 'gave-width-again', value: W },
            { name: 'divided-by-length-only', value: L > 0 ? V / L : null },
            { name: 'divided-by-width-only', value: W > 0 ? V / W : null },
            { name: 'arithmetic-slip', value: C + 2 },
          ];
        }
        case 'cuboid-from-vol-base': {
          const { V, A, B } = ops;
          return [
            { name: 'divided-by-a-only', value: A > 0 ? V / A : null },
            { name: 'divided-by-b-only', value: B > 0 ? V / B : null },
            { name: 'arithmetic-slip-up', value: C + 2 },
            { name: 'arithmetic-slip-down', value: C - 2 },
          ];
        }
        case 'cuboid-vol-cm3': {
          const { L, W, H } = ops;
          return [
            { name: 'area-not-volume', value: L * W },
            { name: 'added-dimensions', value: L + W + H },
            { name: 'used-different-face-pair', value: L * H },
            { name: 'off-by-one-multiplication', value: C + L },
          ];
        }
        case 'cuboid-vol-litres': {
          const { vol, L, W, H } = ops;
          return [
            { name: 'area-not-volume-converted', value: (L * W) / 1000 },
            { name: 'different-face-pair-converted', value: (L * H) / 1000 },
            { name: 'wrong-conversion-div100', value: vol / 100 },
            { name: 'arithmetic-slip-up', value: C + 2 },
            { name: 'arithmetic-slip-down', value: C - 2 },
          ];
        }
        default:
          return [];
      }
    },
  },

  // -------- SEQUENCES ----------------------------------------------------------
  sequences: {
    verify(q, C) {
      if (isMeta(q)) return null;
      const text = q.question;

      // explicit "Nth term" question: extract the comma-list + N separately
      const nthMatch = text.match(/(\d+)(?:st|nd|rd|th) term/i);
      if (nthMatch) {
        const N = parseInt(nthMatch[1], 10);
        const seqMatch = text.match(/(?:sequence|pattern)[:\s]*((?:-?\d+(?:\.\d+)?\s*,\s*)+-?\d+(?:\.\d+)?)/i);
        if (seqMatch) {
          const terms = seqMatch[1].split(',').map(s => parseFloat(s.trim()));
          if (terms.length >= 2) {
            const d = terms[1] - terms[0];
            const allArithmetic = terms.every((t, i) => i === 0 || Math.abs((t - terms[i - 1]) - d) < 1e-9);
            if (allArithmetic && terms[0] + (N - 1) * d === C) return { kind: 'nth-term-arithmetic', a1: terms[0], d, N };
          }
        }
        return null;
      }

      // general: every OTHER number in the stem is a given sequence term; C = next term
      const terms = (text.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
      if (terms.length < 3) return null;

      const d = terms[1] - terms[0];
      if (terms.every((t, i) => i === 0 || Math.abs((t - terms[i - 1]) - d) < 1e-9)) {
        if (Math.abs(terms[terms.length - 1] + d - C) < 1e-9) return { kind: 'arithmetic', terms, d };
      }
      if (terms[0] !== 0) {
        const r = terms[1] / terms[0];
        if (terms.every((t, i) => i === 0 || Math.abs(t / terms[i - 1] - r) < 1e-9)) {
          if (Math.abs(terms[terms.length - 1] * r - C) < 1e-6) return { kind: 'geometric', terms, r };
        }
      }
      if (terms.every((t, i) => i < 2 || Math.abs(t - (terms[i - 1] + terms[i - 2])) < 1e-9)) {
        if (Math.abs(terms[terms.length - 1] + terms[terms.length - 2] - C) < 1e-9) return { kind: 'fibonacci', terms };
      }
      if (terms.every(t => t >= 0 && Number.isInteger(Math.sqrt(t)))) {
        const lastRoot = Math.sqrt(terms[terms.length - 1]);
        if ((lastRoot + 1) * (lastRoot + 1) === C) return { kind: 'squares', lastRoot };
      }
      return null;
    },
    candidates(ops, C) {
      switch (ops.kind) {
        case 'nth-term-arithmetic': {
          const { a1, d, N } = ops;
          return [
            { name: 'gave-the-common-difference', value: d },
            { name: 'used-n-not-n-minus-1', value: a1 + N * d },
            { name: 'forgot-first-term', value: N * d },
            { name: 'arithmetic-slip-up', value: C + d },
            { name: 'arithmetic-slip-down', value: C - d },
          ];
        }
        case 'arithmetic': {
          const { terms, d } = ops;
          return [
            { name: 'wrote-the-step-not-term', value: d },
            { name: 'off-by-one-step-up', value: C + d },
            { name: 'off-by-one-step-down', value: C - d },
            { name: 'gave-last-term-again', value: terms[terms.length - 1] },
          ];
        }
        case 'geometric': {
          const { terms, r } = ops;
          const last = terms[terms.length - 1], prev = terms[terms.length - 2];
          return [
            { name: 'added-not-multiplied', value: last + (last - prev) },
            { name: 'gave-the-ratio', value: r },
            { name: 'gave-last-term-again', value: last },
            { name: 'applied-ratio-twice', value: last * r * r },
            { name: 'ratio-plus-one', value: last * (r + 1) },
          ];
        }
        case 'fibonacci': {
          const { terms } = ops;
          const last = terms[terms.length - 1], prev = terms[terms.length - 2];
          return [
            { name: 'gave-last-term-again', value: last },
            { name: 'gave-second-last-again', value: prev },
            { name: 'added-three-terms', value: terms.length >= 3 ? last + prev + terms[terms.length - 3] : null },
            { name: 'arithmetic-slip-up', value: C + 1 },
            { name: 'arithmetic-slip-down', value: C - 1 },
          ];
        }
        case 'squares': {
          const { lastRoot } = ops;
          return [
            { name: 'off-by-one-square', value: lastRoot * lastRoot + 2 * lastRoot },
            { name: 'gave-the-root', value: lastRoot + 1 },
            { name: 'doubled-last', value: lastRoot * lastRoot * 2 },
            { name: 'arithmetic-slip', value: (lastRoot + 1) * (lastRoot + 1) + 1 },
            { name: 'skip-a-square', value: (lastRoot + 2) * (lastRoot + 2) },
          ];
        }
        default:
          return [];
      }
    },
  },

  // -------- ALGEBRA ------------------------------------------------------------
  // No eval/Function — every sub-shape parsed and computed with plain arithmetic.
  algebra: {
    verify(q, C) {
      if (isMeta(q)) return null;
      const text = q.question;

      // chain of named operations applied to an unknown ("thinks of a number,
      // adds 7, gets 15" / "number machine multiplies by 3 then adds 2")
      const opRe = /(?:adds?|add)\s+(\d+(?:\.\d+)?)|(?:subtracts?|subtract|takes? away|take away|minus)\s+(\d+(?:\.\d+)?)|(?:multiplies (?:it )?by|multiplied by|multiply by|times)\s+(\d+(?:\.\d+)?)|(?:divides? by|divided by)\s+(\d+(?:\.\d+)?)|(doubles|is doubled)/gi;
      const ops = [];
      for (const m of text.matchAll(opRe)) {
        if (m[1] != null) ops.push({ op: 'add', k: parseFloat(m[1]) });
        else if (m[2] != null) ops.push({ op: 'sub', k: parseFloat(m[2]) });
        else if (m[3] != null) ops.push({ op: 'mul', k: parseFloat(m[3]) });
        else if (m[4] != null) ops.push({ op: 'div', k: parseFloat(m[4]) });
        else if (m[5] != null) ops.push({ op: 'mul', k: 2 });
      }
      const targetMatch = text.match(/(?:get|gets|to get|output is)\s*(-?\d+(?:\.\d+)?)/i);
      if (ops.length >= 1 && targetMatch) {
        const target = parseFloat(targetMatch[1]);
        let v = target;
        for (let i = ops.length - 1; i >= 0; i--) {
          const { op, k } = ops[i];
          if (op === 'add') v -= k;
          else if (op === 'sub') v += k;
          else if (op === 'mul') v /= k;
          else if (op === 'div') v *= k;
        }
        if (Math.abs(v - C) < 1e-9) return { kind: 'backward-chain', ops, target };
      }

      // direct linear equation: "Ax +/- B = C" (answer format "x = N")
      const eq = text.match(/(\d+)\s*[a-z]\s*([+\-])\s*(\d+)\s*=\s*(-?\d+(?:\.\d+)?)/i);
      if (eq) {
        const A = parseInt(eq[1], 10), sign = eq[2], B = parseInt(eq[3], 10), rhs = parseFloat(eq[4]);
        const x = sign === '+' ? (rhs - B) / A : (rhs + B) / A;
        if (Math.abs(x - C) < 1e-9) return { kind: 'linear-eq', A, sign, B, rhs };
      }

      // substitution: "a = A, b = B ... work out <expr>" (two-term linear or bracketed)
      const assigns = {};
      for (const m of text.matchAll(/\b([a-z])\s*=\s*(-?\d+(?:\.\d+)?)/gi)) assigns[m[1].toLowerCase()] = parseFloat(m[2]);
      const exprClause = text.match(/(?:work out|what is)\s*([^?]+)\?/i);
      if (exprClause && Object.keys(assigns).length >= 1) {
        const expr = exprClause[1];
        let m = expr.match(/(-?\d*)\s*([a-z])\s*([+\-])\s*(-?\d*)\s*([a-z])/i);
        if (m && assigns[m[2].toLowerCase()] !== undefined && assigns[m[5].toLowerCase()] !== undefined) {
          const c1 = m[1] === '' || m[1] === '-' ? (m[1] === '-' ? -1 : 1) : parseFloat(m[1]);
          const c2 = m[4] === '' || m[4] === '-' ? (m[4] === '-' ? -1 : 1) : parseFloat(m[4]);
          const v1 = assigns[m[2].toLowerCase()], v2 = assigns[m[5].toLowerCase()];
          const value = c1 * v1 + (m[3] === '+' ? 1 : -1) * c2 * v2;
          if (Math.abs(value - C) < 1e-9) return { kind: 'two-term-linear', c1, v1, c2, v2, sign: m[3] };
        }
        m = expr.match(/\(\s*([a-z])\s*([+\-])\s*(\d+)\s*\)\s*[×x*]\s*(\d+)/i);
        if (m && assigns[m[1].toLowerCase()] !== undefined) {
          const varVal = assigns[m[1].toLowerCase()], sign = m[2], k = parseInt(m[3], 10), mult = parseInt(m[4], 10);
          const value = (varVal + (sign === '+' ? 1 : -1) * k) * mult;
          if (Math.abs(value - C) < 1e-9) return { kind: 'bracketed-expr', varVal, sign, k, mult };
        }
      }
      return null;
    },
    candidates(ops, C) {
      switch (ops.kind) {
        case 'backward-chain': {
          const { ops: chain, target } = ops;
          const last = chain[chain.length - 1];
          // forgot to reverse the LAST operation (applied it forward instead of undoing it)
          let wrongLast = target;
          if (last.op === 'add') wrongLast = target + last.k;
          else if (last.op === 'sub') wrongLast = target - last.k;
          else if (last.op === 'mul') wrongLast = target * last.k;
          else if (last.op === 'div') wrongLast = target / last.k;
          return [
            { name: 'gave-the-target-again', value: target },
            { name: 'forgot-to-reverse-last-step', value: wrongLast },
            { name: 'arithmetic-slip-up', value: C + 1 },
            { name: 'arithmetic-slip-down', value: C - 1 },
            { name: 'wrong-operation-order', value: target - last.k * 2 },
          ];
        }
        case 'linear-eq': {
          const { A, sign, B, rhs } = ops;
          return [
            { name: 'forgot-to-divide-by-coefficient', value: sign === '+' ? rhs - B : rhs + B },
            { name: 'sign-confusion', value: sign === '+' ? (rhs + B) / A : (rhs - B) / A },
            { name: 'divided-rhs-only', value: rhs / A },
            { name: 'arithmetic-slip-up', value: C + 1 },
            { name: 'arithmetic-slip-down', value: C - 1 },
          ];
        }
        case 'two-term-linear': {
          const { c1, v1, c2, v2, sign } = ops;
          return [
            { name: 'sign-confusion', value: c1 * v1 + (sign === '+' ? -1 : 1) * c2 * v2 },
            { name: 'gave-first-term-only', value: c1 * v1 },
            { name: 'gave-second-term-only', value: c2 * v2 },
            { name: 'added-coefficients-first', value: (c1 + c2) * (v1 + v2) / 2 },
          ];
        }
        case 'bracketed-expr': {
          const { varVal, sign, k, mult } = ops;
          return [
            { name: 'forgot-to-distribute', value: varVal * mult + (sign === '+' ? 1 : -1) * k },
            { name: 'ignored-brackets', value: varVal + (sign === '+' ? 1 : -1) * k * mult },
            { name: 'gave-the-variable-value', value: varVal },
            { name: 'arithmetic-slip', value: (varVal + (sign === '+' ? 1 : -1) * k) * mult + mult },
          ];
        }
        default:
          return [];
      }
    },
  },

  // -------- PRIME NUMBERS & FACTORS -----------------------------------------------
  // Categorical/number-theory topic, not continuous arithmetic — needs its own
  // helper functions (factor count, HCF/LCM, primality) rather than value formulas.
  primenumbersfactors: {
    verify(q, C) {
      if (isMeta(q)) return null;
      const text = q.question;

      function countFactors(n) { let c = 0; for (let i = 1; i * i <= n; i++) if (n % i === 0) c += i * i === n ? 1 : 2; return c; }
      function distinctPrimeFactorCount(n) { let x = n, c = 0; for (let p = 2; p * p <= x; p++) if (x % p === 0) { c++; while (x % p === 0) x /= p; } if (x > 1) c++; return c; }
      function primeFactorsSum(n) { let x = n, s = 0; for (let p = 2; p * p <= x; p++) while (x % p === 0) { s += p; x /= p; } if (x > 1) s += x; return s; }
      function distinctPrimeFactorsSum(n) { let x = n, s = 0; for (let p = 2; p * p <= x; p++) if (x % p === 0) { s += p; while (x % p === 0) x /= p; } if (x > 1) s += x; return s; }
      function gcd(a, b) { while (b) { [a, b] = [b, a % b]; } return a; }
      const hcf = (a, b) => gcd(a, b);
      const lcm = (a, b) => (a * b) / gcd(a, b);
      function isPrime(n) { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
      function countPrimesInRange(a, b) { let c = 0; for (let i = a; i <= b; i++) if (isPrime(i)) c++; return c; }

      let m = text.match(/factors? does (\d+) have/i) || text.match(/how many factors does (\d+)/i) || text.match(/divide exactly into (\d+)/i);
      if (m) { const N = parseInt(m[1], 10); if (countFactors(N) === C) return { kind: 'factor-count', N, distinctPrimeFactorCount }; }

      const boardMatch = text.match(/writes (\d+) on the board/i);
      if (boardMatch && /divide into it/i.test(text)) {
        const N = parseInt(boardMatch[1], 10);
        if (countFactors(N) === C) return { kind: 'factor-count', N, distinctPrimeFactorCount };
      }

      m = text.match(/break (\d+) into its prime factors/i);
      if (m) {
        const N = parseInt(m[1], 10);
        if (primeFactorsSum(N) === C) return { kind: 'prime-factor-sum', N, distinctPrimeFactorsSum };
      }

      m = text.match(/prime numbers? between (\d+) and (\d+)/i);
      if (m) {
        const a = parseInt(m[1], 10), b = parseInt(m[2], 10);
        if (countPrimesInRange(a, b) === C) return { kind: 'prime-count-range', a, b, countPrimesInRange };
      }

      m = text.match(/largest prime number less than (\d+)/i);
      if (m) {
        const N = parseInt(m[1], 10);
        for (let i = N - 1; i >= 2; i--) if (isPrime(i)) { if (i === C) return { kind: 'edge-prime', N }; break; }
      }
      m = text.match(/smallest prime number greater than (\d+)/i);
      if (m) {
        const N = parseInt(m[1], 10);
        for (let i = N + 1; i < N + 1000; i++) if (isPrime(i)) { if (i === C) return { kind: 'edge-prime', N }; break; }
      }

      m = text.match(/Highest Common Factor.*?of (\d+) and (\d+)/i);
      if (m) { const a = parseInt(m[1], 10), b = parseInt(m[2], 10); if (hcf(a, b) === C) return { kind: 'hcf', a, b, lcm: lcm(a, b) }; }
      m = text.match(/Lowest Common Multiple.*?of (\d+) and (\d+)/i);
      if (m) { const a = parseInt(m[1], 10), b = parseInt(m[2], 10); if (lcm(a, b) === C) return { kind: 'lcm', a, b, hcf: hcf(a, b) }; }

      m = text.match(/Highest Common Factor.*?is (\d+).*?Lowest Common Multiple.*?is (\d+)/is);
      if (m) {
        const H = parseInt(m[1], 10), L = parseInt(m[2], 10);
        const knownMatch = text.match(/one (?:of the )?numbers? is (\d+)/i);
        if (knownMatch) {
          const known = parseInt(knownMatch[1], 10);
          if (known > 0 && (H * L) / known === C) return { kind: 'reverse-hcf-lcm', H, L, known };
        }
      }

      m = text.match(/every (\d+) (?:seconds|minutes)?.*?every (\d+) (?:seconds|minutes)/is);
      if (m) { const a = parseInt(m[1], 10), b = parseInt(m[2], 10); if (lcm(a, b) === C) return { kind: 'lcm', a, b, hcf: hcf(a, b) }; }
      m = text.match(/packs of (\d+).*?packs of (\d+)/is);
      if (m && /smallest number/i.test(text)) {
        const a = parseInt(m[1], 10), b = parseInt(m[2], 10);
        if (lcm(a, b) === C) return { kind: 'lcm', a, b, hcf: hcf(a, b) };
      }

      const nums = (text.match(/\d+/g) || []).map(Number);
      if (nums.length === 2 && /(equal|identical|share equally|same number|packs? with the same|groups? with)/i.test(text) && !/every|LCM|Lowest Common Multiple/i.test(text)) {
        const [a, b] = nums;
        if (a > 0 && b > 0 && hcf(a, b) === C) return { kind: 'hcf', a, b, lcm: lcm(a, b) };
      }
      return null;
    },
    candidates(ops, C) {
      switch (ops.kind) {
        case 'factor-count': {
          const { N, distinctPrimeFactorCount } = ops;
          return [
            { name: 'off-by-one-down', value: C - 1 },
            { name: 'off-by-one-up', value: C + 1 },
            { name: 'counted-distinct-primes-only', value: distinctPrimeFactorCount(N) },
            { name: 'doubled-the-count', value: C * 2 },
            { name: 'halved-the-count', value: C % 2 === 0 ? C / 2 : null },
          ];
        }
        case 'prime-factor-sum': {
          const { N, distinctPrimeFactorsSum } = ops;
          return [
            { name: 'gave-n-itself', value: N },
            { name: 'summed-distinct-primes-only', value: distinctPrimeFactorsSum(N) },
            { name: 'arithmetic-slip-up', value: C + 1 },
            { name: 'arithmetic-slip-down', value: C - 1 },
          ];
        }
        case 'prime-count-range': {
          const { a, b, countPrimesInRange } = ops;
          return [
            { name: 'off-by-one-inclusive', value: countPrimesInRange(a - 1, b) },
            { name: 'off-by-one-exclusive', value: countPrimesInRange(a + 1, b) },
            { name: 'gave-total-numbers-not-primes', value: b - a + 1 },
            { name: 'arithmetic-slip', value: C + 1 },
          ];
        }
        case 'edge-prime': {
          const { N } = ops;
          return [
            { name: 'gave-n-itself', value: N },
            { name: 'arithmetic-slip-up', value: C + 2 },
            { name: 'arithmetic-slip-down', value: C - 2 },
            { name: 'off-by-one', value: C + 1 },
          ];
        }
        case 'hcf': {
          const { a, b, lcm } = ops;
          return [
            { name: 'gave-lcm-instead', value: lcm },
            { name: 'gave-product', value: a * b },
            { name: 'gave-smaller-number', value: Math.min(a, b) },
            { name: 'half-the-hcf', value: C % 2 === 0 ? C / 2 : null },
          ];
        }
        case 'lcm': {
          const { a, b, hcf } = ops;
          return [
            { name: 'gave-hcf-instead', value: hcf },
            { name: 'gave-larger-number', value: Math.max(a, b) },
            { name: 'half-the-lcm', value: C % 2 === 0 ? C / 2 : null },
            { name: 'arithmetic-slip-up', value: C + a },
            { name: 'double-the-lcm', value: C * 2 },
          ];
        }
        case 'reverse-hcf-lcm': {
          const { H, L, known } = ops;
          return [
            { name: 'gave-h-again', value: H },
            { name: 'gave-l-again', value: L },
            { name: 'multiplied-instead', value: H * L * known },
            { name: 'arithmetic-slip', value: C + H },
          ];
        }
        default:
          return [];
      }
    },
  },

  // -------- FRACTIONS ------------------------------------------------------------
  fractions: {
    verify(q, C) {
      if (isMeta(q)) return null;
      const text = q.question;
      const fracMatch = text.match(/(\d+)\s*\/\s*(\d+)/);
      if (!fracMatch) return null;
      const P = parseInt(fracMatch[1], 10), Q = parseInt(fracMatch[2], 10);
      if (Q === 0) return null;
      const fracVal = P / Q;

      if (Math.abs(fracVal - C) < 1e-9) return { kind: 'fraction-as-decimal', P, Q };

      const allNums = (text.match(/\d+(?:\.\d+)?/g) || []).map(Number);
      const baseCandidates = allNums.filter(n => n !== P && n !== Q);
      for (const N of baseCandidates) {
        const raw = fracVal * N;
        if (Math.abs(raw - C) < 1e-6) return { kind: 'fraction-of', P, Q, N, scale: 1 };
        if (Math.abs(raw * 100 - C) < 1e-6) return { kind: 'fraction-of', P, Q, N, scale: 100 };
        if (Math.abs(raw * 1000 - C) < 1e-6) return { kind: 'fraction-of', P, Q, N, scale: 1000 };
      }
      return null;
    },
    candidates(ops, C) {
      switch (ops.kind) {
        case 'fraction-as-decimal': {
          const { P, Q } = ops;
          return [
            { name: 'wrote-numerator-as-whole', value: P },
            { name: 'wrote-denominator-as-whole', value: Q },
            { name: 'inverted-fraction', value: P !== 0 ? Q / P : null },
            { name: 'arithmetic-slip', value: Math.round((C + 0.05) * 100) / 100 },
          ];
        }
        case 'fraction-of': {
          const { P, Q, N, scale } = ops;
          return [
            { name: 'gave-one-part-value', value: (N / Q) * scale },
            { name: 'used-complement-fraction', value: ((Q - P) / Q) * N * scale },
            { name: 'flipped-fraction', value: P !== 0 ? (Q / P) * N * scale : null },
            { name: 'gave-n-itself', value: N * scale },
            { name: 'off-by-one-numerator-down', value: P > 1 ? ((P - 1) / Q) * N * scale : null },
            { name: 'off-by-one-numerator-up', value: ((P + 1) / Q) * N * scale },
          ];
        }
        default:
          return [];
      }
    },
  },

  // -------- RATIO ------------------------------------------------------------
  ratio: {
    verify(q, C) {
      if (isMeta(q)) return null;
      const text = q.question;
      const nums = (text.match(/\d+(?:\.\d+)?/g) || []).map(Number);
      const ratioMatch = text.match(/(\d+)\s*:\s*(\d+)/);

      if (ratioMatch) {
        const A = parseInt(ratioMatch[1], 10), B = parseInt(ratioMatch[2], 10);
        const sum = A + B, diff = Math.abs(A - B);
        const others = nums.filter(n => n !== A && n !== B);
        for (const T of others) {
          if (sum > 0 && Math.abs(T * (A / sum) - C) < 1e-6) return { kind: 'ratio-share', A, B, T };
          if (sum > 0 && Math.abs(T * (B / sum) - C) < 1e-6) return { kind: 'ratio-share', A, B, T };
          if (sum > 0 && Math.abs(T * (diff / sum) - C) < 1e-6) return { kind: 'ratio-diff', A, B, T };
        }
        for (const X of others) {
          if (A > 0 && Math.abs(X * (B / A) - C) < 1e-6) return { kind: 'ratio-other-side', A, B, X };
          if (B > 0 && Math.abs(X * (A / B) - C) < 1e-6) return { kind: 'ratio-other-side', A: B, B: A, X };
        }
      }

      // rate/scale cross-multiplication: "A corresponds to B, what corresponds to C" -> c*(b/a)
      for (let i = 0; i < nums.length; i++) for (let j = 0; j < nums.length; j++) for (let k = 0; k < nums.length; k++) {
        if (i === j || j === k || i === k) continue;
        const a = nums[i], b = nums[j], c = nums[k];
        if (a === 0) continue;
        if (Math.abs(c * (b / a) - C) < 1e-6) return { kind: 'cross-mult', a, b, c };
      }
      return null;
    },
    candidates(ops, C) {
      switch (ops.kind) {
        case 'ratio-share': {
          const { A, B, T } = ops;
          const sum = A + B;
          return [
            { name: 'gave-other-share', value: sum > 0 ? T - C : null },
            { name: 'gave-one-part-value', value: sum > 0 ? T / sum : null },
            { name: 'divided-equally', value: T / 2 },
            { name: 'gave-total-again', value: T },
          ];
        }
        case 'ratio-diff': {
          const { A, B, T } = ops;
          const sum = A + B;
          return [
            { name: 'gave-larger-share', value: sum > 0 ? T * (Math.max(A, B) / sum) : null },
            { name: 'gave-smaller-share', value: sum > 0 ? T * (Math.min(A, B) / sum) : null },
            { name: 'gave-total-again', value: T },
            { name: 'arithmetic-slip', value: C + 2 },
          ];
        }
        case 'ratio-other-side': {
          const { A, B, X } = ops;
          return [
            { name: 'inverted-ratio', value: B > 0 ? X * (A / B) : null },
            { name: 'gave-x-again', value: X },
            { name: 'divided-by-sum', value: (A + B) > 0 ? X / (A + B) : null },
            { name: 'arithmetic-slip', value: C + 2 },
          ];
        }
        case 'cross-mult': {
          const { a, b, c } = ops;
          return [
            { name: 'inverted-rate', value: b > 0 ? c * (a / b) : null },
            { name: 'gave-the-rate-again', value: b },
            { name: 'gave-the-target-again', value: c },
            { name: 'added-not-scaled', value: b + c },
          ];
        }
        default:
          return [];
      }
    },
  },

  // -------- SPEED, DISTANCE & TIME ------------------------------------------------
  speeddistancetime: {
    verify(q, C) {
      if (isMeta(q)) return null;
      const text = q.question;

      let m = text.match(/(\d+(?:\.\d+)?)\s*km\/h/i);
      if (m && /metres per second|m\/s/i.test(text)) {
        const kmh = parseFloat(m[1]);
        if (Math.abs(kmh * 5 / 18 - C) < 1e-6) return { kind: 'kmh-to-ms', kmh };
      }

      const legs = [...text.matchAll(/(\d+(?:\.\d+)?)\s*km in\s*(\d+(?:\.\d+)?)\s*hours?/gi)];
      if (legs.length === 2) {
        const d1 = parseFloat(legs[0][1]), t1 = parseFloat(legs[0][2]);
        const d2 = parseFloat(legs[1][1]), t2 = parseFloat(legs[1][2]);
        if (t1 + t2 > 0 && Math.abs((d1 + d2) / (t1 + t2) - C) < 1e-6) return { kind: 'two-leg-avg', d1, t1, d2, t2 };
      }

      function parseTime(str) {
        let mm = str.match(/(\d+)\s*hours?\s*(\d+)\s*minutes?/i);
        if (mm) return { hours: parseInt(mm[1], 10) + parseInt(mm[2], 10) / 60 };
        mm = str.match(/(\d+(?:\.\d+)?)\s*hours?/i);
        if (mm) return { hours: parseFloat(mm[1]) };
        mm = str.match(/(\d+(?:\.\d+)?)\s*minutes?/i);
        if (mm) return { hours: parseFloat(mm[1]) / 60, minutes: parseFloat(mm[1]) };
        mm = str.match(/(\d+(?:\.\d+)?)\s*seconds?/i);
        if (mm) return { hours: parseFloat(mm[1]) / 3600, seconds: parseFloat(mm[1]) };
        return null;
      }
      const distM = text.match(/(\d+(?:\.\d+)?)\s*(km|metres|m)\b/i);
      const speedM = text.match(/(\d+(?:\.\d+)?)\s*(km\/h|m\/s)/i);
      const timeInfo = parseTime(text);

      if (distM && timeInfo && !speedM) {
        const dist = parseFloat(distM[1]);
        if (timeInfo.hours > 0 && Math.abs(dist / timeInfo.hours - C) < 1e-6) return { kind: 'compute-speed', dist, timeHours: timeInfo.hours };
      }
      if (speedM && timeInfo && !distM) {
        const speed = parseFloat(speedM[1]);
        const dist = speedM[2].toLowerCase() === 'm/s' && timeInfo.seconds != null ? speed * timeInfo.seconds : speed * timeInfo.hours;
        if (Math.abs(dist - C) < 1e-6) return { kind: 'compute-distance', speed, timeHours: timeInfo.hours, timeSeconds: timeInfo.seconds };
      }
      if (distM && speedM && !timeInfo) {
        const dist = parseFloat(distM[1]), speed = parseFloat(speedM[1]);
        if (speed > 0) {
          const timeHours = dist / speed;
          if (Math.abs(timeHours - C) < 1e-6) return { kind: 'compute-time', dist, speed, unit: 'hours' };
          if (Math.abs(timeHours * 60 - C) < 1e-6) return { kind: 'compute-time', dist, speed, unit: 'minutes' };
        }
      }
      return null;
    },
    candidates(ops, C) {
      switch (ops.kind) {
        case 'kmh-to-ms': {
          const { kmh } = ops;
          return [
            { name: 'used-3.6-wrong-direction', value: kmh * 3.6 },
            { name: 'divided-by-1000-only', value: kmh / 1000 },
            { name: 'gave-kmh-again', value: kmh },
            { name: 'arithmetic-slip', value: C + 2 },
          ];
        }
        case 'two-leg-avg': {
          const { d1, t1, d2, t2 } = ops;
          return [
            { name: 'averaged-the-speeds', value: (d1 / t1 + d2 / t2) / 2 },
            { name: 'gave-first-leg-speed', value: d1 / t1 },
            { name: 'gave-second-leg-speed', value: d2 / t2 },
            { name: 'total-distance-only', value: d1 + d2 },
          ];
        }
        case 'compute-speed': {
          const { dist, timeHours } = ops;
          return [
            { name: 'multiplied-not-divided', value: dist * timeHours },
            { name: 'gave-distance-again', value: dist },
            { name: 'forgot-time-conversion', value: timeHours !== 0 ? dist / (timeHours * 60) : null },
            { name: 'arithmetic-slip-up', value: C + 5 },
            { name: 'arithmetic-slip-down', value: C - 5 },
          ];
        }
        case 'compute-distance': {
          const { speed, timeHours, timeSeconds } = ops;
          return [
            { name: 'divided-not-multiplied', value: timeHours > 0 ? speed / timeHours : null },
            { name: 'gave-speed-again', value: speed },
            { name: 'forgot-time-conversion', value: timeSeconds != null ? (speed * timeSeconds) / 60 : speed * timeHours * 60 },
            { name: 'arithmetic-slip', value: C + 5 },
          ];
        }
        case 'compute-time': {
          const { dist, speed, unit } = ops;
          return [
            { name: 'multiplied-not-divided', value: dist * speed },
            { name: 'gave-distance-again', value: dist },
            { name: 'gave-speed-again', value: speed },
            { name: 'wrong-unit', value: unit === 'hours' ? C * 60 : C / 60 },
          ];
        }
        default:
          return [];
      }
    },
  },

  // -------- DATA HANDLING ---------------------------------------------------------
  // Chart/graph/table questions need data we don't have — skip, always flagged.
  // But most mean/median/mode/range questions embed the raw dataset in the stem text,
  // which IS fully parseable (better coverage than the catalogue's own estimate).
  datahandling: {
    verify(q, C) {
      if (isMeta(q)) return null;
      const text = q.question;
      if (/chart|graph|table|survey(?:ed)?|pictogram/i.test(text)) return null;

      const wordToNum = { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7 };
      let m = text.match(/mean of (\w+) numbers is (\d+(?:\.\d+)?)/i);
      if (m) {
        const n = wordToNum[m[1].toLowerCase()];
        const meanVal = parseFloat(m[2]);
        const afterMatch = text.match(/numbers are ([^.?]+)/i);
        if (n && afterMatch) {
          const knownNums = (afterMatch[1].match(/\d+(?:\.\d+)?/g) || []).map(Number);
          if (knownNums.length === n - 1) {
            const missing = n * meanVal - knownNums.reduce((a, b) => a + b, 0);
            if (Math.abs(missing - C) < 1e-9) return { kind: 'reverse-mean', n, meanVal, knownNums };
          }
        }
      }

      m = text.match(/mean is (\d+(?:\.\d+)?)/i);
      if (m && /\?/.test(text)) {
        const meanVal = parseFloat(m[1]);
        const listPart = text.split(/if the mean/i)[0];
        const knownNums = (listPart.match(/\d+(?:\.\d+)?/g) || []).map(Number);
        const totalCount = knownNums.length + 1;
        const missing = meanVal * totalCount - knownNums.reduce((a, b) => a + b, 0);
        if (Math.abs(missing - C) < 1e-9) return { kind: 'missing-with-mean', knownNums, meanVal, totalCount };
      }

      const listNums = (text.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
      if (listNums.length >= 3) {
        if (/\bmean\b|\baverage\b/i.test(text)) {
          const mean = listNums.reduce((a, b) => a + b, 0) / listNums.length;
          if (Math.abs(mean - C) < 1e-9) return { kind: 'mean', nums: listNums };
        }
        if (/\bmedian\b/i.test(text)) {
          const sorted = [...listNums].sort((a, b) => a - b);
          const mid = sorted.length / 2;
          const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[Math.floor(mid)];
          if (Math.abs(median - C) < 1e-9) return { kind: 'median', nums: listNums };
        }
        if (/\bmode\b/i.test(text)) {
          const freq = {};
          listNums.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
          const maxFreq = Math.max(...Object.values(freq));
          const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
          if (modes.length === 1 && modes[0] === C) return { kind: 'mode', nums: listNums };
        }
        if (/\brange\b/i.test(text)) {
          const range = Math.max(...listNums) - Math.min(...listNums);
          if (Math.abs(range - C) < 1e-9) return { kind: 'range', nums: listNums };
        }
      }
      return null;
    },
    candidates(ops, C) {
      switch (ops.kind) {
        case 'mean': {
          const { nums } = ops;
          const n = nums.length, sum = nums.reduce((a, b) => a + b, 0);
          const sorted = [...nums].sort((a, b) => a - b);
          const mid = sorted.length / 2;
          const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[Math.floor(mid)];
          return [
            { name: 'gave-the-sum', value: sum },
            { name: 'divided-by-wrong-count-more', value: sum / (n + 1) },
            { name: 'divided-by-wrong-count-fewer', value: n > 1 ? sum / (n - 1) : null },
            { name: 'gave-the-median-instead', value: median },
          ];
        }
        case 'median': {
          const { nums } = ops;
          const n = nums.length, sum = nums.reduce((a, b) => a + b, 0);
          return [
            { name: 'gave-the-mean-instead', value: sum / n },
            { name: 'took-middle-of-unsorted-list', value: nums[Math.floor(n / 2)] },
            { name: 'arithmetic-slip-up', value: C + 1 },
            { name: 'arithmetic-slip-down', value: C - 1 },
          ];
        }
        case 'mode': {
          const { nums } = ops;
          const n = nums.length, sum = nums.reduce((a, b) => a + b, 0);
          const nonModeVal = nums.find(v => v !== C);
          return [
            { name: 'gave-the-mean-instead', value: sum / n },
            { name: 'gave-a-different-value', value: nonModeVal },
            { name: 'gave-the-range-instead', value: Math.max(...nums) - Math.min(...nums) },
            { name: 'arithmetic-slip', value: C + 1 },
          ];
        }
        case 'range': {
          const { nums } = ops;
          return [
            { name: 'gave-the-max', value: Math.max(...nums) },
            { name: 'gave-the-min', value: Math.min(...nums) },
            { name: 'added-instead-of-subtracted', value: Math.max(...nums) + Math.min(...nums) },
            { name: 'arithmetic-slip-up', value: C + 1 },
            { name: 'arithmetic-slip-down', value: C > 1 ? C - 1 : null },
            { name: 'halved-the-range', value: C % 2 === 0 ? C / 2 : null },
          ];
        }
        case 'reverse-mean': {
          const { n, meanVal, knownNums } = ops;
          const sumKnown = knownNums.reduce((a, b) => a + b, 0);
          return [
            { name: 'gave-the-mean-again', value: meanVal },
            { name: 'gave-the-sum-of-known', value: sumKnown },
            { name: 'used-wrong-count-fewer', value: (n - 1) * meanVal - sumKnown },
            { name: 'arithmetic-slip', value: C + 2 },
          ];
        }
        case 'missing-with-mean': {
          const { knownNums, meanVal, totalCount } = ops;
          const sumKnown = knownNums.reduce((a, b) => a + b, 0);
          return [
            { name: 'gave-the-mean-again', value: meanVal },
            { name: 'gave-the-sum-of-known', value: sumKnown },
            { name: 'used-wrong-count', value: (totalCount - 1) * meanVal - sumKnown },
            { name: 'arithmetic-slip', value: C + 2 },
          ];
        }
        default:
          return [];
      }
    },
  },
};

// ── core: plausibility + selection ───────────────────────────────────────────────
function guardPlausible(cands, C, fmt, allowNegative) {
  const dec = fmt ? fmt.decimals : 0;
  const round = v => dec > 0 ? Math.round(v * 10 ** dec) / 10 ** dec : Math.round(v);
  const seen = new Set([C]);
  const out = [];
  for (const c of cands) {
    if (c.value == null || !Number.isFinite(c.value)) continue;
    const v = round(c.value);
    // integer where the answer is integer; distinct; sane magnitude; positive UNLESS
    // this topic legitimately produces negative answers (e.g. negativenumbers)
    if (dec === 0 && !Number.isInteger(v)) continue;
    if (!allowNegative && v <= 0) continue;
    if (allowNegative && v === 0) continue;
    if (v === C || Math.abs(v) > Math.abs(C) * 12 + 12) continue;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push({ name: c.name, value: v, dir: v < C ? 'below' : 'above' });
  }
  return out;
}
const rankTally = [0, 0, 0, 0, 0];
function selectDistractors(cands) {
  const below = cands.filter(c => c.dir === 'below').sort((a, b) => b.value - a.value);
  const above = cands.filter(c => c.dir === 'above').sort((a, b) => a.value - b.value);
  const nb = below.length, na = above.length;
  const achievable = [];
  for (let r = 0; r <= 4; r++) if (r <= nb && 4 - r <= na) achievable.push(r);
  if (!achievable.length) return null;
  achievable.sort((a, b) => rankTally[a] - rankTally[b] || Math.abs(a - 2) - Math.abs(b - 2));
  const r = achievable[0];
  rankTally[r]++;
  return { chosen: [...below.slice(0, r), ...above.slice(0, 4 - r)], targetRank: r };
}

// ── stats ─────────────────────────────────────────────────────────────────────
const rankOf = (vals, cv) => [...vals].sort((a, b) => a - b).findIndex(v => v === cv);
function isLadder(vals) {
  const s = [...vals].sort((a, b) => a - b);
  const g = s.slice(1).map((v, i) => +(v - s[i]).toFixed(6));
  return !g.some(x => x === 0) && g.every(x => Math.abs(x - g[0]) < 1e-9);
}

// ── run one topic ───────────────────────────────────────────────────────────────
function runTopic(topicKey) {
  const questions = collectTopic(data, topicKey);
  const handler = TOPIC_HANDLERS[topicKey];
  const before = { rank: [0, 0, 0, 0, 0], ladder: 0, n: 0 };
  const after = { rank: [0, 0, 0, 0, 0], ladder: 0, n: 0, longest: 0, shortest: 0 };
  let nonNumeric = 0, unverified = 0, tooFew = 0, stuckMid = 0;
  const samples = [];
  const edits = [];
  rankTally.fill(0);

  for (const q of questions) {
    if (!Array.isArray(q.options) || q.options.length !== 5 || typeof q.correct !== 'number') continue;
    const correctStr = q.options[q.correct];
    const C = optNum(correctStr);
    if (C == null) continue;
    const curVals = q.options.map(optNum);
    if (curVals.every(v => v != null)) { before.n++; before.rank[rankOf(curVals, C)]++; if (isLadder(curVals)) before.ladder++; }

    if (!handler) { unverified++; continue; }
    if (!q.options.every(isCleanNumericOption)) { nonNumeric++; continue; }
    const ops = handler.verify(q, C);
    if (!ops) { unverified++; continue; }
    const fmt = parseFormat(correctStr);
    const cands = guardPlausible(handler.candidates(ops, C), C, fmt, !!handler.allowNegative);
    const sel = selectDistractors(cands);
    if (!sel) { tooFew++; continue; }

    const newStrs = [correctStr, ...sel.chosen.map(c => fmtNum(c.value, fmt))];
    const order = [0, 1, 2, 3, 4].sort((a, b) => ((q.id * 31 + a) % 5) - ((q.id * 31 + b) % 5));
    const shuf = order.map(i => newStrs[i]);
    const newCorrect = order.indexOf(0);
    edits.push({ id: q.id, oldOptions: q.options, oldCorrect: q.correct, newOptions: shuf, newCorrect });
    const vals = shuf.map(optNum);
    after.n++;
    const rk = rankOf(vals, C); after.rank[rk]++; if (rk === 2) stuckMid++;
    if (isLadder(vals)) after.ladder++;
    const lens = shuf.map(s => s.length), cl = lens[newCorrect];
    if (cl > Math.max(...lens.filter((_, i) => i !== newCorrect))) after.longest++;
    if (cl < Math.min(...lens.filter((_, i) => i !== newCorrect))) after.shortest++;
    if (samples.length < SAMPLES) samples.push({ id: q.id, q: q.question.slice(0, 60), C, r: sel.targetRank, old: q.options, neu: shuf, m: sel.chosen.map(c => `${c.name}=${c.value}`) });
  }
  return { topicKey, total: questions.length, before, after, nonNumeric, unverified, tooFew, stuckMid, samples, edits, implemented: !!handler };
}

// ── report ──────────────────────────────────────────────────────────────────────
const pct = (x, n) => n ? (100 * x / n).toFixed(1) + '%' : '—';
function report(res) {
  const { topicKey, total, before, after, nonNumeric, unverified, tooFew, stuckMid, samples, implemented } = res;
  console.log(`\n=== ${topicKey}${implemented ? '' : '  (NO HANDLER — all flagged for authoring)'} ===`);
  console.log(`Q ${total} | regenerated ${after.n} (coverage ${pct(after.n, total)}) | flagged: non-numeric ${nonNumeric}, unverified ${unverified}, too-few ${tooFew}`);
  if (!after.n) return;
  console.log(`rank   0(min) 1     2(MID) 3     4(max)`);
  console.log(`BEFORE ${before.rank.map(c => pct(c, before.n).padStart(6)).join(' ')}`);
  console.log(`AFTER  ${after.rank.map(c => pct(c, after.n).padStart(6)).join(' ')}`);
  console.log(`ladder ${pct(before.ladder, before.n)} -> ${pct(after.ladder, after.n)} | length longest ${pct(after.longest, after.n)} shortest ${pct(after.shortest, after.n)} | stuck-mid ${pct(stuckMid, after.n)}`);
  for (const s of samples) {
    console.log(`  #${s.id} ${s.q} (=${s.C}) r${s.r}`);
    console.log(`    OLD [${s.old.join(', ')}]  NEW [${s.neu.join(', ')}]`);
    console.log(`    via ${s.m.join(' | ')}`);
  }
}

// ── APPLY: surgical write-back into mathsData.js ─────────────────────────────────
// Only regenerated questions are touched; flagged ones stay byte-identical. Located by
// topic-span + id (ids repeat across topics); each block is bounded by the NEXT id: so a
// '}' inside a question string can't mislocate. Every edit must match the stored
// options+correct (drift check); the fully-rewritten source must re-parse with unchanged
// question counts and every edit confirmed present — else NOTHING is written. Git (clean
// tree @ a known commit) is the external safety net.
const serOpts = arr => '[' + arr.map(s => JSON.stringify(s)).join(', ') + ']';

function applyEdits(editsByTopic) {
  const src = fs.readFileSync(MATHS, 'utf8');
  const keys = allTopicKeys(data);
  const declOff = {};
  for (const k of keys) {
    const m = new RegExp('\\b' + k + ':\\s*\\{').exec(src);
    if (!m) throw new Error(`APPLY ABORT: topic declaration not found for "${k}"`);
    declOff[k] = m.index;
  }
  const sortedOff = Object.values(declOff).sort((a, b) => a - b);
  const spanEnd = k => { const s = declOff[k]; const nx = sortedOff.find(o => o > s); return nx == null ? src.length : nx; };

  const ranges = []; // absolute {from,to,text} replacements
  let count = 0;
  for (const [topicKey, edits] of Object.entries(editsByTopic)) {
    const s0 = declOff[topicKey], s1 = spanEnd(topicKey);
    const span = src.slice(s0, s1);
    for (const e of edits) {
      const idm = new RegExp(`\\n\\s*id:\\s*${e.id},`).exec(span);
      if (!idm) throw new Error(`APPLY ABORT: ${topicKey} id ${e.id} not found in span`);
      const objStart = s0 + idm.index;
      // block ends at the NEXT question's id: (or the span end) — never at a '}', which
      // could appear inside a question/explanation string.
      const nextIdRe = /\n\s*id:\s*\d+,/g;
      nextIdRe.lastIndex = idm.index + 1;
      const nextm = nextIdRe.exec(span);
      const block = src.slice(objStart, nextm ? s0 + nextm.index : s1);
      // options + correct are each their own line — anchor on \n so prose can't match.
      const om = /\n\s*options:\s*(\[[^\]]*\])/.exec(block);
      if (!om) throw new Error(`APPLY ABORT: ${topicKey} id ${e.id} options literal not found`);
      let curOpts;
      try { curOpts = JSON.parse(om[1]); } catch { throw new Error(`APPLY ABORT: ${topicKey} id ${e.id} options not JSON-parseable`); }
      if (JSON.stringify(curOpts) !== JSON.stringify(e.oldOptions))
        throw new Error(`APPLY ABORT: ${topicKey} id ${e.id} options drift — source ${om[1]} != loaded ${serOpts(e.oldOptions)}`);
      const cm = /\n\s*correct:\s*(\d+)/.exec(block);
      if (!cm) throw new Error(`APPLY ABORT: ${topicKey} id ${e.id} correct literal not found`);
      if (Number(cm[1]) !== e.oldCorrect)
        throw new Error(`APPLY ABORT: ${topicKey} id ${e.id} correct drift — source ${cm[1]} != loaded ${e.oldCorrect}`);
      const oFrom = objStart + om.index + om[0].indexOf(om[1]);
      ranges.push({ from: oFrom, to: oFrom + om[1].length, text: serOpts(e.newOptions) });
      const cFrom = objStart + cm.index + cm[0].indexOf(cm[1]);
      ranges.push({ from: cFrom, to: cFrom + cm[1].length, text: String(e.newCorrect) });
      count++;
    }
  }
  // splice descending so earlier offsets stay valid; refuse overlapping ranges
  ranges.sort((a, b) => b.from - a.from);
  for (let i = 1; i < ranges.length; i++)
    if (ranges[i].to > ranges[i - 1].from) throw new Error('APPLY ABORT: overlapping edit ranges');
  let out = src;
  for (const r of ranges) out = out.slice(0, r.from) + r.text + out.slice(r.to);

  // GATE: rewritten source must re-parse, keep every topic's question count, and every
  // edit must be present exactly as computed — validated in memory BEFORE touching disk.
  let reparsed;
  try { reparsed = parseSource(out); } catch (err) { throw new Error('APPLY ABORT: rewritten source failed to parse — ' + err.message); }
  for (const k of keys) {
    const a = collectTopic(data, k)?.length ?? -1;
    const b = collectTopic(reparsed, k)?.length ?? -2;
    if (a !== b) throw new Error(`APPLY ABORT: question count changed for ${k} (${a} -> ${b})`);
  }
  for (const [topicKey, edits] of Object.entries(editsByTopic)) {
    const byId = new Map(collectTopic(reparsed, topicKey).map(q => [q.id, q]));
    for (const e of edits) {
      const q = byId.get(e.id);
      if (!q || JSON.stringify(q.options) !== JSON.stringify(e.newOptions) || q.correct !== e.newCorrect)
        throw new Error(`APPLY ABORT: post-write mismatch for ${topicKey} id ${e.id}`);
    }
  }
  fs.writeFileSync(MATHS, out, 'utf8');
  console.log(`\n✅ APPLIED ${count} question edits to ${path.relative(REPO, MATHS)} — re-parsed clean, counts unchanged.`);

  // Manifest of auto-fixed ids — only on a full-bank apply (a single-topic apply must not
  // clobber the whole-bank record). Consumed by the Jest gate test + authoring wave.
  if (TOPIC === 'all') {
    const manifest = {};
    for (const [t, edits] of Object.entries(editsByTopic)) manifest[t] = edits.map(e => e.id).sort((a, b) => a - b);
    fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
    console.log(`   wrote ${path.relative(REPO, MANIFEST)} (${count} ids across ${Object.keys(manifest).length} topics).`);
  }
}

const topics = TOPIC === 'all' ? allTopicKeys(data) : [TOPIC];
console.log(`FIX #2 ${APPLY ? 'APPLY' : 'DRY-RUN'} — ${topics.length} topic(s)`);
let sumTotal = 0, sumRegen = 0;
const editsByTopic = {};
for (const t of topics) { const r = runTopic(t); report(r); sumTotal += r.total; sumRegen += r.after.n; if (r.edits && r.edits.length) editsByTopic[t] = r.edits; }
if (topics.length > 1) console.log(`\n== OVERALL auto-fix coverage: ${sumRegen}/${sumTotal} = ${pct(sumRegen, sumTotal)} (rest flagged for authoring wave) ==`);

if (APPLY) applyEdits(editsByTopic);

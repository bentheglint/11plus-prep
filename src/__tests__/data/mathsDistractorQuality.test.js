/**
 * Maths Distractor Quality — Fix #2 gate (benchmark roadmap)
 *
 * Fix #2 broke the Maths "middle-value" answer tell: distractors used to be arithmetic
 * ladders bracketing the correct answer, so the correct value was the MIDDLE of the five
 * options 52.6% of the time (chance is 20%) and children could pick the middle to score
 * far above chance. The fix replaced distractors with authentic child MISCONCEPTIONS, so
 * wrong answers land asymmetrically and the tell dies as a side effect of better pedagogy.
 *
 * This gate guards ONLY the questions that fix #2 actually auto-fixed — recorded in
 * scripts/data-generation/fix2-applied-manifest.json (the other ~60% are honestly flagged
 * for a later authoring wave and still carry the old distractors, so a topic-wide gate
 * would be meaningless until that wave lands). It is complementary to answerPositionBias
 * (which guards the A–E slot of the answer); this guards the VALUE RANK of the answer.
 *
 * If you regenerate distractors, re-run `--topic all --apply` (which rewrites the
 * manifest) and these numbers should stay green.
 */

import fs from 'fs';
import path from 'path';
import mathsData from '../../questionData/mathsData';

const manifest = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'scripts/data-generation/fix2-applied-manifest.json'), 'utf8')
);

// Thresholds: set well clear of the achieved fix (middle 23.3%, worst ladder 4.9%) but far
// below the original tell (middle up to 88%, ladder up to 86%), so real regression trips.
const MAX_MIDDLE_PCT = 35;       // correct-is-middle-value, bank-wide fixed set (was ~52.6%)
const MAX_ANY_RANK_PCT = 35;     // no single value-rank may dominate bank-wide (new-tell guard)
const MAX_TOPIC_LADDER_PCT = 10; // pure arithmetic ladders per topic (was up to 86%)
const MAX_TOPIC_RANK_PCT = 60;   // loose per-topic single-rank cap (catches gross regression)
const MAX_LENGTH_PARITY_PCT = 8; // correct-is-longest / correct-is-shortest

// Minimal numeric parsing, matching the generator's optNum (currency/unit tolerant, and
// deliberately null on fractions like "3/4" so we never mis-rank a non-numeric option).
const optNum = s => {
  if (typeof s !== 'string') return null;
  if (/\d\s*\/\s*\d/.test(s)) return null;
  const clean = s.replace(/,/g, '');
  const isNeg = /^\s*-/.test(clean);
  const m = clean.match(/\d+(?:\.\d+)?/);
  if (!m) return null;
  return isNeg ? -parseFloat(m[0]) : parseFloat(m[0]);
};
const rankOf = (vals, cv) => [...vals].sort((a, b) => a - b).findIndex(v => v === cv);
const isLadder = vals => {
  const s = [...vals].sort((a, b) => a - b);
  const g = s.slice(1).map((v, i) => +(v - s[i]).toFixed(6));
  return !g.some(x => x === 0) && g.every(x => Math.abs(x - g[0]) < 1e-9);
};

function computeStats() {
  const bankRank = [0, 0, 0, 0, 0];
  let bankN = 0, longest = 0, shortest = 0, dupOpt = [], badCorrect = [], missing = [];
  const perTopic = {};
  for (const [topic, ids] of Object.entries(manifest)) {
    const t = mathsData.topics[topic];
    const byId = new Map((t?.questions || []).map(q => [q.id, q]));
    const rank = [0, 0, 0, 0, 0];
    let n = 0, ladder = 0;
    for (const id of ids) {
      const q = byId.get(id);
      if (!q || !Array.isArray(q.options) || q.options.length !== 5 || typeof q.correct !== 'number') {
        missing.push(`${topic}#${id}`);
        continue;
      }
      if (new Set(q.options).size !== 5) dupOpt.push(`${topic}#${id}`);
      if (!(q.correct >= 0 && q.correct <= 4) || optNum(q.options[q.correct]) == null) badCorrect.push(`${topic}#${id}`);
      const vals = q.options.map(optNum);
      if (vals.some(v => v == null)) continue;
      const C = optNum(q.options[q.correct]);
      const rk = rankOf(vals, C);
      rank[rk]++; bankRank[rk]++; n++; bankN++;
      if (isLadder(vals)) ladder++;
      const lens = q.options.map(s => s.length), cl = lens[q.correct];
      if (cl > Math.max(...lens.filter((_, i) => i !== q.correct))) longest++;
      if (cl < Math.min(...lens.filter((_, i) => i !== q.correct))) shortest++;
    }
    perTopic[topic] = { n, ladderPct: n ? 100 * ladder / n : 0, maxRankPct: n ? 100 * Math.max(...rank) / n : 0 };
  }
  return { bankRank, bankN, perTopic, longest, shortest, dupOpt, badCorrect, missing };
}

const S = computeStats();
const pct = (x, n) => n ? (100 * x / n) : 0;

describe('Maths distractor quality (fix #2 gate)', () => {
  it('every manifest id resolves to a numeric 5-option question', () => {
    expect(S.missing).toEqual([]);
    expect(S.bankN).toBeGreaterThan(1000); // ~1344 auto-fixed
  });

  it('no auto-fixed question has duplicate options or an invalid correct index', () => {
    expect(S.dupOpt).toEqual([]);
    expect(S.badCorrect).toEqual([]);
  });

  it('no topic\'s auto-fixed set is an arithmetic ladder above the cap', () => {
    const over = Object.entries(S.perTopic)
      .filter(([, v]) => v.ladderPct > MAX_TOPIC_LADDER_PCT)
      .map(([k, v]) => `${k}: ${v.ladderPct.toFixed(1)}% ladder`);
    if (over.length) console.log(`\nLadder over ${MAX_TOPIC_LADDER_PCT}%:\n${over.join('\n')}\n`);
    expect(over).toEqual([]);
  });

  it('the auto-fixed correct-answer value-rank is near-uniform (middle-value tell broken)', () => {
    const middle = pct(S.bankRank[2], S.bankN);
    const maxAnyRank = Math.max(...S.bankRank.map(c => pct(c, S.bankN)));
    expect(middle).toBeLessThanOrEqual(MAX_MIDDLE_PCT);
    expect(maxAnyRank).toBeLessThanOrEqual(MAX_ANY_RANK_PCT);
  });

  it('no topic\'s auto-fixed set has a single dominant value-rank', () => {
    const over = Object.entries(S.perTopic)
      .filter(([, v]) => v.maxRankPct > MAX_TOPIC_RANK_PCT)
      .map(([k, v]) => `${k}: ${v.maxRankPct.toFixed(1)}%`);
    if (over.length) console.log(`\nDominant value-rank over ${MAX_TOPIC_RANK_PCT}%:\n${over.join('\n')}\n`);
    expect(over).toEqual([]);
  });

  it('length parity preserved (correct answer rarely the longest or shortest option)', () => {
    expect(pct(S.longest, S.bankN)).toBeLessThanOrEqual(MAX_LENGTH_PARITY_PCT);
    expect(pct(S.shortest, S.bankN)).toBeLessThanOrEqual(MAX_LENGTH_PARITY_PCT);
  });

  it('reports the auto-fixed value-rank distribution', () => {
    console.log('\n=== Fix #2 auto-fixed value-rank distribution ===');
    console.log(`  rank:    0(min)  1     2(MID)  3     4(max)`);
    console.log(`  %:       ${S.bankRank.map(c => pct(c, S.bankN).toFixed(1).padStart(5)).join('  ')}`);
    console.log(`  fixed N: ${S.bankN} (target 20% each; middle was ~52.6% before fix #2)\n`);
    expect(true).toBe(true);
  });
});

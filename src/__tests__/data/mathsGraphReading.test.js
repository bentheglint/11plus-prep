/**
 * Maths graph-reading slice — gate for benchmark fix #9a (23 Jul 2026).
 *
 * 40 "read a value off the graph, then compute" questions appended: 27 to
 * datahandling (14 conversion-graph + 13 misleading-graph) and 13 distance-time to
 * speeddistancetime, all reusing the EXISTING LineGraph/BarChart SVG components
 * (showValues:false). Spec: research/maths-9a-graph-reading-spec.md. Authored by the
 * 11+ Oracle, verified by scripts/data-generation/verify-maths9a.mjs + an adversarial
 * pass, inserted by scripts/data-generation/insert-maths9a.mjs.
 *
 * New items live in fixed, contiguous id ranges (appended).
 */

import mathsData from '../../questionData/mathsData';

const DH_RANGE = [224, 250];   // 27 (conversion + misleading)
const SDT_RANGE = [134, 146];  // 13 (distance-time)
const MIN_BANK_TOTAL = 3516; // 3476 + 40; later Maths waves only ADD, so assert >= (this wave's items are pinned by the id-range counts below)
const ALLOWED_COMPONENTS = ['LineGraph', 'BarChart', 'PieChart'];

const inRange = (id, [lo, hi]) => id >= lo && id <= hi;
const dhNew = () => mathsData.topics.datahandling.questions.filter(q => inRange(q.id, DH_RANGE));
const sdtNew = () => mathsData.topics.speeddistancetime.questions.filter(q => inRange(q.id, SDT_RANGE));

function parseNum(raw) {
  if (typeof raw !== 'string') return null;
  const s = raw.trim().replace(/−/g, '-').replace(/^(-?)\s*(?:A\$|US\$|[£$€¥])\s*/, '$1').replace(/,/g, '');
  const m = s.match(/^-?\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

// Parse an x-axis time label to an hour number, clock-aware ("9am","12pm","1pm","1 h","0").
function labelToHour(label) {
  const s = String(label).trim().toLowerCase();
  const ampm = s.match(/^(\d{1,2})\s*(am|pm)$/);
  if (ampm) {
    let h = parseInt(ampm[1], 10) % 12;
    if (ampm[2] === 'pm') h += 12;
    return h;
  }
  const m = s.match(/-?\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

function assertWellFormedGraphItem(q, topicKey) {
  const at = `${topicKey}/Q${q.id}`;
  expect(`${at} hasVisual=${!!q.visual}`).toBe(`${at} hasVisual=true`);
  expect(ALLOWED_COMPONENTS.includes(q.visual.component)).toBe(true);
  expect(`${at} showValues=${q.visual.props.showValues}`).toBe(`${at} showValues=false`);
  const series = q.visual.component === 'BarChart' ? q.visual.props.bars : q.visual.props.data;
  expect(Array.isArray(series) && series.length > 0).toBe(true);
  series.forEach(pt => {
    expect(typeof pt.label === 'string' && Number.isFinite(pt.value)).toBe(true);
  });
  expect(Array.isArray(q.options) && q.options.length === 5).toBe(true);
  expect(`${at} distinct=${new Set(q.options).size}`).toBe(`${at} distinct=5`);
  expect(Number.isInteger(q.correct) && q.correct >= 0 && q.correct <= 4).toBe(true);
  expect(`${at} tick=${/✓\s*$/.test(q.explanation || '')}`).toBe(`${at} tick=true`);
}

describe('Maths graph-reading wave (benchmark fix #9a)', () => {
  it('bank total is at least the expected post-insert size', () => {
    const total = Object.values(mathsData.topics).reduce((a, t) => a + t.questions.length, 0);
    expect(total).toBeGreaterThanOrEqual(MIN_BANK_TOTAL);
  });

  it('appended the expected counts in the id ranges', () => {
    expect(`dh:${dhNew().length}`).toBe('dh:27');
    expect(`sdt:${sdtNew().length}`).toBe('sdt:13');
  });

  it('every new datahandling item is a well-formed graph question', () => {
    dhNew().forEach(q => assertWellFormedGraphItem(q, 'datahandling'));
  });

  it('every new speeddistancetime item is a well-formed graph question', () => {
    sdtNew().forEach(q => assertWellFormedGraphItem(q, 'speeddistancetime'));
  });

  it('distance-time graphs use EVENLY-SPACED time labels (LineGraph x-axis is categorical, so uneven gaps distort slope=speed)', () => {
    const bad = [];
    sdtNew().forEach(q => {
      if (q.visual.component !== 'LineGraph') return;
      const hours = q.visual.props.data.map(d => labelToHour(d.label));
      if (hours.some(h => h === null)) { bad.push(`${q.id}:unparseable`); return; }
      const gaps = hours.slice(1).map((h, i) => +(h - hours[i]).toFixed(3));
      const even = gaps.every(g => Math.abs(g - gaps[0]) < 1e-9);
      if (!even) bad.push(`${q.id}:${JSON.stringify(q.visual.props.data.map(d => d.label))}`);
    });
    expect(bad).toEqual([]);
  });

  it('does NOT reintroduce the middle-value tell across the wave (correct rarely the median)', () => {
    let n = 0, median = 0;
    [...dhNew(), ...sdtNew()].forEach(q => {
      const nums = q.options.map(parseNum);
      if (nums.some(v => v === null)) return;
      const sorted = nums.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
      const rank = sorted.findIndex(x => x.i === q.correct) + 1;
      n += 1;
      if (rank === 3) median += 1;
    });
    expect(n).toBeGreaterThan(30);
    expect(median / n).toBeLessThanOrEqual(0.30);
  });
});

#!/usr/bin/env node
// Verify Maths graph-reading slice (benchmark fix #9a) BEFORE insert.
// Spec: research/maths-9a-graph-reading-spec.md ("Harness" and "Per-item output
// shape" sections). Structure and most checks are copied from
// verify-maths-d3.mjs (benchmark fix #8) — parseNumericOption, the _expr
// char-whitelist + eval, and the anti-ladder rule are byte-for-byte the same
// logic. NEW here: the visual-diagram checks (LineGraph/BarChart/PieChart
// props shape, showValues===false) and the soft _readFromGraph consistency
// check.
//
// Input: JSON file shaped { "<topicKey>": [ item, ... ], ... } where each item
// carries the normal question fields PLUS visual, _expr, _steps, _readFromGraph.
//
// Usage:
//   node scripts/data-generation/verify-maths9a.mjs [path-to-json] [--full] [--strict]
//
// Default path (no arg): the scratchpad maths9a-clean.json for this session.
//
// Exit code: 0 if all per-item hard checks pass (and, under --strict, bank-level
// checks too). Non-zero on any hard fail.

import fs from 'node:fs';
import path from 'node:path';

const SCRATCHPAD = 'C:/Users/benja/AppData/Local/Temp/claude/C--Users-benja-Documents-11plus-prep/849c3908-8662-4ef1-b26e-ed306edeb9f4/scratchpad';

const args = process.argv.slice(2);
const flags = args.filter(a => a.startsWith('--'));
const positional = args.filter(a => !a.startsWith('--'));
const full = flags.includes('--full');
const strict = flags.includes('--strict');
const inputPath = positional[0] || path.join(SCRATCHPAD, 'maths9a-clean.json');

const EXPR_WHITELIST = /^[0-9+\-*/().\s]+$/;
const VALID_COMPONENTS = new Set(['LineGraph', 'BarChart', 'PieChart']);

// ---------- helpers (copied from verify-maths-d3.mjs) ----------

function parseNumericOption(raw) {
  if (typeof raw !== 'string') return null;
  let s = raw.trim();
  s = s.replace(/−/g, '-');            // normalise unicode minus (−) to ASCII hyphen
  s = s.replace(/^(-?)\s*(?:A\$|US\$|NZ\$|C\$|[£$€¥])\s*/, '$1');   // strip a leading currency symbol/prefix (£ $ € ¥ A$ US$…), KEEPING a leading sign ("-£11" -> "-11", "€15" -> "15", "A$90" -> "90")
  s = s.replace(/,/g, '');                   // strip thousand separators
  const m = s.match(/^-?\d+(?:\.\d+)?/);
  if (!m) return null;
  return parseFloat(m[0]);
}

function safeEvalExpr(expr) {
  // Caller MUST have already passed expr through EXPR_WHITELIST.
  // Once whitelisted (only digits, + - * / ( ) . and whitespace remain),
  // Function-constructor eval is safe — there is no way to reach anything
  // other than arithmetic on numeric literals.
  // eslint-disable-next-line no-new-func
  return Function('"use strict"; return (' + expr + ');')();
}

function gapMaxFrequency(gaps, eps = 1e-6) {
  let maxFreq = 0;
  for (let i = 0; i < gaps.length; i++) {
    let freq = 1;
    for (let j = 0; j < gaps.length; j++) {
      if (i !== j && Math.abs(gaps[i] - gaps[j]) < eps) freq++;
    }
    maxFreq = Math.max(maxFreq, freq);
  }
  return maxFreq;
}

function itemLabel(topic, idx, item) {
  const q = (item && typeof item.question === 'string') ? item.question.slice(0, 60) : '(no question text)';
  return `[${topic} #${idx + 1}] "${q}${q.length === 60 ? '…' : ''}"`;
}

// Extract numbers referenced in a free-text string (e.g. "at £4 the line is at
// $6" -> [4, 6]). Report-only helper for the soft READ-OFF consistency check.
function extractNumbers(str) {
  if (typeof str !== 'string') return [];
  const matches = str.match(/-?\d+(?:\.\d+)?/g) || [];
  return matches.map(Number);
}

// ---------- visual checks ----------

function checkVisual(label, visual) {
  const fails = [];
  const warns = [];
  let seriesValues = null; // numeric values in props.data / props.bars, for the soft read-off check

  if (!visual || typeof visual !== 'object' || Array.isArray(visual)) {
    fails.push(`${label}: visual must be an object (got ${Array.isArray(visual) ? 'array' : typeof visual})`);
    return { fails, warns, seriesValues };
  }

  if (!VALID_COMPONENTS.has(visual.component)) {
    fails.push(`${label}: visual.component must be one of ${[...VALID_COMPONENTS].join('/')} (got ${JSON.stringify(visual.component)})`);
    return { fails, warns, seriesValues };
  }

  const props = visual.props;
  if (!props || typeof props !== 'object' || Array.isArray(props)) {
    fails.push(`${label}: visual.props must be an object (got ${Array.isArray(props) ? 'array' : typeof props})`);
    return { fails, warns, seriesValues };
  }

  if (visual.component === 'LineGraph' || visual.component === 'BarChart') {
    const seriesKey = visual.component === 'LineGraph' ? 'data' : 'bars';
    const series = props[seriesKey];
    if (!Array.isArray(series) || series.length === 0) {
      fails.push(`${label}: visual.props.${seriesKey} must be a non-empty array (got ${Array.isArray(series) ? 'empty array' : typeof series})`);
    } else {
      const values = [];
      series.forEach((pt, i) => {
        if (!pt || typeof pt !== 'object') {
          fails.push(`${label}: visual.props.${seriesKey}[${i}] must be an object`);
          return;
        }
        if (typeof pt.label !== 'string' || pt.label.trim().length === 0) {
          fails.push(`${label}: visual.props.${seriesKey}[${i}].label must be a non-empty string (got ${JSON.stringify(pt.label)})`);
        }
        if (typeof pt.value !== 'number' || !Number.isFinite(pt.value)) {
          fails.push(`${label}: visual.props.${seriesKey}[${i}].value must be a finite number (got ${JSON.stringify(pt.value)})`);
        } else {
          values.push(pt.value);
        }
      });
      seriesValues = values;
    }

    if (props.showValues !== false) {
      fails.push(`${label}: visual.props.showValues must be === false for a read-off-the-graph question (got ${JSON.stringify(props.showValues)})`);
    }
  } else if (visual.component === 'PieChart') {
    // PieChart is available but de-prioritised for this slice (spec: "prefer
    // Line/Bar"). Its prop shape (sections/angle) differs from data/bars, so
    // only a soft showValues warning applies here — no hard data-shape check.
    if (props.showValues !== false) {
      warns.push(`${label}: PieChart visual.props.showValues is not === false (got ${JSON.stringify(props.showValues)}) — expected false for read-off questions`);
    }
  }

  return { fails, warns, seriesValues };
}

// ---------- per-item checks ----------

function checkItem(topic, idx, item) {
  const fails = [];
  const warns = [];
  const label = itemLabel(topic, idx, item);

  if (!item || typeof item !== 'object') {
    return { fails: [`${label}: item is not an object`], warns: [], report: {} };
  }

  if (!(Number.isInteger(item.difficulty) && item.difficulty >= 1 && item.difficulty <= 3)) {
    fails.push(`${label}: difficulty must be an integer 1..3 (got ${JSON.stringify(item.difficulty)})`);
  }

  let optionsOk = false;
  if (!Array.isArray(item.options) || item.options.length !== 5) {
    fails.push(`${label}: options must be an array of exactly 5 (got ${Array.isArray(item.options) ? item.options.length : typeof item.options})`);
  } else if (!item.options.every(o => typeof o === 'string')) {
    fails.push(`${label}: all options must be strings`);
  } else {
    const distinct = new Set(item.options);
    if (distinct.size !== 5) {
      fails.push(`${label}: options must all be distinct (got ${JSON.stringify(item.options)})`);
    } else {
      optionsOk = true;
    }
  }

  if (!(Number.isInteger(item.correct) && item.correct >= 0 && item.correct <= 4)) {
    fails.push(`${label}: correct must be an integer 0..4 (got ${JSON.stringify(item.correct)})`);
  }

  if (typeof item.explanation !== 'string' || item.explanation.trim().length === 0) {
    fails.push(`${label}: explanation must be non-empty`);
  } else if (!/✓\s*$/.test(item.explanation)) {
    fails.push(`${label}: explanation must end with ✓ (got: "...${item.explanation.slice(-20)}")`);
  }

  if (typeof item.question !== 'string' || item.question.trim().length === 0) {
    fails.push(`${label}: question must be non-empty`);
  }

  if (!Array.isArray(item._steps) || item._steps.length < 2) {
    fails.push(`${label}: _steps must be an array with length >= 2 (got ${Array.isArray(item._steps) ? item._steps.length : typeof item._steps})`);
  }

  // _expr checks
  let exprValue = null;
  if (typeof item._expr !== 'string' || item._expr.trim().length === 0) {
    fails.push(`${label}: _expr is required`);
  } else if (!EXPR_WHITELIST.test(item._expr)) {
    fails.push(`${label}: _expr fails character whitelist (only 0-9 + - * / ( ) . space allowed): "${item._expr}"`);
  } else {
    try {
      exprValue = safeEvalExpr(item._expr);
      if (typeof exprValue !== 'number' || !Number.isFinite(exprValue)) {
        fails.push(`${label}: _expr did not evaluate to a finite number: "${item._expr}" -> ${exprValue}`);
        exprValue = null;
      }
    } catch (e) {
      fails.push(`${label}: _expr failed to evaluate: "${item._expr}" (${e.message})`);
    }

    if (exprValue !== null && optionsOk && Number.isInteger(item.correct) && item.correct >= 0 && item.correct <= 4) {
      const optionValue = parseNumericOption(item.options[item.correct]);
      if (optionValue === null) {
        fails.push(`${label}: options[correct] "${item.options[item.correct]}" has no parseable number`);
      } else if (Math.abs(exprValue - optionValue) > 1e-6) {
        fails.push(`${label}: _expr value (${exprValue}) does not match options[correct] parsed value (${optionValue}) from "${item.options[item.correct]}"`);
      }
    }
  }

  // Anti-ladder (identical rule to verify-maths-d3.mjs)
  let rankInfo = null;
  if (optionsOk) {
    const parsed = item.options.map(o => parseNumericOption(o));
    if (parsed.some(v => v === null)) {
      warns.push(`${label}: at least one option is non-numeric — skipping anti-ladder check`);
    } else {
      const withIdx = parsed.map((v, i) => ({ v, i }));
      const sorted = [...withIdx].sort((a, b) => a.v - b.v);
      const sortedVals = sorted.map(x => x.v);
      const gaps = [];
      for (let i = 0; i < 4; i++) gaps.push(sortedVals[i + 1] - sortedVals[i]);
      const maxFreq = gapMaxFrequency(gaps);
      let rank = null;
      if (Number.isInteger(item.correct) && item.correct >= 0 && item.correct <= 4) {
        rank = sorted.findIndex(x => x.i === item.correct) + 1; // 1=smallest..5=largest
        rankInfo = rank;
      }
      if (maxFreq === 4) {
        fails.push(`${label}: ANTI-LADDER — constant gap across all 4 steps: gaps=${JSON.stringify(gaps)} (sorted values ${JSON.stringify(sortedVals)})`);
      } else if (maxFreq >= 3) {
        if (rank === 3) {
          fails.push(`${label}: ANTI-LADDER — near-constant gap with correct at the MEDIAN: gaps=${JSON.stringify(gaps)} (sorted values ${JSON.stringify(sortedVals)})`);
        } else {
          warns.push(`${label}: near-constant gap (>=3 of 4 equal) but correct is at rank ${rank} (not median) — allowed: gaps=${JSON.stringify(gaps)}`);
        }
      }
    }
  }

  // Visual checks
  const { fails: visualFails, warns: visualWarns, seriesValues } = checkVisual(label, item.visual);
  fails.push(...visualFails);
  warns.push(...visualWarns);

  // READ-OFF consistency (soft — report only, per spec: "graphs can reference
  // computed values" so a miss here is a warning, not a hard fail).
  if (typeof item._readFromGraph !== 'string' || item._readFromGraph.trim().length === 0) {
    fails.push(`${label}: _readFromGraph must be a non-empty string`);
  } else if (seriesValues && seriesValues.length) {
    const referenced = extractNumbers(item._readFromGraph);
    const anyMatch = referenced.some(n => seriesValues.some(v => Math.abs(v - n) < 1e-6));
    if (referenced.length && !anyMatch) {
      warns.push(`${label}: _readFromGraph ("${item._readFromGraph}") names no number matching a data/bars value (${JSON.stringify(seriesValues)}) — soft check, graphs can reference computed values`);
    }
  }

  return {
    fails,
    warns,
    report: { rank: rankInfo },
  };
}

// ---------- main ----------

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`ERROR: input file not found: ${inputPath}`);
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  } catch (e) {
    console.error(`ERROR: failed to parse JSON at ${inputPath}: ${e.message}`);
    process.exit(1);
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    console.error('ERROR: input JSON must be an object keyed by topic');
    process.exit(1);
  }

  console.log(`=== VERIFY MATHS 9A (graph-reading) — ${inputPath} ===`);
  console.log(full ? '(mode: --full, bank-level checks enabled)' : '(mode: per-item only; pass --full for bank-level rank checks)');
  if (strict) console.log('(mode: --strict, bank-level flags are hard fails)');
  console.log('');

  let totalItems = 0;
  let totalFails = 0;
  let totalWarns = 0;
  const perTopicCounts = {};
  const perTopicRanks = {};
  const overallRanks = [];

  for (const topic of Object.keys(data)) {
    const items = data[topic];
    if (!Array.isArray(items)) {
      console.error(`ERROR: topic "${topic}" is not an array of items`);
      totalFails++;
      continue;
    }
    perTopicCounts[topic] = { n: items.length, fails: 0 };
    perTopicRanks[topic] = [];

    items.forEach((item, idx) => {
      totalItems++;
      const { fails, warns, report } = checkItem(topic, idx, item);
      if (fails.length) {
        perTopicCounts[topic].fails++;
        totalFails += fails.length;
        for (const f of fails) console.log(`FAIL ${f}`);
      }
      if (warns.length) {
        totalWarns += warns.length;
        for (const w of warns) console.log(`WARN ${w}`);
      }
      if (fails.length === 0) {
        console.log(`ok   ${itemLabel(topic, idx, item)} — component=${item.visual && item.visual.component}${report.rank ? `, rank=${report.rank}` : ''}`);
      }
      if (report.rank) {
        perTopicRanks[topic].push(report.rank);
        overallRanks.push(report.rank);
      }
    });
  }

  console.log('');
  console.log('=== SUMMARY ===');
  console.log(`Total items: ${totalItems}`);
  for (const topic of Object.keys(perTopicCounts)) {
    const c = perTopicCounts[topic];
    console.log(`  ${topic}: ${c.n} items, ${c.fails} with failures`);
  }
  console.log(`Hard failures: ${totalFails}`);
  console.log(`Warnings: ${totalWarns}`);

  let bankLevelHardFail = false;
  if (full) {
    console.log('');
    console.log('=== BANK-LEVEL: correct-answer value-rank histogram (1=smallest..5=largest) ===');
    for (const topic of Object.keys(perTopicRanks)) {
      const ranks = perTopicRanks[topic];
      if (ranks.length === 0) continue;
      const hist = [0, 0, 0, 0, 0];
      ranks.forEach(r => hist[r - 1]++);
      const medianShare = hist[2] / ranks.length;
      const flag = medianShare > 0.3 ? '  <-- FLAG (median share > 30%)' : '';
      console.log(`  ${topic}: [1:${hist[0]} 2:${hist[1]} 3:${hist[2]} 4:${hist[3]} 5:${hist[4]}] n=${ranks.length} median-share=${(medianShare * 100).toFixed(1)}%${flag}`);
      if (medianShare > 0.3) bankLevelHardFail = true;
    }
    if (overallRanks.length > 0) {
      const hist = [0, 0, 0, 0, 0];
      overallRanks.forEach(r => hist[r - 1]++);
      const medianShare = hist[2] / overallRanks.length;
      const flag = medianShare > 0.3 ? '  <-- FLAG (median share > 30%)' : '';
      console.log(`  OVERALL: [1:${hist[0]} 2:${hist[1]} 3:${hist[2]} 4:${hist[3]} 5:${hist[4]}] n=${overallRanks.length} median-share=${(medianShare * 100).toFixed(1)}%${flag}`);
      if (medianShare > 0.3) bankLevelHardFail = true;
    }
    if (bankLevelHardFail) {
      console.log(strict ? 'Bank-level flag(s) triggered — HARD FAIL under --strict.' : 'Bank-level flag(s) triggered — WARN only (pass --strict to make this a hard fail).');
    }
  }

  const exitOnFail = totalFails > 0 || (strict && bankLevelHardFail);
  if (exitOnFail) {
    console.log('');
    console.log('RESULT: FAIL');
    process.exit(1);
  } else {
    console.log('');
    console.log('RESULT: PASS');
    process.exit(0);
  }
}

main();

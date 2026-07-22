#!/usr/bin/env node
// Verify Maths D3 elite multi-step wave (benchmark fix #8) BEFORE insert.
// Spec: research/maths-d3-multistep-spec.md ("Harness" section).
//
// Input: JSON file shaped { "<topicKey>": [ item, ... ], ... } where each item
// carries the normal question fields PLUS _expr, _steps, _distractors.
//
// Usage:
//   node scripts/data-generation/verify-maths-d3.mjs [path-to-json] [--full] [--strict]
//
// Default path (no arg): the scratchpad maths-d3-clean.json for this session.
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
const inputPath = positional[0] || path.join(SCRATCHPAD, 'maths-d3-clean.json');

const EXPR_WHITELIST = /^[0-9+\-*/().\s]+$/;

// ---------- helpers ----------

function parseNumericOption(raw) {
  if (typeof raw !== 'string') return null;
  let s = raw.trim();
  s = s.replace(/−/g, '-');            // normalise unicode minus (−) to ASCII hyphen
  s = s.replace(/^(-?)\s*[£$]\s*/, '$1');   // strip currency symbol, KEEPING a leading sign (e.g. "-£11" -> "-11")
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

function countExplanationOps(explanation) {
  // Rough, report-only signal: distinct arithmetic operation tokens.
  const matches = explanation.match(/[+\-×÷*/]|(?:\btimes\b)|(?:\bdivided by\b)/gi) || [];
  return matches.length;
}

function itemLabel(topic, idx, item) {
  const q = (item && typeof item.question === 'string') ? item.question.slice(0, 60) : '(no question text)';
  return `[${topic} #${idx + 1}] "${q}${q.length === 60 ? '…' : ''}"`;
}

// ---------- per-item checks ----------

function checkItem(topic, idx, item) {
  const fails = [];
  const warns = [];
  const label = itemLabel(topic, idx, item);

  if (!item || typeof item !== 'object') {
    return { fails: [`${label}: item is not an object`], warns: [], report: {} };
  }

  if (item.difficulty !== 3) {
    fails.push(`${label}: difficulty must be 3 (got ${JSON.stringify(item.difficulty)})`);
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
  let optionValue = null;
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
      optionValue = parseNumericOption(item.options[item.correct]);
      if (optionValue === null) {
        fails.push(`${label}: options[correct] "${item.options[item.correct]}" has no parseable number`);
      } else if (Math.abs(exprValue - optionValue) > 1e-6) {
        fails.push(`${label}: _expr value (${exprValue}) does not match options[correct] parsed value (${optionValue}) from "${item.options[item.correct]}"`);
      }
    }
  }

  // Anti-ladder
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
        // Full constant ladder — always a hard fail (a fully arithmetic option set
        // is recognisably diagnostic-free regardless of where the correct value sits).
        fails.push(`${label}: ANTI-LADDER — constant gap across all 4 steps: gaps=${JSON.stringify(gaps)} (sorted values ${JSON.stringify(sortedVals)})`);
      } else if (maxFreq >= 3) {
        // Near-ladder (3 of 4 gaps equal). The benchmark "middle-value tell" is
        // specifically that the CORRECT answer is the median because of constant-gap
        // ladders. A near-ladder whose correct value sits at an extreme (rank 1/2/4/5)
        // does not reward "pick the middle", so it is only a hard fail when the correct
        // answer is ALSO the median (rank 3); otherwise it is downgraded to a warning.
        // The bank-level per-topic median-share guard still backstops the aggregate tell.
        if (rank === 3) {
          fails.push(`${label}: ANTI-LADDER — near-constant gap with correct at the MEDIAN: gaps=${JSON.stringify(gaps)} (sorted values ${JSON.stringify(sortedVals)})`);
        } else {
          warns.push(`${label}: near-constant gap (>=3 of 4 equal) but correct is at rank ${rank} (not median) — allowed: gaps=${JSON.stringify(gaps)}`);
        }
      }
    }
  }

  // Report-only signals
  const opCount = typeof item.explanation === 'string' ? countExplanationOps(item.explanation) : 0;
  let distractorsNamed = null;
  if (optionsOk && Number.isInteger(item.correct)) {
    const wrongOptions = item.options.filter((_, i) => i !== item.correct);
    const distractorKeys = item._distractors && typeof item._distractors === 'object' ? Object.keys(item._distractors) : [];
    const namedCount = wrongOptions.filter(opt => {
      if (distractorKeys.includes(opt)) return true;
      const numVal = parseNumericOption(opt);
      if (numVal === null) return false;
      return distractorKeys.some(k => {
        const kNum = parseNumericOption(k);
        return kNum !== null && Math.abs(kNum - numVal) < 1e-9;
      });
    }).length;
    distractorsNamed = `${namedCount}/4`;
    if (namedCount < 4) {
      warns.push(`${label}: _distractors names ${namedCount}/4 wrong options`);
    }
  }

  return {
    fails,
    warns,
    report: { opCount, distractorsNamed, rank: rankInfo },
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

  console.log(`=== VERIFY MATHS D3 — ${inputPath} ===`);
  console.log(full ? '(mode: --full, bank-level checks enabled)' : '(mode: per-item only; pass --full for bank-level rank checks)');
  if (strict) console.log('(mode: --strict, bank-level flags are hard fails)');
  console.log('');

  let totalItems = 0;
  let totalFails = 0;
  let totalWarns = 0;
  const perTopicCounts = {};
  const perTopicRanks = {}; // topic -> array of ranks (1..5) for numeric items
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
        console.log(`ok   ${itemLabel(topic, idx, item)} — ops=${report.opCount}, distractors=${report.distractorsNamed}${report.rank ? `, rank=${report.rank}` : ''}`);
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

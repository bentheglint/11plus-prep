#!/usr/bin/env node
// ============================================================================
// English length-tell validator (Fix #3) — CLI
// ----------------------------------------------------------------------------
// Measures the "correct answer is the single longest option" tell across BOTH
// banks (main library + the mock test bank, which never had a length guard),
// per bucket / difficulty, and grades the four in-scope buckets against the
// acceptance gate. Out-of-scope buckets are reported to prove we didn't touch
// them.
//
// Usage:
//   node scripts/validation/check-english-length-rank.mjs            # report + grade
//   node scripts/validation/check-english-length-rank.mjs --baseline # also write baseline JSON
//
// Exit: 0 = all in-scope buckets pass the gate; 1 = one or more fail.
// ============================================================================

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import englishData from '../../src/questionData/englishData.js';
import mockPassages from '../../src/questionData/mockComprehensionData.js';
import { measureAll, gradeBucket } from './english-length-core.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..', '..');

const report = measureAll(englishData, mockPassages);

const pad = (s, n) => String(s).padEnd(n);
console.log('\n================ ENGLISH LENGTH-TELL REPORT (chance = 20%) ================\n');
console.log(pad('bucket', 24), pad('scope', 6), pad('n', 6), pad('single-long', 12), pad('rank short→long', 22), 'ties');
console.log('-'.repeat(88));

let anyFail = false;
for (const [name, m] of Object.entries(report)) {
  const scope = m.inScope ? 'FIX' : 'ref';
  if (m.n === 0) {
    console.log(pad(name, 24), pad(scope, 6), pad(m.eligible ? `0/${m.eligible}` : '0', 6), pad('—', 12), 'no phrase-option Qs');
    continue;
  }
  const rankStr = m.rankHistPct.map(r => String(Math.round(r)).padStart(2)).join('/');
  console.log(
    pad(name, 24), pad(scope, 6), pad(m.n, 6),
    pad(m.singleLongestPct + '%', 12), pad(rankStr, 22), m.tiePct + '%'
  );
  if (m.inScope) {
    const g = gradeBucket(name, m);
    if (!g.pass) {
      anyFail = true;
      for (const fail of g.failures) console.log('    ✗', fail);
    } else {
      console.log('    ✓ within gate');
    }
    // per-difficulty line for in-scope buckets
    const dstr = Object.entries(m.byDifficulty)
      .filter(([, v]) => v.n > 0)
      .map(([d, v]) => `D${d} ${v.singleLongestPct}%(n=${v.n})`).join('  ');
    if (dstr) console.log('    ·', dstr);
  }
}

console.log('\n' + '-'.repeat(88));
console.log(anyFail
  ? 'RESULT: one or more in-scope buckets FAIL the gate (expected pre-fix).'
  : 'RESULT: all in-scope buckets PASS the gate.');

if (process.argv.includes('--baseline')) {
  const dir = join(REPO, 'scripts', 'validation', 'reports');
  mkdirSync(dir, { recursive: true });
  const path = join(dir, 'length-rank-baseline.json');
  writeFileSync(path, JSON.stringify(report, null, 2));
  console.log(`\nBaseline written: ${path}`);
}

process.exit(anyFail ? 1 : 0);

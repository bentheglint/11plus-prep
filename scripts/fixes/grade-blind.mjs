#!/usr/bin/env node
// Fix #3 — grade a blind-solver run against the private key.
// The CRITICAL failure is the solver's PRIMARY answer landing on one of OUR
// rewritten options (means a rewrite is too plausible / possibly correct).
// A wrong pick on a non-rewritten option = a pre-existing hard question, noted
// but not our fault. Solver flagging ambiguity is surfaced for review.
//
// Usage: node scripts/fixes/grade-blind.mjs <bucket> <answers.json>
// answers.json = the solver's array of {ref, answer, second, ambiguous, note}

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const D = join(__dirname, '..', '..', 'scripts', 'fixes', 'data');
const bucket = process.argv[2];
const answersPath = process.argv[3];
const key = JSON.parse(readFileSync(join(D, `blindkey-${bucket}.json`), 'utf8'));
const answers = JSON.parse(readFileSync(answersPath, 'utf8'));
const ansByRef = Object.fromEntries(answers.map(a => [a.ref, a]));

let correct = 0;
const critical = [], otherWrong = [], ambiguous = [], missing = [];
for (const k of key) {
  const a = ansByRef[k.ref];
  if (!a) { missing.push(k.ref); continue; }
  const rew = new Set(k.rewrittenLetters);
  if (a.answer === k.correctLetter) correct++;
  else if (rew.has(a.answer)) critical.push(`${k.ref}: picked ${a.answer} (a REWRITE) over correct ${k.correctLetter} — ${a.note || ''}`);
  else otherWrong.push(`${k.ref}: picked ${a.answer} (non-rewrite) vs correct ${k.correctLetter}`);
  if (a.ambiguous) ambiguous.push(`${k.ref}: ${a.note || ''} [rewritten opts: ${k.rewrittenLetters.join(',')}]`);
}

console.log(`\n=== ${bucket} blind-solve: ${correct}/${key.length} matched intended answer ===`);
console.log(`\nCRITICAL — solver chose a REWRITTEN option (REJECT these): ${critical.length}`);
critical.forEach(x => console.log('  ✗ ' + x));
console.log(`\nWrong pick on a NON-rewritten option (pre-existing hard Q): ${otherWrong.length}`);
otherWrong.forEach(x => console.log('  · ' + x));
console.log(`\nSolver-flagged ambiguous: ${ambiguous.length}`);
ambiguous.forEach(x => console.log('  ? ' + x));
if (missing.length) console.log(`\nMissing answers: ${missing.join(', ')}`);
process.exit(critical.length ? 1 : 0);

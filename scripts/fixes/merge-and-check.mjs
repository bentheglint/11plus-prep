#!/usr/bin/env node
// Fix #3 — merge Oracle rewrites onto the work orders, deterministically check
// them, and emit the verified-rewrites file the apply script consumes.
//
// Checks per question: word counts in target range; the correct option is NO
// LONGER the single longest after rewrite; all 5 final options distinct.
//
// Usage: node scripts/fixes/merge-and-check.mjs <bucket>
// In:  scripts/fixes/data/brief-<bucket>.json + authored-<bucket>.json
// Out: scripts/fixes/data/verified-<bucket>.json   (only if all checks pass)

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { words } from '../validation/english-length-core.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..', '..');
const bucket = process.argv[2];
if (!bucket) { console.error('need bucket'); process.exit(1); }
const D = join(REPO, 'scripts/fixes/data');

const brief = JSON.parse(readFileSync(join(D, `brief-${bucket}.json`), 'utf8'));
const authored = JSON.parse(readFileSync(join(D, `authored-${bucket}.json`), 'utf8'));
const authByRef = Object.fromEntries(authored.map(a => [a.ref, a]));

const norm = s => String(s).trim().toLowerCase().replace(/\s+/g, ' ');
const verified = [];
const problems = [];
const warnings = [];
const skipped = [];

for (const item of brief) {
  const a = authByRef[item.ref];
  if (!a) { problems.push(`${item.ref}: no authored output`); continue; }
  if (a.skip) { skipped.push(`${item.ref}: ${a.reason || 'skipped'}`); continue; }
  const newByIdx = Object.fromEntries(a.rewrites.map(r => [r.index, r.newText]));

  // reconstruct all 5 final options
  const finals = [];
  finals[item.key.correctIndex] = item.correctAnswer;
  for (const k of item.distractorsToKeep) finals[k.index] = k.text;
  for (const r of item.distractorsToRewrite) {
    const nt = newByIdx[r.index];
    if (nt == null) { problems.push(`${item.ref} idx${r.index}: missing rewrite`); continue; }
    finals[r.index] = nt;
    const w = words(nt);
    if (w < r.targetMinWords || w > r.targetMaxWords) {
      // soft: word-target is guidance toward the rank goal; the hard gate is
      // "correct no longer single-longest" (checked below) + the post-apply validator.
      warnings.push(`${item.ref} idx${r.index}: ${w} words, target ${r.targetMinWords}-${r.targetMaxWords}  "${nt}"`);
    }
  }
  if (finals.some(x => x == null)) { problems.push(`${item.ref}: incomplete option set`); continue; }

  // correct must NOT be single longest anymore
  const wl = finals.map(words);
  const cW = wl[item.key.correctIndex];
  const stillLongest = wl.every((w, i) => i === item.key.correctIndex || w < cW);
  if (stillLongest) problems.push(`${item.ref}: correct STILL single-longest after rewrite (cW=${cW}, others=${wl.join(',')})`);

  // distinctness
  const seen = new Set();
  for (const o of finals) {
    if (seen.has(norm(o))) problems.push(`${item.ref}: duplicate option "${o}"`);
    seen.add(norm(o));
  }

  verified.push({
    ref: item.ref,
    file: item.key.file, container: item.key.container, arr: item.key.arr,
    id: item.key.id, correctIndex: item.key.correctIndex,
    question: item.question, correctText: item.correctAnswer,
    rewrites: item.distractorsToRewrite.map(r => ({ index: r.index, currentText: r.currentText, newText: newByIdx[r.index] })),
  });
}

console.log(`\n${bucket}: ${brief.length} questions, ${verified.length} assembled, ${skipped.length} skipped (format-locked)`);
for (const s of skipped) console.log('  · skip ' + s);
if (warnings.length) { console.log(`\n⚠ ${warnings.length} word-target warnings (soft — validator is the real gate):`); for (const w of warnings) console.log('  ' + w); }
if (problems.length) {
  console.log(`\n✗ ${problems.length} PROBLEMS:`);
  for (const p of problems) console.log('  ' + p);
  console.log('\nNOT writing verified file. Fix authoring for the flagged items and re-run.');
  process.exit(1);
}
const out = join(D, `verified-${bucket}.json`);
writeFileSync(out, JSON.stringify(verified, null, 2));
console.log(`✓ all deterministic checks passed. Wrote ${out}`);

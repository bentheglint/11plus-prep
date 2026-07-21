#!/usr/bin/env node
// Fix #3 — emit a blind-solver payload (passage + question + final options, NO
// key) plus a private grading key. The solver never sees which is correct or
// which options we rewrote.
//
// Usage: node scripts/fixes/emit-blind-payload.mjs <bucket>
// Out: data/blind-<bucket>.json (give to solver) + data/blindkey-<bucket>.json

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import mockPassages from '../../src/questionData/mockComprehensionData.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..', '..');
const bucket = process.argv[2];
const D = join(REPO, 'scripts/fixes/data');
const brief = JSON.parse(readFileSync(join(D, `brief-${bucket}.json`), 'utf8'));
const authored = JSON.parse(readFileSync(join(D, `authored-${bucket}.json`), 'utf8'));
const authByRef = Object.fromEntries(authored.map(a => [a.ref, a]));
const passageText = Object.fromEntries(mockPassages.map(p => [p.id, p.passage]));
const LETTERS = ['A', 'B', 'C', 'D', 'E'];

const payload = [], key = [];
for (const item of brief) {
  const a = authByRef[item.ref];
  if (a?.skip) continue; // format-locked, not rewritten — nothing to verify
  const newByIdx = Object.fromEntries((a?.rewrites || []).map(r => [r.index, r.newText]));
  const finals = [];
  finals[item.key.correctIndex] = item.correctAnswer;
  for (const k of item.distractorsToKeep) finals[k.index] = k.text;
  for (const r of item.distractorsToRewrite) finals[r.index] = newByIdx[r.index];

  payload.push({
    ref: item.ref,
    passage: item.key.file === 'mockComprehensionData.js' ? passageText[item.key.container] : null,
    question: item.question,
    options: finals.map((t, i) => ({ letter: LETTERS[i], text: t })),
  });
  key.push({
    ref: item.ref,
    correctLetter: LETTERS[item.key.correctIndex],
    correctIndex: item.key.correctIndex,
    rewrittenIndices: item.distractorsToRewrite.map(r => r.index),
    rewrittenLetters: item.distractorsToRewrite.map(r => LETTERS[r.index]),
  });
}
writeFileSync(join(D, `blind-${bucket}.json`), JSON.stringify(payload, null, 2));
writeFileSync(join(D, `blindkey-${bucket}.json`), JSON.stringify(key, null, 2));
console.log(`wrote blind-${bucket}.json (${payload.length}) + blindkey-${bucket}.json`);

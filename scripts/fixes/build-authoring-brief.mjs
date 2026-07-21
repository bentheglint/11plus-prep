#!/usr/bin/env node
// Fix #3 Stage 2 — build a self-contained authoring brief for one bucket.
// Joins the Stage 1 work orders with passage text (mock) so the Oracle has
// everything inline. Writes a JSON brief the Oracle reads and answers.
//
// Usage: node scripts/fixes/build-authoring-brief.mjs <bucket>
//   e.g. node scripts/fixes/build-authoring-brief.mjs MOCK-vocabulary
// Output: scripts/fixes/data/brief-<bucket>.json

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import mockPassages from '../../src/questionData/mockComprehensionData.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..', '..');
const bucket = process.argv[2];
if (!bucket) { console.error('need a bucket name'); process.exit(1); }

const wo = JSON.parse(readFileSync(join(REPO, 'scripts/fixes/data/length-fix-workorders.json'), 'utf8'));
const items = wo.workorders.filter(w => w.bucket === bucket);
const passageText = Object.fromEntries(mockPassages.map(p => [p.id, p.passage]));

const brief = items.map((w, i) => ({
  ref: `${bucket}#${i + 1}`,
  key: w.key,
  passageTitle: w.passageTitle,
  passage: w.key.file === 'mockComprehensionData.js' ? (passageText[w.key.container] || null) : null,
  difficulty: w.difficulty,
  subtype: w.subtype,
  question: w.question,
  correctAnswer: w.correctText,
  correctWords: w.correctWords,
  targetRankForCorrect: w.targetRankForCorrect,
  distractorsToRewrite: w.distractorTargets
    .filter(d => d.action === 'lengthen')
    .map(d => ({ index: d.index, currentText: d.currentText, currentWords: d.currentWords, targetMinWords: d.targetMinWords, targetMaxWords: d.targetMaxWords, explanationQuotesThis: !!d.explanationQuotesThis })),
  distractorsToKeep: w.distractorTargets.filter(d => d.action !== 'lengthen').map(d => ({ index: d.index, text: d.currentText })),
}));

const path = join(REPO, 'scripts/fixes/data', `brief-${bucket}.json`);
writeFileSync(path, JSON.stringify(brief, null, 2));
console.log(`Wrote ${brief.length} authoring items -> ${path}`);

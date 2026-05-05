#!/usr/bin/env node
// Regression check: questions asking "find the length/width" with a
// RectangleDiagram must hide the unknown dimension via missingDim, or the
// diagram leaks the answer visually.
//
// Bug reported by Ben on 1 May 2026 (Q71 areaperimeter): visual passed
// length=23 with no missingDim, so the diagram displayed "23 cm" — which
// happens to be the correct answer.
//
// Heuristic: scan question objects where
//   - visual.component === "RectangleDiagram"
//   - question text matches /find the (length|width)|what is its (length|width)/i
//   - the matching numeric prop is present
//   - missingDim is NOT set to that dimension
//
// Usage: node scripts/validation/check-rectangle-answer-leak.js
// Exit:  0 = pass, 1 = leaks found

const fs = require('node:fs');
const path = require('node:path');

const SRC = path.join(__dirname, '..', '..', 'src', 'questionData', 'mathsData.js');
const text = fs.readFileSync(SRC, 'utf8');

// Slice each question object — they begin with `id: <num>` and end at the
// next `},` at the same indentation. We use a tolerant regex extractor.
const QUESTION_RE = /\{\s*id:\s*(\d+)[\s\S]*?(?=\}\s*,\s*\{|\}\s*\]\s*,?\s*\}\s*,?\s*\{?)/g;

// Better: split by `{ id: N,` boundaries within file, then re-attach.
// Simpler: regex out questions one by one with bracket balancing.

function extractQuestions(src) {
  const out = [];
  let i = 0;
  while (i < src.length) {
    const m = src.slice(i).match(/\{\s*id:\s*\d+/);
    if (!m) break;
    const startIdx = i + m.index;
    // Find matching `}` for this `{`
    let depth = 0;
    let j = startIdx;
    let inStr = null;
    while (j < src.length) {
      const c = src[j];
      if (inStr) {
        if (c === '\\') { j += 2; continue; }
        if (c === inStr) inStr = null;
        j++;
        continue;
      }
      if (c === '"' || c === "'" || c === '`') { inStr = c; j++; continue; }
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) break; }
      j++;
    }
    if (depth !== 0) break;
    out.push({ start: startIdx, end: j, body: src.slice(startIdx, j + 1) });
    i = j + 1;
  }
  return out;
}

const questions = extractQuestions(text);

let leaks = 0;
let scanned = 0;

for (const q of questions) {
  if (!q.body.includes('RectangleDiagram')) continue;
  scanned++;

  const questionMatch = q.body.match(/question:\s*"([^"]+)"/);
  const qText = questionMatch ? questionMatch[1] : '';

  const askLength = /find the length\b|what is its length\b|the length of/i.test(qText);
  const askWidth = /find the width\b|what is its width\b|the width of/i.test(qText);
  if (!askLength && !askWidth) continue;

  const idMatch = q.body.match(/id:\s*(\d+)/);
  const id = idMatch ? idMatch[1] : '?';

  const propsMatch = q.body.match(/RectangleDiagram[^}]*?props:\s*\{([^}]+)\}/);
  if (!propsMatch) continue;
  const props = propsMatch[1];

  const hasMissingDim = /missingDim:\s*["'](length|width|all)["']/.test(props);
  const missingDimMatch = props.match(/missingDim:\s*["'](length|width|all)["']/);
  const missingDim = missingDimMatch ? missingDimMatch[1] : null;

  const hasNumericLength = /\blength:\s*\d+/.test(props);
  const hasNumericWidth = /\bwidth:\s*\d+/.test(props);

  let flag = null;
  if (askLength && hasNumericLength && missingDim !== 'length' && missingDim !== 'all') {
    flag = `asks for length; visual includes numeric length; missingDim=${missingDim ?? 'none'}`;
  } else if (askWidth && hasNumericWidth && missingDim !== 'width' && missingDim !== 'all') {
    flag = `asks for width; visual includes numeric width; missingDim=${missingDim ?? 'none'}`;
  }

  if (flag) {
    const lineNum = text.slice(0, q.start).split('\n').length;
    console.log(`LEAK  Q${id} (mathsData.js:${lineNum})  ${flag}`);
    console.log(`        Q: "${qText}"`);
    leaks++;
  }
}

console.log('');
console.log(`Scanned ${scanned} questions with RectangleDiagram.`);
if (leaks === 0) {
  console.log('PASS — no answer-leak via diagram detected.');
  process.exit(0);
} else {
  console.log(`FAIL — ${leaks} question(s) leak the answer via the diagram.`);
  process.exit(1);
}

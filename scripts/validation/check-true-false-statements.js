#!/usr/bin/env node
// Regression check: every true-false statement in lesson data must have a
// truth field (`answer:` or `isTrue:`). Without it, MicroLessonScreen's
// handler silently marks every click incorrect — the bug Jacqui reported on
// 4 May 2026 in wordclass-subconcepts.js (which used `isTrue` while the
// handler read `answer`).
//
// The handler in src/microLessons/MicroLessonScreen.js was made tolerant of
// both schemas (`answer ?? isTrue`) so existing data continues to work. This
// script catches the next class of regression: a NEW lesson file that ships
// with statements missing ANY truth field.
//
// Usage:  node scripts/validation/check-true-false-statements.js
// Exit:   0 = pass, 1 = mismatches found

const fs = require('node:fs');
const path = require('node:path');

const STAGING_DIR = path.join(__dirname, '..', '..', 'src', 'microLessons', 'staging');

// Walk source code from `startIdx` (must point at an opening `[`) and return
// the index of the matching closing `]`. Tracks string boundaries so brackets
// inside `"..."`, `'...'`, and template literals (including ${...} expressions)
// don't confuse depth.
function findMatchingBracket(src, startIdx) {
  let depth = 0;
  let i = startIdx;
  while (i < src.length) {
    const c = src[i];
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) return i;
    } else if (c === '"' || c === "'") {
      i++;
      while (i < src.length && src[i] !== c) {
        if (src[i] === '\\') i++;
        i++;
      }
    } else if (c === '`') {
      i++;
      while (i < src.length && src[i] !== '`') {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === '$' && src[i + 1] === '{') {
          // Skip ${...} interpolation, balancing braces inside
          i += 2;
          let braceDepth = 1;
          while (i < src.length && braceDepth > 0) {
            if (src[i] === '{') braceDepth++;
            else if (src[i] === '}') braceDepth--;
            i++;
          }
          continue;
        }
        i++;
      }
    }
    i++;
  }
  return -1;
}

// Count top-level statement objects in the array body. A "statement" is an
// object literal beginning with `{ text:` at the array's depth. We track
// brace and bracket depth to avoid counting nested objects (e.g. a `props`
// object inside a statement, though true-false statements don't have those).
function countTopLevelStatements(arrayBody) {
  let count = 0;
  let depth = 0;
  let i = 0;
  while (i < arrayBody.length) {
    const c = arrayBody[i];
    if (c === '"' || c === "'" || c === '`') {
      // Skip string
      const q = c;
      i++;
      while (i < arrayBody.length && arrayBody[i] !== q) {
        if (arrayBody[i] === '\\') { i += 2; continue; }
        if (q === '`' && arrayBody[i] === '$' && arrayBody[i + 1] === '{') {
          i += 2;
          let braceDepth = 1;
          while (i < arrayBody.length && braceDepth > 0) {
            if (arrayBody[i] === '{') braceDepth++;
            else if (arrayBody[i] === '}') braceDepth--;
            i++;
          }
          continue;
        }
        i++;
      }
      i++;
      continue;
    }
    if (c === '{') {
      if (depth === 0) {
        // Look ahead for `text:` at the start of this object
        const peek = arrayBody.slice(i + 1, i + 30).replace(/^\s+/, '');
        if (/^text\s*:/.test(peek)) count++;
      }
      depth++;
    } else if (c === '}') depth--;
    i++;
  }
  return count;
}

function countTruthFields(arrayBody) {
  // Match `answer: true|false` or `isTrue: true|false` not inside a string.
  // For our use case, simple regex is fine because these fields are simple
  // identifier:literal pairs that never appear inside template strings as
  // substrings of other code in lesson files.
  const matches = arrayBody.match(/\b(answer|isTrue)\s*:\s*(true|false)\b/g) || [];
  return matches.length;
}

let issues = 0;
let totalStatements = 0;

const files = fs.readdirSync(STAGING_DIR).filter(f => f.endsWith('-subconcepts.js'));

for (const f of files) {
  const src = fs.readFileSync(path.join(STAGING_DIR, f), 'utf8');

  // Find every `type: "true-false"` block, then locate the `statements:` array
  // that follows within the same `interaction: { ... }` object.
  const typeRe = /type:\s*["']true-false["']/g;
  let m;
  while ((m = typeRe.exec(src)) !== null) {
    // From the type marker, find `statements:` ahead in the source.
    const remainder = src.slice(m.index);
    const stmtMatch = remainder.match(/statements\s*:\s*(?:\([^)]*\)\s*=>)?\s*(\[)/);
    if (!stmtMatch) continue;
    const arrayOpenIdx = m.index + stmtMatch.index + stmtMatch[0].length - 1;
    const arrayCloseIdx = findMatchingBracket(src, arrayOpenIdx);
    if (arrayCloseIdx === -1) continue;
    const arrayBody = src.slice(arrayOpenIdx + 1, arrayCloseIdx);
    const statementCount = countTopLevelStatements(arrayBody);
    if (statementCount === 0) continue;
    const truthFieldCount = countTruthFields(arrayBody);
    totalStatements += statementCount;
    if (truthFieldCount < statementCount) {
      const lineNum = src.slice(0, m.index).split('\n').length;
      console.log(`FAIL  ${f}:${lineNum}  ${statementCount} statements, only ${truthFieldCount} truth fields`);
      issues++;
    }
  }
}

console.log('');
console.log(`Scanned ${files.length} lesson files, ${totalStatements} true-false statements.`);
if (issues === 0) {
  console.log('PASS — every statement has a truth field.');
  process.exit(0);
} else {
  console.log(`FAIL — ${issues} block(s) with missing truth fields.`);
  process.exit(1);
}

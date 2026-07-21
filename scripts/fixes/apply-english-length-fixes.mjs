#!/usr/bin/env node
// ============================================================================
// Fix #3 — apply verified distractor rewrites into the English banks.
// Mirrors Fix #2's apply discipline: composite-key location, per-edit drift
// asserts, STRUCTURALLY cannot touch the correct option, all-or-nothing
// in-memory edit + full re-parse before a single byte hits disk, dry-run by
// default, refuses a dirty git tree.
//
// Input: scripts/fixes/data/verified-<bucket>.json  — array of:
//   { file, container, arr, id, correctIndex, question, correctText,
//     rewrites: [ { index, currentText, newText } ] }
//
// Usage:
//   node scripts/fixes/apply-english-length-fixes.mjs <verified.json>          # dry-run
//   node scripts/fixes/apply-english-length-fixes.mjs <verified.json> --apply  # write
// ============================================================================

import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..', '..');
const APPLY = process.argv.includes('--apply');
const input = process.argv[2];
if (!input) { console.error('need a verified-rewrites JSON path'); process.exit(1); }

const FILES = {
  'englishData.js': join(REPO, 'src/questionData/englishData.js'),
  'mockComprehensionData.js': join(REPO, 'src/questionData/mockComprehensionData.js'),
};

// --- bracket-aware question-block extractor (proven in check-vocab-length-parity) ---
function extractBlocks(src) {
  const out = [];
  let i = 0;
  const re = /\{\s*(?:"id"|id)\s*:\s*\d+/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const startIdx = m.index;
    let depth = 0, j = startIdx, inStr = null;
    while (j < src.length) {
      const c = src[j];
      if (inStr) {
        if (c === '\\') { j += 2; continue; }
        if (c === inStr) inStr = null;
        j++; continue;
      }
      if (c === '"' || c === "'" || c === '`') { inStr = c; j++; continue; }
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) break; }
      j++;
    }
    if (depth !== 0) break;
    out.push({ start: startIdx, end: j, body: src.slice(startIdx, j + 1) });
    re.lastIndex = j + 1;
  }
  return out;
}

// Find the options array span inside a block and return each string literal's
// absolute {start,end,quote,raw,text}. Preserves quote char for re-emit.
function optionLiterals(src, block) {
  const optM = block.body.match(/(?:"options"|options)\s*:\s*\[/);
  if (!optM) return null;
  const arrOpen = block.start + optM.index + optM[0].length - 1; // index of '['
  // walk to matching ']'
  let j = arrOpen, depth = 0, inStr = null, lits = [];
  while (j < src.length) {
    const c = src[j];
    if (inStr) {
      if (c === '\\') { j += 2; continue; }
      if (c === inStr) { lits[lits.length - 1].end = j; inStr = null; }
      j++; continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; lits.push({ start: j, quote: c }); j++; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) break; }
    j++;
  }
  return lits.map(l => {
    const raw = src.slice(l.start, l.end + 1);
    const inner = raw.slice(1, -1);
    // decode common escapes for comparison
    const text = inner.replace(/\\(["'`\\])/g, '$1').replace(/\\n/g, '\n');
    return { ...l, raw, text };
  });
}

function encodeLiteral(text, quote) {
  let s = text;
  if (quote === '"') s = s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  else if (quote === "'") s = s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  else s = s.replace(/\\/g, '\\\\').replace(/`/g, '\\`');
  return quote + s + quote;
}

// git clean-tree guard
if (APPLY) {
  const dirty = execSync('git status --porcelain src/questionData', { cwd: REPO }).toString().trim();
  if (dirty) { console.error('ABORT: target data files have uncommitted changes:\n' + dirty); process.exit(1); }
}

const records = JSON.parse(readFileSync(input, 'utf8'));
const byFile = {};
for (const r of records) (byFile[r.file] ||= []).push(r);

const summary = { located: 0, edits: 0, files: {} };
const pendingWrites = {};

for (const [file, recs] of Object.entries(byFile)) {
  const abs = FILES[file];
  if (!abs) { console.error(`unknown file: ${file}`); process.exit(1); }
  let src = readFileSync(abs, 'utf8');
  const blocks = extractBlocks(src);

  // collect all edits as absolute {start,end,replacement} then apply right-to-left
  const edits = [];
  for (const rec of recs) {
    // locate: blocks whose body contains the exact question AND correct text
    const matches = blocks.filter(b => b.body.includes(rec.question) && b.body.includes(rec.correctText));
    if (matches.length !== 1) {
      console.error(`LOCATE FAIL (${matches.length} matches) for ${file} id=${rec.id}: "${rec.question.slice(0, 60)}..."`);
      process.exit(1);
    }
    const block = matches[0];
    const lits = optionLiterals(src, block);
    if (!lits) { console.error(`no options array in block id=${rec.id}`); process.exit(1); }
    // drift: correct option unchanged
    if (lits[rec.correctIndex]?.text !== rec.correctText) {
      console.error(`DRIFT: correct option mismatch id=${rec.id}. file="${lits[rec.correctIndex]?.text}" expected="${rec.correctText}"`);
      process.exit(1);
    }
    for (const rw of rec.rewrites) {
      if (rw.index === rec.correctIndex) { console.error(`REFUSE: rewrite targets correct index id=${rec.id}`); process.exit(1); }
      const lit = lits[rw.index];
      if (!lit) { console.error(`no option index ${rw.index} id=${rec.id}`); process.exit(1); }
      if (lit.text !== rw.currentText) {
        console.error(`DRIFT: distractor[${rw.index}] mismatch id=${rec.id}. file="${lit.text}" expected="${rw.currentText}"`);
        process.exit(1);
      }
      edits.push({ start: lit.start, end: lit.end, replacement: encodeLiteral(rw.newText, lit.quote), id: rec.id, index: rw.index });
      summary.edits++;
    }
    summary.located++;
  }

  // apply right-to-left so offsets stay valid
  edits.sort((a, b) => b.start - a.start);
  let edited = src;
  for (const e of edits) edited = edited.slice(0, e.start) + e.replacement + edited.slice(e.end + 1);
  pendingWrites[abs] = { edited, file, editCount: edits.length };
  summary.files[file] = edits.length;
}

// --- all-or-nothing safety: re-parse each edited file as a module BEFORE writing ---
async function verifyParse(abs, edited, file) {
  const tmp = abs + '.fix3tmp.mjs';
  writeFileSync(tmp, edited);
  try {
    const mod = await import(pathToFileURL(tmp).href + `?t=${summary.edits}`);
    const data = mod.default;
    if (!data) throw new Error('no default export after edit');
    return true;
  } finally {
    try { execSync(process.platform === 'win32' ? `del "${tmp}"` : `rm -f "${tmp}"`, { cwd: REPO }); } catch {}
  }
}

console.log(`\nFix #3 apply — ${APPLY ? 'APPLY' : 'DRY-RUN'}`);
console.log(`located ${summary.located} questions, ${summary.edits} distractor edits`);
for (const [f, n] of Object.entries(summary.files)) console.log(`  ${f}: ${n} edits`);

for (const [abs, w] of Object.entries(pendingWrites)) {
  const ok = await verifyParse(abs, w.edited, w.file);
  if (!ok) { console.error(`RE-PARSE FAILED for ${w.file} — NOT writing anything`); process.exit(1); }
  console.log(`  re-parse OK: ${w.file}`);
}

if (!APPLY) { console.log('\nDRY-RUN complete — no files written. Re-run with --apply to write.'); process.exit(0); }

for (const [abs, w] of Object.entries(pendingWrites)) writeFileSync(abs, w.edited);
console.log('\n✅ APPLIED. Run the validator to confirm the tell is broken.');

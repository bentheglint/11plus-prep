#!/usr/bin/env node
// Insert verified English rebalance content (benchmark fix #10) into englishData.js.
//  For each topic key present in the input JSON: locate `<key>: {`, find its first
//  `questions: [`, string-aware bracket-match the closing `]`, assert that `]` is
//  immediately followed by the topic-object close `}`. Find the max existing `\bid:`
//  (word-boundary — "grid" can't inflate it), append new items continuing from max+1.
//  Passage-anchored vocab items (questionType:"passage") are position-balanced A-E across
//  the topic (seeded, deterministic). Error-spotting items are NOT rebalanced (options are
//  fixed section labels; correct is content-determined) — their correct-index distribution
//  is reported instead. All `_`-prefixed fields are stripped from the written output.
//  Double-insert guard: refuses per-topic if the first new item's question text is already
//  present in that topic's existing question bank.
//  Post-write: re-reads + module-loads the file, asserts per-topic counts rose by the
//  expected deltas and the total by their sum. Loud failure + "restore from git" on mismatch.
//
// Usage: node scripts/data-generation/insert-english10.mjs                  (dry-run)
//        node scripts/data-generation/insert-english10.mjs --apply
//        node scripts/data-generation/insert-english10.mjs --data <path> --target <path> [--apply]

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..', '..');
// Default working-file location, resolved RELATIVE TO THE REPO. This used to
// hard-code one machine's Claude scratchpad path (C:/Users/benja/...), so the
// script's defaults only worked on the laptop — the same portability trap that
// kept the diagram-design skill invisible to git for weeks. Pass the explicit
// --data/--target flags for a real run; override the default with the
// MATHS_INSERT_SCRATCHPAD env var if you keep working files elsewhere.
const SP = process.env.MATHS_INSERT_SCRATCHPAD
  || path.join(REPO, 'scripts', 'data-generation', 'work');

const apply = process.argv.includes('--apply');
function argVal(flag, def) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : def;
}
const dataPath = path.resolve(argVal('--data', path.join(SP, 'english10-clean.json')));
const targetPath = path.resolve(argVal('--target', path.join(REPO, 'src', 'questionData', 'englishData.js')));

const KNOWN_TOPICS = ['comprehension', 'spelling', 'punctuation', 'grammar', 'vocabulary', 'wordClassGrammar'];

// ---------- seeded PRNG + position balance (mirrors insert-vr7.mjs / insert-cloze.mjs) ----------
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function shuffle(arr, rng) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function balancedPositions(n, seed) { const pool = []; for (let i = 0; i < n; i++) pool.push(i % 5); return shuffle(pool, mulberry32(seed)); }
function rebalance(options, correct, target) {
  const c = options[correct];
  const others = options.filter((_, i) => i !== correct);
  const out = new Array(5);
  out[target] = c;
  let k = 0;
  for (let i = 0; i < 5; i++) { if (i === target) continue; out[i] = others[k++]; }
  return { options: out, correct: target };
}
const POSITION_BALANCE_SEED = 20260722;

// ---------- string-aware bracket matcher ----------
// Given the index of a '[' in str, returns the index of its matching ']', skipping the
// contents of '/"/` strings (with \-escapes) and // and /* */ comments.
function findMatchingBracket(str, openIdx) {
  let depth = 0;
  let i = openIdx;
  const n = str.length;
  while (i < n) {
    const ch = str[i];
    if (ch === '[') { depth++; i++; continue; }
    if (ch === ']') { depth--; if (depth === 0) return i; i++; continue; }
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch; i++;
      while (i < n) {
        if (str[i] === '\\') { i += 2; continue; }
        if (str[i] === quote) { i++; break; }
        i++;
      }
      continue;
    }
    if (ch === '/' && str[i + 1] === '/') { i += 2; while (i < n && str[i] !== '\n') i++; continue; }
    if (ch === '/' && str[i + 1] === '*') { i += 2; while (i < n && !(str[i] === '*' && str[i + 1] === '/')) i++; i += 2; continue; }
    i++;
  }
  return -1;
}

function locateTopicQuestionsBlock(str, topicKey) {
  const topicAnchor = `    ${topicKey}: {`;
  const firstIdx = str.indexOf(topicAnchor);
  if (firstIdx === -1) throw new Error(`topic anchor not found: "${topicAnchor}"`);
  if (str.indexOf(topicAnchor, firstIdx + 1) !== -1) throw new Error(`topic anchor not unique: "${topicAnchor}"`);
  const qLiteral = 'questions: [';
  const qIdx = str.indexOf(qLiteral, firstIdx);
  if (qIdx === -1) throw new Error(`"${qLiteral}" not found for topic ${topicKey}`);
  const openBracketIdx = qIdx + qLiteral.length - 1; // index of the '['
  const closeBracketIdx = findMatchingBracket(str, openBracketIdx);
  if (closeBracketIdx === -1) throw new Error(`could not find matching ] for topic ${topicKey}`);
  const after = str.slice(closeBracketIdx + 1);
  const m = after.match(/^\s*(\S)/);
  if (!m || m[1] !== '}') throw new Error(`] for ${topicKey} is not immediately followed by the topic-object close }`);
  return { openBracketIdx, closeBracketIdx };
}

// ---------- serialization (matches englishData.js quoted-key item style) ----------
function serItem(it) {
  const q = JSON.stringify;
  const L = ['        {'];
  L.push(`          "id": ${it.id},`);
  L.push(`          "difficulty": ${it.difficulty},`);
  if (it.questionType) L.push(`          "questionType": ${q(it.questionType)},`);
  if (it.questionSubType) L.push(`          "questionSubType": ${q(it.questionSubType)},`);
  if (it.passageId) L.push(`          "passageId": ${q(it.passageId)},`);
  if (it.passageTitle) L.push(`          "passageTitle": ${q(it.passageTitle)},`);
  if (it.passage) L.push(`          "passage": ${q(it.passage)},`);
  L.push(`          "question": ${q(it.question)},`);
  if (it.segments) L.push(`          "segments": ${q(it.segments)},`);
  L.push(`          "options": ${q(it.options)},`);
  L.push(`          "correct": ${it.correct},`);
  L.push(`          "explanation": ${q(it.explanation)}`);
  L.push('        }');
  return L.join('\r\n');
}

// ---------- module-load validation helper (temp-copy + dynamic import, like count-content.js) ----------
async function loadEnglishData(filePath) {
  const tmp = path.join(os.tmpdir(), `englishData_check_${Date.now()}_${Math.random().toString(36).slice(2)}.mjs`);
  fs.copyFileSync(filePath, tmp);
  try {
    return (await import(pathToFileURL(tmp).href)).default;
  } finally {
    try { fs.unlinkSync(tmp); } catch { /* ignore */ }
  }
}
function topicCounts(mod) {
  const out = {};
  for (const k of Object.keys(mod.topics)) out[k] = mod.topics[k].questions.length;
  return out;
}

(async () => {
  if (!fs.existsSync(dataPath)) { console.error('Input not found:', dataPath); process.exit(1); }
  if (!fs.existsSync(targetPath)) { console.error('Target not found:', targetPath); process.exit(1); }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  let str = fs.readFileSync(targetPath, 'utf8');

  const plan = [];
  const expectedDelta = {};
  let expectedTotalDelta = 0;

  for (const topicKey of Object.keys(data)) {
    if (!KNOWN_TOPICS.includes(topicKey)) { console.error(`Unknown topic key: "${topicKey}" (known: ${KNOWN_TOPICS.join(', ')})`); process.exit(1); }
    const items = data[topicKey];
    if (!Array.isArray(items) || items.length === 0) { console.error(`Topic "${topicKey}": no items to insert`); process.exit(1); }

    const loc = locateTopicQuestionsBlock(str, topicKey);
    const inner = str.slice(loc.openBracketIdx + 1, loc.closeBracketIdx);
    const ids = [...inner.matchAll(/\bid"?\s*:\s*(\d+)/g)].map(m => +m[1]);
    const maxId = ids.length ? Math.max(...ids) : 0;

    // Double-insert guard. NOTE: for error-spotting items, `question` is a shared boilerplate
    // stem ("Which section contains a punctuation error?") across the whole topic, so it can't
    // fingerprint a specific item — checking it would false-positive on every normal run.
    // `explanation` is written per-item and unique in practice, so use that as the fingerprint,
    // falling back to `question` only when explanation is missing.
    const fingerprint = isNonEmptyString(items[0].explanation) ? items[0].explanation : items[0].question;
    if (isNonEmptyString(fingerprint) && inner.includes(fingerprint)) {
      console.error(`GUARD: topic "${topicKey}" — first new item's content is already present in the existing bank. Refusing (already inserted?).`);
      console.error(`  fingerprint: "${fingerprint.slice(0, 90)}..."`);
      process.exit(1);
    }

    // assign ids, continuing from max+1 (strip `_` fields by only reading known fields below)
    const newItems = items.map((it, i) => ({ ...it, id: maxId + 1 + i }));

    // position-balance passage-anchored vocab items across this topic's new batch
    const passageIdxs = newItems.reduce((acc, it, i) => { if (it.questionType === 'passage') acc.push(i); return acc; }, []);
    if (passageIdxs.length) {
      const positions = balancedPositions(passageIdxs.length, POSITION_BALANCE_SEED);
      passageIdxs.forEach((itemIdx, k) => {
        const it = newItems[itemIdx];
        const { options, correct } = rebalance(it.options, it.correct, positions[k]);
        newItems[itemIdx] = { ...it, options, correct };
      });
    }

    const newItemsText = newItems.map(serItem).join(',\r\n');

    // splice: insert right before the matching ], after adding a comma to the last existing item
    const before = str.slice(0, loc.closeBracketIdx);
    const wsMatch = before.match(/(\s*)$/);
    const trailingWs = wsMatch[1];
    const beforeTrimmed = before.slice(0, before.length - trailingWs.length);
    if (!beforeTrimmed.endsWith('}')) { console.error(`Topic "${topicKey}": content immediately before ] doesn't end with }} — aborting (unexpected shape)`); process.exit(1); }
    str = beforeTrimmed + ',\r\n' + newItemsText + trailingWs + str.slice(loc.closeBracketIdx);

    // reporting
    const correctDist = [0, 0, 0, 0, 0];
    newItems.forEach(it => correctDist[it.correct]++);
    const skillDist = {};
    items.forEach(it => { if (it._skill) skillDist[it._skill] = (skillDist[it._skill] || 0) + 1; });
    const passageBalDist = [0, 0, 0, 0, 0];
    passageIdxs.forEach(i => passageBalDist[newItems[i].correct]++);

    plan.push({ topicKey, maxId, count: newItems.length, idStart: maxId + 1, idEnd: maxId + newItems.length, correctDist, skillDist, passageCount: passageIdxs.length, passageBalDist });
    expectedDelta[topicKey] = newItems.length;
    expectedTotalDelta += newItems.length;
  }

  console.log('=== INSERT ENGLISH10 — ' + (apply ? 'APPLY' : 'DRY-RUN') + ' ===');
  console.log('data:', dataPath);
  console.log('target:', targetPath);
  plan.forEach(p => {
    console.log(`${p.topicKey}: existing maxId=${p.maxId}, appending ${p.count} -> ids ${p.idStart}-${p.idEnd}`);
    console.log(`  correct-index distribution (0-4, A-E/No-mistake): ${p.correctDist.join('/')}`);
    if (p.passageCount) console.log(`  passage-vocab position-balanced (${p.passageCount} items) A-E: ${p.passageBalDist.join('/')}`);
    if (Object.keys(p.skillDist).length) console.log(`  _skill breakdown: ${JSON.stringify(p.skillDist)}`);
  });
  console.log(`TOTAL new items: ${expectedTotalDelta}`);

  if (!apply) { console.log('\n(dry-run — nothing written. Re-run with --apply.)'); return; }

  // baseline counts from the ORIGINAL file (still unmodified on disk at this point)
  const baselineMod = await loadEnglishData(targetPath);
  const baselineCounts = topicCounts(baselineMod);
  const baselineTotal = Object.values(baselineCounts).reduce((a, b) => a + b, 0);

  fs.writeFileSync(targetPath, str);
  console.log(`\nWROTE: ${targetPath}`);

  // post-write validation: re-read + module-load, assert deltas
  const newMod = await loadEnglishData(targetPath);
  const newCounts = topicCounts(newMod);
  const newTotal = Object.values(newCounts).reduce((a, b) => a + b, 0);

  let ok = true;
  for (const [topicKey, delta] of Object.entries(expectedDelta)) {
    const expected = (baselineCounts[topicKey] || 0) + delta;
    if (newCounts[topicKey] !== expected) {
      ok = false;
      console.error(`VALIDATION FAIL: topic "${topicKey}" count is ${newCounts[topicKey]}, expected ${expected} (baseline ${baselineCounts[topicKey]} + ${delta})`);
    }
  }
  if (newTotal !== baselineTotal + expectedTotalDelta) {
    ok = false;
    console.error(`VALIDATION FAIL: total is ${newTotal}, expected ${baselineTotal + expectedTotalDelta} (baseline ${baselineTotal} + ${expectedTotalDelta})`);
  }
  if (!ok) {
    console.error(`\n*** WRITE VALIDATION FAILED — ${path.basename(targetPath)} may be inconsistent. RESTORE FROM GIT: git checkout -- "${path.relative(REPO, targetPath)}" ***`);
    process.exit(1);
  }
  console.log(`\nVALIDATED: per-topic + total counts match expected deltas (total ${baselineTotal} -> ${newTotal}).`);
})().catch(err => { console.error('ERROR:', err.stack || err.message); process.exit(1); });

function isNonEmptyString(v) { return typeof v === 'string' && v.trim().length > 0; }

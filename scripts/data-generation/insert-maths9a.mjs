#!/usr/bin/env node
// Insert verified Maths graph-reading slice (benchmark fix #9a) into mathsData.js.
// Spec: research/maths-9a-graph-reading-spec.md. Mirrors insert-maths-d3.mjs
// (benchmark fix #8) EXACTLY: dry-run by default, seeded position-balance of
// `correct` A-E, CRLF-safe append, string-aware bracket matching (so existing
// content is never disturbed), and a post-write vm/module-load validation
// pass. THE ONE DIFFERENCE: items carry a `visual: { component, props }`
// object that must be serialized into the written question literal (the #8
// insert never had a visual field to handle).
//
// Input: JSON shaped { "<topicKey>": [ item, ... ], ... } — same shape
// verify-maths9a.mjs checks. Each item carries the normal question fields
// plus visual/_expr/_steps/_readFromGraph; the `_`-prefixed fields are
// stripped on insert (never written to mathsData.js). `visual` IS written.
//
// Usage:
//   node scripts/data-generation/insert-maths9a.mjs                  (dry-run)
//   node scripts/data-generation/insert-maths9a.mjs --apply          (writes real file)
//   node scripts/data-generation/insert-maths9a.mjs --data <path> --target <path> [--apply]
//     (override input JSON / target mathsData.js — used for self-testing against a copy)

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..', '..');
const SCRATCHPAD = 'C:/Users/benja/AppData/Local/Temp/claude/C--Users-benja-Documents-11plus-prep/849c3908-8662-4ef1-b26e-ed306edeb9f4/scratchpad';

const SEED = 20260723; // fixed constant (today's authoring date) — deterministic, reproducible

// ---------- CLI args ----------
const argv = process.argv.slice(2);
const apply = argv.includes('--apply');
function argVal(flag, fallback) {
  const i = argv.indexOf(flag);
  if (i >= 0 && argv[i + 1]) return argv[i + 1];
  return fallback;
}
const dataPath = argVal('--data', path.join(SCRATCHPAD, 'maths9a-clean.json'));
const targetPath = argVal('--target', path.join(REPO, 'src', 'questionData', 'mathsData.js'));
// Optional lesson-map assignments { "<topic>": ["subConceptId", ...] } parallel to data[topic],
// and the maths question->lesson map to append them to. If the assignments file is absent the
// questions are still inserted (they work unmapped); only the optional "Find Me a Lesson"
// deep-link would no-op for them.
const lessonMapPath = argVal('--lessonmap', path.join(SCRATCHPAD, 'maths9a-lessonmap.json'));
const mapTargetPath = argVal('--map-target', path.join(REPO, 'public', 'maths-question-lesson-map.json'));

const TOPIC_ORDER = [
  'percentages', 'decimals', 'longdivision', 'ratio', 'fractions',
  'longmultiplication', 'algebra', 'placevalue', 'negativenumbers',
  'primenumbersfactors', 'areaperimeter', 'volume', 'anglesshapes',
  'sequences', 'datahandling', 'speeddistancetime',
];
const LETTERS = ['A', 'B', 'C', 'D', 'E'];

// ---------- helpers (copied from insert-maths-d3.mjs conventions) ----------

function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function shuffle(arr, rng) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
function balancedPositions(n, seed) { const pool = []; for (let i = 0; i < n; i++) pool.push(i % 5); return shuffle(pool, mulberry32(seed)); }
function rebalance(options, correct, target) { const c = options[correct]; const others = options.filter((_, i) => i !== correct); const out = new Array(5); out[target] = c; let k = 0; for (let i = 0; i < 5; i++) { if (i === target) continue; out[i] = others[k++]; } return { options: out, correct: target }; }

// String-aware bracket matcher: walks from an opening `[`, tracking [] / {} depth,
// and skips over string literals (double/single/backtick) including escaped quotes,
// so brackets that appear inside question/explanation text never break the match.
function findMatchingBracket(str, openIdx) {
  let depth = 0;
  let inString = false;
  let strChar = null;
  for (let i = openIdx; i < str.length; i++) {
    const c = str[i];
    if (inString) {
      if (c === '\\') { i++; continue; } // skip escaped char
      if (c === strChar) inString = false;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inString = true; strChar = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

// THE ONE DIFFERENCE from insert-maths-d3.mjs's serializeItem: a `visual`
// object, when present, is emitted after `difficulty` and before `question`.
// JSON.stringify on the nested { component, props } object produces valid JS
// (a JSON object literal is always a legal JS object literal).
function serializeItem(it) {
  const q = JSON.stringify;
  const IND1 = ' '.repeat(10);
  const IND2 = ' '.repeat(12);
  const lines = [
    IND1 + '{',
    IND2 + `id: ${it.id},`,
    IND2 + `difficulty: ${it.difficulty},`,
  ];
  if (it.visual) {
    lines.push(IND2 + `visual: ${q(it.visual)},`);
  }
  lines.push(
    IND2 + `question: ${q(it.question)},`,
    IND2 + `options: ${q(it.options)},`,
    IND2 + `correct: ${it.correct},`,
    IND2 + `explanation: ${q(it.explanation)}`,
    IND1 + '}',
  );
  return lines.join('\r\n');
}

// Loads mathsData.js content by copying it to a throwaway .mjs file and dynamically
// importing it — the same technique scripts/count-content.js already uses to count
// the bank (a real Node module-parse, so a parse failure surfaces as a real import
// error, and the returned object's topic/question counts are exactly what the app
// itself would see).
async function loadMathsData(content, tag) {
  const tmpFile = path.join(os.tmpdir(), `mathsData-insert-check-${tag}-${Date.now()}-${Math.random().toString(36).slice(2)}.mjs`);
  fs.writeFileSync(tmpFile, content);
  try {
    const mod = await import(pathToFileURL(tmpFile).href);
    return mod.default;
  } finally {
    fs.unlinkSync(tmpFile);
  }
}

function countByTopic(mathsData) {
  const counts = {};
  for (const k of Object.keys(mathsData.topics)) counts[k] = mathsData.topics[k].questions.length;
  return counts;
}

// ---------- main ----------

async function main() {
  if (!fs.existsSync(dataPath)) {
    console.error(`ERROR: input JSON not found: ${dataPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(targetPath)) {
    console.error(`ERROR: target file not found: ${targetPath}`);
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (e) {
    console.error(`ERROR: failed to parse input JSON at ${dataPath}: ${e.message}`);
    process.exit(1);
  }

  let lessonAssign = null;
  if (fs.existsSync(lessonMapPath)) {
    try {
      lessonAssign = JSON.parse(fs.readFileSync(lessonMapPath, 'utf8'));
    } catch (e) {
      console.error(`ERROR: failed to parse lesson-map assignments at ${lessonMapPath}: ${e.message}`);
      process.exit(1);
    }
  }

  const originalContent = fs.readFileSync(targetPath, 'utf8');
  let content = originalContent;

  const inputTopics = Object.keys(data);
  const unknownTopics = inputTopics.filter(t => !TOPIC_ORDER.includes(t));
  const errors = [];
  const plan = []; // {topic, oldMax, added, newIdRange, posDist}
  let totalAdded = 0;

  if (unknownTopics.length) {
    errors.push(`GUARD: unknown topic key(s) not found among the 16 maths topics: ${unknownTopics.join(', ')}`);
  }

  for (const topic of TOPIC_ORDER) {
    if (!(topic in data)) continue;
    const items = data[topic];

    if (!Array.isArray(items) || items.length === 0) {
      errors.push(`GUARD [${topic}]: input items must be a non-empty array (got ${Array.isArray(items) ? items.length : typeof items})`);
      continue;
    }
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!Array.isArray(it.options) || it.options.length !== 5) {
        errors.push(`GUARD [${topic}] item #${i + 1}: options must be an array of 5 (run verify-maths9a.mjs first)`);
      }
      if (!Number.isInteger(it.correct) || it.correct < 0 || it.correct > 4) {
        errors.push(`GUARD [${topic}] item #${i + 1}: correct must be an integer 0..4 (run verify-maths9a.mjs first)`);
      }
      if (!Number.isInteger(it.difficulty) || it.difficulty < 1 || it.difficulty > 3) {
        errors.push(`GUARD [${topic}] item #${i + 1}: difficulty must be an integer 1..3 (run verify-maths9a.mjs first)`);
      }
      if (!it.visual || typeof it.visual !== 'object' || !it.visual.component) {
        errors.push(`GUARD [${topic}] item #${i + 1}: visual: { component, props } is required for the graph-reading slice (run verify-maths9a.mjs first)`);
      }
    }

    const anchorRe = new RegExp(topic + ':\\s*\\{', 'g');
    const anchorMatches = [...content.matchAll(anchorRe)];
    if (anchorMatches.length !== 1) {
      errors.push(`GUARD [${topic}]: expected exactly one "${topic}: {" anchor, found ${anchorMatches.length} — aborting this topic`);
      continue;
    }
    const anchorIdx = anchorMatches[0].index;

    const qIdx = content.indexOf('questions: [', anchorIdx);
    if (qIdx < 0) {
      errors.push(`GUARD [${topic}]: no "questions: [" found after anchor — aborting this topic`);
      continue;
    }
    const openBracket = qIdx + 'questions: ['.length - 1;
    const closeBracket = findMatchingBracket(content, openBracket);
    if (closeBracket < 0) {
      errors.push(`GUARD [${topic}]: bracket-matching scanner could not find a matching "]" — aborting this topic`);
      continue;
    }

    // Assertion: the matched "]" must be followed (ignoring whitespace/CRLF) by the
    // topic-object close "}". If not, our bracket match landed somewhere unexpected.
    let k = closeBracket + 1;
    while (k < content.length && /\s/.test(content[k])) k++;
    if (content[k] !== '}') {
      errors.push(`GUARD [${topic}]: matched "]" is not followed by the topic-object close "}" (found "${content.slice(closeBracket + 1, closeBracket + 20).trim()}") — aborting this topic`);
      continue;
    }

    const slice = content.slice(openBracket, closeBracket);
    // \b so we match the real `id:` property, not the "id" inside a word like
    // "Cuboid: 1000" that appears in explanation text (would inflate the max id).
    const ids = [...slice.matchAll(/\bid:\s*(-?\d+)/g)].map(m => +m[1]);
    const maxId = ids.length ? Math.max(...ids) : 0;

    // Double-insert guard: does the first new item's question text already exist
    // in the file? If so, this topic was very likely already inserted by a prior run.
    const firstQJson = JSON.stringify(items[0].question);
    if (content.includes(firstQJson)) {
      errors.push(`GUARD [${topic}]: first new item's question text already exists in the file — refusing to double-insert. (${firstQJson.slice(0, 60)}...)`);
      continue;
    }

    const count = items.length;
    const positions = balancedPositions(count, SEED);
    const newItems = items.map((it, i) => {
      const { options, correct } = rebalance(it.options, it.correct, positions[i]);
      return {
        id: maxId + 1 + i,
        difficulty: it.difficulty,
        visual: it.visual,
        question: it.question,
        options,
        correct,
        explanation: it.explanation,
      };
    });

    const block = newItems.map(serializeItem).join(',\r\n');
    const insertText = ',\r\n' + block + '\r\n';
    content = content.slice(0, closeBracket) + insertText + content.slice(closeBracket);

    // Build lesson-map entries (if assignments were provided), pairing each new
    // question id with its assigned subConceptId in the same order.
    let topicMapEntries = null;
    if (lessonAssign) {
      const assign = lessonAssign[topic];
      if (!Array.isArray(assign) || assign.length !== count) {
        errors.push(`GUARD [${topic}]: lesson-map assignments length (${Array.isArray(assign) ? assign.length : 'missing'}) != item count (${count})`);
      } else if (!assign.every(s => typeof s === 'string' && s.trim().length)) {
        errors.push(`GUARD [${topic}]: lesson-map assignments must all be non-empty subConceptId strings`);
      } else {
        topicMapEntries = newItems.map((it, i) => ({ questionId: it.id, subConceptId: assign[i], confidence: 'medium' }));
      }
    }

    const posDist = [0, 0, 0, 0, 0];
    newItems.forEach(it => posDist[it.correct]++);
    plan.push({
      topic,
      oldMax: maxId,
      added: count,
      newIdRange: [maxId + 1, maxId + count],
      posDist,
      mapEntries: topicMapEntries,
    });
    totalAdded += count;
  }

  console.log(`=== INSERT MATHS 9A (graph-reading) — ${apply ? 'APPLY' : 'DRY-RUN'} ===`);
  console.log(`input:  ${dataPath}`);
  console.log(`target: ${targetPath}`);
  console.log('');
  for (const p of plan) {
    const spread = LETTERS.map((l, i) => `${l}:${p.posDist[i]}`).join(' ');
    const mapNote = p.mapEntries ? `, +${p.mapEntries.length} lesson-map` : (lessonAssign ? '' : ', (no lesson-map file)');
    console.log(`[${p.topic}] old max id=${p.oldMax}, appending ${p.added}, new id range ${p.newIdRange[0]}-${p.newIdRange[1]}, correct-position spread ${spread}${mapNote}`);
  }
  console.log('');
  console.log(`Topics touched: ${plan.length}, total items to append: ${totalAdded}`);

  if (errors.length) {
    console.log('');
    console.log('=== ERRORS (refusing to proceed) ===');
    for (const e of errors) console.log('ERROR ' + e);
    process.exit(1);
  }

  if (!apply) {
    console.log('');
    console.log('(dry-run — nothing written)');
    process.exit(0);
  }

  // ---------- APPLY ----------
  let beforeData;
  try {
    beforeData = await loadMathsData(originalContent, 'before');
  } catch (e) {
    console.error('LOUD ERROR: could not load the ORIGINAL file before writing (baseline parse failed) — aborting, nothing written.');
    console.error(e.stack || e.message);
    process.exit(1);
  }
  const beforeCounts = countByTopic(beforeData);
  const beforeTotal = Object.values(beforeCounts).reduce((a, b) => a + b, 0);

  fs.writeFileSync(targetPath, content);
  console.log('');
  console.log(`WROTE: ${targetPath}`);

  // Post-write validation: re-read from disk and load as a real module.
  const writtenContent = fs.readFileSync(targetPath, 'utf8');
  let afterData;
  try {
    afterData = await loadMathsData(writtenContent, 'after');
  } catch (e) {
    console.error('');
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('LOUD ERROR: post-write validation FAILED — the written file does not parse.');
    console.error('The file on disk has already been modified. RESTORE FROM GIT (git checkout -- src/questionData/mathsData.js) and re-run.');
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error(e.stack || e.message);
    process.exit(1);
  }
  const afterCounts = countByTopic(afterData);
  const afterTotal = Object.values(afterCounts).reduce((a, b) => a + b, 0);

  let validationOk = true;
  const expectedByTopic = {};
  for (const p of plan) expectedByTopic[p.topic] = p.added;

  for (const topic of Object.keys(expectedByTopic)) {
    const before = beforeCounts[topic] ?? null;
    const after = afterCounts[topic] ?? null;
    const expected = expectedByTopic[topic];
    if (before === null || after === null || after - before !== expected) {
      validationOk = false;
      console.error(`LOUD ERROR: topic "${topic}" count mismatch — before=${before}, after=${after}, expected delta=${expected}`);
    }
  }
  const expectedTotalDelta = totalAdded;
  if (afterTotal - beforeTotal !== expectedTotalDelta) {
    validationOk = false;
    console.error(`LOUD ERROR: total bank count mismatch — before=${beforeTotal}, after=${afterTotal}, expected delta=${expectedTotalDelta}`);
  }

  console.log('');
  console.log(`Before total: ${beforeTotal}`);
  console.log(`After total:  ${afterTotal}`);

  if (!validationOk) {
    console.error('');
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('LOUD ERROR: post-write validation FAILED — counts do not match expectations.');
    console.error('The file on disk has already been modified. RESTORE FROM GIT (git checkout -- src/questionData/mathsData.js) and re-run.');
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    process.exit(1);
  }

  console.log('');
  console.log('VALIDATION PASSED — file parses, per-topic and total counts match expectations.');

  // ---------- lesson-map append (only reached after mathsData validated OK) ----------
  const topicsWithMap = plan.filter(p => p.mapEntries && p.mapEntries.length);
  if (lessonAssign && topicsWithMap.length) {
    let mapData;
    try {
      mapData = JSON.parse(fs.readFileSync(mapTargetPath, 'utf8'));
    } catch (e) {
      console.error(`LOUD ERROR: mathsData.js was written and validated, but the lesson-map file failed to parse: ${mapTargetPath} (${e.message}).`);
      console.error('Questions ARE inserted and fully functional; only the lesson-map was not updated. Fix the map file and re-run with the same input (the question double-insert guard will skip re-adding questions).');
      process.exit(1);
    }
    let mapAdded = 0;
    for (const p of topicsWithMap) {
      if (!Array.isArray(mapData[p.topic])) mapData[p.topic] = [];
      const existingIds = new Set(mapData[p.topic].map(m => m.questionId));
      for (const entry of p.mapEntries) {
        if (existingIds.has(entry.questionId)) continue; // idempotent — never double-map an id
        mapData[p.topic].push(entry);
        existingIds.add(entry.questionId);
        mapAdded++;
      }
    }
    // Match the existing map file's encoding exactly (2-space pretty JSON, CRLF, no
    // trailing newline) so the diff is only the appended entries, not a line-ending churn.
    fs.writeFileSync(mapTargetPath, JSON.stringify(mapData, null, 2).replace(/\n/g, '\r\n'));
    console.log(`WROTE lesson-map: ${mapTargetPath} (+${mapAdded} entries across ${topicsWithMap.length} topics)`);
  } else if (!lessonAssign) {
    console.log('(no lesson-map assignments file — questions inserted UNMAPPED; "Find Me a Lesson" will no-op for them)');
  }

  process.exit(0);
}

main();

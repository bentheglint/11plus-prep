#!/usr/bin/env node
// Insert verified Cloze content (benchmark fix #6).
//  - Main bank: append 64 cloze gaps to englishData.js topics.grammar.questions (ids 386-449),
//    APPEND-ONLY, options position-balanced A-E (seeded), payload stripped.
//  - Mock: write src/questionData/mockClozeData.js (mockClozePassages), position-balanced.
//  - Lesson map: add grammar entries mapping each new id -> existing subConcept by skill.
// Deterministic (seeded PRNG, no Math.random). Guards: refuses to run if grammar maxid != 385.
//
// Usage: node scripts/data-generation/insert-cloze.mjs        (dry-run: prints plan, writes nothing)
//        node scripts/data-generation/insert-cloze.mjs --apply

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function shuffle(arr, rng) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// balanced target-position pool of length n over 0..4, deterministically shuffled
function balancedPositions(n, seed) {
  const pool = []; for (let i = 0; i < n; i++) pool.push(i % 5);
  return shuffle(pool, mulberry32(seed));
}

const SKILL_TO_SUBCONCEPT = {
  'homophone': 'homophones',
  'verb-tense': 'verb-tenses',
  'modal': 'modal-verbs',
  'conjunction': 'conjunctions',
  'agreement': 'subject-verb-agreement',
  'preposition': 'standard-english',
};

// Re-place options so the correct answer sits at targetPos; other options keep relative order.
function rebalanceOptions(options, correct, targetPos) {
  const correctStr = options[correct];
  const others = options.filter((_, i) => i !== correct);
  const out = new Array(5);
  out[targetPos] = correctStr;
  let k = 0;
  for (let i = 0; i < 5; i++) { if (i === targetPos) continue; out[i] = others[k++]; }
  return { options: out, correct: targetPos };
}

// ---- load verified content ----
const main = JSON.parse(fs.readFileSync(path.join(SP, 'cloze-main.json'), 'utf8')).passages;
const mock = JSON.parse(fs.readFileSync(path.join(SP, 'cloze-mock.json'), 'utf8')).passages;

// ---- MAIN BANK: flatten, assign ids, balance positions ----
const flatMain = [];
main.forEach(p => p.gaps.forEach(g => flatMain.push({ ...g, passageId: p.passageId, passageTitle: p.passageTitle, passage: p.passage })));
if (flatMain.length !== 64) { console.error(`expected 64 main gaps, got ${flatMain.length}`); process.exit(1); }
const mainPos = balancedPositions(64, 20260722);
const START_ID = 386;
const mainItems = flatMain.map((g, i) => {
  const { options, correct } = rebalanceOptions(g.options, g.correct, mainPos[i]);
  return {
    id: START_ID + i, difficulty: g.difficulty, questionType: 'cloze',
    passageId: g.passageId, passageTitle: g.passageTitle, passage: g.passage,
    gapNumber: g.gapNumber, question: g.question, options, correct, explanation: g.explanation,
    _skill: g.skill, // used only for lesson map, stripped from serialization
  };
});

// ---- serialize to englishData.js style (quoted keys, inline options, 8-space base indent) ----
function serItem(it) {
  const q = JSON.stringify;
  const L = [];
  L.push('        {');
  L.push(`          "id": ${it.id},`);
  L.push(`          "difficulty": ${it.difficulty},`);
  L.push(`          "questionType": "cloze",`);
  L.push(`          "passageId": ${q(it.passageId)},`);
  L.push(`          "passageTitle": ${q(it.passageTitle)},`);
  L.push(`          "passage": ${q(it.passage)},`);
  L.push(`          "gapNumber": ${it.gapNumber},`);
  L.push(`          "question": ${q(it.question)},`);
  L.push(`          "options": ${q(it.options)},`);
  L.push(`          "correct": ${it.correct},`);
  L.push(`          "explanation": ${q(it.explanation)}`);
  L.push('        }');
  return L.join('\r\n');
}
const newItemsText = mainItems.map(serItem).join(',\r\n');

// ---- splice into englishData.js (CRLF file) ----
const edPath = path.join(REPO, 'src', 'questionData', 'englishData.js');
let ed = fs.readFileSync(edPath, 'utf8');
const ANCHOR = '\r\n        }\r\n      ]\r\n    },\r\n\r\n    vocabulary: {';
if (ed.indexOf(ANCHOR) === -1) { console.error('englishData grammar/vocabulary anchor NOT found — aborting'); process.exit(1); }
if (ed.indexOf(ANCHOR) !== ed.lastIndexOf(ANCHOR)) { console.error('anchor not unique — aborting'); process.exit(1); }
const replacement = '\r\n        },\r\n' + newItemsText + '\r\n      ]\r\n    },\r\n\r\n    vocabulary: {';
const edNew = ed.replace(ANCHOR, replacement);

// ---- MOCK: build mockClozeData.js (balance positions per its own pool) ----
const flatMock = [];
mock.forEach(p => p.gaps.forEach(g => flatMock.push({ ...g, passageId: p.passageId, passageTitle: p.passageTitle, passage: p.passage })));
if (flatMock.length !== 24) { console.error(`expected 24 mock gaps, got ${flatMock.length}`); process.exit(1); }
const mockPos = balancedPositions(24, 20260723);
let mp = 0;
const mockPassages = mock.map(p => {
  const cq = p.gaps.map(g => {
    const { options, correct } = rebalanceOptions(g.options, g.correct, mockPos[mp++]);
    return { id: g.gapNumber, difficulty: g.difficulty, gapNumber: g.gapNumber, questionType: 'cloze',
      question: g.question, options, correct, explanation: g.explanation };
  });
  return { id: p.passageId, title: p.passageTitle, passage: p.passage, clozeQuestions: cq };
});
const mockFile = `// Mock Test Cloze Data (benchmark fix #6)
// Authentic GL running-passage Cloze (Q42-49): a short narrative (~80-100 words) with 8
// inline gaps, each a 5-option MCQ with real "errors children write" distractors
// (homophones, wrong verb forms, should-of, preposition traps). Gaps ramp D1->D3.
// All content 100% original — British English, UK context. Position-balanced A-E.
// Wired into the English mock via generateEnglishPaper() in src/hooks/useMockTest.js.

export const mockClozePassages = ${JSON.stringify(mockPassages, null, 2)};
`;
const mockPath = path.join(REPO, 'src', 'questionData', 'mockClozeData.js');

// ---- LESSON MAP: add grammar entries ----
const mapPath = path.join(REPO, 'public', 'english-question-lesson-map.json');
const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const newMapEntries = mainItems.map(it => ({
  questionId: it.id,
  subConceptId: SKILL_TO_SUBCONCEPT[it._skill] || 'standard-english',
  confidence: (it._skill === 'preposition') ? 'medium' : 'high',
}));

// ---- report ----
const posDist = [0,0,0,0,0]; mainItems.forEach(it => posDist[it.correct]++);
const mockPosDist = [0,0,0,0,0]; mockPassages.forEach(p => p.clozeQuestions.forEach(q => mockPosDist[q.correct]++));
const subCount = {}; newMapEntries.forEach(e => subCount[e.subConceptId] = (subCount[e.subConceptId]||0)+1);
console.log('=== INSERT CLOZE — ' + (apply ? 'APPLY' : 'DRY-RUN') + ' ===');
console.log(`main-bank: ${mainItems.length} items, ids ${START_ID}-${START_ID+mainItems.length-1}`);
console.log(`  correct-position spread A-E: ${posDist.join('/')}`);
console.log(`mock: ${mockPassages.length} passages, ${flatMock.length} gaps`);
console.log(`  correct-position spread A-E: ${mockPosDist.join('/')}`);
console.log(`lesson-map new entries: ${newMapEntries.length} -> ${JSON.stringify(subCount)}`);

if (!apply) { console.log('\n(dry-run — nothing written. Re-run with --apply.)'); process.exit(0); }

// GUARD: only append if grammar currently ends at 385
const grammarBlock = ed.slice(ed.indexOf('    grammar: {'), ed.indexOf(ANCHOR) + 20);
const ids = [...grammarBlock.matchAll(/"?id"?:\s*(\d+)/g)].map(m => +m[1]);
const maxId = Math.max(...ids);
if (maxId !== 385) { console.error(`GUARD: grammar maxid is ${maxId}, expected 385 — aborting (already inserted?)`); process.exit(1); }

fs.writeFileSync(edPath, edNew);
fs.writeFileSync(mockPath, mockFile);
map.grammar = [...(map.grammar || []), ...newMapEntries];
fs.writeFileSync(mapPath, JSON.stringify(map, null, 2) + '\n');
console.log('\nWROTE: englishData.js (+64 grammar cloze), mockClozeData.js (3 passages), english-question-lesson-map.json (+64 grammar entries)');

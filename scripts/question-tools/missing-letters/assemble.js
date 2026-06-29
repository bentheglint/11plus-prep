// Combine input batches → diversify over-used inert fillers → redistribute answer positions
// evenly across A-E → validate exhaustively. Writes a finalised .jsonl for apply.js.
// Mechanical only: answers, traps, sentences and explanation MEANING are untouched; we only
// swap inert filler tokens (in options AND their named mention in explanation) and move
// the answer to a new slot.
//
// Usage:
//   node scripts/question-tools/missing-letters/assemble.js

'use strict';
const fs   = require('fs');
const path = require('path');
const { loadDicts, rebuildsAll, capsWordFromQuestion, REPO } = require('./lib');

// ── CONFIG ────────────────────────────────────────────────────────────────────
const CONFIG = {
  // Input files: .jsonl (one JSON per line) or .js (eval-wrapped comma-separated objects).
  // Listed in id-ascending order; all are combined and sorted before processing.
  inputs: [
    // Example — edit these paths to point at your actual batch files:
    // path.join(__dirname, 'd2-final-46-105.jsonl'),
    // path.join(__dirname, 'd3-batch1.js'),
    // path.join(__dirname, 'd3-batch2.js'),
    // path.join(__dirname, 'd3-batch3.js'),
  ],
  idStart:      46,    // first id in the combined range (inclusive)
  idEnd:        150,   // last  id in the combined range (inclusive)
  tierBoundary: 105,   // ids <= tierBoundary → D2; ids > tierBoundary → D3
  fillerMAX:    8,     // max allowed occurrences of any single inert filler across all items
  fillerPool: [
    'ELF','OAK','JAM','YAK','ZIP','GUM','VAN','HUT','WAX','FIG','POD','BUN','DEN','FOG',
    'HEN','JIG','KIT','LOG','MUD','SOB','TUB','URN','WIG','BOG','CAP','DOT','EEL','GAP',
    'HOP','COB','NAP','PIT','JAR','JET','JOY','KEG','LAD','MOB','OAR','PUB','TOY','TUG',
    'VOW','YEW','ZOO','AXE','COD','CUB','CUE','DEW','HUB','IVY','OWL','PEG','RIB','RUG',
    'ICE','PAD','RAT','TEA','INK','NUT',
  ],
  outPath: path.join(__dirname, 'final.jsonl'),
};
// ─────────────────────────────────────────────────────────────────────────────

if (CONFIG.inputs.length === 0) {
  console.error('CONFIG.inputs is empty — add your batch file paths and re-run.');
  process.exit(1);
}

const { DICT, COMMON } = loadDicts();

// ── Helpers ───────────────────────────────────────────────────────────────────
function loadInput(p) {
  const txt = fs.readFileSync(p, 'utf8');
  if (p.endsWith('.jsonl')) return txt.trim().split('\n').map(JSON.parse);
  return eval('[' + txt + '\n]');   // .js fragment
}

function rebuilds(frame, opt) {
  return rebuildsAll(frame, opt, DICT).length > 0;
}

// ── Load & merge ──────────────────────────────────────────────────────────────
let all = [];
for (const p of CONFIG.inputs) all = all.concat(loadInput(p));
all.sort((a, b) => a.id - b.id);

// ── Pre-validate ──────────────────────────────────────────────────────────────
const expected = CONFIG.idEnd - CONFIG.idStart + 1;
const errs = [];
if (all.length !== expected) errs.push(`expected ${expected} items, got ${all.length}`);
all.forEach((q, i) => {
  if (q.id !== CONFIG.idStart + i) errs.push(`seq break at id ${q.id} (expected ${CONFIG.idStart + i})`);
  const expDiff = q.id <= CONFIG.tierBoundary ? 2 : 3;
  if (q.difficulty !== expDiff) errs.push(`id ${q.id}: difficulty ${q.difficulty} != expected ${expDiff}`);
  if (!Array.isArray(q.options) || q.options.length !== 5 || new Set(q.options).size !== 5)
    errs.push(`id ${q.id}: options not 5-unique`);
  if (q.correct < 0 || q.correct > 4) errs.push(`id ${q.id}: correct out of bounds`);
  if (!q.explanation.trim().endsWith('✓')) errs.push(`id ${q.id}: no tick`);
  // token-invariant: every 3-letter caps token in explanation must be an option
  (q.explanation.match(/\b[A-Z]{3}\b/g) || []).forEach(t => {
    if (!q.options.includes(t)) errs.push(`id ${q.id}: stray token "${t}" in explanation`);
  });
});
if (errs.length) { console.error('PRE-VALIDATE FAILED:\n' + errs.join('\n')); process.exit(1); }
console.log(`pre-validate: OK (${all.length} items, ids ${CONFIG.idStart}-${CONFIG.idEnd}, format clean, token invariant holds)`);

// ── Classify options; record original answer + maker counts (invariance check later) ─
const meta = all.map(q => {
  const f      = capsWordFromQuestion(q.question);
  const ans    = q.options[q.correct];
  const fillers = q.options.filter((o, i) => i !== q.correct && !rebuilds(f, o));
  const makers  = q.options.filter(o => rebuilds(f, o)).length;
  return { f, ans, fillers, makers };
});

// ── Filler diversification ────────────────────────────────────────────────────
// Cap any filler at CONFIG.fillerMAX; reassign over-used occurrences to the least-used
// valid inert candidate. Deterministic tie-break by pool order.
const usePool = [...new Set(CONFIG.fillerPool.filter(w => DICT.has(w) && COMMON.has(w)))];
const count = {};
meta.forEach(m => m.fillers.forEach(x => { count[x] = (count[x] || 0) + 1; }));
const OVER = new Set(Object.keys(count).filter(k => count[k] > CONFIG.fillerMAX));
console.log(`over-used fillers (>${CONFIG.fillerMAX}): ${[...OVER].map(k => k + ':' + count[k]).join(' ') || 'none'}`);

let swaps = 0;
all.forEach((q, idx) => {
  const m = meta[idx];
  m.fillers.forEach(old => {
    if (!OVER.has(old)) return;
    // pick globally least-used candidate that is: inert for this frame, not already an option,
    // not itself over-target. Deterministic tie-break by pool order.
    const taken = new Set(q.options);
    let best = null, bestC = Infinity;
    for (const c of usePool) {
      if (taken.has(c)) continue;
      if (rebuilds(m.f, c)) continue;        // must stay inert
      const cc = count[c] || 0;
      if (cc >= CONFIG.fillerMAX) continue;
      if (cc < bestC) { bestC = cc; best = c; }
    }
    if (!best) { console.error(`no filler candidate for id ${q.id} replacing "${old}"`); process.exit(1); }

    // apply in options
    const oi = q.options.indexOf(old);
    q.options[oi] = best;

    // apply in explanation (standalone uppercase token); old fillers are named at most once
    const re     = new RegExp('\\b' + old + '\\b', 'g');
    const before = q.explanation;
    q.explanation = q.explanation.replace(re, best);
    const occ = (before.match(re) || []).length;
    if (occ > 1) {
      console.error(`id ${q.id}: filler "${old}" appears ${occ}x in explanation (ambiguous — cannot safely replace)`);
      process.exit(1);
    }

    // bookkeeping
    count[old]--;
    count[best] = (count[best] || 0) + 1;
    m.fillers[m.fillers.indexOf(old)] = best;
    swaps++;
  });
});
console.log(`filler diversification: ${swaps} slot(s) reassigned`);

// ── Answer-position redistribution ───────────────────────────────────────────
// Target: exactly even spread across A-E using a seeded LCG (deterministic, reproducible).
const posCount = Math.ceil(all.length / 5);
const positions = [];
for (let p = 0; p < 5; p++) for (let k = 0; k < posCount; k++) positions.push(p);
positions.length = all.length;  // trim to exact length if not divisible by 5

let seed = 2654435761 >>> 0;
const rnd = () => { seed = (1103515245 * seed + 12345) >>> 0; return seed / 4294967296; };
for (let i = positions.length - 1; i > 0; i--) {
  const j = Math.floor(rnd() * (i + 1));
  [positions[i], positions[j]] = [positions[j], positions[i]];
}

all.forEach((q, i) => {
  const tgt    = positions[i];
  const ansOpt = q.options[q.correct];
  [q.options[q.correct], q.options[tgt]] = [q.options[tgt], q.options[q.correct]];
  q.correct = tgt;
  if (q.options[q.correct] !== ansOpt) {
    console.error(`id ${q.id}: position move broke answer`);
    process.exit(1);
  }
});

// ── Post-validate (exhaustive) ────────────────────────────────────────────────
const post = [];
const posDist = [0, 0, 0, 0, 0];
const fc = {};
all.forEach((q, i) => {
  const m   = meta[i];
  const f   = capsWordFromQuestion(q.question);
  const ans = q.options[q.correct];
  if (ans !== m.ans)   post.push(`id ${q.id}: answer changed "${ans}" != "${m.ans}"`);
  if (!DICT.has(ans))  post.push(`id ${q.id}: answer "${ans}" not in dictionary`);
  if (!rebuilds(f, ans)) post.push(`id ${q.id}: answer "${ans}" rebuilds nothing from "${f}"`);
  const makers = q.options.filter(o => rebuilds(f, o)).length;
  if (makers !== m.makers) post.push(`id ${q.id}: maker count changed ${makers} != ${m.makers}`);
  if (q.id <= CONFIG.tierBoundary && makers < 2) post.push(`id ${q.id}: D2 <2 makers`);
  if (q.id  > CONFIG.tierBoundary && makers < 3) post.push(`id ${q.id}: D3 <3 makers`);
  if (!Array.isArray(q.options) || q.options.length !== 5 || new Set(q.options).size !== 5)
    post.push(`id ${q.id}: options not 5-unique`);
  if (!q.explanation.trim().endsWith('✓')) post.push(`id ${q.id}: no tick`);
  (q.explanation.match(/\b[A-Z]{3}\b/g) || []).forEach(t => {
    if (!q.options.includes(t)) post.push(`id ${q.id}: stray token "${t}"`);
  });
  posDist[q.correct]++;
  q.options.forEach((o, oi) => { if (oi !== q.correct && !rebuilds(f, o)) fc[o] = (fc[o] || 0) + 1; });
});
if (post.length) { console.error('POST-VALIDATE FAILED:\n' + post.join('\n')); process.exit(1); }
const maxFill = Math.max(...Object.values(fc));
console.log('post-validate: OK (answers + maker counts preserved, format clean, tokens consistent)');
console.log('answer-position [A,B,C,D,E]:', posDist.join(','));
console.log(`filler spread: distinct=${Object.keys(fc).length} max-use=${maxFill}`);

// ── Write output ──────────────────────────────────────────────────────────────
fs.writeFileSync(CONFIG.outPath, all.map(q => JSON.stringify(q)).join('\n'));
console.log(`wrote ${CONFIG.outPath} (${all.length} items)`);

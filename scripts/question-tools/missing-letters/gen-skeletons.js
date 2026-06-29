// Generate mechanically-guaranteed D3 skeletons for missingLettersWords.
// Validates each candidate host: safe mid-word gap (gapFirstPos == intended mid position,
// not 0 or end), ≥2 recognisable competing traps, round-robin spread inert fillers,
// no two hosts share a displayed frame. Writes a skeletons JSON for Oracle hand-off.
//
// Usage:
//   node scripts/question-tools/missing-letters/gen-skeletons.js          # evaluate CANDIDATES
//   node scripts/question-tools/missing-letters/gen-skeletons.js scan     # scan all COMMON 6-9 letter words

'use strict';
const fs   = require('fs');
const path = require('path');
const { loadDicts, rebuildsAll, gapFirstPos, REPO } = require('./lib');

// ── CONFIG ────────────────────────────────────────────────────────────────────
const CONFIG = {
  topicKey: 'missingLettersWords',
  vrDataPath: path.join(REPO, 'src/questionData/vrData.js'),
  excludeExistingHosts: true,   // parse all existing hosts from the live topic block

  // Child-appropriate Year 5-6 stretch vocab: concrete nouns, themed, all mechanically validated.
  // (Curated list — frame collisions between PARROTS/CELLARS/BAGPIPE and PARDONS/CARROTS/BANDAGE
  //  caused those candidates to be dropped from the original D3 session.)
  candidateHosts: `
    MARTINS PEANUTS FEATHER SEAWEED STARLING PARDONS SOLDIER TRIDENT GALLEON
    SHOWERS LEATHER SPINACH CARROTS DRAGONS COMPASS SANDALS MITTENS PEBBLES
    TENDRIL CANYONS LAGOONS CARTOON HELMETS MAGNETS TEAPOTS TRACTOR WALNUTS
    BANDAGE BONNETS CASKETS FERRETS HORNETS OCTOPUS PALACES PARCELS PORCHES PRAWNS
    RADISH SADDLES TURKEYS WAGONS HAMPERS MARMOTS CRUMPET SLIPPER
  `.trim().split(/\s+/),

  // Inert filler pool: 3-letter real words used for non-answer, non-trap slots.
  fillerPool: [
    'ELF','OAK','JAM','YAK','ZIP','GUM','VAN','HUT','WAX','FIG','POD','NUT','BUN','RAT','OWL',
    'PEG','RIB','TEA','INK','COB','DEN','FOG','HEN','JIG','KIT','LOG','MUD','NAP','PIT','RUG',
    'SOB','TUB','URN','WIG','BOG','CAP','DOT','EEL','GAP','HOP'
  ],

  outPath: path.join(__dirname, 'skeletons.json'),
};
// ─────────────────────────────────────────────────────────────────────────────

const { DICT, COMMON } = loadDicts();
console.log(`COMMON (recognisable) set: ${COMMON.size} words`);

// ── Build EXCLUDE from all existing hosts in the live topic block ─────────────
const EXCLUDE = new Set();
if (CONFIG.excludeExistingHosts) {
  const vr = fs.readFileSync(CONFIG.vrDataPath, 'utf8');
  const s  = vr.indexOf(CONFIG.topicKey + ':');
  // find the next top-level topic key to bound the block
  const nextRe = /\n    [a-zA-Z]+:/g;
  nextRe.lastIndex = s + CONFIG.topicKey.length + 1;
  const nextMatch = nextRe.exec(vr);
  const e = nextMatch ? nextMatch.index : vr.length;
  const block = vr.slice(s, e);

  // extract host words from explanations: "makes WORD" or "rebuilds WORD"
  const re = /id: (\d+),[\s\S]*?explanation: "((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(block))) {
    const hm = m[2].match(/(?:makes?|rebuilds?)\s+([A-Z]{4,})/);
    if (hm) EXCLUDE.add(hm[1]);
  }
  console.log(`Existing hosts excluded from EXCLUDE set: ${EXCLUDE.size}`);
}

// ── Core evaluation ───────────────────────────────────────────────────────────
function evaluateHost(host) {
  if (EXCLUDE.has(host) || !DICT.has(host) || host.length < 6 || host.length > 9 || !COMMON.has(host)) return null;
  let best = null;
  for (let i = 1; i <= host.length - 4; i++) {
    const answer = host.slice(i, i + 3);
    const frame  = host.slice(0, i) + host.slice(i + 3);
    if (!DICT.has(answer) || !COMMON.has(answer)) continue;
    // GUARD: verify keys the gap off the LOWEST insertion position the answer rebuilds a
    // word at. Require that lowest position to be this mid-word gap — else verify would
    // read a start/end word and flag the item.
    const firstPos = gapFirstPos(frame, answer, DICT);
    if (firstPos !== i) continue;                          // answer makes an earlier word — unsafe
    if (firstPos === 0 || firstPos === frame.length) continue; // not mid-word
    const comps = [];
    for (const w of DICT) {
      if (w.length !== 3 || w === answer) continue;
      const rebuilt = rebuildsAll(frame, w, DICT);
      if (rebuilt.length) {
        const knownWord = rebuilt.find(x => COMMON.has(x));
        comps.push({ opt: w, word: knownWord || rebuilt[0], known: !!knownWord });
      }
    }
    comps.sort((a, b) => (b.known ? 1 : 0) - (a.known ? 1 : 0));
    const knownCount = comps.filter(c => c.known).length;
    if (knownCount >= 2) {
      const cand = { host, gapPos: i, frame, answer, comps, knownCount };
      if (!best || knownCount > best.knownCount) best = cand;
    }
  }
  return best;
}

// ── SCAN MODE ─────────────────────────────────────────────────────────────────
// Iterates every recognisable 6-9 letter word in COMMON, finds all that meet the full bar.
// Produces a large pool; child-appropriateness is then hand-picked from the output.
if (process.argv[2] === 'scan') {
  const wl   = require(path.join(REPO, 'node_modules/wordlist-english'));
  const CORE = new Set();
  for (const lvl of [
    'english/10','english/20','english/35','english/40',
    'english/british/10','english/british/20','english/british/35','english/british/40'
  ]) {
    for (const w of wl[lvl]) CORE.add(w.toUpperCase());
  }
  // Drop inflectional / adverbial suffixes unlikely to produce well-formed gap frames
  const DROP = /(ING|IED|IES|EST|ERS|IER|EDLY|NESS)$|ED$|ER$|LY$/;
  const pool = [];
  for (const w of COMMON) {
    if (!CORE.has(w)) continue;
    if (DROP.test(w)) continue;
    const r = evaluateHost(w);
    if (!r) continue;
    if (r.knownCount < 2 || r.knownCount > 8) continue;
    pool.push(r);
  }
  pool.sort((a, b) => a.host.localeCompare(b.host));
  const scanPath = path.join(__dirname, 'scan-pool.json');
  fs.writeFileSync(scanPath, JSON.stringify(
    pool.map(c => ({
      host: c.host, frame: c.frame, gapPos: c.gapPos, answer: c.answer,
      knownCount: c.knownCount,
      traps: c.comps.filter(x => x.known).slice(0, 8).map(x => `${x.opt}->${x.word}`)
    })), null, 2));
  console.log(`SCAN (filtered, concrete CORE vocab, 2-8 traps): ${pool.length} hosts. Wrote ${scanPath}\n`);
  pool.forEach(c => console.log(
    `${c.host.padEnd(9)} ans=${c.answer} gap@${c.gapPos} traps=${c.knownCount}  ` +
    c.comps.filter(x => x.known).slice(0, 6).map(x => x.word).join('/')
  ));
  return;
}

// ── Evaluate CANDIDATES ───────────────────────────────────────────────────────
const out    = [];
const failed = [];
for (const host of CONFIG.candidateHosts) {
  if (EXCLUDE.has(host)) { failed.push(`${host} (clash with existing hosts)`); continue; }
  const best = evaluateHost(host);
  if (best) out.push(best);
  else failed.push(`${host} (no safe mid-word gap with recognisable answer + ≥2 recognisable traps)`);
}

console.log(`\nQUALIFYING SKELETONS: ${out.length}\n`);
out.forEach((c, i) => {
  const known = c.comps.filter(x => x.known).map(x => `${x.opt}->${x.word}`).join(', ');
  console.log(
    `${String(i + 1).padStart(2)}. ${c.host}  frame=${c.frame} gap@${c.gapPos}  ` +
    `ANSWER=${c.answer}  recognisable-traps[${c.knownCount}]: ${known}`
  );
});
console.log(`\nFAILED (${failed.length}):`);
failed.forEach(f => console.log('  - ' + f));

// frame-collision guard: no two chosen hosts may display the same frame letters
const frameSeen = {};
out.forEach(c => { (frameSeen[c.frame] = frameSeen[c.frame] || []).push(c.host); });
const collisions = Object.entries(frameSeen).filter(([, hs]) => hs.length > 1);
if (collisions.length) {
  console.error('\nFRAME COLLISIONS:', JSON.stringify(collisions));
  process.exit(1);
}
console.log(`\nframe-collision check: PASS (all ${out.length} frames unique)`);

// ── Per-item verified-inert fillers ───────────────────────────────────────────
// Round-robin a globally-spread cursor through the filler pool so each item gets
// DISTINCT, evenly distributed inert fillers (avoids any single filler dominating).
const FILLER_POOL = CONFIG.fillerPool.filter(f => DICT.has(f) && COMMON.has(f));

function inertFillers(frame, taken) {
  return FILLER_POOL.filter(f => !taken.has(f) && rebuildsAll(frame, f, DICT).length === 0);
}

let fillerCursor = 0;
const handoff = out.map(c => {
  const traps = c.comps.filter(x => x.known).slice(0, 8).map(x => ({ opt: x.opt, word: x.word }));
  const taken = new Set([c.answer, ...traps.map(t => t.opt)]);
  const pool  = inertFillers(c.frame, taken);
  const picks = [];
  for (let k = 0; k < pool.length && picks.length < 3; k++) {
    const f = pool[(fillerCursor + k) % pool.length];
    if (!picks.includes(f)) picks.push(f);
  }
  fillerCursor += 3;
  return {
    host: c.host, frame: c.frame, answer: c.answer, gapPos: c.gapPos,
    recognisableTraps: traps,
    suggestedFillers: picks,
  };
});

fs.writeFileSync(CONFIG.outPath, JSON.stringify(handoff, null, 2));
console.log(`\nwrote ${CONFIG.outPath} (${out.length} skeletons, each with traps + verified-inert fillers)`);

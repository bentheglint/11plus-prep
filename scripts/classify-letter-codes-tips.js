#!/usr/bin/env node
// One-off classifier for letterCodes Qs that still use the generic tip.
// Reads vrData.js, extracts letterCodes questions, and classifies each
// generic-tip Q by the shift pattern described in its explanation.

const fs = require('fs');
const path = require('path');

const GENERIC_TIP = "Always check every letter — don't assume the shift from just the first one.";

function loadLetterCodes() {
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'questionData', 'vrData.js'), 'utf8');
  const start = src.indexOf('letterCodes: {');
  if (start === -1) throw new Error('letterCodes block not found');
  // Find the next top-level topic opener.
  const rest = src.slice(start);
  const nextTopic = rest.search(/\n {4}[a-zA-Z]+: \{$/m);
  const block = nextTopic === -1 ? rest : rest.slice(0, nextTopic);
  return block;
}

function parseQuestions(block) {
  const qs = [];
  const re = /id: (\d+),\s*difficulty: (\d+),[\s\S]*?question: "([^"]*)",[\s\S]*?explanation: "([^"]*)"/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    qs.push({
      id: Number(m[1]),
      difficulty: Number(m[2]),
      question: m[3],
      explanation: m[4],
    });
  }
  return qs;
}

function classifyShift(q) {
  const e = q.explanation;

  // Look for "forward N" or "back N" or "+N" or "-N" patterns.
  const forwardMatch = e.match(/(?:move(?:s)? (?:each letter )?forward|forward) (\d+)/i)
    || e.match(/\+(\d+)/)
    || e.match(/moves forward (\d+)/i);
  const backMatch = e.match(/(?:move(?:s)? (?:each letter )?back|back) (\d+)/i)
    || e.match(/-(\d+)/)
    || e.match(/moves back (\d+)/i);

  // "Move forward 1" and "Move one place back" both appear.
  const oneBackWord = /move(?:s)? (?:each letter |the letter )?(?:one place |one )?back/i.test(e)
    && !/forward/i.test(e);
  const oneForwardWord = /move(?:s)? (?:each letter |the letter )?(?:one place |one )?forward/i.test(e)
    && !/back/i.test(e);

  if (forwardMatch) return { direction: 'forward', size: Number(forwardMatch[1]) };
  if (backMatch) return { direction: 'back', size: Number(backMatch[1]) };
  if (oneBackWord) return { direction: 'back', size: 1 };
  if (oneForwardWord) return { direction: 'forward', size: 1 };

  return { direction: 'unknown', size: null };
}

function main() {
  const block = loadLetterCodes();
  const qs = parseQuestions(block);
  const genericTipQs = qs.filter(q => q.explanation.includes(GENERIC_TIP));

  console.log(`Total letterCodes Qs: ${qs.length}`);
  console.log(`Generic-tip Qs: ${genericTipQs.length}`);
  console.log('');

  const byShift = {};
  const unknowns = [];

  for (const q of genericTipQs) {
    const shift = classifyShift(q);
    const key = shift.direction === 'unknown' ? 'unknown' : `${shift.direction === 'forward' ? '+' : '-'}${shift.size}`;
    byShift[key] = (byShift[key] || []);
    byShift[key].push(q.id);
    if (shift.direction === 'unknown') {
      unknowns.push(q);
    }
  }

  console.log('Shift classification:');
  for (const [key, ids] of Object.entries(byShift).sort()) {
    console.log(`  ${key.padEnd(8)} ${ids.length.toString().padStart(3)} Qs: ${ids.slice(0, 10).join(', ')}${ids.length > 10 ? '...' : ''}`);
  }

  if (unknowns.length) {
    console.log('');
    console.log('Unclassified Qs (first 5 explanations):');
    for (const q of unknowns.slice(0, 5)) {
      console.log(`  Q${q.id}: ${q.explanation.slice(0, 120)}...`);
    }
  }

  // Emit JSON for downstream use.
  const out = {};
  for (const q of genericTipQs) {
    const shift = classifyShift(q);
    const key = shift.direction === 'unknown' ? 'unknown' : `${shift.direction === 'forward' ? '+' : '-'}${shift.size}`;
    out[q.id] = {
      shift: key,
      difficulty: q.difficulty,
      question: q.question,
      explanation: q.explanation,
    };
  }
  fs.writeFileSync(
    path.join(__dirname, 'letter-codes-classification.json'),
    JSON.stringify(out, null, 2),
  );
  console.log('');
  console.log(`Wrote scripts/letter-codes-classification.json (${Object.keys(out).length} Qs)`);
}

main();

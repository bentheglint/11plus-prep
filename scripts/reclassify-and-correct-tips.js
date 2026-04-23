#!/usr/bin/env node
// Re-classify letterCodes Qs using skill-based logic (the shift the child
// must APPLY, not the direction stated in the explanation). Then identify
// any Q where the currently-applied tip doesn't match the skill, and
// correct it.
//
// Handles 3 cases found in scan-letter-codes-all-shift-qs.js:
//  - Q4: misclassified (-3 skill got +3 tip applied) — swap tip
//  - Q88: no tip — add +3 tip
//  - Q112: old wrap-around tip — replace with +3 tip
//  - Q124: old generic "work out the rule" tip — replace with -3 tip
// Plus any other similar cases revealed by reclassification.

const fs = require('fs');
const path = require('path');

const CANONICAL_TIPS = {
  '+1': "For +1, each letter moves one step forward. A handy check: the last letter of the alphabet, Z, wraps round to A.",
  '-1': "For -1, each letter moves one step back. Watch the start of the alphabet — A wraps round to Z.",
  '+2': "For +2, skip one letter each time — B goes to D, skipping C. Use the alphabet line to count carefully.",
  '-2': "For -2, skip one letter going backwards — F goes to D, skipping E. Near A, letters wrap round to the end.",
  '+3': "For +3, use the EJOTY anchors (E=5, J=10, O=15, T=20, Y=25) as signposts — jump to the nearest anchor, then count on.",
  '-3': "For -3, count back three places using EJOTY anchors (E, J, O, T, Y) as signposts. Near A, letters wrap round to Z, Y, X.",
};

// Every historical tip that was being used on constant-shift Qs — we allow
// any of these to be replaced with the skill-appropriate canonical tip.
const REPLACEABLE_TIPS = [
  "Always check every letter — don't assume the shift from just the first one.",
  "Think of the alphabet as a circle — after Z comes A again, and before A comes Z. Count carefully at the boundaries!",
  "Always work out the rule from the example first, then apply it letter by letter to the new word.",
  "always test the shift on all four letters before applying it — don't trust just the first one.",
  "The bigger the shift, the more important it is to check every letter carefully.",
  "Never assume the shift is the same for every letter — always check each position separately, especially when the first two letters shift by different amounts.",
  "Larger shifts are trickier — write the alphabet out and count carefully. Don't rush!",
  "With -4, letters near the start of the alphabet will wrap around past A to the end (A-4=W).",
  "when you go back past A, loop round to Z — the alphabet works like a circle.",
  "+1 is the most common 11+ code — practise until it's automatic!",
  "For -3, count back three places. Watch out for wrap-around near A!",
  "For +2, skip one letter each time. B+2=D, skipping C.",
  "For +2, skip one letter each time. Use the alphabet line!",
  "For bigger shifts like +3, use the EJOTY trick (E=5, J=10, O=15, T=20, Y=25) as anchor points.",
  // Plus the six Oracle-canonical tips (so re-application is idempotent)
  ...Object.values(CANONICAL_TIPS),
];

function classifySkill(exp) {
  if (/\+1,\s*\+2,\s*\+3|\+2,\s*\+3,\s*\+4|progressive|increasing|pattern above the letters/i.test(exp)) return null;
  if (/mirror|A=Z|reverse.*alphabet|reflected/i.test(exp)) return null;

  let m = exp.match(/to decode[^.]*?forward (\d+)/i);
  if (m) return `+${m[1]}`;
  m = exp.match(/to decode[^.]*?back (\d+)/i);
  if (m) return `-${m[1]}`;

  m = exp.match(/(?:move(?:s)? (?:each letter )?forward|moves forward|moved forward) (\d+)/i);
  if (m) return `+${m[1]}`;
  m = exp.match(/(?:move(?:s)? (?:each letter )?back|moves back|moved back) (\d+)/i);
  if (m) return `-${m[1]}`;

  return null;
}

function main() {
  const vrPath = path.join(__dirname, '..', 'src', 'questionData', 'vrData.js');
  let src = fs.readFileSync(vrPath, 'utf8');

  // Extract letterCodes block.
  const start = src.indexOf('letterCodes: {');
  const rest = src.slice(start);
  const nextTopic = rest.search(/\n {4}[a-zA-Z]+: \{$/m);
  const block = nextTopic === -1 ? rest : rest.slice(0, nextTopic);

  const qRe = /id: (\d+),\s*difficulty: (\d+),[\s\S]*?question: "([^"]*)",[\s\S]*?explanation: "([^"]*)"/g;
  const qs = [];
  let m;
  while ((m = qRe.exec(block)) !== null) {
    qs.push({ id: Number(m[1]), explanation: m[3] /* unused */, rawExp: m[4] });
  }

  let updated = 0;
  const details = [];

  for (const q of qs) {
    const skill = classifySkill(q.rawExp);
    if (!skill || !CANONICAL_TIPS[skill]) continue;
    const canonical = CANONICAL_TIPS[skill];
    if (q.rawExp.includes(canonical)) continue;

    let newExp = q.rawExp;
    let replaced = false;

    // 1. Try replacing any known replaceable tip.
    for (const oldTip of REPLACEABLE_TIPS) {
      if (newExp.includes(`Tip: ${oldTip}`)) {
        newExp = newExp.replace(`Tip: ${oldTip}`, `Tip: ${canonical}`);
        replaced = true;
        break;
      }
    }

    // 2. If no tip at all, append one before the " ✓".
    if (!replaced && !/\bTip:/.test(newExp)) {
      if (newExp.endsWith(' ✓')) {
        newExp = newExp.slice(0, -2) + ` Tip: ${canonical} ✓`;
      } else {
        newExp = `${newExp} Tip: ${canonical}`;
      }
      replaced = true;
    }

    if (!replaced) {
      details.push({ id: q.id, skill, status: 'SKIPPED — unrecognised existing tip' });
      continue;
    }

    // Locate and replace in the full source.
    const oldEscaped = `explanation: "${q.rawExp}"`;
    const newEscaped = `explanation: "${newExp}"`;
    const occurrences = src.split(oldEscaped).length - 1;
    if (occurrences === 1) {
      src = src.replace(oldEscaped, newEscaped);
      updated++;
      details.push({ id: q.id, skill, status: 'updated' });
    } else {
      details.push({ id: q.id, skill, status: `SKIPPED — ${occurrences} matches` });
    }
  }

  fs.writeFileSync(vrPath, src);

  console.log(`Updated ${updated} Qs.`);
  for (const d of details) {
    console.log(`  Q${d.id} [${d.skill}]: ${d.status}`);
  }
}

main();

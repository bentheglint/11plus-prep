#!/usr/bin/env node
// Apply Oracle's canonical sub-type-specific tips to the 94 letterCodes Qs
// that currently use the generic "Always check every letter" tip.
//
// Uses the classification JSON produced by classify-letter-codes-tips.js.

const fs = require('fs');
const path = require('path');

const GENERIC_TIP = "Always check every letter — don't assume the shift from just the first one.";

// Oracle-approved canonical tips per shift sub-type.
const CANONICAL_TIPS = {
  '+1': "For +1, each letter moves one step forward. A handy check: the last letter of the alphabet, Z, wraps round to A.",
  '-1': "For -1, each letter moves one step back. Watch the start of the alphabet — A wraps round to Z.",
  '+2': "For +2, skip one letter each time — B goes to D, skipping C. Use the alphabet line to count carefully.",
  '-2': "For -2, skip one letter going backwards — F goes to D, skipping E. Near A, letters wrap round to the end.",
  '+3': "For +3, use the EJOTY anchors (E=5, J=10, O=15, T=20, Y=25) as signposts — jump to the nearest anchor, then count on.",
  '-3': "For -3, count back three places using EJOTY anchors (E, J, O, T, Y) as signposts. Near A, letters wrap round to Z, Y, X.",
};

function main() {
  const classificationPath = path.join(__dirname, 'letter-codes-classification.json');
  const classification = JSON.parse(fs.readFileSync(classificationPath, 'utf8'));

  const vrPath = path.join(__dirname, '..', 'src', 'questionData', 'vrData.js');
  let src = fs.readFileSync(vrPath, 'utf8');

  let replaced = 0;
  const missing = [];
  const ambiguous = [];

  for (const [id, info] of Object.entries(classification)) {
    const shift = info.shift;
    const newTip = CANONICAL_TIPS[shift];
    if (!newTip) {
      missing.push({ id, shift });
      continue;
    }

    const oldExplanation = info.explanation;
    const newExplanation = oldExplanation.replace(
      `Tip: ${GENERIC_TIP}`,
      `Tip: ${newTip}`,
    );

    if (newExplanation === oldExplanation) {
      missing.push({ id, shift, reason: 'generic tip not found in explanation' });
      continue;
    }

    // Locate the exact explanation string in vrData.js.
    const oldEscaped = `explanation: "${oldExplanation}"`;
    const newEscaped = `explanation: "${newExplanation}"`;

    // Count matches — must be exactly 1 (unique).
    const parts = src.split(oldEscaped);
    if (parts.length - 1 === 0) {
      missing.push({ id, shift, reason: 'explanation string not found in vrData.js' });
      continue;
    }
    if (parts.length - 1 > 1) {
      ambiguous.push({ id, shift, matches: parts.length - 1 });
      continue;
    }

    src = parts.join(newEscaped);
    replaced++;
  }

  fs.writeFileSync(vrPath, src);

  console.log(`Replaced: ${replaced} Qs`);
  if (missing.length) {
    console.log(`Missing: ${missing.length}`);
    for (const m of missing) console.log(`  Q${m.id} (${m.shift}): ${m.reason || 'no canonical tip'}`);
  }
  if (ambiguous.length) {
    console.log(`Ambiguous (multiple matches — skipped): ${ambiguous.length}`);
    for (const a of ambiguous) console.log(`  Q${a.id} (${a.shift}): ${a.matches} matches`);
  }

  const remaining = src.match(new RegExp(`Tip: ${GENERIC_TIP.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'));
  console.log('');
  console.log(`Remaining generic-tip occurrences in vrData.js: ${remaining ? remaining.length : 0}`);
}

main();

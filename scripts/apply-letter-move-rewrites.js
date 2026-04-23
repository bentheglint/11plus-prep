#!/usr/bin/env node
// Apply Oracle's letterMove replacement Qs.
// For each Q, replace question, options, correct, explanation. Preserves
// id, difficulty, and any other fields.

const fs = require('fs');
const path = require('path');

const REPLACEMENTS = {
  36: {
    question: "Move one letter from one word to the other to make two new words: ORE  PRICE",
    options: ["E","O","P","I","R"],
    correct: 2,
    explanation: "Move 'P' from PRICE to make RICE, and insert it into ORE to make PORE. The letter moves right to left here! Tip: Always try both directions — and check that BOTH resulting words are real (not just plurals). ✓",
  },
  42: {
    question: "Move one letter from one word to the other to make two new words: OLD  CLOUD",
    options: ["O","C","L","U","D"],
    correct: 1,
    explanation: "Move 'C' from CLOUD to make LOUD, and insert it into OLD to make COLD. The letter moves right to left here! Tip: Check BOTH resulting words are real — and check that neither is just a plural of the original! ✓",
  },
  45: {
    question: "Move one letter from one word to the other to make two new words: RAY  FLAKE",
    options: ["A","K","F","R","E"],
    correct: 2,
    explanation: "Move 'F' from FLAKE to make LAKE, and insert it into RAY to make FRAY. The letter moves right to left here! Tip: Always try both directions — and check that BOTH resulting words are real. ✓",
  },
  49: {
    question: "Move one letter from one word to the other to make two new words: HIGH  TRACE",
    options: ["H","T","R","C","G"],
    correct: 1,
    explanation: "Move 'T' from TRACE to make RACE, and insert it into HIGH to make THIGH. The letter moves right to left here! Tip: Always try both directions — and check that BOTH resulting words are real (not just plurals). ✓",
  },
  50: {
    question: "Move one letter from one word to the other to make two new words: OUR  TRAIL",
    options: ["T","R","A","L","O"],
    correct: 0,
    explanation: "Move 'T' from TRAIL to make RAIL, and insert it into OUR to make TOUR. The letter moves right to left here! Tip: Always try both directions — and check that BOTH resulting words are real (not just plurals). ✓",
  },
  52: {
    question: "Move one letter from one word to the other to make two new words: ARM  NEWT",
    options: ["N","E","W","T","R"],
    correct: 2,
    explanation: "Move 'W' from NEWT to make NET, and insert it into ARM to make WARM. The letter moves right to left here! Tip: Always try both directions — the letter doesn't have to come from an S word! ✓",
  },
  64: {
    question: "Move one letter from one word to the other to make two new words: PIN  TROUT",
    options: ["R","I","T","U","N"],
    correct: 2,
    explanation: "Move 'T' from TROUT to make ROUT, and insert it into PIN to make PINT. The letter moves right to left here! Tip: Always try both directions — and check that BOTH resulting words are real (not just plurals). ✓",
  },
  67: {
    question: "Move one letter from one word to the other to make two new words: ALE  STAGE",
    options: ["L","A","T","G","S"],
    correct: 2,
    explanation: "Move 'T' from STAGE to make SAGE, and insert it into ALE to make TALE. The letter moves right to left here! Tip: Always try each letter one by one — sometimes more than one feels right, but only one gives two real words. ✓",
  },
  69: {
    question: "Move one letter from one word to the other to make two new words: LIP  SHARE",
    options: ["L","S","H","R","P"],
    correct: 1,
    explanation: "Move 'S' from SHARE to make HARE, and insert it into LIP to make SLIP. The letter moves right to left here! Tip: Always try both directions — and check every letter, not just the obvious one. ✓",
  },
  80: {
    question: "Move one letter from one word to the other to make two new words: TRAIN  HEN",
    options: ["R","T","A","I","H"],
    correct: 1,
    explanation: "Move 'T' from TRAIN to make RAIN, and insert it into HEN to make THEN. Tip: The letter can come from ANY position — start, middle, or end! ✓",
  },
  82: {
    question: "Move one letter from one word to the other to make two new words: FORM  EAT",
    options: ["F","A","T","M","O"],
    correct: 3,
    explanation: "Move 'M' from the end of FORM to make FOR, and insert it into EAT to make MEAT. Tip: The letter can come from ANY position — start, middle, or end! ✓",
  },
  88: {
    question: "Move one letter from one word to the other to make two new words: LAND  BAR",
    options: ["R","A","D","B","N"],
    correct: 4,
    explanation: "Move 'N' from the middle of LAND to make LAD, and insert it to the end of BAR to make BARN. Tip: The letter can come from ANY position — start, middle, or end! ✓",
  },
  92: {
    question: "Move one letter from one word to the other to make two new words: PILE  CAN",
    options: ["P","I","L","C","N"],
    correct: 2,
    explanation: "Move 'L' from the middle of PILE to make PIE, and insert it into the middle of CAN to make CLAN. Tip: The letter can come from ANY position — start, middle, or end! ✓",
  },
  94: {
    question: "Move one letter from one word to the other to make two new words: COAT  PIN",
    options: ["A","P","O","T","C"],
    correct: 0,
    explanation: "Move 'A' from the middle of COAT to make COT, and insert it into the middle of PIN to make PAIN. Tip: The letter can come from ANY position — start, middle, or end! ✓",
  },
  97: {
    question: "Move one letter from one word to the other to make two new words: BIRD  CAT",
    options: ["B","A","C","R","I"],
    correct: 3,
    explanation: "Move 'R' from the middle of BIRD to make BID, and insert it into the middle of CAT to make CART. Tip: The letter can come from ANY position — start, middle, or end! ✓",
  },
};

function jsonStringifyArray(arr) {
  // Match the existing file style: ["A","B","C","D","E"] (no spaces).
  return '[' + arr.map(s => `"${s}"`).join(',') + ']';
}

function main() {
  const vrPath = path.join(__dirname, '..', 'src', 'questionData', 'vrData.js');
  let src = fs.readFileSync(vrPath, 'utf8');

  // Find the letterMove block span.
  const lmStart = src.indexOf('letterMove: {');
  if (lmStart === -1) throw new Error('letterMove block not found');
  const after = src.slice(lmStart);
  const nextTopicRe = /\n {4}[a-zA-Z]+: \{$/m;
  const nextTopicMatch = after.match(nextTopicRe);
  const lmEnd = nextTopicMatch ? lmStart + nextTopicMatch.index : src.length;

  let lmBlock = src.slice(lmStart, lmEnd);

  let updated = 0;
  const failed = [];

  for (const [id, rep] of Object.entries(REPLACEMENTS)) {
    // Build a regex that matches the Q with this ID within the letterMove block.
    // We'll match: `          id: <N>,\n...until the closing `,\n        },`
    const qRe = new RegExp(
      '(\\{\\s*id: ' + id + ',[^]*?)(\\},)',
      'm',
    );
    const match = lmBlock.match(qRe);
    if (!match) {
      failed.push({ id, reason: 'Q not found' });
      continue;
    }
    const fullMatch = match[0];

    // Re-build the Q body preserving `id`, `difficulty`, and any other
    // fields between difficulty and question. Extract difficulty.
    const difficultyMatch = fullMatch.match(/difficulty: (\d+)/);
    if (!difficultyMatch) {
      failed.push({ id, reason: 'difficulty not found' });
      continue;
    }
    const difficulty = difficultyMatch[1];

    // Preserve any extra fields between "difficulty" and "question" (some
    // Qs may have visual/questionType). Extract them verbatim.
    const extraMatch = fullMatch.match(/difficulty: \d+,([\s\S]*?)(question:|correct:)/);
    const extraFields = extraMatch ? extraMatch[1] : '\n          ';

    // Normalise: ensure extraFields ends with newline + indent before "question:"
    const trimmedExtra = extraFields.replace(/\s*$/, '');
    const extraWithNewline = trimmedExtra.endsWith(',') || trimmedExtra === ''
      ? trimmedExtra
      : trimmedExtra + ',';

    const newBody = `{
          id: ${id},
          difficulty: ${difficulty},${extraWithNewline}
          question: "${rep.question}",
          options: ${jsonStringifyArray(rep.options)},
          correct: ${rep.correct},
          explanation: "${rep.explanation}"
        },`;

    lmBlock = lmBlock.replace(fullMatch, newBody);
    updated++;
  }

  const newSrc = src.slice(0, lmStart) + lmBlock + src.slice(lmEnd);
  fs.writeFileSync(vrPath, newSrc);

  console.log(`Updated ${updated}/${Object.keys(REPLACEMENTS).length} Qs.`);
  if (failed.length) {
    for (const f of failed) console.log(`  FAILED Q${f.id}: ${f.reason}`);
  }
}

main();

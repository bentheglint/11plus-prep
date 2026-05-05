#!/usr/bin/env node
// One-shot applier for Oracle G's Tier 1 vocabulary length-tell fixes.
// 30 questions; each gets options array + correct index replaced.
// Run once, then this script is documentation; can be deleted later.

const fs = require('node:fs');
const path = require('node:path');

const SRC = path.join(__dirname, '..', '..', 'src', 'questionData', 'englishData.js');

// Each entry: [questionId, oldOptionsJSON, newOptionsJSON, newCorrect]
// oldOptionsJSON is matched literally against the file content; the script
// replaces only when a unique match is found AND the surrounding context
// names the right question id (so we don't accidentally match a similar
// options array in a different topic).
const FIXES = [
  // 1. Q42 — D1, ratio 7.17×
  [42, '["Clever", "Funny", "Strict", "Able to wait calmly without getting annoyed", "Young"]',
       '["Quick to lose their temper", "Always playing silly tricks", "Strict and unforgiving with pupils", "Able to wait calmly without getting annoyed", "Too young to understand the lesson"]', 3],
  // 2. Q303 — D3, ratio 7.17×
  [303, '["Brave", "Honest", "Quiet", "Angry", "Praising someone excessively to gain favour"]',
        '["Bravely defying the king\'s wishes", "Honestly disagreeing when needed", "Quietly carrying out their duties", "Angrily resenting the king\'s power", "Praising someone excessively to gain favour"]', 4],
  // 3. Q56 — D2, ratio 6.60× — synonym fix (single-word answer)
  [56, '["Quiet", "Rude", "Fluent and persuasive in speaking", "Shy", "Loud"]',
       '["Quiet", "Rude", "Articulate", "Shy", "Boastful"]', 2],
  // 4. Q133 — D1
  [133, '["Young", "Tall", "Naughty", "Quiet", "Careless in movement and likely to drop things"]',
        '["Too young to be allowed near the vase", "So tall he could barely see the table", "Naughty and trying to break things on purpose", "Quietly tiptoeing around the room", "Careless in movement and likely to drop things"]', 4],
  // 5. Q82 — D3 synonym
  [82, '["Weak", "Simple", "Friendly", "Inspiring fear or respect through being powerful", "Tiny"]',
       '["Feeble", "Trivial", "Approachable", "Intimidating", "Insignificant"]', 3],
  // 6. Q326 — D3
  [326, '["Retired", "Nervous", "Famous and respected in a particular field", "Foreign", "Young"]',
        '["Recently retired from public speaking", "Nervously preparing for the speech", "Famous and respected in a particular field", "From a foreign university overseas", "Young and just starting their career"]', 2],
  // 7. Q137 — D1
  [137, '["Friendly", "Large", "Fast", "Clever at achieving things through deception", "Hungry"]',
        '["Friendly toward the farmyard animals", "Large enough to scare them away", "Fast enough to outrun the farmer", "Clever at achieving things through deception", "Hungry after a long day in the woods"]', 3],
  // 8. Q321 — D3 synonym
  [321, '["Lazy", "Quiet", "Holding firmly and refusing to give up", "Nervous", "Wealthy"]',
        '["Lethargic", "Reserved", "Persistent", "Apprehensive", "Affluent"]', 2],
  // 9. Q69 — D2
  [69, '["Calm, peaceful, and untroubled", "Frozen", "Deep", "Large", "Dirty"]',
       '["Calm, peaceful, and untroubled", "Frozen solid from the cold", "Deeper than anyone had measured", "Large enough to be seen from miles", "Dirty after weeks of heavy rain"]', 0],
  // 10. Q89 — D3
  [89, '["Unconventional and slightly strange", "Clever", "Boring", "Famous", "Elderly"]',
       '["Unconventional and slightly strange", "Clever in a quietly thoughtful way", "Boring in lectures and dull in person", "Famous throughout the academic world", "Elderly and approaching retirement"]', 0],
  // 11. Q92 — D3
  [92, '["Destroy", "Ignore", "Copy", "Examine very closely and thoroughly", "Collect"]',
       '["Destroy any unhelpful pieces of evidence", "Ignore parts that seemed unimportant", "Copy each item exactly into a notebook", "Examine very closely and thoroughly", "Collect more samples for the trial"]', 3],
  // 12. Q299 — D3
  [299, '["Boring", "Cheerful", "Factual", "Lengthy", "Evoking a keen sense of sadness or pity"]',
        '["Boring and difficult to read through", "Cheerful despite the dark subject", "Factual and based on real events", "Lengthy and full of unnecessary detail", "Evoking a keen sense of sadness or pity"]', 4],
  // 13. Q35 — D1 synonym
  [35, '["Unsure", "Having a firm decision to do something", "Lazy", "Angry", "Cheerful"]',
       '["Unsure", "Resolute", "Lazy", "Angry", "Cheerful"]', 1],
  // 14. Q60 — D2 synonym
  [60, '["Stubborn", "Able to adapt to many different uses", "Boring", "Weak", "Clumsy"]',
       '["Stubborn", "Adaptable", "Predictable", "Fragile", "Awkward"]', 1],
  // 15. Q298 — D3
  [298, '["Frightened", "Hungry", "Large", "Old", "Clever at gaining advantage through trickery"]',
        '["Frightened by the sight of every snare", "Hungry enough to risk being caught", "Large and powerful enough to break free", "Old and slow but still surviving", "Clever at gaining advantage through trickery"]', 4],
  // 16. Q67 — D2
  [67, '["Bright", "Warm", "Windy", "Dark, dull, and depressing", "Cold"]',
       '["Bright and full of summer sunshine", "Warm with a soft afternoon breeze", "Windy enough to rattle the windows", "Dark, dull, and depressing", "Cold but still and perfectly clear"]', 3],
  // 17. Q70 — D2
  [70, '["Careful", "Without thinking about danger", "Slow", "Skilful", "Tired"]',
       '["Careful to obey every traffic signal", "Without thinking about danger", "Slow enough to annoy other drivers", "Skilful at handling the busy road", "Tired after a very long journey"]', 1],
  // 18. Q297 — D3
  [297, '["Song", "Question", "Whisper", "A sharp expression of disapproval", "Joke"]',
        '["A short, cheerful song to settle the class", "A surprising question about the lesson", "A quiet whisper meant only for one pupil", "A sharp expression of disapproval", "A funny joke that broke the tension"]', 3],
  // 19. Q265 — D3 synonym
  [265, '["Reckless", "Impatient", "Wise and careful in practical matters", "Arrogant", "Generous"]',
        '["Reckless", "Impatient", "Sensible", "Arrogant", "Generous"]', 2],
  // 20. Q90 — D3
  [90, '["Refusal", "An earnest attempt or effort", "Hobby", "Lesson", "Wish"]',
       '["A flat refusal to keep practising", "An earnest attempt or effort", "A relaxed hobby for spare time", "A weekly lesson with a new teacher", "A quiet wish she rarely spoke about"]', 1],
  // 21. Q63 — D2
  [63, '["Excited", "Confident", "Bored", "Pleased", "Anxious or fearful about the future"]',
       '["Excited about seeing her grades at last", "Confident she had done extremely well", "Bored by all the talk of the exam", "Pleased to have the wait nearly over", "Anxious or fearful about the future"]', 4],
  // 22. Q55 — D2 synonym
  [55, '["Lazy", "Hardworking and careful", "Clever", "Quick", "Brave"]',
       '["Lazy", "Industrious", "Clever", "Quick", "Brave"]', 1],
  // 23. Q292 — D3
  [292, '["Anger", "Confusion", "Excitement", "The state of being calm and in control", "Sadness"]',
        '["A sudden burst of anger and frustration", "A clear sign of confusion at the questions", "A nervous excitement about the talks", "The state of being calm and in control", "An obvious sadness about the outcome"]', 3],
  // 24. Q296 — D3
  [296, '["Modest", "Secret", "Designed to impress and attract notice", "Accidental", "Generous"]',
        '["Modest and tucked quietly out of sight", "Kept carefully secret from the neighbours", "Designed to impress and attract notice", "An accidental glimpse of his wealth", "Generously shared with everyone in need"]', 2],
  // 25. Q91 — D3
  [91, '["Frightened", "Lost", "Showing a bold willingness to take risks", "Famous", "Experienced"]',
       '["Frightened of being far from civilisation", "Lost in unfamiliar and shifting terrain", "Showing a bold willingness to take risks", "Famous from previous expeditions abroad", "Experienced from many years of travel"]', 2],
  // 26. Q255 — D2
  [255, '["Bored", "Fascinated and held the attention of", "Frightened", "Ignored", "Trapped"]',
        '["Bored by a story they had heard before", "Fascinated and held the attention of", "Frightened by some of the darker scenes", "Ignored by the storyteller throughout", "Trapped at the back with no clear view"]', 1],
  // 27. Q210 — D2
  [210, '["Kept in good condition over time", "Destroyed", "Hidden", "Painted", "Rebuilt"]',
        '["Kept in good condition over time", "Destroyed beyond any hope of repair", "Hidden completely beneath the sand", "Painted in their original bright colours", "Rebuilt entirely by modern engineers"]', 0],
  // 28. Q62 — D2
  [62, '["Admiration", "Sympathy", "Fear", "A feeling that someone is worthless", "Jealousy"]',
       '["A genuine admiration for their cleverness", "A real sympathy for their difficult position", "A clear fear of being caught himself", "A feeling that someone is worthless", "A bitter jealousy of their high marks"]', 3],
  // 29. Q83 — D3 synonym
  [83, '["Shy", "Graceful", "Greedy", "Grumpy", "Fond of company and sociable"]',
       '["Shy", "Graceful", "Greedy", "Grumpy", "Sociable"]', 4],
  // 30. Q93 — D3
  [93, '["Clever", "Lonely", "Powerful", "Mysterious", "Having a wish to do evil to others"]',
       '["Clever at outwitting the hero\'s allies", "Lonely from years spent in exile", "Powerful enough to threaten the kingdom", "Mysterious and rarely seen by anyone", "Having a wish to do evil to others"]', 4],
];

let src = fs.readFileSync(SRC, 'utf8');

// Search the entire file. Vocabulary-themed questions live BOTH in the
// `vocabulary: { ... }` topic block AND in `vocabulary-in-context`
// sub-questions inside comprehension passages. Each format styles JSON
// keys differently — vocabulary block uses quoted keys; comprehension
// passage questions use unquoted keys. We disambiguate by anchoring the
// match on the unique options array — every Tier-1 fix changes a
// distinct, recognisable options array.
const vocabStart = 0;
const vocabEnd = src.length;
console.log(`Searching whole file (chars ${vocabStart}..${vocabEnd})`);

let applied = 0;
let skipped = 0;
const failures = [];

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

for (const [id, oldOpts, newOpts, newCorrect] of FIXES) {
  const oldItems = JSON.parse(oldOpts);
  const newOptsItems = JSON.parse(newOpts);

  // Build patterns for BOTH the multi-line double-quoted format (used in
  // the vocabulary topic) and the single-line unquoted format (used in
  // comprehension passages' vocabulary-in-context questions).
  const itemPatternDQ = oldItems.map(it => `"${escapeRe(it)}"`).join('\\s*,\\s*');
  const itemPatternSQ = oldItems.map(it => `'${escapeRe(it.replace(/'/g, "\\\\'"))}'`).join('\\s*,\\s*');

  const dqRe = new RegExp(`"options":\\s*\\[\\s*${itemPatternDQ}\\s*\\]`);
  const sqUnquotedRe = new RegExp(`(?<!"\\w*)\\boptions:\\s*\\[\\s*${itemPatternDQ}\\s*\\]`);
  const sqQuotedRe = new RegExp(`(?<!"\\w*)\\boptions:\\s*\\[\\s*${itemPatternSQ}\\s*\\]`);

  let matched = null;
  let style = null;
  if (dqRe.test(src)) { matched = src.match(dqRe)[0]; style = 'dq'; }
  else if (sqUnquotedRe.test(src)) { matched = src.match(sqUnquotedRe)[0]; style = 'sqUnq'; }
  else if (sqQuotedRe.test(src)) { matched = src.match(sqQuotedRe)[0]; style = 'sqQ'; }

  if (!matched) {
    failures.push(`Q${id}: options array not found in any format`);
    skipped++;
    continue;
  }

  // Build replacement matching the original style
  let newOptsLiteral;
  if (style === 'dq') {
    newOptsLiteral = `"options": [\n            "${newOptsItems.map(it => it.replace(/"/g, '\\"')).join('",\n            "')}"\n          ]`;
  } else if (style === 'sqUnq') {
    // unquoted key, double-quoted strings, single-line — match
    // comprehension passage style: options: ["A","B",...]
    newOptsLiteral = `options: [${newOptsItems.map(it => `"${it.replace(/"/g, '\\"')}"`).join(',')}]`;
  } else {
    // single-quoted strings
    newOptsLiteral = `options: [${newOptsItems.map(it => `'${it.replace(/'/g, "\\'")}'`).join(',')}]`;
  }
  src = src.replace(matched, newOptsLiteral);

  // Update the `correct` field that comes AFTER this options array. We
  // need to be precise because there may be many `correct:` lines in the
  // file. Approach: find the matched options array's position, then look
  // forward up to 400 chars for the next `correct:` (or `"correct":`)
  // and replace it.
  const replacedIdx = src.indexOf(newOptsLiteral);
  if (replacedIdx >= 0) {
    const after = src.slice(replacedIdx + newOptsLiteral.length, replacedIdx + newOptsLiteral.length + 400);
    const correctMatch = after.match(/("?correct"?):\s*(\d+)/);
    if (correctMatch) {
      const before = src.slice(0, replacedIdx + newOptsLiteral.length);
      const tail = src.slice(replacedIdx + newOptsLiteral.length);
      src = before + tail.replace(/("?correct"?):\s*\d+/, `$1: ${newCorrect}`);
    }
  }
  applied++;
}

if (applied > 0) {
  fs.writeFileSync(SRC, src);
}

console.log('');
console.log(`Applied: ${applied}/${FIXES.length}`);
console.log(`Skipped: ${skipped}`);
if (failures.length > 0) {
  console.log('Failures:');
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
process.exit(0);

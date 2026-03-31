const fs = require('fs');
const path = require('path');

const ENGLISH_DATA = path.join(__dirname, '..', 'src/questionData/englishData.js');
const VR_DATA = path.join(__dirname, '..', 'src/questionData/vrData.js');
let englishData = fs.readFileSync(ENGLISH_DATA, 'utf8');

// ============================================================
// TASK 1: Fix Spelling position bias — B at 28%, need ~20%
// Swap ~32 B answers to C and D
// ============================================================
console.log('=== TASK 1: Spelling position bias ===');
{
  const start = englishData.indexOf('spelling: {');
  const end = englishData.indexOf('punctuation:', start);
  let section = englishData.substring(start, end);

  const blocks = section.split(/(?=\{[\s\n]*(?:["']?id["']?)\s*:\s*\d)/);
  let swapCount = 0;
  const targetSwaps = 32; // Move ~32 from B to C/D

  for (const block of blocks) {
    if (swapCount >= targetSwaps) break;
    const corrM = block.match(/"correct":\s*1|correct:\s*1/);
    if (!corrM) continue;

    // Find options
    const optsM = block.match(/["']?options["']?\s*:\s*\[([\s\S]*?)\]/);
    if (!optsM) continue;
    const opts = [...optsM[1].matchAll(/["']([^"']*?)["']/g)].map(m => m[1]);
    if (opts.length !== 5) continue;

    // For error-spotting: options are "Section A"..."No mistake" — can't swap these
    // For error-spotting, "correct" means which SEGMENT has the error
    // Swapping options would change which segment label maps to which position
    // Instead we'd need to restructure the sentence — too complex for a script
    // BUT: we can check if these are standard MC or error-spotting
    if (block.includes('error-spotting') || block.includes('segments')) continue;

    // Standard MC — swap option B (idx 1) with C or D
    const newCorrect = swapCount % 2 === 0 ? 2 : 3; // alternate C and D
    const temp = opts[1];
    opts[1] = opts[newCorrect];
    opts[newCorrect] = temp;

    const newOptsStr = opts.map(o => '"' + o.replace(/"/g, '\\"') + '"').join(', ');
    let newBlock = block.replace(optsM[0], optsM[0].replace(optsM[1], newOptsStr));
    newBlock = newBlock.replace(corrM[0], corrM[0].replace(/:\s*1/, ': ' + newCorrect));

    const blockPos = englishData.indexOf(block, start);
    if (blockPos >= 0) {
      englishData = englishData.substring(0, blockPos) + newBlock + englishData.substring(blockPos + block.length);
      swapCount++;
    }
  }
  console.log('Swapped ' + swapCount + ' spelling questions from B to C/D');

  // Note: for error-spotting, "correct" = segment index (0-3 for A-D, 4 for no mistake)
  // The position of the ERROR in the sentence determines the answer — can't be swapped
  // This is inherent to the question design and is acceptable
  if (swapCount === 0) {
    console.log('All spelling Qs are error-spotting — position is determined by error location, not option order');
    console.log('This is acceptable — GL error-spotting positions are set by sentence structure');
  }
}

// ============================================================
// TASK 2: Spelling explanation warmth pass
// ============================================================
console.log('\n=== TASK 2: Spelling explanation warmth ===');
{
  const start = englishData.indexOf('spelling: {');
  const end = englishData.indexOf('punctuation:', start);
  let section = englishData.substring(start, end);

  const spellingTips = [
    "Look out for this one in the exam — it catches lots of people!",
    "A great one to practise — say the word slowly and listen for each sound.",
    "If you're unsure, try writing it both ways and see which looks right.",
    "Break the word into chunks to help remember the tricky bit.",
    "This is on the Year 5-6 spelling list — worth memorising!",
    "Sound it out carefully — the spelling matches the sounds here.",
    "Loads of people get this wrong — you'll have an advantage if you remember it!",
    "Try making up a silly sentence to remember this spelling.",
    "This word has a sneaky silent letter — watch out for it in the exam!",
    "Picture the word in your mind — visual memory helps with tricky spellings.",
  ];

  let tipCount = 0;
  const pattern = /(["']?explanation["']?\s*:\s*["'])([^"']*?)(["']\s*[\n,])/g;

  section = section.replace(pattern, (full, prefix, expl, suffix) => {
    if (expl.toLowerCase().match(/tip:|remember|trick|look out|watch out|helpful|practise/)) return full;
    if (expl.length < 40) return full; // skip very short (likely parsing issue)

    const tip = spellingTips[tipCount % spellingTips.length];
    tipCount++;

    // Add tip before checkmark
    let improved = expl;
    if (improved.endsWith(' ✓')) {
      improved = improved.slice(0, -2) + ' ' + tip + ' ✓';
    } else if (improved.endsWith('✓')) {
      improved = improved.slice(0, -1) + ' ' + tip + ' ✓';
    } else {
      improved += ' ' + tip;
    }

    return prefix + improved + suffix;
  });

  console.log('Added tips to ' + tipCount + ' spelling explanations');
  englishData = englishData.substring(0, start) + section + englishData.substring(end);
}

// ============================================================
// TASK 3: Vocabulary explanation warmth pass
// ============================================================
console.log('\n=== TASK 3: Vocabulary explanation warmth ===');
{
  const start = englishData.indexOf('vocabulary:');
  const end = englishData.indexOf('wordClassGrammar:', start);
  let section = englishData.substring(start, end);

  const vocabTips = [
    "Building a strong vocabulary gives you a real advantage in the 11+ exam!",
    "Try using this word in a sentence today — that's how you make it stick.",
    "Reading widely is the best way to learn words like this naturally.",
    "When you meet an unfamiliar word, look for prefixes and suffixes you recognise.",
    "This is a great word to impress your teacher with in your writing!",
    "Words with similar meanings often have subtle differences — precision matters.",
    "Context is your best friend — the words around it tell you what it means.",
    "Learning word families helps you work out meanings you've never seen before.",
    "This type of question appears regularly in GL papers — practise spotting the differences.",
    "Think about when you'd use this word versus its synonym — that's the key difference.",
  ];

  let tipCount = 0;
  const pattern = /(["']?explanation["']?\s*:\s*["'])([^"']*?)(["']\s*[\n,])/g;

  section = section.replace(pattern, (full, prefix, expl, suffix) => {
    if (expl.toLowerCase().match(/tip:|remember|trick|building|advantage|practise|try using/)) return full;
    if (expl.length < 40) return full;

    const tip = vocabTips[tipCount % vocabTips.length];
    tipCount++;

    let improved = expl;
    if (improved.endsWith(' ✓')) {
      improved = improved.slice(0, -2) + ' ' + tip + ' ✓';
    } else if (improved.endsWith('✓')) {
      improved = improved.slice(0, -1) + ' ' + tip + ' ✓';
    } else {
      improved += ' ' + tip;
    }

    return prefix + improved + suffix;
  });

  console.log('Added tips to ' + tipCount + ' vocabulary explanations');
  englishData = englishData.substring(0, start) + section + englishData.substring(end);
}

// ============================================================
// TASK 5: Word Class D3 deficit — need ~19 more D3
// Add new questions at end of wordClassGrammar
// ============================================================
console.log('\n=== TASK 5: Word Class D3 questions ===');
{
  const newD3 = [
    { id: 386, difficulty: 3, question: "In 'The sleeping baby smiled', what word class is 'sleeping'?", options: ["Verb","Noun","Adjective","Adverb","Pronoun"], correct: 2, explanation: "'Sleeping' is an ADJECTIVE here — it describes the baby (which baby? the sleeping one). Even though 'sleeping' comes from the verb 'to sleep', it's functioning as an adjective because it modifies a noun. ✓" },
    { id: 387, difficulty: 3, question: "In 'She felt well after her rest', what word class is 'well'?", options: ["Adverb","Adjective","Noun","Verb","Conjunction"], correct: 1, explanation: "'Well' is an ADJECTIVE here — it describes how she felt (her state of health). In 'She played well', it would be an adverb. After 'feel/seem/look', 'well' is usually an adjective. ✓" },
    { id: 388, difficulty: 3, question: "In 'He arrived late', what word class is 'late'?", options: ["Adjective","Noun","Adverb","Preposition","Conjunction"], correct: 2, explanation: "'Late' is an ADVERB here — it describes WHEN he arrived. In 'the late train', it would be an adjective. 'Late' is a flat adverb — same form as the adjective. Don't add '-ly'! ✓" },
    { id: 389, difficulty: 3, question: "In 'Since Monday, it has rained every day', what word class is 'since'?", options: ["Conjunction","Adverb","Preposition","Adjective","Pronoun"], correct: 2, explanation: "'Since' is a PREPOSITION here — it's followed by a noun ('Monday'). In 'Since she left, I've been lonely', it would be a conjunction (followed by a clause). In 'I haven't seen him since', it's an adverb (standing alone). Three classes! ✓" },
    { id: 390, difficulty: 3, question: "In 'The daily paper arrived', what word class is 'daily'?", options: ["Adverb","Noun","Verb","Adjective","Preposition"], correct: 3, explanation: "'Daily' is an ADJECTIVE here — it describes the noun 'paper'. In 'It happens daily', it would be an adverb. Words ending in '-ly' aren't always adverbs — 'daily', 'early', 'friendly', 'lonely' can all be adjectives. ✓" },
    { id: 391, difficulty: 3, question: "In 'She set a fast pace', what word class is 'fast'?", options: ["Adverb","Verb","Noun","Adjective","Pronoun"], correct: 3, explanation: "'Fast' is an ADJECTIVE — it describes the noun 'pace'. In 'She ran fast', it would be an adverb. 'Fast' never changes form between adjective and adverb — no 'fastly'! ✓" },
    { id: 392, difficulty: 3, question: "Which word is a preposition in: 'The cat jumped over the wall and through the hedge'?", options: ["jumped","wall","and","over","cat"], correct: 3, explanation: "'Over' is a preposition — it shows the relationship between 'jumped' and 'the wall'. 'Through' is also a preposition. Prepositions show position, direction, or time. ✓" },
    { id: 393, difficulty: 3, question: "In 'I need to iron my shirt before school', what word class is 'iron'?", options: ["Noun","Adjective","Adverb","Verb","Preposition"], correct: 3, explanation: "'Iron' is a VERB here — the action of pressing clothes. In 'the iron gate', it's an adjective. In 'I bought an iron', it's a noun. Same word, three different classes depending on the sentence! ✓" },
    { id: 394, difficulty: 3, question: "In 'That sounds right to me', what word class is 'right'?", options: ["Noun","Verb","Adjective","Adverb","Conjunction"], correct: 2, explanation: "'Right' is an ADJECTIVE here — it describes what it sounds like (correct). After verbs like 'sounds', 'feels', 'looks', 'seems', we use adjectives not adverbs. ✓" },
    { id: 395, difficulty: 3, question: "In 'They left after the show', what word class is 'after'?", options: ["Adverb","Conjunction","Adjective","Preposition","Pronoun"], correct: 3, explanation: "'After' is a PREPOSITION here — followed by the noun 'the show'. In 'They left after she sang', it would be a conjunction (followed by a clause). Same test as 'before' and 'since' — what follows determines the class. ✓" },
    { id: 396, difficulty: 3, question: "In 'The outside wall needs painting', what word class is 'outside'?", options: ["Preposition","Noun","Adjective","Adverb","Verb"], correct: 2, explanation: "'Outside' is an ADJECTIVE here — it describes which wall. In 'go outside', it's an adverb. In 'the outside of the box', it's a noun. In 'outside the door', it's a preposition. Four possible classes! ✓" },
    { id: 397, difficulty: 3, question: "In 'She can still come if she wants', what word class is 'still'?", options: ["Adjective","Noun","Verb","Conjunction","Adverb"], correct: 4, explanation: "'Still' is an ADVERB here — it modifies the verb 'come' (meaning even now, despite something). In 'still water', it's an adjective (not moving). In 'the still of the night', it's a noun. ✓" },
    { id: 398, difficulty: 3, question: "What word class is 'like' in: 'She swims like a fish'?", options: ["Verb","Adjective","Conjunction","Preposition","Adverb"], correct: 3, explanation: "'Like' is a PREPOSITION here — it introduces a comparison with the noun 'a fish'. In 'I like cake', it's a verb. In 'like-minded' it's an adjective. In informal speech, 'like' is also used as a conjunction ('do it like I showed you'). ✓" },
    { id: 399, difficulty: 3, question: "In 'The very idea is absurd', what word class is 'very'?", options: ["Adverb","Adjective","Determiner","Noun","Pronoun"], correct: 1, explanation: "'Very' is an ADVERB here — but unusually, it's modifying a noun! This is a special emphatic use meaning 'the idea itself'. Usually 'very' modifies adjectives ('very tall') or other adverbs ('very quickly'). ✓" },
    { id: 400, difficulty: 3, question: "In 'Please sit down', what word class is 'down'?", options: ["Preposition","Noun","Adjective","Adverb","Verb"], correct: 3, explanation: "'Down' is an ADVERB here — it modifies the verb 'sit' (telling us where/how to sit). In 'down the road', it's a preposition. In 'he has downs', it's a noun. In 'down feathers', it's an adjective. ✓" },
    { id: 401, difficulty: 3, question: "In 'The record was broken yesterday', is 'broken' a verb or adjective?", options: ["Verb — it's the past participle of 'break'","Adjective — it describes the record","Both interpretations are valid depending on reading","Noun — it names something","Adverb — it modifies 'was'"], correct: 0, explanation: "'Broken' is a VERB here — part of the passive voice ('was broken' = someone broke it). In 'a broken window', it would be an adjective (describing the window's state). The passive voice uses 'was/were + past participle'. ✓" },
    { id: 402, difficulty: 3, question: "In 'The more the merrier', what word class is 'more'?", options: ["Adjective","Adverb","Determiner","Noun","Pronoun"], correct: 3, explanation: "'More' is a NOUN here — 'the more' means 'the greater number of people'. It's acting as a thing. In 'more cake', it's a determiner. In 'more beautiful', it's an adverb. In 'I want more', it's a pronoun. ✓" },
    { id: 403, difficulty: 3, question: "In 'That is a pretty difficult question', what word class is 'pretty'?", options: ["Adjective","Noun","Adverb","Verb","Conjunction"], correct: 2, explanation: "'Pretty' is an ADVERB here — it modifies the adjective 'difficult' (meaning fairly or quite). In 'a pretty girl', it's an adjective. This catches many people — 'pretty' as an adverb is informal but correct! ✓" },
    { id: 404, difficulty: 3, question: "In 'I'll just have a little', what word class is 'little'?", options: ["Adjective","Adverb","Determiner","Pronoun","Noun"], correct: 3, explanation: "'Little' is a PRONOUN here — it stands alone replacing a noun ('a little [bit of food]'). In 'a little dog', it's an adjective. In 'little did she know', it's an adverb. Context determines the class! ✓" },
  ];

  // Find end of wordClassGrammar last question
  const wcgStart = englishData.indexOf('wordClassGrammar:');
  const wcgEnd = englishData.indexOf('\n  }\n};', wcgStart);
  const wcgSection = englishData.substring(wcgStart, wcgEnd);
  const lastBrace = wcgSection.lastIndexOf('}');
  const absInsert = wcgStart + lastBrace + 1;

  const newQStr = newD3.map(q => {
    const os = q.options.map(o => '"' + o + '"').join(', ');
    return `        {\n          "id": ${q.id},\n          "difficulty": ${q.difficulty},\n          "questionType": "word-class",\n          "question": "${q.question.replace(/"/g, '\\"')}",\n          "options": [${os}],\n          "correct": ${q.correct},\n          "explanation": "${q.explanation.replace(/"/g, '\\"')}"\n        }`;
  }).join(',\n');

  englishData = englishData.substring(0, absInsert) + ',\n' + newQStr + englishData.substring(absInsert);
  console.log('Added ' + newD3.length + ' D3 word class questions (Q386-Q404)');

  // Update mapping
  const engMap = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public/english-question-lesson-map.json'), 'utf8'));
  const existingCount = Object.keys(engMap.wordClassGrammar).length;
  let idx = existingCount;
  newD3.forEach(q => {
    engMap.wordClassGrammar[String(idx)] = { questionId: q.id, subConceptId: 'words-changing-class', confidence: 'high' };
    idx++;
  });
  fs.writeFileSync(path.join(__dirname, '..', 'public/english-question-lesson-map.json'), JSON.stringify(engMap, null, 2), 'utf8');
  console.log('Mapping updated');
}

// WRITE
fs.writeFileSync(ENGLISH_DATA, englishData, 'utf8');
console.log('\n✅ All remaining fixes applied');

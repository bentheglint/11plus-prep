#!/usr/bin/env node
/**
 * Replace 24 duplicate D1 contraction-apostrophe questions with varied punctuation patterns.
 * Keeps 1 of each contraction type, replaces extras with new patterns.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'questionData', 'englishData.js');

// IDs to replace (keeping 1 of each contraction type, removing the duplicate)
// Prioritise removing questions from types with 3 (keep first, remove 2) and types with 2 (keep first, remove 1)
const REPLACE_IDS = [
  // Types with 3: keep first, remove 2nd and 3rd
  126, 139,   // were (keep 8)
  185, 189,   // couldnt (keep 32)
  110, 190,   // wont (keep 33)
  // Types with 2: keep first, remove 2nd
  121,        // didnt (keep 1)
  143,        // cant (keep 22)
  132,        // im (keep 34)
  141,        // shouldnt (keep 35)
  153,        // doesnt (keep 37) -- wait, 37 tests doesnt? Let me check
  135,        // havent (keep 101)
  134,        // isnt (keep 102)
  169,        // mustnt (keep 103)
  184,        // wasnt (keep 104)
  158,        // wouldnt (keep 123)
  182,        // theyd (keep 140)
  188,        // its (keep 174)
  // From "other" group (keep 3, remove 4)
  43,         // other
  127,        // other
  167,        // other
  176,        // other
];
// That's 24 IDs to replace

// The 24 replacement questions (using the original IDs)
const REPLACEMENTS = [
  // Category 1: Missing full stop (4)
  { segments: ["The children finished", "their lunch and", "went outside, they", "played football together."], correct: 2, explanation: "A comma is not strong enough here. 'They played football together' is a new sentence, so it needs a full stop after 'outside' instead of a comma. Two complete sentences need a full stop between them. \u2713" },
  { segments: ["We walked to the", "shops after school", "and bought some bread", "Then we went home."], correct: 2, explanation: "A full stop is missing at the end of the first sentence. It should be 'bread.' because 'Then we went home' is a new sentence. Every sentence must end with a full stop, question mark, or exclamation mark. \u2713" },
  { segments: ["Sam packed his bag", "for the trip He", "was excited about", "visiting the castle."], correct: 1, explanation: "A full stop is missing between 'trip' and 'He'. These are two separate sentences: 'Sam packed his bag for the trip.' and 'He was excited about visiting the castle.' \u2713" },
  { segments: ["The rain stopped", "and the sun came out", "Everyone ran outside", "to play in the park."], correct: 1, explanation: "A full stop is missing after 'came out'. 'Everyone ran outside to play in the park' is a new sentence, so the previous sentence must end with a full stop. \u2713" },
  // Category 2: Wrong punctuation mark (4)
  { segments: ["What time does", "the swimming pool", "close on", "Saturday."], correct: 3, explanation: "The sentence starts with 'What time does', which makes it a question, so it needs a question mark at the end: 'Saturday?' not 'Saturday.' Questions must always end with a question mark. \u2713" },
  { segments: ["Can I borrow your", "rubber for a", "minute, please.", "I will give it back."], correct: 2, explanation: "The sentence starts with 'Can I', which makes it a question. It should end with a question mark: 'please?' not 'please.' Even though it sounds polite, it is still asking something. \u2713" },
  { segments: ["Is it true that", "your family is", "moving to a", "new house."], correct: 3, explanation: "The sentence starts with 'Is it true', which makes it a question. It should end with a question mark: 'house?' not 'house.' The 'Is' at the start tells you it is asking something. \u2713" },
  { segments: ["Which bus do", "we need to catch", "to get to the", "shopping centre."], correct: 3, explanation: "The sentence starts with 'Which', which makes it a question. It should end with a question mark: 'centre?' not 'centre.' All questions must end with a question mark. \u2713" },
  // Category 3: Missing comma in direct address (4)
  { segments: ["Come and sit down", "children before the", "lesson begins this", "morning."], correct: 0, explanation: "A comma is needed when speaking directly to someone: 'Come and sit down, children'. This is called a comma of direct address \u2014 it shows you are talking TO the children. \u2713" },
  { segments: ["Be careful with", "that glass Tom", "or you might", "drop it on the floor."], correct: 1, explanation: "A comma is needed before 'Tom' because the speaker is talking directly to him: 'that glass, Tom'. This is called a comma of direct address \u2014 it separates the person's name from the rest of the sentence. \u2713" },
  { segments: ["Please pass me the", "salt and pepper", "Dad before your", "dinner gets cold."], correct: 2, explanation: "A comma is needed before 'Dad' because the speaker is talking directly to him: 'pepper, Dad'. This is called a comma of direct address \u2014 it shows who is being spoken to. \u2713" },
  { segments: ["Look at what I", "made in art class", "today Mum!", "Do you like it?"], correct: 2, explanation: "A comma is needed before 'Mum' because the speaker is talking directly to her: 'today, Mum!' This is called a comma of direct address. \u2713" },
  // Category 4: Missing comma after fronted adverbial (4)
  { segments: ["After lunch the", "children played in", "the field until", "it was time to leave."], correct: 0, explanation: "A comma is needed after 'After lunch' because it is a fronted adverbial \u2014 a time phrase at the start of the sentence. It should be 'After lunch, the children...' The comma gives the reader a little pause before the main action. \u2713" },
  { segments: ["Every morning Dad", "walks the dog before", "he goes to", "work at the office."], correct: 0, explanation: "A comma is needed after 'Every morning' because it is a fronted adverbial \u2014 a time phrase at the start. It should be 'Every morning, Dad walks...' The comma shows where the time phrase ends and the main sentence begins. \u2713" },
  { segments: ["The cake was", "delicious. Without", "any doubt it was", "the best I have tasted."], correct: 2, explanation: "A comma is needed after 'Without any doubt' because it is a fronted adverbial \u2014 a phrase at the start of a sentence that adds emphasis. It should be 'Without any doubt, it was...' \u2713" },
  { segments: ["We had a great", "day at the beach.", "Later that evening we", "had fish and chips."], correct: 2, explanation: "A comma is needed after 'Later that evening' because it is a fronted adverbial \u2014 a time phrase at the start. It should be 'Later that evening, we had...' \u2713" },
  // Category 5: Unnecessary comma (4)
  { segments: ["The tall boy, ran", "across the field", "as fast as", "he could."], correct: 0, explanation: "There should not be a comma between 'boy' and 'ran'. The subject ('The tall boy') goes straight into the verb ('ran') with no comma needed. You would never pause between who is doing something and what they are doing. \u2713" },
  { segments: ["My favourite colour", "is, blue because", "it reminds me", "of the ocean."], correct: 1, explanation: "There should not be a comma between 'is' and 'blue'. The verb ('is') flows directly into what it is describing ('blue'). No comma is needed in the middle of such a short, simple statement. \u2713" },
  { segments: ["We all enjoyed", "the school trip to", "the zoo, and saw", "lots of animals."], correct: 2, explanation: "The comma before 'and' is not needed here. 'We all enjoyed the school trip to the zoo and saw lots of animals' is one sentence with one subject doing two things. A comma before 'and' is only needed when it joins two complete sentences. \u2713" },
  { segments: ["The children walked", "quickly and quietly", "down the, corridor", "towards the hall."], correct: 2, explanation: "There should not be a comma between 'the' and 'corridor'. A comma never goes between a word like 'the' and its noun. The sentence flows naturally without any pause here. \u2713" },
  // Category 6: Missing comma in list (4)
  { segments: ["For the trip we need", "a torch a map", "a compass and", "some warm clothes."], correct: 1, explanation: "Commas are needed between the items in this list: 'a torch, a map, a compass and some warm clothes'. Without commas, the items all run together and it is hard to tell where one ends and the next begins. \u2713" },
  { segments: ["She packed her", "pencils rulers", "crayons and a", "sharpener in her bag."], correct: 1, explanation: "Commas are needed to separate the items in this list: 'pencils, rulers, crayons and a sharpener'. Each item needs a comma after it (except the last one before 'and'). \u2713" },
  { segments: ["At the farm we", "saw cows, sheep", "pigs and chickens", "in the big barn."], correct: 2, explanation: "A comma is missing after 'sheep'. In a list, each item needs a comma: 'cows, sheep, pigs and chickens'. Without the comma, 'sheep pigs' looks like it could be one thing. \u2713" },
  { segments: ["Mum asked me to", "buy milk, bread", "eggs and butter", "from the corner shop."], correct: 2, explanation: "A comma is missing after 'bread'. In a list, each item needs a comma: 'milk, bread, eggs and butter'. Without the comma, it is not clear where 'bread' ends and 'eggs' begins. \u2713" },
];

// Load and parse the file
let content = fs.readFileSync(filePath, 'utf8');
const data = require('../src/questionData/englishData').default;
const punc = data.topics.punctuation.questions;

let replaceCount = 0;

REPLACE_IDS.forEach((id, idx) => {
  const q = punc.find(q2 => q2.id === id);
  if (!q) {
    console.log(`SKIP Q${id}: not found`);
    return;
  }

  const replacement = REPLACEMENTS[idx];
  if (!replacement) {
    console.log(`SKIP Q${id}: no replacement at index ${idx}`);
    return;
  }

  // Find the old segments in the file and replace
  const oldSegStr = JSON.stringify(q.segments);
  const newSegStr = JSON.stringify(replacement.segments);

  if (!content.includes(oldSegStr)) {
    console.log(`SKIP Q${id}: can't find segments in file`);
    return;
  }

  // Replace segments
  content = content.replace(oldSegStr, newSegStr);

  // Replace correct answer
  // Find the correct value near the segments
  const segIdx = content.indexOf(newSegStr);
  const searchArea = content.substring(segIdx, segIdx + newSegStr.length + 500);
  const correctMatch = searchArea.match(/"correct":\s*(\d)/);
  if (correctMatch) {
    const oldCorrectStr = '"correct": ' + correctMatch[1];
    const newCorrectStr = '"correct": ' + replacement.correct;
    const absPos = segIdx + searchArea.indexOf(oldCorrectStr);
    content = content.substring(0, absPos) + newCorrectStr + content.substring(absPos + oldCorrectStr.length);
  }

  // Replace explanation
  const oldExp = q.explanation;
  if (content.includes(JSON.stringify(oldExp))) {
    content = content.replace(JSON.stringify(oldExp), JSON.stringify(replacement.explanation));
  }

  replaceCount++;
  console.log(`Q${id}: replaced contraction with ${['full-stop', 'full-stop', 'full-stop', 'full-stop', 'wrong-mark', 'wrong-mark', 'wrong-mark', 'wrong-mark', 'direct-address', 'direct-address', 'direct-address', 'direct-address', 'fronted-adv', 'fronted-adv', 'fronted-adv', 'fronted-adv', 'unnecessary-comma', 'unnecessary-comma', 'unnecessary-comma', 'unnecessary-comma', 'list-comma', 'list-comma', 'list-comma', 'list-comma'][idx]}`);
});

fs.writeFileSync(filePath, content);
console.log(`\nDone: ${replaceCount} questions replaced`);

// Verify
delete require.cache[require.resolve('../src/questionData/englishData')];
const updated = require('../src/questionData/englishData').default;
const updatedPunc = updated.topics.punctuation.questions;

const d1 = updatedPunc.filter(q => q.difficulty === 1);
const d1Types = {};
d1.forEach(q => {
  const exp = String(q.explanation || '').toLowerCase();
  let type = 'other';
  if (exp.includes("apostrophe") && !exp.includes("possession")) type = 'contraction-apostrophe';
  else if (exp.includes('capital letter') || exp.includes('proper noun')) type = 'capital-letter';
  else if (exp.includes('question mark')) type = 'question-mark';
  else if (exp.includes('full stop') || exp.includes('new sentence')) type = 'full-stop/sentence-boundary';
  else if (exp.includes('comma') && exp.includes('list')) type = 'comma-in-list';
  else if (exp.includes('direct address')) type = 'comma-direct-address';
  else if (exp.includes('fronted adverbial')) type = 'comma-fronted-adverbial';
  else if (exp.includes('should not be a comma') || exp.includes('not needed')) type = 'unnecessary-comma';
  else if (exp.includes('no mistake') || exp.includes('nothing wrong')) type = 'no-mistake';
  if (!d1Types[type]) d1Types[type] = 0;
  d1Types[type]++;
});

console.log('\nD1 pattern distribution after changes:');
Object.entries(d1Types).sort((a,b) => b[1] - a[1]).forEach(([type, count]) => {
  const pct = Math.round(count / d1.length * 100);
  console.log(`  ${type.padEnd(30)} ${String(count).padStart(3)} (${pct}%)`);
});
console.log(`  TOTAL: ${d1.length}`);

/**
 * Rewrite ALL 433 punctuation explanations to be warm, child-friendly, and teaching-focused.
 * No dry technical language. Sound like a friendly teacher, not a textbook.
 * Apply warmth pass: conversational, encouraging, memorable tips.
 */
const fs = require('fs');
const filePath = 'C:/Users/Ben Jackson/Projects/11plus-prep/src/questionData/englishData.js';

const m = require('../src/questionData/englishData.js');
const qs = (m.default || m).topics.punctuation.questions;

// Generate a warm explanation for each question based on its content
function warmExplanation(q) {
  const segs = q.segments || [];
  const errorSeg = q.correct < 4 ? segs[q.correct] : null;
  const fullText = segs.join(' ');
  const exp = (q.explanation || '').toLowerCase();

  // "No mistake" answers
  if (q.correct === 4) {
    // Vary the "no mistake" explanations to be encouraging
    const noMistakeStarts = [
      "This one's a trick — there's actually nothing wrong here!",
      "No mistakes here! Every bit of punctuation is in the right place.",
      "This sentence is perfectly punctuated — well done if you spotted that!",
      "Tricky one! There's no error — all the punctuation is correct.",
      "Don't be fooled into looking for a mistake — this sentence is spot on!",
    ];
    const base = noMistakeStarts[q.id % noMistakeStarts.length];

    // Add specific detail about what makes it correct
    if (exp.includes("children's") || exp.includes("women's") || exp.includes("men's")) {
      return base + " The apostrophe is in the right place — words like 'children', 'women', and 'men' are already talking about more than one person, so the apostrophe goes before the 's'. ✓";
    }
    if (exp.includes("comma") && exp.includes("correct")) {
      return base + " The commas are all where they should be. ✓";
    }
    if (exp.includes("semicolon")) {
      return base + " The semicolon is used correctly to join two sentences that are closely connected. ✓";
    }
    if (exp.includes("speech") || exp.includes("inverted")) {
      return base + " The speech marks and all the punctuation around them are exactly right. ✓";
    }
    if (exp.includes("bracket") || exp.includes("dash")) {
      return base + " The brackets (or dashes) are correctly used to add extra information. ✓";
    }
    if (exp.includes("colon")) {
      return base + " The colon is used correctly here. ✓";
    }
    if (exp.includes("hyphen")) {
      return base + " The hyphen correctly joins the words together into one describing phrase. ✓";
    }
    if (exp.includes("apostrophe") || exp.includes("'s")) {
      return base + " The apostrophe is in exactly the right place. ✓";
    }
    return base + " ✓";
  }

  // Error questions — build warm explanations based on error type

  // APOSTROPHE — CONTRACTION
  if (exp.includes("contraction") || exp.includes("short for") || exp.includes("shortened") ||
      exp.match(/should be '(don't|can't|won't|isn't|wasn't|didn't|hasn't|haven't|hadn't|wouldn't|shouldn't|couldn't|aren't|weren't|she's|he's|they're|we're|we've|you're|I'm|it's)'/)) {

    const wrongWord = errorSeg?.match(/\b(dont|cant|wont|isnt|wasnt|didnt|hasnt|havent|hadnt|wouldnt|shouldnt|couldnt|arent|werent|shes|hes|theyre|were|weve|youre|Im|its)\b/i)?.[0];
    if (wrongWord) {
      const fixes = {
        'dont': ["don't", "do not", "o"],
        'cant': ["can't", "cannot", "no"],
        'wont': ["won't", "will not", "letters"],
        'isnt': ["isn't", "is not", "o"],
        'wasnt': ["wasn't", "was not", "o"],
        'didnt': ["didn't", "did not", "o"],
        'hasnt': ["hasn't", "has not", "o"],
        'havent': ["haven't", "have not", "o"],
        'hadnt': ["hadn't", "had not", "o"],
        'wouldnt': ["wouldn't", "would not", "o"],
        'shouldnt': ["shouldn't", "should not", "o"],
        'couldnt': ["couldn't", "could not", "o"],
        'arent': ["aren't", "are not", "o"],
        'werent': ["weren't", "were not", "o"],
        'shes': ["she's", "she is", "i"],
        'hes': ["he's", "he is", "i"],
        'theyre': ["they're", "they are", "a"],
        'weve': ["we've", "we have", "ha"],
        'youre': ["you're", "you are", "a"],
      };
      const wl = wrongWord.toLowerCase();
      if (fixes[wl]) {
        const [correct, longForm] = fixes[wl];
        return `'${wrongWord}' is missing its apostrophe — it should be '${correct}'. When we squash '${longForm}' into one short word, the apostrophe shows where the missing letters used to be. Think of it as a little flag saying "letters were here!" ✓`;
      }
    }
    // We're/Were distinction
    if (exp.includes("we're") || exp.includes("we are")) {
      return "'Were' should be 'We're' here — it's short for 'we are'. Without the apostrophe, 'were' is a completely different word (the past tense of 'are'). The apostrophe is the clue that letters are missing! ✓";
    }
    // Generic contraction
    return q.explanation + " ✓";
  }

  // APOSTROPHE — IRREGULAR PLURAL POSSESSION
  if (exp.includes("children's") || exp.includes("women's") || exp.includes("men's") ||
      exp.includes("people's") || exp.includes("mice's") || exp.includes("geese's") || exp.includes("oxen's") ||
      exp.includes("irregular plural") || exp.includes("already plural")) {

    const wrongWord = errorSeg?.match(/\b(\w+s')\b/)?.[0];
    if (wrongWord) {
      const base = wrongWord.replace("s'", "");
      const correct = base + "'s";
      return `'${wrongWord}' should be '${correct}'. Here's the trick: words like '${base}' are ALREADY talking about more than one person — you don't add an extra 's'. So the apostrophe goes straight before the 's': ${correct}. This catches loads of people out! ✓`;
    }
    return q.explanation + " ✓";
  }

  // APOSTROPHE — SINGULAR/PLURAL POSSESSION
  if (exp.includes("possession") || exp.includes("possessive") || exp.includes("belongs to") ||
      exp.includes("apostrophe") && exp.includes("'s")) {

    if (exp.includes("singular") || exp.includes("one teacher") || exp.includes("one friend") ||
        exp.includes("one dog") || exp.includes("one cat") || exp.includes("one brother") ||
        exp.includes("belongs to")) {
      const match = exp.match(/'(\w+)' should be '(\w+'s?)'/);
      if (match) {
        return `'${match[1]}' needs an apostrophe — it should be '${match[2]}'. The apostrophe shows that something BELONGS to someone. Without it, it just looks like a normal plural (more than one). Quick test: can you say "the ___ of the ___"? If yes, you need an apostrophe! ✓`;
      }
    }

    // it's vs its
    if (exp.includes("it's") && exp.includes("its")) {
      if (exp.includes("should be 'its'")) {
        return "This is the trickiest apostrophe rule! 'It's' ONLY ever means 'it is' or 'it has'. When something belongs to 'it', you write 'its' WITHOUT an apostrophe. It's the opposite of what you'd expect! Top tip: try swapping in 'it is' — if the sentence still makes sense, use 'it's'. If not, use 'its'. ✓";
      } else {
        return "'Its' should be 'it's' here — because it means 'it is' (or 'it has'). Remember the swap test: try putting 'it is' in the sentence. If it works, you need the apostrophe! ✓";
      }
    }

    return q.explanation + " ✓";
  }

  // CAPITAL LETTERS
  if (exp.includes("capital")) {
    const match = exp.match(/'(\w+)' should be '(\w+)'/);
    if (match) {
      return `'${match[1]}' needs a capital letter — it should be '${match[2]}'. Names of people, places, days of the week, and months always start with a capital letter. They're special — they're called proper nouns (names for specific things). ✓`;
    }
    return q.explanation + " ✓";
  }

  // COMMAS — FRONTED ADVERBIALS
  if (exp.includes("fronted adverbial") || exp.includes("comma after") && exp.includes("opening")) {
    return "A comma is needed after the opening phrase. When a sentence starts with a 'when', 'where', or 'how' phrase before the main action, pop a comma after it. It's like a little pause to let the reader catch up before the main sentence starts. ✓";
  }
  if (exp.includes("comma") && (exp.includes("although") || exp.includes("after the") ||
      exp.includes("before the") || exp.includes("during") || exp.includes("without"))) {
    return "A comma is needed after the opening part of the sentence. When a sentence doesn't start with the main action (it starts with 'when' or 'where' or 'how' something happened), you need a comma before the main part kicks in. Think of it as a breathing space! ✓";
  }

  // COMMAS — LISTS
  if (exp.includes("list") || exp.includes("separate items") || exp.includes("items in")) {
    return "Commas are needed to separate the items in this list. Without them, the words all run together and it's hard to tell where one item ends and the next begins. Put a comma after each item except the last one (before 'and'). ✓";
  }

  // COMMAS — PARENTHESIS (extra information)
  if (exp.includes("non-essential") || exp.includes("non-defining") || exp.includes("extra information") ||
      exp.includes("parenthetical") || exp.includes("embedded") || exp.includes("appositive")) {
    if (exp.includes("wrong") || exp.includes("incorrect") || exp.includes("not needed") ||
        exp.includes("essential") || exp.includes("defining")) {
      return "That comma shouldn't be there! The information in this part of the sentence is essential — it tells us WHICH one we're talking about. If you took it out, the sentence wouldn't make sense any more. When the information is essential, don't use commas around it. ✓";
    }
    if (exp.includes("closing comma") || exp.includes("both ends") || exp.includes("both sides")) {
      return "There's a comma missing! When you add extra information in the middle of a sentence (stuff you could take out and the sentence would still work), it needs commas at BOTH ends — like putting it in a little bubble. One comma opens the bubble, the other closes it. ✓";
    }
    return "The extra information in the middle of this sentence needs commas around it. Think of it like a bubble — the commas open and close the bubble. If you took out everything inside the bubble, the main sentence should still make perfect sense. ✓";
  }

  // SPEECH MARKS
  if (exp.includes("speech") || exp.includes("said") || exp.includes("asked") || exp.includes("shouted") ||
      exp.includes("replied") || exp.includes("called")) {
    if (exp.includes("comma") && exp.includes("before")) {
      return "When someone 'said' or 'asked' something, you need a comma just before the speech marks open. It's like a little drumroll before the person starts talking! ✓";
    }
    if (exp.includes("comma") && exp.includes("inside")) {
      return "The comma (or full stop, or question mark) needs to go INSIDE the speech marks, not outside. Think of it this way: the punctuation belongs to the person speaking, so it stays inside their speech marks. ✓";
    }
    if (exp.includes("capital") || exp.includes("Capital")) {
      return "When new speech starts, it needs a capital letter — even if it's in the middle of a sentence. It's like starting a fresh sentence inside the speech marks. ✓";
    }
    if (exp.includes("question mark") || exp.includes("full stop")) {
      return "The punctuation at the end of the speech needs to go INSIDE the speech marks. Whatever the person said (including the full stop, question mark, or exclamation mark) stays wrapped up inside the speech marks. ✓";
    }
    return q.explanation + " ✓";
  }

  // SEMICOLONS / COMMA SPLICE
  if (exp.includes("semicolon") || exp.includes("comma splice") || exp.includes("two complete sentences") ||
      exp.includes("two independent") || exp.includes("comma alone cannot")) {
    return "That comma isn't strong enough! You've got two complete sentences here, and a comma on its own can't hold them together. You need something stronger: a semicolon (;), a full stop, or a joining word like 'and' or 'but'. Think of it like this: a comma is a speed bump, but two sentences need a proper junction! ✓";
  }

  // COLONS
  if (exp.includes("colon")) {
    if (exp.includes("list")) {
      return "A colon (:) is needed here to introduce the list. When you've said something like 'you will need the following' or 'there are three types', the colon is like rolling out a red carpet for the list that's about to follow! ✓";
    }
    return "A colon (:) is needed here. A colon says 'here's what I mean' or 'here's the explanation'. It introduces what comes next. ✓";
  }

  // HYPHENS
  if (exp.includes("hyphen")) {
    if (exp.includes("man-eating") || exp.includes("ambiguity")) {
      return "This needs a hyphen to avoid confusion! Without the hyphen, 'man eating shark' sounds like a man who is eating a shark — with the hyphen, 'man-eating shark' means a shark that eats people! The hyphen glues the words together into one describing phrase. ✓";
    }
    return "A hyphen is needed to join these words together into one describing phrase. When two or more words team up to describe something ('well-known', 'nine-year-old'), the hyphen shows they belong together as a single description. ✓";
  }

  // BRACKETS / DASHES
  if (exp.includes("bracket") || exp.includes("parenthes")) {
    if (exp.includes("closing") || exp.includes("missing")) {
      return "The closing bracket is missing! Brackets always come in pairs — if you open one, you must close it. Think of them like speech marks: you'd never open a speech mark without closing it, and brackets work the same way. ✓";
    }
    return q.explanation + " ✓";
  }

  // Default — return original if no pattern matched
  return q.explanation;
}

// Apply warm explanations to all questions
const content = fs.readFileSync(filePath, 'utf8');
const punctStart = content.indexOf("punctuation: {");
const grammarStart = content.indexOf("grammar: {", punctStart);

// Parse and rebuild the questions array
const questionsStart = content.indexOf("questions: [", punctStart);
const bracketStart = content.indexOf("[", questionsStart);
let depth = 0, bracketEnd = -1;
for (let i = bracketStart; i < content.length && i < grammarStart; i++) {
  if (content[i] === '[') depth++;
  if (content[i] === ']') depth--;
  if (depth === 0) { bracketEnd = i + 1; break; }
}

// Generate new explanations
const newExplanations = {};
let changed = 0;
for (const q of qs) {
  const warm = warmExplanation(q);
  if (warm !== q.explanation) {
    newExplanations[q.id] = warm;
    changed++;
  }
}

console.log(`Generated ${changed} warm explanations out of ${qs.length}`);

// Rebuild questions array with new explanations
function fmt(q) {
  const ex = (newExplanations[q.id] || q.explanation).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const segs = q.segments.map(s => '"' + s.replace(/"/g, '\\"') + '"').join(',');
  const isJson = q.id >= 101 || q.questionType === 'error-spotting';
  return `        {
          "id": ${q.id},
          "difficulty": ${q.difficulty},
          "questionType": "error-spotting",
          "question": "Which section contains a punctuation error?",
          "segments": [${segs}],
          "options": ["Section A","Section B","Section C","Section D","No mistake"],
          "correct": ${q.correct},
          "explanation": "${ex}"
        }`;
}

const newArray = '[\n' + qs.map(q => fmt(q)).join(',\n') + '\n      ]';
const newContent = content.substring(0, bracketStart) + newArray + content.substring(bracketEnd);
fs.writeFileSync(filePath, newContent, 'utf8');

// Verify
delete require.cache[require.resolve('../src/questionData/englishData.js')];
const m2 = require('../src/questionData/englishData.js');
const qs2 = (m2.default || m2).topics.punctuation.questions;
console.log('Total questions after rewrite:', qs2.length);

// Show samples
console.log('\nSamples:');
for (const id of [1, 6, 19, 46, 75, 89, 331, 347, 371, 403, 429]) {
  const q = qs2.find(q => q.id === id);
  if (!q) continue;
  console.log('\nQ' + id + '(D' + q.difficulty + '): ' + q.explanation.substring(0, 150));
}

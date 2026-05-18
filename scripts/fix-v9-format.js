const fs = require('fs');
const path = require('path');

const examplePairs = [
  ["plan (lane) need", "stop (top) open"],
  ["slim (lime) medal", "trap (rave) vent"],
  ["frog (rode) dent", "icon (come) menu"],
  ["blow (lone) neat", "flat (late) tent"],
  ["afar (fast) stay", "clap (lame) mesh"],
  ["twig (wide) deer", "snob (note) tens"],
  ["amid (mire) rest", "smog (mode) demo"],
  ["bird (iris) isle", "blot (lore) rein"],
  ["snow (node) deaf", "spat (page) germ"],
  ["amen (mete) team", "slim (lime) medal"],
  ["frog (rode) dent", "blow (lone) neat"],
  ["trap (rave) vent", "flat (late) tent"],
  ["icon (come) menu", "afar (fast) stay"],
  ["clap (lame) mesh", "twig (wide) deer"],
  ["snob (note) tens", "amid (mire) rest"],
  ["smog (mode) demo", "bird (iris) isle"],
  ["blot (lore) rein", "snow (node) deaf"],
  ["spat (page) germ", "amen (mete) team"],
  ["plan (lane) need", "icon (come) menu"],
  ["slim (lime) medal", "clap (lame) mesh"],
  ["frog (rode) dent", "snob (note) tens"],
  ["trap (rave) vent", "smog (mode) demo"],
  ["blow (lone) neat", "bird (iris) isle"],
  ["flat (late) tent", "blot (lore) rein"],
  ["afar (fast) stay", "spat (page) germ"],
];

// Test triplets for IDs 126-150 (in order)
const testTriplets = [
  "hope ( ? ) ends",
  "frog ( ? ) pest",
  "idol ( ? ) melt",
  "trap ( ? ) vent",
  "afar ( ? ) stay",
  "flat ( ? ) tent",
  "blow ( ? ) neat",
  "icon ( ? ) menu",
  "twig ( ? ) deer",
  "clap ( ? ) mesh",
  "amid ( ? ) rest",
  "smog ( ? ) demo",
  "amen ( ? ) team",
  "bird ( ? ) isle",
  "blot ( ? ) rein",
  "snow ( ? ) deaf",
  "snob ( ? ) tens",
  "spat ( ? ) germ",
  "ebony ( ? ) debt",
  "avid ( ? ) lean",
  "smug ( ? ) tear",
  "prim ( ? ) feat",
  "usage ( ? ) gene",
  "idol ( ? ) zero",
  "edit ( ? ) redo",
];

const vrDataPath = path.join(__dirname, '../src/questionData/vrData.js');
let src = fs.readFileSync(vrDataPath, 'utf8');

// Current question prefix to replace
const oldPrefix = "Find the hidden word. Take letters 2\\u20133 of the first word and letters 1\\u20132 of the third word.\\n\\n";

// Build replacements for each question
for (let i = 0; i < 25; i++) {
  const [ex1, ex2] = examplePairs[i];
  const triplet = testTriplets[i];
  const newQ = `${ex1}\\n${ex2}\\n${triplet}`;
  // Find this specific question's old text
  const oldQ = oldPrefix + triplet;
  if (src.includes(oldQ)) {
    src = src.replace(oldQ, newQ);
  } else {
    console.log('NOT FOUND for Q' + (126 + i) + ': ' + triplet);
  }
}

fs.writeFileSync(vrDataPath, src);
console.log('Done. Sample checks:');

delete require.cache[require.resolve('../src/questionData/vrData.js')];
const { default: vr } = require('../src/questionData/vrData.js');
const wca = vr.topics.wordCodeAnalogies.questions;
[126, 128, 135, 150].forEach(id => {
  const q = wca.find(x => x.id === id);
  console.log('Q' + id + ':', q.question.replace(/\n/g, ' | '));
});

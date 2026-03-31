const fs = require('fs');
const filePath = 'C:/Users/Ben Jackson/Projects/11plus-prep/src/questionData/vrData.js';

const vr = require('../src/questionData/vrData.js');
const qs = (vr.default || vr).topics.synonyms.questions;
let content = fs.readFileSync(filePath, 'utf8');

const synStart = content.indexOf("synonyms: {");
const antStart = content.indexOf("antonyms: {");

const dupFixes = [
  { id: 78, newA: ["persistent","candle","meadow"], newB: ["compass","determined","ribbon"], cp: [0,1],
    ex: "'Persistent' and 'determined' both mean refusing to give up — they are closest in meaning. \\u2713" },
  { id: 77, newA: ["serene","pepper","anchor"], newB: ["lantern","calm","crystal"], cp: [0,1],
    ex: "'Serene' and 'calm' both mean free from disturbance — they are closest in meaning. \\u2713" },
  { id: 49, newA: ["bashful","trumpet","coral"], newB: ["willow","reserved","copper"], cp: [0,1],
    ex: "'Bashful' and 'reserved' both mean reluctant to draw attention to oneself — they are closest in meaning. \\u2713" },
  { id: 47, newA: ["headstrong","emerald","glacier"], newB: ["canyon","resolute","toffee"], cp: [0,1],
    ex: "'Headstrong' and 'resolute' both mean firmly determined — they are closest in meaning. \\u2713" },
  { id: 48, newA: ["deserted","cinnamon","volcano"], newB: ["orchard","abandoned","sapphire"], cp: [0,1],
    ex: "'Deserted' and 'abandoned' both mean left empty with no people — they are closest in meaning. \\u2713" },
  { id: 116, newA: ["restore","thermal","cedar"], newB: ["amber","renovate","pillow"], cp: [0,1],
    ex: "'Restore' and 'renovate' both mean to bring something back to good condition — they are closest in meaning. \\u2713" },
  { id: 120, newA: ["conquest","fountain","elastic"], newB: ["magnetic","achievement","vanilla"], cp: [0,1],
    ex: "'Conquest' and 'achievement' both mean a notable success — they are closest in meaning. \\u2713" },
  { id: 124, newA: ["lithe","saddle","turquoise"], newB: ["indigo","supple","barrel"], cp: [0,1],
    ex: "'Lithe' and 'supple' both mean flexible and moving gracefully — they are closest in meaning. \\u2713" },
];

let before = content.substring(0, synStart);
let section = content.substring(synStart, antStart);
let after = content.substring(antStart);

for (const fix of dupFixes) {
  const q = qs.find(q => q.id === fix.id);
  if (!q) { console.log("Q" + fix.id + ": NOT FOUND"); continue; }

  const oldA = '["' + q.setA.join('","') + '"]';
  const newA = '["' + fix.newA.join('","') + '"]';
  const oldB = '["' + q.setB.join('","') + '"]';
  const newB = '["' + fix.newB.join('","') + '"]';

  if (section.includes(oldA)) {
    section = section.replace(oldA, newA);
    section = section.replace(oldB, newB);

    // Replace correctPair if needed
    const oldCP = "[" + q.correctPair.join(",") + "]";
    const newCP = "[" + fix.cp.join(",") + "]";
    if (oldCP !== newCP) {
      // Find the correctPair near the new setA
      const setAIdx = section.indexOf(newA);
      const cpSearch = section.substring(setAIdx, setAIdx + 500);
      section = section.substring(0, setAIdx) +
        cpSearch.replace(oldCP, newCP) +
        section.substring(setAIdx + cpSearch.length);
    }

    console.log("Q" + fix.id + ": " + q.setA[q.correctPair[0]] + "/" + q.setB[q.correctPair[1]] +
      " -> " + fix.newA[fix.cp[0]] + "/" + fix.newB[fix.cp[1]]);
  } else {
    console.log("Q" + fix.id + ": old setA not found in section");
  }
}

content = before + section + after;
fs.writeFileSync(filePath, content, "utf8");

// Verify
delete require.cache[require.resolve("../src/questionData/vrData.js")];
const vr2 = require("../src/questionData/vrData.js");
const qs2 = (vr2.default || vr2).topics.synonyms.questions;

const pairMap = {};
for (const q of qs2) {
  const k = [q.setA[q.correctPair[0]], q.setB[q.correctPair[1]]].map(w => w.toLowerCase()).sort().join("/");
  if (!pairMap[k]) pairMap[k] = [];
  pairMap[k].push(q.id);
}
let dups = 0;
for (const [p, ids] of Object.entries(pairMap)) {
  if (ids.length > 1) { console.log("Still dup: " + p + " — Q" + ids.join(", Q")); dups++; }
}

const dd = {1:0, 2:0, 3:0};
for (const q of qs2) dd[q.difficulty]++;

console.log("\nDuplicate pairs: " + dups);
console.log("Total: " + qs2.length);
console.log("D1:" + dd[1] + " D2:" + dd[2] + " D3:" + dd[3]);

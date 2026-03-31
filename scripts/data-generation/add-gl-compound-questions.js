/**
 * Add GL-authentic compound word questions (pick-from-sets format)
 * Each question: 3 words in setA, 3 in setB, exactly ONE valid compound
 * setA word always goes FIRST
 * All 9 combinations manually verified — only one valid answer per question
 */
const fs = require('fs');
const filePath = 'C:/Users/Ben Jackson/Projects/11plus-prep/src/questionData/vrData.js';

const newQuestions = [
  // ===== D1: TRANSPARENT COMPOUNDS (13 questions) =====
  // Both parts are obvious, everyday vocabulary

  { id: 126, d: 1,
    q: "Find two words, one from each group, that join together to make a new word. The word from the first group always comes first.",
    sA: ["rain", "silk", "brass"], sB: ["bow", "thread", "ring"], cp: [0, 0],
    ex: "rain + bow = rainbow. A rainbow is the arc of colours you see in the sky after rain. ✓" },

  { id: 127, d: 1,
    sA: ["cup", "jug", "pot"], sB: ["board", "handle", "lid"], cp: [0, 0],
    ex: "cup + board = cupboard. A cupboard is a piece of furniture with shelves for storing things. ✓" },

  { id: 128, d: 1,
    sA: ["bed", "shelf", "desk"], sB: ["room", "unit", "lamp"], cp: [0, 0],
    ex: "bed + room = bedroom. A bedroom is the room where you sleep. ✓" },

  { id: 129, d: 1,
    sA: ["snow", "sleet", "haze"], sB: ["ball", "pellet", "cloud"], cp: [0, 0],
    ex: "snow + ball = snowball. A snowball is a ball of packed snow. ✓" },

  { id: 130, d: 1,
    sA: ["door", "ceiling", "curtain"], sB: ["bell", "tile", "rail"], cp: [0, 0],
    ex: "door + bell = doorbell. A doorbell is the button visitors press at your door. ✓" },

  { id: 131, d: 1,
    sA: ["tooth", "elbow", "ankle"], sB: ["brush", "grease", "sock"], cp: [0, 0],
    ex: "tooth + brush = toothbrush. A toothbrush is used to clean your teeth. ✓" },

  { id: 132, d: 1,
    sA: ["arm", "oven", "chimney"], sB: ["chair", "glove", "sweep"], cp: [0, 0],
    ex: "arm + chair = armchair. An armchair is a comfortable chair with supports for your arms. ✓" },

  { id: 133, d: 1,
    sA: ["hand", "glue", "tape"], sB: ["bag", "stick", "measure"], cp: [0, 0],
    ex: "hand + bag = handbag. A handbag is a small bag for carrying personal items. ✓" },

  { id: 134, d: 1,
    sA: ["sun", "neon", "candle"], sB: ["burn", "sign", "wax"], cp: [0, 0],
    ex: "sun + burn = sunburn. Sunburn is red, sore skin caused by too much sun. ✓" },

  { id: 135, d: 1,
    sA: ["star", "planet", "comet"], sB: ["fish", "ring", "tail"], cp: [0, 0],
    ex: "star + fish = starfish. A starfish is a sea creature shaped like a star. ✓" },

  { id: 136, d: 1,
    sA: ["gold", "copper", "tin"], sB: ["fish", "wire", "can"], cp: [0, 0],
    ex: "gold + fish = goldfish. A goldfish is a small orange pet fish. ✓" },

  { id: 137, d: 1,
    sA: ["eye", "palm", "sole"], sB: ["brow", "tree", "plate"], cp: [0, 0],
    ex: "eye + brow = eyebrow. Your eyebrow is the strip of hair above your eye. ✓" },

  { id: 138, d: 1,
    sA: ["home", "tent", "shed"], sB: ["work", "peg", "lock"], cp: [0, 0],
    ex: "home + work = homework. Homework is schoolwork you do at home. ✓" },

  // ===== D2: SEMI-TRANSPARENT COMPOUNDS (15 questions) =====
  // Meaning shifts, requires trying combinations, synonym traps

  { id: 139, d: 2,
    sA: ["under", "above", "beyond"], sB: ["stand", "board", "reach"], cp: [0, 0],
    ex: "under + stand = understand. 'Understand' means to grasp the meaning of something — the compound doesn't literally mean 'standing under'! ✓" },

  { id: 140, d: 2,
    sA: ["butter", "cream", "gravy"], sB: ["fly", "jug", "boat"], cp: [0, 0],
    ex: "butter + fly = butterfly. A butterfly is a colourful insect — nothing to do with butter or flying butter! ✓" },

  { id: 141, d: 2,
    sA: ["break", "bend", "twist"], sB: ["fast", "curve", "turn"], cp: [0, 0],
    ex: "break + fast = breakfast. Breakfast is the first meal of the day — it 'breaks' the overnight 'fast' (period without eating). ✓" },

  { id: 142, d: 2,
    sA: ["news", "gossip", "rumour"], sB: ["paper", "mill", "spread"], cp: [0, 0],
    ex: "news + paper = newspaper. A newspaper is a daily publication of news stories. ✓" },

  { id: 143, d: 2,
    sA: ["horse", "pony", "mule"], sB: ["shoe", "club", "cart"], cp: [0, 0],
    ex: "horse + shoe = horseshoe. A horseshoe is the U-shaped metal fitted to a horse's hoof. ✓" },

  { id: 144, d: 2,
    sA: ["light", "bright", "laser"], sB: ["house", "spark", "beam"], cp: [0, 0],
    ex: "light + house = lighthouse. A lighthouse is a tower with a bright light that warns ships of danger. ✓" },

  { id: 145, d: 2,
    sA: ["day", "dawn", "dusk"], sB: ["dream", "chorus", "patrol"], cp: [0, 0],
    ex: "day + dream = daydream. A daydream is when your mind wanders into pleasant thoughts. ✓" },

  { id: 146, d: 2,
    sA: ["cross", "straight", "curved"], sB: ["word", "line", "ball"], cp: [0, 0],
    ex: "cross + word = crossword. A crossword is a word puzzle with interlocking clues. ✓" },

  { id: 147, d: 2,
    sA: ["finger", "index", "pointer"], sB: ["print", "card", "arrow"], cp: [0, 0],
    ex: "finger + print = fingerprint. A fingerprint is the unique pattern of lines on your fingertip. ✓" },

  { id: 148, d: 2,
    sA: ["book", "diary", "journal"], sB: ["worm", "entry", "page"], cp: [0, 0],
    ex: "book + worm = bookworm. A bookworm is someone who loves reading books. ✓" },

  { id: 149, d: 2,
    sA: ["water", "juice", "milk"], sB: ["fall", "box", "jug"], cp: [0, 0],
    ex: "water + fall = waterfall. A waterfall is a stream of water falling from a height. ✓" },

  { id: 150, d: 2,
    sA: ["sea", "lake", "pond"], sB: ["horse", "reed", "lily"], cp: [0, 0],
    ex: "sea + horse = seahorse. A seahorse is a small fish with a horse-shaped head. ✓" },

  { id: 151, d: 2,
    sA: ["thunder", "lightning", "drizzle"], sB: ["storm", "rod", "coat"], cp: [0, 0],
    ex: "thunder + storm = thunderstorm. A thunderstorm is a storm with thunder and lightning. ✓" },

  { id: 152, d: 2,
    sA: ["car", "bus", "van"], sB: ["pet", "seat", "park"], cp: [0, 0],
    ex: "car + pet = carpet. A carpet is a floor covering — notice how 'car' and 'pet' sound different when joined as 'carpet'! ✓" },

  { id: 153, d: 2,
    sA: ["good", "bad", "poor"], sB: ["bye", "luck", "form"], cp: [0, 0],
    ex: "good + bye = goodbye. We say goodbye when leaving someone. ✓" },

  // ===== D3: OPAQUE/DISGUISED COMPOUNDS (12 questions) =====
  // Pronunciation changes, advanced vocabulary, hard to spot

  { id: 154, d: 3,
    sA: ["habit", "custom", "routine"], sB: ["at", "by", "in"], cp: [0, 0],
    ex: "habit + at = habitat. A habitat is the natural home of an animal or plant. Notice how 'habit' + 'at' sounds completely different as 'habitat'! ✓" },

  { id: 155, d: 3,
    sA: ["feat", "trick", "stunt"], sB: ["her", "him", "them"], cp: [0, 0],
    ex: "feat + her = feather. A feather is the light covering on a bird. Spell it out: f-e-a-t-h-e-r. The key is to think about spelling, not sound! ✓" },

  { id: 156, d: 3,
    sA: ["band", "belt", "strap"], sB: ["age", "size", "fit"], cp: [0, 0],
    ex: "band + age = bandage. A bandage is a strip of material used to cover a wound. ✓" },

  { id: 157, d: 3,
    sA: ["imp", "elf", "fairy"], sB: ["air", "dust", "tale"], cp: [0, 0],
    ex: "imp + air = impair. To impair means to weaken or damage. Spell it out: i-m-p-a-i-r. Don't rely on sound — spell it letter by letter! ✓" },

  { id: 158, d: 3,
    sA: ["be", "am", "is"], sB: ["cause", "reason", "effect"], cp: [0, 0],
    ex: "be + cause = because. 'Because' gives a reason for something. The word 'be' + 'cause' is hidden inside! ✓" },

  { id: 159, d: 3,
    sA: ["spear", "sword", "shield"], sB: ["mint", "rust", "polish"], cp: [0, 0],
    ex: "spear + mint = spearmint. Spearmint is a type of mint plant used for flavouring. ✓" },

  { id: 160, d: 3,
    sA: ["copy", "memo", "draft"], sB: ["right", "pad", "beer"], cp: [0, 0],
    ex: "copy + right = copyright. Copyright is the legal right to control how creative work is used. ✓" },

  { id: 161, d: 3,
    sA: ["master", "teacher", "pupil"], sB: ["piece", "pet", "desk"], cp: [0, 0],
    ex: "master + piece = masterpiece. A masterpiece is an outstanding work of art or skill. ✓" },

  { id: 162, d: 3,
    sA: ["quarter", "double", "triple"], sB: ["back", "dutch", "jump"], cp: [0, 0],
    ex: "quarter + back = quarterback. A quarterback is a key player in American football. ✓" },

  { id: 163, d: 3,
    sA: ["reap", "sow", "plant"], sB: ["pear", "seed", "root"], cp: [0, 0],
    ex: "reap + pear = reappear. Reappear means to appear again. Spell it: r-e-a-p-p-e-a-r. This is the classic GL trick — the sound is completely different from the parts! ✓" },

  { id: 164, d: 3,
    sA: ["bar", "pub", "inn"], sB: ["gain", "loss", "profit"], cp: [0, 0],
    ex: "bar + gain = bargain. A bargain is something bought at a good price. The spelling hides 'bar' + 'gain' inside! ✓" },

  { id: 165, d: 3,
    sA: ["nut", "bolt", "screw"], sB: ["meg", "phil", "ted"], cp: [0, 0],
    ex: "nut + meg = nutmeg. Nutmeg is a spice used in baking. The names Phil and Ted are distractors — only 'meg' combines with 'nut' to make a real word! ✓" },
];

// All use same question text and pick-from-sets format
const questionText = "Find two words, one from each group, that join together to make a new word. The word from the first group always comes first.";

// Read file and find compound words section
let content = fs.readFileSync(filePath, 'utf8');

// Find the end of compoundWords questions array
const cwStart = content.indexOf("compoundWords: {");
const hiddenStart = content.indexOf("hiddenWords: {");
const cwSection = content.substring(cwStart, hiddenStart);

// Find the ] that closes the questions array
const questionsStart = cwSection.indexOf("questions: [");
let depth = 0, arrayEnd = -1;
for (let i = cwSection.indexOf("[", questionsStart); i < cwSection.length; i++) {
  if (cwSection[i] === '[') depth++;
  if (cwSection[i] === ']') depth--;
  if (depth === 0) { arrayEnd = i; break; }
}

const insertPoint = cwStart + arrayEnd;

// Format new questions as JSON-style (matching Q101+ format)
const formatted = newQuestions.map(q => {
  return `        {
          "id": ${q.id},
          "difficulty": ${q.d},
          "questionType": "pick-from-sets",
          "question": "${questionText}",
          "setA": [
            "${q.sA[0]}",
            "${q.sA[1]}",
            "${q.sA[2]}"
          ],
          "setB": [
            "${q.sB[0]}",
            "${q.sB[1]}",
            "${q.sB[2]}"
          ],
          "correctPair": [
            ${q.cp[0]},
            ${q.cp[1]}
          ],
          "explanation": "${q.ex.replace(/"/g, '\\"')}"
        }`;
}).join(',\n');

// Insert before the closing ]
const newContent = content.substring(0, insertPoint) + ',\n' + formatted + '\n      ' + content.substring(insertPoint);
fs.writeFileSync(filePath, newContent, 'utf8');

console.log(`Added ${newQuestions.length} GL-authentic compound word questions (Q126-Q165)`);
console.log(`D1: ${newQuestions.filter(q=>q.d===1).length}, D2: ${newQuestions.filter(q=>q.d===2).length}, D3: ${newQuestions.filter(q=>q.d===3).length}`);

// Verify
delete require.cache[require.resolve('../src/questionData/vrData.js')];
const m = require('../src/questionData/vrData.js');
const qs = m.default?.topics?.compoundWords?.questions || m.topics?.compoundWords?.questions;
console.log(`Total compound word questions: ${qs.length}`);
const last = qs[qs.length - 1];
console.log(`Last question: Q${last.id} (${last.questionType}) — ${last.setA?.join(', ')} / ${last.setB?.join(', ')}`);

/**
 * Comprehensive VR Antonyms fix script
 * Fixes: ambiguous answers, duplicate pairs, difficulty levels, overused distractors
 */
const fs = require('fs');
const filePath = 'C:/Users/Ben Jackson/Projects/11plus-prep/src/questionData/vrData.js';
const content = fs.readFileSync(filePath, 'utf8');

// Parse existing questions
const antStart = content.indexOf("antonyms: {");
const antEnd = content.indexOf("verbalAnalogies:");
const section = content.substring(antStart, antEnd);
const blocks = section.split(/\{[\s\n]*(?:"id"|id):/);
blocks.shift();

const existing = [];
for (const b of blocks) {
  const id = parseInt(b.match(/^\s*(\d+)/)[1]);
  const d = parseInt(b.match(/(?:"difficulty"|difficulty):\s*(\d+)/)[1]);
  const sA = b.match(/(?:"setA"|setA):\s*\[([\s\S]*?)\]/)[1].match(/["']([^"']+)["']/g).map(s => s.replace(/["']/g, ''));
  const sB = b.match(/(?:"setB"|setB):\s*\[([\s\S]*?)\]/)[1].match(/["']([^"']+)["']/g).map(s => s.replace(/["']/g, ''));
  const cp = b.match(/(?:"correctPair"|correctPair):\s*\[([\s\S]*?)\]/)[1].trim().split(/\s*,\s*/).map(Number);
  const exM = b.match(/(?:"explanation"|explanation):\s*"([\s\S]*?)"\s*$/m);
  existing.push({ id, d, sA, sB, cp, ex: exM ? exM[1] : '' });
}

// Fix map: id -> { d?, sA?, sB?, cp?, ex? }
// Only changed fields are specified
const F = {};

// ===== AMBIGUOUS ANSWERS (multiple valid antonym pairs) =====

F[1] = { // generous/mean — cheerful/sad was also valid
  sA: ["generous", "spoon", "table"], sB: ["chair", "mean", "fork"], cp: [0, 1],
  ex: "'Generous' means willing to give freely, while 'mean' means unwilling to share — direct opposites. 'Spoon' and 'fork' are both cutlery — related, not opposite. 'Table' and 'chair' are both furniture — related, not opposite. ✓"
};
F[6] = { // brave/cowardly — brave/timid was also valid
  sA: ["brave", "doctor", "tiger"], sB: ["lion", "cowardly", "nurse"], cp: [0, 1],
  ex: "'Brave' means courageous, while 'cowardly' means lacking courage — direct opposites. 'Tiger' and 'lion' are both big cats — similar, not opposite. 'Doctor' and 'nurse' both work in medicine — related, not opposite. ✓"
};
F[8] = { // ancient/modern — heavy/light was also valid (USER REPORTED)
  sA: ["butter", "ancient", "sock"], sB: ["modern", "shoe", "bread"], cp: [1, 0],
  ex: "'Ancient' means extremely old, while 'modern' means present-day — direct opposites. 'Butter' and 'bread' go together but aren't opposites. 'Sock' and 'shoe' are both worn on feet — related, not opposite. ✓"
};
F[24] = { // big/small — read/write was arguable
  sA: ["horse", "cow", "big"], sB: ["small", "sheep", "donkey"], cp: [2, 0],
  ex: "'Big' means large in size, while 'small' means little — direct opposites. 'Horse' and 'donkey' are both animals you can ride — similar, not opposite. 'Cow' and 'sheep' are both farm animals — related, not opposite. ✓"
};
F[27] = { // strong/weak — rain/sun was arguable
  sA: ["draw", "hammer", "strong"], sB: ["weak", "nail", "paint"], cp: [2, 0],
  ex: "'Strong' means having great power, while 'weak' means lacking strength — direct opposites. 'Hammer' and 'nail' go together but aren't opposites. 'Draw' and 'paint' are both art activities — similar, not opposite. ✓"
};
F[34] = { // deep/shallow — hill/valley was also valid
  sA: ["stream", "deep", "beach"], sB: ["coast", "shallow", "river"], cp: [1, 1],
  ex: "'Deep' means extending far down, while 'shallow' means not very deep — direct opposites. 'Stream' and 'river' are both types of flowing water — similar, not opposite. 'Beach' and 'coast' also mean similar things. ✓"
};
F[47] = { // polite/rude had brave/timid ambiguity + duplicate pair. New: boring/exciting
  d: 2, sA: ["boring", "gather", "repair"], sB: ["fix", "exciting", "collect"], cp: [0, 1],
  ex: "'Boring' means dull and uninteresting, while 'exciting' means thrilling — direct opposites. 'Gather' and 'collect' mean the same thing — synonyms, not opposites. 'Repair' and 'fix' also mean the same thing. ✓"
};
F[48] = { // patient/impatient — cheerful/grumpy AND busy/lazy also valid
  sA: ["patient", "sensible", "honest"], sB: ["truthful", "wise", "impatient"], cp: [0, 2],
  ex: "'Patient' means able to wait calmly, while 'impatient' means unable to wait — direct opposites (the prefix 'im-' reverses the meaning). 'Sensible' and 'wise' both mean having good judgement — synonyms. 'Honest' and 'truthful' also mean the same thing. ✓"
};
F[49] = { // confident/nervous — calm/restless was also valid
  sA: ["swift", "hungry", "confident"], sB: ["nervous", "starving", "rapid"], cp: [2, 0],
  ex: "'Confident' means feeling sure of yourself, while 'nervous' means feeling worried — direct opposites. 'Swift' and 'rapid' both mean fast — synonyms. 'Hungry' and 'starving' both mean wanting food — also synonyms. ✓"
};
F[66] = { // DUPLICATE confident/nervous + cheerful/serious ambiguity. New: tame/wild
  d: 2, sA: ["tame", "wealthy", "cunning"], sB: ["crafty", "rich", "wild"], cp: [0, 2],
  ex: "'Tame' means gentle and used to humans, while 'wild' means living in a natural, untamed state — direct opposites. 'Wealthy' and 'rich' mean the same thing — synonyms. 'Cunning' and 'crafty' also mean the same thing. ✓"
};
F[84] = { // industrious/idle — fragrant/pungent arguable + duplicate. New: frugal/extravagant
  d: 3, sA: ["scrupulous", "frugal", "resilient"], sB: ["extravagant", "robust", "meticulous"], cp: [1, 0],
  ex: "'Frugal' means careful with money, while 'extravagant' means spending lavishly — direct opposites. 'Scrupulous' and 'meticulous' both mean extremely thorough — synonyms. 'Resilient' and 'robust' both describe toughness — also synonyms. ✓"
};

// ===== DIFFICULTY LEVEL FIXES =====

F[20] = { d: 2 }; // voluntary/compulsory: common Year 5 words, D3→D2
F[86] = { // knowledge/ignorance: common words, D3→D2. Also improve distractors
  d: 2, sA: ["knowledge", "voyage", "pleasant"], sB: ["agreeable", "ignorance", "expedition"], cp: [0, 1],
  ex: "'Knowledge' means understanding gained through learning, while 'ignorance' means lack of knowledge — direct opposites. 'Voyage' and 'expedition' are near-synonyms (both describe long journeys). 'Pleasant' and 'agreeable' also mean the same thing. ✓"
};
F[107] = { // D1 with D3 distractors (ornate/quaint/intricate) → simplify
  sA: ["bright", "pond", "stamp"], sB: ["coin", "dim", "lake"], cp: [0, 1],
  ex: "'Bright' means giving out strong light, while 'dim' means giving out weak light — direct opposites. 'Pond' and 'lake' are both bodies of water — similar, not opposite. 'Stamp' and 'coin' are both small collectible items — related, not opposite. ✓"
};
F[108] = { // D1 with D3 distractors (earnest/diligent/pragmatic/methodical) → simplify
  sA: ["friend", "brush", "glove"], sB: ["mitten", "comb", "enemy"], cp: [0, 2],
  ex: "'Friend' means someone you trust, while 'enemy' means someone who opposes you — direct opposites. 'Brush' and 'comb' are both for grooming hair — similar, not opposite. 'Glove' and 'mitten' are both worn on hands — related, not opposite. ✓"
};
F[119] = { d: 2 }; // timid/bold: common words, D3→D2

// ===== REDUCE 3+ OCCURRENCE PAIRS (replace with new unique pairs) =====

F[72] = { // praise/criticise (3rd) → borrow/lend
  d: 2, sA: ["borrow", "wander", "observe"], sB: ["travel", "lend", "watch"], cp: [0, 1],
  ex: "'Borrow' means to take something temporarily, while 'lend' means to give something temporarily — direct opposites. 'Wander' and 'travel' are near-synonyms. 'Observe' and 'watch' also mean the same thing. ✓"
};
F[73] = { // increase/decrease (3rd) → destroy/create
  d: 2, sA: ["destroy", "select", "observe"], sB: ["watch", "create", "choose"], cp: [0, 1],
  ex: "'Destroy' means to completely ruin, while 'create' means to bring into existence — direct opposites. 'Select' and 'choose' mean the same thing. 'Observe' and 'watch' also mean the same thing. ✓"
};
F[74] = { // arrive/depart (3rd) → remember/forget
  d: 2, sA: ["remember", "observe", "collect"], sB: ["gather", "forget", "notice"], cp: [0, 1],
  ex: "'Remember' means to keep in your mind, while 'forget' means to fail to recall — direct opposites. 'Collect' and 'gather' are near-synonyms. 'Observe' and 'notice' also mean the same thing. ✓"
};
F[78] = { // conceal/reveal (3rd) → demolish/construct
  d: 3, sA: ["navigate", "demolish", "cultivate"], sB: ["nurture", "construct", "steer"], cp: [1, 1],
  ex: "'Demolish' means to completely destroy a building, while 'construct' means to build — direct opposites. 'Navigate' and 'steer' are near-synonyms. 'Cultivate' and 'nurture' also mean similar things. ✓"
};
F[95] = { // conceal/reveal (4th) → primitive/sophisticated
  d: 3, sA: ["primitive", "evaluate", "anticipate"], sB: ["expect", "sophisticated", "assess"], cp: [0, 1],
  ex: "'Primitive' means basic and undeveloped, while 'sophisticated' means highly developed and complex — direct opposites. 'Evaluate' and 'assess' are near-synonyms. 'Anticipate' and 'expect' also mean the same thing. ✓"
};
F[117] = { // praise/criticise (2nd) → reward/punish
  d: 2, sA: ["reward", "capture", "permit"], sB: ["allow", "punish", "seize"], cp: [0, 1],
  ex: "'Reward' means to give something good for effort, while 'punish' means to impose a penalty — direct opposites. 'Capture' and 'seize' are near-synonyms. 'Permit' and 'allow' also mean the same thing. ✓"
};

// ===== SAME-DIFFICULTY DUPLICATE PAIRS (replace 2nd occurrence with new unique pair) =====

F[37] = { d: 1, // cruel/kind dup → sink/float
  sA: ["sink", "flower", "stone"], sB: ["pebble", "float", "petal"], cp: [0, 1],
  ex: "'Sink' means to go down below the surface, while 'float' means to stay on top — direct opposites. 'Flower' and 'petal' are connected (a petal is part of a flower). 'Stone' and 'pebble' mean almost the same thing. ✓"
};
F[43] = { d: 1, // loud/quiet dup → wet/dry
  sA: ["tent", "map", "wet"], sB: ["dry", "compass", "camp"], cp: [2, 0],
  ex: "'Wet' means covered in water, while 'dry' means free from moisture — direct opposites. 'Tent' and 'camp' are connected (you pitch a tent at camp). 'Map' and 'compass' are both navigation tools — similar, not opposite. ✓"
};
F[44] = { d: 1, // fast/slow dup → up/down
  sA: ["path", "up", "hedge"], sB: ["gate", "fence", "down"], cp: [1, 2],
  ex: "'Up' means towards a higher position, while 'down' means towards a lower position — direct opposites. 'Hedge' and 'fence' are both garden barriers — similar, not opposite. 'Path' and 'gate' are both found in gardens — related, not opposite. ✓"
};
F[50] = { d: 2, // generous/mean dup → appear/vanish
  sA: ["appear", "careful", "swift"], sB: ["rapid", "vanish", "cautious"], cp: [0, 1],
  ex: "'Appear' means to become visible, while 'vanish' means to disappear — direct opposites. 'Careful' and 'cautious' mean the same thing — synonyms. 'Swift' and 'rapid' also mean the same thing. ✓"
};
F[63] = { d: 2, // cautious/reckless dup → private/public
  sA: ["observe", "private", "ordinary"], sB: ["public", "usual", "notice"], cp: [1, 0],
  ex: "'Private' means for one person or group only, while 'public' means open to everyone — direct opposites. 'Observe' and 'notice' are near-synonyms. 'Ordinary' and 'usual' also mean the same thing. ✓"
};
F[64] = { d: 2, // polite/rude dup → capture/release
  sA: ["determined", "capture", "wealthy"], sB: ["rich", "resolute", "release"], cp: [1, 2],
  ex: "'Capture' means to catch and hold, while 'release' means to set free — direct opposites. 'Determined' and 'resolute' mean the same thing. 'Wealthy' and 'rich' also mean the same thing. ✓"
};
F[65] = { d: 2, // patient/impatient dup → vacant/occupied
  sA: ["vacant", "gradual", "empty"], sB: ["occupied", "steady", "hollow"], cp: [0, 0],
  ex: "'Vacant' means not being used, while 'occupied' means being used or filled — direct opposites. 'Gradual' and 'steady' are near-synonyms (both describe a constant pace). 'Empty' and 'hollow' are also similar (both describe having nothing inside). ✓"
};
F[67] = { d: 2, // visible/hidden dup → export/import
  sA: ["import", "obvious", "certain"], sB: ["sure", "export", "clear"], cp: [0, 1],
  ex: "'Import' means to bring goods into a country, while 'export' means to send goods out — direct opposites. 'Certain' and 'sure' mean the same thing. 'Obvious' and 'clear' also mean the same thing. ✓"
};
F[68] = { d: 2, // hostile/friendly dup → flexible/rigid
  sA: ["flexible", "scatter", "preserve"], sB: ["conserve", "rigid", "distribute"], cp: [0, 1],
  ex: "'Flexible' means able to bend easily, while 'rigid' means stiff and unable to bend — direct opposites. 'Scatter' and 'distribute' are near-synonyms. 'Preserve' and 'conserve' also mean the same thing. ✓"
};
F[69] = { d: 2, // accept/reject dup → attack/defend
  sA: ["discover", "attack", "wander"], sB: ["defend", "roam", "explore"], cp: [1, 0],
  ex: "'Attack' means to act aggressively against, while 'defend' means to protect — direct opposites. 'Wander' and 'roam' are near-synonyms. 'Discover' and 'explore' are also similar (both about finding things). ✓"
};
F[70] = { d: 2, // genuine/fake dup → major/minor
  sA: ["major", "swift", "certain"], sB: ["sure", "minor", "rapid"], cp: [0, 1],
  ex: "'Major' means important or large, while 'minor' means less important or small — direct opposites. 'Swift' and 'rapid' are near-synonyms (both mean fast). 'Certain' and 'sure' also mean the same thing. ✓"
};
F[71] = { d: 2, // familiar/strange dup → interior/exterior
  sA: ["interior", "popular", "determined"], sB: ["persistent", "resolute", "exterior"], cp: [0, 2],
  ex: "'Interior' means the inside, while 'exterior' means the outside — direct opposites. 'Determined' and 'persistent' are near-synonyms. 'Popular' and 'resolute' are unrelated qualities. ✓"
};
F[75] = { d: 2, // rare/common dup → innocent/guilty
  sA: ["innocent", "voyage", "obtain"], sB: ["journey", "guilty", "acquire"], cp: [0, 1],
  ex: "'Innocent' means not guilty of wrongdoing, while 'guilty' means having committed an offence — direct opposites. 'Voyage' and 'journey' are near-synonyms. 'Obtain' and 'acquire' also mean the same thing. ✓"
};
F[76] = { d: 2, // success/failure dup → ascend/descend
  sA: ["ascend", "gather", "purchase"], sB: ["buy", "collect", "descend"], cp: [0, 2],
  ex: "'Ascend' means to go up, while 'descend' means to go down — direct opposites. 'Gather' and 'collect' are near-synonyms. 'Purchase' and 'buy' also mean the same thing. ✓"
};
F[96] = { d: 3, // negligent/attentive dup → candid/secretive
  sA: ["tenacious", "candid", "resilient"], sB: ["robust", "secretive", "persistent"], cp: [1, 1],
  ex: "'Candid' means open and straightforward, while 'secretive' means inclined to hide things — direct opposites. 'Tenacious' and 'persistent' are near-synonyms. 'Resilient' and 'robust' also mean similar things. ✓"
};
F[97] = { d: 3, // deliberate/accidental dup → transient/enduring
  sA: ["whimsical", "transient", "flamboyant"], sB: ["enduring", "ostentatious", "capricious"], cp: [1, 0],
  ex: "'Transient' means lasting only a short time, while 'enduring' means lasting a long time — direct opposites. 'Whimsical' and 'capricious' are near-synonyms (both mean unpredictable). 'Flamboyant' and 'ostentatious' also mean similar things (both mean showy). ✓"
};
F[98] = { d: 3, // gregarious/reclusive dup → prolific/barren
  sA: ["prolific", "dramatic", "poetic"], sB: ["lyrical", "theatrical", "barren"], cp: [0, 2],
  ex: "'Prolific' means producing a great deal, while 'barren' means producing nothing — direct opposites. 'Dramatic' and 'theatrical' are near-synonyms. 'Poetic' and 'lyrical' also mean similar things. ✓"
};
F[100] = { d: 3, // tranquil/turbulent dup → obsolete/contemporary
  sA: ["obsolete", "conscientious", "assertive"], sB: ["forthright", "contemporary", "diligent"], cp: [0, 1],
  ex: "'Obsolete' means no longer in use, while 'contemporary' means belonging to the present — direct opposites. 'Conscientious' and 'diligent' are near-synonyms. 'Assertive' and 'forthright' also mean similar things. ✓"
};
F[103] = { d: 1, // rough/smooth dup → true/false
  sA: ["musical", "dramatic", "true"], sB: ["false", "theatrical", "artistic"], cp: [2, 0],
  ex: "'True' means correct and accurate, while 'false' means incorrect — direct opposites. 'Musical' and 'artistic' are near-synonyms (both about creative talent). 'Dramatic' and 'theatrical' also mean similar things. ✓"
};
F[112] = { d: 2, // artificial/natural dup → humble/boastful
  sA: ["humble", "whimsical", "preserve"], sB: ["conserve", "boastful", "peculiar"], cp: [0, 1],
  ex: "'Humble' means modest and unassuming, while 'boastful' means bragging about yourself — direct opposites. 'Preserve' and 'conserve' are near-synonyms. 'Whimsical' and 'peculiar' are also similar (both mean unusual). ✓"
};
F[114] = { d: 2, // dull/vivid dup → complex/straightforward
  sA: ["complex", "ornate", "elaborate"], sB: ["intricate", "detailed", "straightforward"], cp: [0, 2],
  ex: "'Complex' means difficult to understand, while 'straightforward' means easy to understand — direct opposites. 'Ornate' and 'intricate' are near-synonyms. 'Elaborate' and 'detailed' also mean similar things. ✓"
};
F[116] = { d: 2, // voluntary/compulsory dup → permit/forbid
  sA: ["permit", "versatile", "ambitious"], sB: ["aspiring", "adaptable", "forbid"], cp: [0, 2],
  ex: "'Permit' means to allow, while 'forbid' means to refuse to allow — direct opposites. 'Versatile' and 'adaptable' are near-synonyms. 'Ambitious' and 'aspiring' also mean similar things. ✓"
};
F[118] = { d: 2, // maximum/minimum dup → junior/senior
  sA: ["junior", "average", "annual"], sB: ["yearly", "senior", "typical"], cp: [0, 1],
  ex: "'Junior' means younger or lower in rank, while 'senior' means older or higher in rank — direct opposites. 'Average' and 'typical' are near-synonyms. 'Annual' and 'yearly' also mean the same thing. ✓"
};
F[120] = { d: 3, // flourish/wither dup → compliment/insult
  sA: ["compliment", "hesitate", "versatile"], sB: ["adaptable", "insult", "waver"], cp: [0, 1],
  ex: "'Compliment' means to express praise, while 'insult' means to speak disrespectfully — direct opposites. 'Hesitate' and 'waver' are near-synonyms. 'Versatile' and 'adaptable' also mean the same thing. ✓"
};
F[125] = { d: 3, // abundant/scarce dup → amateur/professional
  sA: ["amateur", "pragmatic", "peculiar"], sB: ["eccentric", "professional", "practical"], cp: [0, 1],
  ex: "'Amateur' means doing something as a hobby, while 'professional' means doing it as a paid career — direct opposites. 'Pragmatic' and 'practical' are near-synonyms. 'Peculiar' and 'eccentric' also mean similar things. ✓"
};


// ========== APPLY FIXES ==========
const corrected = existing.map(q => {
  const f = F[q.id];
  if (!f) return q;
  return {
    id: q.id,
    d: f.d !== undefined ? f.d : q.d,
    sA: f.sA || q.sA,
    sB: f.sB || q.sB,
    cp: f.cp || q.cp,
    ex: f.ex || q.ex
  };
});

// ========== VALIDATE ==========
const knownAnts = new Set([
  "hot/cold","big/small","tall/short","fast/slow","loud/quiet","happy/sad",
  "light/dark","clean/dirty","open/shut","early/late","full/empty","deep/shallow",
  "wide/narrow","rich/poor","kind/cruel","push/pull","thick/thin","young/old",
  "sharp/blunt","brave/cowardly","rough/smooth","strong/weak","hard/soft",
  "generous/mean","cheerful/sad","brave/timid","noisy/silent","ancient/modern",
  "heavy/light","increase/decrease","bright/dim","awake/asleep","simple/difficult",
  "arrive/depart","friend/enemy","expand/shrink","temporary/permanent",
  "timid/bold","artificial/natural","maximum/minimum","compulsory/optional",
  "polite/rude","inferior/superior","voluntary/compulsory","cautious/reckless",
  "familiar/strange","hostile/friendly","genuine/fake","visible/hidden",
  "accept/reject","beautiful/ugly","complex/simple","rare/common",
  "praise/criticise","success/failure","unite/divide","patient/impatient",
  "confident/nervous","include/exclude","selfish/generous","advance/retreat",
  "dull/vivid","victory/defeat","reveal/conceal","conceal/reveal",
  "tame/wild","cheerful/grumpy","busy/lazy","calm/restless","cheerful/serious",
  "hill/valley","read/write","start/finish","true/false","wet/dry","up/down",
  "sink/float","boring/exciting","innocent/guilty","import/export",
  "flexible/rigid","major/minor","private/public","attack/defend",
  "remember/forget","reward/punish","ascend/descend","borrow/lend",
  "destroy/create","interior/exterior","permit/forbid","junior/senior",
  "humble/boastful","compliment/insult","amateur/professional",
  "capture/release","appear/vanish","vacant/occupied","complex/straightforward",
  "give/take","love/hate","buy/sell","win/lose"
]);

// Make bidirectional
const antSet = new Set();
for (const p of knownAnts) {
  const [a, b] = p.split('/');
  antSet.add(`${a}/${b}`);
  antSet.add(`${b}/${a}`);
}

let errors = 0;

// Check ambiguity
for (const q of corrected) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i === q.cp[0] && j === q.cp[1]) continue;
      const k = `${q.sA[i].toLowerCase()}/${q.sB[j].toLowerCase()}`;
      if (antSet.has(k)) {
        console.log(`⚠ Q${q.id}(D${q.d}): ALT PAIR ${q.sA[i]}/${q.sB[j]} alongside ${q.sA[q.cp[0]]}/${q.sB[q.cp[1]]}`);
        errors++;
      }
    }
  }
}

// Check duplicate pairs
const pairMap = {};
for (const q of corrected) {
  const k = [q.sA[q.cp[0]], q.sB[q.cp[1]]].map(w => w.toLowerCase()).sort().join('/');
  if (!pairMap[k]) pairMap[k] = [];
  pairMap[k].push({ id: q.id, d: q.d });
}
for (const [pair, entries] of Object.entries(pairMap)) {
  if (entries.length > 2) {
    console.log(`⚠ ${pair}: ${entries.length} times — Q${entries.map(e => e.id).join(', Q')}`);
    errors++;
  }
}

// Difficulty distribution
const dd = { 1: 0, 2: 0, 3: 0 };
for (const q of corrected) dd[q.d]++;
console.log(`Distribution: D1=${dd[1]}, D2=${dd[2]}, D3=${dd[3]}`);

// Word frequency
const wf = {};
for (const q of corrected) {
  for (const w of [...q.sA, ...q.sB]) wf[w.toLowerCase()] = (wf[w.toLowerCase()] || 0) + 1;
}
const over = Object.entries(wf).filter(([, c]) => c >= 6).sort((a, b) => b[1] - a[1]);
if (over.length) {
  console.log("Overused (6+):");
  for (const [w, c] of over) console.log(`  ${w}: ${c}`);
}

if (errors > 0) {
  console.log(`\n${errors} errors found — review above before writing.`);
}

console.log(`\nFixes: ${Object.keys(F).length} questions`);

// ========== WRITE ==========
// Find the exact boundaries of the questions array
const qArrayStart = content.indexOf("questions: [", antStart);
const bracketStart = content.indexOf("[", qArrayStart);

// Find matching ]
let depth = 0, bracketEnd = -1;
for (let i = bracketStart; i < content.length; i++) {
  if (content[i] === '[') depth++;
  if (content[i] === ']') depth--;
  if (depth === 0) { bracketEnd = i + 1; break; }
}

// Format questions
function fmt(q) {
  const isJson = q.id >= 101;
  const ex = q.ex.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  if (isJson) {
    return `        {
          "id": ${q.id},
          "difficulty": ${q.d},
          "questionType": "pick-from-sets",
          "question": "Choose one word from each group that are most opposite in meaning.",
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
          "explanation": "${ex}"
        }`;
  }
  return `              {
                      id: ${q.id},
                      difficulty: ${q.d},
                      questionType: "pick-from-sets",
                      question: "Choose one word from each group that are most opposite in meaning.",
                      setA: ["${q.sA[0]}","${q.sA[1]}","${q.sA[2]}"],
                      setB: ["${q.sB[0]}","${q.sB[1]}","${q.sB[2]}"],
                      correctPair: [${q.cp[0]},${q.cp[1]}],
                      explanation: "${ex}"
              }`;
}

const newArray = '[\n' + corrected.map(q => fmt(q)).join(',\n') + '\n      ]';
const newContent = content.substring(0, bracketStart) + newArray + content.substring(bracketEnd);

fs.writeFileSync(filePath, newContent, 'utf8');
console.log("\n✅ File written successfully.");

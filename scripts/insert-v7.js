const fs = require('fs');
const path = require('path');

function scrambleMC(q, targetPos) {
  if (targetPos === 0) return q;
  const opts = [...q.options];
  const correct = opts[0];
  opts.splice(0, 1);
  opts.splice(targetPos, 0, correct);
  return { ...q, options: opts, correct: targetPos };
}

const MC_POSITIONS = [2,4,1,3,0,2,4,1,3,0,2,4,1,3,0,2,4,1,3,0,2,4,1,3,0,2,4,1,3,0];

const v7Raw = [
  {id:156,difficulty:1,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe BLET kept Daisy warm on the freezing winter night.",options:["ANK","OLT","ART","RIM","EEN"],correct:0,explanation:"Insert ANK into BLET: BL + ANK + ET = BLANKET. A blanket is a soft covering used on a bed. The sentence gives the clue — warm on a freezing night. ✓"},
  {id:157,difficulty:1,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe school band's TRET sounded loud and proud in the parade.",options:["UMP","AIN","OSS","ICK","END"],correct:0,explanation:"Insert UMP into TRET: TR + UMP + ET = TRUMPET. A trumpet is a brass musical instrument. The parade and the loud, proud sound told you it was a trumpet. ✓"},
  {id:158,difficulty:1,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nDad fixed the BRET to the wall to hold up the heavy bookshelf.",options:["ACK","ICK","OOK","OIL","EEN"],correct:0,explanation:"Insert ACK into BRET: BR + ACK + ET = BRACKET. A bracket is an L-shaped support fixed to a wall. The clue — holding up a shelf — narrows it down. ✓"},
  {id:159,difficulty:1,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nIt was the DEST night of the year — no moon and no stars in sight.",options:["ARK","AMP","EEP","ULL","OZY"],correct:0,explanation:"Insert ARK into DEST: D + ARK + EST = DARKEST. Darkest means most lacking in light. The sentence describes a night with no moon — the perfect clue. ✓"},
  {id:160,difficulty:1,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe small candle was BNING brightly in the window.",options:["URN","RIG","ENI","OWI","AKI"],correct:0,explanation:"Insert URN into BNING: B + URN + ING = BURNING. Burning means on fire. The candle clue tells you the word is about flames. ✓"},
  {id:161,difficulty:1,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe race STED the moment the starter fired the pistol.",options:["ART","OPP","RAY","EAM","ILL"],correct:0,explanation:"Insert ART into STED: ST + ART + ED = STARTED. Started means began. The pistol firing is the moment a race begins. ✓"},
  {id:162,difficulty:1,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe snake CHED a flute player, swaying gently in the basket.",options:["ARM","OOS","UMP","AIN","EAS"],correct:0,explanation:"Insert ARM into CHED: CH + ARM + ED = CHARMED. Charmed means fascinated or enchanted. Snake charmers use music to calm cobras — that's the clue. ✓"},
  {id:163,difficulty:1,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nMaya CPED her front tooth biting into the hard toffee apple.",options:["HIP","LAS","RIS","OOK","EAM"],correct:0,explanation:"Insert HIP into CPED: C + HIP + PED = CHIPPED. Chipped means a small piece has broken off. Biting hard toffee can chip a tooth — that's the clue. ✓"},
  {id:164,difficulty:1,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nFinn GRED at the silly joke his little sister told him.",options:["INN","OAN","OWN","ASP","OUT"],correct:0,explanation:"Insert INN into GRED: GR + INN + ED = GRINNED. Grinned means smiled broadly. A silly joke makes you smile — that's the sentence clue. ✓"},
  {id:165,difficulty:1,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nDad works at the car FORY just outside town.",options:["ACT","EST","ARM","OOL","USH"],correct:0,explanation:"Insert ACT into FORY: F + ACT + ORY = FACTORY. A factory is a large building where things are made. Cars are built in factories — that's the clue. ✓"},
  {id:166,difficulty:2,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nGran kept all her old photographs in a small wooden CNET by the fireplace.",options:["ABI","ORO","OVE","ENO","UMI"],correct:0,explanation:"Insert ABI into CNET: C + ABI + NET = CABINET. A cabinet is a piece of furniture with shelves or drawers for storage. The wooden storage clue points to a cabinet. ✓"},
  {id:167,difficulty:2,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nDad asked his boss for a TSFER to the office closer to home.",options:["RAN","EME","ALI","OUS","ICI"],correct:0,explanation:"Insert RAN into TSFER: T + RAN + SFER = TRANSFER. A transfer is a move from one place to another. Moving to a closer office is a transfer. ✓"},
  {id:168,difficulty:2,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe archaeologist held up a tiny FRAGT of Roman pottery from the dig site.",options:["MEN","MAN","ILE","ANT","ORM"],correct:0,explanation:"Insert MEN into FRAGT: FRAG + MEN + T = FRAGMENT. A fragment is a small broken piece. A tiny piece of pottery is a fragment. ✓"},
  {id:169,difficulty:2,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe maths teacher explained how to add one FRION to another.",options:["ACT","OST","USH","ENT","ICT"],correct:0,explanation:"Insert ACT into FRION: FR + ACT + ION = FRACTION. A fraction is a part of a whole, like 1/2 or 3/4. Adding fractions is a key maths skill. ✓"},
  {id:170,difficulty:2,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe train to London leaves from PLATM 9 in three minutes.",options:["FOR","ONE","INU","EST","AIR"],correct:0,explanation:"Insert FOR into PLATM: PLAT + FOR + M = PLATFORM. A platform is the raised area at a train station where you board. ✓"},
  {id:171,difficulty:2,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nHer essay was below the usual STARD expected at this school.",options:["AND","OUR","ITY","EAM","USE"],correct:0,explanation:"Insert AND into STARD: ST + AND + ARD = STANDARD. Standard means the expected level of quality. The clue — below what's expected — points to standard. ✓"},
  {id:172,difficulty:2,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe CHION lifted the heavy gold trophy above her head.",options:["AMP","OOS","ILL","INI","ORD"],correct:0,explanation:"Insert AMP into CHION: CH + AMP + ION = CHAMPION. A champion is the winner of a competition. Lifting a trophy is what winners do. ✓"},
  {id:173,difficulty:2,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe CUSER complained that her soup was cold and sent it back.",options:["TOM","MAN","ITY","ORS","ARI"],correct:0,explanation:"Insert TOM into CUSER: CUS + TOM + ER = CUSTOMER. A customer is someone who buys things at a shop or restaurant. The complaint clue tells you it's a customer. ✓"},
  {id:174,difficulty:2,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe puddle was SHRING quickly in the bright afternoon sun.",options:["INK","IFT","OUT","ELL","ARP"],correct:0,explanation:"Insert INK into SHRING: SHR + INK + ING = SHRINKING. Shrinking means getting smaller. Puddles shrink as they dry up — that's the sunny clue. ✓"},
  {id:175,difficulty:2,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nGran spent two nights in HOSAL after her fall on the icy path.",options:["PIT","TEL","OUS","ANT","ORN"],correct:0,explanation:"Insert PIT into HOSAL: HOS + PIT + AL = HOSPITAL. A hospital is where people go to be treated by doctors. After a fall, you might need hospital care. ✓"},
  {id:176,difficulty:3,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nShe drew an EORATE map of the treasure island with every cove and cave marked.",options:["LAB","VAL","ACC","ABS","RES"],correct:0,explanation:"Insert LAB into EORATE: E + LAB + ORATE = ELABORATE. Elaborate means highly detailed and complex. A map with every cove and cave is elaborate. ✓"},
  {id:177,difficulty:3,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe museum displayed AUNTIC Roman pottery dating back nearly two thousand years.",options:["THE","OMA","IDE","ROM","ENG"],correct:0,explanation:"Insert THE into AUNTIC: AU + THE + NTIC = AUTHENTIC. Authentic means real and genuine, not a copy. Genuine Roman pottery is authentic. ✓"},
  {id:178,difficulty:3,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe stream was so TRANRENT that Priya could count the pebbles on the bed below.",options:["SPA","QUI","LUC","STA","FOR"],correct:0,explanation:"Insert SPA into TRANRENT: TRAN + SPA + RENT = TRANSPARENT. Transparent means clear enough to see through. Counting pebbles through water means it's transparent. ✓"},
  {id:179,difficulty:3,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe total eclipse was an extraordinary PHENOON that drew crowds from across the country.",options:["MEN","ATI","OMI","AST","OZO"],correct:0,explanation:"Insert MEN into PHENOON: PHENO + MEN + ON = PHENOMENON. A phenomenon is a remarkable event or occurrence in nature. An eclipse is a famous phenomenon. ✓"},
  {id:180,difficulty:3,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nMarcus didn't RENISE his old primary school teacher when he bumped into her in town.",options:["COG","MEM","ARR","IGN","ACT"],correct:0,explanation:"Insert COG into RENISE: RE + COG + NISE = RECOGNISE. Recognise means to know someone or something on sight. Not knowing his old teacher means he didn't recognise her. ✓"},
  {id:181,difficulty:3,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe scientific APATUS gleamed under the bright laboratory lights.",options:["PAR","ARA","ENT","OST","INI"],correct:0,explanation:"Insert PAR into APATUS: AP + PAR + ATUS = APPARATUS. Apparatus means equipment used for a specific purpose. Lab apparatus is the gear scientists use. ✓"},
  {id:182,difficulty:3,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe school play had a DRAIC ending that left the whole audience in tears.",options:["MAT","MIC","OST","AST","ENT"],correct:0,explanation:"Insert MAT into DRAIC: DRA + MAT + IC = DRAMATIC. Dramatic means exciting and full of emotion. An ending that makes people cry is dramatic. ✓"},
  {id:183,difficulty:3,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nA crystal CHELIER hung from the centre of the grand ballroom ceiling.",options:["AND","OLI","INI","IST","EVE"],correct:0,explanation:"Insert AND into CHELIER: CH + AND + ELIER = CHANDELIER. A chandelier is a decorative hanging light, often with crystals. Ballrooms famously have chandeliers. ✓"},
  {id:184,difficulty:3,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe author wove a thrilling NARIVE about pirates, storms, and buried treasure.",options:["RAT","EAR","ATA","IST","EFF"],correct:0,explanation:"Insert RAT into NARIVE: NAR + RAT + IVE = NARRATIVE. A narrative is a story or account of events. A thrilling pirate story is a narrative. ✓"},
  {id:185,difficulty:3,question:"Which three letters complete the word in this sentence? Insert them in the right place.\n\nThe DELIE petals of the rose wilted in the strong afternoon sun.",options:["CAT","FRA","GIL","ETH","ORN"],correct:0,explanation:"Insert CAT into DELIE: DELI + CAT + E = DELICATE. Delicate means fragile and easily damaged. Petals that wilt easily are delicate. ✓"}
];

const v7Questions = v7Raw.map((q, i) => scrambleMC(q, MC_POSITIONS[i]));

// Format as JS object string
function qToJS(q, indent) {
  const pad = ' '.repeat(indent);
  const inner = ' '.repeat(indent + 2);
  let out = pad + '{\n';
  for (const [k, v] of Object.entries(q)) {
    if (Array.isArray(v)) {
      out += inner + k + ': ' + JSON.stringify(v) + ',\n';
    } else if (typeof v === 'string') {
      out += inner + k + ': ' + JSON.stringify(v) + ',\n';
    } else {
      out += inner + k + ': ' + v + ',\n';
    }
  }
  out += pad + '}';
  return out;
}

const v7Block = v7Questions.map(q => qToJS(q, 10)).join(',\n');

// Insert into vrData.js — after ID 155 closing brace at line 10047
const vrDataPath = path.join(__dirname, '../src/questionData/vrData.js');
const src = fs.readFileSync(vrDataPath, 'utf8');
const lines = src.split('\n');

// Find line with id: 155 in missingLettersWords and the closing brace after it
let topicStart = -1;
lines.forEach((l, i) => { if (l.includes('missingLettersWords: {')) topicStart = i; });
let id155LineIdx = -1;
for (let i = topicStart; i < lines.length; i++) {
  if (lines[i].match(/^\s+id: 155,/)) { id155LineIdx = i; break; }
}
// Find the closing } after id 155 (look for the next standalone })
let closingBraceIdx = -1;
for (let i = id155LineIdx + 1; i < id155LineIdx + 20; i++) {
  if (lines[i].match(/^\s+\}$/)) { closingBraceIdx = i; break; }
}
console.log('ID 155 at line:', id155LineIdx + 1, '| closing brace at:', closingBraceIdx + 1);

// Insert after closing brace
lines.splice(closingBraceIdx + 1, 0, ',' + '\n' + v7Block);

fs.writeFileSync(vrDataPath, lines.join('\n'));
console.log('vrData.js updated with V7 questions');

// Update lesson map
const mapPath = path.join(__dirname, '../public/vr-question-lesson-map.json');
const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
for (let i = 156; i <= 185; i++) {
  map.missingLettersWords.push({ questionId: i, subConceptId: 'inside-word-3letter', confidence: 'high' });
}
fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
console.log('map updated, missingLettersWords:', map.missingLettersWords.length, 'entries');

// Verify
const { default: vr } = require('../src/questionData/vrData.js');
const mlw = vr.topics.missingLettersWords.questions;
console.log('missingLettersWords count:', mlw.length, 'max ID:', Math.max(...mlw.map(q => q.id)));
console.log('Q156 correct pos:', mlw.find(q => q.id === 156)?.correct);
console.log('Q185 expl ends ✓:', mlw.find(q => q.id === 185)?.explanation?.trim()?.endsWith('✓'));
console.log('Scramble check Q156-165:', mlw.filter(q => q.id >= 156 && q.id <= 165).map(q => q.correct));

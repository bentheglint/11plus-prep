const fs = require('fs');
const path = require('path');
const { removeQuestions, insertQuestions, verifyStructure } = require('./lib/safe-insert');

function isWord(w) {
  const words = new Set(['ACE','AGE','ALE','APE','ATE','AWE','AID','AIM','AIR','ARC','ARM','OAK','OAR','OAT','OWE','OWL','OWN','EAR','EWE','ICE','IRE','LAD','LAP','LAW','LAY',
    'ABLE','ARCH','AXLE','BAIL','BAKE','BALD','BALE','BAND','BARE','BARN','BEAT','BOAR','BOLD','BONE','BORE','BOWL','BURN','CAGE','CAKE','CALM','CAME','CAMP','CAPE','CARD','CARE','CART','CAVE','CLAD','CLAM','CLAP','CLAY','COAL','COAT','COLD','COLT','CONE','COPE','CORD','CORE','CORK','CORN','DALE','DAME','DARE','DAWN','DOCK','DOME','DOOR','DUSK','DUST','EARN','EASE','FACE','FADE','FAME','FARE','FAWN','FEAR','FERN','FOAM','FOAL','FOLD','FOND','FOOL','FORD','FORK','FOWL','GALE','GAME','GATE','GAVE','GEAR','GOAT','GOLD','GORE','HAIL','HALE','HARE','HARM','HAZE','HIDE','HOLE','HOOD','HORN','LACE','LAID','LAKE','LAME','LANE','LARD','LATE','LEAD','LEAN','LIME','LINE','LOAD','LOCK','LONE','LORD','LORE','MACE','MADE','MALE','MANE','MARE','MOAN','MOCK','MOLE','MOOD','MOON','MOOR','MOAT','NAIL','NEAR','PACE','PAGE','PAID','PAIL','PAIN','PAIR','PALE','PALM','PANE','PARK','PAST','PAVE','PEAK','PEAR','PINE','PLAY','PLOD','PLUM','RACE','RAGE','RAID','RAIL','RAIN','RAKE','RICE','RIDE','RIME','RING','ROAD','ROBE','ROCK','RODE','ROLE','ROPE','ROSE','RUIN','RULE','SAGE','SAID','SAIL','SAKE','SALE','SANE','SEAL','SEAM','SOAK','SOAR','SOCK','SOLD','SOLE','SONG','SORE','SOUL','STAR','TALE','TAME','TARN','TEAK','TEAR','TERN','TIDE','TILE','TIME','TIRE','TOAD','TORE','TORN','VALE','VANE','VINE','WADE','WAGE','WAKE','WANE','WARE','WAVE','WEAK','WEAR','WILE','WIND','WINE','WIRE','WOKE','WOVE',
    'BEACH','BLAND','BRAND','BRAIN','CRANE','DRAIN','FLAME','PLANT','PLATE','PRICE','REIGN','STERN','STALE','STORE','SCOLD','SPINE','STOVE','SWEAR','TRAIL','TRAIN','TREAT','WHEAT','TRACE','BLAZE','BRAVE','CLASH','CRASH','CREAM','DREAM','GRAIN','GRAND','GRASP','GRAZE','GROVE','GUARD','PLEAD','PLUME','PRIME','PROVE','SATIN','SCARE','SCENE','SHADE','SHALE','SHAME','SHAPE','SHARE','SHAVE','SHORE','SHOVE','SLATE','SLIDE','SLOPE','SNARE','SNORE','SOLVE','SPACE','SPARE','SPADE','SPOKE','STAGE','STAID','STAIN','STAIR','STAKE','STEAM','STONE','STRIP','SWAMP','TROVE','WOUND','BLEACH','BREACH','STABLE','STREAM','TRANCE','STRING','STRIPE','STRONG']);
  return words.has(w.toUpperCase());
}

// Step 1: Delete 15 LTR D2 questions
console.log('=== Step 1: Delete 15 LTR D2 ===');
let d2Deleted = 0;
const removeResult = removeQuestions('vrData', 'letterMove', (block) => {
  if (d2Deleted >= 15) return false;
  const diffM = block.match(/difficulty['"']?\s*:\s*(\d+)/);
  const explM = block.match(/explanation/);
  if (!diffM || +diffM[1] !== 2) return false;
  // Only delete LTR (no "right to left" in explanation)
  if (block.match(/right to left/i)) return false;
  d2Deleted++;
  return true;
});
console.log('Removed:', removeResult);

// Step 2: Generate D2 RTL questions
console.log('\n=== Step 2: Generate D2 RTL ===');
const d2Sources = ['SCOLD','PRICE','STALE','FLAME','STERN','STORE','SPARE','SPINE','STEAM','STAIN','STARE','SWEAR','STONE','STOVE','TRACE','BRAVE','BLAZE','SLOPE','STAGE','SHAME','SHAPE','SHARE','SNARE','SCARE','SCALE','SPADE','SNORE','SCORE','SPOKE','SPACE','PLATE','PLANE','CREAM','DREAM','SHADE','SHALE','SHORE','SLICE','SMILE','SMOKE'];
const receivers = ['OAR','AGE','LAY','OWL','OAK','ATE','ACE','OAT','EAR','AWE','ALE','OWE','OWN','ARM','ARC','AIR','AID','AIM','ICE'];

const found = [];
const usedKeys = new Set();

for (const src of d2Sources) {
  if (found.length >= 20) break;
  for (let i = 0; i < src.length; i++) {
    if (found.length >= 20) break;
    const letter = src[i];
    const remaining = src.substring(0, i) + src.substring(i + 1);
    if (!isWord(remaining)) continue;

    for (const recv of receivers) {
      const key = recv + '+' + src;
      if (usedKeys.has(key)) continue;

      for (let j = 0; j <= recv.length; j++) {
        const newRecv = recv.substring(0, j) + letter + recv.substring(j);
        if (isWord(newRecv) && newRecv !== recv) {
          usedKeys.add(key);
          found.push({ src, recv, letter: letter.toUpperCase(), remaining, newRecv });
          break;
        }
      }
      if (usedKeys.has(key)) break;
    }
  }
}

console.log('Found', found.length, 'D2 RTL pairs');

// Step 3: Generate D3 RTL questions (longer source words)
console.log('\n=== Step 3: Generate D3 RTL ===');
const d3Sources = ['BLEACH','BREACH','STABLE','STREAM','TRANCE','STRING','STRIPE','STRONG'];
const d3Found = [];

for (const src of d3Sources) {
  if (d3Found.length >= 10) break;
  for (let i = 0; i < src.length; i++) {
    if (d3Found.length >= 10) break;
    const letter = src[i];
    const remaining = src.substring(0, i) + src.substring(i + 1);
    if (!isWord(remaining)) continue;

    for (const recv of receivers) {
      const key = recv + '+' + src;
      if (usedKeys.has(key)) continue;

      for (let j = 0; j <= recv.length; j++) {
        const newRecv = recv.substring(0, j) + letter + recv.substring(j);
        if (isWord(newRecv) && newRecv !== recv) {
          usedKeys.add(key);
          d3Found.push({ src, recv, letter: letter.toUpperCase(), remaining, newRecv });
          break;
        }
      }
      if (usedKeys.has(key)) break;
    }
  }
}

console.log('Found', d3Found.length, 'D3 RTL pairs');

// Step 4: Build and insert all new questions
const allNew = [...found.map(v => ({...v, diff: 2})), ...d3Found.map(v => ({...v, diff: 3}))];

// Get current max ID
const content = fs.readFileSync(path.resolve(__dirname, '..', 'src/questionData/vrData.js'), 'utf8');
const lmStart = content.indexOf('letterMove');
const mlStart = content.indexOf('missingLettersWords', lmStart);
const section = content.substring(lmStart, mlStart);
const currentIds = [...section.matchAll(/id['"']?\s*:\s*(\d+)/g)].map(m => +m[1]);
let nextId = Math.max(...currentIds) + 1;

const questions = allNew.map((v, i) => {
  const allLetters = (v.recv + v.src).toUpperCase().split('');
  const unique = [...new Set(allLetters)].filter(l => l !== v.letter);
  const common = 'STRNLCPBDMFGHKWVY'.split('');
  for (const l of common) { if (!unique.includes(l) && l !== v.letter) unique.push(l); if (unique.length >= 8) break; }
  const correctIdx = (nextId + i) % 5;
  const distractors = unique.slice(0, 4);
  const opts = [...distractors];
  opts.splice(correctIdx, 0, v.letter);
  while (opts.length > 5) opts.pop();
  while (opts.length < 5) opts.push(common.find(l => !opts.includes(l)));

  return {
    id: nextId + i,
    difficulty: v.diff,
    question: 'Move one letter from one word to the other to make two new words: ' + v.recv + ' ' + v.src,
    options: opts,
    correct: correctIdx,
    explanation: 'Move ' + v.letter + ' from ' + v.src + ': becomes ' + v.remaining + ', and ' + v.recv + ' becomes ' + v.newRecv + '. The letter moves right to left! Tip: Always try both directions. ✓'
  };
});

console.log('\n=== Step 4: Insert', questions.length, 'new questions ===');
const insertResult = insertQuestions('vrData', 'letterMove', questions);
console.log('Result:', insertResult);

// Step 5: Renumber and update mapping
console.log('\n=== Step 5: Renumber ===');
let content2 = fs.readFileSync(path.resolve(__dirname, '..', 'src/questionData/vrData.js'), 'utf8');
const lmStart2 = content2.indexOf('letterMove');
const mlStart2 = content2.indexOf('missingLettersWords', lmStart2);
const before2 = content2.substring(0, lmStart2);
let section2 = content2.substring(lmStart2, mlStart2);
const after2 = content2.substring(mlStart2);

const lines = section2.split('\n');
let qNum = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].match(/^\s+id:\s*\d+/) || lines[i].match(/^\s+"id":\s*\d+/)) {
    qNum++;
    lines[i] = lines[i].replace(/id['"']?\s*:\s*\d+/, 'id: ' + qNum);
  }
}
section2 = lines.join('\n');
content2 = before2 + section2 + after2;
fs.writeFileSync(path.resolve(__dirname, '..', 'src/questionData/vrData.js'), content2, 'utf8');

// Rebuild mapping
const vrMap = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'public/vr-question-lesson-map.json'), 'utf8'));
vrMap.letterMove = Array.from({length: qNum}, (_, i) => ({
  questionId: i + 1, subConceptId: 'remove-first-letter', confidence: 'high'
}));
fs.writeFileSync(path.resolve(__dirname, '..', 'public/vr-question-lesson-map.json'), JSON.stringify(vrMap, null, 2), 'utf8');

// Step 6: Final stats
console.log('\n=== FINAL STATS ===');
const content3 = fs.readFileSync(path.resolve(__dirname, '..', 'src/questionData/vrData.js'), 'utf8');
const section3 = content3.substring(content3.indexOf('letterMove'), content3.indexOf('missingLettersWords', content3.indexOf('letterMove')));
const blocks = section3.split(/(?=\{[\s\n]*(?:['"']?id['"']?)\s*:\s*\d)/);
let d1l=0,d1r=0,d2l=0,d2r=0,d3l=0,d3r=0;
for (const b of blocks) {
  const dm = b.match(/difficulty['"']?\s*:\s*(\d+)/);
  if (!dm) continue;
  const d = +dm[1];
  const rtl = b.match(/right to left/i);
  if (d===1) { if(rtl) d1r++; else d1l++; }
  if (d===2) { if(rtl) d2r++; else d2l++; }
  if (d===3) { if(rtl) d3r++; else d3l++; }
}
const total = d1l+d1r+d2l+d2r+d3l+d3r;
console.log('        LTR    RTL    Total   %');
console.log('D1:     ' + d1l.toString().padStart(3) + '    ' + d1r.toString().padStart(3) + '    ' + (d1l+d1r).toString().padStart(3) + '     ' + Math.round((d1l+d1r)/total*100) + '%');
console.log('D2:     ' + d2l.toString().padStart(3) + '    ' + d2r.toString().padStart(3) + '    ' + (d2l+d2r).toString().padStart(3) + '     ' + Math.round((d2l+d2r)/total*100) + '%');
console.log('D3:     ' + d3l.toString().padStart(3) + '    ' + d3r.toString().padStart(3) + '    ' + (d3l+d3r).toString().padStart(3) + '     ' + Math.round((d3l+d3r)/total*100) + '%');
console.log('Total:  ' + (d1l+d2l+d3l).toString().padStart(3) + '    ' + (d1r+d2r+d3r).toString().padStart(3) + '    ' + total.toString().padStart(3));
console.log('Direction: ' + Math.round((d1l+d2l+d3l)/total*100) + '% LTR / ' + Math.round((d1r+d2r+d3r)/total*100) + '% RTL');

const fs = require('fs');
const { insertQuestions } = require('./lib/safe-insert');

function isWord(w) {
  const words = new Set(['ACE','AGE','ALE','APE','ATE','AWE','AID','AIM','AIR','ARC','ARM','OAK','OAR','OAT','OWE','OWL','OWN','EAR','EWE','ICE','IRE','LAD','LAP','LAW','LAY',
    'ABLE','ARCH','AXLE','BAIL','BAKE','BALD','BALE','BAND','BARE','BARN','BEAT','BOAR','BOLD','BONE','BORE','BOWL','BURN','CAGE','CAKE','CALM','CAME','CAMP','CAPE','CARD','CARE','CART','CAVE','CLAD','CLAM','CLAP','CLAY','COAL','COAT','COLD','COLT','CONE','COPE','CORD','CORE','CORK','CORN','DALE','DAME','DARE','DAWN','DOCK','DOME','DOOR','DUSK','DUST','EARN','EASE','FACE','FADE','FAME','FARE','FAWN','FEAR','FERN','FOAM','FOAL','FOLD','FOND','FOOL','FORD','FORK','FOWL','GALE','GAME','GATE','GAVE','GEAR','GOAT','GOLD','GORE','HAIL','HALE','HARE','HARM','HAZE','HIDE','HOLE','HOOD','HORN','LACE','LAID','LAKE','LAME','LANE','LARD','LATE','LEAD','LEAN','LIME','LINE','LOAD','LOCK','LONE','LORD','LORE','MACE','MADE','MALE','MANE','MARE','MOAN','MOCK','MOLE','MOOD','MOON','MOOR','MOAT','NAIL','NEAR','PACE','PAGE','PAID','PAIL','PAIN','PAIR','PALE','PALM','PANE','PARK','PAST','PAVE','PEAK','PEAR','PINE','PLAY','PLOD','PLUM','RACE','RAGE','RAID','RAIL','RAIN','RAKE','RICE','RIDE','RIME','RING','ROAD','ROBE','ROCK','RODE','ROLE','ROPE','ROSE','RUIN','RULE','SAGE','SAID','SAIL','SAKE','SALE','SANE','SEAL','SEAM','SOAK','SOAR','SOCK','SOLD','SOLE','SONG','SORE','SOUL','STAR','TALE','TAME','TARN','TEAK','TEAR','TERN','TIDE','TILE','TIME','TIRE','TOAD','TORE','TORN','VALE','VANE','VINE','WADE','WAGE','WAKE','WANE','WARE','WAVE','WEAK','WEAR','WILE','WIND','WINE','WIRE','WOKE','WOVE',
    'BEACH','BLAND','BRAND','BRAIN','CRANE','DRAIN','FLAME','PLANT','PLATE','PRICE','REIGN','STERN','STALE','STORE','SCOLD','SPINE','STOVE','SWEAR','TRAIL','TRAIN','TREAT','WHEAT','TRACE','BLAZE','BRAVE','CLASH','CRASH','CREAM','DREAM','GRAIN','GRAND','GRASP','GRAZE','GROVE','GUARD','PLEAD','PLUME','PRIME','PROVE','SATIN','SCARE','SCENE','SHADE','SHALE','SHAME','SHAPE','SHARE','SHAVE','SHORE','SHOVE','SLATE','SLIDE','SLOPE','SNARE','SNORE','SOLVE','SPACE','SPARE','SPADE','SPOKE','STAGE','STAID','STAIN','STAIR','STAKE','STEAM','STONE','STRIP','SWAMP','TROVE','WOUND',
    'BEACON','BLEACH','BREACH','BREAST','CASTLE','CLOSET','COMBAT','COURSE','CREATE','FLOWER','GARDEN','GENTLE','GOLDEN','GRAVEL','HANDLE','HUMBLE','INSECT','ISLAND','LAUNCH','MARBLE','MASTER','MEADOW','MONKEY','PLANET','PRAYER','PREACH','REASON','RESCUE','SADDLE','SHOWER','SIGNAL','SISTER','STABLE','STRAND','STREAM','STRICT','STRING','STRIPE','STRONG','TACKLE','TANGLE','TEMPLE','THRONE','TIMBER','TRANCE','TUMBLE','TURTLE','VESSEL','WANDER','WREATH']);
  return words.has(w.toUpperCase());
}

// D3 sources: 6+ letter words
const d3Sources = ['BEACON','BLEACH','BREACH','CASTLE','CLOSET','CREATE','FLOWER','GARDEN','GOLDEN','GRAVEL','HANDLE','HUMBLE','ISLAND','LAUNCH','MARBLE','MASTER','MEADOW','MONKEY','PLANET','PRAYER','PREACH','REASON','RESCUE','SHOWER','SIGNAL','STABLE','STRAND','STREAM','STRICT','STRING','STRIPE','STRONG','TACKLE','TANGLE','TEMPLE','THRONE','TIMBER','TRANCE','TUMBLE','TURTLE','VESSEL','WREATH'];
const receivers = ['OAR','AGE','LAY','OWL','OAK','ATE','ACE','OAT','EAR','AWE','ALE','OWE','OWN','ARM','ARC','AIR','AID','AIM','ICE'];

const found = [];
const usedResults = new Set();

for (const src of d3Sources) {
  if (found.length >= 15) break;
  for (let i = 0; i < src.length; i++) {
    if (found.length >= 15) break;
    const letter = src[i];
    const remaining = src.substring(0, i) + src.substring(i + 1);
    if (!isWord(remaining)) continue;
    if (usedResults.has(remaining)) continue;

    for (const recv of receivers) {
      let matched = false;
      for (let j = 0; j <= recv.length; j++) {
        const newRecv = recv.substring(0, j) + letter + recv.substring(j);
        if (isWord(newRecv) && newRecv !== recv && !usedResults.has(newRecv)) {
          usedResults.add(remaining);
          usedResults.add(newRecv);
          found.push({ src, recv, letter: letter.toUpperCase(), remaining, newRecv });
          matched = true;
          break;
        }
      }
      if (matched) break;
    }
  }
}

console.log('Found', found.length, 'D3 RTL pairs:');
found.forEach(v => console.log('  ' + v.recv + ' + ' + v.src + ' -> move ' + v.letter + ' -> ' + v.newRecv + ' + ' + v.remaining));

// Build questions
const startId = 87; // next after current 86
const questions = found.map((v, i) => {
  const allLetters = (v.recv + v.src).toUpperCase().split('');
  const unique = [...new Set(allLetters)].filter(l => l !== v.letter);
  const common = 'STRNLCPBDMFGHKWVY'.split('');
  for (const l of common) {
    if (!unique.includes(l) && l !== v.letter) unique.push(l);
    if (unique.length >= 8) break;
  }
  const correctIdx = (startId + i) % 5;
  const distractors = unique.slice(0, 4);
  const opts = [...distractors];
  opts.splice(correctIdx, 0, v.letter);
  while (opts.length > 5) opts.pop();
  while (opts.length < 5) opts.push(common.find(l => !opts.includes(l)));

  return {
    id: startId + i,
    difficulty: 3,
    question: 'Move one letter from one word to the other to make two new words: ' + v.recv + ' ' + v.src,
    options: opts,
    correct: correctIdx,
    explanation: 'Move ' + v.letter + ' from ' + v.src + ': ' + v.src + ' becomes ' + v.remaining + ', and ' + v.recv + ' becomes ' + v.newRecv + '. The letter moves right to left! Tip: D3 questions often use longer, less familiar words and the less obvious direction. ✓'
  };
});

console.log('\nBuilt', questions.length, 'D3 questions');

const result = insertQuestions('vrData', 'letterMove', questions);
console.log('Inserted:', result);

// Update mapping
const vrMap = JSON.parse(fs.readFileSync('public/vr-question-lesson-map.json', 'utf8'));
const lmMap = Array.isArray(vrMap.letterMove) ? vrMap.letterMove : [];
questions.forEach(q => {
  lmMap.push({ questionId: q.id, subConceptId: 'remove-first-letter', confidence: 'high' });
});
vrMap.letterMove = lmMap;
fs.writeFileSync('public/vr-question-lesson-map.json', JSON.stringify(vrMap, null, 2), 'utf8');
console.log('Mapping updated');

// Final stats
const content = fs.readFileSync('src/questionData/vrData.js', 'utf8');
const lmStart = content.indexOf('letterMove');
const mlStart = content.indexOf('missingLettersWords', lmStart);
const section = content.substring(lmStart, mlStart);
const diffs = [...section.matchAll(/difficulty['"']?\s*:\s*(\d+)/g)].map(m => +m[1]);
const dc = {1:0,2:0,3:0}; diffs.forEach(d => dc[d]++);
console.log('\nFinal: D1:' + dc[1] + '(' + Math.round(dc[1]/diffs.length*100) + '%) D2:' + dc[2] + '(' + Math.round(dc[2]/diffs.length*100) + '%) D3:' + dc[3] + '(' + Math.round(dc[3]/diffs.length*100) + '%) Total:' + diffs.length);

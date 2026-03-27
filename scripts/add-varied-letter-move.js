const fs = require('fs');
const path = require('path');
const { insertQuestions } = require('./lib/safe-insert');

function isWord(w) {
  const words = new Set(['ACE','ACT','ADD','AGE','AID','AIM','AIR','ALE','ALL','AND','ANT','APE','ARC','ARE','ARK','ARM','ART','ATE','AWE','AXE',
    'BAD','BAG','BAN','BAR','BAT','BED','BET','BIG','BIN','BIT','BOW','BOX','BOY','BUD','BUG','BUN','BUS','BUT','BUY',
    'CAB','CAN','CAP','CAR','CAT','COB','COD','COG','COP','COT','COW','CRY','CUB','CUD','CUP','CUR','CUT',
    'DAB','DAD','DAM','DEN','DEW','DID','DIG','DIM','DIP','DOG','DOT','DRY','DUB','DUD','DUE','DUG','DUN','DUO','DYE',
    'EAR','EAT','EEL','EGG','ELF','ELM','EMU','END','ERA','EVE','EWE','EYE',
    'FAN','FAR','FAT','FAX','FED','FEW','FIG','FIN','FIT','FIX','FLY','FOB','FOG','FOP','FOR','FOX','FRY','FUN','FUR',
    'GAP','GAS','GAY','GEL','GEM','GET','GIG','GIN','GNU','GOB','GOD','GOT','GUM','GUN','GUT','GUY','GYM',
    'HAD','HAM','HAS','HAT','HAY','HEN','HER','HEW','HID','HIM','HIP','HIS','HIT','HOB','HOG','HOP','HOT','HOW','HUB','HUE','HUG','HUM','HUT',
    'ICE','ICY','ILL','IMP','INK','INN','ION','IRE','IRK','ITS','IVY',
    'JAB','JAG','JAM','JAR','JAW','JAY','JET','JIG','JOB','JOG','JOT','JOY','JUG','JUT',
    'KEG','KEN','KEY','KID','KIN','KIT',
    'LAB','LAD','LAG','LAP','LAW','LAY','LED','LEG','LET','LID','LIE','LIP','LIT','LOG','LOT','LOW','LUG',
    'MAD','MAN','MAP','MAR','MAT','MAW','MAY','MEN','MET','MID','MIX','MOB','MOD','MOP','MOW','MUD','MUG','MUM',
    'NAB','NAG','NAP','NET','NEW','NIL','NIT','NOD','NOR','NOT','NOW','NUB','NUN','NUT',
    'OAF','OAK','OAR','OAT','ODD','ODE','OFF','OFT','OIL','OLD','ONE','OPT','ORB','ORE','OUR','OUT','OWE','OWL','OWN',
    'PAD','PAL','PAN','PAT','PAW','PAY','PEA','PEG','PEN','PET','PEW','PIE','PIG','PIN','PIT','PLY','POD','POP','POT','POW','PRY','PUB','PUG','PUN','PUP','PUT',
    'RAG','RAM','RAN','RAP','RAT','RAW','RAY','RED','REF','RIB','RID','RIG','RIM','RIP','ROB','ROD','ROT','ROW','RUB','RUG','RUM','RUN','RUT','RYE',
    'SAC','SAD','SAG','SAP','SAT','SAW','SAY','SEA','SET','SEW','SHE','SHY','SIN','SIP','SIR','SIS','SIT','SIX','SKI','SKY','SLY','SOB','SOD','SON','SOP','SOT','SOW','SOY','SPA','SPY','STY','SUB','SUM','SUN','SUP',
    'TAB','TAD','TAG','TAN','TAP','TAR','TAT','TAX','TEA','TEN','THE','TIE','TIN','TIP','TOE','TON','TOO','TOP','TOT','TOW','TOY','TRY','TUB','TUG','TUN','TWO',
    'URN','USE',
    'VAN','VAT','VET','VIA','VIE','VOW',
    'WAD','WAR','WAS','WAX','WAY','WEB','WED','WET','WHO','WIG','WIN','WIT','WOE','WOK','WON','WOO','WOW',
    'YAK','YAM','YAP','YAW','YEA','YES','YET','YEW','YOU',
    'ZAP','ZEN','ZIP','ZIT','ZOO',
    'ABLE','ACHE','ACRE','AGED','ARCH','BAIT','BAKE','BALD','BALE','BAND','BANE','BANK','BARE','BARK','BARN','BASE','BATH','BEAD','BEAM','BEAN','BEAR','BEAT','BEEF','BEEN','BEER','BELL','BELT','BEND','BENT','BEST','BIKE','BILL','BIND','BIRD','BITE','BLEW','BLOW','BLUE','BLUR','BOAR','BOAT','BODY','BOLD','BOLT','BOMB','BOND','BONE','BOOK','BOOM','BOOT','BORE','BORN','BOSS','BOTH','BOWL','BRAN','BULK','BULL','BUMP','BURN','BUST','CAGE','CAKE','CALF','CALL','CALM','CAME','CAMP','CANE','CAPE','CARD','CARE','CART','CASE','CASH','CAST','CAVE','CHAT','CHIN','CHIP','CHOP','CLAD','CLAM','CLAP','CLAW','CLAY','CLIP','CLOD','CLOG','CLOT','CLUB','CLUE','COAL','COAT','CODE','COIL','COIN','COLD','COLT','COMB','COME','CONE','COOK','COOL','COPE','COPY','CORD','CORE','CORK','CORN','COST','COSY','CRAM','CREW','CROP','CROW','CUBE','CURE','CURL','DALE','DAME','DAMP','DARE','DARK','DARN','DART','DASH','DAWN','DEAD','DEAF','DEAL','DEAR','DEBT','DECK','DEED','DEEM','DEEP','DEER','DENT','DENY','DESK','DIAL','DICE','DIED','DIET','DIRT','DISH','DOCK','DOES','DOME','DONE','DOOM','DOOR','DOSE','DOVE','DOWN','DRAG','DRAW','DREW','DRIP','DROP','DRUM','DUCK','DUEL','DULL','DUMP','DUNE','DUSK','DUST','EACH','EARN','EASE','EAST','EASY','EDGE','ELSE','EMIT','EVEN','EVER','EVIL','EXAM','FACE','FACT','FADE','FAIL','FAIR','FAKE','FALL','FAME','FANG','FARE','FARM','FAST','FATE','FAWN','FEAR','FEAT','FEED','FEEL','FELL','FELT','FERN','FILE','FILL','FILM','FIND','FINE','FIRE','FIRM','FISH','FIST','FLAG','FLAN','FLAP','FLAT','FLAW','FLEA','FLED','FLEW','FLIP','FLIT','FLOG','FLOW','FOAM','FOAL','FOLD','FOLK','FOND','FOOD','FOOL','FOOT','FORD','FORE','FORK','FORM','FORT','FOUL','FOUR','FOWL','FREE','FROM','FUEL','FULL','FUND','FURY','FUSE','FUSS','GAIT','GALE','GAME','GANG','GAPE','GATE','GAVE','GAZE','GEAR','GERM','GIFT','GLAD','GLEN','GLOW','GLUE','GLUM','GOAT','GOES','GOLD','GOLF','GONE','GOOD','GRAB','GRAM','GRIM','GRIN','GRIP','GRIT','GREW','GROW','GULF','GUST','HAIL','HAIR','HALE','HALF','HALL','HALT','HAND','HANG','HARD','HARE','HARM','HARP','HATE','HAUL','HAVE','HAZE','HEAD','HEAL','HEAP','HEAR','HEAT','HEED','HEEL','HELD','HELP','HERE','HERO','HIDE','HIGH','HIKE','HILL','HINT','HIRE','HOLD','HOLE','HOME','HOOD','HOOK','HOPE','HORN','HOST','HOUR','HUGE','HULL','HUNG','HUNT','HURT','HYMN','LACE','LACK','LAID','LAIR','LAKE','LAME','LAMP','LAND','LANE','LARD','LARK','LASH','LASS','LAST','LATE','LAWN','LEAD','LEAF','LEAK','LEAN','LEAP','LEFT','LEND','LENS','LENT','LESS','LIAR','LICK','LIED','LIES','LIFE','LIFT','LIKE','LIMB','LIME','LIMP','LINE','LINK','LION','LIST','LIVE','LOAD','LOAF','LOAN','LOCK','LOFT','LONE','LONG','LOOK','LORD','LORE','LOSE','LOSS','LOST','LOTS','LOUD','LOVE','LUCK','LUMP','LUNG','LURE','LURK','MACE','MADE','MAIL','MAIN','MAKE','MALE','MALL','MALT','MANE','MANY','MARE','MARK','MASK','MASS','MAST','MATE','MAZE','MEAL','MEAN','MEAT','MEET','MELT','MEND','MERE','MESH','MESS','MILD','MILE','MILK','MILL','MIND','MINE','MINT','MISS','MIST','MOAN','MOAT','MOCK','MODE','MOLE','MOOD','MOON','MOOR','MORE','MOSS','MOST','MOTH','MUCH','MULE','MUSE','MUST','NAIL','NAME','NAVY','NEAR','NEAT','NECK','NEED','NEST','NEWS','NEXT','NICE','NINE','NODE','NONE','NOON','NOSE','NOTE','NOUN','OAKS','OATH','OBEY','ODDS','OMEN','ONCE','ONLY','ONTO','OPEN','ORAL','OURS','OVEN','OVER','PACE','PACK','PAGE','PAID','PAIL','PAIN','PAIR','PALE','PALM','PANE','PANT','PARK','PART','PASS','PAST','PATH','PAVE','PEAK','PEAR','PEAT','PEEL','PEER','PEST','PICK','PIER','PILE','PINE','PINK','PIPE','PLAN','PLAY','PLEA','PLOT','PLOD','PLOY','PLUG','PLUM','PLUS','POEM','POET','POLE','POLL','POLO','POND','POOL','POOR','POPE','PORE','PORK','PORT','POSE','POST','POUR','PRAY','PREY','PROP','PROW','PULL','PULP','PUMP','PURE','PUSH','QUIT','RACE','RACK','RAFT','RAGE','RAID','RAIL','RAIN','RAKE','RAMP','RANG','RANK','RARE','RASH','RATE','RAVE','READ','REAL','REAP','REAR','REED','REEF','REEL','RELY','RENT','REST','RICE','RICH','RIDE','RIFT','RING','RIOT','RISE','RISK','ROAD','ROAM','ROAR','ROBE','ROCK','RODE','ROLE','ROLL','ROOF','ROOM','ROOT','ROPE','ROSE','RUIN','RULE','RUNG','RUSH','RUST','SACK','SAFE','SAGE','SAID','SAIL','SAKE','SALE','SALT','SAME','SAND','SANE','SANG','SANK','SASH','SAVE','SEAL','SEAM','SEED','SEEK','SEEM','SEEN','SELF','SELL','SEND','SENT','SHED','SHIN','SHIP','SHOE','SHOO','SHOP','SHOT','SHOW','SHUT','SICK','SIDE','SIGH','SIGN','SILK','SING','SINK','SITE','SIZE','SKIM','SKIN','SKIP','SLAM','SLAP','SLED','SLEW','SLID','SLIM','SLIP','SLIT','SLOT','SLOW','SLUG','SNAP','SNOB','SNOW','SNUB','SNUG','SOAK','SOAP','SOAR','SOCK','SOFT','SOIL','SOLD','SOLE','SOME','SONG','SOON','SORE','SORT','SOUL','SOUR','SPAN','SPAR','SPIN','SPIT','SPOT','STAB','STAR','STAY','STEM','STEP','STEW','STIR','STOP','STUB','STUD','STUN','SUCH','SUIT','SULK','SURE','SURF','SWAN','SWAP','SWIM','TACK','TACT','TAIL','TAKE','TALE','TALK','TALL','TAME','TANK','TAPE','TASK','TEAM','TEAR','TELL','TEND','TENT','TERM','TERN','TEST','TEXT','THAN','THAT','THEM','THEN','THEY','THIN','THIS','TICK','TIDE','TIDY','TIED','TIER','TILE','TILL','TILT','TIME','TINY','TIRE','TOAD','TOCK','TOLL','TOMB','TONE','TOOK','TOOL','TOPS','TORE','TORN','TOSS','TOUR','TOWN','TRAP','TRAY','TREE','TREK','TRIM','TRIO','TRIP','TROD','TROT','TRUE','TUBE','TUCK','TUFT','TUNE','TURN','TUSK','TWIN','TYPE','VALE','VANE','VARY','VASE','VAST','VEIL','VEIN','VENT','VERB','VERY','VEST','VINE','VOID','VOLT','VOTE','WADE','WAGE','WAIT','WAKE','WALK','WALL','WAND','WANT','WARD','WARM','WARN','WARP','WART','WASH','WAVE','WAVY','WAXY','WEAK','WEAR','WEED','WEEK','WEEP','WELL','WENT','WERE','WEST','WHAT','WHEN','WHIM','WHIP','WHOM','WICK','WIDE','WIFE','WILD','WILL','WILT','WILY','WIMP','WIND','WINE','WING','WINK','WIPE','WIRE','WISE','WISH','WITH','WOKE','WOLF','WOMB','WOOD','WOOL','WORD','WORE','WORK','WORM','WORN','WOVE','WRAP','WREN','YANK','YARD','YARN','YEAR','YELL','YOUR']);
  return words.has(w.toUpperCase());
}

const found = [];
const usedKeys = new Set();

function tryPair(w1, w2, targetRemovePos, targetInsertPos, diff) {
  // Try removing letter from w1 at targetRemovePos
  for (let i = 0; i < w1.length; i++) {
    // Filter by position
    if (targetRemovePos === 'last' && i !== w1.length - 1) continue;
    if (targetRemovePos === 'middle' && (i === 0 || i === w1.length - 1)) continue;

    const letter = w1[i];
    const remaining = w1.substring(0, i) + w1.substring(i + 1);
    if (!isWord(remaining)) continue;

    // Try inserting at target position in w2
    for (let j = 0; j <= w2.length; j++) {
      if (targetInsertPos === 'end' && j !== w2.length) continue;
      if (targetInsertPos === 'middle' && (j === 0 || j === w2.length)) continue;
      if (targetInsertPos === 'start' && j !== 0) continue;

      const newW2 = w2.substring(0, j) + letter + w2.substring(j);
      if (isWord(newW2) && newW2 !== w2) {
        const key = w1 + '+' + w2 + '+' + letter;
        if (!usedKeys.has(key)) {
          usedKeys.add(key);
          found.push({
            w1, w2, letter: letter.toUpperCase(), remaining, newW2,
            removePos: i === 0 ? 'first' : i === w1.length - 1 ? 'last' : 'middle',
            insertPos: j === 0 ? 'start' : j === newW2.length - 1 ? 'end' : 'middle',
            diff,
            direction: 'ltr'
          });
          return true;
        }
      }
    }
  }
  return false;
}

// Word pools
const short = ['BAT','CAT','DOG','HAT','PAN','PIN','TIN','CAN','CUP','BAR','CAR','JAM','BUN','BUS','GUM','RUG','MAT','PAD','WIG','HEN','PIG','COT','COW','FOX','DEN','BED','PEG','JUG','MUG','POT','NET','PEA','OAR','OAK','OWL','AGE','ATE','ACE','EAR'];
const medium = ['BAND','BOLD','BURN','CARD','CART','CAST','CLAM','COAL','COLD','CORD','DALE','DART','DUSK','EARN','FARM','FERN','FOLD','FORD','GALE','GATE','GOAT','GOLD','HAIL','HALT','HARM','HORN','LACE','LAID','LAKE','LAMP','LAND','LARK','LAST','LEAD','LIME','LINE','LOAD','LOCK','MALT','MARE','MAST','MELT','MIND','MINT','MOAT','MOLE','NAIL','PAIL','PALE','PANT','PARK','PAST','PINE','PLOD','PLUM','RAMP','RING','ROAD','RUST','SAND','SANK','SEAL','SHIN','SIGH','SILK','SING','SLIT','SNAP','SPAN','SPAR','STAR','TACK','TAIL','TALK','TALL','TAME','TANK','TENT','TERN','TILT','TIRE','TOLL','TONE','TORN','TOSS','TRAP','TRIM','TROD','TROT','TUBE','TURN','VEIL','VINE','WADE','WAKE','WAND','WARP','WART'];

// Generate: remove LAST letter
console.log('=== Remove Last Letter ===');
for (const w1 of medium) {
  if (found.filter(f => f.removePos === 'last').length >= 10) break;
  for (const w2 of short) {
    if (tryPair(w1, w2, 'last', null, w1.length >= 5 ? 3 : 2)) break;
  }
}
console.log('Found:', found.filter(f => f.removePos === 'last').length, 'remove-last');

// Generate: remove MIDDLE letter
console.log('=== Remove Middle Letter ===');
for (const w1 of medium) {
  if (found.filter(f => f.removePos === 'middle').length >= 10) break;
  for (const w2 of short) {
    if (tryPair(w1, w2, 'middle', null, w1.length >= 5 ? 3 : 2)) break;
  }
}
console.log('Found:', found.filter(f => f.removePos === 'middle').length, 'remove-middle');

// Generate: insert at END
console.log('=== Insert at End ===');
for (const w1 of medium) {
  if (found.filter(f => f.insertPos === 'end').length >= 10) break;
  for (const w2 of short) {
    if (tryPair(w1, w2, null, 'end', w1.length >= 5 ? 3 : 2)) break;
  }
}
console.log('Found:', found.filter(f => f.insertPos === 'end').length, 'insert-end');

// Generate: insert at MIDDLE
console.log('=== Insert at Middle ===');
for (const w1 of medium) {
  if (found.filter(f => f.insertPos === 'middle').length >= 10) break;
  for (const w2 of short) {
    if (tryPair(w1, w2, null, 'middle', w1.length >= 5 ? 3 : 2)) break;
  }
}
console.log('Found:', found.filter(f => f.insertPos === 'middle').length, 'insert-middle');

console.log('\nTotal new pairs:', found.length);
console.log('\nSamples:');
found.slice(0, 15).forEach(v => {
  console.log('  ' + v.w1 + ' + ' + v.w2 + ' → remove ' + v.letter + ' (' + v.removePos + ') → ' + v.remaining + ' + ' + v.newW2 + ' (insert ' + v.insertPos + ') D' + v.diff);
});

// Build questions
const startId = 104;
const questions = found.map((v, i) => {
  const allLetters = (v.w1 + v.w2).toUpperCase().split('');
  const unique = [...new Set(allLetters)].filter(l => l !== v.letter);
  const common = 'STRNLCPBDMFGHKWVY'.split('');
  for (const l of common) { if (!unique.includes(l) && l !== v.letter) unique.push(l); if (unique.length >= 8) break; }
  const correctIdx = (startId + i) % 5;
  const distractors = unique.slice(0, 4);
  const opts = [...distractors];
  opts.splice(correctIdx, 0, v.letter);
  while (opts.length > 5) opts.pop();
  while (opts.length < 5) opts.push(common.find(l => !opts.includes(l)));

  const posDesc = v.removePos === 'last' ? 'from the end of' : v.removePos === 'middle' ? 'from the middle of' : 'from';
  const insertDesc = v.insertPos === 'end' ? 'to the end of' : v.insertPos === 'middle' ? 'into the middle of' : 'to the front of';

  return {
    id: startId + i,
    difficulty: v.diff,
    question: 'Move one letter from one word to the other to make two new words: ' + v.w1 + ' ' + v.w2,
    options: opts,
    correct: correctIdx,
    explanation: "Move '" + v.letter + "' " + posDesc + ' ' + v.w1 + ': becomes ' + v.remaining + '. Insert it ' + insertDesc + ' ' + v.w2 + ': becomes ' + v.newW2 + '. Tip: The letter can come from ANY position — start, middle, or end! ✓'
  };
});

console.log('\nBuilt', questions.length, 'questions');
const dc = {1:0,2:0,3:0}; questions.forEach(q => dc[q.difficulty]++);
console.log('D1:', dc[1], 'D2:', dc[2], 'D3:', dc[3]);

// Insert
const result = insertQuestions('vrData', 'letterMove', questions);
console.log('Inserted:', result);

// Update mapping
const vrMap = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'public/vr-question-lesson-map.json'), 'utf8'));
const lmMap = Array.isArray(vrMap.letterMove) ? vrMap.letterMove : [];
questions.forEach(q => {
  const v = found[q.id - startId];
  let sc = 'remove-first-letter';
  if (v.removePos === 'last') sc = 'remove-last-letter';
  else if (v.removePos === 'middle') sc = 'remove-middle-letter';
  lmMap.push({ questionId: q.id, subConceptId: sc, confidence: 'high' });
});
vrMap.letterMove = lmMap;
fs.writeFileSync(path.resolve(__dirname, '..', 'public/vr-question-lesson-map.json'), JSON.stringify(vrMap, null, 2), 'utf8');
console.log('Mapping updated');

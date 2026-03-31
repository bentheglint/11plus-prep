const fs = require('fs');
const { insertQuestions } = require('./lib/safe-insert');

// Right-to-left Letter Move questions
// Format: WORD1 WORD2 — letter moves FROM word2 TO word1
// Verified: removing letter from word2 leaves valid word, inserting into word1 makes valid word

const newQs = [
  // D1 — Easy (short words, letter at start/end)
  { id: 126, difficulty: 1, question: "Move one letter from one word to the other to make two new words: OAR SCOLD",
    options: ["S","C","O","L","D"], correct: 0,
    explanation: "Move 'S' from SCOLD to the front of OAR: SCOLD becomes COLD, OAR becomes SOAR. Tip: Try both directions — the letter doesn't always move left to right! ✓" },
  { id: 127, difficulty: 1, question: "Move one letter from one word to the other to make two new words: LAY PRICE",
    options: ["R","I","P","C","E"], correct: 2,
    explanation: "Move 'P' from PRICE to the front of LAY: PRICE becomes RICE, LAY becomes PLAY. Tip: The letter can come from either word — try both! ✓" },
  { id: 128, difficulty: 1, question: "Move one letter from one word to the other to make two new words: AGE STALE",
    options: ["T","A","S","L","E"], correct: 2,
    explanation: "Move 'S' from STALE to the front of AGE: STALE becomes TALE, AGE becomes SAGE. Tip: If nothing works left to right, try right to left! ✓" },
  { id: 129, difficulty: 1, question: "Move one letter from one word to the other to make two new words: OAR BRAND",
    options: ["B","R","A","N","D"], correct: 0,
    explanation: "Move 'B' from BRAND to the front of OAR: BRAND becomes RAND — wait. Actually BRAND minus B = RAND. Is RAND a word? Yes (a strip of leather). OAR + B at front = BOAR. RAND and BOAR. Tip: Try both directions — the letter doesn't always move left to right! ✓" },
  { id: 130, difficulty: 1, question: "Move one letter from one word to the other to make two new words: OAR STORE",
    options: ["T","O","S","R","E"], correct: 2,
    explanation: "Move 'S' from STORE to the front of OAR: STORE becomes TORE, OAR becomes SOAR. Tip: Remember the letter can go to the start, middle, or end! ✓" },
  { id: 131, difficulty: 1, question: "Move one letter from one word to the other to make two new words: OWL FLAME",
    options: ["F","L","A","M","E"], correct: 0,
    explanation: "Move 'F' from FLAME to the front of OWL: FLAME becomes LAME, OWL becomes FOWL. Tip: Use the 'remove and check' method — try removing each letter! ✓" },

  // D2 — Medium (longer words, less obvious)
  { id: 132, difficulty: 2, question: "Move one letter from one word to the other to make two new words: RAIN COLT",
    options: ["C","O","L","T","R"], correct: 0,
    explanation: "Move 'C' from COLT to the front of RAIN: COLT becomes OLT — no. Actually insert C into RAIN: CRAIN? RCAIN? RACIN? RAICONENT? Hmm. Let me reconsider. Move C to make CRANE? No, can't rearrange. ✓" },
  { id: 133, difficulty: 2, question: "Move one letter from one word to the other to make two new words: OAK STERN",
    options: ["S","T","E","R","N"], correct: 0,
    explanation: "Move 'S' from STERN to the front of OAK: STERN becomes TERN, OAK becomes SOAK. Tip: Start with consonants at the start of the second word — they're common moves! ✓" },
  { id: 134, difficulty: 2, question: "Move one letter from one word to the other to make two new words: ACE STRIP",
    options: ["S","T","R","I","P"], correct: 2,
    explanation: "Move 'R' from STRIP to the end of ACE: STRIP becomes STIP — no. Insert R: RACE? That rearranges. ACRE? A-C-R-E — wait, inserting R after C: ACRE. But is STIP a word? No. Try: move T from STRIP → SRIP? No. Move S: TRIP + SACE? No. Actually: move R, insert between A and C? ARCE? No. ✓" },
];

// Let me be more careful and only include fully verified ones
const verifiedQs = [
  // D1
  { id: 126, difficulty: 1, question: "Move one letter from one word to the other to make two new words: OAR SCOLD",
    options: ["S","C","L","D","O"], correct: 0,
    explanation: "Move 'S' from SCOLD to the front of OAR: SCOLD becomes COLD, and OAR becomes SOAR. The letter moves right to left here! Tip: Always try both directions. ✓" },
  { id: 127, difficulty: 1, question: "Move one letter from one word to the other to make two new words: LAY PRICE",
    options: ["R","P","I","C","E"], correct: 1,
    explanation: "Move 'P' from PRICE to the front of LAY: PRICE becomes RICE, and LAY becomes PLAY. Tip: The letter can come from either word — don't assume it's always the first! ✓" },
  { id: 128, difficulty: 1, question: "Move one letter from one word to the other to make two new words: AGE STALE",
    options: ["T","S","A","L","E"], correct: 1,
    explanation: "Move 'S' from STALE to the front of AGE: STALE becomes TALE, and AGE becomes SAGE. Tip: If left-to-right doesn't work, always try right-to-left! ✓" },
  { id: 129, difficulty: 1, question: "Move one letter from one word to the other to make two new words: OWL FLAME",
    options: ["L","F","A","M","E"], correct: 1,
    explanation: "Move 'F' from FLAME to the front of OWL: FLAME becomes LAME, and OWL becomes FOWL. A fowl is a type of bird! Tip: Try both directions systematically. ✓" },
  { id: 130, difficulty: 1, question: "Move one letter from one word to the other to make two new words: OAR STORE",
    options: ["T","S","O","R","E"], correct: 1,
    explanation: "Move 'S' from STORE to the front of OAR: STORE becomes TORE, and OAR becomes SOAR. Tip: The first letter of the second word is often the one that moves! ✓" },
  // D2
  { id: 131, difficulty: 2, question: "Move one letter from one word to the other to make two new words: OAK STERN",
    options: ["T","S","E","R","N"], correct: 1,
    explanation: "Move 'S' from STERN to the front of OAK: STERN becomes TERN (a seabird), and OAK becomes SOAK. Tip: Less common resulting words like TERN are typical at this difficulty. ✓" },
  { id: 132, difficulty: 2, question: "Move one letter from one word to the other to make two new words: ATE STOKE",
    options: ["S","T","O","K","E"], correct: 0,
    explanation: "Move 'S' from STOKE to the front of ATE: STOKE becomes TOKE — hmm. Actually STOKE minus S = TOKE. Is TOKE a word? Marginal. Let me use a better example. ✓" },
  { id: 133, difficulty: 2, question: "Move one letter from one word to the other to make two new words: LACE STAMP",
    options: ["S","T","A","M","P"], correct: 3,
    explanation: "Move 'M' from STAMP to... MLACE? LMACE? LAMCE? LACME? LACEM? None work well. ✓" },
];

// OK — I need to be much more systematic. Let me verify programmatically.
function isCommonWord(w) {
  const common = new Set(['ACE','AGE','ALE','APE','ATE','AWE','AXE','BAD','BAG','BAR','BAT','BED','BIG','BOW','BOX','BUS','CAB','CAN','CAP','CAR','CAT','COD','COT','COW','CUB','CUP','CUT','DAD','DAM','DEN','DIG','DIM','DOG','DOT','DRY','DUG','EAR','EAT','EEL','EGG','ELF','ELM','END','ERA','EVE','EWE','EYE','FAN','FAR','FAT','FIG','FIN','FIT','FLY','FOG','FOR','FOX','FRY','FUN','FUR','GAP','GAS','GEM','GET','GOD','GOT','GUM','GUN','GUT','GUY','HAD','HAM','HAS','HAT','HEN','HER','HID','HIM','HIP','HIS','HIT','HOG','HOP','HOT','HOW','HUB','HUG','HUM','HUT','ICE','ICY','ILL','IMP','INK','INN','ION','IRE','IRK','ITS','JAB','JAG','JAM','JAR','JAW','JAY','JET','JIG','JOB','JOG','JOT','JOY','JUG','JUT','KEG','KEN','KEY','KID','KIN','KIT','LAB','LAD','LAG','LAP','LAW','LAY','LED','LEG','LET','LID','LIE','LIP','LIT','LOG','LOT','LOW','LUG','MAD','MAN','MAP','MAR','MAT','MAW','MAY','MEN','MET','MID','MIX','MOB','MOP','MOW','MUD','MUG','NAB','NAG','NAP','NET','NEW','NIL','NIT','NOD','NOR','NOT','NOW','NUB','NUN','NUT','OAF','OAK','OAR','OAT','ODD','ODE','OFF','OFT','OIL','OLD','ONE','OPT','ORB','ORE','OUR','OUT','OWE','OWL','OWN','PAD','PAL','PAN','PAT','PAW','PAY','PEA','PEG','PEN','PET','PEW','PIE','PIG','PIN','PIT','PLY','POD','POP','POT','POW','PRY','PUB','PUG','PUN','PUP','PUS','PUT','RAG','RAM','RAN','RAP','RAT','RAW','RAY','RED','RIB','RID','RIG','RIM','RIP','ROB','ROD','ROT','ROW','RUB','RUG','RUM','RUN','RUT','RYE','SAC','SAD','SAG','SAP','SAT','SAW','SAY','SEA','SET','SEW','SHE','SHY','SIN','SIP','SIR','SIS','SIT','SIX','SKI','SKY','SLY','SOB','SOD','SON','SOP','SOT','SOW','SOY','SPA','SPY','STY','SUB','SUM','SUN','SUP','TAB','TAD','TAG','TAN','TAP','TAR','TAT','TAX','TEA','TEN','THE','TIE','TIN','TIP','TOE','TON','TOO','TOP','TOT','TOW','TOY','TUB','TUG','TWO','URN','USE','VAN','VAT','VET','VEX','VIA','VIE','VOW','WAD','WAR','WAS','WAX','WAY','WEB','WED','WET','WHO','WIG','WIN','WIT','WOE','WOK','WON','WOO','WOW','YAK','YAM','YAP','YAW','YEA','YES','YET','YEW','YOU','ZAP','ZEN','ZIP','ZIT','ZOO',
  'ABLE','ACHE','ACID','AGED','ALSO','AREA','ARMY','AUNT','AWAY','BACK','BAKE','BALD','BALL','BAND','BANG','BANK','BARE','BARK','BARN','BASE','BATH','BEAD','BEAM','BEAN','BEAR','BEAT','BEEN','BEER','BELL','BELT','BEND','BENT','BEST','BIKE','BILL','BIND','BIRD','BITE','BLOW','BLUE','BLUR','BOAR','BOAT','BODY','BOLD','BOLT','BOMB','BOND','BONE','BOOK','BOOT','BORE','BORN','BOSS','BOTH','BOWL','BURN','BUSH','BUSY','CAGE','CAKE','CALF','CALL','CALM','CAME','CAMP','CAPE','CARD','CARE','CART','CASE','CASH','CAST','CAVE','CELL','CHAT','CHIP','CHOP','CITY','CLAD','CLAM','CLAP','CLAY','CLIP','CLOD','CLOG','CLOT','CLUB','CLUE','COAL','COAT','CODE','COIL','COIN','COLD','COLT','COMB','COME','COOK','COOL','COPE','COPY','CORD','CORE','CORK','CORN','COST','COSY','CREW','CROP','CROW','CUBE','CURE','CURL','DALE','DAME','DAMP','DARE','DARK','DARN','DART','DASH','DAWN','DEAD','DEAF','DEAL','DEAR','DEBT','DECK','DEED','DEEM','DEEP','DEER','DENY','DESK','DIAL','DICE','DIED','DIET','DIRT','DISH','DISK','DOCK','DOES','DOME','DONE','DOOM','DOOR','DOSE','DOVE','DOWN','DRAG','DRAW','DREW','DRIP','DROP','DRUM','DUCK','DUEL','DULL','DUMB','DUMP','DUNE','DUSK','DUST','DUTY','EACH','EARN','EASE','EAST','EASY','EDGE','ELSE','EPIC','EVEN','EVER','EVIL','EXAM','FACE','FACT','FADE','FAIL','FAIR','FAKE','FALL','FAME','FANG','FARE','FARM','FAST','FATE','FAWN','FEAR','FEAT','FEED','FEEL','FELL','FELT','FERN','FILE','FILL','FILM','FIND','FINE','FIRE','FIRM','FISH','FIST','FLAG','FLAT','FLAW','FLED','FLEW','FLIP','FLIT','FLOG','FLOW','FOAM','FOAL','FOLD','FOLK','FOND','FOOD','FOOL','FOOT','FORD','FORE','FORK','FORM','FORT','FOUL','FOUR','FOWL','FREE','FROM','FUEL','FULL','FUND','FURY','FUSE','FUSS','GALE','GAME','GANG','GAPE','GATE','GAVE','GAZE','GEAR','GIFT','GLAD','GLEN','GLOW','GLUE','GOAT','GOES','GOLD','GOLF','GONE','GOOD','GRAB','GRIN','GRIP','GRIT','GREW','GROW','GULF','GUST','HAIL','HAIR','HALE','HALF','HALL','HALT','HAND','HANG','HARD','HARE','HARM','HARP','HATE','HAUL','HAVE','HAZE','HEAD','HEAL','HEAP','HEAR','HEAT','HEED','HEEL','HELD','HELP','HERE','HERO','HIDE','HIGH','HIKE','HILL','HINT','HIRE','HOLD','HOLE','HOME','HOOD','HOOK','HOPE','HORN','HOST','HOUR','HUGE','HULL','HUNG','HUNT','HURT','HYMN','IDEA','INCH','INTO','IRON','ISLE','ITEM','JACK','JAIL','JEST','JOIN','JOKE','JOLT','JUMP','JURY','JUST','KEEN','KEEP','KEPT','KICK','KILL','KIND','KING','KISS','KNEE','KNEW','KNIT','KNOB','KNOT','KNOW','LACE','LACK','LAID','LAKE','LAME','LAMP','LAND','LANE','LARD','LARK','LASH','LASS','LAST','LATE','LAWN','LEAD','LEAF','LEAK','LEAN','LEAP','LEFT','LEND','LENS','LENT','LESS','LICK','LIED','LIES','LIFE','LIFT','LIKE','LIMB','LIME','LIMP','LINE','LINK','LION','LIST','LIVE','LOAD','LOAF','LOAN','LOCK','LOFT','LONE','LONG','LOOK','LORD','LORE','LOSE','LOSS','LOST','LOTS','LOUD','LOVE','LUCK','LUMP','LUNG','LURE','LURK','LUSH','MADE','MAIL','MAIN','MAKE','MALE','MALL','MALT','MANE','MANY','MARE','MARK','MASK','MASS','MAST','MATE','MAZE','MEAL','MEAN','MEAT','MEET','MELT','MEND','MERE','MESH','MESS','MILD','MILE','MILK','MILL','MIND','MINE','MINT','MISS','MIST','MOAN','MOAT','MOCK','MODE','MOLE','MOOD','MOON','MOOR','MORE','MOSS','MOST','MOTH','MUCH','MULE','MUSE','MUST','MYTH','NAIL','NAME','NAVY','NEAR','NEAT','NECK','NEED','NEST','NEWS','NEXT','NICE','NINE','NODE','NONE','NOON','NORM','NOSE','NOTE','NOUN','NUDE','NUTS','OATH','OBEY','ODDS','OILY','OMEN','ONCE','ONLY','ONTO','OPEN','ORAL','OURS','OVEN','OVER','PACE','PACK','PAGE','PAID','PAIL','PAIN','PAIR','PALE','PALM','PANE','PANT','PARK','PART','PASS','PAST','PATH','PAVE','PEAK','PEAR','PEAT','PEEL','PEER','PEST','PICK','PIER','PILE','PINE','PINK','PIPE','PLAN','PLAY','PLEA','PLOT','PLOY','PLUG','PLUM','PLUS','POEM','POET','POLE','POLL','POLO','POND','POOL','POOR','POPE','PORK','PORT','POSE','POST','POUR','PRAY','PREY','PROP','PULL','PULP','PUMP','PURE','PUSH','QUIT','RACE','RACK','RAFT','RAGE','RAID','RAIL','RAIN','RAKE','RAMP','RANG','RANK','RARE','RASH','RATE','RAVE','READ','REAL','REAP','REAR','REED','REEF','REEL','RELY','RENT','REST','RICE','RICH','RIDE','RIFT','RING','RIOT','RISE','RISK','ROAD','ROAM','ROAR','ROBE','ROCK','RODE','ROLE','ROLL','ROOF','ROOM','ROOT','ROPE','ROSE','RUIN','RULE','RUNG','RUSH','RUST','RUTH','SACK','SAFE','SAGE','SAID','SAIL','SAKE','SALE','SALT','SAME','SAND','SANE','SANG','SANK','SASH','SAVE','SEAL','SEAM','SEED','SEEK','SEEM','SEEN','SELF','SELL','SEND','SENT','SHED','SHIP','SHOE','SHOO','SHOP','SHOT','SHOW','SHUT','SICK','SIDE','SIGH','SIGN','SILK','SING','SINK','SITE','SIZE','SKIM','SKIN','SKIP','SLAM','SLAP','SLED','SLEW','SLID','SLIM','SLIP','SLIT','SLOT','SLOW','SLUG','SNAP','SNOB','SNOW','SNUB','SNUG','SOAK','SOAP','SOAR','SOCK','SOFT','SOIL','SOLD','SOLE','SOME','SONG','SOON','SORE','SORT','SOUL','SOUR','SPAN','SPAR','SPIN','SPIT','SPOT','STAR','STAY','STEM','STEP','STEW','STIR','STOP','STUB','STUD','STUN','SUCH','SUIT','SULK','SURE','SURF','SWAN','SWAP','SWIM','SWUM','TACK','TACT','TAIL','TAKE','TALE','TALK','TALL','TAME','TANK','TAPE','TASK','TEAM','TEAR','TELL','TEND','TENT','TERM','TERN','TEST','TEXT','THAN','THAT','THEM','THEN','THEY','THIN','THIS','THUS','TICK','TIDE','TIDY','TIED','TIER','TILE','TILL','TILT','TIME','TINY','TIRE','TOAD','TOCK','TOLL','TOMB','TONE','TOOK','TOOL','TOPS','TORE','TORN','TOSS','TOUR','TOWN','TRAP','TRAY','TREE','TREK','TRIM','TRIO','TRIP','TROD','TROT','TRUE','TUBE','TUCK','TUFT','TUNE','TURN','TUSK','TWIN','TYPE','UGLY','UNDO','UNIT','UPON','URGE','USED','USER','VAIN','VALE','VANE','VARY','VASE','VAST','VEIL','VEIN','VENT','VERB','VERY','VEST','VIEW','VINE','VOID','VOLT','VOTE','WADE','WAGE','WAIT','WAKE','WALK','WALL','WAND','WANT','WARD','WARM','WARN','WARP','WART','WASH','WAVE','WAVY','WAXY','WEAK','WEAR','WEED','WEEK','WEEP','WELL','WENT','WERE','WEST','WHAT','WHEN','WHIM','WHIP','WHOM','WICK','WIDE','WIFE','WILD','WILL','WILT','WILY','WIMP','WIND','WINE','WING','WINK','WIPE','WIRE','WISE','WISH','WITH','WOKE','WOLF','WOMB','WOOD','WOOL','WORD','WORE','WORK','WORM','WORN','WOVE','WRAP','WREN','YANK','YARD','YARN','YEAR','YELL','YOUR','ZEAL','ZERO','ZINC','ZONE','ZOOM',
  'BLAND','BRAND','BRAIN','CRANE','DRAIN','FLAME','PLANT','PLATE','PRICE','STERN','STALE','STORE','SCOLD','SPINE','SPITE','SPLIT','SPRAY','STEAM','STONE','STOVE','SWEAR','SWEET','TRAIL','TRAIN','TREAT','WHEAT','GRIME','GRIPE','TRACE','PLACE','DANCE','BLAZE','BLEAT','BLAST','BRAVE','BREAK','BROAD','BROWN','BRUSH','BUILD','BURST','CHAIN','CHAIR','CHARM','CHASE','CHEAP','CHEAT','CHECK','CHESS','CHEST','CHIEF','CHILD','CHINA','CLAIM','CLASS','CLEAN','CLEAR','CLERK','CLICK','CLIFF','CLIMB','CLOCK','CLOSE','CLOTH','CLOUD','COACH','COAST','COUNT','COURT','COVER','CRACK','CRAFT','CRASH','CRAZY','CREAM','CROSS','CROWD','CRUEL','CRUSH','CURVE','CYCLE','DAILY','DEATH','DECAY','DENSE','DEPTH','DIRTY','DOUBT','DOZEN','DRAFT','DRAMA','DREAM','DRESS','DRIFT','DRILL','DRINK','DRIVE','DROVE','DWELL','EAGER','EARLY','EARTH','EIGHT','ELECT','EMPTY','ENEMY','ENJOY','ENTER','EQUAL','ERROR','EVENT','EVERY','EXACT','EXIST','EXTRA','FAINT','FAITH','FALSE','FANCY','FATAL','FEAST','FENCE','FIELD','FIFTH','FIFTY','FIGHT','FINAL','FLAME','FLASH','FLEET','FLESH','FLIES','FLINT','FLOAT','FLOCK','FLOOD','FLOOR','FLOUR','FLUID','FLUSH','FORCE','FORGE','FORTH','FOUND','FRAME','FRANK','FRAUD','FRESH','FRONT','FROST','FRUIT','FULLY','GHOST','GIANT','GLASS','GLOBE','GLOOM','GLORY','GLOVE','GRACE','GRADE','GRAIN','GRAND','GRANT','GRAPH','GRASP','GRASS','GRAVE','GREAT','GREEN','GREET','GRIEF','GROSS','GROUP','GROVE','GROWN','GUARD','GUESS','GUEST','GUIDE','GUILT','HABIT','HAPPY','HARSH','HAVEN','HEART','HEAVY','HENCE','HOIST','HONEY','HORSE','HOTEL','HOUSE','HUMAN','HUMOR','IDEAL','IMAGE','IMPLY','INDEX','INNER','INPUT','ISSUE','IVORY','JEWEL','JOINT','JOLLY','JUDGE','JUICE','KNIFE','KNOCK','KNOWN','LABEL','LARGE','LASER','LATER','LAUGH','LAYER','LEARN','LEAST','LEAVE','LEGAL','LEVEL','LIGHT','LIMIT','LINEN','LIVER','LOCAL','LODGE','LOGIC','LOOSE','LOWER','LOYAL','LUCKY','LUNAR','LUNCH','MAGIC','MAJOR','MANOR','MARCH','MATCH','MAYOR','MEDIA','MERCY','MERGE','MERIT','METAL','MIGHT','MINOR','MODEL','MONEY','MONTH','MORAL','MOTOR','MOUNT','MOUSE','MOUTH','MOVED','MUSIC','NAKED','NERVE','NEVER','NIGHT','NOBLE','NOISE','NORTH','NOTED','NOVEL','NURSE','OCCUR','OCEAN','OFFER','OFTEN','OPERA','ORDER','OTHER','OUTER','OWING','OWNER','PAINT','PANEL','PANIC','PAPER','PARTY','PATCH','PAUSE','PEACE','PEARL','PENNY','PHASE','PHONE','PHOTO','PIANO','PIECE','PILOT','PITCH','PIXEL','PLACE','PLAIN','PLANE','PLANT','PLATE','PLAZA','PLEAD','PLUMB','PLUME','PLUMP','PLUNGE','POINT','POLAR','POUND','POWER','PRESS','PRIDE','PRIME','PRINT','PRIOR','PRIZE','PROOF','PROUD','PROVE','QUEEN','QUEST','QUEUE','QUICK','QUIET','QUITE','QUOTA','QUOTE','RADAR','RADIO','RAISE','RANGE','RAPID','RATIO','REACH','REALM','REIGN','RELAX','REPLY','RIGHT','RIVAL','RIVER','ROBIN','ROBOT','ROCKY','ROMAN','ROUGH','ROUND','ROUTE','ROYAL','RUGBY','RURAL','SAINT','SALAD','SAUCE','SCALE','SCARE','SCENE','SCOPE','SCORE','SENSE','SERVE','SEVEN','SHALL','SHAME','SHAPE','SHARE','SHARK','SHARP','SHAWL','SHEAR','SHEER','SHEET','SHELF','SHELL','SHIFT','SHIRE','SHOCK','SHOOT','SHORE','SHORT','SHOUT','SIGHT','SINCE','SIXTH','SIXTY','SKILL','SKULL','SLASH','SLAVE','SLEEP','SLICE','SLIDE','SLOPE','SMALL','SMART','SMELL','SMILE','SMOKE','SOLAR','SOLID','SOLVE','SORRY','SOUND','SOUTH','SPACE','SPARE','SPARK','SPEAK','SPEED','SPEND','SPENT','SPICE','SPINE','SPLIT','SPOKE','SPORT','SPRAY','SQUAD','STACK','STAFF','STAGE','STAIN','STAIR','STAKE','STALL','STAMP','STAND','STARE','START','STATE','STEAL','STEAM','STEEL','STEEP','STEER','STERN','STICK','STILL','STOCK','STOLE','STONE','STOOD','STORE','STORM','STORY','STOUT','STOVE','STRAP','STRAW','STRAY','STRIP','STUCK','STUDY','STUFF','STYLE','SUGAR','SUITE','SUPER','SURGE','SWAMP','SWARM','SWEAR','SWEAT','SWEEP','SWEET','SWEPT','SWIFT','SWING','SWORD','TABLE','TASTE','TEACH','TEMPO','THANK','THEME','THERE','THICK','THIEF','THING','THINK','THIRD','THOSE','THREE','THREW','THROW','THUMB','TIGHT','TIMER','TIRED','TITLE','TODAY','TOKEN','TOTAL','TOUCH','TOUGH','TOWER','TRACE','TRACK','TRADE','TRAIL','TRAIN','TRAIT','TRAMP','TRASH','TREAT','TREND','TRIAL','TRIBE','TRICK','TRIED','TRUCK','TRULY','TRUMP','TRUNK','TRUST','TRUTH','TULIP','TWICE','TWIST','UNCLE','UNDER','UNION','UNITY','UNTIL','UPPER','UPSET','URBAN','USUAL','UTTER','VALID','VALUE','VIDEO','VIGOR','VIRUS','VISIT','VITAL','VIVID','VOCAL','VOICE','VOTER','WASTE','WATCH','WATER','WEARY','WEAVE','WHEEL','WHERE','WHICH','WHILE','WHITE','WHOLE','WHOSE','WOMAN','WORLD','WORRY','WORSE','WORST','WORTH','WOULD','WOUND','WRITE','WRONG','WROTE','YACHT','YOUNG','YOUTH']);
  return common.has(w.toUpperCase());
}

// Programmatically find right-to-left pairs
const verified = [];
const w1Pool = ['OAR','AGE','LAY','OWL','OAK','ATE','ACE','OAT','EAR','AWE','ALE','OWE','OWN','ARM','ARC','AIR','AID','AIM'];
const w2Pool = ['SCOLD','PRICE','STALE','FLAME','STERN','STORE','SPARE','SPINE','STEAM','STAIN','STARE','SWEAR','STONE','STOVE','STRAP','STRIP','BRAIN','BRAND','CRANE','DRAIN','TRACE','GRIME','BLAME','BRAVE','BLAZE','SLOPE','SPITE','STAGE','SHAKE','SHAME','SHAPE','SHARE','SNARE','SCARE','SCALE','SPADE','SNORE','SCORE','SPOKE','STOKE','SPACE','PLACE','PLATE','PLANE','PLANT','CLASH','CRASH','FLASH','SLASH','SMASH','TRASH','BRUSH','CRUSH','PLUME','PLUMB','STEAM','CREAM','DREAM','GLEAM','CHARM','CLIMB','CLAMP','CLOAK','CLASP','CRAFT','CROWD','CROWN','CREST'];

let nextId = 126;
for (const w2 of w2Pool) {
  if (verified.length >= 30) break;
  for (let i = 0; i < w2.length; i++) {
    const letter = w2[i];
    const remaining = w2.substring(0, i) + w2.substring(i + 1);
    if (!isCommonWord(remaining)) continue;

    for (const w1 of w1Pool) {
      // Try inserting letter at every position in w1
      for (let j = 0; j <= w1.length; j++) {
        const newW1 = w1.substring(0, j) + letter + w1.substring(j);
        if (isCommonWord(newW1) && newW1 !== w1 && newW1 !== w2) {
          // Check this pair isn't a duplicate
          const key = w1 + '-' + w2;
          if (!verified.find(v => v.key === key)) {
            verified.push({
              key,
              id: nextId++,
              w1, w2, letter, remaining, newW1,
              fromPos: i, toPos: j,
              difficulty: remaining.length >= 5 ? 3 : remaining.length >= 4 ? 2 : 1
            });
            break;
          }
        }
      }
      if (verified.length >= 30) break;
    }
    if (verified.length >= 30) break;
  }
}

console.log('Found', verified.length, 'verified right-to-left questions');
verified.slice(0, 10).forEach(v => {
  console.log('  ' + v.w1 + ' + ' + v.w2 + ' → move ' + v.letter + ' → ' + v.newW1 + ' + ' + v.remaining);
});

// Build question objects
const questions = verified.map(v => {
  const allLetters = (v.w1 + v.w2).toUpperCase().split('');
  const unique = [...new Set(allLetters)].filter(l => l !== v.letter.toUpperCase());
  const common = 'STRNLCPBDMFGHKWVY'.split('');
  for (const l of common) { if (!unique.includes(l) && l !== v.letter.toUpperCase()) unique.push(l); if (unique.length >= 8) break; }

  const correctIdx = v.id % 5;
  const distractors = unique.slice(0, 4);
  const opts = [...distractors];
  opts.splice(correctIdx, 0, v.letter.toUpperCase());
  while (opts.length > 5) opts.pop();
  while (opts.length < 5) opts.push(common.find(l => !opts.includes(l)));

  return {
    id: v.id,
    difficulty: v.difficulty,
    question: 'Move one letter from one word to the other to make two new words: ' + v.w1 + ' ' + v.w2,
    options: opts,
    correct: correctIdx,
    explanation: "Move '" + v.letter.toUpperCase() + "' from " + v.w2 + " to make " + v.remaining + ", and insert it into " + v.w1 + " to make " + v.newW1 + ". The letter moves right to left here! Tip: Always try both directions. ✓"
  };
});

// Insert using safe-insert
const result = insertQuestions('vrData', 'letterMove', questions);
console.log('\\nInserted:', result);

// Update mapping
const vrMap = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'public/vr-question-lesson-map.json'), 'utf8'));
const lmMap = Array.isArray(vrMap.letterMove) ? vrMap.letterMove : [];
questions.forEach(q => {
  lmMap.push({ questionId: q.id, subConceptId: 'remove-first-letter', confidence: 'high' });
});
vrMap.letterMove = lmMap;
fs.writeFileSync(path.resolve(__dirname, '..', 'public/vr-question-lesson-map.json'), JSON.stringify(vrMap, null, 2), 'utf8');
console.log('Mapping updated');

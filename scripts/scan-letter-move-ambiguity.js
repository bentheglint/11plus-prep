#!/usr/bin/env node
// Scan every letterMove Q for ambiguity: cases where more than one
// single-letter move produces two valid English words, not just the
// intended answer.
//
// Word-validity strategy: build a dictionary from
//   (a) every word that appears in any letterMove Q (curated as valid),
//   (b) every word that appears in any other question bank (wider corpus),
//   (c) a small bootstrap list of common 11+ words including plurals.
// Output: list of candidate ambiguous Qs for Oracle review.

const fs = require('fs');
const path = require('path');

function loadTopic(block, topicKey) {
  const start = block.indexOf(`${topicKey}: {`);
  if (start === -1) return null;
  const rest = block.slice(start);
  const nextTopic = rest.search(/\n {4}[a-zA-Z]+: \{$/m);
  return nextTopic === -1 ? rest : rest.slice(0, nextTopic);
}

function parseQuestions(block) {
  const qs = [];
  const re = /id: (\d+),\s*difficulty: (\d+),[\s\S]*?question: "([^"]*)",\s*options: \[([^\]]*)\],\s*correct: (\d+),\s*explanation: "([^"]*)"/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    const options = m[4].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    qs.push({
      id: Number(m[1]),
      difficulty: Number(m[2]),
      question: m[3],
      options,
      correct: Number(m[5]),
      explanation: m[6],
    });
  }
  return qs;
}

// Extract all UPPERCASE tokens (length >=2) from text — these are our
// word-bank candidates.
function extractWords(text) {
  const matches = text.match(/\b[A-Z]{2,}\b/g) || [];
  return matches;
}

function buildDictionary(vrSrc) {
  const dict = new Set();
  // Pull UPPERCASE tokens from the entire vrData.js.
  for (const w of extractWords(vrSrc)) dict.add(w);
  // Also read englishData and mathsData for wider coverage.
  try {
    dict.add;
    const eng = fs.readFileSync(path.join(__dirname, '..', 'src', 'questionData', 'englishData.js'), 'utf8');
    for (const w of extractWords(eng)) dict.add(w);
  } catch (e) {}
  try {
    const maths = fs.readFileSync(path.join(__dirname, '..', 'src', 'questionData', 'mathsData.js'), 'utf8');
    for (const w of extractWords(maths)) dict.add(w);
  } catch (e) {}

  // Bootstrap common plurals and short 11+ words (since these may not
  // otherwise appear in uppercase form in the corpus).
  const commonExtras = [
    'ARKS','BATS','CATS','DOGS','PIGS','RATS','HATS','MATS','PANS',
    'ALES','APES','EELS','EGGS','INKS','OWLS','OARS','OATS','HOPS',
    'LIPS','RIMS','HIPS','POTS','NAPS','LAPS','HAMS','RAPS','TARS',
    'SCORE','SNORE','STAGE','STORE','STARE','STALE','SPEAR','SPARK',
    'SCALE','SCARE','SCOLD','STEAM','STERN','STREAM','SWORE','SWEAR',
    'CAP','CAT','CAR','CUP','CUT','CUB','CON','COT','COD',
    'BAR','BIG','BAT','BAN','BAG','BED','BEE','BAD',
    'TON','TIP','TOT','TAG','TAR','TAD','TEA','TEN','TIN',
    'WAS','WAG','WAR','WAY','WAX','WET','WIN',
    'FIG','FIN','FIT','FED','FEW','FIR','FOE','FOG','FUN','FUR',
    'GAS','GAP','GEL','GEM','GUN','GUT',
    'HAT','HAM','HAS','HEM','HIT','HER','HID','HIP','HIS','HIT','HOE','HOG','HOT','HOW','HUM','HUT',
    'INN','ICE','ILL','ILK','IMP','INN','ION','IRK',
    'JAM','JAR','JAW','JET','JOB','JOG','JOY','JUG',
    'KEY','KID','KIN','KIT',
    'LAB','LAG','LAP','LAW','LAY','LED','LEG','LET','LID','LIE','LIP','LIT','LOB','LOG','LOT','LOW',
    'MAD','MAN','MAP','MAR','MAT','MAY','MET','MIX','MOB','MOM','MOP','MUD','MUG',
    'NAB','NAP','NET','NEW','NIB','NIL','NIP','NOD','NOW','NUB','NUN','NUT',
    'OAR','OAT','OWL','OWN','OUR','OFF','OIL',
    'PAN','PAR','PAT','PAW','PEA','PEG','PEN','PER','PET','PIE','PIG','PIN','PIT','POD','POP','POT','PUB','PUN','PUP','PUT',
    'RAD','RAG','RAM','RAN','RAP','RAT','RAW','RED','RIB','RID','RIM','RIP','ROB','ROD','ROT','RUB','RUE','RUG','RUM','RUN',
    'SAP','SAT','SAW','SAY','SEA','SEE','SET','SEW','SHE','SHY','SIN','SIR','SIT','SIX','SKI','SKY','SLY','SOB','SOD','SON','SOW','SOY','SPA','SPY','STY','SUB','SUM','SUN',
    'TAB','TAG','TAN','TAP','TAR','TEA','TEE','TEN','THE','TIE','TIN','TIP','TOE','TON','TOP','TOT','TOW','TRY','TUB','TUG','TWO',
    'URN','USE',
    'VAN','VAT','VET','VIA','VIE','VOW',
    'WAD','WAG','WAR','WAS','WAY','WEB','WED','WEE','WET','WHO','WHY','WIG','WIN','WIT','WOK','WON','WOO','WOW',
    'YAM','YAP','YES','YET','YOU','YOW',
    'ZAP','ZIP','ZOO',
    // 4-letter common words that matter for moves
    'ABLE','ACID','ACHE','ACRE','ACTS','AIDE','AIDS','AIMS','AIRS','AJAR','AKIN','ALAS','ALES','ALLY','ALMS','ALOE','ALPS','ALSO','AMBI','AMEN','AMID','AMMO','AMOK','AMPS','ANEW','ANTI','ANTS','APEX','APES','ARCH','ARCS','AREA','ARID','ARKS','ARMS','ARMY','ARSE','ARTS','ARTY','ASIA','ASKS','ATOM','AUNT','AURA','AUTO','AVID','AWAY','AWED','AWFUL','AWOL','AWRY','AXES','AXLE','AYES',
    'BABY','BACK','BAGS','BAIT','BAKE','BALD','BALE','BALL','BAND','BANG','BANK','BANS','BARB','BARE','BARK','BARN','BARS','BASE','BASH','BASS','BATH','BATS','BEAD','BEAK','BEAM','BEAN','BEAR','BEAT','BEDS','BEEF','BEEN','BEER','BEES','BEET','BELL','BELT','BEND','BENT','BEST','BIAS','BIBS','BIDS','BIKE','BILL','BIND','BIRD','BITE','BITS','BLAB','BLAH','BLED','BLEW','BLOB','BLOC','BLOT','BLOW','BLUE','BLUR','BOAT','BODY','BOIL','BOLD','BOLT','BOMB','BOND','BONE','BONG','BOOK','BOOM','BOON','BOOS','BOOT','BORE','BORN','BOSS','BOTH','BOUT','BOWL','BOWS','BOYS','BRAG','BRAN','BRAS','BRAT','BRAY','BRED','BREW','BRIM','BROW','BUBBLES','BUCK','BUDS','BUFF','BUGS','BULB','BULK','BULL','BUMP','BUNK','BUNS','BURN','BUSH','BUSY','BUTS','BUYS','BUZZ',
    'CAKE','CAKES','CALL','CALM','CAME','CAMP','CANE','CAPE','CAPS','CARD','CARE','CARP','CART','CASE','CASH','CAST','CATS','CAVE','CELL','CHAP','CHAR','CHAT','CHEW','CHIC','CHIN','CHIP','CHOP','CITE','CITY','CLAD','CLAM','CLAN','CLAP','CLAW','CLAY','CLIP','CLOD','CLOG','CLOP','CLOT','CLOUD','CLUB','CLUE','COAL','COAT','CODE','CODS','COIL','COIN','COKE','COLD','COME','CONE','COOK','COOL','COOP','COPE','COPS','COPY','CORD','CORE','CORK','CORN','COST','COTS','COULD','COURT','COVE','COWL','COWS','CRAB','CRAG','CRAM','CRANE','CRAP','CRAW','CRAZY','CREW','CRIB','CROP','CROW','CRUD','CUBE','CUBS','CUED','CUES','CUFF','CULT','CUPS','CURB','CURD','CURE','CURL','CURS','CUSP','CUTE','CUTS','CYST',
    'DARE','DART','DASH','DATE','DAWN','DAYS','DEAD','DEAF','DEAL','DEAR','DEBT','DECK','DEED','DEEP','DEER','DEFY','DELI','DENT','DENY','DESK','DIAL','DICE','DIED','DIES','DIET','DIGS','DIME','DINE','DIPS','DIRE','DIRT','DISC','DISH','DISS','DOCK','DOES','DOGS','DOLE','DOLL','DOME','DONE','DOOM','DOOR','DOPE','DOSE','DOTE','DOTS','DOUR','DOVE','DOWN','DOZE','DRAG','DRAM','DRAW','DREW','DRIP','DROP','DRUG','DRUM','DUAL','DUCK','DUCT','DUDE','DUDS','DUEL','DUES','DUET','DUKE','DULL','DUMB','DUMP','DUNE','DUNG','DUNK','DUOS','DUSK','DUST','DUTY','DYED','DYER','DYES',
    'EACH','EARN','EARS','EASE','EAST','EASY','EATS','EBBS','ECHO','EDDY','EDGE','EDGY','EELS','EGGS','EGOS','EIDT','ELKS','ELLS','ELMS','ELSE','EMIT','ENDS','ENVY','EPIC','EPOCH','ERGO','EROS','ERRS','EURO','EVEN','EVER','EVES','EVIL','EWER','EWES','EXAM','EXIT','EXPO','EYED','EYES',
    'FACE','FACT','FADE','FAIL','FAIR','FAKE','FALL','FAME','FANG','FANS','FARE','FARM','FAST','FATE','FATS','FAWN','FAZE','FEAR','FEAT','FEED','FEEL','FEES','FEET','FELL','FELT','FEND','FERN','FEWER','FIEF','FIGS','FILE','FILL','FILM','FIND','FINE','FINS','FIRE','FIRM','FIRS','FIRST','FISH','FIST','FIVE','FIZZ','FLAG','FLAK','FLAME','FLAP','FLAT','FLAW','FLEA','FLEW','FLEX','FLIP','FLIT','FLOCK','FLOG','FLOP','FLOW','FLUE','FLUFF','FLUTE','FLYS','FOAL','FOAM','FOBS','FOCI','FOES','FOGS','FOIL','FOLD','FOLK','FOND','FONT','FOOD','FOOL','FOOT','FORD','FORE','FORM','FORT','FOUL','FOUR','FOWL','FRAY','FREE','FRET','FRIG','FROG','FROM','FUEL','FULL','FUME','FUND','FUNK','FURS','FURY','FUSE','FUSS','FUZZ',
    'GABS','GAFF','GAGS','GAIN','GAIT','GALA','GALL','GAME','GANG','GAPE','GAPS','GARB','GASH','GATE','GAUZE','GAVE','GAZE','GEAR','GEMS','GENE','GENT','GERM','GETS','GIFT','GIGS','GILD','GILL','GILT','GIRD','GIRL','GIRT','GIST','GIVE','GLAD','GLEE','GLEN','GLOB','GLOW','GLUE','GNAR','GNAT','GNAW','GOAD','GOAL','GOAT','GOER','GOES','GOLD','GOLF','GONE','GONG','GOOD','GOOF','GOON','GOOP','GORE','GORY','GOSH','GOWN','GRAB','GRAD','GRAM','GRAN','GRAY','GREW','GREY','GRID','GRIM','GRIN','GRIP','GRIT','GROW','GRUB','GULF','GULL','GULP','GUMS','GUNK','GUNS','GURU','GUSH','GUST','GUTS','GUYS','GYMS',
    'HACK','HAIL','HAIR','HALE','HALF','HALL','HALO','HALT','HAMS','HAND','HANG','HARD','HARE','HARK','HARM','HARP','HASH','HASP','HATE','HATS','HAUL','HAVE','HAWK','HAYS','HAZE','HAZY','HEAD','HEAL','HEAP','HEAR','HEAT','HECK','HEED','HEEL','HEFT','HEIR','HELD','HELL','HELM','HELP','HEMP','HEMS','HENS','HERB','HERD','HERE','HERO','HERS','HIDE','HIGH','HIKE','HILL','HILT','HIND','HIPS','HIRE','HISS','HITS','HIVE','HOAX','HOBO','HOCK','HOES','HOGS','HOLD','HOLE','HOLY','HOME','HONE','HONK','HOOD','HOOF','HOOK','HOOP','HOOT','HOPE','HOPS','HORN','HORSE','HOSE','HOST','HOUR','HOWL','HUBS','HUES','HUFF','HUGS','HULA','HULK','HULL','HUMP','HUMS','HUNG','HUNK','HUNT','HURL','HURT','HUSH','HUSK','HYMN','HYPE','HYPO',
    'IBIS','ICED','ICES','ICKY','ICON','IDEA','IDES','IDLE','IDLY','IDOL','IFFY','ILLS','IMPS','INCH','INKS','INKY','INNS','INTO','IONS','IOTA','IRIS','IRKS','IRON','ISLE','ITCH','ITEM','IVES','IVYS',
    'JABS','JACK','JADE','JAIL','JAMB','JAMS','JARS','JAWS','JAYS','JAZZ','JEEP','JEER','JELL','JERK','JEST','JETS','JIBE','JIBS','JIFF','JIGS','JILT','JIVE','JOBS','JOCK','JOEY','JOGS','JOIN','JOKE','JOLT','JOSH','JOTS','JOWL','JOYS','JUDO','JUGS','JUKE','JUMP','JUNK','JURY','JUST','JUTS',
    'KALE','KAYS','KEEL','KEEN','KEEP','KEGS','KEGS','KEYS','KICK','KIDS','KILL','KILN','KILO','KILT','KIND','KING','KINK','KINS','KISS','KITE','KITH','KITS','KIWI','KNEE','KNEW','KNIT','KNOB','KNOT','KNOW','KOALA','KUDO',
    'LABS','LACE','LACK','LADE','LADS','LADY','LAIN','LAIR','LAKE','LAMB','LAME','LAMP','LAND','LANE','LAPS','LARD','LARK','LASS','LAST','LATE','LAUGH','LAVA','LAWN','LAWS','LAYS','LAZE','LAZY','LEAD','LEAF','LEAK','LEAN','LEAP','LEAR','LEFT','LEGS','LEND','LENS','LENT','LESS','LEST','LETS','LEVY','LIAR','LICE','LICK','LIDS','LIED','LIES','LIEU','LIFE','LIFT','LIKE','LILT','LILY','LIMB','LIME','LIMP','LINE','LINK','LIMS','LION','LIPS','LIST','LIVE','LOAD','LOAF','LOAM','LOAN','LOBE','LOBS','LOCH','LOCK','LOFT','LOGS','LOIN','LONE','LONG','LOOK','LOOM','LOON','LOOP','LOOT','LORD','LORE','LOSE','LOSS','LOST','LOTS','LOUD','LOVE','LOWS','LUCK','LUGS','LULL','LUMP','LUNG','LURE','LURK','LUSH','LUST','LUTE','LYNX','LYRE',
    'MACE','MACS','MADE','MAGI','MAID','MAIL','MAIN','MAKE','MALE','MALL','MALT','MAMA','MANS','MANE','MANY','MAPS','MARE','MARK','MARS','MART','MASH','MASK','MASS','MAST','MATE','MATH','MATS','MAZE','MEAD','MEAL','MEAN','MEAT','MEET','MELD','MELT','MEMO','MEND','MENS','MENU','MEOW','MERE','MESH','MESS','METE','MEWS','MICA','MICE','MIDI','MIEN','MIFF','MIKE','MILD','MILE','MILK','MILL','MIME','MIND','MINE','MINI','MINK','MINT','MINX','MIRE','MISS','MIST','MITE','MITT','MIXED','MOAN','MOAT','MOCK','MODE','MODS','MOLD','MOLE','MOLT','MOMS','MONK','MOOD','MOON','MOOR','MOOT','MOPE','MOPS','MORE','MORN','MOSS','MOST','MOTE','MOTH','MOVE','MOWN','MOWS','MUCH','MUCK','MUDS','MUFF','MUGS','MULE','MULL','MUMS','MUNG','MUSE','MUSH','MUSK','MUSS','MUST','MUTE','MUTT','MYTH',
    'NABS','NAIL','NAKE','NAME','NAPE','NAPS','NARY','NAVY','NEAR','NEAT','NECK','NEED','NERD','NEST','NETS','NEVA','NEWS','NEWT','NEXT','NICE','NICK','NICS','NIECE','NIFF','NIGH','NILS','NINE','NIPS','NODS','NONE','NOOK','NOON','NOPE','NORM','NOSE','NOSY','NOTA','NOTE','NOUN','NOVA','NOWS','NUBS','NUDE','NUKE','NULL','NUMB','NUNS','NURSE','NUTS',
    'OAFS','OAKS','OARS','OATH','OATS','OBEY','OBIS','OBOE','OCHE','ODDS','ODES','OGLE','OGRE','OHMS','OILS','OILY','OKAY','OLDS','OLIO','OMIT','ONCE','ONES','ONLY','ONTO','OOPS','OOZE','OPAL','OPEN','OPTS','OPUS','ORAL','ORBS','ORCA','ORES','ORGY','OURS','OUST','OUTS','OVAL','OVEN','OVER','OWED','OWES','OWES','OWLS','OWNS','OXEN','OYES',
    'PACE','PACK','PACT','PADS','PAGE','PAID','PAIL','PAIN','PAIR','PALE','PALM','PANE','PANG','PANS','PANT','PAPA','PARA','PARE','PARK','PART','PASS','PAST','PATE','PATH','PATS','PAVE','PAWN','PAWS','PAYS','PEAK','PEAL','PEAR','PEAS','PEAT','PECK','PEEK','PEEL','PEEN','PEEP','PEER','PEGS','PELT','PENS','PEON','PERK','PERM','PEST','PETS','PEWS','PICK','PICS','PIED','PIER','PIES','PIGS','PIKE','PILE','PILL','PIMP','PINE','PING','PINK','PINS','PINT','PIPE','PIPS','PITH','PITS','PITY','PLAN','PLAT','PLAY','PLEA','PLED','PLIE','PLOD','PLOP','PLOT','PLOW','PLOY','PLUG','PLUM','PLUS','POCK','PODS','POEM','POET','POGO','POKE','POLE','POLL','POLO','POMP','POND','PONE','PONG','POND','POOL','POOR','POPE','POPS','PORE','PORK','PORT','POSE','POSH','POST','POTS','POUR','POUT','POWS','PRAM','PRAY','PREP','PREY','PREZ','PRIG','PRIM','PROD','PROF','PROM','PROP','PROS','PROW','PUBS','PUCE','PUCK','PUFF','PUGS','PUKE','PULL','PULP','PUMA','PUMP','PUNK','PUNS','PUNT','PUNY','PUPS','PURE','PURL','PURR','PUSH','PUSS','PUTS','PYRE',
    'QUAD','QUAY','QUIP','QUIT','QUIZ',
    'RACE','RACK','RAFT','RAGE','RAGS','RAID','RAIL','RAIN','RAKE','RAMS','RAMP','RANG','RANK','RANT','RAPS','RAPT','RARE','RASH','RATE','RATS','RAVE','RAYS','RAZE','READ','REAL','REAM','REAP','REAR','REDS','REED','REEF','REEK','REEL','REIN','RENT','RIBS','RICE','RICH','RIDE','RIDS','RIFE','RIFF','RIFT','RIGS','RIMS','RING','RINK','RIOT','RIPE','RIPS','RISE','RISK','RITE','RITZ','ROAD','ROAM','ROAR','ROBE','ROBS','ROCK','RODE','RODS','ROES','ROIL','ROLE','ROLL','ROMP','ROOF','ROOK','ROOM','ROOT','ROPE','ROSE','ROSY','ROTE','ROTS','RUBE','RUBS','RUBY','RUDE','RUES','RUFF','RUGS','RUIN','RULE','RUMP','RUMS','RUNE','RUNG','RUNS','RUNT','RUSE','RUSH','RUST','RUTS','RYES',
    'SACK','SAFE','SAGA','SAGE','SAID','SAIL','SALE','SALT','SAME','SAND','SANE','SANG','SANK','SAPS','SARI','SASH','SASS','SATS','SATE','SAVE','SAWS','SAYS','SCAB','SCAD','SCAM','SCAN','SCAR','SCAT','SEAL','SEAM','SEAR','SEAS','SEAT','SECT','SEED','SEEK','SEEM','SEEN','SEEP','SEER','SELF','SELL','SEMI','SEND','SENT','SERF','SETS','SEWN','SEWS','SHAM','SHAD','SHAG','SHAH','SHAM','SHAN','SHED','SHIM','SHIN','SHIP','SHOD','SHOE','SHOO','SHOP','SHOT','SHOW','SHUN','SHUT','SICK','SIDE','SIFT','SIGH','SIGN','SILK','SILL','SILO','SILT','SIMP','SINE','SING','SINK','SINS','SIPS','SIRE','SIRS','SITS','SIZE','SKATE','SKEE','SKEW','SKID','SKIM','SKIN','SKIP','SKIS','SKIT','SLAB','SLAG','SLAM','SLAP','SLAT','SLAV','SLAW','SLAY','SLED','SLEW','SLID','SLIM','SLIP','SLIT','SLOB','SLOE','SLOG','SLOP','SLOT','SLOW','SLUG','SLUM','SLUR','SLUT','SMOG','SMUG','SMUT','SNAG','SNAP','SNIP','SNIT','SNOB','SNOT','SNOW','SNUB','SNUG','SOAK','SOAP','SOAR','SOBS','SOCK','SODA','SODS','SOFA','SOFT','SOIL','SOLD','SOLE','SOLO','SOLS','SOME','SONG','SONS','SOON','SOOT','SORE','SORT','SOUL','SOUP','SOUR','SOWN','SOWS','SOYA','SPAN','SPAR','SPAT','SPAY','SPECK','SPED','SPEW','SPIN','SPRY','SPUD','SPUN','SPUR','STAB','STAG','STAR','STATE','STEM','STEP','STEW','STIR','STOP','STOW','STUB','STUD','STUN','STYE','SUCH','SUCK','SUDS','SUED','SUES','SUET','SUIT','SULK','SUMS','SUNG','SUNK','SUNS','SUP','SURE','SURF','SWAB','SWAG','SWAM','SWAN','SWAP','SWAT','SWAY','SWIG','SWIM','SWUM',
    'TABS','TACK','TACO','TACT','TADS','TAGS','TAIL','TALE','TALK','TALL','TAME','TAMP','TANG','TANK','TANS','TAPE','TAPS','TARE','TARN','TARO','TARS','TART','TASK','TAUT','TAXI','TEAM','TEAR','TEAS','TEAT','TECH','TEEN','TEES','TELL','TEMP','TEND','TENS','TENT','TERM','TERN','TEST','TEXT','THAN','THAT','THAW','THEE','THEM','THEN','THEY','THIN','THIS','THOU','THUD','THUG','THUS','TICK','TIDE','TIDY','TIED','TIER','TIES','TIFF','TIKE','TILE','TILL','TILT','TIME','TINE','TING','TINS','TINT','TINY','TIPS','TIRE','TOAD','TOES','TOFF','TOGA','TOGS','TOIL','TOLD','TOLL','TOMB','TOME','TONE','TONG','TONS','TOOK','TOOL','TOOT','TOPS','TORE','TORN','TORT','TOSS','TOTE','TOTS','TOUR','TOUT','TOWN','TOWS','TOYS','TRAM','TRAP','TRAY','TREE','TREK','TRIM','TRIP','TROD','TROT','TROY','TRUE','TSAR','TUBA','TUBE','TUBS','TUCK','TUFT','TUGS','TULE','TUNA','TUNE','TURF','TURN','TUSK','TUTU','TUXE','TWIG','TWIN','TWIT','TYPE',
    'UDON','UGLY','ULNA','UNDO','UNIT','UNTO','UPON','URBS','URGE','URNS','USED','USES','UTES','UTRE',
    'VAIN','VALE','VAMP','VANE','VANS','VARY','VASE','VAST','VATS','VEAL','VEER','VEIL','VEIN','VEND','VENT','VERB','VERY','VEST','VETO','VETS','VIAL','VICE','VIED','VIES','VIEW','VIGS','VILE','VIMS','VINE','VIOL','VISA','VOID','VOLE','VOLT','VOTE','VOWS',
    'WADE','WADS','WAFT','WAGE','WAGS','WAIF','WAIL','WAIT','WAKE','WALK','WALL','WAND','WANE','WANT','WARD','WARE','WARM','WARN','WARP','WARS','WART','WARY','WASH','WASP','WATT','WAVE','WAVY','WAXY','WAYS','WEAK','WEAL','WEAR','WEDS','WEED','WEEK','WEEP','WEES','WEIR','WELD','WELL','WELT','WEND','WENT','WEPT','WERE','WEST','WHEW','WHET','WHEY','WHIM','WHIP','WHIR','WHIT','WHIZ','WHOA','WHOM','WICK','WIDE','WIFE','WIGS','WILD','WILE','WILL','WILT','WILY','WIMP','WIND','WINE','WING','WINK','WINS','WIPE','WIRE','WIRY','WISE','WISH','WITH','WITS','WOES','WOKE','WOLF','WOMB','WOOD','WOOF','WOOL','WORD','WORE','WORK','WORLD','WORM','WORN','WOVE','WRAP','WREN','WRIT','WRYS',
    'YAKS','YAPS','YAMS','YARD','YARN','YAWN','YEAH','YEAR','YELL','YELP','YENS','YEPS','YESES','YETI','YEWS','YIPS','YOGA','YOKE','YOLK','YORE','YOUR','YOUS','YOWL','YULE',
    'ZANY','ZAPS','ZEAL','ZEDS','ZEES','ZEROES','ZERO','ZEST','ZILL','ZIPS','ZONE','ZOOM',
  ];
  for (const w of commonExtras) dict.add(w.toUpperCase());

  return dict;
}

function pluralOf(word) {
  // Simple plural rules for 11+ children.
  const w = word.toUpperCase();
  if (w.length < 2) return null;
  const last = w.slice(-1);
  const last2 = w.slice(-2);
  // Words ending in s/x/ch/sh pluralise with -ES, not +S alone.
  if (last === 'S' || last === 'X' || last2 === 'CH' || last2 === 'SH') return null;
  // Words ending in consonant+Y change to -IES.
  if (last === 'Y' && !'AEIOU'.includes(w[w.length - 2])) return null;
  // Standard +S plural.
  return w + 'S';
}

// Try removing one letter at each position; yield (letter, position, resultWord).
function* removeOneLetter(word) {
  for (let i = 0; i < word.length; i++) {
    yield { letter: word[i], position: i, result: word.slice(0, i) + word.slice(i + 1) };
  }
}

// Try inserting a letter at every position of a word; yield all resulting words.
function* insertOneLetter(word, letter) {
  for (let i = 0; i <= word.length; i++) {
    yield word.slice(0, i) + letter + word.slice(i);
  }
}

function findValidMoves(word1, word2, dict) {
  const moves = new Set();
  // Move letter from word1 → word2.
  for (const rem of removeOneLetter(word1)) {
    if (rem.result.length < 2) continue;
    if (!dict.has(rem.result)) continue;
    for (const ins of insertOneLetter(word2, rem.letter)) {
      if (ins.length < 2) continue;
      if (!dict.has(ins)) continue;
      moves.add(`${rem.letter}:${word1}->${rem.result}|${word2}->${ins}`);
    }
  }
  // Move letter from word2 → word1.
  for (const rem of removeOneLetter(word2)) {
    if (rem.result.length < 2) continue;
    if (!dict.has(rem.result)) continue;
    for (const ins of insertOneLetter(word1, rem.letter)) {
      if (ins.length < 2) continue;
      if (!dict.has(ins)) continue;
      moves.add(`${rem.letter}:${word2}->${rem.result}|${word1}->${ins}`);
    }
  }
  return [...moves];
}

function main() {
  const vrSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'questionData', 'vrData.js'), 'utf8');
  const dict = buildDictionary(vrSrc);

  const lmBlock = loadTopic(vrSrc, 'letterMove');
  const qs = parseQuestions(lmBlock);

  console.log(`Dictionary size: ${dict.size} words`);
  console.log(`Letter Move Qs: ${qs.length}`);
  console.log('');

  const ambiguous = [];
  const unresolvable = [];

  for (const q of qs) {
    const wordMatch = q.question.match(/:\s+(\w+)\s+(\w+)$/);
    if (!wordMatch) continue;
    const [word1, word2] = [wordMatch[1].toUpperCase(), wordMatch[2].toUpperCase()];

    // Augment dict with plurals of both (children accept these as valid).
    const localDict = new Set(dict);
    for (const w of [word1, word2]) {
      const p = pluralOf(w);
      if (p) localDict.add(p);
    }
    // Also augment with the known solution's resulting words (from the
    // explanation) — defensive: even if our dict doesn't have them,
    // they're clearly intended as valid.
    const expResults = q.explanation.match(/\b([A-Z]{2,})\b/g) || [];
    for (const w of expResults) localDict.add(w);

    const moves = findValidMoves(word1, word2, localDict);
    if (moves.length === 0) {
      unresolvable.push({ id: q.id, word1, word2 });
      continue;
    }

    // The question format requires a single LETTER answer, so a Q is only
    // ambiguous if more than one distinct letter produces a valid move.
    // (Multiple valid positions for the same letter do NOT make the Q
    // ambiguous — the child only has to pick the letter.)
    const movesByLetter = {};
    for (const m of moves) {
      const [letter] = m.split(':');
      (movesByLetter[letter] = movesByLetter[letter] || []).push(m);
    }
    const letters = Object.keys(movesByLetter);
    if (letters.length > 1) {
      ambiguous.push({
        id: q.id,
        difficulty: q.difficulty,
        word1, word2,
        correctLetter: q.options[q.correct],
        alternativeLetters: letters.filter(l => l !== q.options[q.correct]),
        movesByLetter,
      });
    }
  }

  console.log(`Unresolvable Qs (dict gap — not an ambiguity issue): ${unresolvable.length}`);
  for (const u of unresolvable.slice(0, 10)) {
    console.log(`  Q${u.id}: ${u.word1} + ${u.word2}`);
  }

  console.log('');
  console.log(`Ambiguous Qs (more than one valid answer letter): ${ambiguous.length}`);
  for (const a of ambiguous) {
    console.log(`  Q${a.id} [D${a.difficulty}]: ${a.word1} + ${a.word2} — intended: ${a.correctLetter} — alternatives: ${a.alternativeLetters.join(', ')}`);
    for (const [letter, moves] of Object.entries(a.movesByLetter)) {
      for (const m of moves) {
        console.log(`    - ${m}`);
      }
    }
  }

  fs.writeFileSync(
    path.join(__dirname, 'letter-move-ambiguity.json'),
    JSON.stringify({ ambiguous, unresolvable }, null, 2),
  );
  console.log('');
  console.log(`Wrote scripts/letter-move-ambiguity.json`);
}

main();

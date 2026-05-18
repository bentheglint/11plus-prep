// Content insertion script: V6, V8, V9, V10
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

function scramblePickFromSets(q, targetA, targetB) {
  const setA = [...q.setA];
  const setB = [...q.setB];
  const correctA = setA[0];
  const correctB = setB[0];
  setA.splice(0, 1);
  setA.splice(targetA, 0, correctA);
  setB.splice(0, 1);
  setB.splice(targetB, 0, correctB);
  return { ...q, setA, setB, correctPair: [targetA, targetB] };
}

const MC_POSITIONS = [2,4,1,3,0,2,4,1,3,0,2,4,1,3,0,2,4,1,3,0,2,4,1,3,0,2,4,1,3,0];
const PAIR_A =       [0,0,0,1,1,1,2,2,2,0,0,0,1,1,1,2,2,2,0,0,0,1,1,1,2,2,2,0,0,0];
const PAIR_B =       [0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2];

// ===== V6 =========================================================
const v6Raw = [
  {id:126,difficulty:1,question:"Which letters complete the missing word in this sentence?\n\nDaisy felt very HA_ _ _ when she opened her birthday present.",options:["PPY","RDY","STY","ZEL","ZED"],correct:0,explanation:"The answer is PPY, making HAPPY. The sentence is about opening a birthday present, so 'happy' fits perfectly. HARDY, HASTY, HAZEL and HAZED are real words but don't make sense here. ✓"},
  {id:127,difficulty:1,question:"Which letters complete the missing word in this sentence?\n\nThe sun was shining and the sky was very BR_ _ _ T.",options:["IGH","EAS","ASS","AIN","ICK"],correct:0,explanation:"The answer is IGH, making BRIGHT. The sentence talks about a sunny sky, so 'bright' makes sense. BREAST, BRASST, BRAINT and BRICKT either don't fit or aren't real words. ✓"},
  {id:128,difficulty:1,question:"Which letters complete the missing word in this sentence?\n\nWe took the dog for a long WA_ _ in the park.",options:["LK","SH","RD","NT","VE"],correct:0,explanation:"The answer is LK, making WALK. You take a dog for a 'walk' in the park. WASH, WARD, WANT and WAVE are real words but don't fit this sentence. ✓"},
  {id:129,difficulty:1,question:"Which letters complete the missing word in this sentence?\n\nJake was so TI_ _ _ that he fell asleep on the sofa.",options:["RED","DAL","GER","MED","PED"],correct:0,explanation:"The answer is RED, making TIRED. Falling asleep on the sofa tells you he was 'tired'. TIDAL, TIGER, TIMED and TIPED don't fit. ✓"},
  {id:130,difficulty:1,question:"Which letters complete the missing word in this sentence?\n\nEvie poured cold milk into her bowl of CER_ _ _.",options:["EAL","TAIN","AMIC","EBRO","OUSE"],correct:0,explanation:"The answer is EAL, making CEREAL. You eat cereal with milk in a bowl. CERTAIN and CERAMIC are real words but don't fit, and CEREBRO/CEROUSE aren't standard English words. ✓"},
  {id:131,difficulty:1,question:"Which letters complete the missing word in this sentence?\n\nThe children played in the GAR_ _ _ until it got dark.",options:["DEN","LIC","BLE","ISH","GLE"],correct:0,explanation:"The answer is DEN, making GARDEN. Children play in a 'garden' before dark. GARLIC, GARBLE, GARISH and GARGLE are real words but don't fit the sentence. ✓"},
  {id:132,difficulty:1,question:"Which letters complete the missing word in this sentence?\n\nPriya wrote her name carefully at the top of the PAP_ _.",options:["ER","AL","AS","OE","UM"],correct:0,explanation:"The answer is ER, making PAPER. You write your name on 'paper'. PAPAL is a real word, and the others don't form sensible words here. ✓"},
  {id:133,difficulty:1,question:"Which letters complete the missing word in this sentence?\n\nMarcus kicked the FOO_ _ _ _ _ straight into the goal.",options:["TBALL","TPATH","TWEAR","THILL","TSORE"],correct:0,explanation:"The answer is TBALL, making FOOTBALL. You kick a 'football' into a goal. FOOTPATH, FOOTWEAR, FOOTHILL and FOOTSORE are real words but don't fit. ✓"},
  {id:134,difficulty:1,question:"Which letters complete the missing word in this sentence?\n\nFinn opened his umbrella because it had started to RA_ _.",options:["IN","CE","GE","KE","ID"],correct:0,explanation:"The answer is IN, making RAIN. You open an umbrella when it starts to 'rain'. RACE, RAGE, RAKE and RAID are real words but don't make sense in this sentence. ✓"},
  {id:135,difficulty:1,question:"Which letters complete the missing word in this sentence?\n\nThe baby SMI_ _ _ when she saw her grandma.",options:["LED","THY","RKS","TES","DGE"],correct:0,explanation:"The answer is LED, making SMILED. A baby 'smiled' when she saw her grandma. SMITHY is a real word (a blacksmith's workshop), and SMIRKS doesn't fit a happy baby. ✓"},
  {id:136,difficulty:2,question:"Which letters complete the missing word in this sentence?\n\nThe museum trip was organised by the history DEP_ _ _ _ _ NT.",options:["ARTME","ENDEN","OSITI","LETIO","RIVAT"],correct:0,explanation:"The answer is ARTME, making DEPARTMENT. Trips are organised by a 'department'. DEPENDENT, DEPOSITION, DEPLETION and DEPRIVATION are real words but don't fit. ✓"},
  {id:137,difficulty:2,question:"Which letters complete the missing word in this sentence?\n\nAisha read the INST_ _ _ _ _ ONS carefully before starting the puzzle.",options:["RUCTI","ALLAT","IGATI","RUMEN","ANTAN"],correct:0,explanation:"The answer is RUCTI, making INSTRUCTIONS. You read 'instructions' before starting a puzzle. INSTALLATIONS and INSTIGATIONS are real words but don't fit. ✓"},
  {id:138,difficulty:2,question:"Which letters complete the missing word in this sentence?\n\nThe teacher gave a clear EXPL_ _ _ _ _ ON of the maths problem.",options:["ANATI","OSITI","OITAT","ORATI","ICATI"],correct:0,explanation:"The answer is ANATI, making EXPLANATION. Teachers give an 'explanation' of a problem. EXPLORATION is real but doesn't fit the gap. Only EXPLANATION works. ✓"},
  {id:139,difficulty:2,question:"Which letters complete the missing word in this sentence?\n\nCharlie made a small MIST_ _ _ in his spelling test but corrected it quickly.",options:["AKE","RAL","OOK","IER","ESS"],correct:0,explanation:"The answer is AKE, making MISTAKE. You make a 'mistake' in a spelling test. MISTRAL, MISTOOK, MISTIER and MISTRESS are real words but don't fit. ✓"},
  {id:140,difficulty:2,question:"Which letters complete the missing word in this sentence?\n\nThe doctor examined the PAT_ _ _ T very carefully.",options:["IEN","TER","ROL","HWA","ROY"],correct:0,explanation:"The answer is IEN, making PATIENT. Doctors examine a 'patient'. PATROL and the others don't form valid words with the ending T here. ✓"},
  {id:141,difficulty:2,question:"Which letters complete the missing word in this sentence?\n\nThe library was so QUI_ _ that you could hear a pin drop.",options:["ET","CK","LL","TE","RK"],correct:0,explanation:"The answer is ET, making QUIET. Libraries are 'quiet' — quiet enough to hear a pin drop. QUICK, QUILL, QUITE and QUIRK are real words but don't fit this sentence. ✓"},
  {id:142,difficulty:2,question:"Which letters complete the missing word in this sentence?\n\nDaisy followed the recipe to bake a delicious choc_ _ _ TE cake.",options:["OLA","LAT","LIK","REL","ORE"],correct:0,explanation:"The answer is OLA, making CHOCOLATE. You bake a 'chocolate' cake. The other options don't form real words here. ✓"},
  {id:143,difficulty:2,question:"Which letters complete the missing word in this sentence?\n\nOliver was AMBI_ _ _ _ S and wanted to become a doctor when he grew up.",options:["TIOU","VALE","GUOU","ENCE","ENTL"],correct:0,explanation:"The answer is TIOU, making AMBITIOUS. Wanting to become a doctor shows you are 'ambitious'. AMBIVALENT is real but doesn't end in S, and AMBIGUOUS means unclear. Only AMBITIOUS works. ✓"},
  {id:144,difficulty:2,question:"Which letters complete the missing word in this sentence?\n\nThe magician's TR_ _ _ amazed everyone in the audience.",options:["ICK","AIL","OUT","AMP","IBE"],correct:0,explanation:"The answer is ICK, making TRICK. A magician performs a 'trick' that amazes the audience. TRAIL, TROUT, TRAMP and TRIBE are real words but don't fit. ✓"},
  {id:145,difficulty:2,question:"Which letters complete the missing word in this sentence?\n\nJake's grandfather told an ENT_ _ _ _ _ _ NG story about his childhood in Cornwall.",options:["ERTAI","ITLEM","RUSTI","RANCI","HRALI"],correct:0,explanation:"The answer is ERTAI, making ENTERTAINING. A good story is 'entertaining'. ENTITLEMENT and ENTRUSTING are real but don't match the gap length. Only ENTERTAINING fits. ✓"},
  {id:146,difficulty:3,question:"Which letters complete the missing word in this sentence?\n\nThe REN_ _ _ _ _ ON of the old town hall took nearly two years to complete.",options:["OVATI","UNCIA","DERIN","DEZVO","OWNED"],correct:0,explanation:"The answer is OVATI, making RENOVATION. Restoring an old building takes a 'renovation'. RENUNCIATION and RENDERING are real but don't fit the gap or context. ✓"},
  {id:147,difficulty:3,question:"Which letters complete the missing word in this sentence?\n\nMarcus felt APP_ _ _ _ _ _ _ VE about his first day at the new school.",options:["REHENSI","RECIATI","ROACHIN","ROPRIAT","ALLINGL"],correct:0,explanation:"The answer is REHENSI, making APPREHENSIVE. Feeling nervous about a new school is being 'apprehensive'. APPRECIATIVE and APPROPRIATE are real but don't fit the meaning of nervousness. ✓"},
  {id:148,difficulty:3,question:"Which letters complete the missing word in this sentence?\n\nThe scientist conducted a careful EXP_ _ _ _ _ _ NT in the laboratory.",options:["ERIME","ONENT","LOITM","ENDAB","ANSIO"],correct:0,explanation:"The answer is ERIME, making EXPERIMENT. Scientists conduct an 'experiment' in a laboratory. EXPONENT is a real word but doesn't fit. ✓"},
  {id:149,difficulty:3,question:"Which letters complete the missing word in this sentence?\n\nThe judge listened to the witness's TEST_ _ _ _ _ before making a decision.",options:["IMONY","IFIES","ABLES","OSTER","AMENT"],correct:0,explanation:"The answer is IMONY, making TESTIMONY. A witness gives 'testimony' in court. TESTIFIES doesn't fit the gap shape, and TESTAMENT means a will. ✓"},
  {id:150,difficulty:3,question:"Which letters complete the missing word in this sentence?\n\nEvie's curiosity was UN_ _ _ _ _ _ _ BLE — she had to know how the trick worked.",options:["QUENCHA","DERSTAN","RAVELLI","FORTUNE","EXPECTE"],correct:0,explanation:"The answer is QUENCHA, making UNQUENCHABLE. Curiosity that can't be satisfied is 'unquenchable'. UNDERSTANDABLE, UNRAVELLING, UNFORTUNATE and UNEXPECTED are all real but don't carry this meaning. ✓"},
  {id:151,difficulty:3,question:"Which letters complete the missing word in this sentence?\n\nThe ancient manuscript was almost INDE_ _ _ _ _ _ _ _ LE — the writing had faded over the centuries.",options:["CIPHERAB","PENDABLE","FATIGABL","STRUCTAB","SCRIBABL"],correct:0,explanation:"The answer is CIPHERAB, making INDECIPHERABLE. Faded writing that can't be read is 'indecipherable'. INDESTRUCTIBLE and INDESCRIBABLE are real but don't match the meaning of unreadable. ✓"},
  {id:152,difficulty:3,question:"Which letters complete the missing word in this sentence?\n\nThe athlete's performance was EXC_ _ _ _ _ _ AL — no one had ever run that fast before.",options:["EPTION","AVATIO","RUCIAT","LAMATO","LUSIVI"],correct:0,explanation:"The answer is EPTION, making EXCEPTIONAL. A record-breaking performance is 'exceptional'. EXCAVATIONAL and EXCRUCIATAL aren't real, and EXCLAMATORY doesn't end in -AL. ✓"},
  {id:153,difficulty:3,question:"Which letters complete the missing word in this sentence?\n\nPriya gave a PER_ _ _ _ _ _ VE argument that convinced the whole class to change their minds.",options:["SUASI","CEPTI","FORMA","SISTE","MANEN"],correct:0,explanation:"The answer is SUASI, making PERSUASIVE. An argument that convinces people is 'persuasive'. PERCEPTIVE, PERSISTENT and PERMANENT are real but don't mean 'convincing'. ✓"},
  {id:154,difficulty:3,question:"Which letters complete the missing word in this sentence?\n\nThe view from the mountain top was BR_ _ _ _ _ _ _ _ NG — Finn had never seen anything like it.",options:["EATHTAKI","OADCASTI","ANDISHIN","ISTLINGL","ANCHINGT"],correct:0,explanation:"The answer is EATHTAKI, making BREATHTAKING. A stunning view is 'breathtaking'. BROADCASTING and BRANDISHING are real words but don't match the awe-inspiring meaning. ✓"},
  {id:155,difficulty:3,question:"Which letters complete the missing word in this sentence?\n\nThe detective found a CON_ _ _ _ _ _ G clue that finally solved the mystery.",options:["VINCIN","DEMNIN","FRONTI","STRAIN","STITUT"],correct:0,explanation:"The answer is VINCIN, making CONVINCING. A clue that solves a mystery is 'convincing'. CONDEMNING, CONFRONTING, CONSTRAINING and CONSTITUTING are all real but don't fit. ✓"}
];

// ===== V8 =========================================================
const v8Raw = [
  {id:126,difficulty:1,setA:["type","sort"],setB:["gentle","caring"],options:["kind","nice","friendly","soft","warm"],correct:0,explanation:"'Kind' fits both groups: a 'kind' of biscuit means a type or sort, and a 'kind' person is gentle and caring. ✓"},
  {id:127,difficulty:1,setA:["lamp","torch"],setB:["not heavy","weightless"],options:["light","bright","glow","feather","shine"],correct:0,explanation:"'Light' fits both groups: a 'light' is a lamp or torch, and something 'light' is not heavy. ✓"},
  {id:128,difficulty:1,setA:["healthy","in good shape"],setB:["water hole","deep shaft"],options:["well","fit","spring","fine","pit"],correct:0,explanation:"'Well' fits both groups: feeling 'well' means healthy, and a 'well' is a deep shaft dug for water. ✓"},
  {id:129,difficulty:1,setA:["perform","act on stage"],setB:["game","fun activity"],options:["play","show","drama","sport","act"],correct:0,explanation:"'Play' fits both groups: to 'play' a character means to perform or act, and a 'play' is also a game or fun activity. ✓"},
  {id:130,difficulty:1,setA:["chilly","frosty"],setB:["sniffles","illness"],options:["cold","freezing","flu","icy","bug"],correct:0,explanation:"'Cold' fits both groups: 'cold' weather is chilly, and catching 'a cold' is an illness with sniffles. ✓"},
  {id:131,difficulty:1,setA:["nasty","unkind"],setB:["signify","stand for"],options:["mean","rude","show","cruel","indicate"],correct:0,explanation:"'Mean' fits both groups: a 'mean' person is nasty or unkind, and 'mean' also means to signify. ✓"},
  {id:132,difficulty:1,setA:["circle","hoop"],setB:["telephone","call"],options:["ring","round","loop","dial","phone"],correct:0,explanation:"'Ring' fits both groups: a 'ring' is a circle or hoop (like a wedding ring), and to 'ring' someone means to telephone them. ✓"},
  {id:133,difficulty:1,setA:["stumble","fall over"],setB:["journey","outing"],options:["trip","tumble","fall","holiday","tour"],correct:0,explanation:"'Trip' fits both groups: to 'trip' means to stumble or fall over, and a school 'trip' is a journey or outing. ✓"},
  {id:134,difficulty:1,setA:["just","even-handed"],setB:["funfair","carnival"],options:["fair","right","equal","show","festival"],correct:0,explanation:"'Fair' fits both groups: a 'fair' decision is just and even-handed, and a 'fair' is also a funfair with rides and stalls. ✓"},
  {id:135,difficulty:1,setA:["remaining","still there"],setB:["opposite of right","port side"],options:["left","rest","extra","side","west"],correct:0,explanation:"'Left' fits both groups: 'two biscuits left' means remaining, and 'turn left' means the opposite of right. ✓"},
  {id:136,difficulty:2,setA:["dog sound","yelp"],setB:["tree skin","outer layer"],options:["bark","howl","wood","growl","shell"],correct:0,explanation:"'Bark' fits both groups: a dog's 'bark' is the loud noise it makes, and a tree's 'bark' is its rough outer skin. ✓"},
  {id:137,difficulty:2,setA:["water flow","stream"],setB:["happening now","present-day"],options:["current","tide","modern","river","recent"],correct:0,explanation:"'Current' fits both groups: a river's 'current' is the flow of water, and 'current' news is happening right now. ✓"},
  {id:138,difficulty:2,setA:["season","after winter"],setB:["leap","jump up"],options:["spring","summer","bounce","hop","April"],correct:0,explanation:"'Spring' fits both groups: 'spring' is the season after winter, and to 'spring' up means to leap suddenly. ✓"},
  {id:139,difficulty:2,setA:["sea swell","breaker"],setB:["greet with hand","signal"],options:["wave","ripple","tide","salute","beckon"],correct:0,explanation:"'Wave' fits both groups: a 'wave' rolls onto the beach, and you 'wave' to a friend with your hand. ✓"},
  {id:140,difficulty:2,setA:["lights a fire","strike-stick"],setB:["game","contest"],options:["match","spark","flame","fixture","round"],correct:0,explanation:"'Match' fits both groups: a 'match' lights a candle, and a football 'match' is a game or contest. ✓"},
  {id:141,difficulty:2,setA:["elephant's nose","snout"],setB:["tree's main stem","trunk-line"],options:["trunk","tusk","branch","snorkel","root"],correct:0,explanation:"'Trunk' fits both groups: an elephant's 'trunk' is its long nose, and a tree's 'trunk' is its main stem. ✓"},
  {id:142,difficulty:2,setA:["fingertip","claw"],setB:["hammer-in","metal pin"],options:["nail","talon","spike","tack","screw"],correct:0,explanation:"'Nail' fits both groups: your fingernail is the hard tip, and a 'nail' is a metal pin you hammer into wood. ✓"},
  {id:143,difficulty:2,setA:["pond bird","quacks"],setB:["dodge","duck down"],options:["duck","goose","dive","swerve","swan"],correct:0,explanation:"'Duck' fits both groups: a 'duck' is a bird that quacks, and to 'duck' means to dodge or lower your head. ✓"},
  {id:144,difficulty:2,setA:["flying mammal","cave creature"],setB:["cricket equipment","sports club"],options:["bat","owl","racket","stick","mole"],correct:0,explanation:"'Bat' fits both groups: a 'bat' is a flying mammal, and a 'bat' is the wooden stick used in cricket. ✓"},
  {id:145,difficulty:2,setA:["sea creature","ocean mammal"],setB:["close tightly","seal shut"],options:["seal","dolphin","fasten","shut","whale"],correct:0,explanation:"'Seal' fits both groups: a 'seal' is a sea creature, and to 'seal' an envelope means to close it tightly. ✓"},
  {id:146,difficulty:3,setA:["carry","endure"],setB:["large mammal","forest creature"],options:["bear","lion","hold","suffer","wolf"],correct:0,explanation:"'Bear' fits both groups: to 'bear' a heavy load means to carry or endure, and a 'bear' is a large furry mammal. ✓"},
  {id:147,difficulty:3,setA:["soak","infuse"],setB:["sharply inclined","very steep slope"],options:["steep","drench","high","dunk","sheer"],correct:0,explanation:"'Steep' fits both groups: to 'steep' a tea bag means to soak it, and a 'steep' hill is sharply inclined. ✓"},
  {id:148,difficulty:3,setA:["sprint","race off"],setB:["short line","punctuation stroke"],options:["dash","rush","comma","hyphen","sprint"],correct:0,explanation:"'Dash' fits both groups: to 'dash' means to sprint, and a 'dash' is a short line of punctuation (—). ✓"},
  {id:149,difficulty:3,setA:["throw","fling"],setB:["actors in a play","performers"],options:["cast","hurl","troupe","lob","crew"],correct:0,explanation:"'Cast' fits both groups: to 'cast' a fishing line means to throw it, and the 'cast' of a play is the group of actors. ✓"},
  {id:150,difficulty:3,setA:["arrange documents","store records"],setB:["smoothing tool","metal rasp"],options:["file","sort","stack","buff","polish"],correct:0,explanation:"'File' fits both groups: to 'file' papers means to arrange them, and a 'file' is a metal tool for smoothing rough edges. ✓"},
  {id:151,difficulty:3,setA:["serious","solemn"],setB:["burial place","tombstone spot"],options:["grave","stern","tomb","severe","vault"],correct:0,explanation:"'Grave' fits both groups: a 'grave' situation is serious or solemn, and a 'grave' is a burial place in a cemetery. ✓"},
  {id:152,difficulty:3,setA:["mixture","blended substance"],setB:["enclosed area","fenced grounds"],options:["compound","mix","blend","yard","plot"],correct:0,explanation:"'Compound' fits both groups: a chemical 'compound' is a mixture, and a 'compound' is also an enclosed area with buildings inside. ✓"},
  {id:153,difficulty:3,setA:["mood","state of mind"],setB:["harden metal","strengthen steel"],options:["temper","feeling","anneal","mood","forge"],correct:0,explanation:"'Temper' fits both groups: your 'temper' is your mood, and to 'temper' steel means to harden it by heating and cooling. ✓"},
  {id:154,difficulty:3,setA:["steady","firm"],setB:["horses' building","barn for animals"],options:["stable","secure","barn","solid","shed"],correct:0,explanation:"'Stable' fits both groups: a 'stable' table is steady and firm, and a 'stable' is the building where horses live. ✓"},
  {id:155,difficulty:3,setA:["stay temporarily","put up at"],setB:["small cabin","hunting hut"],options:["lodge","stay","cabin","reside","shelter"],correct:0,explanation:"'Lodge' fits both groups: to 'lodge' with a family means to stay temporarily, and a 'lodge' is a small cabin. ✓"}
];

// ===== V9 =========================================================
const v9Questions = [
  {id:126,difficulty:1,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nhope ( ? ) ends",options:["opes","ends","open","hope","hens"],correct:2,explanation:"Letters 2–3 of hope = 'op'. Letters 1–2 of ends = 'en'. op + en = open. ✓"},
  {id:127,difficulty:1,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nfrog ( ? ) pest",options:["frog","pest","rope","ropes","frop"],correct:2,explanation:"Letters 2–3 of frog = 'ro'. Letters 1–2 of pest = 'pe'. ro + pe = rope. ✓"},
  {id:128,difficulty:1,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nidol ( ? ) melt",options:["idol","melt","dome","demo","idme"],correct:2,explanation:"Letters 2–3 of idol = 'do'. Letters 1–2 of melt = 'me'. do + me = dome. ✓"},
  {id:129,difficulty:1,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\ntrap ( ? ) vent",options:["rave","trap","vent","rapt","trve"],correct:0,explanation:"Letters 2–3 of trap = 'ra'. Letters 1–2 of vent = 've'. ra + ve = rave. ✓"},
  {id:130,difficulty:1,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nafar ( ? ) stay",options:["afar","stay","feat","fast","asst"],correct:3,explanation:"Letters 2–3 of afar = 'fa'. Letters 1–2 of stay = 'st'. fa + st = fast. ✓"},
  {id:131,difficulty:1,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nflat ( ? ) tent",options:["flat","tent","late","tale","flte"],correct:2,explanation:"Letters 2–3 of flat = 'la'. Letters 1–2 of tent = 'te'. la + te = late. ✓"},
  {id:132,difficulty:1,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nblow ( ? ) neat",options:["blow","neat","bone","lone","blne"],correct:3,explanation:"Letters 2–3 of blow = 'lo'. Letters 1–2 of neat = 'ne'. lo + ne = lone. ✓"},
  {id:133,difficulty:1,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nicon ( ? ) menu",options:["icon","menu","come","icme","mice"],correct:2,explanation:"Letters 2–3 of icon = 'co'. Letters 1–2 of menu = 'me'. co + me = come. ✓"},
  {id:134,difficulty:1,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\ntwig ( ? ) deer",options:["twig","deer","wide","weed","twde"],correct:2,explanation:"Letters 2–3 of twig = 'wi'. Letters 1–2 of deer = 'de'. wi + de = wide. ✓"},
  {id:135,difficulty:1,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nclap ( ? ) mesh",options:["clap","mesh","lame","male","clme"],correct:2,explanation:"Letters 2–3 of clap = 'la'. Letters 1–2 of mesh = 'me'. la + me = lame. ✓"},
  {id:136,difficulty:2,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\namid ( ? ) rest",options:["amid","rest","mire","rime","amre"],correct:2,explanation:"Letters 2–3 of amid = 'mi'. Letters 1–2 of rest = 're'. mi + re = mire (meaning mud or to get stuck). ✓"},
  {id:137,difficulty:2,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nsmog ( ? ) demo",options:["smog","demo","mode","dome","smde"],correct:2,explanation:"Letters 2–3 of smog = 'mo'. Letters 1–2 of demo = 'de'. mo + de = mode. ✓"},
  {id:138,difficulty:2,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\namen ( ? ) team",options:["amen","team","meet","mete","amte"],correct:3,explanation:"Letters 2–3 of amen = 'me'. Letters 1–2 of team = 'te'. me + te = mete (to give out, as in 'mete out punishment'). ✓"},
  {id:139,difficulty:2,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nbird ( ? ) isle",options:["bird","isle","rise","iris","biis"],correct:3,explanation:"Letters 2–3 of bird = 'ir'. Letters 1–2 of isle = 'is'. ir + is = iris (a flower, or part of the eye). ✓"},
  {id:140,difficulty:2,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nblot ( ? ) rein",options:["blot","rein","role","lore","blre"],correct:3,explanation:"Letters 2–3 of blot = 'lo'. Letters 1–2 of rein = 're'. lo + re = lore (traditional knowledge or stories). ✓"},
  {id:141,difficulty:2,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nsnow ( ? ) deaf",options:["snow","deaf","done","node","snde"],correct:3,explanation:"Letters 2–3 of snow = 'no'. Letters 1–2 of deaf = 'de'. no + de = node (a point or joining place). ✓"},
  {id:142,difficulty:2,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nsnob ( ? ) tens",options:["snob","tens","tone","note","snte"],correct:3,explanation:"Letters 2–3 of snob = 'no'. Letters 1–2 of tens = 'te'. no + te = note. ✓"},
  {id:143,difficulty:2,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nspat ( ? ) germ",options:["spat","germ","gape","page","spge"],correct:3,explanation:"Letters 2–3 of spat = 'pa'. Letters 1–2 of germ = 'ge'. pa + ge = page. ✓"},
  {id:144,difficulty:3,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nebony ( ? ) debt",options:["ebony","debt","bode","bond","ebde"],correct:2,explanation:"Letters 2–3 of ebony = 'bo'. Letters 1–2 of debt = 'de'. bo + de = bode (to be a sign of something to come). ✓"},
  {id:145,difficulty:3,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\navid ( ? ) lean",options:["avid","lean","live","vile","avle"],correct:3,explanation:"Letters 2–3 of avid = 'vi'. Letters 1–2 of lean = 'le'. vi + le = vile (extremely unpleasant). ✓"},
  {id:146,difficulty:3,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nsmug ( ? ) tear",options:["smug","tear","tame","mute","smte"],correct:3,explanation:"Letters 2–3 of smug = 'mu'. Letters 1–2 of tear = 'te'. mu + te = mute (silent). ✓"},
  {id:147,difficulty:3,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nprim ( ? ) feat",options:["prim","feat","fire","rife","prfe"],correct:3,explanation:"Letters 2–3 of prim = 'ri'. Letters 1–2 of feat = 'fe'. ri + fe = rife (widespread, very common). ✓"},
  {id:148,difficulty:3,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nusage ( ? ) gene",options:["usage","gene","ages","sage","usne"],correct:3,explanation:"Letters 2–3 of usage = 'sa'. Letters 1–2 of gene = 'ge'. sa + ge = sage (a wise person, or a herb). ✓"},
  {id:149,difficulty:3,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nidol ( ? ) zero",options:["idol","zero","zone","doze","idze"],correct:3,explanation:"Letters 2–3 of idol = 'do'. Letters 1–2 of zero = 'ze'. do + ze = doze (to sleep lightly). ✓"},
  {id:150,difficulty:3,question:"Complete the third pair using the same hidden-word rule:\nfrog (rode) dent\nslim (lime) medal\nedit ( ? ) redo",options:["edit","redo","ride","dire","edre"],correct:3,explanation:"Letters 2–3 of edit = 'di'. Letters 1–2 of redo = 're'. di + re = dire (extremely serious or urgent). ✓"}
];

// ===== V10 =========================================================
const v10Raw = [
  {id:146,d:1,setA:["sun","candle","torch"],setB:["shine","blaze","spark"],expl:"sun + shine = sunshine. Sunshine is the light and warmth that comes from the sun. ✓"},
  {id:147,d:1,setA:["fire","log","ash"],setB:["place","tongs","shovel"],expl:"fire + place = fireplace. A fireplace is the open area in a wall where you light a fire indoors. ✓"},
  {id:148,d:1,setA:["foot","knee","shin"],setB:["path","guard","pad"],expl:"foot + path = footpath. A footpath is a narrow path for people to walk along. ✓"},
  {id:149,d:1,setA:["play","swing","slide"],setB:["ground","post","rail"],expl:"play + ground = playground. A playground is an outdoor area for children to play. ✓"},
  {id:150,d:1,setA:["rail","bus","boat"],setB:["way","lane","route"],expl:"rail + way = railway. A railway is the track that trains travel along. ✓"},
  {id:151,d:1,setA:["finger","wrist","elbow"],setB:["nail","tack","pin"],expl:"finger + nail = fingernail. Your fingernail is the hard covering at the tip of your finger. ✓"},
  {id:152,d:1,setA:["sea","brook","lake"],setB:["weed","moss","reed"],expl:"sea + weed = seaweed. Seaweed is the green or brown plant that grows in the sea. ✓"},
  {id:153,d:1,setA:["bath","shower","basin"],setB:["tub","spout","tap"],expl:"bath + tub = bathtub. A bathtub is the large container you sit in to take a bath. ✓"},
  {id:154,d:1,setA:["bird","wasp","rabbit"],setB:["cage","swarm","burrow"],expl:"bird + cage = birdcage. A birdcage is the wire enclosure where a pet bird is kept. ✓"},
  {id:155,d:1,setA:["pop","candy","jelly"],setB:["corn","stick","tart"],expl:"pop + corn = popcorn. Popcorn is corn kernels that puff up when heated. ✓"},
  {id:156,d:2,setA:["earth","soil","clay"],setB:["quake","tremor","shudder"],expl:"earth + quake = earthquake. An earthquake is a sudden, violent shaking of the ground. ✓"},
  {id:157,d:2,setA:["water","stream","lake"],setB:["melon","berry","plum"],expl:"water + melon = watermelon. A watermelon is a large green fruit with red flesh and black seeds. ✓"},
  {id:158,d:2,setA:["jelly","custard","syrup"],setB:["fish","tart","pot"],expl:"jelly + fish = jellyfish. A jellyfish is a sea creature with a soft, see-through body and trailing tentacles. ✓"},
  {id:159,d:2,setA:["honey","treacle","syrup"],setB:["moon","tin","jug"],expl:"honey + moon = honeymoon. A honeymoon is the holiday a newly married couple takes together. ✓"},
  {id:160,d:2,setA:["match","torch","lantern"],setB:["box","tray","rack"],expl:"match + box = matchbox. A matchbox is the small box that holds matches for lighting fires. ✓"},
  {id:161,d:2,setA:["wheel","engine","saddle"],setB:["barrow","valve","buckle"],expl:"wheel + barrow = wheelbarrow. A wheelbarrow is a small cart with one wheel used for carrying things in the garden. ✓"},
  {id:162,d:2,setA:["wind","storm","gale"],setB:["mill","rumble","blast"],expl:"wind + mill = windmill. A windmill is a tall building with sails that turn in the wind to grind grain or make power. ✓"},
  {id:163,d:2,setA:["pan","wok","skillet"],setB:["cake","spout","rim"],expl:"pan + cake = pancake. A pancake is a thin, flat cake made from batter and fried in a pan. ✓"},
  {id:164,d:2,setA:["green","yellow","purple"],setB:["house","shed","barn"],expl:"green + house = greenhouse. A greenhouse is a glass building used for growing plants. ✓"},
  {id:165,d:2,setA:["sand","mud","gravel"],setB:["castle","fort","tower"],expl:"sand + castle = sandcastle. A sandcastle is a model castle built from sand at the beach. ✓"},
  {id:166,d:3,setA:["car","lorry","wagon"],setB:["pet","mat","rug"],expl:"car + pet = carpet. A carpet is the thick fabric that covers a floor — nothing to do with cars or pets! ✓"},
  {id:167,d:3,setA:["mush","fun","toad"],setB:["room","hall","burrow"],expl:"mush + room = mushroom. A mushroom is a small fungus — nothing to do with mush or rooms! ✓"},
  {id:168,d:3,setA:["car","tram","barge"],setB:["toon","fare","deck"],expl:"car + toon = cartoon. A cartoon is an animated film or drawing — the spelling hides 'car' and 'toon'. ✓"},
  {id:169,d:3,setA:["mess","muddle","scrap"],setB:["age","year","patch"],expl:"mess + age = message. A message is information sent from one person to another. ✓"},
  {id:170,d:3,setA:["man","lord","duke"],setB:["age","rule","reign"],expl:"man + age = manage. To manage means to be in charge of something. ✓"},
  {id:171,d:3,setA:["cab","taxi","coach"],setB:["in","out","by"],expl:"cab + in = cabin. A cabin is a small wooden hut or the inside of a plane. ✓"},
  {id:172,d:3,setA:["pig","cow","sheep"],setB:["eon","era","epoch"],expl:"pig + eon = pigeon. A pigeon is a common grey bird — nothing to do with pigs or time periods! ✓"},
  {id:173,d:3,setA:["bar","bee","ant"],setB:["gain","win","prize"],expl:"bar + gain = bargain. A bargain is something bought for less than its usual price. ✓"},
  {id:174,d:3,setA:["car","van","bus"],setB:["go","trip","fare"],expl:"car + go = cargo. Cargo is the goods carried by a ship, plane or lorry. ✓"},
  {id:175,d:3,setA:["par","duke","earl"],setB:["don","rule","lord"],expl:"par + don = pardon. To pardon someone means to forgive them. ✓"}
];

const qText = "Find two words, one from each group, that join together to make a new word. The word from the first group always comes first.";

// Apply scrambling
const v6Questions = v6Raw.map((q, i) => scrambleMC(q, MC_POSITIONS[i]));
const v8Questions = v8Raw.map((raw, i) => {
  const {setA, setB, ...rest} = raw;
  return scrambleMC({
    ...rest,
    question: `Find one word that fits BOTH meaning groups.\n\nGroup 1: ${setA.join(', ')}\nGroup 2: ${setB.join(', ')}`
  }, MC_POSITIONS[i]);
});
const v10Questions = v10Raw.map((raw, i) => {
  const {d, expl, ...rest} = raw;
  const scrambled = scramblePickFromSets({...rest, correctPair:[0,0]}, PAIR_A[i], PAIR_B[i]);
  return { ...scrambled, difficulty: d, questionType: "pick-from-sets", question: qText, explanation: expl };
});

// Format as JS object string (for inserting into vrData.js)
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

function buildInsertBlock(questions, indent) {
  return questions.map(q => qToJS(q, indent)).join(',\n');
}

// ===== Insert into vrData.js =====
const vrDataPath = path.join(__dirname, '../src/questionData/vrData.js');
let src = fs.readFileSync(vrDataPath, 'utf8');
const lines = src.split('\n');

// Helper: insert lines after a target line (1-indexed)
// We insert from BOTTOM to TOP to preserve line numbers
function insertAfterLine(lines, lineNum, newContent) {
  // lineNum is 1-indexed
  lines.splice(lineNum, 0, ',', newContent);
  return lines;
}

// Build question blocks (10-space indent to match file style)
const v6Block = buildInsertBlock(v6Questions, 10);
const v8Block = buildInsertBlock(v8Questions, 10);
const v9Block = buildInsertBlock(v9Questions, 10);
const v10Block = buildInsertBlock(v10Questions, 10);

// Insertion points (0-indexed for splice):
// wordCodeAnalogies ID 125 ends at line 15780 → 0-indexed: 15779
// missingLettersWords ID 125 ends at line 9264 → 0-indexed: 9263
// compoundWords ID 145 ends at line 6092 → 0-indexed: 6091
// synonyms ID 125 ends at line 1261 → 0-indexed: 1260

// Insert bottom to top to preserve line numbers
// 1. wordCodeAnalogies (line 15780, 0-indexed 15779)
lines.splice(15779 + 1, 0, ',' + '\n' + v9Block);

// 2. missingLettersWords (line 9264, 0-indexed 9263)
lines.splice(9263 + 1, 0, ',' + '\n' + v6Block);

// 3. compoundWords (line 6092, 0-indexed 6091)
lines.splice(6091 + 1, 0, ',' + '\n' + v10Block);

// 4. synonyms (line 1261, 0-indexed 1260)
lines.splice(1260 + 1, 0, ',' + '\n' + v8Block);

const newSrc = lines.join('\n');
fs.writeFileSync(vrDataPath, newSrc);
console.log('vrData.js updated');

// ===== Verify counts =====
const newSrc2 = fs.readFileSync(vrDataPath, 'utf8');
const topics = {
  synonyms: { start: 'synonyms: {', nextStart: 'antonyms: {' },
  missingLettersWords: { start: 'missingLettersWords: {', nextStart: 'letterCodes: {' },
  compoundWords: { start: 'compoundWords: {', nextStart: 'hiddenWords: {' },
  wordCodeAnalogies: { start: 'wordCodeAnalogies: {', nextStart: 'numberWordCodes: {' }
};

for (const [topic, {start, nextStart}] of Object.entries(topics)) {
  const s = newSrc2.indexOf(start);
  const e = newSrc2.indexOf(nextStart, s);
  const block = newSrc2.slice(s, e);
  const count = (block.match(/^\s+id: \d+,/gm) || []).length;
  const maxId = Math.max(...[...block.matchAll(/^\s+id: (\d+),/gm)].map(m => parseInt(m[1])));
  console.log(topic + ': ' + count + ' questions, max ID = ' + maxId);
}

// ===== Update vr-question-lesson-map.json =====
const mapPath = path.join(__dirname, '../public/vr-question-lesson-map.json');
const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

// V6: missingLettersWords IDs 126-155 → sentence-context-missing
for (let i = 126; i <= 155; i++) {
  map.missingLettersWords.push({ questionId: i, subConceptId: 'sentence-context-missing', confidence: 'high' });
}

// V8: synonyms IDs 126-155 → polyseme-synonyms
for (let i = 126; i <= 155; i++) {
  map.synonyms.push({ questionId: i, subConceptId: 'polyseme-synonyms', confidence: 'high' });
}

// V9: wordCodeAnalogies IDs 126-150 → word-extraction
for (let i = 126; i <= 150; i++) {
  map.wordCodeAnalogies.push({ questionId: i, subConceptId: 'word-extraction', confidence: 'high' });
}

// V10: compoundWords IDs 146-175 → gl-compound-pairs
for (let i = 146; i <= 175; i++) {
  map.compoundWords.push({ questionId: i, subConceptId: 'gl-compound-pairs', confidence: 'high' });
}

fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
console.log('vr-question-lesson-map.json updated');
console.log('synonyms map entries:', map.synonyms.length);
console.log('missingLettersWords map entries:', map.missingLettersWords.length);
console.log('wordCodeAnalogies map entries:', map.wordCodeAnalogies.length);
console.log('compoundWords map entries:', map.compoundWords.length);

// Spot check V10 scrambling
console.log('\nV10 compound spot checks:');
[0,3,6,9].forEach(i => {
  const q = v10Questions[i];
  const compound = q.setA[q.correctPair[0]] + '+' + q.setB[q.correctPair[1]];
  console.log(' ID', q.id, ':', compound, '| pair:', JSON.stringify(q.correctPair));
});

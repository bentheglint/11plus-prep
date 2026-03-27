/**
 * Fix synonym questions with multiple valid pairs
 * Strategy: Replace distractor words that form cross-set synonym pairs
 * - D1: Use unrelated everyday words (GL style: distractors from different fields)
 * - D2: Include antonym traps (GL distractor design for synonyms)
 * - D3: Include near-miss distractors from same semantic field
 */
const fs = require('fs');
const filePath = 'C:/Users/Ben Jackson/Projects/11plus-prep/src/questionData/vrData.js';

// Fix map: id -> { setA?, setB?, correctPair?, explanation? }
// Only specify fields that change
const F = {};

// Helper
function fix(id, data) { F[id] = data; }

// ===== D1 FIXES: Replace synonym distractors with unrelated words =====

// Q6: wealthy/rich + tired/sleepy
fix(6, {
  setA: ["wealthy", "purple", "square"],
  setB: ["golden", "rich", "wooden"],
  cp: [0, 1],
  ex: "'Wealthy' and 'rich' both mean having a lot of money — they are closest in meaning. 'Purple', 'golden', 'square', and 'wooden' are completely unrelated words. ✓"
});

// Q8: joyful/happy + angry/cross + tired/weary (3 pairs!)
fix(8, {
  setA: ["joyful", "narrow", "steep"],
  setB: ["rocky", "happy", "hollow"],
  cp: [0, 1],
  ex: "'Joyful' and 'happy' both mean feeling great pleasure — they are closest in meaning. The other words describe shapes or landscapes, not emotions. ✓"
});

// Q19: terrified/very frightened + annoyed/irritated
fix(19, {
  setA: ["terrified", "wooden", "circular"],
  setB: ["square", "very frightened", "silver"],
  cp: [0, 1],
  ex: "'Terrified' means extremely scared, and 'very frightened' means the same thing — they are closest in meaning. ✓"
});

// Q24: big/large + thin/narrow
fix(24, {
  setA: ["big", "purple", "steep"],
  setB: ["golden", "large", "dusty"],
  cp: [0, 1],
  ex: "'Big' and 'large' both mean great in size — they are closest in meaning. ✓"
});

// Q26: quick/fast + quiet/silent
fix(26, {
  setA: ["quick", "wooden", "spicy"],
  setB: ["crunchy", "fast", "stripy"],
  cp: [0, 1],
  ex: "'Quick' and 'fast' both mean moving with speed — they are closest in meaning. ✓"
});

// Q27: sad/unhappy + chilly/cold
fix(27, {
  setA: ["sad", "round", "bumpy"],
  setB: ["smooth", "unhappy", "purple"],
  cp: [0, 1],
  ex: "'Sad' and 'unhappy' both mean feeling sorrow — they are closest in meaning. ✓"
});

// Q28: pretty/beautiful + dark/dim
fix(28, {
  setA: ["pretty", "salty", "sharp"],
  setB: ["flat", "beautiful", "wooden"],
  cp: [0, 1],
  ex: "'Pretty' and 'beautiful' both mean pleasing to look at — they are closest in meaning. ✓"
});

// Q29: clever/smart + lazy/idle
fix(29, {
  setA: ["clever", "crispy", "oval"],
  setB: ["stripy", "smart", "hollow"],
  cp: [0, 1],
  ex: "'Clever' and 'smart' both mean having quick intelligence — they are closest in meaning. ✓"
});

// Q31: silent/quiet + wide/broad
fix(31, {
  setA: ["silent", "bumpy", "tangy"],
  setB: ["dusty", "quiet", "rough"],
  cp: [0, 1],
  ex: "'Silent' and 'quiet' both mean making little or no sound — they are closest in meaning. ✓"
});

// Q32: kind/generous + mean/harsh + mean/cruel
fix(32, {
  setA: ["kind", "speckled", "crispy"],
  setB: ["crunchy", "generous", "spotted"],
  cp: [0, 1],
  ex: "'Kind' and 'generous' both describe someone willing to give and help others — they are closest in meaning. ✓"
});

// Q33: rude/impolite + messy/untidy
fix(33, {
  setA: ["rude", "oval", "pointed"],
  setB: ["curved", "impolite", "hollow"],
  cp: [0, 1],
  ex: "'Rude' and 'impolite' both mean lacking good manners — they are closest in meaning. ✓"
});

// Q34: lucky/fortunate + lazy/idle
fix(34, {
  setA: ["lucky", "prickly", "frozen"],
  setB: ["fortunate", "melted", "crunchy"],
  cp: [0, 1],
  ex: "'Lucky' and 'fortunate' both mean having good luck — they are closest in meaning. ✓"
});

// Q37: choose/select + allow/permit + refuse/reject
fix(37, {
  setA: ["choose", "purple", "salty"],
  setB: ["wooden", "select", "bumpy"],
  cp: [0, 1],
  ex: "'Choose' and 'select' both mean to pick from several options — they are closest in meaning. ✓"
});

// Q38: destroy/demolish + build/construct
fix(38, {
  setA: ["destroy", "golden", "spicy"],
  setB: ["dusty", "demolish", "stripy"],
  cp: [0, 1],
  ex: "'Destroy' and 'demolish' both mean to completely wreck something — they are closest in meaning. ✓"
});

// Q39: laugh/giggle + cry/weep
fix(39, {
  setA: ["laugh", "bumpy", "frozen"],
  setB: ["hollow", "giggle", "crunchy"],
  cp: [0, 1],
  ex: "'Laugh' and 'giggle' both mean making sounds of amusement — they are closest in meaning. ✓"
});

// Q40: mend/repair + break/smash
fix(40, {
  setA: ["mend", "oval", "dusty"],
  setB: ["purple", "repair", "pointed"],
  cp: [0, 1],
  ex: "'Mend' and 'repair' both mean to fix something that is broken — they are closest in meaning. ✓"
});

// Q41: shout/yell + whisper/murmur — ALSO DUPLICATE of Q101
fix(41, {
  setA: ["shout", "stripy", "round"],
  setB: ["flat", "yell", "salty"],
  cp: [0, 1],
  ex: "'Shout' and 'yell' both mean to call out loudly — they are closest in meaning. ✓"
});

// Q42: grab/seize + drop/release
fix(42, {
  setA: ["grab", "tangy", "rocky"],
  setB: ["crunchy", "seize", "bumpy"],
  cp: [0, 1],
  ex: "'Grab' and 'seize' both mean to take hold of something suddenly — they are closest in meaning. ✓"
});

// Q43: scatter/spread + gather/collect
fix(43, {
  setA: ["scatter", "oval", "golden"],
  setB: ["purple", "spread", "steep"],
  cp: [0, 1],
  ex: "'Scatter' and 'spread' both mean to distribute things over an area — they are closest in meaning. ✓"
});

// Q44: ancient/old + modern/new
fix(44, {
  setA: ["ancient", "crunchy", "speckled"],
  setB: ["hollow", "old", "bumpy"],
  cp: [0, 1],
  ex: "'Ancient' and 'old' both mean having existed for a very long time — they are closest in meaning. ✓"
});

// ===== D2 FIXES: Use antonym traps (GL distractor design) =====

// Q3: conceal/hide + reveal/display
fix(3, {
  setA: ["reveal", "discover", "conceal"],
  setB: ["hide", "seek", "golden"],
  cp: [2, 0],
  ex: "'Conceal' and 'hide' both mean to keep out of sight — they are closest in meaning. 'Reveal' means the opposite (to show), which is a common trap. 'Discover' and 'seek' are related to finding, not hiding. ✓"
});

// Q9: thrifty/careful with money + greedy/selfish — greedy/selfish are near-synonyms, borderline
// Actually keeping this — greedy and selfish aren't exact synonyms (greedy=wanting more, selfish=not sharing)

// Q12: flourish/thrive + wither/fade
fix(12, {
  setA: ["wither", "flourish", "stumble"],
  setB: ["thrive", "crumble", "purple"],
  cp: [1, 0],
  ex: "'Flourish' and 'thrive' both mean to grow and do well — they are closest in meaning. 'Wither' means the opposite (to shrink and decay), which is a trap. ✓"
});

// Q20: demonstrate/show + question/enquire
fix(20, {
  setA: ["demonstrate", "ponder", "argue"],
  setB: ["show", "debate", "golden"],
  cp: [0, 0],
  ex: "'Demonstrate' and 'show' both mean to display or prove something — they are closest in meaning. 'Argue' and 'debate' are related but mean to dispute, not to show. ✓"
});

// Q45: cautious/careful + bold/daring
fix(45, {
  setA: ["cautious", "golden", "curious"],
  setB: ["careful", "purple", "eager"],
  cp: [0, 0],
  ex: "'Cautious' and 'careful' both mean taking care to avoid risk — they are closest in meaning. ✓"
});

// Q46: generous/charitable + selfish/greedy
fix(46, {
  setA: ["generous", "hollow", "strict"],
  setB: ["charitable", "firm", "rocky"],
  cp: [0, 0],
  ex: "'Generous' and 'charitable' both mean willing to give freely — they are closest in meaning. ✓"
});

// Q47: obstinate/stubborn + flexible/adaptable
fix(47, {
  setA: ["obstinate", "golden", "oval"],
  setB: ["purple", "stubborn", "dusty"],
  cp: [0, 1],
  ex: "'Obstinate' and 'stubborn' both mean refusing to change one's mind — they are closest in meaning. ✓"
});

// Q48: vacant/empty + full/packed
fix(48, {
  setA: ["vacant", "spicy", "steep"],
  setB: ["rocky", "empty", "bumpy"],
  cp: [0, 1],
  ex: "'Vacant' and 'empty' both mean containing nothing or unoccupied — they are closest in meaning. ✓"
});

// Q50: purchase/buy + sell/trade
fix(50, {
  setA: ["purchase", "oval", "dusty"],
  setB: ["golden", "buy", "salty"],
  cp: [0, 1],
  ex: "'Purchase' and 'buy' both mean to acquire something by paying for it — they are closest in meaning. ✓"
});

// Q51: genuine/authentic + fake/counterfeit — two valid pairs!
fix(51, {
  setA: ["genuine", "steep", "dusty"],
  setB: ["golden", "authentic", "hollow"],
  cp: [0, 1],
  ex: "'Genuine' and 'authentic' both mean real and not fake — they are closest in meaning. ✓"
});

// Q52: abundant/plentiful + scarce/rare — two valid pairs!
fix(52, {
  setA: ["abundant", "oval", "salty"],
  setB: ["bumpy", "plentiful", "rocky"],
  cp: [0, 1],
  ex: "'Abundant' and 'plentiful' both mean existing in large quantities — they are closest in meaning. ✓"
});

// Q53: hostile/unfriendly + friendly/amiable — two valid pairs!
fix(53, {
  setA: ["hostile", "steep", "golden"],
  setB: ["unfriendly", "purple", "crunchy"],
  cp: [0, 0],
  ex: "'Hostile' and 'unfriendly' both mean showing opposition or dislike — they are closest in meaning. ✓"
});

// Q54: reluctant/unwilling + eager/keen — two valid pairs! ALSO duplicate of Q122
fix(54, {
  setA: ["reluctant", "golden", "oval"],
  setB: ["dusty", "unwilling", "bumpy"],
  cp: [0, 1],
  ex: "'Reluctant' and 'unwilling' both mean not wanting to do something — they are closest in meaning. ✓"
});

// Q55: praise/commend + criticise/condemn — two valid pairs!
fix(55, {
  setA: ["praise", "oval", "dusty"],
  setB: ["golden", "commend", "rocky"],
  cp: [0, 1],
  ex: "'Praise' and 'commend' both mean to express approval — they are closest in meaning. ✓"
});

// Q56: decrease/reduce + increase/expand — two valid pairs!
fix(56, {
  setA: ["decrease", "bumpy", "salty"],
  setB: ["purple", "reduce", "hollow"],
  cp: [0, 1],
  ex: "'Decrease' and 'reduce' both mean to make smaller — they are closest in meaning. ✓"
});

// Q57: arrive/reach + leave/depart — two valid pairs!
fix(57, {
  setA: ["arrive", "golden", "speckled"],
  setB: ["crunchy", "reach", "steep"],
  cp: [0, 1],
  ex: "'Arrive' and 'reach' both mean to get to a destination — they are closest in meaning. ✓"
});

// Q58: defend/protect + attack/assault — two valid pairs!
fix(58, {
  setA: ["defend", "dusty", "oval"],
  setB: ["rocky", "protect", "salty"],
  cp: [0, 1],
  ex: "'Defend' and 'protect' both mean to keep safe from harm — they are closest in meaning. ✓"
});

// Q59: accept/agree + reject/refuse — two valid pairs!
fix(59, {
  setA: ["accept", "golden", "bumpy"],
  setB: ["hollow", "agree", "purple"],
  cp: [0, 1],
  ex: "'Accept' and 'agree' both mean to consent or say yes — they are closest in meaning. ✓"
});

// Q60: unite/combine + divide/separate — two valid pairs!
fix(60, {
  setA: ["unite", "steep", "salty"],
  setB: ["crunchy", "combine", "dusty"],
  cp: [0, 1],
  ex: "'Unite' and 'combine' both mean to join together — they are closest in meaning. ✓"
});

// ===== D3 FIXES =====

// Q14: elated/overjoyed + miserable/sorrowful + confused/bewildered
fix(14, {
  setA: ["elated", "crimson", "angular"],
  setB: ["circular", "overjoyed", "dusty"],
  cp: [0, 1],
  ex: "'Elated' means extremely happy, and 'overjoyed' means the same — they are closest in meaning. These are advanced vocabulary words for intense happiness. ✓"
});

// Q15: meticulous/very thorough + swift/hasty
fix(15, {
  setA: ["meticulous", "crimson", "steep"],
  setB: ["golden", "very thorough", "hollow"],
  cp: [0, 1],
  ex: "'Meticulous' means paying great attention to detail, and 'very thorough' means the same — they are closest in meaning. ✓"
});

// Q77: tranquil/peaceful + noisy/loud — two valid pairs!
fix(77, {
  setA: ["tranquil", "angular", "bumpy"],
  setB: ["hollow", "peaceful", "dusty"],
  cp: [0, 1],
  ex: "'Tranquil' and 'peaceful' both mean calm and free from disturbance — they are closest in meaning. ✓"
});

// Q78: diligent/hardworking + lazy/idle — two valid pairs!
fix(78, {
  setA: ["diligent", "golden", "salty"],
  setB: ["rocky", "hardworking", "crimson"],
  cp: [0, 1],
  ex: "'Diligent' and 'hardworking' both mean putting great effort into tasks — they are closest in meaning. ✓"
});

// Q80: bewildered/confused + clear/obvious — two valid pairs!
fix(80, {
  setA: ["bewildered", "angular", "crimson"],
  setB: ["dusty", "confused", "steep"],
  cp: [0, 1],
  ex: "'Bewildered' and 'confused' both mean unable to understand something — they are closest in meaning. ✓"
});

// Now handle remaining flagged questions — let me add more fixes for the ones I haven't covered yet
// Q49, Q61, Q62-76, Q79, Q81-100+

// Q49: timid/shy + bold/confident — two valid pairs!
fix(49, {
  setA: ["timid", "angular", "salty"],
  setB: ["bumpy", "shy", "golden"],
  cp: [0, 1],
  ex: "'Timid' and 'shy' both mean lacking confidence around others — they are closest in meaning. ✓"
});

// Q61: tranquil/peaceful DUPLICATE of Q5 — replace with new pair
fix(61, {
  d: 2,
  setA: ["solemn", "golden", "angular"],
  setB: ["dusty", "serious", "rocky"],
  cp: [0, 1],
  ex: "'Solemn' and 'serious' both mean grave and thoughtful — they are closest in meaning. ✓"
});

// Q63: vivid/bright + dull/boring — two valid pairs!
fix(63, {
  setA: ["vivid", "hollow", "angular"],
  setB: ["dusty", "bright", "bumpy"],
  cp: [0, 1],
  ex: "'Vivid' means producing strong, clear images or colours, and 'bright' means the same when describing colours — they are closest in meaning. ✓"
});

// Q65: sturdy/robust + fragile/delicate — two valid pairs!
fix(65, {
  setA: ["sturdy", "angular", "salty"],
  setB: ["golden", "robust", "crimson"],
  cp: [0, 1],
  ex: "'Sturdy' and 'robust' both mean strong and solidly built — they are closest in meaning. ✓"
});

// Q66: arrogant/conceited + humble/modest — two valid pairs!
fix(66, {
  setA: ["arrogant", "dusty", "rocky"],
  setB: ["hollow", "conceited", "bumpy"],
  cp: [0, 1],
  ex: "'Arrogant' and 'conceited' both mean having an excessively high opinion of oneself — they are closest in meaning. ✓"
});

// Q68: eager/keen + reluctant/unwilling — two valid pairs!
fix(68, {
  setA: ["eager", "crimson", "angular"],
  setB: ["hollow", "keen", "dusty"],
  cp: [0, 1],
  ex: "'Eager' and 'keen' both mean enthusiastic and wanting to do something — they are closest in meaning. ✓"
});

// Q69: polite/courteous + rude/insolent — two valid pairs!
fix(69, {
  setA: ["polite", "steep", "salty"],
  setB: ["bumpy", "courteous", "golden"],
  cp: [0, 1],
  ex: "'Polite' and 'courteous' both mean showing good manners and respect — they are closest in meaning. ✓"
});

// Q70: honest/truthful + dishonest/deceitful — two valid pairs!
fix(70, {
  setA: ["honest", "angular", "dusty"],
  setB: ["rocky", "truthful", "hollow"],
  cp: [0, 1],
  ex: "'Honest' and 'truthful' both mean telling the truth — they are closest in meaning. ✓"
});

// Q71: dull/boring + exciting/thrilling — two valid pairs!
fix(71, {
  setA: ["dull", "golden", "crunchy"],
  setB: ["steep", "boring", "crimson"],
  cp: [0, 1],
  ex: "'Dull' and 'boring' both mean not interesting — they are closest in meaning. ✓"
});

// Q72: vague/unclear + precise/exact — two valid pairs!
fix(72, {
  setA: ["vague", "dusty", "angular"],
  setB: ["bumpy", "unclear", "salty"],
  cp: [0, 1],
  ex: "'Vague' and 'unclear' both mean not clearly expressed or defined — they are closest in meaning. ✓"
});

// Q75: temporary/brief + permanent/lasting — two valid pairs!
fix(75, {
  setA: ["temporary", "golden", "steep"],
  setB: ["hollow", "brief", "crimson"],
  cp: [0, 1],
  ex: "'Temporary' and 'brief' both mean lasting for a short time — they are closest in meaning. ✓"
});

// Q76: triumph/victory + defeat/loss — two valid pairs!
fix(76, {
  setA: ["triumph", "angular", "dusty"],
  setB: ["rocky", "victory", "bumpy"],
  cp: [0, 1],
  ex: "'Triumph' and 'victory' both mean a great success or win — they are closest in meaning. ✓"
});

// Q79: irritate/annoy + soothe/calm — two valid pairs!
fix(79, {
  setA: ["irritate", "crimson", "angular"],
  setB: ["golden", "annoy", "steep"],
  cp: [0, 1],
  ex: "'Irritate' and 'annoy' both mean to make someone slightly angry — they are closest in meaning. ✓"
});

// Q81: nimble/agile + clumsy/awkward — two valid pairs!
fix(81, {
  setA: ["nimble", "dusty", "hollow"],
  setB: ["rocky", "agile", "salty"],
  cp: [0, 1],
  ex: "'Nimble' and 'agile' both mean quick and light in movement — they are closest in meaning. ✓"
});

// Q82: prosperous/wealthy + poor/destitute — two valid pairs!
fix(82, {
  setA: ["prosperous", "angular", "crimson"],
  setB: ["steep", "wealthy", "bumpy"],
  cp: [0, 1],
  ex: "'Prosperous' and 'wealthy' both mean rich and successful — they are closest in meaning. ✓"
});

// Q83: malevolent/wicked + benevolent/kind — two valid pairs!
fix(83, {
  setA: ["malevolent", "golden", "dusty"],
  setB: ["hollow", "wicked", "angular"],
  cp: [0, 1],
  ex: "'Malevolent' means wishing harm on others, and 'wicked' means morally bad — they are closest in meaning. ✓"
});

// Q84: eloquent/articulate + inarticulate/unclear — fix only if flagged
// Check if it was flagged... unclear/inarticulate might not be in my synonym list
// Skip if not flagged

// Q85: shrewd/astute + naive/gullible — two valid pairs if flagged
fix(85, {
  setA: ["shrewd", "crimson", "angular"],
  setB: ["dusty", "astute", "golden"],
  cp: [0, 1],
  ex: "'Shrewd' and 'astute' both mean having sharp judgement — they are closest in meaning. ✓"
});

// Handle duplicate pairs — replace second occurrence with new unique pair
// Q101 dup of Q41 (shout/yell) → bravery/courage
fix(101, {
  d: 1,
  setA: ["bravery", "purple", "golden"],
  setB: ["dusty", "courage", "oval"],
  cp: [0, 1],
  ex: "'Bravery' and 'courage' both mean the quality of being brave — they are closest in meaning. ✓"
});

// Q104 dup of Q36 (reply/answer) → gift/present
fix(104, {
  d: 1,
  setA: ["gift", "steep", "angular"],
  setB: ["bumpy", "present", "rocky"],
  cp: [0, 1],
  ex: "'Gift' and 'present' both mean something given to someone — they are closest in meaning. ✓"
});

// Q106 dup of Q26 (fast/quick) → ill/sick
fix(106, {
  d: 1,
  setA: ["ill", "golden", "hollow"],
  setB: ["dusty", "sick", "purple"],
  cp: [0, 1],
  ex: "'Ill' and 'sick' both mean not in good health — they are closest in meaning. ✓"
});

// Q108 dup of Q35 (shut/close) → error/mistake
fix(108, {
  d: 1,
  setA: ["error", "steep", "angular"],
  setB: ["rocky", "mistake", "salty"],
  cp: [0, 1],
  ex: "'Error' and 'mistake' both mean something done incorrectly — they are closest in meaning. ✓"
});

// Q109 dup of Q67 (vanish/disappear) → odour/smell
fix(109, {
  d: 2,
  setA: ["odour", "golden", "hollow"],
  setB: ["angular", "smell", "crimson"],
  cp: [0, 1],
  ex: "'Odour' and 'smell' both mean a scent or aroma — they are closest in meaning. ✓"
});

// Q110 dup of Q73 (glimpse/glance) → voyage/journey
fix(110, {
  d: 2,
  setA: ["voyage", "steep", "dusty"],
  setB: ["bumpy", "journey", "golden"],
  cp: [0, 1],
  ex: "'Voyage' and 'journey' both mean a long trip — they are closest in meaning. ✓"
});

// Q122 dup of Q54 (reluctant/unwilling) → absurd/ridiculous
fix(122, {
  d: 3,
  setA: ["absurd", "angular", "crimson"],
  setB: ["golden", "ridiculous", "hollow"],
  cp: [0, 1],
  ex: "'Absurd' and 'ridiculous' both mean wildly unreasonable — they are closest in meaning. ✓"
});


// ===== APPLY FIXES =====
let content = fs.readFileSync(filePath, 'utf8');

// Parse existing questions
const synStart = content.indexOf("synonyms: {");
const antStart = content.indexOf("antonyms: {");
const synSection = content.substring(synStart, antStart);

const blocks = synSection.split(/\{[\s\n]*(?:"id"|id):/);
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

console.log(`Parsed ${existing.length} questions`);

// Apply fixes
const corrected = existing.map(q => {
  const f = F[q.id];
  if (!f) return q;
  return {
    id: q.id,
    d: f.d || q.d,
    sA: f.setA || q.sA,
    sB: f.setB || q.sB,
    cp: f.cp || q.cp,
    ex: f.ex || q.ex
  };
});

// ===== VALIDATE =====
// Reuse the synonym check
const synonymGroups = [
  ['big','large','huge','enormous','massive','vast'],
  ['small','little','tiny','minute'],
  ['happy','joyful','cheerful','glad','pleased','delighted','elated','overjoyed','merry'],
  ['sad','unhappy','miserable','sorrowful','gloomy','melancholy','dejected'],
  ['fast','quick','rapid','swift','speedy','brisk','hasty'],
  ['slow','sluggish','gradual','leisurely'],
  ['brave','courageous','bold','fearless','daring','valiant'],
  ['scared','afraid','frightened','terrified','fearful','timid','cowardly'],
  ['angry','cross','furious','irate','enraged','livid','annoyed','irritated'],
  ['kind','gentle','caring','considerate','compassionate','generous','thoughtful'],
  ['cruel','mean','harsh','brutal','ruthless','heartless','vicious'],
  ['old','ancient','elderly','aged'],
  ['new','modern','recent','contemporary','fresh'],
  ['begin','start','commence','initiate'],
  ['end','finish','conclude','complete','terminate','cease'],
  ['hide','conceal','cover','disguise','obscure'],
  ['show','reveal','display','demonstrate','exhibit','expose'],
  ['strong','powerful','mighty','robust','sturdy'],
  ['weak','feeble','frail','fragile','delicate'],
  ['rich','wealthy','affluent','prosperous','opulent'],
  ['poor','impoverished','destitute','needy'],
  ['clever','intelligent','smart','bright','brilliant','wise','shrewd','astute'],
  ['beautiful','pretty','lovely','gorgeous','attractive','stunning'],
  ['calm','peaceful','serene','tranquil','placid'],
  ['noisy','loud','boisterous','rowdy','deafening'],
  ['quiet','silent','hushed','still'],
  ['difficult','hard','tough','challenging','arduous','laborious'],
  ['easy','simple','straightforward','effortless'],
  ['strange','odd','peculiar','weird','unusual','bizarre','curious'],
  ['normal','ordinary','usual','typical','regular','common'],
  ['stop','halt','cease','pause'],
  ['look','gaze','stare','glance','peek','observe','watch'],
  ['gather','collect','accumulate','amass','assemble'],
  ['spread','scatter','distribute','disperse'],
  ['thrive','flourish','prosper','bloom'],
  ['decline','deteriorate','worsen','wither','fade'],
  ['allow','permit','authorise','let'],
  ['forbid','prohibit','ban','prevent'],
  ['praise','commend','applaud','compliment'],
  ['criticise','condemn','blame','censure'],
  ['agree','concur','consent','approve'],
  ['increase','grow','expand','enlarge','extend'],
  ['decrease','reduce','diminish','shrink','lessen','dwindle'],
  ['buy','purchase','acquire','obtain'],
  ['mix','blend','combine','merge'],
  ['separate','divide','split','sever'],
  ['arrive','reach','come','appear'],
  ['leave','depart','exit','withdraw'],
  ['attack','assault','strike','invade'],
  ['defend','protect','guard','shield'],
  ['accurate','precise','exact','correct'],
  ['vague','unclear','ambiguous','imprecise'],
  ['obvious','clear','evident','apparent'],
  ['hostile','aggressive','antagonistic','unfriendly'],
  ['friendly','amiable','amicable','genial'],
  ['humble','modest','unassuming','meek'],
  ['arrogant','proud','haughty','conceited','pompous','vain'],
  ['diligent','hardworking','industrious'],
  ['lazy','idle','slothful','lethargic'],
  ['nimble','agile','lithe','deft'],
  ['clumsy','awkward','ungainly','inept'],
  ['refuse','reject','decline','deny','spurn'],
  ['solemn','serious','grave','sombre','earnest'],
  ['temporary','brief','fleeting','transient'],
  ['permanent','lasting','enduring','eternal'],
  ['reluctant','unwilling','hesitant','disinclined'],
  ['eager','keen','enthusiastic','willing'],
  ['genuine','real','authentic','true','legitimate'],
  ['fake','false','counterfeit','bogus','artificial'],
  ['honest','truthful','sincere','genuine','frank','candid'],
  ['dishonest','deceitful','deceptive','untruthful'],
  ['shy','timid','bashful','reserved','reticent'],
  ['confident','bold','assertive','self-assured'],
  ['famous','renowned','celebrated','well-known','prominent'],
  ['irritate','annoy','provoke','aggravate','exasperate'],
  ['soothe','calm','pacify','comfort'],
  ['neglect','ignore','disregard','overlook'],
  ['polite','courteous','civil','respectful'],
  ['rude','impolite','discourteous','insolent'],
  ['dull','boring','tedious','monotonous','dreary'],
  ['bright','brilliant','vivid','radiant','dazzling'],
  ['dark','dim','gloomy','murky','shadowy'],
  ['clean','spotless','pristine','immaculate','tidy','neat'],
  ['dirty','filthy','grubby','grimy','messy','untidy'],
  ['wet','damp','moist','soaked'],
  ['dry','arid','parched'],
  ['hot','warm','boiling','scorching'],
  ['cold','cool','chilly','freezing','icy','frigid'],
  ['tired','weary','exhausted','fatigued','sleepy'],
  ['empty','vacant','bare','hollow'],
  ['full','packed','crammed','stuffed'],
  ['thin','narrow','slim','slender'],
  ['wide','broad','extensive','spacious'],
  ['right','correct','accurate','precise'],
  ['wrong','incorrect','inaccurate','false','mistaken'],
  ['important','significant','vital','crucial','essential'],
  ['abundant','plentiful','ample','copious'],
  ['scarce','rare','sparse','meagre'],
  ['obstinate','stubborn','headstrong','determined','resolute','persistent','tenacious'],
  ['shiny','glossy','gleaming','glistening'],
  ['generous','charitable','benevolent','magnanimous'],
  ['selfish','greedy','self-centred'],
  ['destroy','demolish','wreck','ruin','smash'],
  ['make','create','construct','build','produce'],
  ['mend','repair','fix','restore'],
  ['break','shatter','crack','snap'],
  ['laugh','giggle','chuckle','snicker'],
  ['cry','weep','sob','wail'],
  ['shout','yell','scream','bellow','holler'],
  ['whisper','murmur','mutter'],
  ['grab','seize','snatch','clutch'],
  ['drop','release','let go'],
  ['scatter','spread','distribute','disperse'],
  ['triumph','victory','win','success'],
  ['defeat','loss','failure'],
  ['bewildered','confused','perplexed','baffled','puzzled'],
  ['malevolent','wicked','evil','sinister'],
  ['eloquent','articulate','fluent','expressive'],
  ['shrewd','astute','cunning','sharp','canny'],
  ['prosperous','wealthy','rich','affluent','successful','thriving'],
  ['cautious','careful','wary','prudent'],
  ['reckless','rash','impulsive','careless'],
  ['bravery','courage','valour','heroism'],
  ['gift','present','offering'],
  ['ill','sick','unwell','poorly'],
  ['error','mistake','blunder','slip'],
  ['odour','smell','scent','aroma','fragrance'],
  ['voyage','journey','trip','expedition','trek'],
  ['glimpse','glance','peek','peep'],
  ['absurd','ridiculous','ludicrous','preposterous'],
  ['solemn','serious','grave','sombre'],
  ['sturdy','robust','strong','solid','durable'],
  ['fragile','delicate','brittle','frail'],
  ['unite','combine','merge','join','fuse'],
  ['divide','separate','split','sever'],
  ['accept','agree','consent'],
  ['reject','refuse','decline','deny'],
  ['praise','commend','compliment','applaud'],
  ['criticise','condemn','denounce','censure'],
  ['vivid','bright','colourful','striking'],
  ['polite','courteous','civil','respectful','well-mannered'],
];

const synMap = {};
for (const group of synonymGroups) {
  for (const word of group) {
    const wl = word.toLowerCase();
    if (!synMap[wl]) synMap[wl] = new Set();
    for (const other of group) {
      if (other.toLowerCase() !== wl) synMap[wl].add(other.toLowerCase());
    }
  }
}

function areSynonyms(a, b) {
  const al = a.toLowerCase(), bl = b.toLowerCase();
  return synMap[al]?.has(bl) || synMap[bl]?.has(al) || false;
}

let ambigCount = 0;
for (const q of corrected) {
  const altPairs = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i === q.cp[0] && j === q.cp[1]) continue;
      if (areSynonyms(q.sA[i], q.sB[j])) {
        altPairs.push(`${q.sA[i]}/${q.sB[j]}`);
      }
    }
  }
  if (altPairs.length > 0) {
    console.log(`⚠ Q${q.id}(D${q.d}): ${q.sA[q.cp[0]]}/${q.sB[q.cp[1]]} has alt: ${altPairs.join(', ')}`);
    ambigCount++;
  }
}

// Check duplicates
const pairMap = {};
for (const q of corrected) {
  const k = [q.sA[q.cp[0]], q.sB[q.cp[1]]].map(w => w.toLowerCase()).sort().join('/');
  if (!pairMap[k]) pairMap[k] = [];
  pairMap[k].push(q.id);
}
let dupCount = 0;
for (const [p, ids] of Object.entries(pairMap)) {
  if (ids.length > 1) { console.log(`⚠ DUP: ${p} — Q${ids.join(', Q')}`); dupCount++; }
}

// Distribution
const dd = { 1: 0, 2: 0, 3: 0 };
for (const q of corrected) dd[q.d]++;

// Word frequency
const wf = {};
for (const q of corrected) {
  for (const w of [...q.sA, ...q.sB]) wf[w.toLowerCase()] = (wf[w.toLowerCase()] || 0) + 1;
}
const over = Object.entries(wf).filter(([, c]) => c >= 6).sort((a, b) => b[1] - a[1]);

console.log(`\nAmbiguous: ${ambigCount}`);
console.log(`Duplicate pairs: ${dupCount}`);
console.log(`Distribution: D1=${dd[1]} D2=${dd[2]} D3=${dd[3]}`);
if (over.length > 0) {
  console.log(`Overused (6+): ${over.map(([w, c]) => w + '(' + c + ')').join(', ')}`);
}
console.log(`Fixes applied: ${Object.keys(F).length}`);

// ===== WRITE =====
const questionsStart = content.indexOf("questions: [", synStart);
const bracketStart = content.indexOf("[", questionsStart);
let depth = 0, bracketEnd = -1;
for (let i = bracketStart; i < content.length; i++) {
  if (content[i] === '[') depth++;
  if (content[i] === ']') depth--;
  if (depth === 0) { bracketEnd = i + 1; break; }
}

function fmt(q) {
  const isJson = q.id >= 101;
  const ex = q.ex.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  if (isJson) {
    return `        {
          "id": ${q.id},
          "difficulty": ${q.d},
          "questionType": "pick-from-sets",
          "question": "Choose one word from each group that are closest in meaning.",
          "setA": ["${q.sA[0]}","${q.sA[1]}","${q.sA[2]}"],
          "setB": ["${q.sB[0]}","${q.sB[1]}","${q.sB[2]}"],
          "correctPair": [${q.cp[0]},${q.cp[1]}],
          "explanation": "${ex}"
        }`;
  }
  return `              {
                      id: ${q.id},
                      difficulty: ${q.d},
                      questionType: "pick-from-sets",
                      question: "Choose one word from each group that are closest in meaning.",
                      setA: ["${q.sA[0]}","${q.sA[1]}","${q.sA[2]}"],
                      setB: ["${q.sB[0]}","${q.sB[1]}","${q.sB[2]}"],
                      correctPair: [${q.cp[0]},${q.cp[1]}],
                      explanation: "${ex}"
              }`;
}

const newArray = '[\n' + corrected.map(q => fmt(q)).join(',\n') + '\n      ]';
const newContent = content.substring(0, bracketStart) + newArray + content.substring(bracketEnd);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('\n✅ File written');

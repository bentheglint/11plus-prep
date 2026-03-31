/**
 * Comprehensive synonym audit informed by GL research:
 * 1. Cross-pairing check (multiple valid synonym pairs — the critical issue from antonyms)
 * 2. Difficulty assessment based on GL vocabulary tiers
 * 3. Duplicate detection
 * 4. Distractor quality (antonym traps, word associations, intensity mismatches)
 * 5. Explanation quality
 * 6. Word frequency / overuse
 */
const vr = require('../src/questionData/vrData.js');
const qs = (vr.default || vr).topics.synonyms.questions;

console.log(`Auditing ${qs.length} synonym questions\n`);

const issues = [];

// ============================================================
// 1. CROSS-PAIRING CHECK — the most critical test
// For synonyms, we need to check if ANY other pair across
// setA × setB are also synonyms (would create ambiguity)
// ============================================================

// Comprehensive synonym dictionary for checking
const synonymGroups = [
  // Common everyday
  ['big','large','huge','enormous','massive','vast','gigantic'],
  ['small','little','tiny','minute','miniature'],
  ['happy','joyful','cheerful','glad','pleased','delighted','elated','overjoyed','merry'],
  ['sad','unhappy','miserable','sorrowful','gloomy','melancholy','dejected','morose'],
  ['fast','quick','rapid','swift','speedy','brisk','hasty'],
  ['slow','sluggish','gradual','leisurely','unhurried'],
  ['brave','courageous','bold','fearless','daring','valiant','gallant','heroic'],
  ['scared','afraid','frightened','terrified','fearful','timid','cowardly'],
  ['angry','cross','furious','irate','enraged','livid','annoyed','irritated'],
  ['kind','gentle','caring','considerate','compassionate','benevolent','generous','thoughtful'],
  ['cruel','mean','harsh','brutal','ruthless','merciless','heartless','vicious'],
  ['old','ancient','elderly','aged','antique','vintage'],
  ['new','modern','recent','contemporary','fresh','novel'],
  ['begin','start','commence','initiate','launch','embark'],
  ['end','finish','conclude','complete','terminate','cease'],
  ['hide','conceal','cover','disguise','obscure','mask','camouflage'],
  ['show','reveal','display','demonstrate','exhibit','expose'],
  ['strong','powerful','mighty','robust','sturdy','muscular','potent'],
  ['weak','feeble','frail','fragile','delicate','flimsy'],
  ['rich','wealthy','affluent','prosperous','opulent'],
  ['poor','impoverished','destitute','needy','penniless'],
  ['clever','intelligent','smart','bright','brilliant','wise','shrewd','astute'],
  ['stupid','foolish','silly','dumb','dim','dense','daft'],
  ['beautiful','pretty','lovely','gorgeous','attractive','handsome','stunning'],
  ['ugly','hideous','unsightly','repulsive','grotesque'],
  ['calm','peaceful','serene','tranquil','placid','composed'],
  ['noisy','loud','boisterous','rowdy','deafening','clamorous'],
  ['quiet','silent','hushed','still','mute','soundless'],
  ['difficult','hard','tough','challenging','arduous','laborious','gruelling','strenuous'],
  ['easy','simple','straightforward','effortless','uncomplicated'],
  ['strange','odd','peculiar','weird','unusual','bizarre','eccentric','curious'],
  ['normal','ordinary','usual','typical','regular','standard','common'],
  ['stop','halt','cease','pause','desist','discontinue'],
  ['walk','stroll','amble','wander','trudge','stride','march'],
  ['run','sprint','dash','race','bolt','gallop'],
  ['eat','consume','devour','dine','munch','gobble'],
  ['look','gaze','stare','glance','peek','observe','watch','peer'],
  ['say','speak','tell','utter','declare','announce','state','proclaim'],
  ['think','consider','ponder','reflect','contemplate','deliberate'],
  ['make','create','construct','build','produce','manufacture','fabricate'],
  ['break','destroy','demolish','shatter','smash','wreck','ruin'],
  ['move','shift','transfer','relocate','budge'],
  ['help','assist','aid','support'],
  ['hurt','injure','harm','damage','wound'],
  ['like','enjoy','appreciate','relish','adore','cherish','love','fond'],
  ['hate','despise','detest','loathe','abhor'],
  ['wet','damp','moist','soaked','drenched','soggy'],
  ['dry','arid','parched','dehydrated'],
  ['hot','warm','boiling','scorching','sweltering','sizzling'],
  ['cold','cool','chilly','freezing','icy','frosty','frigid'],
  ['tired','weary','exhausted','fatigued','drowsy','sleepy'],
  ['energetic','lively','active','vigorous','dynamic','spirited'],
  ['empty','vacant','bare','hollow','void'],
  ['full','packed','crammed','stuffed','overflowing'],
  ['narrow','thin','slim','slender','slight'],
  ['wide','broad','extensive','vast','spacious'],
  ['right','correct','accurate','precise','exact','true'],
  ['wrong','incorrect','inaccurate','false','mistaken','erroneous'],
  ['important','significant','vital','crucial','essential','critical','key'],
  ['abundant','plentiful','ample','copious','profuse'],
  ['scarce','rare','sparse','meagre','scant'],
  ['obstinate','stubborn','headstrong','determined','resolute','persistent','tenacious'],
  ['flexible','adaptable','versatile','supple','pliable'],
  ['shiny','glossy','gleaming','glistening','sparkling','lustrous'],
  ['dull','boring','tedious','monotonous','dreary','bland','uninteresting','mundane'],
  ['bright','brilliant','vivid','radiant','luminous','dazzling'],
  ['dark','dim','gloomy','murky','shadowy','dingy'],
  ['clean','spotless','pristine','immaculate','hygienic','tidy','neat'],
  ['dirty','filthy','grubby','grimy','soiled','messy','untidy'],
  ['polite','courteous','civil','respectful','well-mannered'],
  ['rude','impolite','discourteous','insolent','impudent'],
  ['generous','charitable','benevolent','magnanimous','lavish'],
  ['selfish','greedy','self-centred','egotistical'],
  ['honest','truthful','sincere','genuine','frank','candid'],
  ['dishonest','deceitful','deceptive','untruthful','fraudulent'],
  ['shy','timid','bashful','reserved','introverted','reticent'],
  ['confident','bold','assertive','self-assured','outgoing'],
  ['famous','renowned','celebrated','well-known','notable','prominent','distinguished','eminent'],
  ['gather','collect','accumulate','amass','assemble','compile'],
  ['spread','scatter','distribute','disperse','disseminate'],
  ['thrive','flourish','prosper','bloom','succeed'],
  ['decline','deteriorate','worsen','degrade','diminish','wither','fade'],
  ['allow','permit','authorise','let','grant'],
  ['forbid','prohibit','ban','prevent','restrict'],
  ['praise','commend','applaud','compliment','acclaim'],
  ['criticise','condemn','blame','censure','denounce'],
  ['agree','concur','consent','approve'],
  ['disagree','dispute','object','protest','oppose'],
  ['increase','grow','expand','enlarge','extend','amplify','multiply'],
  ['decrease','reduce','diminish','shrink','lessen','contract','dwindle'],
  ['buy','purchase','acquire','obtain','procure'],
  ['sell','trade','vend','market'],
  ['mix','blend','combine','merge','mingle'],
  ['separate','divide','split','sever','detach','isolate'],
  ['arrive','reach','come','appear','emerge'],
  ['leave','depart','exit','withdraw','vacate'],
  ['attack','assault','strike','invade','ambush'],
  ['defend','protect','guard','shield','safeguard'],
  ['ask','enquire','request','question','interrogate'],
  ['answer','reply','respond','retort'],
  ['teach','instruct','educate','train','tutor','coach'],
  ['learn','study','absorb','acquire','grasp','master'],
  ['accurate','precise','exact','correct'],
  ['vague','unclear','ambiguous','imprecise','hazy','fuzzy'],
  ['obvious','clear','evident','apparent','plain','transparent'],
  ['hostile','aggressive','antagonistic','unfriendly','belligerent'],
  ['friendly','amiable','amicable','genial','cordial','sociable'],
  ['humble','modest','unassuming','meek'],
  ['arrogant','proud','haughty','conceited','pompous','vain'],
  ['diligent','hardworking','industrious','assiduous','conscientious'],
  ['lazy','idle','slothful','lethargic','indolent'],
  ['nimble','agile','lithe','supple','deft'],
  ['clumsy','awkward','ungainly','inept','bumbling'],
  ['plead','beg','implore','beseech','entreat'],
  ['refuse','reject','decline','deny','rebuff','spurn'],
  ['adequate','sufficient','enough','satisfactory','acceptable'],
  ['excessive','extreme','extravagant','immoderate','inordinate'],
  ['solemn','serious','grave','sombre','earnest'],
  ['frivolous','trivial','silly','superficial','flippant'],
  ['ancient','archaic','antiquated','prehistoric','primeval'],
  ['obsolete','outdated','outmoded','defunct','archaic'],
  ['cautious','careful','wary','prudent','circumspect','vigilant'],
  ['reckless','rash','impulsive','careless','heedless','foolhardy'],
  ['temporary','brief','fleeting','transient','momentary','short-lived'],
  ['permanent','lasting','enduring','eternal','perpetual','everlasting'],
  ['absorb','soak up','assimilate','take in','imbibe'],
  ['fragrant','aromatic','sweet-smelling','perfumed','scented'],
  ['stinky','smelly','foul','putrid','malodorous','fetid','rank'],
  ['transparent','clear','see-through','translucent'],
  ['opaque','cloudy','murky','non-transparent'],
  ['reluctant','unwilling','hesitant','disinclined','averse','loath'],
  ['eager','keen','enthusiastic','willing','avid','zealous'],
  ['genuine','real','authentic','true','legitimate','bona fide'],
  ['fake','false','counterfeit','bogus','phoney','artificial','sham'],
  ['rigid','stiff','inflexible','firm','unyielding'],
  ['prosperous','successful','thriving','well-off','booming'],
  ['frugal','thrifty','economical','sparing','prudent'],
  ['extravagant','lavish','wasteful','profligate','prodigal'],
  ['benevolent','kind','charitable','generous','philanthropic'],
  ['malevolent','malicious','spiteful','vindictive','wicked'],
  ['elated','overjoyed','ecstatic','euphoric','jubilant','thrilled'],
  ['bewildered','confused','perplexed','baffled','mystified','puzzled'],
  ['irritate','annoy','provoke','aggravate','exasperate','infuriate'],
  ['soothe','calm','pacify','comfort','console','appease'],
  ['neglect','ignore','disregard','overlook'],
  ['cherish','treasure','value','prize','adore'],
];

// Build a lookup: for any word, find all its synonyms
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

// Cross-pairing check
let ambigCount = 0;
for (const q of qs) {
  const altPairs = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i === q.correctPair[0] && j === q.correctPair[1]) continue;
      if (areSynonyms(q.setA[i], q.setB[j])) {
        altPairs.push(`${q.setA[i]}/${q.setB[j]}`);
      }
    }
  }
  if (altPairs.length > 0) {
    const correct = `${q.setA[q.correctPair[0]]}/${q.setB[q.correctPair[1]]}`;
    issues.push({ id: q.id, d: q.difficulty, type: 'ALT_SYNONYM_PAIR', detail: `${correct} is answer, but also: ${altPairs.join(', ')}` });
    ambigCount++;
  }
}

// ============================================================
// 2. DIFFICULTY ASSESSMENT
// ============================================================
// D1 words: common everyday vocabulary
const d1Words = new Set(['big','large','small','little','happy','sad','fast','slow','brave','scared','angry','kind','old','new','begin','start','end','finish','hide','show','strong','weak','rich','poor','clever','stupid','beautiful','ugly','calm','quiet','loud','easy','hard','strange','normal','stop','walk','run','eat','look','say','think','make','break','help','hurt','like','hate','wet','dry','hot','cold','tired','empty','full','right','wrong','close','shut','open','near','far','clean','dirty','dark','light','tall','short','long','wide','thin','thick','young','cross','glad','bad','good','nice','mean','gentle','tough','pretty','shy','bold','weary','wealthy','joyful','begin','start','halt','finish','delay','repeat','arrive','leave','generous','cheerful','miserable','pleased']);

// D3 words: advanced vocabulary
const d3Words = new Set(['laborious','arduous','tranquil','serene','diligent','industrious','deteriorate','nimble','agile','obsolete','feeble','frail','abundant','copious','profuse','benevolent','malevolent','elated','euphoric','bewildered','perplexed','irritate','provoke','exasperate','soothe','appease','negligent','assiduous','circumspect','frivolous','magnanimous','egotistical','impetuous','loquacious','taciturn','gregarious','reclusive','eloquent','inarticulate','ostentatious','meticulous','scrupulous','resilient','tenacious','versatile','pragmatic','astute','shrewd','candid','reticent','opulent','destitute','impoverished','audacious','prudent','contemplate','deliberate','flourish','thrive','prosper','wither','decline','diminish','denounce','censure','procure','assimilate','disseminate','belligerent','antagonistic','amiable','genial','extravagant','profligate','vindictive','philanthropic']);

const diffFlags = [];
for (const q of qs) {
  const correctA = q.setA[q.correctPair[0]].toLowerCase();
  const correctB = q.setB[q.correctPair[1]].toLowerCase();

  // D1 question with D3 vocabulary
  if (q.difficulty === 1) {
    if (d3Words.has(correctA) || d3Words.has(correctB)) {
      diffFlags.push({ id: q.id, current: 1, suggested: 3, reason: `D3 word in D1 question: ${correctA}/${correctB}` });
    }
  }

  // D3 question with D1 vocabulary
  if (q.difficulty === 3) {
    if (d1Words.has(correctA) && d1Words.has(correctB)) {
      diffFlags.push({ id: q.id, current: 3, suggested: 1, reason: `Both words are everyday D1 vocab: ${correctA}/${correctB}` });
    }
  }
}

// ============================================================
// 3. DUPLICATE DETECTION
// ============================================================
const pairSeen = {};
for (const q of qs) {
  const a = q.setA[q.correctPair[0]].toLowerCase();
  const b = q.setB[q.correctPair[1]].toLowerCase();
  const key = [a, b].sort().join('/');
  if (pairSeen[key]) {
    issues.push({ id: q.id, d: q.difficulty, type: 'DUPLICATE_PAIR', detail: `${a}/${b} also in Q${pairSeen[key]}` });
  }
  pairSeen[key] = q.id;
}

// ============================================================
// 4. WORD FREQUENCY
// ============================================================
const wordFreq = {};
for (const q of qs) {
  for (const w of [...q.setA, ...q.setB]) {
    wordFreq[w.toLowerCase()] = (wordFreq[w.toLowerCase()] || 0) + 1;
  }
}
const overused = Object.entries(wordFreq).filter(([, c]) => c >= 6).sort((a, b) => b[1] - a[1]);

// ============================================================
// PRINT RESULTS
// ============================================================
console.log('=== ISSUES ===');
const byType = {};
for (const i of issues) { if (!byType[i.type]) byType[i.type] = []; byType[i.type].push(i); }
for (const [type, items] of Object.entries(byType)) {
  console.log(`\n${type} (${items.length}):`);
  for (const i of items.slice(0, 20)) {
    console.log(`  Q${i.id}(D${i.d}): ${i.detail}`);
  }
  if (items.length > 20) console.log(`  ... and ${items.length - 20} more`);
}

if (diffFlags.length > 0) {
  console.log('\n=== DIFFICULTY FLAGS ===');
  for (const f of diffFlags) console.log(`  Q${f.id}: D${f.current}→D${f.suggested} — ${f.reason}`);
} else {
  console.log('\n=== DIFFICULTY FLAGS ===\n  No flags');
}

if (overused.length > 0) {
  console.log('\n=== OVERUSED WORDS (6+) ===');
  for (const [w, c] of overused) console.log(`  ${w}: ${c}`);
} else {
  console.log('\n=== OVERUSED WORDS ===\n  None');
}

// Distribution
const dd = { 1: 0, 2: 0, 3: 0 };
for (const q of qs) dd[q.difficulty]++;
console.log(`\n=== DISTRIBUTION ===`);
console.log(`D1: ${dd[1]} (${Math.round(dd[1] / qs.length * 100)}%)`);
console.log(`D2: ${dd[2]} (${Math.round(dd[2] / qs.length * 100)}%)`);
console.log(`D3: ${dd[3]} (${Math.round(dd[3] / qs.length * 100)}%)`);

// Samples
console.log('\n=== SAMPLES ===');
for (const d of [1, 2, 3]) {
  const dqs = qs.filter(q => q.difficulty === d);
  const picks = [dqs[2], dqs[Math.floor(dqs.length / 2)], dqs[dqs.length - 2]];
  console.log(`\nD${d}:`);
  for (const q of picks) {
    const a = q.setA[q.correctPair[0]], b = q.setB[q.correctPair[1]];
    console.log(`  Q${q.id}: [${q.setA.join(', ')}] / [${q.setB.join(', ')}] → ${a}/${b}`);
  }
}

console.log(`\nTotal issues: ${issues.length}`);
console.log(`Difficulty flags: ${diffFlags.length}`);

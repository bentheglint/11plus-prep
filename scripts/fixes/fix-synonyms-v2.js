/**
 * Fix remaining ambiguous questions + diversify overused distractor words
 * Uses a large rotating pool of safe distractors
 */
const fs = require('fs');
const filePath = 'C:/Users/Ben Jackson/Projects/11plus-prep/src/questionData/vrData.js';

// Large pool of safe distractor words — diverse, unrelated to common synonym answer words
// These should NOT be synonyms of common test words (happy, sad, brave, clever, etc.)
const distractorPool = [
  // Objects
  'pencil','candle','mirror','basket','cushion','blanket','towel','ribbon','marble','carpet',
  'chimney','saddle','lantern','trumpet','anchor','compass','fountain','pillow','umbrella','barrel',
  // Nature
  'pebble','thunder','crystal','volcano','glacier','meadow','orchard','canyon','coral','willow',
  'granite','copper','ivory','emerald','amber','sapphire','silver','bronze','platinum','cedar',
  // Food/drink
  'pepper','ginger','mustard','vinegar','biscuit','treacle','custard','toffee','cinnamon','vanilla',
  // Textures/materials
  'velvet','cotton','linen','woollen','leather','rubber','ceramic','wooden','marble','granite',
  // Shapes/patterns
  'spiral','zigzag','stripy','spotted','checkered','twisted','folded','circular','diagonal','vertical',
  // Colours
  'scarlet','crimson','turquoise','indigo','magenta','olive','ivory','burgundy','tangerine','lavender',
  // Abstract but safe
  'annual','gradual','frequent','occasional','random','specific','tropical','arctic','coastal','rural',
  'suburban','volcanic','magnetic','elastic','parallel','opposite','neutral','digital','thermal','solar',
];

// Remove any words that could be synonyms of common answer words
const unsafeWords = new Set([
  'golden','dusty','hollow','bumpy','angular','steep','rocky','salty','crunchy','oval',
  'purple', // already overused
]);

const safePool = distractorPool.filter(w => !unsafeWords.has(w));

// Shuffled pool for rotation
let poolIdx = 0;
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const shuffled = shuffleArray(safePool);
function nextDistractor() {
  const w = shuffled[poolIdx % shuffled.length];
  poolIdx++;
  return w;
}

// Read current state
let content = fs.readFileSync(filePath, 'utf8');
const synStart = content.indexOf("synonyms: {");
const antStart = content.indexOf("antonyms: {");
const section = content.substring(synStart, antStart);
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

// Synonym check (same as audit script)
const synonymGroups = [
  ['big','large','huge','enormous','massive','vast'],['small','little','tiny','minute'],
  ['happy','joyful','cheerful','glad','pleased','delighted','elated','overjoyed','merry'],
  ['sad','unhappy','miserable','sorrowful','gloomy','melancholy','dejected'],
  ['fast','quick','rapid','swift','speedy','brisk','hasty'],['slow','sluggish','gradual','leisurely'],
  ['brave','courageous','bold','fearless','daring','valiant','heroic'],
  ['scared','afraid','frightened','terrified','fearful','timid','cowardly'],
  ['angry','cross','furious','irate','enraged','livid','annoyed','irritated'],
  ['kind','gentle','caring','considerate','compassionate','generous','thoughtful','benevolent'],
  ['cruel','mean','harsh','brutal','ruthless','heartless','vicious','wicked','malevolent'],
  ['old','ancient','elderly','aged'],['new','modern','recent','contemporary','fresh'],
  ['begin','start','commence','initiate'],['end','finish','conclude','complete','terminate','cease'],
  ['hide','conceal','cover','disguise','obscure'],['show','reveal','display','demonstrate','exhibit','expose'],
  ['strong','powerful','mighty','robust','sturdy'],['weak','feeble','frail','fragile','delicate'],
  ['rich','wealthy','affluent','prosperous','opulent'],['poor','impoverished','destitute','needy'],
  ['clever','intelligent','smart','bright','brilliant','wise','shrewd','astute'],
  ['beautiful','pretty','lovely','gorgeous','attractive','stunning'],
  ['calm','peaceful','serene','tranquil','placid'],['noisy','loud','boisterous','rowdy','deafening'],
  ['quiet','silent','hushed','still'],['difficult','hard','tough','challenging','arduous','laborious'],
  ['easy','simple','straightforward','effortless'],['strange','odd','peculiar','weird','unusual','bizarre','curious'],
  ['normal','ordinary','usual','typical','regular','common'],['stop','halt','cease','pause'],
  ['look','gaze','stare','glance','peek','observe','watch'],
  ['gather','collect','accumulate','amass','assemble'],['spread','scatter','distribute','disperse'],
  ['thrive','flourish','prosper','bloom'],['decline','deteriorate','worsen','wither','fade'],
  ['allow','permit','authorise','let'],['forbid','prohibit','ban','prevent'],
  ['praise','commend','applaud','compliment'],['criticise','condemn','blame','censure','denounce'],
  ['increase','grow','expand','enlarge','extend'],['decrease','reduce','diminish','shrink','lessen','dwindle'],
  ['buy','purchase','acquire','obtain'],['arrive','reach','come','appear'],['leave','depart','exit','withdraw'],
  ['attack','assault','strike','invade'],['defend','protect','guard','shield'],
  ['vague','unclear','ambiguous','imprecise','obscure'],['obvious','clear','evident','apparent'],
  ['hostile','aggressive','antagonistic','unfriendly','belligerent'],
  ['friendly','amiable','amicable','genial','cordial'],
  ['humble','modest','unassuming','meek'],['arrogant','proud','haughty','conceited','pompous','vain'],
  ['diligent','hardworking','industrious'],['lazy','idle','slothful','lethargic'],
  ['nimble','agile','lithe','deft'],['clumsy','awkward','ungainly','inept'],
  ['refuse','reject','decline','deny','spurn'],['solemn','serious','grave','sombre','earnest'],
  ['temporary','brief','fleeting','transient'],['permanent','lasting','enduring','eternal'],
  ['reluctant','unwilling','hesitant','disinclined'],['eager','keen','enthusiastic','willing'],
  ['genuine','real','authentic','true','legitimate'],['fake','false','counterfeit','bogus','artificial'],
  ['honest','truthful','sincere','frank','candid'],['dishonest','deceitful','deceptive','untruthful'],
  ['shy','timid','bashful','reserved','reticent'],['confident','bold','assertive'],
  ['famous','renowned','celebrated','prominent','eminent'],
  ['irritate','annoy','provoke','aggravate','exasperate'],['soothe','calm','pacify','comfort'],
  ['neglect','ignore','disregard','overlook'],['polite','courteous','civil','respectful'],
  ['rude','impolite','discourteous','insolent'],['dull','boring','tedious','monotonous','dreary'],
  ['bright','brilliant','vivid','radiant','dazzling','striking'],
  ['dark','dim','gloomy','murky','shadowy'],
  ['clean','spotless','pristine','immaculate','tidy','neat'],
  ['dirty','filthy','grubby','grimy','messy','untidy'],
  ['tired','weary','exhausted','fatigued','sleepy'],
  ['empty','vacant','bare','hollow','void'],['full','packed','crammed','stuffed'],
  ['thin','narrow','slim','slender'],['wide','broad','extensive','spacious'],
  ['right','correct','accurate','precise'],['wrong','incorrect','inaccurate','false','mistaken'],
  ['abundant','plentiful','ample','copious'],['scarce','rare','sparse','meagre'],
  ['obstinate','stubborn','headstrong','determined','resolute','persistent','tenacious'],
  ['generous','charitable','magnanimous','lavish'],['selfish','greedy','self-centred'],
  ['destroy','demolish','wreck','ruin','smash','shatter'],['make','create','construct','build','produce'],
  ['mend','repair','fix','restore'],['break','crack','snap','fracture'],
  ['laugh','giggle','chuckle'],['cry','weep','sob','wail'],
  ['shout','yell','scream','bellow'],['whisper','murmur','mutter'],
  ['grab','seize','snatch','clutch','grip','grasp'],['drop','release','let go'],
  ['triumph','victory','win','success'],['defeat','loss','failure'],
  ['bewildered','confused','perplexed','baffled','puzzled'],
  ['eloquent','articulate','fluent','expressive'],['shrewd','astute','cunning','sly','canny'],
  ['prosperous','wealthy','rich','affluent','successful','thriving'],
  ['cautious','careful','wary','prudent'],['reckless','rash','impulsive','careless'],
  ['bravery','courage','valour','heroism'],['gift','present','offering'],
  ['ill','sick','unwell','poorly'],['error','mistake','blunder','slip'],
  ['odour','smell','scent','aroma','fragrance'],['voyage','journey','trip','expedition'],
  ['absurd','ridiculous','ludicrous','preposterous'],
  ['sturdy','robust','solid','durable'],['fragile','delicate','brittle','frail'],
  ['unite','combine','merge','join'],['divide','separate','split','sever'],
  ['accept','agree','consent'],['reject','refuse','rebuff'],
  ['scarce','sparse','meagre','scant'],['abundant','plentiful','ample'],
  ['valiant','heroic','gallant','noble'],['cowardly','fearful','craven'],
  ['absolve','forgive','pardon','exonerate'],['condemn','blame','denounce'],
  ['vivid','bright','striking','colourful'],['obsolete','outdated','outmoded','defunct'],
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

// For each question, check if it needs fixing (has alt pairs or overused words)
const corrected = existing.map(q => {
  const correctA = q.sA[q.cp[0]];
  const correctB = q.sB[q.cp[1]];

  // Check if any non-answer cross-pairs are synonyms
  let hasAltPair = false;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i === q.cp[0] && j === q.cp[1]) continue;
      if (areSynonyms(q.sA[i], q.sB[j])) { hasAltPair = true; break; }
    }
    if (hasAltPair) break;
  }

  // Check if any distractor is overused
  const hasOverused = [...q.sA, ...q.sB].some(w =>
    unsafeWords.has(w.toLowerCase()) || ['golden','dusty','hollow','bumpy','angular','steep','rocky','salty','crunchy','oval','purple','crimson','wooden','stripy','spotted','flat'].includes(w.toLowerCase())
  );

  if (!hasAltPair && !hasOverused) return q; // No fix needed

  // Need to replace distractors
  // Keep the correct pair, replace the other 4 words
  const newSA = ['', '', ''];
  const newSB = ['', '', ''];
  newSA[q.cp[0]] = correctA;
  newSB[q.cp[1]] = correctB;

  // Fill remaining positions with safe distractors
  // Make sure they don't form synonym pairs with any word in the other set
  for (let i = 0; i < 3; i++) {
    if (i === q.cp[0]) continue;
    let word;
    let attempts = 0;
    do {
      word = nextDistractor();
      attempts++;
    } while (attempts < 50 && (
      areSynonyms(word, newSB[0] || '') ||
      areSynonyms(word, newSB[1] || '') ||
      areSynonyms(word, newSB[2] || '') ||
      areSynonyms(word, correctB) ||
      areSynonyms(word, correctA)
    ));
    newSA[i] = word;
  }

  for (let j = 0; j < 3; j++) {
    if (j === q.cp[1]) continue;
    let word;
    let attempts = 0;
    do {
      word = nextDistractor();
      attempts++;
    } while (attempts < 50 && (
      areSynonyms(word, newSA[0] || '') ||
      areSynonyms(word, newSA[1] || '') ||
      areSynonyms(word, newSA[2] || '') ||
      areSynonyms(word, correctA) ||
      areSynonyms(word, correctB)
    ));
    newSB[j] = word;
  }

  // Update explanation to mention the correct pair
  const newEx = `'${correctA}' and '${correctB}' are closest in meaning — they are synonyms. The other words (${newSA.filter((_,i)=>i!==q.cp[0]).join(', ')}, ${newSB.filter((_,j)=>j!==q.cp[1]).join(', ')}) are unrelated and don't form synonym pairs with any word in the other group. ✓`;

  return { ...q, sA: newSA, sB: newSB, ex: newEx };
});

// Validate
let ambigCount = 0;
for (const q of corrected) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i === q.cp[0] && j === q.cp[1]) continue;
      if (areSynonyms(q.sA[i], q.sB[j])) {
        console.log(`⚠ Q${q.id}: ${q.sA[i]}/${q.sB[j]} alt pair remains`);
        ambigCount++;
      }
    }
  }
}

const dd = { 1: 0, 2: 0, 3: 0 };
for (const q of corrected) dd[q.d]++;

const wf = {};
for (const q of corrected) {
  for (const w of [...q.sA, ...q.sB]) wf[w.toLowerCase()] = (wf[w.toLowerCase()] || 0) + 1;
}
const over = Object.entries(wf).filter(([, c]) => c >= 6).sort((a, b) => b[1] - a[1]);

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

console.log(`\nAmbiguous: ${ambigCount}`);
console.log(`Duplicate pairs: ${dupCount}`);
console.log(`Distribution: D1=${dd[1]} D2=${dd[2]} D3=${dd[3]}`);
console.log(`Overused (6+): ${over.length > 0 ? over.map(([w, c]) => w + '(' + c + ')').join(', ') : 'NONE'}`);
console.log(`Max word frequency: ${Math.max(...Object.values(wf))}`);

// Write
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
console.log('✅ File written');

const m = require('../src/questionData/vrData.js');
const qs = m.default?.topics?.compoundWords?.questions || m.topics?.compoundWords?.questions;

const orig = qs.filter(q => q.id <= 125);
console.log('Auditing', orig.length, 'original questions\n');

const issues = [];

// Valid compound words for alternative-answer checking
const validCompounds = new Set([
  'sunlight','sunrise','sunset','sunburn','sunflower','sunscreen','sunshine',
  'moonlight','moonrise','moonshine','starlight','starfish','stardom',
  'rainbow','raincoat','raindrop','rainfall','rainforest','rainwater',
  'snowball','snowfall','snowflake','snowman','snowstorm','snowboard','snowdrop',
  'football','footprint','footstep','footwear','footpath','footnote','foothold',
  'baseball','baseline','basement','bedroom','bathroom','classroom','ballroom',
  'showroom','mushroom','darkroom','homework','housework','schoolwork',
  'teamwork','network','framework','clockwork','firework','fireworks',
  'blackbird','blackberry','blackboard','blacksmith','blackout','blackmail',
  'bluebell','blueberry','blueprint','greenhouse','household','warehouse',
  'treehouse','playhouse','lighthouse','firehouse','doorbell','doorstep',
  'doorway','doorknob','toothbrush','toothpaste','toothache','toothpick',
  'eyebrow','eyelash','eyelid','eyesight','eyewitness','armchair','armband',
  'handbag','handshake','handmade','handbook','handwriting','cupboard','cupcake',
  'goldfish','goldmine','playground','playmate','playtime','plaything',
  'seashell','seaside','seashore','seahorse','seagull','seaweed',
  'airport','aircraft','airline','airway','airmail','overcoat','overnight',
  'overcome','overlook','overflow','overtake','overtime','overboard',
  'underground','underwater','understand','underline','undertake','underwear',
  'something','somewhere','somebody','somehow','sometime','sometimes',
  'everything','everywhere','everybody','everyday','everyone',
  'nothing','nowhere','nobody','anything','anywhere','anybody','anyone','anytime',
  'backpack','background','backbone','backfire','backward','backyard','backstage',
  'daylight','daytime','daydream','daybreak','nightfall','nightmare','nighttime',
  'waterfall','waterproof','watercolour','watermark','watermelon',
  'fingertip','fingerprint','fingernail','newspaper','newsletter',
  'bookcase','bookmark','bookshelf','bookworm','crossword','crossroad','crossbow',
  'horseshoe','horsepower','horseback','thunderstorm','thunderbolt',
  'sandstorm','sandcastle','sandpaper','birthday','birthplace','birthmark',
  'outside','outward','outright','outlaw','outline','outcome','outdoor','output',
  'outbreak','outburst','outstanding','outnumber','outspoken',
  'halfway','hallway','highway','railway','doorway','pathway','gateway','runway',
  'anyway','stairway','waterway','heartache','heartbeat','heartbreak',
  'headache','headline','headband','headlight','headquarters','headmaster',
  'cowboy','tomboy','suitcase','bookcase','briefcase','staircase','showcase',
  'landscape','landlord','landmark','landslide','landmine',
  'timekeeper','timetable','timeline','timeout','lifetime','lifeguard',
  'lifestyle','lifeboat','fireman','fireplace','firework','firelight',
  'herself','himself','myself','yourself','itself','ourselves','themselves',
  'windmill','windscreen','windshield','snowstorm','hailstone','hailstorm',
  'horseback','horsefly','horsetail','horseplay','blackberry','blackbird',
  'blacksmith','blackout','whiteboard','whitewash','whiteout',
  'grandchild','grandfather','grandmother','grandparent','grandson','granddaughter',
  'bedroom','bathroom','classroom','courtroom','cloakroom','showroom',
  'countryside','counterpart','counterattack','wheelchair','wheelbarrow',
  'breakfast','breakthrough','breakdown','breakwater',
  'overlook','overcome','overflow','overcoat','overnight','overtime','overtake','overboard',
  'understand','underline','underground','underwater','undertake','underwear',
  'buttercup','butterfly','buttermilk',
  'scarecrow','saucepan','teaspoon','tablespoon','tablecloth',
  'strawberry','gooseberry','raspberry',
  'pancake','eggcup','popcorn','peanut',
  'fingertip','fingerprint','fingernail',
  'playground','playmate','playtime','plaything','playful',
  'easychair','armchair',
  'skateboard','snowboard','cardboard','chalkboard','dartboard','clipboard',
  'keyboard','scoreboard','skateboard','surfboard','switchboard',
]);

// Check each MC question
for (const q of orig) {
  if (q.questionType === 'select-two') continue;

  if (!q.question) {
    issues.push({ id: q.id, d: q.difficulty, type: 'NO_QUESTION' });
    continue;
  }

  const answer = q.options?.[q.correct];
  if (!answer) {
    issues.push({ id: q.id, d: q.difficulty, type: 'BAD_INDEX', detail: 'correct=' + q.correct });
    continue;
  }

  const inFront = q.question.match(/in front of both '([^']+)' and '([^']+)'/);
  const goAfter = q.question.match(/after both '([^']+)' and '([^']+)'/);

  if (!inFront && !goAfter) {
    issues.push({ id: q.id, d: q.difficulty, type: 'ODD_FORMAT', detail: q.question.substring(0, 60) });
    continue;
  }

  const t1 = (inFront || goAfter)[1].toLowerCase();
  const t2 = (inFront || goAfter)[2].toLowerCase();

  let c1, c2;
  if (inFront) { c1 = answer.toLowerCase() + t1; c2 = answer.toLowerCase() + t2; }
  else { c1 = t1 + answer.toLowerCase(); c2 = t2 + answer.toLowerCase(); }

  // Check if answer compounds are in our dictionary
  if (!validCompounds.has(c1)) {
    issues.push({ id: q.id, d: q.difficulty, type: 'ANSWER_NOT_COMPOUND?', detail: c1 });
  }
  if (!validCompounds.has(c2)) {
    issues.push({ id: q.id, d: q.difficulty, type: 'ANSWER_NOT_COMPOUND?', detail: c2 });
  }

  // Check for alternative valid answers
  for (let i = 0; i < q.options.length; i++) {
    if (i === q.correct) continue;
    const opt = q.options[i].toLowerCase();
    let alt1, alt2;
    if (inFront) { alt1 = opt + t1; alt2 = opt + t2; }
    else { alt1 = t1 + opt; alt2 = t2 + opt; }

    if (validCompounds.has(alt1) && validCompounds.has(alt2)) {
      issues.push({ id: q.id, d: q.difficulty, type: 'ALT_ANSWER', detail: opt + ' also works: ' + alt1 + ', ' + alt2 + ' (answer: ' + answer.toLowerCase() + ')' });
    }
  }

  // Check explanation mentions the answer
  if (q.explanation && !q.explanation.toLowerCase().includes(answer.toLowerCase())) {
    issues.push({ id: q.id, d: q.difficulty, type: 'EXPLANATION_MISMATCH', detail: 'Answer is ' + answer + ' but not in explanation' });
  }
}

// Check select-two questions
for (const q of orig) {
  if (q.questionType !== 'select-two') continue;
  const w1 = q.options?.[q.correctPair?.[0]];
  const w2 = q.options?.[q.correctPair?.[1]];
  if (!w1 || !w2) {
    issues.push({ id: q.id, d: q.difficulty, type: 'BAD_CORRECTPAIR' });
    continue;
  }
  const compound = w1.toLowerCase() + w2.toLowerCase();
  if (!validCompounds.has(compound)) {
    issues.push({ id: q.id, d: q.difficulty, type: 'S2_NOT_COMPOUND?', detail: compound });
  }
}

// Difficulty distribution
const dd = { 1: 0, 2: 0, 3: 0 };
for (const q of orig) dd[q.difficulty]++;

// Duplicate questions (same answer + same target words)
const seen = {};
for (const q of orig) {
  if (q.questionType === 'select-two') continue;
  const answer = q.options?.[q.correct]?.toLowerCase();
  const key = answer + ':' + q.question?.substring(0, 50);
  if (seen[key]) {
    issues.push({ id: q.id, d: q.difficulty, type: 'DUPLICATE', detail: 'Same as Q' + seen[key] });
  }
  seen[key] = q.id;
}

// Answer frequency
const af = {};
for (const q of orig) {
  if (q.questionType === 'select-two') continue;
  const ans = q.options?.[q.correct]?.toLowerCase();
  if (ans) {
    if (!af[ans]) af[ans] = [];
    af[ans].push(q.id);
  }
}

// Print results
console.log('=== ISSUES ===');
const byType = {};
for (const i of issues) {
  if (!byType[i.type]) byType[i.type] = [];
  byType[i.type].push(i);
}
for (const [type, items] of Object.entries(byType)) {
  console.log('\n' + type + ' (' + items.length + '):');
  for (const i of items.slice(0, 20)) {
    console.log('  Q' + i.id + '(D' + i.d + '): ' + (i.detail || ''));
  }
  if (items.length > 20) console.log('  ... and ' + (items.length - 20) + ' more');
}

console.log('\n=== DISTRIBUTION ===');
console.log('D1:', dd[1], 'D2:', dd[2], 'D3:', dd[3]);

console.log('\n=== ANSWER USED 3+ TIMES ===');
for (const [word, ids] of Object.entries(af).sort((a, b) => b[1].length - a[1].length)) {
  if (ids.length >= 3) console.log('  ' + word + ': Q' + ids.join(', Q'));
}

console.log('\nTotal issues:', issues.length);

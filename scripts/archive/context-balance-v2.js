const fs = require('fs');
const content = fs.readFileSync('src/App.js', 'utf8');
const lines = content.split('\n');

const topicRanges = {
  'Percentages': [9, 1095],
  'Decimals': [1096, 2365],
  'Long Division': [2366, 3571],
  'Ratio & Proportion': [3572, 4900],
  'Fractions': [4901, 6105],
  'Long Multiplication': [6106, 7255],
  'Algebra': [7256, 8341],
  'Place Value': [8342, 9507],
  'Negative Numbers': [9508, 10593],
  'Prime Numbers': [10594, 11558],
  'Area & Perimeter': [11559, 12680],
  'Volume': [12681, 13786],
  'Angles & Shapes': [13787, 14877],
  'Sequences': [14878, 15946],
  'Data Handling': [15947, 17149],
  'Speed, Distance, Time': [17150, 18078]
};

// A question has context if it references a real-world scenario, person, or situation
// NOT just "What is X + Y?" or "Calculate..." or "Simplify..." etc.
function hasContext(q) {
  // Strong context indicators - real-world scenarios
  const contextPatterns = [
    /[A-Z][a-z]{2,}\s+(has|had|is|was|went|goes|makes|buys|earns|saves|scores|collects|packs|divides|shares|drinks|eats|walks|runs|reads|uses|fills|pours|plants|bakes|sells|picks|paints|cuts|measures|spends|pays|receives|gives|takes|starts|finishes|drives|travels|swims|cycles|climbs|counts|arranges|raises|donates|records|rounds|writes|reports|says|finds|creates|thinks|spots|notices|sees|works|plays|builds|grows|adds|drops|loses|needs|wants|likes|checks|answers|solves|puts|sets|gets|keeps|throws|catches|mixes|packs|stacks|lines)/i,
    /\b(In a game|In a quiz|In a puzzle|In a maths|On a quiz|On a challenge|On a number|At a |For a )\b/i,
    /\b(pattern on|puzzle card|challenge card|factor tree|number machine|maths challenge|quiz card)\b/i,
    /\b(video game|board game|computer game|card game|dice game)\b/i,
    /\b(shop|store|supermarket|bakery|cafe|restaurant|cinema|museum|library|park|garden|farm|school|class|classroom|playground|swimming pool|football|cricket|rugby|netball|tennis|athletics|gym|stadium|concert|festival|party|birthday|Christmas|Easter|trip|journey|holiday|train|bus|car|bike|boat|plane|airport|station|hospital|church|village|town|city)\b/i,
    /\b(pupil|student|teacher|children|child|boy|girl|baby|parent|mum|dad|brother|sister|friend|neighbour|baker|farmer|driver|pilot|nurse|doctor|chef|builder|gardener|ranger|organiser|headteacher|manager|coach)\b/i,
    /\b(recipe|cake|pizza|biscuit|chocolate|sweet|fruit|vegetable|egg|flour|butter|milk|juice|water bottle|lunchbox|sandwich|ice cream|loaf|loaves)\b/i,
    /\b(pocket money|savings|charity|donation|fundraiser|sponsored|sale|discount|reduced|offer|voucher|ticket|entrance fee)\b/i,
    /\b(ribbon|rope|wire|fabric|string|tape|paint|pencil|pen|crayon|paper|card|sticker|stamp|marble|bead|coin|badge|balloon|present|gift|toy|book|page|shelf|shelves|box|bag|crate|jar|bottle|jug|tin|bowl|tray|plate|cup)\b/i,
    /\b(flower|tree|plant|seed|sunflower|lily|rose|pet|dog|cat|fish|bird|rabbit|hamster|animal|horse|cow|sheep|chicken|butterfly|bee|ladybird)\b/i,
    /\b(thermometer|temperature|weather|forecast|season|rain|snow|sun|wind|cloud)\b/i,
    /\b(tank|pool|container|pond|aquarium|bath|bucket|barrel|reservoir|dam)\b/i,
    /\b(building|house|room|wall|floor|ceiling|roof|door|window|fence|path|gate|bridge|tower|pyramid|monument)\b/i,
    /\b(field|pitch|court|track|lane|road|street|mile|kilometre|distance|speed|race|lap|sprint|marathon|relay)\b/i,
    /\b(survey|vote|poll|chart shows|graph shows|table shows|timetable|data|results)\b/i,
    /\b(assembly|choir|orchestra|team|club|group|committee|council|company|factory|warehouse|office|cinema)\b/i,
    /\b(submarine|diver|lift|elevator|underground|basement|attic|mountain|hill|valley|cliff|cave|island|beach|river|lake|ocean|sea)\b/i,
    /\b(counter|meter|pedometer|odometer|scale|dial|display|scoreboard|leaderboard|website|app|phone|computer|printer|camera)\b/i,
    /\b(morning|afternoon|evening|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|January|February|March|April|May|June|July|August|September|October|November|December|spring|summer|autumn|winter|week|month|year|term|half-term|holiday)\b/i,
    /\b(bus stop|passengers|crew|audience|crowd|spectators|visitors|customers|residents|population|winners|members|runners|swimmers|cyclists|participants)\b/i,
    /\b(map|compass|direction|north|south|east|west|angle of elevation|bearing)\b/i,
    /\b(pocket|wallet|purse|bank|account|loan|interest|profit|loss|budget|allowance|wages|salary|income|cost|price|total|change|receipt|bill)\b/i,
    /\b(kg|kilogram|gram|litre|millilitre|centimetre|metre|millimetre|°C|degrees)\b/i,
    /\b(bacteria|colony|rumour|population|growth)\b/i,
  ];

  for (const pat of contextPatterns) {
    if (pat.test(q)) return true;
  }
  return false;
}

console.log('CONTEXT BALANCE (STRICT) BY TOPIC\n');
console.log('Topic                    | Total | Context | Raw   | Context%');
console.log('-------------------------|-------|---------|-------|--------');

let grandTotal = 0, grandContext = 0, grandRaw = 0;
const topicDetails = {};

for (const [topic, [start, end]] of Object.entries(topicRanges)) {
  let total = 0, contextual = 0;
  const rawQuestions = [];

  for (let i = start; i <= end; i++) {
    const m = lines[i]?.match(/question:\s*"(.+)"/);
    if (!m) continue;
    total++;
    const q = m[1];

    if (hasContext(q)) {
      contextual++;
    } else {
      // Find the id
      let id = '?';
      for (let j = i - 3; j < i; j++) {
        const idMatch = lines[j]?.match(/id:\s*(\d+)/);
        if (idMatch) { id = idMatch[1]; break; }
      }
      rawQuestions.push({ id, line: i, text: q.substring(0, 80) });
    }
  }

  const raw = total - contextual;
  const pct = total > 0 ? Math.round(contextual / total * 100) : 0;
  const name = topic.padEnd(25);
  console.log(`${name}| ${String(total).padStart(5)} | ${String(contextual).padStart(7)} | ${String(raw).padStart(5)} | ${pct}%`);

  grandTotal += total;
  grandContext += contextual;
  grandRaw += raw;
  topicDetails[topic] = { total, contextual, raw, pct, rawQuestions };
}

console.log('-------------------------|-------|---------|-------|--------');
const grandPct = Math.round(grandContext / grandTotal * 100);
console.log(`${'TOTAL'.padEnd(25)}| ${String(grandTotal).padStart(5)} | ${String(grandContext).padStart(7)} | ${String(grandRaw).padStart(5)} | ${grandPct}%`);

console.log(`\nTarget: 75-80% contextual. Currently: ${grandPct}%`);
console.log(`Need to convert ${Math.max(0, Math.ceil(grandTotal * 0.77 - grandContext))} more raw → contextual to reach 77%\n`);

// Show worst topics and sample raw questions
console.log('=== TOPICS NEEDING MOST WORK ===\n');
const sorted = Object.entries(topicDetails).sort((a, b) => a[1].pct - b[1].pct);
for (const [topic, data] of sorted) {
  if (data.pct >= 80) continue;
  console.log(`${topic} (${data.pct}% contextual, ${data.raw} raw questions):`);
  const sample = data.rawQuestions.slice(0, 5);
  for (const q of sample) {
    console.log(`  ID ${q.id}: "${q.text}..."`);
  }
  if (data.rawQuestions.length > 5) {
    console.log(`  ... and ${data.rawQuestions.length - 5} more`);
  }
  console.log();
}

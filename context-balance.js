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

// Indicators of contextual/word problems
const contextIndicators = [
  /shop/i, /buy/i, /bought/i, /spend/i, /spent/i, /cost/i, /price/i, /pay/i, /paid/i,
  /garden/i, /field/i, /room/i, /wall/i, /fence/i, /path/i, /pool/i, /playground/i,
  /school/i, /class/i, /student/i, /pupil/i, /teacher/i, /children/i,
  /recipe/i, /bake/i, /cake/i, /pizza/i, /sweet/i, /chocolate/i,
  /share/i, /split/i, /divide.*equally/i, /each person/i, /each child/i,
  /journey/i, /drive/i, /walk/i, /travel/i, /train/i, /bus/i, /car/i,
  /save/i, /saving/i, /pocket money/i, /earn/i,
  /temperature/i, /thermometer/i, /weather/i,
  /measure/i, /weigh/i, /pour/i, /fill/i, /tank/i, /bottle/i, /jug/i,
  /farm/i, /animal/i, /pet/i, /dog/i, /cat/i,
  /sport/i, /game/i, /score/i, /team/i, /race/i, /run/i, /lap/i,
  /party/i, /birthday/i, /present/i, /gift/i,
  /library/i, /book/i, /read/i, /page/i,
  /pack/i, /box/i, /bag/i, /crate/i, /shelf/i,
  /collect/i, /stamp/i, /sticker/i, /card/i, /marble/i, /bead/i, /coin/i,
  /sale/i, /discount/i, /offer/i, /reduced/i,
  /survey/i, /vote/i, /poll/i, /chart/i, /graph/i, /table shows/i,
  /\b[A-Z][a-z]+\b.*\b(has|had|is|was|went|goes|makes|buys|earns|saves|scores|collects|packs|divides|shares)\b/,
  /company/i, /factory/i, /bakery/i, /charity/i, /museum/i, /cinema/i,
  /submarine/i, /diver/i, /lift/i, /floor/i, /building/i, /height of/i,
  /ribbon/i, /rope/i, /wire/i, /fabric/i, /string/i, /tape/i,
  /water/i, /paint/i, /juice/i, /milk/i, /flour/i,
  /map/i, /scale/i, /distance/i, /speed/i, /time.*hour/i, /minute/i,
  /people/i, /families/i, /winners/i, /organizations/i, /loaves/i,
  /parking/i, /concert/i, /ticket/i, /cinema/i, /swimming/i,
];

// Indicators of raw calculation
const rawIndicators = [
  /^What is \d/,
  /^Calculate /,
  /^Work out /,
  /^Simplify /,
  /^What (?:fraction|percentage|decimal)/,
  /^Convert /,
  /^Round /,
  /^Order these/,
  /^Arrange these/,
  /^Which (?:is|of these|number) (?:larger|smaller|greatest|closest|prime|NOT prime|composite)/,
  /^How many factors/,
  /^What is the (?:HCF|LCM|sum|product|difference|quotient|remainder|range|mean|median|mode)/i,
  /^Find the (?:missing|next|value|nth)/i,
  /^What is the prime/,
  /^Solve /,
  /^If [a-z] = /,
  /^What value of/,
  /^Which expression/,
  /^What comes next/,
  /^The sequence/,
  /^Look at this sequence/,
];

console.log('CONTEXT BALANCE BY TOPIC\n');
console.log('Topic                    | Total | Context | Raw   | Context%');
console.log('-------------------------|-------|---------|-------|--------');

for (const [topic, [start, end]] of Object.entries(topicRanges)) {
  let total = 0, contextual = 0, raw = 0;

  for (let i = start; i <= end; i++) {
    const m = lines[i]?.match(/question:\s*"(.+)"/);
    if (!m) continue;
    total++;
    const q = m[1];

    let isContext = false;
    for (const pat of contextIndicators) {
      if (pat.test(q)) { isContext = true; break; }
    }

    if (isContext) {
      contextual++;
    } else {
      let isRaw = false;
      for (const pat of rawIndicators) {
        if (pat.test(q)) { isRaw = true; break; }
      }
      if (isRaw) raw++;
      else contextual++; // Ambiguous = contextual (e.g. diagram questions, "which shape" etc.)
    }
  }

  const pct = total > 0 ? Math.round(contextual / total * 100) : 0;
  const name = topic.padEnd(25);
  console.log(`${name}| ${String(total).padStart(5)} | ${String(contextual).padStart(7)} | ${String(raw).padStart(5)} | ${pct}%`);
}

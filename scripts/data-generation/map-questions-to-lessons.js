/**
 * Maps questions to micro-lesson sub-concepts.
 *
 * Usage: node scripts/map-questions-to-lessons.js [topic]
 * Example: node scripts/map-questions-to-lessons.js fractions
 *
 * Outputs: scripts/question-lesson-map.json
 */

const fs = require('fs');
const path = require('path');

// ── Load question data from App.js ──
function extractQuestions(topic) {
  const appContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'App.js'), 'utf8');

  // Find the topic's question block
  const topicPattern = new RegExp(`${topic}:\\s*\\{[\\s\\S]*?questions:\\s*\\[`, 'm');
  const match = topicPattern.exec(appContent);
  if (!match) {
    console.error(`Topic "${topic}" not found in App.js`);
    return [];
  }

  // Extract all question objects for this topic
  const startIdx = match.index + match[0].length;
  let depth = 1;
  let i = startIdx;
  while (i < appContent.length && depth > 0) {
    if (appContent[i] === '[') depth++;
    if (appContent[i] === ']') depth--;
    i++;
  }
  const questionsStr = appContent.substring(startIdx, i - 1);

  // Parse individual questions using regex (not eval — safer)
  const questions = [];
  const qRegex = /\{\s*id:\s*(\d+),[\s\S]*?question:\s*"([^"]*)"[\s\S]*?options:\s*\[([^\]]*)\][\s\S]*?correct:\s*(\d+)[\s\S]*?explanation:\s*"([^"]*)"[\s\S]*?\}/g;
  let qMatch;
  while ((qMatch = qRegex.exec(questionsStr)) !== null) {
    const options = qMatch[3].match(/"([^"]*)"/g)?.map(o => o.replace(/"/g, '')) || [];
    const correctIdx = parseInt(qMatch[4]);
    questions.push({
      id: parseInt(qMatch[1]),
      question: qMatch[2],
      options,
      correctAnswer: options[correctIdx] || '?',
      explanation: qMatch[5]
    });
  }

  return questions;
}

// ── Load sub-concepts for a topic ──
function loadSubConcepts(topic) {
  // Map topic keys to staging file names
  const fileMap = {
    fractions: 'fractions-subconcepts.js',
    algebra: 'algebra-subconcepts.js',
    anglesshapes: 'anglesshapes-subconcepts.js',
    areaperimeter: 'areaperimeter-subconcepts.js',
    datahandling: 'datahandling-subconcepts.js',
    decimals: 'decimals-subconcepts.js',
    longdivision: 'longdivision-subconcepts.js',
    longmultiplication: null, // sub-concepts already in lessonData.js
    negativenumbers: 'negativenumbers-subconcepts.js',
    percentages: 'percentages-subconcepts.js',
    placevalue: 'placevalue-subconcepts.js',
    primenumbers: 'primenumbersfactors-subconcepts.js',
    ratio: 'ratio-subconcepts.js',
    sequences: 'sequences-subconcepts.js',
    speeddistancetime: 'speeddistancetime-subconcepts.js',
    volume: 'volume-subconcepts.js',
  };

  const fileName = fileMap[topic];
  if (!fileName) {
    // Try to load sub-concepts from lessonData.js directly (e.g. longmultiplication)
    const lessonDataContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'microLessons', 'lessonData.js'), 'utf8');
    const topicMatch = lessonDataContent.match(new RegExp(`${topic}:\\s*\\{[\\s\\S]*?subConcepts:\\s*\\[([\\s\\S]*?)\\n\\s{2}\\]`, 'm'));
    if (!topicMatch) {
      console.error(`No staging file or lessonData entry for topic "${topic}"`);
      return [];
    }
    // Extract sub-concept IDs and names from the matched section
    const subConcepts = [];
    const scRegex = /id:\s*"([^"]+)",\s*\n\s*name:\s*"([^"]+)",\s*\n\s*category:\s*"([^"]+)"/g;
    let sm;
    while ((sm = scRegex.exec(topicMatch[1])) !== null) {
      subConcepts.push({ id: sm[1], name: sm[2], category: sm[3], learningGoals: [] });
    }
    return subConcepts;
  }

  const filePath = path.join(__dirname, '..', 'src', 'microLessons', 'staging', fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // Extract sub-concept IDs, names, and learning goals
  const subConcepts = [];
  const scRegex = /{\s*id:\s*"([^"]+)",\s*\n\s*name:\s*"([^"]+)",\s*\n\s*category:\s*"([^"]+)"/g;
  let m;
  while ((m = scRegex.exec(content)) !== null) {
    // Check indent level — sub-concepts are at 4-space indent
    const lineStart = content.lastIndexOf('\n', m.index) + 1;
    const indent = m.index - lineStart;
    if (indent < 8) {
      // Get learning goals
      const goalsMatch = content.substring(m.index, m.index + 500).match(/learningGoal:\s*\[([\s\S]*?)\]/);
      const goals = goalsMatch
        ? goalsMatch[1].match(/"([^"]+)"/g)?.map(g => g.replace(/"/g, '')) || []
        : [];

      subConcepts.push({
        id: m[1],
        name: m[2],
        category: m[3],
        learningGoals: goals
      });
    }
  }

  // Also add master method
  const lessonDataContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'microLessons', 'lessonData.js'), 'utf8');
  const masterRegex = new RegExp(`id: "master-[^"]*"[\\s\\S]*?category: "master"`, 'g');
  // Find master methods within this topic's section
  const topicSection = lessonDataContent.match(new RegExp(`${topic}:\\s*\\{[\\s\\S]*?(?=\\n\\s{2}\\w+:|\\n};)`, 'm'));
  if (topicSection) {
    const masterMatch = topicSection[0].match(/id: "(master-[^"]+)"[\s\S]*?name: "([^"]+)"/);
    if (masterMatch) {
      subConcepts.unshift({
        id: masterMatch[1],
        name: masterMatch[2],
        category: 'master',
        learningGoals: ['Master method for this topic']
      });
    }
  }

  return subConcepts;
}

// ── Smart pattern detection ──
function detectPatterns(question) {
  const q = question.question;
  const e = question.explanation;
  const combined = `${q} ${e}`.toLowerCase();
  const patterns = {};

  // Detect fraction arithmetic: "What is A/B + C/D?" or "What is A/B - C/D?"
  const fracArith = q.match(/(\d+)\/(\d+)\s*([+\-×])\s*(\d+)\/(\d+)/);
  if (fracArith) {
    const denom1 = parseInt(fracArith[2]);
    const denom2 = parseInt(fracArith[5]);
    const op = fracArith[3];
    const sameDenom = denom1 === denom2;

    if (op === '+') {
      patterns.operation = sameDenom ? 'adding-same-denom' : 'adding-diff-denom';
    } else if (op === '-') {
      patterns.operation = sameDenom ? 'subtracting-same-denom' : 'subtracting-diff-denom';
    } else if (op === '×') {
      patterns.operation = 'multiplying-fractions';
    }
  }

  // Detect fraction × whole number: "5/8 × 24" or "1/3 of 24"
  const fracTimesWhole = q.match(/(\d+)\/(\d+)\s*[×x]\s*(\d+)/);
  if (fracTimesWhole) patterns.operation = 'multiplying-fractions';

  // Detect "fraction of amount" patterns
  if (combined.match(/\d+\/\d+\s+of\s+(a\s+)?(\d+|the|a|an|his|her|their|some)/)) {
    patterns.operation = 'fraction-of-amount';
  }
  if (combined.match(/how many/) && combined.match(/\d+\/\d+/)) {
    patterns.operation = 'fraction-of-amount';
  }

  // Detect simplifying/equivalent
  if (combined.includes('simplest form') || combined.includes('simplify') || combined.includes('equivalent')) {
    patterns.concept = 'simplifying-fractions';
  }

  // Detect comparing
  if (combined.match(/which.*(largest|smallest|bigger|greater|closer|larger|smaller)/) || combined.includes('ascending') || combined.includes('descending') || combined.includes('order these')) {
    patterns.concept = 'comparing-fractions';
  }

  // Detect conversions
  if (combined.includes('as a decimal') || combined.includes('to a decimal') || combined.includes('decimal equivalent') || combined.includes('what decimal')) {
    patterns.concept = 'fraction-to-decimal';
  }
  if (combined.includes('as a fraction') || (combined.match(/0\.\d+/) && combined.includes('fraction'))) {
    patterns.concept = 'decimal-to-fraction';
  }
  if (combined.includes('percentage') || combined.includes('percent') || combined.includes('as a %')) {
    patterns.concept = 'fraction-to-percentage';
  }

  // Detect mixed/improper
  if (combined.includes('mixed number') || combined.includes('improper') || combined.match(/\d+\s+\d+\/\d+/)) {
    patterns.concept = 'mixed-improper';
  }

  // Detect word problems with addition/subtraction in context
  if (!patterns.operation && !patterns.concept) {
    // Story-based fraction addition (e.g. "drinks 1/4 and another 1/4")
    const fracs = q.match(/\d+\/\d+/g);
    if (fracs && fracs.length >= 2) {
      const denoms = fracs.map(f => parseInt(f.split('/')[1]));
      const allSame = denoms.every(d => d === denoms[0]);

      if (combined.match(/altogether|total|in total|both|combined|and another|plus/)) {
        patterns.operation = allSame ? 'adding-same-denom' : 'adding-diff-denom';
      }
      if (combined.match(/left|remain|used|ate|drank|spent|took away|fewer|less than|difference/)) {
        patterns.operation = allSame ? 'subtracting-same-denom' : 'subtracting-diff-denom';
      }
    }
  }

  // ── Generic decimal operation detection ──
  if (combined.match(/\d+\.\d+/) && !patterns.operation && !patterns.concept) {
    if (combined.match(/cut into \d+ equal|equal pieces|equal blocks|equal parts|each .* weigh|how long is each/)) {
      patterns.concept = 'dividing-to-decimal';
    } else if (combined.match(/in total|total|altogether|combined|how far .* in total|how much .* total/)) {
      if (combined.match(/\d+\.\d+.*times|\d+ times|each day for|walks along it \d+ times|how much do \d+/)) {
        patterns.concept = 'multiplying-decimals-whole';
      }
    } else if (combined.match(/how much .* left|remain|used|litres are used/)) {
      patterns.concept = 'subtracting-decimals';
    }
  }

  // ── Algebra expression detection ──
  if (combined.match(/saves £[a-z]|buys [a-z] |has [a-z] |£[a-z] each|[a-z] each week|[a-z] kilometres/)) {
    if (!patterns.concept) patterns.concept = 'writing-expressions';
  }
  if (combined.match(/how many .* start with|how many .* did .* begin|what was the original number/)) {
    if (!patterns.concept) patterns.concept = 'inverse-operations';
  }

  // ── Negative numbers context detection ──
  if (combined.match(/-\d+/) || combined.match(/negative|below zero/)) {
    if (combined.match(/halfway between/)) {
      if (!patterns.concept) patterns.concept = 'difference-across-zero';
    } else if (combined.match(/car park|floors|floor number|above ground|below ground/)) {
      if (!patterns.concept) patterns.concept = 'real-world-contexts';
    } else if (combined.match(/quiz.*correct.*wrong|scored.*points.*more|scored.*points.*fewer/)) {
      if (!patterns.concept) patterns.concept = 'real-world-contexts';
    }
  }

  return patterns;
}

function scoreMatch(question, subConcept) {
  const patterns = detectPatterns(question);
  const qText = `${question.question} ${question.explanation}`.toLowerCase();
  let score = 0;

  // Strong match: detected pattern matches sub-concept ID
  if (patterns.operation === subConcept.id) score += 10;
  if (patterns.concept === subConcept.id) score += 10;

  // Keyword sets for all maths topics
  const keywordSets = {
    // ── FRACTIONS ──
    'simplifying-fractions': ['simplif', 'simplest form', 'lowest terms', 'cancel', 'reduce', 'equivalent'],
    'comparing-fractions': ['larger', 'largest', 'smaller', 'smallest', 'compare', 'order', 'greater', 'ascending', 'descending'],
    'adding-same-denom': ['add', 'plus', 'altogether', 'total'],
    'subtracting-same-denom': ['subtract', 'minus', 'take away', 'left', 'remain'],
    'adding-diff-denom': ['different denominator', 'common denominator', 'lcd'],
    'subtracting-diff-denom': ['different denominator'],
    'fraction-of-amount': ['fraction of', 'how many', 'find 1/', 'find 2/', 'find 3/'],
    'fraction-to-decimal': ['as a decimal', 'convert to decimal', 'what decimal'],
    'decimal-to-fraction': ['as a fraction', 'convert to fraction'],
    'fraction-to-percentage': ['percentage', 'percent', 'as a %'],
    'mixed-improper': ['mixed number', 'improper', 'whole number'],
    'multiplying-fractions': ['multiply', '×'],
    'fraction-word-problems': [],
    'master-adding-fractions': ['different denominator', 'common denominator'],

    // ── PERCENTAGES ──
    'percent-means-per-hundred': ['per cent', 'per hundred', 'out of 100', '/100'],
    'common-percentages': ['which has the greatest value', 'which has the smallest value', 'same value', 'they are all equal', '50% is the same as', '25% is the same as'],
    'finding-10-percent': ['10% of', 'divide by 10', '÷ 10', '10 percent', '5% of', 'find 10%'],
    'building-percentages': ['what is 12%', 'what is 15%', 'what is 18%', 'what is 22%', 'what is 35%', 'what is 45%', 'what is 8%', '% of'],
    'express-as-percentage': ['what percentage', 'as a percentage', 'percentage are', 'percentage did', 'percentage is', '× 100'],
    'percentage-increase': ['increase', 'increases', 'more than before', 'price goes up', 'rises by', 'goes up by', '% more'],
    'percentage-decrease': ['decrease', 'discount', 'reduced', 'sale price', 'off', 'reduction', 'save', '% off'],
    'percent-to-fraction': ['percentage to fraction', '% as a fraction', 'percentage as a fraction'],
    'percent-to-decimal': ['decimal to a percentage', '0.35', '0.42'],
    'comparing-fdp': ['0.15, 18%', 'convert all to', 'order from'],
    'reverse-percentage': ['original price', 'what was the original', 'before the'],
    'successive-percentages': ['successive', 'two successive', 'two discounts', 'first discount'],
    'percentage-word-problems': ['not blue', 'not chocolate', 'neither', 'how many are', 'how many voted'],

    // ── DECIMALS ──
    'decimal-place-value': ['tenths', 'hundredths', 'thousandths', 'place value', 'what does the', 'what is the value of the'],
    'comparing-decimals': ['furthest', 'shortest', 'heaviest', 'lightest', 'closest to', 'order from', 'in order', 'who threw', 'who jumped'],
    'subtracting-decimals': ['how much is left', 'how much longer', 'how much remains', 'how many litres are left', 'pouring out', 'saws off'],
    'multiply-by-10-100-1000': ['× 10', '× 100', '× 1000', 'multiply by 10', 'multiply by 100', 'how many pence', 'how many centimetres', 'how many millilitres'],
    'divide-by-10-100-1000': ['÷ 10', '÷ 100', '÷ 1000', 'divide by 10', 'divide by 100', 'cut into 10 equal', 'weight of one sweet'],
    'multiplying-decimals-whole': ['total cost', 'total weight', 'total shelf width', 'total distance', 'bags weigh altogether', 'tickets cost'],
    'dividing-to-decimal': ['share equally', 'shared equally', 'split equally', 'divided equally', 'each child get', 'each person get', 'poured equally'],
    'rounding-decimals': ['round', 'rounding', 'decimal place', 'one decimal place', 'two decimal places'],
    'decimal-to-fraction': ['decimal to a fraction', 'as a fraction', 'which fraction is the same as', 'fraction is equivalent'],
    'fraction-to-decimal': ['as a decimal', 'written as a decimal', 'fraction to decimal'],
    'decimal-to-percentage': ['as a percentage', 'decimal to percentage'],
    'multiplying-decimal-by-decimal': ['0.9 × 0.9', '0.8 × 0.5', '0.7 × 0.6', '7.2 × 0.3', 'decimal places total'],
    'dividing-decimal-by-decimal': ['÷ 0.', 'divided by 0.', 'how many 0.', 'each dose is 0.'],
    'decimal-word-problems': ['change from', 'shopping', 'buys a', 'spends'],

    // ── LONG DIVISION ──
    'sharing-equally': ['share', 'shared', 'equally', 'split', 'each', 'per person', 'per table', 'per group', 'per child', 'does each'],
    'short-division-remainders': ['remainder', 'left over', 'r '],
    'long-division-method': ['goes into', 'bring down', 'how many boxes', 'how many packs', 'how many bags', 'packs of', 'boxes of', 'bags of', 'groups of'],
    'interpreting-remainders': ['completely', 'how many complete', 'full boxes', 'coaches are needed', 'round up'],
    'estimation-checking': ['check', 'estimate', 'approximately', 'close to', 'roughly'],
    'dividing-word-problems': ['per day', 'per hour', 'per week', 'each day', 'each week', 'each student'],

    // ── RATIO ──
    'ratio-notation': ['ratio of', 'for every', 'to every', 'the ratio'],
    'simplifying-ratios': ['simplify', 'simplest form', 'simplif', 'lowest terms'],
    'finding-missing-values': ['parts', 'total parts', 'each part', 'in the ratio'],
    'scaling-recipes': ['recipe', 'biscuits', 'cookies', 'cupcakes', 'muffins', 'pancakes', 'flour', 'butter', 'eggs', 'sugar', 'servings'],
    'unitary-method': ['per minute', 'per hour', 'per second', 'copies in', 'prints', 'produces', 'at the same speed', 'at the same rate'],
    'scale-factors-maps': ['map', 'scale', 'model', '1cm :', '1 cm :', 'actual distance', 'real distance', 'real length', 'how tall is the real', 'how long is the real'],
    'ratio-word-problems': ['share', 'split', 'divide', 'how much more', 'paint', 'squash', 'lemonade', 'cordial', 'juice'],

    // ── ALGEBRA ──
    'using-letters': ['which expression', 'years older', 'years younger', 'times as old', 'pencils cost', 'tickets cost', 'books cost'],
    'substitution': ['if p =', 'if x =', 'if y =', 'if m =', 'if n =', 'if k =', 'if a =', 'work out', 'substitute', 'a = 3', 'a = 4', 'b = 7', 'm = 6'],
    'two-step-equations': ['what is x', 'what is the value', 'find the value', 'solve', '2x +', '3x +', '4x +', '5x +', '6x -', '7x -', '4n +', '4y -'],
    'writing-expressions': ['which expression shows', 'total cost of both', 'total score', 'expression'],
    'function-machines': ['number machine', 'function machine', 'input', 'output', 'comes out', 'put in'],
    'simple-formulae': ['perimeter', 'formula', '2l + 10', '16 + 2w', '4s', 'rectangle has length'],
    'inverse-operations': ['working backwards', 'inverse', 'opposite', 'undo', 'thinks of a number', 'what number did'],
    'bidmas-brackets': ['bidmas', 'bodmas', 'brackets', 'order of operations'],

    // ── PLACE VALUE ──
    'reading-writing-numbers': ['written in digits', 'in digits', 'write this in digits', 'written in words'],
    'digit-value': ['value of the digit', 'what is the value', 'hundreds place', 'thousands place', 'tens place', 'which digit is in the'],
    'comparing-ordering': ['order from smallest to largest', 'order from largest to smallest', 'put them in order', 'closest to'],
    'rounding-nearest-1000-plus': ['round this to the nearest thousand', 'to the nearest thousand', 'nearest 1,000', 'nearest 10,000', 'nearest 100,000', 'to what has the number been rounded'],
    'rounding-decimals-pv': ['round this to one decimal place', 'to one decimal place', 'to two decimal places', 'nearest tenth'],
    'partitioning-pv': ['can be written as', 'sum of the thousands digit', 'sum of all the digits', 'digit sum'],
    'adding-subtracting-powers-10': ['if it gets 100 more', 'after one more donation', 'after spending £200', 'what number is 50 less', 'what number is 150 more', 'sold 800 more'],
    'making-numbers': ['largest 5-digit number', 'smallest 5-digit number', 'largest 4-digit number', 'smallest 4-digit number', 'largest number you can make', 'smallest number you can make', 'using the digits', 'each used once'],

    // ── NEGATIVE NUMBERS ──
    'understanding-negatives': ['which is larger', 'which is smaller', 'closest to zero', 'number line', 'further from zero'],
    'counting-through-zero': ['put these numbers in order', 'order from smallest to largest', 'ascending', 'descending'],
    'adding-to-negatives': ['rises by', 'risen by', 'warms up by', 'warmer', 'goes up', '°c warmer', 'deposits'],
    'subtracting-into-negatives': ['dropped by', 'drops by', 'it dropped', 'it fell', 'falls by', 'she dives', 'dives down'],
    'difference-across-zero': ['difference between', 'what is the difference', 'how far apart'],
    'temperature-problems': ['°c', 'temperature', 'thermometer', 'edinburgh', 'london', 'moscow', 'midnight', 'midday', 'overnight'],
    'real-world-contexts': ['bank balance', 'overdrawn', 'owes', 'borrows', 'pays back', 'account', 'sea level', 'below sea level', 'submarine', 'diver'],
    'negative-subtract-negative': ['-5 - 9', 'start at -', 'subtract 9', 'dropped by another', 'falls by another', 'dives down another'],

    // ── PRIME NUMBERS & FACTORS ──
    'identifying-primes': ['is a prime number', 'is not a prime number', 'prime number', 'not prime', 'which is prime', 'prime number between'],
    'factor-pairs': ['factor pairs', 'how many different factor pairs', 'arranged in equal rows', 'how many factors does', 'exactly 3 factors'],
    'common-factors-hcf': ['highest common factor', 'hcf', 'common factor', 'equal groups', 'identical packs', 'identical party bags', 'identical bunches', 'share them equally'],
    'common-multiples-lcm': ['lowest common multiple', 'lcm', 'common multiple', 'flash together', 'both leave together', 'both happen together', 'both be at the starting point', 'chimes'],
    'prime-factorisation': ['prime factorisation', 'prime factors', 'factor tree', 'product of prime'],
    'divisibility-rules': ['divide into it exactly', 'divides exactly', 'divisible by', 'divisibility'],
    'hcf-lcm-word-problems': ['hcf × lcm', 'product of the two numbers', 'hcf of three numbers'],
    'counting-factors': ['how many factors', 'count factors', 'score the most points', 'number of factors'],

    // ── AREA & PERIMETER ──
    'perimeter-rectangles': ['perimeter of', 'what is its perimeter', 'what is the perimeter', 'how much fencing', 'fence around', 'border around', 'all four sides'],
    'missing-side-perimeter': ['perimeter of 24 cm', 'perimeter of 32 cm', 'perimeter of 50 cm', 'has a perimeter of', 'what is its width', 'what is its length'],
    'missing-side-area': ['area of 48 square', 'area of 56 square', 'area of 72 square', 'has an area of'],
    'area-triangles': ['triangle', 'half base times height', '½ × base × height'],
    'area-parallelograms': ['parallelogram', 'base times height', 'base × perpendicular height'],
    'compound-shapes': ['l-shaped', 'l-shape', 'compound shape', 'two rectangles', 'cut from one corner', 'remaining area'],
    'area-vs-perimeter': ['difference between its perimeter and its area', 'same area does not mean same perimeter', 'which has the greater area', 'which rectangle'],
    'unit-conversion-area': ['square metres', 'cm²', 'm²', 'convert to metres', 'area in square metres'],
    'paths-and-borders': ['path', 'border', 'runs around the inside', 'flower border', 'outer minus inner', 'outer edge'],

    // ── VOLUME ──
    'volume-cubes': ['cube', 'edge × edge × edge', 'cube-shaped', 'identical cubes', 'cm edges'],
    'missing-dimension': ['what is its height', 'how tall is the box', 'has a volume of', 'what is the height'],
    'cube-root': ['what is the length of each edge', 'edge length from'],
    'volume-to-capacity': ['litres', 'litre', 'millilitres', 'how many millilitres', 'how many litres', 'volume in litres', '1-litre bottles'],
    'comparing-volumes': ['same volume', 'equal volumes', 'which statement is true', 'which has greater volume', 'first box', 'second box'],
    'scaling-volumes': ['twice as long', 'three times as long', 'doubling', 'tripling', 'edges that are twice'],
    'fraction-of-volume': ['halfway', 'half filled', 'three-quarters', 'two-thirds', 'fills it halfway', 'fraction of'],
    'volume-word-problems': ['fish tank', 'aquarium', 'swimming pool', 'storage unit', 'toy box', 'packing books', 'container'],

    // ── ANGLES & SHAPES ──
    'angle-types': ['acute', 'right angle', 'obtuse', 'straight', 'reflex', 'type of angle', 'what type'],
    'straight-line': ['straight line', 'on a straight line', 'angles on a straight line'],
    'around-a-point': ['around a point', 'at a point', 'meet at a point', 'angles at a point'],
    'quadrilateral-angles': ['quadrilateral', 'rhombus', 'trapezium', 'parallelogram', 'kite'],
    'isosceles-triangle': ['isosceles', 'two equal angles', 'base angle'],
    'right-angled-triangle': ['right-angled triangle', 'right-angled'],
    'algebraic-angles': ['2x°', '3x°', '4x°', '5x°', 'value of x', 'ratio 2:7', 'twice the size'],
    'exterior-angles': ['exterior angle', 'opposite interior angles'],
    'parallel-lines': ['parallel lines', 'transversal', 'corresponding angle', 'alternate angle'],
    'polygon-angles': ['pentagon', 'hexagon', 'heptagon', 'octagon', 'nonagon', 'decagon', 'dodecagon', 'regular polygon', 'interior angle', '-sided polygon'],
    'irregular-polygon-angle': ['irregular polygon', 'missing angle in a polygon'],

    // ── SEQUENCES ──
    'constant-difference': ['the rule', 'what is the rule', 'rule for this', 'adds', 'increases by', 'multiples of'],
    'continue-sequence': ['what comes next', 'next number', 'next term', 'missing number', 'if the pattern continues', 'how many will', 'how far will', 'how tall', 'what is the missing'],
    'find-nth-term': ['nth term', '8th term', '11th term', '12th term', '13th term', '15th term', 'how many terms'],
    'decreasing-sequences': ['counts backward', 'counting down', 'drained', 'loses', 'remaining', 'countdown', 'popped', 'subtracts'],
    'geometric-sequences': ['doubles', 'halves', 'triples', 'halving', 'doubling', 'tripling', 'multiply by 2', 'multiply by 3', 'divide by 3'],
    'special-sequences': ['square numbers', 'cube numbers', 'triangular numbers', '1, 4, 9, 16', '1, 8, 27, 64', '1, 3, 6, 10', 'n²'],
    'fibonacci-style': ['fibonacci', 'sum of the previous two', 'sum of the two before'],
    'two-step-rules': ['double and add', 'double and subtract', 'n² + 2n', 'n² + 1', 'n² - 1', 'differences double', 'differences increase'],

    // ── DATA HANDLING ──
    'finding-median': ['median', 'middle value', 'middle number'],
    'finding-mode': ['mode', 'most often', 'most common', 'appears most'],
    'calculating-range': ['range', 'highest - lowest', 'highest minus lowest'],
    'reading-bar-charts': ['bar chart', 'bar graph', 'reading the bar'],
    'reading-line-graphs': ['line graph', 'how much did the plant grow', 'growth between'],
    'reading-pie-charts': ['pie chart', 'fraction of time', 'out of 360', '° of the circle'],
    'reading-tables': ['two-way table', 'timetable', 'bus times', 'table shows'],
    'missing-from-mean': ['the mean of four numbers is', 'the mean of five numbers is', 'the mean of three numbers is', 'the mean of six numbers is', 'what is the missing', 'new mean', 'fifth friend'],
    'even-median': ['mean of the two middle', 'mean of the 3rd and 4th', 'even number of values'],
    'combined-averages': ['mode and range', 'mode and median', 'mode is 5, range', 'mode is 7, range'],

    // ── SPEED, DISTANCE, TIME ──
    'calculate-distance': ['how far', 'what distance', 'distance covered'],
    'calculate-time': ['how long does', 'how long to travel', 'how many hours'],
    'sdt-triangle': ['sdt triangle', 'speed distance time triangle'],
    'minutes-to-hours': ['in 20 minutes', 'in 30 minutes', 'in 40 minutes', 'in 25 minutes', 'in 15 minutes', '1 hour 30 minutes', '2 hours 30 minutes'],
    'metres-to-km': ['1500 metres', '2000 metres', '2500 metres', '3000 metres', 'metres to km'],
    'kmh-to-ms': ['m/s', 'metres per second', 'km/h to m/s'],
    'time-in-minutes': ['how many minutes', 'minutes does it take'],
    'average-speed': ['average speed', 'whole journey', 'then 60 km', 'then 100 km', 'then 80 km'],
    'sdt-word-problems': ['remaining journey', 'remaining distance', 'arrive on time'],

    // ── LONG MULTIPLICATION ──
    'lm-partitioning': ['partitioning', 'partition', 'break into parts'],
    'lm-grid-method': ['grid method', 'grid multiplication'],
    'lm-estimation': ['estimate', 'estimating', 'approximately', 'rough answer'],
    'lm-word-problems': ['how many altogether', 'in total', 'altogether', 'total cost', 'per day', 'per week', 'per hour', 'each day', 'rows of', 'boxes of', 'packets of'],
    'lm-checking': ['check', 'checking', 'inverse', 'verify'],
  };

  const keywords = keywordSets[subConcept.id] || [];
  for (const kw of keywords) {
    if (qText.includes(kw)) score += 2;
  }

  // Generic matching: use sub-concept name and learning goals as keywords
  // This works for ALL topics, not just fractions
  if (keywords.length === 0) {
    // Extract meaningful words from sub-concept name (3+ chars, not common words)
    const stopWords = new Set(['the', 'and', 'for', 'with', 'how', 'what', 'that', 'this', 'from', 'into', 'when', 'step', 'find', 'using', 'your', 'them', 'about', 'each', 'use']);
    const nameWords = subConcept.name.toLowerCase()
      .replace(/[—–\-()]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 3 && !stopWords.has(w));

    // Name word matching (strong signal)
    for (const word of nameWords) {
      if (qText.includes(word)) score += 2;
    }

    // Learning goal word matching (weaker signal)
    const goalText = (subConcept.learningGoals || []).join(' ').toLowerCase();
    const goalWords = goalText
      .replace(/[—–\-()]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 4 && !stopWords.has(w));

    const uniqueGoalWords = [...new Set(goalWords)];
    for (const word of uniqueGoalWords) {
      if (qText.includes(word)) score += 1;
    }
  }

  // Penalise master method slightly (prefer specific sub-concepts)
  if (subConcept.category === 'master' && score > 0) score -= 1;

  return score;
}

function mapQuestions(topic) {
  const questions = extractQuestions(topic);
  const subConcepts = loadSubConcepts(topic);

  console.log(`\nTopic: ${topic}`);
  console.log(`Questions: ${questions.length}`);
  console.log(`Sub-concepts: ${subConcepts.length}`);
  console.log(`Sub-concept IDs: ${subConcepts.map(sc => sc.id).join(', ')}\n`);

  const mappings = [];
  const gaps = [];

  for (const q of questions) {
    // Score each sub-concept for this question
    const scores = subConcepts.map(sc => ({
      subConceptId: sc.id,
      subConceptName: sc.name,
      score: scoreMatch(q, sc)
    })).sort((a, b) => b.score - a.score);

    const bestMatch = scores[0];
    const secondMatch = scores[1];

    if (bestMatch.score === 0) {
      // No match found
      gaps.push({
        questionId: q.id,
        question: q.question,
        explanation: q.explanation,
        reason: 'No keyword match found'
      });
      mappings.push({
        questionId: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        subConceptId: null,
        subConceptName: null,
        confidence: 'none',
        topScores: scores.slice(0, 3)
      });
    } else {
      const confidence = bestMatch.score >= 6 ? 'high'
        : bestMatch.score >= 3 ? 'medium'
        : 'low';

      mappings.push({
        questionId: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        subConceptId: bestMatch.subConceptId,
        subConceptName: bestMatch.subConceptName,
        confidence,
        score: bestMatch.score,
        secondChoice: secondMatch ? { id: secondMatch.subConceptId, score: secondMatch.score } : null
      });
    }
  }

  // Summary
  const high = mappings.filter(m => m.confidence === 'high').length;
  const medium = mappings.filter(m => m.confidence === 'medium').length;
  const low = mappings.filter(m => m.confidence === 'low').length;
  const none = mappings.filter(m => m.confidence === 'none').length;

  console.log(`Mapping results:`);
  console.log(`  High confidence: ${high}`);
  console.log(`  Medium confidence: ${medium}`);
  console.log(`  Low confidence: ${low}`);
  console.log(`  No match: ${none}`);
  console.log(`  Gaps: ${gaps.length}`);

  // Distribution by sub-concept
  console.log(`\nDistribution:`);
  const dist = {};
  for (const m of mappings) {
    const key = m.subConceptId || 'UNMAPPED';
    dist[key] = (dist[key] || 0) + 1;
  }
  for (const [id, count] of Object.entries(dist).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${id}: ${count}`);
  }

  // Save results
  const output = {
    topic,
    totalQuestions: questions.length,
    totalSubConcepts: subConcepts.length,
    summary: { high, medium, low, none },
    subConcepts: subConcepts.map(sc => ({ id: sc.id, name: sc.name })),
    mappings,
    gaps
  };

  const outputPath = path.join(__dirname, 'question-lesson-map.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nSaved to: ${outputPath}`);

  return output;
}

// ── Run ──
const topic = process.argv[2] || 'fractions';
mapQuestions(topic);

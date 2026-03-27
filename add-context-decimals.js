const fs = require('fs');

// Each pair: [exact old question string, new contextual question string]
const replacements = [
  // ID 1 - ordering/largest
  [
    'Which of these numbers is the largest? 3.7, 3.07, 3.77, 3.70, 3.17',
    'Five pupils measure how far they can throw a beanbag: Ali 3.7 m, Beth 3.07 m, Callum 3.77 m, Dina 3.70 m, Ethan 3.17 m. Who threw the furthest?'
  ],
  // ID 4 - closest to 5
  [
    'Which number is closest to 5? 4.89, 5.12, 4.95, 5.08, 4.78',
    'In a baking competition, five cakes should weigh exactly 5 kg. The cakes weigh 4.89 kg, 5.12 kg, 4.95 kg, 5.08 kg and 4.78 kg. Which cake is closest to the target weight of 5 kg?'
  ],
  // ID 6 - division by 10
  [
    'What is 4.5 ÷ 10?',
    'A piece of rope is 4.5 metres long. It is cut into 10 equal pieces. How long is each piece, in metres?'
  ],
  // ID 8 - fraction to decimal
  [
    'Which decimal is equivalent to 3/4?',
    'A recipe says to use 3/4 of a litre of milk. What is 3/4 written as a decimal?'
  ],
  // ID 9 - ordering
  [
    'Put these in order from smallest to largest: 0.6, 0.06, 0.66, 0.606',
    'Four science beakers contain different amounts of liquid: Beaker A has 0.6 litres, Beaker B has 0.06 litres, Beaker C has 0.66 litres, and Beaker D has 0.606 litres. Put these amounts in order from smallest to largest.'
  ],
  // ID 14 - multiplication of decimals
  [
    'What is 0.8 × 0.5?',
    'A recipe needs 0.8 kg of sugar, but Mum only makes half the recipe. How many kg of sugar does she need? (Hint: multiply 0.8 \u00d7 0.5)'
  ],
  // ID 15 - smallest
  [
    'Which is the smallest? 2.09, 2.9, 2.19, 2.99, 2.90',
    'Five pupils measure their long jumps: Amy 2.09 m, Ben 2.9 m, Cara 2.19 m, Dan 2.99 m, Eva 2.90 m. Who jumped the shortest distance?'
  ],
  // ID 23 - multiply by 100
  [
    'What is 4.8 × 100?',
    'A box of crayons costs £4.80. How many pence is this? (Hint: multiply 4.8 \u00d7 100)'
  ],
  // ID 27 - decimal division
  [
    'What is 0.6 ÷ 0.2?',
    'A gardener has 0.6 kg of seeds. Each flower bed needs 0.2 kg. How many flower beds can be planted?'
  ],
  // ID 29 - divide by 100
  [
    'What is 7.5 ÷ 100?',
    'A school raises £7.50 and shares it equally among 100 pupils. How many pounds does each pupil receive?'
  ],
  // ID 30 - fraction equivalence
  [
    'Which of these equals 0.5? 1/5, 2/5, 3/5, 1/2, 2/3',
    'A weather report says there is a 0.5 chance of rain. Which fraction is the same as 0.5? 1/5, 2/5, 3/5, 1/2, 2/3'
  ],
  // ID 31 - decimal multiplication
  [
    'What is 0.9 × 0.9?',
    'A square tile measures 0.9 metres on each side. What is the area of the tile in square metres? (Hint: multiply 0.9 \u00d7 0.9)'
  ],
  // ID 35 - decimal division
  [
    'What is 5.4 ÷ 0.6?',
    'A ribbon is 5.4 metres long. It is cut into pieces that are each 0.6 metres. How many pieces are there?'
  ],
  // ID 36 - addition
  [
    'What is 5.8 + 4.7?',
    'A plank of wood is 5.8 metres long. Another plank is 4.7 metres long. What is their total length?'
  ],
  // ID 37 - subtraction
  [
    'What is 12.6 - 7.9?',
    'A water tank holds 12.6 litres. After watering some plants, 7.9 litres are used. How many litres remain in the tank?'
  ],
  // ID 38 - multiply by 10
  [
    'What is 3.45 × 10?',
    'A pencil is 3.45 cm wide. What is this measurement multiplied by 10?'
  ],
  // ID 39 - divide by 10
  [
    'What is 68 ÷ 10?',
    'A bag of 10 oranges weighs 68 grams in total. What is the weight of one orange? (Hint: divide 68 by 10)'
  ],
  // ID 40 - largest
  [
    'Which of these numbers is the largest? 4.56, 4.5, 4.65, 4.6, 4.05',
    'Five runners record their 50-metre sprint times: Aisha 4.56 s, Ben 4.5 s, Charu 4.65 s, David 4.6 s, Ella 4.05 s. Which is the largest time?'
  ],
  // ID 41 - multiplication
  [
    'What is 6.5 × 3?',
    'A garden path is 6.5 metres long. Dad walks along it 3 times. How many metres does he walk in total?'
  ],
  // ID 42 - division
  [
    'What is 9.6 ÷ 4?',
    'A piece of cheese weighs 9.6 kg. It is cut into 4 equal blocks. How much does each block weigh?'
  ],
  // ID 43 - fraction to decimal
  [
    'Which decimal is equivalent to 3/5?',
    'In a spelling test, Mia gets 3/5 of the answers right. What is 3/5 written as a decimal?'
  ],
  // ID 44 - addition
  [
    'What is 7.8 + 5.6?',
    'On sports day, Zara throws a javelin 7.8 metres and then 5.6 metres. What is her total distance across both throws?'
  ],
  // ID 45 - multiply by 100
  [
    'What is 0.38 × 100?',
    'A scientist measures 0.38 metres of copper wire. How many centimetres is that? (Hint: multiply 0.38 \u00d7 100)'
  ],
  // ID 47 - division giving decimal
  [
    'What is 18 ÷ 8?',
    'A group of 8 children share 18 stickers equally. How many stickers does each child get?'
  ],
  // ID 48 - smallest
  [
    'Which is the smallest? 1.45, 1.54, 1.4, 1.5, 1.05',
    'Five seedlings are measured in a science experiment: Plant A is 1.45 cm, Plant B is 1.54 cm, Plant C is 1.4 cm, Plant D is 1.5 cm, Plant E is 1.05 cm. Which seedling is the shortest?'
  ],
  // ID 49 - decimal multiplication
  [
    'What is 0.7 × 0.6?',
    'A rectangular label is 0.7 metres wide and 0.6 metres tall. What is its area in square metres? (Hint: multiply 0.7 \u00d7 0.6)'
  ],
  // ID 50 - rounding
  [
    'Round 8.74 to one decimal place.',
    'A sprinter finishes a race in 8.74 seconds. Round this time to one decimal place.'
  ],
  // ID 51 - multiplication
  [
    'What is 4.2 × 5?',
    'A bag of rice weighs 4.2 kg. What do 5 bags weigh altogether?'
  ],
  // ID 53 - divide by 100
  [
    'What is 15.3 ÷ 100?',
    'A school collects £15.30 and divides it equally among 100 charity boxes. How many pounds go into each box? (Hint: divide 15.3 by 100)'
  ],
  // ID 54 - fraction to decimal
  [
    'Which decimal equals 1/8?',
    'A chocolate bar is split into 8 equal pieces. Tom eats 1 piece. What decimal of the whole bar has he eaten? (Which decimal equals 1/8?)'
  ],
  // ID 55 - subtraction
  [
    'What is 11.2 - 6.8?',
    'A jug holds 11.2 litres of lemonade. After pouring out 6.8 litres for a party, how many litres are left?'
  ],
  // ID 56 - ordering
  [
    'Put these in order from smallest to largest: 0.8, 0.08, 0.88, 0.808',
    'Four parcels weigh 0.8 kg, 0.08 kg, 0.88 kg and 0.808 kg. Put these weights in order from smallest to largest.'
  ],
  // ID 57 - division
  [
    'What is 8.4 ÷ 7?',
    'A piece of string is 8.4 metres long. It is shared equally among 7 children for a craft project. How long is each piece?'
  ],
  // ID 59 - decimal multiplication
  [
    'What is 0.9 × 0.7?',
    'A cook uses 0.9 litres of cream but only needs 0.7 of that amount for a sauce. How many litres does the sauce need? (Hint: multiply 0.9 \u00d7 0.7)'
  ],
  // ID 60 - rounding
  [
    'Round 5.38 to one decimal place.',
    'A pupil measures a leaf and finds it is 5.38 cm long. Round this measurement to one decimal place.'
  ],
  // ID 61 - addition
  [
    'What is 3.6 + 7.9?',
    'A model aeroplane weighs 3.6 kg. Its box weighs 7.9 kg. What is the total weight?'
  ],
  // ID 62 - closest to 8
  [
    'Which number is closest to 8? 7.89, 8.15, 7.94, 8.08, 7.76',
    'Five high jumpers try to clear a bar at 8 metres. Their actual jump heights are 7.89 m, 8.15 m, 7.94 m, 8.08 m and 7.76 m. Whose jump was closest to 8 metres?'
  ],
  // ID 63 - decimal multiplication
  [
    'What is 7.2 × 0.3?',
    'A garden fence panel is 7.2 metres long. A decorator paints 0.3 of the panel before lunch. How many metres has he painted? (Hint: multiply 7.2 \u00d7 0.3)'
  ],
  // ID 64 - division giving decimal
  [
    'What is 13 ÷ 4?',
    'Four friends share 13 litres of juice equally. How many litres does each person get?'
  ],
  // ID 66 - multiply by 100
  [
    'What is 5.5 × 100?',
    'A scientist measures 5.5 metres of wire. How many centimetres is that? (Hint: multiply 5.5 \u00d7 100)'
  ],
  // ID 67 - largest
  [
    'Which is the largest? 6.07, 6.7, 6.77, 6.70, 6.17',
    'Five bags of flour are weighed: Bag A is 6.07 kg, Bag B is 6.7 kg, Bag C is 6.77 kg, Bag D is 6.70 kg, Bag E is 6.17 kg. Which bag is the heaviest?'
  ],
  // ID 68 - subtraction
  [
    'What is 14.8 - 9.3?',
    'Dad has a plank of wood that is 14.8 metres long. He saws off 9.3 metres. How long is the remaining piece?'
  ],
  // ID 69 - decimal to percentage
  [
    'What is 0.48 as a percentage?',
    'In a maths test, a pupil gets 0.48 of the questions correct. What is 0.48 as a percentage?'
  ],
  // ID 70 - multiplication
  [
    'What is 2.8 × 6?',
    'Each shelf in a bookcase is 2.8 metres wide. There are 6 shelves. What is the total shelf width?'
  ],
  // ID 72 - decimal division
  [
    'What is 0.6 ÷ 0.3?',
    'A bottle holds 0.6 litres of medicine. Each dose is 0.3 litres. How many doses are in the bottle?'
  ],
  // ID 73 - rounding to 2dp
  [
    'Round 6.951 to two decimal places.',
    'A weather station records a temperature of 6.951 degrees. Round this temperature to two decimal places.'
  ],
  // ID 74 - fraction to decimal
  [
    'Which decimal equals 7/10?',
    'A jar of sweets is 7/10 full. What decimal is equivalent to 7/10?'
  ],
  // ID 75 - divide by 100
  [
    'What is 9.1 ÷ 100?',
    'A factory produces 9.1 litres of paint and pours it into 100 tiny pots. How many litres go into each pot?'
  ],
  // ID 76 - addition
  [
    'What is 3.5 + 8.8?',
    'A bookshelf is 3.5 metres tall. A cupboard is 8.8 metres tall. What is their combined height?'
  ],
  // ID 77 - multiplication
  [
    'What is 5.6 × 4?',
    'A hiker walks 5.6 km each day for 4 days. How far does she walk in total?'
  ],
  // ID 78 - division
  [
    'What is 11.5 ÷ 5?',
    'A bag of potatoes weighs 11.5 kg. It is split equally into 5 smaller bags. How much does each bag weigh?'
  ],
  // ID 79 - ordering
  [
    'Put these in order from smallest to largest: 0.5, 0.05, 0.55, 0.505',
    'Four bottles of cooking oil weigh 0.5 kg, 0.05 kg, 0.55 kg and 0.505 kg. Put these weights in order from lightest to heaviest.'
  ],
  // ID 80 - decimal multiplication
  [
    'What is 0.8 × 0.9?',
    'A rectangular poster is 0.8 metres wide and 0.9 metres tall. What is its area in square metres? (Hint: multiply 0.8 \u00d7 0.9)'
  ],
  // ID 82 - subtraction
  [
    'What is 16.7 - 8.9?',
    'A bucket holds 16.7 litres of water. After washing the car, 8.9 litres have been used. How many litres are left?'
  ],
  // ID 83 - division giving decimal
  [
    'What is 17 ÷ 5?',
    'Five children share 17 biscuits equally. How many biscuits does each child get?'
  ],
  // ID 84 - rounding
  [
    'Round 9.126 to one decimal place.',
    'A thermometer reads 9.126 degrees Celsius in a science experiment. Round this reading to one decimal place.'
  ],
  // ID 85 - multiplication
  [
    'What is 1.25 × 8?',
    'Each bottle of water costs £1.25. How much do 8 bottles cost?'
  ],
  // ID 86 - smallest
  [
    'Which is the smallest? 3.09, 3.9, 3.19, 3.99, 3.90',
    "Five sunflowers are measured: Rose's is 3.09 m, Jake's is 3.9 m, Lily's is 3.19 m, Finn's is 3.99 m, and Nora's is 3.90 m. Whose sunflower is the shortest?"
  ],
  // ID 87 - multiply by 10
  [
    'What is 0.54 × 10?',
    'A snack bar weighs 0.54 kg. What do 10 snack bars weigh?'
  ],
  // ID 88 - decimal division
  [
    'What is 8.2 ÷ 0.2?',
    'A roll of tape is 8.2 metres long. Each gift tag needs 0.2 metres of tape. How many gift tags can be made?'
  ],
  // ID 90 - fraction to decimal
  [
    'Which decimal equals 1/4?',
    'A pizza is cut into 4 equal slices. Dad eats 1 slice. What decimal of the whole pizza did he eat? (Which decimal equals 1/4?)'
  ],
  // ID 91 - decimal multiplication
  [
    'What is 4.9 × 0.4?',
    'A swimming pool is 4.9 metres wide. A duck swims across 0.4 of the width. How far does the duck swim? (Hint: multiply 4.9 \u00d7 0.4)'
  ],
  // ID 92 - subtraction from whole number
  [
    'What is 12 - 5.75?',
    'Gran gives Tom £12 for his birthday. He spends £5.75 at the bookshop. How much does he have left?'
  ],
  // ID 93 - divide by 100
  [
    'What is 6.3 ÷ 100?',
    'A school shares 6.3 litres of paint equally among 100 pupils. How many litres does each pupil get?'
  ],
  // ID 95 - addition
  [
    'What is 7.5 + 6.8?',
    'A bag of apples weighs 7.5 kg and a bag of pears weighs 6.8 kg. What do they weigh altogether?'
  ],
  // ID 96 - rounding to 2dp
  [
    'Round 4.567 to two decimal places.',
    'A stopwatch shows a time of 4.567 seconds in a science experiment. Round this to two decimal places.'
  ],
  // ID 97 - decimal multiplication
  [
    'What is 9.6 × 0.5?',
    'A skipping rope is 9.6 metres long. It is folded in half. How long is the folded rope? (Hint: multiply 9.6 \u00d7 0.5)'
  ],
  // ID 99 - division
  [
    'What is 14.4 ÷ 6?',
    'A length of fabric measuring 14.4 metres is cut into 6 equal strips. How long is each strip?'
  ],
  // ID 100 - largest
  [
    'Which is the largest? 5.45, 5.5, 5.54, 5.4, 5.05',
    'Five pupils time how long they can hold their breath: Adam 5.45 s, Bella 5.5 s, Charlie 5.54 s, Daisy 5.4 s, Eddie 5.05 s. Who held their breath for the longest time?'
  ],
  // ID 101 - multiplication
  [
    'What is 3.7 × 9?',
    'Each lap of a running track is 3.7 km. A cyclist completes 9 laps. How many kilometres does the cyclist ride?'
  ],
  // ID 102 - decimal division
  [
    'What is 0.72 ÷ 0.9?',
    'A jug contains 0.72 litres of juice. Each glass holds 0.9 litres. What fraction of a glass can be filled? (Hint: divide 0.72 by 0.9)'
  ],
  // ID 103 - division giving decimal
  [
    'What is 19 ÷ 4?',
    'Four friends share £19 equally. How much does each person get?'
  ],
  // ID 105 - multiply by 100
  [
    'What is 0.85 × 100?',
    'A gold coin weighs 0.85 grams. How much would 100 of these coins weigh?'
  ],
  // ID 106 - subtraction
  [
    'What is 18.9 - 11.4?',
    'A fish tank holds 18.9 litres of water. After cleaning, 11.4 litres are removed. How many litres remain?'
  ],
  // ID 107 - fraction to decimal
  [
    'Which decimal is equivalent to 4/5?',
    'A school choir has learnt 4/5 of the songs for the concert. What is 4/5 written as a decimal?'
  ],
  // ID 108 - addition
  [
    'What is 4.5 + 9.7?',
    'Grandma knits a scarf that is 4.5 metres long and then adds another section of 9.7 metres. What is the total length?'
  ],
  // ID 109 - rounding
  [
    'Round 7.845 to one decimal place.',
    'A hamster weighs 7.845 grams on a precise scale. Round this weight to one decimal place.'
  ],
  // ID 110 - decimal multiplication
  [
    'What is 8.1 × 0.7?',
    'A kitchen worktop is 8.1 metres long. A spill covers 0.7 of its length. How many metres of worktop are covered? (Hint: multiply 8.1 \u00d7 0.7)'
  ],
  // ID 112 - decimal division
  [
    'What is 0.9 ÷ 0.3?',
    'A bottle holds 0.9 litres of squash. Each cup uses 0.3 litres. How many cups can be poured?'
  ],
  // ID 113 - smallest
  [
    'Which is the smallest? 2.45, 2.54, 2.4, 2.5, 2.05',
    'Five bags of sweets are weighed: Bag A is 2.45 kg, Bag B is 2.54 kg, Bag C is 2.4 kg, Bag D is 2.5 kg, Bag E is 2.05 kg. Which bag is the lightest?'
  ],
  // ID 114 - multiply by 100
  [
    'What is 2.4 × 100?',
    'A toy car track is 2.4 metres long. How many centimetres is this? (Hint: multiply 2.4 \u00d7 100)'
  ],
  // ID 115 - divide by 100
  [
    'What is 16.2 ÷ 100?',
    'A machine makes 16.2 litres of orange juice and pours it into 100 sample cups. How many litres go into each cup?'
  ],
  // ID 116 - ordering
  [
    'Put these in order from smallest to largest: 0.7, 0.07, 0.77, 0.707',
    'Four friends measure how far they can jump: Oscar 0.7 m, Priya 0.07 m, Quinn 0.77 m, Ruby 0.707 m. Put these distances in order from shortest to longest.'
  ],
  // ID 117 - multiplication
  [
    'What is 5.2 × 7?',
    'A baker uses 5.2 kg of flour each day. How much flour does he use over 7 days?'
  ],
  // ID 118 - division
  [
    'What is 10.8 ÷ 9?',
    'A chocolate bar weighing 10.8 grams is shared equally among 9 friends. How many grams does each friend receive?'
  ],
  // ID 119 - decimal multiplication
  [
    'What is 0.6 × 0.8?',
    'A photograph measures 0.6 metres wide and 0.8 metres tall. What is its area in square metres? (Hint: multiply 0.6 \u00d7 0.8)'
  ],
  // ID 121 - subtraction
  [
    'What is 13.5 - 7.8?',
    'Mum has 13.5 metres of wrapping paper. She uses 7.8 metres to wrap presents. How many metres are left?'
  ],
  // ID 122 - rounding to 2dp
  [
    'Round 8.235 to two decimal places.',
    'A scientist measures the mass of a crystal as 8.235 grams. Round this measurement to two decimal places.'
  ],
  // ID 123 - multiplication
  [
    'What is 1.5 × 12?',
    'Eggs cost £1.50 per box. How much do 12 boxes cost? (Hint: multiply 1.5 \u00d7 12)'
  ],
  // ID 124 - fraction to decimal
  [
    'Which decimal equals 3/8?',
    'A cake is divided into 8 equal slices. Mia eats 3 slices. What decimal of the whole cake has she eaten? (Which decimal equals 3/8?)'
  ],
  // ID 125 - addition
  [
    'What is 6.4 + 8.9?',
    'A suitcase weighs 6.4 kg and a rucksack weighs 8.9 kg. What is their combined weight?'
  ],
  // ID 126 - division giving decimal
  [
    'What is 23 ÷ 4?',
    'A teacher shares 23 coloured pencils equally among 4 tables. How many pencils does each table get?'
  ],
  // ID 127 - decimal multiplication
  [
    'What is 7.8 × 0.6?',
    'A roll of fabric is 7.8 metres long. A tailor uses 0.6 of the roll. How many metres of fabric does the tailor use? (Hint: multiply 7.8 \u00d7 0.6)'
  ],
  // ID 128 - largest
  [
    'Which is the largest? 8.08, 8.8, 8.88, 8.80, 8.18',
    'Five watermelons are weighed at the market: 8.08 kg, 8.8 kg, 8.88 kg, 8.80 kg, 8.18 kg. Which watermelon is the heaviest?'
  ],
  // ID 129 - subtraction from whole number
  [
    'What is 11 - 6.45?',
    'A roll of string is 11 metres long. After cutting off 6.45 metres, how much string is left?'
  ],
  // ID 130 - multiply by 10
  [
    'What is 0.72 × 10?',
    'A single marble weighs 0.72 grams. What do 10 marbles weigh?'
  ],
  // ID 131 - decimal division
  [
    'What is 9.6 ÷ 0.4?',
    'A ball of wool is 9.6 metres long. Each pompom uses 0.4 metres of wool. How many pompoms can be made?'
  ],
  // ID 133 - rounding
  [
    'Round 6.483 to one decimal place.',
    'A snail crawls 6.483 cm in one minute. Round this distance to one decimal place.'
  ],
  // ID 134 - decimal multiplication
  [
    'What is 4.8 × 0.8?',
    'A bag of sand weighs 4.8 kg. Only 0.8 of the bag is needed for a sandcastle. How many kg of sand are used? (Hint: multiply 4.8 \u00d7 0.8)'
  ],
  // ID 135 - division
  [
    'What is 12.6 ÷ 7?',
    'A hosepipe is 12.6 metres long. It is cut into 7 equal sections. How long is each section?'
  ],
  // ID 94 - fraction equivalence
  [
    'Which of these equals 0.2? 1/4, 1/5, 2/5, 1/2, 2/10',
    'A glass of squash is 0.2 full. Which fraction is the same as 0.2? 1/4, 1/5, 2/5, 1/2, 2/10'
  ],
];

// --- Script logic ---
const filePath = 'src/App.js';
let content = fs.readFileSync(filePath, 'utf8');

let count = 0;
const failed = [];

for (const [oldQ, newQ] of replacements) {
  const searchStr = `question: "${oldQ}"`;
  const replaceStr = `question: "${newQ}"`;

  if (content.includes(searchStr)) {
    content = content.replace(searchStr, replaceStr);
    count++;
  } else {
    failed.push(oldQ);
  }
}

fs.writeFileSync(filePath, content, 'utf8');

console.log(`\nDecimals context wrapper script complete.`);
console.log(`Total replacements made: ${count} / ${replacements.length}`);

if (failed.length > 0) {
  console.log(`\nFailed to find ${failed.length} question(s):`);
  for (const q of failed) {
    console.log(`  - "${q}"`);
  }
}

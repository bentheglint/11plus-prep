const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.js');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Each pair: [exact old question string, new contextual question string]
// ONLY the question text changes — nothing else.
// British English, UK context, age-appropriate for 9–10 year olds.
// Every scenario is unique.

const replacements = [
  // --- Difficulty 1 (easier, smaller numbers) ---
  [
    'What is 144 \u00f7 12?',
    'A teacher shares 144 coloured pencils equally among 12 tables. How many pencils does each table get?'
  ],
  [
    'What is 375 \u00f7 15?',
    'A baker makes 375 biscuits and packs them into boxes of 15. How many boxes does he fill?'
  ],
  [
    'What is 456 \u00f7 24?',
    'A school has 456 exercise books to share equally among 24 classes. How many books does each class receive?'
  ],
  [
    'What is 624 \u00f7 26?',
    'A sweet shop has 624 lollipops to put into jars of 26. How many jars can they fill?'
  ],
  [
    'What is 540 \u00f7 18?',
    'A PE teacher has 540 tennis balls to share equally among 18 groups. How many balls does each group get?'
  ],
  [
    'What is 672 \u00f7 21?',
    'A farmer picks 672 apples and packs them into crates of 21. How many crates does he fill?'
  ],
  [
    'What is 736 \u00f7 32?',
    'A charity collects 736 tins of soup and distributes them equally to 32 food banks. How many tins does each food bank receive?'
  ],
  [
    'What is 812 \u00f7 28?',
    'A printing company prints 812 leaflets and bundles them into packs of 28. How many packs are there?'
  ],
  [
    'What is 945 \u00f7 27?',
    'A garden centre has 945 flower pots arranged in rows of 27. How many rows are there?'
  ],
  [
    'What is 966 \u00f7 42?',
    'A school canteen makes 966 sandwiches for 42 classes. How many sandwiches does each class get?'
  ],
  [
    'What is 780 \u00f7 26?',
    'A newsagent has 780 newspapers to deliver equally along 26 streets. How many papers go to each street?'
  ],
  [
    'What is 1044 \u00f7 36?',
    'A toy shop receives 1044 building blocks and sorts them into bags of 36. How many bags are there?'
  ],
  [
    'What is 588 \u00f7 14?',
    'A craft teacher has 588 beads to share equally among 14 children. How many beads does each child get?'
  ],
  [
    'What is 1140 \u00f7 38?',
    'A coach travels 1140 miles over 38 days. If it travels the same distance each day, how many miles does it cover per day?'
  ],
  [
    'What is 851 \u00f7 23?',
    'A library receives a donation of 851 books to be placed equally on 23 shelves. How many books go on each shelf?'
  ],
  [
    'What is 1224 \u00f7 34?',
    'A school orders 1224 rulers for 34 classrooms. How many rulers does each classroom receive?'
  ],
  [
    'What is 912 \u00f7 16?',
    'A farmer has 912 strawberries to put into punnets of 16. How many punnets does he fill?'
  ],
  [
    'What is 1368 \u00f7 38?',
    'A sports club raises \u00a31368 and splits it equally among 38 members. How many pounds does each member get?'
  ],
  [
    'What is 1575 \u00f7 45?',
    'A swimming pool has 1575 tiles laid in rows of 45. How many rows of tiles are there?'
  ],
  [
    'What is 1764 \u00f7 42?',
    'A warehouse stores 1764 bottles of juice on shelves holding 42 bottles each. How many shelves are used?'
  ],
  [
    'What is 576 \u00f7 16?',
    'A scout group has 576 badges to share equally among 16 troops. How many badges does each troop receive?'
  ],
  [
    'What is 825 \u00f7 25?',
    'A factory produces 825 toy cars and packs them into boxes of 25. How many boxes are filled?'
  ],
  [
    'What is 432 \u00f7 18?',
    'A gardener has 432 seeds to plant in 18 equal rows. How many seeds go in each row?'
  ],
  [
    'What is 960 \u00f7 32?',
    'A cinema has 960 seats arranged in 32 equal rows. How many seats are in each row?'
  ],
  [
    'What is 1188 \u00f7 27?',
    'A bookshop sells 1188 pencils in packs of 27. How many packs is that?'
  ],
  [
    'What is 684 \u00f7 19?',
    'A zookeeper has 684 pieces of fruit to feed 19 monkeys equally. How many pieces does each monkey get?'
  ],
  [
    'What is 876 \u00f7 12?',
    'A supermarket receives 876 yoghurts and places them in fridges holding 12 each. How many fridges are needed?'
  ],
  [
    'What is 1295 \u00f7 35?',
    'A delivery driver travels 1295 miles over 35 trips. If each trip is the same distance, how many miles is each trip?'
  ],
  [
    'What is 1104 \u00f7 23?',
    'A school collects 1104 cereal box tokens to share equally among 23 classrooms. How many tokens does each classroom get?'
  ],
  [
    'What is 1540 \u00f7 35?',
    'A park ranger plants 1540 trees in rows of 35. How many rows does she plant?'
  ],
  [
    'What is 1680 \u00f7 40?',
    'A post office sorts 1680 letters into 40 equal bundles. How many letters are in each bundle?'
  ],
  // --- Difficulty 3 (harder, larger numbers) ---
  [
    'What is 1,927 \u00f7 47?',
    'A school raises \u00a31,927 at a fair and shares it equally among 47 charities. How many pounds does each charity receive?'
  ],
  [
    'What is 2100 \u00f7 50?',
    'A baker uses 2100 grams of flour, dividing it equally into 50 portions. How many grams is each portion?'
  ],
  [
    'What is 2232 \u00f7 31?',
    'A football club has 2232 programmes to distribute equally among 31 stewards. How many programmes does each steward get?'
  ],
  [
    'What is 2496 \u00f7 52?',
    'A warehouse packs 2496 oranges into crates of 52. How many crates are filled?'
  ],
  [
    'What is 2640 \u00f7 55?',
    'A carpet fitter has 2640 centimetres of carpet to cut into 55 equal strips. How long is each strip in centimetres?'
  ],
  [
    'What is 2772 \u00f7 63?',
    'A school kitchen prepares 2772 fish fingers for 63 classes. How many fish fingers does each class get?'
  ],
  [
    'What is 3024 \u00f7 72?',
    'A museum receives 3024 visitors over 72 days. If the same number visit each day, how many visitors come per day?'
  ],
  [
    'What is 3150 \u00f7 75?',
    'A charity shop sorts 3150 donated books onto shelves holding 75 books each. How many shelves are needed?'
  ],
  [
    'What is 3276 \u00f7 78?',
    'A school collects 3276 crisp packets for a recycling scheme over 78 days. How many packets are collected each day?'
  ],
  [
    'What is 3500 \u00f7 70?',
    'A lorry carries 3500 bricks, delivering them equally to 70 houses. How many bricks does each house receive?'
  ],
  [
    'What is 3,612 \u00f7 86?',
    'A farm harvests 3,612 potatoes and packs them into sacks of 86. How many sacks are filled?'
  ],
  [
    'What is 3744 \u00f7 96?',
    'A printing press produces 3744 magazines and bundles them into stacks of 96. How many stacks are there?'
  ],
  [
    'What is 3,916 \u00f7 89?',
    'A confectionery factory makes 3,916 sweets and packs them into tins of 89. How many tins are packed?'
  ],
  [
    'What is 4095 \u00f7 91?',
    'A garden centre sells 4095 plant pots over 91 days. If they sell the same number each day, how many do they sell per day?'
  ],
  [
    'What is 4,185 \u00f7 93?',
    'A school distributes 4,185 reading books equally among 93 pupils. How many books does each pupil receive?'
  ],
  [
    'What is 4,455 \u00f7 99?',
    'A sports shop orders 4,455 footballs and stores them in boxes of 99. How many boxes are used?'
  ],
  [
    'What is 4560 \u00f7 95?',
    'A train travels 4560 miles over 95 journeys. If each journey is the same length, how many miles is each journey?'
  ],
  [
    'What is 4,656 \u00f7 97?',
    'A furniture workshop uses 4,656 screws to build 97 identical tables. How many screws are used per table?'
  ],
  [
    'What is 4,784 \u00f7 92?',
    'A farmer gathers 4,784 eggs over 92 days. If the same number are gathered each day, how many eggs per day?'
  ],
  [
    'What is 5016 \u00f7 88?',
    'A paper mill produces 5016 sheets of card and cuts them into 88 equal batches. How many sheets are in each batch?'
  ],
  [
    'What is 5130 \u00f7 90?',
    'A nursery grows 5130 seedlings and plants them in 90 equal rows. How many seedlings are in each row?'
  ],
  [
    'What is 5244 \u00f7 92?',
    'A bottling plant fills 5244 bottles of water and packs them in trays of 92. How many trays are needed?'
  ],
  [
    'What is 5472 \u00f7 96?',
    'A school kitchen uses 5472 paper plates over 96 school days. How many plates are used each day?'
  ],
  [
    'What is 5,580 \u00f7 93?',
    'An art teacher orders 5,580 sheets of coloured paper for 93 pupils. How many sheets does each pupil get?'
  ],
  [
    'What is 5700 \u00f7 95?',
    'A charity event raises \u00a35700 and distributes it equally among 95 families. How many pounds does each family receive?'
  ],
  [
    'What is 5,880 \u00f7 98?',
    'A shoe factory produces 5,880 pairs of trainers and ships them in boxes of 98. How many boxes are shipped?'
  ],
  [
    'What is 6,039 \u00f7 99?',
    'A school canteen serves 6,039 meals over 99 days. How many meals are served each day?'
  ],
  [
    'What is 6,132 \u00f7 84?',
    'A builder lays 6,132 bricks over 84 hours. How many bricks does he lay per hour?'
  ],
  [
    'What is 6384 \u00f7 84?',
    'A warehouse stores 6384 jars of jam on shelves holding 84 jars each. How many shelves are used?'
  ],
  [
    'What is 6,438 \u00f7 87?',
    'A chocolate factory wraps 6,438 bars and packs them into cartons of 87. How many cartons are packed?'
  ],
  [
    'What is 6,624 \u00f7 92?',
    'A council delivers 6,624 recycling bags to 92 streets equally. How many bags does each street receive?'
  ],
  [
    'What is 6,825 \u00f7 91?',
    'A music shop sells 6,825 guitar picks over 91 weeks. How many picks are sold each week?'
  ],
  [
    'What is 6,942 \u00f7 89?',
    'A bakery bakes 6,942 bread rolls over 89 days. How many rolls are baked each day?'
  ],
  [
    'What is 7056 \u00f7 98?',
    'A florist arranges 7056 roses into bunches of 98. How many bunches does she make?'
  ],
  [
    'What is 7280 \u00f7 91?',
    'A bus company covers 7280 miles over 91 routes. If each route is the same distance, how many miles is each route?'
  ],
  [
    'What is 7392 \u00f7 96?',
    'A toy factory packs 7392 action figures into display boxes of 96. How many display boxes are filled?'
  ],
  [
    'What is 7,480 \u00f7 88?',
    'A farm produces 7,480 litres of milk over 88 days. How many litres are produced each day?'
  ],
  [
    'What is 7,680 \u00f7 96?',
    'A tile shop has 7,680 mosaic tiles to arrange into sets of 96. How many sets can they make?'
  ],
  [
    'What is 7840 \u00f7 98?',
    'A postal worker delivers 7840 letters over 98 days. How many letters does he deliver each day?'
  ],
  [
    'What is 7,920 \u00f7 88?',
    'A school uses 7,920 pieces of chalk over 88 weeks. How many pieces are used each week?'
  ],
  [
    'What is 8,178 \u00f7 94?',
    'A pet shop orders 8,178 dog treats and divides them equally into 94 bags. How many treats go in each bag?'
  ],
  [
    'What is 8280 \u00f7 90?',
    'A painter uses 8280 millilitres of paint over 90 days. How many millilitres does he use each day?'
  ],
  [
    'What is 8,366 \u00f7 89?',
    'A stationery supplier distributes 8,366 notebooks equally to 89 shops. How many notebooks does each shop receive?'
  ],
  [
    'What is 8,556 \u00f7 93?',
    'A sports club buys 8,556 shuttlecocks and shares them equally among 93 players. How many does each player get?'
  ],
  [
    'What is 8,740 \u00f7 95?',
    'A sweet factory produces 8,740 lemon drops and fills jars of 95. How many jars are filled?'
  ],
  [
    'What is 8832 \u00f7 96?',
    'A school photocopier prints 8832 worksheets over 96 days. How many worksheets are printed each day?'
  ],
  [
    'What is 8,900 \u00f7 89?',
    'A window cleaner earns \u00a38,900 over 89 jobs. If he charges the same for each job, how much does each job cost?'
  ],
  // --- Continuing difficulty 3 ---
  [
    'What is 9,114 \u00f7 98?',
    'A juice company fills 9,114 cartons of orange juice and packs them into crates of 98. How many crates are needed?'
  ],
  [
    'What is 9,216 \u00f7 96?',
    'A biscuit factory bakes 9,216 digestives and packs them in tins of 96. How many tins are packed?'
  ],
  [
    'What is 9,292 \u00f7 92?',
    'A courier delivers 9,292 parcels over 92 days. How many parcels does he deliver each day?'
  ],
  [
    'What is 9,579 \u00f7 93?',
    'A school fundraiser raises \u00a39,579 and splits it equally among 93 projects. How many pounds does each project receive?'
  ],
  [
    'What is 9696 \u00f7 96?',
    'A vegetable farm packs 9696 carrots into bags of 96. How many bags are filled?'
  ],
  [
    'What is 9800 \u00f7 98?',
    'A theme park sells 9800 tickets over 98 days. If the same number are sold each day, how many tickets are sold per day?'
  ],
  [
    'What is 9,856 \u00f7 88?',
    'A sticker company prints 9,856 stickers and puts them into packets of 88. How many packets are made?'
  ],
  [
    'What is 10,080 \u00f7 96?',
    'A bread factory bakes 10,080 loaves over 96 days. How many loaves are baked each day?'
  ],
  [
    'What is 10,152 \u00f7 94?',
    'A pencil factory produces 10,152 pencils and bundles them into packs of 94. How many packs are made?'
  ],
  [
    'What is 10,282 \u00f7 97?',
    'A bookshop receives 10,282 paperbacks and arranges them equally on 97 shelves. How many books go on each shelf?'
  ],
  [
    'What is 10,486 \u00f7 98?',
    'A plumber cuts 10,486 centimetres of pipe into 98 equal lengths. How many centimetres long is each piece?'
  ],
  [
    'What is 10656 \u00f7 96?',
    'A craft shop sorts 10656 buttons into jars of 96. How many jars are needed?'
  ],
  [
    'What is 10,769 \u00f7 89?',
    'A honey farm fills 10,769 jars of honey and distributes them equally to 89 shops. How many jars does each shop receive?'
  ],
  [
    'What is 10,920 \u00f7 91?',
    'An ice cream van sells 10,920 ice lollies over 91 days. How many lollies are sold each day?'
  ],
  [
    'What is 11,040 \u00f7 96?',
    'A school buys 11,040 crayons to share equally among 96 pupils. How many crayons does each pupil receive?'
  ],
  [
    'What is 11,286 \u00f7 99?',
    'A cheese factory makes 11,286 slices and packs them into packets of 99. How many packets are filled?'
  ],
  [
    'What is 11,349 \u00f7 97?',
    'A marathon raises \u00a311,349 in sponsorship, split equally among 97 runners. How many pounds does each runner raise?'
  ],
  [
    'What is 11520 \u00f7 96?',
    'A warehouse ships 11520 light bulbs in boxes of 96. How many boxes are shipped?'
  ],
  // --- Difficulty 1 (smaller numbers at the end of the section) ---
  [
    'What is 96 \u00f7 8?',
    'A teacher has 96 gold stars to give out equally to 8 pupils. How many stars does each pupil get?'
  ],
  [
    'What is 150 \u00f7 10?',
    'A shopkeeper arranges 150 tins of beans into rows of 10. How many rows does she make?'
  ],
  [
    'What is 126 \u00f7 7?',
    'A football coach has 126 cones to set out equally on 7 pitches. How many cones go on each pitch?'
  ],
  [
    'What is 168 \u00f7 8?',
    'A dinner lady serves 168 fish fingers equally onto 8 trays. How many fish fingers go on each tray?'
  ],
  [
    'What is 192 \u00f7 6?',
    'A camp leader has 192 marshmallows to divide equally among 6 campfire groups. How many marshmallows does each group get?'
  ],
  [
    'What is 176 \u00f7 11?',
    'A cricket club has 176 balls to split equally into 11 nets. How many balls go in each net?'
  ],
  [
    'What is 117 \u00f7 9?',
    'A teacher has 117 reward stickers to give out equally to 9 children. How many stickers does each child get?'
  ],
  [
    'What is 170 \u00f7 10?',
    'A baker cuts 170 slices of cake and arranges them on plates of 10. How many plates does she fill?'
  ],
  [
    'What is 84 \u00f7 6?',
    'A pet shop has 84 goldfish to put equally into 6 tanks. How many goldfish go in each tank?'
  ],
  [
    'What is 91 \u00f7 7?',
    'A postman delivers 91 letters equally to 7 streets. How many letters does each street receive?'
  ],
  [
    'What is 175 \u00f7 5?',
    'A gardener picks 175 daffodils and ties them into bunches of 5. How many bunches does she make?'
  ],
];

console.log(`Total replacement pairs prepared: ${replacements.length}`);

let replacementsMade = 0;
let notFound = [];

for (const [oldQ, newQ] of replacements) {
  const searchStr = `question: "${oldQ}"`;
  const replaceStr = `question: "${newQ}"`;

  if (content.includes(searchStr)) {
    content = content.replace(searchStr, replaceStr);
    replacementsMade++;
  } else {
    notFound.push(oldQ);
  }
}

// Write back
fs.writeFileSync(filePath, content, 'utf8');

console.log(`\nReplacements made: ${replacementsMade}`);
if (notFound.length > 0) {
  console.log(`\nNot found (${notFound.length}):`);
  notFound.forEach(q => console.log(`  - ${q}`));
}
console.log('\nDone!');

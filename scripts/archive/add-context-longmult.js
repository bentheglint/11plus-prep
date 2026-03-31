/**
 * add-context-longmult.js
 *
 * Adds real-world context wrappers to raw "What is X × Y?" questions
 * in the Long Multiplication section of src/App.js.
 *
 * Rules:
 *  - ONLY the question text is changed; id, difficulty, options, correct, explanation are untouched
 *  - The exact same two numbers and multiplication are preserved
 *  - British English, UK context, age-appropriate (9-10 year olds)
 *  - Every scenario is unique
 *
 * Usage:  node add-context-longmult.js
 */

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src", "App.js");

// Each pair: [exact old question string, new contextual question string]
const replacements = [
  // --- Two-digit × two-digit (difficulty 1-2) ---
  [
    'question: "What is 23 × 14?"',
    'question: "A school hall has 23 rows of chairs with 14 chairs in each row. How many chairs are there altogether?"'
  ],
  [
    'question: "What is 46 × 27?"',
    'question: "A farmer plants 46 rows of apple trees with 27 trees in each row. How many apple trees does he plant?"'
  ],
  [
    'question: "What is 58 × 32?"',
    'question: "A sweet shop orders 58 jars of sweets, with 32 sweets in each jar. How many sweets are ordered in total?"'
  ],
  [
    'question: "What is 125 × 24?"',
    'question: "A factory produces 125 toys every hour. How many toys are made in 24 hours?"'
  ],
  [
    'question: "What is 74 × 19?"',
    'question: "A gardener plants 74 seeds in each flowerbed. If there are 19 flowerbeds, how many seeds are planted altogether?"'
  ],
  [
    'question: "What is 235 × 16?"',
    'question: "A school kitchen uses 235 millilitres of milk per pupil at breakfast. How many millilitres are needed for 16 pupils?"'
  ],
  [
    'question: "What is 89 × 26?"',
    'question: "A PE teacher orders 89 tennis balls for each of 26 classes. How many tennis balls are ordered altogether?"'
  ],
  [
    'question: "What is 145 × 32?"',
    'question: "A baker bakes 145 bread rolls each day. How many bread rolls are baked in 32 days?"'
  ],
  [
    'question: "What is 67 × 38?"',
    'question: "A car park has 67 spaces on each floor. If it has 38 floors, how many spaces are there in total?"'
  ],
  [
    'question: "What is 218 × 25?"',
    'question: "Each carton holds 218 millilitres of orange juice. How many millilitres are in 25 cartons?"'
  ],
  [
    'question: "What is 156 × 42?"',
    'question: "A library receives 156 new books each month. How many new books arrive over 42 months?"'
  ],
  [
    'question: "What is 93 × 47?"',
    'question: "A sports club has 93 members, and each member pays £47 for a kit. What is the total cost of all the kits?"'
  ],
  [
    'question: "What is 284 × 36?"',
    'question: "A printing press prints 284 posters per hour. How many posters are printed in 36 hours?"'
  ],
  [
    'question: "What is 127 × 48?"',
    'question: "A farmer collects 127 eggs each day. How many eggs does he collect in 48 days?"'
  ],
  [
    'question: "What is 315 × 28?"',
    'question: "A school tuck shop sells 315 snacks per week. How many snacks are sold over 28 weeks?"'
  ],
  [
    'question: "What is 176 × 35?"',
    'question: "A charity walk has 176 walkers, and each walker raises £35. How much money is raised altogether?"'
  ],
  [
    'question: "What is 408 × 37?"',
    'question: "A warehouse ships 408 parcels each day. How many parcels are shipped in 37 days?"'
  ],
  [
    'question: "What is 34 × 18?"',
    'question: "A craft club needs 34 beads for each necklace. How many beads are needed to make 18 necklaces?"'
  ],
  [
    'question: "What is 52 × 29?"',
    'question: "A swimming pool sells 52 tickets each session. How many tickets are sold over 29 sessions?"'
  ],
  [
    'question: "What is 87 × 23?"',
    'question: "A school orders 87 exercise books for each of 23 classes. How many exercise books are ordered in total?"'
  ],
  [
    'question: "What is 115 × 34?"',
    'question: "A coach can carry 115 passengers. How many passengers can 34 coaches carry altogether?"'
  ],
  [
    'question: "What is 138 × 26?"',
    'question: "A beekeeper harvests 138 grams of honey from each hive. How many grams does she harvest from 26 hives?"'
  ],
  [
    'question: "What is 76 × 37?"',
    'question: "A cake stall sells 76 cupcakes each day at a fair. How many cupcakes are sold over 37 days?"'
  ],
  [
    'question: "What is 195 × 22?"',
    'question: "A delivery van carries 195 packages on each trip. How many packages are delivered in 22 trips?"'
  ],
  [
    'question: "What is 49 × 58?"',
    'question: "A pet shop has 49 fish tanks, each containing 58 fish. How many fish are there in total?"'
  ],
  [
    'question: "What is 217 × 31?"',
    'question: "A music shop sells 217 guitar picks per week. How many guitar picks are sold in 31 weeks?"'
  ],
  [
    'question: "What is 164 × 45?"',
    'question: "A football stadium sells 164 hot dogs at each match. How many hot dogs are sold over 45 matches?"'
  ],
  [
    'question: "What is 91 × 54?"',
    'question: "A Year 5 sponsored read challenge has 91 pupils, each reading 54 pages. How many pages are read altogether?"'
  ],
  [
    'question: "What is 258 × 39?"',
    'question: "A tile shop sells 258 tiles per day. How many tiles are sold in 39 days?"'
  ],
  [
    'question: "What is 72 × 68?"',
    'question: "A biscuit factory packs 72 biscuits into each tin. How many biscuits are in 68 tins?"'
  ],
  [
    'question: "What is 143 × 52?"',
    'question: "A newsagent sells 143 newspapers each week. How many newspapers are sold in 52 weeks?"'
  ],
  [
    'question: "What is 95 × 63?"',
    'question: "A fruit picker fills 95 punnets of strawberries each day. How many punnets are filled in 63 days?"'
  ],
  [
    'question: "What is 279 × 28?"',
    'question: "A scout group collects 279 items for a food bank each month. How many items are collected in 28 months?"'
  ],
  [
    'question: "What is 56 × 74?"',
    'question: "A toy shop sells 56 building sets per week. How many are sold over 74 weeks?"'
  ],
  [
    'question: "What is 174 × 35?"',
    'question: "A zoo feeds 174 grams of food to each penguin daily. How many grams are needed for 35 penguins?"'
  ],
  [
    'question: "What is 88 × 49?"',
    'question: "A chocolate factory makes 88 bars every hour. How many bars are made in 49 hours?"'
  ],
  [
    'question: "What is 326 × 27?"',
    'question: "A school canteen serves 326 lunches each day. How many lunches are served in 27 days?"'
  ],
  [
    'question: "What is 69 × 82?"',
    'question: "Each class in a school has 69 reading books. If there are 82 classes, how many reading books are there altogether?"'
  ],
  [
    'question: "What is 197 × 43?"',
    'question: "A bike hire company has 197 bikes at each of 43 stations. How many bikes does it have in total?"'
  ],
  [
    'question: "What is 84 × 57?"',
    'question: "A garden centre sells 84 packets of seeds each week. How many packets are sold in 57 weeks?"'
  ],
  [
    'question: "What is 345 × 29?"',
    'question: "A water bottling plant fills 345 bottles per minute. How many bottles are filled in 29 minutes?"'
  ],
  [
    'question: "What is 73 × 91?"',
    'question: "An ice cream van sells 73 ice creams at each event. How many ice creams are sold over 91 events?"'
  ],
  [
    'question: "What is 159 × 36?"',
    'question: "A supermarket stocks 159 tins of soup on each shelf. How many tins are on 36 shelves?"'
  ],
  [
    'question: "What is 97 × 66?"',
    'question: "A rugby club has 97 members, and each member pays £66 in annual fees. What is the total amount collected?"'
  ],
  [
    'question: "What is 382 × 24?"',
    'question: "A power station generates 382 megawatts each hour. How many megawatts are generated in 24 hours?"'
  ],
  [
    'question: "What is 65 × 78?"',
    'question: "A bookshop sells 65 copies of a popular book each week. How many copies are sold in 78 weeks?"'
  ],
  [
    'question: "What is 213 × 51?"',
    'question: "A post office handles 213 letters each hour. How many letters are handled in 51 hours?"'
  ],
  [
    'question: "What is 79 × 85?"',
    'question: "A stationery shop sells 79 pens per day. How many pens are sold over 85 days?"'
  ],
  [
    'question: "What is 418 × 32?"',
    'question: "A bottled water company fills 418 bottles per batch. How many bottles are filled in 32 batches?"'
  ],
  [
    'question: "What is 68 × 93?"',
    'question: "A florist arranges 68 bouquets each week. How many bouquets are arranged in 93 weeks?"'
  ],
  [
    'question: "What is 182 × 47?"',
    'question: "An orchard produces 182 apples from each tree. How many apples come from 47 trees?"'
  ],
  [
    'question: "What is 96 × 72?"',
    'question: "A sandwich shop makes 96 sandwiches each day. How many sandwiches are made in 72 days?"'
  ],
  [
    'question: "What is 453 × 26?"',
    'question: "A lorry transports 453 crates on each journey. How many crates are transported in 26 journeys?"'
  ],
  [
    'question: "What is 81 × 59?"',
    'question: "A bowling alley has 81 pairs of shoes. Each pair is used 59 times per year. How many total uses is that?"'
  ],
  [
    'question: "What is 167 × 39?"',
    'question: "A school photocopier prints 167 worksheets per class. How many worksheets are printed for 39 classes?"'
  ],
  [
    'question: "What is 92 × 67?"',
    'question: "A park ranger plants 92 saplings in each area. How many saplings are planted across 67 areas?"'
  ],
  [
    'question: "What is 524 × 28?"',
    'question: "A theatre sells 524 programmes at each performance. How many programmes are sold over 28 performances?"'
  ],
  [
    'question: "What is 75 × 86?"',
    'question: "A recycling centre collects 75 bags of cans each day. How many bags are collected in 86 days?"'
  ],
  [
    'question: "What is 149 × 53?"',
    'question: "A museum welcomes 149 visitors per tour. How many visitors attend 53 tours?"'
  ],
  [
    'question: "What is 86 × 75?"',
    'question: "A school chess club meets for 86 minutes each session. How many minutes do they play over 75 sessions?"'
  ],
  [
    'question: "What is 597 × 24?"',
    'question: "An airport handles 597 passengers each hour. How many passengers pass through in 24 hours?"'
  ],
  [
    'question: "What is 63 × 94?"',
    'question: "A wildlife reserve has 63 enclosures, each with 94 animals. How many animals are in the reserve?"'
  ],
  [
    'question: "What is 193 × 62?"',
    'question: "A crisp factory packs 193 bags per hour. How many bags are packed in 62 hours?"'
  ],
  [
    'question: "What is 98 × 81?"',
    'question: "A swimming teacher gives 98 lessons each term. How many lessons are given over 81 terms?"'
  ],
  [
    'question: "What is 672 × 29?"',
    'question: "A solar panel farm produces 672 kilowatt-hours per day. How many kilowatt-hours are produced in 29 days?"'
  ],
  [
    'question: "What is 77 × 69?"',
    'question: "A pottery class makes 77 bowls in each session. How many bowls are made in 69 sessions?"'
  ],
  [
    'question: "What is 165 × 48?"',
    'question: "A school orchestra practises for 165 minutes each week. How many minutes do they practise over 48 weeks?"'
  ],
  [
    'question: "What is 94 × 73?"',
    'question: "A campsite has 94 pitches, and each pitch holds 73 litres of water in its tank. How many litres are stored in total?"'
  ],
  [
    'question: "What is 738 × 31?"',
    'question: "A wind farm generates 738 units of electricity per day. How many units are generated in 31 days?"'
  ],
  [
    'question: "What is 62 × 87?"',
    'question: "A knitting group uses 62 balls of wool each month. How many balls are used in 87 months?"'
  ],
  [
    'question: "What is 178 × 54?"',
    'question: "A dairy farm produces 178 litres of milk per cow each week. How many litres do 54 cows produce?"'
  ],
  [
    'question: "What is 89 × 76?"',
    'question: "A skateboard park has 89 visitors each day. How many visitors come over 76 days?"'
  ],
  [
    'question: "What is 814 × 27?"',
    'question: "A newspaper prints 814 copies per edition. How many copies are printed over 27 editions?"'
  ],
  [
    'question: "What is 71 × 92?"',
    'question: "A bird sanctuary rescues 71 birds each month. How many birds are rescued over 92 months?"'
  ],
  [
    'question: "What is 191 × 45?"',
    'question: "A paintball arena uses 191 paintballs per game. How many paintballs are used in 45 games?"'
  ],
  [
    'question: "What is 83 × 84?"',
    'question: "A candle maker produces 83 candles per day. How many candles are produced in 84 days?"'
  ],
  [
    'question: "What is 958 × 23?"',
    'question: "A concert hall has 958 seats. If 23 concerts are held with full houses, how many tickets are sold in total?"'
  ],
  [
    'question: "What is 66 × 95?"',
    'question: "A charity sends 66 parcels each week. How many parcels are sent over 95 weeks?"'
  ],
  [
    'question: "What is 206 × 59?"',
    'question: "A car factory assembles 206 parts per vehicle. How many parts are needed for 59 vehicles?"'
  ],
  [
    'question: "What is 91 × 68?"',
    'question: "A cricket club orders 91 balls for each season. How many balls are ordered over 68 seasons?"'
  ],
  // Note: "What is 869 × 34?" — keeping raw as one of the ~29 left raw
  [
    'question: "What is 78 × 83?"',
    'question: "A dance studio holds 78 classes each term. How many classes are held over 83 terms?"'
  ],
  [
    'question: "What is 183 × 67?"',
    'question: "A bread delivery driver drops off 183 loaves at each shop. How many loaves are delivered to 67 shops?"'
  ],
  [
    'question: "What is 99 × 79?"',
    'question: "A running track is 99 metres around. If an athlete runs 79 laps, how many metres does she run?"'
  ],
  [
    'question: "What is 925 × 38?"',
    'question: "A ferry carries 925 passengers on each crossing. How many passengers does it carry over 38 crossings?"'
  ],
  [
    'question: "What is 85 × 71?"',
    'question: "A farm shop sells 85 boxes of eggs each week. How many boxes are sold in 71 weeks?"'
  ],
  [
    'question: "What is 197 × 52?"',
    'question: "A magazine has 197 pages in each issue. How many pages are in 52 issues?"'
  ],
  [
    'question: "What is 82 × 96?"',
    'question: "A gymnastics team scores 82 points per routine. How many points are scored in 96 routines?"'
  ],
  [
    'question: "What is 976 × 25?"',
    'question: "A drinks machine dispenses 976 cups per day. How many cups are dispensed in 25 days?"'
  ],
  [
    'question: "What is 74 × 88?"',
    'question: "A train has 74 seats in each carriage. How many seats are in 88 carriages?"'
  ],
  [
    'question: "What is 209 × 46?"',
    'question: "A sports shop sells 209 footballs each month. How many footballs are sold in 46 months?"'
  ],
  [
    'question: "What is 93 × 77?"',
    'question: "A holiday park has 93 caravans, and each caravan uses 77 litres of water per day. How many litres are used in total each day?"'
  ],
  [
    'question: "What is 847 × 36?"',
    'question: "A juice company produces 847 bottles per hour. How many bottles are produced in 36 hours?"'
  ],
  [
    'question: "What is 67 × 94?"',
    'question: "A market stall sells 67 bags of sweets each Saturday. How many bags are sold over 94 Saturdays?"'
  ],
  [
    'question: "What is 175 × 69?"',
    'question: "A brickworks makes 175 bricks per hour. How many bricks are made in 69 hours?"'
  ],
  [
    'question: "What is 88 × 62?"',
    'question: "A pizza restaurant uses 88 grams of cheese on each pizza. How many grams are used for 62 pizzas?"'
  ],
  [
    'question: "What is 913 × 43?"',
    'question: "A logistics company delivers 913 parcels per day. How many parcels are delivered in 43 days?"'
  ],
  [
    'question: "What is 69 × 85?"',
    'question: "A greenhouse grows 69 tomato plants in each row. How many plants are in 85 rows?"'
  ],
  // --- Simpler ones (difficulty 1) ---
  [
    'question: "What is 24 × 3?"',
    'question: "A packet of crisps has 24 crisps inside. How many crisps are in 3 packets?"'
  ],
  [
    'question: "What is 15 × 12?"',
    'question: "There are 15 marbles in each bag. How many marbles are in 12 bags?"'
  ],
  [
    'question: "What is 36 × 5?"',
    'question: "A minibus has 36 seats. How many seats are on 5 minibuses?"'
  ],
  [
    'question: "What is 20 × 18?"',
    'question: "A car journey to school takes 20 minutes each way. How many minutes are spent travelling over 18 one-way trips?"'
  ],
  [
    'question: "What is 43 × 7?"',
    'question: "A baker makes 43 scones each morning. How many scones does he make in 7 mornings?"'
  ],
  [
    'question: "What is 16 × 11?"',
    'question: "A crayon box holds 16 crayons. How many crayons are in 11 boxes?"'
  ],
  [
    'question: "What is 32 × 9?"',
    'question: "A netball team scores 32 goals each match. How many goals do they score in 9 matches?"'
  ],
  [
    'question: "What is 25 × 16?"',
    'question: "There are 25 stickers on each sheet. How many stickers are on 16 sheets?"'
  ],
  [
    'question: "What is 14 × 13?"',
    'question: "A garden has 14 sunflowers in each row. How many sunflowers are in 13 rows?"'
  ],
  [
    'question: "What is 50 × 9?"',
    'question: "A box of chalk contains 50 sticks. How many sticks of chalk are in 9 boxes?"'
  ],
];

// --- Run the replacements ---
let content = fs.readFileSync(filePath, "utf8");
let count = 0;

for (const [oldQ, newQ] of replacements) {
  if (content.includes(oldQ)) {
    content = content.replace(oldQ, newQ);
    count++;
  } else {
    console.warn(`WARNING: Could not find: ${oldQ}`);
  }
}

fs.writeFileSync(filePath, content, "utf8");
console.log(`Done! Made ${count} replacements out of ${replacements.length} pairs.`);

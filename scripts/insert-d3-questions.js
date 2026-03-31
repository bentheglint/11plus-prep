#!/usr/bin/env node
/**
 * Insert 108 new D3 questions into mathsData.js and update lesson mappings.
 * Topics: percentages (35), ratio (25), algebra (48)
 */

const fs = require('fs');
const path = require('path');

// =====================================================================
// NEW QUESTIONS DATA
// =====================================================================

const NEW_QUESTIONS = {
  percentages: [
    { id: 178, difficulty: 3, question: "After a 15% pay rise, Tom earns \u00a3460 per week. What was his weekly pay before the rise?", options: ["\u00a3380", "\u00a3391", "\u00a3400", "\u00a3410", "\u00a3445"], correct: 2, explanation: "\u00a3460 is 115% of his original pay (100% + 15%). If 115% = \u00a3460, then 1% = \u00a34, so 100% = \u00a3400. Common mistake: finding 15% of \u00a3460 (= \u00a369) and subtracting to get \u00a3391. \u2713" },
    { id: 179, difficulty: 3, question: "A house is now worth \u00a3230,000 after its value increased by 15%. What was it worth before the increase?", options: ["\u00a3195,500", "\u00a3200,000", "\u00a3205,000", "\u00a3210,000", "\u00a3215,000"], correct: 1, explanation: "\u00a3230,000 is 115% of the original. If 115% = \u00a3230,000, then 1% = \u00a32,000, so 100% = \u00a3200,000. \u2713" },
    { id: 180, difficulty: 3, question: "After a 25% increase, the number of members in a swimming club is 150. How many members were there before?", options: ["112", "113", "120", "125", "130"], correct: 2, explanation: "150 is 125% of the original. If 125% = 150, then 25% = 30 (150 \u00f7 5), so 100% = 30 \u00d7 4 = 120. \u2713" },
    { id: 181, difficulty: 3, question: "A school's intake this year is 360 pupils, which is a 20% increase on last year. How many pupils joined last year?", options: ["280", "288", "300", "310", "340"], correct: 2, explanation: "360 is 120% of last year's intake. If 120% = 360, then 10% = 30 (360 \u00f7 12), so 100% = 300. \u2713" },
    { id: 182, difficulty: 3, question: "After adding a 30% mark-up, a shopkeeper sells a jumper for \u00a352. What did the jumper cost him?", options: ["\u00a336.40", "\u00a338", "\u00a340", "\u00a342", "\u00a344"], correct: 2, explanation: "\u00a352 is 130% of the cost price. If 130% = \u00a352, then 10% = \u00a34 (52 \u00f7 13), so 100% = \u00a340. \u2713" },
    { id: 183, difficulty: 3, question: "After a 12% increase, the price of a train ticket is \u00a328. What was the original price?", options: ["\u00a324.64", "\u00a325", "\u00a326", "\u00a326.50", "\u00a327"], correct: 1, explanation: "\u00a328 is 112% of the original. If 112% = \u00a328, then 1% = \u00a30.25 (28 \u00f7 112), so 100% = \u00a325. \u2713" },
    { id: 184, difficulty: 3, question: "In a school of 600 pupils, 45% are boys. 30% of the boys play football. How many boys play football?", options: ["54", "72", "81", "90", "180"], correct: 2, explanation: "Boys = 45% of 600 = 270. Boys who play football = 30% of 270 = 81. \u2713" },
    { id: 185, difficulty: 3, question: "A farmer has 800 animals. 35% are sheep and the rest are cows. 40% of the cows produce milk. How many cows produce milk?", options: ["128", "192", "208", "280", "320"], correct: 2, explanation: "Cows = 100% \u2212 35% = 65% of 800 = 520. Cows producing milk = 40% of 520 = 208. \u2713" },
    { id: 186, difficulty: 3, question: "A box contains 500 sweets. 60% are toffees and the rest are mints. 25% of the mints are sugar-free. How many sugar-free mints are there?", options: ["30", "40", "50", "75", "125"], correct: 2, explanation: "Mints = 40% of 500 = 200. Sugar-free mints = 25% of 200 = 50. \u2713" },
    { id: 187, difficulty: 3, question: "At a sports day, 300 children take part. 40% choose running events. Of those runners, 75% finish in the top half. How many runners finish in the top half?", options: ["75", "80", "85", "90", "100"], correct: 3, explanation: "Runners = 40% of 300 = 120. Top half = 75% of 120 = 90. \u2713" },
    { id: 188, difficulty: 3, question: "A library has 1,200 books. 55% are fiction. 20% of the fiction books are by British authors. How many fiction books are by British authors?", options: ["120", "132", "144", "220", "240"], correct: 1, explanation: "Fiction = 55% of 1,200 = 660. British fiction = 20% of 660 = 132. \u2713" },
    { id: 189, difficulty: 3, question: "What is 20% of 20% of 500?", options: ["20", "40", "100", "200", "250"], correct: 0, explanation: "Step 1: 20% of 500 = 100. Step 2: 20% of 100 = 20. The most common mistake is adding: 20% + 20% = 40% of 500 = 200. \u2713" },
    { id: 190, difficulty: 3, question: "What percentage of 25 is 80?", options: ["31.25%", "125%", "225%", "300%", "320%"], correct: 4, explanation: "Percentage = (80 \u00f7 25) \u00d7 100 = 3.2 \u00d7 100 = 320%. Since 80 is more than 25, the answer must be over 100%. \u2713" },
    { id: 191, difficulty: 3, question: "Express 45 as a percentage of 20.", options: ["44.4%", "125%", "200%", "225%", "450%"], correct: 3, explanation: "Percentage = (45 \u00f7 20) \u00d7 100 = 2.25 \u00d7 100 = 225%. \u2713" },
    { id: 192, difficulty: 3, question: "A plant was 30 cm tall. After a growth spurt, it is now 48 cm tall. Express its new height as a percentage of its original height.", options: ["60%", "62.5%", "130%", "148%", "160%"], correct: 4, explanation: "Percentage = (48 \u00f7 30) \u00d7 100 = 1.6 \u00d7 100 = 160%. \u2713" },
    { id: 193, difficulty: 3, question: "In a bake sale, the target was to sell 40 cakes. The children actually sold 70. What percentage of the target did they achieve?", options: ["30%", "57.1%", "130%", "170%", "175%"], correct: 4, explanation: "Percentage = (70 \u00f7 40) \u00d7 100 = 1.75 \u00d7 100 = 175%. \u2713" },
    { id: 194, difficulty: 3, question: "What percentage of 16 is 60?", options: ["26.7%", "160%", "275%", "360%", "375%"], correct: 4, explanation: "Percentage = (60 \u00f7 16) \u00d7 100 = 3.75 \u00d7 100 = 375%. \u2713" },
    { id: 195, difficulty: 3, question: "A shop increases the price of an \u00a380 toy by 25%, then later reduces the new price by 25%. What is the final price?", options: ["\u00a372", "\u00a375", "\u00a378", "\u00a380", "\u00a382"], correct: 1, explanation: "Increase: 25% of \u00a380 = \u00a320, so price = \u00a3100. Decrease: 25% of \u00a3100 = \u00a325, so final price = \u00a375. The price does NOT return to \u00a380. \u2713" },
    { id: 196, difficulty: 3, question: "A coat originally costs \u00a3120. It is reduced by 30% in a sale, then the sale price is increased by 30% when the sale ends. What is the final price?", options: ["\u00a3108", "\u00a3109.20", "\u00a3112", "\u00a3115.20", "\u00a3120"], correct: 1, explanation: "Reduction: 30% of \u00a3120 = \u00a336, sale price = \u00a384. Increase: 30% of \u00a384 = \u00a325.20, final price = \u00a384 + \u00a325.20 = \u00a3109.20. \u2713" },
    { id: 197, difficulty: 3, question: "A town's population of 2,000 increases by 20% one year, then decreases by 20% the next. What is the population after both changes?", options: ["1,880", "1,900", "1,920", "1,960", "2,000"], correct: 2, explanation: "After 20% increase: 2,000 becomes 2,400. After 20% decrease: 20% of 2,400 = 480, so 2,400 \u2212 480 = 1,920. \u2713" },
    { id: 198, difficulty: 3, question: "A dress costs \u00a3150. It is first reduced by 40%, then the sale price is increased by 20%. What is the final price?", options: ["\u00a396", "\u00a3102", "\u00a3105", "\u00a3108", "\u00a3120"], correct: 3, explanation: "Reduction: 40% of \u00a3150 = \u00a360, sale price = \u00a390. Increase: 20% of \u00a390 = \u00a318, final price = \u00a390 + \u00a318 = \u00a3108. \u2713" },
    { id: 199, difficulty: 3, question: "A painting's value increases by 50% one year and decreases by 50% the next. If it started at \u00a3400, what is it worth now?", options: ["\u00a3100", "\u00a3200", "\u00a3300", "\u00a3350", "\u00a3400"], correct: 2, explanation: "After 50% increase: \u00a3400 becomes \u00a3600. After 50% decrease: 50% of \u00a3600 = \u00a3300, so \u00a3600 \u2212 \u00a3300 = \u00a3300. \u2713" },
    { id: 200, difficulty: 3, question: "A rectangular garden is 20 m long and 15 m wide. The owner extends the length by 10% and the width by 20%. What is the area of the new garden?", options: ["330 m\u00b2", "360 m\u00b2", "390 m\u00b2", "396 m\u00b2", "420 m\u00b2"], correct: 3, explanation: "New length = 20 + 10% of 20 = 22 m. New width = 15 + 20% of 15 = 18 m. New area = 22 \u00d7 18 = 396 m\u00b2. \u2713" },
    { id: 201, difficulty: 3, question: "Emma scores 72 out of 80 on her English test and 54 out of 75 on her maths test. Which test did she score a higher percentage on, and by how much?", options: ["English, by 10%", "English, by 18%", "Maths, by 12%", "Maths, by 18%", "English, by 8%"], correct: 1, explanation: "English: (72 \u00f7 80) \u00d7 100 = 90%. Maths: (54 \u00f7 75) \u00d7 100 = 72%. Difference: 90% \u2212 72% = 18%. \u2713" },
    { id: 202, difficulty: 3, question: "A shop sells 3/5 of its 200 jumpers at full price (\u00a340 each) and the rest at a 25% discount. What is the total income?", options: ["\u00a36,200", "\u00a37,200", "\u00a37,400", "\u00a37,600", "\u00a38,000"], correct: 1, explanation: "Full price: 3/5 of 200 = 120 jumpers \u00d7 \u00a340 = \u00a34,800. Discounted price = \u00a340 \u2212 25% = \u00a330. Discounted jumpers: 80 \u00d7 \u00a330 = \u00a32,400. Total = \u00a37,200. \u2713" },
    { id: 203, difficulty: 3, question: "Ben has \u00a3240. He spends 35% on books and 1/4 of the remainder on a game. How much money does he have left?", options: ["\u00a384", "\u00a396", "\u00a3108", "\u00a3117", "\u00a3120"], correct: 3, explanation: "Spent on books: 35% of \u00a3240 = \u00a384. Remainder: \u00a3156. Spent on game: 1/4 of \u00a3156 = \u00a339. Left: \u00a3156 \u2212 \u00a339 = \u00a3117. \u2713" },
    { id: 204, difficulty: 3, question: "A school has 800 pupils. 45% walk to school and 1/8 of the rest cycle. How many pupils cycle?", options: ["45", "50", "55", "60", "100"], correct: 2, explanation: "Walk: 45% of 800 = 360. Rest: 440. Cycle: 1/8 of 440 = 55. \u2713" },
    { id: 205, difficulty: 3, question: "A market trader buys apples for 40p each and sells them for 50p each. What is his percentage profit per apple?", options: ["10%", "15%", "20%", "25%", "50%"], correct: 3, explanation: "Profit = 10p. Percentage profit = (10 \u00f7 40) \u00d7 100 = 25%. Don't divide by selling price (20%). \u2713" },
    { id: 206, difficulty: 3, question: "Lucy buys a bicycle for \u00a3120 and sells it for \u00a390. What is her percentage loss?", options: ["15%", "20%", "25%", "30%", "33.3%"], correct: 2, explanation: "Loss = \u00a330. Percentage loss = (30 \u00f7 120) \u00d7 100 = 25%. \u2713" },
    { id: 207, difficulty: 3, question: "A shop buys a coat for \u00a380 and sells it for \u00a3100. What is the percentage profit?", options: ["15%", "20%", "25%", "30%", "80%"], correct: 2, explanation: "Profit = \u00a320. Percentage profit = (20 \u00f7 80) \u00d7 100 = 25%. Don't use selling price as denominator (20%). \u2713" },
    { id: 208, difficulty: 3, question: "A car dealer buys a car for \u00a35,000 and sells it for \u00a36,500. What percentage profit does he make?", options: ["15%", "20%", "23.1%", "25%", "30%"], correct: 4, explanation: "Profit = \u00a31,500. Percentage profit = (1,500 \u00f7 5,000) \u00d7 100 = 30%. \u2713" },
    { id: 209, difficulty: 3, question: "A baker buys ingredients for \u00a32.40 per cake and sells each cake for \u00a33.60. What is her percentage profit per cake?", options: ["30%", "33.3%", "40%", "50%", "60%"], correct: 3, explanation: "Profit = \u00a31.20. Percentage profit = (1.20 \u00f7 2.40) \u00d7 100 = 50%. \u2713" },
    { id: 210, difficulty: 3, question: "A bag contains 30 red balls and 20 blue balls. What percentage of the balls are red?", options: ["20%", "30%", "50%", "60%", "66.7%"], correct: 3, explanation: "Total balls = 50. Percentage red = (30 \u00f7 50) \u00d7 100 = 60%. The whole is the total, not just red. \u2713" },
    { id: 211, difficulty: 3, question: "In a cricket match, Team A scores 180 runs and Team B scores 120 runs. What percentage of the total runs were scored by Team A?", options: ["50%", "55%", "60%", "66.7%", "150%"], correct: 2, explanation: "Total runs = 300. Team A's percentage = (180 \u00f7 300) \u00d7 100 = 60%. \u2713" },
    { id: 212, difficulty: 3, question: "At a party, 18 children want pizza and 12 want sandwiches. What percentage of children want sandwiches?", options: ["12%", "30%", "33.3%", "40%", "66.7%"], correct: 3, explanation: "Total children = 30. Percentage = (12 \u00f7 30) \u00d7 100 = 40%. You must add both groups to find the whole. \u2713" },
  ],

  ratio: [
    { id: 181, difficulty: 3, question: "In a school, the ratio of boys to girls is 3:5. There are 120 pupils in total. 40% of the girls play netball. How many girls play netball?", options: ["24", "28", "30", "36", "48"], correct: 2, explanation: "Total parts: 8. Each part = 15. Girls = 75. 40% of 75 = 30. \u2713" },
    { id: 182, difficulty: 3, question: "Red and blue counters are in a bag in the ratio 2:3. There are 60 counters altogether. 25% of the red counters are removed. How many counters remain in the bag?", options: ["48", "51", "54", "56", "58"], correct: 2, explanation: "Red = 24. 25% of 24 = 6 removed. Remaining = 60 \u2212 6 = 54. \u2713" },
    { id: 183, difficulty: 3, question: "In a class, the ratio of boys to girls is 4:5. There are 90 children. 60% of the boys and 80% of the girls walk to school. How many children walk to school altogether?", options: ["56", "60", "64", "68", "72"], correct: 2, explanation: "Boys = 40, girls = 50. Boys walking = 24. Girls walking = 40. Total = 64. \u2713" },
    { id: 184, difficulty: 3, question: "Apples and pears in a box are in the ratio 7:3. There are 200 pieces of fruit. 30% of the apples are green. How many green apples are there?", options: ["21", "35", "42", "49", "60"], correct: 2, explanation: "Apples = 140. 30% of 140 = 42. \u2713" },
    { id: 185, difficulty: 3, question: "Ali and Beth share some money in the ratio 4:5. Ali's share is 3/4 of \u00a380. How much money is shared in total?", options: ["\u00a3120", "\u00a3125", "\u00a3130", "\u00a3135", "\u00a3140"], correct: 3, explanation: "Ali's share = 3/4 of \u00a380 = \u00a360. 1 part = \u00a315. Total = 9 \u00d7 \u00a315 = \u00a3135. \u2713" },
    { id: 186, difficulty: 3, question: "Cara and Dan share prize money in the ratio 3:7. Dan spends 2/5 of his share and has \u00a384 left. How much prize money was shared in total?", options: ["\u00a3180", "\u00a3190", "\u00a3200", "\u00a3210", "\u00a3220"], correct: 2, explanation: "Dan has 3/5 left. 3/5 of Dan's share = \u00a384, so Dan's share = \u00a3140. 1 part = \u00a320. Total = \u00a3200. \u2713" },
    { id: 187, difficulty: 3, question: "Sweets are shared between Emma and Finn in the ratio 5:3. Emma gives 1/5 of her sweets to her sister. Emma now has 36 sweets. How many sweets does Finn have?", options: ["24", "25", "27", "28", "30"], correct: 2, explanation: "4/5 of Emma's share = 36. Emma's original = 45. 1 part = 9. Finn = 27. \u2713" },
    { id: 188, difficulty: 3, question: "Red and blue marbles in a bag are in the ratio 3:5. After adding 6 red marbles, the ratio becomes 3:4. How many blue marbles are in the bag?", options: ["20", "24", "30", "36", "40"], correct: 4, explanation: "Let red = 3x, blue = 5x. (3x+6):5x = 3:4. Cross-multiply: 12x+24 = 15x, so x = 8. Blue = 40. \u2713" },
    { id: 189, difficulty: 3, question: "In a pet shop, cats and dogs are in the ratio 2:3. After 4 more cats arrive, the ratio becomes 4:5. How many dogs are in the shop?", options: ["20", "24", "28", "30", "36"], correct: 3, explanation: "Let cats = 2x, dogs = 3x. (2x+4):3x = 4:5. 10x+20 = 12x, so x = 10. Dogs = 30. \u2713" },
    { id: 190, difficulty: 3, question: "A box has red and blue counters in the ratio 5:2. After 8 more blue counters are added, the ratio becomes 5:4. How many red counters are in the box?", options: ["10", "15", "16", "20", "25"], correct: 3, explanation: "Let red = 5x, blue = 2x. 5x:(2x+8) = 5:4. 20x = 10x+40, so x = 4. Red = 20. \u2713" },
    { id: 191, difficulty: 3, question: "In a school, the ratio of boys to girls is 4:7. After 6 new boys join, the ratio becomes 2:3. How many girls are there?", options: ["42", "49", "54", "56", "63"], correct: 4, explanation: "Let boys = 4x, girls = 7x. (4x+6):7x = 2:3. 12x+18 = 14x, so x = 9. Girls = 63. \u2713" },
    { id: 192, difficulty: 3, question: "A cake recipe for 6 people uses 240g of flour. How much flour is needed for 15 people?", options: ["480g", "540g", "600g", "660g", "720g"], correct: 2, explanation: "Per person = 40g. For 15: 40 \u00d7 15 = 600g. (Scale factor 2.5.) \u2713" },
    { id: 193, difficulty: 3, question: "A flapjack recipe for 8 people uses 340g of butter. How much butter is needed for 14 people?", options: ["560g", "580g", "595g", "610g", "680g"], correct: 2, explanation: "Per person = 42.5g. For 14: 42.5 \u00d7 14 = 595g. (Scale factor 1.75.) \u2713" },
    { id: 194, difficulty: 3, question: "A smoothie recipe for 4 glasses uses 150ml of yoghurt. How much yoghurt is needed for 10 glasses?", options: ["300ml", "350ml", "375ml", "400ml", "450ml"], correct: 2, explanation: "Per glass = 37.5ml. For 10: 37.5 \u00d7 10 = 375ml. (Scale factor 2.5.) \u2713" },
    { id: 195, difficulty: 3, question: "A map has a scale of 1:50,000. Two towns are 8 cm apart on the map. A bus travels between the towns at 60 km/h. How many minutes does the journey take?", options: ["3 minutes", "4 minutes", "5 minutes", "6 minutes", "8 minutes"], correct: 1, explanation: "Real distance = 8 \u00d7 50,000 = 400,000 cm = 4 km. Time = 4 \u00f7 60 hours = 4 minutes. \u2713" },
    { id: 196, difficulty: 3, question: "A map has a scale of 1:25,000. Two villages are 12 cm apart on the map. A car drives between them at 30 km/h. How many minutes does the journey take?", options: ["4 minutes", "5 minutes", "6 minutes", "8 minutes", "10 minutes"], correct: 2, explanation: "Real distance = 12 \u00d7 25,000 = 300,000 cm = 3 km. Time = 3 \u00f7 30 = 0.1 hours = 6 minutes. \u2713" },
    { id: 197, difficulty: 3, question: "On a map, 1 cm represents 2.5 km. The distance between two landmarks on the map is 6.4 cm. What is the actual distance in metres?", options: ["1,600 m", "14,000 m", "15,000 m", "16,000 m", "20,000 m"], correct: 3, explanation: "Distance = 6.4 \u00d7 2.5 = 16 km = 16,000 m. \u2713" },
    { id: 198, difficulty: 3, question: "Prize money of \u00a3400 is shared between three winners in the ratio 2:3:5. The person with the largest share donates 20% of it to charity. How much does this person keep?", options: ["\u00a3120", "\u00a3140", "\u00a3160", "\u00a3180", "\u00a3200"], correct: 2, explanation: "Largest share = 5 \u00d7 \u00a340 = \u00a3200. 20% of \u00a3200 = \u00a340. Keeps \u00a3160. \u2713" },
    { id: 199, difficulty: 3, question: "\u00a3300 is shared between three friends in the ratio 1:3:6. The person with the largest share gives away 1/3 of it. What is the new total amount the three friends have between them?", options: ["\u00a3200", "\u00a3220", "\u00a3240", "\u00a3260", "\u00a3280"], correct: 2, explanation: "Shares: \u00a330, \u00a390, \u00a3180. Largest gives away 1/3 of \u00a3180 = \u00a360. New total = \u00a3240. \u2713" },
    { id: 200, difficulty: 3, question: "480 tokens are shared between three children in the ratio 2:3:7. The child with the largest share loses 25% of their tokens. How many tokens does this child now have?", options: ["196", "200", "210", "224", "280"], correct: 2, explanation: "Largest = 7 \u00d7 40 = 280. 25% of 280 = 70 lost. Remaining = 210. \u2713" },
    { id: 201, difficulty: 3, question: "\u00a3360 is shared between Kai, Leah, and Mia in the ratio 3:4:5. Leah gives 25% of her share to charity. How much does Leah give to charity?", options: ["\u00a320", "\u00a325", "\u00a330", "\u00a336", "\u00a340"], correct: 2, explanation: "Leah's share = 4 \u00d7 \u00a330 = \u00a3120. 25% of \u00a3120 = \u00a330. \u2713" },
    { id: 202, difficulty: 3, question: "Write the ratio 45:75:120 in its simplest form.", options: ["3:5:6", "3:5:8", "3:5:9", "9:15:24", "9:25:40"], correct: 1, explanation: "HCF of 45, 75, 120 = 15. Divide: 3:5:8. \u2713" },
    { id: 203, difficulty: 3, question: "Which of these ratios is NOT equivalent to 6:9?", options: ["2:3", "10:15", "4:9", "8:12", "14:21"], correct: 2, explanation: "6:9 simplifies to 2:3. 4:9 \u2260 2:3. All others simplify to 2:3. \u2713" },
    { id: 204, difficulty: 3, question: "Write the ratio 36:60:84 in its simplest form.", options: ["3:5:6", "3:5:7", "6:10:14", "9:15:21", "12:20:28"], correct: 1, explanation: "HCF = 12. Divide: 3:5:7. \u2713" },
    { id: 205, difficulty: 3, question: "Express the ratio 1.5 kg : 900 g : 600 g in its simplest form.", options: ["3:2:1", "5:3:1", "5:3:2", "15:9:6", "15:9:2"], correct: 2, explanation: "Convert to grams: 1500:900:600. HCF = 300. Divide: 5:3:2. \u2713" },
  ],

  algebra: [
    { id: 205, difficulty: 3, question: "Solve: 5x - 3 = 2x + 12", options: ["x = 5", "x = 3", "x = 4", "x = 6", "x = 9"], correct: 0, explanation: "Subtract 2x: 3x - 3 = 12. Add 3: 3x = 15. x = 5. Check: 25-3=22, 10+12=22. \u2713" },
    { id: 206, difficulty: 3, question: "Solve: 4n + 7 = 6n - 5", options: ["n = 1", "n = 2", "n = 4", "n = 6", "n = 12"], correct: 3, explanation: "Subtract 4n: 7 = 2n - 5. Add 5: 12 = 2n. n = 6. Check: 31 = 31. \u2713" },
    { id: 207, difficulty: 3, question: "Solve: 7x - 10 = 3x + 14", options: ["x = 6", "x = 1", "x = 4", "x = 8", "x = 24"], correct: 0, explanation: "Subtract 3x: 4x - 10 = 14. Add 10: 4x = 24. x = 6. Check: 32 = 32. \u2713" },
    { id: 208, difficulty: 3, question: "Solve: 3y + 20 = 5y + 6", options: ["y = 3", "y = 7", "y = 5", "y = 13", "y = 14"], correct: 1, explanation: "Subtract 3y: 20 = 2y + 6. Subtract 6: 14 = 2y. y = 7. Check: 41 = 41. \u2713" },
    { id: 209, difficulty: 3, question: "Solve: 8n - 15 = 5n + 9", options: ["n = 8", "n = 2", "n = 6", "n = 12", "n = 24"], correct: 0, explanation: "Subtract 5n: 3n - 15 = 9. Add 15: 3n = 24. n = 8. Check: 49 = 49. \u2713" },
    { id: 210, difficulty: 3, question: "Solve: 2x + 25 = 6x + 1", options: ["x = 6", "x = 4", "x = 5", "x = 7", "x = 26"], correct: 0, explanation: "Subtract 2x: 25 = 4x + 1. Subtract 1: 24 = 4x. x = 6. Check: 37 = 37. \u2713" },
    { id: 211, difficulty: 3, question: "Solve: 9a - 4 = 5a + 20", options: ["a = 4", "a = 5", "a = 8", "a = 16", "a = 6"], correct: 4, explanation: "Subtract 5a: 4a - 4 = 20. Add 4: 4a = 24. a = 6. Check: 50 = 50. \u2713" },
    { id: 212, difficulty: 3, question: "Solve: 10m - 7 = 4m + 23", options: ["m = 5", "m = 3", "m = 4", "m = 6", "m = 30"], correct: 0, explanation: "Subtract 4m: 6m - 7 = 23. Add 7: 6m = 30. m = 5. Check: 43 = 43. \u2713" },
    { id: 213, difficulty: 3, question: "Emma has x stickers. She has 7 more than twice what Ben has. Ben has 12 stickers. How many stickers does Emma have?", options: ["31", "26", "19", "29", "34"], correct: 0, explanation: "x = 2 \u00d7 12 + 7 = 24 + 7 = 31. \u2713" },
    { id: 214, difficulty: 3, question: "A cinema charges \u00a3x per ticket. Oliver buys 3 tickets and pays with a \u00a320 note. He gets \u00a32 change. How much is one ticket?", options: ["\u00a34", "\u00a36", "\u00a35", "\u00a37", "\u00a38"], correct: 1, explanation: "3x = 20 - 2 = 18. x = 6. \u2713" },
    { id: 215, difficulty: 3, question: "Amira is y years old. Her dad is 5 times her age minus 3. Her dad is 37 years old. How old is Amira?", options: ["8", "6", "7", "9", "10"], correct: 0, explanation: "5y - 3 = 37. 5y = 40. y = 8. \u2713" },
    { id: 216, difficulty: 3, question: "Noah buys 4 identical books and a \u00a35 bookmark. He spends \u00a337 altogether. How much does one book cost?", options: ["\u00a36", "\u00a38", "\u00a37", "\u00a39", "\u00a310"], correct: 1, explanation: "4b + 5 = 37. 4b = 32. b = 8. \u2713" },
    { id: 217, difficulty: 3, question: "A school hires n minibuses, each holding 14 pupils. There are also 6 teachers travelling by car. The total number of people on the trip is 76. How many minibuses are needed?", options: ["3", "5", "4", "6", "7"], correct: 1, explanation: "14n + 6 = 76. 14n = 70. n = 5. \u2713" },
    { id: 218, difficulty: 3, question: "Lily and Jake collect conkers. Lily has 3 times as many as Jake. Together they have 48 conkers. How many does Lily have?", options: ["12", "16", "24", "36", "48"], correct: 3, explanation: "j + 3j = 48, so 4j = 48, j = 12. Lily = 36. \u2713" },
    { id: 219, difficulty: 3, question: "A rectangle's length is 5 cm more than its width. The perimeter is 42 cm. What is the width?", options: ["8 cm", "6 cm", "7 cm", "9 cm", "10 cm"], correct: 0, explanation: "2(w + w + 5) = 42. 4w + 10 = 42. 4w = 32. w = 8. Check: 8+13+8+13 = 42. \u2713" },
    { id: 220, difficulty: 3, question: "A plumber charges a \u00a330 call-out fee plus \u00a315 for each hour of work. Mrs Chen's bill was \u00a3105. How many hours did the plumber work?", options: ["3", "4", "6", "7", "5"], correct: 4, explanation: "15h + 30 = 105. 15h = 75. h = 5. \u2713" },
    { id: 221, difficulty: 3, question: "Two numbers add up to 30. One number is twice the other. What is the larger number?", options: ["10", "12", "15", "18", "20"], correct: 4, explanation: "x + 2x = 30. 3x = 30. x = 10. Larger = 20. \u2713" },
    { id: 222, difficulty: 3, question: "a + b = 28 and a = 3b. What is the value of a?", options: ["7", "14", "18", "21", "24"], correct: 3, explanation: "3b + b = 28. 4b = 28. b = 7. a = 21. \u2713" },
    { id: 223, difficulty: 3, question: "Two numbers add up to 50. One number is 14 more than the other. What is the smaller number?", options: ["16", "18", "20", "22", "24"], correct: 1, explanation: "x + (x+14) = 50. 2x = 36. x = 18. \u2713" },
    { id: 224, difficulty: 3, question: "p + q = 42 and p is 5 times q. What is the value of q?", options: ["4", "5", "6", "7", "8"], correct: 3, explanation: "5q + q = 42. 6q = 42. q = 7. \u2713" },
    { id: 225, difficulty: 3, question: "Two numbers, x and y, satisfy x + y = 35 and x - y = 9. What is x?", options: ["13", "22", "18", "20", "26"], correct: 1, explanation: "Add equations: 2x = 44. x = 22. y = 13. \u2713" },
    { id: 226, difficulty: 3, question: "m + n = 24 and m is 3 more than twice n. What is m?", options: ["10", "14", "15", "17", "21"], correct: 3, explanation: "m = 2n+3. (2n+3)+n = 24. 3n = 21. n = 7. m = 17. \u2713" },
    { id: 227, difficulty: 3, question: "If x = -3, what is the value of 2x + 10?", options: ["-4", "1", "7", "16", "4"], correct: 4, explanation: "2 \u00d7 (-3) + 10 = -6 + 10 = 4. \u2713" },
    { id: 228, difficulty: 3, question: "If a = -2 and b = 5, what is the value of 3a + 2b?", options: ["-4", "1", "16", "19", "4"], correct: 4, explanation: "3 \u00d7 (-2) + 2 \u00d7 5 = -6 + 10 = 4. \u2713" },
    { id: 229, difficulty: 3, question: "If x = -4, what is the value of 5x + 30?", options: ["-10", "5", "10", "20", "50"], correct: 2, explanation: "5 \u00d7 (-4) + 30 = -20 + 30 = 10. \u2713" },
    { id: 230, difficulty: 3, question: "If p = -5 and q = 3, what is the value of 4p + 6q?", options: ["-8", "-2", "2", "8", "38"], correct: 1, explanation: "4 \u00d7 (-5) + 6 \u00d7 3 = -20 + 18 = -2. \u2713" },
    { id: 231, difficulty: 3, question: "If n = -6, what is the value of 3n + 25?", options: ["-7", "1", "11", "43", "7"], correct: 4, explanation: "3 \u00d7 (-6) + 25 = -18 + 25 = 7. \u2713" },
    { id: 232, difficulty: 3, question: "If p = 4, what is 3(p + 2) - 2(p - 1)?", options: ["8", "10", "12", "14", "16"], correct: 2, explanation: "3 \u00d7 6 - 2 \u00d7 3 = 18 - 6 = 12. \u2713" },
    { id: 233, difficulty: 3, question: "If x = 5, what is 2(x + 3) + 3(x - 1)?", options: ["22", "25", "26", "28", "30"], correct: 3, explanation: "2 \u00d7 8 + 3 \u00d7 4 = 16 + 12 = 28. \u2713" },
    { id: 234, difficulty: 3, question: "If a = 6, what is (a + 4) \u00d7 (a - 2)?", options: ["24", "32", "40", "36", "48"], correct: 2, explanation: "10 \u00d7 4 = 40. \u2713" },
    { id: 235, difficulty: 3, question: "If m = 3, what is 4(2m - 1) + 3?", options: ["17", "19", "20", "23", "27"], correct: 3, explanation: "4 \u00d7 (6-1) + 3 = 4 \u00d7 5 + 3 = 23. \u2713" },
    { id: 236, difficulty: 3, question: "If y = 7, what is 5(y - 3) - 2(y + 1)?", options: ["2", "4", "6", "8", "12"], correct: 1, explanation: "5 \u00d7 4 - 2 \u00d7 8 = 20 - 16 = 4. \u2713" },
    { id: 237, difficulty: 3, question: "Star + Star + Triangle = 20 and Star = 2 \u00d7 Triangle. What is the value of Triangle?", options: ["2", "4", "5", "6", "8"], correct: 1, explanation: "2T + 2T + T = 5T = 20. T = 4. Star = 8. Check: 8+8+4 = 20. \u2713" },
    { id: 238, difficulty: 3, question: "Heart + Heart + Diamond = 19 and Heart - Diamond = 5. What is the value of Heart?", options: ["5", "6", "7", "8", "10"], correct: 3, explanation: "H = D+5. (D+5)+(D+5)+D = 3D+10 = 19. 3D = 9. D = 3. H = 8. \u2713" },
    { id: 239, difficulty: 3, question: "Triangle + Square + Square = 22 and Triangle = Square + 4. What is the value of Square?", options: ["4", "5", "6", "7", "8"], correct: 2, explanation: "(S+4)+S+S = 3S+4 = 22. 3S = 18. S = 6. \u2713" },
    { id: 240, difficulty: 3, question: "Star + Star + Star + Moon = 31 and Star + Moon = 13. What is the value of Moon?", options: ["3", "4", "5", "6", "9"], correct: 1, explanation: "3S + M = 31. S + M = 13. Subtract: 2S = 18. S = 9. M = 4. \u2713" },
    { id: 241, difficulty: 3, question: "Arrow + Arrow + Circle = 26 and Arrow + Circle + Circle = 22. What is the value of Arrow?", options: ["6", "7", "8", "9", "10"], correct: 4, explanation: "Subtract: Arrow - Circle = 4. So Arrow = Circle+4. (C+4)+2C = 22. 3C = 18. C = 6. Arrow = 10. \u2713" },
    { id: 242, difficulty: 3, question: "Sun + Sun + Cloud = 24 and Sun - Cloud = 6. What is the value of Sun?", options: ["6", "7", "8", "9", "10"], correct: 4, explanation: "Cloud = Sun-6. 2S+(S-6) = 3S-6 = 24. 3S = 30. S = 10. \u2713" },
    { id: 243, difficulty: 3, question: "A rectangle has sides of length (2x + 1) cm and (x + 3) cm. The perimeter is 38 cm. What is the value of x?", options: ["x = 3", "x = 4", "x = 5", "x = 6", "x = 8"], correct: 2, explanation: "6x + 8 = 38. 6x = 30. x = 5. Sides: 11 and 8. Check: 2(11+8) = 38. \u2713" },
    { id: 244, difficulty: 3, question: "A triangle has sides (x + 5) cm, (x + 3) cm, and (2x - 2) cm. The perimeter is 34 cm. What is the value of x?", options: ["x = 4", "x = 5", "x = 6", "x = 7", "x = 10"], correct: 3, explanation: "4x + 6 = 34. 4x = 28. x = 7. \u2713" },
    { id: 245, difficulty: 3, question: "A rectangle has a length of (3x - 1) cm and a width of 4 cm. Its area is 44 cm\u00b2. What is x?", options: ["x = 2", "x = 3", "x = 4", "x = 5", "x = 11"], correct: 2, explanation: "(3x-1) \u00d7 4 = 44. 3x-1 = 11. 3x = 12. x = 4. \u2713" },
    { id: 246, difficulty: 3, question: "A square has sides of length (x + 3) cm. Its perimeter is 52 cm. What is x?", options: ["x = 7", "x = 9", "x = 10", "x = 13", "x = 49"], correct: 2, explanation: "4(x+3) = 52. x+3 = 13. x = 10. \u2713" },
    { id: 247, difficulty: 3, question: "A rectangle has sides of length (3x + 2) cm and (x + 6) cm. The perimeter is 48 cm. What is the length of the longer side?", options: ["10 cm", "14 cm", "12 cm", "16 cm", "24 cm"], correct: 1, explanation: "8x + 16 = 48. 8x = 32. x = 4. Sides: 14 and 10. Longer = 14. \u2713" },
    { id: 248, difficulty: 3, question: "The nth term of a sequence is 4n - 3. Which term in the sequence equals 45?", options: ["10th", "11th", "12th", "13th", "15th"], correct: 2, explanation: "4n - 3 = 45. 4n = 48. n = 12. \u2713" },
    { id: 249, difficulty: 3, question: "A sequence goes 7, 12, 17, 22, 27, ... Is 100 a term in this sequence?", options: ["Yes, it is the 18th term", "Yes, it is the 19th term", "Yes, it is the 20th term", "Yes, it is the 21st term", "No, 100 is not a term in this sequence"], correct: 4, explanation: "nth term = 5n + 2. 5n + 2 = 100: 5n = 98, n = 19.6. Not whole, so no. \u2713" },
    { id: 250, difficulty: 3, question: "The rule for a sequence is 3n + 5. What is the 15th term?", options: ["45", "47", "48", "50", "53"], correct: 3, explanation: "3 \u00d7 15 + 5 = 50. \u2713" },
    { id: 251, difficulty: 3, question: "A sequence goes 6, 11, 16, 21, 26, ... Which is the first term greater than 100?", options: ["18th", "19th", "20th", "21st", "22nd"], correct: 2, explanation: "nth term = 5n + 1. 5n + 1 > 100 means n > 19.8. First whole = 20. 20th term = 101. \u2713" },
    { id: 252, difficulty: 3, question: "A sequence goes 8, 15, 22, 29, 36, ... Is 120 a term in this sequence? If so, which one?", options: ["Yes, the 15th", "Yes, the 16th", "Yes, the 17th", "No, not in the sequence", "Yes, the 18th"], correct: 2, explanation: "nth term = 7n + 1. 7n + 1 = 120. 7n = 119. n = 17. Yes, 17th term. \u2713" },
  ]
};

// =====================================================================
// LESSON MAPPINGS for new questions
// =====================================================================

const LESSON_MAPPINGS = {
  percentages: {
    178: "reverse-percentage", 179: "reverse-percentage", 180: "reverse-percentage",
    181: "reverse-percentage", 182: "reverse-percentage", 183: "reverse-percentage",
    184: "percentage-word-problems", 185: "percentage-word-problems", 186: "percentage-word-problems",
    187: "percentage-word-problems", 188: "percentage-word-problems", 189: "percentage-word-problems",
    190: "express-as-percentage", 191: "express-as-percentage", 192: "express-as-percentage",
    193: "express-as-percentage", 194: "express-as-percentage",
    195: "successive-percentages", 196: "successive-percentages", 197: "successive-percentages",
    198: "successive-percentages", 199: "successive-percentages",
    200: "percentage-word-problems", 201: "express-as-percentage", 202: "percentage-word-problems",
    203: "percentage-word-problems", 204: "percentage-word-problems",
    205: "express-as-percentage", 206: "express-as-percentage", 207: "express-as-percentage",
    208: "express-as-percentage", 209: "express-as-percentage",
    210: "express-as-percentage", 211: "express-as-percentage", 212: "express-as-percentage",
  },
  ratio: {
    181: "master-sharing-ratio", 182: "master-sharing-ratio", 183: "master-sharing-ratio",
    184: "master-sharing-ratio",
    185: "master-sharing-ratio", 186: "master-sharing-ratio", 187: "master-sharing-ratio",
    188: "finding-missing-values", 189: "finding-missing-values", 190: "finding-missing-values",
    191: "finding-missing-values",
    192: "scaling-recipes", 193: "scaling-recipes", 194: "scaling-recipes",
    195: "scale-factors-maps", 196: "scale-factors-maps", 197: "scale-factors-maps",
    198: "master-sharing-ratio", 199: "master-sharing-ratio", 200: "master-sharing-ratio",
    201: "master-sharing-ratio",
    202: "finding-missing-values", 203: "finding-missing-values", 204: "finding-missing-values",
    205: "finding-missing-values",
  },
  algebra: {
    205: "two-step-equations", 206: "two-step-equations", 207: "two-step-equations",
    208: "two-step-equations", 209: "two-step-equations", 210: "two-step-equations",
    211: "two-step-equations", 212: "two-step-equations",
    213: "writing-expressions", 214: "writing-expressions", 215: "writing-expressions",
    216: "writing-expressions", 217: "writing-expressions", 218: "writing-expressions",
    219: "writing-expressions", 220: "writing-expressions",
    221: "master-two-step-equations", 222: "master-two-step-equations", 223: "master-two-step-equations",
    224: "master-two-step-equations", 225: "master-two-step-equations", 226: "master-two-step-equations",
    227: "substitution", 228: "substitution", 229: "substitution", 230: "substitution", 231: "substitution",
    232: "substitution", 233: "substitution", 234: "substitution", 235: "substitution", 236: "substitution",
    237: "master-two-step-equations", 238: "master-two-step-equations", 239: "master-two-step-equations",
    240: "master-two-step-equations", 241: "master-two-step-equations", 242: "master-two-step-equations",
    243: "simple-formulae", 244: "simple-formulae", 245: "simple-formulae",
    246: "simple-formulae", 247: "simple-formulae",
    248: "writing-expressions", 249: "writing-expressions", 250: "writing-expressions",
    251: "writing-expressions", 252: "writing-expressions",
  }
};

// =====================================================================
// 1. INSERT QUESTIONS INTO mathsData.js
// =====================================================================

const mathsPath = path.join(__dirname, '..', 'src', 'questionData', 'mathsData.js');
let content = fs.readFileSync(mathsPath, 'utf8');

for (const [topic, questions] of Object.entries(NEW_QUESTIONS)) {
  // Find the last question in this topic by searching for the closing pattern
  // We look for the last question's closing brace followed by the array close
  const topicRegex = new RegExp(`(${topic}\\s*:\\s*\\{[\\s\\S]*?questions:\\s*\\[)([\\s\\S]*?)(\\]\\s*\\})`);
  const match = content.match(topicRegex);

  if (!match) {
    console.error(`Could not find topic: ${topic}`);
    continue;
  }

  // Build question strings
  const questionStrings = questions.map(q => {
    const optionsStr = q.options.map(o => `"${o.replace(/"/g, '\\"')}"`).join(', ');
    return `          {
            id: ${q.id},
            difficulty: ${q.difficulty},
            question: ${JSON.stringify(q.question)},
            options: [${optionsStr}],
            correct: ${q.correct},
            explanation: ${JSON.stringify(q.explanation)}
          }`;
  }).join(',\n');

  // Find the position of the LAST closing bracket of the questions array for this topic
  // Strategy: find the topic start, then find the matching ] for questions
  const topicStart = content.indexOf(`${topic}: {`);
  if (topicStart === -1) {
    // Try without space
    const alt = content.indexOf(`${topic}:{`);
    if (alt === -1) {
      console.error(`Cannot find topic start: ${topic}`);
      continue;
    }
  }

  // Find "questions: [" after topic start
  const questionsStart = content.indexOf('questions: [', topicStart);
  if (questionsStart === -1) {
    console.error(`Cannot find questions array for: ${topic}`);
    continue;
  }

  // Find the matching ] by counting brackets
  let bracketCount = 0;
  let questionsEnd = -1;
  for (let i = questionsStart; i < content.length; i++) {
    if (content[i] === '[') bracketCount++;
    if (content[i] === ']') {
      bracketCount--;
      if (bracketCount === 0) {
        questionsEnd = i;
        break;
      }
    }
  }

  if (questionsEnd === -1) {
    console.error(`Cannot find end of questions array for: ${topic}`);
    continue;
  }

  // Insert before the closing ]
  content = content.substring(0, questionsEnd) + ',\n' + questionStrings + '\n        ' + content.substring(questionsEnd);

  console.log(`Inserted ${questions.length} questions into ${topic} (IDs ${questions[0].id}-${questions[questions.length-1].id})`);
}

fs.writeFileSync(mathsPath, content);
console.log(`\nWrote: ${mathsPath}`);

// =====================================================================
// 2. UPDATE LESSON MAPPING
// =====================================================================

const mapPath = path.join(__dirname, '..', 'public', 'maths-question-lesson-map.json');
const lessonMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

for (const [topic, mappings] of Object.entries(LESSON_MAPPINGS)) {
  if (!lessonMap[topic]) lessonMap[topic] = [];

  for (const [idStr, subConceptId] of Object.entries(mappings)) {
    const questionId = parseInt(idStr);
    // Check it doesn't already exist
    if (!lessonMap[topic].find(e => e.questionId === questionId)) {
      lessonMap[topic].push({ questionId, subConceptId, confidence: "high" });
    }
  }

  // Sort by questionId
  lessonMap[topic].sort((a, b) => a.questionId - b.questionId);
}

fs.writeFileSync(mapPath, JSON.stringify(lessonMap, null, 2));
console.log(`Updated: ${mapPath}`);

// =====================================================================
// 3. VERIFY
// =====================================================================

// Clear module cache and reload
delete require.cache[require.resolve('../src/questionData/mathsData')];
const mathsData = require('../src/questionData/mathsData').default;

console.log('\n=== POST-INSERTION DISTRIBUTIONS ===');
let totalD1 = 0, totalD2 = 0, totalD3 = 0, totalQs = 0;

for (const [key, topic] of Object.entries(mathsData.topics)) {
  const qs = topic.questions || [];
  const total = qs.length;
  const d1 = qs.filter(q => q.difficulty === 1).length;
  const d2 = qs.filter(q => !q.difficulty || q.difficulty === 2).length;
  const d3 = qs.filter(q => q.difficulty === 3).length;
  totalD1 += d1; totalD2 += d2; totalD3 += d3; totalQs += total;

  const highlight = ['percentages', 'ratio', 'algebra'].includes(key) ? ' <<<' : '';
  console.log(
    key.padEnd(22) + '| ' + String(total).padStart(3) + ' | ' +
    String(Math.round(d1/total*100)).padStart(2) + '/' +
    String(Math.round(d2/total*100)).padStart(2) + '/' +
    String(Math.round(d3/total*100)).padStart(2) + '%' + highlight
  );
}

console.log('---------------------|-----|----------');
console.log(
  'TOTAL'.padEnd(22) + '| ' + String(totalQs).padStart(3) + ' | ' +
  String(Math.round(totalD1/totalQs*100)).padStart(2) + '/' +
  String(Math.round(totalD2/totalQs*100)).padStart(2) + '/' +
  String(Math.round(totalD3/totalQs*100)).padStart(2) + '%'
);

// Verify lesson mappings
const updatedMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
for (const topic of ['percentages', 'ratio', 'algebra']) {
  const topicQs = mathsData.topics[topic].questions;
  const mappedIds = new Set(updatedMap[topic].map(e => e.questionId));
  const unmapped = topicQs.filter(q => !mappedIds.has(q.id));
  if (unmapped.length > 0) {
    console.log(`WARNING: ${topic} has ${unmapped.length} unmapped questions: ${unmapped.map(q => q.id).join(', ')}`);
  } else {
    console.log(`${topic}: all ${topicQs.length} questions mapped to lessons`);
  }
}

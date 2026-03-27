const fs = require('fs');
const path = require('path');

// Read the source file
const filePath = path.join(__dirname, 'src', 'App.js');
let content = fs.readFileSync(filePath, 'utf8');

// Array of [oldQuestion, newQuestion] pairs
// ONLY changing the question text — nothing else
const replacements = [
  // --- "How many factors does X have?" ---
  [
    `"How many factors does 48 have?"`,
    `"Mrs Jones asks her class to find all the ways 48 chairs can be arranged in equal rows. How many different factors does 48 have?"`
  ],
  [
    `"How many factors does 60 have?"`,
    `"A school hall has 60 seats to arrange in equal rows for the assembly. How many factors does 60 have?"`
  ],
  [
    `"How many factors does 64 have?"`,
    `"Tom has 64 football stickers to stick evenly across pages of his album. How many factors does 64 have?"`
  ],
  [
    `"How many factors does 72 have?"`,
    `"A baker made 72 cupcakes and wants to know every way to pack them equally into boxes. How many factors does 72 have?"`
  ],
  [
    `"How many factors does 81 have?"`,
    `"Grandma knitted 81 squares for a patchwork blanket. She wants to sew them into equal rows. How many factors does 81 have?"`
  ],
  [
    `"How many factors does 96 have?"`,
    `"The school kitchen has 96 cartons of milk to place equally on trays. How many factors does 96 have?"`
  ],
  [
    `"How many factors does 100 have?"`,
    `"A farmer is planting 100 bulbs in equal rows across a flower bed. How many factors does 100 have?"`
  ],

  // --- "What is the LCM of X and Y?" ---
  [
    `"What is the LCM of 8 and 14?"`,
    `"Bus A leaves the station every 8 minutes and Bus B leaves every 14 minutes. They both leave at 9:00 am. What is the LCM of 8 and 14 to find when they next leave together?"`
  ],
  [
    `"What is the LCM of 9 and 12?"`,
    `"Two lighthouses flash their lights. One flashes every 9 seconds and the other every 12 seconds. What is the LCM of 9 and 12 to find when they next flash together?"`
  ],
  [
    `"What is the LCM of 6 and 9?"`,
    `"Class 5 has PE every 6 school days and art every 9 school days. Both happen today. What is the LCM of 6 and 9 to find when they next fall on the same day?"`
  ],
  [
    `"What is the LCM of 4 and 10?"`,
    `"At sports day, the drum beats every 4 seconds and the whistle blows every 10 seconds. They start together. What is the LCM of 4 and 10 to find when they next happen at the same time?"`
  ],
  [
    `"What is the LCM of 20 and 30?"`,
    `"Two runners circle a track. One completes a lap every 20 seconds, the other every 30 seconds. What is the LCM of 20 and 30 to find when they next cross the start line together?"`
  ],
  [
    `"What is the LCM of 5 and 8?"`,
    `"A clock chimes every 5 minutes and a cuckoo clock calls every 8 minutes. They both sound at noon. What is the LCM of 5 and 8?"`,
  ],
  [
    `"What is the LCM of 4 and 6?"`,
    `"Lily waters her tomatoes every 4 days and her sunflowers every 6 days. She waters both today. What is the LCM of 4 and 6 to find when she next waters both on the same day?"`
  ],
  [
    `"What is the LCM of 18 and 24?"`,
    `"Train A departs every 18 minutes and Train B every 24 minutes from the same platform. What is the LCM of 18 and 24 to find when they next depart together?"`
  ],
  [
    `"What is the LCM of 7 and 10?"`,
    `"A school bell rings every 7 minutes for one class and every 10 minutes for another. What is the LCM of 7 and 10 to find when they next ring at the same time?"`
  ],

  // --- "What is the HCF of X and Y?" ---
  [
    `"What is the HCF of 54 and 72?"`,
    `"A florist has 54 roses and 72 tulips. She wants to make identical bouquets using all the flowers. What is the HCF of 54 and 72?"`
  ],
  [
    `"What is the HCF of 35 and 49?"`,
    `"A craft teacher has 35 red beads and 49 blue beads to divide equally into bags with the same mix. What is the HCF of 35 and 49?"`
  ],
  [
    `"What is the HCF of 32 and 48?"`,
    `"A librarian has 32 fiction books and 48 non-fiction books to display in equal stacks with the same number of each type. What is the HCF of 32 and 48?"`
  ],
  [
    `"What is the HCF of 18 and 27?"`,
    `"A gardener has 18 daffodils and 27 crocuses to plant in identical groups using every bulb. What is the HCF of 18 and 27?"`
  ],
  [
    `"What is the HCF of 50 and 80?"`,
    `"A sweet shop owner has 50 toffees and 80 chocolates to pack into identical party bags. What is the HCF of 50 and 80?"`
  ],
  [
    `"What is the HCF of 44 and 66?"`,
    `"Year 5 collected 44 cans and 66 bottles for recycling. They want to sort them into equal groups. What is the HCF of 44 and 66?"`
  ],

  // --- "What is the prime factorization of X?" ---
  [
    `"What is the prime factorization of 90?"`,
    `"In a maths challenge, pupils must break 90 down into its prime factors. What is the prime factorisation of 90?"`
  ],
  [
    `"What is the prime factorization of 100?"`,
    `"For her homework, Amira must write 100 as a product of prime numbers. What is the prime factorisation of 100?"`
  ],
  [
    `"What is the prime factorization of 120?"`,
    `"A quiz card asks you to express 120 using only prime factors. What is the prime factorisation of 120?"`
  ],
  [
    `"What is the prime factorization of 45?"`,
    `"Mr Patel asks his class to draw a factor tree for 45. What is the prime factorisation of 45?"`
  ],
  [
    `"What is the prime factorization of 126?"`,
    `"During a maths relay, your team must find the prime factorisation of 126. What is the prime factorisation of 126?"`
  ],

  // --- "Which is the smallest/largest prime number greater/less than X?" ---
  [
    `"Which is the smallest prime number greater than 60?"`,
    `"In a number hunt, Zara must find the first prime number after 60 on the number line. Which is the smallest prime number greater than 60?"`
  ],
  [
    `"Which is the largest prime number less than 70?"`,
    `"A quiz master asks: what is the biggest prime number you can find that is still less than 70? Which is the largest prime number less than 70?"`
  ],
  [
    `"Which is the largest prime number less than 30?"`,
    `"On a classroom number wall, pupils must circle the biggest prime below 30. What is the largest prime number less than 30?"`
  ],

  // --- Factor pairs ---
  [
    `"How many different factor pairs does 28 have?"`,
    `"A PE teacher wants to split 28 pupils into two equal teams in every possible way. How many different factor pairs does 28 have?"`
  ],
  [
    `"How many different factor pairs does 40 have?"`,
    `"A chocolatier is designing boxes so that 40 chocolates sit in a perfect rectangle. How many different factor pairs does 40 have?"`
  ],
  [
    `"How many different factor pairs does 32 have?"`,
    `"Harry is tiling a wall with 32 square tiles arranged in a rectangle. How many different factor pairs does 32 have?"`
  ],

  // --- Sum of primes / prime factors ---
  [
    `"What is the sum of all prime numbers between 10 and 20?"`,
    `"For a maths quiz bonus round, you must add up every prime number between 10 and 20. What is the sum of all prime numbers between 10 and 20?"`
  ],
  [
    `"What is the sum of the prime factors of 66?"`,
    `"On a puzzle card, Charlotte must find the prime factors of 66 and then add them together. What is the sum of the prime factors of 66?"`
  ],

  // --- Miscellaneous raw questions ---
  [
    `"How many prime numbers are there between 20 and 30?"`,
    `"A homework sheet asks pupils to list every prime number between 20 and 30. How many prime numbers are there between 20 and 30?"`
  ],
  [
    `"How many factors does the number 17 have?"`,
    `"In class, the teacher writes 17 on the board and asks how many numbers divide into it exactly. How many factors does the number 17 have?"`
  ],
];

let count = 0;
for (const [oldQ, newQ] of replacements) {
  if (content.includes(oldQ)) {
    content = content.replace(oldQ, newQ);
    count++;
  } else {
    console.log(`WARNING: Could not find question: ${oldQ}`);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Done! ${count} replacements made out of ${replacements.length} pairs.`);

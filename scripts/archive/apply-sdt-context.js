const fs = require('fs');
let content = fs.readFileSync('src/App.js', 'utf8');

const replacements = [
  ['question: "What is the average speed if someone drives 180 km in 4 hours?"',
   'question: "A family drives 180 km to visit their grandparents. The journey takes 4 hours. What is their average speed?"'],
  ['question: "How long does it take to travel 300 km at 75 km/h?"',
   'question: "A school minibus drives 300 km to a football tournament at 75 km/h. How long does the journey take?"'],
  ['question: "Convert 90 km/h to meters per second."',
   'question: "A cheetah runs at 90 km/h. What is this speed in metres per second?"'],
  ['question: "How many minutes does it take to travel 25 km at 100 km/h?"',
   'question: "An ambulance races 25 km to the hospital at 100 km/h. How many minutes does the journey take?"'],
  ['question: "Someone walks 2000 meters in 10 minutes. What is the speed in km/h?"',
   'question: "A postman walks 2000 metres delivering letters in 10 minutes. What is his speed in km/h?"'],
  ['question: "What is the speed if 210 km is covered in 3 hours?"',
   'question: "A delivery van covers 210 km in 3 hours. What is its speed?"'],
  ['question: "How long does it take to travel 360 km at 90 km/h?"',
   'question: "A train travels 360 km from London to the Lake District at 90 km/h. How long does the journey take?"'],
  ['question: "An object moves at 12 m/s for 35 seconds. How far does it travel?"',
   'question: "A remote-controlled car moves at 12 m/s for 35 seconds. How far does it travel?"'],
  ['question: "Convert 108 km/h to meters per second."',
   'question: "A racing car zooms around a track at 108 km/h. What is this speed in metres per second?"'],
  ['question: "An object moves at 11 m/s for 30 seconds. Distance?"',
   'question: "A dolphin swims at 11 m/s for 30 seconds. How far does it travel?"'],
];

let count = 0;
for (const [old, newQ] of replacements) {
  if (content.includes(old)) {
    content = content.replace(old, newQ);
    count++;
    console.log(`  Replaced: ${old.substring(0, 50)}...`);
  } else {
    console.log(`  NOT FOUND: ${old.substring(0, 50)}...`);
  }
}

fs.writeFileSync('src/App.js', content, 'utf8');
console.log(`\nApplied ${count} SDT replacements.`);

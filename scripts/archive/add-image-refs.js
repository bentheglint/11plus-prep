const fs = require('fs');
const content = fs.readFileSync('src/App.js', 'utf8');
const lines = content.split('\n');

// Topic line ranges (approximate - we'll search within these)
const topicRanges = {
  'Fractions': [4901, 6105],
  'Ratio & Proportion': [3572, 4900],
  'Negative Numbers': [9508, 10593],
  'Sequences': [14878, 15946]
};

// Image references to add, grouped by topic
const imageRefs = {
  'Negative Numbers': [
    { id: 1, image: '/images/questions/negative-numbers/thermometer-q1.svg' },
    { id: 2, image: '/images/questions/negative-numbers/numberline-q2.svg' },
    { id: 4, image: '/images/questions/negative-numbers/thermometer-q4.svg' },
    { id: 5, image: '/images/questions/negative-numbers/numberline-q5.svg' },
    { id: 6, image: '/images/questions/negative-numbers/submarine-q6.svg' },
    { id: 8, image: '/images/questions/negative-numbers/thermometer-q8.svg' },
    { id: 9, image: '/images/questions/negative-numbers/building-q9.svg' },
    { id: 12, image: '/images/questions/negative-numbers/building-q12.svg' },
    { id: 14, image: '/images/questions/negative-numbers/numberline-q14.svg' },
  ],
  'Fractions': [
    { id: 1, image: '/images/questions/fractions/bottle-q1.svg' },
    { id: 2, image: '/images/questions/fractions/bar-model-q2.svg' },
    { id: 4, image: '/images/questions/fractions/bar-model-q4.svg' },
    { id: 10, image: '/images/questions/fractions/pizza-q10.svg' },
    { id: 11, image: '/images/questions/fractions/jugs-q11.svg' },
    { id: 25, image: '/images/questions/fractions/chocolate-q25.svg' },
    { id: 30, image: '/images/questions/fractions/jug-q30.svg' },
    { id: 44, image: '/images/questions/fractions/bar-model-q44.svg' },
    { id: 46, image: '/images/questions/fractions/cake-q46.svg' },
  ],
  'Sequences': [
    { id: 4, image: '/images/questions/sequences/square-numbers-q4.svg' },
    { id: 19, image: '/images/questions/sequences/rectangular-numbers-q19.svg' },
    { id: 24, image: '/images/questions/sequences/square-numbers-q24.svg' },
    { id: 45, image: '/images/questions/sequences/growing-stacks-q45.svg' },
    { id: 57, image: '/images/questions/sequences/cube-numbers-q57.svg' },
    { id: 122, image: '/images/questions/sequences/triangular-numbers-q122.svg' },
    { id: 125, image: '/images/questions/sequences/square-plus-one-q125.svg' },
  ],
  'Ratio & Proportion': [
    { id: 1, image: '/images/questions/ratio/bar-model-q1.svg' },
    { id: 2, image: '/images/questions/ratio/bar-model-q2.svg' },
    { id: 5, image: '/images/questions/ratio/paint-mixing-q5.svg' },
    { id: 7, image: '/images/questions/ratio/bar-model-q7.svg' },
    { id: 12, image: '/images/questions/ratio/map-scale-q12.svg' },
    { id: 26, image: '/images/questions/ratio/building-scale-q26.svg' },
    { id: 30, image: '/images/questions/ratio/bar-model-q30.svg' },
    { id: 146, image: '/images/questions/ratio/bar-model-q146.svg' },
  ],
};

let totalAdded = 0;

for (const [topic, refs] of Object.entries(imageRefs)) {
  const [rangeStart, rangeEnd] = topicRanges[topic];
  console.log(`\n=== ${topic} (lines ${rangeStart}-${rangeEnd}) ===`);

  for (const ref of refs) {
    // Find the line with `id: X,` within the topic range
    let found = false;
    for (let i = rangeStart; i <= Math.min(rangeEnd, lines.length - 1); i++) {
      const line = lines[i];
      // Match id: X, (with possible whitespace)
      const idMatch = line.match(/^\s*id:\s*(\d+)\s*,/);
      if (idMatch && parseInt(idMatch[1]) === ref.id) {
        // Check if this question already has an image field nearby
        let hasImage = false;
        for (let j = i; j < Math.min(i + 8, lines.length); j++) {
          if (lines[j].match(/^\s*image:/)) {
            hasImage = true;
            break;
          }
          if (lines[j].match(/^\s*question:/)) break;
        }

        if (hasImage) {
          console.log(`  ID ${ref.id}: Already has image reference, skipping`);
          found = true;
          break;
        }

        // Find the question line (should be 1-3 lines after id)
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          if (lines[j].match(/^\s*question:/)) {
            // Get the indentation from the question line
            const indent = lines[j].match(/^(\s*)/)[1];
            // Insert image line before the question line
            const imageLine = `${indent}image: "${ref.image}",`;
            lines.splice(j, 0, imageLine);
            console.log(`  ID ${ref.id}: Added image ref at line ${j + 1}`);
            totalAdded++;
            found = true;
            // Adjust rangeEnd since we inserted a line
            topicRanges[topic][1]++;
            // Adjust other topic ranges that come after
            for (const [otherTopic, otherRange] of Object.entries(topicRanges)) {
              if (otherRange[0] > i) {
                otherRange[0]++;
                otherRange[1]++;
              }
            }
            break;
          }
        }
        if (found) break;
      }
    }
    if (!found) {
      console.log(`  ID ${ref.id}: NOT FOUND in range!`);
    }
  }
}

fs.writeFileSync('src/App.js', lines.join('\n'), 'utf8');
console.log(`\nDone! Added ${totalAdded} image references.`);

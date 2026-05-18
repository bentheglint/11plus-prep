const fs = require('fs');
const path = require('path');

const vrDataPath = path.join(__dirname, '../src/questionData/vrData.js');
let src = fs.readFileSync(vrDataPath, 'utf8');

// The Oracle put this preamble in every V9 question (stored as \n in the JS string literal)
const needle = 'Complete the third pair using the same hidden-word rule:\\nfrog (rode) dent\\nslim (lime) medal\\n';
const replacement = 'Find the hidden word. Take letters 2–3 of the first word and letters 1–2 of the third word.\\n\\n';

const count = src.split(needle).length - 1;
console.log('Occurrences to replace:', count);

src = src.split(needle).join(replacement);

fs.writeFileSync(vrDataPath, src);
console.log('Done. Verifying...');

// Verify
const { default: vr } = require('../src/questionData/vrData.js');
const wca = vr.topics.wordCodeAnalogies.questions;
const q126 = wca.find(q => q.id === 126);
const q150 = wca.find(q => q.id === 150);
console.log('Q126:', q126.question);
console.log('Q150:', q150.question);
// Check none still contain the old preamble
const stillHave = wca.filter(q => q.id >= 126 && q.question.includes('frog (rode) dent'));
console.log('Still have old preamble:', stillHave.length);

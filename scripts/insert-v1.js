const fs = require('fs');

const questions = [
  // D1 — multiply
  { id:100, difficulty:1, question:'Find the missing number:\n\n3 (18) 6     4 (20) 5     2 ( ? ) 6', options:['8','12','10','14','11'], correct:1, explanation:'Look at the first two triplets. 3 times 6 is 18, and 4 times 5 is 20 — so the middle number is always the two outer numbers multiplied together. For the third triplet, 2 times 6 is 12. ✓' },
  { id:101, difficulty:1, question:'Find the missing number:\n\n2 (14) 7     3 (15) 5     4 ( ? ) 6', options:['22','26','24','10','25'], correct:2, explanation:'2 times 7 is 14 and 3 times 5 is 15, so the rule is multiply the outers. 4 times 6 is 24. ✓' },
  { id:102, difficulty:1, question:'Find the missing number:\n\n5 (10) 2     3 (24) 8     4 ( ? ) 7', options:['28','27','29','26','11'], correct:0, explanation:'5 times 2 is 10 and 3 times 8 is 24, so the middle number is always the outers multiplied. 4 times 7 is 28. ✓' },
  { id:103, difficulty:1, question:'Find the missing number:\n\n6 (18) 3     4 (16) 4     5 ( ? ) 6', options:['11','25','35','28','30'], correct:4, explanation:'6 times 3 is 18 and 4 times 4 is 16, so the rule is to multiply the outer numbers. 5 times 6 is 30. ✓' },
  { id:104, difficulty:1, question:'Find the missing number:\n\n2 (16) 8     3 (27) 9     7 ( ? ) 2', options:['9','16','12','14','15'], correct:3, explanation:'2 times 8 is 16 and 3 times 9 is 27, so multiply the outers. 7 times 2 is 14. ✓' },
  // D1 — add
  { id:105, difficulty:1, question:'Find the missing number:\n\n5 (12) 7     4 (10) 6     3 ( ? ) 8', options:['24','10','12','13','11'], correct:4, explanation:'5 plus 7 is 12 and 4 plus 6 is 10, so the rule is to add the outers. 3 plus 8 is 11. ✓' },
  { id:106, difficulty:1, question:'Find the missing number:\n\n8 (15) 7     6 (14) 8     9 ( ? ) 4', options:['36','13','12','14','15'], correct:1, explanation:'8 plus 7 is 15 and 6 plus 8 is 14, so add the outers. 9 plus 4 is 13. ✓' },
  { id:107, difficulty:1, question:'Find the missing number:\n\n6 (13) 7     5 ( ? ) 9     4 (12) 8', options:['45','13','14','15','12'], correct:2, explanation:'The first and third triplets show the rule: 6 plus 7 is 13, and 4 plus 8 is 12. So the middle number is always the outers added. 5 plus 9 is 14. ✓' },
  { id:108, difficulty:1, question:'Find the missing number:\n\n7 (16) 9     5 (11) 6     8 ( ? ) 6', options:['14','13','15','48','12'], correct:0, explanation:'7 plus 9 is 16 and 5 plus 6 is 11, so add the outers. 8 plus 6 is 14. ✓' },
  { id:109, difficulty:1, question:'Find the missing number:\n\n9 (17) 8     6 ( ? ) 7     5 (12) 7', options:['42','14','12','13','15'], correct:3, explanation:'9 plus 8 is 17, and 5 plus 7 is 12, so the rule is to add the outers. 6 plus 7 is 13. ✓' },
  // D2 — subtract
  { id:110, difficulty:2, question:'Find the missing number:\n\n9 (5) 4     8 (3) 5     10 ( ? ) 4', options:['14','4','7','40','6'], correct:4, explanation:'9 take away 4 is 5, and 8 take away 5 is 3 — so the middle number is the difference between the outers. 10 take away 4 is 6. ✓' },
  { id:111, difficulty:2, question:'Find the missing number:\n\n12 (4) 8     15 (6) 9     14 ( ? ) 5', options:['19','8','10','9','7'], correct:3, explanation:'12 take away 8 is 4 and 15 take away 9 is 6, so the rule is to subtract. 14 take away 5 is 9. ✓' },
  { id:112, difficulty:2, question:'Find the missing number:\n\n11 (3) 8     13 (7) 6     20 ( ? ) 12', options:['7','8','9','32','6'], correct:1, explanation:'11 minus 8 is 3 and 13 minus 6 is 7, so subtract the smaller outer from the larger. 20 minus 12 is 8. ✓' },
  { id:113, difficulty:2, question:'Find the missing number:\n\n16 (9) 7     14 (8) 6     17 ( ? ) 5', options:['12','13','11','22','10'], correct:0, explanation:'16 take away 7 is 9 and 14 take away 6 is 8, so the rule is to subtract. 17 take away 5 is 12. ✓' },
  // D2 — half-sum
  { id:114, difficulty:2, question:'Find the missing number:\n\n6 (5) 4     10 (8) 6     12 ( ? ) 8', options:['20','11','9','10','4'], correct:3, explanation:'6 plus 4 is 10, halved is 5. 10 plus 6 is 16, halved is 8. So add the outers and halve. For 12 and 8: 12 plus 8 is 20, halved is 10. ✓' },
  { id:115, difficulty:2, question:'Find the missing number:\n\n8 (7) 6     14 (11) 8     16 ( ? ) 4', options:['20','12','11','9','10'], correct:4, explanation:'8 plus 6 is 14, halved is 7. 14 plus 8 is 22, halved is 11. So add the outers then halve. 16 plus 4 is 20, halved is 10. ✓' },
  { id:116, difficulty:2, question:'Find the missing number:\n\n20 (15) 10     18 (13) 8     22 ( ? ) 12', options:['34','18','17','16','19'], correct:2, explanation:'20 plus 10 is 30, halved is 15. 18 plus 8 is 26, halved is 13. So add the outers and halve. 22 plus 12 is 34, halved is 17. ✓' },
  // D2 — divide
  { id:117, difficulty:2, question:'Find the missing number:\n\n12 (4) 3     20 (5) 4     18 ( ? ) 6', options:['4','3','6','12','9'], correct:1, explanation:'12 divided by 3 is 4 and 20 divided by 4 is 5, so the rule is to divide the larger outer by the smaller. 18 divided by 6 is 3. ✓' },
  { id:118, difficulty:2, question:'Find the missing number:\n\n24 (6) 4     30 (5) 6     28 ( ? ) 7', options:['4','5','3','35','21'], correct:0, explanation:'24 divided by 4 is 6 and 30 divided by 6 is 5, so divide the larger outer by the smaller. 28 divided by 7 is 4. ✓' },
  { id:119, difficulty:2, question:'Find the missing number:\n\n40 (8) 5     36 (4) 9     42 ( ? ) 7', options:['5','7','8','49','6'], correct:4, explanation:'40 divided by 5 is 8 and 36 divided by 9 is 4, so divide the larger outer by the smaller. 42 divided by 7 is 6. ✓' },
  // D3 — product + constant
  { id:120, difficulty:3, question:'Find the missing number:\n\n3 (13) 4     2 (11) 5     4 ( ? ) 6', options:['24','26','23','25','27'], correct:3, explanation:'3 times 4 is 12, plus 1 is 13. 2 times 5 is 10, plus 1 is 11. So multiply the outers then add 1. 4 times 6 is 24, plus 1 is 25. ✓' },
  { id:121, difficulty:3, question:'Find the missing number:\n\n3 (17) 5     4 (26) 6     2 ( ? ) 7', options:['14','15','16','17','18'], correct:2, explanation:'3 times 5 is 15, plus 2 is 17. 4 times 6 is 24, plus 2 is 26. So multiply the outers then add 2. 2 times 7 is 14, plus 2 is 16. ✓' },
  { id:122, difficulty:3, question:'Find the missing number:\n\n5 (13) 2     4 (15) 3     6 ( ? ) 3', options:['18','19','22','20','21'], correct:4, explanation:'5 times 2 is 10, plus 3 is 13. 4 times 3 is 12, plus 3 is 15. So multiply the outers then add 3. 6 times 3 is 18, plus 3 is 21. ✓' },
  { id:123, difficulty:3, question:'Find the missing number:\n\n4 (22) 5     3 (20) 6     7 ( ? ) 3', options:['21','23','24','25','22'], correct:1, explanation:'4 times 5 is 20, plus 2 is 22. 3 times 6 is 18, plus 2 is 20. So multiply the outers then add 2. 7 times 3 is 21, plus 2 is 23. ✓' },
  // D3 — doubled product
  { id:124, difficulty:3, question:'Find the missing number:\n\n3 (12) 2     4 (24) 3     5 ( ? ) 4', options:['20','45','40','42','38'], correct:2, explanation:'3 times 2 is 6, doubled is 12. 4 times 3 is 12, doubled is 24. So multiply the outers, then double. 5 times 4 is 20, doubled is 40. ✓' },
  { id:125, difficulty:3, question:'Find the missing number:\n\n2 (20) 5     3 (18) 3     6 ( ? ) 4', options:['48','24','46','50','44'], correct:0, explanation:'2 times 5 is 10, doubled is 20. 3 times 3 is 9, doubled is 18. So multiply the outers, then double. 6 times 4 is 24, doubled is 48. ✓' },
  { id:126, difficulty:3, question:'Find the missing number:\n\n4 (16) 2     5 (30) 3     7 ( ? ) 2', options:['26','30','27','28','14'], correct:3, explanation:'4 times 2 is 8, doubled is 16. 5 times 3 is 15, doubled is 30. So multiply the outers, then double. 7 times 2 is 14, doubled is 28. ✓' },
  // D3 — difference squared
  { id:127, difficulty:3, question:'Find the missing number:\n\n7 (9) 4     8 (4) 6     10 ( ? ) 6', options:['4','16','14','8','18'], correct:1, explanation:'7 take away 4 is 3, and 3 squared is 9. 8 take away 6 is 2, and 2 squared is 4. So find the difference between the outers, then square it. 10 take away 6 is 4, and 4 squared is 16. ✓' },
  { id:128, difficulty:3, question:'Find the missing number:\n\n9 (16) 5     8 (25) 3     11 ( ? ) 5', options:['30','24','36','49','25'], correct:2, explanation:'9 take away 5 is 4, and 4 squared is 16. 8 take away 3 is 5, and 5 squared is 25. So subtract the outers, then square the answer. 11 take away 5 is 6, and 6 squared is 36. ✓' },
  { id:129, difficulty:3, question:'Find the missing number:\n\n10 (9) 7     12 (25) 7     13 ( ? ) 6', options:['49','56','42','48','64'], correct:0, explanation:'10 take away 7 is 3, and 3 squared is 9. 12 take away 7 is 5, and 5 squared is 25. So subtract the outers, then square. 13 take away 6 is 7, and 7 squared is 49. ✓' },
];

// Format as JS question blocks
const jsBlocks = questions.map(q => {
  const opts = q.options.map(o => JSON.stringify(o)).join(', ');
  return `        {\n          id: ${q.id},\n          difficulty: ${q.difficulty},\n          question: ${JSON.stringify(q.question)},\n          options: [${opts}],\n          correct: ${q.correct},\n          explanation: ${JSON.stringify(q.explanation)}\n        }`;
}).join(',\n');

// Insert into vrData.js after the last numberSeries question
const vrPath = 'C:/Users/Ben Jackson/Projects/11plus-prep/src/questionData/vrData.js';
let vr = fs.readFileSync(vrPath, 'utf8');

// Insert before the letterSums block (which immediately follows numberSeries)
const marker = '    letterSums: {';
const markerPos = vr.indexOf(marker);
if (markerPos === -1) { console.error('MARKER NOT FOUND IN vrData.js'); process.exit(1); }
// Find the end of the closing } and ] of numberSeries just before letterSums
// Walk backwards from marker to find the last } before it
const beforeMarker = vr.slice(0, markerPos);
// The structure is: ...last question }  \n      ]\n    },\n    letterSums
// We insert between the last } and the \n      ] that closes the questions array
const closingBracketPos = beforeMarker.lastIndexOf('        }');
if (closingBracketPos === -1) { console.error('CLOSING BRACKET NOT FOUND'); process.exit(1); }
const insertAt = closingBracketPos + '        }'.length;
vr = vr.slice(0, insertAt) + ',\n' + jsBlocks + vr.slice(insertAt);
fs.writeFileSync(vrPath, vr);
console.log('vrData.js: ' + questions.length + ' questions appended to numberSeries (IDs 100-129)');

// Update vr-question-lesson-map.json
const mapPath = 'C:/Users/Ben Jackson/Projects/11plus-prep/public/vr-question-lesson-map.json';
const lessonMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const newEntries = questions.map(q => ({ questionId: q.id, subConceptId: 'middle-number-analogies-steps', confidence: 'high' }));
lessonMap.numberSeries.push(...newEntries);
fs.writeFileSync(mapPath, JSON.stringify(lessonMap, null, 2));
console.log('vr-question-lesson-map.json: ' + newEntries.length + ' entries added for numberSeries');

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync('src/microLessons/staging/anglesshapes-subconcepts.js', 'utf8');

// Find first lesson
const lessonRegex = /\{\s*\n\s*id:\s*["']([^"']+)["'],\s*\n\s*templateType:/g;
const lMatch = lessonRegex.exec(src);
console.log('First lesson:', lMatch[1], 'at pos:', lMatch.index);

// Get the lesson block (until next lesson or end)
const nextLMatch = lessonRegex.exec(src);
const lessonBlock = src.substring(lMatch.index, nextLMatch ? nextLMatch.index : lMatch.index + 5000);
console.log('Lesson block length:', lessonBlock.length);

// Find variableSets in this lesson
const vsMatch = lessonBlock.match(/variableSets:\s*\[\s*\{([\s\S]*?)\}\s*,/);
console.log('variableSet found:', !!vsMatch);
if (vsMatch) {
  const vsStr = vsMatch[1].substring(0, 300);
  console.log('First 300 chars of variableSet:', vsStr);

  // Extract vars
  const vars = {};
  const kvRegex = /(\w+):\s*(?:"([^"]*?)"|'([^']*?)'|(-?\d+\.?\d*)\b|(true|false)\b|\[([^\]]*?)\])/g;
  let kv;
  while ((kv = kvRegex.exec(vsMatch[1])) !== null) {
    const key = kv[1];
    if (kv[2] !== undefined) vars[key] = kv[2];
    else if (kv[3] !== undefined) vars[key] = kv[3];
    else if (kv[4] !== undefined) vars[key] = parseFloat(kv[4]);
    else if (kv[5] !== undefined) vars[key] = kv[5] === 'true';
  }
  console.log('Extracted vars:', JSON.stringify(vars));
}

// Find component references
const compRegex = /component:\s*["']([A-Z]\w+)["']/g;
let cMatch;
let compCount = 0;
while ((cMatch = compRegex.exec(lessonBlock)) !== null) {
  if (cMatch[1] === 'WorkedExample') continue;
  compCount++;
  if (compCount <= 3) {
    console.log(`\nComponent ${compCount}: ${cMatch[1]} at pos ${cMatch.index}`);

    // Try to extract props
    const afterComp = lessonBlock.substring(cMatch.index, cMatch.index + 1000);
    const propsMatch = afterComp.match(/props:\s*\(v\)\s*=>\s*\(\{([\s\S]*?)\}\s*\)/);
    console.log('  Props found:', !!propsMatch);
    if (propsMatch) {
      console.log('  Props (first 300):', propsMatch[1].substring(0, 300));

      // Try to extract angles
      const anglesBlock = propsMatch[1].match(/angles:\s*\[([\s\S]*?)\]/);
      console.log('  Angles block found:', !!anglesBlock);
      if (anglesBlock) {
        console.log('  Angles:', anglesBlock[1].substring(0, 200));
      }
    }
  }
}
console.log('\nTotal non-WE components in lesson:', compCount);

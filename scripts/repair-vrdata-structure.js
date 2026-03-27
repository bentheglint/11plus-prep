/**
 * Structural repair script for vrData.js
 * Scans every topic, verifies { }, [ ] balance, and fixes issues.
 */
const fs = require('fs');
const path = require('path');

const VR_DATA = path.join(__dirname, '..', 'src/questionData/vrData.js');
let content = fs.readFileSync(VR_DATA, 'utf8');
const lines = content.split('\n');

// Find all topic boundaries
const topics = [];
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^\s{4}(\w+):\s*\{/);
  if (m) topics.push({ name: m[1], startLine: i });
}

// Add end-of-file marker
topics.push({ name: '__END__', startLine: lines.length - 5 });

console.log('Found', topics.length - 1, 'topics');

// Check each topic's brace/bracket balance
for (let t = 0; t < topics.length - 1; t++) {
  const topic = topics[t];
  const nextTopic = topics[t + 1];
  const topicLines = lines.slice(topic.startLine, nextTopic.startLine);

  let braces = 0, brackets = 0;
  for (const line of topicLines) {
    for (const ch of line) {
      if (ch === '{') braces++;
      if (ch === '}') braces--;
      if (ch === '[') brackets++;
      if (ch === ']') brackets--;
    }
  }

  const status = (braces === 0 && brackets === 0) ? '✓' : '✗ braces:' + braces + ' brackets:' + brackets;
  console.log('  ' + topic.name + ' (lines ' + (topic.startLine+1) + '-' + nextTopic.startLine + '): ' + status);

  if (braces !== 0 || brackets !== 0) {
    // Find where the imbalance occurs
    let bd = 0, bkd = 0;
    for (let i = 0; i < topicLines.length; i++) {
      for (const ch of topicLines[i]) {
        if (ch === '{') bd++;
        if (ch === '}') bd--;
        if (ch === '[') bkd++;
        if (ch === ']') bkd--;
      }
      // Check if this is the last line with content
      if (i === topicLines.length - 1) {
        console.log('    Last line depth: braces=' + bd + ' brackets=' + bkd);
      }
    }

    // Try to fix: if there's an unclosed { or [, add the closing
    if (braces > 0 || brackets > 0) {
      console.log('    Needs ' + braces + ' extra } and ' + brackets + ' extra ]');
      // Add closings before the next topic
      let fix = '';
      for (let i = 0; i < brackets; i++) fix += '      ]\n';
      for (let i = 0; i < braces; i++) fix += '    },\n';

      // Insert before nextTopic's start line
      const insertLineIdx = nextTopic.startLine;
      lines.splice(insertLineIdx, 0, fix.trimEnd());
      // Shift all subsequent topic start lines
      for (let t2 = t + 1; t2 < topics.length; t2++) {
        topics[t2].startLine += 1;
      }
      console.log('    Fixed: inserted closings before ' + nextTopic.name);
    }
  }
}

// Reassemble and verify
const fixed = lines.join('\n');
let bd = 0, bkd = 0;
for (const ch of fixed) {
  if (ch === '{') bd++;
  if (ch === '}') bd--;
  if (ch === '[') bkd++;
  if (ch === ']') bkd--;
}
console.log('\nAfter fix: braces=' + bd + ' brackets=' + bkd);

if (bd === 0 && bkd === 0) {
  fs.writeFileSync(VR_DATA, fixed, 'utf8');
  console.log('Written ✓');
} else {
  console.log('Still unbalanced — manual fix needed');
  fs.writeFileSync(VR_DATA, fixed, 'utf8');
  console.log('Written anyway for inspection');
}

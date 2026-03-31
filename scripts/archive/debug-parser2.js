const fs = require('fs');
const path = require('path');

const src = fs.readFileSync('src/microLessons/staging/anglesshapes-subconcepts.js', 'utf8');

// Check sub-concept regex
const scRegex = /\{\s*\n\s*id:\s*["']([^"']+)["'],\s*\n\s*name:\s*["']([^"']+)["']/g;
let m;
const scs = [];
while ((m = scRegex.exec(src)) !== null) {
  scs.push({ id: m[1], name: m[2], pos: m.index });
}
console.log('Sub-concepts found:', scs.length);
scs.slice(0, 5).forEach(s => console.log('  ', s.id, '→', s.name));

// Check lesson regex
const lessonRegex = /\{\s*\n\s*id:\s*["']([^"']+)["'],\s*\n\s*templateType:/g;
const lessons = [];
while ((m = lessonRegex.exec(src)) !== null) {
  lessons.push({ id: m[1], pos: m.index });
}
console.log('\nLessons found:', lessons.length);
lessons.slice(0, 5).forEach(l => console.log('  ', l.id));

// Check component regex
const compRegex = /component:\s*["']([A-Z]\w+)["']/g;
const comps = [];
while ((m = compRegex.exec(src)) !== null) {
  comps.push(m[1]);
}
console.log('\nComponents found:', comps.length);
const counts = {};
comps.forEach(c => counts[c] = (counts[c] || 0) + 1);
Object.entries(counts).forEach(([k, v]) => console.log('  ', k, ':', v));

// Now check what the actual file looks like around a sub-concept definition
console.log('\n--- First sub-concept raw context (chars 0-500) ---');
console.log(src.substring(0, 500));

// Check for the specific pattern our regex expects
console.log('\n--- Searching for "id:" followed by "name:" pattern ---');
const pattern = /id:\s*["'][^"']+["'],\s*\n\s*name:/g;
let p;
const idNamePairs = [];
while ((p = pattern.exec(src)) !== null) {
  idNamePairs.push(src.substring(p.index, p.index + 80));
}
console.log('Found', idNamePairs.length, 'id+name pairs:');
idNamePairs.slice(0, 5).forEach(s => console.log('  ', s.replace(/\n/g, '\\n')));

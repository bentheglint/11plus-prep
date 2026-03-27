const fs = require('fs');
const src = fs.readFileSync('src/microLessons/staging/anglesshapes-subconcepts.js', 'utf8');

// Count visual patterns
const bodyPartsVisuals = (src.match(/type:\s*['"]visual['"]/g) || []).length;
const standaloneVisuals = (src.match(/visual:\s*\{[\s\n]*component:/g) || []).length;
const allComponentRefs = (src.match(/component:\s*['"][A-Z]\w+['"]/g) || []).length;

console.log('bodyParts visuals:', bodyPartsVisuals);
console.log('standalone visuals:', standaloneVisuals);
console.log('all component refs:', allComponentRefs);

// Check the sub-concept id extraction
const idMatches = src.match(/^\s*id:\s*["']([^"']+)["']/gm) || [];
console.log('\nAll id matches:', idMatches.length);
console.log('First 15:', idMatches.slice(0, 15).map(m => m.trim()));

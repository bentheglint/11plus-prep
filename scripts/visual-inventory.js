const fs = require('fs');
const path = require('path');
const dir = 'src/microLessons/staging';
const files = fs.readdirSync(dir).filter(f => f.endsWith('-subconcepts.js'));
const results = [];

for (const file of files) {
  const src = fs.readFileSync(path.join(dir, file), 'utf8');
  const topic = file.replace('-subconcepts.js', '');

  // Count screens with visuals by component type (excluding WorkedExample which is text-only)
  const componentCounts = {};
  const visualRegex = /component:\s*["'](\w+)["']/g;
  let match;
  while ((match = visualRegex.exec(src)) !== null) {
    const comp = match[1];
    if (comp === 'WorkedExample') continue;
    componentCounts[comp] = (componentCounts[comp] || 0) + 1;
  }

  if (Object.keys(componentCounts).length > 0) {
    results.push({ topic, components: componentCounts, total: Object.values(componentCounts).reduce((a,b) => a+b, 0) });
  }
}

// Sort by total diagrams descending
results.sort((a,b) => b.total - a.total);

let grandTotal = 0;
console.log('DIAGRAM INVENTORY BY TOPIC');
console.log('='.repeat(80));
for (const r of results) {
  const comps = Object.entries(r.components).map(([k,v]) => k + ':' + v).join(', ');
  console.log(r.topic.padEnd(30) + String(r.total).padStart(4) + '  ' + comps);
  grandTotal += r.total;
}
console.log('='.repeat(80));
console.log('TOTAL'.padEnd(30) + String(grandTotal).padStart(4));
console.log();

// Component summary
const allComps = {};
for (const r of results) {
  for (const [k,v] of Object.entries(r.components)) {
    allComps[k] = (allComps[k] || 0) + v;
  }
}
console.log('COMPONENTS SUMMARY (diagram components only, excludes WorkedExample)');
Object.entries(allComps).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log('  ' + k.padEnd(25) + String(v).padStart(4)));

// Priority order for visual QA (most likely to have label/line issues)
console.log('\nPRIORITY ORDER FOR VISUAL QA:');
console.log('P0 (SVG geometry - label overlaps, line issues):');
console.log('  AngleDisplay, AngleDiagram, ParallelLines, ExteriorAngle, RegularPolygon');
console.log('P1 (Layout diagrams):');
console.log('  NumberLine, PlaceValueChart, BarModel, CuboidDiagram, RectangleDiagram, LShapeDiagram, SDTTriangle');
console.log('P2 (Text-based visuals):');
console.log('  SentenceDisplay, LetterTiles, AlphabetLine, CodeTable, SequenceChain, AnalogyDisplay, WordChipsDisplay');

// Save JSON for later use
fs.writeFileSync('scripts/visual-inventory.json', JSON.stringify({ topics: results, components: allComps }, null, 2));
console.log('\nSaved to scripts/visual-inventory.json');

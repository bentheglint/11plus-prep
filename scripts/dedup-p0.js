const data = require('./diagram-urls.json');
const seen = new Set();
const unique = [];
for (const d of data.p0) {
  const key = d.component + ':' + JSON.stringify(d.props.angles || d.props);
  if (!seen.has(key)) {
    seen.add(key);
    unique.push(d);
  }
}
console.log('Total P0:', data.p0.length);
console.log('Unique P0 (deduplicated):', unique.length);
console.log('By component:');
const byComp = {};
unique.forEach(d => { byComp[d.component] = (byComp[d.component] || 0) + 1; });
Object.entries(byComp).sort((a,b) => b[1]-a[1]).forEach(([c,n]) => console.log('  ' + c + ': ' + n));

// Save unique list
const fs = require('fs');
fs.writeFileSync('./scripts/p0-unique.json', JSON.stringify(unique, null, 2));
console.log('\nSaved', unique.length, 'unique diagrams to scripts/p0-unique.json');

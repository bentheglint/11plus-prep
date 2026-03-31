/**
 * Visual QA Runner
 *
 * Reads diagram-urls.json and outputs a list of SVG analysis checks
 * to run in the browser via DiagramViewer. Generates a batch of
 * evaluate_script commands for Chrome DevTools MCP.
 *
 * Usage: node scripts/run-visual-qa.js [p0|p1|all] [offset] [limit]
 */

const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'diagram-urls.json'), 'utf8'));

const mode = process.argv[2] || 'p0';
const offset = parseInt(process.argv[3] || '0');
const limit = parseInt(process.argv[4] || '20');

let diagrams;
if (mode === 'p0') diagrams = data.p0;
else if (mode === 'p1') diagrams = data.p1;
else diagrams = [...data.p0, ...data.p1];

const batch = diagrams.slice(offset, offset + limit);

console.log(`Visual QA batch: mode=${mode}, offset=${offset}, limit=${limit}`);
console.log(`Processing ${batch.length} of ${diagrams.length} diagrams\n`);

// Output URLs for processing
batch.forEach((d, i) => {
  const idx = offset + i;
  console.log(`[${idx}] ${d.topic} > ${d.scName} > ${d.screen} > ${d.component}`);
  if (d.props.angles) {
    console.log(`    Angles: ${d.props.angles.map(a => a.value + '°').join(', ')}`);
  }
  console.log(`    URL: ${d.url.substring(0, 150)}...`);
  console.log();
});

// Save batch for easy consumption
const batchFile = path.join(__dirname, 'visual-qa-batch.json');
fs.writeFileSync(batchFile, JSON.stringify({ mode, offset, limit, batch }, null, 2));
console.log(`Batch saved to ${batchFile}`);

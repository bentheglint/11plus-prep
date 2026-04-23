#!/usr/bin/env node
/**
 * update-brand-palette.js
 *
 * Migrates all old muted brand colours to the new kid-friendly palette
 * we approved in brand-assets/logo-options/palette.html.
 *
 *   Old muted → New bright
 *   #6C5CE7   → #7C3AED   (primary purple; brand anchor)
 *   #0770C2   → #3B82F6   (blue; was Maths subject colour)
 *   #007D62   → #22C55E   (green; was English subject colour)
 *   #F39C12   → #F59E0B   (amber; warm accent)
 *   #0652DD   → #2563EB   (darker blue for gradient endpoints)
 *   #00876A   → #16A34A   (darker green for gradient endpoints)
 *
 * Scope: src/** + public/*.html (excluding generated oracle-review extracts).
 *
 * Run: node scripts/update-brand-palette.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const REPLACEMENTS = [
  // Primary purple (already migrated in prior run — idempotent safety net)
  { from: /#6C5CE7/gi, to: '#7C3AED' },
  // Blue family
  { from: /#0770C2/gi, to: '#3B82F6' },
  { from: /#0652DD/gi, to: '#2563EB' },
  // Green family
  { from: /#007D62/gi, to: '#22C55E' },
  { from: /#00876A/gi, to: '#16A34A' },
  // Amber accent
  { from: /#F39C12/gi, to: '#F59E0B' }
];

const INCLUDE_ROOTS = [
  path.join(ROOT, 'src'),
  path.join(ROOT, 'public')
];

const EXT_PATTERN = /\.(js|jsx|ts|tsx|css|html|json|svg|md)$/i;

let totalChanges = 0;
let filesChanged = 0;
const changedFiles = [];

function walkDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && EXT_PATTERN.test(entry.name)) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  const before = fs.readFileSync(filePath, 'utf8');
  let after = before;
  let count = 0;
  for (const { from, to } of REPLACEMENTS) {
    const matches = after.match(from);
    if (matches) {
      count += matches.length;
      after = after.replace(from, to);
    }
  }
  if (after !== before) {
    fs.writeFileSync(filePath, after);
    totalChanges += count;
    filesChanged++;
    const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
    changedFiles.push({ file: rel, count });
  }
}

for (const root of INCLUDE_ROOTS) {
  if (fs.existsSync(root)) walkDir(root);
}

console.log(`Replaced ${totalChanges} colour references across ${filesChanged} files:\n`);
changedFiles
  .sort((a, b) => b.count - a.count)
  .forEach(({ file, count }) => {
    console.log(`  ${count.toString().padStart(3)} — ${file}`);
  });

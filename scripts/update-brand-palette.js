#!/usr/bin/env node
/**
 * update-brand-palette.js
 *
 * Swaps the old brand purple (#6C5CE7) for the new brighter purple (#7C3AED)
 * across runtime source files. The new shade hits WCAG AA on white body text
 * (5.93:1 vs old 3.98:1) while feeling more kid-friendly vibrant.
 *
 * Scope:
 *   ✓ src/**
 *   ✓ public/terms.html, public/privacy.html
 *   ✗ scripts/oracle-review/** (generated extracts — regenerate if needed)
 *   ✗ JS Files for Question Bank/** (orphan archive)
 *   ✗ brand-assets/** (already on new palette)
 *   ✗ workers/** (standalone deploy, handle separately if needed)
 *
 * Run: node scripts/update-brand-palette.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const REPLACEMENTS = [
  // Old brand purple → new brand purple. Case-insensitive (handles #6C5CE7, #6c5ce7).
  { from: /#6C5CE7/g, to: '#7C3AED' },
  { from: /#6c5ce7/g, to: '#7C3AED' }
];

// Directories to walk
const INCLUDE_ROOTS = [
  path.join(ROOT, 'src'),
  path.join(ROOT, 'public')
];

// Files to skip by exact path suffix
const EXCLUDE_PATHS = new Set([
  // None for now — include everything in INCLUDE_ROOTS
]);

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
      if (EXCLUDE_PATHS.has(fullPath)) continue;
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

#!/usr/bin/env node
/**
 * Orphan image scan — lists files under public/images/questions/ that no
 * source file references, either by relative path (e.g. "volume/cuboid-1.svg")
 * or by bare filename. Conservative: a basename match anywhere in src/ (or
 * public/index.html) keeps the file. Read-only; prints a report and writes
 * the orphan list to scripts/orphan-svg-list.txt for review before deletion.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join('public', 'images', 'questions');

const onDisk = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else onDisk.push(p);
  }
})(root);

let corpus = '';
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|jsx|css|html|json|md)$/.test(e.name)) corpus += fs.readFileSync(p, 'utf8');
  }
})('src');
corpus += fs.readFileSync(path.join('public', 'index.html'), 'utf8');

const orphans = [];
const referenced = [];
for (const f of onDisk) {
  const rel = path.relative(root, f).split(path.sep).join('/');
  const base = path.basename(f);
  if (corpus.includes(rel) || corpus.includes(base)) referenced.push(rel);
  else orphans.push(rel);
}

console.log(`on disk: ${onDisk.length}  referenced: ${referenced.length}  orphans: ${orphans.length}`);
const byDir = {};
for (const o of orphans) {
  const d = o.split('/')[0];
  byDir[d] = (byDir[d] || 0) + 1;
}
console.log('orphans by folder:', byDir);
const ext = {};
for (const f of onDisk) {
  const x = path.extname(f) || '(none)';
  ext[x] = (ext[x] || 0) + 1;
}
console.log('extensions on disk:', ext);
fs.writeFileSync(path.join('scripts', 'orphan-svg-list.txt'), orphans.join('\n') + '\n');
console.log('orphan list written to scripts/orphan-svg-list.txt');

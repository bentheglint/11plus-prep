#!/usr/bin/env node
/**
 * Content census — imports the three question-data modules and reports
 * question counts and topic keys per subject, plus micro-lesson counts.
 * Read-only; used to keep CLAUDE.md's content-bank table honest.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');

(async () => {
  let grand = 0;
  for (const f of ['mathsData', 'englishData', 'vrData']) {
    const tmp = path.join(os.tmpdir(), f + '.mjs');
    fs.copyFileSync(path.join('src', 'questionData', f + '.js'), tmp);
    const mod = (await import(pathToFileURL(tmp).href)).default;
    const keys = Object.keys(mod.topics);
    let n = 0;
    for (const k of keys) n += mod.topics[k].questions.length;
    grand += n;
    console.log(`${f}: ${n} questions, ${keys.length} topics: ${keys.join(', ')}`);
  }
  console.log('GRAND TOTAL questions:', grand);

  const stagingDir = path.join('src', 'microLessons', 'staging');
  let lessons = 0;
  let files = 0;
  for (const f of fs.readdirSync(stagingDir)) {
    if (!f.endsWith('.js')) continue;
    files++;
    const src = fs.readFileSync(path.join(stagingDir, f), 'utf8');
    lessons += (src.match(/^\s*(?:id|lessonId):\s*['"]/gm) || []).length;
  }
  console.log(`micro-lesson staging files: ${files}, lesson entries (id-based count): ${lessons}`);
})();

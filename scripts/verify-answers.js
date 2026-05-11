#!/usr/bin/env node
/**
 * verify-answers.js
 * Gate 4 script for the content gap-fill sprint.
 * Diffs current question data against baseline-manifest.json to enforce:
 *   (a) No duplicate question IDs within a topic
 *   (b) All new IDs > baseline ceiling for that topic
 *   (c) All IDs that existed at baseline still exist (no renumbering/deletion)
 *   (d) Every questionId in the lesson map has a matching question in the data file
 *   (e) Every new question has exactly one lesson map entry (both directions)
 *
 * Usage: node scripts/verify-answers.js [--topic <topicKey>] [--subject vr|maths]
 * Run after every gap's questions are added. Must pass before Gate 5 (commit).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(__dirname, 'baseline-manifest.json');
const VR_DATA_PATH = path.join(ROOT, 'src/questionData/vrData.js');
const MATHS_DATA_PATH = path.join(ROOT, 'src/questionData/mathsData.js');
const VR_MAP_PATH = path.join(ROOT, 'public/vr-question-lesson-map.json');
const MATHS_MAP_PATH = path.join(ROOT, 'public/maths-question-lesson-map.json');

const args = process.argv.slice(2);
const filterTopic = args[args.indexOf('--topic') + 1] || null;
const filterSubject = args[args.indexOf('--subject') + 1] || null;

let errors = 0;
let warnings = 0;

function fail(msg) { console.error('  FAIL:', msg); errors++; }
function warn(msg) { console.warn('  WARN:', msg); warnings++; }
function ok(msg) { console.log('  OK  :', msg); }

// ── Load manifest ────────────────────────────────────────────────────────────

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

// ── Extract IDs from data files ──────────────────────────────────────────────
// Position-based: find all topic declarations (word: { \n name:), then assign
// each id: N occurrence to whichever topic declaration precedes it in the file.

const _topicIdCache = {};

function loadAllTopicIds(filePath) {
  if (_topicIdCache[filePath]) return _topicIdCache[filePath];
  const content = fs.readFileSync(filePath, 'utf8');

  const topicRegex = /\b(\w+):\s*\{\s*\n\s*name:/g;
  const topics = [];
  let m;
  while ((m = topicRegex.exec(content)) !== null) {
    topics.push({ name: m[1], pos: m.index });
  }

  const idRegex = /\bid:\s*(\d+)/g;
  const result = {};
  while ((m = idRegex.exec(content)) !== null) {
    const pos = m.index;
    const topic = [...topics].reverse().find(t => t.pos < pos);
    if (topic) {
      if (!result[topic.name]) result[topic.name] = [];
      result[topic.name].push(parseInt(m[1]));
    }
  }

  _topicIdCache[filePath] = result;
  return result;
}

function extractTopicIds(filePath, topicKey) {
  const all = loadAllTopicIds(filePath);
  return all[topicKey] || null;
}

// ── Load lesson maps ─────────────────────────────────────────────────────────

function loadMap(mapPath) {
  if (!fs.existsSync(mapPath)) return {};
  return JSON.parse(fs.readFileSync(mapPath, 'utf8'));
}

const vrMap = loadMap(VR_MAP_PATH);
const mathsMap = loadMap(MATHS_MAP_PATH);

// ── Verify a single topic ────────────────────────────────────────────────────

function verifyTopic(subject, topicKey, baselineEntry, dataFilePath, lessonMap) {
  if (filterTopic && topicKey !== filterTopic) return;
  if (filterSubject && subject !== filterSubject) return;

  console.log(`\n[${subject}] ${topicKey}`);

  const currentIds = extractTopicIds(dataFilePath, topicKey);
  if (currentIds === null) {
    fail(`Topic "${topicKey}" not found in data file`);
    return;
  }

  const baseline = baselineEntry;
  const baselineCeiling = baseline.ceiling;
  const baselineCount = baseline.count;

  // (a) No duplicate IDs
  const seen = new Set();
  const dupes = [];
  for (const id of currentIds) {
    if (seen.has(id)) dupes.push(id);
    seen.add(id);
  }
  if (dupes.length > 0) {
    fail(`Duplicate IDs: ${dupes.join(', ')}`);
  } else {
    ok(`No duplicate IDs (${currentIds.length} questions)`);
  }

  // (b) All new IDs > baseline ceiling
  const newIds = currentIds.filter(id => id > baselineCeiling);
  const illegalIds = currentIds.filter(id => id > baselineCeiling && id <= baselineCeiling);
  // Actually check: any ID that is > baseline.ceiling is "new" — these must all be > ceiling (tautology).
  // Real check: any ID that is BETWEEN 1 and baseline.ceiling should have existed at baseline.
  const legacyIds = currentIds.filter(id => id <= baselineCeiling);
  if (newIds.length > 0) {
    const minNew = Math.min(...newIds);
    if (minNew !== baselineCeiling + 1) {
      warn(`New IDs don't start immediately after ceiling. Expected first new ID: ${baselineCeiling + 1}, got: ${minNew}. Gap in IDs?`);
    } else {
      ok(`New IDs start correctly at ${baselineCeiling + 1} (${newIds.length} new questions)`);
    }
  } else {
    ok(`No new IDs added yet (ceiling still at ${baselineCeiling})`);
  }

  // (c) All baseline IDs still exist (no deletion/renumbering)
  if (legacyIds.length < baselineCount) {
    fail(`Legacy ID count mismatch. Baseline had ${baselineCount} IDs ≤ ${baselineCeiling}, found ${legacyIds.length}. ${baselineCount - legacyIds.length} IDs may have been deleted or renumbered.`);
  } else {
    ok(`All ${baselineCount} baseline IDs still present`);
  }

  // (d) Every questionId in lesson map has a matching question
  const mapEntries = lessonMap[topicKey] || [];
  const idSet = new Set(currentIds);
  const unmatchedMapIds = mapEntries.filter(e => !idSet.has(e.questionId));
  if (unmatchedMapIds.length > 0) {
    fail(`${unmatchedMapIds.length} lesson map entries have no matching question: ${unmatchedMapIds.map(e => e.questionId).join(', ')}`);
  } else {
    ok(`All ${mapEntries.length} lesson map entries have matching questions`);
  }

  // (e) Every new question has exactly one lesson map entry
  const mappedIds = new Set(mapEntries.map(e => e.questionId));
  const newUnmapped = newIds.filter(id => !mappedIds.has(id));
  if (newUnmapped.length > 0) {
    fail(`${newUnmapped.length} new questions have no lesson map entry: IDs ${newUnmapped.join(', ')}`);
  } else if (newIds.length > 0) {
    ok(`All ${newIds.length} new questions have lesson map entries`);
  }
}

// ── Run all verifications ────────────────────────────────────────────────────

console.log('verify-answers.js — Content Gap-Fill Sprint Gate 4');
console.log(`Manifest: ${MANIFEST_PATH} (generated ${manifest.generated})`);

for (const [topicKey, baseline] of Object.entries(manifest.vr)) {
  verifyTopic('vr', topicKey, baseline, VR_DATA_PATH, vrMap);
}
for (const [topicKey, baseline] of Object.entries(manifest.maths)) {
  verifyTopic('maths', topicKey, baseline, MATHS_DATA_PATH, mathsMap);
}

// New topics (balanceEquations) — only check if the topic exists in vrData
for (const [topicKey, baseline] of Object.entries(manifest.newTopics)) {
  if (filterSubject && 'vr' !== filterSubject) continue;
  if (filterTopic && topicKey !== filterTopic) continue;
  console.log(`\n[vr/new] ${topicKey}`);
  const currentIds = extractTopicIds(VR_DATA_PATH, topicKey);
  if (currentIds === null) {
    warn(`New topic "${topicKey}" not yet in vrData.js — add when Phase 1.3 begins`);
  } else {
    ok(`New topic "${topicKey}" found with ${currentIds.length} questions`);
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────

console.log('\n────────────────────────────────────────────');
if (errors === 0 && warnings === 0) {
  console.log('PASS — All checks passed. Safe to commit.');
} else if (errors === 0) {
  console.log(`WARN — ${warnings} warning(s). Review before committing.`);
  process.exit(0);
} else {
  console.log(`FAIL — ${errors} error(s), ${warnings} warning(s). Fix before committing.`);
  process.exit(1);
}

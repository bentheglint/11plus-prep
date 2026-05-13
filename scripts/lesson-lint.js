#!/usr/bin/env node
/**
 * lesson-lint.js
 * Gate 4 script for the content gap-fill sprint.
 * Validates the full three-layer invariant for every sub-concept in staging files:
 *   (a) Question field checks: options count = 5, correct in 0-4, explanation ends ✓, no empty fields
 *   (b) Every subConceptId in the lesson map exists in the relevant staging file
 *   (c) Every sub-concept entry has all 5 required screens (intro, hook, teach, interact, consolidate)
 *
 * Usage: node scripts/lesson-lint.js [--topic <topicKey>]
 * Run after every gap's micro-lesson is added. Must pass before Gate 5 (commit).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STAGING_DIR = path.join(ROOT, 'src/microLessons/staging');
const VR_MAP_PATH = path.join(ROOT, 'public/vr-question-lesson-map.json');
const MATHS_MAP_PATH = path.join(ROOT, 'public/maths-question-lesson-map.json');
const VR_DATA_PATH = path.join(ROOT, 'src/questionData/vrData.js');
const MATHS_DATA_PATH = path.join(ROOT, 'src/questionData/mathsData.js');
const MANIFEST_PATH = path.join(__dirname, 'baseline-manifest.json');
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

const args = process.argv.slice(2);
const filterTopic = args[args.indexOf('--topic') + 1] || null;

let errors = 0;
let warnings = 0;

function fail(msg) { console.error('  FAIL:', msg); errors++; }
function warn(msg) { console.warn('  WARN:', msg); warnings++; }
function ok(msg) { console.log('  OK  :', msg); }

// ── Load lesson maps ─────────────────────────────────────────────────────────

function loadMap(mapPath) {
  if (!fs.existsSync(mapPath)) return {};
  return JSON.parse(fs.readFileSync(mapPath, 'utf8'));
}

const vrMap = loadMap(VR_MAP_PATH);
const mathsMap = loadMap(MATHS_MAP_PATH);

// ── Extract sub-concept IDs from staging file ─────────────────────────────────

function getSubConceptIds(stagingFilePath) {
  if (!fs.existsSync(stagingFilePath)) return null;
  const content = fs.readFileSync(stagingFilePath, 'utf8');
  return [...content.matchAll(/\bid:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
}

// ── Check required screens present for a lesson entry ────────────────────────
// Screens use type: "hook" | "teach" | "interact" | "consolidate" within the lessons array.
// The intro is structurally implicit (the lesson object itself). We require the 4 typed screens.

const REQUIRED_SCREEN_TYPES = ['hook', 'teach', 'interact', 'consolidate'];

function checkSubConceptScreens(stagingContent, subConceptId) {
  // Find the lesson object with this ID
  let idx = stagingContent.indexOf(`'${subConceptId}'`);
  if (idx === -1) idx = stagingContent.indexOf(`"${subConceptId}"`);
  if (idx === -1) return { found: false, missing: REQUIRED_SCREEN_TYPES };

  // Search up to 30KB from the sub-concept ID for screen type declarations.
  // We skip any nested lesson IDs (like "balance-equations-steps") to avoid
  // cutting the window before the actual screens array.
  const rest = stagingContent.slice(idx + subConceptId.length + 2);
  const windowEnd = Math.min(rest.length, 30000);
  const window = rest.slice(0, windowEnd);

  // Look for screen type declarations: type: "hook" etc.
  const screenTypes = [...window.matchAll(/\btype:\s*['"](\w+)['"]/g)].map(m => m[1].toLowerCase());
  const missing = REQUIRED_SCREEN_TYPES.filter(req => !screenTypes.includes(req));
  return { found: true, missing };
}

// ── Extract questions from data file for validation ──────────────────────────

function extractQuestions(dataFilePath, topicKey) {
  const content = fs.readFileSync(dataFilePath, 'utf8');
  const topicPattern = new RegExp(`\\n\\s*${topicKey}:\\s*\\{`);
  const topicMatch = topicPattern.exec(content);
  if (!topicMatch) return [];
  const topicStart = topicMatch.index;

  const rest = content.slice(topicStart + 1);
  const nextTopicMatch = rest.match(/\n\s*\w+:\s*\{/);
  const end = nextTopicMatch ? nextTopicMatch.index : rest.length;
  const section = rest.slice(0, end);

  // Extract individual question objects — look for patterns after id: N
  const questions = [];
  const idMatches = [...section.matchAll(/\bid:\s*(\d+)/g)];

  idMatches.forEach((idMatch, i) => {
    const qStart = idMatch.index;
    const qEnd = i + 1 < idMatches.length ? idMatches[i + 1].index : section.length;
    const qBlock = section.slice(qStart, qEnd);

    const id = parseInt(idMatch[1]);

    // options
    const optionsMatch = qBlock.match(/options:\s*\[([^\]]+)\]/s);
    const optionCount = optionsMatch
      ? (optionsMatch[1].match(/["'`][^"'`]*["'`]/g) || []).length
      : null;

    // correct
    const correctMatch = qBlock.match(/\bcorrect:\s*(\d+)/);
    const correct = correctMatch ? parseInt(correctMatch[1]) : null;

    // explanation
    const explMatch = qBlock.match(/explanation:\s*["'`]([\s\S]*?)["'`]/);
    const explanation = explMatch ? explMatch[1] : null;

    // question text
    const qTextMatch = qBlock.match(/\bquestion:\s*["'`]([\s\S]*?)["'`]/);
    const questionText = qTextMatch ? qTextMatch[1] : null;

    questions.push({ id, optionCount, correct, explanation, questionText });
  });

  return questions;
}

// ── Validate question fields ──────────────────────────────────────────────────

function validateQuestions(topicKey, dataFilePath, label) {
  if (filterTopic && topicKey !== filterTopic) return;
  console.log(`\n[${label}] ${topicKey} — question fields (new questions only)`);

  const allQuestions = extractQuestions(dataFilePath, topicKey);
  if (allQuestions.length === 0) {
    warn(`No questions extracted for ${topicKey} — check data file structure`);
    return;
  }

  // Only validate NEW questions (IDs above baseline ceiling)
  const baselineEntry = manifest.vr[topicKey] || manifest.maths[topicKey] || manifest.newTopics[topicKey];
  const baselineCeiling = baselineEntry ? baselineEntry.ceiling : 0;
  const questions = allQuestions.filter(q => q.id > baselineCeiling);

  if (questions.length === 0) {
    ok(`No new questions yet (baseline ceiling: ${baselineCeiling})`);
    return;
  }

  let fieldErrors = 0;
  questions.forEach(q => {
    if (q.optionCount !== null && q.optionCount !== 5) {
      fail(`Q${q.id}: options count = ${q.optionCount} (expected 5)`);
      fieldErrors++;
    }
    if (q.correct !== null && (q.correct < 0 || q.correct > 4)) {
      fail(`Q${q.id}: correct = ${q.correct} (must be 0–4)`);
      fieldErrors++;
    }
    if (q.explanation !== null && !q.explanation.trim().endsWith('✓')) {
      fail(`Q${q.id}: explanation does not end with ✓`);
      fieldErrors++;
    }
    if (q.questionText !== null && q.questionText.trim() === '') {
      fail(`Q${q.id}: empty question text`);
      fieldErrors++;
    }
    if (q.explanation !== null && q.explanation.trim() === '') {
      fail(`Q${q.id}: empty explanation`);
      fieldErrors++;
    }
  });

  if (fieldErrors === 0) ok(`All ${questions.length} new questions pass field checks`);
}

// ── Validate lesson map ↔ staging file (new sub-concepts only) ───────────────

function validateMapToStaging(topicKey, lessonMap, dataFilePath, stagingFilePath, label) {
  if (filterTopic && topicKey !== filterTopic) return;
  console.log(`\n[${label}] ${topicKey} — map → staging (new sub-concepts only)`);

  const baselineEntry = manifest.vr[topicKey] || manifest.maths[topicKey] || manifest.newTopics[topicKey];
  const baselineCeiling = baselineEntry ? baselineEntry.ceiling : 0;

  const mapEntries = lessonMap[topicKey] || [];
  // Only check sub-concepts referenced by NEW questions
  const newMapEntries = mapEntries.filter(e => e.questionId > baselineCeiling);

  if (newMapEntries.length === 0) {
    ok(`No new lesson map entries yet (baseline ceiling: ${baselineCeiling})`);
    return;
  }

  const stagingContent = fs.existsSync(stagingFilePath)
    ? fs.readFileSync(stagingFilePath, 'utf8')
    : null;

  if (!stagingContent) {
    fail(`Staging file missing: ${stagingFilePath} — required for new sub-concepts`);
    return;
  }

  const subConceptIds = getSubConceptIds(stagingFilePath);
  const uniqueNewSubConcepts = [...new Set(newMapEntries.map(e => e.subConceptId))];

  uniqueNewSubConcepts.forEach(scId => {
    if (!subConceptIds.includes(scId)) {
      fail(`New subConceptId "${scId}" has no entry in staging file ${path.basename(stagingFilePath)}`);
    } else {
      // Check required screens
      const { found, missing } = checkSubConceptScreens(stagingContent, scId);
      if (!found) {
        fail(`subConceptId "${scId}" ID found but lesson block not located in staging file`);
      } else if (missing.length > 0) {
        fail(`subConceptId "${scId}" missing screen types: ${missing.join(', ')}`);
      } else {
        ok(`"${scId}" — all required screens present`);
      }
    }
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log('lesson-lint.js — Content Gap-Fill Sprint Gate 4 (Three-Layer Validation)');

// All affected topics (extend as phases progress)
const vrTopics = ['numberSeries','letterCodes','logicAndLanguage','numberWordCodes',
  'missingLettersWords','synonyms','wordCodeAnalogies','compoundWords','letterPairSeries',
  'balanceEquations'];
const mathsTopics = ['decimals','algebra','sequences','longdivision','speeddistancetime',
  'ratio','longmultiplication','placevalue','anglesshapes','datahandling','areaperimeter','volume'];

// Question field validation
vrTopics.forEach(t => validateQuestions(t, VR_DATA_PATH, 'vr'));
mathsTopics.forEach(t => validateQuestions(t, MATHS_DATA_PATH, 'maths'));

// Map → staging validation
vrTopics.forEach(t => {
  const stagingFile = path.join(STAGING_DIR, `${t.toLowerCase()}-subconcepts.js`);
  validateMapToStaging(t, vrMap, VR_DATA_PATH, stagingFile, 'vr');
});
mathsTopics.forEach(t => {
  const stagingFile = path.join(STAGING_DIR, `${t.toLowerCase()}-subconcepts.js`);
  validateMapToStaging(t, mathsMap, MATHS_DATA_PATH, stagingFile, 'maths');
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log('\n────────────────────────────────────────────');
if (errors === 0 && warnings === 0) {
  console.log('PASS — All three-layer checks passed. Safe to commit.');
} else if (errors === 0) {
  console.log(`WARN — ${warnings} warning(s). Review before committing.`);
  process.exit(0);
} else {
  console.log(`FAIL — ${errors} error(s), ${warnings} warning(s). Fix before committing.`);
  process.exit(1);
}

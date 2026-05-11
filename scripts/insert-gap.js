#!/usr/bin/env node
/**
 * insert-gap.js — Standard content gap insertion tool
 *
 * Reads a gap output file and inserts:
 *   1. Questions into the relevant data file (vrData.js or mathsData.js)
 *   2. Map entries into the relevant lesson map JSON
 *   3. Lesson JS snippet into the relevant staging file
 *
 * Then runs Gate 4 scripts automatically.
 *
 * Usage:
 *   node scripts/insert-gap.js scripts/gap-output/V2-letter-position-analogy.md
 *
 * Gap output file format (3 clearly delimited sections):
 *
 *   ## META
 *   {"gapId":"V2","subject":"vr","topicKey":"letterCodes","subConceptId":"letter-position-analogy","lessonId":"letter-position-analogy-steps","startId":167}
 *
 *   ## QUESTIONS
 *   [{"id":167,"difficulty":1,"question":"...","options":[...],"correct":0,"explanation":"... ✓"}, ...]
 *
 *   ## MAP_ENTRIES
 *   [{"questionId":167,"subConceptId":"letter-position-analogy-steps","confidence":"high"}, ...]
 *
 *   ## LESSON
 *     {
 *       id: "letter-position-analogy",
 *       ...full JS lesson object...
 *     },
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(__dirname, 'baseline-manifest.json');

// ── Parse gap output file ────────────────────────────────────────────────────

const outputFile = process.argv[2];
if (!outputFile) {
  console.error('Usage: node scripts/insert-gap.js <gap-output-file>');
  process.exit(1);
}

const raw = fs.readFileSync(outputFile, 'utf8');

function extractSection(name) {
  const regex = new RegExp(`## ${name}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`);
  const match = raw.match(regex);
  if (!match) { console.error(`Section ## ${name} not found in output file`); process.exit(1); }
  return match[1].trim();
}

const meta     = JSON.parse(extractSection('META'));
const questions = JSON.parse(extractSection('QUESTIONS'));
const mapEntries = JSON.parse(extractSection('MAP_ENTRIES'));
const lessonJs = extractSection('LESSON');

const { gapId, subject, topicKey, subConceptId, lessonId, startId } = meta;
console.log(`\nInserting gap ${gapId}: ${topicKey} / ${subConceptId} (${questions.length} questions, starting ID ${startId})`);

// ── Validate against manifest ─────────────────────────────────────────────────

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const topicManifest = manifest.vr?.[topicKey] || manifest.maths?.[topicKey] || manifest.newTopics?.[topicKey];

if (!topicManifest) {
  console.error(`Topic "${topicKey}" not found in baseline manifest. Add it first.`);
  process.exit(1);
}

const expectedStartId = topicManifest.ceiling + 1;
if (startId !== expectedStartId) {
  console.error(`startId mismatch: file says ${startId}, manifest says next ID should be ${expectedStartId}`);
  process.exit(1);
}

// Check IDs are sequential from startId
questions.forEach((q, i) => {
  if (q.id !== startId + i) {
    console.error(`Question ${i + 1}: expected id ${startId + i}, got ${q.id}`);
    process.exit(1);
  }
});

// Check explanations end with ✓
questions.forEach(q => {
  if (!q.explanation.trim().endsWith('✓')) {
    console.error(`Q${q.id}: explanation does not end with ✓`);
    process.exit(1);
  }
  if (q.options.length !== 5) {
    console.error(`Q${q.id}: expected 5 options, got ${q.options.length}`);
    process.exit(1);
  }
  if (q.correct < 0 || q.correct > 4) {
    console.error(`Q${q.id}: correct=${q.correct} out of range (0–4)`);
    process.exit(1);
  }
});

console.log(`  ✓ Validation passed (${questions.length} questions, IDs ${startId}–${startId + questions.length - 1})`);

// ── Resolve file paths ────────────────────────────────────────────────────────

const DATA_FILE = subject === 'maths'
  ? path.join(ROOT, 'src/questionData/mathsData.js')
  : path.join(ROOT, 'src/questionData/vrData.js');

const MAP_FILE = subject === 'maths'
  ? path.join(ROOT, 'public/maths-question-lesson-map.json')
  : path.join(ROOT, 'public/vr-question-lesson-map.json');

const STAGING_FILE = path.join(ROOT, `src/microLessons/staging/${topicKey.toLowerCase()}-subconcepts.js`);

// ── Format question JS ────────────────────────────────────────────────────────

function formatQuestion(q) {
  const opts = q.options.map(o => JSON.stringify(o)).join(', ');
  const lines = [
    '        {',
    `          id: ${q.id},`,
    `          difficulty: ${q.difficulty},`,
    `          question: ${JSON.stringify(q.question)},`,
    `          options: [${opts}],`,
    `          correct: ${q.correct},`,
    `          explanation: ${JSON.stringify(q.explanation)}`,
    '        }',
  ];
  return lines.join('\n');
}

const questionBlocks = questions.map(formatQuestion).join(',\n');

// ── Insert questions into data file ──────────────────────────────────────────
// Strategy: find the letterSums / next-topic marker just after this topic's questions end,
// and insert before the closing ] of this topic's questions array.

let dataContent = fs.readFileSync(DATA_FILE, 'utf8');

// Find where this topic starts
const topicPattern = new RegExp(`\\b${topicKey}:\\s*\\{\\s*\\n\\s*name:`);
const topicMatch = topicPattern.exec(dataContent);
if (!topicMatch) {
  console.error(`Topic "${topicKey}" not found in ${path.basename(DATA_FILE)}`);
  process.exit(1);
}

// Find the next topic after this one (to set our search boundary)
const afterTopic = dataContent.slice(topicMatch.index + 1);
const nextTopicMatch = afterTopic.match(/\n\s*\w+:\s*\{\s*\n\s*name:/);
const boundary = nextTopicMatch ? topicMatch.index + 1 + nextTopicMatch.index : dataContent.length;

// Within the topic, find the last question block's closing }
const topicSection = dataContent.slice(topicMatch.index, boundary);
const lastBraceIdx = topicSection.lastIndexOf('        }');
if (lastBraceIdx === -1) {
  console.error(`Could not find last question closing brace in topic "${topicKey}"`);
  process.exit(1);
}

const insertAt = topicMatch.index + lastBraceIdx + '        }'.length;
dataContent = dataContent.slice(0, insertAt) + ',\n' + questionBlocks + dataContent.slice(insertAt);
fs.writeFileSync(DATA_FILE, dataContent);
console.log(`  ✓ Questions inserted into ${path.basename(DATA_FILE)}`);

// ── Insert map entries ────────────────────────────────────────────────────────

const lessonMap = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'));
if (!lessonMap[topicKey]) lessonMap[topicKey] = [];
lessonMap[topicKey].push(...mapEntries);
fs.writeFileSync(MAP_FILE, JSON.stringify(lessonMap, null, 2));
console.log(`  ✓ Map entries inserted into ${path.basename(MAP_FILE)}`);

// ── Insert lesson into staging file ──────────────────────────────────────────

if (!fs.existsSync(STAGING_FILE)) {
  console.error(`Staging file not found: ${STAGING_FILE}`);
  console.error(`Create it first, then re-run.`);
  process.exit(1);
}

let stagingContent = fs.readFileSync(STAGING_FILE, 'utf8');

// Find the closing ]; of the export array and insert before it
const closingIdx = stagingContent.lastIndexOf('];');
if (closingIdx === -1) {
  console.error(`Could not find closing ]; in staging file`);
  process.exit(1);
}

// Ensure the previous entry has a trailing comma
const beforeClose = stagingContent.slice(0, closingIdx).trimEnd();
const needsComma = !beforeClose.endsWith(',');
const separator = needsComma ? ',\n\n' : '\n\n';

stagingContent = beforeClose + separator + lessonJs + '\n\n];\n';
fs.writeFileSync(STAGING_FILE, stagingContent);
console.log(`  ✓ Lesson inserted into ${path.basename(STAGING_FILE)}`);

// ── Run Gate 4 scripts ───────────────────────────────────────────────────────

console.log('\n── Gate 4: verify-answers.js ───────────────────────────────────');
try {
  const verifyOut = execSync(
    `node "${path.join(__dirname, 'verify-answers.js')}" --topic ${topicKey} --subject ${subject}`,
    { cwd: ROOT, encoding: 'utf8' }
  );
  console.log(verifyOut);
} catch (e) {
  console.error(e.stdout || e.message);
  process.exit(1);
}

console.log('── Gate 4: lesson-lint.js ──────────────────────────────────────');
try {
  const lintOut = execSync(
    `node "${path.join(__dirname, 'lesson-lint.js')}" --topic ${topicKey}`,
    { cwd: ROOT, encoding: 'utf8' }
  );
  console.log(lintOut);
} catch (e) {
  console.error(e.stdout || e.message);
  process.exit(1);
}

console.log(`\n✓ Gap ${gapId} inserted successfully. Review in Speed Review + URLs:`);
console.log(`  D1: http://localhost:3000?dev-auth=true&preview=${topicKey}&q=${startId}`);
console.log(`  D2: http://localhost:3000?dev-auth=true&preview=${topicKey}&q=${startId + 10}`);
console.log(`  D3: http://localhost:3000?dev-auth=true&preview=${topicKey}&q=${startId + 20}`);

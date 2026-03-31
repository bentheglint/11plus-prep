#!/usr/bin/env node
/**
 * Master extraction runner — extracts questions, lessons, and mappings for all topics.
 * Usage: node scripts/oracle-review/extract-all.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const scriptDir = __dirname;
const extractedDir = path.join(scriptDir, 'extracted');

console.log('=== Oracle Content Review: Full Extraction ===\n');

// Step 1: Extract questions
console.log('--- Step 1: Extracting Questions ---');
execSync(`node "${path.join(scriptDir, 'extract-questions.js')}" --all`, { stdio: 'inherit' });

// Step 2: Extract lessons
console.log('\n--- Step 2: Extracting Lessons ---');
execSync(`node "${path.join(scriptDir, 'extract-lessons.js')}" --all`, { stdio: 'inherit' });

// Step 3: Extract mappings (depends on questions + lessons being extracted first)
console.log('\n--- Step 3: Extracting Mappings ---');
execSync(`node "${path.join(scriptDir, 'extract-mappings.js')}" --all`, { stdio: 'inherit' });

// Step 4: Generate summary
console.log('\n--- Step 4: Generating Summary ---');

const files = fs.readdirSync(extractedDir).filter(f => f.endsWith('.json'));
const summary = {
  extractedAt: new Date().toISOString(),
  totals: { questions: 0, lessons: 0, subConcepts: 0, screens: 0, mappedQuestions: 0, unmappedQuestions: 0 },
  bySubject: {},
  topics: [],
  visualReviewNeeded: [],
};

files.filter(f => f.startsWith('questions-')).forEach(f => {
  const data = JSON.parse(fs.readFileSync(path.join(extractedDir, f), 'utf-8'));
  const m = data.meta;
  summary.totals.questions += m.questionCount;

  if (!summary.bySubject[m.subject]) summary.bySubject[m.subject] = { questions: 0, lessons: 0, topics: 0 };
  summary.bySubject[m.subject].questions += m.questionCount;
  summary.bySubject[m.subject].topics++;

  if (m.visualComponentCount > 0) {
    summary.visualReviewNeeded.push({ topic: m.topic, subject: m.subject, count: m.visualComponentCount });
  }

  summary.topics.push({
    topic: m.topic,
    subject: m.subject,
    displayName: m.displayName,
    questionCount: m.questionCount,
    difficulty: m.difficultyDistribution,
  });
});

files.filter(f => f.startsWith('lessons-')).forEach(f => {
  const data = JSON.parse(fs.readFileSync(path.join(extractedDir, f), 'utf-8'));
  const m = data.meta;
  summary.totals.lessons += m.lessonCount;
  summary.totals.subConcepts += m.subConceptCount;
  summary.totals.screens += m.screenCount;

  if (summary.bySubject[m.subject]) {
    summary.bySubject[m.subject].lessons += m.lessonCount;
  }

  // Enrich topic entry
  const topicEntry = summary.topics.find(t => t.topic === m.topic && t.subject === m.subject);
  if (topicEntry) {
    topicEntry.lessonCount = m.lessonCount;
    topicEntry.subConceptCount = m.subConceptCount;
  }
});

files.filter(f => f.startsWith('mappings-')).forEach(f => {
  const data = JSON.parse(fs.readFileSync(path.join(extractedDir, f), 'utf-8'));
  summary.totals.mappedQuestions += data.meta.mappedQuestions;
  summary.totals.unmappedQuestions += data.meta.unmappedQuestions;
});

fs.writeFileSync(path.join(extractedDir, 'summary.json'), JSON.stringify(summary, null, 2));

console.log('\n=== Extraction Complete ===');
console.log(`Questions:     ${summary.totals.questions}`);
console.log(`Lessons:       ${summary.totals.lessons}`);
console.log(`Sub-concepts:  ${summary.totals.subConcepts}`);
console.log(`Screens:       ${summary.totals.screens}`);
console.log(`Mapped:        ${summary.totals.mappedQuestions}`);
console.log(`Unmapped:      ${summary.totals.unmappedQuestions}`);
console.log(`Visual review: ${summary.visualReviewNeeded.reduce((s, v) => s + v.count, 0)} items`);
console.log(`\nSummary saved to: ${path.join(extractedDir, 'summary.json')}`);

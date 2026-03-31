#!/usr/bin/env node
/**
 * Aggregate all topic review results into a single summary.
 * Usage: node scripts/oracle-review/aggregate-results.js
 */

const fs = require('fs');
const path = require('path');

const resultsDir = path.join(__dirname, 'results');
const outputFile = path.join(resultsDir, 'summary.json');

const files = fs.readdirSync(resultsDir)
  .filter(f => f.endsWith('.json') && f !== 'summary.json' && f !== 'visual-review-queue.json');

if (files.length === 0) {
  console.log('No results files found. Run Oracle reviews first.');
  process.exit(0);
}

const summary = {
  generatedAt: new Date().toISOString(),
  topicsReviewed: files.length,
  overallQualityScore: 0,
  totalIssues: 0,
  bySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
  byCategory: {},
  bySubject: {},
  topicRankings: [],
  criticalIssues: [],
  highIssues: [],
  allIssues: [],
};

files.forEach(f => {
  const data = JSON.parse(fs.readFileSync(path.join(resultsDir, f), 'utf-8'));
  const subject = data.subject;
  const topic = data.topic;

  // Aggregate quality score
  summary.overallQualityScore += data.qualityScore || 0;

  // Aggregate severity counts
  const sev = data.summary?.bySeverity || {};
  Object.entries(sev).forEach(([level, count]) => {
    summary.bySeverity[level] = (summary.bySeverity[level] || 0) + count;
  });

  // Subject-level aggregation
  if (!summary.bySubject[subject]) {
    summary.bySubject[subject] = { topics: 0, qualityScore: 0, issues: 0, critical: 0, high: 0 };
  }
  summary.bySubject[subject].topics++;
  summary.bySubject[subject].qualityScore += data.qualityScore || 0;
  summary.bySubject[subject].issues += (data.issues || []).length;
  summary.bySubject[subject].critical += sev.critical || 0;
  summary.bySubject[subject].high += sev.high || 0;

  // Topic ranking
  summary.topicRankings.push({
    topic,
    subject,
    displayName: data.summary?.displayName || topic,
    qualityScore: data.qualityScore || 0,
    issues: (data.issues || []).length,
    critical: sev.critical || 0,
    high: sev.high || 0,
    questionsReviewed: data.summary?.questionsReviewed || 0,
    lessonsReviewed: data.summary?.lessonsReviewed || 0,
  });

  // Collect issues
  (data.issues || []).forEach(issue => {
    summary.totalIssues++;
    summary.byCategory[issue.category] = (summary.byCategory[issue.category] || 0) + 1;
    summary.allIssues.push({ ...issue, topic, subject });

    if (issue.severity === 'critical') {
      summary.criticalIssues.push({ ...issue, topic, subject });
    } else if (issue.severity === 'high') {
      summary.highIssues.push({ ...issue, topic, subject });
    }
  });
});

// Compute averages
summary.overallQualityScore = Math.round((summary.overallQualityScore / files.length) * 10) / 10;
Object.values(summary.bySubject).forEach(s => {
  s.qualityScore = Math.round((s.qualityScore / s.topics) * 10) / 10;
});

// Sort topic rankings
summary.topicRankings.sort((a, b) => a.qualityScore - b.qualityScore);

// Don't include allIssues in the summary file (too large) — write separately
const allIssues = summary.allIssues;
delete summary.allIssues;

fs.writeFileSync(outputFile, JSON.stringify(summary, null, 2));
fs.writeFileSync(path.join(resultsDir, 'all-issues.json'), JSON.stringify(allIssues, null, 2));

console.log('=== Oracle Review Summary ===\n');
console.log(`Topics reviewed:   ${summary.topicsReviewed}`);
console.log(`Quality score:     ${summary.overallQualityScore}/10`);
console.log(`Total issues:      ${summary.totalIssues}`);
console.log(`  Critical:        ${summary.bySeverity.critical}`);
console.log(`  High:            ${summary.bySeverity.high}`);
console.log(`  Medium:          ${summary.bySeverity.medium}`);
console.log(`  Low:             ${summary.bySeverity.low}`);

console.log('\nBy subject:');
Object.entries(summary.bySubject).forEach(([subject, data]) => {
  console.log(`  ${subject}: ${data.qualityScore}/10 avg, ${data.issues} issues (${data.critical} critical, ${data.high} high)`);
});

console.log('\nLowest-scoring topics:');
summary.topicRankings.slice(0, 5).forEach(t => {
  console.log(`  ${t.qualityScore}/10 — ${t.topic} (${t.subject}): ${t.issues} issues`);
});

if (summary.criticalIssues.length > 0) {
  console.log('\n🚨 CRITICAL ISSUES:');
  summary.criticalIssues.forEach(i => {
    console.log(`  ${i.issueId}: ${i.title} (${i.topic})`);
  });
}

console.log('\nBy category:');
Object.entries(summary.byCategory)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });

console.log(`\nSaved to: ${outputFile}`);
console.log(`All issues: ${path.join(resultsDir, 'all-issues.json')}`);

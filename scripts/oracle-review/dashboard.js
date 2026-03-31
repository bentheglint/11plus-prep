#!/usr/bin/env node
/**
 * Dashboard showing remaining open issues by severity and topic.
 * Usage: node scripts/oracle-review/dashboard.js
 *        node scripts/oracle-review/dashboard.js --topic percentages
 *        node scripts/oracle-review/dashboard.js --severity critical
 */

const fs = require('fs');
const path = require('path');

const resultsDir = path.join(__dirname, 'results');
const args = process.argv.slice(2);
const filterTopic = args.includes('--topic') ? args[args.indexOf('--topic') + 1] : null;
const filterSeverity = args.includes('--severity') ? args[args.indexOf('--severity') + 1] : null;

// Collect all open issues from all result files
const allIssues = [];
const files = fs.readdirSync(resultsDir)
  .filter(f => f.endsWith('.json') && !['summary.json', 'all-issues.json', 'visual-review-queue.json'].includes(f));

files.forEach(f => {
  const data = JSON.parse(fs.readFileSync(path.join(resultsDir, f), 'utf-8'));
  (data.issues || []).forEach(issue => {
    if (issue.status !== 'fixed' && issue.status !== 'wontfix') {
      allIssues.push({ ...issue, topic: data.topic, subject: data.subject });
    }
  });
});

// Apply filters
let filtered = allIssues;
if (filterTopic) filtered = filtered.filter(i => i.topic === filterTopic);
if (filterSeverity) filtered = filtered.filter(i => i.severity === filterSeverity);

// Display
console.log(`\n=== Oracle Review Dashboard ===`);
console.log(`Open issues: ${filtered.length}${filterTopic ? ` (topic: ${filterTopic})` : ''}${filterSeverity ? ` (severity: ${filterSeverity})` : ''}\n`);

// Group by severity
const bySev = { critical: [], high: [], medium: [], low: [] };
filtered.forEach(i => {
  (bySev[i.severity] || bySev.medium).push(i);
});

['critical', 'high', 'medium', 'low'].forEach(sev => {
  const issues = bySev[sev];
  if (issues.length === 0) return;

  const label = sev === 'critical' ? '🚨 CRITICAL' : sev === 'high' ? '⚠️  HIGH' : sev === 'medium' ? '📋 MEDIUM' : '💡 LOW';
  console.log(`${label} (${issues.length}):`);
  issues.forEach(i => {
    console.log(`  ${i.issueId} [${i.topic}] ${i.title}`);
    if (sev === 'critical' || sev === 'high') {
      console.log(`    → ${i.suggestedFix || i.description?.substring(0, 100)}`);
    }
  });
  console.log('');
});

// Topic summary
if (!filterTopic) {
  console.log('Issues by topic:');
  const topicCounts = {};
  filtered.forEach(i => {
    topicCounts[i.topic] = (topicCounts[i.topic] || 0) + 1;
  });
  Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([topic, count]) => {
      console.log(`  ${topic}: ${count}`);
    });
}

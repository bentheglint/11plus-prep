#!/usr/bin/env node
/**
 * Mark an issue as fixed in its results file.
 * Usage: node scripts/oracle-review/mark-fixed.js MATHS-PCT-Q042-001
 *        node scripts/oracle-review/mark-fixed.js MATHS-PCT-Q042-001 --wontfix
 */

const fs = require('fs');
const path = require('path');

const resultsDir = path.join(__dirname, 'results');
const issueId = process.argv[2];
const wontfix = process.argv.includes('--wontfix');

if (!issueId) {
  console.error('Usage: node mark-fixed.js ISSUE_ID [--wontfix]');
  process.exit(1);
}

const files = fs.readdirSync(resultsDir)
  .filter(f => f.endsWith('.json') && !['summary.json', 'all-issues.json', 'visual-review-queue.json'].includes(f));

let found = false;
files.forEach(f => {
  const filePath = path.join(resultsDir, f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const issue = (data.issues || []).find(i => i.issueId === issueId);
  if (issue) {
    issue.status = wontfix ? 'wontfix' : 'fixed';
    issue.fixedAt = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✓ Marked ${issueId} as ${issue.status} in ${f}`);
    found = true;
  }
});

if (!found) {
  console.error(`Issue ${issueId} not found in any results file.`);
  process.exit(1);
}

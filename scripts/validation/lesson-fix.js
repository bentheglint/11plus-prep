#!/usr/bin/env node
/**
 * lesson-fix.js — Auto-fixer for deterministic lint patterns
 * Reads lint-report.json, applies batch fixes for CHECK-01, CHECK-05, CHECK-07.
 *
 * Run:    node scripts/lesson-fix.js
 * Output: Modified staging files + scripts/fix-report.json
 * Safety: Backs up every modified file to scripts/backups/
 */

const fs = require('fs');
const path = require('path');

const STAGING_DIR = path.join(__dirname, '..', 'src', 'microLessons', 'staging');
const LINT_REPORT = path.join(__dirname, 'lint-report.json');
const FIX_REPORT = path.join(__dirname, 'fix-report.json');
const BACKUP_DIR = path.join(__dirname, 'backups');

// ============================================================
// GLOSSARY — must match lesson-lint.js
// ============================================================

const GLOSSARY = {
  'numerator': 'the top number of a fraction',
  'denominator': 'the bottom number of a fraction',
  'improper fraction': 'a fraction where the top number is bigger than the bottom',
  'mixed number': 'a whole number and a fraction together',
  'common denominator': 'the same bottom number for both fractions',
  'equivalent fraction': 'a fraction with the same value',
  'equivalent fractions': 'fractions with the same value',
  'perimeter': 'the total distance around the outside of a shape',
  'circumference': 'the distance around a circle',
  'diagonal': 'a line from one corner to the opposite corner',
  'vertex': 'a corner point where edges meet',
  'vertices': 'corner points where edges meet',
  'perpendicular': 'lines that meet at a right angle',
  'isosceles': 'a triangle with exactly two equal sides',
  'equilateral': 'a triangle with all three sides equal',
  'scalene': 'a triangle with no equal sides',
  'quotient': 'the answer to a division',
  'remainder': 'the amount left over after dividing',
  'dividend': 'the number being divided',
  'divisor': 'the number you divide by',
  'coefficient': 'the number in front of a letter',
  'consecutive': 'numbers next to each other in order',
  'integer': 'a whole number',
  'composite number': 'a number with more than two factors',
  'cross-section': 'the shape you see when you slice through',
  'capacity': 'how much a container can hold',
  'inverse': 'the opposite operation',
  'substitution': 'replacing a letter with a number',
  'congruent': 'exactly the same shape and size',
  'acute angle': 'an angle less than 90 degrees',
  'obtuse angle': 'an angle between 90 and 180 degrees',
  'reflex angle': 'an angle greater than 180 degrees',
  'right angle': 'an angle of exactly 90 degrees',
  'protractor': 'a tool for measuring angles',
  'frequency': 'how many times something happens',
  'tally': 'a mark used for counting',
  'pictogram': 'a chart that uses pictures to show data',
  'bar chart': 'a chart that uses bars to show data',
};

const ACRONYMS = {
  'HCF': 'Highest Common Factor',
  'LCM': 'Lowest Common Multiple',
  'BIDMAS': 'Brackets, Indices, Division, Multiplication, Addition, Subtraction',
  'BODMAS': 'Brackets, Orders, Division, Multiplication, Addition, Subtraction',
  'LCD': 'Lowest Common Denominator',
  'EJOTY': 'E=5, J=10, O=15, T=20, Y=25',
};

// ============================================================
// BACKUP
// ============================================================

function backupFile(filePath) {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  const fileName = path.basename(filePath);
  const backupPath = path.join(BACKUP_DIR, `${fileName}.bak`);
  // Only create backup once (don't overwrite previous backup)
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
  }
  return backupPath;
}

// ============================================================
// FIX FUNCTIONS
// ============================================================

/**
 * Fix CHECK-01: Insert bracket definition after first occurrence of bare term.
 * Strategy: Find the term in the file text and insert (definition) after it.
 * Only patches the FIRST occurrence in each lesson that doesn't already have a definition.
 */
function fixCheck01(filePath, content, issues) {
  let modified = content;
  const fixes = [];

  // Group issues by lesson to only fix first occurrence per lesson
  const byLesson = {};
  for (const issue of issues) {
    const key = `${issue.subConcept}:${issue.lesson}:${issue.fixData.term}`;
    if (!byLesson[key]) byLesson[key] = issue;
  }

  for (const issue of Object.values(byLesson)) {
    const { term, definition } = issue.fixData;

    // Find first occurrence of the bare term (not already followed by parenthetical)
    // We search within string content (inside backticks or quotes)
    const termEsc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Pattern: the term NOT followed by \s*(
    // We need to be careful to only modify string content, not code
    const re = new RegExp(
      `(\\b${termEsc})(\\b)(?!\\s*\\()`, 'i'
    );

    const match = re.exec(modified);
    if (match) {
      // Verify we're inside a string literal (check for backtick or quote context)
      const before = modified.slice(Math.max(0, match.index - 200), match.index);
      const isInString = isInsideStringLiteral(before, modified, match.index);

      if (isInString) {
        const replacement = `${match[1]} (${definition})${match[2]}`;
        modified = modified.slice(0, match.index) + replacement + modified.slice(match.index + match[0].length);
        fixes.push({
          check: 'CHECK-01',
          term,
          definition,
          subConcept: issue.subConcept,
          lesson: issue.lesson,
        });
      }
    }
  }

  return { modified, fixes };
}

/**
 * Check if a position in source code is inside a string literal.
 * Simplified heuristic: count backticks and quotes before the position.
 */
function isInsideStringLiteral(before, content, pos) {
  // Count unescaped backticks before position
  let backtickCount = 0;
  for (let i = 0; i < pos; i++) {
    if (content[i] === '`' && (i === 0 || content[i - 1] !== '\\')) {
      backtickCount++;
    }
  }
  // Odd count means we're inside a template literal
  if (backtickCount % 2 === 1) return true;

  // Also check for double-quoted strings on the same line
  const lineStart = content.lastIndexOf('\n', pos) + 1;
  const lineContent = content.slice(lineStart, pos);
  let quoteCount = 0;
  for (const ch of lineContent) {
    if (ch === '"') quoteCount++;
  }
  if (quoteCount % 2 === 1) return true;

  return false;
}

/**
 * Fix CHECK-05: Insert acronym expansion after first occurrence.
 */
function fixCheck05(filePath, content, issues) {
  let modified = content;
  const fixes = [];

  const byLesson = {};
  for (const issue of issues) {
    const key = `${issue.subConcept}:${issue.lesson}:${issue.fixData.acronym}`;
    if (!byLesson[key]) byLesson[key] = issue;
  }

  for (const issue of Object.values(byLesson)) {
    const { acronym, expansion } = issue.fixData;

    // Find first occurrence not followed by parenthetical
    const re = new RegExp(`(\\b${acronym}\\b)(?!\\s*\\()`, '');
    const match = re.exec(modified);
    if (match) {
      const isInString = isInsideStringLiteral('', modified, match.index);
      if (isInString) {
        const replacement = `${match[1]} (${expansion})`;
        modified = modified.slice(0, match.index) + replacement + modified.slice(match.index + match[0].length);
        fixes.push({
          check: 'CHECK-05',
          acronym,
          expansion,
          subConcept: issue.subConcept,
          lesson: issue.lesson,
        });
      }
    }
  }

  return { modified, fixes };
}

/**
 * Fix CHECK-07: Insert "and" into mixed number displays.
 * E.g., "3 1/2" → "3 and 1/2"
 */
function fixCheck07(filePath, content, issues) {
  let modified = content;
  const fixes = [];

  // Global replace: \d+ \d+/\d+ where not preceded by "and "
  const re = /(\d+)\s+(\d+\/\d+)/g;
  let match;
  const replacements = [];

  while ((match = re.exec(content)) !== null) {
    const before = content.slice(Math.max(0, match.index - 5), match.index);
    if (/and\s*$/.test(before)) continue;

    // Verify we're in a string
    if (!isInsideStringLiteral('', content, match.index)) continue;

    replacements.push({
      start: match.index,
      end: match.index + match[0].length,
      replacement: `${match[1]} and ${match[2]}`,
    });
  }

  // Apply replacements in reverse order to preserve positions
  for (let i = replacements.length - 1; i >= 0; i--) {
    const r = replacements[i];
    modified = modified.slice(0, r.start) + r.replacement + modified.slice(r.end);
    fixes.push({
      check: 'CHECK-07',
      original: content.slice(r.start, r.end),
      replacement: r.replacement,
    });
  }

  return { modified, fixes };
}

// ============================================================
// MAIN
// ============================================================

function main() {
  console.log('=== Lesson Auto-Fixer ===\n');

  // Read lint report
  if (!fs.existsSync(LINT_REPORT)) {
    console.error('ERROR: lint-report.json not found. Run lesson-lint.js first.');
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(LINT_REPORT, 'utf8'));
  const issues = report.issues.filter(i => i.autoFixable);
  console.log(`Auto-fixable issues: ${issues.length}`);

  // Group by file
  const byFile = {};
  for (const issue of issues) {
    if (!byFile[issue.file]) byFile[issue.file] = [];
    byFile[issue.file].push(issue);
  }

  const allFixes = [];
  const modifiedFiles = [];

  for (const [fileName, fileIssues] of Object.entries(byFile)) {
    const filePath = path.join(STAGING_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      console.error(`  SKIP: ${fileName} not found`);
      continue;
    }

    // Back up
    const backupPath = backupFile(filePath);
    console.log(`  Backed up: ${fileName} -> ${path.basename(backupPath)}`);

    let content = fs.readFileSync(filePath, 'utf8');

    // Apply fixes in order: CHECK-07 first (simple), then CHECK-05, then CHECK-01
    // This order avoids position conflicts since CHECK-01 inserts the most text
    const check07Issues = fileIssues.filter(i => i.id === 'CHECK-07');
    const check05Issues = fileIssues.filter(i => i.id === 'CHECK-05');
    const check01Issues = fileIssues.filter(i => i.id === 'CHECK-01');

    if (check07Issues.length > 0) {
      const result = fixCheck07(filePath, content, check07Issues);
      content = result.modified;
      allFixes.push(...result.fixes);
    }

    if (check05Issues.length > 0) {
      const result = fixCheck05(filePath, content, check05Issues);
      content = result.modified;
      allFixes.push(...result.fixes);
    }

    if (check01Issues.length > 0) {
      const result = fixCheck01(filePath, content, check01Issues);
      content = result.modified;
      allFixes.push(...result.fixes);
    }

    // Write modified file
    const originalContent = fs.readFileSync(filePath, 'utf8');
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      modifiedFiles.push(fileName);
      console.log(`  FIXED: ${fileName} (${fileIssues.length} issues targeted)`);
    } else {
      console.log(`  NO CHANGES: ${fileName} (fixes could not be applied safely)`);
    }
  }

  // Summary
  console.log(`\n=== Fix Summary ===`);
  console.log(`Files modified: ${modifiedFiles.length}`);
  console.log(`Fixes applied: ${allFixes.length}`);

  const byCheck = {};
  for (const fix of allFixes) {
    byCheck[fix.check] = (byCheck[fix.check] || 0) + 1;
  }
  for (const [check, count] of Object.entries(byCheck)) {
    console.log(`  ${check}: ${count} fixes`);
  }

  // Write fix report
  const fixReport = {
    timestamp: new Date().toISOString(),
    filesModified: modifiedFiles,
    totalFixes: allFixes.length,
    byCheck,
    fixes: allFixes,
    backupDir: BACKUP_DIR,
  };

  fs.writeFileSync(FIX_REPORT, JSON.stringify(fixReport, null, 2));
  console.log(`\nFix report written to: ${FIX_REPORT}`);
  console.log(`Backups saved to: ${BACKUP_DIR}/`);
  console.log(`\nRe-run lint to verify: node scripts/lesson-lint.js`);
}

main();

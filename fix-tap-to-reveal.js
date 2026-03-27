#!/usr/bin/env node
/**
 * Fix teach screens missing tap-to-reveal
 *
 * For teach screens that use regular `visual` (not bodyParts):
 *   - Set allRevealed: false in WorkedExample props
 *   - Set interaction: { type: "tap-to-reveal" }
 *
 * For teach screens using bodyParts with WorkedExample allRevealed: true:
 *   - Set allRevealed: false (renderer handles tap-to-reveal for bodyParts automatically)
 */

const fs = require('fs');
const path = require('path');

const stagingDir = path.join(__dirname, 'src', 'microLessons', 'staging');
const files = fs.readdirSync(stagingDir).filter(f => f.endsWith('-subconcepts.js'));

let totalFixed = 0;
let filesFixed = 0;

for (const file of files) {
  const filePath = path.join(stagingDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  let fileFixCount = 0;

  // Pattern 1: teach screens with regular visual + interaction: null
  // Match: type: "teach" ... visual: { component: "WorkedExample" ... allRevealed: true } ... interaction: null
  // We need to change allRevealed: true to false AND interaction: null to { type: "tap-to-reveal" }

  // Strategy: find teach screen blocks and fix them
  // A teach screen block starts with `type: "teach"` and ends at the next `},` + newline + `{` (next screen)

  // Simpler approach: find all `allRevealed: true` on teach screens and fix interaction
  // We'll look for the pattern where we have type: "teach" followed eventually by allRevealed: true and interaction: null

  const lines = content.split('\n');
  let inTeachScreen = false;
  let braceDepth = 0;
  let teachStartLine = -1;
  let screenBraceStart = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect start of a teach screen
    if (line.includes('type: "teach"')) {
      inTeachScreen = true;
      teachStartLine = i;
      // Find the opening brace of this screen object (look backwards)
      for (let j = i; j >= Math.max(0, i - 5); j--) {
        if (lines[j].trim() === '{') {
          screenBraceStart = j;
          break;
        }
      }
    }

    if (inTeachScreen) {
      // Fix allRevealed: true in teach screens (for regular visual, not bodyParts)
      if (line.includes('allRevealed: true') && !line.includes('//')) {
        // Check if this is inside a bodyParts array or a regular visual
        // Look back to see if we're inside bodyParts
        let insideBodyParts = false;
        for (let j = i; j >= Math.max(0, i - 20); j--) {
          if (lines[j].includes('bodyParts')) {
            insideBodyParts = true;
            break;
          }
          if (lines[j].includes('visual:') && !lines[j].includes('bodyParts')) {
            break;
          }
        }

        lines[i] = line.replace('allRevealed: true', 'allRevealed: false');
        fileFixCount++;
      }

      // Fix interaction: null on teach screens (only for regular visual, not bodyParts)
      if (line.trim() === 'interaction: null' || line.trim() === 'interaction: null,') {
        // Check if this teach screen uses bodyParts (bodyParts screens should keep interaction: null)
        let usesBodyParts = false;
        for (let j = teachStartLine; j <= i; j++) {
          if (lines[j].includes('bodyParts')) {
            usesBodyParts = true;
            break;
          }
        }

        if (!usesBodyParts) {
          const comma = line.trim().endsWith(',') ? '' : '';
          const indent = line.match(/^(\s*)/)[1];
          lines[i] = `${indent}interaction: { type: "tap-to-reveal" }`;
          // Preserve trailing comma if present
          if (line.trim().endsWith(',')) {
            // already no comma needed, the original had one
          }
          fileFixCount++;
        }
      }

      // Detect we've moved past this teach screen into the next screen
      if (i > teachStartLine + 2) {
        if (line.includes('type: "interact"') || line.includes('type: "consolidate"') || line.includes('type: "hook"')) {
          inTeachScreen = false;
        }
      }
    }
  }

  if (fileFixCount > 0) {
    content = lines.join('\n');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`${file}: ${fileFixCount} fixes applied`);
    filesFixed++;
    totalFixed += fileFixCount;
  } else {
    console.log(`${file}: no fixes needed`);
  }
}

console.log(`\nTotal: ${totalFixed} fixes across ${filesFixed} files`);

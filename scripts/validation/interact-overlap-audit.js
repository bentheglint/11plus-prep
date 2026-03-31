/**
 * Interact-Overlap Audit Script
 *
 * Detects lessons where the teach screen reveals the exact answer
 * that the interact screen then asks about — making the interact
 * trivially easy because the child just saw the answer.
 *
 * Two detection layers:
 *   1. Direct variable match: teach shows v.answer, interact asks v.answer
 *   2. Value aliasing: teach shows v.codedWord ("ECV"), interact asks
 *      v.correctAnswer ("ECV") — different names, same value in variableSets
 *
 * Output: scripts/interact-overlap-report.json
 */

const fs = require('fs');
const path = require('path');

const STAGING_DIR = path.join(__dirname, '..', 'src', 'microLessons', 'staging');
const OUTPUT_FILE = path.join(__dirname, 'interact-overlap-report.json');

// ─── Helpers ────────────────────────────────────────────────────

/**
 * Extract all v.property references from a string of JS source code.
 * Returns a Set of property names.
 */
function extractVarRefs(text) {
  const refs = new Set();
  if (!text) return refs;
  const re = /v\.(\w+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    refs.add(m[1]);
  }
  return refs;
}

/**
 * Extract what looks like the "answer variable(s)" from a correctAnswer function.
 * E.g. correctAnswer: (v) => v.testResult  → ["testResult"]
 * E.g. correctAnswer: (v) => `${v.answerNum}/${v.denominator}` → ["answerNum", "denominator"]
 * Also handles correctIndex patterns (fill-blank).
 */
function extractInteractAnswerVars(interactionBlock) {
  if (!interactionBlock) return { vars: [], raw: '', type: 'none' };

  // Determine interaction type
  const typeMatch = interactionBlock.match(/type:\s*["']([^"']+)["']/);
  const interactType = typeMatch ? typeMatch[1] : 'unknown';

  // For multiple-choice: look at correctAnswer
  const correctAnswerMatch = interactionBlock.match(/correctAnswer:\s*\(v\)\s*=>\s*([^\n,]+?)(?:,\s*$|\s*$)/m);
  if (correctAnswerMatch) {
    const expr = correctAnswerMatch[1].trim();
    const vars = [];
    const re = /v\.(\w+)/g;
    let m;
    while ((m = re.exec(expr)) !== null) {
      vars.push(m[1]);
    }
    return { vars, raw: expr, type: interactType };
  }

  // For fill-blank: look at correctIndex
  const correctIndexMatch = interactionBlock.match(/correctIndex:\s*\(v\)\s*=>\s*([^\n,]+?)(?:,\s*$|\s*$)/m);
  if (correctIndexMatch) {
    const expr = correctIndexMatch[1].trim();
    const vars = [];
    const re = /v\.(\w+)/g;
    let m;
    while ((m = re.exec(expr)) !== null) {
      vars.push(m[1]);
    }
    return { vars, raw: expr, type: interactType };
  }

  return { vars: [], raw: '', type: interactType };
}

/**
 * Extract variables that are "revealed" in the teach screen.
 * Returns allVars (every v.xxx), resultVars (in result: fields),
 * bodyVars (in body/content/text fields).
 */
function extractTeachRevealedVars(teachBlock) {
  if (!teachBlock) return { allVars: new Set(), resultVars: new Set(), bodyVars: new Set() };

  const allVars = extractVarRefs(teachBlock);

  // Result vars: things inside result: `...${v.xxx}...`
  const resultVars = new Set();
  const resultRe = /result:\s*[`"']([^`"']*?\$\{[^}]*\}[^`"']*?)[`"']/g;
  let m;
  while ((m = resultRe.exec(teachBlock)) !== null) {
    const innerRe = /v\.(\w+)/g;
    let im;
    while ((im = innerRe.exec(m[1])) !== null) {
      resultVars.add(im[1]);
    }
  }
  // Also result: `= ${v.xxx}` or result: fields referencing v.
  const resultRe2 = /result:.*?v\.(\w+)/g;
  while ((m = resultRe2.exec(teachBlock)) !== null) {
    resultVars.add(m[1]);
  }

  // Body vars: things in body/content template literals
  const bodyVars = new Set();
  const bodyRe = /(?:body|content):\s*\(v\)\s*=>\s*[`"']([^]*?)[`"']/g;
  while ((m = bodyRe.exec(teachBlock)) !== null) {
    const innerRe = /v\.(\w+)/g;
    let im;
    while ((im = innerRe.exec(m[1])) !== null) {
      bodyVars.add(im[1]);
    }
  }

  // Also extract from steps text fields
  const stepsTextRe = /text:\s*[`"']([^`"']*?\$\{[^}]*v\.[^}]*\}[^`"']*?)[`"']/g;
  while ((m = stepsTextRe.exec(teachBlock)) !== null) {
    const innerRe = /v\.(\w+)/g;
    let im;
    while ((im = innerRe.exec(m[1])) !== null) {
      bodyVars.add(im[1]);
    }
  }

  // Also look for "why" fields that contain v. references (these reveal info too)
  const whyRe = /why:\s*[`"']([^`"']*?\$\{[^}]*v\.[^}]*\}[^`"']*?)[`"']/g;
  while ((m = whyRe.exec(teachBlock)) !== null) {
    const innerRe = /v\.(\w+)/g;
    let im;
    while ((im = innerRe.exec(m[1])) !== null) {
      bodyVars.add(im[1]);
    }
  }

  // Also look for why: fields with ternary/concat using v.
  const whyRe2 = /why:.*?v\.(\w+)/g;
  while ((m = whyRe2.exec(teachBlock)) !== null) {
    bodyVars.add(m[1]);
  }

  return { allVars, resultVars, bodyVars };
}

// ─── Brace Matching ─────────────────────────────────────────────

/**
 * Find matching brace for an opening brace at position `start`.
 * Handles nested braces, strings (single, double, template), and escaping.
 */
function findMatchingBrace(text, start) {
  let depth = 0;
  let i = start;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;

  while (i < text.length) {
    const ch = text[i];
    const prev = i > 0 ? text[i - 1] : '';

    if (prev === '\\') {
      i++;
      continue;
    }

    if (!inDouble && !inTemplate && ch === "'" && prev !== '\\') {
      inSingle = !inSingle;
    } else if (!inSingle && !inTemplate && ch === '"' && prev !== '\\') {
      inDouble = !inDouble;
    } else if (!inSingle && !inDouble && ch === '`') {
      inTemplate = !inTemplate;
    } else if (!inSingle && !inDouble && !inTemplate) {
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) return i;
      }
    }
    i++;
  }
  return -1;
}

/**
 * Find matching bracket for an opening bracket at position `start`.
 */
function findMatchingBracket(text, start) {
  let depth = 0;
  let i = start;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;

  while (i < text.length) {
    const ch = text[i];
    const prev = i > 0 ? text[i - 1] : '';

    if (prev === '\\') {
      i++;
      continue;
    }

    if (!inDouble && !inTemplate && ch === "'" && prev !== '\\') {
      inSingle = !inSingle;
    } else if (!inSingle && !inTemplate && ch === '"' && prev !== '\\') {
      inDouble = !inDouble;
    } else if (!inSingle && !inDouble && ch === '`') {
      inTemplate = !inTemplate;
    } else if (!inSingle && !inDouble && !inTemplate) {
      if (ch === '[') depth++;
      else if (ch === ']') {
        depth--;
        if (depth === 0) return i;
      }
    }
    i++;
  }
  return -1;
}

// ─── Screen Block Extraction ────────────────────────────────────

/**
 * Extract individual screen blocks from a lesson block.
 * Returns array of { type, source } objects.
 */
function extractScreens(lessonBlock) {
  const screens = [];
  const screensStart = lessonBlock.indexOf('screens:');
  if (screensStart === -1) return screens;

  const screensSection = lessonBlock.slice(screensStart);
  const screenRegex = /\{\s*\n?\s*type:\s*["'](hook|teach|interact|consolidate)["']/g;

  let match;
  while ((match = screenRegex.exec(screensSection)) !== null) {
    const bracePos = screensStart + match.index;
    const endBrace = findMatchingBrace(lessonBlock, bracePos);
    if (endBrace !== -1) {
      screens.push({
        type: match[1],
        source: lessonBlock.slice(bracePos, endBrace + 1)
      });
    }
  }

  return screens;
}

// ─── Lesson Block Extraction ────────────────────────────────────

function extractLessons(fileContent) {
  const lessons = [];
  const lessonIdRegex = /\{\s*\n?\s*id:\s*["']([^"']+)["']\s*,\s*\n?\s*templateType:/g;

  let match;
  while ((match = lessonIdRegex.exec(fileContent)) !== null) {
    const bracePos = match.index;
    const endBrace = findMatchingBrace(fileContent, bracePos);
    if (endBrace !== -1) {
      const lessonBlock = fileContent.slice(bracePos, endBrace + 1);
      if (lessonBlock.includes('screens:')) {
        lessons.push({
          id: match[1],
          source: lessonBlock
        });
      }
    }
  }

  return lessons;
}

function findSubConceptForLesson(fileContent, lessonId) {
  const lessonPos = fileContent.indexOf(`id: "${lessonId}"`);
  if (lessonPos === -1) return 'unknown';

  const subConceptRegex = /\{\s*\n?\s*id:\s*["']([^"']+)["']\s*,\s*\n?\s*name:\s*["']([^"']+)["']\s*,\s*\n?\s*category:/g;

  let bestMatch = null;
  let bestPos = -1;
  let m;
  while ((m = subConceptRegex.exec(fileContent)) !== null) {
    if (m.index < lessonPos && m.index > bestPos) {
      bestMatch = m[1];
      bestPos = m.index;
    }
  }

  return bestMatch || 'unknown';
}

// ─── Variable Value Aliasing ────────────────────────────────────

/**
 * Parse the first variableSet from a lesson block to build a map of
 * variable name -> literal value. Used to detect when different variable
 * names hold the same value (e.g. codedWord: "ECV" and correctAnswer: "ECV").
 *
 * Returns { valueToVars: Map<string, string[]>, varToValue: Map<string, string> }
 */
function parseFirstVariableSet(lessonBlock) {
  const valueToVars = new Map(); // value string -> [var names]
  const varToValue = new Map();  // var name -> value string

  // Find variableSets: [
  const vsStart = lessonBlock.indexOf('variableSets:');
  if (vsStart === -1) return { valueToVars, varToValue };

  // Find the opening [ of the array
  const bracketStart = lessonBlock.indexOf('[', vsStart);
  if (bracketStart === -1) return { valueToVars, varToValue };

  // Find the first { in the array (first variableSet object)
  const firstObjStart = lessonBlock.indexOf('{', bracketStart);
  if (firstObjStart === -1) return { valueToVars, varToValue };

  const firstObjEnd = findMatchingBrace(lessonBlock, firstObjStart);
  if (firstObjEnd === -1) return { valueToVars, varToValue };

  const vsBlock = lessonBlock.slice(firstObjStart, firstObjEnd + 1);

  // Parse simple key: value pairs using regex
  // Handles: key: "string", key: 123, key: true/false
  const pairRe = /(\w+):\s*(?:"([^"]*?)"|'([^']*?)'|(\d+(?:\.\d+)?)|(\btrue\b|\bfalse\b))/g;
  let m;
  while ((m = pairRe.exec(vsBlock)) !== null) {
    const varName = m[1];
    const value = m[2] !== undefined ? m[2] :
                  m[3] !== undefined ? m[3] :
                  m[4] !== undefined ? m[4] :
                  m[5] !== undefined ? m[5] : null;

    if (value !== null) {
      varToValue.set(varName, value);
      if (!valueToVars.has(value)) {
        valueToVars.set(value, []);
      }
      valueToVars.get(value).push(varName);
    }
  }

  return { valueToVars, varToValue };
}

/**
 * Given interact answer variable names and a variableSet alias map,
 * find all other variable names that hold the same value.
 * Returns a Set of alias variable names.
 */
function findValueAliases(answerVars, aliasMap) {
  const aliases = new Set();
  for (const varName of answerVars) {
    const value = aliasMap.varToValue.get(varName);
    if (value !== undefined) {
      const sameValueVars = aliasMap.valueToVars.get(value) || [];
      for (const alias of sameValueVars) {
        if (alias !== varName) {
          aliases.add(alias);
        }
      }
    }
  }
  return aliases;
}

// ─── Classification Logic ───────────────────────────────────────

/**
 * Variables that are purely contextual/cosmetic and don't represent answers.
 */
const CONTEXT_VARS = new Set([
  'name', 'scenario', 'unit', 'dimUnit', 'colour', 'color',
  'contextPhrase', 'total',
]);

/**
 * Extract the interaction: { ... } block from a screen source.
 */
function extractInteractionBlock(screenSource) {
  const interactionStart = screenSource.search(/interaction:\s*\{/);
  if (interactionStart === -1) return null;

  const braceStart = screenSource.indexOf('{', interactionStart);
  if (braceStart === -1) return null;

  const braceEnd = findMatchingBrace(screenSource, braceStart);
  if (braceEnd === -1) return null;

  return screenSource.slice(braceStart, braceEnd + 1);
}

/**
 * Classify a lesson as SAME, DIFFERENT, or NO_INTERACT.
 */
function classifyLesson(lessonSource) {
  const screens = extractScreens(lessonSource);

  const teachScreen = screens.find(s => s.type === 'teach');
  const interactScreen = screens.find(s => s.type === 'interact');

  if (!interactScreen) {
    return { classification: 'NO_INTERACT', reason: 'No interact screen found' };
  }

  // Extract the interaction block from the interact screen
  const interactInteraction = extractInteractionBlock(interactScreen.source);
  const interactAnswer = extractInteractAnswerVars(interactInteraction);

  if (interactAnswer.vars.length === 0) {
    if (!interactInteraction || interactInteraction.includes('interaction: null')) {
      return { classification: 'NO_INTERACT', reason: 'Interact screen has no interaction' };
    }
    return { classification: 'NO_INTERACT', reason: 'correctAnswer does not reference variables', interactType: interactAnswer.type };
  }

  if (!teachScreen) {
    return { classification: 'DIFFERENT', reason: 'No teach screen found', interactVars: interactAnswer.vars };
  }

  // Extract what the teach screen reveals
  const teachRevealed = extractTeachRevealedVars(teachScreen.source);

  // Filter out purely contextual variables
  const answerVars = interactAnswer.vars.filter(v => !CONTEXT_VARS.has(v));

  if (answerVars.length === 0) {
    return { classification: 'DIFFERENT', reason: 'Interact answer uses only contextual variables' };
  }

  // ── Layer 1: Direct variable name match ──
  const directOverlap = answerVars.filter(v => teachRevealed.allVars.has(v));
  const inResultOrBody = answerVars.filter(v =>
    teachRevealed.resultVars.has(v) || teachRevealed.bodyVars.has(v)
  );

  if (inResultOrBody.length > 0) {
    return {
      classification: 'SAME',
      reason: `Teach reveals answer variable(s) in body/result: ${inResultOrBody.join(', ')}`,
      teachAnswer: inResultOrBody.join(', '),
      interactAnswer: interactAnswer.raw,
      interactType: interactAnswer.type,
      overlapVars: inResultOrBody,
      method: 'direct'
    };
  }

  if (directOverlap.length > 0) {
    return {
      classification: 'SAME',
      reason: `Teach screen uses same answer variable(s): ${directOverlap.join(', ')}`,
      teachAnswer: directOverlap.join(', '),
      interactAnswer: interactAnswer.raw,
      interactType: interactAnswer.type,
      overlapVars: directOverlap,
      method: 'direct'
    };
  }

  // ── Layer 2: Value aliasing ──
  // Parse the variableSets to find if the interact's answer variable
  // has the same literal value as a variable the teach screen displays
  const aliasMap = parseFirstVariableSet(lessonSource);
  const aliases = findValueAliases(answerVars, aliasMap);

  if (aliases.size > 0) {
    // Check if any of these aliases are shown in the teach screen
    const aliasesInTeach = [...aliases].filter(a =>
      teachRevealed.allVars.has(a)
    );
    const aliasesInResultOrBody = [...aliases].filter(a =>
      teachRevealed.resultVars.has(a) || teachRevealed.bodyVars.has(a)
    );

    if (aliasesInResultOrBody.length > 0) {
      // Build the alias explanation
      const aliasDetail = answerVars.map(av => {
        const val = aliasMap.varToValue.get(av);
        const matchingAliases = aliasesInResultOrBody.filter(a => aliasMap.varToValue.get(a) === val);
        return matchingAliases.length > 0 ? `v.${av} = v.${matchingAliases.join(',')} (both = "${val}")` : null;
      }).filter(Boolean);

      return {
        classification: 'SAME',
        reason: `Value alias: teach shows ${aliasesInResultOrBody.join(', ')} which = same value as interact's ${answerVars.join(', ')}`,
        teachAnswer: aliasesInResultOrBody.join(', '),
        interactAnswer: interactAnswer.raw,
        interactType: interactAnswer.type,
        overlapVars: answerVars,
        aliasedVars: aliasesInResultOrBody,
        aliasDetail,
        method: 'alias'
      };
    }

    if (aliasesInTeach.length > 0) {
      const aliasDetail = answerVars.map(av => {
        const val = aliasMap.varToValue.get(av);
        const matchingAliases = aliasesInTeach.filter(a => aliasMap.varToValue.get(a) === val);
        return matchingAliases.length > 0 ? `v.${av} = v.${matchingAliases.join(',')} (both = "${val}")` : null;
      }).filter(Boolean);

      return {
        classification: 'SAME',
        reason: `Value alias: teach uses ${aliasesInTeach.join(', ')} which = same value as interact's ${answerVars.join(', ')}`,
        teachAnswer: aliasesInTeach.join(', '),
        interactAnswer: interactAnswer.raw,
        interactType: interactAnswer.type,
        overlapVars: answerVars,
        aliasedVars: aliasesInTeach,
        aliasDetail,
        method: 'alias'
      };
    }
  }

  return {
    classification: 'DIFFERENT',
    reason: 'Interact answer variables not shown in teach screen (checked direct + alias)',
    interactVars: answerVars,
    interactType: interactAnswer.type
  };
}

// ─── Main ───────────────────────────────────────────────────────

function main() {
  const files = fs.readdirSync(STAGING_DIR)
    .filter(f => f.endsWith('-subconcepts.js'))
    .sort();

  console.log(`Found ${files.length} staging files\n`);

  const report = {
    summary: { same: 0, different: 0, noInteract: 0, total: 0, sameByDirect: 0, sameByAlias: 0 },
    byFile: {},
    sameDetails: []
  };

  for (const file of files) {
    const filePath = path.join(STAGING_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');

    const lessons = extractLessons(content);
    const fileSummary = { same: 0, different: 0, noInteract: 0, lessons: lessons.length };

    for (const lesson of lessons) {
      const subConcept = findSubConceptForLesson(content, lesson.id);
      const result = classifyLesson(lesson.source);

      report.summary.total++;

      switch (result.classification) {
        case 'SAME':
          report.summary.same++;
          fileSummary.same++;
          if (result.method === 'alias') report.summary.sameByAlias++;
          else report.summary.sameByDirect++;
          report.sameDetails.push({
            file,
            subConcept,
            lessonId: lesson.id,
            teachAnswer: result.teachAnswer,
            interactAnswer: result.interactAnswer,
            interactType: result.interactType || 'multiple-choice',
            overlapVars: result.overlapVars,
            method: result.method,
            aliasedVars: result.aliasedVars || null,
            aliasDetail: result.aliasDetail || null,
            reason: result.reason
          });
          break;
        case 'DIFFERENT':
          report.summary.different++;
          fileSummary.different++;
          break;
        case 'NO_INTERACT':
          report.summary.noInteract++;
          fileSummary.noInteract++;
          break;
      }
    }

    report.byFile[file] = fileSummary;
  }

  // Write report
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));

  // Print summary
  console.log('═══════════════════════════════════════════════════════');
  console.log('         INTERACT-OVERLAP AUDIT SUMMARY');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Total lessons analysed:  ${report.summary.total}`);
  console.log(`SAME (teach reveals answer):  ${report.summary.same}  (${(report.summary.same / report.summary.total * 100).toFixed(1)}%)`);
  console.log(`  └─ by direct variable match:  ${report.summary.sameByDirect}`);
  console.log(`  └─ by value aliasing:         ${report.summary.sameByAlias}`);
  console.log(`DIFFERENT (genuine challenge):  ${report.summary.different}  (${(report.summary.different / report.summary.total * 100).toFixed(1)}%)`);
  console.log(`NO_INTERACT (no quiz/answer):  ${report.summary.noInteract}  (${(report.summary.noInteract / report.summary.total * 100).toFixed(1)}%)`);
  console.log('═══════════════════════════════════════════════════════');

  console.log('\n── By File (sorted by overlap %) ───────────────────');
  const sortedFiles = Object.entries(report.byFile)
    .map(([file, data]) => {
      const activeLessons = data.same + data.different;
      const pct = activeLessons > 0 ? (data.same / activeLessons) * 100 : 0;
      return [file, data, pct];
    })
    .sort((a, b) => b[2] - a[2]);

  for (const [file, data, pct] of sortedFiles) {
    if (data.same > 0 || data.different > 0) {
      console.log(`  ${file.padEnd(45)} ${String(data.same).padStart(2)} SAME / ${String(data.different).padStart(2)} DIFF / ${String(data.noInteract).padStart(2)} NONE  (${pct.toFixed(0).padStart(3)}% overlap)`);
    }
  }

  // Print files with 0% overlap
  console.log('\n── Files with 0% overlap (clean) ───────────────────');
  for (const [file, data, pct] of sortedFiles) {
    if (data.same === 0 && data.different > 0) {
      console.log(`  ${file.padEnd(45)} ${String(data.different).padStart(2)} lessons, all DIFFERENT`);
    }
  }

  console.log(`\nFull report: ${OUTPUT_FILE}`);
  console.log(`SAME details: ${report.sameDetails.length} entries`);
  console.log(`  ${report.sameDetails.filter(d => d.method === 'direct').length} by direct match, ${report.sameDetails.filter(d => d.method === 'alias').length} by value alias`);
}

main();

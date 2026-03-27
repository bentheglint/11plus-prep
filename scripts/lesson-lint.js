#!/usr/bin/env node
/**
 * lesson-lint.js — Automated QA for micro-lesson staging files
 * Reads 37 staging files as raw text. Applies 14 rule checks.
 * Run:    node scripts/lesson-lint.js
 * Output: scripts/lint-report.json
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// CONFIGURATION
// ============================================================

const STAGING_DIR = path.join(__dirname, '..', 'src', 'microLessons', 'staging');
const OUTPUT_FILE = path.join(__dirname, 'lint-report.json');

// Topics where visual components should appear on hook/teach
const VISUAL_TOPICS = new Set([
  'volume', 'anglesshapes', 'areaperimeter', 'datahandling',
  'longdivision', 'longmultiplication'
]);

const ENGLISH_TOPICS = new Set([
  'antonyms', 'compoundwords', 'comprehension', 'grammar',
  'punctuation', 'spelling', 'synonyms', 'vocabulary', 'wordclass'
]);

const VR_TOPICS = new Set([
  'hiddenwords', 'lettercodes', 'lettermove', 'letterpairseries',
  'lettersums', 'logicandlanguage', 'missingletterswords',
  'numberseries', 'numberwordcodes', 'oddtwoout', 'sharedletter',
  'verbalanalogies', 'wordcodeanalogies'
]);

function getSubject(topicKey) {
  if (ENGLISH_TOPICS.has(topicKey)) return 'english';
  if (VR_TOPICS.has(topicKey)) return 'vr';
  return 'maths';
}

// Components restricted to specific topics (unlisted = allowed anywhere)
const COMPONENT_ALLOWED = {
  'CuboidDiagram': ['volume'],
  'AngleDiagram': ['anglesshapes'],
  'RectangleDiagram': ['areaperimeter'],
  'LShapeDiagram': ['areaperimeter'],
  'SDTTriangle': ['speeddistancetime'],
  'BusStopDiagram': ['longdivision'],
  'ColumnMethod': ['longmultiplication', 'longdivision'],
  'SentenceDisplay': [...ENGLISH_TOPICS, 'logicandlanguage', 'oddtwoout'],
  'LetterTiles': [...VR_TOPICS, 'compoundwords'],
  'AlphabetLine': [...VR_TOPICS],
  'CodeTable': ['lettercodes', 'numberwordcodes', 'wordcodeanalogies', 'lettersums'],
  'AnalogyDisplay': ['verbalanalogies', 'wordcodeanalogies', 'oddtwoout', 'antonyms', 'synonyms'],
};

// Technical terms needing bracket definitions for a 9-year-old audience
// Key = term (lowercase), Value = suggested bracket definition
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

// Acronyms needing expansion
const ACRONYMS = {
  'HCF': 'Highest Common Factor',
  'LCM': 'Lowest Common Multiple',
  'BIDMAS': 'Brackets, Indices, Division, Multiplication, Addition, Subtraction',
  'BODMAS': 'Brackets, Orders, Division, Multiplication, Addition, Subtraction',
  'LCD': 'Lowest Common Denominator',
  'EJOTY': 'E=5, J=10, O=15, T=20, Y=25',
};

// Algebraic patterns that shouldn't appear outside algebra/formula topics
const ALGEBRA_EXEMPT_TOPICS = new Set([
  'algebra', 'areaperimeter', 'volume', 'speeddistancetime', 'sequences',
  'anglesshapes', 'primenumbersfactors'
]);

// ============================================================
// TEXT UTILITIES
// ============================================================

/** Strip ${...} expressions from template literals, replacing with ___ */
function stripTemplateExprs(text) {
  let result = '';
  let i = 0;
  while (i < text.length) {
    if (text[i] === '$' && i + 1 < text.length && text[i + 1] === '{') {
      result += '___';
      i += 2;
      let depth = 1;
      while (i < text.length && depth > 0) {
        if (text[i] === '{') depth++;
        else if (text[i] === '}') depth--;
        i++;
      }
    } else {
      result += text[i];
      i++;
    }
  }
  return result;
}

/** Clean extracted text for analysis */
function cleanText(text) {
  return text
    .replace(/\\n/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\\\\/g, '\\')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extract all readable text from source lines (template literals + quoted strings) */
function extractTextFromLines(lines) {
  const joined = lines.join('\n');
  const texts = [];

  // Extract template literal contents
  const templateRe = /`([^`]*)`/gs;
  let m;
  while ((m = templateRe.exec(joined)) !== null) {
    const cleaned = cleanText(stripTemplateExprs(m[1]));
    if (cleaned.length > 2) texts.push(cleaned);
  }

  // Extract double-quoted strings (skip short property names)
  const doubleRe = /"((?:[^"\\]|\\.)*)"/g;
  while ((m = doubleRe.exec(joined)) !== null) {
    if (m[1].length > 10) texts.push(cleanText(m[1]));
  }

  return texts;
}

// ============================================================
// PARSER — Extract structured data from staging files
// ============================================================

function parseFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const fileName = path.basename(filePath);
  const topicKey = fileName.replace('-subconcepts.js', '');

  // Pass 1: Find sub-concept markers
  const subConceptStarts = [];
  for (let i = 0; i < lines.length; i++) {
    const idMatch = lines[i].match(/^\s*id:\s*"([^"]+)"/);
    if (!idMatch) continue;
    // Look ahead for name + category (within 5 lines)
    let hasName = false, hasCat = false;
    let name = '', category = '';
    for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
      const nm = lines[j].match(/^\s*name:\s*"([^"]+)"/);
      if (nm) { hasName = true; name = nm[1]; }
      const cm = lines[j].match(/^\s*category:\s*"([^"]+)"/);
      if (cm) { hasCat = true; category = cm[1]; }
    }
    if (hasName && hasCat) {
      subConceptStarts.push({ line: i, id: idMatch[1], name, category });
    }
  }

  // Pass 2: Find lesson markers (id + templateType)
  const lessonStarts = [];
  for (let i = 0; i < lines.length; i++) {
    const idMatch = lines[i].match(/^\s*id:\s*"([^"]+)"/);
    if (!idMatch) continue;
    for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
      const tm = lines[j].match(/^\s*templateType:\s*"([^"]+)"/);
      if (tm) {
        lessonStarts.push({ line: i, id: idMatch[1], templateType: tm[1] });
        break;
      }
    }
  }

  // Pass 3: Find screen markers
  const screenStarts = [];
  for (let i = 0; i < lines.length; i++) {
    const sm = lines[i].match(/^\s*type:\s*"(hook|teach|interact|consolidate)"/);
    if (sm) {
      screenStarts.push({ line: i, type: sm[1] });
    }
  }

  // Pass 4: Find learningGoal arrays for each lesson
  const learningGoals = {};
  for (const lesson of lessonStarts) {
    const goals = [];
    for (let i = lesson.line; i < Math.min(lesson.line + 20, lines.length); i++) {
      if (/learningGoal:\s*\[/.test(lines[i])) {
        for (let j = i; j < Math.min(i + 15, lines.length); j++) {
          const gm = lines[j].match(/"([^"]+)"/g);
          if (gm) gm.forEach(g => goals.push(g.replace(/"/g, '')));
          if (lines[j].includes(']')) break;
        }
        break;
      }
    }
    learningGoals[lesson.line] = goals;
  }

  // Pass 5: Count variableSets for each lesson
  const varSetCounts = {};
  for (const lesson of lessonStarts) {
    let count = 0;
    let inVarSets = false;
    let depth = 0;
    for (let i = lesson.line; i < lines.length; i++) {
      if (/variableSets:\s*\[/.test(lines[i])) {
        inVarSets = true;
        depth = 0;
        continue;
      }
      if (inVarSets) {
        for (const ch of lines[i]) {
          if (ch === '{') { depth++; if (depth === 1) count++; }
          if (ch === '}') depth--;
        }
        if (/^\s*\],?\s*$/.test(lines[i]) && depth <= 0) break;
      }
      // Stop if we hit screens
      if (/screens:\s*\[/.test(lines[i])) break;
    }
    varSetCounts[lesson.line] = count;
  }

  // Build hierarchy
  const subConcepts = subConceptStarts.map((sc, scIdx) => {
    const scEnd = scIdx + 1 < subConceptStarts.length
      ? subConceptStarts[scIdx + 1].line : lines.length;

    const lessons = lessonStarts
      .filter(l => l.line > sc.line && l.line < scEnd)
      .map((lesson, lIdx, allLessons) => {
        const lEnd = lIdx + 1 < allLessons.length
          ? allLessons[lIdx + 1].line : scEnd;

        const screens = screenStarts
          .filter(s => s.line > lesson.line && s.line < lEnd)
          .map((screen, sIdx, allScreens) => {
            const sEnd = sIdx + 1 < allScreens.length
              ? allScreens[sIdx + 1].line : lEnd;
            const screenLines = lines.slice(screen.line, sEnd);
            const screenSource = screenLines.join('\n');

            // Extract visual component
            const visMatch = screenSource.match(/component:\s*"(\w+)"/);
            const hasNullVisual = /visual:\s*null/.test(screenSource);
            const hasVisual = visMatch !== null;

            // Extract interaction info
            const intTypeMatch = screenSource.match(/interaction:\s*\{\s*[^}]*type:\s*"([^"]+)"/s);
            const hasNullInteraction = /interaction:\s*null/.test(screenSource);
            const interactionType = intTypeMatch ? intTypeMatch[1] : null;
            const hasInteraction = intTypeMatch !== null;

            // Extract interaction fields
            const hasCorrectIndex = /correctIndex:/.test(screenSource);
            const hasOptions = /\boptions:/.test(screenSource);
            const hasGetOptions = /getOptions:/.test(screenSource);
            const hasCorrectAnswer = /correctAnswer:/.test(screenSource);
            const hasPairs = /\bpairs:/.test(screenSource);
            const hasSteps = /\bsteps:/.test(screenSource);
            const hasStatements = /\bstatements:/.test(screenSource);
            const hasFeedback = /feedback:\s*\{/.test(screenSource);
            const hasCorrectFeedback = /correct:\s*\(/.test(screenSource);
            const hasIncorrectFeedback = /incorrect:\s*\(/.test(screenSource);
            const hasSentence = /\bsentence:/.test(screenSource);
            const hasQuestion = /\bquestion:/.test(screenSource);

            // Extract step texts for analysis (both cleaned and raw)
            // Use separate patterns for backtick, double-quote, and single-quote delimiters
            // to avoid truncation at embedded quotes
            const stepTexts = [];
            const stepTextsRaw = [];
            const stepResults = [];
            const stepPatterns = [
              /text:\s*`([^`]*)`/g,         // backtick-delimited (may contain quotes)
              /text:\s*"([^"]*)"/g,          // double-quote delimited
              /text:\s*'([^']*)'/g           // single-quote delimited
            ];
            let sm2;
            for (const stepRe of stepPatterns) {
              while ((sm2 = stepRe.exec(screenSource)) !== null) {
                const cleaned = cleanText(stripTemplateExprs(sm2[1]));
                // Avoid duplicates from overlapping patterns
                if (cleaned.length > 2 && !stepTextsRaw.includes(sm2[1])) {
                  stepTexts.push(cleaned);
                  stepTextsRaw.push(sm2[1]);
                }
              }
            }
            const resultPatterns = [
              /result:\s*`([^`]*)`/g,
              /result:\s*"([^"]*)"/g,
              /result:\s*'([^']*)'/g
            ];
            for (const resultRe of resultPatterns) {
              while ((sm2 = resultRe.exec(screenSource)) !== null) {
                const cleaned = cleanText(stripTemplateExprs(sm2[1]));
                if (cleaned.length > 0) stepResults.push(cleaned);
              }
            }

            // Extract match-pairs right values
            const rightValues = [];
            const rightRe = /right:\s*"([^"]+)"/g;
            while ((sm2 = rightRe.exec(screenSource)) !== null) {
              rightValues.push(sm2[1]);
            }

            // Detect bodyParts (alternative to body — interleaved text + visuals)
            const hasBodyParts = /bodyParts\s*:/.test(screenSource);

            // Extract visual components from bodyParts
            const bodyPartsVisuals = [];
            if (hasBodyParts) {
              const bpCompRe = /component:\s*["'](\w+)["']/g;
              let bpM;
              while ((bpM = bpCompRe.exec(screenSource)) !== null) {
                bodyPartsVisuals.push(bpM[1]);
              }
            }

            // Has v. references in body OR bodyParts
            const bodyMatch = screenSource.match(/body:\s*\([^)]*\)\s*=>\s*`([^`]*)`/s);
            const bodyText = bodyMatch ? cleanText(stripTemplateExprs(bodyMatch[1])) : '';
            const bodyHasVarRef = bodyMatch ? /\$\{v\./.test(bodyMatch[0]) : false;
            const bodyPartsHasVarRef = hasBodyParts && /\$\{v\./.test(screenSource);

            // All text content for this screen
            const textContent = extractTextFromLines(screenLines);

            return {
              type: screen.type,
              lineStart: screen.line + 1, // 1-indexed
              lineEnd: sEnd,
              hasVisual: hasVisual || bodyPartsVisuals.length > 0,
              hasNullVisual: hasNullVisual && !hasBodyParts,
              hasBodyParts,
              bodyPartsVisuals,
              visualComponent: visMatch ? visMatch[1] : (bodyPartsVisuals[0] || null),
              hasInteraction,
              hasNullInteraction,
              interactionType,
              interactionFields: {
                hasCorrectIndex, hasOptions, hasGetOptions, hasCorrectAnswer,
                hasPairs, hasSteps, hasStatements, hasFeedback,
                hasCorrectFeedback, hasIncorrectFeedback, hasSentence, hasQuestion
              },
              stepTexts,
              stepTextsRaw,
              stepResults,
              rightValues,
              bodyText,
              bodyHasVarRef: bodyHasVarRef || bodyPartsHasVarRef,
              textContent,
              sourceLines: screenLines,
            };
          });

        return {
          id: lesson.id,
          templateType: lesson.templateType,
          lineStart: lesson.line + 1,
          learningGoal: learningGoals[lesson.line] || [],
          variableSetCount: varSetCounts[lesson.line] || 0,
          screens,
        };
      });

    return {
      id: sc.id,
      name: sc.name,
      category: sc.category,
      lineStart: sc.line + 1,
      lessons,
    };
  });

  return { file: fileName, topicKey, subConcepts, lineCount: lines.length };
}

// ============================================================
// CHECK FUNCTIONS — Each returns an array of issues
// ============================================================

function makeIssue(checkId, severity, file, topicKey, scId, lessonId, screenType, line, message, autoFixable, fixData) {
  return {
    id: checkId, severity, file, topicKey,
    subConcept: scId, lesson: lessonId,
    screen: screenType, line, message,
    autoFixable: autoFixable || false,
    fixData: fixData || null,
  };
}

/** CHECK-01: Unexplained technical terms (glossary-driven) */
function check01(fileData) {
  const issues = [];
  if (getSubject(fileData.topicKey) !== 'maths') return issues;

  for (const sc of fileData.subConcepts) {
    for (const lesson of sc.lessons) {
      // Collect ALL text across the lesson
      const allText = lesson.screens.flatMap(s => s.textContent).join(' ').toLowerCase();

      for (const [term, definition] of Object.entries(GLOSSARY)) {
        // Check if term appears at all
        const termRe = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (!termRe.test(allText)) continue;

        // Check if term has a bracket definition anywhere in the lesson
        const defRe = new RegExp(
          `\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\([^)]{5,}\\)`, 'i'
        );
        if (defRe.test(allText)) continue;

        // Find which screen first uses the term (for line reference)
        let foundScreen = null;
        for (const screen of lesson.screens) {
          const screenText = screen.textContent.join(' ').toLowerCase();
          if (termRe.test(screenText)) { foundScreen = screen; break; }
        }

        issues.push(makeIssue(
          'CHECK-01', 'P0', fileData.file, fileData.topicKey,
          sc.id, lesson.id, foundScreen?.type || 'unknown',
          foundScreen?.lineStart || lesson.lineStart,
          `Bare term '${term}' used without bracket definition (suggest: '${term} (${definition})')`,
          true,
          { term, definition, subConcept: sc.id, lesson: lesson.id }
        ));
      }
    }
  }
  return issues;
}

/** CHECK-02: Teach body has no variable references when hook does */
function check02(fileData) {
  const issues = [];
  for (const sc of fileData.subConcepts) {
    for (const lesson of sc.lessons) {
      const hookScreen = lesson.screens.find(s => s.type === 'hook');
      const teachScreen = lesson.screens.find(s => s.type === 'teach');
      if (!hookScreen || !teachScreen) continue;
      // Only flag if teach body is short AND has no variable refs (long bodies are likely substantive)
      // Skip if teach uses bodyParts (vars are in bodyParts content functions, not body)
      if (hookScreen.bodyHasVarRef && !teachScreen.bodyHasVarRef && !teachScreen.hasBodyParts && teachScreen.bodyText.length < 120) {
        issues.push(makeIssue(
          'CHECK-02', 'P1', fileData.file, fileData.topicKey,
          sc.id, lesson.id, 'teach', teachScreen.lineStart,
          'Teach body has no ${v.} variable references but hook does — teach may not personalise with scenario'
        ));
      }
    }
  }
  return issues;
}

/** CHECK-03: Steps missing full working (text has no arithmetic but result has a number) */
function check03(fileData) {
  const issues = [];
  for (const sc of fileData.subConcepts) {
    for (const lesson of sc.lessons) {
      for (const screen of lesson.screens) {
        if (screen.stepTexts.length === 0) continue;
        for (let i = 0; i < screen.stepTexts.length; i++) {
          const text = screen.stepTexts[i];
          const result = screen.stepResults[i] || '';
          // Flag if step text has no arithmetic operators but result has a number
          const rawText = screen.stepTextsRaw[i] || '';
          const hasArithmetic = /[\+\-×÷\*\/=]/.test(text) || /\d+\s*[\+\-×÷\*\/]\s*\d+/.test(text);
          const hasTemplateVars = /\$\{v\./.test(rawText); // template vars likely contain working
          const resultHasNumber = /\d{2,}/.test(result);
          if (!hasArithmetic && !hasTemplateVars && resultHasNumber && !text.toLowerCase().includes('volume') && !text.toLowerCase().includes('area')) {
            issues.push(makeIssue(
              'CHECK-03', 'P0', fileData.file, fileData.topicKey,
              sc.id, lesson.id, screen.type, screen.lineStart,
              `Step "${text.slice(0, 60)}..." jumps to result "${result}" without showing working`
            ));
          }
        }
      }
    }
  }
  return issues;
}

/** CHECK-04: Algebraic notation outside algebra/formula topics */
function check04(fileData) {
  const issues = [];
  if (ALGEBRA_EXEMPT_TOPICS.has(fileData.topicKey)) return issues;
  if (getSubject(fileData.topicKey) !== 'maths') return issues;

  const algebraPatterns = [
    { re: /\b\d+(?![spmgldft])[a-z]\b/, desc: 'coefficient notation (e.g. 3n)' },  // excludes unit suffixes: s(seconds), p(pence), m(metres), g(grams), l(litres), d(days), f(feet), t(tonnes)
    { re: /\b[a-z]\s*[²³]/, desc: 'power notation (e.g. n²)' },
    { re: /\b[A-Z]\s*=\s*\d*\s*\(?\s*[a-z]\s*[\+\-]/, desc: 'formula with letters (e.g. P = 2(l+w))' },
  ];

  for (const sc of fileData.subConcepts) {
    for (const lesson of sc.lessons) {
      for (const screen of lesson.screens) {
        const allText = screen.textContent.join(' ');
        for (const { re, desc } of algebraPatterns) {
          if (re.test(allText)) {
            issues.push(makeIssue(
              'CHECK-04', 'P1', fileData.file, fileData.topicKey,
              sc.id, lesson.id, screen.type, screen.lineStart,
              `Algebraic notation in non-algebra topic: ${desc}`
            ));
            break; // One flag per screen
          }
        }
      }
    }
  }
  return issues;
}

/** CHECK-05: Acronyms without expansion */
function check05(fileData) {
  const issues = [];
  for (const sc of fileData.subConcepts) {
    for (const lesson of sc.lessons) {
      const allText = lesson.screens.flatMap(s => s.textContent).join(' ');
      for (const [acronym, expansion] of Object.entries(ACRONYMS)) {
        const acroRe = new RegExp(`\\b${acronym}\\b`);
        if (!acroRe.test(allText)) continue;
        // Check if expansion is present
        const expandedRe = new RegExp(
          `\\b${acronym}\\s*\\([^)]*${expansion.split(',')[0].trim().split(' ')[0]}`, 'i'
        );
        if (expandedRe.test(allText)) continue;

        let foundScreen = null;
        for (const screen of lesson.screens) {
          if (acroRe.test(screen.textContent.join(' '))) { foundScreen = screen; break; }
        }

        issues.push(makeIssue(
          'CHECK-05', 'P1', fileData.file, fileData.topicKey,
          sc.id, lesson.id, foundScreen?.type || 'unknown',
          foundScreen?.lineStart || lesson.lineStart,
          `Acronym '${acronym}' used without expansion (${expansion})`,
          true,
          { acronym, expansion, subConcept: sc.id, lesson: lesson.id }
        ));
      }
    }
  }
  return issues;
}

/** CHECK-06: Duplicate consecutive steps (compares RAW source to avoid template-stripping false positives) */
function check06(fileData) {
  const issues = [];
  for (const sc of fileData.subConcepts) {
    for (const lesson of sc.lessons) {
      for (const screen of lesson.screens) {
        const raw = screen.stepTextsRaw || [];
        for (let i = 1; i < raw.length; i++) {
          if (raw[i] === raw[i - 1] && raw[i].length > 5) {
            issues.push(makeIssue(
              'CHECK-06', 'P2', fileData.file, fileData.topicKey,
              sc.id, lesson.id, screen.type, screen.lineStart,
              `Duplicate consecutive steps: "${screen.stepTexts[i]?.slice(0, 60) || raw[i].slice(0, 60)}"`
            ));
          }
        }
      }
    }
  }
  return issues;
}

/** CHECK-07: Mixed number ambiguity (e.g. "3 1/2" without "and") */
function check07(fileData) {
  const issues = [];
  const mixedRe = /(\d+)\s+(\d+\/\d+)/g;
  for (const sc of fileData.subConcepts) {
    for (const lesson of sc.lessons) {
      for (const screen of lesson.screens) {
        // Check each text item individually to avoid cross-boundary false positives
        for (const text of screen.textContent) {
          let m;
          mixedRe.lastIndex = 0;
          while ((m = mixedRe.exec(text)) !== null) {
            // Check if "and" precedes the fraction
            const before = text.slice(Math.max(0, m.index - 5), m.index + m[1].length);
            if (!/and\s*$/.test(before)) {
              issues.push(makeIssue(
                'CHECK-07', 'P2', fileData.file, fileData.topicKey,
                sc.id, lesson.id, screen.type, screen.lineStart,
                `Mixed number '${m[0]}' could be ambiguous — consider '${m[1]} and ${m[2]}'`,
                true,
                { original: m[0], replacement: `${m[1]} and ${m[2]}`, subConcept: sc.id }
              ));
            }
          }
        }
      }
    }
  }
  return issues;
}

/** CHECK-08: Unrendered markdown — ** in step text/why (not rendered by renderBoldText) */
function check08(fileData) {
  const issues = [];
  for (const sc of fileData.subConcepts) {
    for (const lesson of sc.lessons) {
      for (const screen of lesson.screens) {
        // Check step text and why fields for ** markdown
        for (const stepText of screen.stepTexts) {
          if (/\*\*/.test(stepText)) {
            issues.push(makeIssue(
              'CHECK-08', 'P2', fileData.file, fileData.topicKey,
              sc.id, lesson.id, screen.type, screen.lineStart,
              `Markdown ** in step text may not render: "${stepText.slice(0, 60)}"`
            ));
            break;
          }
        }
      }
    }
  }
  return issues;
}

/** CHECK-09: Structural validation */
function check09(fileData) {
  const issues = [];
  for (const sc of fileData.subConcepts) {
    // Sub-concept must have at least 1 lesson
    if (sc.lessons.length === 0) {
      issues.push(makeIssue(
        'CHECK-09', 'P0', fileData.file, fileData.topicKey,
        sc.id, null, null, sc.lineStart,
        'Sub-concept has no lessons'
      ));
      continue;
    }

    for (const lesson of sc.lessons) {
      // Lesson must have exactly 4 screens
      if (lesson.screens.length !== 4) {
        issues.push(makeIssue(
          'CHECK-09', 'P0', fileData.file, fileData.topicKey,
          sc.id, lesson.id, null, lesson.lineStart,
          `Lesson has ${lesson.screens.length} screens (expected 4: hook, teach, interact, consolidate)`
        ));
        continue;
      }

      // Screen order must be hook, teach, interact, consolidate
      const expectedOrder = ['hook', 'teach', 'interact', 'consolidate'];
      const actualOrder = lesson.screens.map(s => s.type);
      if (JSON.stringify(actualOrder) !== JSON.stringify(expectedOrder)) {
        issues.push(makeIssue(
          'CHECK-09', 'P0', fileData.file, fileData.topicKey,
          sc.id, lesson.id, null, lesson.lineStart,
          `Screen order is [${actualOrder.join(', ')}] (expected [${expectedOrder.join(', ')}])`
        ));
      }

      // Hook and consolidate should have interaction: null
      for (const screen of lesson.screens) {
        if ((screen.type === 'hook' || screen.type === 'consolidate') && screen.hasInteraction) {
          issues.push(makeIssue(
            'CHECK-09', 'P0', fileData.file, fileData.topicKey,
            sc.id, lesson.id, screen.type, screen.lineStart,
            `${screen.type} screen has an interaction (should be null)`
          ));
        }
      }

      // Teach and interact should have interaction
      for (const screen of lesson.screens) {
        if ((screen.type === 'teach' || screen.type === 'interact') && !screen.hasInteraction && !screen.hasNullInteraction) {
          issues.push(makeIssue(
            'CHECK-09', 'P0', fileData.file, fileData.topicKey,
            sc.id, lesson.id, screen.type, screen.lineStart,
            `${screen.type} screen is missing interaction field`,
            true,
            { screenType: screen.type, needsInteraction: true }
          ));
        }
      }

      // Lesson should have variableSets
      if (lesson.variableSetCount === 0) {
        issues.push(makeIssue(
          'CHECK-09', 'P0', fileData.file, fileData.topicKey,
          sc.id, lesson.id, null, lesson.lineStart,
          'Lesson has no variableSets'
        ));
      }
    }
  }
  return issues;
}

/** CHECK-10: Interaction correctness */
function check10(fileData) {
  const issues = [];
  for (const sc of fileData.subConcepts) {
    for (const lesson of sc.lessons) {
      for (const screen of lesson.screens) {
        if (!screen.hasInteraction || !screen.interactionType) continue;
        const f = screen.interactionFields;
        const type = screen.interactionType;

        switch (type) {
          case 'multiple-choice':
            if (!f.hasCorrectAnswer) {
              issues.push(makeIssue('CHECK-10', 'P0', fileData.file, fileData.topicKey,
                sc.id, lesson.id, screen.type, screen.lineStart,
                'multiple-choice missing correctAnswer'));
            }
            if (!f.hasGetOptions && !f.hasOptions) {
              issues.push(makeIssue('CHECK-10', 'P0', fileData.file, fileData.topicKey,
                sc.id, lesson.id, screen.type, screen.lineStart,
                'multiple-choice missing getOptions/options'));
            }
            if (!f.hasFeedback || !f.hasCorrectFeedback || !f.hasIncorrectFeedback) {
              issues.push(makeIssue('CHECK-10', 'P0', fileData.file, fileData.topicKey,
                sc.id, lesson.id, screen.type, screen.lineStart,
                'multiple-choice missing feedback (correct/incorrect)'));
            }
            break;

          case 'fill-blank':
            if (!f.hasCorrectIndex) {
              issues.push(makeIssue('CHECK-10', 'P0', fileData.file, fileData.topicKey,
                sc.id, lesson.id, screen.type, screen.lineStart,
                'fill-blank missing correctIndex'));
            }
            if (!f.hasOptions) {
              issues.push(makeIssue('CHECK-10', 'P0', fileData.file, fileData.topicKey,
                sc.id, lesson.id, screen.type, screen.lineStart,
                'fill-blank missing options'));
            }
            if (!f.hasSentence && !f.hasQuestion) {
              issues.push(makeIssue('CHECK-10', 'P1', fileData.file, fileData.topicKey,
                sc.id, lesson.id, screen.type, screen.lineStart,
                'fill-blank missing sentence/question'));
            }
            break;

          case 'match-pairs':
            if (!f.hasPairs) {
              issues.push(makeIssue('CHECK-10', 'P0', fileData.file, fileData.topicKey,
                sc.id, lesson.id, screen.type, screen.lineStart,
                'match-pairs missing pairs'));
            }
            break;

          case 'order-steps':
            if (!f.hasSteps) {
              issues.push(makeIssue('CHECK-10', 'P0', fileData.file, fileData.topicKey,
                sc.id, lesson.id, screen.type, screen.lineStart,
                'order-steps missing steps'));
            }
            if (!f.hasFeedback) {
              issues.push(makeIssue('CHECK-10', 'P1', fileData.file, fileData.topicKey,
                sc.id, lesson.id, screen.type, screen.lineStart,
                'order-steps missing feedback'));
            }
            break;

          case 'true-false':
            if (!f.hasStatements) {
              issues.push(makeIssue('CHECK-10', 'P0', fileData.file, fileData.topicKey,
                sc.id, lesson.id, screen.type, screen.lineStart,
                'true-false missing statements'));
            }
            break;

          case 'tap-to-reveal':
            // Minimal structure — just needs to exist
            break;

          default:
            issues.push(makeIssue('CHECK-10', 'P1', fileData.file, fileData.topicKey,
              sc.id, lesson.id, screen.type, screen.lineStart,
              `Unknown interaction type: '${type}'`));
        }
      }
    }
  }
  return issues;
}

/** CHECK-11: Wrong visual component for topic */
function check11(fileData) {
  const issues = [];
  for (const sc of fileData.subConcepts) {
    for (const lesson of sc.lessons) {
      for (const screen of lesson.screens) {
        if (!screen.visualComponent) continue;
        const comp = screen.visualComponent;
        if (COMPONENT_ALLOWED[comp] && !COMPONENT_ALLOWED[comp].includes(fileData.topicKey)) {
          issues.push(makeIssue(
            'CHECK-11', 'P1', fileData.file, fileData.topicKey,
            sc.id, lesson.id, screen.type, screen.lineStart,
            `Visual component '${comp}' is not expected in topic '${fileData.topicKey}'`
          ));
        }
      }
    }
  }
  return issues;
}

/** CHECK-12: Duplicate match-pairs right values */
function check12(fileData) {
  const issues = [];
  for (const sc of fileData.subConcepts) {
    for (const lesson of sc.lessons) {
      for (const screen of lesson.screens) {
        if (screen.interactionType !== 'match-pairs') continue;
        const seen = new Set();
        for (const val of screen.rightValues) {
          if (seen.has(val)) {
            issues.push(makeIssue(
              'CHECK-12', 'P1', fileData.file, fileData.topicKey,
              sc.id, lesson.id, screen.type, screen.lineStart,
              `Duplicate right value in match-pairs: '${val}'`
            ));
          }
          seen.add(val);
        }
      }
    }
  }
  return issues;
}

/** CHECK-13: Consolidate introduces new content not in teach */
function check13(fileData) {
  const issues = [];
  // Technical terms that if new in consolidate, suggest they should be in teach
  const importantTerms = new Set([
    ...Object.keys(GLOSSARY), ...Object.keys(ACRONYMS)
  ]);

  for (const sc of fileData.subConcepts) {
    for (const lesson of sc.lessons) {
      const hookScreen = lesson.screens.find(s => s.type === 'hook');
      const teachScreen = lesson.screens.find(s => s.type === 'teach');
      const consolidateScreen = lesson.screens.find(s => s.type === 'consolidate');
      if (!teachScreen || !consolidateScreen) continue;

      // Check all earlier screens (hook + teach) for the term, not just teach
      const earlierText = [
        ...(hookScreen ? hookScreen.textContent : []),
        ...teachScreen.textContent
      ].join(' ').toLowerCase();
      const consText = consolidateScreen.textContent.join(' ').toLowerCase();

      for (const term of importantTerms) {
        const termRe = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (termRe.test(consText) && !termRe.test(earlierText)) {
          issues.push(makeIssue(
            'CHECK-13', 'P1', fileData.file, fileData.topicKey,
            sc.id, lesson.id, 'consolidate', consolidateScreen.lineStart,
            `Consolidate introduces '${term}' not found in teach screen`
          ));
        }
      }
    }
  }
  return issues;
}

/** CHECK-14: Missing visual on visual topics */
function check14(fileData) {
  const issues = [];
  if (!VISUAL_TOPICS.has(fileData.topicKey)) return issues;

  for (const sc of fileData.subConcepts) {
    for (const lesson of sc.lessons) {
      for (const screen of lesson.screens) {
        if (screen.type === 'hook' || screen.type === 'teach') {
          if (!screen.hasVisual && (screen.hasNullVisual || !screen.visualComponent)) {
            issues.push(makeIssue(
              'CHECK-14', 'P1', fileData.file, fileData.topicKey,
              sc.id, lesson.id, screen.type, screen.lineStart,
              `${screen.type} screen has no visual in visual-heavy topic '${fileData.topicKey}'`
            ));
          }
        }
      }
    }
  }
  return issues;
}

/** CHECK-15: Semantic visual mapping — wrong/forbidden components per sub-concept */
function check15(fileData) {
  const issues = [];
  let visualMapping;
  try {
    visualMapping = require('./visual-mapping');
  } catch (e) {
    return issues; // mapping file not found — skip
  }

  const topicMap = visualMapping[fileData.topicKey];
  if (!topicMap) return issues; // topic not in mapping

  for (const sc of fileData.subConcepts) {
    // Get rules: sub-concept-specific override, or _default
    const rules = topicMap[sc.id] || topicMap._default;
    if (!rules) continue;

    const forbidden = new Set(rules.forbidden || []);
    const expected = new Set(rules.expected || []);

    for (const lesson of sc.lessons) {
      for (const screen of lesson.screens) {
        // Collect all visual components on this screen
        const components = [];
        if (screen.visualComponent) components.push(screen.visualComponent);
        if (screen.bodyPartsVisuals) components.push(...screen.bodyPartsVisuals);

        for (const comp of components) {
          // P0: Component in forbidden list
          if (forbidden.has(comp)) {
            issues.push(makeIssue(
              'CHECK-15', 'P0', fileData.file, fileData.topicKey,
              sc.id, lesson.id, screen.type, screen.lineStart,
              `Forbidden visual '${comp}' in '${sc.id}' — expected: ${[...expected].join(', ') || 'WorkedExample'}`,
              false, { component: comp, subConcept: sc.id, expected: [...expected] }
            ));
          }
          // P1: Component not in expected list and not WorkedExample/generic
          else if (expected.size > 0 && !expected.has(comp) && comp !== 'WorkedExample') {
            issues.push(makeIssue(
              'CHECK-15', 'P1', fileData.file, fileData.topicKey,
              sc.id, lesson.id, screen.type, screen.lineStart,
              `Unexpected visual '${comp}' in '${sc.id}' — expected: ${[...expected].join(', ')}`,
              false, { component: comp, subConcept: sc.id, expected: [...expected] }
            ));
          }
        }
      }
    }
  }
  return issues;
}

// ============================================================
// MAIN
// ============================================================

function main() {
  console.log('=== Lesson Lint Report ===\n');

  // Find all staging files
  const files = fs.readdirSync(STAGING_DIR)
    .filter(f => f.endsWith('-subconcepts.js'))
    .sort();

  console.log(`Files found: ${files.length}\n`);

  // Parse all files
  const allFileData = [];
  for (const file of files) {
    try {
      const data = parseFile(path.join(STAGING_DIR, file));
      allFileData.push(data);
    } catch (e) {
      console.error(`  ERROR parsing ${file}: ${e.message}`);
    }
  }

  // Run all checks
  const allChecks = [
    check01, check02, check03, check04, check05, check06, check07,
    check08, check09, check10, check11, check12, check13, check14, check15
  ];

  const checkNames = {
    'CHECK-01': 'Unexplained terms',
    'CHECK-02': 'Teach missing hook ref',
    'CHECK-03': 'Steps missing working',
    'CHECK-04': 'Algebraic notation outside algebra',
    'CHECK-05': 'Unexpanded acronyms',
    'CHECK-06': 'Duplicate consecutive steps',
    'CHECK-07': 'Mixed number ambiguity',
    'CHECK-08': 'Unrendered markdown',
    'CHECK-09': 'Structural validation',
    'CHECK-10': 'Interaction correctness',
    'CHECK-11': 'Wrong visual component',
    'CHECK-12': 'Duplicate match-pairs values',
    'CHECK-13': 'Consolidate new content',
    'CHECK-14': 'Missing visual on visual topics',
    'CHECK-15': 'Wrong visual for sub-concept',
  };

  let allIssues = [];
  for (const fileData of allFileData) {
    for (const check of allChecks) {
      try {
        allIssues = allIssues.concat(check(fileData));
      } catch (e) {
        console.error(`  ERROR running ${check.name} on ${fileData.file}: ${e.message}`);
      }
    }
  }

  // Aggregate stats
  const bySeverity = {};
  const byCheck = {};
  const byFile = {};
  let autoFixableCount = 0;

  for (const issue of allIssues) {
    bySeverity[issue.severity] = (bySeverity[issue.severity] || 0) + 1;
    byCheck[issue.id] = (byCheck[issue.id] || 0) + 1;
    byFile[issue.file] = (byFile[issue.file] || 0) + 1;
    if (issue.autoFixable) autoFixableCount++;
  }

  // Count total sub-concepts, lessons, screens
  let totalSC = 0, totalLessons = 0, totalScreens = 0;
  for (const fd of allFileData) {
    for (const sc of fd.subConcepts) {
      totalSC++;
      for (const lesson of sc.lessons) {
        totalLessons++;
        totalScreens += lesson.screens.length;
      }
    }
  }

  // Console summary
  console.log(`Parsed: ${totalSC} sub-concepts, ${totalLessons} lessons, ${totalScreens} screens`);
  console.log(`Total issues: ${allIssues.length}\n`);

  console.log('By severity:');
  for (const sev of ['P0', 'P1', 'P2']) {
    console.log(`  ${sev}: ${bySeverity[sev] || 0}`);
  }

  console.log('\nBy check:');
  const sortedChecks = Object.entries(byCheck).sort((a, b) => b[1] - a[1]);
  for (const [check, count] of sortedChecks) {
    const fixable = allIssues.filter(i => i.id === check && i.autoFixable).length;
    const fixTag = fixable > 0 ? `  [${fixable} auto-fixable]` : '';
    console.log(`  ${check} ${checkNames[check] || ''}: ${count}${fixTag}`);
  }

  console.log(`\nAuto-fixable: ${autoFixableCount}/${allIssues.length}`);

  console.log('\nBy file (top 10):');
  const sortedFiles = Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 10);
  for (const [file, count] of sortedFiles) {
    console.log(`  ${file}: ${count}`);
  }

  // Sample issues
  console.log('\nSample issues (first 15):');
  for (const issue of allIssues.slice(0, 15)) {
    console.log(`  [${issue.severity}] ${issue.file} > ${issue.subConcept} > ${issue.screen}: ${issue.message.slice(0, 100)}`);
  }

  // Write JSON report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      filesScanned: files.length,
      subConcepts: totalSC,
      lessons: totalLessons,
      screens: totalScreens,
      totalIssues: allIssues.length,
      bySeverity,
      byCheck,
      byFile,
      autoFixable: autoFixableCount,
    },
    issues: allIssues,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
  console.log(`\nFull report written to: ${OUTPUT_FILE}`);
}

main();

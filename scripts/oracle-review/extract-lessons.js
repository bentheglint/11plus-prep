#!/usr/bin/env node
/**
 * Extract lesson content from staging files into reviewable JSON.
 * Evaluates template functions with sample variable sets to produce readable text.
 * Usage: node scripts/oracle-review/extract-lessons.js [topicKey]
 *        node scripts/oracle-review/extract-lessons.js --all
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { TOPICS, getTopic } = require('./topic-registry');

// Mock generateDistractors for evaluation context
function generateDistractors(correct, count = 4) {
  const distractors = [];
  for (let i = 1; i <= count; i++) {
    distractors.push(String(correct + i * (i % 2 === 0 ? 1 : -1)));
  }
  return [String(correct), ...distractors];
}

function generateDivisionDistractors(quotient, remainder, count = 4) {
  return [`${quotient} remainder ${remainder}`, `${quotient + 1} remainder ${remainder}`, `${quotient - 1} remainder ${remainder + 1}`, `${quotient} remainder ${remainder + 1}`, `${quotient + 1} remainder ${remainder - 1}`];
}

function toWord(n) {
  const words = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
  return words[n] || String(n);
}

/**
 * Safely evaluate a template function with a variable set.
 * Returns the string result or the raw source on failure.
 */
function safeEval(fn, vars) {
  if (fn === null || fn === undefined) return null;
  if (typeof fn === 'string') return fn;
  if (typeof fn !== 'function') return String(fn);
  try {
    const result = fn(vars);
    if (typeof result === 'string') return result;
    if (Array.isArray(result)) return result; // bodyParts array
    if (typeof result === 'object') return result;
    return String(result);
  } catch (e) {
    // Return function source as fallback
    return `[EVAL_FAILED: ${fn.toString().substring(0, 200)}]`;
  }
}

/**
 * Extract a single screen's content using the given variable set.
 */
function extractScreen(screen, vars) {
  const extracted = {
    type: screen.type,
    title: safeEval(screen.title, vars),
    body: null,
    bodyParts: null,
    hasVisual: false,
    visualComponent: null,
    interaction: null,
  };

  // Body — can be a string, function, or null (bodyParts used instead)
  if (screen.body) {
    extracted.body = safeEval(screen.body, vars);
  }

  // BodyParts — array of { type, content/component/props }
  if (screen.bodyParts) {
    const parts = safeEval(screen.bodyParts, vars);
    if (Array.isArray(parts)) {
      extracted.bodyParts = parts.map(part => {
        if (part.type === 'text') {
          return { type: 'text', content: safeEval(part.content, vars) };
        } else if (part.type === 'visual') {
          return {
            type: 'visual',
            component: part.component,
            props: safeEval(part.props, vars),
          };
        }
        return part;
      });
    }
  }

  // Visual
  if (screen.visual) {
    extracted.hasVisual = true;
    extracted.visualComponent = screen.visual.component;
    try {
      extracted.visualProps = safeEval(screen.visual.props, vars);
    } catch {
      extracted.visualProps = '[EVAL_FAILED]';
    }
  }

  // Interaction
  if (screen.interaction) {
    const inter = screen.interaction;
    extracted.interaction = {
      type: safeEval(inter.type, vars),
    };

    if (inter.question) extracted.interaction.question = safeEval(inter.question, vars);
    if (inter.sentence) extracted.interaction.sentence = safeEval(inter.sentence, vars);

    // Options
    if (inter.options) {
      extracted.interaction.options = safeEval(inter.options, vars);
    } else if (inter.getOptions) {
      extracted.interaction.options = safeEval(inter.getOptions, vars);
    }

    // Correct answer
    if (inter.correctIndex !== undefined) {
      extracted.interaction.correctIndex = safeEval(inter.correctIndex, vars);
    }
    if (inter.correctAnswer !== undefined) {
      extracted.interaction.correctAnswer = safeEval(inter.correctAnswer, vars);
    }

    // Feedback
    if (inter.feedback) {
      extracted.interaction.correctFeedback = safeEval(inter.feedback?.correct, vars);
      extracted.interaction.incorrectFeedback = safeEval(inter.feedback?.incorrect, vars);
    }
  }

  return extracted;
}

/**
 * Load a staging file by transforming ES modules to CommonJS and evaluating.
 */
function loadStagingFile(filePath, varName) {
  if (!fs.existsSync(filePath)) return null;

  let source = fs.readFileSync(filePath, 'utf-8');

  // Strip import statements
  source = source.replace(/import\s+\{[^}]*\}\s+from\s+['"][^'"]*['"];?\s*/g, '');
  source = source.replace(/import\s+\w+\s+from\s+['"][^'"]*['"];?\s*/g, '');

  // Replace export const VAR = with __result__ = (so it's accessible)
  source = source.replace(/export\s+const\s+(\w+)\s*=/g, 'var $1 = __result__ =');
  source = source.replace(/export\s+default\s+/g, '__result__ = ');

  // Also handle plain const (no export) that might be the main array
  // Don't replace ALL consts — only if no export was found
  if (!source.includes('__result__')) {
    source = source.replace(/const\s+(\w+SubConcepts)\s*=/g, 'var $1 = __result__ =');
  }

  // Inject helper functions
  const helpers = `
    var __result__ = null;
    var generateDistractors = ${generateDistractors.toString()};
    var generateDivisionDistractors = ${generateDivisionDistractors.toString()};
    var toWord = ${toWord.toString()};
  `;

  const fullSource = helpers + source;

  try {
    const sandbox = { module: { exports: {} }, exports: {}, require, console, __result__: null };
    vm.runInNewContext(fullSource, sandbox, { filename: filePath, timeout: 10000 });

    const result = sandbox.__result__;
    if (Array.isArray(result) && result.length > 0) return result;

    return null;
  } catch (e) {
    console.error(`  ⚠ Failed to load ${path.basename(filePath)}: ${e.message.substring(0, 150)}`);
    return null;
  }
}

function extractTopic(topicInfo) {
  const subConcepts = loadStagingFile(topicInfo.stagingFile, topicInfo.stagingVar);

  if (!subConcepts || subConcepts.length === 0) {
    console.log(`  ⚠ No lessons found for ${topicInfo.subject}/${topicInfo.topicKey}`);
    return null;
  }

  let totalLessons = 0;
  let totalScreens = 0;
  let evalFailures = 0;

  const extractedSubConcepts = subConcepts.map(sc => {
    const lessons = (sc.lessons || []).map(lesson => {
      totalLessons++;
      const vars = lesson.variableSets?.[0] || {};

      const screens = (lesson.screens || []).map(screen => {
        totalScreens++;
        const extracted = extractScreen(screen, vars);
        // Count eval failures
        const text = JSON.stringify(extracted);
        if (text.includes('EVAL_FAILED')) evalFailures++;
        return extracted;
      });

      return {
        id: lesson.id,
        templateType: lesson.templateType,
        learningGoal: lesson.learningGoal || [],
        variableSetCount: (lesson.variableSets || []).length,
        sampleVariableSetName: vars.name || vars.scenario || 'unknown',
        screens,
      };
    });

    return {
      id: sc.id,
      name: sc.name,
      category: sc.category,
      lessonCount: lessons.length,
      lessons,
    };
  });

  return {
    meta: {
      subject: topicInfo.subject,
      topic: topicInfo.topicKey,
      displayName: topicInfo.displayName,
      extractedAt: new Date().toISOString(),
      subConceptCount: extractedSubConcepts.length,
      lessonCount: totalLessons,
      screenCount: totalScreens,
      evalFailures,
    },
    subConcepts: extractedSubConcepts,
  };
}

function run(topicKey) {
  const outputDir = path.join(__dirname, 'extracted');

  if (topicKey === '--all') {
    console.log(`Extracting lessons for all ${TOPICS.length} topics...`);
    let totalLessons = 0;
    let totalFails = 0;
    TOPICS.forEach(t => {
      const result = extractTopic(t);
      if (result) {
        const file = path.join(outputDir, `lessons-${t.subject}-${t.topicKey}.json`);
        fs.writeFileSync(file, JSON.stringify(result, null, 2));
        totalLessons += result.meta.lessonCount;
        totalFails += result.meta.evalFailures;
        console.log(`  ✓ ${t.displayName}: ${result.meta.subConceptCount} sub-concepts, ${result.meta.lessonCount} lessons${result.meta.evalFailures ? ` (${result.meta.evalFailures} eval failures)` : ''}`);
      }
    });
    console.log(`\nDone! ${totalLessons} lessons extracted. ${totalFails} eval failures.`);
  } else {
    const topic = getTopic(topicKey);
    if (!topic) {
      console.error(`Unknown topic: ${topicKey}`);
      process.exit(1);
    }
    const result = extractTopic(topic);
    if (result) {
      const file = path.join(outputDir, `lessons-${topic.subject}-${topicKey}.json`);
      fs.writeFileSync(file, JSON.stringify(result, null, 2));
      console.log(`✓ Extracted ${result.meta.lessonCount} lessons for ${topic.displayName}`);
      console.log(`  ${result.meta.subConceptCount} sub-concepts, ${result.meta.screenCount} screens`);
      if (result.meta.evalFailures) console.log(`  ⚠ ${result.meta.evalFailures} template evaluation failures`);
      console.log(`  Saved to: ${file}`);
    }
  }
}

const arg = process.argv[2] || '--all';
run(arg);

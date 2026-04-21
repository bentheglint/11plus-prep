#!/usr/bin/env node
/**
 * stem-leak-scan.js
 *
 * Finds questions where a distinctive keyword appears in the QUESTION stem
 * AND in exactly ONE option — and that option is the correct answer.
 *
 * This is the "pattern-match giveaway" class of bug: child can spot the
 * shared word without reasoning about the concept.
 *
 * Example (English vocabulary Q371):
 *   Stem: "In which sentence does 'sentence' mean 'a punishment given by a judge'?"
 *   Correct option: "The judge gave a sentence of five years."
 *   → Only option containing "judge". Stem-leak bug.
 *
 * Run: node scripts/stem-leak-scan.js
 */

const fs = require('fs');
const path = require('path');

// Stop-words we ignore — too generic to constitute a leak.
const STOP = new Set([
  'the','a','an','and','or','but','if','then','so','of','to','in','on','at',
  'is','are','was','were','be','been','being','have','has','had','do','does',
  'did','will','would','could','should','may','might','can','as','it','its',
  'this','that','these','those','which','what','who','whom','when','where',
  'why','how','not','no','yes','for','from','with','by','into','onto','out',
  'up','down','over','under','about','into','than','too','very','also','than',
  'some','any','all','both','each','every','few','many','most','other','such',
  'own','same','so','just','now','well','also','only','very','even','still',
  'you','your','yours','he','him','his','she','her','hers','they','them',
  'their','theirs','we','us','our','ours','i','me','my','mine','one','two',
  'three','four','five','six','seven','eight','nine','ten','means','meaning',
  'word','words','sentence','sentences','option','options','letter','letters',
  'number','numbers','example','examples','answer','answers','question',
  'questions','following','correct','wrong','true','false','best','next',
  'first','last','here','there','now','then','always','never','often','sometimes',
  'between','among','before','after','while','during','since','until',
  'more','less','much','less','many','lot','lots','little','big','small',
  'called','used','use','using','make','makes','made','give','gives','gave',
  'given','take','takes','took','taken','say','says','said','see','saw','seen',
  'goes','went','gone','tell','tells','told','think','thought','know','knew',
  'known','above','below','right','left','near','far','way','ways','like',
  'type','types','kind','kinds','part','parts','each','every','any','something'
]);

const NUMBER_RE = /^\d+(\.\d+)?(cm|mm|m|km|g|kg|ml|l|%|°|°c|°f|p|£|\$)?$/i;

function tokenise(text) {
  if (!text) return [];
  // Strip HTML entities we might use (&lt; etc.) then split on non-word.
  return String(text)
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9' -]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 4)
    .filter(w => !STOP.has(w))
    .filter(w => !NUMBER_RE.test(w))
    .map(w => w.replace(/^'+|'+$/g, '').replace(/s$/, '')) // crude lemma: drop trailing s
    .filter(w => w.length >= 4);
}

function stemLeakCheck(q) {
  // We only care about multiple-choice questions with options & a correct index.
  if (!q || !q.question || !Array.isArray(q.options)) return null;
  if (typeof q.correct !== 'number') return null;
  if (q.options.length < 2) return null;

  // Exclude passage/comprehension questions — they're SUPPOSED to share language
  // with the passage (that's how comprehension works).
  if (q.questionType === 'passage') return null;
  if (q.passageId || q.passageTitle) return null;

  // Exclude question patterns where stem-leak is legitimate by design:
  // - "Which word is (the|a|an) [grammar-term] in: '[sentence]'?" — parse tasks
  // - Logic-puzzle stems that list people/objects and ask which one ranks
  const stem = String(q.question);
  if (/which word is (the|a|an) (adjective|adverb|verb|noun|pronoun|determiner|conjunction|preposition|article) in[:\s]/i.test(stem)) return null;
  if (/rearrange these (words|letters)/i.test(stem)) return null;
  // Ordering-logic pattern: multiple names + "than" comparisons + "who/which is" question
  if (/\b(taller|shorter|faster|slower|heavier|lighter|older|younger|longer|bigger|smaller|more|fewer)\s+than\b/i.test(stem)
      && /\b(who|which|whose)\b/i.test(stem)) return null;

  const stemTokens = new Set(tokenise(q.question));
  if (stemTokens.size === 0) return null;

  // For each token appearing in stem, count how many options contain it.
  const leaks = [];
  for (const tok of stemTokens) {
    let matchingOptions = [];
    q.options.forEach((opt, i) => {
      const optTokens = new Set(tokenise(opt));
      if (optTokens.has(tok)) matchingOptions.push(i);
    });
    if (matchingOptions.length === 1 && matchingOptions[0] === q.correct) {
      leaks.push({ token: tok, optionIndex: matchingOptions[0] });
    }
  }
  return leaks.length ? leaks : null;
}

// Walk every topic's questions array in the data modules we care about.
function loadQuestionBank(modulePath) {
  // Clear require cache just in case.
  delete require.cache[require.resolve(modulePath)];
  try {
    const mod = require(modulePath);
    return mod.default || mod;
  } catch (e) {
    console.error(`Failed to load ${modulePath}: ${e.message}`);
    return null;
  }
}

// Topics where stem-leak is legitimate by question design:
//  - logicAndLanguage: logic puzzles must name all participants in the stem
const EXCLUDED_TOPICS = new Set(['logicAndLanguage']);

function walk(obj, path, visit, excludedTopic) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => walk(item, `${path}[${i}]`, visit, excludedTopic));
    return;
  }
  // A "topic node" has {questions: [...]} or it's a container.
  if (Array.isArray(obj.questions) && !excludedTopic) {
    obj.questions.forEach(q => visit(q, path));
  }
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'questions') continue;
    const nextExcluded = excludedTopic || EXCLUDED_TOPICS.has(k);
    walk(v, path ? `${path}.${k}` : k, visit, nextExcluded);
  }
}

const ROOT = path.resolve(__dirname, '..', 'src', 'questionData');
const modules = [
  { file: 'englishData.js', label: 'english' },
  { file: 'vrData.js', label: 'vr' },
  { file: 'mathsData.js', label: 'maths' }
];

const findings = [];
for (const { file, label } of modules) {
  const bank = loadQuestionBank(path.join(ROOT, file));
  if (!bank) continue;
  walk(bank, label, (q, topicPath) => {
    const leaks = stemLeakCheck(q);
    if (leaks) {
      findings.push({
        subject: label,
        topicPath,
        questionId: q.id,
        question: q.question,
        correctOption: q.options[q.correct],
        leakedTokens: leaks.map(l => l.token)
      });
    }
  });
}

// Sort by subject then topic
findings.sort((a, b) =>
  a.subject.localeCompare(b.subject) ||
  a.topicPath.localeCompare(b.topicPath) ||
  (a.questionId - b.questionId)
);

console.log(`\nStem-leak scan results: ${findings.length} findings\n`);
findings.slice(0, 50).forEach(f => {
  console.log(`[${f.subject}] ${f.topicPath} Q${f.questionId}`);
  console.log(`  Stem: ${f.question}`);
  console.log(`  Correct option: ${f.correctOption}`);
  console.log(`  Leaked tokens: ${f.leakedTokens.join(', ')}`);
  console.log('');
});
if (findings.length > 50) console.log(`... (${findings.length - 50} more not shown)`);

const outPath = path.resolve(__dirname, 'stem-leak-findings.json');
fs.writeFileSync(outPath, JSON.stringify(findings, null, 2));
console.log(`\nFull results written to: ${outPath}`);
console.log(`Total: ${findings.length} stem-leak instances across ${new Set(findings.map(f => f.subject)).size} subjects`);

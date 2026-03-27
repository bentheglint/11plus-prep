/**
 * Safe Question Insertion Utility
 *
 * Eliminates the orphan insertion bug by properly finding the exact
 * insertion point inside a topic's questions array.
 *
 * Usage:
 *   const { insertQuestions, removeQuestions, verifyStructure } = require('./lib/safe-insert');
 *
 *   insertQuestions('vrData', 'letterSums', newQuestionsArray);
 *   removeQuestions('vrData', 'letterSums', q => q.id > 100);
 *   verifyStructure('vrData');
 */

const fs = require('fs');
const path = require('path');

const FILES = {
  vrData: path.resolve(__dirname, '..', '..', 'src/questionData/vrData.js'),
  englishData: path.resolve(__dirname, '..', '..', 'src/questionData/englishData.js'),
  vrMap: path.resolve(__dirname, '..', '..', 'public/vr-question-lesson-map.json'),
  englishMap: path.resolve(__dirname, '..', '..', 'public/english-question-lesson-map.json'),
};

// ============================================================
// CORE: Find the exact insertion point for a topic's questions
// ============================================================

/**
 * Find the character position of the ] that closes a topic's questions array.
 * Uses depth tracking from the topic's `questions: [` opening.
 *
 * @param {string} content - Full file content
 * @param {string} topicKey - Topic name (e.g., 'letterSums')
 * @returns {{ questionsStart: number, questionsEnd: number, topicStart: number }} positions
 */
function findQuestionsArray(content, topicKey) {
  // Find topic opening: `topicKey: {` or `topicKey: {`
  const topicPattern = new RegExp('\\b' + topicKey + '\\s*:\\s*\\{');
  const topicMatch = topicPattern.exec(content);
  if (!topicMatch) throw new Error('Topic "' + topicKey + '" not found in file');

  const topicStart = topicMatch.index;

  // Find `questions: [` or `"questions": [` after topic start
  const afterTopic = content.substring(topicStart);
  const qArrayMatch = afterTopic.match(/["']?questions["']?\s*:\s*\[/);
  if (!qArrayMatch) throw new Error('No questions array found in topic "' + topicKey + '"');

  const questionsStart = topicStart + qArrayMatch.index + qArrayMatch[0].length;

  // Now track bracket depth to find the matching ]
  let depth = 1; // We're inside the [ already
  let i = questionsStart;

  while (i < content.length && depth > 0) {
    const ch = content[i];
    if (ch === '[') depth++;
    if (ch === ']') depth--;
    if (depth === 0) break;
    i++;
  }

  if (depth !== 0) throw new Error('Unmatched [ in questions array for topic "' + topicKey + '"');

  return {
    topicStart,
    questionsStart,  // Position right after the opening [
    questionsEnd: i, // Position of the closing ]
  };
}

/**
 * Find the position of the last question's closing } inside the questions array.
 * This is where new questions should be inserted (after this }, before the ]).
 */
function findLastQuestionEnd(content, questionsStart, questionsEnd) {
  const arrayContent = content.substring(questionsStart, questionsEnd);

  // If array is empty, return the start position
  if (arrayContent.trim() === '') return questionsStart;

  // Find the last } at depth 0 within the array
  let depth = 0;
  let lastBracePos = -1;

  for (let i = arrayContent.length - 1; i >= 0; i--) {
    const ch = arrayContent[i];
    if (ch === '}') {
      if (depth === 0) {
        lastBracePos = questionsStart + i + 1; // Position AFTER the }
        break;
      }
      depth++;
    }
    if (ch === '{') depth--;
  }

  return lastBracePos;
}

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Insert questions into a topic's questions array.
 *
 * @param {string} fileKey - 'vrData' or 'englishData'
 * @param {string} topicKey - Topic name
 * @param {Array} questions - Array of question objects to insert
 * @param {object} options - { format: 'json' (default) | 'js' }
 * @returns {{ inserted: number, total: number }}
 */
function insertQuestions(fileKey, topicKey, questions, options = {}) {
  const filePath = FILES[fileKey];
  if (!filePath) throw new Error('Unknown file: ' + fileKey);

  let content = fs.readFileSync(filePath, 'utf8');
  const format = options.format || 'json';

  // Pre-check: verify balance before we start
  const preBraces = countChar(content, '{') - countChar(content, '}');
  const preBrackets = countChar(content, '[') - countChar(content, ']');
  if (preBraces !== 0 || preBrackets !== 0) {
    throw new Error('File already has structural issues (braces:' + preBraces + ' brackets:' + preBrackets + '). Fix first.');
  }

  const { questionsStart, questionsEnd } = findQuestionsArray(content, topicKey);
  const insertPos = findLastQuestionEnd(content, questionsStart, questionsEnd);

  if (insertPos === -1) throw new Error('Could not find insertion point in ' + topicKey);

  // Build question strings
  const qStrings = questions.map(q => formatQuestion(q, format));
  const isEmpty = content.substring(questionsStart, questionsEnd).trim() === '';
  const separator = isEmpty ? '\n' : ',\n';
  const newContent = separator + qStrings.join(',\n') + '\n      ';

  // Insert
  content = content.substring(0, insertPos) + newContent + content.substring(insertPos);

  // Post-check: verify balance
  const postBraces = countChar(content, '{') - countChar(content, '}');
  const postBrackets = countChar(content, '[') - countChar(content, ']');
  if (postBraces !== 0 || postBrackets !== 0) {
    throw new Error('Insertion broke structure (braces:' + postBraces + ' brackets:' + postBrackets + '). NOT writing.');
  }

  fs.writeFileSync(filePath, content, 'utf8');

  // Count total questions after insert
  const { questionsEnd: newEnd } = findQuestionsArray(content, topicKey);
  const finalSection = content.substring(questionsStart, newEnd);
  const totalIds = [...finalSection.matchAll(/["']?id["']?\s*:\s*(\d+)/g)].length;

  return { inserted: questions.length, total: totalIds };
}

/**
 * Remove questions from a topic based on a filter function.
 *
 * @param {string} fileKey - 'vrData' or 'englishData'
 * @param {string} topicKey - Topic name
 * @param {function} filterFn - Function that receives question text block, returns true to REMOVE
 * @returns {{ removed: number, remaining: number }}
 */
function removeQuestions(fileKey, topicKey, filterFn) {
  const filePath = FILES[fileKey];
  let content = fs.readFileSync(filePath, 'utf8');

  const { questionsStart, questionsEnd } = findQuestionsArray(content, topicKey);
  const arrayContent = content.substring(questionsStart, questionsEnd);

  // Split into question blocks
  const blocks = arrayContent.split(/(?=\{[\s\n]*(?:["']?id["']?)\s*:\s*\d)/);
  const kept = [];
  let removed = 0;

  for (const block of blocks) {
    if (!block.match(/["']?id["']?\s*:\s*\d/)) continue; // skip non-question content
    if (filterFn(block)) {
      removed++;
    } else {
      kept.push(block.trim());
    }
  }

  // Rebuild array content
  const newArrayContent = kept.length > 0
    ? '\n        ' + kept.join(',\n        ') + '\n      '
    : '';

  content = content.substring(0, questionsStart) + newArrayContent + content.substring(questionsEnd);

  // Verify
  const postBraces = countChar(content, '{') - countChar(content, '}');
  const postBrackets = countChar(content, '[') - countChar(content, ']');
  if (postBraces !== 0 || postBrackets !== 0) {
    throw new Error('Removal broke structure (braces:' + postBraces + ' brackets:' + postBrackets + '). NOT writing.');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  return { removed, remaining: kept.length };
}

/**
 * Verify structural integrity of the entire file.
 *
 * @param {string} fileKey - 'vrData' or 'englishData'
 * @returns {{ ok: boolean, topics: Array }}
 */
function verifyStructure(fileKey) {
  const filePath = FILES[fileKey];
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const braces = countChar(content, '{') - countChar(content, '}');
  const brackets = countChar(content, '[') - countChar(content, ']');

  // Find topics
  const topicStarts = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s{4}(\w+):\s*\{/);
    if (m) topicStarts.push({ name: m[1], line: i });
  }
  topicStarts.push({ name: '__END__', line: lines.length - 4 });

  const topics = [];
  let allOk = braces === 0 && brackets === 0;

  for (let t = 0; t < topicStarts.length - 1; t++) {
    const topic = topicStarts[t];
    const next = topicStarts[t + 1];
    const topicContent = lines.slice(topic.line, next.line).join('\n');

    let tb = 0, tkb = 0;
    for (const ch of topicContent) {
      if (ch === '{') tb++;
      if (ch === '}') tb--;
      if (ch === '[') tkb++;
      if (ch === ']') tkb--;
    }

    const ids = [...topicContent.matchAll(/["']?id["']?\s*:\s*(\d+)/g)].map(m => +m[1]);
    const uniqueIds = new Set(ids).size;
    const ok = tb === 0 && tkb === 0 && ids.length === uniqueIds;
    if (!ok) allOk = false;

    topics.push({
      name: topic.name,
      questions: ids.length,
      unique: uniqueIds,
      braces: tb,
      brackets: tkb,
      ok,
    });
  }

  return { ok: allOk, braces, brackets, topics };
}

/**
 * Get all question IDs in a topic.
 */
function getTopicIds(fileKey, topicKey) {
  const filePath = FILES[fileKey];
  const content = fs.readFileSync(filePath, 'utf8');
  const { questionsStart, questionsEnd } = findQuestionsArray(content, topicKey);
  const section = content.substring(questionsStart, questionsEnd);
  return [...section.matchAll(/["']?id["']?\s*:\s*(\d+)/g)].map(m => +m[1]);
}

// ============================================================
// HELPERS
// ============================================================

function countChar(str, ch) {
  let count = 0;
  for (const c of str) if (c === ch) count++;
  return count;
}

function formatQuestion(q, format) {
  if (format === 'js') {
    // Unquoted keys
    const opts = q.options.map(o => '"' + String(o).replace(/"/g, '\\"') + '"').join(', ');
    let str = '        {\n';
    str += '          id: ' + q.id + ',\n';
    str += '          difficulty: ' + q.difficulty + ',\n';
    if (q.questionType) str += '          questionType: "' + q.questionType + '",\n';
    str += '          question: "' + String(q.question).replace(/"/g, '\\"') + '",\n';
    str += '          options: [' + opts + '],\n';
    str += '          correct: ' + q.correct + ',\n';
    str += '          explanation: "' + String(q.explanation).replace(/"/g, '\\"') + '"\n';
    str += '        }';
    return str;
  }

  // JSON format (default)
  const opts = q.options.map(o => '"' + String(o).replace(/"/g, '\\"') + '"').join(', ');
  let str = '        {\n';
  str += '          "id": ' + q.id + ',\n';
  str += '          "difficulty": ' + q.difficulty + ',\n';
  if (q.questionType) str += '          "questionType": "' + q.questionType + '",\n';
  str += '          "question": "' + String(q.question).replace(/"/g, '\\"') + '",\n';

  if (q.correctPair) {
    // select-two format (hidden words etc)
    str += '          "options": [' + opts + '],\n';
    str += '          "correctPair": [' + q.correctPair.join(', ') + '],\n';
  } else if (q.setA) {
    // pick-from-sets format
    const setAStr = q.setA.map(w => '"' + w + '"').join(', ');
    const setBStr = q.setB.map(w => '"' + w + '"').join(', ');
    str += '          "setA": [' + setAStr + '],\n';
    str += '          "setB": [' + setBStr + '],\n';
    str += '          "correctPair": [' + q.correctPair.join(', ') + '],\n';
  } else {
    str += '          "options": [' + opts + '],\n';
    str += '          "correct": ' + q.correct + ',\n';
  }

  str += '          "explanation": "' + String(q.explanation).replace(/"/g, '\\"') + '"\n';
  str += '        }';
  return str;
}

module.exports = {
  insertQuestions,
  removeQuestions,
  verifyStructure,
  getTopicIds,
  findQuestionsArray,
  FILES,
};

#!/usr/bin/env node
/**
 * Extract questions from data files into reviewable JSON.
 * Usage: node scripts/oracle-review/extract-questions.js [topicKey]
 *        node scripts/oracle-review/extract-questions.js --all
 */

const fs = require('fs');
const path = require('path');
const { TOPICS, getTopic } = require('./topic-registry');

// Load question data files (these use ES module default export)
const mathsData = require('../../src/questionData/mathsData').default;
const englishData = require('../../src/questionData/englishData').default;
const vrData = require('../../src/questionData/vrData').default;

function getDataForSubject(subject) {
  if (subject === 'maths') return mathsData;
  if (subject === 'english') return englishData;
  return vrData;
}

function extractQuestion(q) {
  const extracted = {
    id: q.id,
    difficulty: q.difficulty || 2,
    questionType: q.questionType || 'standard',
    question: q.question,
    options: q.options || null,
    correct: q.correct,
    correctAnswer: null,
    explanation: q.explanation || null,
    hasVisualComponent: !!(q.visual || q.image),
    visualComponent: q.visual?.component || null,
    image: q.image || null,
  };

  // Resolve correct answer text
  if (q.questionType === 'pick-from-sets') {
    extracted.setA = q.setA;
    extracted.setB = q.setB;
    extracted.correctPair = q.correctPair;
    if (q.setA && q.setB && q.correctPair) {
      extracted.correctAnswer = `${q.setA[q.correctPair[0]]} + ${q.setB[q.correctPair[1]]}`;
    }
  } else if (q.questionType === 'select-two') {
    extracted.correctPair = q.correctPair;
    if (q.options && q.correctPair) {
      extracted.correctAnswer = q.correctPair.map(i => q.options[i]).join(' + ');
    }
  } else if (q.questionType === 'error-spotting') {
    extracted.segments = q.segments;
    extracted.correctAnswer = q.correct === 4 ? 'No mistake' : `Segment ${String.fromCharCode(65 + q.correct)}`;
  } else if (q.options && q.correct !== undefined) {
    extracted.correctAnswer = q.options[q.correct];
  }

  // Comprehension extras
  if (q.passageId) extracted.passageId = q.passageId;
  if (q.passageTitle) extracted.passageTitle = q.passageTitle;
  if (q.questionSubType) extracted.questionSubType = q.questionSubType;

  return extracted;
}

function extractTopic(topicInfo) {
  const data = getDataForSubject(topicInfo.subject);
  const topicData = data.topics?.[topicInfo.topicKey];

  if (!topicData || !topicData.questions) {
    console.log(`  ⚠ No questions found for ${topicInfo.subject}/${topicInfo.topicKey}`);
    return null;
  }

  const questions = topicData.questions.map(extractQuestion);

  // Difficulty distribution
  const diffDist = { D1: 0, D2: 0, D3: 0 };
  questions.forEach(q => {
    if (q.difficulty === 1) diffDist.D1++;
    else if (q.difficulty === 3) diffDist.D3++;
    else diffDist.D2++;
  });

  // Question type breakdown
  const typeCounts = {};
  questions.forEach(q => {
    typeCounts[q.questionType] = (typeCounts[q.questionType] || 0) + 1;
  });

  // For comprehension: deduplicate passages
  let passages = null;
  if (questions.some(q => q.passageId)) {
    const passageMap = {};
    topicData.questions.forEach(q => {
      if (q.passageId && q.passage && !passageMap[q.passageId]) {
        passageMap[q.passageId] = {
          passageId: q.passageId,
          passageTitle: q.passageTitle || q.passageId,
          passageText: q.passage.substring(0, 500) + (q.passage.length > 500 ? '...' : ''),
          questionCount: 0,
        };
      }
      if (q.passageId && passageMap[q.passageId]) {
        passageMap[q.passageId].questionCount++;
      }
    });
    passages = Object.values(passageMap);
  }

  const result = {
    meta: {
      subject: topicInfo.subject,
      topic: topicInfo.topicKey,
      displayName: topicInfo.displayName,
      extractedAt: new Date().toISOString(),
      questionCount: questions.length,
      difficultyDistribution: diffDist,
      questionTypes: typeCounts,
      visualComponentCount: questions.filter(q => q.hasVisualComponent).length,
    },
    questions,
  };

  if (passages) result.passages = passages;

  return result;
}

function run(topicKey) {
  const outputDir = path.join(__dirname, 'extracted');

  if (topicKey === '--all') {
    console.log(`Extracting questions for all ${TOPICS.length} topics...`);
    let total = 0;
    TOPICS.forEach(t => {
      const result = extractTopic(t);
      if (result) {
        const file = path.join(outputDir, `questions-${t.subject}-${t.topicKey}.json`);
        fs.writeFileSync(file, JSON.stringify(result, null, 2));
        total += result.meta.questionCount;
        console.log(`  ✓ ${t.displayName}: ${result.meta.questionCount} questions`);
      }
    });
    console.log(`\nDone! ${total} questions extracted across ${TOPICS.length} topics.`);
  } else {
    const topic = getTopic(topicKey);
    if (!topic) {
      console.error(`Unknown topic: ${topicKey}`);
      console.log('Available:', TOPICS.map(t => t.topicKey).join(', '));
      process.exit(1);
    }
    const result = extractTopic(topic);
    if (result) {
      const file = path.join(outputDir, `questions-${topic.subject}-${topicKey}.json`);
      fs.writeFileSync(file, JSON.stringify(result, null, 2));
      console.log(`✓ Extracted ${result.meta.questionCount} questions for ${topic.displayName}`);
      console.log(`  D1: ${result.meta.difficultyDistribution.D1}, D2: ${result.meta.difficultyDistribution.D2}, D3: ${result.meta.difficultyDistribution.D3}`);
      console.log(`  Saved to: ${file}`);
    }
  }
}

const arg = process.argv[2] || '--all';
run(arg);

#!/usr/bin/env node
/**
 * Extract question-to-lesson mappings with teaching efficacy data.
 * For each mapping, includes both the question text AND the lesson teach summary
 * so the Oracle can verify pedagogical alignment.
 * Usage: node scripts/oracle-review/extract-mappings.js [topicKey]
 *        node scripts/oracle-review/extract-mappings.js --all
 */

const fs = require('fs');
const path = require('path');
const { TOPICS, getTopic } = require('./topic-registry');

function extractTopic(topicInfo) {
  const extractedDir = path.join(__dirname, 'extracted');

  // Load extracted questions for this topic
  const qFile = path.join(extractedDir, `questions-${topicInfo.subject}-${topicInfo.topicKey}.json`);
  if (!fs.existsSync(qFile)) {
    console.log(`  ⚠ No extracted questions for ${topicInfo.topicKey} — run extract-questions.js first`);
    return null;
  }
  const questionData = JSON.parse(fs.readFileSync(qFile, 'utf-8'));
  const questionMap = {};
  questionData.questions.forEach(q => { questionMap[q.id] = q; });

  // Load extracted lessons for this topic
  const lFile = path.join(extractedDir, `lessons-${topicInfo.subject}-${topicInfo.topicKey}.json`);
  let lessonData = null;
  const subConceptMap = {};
  if (fs.existsSync(lFile)) {
    lessonData = JSON.parse(fs.readFileSync(lFile, 'utf-8'));
    // Build a map of subConceptId -> teach screen summary
    (lessonData.subConcepts || []).forEach(sc => {
      const teachSummaries = (sc.lessons || []).map(lesson => {
        const teachScreen = lesson.screens.find(s => s.type === 'teach');
        return {
          lessonId: lesson.id,
          templateType: lesson.templateType,
          learningGoal: lesson.learningGoal,
          teachTitle: teachScreen?.title || null,
          teachBody: teachScreen?.body?.substring?.(0, 300) || null,
          interactQuestion: lesson.screens.find(s => s.type === 'interact')?.interaction?.question || null,
        };
      });
      subConceptMap[sc.id] = {
        name: sc.name,
        category: sc.category,
        teachSummaries,
      };
    });
  }

  // Load mapping file
  if (!fs.existsSync(topicInfo.mappingFile)) {
    console.log(`  ⚠ No mapping file for ${topicInfo.topicKey}`);
    return null;
  }
  const allMappings = JSON.parse(fs.readFileSync(topicInfo.mappingFile, 'utf-8'));
  const topicMappings = allMappings[topicInfo.topicKey] || [];

  // Build teaching efficacy pairs
  const mappedQuestionIds = new Set();
  const mappedSubConceptIds = new Set();
  const efficacyPairs = [];

  topicMappings.forEach(mapping => {
    mappedQuestionIds.add(mapping.questionId);
    mappedSubConceptIds.add(mapping.subConceptId);

    const question = questionMap[mapping.questionId];
    const lessonInfo = subConceptMap[mapping.subConceptId];

    efficacyPairs.push({
      questionId: mapping.questionId,
      questionText: question?.question?.substring(0, 150) || `[Question ${mapping.questionId} not found]`,
      questionDifficulty: question?.difficulty || '?',
      correctAnswer: question?.correctAnswer || '?',
      subConceptId: mapping.subConceptId,
      subConceptName: lessonInfo?.name || mapping.subConceptId,
      confidence: mapping.confidence,
      lessonTeachSummary: lessonInfo?.teachSummaries?.[0]?.teachBody?.substring(0, 200) || '[No lesson found]',
      lessonLearningGoal: lessonInfo?.teachSummaries?.[0]?.learningGoal || [],
    });
  });

  // Find unmapped questions
  const unmappedQuestions = questionData.questions
    .filter(q => !mappedQuestionIds.has(q.id))
    .map(q => ({
      id: q.id,
      difficulty: q.difficulty,
      question: q.question?.substring(0, 150),
      correctAnswer: q.correctAnswer,
    }));

  // Find orphan sub-concepts (in lessons but no questions map to them)
  const allSubConceptIds = Object.keys(subConceptMap);
  const orphanSubConcepts = allSubConceptIds
    .filter(id => !mappedSubConceptIds.has(id))
    .map(id => ({ id, name: subConceptMap[id]?.name || id }));

  // Confidence breakdown
  const confBreakdown = { high: 0, medium: 0, low: 0 };
  topicMappings.forEach(m => {
    confBreakdown[m.confidence] = (confBreakdown[m.confidence] || 0) + 1;
  });

  // Sub-concept coverage with difficulty spread
  const subConceptCoverage = {};
  topicMappings.forEach(m => {
    if (!subConceptCoverage[m.subConceptId]) {
      subConceptCoverage[m.subConceptId] = {
        name: subConceptMap[m.subConceptId]?.name || m.subConceptId,
        questionCount: 0,
        difficulties: { D1: 0, D2: 0, D3: 0 },
      };
    }
    subConceptCoverage[m.subConceptId].questionCount++;
    const q = questionMap[m.questionId];
    if (q?.difficulty === 1) subConceptCoverage[m.subConceptId].difficulties.D1++;
    else if (q?.difficulty === 3) subConceptCoverage[m.subConceptId].difficulties.D3++;
    else subConceptCoverage[m.subConceptId].difficulties.D2++;
  });

  return {
    meta: {
      subject: topicInfo.subject,
      topic: topicInfo.topicKey,
      displayName: topicInfo.displayName,
      extractedAt: new Date().toISOString(),
      totalQuestions: questionData.questions.length,
      mappedQuestions: mappedQuestionIds.size,
      unmappedQuestions: unmappedQuestions.length,
      totalSubConcepts: allSubConceptIds.length,
      orphanSubConcepts: orphanSubConcepts.length,
      confidenceBreakdown: confBreakdown,
    },
    efficacyPairs,
    unmappedQuestions,
    orphanSubConcepts,
    subConceptCoverage,
  };
}

function run(topicKey) {
  const outputDir = path.join(__dirname, 'extracted');

  if (topicKey === '--all') {
    console.log(`Extracting mappings for all ${TOPICS.length} topics...`);
    let totalMapped = 0;
    let totalUnmapped = 0;
    TOPICS.forEach(t => {
      const result = extractTopic(t);
      if (result) {
        const file = path.join(outputDir, `mappings-${t.subject}-${t.topicKey}.json`);
        fs.writeFileSync(file, JSON.stringify(result, null, 2));
        totalMapped += result.meta.mappedQuestions;
        totalUnmapped += result.meta.unmappedQuestions;
        const unmappedNote = result.meta.unmappedQuestions > 0 ? ` (${result.meta.unmappedQuestions} unmapped)` : '';
        console.log(`  ✓ ${t.displayName}: ${result.meta.mappedQuestions}/${result.meta.totalQuestions} mapped${unmappedNote}`);
      }
    });
    console.log(`\nDone! ${totalMapped} mapped, ${totalUnmapped} unmapped.`);
  } else {
    const topic = getTopic(topicKey);
    if (!topic) {
      console.error(`Unknown topic: ${topicKey}`);
      process.exit(1);
    }
    const result = extractTopic(topic);
    if (result) {
      const file = path.join(outputDir, `mappings-${topic.subject}-${topicKey}.json`);
      fs.writeFileSync(file, JSON.stringify(result, null, 2));
      console.log(`✓ ${topic.displayName}: ${result.meta.mappedQuestions}/${result.meta.totalQuestions} mapped`);
      if (result.meta.unmappedQuestions > 0) console.log(`  ⚠ ${result.meta.unmappedQuestions} unmapped questions`);
      if (result.meta.orphanSubConcepts > 0) console.log(`  ⚠ ${result.meta.orphanSubConcepts} orphan sub-concepts`);
    }
  }
}

const arg = process.argv[2] || '--all';
run(arg);

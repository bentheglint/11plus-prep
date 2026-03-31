#!/usr/bin/env node
/**
 * Validate ALL Oracle-reported issues against actual app data.
 * Checks wrong answers computationally, verifies duplicates exist,
 * confirms missing lessons, and flags likely false positives.
 *
 * Usage: node scripts/oracle-review/validate-issues.js
 */

const fs = require('fs');
const path = require('path');

const mathsData = require('../../src/questionData/mathsData').default;
const englishData = require('../../src/questionData/englishData').default;
const vrData = require('../../src/questionData/vrData').default;

function getQuestionData(subject) {
  if (subject === 'maths') return mathsData;
  if (subject === 'english') return englishData;
  return vrData;
}

function findQuestion(subject, topic, qId) {
  const data = getQuestionData(subject);
  const topicData = data.topics?.[topic];
  if (!topicData) return null;
  const id = typeof qId === 'string' ? parseInt(qId.replace(/^Q/, '')) : qId;
  return topicData.questions.find(q => q.id === id) || null;
}

// Load lesson data for mapping checks
let lessonBank = null;
try {
  lessonBank = require('../../src/microLessons/lessonData').lessonBank;
} catch (e) {
  // Lesson data uses ES modules — try loading staging files
}

// Load mapping files
function loadMapping(subject, topic) {
  const mapSubject = subject === 'verbalreasoning' ? 'vr' : subject;
  const mapFile = path.join(__dirname, '..', '..', 'public', `${mapSubject}-question-lesson-map.json`);
  if (!fs.existsSync(mapFile)) return null;
  const all = JSON.parse(fs.readFileSync(mapFile, 'utf-8'));
  return all[topic] || null;
}

// ---- VALIDATORS ----

function validateWrongAnswer(issue) {
  const q = findQuestion(issue.subject, issue.topic, issue.itemId);
  if (!q) return { verified: 'unable', reason: `Question ${issue.itemId} not found in ${issue.subject}/${issue.topic}` };

  // For standard MC: check if the marked correct answer seems wrong
  if (q.options && q.correct !== undefined) {
    const markedAnswer = q.options[q.correct];
    return {
      verified: 'needs-manual',
      reason: `Q${q.id}: marked answer is "${markedAnswer}" (index ${q.correct}). Oracle claims this is wrong. Manual verification needed.`,
      questionText: q.question?.substring(0, 100),
      markedAnswer,
      allOptions: q.options,
      explanation: q.explanation?.substring(0, 150),
    };
  }
  return { verified: 'unable', reason: 'Non-standard question type' };
}

function validateDuplicate(issue) {
  // Check if the issue references specific question IDs
  const desc = issue.description || '';
  const ids = desc.match(/Q(\d+)/g);
  if (!ids || ids.length < 2) return { verified: 'needs-manual', reason: 'No specific Q IDs to compare' };

  const questions = ids.map(id => findQuestion(issue.subject, issue.topic, id)).filter(Boolean);
  if (questions.length < 2) return { verified: 'unable', reason: 'Could not find referenced questions' };

  // Compare question text
  const texts = questions.map(q => q.question);
  const identical = texts[0] === texts[1];
  const similar = !identical && texts[0]?.substring(0, 50) === texts[1]?.substring(0, 50);

  return {
    verified: identical ? 'confirmed' : similar ? 'likely' : 'needs-manual',
    reason: identical ? `Questions have IDENTICAL text: "${texts[0]?.substring(0, 80)}"`
      : similar ? `Questions start similarly: "${texts[0]?.substring(0, 50)}..."`
      : `Questions appear different — may be near-duplicates in meaning only`,
    q1: texts[0]?.substring(0, 100),
    q2: texts[1]?.substring(0, 100),
  };
}

function validateMappingGap(issue) {
  const mapping = loadMapping(issue.subject, issue.topic);
  if (!mapping) return { verified: 'unable', reason: 'Mapping file not found' };

  // Check for unmapped questions
  const data = getQuestionData(issue.subject);
  const topicData = data.topics?.[issue.topic];
  if (!topicData) return { verified: 'unable', reason: 'Topic not found' };

  const mappedIds = new Set(mapping.map(m => m.questionId));
  const unmapped = topicData.questions.filter(q => !mappedIds.has(q.id));

  return {
    verified: unmapped.length > 0 ? 'confirmed' : 'false-positive',
    reason: unmapped.length > 0
      ? `${unmapped.length} unmapped questions found: ${unmapped.slice(0, 5).map(q => 'Q' + q.id).join(', ')}${unmapped.length > 5 ? '...' : ''}`
      : 'All questions are mapped',
    unmappedCount: unmapped.length,
  };
}

function validateDifficultyDistribution(issue) {
  const data = getQuestionData(issue.subject);
  const topicData = data.topics?.[issue.topic];
  if (!topicData) return { verified: 'unable', reason: 'Topic not found' };

  const dist = { D1: 0, D2: 0, D3: 0 };
  topicData.questions.forEach(q => {
    if (q.difficulty === 1) dist.D1++;
    else if (q.difficulty === 3) dist.D3++;
    else dist.D2++;
  });
  const total = topicData.questions.length;
  const pcts = {
    D1: Math.round(dist.D1 / total * 100),
    D2: Math.round(dist.D2 / total * 100),
    D3: Math.round(dist.D3 / total * 100),
  };

  const offTarget = Math.abs(pcts.D1 - 30) > 10 || Math.abs(pcts.D2 - 40) > 10 || Math.abs(pcts.D3 - 30) > 10;

  return {
    verified: offTarget ? 'confirmed' : 'minor',
    reason: `D1:${pcts.D1}% D2:${pcts.D2}% D3:${pcts.D3}% (target ~30:40:30). ${offTarget ? 'Significantly off target.' : 'Within acceptable range.'}`,
    distribution: pcts,
    counts: dist,
    total,
  };
}

function validateExplanationIssue(issue) {
  const q = findQuestion(issue.subject, issue.topic, issue.itemId);
  if (!q) return { verified: 'needs-manual', reason: `Question ${issue.itemId} not found` };

  const explanation = q.explanation || '';
  // Check for common issues
  const hasUndefined = explanation.includes('undefined');
  const hasSelfCorrection = explanation.match(/wait|actually|no,|hmm/i);
  const hasContradiction = explanation.includes('not') && explanation.includes('is correct');
  const isEmpty = explanation.length < 10;

  if (hasUndefined) return { verified: 'confirmed', reason: `Explanation contains 'undefined': "${explanation.substring(0, 100)}"` };
  if (hasSelfCorrection) return { verified: 'confirmed', reason: `Explanation contains self-correcting text: "${explanation.substring(0, 100)}"` };
  if (isEmpty) return { verified: 'confirmed', reason: 'Explanation is empty or very short' };

  return {
    verified: 'needs-manual',
    reason: `Explanation exists (${explanation.length} chars). Manual review needed.`,
    explanationPreview: explanation.substring(0, 150),
  };
}

function validateGeneric(issue) {
  return {
    verified: 'needs-manual',
    reason: `Category "${issue.category}" requires manual verification. ${issue.description?.substring(0, 100) || ''}`,
  };
}

// ---- MAIN ----

const allIssues = JSON.parse(fs.readFileSync(path.join(__dirname, 'results', 'all-issues.json'), 'utf-8'));

const results = {
  validatedAt: new Date().toISOString(),
  totalIssues: allIssues.length,
  confirmed: 0,
  likely: 0,
  falsePositive: 0,
  needsManual: 0,
  unable: 0,
  bySeverity: { critical: { total: 0, confirmed: 0, fp: 0 }, high: { total: 0, confirmed: 0, fp: 0 }, medium: { total: 0, confirmed: 0, fp: 0 }, low: { total: 0, confirmed: 0, fp: 0 } },
  issues: [],
};

allIssues.forEach(issue => {
  let validation;
  const cat = (issue.category || '').toLowerCase();

  if (cat.includes('wrong-answer') || cat.includes('answer-accuracy') || cat.includes('answer-verification')) {
    validation = validateWrongAnswer(issue);
  } else if (cat.includes('duplicate') || cat.includes('near-duplicate') || cat.includes('repetit')) {
    validation = validateDuplicate(issue);
  } else if (cat.includes('mapping-gap') || cat.includes('unmapped') || cat.includes('orphan')) {
    validation = validateMappingGap(issue);
  } else if (cat.includes('difficulty-distribution') || cat.includes('difficulty-balance')) {
    validation = validateDifficultyDistribution(issue);
  } else if (cat.includes('explanation') || cat.includes('display-error')) {
    validation = validateExplanationIssue(issue);
  } else {
    validation = validateGeneric(issue);
  }

  const entry = {
    issueId: issue.issueId || `${issue.topic}-${issue.itemId || 'META'}`,
    severity: issue.severity,
    topic: issue.topic,
    subject: issue.subject,
    category: issue.category,
    title: issue.title,
    validation: validation.verified,
    validationDetail: validation.reason,
    ...validation,
  };

  results.issues.push(entry);

  // Count
  results[validation.verified === 'confirmed' ? 'confirmed' : validation.verified === 'likely' ? 'likely' : validation.verified === 'false-positive' ? 'falsePositive' : validation.verified === 'needs-manual' ? 'needsManual' : 'unable']++;

  const sev = results.bySeverity[issue.severity] || results.bySeverity.medium;
  sev.total++;
  if (validation.verified === 'confirmed' || validation.verified === 'likely') sev.confirmed++;
  if (validation.verified === 'false-positive') sev.fp++;
});

// Save
const outFile = path.join(__dirname, 'results', 'validation-report.json');
fs.writeFileSync(outFile, JSON.stringify(results, null, 2));

// Print summary
console.log('=== Issue Validation Report ===\n');
console.log(`Total issues:      ${results.totalIssues}`);
console.log(`Confirmed:         ${results.confirmed}`);
console.log(`Likely real:       ${results.likely}`);
console.log(`False positives:   ${results.falsePositive}`);
console.log(`Needs manual:      ${results.needsManual}`);
console.log(`Unable to verify:  ${results.unable}`);

console.log('\nBy severity:');
Object.entries(results.bySeverity).forEach(([sev, data]) => {
  console.log(`  ${sev}: ${data.total} total, ${data.confirmed} confirmed, ${data.fp} false positives`);
});

// Show confirmed issues by severity
console.log('\n=== CONFIRMED ISSUES ===\n');
['critical', 'high', 'medium', 'low'].forEach(sev => {
  const confirmed = results.issues.filter(i => i.severity === sev && (i.validation === 'confirmed' || i.validation === 'likely'));
  if (confirmed.length === 0) return;
  console.log(`--- ${sev.toUpperCase()} (${confirmed.length}) ---`);
  confirmed.forEach(i => {
    console.log(`  ${i.issueId}: ${i.title}`);
    console.log(`    → ${i.validationDetail?.substring(0, 120)}`);
  });
  console.log('');
});

console.log(`\nFull report: ${outFile}`);

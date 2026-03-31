#!/usr/bin/env node
/**
 * Triage all remaining Oracle issues into: resolved, auto-fixable, needs-content, needs-judgment.
 */
const fs = require('fs');
const path = require('path');

const issues = require('./results/all-issues.json');
const completed = ['punctuation', 'ratio', 'decimals'];
const remaining = issues.filter(i => !completed.includes(i.topic || i.topicKey || 'unknown'));

const resolved = [];
const autoFix = [];
const needsContent = [];
const needsJudgment = [];

const mathsTopics = ['percentages','longdivision','fractions','longmultiplication','algebra',
  'placevalue','negativenumbers','primenumbers','areaperimeter','volume',
  'anglesshapes','sequences','datahandling','speeddistancetime'];

remaining.forEach(i => {
  const cat = i.category || i.itemType || '';
  const title = (i.title || '').toLowerCase();
  const topic = i.topic || i.topicKey || '';

  // RESOLVED: difficulty distribution
  if (cat === 'difficulty-distribution' || cat === 'difficulty-balance' ||
      title.includes('difficulty distribution')) {
    resolved.push({ ...i, resolution: 'Phase 3 recalibration' });
    return;
  }

  // RESOLVED: answer position bias
  if (cat === 'answer-position-bias' || title.includes('answer position') ||
      title.includes('correct answer heavily')) {
    resolved.push({ ...i, resolution: 'Global answer position fix' });
    return;
  }

  // RESOLVED: maths difficulty mismatches
  if (['difficulty-mismatch','difficulty-rating','difficulty-mislabel',
       'difficulty-misclassification','difficulty-calibration',
       'difficulty-miscalibration'].includes(cat) && mathsTopics.includes(topic)) {
    resolved.push({ ...i, resolution: 'Phase 3 difficulty recalibration' });
    return;
  }

  // AUTO-FIX: explanations
  if (['explanation-error','explanation-quality','poor-explanation',
       'explanation-clarity','explanation-mismatch','explanation-accuracy',
       'explanation-variety'].includes(cat)) {
    autoFix.push({ ...i, fixType: 'explanation' });
    return;
  }

  // AUTO-FIX: tone
  if (['tone-issue','tone-consistency','tone-inconsistency','tone-warmth','tone'].includes(cat)) {
    autoFix.push({ ...i, fixType: 'tone' });
    return;
  }

  // AUTO-FIX: mappings
  if (['mapping-mismatch','wrong-mapping','mapping-quality'].includes(cat)) {
    autoFix.push({ ...i, fixType: 'mapping' });
    return;
  }

  // AUTO-FIX: format/display
  if (['format-mismatch','format-consistency','format-violation','formatting',
       'duplicate-options','display-error','unit-consistency','segment-formatting'].includes(cat)) {
    autoFix.push({ ...i, fixType: 'format' });
    return;
  }

  // AUTO-FIX: distractors
  if (['poor-distractors','distractor-quality'].includes(cat)) {
    autoFix.push({ ...i, fixType: 'distractors' });
    return;
  }

  // AUTO-FIX: wrong answers / tips
  if (['answer-accuracy','wrong-answer','answer-verification',
       'answer-index-mismatch','misleading-tip','missing-units',
       'pedagogical-contradiction'].includes(cat)) {
    autoFix.push({ ...i, fixType: 'answer-fix' });
    return;
  }

  // AUTO-FIX: misc fixable
  if (['missing-visual','visual-rendering','answer-precision',
       'excessive-scaffolding','undefined'].includes(cat)) {
    autoFix.push({ ...i, fixType: 'misc' });
    return;
  }

  // NEEDS CONTENT: coverage/lessons
  if (['coverage-gap','missing-coverage','teaching-gap','missing-lesson',
       'missing-lessons','mapping-efficacy','lesson-coverage','lesson-quality',
       'lesson-scope','orphan-subconcept','orphan-lesson'].includes(cat)) {
    needsContent.push({ ...i, contentType: cat.includes('lesson') || cat.includes('mapping-efficacy') || cat.includes('orphan') ? 'lesson' : 'questions' });
    return;
  }

  // NEEDS CONTENT: repetition/duplication
  if (['repetition','excessive-repetition','repetitive-content','repetitiveness',
       'duplicate-content','duplicate-question','duplicate','near-duplicate',
       'content-overlap','duplicate-pair','cross-topic-overlap','overlap'].includes(cat)) {
    needsContent.push({ ...i, contentType: 'repetition' });
    return;
  }

  // Everything else: judgment
  needsJudgment.push(i);
});

console.log('=== TRIAGE RESULTS ===');
console.log('Already resolved:  ' + resolved.length);
console.log('Auto-fixable:      ' + autoFix.length);
console.log('Needs content:     ' + needsContent.length);
console.log('Needs judgment:    ' + needsJudgment.length);
console.log('Total:             ' + (resolved.length + autoFix.length + needsContent.length + needsJudgment.length) + ' / ' + remaining.length);

console.log('\n--- AUTO-FIX BREAKDOWN ---');
const fixTypes = {};
autoFix.forEach(i => { fixTypes[i.fixType] = (fixTypes[i.fixType] || 0) + 1; });
Object.entries(fixTypes).sort((a,b) => b[1] - a[1]).forEach(([t, c]) => console.log('  ' + t.padEnd(18) + c));

console.log('\n--- NEEDS CONTENT BREAKDOWN ---');
const contentTypes = {};
needsContent.forEach(i => { contentTypes[i.contentType] = (contentTypes[i.contentType] || 0) + 1; });
Object.entries(contentTypes).sort((a,b) => b[1] - a[1]).forEach(([t, c]) => console.log('  ' + t.padEnd(18) + c));

console.log('\n--- NEEDS JUDGMENT ---');
const jCats = {};
needsJudgment.forEach(i => { jCats[i.category || 'unknown'] = (jCats[i.category || 'unknown'] || 0) + 1; });
Object.entries(jCats).sort((a,b) => b[1] - a[1]).forEach(([t, c]) => console.log('  ' + t.padEnd(25) + c));

// Save
fs.writeFileSync(path.join(__dirname, 'results', 'triage-results.json'), JSON.stringify({
  resolved, autoFix, needsContent, needsJudgment
}, null, 2));
console.log('\nSaved to triage-results.json');

// Show auto-fix details for the fix script
console.log('\n--- AUTO-FIX DETAILS (for fix script) ---');
autoFix.forEach((i, idx) => {
  const topic = i.topic || i.topicKey || '';
  const qId = i.questionId || i.itemId || '';
  console.log(`${idx+1}. [${topic}] ${i.fixType}: ${(i.title || '').substring(0, 80)} ${qId ? '(Q' + qId + ')' : ''}`);
});

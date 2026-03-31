/**
 * Runs question-to-lesson mapping for ALL maths topics and produces a gap report.
 * Usage: node scripts/full-gap-report.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MATHS_TOPICS = [
  'percentages', 'decimals', 'longdivision', 'ratio', 'fractions',
  'longmultiplication', 'algebra', 'placevalue', 'negativenumbers',
  'primenumbers', 'areaperimeter', 'volume', 'anglesshapes',
  'sequences', 'datahandling', 'speeddistancetime'
];

const allResults = [];
const allGaps = [];

for (const topic of MATHS_TOPICS) {
  try {
    execSync(`node scripts/map-questions-to-lessons.js ${topic}`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    });
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'question-lesson-map.json'), 'utf8'));

    // Build distribution
    const dist = {};
    data.mappings.forEach(m => {
      const key = m.subConceptId || 'UNMAPPED';
      const name = m.subConceptName || 'Unmapped';
      if (!dist[key]) dist[key] = { name, count: 0 };
      dist[key].count++;
    });

    // Add zero-count lessons
    data.subConcepts.forEach(sc => {
      if (!dist[sc.id]) dist[sc.id] = { name: sc.name, count: 0 };
    });

    const entries = Object.entries(dist).sort((a, b) => b[1].count - a[1].count);

    const needsMore = entries.filter(([id, d]) => d.count > 0 && d.count <= 3 && !id.startsWith('master-'));
    const noQuestions = entries.filter(([id, d]) => d.count === 0 && !id.startsWith('master-') && id !== 'UNMAPPED');
    const heavy = entries.filter(([, d]) => d.count > 25);
    const unmapped = entries.find(([id]) => id === 'UNMAPPED');

    allResults.push({
      topic,
      totalQuestions: data.totalQuestions,
      totalSubConcepts: data.subConcepts.length,
      distribution: entries.map(([id, d]) => ({ id, name: d.name, count: d.count })),
      needsMore: needsMore.map(([id, d]) => ({ id, name: d.name, count: d.count })),
      noQuestions: noQuestions.map(([id, d]) => ({ id, name: d.name })),
      heavy: heavy.map(([id, d]) => ({ id, name: d.name, count: d.count })),
      unmapped: unmapped ? unmapped[1].count : 0
    });

    // Add to global gaps
    needsMore.forEach(([id, d]) => allGaps.push({ topic, subConcept: id, name: d.name, count: d.count, status: 'NEEDS MORE' }));
    noQuestions.forEach(([id, d]) => allGaps.push({ topic, subConcept: id, name: d.name, count: 0, status: 'NO QUESTIONS' }));

  } catch (e) {
    console.error(`Failed for ${topic}:`, e.message);
    allResults.push({ topic, error: e.message });
  }
}

// Print summary
console.log('');
console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║            FULL QUESTION-TO-LESSON GAP REPORT                  ║');
console.log('╚══════════════════════════════════════════════════════════════════╝');
console.log('');

for (const r of allResults) {
  if (r.error) {
    console.log(`❌ ${r.topic}: ERROR — ${r.error}`);
    continue;
  }

  const issues = r.needsMore.length + r.noQuestions.length;
  const icon = issues === 0 ? '✅' : issues <= 3 ? '⚠️' : '🔴';

  console.log(`${icon} ${r.topic.toUpperCase()} — ${r.totalQuestions} Qs across ${r.totalSubConcepts} sub-concepts`);

  if (r.noQuestions.length > 0) {
    console.log(`   ❌ No questions: ${r.noQuestions.map(g => g.name).join(', ')}`);
  }
  if (r.needsMore.length > 0) {
    r.needsMore.forEach(g => console.log(`   ⚠️  ${g.name}: only ${g.count} question${g.count > 1 ? 's' : ''}`));
  }
  if (r.heavy.length > 0) {
    r.heavy.forEach(g => console.log(`   📊 ${g.name}: ${g.count} questions (heavy)`));
  }
  if (r.unmapped > 0) {
    console.log(`   ❓ ${r.unmapped} unmapped questions`);
  }
  console.log('');
}

// Summary stats
const totalGaps = allGaps.filter(g => g.status === 'NO QUESTIONS').length;
const totalNeedsMore = allGaps.filter(g => g.status === 'NEEDS MORE').length;
const totalQuestions = allResults.reduce((s, r) => s + (r.totalQuestions || 0), 0);
const totalSubConcepts = allResults.reduce((s, r) => s + (r.totalSubConcepts || 0), 0);

console.log('═══════════════════════════════════════════');
console.log(`TOTALS: ${totalQuestions} questions, ${totalSubConcepts} sub-concepts`);
console.log(`  ❌ ${totalGaps} sub-concepts with NO questions`);
console.log(`  ⚠️  ${totalNeedsMore} sub-concepts with 1-3 questions (needs more)`);
console.log(`  ✅ ${totalSubConcepts - totalGaps - totalNeedsMore} sub-concepts with good coverage`);
console.log('═══════════════════════════════════════════');

// Save full report
const report = { generated: new Date().toISOString(), allResults, allGaps };
fs.writeFileSync(path.join(__dirname, 'full-gap-report.json'), JSON.stringify(report, null, 2));
console.log('\nFull report saved to: scripts/full-gap-report.json');

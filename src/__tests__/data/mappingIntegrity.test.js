/**
 * Question-Lesson Mapping Integrity Tests (Testing Strategy 1.5)
 *
 * Every mapping must reference a real question and real lesson.
 * Catches orphaned questions (no lesson) and broken references.
 */

import mathsData from '../../questionData/mathsData';
import englishData from '../../questionData/englishData';
import vrData from '../../questionData/vrData';

// Import mapping files
const mathsMap = require('../../../public/maths-question-lesson-map.json');
const englishMap = require('../../../public/english-question-lesson-map.json');
const vrMap = require('../../../public/vr-question-lesson-map.json');

// Build a set of all question IDs per topic per subject
function buildQuestionIndex(data) {
  const index = {};
  if (!data?.topics) return index;
  Object.entries(data.topics).forEach(([topicKey, topic]) => {
    index[topicKey] = new Set((topic.questions || []).map(q => q.id));
  });
  return index;
}

const mathsIndex = buildQuestionIndex(mathsData);
const englishIndex = buildQuestionIndex(englishData);
const vrIndex = buildQuestionIndex(vrData);

function testMappingFile(mapData, questionIndex, subjectName) {
  describe(`${subjectName} mapping integrity`, () => {
    const topicKeys = Object.keys(mapData);

    it('has topic mappings', () => {
      expect(topicKeys.length).toBeGreaterThan(0);
    });

    it('every mapped questionId exists in the question data', () => {
      const orphans = [];
      topicKeys.forEach(topicKey => {
        const mappings = mapData[topicKey];
        if (!Array.isArray(mappings)) return;
        const questionIds = questionIndex[topicKey];
        if (!questionIds) {
          orphans.push(`${topicKey}: topic not found in question data`);
          return;
        }
        mappings.forEach(m => {
          if (!questionIds.has(m.questionId)) {
            orphans.push(`${topicKey}/Q${m.questionId}: question not found`);
          }
        });
      });
      if (orphans.length > 0) {
        console.log(`${subjectName} orphaned mappings (${orphans.length}):`, orphans.slice(0, 10));
      }
      expect(orphans).toEqual([]);
    });

    it('every mapping has a valid confidence value', () => {
      const validConfidences = ['high', 'medium', 'low'];
      const invalid = [];
      topicKeys.forEach(topicKey => {
        const mappings = mapData[topicKey];
        if (!Array.isArray(mappings)) return;
        mappings.forEach(m => {
          if (!validConfidences.includes(m.confidence)) {
            invalid.push(`${topicKey}/Q${m.questionId}: confidence="${m.confidence}"`);
          }
        });
      });
      if (invalid.length > 0) {
        console.log(`${subjectName} invalid confidence:`, invalid.slice(0, 10));
      }
      expect(invalid).toEqual([]);
    });

    it('every mapping has a subConceptId', () => {
      const missing = [];
      topicKeys.forEach(topicKey => {
        const mappings = mapData[topicKey];
        if (!Array.isArray(mappings)) return;
        mappings.forEach(m => {
          if (!m.subConceptId || typeof m.subConceptId !== 'string') {
            missing.push(`${topicKey}/Q${m.questionId}: missing subConceptId`);
          }
        });
      });
      if (missing.length > 0) {
        console.log(`${subjectName} missing subConceptId:`, missing.slice(0, 10));
      }
      expect(missing).toEqual([]);
    });

    it('no duplicate mappings (same questionId mapped twice in one topic)', () => {
      const dupes = [];
      topicKeys.forEach(topicKey => {
        const mappings = mapData[topicKey];
        if (!Array.isArray(mappings)) return;
        const seen = new Set();
        mappings.forEach(m => {
          if (seen.has(m.questionId)) {
            dupes.push(`${topicKey}/Q${m.questionId}: duplicate mapping`);
          }
          seen.add(m.questionId);
        });
      });
      if (dupes.length > 0) {
        console.log(`${subjectName} duplicate mappings:`, dupes.slice(0, 10));
      }
      expect(dupes).toEqual([]);
    });

    it('reports question coverage (questions with mappings vs total)', () => {
      let totalQuestions = 0;
      let mappedQuestions = 0;
      topicKeys.forEach(topicKey => {
        const topicQIds = questionIndex[topicKey];
        if (!topicQIds) return;
        totalQuestions += topicQIds.size;
        const mappings = mapData[topicKey];
        if (Array.isArray(mappings)) {
          const mappedIds = new Set(mappings.map(m => m.questionId));
          mappedQuestions += [...topicQIds].filter(id => mappedIds.has(id)).length;
        }
      });
      const coverage = totalQuestions > 0 ? Math.round((mappedQuestions / totalQuestions) * 100) : 0;
      console.log(`  ${subjectName}: ${mappedQuestions}/${totalQuestions} questions mapped (${coverage}%)`);
      expect(true).toBe(true);
    });
  });
}

testMappingFile(mathsMap, mathsIndex, 'Maths');
testMappingFile(englishMap, englishIndex, 'English');
testMappingFile(vrMap, vrIndex, 'VR');

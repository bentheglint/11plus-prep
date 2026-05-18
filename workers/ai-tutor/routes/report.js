// ── Report Data Endpoint ──
// GET /api/tutor/report/:childId
//
// Design rationale (from Oracle research, May 2026):
// - No headline percentile from rolling practice data — it implies precision
//   the data doesn't support and is unfair to tutor-led pupils on topic rotation
// - Topics split by data sufficiency: covered (≥20 questions) vs in-progress (5-19)
// - Accuracy computed on covered topics only — the only reliable signal
// - Readiness band (not a number) as the headline: Building / Developing / Exam Ready / Excelling
// - Mock test scores are the closest available proxy for true exam readiness
// - Trajectory from recent vs previous quiz accuracy tells parents direction of travel

import { json } from '../helpers.js';

// ── Mastery algorithm — mirrors src/hooks/useMastery.js ──

function getRecencyFactor(daysSince) {
  if (daysSince <= 7) return 1.0;
  if (daysSince <= 14) return 0.9;
  if (daysSince <= 21) return 0.75;
  if (daysSince <= 28) return 0.6;
  return 0.4;
}

function computeTopicScore(results, now) {
  if (!results || results.length === 0) return null;
  const sorted = [...results].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recent30 = sorted.slice(0, 30);
  const rawAccuracy = recent30.filter(r => r.correct).length / recent30.length;
  const daysSince = Math.floor((now - new Date(sorted[0].date).getTime()) / (1000 * 60 * 60 * 24));
  const recencyFactor = getRecencyFactor(daysSince);
  // No volumeFactor here — covered topics already have ≥20 questions
  return Math.round(rawAccuracy * recencyFactor * 100);
}

// ── Readiness band ──
// Based on covered-topic accuracy AND breadth of coverage.
// Both matter — depth on 2 topics isn't the same as being ready.
function getReadinessBand(coveredAccuracy, coveredCount) {
  if (coveredCount === 0 || coveredAccuracy === null) {
    return {
      band: 'Building Foundations',
      description: 'Not yet enough practice data for a meaningful assessment. Keep building coverage.',
      colour: '#3B82F6',
    };
  }
  if (coveredCount >= 10 && coveredAccuracy >= 90) {
    return {
      band: 'Excelling',
      description: 'Consistently high accuracy across a wide range of topics.',
      colour: '#f59e0b',
    };
  }
  if (coveredCount >= 6 && coveredAccuracy >= 80) {
    return {
      band: 'Exam Ready',
      description: 'Strong performance across core topics. Continue extending coverage.',
      colour: '#16a34a',
    };
  }
  if (coveredCount >= 3 && coveredAccuracy >= 60) {
    return {
      band: 'Developing Well',
      description: 'Solid progress on practised topics. Building towards full curriculum coverage.',
      colour: '#7C3AED',
    };
  }
  return {
    band: 'Building Foundations',
    description: 'Early stage preparation. Focus on building accuracy and expanding topic coverage.',
    colour: '#3B82F6',
  };
}

export async function handleReportRoutes(request, env, userId, path) {
  const db = env.DB;

  const reportMatch = path.match(/^\/api\/tutor\/report\/([^/]+)$/);
  if (!reportMatch || request.method !== 'GET') return null;

  const childId = reportMatch[1];

  const tutor = await db.prepare('SELECT id, display_name FROM tutors WHERE id = ?').bind(userId).first();
  if (!tutor) return json({ error: 'No tutor profile found' }, 403);

  const link = await db.prepare(
    'SELECT joined_at FROM pupil_tutors WHERE tutor_id = ? AND child_id = ?'
  ).bind(userId, childId).first();
  if (!link) return json({ error: 'Child not on roster' }, 404);

  const [child, questionResults, quizResults, mockResults, assignStats] = await Promise.all([
    db.prepare(`
      SELECT c.id, c.display_name, c.year_group, c.target_school
      FROM children c WHERE c.id = ?
    `).bind(childId).first(),

    db.prepare(`
      SELECT topic_key, subject, is_correct, attempted_at
      FROM question_results
      WHERE child_id = ?
      ORDER BY attempted_at DESC
      LIMIT 2000
    `).bind(childId).all(),

    db.prepare(`
      SELECT topic_key, subject, score, total
      FROM quiz_results WHERE child_id = ?
      ORDER BY completed_at DESC LIMIT 30
    `).bind(childId).all(),

    db.prepare(`
      SELECT subject, percentage, completed_at
      FROM mock_test_results WHERE child_id = ?
      ORDER BY completed_at DESC LIMIT 10
    `).bind(childId).all(),

    db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late
      FROM assignment_recipients
      WHERE child_id = ? AND tutor_id = ?
    `).bind(childId, userId).first(),
  ]);

  // ── Group question_results by topic ──
  const byTopic = {};
  (questionResults.results || []).forEach(r => {
    const key = `${r.subject}:${r.topic_key}`;
    if (!byTopic[key]) byTopic[key] = { topicKey: r.topic_key, subject: r.subject, results: [] };
    if (r.attempted_at) {
      byTopic[key].results.push({
        correct: !!r.is_correct,
        date: r.attempted_at.replace(' ', 'T'),
      });
    }
  });

  const now = Date.now();

  // ── Categorise by data sufficiency ──
  const coveredTopics = [];   // ≥20 questions: reliable signal
  const inProgressTopics = []; // 5-19 questions: building

  Object.values(byTopic).forEach(t => {
    const count = t.results.length;
    if (count >= 20) {
      const score = computeTopicScore(t.results, now);
      if (score !== null) coveredTopics.push({ topicKey: t.topicKey, subject: t.subject, score, questionCount: count });
    } else if (count >= 5) {
      inProgressTopics.push({ topicKey: t.topicKey, subject: t.subject, questionCount: count });
    }
  });

  // Sort covered topics by score ascending (weakest first)
  coveredTopics.sort((a, b) => a.score - b.score);

  // ── Covered-topic accuracy (the meaningful headline figure) ──
  const coveredAccuracy = coveredTopics.length > 0
    ? Math.round(coveredTopics.reduce((s, t) => s + t.score, 0) / coveredTopics.length)
    : null;

  // ── Readiness band ──
  const readiness = getReadinessBand(coveredAccuracy, coveredTopics.length);

  // ── Per-subject breakdown (covered topics only) ──
  const subjectMap = {};
  coveredTopics.forEach(t => {
    if (!subjectMap[t.subject]) subjectMap[t.subject] = { scores: [], inProgress: 0 };
    subjectMap[t.subject].scores.push(t.score);
  });
  inProgressTopics.forEach(t => {
    if (!subjectMap[t.subject]) subjectMap[t.subject] = { scores: [], inProgress: 0 };
    subjectMap[t.subject].inProgress++;
  });
  const subjectBreakdown = Object.fromEntries(
    Object.entries(subjectMap).map(([s, v]) => [s, {
      accuracy: v.scores.length > 0 ? Math.round(v.scores.reduce((a, b) => a + b, 0) / v.scores.length) : null,
      coveredTopics: v.scores.length,
      inProgressTopics: v.inProgress,
    }])
  );

  // ── Trajectory: last 10 vs previous 10 quiz sessions ──
  const quizRows = quizResults.results || [];
  const last10 = quizRows.slice(0, 10);
  const prev10 = quizRows.slice(10, 20);
  let trajectory = 'consistent';
  if (last10.length >= 5 && prev10.length >= 5) {
    const avg = rows => rows.reduce((s, r) => s + (r.total > 0 ? r.score / r.total : 0), 0) / rows.length;
    const delta = (avg(last10) - avg(prev10)) * 100;
    if (delta > 5) trajectory = 'improving';
    else if (delta < -5) trajectory = 'declining';
  }

  // ── Recent accuracy (last 20 quizzes, raw) ──
  const recent20 = quizRows.slice(0, 20);
  const recentAccuracy = recent20.length > 0
    ? Math.round(recent20.reduce((s, r) => s + (r.total > 0 ? r.score / r.total : 0), 0) / recent20.length * 100)
    : null;

  // ── Mock tests ──
  const latestMockBySubject = {};
  (mockResults.results || []).forEach(m => {
    if (!latestMockBySubject[m.subject]) {
      latestMockBySubject[m.subject] = {
        subject: m.subject,
        percentage: m.percentage,
        date: m.completed_at,
      };
    }
  });

  // ── Recommendations: weakest covered topics not recently assigned ──
  const recentlyAssigned = new Set(
    (await db.prepare(`
      SELECT DISTINCT ai.item_ref
      FROM assignment_recipients ar
      JOIN assignment_items ai ON ai.id = ar.assignment_item_id
      WHERE ar.child_id = ? AND ar.tutor_id = ?
      ORDER BY ar.assigned_at DESC LIMIT 20
    `).bind(childId, userId).all()).results.map(r => r.item_ref)
  );
  // Covered topics already sorted weakest-first
  const recommendations = coveredTopics
    .filter(t => !recentlyAssigned.has(t.topicKey))
    .slice(0, 3)
    .map(t => ({ topicKey: t.topicKey, subject: t.subject, score: t.score }));

  return json({
    generatedAt: new Date().toISOString(),
    tutorName: tutor.display_name,
    child: {
      name: child.display_name,
      yearGroup: child.year_group,
      targetSchool: child.target_school,
    },
    readiness,
    trajectory,
    coverage: {
      coveredCount: coveredTopics.length,
      inProgressCount: inProgressTopics.length,
    },
    coveredAccuracy,
    recentAccuracy,
    subjectBreakdown,
    coveredTopics,
    inProgressTopics,
    mockTests: Object.values(latestMockBySubject),
    assignments: {
      total: assignStats?.total || 0,
      completed: assignStats?.completed || 0,
      late: assignStats?.late || 0,
    },
    recommendations,
  });
}

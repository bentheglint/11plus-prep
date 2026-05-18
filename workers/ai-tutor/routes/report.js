// ── Report Data Endpoint ──
// GET /api/tutor/report/:childId — Structured report data for PDF generation
//
// Mastery scores use the SAME algorithm as the client-side useMastery hook
// (recency decay × volume ramp × raw accuracy) so report numbers match
// the scorecard the tutor already sees on the pupil detail screen.

import { json } from '../helpers.js';

// ── Mastery algorithm — mirrors src/hooks/useMastery.js exactly ──

function getRecencyFactor(daysSince) {
  if (daysSince <= 7) return 1.0;
  if (daysSince <= 14) return 0.9;
  if (daysSince <= 21) return 0.75;
  if (daysSince <= 28) return 0.6;
  return 0.4;
}

function computeTopicMastery(results, now) {
  if (!results || results.length === 0) return null;
  const sorted = [...results].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recent30 = sorted.slice(0, 30);
  const rawAccuracy = recent30.filter(r => r.correct).length / recent30.length;
  const daysSince = Math.floor((now - new Date(sorted[0].date).getTime()) / (1000 * 60 * 60 * 24));
  const recencyFactor = getRecencyFactor(daysSince);
  const volumeFactor = Math.min(1.0, results.length / 20);
  return Math.round(rawAccuracy * recencyFactor * volumeFactor * 100);
}

// ── Rough GL calibration curve ──
// Based on GL Assessment grade boundaries: top ~25-30% pass selective.
// Not school-specific — a directional estimate, not a precise prediction.
function estimatePercentile(masteryScore) {
  // masteryScore is 0–100
  const s = Math.max(0, Math.min(100, masteryScore));
  const anchors = [
    [0, 5],  [30, 15], [45, 30], [55, 45],
    [65, 58], [72, 68], [78, 76], [83, 83],
    [88, 89], [92, 93], [96, 97], [100, 99],
  ];
  for (let i = 0; i < anchors.length - 1; i++) {
    const [x0, y0] = anchors[i];
    const [x1, y1] = anchors[i + 1];
    if (s >= x0 && s <= x1) {
      const t = (s - x0) / (x1 - x0);
      return Math.round(y0 + t * (y1 - y0));
    }
  }
  return 50;
}

export async function handleReportRoutes(request, env, userId, path) {
  const db = env.DB;

  const reportMatch = path.match(/^\/api\/tutor\/report\/([^/]+)$/);
  if (!reportMatch || request.method !== 'GET') return null;

  const childId = reportMatch[1];

  // Must be a tutor with this child on roster
  const tutor = await db.prepare('SELECT id, display_name FROM tutors WHERE id = ?').bind(userId).first();
  if (!tutor) return json({ error: 'No tutor profile found' }, 403);

  const link = await db.prepare(
    'SELECT joined_at FROM pupil_tutors WHERE tutor_id = ? AND child_id = ?'
  ).bind(userId, childId).first();
  if (!link) return json({ error: 'Child not on roster' }, 404);

  // Fetch all data in parallel — question_results is the ground truth for mastery
  const [child, questionResults, quizResults, mockResults, assignStats] = await Promise.all([
    db.prepare(`
      SELECT c.id, c.display_name, c.year_group, c.target_school
      FROM children c WHERE c.id = ?
    `).bind(childId).first(),

    // Per-question results — same query as tutor pupil endpoint
    db.prepare(`
      SELECT topic_key, subject, is_correct, attempted_at
      FROM question_results
      WHERE child_id = ?
      ORDER BY attempted_at DESC
      LIMIT 2000
    `).bind(childId).all(),

    // Quiz summaries for recent accuracy metric
    db.prepare(`
      SELECT topic_key, subject, score, total
      FROM quiz_results WHERE child_id = ?
      ORDER BY completed_at DESC LIMIT 20
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

  // ── Compute mastery using the same algorithm as useMastery ──
  // Group question_results by topic, normalise date format
  const byTopic = {};
  (questionResults.results || []).forEach(r => {
    const key = `${r.subject}:${r.topic_key}`;
    if (!byTopic[key]) byTopic[key] = { topicKey: r.topic_key, subject: r.subject, results: [] };
    byTopic[key].results.push({
      correct: !!r.is_correct,
      date: r.attempted_at ? r.attempted_at.replace(' ', 'T') : null,
    });
  });

  const now = Date.now();
  const topicData = Object.values(byTopic)
    .map(t => {
      const score = computeTopicMastery(t.results.filter(r => r.date), now);
      return score !== null ? { topicKey: t.topicKey, subject: t.subject, score } : null;
    })
    .filter(Boolean);

  // Overall mastery = mean of per-topic mastery scores (0-100)
  const overallScore = topicData.length > 0
    ? Math.round(topicData.reduce((sum, t) => sum + t.score, 0) / topicData.length)
    : 0;

  // Per-subject mastery
  const subjectScores = {};
  topicData.forEach(t => {
    if (!subjectScores[t.subject]) subjectScores[t.subject] = { total: 0, count: 0 };
    subjectScores[t.subject].total += t.score;
    subjectScores[t.subject].count++;
  });
  const subjectMastery = Object.fromEntries(
    Object.entries(subjectScores).map(([s, v]) => [s, v.count > 0 ? Math.round(v.total / v.count) : 0])
  );

  // Sorted topics for weakest/strongest
  const sorted = [...topicData].sort((a, b) => a.score - b.score);
  const weakestTopics = sorted.slice(0, 5).map(t => ({
    topicKey: t.topicKey, subject: t.subject, score: t.score,
  }));
  const strongestTopics = sorted.slice(-5).reverse().map(t => ({
    topicKey: t.topicKey, subject: t.subject, score: t.score,
  }));

  // Recent accuracy from last 20 quiz summaries (quick metric, not mastery)
  const recentAccuracy = quizResults.results.length > 0
    ? Math.round(quizResults.results.reduce((s, r) => s + (r.total > 0 ? r.score / r.total : 0), 0) / quizResults.results.length * 100)
    : 0;

  // Mock test summary
  const latestMockBySubject = {};
  (mockResults.results || []).forEach(m => {
    if (!latestMockBySubject[m.subject]) {
      latestMockBySubject[m.subject] = { subject: m.subject, percentage: m.percentage, date: m.completed_at };
    }
  });

  // Recommended topics: weakest 3 not recently assigned
  const recentlyAssigned = new Set(
    (await db.prepare(`
      SELECT DISTINCT ai.item_ref
      FROM assignment_recipients ar
      JOIN assignment_items ai ON ai.id = ar.assignment_item_id
      WHERE ar.child_id = ? AND ar.tutor_id = ?
      ORDER BY ar.assigned_at DESC LIMIT 20
    `).bind(childId, userId).all()).results.map(r => r.item_ref)
  );
  const recommendations = weakestTopics
    .filter(t => !recentlyAssigned.has(t.topicKey))
    .slice(0, 3);

  return json({
    generatedAt: new Date().toISOString(),
    tutorName: tutor.display_name,
    child: {
      name: child.display_name,
      yearGroup: child.year_group,
      targetSchool: child.target_school,
    },
    summary: {
      overallScore,
      estimatedPercentile: estimatePercentile(overallScore),
      recentAccuracy,
      topicsAssessed: topicData.length,
    },
    subjectMastery,
    weakestTopics,
    strongestTopics,
    mockTests: Object.values(latestMockBySubject),
    assignments: {
      total: assignStats?.total || 0,
      completed: assignStats?.completed || 0,
      late: assignStats?.late || 0,
    },
    recommendations,
  });
}

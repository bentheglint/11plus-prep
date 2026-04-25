// ── Report Data Endpoint ──
// GET /api/tutor/report/:childId — Structured report data for PDF generation
//
// Returns everything needed to render a per-pupil progress report:
// - Child profile
// - Overall mastery score + estimated GL percentile
// - Per-subject breakdown
// - 5 weakest + 5 strongest topics
// - Recent assignment completion rate
// - Mock test history summary
// - Recommended practice topics (weakest not yet assigned)

import { json } from '../helpers.js';

// ── Rough GL calibration curve ──
// Not school-specific (we don't have per-school data in v1).
// Based on GL Assessment grade boundaries: top ~25-30% pass selective.
function estimatePercentile(masteryScore) {
  // masteryScore is 0–1
  const s = Math.max(0, Math.min(1, masteryScore));
  // Linear interpolation across calibrated anchor points
  const anchors = [
    [0.00, 5],  [0.30, 15], [0.45, 30], [0.55, 45],
    [0.65, 58], [0.72, 68], [0.78, 76], [0.83, 83],
    [0.88, 89], [0.92, 93], [0.96, 97], [1.00, 99],
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

  // Fetch all the data in parallel
  const [child, quizResults, topicPerf, mockResults, assignStats] = await Promise.all([
    db.prepare(`
      SELECT c.id, c.display_name, c.year_group, c.target_school, c.created_at
      FROM children c WHERE c.id = ?
    `).bind(childId).first(),

    db.prepare(`
      SELECT topic_key, subject, score, total
      FROM quiz_results WHERE child_id = ?
      ORDER BY completed_at DESC LIMIT 200
    `).bind(childId).all(),

    db.prepare(
      'SELECT topic_key, subject, data FROM topic_performance WHERE child_id = ?'
    ).bind(childId).all(),

    db.prepare(`
      SELECT subject, total_correct, total_questions, percentage, completed_at
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

  // ── Compute mastery metrics ──
  const topicPerfParsed = topicPerf.results.map(r => ({
    topicKey: r.topic_key, subject: r.subject,
    data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data,
  })).filter(t => t.data?.score != null);

  // Overall mastery = mean of topic scores (weighted equally)
  const overallScore = topicPerfParsed.length > 0
    ? topicPerfParsed.reduce((sum, t) => sum + (t.data.score || 0), 0) / topicPerfParsed.length
    : 0;

  // Per-subject mastery
  const subjectScores = {};
  topicPerfParsed.forEach(t => {
    if (!subjectScores[t.subject]) subjectScores[t.subject] = { total: 0, count: 0 };
    subjectScores[t.subject].total += t.data.score || 0;
    subjectScores[t.subject].count++;
  });
  const subjectMastery = Object.fromEntries(
    Object.entries(subjectScores).map(([s, v]) => [s, v.count > 0 ? v.total / v.count : 0])
  );

  // Sorted topics
  const sorted = [...topicPerfParsed].sort((a, b) => (a.data.score || 0) - (b.data.score || 0));
  const weakestTopics = sorted.slice(0, 5).map(t => ({
    topicKey: t.topicKey, subject: t.subject, score: Math.round((t.data.score || 0) * 100),
  }));
  const strongestTopics = sorted.slice(-5).reverse().map(t => ({
    topicKey: t.topicKey, subject: t.subject, score: Math.round((t.data.score || 0) * 100),
  }));

  // Recent quiz accuracy
  const recentQuizzes = quizResults.results.slice(0, 20);
  const recentAccuracy = recentQuizzes.length > 0
    ? recentQuizzes.reduce((s, r) => s + (r.total > 0 ? r.score / r.total : 0), 0) / recentQuizzes.length
    : 0;

  // Mock test summary
  const mockSummary = mockResults.results.map(m => ({
    subject: m.subject,
    percentage: m.percentage,
    date: m.completed_at,
  }));
  const latestMockBySubject = {};
  mockSummary.forEach(m => {
    if (!latestMockBySubject[m.subject]) latestMockBySubject[m.subject] = m;
  });

  // Recommended topics: weakest 3 that haven't been assigned recently
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
      overallScore: Math.round(overallScore * 100),
      estimatedPercentile: estimatePercentile(overallScore),
      recentAccuracy: Math.round(recentAccuracy * 100),
      topicsAssessed: topicPerfParsed.length,
    },
    subjectMastery: Object.fromEntries(
      Object.entries(subjectMastery).map(([s, v]) => [s, Math.round(v * 100)])
    ),
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

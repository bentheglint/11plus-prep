// Builds the tutor dashboard payload (enriched roster + pulse) from raw rows.
//
// Lives in src/ so both sides can import it: CRA blocks app imports from
// outside src/, while wrangler's esbuild happily bundles this into the Worker
// (workers/ai-tutor/routes/tutor.js). One source of truth — the dashboard
// preview mock derives its data through this same function, so it cannot
// drift from what the Worker really returns.

const DAY_MS = 86400000;

// Most recent activity timestamp (ms) across all activity types for a child,
// or null if they've never done anything. new Date() handles both the ISO
// strings quizzes/lessons store and the "YYYY-MM-DD HH:MM:SS" format.
function lastActiveTs(childId, activityMaps) {
  const ts = activityMaps
    .map(m => m[childId])
    .filter(Boolean)
    .map(d => new Date(d).getTime())
    .filter(t => !Number.isNaN(t));
  return ts.length ? Math.max(...ts) : null;
}

export function buildDashboardData({
  roster,
  quizActiveRows,
  mockActiveRows,
  lessonActiveRows,
  weeklyRows,
  topicRows,
  overdueRows,
  now,
}) {
  const quizActiveMap = Object.fromEntries((quizActiveRows || []).map(r => [r.child_id, r.last_active]));
  const mockActiveMap = Object.fromEntries((mockActiveRows || []).map(r => [r.child_id, r.last_active]));
  const lessonActiveMap = Object.fromEntries((lessonActiveRows || []).map(r => [r.child_id, r.last_active]));
  const weeklyMap = Object.fromEntries((weeklyRows || []).map(r => [r.child_id, r]));
  const activityMaps = [quizActiveMap, mockActiveMap, lessonActiveMap];

  // Overdue counts per child, derived from the same rows the detail view
  // shows — one definition of "overdue" for both the badge and the list.
  const overdueCountMap = {};
  for (const row of (overdueRows || [])) {
    overdueCountMap[row.child_id] = (overdueCountMap[row.child_id] || 0) + 1;
  }

  // Weakest topic per child — topicRows ordered accuracy ASC per child, take first
  const weakestTopicMap = {};
  for (const row of (topicRows || [])) {
    if (!weakestTopicMap[row.child_id]) weakestTopicMap[row.child_id] = row;
  }

  const enrichedRoster = roster.map(child => {
    const lastActiveMs = lastActiveTs(child.id, activityMaps);
    const lastActive = lastActiveMs !== null ? new Date(lastActiveMs).toISOString() : null;
    const daysInactive = lastActiveMs !== null
      ? Math.floor((now - lastActiveMs) / DAY_MS)
      : null;
    const weekly = weeklyMap[child.id] || null;
    const weakest = weakestTopicMap[child.id] || null;
    const overdueCount = overdueCountMap[child.id] || 0;

    return {
      ...child,
      last_active: lastActive,
      days_inactive: daysInactive,
      quizzes_this_week: weekly?.quiz_count || 0,
      accuracy_this_week: weekly ? Math.round(weekly.accuracy * 100) : null,
      weakest_topic: weakest?.topic_key || null,
      weakest_subject: weakest?.subject || null,
      weakest_accuracy: weakest ? Math.round(weakest.accuracy * 100) : null,
      overdue_assignments: overdueCount,
      assignment_status: overdueCount > 0 ? 'overdue' : weekly ? 'on_track' : 'none',
    };
  });

  // Sort: most at-risk first (inactive longest, then by accuracy)
  enrichedRoster.sort((a, b) => {
    const aInactive = a.days_inactive ?? 999;
    const bInactive = b.days_inactive ?? 999;
    if (aInactive !== bInactive) return bInactive - aInactive;
    return (a.accuracy_this_week ?? -1) - (b.accuracy_this_week ?? -1);
  });

  const activeThisWeek = enrichedRoster.filter(c => c.days_inactive !== null && c.days_inactive <= 7).length;

  const weeklyAccuracies = enrichedRoster.filter(c => c.accuracy_this_week !== null);
  const avgAccuracy = weeklyAccuracies.length > 0
    ? Math.round(weeklyAccuracies.reduce((s, c) => s + c.accuracy_this_week, 0) / weeklyAccuracies.length)
    : null;

  // Overdue detail rows — child_name resolved from the roster, days_overdue
  // from the due date (due_date is date-only; "due yesterday" = 1 day overdue).
  const nameById = Object.fromEntries(roster.map(c => [c.id, c.display_name]));
  const overdue = (overdueRows || []).map(row => {
    const dueMs = new Date(row.due_date).getTime();
    const daysOverdue = Number.isNaN(dueMs) ? null : Math.max(1, Math.floor((now - dueMs) / DAY_MS));
    return {
      child_id: row.child_id,
      child_name: nameById[row.child_id] || null,
      assignment_id: row.assignment_id,
      assignment_title: row.title || null,
      due_date: row.due_date,
      days_overdue: daysOverdue,
    };
  });

  // Group weak topics — aggregate per-pupil topic accuracy across the roster,
  // keep topics ≥2 pupils have attempted, weakest 3 first, each with its
  // per-pupil breakdown (names resolve from the roster client-side by id).
  const byTopic = {};
  for (const row of (topicRows || [])) {
    if (!byTopic[row.topic_key]) {
      byTopic[row.topic_key] = { subject: row.subject, total: 0, pupils: [] };
    }
    byTopic[row.topic_key].total += row.accuracy;
    byTopic[row.topic_key].pupils.push({
      child_id: row.child_id,
      accuracy: Math.round(row.accuracy * 100),
      quiz_count: row.quiz_count,
    });
  }
  const weak_topics = Object.entries(byTopic)
    .filter(([, val]) => val.pupils.length >= 2)
    .map(([topic_key, val]) => ({
      topic_key,
      subject: val.subject,
      accuracy: Math.round((val.total / val.pupils.length) * 100),
      pupil_count: val.pupils.length,
      pupils: [...val.pupils].sort((a, b) => a.accuracy - b.accuracy),
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  return {
    roster: enrichedRoster,
    pulse: {
      active_this_week: activeThisWeek,
      total_pupils: roster.length,
      overdue_assignments: overdue.length,
      avg_accuracy_this_week: avgAccuracy,
      overdue,
      weak_topics,
    },
  };
}

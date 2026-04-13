// ── Batch Write Endpoint ──
// Accepts an array of typed operations, deduplicates by UUID,
// executes atomically in db.batch() chunks (data + UUID marker together).

import { json, getChildId } from '../helpers.js';

const MAX_OPS_PER_REQUEST = 100;
const MAX_PP_DELTA_PER_OP = 500;
const DEDUP_TTL_DAYS = 7;

// Valid operation types
const VALID_TYPES = new Set([
  'question-result', 'quiz-result', 'mock-result', 'practice-session',
  'lesson-complete', 'seen-question', 'achievement', 'seen-tip',
  'streaks', 'prep-points', 'preferences', 'topic-performance',
  'leitner-entry',
]);

// Mutable types that need version checks
const MUTABLE_TYPES = new Set(['streaks', 'prep-points', 'preferences', 'topic-performance']);

/**
 * Build a D1 prepared statement for an append-only operation.
 * Returns the statement or null if invalid.
 */
function buildAppendStatement(db, childId, type, payload) {
  switch (type) {
    case 'question-result': {
      const { questionId, topicKey, subject, isCorrect, timeMs, difficulty } = payload;
      if (questionId == null || !topicKey || !subject || isCorrect == null) return null;
      return db.prepare(
        `INSERT INTO question_results (child_id, question_id, topic_key, subject, is_correct, time_ms, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(childId, questionId, topicKey, subject, isCorrect ? 1 : 0, timeMs || null, difficulty || null);
    }
    case 'quiz-result': {
      const { topicKey, subject, score, total, timeSeconds, quizMode } = payload;
      if (!topicKey || !subject || score == null || !total) return null;
      return db.prepare(
        `INSERT INTO quiz_results (child_id, topic_key, subject, score, total, time_seconds, quiz_mode) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(childId, topicKey, subject, score, total, timeSeconds || null, quizMode || null);
    }
    case 'mock-result': {
      const { subject, totalQuestions, totalCorrect, percentage, timeTaken, timeLimit, sectionResults, questionTimes } = payload;
      if (!subject || totalQuestions == null || totalCorrect == null) return null;
      return db.prepare(
        `INSERT INTO mock_test_results (child_id, subject, total_questions, total_correct, percentage, time_taken, time_limit, section_results, question_times) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(childId, subject, totalQuestions, totalCorrect, percentage || 0, timeTaken || 0, timeLimit || 0, JSON.stringify(sectionResults || {}), JSON.stringify(questionTimes || {}));
    }
    case 'practice-session': {
      const { sessionDate, data } = payload;
      if (!sessionDate || !data) return null;
      return db.prepare(
        `INSERT INTO practice_sessions (child_id, session_date, data) VALUES (?, ?, ?)
         ON CONFLICT(child_id, session_date) DO UPDATE SET data = excluded.data, created_at = datetime('now')`
      ).bind(childId, sessionDate, JSON.stringify(data));
    }
    case 'lesson-complete': {
      const { lessonId } = payload;
      if (!lessonId) return null;
      return db.prepare(
        `INSERT OR IGNORE INTO lesson_history (child_id, lesson_id) VALUES (?, ?)`
      ).bind(childId, lessonId);
    }
    case 'seen-question': {
      const { questionId, topicKey, subject } = payload;
      if (questionId == null || !topicKey || !subject) return null;
      return db.prepare(
        `INSERT OR IGNORE INTO seen_questions (child_id, question_id, topic_key, subject) VALUES (?, ?, ?, ?)`
      ).bind(childId, questionId, topicKey, subject);
    }
    case 'achievement': {
      const { achievementId } = payload;
      if (!achievementId) return null;
      return db.prepare(
        `INSERT OR IGNORE INTO achievements (child_id, achievement_id) VALUES (?, ?)`
      ).bind(childId, achievementId);
    }
    case 'seen-tip': {
      const { tipId, lastSeenDate } = payload;
      if (!tipId || !lastSeenDate) return null;
      return db.prepare(
        `INSERT INTO seen_tips (child_id, tip_id, last_seen_date) VALUES (?, ?, ?)
         ON CONFLICT(child_id, tip_id) DO UPDATE SET last_seen_date = excluded.last_seen_date`
      ).bind(childId, tipId, lastSeenDate);
    }
    case 'leitner-entry': {
      const { questionId, topicKey, subject, level, lastReviewed, nextReview, timesCorrect, timesIncorrect } = payload;
      if (questionId == null || !topicKey) return null;
      return db.prepare(
        `INSERT INTO leitner_queue (child_id, question_id, topic_key, subject, level, last_reviewed, next_review, times_correct, times_incorrect)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(child_id, question_id, topic_key) DO UPDATE SET
           level = excluded.level, last_reviewed = excluded.last_reviewed,
           next_review = excluded.next_review, times_correct = excluded.times_correct,
           times_incorrect = excluded.times_incorrect`
      ).bind(childId, questionId, topicKey, subject || '', level ?? 0, lastReviewed || null, nextReview || null, timesCorrect ?? 0, timesIncorrect ?? 0);
    }
    default:
      return null;
  }
}

/**
 * Build a UUID dedup marker INSERT statement.
 * Paired with data statements in the same db.batch() call for atomicity.
 */
function buildUUIDMarker(db, childId, uuid, type) {
  return db.prepare(
    `INSERT INTO processed_operations (operation_uuid, child_id, operation_type) VALUES (?, ?, ?)`
  ).bind(uuid, childId, type);
}

export async function handleBatch(request, env, userId) {
  const db = env.DB;
  const childId = await getChildId(db, userId);
  if (!childId) return json({ error: 'No child profile. Create one first.' }, 404);

  const body = await request.json();
  const operations = body.operations;
  if (!Array.isArray(operations) || operations.length === 0) {
    return json({ error: 'operations must be a non-empty array' }, 400);
  }
  if (operations.length > MAX_OPS_PER_REQUEST) {
    return json({ error: `Maximum ${MAX_OPS_PER_REQUEST} operations per request` }, 400);
  }

  // Validate all operations have required fields
  for (const op of operations) {
    if (!op.uuid || !op.type || !op.payload) {
      return json({ error: `Each operation requires uuid, type, and payload` }, 400);
    }
    if (!VALID_TYPES.has(op.type)) {
      return json({ error: `Unknown operation type: ${op.type}` }, 400);
    }
  }

  // Check which UUIDs are already processed (dedup)
  const uuids = operations.map(op => op.uuid);
  const placeholders = uuids.map(() => '?').join(',');
  const { results: existingOps } = await db.prepare(
    `SELECT operation_uuid FROM processed_operations WHERE operation_uuid IN (${placeholders})`
  ).bind(...uuids).all();
  const processedUUIDs = new Set(existingOps.map(r => r.operation_uuid));

  // Fetch current versions for mutable records (needed for version checks)
  const [streaksRow, ppRow, prefsRow] = await Promise.all([
    db.prepare('SELECT version, current_streak, longest_streak, last_quiz_date, streak_history FROM streaks WHERE child_id = ?').bind(childId).first(),
    db.prepare('SELECT version, total, level, today_pp, today_date FROM prep_points WHERE child_id = ?').bind(childId).first(),
    db.prepare('SELECT version, last_session_date FROM preferences WHERE child_id = ?').bind(childId).first(),
  ]);

  const currentVersions = {
    streaks: streaksRow?.version ?? 1,
    'prep-points': ppRow?.version ?? 1,
    preferences: prefsRow?.version ?? 1,
  };

  // Process each operation
  const results = [];
  const statements = []; // Pairs of [dataStmt, uuidMarkerStmt]

  for (const op of operations) {
    // Skip already-processed (idempotent)
    if (processedUUIDs.has(op.uuid)) {
      results.push({ uuid: op.uuid, status: 'duplicate' });
      continue;
    }

    // Handle mutable operations with version checks
    if (MUTABLE_TYPES.has(op.type)) {
      const versionKey = op.type;
      const clientVersion = op.payload.version;

      if (clientVersion == null) {
        results.push({ uuid: op.uuid, status: 'error', error: 'Missing version' });
        continue;
      }

      if (versionKey === 'topic-performance') {
        // Topic performance is keyed by topicKey+subject, handle separately
        const { topicKey, subject, version, data } = op.payload;
        if (!topicKey || !subject || !data) {
          results.push({ uuid: op.uuid, status: 'error', error: 'Missing topicKey, subject, or data' });
          continue;
        }
        // Upsert — no version conflict for topic-performance (it uses ON CONFLICT)
        const stmt = db.prepare(
          `INSERT INTO topic_performance (child_id, topic_key, subject, data, version)
           VALUES (?, ?, ?, ?, 1)
           ON CONFLICT(child_id, topic_key, subject) DO UPDATE SET
             data = excluded.data, version = topic_performance.version + 1, updated_at = datetime('now')`
        ).bind(childId, topicKey, subject, JSON.stringify(data));
        statements.push(stmt);
        statements.push(buildUUIDMarker(db, childId, op.uuid, op.type));
        results.push({ uuid: op.uuid, status: 'ok' });
        continue;
      }

      // Streaks, prep-points, preferences — check version
      const currentVersion = currentVersions[versionKey];
      if (clientVersion !== currentVersion) {
        const currentData = versionKey === 'streaks' ? streaksRow
          : versionKey === 'prep-points' ? ppRow
          : prefsRow;
        results.push({
          uuid: op.uuid,
          status: 'conflict',
          currentVersion,
          currentData,
        });
        continue;
      }

      // PP validation: total can only increase, delta must be reasonable
      if (versionKey === 'prep-points' && ppRow) {
        const delta = (op.payload.total ?? 0) - ppRow.total;
        if (delta < 0) {
          results.push({ uuid: op.uuid, status: 'error', error: 'PP total cannot decrease' });
          continue;
        }
        if (delta > MAX_PP_DELTA_PER_OP) {
          results.push({ uuid: op.uuid, status: 'error', error: `PP delta ${delta} exceeds maximum ${MAX_PP_DELTA_PER_OP}` });
          continue;
        }
      }

      // Build the mutable UPDATE statement
      let stmt;
      if (versionKey === 'streaks') {
        const { currentStreak, longestStreak, lastQuizDate, streakHistory } = op.payload;
        stmt = db.prepare(
          `UPDATE streaks SET current_streak = ?, longest_streak = ?, last_quiz_date = ?,
           streak_history = ?, version = version + 1, updated_at = datetime('now')
           WHERE child_id = ?`
        ).bind(currentStreak ?? 0, longestStreak ?? 0, lastQuizDate || null, JSON.stringify(streakHistory || []), childId);
        currentVersions.streaks++;
      } else if (versionKey === 'prep-points') {
        const { total, level, todayPP, todayDate } = op.payload;
        stmt = db.prepare(
          `UPDATE prep_points SET total = ?, level = ?, today_pp = ?, today_date = ?,
           version = version + 1, updated_at = datetime('now')
           WHERE child_id = ?`
        ).bind(total ?? 0, level ?? 1, todayPP ?? 0, todayDate || null, childId);
        currentVersions['prep-points']++;
      } else if (versionKey === 'preferences') {
        const { lastSessionDate } = op.payload;
        stmt = db.prepare(
          `UPDATE preferences SET last_session_date = ?, version = version + 1, updated_at = datetime('now')
           WHERE child_id = ?`
        ).bind(lastSessionDate || null, childId);
        currentVersions.preferences++;
      }

      if (stmt) {
        statements.push(stmt);
        statements.push(buildUUIDMarker(db, childId, op.uuid, op.type));
        results.push({ uuid: op.uuid, status: 'ok' });
      }
      continue;
    }

    // Append-only operations
    const stmt = buildAppendStatement(db, childId, op.type, op.payload);
    if (!stmt) {
      results.push({ uuid: op.uuid, status: 'error', error: 'Invalid payload for type ' + op.type });
      continue;
    }

    // Pair data statement with UUID marker (atomic — Codex Finding 1)
    statements.push(stmt);
    statements.push(buildUUIDMarker(db, childId, op.uuid, op.type));
    results.push({ uuid: op.uuid, status: 'ok' });
  }

  // Execute all statements in db.batch() — atomic per call
  // D1 batch limit is 100 statements, so chunk if needed
  // Each operation = 2 statements (data + UUID marker), so 50 ops = 100 stmts
  if (statements.length > 0) {
    const CHUNK_SIZE = 100;
    for (let i = 0; i < statements.length; i += CHUNK_SIZE) {
      await db.batch(statements.slice(i, i + CHUNK_SIZE));
    }
  }

  // Lazy cleanup: delete old processed_operations (> 7 days)
  await db.prepare(
    `DELETE FROM processed_operations WHERE created_at < datetime('now', '-${DEDUP_TTL_DAYS} days')`
  ).run();

  // Return results + current versions for mutable state
  const processed = results.filter(r => r.status === 'ok').length;
  const skipped = results.filter(r => r.status === 'duplicate').length;
  const conflicts = results.filter(r => r.status === 'conflict');

  return json({
    ok: conflicts.length === 0,
    processed,
    skipped,
    conflicts,
    versions: {
      streaks: currentVersions.streaks,
      prepPoints: currentVersions['prep-points'],
      preferences: currentVersions.preferences,
    },
    results,
  });
}

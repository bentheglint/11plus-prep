// ── Batch Write Endpoint ──
// Accepts an array of typed operations, deduplicates by UUID.
// Each operation executes in its own tiny atomic db.batch() of
// (data-stmt + uuid-marker) so a UUID race on one op never rolls back others.

import { json, resolveChildId } from '../helpers.js';

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

// ── Topic-key normalisation (Codex Fix B-Worker) ──
// Old clients write display names ("Ratio & Proportion"); new clients write
// slugs ("ratio"). Normalise on ingest so stale tabs cannot re-pollute the
// column after migration.
const TOPIC_NAME_TO_SLUG = {
  'Ratio & Proportion': 'ratio',
  'Long Multiplication': 'longmultiplication',
  'Long Division': 'longdivision',
  'Prime Numbers & Factors': 'primenumbersfactors',
  'Place Value and Rounding': 'placevalue',
  'Place Value': 'placevalue',
  'Area and Perimeter': 'areaperimeter',
  'Area & Perimeter': 'areaperimeter',
  'Angles and Shapes': 'anglesshapes',
  'Angles & Shapes': 'anglesshapes',
  'Negative Numbers': 'negativenumbers',
  'Speed, Distance, Time': 'speeddistancetime',
  'Data Handling': 'datahandling',
  'Daily Learning': 'daily-learning',
  'Odd Two Out': 'oddTwoOut',
  'Hidden Words': 'hiddenWords',
  'Missing Letters & Words': 'missingLettersWords',
  'Missing Letters': 'missingLettersWords',
  'Letter Sums & Missing Numbers': 'letterSums',
  'Letter Sums': 'letterSums',
  'Logic & Language Puzzles': 'logicAndLanguage',
  'Logic & Language': 'logicAndLanguage',
  'Shared Letter': 'sharedLetter',
  'Verbal Analogies': 'verbalAnalogies',
  'Word Patterns & Codes': 'wordCodeAnalogies',
  'Word Codes': 'wordCodeAnalogies',
  'Compound Words': 'compoundWords',
  'Letter Move': 'letterMove',
  'Letter Codes': 'letterCodes',
  'Letter Pair Series': 'letterPairSeries',
  'Letter Pairs': 'letterPairSeries',
  'Number Series': 'numberSeries',
  'Number Word Codes': 'numberWordCodes',
  'Word Class': 'wordClassGrammar',
  'Word Class & Grammar': 'wordClassGrammar',
  'Reading Comprehension': 'comprehension',
  // Capitalised single-word display names → slug equivalents
  'Percentages': 'percentages',
  'Decimals': 'decimals',
  'Fractions': 'fractions',
  'Algebra': 'algebra',
  'Volume': 'volume',
  'Sequences': 'sequences',
  'Comprehension': 'comprehension',
  'Spelling': 'spelling',
  'Punctuation': 'punctuation',
  'Grammar': 'grammar',
  'Vocabulary': 'vocabulary',
  'Synonyms': 'synonyms',
  'Antonyms': 'antonyms',
};

export function normaliseTopicKey(key) {
  if (!key) return key;
  return TOPIC_NAME_TO_SLUG[key] || key;
}

/**
 * Build a D1 prepared statement for an append-only operation.
 * Returns the statement or null if invalid.
 */
function buildAppendStatement(db, childId, type, payload) {
  switch (type) {
    case 'question-result': {
      const { questionId, subject, isCorrect, timeMs, difficulty, sessionId, selectedAnswer } = payload;
      const topicKey = normaliseTopicKey(payload.topicKey);
      if (questionId == null || !topicKey || !subject || isCorrect == null) return null;
      // selectedAnswer is stored as TEXT (JSON): integer for MCQ, sorted pair for select-two, {A,B} for pick-from-sets
      const selectedAnswerJson = selectedAnswer !== undefined && selectedAnswer !== null
        ? JSON.stringify(selectedAnswer)
        : null;
      // INSERT OR IGNORE so a stale SyncQueue replay (after the 27 April
      // wipe + restore) silently no-ops on rows already restored. Backed by
      // the partial UNIQUE INDEX in migration 0007 on
      // (child_id, question_id, session_id, topic_key) WHERE session_id IS NOT NULL.
      return db.prepare(
        `INSERT OR IGNORE INTO question_results (child_id, question_id, topic_key, subject, is_correct, time_ms, difficulty, session_id, selected_answer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(childId, questionId, topicKey, subject, isCorrect ? 1 : 0, timeMs || null, difficulty || null, sessionId || null, selectedAnswerJson);
    }
    case 'quiz-result': {
      const { subject, score, total, timeSeconds, quizMode, sessionId } = payload;
      const topicKey = normaliseTopicKey(payload.topicKey);
      if (!topicKey || !subject || score == null || !total) return null;
      // INSERT OR IGNORE — see question-result above for rationale.
      // Partial UNIQUE on (child_id, session_id, topic_key, subject) where session_id IS NOT NULL.
      return db.prepare(
        `INSERT OR IGNORE INTO quiz_results (child_id, topic_key, subject, score, total, time_seconds, quiz_mode, session_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(childId, topicKey, subject, score, total, timeSeconds || null, quizMode || null, sessionId || null);
    }
    case 'mock-result': {
      const { subject, totalQuestions, totalCorrect, percentage, timeTaken, timeLimit, sectionResults, questionTimes } = payload;
      if (!subject || totalQuestions == null || totalCorrect == null) return null;
      return db.prepare(
        `INSERT INTO mock_test_results (child_id, subject, total_questions, total_correct, percentage, time_taken, time_limit, section_results, question_times) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(childId, subject, totalQuestions, totalCorrect, percentage || 0, timeTaken || 0, timeLimit || 0, JSON.stringify(sectionResults || {}), JSON.stringify(questionTimes || {}));
    }
    case 'practice-session': {
      // Codex Fix D: merge day totals rather than overwrite. Multiple quizzes on
      // the same day previously clobbered each other because the old SQL did
      // `ON CONFLICT DO UPDATE SET data = excluded.data`. We now accumulate
      // questionsAttempted + questionsCorrect into the existing row.
      const { sessionDate, data } = payload;
      if (!sessionDate || !data) return null;
      const attemptedDelta = Number(data.questionsAttempted) || 0;
      const correctDelta = Number(data.questionsCorrect) || 0;
      return db.prepare(
        `INSERT INTO practice_sessions (child_id, session_date, data) VALUES (?, ?, ?)
         ON CONFLICT(child_id, session_date) DO UPDATE SET
           data = json_set(
             data,
             '$.questionsAttempted', COALESCE(CAST(json_extract(data, '$.questionsAttempted') AS INTEGER), 0) + ?,
             '$.questionsCorrect',   COALESCE(CAST(json_extract(data, '$.questionsCorrect') AS INTEGER), 0) + ?,
             '$.lastUpdated',        datetime('now')
           ),
           created_at = created_at`
      ).bind(childId, sessionDate, JSON.stringify(data), attemptedDelta, correctDelta);
    }
    case 'lesson-complete': {
      const { lessonId } = payload;
      if (!lessonId) return null;
      return db.prepare(
        `INSERT OR IGNORE INTO lesson_history (child_id, lesson_id) VALUES (?, ?)`
      ).bind(childId, lessonId);
    }
    case 'seen-question': {
      const { questionId, subject } = payload;
      const topicKey = normaliseTopicKey(payload.topicKey);
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
      const { questionId, subject, level, lastReviewed, nextReview, timesCorrect, timesIncorrect } = payload;
      const topicKey = normaliseTopicKey(payload.topicKey);
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
 * Paired with data statement in a tiny per-op db.batch() for atomicity.
 */
function buildUUIDMarker(db, childId, uuid, type) {
  return db.prepare(
    `INSERT INTO processed_operations (operation_uuid, child_id, operation_type) VALUES (?, ?, ?)`
  ).bind(uuid, childId, type);
}

function isUuidConflictError(err) {
  const msg = String(err?.message || err || '');
  return msg.includes('UNIQUE') && msg.includes('processed_operations');
}

export async function handleBatch(request, env, userId) {
  const db = env.DB;
  const body = await request.json();
  const operations = body.operations;
  const requestedChildId = body.child_id || null;
  const childId = await resolveChildId(db, userId, requestedChildId);
  if (!childId) return json({ error: 'No child profile. Create one first.' }, 404);
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

  // Check which UUIDs are already processed (dedup, fast path for the common case)
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

  // Build per-operation execution plans. Two flavours:
  //   - Append-only / idempotent: data stmt + marker run in a tiny atomic
  //     batch (existing behaviour). INSERT OR IGNORE / ON CONFLICT means
  //     replays of already-restored rows silently no-op. Marker write is
  //     unconditional so the client stops retrying.
  //   - Mutable with CAS (streaks/prep_points/preferences/topic_performance):
  //     data stmt runs atomic compare-and-swap (UPDATE ... WHERE version = ?).
  //     If meta.changes === 0, the update lost the race — return 'conflict'
  //     and DO NOT write the UUID marker (so client can refetch + retry with
  //     a fresh UUID). If meta.changes === 1, write the marker.
  //
  //   This addresses Codex review findings A (topic-performance had no version
  //   check) and B (TOCTOU lost-update race on streaks/PP/prefs).
  const results = [];
  const opPlans = []; // Array<{ uuid, resultIndex, kind: 'append' | 'cas', ... }>

  for (const op of operations) {
    // Skip already-processed (idempotent)
    if (processedUUIDs.has(op.uuid)) {
      results.push({ uuid: op.uuid, status: 'duplicate' });
      continue;
    }

    // Mutable operations — atomic compare-and-swap
    if (MUTABLE_TYPES.has(op.type)) {
      const versionKey = op.type;
      const clientVersion = op.payload.version;

      if (clientVersion == null) {
        results.push({ uuid: op.uuid, status: 'error', error: 'Missing version' });
        continue;
      }

      if (versionKey === 'topic-performance') {
        const { subject, data } = op.payload;
        const topicKey = normaliseTopicKey(op.payload.topicKey);
        if (!topicKey || !subject || !data) {
          results.push({ uuid: op.uuid, status: 'error', error: 'Missing topicKey, subject, or data' });
          continue;
        }
        // Atomic upsert: INSERT a new row at version 1, OR (on conflict) UPDATE
        // only if the existing row's version matches the client's claim.
        // meta.changes === 0 means: a row existed with a different version → conflict.
        const dataStmt = db.prepare(
          `INSERT INTO topic_performance (child_id, topic_key, subject, data, version)
           VALUES (?, ?, ?, ?, 1)
           ON CONFLICT(child_id, topic_key, subject) DO UPDATE SET
             data = excluded.data,
             version = topic_performance.version + 1,
             updated_at = datetime('now')
           WHERE topic_performance.version = ?`
        ).bind(childId, topicKey, subject, JSON.stringify(data), clientVersion);
        const resultIndex = results.length;
        results.push({ uuid: op.uuid, status: 'pending' });
        opPlans.push({
          uuid: op.uuid,
          resultIndex,
          kind: 'cas',
          versionKey,
          clientVersion,
          topicKey,
          subject,
          dataStmt,
          markerStmt: buildUUIDMarker(db, childId, op.uuid, op.type),
        });
        continue;
      }

      // Streaks / prep_points / preferences — pre-check, then atomic CAS UPDATE.
      // Pre-check is best-effort (saves us building a stmt for an obvious
      // mismatch); the SQL WHERE version=? is the real conflict gate.
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

      // Build the atomic CAS UPDATE
      let dataStmt;
      if (versionKey === 'streaks') {
        const { currentStreak, longestStreak, lastQuizDate, streakHistory } = op.payload;
        dataStmt = db.prepare(
          `UPDATE streaks SET current_streak = ?, longest_streak = ?, last_quiz_date = ?,
           streak_history = ?, version = version + 1, updated_at = datetime('now')
           WHERE child_id = ? AND version = ?`
        ).bind(currentStreak ?? 0, longestStreak ?? 0, lastQuizDate || null,
               JSON.stringify(streakHistory || []), childId, clientVersion);
      } else if (versionKey === 'prep-points') {
        const { total, level, todayPP, todayDate } = op.payload;
        dataStmt = db.prepare(
          `UPDATE prep_points SET total = ?, level = ?, today_pp = ?, today_date = ?,
           version = version + 1, updated_at = datetime('now')
           WHERE child_id = ? AND version = ?`
        ).bind(total ?? 0, level ?? 1, todayPP ?? 0, todayDate || null, childId, clientVersion);
      } else if (versionKey === 'preferences') {
        const { lastSessionDate } = op.payload;
        dataStmt = db.prepare(
          `UPDATE preferences SET last_session_date = ?, version = version + 1, updated_at = datetime('now')
           WHERE child_id = ? AND version = ?`
        ).bind(lastSessionDate || null, childId, clientVersion);
      }

      if (dataStmt) {
        const resultIndex = results.length;
        results.push({ uuid: op.uuid, status: 'pending' });
        opPlans.push({
          uuid: op.uuid,
          resultIndex,
          kind: 'cas',
          versionKey,
          clientVersion,
          dataStmt,
          markerStmt: buildUUIDMarker(db, childId, op.uuid, op.type),
        });
      }
      continue;
    }

    // Append-only operations (UUID dedup + table-level idempotency for quiz/question_results)
    const stmt = buildAppendStatement(db, childId, op.type, op.payload);
    if (!stmt) {
      results.push({ uuid: op.uuid, status: 'error', error: 'Invalid payload for type ' + op.type });
      continue;
    }

    const resultIndex = results.length;
    results.push({ uuid: op.uuid, status: 'ok' });
    opPlans.push({
      uuid: op.uuid,
      resultIndex,
      kind: 'append',
      stmts: [stmt, buildUUIDMarker(db, childId, op.uuid, op.type)],
    });
  }

  // Track the latest version we've actually committed for each scalar table
  // (streaks/prep_points/preferences). Reflects real DB state, not optimistic
  // bookkeeping. Used in the response so clients have a fresh post-batch
  // version to optimistic-lock against next time.
  const finalVersions = {
    streaks: currentVersions.streaks,
    'prep-points': currentVersions['prep-points'],
    preferences: currentVersions.preferences,
  };

  // Execute. For 'append' ops we keep the atomic per-op batch (data + marker).
  // For 'cas' ops we run sequentially: data stmt → check meta.changes →
  // only commit marker if data update actually happened. This way a conflict
  // (changes === 0) leaves processed_operations clean so the client can
  // retry with a fresh UUID after refetching state.
  for (const plan of opPlans) {
    try {
      if (plan.kind === 'append') {
        await db.batch(plan.stmts);
        // status was set to 'ok' when the plan was queued; nothing to update
      } else {
        // CAS path
        const dataResult = await plan.dataStmt.run();
        if (dataResult?.meta?.changes === 0) {
          // Lost the race or pre-check was stale. Fetch fresh state for the client.
          let currentData = null;
          let currentVersion = null;
          if (plan.versionKey === 'topic-performance') {
            const fresh = await db.prepare(
              'SELECT version, data FROM topic_performance WHERE child_id = ? AND topic_key = ? AND subject = ?'
            ).bind(childId, plan.topicKey, plan.subject).first();
            if (fresh) {
              currentVersion = fresh.version;
              currentData = JSON.parse(fresh.data);
            }
          } else {
            const tableMap = { 'streaks': 'streaks', 'prep-points': 'prep_points', 'preferences': 'preferences' };
            const table = tableMap[plan.versionKey];
            const fresh = await db.prepare(
              `SELECT * FROM ${table} WHERE child_id = ?`
            ).bind(childId).first();
            if (fresh) {
              currentVersion = fresh.version;
              currentData = fresh;
            }
          }
          // Update finalVersions to reflect what we just observed.
          if (currentVersion != null && plan.versionKey in finalVersions) {
            finalVersions[plan.versionKey] = currentVersion;
          }
          results[plan.resultIndex] = {
            uuid: plan.uuid,
            status: 'conflict',
            currentVersion,
            currentData,
          };
          continue;
        }
        // Data committed. Now mark the UUID. If marker insertion races
        // (extremely rare), the client treats it as a duplicate response —
        // the data was applied, retries will see CAS fail anyway.
        try {
          await plan.markerStmt.run();
        } catch (err) {
          if (!isUuidConflictError(err)) throw err;
        }
        const newVersion = plan.clientVersion + 1;
        if (plan.versionKey in finalVersions) {
          finalVersions[plan.versionKey] = newVersion;
        }
        results[plan.resultIndex] = {
          uuid: plan.uuid,
          status: 'ok',
          newVersion,
        };
      }
    } catch (err) {
      if (isUuidConflictError(err)) {
        results[plan.resultIndex] = { uuid: plan.uuid, status: 'duplicate' };
      } else {
        results[plan.resultIndex] = {
          uuid: plan.uuid,
          status: 'error',
          error: String(err?.message || err),
        };
      }
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
      streaks: finalVersions.streaks,
      prepPoints: finalVersions['prep-points'],
      preferences: finalVersions.preferences,
    },
    results,
  });
}

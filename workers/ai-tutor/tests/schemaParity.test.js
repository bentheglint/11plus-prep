import { describe, it, expect, beforeAll } from 'vitest';
import { env } from 'cloudflare:test';
import { createSchema } from './helpers.js';
import { createDataSchema } from './data-helpers.js';

// The test schema in data-helpers.js is hand-maintained and CAN drift from
// production. On 10-12 Jun 2026 the test copy of lesson_history had an
// id INTEGER PRIMARY KEY that prod (migration 0001) never had; bulk.js
// selected it, every test passed, and production's /api/data/all threw
// "no such column: id" for every user — two days of silent stale-cache
// fallback on all devices.
//
// This test pins the TEST schema to a snapshot of PRODUCTION's actual
// columns. If it fails, either (a) the test schema drifted — fix it to
// match prod, or (b) a real migration changed prod — regenerate the
// snapshot below and update data-helpers.js together:
//
//   npx wrangler d1 execute 11plus-user-data --remote --command "SELECT
//   m.name AS tbl, group_concat(p.name) AS cols FROM sqlite_master m,
//   pragma_table_info(m.name) p WHERE m.type='table' GROUP BY m.name"
//
// Snapshot taken 12 Jun 2026.
const PROD_COLUMNS = {
  achievements: 'child_id,achievement_id,unlocked_at,seen',
  leitner_queue: 'child_id,question_id,topic_key,subject,level,last_reviewed,next_review,times_correct,times_incorrect',
  lesson_history: 'child_id,lesson_id,completed_at',
  migrations: 'child_id,migrated_at,source,items_imported',
  mock_test_results: 'id,child_id,subject,total_questions,total_correct,percentage,time_taken,time_limit,section_results,question_times,completed_at',
  practice_sessions: 'id,child_id,session_date,data,created_at',
  preferences: 'child_id,last_session_date,version,updated_at',
  prep_points: 'child_id,total,level,today_pp,today_date,version,updated_at',
  processed_operations: 'operation_uuid,child_id,operation_type,created_at',
  question_results: 'id,child_id,question_id,topic_key,subject,is_correct,time_ms,difficulty,attempted_at,session_id,selected_answer',
  quiz_results: 'id,child_id,topic_key,subject,score,total,time_seconds,quiz_mode,completed_at,session_id',
  seen_questions: 'child_id,question_id,topic_key,subject,first_seen_at',
  seen_tips: 'child_id,tip_id,last_seen_date',
  streaks: 'child_id,current_streak,longest_streak,last_quiz_date,streak_history,version,updated_at',
  topic_performance: 'child_id,topic_key,subject,data,version,updated_at',
};

describe('test schema matches production schema', () => {
  beforeAll(async () => {
    await createSchema(env.DB);
    await createDataSchema(env.DB);
  });

  it.each(Object.keys(PROD_COLUMNS))('%s columns match prod snapshot', async (table) => {
    const { results } = await env.DB.prepare(
      `SELECT name FROM pragma_table_info('${table}') ORDER BY cid`
    ).all();
    const testCols = results.map(r => r.name).sort().join(',');
    const prodCols = PROD_COLUMNS[table].split(',').sort().join(',');
    expect(testCols, `test schema for '${table}' diverges from prod`).toBe(prodCols);
  });
});

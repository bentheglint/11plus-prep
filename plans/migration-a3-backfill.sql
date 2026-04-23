-- Fix A3 backfill: rebuild practice_sessions day totals from quiz_results.
-- Pre-fix, practice_sessions held only the LAST quiz of each day due to the
-- old ON CONFLICT DO UPDATE SET data = excluded.data pattern. Now that the
-- Worker merges (sums) on conflict, we rewrite historical rows to accurate
-- daily aggregates computed from quiz_results.
--
-- Scope: all children, all dates. Overwrites existing practice_sessions rows
-- with the correct sums; inserts rows for (child, day) pairs that had quiz
-- activity but lost their practice_sessions row.

INSERT INTO practice_sessions (child_id, session_date, data)
SELECT
  child_id,
  DATE(completed_at) AS day,
  json_object(
    'date',               DATE(completed_at),
    'questionsAttempted', SUM(total),
    'questionsCorrect',   SUM(score),
    'mode',               'aggregate',
    'backfilled',         1
  ) AS data
FROM quiz_results
GROUP BY child_id, DATE(completed_at)
ON CONFLICT(child_id, session_date) DO UPDATE SET
  data = json_set(
    data,
    '$.questionsAttempted', json_extract(excluded.data, '$.questionsAttempted'),
    '$.questionsCorrect',   json_extract(excluded.data, '$.questionsCorrect'),
    '$.backfilled',         1
  ),
  created_at = created_at;

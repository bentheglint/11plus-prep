-- Backfill topic_performance from question_results (Task 9, 11 June 2026)
--
-- WHY: the 27 April migration populated topic_performance once and the client
-- never synced it afterwards (fixed by topic-performance-delta, commit 3ae759f,
-- not yet deployed). Existing rows are migration-era stale, and ALL 50 carry
-- subject='maths' (migration bug) even for English/VR topics.
--
-- DESIGN (senior-dev gated, fill-missing-only):
--   * Source rows: question_results from REGULAR QUIZZES only —
--     session_id matches a quiz_results row (mock tests and Speed Review
--     practice never write quiz_results, so EXISTS excludes them), OR
--     session_id IS NULL (pre-sessionId era, April 2026, regular quizzes only —
--     verified: mocks did not exist then).
--   * Subject comes from the topic_key via the client's subjectFromTopicKey
--     mapping (INCLUDING the wordClassGrammar + balanceEquations fixes shipping
--     in the same deploy) — NOT from question_results.subject, whose 'verbalreasoning'
--     differs from the client's 'verbal-reasoning'. Future delta ops must land
--     on these exact (child_id, topic_key, subject) keys.
--   * ON CONFLICT DO NOTHING: never overwrites or reduces an existing row.
--     Stale wrong-subject rows are left in place; the client keys by topic_key
--     with last-row-wins, so the newer (higher rowid) backfilled row is shown.
--
-- ROLLBACK: backups/d1-snapshot-2026-06-11-pre-topicperf-backfill.sql
-- VERIFY:   SELECT COUNT(*) FROM topic_performance;  -- expect 50 -> 149

INSERT INTO topic_performance (child_id, topic_key, subject, data, version)
SELECT
  qr.child_id,
  qr.topic_key,
  CASE
    WHEN qr.topic_key IN (
      'percentages','decimals','longdivision','ratio','fractions',
      'longmultiplication','algebra','placevalue','negativenumbers',
      'primenumbersfactors','areaperimeter','volume','anglesshapes',
      'sequences','datahandling','speeddistancetime'
    ) THEN 'maths'
    WHEN qr.topic_key IN (
      'comprehension','grammar','vocabulary','spelling','punctuation',
      'wordClassGrammar'
    ) THEN 'english'
    WHEN qr.topic_key IN (
      'synonyms','antonyms','verbalAnalogies','oddTwoOut','compoundWords',
      'hiddenWords','letterMove','missingLettersWords','letterCodes',
      'letterPairSeries','numberSeries','letterSums','wordCodeAnalogies',
      'numberWordCodes','logicAndLanguage','sharedLetter','balanceEquations'
    ) THEN 'verbal-reasoning'
    ELSE 'maths' -- mirrors the client fallback
  END,
  json_object('correct', SUM(qr.is_correct), 'total', COUNT(*)),
  1
FROM question_results qr
WHERE qr.session_id IS NULL
   OR EXISTS (
        SELECT 1 FROM quiz_results z
        WHERE z.child_id = qr.child_id AND z.session_id = qr.session_id
      )
GROUP BY qr.child_id, qr.topic_key
ON CONFLICT(child_id, topic_key, subject) DO NOTHING;

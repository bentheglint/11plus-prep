-- Replay protection — natural-key idempotency for append-only tables.
-- Created: 29 April 2026
--
-- Context: after the 27 April D1 cascade-wipe, we restored business tables
-- from device localStorage exports but did NOT restore processed_operations
-- (the UUID dedup table). When the freeze lifts and offline devices come
-- back online, they may push SyncQueue entries whose effects are already
-- in D1 from the offline merge. UUID dedup misses (no markers exist),
-- so the worker would happily INSERT duplicates.
--
-- Fix: add UNIQUE indexes on natural keys for quiz_results and
-- question_results, and switch the worker to INSERT OR IGNORE so
-- replays silently no-op instead of duplicating rows.
--
-- The other append-only tables already have natural-key idempotency:
--   - lesson_history     PK(child_id, lesson_id)
--   - seen_questions     PK(child_id, question_id, topic_key)
--   - achievements       PK(child_id, achievement_id)
--   - seen_tips          PK(child_id, tip_id)
--   - leitner_queue      PK(child_id, question_id, topic_key)
--   - practice_sessions  UNIQUE(child_id, session_date)
--
-- The two below are the gap. Both use session_id (a client-generated
-- timestamp-based int that's unique per quiz session) as the dedup
-- discriminator. Within a single quiz session, you cannot answer the
-- same question twice, so (child_id, question_id, session_id) is unique.

-- Quiz results: one row per quiz session per topic+subject.
CREATE UNIQUE INDEX IF NOT EXISTS quiz_results_natural_key
  ON quiz_results (child_id, session_id, topic_key, subject)
  WHERE session_id IS NOT NULL;

-- Question results: one row per question attempt within a session.
CREATE UNIQUE INDEX IF NOT EXISTS question_results_natural_key
  ON question_results (child_id, question_id, session_id, topic_key)
  WHERE session_id IS NOT NULL;

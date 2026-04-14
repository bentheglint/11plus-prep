-- Quiz Detail View: additive columns to correlate quizzes with their questions
-- Created: 14 April 2026
-- All columns nullable — old rows have NULL, backwards-compatible with existing Worker

PRAGMA foreign_keys = ON;

-- ── quiz_results: session_id links to per-question rows ──

ALTER TABLE quiz_results ADD COLUMN session_id INTEGER;

-- ── question_results: session_id + captured selected answer ──

-- session_id correlates each question attempt back to its parent quiz.
-- selected_answer is a JSON-encoded TEXT field whose shape depends on question type:
--   MCQ (standard)   → integer index, e.g. "2"
--   select-two       → sorted pair, e.g. "[1,3]" (a < b, unordered comparison)
--   pick-from-sets   → object, e.g. '{"A":1,"B":2}' (ordered by set identity)
ALTER TABLE question_results ADD COLUMN session_id INTEGER;
ALTER TABLE question_results ADD COLUMN selected_answer TEXT;

-- ── Indexes for correlation queries ──

CREATE INDEX IF NOT EXISTS idx_qr_session ON question_results(child_id, session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_session ON quiz_results(child_id, session_id);

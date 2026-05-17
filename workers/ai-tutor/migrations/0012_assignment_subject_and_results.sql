-- Add subject to assignment_items so the child-facing banner knows which
-- subject to launch without a runtime lookup table.
ALTER TABLE assignment_items ADD COLUMN subject TEXT;

-- Store per-question results on completion so tutors can see how the
-- child performed question-by-question.
ALTER TABLE assignment_recipients ADD COLUMN question_results TEXT;

-- Record which version of the Tutor Terms each tutor agreed to, and when.
-- Added alongside the published tutor-terms.html (v1.0, June 2026).
-- Both columns are nullable so existing tutor rows (pre-terms) are unaffected.
ALTER TABLE tutors ADD COLUMN terms_version TEXT;
ALTER TABLE tutors ADD COLUMN terms_agreed_at TEXT;

-- seed-local.sql
--
-- LOCAL-ONLY fixture data for end-to-end freemium entitlement verification.
-- Run with: npx wrangler d1 execute 11plus-user-data --local --file scripts/seed-local.sql
--
-- NEVER run this against --remote. It deletes and re-inserts fixed test ids
-- so it is safe to re-run repeatedly during a verification session.
--
-- Entitlement ladder reminder (lib/entitlements.js resolveEntitlements):
--   is_comped=1                                    -> comped (FULL)
--   subscription_status='active'                   -> paid (FULL)
--   subscription_current_period_end in the future  -> paid (FULL, backstop)
--   created_at within 30 days of now                -> trial (FULL)
--   otherwise                                        -> free (capped)

-- ── Cleanup (idempotent re-run) ──────────────────────────────────────────
DELETE FROM pupil_tutors WHERE tutor_id = 'user_tutor_test';
DELETE FROM quiz_results WHERE child_id IN ('child_trial', 'child_free', 'child_paid', 'child_comped');
DELETE FROM children WHERE id IN ('child_trial', 'child_free', 'child_paid', 'child_comped');
DELETE FROM tutors WHERE id = 'user_tutor_test';
DELETE FROM accounts WHERE id IN ('user_trial_test', 'user_free_test', 'user_paid_test', 'user_comped_test', 'user_tutor_test');

-- ── Account 1: TRIAL ─────────────────────────────────────────────────────
-- created_at 5 days ago -> well within the 30-day app trial window.
INSERT INTO accounts (
  id, email, name, created_at, consent_given_at, consent_version, last_login_at,
  stripe_customer_id, subscription_status, subscription_current_period_end,
  is_comped, comp_source, email_opt_in
) VALUES (
  'user_trial_test', 'trial.test@prepstep.local', 'Trial Test Parent',
  datetime('now', '-5 days'), datetime('now', '-5 days'), 'v1',
  datetime('now', '-1 days'),
  NULL, NULL, NULL,
  0, NULL, 1
);

INSERT INTO children (id, account_id, display_name, created_at, year_group, target_school)
VALUES ('child_trial', 'user_trial_test', 'Trial Tim', datetime('now', '-5 days'), 5, NULL);

-- ── Account 2: FREE (post-trial) ────────────────────────────────────────
-- created_at 40 days ago -> outside the 30-day trial window, no subscription,
-- not comped -> falls through the whole ladder to 'free'.
INSERT INTO accounts (
  id, email, name, created_at, consent_given_at, consent_version, last_login_at,
  stripe_customer_id, subscription_status, subscription_current_period_end,
  is_comped, comp_source, email_opt_in
) VALUES (
  'user_free_test', 'free.test@prepstep.local', 'Free Test Parent',
  datetime('now', '-40 days'), datetime('now', '-40 days'), 'v1',
  datetime('now', '-2 days'),
  NULL, NULL, NULL,
  0, NULL, 1
);

INSERT INTO children (id, account_id, display_name, created_at, year_group, target_school)
VALUES ('child_free', 'user_free_test', 'Free Fiona', datetime('now', '-40 days'), 5, NULL);

-- ── Account 3: PAID (active subscription, period end ~20 days future) ──
-- created_at is old (well past trial) so the ladder MUST resolve via the
-- subscription_status='active' step, not the trial step -- proves paid
-- takes precedence over an expired trial.
INSERT INTO accounts (
  id, email, name, created_at, consent_given_at, consent_version, last_login_at,
  stripe_customer_id, subscription_status, subscription_current_period_end,
  is_comped, comp_source, email_opt_in
) VALUES (
  'user_paid_test', 'paid.test@prepstep.local', 'Paid Test Parent',
  datetime('now', '-100 days'), datetime('now', '-100 days'), 'v1',
  datetime('now'),
  'cus_test_paid_local', 'active', CAST(strftime('%s', 'now', '+20 days') AS INTEGER),
  0, NULL, 1
);

INSERT INTO children (id, account_id, display_name, created_at, year_group, target_school)
VALUES ('child_paid', 'user_paid_test', 'Paid Pete', datetime('now', '-100 days'), 5, NULL);

-- ── Account 4: COMPED ────────────────────────────────────────────────────
-- is_comped=1 short-circuits the ladder regardless of created_at/subscription.
INSERT INTO accounts (
  id, email, name, created_at, consent_given_at, consent_version, last_login_at,
  stripe_customer_id, subscription_status, subscription_current_period_end,
  is_comped, comp_source, email_opt_in
) VALUES (
  'user_comped_test', 'comped.test@prepstep.local', 'Comped Test Parent',
  datetime('now', '-60 days'), datetime('now', '-60 days'), 'v1',
  datetime('now'),
  NULL, NULL, NULL,
  1, 'manual_test_comp', 1
);

INSERT INTO children (id, account_id, display_name, created_at, year_group, target_school)
VALUES ('child_comped', 'user_comped_test', 'Comped Cara', datetime('now', '-60 days'), 5, NULL);

-- ── quiz_results for child_free: 12 rows, maths clearly stronger than
-- english/verbalreasoning, so the tutor basic aggregate has real, uneven
-- values to verify against. completed_at spread over the last week. ─────
INSERT INTO quiz_results (child_id, topic_key, subject, score, total, time_seconds, quiz_mode, completed_at) VALUES
  ('child_free', 'percentages',        'maths',          9,  10, 480, 'focused', datetime('now', '-1 days')),
  ('child_free', 'fractions',          'maths',          10, 10, 420, 'focused', datetime('now', '-2 days')),
  ('child_free', 'longmultiplication', 'maths',          8,  10, 500, 'daily',   datetime('now', '-3 days')),
  ('child_free', 'ratio',              'maths',          9,  10, 460, 'focused', datetime('now', '-4 days')),
  ('child_free', 'algebra',            'maths',          8,  10, 510, 'daily',   datetime('now', '-5 days')),
  ('child_free', 'comprehension',      'english',        5,  10, 600, 'focused', datetime('now', '-1 days')),
  ('child_free', 'grammar',            'english',        6,  10, 480, 'daily',   datetime('now', '-3 days')),
  ('child_free', 'spelling',           'english',        4,  10, 420, 'focused', datetime('now', '-4 days')),
  ('child_free', 'vocabulary',         'english',        7,  10, 440, 'daily',   datetime('now', '-6 days')),
  ('child_free', 'synonyms',           'verbalreasoning', 4, 10, 400, 'focused', datetime('now', '-2 days')),
  ('child_free', 'numberSeries',       'verbalreasoning', 6, 10, 450, 'daily',   datetime('now', '-5 days')),
  ('child_free', 'oddTwoOut',          'verbalreasoning', 5, 10, 430, 'focused', datetime('now', '-6 days'));

-- ── quiz_results for child_paid: fewer rows, just enough for the tutor
-- deep-progress view to have real data across all three subjects. ───────
INSERT INTO quiz_results (child_id, topic_key, subject, score, total, time_seconds, quiz_mode, completed_at) VALUES
  ('child_paid', 'decimals',        'maths',          8, 10, 470, 'focused', datetime('now', '-1 days')),
  ('child_paid', 'areaperimeter',   'maths',          9, 10, 490, 'daily',   datetime('now', '-3 days')),
  ('child_paid', 'punctuation',     'english',        7, 10, 450, 'focused', datetime('now', '-2 days')),
  ('child_paid', 'comprehension',   'english',        6, 10, 520, 'daily',   datetime('now', '-4 days')),
  ('child_paid', 'antonyms',        'verbalreasoning', 7, 10, 410, 'focused', datetime('now', '-2 days')),
  ('child_paid', 'letterCodes',     'verbalreasoning', 8, 10, 440, 'daily',   datetime('now', '-5 days'));

-- ── Tutor + pupil links ───────────────────────────────────────────────────
INSERT INTO tutors (
  id, email, display_name, photo_url, bio, tutor_code, created_at,
  payout_earned_cents, payout_approved, bulk_invite_approved,
  terms_version, terms_agreed_at
) VALUES (
  'user_tutor_test', 'tutor.test@prepstep.local', 'Tutor Test', NULL,
  'Local seed fixture tutor for freemium enforcement verification.',
  'TESTTUTOR1', datetime('now', '-90 days'),
  0, 1, 1,
  'v1', datetime('now', '-90 days')
);

-- Link tutor to a FREE pupil and a PAID pupil, so the tutor drill-down can
-- be exercised for both tiers.
INSERT INTO pupil_tutors (child_id, tutor_id, joined_at)
VALUES
  ('child_free', 'user_tutor_test', datetime('now', '-10 days')),
  ('child_paid', 'user_tutor_test', datetime('now', '-10 days'));

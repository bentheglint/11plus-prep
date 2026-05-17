# Tutor Mode Deployment Plan

**Date:** 13 May 2026  
**Branch:** `tutor-mode` → merge to `master`  
**Reviewed by:** Senior-dev agent (verdict: push back → addressed below)

---

## Context

The `tutor-mode` branch contains 29 commits of fully-built tutor features that have never been deployed to production. `master` is 48 commits ahead of the branch point, containing Stripe, legal, security, email, content and process gate work applied since branching.

Previous incident context: 27 April cascade-wipe destroyed all 6 accounts' data when a migration DROP'd a parent table. D1 silently ignores `PRAGMA foreign_keys=OFF`, so cascades fire regardless.

---

## Critical finding: Migration number collision

Both branches have migrations numbered 0007 and 0008, but they are **different migrations**:

| Number | master (applied to production) | tutor-mode (never deployed) |
|--------|-------------------------------|---------------------------|
| 0007 | `0007_replay_protection.sql` | `0007_multiple_children_per_account.sql` |
| 0008 | `0008_email_opt_in.sql` | `0008_tutor_schema.sql` |
| 0009 | `0009_stripe_webhook_events.sql` | *(doesn't exist)* |

**Fix:** Rename tutor-mode migrations to 0010 and 0011 before any merge.

---

## Critical finding: Migration 0007 will wipe user data as written

`0007_multiple_children_per_account.sql` uses the create-copy-drop-rename pattern on the `children` table:

```sql
CREATE TABLE children_new (...);
INSERT INTO children_new ... FROM children;
DROP TABLE children;       -- THIS cascades into question_results, quiz_results, etc.
ALTER TABLE children_new RENAME TO children;
```

The migration includes `PRAGMA foreign_keys = OFF` but D1 silently ignores this pragma. The `DROP TABLE children` **will fire ON DELETE CASCADE** into `question_results`, `quiz_results`, `topic_performance`, `mock_test_results` — wiping all user quiz data. This is structurally identical to the 27 April incident.

**Fix:** Restructure this migration to use `ALTER TABLE ADD COLUMN` only (safe in D1). Defer the UNIQUE(account_id) constraint removal to a future migration window with full export/import procedure.

Safe replacement:
```sql
-- Add new columns only — no DROP, no cascade risk
ALTER TABLE children ADD COLUMN year_group INTEGER;
ALTER TABLE children ADD COLUMN target_school TEXT;
```

Migration 0011 (tutor schema) is **low risk** — it is entirely new `CREATE TABLE` statements with no modifications to existing tables.

---

## Migration 0010 trade-off: deferred multi-child support

Removing the UNIQUE(account_id) constraint from `children` (to allow multiple children per account) requires the table rebuild which is not safe in D1 without a full export/import procedure. This is deferred.

**Impact:** The multi-child picker UI still renders correctly with one child per account. Parents cannot add a second child until this migration is applied in a future low-risk window. Most users only have one child. This is an acceptable launch trade-off.

---

## Deployment sequence

### Phase 0 — Commit current work
Commit all uncommitted changes from the current session on `tutor-mode` before any merge work. Dirty working tree must be clean before merging.

### Phase 1 — Restructure the dangerous migration
On `tutor-mode` branch:
1. Replace `workers/ai-tutor/migrations/0007_multiple_children_per_account.sql` with the safe `ALTER TABLE ADD COLUMN` version
2. Rename it to `0010_multiple_children_per_account.sql`
3. Rename `0008_tutor_schema.sql` → `0011_tutor_schema.sql`
4. Update any references to migration filenames in code or docs

### Phase 2 — Merge master into tutor-mode
Run `git merge master` on the `tutor-mode` branch. Resolve conflicts. Four files require careful manual review — not mechanical "accept both sides":

**High risk — manual review required:**
- `workers/ai-tutor/routes/email.js` — master added 4-email trial sequence (Days 1/7/14/25); tutor-mode added opt-in hook. Verify they don't interfere: does the opt-in hook affect parents in the trial sequence? Check control flow explicitly.
- `workers/ai-tutor/index.js` — both branches added new routes. Stitch together; verify no route is lost and no duplicate path.

**Medium risk — take master's version:**
- `src/components/SubscribeScreen.js` — master rewrote entirely (Stripe, legal, WCAG, GDPR). Take master's version in full. Confirm no tutor-mode feature depended on the old version.

**Medium risk — careful merge:**
- `workers/ai-tutor/routes/account.js` — both modified. Review each change individually.
- `src/App.js` — both added significant UI state and routing. Stitch together; smoke-test all nav flows after.

**Expected non-conflicts (cherry-picked commits):** The antonym shuffle and Testing Mode flag fixes appear on both branches (cherry-picked to master). Git will handle these as already-applied during the merge.

### Phase 3 — Build and test on tutor-mode
1. `npm test` — full test suite must pass
2. Local smoke test — verify:
   - Existing subscriber signup flow
   - Existing quiz flow (parent/child view)
   - Tutor join flow via invite link
   - Pupil detail screen
   - Assignment composer
   - Report generation

### Phase 4 — Merge tutor-mode into master
Once Phase 3 passes: `git merge tutor-mode` on master (or fast-forward).

### Phase 5 — D1 migration safety sequence
This is the non-negotiable gate before any Worker deploy:

1. **Time Travel bookmark** — take a named D1 Time Travel snapshot: `wrangler d1 time-travel DB --create-bookmark`
2. **Gate 4 pre-mutation** — run `scripts/process-gates/verify-row-counts.mjs` against production to establish row count baseline
3. **Staging rehearsal** — apply migrations 0010 and 0011 to a staging D1 database and verify they execute cleanly
4. **Apply migration 0010** to production — `wrangler d1 migrations apply DB --remote` (ALTER TABLE ADD COLUMN only — zero cascade risk)
5. **Apply migration 0011** to production — new tables only, zero cascade risk
6. **Schema verify** — run `PRAGMA table_info` on every new tutor table to confirm schema matches Worker expectations:
   - `tutors`, `pupil_tutors`, `classes`, `class_enrolments`, `tutor_notes`, `assignments`, `assignment_items`, `assignment_recipients`, `conversations`, `messages`
7. **Gate 4 post-mutation** — re-run `verify-row-counts.mjs` and confirm existing table row counts are unchanged

### Phase 6 — Deploy
1. Deploy Worker: `wrangler deploy` from `workers/ai-tutor/`
2. Deploy frontend: `bash deploy.sh`
3. Smoke test on production:
   - Existing subscriber signup (Stripe Checkout)
   - Existing quiz flow
   - Tutor join flow end-to-end with a real invite link
   - Tutor dashboard loads
   - Pupil detail screen loads
   - Report generates

---

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Migration 0010 cascade-wipes quiz data | HIGH if not restructured | Catastrophic | Restructure to ALTER TABLE ADD COLUMN only |
| email.js merge conflict causes silent double-trigger of trial emails | Medium | High (bad UX) | Manual control flow review during merge |
| App.js merge regression breaks nav routing | Medium | High | Smoke test all nav flows after merge |
| Worker queries reference columns that don't exist post-migration | Low (0011 is new tables) | High | PRAGMA table_info verify in Phase 5 step 6 |
| Stripe/auth regression after 48-commit merge | Low | High | Dedicated smoke test of subscriber flow in Phase 3 and Phase 6 |

---

## Known deferred items

- **Multi-child support** (UNIQUE constraint removal on `children`) — deferred pending safe export/import migration procedure
- **Tutor scheduling and payments** — deferred post-launch
- **Effort leaderboard** — deferred post-launch
- **Group-level reporting** — deferred post-launch
- **Pupil cap enforcement** (30-pupil free tier limit) — deferred post-launch

---

## Files changed on tutor-mode vs master (summary)

**Worker:** `index.js`, `routes/tutor.js`, `routes/assignments.js`, `routes/classes.js`, `routes/messaging.js`, `routes/notes.js`, `routes/report.js`, `routes/relationships.js`, `routes/bulk.js`, `routes/account.js` (modified), `routes/email.js` (modified)

**Frontend:** `TutorDashboardScreen.js`, `PupilDetailScreen.js`, `MessagingScreen.js`, `JoinScreen.js`, `TutorSignupScreen.js`, `ReportScreen.js`, `TutorHomeworkCard.js`, `TutorManagementCard.js`, `MessageThread.js` (modified), `FocusAreas.js` (modified), `App.js` (modified), `AuthGate.js` (modified)

**Migrations:** `0010_multiple_children_per_account.sql` (restructured), `0011_tutor_schema.sql`

**Tests:** `tutorInvite.test.js`, `tutorNotes.test.js`, `assignments.test.js`, `reportAndHomework.test.js`, `phase6.test.js`, `multiChild.test.js`

# Design — Freemium Phase 0 completion (tutor-side gating + full enforcement + kill-switch)

**Status:** drafted 6 Jul 2026. Needs Ben to confirm the 3 flagged decisions (§8), then
Codex/senior-dev review, then build. Target: live before the ~16 weekend-onboarded pupils' trials
expire (~2 Aug). Highest-blast-radius change in the project (Stripe + gating + D1 migration).
**§11 (REVIEW CORRECTIONS, senior-dev + Codex) is authoritative and OVERRIDES §4–§8 where they conflict — build to §11.**

## 1. What's already built (branch `phase-0-freemium`, 5 commits)
Entitlement resolver (`lib/entitlements.js` `resolveEntitlements()` — pure, ladder
comped>paid>grace>backstop>trial>free), Stripe webhook hardening, daily-claim primitive +
migration 0017 (`daily_claims`, additive, UNIQUE(child_id,entitlement_type,local_day),
INSERT-OR-IGNORE, server London-day), server gates on **aiTutor** + **mockTests**, client
`freeTier` flag + locked cards. Free tier = 1 daily set + basic progress + streaks/PP; Focused,
Mock, AI Tutor, Challenge are paid.

## 2. Gaps this design closes (from the 4 locked decisions)
1. **Enforce `unlimitedPractice`** — close the practice bypasses free pupils have today.
2. **Enforce `deepProgress`** — lock deep analytics for free pupils (own view + tutor's view).
3. **Tutor-side (greenfield, decisions A + B)** — tutor depth follows pupil plan; hard-block Focused
   homework for free pupils.
4. **Kill-switch** — server-side runtime off-switch for the whole free-tier enforcement.

## 3. Enabler — resolve an arbitrary pupil's entitlement server-side
`loadEntitlement(db, userId)` is hardcoded to the caller's own account — unusable for a tutor
viewing a pupil. Add `loadEntitlementForAccount(db, accountId, now)` in `lib/entitlementGate.js`
(same body, bound to the pupil's `account_id`, then `resolveEntitlements`). Every tutor query
already joins `accounts`, so `account_id` is one field away at each call site. This underpins all
tutor-side gating below.

## 4. Pupil-side enforcement
- **`unlimitedPractice` — close the "Practise this mistake" bypass.** `MistakesScreen.js`
  (`startPractice`/`recordResult`, ~131-160) runs a self-contained quiz loop that bypasses the
  daily claim and all gates — unlimited free practice today. **Gate the re-quiz behind
  `unlimitedPractice`** (paid): a free pupil can still *see* their mistakes list (basic, stays free
  — child-first), but tapping "practise this" shows the upgrade nudge. This is the concrete
  `unlimitedPractice` enforcement point. (Daily Learning already routes through the claim; Focused
  is already UI-walled.)
- **`deepProgress` — lock the pupil's own deep dashboard.** `ProgressScreen.js` "Parent Dashboard"
  tab (ExamReadinessCard, TopicHeatMap, FocusAreas, SpeedTracking, MockTestHistory, PracticeCalendar)
  is deep; "My Journey" (streak, PP, star ratings, last-5) is basic. **Client UI-lock the "Parent
  Dashboard" tab** behind `canUseFeature(entitlement,'deepProgress')`, with the upgrade nudge.
  NOTE: this deep data is computed client-side from `question_results` already bulk-loaded to every
  account, so this is a UI lock, not data-withholding. Accepted as consistent with decision 2
  (UI-lock is fine for non-money analytics; a child won't extract it from the bundle). Server-side
  withholding of the bulk load is a larger, separate change — deferred. (My call, §8 note.)

## 5. Tutor-side enforcement (greenfield — decisions A + B)
Tutor routes must return, per pupil, a plan marker (e.g. `pupilPlan: 'free'|'trial'|'paid'`,
`deepProgressLocked: bool`) so the client can render basic-view + nudges.

**A. Tutor depth follows pupil plan (server-withhold — this IS server-enforceable, unlike the
pupil's own view, because tutor data comes from tutor routes):**
- `GET /api/tutor/dashboard` (`tutor.js:109`): for free pupils, omit the weakest-topic + 30-day
  accuracy pulse (`tutor.js:169-181`); keep last-active + on-track/overdue badge + assignment status.
- `GET /api/tutor/pupils/:childId` (`tutor.js:277`): for free pupils, return basic fields only;
  **withhold** `questionResults`, `topicPerformance`, `mockTestHistory`, `practiceLog`; include
  `deepProgressLocked:true`.
- `GET /api/tutor/report/:childId` (`report.js:76`): for free pupils, return a locked/"upgrade
  needed" payload instead of the full report.
- Client (`PupilDetailScreen.js`, `TutorDashboardScreen.js`, `ReportScreen`): when
  `deepProgressLocked`, render the basic set + a clear **"Unlock full analytics — this pupil is on
  the free plan"** nudge (the conversion lever to relay to the parent).

**B. Hard-block Focused homework for free pupils (at CREATE + defense-in-depth at delivery):**
- `POST /api/tutor/assignments` (`assignments.js:68`, before INSERT ~96): resolve target pupil(s)
  entitlement; if a pupil lacks `focusedLearning` (i.e. free), **reject/skip**. Since every
  assignment today is a `topic` item = Focused Learning, this means free pupils are not assignable
  homework (see §8 decision 3).
  - **Individual target:** reject with a clear reason the client shows as **"This pupil is on the
    free plan — upgrade them to assign Focused Learning."** (nudge to the TUTOR, never locked
    homework to the child — child-first).
  - **Class target (mixed free/paid):** **skip** the free recipients, create for the rest, and
    return the skipped list so the client tells the tutor "3 pupils on the free plan were skipped
    — upgrade them to include them." (Recommended over rejecting the whole assignment; §8 decision 1.)
- `POST /api/pupil/assignments/:id/{start,complete}` (`assignments.js:217-254`): re-check
  entitlement (defense-in-depth against a pupil downgrading after an assignment was delivered).
- N/A: there is no "tutor-assigned Daily set" to account against the daily claim (the composer only
  creates Focused topic items) — the earlier daily-claim-accounting concern is moot.

## 6. Kill-switch (decision 4)
A **server-side flag that short-circuits `resolveEntitlements` to grant full access to everyone**,
reverting instantly to pre-freemium behaviour without a rebuild. Because the client derives locks
from the server entitlement payload (threaded server→AuthGate→screens), flipping this cascades to
the client automatically (everyone resolves to full access → no locks shown → no client redeploy).
- **Mechanism (recommended):** a worker env value `FREE_TIER_ENFORCEMENT` (`wrangler secret put`,
  propagates in seconds, no code rebuild). `loadEntitlement`/`loadEntitlementForAccount` check it
  first; if off, return the full-access payload. Alternative: a D1 `app_settings` flag row (truly
  instant, zero deploy, but adds a cached per-request read). Recommend the secret for simplicity;
  note the D1 option. (My call, §8 note.)
- The build-time client `REACT_APP_FF_FREETIER` stays the feature-rollout flag; the kill-switch is
  the emergency neutraliser layered under it.

## 7. Rollout sequence (within the ~4-week runway; kill-switch is the safety net)
1. Rebase `phase-0-freemium` onto today's master (picks up the Sentry fixes); confirm clean.
2. Build §3–§6 (Sonnet, from this design).
3. Run full test suites for real (worker + client) + add tests for every new gate + a parity test
   pinning enforced entitlement keys to the resolver.
4. Codex + senior-dev review (payments + entitlements + migration + tutor gating).
5. Staging-test migration 0017 against a fresh prod snapshot (row-count assertions).
6. Fresh prod snapshot → apply migration 0017 (confirmed NOT yet applied; prod at 0016).
7. Deploy worker (`wrangler deploy`) with `FREE_TIER_ENFORCEMENT=on` ready to flip off.
8. Deploy frontend (`bash deploy.sh`, `REACT_APP_FF_FREETIER=true`).
9. Verify end-to-end: trial pupil = full; free pupil = 1 daily set + basic progress + locked
   Focused/Mock/AI/Challenge + locked deep dashboard + gated practise-mistake; paid/comped
   unaffected; Stripe checkout works; tutor sees basic depth + nudge for free pupils and cannot
   assign Focused homework to them; kill-switch flip restores full access for all.
10. Monitor Sentry + entitlement behaviour; kill-switch on standby.

## 8. Decisions for Ben to confirm before build
1. **Class assignment with mixed free/paid pupils:** skip the free recipients + tell the tutor
   (recommended), vs reject the whole assignment. → *recommend skip.*
2. **"Practise this mistake" for free pupils:** gate the active re-quiz (paid) but keep the mistake
   *list* visible for free (recommended, child-first), vs lock the whole Mistakes screen. → *recommend
   gate re-quiz only.*
3. **Consequence of hard-block:** with today's composer (all homework = Focused topics), free pupils
   become **un-assignable any homework**. Accept for launch (recommended; strong tutor-driven
   conversion lever), vs build a new "assignable free Daily set" homework type now (extra scope). →
   *recommend accept; free-Daily-homework = optional Phase 2.*

## 9. My calls (flagged, not asking — override if you disagree)
- Pupil's OWN deep dashboard = client UI-lock (data stays on client), not server-withholding the
  bulk load. Tutor's view of deep data IS server-withheld.
- Kill-switch = worker secret `FREE_TIER_ENFORCEMENT` (vs D1 flag row).

## 10. Risks & safety
Payments-adjacent + entitlement gating + FK-safe additive migration. Mitigations: kill-switch;
Codex + senior-dev review; migration staging-test + snapshot; explicit trial/free/paid/comped
verification matrix; deploy behind the runtime switch so a bad enforcement bug is a 1-command revert,
not a rebuild. Fail-open on all client gates (a gating bug never blocks a paying user).

## 11. Review corrections (senior-dev + Codex) — AUTHORITATIVE, build to this
Both reviews converged on the tutor leak; Codex additionally found a payer-facing race and built-code
consistency bugs. Verdict: sound architecture, but tighten the design AND fix several existing built-code
issues before build. Grouped by priority.

### A. Payer safety (highest — a gating bug must never harm someone who paid)
1. **Stripe return race.** On return from checkout (`AuthGate.js:~525`, `?subscribed=1` → `checkAccount()`),
   the webhook that writes `subscription_status` may not have landed → a real payer resolves to the FREE
   floor and sees the paywall. Latent today (all on trial), EXPOSED the moment free-tier is live. Fix: after
   `?subscribed=1`, show "confirming payment…" and poll `/api/account` with short backoff until
   `subscription_status` is active (or verify the Checkout Session server-side); never render the free paywall
   while confirming.
2. **Stale entitlement must also fail-open.** Missing/malformed already fails open (`entitlementGating.js:~28`),
   but a STALE cached `free` payload (e.g. served from the d1-cache fallback for someone who just upgraded)
   shows locks to a payer. Fetch entitlement fresh (not from stale cache), or make the stale direction open.
   Test: payer with a stale `free` payload is never shown locks.
3. **Unify the dual trial calc (single source of truth).** `routes/account.js:~87-98` computes
   `hasAccess`/`trialDaysRemaining` SEPARATELY from `resolveEntitlements`, and AuthGate admission uses
   `data.access.hasAccess`. Make account.js admission call `resolveEntitlements` (remove the parallel math) so
   admission and entitlement can never disagree.
4. **Bad `created_at` must fail-open to FULL access, not free.** In `entitlements.js` an unparseable date →
   NaN → falls to `free` (wrongly locks a real user). Treat unparseable/NaN `created_at` as full-access/trial.

### B. Tutor data-leak — ALLOW-LIST everywhere (both reviewers; §5 above was a deny-list and leaked)
5. **Drill-down `GET /api/tutor/pupils/:childId` (`tutor.js:~277/321/417-423`):** rebuild deny-by-default —
   basic fields always; add `quizResults`, `questionResults`, `topicPerformance`, `mockTestHistory`,
   `practiceLog`, and `assignmentRecipients.question_results` ONLY if the pupil is entitled. Add a test that
   FAILS if a new deep field is added to the response ungated (drift guard).
6. **Dashboard pulse (`tutor.js:~131-208` + `src/utils/tutorPulse.js`):** the roster pulse leaks
   `weakest_topic` / `avg_accuracy` / 30-day accuracy — omit these for free pupils (needs per-pupil
   entitlement, batched per §C-8).
7. **Report `GET /api/tutor/report/:childId` (`report.js:~92`):** resolve the pupil's entitlement BEFORE the
   deep `Promise.all`; return a locked "upgrade needed" payload for free pupils (short-circuit, don't truncate).

### C. Assignment (behaviour B) robustness
8. **Batch, no N+1.** For class targets fetch `child_id, account_id` + billing columns for all enrolled pupils
   in ONE query (`expandRecipients`/`class_enrolments`), resolve per-account in JS. `loadEntitlementForAccount`
   is per-account — never call it in a roster/recipient loop.
9. **Atomic skip/reject.** Resolve recipient entitlements BEFORE inserting the assignment + items. Skip free
   recipients on mixed classes and return the skipped list to the tutor; if ZERO eligible recipients, reject
   cleanly (never create an orphan zero-recipient assignment). Delivery-side re-check stays (post-downgrade).

### D. Kill-switch
10. **Signature.** `loadEntitlement`/`loadEntitlementForAccount(db, id, now)` can't read the flag — pass `env`
    (or the resolved flag) so `FREE_TIER_ENFORCEMENT` is read consistently.
11. **Unset default = ENFORCE-ON.** Missing/invalid `FREE_TIER_ENFORCEMENT` must default to enforcing (never
    silently give the product away) and must never 500.
12. **Mechanism (decision, §8):** prefer a D1/KV data-plane flag over a worker secret — it flips even if the
    deploy path is unhealthy mid-incident (both reviewers). Recommend D1 flag row (short-cached read).
13. **`enforcementActive: bool` in the entitlement payload** so client + ops can see whether the switch is engaged.

### E. Enforcement completeness
14. **Thread the entitlement prop** AuthGate→App→`ProgressScreen` + `MistakesScreen` (`App.js:~2356-2373`
    passes none today) so deepProgress (own dashboard tab) + unlimitedPractice (practise-mistake) can be gated.
15. **`GET /api/data/mock-history` (`data.js:~53`)** still returns full paid mock data ungated → decision (§8):
    allow as read-only own historical data (recommended) vs gate behind mockTests.
16. **Audit ALL quiz-start entry points vs the daily cap** (redo-on-results, topic buttons, re-run daily) — map
    each to its gate; none cost money but the "1 set" cap must stay credible.

### F. Rollout hardening
17. PRAGMA-check every resolver/gate column vs prod before the worker deploy (columns confirmed present —
    standing guard per the 12-Jun outage).
18. Post-deploy verify the Stripe WEBHOOK (resend a test event → 200 + dedupe + `subscription_status` update),
    not just checkout; confirm `STRIPE_WEBHOOK_SECRET` unchanged.
19. Align trial expiry to London day (consistency with daily-claim; predictable school-day flip) — minor.
20. Tests: parity across BOTH `access.hasAccess` and `access.entitlement`; trial boundary (31d→free, 29d→trial);
    fail-open (missing AND stale); tutor allow-list drift guard.
21. Observability: log gate decisions (opaque IDs only), signals for paywall-shown-to-a-payer + resolution-error rate.
22. Cleanup: fix the now-misleading `stripe.js` "tracked client-side from accounts.created_at" comment.

### New decisions for Ben (added to §8)
- **Kill-switch mechanism:** D1/KV data-plane flag (recommended, incident-robust) vs worker secret.
- **mock-history:** allow read-only own historical data (recommended) vs gate behind mockTests.

## 12. Fable whole-free-tier review — folded in (AUTHORITATIVE, extends §11)
Fable validated the architecture + built code as genuinely good, but caught what §11 missed. Tagged
[GATE] = must fix before the worker+client flip; [RELEASE] = same release (money about to flow);
[FIX]/[ACCEPT] = do-it/consciously-accept.

### A. CRITICAL — server-drive the free-tier gate (kills the URL bypass)
- **[GATE] N1 — flag bypass.** `src/utils/featureFlags.js` `readUrlFlag`/`readStorageFlag` have NO
  production guard and OUTRANK the build-time env flag, so `?ff-freeTier=false` (or `localStorage`) turns
  off every client gate INCLUDING the daily-claim call (`claimDailySetIfNeeded` early-returns `'allowed'`
  when the flag is off). Total, shareable, zero-skill paywall bypass. **FIX: drive all free-tier gating
  from the SERVER entitlement** (`entitlement.tier === 'free'` / `canUseFeature`), already in the payload;
  keep `freeTier` ONLY as a build-time rollout flag; disable URL + localStorage overrides for `freeTier`
  in production builds (mirror the NODE_ENV guard already on `?qa-tier`). The daily-claim call must key off
  the server entitlement, never the client flag.

### B. Child-first failures
- **[GATE] N2 — claim-then-abandon burns the child's only set + the modal lies.** The claim fires before
  the quiz with a throwaway `sessionId` (App.js ~641), so migration 0017's `owner_session_id` resume path
  is DEAD CODE; daily has no save/resume (only focused does). A free child interrupted mid-set returns to
  `DailyCapModal` "you've finished today's set" (false). **FIX: persist the day's claim `sessionId` per
  child (localStorage) and resend it; add daily quiz save/resume; honest modal copy for the
  alreadyClaimed-but-unfinished case.** (Trade-off: a persisted sessionId lets one device re-enter the same
  set all day — acceptable; the cap's integrity now rests on the server entitlement per N1, not the client.)
- **[GATE] N4 — trial-expiry day turns live homework into a child dead-end** (the ~16 pupils, ~2 Aug).
  `GET /api/pupil/assignments` (`assignments.js:191-215`) is untouched, so an expired-plan pupil still sees
  the homework banner then gets refused on tap — violates "never locked homework to the child." **FIX:
  filter un-entitled recipients out of (or mark locked-with-explanation in) the pupil-facing list in the
  same change, and surface to the tutor why.**
- **[RELEASE] N8 — no trial→free transition experience.** Banner just vanishes day 30; `buildDay30Email`
  (`email.js`) frames it as the trial "ending" with a paywall. **FIX: one-time "welcome to your free plan"
  in-app explainer + rewrite the day-30 email; frame all lock CTAs to the PARENT, not the child.**
- **[FIX] handleRetry unclaimed set.** `handleRetry` (App.js ~959-976) regenerates a fresh daily set with
  NO claim = another unlimited-sets bypass. Route it through the same server-entitlement gate.

### C. More tutor leaks (extend §11-5/6 to allow-list)
- **[GATE] N3 — `GET /api/tutor/assignments/:id` (`assignments.js:168-176`, `SELECT ar.*`)** returns every
  recipient's `question_results`. §11 gated the drill-down but missed this route. Allow-list + drift guard.
- **[GATE] §11-6 pulse is INCOMPLETE.** `src/utils/tutorPulse.js` (62-132) also leaks per free pupil:
  `accuracy_this_week`, `weakest_subject`/`weakest_accuracy`, the at-risk sort, and — missed by all — the
  per-pupil `weak_topics[].pupils[]` accuracy breakdown. Build the WHOLE pulse as an allow-list inside
  `buildDashboardData` (pass an entitled-child-id set; null all analytics for others; exclude them from
  `weak_topics` and the `avg_accuracy_this_week` aggregate) + its own drift guard.

### D. Stripe lifecycle over-generosity ([RELEASE] — real money now)
- **N5:** `past_due` grace is UNBOUNDED (full access forever if a sub sticks). `invoice.payment_failed`
  sets `past_due` for ANY invoice (not just subscription-linked). The paid-through backstop (`isFutureEpoch`)
  grants FULL for `unpaid`/`incomplete`/`incomplete_expired`/`paused` while `period_end` is future.
  `reconcileSubscriptions` only audits `active`/`trialing`, so stuck accounts are invisible. **FIX: bound
  grace (`past_due` honoured only while `periodEnd + N days` is future); exclude `unpaid`/`incomplete*` from
  the backstop; guard `payment_failed` on the invoice being subscription-linked; widen the reconcile query
  to include `past_due`.**
- **N6:** a late-retried `invoice.paid` arriving AFTER `subscription.deleted` writes `active` permanently
  (reordering, not a dupe). **FIX: refuse an `active` write over `canceled` unless the event `created` is
  newer, or let reconcile auto-correct this direction.**
- **N7:** the `invoice.paid` renewal-refresh guard uses `invoice.subscription`, which moved to
  `invoice.parent.subscription_details.subscription` on API `2025-03-31.basil`+. **VERIFY the endpoint's
  pinned API version; if basil+, fix the path or the Gap-3 refresh is dead code** (tests pass on legacy fixtures).

### E. §11 refinements + kill-switch reality
- **[GATE] A1 refinement:** with `freeTier` ON, a not-yet-synced returning payer is admitted to `'ready'`
  with free-floor LOCKS, not the subscribe screen — so the "confirming payment…" state must suppress the
  LOCKS too, not just the paywall.
- **A3 DECIDED (Ben, allow):** unifying the trial calc means a cancelled-sub account still within 30 days of
  signup flips paywalled → full trial. **Accepted** (they're within their trial window regardless of the card).
- **[FIX] N9 — kill-switch doesn't revert mid-session** (entitlement fetched once per session); §6's
  "cascades automatically" over-claims. **FIX: re-fetch `/api/account` on tab visibility/focus (so a flip
  reaches open clients within seconds), AND document "flip + users refresh" in the runbook.**

### F. Lower severity — decisions
- **[FIX] N12** double-tap on daily start fires two claims + pops the cap modal over the started quiz — add
  an in-flight guard. **[FIX] N14** `daily_claims` has no retention purge (GDPR minimisation) — mirror the
  `processed_operations` 7-day purge (e.g. 30-90 days). **[FIX] N15** `reconcileSubscriptions` logs EMAILS
  (PII in worker logs) — trim to opaque account id. **[FIX] N16** a tutor's own account resolves `free`
  after 30 days → their AI-chat preview 403s though Tutor Mode is free — key the tutor-preview gate off tutor
  status, not practice tier. **[ACCEPT] N10** per-child cap × extra children (self-punishing via split
  progress). **[ACCEPT] N11** delete+re-signup restarts the no-card trial (inherent). **[ACCEPT/NOTE] N17**
  cancelled-paid-through can open a 2nd overlapping sub (minor double-billing window). **[NOTE] N18**
  assignment `itemType` can be `mock`/`custom_quiz`/`lesson`, not only `topic` — gating on `focusedLearning`
  still blocks free pupils (all-false payload), but don't rely on the all-topic premise in code.

### Build ordering note
Rebase onto master AFTER tonight's Sentry deploy lands react-7 (so freemium sits on all 3 fixes). Build N1
first (it changes the gate's source of truth, which the other client gates depend on), then B/C, then D, then
tests. Ship-gate ([GATE]) items block the flip; [RELEASE] items ship in the same release.

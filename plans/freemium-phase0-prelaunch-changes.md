# Pre-launch change list — freemium visual walkthrough (8 Jul 2026)

**Status:** agreed with Ben during the pre-deploy visual walkthrough on 8 Jul 2026.
These are changes to make on branch `phase-0-freemium` BEFORE the safety pipeline + deploy.
Companion to `freemium-phase0-completion-design.md` (the build spec). Nothing here is built yet.

**Context:** the freemium enforcement build was code-complete and pushed, but a visual
walkthrough of the actual child + tutor surfaces surfaced four gaps. Two of them (My Journey
and the Parent Dashboard) turned out to be the same underlying decision: we had never pinned
down what "basic progress" (free) actually contains versus "deep progress" (paid).

---

## The root decision: the basic vs deep progress line (AGREED)

The design always said free = "1 daily set + basic progress + streaks". We now define
"basic progress" precisely, and apply the SAME line consistently in three places: the child's
**My Journey**, the **Parent Dashboard**, and the **Tutor Dashboard**.

Principle: **free shows effort and engagement (motivational); paid shows the diagnosis
(what to work on).**

**Basic (FREE) — shown to child, parent, and tutor:**
- Streak, prep points, badges
- Total questions answered / days active
- Questions done this week
- One overall accuracy % (single headline number)
- Per-subject mastery bars (Maths / English / VR) — the three top-level percentages

**Deep (PAID) — locked for free, unlocked on Plus:**
- Per-topic strong/weak map + trend arrows (the topic star grid)
- Weakest-topic call-out and "what to practise next" recommendations
- Mock test results
- Per-question drill-down / quiz detail

The subject bars are deliberately IN the free set (Ben's call): a parent/tutor sees "doing
well overall, English is lowest" but must upgrade to see *which* English topics and what to do.
That is the intended upgrade trigger, without leaving them blind.

This same basic set is what the tutor sees for a free pupil too, which resolves the earlier
"tutor sees nothing" concern: the tutor gets engagement + one overall accuracy number + the
three subject bars, but not the topic diagnosis or the printable report.

---

## Change 1 — Recommendation cards bypass the Focused lock (AGREED: replace)

**Problem:** the mode picker correctly locks Focused Learning, but the home "What to practise
next" recommendation cards route straight into the Focused flow (micro-lesson + topic quiz)
with NO free-tier gate. This is the default happy path, not a determined bypass, so a free
child never perceives Focused as paid, and those topic quizzes aren't server-capped so it also
busts the "1 set a day" feel.

**Two ungated instances of `RecommendationCard`:**
- `src/screens/HomeScreen.js` — `suggestions[0]` (~line 194) and `suggestions.slice(1)` (~line 256).
  HomeScreen already receives `freeTierActive` / `entitlement` / `onUpgrade` but never passes
  them to the card.
- `src/screens/ChildProgressView.js:62` — the recommendation card inside "My Journey" is the
  same ungated entry point.

**Fix:** for a free child, replace the recommendation card(s) with a single calm
"Today's practice" card that points at their one free Daily set. No lock look, no sell —
orient them to the thing they *can* do. Applies in both HomeScreen and ChildProgressView.

## Change 2 — Lock Study Toolkit for free (AGREED, new decision)

**Problem:** Study Toolkit / standalone micro-lessons currently stay OPEN on the free plan.

**Fix:** lock the Study Toolkit with the same calm "Part of PrepStep Plus" treatment as
Focused and Mock (locked tap = silent no-op, no upgrade button — Option A). Cover both entry
points: the **Study Toolkit button on the mode picker** (`LearningModeScreen`) and the
**"My Lessons" nav button on the home screen** (`onViewMyLessons`).

**Conscious implication:** this removes the last free educational surface, leaving the free
tier as "1 Daily set/day + basic progress". Internally consistent because the micro-lessons are
also the pre-quiz lessons for Focused, which is already locked.

## Change 3 — "My Journey" leaks the strong/weak topic map (AGREED: lock the diagnostic parts)

**Problem:** the Parent Dashboard tab is gated, but the **My Journey tab
(`ChildProgressView`) receives no entitlement props at all** (`ProgressScreen.js:79-88`
passes none) and shows the full per-topic star grid with strong/weak scores and trend arrows.
That is exactly the paid diagnostic, sitting wide open.

**Fix:** thread `freeTierActive` / `entitlement` / `onUpgrade` into `ChildProgressView` and
apply the basic/deep line above:
- Keep (free): streak / PP, total questions, questions this week, overall accuracy, the three
  subject mastery bars.
- Lock (paid): the per-topic star grid + trends, the weakest-topic call-out, and the
  recommendation card (see Change 1).

## Change 4 — Parent Dashboard shows nothing; add the basic data set (AGREED)

**Problem:** the Parent Dashboard analytics stack is fully locked, so a free parent sees no
data at all. We want the basic set shown here, mirrored on the tutor dashboard.

**Fix (client — Parent Dashboard):** unlock the basic set (engagement + overall accuracy +
three subject bars) and keep only the topic-level/diagnostic stack behind the lock. This is a
change from "lock the whole analytics stack" to "lock only the deep half".

**Fix (server — Tutor Dashboard):** this is the bigger piece. Today the tutor routes withhold
ALL performance data for a free pupil (`tutor.js` roster pulse omits everything; pupil detail
returns only profile + homework + notes with `deepProgressLocked:true`). To show the tutor the
same basic set, the server must now COMPUTE and RETURN the basic aggregates for free pupils
(overall accuracy + the three subject-level mastery figures + engagement), while still
withholding the topic breakdown, mock results, per-question data, and the printable report.
Touches: `routes/tutor.js` dashboard roster (`buildDashboardData` / `tutorPulse.js` allow-list)
and pupil detail (`tutor.js:~333-440`), plus the report route stays fully locked
(`routes/report.js`). Update the tutor client (`PupilDetailScreen`, `TutorDashboardScreen`) to
render the basic set instead of only the nudge.

> Note: Change 4's server side widens what a free pupil's tutor route returns, so the
> entitlement-key parity tests and the tutorPulse billing-column leak guard must be updated,
> and the new basic-aggregate fields added to the allow-lists deliberately (not via a spread).

## Change 5 — Rewrite the trial emails (AGREED: not a tidy, a rewrite)

**Problem:** walking through the reframed day-25 and day-30 emails (`workers/ai-tutor/routes/email.js`,
`buildDay25Email` ~L387, `buildDay30Email` ~L430), the copy is clunky, under-sells Plus, and
contains at least one false claim. Ben's verdict: "a bit lame, don't really sell the benefit of
Plus." Specific faults found:

- **Em dashes throughout** (now a hard global rule: none, anywhere). Both emails are full of them.
- **False feature claim:** day-30 says the free plan includes "every game, streak and reward."
  There are NO mini-games in the product (grep of `src` finds "games" only inside question text
  and tips). The real reward mechanics are streaks, prep points, and badges/achievements. Fix the
  claim to match reality.
- **Doesn't sell the Plus value:** the emails barely mention the things a parent actually pays
  for. They should lead with the paid benefits, especially the **full Parent Dashboard / deep
  analytics** (the per-topic strong-weak diagnosis and "what to work on next"), on top of
  unlimited practice, Focused Learning on every topic, and mock tests. This is now doubly
  important because Change 3/4 make those analytics the core paid value.
- **Grammar / clunk:** "the 18 quizzes of learning data ... stays either way" (should be plural
  "stay"; "quizzes of learning data" is clunky); "their mastery and mock results, all stays put"
  (should be "stay"). Several convoluted sentences.

**Fix:** DONE (copy) — final Ben-approved copy for both emails is in
`plans/freemium-email-copy-final.md`, drafted by the marketing-advisor council (reverse-trial
loss-aversion strategy), reviewed, and edited per Ben. The build task is now purely mechanical:
implement that copy into `buildDay25Email` / `buildDay30Email`, wire the merge fields and the
documented fallbacks, and give the day-7 / day-14 trial emails a quick consistency pass (no em
dashes, no invented features, company voice not one-man-band per
`feedback_prepstep_project_as_real_company`). No further copy decisions needed; just drop it in.

Note the day-25 "weakest topic" hook (naming Long Division at 58%) is a deliberate, well-aligned
conversion lever and should stay: at day 25 the parent still has trial access, so the email shows
them the exact diagnostic they are about to lose. Keep it.

---

## What is NOT changing (confirmed working as designed during the walkthrough)

- Class assignment with a free pupil: server resolves plan at send time, skips free recipients,
  returns the `skipped` list, 422 `no_eligible_recipients` if all free, no orphan assignment.
- Payer → free transition on an existing assignment: homework list hides Focused items for a
  free pupil; start/complete re-checks entitlement live and 403s `upgrade_required`.
- Class-level aggregates exclude free pupils, so no data leaks via the class average / group
  weak-spot card.
- The child mode picker locks (Focused / Mock / Challenge) and the calm Option-A no-sell
  treatment.

## Still-open carry-overs from the build (not part of these 4, revisit before deploy)

- DailyCapModal still shows an Upgrade button to whoever hit the cap (the one deliberate
  conversion moment — confirm keep or remove for full Option-A consistency).
- Whether to add a persistent "Upgrade to PrepStep Plus" item to the parent ACCOUNT MENU.

## Sequencing note

Changes 1-3 are client-only; Change 4 is client + a server widening of the tutor routes; these
must ship in the same release as the rest of the client flip and the deploy, per the "deploy
gates + client flip together" rule, and be done before the safety pipeline + deploy. Change 5
(email copy in the worker) is decoupled from the client flip and can land independently, but it
should be done before the trial emails start firing at real parents, so treat it as part of the
same pre-launch batch.

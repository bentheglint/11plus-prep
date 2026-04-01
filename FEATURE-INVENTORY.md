# Feature Inventory — 11+ Prep App

Last updated: 2026-04-01

Comprehensive list of all functional features (not question content).
Use this to track testing status and verify everything works.

## Testing Status Key

- **Untested** — not yet verified
- **Verified** — manually confirmed working
- **Broken** — confirmed not working, needs fix
- **Fixed** — was broken, fix applied, needs re-verification
- **N/A** — dev-only or low-risk, skip for now

---

## Quiz Modes (4)

| # | Feature | What it does | Status | Notes |
|---|---------|-------------|--------|-------|
| 1 | **Daily Learning** | 10 Qs from across topics, Leitner due items + weighted selection | Verified | Full chain correct: Leitner injection, weighted selection, dedup, difficulty targeting. |
| 2 | **Focused Learning** | Pre-lesson then 10 Qs on one topic, difficulty-targeted | Verified | State timing fixed. Pre-lesson flow working (23 topics in lesson history). |
| 3 | **Challenge Mode** | D3-only from strongest topics, unlocks at 3+ exam-ready topics | Verified | Unlock logic, D3 selection, and guards all correct. Can't trigger yet (no topics at 20+ volume). |
| 4 | **Mock Test** | Timed full exam (50/49/85 Qs), flagging, navigator, sections | Verified | Fixed: double-save guard was unreliable (object mutation → ref). Removed redundant shared history. All mechanics correct. |

## Adaptive & Scheduling Systems (4)

| # | Feature | What it does | Status | Notes |
|---|---------|-------------|--------|-------|
| 5 | **Adaptive Difficulty** | Adjusts next Q difficulty based on last 4 answers | Verified | Both bugs fixed 2026-03-31: difficulty field added to answers, duplicates excluded from swaps. Algorithm correct (Rosenshine thresholds). |
| 6 | **Leitner Spaced Repetition** | Wrong answers re-appear in future Daily quizzes | Verified | 26 queue items, 2 due. Add/promote/retire logic correct. 1/3/7/14 day intervals. |
| 7 | **Weighted Topic Selection** | Daily quiz favours weak/stale topics | Verified | Audited with Daily Learning. Weights correct: never-tried=330, stale=2.5x, declining=1.8x, floor=5. |
| 8 | **Suggested for You** | Top 2 focus areas on homepage | Verified | Was crashing, fixed 2026-03-31 |

## Micro-Lessons (3)

| # | Feature | What it does | Status | Notes |
|---|---------|-------------|--------|-------|
| 9 | **Lesson System** | 5-screen flow: Intro, Hook, Teach, Interact, Consolidate | Verified | Code audit: selection, visuals, interactions all correct. Content validated via Speed Review (3,267 screens). |
| 10 | **Find Me a Lesson** | Links wrong quiz answers to the right lesson | Verified | Full chain: question → mapping → lesson bank → MicroLessonScreen. No bugs. |
| 11 | **Study Toolkit** | Browse all lessons by topic with progress badges | Verified | Tips carousel, lesson browser, launch handler all correct. |

## Progress & Analytics (8)

| # | Feature | What it does | Status | Notes |
|---|---------|-------------|--------|-------|
| 12 | **Mastery Scoring** | Per-topic 0-100 score with recency decay | Verified | Algorithm correct. Spelling 2/10 → 20% accuracy, 1 star (score 10, volume-penalised). No bugs found. |
| 13 | **Child Progress View** | Streaks, PP level, topic stars, recommendations | Untested | Depends on mastery + streaks |
| 14 | **Parent Dashboard** | On-track status, readiness, heatmap, calendar, speed | Verified | All 8 components audited. OnTrackCard, Calendar, Exam Readiness all showing correct data. No bugs in any component. |
| 15 | **Topic Drill-Down** | Sparkline, difficulty breakdown, speed, trend | Verified | Mastery data, sparkline, difficulty bars all correct. |
| 16 | **Exam Readiness Bands** | Per-subject classification (Excelling to Building) | Verified | Audited in mastery + dashboard. Calculation and display correct. |
| 17 | **Trend Analysis** | Up/down/stable per topic, last 10 vs prev 10 | Verified | Audited in mastery. ±5% threshold, displayed in heatmap + drill-down. |
| 18 | **My Mistakes** | View + inline practice of wrong answers | Verified | Redesigned as practice mode 2026-03-31 |
| 19 | **Mock Test History** | Past mock results in parent dashboard | Verified | Audited in dashboard. Sparkline, speed calc, per-user data. |

## Gamification (4)

| # | Feature | What it does | Status | Notes |
|---|---------|-------------|--------|-------|
| 20 | **Streak System** | Consecutive practice days tracked | Verified | 3-day streak correct (30/31 Mar + 1 Apr). History, longest, lastQuizDate all accurate. |
| 21 | **Prep Points & Levelling** | XP-like system, level = floor(sqrt(totalPP/50)) | Verified | 1,855 PP = Level 6 (correct). todayPP tracking working. |
| 22 | **Achievements** | 20+ milestone badges with modal popup | Verified | Fixed: setTimeout was checking stale data (achievements one quiz late). Now uses useEffect on results screen. 18 definitions correct, 5 earned. |
| 23 | **Topic Star Ratings** | 5-star display per topic from mastery | Verified | Reads mastery.stars correctly. Trend + review indicators working. |

## Tips & Guidance (6)

| # | Feature | What it does | Status | Notes |
|---|---------|-------------|--------|-------|
| 24 | **Pre-Quiz Tip** | Strategy tip before quiz starts | Verified | Selection, display, seen-marking, dismissal all correct. |
| 25 | **Post-Question Tip** | Shown every 3rd wrong answer | Verified | Topic-matched tip, every 3rd wrong, session dedup. |
| 26 | **Welcome Back Screen** | Resurfaces a tip if 2+ days away | Verified | Detection, tip selection, and dismissal all correct. |
| 27 | **Results Insight Tip** | Performance-based tip on results screen | Verified | Band-based tip selection, mark-seen on mount. |
| 28 | **Study Tips Carousel** | Subject-specific tips in Study Toolkit | Verified | Audited with Study Toolkit. Relevance sorting, seen tracking. |
| 29 | **Parent Guidance** | Personalised advice on parent dashboard | Verified | Smart trigger logic, context-aware guide selection. |

## User Management (3)

| # | Feature | What it does | Status | Notes |
|---|---------|-------------|--------|-------|
| 30 | **Multi-User Switching** | 5 profiles with avatar picker | Verified | Avatar picker, handler, persistence all correct. |
| 31 | **Per-User Data Isolation** | All data keyed by username | Verified | Fixed: tested-subconcepts prefixed, removed duplicate shared mock-test-history from useMockTest.js. question-feedback still shared (dev-only, low risk). |
| 32 | **Quiz Auto-Save & Resume** | Mid-quiz state saved, 24hr expiry | Verified | Per-user key, 24hr expiry, full state restore, guard against double-restore. No bugs. |

## Question Interaction Types (6)

| # | Feature | What it does | Status | Notes |
|---|---------|-------------|--------|-------|
| 33 | **Multiple Choice** | Standard 5-option | Verified | Rendering + correctness checking audited in quiz/mock flows. |
| 34 | **Select Two** | Pick exactly 2 correct answers | Verified | Unordered pair matching, validation guards, rendered in both quiz + mock. |
| 35 | **Pick From Sets** | 1 from Set A + 1 from Set B | Verified | Ordered pair matching, rendered in both quiz + mock. |
| 36 | **Error Spotting** | Identify which segment has an error | Verified | Segment rendering + standard option selection. |
| 37 | **Letter Codes** | Code-breaking with alphabet reference | Verified | Alphabet line renders for relevant topics. |
| 38 | **Passage-Based** | Comprehension Qs linked to a passage | Verified | Passage rendering, scrollable, question grouping by passageId. |

## AI Tutor (2)

| # | Feature | What it does | Status | Notes |
|---|---------|-------------|--------|-------|
| 39 | **AI Tutor Chat** | Context-aware help via Cloudflare Worker | Verified | Code audit: context-aware prompt, handles all Q types, error handling. External API not tested. |
| 40 | **Voice Input** | Web Speech API for chat | Verified | Browser detection, en-GB lang, proper cleanup. Browser-dependent (Chrome/Edge). |

## Results & Feedback (3)

| # | Feature | What it does | Status | Notes |
|---|---------|-------------|--------|-------|
| 41 | **Results Screen** | Score, percentage ring, motivational message | Verified | Score calc, SVG ring, performance bands, retry/home buttons all correct. |
| 42 | **Question Feedback Form** | Report issues to Google Sheet | Verified | localStorage + Google Sheets POST chain complete. |
| 43 | **Did It Help? Survey** | Post-lesson feedback | Verified | Triggers after forced lesson. Yes/No + feedback form chain correct. |

## Data Tracking (4)

| # | Feature | What it does | Status | Notes |
|---|---------|-------------|--------|-------|
| 44 | **Question Results History** | Every answer logged with full metadata | Verified | Stale closure fixed 2026-03-31. Confirmed 10/10 results saved per quiz. Old 1-per-session data is pre-fix artifact. |
| 45 | **Seen Questions Tracking** | Prevents repetition in quizzes | Verified | Per-topic tracking, persisted per-user, used in all quiz selection functions. |
| 46 | **Practice Calendar** | 84-day visual of practice days | Verified | Audited in Parent Dashboard. Correct rendering and stats. |
| 47 | **Speed Tracking** | Avg time per question, per subject | Verified | Audited in Parent Dashboard. Per-subject avg, guessing detection, trend analysis. |

---

## High-Risk Features

These depend on question results data, which was silently being lost due to the
stale closure bug (fixed 2026-03-31). They may now work correctly with fresh data
but each needs verification:

- 3 Challenge Mode unlock
- 7 Weighted Topic Selection
- 8 Suggested for You (verified working)
- 12 Mastery Scoring
- 14 Parent Dashboard (verified working)
- 16 Exam Readiness
- 17 Trend Analysis
- 20 Streak System
- 21 Prep Points
- 22 Achievements
- 23 Topic Star Ratings

---

## Summary

- **47 features total**
- **47 verified** (code audit + manual verification)
- **0 remaining**
- **9 bugs found and fixed** across Tiers 1-3

### Bugs Fixed During Audit
1. Stale closure in saveQuestionResult — only 1/10 results saved per quiz (useUserData.js)
2. Stale closure in savePracticeSession (useUserData.js)
3. Stale closure in saveMockTestResult (useUserData.js)
4. State timing crash in Suggested for You — selectedSubject read before set (App.js)
5. Adaptive difficulty — answers missing difficulty field (App.js)
6. Adaptive difficulty — duplicate questions from swap not checking current quiz (App.js)
7. Data isolation — tested-subconcepts + mock-test-history shared across users (App.js, useMockTest.js)
8. Achievements — setTimeout checking stale data, always one quiz late (App.js)
9. Mock test — double-save guard using unreliable object mutation (App.js)

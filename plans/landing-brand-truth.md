# PrepStep — Landing Page Brand Truth

Extracted directly from the live codebase (`C:\Users\benja\Documents\11plus-prep`), 9 Jul 2026.
Every claim below is cited to a file. Nothing here is invented — where the code doesn't say,
it's flagged as unknown rather than guessed.

---

## 1. TYPOGRAPHY (exact)

- **Body font:** DM Sans (variable). Loaded via `@fontsource-variable/dm-sans` (self-hosted npm
  package, imported in `src/index.js:5`). Applied globally via `src/index.css:41-46`:
  `font-family: 'DM Sans Variable', 'DM Sans', system-ui, -apple-system, sans-serif;`
- **Heading font:** Outfit (variable). Loaded via `@fontsource-variable/outfit`
  (`src/index.js:6`). Applied via the `.font-heading` utility class defined in
  `src/index.css:48-50`: `font-family: 'Outfit Variable', 'Outfit', system-ui, -apple-system, sans-serif;`
  Used everywhere as `className="font-heading"` on `<h1>`/`<h2>` elements across screens (e.g.
  `src/screens/HomeScreen.js:136`, `src/components/SubscribeScreen.js:134`).
- **Loading method:** self-hosted via the npm `@fontsource-variable` packages — NOT Google Fonts
  CDN, NOT a `<link>` tag in `public/index.html`. `public/index.html:28` has an explicit comment:
  *"Fonts self-hosted via @fontsource (imported in index.js) — no external requests."* This was a
  deliberate choice (offline-friendly, no third-party font request at runtime).
- **Weights:** the `-Variable` packages ship the full variable-font weight axis (not fixed cuts).
  No explicit weight subsetting found in the CSS — Tailwind utility classes like `font-bold`
  (700) and `font-medium` are used ad hoc per element, not a fixed 2-weight system.
- **Button font:** `.btn-primary` in `src/index.css:153-165` explicitly re-declares
  `font-family: 'Outfit Variable', 'Outfit', system-ui, sans-serif;` with `font-weight: 700`.
- **Fluid type scale:** `src/index.css:106-110` defines `.text-fluid-sm` through
  `.text-fluid-2xl` using CSS `clamp()` for responsive sizing — these are custom classes, not
  Tailwind theme extensions (Tailwind config's `theme.extend` is empty — see §2).
- **DISCREPANCY TO KNOW ABOUT:** `public/logo.svg` (the actual logo file) hardcodes
  `font-family="Nunito, -apple-system, 'Segoe UI', sans-serif"` for the wordmark text
  (`public/logo.svg:2`). Nunito is NOT one of the two fonts loaded anywhere in the app (only DM
  Sans and Outfit are `@fontsource`-installed). So the live logo asset's "PrepStep" wordmark
  renders in whatever font is actually available in the SVG's font stack at render time (likely
  a system fallback, not true Nunito, unless the viewer happens to have Nunito installed) —
  it is NOT rendered in Outfit despite Outfit being the app's heading font. A landing page
  recreating the wordmark should decide deliberately whether to match the SVG's stated font
  (Nunito) or the app's actual heading font (Outfit) — they are not the same today.

## 2. COLOUR PALETTE (exact hex)

Single source of truth: CSS custom properties in `src/index.css:7-37`, confirmed recurring
throughout `SubscribeScreen.js`, `HomeScreen.js`, `AuthGate.js`, `LearningModeScreen.js`,
`MistakesScreen.js`.

| Token | Hex | Usage |
|---|---|---|
| `--primary` | `#7C3AED` | Brand violet — primary buttons, links, active states, focus rings, VR subject colour |
| `--primary-light` | `#A29BFE` | Lighter violet — scrollbar thumb, secondary borders/rings |
| `--primary-surface` | `#EDE8FF` | Pale violet surface — selected-option backgrounds, tinted panels |
| `--primary-dark` | `#5A4BD1` | Hover/active state for primary violet (`btn-primary:hover`) |
| `--accent` | `#FDCB6E` | Amber/gold accent — stars (mastery), Study Toolkit icon, "Excelling" readiness band |
| `--accent-dark` | `#F59E0B` | Darker amber — icon strokes, star outlines |
| `--success` | `#22C55E` | Green — correct answers, "Exam Ready" band, English subject colour, positive states |
| `--error` | `#FF6B6B` | Coral red — wrong answers, Mock Test icon, streak flame, "My Mistakes" |
| `--maths` (subject) | `#3B82F6` | Blue — Maths subject colour throughout (cards, icons, "Building Foundations" band) |
| `--english` (subject) | `#22C55E` | Same as success green |
| `--vr` (subject) | `#7C3AED` | Same as primary violet |
| `--surface` | `#FEFDFB` | Warm off-white — card backgrounds |
| `--surface-alt` | `#FBF9F6` | Secondary warm surface |
| `--text` | `#1E293B` | Primary body text (slate-800-ish) |
| `--text-secondary` | `#64748B` | Secondary/muted text (slate-500-ish) |
| `--border-subtle` | `rgba(0,0,0,0.04)` | Card borders |
| `--bg-from` / `--bg-to` | `#EDE8FF` → `#FFF8E8` | App background gradient (violet → warm cream), `.app-bg` class |

Additional recurring hexes found inline (not CSS variables, but used consistently as literal
Tailwind arbitrary values across components):
- `#0F172A` — the wordmark text fill in `public/logo.svg:2` (near-black slate)
- `#F8F7FF` — very pale violet, used as page/card background in `SubscribeScreen.js`,
  `AuthGate.js` gradients (`bg-gradient-to-b from-[#F8F7FF] to-white`)
- `#F0FDF4` / `#BBF7D0` / `#15803D` / `#16A34A` — green tints used specifically for the
  FSM/Pupil Premium free-access callout box (`SubscribeScreen.js:301-315`)
- `#E17055` — burnt orange, Challenge Mode's gradient partner colour
  (`LearningModeScreen.js:168`, paired with `#FF6B6B`)

**Confirmed:** `#7C3AED` (violet) and `#22C55E` (green) are indeed the two most recurring
brand colours — violet is the true "primary" brand colour (buttons, links, logo bars, VR
subject, focus rings); green is semantic "success/correct" AND doubles as the English subject
colour. Blue `#3B82F6` (Maths) and coral `#FF6B6B` (error/Mock Test) round out a 4-colour
functional palette, with amber `#FDCB6E`/`#F59E0B` as a warm accent (stars, Study Toolkit).

## 3. LOGO / WORDMARK

Source file: `public/logo.svg` (viewBox `0 0 500 120`), referenced as `<img src="/logo.svg">` in
three places: `src/screens/HomeScreen.js:78`, `src/components/SubscribeScreen.js:109`, and the
signed-out `LandingPage` in `src/components/AuthGate.js:74`.

Exact construction:
```svg
<text x="20" y="82" font-family="Nunito, -apple-system, 'Segoe UI', sans-serif"
      font-size="64" font-weight="800" fill="#0F172A" letter-spacing="-1">PrepStep</text>
<!-- Ascending bars: blue → purple → green (growth mindset destination) -->
<rect x="388" y="76" width="20" height="24" fill="#3B82F6" rx="3"/>
<rect x="414" y="56" width="20" height="44" fill="#7C3AED" rx="3"/>
<rect x="440" y="36" width="20" height="64" fill="#22C55E" rx="3"/>
```
- **It is one solid colour wordmark, not two-tone.** "PrepStep" is a single word in one fill
  colour (`#0F172A`, near-black slate) — "Prep" and "Step" are NOT differently coloured. Font
  weight 800 (extra-bold), letter-spacing -1 (tight), 64px at the SVG's native scale.
- **The icon/mark is three ascending bars** to the right of the wordmark, rendered as a mini bar
  chart increasing in height left-to-right, coloured blue → purple → green in that order (the
  in-file comment calls this "growth mindset destination" — i.e. progress/improvement visual
  metaphor). Bars have `rx="3"` (slightly rounded corners).
- No separate `Logo.js` React component exists — it is a static SVG asset only (confirmed via
  repo-wide search for a Logo component: none found).
- Font caveat: see §1 — the SVG specifies Nunito, which is not an installed/loaded font anywhere
  else in the app.

## 4. HOW THE APP ACTUALLY WORKS (real flows)

**Quiz modes** (`src/screens/LearningModeScreen.js`, `src/App.js`):
- **Daily Learning** — 10 questions mixed across all topics in a subject
  (`LearningModeScreen.js:77`: "10 questions from across all topics").
- **Focused Learning** — pick one topic, a compulsory micro-lesson plays first, then a 10-question
  quiz on that topic (`LearningModeScreen.js:98-99`; flow confirmed in `beginFocusedQuiz`,
  `src/App.js:766-791` — for maths/english/verbalreasoning it routes to `setCurrentView('lesson')`
  before the quiz view).
- **Mock Test** — full timed practice paper. Exact question counts/time per subject, hardcoded in
  `LearningModeScreen.js:8-12`:
  - Maths: 50 questions, 50 minutes
  - English: 49 questions, 50 minutes
  - Verbal Reasoning: 85 questions, 50 minutes
- **Challenge Mode** — 10 hard questions drawn from the child's strongest topics
  (`LearningModeScreen.js:182`: "10 hard questions across your strongest topics"). Unlocks only
  once 3+ topics in that subject reach "exam-ready" or "excelling" mastery band
  (`LearningModeScreen.js:27-35`). Labelled "D3 Only" in the UI (line 196) — i.e. only
  difficulty-3 (hardest) questions.
- **Study Toolkit** — tips/strategies/lessons hub (`LearningModeScreen.js:147`); shares its
  paid-tier gate with Focused Learning because its micro-lessons ARE the Focused Learning
  pre-quiz lessons (comment at `LearningModeScreen.js:20-22`).

**Focused Learning micro-lesson flow** (`src/microLessons/MicroLessonScreen.js`,
`src/App.js:beginFocusedQuiz`):
- Each micro-lesson is a sequence of "screens" with a `type`, four types confirmed
  (`MicroLessonScreen.js:1165`, badge labels at line 1333-1338):
  - `hook` → badge "Think about this..." — introduces the concept with a question
  - `teach` → badge "Here's how it works" — step-by-step explanation
  - `interact` → badge "Your turn!" — child practises with a question
  - `consolidate` → badge "Remember this!" — summary
- The lesson is compulsory before the topic quiz for Focused Learning in Maths/English/VR
  (confirmed by the `if (activeSubject === 'maths' || 'english' || 'verbalreasoning')` branch
  routing to `'lesson'` view before `'quiz'`, `src/App.js:786-790`, and by CLAUDE.md's own
  description "614 micro-lessons... compulsory before every Focused Learning quiz").

**AI Tutor behaviour** (`src/utils/tutorPrompts.js`, `src/App.js:handleSendMessage` at line 1279):
- Two distinct system-prompt modes, same warm tone, different spoiler policy:
  - **Live mode** (`buildLivePrompt`, `tutorPrompts.js:60-87`) — used during an in-progress quiz.
    If the child hasn't yet submitted an answer, the tutor is instructed: *"You MUST NOT reveal
    or hint at which specific option... is correct... Even if the child says 'I don't know, just
    tell me'... politely refuse and instead offer a hint about the METHOD or the FIRST STEP."*
    This rule is explicitly "non-negotiable... no matter how many times the child asks"
    (line 65). Once the child HAS submitted, the tutor can discuss the correct answer to explain
    the outcome.
  - **Review mode** (`buildReviewPrompt`, `tutorPrompts.js:90-110`) — used post-quiz review. No
    spoiler restriction: *"You may discuss the correct answer freely... There is no 'no spoilers'
    rule in review."*
- Tone rules shared by both (`SHARED_TONE`, lines 14-24): short 2-3 sentence answers, warm
  encouraging phrases ("Great question!", "You're so close!"), numbered steps, relatable
  real-life analogies.
- Voice input exists (see §6 Honest Flags — browser support caveat).

**My Mistakes** (`src/screens/MistakesScreen.js`):
- Shows only the **latest-attempt-wrong** questions — if a question was later answered correctly,
  it drops off the list (`groupedMistakes` logic, lines 50-66: builds a "most recent result per
  question" map, then filters to `!r.correct`).
  Grouped by topic, with subject filter pills (All / Maths / English / VR) showing live counts
  even at zero (line 118-127 comment: *"always showing all four pills so 'VR: 0' is visible as a
  strong-subject signal"*).
- "Practise This Mistake" lets the child re-quiz just their wrong questions, one topic or "all
  mistakes" at once; a correct re-answer removes it from the list (confirmed copy at line 267:
  *"question(s) removed from your mistakes!"*).
- This re-quiz action ("Practise") is gated behind the paid tier when the free-tier flag is on —
  the mistakes LIST itself always stays free/visible (`MistakesScreen.js:10-13`).

**Mastery / stars / streaks / prep points**:
- **Mastery** (`src/hooks/useMastery.js`): score 0-100 per topic from recent-30-question accuracy
  × a recency-decay factor × a volume-ramp factor (lines 24-30, 91-95). Maps to a 5-star band:
  90+ = 5★ "Mastered"/"excelling"; 76+ = 4★ "Strong"/"exam-ready"; 56+ = 3★ "Confident"/"developing";
  31+ = 2★ "Developing"/"building"; 1+ = 1★ "Exploring"/"building"; 0 = "Not started"
  (`getMasteryLevel`, lines 33-40). A separate "exam readiness" band per subject (not per-topic)
  uses different thresholds/labels: 81+ "Excelling" (amber), 61+ "Exam Ready" (green), 36+
  "Developing Well" (violet), else "Building Foundations" (blue) (`getReadinessBand`, lines 43-48).
  39 topic keys total across 3 subjects (16 maths + 6 english + 17 VR, `SUBJECT_TOPICS`, lines 7-11).
- **Streaks** (`src/hooks/useStreaksAndPP.js`): a streak requires practising **5 of the last 7
  days** on a rolling basis, not literally every calendar day — a gap of 3+ days, or dropping
  below 5-in-7 for an established user, resets the streak to 1 (lines 122-165, echoed in the
  child-facing copy in `StreakDisplay.js:156-171`: *"Practise 5 out of every 7 days"..."Drop below
  5 days in any week and your streak starts fresh"..."Taking breaks is healthy!"*). One quiz
  completion = one practice day, capped once per day.
- **Prep Points (PP)**: earned per quiz — +10/question attempted, +5/correct answer, +25 quiz
  completion flat, +50 bonus for 80%+ score, +100 bonus for a brand-new topic, +25 daily practice
  bonus (`calculateQuizPP`, lines 211-250). Level = `floor(sqrt(totalPP / 50))` (line 9-11) — e.g.
  Level 1 at 50 PP, Level 5 at 1,250 PP, Level 10 at 5,000 PP (comment lines 7-8).

**Parent Dashboard** (`src/screens/ParentDashboard.js`):
- Always-visible (any tier): tutor-assigned homework card (dormant if none), tutor-linking
  management card (dormant if none linked), an "Exam Readiness" card (3 subject bars + overall
  accuracy + engagement), subscription management (Stripe customer portal — only shown for
  active/past_due/trialing statuses), and a GDPR "Data & Privacy" block (weekly-email opt-in
  toggle, full data export/download as JSON, full account+data deletion with a type-to-confirm
  step).
- **Paid-tier-only** ("deep progress", gated behind `deepProgress` entitlement, only enforced
  when the `freeTier` flag is on): an "Is my child on track?" card, a topic-by-topic heat map,
  "Focus Areas" recommendations, parent guidance content, a practice-day calendar, full mock
  test history, and speed/accuracy tracking charts (lines 176-213). Free-tier users instead see
  a `LockedFeatureCard` upsell plus a smaller `BasicProgressSummary`.

**Pricing / freemium** (`src/components/SubscribeScreen.js`):
- **Annual: £199/year** ("Best value", saves £101 vs monthly — line 162-164).
- **Monthly: £24.99/month** (line 177).
- Comparison table (lines 18-25, 245-254) positions PrepStep against a named competitor, "Atom
  Exam Prep Plus," at £671.90/yr and £69.99/mo — comparison footnote: *"Prices verified May
  2026"* (line 258) — i.e. this comparison needs re-verifying periodically, it is not evergreen.
- **Free School Meals / Pupil Premium**: fully free access, but manual — a parent must email
  `hello@prepstep.co.uk` with proof of eligibility (lines 41-42, 301-315). There is no self-serve
  FSM/PP flow in the code.
- **Multi-child**: the standard plan covers exactly one child; a second child requires emailing
  support to "sort something out" (lines 37-38) — i.e. not a self-serve family plan today (also
  confirmed structurally by the separate `project_11plus_multichild_constraint` memory note: a
  DB `UNIQUE(account_id)` constraint currently blocks a second child outright for most accounts).
- Founder note block explicitly names Ben as "founder of PrepStep," "Made in Bournemouth. Built
  by a parent." (lines 262-273, 318-319).

**Signup / auth flow** (`src/components/AuthGate.js`):
- Auth provider: Clerk (`SignIn`/`SignUp` components, line 2).
- Signed-out landing hero copy (lines 74-88): *"Step-by-step practice for the GL Assessment 11+
  exam. Maths, English, and Verbal Reasoning — with smart revision that adapts to your child."*
  CTA: **"Try free for 30 days"** with **"No card required. Full access from day one."**
  — this is confirmed as a genuine no-card 30-day trial, not a "reverse trial" that auto-bills.
- Onboarding sequence for a new parent: sign up (Clerk) → Consent screen (explicit GDPR-style
  data-use table + terms/privacy checkbox + optional weekly-email opt-in, `ConsentScreen`
  lines 120-213) → Child's first name screen (`ChildNameScreen`, lines 217-263) → straight into
  the app (no separate localStorage-migration step for new accounts — that step was retired,
  comment line 9-11).
- A separate **Tutor** signup fork exists (own name, no child, `TutorNameScreen`) reached via
  "Are you a tutor? Sign up here" on the landing page (line 108-113) or a `?tutor=1` link.
- Invite-code and tutor-join-code capture on load (`/join/<code>`, `?invite=CODE`,
  `/invite/<token>`) all persist through the Clerk redirect via localStorage/sessionStorage
  (lines 397-480) — invite-accepted users get free access, no card (`InviteBanner`, line 44).

## 5. REAL SCREEN INVENTORY

- **Home/dashboard** (`src/screens/HomeScreen.js`): top bar with the `/logo.svg` wordmark + a
  clickable flame streak badge + (if multi-child) a child switcher + account menu. Greeting
  "Hey {name}!" in Outfit heading font. Three subject cards in a bento grid (Maths blue,
  English green, VR violet gradients) each showing an icon, subject title, and a mastery
  percentage progress bar. Below that: a "what to practise next" recommendation card (or, if
  free-tier-locked, a generic `TodaysPracticeCard`), plus quick-nav buttons to My Progress, My
  Mistakes, and My Lessons. A trial-countdown banner ("X days left in your free trial") can
  appear above the subject cards when relevant.
- **Micro-lesson screen** (`src/microLessons/MicroLessonScreen.js`): single-screen-at-a-time
  lesson flow with a coloured badge naming the stage ("Think about this...", "Here's how it
  works", "Your turn!", "Remember this!"), a progress indicator through the lesson's screens, and
  a "Next →" / "Let's practise! →" button. Includes voice input (mic icon) wired the same way as
  the quiz tutor chat.
- **Quiz question screen with AI tutor panel** (`src/screens/QuizScreen.js`): question card
  (`.card-elevated`) with a violet progress bar, question text, 5 lettered options (A-E) that
  highlight green/red after answering. Two small pill buttons above feedback: "Find Me a Lesson"
  and "AI Tutor" (chat-bubble icon). The AI tutor panel is NOT a separate side panel — it expands
  inline below the question inside a pale-violet bordered box (`bg-[#EDE8FF] border-[#A29BFE]`)
  headed by a brain icon, showing a scrollable chat-bubble history (child messages right-aligned,
  tutor left-aligned) and a text input with an optional mic button for voice dictation
  (`QuizScreen.js:594-602`).
- **Mock test screen** (`src/screens/MockTestScreen.js`): a full-paper timed flow. For Verbal
  Reasoning specifically, each new question-type "section" opens with a full-screen intro card
  (icon, section name, instructions, and a worked example) before questions in that section
  begin (`MockTestScreen.js:94-121`). A timer and a "question X of N" counter sit at the top; a
  `MockTestNavigator` lets the child jump between questions and flag ones to revisit.
- **Parent Dashboard**: see §4 above for exact contents — readiness bars always visible; topic
  heat map, focus areas, mock history, and speed charts are the paid-tier-only "deep" section.
- **Topic mastery / star ratings** (`src/components/TopicStarRating.js`): a row of 5 star icons
  (filled amber `#FDCB6E`/outline stroke `#F59E0B` for earned stars, empty grey `#DFE6E9` for
  the rest), an optional trend arrow (up/down/flat, coloured green/red/grey), and a small
  "Review" pill (amber, with a refresh icon) if the topic hasn't been practised in 14+ days.
- **My Mistakes** (`src/screens/MistakesScreen.js`): a coral-tinted header icon + "My Mistakes"
  title + mistake count summary line. Subject filter pills (All/Maths/English/VR) each showing
  a live count badge. A "Practice All Mistakes (N)" button (locked/greyed with a lock icon for
  free-tier). Below, collapsible topic groups — each a card showing mistake count, topic name,
  a small subject-colour label, and "last mistake: [date]"; expanding reveals individual wrong
  questions with a text preview and a per-question "Practise" tap target.

## 6. HONEST FLAGS — things the landing page must NOT claim, or must handle carefully

- **Exam board naming risk.** The live code currently commits hard to "GL Assessment" branding —
  it's in the meta description (`public/index.html:11`), the OG description, the landing hero
  copy (`AuthGate.js:76`), and an entire FAQ block in `SubscribeScreen.js` (lines 49-58: *"PrepStep
  is GL Assessment-specific. CEM and Pre-Test prep is on our roadmap for 2027,"* and *"used by
  grammar schools across Berkshire, Buckinghamshire, Birmingham, Essex, Kent, Lincolnshire, and
  Dorset"*). Separately, Ben's own project notes (outside this codebase) flag that Bournemouth
  11+ is switching from GL to Quest Assessment in Sept 2026 and that this is an unresolved,
  deliberately-deferred content/rework risk. **Do not let the landing page hard-commit to
  "GL Assessment"-only messaging without checking with Ben first** — the current code says GL,
  but that may be mid-transition truth, not settled truth.
- **Voice input is feature-detected, not guaranteed.** The AI tutor's mic/dictation button checks
  for `window.SpeechRecognition || window.webkitSpeechRecognition`
  (`src/App.js:1249-1250`, `src/microLessons/MicroLessonScreen.js:1187-1188`,
  `src/screens/QuizDetailScreen.js:513`) and silently hides itself if unsupported. This API is a
  Chromium/WebKit feature (Chrome, Edge, Safari) — it is not supported in Firefox. Never claim
  "voice input" as a universal, always-available feature.
- **FSM / Pupil Premium free access is 100% manual**, not an automatic or self-serve check —
  a parent must email `hello@prepstep.co.uk` with proof and be set up by a human
  (`SubscribeScreen.js:41-42, 301-315`). Don't imply an automatic eligibility checker exists.
- **Second child on one account is not self-serve.** One subscription covers one child; a second
  child needs an email to support (`SubscribeScreen.js:37-38`). Don't market a "family plan" as
  an existing, working self-serve feature.
- **The competitor price comparison is a point-in-time claim**, explicitly dated "Prices verified
  May 2026" in the app itself (`SubscribeScreen.js:258`) — it is over a year stale relative to
  today's date (9 Jul 2026 per session context) and should be re-verified, not copied onto the
  landing page as if evergreen.
- **Question-count precision**: CLAUDE.md states the content bank total (8,210 questions,
  verified 30 Jun 2026 via a script) and 614 micro-lessons — these are real counts as of that
  script run, but the library grows over time. Prefer "thousands of questions" language (as
  `SubscribeScreen.js:8` itself does: *"Thousands of GL-pattern questions"*) over a hard number
  that will go stale, unless the number is re-verified at publish time.
- **Free trial is genuinely no-card, 30 days**, confirmed in code (`AuthGate.js:83-88`:
  *"Try free for 30 days... No card required. Full access from day one."*) — this is safe to
  claim as-is, it is not a "reverse trial" that silently starts billing.
- **Deep progress analytics, Mock Tests, Focused Learning, unlimited Mistakes-practice, and
  Challenge Mode are all paywalled features behind a `freeTier` feature flag** — when that flag
  is OFF (the CLAUDE.md doesn't state its current on/off state, and this wasn't directly
  verified here — worth confirming before launch), every gate evaluates to "unlocked" and the
  whole free/paid distinction is dormant. **Do not describe a "free tier" on the landing page
  without first confirming whether the `freeTier` flag is actually live in production** — if it's
  off, everyone currently gets full access regardless of subscription status, and marketing a
  gated free tier would misrepresent the live experience.
- **Multi-child support is architecturally aspirational, not real today** — the app's UI is
  built assuming multi-child (child switcher exists in `HomeScreen.js`), but a DB-level
  `UNIQUE(account_id)` constraint blocks adding a genuine second child for most accounts (per
  Ben's own project notes, not directly re-verified in this pass but consistent with the
  "email us and we'll sort something out" copy in `SubscribeScreen.js:37-38`). Treat "multiple
  children" as NOT a shippable landing-page claim.
- **No dev/admin surfaces should appear in marketing screenshots.** Testing Mode, Speed Review,
  and the admin screen are gated by an email allowlist and are clearly internal QA tooling
  (`HomeScreen.js:291-312`, `?view=errors`, `?view=flags`, `?dev-auth=true` per CLAUDE.md) — never
  depict these as end-user features.

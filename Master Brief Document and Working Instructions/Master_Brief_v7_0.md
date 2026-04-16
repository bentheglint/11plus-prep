# 11+ Exam Prep App — Master Brief v7.0

**Last Updated:** 16 April 2026
**Project Status:** Soft launch prep · gated deploys via smoke test · gamification Phase 1 queued
**Platform:** Claude Code via Cursor IDE (Windows)

---

## 1. Project Overview

A React web app helping a 9-year-old daughter prepare for the **GL Assessment 11+ exam in September 2026**, targeting Bournemouth Grammar School and Parkstone Grammar School.

| | |
|---|---|
| **Target user** | Primary: Evie (9). Early testers: Lauren, Jacqui, Ben. Soft launch target: Evie's friends via their parents. |
| **Exam date** | September 2026 |
| **Exam format** | GL Assessment — 3 papers: Maths, English, Verbal Reasoning |
| **Live URL** | https://11plus-prep.pages.dev/ |
| **Project dir** | `C:\Users\Ben Jackson\Projects\11plus-prep` |
| **Second brain** | `C:\Users\Ben Jackson\Documents\My Brain` |

The app's **differentiator vs paper practice** is progress tracking — it records what Evie got right and wrong across 6,682 questions, surfaces weak topics, and recommends what to practise next. Anyone can do paper tests; the value is in the feedback loop.

---

## 2. Content — What's in the Bank

### 6,682 questions across three subjects

| Subject | Questions | Topics | File |
|---|---|---|---|
| **Maths** | 2,061 | 16 | `src/questionData/mathsData.js` |
| **English** | 2,505 | 6 | `src/questionData/englishData.js` |
| **Verbal Reasoning** | 2,116 | 16 | `src/questionData/vrData.js` |

**Maths topics (16):** Percentages, Decimals, Long Division, Ratio, Fractions, Long Multiplication, Algebra, Place Value, Negative Numbers, Prime Numbers & Factors, Area & Perimeter, Volume, Angles & Shapes, Sequences, Data Handling, Speed/Distance/Time.

**English topics (6):** Comprehension (passages), Grammar, Vocabulary, Spelling, Punctuation, Writing Techniques.

**VR topics (16):** Synonyms, Antonyms, Verbal Analogies, Odd One Out, Compound Words, Hidden Words, Letter Move, Missing Letters, Letter Codes, Letter Pair Series, Number Series, Letter Sums, Word Code Analogies, Number Word Codes, Logic and Language, Shared Letter.

### 584 micro-lessons

Compulsory teaching screens before every Focused Learning quiz in Maths and English. Five screens each (Intro → Hook → Teach → Interact → Consolidate) covering 38 master methods plus ~336 sub-concepts. Files in `src/microLessons/staging/`.

### ~540 SVG diagrams

Custom visual components for geometry, data handling, algebra, VR letter puzzles. Some under `public/images/questions/[topic]/`, the rest as React components in `src/microLessons/visuals.js`.

**Oracle rule:** All new question content goes through the `11plus-oracle` agent. Claude Code handles mechanical fixes (indexing, formatting, file ops) but never writes question text, distractors, or explanations. The Oracle holds the GL research library; Claude does not.

---

## 3. Architecture

### Tech stack

- **Framework:** React 19 (Create React App / react-scripts 5)
- **Styling:** Tailwind CSS 4
- **Icons:** lucide-react
- **Motion:** `motion` library + canvas-confetti
- **Auth:** Clerk (@clerk/clerk-react)
- **Backend:** Cloudflare Workers (`workers/ai-tutor`) with D1 + Workers KV
- **Hosting:** Cloudflare Pages
- **Headless test browser:** Puppeteer
- **No router** — state-driven views

### Repo structure

```
11plus-prep/
├── src/
│   ├── App.js                     Main orchestrator (~2,100 lines)
│   ├── index.js                   Clerk + ErrorBoundary + AuthGate mount
│   ├── screens/                   One file per view (Home, Quiz, Results,
│   │                              Progress, MistakesScreen, TestingMode, etc.)
│   ├── hooks/                     useD1Data, useMastery, useStreaksAndPP,
│   │                              useMockTest, useTestingCoverage
│   ├── questionData/              mathsData, englishData, vrData
│   ├── microLessons/              MicroLessonScreen, lessonData, visuals +
│   │                              staging/ (lesson content per topic)
│   ├── components/                AccountMenu, QuizHistoryRow, ErrorBoundary,
│   │                              Motion, FlagModal, StreakDisplay, etc.
│   └── utils/                     featureFlags, confetti, quizPersistence,
│                                  tipSelection, etc.
├── workers/ai-tutor/              Cloudflare Worker — AI tutor proxy,
│                                  D1 data API, testing flags, error reports,
│                                  account/auth endpoints
├── public/images/questions/       Static SVG diagrams per topic
├── scripts/smoke.js               Puppeteer smoke gate
├── deploy.sh                      Tests → smoke → prod build → deploy
└── CLAUDE.md                      Project instructions for Claude Code
```

### Data flow

- **On login:** AuthGate (Clerk) → AccountGate → D1 `/api/data/all` bulk load → seed localStorage cache
- **On quiz completion:** batched write to D1 (`/api/data/batch`) with an optimistic localStorage write as fallback
- **Offline/fallback:** localStorage is still read on boot as a cache, but D1 is source of truth
- **Testing flags:** Worker KV ring buffer, fetched per Testing Mode mount
- **Error reports:** ErrorBoundary fires to Worker, which appends to a 50-entry KV ring buffer

### Persistence — one account, one child

Each Clerk account maps to exactly one child profile in D1. Data stays isolated per-account. Email activation is dormant until a domain + company are set up.

---

## 4. Live Features

### Practice modes

| Mode | What | Questions |
|---|---|---|
| **Daily Learning** | 10 mixed Qs across a subject's topics, Leitner review slots + mastery-weighted | 10 |
| **Focused Learning** | Pre-quiz micro-lesson + topic quiz | 10 per topic |
| **Mock Test** | Timed full-paper simulation in one subject | Variable |
| **Challenge Mode** | Harder, mixed across topics | Varies |

### Progress tracking

- **My Journey (child view):** mastery scores, streak, prep points bar, recommended next topic, recent activity, per-topic star ratings
- **Parent Dashboard:** topic heatmap, subject summaries, drill-down per topic
- **Quiz Detail View:** tap any past quiz → see every question, your answer, correct answer, explanation
- **All Activity screen:** full quiz history, newest first (reached via "View all activity →" on Recent Activity)
- **My Mistakes:** only questions where the *latest* attempt was wrong (self-healing as they're retried correctly). Subject filter pills, tap any mistake to practise it alone, "Practice All" respects filter.

### AI Tutor

- Claude Haiku 4.5 via Worker proxy
- Available inline on quiz screens ("Ask Tutor") and lesson screens ("Need help?")
- System prompts hardened against spoilage — never reveals answers on interact screens

### Testing Mode (dev/QA)

- Coverage dashboard per subject
- Flag questions/lessons with category + note → stored in KV, shared between Ben + Jacqui
- Remote flag list with View button per flag (jumps direct to the question or lesson screen)
- Session tracking

### Dev-only surfaces (unlisted URLs)

| URL | What |
|---|---|
| `?view=errors` | Error report dashboard — last 50 runtime errors across all users, filterable, clearable |
| `?view=flags` | Feature flag toggles (localStorage override + source tracking) |
| `?dev-auth=true` | Skip Clerk login in dev |
| Speed Review | In-dev scrollable preview of all 3,267 screens |

---

## 5. Quality Gates

### Automated

- **358 Jest tests** across `src/__tests__/{data,integration,logic}/` — covers data integrity (answer accuracy, category coverage, format compliance, duplicate detection), hook composition, quiz persistence, question rendering
- **Puppeteer smoke test** (`scripts/smoke.js`) — drives Evie's golden path (Home → Maths → Daily → 10 Qs → score) in a headless browser, then verifies localStorage writes for `quiz-history`, `topic-performance`, `question-results`. Gates every deploy.
- **`bash deploy.sh`** — runs tests → builds smoke bundle → runs smoke → builds prod → deploys. Any step failing blocks the push.

### Manual

- **Speed Review dev panel** — all 3,267 screens visible in a scroll list
- **Dev Review floating orange button** — on every screen, captures feedback notes
- **Google Sheet feedback** — https://docs.google.com/spreadsheets/d/139AkRkO3UxVitGyL1ZMPfsjD5fvp98M14xtEKwQMpEo/edit (Ben, Lauren, Jacqui, Daisy, Evie)

### Content

- **11plus-oracle agent** (`.claude/agents/11plus-oracle.md`) is the subject-matter authority — any new question, distractor, or explanation goes through the Oracle

---

## 6. Deployment

### Pages (frontend)

```bash
bash deploy.sh
```
Runs the full gated pipeline. Live at https://11plus-prep.pages.dev/.

**The `.env.local` dance** — every `bash deploy.sh` needs `.env.local` renamed to `.env.local.disabled` first, then restored after. CRA bakes the localhost worker URL into the prod bundle otherwise. Worth wrapping into the script eventually.

### Worker (backend)

```bash
cd workers/ai-tutor && npx wrangler deploy
```
Deployed separately when Worker code changes. The Worker serves all Pages deployments — never push an untested Worker.

### Cloudflare bindings

- **KV namespace** `TESTING_FLAGS` — stores flags, testing coverage, and recent errors (ring buffers)
- **D1 database** `11plus-user-data` — user accounts, children, quiz results, streaks, mastery
- **Scheduled:** weekly progress email cron (dormant until `EMAIL_API_KEY` set)

### Cost envelope

- **Cloudflare:** free tier today. KV writes are the tight limit (1,000/day). Client-side delta sync + Worker-side no-change guard cut write volume ~10× so we're well within budget for the testers we have.
- **Anthropic:** variable based on AI Tutor usage — costed per token
- **At ~$5/month Paid Workers** we jump to 1M KV writes/month — buys headroom for thousands of active daily users. Upgrade if/when needed.

---

## 7. Gamification (on `gamification` branch)

Phase 0 complete — D1 schema, character/economy tables. Phase 1 queued: economy spreadsheet, achievements system, prep-points wiring behind `isFeatureEnabled('gamification')`.

Research library at `~/Documents/My Brain/content/Gamification/` (14 docs, 12,000+ lines). Master roadmap at `Gamification-Master-Roadmap.md`.

**Rule:** All gamification code goes on the `gamification` branch, never master. Flag-gated once merged.

---

## 8. Roadmap (as of 16 Apr 2026)

| Order | Item | Effort | Blocker |
|---|---|---|---|
| 1 | **Master Brief update → v7.0** | 1-2h | ✅ shipping |
| 2 | **Soft launch prep** — DPIA draft, parent one-pager, monitoring routine, kill-switch | 1-2d | None |
| 3 | **Soft launch** — Evie + friends via parents | — | Item 2 |
| 4 | **Remove localStorage dual-write** | 2-3h | ~27 Apr rollback window |
| 5 | **Gamification Phase 1** — economy spreadsheet, achievements, prep-points wiring (flag-gated) | 1-2w | Item 3 stable |
| 6 | **Email activation** | — | Domain + company ready |

### Dormant / standby

- **Clerk key rotation** — only if exposed. Last rotated April 2026.
- **Gamification Phases 2-n** — character system, mini-games, social features, sound design. Planned in master roadmap; built after Phase 1.

---

## 9. Current Pain Points

- **`.env.local` dance** before every deploy — mechanical but error-prone. Wrap into `deploy.sh`.
- **Single `App.js` still ~2,100 lines** — refactor step 4 (hooks extraction) and step 5 (context providers) outstanding per architecture plan
- **Documentation drift** — this doc aims to close that gap; keep it fresh at each major feature ship
- **Testing Mode UX** — flags show pending issues well, but no way to mark "Fixed — please review" yet (the `/flags/fix` endpoint exists, no UI calls it)

---

## 10. Key References

- **`CLAUDE.md`** (project root) — working conventions for Claude Code sessions
- **`~/.claude/CLAUDE.md`** — global rules (warmth principles, feature verification protocol, decision-making principle)
- **MEMORY.md** (`.claude/projects/.../memory/`) — persistent session memory, indexes the memory files
- **11+ Oracle agent** (`.claude/agents/11plus-oracle.md`) — content authority
- **Design tokens** (`.claude/skills/diagram-design/references/design-tokens.md`) — SVG style guide
- **Testing strategy** (`~/Documents/My Brain/content/11plus-testing-strategy.md`) — full testing approach
- **Gamification roadmap** (`~/Documents/My Brain/content/Gamification/Gamification-Master-Roadmap.md`)

---

## Revision history

- **v7.0 (16 Apr 2026)** — Current state. Full rewrite reflecting multi-file architecture, Clerk + D1 + Workers, 6,682 questions, 584 lessons, testing mode, error dashboard, feature flags, smoke test gate. v6.0 archived for history.
- **v6.0 (12 Feb 2026)** — Platform transition from Claude.ai web to Claude Code / Cursor. Focus: SVG diagram creation for Area/Perimeter, Volume, Angles & Shapes, Data Handling. Question bank at 2,035 (maths-only).
- Earlier versions archived — see `archive/` subfolder.

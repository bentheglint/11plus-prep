# 11+ Exam Prep App

## What This Project Is
A React web app that prepares children for the GL-style 11+ grammar-school exam. **Audience is NATIONAL (UK-wide), not a single region.** Bournemouth Grammar School and Parkstone Grammar School were the founding story (Ben's own child, target Sept 2026), NOT the addressable market: GL-style 11+ is used across most of the country and all marketing (landing page, tutor page, SEO practice pages) must be positioned nationally, not Dorset-local. (Note the Dorset grammars are moving GL -> Quest for 2026 entry; see the Quest transition notes. Treat that as an honest local exception in copy, not the frame.) The app presents multiple-choice questions across Maths, English, and Verbal Reasoning, tracks progress in D1 (localStorage as offline cache), and includes an AI tutor chat feature (Claude API).

Git repository, dual-machine (PC + laptop) via github.com/bentheglint/11plus-prep.

## Master Brief
The full project brief lives in `Master Brief Document and Working Instructions/Master_Brief_v7_0.md` (16 Apr 2026). v6 and the old Working Instructions are archived under `archive/` for historical diagram breakdowns and platform-transition notes.

## Tech Stack
- **Framework:** React 19 (Create React App)
- **Styling:** Tailwind CSS 3, compiled at build time via PostCSS (`tailwind.config.js` + `postcss.config.js`). **Do NOT upgrade to Tailwind 4** — v4 requires Safari 16.4+ and the app supports iOS 15.6 iPads (9 Jun 2026 browser-floor incident). Replaced the runtime Play CDN on 12 Jun 2026.
- **Icons:** lucide-react
- **Build:** react-scripts 5 (`npm start` / `npm run build`)
- **No router** — state-driven views (`home` → `topics` → `quiz` → `results`)

## Architecture

### Multi-file app
`src/App.js` is the orchestrator (~2,100 lines), supported by:
- `src/screens/` — one file per view (Home, Quiz, Results, Progress, Mistakes, TestingMode, ErrorDashboard, FeatureFlags, AllActivity, etc.)
- `src/hooks/` — `useD1Data`, `useMastery`, `useStreaksAndPP`, `useMockTest`, `useTestingCoverage`, `useAchievements`
- `src/questionData/` — `mathsData.js` (3,376 Qs), `englishData.js` (2,497 Qs), `vrData.js` (2,371 Qs)
- `src/microLessons/` — `MicroLessonScreen`, `lessonData`, `visuals`, and per-topic `staging/` files
- `src/components/` — shared UI (AccountMenu, QuizHistoryRow, ErrorBoundary, Motion, FlagModal, etc.)
- `src/utils/` — `featureFlags`, `confetti`, `quizPersistence`, `tipSelection`, etc.

Auth via Clerk (AuthGate). User data in D1 via Worker (`workers/ai-tutor/`), with localStorage as offline cache.

### Question data structure
```js
{
  id: 1,
  difficulty: 2,                        // 1-3
  question: "Question text here",
  visual: {                             // optional — rendered React component
    component: "BarModel",              // key into the quiz visual registry
    props: { /* component props */ }    // defined in src/microLessons/visuals.js
  },
  options: ["A", "B", "C", "D", "E"],  // always 5 options (standard MC)
  correct: 2,                           // 0-indexed
  explanation: "Step-by-step explanation. ✓"
}
```
Some VR/English types use other shapes (`questionType: 'pick-from-sets'` with `setA`/`setB`/`correctPair`, `'passage'` with `passage`/`passageId`, `'error-spotting'`, `'letter-codes'`) — see the data files.

### Content bank (total 8,210 questions — counts verified 30 Jun 2026 via `node scripts/count-content.js`)
| Subject | Topics | Questions | File |
|---|---|---|---|
| Maths | 16 | 3,376 | `src/questionData/mathsData.js` |
| English | 6 | 2,497 | `src/questionData/englishData.js` |
| Verbal Reasoning | 17 | 2,337 | `src/questionData/vrData.js` |

Plus 614 micro-lessons (compulsory before every Focused Learning quiz in Maths/English) across 38 files in `src/microLessons/staging/`.

**Maths topic keys:** percentages, decimals, longdivision, ratio, fractions, longmultiplication, algebra, placevalue, negativenumbers, primenumbersfactors, areaperimeter, volume, anglesshapes, sequences, datahandling, speeddistancetime.

**English topic keys:** comprehension, spelling, punctuation, grammar, vocabulary, wordClassGrammar. (NOT "writingTechniques" — that key never existed; using it caused a topic→subject mapping bug fixed 11 Jun 2026.)

**VR topic keys:** synonyms, antonyms, verbalAnalogies, oddTwoOut, compoundWords, hiddenWords, letterMove, missingLettersWords, letterCodes, letterPairSeries, numberSeries, letterSums, wordCodeAnalogies, numberWordCodes, logicAndLanguage, sharedLetter, balanceEquations.

## Visuals (diagrams)

All question and lesson diagrams are **React SVG components**, not static files. A question's `visual: { component, props }` is rendered via the `quizVisualComponents` registry; components live in `src/microLessons/visuals.js`. 1,137 questions carry visuals (616 maths, 521 VR).

The old static-SVG system (`public/images/questions/`) was retired and the orphaned files deleted on 12 Jun 2026 (recoverable from git history; audit tool: `node scripts/scan-orphan-images.js`). The diagram-design skill's design tokens still govern all SVG component output.

## App Features
- **Quiz modes:** Daily Learning (10 Qs mixed), Focused Learning (pre-quiz micro-lesson + topic quiz), Mock Test (timed full paper), Challenge Mode
- **Progress tracking:** quiz history, topic performance, per-question results, mastery, streaks, prep points — persisted to D1 via Worker with localStorage as offline cache
- **My Mistakes:** latest-attempt-wrong only, subject filter pills, tap any mistake to practise it alone
- **Parent Dashboard + Child View:** separate lenses on the same data
- **Recent Activity + All Activity screens:** quiz log with drill-down to per-question Quiz Detail
- **AI Tutor chat:** inline on quiz + lesson screens, via Worker proxy to Claude Haiku 4.5
- **Testing Mode (dev/QA):** coverage dashboard + remote flag queue shared between testers
- **Dev URLs:** `?view=errors` (runtime error dashboard), `?view=flags` (feature flag toggles), `?dev-auth=true` (skip Clerk in dev)

See `Master_Brief_v7_0.md` for the full feature map.

## Key File Paths
| What | Path |
|------|------|
| Main app | `src/App.js` |
| Screens | `src/screens/*.js` |
| Hooks | `src/hooks/*.js` |
| Question data | `src/questionData/{mathsData,englishData,vrData}.js` |
| Micro-lessons | `src/microLessons/staging/*-subconcepts.js` |
| Visual components | `src/microLessons/visuals.js` |
| Entry point | `src/index.js` |
| Tailwind config | `tailwind.config.js` + `postcss.config.js` (Tailwind 3, build-time) |
| Worker | `workers/ai-tutor/index.js` |
| Smoke test | `scripts/smoke.js` + `bash deploy.sh` |
| Master brief (latest) | `Master Brief Document and Working Instructions/Master_Brief_v7_0.md` |
| Brief archive | `Master Brief Document and Working Instructions/archive/` (v6 + old Working Instructions) |

## Working Conventions
- Questions always have exactly 5 options (A–E), 0-indexed correct answer
- Explanations end with ✓
- British English and UK context (£, metres, British names)
- Visual components verified via the Visual QA skill (Chrome DevTools MCP screenshots); follow the diagram-design skill's design tokens when creating or editing any SVG component
- **The Oracle writes ALL new question content.** Claude handles mechanical fixes (index corrections, formatting, file operations) but the 11plus-oracle agent must write any new questions, replacement questions, word sets, distractors, answer options, or explanations. The Oracle has the GL research library; Claude does not. This rule exists because Claude-written content has repeatedly needed correction.
- **Always `git fetch` before any production deploy** (`wrangler deploy`, `bash deploy.sh`, Pages deploy). The SessionStart auto-pull only runs on a real Claude Code restart, so a long-lived session goes stale and deploying from stale local silently reverts work pushed/deployed from the other machine. On 8 June 2026 this reverted 6 laptop commits in prod. Check `git log --oneline HEAD..origin/master`; if behind, rebase and redeploy from merged code.
- **Deploy the frontend ONLY via `bash deploy.sh`** — never a manual `npm run build` + `npx wrangler pages deploy build/`. CRA bakes `REACT_APP_*` vars into the bundle at build time, and `.env.local` (a local-dev override pointing the frontend at the local Worker `127.0.0.1:8787` + test keys) **overrides `.env` in production builds too**. `deploy.sh` moves `.env.local` aside before building (and runs tests + smoke); a manual build does not. On 8 June 2026 a manual build shipped the localhost Worker URL to prepstep.co.uk and took the site down. A `prebuild` guard (`scripts/check-no-env-local.js`) now also blocks `npm run build` while `.env.local` is present (override: `ALLOW_ENV_LOCAL_BUILD=1`). The Worker deploys separately via `npx wrangler deploy` from `workers/ai-tutor/` and is unaffected by `.env.local`.
- **Deploy guards (12 Jun 2026):** `deploy.sh` now (a) aborts if local is behind origin/master (git-freshness, fail-closed — escape hatches `ALLOW_OFFLINE_DEPLOY=1` / `SKIP_FRESHNESS_CHECK=1`), and (b) runs `scripts/check-bundle-compat.js` on the built bundle before upload (also wired as npm `postbuild`). The compat guard catches parse-time syntax Safari 15.6 can't parse (regex lookbehind, static blocks, private-in, d/v regex flags, ES2023+) plus localhost/127.0.0.1 leaks. **Known limits:** it does NOT catch missing runtime APIs (a library calling a method iOS 15.6 lacks still breaks at call time), and a manual `npx react-scripts build` + manual `wrangler pages deploy` bypasses every guard — never deploy that way.

## Duplicated-Truth Rules (12 Jun 2026 — bulk-load outage + ghost-key sweep)

Every serious bug in the 10–12 Jun period had the same anatomy: a
hand-maintained COPY of some truth (test schema, topic-key list, label map)
drifting behind a "keep in sync" comment. Three rules now apply:

1. **No load-bearing "keep in sync" comments.** Any duplicated registry,
   schema, or list must be guarded by a test that DERIVES from or PINS to
   the real source. Patterns to copy:
   - `src/__tests__/integration/topicKeyConsistency.test.js` (live-registry
     checks derived from the question data files)
   - `workers/ai-tutor/tests/schemaParity.test.js` (test schema pinned to a
     prod-columns snapshot; regeneration command in-file)
2. **Any new or changed SQL against prod D1 — not just migrations — must be
   checked against prod's real schema before deploy:**
   `npx wrangler d1 execute 11plus-user-data --remote --command "PRAGMA table_info(<table>)"`.
   The worker test schema is hand-written and HAS diverged from prod (the
   12 Jun bulk-load outage: tests passed against a column prod doesn't
   have; every user's data load 500'd for ~2 days, masked by the silent
   cache fallback). Prod also carries at least one column that exists in
   NO migration file (`achievements.seen`) — never assume migrations ==
   prod schema.
3. **Silent fallbacks hide outages.** Any catch/fallback that degrades the
   experience (e.g. stale-cache load fallback) must be observable: a
   user-visible indicator and/or a client error report. If you add a
   fallback, add its observability in the same change.

## D1 Migration Rules — Read Before Touching `workers/ai-tutor/migrations/`

**Before any D1 schema change, read `workers/ai-tutor/docs/migration-playbook.md`.**

The 27 April 2026 incident wiped six accounts' worth of data because a migration `DROP TABLE`d a foreign-key parent and `PRAGMA foreign_keys = OFF` is silently ignored by D1. The playbook codifies the hard-learned rules:

- **Never `DROP TABLE accounts` or `DROP TABLE children`.** Both are FK parents. D1 will cascade-delete every downstream row regardless of `PRAGMA` settings.
- **`PRAGMA foreign_keys = OFF` is a lie on D1.** Don't rely on it.
- **Every migration must be staging-tested against a real snapshot first.** Build a SQLite copy from `wrangler d1 export`, apply the migration, run row-count assertions. If anything is unexpected, stop.
- **Take a fresh production snapshot immediately before applying any migration to prod.** Cost: 30 seconds. It's your rollback point.
- **Recovery toolkit in `scripts/recovery/`** has the merge-SQL pattern from the 27 April recovery, in case it ever happens again.

## Installed Skills

### Skill Creator (`.claude/skills/skill-creator/`)
Comprehensive skill/agent engineering system. Use `/skill-creator` or say "create skill", "new skill", "build agent" etc.

### Diagram Design System (`.claude/skills/diagram-design/`)
Unified design system for all SVG diagrams. Enforces consistent colours, typography, spacing, and structure across all 538+ diagrams. References design tokens (single source of truth) and component templates.

**Trigger phrases:** "diagram", "SVG", "visual", "chart", "style guide", "design tokens"

**Proactive:** When creating or editing any SVG/diagram code, Claude MUST reference the design tokens and component templates automatically.

**Critical rule:** Style changes only — never alter labels, numbers, values, or content. Every diagram must still make sense with its question after editing.

**Reference files:**
- `.claude/skills/diagram-design/references/design-tokens.md` — colours, fonts, sizes, spacing
- `.claude/skills/diagram-design/references/component-templates.md` — structure templates per diagram type

### Game Design (`.claude/skills/game-design/`)
Game design system for the gamification layer. Encodes best practices for children's educational game design (ages 8-11) across economy, progression, mini-games, characters, social features, sound, and UX. Grounded in 14 research documents (12,000+ lines).

**Trigger phrases:** "game design", "mini-game", "character system", "economy balance", "progression curve", "gamification", "training points", "boss battle", "leaderboard", "study group"

**Proactive:** When writing code for any gamification feature, automatically check against the design principles and ethical guardrails.

**Reference files:**
- `.claude/skills/game-design/references/economy-design.md` — currency formulas, spreadsheet methodology, sinks/faucets
- `.claude/skills/game-design/references/progression-design.md` — XP curves, stage design, dead zone, mastery, returning players
- `.claude/skills/game-design/references/mini-game-design.md` — 5 engines, state machine, game feel/juice, input, win/loss
- `.claude/skills/game-design/references/character-design.md` — creation, stats, evolution, states, SVG layers, themes
- `.claude/skills/game-design/references/ux-and-safety.md` — children's UX, onboarding, accessibility, dark patterns, regulations

**Research library:** `~/Documents/My Brain/content/Gamification/Gamification Research/` (14 documents)

## Agents

### 11+ Oracle (`.claude/agents/11plus-oracle.md`)
GL Assessment subject matter expert backed by the research library at `research/`. The authoritative voice on question design, difficulty calibration, GL patterns, and exam strategy.

**Trigger phrases:** "ask the Oracle", "what does the Oracle say", "Oracle check this", or any question about GL specifications, question design, or difficulty criteria.

**Four modes:**
1. **Expert consultation** — answer questions about GL patterns, formats, difficulty criteria
2. **Question generation** — create new questions matching GL specifications and difficulty levels
3. **Content audit** — check existing questions/lessons against Oracle specifications
4. **Strategic advisor** — guide app direction based on learning science and exam research

**Key principle:** All answers grounded in the research library, never invented. If the Oracle doesn't cover something, it says so.

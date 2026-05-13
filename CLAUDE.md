# 11+ Exam Prep App

## What This Project Is
A React web app to help a 9-year-old prepare for the GL Assessment 11+ exam (target: September 2026). Targeting Bournemouth Grammar School and Parkstone Grammar School. It presents multiple-choice maths questions across 16 topics, tracks progress via localStorage, and includes an AI tutor chat feature (Claude API).

**NOT a git repository.** No version control is set up.

## Master Brief
The full project brief lives in `Master Brief Document and Working Instructions/Master_Brief_v7_0.md` (16 Apr 2026). v6 and the old Working Instructions are archived under `archive/` for historical diagram breakdowns and platform-transition notes.

## Tech Stack
- **Framework:** React 19 (Create React App)
- **Styling:** Tailwind CSS 4
- **Icons:** lucide-react
- **Build:** react-scripts 5 (`npm start` / `npm run build`)
- **No router** — state-driven views (`home` → `topics` → `quiz` → `results`)

## Architecture

### Multi-file app
`src/App.js` is the orchestrator (~2,100 lines), supported by:
- `src/screens/` — one file per view (Home, Quiz, Results, Progress, Mistakes, TestingMode, ErrorDashboard, FeatureFlags, AllActivity, etc.)
- `src/hooks/` — `useD1Data`, `useMastery`, `useStreaksAndPP`, `useMockTest`, `useTestingCoverage`, `useAchievements`
- `src/questionData/` — `mathsData.js` (2,061 Qs), `englishData.js` (2,505 Qs), `vrData.js` (2,116 Qs)
- `src/microLessons/` — `MicroLessonScreen`, `lessonData`, `visuals`, and per-topic `staging/` files
- `src/components/` — shared UI (AccountMenu, QuizHistoryRow, ErrorBoundary, Motion, FlagModal, etc.)
- `src/utils/` — `featureFlags`, `confetti`, `quizPersistence`, `tipSelection`, etc.

Auth via Clerk (AuthGate). User data in D1 via Worker (`workers/ai-tutor/`), with localStorage as offline cache.

### Question data structure
```js
{
  id: 1,
  question: "Question text here",
  image: "topic-folder/filename.svg",  // optional - path relative to /images/questions/
  options: ["A", "B", "C", "D", "E"],  // always 5 options
  correct: 2,                           // 0-indexed
  explanation: "Step-by-step explanation. ✓"
}
```

### Content bank (total 6,682 questions)
| Subject | Topics | Questions | File |
|---|---|---|---|
| Maths | 16 | 2,061 | `src/questionData/mathsData.js` |
| English | 6 | 2,505 | `src/questionData/englishData.js` |
| Verbal Reasoning | 16 | 2,116 | `src/questionData/vrData.js` |

Plus 584 micro-lessons (compulsory before every Focused Learning quiz in Maths/English) in `src/microLessons/staging/`.

**Maths topic keys:** percentages, decimals, longdivision, ratio, fractions, longmultiplication, algebra, placevalue, negativenumbers, primenumbersfactors, areaperimeter, volume, anglesshapes, sequences, datahandling, speeddistancetime.

**English topic keys:** comprehension, grammar, vocabulary, spelling, punctuation, writingTechniques.

**VR topic keys:** synonyms, antonyms, verbalAnalogies, oddTwoOut, compoundWords, hiddenWords, letterMove, missingLettersWords, letterCodes, letterPairSeries, numberSeries, letterSums, wordCodeAnalogies, numberWordCodes, logicAndLanguage, sharedLetter.

## SVG Diagrams

### Location
`public/images/questions/[topic-folder]/` — referenced in questions via the `image` property.

### Current diagram counts
| Folder | SVGs | Status |
|--------|------|--------|
| area-perimeter | 74 | Complete |
| volume | 74 | Complete |
| angles-shapes | 17 | In progress |
| data-handling | 10 | In progress |

### Diagram standards (for Volume 3D cuboids)
- See `.claude/projects/*/memory/diagram-rules.md` for dimension line placement rules
- See `.claude/projects/*/memory/volume-diagram-template.md` for the locked SVG template
- ViewBox: `0 0 400 300`
- Colours: lightskyblue (front), lightcyan (top), skyblue (right)
- Cubes use 120x120 square front face; cuboids use the standard template
- Dimension lines: length (bottom horizontal), height (left vertical), width (bottom-right angled)
- Unknown values shown in red with "? cm"

### Diagram backlog (from Master Brief v6.0)
- **Angles & Shapes:** ~72 diagrams needed (Q23-Q122 v2)
- **Data Handling:** ~55 diagrams needed (Q26-Q125 v2)
- **Volume (remaining v2):** Cuboids (17), Cubes (20), Tanks (5), Pools (6), Rooms (4), Storage (2), Comparisons (4), Algebraic (4) = ~62 total

See `Master Brief Document and Working Instructions/archive/Master_Brief_v6_0.md` lines 104-116 for the exact question numbers per shape type (archived, but still the canonical list).

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
| SVG diagrams | `public/images/questions/[topic]/` |
| Entry point | `src/index.js` |
| Tailwind config | `postcss.config.js` (Tailwind 4 style) |
| Worker | `workers/ai-tutor/index.js` |
| Smoke test | `scripts/smoke.js` + `bash deploy.sh` |
| Master brief (latest) | `Master Brief Document and Working Instructions/Master_Brief_v7_0.md` |
| Brief archive | `Master Brief Document and Working Instructions/archive/` (v6 + old Working Instructions) |

## Working Conventions
- Questions always have exactly 5 options (A–E), 0-indexed correct answer
- Explanations end with ✓
- British English and UK context (£, metres, British names)
- SVG diagrams verified visually in browser (File Explorer → double-click)
- When creating SVGs, follow the locked templates in memory files
- **The Oracle writes ALL new question content.** Claude handles mechanical fixes (index corrections, formatting, file operations) but the 11plus-oracle agent must write any new questions, replacement questions, word sets, distractors, answer options, or explanations. The Oracle has the GL research library; Claude does not. This rule exists because Claude-written content has repeatedly needed correction.

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

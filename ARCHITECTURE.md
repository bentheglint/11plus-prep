# Architecture

Living document governing how we build and maintain this codebase.
Last updated: 31 March 2026.

## Project Structure

```
src/
  App.js                    Main app logic (~15,500 lines — routing, quiz engine, state)
  index.js                  Entry point
  screens/                  13 full-page views (one per currentView value)
  components/               23 reusable UI components
  hooks/                    6 custom React hooks (userData, achievements, mastery, etc.)
  utils/                    4 utility modules (adaptive difficulty, spaced repetition)
  data/                     7 static reference files (tips, achievements, parent guides)
  questionData/             Question databases (3 main + 2 mock config)
    mathsData.js            16 maths topics, ~3,200 questions (28K lines)
    englishData.js          6 English topics, ~2,500 questions (33K lines)
    vrData.js               16 VR topics, ~2,100 questions (22K lines)
    mockComprehensionData.js  Mock test passages
    mockVRConfig.js         Mock test VR configuration
  microLessons/             Lesson system
    lessonData.js           Master orchestrator — imports staging, exports lessonBank
    visuals.js              29 visual components for lesson screens
    MicroLessonScreen.js    Lesson rendering component
    PLAYBOOK.md             Lesson authoring guide
    staging/                37 topic-specific lesson files (~97K lines total)

public/
  images/questions/         SVG diagrams organised by topic folder
  *-question-lesson-map.json  3 mapping files (maths, english, vr)
  manifest.json             PWA manifest

scripts/
  data-generation/          18 scripts for creating/inserting questions and lessons
  validation/               22 scripts for auditing and linting
  fixes/                    56 scripts for bug fixes and data corrections
  oracle-review/            10 scripts + results from Oracle quality review
  archive/                  29 one-off scripts from development (kept for reference)

research/                   GL Assessment research library (30+ topic files)
workers/ai-tutor/           Cloudflare Worker for AI tutor API
Master Brief Document/      Master brief v6.0 + working instructions v6.0
```

## How Lessons Work

```
lessonData.js
  ├── Defines lessonBank with 38 topics
  ├── Each topic has inline "master" sub-concepts (1-12 per topic)
  ├── Each topic spreads in staging sub-concepts: ...algebraSubConcepts
  └── Exports selectLesson() which picks lesson + variables for a sub-concept

staging/*.js (37 files)
  ├── Each file exports an array of sub-concept objects
  ├── Each sub-concept has 2 lessons (step-by-step + spot-the-mistake/curiosity)
  ├── Each lesson has 3 variable sets for variety
  └── Each lesson has 4 screens: hook, teach, interact, consolidate

Question-to-lesson mapping:
  public/maths-question-lesson-map.json
  public/english-question-lesson-map.json
  public/vr-question-lesson-map.json
  └── Each entry: { questionId, subConceptId, confidence }
  └── subConceptId must match an id in lessonBank (inline OR staging)
```

## How Questions Work

```
questionData/*.js
  ├── Each file exports a default object: { name, topics: { topicKey: { name, questions } } }
  ├── Questions have: id, difficulty (1/2/3), question, options, correct, explanation
  ├── Some have: visual (renders a component), image (SVG path), questionType
  └── IDs are per-topic (not globally unique)

App.js loads questions and presents them via:
  Focused Learning: lesson first (via mapping -> lessonBank), then quiz
  Daily Learning: spaced repetition selection, adaptive difficulty
  Mock Tests: timed exam simulation
```

## Key Rules

### The Claude Context Rule
No single file should exceed **400 lines** of logic. Data files
(questionData/, lessonData.js, staging/) are exempt.

| Lines | Status | Action |
|-------|--------|--------|
| < 150 | Healthy | No action |
| 150-250 | Watch | Note it |
| 250-400 | Warning | Plan extraction |
| 400+ | Critical | Extract before adding more |

### One Job Per File
Each file has a one-sentence description. If you need "and", split it.

### Props Down, Callbacks Up
Components receive data via props and communicate via callbacks.

### Sub-concept ID Consistency
Every `subConceptId` in a mapping file MUST match an `id` in lessonData.js
or a staging file. Run validation before deploying:
```
node scripts/validation/validate-questions.js
```

### When to Extract
| Signal | Action |
|--------|--------|
| File hits 250 lines | Flag it |
| File hits 400 lines | Extract before adding more |
| Same logic in 3+ places | Extract to shared function |
| Component needs 10+ props | Consider if it should own state |

## Current State (31 March 2026)

### Completed
- Git initialised, data extracted to separate files
- 6 screen components extracted
- 37 staging lesson files wired up (454 sub-concepts now live)
- 7,928 question-lesson mappings at 100% coverage
- Architecture cleanup: dead files deleted, scripts organised

### Remaining
- Step 4: Extract quiz engine to useQuizEngine() hook
- Step 5: Extract shared state to React context
- App.js is still ~15,500 lines (routing + quiz engine + state — needs splitting)

# Architecture Principles

Living document governing how we build and maintain this codebase.
Agreed 27 March 2026. Updated as conventions evolve.

## The Claude Context Rule

No single file should exceed **400 lines** of logic. Data files
(questionData/, lessonData.js) are exempt, but any file with logic,
handlers, or JSX must be readable in full. This is the threshold where
Claude can hold the entire file in context and make confident changes.

| Lines | Status | Action |
|-------|--------|--------|
| < 150 | Healthy | No action |
| 150-250 | Watch | Note it, review after current task |
| 250-400 | Warning | Plan extraction soon |
| 400+ | Critical | Extract before adding more |

## One Job Per File

Each file should have a one-sentence description of what it does.
If you need "and" to describe it, it's doing too much.

## Props Down, Callbacks Up

Components receive data via props and communicate changes via callback
functions. Components don't reach into parent state directly. This
keeps them independent, reusable, and testable.

## File Structure

```
src/
  App.js              - routing shell + shared state (target: <400 lines)
  screens/            - full-page views (one per currentView value)
  components/         - reusable UI pieces (cards, buttons, modals)
  hooks/              - custom React hooks (useQuizEngine, useProgress)
  questionData/       - data files (exempt from line limits)
  microLessons/       - lesson system (lessonData, visuals, screen)
```

## When to Extract

| Signal | Action |
|--------|--------|
| File hits 250 lines | Flag it, plan extraction |
| File hits 400 lines | Extract before adding more |
| Same logic in 3+ places | Extract to shared function/hook |
| Component needs 10+ props | Consider if it should own some state |
| Adding a new feature | New file, not bolting onto existing |

## Session Health Check (Every Session)

At the start of every conversation, Claude runs a quick line count
scan of source files. If anything exceeds thresholds, flag it before
starting work. This replaces a calendar-based check — Claude has no
memory of time passing between sessions.

## What We Don't Refactor

- Data files (big by nature, no logic)
- Code that works and isn't being touched
- During active feature building (finish first, clean after)
- When Ben says "later" (note it, move on)

## Refactoring Process

When refactoring is needed, follow the /refactor skill:

1. Git must be clean (commit working state first)
2. Assess and explain what needs to change
3. Present a plan with numbered steps
4. Ben approves before any code moves
5. Each step: change, build-test, commit
6. Never mix refactoring commits with feature commits

## Current State (27 March 2026)

Refactor steps 1-3 complete:
- Git initialised
- Maths data extracted to mathsData.js
- 6 screen components extracted

Remaining (do when needed, not pre-emptively):
- Step 4: Extract quiz engine to useQuizEngine() hook
- Step 5: Extract shared state to React context

---
title: Content Gap-Fill Sprint — Maths + VR
date: 2026-05-11
status: DRAFT — ready for senior-dev + codex review
source: research/past-papers/oracle-gap-report-CGP-full-11may2026.md
problem: CGP GL Mock + 10-Minute Test analysis identified 45 gaps across Maths (30) and VR (11) — plus 4 minor English gaps. Today the app has 6,682 questions but is missing entire sub-topics that GL actually tests.
goal: Close every Maths + VR gap, properly. Questions, lesson mapping, and micro-lessons built together for each gap so Focused Learning works end-to-end. No half-arsing, no "ship now, fix later."
non-goals: English gaps are deferred (one structural cloze gap is the only major item — covered separately). Speed of delivery is not the priority; quality of process is.
---

# Content Gap-Fill Sprint — Maths + VR

## 1. Background

The CGP GL Mock Test Paper 1 (10 May 2026) and the CGP 10-Minute Tests series (Maths + VR, 11 May 2026) were scanned into the past-papers database and reviewed by the Oracle. Output: **45 confirmed coverage gaps** — see `research/past-papers/oracle-gap-report-CGP-full-11may2026.md`.

The gaps fall into three classes by content type:
- **30 Maths gaps** across `decimals`, `algebra`, `anglesshapes`, `datahandling`, `volume`, `sequences`, `areaperimeter`, `longdivision`, `speeddistancetime`, `placevalue`, `ratio`, `longmultiplication`
- **11 VR gaps** across `numberSeries`, `letterCodes`, `logicAndLanguage`, `numberWordCodes`, `missingLettersWords`, `synonyms`, `wordCodeAnalogies`, `compoundWords`, `letterPairSeries`, plus one entirely new sub-type with no existing topic mapping (balance-equation arithmetic)
- **4 English gaps** — out of scope for this plan (one needs a new question-type renderer; lowest priority)

---

## 2. Scope

In: all 30 Maths gaps + all 11 VR gaps.

Out: English gaps, performance optimisation, UI redesign, anything not directly related to question/lesson coverage.

Per gap, we commit to building all three layers fully:

1. **Questions** — appended to the relevant data file
2. **Lesson mapping** — every new questionId mapped to a subConceptId
3. **Micro-lesson** — full 5-screen lesson for the new sub-concept (where one doesn't already exist)
4. **Diagrams** — built and visually verified (for diagram-dependent gaps only)

We do not ship questions without their lesson. Focused Learning must work end-to-end for every new sub-type.

---

## 3. The Three-Layer Architecture (Critical Context)

Every topic in the app has three coupled layers. Skipping any of them breaks Focused Learning.

### Layer 1 — Question data
Files: `src/questionData/mathsData.js`, `src/questionData/vrData.js`

Each question:
```js
{
  id: 247,
  difficulty: 2,           // 1, 2, or 3
  question: "Question text...",
  options: ["A", "B", "C", "D", "E"],
  correct: 1,              // 0-indexed
  explanation: "Step-by-step explanation. ✓",
  image: "topic-folder/file.svg"   // optional
}
```

**Key rule: question IDs must be APPEND-only.** New questions go at the end of a topic's array with IDs continuing from the highest existing ID. Inserting mid-array would shift all subsequent IDs, which would corrupt every user's quiz history and My Mistakes records.

### Layer 2 — Lesson mapping
Files: `public/vr-question-lesson-map.json`, `public/maths-question-lesson-map.json` (if exists; verify in Step 0)

Each entry:
```json
{
  "questionId": 247,
  "subConceptId": "middle-number-analogies",
  "confidence": "high"
}
```

This is where sub-type tagging actually lives. Without an entry here, Focused Learning can't route the question to the right lesson.

### Layer 3 — Micro-lesson
Files: `src/microLessons/staging/[topic]-subconcepts.js`

Each sub-concept has a 5-screen lesson: **Intro → Hook → Teach → Interact → Consolidate**. Lessons are surfaced before every Focused Learning quiz.

**If a new gap introduces a sub-concept that doesn't exist in the topic's `-subconcepts.js` file, we must build the full micro-lesson alongside the questions.**

### Why all three matter
- Without Layer 1: no question to answer.
- Without Layer 2: question can't be routed to a lesson; Mock Test and Daily Learning still work, but Focused Learning treats it as untyped.
- Without Layer 3: user sees Focused Learning, gets a lesson on the wrong sub-concept, then a quiz containing questions they haven't been taught.

### Other systems (auto-compatible)
- **Mastery** (`useMastery`) — tracks per-topic, not per-sub-concept. New questions blend into the topic's mastery average. This matches the existing model — accepted tradeoff.
- **My Mistakes** — keyed by question ID. Append-only IDs guarantee no breakage.
- **Quiz history (D1)** — keyed by question ID. Same guarantee.
- **Speed Review, Testing Mode, Achievements** — iterate over all questions. Pick up new ones automatically.
- **Mock Test composition** — `useMockTest` randomises within topics. Need to verify in Step 0 that new sub-types appear at appropriate frequencies (some sub-types should be more weighted than others).

---

## 4. Build Process (Per Gap)

The fixed workflow for every single gap:

1. **Confirm scope** — Oracle reads the gap row from the gap report + relevant past-paper extracts.
2. **Write the micro-lesson** — Oracle drafts the 5-screen lesson for the new sub-concept (Intro → Hook → Teach → Interact → Consolidate).
3. **Plain-text lesson review** — Ben reviews the lesson content (not the rendering) for clarity, child-friendliness, and pedagogical quality. Iterate until approved.
4. **Build diagrams** (diagram-dependent gaps only) — Oracle specifies the diagram template; Claude builds SVG templates following `.claude/skills/diagram-design/` tokens; visual QA via browser.
5. **Oracle writes 30 questions** — 10 at D1, 10 at D2, 10 at D3. Following the approved lesson's framing.
6. **Plain-text question review** — Ben reviews all 30 questions in plain-text format (see Quality Gate below). Flags lazy/crappy/wrong/ambiguous questions. Oracle revises.
7. **Add to data file** — questions appended to `mathsData.js` / `vrData.js` with sequential IDs.
8. **Add to lesson mapping** — every new questionId mapped to the new subConceptId in the relevant JSON.
9. **Add micro-lesson** — sub-concept added to `[topic]-subconcepts.js` staging file.
10. **Lint + smoke** — run lint scripts (`lesson-lint.js`, `verify-answers.js`); smoke-test in dev.
11. **Live verification** — open three URLs (one per D-level) using direct question URLs (`?subject=X&topic=Y&q=Z`); confirm rendering + answer + diagram if applicable.
12. **Commit** — single commit per gap, descriptive message, then explicit go-ahead from Ben to move to the next gap.

**Locked rules during the build:**
- Never jump ahead — wait for Ben's explicit go-ahead before starting the next gap (per locked feedback memory).
- Don't deploy after every gap — only when Ben says so.
- Don't ask Ben to verify every fix in a batch — only pause for genuine decisions.
- Oracle writes ALL content. Claude orchestrates, formats, files. Claude does not write questions, lessons, distractors, or explanations.
- British English throughout, UK contexts, explanations end with ✓, 5 options always.

---

## 5. Quality Gates

### Quality Gate 1 — Lesson review (plain text)
Lesson presented to Ben in plain text, 5 screens clearly labelled. Ben reviews for:
- Conversational and warm tone (5 Warmth Principles)
- Worked example clarity
- Misconception coverage
- Interactive screen quality (not a passive read-through)
- Consolidate screen ties back cleanly

### Quality Gate 2 — Question review (plain text, 30 at a time)
Format:
```
Q1 [D1] — Middle-number analogies (numberSeries)
3 (18) 6  ::  4 (20) 5  ::  2 ( ? ) 6

A) 8
B) 12
C) 14
D) 18
E) 24
Answer: B
Explanation: The middle number is the product of the outer pair (3×6=18, 4×5=20).
Applied to (2, ?, 6): 2 × 6 = 12. So the middle number is 12. ✓
```

30 questions at a time so difficulty progression D1 → D3 can be compared side by side. Ben flags any of:
- Lazy phrasing or repetitive structure
- Implausible distractors (too easy to eliminate, or accidentally correct)
- Difficulty misjudged (D1 actually D2-hard, D3 actually D2-easy)
- Wrong answers, ambiguity
- Anything that doesn't feel GL-authentic

### Quality Gate 3 — Live render verification
Ben loads 3 direct URLs per gap (one per D-level) and visually confirms each one renders correctly. For diagram-dependent gaps, this is also when diagram rendering is verified.

### Quality Gate 4 — Lint + scripts
`node scripts/lesson-lint.js` and `node scripts/verify-answers.js` must pass.

### Quality Gate 5 — Commit gate
No commit until all 4 gates pass + Ben says ship it.

---

## 6. STEP 0 — Integration Audit (Prerequisite, do first)

Before any content is written, Claude does a one-pass integration audit across all 45 gaps. Output: a master implementation matrix saved to `plans/content-gap-fill-matrix.md`.

For each of the 45 gaps, the audit answers:

| Field | What it tells us |
|-------|------------------|
| Gap ID | M1–M30, V1–V11 |
| Topic key | e.g. `numberSeries` |
| Existing sub-concepts in topic | Read `[topic]-subconcepts.js`, list IDs |
| New sub-concept ID | What we'll add (e.g. `middle-number-analogies`) |
| Lesson reuse possible? | Yes/No — if Yes, which existing sub-concept |
| Next question ID | Highest current ID in topic + 1 |
| Diagram template needed? | Yes/No — which family (coordinates, 3D, chart, table, etc.) |
| Mock Test weighting | How often this sub-type should appear in mocks |
| Question count target | Default 30 (10 per D-level); flag if different is justified |
| Dependencies | E.g. M3 + M4 + M5 share coordinate grid template |

The matrix also confirms:
1. ~~Whether a `maths-question-lesson-map.json` exists~~ — **Confirmed:** it exists and uses identical structure to the VR map (topic key → array of `{ questionId, subConceptId, confidence }`). No separate workflow needed.
2. Whether `useMockTest` needs updating to pick up new sub-types, or if it's content-blind
3. Whether any achievements key off specific sub-types (and need updating)
4. Whether the question-data file structure varies between topics in any way that affects appending

**ID scope confirmed:** D1 keys `question_results`, `seen_questions`, and related tables on `(child_id, question_id, topic_key)` — compound key. Question IDs are per-topic. ID 1 in `percentages` and ID 1 in `decimals` are distinct records. No global uniqueness required; per-topic append-only is sufficient and correct.

### Step 0 also builds Quality Gate 4 tooling (blocking deliverable)

`lesson-lint.js` and `verify-answers.js` do not currently exist in `scripts/`. Gate 4 cannot be enforced without them. Step 0 must deliver both before Phase 1 begins.

**Step 0 also commits a baseline manifest** (`scripts/baseline-manifest.json`) containing the per-topic ID ceiling and full ID set for every affected topic at the point Step 0 runs. `verify-answers.js` diffs against this committed manifest — not against the mutable working tree — so the ceiling is immutable across all 45 sequential commits. Without a persisted baseline, the script can catch duplicates within the current file but cannot prove an earlier ceiling was respected or that existing IDs were not silently renumbered in a later edit.

- **`scripts/baseline-manifest.json`** — generated and committed in Step 0. Per topic: `{ "topicKey": { "ceiling": N, "ids": [1, 2, 3, ...] } }`. Never hand-edited; regenerated only if Step 0 is rerun before any content is added.
- **`scripts/verify-answers.js`** — asserts per topic: (a) no duplicate question IDs, (b) all new IDs > manifest ceiling for that topic, (c) all IDs present in the manifest still exist unchanged (no renumbering), (d) every `questionId` in the lesson map JSON has a matching question in the data file, (e) every new question has exactly one lesson-map entry (question→map, both directions). Run after every gap's questions are added.
- **`scripts/lesson-lint.js`** — validates the full three-layer invariant: (a) question field checks (option count = 5, `correct` is 0-indexed integer in 0–4, explanation ends with `✓`, no empty `question` or `explanation`), (b) every `subConceptId` referenced in the lesson map exists in the relevant `[topic]-subconcepts.js`, (c) every new sub-concept entry in a staging file has all 5 required screens (Intro, Hook, Teach, Interact, Consolidate). Run after every gap's micro-lesson is added.

**V3 topic home — Oracle question (Step 0, blocking for Phase 1.3):**

`letterSums` is the wrong home — it is explicitly A=1 B=2 cipher arithmetic. Balance-equation arithmetic (solve for an unknown) is semantically different. Step 0 must ask the Oracle: *"Is V3 balance-equation arithmetic a VR question type in GL papers, or a Maths type that appeared in the VR paper? If VR, which existing topic key is the correct home, or does it need a new topic key?"* V3 (Phase 1.3) is blocked until the Oracle answers. If a new topic key is needed, that work must be scoped before Phase 1.3 begins — it requires additions to the topic registry, lesson map, and micro-lesson system.

**Step 0 produces: build checklist matrix + baseline manifest + Gate 4 scripts + V3 topic decision. Until all four are done, no questions are written.**

---

## 7. Build Phases

Order:
- **Phase 1 — VR text-only** (11 gaps, no new diagrams)
- **Phase 2 — Maths text-only** (12 gaps, no new diagrams)
- **Phase 3 — Maths diagram-dependent** (18 gaps, grouped by diagram family for template reuse)

Within each phase, gaps are tackled one at a time, in the order below.

### Phase 1 — VR Text-Only (11 gaps)

| Order | Gap | Topic | Sub-concept (new?) | Notes |
|-------|-----|-------|-------------------|-------|
| 1.1 | V1 Middle-number analogies | `numberSeries` | `middle-number-analogies` (new) | Critical, ~40 Qs from gap report — confirm in Step 0 |
| 1.2 | V2 Letter-position analogies | `letterCodes` | `letter-position-analogy` (new) | Splits `letterCodes` into cipher + position-analogy |
| 1.3 | V3 Balance-equation arithmetic | **BLOCKED — Oracle decision required in Step 0** | `balance-equations` (new) | `letterSums` ruled out (cipher arithmetic only). Oracle must classify: VR or Maths type? Existing topic or new key? Phase 1.3 cannot begin until Step 0 resolves this. |
| 1.4 | V4 Multi-attribute logic grid | `logicAndLanguage` | `multi-attribute-logic` (new) | Critical — 5-person 4–6 conditions |
| 1.5 | V5 Number-word codes deduction | `numberWordCodes` | `code-deduction` (new variant) | Important format mismatch — existing D1-only |
| 1.6 | V7 Three-letter word INSIDE capitals | `missingLettersWords` | `inside-word-3letter` (new) | Important — different to current end-of-word format |
| 1.7 | V8 Polyseme synonyms | `synonyms` | `polyseme-synonyms` (new) | Important — multi-meaning word match |
| 1.8 | V6 Missing letters in sentence context | `missingLettersWords` | `sentence-context-missing` (new) | Was in original report — confirms format gap |
| 1.9 | V9 Word-pattern transformations audit | `wordCodeAnalogies` | (audit existing) | Audit first, decide if extension needed |
| 1.10 | V10 Compound words format audit | `compoundWords` | (audit existing) | Confirm 3-from-3 bracket format |
| 1.11 | V11 Letter pair series variants audit | `letterPairSeries` | (audit existing) | Confirm different-rule-per-letter variants |

### Phase 2 — Maths Text-Only (12 gaps)

| Order | Gap | Topic | Sub-concept (new?) |
|-------|-----|-------|-------------------|
| 2.1 | M1 Multi-unit arithmetic | `decimals` | `multi-unit-arithmetic` (new) |
| 2.2 | M2 Algebraic expression construction | `algebra` | `expression-construction` (new) |
| 2.3 | M6 Reverse-operation puzzles | `algebra` | `reverse-operations` (new) |
| 2.4 | M11 Nth-term expressions | `sequences` | `nth-term-expressions` (new) |
| 2.5 | M12 Triangular / square sequences | `sequences` | `triangular-square-numbers` (new) |
| 2.6 | M21 Mass/capacity division with remainder | `longdivision` | `mass-capacity-remainder` (new) |
| 2.7 | M22 Time arithmetic (AM/PM spans) | `speeddistancetime` | `time-arithmetic` (new) |
| 2.8 | M23 Multi-step money + ratio | `ratio` | `money-ratio-multistep` (new) |
| 2.9 | M24 Use-this-fact arithmetic | `longmultiplication` | `derived-facts` (new) |
| 2.10 | M26 Calendar / day-of-week | `placevalue` | `calendar-days` (new) |
| 2.11 | M27 Most suitable unit | `placevalue` | `unit-selection` (new) |
| 2.12 | M30 True-statement equality | `placevalue` | `equality-statements` (new) |

### Phase 3 — Maths Diagram-Dependent (18 gaps, grouped by template family)

**Phase 3 prerequisite (before any SVG is built):** Add 5 missing diagram template skeletons to `.claude/skills/diagram-design/references/component-templates.md`. Current templates cover: NumberLine, BarModel, AngleDiagram, RectangleDiagram, PieChart, BarChart, GridModel, CuboidDiagram, FractionDiagram. Missing for Phase 3:

| Template to add | Used by |
|----------------|---------|
| CoordinateGrid | Family A (coordinates, transformations, symmetry, direction) |
| LineGraph | Family C (conversion graphs, distance-time graphs) |
| VennCarrollDiagram | Family D (Venn + Carroll) |
| TableDiagram | Family D (two-way tables, timetables) |
| CompoundShapeDiagram | Family E (L/U/staircase compound area) |

These are style-guide skeletons only (~15 lines each). Building them before the gap content ensures all 18 diagram-dependent gaps are consistent with each other and with the existing design system.

Within each family, the diagram template is built once and reused across all gaps in that family.

#### Family A — Coordinate Grid (4 gaps)
| Order | Gap | Sub-concept |
|-------|-----|-------------|
| 3A.1 | M3 Coordinates | `coordinates-reading-plotting` |
| 3A.2 | M4 Coordinate transformations (translation/reflection/rotation) | `coordinate-transformations` |
| 3A.3 | M5 Symmetry | `symmetry-lines-rotational` |
| 3A.4 | M25 Direction & rotation / robot paths | `direction-rotation` |

#### Family B — 3D Shape (4 gaps)
| Order | Gap | Sub-concept |
|-------|-----|-------------|
| 3B.1 | M7 3D shape properties | `3d-shape-properties` |
| 3B.2 | M14 Surface area + cube nets | `surface-area-nets` |
| 3B.3 | M15 Triangular prism + L-shape volume | `triangular-prism-l-shape-volume` |
| 3B.4 | M13 2D shape properties | `2d-shape-properties` |

#### Family C — Chart/Graph (5 gaps)
| Order | Gap | Sub-concept |
|-------|-----|-------------|
| 3C.1 | M17 Conversion graphs | `conversion-graphs` |
| 3C.2 | M18 Distance-time graphs | `distance-time-graphs` |
| 3C.3 | M19 Pie chart back-to-total | `pie-chart-reverse` |
| 3C.4 | M10 Misleading-chart criticism | `misleading-charts` |
| 3C.5 | M29 Multi-step chart combination | `multi-step-chart-reading` |

#### Family D — Table/Diagram (3 gaps)
| Order | Gap | Sub-concept |
|-------|-----|-------------|
| 3D.1 | M8 Venn + Carroll diagrams | `venn-carroll-diagrams` |
| 3D.2 | M9 Two-way tables | `two-way-tables` |
| 3D.3 | M28 Timetable reading | `timetable-reading` |

#### Family E — Compound Shape (1 gap)
| Order | Gap | Sub-concept |
|-------|-----|-------------|
| 3E.1 | M16 Compound area (L/U/staircase) | `compound-shape-area` |

#### Family F — Inverse Mean (1 gap, audit + extend)
| Order | Gap | Sub-concept |
|-------|-----|-------------|
| 3F.1 | M20 Inverse mean | `inverse-mean` (or extend existing mean lesson) |

---

## 8. Estimated Volume

Default assumption: 30 questions per gap (10 per D-level). Audit-only gaps (V9, V10, V11, M16, M20) may be lighter — decided per gap based on what the audit finds.

- **Maximum total:** 45 × 30 = 1,350 new questions
- **Realistic total** (after audit adjustments): ~1,000–1,200 questions
- **New micro-lessons:** up to 45 (Step 0 will identify any reuse opportunities)
- **New diagram template families:** 5–6

---

## 9. Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Question IDs accidentally shift, breaking user history | APPEND-only rule, codified in build process step 7. `verify-answers.js` diffs against a committed baseline manifest (per-topic ceiling + full ID set), generated and committed in Step 0. Existing IDs are immutable; only tail additions are permitted. D1 keys on compound `(child_id, question_id, topic_key)` — IDs are per-topic, confirmed safe. |
| Difficulty calibration drifts (D2s feel like D3s, etc.) | Plain-text review batch of 30 (10 per D-level) lets Ben compare across difficulty side-by-side. Oracle's GL difficulty criteria are the calibration spec. |
| New sub-concept micro-lesson isn't pedagogically aligned with the questions | Lesson written FIRST, reviewed and approved BEFORE question generation. Questions written off the approved lesson. |
| Diagram rendering breaks in production | Visual QA in dev for every gap. Direct-URL verification at all 3 D-levels per gap. |
| Mock Test stops feeling balanced after new sub-types added | Step 0 audits mock composition. If `useMockTest` needs weighting updates, those go on the build list. |
| Volume of work overwhelms — quality decays mid-sprint | "Never jump ahead" rule. One gap at a time, explicit go-ahead between gaps. Ben's plain-text review is the rate limiter — and that's the intended brake. |
| Half-built state (questions added but lessons missing) — Focused Learning breaks | Commit-per-gap rule means each commit ships all three layers together. No partial gap commits. `lesson-lint.js` validates both directions: question→map entry exists, map's `subConceptId` exists in staging file, staging entry has all 5 screens. A gap cannot pass Gate 4 with any layer incomplete. |
| Oracle generates content that isn't authentically GL-style | Oracle is the GL authority — but every gap has at least one source past-paper question we can cite for format reference. |

---

## 10. Open Questions for Senior-Dev / Codex Review

1. ~~**Is there a `maths-question-lesson-map.json`?**~~ **Resolved:** It exists at `public/maths-question-lesson-map.json` with identical structure to the VR map. Layer 2 workflow is the same for both subjects.

2. **Where does V3 (balance-equation arithmetic) belong?** `letterSums` ruled out — it is cipher-only arithmetic. Step 0 asks the Oracle: is this a VR or Maths type, and what's the correct topic home? Phase 1.3 blocked until resolved.

3. **Question count target — uniform 30 or variable?** Plan currently defaults to 30 with audit-driven exceptions. Worth confirming.

4. **Should diagram templates be added to the diagram-design skill before use?** **Yes — resolved.** Five templates are missing (CoordinateGrid, LineGraph, VennCarrollDiagram, TableDiagram, CompoundShapeDiagram). Adding them is now a Phase 3 prerequisite — see Section 7, Phase 3 header.

5. **Mock Test composition update strategy** — when do we update `useMockTest`? After each phase, after each family, or one batch update at the end? Recommendation: one batch update at the end, but pin every sub-type in Step 0 so we don't forget.

6. **Commit cadence** — single commit per gap is the recommendation. Worth confirming.

7. **Deployment cadence** — locked memory says "deploy on request only." This plan assumes no auto-deploys; Ben says when to push to prod. Confirmed?

---

## 11. Next Actions (Once Plan is Approved)

1. Run senior-dev review on this plan.
2. Run codex review on this plan.
3. Apply revisions from reviews.
4. Execute Step 0 — Integration Audit. Output: `plans/content-gap-fill-matrix.md`.
5. Ben reviews the matrix.
6. Begin Phase 1.1 — V1 Middle-number analogies.

---

## 12. Appendix — Source Documents

- Gap report: `research/past-papers/oracle-gap-report-CGP-full-11may2026.md`
- Previous (10 May) gap report: `research/past-papers/oracle-gap-reports-CGP-mock-2018.md`
- Maths data: `src/questionData/mathsData.js`
- VR data: `src/questionData/vrData.js`
- VR lesson mapping: `public/vr-question-lesson-map.json`
- Micro-lesson playbook: `src/microLessons/PLAYBOOK.md`
- Oracle agent: `.claude/agents/11plus-oracle.md`
- Master GL knowledge base: `research/11plus-oracle.md`
- Audit process: per memory at `.claude/projects/.../memory/audit-process.md`
- Diagram design skill: `.claude/skills/diagram-design/`
- Error-fixing process: per memory at `.claude/projects/.../memory/feedback-error-fixing-process.md`

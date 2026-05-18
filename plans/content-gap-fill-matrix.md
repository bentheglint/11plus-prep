---
title: Content Gap-Fill — Integration Audit Matrix
generated: 2026-05-11
source: plans/content-gap-fill-plan.md + Step 0 code audit
status: LIVE — update as each gap completes
---

# Content Gap-Fill Matrix

This is the build checklist. Every gap in the sprint is represented here with its
topic key, baseline ceiling, new sub-concept ID, lesson reuse decision, diagram
template, and dependencies. Check each box as the gap completes all 5 quality gates.

---

## System Findings (Step 0 Confirmed)

| Question | Answer |
|----------|--------|
| Does `maths-question-lesson-map.json` exist? | **Yes** — `public/maths-question-lesson-map.json`, identical structure to VR map |
| Are question IDs global or per-topic? | **Per-topic** — D1 keys on `(child_id, question_id, topic_key)`. ID 1 in `decimals` ≠ ID 1 in `algebra` |
| Is `useMockTest` content-blind? | **No** — uses `topicWeights` in `mathsPaperConfig`. VR uses `vrPaperVariants` (section-based). Both need updating when new topics added |
| Do achievements key off sub-types? | **No** — `useAchievements` tracks mastery per topic key only. New sub-concepts within existing topics need no achievement changes |
| Does `balanceEquations` need registering in achievements? | **Yes** — if achievements iterate `topicsWithQuestions`, new topic key must be added |
| Does `longmultiplication` have a staging file? | **No** — M24 requires creating `src/microLessons/staging/longmultiplication-subconcepts.js` |
| Is M20 (Inverse Mean) in `volume` or `datahandling`? | **`datahandling`** — plan had wrong topic key. Gap report confirms `datahandling — inverse mean`. Corrected below. |

---

## Phase 1 — VR Text-Only (11 gaps)

| # | Gap ID | Topic key | Baseline ceiling | Next ID | New sub-concept ID | Existing reuse? | Staging file? | Diagram? | Q count | Done? |
|---|--------|-----------|------------------|---------|--------------------|-----------------|---------------|----------|---------|-------|
| 1.1 | V1 Middle-number analogies | `numberSeries` | 99 | 100 | `middle-number-analogies` | No — none of 19 existing SCs cover middle-value pattern | Yes | No | 30 | [ ] |
| 1.2 | V2 Letter-position analogies | `letterCodes` | 166 | 167 | `letter-position-analogy` | No — existing SCs are all cipher-shift, none position-analogy | Yes | No | 30 | [ ] |
| 1.3 | V3 Balance-equation arithmetic | `balanceEquations` **(NEW TOPIC)** | 0 | 1 | `balance-equations` | No — entirely new topic | **No — must create** | No | 40 | [ ] |
| 1.4 | V4 Multi-attribute logic grid | `logicAndLanguage` | 163 | 164 | `multi-attribute-logic` | No — existing covers ≤4 people, V4 needs 5+ with 4-6 conditions | Yes | No | 30 | [ ] |
| 1.5 | V5 Number-word codes deduction | `numberWordCodes` | 125 | 126 | `code-deduction` | Partial — `elimination-method` covers deduction; add D2/D3 variant lesson | Yes | No | 30 | [ ] |
| 1.6 | V6 Missing letters in sentence context | `missingLettersWords` | 125 | 126 | `sentence-context-missing` | No — existing SCs target gap position, not sentence context | Yes | No | 30 | [x] commit 67b380f |
| 1.7 | V7 Three-letter word INSIDE capitals | `missingLettersWords` | 155* | 156* | `inside-word-3letter` | No — `ending-gaps` is closest but format is different | Yes | No | 30 | [x] commit 4dac8de |
| 1.8 | V8 Polyseme synonyms | `synonyms` | 125 | 126 | `polyseme-synonyms` | Partial — `context-dependent` is close; polyseme is specifically multi-meaning | Yes | No | 30 | [x] commit 67b380f |
| 1.9 | V9 Word-pattern transformations | `wordCodeAnalogies` | 125 | 126 | `word-extraction` | Audit confirmed: frog(rode)dent format absent; added 25 questions + lesson | Yes | No | 25 | [x] commit 67b380f |
| 1.10 | V10 Compound words 3-from-3 format | `compoundWords` | 145 | 146 | `gl-compound-pairs` (reuse) | Audit confirmed: 20 pick-from-sets existed; added 30 more IDs 146-175 | Yes | No | 30 | [x] commit 67b380f |
| 1.11 | V11 Letter pair series variants | `letterPairSeries` | 128 | 129 | Audit first | 9 existing SCs — audit coverage of different-rule-per-letter variants | Yes | No | TBD | [ ] |

**\* V6 adds IDs 126–155 to `missingLettersWords`. V7 therefore starts at 156 — not 126. Commit V6 before starting V7.**

### V3 — New Topic Key Scope (extra work)

Creating `balanceEquations` as a new VR topic key requires ALL of the following before Phase 1.3 can begin:

1. Add `balanceEquations: { name: "Balance Equations", questions: [] }` to `vrData.js` topics block
2. Create `src/microLessons/staging/balanceequations-subconcepts.js`
3. Register in `lessonData.js` (add to `lessonBank`)
4. Add `"balanceEquations": []` to `public/vr-question-lesson-map.json`
5. Register in `mockVRConfig.js` VR paper variants (new section for the type)
6. Add to topic registry wherever the app lists all VR topics (check `App.js` topic list)
7. Add `balanceEquations` to `baseline-manifest.json` → `newTopics` section (already done)

Oracle has confirmed: 40 questions, D1/D2/D3 spread, covering simple balance, two-op BODMAS, brackets on either side.

---

## Phase 2 — Maths Text-Only (12 gaps)

| # | Gap ID | Topic key | Baseline ceiling | Next ID | New sub-concept ID | Existing reuse? | Staging file? | Diagram? | Q count | Done? |
|---|--------|-----------|------------------|---------|--------------------|-----------------|---------------|----------|---------|-------|
| 2.1 | M1 Multi-unit arithmetic | `decimals` | 223 | 224 | `multi-unit-arithmetic` | No | Yes | No | 30 | [ ] |
| 2.2 | M2 Algebraic expression construction | `algebra` | 252 | 253 | `expression-construction` | Partial — `writing-expressions` exists; M2 is more complex construction | Yes | No | 30 | [ ] |
| 2.3 | M6 Reverse-operation puzzles | `algebra` | 282* | 283* | Reuse `inverse-operations` | **YES** — `inverse-operations` + `inverse-ops-mistake` cover this; map new questions to existing SC | Yes | No | 30 | [ ] |
| 2.4 | M11 Nth-term expressions | `sequences` | 152 | 153 | Reuse `find-nth-term` | **YES** — `find-nth-term` + `nth-term-steps` exist; confirm expression-format questions covered | Yes | No | 30 | [ ] |
| 2.5 | M12 Triangular/square sequences | `sequences` | 182* | 183* | Reuse `special-sequences` | **YES** — `special-sequences` + `special-visual` exist; audit that triangular + square patterns are covered | Yes | No | 30 | [ ] |
| 2.6 | M21 Mass/capacity division with remainder | `longdivision` | 265 | 266 | `mass-capacity-remainder` | Partial — `interpreting-remainders` covers remainder logic; add mass/capacity context lesson | Yes | No | 30 | [ ] |
| 2.7 | M22 Time arithmetic (AM/PM spans) | `speeddistancetime` | 125 | 126 | `time-arithmetic` | Partial — `time-in-minutes` + `minutes-to-hours` exist; AM/PM spans across midnight is new | Yes | No | 30 | [ ] |
| 2.8 | M23 Multi-step money + ratio | `ratio` | 245 | 246 | `money-ratio-multistep` | Partial — `ratio-word-problems` covers single-step; M23 needs multi-step money context | Yes | No | 30 | [ ] |
| 2.9 | M24 Use-this-fact arithmetic | `longmultiplication` | 228 | 229 | `derived-facts` | **No staging file** — must create `longmultiplication-subconcepts.js` | **No — must create** | No | 30 | [ ] |
| 2.10 | M26 Calendar / day-of-week | `placevalue` | 176 | 177 | `calendar-days` | No | Yes | No | 30 | [ ] |
| 2.11 | M27 Most suitable unit | `placevalue` | 206* | 207* | `unit-selection` | No | Yes | No | 30 | [ ] |
| 2.12 | M30 True-statement equality | `placevalue` | 236* | 237* | `equality-statements` | No | Yes | No | 30 | [ ] |

**\* Sequences in order: M11 adds 30 to `sequences` → new ceiling 182. M12 starts at 183.**
**\* M6 runs after M2: M2 adds 30 to `algebra` → new ceiling 282. M6 starts at 283.**
**\* M26/M27/M30 all go into `placevalue`: M26 → 177–206 (ceiling 206); M27 → 207–236 (ceiling 236); M30 → 237–266.**

### M24 — New Staging File Scope (extra work)

`src/microLessons/staging/longmultiplication-subconcepts.js` does not exist. Before M24 can begin:

1. Create the staging file with the `derived-facts` sub-concept entry (full 5 screens)
2. Register it in `lessonData.js` (add `longmultiplication` to `lessonBank`)
3. Add `"longmultiplication": []` if not already present in `maths-question-lesson-map.json`

---

## Phase 3 — Maths Diagram-Dependent (18 gaps, 6 families)

### Phase 3 Prerequisite
Before any Phase 3 SVG is built, add these 5 template skeletons to `.claude/skills/diagram-design/references/component-templates.md`:

| Template | Used by |
|----------|---------|
| `CoordinateGrid` | Family A (M3, M4, M5, M25) |
| `LineGraph` | Family C (M17, M18) |
| `VennCarrollDiagram` | Family D (M8) |
| `TableDiagram` | Family D (M9, M28) |
| `CompoundShapeDiagram` | Family E (M16) |

PieChart ✓ and BarChart ✓ already exist in component-templates.md.

---

### Family A — Coordinate Grid (`anglesshapes`, ceiling 225)

Build one CoordinateGrid SVG template, then reuse for all 4 gaps.

| # | Gap ID | Sub-concept ID | Next ID | Reuse? | Done? |
|---|--------|----------------|---------|--------|-------|
| 3A.1 | M3 Coordinates reading/plotting | `coordinates-reading-plotting` | 226 | No | [ ] |
| 3A.2 | M4 Coordinate transformations | `coordinate-transformations` | 256* | No | [ ] |
| 3A.3 | M5 Symmetry lines/rotational | `symmetry-lines-rotational` | 286* | No | [ ] |
| 3A.4 | M25 Direction & rotation / robot paths | `direction-rotation` | 316* | No | [ ] |

**\* Each adds 30 to `anglesshapes`. Family A adds 120 total, ceiling goes 225 → 345.**

---

### Family B — 3D Shape (`anglesshapes` + `volume`)

M7 and M13 go into `anglesshapes` (after Family A, ceiling 345). M14 and M15 go into `volume` (ceiling 140).

| # | Gap ID | Topic key | Sub-concept ID | Baseline ceiling | Next ID | Reuse? | Done? |
|---|--------|-----------|----------------|------------------|---------|--------|-------|
| 3B.1 | M7 3D shape properties | `anglesshapes` | `3d-shape-properties` | 345* | 346 | No | [ ] |
| 3B.2 | M13 2D shape properties | `anglesshapes` | `2d-shape-properties` | 375* | 376 | No | [ ] |
| 3B.3 | M14 Surface area + cube nets | `volume` | `surface-area-nets` | 140 | 141 | No | [ ] |
| 3B.4 | M15 Triangular prism + L-shape volume | `volume` | `triangular-prism-l-shape` | 170* | 171 | No | [ ] |

**\* After Family A. M14/M15 are in `volume` (not `anglesshapes`) — surface area and volume share diagram templates.**

---

### Family C — Chart/Graph (`datahandling` + `speeddistancetime`)

Most go into `datahandling` (ceiling 220). M18 distance-time goes into `speeddistancetime` (ceiling after Phase 2).

| # | Gap ID | Topic key | Sub-concept ID | Baseline ceiling | Next ID | Reuse? | Template | Done? |
|---|--------|-----------|----------------|------------------|---------|--------|----------|-------|
| 3C.1 | M10 Misleading-chart criticism | `datahandling` | `misleading-charts` | 220 | 221 | No — `reading-bar-charts` covers reading, not criticism | BarChart (existing) | [ ] |
| 3C.2 | M17 Conversion graphs | `datahandling` | `conversion-graphs` | 250* | 251 | No | LineGraph (new template) | [ ] |
| 3C.3 | M18 Distance-time graphs | `speeddistancetime` | `distance-time-graphs` | 155* | 156 | No | LineGraph (new template) | [ ] |
| 3C.4 | M19 Pie chart back-to-total | `datahandling` | `pie-chart-reverse` | 280* | 281 | Partial — `reading-pie-charts` covers reading; reverse-calc is new | PieChart (existing) | [ ] |
| 3C.5 | M29 Multi-step chart combination | `datahandling` | `multi-step-chart-reading` | 310* | 311 | No | BarChart/LineGraph | [ ] |

**\* Ceilings move as gaps complete. M10 first (220→250), M17 (250→280), M19 (280→310), M29 (310→340).**
**\* `speeddistancetime` ceiling after Phase 2 (M22 adds 30): 125+30 = 155. M18 starts at 156.**

---

### Family D — Table/Diagram (`datahandling` + `speeddistancetime`)

| # | Gap ID | Topic key | Sub-concept ID | Next ID | Reuse? | Template | Done? |
|---|--------|-----------|----------------|---------|--------|----------|-------|
| 3D.1 | M8 Venn + Carroll diagrams | `datahandling` | `venn-carroll-diagrams` | 340* | No | VennCarrollDiagram (new template) | [ ] |
| 3D.2 | M9 Two-way tables | `datahandling` | `two-way-tables` | 370* | Partial — `reading-tables` exists; two-way completion is new | TableDiagram (new template) | [ ] |
| 3D.3 | M28 Timetable reading | `speeddistancetime` | `timetable-reading` | 185* | Partial — `time-in-minutes` + `minutes-to-hours` exist; timetable format is new | TableDiagram (new template) | [ ] |

**\* Ceilings carry forward from Family C.**
**\* `speeddistancetime` ceiling after M22 (Phase 2) + M18 (Family C): 125+30+30 = 185.**

---

### Family E — Compound Shape (`areaperimeter`, ceiling 209)

| # | Gap ID | Sub-concept ID | Next ID | Reuse? | Template | Done? |
|---|--------|----------------|---------|--------|----------|-------|
| 3E.1 | M16 Compound area (L/U/staircase) | Audit first — `compound-shapes` **already exists** | 210 (if extension needed) | **YES — `compound-shapes` + `compound-shapes-steps` + `compound-shapes-mistake` exist.** Audit: do existing questions cover L/U/staircase formats? If ≥10 questions on compound shapes exist, may not need 30 more. | CompoundShapeDiagram (new template) | [ ] |

---

### Family F — Inverse Mean (`datahandling`)

**Correction from plan:** M20 belongs in `datahandling`, NOT `volume`. Gap report confirms: "Maths `datahandling` — inverse mean."

| # | Gap ID | Sub-concept ID | Next ID | Reuse? | Q count | Done? |
|---|--------|----------------|---------|--------|---------|-------|
| 3F.1 | M20 Inverse mean | Audit first — `missing-from-mean` **already exists** | Depends on audit | **YES — `missing-from-mean` + `missing-from-mean-steps` + `missing-from-mean-mistake` exist.** Audit existing `datahandling` questions: if inverse-mean variants ≥15, no new questions needed. If <15, add 6–8 at D2/D3 only. | 0–8 (audit-driven) | [ ] |

---

## Cross-Cutting Updates (do once, after all phases complete)

| System | What to update | When |
|--------|---------------|------|
| `useMockTest` — `mathsPaperConfig.topicWeights` | New sub-types may need weighting within existing topics. Audit once all Phase 2+3 gaps are committed. | After Phase 3 |
| `useMockTest` — `vrPaperVariants` | Add `balanceEquations` section with appropriate question count (GL uses 4-Q sections) | After Phase 1.3 |
| `useAchievements` | Add `balanceEquations` to any topic-iteration list | After Phase 1.3 |
| `App.js` or topic registry | Add `balanceEquations` as a VR topic | Before Phase 1.3 |
| `baseline-manifest.json` → `newTopics` | `balanceEquations` already present with ceiling 0 | Done |

---

## Commit Tracking

One commit per gap. Format: `content(vr/numberSeries): add V1 middle-number analogies — 30 questions`.

| Commit | Gap | Hash | Date |
|--------|-----|------|------|
| 1 | V6+V8+V9+V10 questions + lessons + map + lint fix | 67b380f | 2026-05-18 |
| 2 | V7 questions + lesson + map | 4dac8de | 2026-05-18 |

---

## Dependency Graph

```
Phase 1:
  V1 → V2 → [V3 blocked: new topic setup first] → V4 → V5 → V6 → V7* → V8 → V9 → V10 → V11
  *V7 depends on V6 committed (shares missingLettersWords topic; IDs must be sequential)

Phase 2:
  M1 → M2 → M6* → M11 → M12* → M21 → M22 → M23 → M24** → M26 → M27* → M30*
  *M6 after M2 (same topic), M12 after M11 (same topic), M27 after M26, M30 after M27
  **M24 requires new staging file before starting

Phase 3:
  [Template skeletons first] → Family A (M3→M4→M5→M25) → Family B (M7→M13→M14→M15) →
  Family C (M10→M17→M18→M19→M29) → Family D (M8→M9→M28) → Family E (M16 audit) →
  Family F (M20 audit) → [Cross-cutting updates]
```

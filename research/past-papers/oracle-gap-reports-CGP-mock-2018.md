# Oracle Coverage Gap Reports — CGP GL Mock Test Papers 2018

**Source papers analysed:** CGP 11+ GL Mixed Mock Test (© CGP 2018)
**Oracle analysis date:** 10 May 2026
**Papers:** Maths (50 Q), English (50 Q), Verbal Reasoning (80 Q)

---

## MATHS — Coverage Gap Report

### Critical Gaps (5–6 marks per paper)

**`anglesshapes` topic is missing roughly half the GL geometry strand:**

1. **Coordinates** — reading, plotting, finding missing vertices, midpoints of diagonals
   - GL frequency: ~1–2 per paper
   - Paper questions: Q38, Q42
   - App coverage: Zero

2. **Reflection / mirror lines** — reflecting shapes, finding new coordinates after reflection
   - GL frequency: ~1 per paper
   - Paper questions: Q25, Q38
   - App coverage: Zero

3. **Symmetry** — lines of symmetry + order of rotational symmetry
   - Key misconception: rectangle has 2 lines of symmetry, not 4
   - GL frequency: ~1 per paper
   - Paper questions: Q27
   - App coverage: Zero

4. **3D shape properties** — identifying prisms (cross-section rule), faces/edges/vertices, nets
   - GL frequency: ~1–2 per paper
   - Paper questions: Q16 (identify prisms), Q39 (surface area)
   - App coverage: Zero (volume topic covers volume only, not shape properties)

### Important Gaps (2–3 marks per paper)

**`datahandling` topic missing three sub-types:**

5. **Venn & Carroll diagrams** — sorting by number properties, finding missing labels
   - GL frequency: ~1 per paper
   - Paper questions: Q17, Q36
   - App coverage: Zero

6. **Conversion graphs** — reading values + extending beyond plotted range
   - GL frequency: ~1 per paper (or less)
   - Paper questions: Q48
   - App coverage: Zero

7. **Distance-time graph interpretation** — steepest segment = greatest speed
   - GL frequency: ~1 per paper
   - Paper questions: Q41
   - App coverage: Line graphs taught but steepness-as-rate not covered

### Minor Gaps

8. **Calendar / day-of-week calculations** → add a few questions to `placevalue`
9. **Direction & rotation / robot paths** → add to `anglesshapes`
10. **Surface area of prisms** (D3 stretch only) → extend `volume`

### No New Topics Needed
All gaps fit within existing topics. Priority: extend `anglesshapes` first, then `datahandling`.

---

## ENGLISH — Coverage Gap Report

### Important Gap

**Connected-passage cloze format** — STRUCTURAL GAP
- The app has 400+ cloze questions, all isolated single sentences
- GL papers always test cloze as a **continuous passage** (6–8 linked gaps)
- Cross-sentence tense/pronoun consistency is the tested skill — unpracticable in isolation
- GL frequency: Universal — every paper, ~16% of marks
- Paper questions: Q43–Q50 (Letter of Complaint)
- App coverage: Zero — `questionType: 'cloze-passage'` does not exist
- Fix: New presentation format under `grammar` topic — no new topic needed

### Minor Gaps

- **Inference sub-type balance** — this paper was 61% inference (vs app's lower ratio). Consider rebalancing toward character-action and setting inference sub-types.
- **Simile vs metaphor "which sentence contains X" format** — only 3 examples in bank; needs 8–10
- **Spelling: noticeable/noticeably + accidentally** — may not appear by name in suffix lessons; audit and add if missing

### Confirmed NOT Gaps (all well-covered)
Negative retrieval, collective nouns, relative pronouns, third conditional, connectives for contrast/consequence, apostrophes — all confirmed strong in app.

### Oracle Library Correction
**Antonyms-from-brackets IS a confirmed standalone GL type.** Previous research note "does not exist as standalone" was incorrect. The existing `antonyms` topic and audit work (50 questions, 25 Mar 2026) was right.

---

## VERBAL REASONING — Coverage Gap Report

### Critical Gaps (12.5% of this paper — entirely absent from app)

1. **Middle-number analogies** — `3(18)6 :: 4(20)5 :: 2(?)6`
   - GL frequency: Full dedicated section, 5–7 questions per paper
   - Paper questions: Q66–Q70
   - App coverage: **Zero** — not in app or Oracle research library
   - Also not in Oracle research library — needs new entry added
   - Fix: Add as new sub-type within `numberSeries` with distinct visual presentation showing the `outer(middle)outer` triplet format. Rules: multiply outers, add outers, subtract outers, or complex combinations.

2. **Letter-position analogies** — `ST is to RU as WX is to (?)`
   - GL frequency: Full dedicated section, 5 questions per paper
   - Paper questions: Q1–Q5
   - App coverage: **Zero** — app only has cipher-style codes
   - Fix: Add as new sub-type within `letterCodes` (e.g. `letter-position-analogy`). Oracle entry should split letterCodes into: 2A Cipher (encode/decode) and 2B Position Analogy (apply per-letter rule across pairs).

### Important Gaps

3. **Number-word codes — shared-code-set deduction format**
   - App gives the mapping explicitly ("SPOT = 1234"). GL withholds it.
   - Real format: 4 words + 3 scrambled codes → child deduces full mapping → answers 3 sub-questions
   - GL frequency: ~6 questions per paper (3 sub-questions per code set)
   - Paper questions: Q50–Q55
   - App coverage: Topic exists but entirely at D1 (direct coding), not D2 (deduction)
   - Fix: Add ~40 questions at D2/D3 using the authentic format. May need `questionType: 'shared-code-set'` renderer.

4. **Missing letters in sentence context** — `"My shopping B[ASK]ET was too heavy to carry."`
   - App uses decontextualised format `CH___ER` only
   - GL always uses sentence context — sentence provides semantic narrowing
   - GL frequency: ~5–7 per paper
   - Paper questions: Q13–Q17
   - App coverage: `missingLettersWords` topic exists but zero sentence-context variants
   - Fix: Add 30–50 sentence-context variants at all 3 difficulty levels

5. **Multi-attribute logic grid** — 5 people × 4–6 conditions, find what MUST be true
   - App logic questions skew to simple single-attribute ordering
   - Real format: "The girls each bought X", "everyone except X bought Y"
   - GL frequency: ~4 per paper
   - Paper questions: Q24, Q25, Q43, Q44
   - App coverage: `logicAndLanguage` exists but under-represents matrix-construction problems
   - Fix: Add 15–25 multi-attribute matrix questions at D2/D3

### Oracle Library Updates Required

1. **Add "VR: Number Analogies (Middle Number)"** — currently completely absent from `research/11plus-oracle.md`
2. **Split "VR: Letter Codes"** into Cipher (existing) and Position Analogy (new)
3. **Correct antonyms error** in `research/past-papers/PRACTICE-PAPER-ANALYSIS.md` — antonyms IS a real standalone GL type

### Confirmed NOT Gaps
- nth term / algebraic expressions: well-covered in app
- Profit & loss: well-covered
- Ratio "twice as many": well-covered
- Kite perimeter algebra: well-covered
- Antonyms format: matches app (pick-from-sets)
- Letter move: matches app
- Compound words: matches app
- Verbal analogies: matches app

### Priority Order
1. Middle-number analogies (entirely missing, 6.25% of paper)
2. Letter-position analogies (entirely missing, 6.25% of paper)
3. Number-word codes format (wrong format throughout)
4. Multi-attribute logic grids (under-represented)
5. Sentence-context missing letters (format mismatch)

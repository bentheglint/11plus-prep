# Benchmark Fix #7 — VR hiddenWords (natural sentences) + balanceEquations (expand + mock) — Spec

Source of truth for fix #7. Written 22 Jul 2026.

## PART A — hiddenWords → natural sentences (rewrite 150 in place, ids preserved)

### The gap
Current items are 5-word token lists (4 boundaries) shown as pickable chips → the child
brute-forces boundaries instead of reading. Real GL hides a 3-4 letter word across ONE
adjacent word-boundary inside a natural 6-12 word sentence (5-11 boundaries), forcing a
systematic left-to-right scan. (Refs: research/11plus-oracle.md "VR: Hidden Words";
research/GL-11plus-English-VR-Research.md Type 11.)

### Data model — UNCHANGED (locked by src/__tests__/data/oracleRegressions.test.js:883-938)
```js
{
  id: <preserved>, difficulty: 1|2|3,
  questionType: "select-two",
  question: "A 4-letter word is hidden across two of these adjacent words. Find the two words.",
  options: ["In","the","morning","my","top","envelope","slowly","fell"],  // word tokens, natural sentence order
  correctPair: [4, 5],   // ADJACENT indices (j === i+1) of the straddle boundary
  explanation: "The word OPEN is hidden across 'tOP' and 'ENvelope'. ... ✓"
}
```
HARD constraints (the regression test enforces all of these — do NOT break):
- `question` is EXACTLY one of the two neutral stems (3-letter / 4-letter version). No meaning clue.
- `correctPair` = two adjacent indices, `j === i+1`, valid range.
- explanation contains the phrase **"word <HIDDEN> is hidden"** (regex `word\s+([A-Za-z]+)\s+is hidden`)
  so the test can parse the hidden word. HIDDEN is 3 or 4 letters.
- HIDDEN straddles the boundary: some split k (1..L-1) has `end-k of options[i]` + `start-(L-k) of options[j]` === HIDDEN.
- No hidden word used more than twice across the 150.

### Authoring rules (Oracle)
- Rewrite all 150, preserving ids and the 45/60/45 D1/D2/D3 split.
- Sentence length by difficulty (this is the fix — more boundaries = more reading):
  - **D1**: 6-7 words (5-6 boundaries), 4-letter word, EVEN 2+2 split, no misleading context.
  - **D2**: 8-10 words (7-9 boundaries), 4-letter word, mix of 2+2 and one uneven split.
  - **D3**: 10-12 words (9-11 boundaries), UNEVEN split (1+3 or 3+1), misleading context
    (sentence topic unrelated to the hidden word, e.g. a cooking sentence hides RAIN).
- 3-letter hidden words ~15% overall (rare, D1-D2), 4-letter ~85% (research distribution).
- Sentences must be grammatical, natural British English, child-appropriate, and ORIGINAL
  (no verbatim overlap with real papers).
- The two straddle words must be adjacent in the token list and read naturally together.
- Vary hidden words widely (each used ≤2×). Vary sentence themes.

### Machine-checkable payload (Oracle emits; STRIPPED before insert)
```js
_hidden: "OPEN",            // the hidden word (also stated in explanation)
_straddle: [4, 5],          // === correctPair
_split: "2+2" | "1+3" | "3+1" | "2+1" | "1+2",
_sentence: "In the morning my top envelope slowly fell"   // === options.join(' ')
```

### Deterministic verify (harness)
1. stem is exactly a neutral stem; questionType 'select-two'.
2. correctPair adjacent, valid; `_straddle === correctPair`.
3. HIDDEN 3-4 letters; straddles options[i]/options[j] (contiguous end+start); === explanation-parsed word.
4. options.join(' ') === `_sentence`; word count in the difficulty band (D1 6-7, D2 8-10, D3 10-12).
5. no hidden word > 2×; sentence has no stray punctuation tokens; all options are real word tokens.
6. no verbatim overlap vs research/past-papers/*.md.
Linguistic naturalness (is the sentence grammatical / does the hidden word really only appear
at that boundary and nowhere else unintended) → 2nd adversarial Oracle pass.

### Rendering change (code)
- hiddenWords options render as INLINE FLOWING PROSE (tappable word spans in reading order,
  wrapping like text), NOT chips/grid. Same `onSelectTwoToggle(idx)` / correctPair scoring.
- QuizScreen.js: replace the `selectedTopic === 'hiddenWords'` flex-wrap chip layout.
- MockTestScreen.js: ADD a hiddenWords branch (currently falls into the generic 2-3 col grid,
  which scrambles reading order). Thread the topicKey (already on each assembled mock question).

## PART B — balanceEquations: expand 30 → ~100 + wire into mock

### The gap
30 Qs, appears in ZERO mocks, despite being ~25% of CGP 10-minute papers.

### Data shape — standard 5-option MCQ (unchanged)
```js
{ id, difficulty, question: "Solve the equation:\n\n3 + 7 = 20 ÷ ( )", options:["2","3","1","10","20"], correct:0,
  explanation: "Step 1 ... Step 2 ... So ( ) = 2. ✓" }
```

### Authoring rules (Oracle)
- Append ids 31-100 (append-only), ~ even split to reach ~33/33/34 D1/D2/D3 across the full 100.
- Difficulty:
  - **D1**: one operation each side; solve for the bracket (e.g. `3 + 7 = 20 ÷ ( )`).
  - **D2**: two operations on one side (e.g. `4 × 3 = 6 + ( )`, `18 - 5 = ( ) + 4`).
  - **D3**: BODMAS with brackets / two ops both sides (e.g. `36 ÷ 6 + 4 = 2 × ( ) − 4`).
- Whole-number answers; the bracket value is a positive integer; 5 plausible numeric options,
  distractors = real arithmetic slips (wrong op order, off-by-one, used the other side).
- British style; explanations show the BODMAS steps; end with ✓.

### Machine-checkable payload (Oracle emits; STRIPPED before insert)
```js
_leftValue: 10,                 // value of the left side
_equation: "10 = 2 * x - 4",    // right side as a JS-evaluable expression with x for ( )
_answer: 7                       // must === options[correct] and solve _equation
```

### Deterministic verify (harness)
- Recompute: parse `_equation`, substitute x = options[correct], assert both sides equal.
- `_answer === Number(options[correct])`; options all distinct numeric; correct in 0-4; ✓ ending.
- Difficulty distribution across all 100 ≈ 33/33/34.

### Mock wiring (config)
- mockVRConfig.js: add `vrTypeInstructions.balanceEquations` (typeName "Balance Equations",
  questionsPerSection, instruction, workedExample).
- Add `{ topicKey: 'balanceEquations', questions: ~6 }` to each of the 3 vrPaperVariants
  `sections` arrays; adjust an existing section so the totalQuestions label stays truthful.
- New smoke test: balanceEquations appears in every variant; a mock draws balanceEquations Qs.

## Lesson map / micro-lessons
- hiddenWords: rewriting display/content does not require lesson changes (map keyed by id).
  Optional: backfill the missing lesson-map entry for hiddenWords id 150.
- balanceEquations: add ~70 lesson-map entries (reuse the single `balance-equations` subConcept).
  No new micro-lesson (existing one covers it).

## Jest gate — src/__tests__/data/hiddenWordsBalanceEq.test.js (fix #7)
- hiddenWords: word-count-per-difficulty bands (D1 6-7, D2 8-10, D3 10-12); still passes the
  existing oracleRegressions invariants (adjacency/straddle/neutral-stem).
- balanceEquations: bank >= ~100; every answer recomputes; appears in all 3 mock variants.

## Hard rules (carried)
- Oracle writes ALL content. Real papers are style/format reference ONLY, never copied.
- British English, ✓ endings, 5 options where MCQ. hiddenWords ids preserved (in-place swap);
  balanceEquations ids append-only from 31.

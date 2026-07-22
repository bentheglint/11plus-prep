# Benchmark Fix #6 — English Running-Passage Cloze — Authoring & Data Spec

Source of truth for fix #6. Written 22 Jul 2026. Ben's scope decision: **Full — mock + main bank.**

## 1. What we are building (GL authenticity)

GL English papers devote **8 questions (~16% of the paper)** to a **Cloze section**
(Q42-49): a **separate short narrative passage** (~80-100 words) with **8 inline gaps**.
Each gap is a 5-option (A-E) MCQ. The passage must be **read as continuous text** —
context from earlier sentences fixes the tense, pronoun or register for later gaps.
A child who treats each gap in isolation makes avoidable errors.

Two properties make GL Cloze distinct from our current `grammar` bank:

1. **Connected passage** (not isolated single sentences).
2. **Distractors are "errors children actually write"** — real speech-to-writing
   mistakes, not clean unrelated textbook options. This is the pedagogical heart of
   the fix: the child must apply grammar knowledge to reject a plausible-sounding wrong
   form, exactly as in the real exam.

### GL skill weighting (from `research/gl-topic-research/grammar.md`, analysis of 4 GL papers)
Across all 88 new gaps, target roughly:

| Skill family (`_skill`) | Weight | Real-error distractor examples |
|---|---|---|
| `homophone` | ~25% | their/there/they're, to/too/two, its/it's, who's/whose, where/were/wear, which/witch |
| `verb-tense` | ~25% | began/begun, threw/thrown/throwed, wrote/written/writed, brought/brung, past-participle vs past-simple |
| `modal` | ~13% | should have/should of, could have/could of, might have/might of, would have/would of |
| `conjunction` | ~11% | but/because/although/however/so/therefore — only one fits the logical relationship |
| `preposition` | ~9% | different from/to/than/of/with; of/off; in/at/by in fixed phrases |
| `agreement` (D3-leaning) | ~17% | subject-verb agreement, pronoun agreement (each…his/their), comparative/superlative (more/most), subjunctive were/was, passive-voice construction |

## 2. Volume & difficulty

**Total new = 88 items across 11 running passages.** Every new cloze item is
passage-grouped (8 gaps per passage). No standalone cloze.

### Main bank — 8 passages × 8 gaps = 64 items (`grammar` topic, ids 386-449)
Passage difficulty weighting (the passage's *overall* level; gaps still ramp within):
- 3 passages **easy-leaning** (gap mix ≈ D1 5 / D2 2 / D3 1)
- 3 passages **medium** (gap mix ≈ D1 2 / D2 4 / D3 2)
- 2 passages **hard** (gap mix ≈ D1 1 / D2 3 / D3 4)

### Mock — 3 passages × 8 gaps = 24 items (new `mockClozeData.js`)
Each mock cloze passage internally ramps **D1→D3 across its 8 gaps** (mirrors real
Q42-49: first gaps easy homophones/tenses, last gaps subjunctive/passive/agreement).
Mock gap mix per passage ≈ D1 3 / D2 3 / D3 2.

Difficulty definitions per `research/gl-topic-research/grammar.md`:
- **D1** — homophone/tense where context makes the answer obvious; the distractors are
  wrong but a careful reader rejects them easily.
- **D2** — trickier homophones (its/it's), irregular past tenses, conjunctions needing
  logical reasoning, should-have vs should-of, preposition choices.
- **D3** — subtle tense/aspect within the passage, past-participle vs past-simple,
  subjunctive, passive voice, pronoun agreement in complex sentences, near-homophone
  clusters of real words (rots/rotes/routes/roots/rites).

## 3. Data shape (EXACT — this is what gets inserted)

### 3a. Main-bank cloze item (in `englishData.js` → `topics.grammar.questions`)
Uses **unquoted JS keys** (englishData.js is a JS module, not JSON). Field order:
`id, difficulty, questionType, passageId, passageTitle, passage, gapNumber, question,
options, correct, explanation`.

```js
{
  id: 386,
  difficulty: 2,
  questionType: 'cloze',
  passageId: 'cloze-harbour-storm',
  passageTitle: 'The Storm at the Harbour',
  passage: `The old fishermen had warned them, but the boys ___(1)___ no notice. By the time the first waves ___(2)___ over the sea wall, it was already too late to turn back. ... [8 gaps total, marked ___(1)___ .. ___(8)___]`,
  gapNumber: 1,
  question: "Gap 1 — choose the word that best completes the passage.",
  options: ["took", "taked", "taken", "take", "takes"],
  correct: 0,
  explanation: "The past simple of 'take' is 'took'. 'Taked' and 'taken' are the errors children write; 'take/takes' break the past-tense flow of the story. ✓"
}
```

**Rules:**
- The **same `passage` string is duplicated on all 8 gap rows** for that passageId
  (matches how comprehension stores passages — no separate passages table).
- The passage contains **exactly 8 gap markers** `___(1)___` … `___(8)___`, sequential,
  one occurrence each.
- Each of the 8 rows has a distinct `gapNumber` (1-8) and the `question` field names it
  ("Gap N — …").
- `options`: exactly 5, all distinct strings, all **plausible real words/forms** (a child
  could believe each). The 4 distractors are real errors, not random words.
- `correct`: 0-indexed.
- `explanation`: ends with ` ✓`, names why the answer is right AND why the tempting
  distractor(s) are the errors children make.
- British English throughout, UK context, entirely original.

### 3b. Mock cloze passage (new file `src/questionData/mockClozeData.js`)
```js
export const mockClozePassages = [
  {
    id: 'mock-cloze-lost-key',
    title: 'The Lost Key',
    passage: `... ___(1)___ ... ___(8)___`,      // 8 gaps, ~80-100 words
    clozeQuestions: [
      { id: 1, difficulty: 1, gapNumber: 1, questionSubType: 'cloze',
        question: "Gap 1 — choose the word that best completes the passage.",
        options: [...5...], correct: 0, explanation: "... ✓" },
      // ... 8 total
    ]
  },
  // 3 passages total
];
```
(`id` inside `clozeQuestions` is passage-local 1-8, like `mockComprehensionData` sub-arrays.)

## 4. Machine-checkable payload (Oracle emits; harness verifies; STRIPPED before insert)

Because correctness here is **linguistic** (can't be recomputed like arithmetic), each
gap carries a payload so the harness can verify structure + authenticity deterministically,
and a **second independent Oracle pass** verifies keyed-answer correctness + unambiguity.

Per gap, alongside the item, the Oracle returns:
```js
_skill: 'homophone' | 'verb-tense' | 'modal' | 'conjunction' | 'preposition' | 'agreement',
_answerText: "took",                       // must === options[correct]
_distractorErrors: [                        // one per distractor (4 entries)
  { option: "taked", errorType: "over-regularised past tense" },
  { option: "taken", errorType: "past participle used for past simple" },
  { option: "take",  errorType: "present tense breaks narrative past" },
  { option: "takes", errorType: "3rd-person present breaks narrative past" }
],
_gapContext: "but the boys ___ no notice",  // the clause around the gap (for overlap + ambiguity check)
_onlyOneCorrect: true                       // Oracle asserts exactly one option is grammatical in context
```

### Deterministic checks the harness runs (fail = reject/flag)
1. **Structural**: 5 options, all distinct, `correct` ∈ 0-4, explanation ends ` ✓`,
   `_answerText === options[correct]`.
2. **Passage integrity**: passage contains exactly 8 markers `___(1)___`..`___(8)___`
   sequential; the 8 gap rows cover gapNumbers 1-8 with no gap and no duplicate; every
   row's `gapNumber` matches a marker in its passage.
3. **Distractor authenticity**: every distractor has a non-empty `errorType`; each item
   has exactly 4 `_distractorErrors`; `_skill` ∈ the 6 families.
4. **Skill mix**: across all 88 gaps, `homophone` ≥ 22% and each of the 6 families is
   present; no single family > 30% (except verb-tense/homophone which target ~25%).
5. **Length tell** (reuse `scripts/validation/english-length-core.mjs` thresholds):
   correct-is-longest ≤ 30%, correct-is-shortest ≤ 30%, no rank > 35%, per difficulty band.
   (Homophone/verb-form options are naturally similar length, so this should pass easily —
   it's a guard, not a target.)
6. **No verbatim overlap**: no passage sentence and no `_gapContext` appears (verbatim or
   near-verbatim) in any `research/past-papers/*.md` file.

### Non-deterministic check (2nd Oracle pass, fresh context — adversarial)
For every gap: *is the keyed answer genuinely grammatically correct in the full passage
context, and is it the ONLY option that works?* Flag any gap where a distractor is also
defensible, or the key is wrong, or the passage context doesn't actually disambiguate.
Flagged gaps are revised, not shipped.

## 5. Integration (code changes, after content is verified)
- `englishData.js`: append 64 cloze items to `topics.grammar.questions` (ids 386-449).
- New `src/questionData/mockClozeData.js` with 3 `mockClozePassages`.
- `useMockTest.js` `generateEnglishPaper`: add a ramped **Cloze section** (8 gaps from a
  random `mockClozePassages` entry), `section: 'cloze'`, `sectionName: 'Cloze'`, carrying
  `passage`/`passageTitle`.
- Renderers: add `'cloze'` to the passage-show condition in `QuizScreen.js` (~191) and the
  `showPassage` section check in `MockTestScreen.js` (~158). Options branches already
  accept the type.
- `formatCompliance.test.js`: allow `questionType: 'cloze'` (passage present, gapNumber
  1-8, 5 options).
- `public/english-question-lesson-map.json`: map each new grammar cloze id to the matching
  existing sub-concept (`homophones`, `verb-tenses`, `modal-verbs`, `conjunctions`,
  `should-have`, `comparative-superlative`, `irregular-past`, `active-passive`,
  `subject-verb-agreement`, `pronouns`) by `_skill`. No new micro-lessons.

## 6. New Jest gate — `src/__tests__/data/clozeAuthenticity.test.js`
Pins fix #6 so it can't silently regress:
- Every `questionType === 'cloze'` item (main bank + mock) has passage, gapNumber 1-8,
  5 distinct options, ✓ explanation.
- Each cloze passageId has exactly 8 gaps covering 1-8.
- Real-error distractor presence: the whole cloze set contains the required homophone
  clusters (their/there/they're, to/too/two, its/it's) and modal-of errors (should of /
  could of) — asserts the fix's defining property exists and stays.
- Skill-mix floor (homophone ≥ 22%, all 6 families present).
- Length-tell band (via english-length-core bucket for cloze).
- Mock English paper assembly includes a `cloze` section of 8 ramped gaps.

## 7. Hard rules (carried)
- Real papers are **style/format/difficulty/distractor-design reference ONLY**. Never copy
  a passage, sentence, gap, or option list verbatim or as a light reword
  (`research/past-papers/_USAGE-GUARDRAIL.md`). Overlap check #6 enforces this mechanically.
- Oracle writes ALL content. Claude builds the harness, verifies, inserts, gates.
- British English, UK context, 5 options A-E, explanations end ` ✓`.
- Grammar IDs are **append-only** (start 386); never renumber existing 1-385.

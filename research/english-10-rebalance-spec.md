# English Rebalance — Spec (Benchmark Fix #10)

**Authored:** 22 Jul 2026. Content owner: the 11+ Oracle (all questions, distractors,
explanations, passages). Claude owns spec, harness, insert, renderer glue, mock wiring, tests.

## Why (benchmark `research/past-papers/BENCHMARK-vs-real-GL-2026-07-21.md`, English, roadmap #10)
Three GL-realism gaps in English (the other English gaps — Cloze, wordClassGrammar D3,
longest-answer tell — were fixed in #6/#4/#3):
1. **Punctuation mix:** the punctuation bank (430 Qs, all error-spotting) is only **14.9%**
   capitals + end-punctuation; real GL leans ~40% there (ours is 46.7% apostrophe / 22.3% comma).
2. **Vocabulary is isolated:** 80.8% standalone synonym/antonym; real GL asks "meaning of X
   **as used in the passage**". No vocab question currently has a passage.
3. **Error-spotting is single-sentence:** all 850 error-spotting items (spelling 420 +
   punctuation 430) are one sentence in 4 segments; real GL uses continuous 8-line narratives.

**Decisions (Ben, 22 Jul): all three sub-fixes; APPEND new items (leave existing as the easier
on-ramp); ~140 total; WIRE into the English mock.**

## Existing field shapes (match EXACTLY)
Single-sentence error-spotting (existing):
```js
{ id, difficulty, questionType: "error-spotting",
  question: "Which section contains a punctuation error?",
  segments: ["The dog's owner","called out loudly","but the puppy didnt","come back to her."],
  options: ["Section A","Section B","Section C","Section D","No mistake"],
  correct, explanation }   // explanation ends with ✓
```
Passage question (existing, from #6 — reuse for anchored vocab):
```js
{ id, difficulty, questionType: "passage", passageId, passageTitle,
  passage: "…continuous prose…", question, options:[5], correct, explanation }
```

## Sub-fix A — Capitals/End-punctuation single-sentence error-spotting  (~60 items)
Append to the **punctuation** topic, EXISTING error-spotting shape above. Every item tests a
**capital-letter** or **end-punctuation** error (proper-noun/sentence-start capitals; missing/
wrong full stop, ?, !; run-on/comma-splice needing a full stop; sentence boundary). Difficulty
spread ~18 D1 / ~24 D2 / ~18 D3 (D3 = subtle: mid-sentence proper noun, run-on, statement-vs-
question end mark). ~15% should be "No mistake" (correct index 4) to match the real E-rate.
Error-spotting is IMMUNE to the longest-answer tell (options fixed), so no length guard needed.

## Sub-fix B — Narrative error-spotting  (~30 items across ~5 eight-line narratives)
NEW combo, renders with a tiny renderer add (below). Each narrative is a continuous ~8-line
British-context story; it produces ~6 questions, each targeting ONE sentence of it:
```js
{ id, difficulty, questionType: "error-spotting", passageId, passageTitle,
  passage: "…the full 8-line narrative (same text duplicated on each of its questions, the
            cloze convention)…",
  question: "Which section of the highlighted sentence contains an error?",
  segments: ["…","…","…","…"],   // the target sentence split into 4 parts
  options: ["Section A","Section B","Section C","Section D","No mistake"],
  correct, explanation }
```
Errors weighted to **capitals/end-punctuation** (~60%) with some spelling/punctuation, so B also
helps the mix. The passage gives the continuous-reading load; the segments are the sentence under
scrutiny. Append to the **punctuation** topic. ~1 in 6 "No mistake". Difficulty rises within a
narrative (later sentences harder). Passage prose must be ORIGINAL (guardrail below).

## Sub-fix C — Passage-anchored vocabulary  (~55 items across ~7 short passages)
Append to the **vocabulary** topic, EXISTING `questionType:"passage"` shape. Each short passage
(~4–6 sentences, British context) yields ~7–8 questions of the form "In the passage, what does
'<word>' mean **here**?" / "Which word could best replace '<word>' as it is used in the passage?"
— the answer must depend on the PASSAGE sense, not the dictionary-first sense (pick words with a
context-shifted meaning: e.g. "close" = stuffy, "keen" = sharp, "fair" = pale). Options are 5
single words/short phrases. Difficulty spread ~15 D1 / ~22 D2 / ~18 D3. **Longest-answer-tell
guard applies here** (5 word options): the correct option must NOT be systematically the longest;
length-match distractors to the key per difficulty.

## Renderer glue (Claude, minimal)
`src/screens/QuizScreen.js` line ~192: extend the passage-block condition to also render for
error-spotting questions that carry a passage:
`(questionType === 'passage' || 'cloze' || (questionType === 'error-spotting' && q.passage))`.
Check `src/screens/MockTestScreen.js` for the same and add if the mock shows narratives.
No other renderer change (segments + options branches already handle error-spotting).

## Mock wiring (Claude — Ben chose "wire into mock")
`src/hooks/useMockTest.js` `generateEnglishPaper()`: punctuation + error-spotting auto-pick up
new content (A + B flow in automatically). VOCAB does NOT — wire a "vocab-in-context" section to
pull passage-anchored vocab from `englishData.topics.vocabulary` (anchored subset). Add a small
narrative-error-spotting representation if not already covered. Fix the STALE
`englishPaperConfig.totalQuestions` in `mockVRConfig.js` (currently 49; should reflect real
generated total incl. the #6 Cloze section + new sections). Keep the whole-paper easy→hard ramp.

## Output shape the Oracle returns (per item) — plus machine-check fields (`_`, stripped on insert)
Add to each item: `_skill` (for A/B: one of "capital"|"end-punctuation"|"apostrophe"|"comma"|
"spelling"|"other"; for C: "vocab-in-context") and `_errorInSegment` (A/B only: the 0-based
segment index that contains the error, or -1 for "No mistake" — must equal `correct` when
correct<4, and correct must be 4 when it's -1). For C add `_contextSense: true` (asserts the
answer is the passage sense). These let the harness cross-check internal consistency.

## Harness (`scripts/data-generation/verify-english10.mjs`)
English correctness isn't numerically recomputable, so combine structural gates with an
adversarial Oracle pass:
- Structure: difficulty 1–3; exactly 5 options; correct 0–4; explanation ends ✓; question non-empty.
- Error-spotting (A,B): `segments` is 4 non-empty strings; options EXACTLY
  ["Section A","Section B","Section C","Section D","No mistake"]; `_errorInSegment` consistent
  with `correct` (see above). B items must have a `passage` (≥6 sentences) + passageId/Title.
- Vocab (C): `questionType:"passage"` + `passage` (non-empty) + passageId/Title; options 5
  distinct; **length-tell guard** — correct option is the single longest in ≤ ~25% of C items
  per difficulty (report the share).
- Mix report: count A+B items by `_skill`; report projected capitals+end-punct share of the
  rebalanced punctuation topic.
- No near-verbatim overlap with real-paper text (light substring check vs `research/past-papers/`).
- Report-only: passage reuse (how many questions per passage).
Then **2 independent adversarial Oracle correctness passes** (like #6 cloze): each re-solves every
item cold and flags any where the keyed answer is wrong or the "error" isn't really an error /
the "no mistake" sentence actually has one. Fix flags before insert.

## Guardrails (Oracle)
British English/context (£, metres, British names). Every passage and sentence ORIGINAL — never
copy or lightly reword a real-paper passage/sentence/word-list (`_USAGE-GUARDRAIL.md`). For A/B,
the "error" must be a REAL, unambiguous error and the other 3 segments must be clean; for
"No mistake" items the whole sentence must be genuinely correct. For C, the tested word must have
a meaning that shifts in context so the passage is doing real work.

## Pipeline (reuse #6/#8 lean pattern — see feedback_token_efficiency_orchestration)
spec → batched Oracle wave (each agent WRITES its JSON to scratchpad + returns path+count ONLY) →
merge (Sonnet) → verify-english10 + 2 adversarial passes → triage → insert-english10.mjs (append
per topic, position-balance where options aren't fixed [vocab yes; error-spotting options are
fixed so balance the `correct` index across A–E/No-mistake by content, no rebalance], strip `_`
fields, CRLF-safe; append passages inline per the cloze convention) → +lesson-map entries
(english-question-lesson-map.json) → renderer glue + mock wiring → Jest gate english10Rebalance →
full Jest + verify-answers + count reconcile + build + compat → visual QA the narrative render →
commit → tracker.

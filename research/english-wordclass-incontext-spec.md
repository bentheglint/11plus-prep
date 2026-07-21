# wordClassGrammar — in-context item spec (Fix #4)

Design contract for the 2026-07-21 rebuild of the English `wordClassGrammar`
topic (benchmark roadmap fix #4). Authored by the 11+ Oracle; grounds any future
authoring wave or content audit for this topic. Real GL papers are a style /
difficulty reference ONLY — every item must be original (see
`research/past-papers/_USAGE-GUARDRAIL.md`).

## The change
GL never tests word class as an isolated list ("What type of words are these:
a, b, c, d?"). It embeds a **target word inside a sentence** and asks its class
**as used in that sentence**. Difficulty comes from context-dependency and a
plausible "obvious" wrong class a child picks by judging the word in isolation.
The old bare-list format is retired for D2/D3 (D1 warm-ups kept unchanged).

## Question formats
1. **"…sentence with *target*… What type of word is *target*?"** (primary). The
   target is marked with asterisks. Options are class labels.
2. **"In this sentence — '…' — which word is a [class]?"** (~1 in 5). Five
   candidate words from the sentence; pick the one of the named class. (The
   answer is a word from the stem by construction — this is the task, not a
   stem-leak; the `oracleRegressions` stem-leak detector exempts this format.)

## Trap taxonomy (A–K)
| # | Trap | Mechanism | Example (answer → obvious-wrong) |
|---|------|-----------|----------------------------------|
| A | Abstract noun feels like an adjective | names an idea, read as "describing" | *determination* → Noun, not Adjective |
| B | State/linking verb (not an action) | "verbs are doing words" | sea *appeared* calm → Verb, not Adjective |
| C | Non-ly adverb | no -ly, read as adjective | ready *soon* → Adverb, not Adjective |
| D | -ly word that is an adjective | -ly ⇒ "adverb" | a *cowardly* retreat → Adjective, not Adverb |
| E | Preposition ↔ adverb/particle | object present or absent decides | *beneath* the pier (Prep) / lights went *off* (Adverb) |
| F | Dual-function content word | word's usual class ≠ its class here | a *light* jacket → Adjective, not Noun |
| G | Participle acting as an adjective | -ing/-ed looks like a verb | the *roaring* fire → Adjective, not Verb |
| H | Triple-function word (before/after/since/as) | prep vs conjunction vs adverb by context | explored it once *before* → Adverb |
| I | Determiner ↔ pronoun | noun follows = determiner; stands alone = pronoun | *this* was her fault → Pronoun |
| J | Noun sub-type in context | collective/abstract/proper vs common | a *swarm* of bees → Collective noun |
| K | Flat adverb (same form as adjective) | fast/hard/late/straight | trained *hard* → Adverb, not Adjective |

Every item must offer the "obvious wrong class" as a live option.

## Difficulty calibration
- **D2** — the target has ONE true class in normal English; the trap is a
  *surface-feature misconception* (an -ly ending, an -ing look, "it names a
  quality", "it's not a doing word"), not a genuine alternative reading.
  Traps A, B, C, D, E-prep, J, and easy I sit here.
- **D3** — the target is a GENUINELY dual/triple-function word; the "obvious"
  option is a class the exact word frequently takes, and **only the sentence
  resolves it**. Every D3 item must fail the "remove the sentence → unanswerable"
  test. Traps F, G, E-particle, H, K, and hard I sit here.

Grader shorthand: **D2 = "one right class, tempting wrong label." D3 = "this
word really is often that other class; only the sentence decides."**

## The 2026-07-21 rebuild
Replaced all 170 D2 + 113 D3 items with 283 in-context items (kept 121 D1).
Ids and array order preserved (content swapped in place); correct-answer
positions balanced evenly A–E mechanically on insert (labels carry no positional
meaning). Gated by `src/__tests__/data/wordClassGrammarInContext.test.js`.

Apportionment used (for future top-ups): D2 — A ~30, J ~25, B ~30, D ~25,
C ~25, E-prep ~20, I ~15. D3 — F ~35 (flagship), G ~18, E-particle ~18, H ~15,
K ~15, I ~12.

## Known gap (flagged for a follow-up top-up)
Connective adverbs (however, therefore, moreover, consequently) are genuine GL
word-class content but were NOT included in this wave (the old bare-list item
that tested them, at id 55, was replaced). The `oracleRegressions` guard now
checks connective adverbs are never mis-classed as conjunctions but does not
require their presence. Restore explicit coverage via a small Oracle top-up.
Two D1 definitional items (ids 116 "What is a clause?", 121 "When do we use
'an'?") also carry a mild "longest answer is correct" length signal (pre-existing,
D1, out of the length gate's meaningful scope) — worth length-balancing their
distractors in the same top-up.

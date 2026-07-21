# VR letterSums — "answer as a letter" spec (Fix #5)

Design contract for the 2026-07-21 rebuild of the VR `letterSums` topic
(benchmark roadmap fix #5). Authored by the 11+ Oracle; grounds any future
authoring wave or content audit. Fills a gap the Oracle flagged: the master
reference had no letter-sums deep-dive, only a 39-line master section. Real GL
papers are a style / difficulty reference ONLY — every item is original (see
`research/past-papers/_USAGE-GUARDRAIL.md`).

## The change
Our old letterSums always asked for a NUMERIC answer ("total value of CAT?" → 24;
even the BODMAS D3 items had numeric options). 0 of 128 used the distinctive hard
GL skill: compute a value from a letter-code, then **map the result back to a
LETTER** using the same code. Options are letters, not numbers. That two-way
map-back is what makes the topic GL-hard; without it the topic tops out at D2.
The rebuild makes answer-as-a-letter the backbone (D2–D3), keeps a thin authentic
numeric slice for D1 variety, and fixes a visual mismatch (the A=1…Z=26 line is
false on custom-code items).

## The two answer-as-a-letter formats
- **SA — standard alphabet.** Stem states "A=1, B=2 … Z=26." Compute a chain over
  letters, then convert the numeric result back through the SAME A=1…Z=26 mapping.
  e.g. "E + D as a letter" → 5+4 = 9 → I. Visual: **AlphabetLine**.
- **CC — custom small code.** Stem states a bespoke code (e.g. "A=3, B=5, C=8,
  D=1, E=4"). Compute a BODMAS chain, map the result back to the letter whose code
  value equals the result. Code values are chosen so the result equals one of the
  code's own entries (author the arithmetic first, then assign letters). Visual:
  **CodeTable** (a two-row value-key). The A=1…Z=26 line is FALSE here and must
  never be shown — that mismatch is exactly what this rebuild removes.
- **NUM (retained ~12%).** Authentic numeric-answer sub-types kept for D1 variety:
  word value, greatest/least value (word options), difference. Visual: AlphabetLine.

## Difficulty calibration
| Tier | Format | Operands | Operations | Fractions | Code |
|------|--------|----------|-----------|-----------|------|
| D1 | SA (mostly) + tiny CC + easy NUM | 2 | + or − only | none | 5-letter |
| D2 | SA + CC | 3 | +, −, and one × (BODMAS bites) | none | 5–6-letter |
| D3 | CC + hard SA | 3–4 | ×, ÷, brackets, mixed | yes — a fraction that CLEARS | 6–8-letter (5 as options) |

D1 stays a genuine answer-as-a-letter task (same arithmetic as before + the single
map-back step) — easy by arithmetic, not by dropping the map-back.

## Fraction handling (how a fraction resolves to a valid letter)
GL never leaves a fractional *answer*. The authentic pattern is a **fractional
intermediate that clears to a whole number**: an earlier division makes a fraction
(e.g. 6÷4 = 1½), a later × clears it (1½×8 = 12). The final result is always a whole
number mapping to a valid letter. Author rule: pick the divisor so it does NOT
divide cleanly (the child must hold the ½), and the following multiplier so the
product is whole. This yields two free distractors — floor the fraction, round it up.

## Distractor design for LETTER answers (every wrong letter = a named misconception)
1. **BODMAS-order slip** — the letter reached by left-to-right instead of ×/÷ first.
   The strongest distractor; put on almost every mixed-op item.
2. **Fraction-floor / fraction-round-up** — on division items, truncate 1½→1 or
   round →2 before multiplying (two distractors from one design).
3. **Dropped final operand** — stop one step early, map that intermediate.
4. **Wrong operation** — swap + for × / misread ÷.
5. **Off-by-one on the alphabet mapping** (SA only, sparingly).
6. **Forgot to map back** (SA, when the numeric result coincides with a low letter).
7. **Largest/smallest code-value lure** (CC, at most one per item).
On CC, design the code so these misconception values coincide with real code entries;
extend the code to 6–8 letters if a 5-letter code can't carry four clean distractors.

## Apportionment used (for future top-ups)
SA: D1 16, D2 28, D3 20 = 64. CC: D1 2, D2 22, D3 25 = 49. NUM: D1 8, D2 7 = 15.
Total 128 (= the topic's 26 D1 / 57 D2 / 45 D3). Fractions appear only at D3
(~22 items); brackets at D3 + a little top-end D2.

## The 2026-07-21 rebuild
Replaced all 128 items with 128 answer-as-a-letter + retained-numeric items,
preserving every id and difficulty-per-slot (content swapped in place). Correct-
answer positions balanced evenly A–E on insert. Each item was machine-verified:
its expression recomputed from the code equals the stated result, maps to the
answer letter, and matches options[correct]; CodeTable value-keys match their codes.
Gated by `src/__tests__/data/letterSumsAnswerAsLetter.test.js`. The new CodeTable
value-key was visually confirmed via the diagram-viewer dev URL.

## Note
Verification payloads (`_code`/`_expr`/`_result`/`_answer`) were emitted by the
authoring agents purely to enable deterministic checking and were stripped before
insert — they are not in the bank. Regenerate with the same harness if the topic
is re-authored.

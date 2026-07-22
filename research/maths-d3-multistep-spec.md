# Maths D3 Elite Multi-Step Tier — Spec (Benchmark Fix #8)

**Authored:** 22 Jul 2026. **Owner of content:** the 11+ Oracle (all questions,
distractors, explanations). Claude owns the spec, harness, insert and tests only.

## Why this exists
The 21 Jul benchmark (`research/past-papers/BENCHMARK-vs-real-GL-2026-07-21.md`,
finding #3 Maths + roadmap #8) found our Maths D3 computation ceiling is close to
real GL, BUT our hardest tier is mostly **1–2 step, single-concept**. Real GL's top
~10% are **2–3 step chains that switch concept or operation mid-problem** — e.g.
"15% of ⅓ of 240" (percentages × fractions), "the ratio share, then a % of it",
"read the value, then two operations to the answer". **Multi-sentence ≠ multi-step:**
a long story that reduces to one calculation does NOT qualify.

We are **appending ~100 new elite-tier D3 items** across the existing 16 topics
(decision, Ben, 22 Jul). We are NOT rewriting existing D3 and NOT adding a new topic.
Existing D3 stays as the moderate on-ramp; these sit on top as the elite sub-tier.

## What counts as an elite multi-step item (hard definition)
An item qualifies only if ALL hold:
1. **≥2 genuinely distinct computational steps**, where the output of step 1 is the
   input to step 2 (a real chain, not two independent facts). ≥3 steps preferred for
   the hardest third.
2. **A concept OR operation switch** across the chain. Examples of a valid switch:
   percentage → fraction; ratio share → percentage of that share; area → percentage/
   scale; division → remainder-interpretation → second operation; form-expression →
   solve → substitute back. Pure "do the same operation twice" (e.g. add three
   decimals) does NOT switch and does NOT qualify.
3. **A place where a real GL candidate loses the mark** — typically forgetting the
   final step, doing the steps in the wrong order, or applying step 2 to the wrong
   intermediate. The distractors must embody exactly these slips (see below).
4. **Deterministically checkable:** the final answer is numeric or currency (no
   "which statement is true" multi-select, no diagram-read — diagrams are fix #9).

## Allocation (~100 items, anchor each item to its PRIMARY topic)
Weighted to the 10 single-concept topics (thinnest on concept-switch), floor on the
6 already-deep topics. A cross-concept item lives under whichever topic leads it
(e.g. "15% of ⅓ of 240" → percentages; "netball ratio then 25% off" → ratio).

| Topic | Target | Camp |
|---|---:|---|
| percentages | 8 | thin |
| decimals | 8 | thin |
| longdivision | 8 | thin |
| fractions | 8 | thin |
| longmultiplication | 8 | thin |
| negativenumbers | 8 | thin |
| areaperimeter | 8 | thin |
| anglesshapes | 8 | thin |
| primenumbersfactors | 8 | thin |
| speeddistancetime | 8 | thin |
| ratio | 4 | deep |
| volume | 4 | deep |
| placevalue | 3 | deep |
| algebra | 3 | deep |
| datahandling | 3 | deep |
| sequences | 3 | deep |
| **TOTAL** | **100** | |

For the computation-anchored topics (longdivision, longmultiplication, decimals)
the "switch" is usually **operation → interpretation → second operation** (e.g.
divide, interpret the remainder in context, then compare/round). That is a valid
elite chain even though it stays inside the topic.

## Distractors — how to build them (breaks the middle-value tell)
The benchmark's dominant Maths flaw is the **middle-value tell** (51.5% of correct
answers were the median of their 5 options, caused by ±constant "ladder" distractors).
Do NOT build ladders. Instead, for each item derive the 4 wrong options from **named
step-boundary errors**:
- **Dropped-the-final-step:** the value after step 1 (or step 2 of 3), before the last
  operation. (Skews one direction, usually the biggest single source of real error.)
- **Wrong-order / wrong-base:** applied step 2 to the wrong intermediate (e.g. took the
  % of the original instead of the reduced amount).
- **Right-method / one-slip:** a single place-value, operation, or sign slip inside the
  chain.
- **Topic-authentic single-concept error:** pull one from
  `research/maths-misconception-distractor-catalogue.md` for the anchor topic
  (per-topic named misconception value-rules already Oracle-authored 21 Jul).

Because real errors are **asymmetric** (some land above C, some below), a topic-honest
mix pushes the correct value's rank toward uniform **as a side effect** — never
engineer a per-item rank. Guards (enforced by the harness): no constant-spacing ladder;
correct answer is NOT the median in more than ~25–30% of a topic's items.

## Required per-item output shape (Oracle returns JSON)
Each item is a normal Maths question object PLUS two machine-check fields (prefixed `_`,
stripped on insert):
```js
{
  difficulty: 3,
  question: "…",                    // British English, £/metres, British names
  options: ["…","…","…","…","…"],  // EXACTLY 5, strings; answer may carry £, units, %
  correct: 2,                        // 0-indexed
  explanation: "Step 1 … Step 2 … Step 3 … ✓",   // MUST show each step; end with ✓
  _expr: "0.15*(240/3)",            // JS-evaluable arithmetic = the numeric answer.
                                     // ONLY digits + - * / ( ) . and spaces. This is
                                     // the deterministic recompute; must equal the
                                     // number parsed from options[correct].
  _steps: ["⅓ of 240 = 80", "15% of 80 = 12"],  // 2–3 named steps; length ≥ 2.
  _distractors: {                    // map each WRONG option to its error name
     "36": "15% of 240 (skipped the ⅓)",
     "80": "dropped the final step (stopped at ⅓ of 240)",
     "…": "…"
  }
}
```
Notes:
- `_expr` must be a pure arithmetic expression (the harness sandbox-evals it; anything
  outside `[0-9 + - * / ( ) .]` is rejected). If the answer is currency/units, `_expr`
  is just the number (e.g. `65` for "£65"); the harness parses the leading number from
  the option.
- If an item genuinely cannot be reduced to a numeric `_expr`, DO NOT author it for this
  wave — pick a different numeric item instead (keeps the wave 100% deterministic).
- Options must be distinct; no option equals another; keep option formatting consistent
  within an item (all "£x", or all bare numbers, etc.).

## Hard guardrails (Oracle)
- **Originality:** never copy or lightly reword a real-paper item, passage, number list,
  or option set (`research/past-papers/_USAGE-GUARDRAIL.md`). Method-only reuse.
- Every question fully original and self-contained; British context.
- Explanation must make the chain visible (a marker can read it and see ≥2 steps).

## Harness (`scripts/data-generation/verify-maths-d3.mjs`) — what it enforces
Per item (hard fail): difficulty===3; exactly 5 options; correct in 0..4; options all
distinct; explanation ends with ✓; `_steps.length >= 2`; `_expr` present, passes the
character whitelist, and `eval(_expr)` ≈ number parsed from `options[correct]` (tolerance
1e-6); **anti-ladder**: the 5 option-numbers sorted are NOT a constant/near-constant
arithmetic progression.
Per item (report only, for my review): count of distinct arithmetic operations in the
explanation (multi-step signal); whether `_distractors` names all 4 wrong options.
Bank-level (`--full`, after merge): correct-answer value-rank histogram overall and per
topic — flag if any topic has C as the median in >30% of its items, or if the overall
middle-rank share >30%. Position (letter) balance is applied at INSERT, not authored.

## Pipeline (reuses the #5/#6/#7 proven pattern)
spec → Oracle proof batch (1 topic) → full parallel wave (by topic) → `verify-maths-d3
--full` + rank-distribution → fix/regenerate rejects → `insert-maths-d3.mjs` (append per
topic, seed position-balance the `correct` index A–E, strip `_` fields, CRLF-safe) →
Jest gate `src/__tests__/data/mathsD3Multistep.test.js` → full Jest + `verify-answers` +
count reconcile + build + compat → spot dev-preview a few → git fetch → commit → tracker.
No renderer/mock-wiring work (text-only questions; existing quiz + mock render handles
them; mocks already ramp Maths correctly per benchmark finding #1).

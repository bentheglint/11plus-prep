# Question-Content Tools — the repeatable pipeline

A toolkit and a **method** for changing question content without it turning into an
all-day epic. Born out of the 26 June 2026 Missing Letters & Words rebuild, which took
~14 hours the hard way and ~2 hours once we found the right shape. This README is that
right shape, written down so the next change is an afternoon.

---

## The one principle

**Separate machine-work from judgement-work, and never let the Oracle (the LLM) do
machine-work.**

The 14-hour version had the Oracle deciding dictionary mechanics — *is this a real word?
does this gap work? do these options clash?* — inside every question it wrote. That is
slow, it re-derives the same rules every time, its context snowballs until it bogs down,
and it can even refuse the work. Flip it: a **script proves the mechanics first**, the
Oracle writes **only the part a script can't** (the sentence and the reasoning), and a
**script verifies** the result.

> Machine does machine-work → Oracle does judgement-work → machine verifies.

---

## The pipeline (applies to any question-content change)

| Step | Who | What | Tool |
|---|---|---|---|
| 1. Spec the bar | You + Oracle | Decide the *checkable* difficulty bar (e.g. "D3 = 3–4 options form a word, gap mid-word, discriminator not adjacent"). Write it down. | — |
| 2. Generate skeletons | Script | Produce **mechanically-guaranteed** raw material: valid hosts, gaps, answers, traps, fillers. Nothing creative yet. | `gen-skeletons.js` |
| 3. Write the content | Oracle, **fresh + batched** | Hand the pre-validated skeletons to a *fresh* Oracle in batches of ~15. Its only job: the sentence + explanation. No dictionary work, no self-audit. | Agent (`11plus-oracle`) |
| 4. Verify | Script | Check every item against the bar mechanically. Re-issue only flagged ids. | `verify.js` |
| 5. Assemble | Script | Combine batches, even out answer positions, de-duplicate fillers — all with assertions. | `assemble.js` |
| 6. Apply + test + ship | Script + CI | Splice into the data file in place, run the pinning test, deploy via `deploy.sh`. | `apply.js`, Jest, `deploy.sh` |

Run the Oracle batches **in parallel as separate fresh agents** — each sees only its 15
skeletons, so context never snowballs. That was the single biggest speed-up.

---

## What the scripts guarantee — and what they don't

The scripts guarantee **mechanics**: the answer is a real word, the gap is mid-word, the
right number of options form words, options are unique, the explanation is well-formed,
answer positions are even, the splice is clean.

They **cannot** guarantee the **sentence discriminates** — that only the intended word
fits and each tempting trap is ruled out by a subtle, non-adjacent detail. That is the
irreducible Oracle/human judgement. **Always read the batch before shipping.** A green
`verify.js` means "mechanically sound", not "a good question".

---

## The missing-letters toolkit

`scripts/question-tools/missing-letters/` — for GL Type 7 ("three letters removed",
`missingLettersWords`, and any insert-the-letters VR mechanic).

| File | Does |
|---|---|
| `lib.js` | Shared primitives — dictionary + recognisable-word set, `rebuildsAll`, `gapFirstPos`, frame parsing. The single source; the others `require` it. |
| `gen-skeletons.js` | Builds guaranteed-valid skeletons from a candidate host list (or `scan` mode to mine the wordlist). Safe mid-word gaps, ≥2 recognisable traps, unique frames, spread fillers. |
| `verify.js` | Checks a batch of shipped-shape objects against the tier bar. Hard-fails mechanics; warns on weak traps. |
| `assemble.js` | Combines batches → diversifies over-used fillers (updating options *and* explanations) → evens answer positions → re-validates. |
| `apply.js` | Splices a finalised `.jsonl` into `vrData.js`, replacing an id range in place. Dry-run unless `--write`. |

### End-to-end (copy-paste, adjust the config block in each script)

```bash
cd scripts/question-tools/missing-letters
node gen-skeletons.js                 # -> skeletons JSON (mechanics guaranteed)
# ... hand skeletons to fresh 11plus-oracle agents, 15 at a time -> batch1.js, batch2.js ...
node verify.js ../../path/batch1.js   # repeat per batch; re-issue flagged ids only
node assemble.js                      # -> combined, position-balanced, filler-diversified .jsonl
node apply.js                         # dry-run: check anchors + counts
node apply.js --write                 # splice into vrData.js
cd ../../.. && CI=true npx react-scripts test src/__tests__/data --watchAll=false
bash deploy.sh                        # git fetch first; deploy.sh runs tests + smoke + compat
```

---

## Adapting to a new topic or question type

**Reusable as-is:** the method above, `lib.js` (dictionary + word helpers), and the
*shapes* of `verify`/`assemble`/`apply` (tier-aware checks, filler/position balancing,
anchored in-place splice).

**Per-type, must be rewritten:** the actual mechanics live in `gen-skeletons.js` and the
word-maker rule in `verify.js`. A synonyms or letter-codes topic has entirely different
mechanics. **Copy the pattern; don't force a universal engine** — chasing one would be
the same over-build that caused the original epic. The win is the *recipe*, not a
god-script.

---

## The difficulty bar is pinned in CI

`src/__tests__/data/missingLettersWordsDifficulty.test.js` derives the bar from the live
data and fails the build if it slips:

- D1 ≤ 2 word-makers · D2 ≥ 2 · D3 ≥ 3 (elimination must be impossible at D3)
- D2/D3 gaps are mid-word (never start/end — the original defect)
- answers are real words that rebuild the host; 5 unique options; ✓ explanations
- no explanation names a 3-letter option that was swapped out

This is a *derive-or-pin* guard per the duplicated-truth rules in `CLAUDE.md`: it reads
the real data, so it can't drift behind a "keep in sync" comment.

---

## Note: the older `scripts/validation/validate-missing-letters.js`

That validator predates this design. Two reasons it does **not** supersede the toolkit:

1. It expects an **authoring-time shape** (`fullWord`, `capsWord`, `insertPos`,
   `sentence`) that the **shipped** questions don't carry — so it can't run against
   `vrData.js` as-is.
2. Its ambiguity check (#9) **hard-fails any item where more than one option forms a
   word** — which is exactly what the reasoning-led D3 design does *on purpose*. Under the
   new design that check is wrong.

For shipped data, `verify.js` + the pinning test are canonical. The old validator is left
in place (it may be referenced elsewhere) but is a candidate for retirement. Its one
genuinely reusable asset — the `MANUAL_3LETTER_SEED` of everyday 3-letter words — has been
folded into `lib.js`.

# Oracle Sweep Rules — Read Before Every Review

These rules apply to ALL Oracle discovery sweeps and spot checks.
They exist because past sweeps produced false flags that wasted time
and nearly led to unnecessary changes.

## Rule 1: Verify before flagging

Never report structural findings based on inference or partial reads.

- **"Question X doesn't exist"** — read far enough to confirm.
  Topics may have V2 batches appended later in the file.
- **"Zero questions in category X"** — search the full topic, not
  just the batch you're reviewing. If unsure, say "not verified
  across full topic" — never claim zero without checking.
- **"N orphan mappings"** — verify each mapping target actually
  doesn't exist before reporting it as orphaned.

## Rule 2: Distributions are whole-bank only

When reviewing a batch (subset) of a topic:

- **DO** flag individual questions with wrong answers, wrong
  explanations, ambiguous distractors, mis-rated difficulty.
- **DO NOT** calculate or comment on difficulty distribution, answer
  position bias, category coverage percentages, or "No mistake" rates.

These metrics are only meaningful across the full topic. A batch that
is 100% D3 is not a problem if the full topic hits 30/40/30. State
"distribution analysis deferred to full-topic summary" and move on.

## Rule 3: Understand how the app works

- **Questions are randomised.** Children never see questions in ID
  order. Clustering of similar questions by ID is a non-issue — do
  not flag it.
- **Difficulty is adaptive.** The app adjusts to the child's level.
  More D3 than D1 may be intentional.
- **Lessons are served by sub-concept mapping.** Wrong mappings
  directly mislead children. This is the highest-impact finding
  category — prioritise it.

When flagging, ask: "Does this affect the child's actual experience
(given random selection), or only the raw data ordering?"

## Rule 4: Counts must match lists

If your finding says "59 questions need fixing", you must list all 59.
If you can only list 45, say 45. Inaccurate counts erode trust in the
entire review.

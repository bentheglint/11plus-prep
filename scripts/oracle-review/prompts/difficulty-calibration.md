# Difficulty Calibration — Oracle Review Prompt

> **REQUIRED:** Before starting, read `scripts/oracle-review/prompts/SWEEP-RULES.md`.
> Those rules override any conflicting instructions below.

## Scope

**Load:** The target topic's questions from the relevant data file
(`src/questionData/mathsData.js`, `englishData.js`, or `vrData.js`).

**Also load:** The Oracle's difficulty criteria for this question type
from `research/11plus-oracle.md`. If a topic deep-dive exists in
`research/gl-topic-research/`, load that too.

**Review:** Every question in the topic. Check the `difficulty` field
(1, 2, or 3) against the Oracle's type-specific criteria.

## Binary Checklist

For each question, answer these Yes/No:

1. **Step count matches difficulty?**
   - D1 = single-step reasoning
   - D2 = two-step reasoning
   - D3 = three or more steps
   - Yes = step count matches tagged difficulty

2. **Vocabulary/number complexity matches difficulty?**
   - D1 = common words (Year 3-4), simple numbers
   - D2 = curriculum words (Year 5-6), larger/decimal numbers
   - D3 = advanced vocabulary, complex/multi-operation numbers
   - Yes = complexity matches tagged difficulty

3. **Type-specific criteria met?**
   - Each question type has its own D1/D2/D3 definitions in the Oracle
   - E.g., spelling D1 = common words with obvious misspellings;
     spelling D3 = subtle single-letter errors in uncommon words
   - Yes = the question matches the type-specific criteria for its level

4. **Not a borderline case requiring judgement?**
   - If the question could defensibly be rated at the adjacent level,
     flag it as borderline rather than pass/fail
   - Yes = clearly belongs at its rated level (not borderline)

## Anchored Examples

### Pass — Correct D2 rating

**Percentages Q86:** "A school has 900 pupils. If 42% passed a
swimming test, how many did not pass?"
- Two-step: complement (100%-42%=58%), then calculate (58% of 900)
- Numbers are clean but not trivial (900, 42%)
- Year 5-6 vocabulary level
- **Verdict: D2 is correct** (this was found mislabelled as D3 in a
  real Oracle audit — the fix was to downgrade to D2)

### Fail — Wrong D1 rating

**Spelling (hypothetical):** "The children went on an _excurtion_ to
the museum."
- The word "excursion" is Year 6+ vocabulary
- The misspelling (excurtion → excursion) is a subtle suffix error
- D1 should use common Year 3-4 words with obvious misspellings
- **Verdict: Should be D2 or D3, not D1**

## Output Format

```
| Q ID | Tagged | Should Be | Reason | Confidence |
|------|--------|-----------|--------|------------|
| Q86  | D3     | D2        | Two-step complement, clean numbers — standard D2 | high |
| Q14  | D1     | D1        | — (correct) | — |
```

Only include rows where the rating is wrong or borderline. Correct
ratings can be omitted or marked with a dash.

**Confidence levels:**
- **high** — clearly wrong, no reasonable argument for current rating
- **medium** — borderline case, could go either way but leans toward change
- **low** — very borderline, flagging for awareness only

## Distribution Analysis

See SWEEP-RULES.md Rule 2. Do not calculate difficulty distribution
from a batch — only from the full topic.

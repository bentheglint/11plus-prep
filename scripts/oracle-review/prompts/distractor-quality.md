# Distractor Quality — Oracle Review Prompt

## Scope

**Load:** The target topic's questions from the relevant data file.

**Also load:** The Oracle's distractor design patterns and common GL
traps for this question type from `research/11plus-oracle.md` and the
topic deep-dive in `research/gl-topic-research/` if available.

**Review:** Every question's `options` array. Check that wrong answers
are plausible, reflect real misconceptions, and follow GL trap patterns.

## Binary Checklist

For each question, answer these Yes/No:

1. **Does each wrong answer reflect a real student error?**
   - Off-by-one, wrong operation, unit confusion, homophone, sign
     error, misread question, etc.
   - Yes = every distractor maps to a specific misconception
   - No = one or more distractors are random/implausible

2. **Is there at least one "trap" distractor?**
   - A trap is the answer you get from the most common mistake
   - E.g., for "What is 15% of 80?": trap = 15 (confusing % with value)
   - Yes = at least one distractor is the common-error answer

3. **Do distractors match the format of the correct answer?**
   - Same units, same precision, same structure
   - E.g., if correct is "3.5 cm", distractors should be "X.X cm"
     not "35 mm" or just "4"
   - Yes = all options use consistent format

4. **At D3, are at least 2 distractors close to the correct answer?**
   - D3 distractors should require precision to distinguish
   - E.g., correct = 137.5km, distractors include 135km and 140km
   - Yes = D3 has close distractors (skip for D1/D2)

5. **Are options free of "obviously wrong" giveaways?**
   - No distractor is so extreme it can be eliminated instantly
   - E.g., for "What is 25% of 80?" → option "800" is obviously wrong
   - Yes = all distractors are in a plausible range

6. **Does the question use realistic real-world values?**
   - If the question uses a real-world context (vehicles, distances,
     prices), are the numbers plausible?
   - E.g., a narrowboat at 32 km/h or Gran driving at 120 km/h
     (75 mph) undermines the real-world learning context
   - Yes = values are realistic for the scenario described
   - N/A = question is abstract (no real-world context)

## Anchored Examples

### Pass — Well-designed distractors

**Speed/Distance/Time Q:** "A car travels 150km in 2.5 hours. What
is its average speed?"
- Correct: 60 km/h (150 ÷ 2.5)
- Distractors: 50 km/h (150 ÷ 3, rounded hours), 75 km/h (150 ÷ 2),
  55 km/h (close but wrong), 375 km/h (150 × 2.5, wrong operation)
- **Verdict: Pass** — each distractor maps to a specific error
  (rounding, wrong divisor, multiplication instead of division)

### Fail — Weak distractors

**Percentages (from real audit):** "What percentage is 72 out of 240?"
- Correct: 30%
- Distractors: 25%, 28%, 32%, 35%
- **Verdict: Fail** — distractors are arbitrary numbers near 30%.
  None maps to a specific calculation error. Better: 3% (forgot to
  multiply by 100), 33% (72÷240 ≈ 0.3, rounded up), 72% (swapped
  numerator/denominator logic)

## Output Format

```
| Q ID | Issue | Severity | Detail |
|------|-------|----------|--------|
| Q76  | Random distractors | high | All 4 wrong options are arbitrary values near correct answer — none maps to a student error |
| Q25  | No trap answer | medium | Common-error answer (multiply instead of divide) not included in options |
| Q42  | Format mismatch | low | Correct answer has 1 decimal place, two distractors are whole numbers |
```

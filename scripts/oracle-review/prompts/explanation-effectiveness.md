# Explanation Effectiveness — Oracle Review Prompt

## Scope

**Load:** The target topic's questions from the relevant data file.

**Also load:** The Oracle's criteria from `research/11plus-oracle.md`
and the 5 warmth principles from the project conventions.

**Review:** Every question's `explanation` field. Check that it teaches
the method, addresses misconceptions, and follows tone guidelines.

**Pre-filter already done:** Part 1 (section 1.8) has caught garbled
debug text, missing explanations, too-short placeholders, and
answer-only restates. Focus on pedagogical quality.

## Binary Checklist

For each explanation, answer these Yes/No:

1. **Does it include the method/approach?**
   - Shows the steps to reach the answer, not just the answer itself
   - E.g., "First find 10% (80 ÷ 10 = 8), then multiply by 3 to
     get 30% (8 × 3 = 24)"
   - Yes = method is shown, a child could follow the steps

2. **Does it explain WHY the correct answer is correct?**
   - Not just "The answer is C" or "24 is correct"
   - Connects the method to the concept being tested
   - Yes = a child who got it wrong would understand the reasoning

3. **Does it address the GL trap or common misconception?**
   - If the question has a trap (e.g., off-by-one, wrong operation),
     the explanation should flag it
   - E.g., "Be careful not to confuse 15% with just 15"
   - Yes = the trap is addressed (or the question has no obvious trap)

4. **Is it under 150 words?**
   - Concise enough for a 10-year-old to read without losing focus
   - Yes = explanation is appropriately brief

5. **Does it follow the warmth principles?**
   - Conversational, not clinical. Encouraging, not patronising.
   - Relatable language for a 10-11 year old
   - Yes = tone is appropriate

## Anchored Examples

### Pass — Effective explanation

**Volume Q:** "What is the volume of a cuboid with length 8cm, width
5cm, and height 3cm?"

Explanation: "To find the volume of a cuboid, multiply length × width
× height. So 8 × 5 × 3 = 120 cm³. Remember, volume is always in
cubic units (cm³) because you're measuring three dimensions. A common
mistake is to add the numbers instead of multiplying — that would give
you the wrong answer of 16. ✓"

- **Verdict: Pass** — shows method (L×W×H), explains why (three
  dimensions), addresses the trap (adding instead of multiplying),
  concise (52 words), appropriate tone.

### Fail — Weak explanation

**Percentages Q:** "What is 35% of 420?"

Explanation: "The answer is 147. ✓"

- **Verdict: Fail** — no method shown, no reasoning, no trap addressed.
  A child who got this wrong learns nothing. Should show: "Find 10%
  (420 ÷ 10 = 42), then 30% = 42 × 3 = 126, then 5% = 42 ÷ 2 = 21,
  so 35% = 126 + 21 = 147."

## Output Format

```
| Q ID | Issue | Severity | Detail |
|------|-------|----------|--------|
| Q42  | Answer-only | high | Explanation just states the answer with no method or reasoning |
| Q88  | No trap addressed | medium | Common off-by-one error not mentioned |
| Q15  | Too long | low | 180 words — could be trimmed without losing clarity |
```

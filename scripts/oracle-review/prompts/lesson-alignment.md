# Lesson-Question Alignment — Oracle Review Prompt

## Scope

**Load:** The target topic's question-lesson mapping from
`public/[subject]-question-lesson-map.json`. Load the mapped lesson
content from `src/microLessons/staging/`. Load the mapped questions
from the relevant data file.

**Also load:** The Oracle's criteria from `research/11plus-oracle.md`
for the skills being tested.

**Review:** Each lesson-to-question mapping. Check that the lesson
teaches the method needed to answer its linked questions.

**Pre-filter already done:** Part 1 (section 1.5) catches orphaned
mappings, missing sub-concepts, and broken references. Focus on
pedagogical fit.

## Binary Checklist

For each lesson-question mapping, answer these Yes/No:

1. **Does the lesson's teach screen cover the skill the question tests?**
   - The specific method, not just the general topic
   - E.g., a question testing "reverse percentages" should map to a
     lesson that teaches reverse percentages — not one that teaches
     "finding X% of Y"
   - Yes = the lesson teaches the exact skill needed

2. **Is the lesson's difficulty appropriate for its mapped questions?**
   - D1 questions should map to lessons with simple, foundational
     explanations
   - D3 questions can map to lessons with advanced techniques
   - A D1 lesson shouldn't be the only support for D3 questions
   - Yes = difficulty levels are compatible

3. **Does the lesson-to-question progression follow scaffolding?**
   - The lesson should teach the concept before the child encounters
     the question
   - The question should be a natural application of what was taught
   - A child who understood the lesson should be equipped to attempt
     the question
   - Yes = lesson genuinely prepares the child for the question

4. **Are all questions in this group testing the same sub-skill?**
   - Questions mapped to the same lesson should test the same method
   - If question A tests finding percentages and question B tests
     percentage increase, they probably need different lessons
   - Yes = questions in the mapping group are cohesive

5. **Does the question require only the skill its lesson teaches?**
   - A question needing two skills (e.g., metres-to-km AND
     minutes-to-hours) but mapped to a single-skill lesson
     leaves the child unsupported on the second skill
   - Yes = the lesson covers all skills the question requires
   - No = the question is a dual/multi-skill question mapped to a
     single-skill lesson

## Anchored Examples

### Pass — Good alignment

**Mapping:** Lesson "building-block percentages" → Q7, Q19, Q23
(all "find X% of Y" questions)
- Lesson teaches: find 10% by dividing by 10, find 1% by dividing
  by 100, combine building blocks for any percentage
- Q7: "Find 35% of 420" — uses the building-block method
- Q19: "Find 8% of £650" — uses 1% building block
- Q23: "Find 45% of 360" — uses 10% and 5% building blocks
- **Verdict: Pass** — lesson teaches the exact method needed, all
  questions test the same sub-skill.

### Fail — Wrong method mapped

**(From real audit — percentages):** 29 questions mapped to
"master-building-block-percentages" which has no lesson content
(`[No lesson found]`).
- Questions are "find X% of Y" problems requiring the building-block
  method
- A child in focused learning gets these questions with zero teaching
- **Verdict: Fail (high)** — orphan mapping with no lesson. Fix: create
  the lesson or remap to the existing "building-percentages" sub-concept.

### Fail — Difficulty mismatch

**Hypothetical:** A D1 introductory lesson on "what is a percentage"
mapped to D3 reverse percentage questions.
- The lesson teaches "50% means 50 out of 100"
- The question asks "After a 20% increase, a price is £96. What was
  the original price?"
- The lesson doesn't equip the child for this question at all
- **Verdict: Fail (high)** — lesson difficulty doesn't match question
  difficulty. The child needs a lesson on reverse percentages.

## Output Format

```
| Lesson | Questions | Issue | Severity | Detail |
|--------|-----------|-------|----------|--------|
| building-percentages | Q7,Q19,Q23 | — | — | Pass (method matches) |
| master-building-block | Q28,Q31,Q36... | No lesson | high | 29 questions mapped to sub-concept with no lesson content |
| intro-percentages | Q112,Q118 | Difficulty mismatch | high | D1 lesson mapped to D3 reverse percentage questions |
| fraction-basics | Q45,Q50,Q55 | Skill mismatch | medium | Lesson teaches simplifying, questions test adding fractions |
```

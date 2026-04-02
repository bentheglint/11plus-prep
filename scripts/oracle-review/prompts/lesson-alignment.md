# Lesson-Question Alignment — Oracle Review Prompt

> **REQUIRED:** Before starting, read `scripts/oracle-review/prompts/SWEEP-RULES.md`.
> Those rules override any conflicting instructions below.

## Scope

**Load:** The target topic's question-lesson mapping from
`public/[subject]-question-lesson-map.json`. Load the mapped lesson
content from `src/microLessons/staging/`. Load the mapped questions
from the relevant data file.

**Also load:** The Oracle's criteria from `research/11plus-oracle.md`
for the skills being tested.

**Load the full lesson menu:** Before reviewing any mappings, load the
complete list of available sub-concepts for the target topic. These
come from two sources:

1. **Master lessons** in `src/microLessons/lessonData.js` — find the
   topic key (e.g., `hiddenWords`, `percentages`) and list every
   sub-concept `id` and `name` in its `subConcepts` array.
2. **Supplementary sub-concepts** in
   `src/microLessons/staging/[topic]-subconcepts.js` — list every
   sub-concept `id` and `name` exported in the file.

Combine both lists into a single **Available Sub-Concepts** menu for
the topic. This is the Oracle's authoritative reference for which
lessons exist. When recommending a remap, the Oracle MUST pick from
this menu — never invent a sub-concept ID that doesn't appear here.

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

## When a Mapping Is Wrong — Remapping Protocol

If any check above fails, the Oracle MUST recommend a specific fix
using the **Available Sub-Concepts** menu loaded earlier:

1. **Identify the skill the question actually tests.** Read the
   question, its options, and its explanation. What method does a
   child need?
2. **Find the best-fit sub-concept** from the Available Sub-Concepts
   menu. Pick the sub-concept whose teach screen covers the exact
   skill the question requires.
3. **If no sub-concept fits**, flag as "gap — no suitable lesson
   exists" with a description of what lesson would be needed. Do NOT
   invent a sub-concept ID.
4. **Output the remapping** in the structured format below, including
   the question ID, current sub-concept, recommended sub-concept, and
   reasoning.

**Critical rule:** Every remapping recommendation must reference a
sub-concept ID that exists in the Available Sub-Concepts menu. The
Oracle never creates new sub-concept IDs — it maps to what exists or
flags a gap.

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

### Fail — Wrong sub-concept, remap needed

**(From real audit — Hidden Words):** Q135 is a 5-letter hidden word
mapped to `one-three-split`.
- Available sub-concepts include `five-letter-hidden` — "5-Letter
  Hidden Words", which teaches the strategy for longer hidden words
- The `one-three-split` lesson teaches 4-letter word splits only
- A child shown the 1+3 split lesson would learn the wrong technique
  for a 5-letter word
- **Verdict: Fail (high)** — remap Q135 from `one-three-split` to
  `five-letter-hidden`. The 5-letter lesson teaches the scanning
  strategy needed for longer hidden words.

## Output Format

### Section 1: Available Sub-Concepts Menu

List the full menu at the top of every review so it's visible:

```
Available sub-concepts for [topic]:
  [id] — [name] (from lessonData.js or staging)
  [id] — [name]
  ...
```

### Section 2: Alignment Review

```
| Lesson | Questions | Issue | Severity | Detail |
|--------|-----------|-------|----------|--------|
| building-percentages | Q7,Q19,Q23 | — | — | Pass (method matches) |
| master-building-block | Q28,Q31,Q36... | No lesson | high | 29 questions mapped to sub-concept with no lesson content |
| intro-percentages | Q112,Q118 | Difficulty mismatch | high | D1 lesson mapped to D3 reverse percentage questions |
| fraction-basics | Q45,Q50,Q55 | Skill mismatch | medium | Lesson teaches simplifying, questions test adding fractions |
```

### Section 3: Remapping Recommendations

For every question that needs remapping, provide a specific action:

```
| Question | Current Sub-Concept | Recommended Sub-Concept | Reasoning |
|----------|-------------------|------------------------|-----------|
| Q23 | one-three-split | two-two-split | Question splits 2+2 (tOP + EN), not 1+3 |
| Q135 | one-three-split | five-letter-hidden | 5-letter word — needs the 5-letter strategy lesson, not a 4-letter split lesson |
| Q88 | two-two-split | — (gap) | Tests backwards reading but no backwards-hidden lesson exists yet |
```

**Rule:** Every entry in the Recommended column must either be a
sub-concept ID from the Available Sub-Concepts menu (Section 1) or
`— (gap)` with a description of what's missing.

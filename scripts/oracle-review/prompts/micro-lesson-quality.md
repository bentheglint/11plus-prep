# Micro-Lesson Quality — Oracle Review Prompt

## Scope

**Load:** The target topic's lessons from the staging file in
`src/microLessons/staging/`. Also load the question-lesson mapping
from `public/[subject]-question-lesson-map.json` and the mapped
questions from the relevant data file.

**Also load:** The Oracle's criteria from `research/11plus-oracle.md`
for the skills being taught. Read `src/microLessons/PLAYBOOK.md` for
the lesson structure conventions.

**Review:** Each lesson's 5 screens (intro, hook, teach, interact,
consolidate). Check that the lesson teaches the right method, engages
the child, and scaffolds effectively.

**Pre-filter (run first):** Before judgement review, check mechanically:
- All 5 screen types present per lesson
- Teach screen has non-empty bodyParts content
- Teach screen has `allRevealed: false` (Playbook requires tap-to-reveal
  on teach screens — `allRevealed: true` reduces engagement)
- Interact screen uses an interactive visual component
- Visual component props are non-empty
Flag any structural failures before proceeding to quality checks.

## Binary Checklist

For each lesson, answer these Yes/No:

1. **Does the teach screen cover the specific method needed?**
   - Not just the general topic — the exact method for its mapped
     questions
   - E.g., a lesson mapped to "find X% of Y" questions must teach the
     building-block method (find 10%, find 1%, combine), not just
     "percentages are parts of 100"
   - Yes = teach screen covers the method a child needs to answer its
     mapped questions

2. **Does the hook engage using something relatable?**
   - Connected to a child's real experience (shopping, sports, games)
   - Not abstract, dry, or adult-oriented
   - Yes = a 10-year-old would find the hook interesting or fun

3. **Does the interact screen require genuine thinking?**
   - The child must do something — select, calculate, arrange, decide
   - Not just "click next" or passive reading
   - Yes = the child actively engages with the concept

4. **Does the consolidation reinforce the specific method?**
   - Summarises the key technique, not just the general topic
   - E.g., "Remember: to find a percentage, start with 10% by dividing
     by 10" — not "Percentages are useful in everyday life"
   - Yes = consolidation reinforces the actionable method

5. **Does the scaffolding progress logically?**
   - intro → hook → teach → interact → consolidate should build on
     each other
   - The interact screen should apply what the teach screen taught
   - The consolidation should reference what was practised
   - Yes = screens flow as a coherent learning sequence

6. **Are visual component props correct?**
   - Labels, values, and representations in visual components match
     the content being taught
   - E.g., a FunctionMachine component shows the right operation
   - Yes = visuals are accurate

7. **Is the method consistent with other topics teaching the same skill?**
   - If fractions and ratio both teach equivalent fractions, do they
     use the same approach?
   - Yes = no conflicting methods across topics (or N/A if unique skill)

8. **Does the lesson teach the same method regardless of variable set?**
   - Some lessons use conditional content per variable set, rendering
     different teach/interact screens depending on which set is selected
   - If the method changes between variable sets, the lesson is really
     multiple lessons — a child may only see one variant
   - Yes = method is consistent across all variable sets (or N/A if
     lesson has only one set)

## Anchored Examples

### Pass — Effective lesson

**Percentages > Building-block method:**
- **Hook:** "Imagine you're in a shop and everything is 35% off.
  How would you work out the discount?"
- **Teach:** Shows step-by-step: find 10% (divide by 10), find 5%
  (halve 10%), combine for 35%. Uses FunctionMachine visual.
- **Interact:** Child calculates 35% of £80 using the building blocks,
  selecting 10% first, then combining.
- **Consolidate:** "The building-block trick: find 10% and 1%, then
  build up any percentage from those."
- **Verdict: Pass** — specific method, relatable hook, active practice,
  clear summary.

### Fail — Weak lesson

**Percentages > General overview (hypothetical):**
- **Hook:** "Percentages are used in many areas of mathematics."
- **Teach:** "A percentage means 'out of 100'. 50% means 50 out of 100."
- **Interact:** Shows a pie chart with "50% shaded". Child clicks next.
- **Consolidate:** "Percentages are very important to understand."
- **Verdict: Fail** — hook is abstract (not relatable), teach doesn't
  cover a method (just a definition), interact is passive (no thinking),
  consolidation is vague (no actionable technique). A child who sees
  this lesson still can't solve "find 35% of 420".

## Output Format

```
| Lesson | Screen | Issue | Severity | Detail |
|--------|--------|-------|----------|--------|
| pct-building-block | — | — | — | Pass (all checks) |
| pct-overview | hook | Abstract | medium | No relatable context — "used in many areas" is dry |
| pct-overview | teach | No method | high | Teaches definition only, not a calculation technique |
| pct-overview | interact | Passive | high | Pie chart with click-next — no genuine thinking required |
| pct-overview | consolidate | Vague | medium | "Very important" — no specific technique reinforced |
```

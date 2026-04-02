# Question Wording & Ambiguity — Oracle Review Prompt

> **REQUIRED:** Before starting, read `scripts/oracle-review/prompts/SWEEP-RULES.md`.
> Those rules override any conflicting instructions below.

## Scope

**Load:** The target topic's questions from the relevant data file.

**Also load:** The Oracle's format specifications from
`research/11plus-oracle.md` for the question type being reviewed.

**Review:** Every question's `question` text, `options` array, and
`correct` index. Check that exactly one answer is defensible and the
question cannot be misread.

**Note:** This is the hardest area to make repeatable. When in doubt,
flag as "borderline" rather than definitively pass or fail. The
anchored examples below set the bar for what counts as ambiguous.

## Binary Checklist

For each question, answer these Yes/No:

1. **Is there exactly one defensible correct answer?**
   - Could a knowledgeable child reasonably argue for a different
     option? If yes, the question is ambiguous.
   - Yes = only one answer is defensible

2. **Are units, context, and constraints explicitly stated?**
   - Maths: units specified, what to calculate is clear
   - English: answer depends on passage content, not outside knowledge
   - VR: relationship type is unambiguous
   - Yes = all necessary information is given

3. **Is the question free of unclear pronoun references?**
   - "He gave it to them" — who is "he"? what is "it"?
   - Yes = all references are clear

4. **Can the question be read only one way?**
   - No double meanings, no ambiguous word order
   - "Find the difference between 8 and 3" is clear
   - "What is left after taking 3 from 8?" is clear
   - Yes = only one reasonable interpretation

5. **For passage-based questions: is the answer in the passage?**
   - The answer should be findable or inferable from the passage
   - Not dependent on general knowledge or opinion
   - Yes = passage contains the information needed

## Anchored Examples

### Pass — Clear, unambiguous question

**VR Antonyms:** "Find one word from each group that are the most
opposite in meaning. (brave, strong, bold) (weak, cowardly, small)"
- Correct pair: brave/cowardly
- No other pairing is defensible as antonyms
- **Verdict: Pass** — exactly one correct answer

### Fail — Ambiguous question

**VR Antonyms (from real audit):** "Find one word from each group
that are the most opposite in meaning. (rough, hard, tough)
(easy, smooth, gentle)"
- Intended: rough/smooth
- But "hard/easy" and "tough/gentle" are both defensible antonym pairs
- A child who picks hard/easy has a legitimate argument
- **Verdict: Fail** — multiple defensible correct answers. Fix: change
  sets so only one pairing works, or specify a context that
  disambiguates.

### Fail — Missing context

**Maths (hypothetical):** "Calculate the area."
- Area of what? No shape specified, no dimensions given
- **Verdict: Fail** — missing critical information

## Output Format

```
| Q ID | Issue | Severity | Detail |
|------|-------|----------|--------|
| Q45  | Multiple defensible answers | critical | Both "rough/smooth" and "hard/easy" are valid antonym pairs |
| Q12  | Missing units | medium | Question asks "how far" but doesn't specify km or miles |
| Q88  | Ambiguous pronoun | medium | "He passed it to his friend" — which character is "he"? |
```

**Severity for ambiguity issues:**
- **critical** — more than one answer is genuinely defensible
- **high** — answer is technically unique but wording will confuse
  careful readers
- **medium** — minor ambiguity that most children would navigate
- **low** — very slight wording improvement possible

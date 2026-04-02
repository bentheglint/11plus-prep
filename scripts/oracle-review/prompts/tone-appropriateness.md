# Tone & Age-Appropriateness — Oracle Review Prompt

## Scope

**Load:** The target topic's questions (explanations), lessons
(all 5 screens), and any child-facing text from the relevant data
and staging files.

**Also load:** The 5 warmth principles from the project conventions
and `research/exam-psychology-wellbeing.md` for guidance on
supportive learning environments.

**Review:** All child-facing text. This is primarily a one-time sweep
per topic — tone rarely regresses unless content is substantially
rewritten. Spot checks only needed when explanations or lessons are
rewritten from scratch.

**Note:** This audit area is less about finding "bugs" and more about
ensuring the overall tone supports a 10-year-old's confidence and
engagement. Flag patterns, not one-off minor issues.

## Binary Checklist

For each piece of child-facing text, answer these Yes/No:

1. **Is the language suitable for a 10-11 year old?**
   - Year 5-6 reading level for instructional text
   - Technical terms are fine when teaching them (that's the point)
   - But meta-language and instructions should be accessible
   - Yes = a 10-year-old could read and understand this

2. **Is the tone encouraging without being patronising?**
   - "Well done!" is encouraging. "Super duper amazing job!" is
     patronising for a 10-year-old.
   - Treats the child as capable and intelligent
   - Doesn't talk down or over-simplify emotional responses
   - Yes = tone is appropriately encouraging

3. **Does it follow the 5 warmth principles?**
   - **Conversational:** reads like a friendly tutor, not a textbook
   - **Relatable:** uses examples from a child's world
   - **Curious:** sparks interest ("Have you ever wondered...")
   - **Encouraging:** builds confidence ("You can work this out...")
   - **Relevant:** connects to real life or the exam
   - Yes = at least 2-3 warmth principles are evident

4. **Is it free of anxiety-inducing language?**
   - No "you must", "don't get this wrong", "this is really hard",
     "most children fail this", "be very careful"
   - Challenge is fine ("this is a tricky one!") — threat is not
     ("if you don't know this, you'll fail the exam")
   - Yes = language builds confidence, not anxiety

5. **Is it in British English with UK cultural context?**
   - Spellings: colour, favourite, recognise, practise (verb)
   - Currency: £, not $
   - Units: metres, kilometres, litres (not feet, miles, gallons)
   - Names and contexts: British names, UK settings (school, high
     street, park)
   - Yes = consistently British English and UK context

## Anchored Examples

### Pass — Good tone

**Explanation:** "To find the area of this shape, break it into two
rectangles. Calculate each one separately, then add them together.
It's like splitting a tricky puzzle into easier pieces! The first
rectangle is 8 × 3 = 24 cm². The second is 5 × 2 = 10 cm². So the
total area is 24 + 10 = 34 cm². ✓"

- Conversational ("It's like splitting a tricky puzzle")
- Encouraging (frames difficulty as a puzzle, not a problem)
- Relatable (puzzle metaphor)
- Accessible language
- British English (cm²)
- **Verdict: Pass**

### Fail — Anxious / clinical tone

**Explanation (hypothetical):** "You must remember the formula for
area of a rectangle: length × width. Failure to apply this correctly
will result in an incorrect answer. The area is 24 cm²."

- "You must" — anxiety-inducing
- "Failure to apply" — threatening
- Clinical/textbook tone — not conversational
- No warmth principles evident
- **Verdict: Fail** — rewrite in a warmer, more encouraging style.

### Fail — Patronising tone

**Lesson hook (hypothetical):** "Wow!! Amazing!! Today we're going
to learn about the SUPER EXCITING world of fractions!! You're going
to be a FRACTIONS SUPERSTAR!!! 🌟🌟🌟"

- Over-the-top enthusiasm is patronising for a 10-year-old
- Multiple exclamation marks and emojis feel childish
- Doesn't treat the child as capable and intelligent
- **Verdict: Fail** — tone down to genuine, calm encouragement.

## Output Format

```
| Source | Item | Issue | Severity | Detail |
|--------|------|-------|----------|--------|
| explanation | Q42 | Anxiety language | medium | "Be very careful not to make a mistake here" |
| lesson | pct-intro hook | Patronising | medium | Excessive exclamation marks and "SUPERSTAR" language |
| explanation | Q88 | US English | low | "color" should be "colour", "$" should be "£" |
```

**Also report overall tone assessment:**
```
Topic: [name]
Items reviewed: [count]
Overall tone: Warm and appropriate / Mixed / Needs attention
Patterns: [any recurring issues across multiple items]
Priority fixes: [top 3 items to address first]
```

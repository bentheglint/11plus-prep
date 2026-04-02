# Passage Quality — Oracle Review Prompt

## Scope

**Load:** The comprehension topic from `src/questionData/englishData.js`.
Questions with `passageId`, `passageTitle`, and `passage` fields form
the passage-based content. Group questions by `passageId` to review
each passage and its question set together.

**Also load:** The Oracle's reading comprehension criteria from
`research/11plus-oracle.md` and the topic deep-dive at
`research/gl-topic-research/reading-comprehension.md`.

**Review:** Each passage and its associated questions as a unit.
Check reading level, content diversity, and whether questions test
genuine comprehension.

**Pre-filter already done:** Part 1 checks passage word counts,
question counts per passage (6-8 target), and question subtype
distribution mechanically. Focus on qualitative aspects.

## Binary Checklist

### Per passage:

1. **Is the reading level appropriate for 10-11 year olds?**
   - Year 5-6 vocabulary and sentence complexity
   - Some challenging words are fine (tests vocabulary in context)
     but the passage overall should be accessible
   - Not so simple a Year 3 child could read it effortlessly
   - Yes = reading level is Year 5-6 appropriate

2. **Is the content age-appropriate and engaging?**
   - Topics a 10-11 year old would find interesting or at least
     not alienating (nature, adventure, sport, history, science, food,
     school, animals, inventions)
   - No adult themes, violence, or culturally insensitive content
   - Yes = content is suitable and reasonably engaging

3. **Does the passage contain enough information to answer all its questions?**
   - Every question's answer should be findable or inferable from
     the passage text
   - No questions that require outside knowledge or opinion
   - Yes = passage is self-contained for its questions

### Per question (within passage):

4. **Does the question reference text that actually appears in the passage?**
   - GL comprehension questions always reference words, phrases, or
     sentences from the passage itself
   - Questions that use fabricated sentences (e.g., word-class questions
     with invented example sentences) break the GL format
   - Yes = all quoted text in the question comes from the passage

5. **Does the question test a genuine comprehension skill?**
   - Retrieval: answer is stated in the passage
   - Inference: answer requires reading between the lines
   - Vocabulary-in-context: meaning of a word as used in the passage
   - Not just memory ("what colour was the dog?" when colour is
     incidental and not meaningful)
   - Yes = the question tests comprehension, not recall of trivia

6. **Does the question subtype match what it claims?**
   - A question tagged "inference" should genuinely require inference
   - A question tagged "retrieval" should have a directly stated answer
   - Yes = subtype tag is accurate

### Across all passages:

7. **Is there content diversity across the passage set?**
   - Mix of fiction and non-fiction
   - Varied topics (not all nature, not all history)
   - Different cultural contexts represented
   - Yes = reasonable diversity (check across the full passage set,
     not per individual passage)

## Anchored Examples

### Pass — Strong passage + questions

**"The Peculiar Museum"** (fiction, ~600 words):
- Reading level: Year 5-6 (descriptive vocabulary, varied sentence
  structure, some figurative language)
- Content: child visits an unusual museum — engaging, age-appropriate
- Questions test: retrieval (what did the character find?), inference
  (why did the curator smile?), vocabulary-in-context ("peculiar" as
  used in paragraph 2)
- All answers findable in the passage
- **Verdict: Pass**

### Fail — Weak questions for a passage

**"Hedgehog Habitats"** (non-fiction, ~500 words):
- Passage is fine (informative, age-appropriate)
- But all 6 questions are retrieval: "What do hedgehogs eat?",
  "Where do hedgehogs live?", "When do hedgehogs hibernate?"
- No inference, no vocabulary-in-context, no author-purpose questions
- **Verdict: Fail (medium)** — passage is good but questions don't
  test the full range of comprehension skills. Add inference and
  vocabulary questions.

### Fail — Answer not in passage

**Hypothetical:** "The Solar System" passage discusses Mars and Jupiter.
Question: "How many moons does Saturn have?"
- Saturn isn't mentioned in the passage
- **Verdict: Fail (critical)** — requires outside knowledge. The
  passage doesn't contain the information needed to answer.

## Output Format

```
| Passage | Issue | Severity | Detail |
|---------|-------|----------|--------|
| peculiar-museum | — | — | Pass |
| hedgehogs | Question type imbalance | medium | All 6 questions are retrieval — no inference or vocabulary |
| solar-system | Q4 answer not in passage | critical | Saturn not mentioned, question requires outside knowledge |
```

**Also report overall diversity:**
```
Fiction: 35/59 passages (59%)
Non-fiction: 24/59 passages (41%)
Topic spread: nature (12), adventure (8), history (7), science (6), ...
Assessment: Reasonable diversity / Needs more [genre/topic]
```

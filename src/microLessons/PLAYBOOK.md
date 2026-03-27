# Micro-Lesson Playbook

A repeatable process for building micro-lessons for any topic. Reference this document each time we add a new topic to the lesson bank.

---

## The Process (4 phases)

### Phase 1: Research
Before writing a single lesson, understand how this topic is taught in UK schools.

1. **Identify the KS2 curriculum progression** — What methods/concepts are taught, in what order, from Year 3–6?
2. **List all sub-concepts** — Break the topic into the smallest teachable units. If you can't explain a sub-concept in one sentence, split it further.
3. **Identify common mistakes** — What do children typically get wrong? Each mistake is a spot-the-mistake lesson waiting to happen.
4. **Check our existing questions** — Look at the questions in App.js for this topic. What skills do they test? The lessons should prepare children for those exact skills.
5. **Decide category weighting** — Which sub-concepts are the "core method" (highest weight), which are "supporting methods", and which are "other" (estimation, checking, word problems)?

### Phase 2: Plan Visual Components
Before writing lesson content, decide what visual components are needed.

1. **Check existing components** — Can WorkedExample, GridModel, ColumnMethod, NumberLine, BarModel, or PlaceValueChart handle this topic?
2. **Design new components if needed** — Sketch the layout, define props, build in `visuals.js` first.
3. **Every screen must have a visual** — No `visual: null`. If a screen doesn't need a specialised component, use WorkedExample with clear steps.

### Phase 3: Write Lessons
Follow the structure below for every lesson.

### Phase 4: Test with Real Users
Deploy and test with children before considering a topic "done". They find things we never will.

---

## Lesson Structure (5 screens)

Every lesson follows this flow. No exceptions.

| Screen | Purpose | Interaction | Duration |
|--------|---------|-------------|----------|
| **Intro** | Set expectations: topic, sub-concept, learning goals | None (auto-generated) | ~5 sec |
| **Hook** | Spark curiosity or set context with a scenario | None | ~10 sec |
| **Teach** | Show the method step-by-step | Tap-to-reveal | ~30 sec |
| **Interact** | Test understanding with a question | Multiple-choice (5 options) | ~20 sec |
| **Consolidate** | Summarise as a memorable "recipe" | None | ~10 sec |

### Intro Screen (auto-generated)
- Shows topic name, sub-concept name, and `learningGoal` bullets
- Generated automatically from lesson data — no screen object needed
- Button says "Let's go!"

### Hook Screen
- **Scenario-based**: Use a real-world UK context (school, shop, bakery, garden, cinema, etc.)
- **Question-framed**: Title should be a question or challenge, e.g. "Can you work out 36 × 24?"
- **Visual**: Show the problem visually but don't reveal the answer yet
- **No interaction**: This is just to get the child thinking

### Teach Screen
- **Step-by-step**: Break the method into 3–5 clear steps
- **Tap-to-reveal**: Steps are hidden and revealed one at a time
- **Each step has a "why"**: Not just "do this" but "do this because..."
- **Visual component**: Should show the working being built up
- **Language**: Write for a 10-year-old. Short sentences. Bold key terms.

### Interact Screen
- **Multiple-choice**: Always 5 options (1 correct + 4 plausible distractors)
- **Use `generateDistractors()`**: For numerical answers, this creates nearby wrong answers
- **For non-numerical answers**: Hand-craft the wrong options to reflect common mistakes
- **Feedback**: Both correct and incorrect feedback must explain the answer
- **Visual**: Show the working/context so the child can refer back to it

### Consolidate Screen
- **Recipe format**: "Here's how to do this every time" with numbered steps
- **Use WorkedExample**: 3–4 steps showing the repeatable method
- **Each step has a "why"**: Reinforces understanding, not just memory
- **Memorable**: The child should be able to recall these steps during the quiz

---

## Template Types

Each sub-concept should have **2 lessons** using different template types. This ensures variety.

| Template Type | Best For | Hook Style | Teach Style |
|--------------|----------|------------|-------------|
| **step-by-step** | Core methods | "Let's work through this" | Sequential steps with tap-to-reveal |
| **spot-the-mistake** | Common errors | "Can you spot the mistake?" | Show wrong working, then correct it |
| **curiosity-hook** | Building intuition | "What would you do?" | Discover the method through a scenario |
| **visual-discovery** | Pattern recognition | "What do you notice?" | Reveal a pattern visually |
| **key-fact** | Rules and shortcuts | "Is there a shortcut?" | Show the rule with examples |

### Recommended pairing per sub-concept:
- Core method sub-concepts: **step-by-step** + **spot-the-mistake**
- Pattern/shortcut sub-concepts: **visual-discovery** + **key-fact**
- Applied sub-concepts (word problems): **curiosity-hook** + **spot-the-mistake**

---

## Sub-Concept Design Rules

### One concept per sub-concept
If you're teaching "how to add fractions with different denominators", that's ONE sub-concept — not "adding fractions" which tries to cover same denominators, different denominators, and mixed numbers in one go.

**Test**: Can you explain this sub-concept in one sentence a 10-year-old would understand? If not, split it.

### The Master Method

Every topic must have exactly **one Master Method** — the primary method taught in UK schools for that topic. This is the single most important lesson per topic.

| Aspect | Requirement |
|--------|-------------|
| **What it teaches** | The standard written method children are expected to use in exams |
| **Clarity** | So clear that a 5-year-old could follow it — painfully step-by-step |
| **Variable sets** | 7 (different UK contexts and numbers, same template) |
| **Screens** | 5–6 (longer than regular lessons — more steps, more diagrams) |
| **Category** | `"master"` |
| **Selection weight** | 25% — shown every 4th click on average |
| **Diagrams** | Interleaved with text using `bodyParts` — a diagram appears between every calculation step |
| **Highlighting** | Use `highlightBottomDigit`, `highlightStep`, colour, or arrows to show exactly what each step references |

#### Master Method per topic (known so far):
| Topic | Master Method | Visual Component |
|-------|--------------|-----------------|
| Long Multiplication | Standard column method | ColumnMethod |
| Long Division | Bus stop method | BusStopMethod (to build) |
| Fractions | Equivalent fractions / common denominator | BarModel |
| Decimals | Column addition/subtraction of decimals | PlaceValueChart |
| *Others TBD during research phase* | | |

#### bodyParts system
Master Method screens use `bodyParts` instead of a single `body` + `visual`. Each screen has an array of `{ type: 'text', content: fn }` and `{ type: 'visual', component: '...', props: fn }` parts, rendered in sequence. This allows diagrams to appear between individual calculation lines.

```js
// Example: a screen with text → diagram → text → diagram → text
screens: [{
  bodyParts: [
    { type: 'text', content: v => `Intro text` },
    { type: 'visual', component: 'ColumnMethod', props: v => ({ ... }) },
    { type: 'text', content: v => `Calculation explanation` },
    { type: 'visual', component: 'ColumnMethod', props: v => ({ ..., intermediate state }) },
    { type: 'text', content: v => `Result summary` }
  ]
}]
```

#### createMasterVarSet helper
For maths topics, use a helper function that auto-computes all intermediate values from minimal input. This prevents bugs.

```js
function createMasterVarSet({ name, scenario, numA, numB, unit, estimateA, estimateB }) {
  // Auto-computes: partial products, carries, intermediate partials, etc.
  return { name, scenario, numA, numB, unit, partial1, partial2, product, carry1, carry2, ... };
}
```

### Category weighting

When a topic has a Master Method, selection works as:

| Category | Weight | Purpose |
|----------|--------|---------|
| **master** | 25% | The Master Method — shown every 4th click |
| **core** | ~37.5% | Core methods (column, grid, etc.) |
| **supporting** | ~22.5% | Supporting methods |
| **other** | ~15% | Estimation, checking, word problems |

When a topic does NOT have a Master Method yet, the original weights apply:

| Category | Weight | Purpose |
|----------|--------|---------|
| **core** | 50% | The main method(s) children must master |
| **supporting** | 30% | Methods that build up to or support the core |
| **other** | 20% | Estimation, checking, word problems, shortcuts |

Rename categories per topic as appropriate (e.g., for Long Multiplication: "column", "grid", "other"). The weights are set in `selectLesson()`.

### Naming conventions
- Sub-concept IDs: kebab-case, descriptive (e.g., `column-ones`, `short-division`, `equivalent-fractions`)
- Lesson IDs: `{sub-concept}-{template-hint}` (e.g., `column-ones-steps`, `column-ones-mistake`)

---

## Variable Sets

Each lesson needs **minimum 3 variable sets**. This is the scalability engine — write the lesson structure once, generate variety through different variables.

### What varies:
- **Child name**: Use a diverse mix of UK names (Aisha, Ben, Charlie, Daisy, Ella, Finn, Grace, etc.)
- **Scenario/context**: Different real-world situations (bakery, school, cinema, sports shop, garden centre)
- **Numbers**: Different values that exercise the same skill (vary difficulty slightly)
- **Units**: Different countable things (cupcakes, pencils, tickets, chairs, books)

### What stays the same:
- The lesson structure (screens, titles, body text templates)
- The visual component and its layout
- The feedback messages (parameterised with variables)

### Pre-computed values
For mathematical topics, pre-compute all intermediate values in the variable set rather than computing them in template functions. This prevents bugs and makes the data easier to verify.

```js
// GOOD: Pre-computed
{
  numA: 36, numB: 24, product: 864,
  partial1: 144, partial2: 720,
  carry1: [{ col: 1, digit: 2 }]
}

// AVOID: Computed in templates (harder to verify)
{
  numA: 36, numB: 24,
  // product computed as numA * numB in template
}
```

---

## Visual Components Inventory

| Component | What it shows | Used for |
|-----------|--------------|----------|
| **WorkedExample** | Numbered steps with tap-to-reveal | Any step-by-step method; the universal fallback |
| **GridModel** | Multiplication grid/box method table | Partitioning, grid method |
| **ColumnMethod** | Formal column multiplication layout | Short multiplication, long multiplication |
| **NumberLine** | SVG number line with points and jumps | Number sequences, negative numbers, rounding, decimals |
| **BarModel** | Proportional bar segments | Fractions, ratio, percentages |
| **PlaceValueChart** | Column table for place values | Place value, decimals, rounding |
| **AngleDiagram** | SVG triangle/angle diagram | Angles & shapes |
| **BusStopDiagram** | Bus stop division layout | Long division |
| **RectangleDiagram** | Labelled rectangle with dimensions | Area & perimeter |
| **CuboidDiagram** | 3D cuboid with dimension lines | Volume |
| **LShapeDiagram** | L-shaped compound shape | Area & perimeter (compound) |
| **SentenceDisplay** | Sentence with segments, gaps, highlights, or evidence mode | English (all 6 topics), VR synonyms/antonyms/oddTwoOut/verbalAnalogies/logicAndLanguage |
| **LetterTiles** | Scrabble-style letter tiles — word, compound, window, gap, shared modes | VR compoundWords/hiddenWords/letterMove/missingLetters/sharedLetter, spelling, wordCodeAnalogies |
| **AlphabetLine** | SVG A-Z line with hops and EJOTY highlights | VR letterCodes/letterPairSeries/letterSums |
| **CodeTable** | Mapping table (word→code, letter→number) | VR wordCodeAnalogies/numberWordCodes |
| **SequenceChain** | Horizontal term boxes with difference arrows | VR numberSeries/letterPairSeries |

### When to build a new component:
- The topic has a standard visual representation taught in schools (e.g., bus stop method for division)
- WorkedExample can't adequately show the spatial layout of the method
- The visual needs interactive elements (tap cells, reveal steps) that WorkedExample doesn't support

### When WorkedExample is enough:
- The method is purely sequential (step 1, step 2, step 3)
- The visual is supplementary, not the main teaching tool
- The consolidation screen (recipe format)

---

## Language Rules

1. **Write for a 10-year-old** — Short sentences. Simple words. No assumptions about prior knowledge.
2. **Technical terms get a bracket on first use** — "partitioning (splitting into parts)", "the ones digit (the last digit)", "estimate (a rough guess)"
3. **British English throughout** — "colour" not "color", "metres" not "meters", pounds not dollars
4. **Bold key terms** — Use `**bold**` for the most important words in each sentence
5. **Encouraging tone** — "You've got this!", "Brilliant!", "Superstar!" — never "Wrong" or "Bad luck"
6. **Active voice** — "Multiply by the ones digit" not "The ones digit should be multiplied by"
7. **"You" not "we"** — "What do you notice?" not "What do we notice?"

### Feedback messages:
- **Correct**: Enthusiastic prefix + restate the answer + explain why it's right
- **Incorrect**: Gentle prefix + give the right answer + explain the method briefly

Correct prefixes rotate randomly: "Brilliant!", "Superstar!", "Well done!", "Amazing!"
Incorrect prefixes rotate randomly: "Not quite!", "Close!", "Nearly there!", "Have another look!"

---

## The learningGoal Field

Every lesson must have a `learningGoal` array (1–3 strings). These appear on the intro screen as "What you'll learn:" bullets.

### Good learning goals:
- Start with "How to..." or "Why..." or "When to..."
- Specific and concrete: "How to carry digits when multiplying"
- Written in plain English a child can understand

### Bad learning goals:
- Vague: "Understanding multiplication"
- Too technical: "Applying the distributive property"
- Too long: "How to use the standard written method of long multiplication to multiply a 2-digit number by another 2-digit number with carrying"

---

## Quality Checklist

Before considering a topic's lessons complete, verify:

- [ ] **Research done**: All KS2 methods for this topic identified
- [ ] **Master Method identified**: The primary school method, with `category: "master"`
- [ ] **Master Method has 7 variable sets**: Different contexts/numbers, same template
- [ ] **Master Method uses bodyParts**: Diagrams interleaved between every calculation step
- [ ] **Sub-concepts are granular**: Each teaches ONE thing
- [ ] **Category weights set**: Master/core/supporting/other split makes sense
- [ ] **Every lesson has `learningGoal`**: 1–3 clear bullet points
- [ ] **Every lesson has 3+ variable sets**: With diverse names, scenarios, numbers
- [ ] **Every screen has a visual**: No `visual: null`
- [ ] **Teach screens use tap-to-reveal**: Steps hidden until tapped
- [ ] **Interact screens use MC with 5 options**: Using `generateDistractors()` or hand-crafted
- [ ] **Consolidate screens are "recipes"**: Repeatable steps the child can follow
- [ ] **Language is age-appropriate**: No unexplained jargon
- [ ] **Feedback explains the answer**: Both correct and incorrect feedback are helpful
- [ ] **Spot-the-mistake lessons exist**: At least one per core sub-concept
- [ ] **All maths is pre-computed and verified**: No bugs in variable sets
- [ ] **Warmth pass completed**: All 5 principles applied (conversational tone, relatable scenarios, "did you know?" hooks, encouragement, "why should I care?" angles)
- [ ] **Build passes**: `npm run build` with no errors
- [ ] **Tested with real users**: Deployed and used by children

---

## Warmth Pass (5 principles)

After writing lesson content, apply these 5 principles to every screen. The goal is to make lessons **engaging and fun** — not dry and overly academic. A child should feel like they're chatting with a friendly tutor, not reading a textbook.

### 1. Conversational Tone
Write like you're talking to the child, not lecturing them. Lessons should sound natural, warm, and human.

**Too dry:** "The past tense of 'go' is 'went'. The form 'gone' requires an auxiliary verb."
**Conversational:** "On its own, the past of 'go' is **'went'** — 'I went to the shop'. If you want to use 'gone', it needs a helper word: 'I **have** gone'."

- Use contractions ("don't", "it's", "you'll") — they sound more natural
- Use "you" not "one" or "the pupil"
- Short sentences. One idea each. If it has a comma, consider splitting it.
- No unexplained jargon — if a 9-year-old wouldn't know a word, either replace it or add a bracket: "a preposition (a position word like 'in', 'on', 'at')"

### 2. Relatable Scenarios
Every lesson hooks the child in with a scenario they recognise from their own life — school, family, friends, hobbies, trips.

**Too abstract:** "Consider the following sentence with a subject-verb agreement error."
**Relatable:** "Daisy is checking her story before handing it in. Her teacher always circles the same mistake — can you spot it?"

- Use real UK children's names (Daisy, Oliver, Amira, Jake, Priya, Ben, Ella, Grace)
- Set scenarios in places children know: school, home, the park, a shop, swimming, a birthday party
- Make the child the detective/helper: "Can you spot the mistake?", "Which one would you pick?"
- Vary scenarios across variable sets — don't use "school homework" for every one

### 3. "Did You Know?" Hooks
Start lessons with something that makes the child curious or surprised — a fun fact, a common mistake everyone makes, or a "bet you didn't know this" moment.

**Boring hook:** "In this lesson you will learn about Standard English."
**Curious hook:** "Did you know that something you probably say every single day is actually **wrong** in writing? Let's find out what it is!"

- Hooks should make the child WANT to see the next screen
- Use surprise: "Most adults get this wrong too!"
- Use challenge: "Only 1 in 5 children spots this mistake — can you?"
- Use relevance: "This exact question comes up in nearly every 11+ exam"
- Never start with "In this lesson you will learn..." — that's a curriculum document, not a conversation

### 4. Encouragement
The tone should build confidence, not knock it. Every child should feel they CAN do this, even when they get something wrong.

**Correct feedback:** Enthusiastic + restate the answer + explain briefly
- "Brilliant! 'She did' is correct — remember, 'done' always needs a helper word. ✓"
- "Superstar! You spotted the trick — the nearest word to the verb decides! ✓"

**Incorrect feedback:** Gentle + give the right answer + explain without blame
- "Not quite! The answer is 'me' — after words like 'between' and 'for', always use 'me' not 'I'."
- "Nearly there! 'Were' is right here because 'they' means more than one person."

**Never use:**
- "Wrong!" / "Incorrect!" / "Bad luck!"
- "Obviously..." / "Simply..." / "As you should know..."
- Anything that makes the child feel stupid for getting it wrong

**Consolidation screens** should make the child feel proud: "You've got this!", "You're a proofreading pro!", "Tricky agreement — mastered!"

### 5. "Why Should I Care?" Angles
Children switch off when they can't see why something matters. Every lesson should connect the grammar/spelling/vocab rule to something the child actually cares about.

**No reason given:** "The subjunctive uses 'were' instead of 'was' after 'if'."
**With motivation:** "This is one of the sneakiest questions in the 11+ exam — most children pick 'was' because it sounds right, but the examiners are testing whether you know the special rule. Get this right and you'll pick up marks that others miss!"

Ways to connect:
- **Exam relevance:** "This comes up in nearly every GL paper" / "This is worth easy marks"
- **Real-world impact:** "Getting this right makes your writing sound really polished"
- **Competitive edge:** "Most children get this wrong — now you won't!"
- **Grown-up skill:** "Even lots of adults make this mistake — you'll know better than them!"
- **Pattern recognition:** "Once you spot this trick, you'll see it everywhere"

The child should finish every lesson thinking "I'm glad I know that" — not "when will this be over?"

---

## Scaling Roadmap

### Topics still needing micro-lessons:

| Priority | Topic | Likely visual components needed |
|----------|-------|-------------------------------|
| HIGH | Long Division | New: BusStopMethod (long division layout) |
| HIGH | Decimals | PlaceValueChart, NumberLine |
| HIGH | Fractions | BarModel, WorkedExample |
| MEDIUM | Percentages | BarModel, WorkedExample |
| MEDIUM | Ratio & Proportion | BarModel, WorkedExample |
| MEDIUM | Algebra | WorkedExample, NumberLine |
| MEDIUM | Place Value & Rounding | PlaceValueChart, NumberLine |
| LOW | Negative Numbers | NumberLine |
| LOW | Prime Numbers & Factors | WorkedExample |
| LOW | Area & Perimeter | New: ShapeDiagram (or SVG-based) |
| LOW | Volume | New: ShapeDiagram (3D) |
| LOW | Angles & Shapes | New: AngleDiagram (or SVG-based) |
| LOW | Sequences | NumberLine, WorkedExample |
| LOW | Data Handling | New: ChartVisual (bar/pie charts) |
| LOW | Speed, Distance, Time | WorkedExample, NumberLine |

### Estimated effort per topic:
- **With existing visual components**: ~2 hours (research + write lessons)
- **With 1 new visual component**: ~4 hours (build component + research + write lessons)
- **Complex topics (many sub-concepts)**: ~6 hours

---

## File Structure Reference

```
src/microLessons/
  lessonData.js      — All lesson content + selectLesson() algorithm
  MicroLessonScreen.js — The lesson renderer (handles all screen types)
  visuals.js         — All visual components (GridModel, WorkedExample, etc.)
  PLAYBOOK.md        — This file
```

### Adding a new topic:
1. Add a new key to `lessonBank` in `lessonData.js` (e.g., `longdivision: { ... }`)
2. Add sub-concepts with `category` field
3. Add lessons with `learningGoal`, `templateType`, `variableSets`, and `screens`
4. If needed, build new visual components in `visuals.js` and register them in `MicroLessonScreen.js`
5. Update `selectLesson()` category weights if the default 50/30/20 doesn't fit

---

*Last updated: February 2026 — after Master Method pattern established (Long Multiplication complete)*

# Diagram-Question Consistency — Oracle Review Prompt

> **REQUIRED:** Before starting, read `scripts/oracle-review/prompts/SWEEP-RULES.md`.
> Those rules override any conflicting instructions below.

## Scope

**Load:** The target topic's questions that have an `image` field
(filter questions where `image` is truthy). Load from the relevant
data file (`src/questionData/mathsData.js`).

**Also load:** The corresponding SVG files from
`public/images/questions/[topic-folder]/`. Read the SVG source to
extract text elements (numbers, labels, units).

**Review:** Each question-diagram pair. Check that SVG values match
the question text and the diagram type is correct.

**Pre-filter (run first):** For each question with an `image` field:
1. Does the SVG file exist at the referenced path?
2. Extract all `<text>` elements from the SVG
3. Extract all numbers from the question text
4. Flag any obvious mismatches for Oracle review
The Oracle only needs to review flagged items and complex diagrams
where mechanical parsing can't determine correctness.

## Binary Checklist

For each question-diagram pair, answer these Yes/No:

1. **Do all numerical values in the SVG match the question?**
   - Every number visible in the diagram should appear in or be
     derivable from the question text
   - E.g., if the question says "a cuboid with length 8cm, width 5cm,
     height 3cm" — the SVG should show 8, 5, and 3 (not 8, 5, 4)
   - Yes = all numbers match

2. **Is the shape/type in the diagram correct?**
   - Question says "cuboid" → diagram shows a cuboid (not a cube)
   - Question says "bar chart" → diagram is a bar chart (not a pie)
   - Yes = diagram type matches the question

3. **Are labels readable and unambiguous?**
   - Text is large enough to read (not overlapping other elements)
   - Units are shown where needed (cm, m, kg, etc.)
   - Dimension lines point to the correct edges
   - Yes = all labels are clear

4. **Are dimension lines correctly placed?**
   - Per `diagram-rules.md`: length = bottom horizontal, height = left
     vertical, width = bottom-right angled (for 3D)
   - Lines don't overlap with the shape or other labels
   - Yes = dimension lines follow the conventions

5. **Does the "unknown" value display correctly (if applicable)?**
   - Missing dimensions should show "? cm" in red
   - The `missingDim` prop should match what the question asks to find
   - Yes = unknown value is correctly indicated (or N/A)

6. **Does the diagram follow the topic's established visual conventions?**
   - Consistent colour scheme (e.g., lightskyblue/lightcyan/skyblue for
     Volume cuboids)
   - Consistent dimension line style (grey with tick marks vs red with
     arrowheads — should match other diagrams in the same topic)
   - Consistent viewBox size unless complexity requires a larger canvas
   - Yes = visual language matches the rest of the topic

## Anchored Examples

### Pass — Correct diagram

**Volume Q19:** "Find the volume of a cuboid with length 6cm, width
4cm, and height 3cm."
- SVG shows a 3D cuboid with labels: 6 cm (bottom), 4 cm (right
  angled), 3 cm (left vertical)
- All three values match the question text
- Dimension lines correctly placed per conventions
- **Verdict: Pass**

### Fail — Mismatched values

**Volume (hypothetical):** "Find the volume of a cuboid with length
8cm, width 5cm, and height 6cm."
- SVG shows: 8 cm, 5 cm, 4 cm (height is 4, not 6)
- Child calculates 8 × 5 × 4 = 160 instead of 8 × 5 × 6 = 240
- Gets the "wrong" answer because the diagram is wrong
- **Verdict: Fail (critical)** — diagram teaches incorrect information.
  Fix: update SVG height label to 6 cm.

### Fail — Wrong shape type

**Area & Perimeter (hypothetical):** "Find the area of this
L-shaped garden."
- SVG shows a simple rectangle (not an L-shape)
- **Verdict: Fail (high)** — diagram doesn't match the shape described
  in the question.

## Output Format

```
| Q ID | Image | Issue | Severity | Detail |
|------|-------|-------|----------|--------|
| Q19  | cuboid-q19.svg | — | — | Pass (values match) |
| Q45  | cuboid-q45.svg | Value mismatch | critical | Height shows 4cm, question says 6cm |
| Q78  | rectangle-q78.svg | Wrong shape | high | Question describes L-shape, diagram is rectangle |
| Q92  | cuboid-q92.svg | Label overlap | low | Width label overlaps front face edge |
```

# Diagram Design Tokens

Single source of truth for all SVG diagram styling in the 11+ app.
Every diagram MUST reference these tokens.

> ## ⚠️ CORRECTED 23 Jul 2026 — READ THIS FIRST
>
> The blue palette below (`#3b82f6`, `#93c5fd`, `#bfdbfe`, `#6366f1` as
> "labelColour", `#dc2626` for unknowns) was **wrong**, and it caused two new
> components to be built in a style foreign to the app before Ben caught it.
>
> Two things were wrong with it:
>
> 1. **It contradicted `SKILL.md`.** That file's own Colour Consolidation Map
>    lists `#3b82f6`, `#93c5fd` and `#bfdbfe` as colours to REPLACE. Following
>    this file therefore meant violating the skill.
> 2. **It didn't match the app.** `#7C3AED` appears 932 times in `src/`,
>    `#EDE8FF` 123, `#A29BFE` 109. The app is purple. Diagrams built blue look
>    like they belong to a different product.
>
> Note `SKILL.md`'s stated targets are ALSO not reality: `#6C5CE7`, `#2D3436`,
> `#636E72` and `#00B894` appear **zero** times in `src/`. They were proposed
> and never adopted.
>
> ### The actual rule
>
> **`AngleDiagram` is the reference. Match it.** When any guidance conflicts,
> the reference component wins — it is what the app really looks like.
>
> | Role | Value | Where |
> |---|---|---|
> | In-SVG primary (outlines, axes, structural lines) | `#6366f1` | shape strokes |
> | Shape fill | `#f0f0ff` | soft lavender, one fill per figure |
> | Element accents (tie a label to the thing it names) | `#818cf8`, `#38bdf8`, `#34d399` | labels + their element |
> | Unknown / withheld value | `#9ca3af` with "?" | NOT red — red reads as "wrong" |
> | Secondary text (ticks, captions) | `#64748b` | |
> | Grid / hairlines | `#E5E7EB` | |
> | Surface | `#FAFBFF` | |
> | Body text | `#1e293b` | |
> | Caption BELOW the figure (HTML, not SVG) | `#7C3AED` | `totalLabel` convention |
>
> ### The feel, not just the palette
>
> - **One** soft fill per figure. Distinguish elements by STROKE colour, never
>   by different fills — mixed fills go muddy where they overlap.
> - A label takes the colour of the element it describes.
> - Generous padding, sized so labels can sit OUTSIDE a shape with room.
> - If a label can't sit clear, move it out and draw a **leader line**
>   (dashed `3,2`, opacity `0.6`, in the element's colour).
> - Supplementary text goes BELOW the SVG as HTML — never inside the figure.
> - No titles inside the diagram; the question text supplies the context.
>
> Verify with `scripts/validation/diagram-qa-probe.js`, which checks text-on-
> shape collisions (not just text-on-text), viewBox escapes, minimum sizes and
> palette conformance. Text-on-text alone is NOT sufficient — that check passed
> a Venn whose captions sat directly on the circle outlines.

**Derived from:** the React visual components (RectangleDiagram,
AngleDiagram, PieChart, TwoWayTable) which render the diagrams
that Ben has approved as looking "fresh, bright and engaging".

**Good examples:** Angles Q23/Q142, Area-Perimeter Q196/Q197, Data Handling Q12
**Bad examples:** Fractions Q1/Q2, Ratio Q2/Q7, Area-Perimeter Q22/Q27

The bad examples look like scanned worksheets — black outlines, grey text,
pink/orange fills, bold titles. The good examples feel like part of the
app's UI — blue/purple palette, coloured labels, generous whitespace.

---

## Colour Palette

### Shape Colours

| Token | Value | Use |
|-------|-------|-----|
| `shapeFill` | `#bfdbfe` | Shape interior fill (light blue) |
| `shapeStroke` | `#3b82f6` | Shape outline (blue) |
| `shapeStrokeWidth` | `2.5` | Shape outline thickness |
| `shapeCornerRadius` | `4` | Rounded corners on rectangles |

### Dimension Lines & Labels

| Token | Value | Use |
|-------|-------|-----|
| `dimLineColour` | `#6366f1` | Dimension lines, arrows, measurement labels |
| `dimLineWidth` | `2` | Dimension line thickness |
| `dimLabelSize` | `18` | Dimension label font size |
| `dimLabelWeight` | `bold` | Dimension labels are always bold |
| `unknownColour` | `#dc2626` | Unknown/missing values (?, x°) |

### Angle Arc Colours (used in rotation for multi-angle diagrams)

| Index | Token | Value | Name |
|-------|-------|-------|------|
| 0 | `angle1` | `#818cf8` | Soft indigo |
| 1 | `angle2` | `#38bdf8` | Sky blue |
| 2 | `angle3` | `#34d399` | Mint green |
| 3 | `angle4` | `#f97316` | Orange (for 4+ angles) |

### Segment Palette (bar models, pie charts, multi-part diagrams)

| Index | Token | Value | Name |
|-------|-------|-------|------|
| 0 | `segment1` | `#818cf8` | Soft indigo |
| 1 | `segment2` | `#38bdf8` | Sky blue |
| 2 | `segment3` | `#34d399` | Mint green |
| 3 | `segment4` | `#fbbf24` | Warm amber |
| 4 | `segment5` | `#f87171` | Soft coral |
| 5 | `segment6` | `#c084fc` | Lavender |

### Text Colours

| Token | Value | Use |
|-------|-------|-----|
| `labelColour` | `#6366f1` | Primary labels (matches dimension lines) |
| `labelSecondary` | `#64748b` | Secondary/minor labels |
| `unknownColour` | `#dc2626` | Unknown values, "?" markers |
| `textOnShape` | `#1e40af` | Text placed inside filled shapes |

### Feedback Colours (interactive diagrams)

| Token | Value | Use |
|-------|-------|-----|
| `correct` | `#00B894` | Correct answer highlights |
| `incorrect` | `#FF6B6B` | Wrong answer highlights |

### Grid & Background

| Token | Value | Use |
|-------|-------|-----|
| `gridLine` | `#93c5fd` | Interior grid lines (light blue, subtle) |
| `gridLineWidth` | `0.8` | Grid line thickness |
| `chartGrid` | `#ddd` | Chart axis grid lines |
| `chartAxis` | `#333` | Chart axes |

---

## Typography

| Token | Value | Use |
|-------|-------|-----|
| `fontFamily` | `system-ui, -apple-system, sans-serif` | Matches app UI font |
| `fontLarge` | `22` | Key values inside shapes |
| `fontMedium` | `18` | Dimension labels |
| `fontSmall` | `14` | Secondary labels, annotations |
| `fontTiny` | `11` | Axis ticks, minor labels |
| `fontWeight` | `bold` | All dimension/value labels are bold |

**Note:** The good diagrams use bold, coloured text — NOT thin grey text.
This is the single biggest difference from the bad diagrams.

---

## Strokes

| Token | Width | Use |
|-------|-------|-----|
| `shapeStroke` | `2.5` | Shape outlines |
| `dimLine` | `2` | Dimension lines with arrows |
| `gridLine` | `0.8` | Interior grid lines |

### Arrow Markers

Dimension line arrows use filled triangles matching `dimLineColour`:
```svg
<marker markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
  <polygon points="0 0, 8 3, 0 6" fill="#6366f1" />
</marker>
```

---

## ViewBox Standards

| Category | ViewBox | maxWidth | When to use |
|----------|---------|----------|-------------|
| `standard` | `0 0 400 280` | `380` | Rectangles, triangles, shapes |
| `wide` | `0 0 500 200` | `480` | Number lines, bar models |
| `square` | `0 0 300 300` | `320` | Pie charts, clock faces |
| `tall` | `0 0 400 400` | `420` | Column methods, stacked layouts |

---

## What Makes a Good Diagram (Design Principles)

Based on comparing approved vs rejected examples:

### DO:
- Use the **blue/purple/indigo palette** — it matches the app's UI
- Use **bold, coloured labels** for dimensions (not thin grey text)
- Use **generous whitespace** — don't cram elements together
- Let the **question text** provide context — don't put titles in the diagram
- Use **soft, transparent fills** — the shape should feel light, not heavy
- Use **coloured arrows** for dimension lines (indigo #6366f1)
- Use **rounded corners** on rectangles (rx="4")

### DON'T:
- Use **black outlines** — feels like a worksheet, not an app
- Use **grey/dimgray text** — too dull, not engaging
- Use **pink, orange, or green fills** that clash with the app palette
- Put **bold titles inside the diagram** ("Water Bottle", "Equivalent Fractions")
- Use **thin, hairline strokes** — too delicate, hard to see
- Use **multiple unrelated colours** in one diagram (pink + light blue + green)
- Make diagrams feel **dense or cramped** — whitespace is your friend

---

## Colour Consolidation Map (for retrofitting bad diagrams)

| Find (bad/old) | Replace with | Token |
|----------------|-------------|-------|
| `black` (stroke) | `#3b82f6` | shapeStroke |
| `black` (dimension line) | `#6366f1` | dimLineColour |
| `dimgray`, `gray`, `#333`, `#555`, `#666` (text) | `#6366f1` | labelColour |
| `red` (unknown) | `#dc2626` | unknownColour |
| `pink`, `#FFD1DC`, `lightpink` | `#bfdbfe` | shapeFill |
| `lightgreen`, `#90EE90` | `#34d399` | segment3 |
| `lightskyblue` (fill, full opacity) | `#bfdbfe` | shapeFill |
| `orange`, `#FFA500`, `#FFD180` | `#fbbf24` | segment4 |
| `lightcoral`, `#F08080` | `#f87171` | segment5 |
| `font-weight="normal"` (on labels) | `font-weight="bold"` | fontWeight |
| `font-size="12"`, `"14"` (on dim labels) | `font-size="18"` | fontMedium |
| Bold titles inside diagrams | Remove entirely | — |
| `font-family="Arial"` | `font-family="system-ui, -apple-system, sans-serif"` | fontFamily |

---

## 3D Shapes (Volume)

Volume diagrams use a specific three-colour scheme for faces.
These should be updated to match the blue palette:

| Face | Old value | New value |
|------|-----------|-----------|
| Front | `lightskyblue` | `#bfdbfe` |
| Top | `lightcyan` | `#dbeafe` |
| Side | `skyblue` | `#93c5fd` |

---

## Anti-Patterns (Never Do These)

- Never use black for shape outlines — use `#3b82f6`
- Never use grey for labels — use `#6366f1` (coloured, bold)
- Never put titles inside the diagram — the question text handles context
- Never use pink, orange, or green fills outside the segment palette
- Never use Arial — use system-ui to match the app
- Never use thin, normal-weight text for measurements
- Never use more than 3 colours in a single-shape diagram
- Never make text smaller than 11

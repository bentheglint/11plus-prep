# Diagram Component Templates

Standard structure templates for each diagram type. These define the
skeleton — how elements are laid out, grouped, and labelled. All
colours, fonts, and dimensions reference `design-tokens.md`.

## Universal Rules (Apply to ALL Templates)

### Element Ordering (Painter's Algorithm)
SVG has no z-index. Elements drawn later appear on top. Always order:
1. Background fills and surfaces
2. Grid lines and reference marks
3. Shape fills
4. Shape outlines/strokes
5. Dimension lines and arrows
6. Labels and text (always on top)

### Label Placement
- Use `safeLabelPosition()` for all label positioning
- Labels never overlap shapes, other labels, or axes
- Minimum `labelOffset` (8 units) gap between element and label
- Text inside shapes: centred horizontally and vertically
- Text outside shapes: adjacent to the nearest edge

### Grouping
- Wrap related elements in `<g>` with descriptive class names
- Group order: background group → shape group → label group

---

## NumberLine

**ViewBox:** `wide` (560 x 170)
**Use:** Showing values on a scale, jumps, operations

```
Structure:
├── <g class="axis">
│   ├── Horizontal line (y=100, strokeHeavy, primary)
│   ├── Arrow at right end (arrowSize)
│   └── Tick marks at regular intervals (tickLength, strokeHairline)
├── <g class="labels">
│   └── Number labels below ticks (fontMedium, text)
├── <g class="markers">
│   └── Points/dots at key positions (dotRadius, primary)
└── <g class="annotations">
    └── Jump arcs above the line (strokeMedium, segment colours)
```

**Rules:**
- Ticks evenly spaced — calculate from value range
- Labels centred below ticks, `labelOffset` gap
- Jump arcs as quadratic bezier curves above the line
- Arrow only at right end (number lines extend rightward)
- Maximum 15 ticks visible before simplifying scale

---

## BarModel

**ViewBox:** `standard` (400 x 300)
**Use:** Part-whole relationships, fractions, comparisons

```
Structure:
├── <g class="bars">
│   ├── Whole bar rectangle (full width, cornerRadius)
│   └── Segment rectangles (segment palette colours, cornerRadius on ends only)
├── <g class="dividers">
│   └── Vertical lines between segments (strokeLight, border)
├── <g class="labels">
│   ├── Value labels centred in each segment (fontMedium, text or textOnDark)
│   └── Total label (above or below, fontLarge, primary)
└── <g class="brackets">
    └── Curly braces or lines showing groupings (strokeMedium, textSecondary)
```

**Rules:**
- All segments in a bar MUST have equal height
- Segment widths proportional to their values
- Use `textOnDark` for labels on dark-filled segments
- Comparison bars stacked vertically with `groupGap` between
- Brackets outside the bar, never overlapping segments

---

## AngleDiagram

**ViewBox:** `standard` (400 x 300)
**Use:** Showing angles, angle relationships, protractor work

```
Structure:
├── <g class="lines">
│   ├── Base line (strokeHeavy, text)
│   └── Angle line(s) (strokeHeavy, primary or segment colours)
├── <g class="arcs">
│   └── Angle arc(s) (angleArcRadius, strokeMedium, matching line colour)
├── <g class="labels">
│   ├── Angle value labels (fontMedium, positioned along arc midpoint)
│   └── Point labels (fontSmall, at line endpoints)
└── <g class="markers">
    ├── Right angle square marker (if 90°)
    └── Vertex dot (dotRadius)
```

**Rules:**
- Vertex point clearly marked with a dot
- Arc radius consistent across all angles in one diagram
- Multiple angles use different segment colours
- Right angles shown with a small square, not an arc
- Angle labels positioned at the midpoint of the arc, outside the angle
- Lines extend beyond the vertex for visual clarity

---

## RectangleDiagram / ShapeDiagram

**ViewBox:** `standard` (400 x 300)
**Use:** Area, perimeter, properties of shapes

```
Structure:
├── <g class="shape">
│   ├── Shape fill (primarySurface, cornerRadius for rectangles)
│   └── Shape outline (strokeHeavy, primary)
├── <g class="dimensions">
│   ├── Dimension lines with arrows at both ends (strokeMedium, textSecondary)
│   └── Dimension value labels (fontMedium, text)
├── <g class="labels">
│   └── Property labels (fontSmall, textSecondary)
└── <g class="markers">
    ├── Equal length marks (small ticks on sides)
    └── Right angle markers (if applicable)
```

**Rules:**
- Dimension lines offset from shape edge by `labelOffset`
- Arrows point inward toward the measured edges
- Dimension values centred on the dimension line
- Equal-length marks as small perpendicular ticks
- Shape centred in viewBox with `padding` on all sides

---

## PieChart

**ViewBox:** `square` (300 x 300)
**Use:** Data handling, fractions, proportions

```
Structure:
├── <g class="segments">
│   └── Wedge paths (segment palette colours, stroke: surface, strokeLight)
├── <g class="labels">
│   ├── Segment value labels (fontMedium, positioned at segment midpoint)
│   └── Segment name labels (fontSmall, outside or in legend)
└── <g class="legend"> (if needed)
    ├── Colour swatches (small rectangles, matching segment colours)
    └── Legend text (fontSmall, text)
```

**Rules:**
- Circle centred in viewBox
- Start from 12 o'clock (top), go clockwise
- Thin white stroke between segments for visual separation
- Labels inside segments if segment is large enough (>15%)
- Labels outside with leader lines if segment is small (<15%)
- Maximum 6 segments — group smaller items as "Other"
- Legend positioned below the chart if labels don't fit

---

## BarChart

**ViewBox:** `standard` (400 x 300)
**Use:** Data handling, comparing quantities

```
Structure:
├── <g class="axes">
│   ├── Y-axis line (strokeHeavy, text)
│   ├── X-axis line (strokeHeavy, text)
│   ├── Y-axis tick marks and labels (fontTiny, textSecondary)
│   └── X-axis category labels (fontSmall, text)
├── <g class="grid">
│   └── Horizontal grid lines (strokeHairline, gridLine)
├── <g class="bars">
│   └── Rectangles (segment palette or single colour, cornerRadius on top only)
└── <g class="labels">
    ├── Axis titles (fontMedium, text)
    └── Value labels above bars (fontSmall, text) — optional
```

**Rules:**
- Bars equal width with `barGap` between them
- Y-axis starts at 0 (no truncated axes — misleading for children)
- Grid lines behind bars (drawn first)
- Category labels centred below each bar
- Axis titles centred along their axis
- Bars use segment palette if multi-category, single `maths` blue if single-category

---

## GridModel

**ViewBox:** `standard` (400 x 300)
**Use:** Place value, column method, multiplication grids

```
Structure:
├── <g class="grid">
│   ├── Cell rectangles (surface fill, border stroke)
│   └── Header cells (primarySurface fill)
├── <g class="dividers">
│   └── Grid lines (strokeLight, border)
└── <g class="values">
    ├── Header labels (fontMedium, primary, fontWeight 600)
    └── Cell values (fontMedium, text)
```

**Rules:**
- All cells equal size within their row/column
- Headers visually distinct with `primarySurface` fill
- Values centred in cells
- Border around entire grid with `strokeMedium`

---

## CuboidDiagram

**ViewBox:** `standard` (400 x 300)
**Use:** Volume, 3D shape properties

```
Structure:
├── <g class="faces">
│   ├── Back faces (primarySurface, slightly darker)
│   ├── Side face (primarySurface, medium shade)
│   └── Front face (primarySurface, lightest)
├── <g class="edges">
│   ├── Visible edges (strokeHeavy, primary)
│   └── Hidden edges (strokeLight, primaryLight, dashed)
├── <g class="dimensions">
│   ├── Dimension lines (strokeMedium, textSecondary)
│   └── Dimension values (fontMedium, text)
└── <g class="labels">
    └── Face/property labels (fontSmall, textSecondary)
```

**Rules:**
- Consistent isometric projection angle (30°)
- Hidden edges shown as dashed lines
- Front face slightly lighter than side/top for depth
- Dimension lines offset from edges, not overlapping
- Three dimensions labelled: length, width, height

---

## FractionDiagram

**ViewBox:** `standard` (400 x 300)
**Use:** Fraction representation, equivalent fractions

```
Structure:
├── <g class="whole">
│   └── Outline of whole shape (strokeHeavy, primary)
├── <g class="parts">
│   ├── Shaded parts (segment1, fills)
│   └── Unshaded parts (surface or white fill)
├── <g class="dividers">
│   └── Division lines (strokeLight, primary)
└── <g class="labels">
    └── Fraction notation (fontLarge, text)
```

**Rules:**
- ALL parts MUST be exactly equal size — this is mathematically critical
- Shaded parts use segment colour, unshaded stays white/surface
- Division lines clearly visible but thinner than outline
- Fraction notation centred below diagram
- For fraction walls: multiple bars stacked vertically, aligned left

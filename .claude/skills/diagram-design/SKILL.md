---
name: diagram-design
description: |
  Design system skill for consistent, beautiful SVG diagrams across the 11+ app.
  Enforces a unified style guide derived from the app's best existing diagrams
  (angles/shapes, data handling pie charts). All new diagrams follow these
  standards. Retrofitting existing diagrams changes STYLE ONLY — never content.

  USE WHEN: Creating new diagram components, editing existing diagrams, or
  auditing diagram consistency. Also triggered by "diagram", "SVG", "visual",
  "chart", "style guide", or "design tokens".

  ALSO PROACTIVE: When Claude creates or edits any SVG/diagram code, it MUST
  reference the design tokens and component templates automatically.
---

# Diagram Design System

A unified design system for all SVG diagrams in the 11+ app. Ensures
every diagram looks like it belongs to the same family — consistent
colours, typography, spacing, and structure.

Derived from the app's best existing diagrams (angles/shapes, data
handling, pie charts) and educational design research for 9-11 year olds.

## CRITICAL RULE: Style Only, Never Content

**This rule overrides everything else in this skill.**

When editing existing diagrams:
- **CHANGE:** Colours, stroke widths, fonts, spacing, alignment, opacity
- **NEVER CHANGE:** Labels, numbers, values, figures, text content,
  mathematical relationships, positions that convey meaning

A diagram must still make perfect sense with its associated question
after any style changes. If a label says "12cm", it stays "12cm". If
an angle shows 45°, it stays 45°. If a bar represents 3/8, its
proportional width stays the same.

**Before saving any diagram edit, verify:**
1. All text content is identical to the original
2. All numerical values are unchanged
3. The diagram still answers its question correctly
4. Proportional relationships are preserved

---

## Reference Files

Read these before creating or editing any diagram:

| File | Content |
|------|---------|
| `references/design-tokens.md` | **Single source of truth** — all colours, fonts, sizes, spacing |
| `references/component-templates.md` | Standard structure templates for each diagram type |

**Rule:** No hex colour, font size, or stroke width should appear in
diagram code that isn't defined in `design-tokens.md`. If you need a
colour that doesn't exist in the tokens, propose adding it — don't
hardcode it.

---

## Style Benchmark Diagrams

These existing diagrams represent the target quality. When building
new diagrams or retrofitting old ones, match these:

- **AngleDiagram** — clean lines, clear arcs, well-placed labels
- **Pie charts** (in data handling) — good segment colours, clear labels
- **Shape diagrams** — consistent stroke weights, proper dimension lines

Note: other data handling diagrams (bar charts etc.) are NOT benchmarks
and may need restyling. Only the pie charts in that section are good.

When in doubt about a style decision, reference how the benchmark
diagrams handle it.

---

## Creating New Diagrams

### Step 1: Read the Tokens and Templates

Before writing any SVG code:
1. Read `references/design-tokens.md` — know the colour palette, font
   sizes, stroke widths, and viewBox dimensions
2. Read `references/component-templates.md` — find the template for
   the diagram type you're building
3. If no template exists, use the closest one and adapt

### Step 2: Choose the Right ViewBox

| Category | ViewBox | When to use |
|----------|---------|-------------|
| Standard | `0 0 400 300` | Most diagrams |
| Wide | `0 0 560 170` | Number lines, timelines |
| Square | `0 0 300 300` | Pie charts, circles |
| Tall | `0 0 400 400` | Column methods, stacked layouts |
| Compact | `0 0 320 240` | Small inline diagrams |

### Step 3: Build Layer by Layer

Follow the painter's algorithm order from the template:
1. Backgrounds and surfaces (drawn first, appear behind)
2. Grid lines and reference marks
3. Shape fills
4. Shape outlines
5. Dimension lines and arrows
6. Labels and text (drawn last, appear on top)

### Step 4: Apply Design Tokens

Use token values, never hardcoded values:

```jsx
// GOOD — references token values
<line stroke="#6C5CE7" strokeWidth={3} strokeLinecap="round" />
<text fill="#2D3436" fontSize={16} fontFamily="system-ui, -apple-system, sans-serif" />

// BAD — arbitrary values
<line stroke="#7B68EE" strokeWidth={2.5} />
<text fill="black" fontSize={15} fontFamily="Arial" />
```

### Step 5: Use safeLabelPosition()

For any label that could potentially overlap other elements, use the
existing `safeLabelPosition()` utility. Don't manually position labels
without collision checking.

### Step 6: Validate Visually

After creating or editing a diagram:
1. Use the Visual QA skill or Chrome DevTools MCP to screenshot the
   diagram in a browser
2. Check for:
   - Overlapping elements (text on text, labels on shapes)
   - Consistent spacing (equal gaps between equal elements)
   - Colour consistency (matches the token palette)
   - Readability (can a 10 year old read all labels?)
   - Proportional accuracy (fractions, bar widths, angles)
3. Fix any issues found before moving on

---

## Retrofitting Existing Diagrams

### The Golden Rules of Retrofit

1. **Style only, never content** — see critical rule above
2. **One diagram at a time** — don't batch-edit, errors compound
3. **Test after each change** — verify the question still works
4. **Commit after each diagram** — easy rollback if something breaks

### What to Change

| Property | Find (inconsistent) | Replace with (token) |
|----------|-------------------|---------------------|
| Shape outlines | Various stroke colours | `#6C5CE7` (primary), width `3` |
| Text colour | `black`, `#000`, random greys | `#2D3436` (text) |
| Font size | Random sizes 12-24 | Token sizes: 22, 16, 13, 11 |
| Shape fills | Random blues, purples | `#EDE8FF` (primarySurface) |
| Grid lines | Various greys | `#E5E7EB` (gridLine), width `1` |
| Backgrounds | Various light colours | `#FAFBFF` (surface) |
| Segment colours | Random palette | Segment palette from tokens |
| Corner radius | 0, 2, 4, 5... | `3` (cornerRadius) |
| Stroke caps | Various | `round` (strokeLinecap) |

### What NOT to Change

- Label text content ("12cm" stays "12cm")
- Numerical values in any form
- Relative positions that convey mathematical meaning
- Number of elements (if there are 5 bars, keep 5 bars)
- Which segments are shaded/filled
- Proportional sizes (a bar representing 3/8 stays 3/8 width)

### Retrofit Process

For each diagram to retrofit:

1. **Read the original** — understand what it shows and why
2. **Read the associated question** — understand what the diagram
   needs to communicate
3. **Identify style-only changes** — list what can change without
   affecting content
4. **Make the changes** — apply design tokens
5. **Verify content preserved** — compare all text/values with original
6. **Visual check** — screenshot and compare side-by-side
7. **Commit** — `refactor: style diagram [name] to design system tokens`

### Prioritising Retrofit

Not all 538 diagrams need immediate attention. Prioritise:

1. **Howlers** — diagrams that are clearly broken or ugly (fix first)
2. **High-visibility** — diagrams students see most often
3. **Inconsistent clusters** — groups of similar diagrams that look
   different from each other
4. **Already good** — diagrams that just need minor token alignment
   (do last or leave)

---

## Proactive Behaviour

When working on any part of the 11+ app:

### When Creating Diagrams
- Always read design tokens before writing any SVG code
- Always follow the component template for the diagram type
- Always validate visually after creation
- Note: "I've followed the diagram design system for this component"

### When Editing Diagrams
- Check if the diagram uses design tokens or hardcoded values
- If hardcoded, offer to update to tokens (style only)
- Flag any overlap or spacing issues spotted

### When Reviewing Code
- Flag any new hex colours not in the design tokens
- Flag any SVG text without `fontFamily` set
- Flag any missing accessibility attributes (`role`, `aria-labelledby`, `title`)

---

## Colour Consolidation Map

The codebase currently has 57 unique hex colours in SVG components.
These should consolidate to the design token palette:

### Direct Replacements

| Current (inconsistent) | Replace with | Token name |
|----------------------|-------------|------------|
| `#6366f1` | `#6C5CE7` | primary |
| `#7c3aed`, `#6d28d9` | `#5A4BD1` | primaryDark |
| `#5145c9`, `#5a4bd4`, `#4a3db8` | `#5A4BD1` | primaryDark |
| `#ede9fe`, `#f3f0ff`, `#f0f0ff`, `#e0dbfa` | `#EDE8FF` | primarySurface |
| `#1e293b`, `#374151`, `#1f2937` | `#2D3436` | text |
| `#6b7280`, `#64748b`, `#94a3b8` | `#636E72` | textSecondary |
| `#9ca3af` | `#636E72` | textSecondary |
| `#e5e7eb`, `#e2e8f0` | `#E5E7EB` | gridLine |
| `#d1d5db` | `#D1D5DB` | border |
| `#f3f4f6`, `#f9fafb` | `#FAFBFF` | surface |
| `#dc2626`, `#ef4444` | `#FF6B6B` | incorrect |
| `#16a34a`, `#059669`, `#15803d` | `#00B894` | correct |
| `#d97706`, `#f59e0b`, `#92400e` | `#FDCB6E` / `#F39C12` | accent / accentDark |
| `#3b82f6`, `#1e40af`, `#60a5fa` | `#0984E3` | maths |
| `#93c5fd`, `#bfdbfe`, `#dbeafe`, `#f0f9ff` | `#EDE8FF` | primarySurface (or remove) |

### Segment Palette (keep as-is)
These are already correct in the tokens:
`#818cf8`, `#38bdf8`, `#34d399`, `#fbbf24`, `#f87171`, `#c084fc`

### Colours to Investigate
Some colours may have specific content meaning (e.g. boys vs girls
in data handling). Check before replacing:
- `#87CEEB` (light sky blue) — may indicate a specific data category
- `#F08080` (light coral) — may indicate a specific data category

---

## Accessibility Checklist

Every diagram MUST have:
- [ ] `role="img"` on root `<svg>`
- [ ] `aria-labelledby="titleId descId"` referencing title and desc
- [ ] `<title id="titleId">` with concise diagram description
- [ ] `<desc id="descId">` with detailed description for screen readers
- [ ] Minimum 4.5:1 contrast ratio for all text
- [ ] Information not conveyed by colour alone (use labels too)
- [ ] No text smaller than fontTiny (11 SVG units)

---

## Integration with Other Skills

- **Visual QA** — Use after creating/editing diagrams to screenshot
  and catch overlap, spacing, and alignment issues
- **Refactor** — When visuals.js (4,863 lines) needs splitting into
  separate component files
- **Learn-with-me** — Explain diagram design decisions as they're made
- **Alf** — Verify that retrofit changes didn't alter content

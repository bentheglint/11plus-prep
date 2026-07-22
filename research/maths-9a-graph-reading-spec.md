# Maths Graph-Reading Slice — Spec (Benchmark Fix #9a)

**Authored:** 23 Jul 2026. Content owner: the 11+ Oracle. Claude owns spec, harness,
insert, tests, visual QA. **This is the CONTENT-ONLY first slice of #9** (Ben's decision):
"read a value off a graph, THEN compute" using EXISTING, production SVG components. NO new
components (coordinate/reflection/symmetry/Venn/nets are a separate later build; the
diagram-design tokens gap is parked until then).

## Why (benchmark roadmap #9, `BENCHMARK-vs-real-GL-2026-07-21.md` lines 113-121)
Only 1.7% of our Maths questions are diagram-dependent vs ~40% of real GL. Real GL adds a
"read the value off the figure, THEN compute" step where candidates lose marks. Three of
the zero-coverage GL types can ship as pure content by reusing existing components:
conversion graphs, distance-time graphs, and misleading-graph reasoning.

## Render path (confirmed — no new plumbing)
A question renders a diagram via `visual: { component, props }`, resolved through the
`quizVisualComponents` registry (src/App.js) and drawn above the standard 5-option MCQ in
QuizScreen.js (~line 441) and MockTestScreen.js (~line 275). A graph question is an SVG +
a normal text MCQ. The dev preview `?preview=<topic>&q=<id>` also renders the component.

## Existing components to REUSE (exact prop APIs — do NOT invent props)
**LineGraph** (src/microLessons/visuals.js:4786):
```js
visual: { component: "LineGraph", props: {
  data: [{label:"9am", value:14}, {label:"12pm", value:18}, ...],  // x = label (categorical/ordered), y = value
  xLabel: "Time", yLabel: "Temperature", unit: "°C",
  showValues: false,   // MUST be false for read-off-the-graph questions (child reads gridlines)
  // optional: highlight, color, showGrid (default true)
}}
```
Y-axis auto-scales to nice round numbers from the data; the child reads a value at a
labelled x-point off the gridlines. Already used in datahandling (id 10, temperature).

**BarChart** (visuals.js:4939):
```js
visual: { component: "BarChart", props: {
  bars: [{label:"Mon", value:20}, ...],
  xLabel:"", yLabel:"", unit:"",
  yStart: 0,          // <-- set yStart > 0 to TRUNCATE the axis = the "misleading graph" mechanic
  showValues: false,  // false so the child must read/estimate
}}
```
**PieChart** (visuals.js:5074) available if needed but prefer Line/Bar for this slice.

## The three question families (all: read off the graph -> compute -> numeric answer)
1. **Conversion graphs (LineGraph)** — a straight conversion line (£↔$, km↔miles, kg↔lb,
   litres↔pints). Data points are labelled x-values with their converted y-value; make the
   x-value the child must read a LABELLED point (so it's exactly readable, not interpolated).
   Chain: read one conversion off the graph, THEN a second step (scale up, find a total, find
   a difference). e.g. "The graph converts £ to $. Read $ for £4, then find $ for £20."
2. **Distance-time graphs (LineGraph)** — data = {label: a time, value: distance}. Chain:
   read distance at a time (or identify the steepest/flat section), THEN compute speed
   (distance÷time), or total/remaining distance, or which leg was fastest. A flat section =
   stopped. Real GL classic.
3. **Misleading-graph reasoning (BarChart, yStart > 0)** — a truncated y-axis makes small
   differences look huge. The child must read the ACTUAL values (not the bar heights) and
   compute the TRUE difference/ratio, or judge whether the graph fairly represents the data.
   e.g. "The bar for Shop B looks twice as tall as Shop A. Using the axis values, how much
   more did Shop B actually take?"

## Homes (append to existing topics — topicKeyConsistency pins 16 Maths topics, no new topic)
- Conversion graphs -> **datahandling**
- Misleading-graph reasoning -> **datahandling**
- Distance-time graphs -> **speeddistancetime**
Difficulty: graph-reading is mostly D2/D3 (read + compute); a few D1 (simple read-then-one-step).

## Size (~40 items; content-only slice)
~14 conversion + ~13 misleading (both datahandling) + ~13 distance-time (speeddistancetime).

## Per-item output shape (Oracle) — normal question + machine-check fields (`_`, stripped on insert)
```js
{
  difficulty: 2,
  visual: { component: "LineGraph"|"BarChart", props: { ...valid props above... } },
  question: "…refers to the graph…",
  options: ["…","…","…","…","…"],   // 5 distinct
  correct: 2,
  explanation: "Step 1 read off the graph … Step 2 compute … ✓",
  _expr: "6/4*20",                    // pure arithmetic = numeric value of options[correct] (like #8)
  _steps: ["read $6 for £4 off the graph", "6÷4×20 = $30"],
  _readFromGraph: "at £4 the line is at $6"   // the value(s) the child must read off, for the adversarial check
}
```
- Every answer numeric (currency/number/unit) and recompute-able via `_expr` (chars: 0-9 + - * / ( ) . space).
- The value the child reads off the graph MUST be an actual data point in `props.data`/`props.bars`
  (so it is exactly readable), and `_readFromGraph` must name it.
- distractors from real errors (read the wrong point; used bar height not axis value for misleading;
  forgot the compute step; wrong operation). No ±constant ladders (reuse the #8 anti-ladder guard).

## Harness (`scripts/data-generation/verify-maths9a.mjs`)
Per item (hard): difficulty 1-3; 5 distinct options; correct 0-4; explanation ends ✓; `_steps` len≥2;
`_expr` present + char-whitelist + evaluates to the number parsed from options[correct] (reuse #8
parseNumericOption + eval). Anti-ladder (reuse #8 rule: full ladder fails; near-ladder only if
correct is the median). VISUAL checks: `visual.component` in {LineGraph, BarChart, PieChart};
props.data (Line) or props.bars (Bar) is a non-empty array of {label, value} with numeric values;
`showValues` === false; for the read-then-compute, assert the value named in `_readFromGraph`
corresponds to a real data point value (numeric appears in the data set). Report: correct-answer
value-rank histogram (middle-value tell guard, ≤30% median).

## Pipeline (lean — feedback_token_efficiency_orchestration)
spec -> batched Oracle wave (each WRITES its JSON to scratchpad + returns path+count only) ->
merge (node) -> verify-maths9a -> triage -> 1 adversarial Oracle pass (does the answer really
read off the graph? is the graph unambiguous?) -> insert-maths9a.mjs (append per topic,
position-balance, strip `_` fields, CRLF-safe; serialize the `visual` object) -> +lesson-map ->
Jest gate mathsGraphReading -> full Jest + verify-answers + count + build + compat -> VISUAL QA a
sample of rendered graphs via ?preview=<topic>&q=<id> (screenshot: axis scales sensible, the
read-off point is on a gridline, no overlap) -> commit -> tracker.
NOTE: insert must serialize the nested `visual: { component, props: {...} }` object (the #8/#10
inserts didn't handle a visual field — the maths9a insert needs it).

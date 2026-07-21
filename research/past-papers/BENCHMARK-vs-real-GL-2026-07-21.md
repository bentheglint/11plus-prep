# PrepStep Question Bank vs Real GL Papers — Benchmark (21 Jul 2026)

**Purpose:** Verify how close our question library + mock tests are to real GL
papers, so we can defend against the "too easy, like Atom" accusation.
Method: three Oracle agents (English, Maths, VR) compared our bank against the
verbatim real-paper transcriptions in `research/past-papers/`, plus a
deterministic answer-tell analysis across all 6,170 questions.

**Real signal being explained:** the founder's daughter scored HIGHER on our
mocks than on real GL mock papers → our content is likely softer / more
gameable than the real thing.

---

## Headline verdict

We are **not uniformly too easy** — the bank's difficulty *distribution*
(≈30/40/30 across D1/D2/D3) is textbook, and several strands (VR codes &
sequences, English spelling/vocab word-choice, Maths computation ceiling) are
genuinely GL-hard. The inflated mock scores come from **three compounding,
fixable causes**, consistent across all three subjects:

1. **Mock assembly has no difficulty ramp for English & VR** (regresses to the
   soft bank average; no whole-paper easy→hard progression). Maths already
   ramps correctly — so this is a targeted code fix, not a rewrite.
2. **Answer tells let a test-wise child score above their ability** — a
   measurable English "longest-answer" tell and a strong Maths "middle-value"
   tell.
3. **Specific soft spots & format gaps** — English word-class "D3" isn't hard,
   Maths lacks the "read a diagram then compute" step, VR letters-for-numbers
   is built in an easier format.

---

## Cross-cutting finding #1 — Mock difficulty ramp

The 20 Jul concern (`shuffle(pool).slice(0,n)` with no difficulty targeting)
is **confirmed for English and VR, false for Maths**:

| Subject | Mock assembly | Ramp? |
|---|---|---|
| Maths | `generateMathsPaper` targets 15 D1 / 20 D2 / 15 D3 via `mathsPaperConfig.difficultyDistribution` | ✅ real GL-style ramp |
| English | `generateEnglishPaper` — `shuffle(pool).slice(0,8)` per section | ❌ no targeting |
| VR | `generateVRPaper` (`useMockTest.js:207`) — `shuffle(pool).slice(0,n)` then sort easy-first *within* each 7-Q section | ❌ no targeting + easy-first |

**File:** `src/hooks/useMockTest.js` (NOT quizOrchestration.js). The fix reuses
the existing `pickQuestions(pool,count,difficulty)` already wired into Maths.
Effect: English/VR mocks currently regress to bank-average and never back-load
D3; a child who slows under time pressure banks the easy items in every
section. **This is the single biggest lever on realism.**

---

## Cross-cutting finding #2 — Answer tells (measured across 6,170 Qs)

Position of the correct answer is evenly spread A–E in all three subjects — **no
position tell.** Length tell splits by subject:

### English — "longest / most-qualified answer" tell (escalates with difficulty)
| English difficulty | Correct answer is the single longest option |
|---|---|
| D1 | 17.1% (fine) |
| D2 | 25.0% |
| D3 | 31.7% |
| Comprehension D2/D3 reasoning subset | **35%** |
| Vocabulary definition-option subset | **52%** |

Mechanism: to make the key unambiguous, authors fully qualify the correct
option ("On the surface only, not genuine") while distractors stay terse. A
child learns "pick the longest/most-hedged option." ~300–450 questions.

### Maths — "middle-value" tell (the dominant Maths flaw)
Ranking the correct answer's *value* among the 5 options:

| Value rank | smallest | 2nd | **middle** | 4th | largest |
|---|---|---|---|---|---|
| Share | 6.1% | 15.8% | **51.5%** | 19.5% | 7.0% |

A child who estimates roughly and picks the middle-magnitude option scores
~51% **without doing the maths.** Cause: 39% of numeric questions use
constant-gap "arithmetic ladder" distractors (`40,41,42,43,44`) — up to **86%
in Long Division, 70% Speed, 63% Angles**. Ladders also fail to diagnose the
child's actual misconception. Fixing the ladders fixes the tell. ~1,283 Qs.
Also: 429 duplicate option-sets reused within topics.

### VR — clean on tells
No position or length tell. Minor issues are difficulty/format (below), not
tells. One exception: `missingLettersWords` D1 over-telegraphs the answer via
context ("cheeky MON swung through the trees" → MONKEY).

---

## Cross-cutting finding #3 — Difficulty & content gaps by subject

### English
- **Content:** No genuine running-passage **Cloze** (16% of EVERY real paper —
  connected passage with homophone/"errors children write" distractors). Our
  cloze-equivalent (`grammar`) uses clean textbook distractors; only 6 questions
  in the whole bank use a real-error distractor like "should of / brung".
- Vocabulary is **isolated synonym/antonym** (VR format) not passage-anchored
  ("meaning of X *as used in paragraph 7*") — trains an easier muscle.
- Word-class tested as **isolated 4-word lists**, not a target word in context;
  `wordClassGrammar` "D3" (~113 items) is structurally incapable of GL
  difficulty → effectively D1–D2.
- Punctuation bank is 72% apostrophe/comma; real GL leans on **capitals &
  end-punctuation** (~40%). Error-spotting is disconnected sentences vs real
  8-line narratives.
- **Well matched:** mock passage length & register (~1,000–1,200 words),
  figurative-device naming, negative-retrieval, author-purpose; no-mistake "E"
  rates correctly calibrated (17–19%, rising with difficulty).

### Maths
- **Biggest gap is FORMAT:** only **1.7% of our questions are diagram-dependent
  vs ~40% of real Mock Paper 1.** Real GL adds a "read the value off the
  figure, THEN compute" step where candidates lose marks. Text-only bank skips
  it. *(Fixing this needs a figure-rendering path — a genuine build dependency.)*
- **Zero coverage** (0 of 3,376) of: coordinate geometry, reflections/mirror
  lines, surface area/nets, lines of symmetry, Venn/sorting diagrams,
  conversion graphs, misleading-graph reasoning. Under-covered: shape rotation,
  calendar day-of-week arithmetic, distance-time graph reading, coordinate/
  midpoint geometry.
- **Computation ceiling is close to real** (our D3 word-problems match mid-hard
  real items), BUT our hardest tier is mostly 1–2 steps where real GL's top
  ~10% is 2–3 steps + a concept switch (e.g. "15% of ⅓ of 240"). Multi-sentence
  ≠ multi-step.
- **Data integrity:** the ground-truth file `CGP-GL-Mock-Test-Maths-Paper-1.md`
  has ~14 answer-key discrepancies in its own "Flagged Answers" table (photo
  misreads). Fix Q6, Q28, Q29, Q46, Q47, Q49 before authoring questions from it.

### VR
- **Every real GL type is represented** (no missing type; no phantom topics) —
  the bank is broadly authentic and its codes & number-sequences are genuinely
  GL-hard.
- **Letters-for-numbers is built in the wrong, easier format:** real GL asks
  "write the answer **as a letter**" (compute then map back to A–E) with 3–4
  operand BODMAS chains and some fraction values. Ours ask for the numeric
  value with ≤2–3 operators and no fractions. 0/128 use the real format →
  effectively D1–D2. Clearest VR soft spot.
- **Hidden-words is pre-chopped** into a 5-token list (4 boundaries) instead of
  a natural 6–10 word sentence (7–9 boundaries) → removes the real reading load.
- **`balanceEquations` starved** (30 Qs, never in any mock) despite being ~25%
  of CGP 10-minute papers. Hidden-middle-word analogy underweighted (~25 of 150).

---

## Prioritised fix roadmap (cross-subject, most impactful first)

1. **Add difficulty targeting + whole-paper ramp to English & VR mock
   assembly.** Reuse Maths' existing `pickQuestions(pool,count,difficulty)`.
   Cheap code change in `useMockTest.js`; changes the difficulty profile of
   every mock a child sits. *(Highest leverage; likely the main cure for
   inflated scores.)*
2. **Break the Maths middle-value tell.** Re-derive distractors from named
   error-methods (wrong operation, place-value slip, off-by-one) instead of
   ±constant ladders. Prioritise Long Division (86%), Speed (70%), Angles
   (63%), Long Mult (61%). ~1,283 Qs; also de-dup 429 repeated option-sets.
3. **Break the English longest-answer tell.** Length-match distractors to the
   correct option per difficulty. Worst first: ~37 comprehension D2/D3 items,
   ~14 vocab definition items; systemic pass ~300–450 Qs.
4. **Rebuild English `wordClassGrammar` D3 (+ much of D2) as in-context,
   trap-bearing items.** ~113 D3 + share of 170 D2. Doubles as content fix.
5. **Rebuild VR `letterSums` in the authentic "answer as a letter" format**
   (3–4 operand chains, some fractions). ~128 Qs.
6. **Add English running-passage Cloze** with GL homophone/near-miss
   distractors; wire into the mock. ~80–120 new items.
7. **Convert VR `hiddenWords` to natural sentences.** ~150 Qs. Promote &
   expand `balanceEquations` into mocks (30→~100).
8. **Deepen Maths D3 tail** into true 2–3-step / multi-concept chains. ~80–120
   Qs. Fix the 6 Maths answer-key misreads in the ground-truth file first.
9. **Add Maths diagram/visual question types** (read-figure-then-compute) to
   move from 1.7% toward a GL-realistic ~30–40%. *(Needs a figure-rendering
   path — the one item that is a real build dependency, not just content.)*
   Fill the zero-coverage Maths topics (coordinates, reflections, symmetry,
   Venn, conversion/distance-time graphs). ~150–200 new Qs.
10. **English:** rebalance punctuation toward capitals/end-punctuation;
    re-anchor half the vocabulary bank to passages; make error-spotting
    continuous narratives.

---

## ⚠️ Hard rule for all content work (see `_USAGE-GUARDRAIL.md`)
Real papers are a reference for **style, format, difficulty and distractor
design ONLY**. Never copy a real-paper question verbatim or as a light reword;
never reproduce their passages, word lists, codes or options. Every authored
question must be entirely original and checked for verbatim/near-verbatim
overlap before entering the bank.

## Notes for whoever implements
- Fixes #1 (ramp) and #2/#3 (tells) are the highest realism-per-effort.
- #1 is a small code change; #2/#3/#8 are distractor-regeneration passes that
  can be scripted with per-question validation (avoid re-introducing tells:
  check correct-value rank distribution + option-length parity after each pass).
- #9 (diagrams) is the only fix gated on a build dependency — decide separately.
- Real-paper transcriptions used: `research/past-papers/Examples-{English,VR}-
  Practice-Test-{A..D}.md`, `CGP-GL-Mock-Test-{English,Maths,VR}-Paper-1.md`,
  `CGP-10min-{Maths,VR}-complete.md`.

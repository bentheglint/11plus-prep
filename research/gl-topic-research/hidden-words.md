# GL Assessment Research: Hidden Words (VR)

> Authored 25 Jun 2026 to settle a length ambiguity in the master reference
> (`research/11plus-oracle.md`) after tutor **Sue Medley** flagged that real GL
> hidden-word items are 4-letter and carry no meaning clue. Synthesised from the
> 11+ Oracle's audit of the live bank against the research library; sources cited
> inline. Supersedes the master-table "5-letter ~20%" row, now corrected.

## Format

### Question Type Classification
- **GL Type 11**: "Hidden Four-Letter Word" (`GL-11plus-English-VR-Research.md`, Type 11).
- A **Word Manipulation** verbal-reasoning type.

### How It Appears on Paper
A sentence is given. A short word is hidden **across exactly two adjacent words** —
the letters at the **end of one word** join the letters at the **start of the next**,
consecutive and in order. The hidden word is **never wholly inside a single word**
(`11plus-oracle.md` l.250–255; `vr-english-strategies.md` §6; `exam-strategy-tips.md`
l.427–430).

Worked example (`GL-11plus-English-VR-Research.md`): *"the noise"* → **THEN**
(th**E** + **N**oise → no; the→ "the"+"noise": **theN**… i.e. the boundary of
*the/noise* yields THEN). The skill GL tests is **scanning every word boundary**,
not reading the sentence's meaning.

### Authoritative MC presentation (what our app implements)
Bournemouth/Dorset GL papers are multiple-choice, electronically marked. For hidden
words the authentic MC presentation is **(a) — the child identifies the PAIR OF
ADJACENT WORDS** whose boundary conceals the word (not "pick the hidden word from a
list of candidates", which would collapse the boundary-scan into vocabulary
recognition and destroy the skill being assessed). Our app's `select-two` interaction
(five word-tiles that read as a sentence; the child taps the two adjacent tiles) **is
this authentic mechanic** — confirmed by Oracle audit, 25 Jun 2026.

## Word Length — definitive spec

| Length | Frequency | Notes |
|--------|-----------|-------|
| 4 letters | **~85%+** | The core and dominant GL form ("Hidden **Four**-Letter Word") |
| 3 letters | **~15% / rare** | Authentic but uncommon; `exam-strategy-tips.md`: "almost always 4" |
| 5+ letters | **None** | **Not authentic GL — do not generate** |

**Why the correction:** three practitioner sources independently specify four letters
(`vr-english-strategies.md` "find a four-letter word"; `GL-11plus-English-VR-Research.md`
"Hidden Four-Letter Word"; `exam-strategy-tips.md` "almost always 4 letters"). The only
source claiming 5-letter at ~20% was a single uncorroborated row in the master table,
contradicted by the type's own name and by tutor field experience. 3-letter items are a
legitimate gentle on-ramp (same boundary-scan skill) but should stay a small minority.

## Split Patterns
- **2+2** (4-letter): most common, easiest to spot.
- **1+3 / 3+1**: harder — the child must consider single-letter starts/ends.
- GL favours **uneven splits** for harder items.

## Difficulty Calibration
- **D1 (~30%):** common 3–4 letter words; short 5-tile sentences; word mid-sentence; even split; gentle.
- **D2 (~40%):** common-but-not-obvious 4-letter words (arch, rust, mean, rate); mixed splits; ≥1 near-miss.
- **D3 (~30%):** less-common/abstract 4-letter words (rust, mead, fret, gild, wane); uneven splits; word buried at start/end; multiple red-herring boundaries.

## Common GL Traps
1. **Words within a single word** — "every" contains "ever"/"very", but these don't span two words (invalid).
2. **Multiple partial matches** — several boundaries form short strings; only one is the right *length* and a real word.
3. **Misleading context** — the sentence's meaning is a **decoy** (a sentence about cooking hides RAIN); it must give no semantic clue.
4. **Double-letter boundaries** — "glass snake" hides confusing double-s.
5. **Longer sentences** — more boundaries to scan systematically.

## Our App's Design Rules (regeneration 25 Jun 2026)
The original bank (seeded pre-Oracle, 27 Mar 2026) had three faults Sue Medley's
feedback surfaced: every stem leaked a meaning clue, some words were 5-letter, and the
five tiles formed a sentence with only one valid boundary (no distractor pressure). The
bank was fully regenerated (Oracle-authored, machine-verified) to these rules:

1. **Neutral stem, no meaning clue** — exactly *"A 4-letter word is hidden across two of
   these adjacent words. Find the two words."* (or the 3-letter variant).
2. **Strict decoy** — no synonym/antonym/semantic associate of the hidden word anywhere
   in the sentence.
3. **Same-length uniqueness (the disambiguation rule)** — no OTHER boundary may form a
   *common* real word of the SAME length as the target. Different-length real words at
   other boundaries are encouraged as **distractor pressure** (the child must check the
   stated length, not just "the only pair that makes a word"). Obscure dictionary words
   at other boundaries are tolerated (a child/marker won't recognise them).
4. **Adjacent boundary** — the answer is always two adjacent tiles (j = i+1); the word
   straddles exactly that one boundary, consecutive and in order.

**Build record:** 150 items at 30/40/30 (45 D1 / 60 D2 / 45 D3); 4-letter dominant,
~6% three-letter, zero 5-letter. Every item authored by the 11+ Oracle and verified
mechanically against a 274,937-word dictionary (real-word, boundary-straddle, adjacency,
length, same-length-common collision, duplicates). Structural invariants pinned by
`src/__tests__/data/oracleRegressions.test.js` ("Hidden Words — authentic GL invariants").

## Strategy (for micro-lessons)
Systematic left-to-right boundary scan: at each word boundary, try the splits for the
target length (start with 2+2). Say combinations quietly. The sentence's meaning is a
decoy — ignore it. Skip tiny words (a, I, the) as anchors but still check their boundaries.

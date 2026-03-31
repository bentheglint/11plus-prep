# Oracle Content Review — Validated Findings

**Reviewed:** 7,529 questions + 581 lessons across 38 topics
**Issues reported by Oracle:** 531
**Validated against actual data:** 2026-03-31

---

## CRITICAL: Wrong Answers (5 confirmed, children seeing incorrect information)

| # | Topic | Question | Marked Answer | Correct Answer | Fix |
|---|-------|----------|--------------|----------------|-----|
| 1 | Speed/Distance/Time | Q25: Train at 55km/h for 2.5 hours | 135 km (idx 3) | 137.5 km (idx 4) | Change `correct: 3` to `correct: 4` |
| 2 | Speed/Distance/Time | Q54: 3500m in 20 minutes | 10 km/h (idx 2) | 10.5 km/h (idx 3) | Change `correct: 2` to `correct: 3` |
| 3 | Speed/Distance/Time | Q114: 6500m in 26 minutes | 16 km/h (idx 3) | 15 km/h (idx 2) | Change `correct: 3` to `correct: 2` |
| 4 | Negative Numbers | Q170: Sum of 6th+7th terms | -26 (idx 1) | -31 (idx 0) | Change `correct: 1` to `correct: 0` |
| 5 | Prime Numbers | Q127: Primes from 1-50 | 16 (idx 4) | 15 (idx 3) | Change `correct: 4` to `correct: 3` |

## CRITICAL: Garbled/Broken Explanations (6 confirmed)

| # | Topic | Question | Problem | Fix |
|---|-------|----------|---------|-----|
| 1 | Word Code Analogies | Q88 | Self-correcting debug text: "wait — SEAT minus S = EAT, not ATE" | Rewrite explanation |
| 2 | Word Code Analogies | Q95 | Inconsistent rule: "G→D in one pair, G→B in another" | Rewrite explanation |
| 3 | Word Code Analogies | Q97 | Debug text: "PEACH → CH+EAP = CHEAP? Let me check..." | Rewrite explanation |
| 4 | Word Code Analogies | Q100 | Debug text: "SHORE→HORSE (S moves from pos 1 to between..." | Rewrite explanation |
| 5 | Hidden Words | Q3 | Self-correcting text: "beaCH and ANDd" | Rewrite explanation |
| 6 | Hidden Words | Q40 | Garbled text: "the first three of 'onset' — wait..." | Rewrite explanation |

## CRITICAL: Broken Questions (2 confirmed)

| # | Topic | Question | Problem | Fix |
|---|-------|----------|---------|-----|
| 1 | Hidden Words | Q138 | Answer is "CAL" — not a real English word. Clue says "baby cow" (CALF, 4 letters) | Replace question |
| 2 | Letter Codes | Q8 | Trivially circular: "If CAT=DBU, what is code for CAT?" — answer is in the question | Replace question |

## CRITICAL: Orphaned Question Sets (2 confirmed — children get NO lesson before quiz)

| # | Topic | Sub-concept | Questions affected | Fix |
|---|-------|------------|-------------------|-----|
| 1 | Ratio | master-sharing-ratio | 48 questions (27% of topic) | Create lessons OR remap to existing sub-concepts |
| 2 | Fractions | master-adding-fractions | 10 questions | Create lessons OR remap |

## CRITICAL: FALSE POSITIVES (Oracle was wrong — 3 issues)

| # | Issue | Why Oracle was wrong |
|---|-------|---------------------|
| 1 | DIV Q172: Oracle said answer 21 is wrong | Q asks "how many rows NEEDED" — 250/12 = 20r10, so 21 rows needed. Answer is correct. |
| 2 | SEQ Q37: Oracle said answer 97 needs verification | 4,7,13,25,49 — diffs double (3,6,12,24,48). 49+48=97. Correct. |
| 3 | SEQ Q43: Oracle said answer 125 needs verification | 1,5,13,29,61 — diffs double (4,8,16,32,64). 61+64=125. Correct. |

## CRITICAL: Debatable (need human decision — 3 issues)

| # | Issue | Context |
|---|-------|---------|
| 1 | PUN Q7: "My sister who is seven years old" marked No Mistake | Non-defining relative clause arguably needs commas, but GL typically accepts both interpretations |
| 2 | PUN Q18: "My grandparents who live in Scotland" marked No Mistake | Same pattern as Q7 |
| 3 | PUN Q116: "new the answer" marked No Mistake | Contains spelling error (new→knew) but it's a PUNCTUATION test. Technically no punctuation error exists, but children will spot the mistake and be confused |

---

## HIGH SEVERITY: Structural Issues (verified)

### Massive VR Duplication: 463 identical-text questions across VR topics
- Letter Move: 32 duplicate texts (25 unique questions repeated 2+ times)
- Hidden Words, Verbal Analogies, Odd Two Out, Letter Pair Series all have confirmed duplicates
- This is FAR more than the Oracle initially reported

### Difficulty Distribution: 12 of 16 maths topics significantly off-target

| Topic | D1 | D2 | D3 | Main problem |
|-------|----|----|----| -------------|
| Target | ~30% | ~40% | ~30% | |
| Percentages | 21% | 55% | 23% | D2 heavy |
| Long Division | 23% | 37% | 41% | D3 heavy |
| Ratio | 21% | 54% | 24% | D2 heavy |
| Fractions | 50% | 32% | 19% | D1 heavy, D3 low |
| Long Multiplication | 20% | 59% | 21% | D2 very heavy |
| Algebra | 28% | 55% | 17% | D2 heavy, D3 low |
| Place Value | 22% | 62% | 16% | D2 very heavy, D3 very low |
| Negative Numbers | 29% | 53% | 18% | D2 heavy, D3 low |
| Area & Perimeter | 41% | 44% | 16% | D1 heavy, D3 very low |
| Volume | 43% | 39% | 19% | D1 heavy, D3 low |
| Sequences | 31% | 51% | 18% | D2 heavy, D3 low |
| Data Handling | 47% | 29% | 24% | D1 very heavy, D2 low |

### Missing Lessons: Multiple topics have question blocks with no teaching content
(Beyond the 2 critical ones above — these are high severity, also confirmed)

### BODMAS Teaching Contradiction (Letter Sums)
- Lesson teaches: "BODMAS does NOT apply to letter sums"
- Question explanations say: "Remember BODMAS — multiplication before subtraction"
- Children get contradictory instruction depending on whether they see lesson or explanation

---

## MEDIUM/LOW: Categories requiring human review (479 issues)

These cannot be automatically verified — they require judgement calls:

| Category | Count | Nature |
|----------|-------|--------|
| Coverage gaps | 52 | GL-tested skills not represented in questions |
| Difficulty mismatches | 52 | Individual questions rated at wrong D1/D2/D3 |
| Lesson quality | 14 | Teaching methods could be improved |
| Mapping efficacy | 18 | Lesson doesn't teach the method needed for the question |
| Poor distractors | 18 | Wrong answers not plausible enough |
| Poor explanations | 24 | Explanations could be clearer or more helpful |
| Tone issues | 8 | Language not warm/age-appropriate enough |
| Repetition | 13+ | Too many similar questions |

---

## Summary: What to fix, in priority order

### Immediate (children seeing wrong information)
1. Fix 5 wrong answers (SDT ×3, NEG ×1, PRM ×1)
2. Rewrite 6 garbled explanations (WCA ×4, HW ×2)
3. Replace 2 broken questions (HW Q138, LC Q8)
4. Decide on 3 debatable punctuation questions (Q7, Q18, Q116)

### Urgent (teaching gaps)
5. Create/remap lessons for orphaned question sets (Ratio 48 Qs, Fractions 10 Qs)
6. Fix BODMAS contradiction in Letter Sums
7. Deduplicate 463 VR identical questions

### Important (quality improvement)
8. Rebalance difficulty distribution across 12 maths topics
9. Review and fix 479 medium/low issues (human review needed)

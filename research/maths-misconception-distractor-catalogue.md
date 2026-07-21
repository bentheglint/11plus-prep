# PrepStep Maths — Misconception Distractor Catalogue

**Authored by the 11+ Oracle (21 Jul 2026), grounded in `research/gl-topic-research/*`.**
**Purpose:** the config spec for the deterministic distractor generator that breaks the
Maths "middle-value" answer tell (benchmark fix #2). Each wrong option is a real
child-error GL exploits, with a mechanisable value-rule, a `needs-working` flag
(yes = requires an intermediate value NOT recoverable from the final answer → the
generator must have parsed/stored it, else fall back or flag the item) and a
`direction` (where the wrong value lands relative to the correct answer **C**).

**Why this breaks the tell:** real errors are asymmetric. Division / multiplication /
volume / sequence errors skew *below* C; "forgot the final step" / "wrong total"
families skew *above*. Selecting a topic-authentic mix pushes the correct value's
sorted rank toward uniform **as a side effect** — so we never engineer a per-item
rank (that would be a new, learnable tell). See the two-review synthesis in the
21 Jul session log.

**Notation:** `C` = correct answer. Operands named per topic. `reverse(x)`,
`swapTensUnits(x)` = digit ops. "Computable from C alone" methods are safest.

**Guardrail:** these mirror *how GL builds wrong answers* (the method), never a real
item, option set, or number list — satisfies `research/past-papers/_USAGE-GUARDRAIL.md`.

---

## The 6 worst topics (deepest)

```yaml
topic: longdivision   # 86% ladder today — biggest offender
# C = quotient; operands N (dividend) ÷ D (divisor); r = N - D*floor(N/D)
methods:
  - name: multiplied-instead-of-divided
    misconception: Saw two numbers, multiplied rather than divided.
    value-rule: N * D
    needs-working: no
    direction: above
  - name: subtracted-instead-of-divided
    misconception: Defaulted to subtraction when unsure of operation.
    value-rule: N - D
    needs-working: no
    direction: above
  - name: halved-the-divisor
    misconception: Used D/2 (bad factor split).
    value-rule: 2 * C
    needs-working: no
    direction: above
  - name: doubled-the-divisor
    misconception: Divided by 2D (mis-factored the divisor).
    value-rule: round(C / 2)
    needs-working: no
    direction: below
  - name: dropped-a-zero-in-quotient
    misconception: Skipped the placeholder 0 when the divisor "didn't go".
    value-rule: C with one internal/trailing 0 deleted (306->36, 170->17)
    needs-working: no        # ONLY when C contains a 0
    direction: below
  - name: floor-when-round-up-needed
    misconception: '"How many needed?" rounded DOWN, ignoring the leftover.'
    value-rule: C - 1        # only when the item's answer was a round-UP
    needs-working: no
    direction: below
  - name: ceil-when-round-down-needed
    misconception: '"How many complete?" rounded UP the leftover.'
    value-rule: C + 1
    needs-working: no
    direction: above
  - name: gave-remainder-not-quotient
    misconception: Answered the leftover instead of the number of groups.
    value-rule: r           # r = N - D*C
    needs-working: yes       # guard for r>1
    direction: below
  - name: remainder-as-decimal-digit
    misconception: Read "6 r6" as 6.6.
    value-rule: C + r/10
    needs-working: yes
    direction: above
# Spread: 1 far-above outlier + dropped-zero (far below) + one +/-1 remainder + one C/2.
```

```yaml
topic: speeddistancetime   # 77% ladder
# C = requested answer; operands dist, t, s (two given, one asked); legs (d1,t1),(d2,t2)
methods:
  - name: minutes-as-decimal
    misconception: Treated X minutes as 0.X hours instead of X/60.
    value-rule: recompute formula with t_wrong = minutes/10 (not /60)
    needs-working: no        # needs raw minutes stored
    direction: either
  - name: averaged-the-speeds
    misconception: Two-leg journey — did (s1+s2)/2 not total-dist / total-time.
    value-rule: (s1 + s2) / 2
    needs-working: yes
    direction: either
  - name: forgot-answer-unit-hours-minutes
    misconception: Left answer in hours when minutes wanted (or vice versa).
    value-rule: C * 60   OR   C / 60
    needs-working: no
    direction: either
  - name: multiplied-instead-of-divided
    misconception: Multiplied distance by time when division needed.
    value-rule: dist * t
    needs-working: no
    direction: above
  - name: distance-unit-not-converted
    misconception: Left distance in metres/km without converting.
    value-rule: C * 1000   OR   C / 1000
    needs-working: no
    direction: either
  - name: kmh-ms-confusion
    misconception: Mixed km/h and m/s (÷3.6 / ×3.6 wrongly).
    value-rule: C * 3.6   OR   round(C / 3.6, 1)
    needs-working: no
    direction: either
  - name: partial-answer-intermediate
    misconception: Gave an intermediate (total distance, time-in-hours) not the asked quantity.
    value-rule: intermediate value
    needs-working: yes
    direction: either
  - name: remaining-journey-added
    misconception: Used total time instead of remaining time.
    value-rule: remaining-distance / TOTAL-time
    needs-working: yes
    direction: below
```

```yaml
topic: anglesshapes   # 63% ladder
# C = missing angle; operands = given angle(s) a,b; polygon sides n
methods:
  - name: supplementary-confusion
    misconception: Gave the angle on the other side of the straight line.
    value-rule: 180 - C
    needs-working: no
    direction: either
  - name: triangle-used-360-not-180
    misconception: Used the quadrilateral/point sum for a triangle.
    value-rule: C + 180
    needs-working: no
    direction: above
  - name: quad-used-180-not-360
    misconception: Used the triangle/line sum for a quadrilateral.
    value-rule: C - 180
    needs-working: no
    direction: below
  - name: forgot-to-halve-base-angles
    misconception: Isosceles — gave (180-apex) without splitting the two base angles.
    value-rule: 2 * C
    needs-working: no
    direction: above
  - name: isosceles-wrong-configuration
    misconception: Assumed given angle was apex when it was a base angle (or vice versa).
    value-rule: if C=180-2a -> (180-a)/2 ; if C=(180-a)/2 -> 180-2a
    needs-working: yes
    direction: either
  - name: wrote-the-total
    misconception: Wrote the angle-sum (180/360) instead of the missing angle.
    value-rule: 180  OR  360
    needs-working: no
    direction: above
  - name: polygon-gave-sum-not-each
    misconception: Regular polygon — gave interior-angle SUM not one interior angle.
    value-rule: C * n
    needs-working: no        # needs n
    direction: above
  - name: interior-exterior-swap
    misconception: Gave exterior when interior asked (or vice versa).
    value-rule: 180 - C
    needs-working: no
    direction: either
  - name: arithmetic-slip
    misconception: Small mental-arithmetic error in the angle sum.
    value-rule: C +/- 10   (ONE side)
    needs-working: no
    direction: either
```

```yaml
topic: longmultiplication   # 61% ladder
# C = product; operands a (multiplicand) x b (multiplier)
methods:
  - name: missing-placeholder-zero
    misconception: Omitted the placeholder 0 on the tens partial product.
    value-rule: a*(b%10) + a*floor(b/10)
    needs-working: no
    direction: below
  - name: added-instead-of-multiplied
    misconception: Added the two numbers instead of multiplying.
    value-rule: a + b
    needs-working: no
    direction: below
  - name: only-one-partial-product
    misconception: Multiplied by the units digit only.
    value-rule: a * (b % 10)
    needs-working: no
    direction: below
  - name: multiplier-digits-reversed
    misconception: Misread x26 as x62.
    value-rule: a * reverse(b)
    needs-working: no
    direction: either
  - name: times-table-slip
    misconception: One wrong times-table fact.
    value-rule: C +/- a   (ONE side)
    needs-working: no
    direction: either
  - name: carry-error
    misconception: Dropped or mis-sized a carry.
    value-rule: C +/- 10  or  C +/- 100  (choose one)
    needs-working: no
    direction: either
  - name: pence-pounds-not-converted
    misconception: Left money in pence, or misplaced the £ decimal.
    value-rule: C * 100   OR   C / 100
    needs-working: no
    direction: either
  - name: decimal-place-misplaced
    misconception: Wrong number of decimal places.
    value-rule: C * 10   OR   C / 10
    needs-working: no
    direction: either
  - name: forgot-final-step
    misconception: Gave the product before the required add/subtract.
    value-rule: un-adjusted product (intermediate)
    needs-working: yes
    direction: above
```

```yaml
topic: ratio   # 58% ladder
# C = a person's share; T total; parts p:q(:r); sum = p+q(+r)
methods:
  - name: reversed-share
    misconception: Gave the OTHER person's share.
    value-rule: T - C        # 2-part
    needs-working: no
    direction: either
  - name: divided-by-one-part
    misconception: Divided total by a single ratio number, not the sum.
    value-rule: T / p   (or T / q)
    needs-working: no
    direction: above
  - name: gave-one-part-value
    misconception: Stopped at the value of one "part".
    value-rule: T / sum
    needs-working: no
    direction: below
  - name: split-equally-ignored-ratio
    misconception: Shared the total equally between the people.
    value-rule: T / (number of people)
    needs-working: no
    direction: either
  - name: additive-not-multiplicative
    misconception: Scaled a ratio by ADDING the difference (2:3 -> 6:7).
    value-rule: target_part + scaleStep
    needs-working: yes
    direction: below
  - name: working-backwards-times-sum
    misconception: Given one share, multiplied by total parts not one part first.
    value-rule: share * sum
    needs-working: yes
    direction: above
  - name: part-to-whole-confusion       # fraction-answer items only
    misconception: Read 3:4 as 3/4 not 3/7 of the whole.
    value-rule: p/q instead of p/sum
    needs-working: no
    direction: above
  - name: unit-not-converted
    misconception: Scale/map — didn't convert m/cm/km before the ratio.
    value-rule: C * 100  OR  C / 100  (or *1000 / /1000)
    needs-working: no
    direction: either
```

```yaml
topic: datahandling   # 58% ladder — MOST working-dependent topic
# C = answer; X,Y read values; n count; interval axis step; key pictogram key
methods:
  - name: sum-not-difference
    misconception: '"How many more X than Y?" answered with X+Y.'
    value-rule: X + Y
    needs-working: yes
    direction: above
  - name: gave-one-value-not-difference
    misconception: Gave X alone for a "how many more" question.
    value-rule: X (larger value)
    needs-working: yes
    direction: above
  - name: mean-forgot-to-divide
    misconception: Gave the SUM instead of the mean.
    value-rule: C * n
    needs-working: no        # if n known
    direction: above
  - name: mean-wrong-count
    misconception: Divided the sum by n+/-1.
    value-rule: (C*n)/(n-1)  OR  (C*n)/(n+1)
    needs-working: yes
    direction: either
  - name: scale-misread-grid-squares
    misconception: Read grid squares, not the value (ignored the interval).
    value-rule: C / interval
    needs-working: no        # if interval known
    direction: below
  - name: pictogram-ignored-key
    misconception: Counted symbols without the key multiplier.
    value-rule: C / key   OR  C +/- key/2
    needs-working: no        # if key known
    direction: below
  - name: range-gave-highest
    misconception: Gave the highest value instead of highest - lowest.
    value-rule: highest
    needs-working: yes
    direction: above
  - name: median-not-ordered
    misconception: Took the middle of the UNordered list.
    value-rule: middle element as presented
    needs-working: yes
    direction: either
  - name: pie-fraction-error
    misconception: Used the wrong simple fraction of the total.
    value-rule: total * wrongFraction
    needs-working: yes
    direction: either
  - name: venn-only-vs-total
    misconception: Counted the whole circle instead of the "only" region.
    value-rule: C + overlap
    needs-working: yes
    direction: above
# Only mean-forgot-to-divide (C*n), scale-misread (C/interval), pictogram (C/key)
# are C-derivable. Everything else NEEDS stored working — do NOT synthesise from C
# alone or it collapses back into a ladder.
```

---

## The other 10 topics (3–5 methods each)

```yaml
topic: percentages   # 31% ladder — largely healthy
# C = answer; operands p (percent), B (base); d = p% of B
methods:
  - name: gave-discount-not-final-price
    misconception: Found the % amount, forgot to subtract/add it.
    value-rule: B - C
    needs-working: no
    direction: below
  - name: percentage-as-divisor
    misconception: Divided base by the percentage number (80/25 not 80/4).
    value-rule: B / p
    needs-working: no
    direction: below
  - name: complement-confusion
    misconception: Gave p% when (100-p)% wanted.
    value-rule: B - C
    needs-working: no
    direction: either
  - name: increase-decrease-swapped
    misconception: Added the % when it should be subtracted.
    value-rule: 2*B - C
    needs-working: no
    direction: above
  - name: decimal-place-shift
    misconception: Misplaced the decimal /x 100.
    value-rule: C * 10  OR  C / 10
    needs-working: no
    direction: either
```

```yaml
topic: decimals   # 12% ladder — nearly clean
methods:
  - name: ignored-decimal-point
    misconception: Treated the decimal as a whole number (7.2 -> 72).
    value-rule: C * 10^k     # k = decimal places
    needs-working: no
    direction: above
  - name: added-zero-not-shifted
    misconception: '"x10 = add a zero" — mis-shifted.'
    value-rule: C / 10
    needs-working: no
    direction: below
  - name: rounded-wrong-digit
    misconception: Wrong column when rounding, or truncated at 5.
    value-rule: C +/- 0.1  (one side)
    needs-working: no
    direction: either
  - name: reverse-conversion-operation
    misconception: Divided when should multiply on a conversion.
    value-rule: C / 100  OR  C / 1000
    needs-working: no
    direction: below
  - name: fraction-denominator-as-decimal
    misconception: Wrote 3/8 as 0.38.
    value-rule: literal 0.<num><den>
    needs-working: yes
    direction: either
```

```yaml
topic: fractions   # 50% ladder
methods:
  - name: multiplied-not-divided
    misconception: For "1/3 of 60" multiplied by the denominator.
    value-rule: N * den / num
    needs-working: no
    direction: above
  - name: added-denominators
    misconception: a/b + c/d -> (a+c)/(b+d).
    value-rule: (a+c)/(b+d)
    needs-working: no
    direction: either
  - name: took-fraction-of-original-not-remainder
    misconception: Second fraction of the whole, not "of the remainder".
    value-rule: secondFraction * original
    needs-working: yes
    direction: above
  - name: reverse-working-forwards
    misconception: '"3/4 eaten, 12 left" -> took 3/4 of 12.'
    value-rule: fraction * given-leftover
    needs-working: yes
    direction: below
  - name: forgot-to-simplify
    misconception: Gave the unsimplified equivalent (fraction-answer items only).
    value-rule: equivalent unreduced fraction
    needs-working: no        # ONLY when options are fraction strings
    direction: n/a
```

```yaml
topic: algebra   # 33% ladder — fairly healthy
methods:
  - name: bidmas-left-to-right
    misconception: Evaluated left-to-right, ignoring order of operations.
    value-rule: evaluate strictly left-to-right
    needs-working: no
    direction: either
  - name: coefficient-as-addition
    misconception: Read 3x as 3+x.
    value-rule: coeff + varValue
    needs-working: no
    direction: below
  - name: operation-reversed
    misconception: Applied +k instead of -k when isolating x.
    value-rule: C + 2k
    needs-working: no
    direction: above
  - name: forgot-second-step
    misconception: One inverse op, stopped before dividing by the coefficient.
    value-rule: intermediate value (3x not x)
    needs-working: yes
    direction: above
  - name: distribution-error
    misconception: 2(x+3) -> 2x+3.
    value-rule: recompute with only the first term multiplied
    needs-working: yes
    direction: below
  - name: nth-term-bidmas-or-offset
    misconception: 2n+3 at n=5 -> 2(5+3)=16, or started n at 0.
    value-rule: coeff*(n+const)  OR  formula at (n-1)
    needs-working: no
    direction: either
```

```yaml
topic: placevalue   # 5% ladder — the CLEANEST topic
methods:
  - name: digit-not-value
    misconception: Gave the bare digit not its place value (6 not 60000).
    value-rule: the digit itself
    needs-working: no
    direction: below
  - name: adjacent-place
    misconception: Read the neighbouring column's value.
    value-rule: C * 10  OR  C / 10
    needs-working: no
    direction: either
  - name: rounded-to-wrong-place
    misconception: Rounded to nearest 100 when 1000 asked.
    value-rule: round(N, adjacentPlace)
    needs-working: no
    direction: either
  - name: five-rounds-down / truncated
    misconception: Rounded the boundary 5 down, or truncated.
    value-rule: C - roundingUnit
    needs-working: no
    direction: below
  - name: powers-of-10-wrong-direction
    misconception: x10 sent digits the wrong way.
    value-rule: C / 100
    needs-working: no
    direction: below
```

```yaml
topic: negativenumbers   # 14% ladder
methods:
  - name: dropped-the-sign
    misconception: Correct magnitude, lost the minus.
    value-rule: abs(C)
    needs-working: no
    direction: above         # when C<0
  - name: all-positive-calculation
    misconception: Treated every number as positive.
    value-rule: recompute with all operands positive
    needs-working: no
    direction: above
  - name: off-by-one-through-zero
    misconception: Miscounted across zero.
    value-rule: C +/- 1  (one side)
    needs-working: no
    direction: either
  - name: subtraction-reversed
    misconception: Subtracted the wrong way (3-8 -> 5 not -5).
    value-rule: -C
    needs-working: no
    direction: either
  - name: two-negatives-make-positive-misapplied
    misconception: Applied the x-rule to subtraction (-5-6 -> +11).
    value-rule: abs of the flipped-sign result
    needs-working: no
    direction: above
```

```yaml
topic: primenumbersfactors   # 31% ladder — categorical, structurally tell-resistant
methods:
  - name: odd-composite-looks-prime
    misconception: '"All odd numbers are prime."'
    value-rule: pool {9,15,21,25,27,33,35,39,49,51,57,63,87,91} near range
    needs-working: no
    direction: n/a
  - name: included-one-as-prime
    misconception: '"1 is the smallest prime."'
    value-rule: offer 1
    needs-working: no
    direction: n/a
  - name: multiple-instead-of-factor
    misconception: Confused factors with multiples.
    value-rule: C * k (small k)
    needs-working: no
    direction: above
  - name: hcf-lcm-swap
    misconception: Gave LCM when HCF asked.
    value-rule: LCM(x,y) when HCF asked / vice versa
    needs-working: no
    direction: either
  - name: lcm-as-product
    misconception: LCM = just multiply the two numbers.
    value-rule: x * y
    needs-working: no
    direction: above
  - name: squared-as-doubled / cubed-as-tripled
    misconception: 7^2 read as 7x2.
    value-rule: 2*base (squares) / 3*base (cubes)
    needs-working: no
    direction: below
```

```yaml
topic: areaperimeter   # 16% ladder — healthy
methods:
  - name: area-perimeter-swap
    misconception: Calculated the other quantity.
    value-rule: if C=area -> 2*(L+W) ; if C=perimeter -> L*W
    needs-working: no
    direction: either
  - name: forgot-to-double-perimeter
    misconception: Gave L+W instead of 2(L+W).
    value-rule: C / 2
    needs-working: no
    direction: below
  - name: forgot-to-halve-triangle
    misconception: Gave base x height without /2.
    value-rule: 2 * C
    needs-working: no
    direction: above
  - name: unit-conversion-error
    misconception: Used 1 m^2 = 100 cm^2 instead of 10000.
    value-rule: C * 100  OR  C / 100
    needs-working: no
    direction: either
  - name: slant-not-perpendicular-height
    misconception: Used the sloping side, not the perpendicular height.
    value-rule: recompute with slant length
    needs-working: yes
    direction: above
```

```yaml
topic: volume   # 25% ladder
methods:
  - name: area-not-volume
    misconception: Multiplied only two dimensions (a face area).
    value-rule: L*W (or W*H, L*H)
    needs-working: no
    direction: below
  - name: added-dimensions
    misconception: Added L+W+H instead of multiplying.
    value-rule: L + W + H
    needs-working: no
    direction: below
  - name: squared-not-cubed
    misconception: For a cube, computed e^2 not e^3.
    value-rule: e^2  (= C^(2/3))
    needs-working: no
    direction: below
  - name: unit-conversion-power-of-10
    misconception: Used /10 or /100 instead of /1000.
    value-rule: C / 10  OR  C * 10
    needs-working: no
    direction: either
  - name: off-by-one-multiplication
    misconception: 7x8 slip cascades.
    value-rule: C +/- (one dimension)  (one side)
    needs-working: no
    direction: either
```

```yaml
topic: sequences   # 44% ladder
methods:
  - name: wrote-the-step-not-term
    misconception: Gave the common difference not the next term.
    value-rule: d           # last - previous
    needs-working: no
    direction: below
  - name: simple-linear-assumption
    misconception: Assumed constant first difference on a changing sequence.
    value-rule: lastTerm + firstDifference
    needs-working: no
    direction: below
  - name: geometric-added-not-multiplied
    misconception: Added the last gap instead of multiplying.
    value-rule: lastTerm + (lastTerm - previousTerm)
    needs-working: no
    direction: below
  - name: positive-negative-through-zero
    misconception: Descending past zero — forgot it goes negative.
    value-rule: abs(C)
    needs-working: no
    direction: above
  - name: off-by-one-step
    misconception: Miscounted the step size by one.
    value-rule: C +/- 1  (one side)
    needs-working: no
    direction: either
  - name: nth-term-bidmas
    misconception: 2n+3 -> 2(n+3).
    value-rule: coeff*(n+const)
    needs-working: yes
    direction: above
```

---

## Cross-cutting notes for the generator

**1. Topics needing stored working (fall-back / flag mandatory):** `datahandling`
(dataset not recoverable from C — only mean/scale/pictogram are C-derivable),
`speeddistancetime` (averaged-speeds, partial-answer, remaining-journey), `ratio`
(additive, working-backwards), `fractions` (of-remainder, reverse-working), `algebra`
(forgot-second-step, distribution), `areaperimeter` (slant), `anglesshapes`
(isosceles-config). Extend each record with a parsed `operands` (and `intermediates`)
object; where parse fails, FLAG the item for authoring — never fall back to symmetric
offsets around C (that recreates the ladder).

**2. Value-type must match option format.** `forgot-to-simplify`, `part-to-whole`
and the prime/factor pool methods only produce valid distractors when options are
fractions / selected numbers, not decimals. Guard on answer-type.

**3. Plausibility guards.** Skip a method when its value collides with C, is negative
where forbidden, is a non-integer where only integers make sense, or is implausibly
tiny (`gave-remainder`, `wrote-the-step`). Better fewer real misconception distractors
+ one different-direction plausible value than an implausible one.

**4. Rank-rotation rule (breaks the 52.6% tell).** Do NOT engineer a per-item rank.
Because these values are intrinsically asymmetric, a topic-appropriate mix already
pushes middle-rate toward chance. Final generator assertion: reject any option set that
is a constant-spacing ladder, or that leaves C as the median more than ~25% within a
topic.

**5. GL authenticity.** Every method is drawn from `research/gl-topic-research/{topic}.md`
distractor-design / common-traps sections — the METHOD, never a real item — satisfying
the verbatim-copy guardrail.

**Source:** `research/gl-topic-research/` (16 topic deep-dives), `src/questionData/mathsData.js`.
Topic keys: percentages, decimals, longdivision, ratio, fractions, longmultiplication,
algebra, placevalue, negativenumbers, primenumbersfactors, areaperimeter, volume,
anglesshapes, sequences, datahandling, speeddistancetime.

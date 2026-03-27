# Wave 1 Research: Micro-Lessons for All 15 Remaining Topics

Comprehensive sub-concept breakdown for every maths topic, compiled from research agents that analysed our existing App.js questions, the KS2 National Curriculum, and educational sources (Third Space Learning, NCETM, NRICH, Gov.uk).

**Reference:** See `PLAYBOOK.md` for the repeatable process, lesson structure, and quality checklist.

---

## How to Read This Document

Each topic follows the same structure:
1. **KS2 Curriculum Progression** — what UK schools teach Y3-Y6
2. **Sub-Concepts** — granular teachable units with category (core/supporting/other)
3. **Common Mistakes** — specific errors for spot-the-mistake lessons
4. **Visual Components** — existing or new components needed
5. **Learning Goals** — per sub-concept
6. **Question Alignment** — how sub-concepts map to our App.js questions

Category weighting: **core ~50%, supporting ~30%, other ~20%** (adjustable per topic).

---

## Table of Contents

### Batch 1 — Existing Visual Components
1. [Fractions](#1-fractions) — 14 sub-concepts, 28 lessons
2. [Decimals](#2-decimals) — 15 sub-concepts, 30 lessons
3. [Percentages](#3-percentages) — 14 sub-concepts, 28 lessons
4. [Ratio & Proportion](#4-ratio--proportion) — 8 sub-concepts, 16 lessons
5. [Negative Numbers](#5-negative-numbers) — 9 sub-concepts, 18 lessons

### Batch 2 — Existing Visual Components
6. [Algebra](#6-algebra) — 9 sub-concepts, 18 lessons
7. [Place Value & Rounding](#7-place-value--rounding) — 9 sub-concepts, 18 lessons
8. [Sequences](#8-sequences) — 9 sub-concepts, 18 lessons
9. [Prime Numbers & Factors](#9-prime-numbers--factors) — 9 sub-concepts, 18 lessons
10. [Speed, Distance, Time](#10-speed-distance-time) — 10 sub-concepts, 20 lessons

### Batch 3 — New Visual Components Needed
11. [Long Division](#11-long-division) — 7 sub-concepts, 14 lessons
12. [Area & Perimeter](#12-area--perimeter) — 10 sub-concepts, 20 lessons
13. [Volume](#13-volume) — 9 sub-concepts, 18 lessons
14. [Angles & Shapes](#14-angles--shapes) — 11 sub-concepts, 22 lessons
15. [Data Handling](#15-data-handling) — 11 sub-concepts, 22 lessons

**Grand Total: 154 sub-concepts, 308 lessons, 1,540 screens, 924+ unique experiences**

---

# BATCH 1: Fractions, Decimals, Percentages, Ratio, Negative Numbers

---

## 1. Fractions

### KS2 Progression

**Year 3:** Count in tenths. Recognise unit/non-unit fractions of a set. Recognise equivalent fractions with small denominators. Add/subtract fractions with same denominator within one whole. Compare and order unit fractions.

**Year 4:** Recognise families of equivalent fractions. Count in hundredths. Add/subtract fractions with same denominator. Recognise decimal equivalents (1/4, 1/2, 3/4). Divide by 10 and 100 to make tenths/hundredths.

**Year 5:** Compare/order fractions with related denominators. Identify, name and write equivalent fractions. Convert mixed numbers ↔ improper fractions. Add/subtract fractions with related denominators. Multiply fractions by whole numbers. FDP equivalence.

**Year 6:** Simplify fractions using common factors. Add/subtract fractions with any denominators. Multiply pairs of proper fractions. Divide fractions by whole numbers. Calculate decimal fraction equivalents. Full FDP equivalence in context.

### Sub-Concepts (14 — 28 lessons)

| # | ID | Name | Category | Template A | Template B |
|---|---|------|----------|-----------|-----------|
| 1 | `equivalent-fractions` | Finding equivalent fractions by ×/÷ top and bottom | core | step-by-step | visual-discovery |
| 2 | `simplifying-fractions` | Simplifying to simplest form using HCF | core | step-by-step | spot-the-mistake |
| 3 | `comparing-fractions` | Comparing/ordering by converting to common denominator | core | step-by-step | spot-the-mistake |
| 4 | `adding-same-denom` | Adding fractions with same denominator | core | step-by-step | curiosity-hook |
| 5 | `subtracting-same-denom` | Subtracting fractions with same denominator | core | step-by-step | spot-the-mistake |
| 6 | `adding-diff-denom` | Adding fractions with different denominators | core | step-by-step | spot-the-mistake |
| 7 | `subtracting-diff-denom` | Subtracting fractions with different denominators | core | step-by-step | curiosity-hook |
| 8 | `fraction-of-amount` | Finding a fraction of a quantity (÷ denom, × numer) | supporting | step-by-step | curiosity-hook |
| 9 | `fraction-to-decimal` | Converting fraction → decimal by dividing | supporting | step-by-step | key-fact |
| 10 | `decimal-to-fraction` | Converting decimal → fraction and simplifying | supporting | step-by-step | visual-discovery |
| 11 | `fraction-to-percentage` | Converting fraction ↔ percentage | supporting | key-fact | spot-the-mistake |
| 12 | `mixed-improper` | Converting mixed numbers ↔ improper fractions | other | step-by-step | spot-the-mistake |
| 13 | `multiplying-fractions` | Multiplying a fraction by a whole number | other | step-by-step | spot-the-mistake |
| 14 | `fraction-word-problems` | Multi-step fraction word problems | other | curiosity-hook | spot-the-mistake |

**Category weights:** core 50% (#1-7), supporting 29% (#8-11), other 21% (#12-14)

### Common Mistakes

1. **Adding denominators when adding fractions** — 1/2 + 1/4 = 2/6 (adding across top AND bottom) instead of finding common denominator first
2. **Thinking larger denominator = larger fraction** — believing 1/8 > 1/4 because 8 > 4
3. **Not simplifying fully** — simplifying 12/18 to 6/9 but stopping there (HCF of 12 and 18 is 6, answer is 2/3)
4. **Changing only one part when finding equivalents** — multiplying numerator but forgetting denominator (or vice versa)
5. **Multiplying the wrong part by whole number** — 3/5 × 4 = 3/20 instead of 12/5
6. **Fraction of amount: dividing by numerator** — for "3/4 of 20", dividing 20 by 3 instead of 20 by 4
7. **Not believing fractions can be bigger than 1** — not recognising 5/4 or 7/3 as valid
8. **Comparing without common denominator** — thinking 2/5 > 3/7 without converting

### Visual Components

- **BarModel** (existing) — fraction segments, comparison bars, shaded portions
- **WorkedExample** (existing) — step-by-step adding/subtracting/simplifying
- **NumberLine** (existing) — placing fractions for comparing/ordering
- **NEW: FractionWall** — stacked horizontal bars showing halves, thirds, quarters etc. aligned so equivalences are visible (standard KS2 classroom resource). Props: `denominators`, `highlight`, `showLabels`.

### Learning Goals

- `equivalent-fractions`: ["How to find an equivalent fraction by multiplying or dividing top and bottom by the same number", "Why 2/4 and 1/2 are the same amount"]
- `simplifying-fractions`: ["How to simplify a fraction by dividing top and bottom by the same number", "How to find the highest common factor to get the simplest form"]
- `comparing-fractions`: ["How to compare fractions by converting to the same denominator", "Why you can only compare fractions when the pieces are the same size"]
- `adding-same-denom`: ["How to add fractions when the denominators are the same", "Why we add the numerators but keep the denominator"]
- `subtracting-same-denom`: ["How to subtract fractions when the denominators are the same", "Why we subtract the numerators but keep the denominator"]
- `adding-diff-denom`: ["How to find a common denominator before adding", "How to convert both fractions so the denominators match"]
- `subtracting-diff-denom`: ["How to find a common denominator before subtracting", "Why 2/3 - 1/6 needs converting before you can subtract"]
- `fraction-of-amount`: ["How to find a fraction of a number: divide by the bottom, multiply by the top", "Why finding 1/4 first helps you find 3/4"]
- `fraction-to-decimal`: ["How to turn a fraction into a decimal by dividing", "Which common fractions you should know as decimals (1/2=0.5, 1/4=0.25, 3/4=0.75)"]
- `decimal-to-fraction`: ["How to turn a decimal like 0.6 into a fraction", "How to simplify 6/10 to 3/5"]
- `fraction-to-percentage`: ["How to turn a fraction into a percentage", "Why percent means out of 100"]
- `mixed-improper`: ["How to turn a mixed number like 2 1/3 into an improper fraction", "How to turn an improper fraction like 7/4 into a mixed number"]
- `multiplying-fractions`: ["How to multiply a fraction by a whole number", "Why you only multiply the top number (numerator)"]
- `fraction-word-problems`: ["How to spot which operation to use in a fractions word problem", "How to check your answer makes sense"]

---

## 2. Decimals

### KS2 Progression

**Year 4:** Recognise decimal equivalents of tenths/hundredths and 1/4, 1/2, 3/4. Divide by 10/100. Round decimals (1dp) to nearest whole. Compare decimals to 2dp.

**Year 5:** Read/write/order/compare to 3dp. Thousandths linked to tenths/hundredths. Round to 1dp. ×/÷ by 10/100/1000. Add/subtract tenths mentally. All four operations with simple decimals to 2dp.

**Year 6:** Identify digit value to 3dp. Multiply 1-digit × decimals to 2dp. Written division with decimal answers. Round to required accuracy. FDP equivalence. ×/÷ by 10/100/1000 to 3dp.

### Sub-Concepts (15 — 30 lessons)

| # | ID | Name | Category | Template A | Template B |
|---|---|------|----------|-----------|-----------|
| 1 | `decimal-place-value` | What each digit means (tenths, hundredths, thousandths) | core | visual-discovery | key-fact |
| 2 | `comparing-decimals` | Comparing/ordering by place value column left to right | core | step-by-step | spot-the-mistake |
| 3 | `adding-decimals` | Adding decimals by lining up decimal points | core | step-by-step | spot-the-mistake |
| 4 | `subtracting-decimals` | Subtracting decimals by lining up decimal points | core | step-by-step | spot-the-mistake |
| 5 | `multiply-by-10-100-1000` | Multiplying by 10/100/1000 — decimal point moves right | core | key-fact | spot-the-mistake |
| 6 | `divide-by-10-100-1000` | Dividing by 10/100/1000 — decimal point moves left | core | key-fact | spot-the-mistake |
| 7 | `multiplying-decimals-whole` | Multiplying decimal × whole number (e.g. 3.2 × 4) | supporting | step-by-step | curiosity-hook |
| 8 | `dividing-to-decimal` | Dividing to get a decimal answer (e.g. 7 ÷ 4 = 1.75) | supporting | step-by-step | curiosity-hook |
| 9 | `rounding-decimals` | Rounding to nearest whole or 1dp | supporting | step-by-step | spot-the-mistake |
| 10 | `decimal-to-fraction` | Converting decimal → fraction and simplifying | supporting | step-by-step | key-fact |
| 11 | `fraction-to-decimal` | Converting fraction → decimal by dividing | supporting | step-by-step | visual-discovery |
| 12 | `decimal-to-percentage` | Converting decimal → percentage (× 100) | other | key-fact | spot-the-mistake |
| 13 | `multiplying-decimal-by-decimal` | Multiplying two decimals (count decimal places) | other | step-by-step | spot-the-mistake |
| 14 | `dividing-decimal-by-decimal` | Dividing by a decimal (make divisor whole first) | other | step-by-step | curiosity-hook |
| 15 | `decimal-word-problems` | Multi-step problems with money, measures, decimals | other | curiosity-hook | spot-the-mistake |

**Category weights:** core 40% (#1-6), supporting 33% (#7-11), other 27% (#12-15)

### Common Mistakes

1. **Thinking 0.10 > 0.2 because 10 > 2** — applying whole-number logic to decimals
2. **Not lining up decimal points when adding/subtracting** — aligning last digit instead of decimal point
3. **Moving decimal point wrong direction** — multiplying by 10 but moving left instead of right
4. **Ignoring trailing zeros** — thinking 3.70 is different from 3.7
5. **Counting decimal places wrong when multiplying** — 0.8 × 0.6 = 4.8 instead of 0.48
6. **Reading decimals incorrectly** — saying "eight point seventy-six" instead of "eight point seven six"
7. **Rounding: looking at wrong digit** — rounding 7.68 to 1dp by looking at the 7 or 6 instead of the 8
8. **Adding a zero when × by 10** — writing 3.4 × 10 = 3.40 instead of 34

### Visual Components

- **PlaceValueChart** (existing) — digit values in columns, ×/÷ by powers of 10
- **WorkedExample** (existing) — column addition/subtraction/multiplication
- **NumberLine** (existing) — ordering, rounding (which end is closer)
- **No new components needed**

### Learning Goals

- `decimal-place-value`: ["What each digit means after the decimal point", "Why the position of a digit changes its value"]
- `comparing-decimals`: ["How to compare decimals by looking at each column from left to right", "Why 0.8 is bigger than 0.08 even though 8 = 8"]
- `adding-decimals`: ["How to add decimals by lining up the decimal points", "Why lining up the points matters"]
- `subtracting-decimals`: ["How to subtract decimals by lining up the decimal points", "How to borrow across the decimal point"]
- `multiply-by-10-100-1000`: ["How multiplying by 10 moves every digit one place to the left", "Why 'adding a zero' does not work with decimals"]
- `divide-by-10-100-1000`: ["How dividing by 10 moves every digit one place to the right", "What happens when you divide a small number by 100"]
- `multiplying-decimals-whole`: ["How to multiply a decimal by a whole number", "How to use partitioning to make it easier"]
- `dividing-to-decimal`: ["How to keep dividing past the decimal point to get an exact answer", "When a remainder turns into a decimal"]
- `rounding-decimals`: ["How to round a decimal to 1 decimal place or the nearest whole number", "Which digit to look at when deciding to round up or down"]
- `decimal-to-fraction`: ["How to write a decimal as a fraction over 10, 100 or 1000", "How to simplify the fraction afterwards"]
- `fraction-to-decimal`: ["How to turn a fraction into a decimal by dividing", "Which common fractions you should know as decimals"]
- `decimal-to-percentage`: ["How to convert a decimal to a percentage by multiplying by 100", "Why 0.5 = 50% and 0.05 = 5% are very different"]
- `multiplying-decimal-by-decimal`: ["How to multiply two decimals together", "How to count total decimal places to place the point correctly"]
- `dividing-decimal-by-decimal`: ["How to divide by a decimal by making the divisor a whole number first", "Why 5.4 ÷ 0.6 is the same as 54 ÷ 6"]
- `decimal-word-problems`: ["How to spot which operation to use in a decimals word problem", "How to check your answer is sensible"]

---

## 3. Percentages

### KS2 Progression

**Year 5:** Recognise % symbol. Understand percent = parts per hundred. Write percentages as fractions/decimals. FDP equivalents of 1/2, 1/4, 1/5, 2/5, 4/5.

**Year 6:** Full FDP equivalence in context. Calculate percentages of measures (e.g. 15% of 360). Use percentages for comparison.

### Sub-Concepts (14 — 28 lessons)

| # | ID | Name | Category | Template A | Template B |
|---|---|------|----------|-----------|-----------|
| 1 | `percent-means-per-hundred` | Understanding % = out of 100, connecting to hundredths | core | visual-discovery | key-fact |
| 2 | `common-percentages` | Key equivalences: 50%=1/2, 25%=1/4, 10%=1/10, 75%=3/4, 20%=1/5 | core | key-fact | spot-the-mistake |
| 3 | `finding-10-percent` | Finding 10% by dividing by 10 | core | step-by-step | curiosity-hook |
| 4 | `building-percentages` | Building other %s from 10% and 1% (e.g. 35% = 30% + 5%) | core | step-by-step | spot-the-mistake |
| 5 | `percentage-of-amount` | Finding any % of an amount using building-block method | core | step-by-step | curiosity-hook |
| 6 | `express-as-percentage` | Expressing one number as % of another ((part÷whole)×100) | core | step-by-step | spot-the-mistake |
| 7 | `percentage-increase` | Percentage increase (find %, then add) | supporting | step-by-step | curiosity-hook |
| 8 | `percentage-decrease` | Percentage decrease/discount (find %, then subtract) | supporting | step-by-step | curiosity-hook |
| 9 | `percent-to-fraction` | Converting % → fraction and simplifying | supporting | step-by-step | key-fact |
| 10 | `percent-to-decimal` | Converting % ↔ decimal (÷100 / ×100) | supporting | key-fact | spot-the-mistake |
| 11 | `comparing-fdp` | Comparing values as fractions, decimals and percentages | other | step-by-step | visual-discovery |
| 12 | `reverse-percentage` | Finding original when you know % and result | other | step-by-step | spot-the-mistake |
| 13 | `successive-percentages` | Why two 10% discounts ≠ 20% off | other | curiosity-hook | spot-the-mistake |
| 14 | `percentage-word-problems` | Multi-step percentage word problems | other | curiosity-hook | spot-the-mistake |

**Category weights:** core 43% (#1-6), supporting 29% (#7-10), other 29% (#11-14)

### Common Mistakes

1. **10% means divide by 100** — confusing 10% (÷10) with 1% (÷100)
2. **Adding successive discounts** — two 10% off = 20% off (actually 19% off original)
3. **Finding % but forgetting to add/subtract** — finding 20% of price but not subtracting from original
4. **Reverse %: using wrong base** — "£240 after 20% discount" → calculating 20% of £240 instead of recognising £240 = 80%
5. **% of vs % out of confusion** — "what is 30% of 200?" vs "what percentage is 30 of 200?"
6. **Decimal point errors converting** — writing 35% as 3.5 instead of 0.35, or 5% as 0.5 instead of 0.05
7. **Not simplifying when expressing as %** — for "15 out of 60", trying to × by 100 directly instead of simplifying 15/60 = 1/4 first
8. **Arithmetic errors scaling from 10%** — 10% = 24, so 35% = 24 × 3.5 — multiplication goes wrong

### Visual Components

- **BarModel** (existing) — percentage as proportion of whole bar, comparison bars
- **WorkedExample** (existing) — building-block method steps
- **NumberLine** (existing) — percentage scale 0-100% with FDP equivalents
- **No new components needed**

### Learning Goals

- `percent-means-per-hundred`: ["What the % symbol means", "Why 50% is the same as half"]
- `common-percentages`: ["Which fractions match the most useful percentages", "How to quickly recall 50%, 25%, 10%, 75%, 20%"]
- `finding-10-percent`: ["How to find 10% of any number by dividing by 10", "Why 10% is the building block for all other percentages"]
- `building-percentages`: ["How to build any percentage from 10% and 1% blocks", "How to find 5% (half of 10%) and 1% (divide by 100)"]
- `percentage-of-amount`: ["How to find any percentage of an amount step by step", "When to use the 10% method vs the fraction method"]
- `express-as-percentage`: ["How to express one number as a percentage of another", "Why you divide and then multiply by 100"]
- `percentage-increase`: ["How to calculate a price after a percentage increase", "Why you find the percentage first, then add"]
- `percentage-decrease`: ["How to calculate a sale price after a percentage discount", "Why you find the percentage first, then subtract"]
- `percent-to-fraction`: ["How to write a percentage as a fraction over 100", "How to simplify the fraction"]
- `percent-to-decimal`: ["How to convert a percentage to a decimal by dividing by 100", "Why 5% = 0.05, not 0.5"]
- `comparing-fdp`: ["How to compare a fraction, a decimal and a percentage by converting to the same type", "Which form is easiest to convert to"]
- `reverse-percentage`: ["How to find the original price when you know the discounted price", "Why you work out what percentage the given amount represents"]
- `successive-percentages`: ["Why two 10% discounts don't equal a 20% discount", "How to apply percentage changes one step at a time"]
- `percentage-word-problems`: ["How to spot whether a problem is asking for increase, decrease, or a simple percentage", "How to check your answer makes sense in context"]

---

## 4. Ratio & Proportion

### KS2 Progression

**Year 3-4:** Foundations via scaling (doubling/trebling recipes), fractions of amounts, "times as many" problems.

**Year 5:** "For every" language. Scaling recipes. Proportion as parts of a whole. Missing values using ×/÷ facts.

**Year 6:** Formal ratio notation (3:2). Sharing totals in ratio. Unitary method. Scale factors for similar shapes/maps. Missing values in proportion tables. Unequal sharing.

### Sub-Concepts (8 — 16 lessons)

| # | ID | Name | Category | Template A | Template B |
|---|---|------|----------|-----------|-----------|
| 1 | `ratio-notation` | Understanding what 3:2 means | supporting | curiosity-hook | key-fact |
| 2 | `simplifying-ratios` | Simplifying ratios using common factors | supporting | step-by-step | spot-the-mistake |
| 3 | `sharing-in-ratio` | Sharing a total in a given ratio | core | step-by-step | spot-the-mistake |
| 4 | `finding-missing-values` | Finding a missing value when one part is known | core | step-by-step | spot-the-mistake |
| 5 | `scaling-recipes` | Scaling recipes up and down | core | curiosity-hook | spot-the-mistake |
| 6 | `unitary-method` | Find the value of 1, then scale | core | step-by-step | visual-discovery |
| 7 | `scale-factors-maps` | Scale factors for maps and models | other | curiosity-hook | key-fact |
| 8 | `ratio-word-problems` | Multi-step ratio problems (difference between shares, total from one part) | other | curiosity-hook | spot-the-mistake |

**Category weights:** core 50% (#3-6), supporting 25% (#1-2), other 25% (#7-8)

### Common Mistakes

1. **Additive thinking instead of multiplicative** — "3:2 ratio, 9 boys" → adds 4 to get 7 girls instead of ×3 scaling (6 girls)
2. **Adding instead of multiplying when scaling** — "4 eggs for 12 cakes, how many for 36?" → adds instead of scales
3. **Confusing ratio order** — writing girls:boys as 3:2 when told boys:girls is 3:2
4. **Forgetting total parts** — sharing 60 in 2:3, dividing by 2 and 3 separately instead of total (5)
5. **Treating parts as actual quantities** — "3:2 means there are 3 boys and 2 girls" rather than proportional groups
6. **Simplifying only one side** — 12:8 → 6:8 instead of 6:4 or 3:2
7. **Scale factor direction errors** — multiplying when should divide (model→real vs real→model)
8. **Calculating wrong share** — finding one person's share when asked for the difference

### Visual Components

- **BarModel** (existing) — proportional segments, ratio bars (dominant visual for ratio in UK primary)
- **WorkedExample** (existing) — unitary method steps
- **No new components needed** (existing ratio SVGs in `public/images/questions/ratio/` confirm BarModel approach)

### Learning Goals

- `ratio-notation`: ["What the colon (:) symbol means in a ratio", "How to read and write ratios like 3:2"]
- `simplifying-ratios`: ["How to simplify a ratio by dividing both sides by the same number", "How to spot the highest common factor"]
- `sharing-in-ratio`: ["How to find the total number of parts in a ratio", "How to share an amount using the ratio"]
- `finding-missing-values`: ["How to find the value of one part of a ratio", "How to use that to find a missing amount"]
- `scaling-recipes`: ["How to scale a recipe up for more people", "How to scale a recipe down for fewer people"]
- `unitary-method`: ["How to find the value of one unit first", "How to use that one unit to find any amount"]
- `scale-factors-maps`: ["How to use a map scale to find real distances", "How to work out model sizes from real measurements"]
- `ratio-word-problems`: ["How to find the difference between two shares in a ratio", "How to work backwards from one share to find the total"]

---

## 5. Negative Numbers

### KS2 Progression

**Year 4:** Count backwards through zero. Negative numbers in temperature context.

**Year 5:** Interpret negative numbers in context. Count forwards/backwards through zero. Order and compare.

**Year 6:** Use negatives in context. Calculate intervals across zero. Difference between positive and negative. Negative coordinates.

### Sub-Concepts (9 — 18 lessons)

| # | ID | Name | Category | Template A | Template B |
|---|---|------|----------|-----------|-----------|
| 1 | `understanding-negatives` | What negative numbers mean and where they appear | core | curiosity-hook | visual-discovery |
| 2 | `ordering-negatives` | Ordering and comparing negative numbers | core | visual-discovery | spot-the-mistake |
| 3 | `counting-through-zero` | Counting forwards and backwards through zero | core | step-by-step | spot-the-mistake |
| 4 | `adding-to-negatives` | Adding a positive to a negative (e.g. -3 + 5 = 2) | core | step-by-step | spot-the-mistake |
| 5 | `subtracting-into-negatives` | Subtracting to go below zero (e.g. 3 - 8 = -5) | supporting | step-by-step | curiosity-hook |
| 6 | `difference-across-zero` | Finding the gap between negative and positive | supporting | step-by-step | spot-the-mistake |
| 7 | `temperature-problems` | Temperature rise and fall problems | supporting | curiosity-hook | spot-the-mistake |
| 8 | `real-world-contexts` | Negatives in money, depth, floors | other | curiosity-hook | visual-discovery |
| 9 | `negative-subtract-negative` | Subtracting from a negative (e.g. -5 - 3 = -8) | other | step-by-step | spot-the-mistake |

**Category weights:** core 44% (#1-4), supporting 33% (#5-7), other 22% (#8-9)

### Common Mistakes

1. **Thinking -8 is bigger than -3** — applying whole-number logic ("8 is bigger than 3")
2. **Ignoring the negative sign** — treating -5 + 8 as 5 + 8 = 13 instead of 3
3. **Confusing "-" as subtraction vs part of the number** — reading "-7" as "take away 7"
4. **Errors crossing zero** — 3 - 8 = -11 or -1 instead of -5
5. **Adding instead of subtracting in context** — "drops by 8°C" → adding 8 instead of subtracting
6. **Difference errors** — difference between -4°C and 3°C = 1 instead of 7
7. **Thinking negative + negative = positive** — applying multiplication rule to addition
8. **Halfway errors** — midpoint between -6 and 4: miscalculating the average

### Visual Components

- **NumberLine** (existing) — essential for all negative number work, showing positions and jumps across zero
- **WorkedExample** (existing) — step-by-step calculations
- **NEW: Thermometer** — vertical number line styled as a thermometer with zero marked, negative in blue, positive in red. Mercury level moves between readings. Standard UK primary school teaching aid. Can be reskinned for depth/floor contexts.

### Learning Goals

- `understanding-negatives`: ["What negative numbers are and where they appear in real life", "Why negative numbers are below zero on a number line"]
- `ordering-negatives`: ["How to put negative numbers in order", "Why -8 is smaller than -3 even though 8 is bigger than 3"]
- `counting-through-zero`: ["How to count backwards past zero into negative numbers", "How to count forwards from a negative number through zero"]
- `adding-to-negatives`: ["How to add a positive number to a negative number", "How to use a number line to count up from a negative start"]
- `subtracting-into-negatives`: ["How subtracting a bigger number from a smaller one gives a negative answer", "How to count down past zero on a number line"]
- `difference-across-zero`: ["How to find the gap between a negative and a positive number", "Why you add the distances from each number to zero"]
- `temperature-problems`: ["How to work out temperature rises and drops", "How to find the difference between two temperatures"]
- `real-world-contexts`: ["How negative numbers work in money (being overdrawn)", "How negative numbers show depth below sea level or underground floors"]
- `negative-subtract-negative`: ["How subtracting from a negative number makes it more negative", "How to use a number line when both numbers are negative"]

---

# BATCH 2: Algebra, Place Value, Sequences, Primes, Speed/Distance/Time

---

## 6. Algebra

### KS2 Progression

**Year 3-4:** Missing number problems (e.g. _ + 5 = 12). Equals sign as balance. Function machines informally.

**Year 5:** Letter/symbol for unknowns. Simple one-step equations. Formulae in context (perimeter). Two-operation function machines.

**Year 6 (statutory):** Use simple formulae. Generate/describe linear sequences. Express missing numbers algebraically. Find pairs satisfying equations with two unknowns. Enumerate combinations.

### Sub-Concepts (9 — 18 lessons)

| # | ID | Name | Category | Template A | Template B |
|---|---|------|----------|-----------|-----------|
| 1 | `using-letters` | Using letters to represent unknown numbers | core | step-by-step | spot-the-mistake |
| 2 | `substitution` | Substituting values into expressions | core | step-by-step | spot-the-mistake |
| 3 | `one-step-equations` | Solving one-step equations (3x=18, x+7=15) | core | step-by-step | spot-the-mistake |
| 4 | `two-step-equations` | Solving two-step equations (4x+5=29) | core | step-by-step | spot-the-mistake |
| 5 | `writing-expressions` | Writing algebraic expressions from words | supporting | curiosity-hook | spot-the-mistake |
| 6 | `function-machines` | Using function machines forwards and backwards | supporting | visual-discovery | curiosity-hook |
| 7 | `simple-formulae` | Using formulae in context (perimeter, cost) | supporting | curiosity-hook | step-by-step |
| 8 | `inverse-operations` | Working backwards using inverse operations | other | spot-the-mistake | key-fact |
| 9 | `bidmas-brackets` | BIDMAS and brackets in expressions | other | key-fact | spot-the-mistake |

**Category weights:** core 44% (#1-4), supporting 33% (#5-7), other 22% (#8-9)

### Common Mistakes

1. **Equals sign as "the answer is"** — not understanding 5+3 = 8+2 means both sides equal 10
2. **Inverse to wrong side** — in 3x+5=29, subtracting 5 from left but not right
3. **6p means 6+p** — confusing multiplication with addition in expressions
4. **Wrong order in two-step** — dividing 29 by 4 first instead of subtracting 5 first in 4x+5=29
5. **Variables as labels** — "3a" means "3 apples" not "3 × a number"
6. **Function machine backwards errors** — applying same order instead of reversing operations AND order
7. **Expression direction** — writing 3-j instead of j-3 for "j minus 3"
8. **Brackets change meaning** — not recognising 2(n+3) ≠ 2n+3

### Visual Components

- **WorkedExample** (existing) — step-by-step equation solving
- **NumberLine** (existing) — function machine input/output transformations
- **NEW: FunctionMachine** — input box → operation boxes (with arrows) → output box. Supports forward and reverse mode. Standard school teaching aid.

### Learning Goals

- `using-letters`: ["How letters stand for unknown numbers", "Why we use letters instead of question marks"]
- `substitution`: ["How to replace a letter with a number", "How to work out the value of an expression step by step"]
- `one-step-equations`: ["How to find a missing number using inverse operations", "How to check your answer by substituting back"]
- `two-step-equations`: ["How to undo two operations to find the unknown", "Why the order of undoing matters"]
- `writing-expressions`: ["How to turn words into algebra", "How to spot whether to add, subtract, multiply, or divide"]
- `function-machines`: ["How to follow operations in order", "How to work backwards through a function machine"]
- `simple-formulae`: ["How to use a formula to calculate an answer", "How to substitute into real-life formulae like perimeter"]
- `inverse-operations`: ["How to reverse an operation to find the starting number", "Why addition and subtraction are inverses, and multiplication and division are inverses"]
- `bidmas-brackets`: ["Why brackets must be worked out first", "How BIDMAS tells you the order to calculate"]

---

## 7. Place Value & Rounding

### KS2 Progression

**Year 3:** Place value in 3-digit numbers. Compare/order using < > =. Find 10/100 more or less.

**Year 4:** Place value in 4-digit numbers. Round to nearest 10/100/1000. Negatives in context. Find 1000 more/less.

**Year 5:** Read/write/order/compare to 1,000,000. Round to nearest 10/100/1000/10000/100000. Powers of 10.

**Year 6:** Numbers to 10,000,000. Round any whole number. Round decimals. Negative numbers. Practical problems.

### Sub-Concepts (9 — 18 lessons)

| # | ID | Name | Category | Template A | Template B |
|---|---|------|----------|-----------|-----------|
| 1 | `reading-writing-numbers` | Reading/writing numbers in words and digits (to 1,000,000+) | supporting | curiosity-hook | spot-the-mistake |
| 2 | `digit-value` | Understanding value of each digit (place value) | core | step-by-step | visual-discovery |
| 3 | `comparing-ordering` | Comparing/ordering multi-digit numbers | supporting | step-by-step | spot-the-mistake |
| 4 | `rounding-nearest-10-100` | Rounding to nearest 10 and 100 | core | step-by-step | spot-the-mistake |
| 5 | `rounding-nearest-1000-plus` | Rounding to nearest 1000, 10000, 100000 | core | step-by-step | spot-the-mistake |
| 6 | `rounding-decimals` | Rounding decimals to nearest whole or 1dp | core | step-by-step | key-fact |
| 7 | `partitioning` | Partitioning numbers (4,567 = 4,000+500+60+7) | supporting | visual-discovery | key-fact |
| 8 | `adding-subtracting-powers-10` | Adding/subtracting 10, 100, 1000 mentally | other | visual-discovery | spot-the-mistake |
| 9 | `making-numbers` | Making largest/smallest number from given digits | other | curiosity-hook | key-fact |

**Category weights:** core 44% (#2,4,5,6), supporting 33% (#1,3,7), other 22% (#8,9)

### Common Mistakes

1. **Sequential rounding (cascading)** — rounding 14,489 to nearest 1000 via nearest 10→100→1000 (getting 15,000 instead of 14,000)
2. **Always rounding up** — not recognising 0-4 rounds DOWN
3. **Digit vs value confusion** — "the 5 in 45,678" → answering "5" instead of "5,000"
4. **Looking at wrong digit when rounding** — rounding to nearest 100 but looking at hundreds digit instead of tens digit
5. **Zero as placeholder problems** — in 50,302, struggling with "no tens"
6. **Rounding when digit is exactly 5** — uncertainty (UK convention: 5 rounds UP)
7. **Misplacing commas in large numbers** — writing "twenty-three thousand four hundred and five" without the hundreds
8. **Comparing different-length numbers** — thinking 9,999 > 10,001

### Visual Components

- **PlaceValueChart** (existing) — column headers (M, HTh, TTh, Th, H, T, O) with digits
- **NumberLine** (existing) — rounding (showing which end is closer)
- **WorkedExample** (existing) — sequential rounding steps
- **No new components needed**

### Learning Goals

- `reading-writing-numbers`: ["How to read and write numbers up to one million", "How to match words to digits and digits to words"]
- `digit-value`: ["How to find the value of any digit in a number", "Why the position of a digit changes its value"]
- `comparing-ordering`: ["How to compare numbers by looking at the highest place value first", "How to put a set of numbers in order from smallest to largest"]
- `rounding-nearest-10-100`: ["How to round a number to the nearest 10 or 100", "Which digit to look at when rounding"]
- `rounding-nearest-1000-plus`: ["How to round to the nearest 1,000, 10,000, or 100,000", "How rounding works the same way no matter how big the number"]
- `rounding-decimals`: ["How to round a decimal to the nearest whole number", "How to round a decimal to one decimal place"]
- `partitioning`: ["How to break a number into thousands, hundreds, tens, and ones", "How partitioning helps you understand what a number is worth"]
- `adding-subtracting-powers-10`: ["How to add or subtract 10, 100, or 1,000 from any number in your head", "Which digit changes when you add a power of 10"]
- `making-numbers`: ["How to arrange digits to make the largest possible number", "How to arrange digits to make the smallest possible number"]

---

## 8. Sequences

### KS2 Progression

**Year 3-4:** Count in multiples. Recognise/extend number patterns. Describe rules ("add 6 each time").

**Year 5:** Increasing/decreasing sequences. Non-linear patterns (square, triangular numbers). Square/cube number notation.

**Year 6:** Generate/describe linear sequences. Explore nth term concept. Two-step rules.

### Sub-Concepts (9 — 18 lessons)

| # | ID | Name | Category | Template A | Template B |
|---|---|------|----------|-----------|-----------|
| 1 | `constant-difference` | Arithmetic sequences — finding the constant difference | core | step-by-step | spot-the-mistake |
| 2 | `continue-sequence` | Continuing a sequence using the rule | core | step-by-step | curiosity-hook |
| 3 | `find-the-rule` | Finding the rule from a given sequence | core | visual-discovery | spot-the-mistake |
| 4 | `find-nth-term` | Finding the nth term of an arithmetic sequence | core | step-by-step | spot-the-mistake |
| 5 | `decreasing-sequences` | Sequences that decrease by a constant amount | supporting | curiosity-hook | spot-the-mistake |
| 6 | `geometric-sequences` | Sequences that multiply or divide each time | supporting | visual-discovery | key-fact |
| 7 | `special-sequences` | Square numbers, triangular numbers, cube numbers | supporting | visual-discovery | key-fact |
| 8 | `fibonacci-style` | Each term = sum of two previous terms | other | curiosity-hook | visual-discovery |
| 9 | `two-step-rules` | Sequences with two-step rules (double and add 1) | other | step-by-step | spot-the-mistake |

**Category weights:** core 44% (#1-4), supporting 33% (#5-7), other 22% (#8-9)

### Common Mistakes

1. **Miscounting the difference** — looking at first and last instead of consecutive terms
2. **Confusing difference with first term** — 5,10,15,20 → "nth term = 5n+5" instead of "5n"
3. **Not checking rule works for ALL terms** — finding a rule that fits first two only
4. **Assuming all sequences are arithmetic** — 2,4,8,16 → writing "+2,+4,+8" instead of "×2"
5. **Errors with decreasing sequences** — adding instead of subtracting
6. **Off-by-one errors with nth term** — counting from 0 instead of 1
7. **Confusing square and triangular numbers** — mixing up 1,4,9,16 vs 1,3,6,10
8. **Fibonacci errors** — adding only the previous term, not the two previous

### Visual Components

- **NumberLine** (existing) — terms plotted with jump arrows showing differences
- **WorkedExample** (existing) — finding differences, rules, nth terms
- **NEW: SequenceStrip** — horizontal strip of numbered term boxes with rule arrows between them. Shows "+6" or "×2" on arrows. Can show "?" for missing terms. For special sequences, small dot-patterns inside boxes.

### Learning Goals

- `constant-difference`: ["How to find the gap between terms in a sequence", "How to check the difference is the same each time"]
- `continue-sequence`: ["How to use the rule to find the next term", "How to predict any term without writing them all out"]
- `find-the-rule`: ["How to work out what's happening between each number", "How to describe the rule in words"]
- `find-nth-term`: ["How to find any term in a sequence using a formula", "Why the nth term formula saves time for large term numbers"]
- `decreasing-sequences`: ["How to spot a sequence that goes down", "How to continue a decreasing pattern accurately"]
- `geometric-sequences`: ["How to spot when a sequence multiplies instead of adds", "How to continue a sequence that doubles, trebles, or halves"]
- `special-sequences`: ["How to recognise square numbers (1, 4, 9, 16, 25...)", "How to recognise triangular numbers (1, 3, 6, 10, 15...)"]
- `fibonacci-style`: ["How to spot a sequence where you add the two previous terms", "How to continue a Fibonacci-style sequence"]
- `two-step-rules`: ["How to spot when a sequence uses two operations", "How to describe a two-step rule (e.g. double then add 1)"]

---

## 9. Prime Numbers & Factors

### KS2 Progression

**Year 4:** Factor pairs and commutativity. All factor pairs to 100. Multiples of 2,3,4,5,8,10.

**Year 5:** Identify multiples and factors. Factor pairs and common factors. Prime, composite, prime factor vocabulary. Primes to 19.

**Year 6:** Simplify fractions using common factors. HCF and LCM. Prime factorisation (factor trees). Primes to 100.

### Sub-Concepts (9 — 18 lessons)

| # | ID | Name | Category | Template A | Template B |
|---|---|------|----------|-----------|-----------|
| 1 | `identifying-primes` | Recognising whether a number is prime | core | step-by-step | spot-the-mistake |
| 2 | `finding-factors` | Listing all factors of a number | core | step-by-step | spot-the-mistake |
| 3 | `factor-pairs` | Finding factor pairs of a number | core | curiosity-hook | visual-discovery |
| 4 | `common-factors-hcf` | Finding common factors and HCF | core | step-by-step | spot-the-mistake |
| 5 | `common-multiples-lcm` | Finding common multiples and LCM | supporting | step-by-step | curiosity-hook |
| 6 | `prime-factorisation` | Breaking a number into prime factors (factor trees) | supporting | visual-discovery | step-by-step |
| 7 | `divisibility-rules` | Quick tests for divisibility by 2,3,4,5,6,8,9,10 | supporting | key-fact | spot-the-mistake |
| 8 | `hcf-lcm-word-problems` | HCF (sharing equally) and LCM (events repeating) in context | other | curiosity-hook | spot-the-mistake |
| 9 | `counting-factors` | How many factors does a number have? (including squares of primes) | other | visual-discovery | key-fact |

**Category weights:** core 44% (#1-4), supporting 33% (#5-7), other 22% (#8-9)

### Common Mistakes

1. **Thinking 1 is prime** — it's not (needs exactly 2 distinct factors)
2. **All odd numbers are prime** — counter-examples: 9, 15, 21, 25, 27
3. **Forgetting 2 is prime** — and it's the only even prime
4. **Missing factor pairs** — listing factors of 24 but missing 8 and 12
5. **Confusing factors with multiples** — "Is 6 a factor of 24?" vs "Is 24 a multiple of 6?"
6. **Confusing HCF and LCM** — computing one correctly but labelling it the other
7. **Not fully decomposing in prime factorisation** — stopping at 72 = 8 × 9 instead of 2³ × 3²
8. **Multiplying for LCM** — LCM of 6 and 8 = 48 (wrong, it's 24)

### Visual Components

- **WorkedExample** (existing) — systematic factor finding, prime factor trees
- **NumberLine** (existing) — showing multiples and where common multiples overlap
- **BarModel** (existing) — HCF sharing problems
- **NEW: FactorTree** — branching tree showing prime decomposition. Props: `number`, `steps` (split pairs), `revealStepByStep`. Standard UK school visual.

### Learning Goals

- `identifying-primes`: ["How to check if a number is prime", "Why 1 is not a prime number"]
- `finding-factors`: ["How to find every factor of a number", "Using systematic testing up to the square root"]
- `factor-pairs`: ["How to list factor pairs (two numbers that multiply to give the target)", "Why factor pairs come in matching partners"]
- `common-factors-hcf`: ["How to find factors that two numbers share", "How to pick the Highest Common Factor (HCF)"]
- `common-multiples-lcm`: ["How to list multiples of two numbers", "How to find the Lowest Common Multiple (LCM)"]
- `prime-factorisation`: ["How to draw a factor tree", "How to write a number as a product of primes"]
- `divisibility-rules`: ["Quick shortcuts for testing if a number divides evenly", "When to use each divisibility rule"]
- `hcf-lcm-word-problems`: ["How to spot when a problem needs HCF (sharing equally)", "How to spot when a problem needs LCM (events repeating together)"]
- `counting-factors`: ["How to count all the factors a number has", "Why squares of primes have exactly 3 factors"]

---

## 10. Speed, Distance, Time

### KS2 Progression

**Year 3-4:** Time problems, duration, timetables. Convert time units.

**Year 5:** Multi-step time problems. Rate problems informally ("if 60 miles in 1 hour, how far in 3 hours?").

**Year 6:** Not statutory KS2 but widely tested in GL 11+. SDT triangle, unit conversion, multi-step word problems.

### Sub-Concepts (10 — 20 lessons)

| # | ID | Name | Category | Template A | Template B |
|---|---|------|----------|-----------|-----------|
| 1 | `calculate-speed` | Speed = Distance ÷ Time | core | step-by-step | spot-the-mistake |
| 2 | `calculate-distance` | Distance = Speed × Time | core | step-by-step | curiosity-hook |
| 3 | `calculate-time` | Time = Distance ÷ Speed | core | step-by-step | spot-the-mistake |
| 4 | `sdt-triangle` | The SDT triangle and how to use it | core | visual-discovery | key-fact |
| 5 | `minutes-to-hours` | Converting minutes ↔ hours for SDT | supporting | step-by-step | spot-the-mistake |
| 6 | `metres-to-km` | Converting metres ↔ kilometres for SDT | supporting | key-fact | spot-the-mistake |
| 7 | `kmh-to-ms` | Converting km/h ↔ m/s (÷3.6) | supporting | step-by-step | spot-the-mistake |
| 8 | `time-in-minutes` | Converting decimal hours back to minutes | other | step-by-step | spot-the-mistake |
| 9 | `average-speed` | Average speed for two-part journeys | other | step-by-step | spot-the-mistake |
| 10 | `word-problems` | Multi-step SDT word problems | other | curiosity-hook | spot-the-mistake |

**Category weights:** core 40% (#1-4), supporting 30% (#5-7), other 30% (#8-10)

### Common Mistakes

1. **Wrong formula** — multiplying when should divide, or vice versa
2. **Forgetting to convert minutes to hours** — using minutes directly in km/h calculations
3. **Converting minutes incorrectly** — 30 mins = 0.30 hours (should be 0.5)
4. **Average speed trap** — adding speeds and ÷2 instead of total distance ÷ total time
5. **Unit confusion km/h vs m/s** — not knowing the conversion
6. **Metres vs kilometres mix-up** — "1500m in 5 mins, what speed in km/h?"
7. **Giving time as decimal when asked for minutes** — 0.25 hours without converting to 15 mins
8. **Fractional time errors** — not knowing 40 mins = 2/3 hour

### Visual Components

- **WorkedExample** (existing) — step-by-step SDT formula application
- **NumberLine** (existing) — unit conversions, timelines
- **BarModel** (existing) — two-part journeys as proportional segments
- **NEW: SDTTriangle** — simple SVG triangle with D at top, S and T at bottom. Shows ×/÷ operations. Props: `highlightedValue`, `formulaShown`, `values`. Standard teaching aid, small component.

### Learning Goals

- `calculate-speed`: ["How to calculate speed using distance and time", "Why speed equals distance divided by time"]
- `calculate-distance`: ["How to calculate distance using speed and time", "Why distance equals speed multiplied by time"]
- `calculate-time`: ["How to calculate time using distance and speed", "Why time equals distance divided by speed"]
- `sdt-triangle`: ["How to use the speed-distance-time triangle", "How to cover up the value you want to find"]
- `minutes-to-hours`: ["How to convert minutes into hours for speed calculations", "Why 30 minutes is 0.5 hours, not 0.30 hours"]
- `metres-to-km`: ["How to convert metres to kilometres", "When to convert before calculating speed"]
- `kmh-to-ms`: ["How to convert km/h to m/s", "Why you multiply by 1000 then divide by 3600"]
- `time-in-minutes`: ["How to convert a decimal answer back into minutes", "Why 0.25 hours equals 15 minutes"]
- `average-speed`: ["How to calculate average speed for a journey with two parts", "Why you must NOT just average the two speeds"]
- `word-problems`: ["How to pick out speed, distance, and time from a wordy question", "How to decide which formula to use"]

---

# BATCH 3: Long Division, Area & Perimeter, Volume, Angles & Shapes, Data Handling

These topics need new visual components for authentic teaching.

---

## 11. Long Division

### KS2 Progression

**Year 3:** Division as sharing/grouping. Mental methods. Division facts for 2,3,4,5,8,10 tables. Simple remainders.

**Year 4:** Formal short division (bus stop) with up to 3-digit ÷ 1-digit. With/without remainders. Times tables to 12×12.

**Year 5:** Short division extended to 4-digit ÷ 1-digit. Interpreting remainders (whole number, fraction, round up/down). Dividing by multiples of 10.

**Year 6:** Formal long division with 2-digit divisors. Up to 4-digit ÷ 2-digit. Remainders as fractions/decimals. Checking with multiplication. Mental estimation.

### Sub-Concepts (7 — 14 lessons)

| # | ID | Name | Category | Template A | Template B |
|---|---|------|----------|-----------|-----------|
| 1 | `sharing-equally` | Division as sharing equally (conceptual foundation) | supporting | curiosity-hook | spot-the-mistake |
| 2 | `short-division` | Short division / bus stop with 1-digit divisor | core | step-by-step | spot-the-mistake |
| 3 | `short-division-remainders` | Short division with remainders | core | step-by-step | spot-the-mistake |
| 4 | `long-division-method` | Long division with 2-digit divisor | core | step-by-step | spot-the-mistake |
| 5 | `interpreting-remainders` | What to do with remainders (fraction, round up/down) | core | curiosity-hook | spot-the-mistake |
| 6 | `estimation-checking` | Estimating before dividing, checking with × | other | key-fact | visual-discovery |
| 7 | `dividing-word-problems` | Division word problems (choosing the operation) | other | curiosity-hook | spot-the-mistake |

**Category weights:** core 57% (#2-5), supporting 14% (#1), other 29% (#6-7)

### Common Mistakes

1. **Remainder larger than divisor** — leaving remainder bigger than divisor (not making another group)
2. **Misaligning place values** — quotient digit above wrong column (answer 10× too big/small)
3. **Forgetting to bring down** — not bringing down next digit after finding remainder
4. **Weak times tables** — wrong partial quotients cascade through entire calculation
5. **Misinterpreting remainders** — "157 children, coaches hold 48" → answering 3 instead of 4 (need to round up)
6. **Not checking with multiplication** — skipping quotient × divisor + remainder = dividend check
7. **Confusing division direction** — writing 12÷156 instead of 156÷12

### Visual Components

- **WorkedExample** (existing) — estimation, word problems, consolidation
- **NumberLine** (existing) — remainders as jumps, estimation
- **NEW: BusStopMethod (HIGH PRIORITY)** — the standard UK division layout. Shows divisor outside bracket, dividend inside, quotient digits on top appearing one at a time. Must support 1-digit and 2-digit divisors, carry digits, step-by-step reveal. Props: `divisor`, `dividend`, `answer` (digit objects with carry), `workingSteps`, `revealStep`, `showRemainder`.

### Learning Goals

- `sharing-equally`: ["How sharing things equally is the same as dividing", "Why division undoes multiplication"]
- `short-division`: ["How to set up the bus stop method", "How to divide a 3-digit number by a 1-digit number step by step"]
- `short-division-remainders`: ["What to do when a number doesn't divide exactly", "How to write the remainder correctly"]
- `long-division-method`: ["How to divide by a 2-digit number using the bus stop method", "How to work out how many times the divisor fits in"]
- `interpreting-remainders`: ["When to round up, round down, or write the remainder as a fraction", "How the context of the problem tells you what to do with the remainder"]
- `estimation-checking`: ["How to estimate the answer before you start dividing", "How to check your answer using multiplication"]
- `dividing-word-problems`: ["How to spot that a word problem needs division", "How to decide what to divide by what"]

---

## 12. Area & Perimeter

### KS2 Progression

**Year 3:** Measure perimeter by adding side lengths.

**Year 4:** Area by counting squares. Perimeter of rectilinear shapes.

**Year 5:** Rectangle area formula (l×w). Standard units (cm², m²). Estimate irregular areas. Composite rectilinear perimeters.

**Year 6:** Same area ≠ same perimeter. Area of parallelograms and triangles. Compound shapes. Missing lengths.

### Sub-Concepts (10 — 20 lessons)

| # | ID | Name | Category | Template A | Template B |
|---|---|------|----------|-----------|-----------|
| 1 | `perimeter-rectangles` | Perimeter of rectangles and squares | core | step-by-step | spot-the-mistake |
| 2 | `area-rectangles` | Area of rectangles and squares (l×w) | core | step-by-step | spot-the-mistake |
| 3 | `missing-side-perimeter` | Finding missing side from known perimeter | core | curiosity-hook | spot-the-mistake |
| 4 | `missing-side-area` | Finding missing side from known area | core | step-by-step | curiosity-hook |
| 5 | `area-triangles` | Area of triangles (½×b×h) | supporting | visual-discovery | step-by-step |
| 6 | `area-parallelograms` | Area of parallelograms (b×h) | supporting | visual-discovery | step-by-step |
| 7 | `compound-shapes` | Splitting L-shapes into rectangles and adding areas | supporting | step-by-step | spot-the-mistake |
| 8 | `area-vs-perimeter` | Same area ≠ same perimeter (and vice versa) | other | visual-discovery | key-fact |
| 9 | `unit-conversion` | Converting cm² ↔ m² (understanding square units) | other | key-fact | spot-the-mistake |
| 10 | `paths-and-borders` | Area of a path/border (outer minus inner rectangle) | other | curiosity-hook | step-by-step |

**Category weights:** core 40% (#1-4), supporting 30% (#5-7), other 30% (#8-10)

### Common Mistakes

1. **Confusing area and perimeter** — adding sides for area, or multiplying for perimeter
2. **Forgetting to double for perimeter** — l+w=13 instead of 2×(l+w)=26
3. **Adding for area** — 5+4=9 instead of 5×4=20
4. **Forgetting to halve for triangles** — giving b×h instead of b×h÷2
5. **Using slant height instead of perpendicular** — not using the right-angle height
6. **Believing same perimeter = same area** — assuming two shapes with P=24 have same area
7. **Square unit confusion** — thinking 1m² = 100cm² instead of 10,000cm²
8. **Adding cutout instead of subtracting** — for compound shapes with corners removed
9. **Paths: forgetting both sides** — 2m border reduces each dimension by 4, not 2

### Visual Components

- **WorkedExample** (existing) — step-by-step formula application
- **BarModel** (existing) — comparing area vs perimeter
- **NEW: ShapeDiagram** — SVG-based labelled 2D shapes with dimension labels, dotted height lines, shading. Props: `shape` (rectangle/triangle/parallelogram/l-shape/border), `dimensions`, `highlightArea`, `showHeight`.

### Learning Goals

- `perimeter-rectangles`: ["How to find the distance around a rectangle", "Why the formula is 2 × (length + width)"]
- `area-rectangles`: ["How to find the space inside a rectangle", "Why area = length × width"]
- `missing-side-perimeter`: ["How to work backwards from a perimeter to find a missing side", "Using subtraction and division to find unknown lengths"]
- `missing-side-area`: ["How to find a missing dimension when you know the area", "Using division to reverse the area formula"]
- `area-triangles`: ["Why a triangle is half of a rectangle", "How to use ½ × base × height"]
- `area-parallelograms`: ["Why a parallelogram has the same area as a rectangle", "How to use base × perpendicular height"]
- `compound-shapes`: ["How to split an L-shape into two rectangles", "How to add or subtract areas to find a total"]
- `area-vs-perimeter`: ["Why the same area can give different perimeters", "How to tell which measurement a question is asking for"]
- `unit-conversion`: ["Why square units are different from length units", "How to convert between cm² and m²"]
- `paths-and-borders`: ["How to find the area of a path around a rectangle", "Why you subtract the inner rectangle from the outer rectangle"]

---

## 13. Volume

### KS2 Progression

**Year 3-4:** Capacity in litres/ml. Compare and order. Volume as space an object takes up.

**Year 5:** Estimate volume using 1cm³ blocks. Volume = l×w×h for cuboids. cm³ as unit. 1000cm³ = 1 litre.

**Year 6:** Calculate/compare volume of cubes and cuboids (cm³, m³). Missing dimensions. Multi-step problems. Capacity connection.

### Sub-Concepts (9 — 18 lessons)

| # | ID | Name | Category | Template A | Template B |
|---|---|------|----------|-----------|-----------|
| 1 | `volume-cuboids` | Volume of cuboids (l×w×h) | core | step-by-step | spot-the-mistake |
| 2 | `volume-cubes` | Volume of cubes (edge³) | core | step-by-step | curiosity-hook |
| 3 | `missing-dimension` | Finding missing dimension from volume | core | step-by-step | spot-the-mistake |
| 4 | `cube-root` | Finding edge length from cube volume | supporting | visual-discovery | key-fact |
| 5 | `volume-to-capacity` | Converting cm³ ↔ ml ↔ litres (1cm³=1ml, 1000cm³=1L) | supporting | key-fact | spot-the-mistake |
| 6 | `comparing-volumes` | Same volume, different shapes | supporting | visual-discovery | curiosity-hook |
| 7 | `scaling-volumes` | Doubling edge → volume ×8, not ×2 | other | visual-discovery | spot-the-mistake |
| 8 | `fraction-of-volume` | Finding fraction of total volume (half full, ¾ full) | other | curiosity-hook | step-by-step |
| 9 | `volume-word-problems` | Real-world volume problems (tanks, pools, boxes) | other | curiosity-hook | spot-the-mistake |

**Category weights:** core 33% (#1-3), supporting 33% (#4-6), other 33% (#7-9)

### Common Mistakes

1. **Adding instead of multiplying** — volume = 10+5+4 = 19 instead of 10×5×4 = 200
2. **Confusing area and volume** — multiplying only two dimensions (giving base area)
3. **Wrong conversion cm³→litres** — ÷100 instead of ÷1000
4. **Additive reasoning about scaling** — doubling one edge doubles volume (true), but doubling all three = ×8 not ×6
5. **Confusing volume and capacity** — not understanding they measure different things with same units
6. **Cube root errors** — trying square root instead of cube root, or not knowing cube numbers
7. **Missing dimension: wrong operation** — V=120, l=10, w=4 → computing 10×4=40 then adding instead of dividing
8. **Wrong units** — cm² instead of cm³

### Visual Components

- **WorkedExample** (existing) — step-by-step calculations
- **BarModel** (existing) — comparing volumes, fractions of volume
- **NEW: CuboidDiagram** — pseudo-3D SVG cuboid (building on locked template in `/public/images/questions/volume/`). Props: `length`, `width`, `height`, `showLabels`, `highlightFaces`, `revealStepByStep`. *Alternative:* reference static SVGs via image prop for initial build; dynamic component for scalability.

### Learning Goals

- `volume-cuboids`: ["How to find the volume of a box shape", "Why volume = length × width × height"]
- `volume-cubes`: ["How to find the volume of a cube", "Why all three dimensions are the same for a cube"]
- `missing-dimension`: ["How to work backwards from volume to find a missing side", "Using division to reverse the volume formula"]
- `cube-root`: ["How to find the edge of a cube when you know the volume", "Knowing your cube numbers: 1, 8, 27, 64, 125..."]
- `volume-to-capacity`: ["How to convert cm³ to millilitres and litres", "Why 1cm³ = 1ml"]
- `comparing-volumes`: ["Why two boxes can look different but hold the same amount", "How to check volumes by calculating, not guessing"]
- `scaling-volumes`: ["Why doubling one edge doubles the volume", "Why doubling all edges makes the volume 8 times bigger"]
- `fraction-of-volume`: ["How to find half or a quarter of a volume", "Working out how full a container is"]
- `volume-word-problems`: ["How to spot a volume problem in a word question", "How to pick out the three dimensions from a description"]

---

## 14. Angles & Shapes

### KS2 Progression

**Year 3-4:** Identify right angles, acute, obtuse. Perpendicular and parallel lines. Compare/classify shapes. Lines of symmetry.

**Year 5:** Angles measured in degrees. Estimate/compare angles. Angles at point (360°), on straight line (180°), multiples of 90°. Regular vs irregular polygons. Rectangle properties.

**Year 6:** Find unknown angles in triangles, quadrilaterals, regular polygons. Vertically opposite angles. Draw 2D shapes with dimensions/angles. Parts of circles.

### Sub-Concepts (11 — 22 lessons)

| # | ID | Name | Category | Template A | Template B |
|---|---|------|----------|-----------|-----------|
| 1 | `angle-types` | Recognising acute, right, obtuse, straight, reflex | core | visual-discovery | key-fact |
| 2 | `straight-line` | Angles on a straight line = 180° | core | step-by-step | spot-the-mistake |
| 3 | `around-a-point` | Angles around a point = 360° | core | step-by-step | spot-the-mistake |
| 4 | `triangle-angles` | Angles in a triangle = 180° | core | step-by-step | spot-the-mistake |
| 5 | `quadrilateral-angles` | Angles in a quadrilateral = 360° | core | step-by-step | spot-the-mistake |
| 6 | `isosceles-triangle` | Isosceles: two equal base angles | supporting | curiosity-hook | spot-the-mistake |
| 7 | `right-angled-triangle` | Missing angle in right-angled triangle | supporting | step-by-step | curiosity-hook |
| 8 | `algebraic-angles` | Using algebra to find angles (3x+2x=180) | supporting | step-by-step | spot-the-mistake |
| 9 | `exterior-angles` | Exterior angle = sum of two opposite interior angles | other | curiosity-hook | key-fact |
| 10 | `parallel-lines` | Corresponding and alternate angles | other | visual-discovery | key-fact |
| 11 | `polygon-angles` | Interior angles of regular polygons using (n-2)×180 | other | step-by-step | visual-discovery |

**Category weights:** core 45% (#1-5), supporting 27% (#6-8), other 27% (#9-11)

### Common Mistakes

1. **Confusing angle types** — mixing acute/obtuse, forgetting reflex > 180°
2. **Using 360° instead of 180° for straight line** — and vice versa for around a point
3. **Forgetting to subtract ALL known angles** — subtracting only one when multiple given
4. **Isosceles errors** — not knowing which two angles are equal
5. **Algebraic angle errors** — solving for x correctly but confusing x with the angle value (3x)
6. **Confusing corresponding and alternate angles** — mixing up which are equal
7. **Polygon formula errors** — forgetting to subtract 2 before ×180 in (n-2)×180
8. **Exterior angle confusion** — mixing interior and exterior

### Visual Components

- **WorkedExample** (existing) — step-by-step angle calculations
- **NumberLine** (existing) — adapted as angle scale 0-360°
- **NEW: AngleDiagram** — SVG drawing lines meeting at a point with coloured angle arcs and labels. Props: `angles`, `labels`, `showArc`, `colourKnown`/`colourUnknown`, `shapeType` (straight-line/point/triangle/quadrilateral). Essential — angles are inherently spatial.

### Learning Goals

- `angle-types`: ["How to tell the difference between acute, right, obtuse, straight, and reflex angles", "Why the size of an angle matters, not the length of the lines"]
- `straight-line`: ["How to find a missing angle on a straight line", "Why angles on a straight line always add up to 180°"]
- `around-a-point`: ["How to find a missing angle around a point", "Why angles around a point always add up to 360°"]
- `triangle-angles`: ["How to find the missing angle in any triangle", "Why angles in a triangle always add up to 180°"]
- `quadrilateral-angles`: ["How to find the missing angle in any quadrilateral", "Why angles in a quadrilateral always add up to 360°"]
- `isosceles-triangle`: ["How to spot an isosceles triangle", "How to use equal base angles to find the missing angle"]
- `right-angled-triangle`: ["How to use the 90° angle shortcut", "How to find the other angle quickly by subtracting from 90"]
- `algebraic-angles`: ["How to set up an equation when angles have letters", "How to solve for x and then find each angle"]
- `exterior-angles`: ["What an exterior angle is", "How to use the exterior angle rule to find missing angles"]
- `parallel-lines`: ["How to spot corresponding angles (same position, same size)", "How to spot alternate angles (Z-shape, same size)"]
- `polygon-angles`: ["How to work out the total of interior angles in any polygon", "How to find one angle in a regular polygon"]

---

## 15. Data Handling

### KS2 Progression

**Year 3-4:** Interpret/present data (bar charts, pictograms, tables). Solve comparison/sum/difference problems.

**Year 5:** Line graphs. Tables and timetables. Comparison problems.

**Year 6:** Construct/interpret pie charts and line graphs. Calculate and interpret the mean. (Median, mode, range not statutory but tested in 11+.)

### Sub-Concepts (11 — 22 lessons)

| # | ID | Name | Category | Template A | Template B |
|---|---|------|----------|-----------|-----------|
| 1 | `calculating-mean` | Mean = add all values ÷ count | core | step-by-step | spot-the-mistake |
| 2 | `finding-median` | Median = order values, find middle | core | step-by-step | spot-the-mistake |
| 3 | `finding-mode` | Mode = most frequent value | core | step-by-step | curiosity-hook |
| 4 | `calculating-range` | Range = highest - lowest | core | key-fact | spot-the-mistake |
| 5 | `reading-bar-charts` | Reading/comparing values from bar charts | supporting | visual-discovery | curiosity-hook |
| 6 | `reading-line-graphs` | Line graphs and change over time | supporting | visual-discovery | curiosity-hook |
| 7 | `reading-pie-charts` | Interpreting pie charts (fractions and degrees) | supporting | step-by-step | spot-the-mistake |
| 8 | `reading-tables` | Two-way tables and timetables | supporting | curiosity-hook | key-fact |
| 9 | `missing-from-mean` | Finding missing number when mean is given | other | step-by-step | spot-the-mistake |
| 10 | `even-median` | Median with even number of values (average middle two) | other | step-by-step | spot-the-mistake |
| 11 | `combined-averages` | Answering questions needing mode AND range together | other | curiosity-hook | key-fact |

**Category weights:** core 36% (#1-4), supporting 36% (#5-8), other 27% (#9-11)

### Common Mistakes

1. **Mean: dividing by wrong number** — dividing by sum instead of count, or miscounting values
2. **Mean: missing a value from the sum** — especially with long lists
3. **Median: not ordering first** — picking the middle of the unordered list
4. **Median with even count** — picking one middle value instead of averaging both
5. **Mode: giving frequency not value** — "appears 3 times" instead of "the value is 8"
6. **Mode: assuming always one mode** — not recognising bimodal or no-mode data
7. **Range: giving two values** — "3 to 11" instead of "8"
8. **Range: wrong subtraction order** — lowest - highest → negative, confusion
9. **Bar chart: misreading scale** — especially when scale is in 5s or 10s and bar lands between
10. **Pie chart: not connecting angle to fraction** — not knowing 90° = 1/4
11. **Missing from mean: guessing** — not understanding mean × count = total

### Visual Components

- **WorkedExample** (existing) — step-by-step mean/median/mode/range calculations
- **BarModel** (existing) — showing how mean "levels out" data
- **NumberLine** (existing) — ordered data for median position
- **NEW: ChartVisual** — renders bar charts, line graphs, pie charts. Props: `chartType`, `data` (label-value pairs), `scale`, `highlightedSegments`. Needed because chart-reading cannot be taught without showing charts.

### Learning Goals

- `calculating-mean`: ["How to calculate the mean average", "Why mean means 'sharing equally'"]
- `finding-median`: ["How to find the median (middle value)", "Why you must put numbers in order first"]
- `finding-mode`: ["How to find the mode (most common value)", "How to count values to spot the mode quickly"]
- `calculating-range`: ["How to find the range of a set of data", "Why range shows you how spread out the data is"]
- `reading-bar-charts`: ["How to read values from a bar chart", "How to compare and find differences between bars"]
- `reading-line-graphs`: ["How to read values from a line graph", "How to work out change over time from a line graph"]
- `reading-pie-charts`: ["How to read a pie chart using fractions", "How to calculate the number of items from a pie chart angle"]
- `reading-tables`: ["How to read a two-way table", "How to find totals and differences from a table"]
- `missing-from-mean`: ["How to work backwards from the mean to find a missing value", "Why mean × count equals the total"]
- `even-median`: ["How to find the median when there is an even number of values", "Why you average the two middle numbers"]
- `combined-averages`: ["How to find mode and range from the same data set", "How to tell the difference between mean, median, mode, and range"]

---

# SUMMARY

## All 15 Topics at a Glance

| # | Topic | Sub-Concepts | Lessons | New Component? |
|---|-------|-------------|---------|----------------|
| 1 | Fractions | 14 | 28 | FractionWall (optional) |
| 2 | Decimals | 15 | 30 | None |
| 3 | Percentages | 14 | 28 | None |
| 4 | Ratio & Proportion | 8 | 16 | None |
| 5 | Negative Numbers | 9 | 18 | Thermometer |
| 6 | Algebra | 9 | 18 | FunctionMachine |
| 7 | Place Value & Rounding | 9 | 18 | None |
| 8 | Sequences | 9 | 18 | SequenceStrip |
| 9 | Prime Numbers & Factors | 9 | 18 | FactorTree |
| 10 | Speed, Distance, Time | 10 | 20 | SDTTriangle |
| 11 | Long Division | 7 | 14 | **BusStopMethod (HIGH)** |
| 12 | Area & Perimeter | 10 | 20 | ShapeDiagram |
| 13 | Volume | 9 | 18 | CuboidDiagram |
| 14 | Angles & Shapes | 11 | 22 | AngleDiagram |
| 15 | Data Handling | 11 | 22 | ChartVisual |
| | **TOTAL** | **154** | **308** | **10 new (1 HIGH, 9 optional)** |

## Grand Totals (including existing Long Multiplication)

| Metric | Count |
|--------|-------|
| Topics with micro-lessons | 16 (15 new + Long Multiplication) |
| Sub-concepts | 165 (154 new + 11 existing) |
| Lessons | 330 (308 new + 22 existing) |
| Screens (5 per lesson) | 1,650 |
| Variable sets (3+ per lesson) | 990+ |
| Unique experiences | 990+ |

## New Visual Components Priority

| Priority | Component | Used By | Complexity |
|----------|-----------|---------|------------|
| **HIGH** | BusStopMethod | Long Division | Medium |
| Medium | SDTTriangle | Speed/Distance/Time | Low |
| Medium | FunctionMachine | Algebra | Low |
| Medium | AngleDiagram | Angles & Shapes | Medium |
| Medium | ChartVisual | Data Handling | Medium-High |
| Low | FractionWall | Fractions | Low |
| Low | FactorTree | Prime Numbers | Low |
| Low | SequenceStrip | Sequences | Low |
| Low | Thermometer | Negative Numbers | Low |
| Low | ShapeDiagram | Area & Perimeter | Medium |
| Low | CuboidDiagram | Volume | Medium (template exists) |

## Recommended Build Order for Wave 2

### Phase A: Topics with NO new components (7 topics, 148 lessons)
1. Percentages (28 lessons) — no new component, high priority
2. Decimals (30 lessons) — uses PlaceValueChart
3. Place Value & Rounding (18 lessons) — uses PlaceValueChart
4. Ratio & Proportion (16 lessons) — uses BarModel
5. Fractions (28 lessons) — BarModel works; FractionWall optional
6. Prime Numbers & Factors (18 lessons) — WorkedExample suffices initially
7. Volume (18 lessons) — WorkedExample + existing SVGs suffice initially

### Phase B: Topics with LOW-complexity new components (4 topics, 74 lessons)
8. Algebra (18 lessons) — build FunctionMachine first
9. Speed/Distance/Time (20 lessons) — build SDTTriangle first
10. Negative Numbers (18 lessons) — build Thermometer first
11. Sequences (18 lessons) — build SequenceStrip first

### Phase C: Topics with MEDIUM+ new components (4 topics, 78 lessons)
12. Long Division (14 lessons) — build BusStopMethod first (HIGH priority)
13. Area & Perimeter (20 lessons) — build ShapeDiagram
14. Angles & Shapes (22 lessons) — build AngleDiagram
15. Data Handling (22 lessons) — build ChartVisual (most complex)

## Cross-Topic Connections

These sub-concepts overlap deliberately across topics:
- **fraction-to-decimal** appears in both Fractions and Decimals
- **decimal-to-percentage** and **fraction-to-percentage** bridge all three FDP topics
- **comparing-fdp** in Percentages requires mastery of both Fractions and Decimals
- **divisibility-rules** in Primes supports **simplifying** in Fractions and Ratios
- **rounding-decimals** in Place Value overlaps with Decimals rounding

---

## Research Sources

- National Curriculum: Mathematics Programmes of Study (GOV.UK)
- Third Space Learning: topic-specific guides and common misconceptions
- NCETM: Classroom resources and progression maps
- NRICH: Mathematical reasoning activities
- Oxford Owl: Year-by-year expectations
- PlanBee: Lesson packs and curriculum alignment
- Exam Papers Plus: GL 11+ topic coverage
- KSOL: 11+ activity packs
- LearningMole: Common mistakes in geometry
- DoodleLearning: KS2 curriculum overview

---

*Last updated: February 2026 — Wave 1 Research complete (agent-researched, curriculum-verified)*

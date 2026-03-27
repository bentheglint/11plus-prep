# Master Method Feedback — Action Plan
Synthesised from Google Sheet feedback rows 61-99 (19 Feb 2026)

---

## SYSTEMIC ISSUE: Interact screen reveals the answer
**Reported by:** Daisy (Percentages, Decimals, Long Division, Algebra, Place Value), Evie (Percentages)
**Problem:** The teach screens walk through a calculation (e.g. 936 ÷ 4 = 234), then the interact screen asks the SAME question with the SAME numbers. The child already knows the answer.
**Fix:** The interact screen must use a DIFFERENT set of numbers from the teach screens. Either:
- Pick a separate "interact-only" variable sub-set within each variable set, OR
- Generate a fresh random problem on the interact screen

**Affects:** Long Division, Percentages, Decimals, Algebra, Place Value (at minimum — likely all topics)

---

## PER-TOPIC FIXES

### 1. LONG DIVISION (master-bus-stop)
| Screen | Who | Issue | Fix |
|--------|-----|-------|-----|
| 2 (teach) | Ben | "Diagrams not clear — doesn't show overall equation" | Add a visual bus stop layout showing divisor outside, dividend inside, answer on top |
| 2 (teach) | Evie | "Should have picture telling what bus stop looks like" | Same as above — add a labelled bus stop diagram |
| 2 (teach) | Daisy | "Don't say exactly if it's not exact — misleading" | Remove word "exactly" from all text where remainder ≠ 0 |
| 3 (teach) | Daisy | "Don't say exactly if it's not exact" | Same fix as above |
| 4 (interact) | Ben | "Lesson wasn't clear at all — needs work" | Better visual + different numbers from teach |
| 4 (interact) | Daisy | "Just got told answer — numbers different" | Use different numbers in interact |
| 5 (consolidate) | Daisy | "Year 5/6 wouldn't understand 'quotient'" | Replace "quotient" with "answer" or "result" |
| 5 (consolidate) | Evie | "Like how it puts key words in bold" | ✅ POSITIVE — keep this |

### 2. PERCENTAGES (master-building-block-percentages)
| Screen | Who | Issue | Fix |
|--------|-----|-------|-----|
| 4 (interact) | Daisy | "Just got told number — needs different numbers" | Use different numbers in interact |
| 4 (interact) | Evie | "Questions tell you exact answer before" | Same — different numbers |
| 3 (teach) | Lauren | "On mobile, last illustration clipped — '30%=£150'" | Check BarModel responsive sizing |
| 5 (consolidate) | Lauren | "Can't find every percentage with just 5% and 10%" | Mention other building blocks (1%, 25%, 50%) or acknowledge limitations |

### 3. DECIMALS (master-column-addition-decimals)
| Screen | Who | Issue | Fix |
|--------|-----|-------|-----|
| 1 (hook) | Ben | "Write out full Ones, Tenths, Hundredths" | Replace O/T/H abbreviations with full words |
| 2 (teach) | Ben | "Make clear 1 is carried from previous step" | Add explicit "carry the 1" annotation/highlight |
| 3 (teach) | Ben | "Make clear 1 carried — make number line bigger" | Bigger PlaceValueChart + carry annotation |
| 4 (interact) | Daisy | "Just got told answer — numbers need different" | Use different numbers in interact |
| 5 (consolidate) | Evie | "Like lots of diagrams and simple words" | ✅ POSITIVE |

### 4. ANGLES & SHAPES (master-missing-angle-triangle)
| Screen | Who | Issue | Fix |
|--------|-----|-------|-----|
| 3 (teach) | Ben | "References triangles but images of smooth rectangle" | Replace BarModel with a proper triangle diagram showing angles. BarModel is wrong visual for this — should be a triangle with labelled angles |

### 5. SPEED/DISTANCE/TIME (master-speed-formula)
| Screen | Who | Issue | Fix |
|--------|-----|-------|-----|
| 3 (teach) | Ben | "Looks fine but 1hr jumps diagram bigger" | Increase size of the WorkedExample/visual |

### 6. FRACTIONS (master-adding-fractions)
| Screen | Who | Issue | Fix |
|--------|-----|-------|-----|
| 1 (hook) | Ben | "Explain what denominator is — shouldn't assume" | Add brief explanation: "the denominator is the bottom number — it tells us how many equal parts" |
| 1 (hook) | Ben | "Two labels different sizes, colours — needs consistency" | Make BarModel label sizes and colours consistent |
| 5 (consolidate) | Evie | "Like how it showed the easiest way" | ✅ POSITIVE |

### 7. ALGEBRA (master-two-step-equations)
| Screen | Who | Issue | Fix |
|--------|-----|-------|-----|
| 1 (hook) | Daisy | "Would it not be plus 15 as there's 3 bags?" | Review the scenario maths — may be a confusing word problem setup |
| 3 (teach) | Ben | "Confusing — use different letter not X for variable" | Replace x with a friendlier letter like n or use a box/blank symbol |
| 4 (interact) | Daisy | "Just got told answer — needs different numbers" | Use different numbers in interact |

### 8. PLACE VALUE (master-rounding)
| Screen | Who | Issue | Fix |
|--------|-----|-------|-----|
| 1 (hook) | Ben | "Use Thousand, Hundred, Ten, One — not abbreviation letters" | Write out full place value names, not Th/H/T/O |
| 4 (interact) | Daisy | "Same numbers need to be different" | Use different numbers in interact |

### 9. VOLUME (master-volume-cuboids)
| Screen | Who | Issue | Fix |
|--------|-----|-------|-----|
| 3 (teach) | Ben | "Visuals of cubes better — make VISUAL and clear" | Improve WorkedExample to show clearer 3D representation or add a diagram reference |

### 10. NEGATIVE NUMBERS (master-crossing-zero)
| Screen | Who | Issue | Fix |
|--------|-----|-------|-----|
| 2 (teach) | Ben | "Visual number line needs to be a bit bigger" | Increase NumberLine component size/padding |
| 5 (consolidate) | Ben | "Other than small visual on 2nd screen — good" | ✅ MOSTLY POSITIVE |

### 11. SEQUENCES (master-arithmetic-sequences)
| Screen | Who | Issue | Fix |
|--------|-----|-------|-----|
| 2 (teach) | Ben | "Number line needs to be a bit bigger" | Increase NumberLine component size |
| 3 (teach) | Ben | "Number line needs to be a bit bigger" | Same |

### 12. RATIO (master-sharing-ratio)
| Screen | Who | Issue | Fix |
|--------|-----|-------|-----|
| 5 (consolidate) | Ben | "Oliver — overlapping diagram lines — make bigger" | Increase BarModel size/spacing for consolidate screen |
| 5 (consolidate) | Evie | "Like how clear it is about everything" | ✅ POSITIVE |

### 13. DATA HANDLING (master-mean-average)
| Screen | Who | Issue | Fix |
|--------|-----|-------|-----|
| 1 (hook) | Ben | "Not sure 'typical' is right word — explain mean average" | Replace "typical" with clearer wording; add brief definition of mean |

### 14. AREA & PERIMETER (master-area-rectangles)
| Screen | Who | Issue | Fix |
|--------|-----|-------|-----|
| 2 (teach) | Ben | "Needs more visuals — especially talking area/perimeter" | Add shape diagram showing dimensions |
| 3 (teach) | Ben | "Visual of shape needed not just numbers" | Add rectangle/compound shape visual |

---

## QUESTION-LEVEL FIXES (non-lesson)
These are question bank issues reported during the same session:

| Row | Topic | Q ID | Issue |
|-----|-------|------|-------|
| 77 | Fractions | 67 | "3/6 is technically correct isn't it?" — review if answer accepts equivalent fractions |
| 99 | Negative Numbers | 65 | "Opens topic of debt — unsure kids conceptualise" — Lauren thinks £6 buy £22 item too abstract |

---

## PRIORITY ORDER
1. **Systemic interact fix** — different numbers on interact screen (affects ~10 topics)
2. **Long Division** — most feedback, needs bus stop visual + language fixes
3. **Angles & Shapes** — wrong visual type (BarModel → triangle diagram)
4. **Decimals** — abbreviations + carry annotations
5. **Place Value** — abbreviations
6. **Fractions** — explain denominator, consistent labels
7. **Algebra** — review scenario, friendlier variable, different interact numbers
8. **Percentages** — different interact numbers + mobile clipping + consolidate wording
9. **Area & Perimeter** — add shape visuals
10. **Volume** — better 3D visuals
11. **Data Handling** — wording tweak
12. **Negative Numbers / Sequences** — bigger number lines
13. **Ratio** — bigger diagram on consolidate
14. **Speed/Distance/Time** — bigger diagram

# 11+ Exam Prep App - Master Brief v4.0
**Last Updated:** January 26, 2026
**Project Status:** Phase 4 - In Progress

---

## PROJECT OVERVIEW

React-based 11+ exam preparation application for September 2026 GL Assessment entrance exams targeting Bournemouth Grammar School and Parkstone Grammar School.

**Target User:** 9-year-old daughter
**Exam Date:** September 2026
**Exam Format:** GL Assessment (3 papers: Maths, English, Verbal Reasoning)

---

## CURRENT STATUS - MATHEMATICS

### ✅ COMPLETED TOPICS (405 Questions Total)

**Phase 1 - Core Topics (200 questions)**
1. Fractions (40 questions) ✓
2. Decimals (40 questions) ✓
3. Percentages (40 questions) ✓
4. Ratios (40 questions) ✓
5. Algebra (40 questions) ✓

**Phase 2 - Essential Topics (90 questions)**
6. Time (30 questions) ✓
7. Money (30 questions) ✓
8. Measurement (30 questions) ✓

**Phase 3 - Medium Priority (90 questions)**
9. Area & Perimeter (30 questions, 18 diagrams) ✓
10. Volume (18 questions, 12 diagrams) ✓
11. Angles & Shapes (22 questions, 17 diagrams) ✓
12. Sequences (20 questions, 0 diagrams) ✓

**Phase 4 - Additional Topics (25 questions so far)**
13. Data Handling (25 questions, 10 diagrams) ✓

### 🔄 IN PROGRESS (30 questions remaining)

14. Speed, Distance, Time (15 questions) - NOT STARTED
15. Prime Numbers & Factors (15 questions) - NOT STARTED

---

## DIAGRAM CREATION STANDARDS

### Established Design Rules (v3.2)

**Color Scheme (Consistent across all topics):**
- Shape fills: `lightskyblue` with `fill-opacity="0.3-0.5"`
- Borders: `black` with `stroke-width="2"`
- Labels: `dimgray` (#333) for known values
- Unknown values: `red` for question marks
- Dimension lines: `gray` with end markers
- Secondary shapes: `lightcoral` for comparisons

**Label Positioning Rules:**
1. **NEVER place labels directly over lines** - causes readability issues
2. Labels must be in clear white space away from all diagram elements
3. Minimum 10-15px spacing between labels and shapes
4. Use dimension lines to connect labels to measurements

**2D Shape Dimensions:**
- Bottom edge = WIDTH (horizontal dimension line)
- Left edge = HEIGHT (vertical dimension line)
- Labels positioned outside shapes with clear dimension lines

**3D Shape Dimensions (Cuboids/3D):**
- Bottom front edge = WIDTH/LENGTH (horizontal dimension line)
- Left front edge = HEIGHT (vertical dimension line)
- Bottom-right diagonal edge = DEPTH (diagonal dimension line going back into 3D space)
- Dimension lines must NOT cross each other
- Labels positioned clearly away from lines with adequate spacing

**SVG Delivery Method:**
- Batch scripts (.bat files) for Windows
- Create folder structure: `topic-name/diagram-name.svg`
- User runs batch script from `public/images/questions/` directory
- Consistent file naming: `topic-name/diagram-type-qN.svg`

---

## DIAGRAM INVENTORY

**Total Diagrams Created:** 75

1. **Area & Perimeter:** 18 SVGs (rectangles, squares, L-shapes, comparisons)
2. **Volume:** 12 SVGs (cuboids, cubes, tanks, pools with 3D perspective)
3. **Angles & Shapes:** 17 SVGs (triangles, angles on lines, parallel lines, polygons)
4. **Data Handling:** 10 SVGs (3 bar charts, 2 pie charts, 2 line graphs, 3 tables)

---

## APP FEATURES & FUNCTIONALITY

### Core Features (Implemented)
- ✅ Multiple choice quiz format (5 options per question)
- ✅ Immediate feedback with explanations
- ✅ Progress tracking (localStorage)
- ✅ Topic selection
- ✅ Question randomization
- ✅ Image support for diagrams
- ✅ Review history
- ✅ AI Tutor interface (chat-style help)

### Technical Stack
- **Framework:** React
- **Styling:** CSS
- **Storage:** localStorage (browser-based)
- **Images:** SVG format for diagrams
- **Development:** VS Code
- **Location:** `C:\Users\Ben Jackson\Projects\11plus-prep`

---

## CONTENT STANDARDS (v3.0)

### Question Format Requirements
1. **Character Names:** Use diverse names (Emma, Tom, Sophie, Jake, Lucy, Ben, Mia, Oliver, Sarah, Charlie, Hannah, Ava, Noah, Ella, Max, Lily)
2. **Real-World Contexts:** Relate to everyday situations (shopping, sports, school, cooking, travel)
3. **Explanations:** Include ✓ checkmark at end
4. **Format:** Clear question text, 5 multiple choice options, correct answer index, detailed explanation

### Answer Options
- Exactly 5 options per question
- Options array indexed from 0-4
- Mix of plausible distractors
- Consistent formatting within topic

### Calculations
- All verified via Python before delivery
- Show working in explanations
- Use appropriate units
- Round sensibly (to 2 decimal places max)

---

## FILE ORGANIZATION

### Question Files
- Location: `/home/claude/[topic].js` then copied to outputs
- Format: JavaScript object with topic metadata and questions array
- Naming: `topicname.js` (lowercase, no spaces)

### Diagram Files
- Batch scripts: `create_[topic]_svgs.bat`
- Output folder: `public/images/questions/[topic]/`
- SVG files: Individual diagrams referenced in questions

### App Integration
1. Download `topic.js` file
2. Open `App.js` in VS Code
3. Find last topic's closing brace
4. Add comma after closing brace
5. Paste new topic
6. Save and test in browser
7. Run batch script to create diagrams
8. Refresh browser (Ctrl+Shift+R)

---

## LESSONS LEARNED & BEST PRACTICES

### Diagram Design
1. **3D Perspective:** Rectangle for front face + polygons for top/right faces works better than all-polygon approach
2. **Label Clarity:** Labels MUST be positioned away from lines - critical for readability
3. **Dimension Lines:** Use technical drawing style with end markers
4. **Color Consistency:** Maintain same color scheme across all topics
5. **Batch Scripts:** Break complex scripts into parts if encountering errors
6. **Pie Charts:** Remove full circle outline to avoid double borders

### Question Development
1. **Verification:** Always run Python verification before delivery
2. **Real Names:** Use character names throughout for engagement
3. **Explanations:** Clear step-by-step with checkmark
4. **Context:** Real-world scenarios make questions relatable

### Workflow Efficiency
1. **Batch Scripts:** Much more efficient than individual file downloads
2. **Incremental Testing:** Test diagrams in small batches first
3. **Version Control:** Create v2, v3 when fixing issues
4. **Documentation:** Update briefs regularly to maintain continuity

---

## REMAINING WORK

### Immediate Next Steps (Phase 4 Completion)
1. **Speed, Distance, Time** (15 questions)
   - Speed = Distance ÷ Time calculations
   - Real-world journey problems
   - Unit conversions
   - Minimal diagrams needed

2. **Prime Numbers & Factors** (15 questions)
   - Identifying primes
   - Factor pairs
   - LCM and HCF calculations
   - No diagrams needed

### Mathematics Completion Target
- **Current:** 405 questions
- **Target:** 435 questions (30 more needed)
- **Expected Completion:** Next session

---

## ENGLISH & VERBAL REASONING

**Status:** Not started
**Plan:** Begin after Mathematics complete

---

## SESSION HISTORY

**Session 1 (Previous):** Phases 1-2 completed (290 questions)
**Session 2 (January 26, 2026):** 
- Volume topic (18 questions, 12 diagrams)
- Angles & Shapes topic (22 questions, 17 diagrams)
- Sequences topic (20 questions)
- Data Handling topic (25 questions, 10 diagrams)
- Established 3D labeling rules
- Fixed diagram positioning standards
- Updated consistent color scheme
- Total added: 85 questions, 39 diagrams

---

## QUALITY METRICS

- ✅ All calculations verified
- ✅ Character names used throughout
- ✅ Real-world contexts applied
- ✅ Consistent color scheme across all diagrams
- ✅ Professional diagram quality
- ✅ Clear explanations with step-by-step working
- ✅ Appropriate difficulty distribution

---

**Document Version:** 4.0
**Next Review:** After Phase 4 completion

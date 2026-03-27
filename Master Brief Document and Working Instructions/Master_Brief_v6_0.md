# 11+ Exam Prep App - Master Brief v6.0
**Last Updated:** February 12, 2026
**Project Status:** Transitioning to Claude Code/Cursor for Full Development
**Platform:** Claude Code via Cursor IDE

---

## PROJECT OVERVIEW

React-based 11+ exam preparation application for September 2026 GL Assessment entrance exams targeting Bournemouth Grammar School and Parkstone Grammar School.

**Target User:** 9-year-old daughter
**Exam Date:** September 2026
**Exam Format:** GL Assessment (3 papers: Maths, English, Verbal Reasoning)

**Development Environment:**
- **Primary Tool:** Claude Code via Cursor IDE (as of Feb 12, 2026)
- **Previous Tool:** Claude.ai web interface (question creation complete)
- **Project Location:** `C:\Users\Ben Jackson\Projects\11plus-prep`
- **Second Brain Location:** `Documents\My Brain` (Claude Code context storage)

---

## PLATFORM TRANSITION - IMPORTANT

### Why We Switched to Claude Code/Cursor

**Previous Limitations (Claude Web Interface):**
- ❌ No visual preview for diagrams (blind iteration)
- ❌ Failed multiple times on 3D cuboid diagrams
- ❌ Token/context window management overhead
- ❌ Slower iteration cycle
- ❌ Required batch scripts for file delivery

**New Advantages (Claude Code/Cursor):**
- ✅ Direct file system access
- ✅ Visual preview for SVG diagrams
- ✅ Immediate feedback loop
- ✅ Native IDE integration
- ✅ Better for iterative development
- ✅ Can manage entire codebase efficiently
- ✅ Full project development capability

**Decision:** All future development (diagrams, features, questions, improvements) will be done in Claude Code/Cursor.

---

## CURRENT STATUS - MATHEMATICS

### 🎉 QUESTION BANK: 2,035 QUESTIONS COMPLETE

**Original Question Bank:** 435 questions
**Current Question Bank:** 2,035 questions
**Expansion Factor:** 4.68x original size

### ✅ COMPLETED TOPICS (All Expanded)

| Topic | Original | Phase 1 Expansion | Total | Status |
|-------|----------|-------------------|-------|--------|
| **Percentages** | 35 | +100 (Q36-135) | 135 | ✓ |
| **Decimals** | 35 | +100 (Q36-135) | 135 | ✓ |
| **Long Division** | 30 | +100 (Q31-130) | 130 | ✓ |
| **Ratio & Proportion** | 30 | +100 (Q31-130) | 130 | ✓ |
| **Fractions** | 35 | +100 (Q36-135) | 135 | ✓ |
| **Long Multiplication** | 25 | +100 (Q26-125) | 125 | ✓ |
| **Algebra** | 35 | +100 (Q36-135) | 135 | ✓ |
| **Place Value** | 25 | +100 (Q26-125) | 125 | ✓ |
| **Negative Numbers** | 20 | +100 (Q21-120) | 120 | ✓ |
| **Prime Numbers & Factors** | 15 | +100 (Q16-115) | 115 | ✓ |
| **Area & Perimeter** | 30 | +100 (Q31-130) | 130 | ✓ |
| **Volume** | 18 | +100 (Q19-118) | 118 | ✓ |
| **Angles & Shapes** | 22 | +100 (Q23-122) | 122 | ✓ |
| **Sequences** | 20 | +100 (Q21-120) | 120 | ✓ |
| **Data Handling** | 25 | +100 (Q26-125) | 125 | ✓ |
| **Speed, Distance, Time** | 15 | +100 (Q16-115) | 115 | ✓ |

**NOT YET EXPANDED:** Time (30), Money (30), Measurement (30) = 90 questions

---

## DIAGRAM CREATION STATUS

### 🎨 PHASE 2 - DIAGRAM CREATION

#### ✅ COMPLETED: Area & Perimeter v2 (59 diagrams)
**Created:** February 9, 2026 via Claude web interface
**Method:** Batch scripts (.bat files)
**Quality:** High - all verified and working

**Breakdown:**
- Rectangles: 30 diagrams
- Squares: 18 diagrams
- L-shaped rooms: 2 diagrams
- Compound cutouts: 2 diagrams
- Paths/borders: 5 diagrams
- Comparisons: 2 diagrams

**Files Delivered:**
- `create_area_perimeter_rectangles_batch1_CORRECTED.bat`
- `create_area_perimeter_squares_batch2_CORRECTED.bat`
- `create_area_perimeter_mixed_batch3_FIXED2.bat`
- `create_area_perimeter_q127.bat`

#### ⏳ IN PROGRESS: Volume v2 (0 of ~62 diagrams)
**Status:** Ready to start in Claude Code/Cursor
**Why Switched Platforms:** Multiple failed attempts in web interface due to 3D coordinate complexity

**Needed:**
- Cuboids: 17 diagrams (Q19, 21, 23, 26, 28, 33, 42, 49, 52, 61, 67, 69, 79, 81, 95, 99, 110)
- Cubes: 20 diagrams (Q20, 22, 27, 31, 40, 43, 50, 55, 59, 64, 70, 75, 78, 85, 92, 96, 102, 107, 111, 116)
- Tanks: 5 diagrams (Q25, 51, 80, 98, 112)
- Pools: 6 diagrams (Q32, 56, 72, 89, 104, 117)
- Rooms: 4 diagrams (Q24, 65, 97, 113)
- Storage: 2 diagrams (Q46, 84)
- Comparisons: 4 diagrams (Q35, 38, 83, 100)
- Algebraic: 4 diagrams (Q44, 62, 88, 114)

#### 📋 NOT STARTED: Remaining Topics
- **Angles & Shapes:** ~72 diagrams (Q23-Q122 v2)
- **Data Handling:** ~55 diagrams (Q26-Q125 v2)

**TOTAL DIAGRAMS:**
- Complete: 59
- Remaining: ~213
- Grand Total Needed: ~272

---

## PROJECT FILE STRUCTURE

### Current Directory Structure
```
C:\Users\Ben Jackson\Projects\11plus-prep\
├── public\
│   ├── images\
│   │   └── questions\
│   │       ├── area-perimeter\      ✓ 59 SVGs complete
│   │       ├── volume\              ← START HERE (0 SVGs)
│   │       ├── angles-shapes\       ← Not started
│   │       └── data-handling\       ← Not started
│   └── index.html
├── src\
│   ├── App.js                       Main React component
│   ├── questions\
│   │   ├── percentages.js           ✓ 135 questions
│   │   ├── decimals.js              ✓ 135 questions
│   │   ├── longdivision.js          ✓ 130 questions
│   │   ├── ratio.js                 ✓ 130 questions
│   │   ├── fractions.js             ✓ 135 questions
│   │   ├── longmultiplication.js    ✓ 125 questions
│   │   ├── algebra.js               ✓ 135 questions
│   │   ├── placevalue.js            ✓ 125 questions
│   │   ├── negativenumbers.js       ✓ 120 questions
│   │   ├── primenumbersfactors.js   ✓ 115 questions
│   │   ├── areaperimeter.js         ✓ 130 questions
│   │   ├── volume.js                ✓ 118 questions
│   │   ├── anglesshapes.js          ✓ 122 questions
│   │   ├── sequences.js             ✓ 120 questions
│   │   ├── datahandling.js          ✓ 125 questions
│   │   └── speeddistancetime.js     ✓ 115 questions
│   ├── index.css
│   └── index.js
├── package.json
└── README.md
```

### Claude Code Second Brain Location
```
C:\Users\Ben Jackson\Documents\My Brain\
├── .claude\                Configuration folder
├── archive\                Previous project contexts
├── content\               Active project notes
├── context\              Current session context
├── inbox\                Quick notes and ideas
├── templates\            Reusable templates
└── todo\                 Task lists
```

---

## IMMEDIATE NEXT TASKS (Priority Order)

### 🎯 TASK 1: Create Volume Cuboid Diagrams (HIGHEST PRIORITY)

**Objective:** Create 17 isometric 3D cuboid SVG diagrams

**Why This First:**
- Blocked progress in web interface (multiple failures)
- Visual preview essential for 3D coordinate work
- Template creation enables batch generation

**Workflow:**
1. **Open project in Cursor:** Navigate to `C:\Users\Ben Jackson\Projects\11plus-prep`
2. **Create test diagram:** Start with Q19 (12cm × 6cm × 5cm)
3. **Preview and validate:** Visual verification of dimension lines
4. **Perfect template:** Iterate until dimension placement correct
5. **Batch create:** Generate remaining 16 cuboid SVGs
6. **Test in app:** Run `npm start` and verify diagrams display

**Success Criteria:**
- All 17 cuboid diagrams created
- Dimension lines correctly positioned on all 3 axes
- Labels external, no text overlapping shapes
- Files saved in `public/images/questions/volume/`
- App displays diagrams correctly

**Files to Create:**
- `volume/cuboid-q19.svg` through `volume/cuboid-q110.svg` (17 files)

### 🎯 TASK 2: Complete Volume Diagrams (Cubes, Tanks, etc.)

**After cuboids template validated:**
1. Cubes (20 diagrams) - adapt cuboid template with equal edges
2. Tanks (5 diagrams) - cuboid with water level line
3. Pools (6 diagrams) - similar to tanks
4. Rooms (4 diagrams) - cuboid with room context
5. Storage/Comparisons/Algebraic (10 diagrams)

**Estimated Time:** 2-3 hours total for all 62 Volume diagrams

### 🎯 TASK 3: Angles & Shapes Diagrams (~72 diagrams)

**After Volume complete:**
- Triangles (various types)
- Straight line angles
- Angles around points
- Parallel lines
- Quadrilaterals
- Regular polygons

### 🎯 TASK 4: Data Handling Diagrams (~55 diagrams)

**After Angles & Shapes complete:**
- Bar charts
- Line graphs
- Pie charts
- Two-way tables
- Timetables

---

## DESIGN STANDARDS v6.0 (LOCKED)

### Universal SVG Standards

**ViewBox:** `0 0 400 300` (standard for most diagrams)

**Color Scheme (Consistent across all topics):**
- Shape fills: `lightskyblue` with `fill-opacity="0.3-0.8"`
- Borders: `black` with `stroke-width="2"`
- Labels: `dimgray` (#696969) for known values
- Unknown values: `red` for question marks
- Dimension lines: `gray` stroke-width="1"
- Secondary shapes: `lightcoral` for comparisons

**CRITICAL RULES:**
1. ❌ Labels NEVER overlap shapes or lines
2. ✅ All labels positioned externally with clear spacing (10-15px minimum)
3. ✅ Dimension lines must have perpendicular end markers
4. ✅ All dimension lines must visually connect to edges

### 2D Shape Standards (Working Well)

**Rectangles/Squares:**
- Positioned at: x=100, y=80, typical size: 200×120
- Bottom dimension line: y=170 (below shape)
- Left dimension line: x=60 (left of shape)
- Labels centered on dimension lines
- End markers: small perpendicular lines (5px length)

### 3D Shape Standards (CRITICAL FOR VOLUME)

**Isometric Cuboid Template (LOCKED):**

**Face Colors:**
- Front face: `lightskyblue` fill-opacity="0.8"
- Top face: `lightcyan` fill-opacity="0.9"
- Right face: `skyblue` fill-opacity="0.7"

**Dimension Mapping (DO NOT CHANGE):**

For question format: "L cm long × W cm wide × H cm high"

1. **Bottom Front Edge = LENGTH (L)**
   - Dimension line below front face (horizontal)
   - Line coordinates: below front bottom edge
   - End markers at both ends
   - Label centered below

2. **Left Front Edge = HEIGHT (H)**
   - Dimension line left of front face (vertical)
   - Line coordinates: left of front left edge
   - End markers at both ends
   - Label centered on left

3. **Top Back Edge = WIDTH/DEPTH (W)**
   - Dimension line along angled top-back edge
   - Line must follow angle of depth perspective
   - This is the edge going back into 3D space
   - Label positioned near this edge

**Example Coordinates (Reference Template):**
```
Front Face Rectangle:
- Bottom-left: (80, 150)
- Bottom-right: (240, 150)
- Top-right: (240, 70)
- Top-left: (80, 70)

Back Face (offset for depth):
- Bottom-left: (120, 110)
- Bottom-right: (280, 110)
- Top-right: (280, 30)
- Top-left: (120, 30)

Three Visible Faces:
1. Front: Rectangle (80,150)-(240,150)-(240,70)-(80,70)
2. Top: Parallelogram (80,70)-(240,70)-(280,30)-(120,30)
3. Right: Parallelogram (240,150)-(280,110)-(280,30)-(240,70)

Dimension Line Targets:
- Length: Front bottom edge (80,150) to (240,150)
- Height: Front left edge (80,150) to (80,70)
- Width: Back top edge (120,30) to (280,30) [ANGLED]
```

**Questions with Unknown Values:**
- Show red "? cm" on the relevant dimension line
- Example: If finding height, left dimension shows "? cm" in red
- Keep other dimensions in dimgray

---

## FILE NAMING CONVENTIONS

### SVG Diagrams
**Pattern:** `topic-folder/shape-type-qN.svg`

**Examples:**
- `area-perimeter/rectangle-q31.svg`
- `volume/cuboid-q19.svg`
- `volume/cube-q20.svg`
- `volume/tank-q25.svg`
- `angles-shapes/triangle-q24.svg`
- `data-handling/bar-chart-q36.svg`

**Rules:**
- All lowercase
- Hyphens between words
- Include question number
- Descriptive shape type

### Question Files
**Pattern:** `topicname.js` (no spaces, camelCase)

**Location:** `src/questions/`

**Format:**
```javascript
export const topicQuestions = [
  {
    id: 1,
    question: "Question text here",
    image: "topic-folder/diagram-qN.svg", // Optional
    options: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
    correct: 0, // Index 0-4
    explanation: "Explanation text here. ✓"
  },
  // ... more questions
];
```

---

## APP FEATURES & FUNCTIONALITY

### Core Features (Implemented & Working)
- ✅ Multiple choice quiz format (5 options per question)
- ✅ Immediate feedback with explanations
- ✅ Progress tracking (localStorage)
- ✅ Topic selection menu
- ✅ Question randomization within topics
- ✅ Image support for diagrams
- ✅ Review history of answered questions
- ✅ AI Tutor chat interface (help system)

### Technical Stack
- **Framework:** React 18
- **Styling:** Tailwind CSS
- **Icons:** lucide-react
- **Storage:** Browser localStorage
- **Images:** SVG format for all diagrams
- **Development:** Node.js, npm
- **IDE:** Cursor with Claude Code
- **Version Control:** Local (not yet on Git)

### Running the App Locally
```bash
cd C:\Users\Ben Jackson\Projects\11plus-prep
npm start
```
Opens at: `http://localhost:3000`

**Hot Reload:** Changes to code automatically refresh browser

---

## CONTENT STANDARDS v6.0

### Question Format Requirements
1. **Character Names:** Diverse names for engagement (Emma, Tom, Sophie, Jake, Lucy, Ben, Mia, Oliver, Sarah, Charlie, etc.)
2. **Real-World Contexts:** Relate to everyday situations (shopping, sports, school, cooking, travel, family activities)
3. **Explanations:** Must include ✓ checkmark at end
4. **Format:** Clear question, 5 options, correct index, detailed explanation

### Answer Options
- Exactly 5 options per question
- Options array indexed 0-4
- Mix of plausible distractors (common wrong answers)
- Consistent formatting within topic
- Options should progress logically (e.g., numerical order)

### Calculations
- All Python-verified before delivery (no calculation errors)
- Show working in explanations
- Use appropriate units
- Round sensibly (max 2 decimal places)
- Check all arithmetic manually

---

## QUALITY ASSURANCE CHECKLIST

### For Every Diagram Created:

**Visual Verification (Claude Code Advantage!):**
- [ ] Preview SVG in Cursor before saving
- [ ] All dimension lines visible and correctly positioned
- [ ] Labels do not overlap shapes or lines
- [ ] Measurements match question exactly
- [ ] Colors match design standards
- [ ] Shape proportions look reasonable
- [ ] Unknown values shown as red "?" where applicable

**Technical Verification:**
- [ ] SVG syntax valid (no errors)
- [ ] ViewBox set correctly
- [ ] File saved in correct directory
- [ ] Filename follows naming convention
- [ ] File referenced correctly in question .js file

**Integration Testing:**
- [ ] Run `npm start` to test
- [ ] Navigate to topic in browser
- [ ] Find question with new diagram
- [ ] Verify diagram displays correctly
- [ ] Hard refresh (Ctrl+Shift+R) if needed
- [ ] Check on multiple questions

### For Every Question Created:

**Content Verification:**
- [ ] Python calculation verified
- [ ] 5 options provided
- [ ] Correct index accurate (0-4)
- [ ] Explanation includes ✓ checkmark
- [ ] Character name used (if applicable)
- [ ] Real-world context included
- [ ] Units specified clearly
- [ ] Working shown in explanation

---

## DEVELOPMENT WORKFLOW IN CLAUDE CODE/CURSOR

### Starting a New Session

1. **Open Cursor IDE**
2. **Open Project Folder:** `C:\Users\Ben Jackson\Projects\11plus-prep`
3. **Start Claude Code:** Already integrated in Cursor
4. **Navigate to Relevant Directory:**
   - For diagrams: `public/images/questions/[topic]/`
   - For questions: `src/questions/[topic].js`
   - For app features: `src/App.js`

### Creating Diagrams in Claude Code

**Workflow:**
1. Open question file to reference measurements
2. Create new SVG file in correct directory
3. Request Claude Code to generate SVG based on standards
4. **Preview immediately** in Cursor
5. Iterate if adjustments needed
6. Save file
7. Test in running app (`npm start`)

**Example Prompt to Claude Code:**
```
Create an isometric 3D cuboid SVG diagram for Volume Q19:
"A rectangular box is 12 cm long, 6 cm wide, and 5 cm high. What is its volume?"

Requirements:
- Follow the locked 3D dimension mapping standard
- Bottom edge = 12cm (length) - horizontal dimension line below
- Left edge = 5cm (height) - vertical dimension line on left  
- Top back edge = 6cm (width) - angled dimension line
- Use standard colors: front=lightskyblue, top=lightcyan, right=skyblue
- All edges black stroke-width=2
- Labels external with dimension lines and end markers
- Save as: public/images/questions/volume/cuboid-q19.svg

Please show me a preview so I can verify before we create the remaining cuboids.
```

### Testing Changes

**Run Development Server:**
```bash
npm start
```

**App automatically opens at:** `http://localhost:3000`

**Hot Reload:** Most changes reflect immediately

**Hard Refresh:** Ctrl+Shift+R (if images don't update)

**Stop Server:** Ctrl+C in terminal

---

## SESSION HISTORY

**Session 1-7 (Previous):** Question bank expansion via Claude web interface
- Created 1,700 new questions across 16 topics
- Total: 2,035 questions complete

**Session 8 (Feb 9, 2026):** Diagram creation begins via Claude web interface
- ✅ Area & Perimeter v2: 59 diagrams created successfully
- ❌ Volume v2: Multiple failed attempts on 3D cuboids
- **Decision:** Platform inadequate for 3D precision work

**Session 9 (Feb 12, 2026):** Platform transition
- ✅ Claude Code installed via Cursor IDE
- ✅ Project opened in Cursor
- ✅ Second Brain created for context storage
- 🎯 **Next:** Create Volume cuboid diagrams with visual feedback

**Project Status:**
- **Questions:** 2,035 complete (16 topics expanded)
- **Diagrams:** 59 complete (Area & Perimeter only)
- **Remaining:** 213 diagrams (Volume, Angles, Data Handling)
- **Platform:** Now using Claude Code/Cursor exclusively

---

## KNOWN ISSUES & SOLUTIONS

### Issue: 3D Diagrams Failed in Web Interface
**Solution:** ✅ SOLVED - Using Claude Code/Cursor with visual preview

### Issue: Dimension Lines on Angled Edges
**Solution:** Claude Code allows iteration with immediate visual feedback

### Issue: Token/Context Window Limits
**Solution:** Not applicable in Claude Code - full file access

### Issue: Batch Script Complexity
**Solution:** No longer needed - direct file creation in IDE

---

## FUTURE ENHANCEMENTS (After Diagrams Complete)

### Phase 3 - Content Expansion
- Expand remaining 3 topics: Time, Money, Measurement (+900 questions)
- Target: 3,000+ total questions

### Phase 4 - Feature Improvements
- User accounts and cloud sync
- Progress analytics and performance tracking
- Timed exam simulation mode
- Difficulty adaptation based on performance
- Parent dashboard for monitoring progress
- Print-friendly worksheet generation

### Phase 5 - Additional Subjects
- English comprehension questions
- Verbal reasoning full expansion
- Non-verbal reasoning (requires more complex diagrams)

### Phase 6 - Deployment
- Host online for access anywhere
- Mobile app version (React Native)
- Share with other parents preparing children

---

## SUCCESS METRICS

**Phase 1 (Complete):** ✅
- 2,035 questions created
- All calculations verified
- Real-world contexts applied
- Character names used throughout

**Phase 2 (In Progress):** 22% Complete
- 59 of 272 diagrams created (22%)
- Area & Perimeter complete
- Volume, Angles, Data Handling remaining

**Overall Project:** ~70% Complete
- ✅ Question bank: 100% (of planned expansion)
- 🔄 Diagrams: 22% (59 of 272)
- 🎯 **Next Milestone:** Volume diagrams complete (100 diagrams total = 37%)

---

## TIPS FOR WORKING IN CLAUDE CODE/CURSOR

### Maximizing Efficiency

1. **Use Second Brain:** Store frequently used prompts, standards, templates
2. **Batch Similar Tasks:** Create all cuboids, then all cubes, etc.
3. **Preview Everything:** Visual verification prevents rework
4. **Save Incrementally:** Save after each successful diagram
5. **Test Frequently:** Run app every 5-10 diagrams to catch issues early

### Effective Prompting

**Be Specific:**
- Reference exact question numbers
- Include measurements from questions
- Cite design standards section
- Request preview before finalizing

**Iterate Quickly:**
- "Move the label 10px to the right"
- "Increase dimension line spacing by 5px"
- "Change fill-opacity to 0.7"

**Leverage Templates:**
- Once cuboid template perfect, reference it for all others
- "Use the same template as cuboid-q19.svg but with dimensions 15×8×4"

---

**Document Version:** 6.0
**Platform:** Claude Code via Cursor IDE
**Last Updated:** February 12, 2026
**Next Review:** After Volume diagrams complete
**Total Time Investment:** ~30 hours across 9 sessions
**Current Focus:** 3D diagram creation with visual feedback in Cursor

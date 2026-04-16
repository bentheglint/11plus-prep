# 11+ Exam Prep App - Working Instructions v6.0
**Last Updated:** February 12, 2026
**Platform:** Claude Code via Cursor IDE
**Current Focus:** Volume Diagram Creation

---

## 🚀 PLATFORM: CLAUDE CODE VIA CURSOR IDE

**Why We Switched:** Visual preview essential for 3D diagram precision. Multiple failures in web interface due to blind coordinate work.

**Advantages:**
- ✅ See SVG output immediately
- ✅ Direct file system access
- ✅ Faster iteration cycle
- ✅ Native IDE tools
- ✅ Full project management
- ✅ No token/context limits

**All future work (diagrams, features, questions) will be done in Claude Code/Cursor.**

---

## CURRENT PROJECT STATUS

### ✅ PHASE 1 COMPLETE: Question Bank
- **2,035 questions** created across 16 topics
- All calculations Python-verified
- All files integrated into app

### 🔄 PHASE 2 IN PROGRESS: Diagrams
- **Complete:** Area & Perimeter (59 diagrams)
- **Next:** Volume (62 diagrams) ← START HERE
- **Remaining:** Angles & Shapes (72) + Data Handling (55)
- **Total:** 59 of 272 diagrams (22% complete)

---

## 🎯 IMMEDIATE TASK: CREATE VOLUME CUBOID DIAGRAMS

### Task Overview
**Create 17 isometric 3D cuboid SVG diagrams** for Volume questions Q19-Q110

**Why This First:**
- Highest priority - blocked in web interface
- Template creation enables faster batch work
- Visual preview essential for 3D accuracy

### Question List (17 Cuboids)

| Question | Dimensions (L × W × H) | Find | Notes |
|----------|----------------------|------|-------|
| Q19 | 12 × 6 × 5 cm | Volume | All dimensions given |
| Q21 | 15 × 8 × 4 cm | Volume | All dimensions given |
| Q23 | 12 × 5 × ? cm | Height | Show "? cm" in red |
| Q26 | 20 × 10 × 6 cm | Volume | All dimensions given |
| Q28 | 18 × 12 × 5 cm | Volume | All dimensions given |
| Q33 | 14 × 7 × 6 cm | Volume | All dimensions given |
| Q42 | 16 × 9 × 7 cm | Volume | All dimensions given |
| Q49 | 16 × 5 × ? cm | Height | Show "? cm" in red |
| Q52 | 24 × 15 × 9 cm | Volume | All dimensions given |
| Q61 | 21 × 13 × 10 cm | Volume | All dimensions given |
| Q67 | 21 × 8 × ? cm | Height | Show "? cm" in red |
| Q69 | 28 × 19 × 12 cm | Volume | All dimensions given |
| Q79 | 30 × 24 × 18 cm | Volume | All dimensions given |
| Q81 | 24 × 10 × ? cm | Height | Show "? cm" in red |
| Q95 | 30 × 12 × ? cm | Height | Show "? cm" in red |
| Q99 | 56 × 38 × 24 cm | Volume | All dimensions given |
| Q110 | 36 × 14 × ? cm | Height | Show "? cm" in red |

**Unknown Values (6 questions):** Q23, Q49, Q67, Q81, Q95, Q110 - show red "? cm" on height dimension

---

## STEP-BY-STEP WORKFLOW

### Step 1: Open Project in Cursor

1. **Launch Cursor IDE**
2. **File → Open Folder**
3. Navigate to: `C:\Users\Ben Jackson\Projects\11plus-prep`
4. Click **Select Folder**
5. Project tree appears in left sidebar

### Step 2: Navigate to Volume Questions

1. In Cursor file tree, navigate to:
   ```
   src/questions/volume.js
   ```
2. Open file to reference question text and measurements
3. Keep this open for reference

### Step 3: Create Volume Directory

1. In file tree, navigate to:
   ```
   public/images/questions/
   ```
2. Right-click → **New Folder**
3. Name it: `volume`
4. This is where all Volume SVGs will be saved

### Step 4: Start with Q19 Test Diagram

**Prompt to Claude Code in Cursor:**

```
I need to create an isometric 3D cuboid SVG diagram for Volume Question 19.

Question: "A rectangular box is 12 cm long, 6 cm wide, and 5 cm high. What is its volume?"

Please create: public/images/questions/volume/cuboid-q19.svg

CRITICAL REQUIREMENTS - 3D Dimension Mapping (LOCKED STANDARD):
- Bottom front edge = LENGTH (12 cm) - horizontal dimension line BELOW front face
- Left front edge = HEIGHT (5 cm) - vertical dimension line LEFT of front face
- Top back edge = WIDTH/DEPTH (6 cm) - angled dimension line along the back edge going into 3D space

VISUAL STRUCTURE:
- Three visible faces: Front (rectangle), Top (parallelogram), Right (parallelogram)
- Front face: lightskyblue fill-opacity=0.8
- Top face: lightcyan fill-opacity=0.9
- Right face: skyblue fill-opacity=0.7
- All edges: black stroke-width=2

DIMENSION LINES:
- Gray lines (stroke-width=1) with perpendicular end markers
- Labels in dimgray, positioned externally
- NO text overlapping shape or lines
- Minimum 10px spacing between labels and shape

REFERENCE COORDINATES (adapt as needed):
Front face: (80,150)-(240,150)-(240,70)-(80,70)
Back face offset: (120,110)-(280,110)-(280,30)-(120,30)
ViewBox: 0 0 400 300

Please create this SVG and show me a preview so I can verify the dimension lines are correctly positioned on all three axes before we batch create the remaining 16 cuboids.
```

### Step 5: Review Preview & Iterate

**Check Visual Preview:**
- [ ] All three dimension lines visible?
- [ ] Bottom line = 12 cm (horizontal below shape)?
- [ ] Left line = 5 cm (vertical left of shape)?
- [ ] Angled line = 6 cm (along top back edge)?
- [ ] Labels clear and not overlapping?
- [ ] Shape looks like a proper 3D box?

**If Adjustments Needed:**
- "Move the width label 15px to the right"
- "Increase spacing between height label and left edge"
- "Make the angled dimension line follow the back edge more closely"

**Iterate until perfect** - this becomes your template!

### Step 6: Test in App

1. **Open terminal in Cursor** (Terminal → New Terminal)
2. **Start app:**
   ```bash
   npm start
   ```
3. **Browser opens automatically** at http://localhost:3000
4. Navigate to **Volume** topic
5. Find **Question 19**
6. **Verify diagram displays correctly**

### Step 7: Batch Create Remaining Cuboids

**Once Q19 template is perfect:**

```
Perfect! Now please create the remaining 16 cuboid diagrams using the same template with these dimensions:

Q21: 15 × 8 × 4 cm (all dimensions shown)
Q23: 12 × 5 × ? cm (show red "? cm" for height)
Q26: 20 × 10 × 6 cm (all dimensions shown)
Q28: 18 × 12 × 5 cm (all dimensions shown)
Q33: 14 × 7 × 6 cm (all dimensions shown)
Q42: 16 × 9 × 7 cm (all dimensions shown)
Q49: 16 × 5 × ? cm (show red "? cm" for height)
Q52: 24 × 15 × 9 cm (all dimensions shown)
Q61: 21 × 13 × 10 cm (all dimensions shown)
Q67: 21 × 8 × ? cm (show red "? cm" for height)
Q69: 28 × 19 × 12 cm (all dimensions shown)
Q79: 30 × 24 × 18 cm (all dimensions shown)
Q81: 24 × 10 × ? cm (show red "? cm" for height)
Q95: 30 × 12 × ? cm (show red "? cm" for height)
Q99: 56 × 38 × 24 cm (all dimensions shown)
Q110: 36 × 14 × ? cm (show red "? cm" for height)

Use exact same template structure as cuboid-q19.svg, just adjust:
1. The dimension measurements
2. For questions with "?", use red fill for the unknown dimension label

Save as: volume/cuboid-qN.svg (where N is the question number)
```

### Step 8: Verify All Cuboids

1. **Check file tree** - all 17 SVG files created?
2. **Preview** - spot-check 3-4 random diagrams
3. **Test in app** - navigate through Volume questions
4. **Hard refresh** browser (Ctrl+Shift+R) if images don't load

---

## 🎨 DESIGN STANDARDS (CRITICAL)

### 3D Cuboid Template - LOCKED STANDARD

**DO NOT DEVIATE FROM THIS MAPPING:**

For any question format "L cm long × W cm wide × H cm high":

1. **Bottom Dimension = LENGTH (L)**
   - Horizontal dimension line BELOW front face
   - Positioned ~20px below bottom edge
   - End markers at edges of front face
   - Label centered below line

2. **Left Dimension = HEIGHT (H)**
   - Vertical dimension line LEFT of front face
   - Positioned ~20px left of left edge
   - End markers at top and bottom of left edge
   - Label centered on left

3. **Angled Dimension = WIDTH/DEPTH (W)**
   - CRITICAL: This line must follow the TOP BACK EDGE angle
   - Runs from back-left-top corner to back-right-top corner
   - This is the edge going back into 3D space
   - Positioned slightly above/offset from edge
   - Label near this line (usually top-right area)

**Color Coding:**
```css
Front face: fill="lightskyblue" fill-opacity="0.8"
Top face: fill="lightcyan" fill-opacity="0.9"
Right face: fill="skyblue" fill-opacity="0.7"
All edges: stroke="black" stroke-width="2"
Dimension lines: stroke="gray" stroke-width="1"
Known labels: fill="dimgray"
Unknown labels: fill="red"
```

### Example SVG Structure

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <!-- Front face (rectangle) -->
  <path d="M 80 150 L 240 150 L 240 70 L 80 70 Z" 
        fill="lightskyblue" fill-opacity="0.8" stroke="black" stroke-width="2"/>
  
  <!-- Top face (parallelogram) -->
  <path d="M 80 70 L 240 70 L 280 30 L 120 30 Z" 
        fill="lightcyan" fill-opacity="0.9" stroke="black" stroke-width="2"/>
  
  <!-- Right face (parallelogram) -->
  <path d="M 240 150 L 280 110 L 280 30 L 240 70 Z" 
        fill="skyblue" fill-opacity="0.7" stroke="black" stroke-width="2"/>
  
  <!-- LENGTH dimension (bottom) -->
  <line x1="80" y1="170" x2="240" y2="170" stroke="gray" stroke-width="1"/>
  <line x1="80" y1="165" x2="80" y2="175" stroke="gray" stroke-width="1"/>
  <line x1="240" y1="165" x2="240" y2="175" stroke="gray" stroke-width="1"/>
  <text x="160" y="190" font-size="14" fill="dimgray" text-anchor="middle">12 cm</text>
  
  <!-- HEIGHT dimension (left) -->
  <line x1="60" y1="150" x2="60" y2="70" stroke="gray" stroke-width="1"/>
  <line x1="55" y1="150" x2="65" y2="150" stroke="gray" stroke-width="1"/>
  <line x1="55" y1="70" x2="65" y2="70" stroke="gray" stroke-width="1"/>
  <text x="45" y="115" font-size="14" fill="dimgray" text-anchor="middle">5 cm</text>
  
  <!-- WIDTH dimension (angled - top back edge) -->
  <line x1="120" y1="20" x2="280" y2="20" stroke="gray" stroke-width="1"/>
  <line x1="120" y1="15" x2="120" y2="25" stroke="gray" stroke-width="1"/>
  <line x1="280" y1="15" x2="280" y2="25" stroke="gray" stroke-width="1"/>
  <text x="200" y="15" font-size="14" fill="dimgray" text-anchor="middle">6 cm</text>
</svg>
```

---

## FILE NAMING & ORGANIZATION

### Directory Structure
```
public/images/questions/
├── area-perimeter/        ✓ Complete (59 files)
│   ├── rectangle-q31.svg
│   ├── square-q32.svg
│   └── ... (59 total)
├── volume/               ← WORKING HERE
│   ├── cuboid-q19.svg    ← Start here
│   ├── cuboid-q21.svg
│   └── ... (17 cuboids to create)
├── angles-shapes/        Not started
└── data-handling/        Not started
```

### Naming Convention
**Pattern:** `shape-type-qN.svg`

**Examples:**
- `cuboid-q19.svg`
- `cube-q20.svg`
- `tank-q25.svg`
- `pool-q32.svg`

**Rules:**
- All lowercase
- Hyphen-separated
- Include question number
- Descriptive shape type

---

## QUALITY CHECKLIST

### Before Moving to Next Diagram

**Visual Verification (Use Cursor Preview!):**
- [ ] All three dimension lines visible and correctly positioned
- [ ] No text overlapping shapes or lines
- [ ] Measurements match question exactly
- [ ] Colors match design standards
- [ ] Shape proportions look reasonable
- [ ] Unknown values shown as red "?" (if applicable)
- [ ] End markers on dimension lines visible

**Technical Verification:**
- [ ] SVG syntax valid (no errors)
- [ ] ViewBox: 0 0 400 300
- [ ] File saved in correct directory: `public/images/questions/volume/`
- [ ] Filename: `cuboid-qN.svg` (correct question number)

**App Integration:**
- [ ] Run `npm start` if not running
- [ ] Navigate to Volume topic
- [ ] Find specific question
- [ ] Diagram displays correctly
- [ ] Hard refresh (Ctrl+Shift+R) if needed

---

## AFTER CUBOIDS: REMAINING VOLUME DIAGRAMS

### Cubes (20 diagrams)
**Questions:** Q20, 22, 27, 31, 40, 43, 50, 55, 59, 64, 70, 75, 78, 85, 92, 96, 102, 107, 111, 116

**Template:** Same as cuboid but all dimensions equal
**Example:** Q20 - "A cube has edges of 7 cm"
- All three dimensions show "7 cm"
- Same 3D isometric structure

### Tanks (5 diagrams)
**Questions:** Q25, 51, 80, 98, 112

**Template:** Cuboid + water level line
**Features:**
- Base cuboid structure
- Horizontal line inside showing water level
- May need two sets of dimensions (tank + water)

### Pools (6 diagrams)
**Questions:** Q32, 56, 72, 89, 104, 117

**Template:** Similar to tanks
**Features:**
- Cuboid representing pool
- May show water level
- Context: swimming pool

### Rooms (4 diagrams)
**Questions:** Q24, 65, 97, 113

**Template:** Cuboid labeled as room
**Features:**
- Same structure as basic cuboid
- Context: bedroom, classroom, etc.

### Storage Units (2 diagrams)
**Questions:** Q46, 84

**Template:** Cuboid labeled as storage container

### Comparisons (4 diagrams)
**Questions:** Q35, 38, 83, 100

**Template:** Multiple cuboids side-by-side
**Features:**
- Two or more cuboids
- Different colors to distinguish
- Individual dimensions for each

### Algebraic (4 diagrams)
**Questions:** Q44, 62, 88, 114

**Template:** Cuboid with algebraic expressions
**Features:**
- Show variables (e.g., "x", "2x", "x+3")
- Use same dimension line structure

---

## WORKING EFFICIENTLY IN CURSOR

### Keyboard Shortcuts

**File Navigation:**
- `Ctrl+P` - Quick file open
- `Ctrl+B` - Toggle sidebar
- `Ctrl+Shift+E` - Focus file explorer

**Editing:**
- `Ctrl+D` - Select next occurrence
- `Ctrl+/` - Comment/uncomment
- `Alt+Up/Down` - Move line up/down

**Terminal:**
- `` Ctrl+` `` - Toggle terminal
- `Ctrl+Shift+`  - New terminal

**Claude Code:**
- `Ctrl+K` - Open Claude Code chat
- Type naturally to request code changes

### Best Practices

1. **Preview Before Saving:**
   - Use Cursor's built-in SVG preview
   - Verify visual appearance
   - Check all labels and lines

2. **Save Incrementally:**
   - Save after each successful diagram
   - Don't create 17 at once without testing

3. **Test Frequently:**
   - Run app every 5 diagrams
   - Catch issues early
   - Verify in actual browser

4. **Use Templates:**
   - Once Q19 perfect, reference it constantly
   - "Use exact same structure as cuboid-q19.svg"
   - Only change measurements

5. **Batch Similar Work:**
   - Do all cuboids with all dimensions first
   - Then do all with unknown heights
   - Pattern recognition speeds up work

---

## TROUBLESHOOTING

### Diagram Not Appearing in App

**Check:**
1. File saved in correct location? `public/images/questions/volume/`
2. Filename correct? `cuboid-q19.svg`
3. Question file references it? Check `src/questions/volume.js`
4. Hard refresh browser? `Ctrl+Shift+R`
5. App server running? `npm start` in terminal

### Dimension Line in Wrong Place

**Solution:** Use Cursor preview to adjust coordinates
- Horizontal line too high? Increase y-coordinate
- Vertical line too far left? Increase x-coordinate
- Angled line not following edge? Check start/end points match back edge vertices

### Text Overlapping Shape

**Solution:** Increase spacing
- Move dimension line further from shape (add 10px)
- Adjust label position away from edges

### SVG Not Rendering

**Check:**
1. Valid XML? - Missing quotes, unclosed tags
2. ViewBox set? - Should be `0 0 400 300`
3. Paths closed? - All `<path>` tags properly closed

### Colors Look Wrong

**Verify:**
- Front: `lightskyblue` opacity 0.8
- Top: `lightcyan` opacity 0.9
- Right: `skyblue` opacity 0.7
- No typos in color names

---

## PROGRESS TRACKING

### Volume Diagrams Checklist

**Cuboids (17):**
- [ ] Q19 - 12×6×5
- [ ] Q21 - 15×8×4
- [ ] Q23 - 12×5×?
- [ ] Q26 - 20×10×6
- [ ] Q28 - 18×12×5
- [ ] Q33 - 14×7×6
- [ ] Q42 - 16×9×7
- [ ] Q49 - 16×5×?
- [ ] Q52 - 24×15×9
- [ ] Q61 - 21×13×10
- [ ] Q67 - 21×8×?
- [ ] Q69 - 28×19×12
- [ ] Q79 - 30×24×18
- [ ] Q81 - 24×10×?
- [ ] Q95 - 30×12×?
- [ ] Q99 - 56×38×24
- [ ] Q110 - 36×14×?

**Cubes (20):** Not started
**Tanks (5):** Not started
**Pools (6):** Not started
**Rooms (4):** Not started
**Storage (2):** Not started
**Comparisons (4):** Not started
**Algebraic (4):** Not started

**Total Volume Progress:** 0 of 62 (0%)

### Overall Diagram Progress
- ✅ Area & Perimeter: 59 of 59 (100%)
- 🔄 Volume: 0 of 62 (0%)
- ⏳ Angles & Shapes: 0 of 72 (0%)
- ⏳ Data Handling: 0 of 55 (0%)

**Grand Total:** 59 of 272 (22%)

---

## ESTIMATED TIME TO COMPLETION

### Volume Diagrams
- **Cuboids (17):** 2-3 hours (includes template creation & testing)
- **Cubes (20):** 1 hour (template adapted)
- **Other shapes (25):** 2 hours (variations on template)
- **Total Volume:** ~5 hours

### Remaining Topics
- **Angles & Shapes (72):** ~8 hours
- **Data Handling (55):** ~6 hours
- **Total Remaining:** ~19 hours

**Project Completion Timeline:**
- At 2 hours/day: ~10 days
- At 4 hours/day: ~5 days
- At focused 8-hour session: ~2.5 days

---

## NEXT STEPS

1. ✅ **DONE:** Install Cursor with Claude Code
2. ✅ **DONE:** Open project in Cursor
3. 🎯 **NOW:** Create Q19 cuboid test diagram
4. **THEN:** Perfect template with visual feedback
5. **THEN:** Batch create remaining 16 cuboids
6. **THEN:** Test all cuboids in app
7. **THEN:** Move to cubes, tanks, pools, etc.
8. **THEN:** Complete Angles & Shapes diagrams
9. **THEN:** Complete Data Handling diagrams
10. **FINALLY:** Project 100% complete!

---

**Document Version:** 6.0
**Platform:** Claude Code via Cursor IDE
**Current Task:** Create cuboid-q19.svg test diagram
**Success Criteria:** Visual preview confirms dimension lines correctly positioned
**Time Investment So Far:** ~30 hours
**Estimated Remaining:** ~19 hours for all diagrams

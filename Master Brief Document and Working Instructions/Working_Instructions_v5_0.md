# 11+ Exam Prep App - Working Instructions v5.0
**Last Updated:** February 4, 2026
**Current Phase:** Diagram Creation

---

## CURRENT PROJECT STATUS

✅ **PHASE 1 COMPLETE:** Question Bank Expansion
- 16 topics expanded from 435 to 2,035 questions (4.68x growth)
- All calculations verified
- All files delivered to outputs directory

🎨 **PHASE 2 STARTING:** Diagram Creation
- Approximately 272 new diagrams needed
- Focus on geometry topics first (Area/Perimeter, Volume, Angles/Shapes)
- Then data visualization (Data Handling)

---

## IMMEDIATE PRIORITIES

### 1. DIAGRAM CREATION - PRIORITY ORDER

**PRIORITY 1 - Geometry Diagrams (Critical for Understanding)**

#### A. Area & Perimeter (~78 diagrams needed)
Questions requiring diagrams from the new set (Q31-Q130):
- Rectangle diagrams: Q31, 33, 35, 38, 39, 41, 46, 52, 54, 59, 64, 66, 71, 73, 78, 82, 85, 88, 89, 91, 100, 103, 105, 108, 114, 116, 118, 123, 126, 130
- Square diagrams: Q32, 34, 36, 42, 48, 51, 58, 62, 70, 80, 86, 90, 95, 102, 106, 113, 121, 124
- L-shaped rooms: Q61, 111
- Compound shapes with cutouts: Q75, 112
- Paths/borders: Q45, 94, 98, 119, 128
- Comparison diagrams: Q74, 93, 127
- Pool diagrams: Q91
- Flowerbeds: Q93

**File naming pattern:** `area-perimeter/[shape-type]-q[N].svg`
- Example: `area-perimeter/rectangle-q31.svg`
- Example: `area-perimeter/l-shape-q61.svg`

#### B. Volume (~62 diagrams needed)
Questions requiring diagrams from the new set (Q19-Q118):
- Cuboid diagrams: Q19, 21, 23, 26, 28, 33, 42, 49, 52, 61, 67, 69, 79, 81, 95, 99, 110
- Cube diagrams: Q20, 22, 27, 31, 40, 43, 50, 55, 59, 64, 70, 75, 78, 85, 92, 96, 102, 107, 111, 116
- Tank diagrams: Q25, 51, 80, 98, 112
- Pool diagrams: Q32, 56, 72, 89, 104, 117
- Room diagrams: Q24, 65, 97, 113
- Storage unit diagrams: Q46, 84
- Comparison diagrams: Q35, 38, 83, 100
- Algebraic diagrams: Q44, 62, 88, 114
- Multiple cubes (word problems): Q29, 53, 71, 87, 108

**File naming pattern:** `volume/[shape-type]-q[N].svg`
- Example: `volume/cuboid-q19.svg`
- Example: `volume/tank-q25.svg`

#### C. Angles & Shapes (~72 diagrams needed)
Questions requiring diagrams from the new set (Q23-Q122):
- Straight line angles: Q23, 28, 29, 37, 39, 44, 46, 51, 52, 58, 61, 63, 72, 77, 84, 89, 98, 103, 110, 116, 122
- Triangles: Q24, 25, 32, 36, 41, 44, 52, 57, 60, 61, 71, 79, 91, 94, 107, 112
- Angles around points: Q24, 28, 34, 43, 49, 53, 62, 74, 81, 92, 101, 114, 121
- Quadrilaterals: Q26, 38, 39, 47, 49, 56, 67, 76, 86, 95, 105, 115
- Isosceles triangles: Q27, 29, 30, 40, 47, 48, 50, 53, 59, 65, 69, 78, 82, 90, 99, 102, 108, 117, 118
- Right triangles: Q31, 34, 42, 45, 54, 55, 64, 75, 88, 97, 109, 120
- Parallel lines: Q35, 42, 57, 59, 68, 80, 93, 106, 119
- Exterior angles: Q31, 37, 46, 50, 60, 73, 87, 100, 111
- Regular polygons: Q32, 45, 48, 54, 66, 83, 104

**File naming pattern:** `angles-shapes/[diagram-type]-q[N].svg`
- Example: `angles-shapes/triangle-q24.svg`
- Example: `angles-shapes/straight-line-q23.svg`

**PRIORITY 2 - Data Visualization Diagrams**

#### D. Data Handling (~55 diagrams needed)
Questions requiring diagrams from the new set (Q26-Q125):
- Bar charts: Q36, 52, 67, 83, 99, 115
- Line graphs: Q40, 56, 71, 87, 104, 119
- Pie charts: Q44, 59, 75, 92, 111
- Two-way tables: Q63, 80, 95, 107, 123
- Timetables: Q48

**File naming pattern:** `data-handling/[chart-type]-q[N].svg`
- Example: `data-handling/bar-chart-q36.svg`
- Example: `data-handling/pie-chart-q44.svg`

---

## DIAGRAM CREATION WORKFLOW

### Step 1: Prepare Batch Script Template

Create a Windows batch file with this structure:

```batch
@echo off
echo Creating [Topic] SVGs...

REM Create topic directory
if not exist "[topic-name]" mkdir "[topic-name]"

REM Create individual SVG files
(
echo ^<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"^>
echo   [SVG content here]
echo ^</svg^>
) > "[topic-name]/[diagram-name].svg"

echo Done! Check the [topic-name] folder.
pause
```

### Step 2: Follow Design Standards v5.0

**Color Palette:**
```
- Shape fills: lightskyblue (opacity 0.3-0.5)
- Borders: black (stroke-width 2)
- Labels (known): dimgray
- Labels (unknown): red
- Dimension lines: gray
- Secondary shapes: lightcoral
```

**Label Positioning:**
- NEVER overlap with lines
- Minimum 10-15px spacing from shapes
- Use dimension lines to connect labels to measurements

**2D Shapes:**
- Width = bottom dimension line (horizontal)
- Height = left dimension line (vertical)

**3D Shapes:**
- Width = bottom front edge (horizontal)
- Height = left front edge (vertical)
- Depth = bottom-right diagonal edge

### Step 3: Create Diagrams in Batches

**Recommended Batch Sizes:**
- 20-30 diagrams per batch script
- Test each batch before moving to next
- Keep related diagrams together (e.g., all rectangles)

**Example: Area & Perimeter Rectangles Batch 1**
- Create: `create_area_perimeter_rectangles_1.bat`
- Include: Q31, Q33, Q35, Q38, Q39, Q41, Q46, Q52, Q54, Q59
- Total: 10 diagrams
- Test in app
- If successful, continue to next batch

### Step 4: Verify in Application

After running batch script:
1. Navigate to `C:\Users\Ben Jackson\Projects\11plus-prep\public\images\questions\`
2. Verify folders created: `area-perimeter/`, `volume/`, etc.
3. Check SVG files present
4. Open browser with app running
5. Select topic and find questions with images
6. Press Ctrl+Shift+R to hard refresh
7. Verify diagrams display correctly
8. Check labels readable and not overlapping lines

### Step 5: Quality Check

For each diagram verify:
- ✓ Measurements match question values
- ✓ Labels positioned clearly
- ✓ No label/line overlaps
- ✓ Colors consistent with standards
- ✓ Dimension lines have end markers
- ✓ File naming matches reference in question

---

## APP INTEGRATION CHECKLIST

### Integrating v2 Question Files

For each topic, follow these steps:

**1. Locate Original File**
```
Path: C:\Users\Ben Jackson\Projects\11plus-prep\src\App.js
Find: const questions = { ... }
```

**2. Download v2 File**
```
From: /mnt/user-data/outputs/[topic]_v2_questions_[range].js
To: Local downloads folder
```

**3. Integration Process**
```
1. Open App.js in VS Code
2. Find the topic section (e.g., "percentages")
3. Scroll to last question in questions array
4. After closing brace }, add comma
5. Open v2 file in separate editor
6. Copy entire questions array from v2 file
7. Paste after comma in App.js
8. Verify closing brackets and commas
9. Save file
```

**4. Test Integration**
```
1. Run app in browser (npm start or refresh)
2. Select topic
3. Verify question count increased
4. Test random questions from new range
5. Check explanations display correctly
6. Verify progress tracking works
```

**Example Integration:**
```javascript
// Before
percentages: {
  name: "Percentages",
  questions: [
    { id: 1, question: "...", ... },
    // ... through Q35
    { id: 35, question: "...", ... }  // <-- Add comma here
  ]
}

// After
percentages: {
  name: "Percentages",
  questions: [
    { id: 1, question: "...", ... },
    // ... through Q35
    { id: 35, question: "...", ... },  // <-- Comma added
    { id: 36, question: "...", ... },  // <-- New questions start
    // ... through Q135
    { id: 135, question: "...", ... }
  ]
}
```

---

## DIAGRAM CREATION TEMPLATES

### Template 1: Rectangle (Area & Perimeter)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <!-- Rectangle -->
  <rect x="100" y="80" width="200" height="120" 
        fill="lightskyblue" fill-opacity="0.4" 
        stroke="black" stroke-width="2"/>
  
  <!-- Width dimension line (bottom) -->
  <line x1="100" y1="220" x2="300" y2="220" stroke="gray" stroke-width="1"/>
  <line x1="100" y1="215" x2="100" y2="225" stroke="gray" stroke-width="1"/>
  <line x1="300" y1="215" x2="300" y2="225" stroke="gray" stroke-width="1"/>
  <text x="200" y="240" font-size="16" fill="dimgray" text-anchor="middle">[WIDTH] cm</text>
  
  <!-- Height dimension line (left) -->
  <line x1="80" y1="80" x2="80" y2="200" stroke="gray" stroke-width="1"/>
  <line x1="75" y1="80" x2="85" y2="80" stroke="gray" stroke-width="1"/>
  <line x1="75" y1="200" x2="85" y2="200" stroke="gray" stroke-width="1"/>
  <text x="60" y="145" font-size="16" fill="dimgray" text-anchor="middle">[HEIGHT] cm</text>
</svg>
```

### Template 2: Cube (Volume - 3D)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <!-- Front face -->
  <rect x="120" y="120" width="120" height="120" 
        fill="lightskyblue" fill-opacity="0.4" 
        stroke="black" stroke-width="2"/>
  
  <!-- Top face -->
  <polygon points="120,120 180,80 300,80 240,120" 
           fill="lightskyblue" fill-opacity="0.3" 
           stroke="black" stroke-width="2"/>
  
  <!-- Right face -->
  <polygon points="240,120 300,80 300,200 240,240" 
           fill="lightskyblue" fill-opacity="0.35" 
           stroke="black" stroke-width="2"/>
  
  <!-- Edge dimension (front bottom) -->
  <line x1="120" y1="255" x2="240" y2="255" stroke="gray" stroke-width="1"/>
  <line x1="120" y1="250" x2="120" y2="260" stroke="gray" stroke-width="1"/>
  <line x1="240" y1="250" x2="240" y2="260" stroke="gray" stroke-width="1"/>
  <text x="180" y="275" font-size="16" fill="dimgray" text-anchor="middle">[EDGE] cm</text>
</svg>
```

### Template 3: Triangle (Angles & Shapes)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <!-- Triangle -->
  <polygon points="200,80 100,220 300,220" 
           fill="lightskyblue" fill-opacity="0.4" 
           stroke="black" stroke-width="2"/>
  
  <!-- Angle labels -->
  <text x="200" y="110" font-size="16" fill="dimgray" text-anchor="middle">[ANGLE1]°</text>
  <text x="110" y="210" font-size="16" fill="dimgray" text-anchor="middle">[ANGLE2]°</text>
  <text x="280" y="210" font-size="16" fill="dimgray" text-anchor="middle">?</text>
</svg>
```

### Template 4: Bar Chart (Data Handling)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <!-- Axes -->
  <line x1="50" y1="250" x2="350" y2="250" stroke="black" stroke-width="2"/>
  <line x1="50" y1="250" x2="50" y2="50" stroke="black" stroke-width="2"/>
  
  <!-- Bars -->
  <rect x="80" y="[Y1]" width="50" height="[H1]" fill="lightskyblue" stroke="black" stroke-width="1"/>
  <rect x="150" y="[Y2]" width="50" height="[H2]" fill="lightskyblue" stroke="black" stroke-width="1"/>
  <rect x="220" y="[Y3]" width="50" height="[H3]" fill="lightskyblue" stroke="black" stroke-width="1"/>
  <rect x="290" y="[Y4]" width="50" height="[H4]" fill="lightskyblue" stroke="black" stroke-width="1"/>
  
  <!-- Labels -->
  <text x="105" y="270" font-size="12" fill="dimgray" text-anchor="middle">[Label1]</text>
  <text x="175" y="270" font-size="12" fill="dimgray" text-anchor="middle">[Label2]</text>
  <text x="245" y="270" font-size="12" fill="dimgray" text-anchor="middle">[Label3]</text>
  <text x="315" y="270" font-size="12" fill="dimgray" text-anchor="middle">[Label4]</text>
</svg>
```

---

## COMMON ISSUES & SOLUTIONS

### Issue 1: Labels Overlapping Lines
**Problem:** Text appears directly on dimension lines or shape edges
**Solution:** 
- Move text 15-20px away from lines
- Use clear white space
- Add dimension line to connect label to measurement

### Issue 2: 3D Depth Lines Crossing
**Problem:** Width and depth dimension lines cross each other
**Solution:**
- Place width line at bottom front edge (horizontal)
- Place depth line at bottom-right edge (diagonal back)
- Ensure they don't intersect

### Issue 3: Batch Script Errors
**Problem:** Script fails or creates malformed SVGs
**Solution:**
- Check for unescaped special characters (< > &)
- Use ^< ^> for brackets in batch files
- Test with 1-2 diagrams first
- Break large scripts into smaller batches

### Issue 4: Images Not Displaying
**Problem:** Questions show broken image icons
**Solution:**
- Verify file paths match exactly
- Check folder structure: `public/images/questions/[topic]/`
- Hard refresh browser: Ctrl+Shift+R
- Check SVG files are valid XML
- Verify file names match question references

### Issue 5: Inconsistent Diagram Quality
**Problem:** Some diagrams look different from others
**Solution:**
- Use templates from this document
- Maintain color scheme consistently
- Keep viewBox dimensions consistent (400x300)
- Use same stroke-width values

---

## PROGRESS TRACKING

### Questions Integration Status

| Topic | Total Q's | Original | New | Integration | Diagrams |
|-------|-----------|----------|-----|-------------|----------|
| Percentages | 135 | 35 | 100 | ⬜ Pending | N/A |
| Decimals | 135 | 35 | 100 | ⬜ Pending | N/A |
| Long Division | 130 | 30 | 100 | ⬜ Pending | N/A |
| Ratio & Proportion | 130 | 30 | 100 | ⬜ Pending | N/A |
| Fractions | 135 | 35 | 100 | ⬜ Pending | N/A |
| Long Multiplication | 125 | 25 | 100 | ⬜ Pending | N/A |
| Algebra | 135 | 35 | 100 | ⬜ Pending | N/A |
| Place Value | 125 | 25 | 100 | ⬜ Pending | N/A |
| Negative Numbers | 120 | 20 | 100 | ⬜ Pending | N/A |
| Prime Numbers | 115 | 15 | 100 | ⬜ Pending | N/A |
| Area & Perimeter | 130 | 30 | 100 | ⬜ Pending | ⬜ 78 needed |
| Volume | 118 | 18 | 100 | ⬜ Pending | ⬜ 62 needed |
| Angles & Shapes | 122 | 22 | 100 | ⬜ Pending | ⬜ 72 needed |
| Sequences | 120 | 20 | 100 | ⬜ Pending | N/A |
| Data Handling | 125 | 25 | 100 | ⬜ Pending | ⬜ 55 needed |
| Speed/Distance/Time | 115 | 15 | 100 | ⬜ Pending | ⬜ 5 needed |

**Legend:**
- ⬜ Pending
- 🟡 In Progress  
- ✅ Complete

---

## TESTING PROTOCOL

### Before Each Session
1. Backup App.js file
2. Test existing questions work
3. Verify localStorage clearing if needed
4. Note current question counts

### During Integration
1. Integrate one topic at a time
2. Save after each integration
3. Test in browser immediately
4. Verify new questions appear
5. Check random sampling of new questions

### After Diagram Creation
1. Hard refresh browser (Ctrl+Shift+R)
2. Navigate to questions with diagrams
3. Verify all images load
4. Check measurements are legible
5. Confirm no overlapping elements
6. Test on daughter's device

### Quality Assurance Checks
- [ ] All calculations still correct
- [ ] Explanations display properly
- [ ] Progress tracking works
- [ ] Images load without errors
- [ ] Random selection works
- [ ] No console errors
- [ ] Daughter can navigate easily

---

## NEXT SESSION CHECKLIST

### Session Preparation
- [ ] Review Master Brief v5.0
- [ ] Check this Working Instructions document
- [ ] Decide which topic diagrams to create first
- [ ] Prepare batch script template
- [ ] Have design standards ready

### During Session
- [ ] Create batch script for first diagram set
- [ ] Test with 1-2 diagrams first
- [ ] If successful, complete batch
- [ ] Run script in correct directory
- [ ] Test in browser
- [ ] Document any issues
- [ ] Repeat for next batch

### End of Session
- [ ] Count diagrams created
- [ ] Update progress tracking
- [ ] Note any issues for next time
- [ ] Backup all files
- [ ] Update Master Brief if needed

---

## QUICK REFERENCE

### File Paths
```
App location: C:\Users\Ben Jackson\Projects\11plus-prep
App.js: C:\Users\Ben Jackson\Projects\11plus-prep\src\App.js
Images: C:\Users\Ben Jackson\Projects\11plus-prep\public\images\questions\
```

### Key Numbers
- Total questions: 2,035
- Original questions: 435
- New questions: 1,700
- Diagrams needed: ~272
- Topics expanded: 16

### Design Standards Quick List
```
Colors:
- Shape fill: lightskyblue (0.3-0.5 opacity)
- Borders: black (2px)
- Labels known: dimgray
- Labels unknown: red
- Dimension lines: gray

Spacing:
- Labels: 10-15px from shapes
- Stroke width: 2px for shapes, 1px for dimension lines
- ViewBox: 400x300 for most diagrams
```

---

**Document Version:** 5.0
**Last Updated:** February 4, 2026
**Next Update:** After first diagram batch completed

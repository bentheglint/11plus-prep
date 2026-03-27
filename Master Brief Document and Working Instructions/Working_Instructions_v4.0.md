# 11+ Exam Prep App - Working Instructions v4.0
**Last Updated:** January 26, 2026

---

## QUICK REFERENCE - CURRENT STATUS

**Total Maths Questions:** 405 (Target: 435)
**Diagrams Created:** 75 SVGs across 4 topics
**Remaining:** 30 questions (Speed/Distance/Time + Prime Numbers/Factors)

---

## DIAGRAM CREATION WORKFLOW

### Step 1: Plan the Topic
1. Identify how many questions need diagrams (~60-70% typical)
2. List diagram types needed (bar charts, shapes, angles, etc.)
3. Review design standards before creating

### Step 2: Create Batch Script
```batch
@echo off
echo Creating [Topic] SVG diagrams...
if not exist "topic-name" mkdir topic-name

REM Each diagram in parentheses block
(
echo ^<svg width="400" height="300"^>
echo   [SVG content here]
echo ^</svg^>
) > "topic-name\diagram-q1.svg"

pause
```

### Step 3: Test & Iterate
1. Create batch script with 2-3 test diagrams first
2. Have user run script
3. Check for errors or rendering issues
4. Fix issues before creating all diagrams
5. For complex scripts (pie charts), break into parts

### Step 4: Delivery
1. Copy batch script to outputs: `cp /home/claude/script.bat /mnt/user-data/outputs/`
2. Present file to user
3. User downloads and runs from correct directory
4. Verify all diagrams created successfully

---

## DESIGN STANDARDS - COMPREHENSIVE GUIDE

### COLOR PALETTE (MANDATORY)

**Primary Colors:**
- Shape fills: `lightskyblue` 
- Fill opacity: `0.3` to `0.5` depending on context
- Borders: `black`
- Stroke width: `2` for shapes, `1` for dimension lines

**Text Colors:**
- Known values: `dimgray` or `#333`
- Unknown values: `red`
- Font: `Arial`
- Size: `14-16px` for labels, `12px` for axis labels

**Secondary Colors:**
- Comparison shapes: `lightcoral`
- Special highlights: `lightyellow` (with stroke for visibility)
- Dimension lines: `gray` or `#666`

### LABEL POSITIONING - CRITICAL RULES

**Rule 1: NEVER overlap lines**
```
❌ BAD: <text x="150" y="100">Label</text>  [if line passes through x=150, y=100]
✅ GOOD: <text x="170" y="85">Label</text>   [clearly away from line]
```

**Rule 2: Minimum spacing**
- 10-15px between label and nearest diagram element
- For angular lines, calculate offset to avoid overlap
- Test by viewing SVG - if label hard to read, it's too close

**Rule 3: Use dimension lines**
```svg
<!-- Dimension line with end markers -->
<line x1="50" y1="200" x2="250" y2="200" stroke="gray" stroke-width="1"/>
<line x1="50" y1="195" x2="50" y2="205" stroke="gray" stroke-width="1"/>
<line x1="250" y1="195" x2="250" y2="205" stroke="gray" stroke-width="1"/>
<text x="150" y="220" text-anchor="middle">10cm</text>
```

### 2D SHAPES - STANDARD TEMPLATE

**Rectangles/Squares:**
```svg
<svg width="300" height="250" xmlns="http://www.w3.org/2000/svg">
  <!-- Shape -->
  <rect x="50" y="50" width="200" height="150" 
        fill="lightskyblue" fill-opacity="0.3" 
        stroke="black" stroke-width="2"/>
  
  <!-- Width dimension (bottom) -->
  <line x1="50" y1="215" x2="250" y2="215" stroke="gray" stroke-width="1"/>
  <line x1="50" y1="210" x2="50" y2="220" stroke="gray" stroke-width="1"/>
  <line x1="250" y1="210" x2="250" y2="220" stroke="gray" stroke-width="1"/>
  <text x="150" y="235" text-anchor="middle" font-family="Arial" 
        font-size="16" fill="dimgray">Width</text>
  
  <!-- Height dimension (left) -->
  <line x1="35" y1="50" x2="35" y2="200" stroke="gray" stroke-width="1"/>
  <line x1="30" y1="50" x2="40" y2="50" stroke="gray" stroke-width="1"/>
  <line x1="30" y1="200" x2="40" y2="200" stroke="gray" stroke-width="1"/>
  <text x="15" y="130" text-anchor="middle" font-family="Arial" 
        font-size="16" fill="dimgray">Height</text>
</svg>
```

### 3D SHAPES - STANDARD TEMPLATE

**Cuboids (Critical - Follow Exactly):**
```svg
<svg width="320" height="260" xmlns="http://www.w3.org/2000/svg">
  <!-- Front face (rectangle) -->
  <rect x="80" y="100" width="140" height="80" 
        fill="lightskyblue" fill-opacity="0.5" 
        stroke="black" stroke-width="2"/>
  
  <!-- Top face (polygon) -->
  <polygon points="80,100 115,75 255,75 220,100" 
           fill="lightskyblue" fill-opacity="0.7" 
           stroke="black" stroke-width="2"/>
  
  <!-- Right face (polygon) -->
  <polygon points="220,100 255,75 255,155 220,180" 
           fill="lightskyblue" fill-opacity="0.3" 
           stroke="black" stroke-width="2"/>
  
  <!-- WIDTH - bottom dimension (shortened to not cross diagonal) -->
  <line x1="80" y1="195" x2="210" y2="195" stroke="gray" stroke-width="1"/>
  <line x1="80" y1="190" x2="80" y2="200" stroke="gray" stroke-width="1"/>
  <line x1="210" y1="190" x2="210" y2="200" stroke="gray" stroke-width="1"/>
  <text x="145" y="215" text-anchor="middle" font-family="Arial" 
        font-size="16" fill="dimgray">10cm</text>
  
  <!-- HEIGHT - left dimension -->
  <line x1="65" y1="100" x2="65" y2="180" stroke="gray" stroke-width="1"/>
  <line x1="60" y1="100" x2="70" y2="100" stroke="gray" stroke-width="1"/>
  <line x1="60" y1="180" x2="70" y2="180" stroke="gray" stroke-width="1"/>
  <text x="45" y="145" text-anchor="middle" font-family="Arial" 
        font-size="16" fill="dimgray">4cm</text>
  
  <!-- DEPTH - bottom-right diagonal (starts after horizontal ends) -->
  <line x1="225" y1="188" x2="255" y2="165" stroke="gray" stroke-width="1"/>
  <line x1="223" y1="191" x2="227" y2="185" stroke="gray" stroke-width="1"/>
  <line x1="253" y1="168" x2="257" y2="162" stroke="gray" stroke-width="1"/>
  <text x="260" y="195" text-anchor="start" font-family="Arial" 
        font-size="16" fill="dimgray">5cm</text>
</svg>
```

**Key Points for 3D:**
1. Different opacities create depth (0.3, 0.5, 0.7)
2. Dimension lines must NOT cross
3. Depth line on bottom-right diagonal going back
4. Labels positioned clearly away from all lines

### DATA HANDLING DIAGRAMS

**Bar Charts:**
- Y-axis: Left side with labels
- X-axis: Bottom with category labels
- Bars: Different colors for visual interest
- Consistent spacing between bars

**Pie Charts:**
- NO full circle outline (causes double border)
- Only slice paths with borders
- Path format: `d="M 175 175 L x1 y1 A 100 100 0 0 1 x2 y2 Z"`
- Note: Use spaces not commas in coordinates for batch compatibility

**Line Graphs:**
- Both axes clearly labeled
- Data points marked with circles
- Polyline connects points
- Grid lines optional but helpful

**Tables:**
- Rectangle cells with borders
- Header row highlighted (lightblue background)
- Answer cells highlighted (lightyellow with bold stroke)
- Clear spacing between cells

---

## QUESTION WRITING STANDARDS

### Format Template
```javascript
{
  id: 1,
  question: "[Character name] [action/context]. [Question]?",
  image: "topic-name/diagram-qN.svg",  // Optional
  options: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
  correct: 2,  // Index 0-4
  explanation: "[Step 1]. [Step 2]. [Answer] = [value]. ✓"
}
```

### Character Names Pool
Use variety: Emma, Tom, Sophie, Jake, Lucy, Ben, Mia, Oliver, Sarah, Charlie, Hannah, Ava, Noah, Ella, Max, Lily

### Real-World Contexts
- Shopping/money situations
- Sports scores/measurements
- School tests/grades
- Cooking/recipes
- Travel/journeys
- Family activities
- Games/competitions

### Explanation Format
1. State the formula or rule
2. Show substitution with numbers
3. Show calculation
4. State final answer with units
5. End with ✓

Example:
```
"Area of rectangle = length × width. Area = 8 × 5 = 40. 
The area is 40 m². ✓"
```

---

## PYTHON VERIFICATION TEMPLATE

Always verify calculations before delivery:

```python
print("Verifying [Topic] Questions:")
print("="*50)

# Q1: [Description]
q1 = [calculation]
print(f"Q1: [calculation] = {q1} (index X: {answer}) ✓")

# Continue for all questions...

print("="*50)
print("All calculations verified! ✓")
```

---

## BATCH SCRIPT TROUBLESHOOTING

### Common Issues

**Issue 1: Script exits immediately**
- Solution: Break into smaller parts
- Check for special characters causing errors
- Add `echo` statements to see where it fails

**Issue 2: SVG not rendering correctly**
- Check for unescaped characters
- Verify all `^<` and `^>` are escaped
- Test with simple SVG first

**Issue 3: Pie chart paths failing**
- Use spaces not commas in coordinates
- Remove full circle outline
- Test one slice at a time

**Issue 4: Labels unreadable**
- Move labels away from lines
- Increase spacing
- Check color contrast

---

## APP INTEGRATION CHECKLIST

### Adding New Topic
- [ ] Download `topic.js` file
- [ ] Open `App.js` in VS Code
- [ ] Find last topic's closing brace `}`
- [ ] Add comma after the closing brace
- [ ] Paste new topic content
- [ ] Save file
- [ ] Test in browser (localhost:3000)
- [ ] Verify topic appears in selection
- [ ] Test a few questions

### Adding Diagrams
- [ ] Download batch script
- [ ] Navigate to `public/images/questions/`
- [ ] Run batch script
- [ ] Verify folder created
- [ ] Check all SVG files present
- [ ] Open one SVG in browser to test
- [ ] Refresh app (Ctrl+Shift+R)
- [ ] Test questions with images

---

## SESSION WORKFLOW

### Starting a New Topic
1. Agree on topic and question count
2. Determine diagram requirements
3. Create questions with Python verification
4. Create batch script for diagrams (if needed)
5. Test diagrams in parts
6. Deliver files
7. User integrates into app
8. Update documentation

### Quality Checks
- [ ] All calculations verified
- [ ] Character names used
- [ ] Real-world contexts applied
- [ ] Explanations clear with ✓
- [ ] Diagrams follow design standards
- [ ] Labels readable and well-positioned
- [ ] Consistent color scheme
- [ ] Files organized correctly

---

## CRITICAL REMINDERS

1. **Always verify with Python** before delivery
2. **Test diagrams in small batches** before creating all
3. **Never place labels over lines** - readability is critical
4. **Use consistent colors** across all topics
5. **Break complex batch scripts** into parts if errors occur
6. **3D depth dimension** goes on bottom-right diagonal
7. **Dimension lines must not cross** each other
8. **Character names** make questions engaging
9. **Real-world contexts** make questions relatable
10. **Update documentation** after each session

---

## FILE LOCATIONS

**Development:**
- Questions: `/home/claude/[topic].js`
- Batch scripts: `/home/claude/create_[topic]_svgs.bat`
- Output delivery: `/mnt/user-data/outputs/`

**User Environment:**
- App location: `C:\Users\Ben Jackson\Projects\11plus-prep`
- App.js: `C:\Users\Ben Jackson\Projects\11plus-prep\src\App.js`
- Images: `C:\Users\Ben Jackson\Projects\11plus-prep\public\images\questions\`

---

**Document Version:** 4.0
**Companion Document:** Master Brief v4.0
**Next Update:** After Phase 4 completion

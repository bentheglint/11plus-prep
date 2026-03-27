# 11+ EXAM PREP APP - MASTER BRIEF v3.2
**Project Owner:** Ben Jackson, building app for 9-year-old daughter
**Exam Date:** September 26, 2026
**Target Schools:** Bournemouth Grammar School & Parkstone Grammar School (Dorset Consortium)
**App Location:** `C:\Users\Ben Jackson\Projects\11plus-prep`
**Last Updated:** January 22, 2026

---

## EXECUTIVE SUMMARY

Building a React-based 11+ exam prep app with a comprehensive question bank covering Maths, English, and Verbal Reasoning. Currently focused on building high-quality Maths questions that match GL Assessment difficulty and style.

**Current Status:**
- ✅ App infrastructure: Working React app running locally via VS Code
- ✅ Question bank: **320 Maths questions across 11 topics** (Phase 2 complete + 1 Phase 3 topic!)
- ✅ Quality assurance: Error-checking process implemented and verified
- ✅ **IMAGE SUPPORT: Successfully implemented and working!** (January 21, 2026)
- ✅ **SVG GENERATION METHOD: Batch script (.bat file) proven successful!** (January 22, 2026)
- ✅ **Area & Perimeter complete with 18 diagrams** (January 22, 2026)
- 🎯 Next: Continue with Phase 3 - Medium Priority topics (Volume, Angles/Shapes, Sequences)
- 📅 Timeline: 8 months until exam (September 26, 2026)

---

## ✅ SVG DIAGRAM CREATION - PROVEN METHOD (January 22, 2026)

### Batch Script Method - SUCCESS!

**Status:** Found an efficient, reliable method for creating SVG files

**The Method:**
1. Claude creates a Windows batch script (.bat file) containing all SVG code
2. User downloads the .bat file
3. User places .bat file in: `C:\Users\Ben Jackson\Projects\11plus-prep\public\images\questions\`
4. User double-clicks the .bat file
5. Script automatically creates folder and all SVG files
6. Files are immediately ready to use in the app

**Why This Works Well:**
- ✅ Fast - creates dozens of files instantly
- ✅ Reliable - no download format issues
- ✅ Automated - no manual file creation needed
- ✅ Repeatable - can use for all future topics with diagrams
- ✅ Simple - just download and double-click

**First Implementation:**
- Area & Perimeter: 18 SVG diagrams created successfully
- All diagrams displaying correctly in app
- User confirmed method works well

---

## ✅ IMAGE SUPPORT - SUCCESSFULLY IMPLEMENTED (January 21, 2026)

### Implementation Complete

**Status:** Image support is now working in the app!

**What Was Done:**
1. ✅ Modified App.js to display images when present in questions
2. ✅ Created folder structure: `public/images/questions/`
3. ✅ Generated SVG diagram examples (5 types)
4. ✅ Successfully tested with rectangle diagram
5. ✅ Confirmed backward compatibility (questions without images still work)

### How It Works Now

Questions can now optionally include an image field:

**Question Structure:**
```javascript
{
  id: 1,
  question: "Which of these shapes has a different perimeter?",
  image: "area-perimeter/shapes_q1.svg",  // NEW: Optional field
  options: ["Shape A", "Shape B", "Shape C", "Shape D", "Shape E"],
  correct: 2,
  explanation: "Calculate each perimeter..."
}
```

**File Organization (✅ COMPLETE)**
```
public/
  images/
    questions/
      area-perimeter/          ← 18 SVG files (COMPLETE!)
        rectangle-q1.svg
        rectangle-q2.svg
        square-q3.svg
        ... (15 more files)
      [future topic folders]
      volume/
      angles-shapes/
      data-averages/
```

**Image Generation Strategy (✅ PROVEN)**
- **SVG format** - Successfully tested and working!
- **Batch script method** - Most efficient approach discovered
- **Working examples created:**
  - Geometric shapes with measurements ✅
  - Compound/L-shaped figures ✅
  - Shapes with cutouts ✅
  - Multiple shape comparisons ✅
  - Shapes with unknown dimensions ✅
- Scalable, crisp, small file size
- No manual image creation needed

**App Code Changes (✅ COMPLETE)**
- Modified App.js around line 2710
- Added image display component
- Checks for optional image field
- Displays centered, responsive image when present
- Maintains backward compatibility (works without images)
- **Status:** Working perfectly!

---

## TECHNICAL SETUP

### App Structure
- **Framework:** React app (Create React App)
- **Location:** `C:\Users\Ben Jackson\Projects\11plus-prep`
- **Key files:**
  - `src/App.js` - Main app file containing question data and UI logic
  - `src/App.css` - Styling
  - `public/index.html` - HTML template
  - `public/images/questions/` - Images for questions
  - `package.json` - Dependencies

### How to Run App
1. Open Command Prompt
2. Navigate: `cd C:\Users\Ben Jackson\Projects\11plus-prep`
3. Run: `npm start`
4. App opens at `http://localhost:3000`

### Question Data Structure (UPDATED)
Questions are stored directly in `App.js` in this format:

```javascript
const questionData = {
  maths: {
    name: "Maths",
    icon: Calculator,
    topics: {
      percentages: {
        name: "Percentages",
        questions: [
          {
            id: 1,
            question: "Question text?",
            image: "topic-name/diagram.svg", // OPTIONAL - omit if no image needed
            options: ["A", "B", "C", "D", "E"],
            correct: 0, // index 0-4
            explanation: "Child-friendly explanation with ✓"
          }
        ]
      }
    }
  },
  english: { /* similar structure */ },
  verbalreasoning: { /* similar structure */ }
}
```

---

## EXAM FORMAT - GL ASSESSMENT

### Maths Paper
- **Questions:** ~60 questions
- **Time:** 50 minutes (~50 seconds per question)
- **Format:** 5-option multiple choice (A-E)
- **Calculator:** NOT allowed
- **Key Challenge:** Year 6 content tested before it's taught in school
- **Visual Elements:** ~30-40% of questions include diagrams, charts, or visual aids

### English Paper
- **Questions:** 64 questions
- **Time:** 45 minutes
- **Format:** 5-option multiple choice (A-E)

### Verbal Reasoning Paper
- **Questions:** 80 questions
- **Time:** 50 minutes
- **Format:** 5-option multiple choice (A-E)

---

## GL ASSESSMENT CHARACTERISTICS

### Critical Facts
- **Number operations:** Weighted 5x heavier than other topics
- **Algebra:** Heavily featured (~40% of Maths questions)
- **BIDMAS:** Major struggle area - needs emphasis in questions
- **Multi-step problems:** Most questions require 2-3 operations
- **Real-world contexts:** Shopping, sports, recipes, temperature, travel, money
- **Time pressure:** Students must work quickly and accurately
- **Visual elements:** Charts, diagrams, shapes, grids frequently used

### Question Style
- **Concise wording:** 1-2 sentences typically
- **Strategic distractors:** Answer options include common mistakes
- **Progressive difficulty:** From straightforward to complex multi-step
- **Visual elements:** Diagrams, grids, shapes, charts, tables
- **Combination topics:** E.g., Algebra + geometry, fractions + percentages
- **Character names:** Questions use names (Emma, Jack, Sophie, etc.) for engagement

---

## MATHS TOPICS - PRIORITY ORDER

### ✅ PHASE 2 - HIGH PRIORITY (COMPLETED - 290 questions)
1. ✅ **Percentages** - 35 questions
2. ✅ **Decimals** - 35 questions
3. ✅ **Long Division** - 30 questions
4. ✅ **Ratio & Proportion** - 30 questions
5. ✅ **Fractions** - 35 questions
6. ✅ **Long Multiplication** - 25 questions
7. ✅ **Algebra** - 35 questions (heavily featured, ~40% of exam)
8. ✅ **Place Value and Rounding** - 25 questions (fundamental skill)
9. ✅ **Negative Numbers** - 20 questions (temperature, number lines)
10. ✅ **Prime Numbers and Factors** - 20 questions

**Status:** ALL HIGH PRIORITY TOPICS COMPLETE! 🎉

### ✅ PHASE 3 - MEDIUM PRIORITY (In Progress - 30 questions so far)
11. ✅ **Area and Perimeter** - 30 questions (18 with diagrams) - **COMPLETE!** 🎉
12. 🚧 **Volume** - 15-20 questions (will need 3D diagrams)
13. 🚧 **Angles and Shapes** - 20-25 questions (will need angle/shape diagrams)
14. 🚧 **Sequences** - 15-20 questions (minimal diagrams needed)

### 📋 PHASE 4 - LOWER PRIORITY (Build after Phase 3)
15. **Data and Averages** - 15-20 questions (charts/graphs needed)
16. **Probability** - 10-15 questions (spinners/diagrams needed)

**Total Current:** 320 Maths questions
**Total Target:** 390-425 Maths questions (comprehensive coverage)

---

## QUESTION GENERATION REQUIREMENTS

### Mandatory Quality Process (IMPLEMENTED)

**CRITICAL - ALWAYS FOLLOW THIS PROCESS:**

**Phase 1: Planning (5 minutes)**
- Review topic requirements
- Check past paper examples
- Plan difficulty distribution
- Identify which questions need diagrams

**Phase 2: Generation (15-20 minutes)**
- Create all questions following template
- Include character names and real-world contexts
- Use strategic distractors
- Write child-friendly explanations

**Phase 3: ERROR CHECKING (10 minutes) ⭐ MANDATORY**
- Verify EVERY calculation manually
- Check all answer indices (0-4)
- Test logic and method
- Document verification
- Fix ALL errors found
- User should NEVER receive questions with errors

**Phase 4: Diagram Creation (if needed)**
- Identify questions requiring diagrams
- Create batch script with all SVG code
- User runs script to generate files
- Verify diagrams display correctly

**Phase 5: Delivery**
- Create question file in .js format
- Present to user
- Provide brief summary

### Question Requirements

**Every Question Must Have:**
1. **Unique ID** (sequential within topic)
2. **Clear question text** with character names and real-world context
3. **Image reference** (optional - if diagram helps)
4. **5 plausible options** (A-E format)
5. **Correct answer index** (0-4)
6. **Child-friendly explanation** with:
   - Step-by-step working
   - Method explanation
   - ✓ confirmation mark
   - Encouraging tone

**Enhanced Content Style (Implemented January 19, 2026):**
- ✅ ALL questions use character names (Emma, Jake, Sophie, Tom, etc.)
- ✅ Real-world scenarios (not abstract calculations)
- ✅ Engaging contexts (shopping, games, sports, cooking, etc.)
- ✅ Story elements where appropriate

**Strategic Distractors Include:**
- Arithmetic errors
- Forgetting a step
- Using wrong operation
- BIDMAS violations
- Sign errors
- Unit conversion mistakes
- Stopping at intermediate answer

### Diagram Guidelines

**When to Include Diagrams:**
- Geometric shapes (rectangles, triangles, circles, etc.)
- Compound shapes (L-shapes, shapes with cutouts)
- Shapes with unknown dimensions
- Comparison of multiple shapes
- Grids and coordinates
- Charts and graphs
- Number lines
- Visual data representation

**Approximately 30-60% of questions in visual topics should have diagrams**

---

## WORKFLOW - ADDING TOPICS TO APP

### Standard Workflow (No Images)
1. **Generate questions** - Claude creates .js file with topic
2. **Download file** - User saves to computer
3. **Open App.js** in VS Code
4. **Find insertion point** - Locate end of previous topic
5. **Add comma** - After closing brace of previous topic
6. **Paste content** - Copy entire topic object from generated file
7. **Save** - Ctrl+S in VS Code
8. **Test** - App auto-reloads, check new topic appears

### Enhanced Workflow (With Images) - PROVEN METHOD
1. **Generate questions with image references** - Claude creates .js file
2. **Generate batch script** - Claude creates .bat file with all SVG code
3. **Download both files** - Save .js and .bat to computer
4. **Run batch script:**
   - Place .bat file in `C:\Users\Ben Jackson\Projects\11plus-prep\public\images\questions\`
   - Double-click the .bat file
   - All SVG files created automatically in correct folder structure
   - Press any key to close the window
5. **Add questions to App.js** - Same process as standard workflow
6. **Test** - Verify both questions and images display correctly

### File Structure After Adding Topics (Current)
```javascript
const questionData = {
  maths: {
    topics: {
      percentages: { /* 35 questions */ },
      decimals: { /* 35 questions */ },
      longdivision: { /* 30 questions */ },
      ratio: { /* 30 questions */ },
      fractions: { /* 35 questions */ },
      longmultiplication: { /* 25 questions */ },
      algebra: { /* 35 questions */ },
      placevalue: { /* 25 questions */ },
      negativenumbers: { /* 20 questions */ },
      primenumbers: { /* 20 questions */ },
      areaperimeter: { /* 30 questions */ }
    }
  }
}
```

---

## USER CONTEXT

### Personal Details
- **Parent:** Ben Jackson
- **Daughter:** Age 9 (Year 5)
- **Location:** Poole, England
- **Programming Experience:** Beginner (learning as building)
- **Schools:** Bournemouth Grammar & Parkstone Grammar (Dorset Consortium)
- **Exam Date:** September 26, 2026 (8 months away)

### Preferences & Feedback
- Hands-on approach to learning
- Appreciates step-by-step guidance
- Values understanding "why" not just "how"
- Building app personally rather than hiring developer
- Wants daughter to have quality exam prep resources
- Memory enabled in Claude.ai for continuity
- **User Feedback (January 19, 2026):** Daughter and wife wanted more real-world context and character names in questions
  - ✅ **Implemented:** All questions from Algebra onwards use rich character-driven scenarios
- **User Feedback (January 22, 2026):** Batch script method for SVG creation works very well
  - ✅ **Confirmed:** Will use this method for all future diagram-heavy topics

### Working Style
- Systematic and methodical
- Asks clarifying questions
- Tests features as they're built
- Prefers detailed explanations
- Values modern best practices
- Wants comprehensive documentation
- Catches errors and asks for verification (good quality control!)

---

## SUCCESS METRICS

### ✅ Short-term Goals (ACHIEVED!)
- ✅ 320 Maths questions completed (EXCEEDED target of 200-300)
- ✅ Error-checking process implemented
- ✅ All high-priority Maths topics complete
- ✅ Enhanced questions with character names and real-world contexts
- ✅ Image support fully working
- ✅ First diagram-heavy topic complete (Area & Perimeter)
- ✅ Efficient SVG creation method established

### 🎯 Current Priorities (Next Steps)
- 🎯 Complete remaining Phase 3 topics (Volume, Angles/Shapes, Sequences)
- 🎯 Continue using batch script method for diagram creation
- 🎯 Reach 390+ Maths questions (all 16 topics)
- 🎯 Test questions with daughter for feedback

### Medium-term Goals (Next 3-4 months)
- 🎯 Complete all 16 Maths topics (390-425 questions total)
- 🎯 Begin English question bank (100-150 questions)
- 🎯 Begin Verbal Reasoning question bank (100-150 questions)
- 🎯 Integrate AI Tutor feature
- 🎯 Add progress tracking

### Long-term Goals (By September 2026)
- 🎯 Comprehensive question bank (500+ total questions)
- 🎯 Mock exam functionality
- 🎯 Performance analytics
- 🎯 Daughter scoring well in practice tests
- 🎯 Confident exam readiness

---

## TROUBLESHOOTING

### Common Issues

**App won't start:**
- Check you're in correct directory: `C:\Users\Ben Jackson\Projects\11plus-prep`
- Try: `npm install` then `npm start`

**Questions not showing:**
- Check syntax in App.js (missing commas, brackets)
- Look for red errors in VS Code
- Check browser console (F12) for JavaScript errors

**VS Code not showing files:**
- Close and reopen VS Code
- Use File → Open Folder, select `11plus-prep`
- Right-click App.js in File Explorer → Open with Code

**Syntax errors after adding questions:**
- Check comma after previous topic's closing brace
- Ensure all braces match: `{ }` and brackets match: `[ ]`
- Look for missing commas between questions
- Check all strings have closing quotes
- Common issue: Too many or too few closing braces when adding new topics

**Images not displaying:**
- Check image file exists in correct folder
- Verify filename matches exactly (case-sensitive)
- Check image path in question object matches folder structure
- Look for console errors (F12)
- Verify SVG syntax is valid
- Ensure folder structure: `public/images/questions/topic-name/filename.svg`

**Batch script not creating files:**
- Make sure .bat file is in correct directory
- Check you have write permissions
- Try running as administrator (right-click → Run as administrator)
- Check Command Prompt window for error messages

---

## NOTES FOR FUTURE SESSIONS

### At Start of New Thread
1. Upload this Master Brief document (v3.2)
2. Upload Working Instructions document (v3.1)
3. Mention which topic or task you want to work on
4. Claude will read relevant SKILL.md files if needed

### When Generating Questions
- Always specify quantity (e.g., "30-35 questions")
- Mention if you want specific difficulty focus
- Reference past papers if needed for style matching
- **Specify if images are needed** for the topic
- **Estimate how many questions should have diagrams** (typically 30-60% for visual topics)

### When Creating Diagrams
- Use batch script method (proven successful)
- Claude creates .bat file with all SVG code
- User downloads and runs in correct directory
- All diagrams created automatically
- Simple and reliable process

### When Thread Approaches Limit
- Claude will alert at ~75-80% token usage
- Save all work immediately
- Download any generated question files
- Update Master Brief with latest progress
- Start new thread fresh

---

## VERSION HISTORY

**v1.0** - December 2025
- Initial brief created
- Project setup and research phase

**v2.0** - January 14, 2026
- Updated with 190 completed questions (6 topics)
- Added technical setup details
- Documented workflow and file structure
- Added troubleshooting section
- Comprehensive documentation for future sessions

**v3.0** - January 19, 2026
- **Major Update:** 290 questions completed (10 topics - ALL HIGH PRIORITY COMPLETE!)
- Implemented mandatory error-checking process
- Enhanced question style with character names and rich contexts
- **Identified image/diagram requirement** - paused generation until implemented
- Documented image support requirements and strategy
- Updated workflow for image-supported questions
- Flagged which topics require visual elements

**v3.1** - January 21, 2026
- **MAJOR UPDATE:** Image support successfully implemented and tested!
- Modified App.js to display SVG diagrams
- Created folder structure for question images
- Generated 5 SVG example diagrams
- Test question working with rectangle diagram
- App now ready to generate questions with visual elements
- Ready to proceed with Phase 3 topics

**v3.2** - January 22, 2026
- **MAJOR UPDATE:** First Phase 3 topic complete!
- Area & Perimeter: 30 questions with 18 diagrams added
- **Discovered efficient SVG creation method:** Batch script (.bat file)
- Total questions now: 320 Maths questions across 11 topics
- Documented batch script workflow
- Confirmed method works well for future diagram-heavy topics
- Updated all progress metrics
- Phase 3 officially started

---

## APPENDICES

### A. Key File Locations
- App folder: `C:\Users\Ben Jackson\Projects\11plus-prep`
- Main app file: `src/App.js`
- Questions: Stored in `App.js` within `questionData` object
- Images: `public/images/questions/[topic-name]/`

### B. Useful Commands
- Start app: `npm start`
- Stop app: `Ctrl+C` in Command Prompt
- Open Command Prompt in folder: Click address bar → type `cmd` → Enter

### C. VS Code Tips
- Find: `Ctrl+F`
- Save: `Ctrl+S`
- Go to line: `Ctrl+G`
- Open file: Right-click → Open with Code

### D. Topics Status Overview

**✅ PHASE 2 COMPLETE (290 questions):**
1. Percentages (35)
2. Decimals (35)
3. Long Division (30)
4. Ratio & Proportion (30)
5. Fractions (35)
6. Long Multiplication (25)
7. Algebra (35)
8. Place Value & Rounding (25)
9. Negative Numbers (20)
10. Prime Numbers & Factors (20)

**✅ PHASE 3 IN PROGRESS (30 questions):**
11. ✅ Area and Perimeter (30 questions, 18 diagrams) - **COMPLETE!**

**🚧 PHASE 3 REMAINING:**
12. Volume (15-20)
13. Angles and Shapes (20-25)
14. Sequences (15-20)

**📋 PHASE 4 (Later):**
15. Data and Averages (15-20)
16. Probability (10-15)

**Current Total:** 320 questions
**Target Total:** 390-425 questions

### E. Contact Information
- Project owner: Ben Jackson
- Location: Poole, England
- App location: `C:\Users\Ben Jackson\Projects\11plus-prep`

---

*Document maintained by Claude in collaboration with Ben Jackson*
*For use in Claude.ai threads to provide comprehensive project context*
*Version 3.2 - Updated with Area & Perimeter complete and batch script method documented*

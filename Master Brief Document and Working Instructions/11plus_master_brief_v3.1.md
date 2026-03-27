# 11+ EXAM PREP APP - MASTER BRIEF v3.1
**Project Owner:** Ben Jackson, building app for 9-year-old daughter
**Exam Date:** September 26, 2026
**Target Schools:** Bournemouth Grammar School & Parkstone Grammar School (Dorset Consortium)
**App Location:** `C:\Users\Ben Jackson\Projects\11plus-prep`
**Last Updated:** January 21, 2026

---

## EXECUTIVE SUMMARY

Building a React-based 11+ exam prep app with a comprehensive question bank covering Maths, English, and Verbal Reasoning. Currently focused on building high-quality Maths questions that match GL Assessment difficulty and style.

**Current Status:**
- ✅ App infrastructure: Working React app running locally via VS Code
- ✅ Question bank: **290 Maths questions across 10 topics** (ALL HIGH PRIORITY COMPLETE!)
- ✅ Quality assurance: Error-checking process implemented and verified
- ✅ **IMAGE SUPPORT: Successfully implemented and tested!** (January 21, 2026)
- 🎯 **READY:** Can now generate questions with diagrams/images
- 🎯 Next: Continue with Phase 3 - Medium Priority topics (Area/Perimeter, etc.)
- 📅 Timeline: 8 months until exam (September 26, 2026)

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

**Test Question Added:**
- Question 36 in Percentages demonstrates image support
- Shows rectangle with 8cm × 5cm measurements
- Image displays correctly in app

### How It Works Now

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

**2. File Organization (✅ COMPLETE)**
```
public/
  images/
    questions/
      example_svg_1_rectangle.svg  ← Test image working!
      [future topic folders will go here]
      area-perimeter/
      angles-shapes/
      data-averages/
      etc...
```

**3. Image Generation Strategy (✅ PROVEN)**
- **SVG format** - Successfully tested and working!
- Claude generates SVG code programmatically
- **Working examples created:**
  - Simple geometric shapes with measurements ✅
  - Bar charts and graphs
  - Coordinate grids
  - Number lines
  - Shape comparisons
- Scalable, crisp, small file size
- No manual image creation needed (critical for 1000s of questions)

**4. App Code Changes (✅ COMPLETE)**
- Modified App.js around line 2710
- Added image display component
- Checks for optional image field
- Displays centered, responsive image when present
- Maintains backward compatibility (works without images)
- **Status:** Working perfectly!

### SVG Examples Created

Five example SVG diagrams created and tested:
1. **Rectangle with measurements** (8cm × 5cm) - TESTED IN APP ✅
2. **Bar chart** (Favorite Fruits data)
3. **Number line** (-5 to 5)
4. **Coordinate grid** (with plotted points)
5. **Shape comparison** (4 shapes with measurements)

All examples use:
- Clean, professional styling
- Neutral colors (easily updated later)
- Standard Arial font
- Clear dimension labels
- Scalable SVG format

### Next Steps (Ready to Execute)
1. ✅ Image support working - COMPLETE
2. Generate Area & Perimeter questions with diagrams
3. Generate other Medium Priority topics with images as needed
4. Optionally enhance existing 290 questions with images where beneficial

---

## TECHNICAL SETUP

### App Structure
- **Framework:** React app (Create React App)
- **Location:** `C:\Users\Ben Jackson\Projects\11plus-prep`
- **Key files:**
  - `src/App.js` - Main app file containing question data and UI logic
  - `src/App.css` - Styling
  - `public/index.html` - HTML template
  - `public/images/questions/` - Images for questions (TO BE CREATED)
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

### 🚧 PHASE 3 - MEDIUM PRIORITY (Next to build - AFTER image support added)
11. **Area and Perimeter** - 25-30 questions (including algebraic expressions) ⚠️ NEEDS DIAGRAMS
12. **Volume** - 15-20 questions (basic 3D shapes) ⚠️ NEEDS DIAGRAMS
13. **Angles and Shapes** - 20-25 questions (properties, classification) ⚠️ NEEDS DIAGRAMS
14. **Sequences** - 15-20 questions (number patterns)

### 📋 PHASE 4 - LOWER PRIORITY (Build after Phase 3)
15. **Data and Averages** - 15-20 questions (mean, median, mode, charts) ⚠️ NEEDS CHARTS
16. **Probability** - 10-15 questions (simple probability) ⚠️ NEEDS SPINNERS/DIAGRAMS

**Total Target:** 390-425 Maths questions (comprehensive coverage)

---

## QUESTION GENERATION REQUIREMENTS

### Mandatory Quality Process (IMPLEMENTED)

**Before presenting any questions to user:**
1. Generate all questions for topic
2. **VERIFY EVERY ANSWER** - check all calculations, indices, logic
3. Fix any errors found
4. Create final file
5. Present to user error-free

**This process catches errors before user sees them!**

### Content Style Requirements (UPDATED - January 19, 2026)

**CRITICAL:** All questions must include:
- **Character names** (Emma, Jake, Sophie, Tom, Ben, Lucy, etc.)
- **Real-world scenarios** (not just pure maths)
- **Engaging contexts** (gardens, games, shopping, sports, cooking, etc.)
- **Story elements** where appropriate

**Example:**
- ❌ BAD: "What is 25% of £200?"
- ✅ GOOD: "Sophie is saving for a new bike that costs £200. She has saved 25% so far. How much has she saved?"

### Difficulty Progression (Apply to ALL topics)
Every topic should include three difficulty levels:
- **Level 1 (Basic):** ~30% of questions - straightforward, single-step
- **Level 2 (Intermediate):** ~40% of questions - word problems, 2-step
- **Level 3 (Advanced):** ~30% of questions - complex, multi-step, combination topics

### For Each Question Must Include
1. **5 answer options** in A-E format
2. **Strategic distractors** (common mistakes students make)
3. **Appropriate difficulty** for Year 5/6 level
4. **Child-friendly explanation** suitable for 9-year-old
5. **Real-world context with character names**
6. **Correct answer index** (0-4)
7. **Image field** (when visual element needed) - SVG filename

### Explanation Style Guidelines
- Use encouraging, friendly language
- Break down steps clearly
- Use checkmarks (✓) to confirm answers
- Explain WHY the method works
- Keep language at 9-year-old reading level
- Include reminders about important concepts (BIDMAS, units, etc.)
- Never just state the answer - show the working

### Answer Options Guidelines
- Include strategic distractors based on common errors:
  - Arithmetic mistakes (e.g., 7+8=14 instead of 15)
  - Sign errors (positive instead of negative)
  - Unit conversion errors
  - Partial answers (forgot a step)
  - BIDMAS mistakes (wrong order of operations)
- Make all options plausible
- Vary the position of correct answers (don't always put answer in position 2)
- Numbers should be realistic for the context

---

## COMPLETED WORK SUMMARY

### ✅ Questions Generated (290 total - ALL VERIFIED ERROR-FREE)

**Phase 2 - High Priority Topics:**

**1. Percentages (35 questions)**
- Basic % calculations (10%, 25%, 50%, 75%)
- Finding % of amounts
- Sale prices & discounts (single and double)
- Reverse percentages
- Part-whole relationships
- Comparing fractions/decimals/percentages
- Character names used throughout

**2. Decimals (35 questions)**
- Ordering and comparing
- Operations: +, -, ×, ÷
- Converting to/from fractions and percentages
- Real-world applications (money, measurements)
- Rounding
- Place value

**3. Long Division (30 questions)**
- 2-digit divisors (12-56)
- Division with remainders
- Word problems (coaches, seeds, boxes, etc.)
- Real-world contexts
- Number range: 144 ÷ 12 up to 2,016 ÷ 56

**4. Ratio & Proportion (30 questions)**
- Simple ratios - sharing
- Scaling recipes and proportions
- Map scales and models
- Unit conversions
- Multi-step problems
- Real-world contexts (cooking, money, measurements)

**5. Fractions (35 questions)**
- Basic operations (+, -, ×)
- Equivalent fractions
- Simplifying
- Comparing and ordering
- Finding fractions of amounts
- Converting to decimals/percentages
- Word problems with characters

**6. Long Multiplication (25 questions)**
- 2-digit × 2-digit
- 3-digit × 2-digit
- Real-world problems (money, production, distances)
- Range: 23 × 14 up to 408 × 37

**7. Algebra (35 questions)** ⭐ Enhanced with rich contexts
- Simple equations and solving
- Substitution
- Forming expressions from words
- Function machines
- Multi-step problems
- Real-world scenarios (ages, money, collections, games, sports)
- Heavy use of character names (Emma, Tom, Jack, Sophie, etc.)

**8. Place Value & Rounding (25 questions)**
- Reading/writing large numbers
- Understanding place value (thousands, hundreds, tens, ones)
- Rounding to 10, 100, 1000
- Comparing and ordering
- Real-world contexts (populations, prices, distances)

**9. Negative Numbers (20 questions)**
- Understanding negatives on number lines
- Temperature problems (below zero)
- Ordering negative numbers
- Adding/subtracting with negatives
- Real-world contexts (temperature, bank balances, floors, sea level)

**10. Prime Numbers & Factors (20 questions)**
- Identifying primes
- Finding factors
- Prime factorization
- HCF (Highest Common Factor)
- LCM (Lowest Common Multiple)
- Real-world problem-solving (arranging items, timing problems)

### Quality Standards Achieved
- ✅ All questions 100% original (not copied)
- ✅ GL Assessment difficulty level matched
- ✅ Three-tier difficulty progression in each topic
- ✅ Child-friendly explanations
- ✅ Strategic distractors in answer options
- ✅ Real-world contexts with character names
- ✅ No calculator required for any question
- ✅ Time-conscious (solvable in ~50 seconds)
- ✅ **Error-checking process implemented** - all answers verified before delivery
- ✅ **Enhanced engagement** - rich character-driven scenarios

### Topics Requiring Images (To be enhanced after image support added)
- **Negative Numbers** - could benefit from number line diagrams (~5-10 questions)
- **Prime Numbers & Factors** - some questions could use factor trees or Venn diagrams (~3-5 questions)
- **Future topics (REQUIRE images):**
  - Area and Perimeter (essential)
  - Volume (essential)
  - Angles and Shapes (essential)
  - Data and Averages (essential)
  - Probability (essential)

---

## COPYRIGHT COMPLIANCE

**CRITICAL:** We have 200+ example questions from past papers in reference files.

**Rules:**
- ✅ USE examples as style/difficulty guides ONLY
- ✅ Match patterns, contexts, and difficulty levels
- ❌ NEVER copy questions verbatim
- ✅ Generate 100% original questions
- ✅ Similar contexts are fine (e.g., both use "cinema tickets")
- ❌ Identical wording or numbers is NOT fine

---

## REFERENCE MATERIALS

### Available Files
1. **`Merged_Maths_Tests.xlsx`** - 200 past paper questions organized by topic
   - Use as difficulty/style reference
   - Note question types and contexts
   - Never copy directly
   - **Note:** Text-only version (no diagrams included in spreadsheet)

2. **`Grammar_School_11__Exam_Topics___Maths__English___Verbal_Reasoning.docx`**
   - Overview of all exam topics
   - Example questions for each area
   - General guidance on exam format

3. **Practice Paper Photos** (uploaded January 19, 2026)
   - Example questions showing visual elements
   - Bar charts (Q2 - eye colour data)
   - Geometric shapes (Q3 - quadrilaterals, Q25 - angles, Q27 - perimeter)
   - Tables (Q4 - medals data)
   - Clock faces (Q33 - time comparison)
   - Coordinate grids (Q34 - plotting points)
   - Spinners (Q28 - probability)

### Topic Analysis from Past Papers
- **Percentages:** Finding %, discounts, reverse %, comparing with fractions/decimals
- **Decimals:** Ordering, calculations, conversions, place value, rounding
- **Division:** 2-digit divisors, remainders, grouping/sharing problems
- **Ratio:** Sharing in ratios, scaling recipes, maps, unit conversions
- **Fractions:** Operations, equivalence, comparing, finding fractions of amounts
- **Multiplication:** 2-digit × 2-digit, 3-digit × 2-digit, real-world contexts
- **Algebra:** Equations, substitution, forming expressions, function machines
- **Place Value:** Large numbers, rounding, comparing
- **Negatives:** Temperature, number lines, addition/subtraction
- **Primes/Factors:** Identification, HCF, LCM, problem-solving

---

## FUTURE FEATURES

### AI Tutor (Currently Disabled)
**Purpose:** Help explain questions when child doesn't understand
**Status:** Was working in original app, disabled when moved to local development
**Plan:** Re-enable using open-source model (Llama 3.1, Mistral, or Gemma)
**Note:** Question bank is separate from AI Tutor - building questions now doesn't affect future AI Tutor integration

### Additional Features Planned
- Progress tracking
- Topic mastery indicators
- Timed practice mode
- Mock exams
- Performance analytics
- **Image/diagram support** (IMMEDIATE PRIORITY)

---

## WORKFLOW FOR ADDING QUESTIONS

### Step-by-Step Process (Current - Text Only)
1. **Generate questions** - Claude creates 20-35 questions per topic
2. **Verify answers** - Claude checks every calculation before presenting
3. **Download file** - Save the generated .js file locally
4. **Open App.js** in VS Code
5. **Find insertion point** - Locate end of previous topic
6. **Add comma** - After closing brace of previous topic
7. **Paste content** - Copy entire topic object from generated file
8. **Save** - Ctrl+S in VS Code
9. **Test** - App auto-reloads, check new topic appears

### Enhanced Workflow (After Image Support Added)
1. **Generate questions with SVG images** - Claude creates questions AND SVG diagrams
2. **Verify answers and images** - Check calculations and visual accuracy
3. **Save SVG files** - Store in appropriate folder under `public/images/questions/`
4. **Download question file** - Save .js file with image references
5. **Add to App.js** - Same process as above
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
      primenumbers: { /* 20 questions */ }
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
- ✅ 290 Maths questions completed (EXCEEDED target of 200-300)
- ✅ Error-checking process implemented
- ✅ All high-priority Maths topics complete
- ✅ Enhanced questions with character names and real-world contexts

### 🎯 Current Priorities (Next Steps)
- 🚧 Add image/diagram support to React app
- 🎯 Test image rendering with sample SVGs
- 🎯 Resume with Phase 3 topics (Area/Perimeter, Volume, Angles/Shapes, Sequences)
- 🎯 Enhance existing questions with images where beneficial

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

**Images not displaying (after image support added):**
- Check image file exists in correct folder
- Verify filename matches exactly (case-sensitive)
- Check image path in question object
- Look for console errors (F12)
- Verify SVG syntax is valid

---

## NOTES FOR FUTURE SESSIONS

### At Start of New Thread
1. Upload this Master Brief document (v3.0)
2. Upload Working Instructions document
3. Mention which topic or task you want to work on
4. Claude will read relevant SKILL.md files if needed

### When Generating Questions
- Always specify quantity (e.g., "30-35 questions")
- Mention if you want specific difficulty focus
- Reference past papers if needed for style matching
- **NEW:** Specify if images are needed for the topic

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

**v3.1** - January 21, 2026
- **MAJOR UPDATE:** Image support successfully implemented and tested!
- Modified App.js to display SVG diagrams
- Created folder structure for question images
- Generated 5 SVG example diagrams
- Test question (Percentages Q36) working with rectangle diagram
- App now ready to generate questions with visual elements
- Updated status: Ready to proceed with Phase 3 topics

**v3.0** - January 19, 2026
- **Major Update:** 290 questions completed (10 topics - ALL HIGH PRIORITY COMPLETE!)
- Implemented mandatory error-checking process
- Enhanced question style with character names and rich contexts
- **Identified image/diagram requirement** - paused generation until implemented
- Documented image support requirements and strategy
- Updated workflow for image-supported questions
- Flagged which topics require visual elements
- Added practice paper photo examples to references

---

## APPENDICES

### A. Key File Locations
- App folder: `C:\Users\Ben Jackson\Projects\11plus-prep`
- Main app file: `src/App.js`
- Questions: Stored in `App.js` within `questionData` object
- Images (to be created): `public/images/questions/[topic-name]/`

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

**✅ COMPLETE (290 questions):**
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

**🚧 NEXT (After image support):**
11. Area and Perimeter (25-30)
12. Volume (15-20)
13. Angles and Shapes (20-25)
14. Sequences (15-20)

**📋 LATER:**
15. Data and Averages (15-20)
16. Probability (10-15)

### E. Contact Information
- Project owner: Ben Jackson
- Location: Poole, England
- App location: `C:\Users\Ben Jackson\Projects\11plus-prep`

---

*Document maintained by Claude in collaboration with Ben Jackson*
*For use in Claude.ai threads to provide comprehensive project context*
*Version 3.0 - Comprehensive update reflecting 290 questions completed and image support requirement*

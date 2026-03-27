# 11+ EXAM PREP APP - MASTER BRIEF v2.0
**Project Owner:** Ben Jackson, building app for 9-year-old daughter
**Exam Date:** September 26, 2026
**Target Schools:** Bournemouth Grammar School & Parkstone Grammar School (Dorset Consortium)
**App Location:** `C:\Users\Ben Jackson\Projects\11plus-prep`
**Last Updated:** January 14, 2026

---

## EXECUTIVE SUMMARY

Building a React-based 11+ exam prep app with a comprehensive question bank covering Maths, English, and Verbal Reasoning. Currently focused on building high-quality Maths questions that match GL Assessment difficulty and style.

**Current Status:**
- ✅ App infrastructure: Working React app running locally via VS Code
- ✅ Question bank: 190 Maths questions across 6 topics
- 🎯 Target: 200-300 Maths questions, then English and Verbal Reasoning
- 📅 Timeline: 8+ months until exam (good prep time)

---

## TECHNICAL SETUP

### App Structure
- **Framework:** React app (Create React App)
- **Location:** `C:\Users\Ben Jackson\Projects\11plus-prep`
- **Key files:**
  - `src/App.js` - Main app file containing question data and UI logic
  - `src/App.css` - Styling
  - `public/index.html` - HTML template
  - `package.json` - Dependencies

### How to Run App
1. Open Command Prompt
2. Navigate: `cd C:\Users\Ben Jackson\Projects\11plus-prep`
3. Run: `npm start`
4. App opens at `http://localhost:3000`

### Question Data Structure
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

### Question Style
- **Concise wording:** 1-2 sentences typically
- **Strategic distractors:** Answer options include common mistakes
- **Progressive difficulty:** From straightforward to complex multi-step
- **Visual elements:** Some questions include diagrams, grids, shapes
- **Combination topics:** E.g., Algebra + geometry, fractions + percentages

---

## MATHS TOPICS - PRIORITY ORDER

### Phase 1 (COMPLETED - 190 questions)
1. ✅ **Percentages** - 35 questions
2. ✅ **Decimals** - 35 questions
3. ✅ **Long Division** - 30 questions
4. ✅ **Ratio & Proportion** - 30 questions
5. ✅ **Fractions** - 35 questions
6. ✅ **Long Multiplication** - 25 questions

### Phase 2 (HIGH PRIORITY - Next to build)
7. **Algebra** - 30-35 questions (heavily featured, ~40% of exam)
8. **Place Value and Rounding** - 20-25 questions (fundamental skill)
9. **Negative Numbers** - 15-20 questions (temperature, number lines)
10. **Prime Numbers and Factors** - 15-20 questions

### Phase 3 (MEDIUM PRIORITY)
11. **Area and Perimeter** - 25-30 questions (including algebraic expressions)
12. **Volume** - 15-20 questions (basic 3D shapes)
13. **Angles and Shapes** - 20-25 questions (properties, classification)
14. **Sequences** - 15-20 questions (number patterns)

### Phase 4 (LOWER PRIORITY - Less frequent)
15. **Data and Averages** - 15-20 questions (mean, median, mode, charts)
16. **Probability** - 10-15 questions (simple probability)

**Total Target:** 250-300 Maths questions

---

## QUESTION GENERATION REQUIREMENTS

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
5. **Real-world context** where appropriate
6. **Correct answer index** (0-4)

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

2. **`Grammar_School_11__Exam_Topics___Maths__English___Verbal_Reasoning.docx`**
   - Overview of all exam topics
   - Example questions for each area
   - General guidance on exam format

### Topic Analysis from Past Papers
- **Percentages:** Finding %, discounts, reverse %, comparing with fractions/decimals
- **Decimals:** Ordering, calculations, conversions, place value, rounding
- **Division:** 2-digit divisors, remainders, grouping/sharing problems
- **Ratio:** Sharing in ratios, scaling recipes, maps, unit conversions
- **Fractions:** Operations, equivalence, comparing, finding fractions of amounts
- **Multiplication:** 2-digit × 2-digit, 3-digit × 2-digit, real-world contexts

---

## COMPLETED WORK SUMMARY

### Questions Generated (190 total)

**Percentages (35 questions)**
- Basic % calculations (10%, 25%, 50%, 75%)
- Finding % of amounts
- Sale prices & discounts (single and double)
- Reverse percentages
- Part-whole relationships
- Comparing fractions/decimals/percentages

**Decimals (35 questions)**
- Ordering and comparing
- Operations: +, -, ×, ÷
- Converting to/from fractions and percentages
- Real-world applications (money, measurements)
- Rounding
- Place value

**Long Division (30 questions)**
- 2-digit divisors (12-56)
- Division with remainders
- Word problems (coaches, seeds, boxes, etc.)
- Real-world contexts
- Number range: 144 ÷ 12 up to 2,016 ÷ 56

**Ratio & Proportion (30 questions)**
- Simple ratios - sharing
- Scaling recipes and proportions
- Map scales and models
- Unit conversions
- Multi-step problems
- Real-world contexts (cooking, money, measurements)

**Fractions (35 questions)**
- Basic operations (+, -, ×)
- Equivalent fractions
- Simplifying
- Comparing and ordering
- Finding fractions of amounts
- Converting to decimals/percentages
- Word problems

**Long Multiplication (25 questions)**
- 2-digit × 2-digit
- 3-digit × 2-digit
- Real-world problems (money, production, distances)
- Range: 23 × 14 up to 408 × 37

### Quality Standards Achieved
- ✅ All questions original (not copied)
- ✅ GL Assessment difficulty level matched
- ✅ Three-tier difficulty progression in each topic
- ✅ Child-friendly explanations
- ✅ Strategic distractors in answer options
- ✅ Real-world contexts used appropriately
- ✅ No calculator required for any question
- ✅ Time-conscious (solvable in ~50 seconds)

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

---

## WORKFLOW FOR ADDING QUESTIONS

### Step-by-Step Process
1. **Generate questions** - Claude creates 25-35 questions per topic
2. **Download file** - Save the generated .js file locally
3. **Open App.js** in VS Code
4. **Find insertion point** - Locate end of previous topic
5. **Add comma** - After closing brace of previous topic
6. **Paste content** - Copy entire topic object from generated file
7. **Save** - Ctrl+S in VS Code
8. **Test** - App auto-reloads, check new topic appears

### File Structure After Adding Topic
```javascript
const questionData = {
  maths: {
    topics: {
      percentages: { /* 35 questions */ },
      decimals: { /* 35 questions */ },
      longdivision: { /* 30 questions */ },
      ratio: { /* 30 questions */ },
      fractions: { /* 35 questions */ },
      longmultiplication: { /* 25 questions */ }
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
- **Exam Date:** September 26, 2026 (8+ months away)

### Preferences
- Hands-on approach to learning
- Appreciates step-by-step guidance
- Values understanding "why" not just "how"
- Building app personally rather than hiring developer
- Wants daughter to have quality exam prep resources
- Memory enabled in Claude.ai for continuity

### Working Style
- Systematic and methodical
- Asks clarifying questions
- Tests features as they're built
- Prefers detailed explanations
- Values modern best practices
- Wants comprehensive documentation

---

## SUCCESS METRICS

### Short-term Goals (Current Phase)
- ✅ 190 Maths questions completed
- 🎯 250-300 Maths questions total
- 🎯 Test questions with daughter for difficulty validation
- 🎯 Complete all high-priority Maths topics

### Medium-term Goals (Next 3-4 months)
- 🎯 Complete all 16 Maths topics
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

---

## NOTES FOR FUTURE SESSIONS

### At Start of New Thread
1. Upload this Master Brief document
2. Upload Working Instructions document
3. Mention which topic you want to work on
4. Claude will read relevant SKILL.md files if needed

### When Generating Questions
- Always specify quantity (e.g., "30-35 questions")
- Mention if you want specific difficulty focus
- Reference past papers if needed for style matching

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
- Updated with 190 completed questions
- Added technical setup details
- Documented workflow and file structure
- Added troubleshooting section
- Comprehensive documentation for future sessions

---

## APPENDICES

### A. Key File Locations
- App folder: `C:\Users\Ben Jackson\Projects\11plus-prep`
- Main app file: `src/App.js`
- Questions: Stored in `App.js` within `questionData` object

### B. Useful Commands
- Start app: `npm start`
- Stop app: `Ctrl+C` in Command Prompt
- Open Command Prompt in folder: Click address bar → type `cmd` → Enter

### C. VS Code Tips
- Find: `Ctrl+F`
- Save: `Ctrl+S`
- Go to line: `Ctrl+G`
- Open file: Right-click → Open with Code

### D. Contact Information
- Project owner: Ben Jackson
- Location: Poole, England
- App location: `C:\Users\Ben Jackson\Projects\11plus-prep`

---

*Document maintained by Claude in collaboration with Ben Jackson*
*For use in Claude.ai threads to provide comprehensive project context*

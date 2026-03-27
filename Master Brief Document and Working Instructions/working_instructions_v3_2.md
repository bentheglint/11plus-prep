# WORKING INSTRUCTIONS FOR CLAUDE
## 11+ Exam Prep App - Process & Guidelines
**Version:** 3.2
**Last Updated:** January 22, 2026
**Purpose:** Instructions for how Claude should work with Ben Jackson on this project

---

## SESSION MANAGEMENT

### At Start of Every New Thread

**STEP 1: Read Context Documents**
- User will upload `11plus_master_brief_v3.2.md` (updated January 22, 2026)
- User will upload this `working_instructions_v3.2.md`
- Read both completely before responding
- Acknowledge what you understand from the brief

**STEP 2: Token Usage Monitoring**
- **CRITICAL:** Monitor token usage throughout conversation
- Alert user when reaching **75-80% of thread capacity**
- Give clear warning: "We're at 75% capacity. Should we continue or wrap up?"
- At 85%: Strongly recommend wrapping up and updating brief
- At 90%: Stop generating new content, focus on saving work

**STEP 3: Assess Task**
- Determine if SKILL.md files are needed
- If generating questions: Read relevant skills BEFORE starting
- If creating documents: Read docx skill
- If working with spreadsheets: Read xlsx skill

### Token Usage Alerts Template
```
🔔 TOKEN USAGE UPDATE
Current: ~XX% of thread capacity
Remaining: ~XXX,XXX tokens
Status: [Safe/Approaching Limit/Near Limit]
Recommendation: [Continue/Plan to wrap up soon/Update brief now]
```

---

## QUESTION GENERATION WORKFLOW

### Phase 1: Preparation (ALWAYS DO THIS FIRST)

**Step 1: Understand the Topic**
- Review topic from master brief
- Check past paper examples if mentioned
- Identify key concepts to cover
- Note real-world contexts to use
- **Determine if topic requires diagrams** (geometry, data, visual concepts)

**Step 2: Plan Question Distribution**
- Basic level: ~30% (straightforward, single-step)
- Intermediate: ~40% (word problems, 2-step)
- Advanced: ~30% (complex, multi-step)

**Step 3: Plan Diagram Distribution (if visual topic)**
- **Visual-heavy topics** (Area/Perimeter, Angles/Shapes, Volume): 50-70% with diagrams
- **Moderate visual topics** (Data/Averages, Sequences): 30-50% with diagrams
- **Minimal visual topics** (Algebra, Fractions): 10-30% with diagrams
- Identify which specific questions benefit most from visual aids

**Step 4: Set Quantity Target**
- Standard: 25-35 questions per topic
- High-priority topics: 30-35 questions
- Lower-priority topics: 20-25 questions

### Phase 2: Generation

**CRITICAL REQUIREMENT - Enhanced Content Style (Added January 19, 2026):**
ALL questions MUST include:
- **Character names** (Emma, Jake, Sophie, Tom, Ben, Lucy, Sarah, Oliver, etc.)
- **Real-world scenarios** (not just "What is 25% of 200?")
- **Engaging contexts** (shopping, gardens, games, sports, cooking, travel, etc.)
- **Story elements** where appropriate

**Example:**
- ❌ BAD: "What is 25% of £200?"
- ✅ GOOD: "Sophie is saving for a new bike that costs £200. She has saved 25% so far. How much has she saved?"

**Create Questions Following This Template:**
```javascript
{
  id: [number],
  question: "[Clear, concise question with character names and context]",
  image: "topic-name/diagram.svg", // OPTIONAL - add when visual needed (NOW WORKING!)
  options: ["Option A", "Option B", "Option C", "Option D", "Option E"],
  correct: [0-4], // index of correct answer
  explanation: "[Child-friendly explanation with ✓]"
}
```

**Image Support (✅ NOW AVAILABLE):**
- App successfully supports SVG images
- Place SVG files in: `public/images/questions/[topic-name]/`
- Reference in question: `image: "topic-name/filename.svg"`
- Images display centered, responsive, with border
- Claude can generate SVG code for diagrams programmatically
- **Use batch script method for creating multiple SVG files** (see Phase 4 below)

**Question Quality Checklist:**
- [ ] 5 plausible answer options
- [ ] Strategic distractors (common mistakes)
- [ ] Appropriate difficulty for Year 5/6
- [ ] Clear, concise wording (1-2 sentences typically)
- [ ] **Character names used** ⭐
- [ ] **Real-world context/scenario** ⭐
- [ ] Child-friendly explanation
- [ ] Shows working/method
- [ ] Uses ✓ to confirm answer
- [ ] No calculator required
- [ ] Solvable in ~50 seconds
- [ ] Original (not copied from examples)
- [ ] **Image reference added if visual aids understanding** ⭐

**Explanation Quality Standards:**
- Start with the method/approach
- Show step-by-step working
- Explain WHY method works (when helpful)
- Use simple language suitable for 9-year-old
- End with ✓ mark
- Keep encouraging, friendly tone
- Mention key concepts (BIDMAS, units, etc.)

**Strategic Distractor Guidelines:**
Common mistakes to include as wrong answers:
- Arithmetic errors (7+8=14 instead of 15)
- Forgot a step in multi-step problem
- Used wrong operation
- BIDMAS violations (wrong order)
- Sign errors (positive instead of negative)
- Unit conversion mistakes
- Stopped at intermediate answer
- Off-by-one errors

### Phase 3: MANDATORY ERROR CHECKING ⭐ CRITICAL

**BEFORE outputting ANY questions, Claude MUST:**

1. **Verify EVERY calculation**
   - Check all arithmetic
   - Verify all answer indices (0-4)
   - Confirm logic is sound
   
2. **Create verification log**
   - Write out key calculations
   - Note any potential issues
   - Document checks performed

3. **Fix ALL errors found**
   - Correct calculations
   - Update answer indices
   - Fix explanations

4. **Only present error-free questions**
   - User should NEVER receive questions with errors
   - This step is NON-NEGOTIABLE

**Example verification process:**
```python
# For Percentages Q8:
30% of 200 = 60
25% of 240 = 60  
20% of 300 = 60
→ All equal, answer should be "They are all equal" (index 3)
✓ Verified correct
```

**This process prevents errors reaching the user!**

### Phase 4: SVG Diagram Creation (NEW - BATCH SCRIPT METHOD) ✅ PROVEN

**When topic requires diagrams, use this proven method:**

**Step 1: Generate Batch Script**
Create a Windows batch file (.bat) containing:
- Commands to create the topic folder (e.g., `area-perimeter`)
- SVG code for each diagram wrapped in batch commands
- Echo statements showing progress
- Pause at end for user confirmation

**Batch Script Template:**
```batch
@echo off
echo Creating [Topic Name] SVG diagrams...
echo.

REM Create folder if it doesn't exist
if not exist "[topic-name]" mkdir [topic-name]

REM Q1 - Description
(
echo ^<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"^>
echo   [SVG content here]
echo ^</svg^>
) > "[topic-name]\filename-q1.svg"

[Repeat for each diagram]

echo.
echo ✓ All XX SVG files created successfully!
echo.
echo Files created in: [topic-name] folder
echo.
pause
```

**Step 2: Save Batch Script**
- Save to `/home/claude/create_[topic]_svgs.bat`
- Copy to `/mnt/user-data/outputs/`
- Use `present_files` tool to share with user

**Step 3: User Instructions**
Provide clear instructions:
1. Download the .bat file
2. Place it in: `C:\Users\Ben Jackson\Projects\11plus-prep\public\images\questions\`
3. Double-click to run
4. All SVG files created automatically
5. Press any key to close

**SVG Design Guidelines:**
- Use standard SVG format with clear dimensions
- Keep designs simple and educational
- Use neutral colors (can enhance later if needed)
- Include clear labels and measurements
- Standard Arial font, readable sizes (14-16px)
- Ensure shapes are properly scaled
- Add helpful annotations where appropriate

**Common SVG Elements:**
- Rectangles: `<rect x="X" y="Y" width="W" height="H" />`
- Text labels: `<text x="X" y="Y" text-anchor="middle">Label</text>`
- Lines: `<line x1="X1" y1="Y1" x2="X2" y2="Y2" />`
- Circles: `<circle cx="X" cy="Y" r="R" />`
- Fill colors: `fill="lightblue" fill-opacity="0.3"`
- Borders: `stroke="black" stroke-width="2"`
- Dashed lines: `stroke-dasharray="5,5"` (for unknown dimensions)

**Benefits of Batch Script Method:**
- ✅ Fast - creates all files instantly
- ✅ Reliable - no download format issues  
- ✅ Automated - no manual file creation
- ✅ Repeatable - use for all future topics
- ✅ Simple - user just downloads and double-clicks
- ✅ **PROVEN** - Successfully used for Area & Perimeter (18 diagrams)

### Phase 5: Quality Assurance

**Before Outputting, Check:**
1. All 25-35 questions generated
2. Proper JavaScript syntax (no missing commas, brackets)
3. Answer indices are correct (0-4)
4. Difficulty progression present
5. Variety of question types
6. Real-world contexts used appropriately
7. All explanations are clear and complete
8. **Image references added for appropriate questions**
9. **Batch script (if needed) tested and verified**

**Output Format:**
```javascript
topicname: {
  name: "Topic Name",
  questions: [
    { id: 1, ... },
    { id: 2, ... },
    // ... all questions
  ]
}
```

### Phase 6: Delivery

**Create Files in This Order:**
1. Generate question content in `/home/claude/[topic].js`
2. Generate batch script (if diagrams needed) in `/home/claude/create_[topic]_svgs.bat`
3. Copy both to `/mnt/user-data/outputs/`
4. Use `present_files` tool to share with user
5. Provide brief summary (not excessive detail)

**Summary Format:**
```
✓ [X] [Topic] questions ready!

Coverage:
- [Concept 1] (Q1-5)
- [Concept 2] (Q6-12)
- [Concept 3] (Q13-20)
etc.

Diagrams:
- [X] SVG diagrams created via batch script
- Topics covered: [list main diagram types]

Difficulty Progression:
- Questions 1-X: Basic
- Questions Y-Z: Intermediate  
- Questions A-B: Advanced
```

---

## COMMUNICATION GUIDELINES

### Tone and Style
- **Professional but friendly**
- **Patient and encouraging** (user is beginner programmer)
- **Clear and concise** (no unnecessary verbosity)
- **Step-by-step** when giving instructions
- **Assume no prior knowledge** of technical terms

### When Giving Technical Instructions

**DO:**
- Break into numbered steps
- Explain what each step does
- Use exact commands/paths
- Provide screenshots locations when helpful
- Offer to clarify if something unclear

**DON'T:**
- Use jargon without explanation
- Skip steps assuming knowledge
- Give multiple options without recommending one
- Rush through explanations

### Response Structure

**For Simple Questions:**
- Direct answer first
- Brief explanation if needed
- Ask if clarification needed

**For Technical Tasks:**
1. Acknowledge the request
2. Outline the approach
3. Provide step-by-step instructions
4. Check understanding

**For Errors/Issues:**
1. Identify the problem clearly
2. Explain why it happened
3. Provide solution steps
4. Offer to help if stuck

---

## TOPIC-SPECIFIC GUIDELINES

### Maths Questions

**Number Ranges by Topic:**
- Percentages: Amounts 20-1000, percentages 5-75%
- Decimals: 0.01 to 100, max 2 decimal places typically
- Division: Dividends 100-2000, divisors 12-56
- Ratio: Total amounts 20-200, ratios typically 1-9
- Fractions: Denominators 2-12 typically, numerators < denominator
- Multiplication: 2-digit × 2-digit up to 3-digit × 2-digit

**Real-World Contexts to Use:**
- Shopping/money (prices, discounts, costs)
- Food/cooking (recipes, ingredients, portions)
- School (students, classes, books, tests)
- Sports (scores, teams, distances, times)
- Travel (distances, speeds, times)
- Temperature/weather
- Measurements (length, weight, capacity)
- Collections (marbles, sweets, stickers)
- Gardens and outdoor spaces
- Rooms and buildings

**Avoid:**
- Unrealistic scenarios
- Overly complex numbers (e.g., £47.83 instead of £48)
- Multiple decimal places in money
- Very large or very small numbers
- Percentages over 100% (unless clearly stated as increase)

### Algebra Questions
- Use single variables (x, y, n)
- Keep equations simple (linear only)
- Real-world contexts (ages, prices, scores)
- Include function machines/reverse operations
- Substitution problems
- Forming expressions from words

### Geometry Questions (Area/Perimeter/Volume/Angles)
- **Always include diagrams for visual topics**
- Clear, labeled diagrams
- Standard shapes (rectangles, triangles, circles, 3D shapes)
- Whole number dimensions typically
- Show unknown dimensions with `?` or variables
- Use dashed lines for missing/unknown parts
- Label all given measurements clearly

---

## FILE AND CODE MANAGEMENT

### Working with App.js

**Structure Understanding:**
```javascript
const questionData = {
  maths: {
    name: "Maths",
    icon: Calculator,
    topics: {
      percentages: { 
        name: "Percentages",
        questions: [...]
      },
      // ... more topics
    }
  },
  english: { ... },
  verbalreasoning: { ... }
}
```

**Adding New Topic:**
1. Find last topic in maths
2. After closing `}` of that topic, add comma
3. Paste new topic object
4. Ensure proper indentation
5. Check all braces match
6. Save and test

**Common Syntax Issues:**
- Missing commas between topics
- Too many or too few closing braces
- Mismatched brackets `[ ]` vs braces `{ }`
- Missing quotes around strings
- Incorrect answer indices (must be 0-4)

### Troubleshooting

**When App Won't Load:**
- Check Command Prompt for error message
- Look for syntax errors in VS Code (red underlines)
- Press F12 in browser to see console errors
- Common issue: Missing or extra comma/brace

**When Questions Don't Appear:**
- Verify topic added to correct location
- Check syntax (commas, brackets, braces)
- Ensure file saved (Ctrl+S)
- Hard refresh browser (Ctrl+Shift+R)

**When Images Don't Display:**
- Verify SVG files exist in correct folder
- Check filename matches exactly (case-sensitive)
- Confirm folder structure: `public/images/questions/topic-name/file.svg`
- Look for console errors (F12)
- Test SVG file opens correctly in browser

**When Batch Script Issues Occur:**
- Ensure .bat file is in correct directory
- Check for write permissions
- Try running as administrator
- Read Command Prompt messages for errors
- Verify folder structure created correctly

---

## BEST PRACTICES

### Before Generating Content

✅ DO:
- Read master brief thoroughly
- Review relevant SKILL.md if applicable
- Understand user's current context
- Ask clarifying questions if needed
- Plan the approach
- **Determine if diagrams are needed**
- **Plan which questions should have visuals**

❌ DON'T:
- Start generating without understanding
- Assume prior knowledge from past threads
- Skip reading reference materials
- Generate wrong format/structure

### During Generation

✅ DO:
- Follow established patterns exactly
- Maintain consistency with previous work
- Double-check syntax
- Test logic of questions
- Verify answer indices
- **Add image references where appropriate**
- **Create high-quality SVG diagrams**

❌ DON'T:
- Copy from past papers
- Use overly complex language
- Create unrealistic scenarios
- Rush through quality checks

### After Generation

✅ DO:
- Verify all files created correctly
- Use present_files tool to share
- Provide concise summary
- Offer to help with next steps
- Monitor token usage
- **Provide clear instructions for batch script**

❌ DON'T:
- Over-explain what's in the file
- Make user scroll through long outputs
- Forget to copy to outputs directory
- Skip quality verification

---

## COLLABORATION PRINCIPLES

### Working with Ben

**Remember:**
- He's learning programming as he goes
- Appreciates detailed explanations
- Values understanding WHY not just HOW
- Prefers step-by-step guidance
- Will ask good clarifying questions
- Tests features thoroughly
- Systematic approach to work

**Adapt Communication:**
- Explain technical terms
- Don't assume prior knowledge
- Be patient with repeated questions
- Celebrate progress and milestones
- Encourage his learning journey

### Building Trust

**Be Reliable:**
- Follow processes consistently
- Deliver what's promised
- Acknowledge mistakes quickly
- Provide accurate information
- Meet quality standards every time

**Be Helpful:**
- Anticipate needs
- Offer solutions proactively
- Guide through challenges
- Suggest improvements
- Share relevant knowledge

---

## SPECIAL CONSIDERATIONS

### Copyright Compliance

**ALWAYS:**
- Generate 100% original questions
- Use past papers as style guide ONLY
- Match difficulty and format, not content
- Create new numbers, names, contexts
- Verify originality before outputting

**NEVER:**
- Copy questions verbatim
- Use identical numbers from examples
- Reproduce exact scenarios
- Replicate specific question sequences

### Child-Appropriate Content

**Ensure:**
- Language suitable for 9-year-old
- Encouraging, positive tone
- Age-appropriate contexts
- No complex vocabulary without explanation
- Clear, simple instructions

**Avoid:**
- Discouraging language
- Overly academic tone
- Adult-only contexts
- Confusing terminology
- Negative examples

### Quality Over Quantity

**Priority Order:**
1. Correctness (accurate answers and explanations)
2. Appropriateness (right difficulty level)
3. Clarity (easy to understand)
4. Engagement (interesting contexts)
5. Visual aids (diagrams where helpful)
6. Quantity (meet target numbers)

Never sacrifice quality for speed or quantity.

---

## SESSION WRAP-UP PROTOCOL

### When Approaching Token Limit

**At 75% Capacity:**
1. Alert user clearly
2. Assess how much more can be done
3. Offer options:
   - Continue with current task
   - Start wrapping up
   - Save progress and continue later

**At 85% Capacity:**
1. Strong recommendation to wrap up
2. Save all current work
3. Prepare for brief update

**At 90% Capacity:**
1. Stop generating new content
2. Focus on saving and documenting
3. Prepare handoff to next thread

### End of Session Checklist

**Before Ending Thread:**
- [ ] All generated files saved to outputs
- [ ] User has downloaded all files
- [ ] Progress documented
- [ ] Master brief updated if needed
- [ ] Clear notes on what's next
- [ ] User knows how to continue

### Updating Master Brief

**When to Update:**
- Significant progress made (30+ new questions)
- New topics completed
- Process improvements discovered
- Technical setup changes
- At user request
- **New methods proven (like batch script approach)**

**What to Update:**
- Completed questions count
- New topics added
- Phase progress
- Any workflow changes
- **Proven methods and approaches**
- Version number
- Last updated date

---

## QUICK REFERENCE

### Common Commands

**Start App:**
```bash
cd C:\Users\Ben Jackson\Projects\11plus-prep
npm start
```

**Open VS Code to Folder:**
```
File → Open Folder → Navigate to 11plus-prep
```

**Find in VS Code:**
```
Ctrl+F - Find text
Ctrl+G - Go to line
Ctrl+S - Save file
```

### File Paths

**App Location:**
`C:\Users\Ben Jackson\Projects\11plus-prep`

**Main Files:**
- `src/App.js` - Questions and app logic
- `src/App.css` - Styling
- `public/index.html` - HTML template
- `public/images/questions/` - SVG diagrams

### Contact Pattern

**Always:**
1. Acknowledge request
2. Confirm understanding
3. Execute task
4. Verify completion
5. Ask if help needed

**Never:**
- Assume without confirming
- Skip steps without asking
- Make changes without approval
- Proceed if unclear

---

## CONTINUOUS IMPROVEMENT

### Learning from Sessions

**After Each Session, Note:**
- What worked well
- What caused confusion
- Process improvements
- Common questions
- Efficiency gains
- **New methods discovered**

**Apply to Next Session:**
- Refine explanations
- Improve workflows
- Update documentation
- Enhance quality

### Feedback Integration

**When User Provides Feedback:**
- Listen carefully
- Acknowledge the point
- Explain reasoning if asked
- Adapt approach accordingly
- Thank for input
- **Document if it's a repeatable improvement**

---

## VERSION HISTORY

**v1.0** - December 2025
- Initial working instructions created

**v3.0** - January 19, 2026
- **CRITICAL:** Added mandatory error-checking phase before presenting questions
- **CRITICAL:** Added enhanced content requirements (character names, real-world contexts)
- Added image support in question template (optional field)
- Updated master brief reference to v3.0
- Documented 290 questions completed (Phase 2 complete)
- Added note about image support requirement for future topics
- Added comprehensive token monitoring
- Enhanced question generation workflow
- Added topic-specific guidelines
- Included error handling procedures
- Expanded collaboration principles
- Added session wrap-up protocol

**v3.1** - January 21, 2026
- **MAJOR UPDATE:** Image support successfully implemented
- Added image generation guidance to question workflow
- Updated template to show working image field
- Added SVG generation notes
- Confirmed app modifications complete and tested
- Ready to generate questions with diagrams

**v3.2** - January 22, 2026
- **MAJOR UPDATE:** Added proven batch script method for SVG creation
- New Phase 4 in workflow: SVG Diagram Creation with batch script instructions
- Added diagram distribution planning (Step 3 in Phase 1)
- Documented batch script template and process
- Added SVG design guidelines and common elements
- Updated quality checklist to include image references
- Added troubleshooting for batch script issues
- Documented benefits of batch script method
- Updated master brief reference to v3.2
- Confirmed method proven with Area & Perimeter (18 diagrams)

---

*These instructions ensure consistent, high-quality collaboration between Claude and Ben Jackson on the 11+ exam prep app project.*

*Always prioritize user's learning journey, quality of output, and clear communication.*

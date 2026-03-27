# WORKING INSTRUCTIONS FOR CLAUDE
## 11+ Exam Prep App - Process & Guidelines
**Version:** 3.0
**Last Updated:** January 19, 2026
**Purpose:** Instructions for how Claude should work with Ben Jackson on this project

---

## SESSION MANAGEMENT

### At Start of Every New Thread

**STEP 1: Read Context Documents**
- User will upload `11plus_master_brief_v3.md` (updated January 19, 2026)
- User will upload this `working_instructions_v3.md`
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

**Step 2: Plan Question Distribution**
- Basic level: ~30% (straightforward, single-step)
- Intermediate: ~40% (word problems, 2-step)
- Advanced: ~30% (complex, multi-step)

**Step 3: Set Quantity Target**
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
  image: "topic-name/diagram.svg", // OPTIONAL - add when visual needed
  options: ["Option A", "Option B", "Option C", "Option D", "Option E"],
  correct: [0-4], // index of correct answer
  explanation: "[Child-friendly explanation with ✓]"
}
```

**Question Quality Checklist:**
- [ ] 5 plausible answer options
- [ ] Strategic distractors (common mistakes)
- [ ] Appropriate difficulty for Year 5/6
- [ ] Clear, concise wording (1-2 sentences typically)
- [ ] **Character names used** ⭐ NEW
- [ ] **Real-world context/scenario** ⭐ NEW
- [ ] Child-friendly explanation
- [ ] Shows working/method
- [ ] Uses ✓ to confirm answer
- [ ] No calculator required
- [ ] Solvable in ~50 seconds
- [ ] Original (not copied from examples)

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

### Phase 3: MANDATORY ERROR CHECKING ⭐ NEW - CRITICAL

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

### Phase 4: Quality Assurance

**Before Outputting, Check:**
1. All 25-35 questions generated
2. Proper JavaScript syntax (no missing commas, brackets)
3. Answer indices are correct (0-4)
4. Difficulty progression present
5. Variety of question types
6. Real-world contexts used appropriately
7. All explanations are clear and complete

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

### Phase 5: Delivery

**Create Files in This Order:**
1. Generate content in `/home/claude/[topic].js`
2. Copy to `/mnt/user-data/outputs/[topic].js`
3. Use `present_files` tool to share with user
4. Provide brief summary (not excessive detail)

**Summary Format:**
```
✓ [X] [Topic] questions ready!

Coverage:
- [Concept 1] (Q1-5)
- [Concept 2] (Q6-12)
- [Concept 3] (Q13-20)
etc.

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

**Avoid:**
- Unrealistic scenarios
- Overly complex numbers (e.g., £47.83 instead of £48)
- Multiple decimal places in money
- Very large or very small numbers
- Percentages over 100% (unless clearly stated as increase)

### Algebra Questions (When Building)
- Use single variables (x, y, n)
- Keep equations simple (linear only)
- Real-world contexts (ages, prices, scores)
- Include function machines/reverse operations
- Substitution problems
- Forming expressions from words

### Geometry Questions (When Building)
- Clear diagrams descriptions
- Standard shapes (rectangles, triangles, circles)
- Whole number dimensions typically
- Area, perimeter, volume basics
- Angle properties
- Simple coordinate grids

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
      topicname: { name: "...", questions: [...] },
      // comma between topics
      anothertopic: { name: "...", questions: [...] }
      // NO comma after last topic
    }
  },
  // comma between subjects
  english: { ... },
  verbalreasoning: { ... }
}
```

**Common Syntax Errors to Avoid:**
- Missing comma between topics
- Extra comma after last item
- Mismatched brackets/braces
- Missing quotes around strings
- Wrong answer index (should be 0-4)

**When User Has Syntax Error:**
1. Identify the error clearly
2. Show exactly what's wrong
3. Provide exact fix
4. Explain why it's needed

### VS Code Guidance

**When User Can't See Files:**
- File → Open Folder
- Navigate to `C:\Users\Ben Jackson\Projects\11plus-prep`
- Select folder and click Open

**When User Needs to Find Something:**
- Use Ctrl+F to search
- Use Ctrl+G to go to line number
- Look in left sidebar for file tree

**When User Needs to Edit:**
- Open file by clicking in sidebar
- Or right-click file → Open with Code
- Make changes
- Save with Ctrl+S

---

## ERROR HANDLING

### When App Won't Start

**Checklist:**
1. Check Command Prompt is in correct directory
2. Try `npm install` then `npm start`
3. Look for error messages in red
4. Check if another instance is running

**Common Issues:**
- Port 3000 already in use → Close other instance
- Missing dependencies → Run `npm install`
- Syntax error in code → Check browser console (F12)

### When Questions Don't Appear

**Debugging Steps:**
1. Check browser console (F12) for errors
2. Verify question added to correct location in App.js
3. Check for syntax errors (missing commas, brackets)
4. Ensure file saved (Ctrl+S)
5. Try hard refresh (Ctrl+Shift+R)

### When VS Code Issues Occur

**Solutions:**
- Close and reopen VS Code
- Right-click file → Open with Code
- Check file permissions
- Verify file actually exists in folder

---

## BEST PRACTICES

### Before Generating Content

✅ DO:
- Read master brief thoroughly
- Review relevant SKILL.md if applicable
- Understand user's current context
- Ask clarifying questions if needed
- Plan the approach

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
5. Quantity (meet target numbers)

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
- Significant progress made (50+ new questions)
- New topics completed
- Process improvements discovered
- Technical setup changes
- At user request

**What to Update:**
- Completed questions count
- New topics added
- Phase progress
- Any workflow changes
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

---

*These instructions ensure consistent, high-quality collaboration between Claude and Ben Jackson on the 11+ exam prep app project.*

*Always prioritize user's learning journey, quality of output, and clear communication.*

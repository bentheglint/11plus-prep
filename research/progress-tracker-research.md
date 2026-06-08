# Progress Tracking in Educational Apps: Research & Best Practices

## Purpose

This document compiles research on best practices for progress tracking in exam preparation apps aimed at children aged 9-11, specifically in the context of the UK 11+ exam. It covers what leading platforms do, what learning science says, what parents need, what motivates children, and practical metrics for MCQ-based learning. The goal is to inform the design of a best-in-class progress tracking system for the 11+ Prep app.

---

## Table of Contents

1. [What Leading 11+ Platforms Track](#1-what-leading-11-platforms-track)
2. [Learning Science on Mastery Tracking](#2-learning-science-on-mastery-tracking)
3. [What Parents Want from Progress Dashboards](#3-what-parents-want-from-progress-dashboards)
4. [Gamification and Motivation for Children](#4-gamification-and-motivation-for-children)
5. [Exam Readiness Indicators](#5-exam-readiness-indicators)
6. [Best Practice Metrics for MCQ-Based Learning](#6-best-practice-metrics-for-mcq-based-learning)
7. [Practical Recommendations for Our App](#7-practical-recommendations-for-our-app)
8. [Sources](#sources)

---

## 1. What Leading 11+ Platforms Track

### Atom Learning (Market Leader)

Atom Learning is the dominant player in the UK 11+ prep space, with 90,000+ questions and an adaptive AI engine. Their 2025 results claim 89% first-choice exam offers for students using the platform.

**What parents see:**
- **Standardised Age Score (SAS)** -- the same scoring method used by grammar schools. Average is 100, maximum is 142. A score of 115+ indicates strong exam readiness; 120+ is competitive for top-tier schools.
- **Mastery Score** broken down by topic and subtopic, allowing parents to identify specific strengths and weaknesses.
- **Year Group Comparison** -- benchmarking against other Atom students applying to the same schools. Shows how far above or below the average a child is working.
- **Performance ratings** in four categories: Needs Practice, Good, Strong, Master.
- **Progress graphs** showing trends over time towards target schools.
- **Mock test reports** with exam technique insights, standardised scores, and question-level transcripts.
- **Baseline Assessment** results providing an initial SAS and areas of strength/improvement stored on a "Score Card".

**What children see:**
- Adaptive difficulty that adjusts in real-time based on performance.
- Immediate feedback after questions.
- Progress through learning content that gets harder as mastery improves.

**Key insight:** Atom's strength is the SAS benchmark -- parents understand it because it mirrors the real exam scoring system. Comparing against other children applying to the same schools is the killer feature parents pay for.

### Bond Online (Oxford University Press / CENTURY)

Bond is the traditional 11+ brand (books since the 1960s), now with an online platform powered by CENTURY's AI.

**What parents see:**
- **Percentage marks at three levels**: Subject level (average of all tests), and Named test/topic level (average of last 3 attempts).
- **Stanine Scores** -- showing performance relative to peers on a 1-9 scale.
- **Completion tracking** -- which tests have been assigned, started, and finished.
- **Topic-level performance** -- identifying areas needing additional support.

**Key difference from Atom:** Bond's mock tests are NOT adaptive (unlike the real ISEB exam), which is a competitive weakness. However, their brand recognition and alignment with Bond books is strong.

### EdPlace

**What parents see:**
- **Snapshot dashboard** with logins, rewards, and worksheet completions (7-day or 30-day view).
- **Automated reports** sent via email after 20 worksheets per subject or 5+ topics.
- **Notifications** on how to help their child.
- **Gamified approach** with rewards for completing tasks and milestones.

### Explore Learning

**What parents see:**
- **Live progress report** accessible at any time via the Member Portal.
- **Skills mastered** -- which skills the child has demonstrated mastery of.
- **Topics being taught** -- what the child is currently learning.
- **Challenging questions** -- which specific questions the child is finding difficult.

### 11PluseHelp.co.uk

**What parents see:**
- **Performance graphs** showing progression over time as tests are taken.
- **Analytical reports** tracking readiness with detailed feedback.
- **Custom assignments** -- parents can schedule specific tests via "Assign Tests".
- **Pinpointed strengths and weaknesses** from comprehensive mock tests.

### Club 11 Plus / 11Plus Tracker

- Dedicated progress tracking tools for 11+ preparation.
- Performance over time visualisation.
- Topic-level breakdown of results.

### Summary: Common Features Across All Platforms

| Feature | Atom | Bond | EdPlace | Explore | 11PluseHelp |
|---------|------|------|---------|---------|-------------|
| Standardised Score | SAS | Stanine | -- | -- | -- |
| Topic breakdown | Yes | Yes | Yes | Yes | Yes |
| Peer comparison | Yes | Yes | -- | -- | -- |
| Progress over time | Yes | Yes | Yes | Yes | Yes |
| Mock test reports | Yes | Yes | -- | -- | Yes |
| Parent notifications | Yes | -- | Yes | -- | -- |
| Adaptive difficulty | Yes | No | -- | -- | -- |
| Exam readiness indicator | Yes | -- | -- | -- | Yes |

---

## 2. Learning Science on Mastery Tracking

### Spaced Repetition and the Forgetting Curve

**The core research:** Over 317 studies in a meta-analysis conclusively demonstrate the superiority of spaced repetition over massed practice (cramming) for long-term retention. Ebbinghaus's forgetting curve (1885) shows that without revisiting material, learners forget 50% within 30 minutes and 70-80% within 24 hours.

**Impact on exam scores:** Learners using spaced repetition achieved adjusted mean exam scores of 70%, versus 64% for massed practice and 61% for no structured practice at all. That 6-9 percentage point difference could be the margin between passing and failing the 11+.

**Optimal intervals:** The "expanding intervals" approach works best:
- Session 2: 2 days after Session 1
- Session 3: 3 days after Session 2
- Session 4: 5 days after Session 3
- Session 5: 7 days after Session 4

Each successful repetition increases the optimal interval before the next one. Material that is hard appears more often; material that is easy appears less often.

**For children specifically:** Research with preschoolers, first graders, and third graders found that recall increased as spacing between repetitions increased. The effect did NOT relate to age -- spaced repetition works across all age groups, including 9-11 year olds.

**What this means for progress tracking:** The system should track not just whether a child got a question right, but WHEN they last practised each topic and whether the spacing is optimal. A topic with 90% accuracy but no practice for 3 weeks is at risk of decay.

### Mastery-Based Learning

**Khan Academy's model:** Uses a progression system with mastery levels per skill:
- Not started
- Attempted
- Familiar
- Proficient
- Mastered

Students must demonstrate proficiency over time, not just once. "Proving what you know over time is a really great way to ensure that you actually remember what you've learned."

**Key principle:** Mastery should require consistent performance, not a single good score. A child who scores 100% once but hasn't revisited a topic in weeks is not truly at mastery.

### Zone of Proximal Development (ZPD)

**The theory:** Vygotsky's ZPD describes the gap between what a learner can do independently and what they can achieve with guidance. Effective learning happens WITHIN this zone -- not too easy (boring), not too hard (frustrating).

**For adaptive systems:** Platforms that keep learners within their ZPD show 17% less time to reach mastery compared to non-adaptive systems. The system should:
- Track the difficulty level at which a child is succeeding (~70-85% accuracy is the sweet spot).
- Automatically adjust question difficulty to stay in the ZPD.
- Flag when a child is consistently below 60% (too hard) or above 95% (too easy) on a topic.

### Growth Mindset and "Not Yet"

**Research finding:** Using phrases like "not yet" instead of "failed" or "wrong" helps children perceive challenges as temporary obstacles rather than permanent setbacks.

**For progress tracking:**
- Avoid binary "pass/fail" language.
- Use progression language: "Working towards", "Getting there", "Got it", "Mastered".
- Praise effort and strategy, not just results. Carol Dweck warns against "false growth mindset" -- praising effort WITHOUT progress is hollow.
- The dashboard should show improvement over time, not just current state.

### What Actually Predicts Exam Success?

Research shows that neither "time spent" nor "raw questions answered" alone predicts learning outcomes. The "dosage" of app study (sessions, time per session, duration) did NOT predict effectiveness.

**What matters:**
1. **Quality of practice** -- targeted, difficulty-appropriate questions with meaningful feedback.
2. **Consistency of practice** -- regular short sessions (20-30 mins, 4-5 days/week) beat long cramming sessions.
3. **Spaced revisiting of weak areas** -- returning to topics after intervals.
4. **Error analysis** -- understanding WHY mistakes happen, not just that they happened.
5. **Metacognitive accuracy** -- does the child know what they know? Overconfident children stop studying too early; underconfident children become anxious.

---

## 3. What Parents Want from Progress Dashboards

### Core Information Needs

Research and platform analysis reveals parents consistently want:

1. **Is my child on track?** -- The single most important question. Parents want a clear, at-a-glance answer.
2. **Where are the gaps?** -- Specific topics/subtopics where more work is needed.
3. **Are they improving?** -- Trend over time, not just current snapshot.
4. **How do they compare?** -- Against peers, against school requirements, against where they "should" be.
5. **What should we do next?** -- Actionable recommendations, not just data.

### Update Frequency

85% of parents want weekly communications about their child's progress. Short, frequent updates are preferred over lengthy monthly reports.

### Mobile Access

73% of parent portal access occurs on mobile devices. Responsive design is essential -- parents check dashboards on phones while commuting, during lunch breaks, etc.

### Specific Feature Requests (from UX research)

Parents in studies specifically requested:
- Ability to see **individual problem-level detail** -- which exact questions were wrong and why.
- **Time on activity and number of attempts** -- to assess whether guessing or genuinely struggling.
- Ability to **annotate/comment** on individual skills.
- **All activities for a skill** -- every question attempted for a given topic.
- Ability to **incorporate external scores** (paper tests, tutor results) into the tracker.
- **Customisable notifications** -- choosing what info they receive and how.

### What Causes Anxiety vs Confidence in Parents

**Anxiety triggers:**
- Red/traffic-light visualisations for low scores (research shows this increases distress).
- Over-emphasis on peer comparison (especially when child is below average).
- Too much data without context or guidance on what to do.
- Parental over-expectations of academic performance directly trigger parental anxiety.
- Seeing raw "wrong answers" lists without explanations or context.

**Confidence builders:**
- Clear improvement trends ("up 12% this month in fractions").
- Specific, actionable next steps ("Focus on ratio word problems this week").
- Positive framing with constructive detail ("Strong in algebra. Fractions improving -- focus on equivalent fractions next").
- Seeing effort metrics alongside results ("Practised 4 days this week").
- Reassurance that exam results don't define the child.

**Critical design principle from research:** Language should be "positive and unthreatening", presented in "bite-sized chunks". Traffic light red zones in visualisations should be used with extreme care -- research shows they can increase anxiety in both children and parents.

### The 11+ Parent Context Specifically

The 11+ creates unique parental stress:
- Parents feel pressure to "do enough" preparation without burning out a 9-year-old.
- The exam is high-stakes with limited places -- grammar school entry affects secondary education.
- Parents' own anxieties transfer directly to children.
- The recommended approach is "little and often" (20-30 minute sessions, 4-5 days/week), but parents often feel this isn't enough.

**Dashboard implication:** The progress tracker should normalise the "little and often" approach by rewarding consistency rather than volume. A parent who sees "Daisy practised for 25 minutes on 4 days this week" should feel reassured, not anxious about the 3 days she didn't practise.

---

## 4. Gamification and Motivation for Children

### What Research Says About 9-11 Year Olds

A study with 5th grade primary school pupils (ages 9-11) found that gamification prototypes increased both cognitive and achievement motivation. Children's motivation significantly correlates with their enjoyment and perceived learning outcome.

**Important caveat:** The positive effects of gamification can decline over time (novelty effect). However, complex gamified designs with multiple elements reduce this decline compared to simple badge-only systems.

### Effective Gamification Elements (Ranked by Research Impact)

1. **Progress bars and visual progression** -- Children need to SEE their progress. "If students can't see their progress, it might as well not exist."

2. **Streaks (daily practice tracking)** -- Duolingo's research shows:
   - Learners who reach a 7-day streak are 2.4x more likely to continue the next day.
   - Day-7 retention improved by 14% with streak features.
   - Loss aversion kicks in around day 7 -- users fear losing their streak.
   - **Critical:** Include "streak freezes" -- research from University of Pennsylvania and UCLA shows that offering "slack" (skipping a day without penalty) is MORE motivating than rigid rules.

3. **Badges and achievements** -- Most effective when they represent specific milestones rather than arbitrary completion. Research shows:
   - Immediate "Achievement Earned" notifications boost continued engagement.
   - Badges should represent genuine accomplishments ("Mastered Fractions", "7-Day Streak", "100 Questions in Algebra").
   - Badge collections create a "trophy case" effect that children enjoy browsing.
   - **For 9-11 year olds specifically:** Immediate visual rewards (badges, trophies) are the most effective incentives.

4. **Levels and XP** -- Work well when:
   - XP is earned for EFFORT (trying, practising consistently), not just correctness.
   - Clear milestones exist (5,000 XP, 10,000 XP) that give targets.
   - Progress is visible daily or weekly.
   - Suggested scale: 1 point for daily behaviours, 3-5 points for effort achievements, 10+ points for milestones.

5. **Leaderboards** -- Use with EXTREME caution for this age group:
   - Can be motivating for top performers but devastating for struggling children.
   - Better to use "personal best" comparisons than peer rankings.
   - If used, show position against anonymised peers, not named classmates.
   - Research found no significant difference between badges and leaderboards for motivation -- suggesting badges alone are sufficient without the anxiety risk of rankings.

### What Prodigy Math Does (Best-in-Class for Children's Engagement)

Prodigy wraps maths practice in a game world:
- **Quest-based progression** through a story world.
- **Battles** where answering questions powers spells.
- **In-game rewards** (cosmetics, pets) earned through practice.
- **Parent-set goals** with parent-given rewards.
- **Monthly progress reports** sent to parents showing questions answered and month-over-month comparison.

**Key insight from Prodigy:** The child's interface looks like a game; the parent's interface looks like a dashboard. They are completely separate experiences serving different needs.

### What DreamBox Does

- Recommends 5 lessons per week as the target.
- Shows "Standards Met" (fully mastered) vs "Standards Made Progress In" (working on).
- **Alerts** -- notifications when a student needs attention OR deserves congratulations.
- Certificates, avatars, and emojis as rewards.

### Design Principles for Our Age Group (9-11)

1. **Separate child and parent views** -- Children need motivation; parents need data.
2. **Effort-based rewards** -- XP for practice sessions, not just correct answers.
3. **Streaks with flexibility** -- Daily practice streak with streak freezes (1-2 per week).
4. **Milestone badges** -- Tied to meaningful achievements (topic mastery, consistency, improvement).
5. **Personal best focus** -- "Beat your last score" rather than "beat other children".
6. **No punitive elements** -- Never show "you failed" or remove progress. Only add.
7. **Short-term and long-term goals** -- Weekly targets (practice 4 days) and long-term goals (master all topics).

---

## 5. Exam Readiness Indicators

### How GL Assessment Scores Work

For GL Assessment 11+ exams (which Bournemouth and Parkstone Grammar use):
- Raw scores are converted to **Standardised Age Scores (SAS)** -- adjusted for age so younger children aren't disadvantaged.
- Average SAS is 100. Maximum is typically around 141.
- **115+ SAS** is a strong indicator of exam readiness for grammar school entry.
- **120+ SAS** is competitive for the most selective schools.
- Pass marks vary by school and year, based on cohort performance and available places.

### How Leading Platforms Indicate Readiness

**Atom Learning:**
- Provides SAS after every mock test using the same scoring method as grammar schools.
- Shows "where your child stands relative to other children of the same age".
- Compares against "thousands of others applying to the same schools".
- Progress graphs track trajectory towards target schools.
- Parents can see "if they're on track to pass".

**CTP (Comprehensive Testing Program) research:**
- Predictive models can estimate future exam scores from current performance with reasonable accuracy.
- Example: A model predicted a student's score as approximately 23 (with confidence interval 22-25), and their actual score years later was 22.
- **Critical caveat:** "These predictions are estimates, a forward-looking projection to help students see if they are on track, not a guarantee of a future score."

### Designing a Readiness Indicator

Based on the research, an effective readiness indicator should include:

1. **Topic mastery grid** -- Visual grid showing mastery level per topic (4-5 levels, colour-coded but avoiding red for low scores).

2. **Trend direction** -- Is the child improving, plateauing, or declining in each area? Arrows or sparklines.

3. **Consistency metric** -- How regularly are they practising? Consistent practice is a better predictor than raw scores.

4. **Estimated readiness band** -- NOT a predicted score (too anxiety-inducing and potentially inaccurate), but a band:
   - "Building foundations" (needs significant work)
   - "Developing well" (on a good trajectory)
   - "Exam ready" (performing at competitive levels)
   - "Excelling" (performing above typical grammar school entry levels)

5. **Time-based projection** -- "At the current rate of improvement, [child] is projected to be exam-ready by [month]." This gives parents a sense of whether the preparation timeline is working.

6. **Weak spots list** -- The 3-5 specific topics/subtopics most in need of attention, ranked by impact on overall readiness.

### What NOT to Do

- **Don't show a single "readiness percentage"** -- This creates false precision. 73% ready doesn't mean anything.
- **Don't predict exact exam scores** -- Too many variables (exam difficulty, child's state on the day, competition that year).
- **Don't compare against other children on the platform** unless you have statistically significant sample sizes.
- **Don't use traffic-light red** for "not ready" -- research shows this increases anxiety without motivating action.

---

## 6. Best Practice Metrics for MCQ-Based Learning

### Primary Metrics (Show to Parents)

#### 1. Accuracy Rate (by Topic, Over Time)
- **What:** Percentage of questions answered correctly per topic.
- **How to display:** Line graph showing accuracy over time, with topic selector.
- **Target zones:** Below 60% = needs focus, 60-79% = developing, 80-89% = strong, 90%+ = mastered.
- **Key insight:** Show rolling averages (last 10 questions, last 20 questions) rather than individual quiz scores, which are too volatile.

#### 2. Topic Mastery Heatmap
- **What:** Visual grid of all topics, colour-coded by mastery level.
- **How to display:** Grid with topics as rows, mastery level shown by colour intensity (light to dark) or progress fills.
- **Colour guidance:** Use a single-hue gradient (e.g., light blue to deep blue) rather than traffic-light colours to avoid anxiety. Or use a warm progression (seed to bloom metaphor).
- **Update frequency:** After every quiz session.

#### 3. Practice Consistency
- **What:** How regularly the child is practising.
- **How to display:** Weekly calendar view (similar to GitHub contribution graph) showing which days had practice sessions. Heat intensity shows session length/questions answered.
- **Target:** 4-5 days per week, 20-30 minutes per session.
- **Why it matters:** Research shows consistency is a better predictor of outcomes than total time or total questions answered.

#### 4. Improvement Trend
- **What:** Direction of change in accuracy over the last 2-4 weeks per topic.
- **How to display:** Up/down/flat arrows or sparkline graphs next to each topic.
- **Why it matters:** A child at 65% accuracy but improving is in a better position than one at 75% but declining.

### Secondary Metrics (Show on Request / Advanced View)

#### 5. Speed (Time Per Question)
- **What:** Average time taken per question, by topic.
- **How to display:** Bar chart comparing against target time (GL 11+ typically allows ~1 minute per question).
- **Why it matters:** A child who gets 80% right but takes 3 minutes per question will struggle under exam conditions. Speed AND accuracy together predict exam performance.
- **Caution:** Don't emphasise speed until accuracy is strong. Speed without accuracy encourages guessing.

#### 6. Error Pattern Analysis
- **What:** Categorisation of WHY answers are wrong, not just that they are.
- **Categories:**
  - **Conceptual errors** -- Fundamental misunderstanding (e.g., treating fractions like whole numbers).
  - **Careless errors** -- Got the concept right but made a calculation mistake.
  - **Guessing** -- Very fast response time + wrong answer suggests guessing.
  - **Trap answers** -- Fell for a common distractor (e.g., choosing the answer that uses the right numbers but wrong operation).
- **How to detect:** Combine accuracy data with response time. Fast + wrong = likely guess. Slow + wrong = likely conceptual gap.
- **Research basis:** Maths error analysis research identifies specific error patterns (e.g., treating denominators as whole numbers in fractions, order of operations mistakes) that diagnostic feedback can address.

#### 7. Question Difficulty Progression
- **What:** What difficulty level the child is successfully working at per topic.
- **How to display:** "Difficulty level" indicator per topic (Easy / Medium / Hard / Exam-level).
- **Why it matters:** Shows whether the child is being appropriately challenged and whether they're progressing to harder questions.

#### 8. Spaced Repetition Status
- **What:** Which topics are "due" for review based on forgetting curve calculations.
- **How to display:** "Topics to review" list showing topics where knowledge may be decaying, ordered by urgency.
- **Algorithm:** Based on last practice date, accuracy at last practice, and number of previous successful reviews.

### Metrics to Track Internally (Don't Show to Users)

#### 9. Session Engagement
- **What:** Drop-off rates within sessions, time between questions, patterns of disengagement.
- **Why track:** Identifies if/when the child is getting bored, frustrated, or distracted.

#### 10. Distractor Analysis
- **What:** Which wrong answers are selected most frequently per question.
- **Why track:** Reveals specific misconceptions. If most children who get Q15 wrong choose option C, there's a specific misunderstanding to address.

#### 11. Confidence Calibration
- **What:** If the child reports confidence levels, how well do those match actual accuracy?
- **Why track:** Research shows children (especially 9-11 year olds) are often overconfident. Poor calibration means they think they know a topic but actually don't. This is the most dangerous gap for exam preparation.

---

## 7. Practical Recommendations for Our App

### Architecture: Two Separate Views

Based on everything in this research, the progress tracker should have two distinct experiences:

#### Child View: Motivational, Game-Like
- **Daily XP counter** -- earn XP for practice sessions (effort-based, not just accuracy).
- **Practice streak** -- with 1-2 streak freezes per week.
- **Badge collection** -- milestone badges for topic mastery, streaks, improvement.
- **Topic progress bars** -- simple visual showing "how far through" each topic.
- **Personal best highlights** -- "New best score in Fractions!"
- **Next challenge** -- clear call-to-action for what to practice next.
- **NO peer comparisons, NO red/fail indicators, NO overwhelming data.**

#### Parent View: Data-Rich, Actionable
- **At-a-glance readiness band** -- single visual showing overall trajectory.
- **Topic mastery heatmap** -- all topics, colour-coded by mastery level.
- **This week's practice summary** -- days practised, minutes, questions attempted.
- **Improvement trends** -- per-topic sparklines showing direction of change.
- **Recommended focus areas** -- top 3 topics to work on next, with reasoning.
- **Drill-down capability** -- click any topic to see question-level detail, error patterns, time data.
- **Weekly progress notification** -- automated summary email or in-app notification.

### Mastery Level System

Use 5 levels, inspired by Khan Academy but with growth-mindset language:

| Level | Label | Criteria | Visual |
|-------|-------|----------|--------|
| 0 | Not started | No questions attempted | Empty |
| 1 | Exploring | <60% accuracy, <10 questions | 1/4 fill |
| 2 | Developing | 60-79% accuracy OR <20 questions | 2/4 fill |
| 3 | Confident | 80-89% accuracy AND 20+ questions AND practised within last 14 days | 3/4 fill |
| 4 | Mastered | 90%+ accuracy AND 30+ questions AND practised within last 21 days | Full fill |

**Key feature:** Mastery DECAYS if not practised. A "Mastered" topic that hasn't been revisited in 21+ days drops back to "Confident" with a "needs review" flag. This is grounded in the forgetting curve research.

### Spaced Repetition Integration

Implement a simple spaced repetition scheduler:

1. After a successful quiz on a topic (80%+), schedule review in 3 days.
2. If the review is successful, schedule next review in 7 days.
3. If successful again, schedule in 14 days, then 28 days.
4. If a review is unsuccessful (<70%), reset to 3-day interval.
5. Show "Topics Due for Review" as a prioritised practice list.

### Recommended Practice Schedule Display

Show parents the recommended "little and often" approach:
- **Target:** 4-5 sessions per week, 20-30 minutes each.
- **Visual:** Weekly grid showing completed sessions.
- **Celebration:** When the weekly target is hit, celebrate it visually.
- **No shaming:** Never show "you missed 3 days" -- instead show "3 out of 5 days completed".

### Exam Readiness Dashboard

Design a readiness view that combines:

1. **Overall readiness band** (Building Foundations / Developing Well / Exam Ready / Excelling).
2. **Topic completion** -- which topics have been covered and to what depth.
3. **Consistency score** -- how regular practice has been over the last month.
4. **Improvement velocity** -- are scores trending up, flat, or down?
5. **Weak spot priorities** -- the 3-5 specific areas that would most improve overall readiness if addressed.
6. **Mock test performance** -- if mock tests are available, show scores over time with trend.

### Things to Avoid

Based on the research, specifically do NOT include:

1. **Predicted exam scores** -- too imprecise, creates false confidence or unnecessary anxiety.
2. **Peer rankings/leaderboards** -- damaging for struggling children, minimal benefit over personal-best tracking.
3. **Red/traffic-light colours for low performance** -- research shows this increases anxiety.
4. **Time-based pressure on the dashboard** -- "Only X days until the exam!" creates stress without actionable insight.
5. **Raw "wrong answers" lists** -- demoralising. Instead, frame as "topics to strengthen".
6. **Overemphasis on total questions answered** -- parents will optimise for volume over quality.

### Implementation Priority

**Phase 1 (MVP):**
- Topic mastery heatmap with 5 levels
- Practice streak counter
- Weekly practice summary (days, questions, minutes)
- Per-topic accuracy chart (rolling average)
- Basic "recommended next" suggestions

**Phase 2:**
- Spaced repetition scheduler with "topics due for review"
- Improvement trend sparklines per topic
- Badge/achievement system for children
- Error pattern detection (conceptual vs careless vs guessing)
- Weekly automated summary

**Phase 3:**
- Exam readiness dashboard with readiness bands
- Speed tracking alongside accuracy
- Parent notification preferences
- Mock test integration and tracking
- Detailed drill-down to question-level analysis

---

## Sources

### 11+ Platforms
- [Atom Learning -- Progress Tracking Features](https://atomlearning.com/features/progress-tracking)
- [Atom Learning -- How to Measure Progress](https://resources.atomlearning.co.uk/en/knowledge/how-can-i-measure-my-childs-progress-on-atom-nucleus)
- [Atom Learning -- Target Scores](https://resources.atomlearning.co.uk/en/knowledge/what-scores-should-my-child-be-aiming-for)
- [Atom Learning -- Standardised Age Scores for Tutors](https://resources.atomlearning.co.uk/en/knowledge/standardised-age-scores-tutors)
- [Atom Learning -- Mock Tests](https://www.atomlearning.com/features/mock-tests)
- [Atom Learning -- 2025 11+ Results](https://atomlearning.com/lp/2025-11-plus-results)
- [Atom Learning vs Competitors](https://www.myengineeringbuddy.com/blog/atom-learning-reviews-alternatives-pricing-offerings/)
- [Atom Learning Reviews (Trustpilot)](https://www.trustpilot.com/review/atomlearning.co.uk)
- [Atom Learning -- Milestones Education Guide](https://milestoneseducation.com/atom-learning-the-ultimate-guide-to-resources-reviews-and-how-to-maximise-its-potential/)
- [Bond Online -- CENTURY](https://www.century.tech/bond/)
- [Bond 11+ -- Parent Help](https://www.bond11plus.co.uk/component/content/article/19-parent-help)
- [EdPlace -- Learning Dashboard](https://www.edplace.com/blog/edplace-updates/learningdashboard)
- [Explore Learning -- Member Portal](https://www.explorelearning.co.uk/why-trust-us/navigator/)
- [11PluseHelp -- Track, Support, Succeed](https://www.11plusehelp.co.uk/blog/2025/10/08/empower-your-childs-11-journey-track-support-succeed/)
- [11 Plus Blocks -- Online Platforms Comparison](https://11plusblocks.co.uk/6-online-platforms-for-11-plus-practice-and-mock-tests/)
- [GL Assessment 11+ Scoring](https://pass11plusgrammar.co.uk/blog/how-is-the-gl-assessment-11-scored)
- [What is a Good 11+ Score (Atom)](https://www.atomlearning.com/blog/what-is-a-good-11-plus-score)
- [11+ Pass Mark Calculations](https://schoolentrancetests.com/2023/01/what-score-do-you-need-for-passing-the-11/)

### Learning Science
- [Spacing Effect Meta-Analysis (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8759977/)
- [APA -- Spaced Retrieval Practice Guide](https://pdf.retrievalpractice.org/SpacingGuide.pdf)
- [Spaced Repetition -- Cognitive Science (Justin Skycak)](https://www.justinmath.com/cognitive-science-of-learning-spaced-repetition/)
- [Spaced Repetition for Clinical Problem Solving (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11186069/)
- [Spaced Repetition -- Wikipedia](https://en.wikipedia.org/wiki/Spaced_repetition)
- [Mrs Wordsmith -- Power of Spaced Repetition](https://mrswordsmith.com/blogs/research/the-power-of-spaced-repetition-unlocking-your-childs-learning-potential)
- [Forgetting Curve -- Wikipedia](https://en.wikipedia.org/wiki/Forgetting_curve)
- [Ebbinghaus Forgetting Curve Explained](https://examstudyexpert.com/ebbinghaus-forgetting-curve/)
- [2357 Method -- BCU](https://www.bcu.ac.uk/exams-and-revision/best-ways-to-revise/spaced-repetition)
- [Zone of Proximal Development -- Simply Psychology](https://www.simplypsychology.org/zone-of-proximal-development.html)
- [ZPD in Adaptive Instructional Systems (Springer)](https://link.springer.com/chapter/10.1007/3-540-47987-2_75)
- [Growth Mindset Pedagogy (Frontiers)](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2021.753698/full)
- [Fostering Growth Mindset Through Assessment (ASCD)](https://www.ascd.org/el/articles/fostering-a-growth-mindset-through-assessment)
- [Khan Academy -- Mastery Progress Reports](https://www.khanacademy.org/khan-for-educators/k4e-us-demo/xb78db74671c953a7:using-assignments-on-khan-academy/xb78db74671c953a7:strategies-for-using-assignments-with-students/a/using-khan-academys-mastery-progress-reports)

### Parent Dashboard UX
- [Progress Tracker for Parents -- UX Case Study (Anastasiya Chertova)](https://www.achertova.com/progress-tracker-for-parents-1)
- [DreamBox -- Parent Dashboard](https://www.dreambox.com/family/parent-dashboard)
- [Khan Academy -- Parent Dashboard](https://support.khanacademy.org/hc/en-us/articles/360039664491-Guide-to-the-Parent-Dashboard)
- [Prodigy -- Parent Dashboard](https://prodigygame.zendesk.com/hc/en-us/articles/115001744726-Parent-Dashboard)
- [Prodigy -- Support Learning Progress](https://www.prodigygame.com/main-en/blog/learning-progress-support)
- [Parent Portal Strategy (Cube Creative)](https://cubecreative.design/blog/private-school-marketing/k12-private-parent-portal-strategy)
- [Parents' Education Anxiety (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8855929/)
- [Web-Based App for Mental Health -- Design Study (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8787665/)

### Gamification
- [Gamification in Student Motivation -- Systematic Review (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10448467/)
- [Gamification in Elementary School -- Action Research (SAGE)](https://journals.sagepub.com/doi/10.1177/10468781241237389)
- [Engaging Children via Gamification (Smart Learning Environments)](https://slejournal.springeropen.com/articles/10.1186/s40561-019-0085-2)
- [Duolingo -- How Streaks Build Habits](https://blog.duolingo.com/how-duolingo-streak-builds-habit/)
- [Duolingo -- How Streaks Keep Learners Committed](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/)
- [Duolingo Gamification Secrets (Orizon)](https://www.orizon.co/blog/duolingos-gamification-secrets)
- [Psychology Behind Duolingo's Streak](https://www.justanotherpm.com/blog/the-psychology-behind-duolingos-streak-feature)
- [XP Systems -- Classroom Points](https://leaderboarded.com/blog/posts/track-points-in-the-classroom/)
- [Classroom XP Systems (Gamification for Teachers)](https://gamificationforteachers.com/classroom-xp-systems/)
- [When Your App Needs an XP System (Trophy)](https://trophy.so/blog/when-your-app-needs-xp-system)
- [Badges for Gamification (NudgeNow)](https://www.nudgenow.com/blogs/badges-for-gamification-motivation-learning)
- [Prodigy Math -- Goals and Rewards](https://www.prodigygame.com/main-en/blog/goals-rewards-tool)

### Assessment & Analytics
- [RevisionDojo -- Question Analytics](https://www.revisiondojo.com/blog/ib-question-analytics-track-your-question-performance)
- [AI Learning Analytics Dashboards (8allocate)](https://8allocate.com/blog/ai-learning-analytics-dashboards-for-instructors-turning-data-into-actionable-insights/)
- [Heatmap Dashboard (Learning Pool)](https://learningpool.zendesk.com/hc/en-us/articles/25920989133597-Heatmap-Dashboard)
- [MasteryTrack Dashboards](https://practices.learningaccelerator.org/strategies/mastery-based-dashboards-from-masterytrack)
- [LearningViz Dashboard (Springer)](https://link.springer.com/article/10.1186/s40561-024-00346-1)
- [Item Response Theory -- Wikipedia](https://en.wikipedia.org/wiki/Item_response_theory)
- [IRT Item Difficulty Parameter](https://assess.com/irt-item-difficulty-parameter/)
- [Computerized Adaptive Testing Guide](https://assess.com/computerized-adaptive-testing/)
- [Maths Error Patterns -- Systematic Review (SAGE)](https://journals.sagepub.com/doi/10.1177/07319487241310873)
- [Error Analysis in Mathematics (ERIC)](https://files.eric.ed.gov/fulltext/ED572252.pdf)
- [Identifying Student Errors in Maths (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9798414/)
- [Calibration and Confidence (ScienceDirect)](https://www.sciencedirect.com/science/article/abs/pii/S0959475212000412)
- [Metacognitive Accuracy (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4097944/)

### 11+ Preparation & Wellbeing
- [Year 5 11+ Preparation Guide (Pi Academy)](https://piacademy.co.uk/blog/year-5-11-plus-exam-preparation/)
- [11+ Preparation Year 5 (Pass 11+)](https://pass11plusgrammar.co.uk/11-plus-preparation-year-5)
- [When to Start 11+ Prep (Atom)](https://www.atomlearning.com/blog/best-time-to-start-11-plus-prep)
- [Study Schedule Without Stress (PrimePlus)](https://primeplusuk.co.uk/study-schedule-11-plus/)
- [Supporting Children with 11+ Stress (ChatterStars)](https://chatterstars.co.uk/11-plus-stress/)
- [11+ Managing Exam Stress (Bond 11+)](https://www.bond11plus.co.uk/news/204-11-plus-managing-exam-stress)
- [Help Your Child Beat Exam Stress (NHS)](https://www.nhs.uk/mental-health/children-and-young-adults/advice-for-parents/help-your-child-beat-exam-stress/)
- [YoungMinds -- Supporting Children at Exam Time](https://www.youngminds.org.uk/parent/blog/how-to-help-your-child-manage-exam-stress/)

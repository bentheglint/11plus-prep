# Progression Design Reference

Detailed guidance for the 7-stage journey, mastery system, and player retention.

## 7-Stage Journey

Percentage-based timing — same structure for 3-month and 2-year journeys:

| Stage | % of Journey | Name | Narrative Beat |
|-------|-------------|------|----------------|
| 1 | 5% | The Call | Introduction, character creation, first quiz |
| 2 | 15% | Training Grounds | Building skills, learning the ropes |
| 3 | 10% | First Challenge | First boss battle, first real test |
| 4 | 25% | The Long Road | Deepening mastery, expanding topics |
| 5 | 20% | The Crucible | Hardest stretch, targeting weaknesses |
| 6 | 15% | Rising to Summit | Confidence building, near the end |
| 7 | 10% | The Final Test | Exam prep climax, readiness check |

### Stage Calculation
```javascript
function getCurrentStage(joinDate, testDate, today) {
  const totalDays = daysBetween(joinDate, testDate);
  const elapsed = daysBetween(joinDate, today);
  const progress = elapsed / totalDays; // 0.0 to 1.0

  if (progress < 0.05) return 1;  // The Call
  if (progress < 0.20) return 2;  // Training Grounds
  if (progress < 0.30) return 3;  // First Challenge
  if (progress < 0.55) return 4;  // The Long Road
  if (progress < 0.75) return 5;  // The Crucible
  if (progress < 0.90) return 6;  // Rising to Summit
  return 7;                        // The Final Test
}
```

### Performance States Within Each Stage

Three quality tiers — ALL warm and encouraging:

| Tier | Trigger | Character State | Language |
|------|---------|----------------|----------|
| Thriving | Active 4+ days/week, improving scores | Confident, energetic | "You're on fire!" |
| Steady | Active 2-3 days/week, stable scores | Calm, focused | "Solid work this week" |
| Needs Support | <2 days/week or declining scores | Curious, encouraging | "Let's train together" |

**Hysteresis:** 3-session buffer before tier changes to prevent jittering.
Never use: "struggling", "behind", "catch up", "falling".

## Mastery System

### Per-Topic Mastery Tiers

| Tier | Requirement | Visual |
|------|-------------|--------|
| Not Started | No quizzes attempted | Grey |
| Familiar | 1+ quiz completed | Bronze |
| Practised | 3+ quizzes, avg 50%+ | Silver |
| Confident | 5+ quizzes, avg 70%+ | Gold |
| Mastered | 8+ quizzes, avg 85%+, recent activity | Diamond |

**Critical rule:** Never visually regress. Use invisible confidence decay:

```javascript
function confidenceAfterDays(initialConfidence, daysSincePractice, halfLife = 14) {
  return initialConfidence * Math.pow(0.5, daysSincePractice / halfLife);
}
// When confidence drops below 0.5, trigger Mastery Challenge
// Mastery Challenge = positively framed review quiz
// "Time to sharpen your skills!" not "You're losing progress!"
```

## Milestone Design

### Frequency
- **Micro-milestones:** every session (XP gained, questions answered)
- **Notable milestones:** every 3-7 sessions (level up, topic mastery tier)
- **Major milestones:** every 2-4 weeks (stage transition, evolution tier)

### Milestone Ceremony Pattern
1. **Anticipation** — progress bar filling, "almost there" signals
2. **Moment** — full-screen celebration, confetti, sound effect, character reaction
3. **Reward** — PP bonus, unlock announcement, rare currency (for major)
4. **Social signal** — visible to study group members

### Progressive Reveal Schedule

| When | What Unlocks | Visibility |
|------|-------------|------------|
| Day 1 | Theme, character creation, first quiz, PP | Active |
| Day 3 | Daily challenges | Visible-but-locked until then |
| Week 1 | First mini-game | Visible-but-locked |
| Week 2 | Study groups / friend invites | Visible-but-locked |
| Week 3 | Rare currency, first items to spend it on | Hidden until unlock |
| Week 4 | Boss battle (end of Stage 1/2) | Visible-but-locked |
| Week 6 | Hidden achievements start triggering | Hidden (always) |
| Week 8+ | New mini-game types, evolution stages | Hidden until unlock |

## The Dead Zone (Days 14-30)

This is where most educational apps lose users. Five countermeasures:

1. **Surprise Event Calendar** — limited-time double-PP challenges, mystery
   rewards. Deploy specifically during weeks 3-5
2. **Content Variety Injection** — new mini-game type unlocks, mode switches,
   narrative beats timed to this window
3. **Sawtooth Difficulty Reset** — drop difficulty, introduce a new topic at
   the dead zone point to restore competence feeling
4. **Dynamic Difficulty Adjustment** — auto-adjust after 3 consecutive
   successes (harder) or failures (easier) to maintain flow
5. **Re-Engagement Loop** — if child hasn't returned:
   - Day 1-3: no contact
   - Day 3-5: gentle notification
   - Day 7+: substantial reward nudge ("Your character has a surprise!")

## Returning Players

### Classification and Response

| Classification | Absence | Strategy |
|---------------|---------|----------|
| Active | 0-3 days | Standard progression |
| Lapsing | 3-7 days | Streak recovery + daily bonus |
| Lapsed | 7-30 days | "What you missed" summary + catch-up bonus PP (3 sessions) |
| Dormant | 30-90 days | Content preview + accelerated early progression |
| Dormant+ | 90+ days | Near-fresh start with credit for prior mastery |

### Principles for Return
- **Never punish absence** — character is happy to see them
- **Front-load rewards** — first session back should feel generous
- **Skip re-onboarding** — they know how to use the app
- **Provide quick wins** — easy quiz first to rebuild confidence
- **Re-establish the habit** — aim for 3 consecutive days

## Leaderboard Design

### Weekly Leaderboard (Monday Reset)

| What | Resets? | Drives |
|------|---------|--------|
| Total PP (lifetime) | Never | Character level, evolution, purchases |
| PP earned this week | Every Monday | Friend group leaderboard position |
| PP earned today | Every midnight | Daily progress bar |
| Journey stage | Never | Narrative position (1-7) |
| Quality tier | Rolling recalc | Character state (thriving/steady/support) |

### Weekly Rewards
- 1st place: bonus rare currency
- Top 3: temporary cosmetic (crown/badge, lasts 7 days)
- Everyone who hit weekly goal: participation reward

### Safety Rules
- Effort-based only (PP earned, never scores)
- 5-10 member groups maximum
- Never show last place
- Weekly reset so nobody is permanently behind

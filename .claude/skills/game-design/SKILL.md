---
name: game-design
description: |
  Game design system for the 11+ Prep App's gamification layer. Encodes best
  practices for children's educational game design (ages 8-11) across economy,
  progression, mini-games, characters, social features, sound, and UX.

  USE WHEN: Designing, building, or reviewing any gamification feature —
  character systems, mini-games, economy balancing, progression, social
  features, sound design, or reward mechanics.

  TRIGGER PHRASES: "game design", "mini-game", "character system", "economy
  balance", "progression curve", "gamification", "training points", "boss
  battle", "leaderboard", "study group".

  PROACTIVE: When writing code for any gamification feature, automatically
  check against the design principles and ethical guardrails in this skill.
---

# Game Design System

Design guidance for the 11+ Prep App gamification layer. All decisions grounded
in research (14 documents in `~/Documents/My Brain/content/Gamification/
Gamification Research/`). Never invent game design rules — reference this skill
or the research library.

## Agreed Design Decisions (Locked)

These 13 decisions were agreed with Ben. Do not revisit or contradict them.

| # | Decision | Choice |
|---|----------|--------|
| 1 | Currency | Keep PP as primary, add one rare currency |
| 2 | Animation tech | Prototype PixiJS and Rive before committing |
| 3 | Journey stages | 7 stages, percentage-based timing for all journey lengths |
| 4 | Streaks | Weekly goals (4/7 days), no daily guilt chains |
| 5 | Progressive reveal | Structural features visible-but-locked, bonus content hidden |
| 6 | Leaderboard | PP earned this week, Monday reset, small rewards for top spots |
| 7 | Boss battles | Available at stage transitions, encouraged, never blocking |
| 8 | Theme switching | Free anytime, no cost, progress carries over |
| 9 | Social scope | Built in from day 1, not bolted on later |
| 10 | Rare currency | Multiple earning paths (streaks, bosses, hidden achievements) |
| 11 | Mini-game difficulty | Tied to character skills, not separate difficulty levels |
| 12 | Parental consent | Email confirmation, tighten later if needed |
| 13 | Randomised rewards | Surprise content/experiences, never currency |

## Core Design Philosophy

**"Pull motivation, not push guilt."** Every mechanic should make the child
WANT to return, never make them feel bad for being away.

### Five Principles

1. **Learning IS the game** — quizzes are not a gate to fun, they ARE the fun.
   Every game mechanic feeds back to learning
2. **Protect the struggling learner** — a child getting 40% should feel
   supported, never exposed or punished
3. **Effort over ability** — reward showing up, trying hard, tackling weakness.
   Never reward being smart
4. **No guilt, no FOMO, no manipulation** — character never expresses
   disappointment. Returning is always welcomed
5. **The child should feel proud** — every session ends with something to be
   proud of, even a tough one

### Ethical Litmus Test

Before implementing ANY economy or reward mechanic, answer these five questions:

1. Would I explain this mechanic to the child's parent? (if not → manipulative)
2. Does this work if the child plays only 3x/week? (if not → coercive)
3. Does the child feel good when they STOP playing? (if not → manipulative)
4. Is the reward proportional to educational effort? (if misaligned → exploitative)
5. Can the child achieve everything meaningful through normal play? (if not → pay-to-win)

**If any answer is no, redesign the mechanic.**

## The Virtuous Circle

```
Quiz effort → Training Points → Character Skills → Mini-Game Performance
    ↑                                                        ↓
    ←←←← Kid feels the difference ←←←← Wants to earn more ←←
```

Every feature must strengthen this loop, never bypass it.

## Feature Architecture

### 9 Features (Priority Order TBD in Master Roadmap)

1. **Themed Journey** — 4 themes, character creation, 7-stage Hero's Journey
2. **Training Points Economy** — PP primary + rare currency, spend on character
3. **Mini-Games** — 5 reusable engines × 4 theme reskins = 20 games
4. **Character Evolution** — visual growth, 3 stats, 4 evolution tiers
5. **Boss Battles** — stage milestones, 60% weak topics / 40% strong
6. **Daily Challenges** — date-seeded, same for everyone, Wordle-style
7. **Social** — study groups, gifting, effort-based leaderboards
8. **Hidden Achievements** — 30 across 6 categories, playground buzz
9. **Tutor Mode** — group management, assignment setting, distribution channel

### Universal Data Model

Progress stored as abstract stages — themes are rendering layers only:

```
Universal Progression (points, stages, milestones, stats)
        ↓
Theme Renderer (narrative, language, visuals, audio)
        ↓
Character Renderer (avatar in theme context)
```

Adding a 5th theme = content job, not engineering job.

## Quick Reference: Key Numbers

### Economy
- **Earn-to-spend ratio:** 3:1 (earn 300 PP to buy a 100 PP item)
- **XP multiplier per level:** 1.10-1.20 (gentle, child-appropriate)
- **Currency cap:** 5-8× most expensive item
- **Inflation alert:** >12% weekly stockpile growth
- **Session earning cap:** diminishing returns after quiz 5 (50%), quiz 10 (25%)
- **Aspirational item:** 20-30 sessions to earn

### Progression
- **XP formula:** `base * level^1.8 * sigmoid_modifier`
- **Milestone frequency:** every 3-7 sessions
- **Dead zone:** days 14-30, deploy surprise events and content variety
- **Mastery tiers:** 5 levels (Not Started → Mastered), never visually regress

### Mini-Games
- **Session length:** 90-120 seconds per play
- **Character stat advantage:** 40-50% maximum (never trivialise)
- **Success rate target:** 70-80% (flow zone)
- **Timing windows:** 400-600ms default, 800ms tutorial, 100ms expert
- **Touch targets:** 48px minimum, 56-64px for gameplay
- **Tap preferred over drag** (68% of 8-11s prefer tap)

### Character
- **Stats:** 3 only (Speed, Accuracy, Knowledge) — not 5
- **Creation options:** 4-6 per category at launch, expand to 12-15 via unlocks
- **Evolution tiers:** 4 (Novice → Apprentice → Journeyman → Master)
- **Gender-neutral:** never ask gender, all options available to all

### UX
- **Session duration:** 20-25 minutes (warm-up / core / cool-down)
- **Button size:** 44-48px minimum
- **Typography:** 18-20px body, sans-serif, 1.5× line height
- **Navigation depth:** max 3 taps to content
- **Choices per screen:** 3-5 maximum

### Sound
- **Distinct sounds needed:** 15-18 for launch, 25-30 total
- **Frequency sweet spot:** 4-8kHz for reward sounds
- **Background music:** OFF by default
- **Tech:** useSound (effects) + Howler.js (music)

## Design Rules

### Never Do
- Binary win/lose — always continuous 0-100 scoring
- Use words: "fail", "wrong", "lost", "bad" — use growth language
- Show one child's scores to another — effort metrics only
- Daily streak chains — weekly goals only
- Loot boxes or randomised currency — surprise content only
- Punish absence — character never "suffers" from inactivity
- Gate learning behind payment — ever
- Front-loaded tutorials — teach by doing
- More than 3 character stats — cognitive overload
- Pure time-gating — effort-gate primarily

### Always Do
- Near-miss detection ("14 out of 15 — incredible focus!")
- Process praise ("Great effort!") over ability praise ("You're clever!")
- "Not yet" framing instead of failure language
- 3-channel feedback on every action (visual + audio + kinetic within 100ms)
- Welcome returning players warmly regardless of absence length
- Make every score earn something
- Test with Evie — no amount of design replaces a 9-year-old's reaction

## Detailed References

For implementation detail, consult these reference files:

| Reference | Covers |
|-----------|--------|
| `references/economy-design.md` | Currency formulas, spreadsheet methodology, sinks/faucets |
| `references/progression-design.md` | XP curves, stage design, dead zone, mastery, returning players |
| `references/mini-game-design.md` | 5 engines, state machine, game feel/juice, input, win/loss |
| `references/character-design.md` | Creation, stats, evolution, states, SVG layers, themes |
| `references/ux-and-safety.md` | Children's UX, onboarding, accessibility, dark patterns, regulations |

## Research Library

Full research (14 documents, 12,000+ lines):
`~/Documents/My Brain/content/Gamification/Gamification Research/`

Never invent game design principles. If this skill doesn't cover something,
check the research library. If neither covers it, flag to Ben that new research
is needed before proceeding.

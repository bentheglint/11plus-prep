# Mini-Game Design Reference

Detailed guidance for the 5 reusable game engines and their implementation.

## Five Game Engines

Each engine is a single React component accepting a theme props object.
No theme logic in engine code — all visuals come from the theme object.

### 1. Timing Bar
**Mechanic:** Tap as moving marker reaches the goal zone.
**Reskins:** Penalty Shootout (football), Rocket Launch (space), Spell Casting
(magic), Dance Move (pop)

### 2. Rapid Sort
**Mechanic:** Drag falling items into 2-3 categories; speed increases.
**Reskins:** Potion Brewing, Space Rescue, Kitchen Chaos, Garden Sorting

### 3. Pattern Memory
**Mechanic:** Reproduce a shown sequence; length increases each round.
**Reskins:** Dance Battle, Spell Sequence, Music Mix, Constellation

### 4. Target Tap
**Mechanic:** Tap good targets before they disappear; avoid bad targets.
**Reskins:** Bug Catcher, Treasure Hunter, Star Gazer, Spell Defence

### 5. Path Builder
**Mechanic:** Draw/trace correct path avoiding obstacles.
**Reskins:** Dragon Flight, River Crossing, Maze Runner, Circuit Board

## Shared State Machine

All mini-games use the same state flow:

```
IDLE → INTRO → READY → COUNTDOWN → PLAYING → RESULT → REWARD → IDLE
                  ↑                              ↓
                  ←←←←←←←← REPLAY ←←←←←←←←←←←←←
```

| State | What Happens |
|-------|-------------|
| IDLE | Mini-game not active |
| INTRO | Theme narrative establishes context (3-5 seconds) |
| READY | Awaiting player start tap |
| COUNTDOWN | 3-2-1-GO countdown |
| PLAYING | Active gameplay (90-120 seconds) |
| RESULT | Score display, near-miss detection, star rating |
| REPLAY | Option to retry (same conditions) |
| REWARD | Celebration animation + PP awarded + economy integration |

## Game Feel / Juice

Every player action needs multi-channel feedback within 100ms.

### Timing Reference

| Effect | Duration | Implementation |
|--------|----------|----------------|
| Squash/stretch | 50-150ms | Y scale down + X scale up |
| Screen shake | 50-300ms | 2-5px offset, random direction |
| Colour flash | 50-100ms | White/gold CSS filter |
| Scale pop | 150-300ms | 1.2-1.3× scale, spring easing |
| Particle burst | 300-800ms | 8-20 particles |
| Bounce/overshoot | 200-400ms | Spring physics |
| Glow/pulse | 1-2s loop | Attention draw |
| Hitstop/freeze | 30-80ms | Brief pause on impact |
| Slowdown | 200-400ms | 0.3× speed |

### Juice Calibration for Educational Context
- **DO:** Squash/stretch, scale pop, particles, colour flash, sound
- **MODERATE:** Screen shake (subtle only), slowdown (rare moments)
- **AVOID:** Excessive shake, strobe effects, overstimulation

## Character Stats → Mini-Game Performance

Three stats (Speed, Accuracy, Knowledge) affect gameplay:

| Stat | Earned By | Mini-Game Effect |
|------|-----------|------------------|
| **Speed** | Fast correct answers | Timing windows wider, markers slower |
| **Accuracy** | Answer streaks | Target zones larger, more observation time |
| **Knowledge** | Varied topic practice | Bonus scoring multiplier, hint availability |

### 40-50% Maximum Advantage Rule

A max-stat character should be ~40-50% more effective than base, never more.

**Example (Timing Bar):**
- Base target zone: 15% of bar → Max Speed: 22% (47% wider)
- Base marker speed: 100% → Max Speed: 80% (20% slower)

This means base-stat characters can still succeed through pure skill.
Stats provide comfort, not invincibility.

### Dynamic Difficulty Adjustment (DDA)

Runs silently — child never knows:
- After 3 consecutive wins: tighten timing by 10-15%
- After 3 consecutive losses: loosen timing by 10-15%
- Never adjust more than ±15% from baseline
- Reset DDA between sessions

## Scoring

### Continuous 0-100 Scale

No binary win/lose. Every play earns a score and a reward.

| Score Range | Tier | Feedback | PP Reward |
|-------------|------|----------|-----------|
| 0-29% | Bronze | "Keep practising — you're building skills!" | 10 PP |
| 30-49% | Bronze+ | "Getting stronger every time!" | 15 PP |
| 50-69% | Silver | "Solid effort — your training is showing!" | 25 PP |
| 70-84% | Gold | "Brilliant focus!" | 40 PP |
| 85-94% | Gold+ | "Outstanding performance!" | 55 PP |
| 95-100% | Platinum | "INCREDIBLE!" | 75 PP + rare currency chance |

### Near-Miss Detection

Mandatory for every engine. Examples:
- "14 out of 15 — incredible focus!"
- "Just 0.1 seconds off perfect timing!"
- "One more and you'd have had a perfect round!"

### Star Rating
- ★ = completed (any score)
- ★★ = 60%+ score
- ★★★ = 90%+ score
- Personal best tracked per mini-game per theme

## Input Design

### Touch Targets
- **Minimum:** 48px (UI elements)
- **Gameplay:** 56-64px (action targets during play)
- **Drag snap zones:** 15-25px magnetic snap

### Timing Windows
- Tutorial: 800ms
- Easy: 600ms
- Normal: 400-600ms (default)
- Hard: 200-400ms
- Expert: 100-200ms

**Preference data:** 68% of 8-11 year olds prefer tap over drag.
Default to tap mechanics. Use drag only when it adds meaning (sorting, path).

### Cross-Platform
- Touch-first design (tablet primary)
- Mouse/keyboard fully supported (desktop)
- No hover-dependent mechanics (touch has no hover)

## Win/Loss Language

### Never Use
"fail", "wrong", "lost", "bad", "missed", "game over", "you died"

### Always Use
Growth-oriented, narrative-framed language:
- "The dragon dodged!" (not "You missed!")
- "Nearly! You're getting closer!" (not "Try again")
- "That was a tough one — great effort sticking with it!"
- "Your character learned something from that challenge"

## React Component Architecture

```
src/gamification/mini-games/
├── engines/
│   ├── TimingBar.js          # Core engine component
│   ├── RapidSort.js
│   ├── PatternMemory.js
│   ├── TargetTap.js
│   └── PathBuilder.js
├── themes/
│   ├── penalty-shootout.js   # Assets, sounds, labels, palette
│   ├── rocket-launch.js
│   ├── spell-casting.js
│   └── ... (20 theme files total)
├── shared/
│   ├── GameStateMachine.js   # Shared FSM logic
│   ├── ScoreCalculator.js    # 0-100 normalised scoring
│   ├── JuiceEffects.js       # Visual/audio feedback utilities
│   ├── DDAController.js      # Dynamic difficulty adjustment
│   └── RewardBridge.js       # Mini-game → economy integration
└── MiniGameLauncher.js       # Entry point: picks engine + theme
```

## 15 Design Rules (Summary)

1. 90-120 seconds per play session
2. Mechanic and theme completely separate
3. 3-channel feedback (visual + audio + kinetic) within 100ms
4. No binary win/lose — continuous 0-100 score
5. Growth-oriented language only
6. Near-miss detection mandatory
7. Character stats give 40-50% advantage maximum
8. DDA runs silently (±10-15% after 3 consecutive results)
9. Tap-first input design (48-64px targets)
10. 400-600ms default timing windows
11. Personal bests over leaderboards
12. 3-star rating on every mini-game
13. Diminishing daily returns on PP earned from mini-games
14. Variable elements every playthrough (slight randomisation)
15. Every score earns something — no empty-handed exits

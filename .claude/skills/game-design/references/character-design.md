# Character Design Reference

Detailed guidance for character creation, stats, evolution, and theme switching.

## Character Creation

### Sweet Spots
- **4-6 options per category at launch**, expanding to 12-15 through unlocks
- Progressive disclosure: show basics first, unlock more as child progresses
- **"Surprise me" button** for indecisive children (random preset)
- Smart defaults so a child who taps through quickly still gets a good character

### Categories
1. **Face shape** — 4-6 presets
2. **Skin tone** — diverse range, slider or swatches
3. **Hair** — 6-8 styles, 8-10 colours
4. **Eyes** — 4-6 shapes
5. **Outfit** — theme-dependent, 4-6 starters per theme
6. **Accent colour** — personal colour that persists across themes

### Gender-Neutral Design (Non-Negotiable)
- Never ask gender
- All options available to all children
- No "boy" or "girl" categories
- Animal Crossing approach: style is expression, not identity

## Three Character Stats

Research shows 8-11 year olds can meaningfully track 3 stats, not 5.

| Stat | Display | Earned By | Affects |
|------|---------|-----------|---------|
| **Speed** | Lightning bolt bar | Fast correct answers | Timing windows, marker speed |
| **Accuracy** | Target/bullseye bar | Answer streaks | Target zones, observation time |
| **Knowledge** | Book/brain bar | Varied topic practice | Score multiplier, hints |

### Stat Display Rules
- Visual bars only, never raw numbers
- Always show progress toward next level
- Celebrate stat increases with character reaction
- Never show stat decrease (use invisible confidence decay)

### Stat → Mini-Game Mapping
See `mini-game-design.md` for the 40-50% advantage rule and specific
mechanical effects per stat.

## Four Evolution Tiers

Each tier has distinct visual changes across all themes:

| Tier | Name | Visual Changes | Earned At |
|------|------|---------------|-----------|
| 1 | Novice | Basic outfit, simple accessories | Start |
| 2 | Apprentice | Improved outfit, first special item | ~Level 10 |
| 3 | Journeyman | Distinctive outfit, environment upgrade | ~Level 25 |
| 4 | Master | Full regalia, aura effects, unique items | ~Level 50 |

### Evolution Ceremony
1. **Build-up** — progress bar fills to 100%, anticipation animation
2. **Transformation** — dramatic visual sequence (3-5 seconds)
3. **Reveal** — new appearance shown with celebration
4. **Comparison** — before/after side-by-side (optional)
5. **Social signal** — visible to study group members

### Theme-Specific Evolution Examples

| Tier | Football | Space | Magic | Pop |
|------|----------|-------|-------|-----|
| Novice | Sunday league kit | Cadet jumpsuit | Apprentice robes | Bedroom musician |
| Apprentice | Academy player | Pilot suit | Enchanted robes | Backup dancer |
| Journeyman | Pro kit + boots | Commander uniform | Wizard staff + hat | Stage performer |
| Master | Gold boots + captain band | Admiral + ship | Archmage + familiar | Headliner + pyro |

## 12 Character States

State machine drives character reactions. Priority system — highest active
state wins.

| # | State | Trigger | Animation | Duration |
|---|-------|---------|-----------|----------|
| 1 | Idle | No input 3+ sec | Breathing, blink, fidget | Loop |
| 2 | Attentive | Question shown | Lean forward, alert | Hold |
| 3 | Thinking | 10+ sec no answer | Chin hand, eyes up | Loop |
| 4 | Encouraging | 15+ sec hesitation | Nod, smile | 2s |
| 5 | Correct! | Right answer | Eyes light, thumbs up, jump | 1.5s |
| 6 | Streak 3+ | 3 correct in row | Energetic fist pump | 2s |
| 7 | Streak 5+ | 5 correct in row | Full excitement, sparkles | 3s |
| 8 | Wrong answer | Incorrect | Sympathetic, curious | 1.5s |
| 9 | Quiz complete | End of quiz | Celebration dance, confetti | 3s |
| 10 | Evolution | Milestone hit | Dramatic transformation | 5s |
| 11 | Welcome back | App reopen | Excited wave, happy bounce | 2s |
| 12 | Reading | Explanation shown | Pointing, "aha" moment | Hold |

### Critical Rule: Wrong Answer State
Character looks **puzzled or curious**, NEVER sad or disappointed.
The character is learning alongside the child, not judging them.
"Hmm, interesting!" not "Oh no!"

## SVG Layer Structure

Bottom to top compositing:

| Layer | Contains | States |
|-------|----------|--------|
| 1: Body | Base body shape | idle, bounce, walk, jump, dance |
| 2: Face | Expression | neutral, happy, thinking, surprised, proud |
| 3: Arms | Gestures | idle, wave, thumbs-up, fist-pump, point |
| 4: Effects | Overlays | none, sparkles, confetti, glow, evolution-aura |

Each layer blends independently. State machine inputs:
`isIdle`, `isThinking`, `answeredCorrectly`, `streakCount`, `evolved`, `currentMood`

### Tech Recommendation
- **Phase 1:** SVG layered system (leverages existing SVG skills)
- **Phase 2:** Rive state machines for animated reactions (if Phase 1 proves
  the concept and telemetry shows character engagement)

## Theme Switching

### Identity Hierarchy

| What | Switches? | Why |
|------|-----------|-----|
| Face, hair, skin, body | **NEVER** | This IS the character |
| Accent colour | **NEVER** | Personal identity marker |
| Stats, level, PP | **NEVER** | Earned through effort |
| Evolution tier | **NEVER** | Carries across themes |
| Outfit | YES | Theme expression |
| Accessories | YES | Theme-specific items |
| Environment | YES | Theme world |
| Narrative text | YES | Story framing |
| Audio | YES | Theme soundscape |

### Switching Experience
- Free, instant, no cost
- Short visual "transformation" animation (outfit morphs)
- "Your character is now a [theme role]!" celebration
- All earned items in previous theme remain accessible if they switch back
- Progress bar, stage, stats — all identical, just rendered differently

## Emotional Attachment — Ethical Guidelines

1. **Never use guilt or loss aversion** — character never "suffers" from inactivity
2. **Celebrate return, don't punish absence** — excited wave, not sad face
3. **No artificial scarcity** — all items earnable through genuine progress
4. **Transparent mechanics** — children and parents understand how growth works
5. **No social comparison on character quality** — journey is personal
6. **Positive attachment only** — character makes child feel capable and proud
7. **Full parental transparency** — parents see everything about the character

## The Proteus Effect

Research shows children perform better when their avatar looks competent.
This means:
- Even Novice tier should look **cool**, not shabby
- Evolution should feel like "even more awesome", not "finally acceptable"
- Never make lower tiers look deliberately bad to drive upgrades

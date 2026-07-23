# UX and Safety Reference

Children's game UX, onboarding, accessibility, dark pattern avoidance,
and regulatory compliance.

## Age-Appropriate UI (8-11 Year Olds)

### Specifications
- **Button size:** 44-48px minimum (56-64px for gameplay targets)
- **Typography:** 18-20px body, sans-serif, 1.5× line height, left-aligned
- **Navigation depth:** max 3 taps from home to content
- **Choices per screen:** 3-5 maximum (Hick-Hyman Law)
- **Colour:** cool tones for focus areas, warm tones for celebration moments

### Critical Insight
8-11 year olds **reject "babyish" design**. They want to feel grown-up.
Design should be clean and cool, not cartoonish or infantilising. Think
Minecraft's UI, not CBeebies.

## Onboarding

### Rules
1. **No front-loaded tutorials** — teach by doing, not telling
2. **Progressive disclosure** — one new feature per session
3. **First session = core loop only** — pick topic → answer → see score
4. **Scaffolded first action** — one clear button, immediate success
5. **Visual cues replace text** — pulsing buttons, arrows, not paragraphs
6. **Guidance fades** — as competence develops, hints disappear

### Session Structure
- **Warm-up (2-3 min):** Low-stakes, confidence-building, review mastered content
- **Core learning (15-20 min):** Adaptive difficulty, micro-feedback per question
- **Cool-down (2-3 min):** Results summary, celebrate effort, preview next session
- **Total target: 20-25 minutes**

### Flow Zone
- **Optimal success rate: 70-80%** — the Zone of Proximal Development
- Below 70% = discouraging, above 80% = boring
- Difficulty adapts: harder after 3+ correct, easier after 2+ wrong

## Feedback and Reinforcement

### Three-Channel Rule
Every significant action needs feedback across 3 channels within 100ms:
1. **Visual** — animation, colour change, particle effect
2. **Audio** — sound effect (correct ding, streak chime, level-up fanfare)
3. **Kinetic** — scale pop, bounce, or subtle movement

### Growth Mindset Feedback Language

| Instead of... | Use... |
|---------------|--------|
| "Wrong!" | "Not quite — let's look at this together" |
| "You failed" | "Not yet — you're getting closer" |
| "Try again" | "Have another go — you've got this" |
| "You're so clever!" | "Great effort on that one!" |
| "That's easy" | "You handled that really well" |
| "Game over" | "Round complete — let's see how you did" |

**Process praise over ability praise.** Celebrate effort, strategy, and
persistence — not innate talent.

## Sound Design

### Starting from Zero
The app currently has no sound. Phase it in:

| Phase | What | Tech |
|-------|------|------|
| P1 | Core effects (correct/wrong/streak/level-up/UI) | useSound (1KB) |
| P2 | Background music with controls | Howler.js |
| P3 | Theme-specific audio packs | Themed sound objects |
| P4 | Adaptive audio (music responds to gameplay) | Future |

### Key Rules
- **Background music OFF by default** — let children/parents choose
- **Frequency sweet spot: 4-8kHz** for reward sounds
- **Duolingo's intervals:** Major Third for correct, Tritone for wrong
- **15-18 sounds for launch**, 25-30 total
- **Every audio cue has a visual equivalent** — app works perfectly silent
- **Total audio budget: ~8KB JS + 6-13MB audio** (progressive loading)

### Theme Audio Identity
~10 universal UI sounds stay consistent. ~15-20 themed sounds swap per theme:
- Football: crowd roar, whistle, boot strike, stadium ambient
- Space: comm beep, thruster, airlock, cosmic ambient
- Magic: spell whoosh, crystal chime, cauldron bubble, mystical ambient
- Pop: beat drop, crowd cheer, mic feedback, studio ambient

## Accessibility

### Non-Negotiable Requirements
- **WCAG 2.2 Level AA** baseline
- **Dyslexia-friendly:** sans-serif, 1.5× line height, generous spacing
- **Colour blindness:** never rely on colour alone (8% of males affected).
  Always pair colour with shape, icon, or label
- **Full keyboard navigation** — every interactive element reachable
- **SVG diagrams:** descriptive alt text and aria-labels
- **Motor skill accommodation:** generous touch targets, no time-critical
  interactions required for learning (only for optional mini-games)
- **Audio has visual parallels** — every sound paired with visual feedback

## Parent Trust Signals

Seven things parents look for (in order of importance):

1. **Ad-free** — no banner, interstitial, or rewarded ads. Ever
2. **No in-app purchases accessible to children** — parental gate if any
3. **No dark patterns** — no FOMO, countdowns, or manipulative modals
4. **Transparent privacy policy** — plain language, not legalese
5. **No time pressure** — explore and learn at own pace
6. **Visible learning outcomes** — show what child learned, not just points
7. **Calm, non-overstimulating environment** — safe and focused

## Dark Pattern Avoidance

### What Constitutes a Dark Pattern for Children

**Financial:**
- Loot boxes, arbitrary currencies, limited-time offers, pay-to-win
- Hidden costs, subscription traps, in-game purchasing without parental gate

**Psychological:**
- Countdown timers creating urgency
- FOMO ("your friends are playing now!")
- Loss aversion (streak resets as punishment)
- Social pressure to spend or perform
- Guilt-inducing notifications

**Engagement:**
- Infinite scroll with no natural stopping point
- Anxiety-inducing notifications ("your character is lonely!")
- Addiction-designed reward schedules
- "Just one more" loops with no exit prompt
- Autoplay without consent

### Our Commitment
- Weekly goals, not daily chains
- Character never expresses disappointment
- Notifications are positive and optional
- Natural session endpoints (warm-up → core → cool-down)
- Surprise content, never surprise currency
- All meaningful content accessible through normal play

## Regulatory Compliance

### UK Children's Code (Age Appropriate Design Code)
- 15 standards — all applicable to our app
- Best interests of the child as primary consideration
- Data minimisation — collect only what's needed
- Default settings must be highest privacy
- Social features opt-in by default
- Parental consent for all users under 13

### COPPA (if US users)
- 2025 amendments with April 2026 compliance deadline
- Verifiable parental consent required
- No behavioural advertising to children
- Right to delete child's data on request

### Online Safety Act (UK)
- No open chat or messaging between children
- Preset messages only for any child-to-child communication
- Content moderation obligations if user-generated content exists
- Age verification requirements

### Enforcement Precedents
- TikTok: £12.7M fine
- Epic Games (Fortnite): £445M fine
- These are not optional compliance items

### Pre-Launch Checklist
1. [ ] DPIA (Data Protection Impact Assessment) completed
2. [ ] Privacy policy in child-friendly language
3. [ ] Parental consent flow implemented and tested
4. [ ] All social features opt-in by default
5. [ ] No free-text communication between children
6. [ ] Data minimisation audit complete
7. [ ] Right to deletion implemented
8. [ ] Age-appropriate default settings configured
9. [ ] No dark patterns (independent review)
10. [ ] No behavioural advertising
11. [ ] Accessibility audit (WCAG 2.2 AA)
12. [ ] Content moderation plan (if applicable)

# Economy Design Reference

Detailed guidance for the PP + rare currency dual economy.

## Currency System

### Primary Currency: Prep Points (PP)
- Earned through quizzes, daily challenges, streaks, boss battles
- Spent on character customisation, mini-game access, items
- Visible, always incrementing, the everyday "feel good" currency

### Rare Currency: (Name TBD)
- Earned through: milestone streaks (7/30/100 day), boss battle victories,
  hidden achievements
- Spent on: aspirational cosmetics, evolution unlocks, special items
- Scarce: 1-3 per week for a consistently active child
- Multiple earning paths so every play style has a route

## Formulas

### XP Progression Curve
```javascript
function xpForLevel(level) {
  const base = 80;
  const exponent = 1.8;
  const sigmoidMod = 0.7 + 0.3 * (1 / (1 + Math.exp(-0.2 * (level - 15))));
  return Math.round(base * Math.pow(level, exponent) * sigmoidMod);
}
```
- Early levels: 1-2 sessions to level up
- Mid-game: 2-4 sessions
- Late-game: 4-6 sessions maximum (never more)

### Diminishing Returns
```javascript
function earnMultiplier(quizzesCompletedToday) {
  if (quizzesCompletedToday <= 5) return 1.0;    // Full reward
  if (quizzesCompletedToday <= 10) return 0.5;   // Half reward
  return 0.25;                                     // Quarter reward
}
```

### Cost Scaling
```javascript
function itemCost(baseCost, tier) {
  const growthRate = 1.15; // 15% increase per tier
  return Math.round(baseCost * Math.pow(growthRate, tier));
}
```

## Four Pillars Framework

Every economy needs balanced faucets and sinks:

| Pillar | Definition | Our Examples |
|--------|-----------|--------------|
| **Sources (Faucets)** | Create resources from nothing | Quiz completion, daily login, streak bonus |
| **Drains (Sinks)** | Permanently remove resources | Avatar items, theme unlocks, consumables |
| **Converters** | Transform one resource to another | 100 PP → 1 rare currency (if needed) |
| **Traders** | Move resources between entities | Friend gifting |

**Balance equation:** Sum of Sources ≈ Sum of Sinks (per player, per time period)

## PP Earning Table

| Activity | PP Earned | Frequency |
|----------|-----------|-----------|
| Correct answer | 10 | Per question |
| First-attempt correct (no hints) | 15 | Per question |
| Hard topic correct | 20 | Per question |
| Quiz completion | 25 | Per quiz |
| Perfect quiz (100%) | 50 | Per quiz |
| Daily first session bonus | 30 | Once/day |
| Streak bonus | 10 × min(days, 7) | Daily |
| Daily challenge complete | 40 | Once/day |
| Boss battle victory | 100 | Per battle |
| Mastery challenge passed | 40 | Per challenge |

## Anti-Hoarding Mechanics

1. **Wallet cap** — 5-8× most expensive item
2. **Session earning cap** — diminishing returns after quiz 5
3. **Daily earning cap** — soft cap via diminishing returns
4. **Expanding sinks** — new items introduced as players accumulate
5. **Upgrade chains** — consume item + PP to upgrade rarity
6. **Consumable sinks** — "Double XP" tokens, hint tokens
7. **Collection sets** — complete 5-item set for bonus reward
8. **Weekly Showcase** — new featured items every Monday
9. **Gentle nudge** — "Your wallet is getting full! Check the shop"

## Economy Spreadsheet Methodology

Build this BEFORE coding. Four sheets:

### Sheet 1: Currency Sources (Faucets)
| Column | Purpose |
|--------|---------|
| Source Name | What earns PP |
| Trigger | When it triggers |
| Base Amount | PP per occurrence |
| Frequency | How often per session/day |
| Cap | Maximum per day |
| Expected Daily Yield | Calculated |

### Sheet 2: Currency Sinks (Drains)
| Column | Purpose |
|--------|---------|
| Item Name | What costs PP |
| Category | Cosmetic / consumable / upgrade |
| Price | PP cost |
| Sessions to Earn | How many sessions of play |
| Repeat Purchase? | One-time or consumable |

### Sheet 3: Player Simulation
Run 6 scenarios:
1. Daily Player (1-2 sessions/day)
2. Weekend Player (2-3 times/week)
3. Binge Player (5+ sessions one day)
4. Returning Player (2-week hiatus)
5. Completionist (tries to buy everything)
6. Week 1 vs Week 12 (engagement over time)

### Sheet 4: Progression Curve
| Column | Purpose |
|--------|---------|
| Level | 1-50+ |
| XP to this level | Formula-based |
| Cumulative XP | Running total |
| Sessions to level up | Calculated |
| Unlock at this level | What becomes available |

## Health Metrics

Monitor these post-launch:

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Weekly stockpile growth | <8% | 8-12% | >12% |
| % players at wallet cap | <5% | 5-15% | >15% |
| Days to first purchase | 1-3 | 4-7 | >7 |
| % players with nothing to buy | <10% | 10-25% | >25% |
| Grind wall (sessions to next meaningful item) | <5 | 5-8 | >8 |

## Ethical Guardrails

- No paid currency — ever. Both PP and rare currency are effort-earned only
- No loot boxes or randomised purchases
- No time-limited offers that create FOMO for children
- No pay-to-win dynamics in study groups
- Gifting is non-monetary encouragement items only (CMA/OFT rules)
- All items earnable through normal play (3×/week player can access everything)

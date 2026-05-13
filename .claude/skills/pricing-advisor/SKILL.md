---
name: pricing-advisor
description: |
  Ask the Pricing Advisor — a composite advisor drawing on a curated
  corpus of UK 11+ market pricing, wider UK kids' edtech pricing,
  global B2C edtech scale benchmarks, pricing strategy frameworks
  (Ramanujam, Campbell, Poyar, Rachitsky, Shah, Lemkin, Van Westendorp,
  Ariely), UK parent willingness-to-pay research (Sutton Trust,
  Mumsnet, IFS, EEF, DfE/NTP, UK press), and subscription mechanics
  (family plans, annual prepay, price increases, retention benchmarks,
  freemium conversion, B2B2C) — for advice on launch pricing, tier
  structure, free-tier scope, family plans, annual vs monthly,
  pricing surveys, schools licensing, and price increases for the
  11+ app.

  USE WHEN: User says "/pricing-advisor", "pricing advice", "what
  should I charge", "how should I price this", "ask the pricing
  advisor", "pricing council", "freemium vs free trial", "annual
  vs monthly", "family plan pricing", or any request for pricing
  / monetisation strategy advice grounded in expert voices and
  competitor data.

  Trigger phrases: "pricing-advisor", "pricing advice", "what should
  I charge", "ask the pricing council", "pricing strategy", "how do
  I price this".
---

# Pricing Advisor

Dispatch the user's pricing question to the composite Pricing Advisor
agent, which reads from a curated corpus of competitor pricing
snapshots, strategy frameworks, UK willingness-to-pay research, and
subscription mechanics, all organised by discipline.

## How it works

The Pricing Advisor is a **single composite agent** that draws on all
voices through discipline-routed retrieval — the same pattern as the
Marketing & Growth Council. Unlike the Tier 1 Council of EdTech Elders
(which spawns multiple individual agents in parallel), this advisor
synthesises insight from one focused corpus walk.

## Workflow

### Step 1 — Extract the question

The user's message (or the ARGUMENTS passed to this skill) is the
question. If the question is genuinely unclear (e.g. just "pricing"
with no target), ask for clarification before dispatching. Otherwise
dispatch immediately.

### Step 2 — Dispatch to the composite agent

Spawn a single Agent call:

```
Agent({
  subagent_type: "pricing-advisor",
  prompt: "<the question>"
})
```

Pass the user's question verbatim. Do not rephrase — the agent has its
own discipline-routing logic.

### Step 3 — Present the response

The agent's response will include:
- A `<retrieval-log>` block (audit trail — strip before showing user)
- Synthesised advice with multi-voice attribution
- Freshness flags on price citations older than 9 months from `last_verified`

Present the advice directly, stripping the retrieval-log. The agent
attributes by source name + venue in the body, which is already
user-friendly.

### Step 4 — Offer follow-ups

After presenting the advice, offer:
- "Want me to dig deeper into any of these voices / sources?"
- "Should I model the unit economics at the prices we just discussed?"
- "Want me to draft a Van Westendorp survey for a specific target segment?"

## The 6 disciplines the agent covers

1. **Direct UK 11+ market** — Atom Learning, CGP Books Online, Bond
   Online (and Century Tech tiers), ExamPapersPlus, Pretest Plus.
   Stub records for inactive products (11 Plus Lift, Smart Maths, Carol
   Vorderman's Maths Factor).
2. **Wider UK kids/parent edtech** — Mrs Wordsmith, Doodle Learning,
   Reading Eggs, Maths-Whizz, Tassomai, Twinkl, TTRS, Nessy.
3. **Global B2C edtech (scale benchmarks)** — Duolingo, Khan Academy,
   Brilliant, Babbel, Busuu, Prodigy Math, DragonBox/Kahoot Kids+,
   Yousician, Memrise.
4. **Pricing strategy fundamentals** — Madhavan Ramanujam (*Monetizing
   Innovation*), Patrick Campbell (ProfitWell), Kyle Poyar (OpenView),
   Lenny Rachitsky, Hiten Shah, Jason Lemkin (SaaStr), Van Westendorp
   PSM, Dan Ariely (anchoring/decoy/zero-price).
5. **UK parent willingness-to-pay** — Sutton Trust, Mumsnet, IFS, EEF,
   UK national press 2023–25, DfE/NTP statistics, Atom Learning
   published research, UK tutor platform hourly rates.
6. **Subscription mechanics + B2B2C** — Lenny on family plans, David
   Sacks on annual prepay, Lemkin and Campbell on price increases,
   Reforge retention benchmarks, Casey Winters on freemium conversion,
   Atom/TTRS/Doodle B2B2C models.

## Freshness rule

Pricing data decays fast. Each corpus file has a `last_verified` date
in frontmatter. The agent flags any price citation older than 9 months
with a "needs reverification" note. Disciplines 1–3 (competitor
pricing) should be re-gathered every ~6 months; disciplines 4 and the
methodology bits of 6 are evergreen.

## What this skill is NOT

- Not a substitute for talking to real parents — the highest-leverage
  pricing input is a Van Westendorp survey of 150 actual UK 11+
  parents, not a corpus walk. The corpus tells you what the market
  looks like; the survey tells you what your customers will pay.
- Not a unit-economics model — the corpus surfaces benchmarks
  (CAC, churn, conversion rates) but does not model your specific
  cost structure, gross margin, or runway. Pair with a separate
  unit-economics conversation.
- Not legal or tax advice on pricing structures.
- Does not cover B2B enterprise pricing for school MAT-level deals
  beyond the consumer-adjacent B2B2C examples in discipline 6.

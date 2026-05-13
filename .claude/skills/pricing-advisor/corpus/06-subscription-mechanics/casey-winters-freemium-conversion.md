---
name: Casey Winters / Freemium conversion
discipline: subscription-mechanics
last_verified: 2026-05-10
type: mechanic-or-pattern
---

## What this covers

Casey Winters is a growth advisor and partner at Reforge, with prior product and growth roles at Pinterest and Grubhub. Through Reforge's consumer subscription curriculum, he has articulated a framework for thinking about freemium-to-paid conversion that goes beyond the headline percentage and focuses on the sequential problem of activation: users cannot convert until they have first experienced the product's core value. This file documents the conversion rate benchmarks, the value-moment activation model, and what they imply for product design.

## The pattern / mechanic

**Benchmark conversion rates:**

The empirical consensus across multiple sources for freemium-to-paid conversion:

- **Consumer freemium (typical):** 2–5%
- **Consumer freemium (strong):** 5–7%
- **B2B SaaS freemium (typical):** 2–5%
- **B2B SaaS freemium (strong):** 5–7%
- **Free trial to paid (typical):** 15–25%
- **Free trial to paid (strong):** 25–40%

The gap between freemium (2–5%) and free trial (15–25%) is explained structurally: a free trial imposes a time constraint that forces a decision, while freemium does not. This is a deliberate architectural choice, not a performance gap — freemium trades conversion rate for reach (more users enter the funnel) while free trial trades reach for conversion (fewer users enter but more convert).

**The activation problem — "users must reach the treasure first":**

Winters' core contribution to the freemium literature is the framing of conversion as a sequential problem with a dependency: a user cannot decide to pay for something they have not yet experienced. He describes the product's core value as "the treasure" — the specific moment at which a user understands what they are paying for and why they would want it.

If a user churns before reaching the treasure, the conversion mechanic is irrelevant. The first job of freemium product design is therefore not "how do we ask for payment?" but "how do we ensure every user reaches the treasure as quickly as possible?"

This reframe has operational implications:
- Onboarding should be designed around treasure delivery, not feature introduction
- Paywall placement should come immediately after the treasure moment, not before it
- Free tiers should contain exactly enough value to demonstrate the product but not enough to satisfy the user's underlying need

**The Consumer Subscription Value Loop:**

Reforge frames freemium conversion as part of a three-stage loop:

1. **Value Creation** — delivering the core promise (in an 11+ context: a child improves measurably)
2. **Value Delivery** — making that improvement visible to the parent (progress reports, score deltas)
3. **Value Capture** — asking for payment at the moment the parent has seen the evidence

The loop framing is important because it identifies the conversion ask as the final step, not the first. Many edtech products fail freemium because they gate content before delivering any value — they ask for the credit card before showing the treasure.

**The 75% same-day activation finding:**

RevenueCat's 2024 data adds an empirical urgency to Winters' framework: more than 75% of trial starts occur on the same day as install. This means the window for treasure delivery is not days — it is the first session. Products that require multiple sessions to demonstrate value lose the majority of their potential converters before the conversion moment ever arrives.

**The timing asymmetry:**

Reforge and MKT1 analysis found that directing users to an "activation-first" landing page — one requiring completion of a core product action before seeing a pricing page — lifted freemium conversion from 2.8% to 4.9% (a 75% relative uplift). The mechanism: users who have completed a product action have experienced the treasure and are primed to pay for more.

**Freemium vs free trial for 11+ apps:**

The structural question is whether an 11+ app should use freemium (permanent free tier) or free trial (time-limited full access). The data suggests:

- Free trial is superior for conversion rate (15–25% vs 2–5%)
- Freemium is superior for reach and viral spreading
- The hybrid model — free trial of premium features, permanent free tier of core features — captures both benefits and is the dominant structure in successful edtech (see Duolingo, Kahoot, Khan Academy)

## Quotes / sources

"Users must reach the 'treasure' (value moment) before conversion is possible." — Casey Winters / Reforge, Consumer Subscription Growth curriculum

"Reforge's Consumer Subscription Value Loop frames this as a sequential activation problem." — paraphrase of Reforge blog

"Timing upgrade prompts to coincide with moments of high product value realization increased conversion rates by 32%." — Mixpanel A/B test data, cited in freemium conversion literature

"Directing users to an 'activation-first' landing page... lifted freemium conversion from 2.8% to 4.9%." — Reforge and MKT1 meta-analysis, 190 PLG companies

"More than 75% of trial starts occur on the same day a user installs an app." — RevenueCat, State of Subscription Apps 2024

## Applicability to UK 11+ app

The 11+ treasure moment is specific and identifiable: a child completing their first adaptive test and seeing a personalised gap analysis. This is the moment a parent understands that the app is not generic practice — it knows what their child needs. The entire free-tier experience should be designed to deliver this moment in the first session, after which the paywall appears naturally: "To continue working on your child's identified gaps, upgrade to Premium." Placing the paywall before this moment (as many edtech apps do) is the single most common cause of low freemium conversion in the category.

## Sources / URLs

- [Casey Winters — Reforge profile](https://www.reforge.com/profiles/casey-winters)
- [The Subscription Value Loop — Reforge blog](https://www.reforge.com/blog/the-subscription-value-loop-how-to-scale-consumer-subscription-businesses)
- [The Subscription Value Loop — Lenny Rachitsky newsletter](https://www.lennysnewsletter.com/p/the-subscription-value-loop-a-framework)
- [Freemium Conversion Rates — Meegle](https://www.meegle.com/en_us/topics/monetization-models/freemium-conversion-rates)
- [Free-to-Paid Conversion Rates Explained — CrazyEgg](https://www.crazyegg.com/blog/free-to-paid-conversion-rate/)
- [RevenueCat — State of Subscription Apps 2024](https://www.revenuecat.com/state-of-subscription-apps-2024/)

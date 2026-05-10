---
name: Lenny Rachitsky / Family plans
discipline: subscription-mechanics
last_verified: 2026-05-10
type: mechanic-or-pattern
---

## What this covers

Family plans are a specific variant of multi-seat subscription pricing where a household pays a single elevated fee in exchange for multiple individual accounts, each with full functionality. The mechanic is well-established in consumer subscription — Spotify, Apple, Microsoft, and Disney have all converged on a roughly similar architecture. This file documents the real-world pricing data for those reference products, analyses the per-seat maths that underlies the economics, and draws on Lenny Rachitsky's framing of when seat-based pricing works best.

## The pattern / mechanic

The family plan sits above the individual tier in price but dramatically below the cost of buying equivalent individual seats. The value exchange for the household is obvious; the value exchange for the provider is less obvious but equally real: higher ARPU per household, lower churn (the person who would cancel is held by the person who wants to keep it), and broader account penetration that cements switching costs.

**Current UK prices (verified May 2026):**

| Product | Individual / month | Family / month | Seats | Per seat (family) | Annual discount |
|---|---|---|---|---|---|
| Spotify Premium | £11.99 | £21.99 | 6 | £3.67 | ~17% (annual plan available) |
| Apple One | £18.95 (Individual) | £24.95 | 6 | £4.16 | Not applicable (monthly only) |
| Microsoft 365 | £7.99 (Personal) | ~£8.75/mo (£104.99/yr) | 6 | £1.46 | Annual billing only |
| Disney+ | £4.99 | N/A — household model | Household | N/A | ~15% annual |

Notes:
- Spotify Family requires all members to reside at the same address, verified via Google Maps. The plan rose from £19.99 to £21.99 in late 2025.
- Apple One Family bundles Apple Music, Arcade, TV+, and 200GB iCloud across six accounts — the individual tier offers 50GB. The storage uplift alone is often the deciding factor for tech-forward households.
- Microsoft 365 Family is annual-only at retail (£104.99/yr, discounted at third parties from £74.41). Price increases are expected from July 2026 following a 8–33% business-tier rise.
- Disney+ does not publish a formal "family plan" but prices the service as a household product implicitly.

**Per-seat economics:**

Spotify's family plan at £21.99 / 6 seats = £3.67 per seat. An individual plan is £11.99. The family plan delivers full Premium at 31% of individual cost per seat. The breakeven point (where you'd be better off on family) is at just 2 members: two individual plans = £23.98, family plan = £21.99.

This asymmetry is intentional. The provider gives up per-seat revenue in exchange for:
1. A higher total household payment than any single member would pay alone
2. Much lower churn — the subscriber is now serving a household, not just themselves
3. Account lock-in across multiple email addresses and devices

**Lenny Rachitsky on per-seat vs. usage-based pricing:**

Rachitsky draws on Patrick Campbell's research of 18,000+ SaaS companies to note that seat-based pricing "is a relic of the perpetual licence era when companies couldn't measure usage or value." He recommends seat-based models specifically when attribution is low and user autonomy is low — which describes most consumer edtech apps accurately.

The implication: family plans are the correct seat-based mechanism for consumer products where each learner's progress is personal, yet the paying decision-maker is a parent purchasing for their household.

## Quotes / sources

"With the full six members, it drops to just $3.67/person, saving over $111 per year compared to an Individual subscription." — Gamsgo.com pricing analysis, verified May 2026

"Per seat pricing is a relic of the perpetual license era." — Lenny Rachitsky, [Pricing your SaaS product](https://www.lennysnewsletter.com/p/saas-pricing-strategy)

"Your price is the exchange rate on the value that you're providing." — Patrick Campbell, Intercom podcast (cited in Lenny's pricing framework)

## Applicability to UK 11+ app

An 11+ family plan of £19.99–£24.99/month for up to three children would undercut Atom Learning's per-child cost significantly while raising ARPU above a single-child plan. The household-lock mechanic is particularly strong in the 11+ market: families often have multiple children in the prep window simultaneously, and a parent who has paid for child one will default to the same platform for child two. Pricing the family tier to make this frictionless — rather than billing per child — removes the moment of decision that could send them elsewhere.

## Sources / URLs

- [Spotify Premium UK — spotify.com/uk/premium](https://www.spotify.com/uk/premium/)
- [Spotify UK price increase — Billboard](https://www.billboard.com/pro/spotify-raises-prices-uk-individuals-family-plans-duo/)
- [Apple One — apple.com/apple-one](https://www.apple.com/apple-one/)
- [Microsoft 365 Family UK price 2026 — ukcosts.net](https://www.ukcosts.net/technology/microsoft_365.php)
- [Microsoft 365 July 2026 price increase — cloudswitched.com](https://www.cloudswitched.com/news/microsoft-365-price-increase-july-2026-copilot-uk-guide/)
- [Lenny Rachitsky — Pricing your SaaS product](https://www.lennysnewsletter.com/p/saas-pricing-strategy)
- [How much to discount prepaid SaaS contracts — Heap](https://www.heap.io/blog/how-much-should-i-discount-for-prepaid-saas-contracts)

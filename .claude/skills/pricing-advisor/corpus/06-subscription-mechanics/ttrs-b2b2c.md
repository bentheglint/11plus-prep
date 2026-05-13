---
name: Times Tables Rock Stars (TTRS) B2B2C
discipline: subscription-mechanics
last_verified: 2026-05-10
type: mechanic-or-pattern
---

## What this covers

Times Tables Rock Stars (TTRS) is the canonical example of low-price, high-volume B2B2C in UK primary edtech. Created by Bruno Reddy, a UK secondary maths teacher, and now part of the Discovery Education group, it has achieved near-ubiquitous penetration in UK primary schools through a pricing model that is aggressive almost to the point of implausibility: unlimited school access for £116.80/year, family access for £9.00/year. This file documents the verified pricing, the structural logic of the B2B2C mechanic, and what the TTRS model implies for subscription architecture in a different edtech category.

## The pattern / mechanic

**Verified TTRS pricing (May 2026 — direct from ttrockstars.com/purchase/):**

**School pricing:**

| Item | Price (excl. VAT) | Notes |
|---|---|---|
| Base school subscription | £116.80/year | Unlimited pupils and teachers at one school |
| Stats Bolt-On | +£40.15/year | Performance insights dashboard |
| Sessions Bolt-On | +£36.50/year | Homework assignment / task-setting |
| NumBots subscription | £94.90/year | If no active NumBots subscription |
| NumBots discount (if active) | –£10.95 off TTRS | Bundled discount |

Total with all add-ons: £116.80 + £40.15 + £36.50 = **£193.45/year** for full-featured school access. Still under £200 for unlimited pupils.

**Family pricing:**

| Item | Price (incl. VAT) | Notes |
|---|---|---|
| Family subscription | £9.00/year | 3 children + 2 adult accounts |
| Paper worksheets | Not included | Schools only |

**The critical note on plan relationship:**

School subscriber children do not need a family plan. A child whose school has a TTRS subscription uses the school-issued login. The family plan is for children at schools without a subscription, or for holiday / supplemental use. This design choice is fundamental: it means the school subscription is not in competition with the family plan — it is upstream of it. Schools that subscribe generate a pool of families who are already users, some of whom will purchase family plans for additional access or after leaving the school.

**Per-pupil economics:**

The £116.80 school price divided across pupil populations:

| School size | Pupils | Per-pupil cost |
|---|---|---|
| Small primary (100 pupils) | 100 | £1.17/pupil/year |
| Medium primary (200 pupils) | 200 | £0.58/pupil/year |
| Large primary (400 pupils) | 400 | £0.29/pupil/year |

At £0.29–£1.17 per pupil per year, TTRS is effectively free from a school budget perspective. This is a deliberate pricing strategy: at this price point, the purchase decision does not require head teacher sign-off or budget committee approval — a year group lead can fund it from discretionary budget.

**The family plan as retention infrastructure:**

At £9.00/year (75p/month), the TTRS family plan is not primarily a revenue line — it is a relationship maintenance tool. Families who pay for it are signalling genuine engagement; the price is low enough that the payment itself does not cause churn. The model works because TTRS's revenue comes overwhelmingly from schools, not families: even at 50,000 family subscriptions, the family plan generates £450,000/year. The school base generates far more.

**Volume and penetration:**

TTRS does not publish subscriber counts publicly, but it is estimated to be used by over 3 million children in the UK — implying thousands of school subscriptions. The product's penetration was achieved primarily through teacher word-of-mouth and the free trial structure, not paid marketing.

**Discovery Education acquisition:**

In 2022, TTRS was acquired by Discovery Education, the US edtech giant. This has not changed the pricing model materially but has added institutional sales infrastructure. The core B2B2C mechanic predates the acquisition and was built entirely by a solo founder with no external funding.

## Quotes / sources

"UNLIMITED PUPILS AND TEACHERS — £116.80 per year" — Times Tables Rock Stars purchase page, verified May 2026

"Family plan: £9 per year — INCLUDES 3 CHILDREN & 2 ADULT ACCOUNTS" — Times Tables Rock Stars purchase page, verified May 2026

"If your child's school has a subscription to Times Tables Rock Stars, your child will be able to log in using the account their teacher has created for them, so you may not need to pay separately." — TTRS support documentation

## Applicability to UK 11+ app

The TTRS model is instructive but not directly replicable for an 11+ app: TTRS's content (times tables) is a curriculum staple needed by every primary school; 11+ preparation is a specialist product needed by a subset. The school price point (£116.80 for unlimited pupils) is appropriate for a mass-market curriculum tool but probably too low for a specialist product that requires more ongoing content investment. A more appropriate B2B school price for 11+ would be £200–£350/year for unlimited pupils in Year 5/6 — capturing the TTRS logic of "below budget committee threshold" while reflecting the specialist nature of the content. The £9/year family plan mechanic is less applicable; an 11+ family plan at £9/year would not generate meaningful revenue and would undermine the positioning of the home subscription tier.

## Sources / URLs

- [Times Tables Rock Stars purchase page — ttrockstars.com/purchase/](https://ttrockstars.com/purchase/) (verified May 2026)
- [TTRS families page — ttrockstars.com/families/](https://ttrockstars.com/families/)
- [TTRS schools page — ttrockstars.com/schools/](https://ttrockstars.com/schools/)
- [Times Table Rockstars Reviews 2026 — edtechimpact.com](https://edtechimpact.com/products/times-table-rockstars/)

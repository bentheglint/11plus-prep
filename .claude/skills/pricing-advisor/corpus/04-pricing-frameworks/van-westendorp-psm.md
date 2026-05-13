---
name: Van Westendorp Price Sensitivity Meter
venue: classic methodology
discipline: pricing-frameworks
last_verified: 2026-05-10
type: framework-or-method
---

## Who / what

The Price Sensitivity Meter (PSM) was developed by Dutch economist and market researcher Peter Van Westendorp and published in 1976. It is a survey-based methodology for identifying the psychologically acceptable price range for a product from the buyer's perspective, without requiring the researcher to name a specific price or run a trade-off experiment. It has remained relevant for 50 years because of its simplicity — four plain-English questions, no specialist analysis software required — and because it captures something competitors like conjoint analysis do not: the price thresholds at which buyer psychology shifts qualitatively (from "acceptable" to "suspicious" in both directions). It is widely used in market research, pricing consultancies, and product teams, and is specifically recommended by Patrick Campbell and others as a practical early-stage tool.

## Core ideas (their key beliefs / frameworks)

- **Price perception is bounded by two types of failure, not one**: most founders think about "too expensive" as the risk. Van Westendorp identifies a second failure: "too cheap" — a price so low that buyers question product quality. Both boundaries matter, and they are independent of each other.
- **Price acceptability is a range, not a point**: the PSM defines an "acceptable price range" (APR) between the lower and upper psychological boundaries. Pricing anywhere in the APR is broadly acceptable; pricing outside it triggers one of two failure modes.
- **Four distinct price thresholds exist for any product**:
  1. *Too cheap*: triggers quality doubt.
  2. *Cheap / bargain*: perceived as good value.
  3. *Expensive / high side*: still possible but requires thought.
  4. *Too expensive*: no longer considered.
- **The method works by aggregating population responses**: any individual's thresholds are imprecise, but the cumulative distribution of 100–200 respondents produces reliable price sensitivity curves.
- **Respondents systematically understate prices**: because direct questioning about price induces anchoring and social desirability bias, actual price tolerance is typically somewhat higher than PSM results suggest. This is a known limitation.
- **PSM is exploratory, not final**: it produces a price range and relative positions within it. It does not directly model demand curves, predict volume at a given price, or account for competitive pricing. It should be combined with purchase-intent questions (the Gabor-Granger extension) for demand estimation.

## Method / how to apply

**Step 1 — Write the four survey questions**

Present respondents with a clear product description, then ask:

1. **Too cheap (quality doubt)**: "At what price would you consider this product priced so low that you would question the quality?"
2. **Cheap / bargain**: "At what price would you consider this product to be a bargain — a great buy for the money?"
3. **Expensive / high side**: "At what price would this product start to feel expensive, but you would still consider buying it?"
4. **Too expensive**: "At what price would this product be so expensive that you would not consider buying it?"

Collect open numeric responses. Order the questions from cheapest-perception to most-expensive-perception (questions 1 and 2 before 3 and 4) to reduce anchoring.

**Step 2 — Collect responses**

Recommended minimum: 100–200 respondents from your target customer segment. For a consumer app, recruit via user testing panels, social media, or a beta waitlist survey.

**Step 3 — Plot cumulative frequency distributions**

For each of the four questions, calculate the cumulative percentage of respondents who gave that price or lower (for "too cheap" and "cheap") or that price or higher (for "expensive" and "too expensive"). Plot all four curves on the same x-axis (price range) and y-axis (% of respondents).

Invert the "too cheap" and "cheap" curves so they slope upward left-to-right. The four curves will produce intersections.

**Step 4 — Identify the four key intersection points**

| Intersection | Name | Meaning |
|---|---|---|
| "Too cheap" × "Expensive" | Point of Marginal Cheapness (PMC) | Lower bound of Acceptable Price Range |
| "Cheap" × "Expensive" | Indifference Price Point (IPP) | Where equal numbers see price as cheap or expensive |
| "Too cheap" × "Too expensive" | Optimal Price Point (OPP) | Minimises both "too cheap" and "too expensive" rejection |
| "Cheap" × "Too expensive" | Point of Marginal Expensiveness (PME) | Upper bound of Acceptable Price Range |

The **Acceptable Price Range** runs from PMC to PME. The **Optimal Price Point** sits within this range and represents the price with the lowest combined rejection from both extremes.

**Step 5 — Extend with purchase intent (optional but recommended)**

Add a fifth question at one or more price points within the APR: "At a price of £X, how likely are you to purchase this product?" (5-point scale from "definitely not" to "definitely yes"). This Gabor-Granger extension gives approximate demand curve data that pure PSM does not provide.

**Known limitations**
- No competitive context: respondents evaluate the product in isolation.
- No demand volume prediction.
- Systematic understatement of price tolerance due to direct questioning.
- Unreliable for genuinely novel products where respondents have no price anchor.
- Does not directly maximise revenue or profit — the OPP minimises rejection, not maximises margin.

## Quotes

- "Van Westendorp surveys are so simple that even kids can complete them." — SurveyMonkey, *How to Use the Van Westendorp Price Sensitivity Meter*
- "The Van Westendorp price sensitivity meter will generate for you an acceptable range of prices for your target market." — Conjointly PSM documentation
- "Despite newer techniques like conjoint analysis, the Van Westendorp price sensitivity meter's versatility and ease of use keep this strategy relevant." — SurveyMonkey PSM guide
- Original publication: Van Westendorp, P. (1976). "NSS-Price Sensitivity Meter (PSM) — A new approach to study consumer perception of price." *ESOMAR Congress Proceedings*, Venice.

## Applicability to a UK 11+ app at pre-launch / early-launch stage

Van Westendorp is the right first pricing survey for a pre-launch 11+ app: it takes 15 minutes to build, 2 weeks to field via a parent community or beta waitlist, and produces a defensible price range before a penny of development budget is committed to a pricing page. A founder would recruit 150–200 parents of 9–11-year-olds and ask the four questions with a brief product description. The output will likely reveal: a "too cheap" threshold that confirms pricing below ~£5/month signals a toy rather than a serious revision tool; an acceptable price range; and whether parents split into two WTP clusters (indicating a tiered pricing model is warranted). The known limitation — that the method ignores competitive context — is manageable: the UK 11+ tutoring market has widely known price anchors (tutors at £30–50/hour, Atom Learning at ~£29.99/month) that can be referenced in the product description to calibrate responses.

## Sources used

- [Van Westendorp PSM — Wikipedia](https://en.wikipedia.org/wiki/Van_Westendorp%27s_Price_Sensitivity_Meter)
- [Van Westendorp methodology — Conjointly](https://conjointly.com/products/van-westendorp/)
- [How to Use the Van Westendorp PSM — SurveyMonkey](https://www.surveymonkey.com/market-research/resources/van-westendorp-price-sensitivity-meter/)
- [Van Westendorp — Quantilope](https://www.quantilope.com/resources/examples-of-van-westendorp-price-sensitivity-questions)
- [Van Westendorp pricing guide — OpinionX](https://www.opinionx.co/blog/van-westendorp-pricing-guide)
- Van Westendorp, P. (1976). "NSS-Price Sensitivity Meter (PSM)." ESOMAR Congress, Venice.

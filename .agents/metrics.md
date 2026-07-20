# PrepStep Metrics Snapshot

**Snapshot date:** 2026-07-20
**Purpose:** Real current-state numbers for `marketing-plan` and all marketing skills. Pulled from live sources (Stripe live mode, prod D1). Refresh commands at the bottom. Numbers marked **⚠GAP** still need a source wired.

## North Star
**Goal 1: 100 paying monthly subscribers. Goal 2: 1,000.**
**Current paying subscribers: 0.**

## Revenue (source: Stripe, live mode — `acct_1TV98g1xjLxHcNtg` "PrepStep")
- **Active subscriptions: 0.**
- **MRR: £0.**
- Customers on file: 1 — `ben+stripe@venortech.com` (Ben's own test customer).
- Subscriptions ever: 1, status `canceled` (Ben's own test).
- **Read: pre-first-paid-conversion. No real customer has paid yet.**

## Funnel / accounts (source: prod D1 `11plus-user-data`)
| Metric | Value | Note |
|---|---|---|
| Total accounts | 38 | includes founder/test/comped |
| Comped accounts | 9 | free full-access (FSM/friends/test) |
| Accounts linked to a Stripe customer | 1 | Ben's own |
| subscription_status = null | 37 | on free tier / lapsed trial |
| subscription_status = canceled | 1 | Ben's own test |
| Children (end users) | 34 | ~0.9 per account |
| Tutors signed up | 6 | channel exists |
| Tutor invites sent | 1 | **channel essentially dormant** |

**Derived:**
- Real (non-comped, non-founder) paying customers: **0**.
- Trial → paid conversion: **0 / (all trials so far)** — no paid conversions yet.
- Tutor channel: 6 tutors onboarded but only 1 invite link ever sent → the B2B2C loop is built but not yet driving families.

## Traffic / top-of-funnel (source: Cloudflare Web Analytics, via `scripts/pull-cf-traffic.mjs`)
**Last 30 days (prepstep.co.uk prod hosts, both site tags aggregated):**
- **Pageviews: 930 · Visits: ~540/month.** (90-day: 1,910 pageviews, 1,260 visits.)
- **Top pages:** `/` 770 · `/join/VHJ5-DRN3` 150 (a tutor referral link — Colette's) · `/join/47BP-K563` 10 (test). **No `/practice` SEO page in the top 20.**
- **Referrers:** direct/none 490 · internal (prepstep.co.uk/www) ~390 · **Google 30 + Bing 20 ≈ 50 search-referred/month.**
- **Geo:** GB 820, US 100 (likely bots/non-target), CA 10.
- **Device:** desktop 550, mobile 330, tablet 50 (desktop-heavy → much of this is founder/tester, not cold parents who skew mobile).

**Read:** the top of funnel is **near-zero for cold acquisition.** Most traffic is direct/internal/founder. Real stranger-discovery via search is ~50 views/month despite the `/practice` programmatic-SEO build → **SEO is not yet pulling** (indexing/ranking/click problem — to diagnose with `seo-audit`). The one non-homepage page with real traffic is a **tutor join link** (150 views from a single tutor), yet only 1 tutor invite has ever been sent → the tutor/referral channel is the most proven lever and is barely switched on.

> **⚠OPS CORRECTIONS surfaced (fix in CLAUDE.md):**
> 1. The analytics site tag documented in CLAUDE.md (`798fdc0…`) is **stale/wrong** — it collects nothing.
> 2. prepstep.co.uk collects under **two** live Web Analytics site tags (`ec5299682ab546c18a47cbfa29cc5fbb`, `aa7bd4c8287c40cd9dfb02efcb077a68`) — a duplication that fragments the dashboard. **Consolidate to one beacon** and confirm which the live site embeds.

## Honest read for the marketing plan
The baseline is **zero paying customers and a very small top of funnel** (38 total accounts). This is a **0 → 1 → 100 paid** problem: prove the first handful of *cold* (non-friend) paid conversions, then make acquisition repeatable. Retention and referral loops (progress card, Prep Together) matter later — they multiply a paying base that does not exist yet. Current priority order: **top-of-funnel acquisition + trial→first-paid conversion**, not loop optimisation.

## Sources & refresh
- **Stripe (paid subs, MRR):** Stripe MCP → `GetSubscriptions {status:active}`, `GetCustomers`. (Live mode.)
- **D1 (funnel):** from `workers/ai-tutor/`:
  `npx wrangler d1 execute 11plus-user-data --remote --command "SELECT subscription_status, COUNT(*) FROM accounts GROUP BY subscription_status"`
  (+ counts for children, tutors, tutor_invites, is_comped).
- **Cloudflare traffic:** `node scripts/pull-cf-traffic.mjs 30` (token in gitignored `scripts/.metrics.env`; account `d2ab95cc…`, prepstep site tags `ec5299…` + `aa7bd4…`). Aggregates both tags, prod hosts only.
- **Cadence:** refresh before each `marketing-plan` run and monthly thereafter.

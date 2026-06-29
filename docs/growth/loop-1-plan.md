# Loop 1 Plan — Freemium Tier + Public SEO/AEO Surface + Email Conversion Engine

**Status:** DRAFT for adversarial review (Codex) → then Sonnet implementation, phase by phase.
**Date:** 29 Jun 2026
**Owner decisions locked:** strategy, freemium line, AEO scope (see `My Brain/.../session-2026-06-29-11plus-prep.md` and memory `project_11plus_growth_strategy`).

## 0. Strategy context (one paragraph)
The growth engine = twin DISCOVERY channels (SEO + AEO) → a permanent FREE TIER (retain non-converters as users + nodes) → a personalised EMAIL conversion engine (monetise) → later amplified by Loop 2 (shareable child-progress artefact) + Loop 3 (close the ~80%-built tutor B2B2C loop). This plan delivers the foundation + Loop 1 + the conversion engine. AEO is built INTO the SEO surface at near-zero marginal cost — it's a compounding early bet (~0.29% of referral traffic today but elite-quality and growing fast), NOT a co-equal traffic channel yet.

## 1. Phasing & dependencies
- **Phase 0 — Freemium tier rework (FOUNDATION).** Everything depends on it.
- **Phase 1 — Public SEO/AEO static practice surface.**
- **Phase 2 — Email conversion engine extension.**
- **Phase 3 — Measurement + profiles (light, parallel; green-lit off-site #1/#2).**
Implement and verify each phase before the next. Phase 0 is the highest-risk (touches the live paywall/entitlements) and must get the hardest scrutiny.

## 2. Relevant current-state facts (from 29 Jun codebase recon)
- CRA 5, **no router**; single `currentView` state in `src/App.js`; Cloudflare Pages SPA catch-all `public/_redirects` = `/* /index.html 200`. **Static files in `public/` are served first and take precedence** (proven by existing `/help`, `/terms`, `/privacy` html). → static-generated pages need NO router and don't touch the SPA bundle.
- Worker (`workers/ai-tutor/`) is a separate deploy on its own subdomain; owns zero Pages routes.
- Question data: `{ name, topics: { <key>: { name, questions: [] } } }` in `src/questionData/{maths,vr,english}Data.js`. Standard Q = `id/difficulty/question/options[5]/correct/explanation/visual?`. Non-standard: `passage` (English comprehension), `pick-from-sets` (VR synonyms/antonyms/analogies/oddTwoOut). Explanations are plain text ending `✓` (static-renderable). ~14% of Qs carry `visual: {component, props}` (SVG React components in `src/microLessons/visuals.js`) — NOT plain-HTML renderable without a Node-side React render.
- Topic labels: `src/components/RecommendationCard.js` `topicNames` + `workers/ai-tutor/lib/topicLabels.js` `TOPIC_LABELS`.
- Email: Resend in `workers/ai-tutor/routes/email.js`; trial lifecycle (Day 1/7/14/21/25/28/30, 06:00 UTC Cron, bypass opt-in) + weekly progress email (Sun 18:00 UTC Cron, respects `email_opt_in`). The weekly email ALREADY computes per-topic weakness via `question_results GROUP BY topic_key HAVING COUNT(*)>=5 ORDER BY accuracy ASC`. Unsubscribe is mailto-only (no programmatic endpoint).
- Consent: `accounts.email_opt_in INTEGER` (parents default opted-in; tutors opt out).
- Data for weakness signals: `question_results` (child_id, question_id, topic_key, subject, is_correct, difficulty, attempted_at, selected_answer), `quiz_results` (child_id, topic_key, subject, score, total, quiz_mode, completed_at), `topic_performance`, `mock_test_results`.
- SEO baseline: robots allows all; NO sitemap, NO JSON-LD, NO canonical, NO og:image.
- **Verify real question counts with `node scripts/count-content.js` before planning page volumes** (recon grep diverged from CLAUDE.md — likely passage artefact).

## 3. The locked free/paid line
- **FREE (permanent, post-30-day-trial):** one ~10-Q **mixed Daily Learning set per day** (renewable, no roll-over, streak-eligible) · streaks/prep points/achievements · **basic** progress (overall accuracy, streak, count) · public SEO/AEO pages.
- **PAID:** unlimited practice · Focused Learning (targeted, any topic + micro-lessons) · Mock Tests + readiness bands · adaptive layer · AI Tutor · **deep** My Progress (mastery breakdown, trajectory, weakness map). Tutor Mode stays free.
- 30-day full-access trial stays in front of all of this.

---

## Phase 0 — Freemium tier rework (FOUNDATION)
**Goal:** replace the post-trial hard paywall with a permanent free tier + basic/deep feature gating, server-authoritative.

**Approach**
- Introduce an explicit account state machine: `trial` (full, ≤30d from `created_at`) → `free` (permanent) → `paid` (subscribed) / `comped`. Today, a non-trial non-subscriber hits the hard `SubscribeScreen`; we reroute that state to the free-tier home with limited entitlements.
- **Entitlement check, server-authoritative** (in the Worker, derived from `accounts` trial/subscription/comp state). The client reflects entitlements but must not be the source of truth for gating.
- **Daily-set cap WITHOUT new schema:** derive "sets used today" by counting Daily-Learning `quiz_results` rows for the child where `completed_at` is within the current UTC day. Cap = 1/day for free users. (Confirm UTC-day reset is acceptable vs local time — UTC is simplest + server-authoritative.)
- **Gate paid features** (Focused Learning, Mock Tests, deep My Progress, AI Tutor) behind `paid|trial|comped`; free users see a contextual upgrade prompt at the gate (the conversion moment).
- **Preserve the day-1 trial "treasure"** (pricing-advisor's activation flag): the first trial session must surface a weakness/gap insight ("the app knows what my child needs"). Verify this still fires; enhance if thin.

**Acceptance criteria**
- [ ] A post-trial non-subscriber lands on the **free tier home**, not the hard paywall.
- [ ] A free user can start **exactly one** Daily Learning set per UTC day; it renews next day; the streak counts.
- [ ] A free user attempting Focused Learning / a Mock / deep My Progress / AI Tutor is **blocked with an upgrade prompt**; basic progress (accuracy, streak, count) remains visible.
- [ ] Gating is **server-authoritative** — a tampered client cannot unlock paid features or extra sets.
- [ ] **Existing trial and paid/comped users are unaffected** (regression test on entitlement resolution + the subscribe/billing flow).
- [ ] Day-1 trial weakness "treasure" moment verified present.

---

## Phase 1 — Public SEO/AEO static practice surface
**Goal:** build-time-generated, crawlable practice pages optimised for Google AND answer engines, served from `public/practice/` via the existing `deploy.sh`.

**Approach**
- **Generator script** (Node, build-time, e.g. `scripts/generate-practice-pages.js`, wired into the build before `deploy.sh` upload): reads `questionData` + `topicLabels`, emits static HTML into `public/practice/`.
- **Taxonomy (hub-and-spoke):** `/practice` (root hub) → `/practice/<subject>` (subject hub) → `/practice/<subject>/<topic>` (leaf). Region/exam-board hubs (Kent/Bucks/Trafford/…) = fast-follow, not v1.
- **Leaf page content:** a factual, **front-loaded** topic intro (what the topic is + GL context + the key citable claim), a curated set of sample questions **with full worked explanations**, internal links to sibling topics + the subject hub, and a prominent **"Start practising free"** CTA into free-tier signup.
- **Visuals:** render `visual` components to **inline static SVG at build time** via `ReactDOMServer.renderToStaticMarkup` (the diagrams are unique, crawlable, AEO-friendly content). *Decided:* in scope, but **phaseable** — if a given component proves fiddly to render headless, that page falls back to text-only questions; ship the surface either way.
- **On-page SEO/AEO:** JSON-LD `Organization` + `SoftwareApplication` + `FAQPage` + `Article`; front-loaded citable claims; external citations where natural; clean sequential `h1→h2→h3`; `<link rel=canonical>`; meta + OG tags; a generated **`sitemap.xml`** referenced from `robots.txt`.
- **robots.txt (DECIDED):** allow **both** training and retrieval AI crawlers on the public surface (we want model awareness; the full 8,244-bank stays behind auth, only samples are exposed), plus Googlebot/Bingbot. Add sitemap reference.
- **Content authoring rule (project):** sample questions are EXISTING bank content (fine to reuse). Any **NEW prose** (topic intros, FAQ answers, a comparison page) must be **Oracle-authored, not Claude-authored**. Comparison/competitor claims must be **re-verified** before publish (Atom 5-day trial / Bond 7-day / mock gating — volatile).
- **Safety:** static pages are separate HTML — they do NOT touch the CRA bundle or the iOS 15.6 floor; the bundle-compat + freshness deploy guards are unaffected. Confirm `_headers`/`_redirects` don't interfere with the new paths.

**Acceptance criteria**
- [ ] `/practice`, `/practice/<subject>`, `/practice/<subject>/<topic>` serve real HTML; a `curl` of a leaf page shows the **question text + explanations present in the served HTML** (not JS-injected).
- [ ] JSON-LD validates (Rich Results / schema validator); `FAQPage` + `SoftwareApplication` present.
- [ ] `sitemap.xml` generated, lists all practice URLs, referenced in `robots.txt`; robots allows the intended crawlers.
- [ ] Each leaf page has a working **"Start free" CTA** into signup; internal hub-and-spoke links resolve.
- [ ] Pages generated within the existing build/`deploy.sh`; **no router added; CRA bundle untouched; passes bundle-compat + iOS floor**.
- [ ] Visual questions render inline SVG in static HTML (or cleanly fall back to text-only on that page).
- [ ] All NEW prose Oracle-authored; comparison claims re-verified + dated.

---

## Phase 2 — Email conversion engine (extend existing Resend system)
**Goal:** personalised weakness→upgrade lifecycle emails to free-tier parents — the monetisation layer.

**Approach**
- **Reuse** `routes/email.js`, Resend, the Cron scheduler, `email_opt_in`, and the existing per-topic weakness SQL.
- **New free-tier segment** + a **personalised "weakness → upgrade" email:** names 2–3 real weak topics from the child's `question_results`, **teases** the gap, and sells the exact paid fix (Focused Learning / Mocks / deep My Progress). **Seasonal intensity ramp** toward September.
- **Tone guardrail:** supportive-coach, "here's how to help [Child] get ahead" — **never** alarmist child-deficit framing. Parent recipient; child **first name only**.
- **Honesty guardrail:** the free signal is coarse (mixed/shallow dose) → email teases a pattern; the paid product gives the precise diagnosis. Do **not** over-claim precision.
- **Consent:** these are MARKETING emails → **must respect `email_opt_in`** (unlike activation-critical trial emails). 
- **Close the unsubscribe gap:** add a programmatic **one-click unsubscribe endpoint** (List-Unsubscribe-Post One-Click) — required for scaled sending deliverability (Gmail/Yahoo) and compliance.
- **Copy authoring:** email copy is marketing prose (not question content) → Claude may draft, but tone must be reviewed given the child-weakness sensitivity.

**Acceptance criteria**
- [ ] A free user with ≥ threshold attempts across topics receives a personalised email naming **real** weak areas + an upgrade CTA to the matching paid feature.
- [ ] Tone reviewed as supportive (not alarmist); parent recipient; first name only; no precision over-claim.
- [ ] **Respects `email_opt_in`**; paid users do NOT receive the upgrade nudge.
- [ ] **One-click programmatic unsubscribe** works end-to-end (header + endpoint), opt-out persists.
- [ ] Seasonal ramp logic verified.

---

## Phase 3 — Measurement + profiles (light, parallel; green-lit #1/#2)
**Approach**
- **GA4:** enable the native "AI Assistant" channel group + a custom Explore segment with regex `chatgpt\.com|chat\.openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com`.
- **DIY share-of-answer:** a 10-prompt template ("best 11+ app UK", "PrepStep review", "Atom Learning alternative", "11+ apps Year 5", …) run monthly across ChatGPT/Perplexity/Claude/Gemini/Copilot, logged in a spreadsheet. Optional free HubSpot AEO Grader baseline.
- **Profiles (#1):** create/claim accurate, dated **Trustpilot / Crunchbase / App-Store** entries (factual; double as the fix for AI silence/misinfo).

**Acceptance criteria**
- [ ] GA4 AI segment live; baseline captured.
- [ ] Prompt-log template created + first run logged.
- [ ] Trustpilot/Crunchbase/App-Store profiles created with accurate, dated info.

---

## 4. Parked decisions (non-blocking; Ben decides per item, anytime)
Off-site AEO: **#3** credible "best 11+ app" listicles · **#4** Mumsnet genuine presence (strict no-promo rules — the question is *how*, not *whether*) · **#5** Wikipedia/Wikidata entity (needs notability first) · **#6** press / independent review mention. None block the build.

## 5. Technical calls already made (noted, not open)
- robots: allow both training + retrieval crawlers on the public surface.
- visuals: build-time SVG render, with per-page text-only fallback.
- daily-cap reset: UTC day, derived from `quiz_results` (no new schema).
- phasing: 0 → 1 → 2, with 3 in parallel.

## 6. Cross-cutting risks
- **Billing/entitlement regressions** (Phase 0) — protect existing subscribers/trial; server-authoritative gating; regression tests.
- **Content authoring** — NEW prose = Oracle, not Claude (project rule). Sample questions = existing bank (fine).
- **Truth in comparison claims** — re-verify competitor facts before any public claim; brand + AEO risk.
- **GDPR** — marketing emails respect opt-in; child data minimised (first name only, parent recipient).
- **Deploy discipline** — frontend only via `bash deploy.sh`; `git fetch` before deploy; the new generator must run inside that flow, not a manual build.
- **Count verification** — run `node scripts/count-content.js` before finalising page volumes.

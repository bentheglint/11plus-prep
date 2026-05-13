---
title: Launch Readiness Plan — what's left between the post-incident hardening and a public launch
date: 2026-05-04
status: DRAFT — to be sequenced item-by-item with senior-dev + codex review per the locked codex process
companion-work:
  - plans/process-gates-plan-v2.md (Plan A v2.1, shipped 1 May)
  - plans/data-resilience-layer-1-plan.md (Layer 1, shipped 4 May)
trigger-context: |
  After the 27 April D1 cascade-wipe, two streams of work shipped:
    Plan A v2.1 — operational gates that prevent us repeating the mistake
    Layer 1   — data resilience that survives Cloudflare-level failure
  Together they fixed the data-loss class of failure. This plan covers the
  rest of what's between us and a credible public launch — legal,
  security, payment robustness, observability, and lifecycle plumbing.
review-policy: |
  This plan as a whole stays at high level (this file). Each blocker gets
  its own focused plan — drafted, senior-dev reviewed, codex reviewed,
  built — per the locked codex process (memory: feedback-codex-process.md).
  No item ships without going through that gate.
---

# Launch Readiness Plan

## Goal

Take the 11+ app from "operates safely with 6 friend-and-family accounts"
to "can credibly accept paying customers from the open internet" without
the kinds of legal, security, or operational gaps that would cost us
money, trust, or regulatory standing.

## Scoping principle

For each item below: would I let my own daughter's data be processed by
this app today, in this state, at scale? If the answer is "only because
I trust the operator personally" rather than "because the system is
defensible to a stranger" — the item is a blocker.

## Blockers (cannot launch publicly without)

These are the items where shipping without them either (a) breaks UK
law, (b) creates an unbounded financial liability, or (c) makes a
single mistake catastrophic.

### B1 — Legal documents (Privacy Policy + ToS + Cookie consent)

**Why blocker:** UK GDPR requires lawful basis + transparent privacy
notice. The Age Appropriate Design Code (AADC) imposes 15 standards on
services likely used by children, including a Data Protection Impact
Assessment, age-appropriate transparency, and high-privacy defaults.
Cookie consent is required under PECR.

**Acceptance:**
- [ ] Privacy Policy drafted, reviewed for AADC compliance, published at /privacy
- [ ] Terms of Service drafted, includes liability cap + child consent handling, published at /terms
- [ ] Cookie consent banner active on first visit; categorises cookies; remembers choice; lawful basis recorded
- [ ] DPIA (Data Protection Impact Assessment) document drafted for AADC self-assessment
- [ ] Footer + signup flow link to all of the above

**Effort:** 1-2 days drafting from templates + senior-dev review. Then
each subsequent code change checks "does this affect what's documented in
the privacy notice?" and updates the notice + DPIA accordingly.

### B2 — Multi-tenant authorization audit

**Why blocker:** The 27 April incident touched data integrity (rows
went away) but not data isolation (rows belonging to family A being
visible to family B). Both are catastrophic; this one is invisible
until it isn't, and recovery from a confidentiality breach is harder
than recovery from a data loss.

**Acceptance:**
- [ ] Every D1 query path in workers/ai-tutor/routes/ traced — confirmed each enforces child_id scope from the Clerk-authenticated user, no global queries reachable
- [ ] Worker integration tests added that authenticate as user A and confirm 404/403 on user B's child_id
- [ ] Senior-dev review of the auth boundary
- [ ] Codex adversarial review focusing on: missing child_id checks, IDOR vulnerabilities, mass-assignment in PATCH/POST endpoints

**Effort:** 2-3 days. May surface real bugs.

### B3 — Production error monitoring

**Why blocker:** We have backup-failure alerting (just shipped). We
do NOT have application-error alerting. Today, if a kid clicks a button
and the Worker throws a 500, nobody knows. Launching publicly without
this means the first sign of a bug is a parent complaining — instead of
a dashboard.

**Acceptance:**
- [ ] Sentry (or equivalent) project provisioned, scoped to one of: free hobbyist tier, or single-developer paid tier
- [ ] Worker errors reported with request context (path, user id, child id) — without leaking PII
- [ ] React errors reported with component stack + user context
- [ ] Alert routing: Resend email to RESEND_TO_EMAIL on first occurrence of a new error class
- [ ] Documented "how to triage a Sentry alert" runbook

**Effort:** 1-2 days. Sentry's React + Workers setup is well-trodden.

### B4 — Stripe webhook idempotency + reconciliation

**Why blocker:** Stripe webhooks fire duplicates and out of order. Without
idempotency, a single payment can:
  - Fail to extend access (webhook lost in transit, retry succeeds but
    we treated the retry as already processed)
  - Double-charge if we naively replay
  - Leave us silently inconsistent with Stripe's view of the world

**Acceptance:**
- [ ] All webhook handlers in workers/ai-tutor/routes/stripe.js use Stripe's event id as an idempotency key (already partially in place; audit + extend)
- [ ] `processed_operations` table records every event; duplicates are no-op
- [ ] Periodic (daily?) reconciliation job: pulls Stripe's view of active subscriptions, compares to our D1, alerts via Resend on any divergence
- [ ] Failure handling: if our D1 write fails after Stripe charge succeeded, the next reconciliation must heal the gap

**Effort:** 2-3 days. The reconciliation job is the trickiest part.

### B5 — Account hardening

**Why blocker:** All defence-in-depth (Plan A v2.1 + Layer 1) collapses
if any of Cloudflare / Stripe / Clerk / GitHub / Resend accounts is
compromised. None of them currently have audited 2FA + secret rotation
policy.

**Acceptance:**
- [ ] 2FA on Cloudflare account (TOTP + recovery codes printed)
- [ ] 2FA on Stripe account
- [ ] 2FA on Clerk dashboard
- [ ] 2FA on GitHub
- [ ] 2FA on Resend
- [ ] 2FA on Backblaze B2
- [ ] All recovery codes stored in password manager + paper backup
- [ ] Secret rotation policy documented: cadence, owner, where new keys go (a one-page playbook, not enforced automation — this is a 1-person project)

**Effort:** half day.

### B6 — GDPR data-subject rights flow

**Why blocker:** UK GDPR Articles 15-22 require timely response to
data-subject requests (access, rectification, erasure, portability,
objection). Without a documented + tested flow, a single SAR (subject
access request) becomes a fire drill.

**Acceptance:**
- [ ] Self-serve "Delete my child's account" flow in the parent dashboard. Soft-delete with 30-day undo grace, then hard-delete via cascade.
- [ ] Self-serve "Download all my child's data" flow producing a JSON or CSV bundle
- [ ] Documented internal process for parent emails requesting access/erasure (covers cases the self-serve UI doesn't handle)
- [ ] Privacy Policy (B1) describes both the self-serve flow and the manual fallback

**Effort:** 1-2 days. Most of the heavy lifting is UI; the underlying
DELETE-cascade is already in place.

## Should-have at launch

Not strict blockers but launching without them looks unprofessional or
creates avoidable parent-support load.

### S7 — Email infrastructure live

**Why important:** The dormant cron in `workers/ai-tutor/wrangler.toml`
needs to be lit up. Without email there's no signup verification, no
password reset, no payment receipts, no weekly progress emails for
parents, no failure-handoff to a human path. Resend is already set up
(see Layer 1 plan).

**Highest leverage single item** — unblocks most other parent-facing work.

**Acceptance:**
- [ ] Worker cron fires weekly Sunday 18:00 UTC, sends parent progress email per child (matches existing wrangler.toml schedule)
- [ ] Account-lifecycle emails wired: signup verification (if not handled by Clerk), password reset, account-deletion confirmation, payment receipt
- [ ] Email templates: warm, on-brand, AADC-compliant for kids' content
- [ ] Unsubscribe link + preference centre (regulatory + good practice)

**Effort:** ~1 day for the technical wiring; ~1 more day for templates and copy.

### S8 — Support contact path

`help@prepstep...` (or whatever domain you go with) + a contact form
on the site. ~half day.

### S9 — Mobile UX polish

`brand-assets/mobile-audit/` exists in the repo (4 PNG screenshots from
~3 weeks ago). Audit + remediate. ~2-5 days.

### S10 — Accessibility (WCAG AA)

Children with disabilities, parents using assistive tech. UK AADC
consideration. ~2-4 days for audit + fixes.

### S11 — Stripe Customer Portal

Self-serve subscription management. Mostly out-of-box from Stripe.
~half day.

### S12 — Status page + uptime monitor

UptimeRobot / Better Stack free tier. ~half day.

## Later (post-launch is fine)

- Load test at 10× current scale (worth doing once you have ~100 paying users)
- Structured logs + business metrics (DAU, completion rates, churn)
- Stripe Tax automation (after ~£20k MRR)
- Multi-currency / i18n (after UK proves out)
- A/B testing infra (needs real traffic)
- Customer-feedback ingestion pipeline (the existing Google Sheet works at this scale)

## Recommended sequence

The order matters because dependencies cascade.

1. **B1 Legal docs** — first, because drafting them forces clarity on every data practice and surfaces policy gaps in code (e.g. "we say we delete data within 30 days but we don't have a job that does that"). They're also a checkpoint Stripe / Clerk / Cloudflare may eventually review.
2. **B2 Multi-tenant auth audit** — second, because the cost of getting this wrong is the highest of anything on the list. Run senior-dev + codex pressure on the auth boundary.
3. **B3 Production error monitoring** — third, because you want it observing every subsequent change in the launch sprint.
4. **S7 Email infrastructure live** — fourth, because it unblocks B6 (deletion confirmations), B4 (payment receipts), S8 (support replies), and several should-haves.
5. **B4 Stripe webhook idempotency** + **B6 GDPR rights flow** — in parallel, different code paths.
6. **B5 Account hardening** — half day, slot in any time.
7. **S8-S12** — final pre-launch sprint, in parallel with whatever soft-launch / closed beta you're running.

## Per-item review process (LOCKED)

Per `feedback-codex-process.md`:

For each blocker (B1-B6):
1. Draft a focused plan at `plans/launch-<item>.md`
2. Senior-dev review → revise to v2 if pushback
3. Codex adversarial review → revise to v3 if needed
4. Build with TDD where applicable
5. Verify per the global feature verification protocol (acceptance criteria checked end-to-end)

Should-haves (S7-S12) can ship on a lighter process: brief plan +
single round of senior-dev OR codex (not both). They're recoverable if
buggy at launch.

## Estimate

- 6 blockers × ~1.5 days average = ~9 days of focused work
- 6 should-haves × ~1.5 days average = ~9 days of focused work
- Plus review-cycle overhead (senior-dev + codex per blocker) = ~1-2 days

Cumulative: **3-5 weeks to launch-ready, single-developer**, working
items mostly serially. Faster if individual items can run in parallel
(e.g. legal drafting can happen while the auth audit is in progress).

## What this plan does NOT cover

- The actual marketing launch (audience, channels, content, pricing).
  See `~/Documents/My Brain/content/11plus-marketing-strategy-v3.md`.
- Beta / closed-launch user-acquisition strategy.
- Post-launch operational scale (separate work, see "Later" section).

## Decision rule (per blocker, after build)

After each blocker ships:
- If it surfaced a real risk we didn't know about: log the lesson; consider whether it changes other items
- If senior-dev or codex found a class of issue (e.g. "you have IDOR in 3 places"): expand scope to find the rest
- If the item turned out trivial: revisit whether it was over-engineered, but trivial-with-good-process is better than complex-with-bad-process

# Prep Together (Growth Loop 3) — v2 Plan

**Status:** DESIGN-COMPLETE, **BUILD + DEPLOY DEFERRED** to the start of the next
11+ prep cycle (Ben's call, 19 Jul 2026: launching ~2 months before an exam is
the wrong window — see "Why we are deferring"). Reviewed 19 Jul by Codex
adversarial review (16 challenges) and senior-dev (verdict: push back →
addressed below). Design decisions taken with Ben in-session.
**Owner:** Claude orchestrates; Sonnet builds slices when we un-defer;
senior-dev re-gates the money-path slice before it is built.
**Council input:** Marketing & Growth Council, 19 Jul (Hatvany/Atom,
Longton/Mumsnet, Reddy/TTRS, Chaudhary/ClassDojo, Fishkin/SparkToro,
Wadhar/KidCoachApp). Load-bearing constraints, not decoration.

---

## Goal

The parent-to-parent acquisition loop the progress card was not. An existing
PrepStep parent invites a friend's family to prepare for the 11+ **together**;
both families get a **banked month of full access** when the invited family
converts to paid. Frame is coalition ("let's get them in together"), not
advocacy and not a cash bounty.

---

## Why we are deferring build + deploy (seasonal economics)

The reward is "a free month of prep". Its value is entirely seasonal, and so is
the willingness to onboard a friend. Launching ~2 months before an exam fails
on both sides:

- **Reward value collapses.** A free month handed out now is either free access
  at peak need (revenue we would otherwise have earned) or a reward that lands
  after the exam, when the family no longer needs PrepStep at all.
- **Supply collapses.** No parent onboards a friend's child onto a serious prep
  tool eight weeks before the test. The recipient has no runway.

Both point to the same window: **launch at the START of a prep cycle**, when a
fresh cohort is gearing up (Ben's "nearer September" read), a free month is
genuinely valuable, and an invited family has months of runway to prep and
convert. Deferring also lets us harden the money-path properly instead of
rushing a payments feature.

**ACTION before un-deferring:** ask the 11+ Oracle for the GL parent
prep-intent seasonal curve, and pin the launch to the front of that wave rather
than eyeballing a date.

---

## The reframe this is built on

- **Rivalry is real but narrow and local, and is NOT why our earlier loops
  failed.** Hatvany built Atom Learning on parent WOM in the same zero-sum UK
  grammar market; parent WOM demonstrably works here.
- **The earlier loops failed on CURRENCY, not rivalry.** The cash bounty (+3%)
  was transactional and "seen through" (Longton, Reddy) and tripped Fishkin's
  discount trap; the progress card centred the child and tripped Longton's
  competitive-parenting taboo.
- **Coalition is the motive; generosity is the wrapper.** Parents actively want
  their child's close friends to get in too (so they go to school together).
  That positive pull, wrapped in a gift that benefits the recipient's child,
  beats the narrow residual rivalry cost.

**Design rule: lead with coalition, whisper the reward.** Ben's user read
(accepted): these parents will not nag a friend to pay (socially mortifying);
they send it because they want the other child to get in, and only notice the
reward once the friend has actually converted. So pay-gating does NOT create a
nagging problem for this demographic. (It does still create a refund/abuse
problem, handled below.)

---

## Design decisions (locked with Ben)

1. **Name:** Prep Together.
2. **Reward = a banked 30-day full-access credit. NO Stripe money.** Uniform for
   all parties and billing states. Collapses ~5 of the review blockers (annual
   semantics, Stripe/D1 atomicity, balance-credit liability, pounds-drift). For
   an actively-paying parent the month simply banks and takes effect if/when
   their subscription lapses.
3. **Trigger = the invited family's FIRST paid conversion**, which fires the
   reward for BOTH families, regardless of the sender's own billing state at
   that moment. (Pay-gated, Ben's call. ASSUMPTION flagged: sender need not
   already be a payer — confirm.)
4. **Two-sided**, delivered to the sender as a warm surprise thank-you, not a
   dangled carrot.
5. **v1 excludes any shared-PROGRESS experience** (children's-data disclosure +
   comparison landmine). The "together" is emotional, never data-shared.
6. **Launch at prep-cycle start** (see deferral section).

---

## v2 scope (the flow)

### 1. Trigger (the value moment — the 90%)
Invite prompt surfaces after a genuine value moment FOR THE PARENT (candidate:
first full mock + parent report; or sustained multi-week activity), never as a
permanent CTA or a brag artefact. Copy (British English, no em dashes, reward
second):
> "Know a family sitting the 11+ too? Get ready together. Invite them to prep
> alongside [child], and if you both stick with it you each get a month on us."

### 2. Invite surface (reuse card share plumbing)
Mints `/together/CODE` + a pre-written warm message steered at the right
relationship ("a friend whose child is also prepping, someone you'd love them to
go to school with"). Native share sheet on phone; wa.me + copy on desktop.
Reuses `src/utils/progressCardExport.js`.
**Privacy (Codex 1):** the child's name must NOT appear in the public share
message or on the public landing. Use "your family / their family". The child's
name may only appear in surfaces the authenticated sender sees.

### 3. Recipient landing `/together/CODE` (value-first, trust transfer)
- Trust transfer is the SENDER's first name (the sender is disclosing their own
  identity, which is their choice), NOT the child's: "A friend invited your
  family to get ready for the 11+ together." No child name pre-auth (mirrors
  AuthGate's existing pre-auth privacy stance).
- Value-first, not a signup wall (the /card learning): what PrepStep is, 2-3
  proof points, a taste of free practice, then Start-free CTA.
- Coalition code persists through Clerk signup (reuse tutor-funnel pattern) but
  via a SERVER-SIDE first-touch claim (see 4), not the client carrier alone.

### 4. Attribution (server-side first-touch — Codex 9)
The reused `/join` carrier is NOT first-touch: `AuthGate` overwrites
`pending-join-code` on mount and `join_intents` selection is most-recent. So:
- New table `coalition_referrals` (senderAccountId, recipientAccountId, code,
  status, createdAt, convertedAt, rewardedAt, reversedAt). Additive CREATE
  TABLE, playbook-safe class (like `join_intents`).
- On the recipient's account creation, make a **first-touch claim** as early as
  possible with a schema constraint (e.g. UNIQUE on recipientAccountId) so a
  later code cannot replace the first. Existing account = ineligible.
- Keep coalition attribution SEPARATE from the `heard_about` self-report survey
  (Codex 15): do not overload `heard_about='coalition'` given its write-once
  semantics and fixed vocabulary. Referral attribution lives in
  `coalition_referrals`.

### 5. The reward primitive — single, banked, Stripe-independent
(Senior-dev 4/5/6, Codex 2.)
- **One primitive: `accounts.bonus_access_until` (timestamp).** Not a
  ledger-sum inside `resolveEntitlements` (which must stay a pure function over
  one account row). A grant computes it atomically as
  `max(now, trial_end, existing bonus_access_until) + 30d` — the `trial_end`
  term stops a credit granted mid-trial from silently overlapping and wasting
  the still-running account-age trial (senior-dev 6). Stacks correctly for a
  super-connector.
- **Entitlement ladder:** add a full-access step in
  `workers/ai-tutor/lib/entitlements.js` that grants full access when
  `now < bonus_access_until`, placed BELOW `paid`/`grace`/backstop (so it can
  never double-grant over an active sub) and ABOVE `free`. New reason code.
- **Load path + schema parity (senior-dev risk):** `bonus_access_until` must be
  added to the account SELECT in `routes/account.js`, the hand-written worker
  test schema, AND `schemaParity.test.js`, all in the same slice — or we repeat
  the 12 Jun column-drift outage.
- **Audit ledger (separate from resolution):** a `reward_grants` table records
  every grant/reversal for reconciliation and finance, with
  `UNIQUE(referral_id, party)` so a re-run cannot double-grant. The ledger is
  for audit; `bonus_access_until` is the enforcement value.

### 6. Reward trigger + eligibility predicate (Codex 7/8, senior-dev 2/3)
- Fire on exactly ONE Stripe event type for the recipient's first real payment.
  The current handler shares an `invoice.paid` / `invoice.payment_succeeded`
  branch (`stripe.js`); isolate reward eligibility to one, and dedupe by
  invoice/subscription/referral, not only webhook `event.id`.
- **Eligibility predicate (explicit):** subscription-linked; correct
  customer/account; first eligible invoice for that subscription; positive cash
  collected (`amount_paid > 0`, guard `billing_reason`); within the attribution
  window (proposed 90d); not a proration/credit-note artefact.
- **Idempotent + recoverable:** claim via a single atomic conditional UPDATE
  (`SET status='rewarded' WHERE status='converted'`, act only if
  `changes === 1`), never read-then-write. Reward grant path is idempotent
  INDEPENDENTLY of the `stripe_webhook_events` dedupe row (which claims
  `event.id` before processing and would otherwise swallow a retried
  half-failed grant — senior-dev 2). Add a **reward-reconciliation sweep**
  (mirroring `reconcileSubscriptions`) that finds `rewarded` rows with no
  matching `reward_grants` ledger entry and repairs them.

### 7. Refund / chargeback clawback (kept, because pay-gated — Codex 5, senior-dev 1)
Because the trigger is a real payment, add reversal handling:
- Handle `charge.refunded` and `charge.dispute.created`: if the triggering
  invoice is reversed, claw back the **unconsumed** portion of both parties'
  rewards (shorten `bonus_access_until` back toward its pre-grant value; ledger
  the reversal; set `coalition_referrals.reversedAt`).
- Severity is low because the reward is banked access, not cash, but the
  handler prevents systematic farming. Alternatively/additionally consider
  granting on the recipient's SECOND successful invoice (proves retention,
  clears the easy-refund window) — decision flagged.

### 8. Edge senders (Codex 12)
- **Comped sender:** already has full access above all tiers and is blocked from
  paying; a banked access-month is meaningless. Either exclude comped senders
  from the symmetric promise or give a different token. Copy must not promise
  "you each get a month" to a party for whom it is meaningless.

---

## Explicitly OUT of v1 (deliberate)
- Any shared-PROGRESS experience between families (children's-data disclosure +
  comparison landmine — a separate, gated, later decision).
- Ongoing coalition features (shared countdown, mutual encouragement).

## Abuse / cost control (Codex 10/11, senior-dev)
- "New account only" is not a sufficient boundary: account deletion frees the
  email (Codex 10). Add canonical-email + deletion-history checks; consider
  sender/recipient payment-identity signals where available.
- **Soft cap / review threshold** on pending reward exposure per sender (Codex
  11): the "no cap" v1 stance is revised — a threshold that flags for review
  before issuing further rewards. Cheap because reward is access, but bound it.
- Every grant + reversal ledgered for financial visibility.

## GDPR / retention (Codex 13)
Decide whether `coalition_referrals` and `reward_grants` are personal data,
financial records, or both, and design deletion/redaction BEFORE the migration.
`join_intents` cascades on account deletion; a money-bearing reward record may
need to survive deletion (redacted) for reconciliation. Do not copy the cascade
blindly.

## Reward value source (Codex 14)
Not applicable while the reward is banked ACCESS (no pounds figure is issued).
If we ever reintroduce a monetary reward, derive value from Stripe Price
metadata / a versioned pricing table, never a hard-coded £24.99.

## Economics
Cost per converted conversion: up to two banked access-months, granted only on a
real paid conversion, to warm and likely-retaining families. Near-zero marginal
cash cost (access, not money). Clawed back on refund/dispute.

## Measurement
- Funnel: links created → sent → clicked → signups → conversions → grants.
- **Primary:** conversion rate of coalition signups vs organic (lift, per
  Fishkin — not last-click vanity).
- **Secondary:** retention of coalition-acquired families vs organic; sender
  retention lift.

---

## Acceptance criteria

Feature: Prep Together (coalition referral, v1) — to be built at cycle start
- [ ] Invite prompt appears at a parent value moment; reward is secondary in the
      copy, never the headline.
- [ ] Share produces `/together/CODE` + warm message; native sheet (mobile) and
      wa.me/copy (desktop); NO child name in any public surface.
- [ ] Recipient landing shows the SENDER's name (not the child's), is
      value-first (not a signup wall), and carries the code through Clerk signup
      via a server-side first-touch claim; existing accounts ineligible.
- [ ] A new signup via the link creates a `coalition_referrals` row
      (first-touch, unique per recipient).
- [ ] On the recipient's first eligible PAID invoice, both families' accounts
      get `bonus_access_until` advanced by a month (banked); referral → rewarded;
      grant ledgered `UNIQUE(referral_id, party)`.
- [ ] Reward grant is idempotent independent of webhook event-dedupe; a
      reconciliation sweep repairs rewarded-but-ungranted rows.
- [ ] `charge.refunded` / `charge.dispute.created` on the triggering invoice
      claws back the unconsumed reward and marks the referral reversed.
- [ ] `bonus_access_until` is in the account SELECT, worker test schema, and
      schemaParity.test.js (no column drift).
- [ ] No cross-family child data is exposed anywhere.
- [ ] Comped senders are handled honestly (excluded or given a valid token; no
      false symmetric promise).
- [ ] Admin can see coalition referrals + grants (reuse ?view=admin tally).

## Build sequencing (execute at cycle start, money-path re-gated by senior-dev)
1. **Entitlement primitive:** `bonus_access_until` column + ladder step + pure
   `resolveEntitlements` change + schema parity + tests. (migration FILE only)
2. **Attribution:** `coalition_referrals` + server-side first-touch claim +
   `/together/CODE` mint + recipient signup wiring.
3. **Reward grant on conversion:** single-event eligibility predicate + atomic
   idempotent status flip + `reward_grants` ledger + reconciliation sweep.
4. **Reversal:** refund/dispute clawback.
5. **Invite surface + trigger** (reuse card plumbing) + copy.
6. **Recipient landing** (value-first, sender-name trust transfer, no child name).
7. **Admin tally + measurement.**
Migration ceremony per the playbook for both new tables. Deploy worker then
frontend (git fetch first). Real-device + Safari-floor check on the landing.

---

## Adversarial review outcomes (Codex 16 challenges + senior-dev)

**Codex blockers**
1. Public child-name disclosure → **ABSORBED.** No child name in public share/
   landing copy; sender-name is the trust transfer (§2, §3).
2. Reward primitive doesn't fit entitlement architecture → **ABSORBED.** Single
   `bonus_access_until` column loaded by all callers; ladder step; pure resolver
   preserved (§5).
3. Conversion-gating → nagging → **REJECTED (Ben's user read).** This
   demographic will not nag; the driver is coalition. Pay-gating retained. (The
   separate abuse half is handled at 5/§7.)
4. Annual "free month" is false → **DISSOLVED** by Decision 2 (reward is banked
   access, no Stripe money; no pounds/annual semantics).
5. Refund/chargeback abuse → **ABSORBED.** Clawback on refund/dispute (§7);
   severity low because reward is access not cash; second-invoice option flagged.
6. Stripe/D1 non-atomicity → **DISSOLVED/ABSORBED.** No Stripe money call in the
   loop; D1-only grant is atomic + idempotent + reconciled (§5, §6).

**Codex majors**
7. Shared invoice.paid/payment_succeeded branch double-trigger → **ABSORBED**
   (one event type; dedupe by invoice/referral) §6.
8. "First paid invoice" underspecified → **ABSORBED** (explicit eligibility
   predicate) §6.
9. First-touch attribution vs carrier reality → **ABSORBED** (server-side
   first-touch claim + unique constraint) §4.
10. "New account only" not an abuse boundary → **ABSORBED** (canonical email +
    deletion-history) Abuse section.
11. No cap → unbounded liability → **PARTIALLY ABSORBED** (soft review threshold;
    liability is access not cash) Abuse section.
12. Comped/free unfairness → **ABSORBED** (§8; honest copy).
13. Ledger retention vs GDPR → **ABSORBED as design item** (decide personal vs
    financial record before migration) GDPR section.
14. Reward amount source → **DISSOLVED** (no monetary reward) but noted if ever
    reintroduced.
15. `heard_about='coalition'` write-once clash → **ABSORBED** (keep attribution
    in `coalition_referrals`, not the survey column) §4.
16. Foundations sound but incomplete → **ACCEPTED** (reuse safety habits, not the
    attribution trust model; money-bearing needs stronger constraints).

**Senior-dev (verdict: push back → addressed)**
- Refund/chargeback (S1) = Codex 5 → §7.
- Webhook retry-swallow, no safety net (S2) → **ABSORBED** (idempotent grant
  independent of event-dedupe + reconciliation sweep) §6.
- Missing outgoing idempotency key (S3) → **DISSOLVED** (no outgoing Stripe write
  in the loop); D1 grant carries `UNIQUE(referral_id, party)`.
- Dual-primitive hazard, prefer single (S4) → **ABSORBED** (single banked
  primitive chosen) §5.
- Enforce via column not ledger-sum (S5) → **ABSORBED** §5.
- Credit wasted overlapping the trial (S6) → **ABSORBED** (`max(now, trial_end,
  existing)+30d`) §5.
- Annual recipient / "a month" in pounds / balance non-expiry (risks) →
  **DISSOLVED** by the access-not-money decision.
- Schema-parity for new column (risk) → **ABSORBED** (§5 load path).

## Open items (resolve before build)
- Confirm the trigger's sender-state rule (sender need not be a payer — Decision
  3 assumption).
- Grant on first vs SECOND paid invoice (refund-window vs generosity trade).
- Attribution window length (proposed 90d).
- Exact value-moment trigger.
- Oracle: pin the launch window to the GL prep-intent seasonal curve.
- GDPR classification of referral/reward records + deletion/redaction rule.

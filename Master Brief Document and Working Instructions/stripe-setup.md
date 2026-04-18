# Stripe Setup — 11+ App

**Purpose:** what you need to configure in the Stripe dashboard, Cloudflare Workers, and the React app to bring the subscription flow online.

**Flow summary (Option B):**
- New user signs up → 7 days free access, no card required
- Day 7+: user hits paywall, enters card via embedded Stripe Elements
- On success: subscribed at £15/month, charged immediately
- Cancel any time via Stripe Customer Portal
- 14-day UK statutory cooling-off refund available (manual via Stripe dashboard)

---

## 1. Stripe dashboard

### Create the product + price

1. Dashboard → Products → **+ Add product**
2. Name: "11+ Test Prep — Monthly" (update when branding decided)
3. Pricing model: **Standard pricing**
4. Price: **£15.00 GBP** (note: Stripe charges including VAT — check tax settings)
5. Billing period: **Monthly**
6. Save → copy the **Price ID** (starts with `price_`) — you'll need this as `STRIPE_PRICE_ID`

### Configure the Customer Portal

1. Dashboard → Settings → Billing → **Customer portal**
2. Enable:
   - Customers can update payment methods: ✓
   - Customers can cancel subscriptions: ✓ (at end of billing period)
   - Customers can view invoices: ✓
3. Business information: business name, support email
4. Cancellation reason survey: optional — useful for understanding churn
5. Save

### Create the webhook endpoint

1. Dashboard → Developers → Webhooks → **+ Add endpoint**
2. Endpoint URL: `https://11plus-ai-tutor.benjacko82.workers.dev/api/stripe/webhook`
3. Events to send:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Save → reveal the **Signing secret** (starts with `whsec_`) — needed as `STRIPE_WEBHOOK_SECRET`

### Copy the API keys

Dashboard → Developers → API keys:
- **Publishable key** (`pk_test_...` or `pk_live_...`) — safe for client-side, needed as `REACT_APP_STRIPE_PUBLISHABLE_KEY`
- **Secret key** (`sk_test_...` or `sk_live_...`) — server-only, needed as `STRIPE_SECRET_KEY`

---

## 2. Cloudflare Worker secrets

Run each command in `workers/ai-tutor/` and paste the value when prompted:

```bash
cd workers/ai-tutor

npx wrangler secret put STRIPE_SECRET_KEY
# paste sk_test_... (or sk_live_... for prod)

npx wrangler secret put STRIPE_WEBHOOK_SECRET
# paste whsec_...

npx wrangler secret put STRIPE_PRICE_ID
# paste price_...

# Optional — override the default return URL for Customer Portal
npx wrangler secret put APP_URL
# e.g. https://11plus-prep.pages.dev/

# Invite codes — comma-separated allowlist. Anyone signing up with a
# matching ?invite=CODE gets free-forever access (no card, no trial).
# Case-insensitive. Update + redeploy to rotate.
npx wrangler secret put INVITE_CODES
# e.g. EVIE-FRIENDS,LAUNCH-TESTER,FAMILY

# CORS allowlist — browser requests from origins NOT in this list get 403
# before any route runs. Server-to-server calls (Stripe webhook) are
# unaffected (they send no Origin header). Include localhost entries so
# `npm start` and `npm run smoke` work.
npx wrangler secret put ALLOWED_ORIGINS
# e.g. https://11plus-prep.pages.dev,http://localhost:3000,http://localhost:4173
```

Verify: `npx wrangler secret list` should show all six.

---

## 3. React app — .env

Add to `.env` (gitignored, local only):

```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

For production builds, set the same key in Cloudflare Pages dashboard → project settings → environment variables.

Use the `pk_test_...` key for dev and local testing. Switch to `pk_live_...` only when the live webhook + live subscription flow has been verified end-to-end in test mode.

---

## 4. Apply D1 migrations

Two migrations ship together:
- `0005_stripe_subscriptions.sql` — subscription state columns
- `0006_grandfather_and_invites.sql` — comp columns + grandfathers every existing account

```bash
cd workers/ai-tutor

# Apply both to production D1
npx wrangler d1 migrations apply 11plus-user-data --remote

# Verify the schema
npx wrangler d1 execute 11plus-user-data --remote --command="PRAGMA table_info(accounts);"

# Verify grandfathering worked — should show all current accounts with is_comped=1
npx wrangler d1 execute 11plus-user-data --remote --command="SELECT id, email, is_comped, comp_source FROM accounts;"
```

Expected new columns: `stripe_customer_id`, `subscription_status`, `subscription_current_period_end`, `is_comped`, `comp_source`.

**Critical:** run the migrations BEFORE deploying the new Worker code. If the Worker ships first, the old accounts lose access until the migration lands.

---

## 5. Testing in Stripe test mode

Use Stripe's test card numbers:
- **Success:** `4242 4242 4242 4242`, any future expiry, any CVC, any postcode
- **Requires 3DS:** `4000 0025 0000 3155` — triggers a redirect for 3D Secure confirmation
- **Decline (insufficient funds):** `4000 0000 0000 9995`
- **Decline (generic):** `4000 0000 0000 0002`

Full list: https://docs.stripe.com/testing#cards

### End-to-end test checklist

- [ ] Sign up a fresh test user → should get 7 days free access (no paywall)
- [ ] Force trial expiry: use `wrangler d1 execute` to backdate `created_at` to 8 days ago
- [ ] Reload app → SubscribeScreen appears
- [ ] Enter `4242 4242 4242 4242` → subscription should confirm inline
- [ ] Check Stripe dashboard → Customer created, Subscription active
- [ ] Check D1 → `subscription_status = 'active'`, `stripe_customer_id` set
- [ ] Reload app → past paywall, full access
- [ ] AccountMenu → "Manage Subscription" → Stripe Portal loads
- [ ] Cancel subscription in Portal → webhook fires → D1 updates to `canceled`
- [ ] Test `4000 0000 0000 0002` → payment declined error surfaces in Elements
- [ ] Test 3DS card `4000 0025 0000 3155` → redirect flow returns to app with access

---

## 6. Going live

Once test mode is verified:

1. Activate live mode in Stripe dashboard (requires business verification, bank details, UK VAT settings)
2. Re-create the product + price in **live mode** (test and live are separate universes in Stripe)
3. Re-create the webhook endpoint in live mode, copy new `whsec_...`
4. Update Worker secrets with live keys (`sk_live_...`, new `whsec_...`, new `price_...`)
5. Update Pages env var with live publishable key (`pk_live_...`)
6. Rebuild + redeploy frontend (`.env.local` warning — see locked rule before running `bash deploy.sh`)
7. Run one live transaction yourself (your own card, £15) to verify end-to-end
8. Refund yourself via Stripe dashboard to clean up

---

## 7. Invite codes + manual comps

### Sharing a code

Share a signup link with the code in the URL:
```
https://11plus-prep.pages.dev/?invite=EVIE-FRIENDS
```

User clicks → sees a purple "Invite accepted" banner → signs up normally → account is flagged `is_comped = 1` → never sees the paywall, never enters a card. Codes live in the `INVITE_CODES` Worker secret (step 2). Match is case-insensitive.

If a code goes viral or gets abused, revoke it:
```bash
npx wrangler secret put INVITE_CODES
# paste the new list without the revoked code
```
Previously-comped accounts keep their access — only future signups are affected.

### Manually comping an existing user

To give a specific user free access after they've already signed up:

```bash
npx wrangler d1 execute 11plus-user-data --remote \
  --command="UPDATE accounts SET is_comped=1, comp_source='manual:reason' WHERE email='person@example.com';"
```

Use descriptive `comp_source` values (e.g. `manual:beta-tester`, `manual:refund-replacement`) so the audit trail stays readable.

### Revoking a comp

```bash
npx wrangler d1 execute 11plus-user-data --remote \
  --command="UPDATE accounts SET is_comped=0 WHERE email='person@example.com';"
```

The user will fall back to normal access rules — if they're past day 7 of their account age with no subscription, they'll hit the paywall on next load.

---

## 8. Known TODOs for later

- **Email reminders (task #6 follow-up)** — email system is dormant. When activated, add a daily cron that emails users on day 6 of trial: "Add a card by tomorrow to keep learning." Currently the paywall just appears on day 7 with no warning.
- **Promo codes / coupons** — not wired yet. If ever needed, add via Stripe dashboard and pass `discounts: [{ coupon: '...' }]` to subscription create.
- **Tax (UK VAT)** — £15 is tax-inclusive for B2C; verify Stripe tax settings match how Terms present the price.
- **Refund flow** — 14-day cooling-off refunds are manual via Stripe dashboard. If volume grows, automate with a self-service refund route.
- **Stripe CLI for local webhook testing** — `stripe listen --forward-to localhost:8787/api/stripe/webhook` forwards live-mode events to local dev.

---

## Required environment variables reference

| Name | Where | Example | Notes |
|------|-------|---------|-------|
| `STRIPE_SECRET_KEY` | Worker secret | `sk_test_...` | Server only |
| `STRIPE_WEBHOOK_SECRET` | Worker secret | `whsec_...` | Signature verification |
| `STRIPE_PRICE_ID` | Worker secret | `price_...` | £15/month recurring price |
| `APP_URL` | Worker secret (optional) | `https://11plus-prep.pages.dev/` | Portal return URL |
| `INVITE_CODES` | Worker secret | `EVIE-FRIENDS,LAUNCH-TESTER` | Comma-separated comp-code allowlist |
| `ALLOWED_ORIGINS` | Worker secret | `https://11plus-prep.pages.dev,http://localhost:3000` | Browser CORS allowlist |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | `.env` + Pages env | `pk_test_...` | Safe client-side |

// ── Stripe Routes ──
//
// POST /api/stripe/subscribe  — auth. Creates Customer + Subscription with
//                               payment_behavior=default_incomplete so the
//                               frontend can confirm with Stripe Elements.
// POST /api/stripe/portal     — auth. Creates a Billing Portal session so
//                               the user can update card or cancel.
// POST /api/stripe/webhook    — public (signature-verified). Syncs D1
//                               subscription state from Stripe events.
//
// Trial Option B: the 30-day free period is tracked client-side from
// accounts.created_at. Stripe subscriptions start with no trial — the
// user only enters card details when they want to keep access past day 30.

import { json, BASE_HEADERS } from '../helpers.js';

const STRIPE_API = 'https://api.stripe.com/v1';

// ── Stripe REST helpers ──

// Stripe's API uses application/x-www-form-urlencoded with dotted keys
// for nested objects. This helper flattens a JS object to that format.
function stripeForm(obj, prefix = '') {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (typeof item === 'object') {
          for (const [ik, iv] of Object.entries(stripeFormFlatten(item, `${key}[${i}]`))) {
            params.append(ik, iv);
          }
        } else {
          params.append(`${key}[${i}]`, String(item));
        }
      });
    } else if (typeof v === 'object') {
      for (const [ik, iv] of Object.entries(stripeFormFlatten(v, key))) {
        params.append(ik, iv);
      }
    } else {
      params.append(key, String(v));
    }
  }
  return params;
}

function stripeFormFlatten(obj, prefix) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;
    const key = `${prefix}[${k}]`;
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (typeof item === 'object' && item !== null) {
          Object.assign(out, stripeFormFlatten(item, `${key}[${i}]`));
        } else {
          out[`${key}[${i}]`] = String(item);
        }
      });
    } else if (typeof v === 'object') {
      Object.assign(out, stripeFormFlatten(v, key));
    } else {
      out[key] = String(v);
    }
  }
  return out;
}

async function stripeCall(env, method, path, body) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body ? stripeForm(body).toString() : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    const message = data.error?.message || `Stripe ${res.status}`;
    const err = new Error(message);
    err.stripeCode = data.error?.code;
    err.status = res.status;
    throw err;
  }
  return data;
}

// ── Webhook signature verification (Web Crypto, no SDK) ──

async function verifyStripeSignature(rawBody, sigHeader, secret, toleranceSec = 300) {
  if (!sigHeader) return false;

  const parts = sigHeader.split(',').reduce((acc, p) => {
    const [k, v] = p.split('=');
    if (k && v) (acc[k] = acc[k] || []).push(v);
    return acc;
  }, {});
  const timestamp = parts.t?.[0];
  const signatures = parts.v1 || [];
  if (!timestamp || signatures.length === 0) return false;

  // Reject old events to prevent replay
  const age = Math.floor(Date.now() / 1000) - Number(timestamp);
  if (Number.isNaN(age) || age > toleranceSec) return false;

  const signedPayload = `${timestamp}.${rawBody}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload));
  const computed = Array.from(new Uint8Array(sigBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Constant-time compare against any listed v1 signature
  for (const expected of signatures) {
    if (expected.length !== computed.length) continue;
    let diff = 0;
    for (let i = 0; i < computed.length; i++) {
      diff |= expected.charCodeAt(i) ^ computed.charCodeAt(i);
    }
    if (diff === 0) return true;
  }
  return false;
}

// ── Webhook data helpers ──

// Stripe moved `current_period_end` OFF the Subscription object and onto
// each SubscriptionItem as of API version 2025-03-31.basil (accounts
// created/upgraded on or after that pin no longer have a top-level
// current_period_end at all). We check both locations, preferring the
// legacy top-level field where it's still present, falling back to the
// first subscription item. Kept RAW as Stripe unix seconds — do NOT
// convert to ms or ISO here; lib/entitlements.js (isFutureEpoch) expects
// seconds.
export function getPeriodEnd(sub) {
  return sub?.current_period_end ?? sub?.items?.data?.[0]?.current_period_end ?? null;
}

// invoice.paid/invoice.payment_succeeded carry no subscription-level
// current_period_end at all — the closest signal is each invoice line's
// billing period. Best-effort only: returns the latest line period.end
// found, or undefined if the invoice has no usable period data (caller
// should then leave subscription_current_period_end untouched).
function maxInvoiceLinePeriodEnd(invoice) {
  const lines = invoice?.lines?.data || [];
  let max;
  for (const line of lines) {
    const end = line?.period?.end;
    if (typeof end === 'number' && Number.isFinite(end) && (max === undefined || end > max)) {
      max = end;
    }
  }
  return max;
}

// Writes accounts.subscription_status / subscription_current_period_end
// for a given Stripe customer. `status` is only written when provided;
// `periodEnd` is only written when NOT undefined (so status-only events —
// e.g. invoice.payment_failed — never clobber a good date; passing
// `periodEnd: null` is a deliberate, explicit clear).
//
// Primary match is stripe_customer_id. If that matches zero rows — the
// customer was created outside our checkout flow (Stripe dashboard), or
// there was a race between Checkout completing and handleSubscribe's own
// `UPDATE accounts SET stripe_customer_id = ...` (L169-170) landing — we
// retry by Clerk user id (subscription/checkout metadata.clerk_user_id,
// set at L191-193) and backfill stripe_customer_id onto that row so the
// fast path works next time. If NEITHER matches, we log a loud error
// (an account exists with paid access that D1 can't locate) but still
// return normally so the caller can 200 the webhook — Stripe would
// otherwise retry a genuinely unmatchable event forever.
export async function updateAccountBilling(db, { customerId, clerkUserId, status, periodEnd }) {
  const setParts = [];
  const params = [];
  if (status !== undefined) {
    setParts.push('subscription_status = ?');
    params.push(status);
  }
  if (periodEnd !== undefined) {
    setParts.push('subscription_current_period_end = ?');
    params.push(periodEnd);
  }
  if (setParts.length === 0) return 0;

  const byCustomer = await db.prepare(
    `UPDATE accounts SET ${setParts.join(', ')} WHERE stripe_customer_id = ?`
  ).bind(...params, customerId).run();
  let changes = byCustomer.meta?.changes || 0;

  if (changes === 0 && clerkUserId) {
    const byUser = await db.prepare(
      `UPDATE accounts SET ${setParts.join(', ')}, stripe_customer_id = ? WHERE id = ?`
    ).bind(...params, customerId, clerkUserId).run();
    changes = byUser.meta?.changes || 0;
  }

  if (changes === 0) {
    console.error('[Stripe webhook] UNMATCHED account', JSON.stringify({ customerId, clerkUserId, status }));
  }

  return changes;
}

// ── Route handlers ──

// POST /api/stripe/subscribe
// Creates (or reuses) a Stripe Customer for the user, then creates a
// Checkout Session in subscription mode. Returns { url } — the frontend
// redirects to Stripe's hosted checkout page. On success, Stripe redirects
// back to APP_URL with ?subscribed=1; on cancel, back to APP_URL.
export async function handleSubscribe(request, env, userId) {
  const db = env.DB;

  const account = await db.prepare(
    'SELECT id, email, name, stripe_customer_id, subscription_status, is_comped FROM accounts WHERE id = ?'
  ).bind(userId).first();
  if (!account) return json({ error: 'Account not found' }, 404);

  // Comped accounts (grandfathered or invite code) don't need to pay.
  if (account.is_comped) {
    return json({ error: 'Account has free access — no subscription needed', comped: true }, 409);
  }

  // Block double-subscribe if already active/trialing/past_due
  if (['active', 'trialing', 'past_due'].includes(account.subscription_status)) {
    return json({ error: 'Subscription already exists', status: account.subscription_status }, 409);
  }

  try {
    // Ensure customer (so subscription is associated with a known customer)
    let customerId = account.stripe_customer_id;
    if (!customerId) {
      const customer = await stripeCall(env, 'POST', '/customers', {
        email: account.email,
        name: account.name,
        metadata: { clerk_user_id: userId },
      });
      customerId = customer.id;
      await db.prepare('UPDATE accounts SET stripe_customer_id = ? WHERE id = ?')
        .bind(customerId, userId).run();
    }

    const appUrl = env.APP_URL || 'https://prepstep.co.uk';
    const body = await request.json().catch(() => ({}));
    const returnBase = body.returnUrl || appUrl;

    // Resolve price ID: annual → STRIPE_PRICE_ANNUAL, monthly → STRIPE_PRICE_MONTHLY.
    // Fall back to STRIPE_PRICE_ID for backwards compatibility during rollout.
    const plan = body.plan === 'monthly' ? 'monthly' : 'annual';
    const priceId = plan === 'annual'
      ? (env.STRIPE_PRICE_ANNUAL || env.STRIPE_PRICE_ID)
      : (env.STRIPE_PRICE_MONTHLY || env.STRIPE_PRICE_ID);

    // Checkout Session — Stripe hosts the card form, 3DS, Apple Pay etc.
    const session = await stripeCall(env, 'POST', '/checkout/sessions', {
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${returnBase}?subscribed=1`,
      cancel_url: returnBase,
      metadata: { clerk_user_id: userId },
      subscription_data: {
        metadata: { clerk_user_id: userId },
      },
    });

    return json({ url: session.url });
  } catch (err) {
    console.error('[Stripe subscribe]', err.message, err.stripeCode);
    return json({ error: err.message, code: err.stripeCode }, err.status || 500);
  }
}

// POST /api/stripe/portal
// Returns a short-lived URL to Stripe's Customer Portal where the user
// can update their card, cancel, or view invoices.
export async function handlePortal(request, env, userId) {
  const db = env.DB;
  const body = await request.json().catch(() => ({}));

  const account = await db.prepare(
    'SELECT stripe_customer_id FROM accounts WHERE id = ?'
  ).bind(userId).first();
  if (!account?.stripe_customer_id) {
    return json({ error: 'No Stripe customer for this account' }, 404);
  }

  try {
    const session = await stripeCall(env, 'POST', '/billing_portal/sessions', {
      customer: account.stripe_customer_id,
      return_url: body.returnUrl || env.APP_URL || 'https://prepstep.co.uk/',
    });
    return json({ url: session.url });
  } catch (err) {
    console.error('[Stripe portal]', err.message);
    return json({ error: err.message }, err.status || 500);
  }
}

// POST /api/stripe/webhook
// Stripe → Worker. Signature verified before any processing. Updates D1
// based on subscription lifecycle events. Idempotent — safe to replay.
export async function handleWebhook(request, env) {
  const sigHeader = request.headers.get('stripe-signature');
  const rawBody = await request.text();

  const valid = await verifyStripeSignature(rawBody, sigHeader, env.STRIPE_WEBHOOK_SECRET);
  if (!valid) {
    console.warn('[Stripe webhook] Signature verification failed');
    return new Response('Invalid signature', { status: 400, headers: BASE_HEADERS });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response('Malformed payload', { status: 400, headers: BASE_HEADERS });
  }

  const db = env.DB;

  // Idempotency check — Stripe delivers webhooks at-least-once. If we've
  // already processed this event.id, return 200 immediately so Stripe
  // stops retrying. INSERT OR IGNORE atomically claims the event; meta.changes
  // tells us whether we won the race.
  if (event.id) {
    try {
      const claim = await db.prepare(
        'INSERT OR IGNORE INTO stripe_webhook_events (event_id, type) VALUES (?, ?)'
      ).bind(event.id, event.type).run();
      if (claim.meta?.changes === 0) {
        console.log('[Stripe webhook] Duplicate event ignored:', event.id, event.type);
        return json({ received: true, duplicate: true });
      }
    } catch (err) {
      // If the dedup table is missing (pre-migration), log and continue —
      // duplicate processing is harmless given idempotent UPDATEs below.
      console.warn('[Stripe webhook] dedup insert failed, processing anyway:', err.message);
    }
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        await updateAccountBilling(db, {
          customerId: sub.customer,
          clerkUserId: sub.metadata?.clerk_user_id,
          status: sub.status,
          periodEnd: getPeriodEnd(sub),
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await updateAccountBilling(db, {
          customerId: sub.customer,
          clerkUserId: sub.metadata?.clerk_user_id,
          status: 'canceled',
          periodEnd: getPeriodEnd(sub),
        });
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        if (invoice.customer) {
          await updateAccountBilling(db, {
            customerId: invoice.customer,
            status: 'past_due',
            // periodEnd intentionally omitted (undefined) — a failed
            // payment doesn't tell us anything new about the period end,
            // and invoices carry no subscription-level date to write.
          });
        }
        break;
      }
      case 'invoice.paid':
      case 'invoice.payment_succeeded': {
        // Belt-and-braces: ensure status=active after a successful charge.
        // customer.subscription.updated should fire too, but payment events
        // are a stronger signal the user has live access. Also refreshes
        // period_end best-effort from the invoice's line items, so a
        // dropped subscription.updated doesn't leave the date stale
        // through a renewal (Gap 3).
        const invoice = event.data.object;
        if (invoice.customer && invoice.subscription) {
          await updateAccountBilling(db, {
            customerId: invoice.customer,
            status: 'active',
            periodEnd: maxInvoiceLinePeriodEnd(invoice),
          });
        }
        break;
      }
      default:
        // Ignore unhandled event types — Stripe sends many we don't need.
        break;
    }

    return json({ received: true });
  } catch (err) {
    console.error('[Stripe webhook handler]', event.type, err.message);
    // 500 so Stripe retries. Idempotent updates make retry safe.
    return json({ error: err.message }, 500);
  }
}

// ── Reconciliation cron ──
//
// Daily sanity check: pull active subscriptions from Stripe, compare to
// what D1 has marked active, log drift. Catches edge cases where a
// webhook was missed or the dedup table swallowed a real event.
//
// Strategy: Stripe is the source of truth for billing. If D1 disagrees,
// we log it but DON'T auto-correct — better to surface drift to a human
// than risk flipping access state without context. The webhook handler
// already keeps D1 in sync; this is the safety net.
export async function reconcileSubscriptions(env) {
  const db = env.DB;

  // Stripe-side: list all active subscriptions (paginate if >100).
  let stripeActive = new Set();
  let startingAfter = null;
  for (let page = 0; page < 10; page++) {
    const path = `/subscriptions?status=active&limit=100${startingAfter ? `&starting_after=${startingAfter}` : ''}`;
    const data = await stripeCall(env, 'GET', path);
    for (const sub of data.data || []) {
      if (sub.customer) stripeActive.add(sub.customer);
    }
    if (!data.has_more) break;
    startingAfter = data.data[data.data.length - 1]?.id;
    if (!startingAfter) break;
  }

  // D1-side: every account with status=active or trialing.
  const { results: d1Active } = await db.prepare(
    `SELECT id, email, stripe_customer_id, subscription_status
     FROM accounts
     WHERE subscription_status IN ('active', 'trialing')
       AND stripe_customer_id IS NOT NULL`
  ).all();
  const d1ActiveCustomers = new Set(d1Active.map(a => a.stripe_customer_id));

  // Drift class A — D1 thinks active, Stripe says not.
  // Likely cause: missed customer.subscription.deleted webhook.
  const ghostActive = d1Active.filter(a => !stripeActive.has(a.stripe_customer_id));

  // Drift class B — Stripe says active, D1 doesn't.
  // Likely cause: missed customer.subscription.created/updated webhook.
  const missedActive = [...stripeActive].filter(c => !d1ActiveCustomers.has(c));

  const summary = {
    stripe_active_count: stripeActive.size,
    d1_active_count: d1Active.length,
    drift_d1_says_active_stripe_doesnt: ghostActive.length,
    drift_stripe_says_active_d1_doesnt: missedActive.length,
  };

  if (ghostActive.length || missedActive.length) {
    console.error('[reconciliation] DRIFT DETECTED', JSON.stringify({
      ...summary,
      ghost_active: ghostActive.map(a => ({ id: a.id, email: a.email, customer: a.stripe_customer_id })),
      missed_active_customers: missedActive,
    }));
  } else {
    console.log('[reconciliation] OK', JSON.stringify(summary));
  }

  return summary;
}

// ── Dispatcher ──

export async function handleStripeRoutes(request, env, userId, path) {
  if (path === '/api/stripe/subscribe' && request.method === 'POST') {
    return handleSubscribe(request, env, userId);
  }
  if (path === '/api/stripe/portal' && request.method === 'POST') {
    return handlePortal(request, env, userId);
  }
  return null;
}

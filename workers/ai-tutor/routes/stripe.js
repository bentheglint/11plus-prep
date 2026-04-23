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
// Trial Option B: the 7-day free period is tracked client-side from
// accounts.created_at. Stripe subscriptions start with no trial — the
// user only enters card details when they want to keep access past day 7.

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
    if (typeof v === 'object' && !Array.isArray(v)) {
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

// ── Route handlers ──

// POST /api/stripe/subscribe
// Creates (or reuses) a Stripe Customer for the user, then creates a
// Subscription at STRIPE_PRICE_ID with payment_behavior=default_incomplete.
// Returns { subscriptionId, clientSecret } for the frontend to confirm.
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
    // Step 1 — ensure customer
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

    // Step 2 — create subscription. default_incomplete means Stripe
    // creates the subscription as incomplete and returns a PaymentIntent
    // on the first invoice for the frontend to confirm with Elements.
    const subscription = await stripeCall(env, 'POST', '/subscriptions', {
      customer: customerId,
      items: [{ price: env.STRIPE_PRICE_ID }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
        payment_method_types: ['card'],
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: { clerk_user_id: userId },
    });

    const clientSecret = subscription.latest_invoice?.payment_intent?.client_secret;
    if (!clientSecret) {
      return json({ error: 'Stripe did not return a client secret' }, 502);
    }

    return json({
      subscriptionId: subscription.id,
      clientSecret,
      customerId,
    });
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

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        await db.prepare(
          `UPDATE accounts
           SET subscription_status = ?, subscription_current_period_end = ?
           WHERE stripe_customer_id = ?`
        ).bind(sub.status, sub.current_period_end || null, sub.customer).run();
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await db.prepare(
          `UPDATE accounts
           SET subscription_status = 'canceled', subscription_current_period_end = ?
           WHERE stripe_customer_id = ?`
        ).bind(sub.current_period_end || null, sub.customer).run();
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        if (invoice.customer) {
          await db.prepare(
            `UPDATE accounts SET subscription_status = 'past_due' WHERE stripe_customer_id = ?`
          ).bind(invoice.customer).run();
        }
        break;
      }
      case 'invoice.paid': {
        // Belt-and-braces: ensure status=active after a successful charge.
        // customer.subscription.updated should fire too, but payment events
        // are a stronger signal the user has live access.
        const invoice = event.data.object;
        if (invoice.customer && invoice.subscription) {
          await db.prepare(
            `UPDATE accounts SET subscription_status = 'active' WHERE stripe_customer_id = ?`
          ).bind(invoice.customer).run();
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

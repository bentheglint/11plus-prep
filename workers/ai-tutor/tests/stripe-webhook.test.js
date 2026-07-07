/**
 * Stripe webhook hardening — routes/stripe.js.
 *
 * Covers three confirmed defects fixed in this pass:
 *   1. period_end nulling — Stripe moved `current_period_end` off the
 *      Subscription object onto the SubscriptionItem as of API version
 *      2025-03-31.basil. getPeriodEnd() checks both locations.
 *   2. Silent no-op UPDATEs — all four webhook UPDATEs matched only on
 *      stripe_customer_id and never checked whether a row matched.
 *      updateAccountBilling() now falls back to matching by Clerk user id
 *      (subscription/checkout metadata.clerk_user_id) and backfills
 *      stripe_customer_id, logging a loud error if still unmatched.
 *   3. Staleness — period_end was only ever refreshed by
 *      customer.subscription.* events, never invoice.* events.
 *      invoice.paid now best-effort refreshes it from invoice line items.
 *
 * Requests go through the real fetch dispatcher (worker.fetch, from
 * index.js) rather than calling handleWebhook directly, so routing,
 * signature verification, and dedupe are all exercised end to end exactly
 * as Stripe would hit them in production.
 */

import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { env } from 'cloudflare:test';
import worker from '../index.js';
import { getPeriodEnd, invoiceSubscriptionId } from '../routes/stripe.js';
import { createSchema, cleanDb, seed, makeAuthToken } from './helpers.js';

const TEST_WEBHOOK_SECRET = 'whsec_test_secret_for_stripe_webhook_suite';

beforeAll(async () => {
  await createSchema(env.DB);
});

afterEach(async () => {
  await cleanDb(env.DB);
});

// ── Signing helpers — mirror verifyStripeSignature() in routes/stripe.js ──

async function signPayload(secret, rawBody, timestamp) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${timestamp}.${rawBody}`)
  );
  return Array.from(new Uint8Array(sigBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Posts a Stripe event payload with a freshly computed, valid signature
// (unless overridden), using a timestamp within the handler's own
// tolerance window (it uses Date.now() at call time — always current).
async function postWebhook(payload, { secret = TEST_WEBHOOK_SECRET, sigHeader, testEnv } = {}) {
  const rawBody = JSON.stringify(payload);
  let header = sigHeader;
  if (header === undefined) {
    const timestamp = Math.floor(Date.now() / 1000);
    const sig = await signPayload(secret, rawBody, timestamp);
    header = `t=${timestamp},v1=${sig}`;
  }
  const request = new Request('https://worker.test/api/stripe/webhook', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'stripe-signature': header },
    body: rawBody,
  });
  const runEnv = testEnv || { ...env, STRIPE_WEBHOOK_SECRET: TEST_WEBHOOK_SECRET };
  return worker.fetch(request, runEnv);
}

async function getAccount(userId) {
  return env.DB.prepare(
    'SELECT id, stripe_customer_id, subscription_status, subscription_current_period_end FROM accounts WHERE id = ?'
  ).bind(userId).first();
}

async function seedAccountWithBilling(userId, { email, stripeCustomerId = null, status = null, periodEnd = null }) {
  await seed.account(env.DB, userId, email);
  await env.DB.prepare(
    `UPDATE accounts SET stripe_customer_id = ?, subscription_status = ?, subscription_current_period_end = ? WHERE id = ?`
  ).bind(stripeCustomerId, status, periodEnd, userId).run();
}

function subscriptionEvent(id, type, subOverrides = {}) {
  return {
    id,
    type,
    data: {
      object: {
        id: 'sub_test',
        customer: 'cus_test',
        status: 'active',
        metadata: {},
        ...subOverrides,
      },
    },
  };
}

function invoiceEvent(id, type, invoiceOverrides = {}) {
  return {
    id,
    type,
    data: {
      object: {
        id: 'in_test',
        customer: 'cus_test',
        subscription: 'sub_test',
        lines: { data: [] },
        ...invoiceOverrides,
      },
    },
  };
}

// ── (a) getPeriodEnd — pure function ──────────────────────────────────────

describe('getPeriodEnd', () => {
  it('reads the legacy top-level current_period_end (pre-2025-03-31.basil accounts)', () => {
    expect(getPeriodEnd({ current_period_end: 1700000000 })).toBe(1700000000);
  });

  it('falls back to items.data[0].current_period_end (post-basil accounts, Gap 1)', () => {
    const sub = { items: { data: [{ current_period_end: 1750000000 }] } };
    expect(getPeriodEnd(sub)).toBe(1750000000);
  });

  it('returns null when neither location has a value', () => {
    expect(getPeriodEnd({})).toBeNull();
    expect(getPeriodEnd({ items: { data: [] } })).toBeNull();
  });

  it('when both are present, returns a valid number (prefers top-level)', () => {
    const sub = {
      current_period_end: 1710000000,
      items: { data: [{ current_period_end: 1720000000 }] },
    };
    const result = getPeriodEnd(sub);
    expect(typeof result).toBe('number');
    expect(result).toBe(1710000000);
  });
});

// ── (a2) invoiceSubscriptionId — pure function ────────────────────────────

describe('invoiceSubscriptionId', () => {
  it('reads the legacy top-level invoice.subscription field', () => {
    expect(invoiceSubscriptionId({ subscription: 'sub_legacy' })).toBe('sub_legacy');
  });

  it('falls back to invoice.parent.subscription_details.subscription (2025-03-31.basil+ accounts, N7)', () => {
    const invoice = { parent: { subscription_details: { subscription: 'sub_basil' } } };
    expect(invoiceSubscriptionId(invoice)).toBe('sub_basil');
  });

  it('prefers the legacy top-level field when both are present', () => {
    const invoice = {
      subscription: 'sub_legacy',
      parent: { subscription_details: { subscription: 'sub_basil' } },
    };
    expect(invoiceSubscriptionId(invoice)).toBe('sub_legacy');
  });

  it('returns null when neither location has a value (e.g. a non-subscription invoice)', () => {
    expect(invoiceSubscriptionId({})).toBeNull();
    expect(invoiceSubscriptionId({ parent: {} })).toBeNull();
    expect(invoiceSubscriptionId({ parent: { subscription_details: {} } })).toBeNull();
  });
});

// ── (b)/(c) handleWebhook integration ─────────────────────────────────────

describe('POST /api/stripe/webhook', () => {
  it('customer.subscription.created with period_end ONLY in items.data[0] → status + non-null period_end written (Gap 1)', async () => {
    const userId = 'stripe-user-created';
    await seedAccountWithBilling(userId, { email: `${userId}@test.com`, stripeCustomerId: 'cus_created' });

    const event = subscriptionEvent('evt_created_1', 'customer.subscription.created', {
      customer: 'cus_created',
      status: 'active',
      current_period_end: undefined,
      items: { data: [{ current_period_end: 1830000000 }] },
    });
    // JSON.stringify drops explicit `undefined` keys, matching a real
    // Stripe payload where the field is simply absent on new-API accounts.
    const res = await postWebhook(event);
    expect(res.status).toBe(200);

    const account = await getAccount(userId);
    expect(account.subscription_status).toBe('active');
    expect(account.subscription_current_period_end).toBe(1830000000);
  });

  it('customer.subscription.deleted → status canceled, period_end from getPeriodEnd', async () => {
    const userId = 'stripe-user-deleted';
    await seedAccountWithBilling(userId, {
      email: `${userId}@test.com`,
      stripeCustomerId: 'cus_deleted',
      status: 'active',
      periodEnd: 1800000000,
    });

    const event = subscriptionEvent('evt_deleted_1', 'customer.subscription.deleted', {
      customer: 'cus_deleted',
      current_period_end: 1801000000,
    });
    const res = await postWebhook(event);
    expect(res.status).toBe(200);

    const account = await getAccount(userId);
    expect(account.subscription_status).toBe('canceled');
    expect(account.subscription_current_period_end).toBe(1801000000);
  });

  it('invoice.payment_failed → status past_due, period_end left untouched', async () => {
    const userId = 'stripe-user-failed';
    await seedAccountWithBilling(userId, {
      email: `${userId}@test.com`,
      stripeCustomerId: 'cus_failed',
      status: 'active',
      periodEnd: 1790000000,
    });

    const event = invoiceEvent('evt_failed_1', 'invoice.payment_failed', { customer: 'cus_failed' });
    const res = await postWebhook(event);
    expect(res.status).toBe(200);

    const account = await getAccount(userId);
    expect(account.subscription_status).toBe('past_due');
    expect(account.subscription_current_period_end).toBe(1790000000); // unchanged
  });

  it('invoice.paid → status active; period_end refreshed from max invoice line period.end (Gap 3)', async () => {
    const userId = 'stripe-user-paid';
    await seedAccountWithBilling(userId, {
      email: `${userId}@test.com`,
      stripeCustomerId: 'cus_paid',
      status: 'past_due',
      periodEnd: 1790000000,
    });

    const event = invoiceEvent('evt_paid_1', 'invoice.paid', {
      customer: 'cus_paid',
      subscription: 'sub_paid',
      lines: {
        data: [
          { period: { start: 1795000000, end: 1797000000 } },
          { period: { start: 1795000000, end: 1799000000 } }, // later — should win
        ],
      },
    });
    const res = await postWebhook(event);
    expect(res.status).toBe(200);

    const account = await getAccount(userId);
    expect(account.subscription_status).toBe('active');
    expect(account.subscription_current_period_end).toBe(1799000000);
  });

  it('invoice.paid with no usable line period data leaves period_end untouched', async () => {
    const userId = 'stripe-user-paid-no-period';
    await seedAccountWithBilling(userId, {
      email: `${userId}@test.com`,
      stripeCustomerId: 'cus_paid_no_period',
      status: 'past_due',
      periodEnd: 1750000000,
    });

    const event = invoiceEvent('evt_paid_2', 'invoice.paid', {
      customer: 'cus_paid_no_period',
      subscription: 'sub_paid_no_period',
      lines: { data: [{ period: null }] },
    });
    const res = await postWebhook(event);
    expect(res.status).toBe(200);

    const account = await getAccount(userId);
    expect(account.subscription_status).toBe('active');
    expect(account.subscription_current_period_end).toBe(1750000000); // unchanged
  });

  it('dedupe: same event.id posted twice → second response is a duplicate, DB written only once', async () => {
    const userId = 'stripe-user-dedupe';
    await seedAccountWithBilling(userId, { email: `${userId}@test.com`, stripeCustomerId: 'cus_dedupe' });

    const first = subscriptionEvent('evt_dedupe_1', 'customer.subscription.updated', {
      customer: 'cus_dedupe',
      status: 'active',
      current_period_end: 1810000000,
    });
    const res1 = await postWebhook(first);
    expect(res1.status).toBe(200);
    const body1 = await res1.json();
    expect(body1.duplicate).toBeFalsy();

    // Same event.id, but a mutated payload (status flipped to 'canceled').
    // If dedupe is keyed purely on event.id, this second delivery must be
    // ignored entirely — proving the DB was written only once.
    const second = subscriptionEvent('evt_dedupe_1', 'customer.subscription.updated', {
      customer: 'cus_dedupe',
      status: 'canceled',
      current_period_end: 1999999999,
    });
    const res2 = await postWebhook(second);
    expect(res2.status).toBe(200);
    const body2 = await res2.json();
    expect(body2.duplicate).toBe(true);

    const account = await getAccount(userId);
    expect(account.subscription_status).toBe('active'); // from the FIRST delivery only
    expect(account.subscription_current_period_end).toBe(1810000000);
  });

  it('invalid signature → 400, no DB change', async () => {
    const userId = 'stripe-user-badsig';
    await seedAccountWithBilling(userId, {
      email: `${userId}@test.com`,
      stripeCustomerId: 'cus_badsig',
      status: 'active',
      periodEnd: 1700000000,
    });

    const event = subscriptionEvent('evt_badsig_1', 'customer.subscription.updated', {
      customer: 'cus_badsig',
      status: 'canceled',
    });
    const res = await postWebhook(event, { sigHeader: 't=1,v1=0000invalidsignature0000' });
    expect(res.status).toBe(400);

    const account = await getAccount(userId);
    expect(account.subscription_status).toBe('active'); // unchanged

    const claim = await env.DB.prepare(
      'SELECT event_id FROM stripe_webhook_events WHERE event_id = ?'
    ).bind('evt_badsig_1').first();
    expect(claim).toBeNull(); // never reached the processing/dedup stage
  });

  it('unmatched customer but sub.metadata.clerk_user_id present → falls back to id match and backfills stripe_customer_id (Gap 2)', async () => {
    const userId = 'stripe-user-fallback';
    // Seeded WITHOUT a stripe_customer_id — simulates the checkout-race /
    // dashboard-created-customer scenario from the brief.
    await seedAccountWithBilling(userId, { email: `${userId}@test.com`, stripeCustomerId: null });

    const event = subscriptionEvent('evt_fallback_1', 'customer.subscription.created', {
      customer: 'cus_unmatched_but_recoverable',
      status: 'active',
      current_period_end: 1820000000,
      metadata: { clerk_user_id: userId },
    });
    const res = await postWebhook(event);
    expect(res.status).toBe(200);

    const account = await getAccount(userId);
    expect(account.subscription_status).toBe('active');
    expect(account.subscription_current_period_end).toBe(1820000000);
    expect(account.stripe_customer_id).toBe('cus_unmatched_but_recoverable'); // backfilled
  });

  it('invoice.payment_failed on a NON-subscription invoice → does NOT write past_due (N5.3)', async () => {
    const userId = 'stripe-user-failed-nonsub';
    await seedAccountWithBilling(userId, {
      email: `${userId}@test.com`,
      stripeCustomerId: 'cus_failed_nonsub',
      status: 'active',
      periodEnd: 1790000000,
    });

    // No `subscription` field at all — a one-off invoice.
    const event = invoiceEvent('evt_failed_nonsub_1', 'invoice.payment_failed', {
      customer: 'cus_failed_nonsub',
      subscription: undefined,
    });
    const res = await postWebhook(event);
    expect(res.status).toBe(200);

    const account = await getAccount(userId);
    expect(account.subscription_status).toBe('active'); // unchanged — must NOT flip to past_due
    expect(account.subscription_current_period_end).toBe(1790000000);
  });

  it('invoice.payment_failed still writes past_due when the invoice IS subscription-linked (regression guard)', async () => {
    const userId = 'stripe-user-failed-sub';
    await seedAccountWithBilling(userId, {
      email: `${userId}@test.com`,
      stripeCustomerId: 'cus_failed_sub',
      status: 'active',
      periodEnd: 1790000000,
    });

    const event = invoiceEvent('evt_failed_sub_1', 'invoice.payment_failed', { customer: 'cus_failed_sub' });
    const res = await postWebhook(event);
    expect(res.status).toBe(200);

    const account = await getAccount(userId);
    expect(account.subscription_status).toBe('past_due');
  });

  it('invoice.paid does NOT resurrect a canceled subscription (N6, out-of-order delivery) — logs benign guard line, NOT UNMATCHED error', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      const userId = 'stripe-user-late-invoice';
      await seedAccountWithBilling(userId, {
        email: `${userId}@test.com`,
        stripeCustomerId: 'cus_late_invoice',
        status: 'canceled',
        periodEnd: 1790000000,
      });

      // A late-retried invoice.paid arrives AFTER customer.subscription.deleted
      // already wrote 'canceled'. This must be refused, not overwrite active.
      const event = invoiceEvent('evt_late_invoice_1', 'invoice.paid', {
        customer: 'cus_late_invoice',
        subscription: 'sub_late',
        lines: { data: [{ period: { start: 1795000000, end: 1799000000 } }] },
      });
      const res = await postWebhook(event);
      expect(res.status).toBe(200);

      const account = await getAccount(userId);
      expect(account.subscription_status).toBe('canceled'); // unchanged
      expect(account.subscription_current_period_end).toBe(1790000000); // unchanged

      // The refusal is a deliberate, benign outcome — it must log its own
      // line and must NOT masquerade as an UNMATCHED-account error.
      const loggedGuardRefusal = logSpy.mock.calls.some(args => String(args[0]).includes('write refused by status guard'));
      const loggedUnmatched = errorSpy.mock.calls.some(args => String(args[0]).includes('UNMATCHED account'));
      expect(loggedGuardRefusal).toBe(true);
      expect(loggedUnmatched).toBe(false);
    } finally {
      logSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });

  it('guarded invoice.paid against a customer with NO matching row → still emits UNMATCHED error (guard probe finds nothing)', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      // No account seeded for this customer at all — the guard probe must
      // find no row and the write must be reported as genuinely unmatched.
      const event = invoiceEvent('evt_guard_unmatched_1', 'invoice.paid', {
        customer: 'cus_no_such_account',
        subscription: 'sub_ghost',
        lines: { data: [{ period: { start: 1795000000, end: 1799000000 } }] },
      });
      const res = await postWebhook(event);
      expect(res.status).toBe(200);

      const loggedGuardRefusal = logSpy.mock.calls.some(args => String(args[0]).includes('write refused by status guard'));
      const loggedUnmatched = errorSpy.mock.calls.some(args => String(args[0]).includes('UNMATCHED account'));
      expect(loggedGuardRefusal).toBe(false);
      expect(loggedUnmatched).toBe(true);
    } finally {
      logSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });

  it('invoice.paid DOES write active when the existing status is NOT canceled (N6 guard is narrow)', async () => {
    const userId = 'stripe-user-invoice-null-status';
    await seedAccountWithBilling(userId, {
      email: `${userId}@test.com`,
      stripeCustomerId: 'cus_invoice_null_status',
      status: null,
      periodEnd: null,
    });

    const event = invoiceEvent('evt_invoice_null_status_1', 'invoice.paid', {
      customer: 'cus_invoice_null_status',
      subscription: 'sub_x',
      lines: { data: [{ period: { start: 1795000000, end: 1799000000 } }] },
    });
    const res = await postWebhook(event);
    expect(res.status).toBe(200);

    const account = await getAccount(userId);
    expect(account.subscription_status).toBe('active');
    expect(account.subscription_current_period_end).toBe(1799000000);
  });

  it('invoice.paid via the basil+ parent.subscription_details shape still refreshes period_end (N7)', async () => {
    const userId = 'stripe-user-basil-invoice';
    await seedAccountWithBilling(userId, {
      email: `${userId}@test.com`,
      stripeCustomerId: 'cus_basil_invoice',
      status: 'past_due',
      periodEnd: 1750000000,
    });

    const event = invoiceEvent('evt_basil_invoice_1', 'invoice.paid', {
      customer: 'cus_basil_invoice',
      subscription: undefined, // legacy field absent — basil+ shape
      parent: { subscription_details: { subscription: 'sub_basil_test' } },
      lines: { data: [{ period: { start: 1795000000, end: 1799500000 } }] },
    });
    const res = await postWebhook(event);
    expect(res.status).toBe(200);

    const account = await getAccount(userId);
    expect(account.subscription_status).toBe('active');
    expect(account.subscription_current_period_end).toBe(1799500000);
  });

  it('unmatched customer, no metadata → 0 rows changed, still 200, error path exercised', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      const event = subscriptionEvent('evt_unmatchable_1', 'customer.subscription.updated', {
        customer: 'cus_totally_unknown',
        status: 'active',
        metadata: {}, // no clerk_user_id — nothing to recover with
      });
      const res = await postWebhook(event);
      expect(res.status).toBe(200);

      const loggedUnmatched = errorSpy.mock.calls.some(args => String(args[0]).includes('UNMATCHED account'));
      expect(loggedUnmatched).toBe(true);
    } finally {
      errorSpy.mockRestore();
    }
  });
});

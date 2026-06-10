import * as Sentry from '@sentry/cloudflare';
import { CORS, BASE_HEADERS, json, checkRateLimit, checkOrigin, canonicalEmail } from './helpers.js';
import { handleAccountRoutes } from './routes/account.js';
import { handleDataRoutes } from './routes/data.js';
import { handleMutableRoutes } from './routes/mutable.js';
import { handleBulkLoad, handleMigrate, handleExport } from './routes/bulk.js';
import { handleBatch } from './routes/batch.js';
import { handleScheduled, handleTrialEmails, handlePreviewEmailForUser } from './routes/email.js';
import { handleStripeRoutes, handleWebhook, reconcileSubscriptions } from './routes/stripe.js';
import { handleTutorRoutes } from './routes/tutor.js';
import { handleClassRoutes } from './routes/classes.js';
import { handleAssignmentRoutes, runLateFlagJob } from './routes/assignments.js';
import { handleNotesRoutes } from './routes/notes.js';
import { handleReportRoutes } from './routes/report.js';
import { handleMessagingRoutes } from './routes/messaging.js';
import { handleRelationshipRoutes } from './routes/relationships.js';
import { handleAdminRoutes } from './routes/admin.js';

// ── Clerk JWT Verification ──

async function verifyClerkJWT(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);

  try {
    const [headerB64] = token.split('.');
    const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')));
    const kid = header.kid;
    if (!kid) return null;

    let jwks;
    if (env.TEST_JWKS) {
      jwks = JSON.parse(env.TEST_JWKS);
    } else {
      const jwksUrl = `https://${env.CLERK_DOMAIN}/.well-known/jwks.json`;
      const jwksResponse = await fetch(jwksUrl, {
        cf: { cacheTtl: 3600, cacheEverything: true },
      });
      if (!jwksResponse.ok) return null;
      jwks = await jwksResponse.json();
    }
    const key = jwks.keys.find(k => k.kid === kid);
    if (!key) return null;

    const cryptoKey = await crypto.subtle.importKey(
      'jwk', key,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false, ['verify']
    );

    const parts = token.split('.');
    const encoder = new TextEncoder();
    const data = encoder.encode(`${parts[0]}.${parts[1]}`);
    const signature = Uint8Array.from(
      atob(parts[2].replace(/-/g, '+').replace(/_/g, '/')),
      c => c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, signature, data);
    if (!valid) return null;

    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    if (payload.nbf && payload.nbf > now + 60) return null;

    // Verify issuer matches our Clerk instance
    const expectedIssuer = `https://${env.CLERK_DOMAIN}`;
    if (payload.iss !== expectedIssuer) return null;

    // Verify authorized party if present (matches our frontend origins)
    if (payload.azp && env.ALLOWED_ORIGINS) {
      const allowed = env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
      if (!allowed.includes(payload.azp)) return null;
    }

    if (!payload.sub) return null;
    // email / email_verified come from the custom Clerk session-token claims.
    // Older tokens issued before the claim was added won't have them — callers
    // that need a verified email must handle that explicitly.
    return {
      userId: payload.sub,
      email: canonicalEmail(payload.email),
      emailVerified: payload.email_verified === true || payload.email_verified === 'true',
    };
  } catch {
    return null;
  }
}

async function requireAuth(request, env) {
  const auth = await verifyClerkJWT(request, env);
  if (!auth) {
    return { error: json({ error: 'Unauthorized' }, 401) };
  }
  return auth; // { userId, email, emailVerified }
}

// Admin gate. Fails CLOSED: if ADMIN_USER_IDS is unset/empty, nobody is admin.
// Keyed on the Clerk userId (the only unforgeable identity), never email.
function parseAdminIds(env) {
  return (env.ADMIN_USER_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
}

async function requireAdmin(request, env) {
  const auth = await requireAuth(request, env);
  if (auth.error) return auth;
  const admins = parseAdminIds(env);
  if (admins.length === 0 || !admins.includes(auth.userId)) {
    return { error: json({ error: 'Forbidden' }, 403) };
  }
  return auth;
}

// Tutor gate. Checks that the caller has an existing tutors row (i.e. has
// completed signup). Revoking a tutor = deleting their tutors row.
async function requireTutorProfile(request, env) {
  const auth = await requireAuth(request, env);
  if (auth.error) return auth;
  const row = await env.DB.prepare('SELECT 1 FROM tutors WHERE id = ?').bind(auth.userId).first();
  if (!row) return { error: json({ error: 'Forbidden' }, 403) };
  return auth;
}

// ── Testing Flags (KV-backed, no auth required) ──

async function getFlags(env) {
  const raw = await env.TESTING_FLAGS.get('all-flags');
  return raw ? JSON.parse(raw) : [];
}

async function handleGetFlags(env) {
  return json(await getFlags(env));
}

async function handlePostFlag(request, env) {
  const flag = await request.json();
  const flags = await getFlags(env);
  flags.push({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    ...flag,
    status: 'pending',
  });
  await env.TESTING_FLAGS.put('all-flags', JSON.stringify(flags));
  return json({ ok: true, count: flags.length });
}

async function handleResolveFlag(request, env) {
  const { flagId } = await request.json();
  const flags = await getFlags(env);
  const updated = flags.filter(f => f.id !== flagId);
  await env.TESTING_FLAGS.put('all-flags', JSON.stringify(updated));
  return json({ ok: true, remaining: updated.length });
}

async function handleMarkFixed(request, env) {
  const { flagId, fixNote } = await request.json();
  const flags = await getFlags(env);
  const updated = flags.map(f =>
    f.id === flagId ? { ...f, status: 'fixed', fixNote: fixNote || '', fixedAt: new Date().toISOString() } : f
  );
  await env.TESTING_FLAGS.put('all-flags', JSON.stringify(updated));
  return json({ ok: true });
}

// ── Shared Testing Coverage (KV-backed, no auth required) ──

const COVERAGE_KEY = 'testing-coverage';
const EMPTY_COVERAGE = { questions: {}, lessons: {} };

async function getCoverage(env) {
  const raw = await env.TESTING_FLAGS.get(COVERAGE_KEY);
  return raw ? JSON.parse(raw) : EMPTY_COVERAGE;
}

async function handleGetCoverage(env) {
  return json(await getCoverage(env));
}

async function handleMarkTested(request, env) {
  const body = await request.json();
  // Batched shape { marks: [{ type, topicKey, ids }] } applies any number of
  // marks with a single KV write. The legacy single-topic shape still works.
  const marks = Array.isArray(body.marks) ? body.marks : [body];

  const valid = marks.filter(m =>
    (m.type === 'questions' || m.type === 'lessons') &&
    m.topicKey && Array.isArray(m.ids) && m.ids.length > 0
  );
  if (valid.length === 0) {
    return json({ error: 'No valid marks — need type, topicKey and ids' }, 400);
  }

  const coverage = await getCoverage(env);
  let changed = false;
  for (const { type, topicKey, ids } of valid) {
    const existing = coverage[type][topicKey] || [];
    const merged = [...new Set([...existing, ...ids])];
    if (merged.length !== existing.length) {
      coverage[type][topicKey] = merged;
      changed = true;
    }
  }

  // Skip the KV write if nothing changed — belt-and-braces against a
  // chatty client re-uploading IDs the store already has.
  if (!changed) {
    return json({ ok: true, noop: true });
  }

  try {
    await env.TESTING_FLAGS.put(COVERAGE_KEY, JSON.stringify(coverage));
  } catch (err) {
    // KV allows ~1 write/second on this key. Tell the client cleanly so it
    // requeues the batch, instead of throwing an unhandled 500.
    return json({ ok: false, error: 'rate_limited' }, 429);
  }
  return json({ ok: true });
}

// ── AI Tutor (Anthropic proxy, auth-gated with per-account daily quota) ──

const TUTOR_MSG_LIMIT = 20;
const TUTOR_SYSTEM_LIMIT = 8000;
const TUTOR_BODY_LIMIT = 50000;

async function checkTutorQuota(env, userId) {
  // Fail open when KV is absent (local dev, test without binding) —
  // mirrors the pattern in helpers.js checkRateLimit.
  if (!env.TUTOR_QUOTA) return null;

  const limit = parseInt(env.TUTOR_DAILY_LIMIT) || 100;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC
  const key = `tutor-quota:${userId}:${today}`;

  const raw = await env.TUTOR_QUOTA.get(key);
  const count = raw ? parseInt(raw, 10) : 0;

  if (count >= limit) {
    return json({ error: 'Daily tutor limit reached', friendly: true }, 429);
  }

  // Increment with a 2-day TTL. Read-before-write race is acceptable per spec.
  await env.TUTOR_QUOTA.put(key, String(count + 1), { expirationTtl: 172800 });
  return null;
}

async function handleTutor(request, env) {
  // ── Auth gate ──
  const auth = await requireAuth(request, env);
  if (auth.error) return auth.error;

  // ── Input validation ──
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { system, messages } = body;

  if (!system || typeof system !== 'string' || !messages || !Array.isArray(messages)) {
    return json({ error: 'Missing system or messages' }, 400);
  }
  if (system.length > TUTOR_SYSTEM_LIMIT) {
    return json({ error: `system must be ≤ ${TUTOR_SYSTEM_LIMIT} characters` }, 400);
  }
  if (messages.length > TUTOR_MSG_LIMIT) {
    return json({ error: `messages must be ≤ ${TUTOR_MSG_LIMIT} entries` }, 400);
  }
  if (JSON.stringify(body).length > TUTOR_BODY_LIMIT) {
    return json({ error: `Request body must be ≤ ${TUTOR_BODY_LIMIT} bytes` }, 400);
  }

  // ── Per-account daily quota ──
  const quotaBlock = await checkTutorQuota(env, auth.userId);
  if (quotaBlock) return quotaBlock;

  // ── Proxy to Anthropic ──
  let response;
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system,
        messages,
      }),
    });
  } catch {
    return json({ error: 'Tutor service unavailable' }, 502);
  }

  if (!response.ok) {
    let errMsg = 'Tutor service unavailable';
    try {
      const errData = await response.json();
      errMsg = errData.error?.message || errMsg;
    } catch { /* non-JSON upstream error — use default message */ }
    return json({ error: errMsg }, 502);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    return json({ error: 'Tutor service unavailable' }, 502);
  }

  return json(data);
}

// ── Router ──

const worker = {
  async fetch(request, env) {
    // Origin allowlist gate — browser requests from unknown origins get
    // 403 before any routing. Skips silently for server-to-server calls
    // (no Origin header).
    const originBlocked = checkOrigin(request, env);
    if (originBlocked) return originBlocked;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: BASE_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // ── Public routes (no auth) ──

      if (path === '/flags' && request.method === 'GET') return handleGetFlags(env);
      if (path === '/flags' && request.method === 'POST') {
        const auth = await requireAuth(request, env);
        if (auth.error) return auth.error;
        return handlePostFlag(request, env);
      }
      if (path === '/flags/resolve' && request.method === 'POST') {
        const admin = await requireAdmin(request, env);
        if (admin.error) return admin.error;
        return handleResolveFlag(request, env);
      }
      if (path === '/flags/fix' && request.method === 'POST') {
        const admin = await requireAdmin(request, env);
        if (admin.error) return admin.error;
        return handleMarkFixed(request, env);
      }

      // Shared testing coverage
      if (path === '/testing-coverage' && request.method === 'GET') return handleGetCoverage(env);
      if (path === '/testing-coverage/mark' && request.method === 'POST') {
        const auth = await requireAuth(request, env);
        if (auth.error) return auth.error;
        return handleMarkTested(request, env);
      }

      // Error reporting — public (no auth required, fire-and-forget from client)
      if (path === '/api/error-report' && request.method === 'POST') {
        const limited = await checkRateLimit(env.ERROR_LIMITER, request, 'error-report');
        if (limited) return limited;
        const body = await request.json();
        const entry = {
          message: body.message,
          stack: body.stack?.substring(0, 500),
          url: body.url,
          user: body.user,
          source: body.source,
          timestamp: body.timestamp,
        };
        console.error('[CLIENT ERROR]', JSON.stringify(entry));

        // Persist to KV so /errors dashboard can surface them. Ring buffer
        // of last 50 — oldest dropped when full. Client-side throttle in
        // ErrorBoundary caps this at 10/session + dedupe, so KV writes are
        // bounded even in a render-loop scenario.
        try {
          const raw = await env.TESTING_FLAGS.get('recent-errors');
          const errors = raw ? JSON.parse(raw) : [];
          errors.push({ id: Date.now(), ...entry });
          const trimmed = errors.slice(-50);
          await env.TESTING_FLAGS.put('recent-errors', JSON.stringify(trimmed));
        } catch {}

        return json({ ok: true });
      }

      // Recent errors read — public (dashboard surfaces this)
      if (path === '/errors' && request.method === 'GET') {
        const raw = await env.TESTING_FLAGS.get('recent-errors');
        return json(raw ? JSON.parse(raw) : []);
      }
      if (path === '/errors/clear' && request.method === 'POST') {
        const admin = await requireAdmin(request, env);
        if (admin.error) return admin.error;
        await env.TESTING_FLAGS.put('recent-errors', '[]');
        return json({ ok: true });
      }

      // Public tutor profile — no auth required (join page preview)
      if (path.startsWith('/api/tutor/public/') && request.method === 'GET') {
        return handleTutorRoutes(request, env, null, path);
      }

      // AI tutor — backward compatible POST to root
      if (request.method === 'POST' && !path.startsWith('/api/')) {
        const limited = await checkRateLimit(env.TUTOR_LIMITER, request, 'tutor');
        if (limited) return limited;
        return handleTutor(request, env);
      }

      // Stripe webhook — public (signature-verified in handler).
      // Must match before the JWT auth gate because Stripe doesn't send
      // a bearer token, only the stripe-signature header.
      if (path === '/api/stripe/webhook' && request.method === 'POST') {
        return handleWebhook(request, env);
      }

      // ── Admin routes — owner-only, fail-closed (must precede the generic
      //    /api/ gate since these paths also start with /api/). ──
      if (path.startsWith('/api/admin/')) {
        const admin = await requireAdmin(request, env);
        if (admin.error) return admin.error;
        const adminResult = await handleAdminRoutes(request, env, admin, path);
        if (adminResult) return adminResult;
        return json({ error: 'Admin route not found', path }, 404);
      }

      // ── Tutor routes ──
      // Signup (POST /api/tutor) and parent join (POST /api/tutor/join) only
      // need a valid Clerk session — no tutor profile required yet.
      // All other tutor routes require requireTutorProfile (has a tutors row).
      // Public preview (/api/tutor/public/*) is handled above, before any auth.
      if (path === '/api/tutor' && request.method === 'POST') {
        const auth = await requireAuth(request, env);
        if (auth.error) return auth.error;
        const tutorResult = await handleTutorRoutes(request, env, auth.userId, path);
        if (tutorResult) return tutorResult;
        return json({ error: 'Tutor route not found', path }, 404);
      }
      if (path === '/api/tutor/join' && request.method === 'POST') {
        const auth = await requireAuth(request, env);
        if (auth.error) return auth.error;
        const tutorResult = await handleTutorRoutes(request, env, auth.userId, path);
        if (tutorResult) return tutorResult;
        return json({ error: 'Tutor route not found', path }, 404);
      }
      if (path.startsWith('/api/tutor')) {
        const auth = await requireTutorProfile(request, env);
        if (auth.error) return auth.error;
        const tutorResult = await handleTutorRoutes(request, env, auth.userId, path);
        if (tutorResult) return tutorResult;

        // Sub-routes not handled by handleTutorRoutes — dispatch here so they
        // are still covered by the requireTutorProfile gate above. These handlers
        // do their own internal tutor-existence checks as defence-in-depth but
        // the outer gate is the primary auth boundary.
        const classResult = await handleClassRoutes(request, env, auth.userId, path);
        if (classResult) return classResult;

        const assignResult = await handleAssignmentRoutes(request, env, auth.userId, path);
        if (assignResult) return assignResult;

        const notesResult = await handleNotesRoutes(request, env, auth.userId, path);
        if (notesResult) return notesResult;

        const reportResult = await handleReportRoutes(request, env, auth.userId, path);
        if (reportResult) return reportResult;

        const messagingResult = await handleMessagingRoutes(request, env, auth.userId, path);
        if (messagingResult) return messagingResult;

        const relResult = await handleRelationshipRoutes(request, env, auth.userId, path);
        if (relResult) return relResult;

        return json({ error: 'Tutor route not found', path }, 404);
      }

      // ── Auth-protected routes (/api/*) ──

      if (path.startsWith('/api/')) {
        const auth = await requireAuth(request, env);
        if (auth.error) return auth.error;
        const userId = auth.userId;

        // Bulk load (single round-trip on login)
        if (path === '/api/data/all' && request.method === 'GET') {
          return handleBulkLoad(request, env, userId);
        }

        // Migration
        if (path === '/api/data/migrate' && request.method === 'POST') {
          return handleMigrate(request, env, userId);
        }

        // Export (GDPR)
        if (path === '/api/data/export' && request.method === 'GET') {
          return handleExport(request, env, userId);
        }

        // Account routes
        const accountResult = await handleAccountRoutes(request, env, userId, path);
        if (accountResult) return accountResult;

        // Tutor routes (/api/tutor*) are handled above, behind requireTutor.

        // Class management routes
        const classResult = await handleClassRoutes(request, env, userId, path);
        if (classResult) return classResult;

        // Assignment routes (tutor-facing + parent-facing)
        const assignResult = await handleAssignmentRoutes(request, env, userId, path);
        if (assignResult) return assignResult;

        // Tutor private notes
        const notesResult = await handleNotesRoutes(request, env, userId, path);
        if (notesResult) return notesResult;

        // Report generation
        const reportResult = await handleReportRoutes(request, env, userId, path);
        if (reportResult) return reportResult;

        // Messaging (tutor ↔ parent, polled)
        const messagingResult = await handleMessagingRoutes(request, env, userId, path);
        if (messagingResult) return messagingResult;

        // Relationship management + bulk invite
        const relResult = await handleRelationshipRoutes(request, env, userId, path);
        if (relResult) return relResult;

        // Stripe subscribe + portal (auth-required)
        const stripeResult = await handleStripeRoutes(request, env, userId, path);
        if (stripeResult) return stripeResult;

        // Dev: preview/send trial or weekly email to your own Gmail/Outlook for visual QA.
        // Body: { day: 1|7|14|21|25|28|30, to?: "test@gmail.com" }
        // Uses the authenticated user's account data; sends to `to` (default: own email).
        if (path === '/api/dev/preview-email' && request.method === 'POST') {
          const body = await request.json().catch(() => ({}));
          const day = Number(body.day);
          const to = body.to || null;
          if (!day) return json({ error: 'Missing day' }, 400);
          const result = await handlePreviewEmailForUser(env, userId, day, to);
          if (result.error) return json(result, 400);
          return json(result);
        }

        // Batch write endpoint (D1-first architecture)
        if (path === '/api/data/batch' && request.method === 'POST') {
          return await handleBatch(request, env, userId);
        }

        // Append-only data routes
        const dataResult = await handleDataRoutes(request, env, userId, path);
        if (dataResult) return dataResult;

        // Mutable data routes (versioned)
        const mutableResult = await handleMutableRoutes(request, env, userId, path);
        if (mutableResult) return mutableResult;

        return json({ error: 'API route not found', path, method: request.method }, 404);
      }

      return new Response('Not found', { status: 404, headers: BASE_HEADERS });
    } catch (err) {
      // Detail goes to logs/Sentry only — never leak internals (stack, query
      // text) to the client, especially on the admin surface.
      console.error('[Worker Error]', err.message, err.stack);
      return json({ error: 'Internal server error' }, 500);
    }
  },

  // Cron triggers — dispatched on event.cron pattern.
  //   "0 18 * * SUN" — weekly progress emails (Sunday 18:00 UTC)
  //   "0 6 * * *"    — daily Stripe reconciliation (06:00 UTC)
  async scheduled(event, env, ctx) {
    if (event.cron === '0 18 * * SUN') {
      ctx.waitUntil(handleScheduled(env));
    } else if (event.cron === '0 6 * * *') {
      ctx.waitUntil(Promise.all([
        reconcileSubscriptions(env).catch(err => console.error('[reconciliation] failed:', err.message)),
        handleTrialEmails(env).catch(err => console.error('[trial-email] failed:', err.message)),
      ]));
    }
  },
};

// Wrap with Sentry if DSN is configured; fall back to bare worker otherwise.
// No-ops cleanly when SENTRY_DSN is not set (local dev, pre-setup).
export default {
  async fetch(request, env, ctx) {
    if (!env.SENTRY_DSN) return worker.fetch(request, env, ctx);
    return Sentry.withSentry(
      () => ({ dsn: env.SENTRY_DSN, tracesSampleRate: 0 }),
      worker,
    ).fetch(request, env, ctx);
  },
  async scheduled(event, env, ctx) {
    if (!env.SENTRY_DSN) return worker.scheduled(event, env, ctx);
    return Sentry.withSentry(
      () => ({ dsn: env.SENTRY_DSN, tracesSampleRate: 0 }),
      worker,
    ).scheduled(event, env, ctx);
  },
};

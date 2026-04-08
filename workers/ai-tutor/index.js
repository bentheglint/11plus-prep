import { CORS, json } from './helpers.js';
import { handleAccountRoutes } from './routes/account.js';
import { handleDataRoutes } from './routes/data.js';
import { handleMutableRoutes } from './routes/mutable.js';
import { handleBulkLoad, handleMigrate, handleExport } from './routes/bulk.js';
import { handleScheduled } from './routes/email.js';

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

    const jwksUrl = `https://${env.CLERK_DOMAIN}/.well-known/jwks.json`;
    const jwksResponse = await fetch(jwksUrl, {
      cf: { cacheTtl: 3600, cacheEverything: true },
    });
    if (!jwksResponse.ok) return null;

    const jwks = await jwksResponse.json();
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

    return payload.sub;
  } catch {
    return null;
  }
}

async function requireAuth(request, env) {
  const userId = await verifyClerkJWT(request, env);
  if (!userId) {
    return { error: json({ error: 'Unauthorized' }, 401) };
  }
  return { userId };
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

// ── AI Tutor (Anthropic proxy, no auth required) ──

async function handleTutor(request, env) {
  const { system, messages } = await request.json();

  if (!system || !messages || !Array.isArray(messages)) {
    return json({ error: 'Missing system or messages' }, 400);
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
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

  const data = await response.json();

  if (!response.ok) {
    return json({ error: data.error?.message || 'API error' }, response.status);
  }

  return json(data);
}

// ── Router ──

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // ── Public routes (no auth) ──

      if (path === '/flags' && request.method === 'GET') return handleGetFlags(env);
      if (path === '/flags' && request.method === 'POST') return handlePostFlag(request, env);
      if (path === '/flags/resolve' && request.method === 'POST') return handleResolveFlag(request, env);
      if (path === '/flags/fix' && request.method === 'POST') return handleMarkFixed(request, env);

      // AI tutor — backward compatible POST to root
      if (request.method === 'POST' && !path.startsWith('/api/')) {
        return handleTutor(request, env);
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

        // Append-only data routes
        const dataResult = await handleDataRoutes(request, env, userId, path);
        if (dataResult) return dataResult;

        // Mutable data routes (versioned)
        const mutableResult = await handleMutableRoutes(request, env, userId, path);
        if (mutableResult) return mutableResult;

        return json({ error: 'API route not found', path, method: request.method }, 404);
      }

      return new Response('Not found', { status: 404, headers: CORS });
    } catch (err) {
      return json({ error: 'Internal server error', detail: err.message }, 500);
    }
  },

  // Cron trigger — weekly progress emails (Sunday 18:00 UTC)
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleScheduled(env));
  },
};

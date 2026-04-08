const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

// ── Clerk JWT Verification ──
// Verifies the Clerk session JWT from the Authorization header.
// Returns the Clerk userId on success, or null on failure.

async function verifyClerkJWT(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);

  try {
    // Decode the JWT header to get the key ID (kid)
    const [headerB64] = token.split('.');
    const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')));
    const kid = header.kid;
    if (!kid) return null;

    // Fetch Clerk's JWKS (JSON Web Key Set) — cached by CF for performance
    const jwksUrl = `https://${env.CLERK_DOMAIN}/.well-known/jwks.json`;
    const jwksResponse = await fetch(jwksUrl, {
      cf: { cacheTtl: 3600, cacheEverything: true },
    });
    if (!jwksResponse.ok) return null;

    const jwks = await jwksResponse.json();
    const key = jwks.keys.find(k => k.kid === kid);
    if (!key) return null;

    // Import the public key and verify the JWT signature
    const cryptoKey = await crypto.subtle.importKey(
      'jwk', key,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false, ['verify']
    );

    // Split token and verify signature
    const parts = token.split('.');
    const encoder = new TextEncoder();
    const data = encoder.encode(`${parts[0]}.${parts[1]}`);
    const signature = Uint8Array.from(
      atob(parts[2].replace(/-/g, '+').replace(/_/g, '/')),
      c => c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, signature, data);
    if (!valid) return null;

    // Decode payload and check expiry
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    if (payload.nbf && payload.nbf > now + 60) return null;

    return payload.sub; // Clerk userId
  } catch {
    return null;
  }
}

// Middleware: require auth and return userId, or respond with 401
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

// ── API Route Placeholders (auth-protected, implemented in Phase 2) ──

async function handleApiRoute(request, env, userId, path) {
  // Phase 2 will implement these routes. For now, return the route info
  // so we can verify the auth middleware is working.
  return json({
    message: 'API route not yet implemented',
    route: path,
    method: request.method,
    userId,
  }, 501);
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

      // Flag routes
      if (path === '/flags' && request.method === 'GET') {
        return handleGetFlags(env);
      }
      if (path === '/flags' && request.method === 'POST') {
        return handlePostFlag(request, env);
      }
      if (path === '/flags/resolve' && request.method === 'POST') {
        return handleResolveFlag(request, env);
      }
      if (path === '/flags/fix' && request.method === 'POST') {
        return handleMarkFixed(request, env);
      }

      // AI tutor — backward compatible POST to root (no /api prefix)
      if (request.method === 'POST' && !path.startsWith('/api/')) {
        return handleTutor(request, env);
      }

      // ── Auth-protected routes (/api/*) ──

      if (path.startsWith('/api/')) {
        const auth = await requireAuth(request, env);
        if (auth.error) return auth.error;

        return handleApiRoute(request, env, auth.userId, path);
      }

      return new Response('Not found', { status: 404, headers: CORS });
    } catch (err) {
      return json({ error: 'Internal server error' }, 500);
    }
  },
};

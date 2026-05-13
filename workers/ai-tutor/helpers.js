// ── Shared helpers ──

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'no-referrer',
};

const BASE_HEADERS = { ...CORS, ...SECURITY_HEADERS };

export { CORS, SECURITY_HEADERS, BASE_HEADERS };

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...BASE_HEADERS },
  });
}

// Get the child ID for an authenticated user. Returns null if no child profile.
export async function getChildId(db, userId) {
  const row = await db.prepare('SELECT id FROM children WHERE account_id = ? ORDER BY created_at ASC').bind(userId).first();
  return row ? row.id : null;
}

// Resolve which child to use for a request. If requestedChildId is provided,
// verifies it belongs to the userId and returns it. Otherwise falls back to
// the first child (backwards-compat for single-child accounts).
export async function resolveChildId(db, userId, requestedChildId) {
  if (requestedChildId) {
    const row = await db.prepare(
      'SELECT id FROM children WHERE id = ? AND account_id = ?'
    ).bind(requestedChildId, userId).first();
    return row ? row.id : null;
  }
  return getChildId(db, userId);
}

// Origin allowlist check — blocks browser requests from unknown origins
// at the edge before any route logic runs. Server-to-server requests
// (Stripe webhook, curl, scheduled tasks) have no Origin header and pass
// through untouched; only browsers attach it.
//
// If ALLOWED_ORIGINS is unset, all origins are allowed (backward-compat
// for pre-rollout state). Set it to a comma-separated list to enforce.
// Example: "https://prepstep.co.uk,https://www.prepstep.co.uk,https://11plus-prep.pages.dev,http://localhost:3000".
export function checkOrigin(request, env) {
  const origin = request.headers.get('Origin');
  if (!origin) return null; // no Origin = not a browser request
  const configured = (env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
  if (configured.length === 0) return null; // not configured, allow all
  if (configured.includes('*')) return null;
  if (configured.includes(origin)) return null;
  return new Response('Forbidden origin', {
    status: 403,
    headers: { 'Content-Type': 'text/plain', ...SECURITY_HEADERS },
  });
}

// Check a rate-limit binding keyed by client IP. Returns a 429 Response
// if the caller is over the limit, otherwise returns null.
export async function checkRateLimit(limiter, request, label) {
  if (!limiter) return null;
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const { success } = await limiter.limit({ key: ip });
  if (success) return null;
  return new Response(
    JSON.stringify({ error: `Rate limit exceeded (${label}). Try again in a minute.` }),
    {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '60', ...BASE_HEADERS },
    }
  );
}

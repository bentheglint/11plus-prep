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
  const row = await db.prepare('SELECT id FROM children WHERE account_id = ?').bind(userId).first();
  return row ? row.id : null;
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
